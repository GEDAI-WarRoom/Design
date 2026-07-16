import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Eye as ViewIcon, Pencil, Check, Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US033)
// ==========================================================
const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Praga {
  id: number;
  codigo: string;
  nomeCientifico: string;
  nomePopular: string;
  situacao: "Ativo" | "Inativo";
}

const PRAGAS_MOCK: Praga[] = [
  { id: 1, codigo: "112", nomeCientifico: "Cerodirphia rubripes", nomePopular: "Lagarta-Verde", situacao: "Ativo" },
  { id: 2, codigo: "113", nomeCientifico: "Spodoptera frugiperda", nomePopular: "Lagarta-do-cartucho", situacao: "Ativo" },
  { id: 3, codigo: "114", nomeCientifico: "Hypothenemus hampei", nomePopular: "Broca-do-café", situacao: "Inativo" },
  { id: 4, codigo: "115", nomeCientifico: "Acalymma sp.", nomePopular: "Vaquinha", situacao: "Ativo" },
];

// ==========================================================
// UI HELPERS
// ==========================================================
type SortKey = "nomeCientifico" | "nomePopular" | "situacao";
type SortDir = "asc" | "desc";

function SortHeader({ label, ativo, dir, onClick, className = "" }: { label: string; ativo: boolean; dir: SortDir; onClick: () => void; className?: string }) {
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

function SituacaoBadge({ situacao }: { situacao: Praga["situacao"] }) {
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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function PragaPage({ onLogout, onNavigate }: PageProps) {
  // ---- Busca principal ----
  const [busca, setBusca] = useState(""); // Nome Científico ou Nome Popular

  // ---- Filtros ----
  const [situacao, setSituacao] = useState("");

  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroVazio, setErroVazio] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [sortKey, setSortKey] = useState<SortKey>("nomeCientifico");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handlePesquisar = () => {
    // Exige o campo de busca OU pelo menos um filtro
    if (!busca.trim() && !situacao) {
      setErroVazio(true);
      setShowFilters(true);
      setHasSearched(false);
      return;
    }
    setErroVazio(false);
    setHasSearched(true);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtrados = PRAGAS_MOCK.filter((p) => {
    const q = busca.trim().toLowerCase();
    const matchBusca = q === "" || p.nomeCientifico.toLowerCase().includes(q) || p.nomePopular.toLowerCase().includes(q);
    const matchSituacao = situacao === "" || p.situacao === situacao;
    return matchBusca && matchSituacao;
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

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="praga" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Praga</h1>
            <button onClick={() => onNavigate("adicionar-praga")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome Científico ou Nome Popular da Praga
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); setErroVazio(false); }}
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
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatSelect label="Situação" value={situacao} onChange={(v) => { setSituacao(v); setErroVazio(false); }} options={SITUACOES} />
                </div>

                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {erroVazio && (
                <p className="text-sm text-red-500 mt-1">Preencha o campo de busca ou selecione pelo menos um filtro para pesquisar.</p>
              )}
            </div>
          )}

          {/* Chips */}
          {situacao && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por praga utiliazando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto ">
                <table className="w-full text-sm ">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <SortHeader label="Nome Científico" ativo={sortKey === "nomeCientifico"} dir={sortDir} onClick={() => toggleSort("nomeCientifico")} className="max-w-[300px]" />
                      <SortHeader label="Nome Popular" ativo={sortKey === "nomePopular"} dir={sortDir} onClick={() => toggleSort("nomePopular")} className="max-w-[260px]" />
                      <SortHeader label="Situação" ativo={sortKey === "situacao"} dir={sortDir} onClick={() => toggleSort("situacao")} className="max-w-[120px]" />
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal italic">{p.nomeCientifico}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.nomePopular}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-praga", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-praga", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
    </div>
  );
}