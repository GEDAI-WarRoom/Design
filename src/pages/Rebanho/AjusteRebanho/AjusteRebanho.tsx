import { Fragment, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Dna,
  Eye,
  Pencil,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  ESTABELECIMENTOS_REBANHO_MOCK,
  EXPLORACOES_REBANHO_MOCK,
  formatarData,
  formatarLancamentos,
  listarAjustesRebanho,
  NUCLEOS_REBANHO_MOCK,
  PRODUTORES_REBANHO_MOCK,
  SITUACOES_AJUSTE_REBANHO,
  totalFemeas,
  totalMachos,
  type AjusteRebanho,
  type EstabelecimentoRebanho,
  type ExploracaoRebanho,
  type NucleoRebanho,
  type ProdutorRebanho,
} from "./ajusteRebanhoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

type SortField =
  | "estabelecimento"
  | "exploracao"
  | "nucleo"
  | "especie"
  | "machos"
  | "femeas"
  | "data";

const ESPECIES = Array.from(
  new Set(EXPLORACOES_REBANHO_MOCK.map((item) => item.especie)),
).map((nome, index) => ({ id: index + 1, nome }));

function SortHeader({
  label,
  field,
  onSort,
  currentSort,
}: {
  label: string;
  field: SortField;
  onSort: (field: SortField) => void;
  currentSort: {
    field: SortField;
    direction: "asc" | "desc";
  };
}) {
  const active = currentSort.field === field;

  return (
    <th className="min-w-[145px] px-3 py-3 text-left text-xs font-semibold uppercase text-gray-700">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 transition hover:text-[#1A7A3C]"
      >
        {label}
        {active && currentSort.direction === "asc" ? (
          <ArrowUp size={14} className="text-[#1A7A3C]" />
        ) : (
          <ArrowDown
            size={14}
            className={active ? "text-[#1A7A3C]" : "text-gray-400"}
          />
        )}
      </button>
    </th>
  );
}

function LancamentosCell({
  item,
  sex,
  expanded,
  onToggle,
}: {
  item: AjusteRebanho;
  sex: "machos" | "femeas";
  expanded: boolean;
  onToggle: () => void;
}) {
  const lancamentos = formatarLancamentos(item.faixas, sex);
  const first = lancamentos[0];

  if (!first) return <span>-</span>;

  if (expanded) {
    return (
      <div className="leading-5">
        {lancamentos.map((lancamento) => (
          <p key={lancamento.faixa} className="whitespace-nowrap">
            {lancamento.faixa} ({lancamento.quantidade})
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="leading-5">
      <p>
        {first.faixa} ({first.quantidade})
      </p>
      {lancamentos.length > 1 && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="font-medium text-[#1A7A3C] transition hover:underline"
        >
          (e mais {lancamentos.length - 1})
        </button>
      )}
    </div>
  );
}

export function AjusteRebanhoPage({ onLogout, onNavigate }: PageProps) {
  const [produtor, setProdutor] = useState<ProdutorRebanho | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<EstabelecimentoRebanho | null>(null);
  const [exploracao, setExploracao] = useState<ExploracaoRebanho | null>(null);
  const [nucleo, setNucleo] = useState<NucleoRebanho | null>(null);
  const [especie, setEspecie] = useState<{ id: number; nome: string } | null>(
    null,
  );
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    field: SortField;
    direction: "asc" | "desc";
  }>({ field: "data", direction: "desc" });
  const perPage = 5;

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
    if (!hasSearched) return [];

    const filtered = listarAjustesRebanho().filter((item) => {
      const matchProdutor = !produtor || item.produtor.id === produtor.id;
      const matchEstabelecimento =
        !estabelecimento || item.estabelecimento.id === estabelecimento.id;
      const matchExploracao =
        !exploracao || item.exploracao.id === exploracao.id;
      const matchNucleo = !nucleo || item.nucleo?.id === nucleo.id;
      const matchEspecie =
        !especie || item.exploracao.especie === especie.nome;
      const matchDe = !periodoDe || item.dataLancamento >= periodoDe;
      const matchAte = !periodoAte || item.dataLancamento <= periodoAte;
      const matchSituacao = !situacao || item.situacao === situacao;

      return (
        matchProdutor &&
        matchEstabelecimento &&
        matchExploracao &&
        matchNucleo &&
        matchEspecie &&
        matchDe &&
        matchAte &&
        matchSituacao
      );
    });

    return [...filtered].sort((a, b) => {
      const valueFor = (item: AjusteRebanho) => {
        switch (sort.field) {
          case "estabelecimento":
            return `${item.estabelecimento.codigo} ${item.estabelecimento.nome}`;
          case "exploracao":
            return item.exploracao.codigo;
          case "nucleo":
            return item.nucleo?.codigo ?? "";
          case "especie":
            return item.exploracao.especie;
          case "machos":
            return totalMachos(item.faixas);
          case "femeas":
            return totalFemeas(item.faixas);
          case "data":
            return item.dataLancamento;
        }
      };
      const aValue = valueFor(a);
      const bValue = valueFor(b);
      const result =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue), "pt-BR");
      return sort.direction === "asc" ? result : -result;
    });
  }, [
    estabelecimento,
    especie,
    exploracao,
    hasSearched,
    nucleo,
    periodoAte,
    periodoDe,
    produtor,
    situacao,
    sort,
  ]);

  const pesquisar = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!produtor) {
      setError("Selecione o produtor para realizar a pesquisa.");
      setHasSearched(false);
      return;
    }
    if (periodoDe && periodoDe > today) {
      setError("A data do campo Período - De deve ser menor ou igual à data atual.");
      setHasSearched(false);
      return;
    }
    if (periodoAte && periodoAte > today) {
      setError("A data do campo Período - Até deve ser menor ou igual à data atual.");
      setHasSearched(false);
      return;
    }
    if (periodoDe && periodoAte && periodoDe > periodoAte) {
      setError(
        "A data do campo Período - Até deve ser maior ou igual à data do campo Período - De.",
      );
      setHasSearched(false);
      return;
    }

    setError("");
    setHasSearched(true);
    setPage(1);
  };

  const changeSort = (field: SortField) => {
    setSort((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(resultados.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = resultados.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, resultados.length);
  const rows = resultados.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="ajuste-rebanho"
        hideSearch
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
        >
          <ArrowLeft size={15} /> Inicial
        </button>

        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Ajuste de Rebanho
          </h1>
          <button
            type="button"
            onClick={() => onNavigate("adicionar-ajuste-rebanho")}
            className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15612F] active:scale-[0.98]"
          >
            Adicionar Novo
          </button>
        </div>

        <section className="overflow-visible rounded-xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:p-6">
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_150px]">
              <EntitySearchInput
                label="Produtor"
                placeholder="Buscar por nome ou CPF/CNPJ."
                required
                value={produtor?.nome ?? ""}
                data={PRODUTORES_REBANHO_MOCK}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome / Razão Social", key: "nome" },
                  { label: "CPF / CNPJ", key: "documento" },
                ]}
                icon={
                  <img
                    src={Icons.iconeProdutorUrl}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                }
                title="Buscar Produtor"
                subtitle="Busque por uma pessoa física ou jurídica produtora cadastrada no sistema:"
                onChange={(item) => {
                  setProdutor(item);
                  setEstabelecimento(null);
                  setExploracao(null);
                  setNucleo(null);
                  setError("");
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
                  { label: "Estabelecimento", key: "nome" },
                  { label: "Município", key: "municipio" },
                ]}
                icon={
                  <img
                    src={Icons.iconeEstabelecimentoUrl}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                }
                onChange={(item) => {
                  setEstabelecimento(item);
                  setExploracao(null);
                  setNucleo(null);
                }}
              />

              <EntitySearchInput
                label="Exploração Pecuária"
                placeholder="Buscar por código ou espécie."
                value={exploracao?.codigo ?? ""}
                data={exploracoes}
                searchKeys={["codigo", "especie", "grupo"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Grupo", key: "grupo" },
                  { label: "Espécie", key: "especie" },
                ]}
                icon={
                  <img
                    src={Icons.iconeExploracaoUrl}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                }
                onChange={(item) => {
                  setExploracao(item);
                  setNucleo(null);
                }}
              />

              <EntitySearchInput
                label="Núcleo de Produção"
                placeholder="Buscar por código ou nome."
                value={nucleo?.nome ?? ""}
                data={nucleos}
                searchKeys={["codigo", "nome"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Núcleo de Produção", key: "nome" },
                ]}
                icon={
                  <img
                    src={Icons.iconeNucleoProducaoUrl}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                }
                onChange={setNucleo}
              />

              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]"
              >
                Pesquisar
              </button>
            </div>

            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-4">
              <EntitySearchInput
                label="Espécie"
                placeholder="Buscar pelo nome da espécie."
                value={especie?.nome ?? ""}
                data={ESPECIES}
                searchKeys={["nome"]}
                columns={[{ label: "Espécie", key: "nome" }]}
                icon={<Dna size={18} color={GREEN} />}
                onChange={setEspecie}
              />
              <FloatInput
                label="Período - De"
                type="date"
                value={periodoDe}
                onChange={setPeriodoDe}
                icon={<CalendarDays size={17} />}
              />
              <FloatInput
                label="Período - Até"
                type="date"
                value={periodoAte}
                onChange={setPeriodoAte}
                icon={<CalendarDays size={17} />}
              />
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_AJUSTE_REBANHO}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
          </div>

          {!hasSearched ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Busque por ajuste de rebanho utilizando os filtros acima.
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Nenhum resultado foi encontrado.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1320px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="w-10 px-3 py-3" />
                      <th className="min-w-[210px] px-3 py-3 text-left text-xs font-semibold uppercase text-gray-700">
                        Produtor
                      </th>
                      <SortHeader
                        label="Estabelecimento Agropecuário"
                        field="estabelecimento"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Exploração Pecuária"
                        field="exploracao"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Núcleo de Produção"
                        field="nucleo"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Espécie"
                        field="especie"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Machos Lançados"
                        field="machos"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Fêmeas Lançadas"
                        field="femeas"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <SortHeader
                        label="Data de Lançamento"
                        field="data"
                        onSort={changeSort}
                        currentSort={sort}
                      />
                      <th className="w-[100px] px-3 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => (
                      <Fragment key={item.id}>
                        <tr
                          className="border-b border-gray-100 transition hover:bg-gray-50/70"
                        >
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId((current) =>
                                  current === item.id ? null : item.id,
                                )
                              }
                              className="rounded p-1 text-gray-600 hover:bg-gray-100"
                              title="Exibir todas as faixas etárias"
                            >
                              <ChevronRight
                                size={16}
                                className={`transition-transform ${
                                  expandedId === item.id ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {item.produtor.nome} - {item.produtor.documento}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {item.estabelecimento.codigo} -{" "}
                            {item.estabelecimento.nome}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {item.exploracao.codigo}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {item.nucleo
                              ? `${item.nucleo.codigo} - ${item.nucleo.nome}`
                              : "-"}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {item.exploracao.especie}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            <LancamentosCell
                              item={item}
                              sex="machos"
                              expanded={expandedId === item.id}
                              onToggle={() =>
                                setExpandedId((current) =>
                                  current === item.id ? null : item.id,
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            <LancamentosCell
                              item={item}
                              sex="femeas"
                              expanded={expandedId === item.id}
                              onToggle={() =>
                                setExpandedId((current) =>
                                  current === item.id ? null : item.id,
                                )
                              }
                            />
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {formatarData(item.dataLancamento)}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate(
                                    "visualizar-ajuste-rebanho",
                                    item,
                                  )
                                }
                                className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"
                                title="Visualizar"
                              >
                                <Eye size={18} />
                              </button>
                              {item.situacao === "Ativo" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigate("editar-ajuste-rebanho", item)
                                  }
                                  className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"
                                  title="Editar"
                                >
                                  <Pencil size={17} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    Mostrando de {start} a {end} de {resultados.length}{" "}
                    resultados
                  </span>
                  <div className="flex items-center gap-1 text-[#1A7A3C]">
                    <button
                      type="button"
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                      disabled={currentPage === 1}
                      className="rounded p-1 disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((value) => Math.min(totalPages, value + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded p-1 disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
