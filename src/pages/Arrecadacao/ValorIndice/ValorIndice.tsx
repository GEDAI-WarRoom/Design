import { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatInput,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (Valor por Índice)
// ==========================================================
const INDICES = [{ value: "UFEMG", label: "UFEMG" }];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// MOCK DE DADOS (substituir por API)
// ==========================================================
interface ValorIndice {
  id: number;
  indice: string;
  ano: string;
  mes: string;
  valor: number;
  situacao: "Ativo" | "Inativo";
}

const VALORES_INDICE_MOCK: ValorIndice[] = [
  {
    id: 1,
    indice: "UFEMG",
    ano: "2026",
    mes: "Janeiro",
    valor: 2000,
    situacao: "Ativo",
  },
  {
    id: 2,
    indice: "UFEMG",
    ano: "2026",
    mes: "Fevereiro",
    valor: 2050,
    situacao: "Ativo",
  },
  {
    id: 3,
    indice: "UFEMG",
    ano: "2025",
    mes: "Dezembro",
    valor: 1980,
    situacao: "Inativo",
  },
  {
    id: 4,
    indice: "UFEMG",
    ano: "2025",
    mes: "Novembro",
    valor: 1960,
    situacao: "Inativo",
  },
  {
    id: 5,
    indice: "UFEMG",
    ano: "2025",
    mes: "Outubro",
    valor: 1950,
    situacao: "Ativo",
  },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
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
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

const fmtValor = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

// ==========================================================
// PÁGINA: BUSCAR VALOR POR ÍNDICE
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function ValorIndicePage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [indice, setIndice] = useState("");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [valor, setValor] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const temFiltroPreenchido = !!(
    indice ||
    ano ||
    mes ||
    valor ||
    situacao
  );

  const handlePesquisar = () => {
    if (!temFiltroPreenchido) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = VALORES_INDICE_MOCK.filter((v) => {
    const matchIndice = !indice || v.indice === indice;
    const matchAno = ano === "" || v.ano === ano;
    const matchMes = !mes || v.mes === mes;
    const matchValor =
      valor === "" ||
      v.valor === Number(valor.replace(",", "."));
    const matchSituacao = !situacao || v.situacao === situacao;
    return (
      matchIndice &&
      matchAno &&
      matchMes &&
      matchValor &&
      matchSituacao
    );
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio =
    total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="valor-indice"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Valor por Índice
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-valor-indice")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO (Filtros + Mensagens + Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full">
            <FloatSelect
              label="Índice"
              value={indice}
              onChange={(v) => {
                setIndice(v);
                setErroFiltro(false);
              }}
              options={INDICES}
            />

            <FloatInput
              label="Ano"
              placeholder="0000"
              value={ano}
              onChange={(v) => {
                setAno(v.replace(/\D/g, "").slice(0, 4));
                setErroFiltro(false);
              }}
              maxLength={4}
            />

            <FloatSelect
              label="Mês"
              value={mes}
              onChange={(v) => {
                setMes(v);
                setErroFiltro(false);
              }}
              options={MESES.map((m) => ({
                value: m,
                label: m,
              }))}
            />

            <FloatInput
              label="Valor"
              placeholder="0,00"
              value={valor}
              onChange={(v) => {
                setValor(v.replace(/[^0-9,]/g, ""));
                setErroFiltro(false);
              }}
            />

            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={(v) => {
                setSituacao(v);
                setErroFiltro(false);
              }}
              options={SITUACOES}
            />

            <button
              onClick={handlePesquisar}
              className="h-12 w-full self-end rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: GREEN }}
            >
              Pesquisar
            </button>
          </div>

          {/* Feedback de Erro Global */}
          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha ao menos um filtro para realizar a busca.
            </p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroPreenchido && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {indice && (
                <Chip
                  label={`Índice: ${indice}`}
                  onRemove={() => setIndice("")}
                />
              )}
              {ano && (
                <Chip
                  label={`Ano: ${ano}`}
                  onRemove={() => setAno("")}
                />
              )}
              {mes && (
                <Chip
                  label={`Mês: ${mes}`}
                  onRemove={() => setMes("")}
                />
              )}
              {valor && (
                <Chip
                  label={`Valor: ${fmtValor(Number(valor.replace(",", ".")) || 0)}`}
                  onRemove={() => setValor("")}
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

          {/* Linha Divisória sutil entre filtros e resultados */}
          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por valor de índice utilizando os filtros
                acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Nenhum resultado foi encontrado.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        ÍNDICE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        ANO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        MÊS
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        VALOR
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        SITUAÇÃO
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((v) => (
                      <tr
                        key={v.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {v.indice}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {v.ano}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {v.mes}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {fmtValor(v.valor)}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-normal">
                          {v.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() =>
                                onNavigate(
                                  "visualizar-valor-indice",
                                  v,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() =>
                                onNavigate(
                                  "editar-valor-indice",
                                  v,
                                )
                              }
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
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
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