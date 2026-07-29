import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Dna
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  ESTABELECIMENTOS_REBANHO_MOCK,
  EXPLORACOES_REBANHO_MOCK,
  formatarDataRebanho,
  listarLancamentosRebanho,
  NUCLEOS_REBANHO_MOCK,
  PRODUTORES_REBANHO_MOCK,
  resumirAnimais,
  tiposPermitidos,
  type EstabelecimentoRebanho,
  type ExploracaoRebanho,
  type NucleoRebanho,
  type ProdutorRebanho,
} from "./lancamentoRebanhoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

type SortKey = "especie" | "tipo" | "machos" | "femeas" | "data";

const ESPECIES = Array.from(
  new Map(
    EXPLORACOES_REBANHO_MOCK.map((item) => [
      item.especie,
      { id: item.especie, nome: item.especie, grupo: item.grupo },
    ]),
  ).values(),
);

function SortButton({
  label,
  field,
  onSort,
}: {
  label: string;
  field: SortKey;
  onSort: (field: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 text-left transition hover:text-gray-900"
    >
      {label} <ArrowUpDown size={13} />
    </button>
  );
}

export function LancamentoRebanhoPage({ onLogout, onNavigate }: PageProps) {
  const [produtor, setProdutor] = useState<ProdutorRebanho | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoRebanho | null>(null);
  const [exploracao, setExploracao] = useState<ExploracaoRebanho | null>(null);
  const [nucleo, setNucleo] = useState<NucleoRebanho | null>(null);
  const [especie, setEspecie] = useState<{ id: string; nome: string; grupo: string } | null>(null);
  const [tipo, setTipo] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [erro, setErro] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ field: SortKey; direction: "asc" | "desc" }>({
    field: "data",
    direction: "desc",
  });
  const perPage = 10;
  const hoje = new Date().toISOString().slice(0, 10);

  const estabelecimentos = ESTABELECIMENTOS_REBANHO_MOCK.filter(
    (item) => !produtor || item.produtorIds.includes(produtor.id),
  );
  const exploracoes = EXPLORACOES_REBANHO_MOCK.filter(
    (item) =>
      (!produtor || item.produtorId === produtor.id) &&
      (!estabelecimento || item.estabelecimentoId === estabelecimento.id),
  );
  const nucleos = NUCLEOS_REBANHO_MOCK.filter(
    (item) => !exploracao || item.exploracaoId === exploracao.id,
  );

  const resultados = useMemo(() => {
    const filtrados = listarLancamentosRebanho().filter((registro) => {
      const matchProdutor = !produtor || registro.produtor.id === produtor.id;
      const matchEstabelecimento = !estabelecimento || registro.estabelecimento.id === estabelecimento.id;
      const matchExploracao = !exploracao || registro.exploracao.id === exploracao.id;
      const matchNucleo = !nucleo || registro.nucleo?.id === nucleo.id;
      const matchEspecie = !especie || registro.exploracao.especie === especie.nome;
      const matchTipo = !tipo || registro.lancamentos.some((item) => item.tipo === tipo);
      const matchPeriodo =
        (!periodoDe || registro.dataLancamento >= periodoDe) &&
        (!periodoAte || registro.dataLancamento <= periodoAte);
      const matchSituacao = !situacao || registro.situacao === situacao;
      return (
        matchProdutor &&
        matchEstabelecimento &&
        matchExploracao &&
        matchNucleo &&
        matchEspecie &&
        matchTipo &&
        matchPeriodo &&
        matchSituacao
      );
    });

    const sortValue = (registro: (typeof filtrados)[number]) => {
      if (sort.field === "especie") return registro.exploracao.especie;
      if (sort.field === "tipo") return registro.lancamentos.map((item) => item.tipo).join(", ");
      if (sort.field === "machos") return resumirAnimais(registro, "machos");
      if (sort.field === "femeas") return resumirAnimais(registro, "femeas");
      return registro.dataLancamento;
    };

    return [...filtrados].sort((a, b) => {
      const result = sortValue(a).localeCompare(sortValue(b), "pt-BR", { numeric: true });
      return sort.direction === "asc" ? result : -result;
    });
  }, [
    estabelecimento,
    especie,
    exploracao,
    nucleo,
    periodoAte,
    periodoDe,
    produtor,
    situacao,
    sort,
    tipo,
  ]);

  const pesquisar = () => {
    if (!produtor) {
      setErro("Selecione o produtor para pesquisar.");
      setHasSearched(false);
      return;
    }
    if (periodoDe && periodoDe > hoje) {
      setErro("A data inicial do período deve ser menor ou igual à data atual.");
      setHasSearched(false);
      return;
    }
    if (periodoAte && (periodoAte < periodoDe || periodoAte > hoje)) {
      setErro("A data final deve ser maior ou igual à data inicial e menor ou igual à data atual.");
      setHasSearched(false);
      return;
    }
    setErro("");
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (field: SortKey) => {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(resultados.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = resultados.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, resultados.length);
  const rows = resultados.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-rebanho" hideSearch />

      <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
        >
          <ArrowLeft size={15} /> Inicial
        </button>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Lançamento de Rebanho</h1>
          <button
            type="button"
            onClick={() => onNavigate("adicionar-lancamento-rebanho")}
            className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15612F]"
          >
            Adicionar Novo
          </button>
        </div>

        <section className="overflow-visible rounded-xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5">
            <div
              className={`grid grid-cols-1 items-end gap-3 md:grid-cols-2 ${
                exploracao?.possuiNucleo
                  ? "xl:grid-cols-[1.4fr_1.4fr_1fr_1fr_120px]"
                  : "xl:grid-cols-[1.4fr_1.4fr_1fr_120px]"
              }`}
            >
              <EntitySearchInput
                label="Produtor"
                placeholder="Buscar por nome, CPF ou CNPJ."
                required
                value={produtor?.nome ?? ""}
                data={PRODUTORES_REBANHO_MOCK}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome / Razão Social", key: "nome" },
                  { label: "CPF / CNPJ", key: "documento" },
                ]}
                icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
                title="Buscar Produtor"
                subtitle="Busque por uma pessoa física ou jurídica cadastrada como produtora:"
                onChange={(item) => {
                  setProdutor(item);
                  setEstabelecimento(null);
                  setExploracao(null);
                  setNucleo(null);
                  setErro("");
                  setHasSearched(false);
                }}
              />
              <EntitySearchInput
                label="Estabelecimento Agropecuário"
                placeholder="Buscar por código ou nome."
                value={estabelecimento?.nome ?? ""}
                data={estabelecimentos}
                searchKeys={["codigo", "nome", "municipio"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Nome", key: "nome" },
                  { label: "Município", key: "municipio" },
                ]}
                icon={<img src={Icons.iconeEstabelecimentoUrl} alt="" className="h-5 w-5 object-contain" />}
                onChange={(item) => {
                  setEstabelecimento(item);
                  setExploracao(null);
                  setNucleo(null);
                  setHasSearched(false);
                }}
              />
              <EntitySearchInput
                label="Exploração Pecuária"
                placeholder="Buscar pelo código."
                value={exploracao?.codigo ?? ""}
                data={exploracoes}
                searchKeys={["codigo", "especie", "grupo"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Espécie", key: "especie" },
                ]}
                icon={<img src={Icons.iconeExploracaoUrl} alt="" className="h-5 w-5 object-contain" />}
                onChange={(item) => {
                  setExploracao(item);
                  setNucleo(null);
                  setHasSearched(false);
                }}
              />
              {exploracao?.possuiNucleo && (
                <EntitySearchInput
                  label="Núcleo de Produção"
                  placeholder="Buscar por código ou nome."
                  value={nucleo?.nome ?? ""}
                  data={nucleos}
                  searchKeys={["codigo", "nome"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Nome", key: "nome" },
                  ]}
                  icon={<img src={Icons.iconeNucleoProducaoUrl} alt="" className="h-5 w-5 object-contain" />}
                  onChange={(item) => {
                    setNucleo(item);
                    setHasSearched(false);
                  }}
                />
              )}
              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]"
              >
                Pesquisar
              </button>
            </div>

            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-5">
                <EntitySearchInput
                  label="Espécie"
                  placeholder="Buscar pelo nome."
                  value={especie?.nome ?? ""}
                  data={ESPECIES}
                  searchKeys={["nome", "grupo"]}
                  columns={[
                    { label: "Espécie", key: "nome" },
                    { label: "Grupo", key: "grupo" },
                  ]}
                   icon={<Dna size={17} />}
                  onChange={setEspecie}
                />
                <FloatSelect
                  label="Tipo de Lançamento"
                  value={tipo}
                  onChange={setTipo}
                  options={tiposPermitidos(null).map((item) => ({ value: item, label: item }))}
                />
                <FloatInput
                  label="Período - De"
                  type="date"
                  value={periodoDe}
                  onChange={setPeriodoDe}
                  icon={<Calendar size={17} />}
                />
                <FloatInput
                  label="Período - Até"
                  type="date"
                  value={periodoAte}
                  onChange={setPeriodoAte}
                  icon={<Calendar size={17} />}
                />
                <FloatSelect
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={[
                    { value: "Ativo", label: "Ativo" },
                    { value: "Inativo", label: "Inativo" },
                  ]}
                />
            </div>
            {erro && <p className="text-sm font-medium text-red-500">{erro}</p>}
          </div>

          {!hasSearched ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Busque por um lançamento de rebanho utilizando o campo de busca e os filtros acima.
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1380px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-600">
                      <th className="px-4 py-3 font-semibold">Produtor</th>
                      <th className="px-4 py-3 font-semibold">Estabelecimento Agropecuário</th>
                      <th className="px-4 py-3 font-semibold">Exploração Pecuária</th>
                      <th className="px-4 py-3 font-semibold">Núcleo de Produção</th>
                      <th className="px-4 py-3 font-semibold">Espécies</th>
                      <th className="px-4 py-3 font-semibold">Tipo de Lançamento </th>
                      <th className="px-4 py-3 font-semibold"> Machos Lançados</th>
                      <th className="px-4 py-3 font-semibold">Fêmeas Lançadas</th>
                      <th className="px-4 py-3 font-semibold">Data de Lançamento </th>
                      <th className="px-4 py-3 font-semibold">Situação</th>
                      <th className="px-4 py-3 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((registro) => (
                      <tr key={registro.id} className="border-b border-gray-100 align-top text-gray-600 hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <span className="block font-medium text-gray-700">{registro.produtor.nome}</span>
                          <span className="text-xs">{registro.produtor.documento}</span>
                        </td>
                        <td className="px-4 py-3">{registro.estabelecimento.codigo} - {registro.estabelecimento.nome}</td>
                        <td className="px-4 py-3">{registro.exploracao.codigo}</td>
                        <td className="px-4 py-3">{registro.nucleo ? `${registro.nucleo.codigo} - ${registro.nucleo.nome}` : "—"}</td>
                        <td className="px-4 py-3">{registro.exploracao.especie}</td>
                        <td className="px-4 py-3">{registro.lancamentos.map((item) => item.tipo).join(", ")}</td>
                        <td className="max-w-[230px] px-4 py-3 text-xs leading-5">{resumirAnimais(registro, "machos") || "—"}</td>
                        <td className="max-w-[230px] px-4 py-3 text-xs leading-5">{resumirAnimais(registro, "femeas") || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatarDataRebanho(registro.dataLancamento)}</td>
                        <td className="px-4 py-3">{registro.situacao}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-lancamento-rebanho", registro)}
                            title="Visualizar"
                            className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 px-5 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-3">
                  <span>Mostrando de {start} a {end} de {resultados.length} resultados</span>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="text-[#1A7A3C] disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="text-[#1A7A3C] disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
