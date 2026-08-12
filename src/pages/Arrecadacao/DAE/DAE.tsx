import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  X,
  Ban,
  Clock,
  CircleDollarSign,
  ReceiptText,
  Calendar,
} from "lucide-react";

import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
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

const SITUACOES_DAE = [
  { value: "Aberto", label: "Aberto" },
  { value: "Pago", label: "Pago" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Ativo", label: "Ativo" },
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

interface ContribuinteDae {
  id: number;
  nome: string;
  documento: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
}

const CONTRIBUINTES_DAE: ContribuinteDae[] = DAES_MOCK.map((dae) => ({
  id: dae.id,
  nome: dae.nomeContribuinte,
  documento: dae.numeroContribuinte,
  tipo: dae.numeroContribuinte.replace(/\D/g, "").length > 11 ? "Pessoa Jurídica" : "Pessoa Física",
}));

const RECEITAS_ENTIDADES = RECEITAS.map((receita, indice) => ({
  id: indice + 1,
  codigo: receita.value,
  nome: receita.label.replace(`${receita.value} - `, ""),
  descricao: receita.label,
}));

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

const obterSituacao = (dae: Dae) => {
  if (dae.statusDae === "Cancelado") return "Cancelado";
  if (dae.statusPagamento === "Pago") return "Pago";
  if (dae.statusPagamento === "Aberto") return "Aberto";
  return "Ativo";
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
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa Física");
  const [contribuinte, setContribuinte] = useState<ContribuinteDae | null>(null);
  const [dataEmissao, setDataEmissao] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [receita, setReceita] = useState<(typeof RECEITAS_ENTIDADES)[number] | null>(null);
  const [situacao, setSituacao] = useState("");
  const [dataPagamentoUsuario, setDataPagamentoUsuario] = useState("");
  const [dataPagamentoProdemge, setDataPagamentoProdemge] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const contribuintesFiltrados = useMemo(() => CONTRIBUINTES_DAE.filter((item) => item.tipo === tipoPessoa), [tipoPessoa]);

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = DAES_MOCK.filter((d) => {
    const termo = busca.replace(/\D/g, "");

    const matchBusca =
      termo === "" ||
      d.numeroDae.includes(termo);

    const matchContribuinte =
      !contribuinte || d.numeroContribuinte === contribuinte.documento;

    const matchDataEmissao =
      dataEmissao === "" || d.dataEmissao === dataEmissao;

    const matchMunicipio = municipio === "" || d.municipio === municipio;

    const matchReceita = !receita || d.receita.startsWith(`${receita.codigo} -`);

    const matchSituacao = situacao === "" || obterSituacao(d) === situacao;

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
      matchSituacao &&
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
    contribuinte ||
    dataEmissao ||
    municipio ||
    receita ||
    situacao ||
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
                Número do DAE
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
                <EntitySearchInput
                  label="Contribuinte"
                  placeholder="Buscar por nome ou documento"
                  value={contribuinte?.nome ?? ""}
                  data={contribuintesFiltrados}
                  searchKeys={["nome", "documento"]}
                  columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "Documento", key: "documento" }]}
                  icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
                  onChange={setContribuinte}
                  title="Buscar Contribuinte"
                  subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
                  confirmLabel="Selecionar"
                  headerActions={<FloatSelect label="Tipo de Pessoa" value={tipoPessoa} onChange={(valor) => { setTipoPessoa(valor); setContribuinte(null); }} options={[{ value: "Pessoa Física", label: "Pessoa Física" }, { value: "Pessoa Jurídica", label: "Pessoa Jurídica" }]} />}
                />

                <FloatCombobox
                  label="Município do Contribuinte"
                  value={municipio}
                  onChange={setMunicipio}
                  options={MUNICIPIOS_MG}
                />

                <EntitySearchInput
                  label="Receita"
                  placeholder="Buscar receita"
                  value={receita?.descricao ?? ""}
                  data={RECEITAS_ENTIDADES}
                  searchKeys={["codigo", "nome", "descricao"]}
                  columns={[{ label: "Código", key: "codigo" }, { label: "Receita", key: "nome" }]}
                  icon={<ReceiptText size={18} className="text-[#1A7A3C]" />}
                  onChange={setReceita}
                  title="Buscar Receita"
                  subtitle="Busque por uma receita cadastrada:"
                  confirmLabel="Selecionar"
                />

                <FloatInput
                  label="Data de Emissão"
                  type="date"
                  value={dataEmissao}
                  onChange={setDataEmissao}
                  icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                  className="[&>input::-webkit-calendar-picker-indicator]:hidden"
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
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={SITUACOES_DAE}
                />

                <FloatInput
                  label="Data Pagamento Usuário"
                  type="date"
                  value={dataPagamentoUsuario}
                  onChange={setDataPagamentoUsuario}
                  icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                  className="[&>input::-webkit-calendar-picker-indicator]:hidden"
                />

                <FloatInput
                  label="Data Pagamento PRODEMGE"
                  type="date"
                  value={dataPagamentoProdemge}
                  onChange={setDataPagamentoProdemge}
                  icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                  className="[&>input::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {contribuinte && (
                <Chip
                  label={`Contribuinte: ${contribuinte.nome}`}
                  onRemove={() => setContribuinte(null)}
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
                  label={`Receita: ${receita.descricao}`}
                  onRemove={() => setReceita(null)}
                />
              )}

              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
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
              <div className="overflow-hidden rounded-lg">
                <table className="w-full table-fixed border-collapse text-xs">
                  <colgroup><col className="w-[13%]" /><col className="w-[18%]" /><col className="w-[10%]" /><col className="w-[9%]" /><col className="w-[18%]" /><col className="w-[10%]" /><col className="w-[10%]" /><col className="w-[8%]" /><col className="w-[4%]" /></colgroup>
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        Nº DO DAE
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        CONTRIBUINTE
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        DATA DE EMISSÃO
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        MUNICÍPIO
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        RECEITA
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        DATA PAG. USUÁRIO
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        DATA PAG. PRODEMGE
                      </th>
                      <th className="px-2.5 py-3 text-left font-semibold leading-4 text-gray-600">
                        SITUAÇÃO
                      </th>
                      <th className="px-2 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {pagina.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="whitespace-nowrap px-2.5 py-3 text-gray-500">
                          {d.numeroDae}
                        </td>
                        <td className="break-words px-2.5 py-3 leading-5 text-gray-500">
                          <span className="block">{d.nomeContribuinte} -</span>
                          <span className="block whitespace-nowrap">{d.numeroContribuinte}</span>
                        </td>
                        <td className="px-2.5 py-3 text-gray-500">
                          {fmtData(d.dataEmissao)}
                        </td>
                        <td className="break-words px-2.5 py-3 text-gray-500">
                          {d.municipio} - {d.uf}
                        </td>
                        <td className="break-words px-2.5 py-3 leading-5 text-gray-500">
                          {d.receita}
                        </td>
                        <td className="px-2.5 py-3 text-gray-500">
                          {fmtData(d.dataPagamentoUsuario)}
                        </td>
                        <td className="px-2.5 py-3 text-gray-500">
                          {fmtData(d.dataPagamentoProdemge)}
                        </td>
                        <td className="break-words px-2.5 py-3 text-gray-700">
                          {obterSituacao(d)}
                        </td>
                        <td className="px-1 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => onNavigate("visualizar-dae", d)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={16} />
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
