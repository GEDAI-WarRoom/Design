import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  dadosProdutorConfirmados,
  ESTABELECIMENTOS_ATUALIZACAO,
  listarAtualizacoesCadastrais,
  PRODUTORES_ATUALIZACAO,
  SITUACOES_ATUALIZACAO,
  USUARIO_REBANHO_MOCK,
  type AtualizacaoCadastralRebanho,
  type EstabelecimentoAtualizacao,
  type ProdutorTitular,
} from "./atualizacaoCadastralRebanhoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

type Ordenacao = "etapa" | "estabelecimento" | "situacao";

export function AtualizacaoCadastralRebanhoPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const usuarioEhProdutor = USUARIO_REBANHO_MOCK.papel === "Produtor";
  const produtorDoUsuario = usuarioEhProdutor
    ? PRODUTORES_ATUALIZACAO.find(
        (item) => item.documento === USUARIO_REBANHO_MOCK.produtorDocumento,
      ) ?? PRODUTORES_ATUALIZACAO[0]
    : null;
  const [produtor, setProdutor] = useState<ProdutorTitular | null>(
    produtorDoUsuario,
  );
  const [estabelecimento, setEstabelecimento] =
    useState<EstabelecimentoAtualizacao | null>(null);
  const [etapa, setEtapa] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisado, setPesquisado] = useState(false);
  const [erroProdutor, setErroProdutor] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("etapa");
  const [ordemAscendente, setOrdemAscendente] = useState(false);
  const itensPorPagina = 10;

  const estabelecimentosDisponiveis = useMemo(
    () =>
      produtor
        ? ESTABELECIMENTOS_ATUALIZACAO.filter(
            (item) => item.produtorDocumento === produtor.documento,
          )
        : [],
    [produtor],
  );

  const resultados = useMemo(() => {
    if (!produtor) return [];
    const filtrados = listarAtualizacoesCadastrais().filter(
      (item) =>
        item.produtor.documento === produtor.documento &&
        (!estabelecimento ||
          item.estabelecimento.codigo === estabelecimento.codigo) &&
        (!etapa || item.etapa === etapa) &&
        (!situacao || item.situacao === situacao),
    );

    return [...filtrados].sort((a, b) => {
      const valorA =
        ordenacao === "etapa"
          ? a.etapa
          : ordenacao === "estabelecimento"
            ? a.estabelecimento.nome
            : a.situacao;
      const valorB =
        ordenacao === "etapa"
          ? b.etapa
          : ordenacao === "estabelecimento"
            ? b.estabelecimento.nome
            : b.situacao;
      const resultado = valorA.localeCompare(valorB, "pt-BR");
      return ordemAscendente ? resultado : -resultado;
    });
  }, [
    produtor,
    estabelecimento,
    etapa,
    situacao,
    pesquisado,
    ordenacao,
    ordemAscendente,
  ]);

  const pesquisar = () => {
    if (!produtor) {
      setErroProdutor(true);
      setPesquisado(false);
      return;
    }
    setErroProdutor(false);
    setPesquisado(true);
    setPagina(1);
  };

  const alterarOrdenacao = (campo: Ordenacao) => {
    if (ordenacao === campo) {
      setOrdemAscendente((valor) => !valor);
      return;
    }
    setOrdenacao(campo);
    setOrdemAscendente(true);
  };

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = resultados.length ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fim = Math.min(paginaAtual * itensPorPagina, resultados.length);
  const linhas = resultados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  const abrirAtualizacao = (atualizacao: AtualizacaoCadastralRebanho) => {
    if (dadosProdutorConfirmados(atualizacao)) {
      onNavigate("visualizar-atualizacao-cadastral-rebanho", { atualizacaoId: atualizacao.id });
      return;
    }
    onNavigate("confirmar-dados-produtor-rebanho", { atualizacaoId: atualizacao.id });
  };

  const SortHeader = ({
    campo,
    children,
  }: {
    campo: Ordenacao;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => alterarOrdenacao(campo)}
      className="flex items-center justify-between gap-2 w-full text-left uppercase"
    >
      <span>{children}</span>
      <ArrowDown
        size={15}
        className={`text-gray-500 transition ${
          ordenacao === campo && ordemAscendente ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="atualizacao-cadastral-rebanho"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Atualização Cadastral de Rebanho
          </h1>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_auto] gap-3 items-end">
            {usuarioEhProdutor ? (
              <FloatInput
                label="Produtor Titular"
                required
                value={produtor?.nome ?? ""}
                disabled
                icon={
                  <img
                    src={Icons.iconeProdutorUrl}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                }
              />
            ) : (
              <EntitySearchInput
                label="Produtor Titular"
                required
                placeholder="Buscar por nome, CPF ou CNPJ."
                value={produtor?.nome ?? ""}
                data={PRODUTORES_ATUALIZACAO}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome / Razão Social", key: "nome" },
                  { label: "CPF / CNPJ", key: "documento" },
                ]}
                icon={
                  <img
                    src={Icons.iconeProdutorUrl}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                }
                title="Buscar Produtor Titular"
                subtitle="Busque por um produtor cadastrado no sistema:"
                searchPlaceholder="Buscar por nome, CPF ou CNPJ"
                onChange={(entidade) => {
                  setProdutor(entidade);
                  setEstabelecimento(null);
                  setPesquisado(false);
                  setErroProdutor(false);
                }}
              />
            )}

            <div className={!produtor ? "pointer-events-none opacity-60" : ""}>
              <EntitySearchInput
                label="Estabelecimento Agropecuário"
                placeholder={
                  produtor
                    ? "Buscar por nome ou código."
                    : "Informe primeiro o produtor titular."
                }
                value={estabelecimento?.nome ?? ""}
                data={estabelecimentosDisponiveis}
                searchKeys={["nome", "codigo", "municipio"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Estabelecimento", key: "nome" },
                  { label: "Município", key: "municipio" },
                ]}
                icon={
                  <img
                    src={Icons.iconeEstabelecimentoUrl}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                }
                title="Buscar Estabelecimento Agropecuário"
                subtitle="Estabelecimentos nos quais o produtor informado é titular:"
                searchPlaceholder="Buscar por nome ou código"
                onChange={(entidade) => {
                  setEstabelecimento(entidade);
                  setPesquisado(false);
                }}
              />
            </div>

            <button
              type="button"
              onClick={pesquisar}
              className={`h-12 px-7 rounded-md text-sm font-semibold border transition ${
                produtor
                  ? "bg-[#1A7A3C] border-[#1A7A3C] text-white hover:bg-[#15612F]"
                  : "bg-white border-[#1A7A3C] text-[#1A7A3C]"
              }`}
            >
              Pesquisar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FloatInput
              label="Etapa de Atualização Cadastral"
              value={etapa}
              placeholder="AAAA/NN"
              maxLength={7}
              onChange={(valor) => {
                const numeros = valor.replace(/\D/g, "").slice(0, 6);
                setEtapa(
                  numeros.length > 4
                    ? `${numeros.slice(0, 4)}/${numeros.slice(4)}`
                    : numeros,
                );
                setPesquisado(false);
              }}
            />
            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={(valor) => {
                setSituacao(valor);
                setPesquisado(false);
              }}
              options={SITUACOES_ATUALIZACAO}
            />
          </div>

          {erroProdutor && (
            <p className="text-sm font-medium text-red-500">
              Informe o produtor titular para realizar a busca.
            </p>
          )}

          {!pesquisado ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Busque por atualização cadastral utilizando os filtros acima.
            </div>
          ) : resultados.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Nenhuma atualização cadastral foi encontrada.
            </div>
          ) : (
            <>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex min-h-[98px]">
                  <div className="w-1.5 bg-[#009b57]" />
                  <div className="w-full sm:w-64 bg-[#eff8f3] px-8 py-6">
                    <p className="text-base font-bold text-gray-900">
                      {produtor?.nome}
                    </p>
                    <p className="text-sm text-gray-500">{produtor?.documento}</p>
                    <p className="text-xs text-gray-500">Produtor Titular</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-y border-gray-200">
                      <th className="text-left px-3 py-3 font-semibold text-gray-700 min-w-[190px]">
                        <SortHeader campo="etapa">
                          Etapa de Atualização Cadastral
                        </SortHeader>
                      </th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-700 min-w-[280px]">
                        <SortHeader campo="estabelecimento">
                          Estabelecimento Agropecuário
                        </SortHeader>
                      </th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-700 min-w-[230px]">
                        <SortHeader campo="situacao">Situação</SortHeader>
                      </th>
                      <th className="text-center px-3 py-3 font-semibold text-gray-700 w-20">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50/60"
                      >
                        <td className="px-3 py-4 text-gray-500">{item.etapa}</td>
                        <td className="px-3 py-4 text-gray-500">
                          {item.estabelecimento.nome} - {item.estabelecimento.codigo}
                        </td>
                        <td className="px-3 py-4 text-gray-500">{item.situacao}</td>
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => abrirAtualizacao(item)}
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                            title="Visualizar item"
                            aria-label={`Visualizar atualização ${item.etapa}`}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 text-sm text-gray-500">
                <span>Itens por página: {itensPorPagina}</span>
                <div className="flex items-center gap-4">
                  <span>
                    Mostrando de {inicio} a {fim} de {resultados.length} resultados
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPagina((valor) => Math.max(1, valor - 1))}
                      disabled={paginaAtual === 1}
                      className="p-1.5 text-[#1A7A3C] disabled:opacity-30"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPagina((valor) => Math.min(totalPaginas, valor + 1))
                      }
                      disabled={paginaAtual === totalPaginas}
                      className="p-1.5 text-[#1A7A3C] disabled:opacity-30"
                      aria-label="Próxima página"
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
