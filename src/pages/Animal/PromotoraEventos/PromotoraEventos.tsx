import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Eye as ViewIcon, Pencil, Building2,
  Check, Minus, PauseCircle,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US059)
// ==========================================================
const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte", "Contagem", "Esmeraldas", "Lavras", "Uberlândia", "Varginha"],
  "São Paulo": ["Campinas", "Guarulhos", "Santos", "São Paulo", "Sorocaba"],
  "Paraná": ["Cascavel", "Curitiba", "Londrina", "Maringá", "Toledo"],
};

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

// ==========================================================
// MOCK: Proprietários (Pessoas Jurídicas — ver US044)
// ==========================================================
interface ProprietarioPJ {
  id: number;
  nomeFantasia: string;
  cnpj: string;
}

const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física" },
  { id: 3, nome: "Agro Cooperativa IMA", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica" },
];

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Promotora {
  id: number;
  numeroRegistro: string;
  nome: string;
  proprietarioNomeFantasia: string;
  proprietarioCnpj: string;
  estado: string;
  municipio: string;
  uf: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const PROMOTORAS_MOCK: Promotora[] = [
  { id: 1, numeroRegistro: "99970948", nome: "Promotora São José", proprietarioNomeFantasia: "Promotora São José", proprietarioCnpj: "72.375.545/0001-93", estado: "Minas Gerais", municipio: "Lavras", uf: "MG", situacao: "Ativo" },
  { id: 2, numeroRegistro: "88820133", nome: "Eventos Agro Brasil", proprietarioNomeFantasia: "Eventos Agro Brasil", proprietarioCnpj: "56.338.814/0001-95", estado: "Minas Gerais", municipio: "Belo Horizonte", uf: "MG", situacao: "Suspenso" },
  { id: 3, numeroRegistro: "77712045", nome: "Rural Shows", proprietarioNomeFantasia: "Rural Shows Ltda.", proprietarioCnpj: "12.345.678/0001-90", estado: "São Paulo", municipio: "Campinas", uf: "SP", situacao: "Inativo" },
];

// ==========================================================
// UI HELPERS
// ==========================================================
type SortKey = "numeroRegistro" | "nome" | "municipio" | "situacao";
type SortDir = "asc" | "desc";

function SortHeader({ label, ativo, dir, onClick, className = "", sortable = true }: { label: string; ativo: boolean; dir: SortDir; onClick: () => void; className?: string; sortable?: boolean }) {
  if (!sortable) {
    return <th className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal ${className}`}>{label}</th>;
  }
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

function SituacaoBadge({ situacao }: { situacao: Promotora["situacao"] }) {
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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function PromotoraEventosPage({ onLogout, onNavigate }: PageProps) {
  // ---- Busca principal ----
  const [busca, setBusca] = useState(""); // Número do Registro ou Nome

  // ---- Filtros ----
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física"); 
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null); 
  const [modalProprietario, setModalProprietario] = useState(false); 
  const [estado, setEstado] = useState("Minas Gerais"); // obrigatório, padrão MG
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");


  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroEstado, setErroEstado] = useState(false);
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

  const municipiosDisponiveis = estado ? (MUNICIPIOS_POR_ESTADO[estado] || []) : [];

  const handlePesquisar = () => {
    // Estado é obrigatório (US059)
    if (!estado) {
      setErroEstado(true);
      setShowFilters(true);
      setHasSearched(false);
      return;
    }
    setErroEstado(false);
    setHasSearched(true);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtrados = PROMOTORAS_MOCK.filter((p) => {
    const q = busca.trim().toLowerCase();
    const matchBusca = q === "" || p.numeroRegistro.includes(busca.trim()) || p.nome.toLowerCase().includes(q);
    const matchProp = !proprietario || p.proprietarioCnpj === proprietario.cnpj;
    const matchEstado = estado === "" || p.estado === estado;
    const matchMunicipio = municipio === "" || p.municipio === municipio;
    const matchSituacao = situacao === "" || p.situacao === situacao;
    return matchBusca && matchProp && matchEstado && matchMunicipio && matchSituacao;
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

  const temFiltroAtivo = proprietario || estado || municipio || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="promotora-eventos" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Promotora de Eventos Pecuários</h1>
            <button onClick={() => onNavigate("adicionar-promotora-eventos")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro (Busca + toggle) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Número do Registro ou Nome da Promotora de Eventos Pecuários
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
                  <FloatCombobox
                    label="Estado *"
                    value={estado}
                    onChange={(v) => { setEstado(v); setMunicipio(""); setErroEstado(false); }}
                    options={ESTADOS_BR}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatCombobox
                    label="Município"
                    value={municipio}
                    onChange={setMunicipio}
                    options={municipiosDisponiveis}
                    disabled={!estado}
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
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>

              {erroEstado && (
                <p className="text-sm text-red-500 mt-1">O filtro "Estado" é obrigatório para realizar a busca.</p>
              )}
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {proprietario && <Chip label={`Proprietário: ${proprietario.nomeFantasia}`} onRemove={() => setProprietario(null)} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => { setEstado(""); setMunicipio(""); }} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por promotora de eventos pecuários utilizando o campo de busca e os filtros acima..</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <SortHeader label="Número do Registro" ativo={sortKey === "numeroRegistro"} dir={sortDir} onClick={() => toggleSort("numeroRegistro")} className="max-w-[130px]" />
                      <SortHeader label="Nome" ativo={sortKey === "nome"} dir={sortDir} onClick={() => toggleSort("nome")} className="max-w-[200px]" />
                      <SortHeader label="Proprietário" ativo={false} dir={sortDir} onClick={() => {}} sortable={false} className="max-w-[220px]" />
                      <SortHeader label="Município - UF" ativo={sortKey === "municipio"} dir={sortDir} onClick={() => toggleSort("municipio")} className="max-w-[140px]" />
                      <SortHeader label="Situação" ativo={false} dir={sortDir} onClick={() => {}} sortable={false} className="max-w-[110px]" />
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.numeroRegistro}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{p.proprietarioCnpj}</div>
                          <div>{p.proprietarioNomeFantasia}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{p.municipio}</div>
                          <div>{p.uf}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-promotora-eventos", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-promotora-eventos", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
    </div>
  );
}