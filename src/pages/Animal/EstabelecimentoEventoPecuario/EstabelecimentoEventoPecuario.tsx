import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
  PauseCircle,
  Building2,
  MapPin,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US056)
// ==========================================================
const TIPOS_ESTABELECIMENTO = [
  { value: "Parque de exposição", label: "Parque de exposição" },
  { value: "Tatersal para leilões", label: "Tatersal para leilões" },
  { value: "Estrutura temporária", label: "Estrutura temporária" },
  { value: "Outro", label: "Outro" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Timóteo", "Varginha",
];

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================
interface ProprietarioEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
  { id: 4, nome: "Carlos Henrique Souza", documento: "333.888.777-11", tipo: "PF" },
];

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Pessoa { nome: string; documento: string }
interface Estabelecimento {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  proprietarios: Pessoa[];
  municipio: string;
  uf: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const ESTABELECIMENTOS_MOCK: Estabelecimento[] = [
  {
    id: 1, codigo: "3100104005", nome: "Casarão São José", tipo: "Parque de exposição",
    proprietarios: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }],
    municipio: "Lavras", uf: "MG", situacao: "Ativo",
  },
  {
    id: 2, codigo: "3106200018", nome: "Recinto Vale Verde", tipo: "Tatersal para leilões",
    proprietarios: [
      { nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
    ],
    municipio: "Belo Horizonte", uf: "MG", situacao: "Suspenso",
  },
  {
    id: 3, codigo: "3106705023", nome: "Clube Rural Timóteo", tipo: "Outro",
    proprietarios: [{ nome: "Carlos Henrique Souza", documento: "333.888.777-11" }],
    municipio: "Timóteo", uf: "MG", situacao: "Inativo",
  },
];

// ==========================================================
// UI HELPERS (padrão do projeto)
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Estabelecimento["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
    Suspenso: { bg: "#FEF3E2", border: "#FCD9A3", text: "#B45309", Icon: PauseCircle },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

function CelulaPessoas({ pessoas }: { pessoas: Pessoa[] }) {
  if (pessoas.length === 0) return <span className="text-gray-400">—</span>;
  return (
    <div className="text-sm text-gray-500 whitespace-normal">
      <div>{pessoas[0].documento}</div>
      <div>{pessoas[0].nome}</div>
      {pessoas.length > 1 && (
        <div className="text-xs text-gray-400 font-medium mt-0.5">+ {pessoas.length - 1} selecionado(s)</div>
      )}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EstabelecimentoEventoPecuarioPage({ onLogout, onNavigate }: PageProps) {
  // ---- Filtros ----
  const [busca, setBusca] = useState(""); // Código ou Nome
  const [tipo, setTipo] = useState("");
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null);
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  // ---- Modal proprietário ----
  const [modalProprietario, setModalProprietario] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const databaseFiltrada = PROPRIETARIOS_MOCK.filter((p) => {
    if (!tipoPessoa) return true;
    return p.tipo === tipoPessoa;
  });

  const filtrados = ESTABELECIMENTOS_MOCK.filter((e) => {
    const q = busca.trim().toLowerCase();
    const matchBusca = q === "" || e.codigo.includes(busca.trim()) || e.nome.toLowerCase().includes(q);
    const matchTipo = tipo === "" || e.tipo === tipo;
    const matchProp = !proprietario || e.proprietarios.some((p) => p.documento === proprietario.documento);
    const matchMunicipio = municipio === "" || e.municipio === municipio;
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchBusca && matchTipo && matchProp && matchMunicipio && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = tipo || proprietario || municipio || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-recinto-eventos" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Estabelecimentos/Recintos de Eventos Pecuários</h1>
            <button onClick={() => onNavigate("adicionar-estabelecimento-evento-pecuario")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro (Código/Nome + toggle) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Código ou Nome do Estabelecimento/Recinto
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              {/* FILEIRA 1 */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatSelect label="Tipo de Estabelecimento/Recinto" value={tipo} onChange={setTipo} options={TIPOS_ESTABELECIMENTO} />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Proprietário"
                    value={proprietario ? proprietario.nome : ""}
                    icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />}
                    onClick={() => setModalProprietario(true)}
                    readOnly
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                </div>

                {/* Botão Pesquisar */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* FILEIRA 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => setTipo("")} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por estabelecimento/recinto utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto ">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[110px]">Código</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[180px]">Nome</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[160px]">Tipo</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[180px]">Proprietários</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[140px]">Município - UF</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">Situação</th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.codigo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.tipo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm"><CelulaPessoas pessoas={e.proprietarios} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{e.municipio}</div>
                          <div>{e.uf}</div>
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-normal">{e.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-estabelecimento-recinto-eventos", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-estabelecimento-recinto-eventos", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal do Proprietário */}
      <SearchModal<ProprietarioEntidade>
        open={modalProprietario}
        onClose={() => { setModalProprietario(false); setTipoPessoa(""); }}
        title="Buscar Proprietário"
        subtitle="Busque por um proprietário cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />}
        data={databaseFiltrada}
        columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "CPF / CNPJ", key: "documento" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar por Nome/Razão Social ou CPF/CNPJ"
        confirmLabel="Confirmar"
        onConfirm={(p) => { setProprietario(p); setModalProprietario(false); setTipoPessoa(""); }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "PF", label: "Pessoa Física" },
              { value: "PJ", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />
    </div>
  );
}