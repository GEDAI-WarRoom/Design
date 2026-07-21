import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  Copy,
  X,
  Check,
  Minus,
  PauseCircle,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE E OPÇÕES
// ==========================================================
export interface Papel {
  id: number;
  nome: string;
  tipo: "Base" | "Complementar";
  situacao: "Ativo" | "Inativo";
}

const PAPEIS_MOCK: Papel[] = [
  { id: 1, nome: "Funcionário", tipo: "Base", situacao: "Ativo" },
  { id: 2, nome: "Responsável Técnico", tipo: "Complementar", situacao: "Ativo" },
  { id: 3, nome: "Administrador", tipo: "Base", situacao: "Ativo" },
  { id: 4, nome: "Produtor Rural", tipo: "Complementar", situacao: "Inativo" },
  { id: 5, nome: "Gestor de Cadastros", tipo: "Base", situacao: "Ativo" },
];

const TIPOS_PAPEL = [
  { value: "Base", label: "Base" },
  { value: "Complementar", label: "Complementar" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// COMPONENTES AUXILIARES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Papel["situacao"] }) {
  const map = {
    Ativo: {
      bg: "#E6F4EA",
      border: "#A3E2B8",
      text: "#1A7A3C",
      Icon: Check,
    },
    Inativo: {
      bg: "#F3F4F6",
      border: "#E5E7EB",
      text: "#6B7280",
      Icon: Minus,
    },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
      }}
    >
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function PapeisPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Papel | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (key: keyof Papel) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Filtragem
  const filtrados = PAPEIS_MOCK.filter((p) => {
    const termo = busca.toLowerCase().trim();
    const matchBusca = termo === "" || p.nome.toLowerCase().includes(termo);
    const matchTipo = tipo === "" || p.tipo === tipo;
    const matchSituacao = situacao === "" || p.situacao === situacao;

    return matchBusca && matchTipo && matchSituacao;
  });

  // Ordenação
  const ordenados = [...filtrados].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = String(a[sortKey]);
    const valB = String(b[sortKey]);
    return sortDir === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // Paginação
  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo = tipo !== "" || situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="papeis"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Papéis
            </h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-papeis")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Barra de Busca Principal */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca
                  ? "top-1 text-[10px] text-gray-400 font-medium"
                  : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                  }`}
              >
                Nome do papel
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
                <Search
                  size={15}
                  className="text-gray-400 ml-2 flex-shrink-0 mb-0.5"
                />
              </div>
            </div>

            <button
              type="button"
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

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Tipo de Papel"
                    value={tipo}
                    onChange={setTipo}
                    options={TIPOS_PAPEL}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES}
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {tipo && (
                <Chip
                  label={`Tipo: ${tipo}`}
                  onRemove={() => setTipo("")}
                />
              )}
              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* Área de Resultados */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por papéis utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Nenhum resultado foi encontrado.
              </p>
            </div>
          ) : (
            <div className="w-full animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 select-none">
                      <th
                        onClick={() => handleSort("nome")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          Nome do Papel
                          <span
                            className={`transition-opacity text-gray-400 ${sortKey === "nome" ? "opacity-100" : "opacity-30"
                              }`}
                          >
                            {sortKey === "nome" ? (
                              sortDir === "desc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )
                            ) : (
                              <ChevronsUpDown size={14} />
                            )}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("tipo")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          Tipo de Papel
                          <span
                            className={`transition-opacity text-gray-400 ${sortKey === "tipo" ? "opacity-100" : "opacity-30"
                              }`}
                          >
                            {sortKey === "tipo" ? (
                              sortDir === "desc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )
                            ) : (
                              <ChevronsUpDown size={14} />
                            )}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          Situação
                          <span
                            className={`transition-opacity text-gray-400 ${sortKey === "situacao"
                              ? "opacity-100"
                              : "opacity-30"
                              }`}
                          >
                            {sortKey === "situacao" ? (
                              sortDir === "desc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )
                            ) : (
                              <ChevronsUpDown size={14} />
                            )}
                          </span>
                        </div>
                      </th>
                      <th className="px-4 py-3 w-[120px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 font-medium">
                          {p.nome}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {p.tipo}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate("visualizar-papel", p)
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition text-[#1A7A3C]"
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("editar-papel", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition text-[#1A7A3C]"
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("copiar-papel", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition text-[#1A7A3C]"
                              title="Copiar papel"
                            >
                              <Copy size={16} />
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
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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

export default PapeisPage;