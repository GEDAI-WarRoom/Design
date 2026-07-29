import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  X,
  Check,
  Ban,
  Clock,
  CircleDollarSign,
} from "lucide-react";

import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatInput,
  FloatCombobox,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES
// ==========================================================
const MUNICIPIOS_MG = [
  "Abadia dos Dourados",
  "Abaeté",
  "Belo Horizonte",
  "Campo Belo",
  "Carrancas",
  "Divino",
  "Esmeraldas",
  "Lavras",
  "Oliveira",
  "Uberlândia",
  "Varginha",
];

const RECEITAS = [
  { value: "64", label: "64 - Venda de GTA Avulsa" },
  { value: "1", label: "1 - Emissão de Guia de Trânsito Animal" },
  { value: "3", label: "3 - Captação de Leite" },
  { value: "34", label: "34 - Inspeção Sanitária Industrial" },
  { value: "2", label: "2 - Registro de Eventos Pecuários" },
  { value: "48", label: "48 - Permissão de Trânsito Vegetal" },
];

const STATUS_PAGAMENTO = [
  { value: "Aberto", label: "Aberto" },
  { value: "Pago", label: "Pago" },
];

const STATUS_DAE = [
  { value: "Ativo", label: "Ativo" },
  { value: "Cancelado", label: "Cancelado" },
];

// ==========================================================
// MOCK DE DADOS
// ==========================================================
interface Dae {
  id: number;
  numeroDae: string;
  nomeContribuinte: string;
  numeroContribuinte: string;
  dataEmissao: string;
  municipio: string;
  uf: string;
  receita: string;
  statusPagamento: "Aberto" | "Pago";
  statusDae: "Ativo" | "Cancelado";
  dataPagamentoUsuario: string;
  dataPagamentoProdemge: string;
}

const DAES_MOCK: Dae[] = [
  {
    id: 1,
    numeroDae: "3120240000001",
    nomeContribuinte: "José Aarão Neto",
    numeroContribuinte: "555.009.956-40",
    dataEmissao: "2026-06-10",
    municipio: "Lavras",
    uf: "MG",
    receita: "64 - Venda de GTA Avulsa",
    statusPagamento: "Pago",
    statusDae: "Ativo",
    dataPagamentoUsuario: "2026-06-12",
    dataPagamentoProdemge: "2026-06-13",
  },
  {
    id: 2,
    numeroDae: "3120240000002",
    nomeContribuinte: "Agropecuária Vale Verde Ltda.",
    numeroContribuinte: "56.338.814/0001-95",
    dataEmissao: "2026-07-01",
    municipio: "Uberlândia",
    uf: "MG",
    receita: "1 - Emissão de Guia de Trânsito Animal",
    statusPagamento: "Aberto",
    statusDae: "Ativo",
    dataPagamentoUsuario: "—",
    dataPagamentoProdemge: "—",
  },
  {
    id: 3,
    numeroDae: "3120240000003",
    nomeContribuinte: "Divino de Souza Sobrinho",
    numeroContribuinte: "444.009.956-40",
    dataEmissao: "2026-05-18",
    municipio: "Varginha",
    uf: "MG",
    receita: "3 - Captação de Leite",
    statusPagamento: "Aberto",
    statusDae: "Cancelado",
    dataPagamentoUsuario: "—",
    dataPagamentoProdemge: "—",
  },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
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

const fmtData = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

// ==========================================================
// PÁGINA: BUSCAR DAE
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function DAEBuscaPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [numeroContribuinte, setNumeroContribuinte] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [receita, setReceita] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("");
  const [statusDae, setStatusDae] = useState("");
  const [dataPagamentoUsuario, setDataPagamentoUsuario] = useState("");
  const [dataPagamentoProdemge, setDataPagamentoProdemge] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = DAES_MOCK.filter((d) => {
    const termo = busca.toLowerCase().trim();

    const matchBusca =
      termo === "" ||
      d.numeroDae.includes(termo.replace(/\D/g, "")) ||
      d.nomeContribuinte.toLowerCase().includes(termo);

    const matchContribuinte =
      numeroContribuinte === "" ||
      d.numeroContribuinte
        .replace(/\D/g, "")
        .includes(numeroContribuinte.replace(/\D/g, ""));

    const matchDataEmissao =
      dataEmissao === "" || d.dataEmissao === dataEmissao;

    const matchMunicipio = municipio === "" || d.municipio === municipio;

    const matchReceita = receita === "" || d.receita.startsWith(`${receita} -`);

    const matchStatusPagamento =
      statusPagamento === "" || d.statusPagamento === statusPagamento;

    const matchStatusDae = statusDae === "" || d.statusDae === statusDae;

    const matchPagUsuario =
      dataPagamentoUsuario === "" ||
      d.dataPagamentoUsuario === dataPagamentoUsuario;

    const matchPagProdemge =
      dataPagamentoProdemge === "" ||
      d.dataPagamentoProdemge === dataPagamentoProdemge;

    return (
      matchBusca &&
      matchContribuinte &&
      matchDataEmissao &&
      matchMunicipio &&
      matchReceita &&
      matchStatusPagamento &&
      matchStatusDae &&
      matchPagUsuario &&
      matchPagProdemge
    );
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo = !!(
    numeroContribuinte ||
    dataEmissao ||
    municipio ||
    receita ||
    statusPagamento ||
    statusDae ||
    dataPagamentoUsuario ||
    dataPagamentoProdemge
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="dae"
        hideSearch
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
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
            <h1 className="text-2xl font-semibold text-gray-900">DAE</h1>

            <button
              onClick={() => onNavigate("adicionar-dae")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Barra Superior do Filtro (Nº do DAE / Nome do Contribuinte e Botão de Expansão) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Nº do DAE ou Nome do Contribuinte
              </label>

              <div className="flex items-center w-full">
                <input
                  type="text"
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
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              {/* FILEIRA 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full items-end">
                <FloatInput
                  label="Nº do Contribuinte"
                  placeholder="CPF ou CNPJ"
                  value={numeroContribuinte}
                  onChange={(v) => setNumeroContribuinte(v.slice(0, 18))}
                  maxLength={18}
                />

                <FloatCombobox
                  label="Município do Contribuinte"
                  value={municipio}
                  onChange={setMunicipio}
                  options={MUNICIPIOS_MG}
                />

                <FloatSelect
                  label="Receita"
                  value={receita}
                  onChange={setReceita}
                  options={RECEITAS}
                />

                <FloatInput
                  label="Data de Emissão"
                  type="date"
                  value={dataEmissao}
                  onChange={setDataEmissao}
                />

                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* FILEIRA 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
                <FloatSelect
                  label="Status do Pagamento"
                  value={statusPagamento}
                  onChange={setStatusPagamento}
                  options={STATUS_PAGAMENTO}
                />

                <FloatSelect
                  label="Status do DAE"
                  value={statusDae}
                  onChange={setStatusDae}
                  options={STATUS_DAE}
                />

                <FloatInput
                  label="Data Pagamento Usuário"
                  type="date"
                  value={dataPagamentoUsuario}
                  onChange={setDataPagamentoUsuario}
                />

                <FloatInput
                  label="Data Pagamento PRODEMGE"
                  type="date"
                  value={dataPagamentoProdemge}
                  onChange={setDataPagamentoProdemge}
                />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {numeroContribuinte && (
                <Chip
                  label={`Nº Contribuinte: ${numeroContribuinte}`}
                  onRemove={() => setNumeroContribuinte("")}
                />
              )}

              {dataEmissao && (
                <Chip
                  label={`Emissão: ${fmtData(dataEmissao)}`}
                  onRemove={() => setDataEmissao("")}
                />
              )}

              {municipio && (
                <Chip
                  label={`Município: ${municipio}`}
                  onRemove={() => setMunicipio("")}
                />
              )}

              {receita && (
                <Chip
                  label={`Receita: ${RECEITAS.find((r) => r.value === receita)?.label}`}
                  onRemove={() => setReceita("")}
                />
              )}

              {statusPagamento && (
                <Chip
                  label={`Pagamento: ${statusPagamento}`}
                  onRemove={() => setStatusPagamento("")}
                />
              )}

              {statusDae && (
                <Chip
                  label={`Status DAE: ${statusDae}`}
                  onRemove={() => setStatusDae("")}
                />
              )}

              {dataPagamentoUsuario && (
                <Chip
                  label={`Pag. Usuário: ${fmtData(dataPagamentoUsuario)}`}
                  onRemove={() => setDataPagamentoUsuario("")}
                />
              )}

              {dataPagamentoProdemge && (
                <Chip
                  label={`Pag. PRODEMGE: ${fmtData(dataPagamentoProdemge)}`}
                  onRemove={() => setDataPagamentoProdemge("")}
                />
              )}
            </div>
          )}

          {/* Linha Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por DAE utilizando o campo de busca e os filtros acima.
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        Nº DO DAE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        NOME DO CONTRIBUINTE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        Nº DO CONTRIBUINTE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        DATA DE EMISSÃO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        MUNÍCIPIO DO CONTRIBUINTE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        RECEITA
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        STATU DO PAGAMENTO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        STATUS DO DAE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        DATA PAG. USUÁRIO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                        DATA PAG. PRODEMGE
                      </th>
                      <th className="px-4 py-3 w-[60px]" />
                    </tr>
                  </thead>

                  <tbody>
                    {pagina.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {d.numeroDae}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {d.nomeContribuinte}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {d.numeroContribuinte}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {fmtData(d.dataEmissao)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {d.municipio} - {d.uf}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {d.receita}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {d.statusPagamento}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {d.statusDae}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {fmtData(d.dataPagamentoUsuario)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                          {fmtData(d.dataPagamentoProdemge)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => onNavigate("visualizar-dae", d)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
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
