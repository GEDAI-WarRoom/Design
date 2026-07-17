import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- lista de situações ---

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// --- mocks ---

interface IsencaoTaxaGta {
  id: number;
  motivo: string;
  situacao: "Ativo" | "Inativo";
}

const ISENCOES_MOCK: IsencaoTaxaGta[] = [
  { id: 1, motivo: "Instituição de pesquisa", situacao: "Ativo" },
  { id: 2, motivo: "Saída de eventos", situacao: "Ativo" },
  { id: 3, motivo: "Doação a órgão público", situacao: "Inativo" },
  { id: 4, motivo: "Programa de repovoamento", situacao: "Ativo" },
  { id: 5, motivo: "Uso científico/laboratorial", situacao: "Inativo" },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

type SortKey = "motivo" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function IsencaoTaxaGtaPage({ onLogout, onNavigate }: PageProps) {
  const [motivo, setMotivo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusMotivo, setFocusMotivo] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtrados = ISENCOES_MOCK.filter((i) => {
    const matchMotivo =
      motivo.trim() === "" || i.motivo.toLowerCase().includes(motivo.trim().toLowerCase());
    const matchSituacao = situacao === "" || i.situacao === situacao;
    return matchMotivo && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    if (!sortKey) return 0;
    const va = String(a[sortKey]);
    const vb = String(b[sortKey]);
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = situacao !== "";

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown size={14} className="opacity-30" />;
    return sortDir === "desc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="isencao-taxa-gta" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Isenção de Taxa de GTA</h1>
            <button
              onClick={() => onNavigate("adicionar-isencao-taxa-gta")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO (Engloba Filtros, Mensagens e Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Barra Superior do Filtro (Motivo e Botão de Expansão) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusMotivo || motivo
                    ? "top-1 text-[10px] text-gray-400 font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }`}
              >
                Motivo de Isenção de Taxa de GTA
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={motivo}
                  onFocus={() => setFocusMotivo(true)}
                  onBlur={() => setFocusMotivo(false)}
                  onChange={(e) => setMotivo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm"
              style={{
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Internos Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>

              {/* Botão Pesquisar Compacto */}
              <button
                onClick={handlePesquisar}
                className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Linha Divisória sutil entre filtros e resultados (aparece após primeira busca) */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS (Dentro do mesmo card branco) */}
          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por isenção de taxa de GTA utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th
                        onClick={() => handleSort("motivo")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase"
                      >
                        <div className="flex items-center gap-1.5">
                          Motivo de Isenção de Taxa de GTA
                          <SortIcon col="motivo" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase"
                      >
                        <div className="flex items-center gap-1.5">
                          Situação
                          <SortIcon col="situacao" />
                        </div>
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((i) => (
                      <tr key={i.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{i.motivo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{i.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => onNavigate("visualizar-isencao-taxa-gta", i)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() => onNavigate("editar-isencao-taxa-gta", i)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
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
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={pageAtual === totalPages}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
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