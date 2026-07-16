import React, { useState } from "react";
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
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE
// ==========================================================
interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nome: "Joaquim da Silva",
    cpf: "444.009.956-40",
    email: "joaquim@email.com",
    situacao: "Ativo",
  },
  {
    id: 2,
    nome: "Maria Silva Mendes",
    cpf: "111.222.333-44",
    email: "maria.mendes@email.com",
    situacao: "Inativo",
  },
  {
    id: 3,
    nome: "José Aarão Neto",
    cpf: "555.009.956-40",
    email: "jose.neto@email.com",
    situacao: "Ativo",
  },
  {
    id: 4,
    nome: "Carlos Henrique Reis",
    cpf: "222.114.558-70",
    email: "",
    situacao: "Suspenso",
  },
  {
    id: 5,
    nome: "Ana Paula Souza",
    cpf: "333.444.555-66",
    email: "ana.souza@email.com",
    situacao: "Ativo",
  },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

// ==========================================================
// COMPONENTES AUXILIARES
// ==========================================================
function SituacaoBadge({
  situacao,
}: {
  situacao: Usuario["situacao"];
}) {
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
    Suspenso: {
      bg: "#FEF3E2",
      border: "#FCD9A3",
      text: "#B45309",
      Icon: PauseCircle,
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

export function UsuariosPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Usuario | null>(
    null,
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (key: keyof Usuario) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Filtragem
  const filtrados = USUARIOS_MOCK.filter((u) => {
    const termo = busca.toLowerCase().trim();
    const matchBusca =
      termo === "" ||
      u.nome.toLowerCase().includes(termo) ||
      u.cpf
        .replace(/\D/g, "")
        .includes(termo.replace(/\D/g, ""));
    const matchSituacao =
      situacao === "" || u.situacao === situacao;

    return matchBusca && matchSituacao;
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
  const inicio =
    total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo = situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="usuarios"
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
              Usuários
            </h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-usuario")}
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
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Nome ou CPF do usuário
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handlePesquisar()
                  }
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
                backgroundColor: showFilters
                  ? "transparent"
                  : GREEN,
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
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES}
                  />
                </div>
                <div className="hidden lg:block lg:flex-[2]"></div>{" "}
                {/* Espaçador */}
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
              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* Área de Resultados */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
               Busque por usuário utilizando o campo de busca e os filtros acima.
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
              <div className="overflow-x-auto ">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100 select-none">
                      <th
                        onClick={() => handleSort("nome")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          Nome
                          <span
                            className={`transition-opacity text-gray-400 ${sortKey === "nome" ? "opacity-100" : "opacity-30"}`}
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        CPF
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        Email
                      </th>
                      <th
                        onClick={() => handleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          Situação
                          <span
                            className={`transition-opacity text-gray-400 ${sortKey === "situacao" ? "opacity-100" : "opacity-30"}`}
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
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500">
                          {u.nome}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {u.cpf}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {u.email || (
                            <span className="text-gray-300">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {u.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate(
                                  "visualizar-usuario",
                                  u,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition text-[#1A7A3C]"
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate("editar-usuario", u)
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition text-[#1A7A3C]"
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

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(totalPages, p + 1),
                        )
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