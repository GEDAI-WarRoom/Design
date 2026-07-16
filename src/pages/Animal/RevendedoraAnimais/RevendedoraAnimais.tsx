import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Eye as ViewIcon, Pencil, Dna, Check, Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US072)
// ==========================================================
const TIPOS_PESSOA = [
  { value: "Pessoa física", label: "Pessoa física" },
  { value: "Pessoa jurídica", label: "Pessoa jurídica" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Contagem",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Timóteo", "Uberlândia", "Varginha",
];

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================
interface ProprietarioEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "Pessoa física" | "Pessoa jurídica";
}
const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "Pessoa jurídica" },
];

interface EspecieEntidade {
  id: number;
  nome: string;
  grupo: string;
}
const ESPECIES_MOCK: EspecieEntidade[] = [
  { id: 1, nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, nome: "Codorna", grupo: "Aves" },
  { id: 3, nome: "Suíno", grupo: "Suídeos" },
  { id: 4, nome: "Equino", grupo: "Equídeos" },
];

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Pessoa { nome: string; documento: string }
interface Revendedora {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: Pessoa[];
  grupo: string;
  especie: string;
  municipio: string;
  uf: string;
  situacao: "Ativo" | "Inativo";
}

const REVENDEDORAS_MOCK: Revendedora[] = [
  {
    id: 1, codigo: "3123659848", nome: "Revendedora São José",
    proprietarios: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }],
    grupo: "Aves", especie: "Codorna", municipio: "Lavras", uf: "MG", situacao: "Ativo",
  },
  {
    id: 2, codigo: "3106200018", nome: "Revendedora Vale Verde",
    proprietarios: [
      { nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
      { nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
    ],
    grupo: "Bovídeos", especie: "Bovino", municipio: "Belo Horizonte", uf: "MG", situacao: "Inativo",
  },
];

// ==========================================================
// UI HELPERS
// ==========================================================
type SortKey = "nome" | "municipio" | "situacao";
type SortDir = "asc" | "desc";

function SortHeader({ label, ativo, dir, onClick, className = "", sortable = true }: { label: string; ativo: boolean; dir: SortDir; onClick: () => void; className?: string; sortable?: boolean }) {
  if (!sortable) return <th className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal ${className}`}>{label}</th>;
  return (
    <th className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal ${className}`}>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-gray-800 transition text-left">
        {label}
        {ativo ? (dir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUp size={13} className="text-gray-300" />}
      </button>
    </th>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">×</button>
    </div>
  );
}

function SituacaoBadge({ situacao }: { situacao: Revendedora["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function CelulaPessoas({ pessoas }: { pessoas: Pessoa[] }) {
  if (!pessoas.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="text-sm text-gray-500 whitespace-normal">
      <div>{pessoas[0].documento}</div>
      <div>{pessoas[0].nome}</div>
      {pessoas.length > 1 && <div className="text-xs text-gray-400 font-medium mt-0.5">+ {pessoas.length - 1} selecionado(s)</div>}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function RevendedoraAnimaisPage({ onLogout, onNavigate }: PageProps) {
  // ---- Busca principal ----
  const [busca, setBusca] = useState(""); // Código ou Nome

  // ---- Filtros ----
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null);
    const [modalProprietario, setModalProprietario] = useState(false); 

  const [especie, setEspecie] = useState<EspecieEntidade | null>(null);
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  // ---- Modais ----
  const [modalEspecie, setModalEspecie] = useState(false);

  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // ---- Ordenação (padrão: nome asc) ----
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

   const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(
    (p) => p.tipo === tipoPessoa
  );

    const colunasModal = [
    { 
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social", 
      key: "nome" 
    },
    { 
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ", 
      key: "documento" 
    }
  ];

  // Proprietários pré-filtrados pelo Tipo de Pessoa
  const proprietariosFiltrados = PROPRIETARIOS_MOCK.filter((p) => !tipoPessoa || p.tipo === tipoPessoa);

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtrados = REVENDEDORAS_MOCK.filter((r) => {
    const q = busca.trim().toLowerCase();
    const matchBusca = q === "" || r.codigo.includes(busca.trim()) || r.nome.toLowerCase().includes(q);
    const matchProp = !proprietario || r.proprietarios.some((p) => p.documento === proprietario.documento);
    const matchEspecie = !especie || r.especie === especie.nome;
    const matchMunicipio = municipio === "" || r.municipio === municipio;
    const matchSituacao = situacao === "" || r.situacao === situacao;
    return matchBusca && matchProp && matchEspecie && matchMunicipio && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[sortKey]).toLowerCase();
    const vb = String(b[sortKey]).toLowerCase();
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = proprietario || especie || municipio || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora-animais-vivos" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Revendedora de Animais Vivos</h1>
            <button onClick={() => onNavigate("adicionar-revendedora-animais")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Código ou Nome da Revendedora de Animais Vivos
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
                      <FloatInput
                label="Proprietário"
                value={proprietario ? `${proprietario.nome} ` : ""}
                icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} 
                onClick={() => setModalProprietario(true)}
                readOnly
              />  
                </div>
                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Espécie"
                    value={especie ? especie.nome : ""}
                    icon={<Dna size={16} className="text-[#1A7A3C]" />}
                    onClick={() => setModalEspecie(true)}
                    readOnly
                  />
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
                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por revendedora utilizando o campo de busca e os filtros acima.</p>
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
                    <tr className="border-b border-gray-100">
                      <SortHeader label="Código" ativo={false} dir={sortDir} onClick={() => {}} sortable={false} className="max-w-[120px]" />
                      <SortHeader label="Nome" ativo={sortKey === "nome"} dir={sortDir} onClick={() => toggleSort("nome")} className="max-w-[190px]" />
                      <SortHeader label="Proprietários" ativo={false} dir={sortDir} onClick={() => {}} sortable={false} className="max-w-[190px]" />
                      <SortHeader label="Grupo - Espécie" ativo={false} dir={sortDir} onClick={() => {}} sortable={false} className="max-w-[140px]" />
                      <SortHeader label="Município - UF" ativo={sortKey === "municipio"} dir={sortDir} onClick={() => toggleSort("municipio")} className="max-w-[140px]" />
                      <SortHeader label="Situação" ativo={sortKey === "situacao"} dir={sortDir} onClick={() => toggleSort("situacao")} className="max-w-[100px]" />
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.codigo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><CelulaPessoas pessoas={r.proprietarios} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.grupo} - {r.especie}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{r.municipio}</div>
                          <div>{r.uf}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-revendedora-animais-vivos", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-revendedora-animais-vivos", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
        onClose={() => {
          setModalProprietario(false);
          setTipoPessoa("Pessoa física");
        }}
        title="Buscar Proprietário"
        subtitle="Busque por um proprietário cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl || Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />} 
        data={proprietariosFiltradosModal}
        columns={colunasModal} // INSERIDO AQUI CONFORME SOLICITADO
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Proprietário"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProprietario(p);
          setModalProprietario(false);
        }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "Pessoa física", label: "Pessoa Física" },
              { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />

      {/* Modal Espécie (busca por Nome ou Grupo) */}
      <SearchModal<EspecieEntidade>
        open={modalEspecie}
        onClose={() => setModalEspecie(false)}
        title="Buscar Espécie"
        subtitle="Busque por uma espécie cadastrada no sistema:"
        icon={<Dna size={28} className="text-[#1A7A3C]" />}
        data={ESPECIES_MOCK}
        columns={[{ label: "Nome da Espécie", key: "nome" }, { label: "Grupo da Espécie", key: "grupo" }]}
        searchKeys={["nome", "grupo"]}
        searchPlaceholder="Buscar por Nome da Espécie ou Grupo"
        confirmLabel="Confirmar"
        onConfirm={(e) => { setEspecie(e); setModalEspecie(false); }}
      />
    </div>
  );
}