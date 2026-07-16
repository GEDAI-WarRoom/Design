import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, Eye as ViewIcon, Pencil, X, Check, Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// DADOS DA LISTAGEM (substituir por API)
// ==========================================================
interface Especie {
  id: number;
  nome: string;
  codigoMapa: string;
  situacao: "Ativo" | "Inativo";
}

const ESPECIES_MOCK: Especie[] = [
  { id: 1, nome: "Bovino", codigoMapa: "1.1", situacao: "Ativo" },
  { id: 2, nome: "Bubalino", codigoMapa: "1.2", situacao: "Ativo" },
  { id: 3, nome: "Suíno", codigoMapa: "2.1", situacao: "Ativo" },
  { id: 4, nome: "Equino", codigoMapa: "3.1", situacao: "Ativo" },
  { id: 5, nome: "Caprino", codigoMapa: "4.1", situacao: "Inativo" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Especie["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />{situacao}
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

type SortKey = "nome" | "situacao"; // Código MAPA não é ordenável (AC2)

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EspeciePage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState(""); // Nome ou Código do MAPA
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const temFiltroAtivo = busca.trim() !== "" || situacao !== "";

  const handlePesquisar = () => {
    if (!temFiltroAtivo) { setErroFiltro(true); setHasSearched(false); return; }
    setErroFiltro(false); setHasSearched(true); setPage(1);
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((s) => !s);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtrados = ESPECIES_MOCK.filter((e) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || (e.nome ?? "").toLowerCase().includes(termo) || (e.codigoMapa ?? "").toLowerCase().includes(termo);
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchBusca && matchSituacao;
  });

  const ordenados = sortKey
    ? [...filtrados].sort((a, b) => {
        const va = String(a[sortKey] ?? ""); const vb = String(b[sortKey] ?? "");
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      })
    : filtrados;

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="especie" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Espécie</h1>
            <button onClick={() => onNavigate("adicionar-especie")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>Adicionar Nova</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Busca (Nome ou Código MAPA) + toggle filtros */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome da Espécie ou Código do MAPA
              </label>
              <div className="flex items-center w-full">
                <input type="text" maxLength={255} value={busca}
                  onFocus={() => setFocusBusca(true)} onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroFiltro) setErroFiltro(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6" />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
              <button onClick={handlePesquisar} className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap" style={{ backgroundColor: GREEN }}>Pesquisar</button>
            </div>
          )}

          {erroFiltro && (
            <p className="text-sm text-red-500">Utilize o campo de busca ou selecione o estado do cadastro para visualizar os resultados.</p>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {situacao && <Chip label={`Estado: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Busque por espécies utilizando o campo de busca e o filtro de estado do cadastro.</p></div>
          ) : total === 0 ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p></div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b ">
                      <th onClick={() => toggleSort("nome")} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Espécie{sortKey === "nome" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal">Código MAPA</th>
                      <th onClick={() => toggleSort("situacao")} className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Situação{sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-700 text-sm whitespace-normal">{e.nome}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm whitespace-normal">{e.codigoMapa}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm whitespace-normal">{e.situacao} </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-especie", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${e.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-especie", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${e.nome}`}><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} aria-label="Página anterior" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} aria-label="Próxima página" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}