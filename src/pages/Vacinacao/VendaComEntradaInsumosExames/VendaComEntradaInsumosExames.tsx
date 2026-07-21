import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Store,
  Eye as ViewIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// --- mock ---

const REVENDEDORAS_MG_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

const FORNECEDORES_VACINA_MOCK = [
  {
    id: 1,
    codigo: "3540987753",
    nome: "Laboratório BioMed",
    tipo: "Laboratório",
    uf: "SP",
  },
  {
    id: 2,
    codigo: "3190987753",
    nome: "Vacinas Imunotech",
    tipo: "Laboratório",
    uf: "PR",
  },
  {
    id: 3,
    codigo: "3520938028",
    nome: "AgroVet Distribuidora",
    tipo: "Revendedora",
    uf: "SP",
  },
];

const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, codigo: "D-002", nome: "Raiva", tiposVacina: [] },
  { id: 3, codigo: "D-003", nome: "Febre Aftosa", tiposVacina: [] },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

interface VendaEntrada {
  id: number;
  revendedoraCodigo: string;
  revendedoraNome: string;
  numeroNotaFiscal: string;
  numeroPartida: string;
  fornecedor: string;
  doenca: string;
  tipoVacina: string;
  situacao: "Gravada" | "Cancelada";
}

const VENDAS_MOCK: VendaEntrada[] = [
  {
    id: 1,
    revendedoraCodigo: "3120938028",
    revendedoraNome: "Comercial AgroVat",
    numeroNotaFiscal: "1234567",
    numeroPartida: "0013225/24",
    fornecedor: "Laboratório BioMed",
    doenca: "Brucelose",
    tipoVacina: "B19",
    situacao: "Gravada",
  },
  {
    id: 2,
    revendedoraCodigo: "3120938045",
    revendedoraNome: "Agropecuária Vale Verde",
    numeroNotaFiscal: "7654321",
    numeroPartida: "0044120/23",
    fornecedor: "AgroVet Distribuidora",
    doenca: "Febre Aftosa",
    tipoVacina: "O1 Campos",
    situacao: "Cancelada",
  },
  {
    id: 3,
    revendedoraCodigo: "3120938090",
    revendedoraNome: "Casa do Produtor Lavras",
    numeroNotaFiscal: "9080706",
    numeroPartida: "0099001/24",
    fornecedor: "Vacinas Imunotech",
    doenca: "Raiva",
    tipoVacina: "",
    situacao: "Gravada",
  },
];

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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function VendaComEntradaInsumosExamesPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [revendedora, setRevendedora] = useState<any | null>(null);
  const [fornecedor, setFornecedor] = useState<any | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [tipoVacina, setTipoVacina] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const tiposVacinaDisponiveis = (doenca?.tiposVacina ?? []).map(
    (t: string) => ({ value: t, label: t }),
  );
  const doencaTemTipoVacina = (doenca?.tiposVacina?.length ?? 0) > 0;

  const algumFiltroPreenchido =
    !!revendedora ||
    !!fornecedor ||
    numeroNotaFiscal !== "" ||
    numeroPartida !== "" ||
    !!doenca ||
    tipoVacina !== "" ||
    situacao !== "";

  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const limparErro = () => {
    if (erroValidacao) setErroValidacao(false);
  };

  const filtrados = VENDAS_MOCK.filter((v) => {
    const matchRevendedora =
      !revendedora || v.revendedoraCodigo === revendedora.codigo;
    const matchFornecedor = !fornecedor || v.fornecedor === fornecedor.nome;
    const matchNF =
      numeroNotaFiscal === "" || v.numeroNotaFiscal.includes(numeroNotaFiscal);
    const matchPartida =
      numeroPartida === "" || v.numeroPartida.includes(numeroPartida);
    const matchDoenca = !doenca || v.doenca === doenca.nome;
    const matchTipoVacina = tipoVacina === "" || v.tipoVacina === tipoVacina;
    const matchSituacao = situacao === "" || v.situacao === situacao;
    return (
      matchRevendedora &&
      matchFornecedor &&
      matchNF &&
      matchPartida &&
      matchDoenca &&
      matchTipoVacina &&
      matchSituacao
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

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="venda-entrada-vacina"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-5">
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
              Venda com Entrada de Insumos para Exame
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-venda-entrada-insumos-exames")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* Card Unificado (Busca + Listagem juntos no mesmo box) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Seção Superior do Bloco: Filtros */}
          <div className="bg-white">
            <div className="grid grid-cols-3 gap-3 items-end">
              {/* Revendedora */}
              <EntitySearchInput
                label="Revendedora de Produtos Agropecuários"
                placeholder="Buscar por código ou nome."
                value={revendedora ? ` ${revendedora.nome}` : ""}
                data={REVENDEDORAS_MG_MOCK}
                searchKeys={["codigo", "nome"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Nome", key: "nome" },
                ]}
                icon={<Store size={20} color={GREEN} />}
                title="Buscar Revendedora"
                subtitle="Busque por uma revendedora cadastrada:"
                onChange={(ent) => {
                  setRevendedora(ent);
                  limparErro();
                }}
              />

              {/* Fornecedor */}
              <EntitySearchInput
                label="Fornecedor"
                placeholder="Buscar por nome ou código."
                value={fornecedor ? fornecedor.nome : ""}
                data={FORNECEDORES_VACINA_MOCK}
                searchKeys={["codigo", "nome", "tipo"]}
                columns={[
                  { label: "Tipo", key: "tipo" },
                  { label: "Nome", key: "nome" },
                  { label: "Código", key: "codigo" },
                  { label: "UF", key: "uf" },
                ]}
                icon={
                  <img
                    src={Icons.iconeFornecedorUrl}
                    alt="Fornecedor"
                    className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
                  />
                }
                title="Buscar Fornecedor de Vacina"
                subtitle="Busque por laboratórios ou revendedoras cadastrados:"
                onChange={(ent) => {
                  setFornecedor(ent);
                  limparErro();
                }}
              />

              {/*+ Botão Pesquisar */}
              <div className="flex items-end gap-2 w-full">
                {/* Número da Nota Fiscal */}
                <div className="relative border border-gray-300 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                  <label
                    className={`absolute left-3 transition-all ${numeroNotaFiscal ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
                  >
                    Número da Nota Fiscal
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={numeroNotaFiscal}
                    onChange={(e) => {
                      setNumeroNotaFiscal(e.target.value.replace(/\D/g, ""));
                      limparErro();
                    }}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                  />
                </div>

                <button
                  onClick={handlePesquisar}
                  className="h-12 px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* SEGUNDA LINHA */}

              {/* Número da Partida */}
              <div className="relative border border-gray-300 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <label
                  className={`absolute left-3 transition-all ${numeroPartida ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
                >
                  Número de Partida
                </label>
                <input
                  type="text"
                  value={numeroPartida}
                  onChange={(e) => {
                    setNumeroPartida(e.target.value);
                    limparErro();
                  }}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
              </div>

              <div className="flex-1">
                <EntitySearchInput
                  label="Doença"
                  placeholder="Buscar pelo nome da doença."
                  value={doenca ? doenca.nome : ""}
                  data={DOENCAS_MOCK}
                  searchKeys={["nome"]}
                  columns={[{ label: "Nome da Doença", key: "nome" }]}
                  icon={
                    <img
                      src={Icons.iconeDoencaUrl}
                      alt="Doença"
                      className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
                    />
                  }
                  title="Buscar Doença"
                  subtitle="Busque por uma doença cadastrada:"
                  onChange={(ent) => {
                    setDoenca(ent);
                    setTipoVacina("");
                    limparErro();
                  }}
                />
              </div>

              {/* Tipo de Vacina */}
              {doencaTemTipoVacina ? (
                <FloatSelect
                  label="Tipo de Vacina"
                  value={tipoVacina}
                  onChange={(val) => {
                    setTipoVacina(val);
                    limparErro();
                  }}
                  options={tiposVacinaDisponiveis}
                />
              ) : null}

              {/* Situação */}
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(val) => {
                  setSituacao(val);
                  limparErro();
                }}
                options={SITUACOES}
              />
            </div>

            {/* Mensagem de validação */}
            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3">
                Preencha ao menos um dos filtros acima para realizar a consulta.
              </p>
            )}

            {/* Chips de filtros ativos */}
            {(revendedora ||
              fornecedor ||
              numeroNotaFiscal ||
              numeroPartida ||
              doenca ||
              tipoVacina ||
              situacao) && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {revendedora && (
                  <Chip
                    label={`Revendedora: ${revendedora.nome}`}
                    onRemove={() => setRevendedora(null)}
                  />
                )}
                {fornecedor && (
                  <Chip
                    label={`Fornecedor: ${fornecedor.nome}`}
                    onRemove={() => setFornecedor(null)}
                  />
                )}
                {numeroNotaFiscal && (
                  <Chip
                    label={`NF: ${numeroNotaFiscal}`}
                    onRemove={() => setNumeroNotaFiscal("")}
                  />
                )}
                {numeroPartida && (
                  <Chip
                    label={`Partida: ${numeroPartida}`}
                    onRemove={() => setNumeroPartida("")}
                  />
                )}
                {doenca && (
                  <Chip
                    label={`Doença: ${doenca.nome}`}
                    onRemove={() => {
                      setDoenca(null);
                      setTipoVacina("");
                    }}
                  />
                )}
                {tipoVacina && (
                  <Chip
                    label={`Tipo de Vacina: ${tipoVacina}`}
                    onRemove={() => setTipoVacina("")}
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
          </div>

          {hasSearched && <div className="border-t border-gray-100 my-1" />}
          {/* Seção Inferior do Bloco: Resultados */}
          <div className="bg-gray-50/50">
            {!hasSearched ? (
              <div className="p-6 text-center bg-white">
                <p className="text-sm text-gray-500">
                  Busque por venda com entrada de vacina utilizando os filtros
                  acima
                </p>
              </div>
            ) : total === 0 ? (
              <div className="p-6 text-center bg-white border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Nenhum resultado foi encontrado.
                </p>
              </div>
            ) : (
              <div className="bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-30 border-b border-gray-100">
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Revendedora de Produtos <br /> Agropecuários
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Número da <br /> Nota Fiscal
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Número da <br /> Partida
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Fornecedor
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Doença
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase text-xs tracking-wider">
                          Situação
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pagina.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-regular text-gray-700">
                                {v.revendedoraCodigo}
                              </span>
                              <span className="text-sm font-regular text-gray-700">
                                {v.revendedoraNome}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.numeroNotaFiscal}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.numeroPartida}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.fornecedor}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.doenca}
                            {v.tipoVacina ? ` (${v.tipoVacina})` : ""}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {v.situacao}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() =>
                                  onNavigate(
                                    "visualizar-venda-entrada-vacina",
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
                                  onNavigate("editar-venda-entrada-vacina", v)
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
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-white">
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
        </div>
      </main>
    </div>
  );
}
