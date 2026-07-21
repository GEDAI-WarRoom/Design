import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

interface Estabelecimento {
  id: number;
  nome: string;
  documento: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
}

type SituacaoNotificacao =
  | "Não assinado"
  | "Assinado"
  | "Assinado automaticamente";

interface NotificacaoEstabelecimento {
  id: number;
  estabelecimentoId: number;
  estabelecimento: string;
  tipoNotificacao: string;
  mes: string;
  ano: string;
  valorUfemg: number;
  valorOriginal: number;
  dataNotificacao: string;
  dataCiencia: string;
  situacao: SituacaoNotificacao;
}

const ESTABELECIMENTOS: Estabelecimento[] = [
  {
    id: 1,
    nome: "Agropecuária Vale Verde Ltda.",
    documento: "12.345.678/0001-90",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Agropecuária Vale Verde Ltda.",
    nomeFantasia: "Vale Verde Agro",
  },
  {
    id: 2,
    nome: "Nutrição Animal Planalto S.A.",
    documento: "98.765.432/0001-10",
    cnpj: "98.765.432/0001-10",
    razaoSocial: "Nutrição Animal Planalto S.A.",
    nomeFantasia: "NutriPlan",
  },
  {
    id: 3,
    nome: "Cooperativa de Produtores Unidos",
    documento: "55.444.333/0002-22",
    cnpj: "55.444.333/0002-22",
    razaoSocial: "Cooperativa de Produtores Unidos",
    nomeFantasia: "Coop Unidos",
  },
  {
    id: 4,
    nome: "Comercial Agropecuária Mineira Ltda.",
    documento: "08.246.135/0001-47",
    cnpj: "08.246.135/0001-47",
    razaoSocial: "Comercial Agropecuária Mineira Ltda.",
    nomeFantasia: "Agro Minas",
  },
];

const NOTIFICACOES: NotificacaoEstabelecimento[] = [
  {
    id: 1,
    estabelecimentoId: 1,
    estabelecimento: "Agropecuária Vale Verde Ltda.",
    tipoNotificacao: "Taxa de fiscalização sanitária",
    mes: "Julho",
    ano: "2026",
    valorUfemg: 12.5,
    valorOriginal: 713.88,
    dataNotificacao: "05/07/2026",
    dataCiencia: "06/07/2026",
    situacao: "Assinado",
  },
  {
    id: 2,
    estabelecimentoId: 2,
    estabelecimento: "Nutrição Animal Planalto S.A.",
    tipoNotificacao: "Renovação de registro",
    mes: "Julho",
    ano: "2026",
    valorUfemg: 8,
    valorOriginal: 456.88,
    dataNotificacao: "03/07/2026",
    dataCiencia: "03/07/2026",
    situacao: "Assinado automaticamente",
  },
  {
    id: 3,
    estabelecimentoId: 3,
    estabelecimento: "Cooperativa de Produtores Unidos",
    tipoNotificacao: "Taxa de inspeção",
    mes: "Junho",
    ano: "2026",
    valorUfemg: 15.75,
    valorOriginal: 899.47,
    dataNotificacao: "10/06/2026",
    dataCiencia: "—",
    situacao: "Não assinado",
  },
  {
    id: 4,
    estabelecimentoId: 4,
    estabelecimento: "Comercial Agropecuária Mineira Ltda.",
    tipoNotificacao: "Taxa de fiscalização sanitária",
    mes: "Junho",
    ano: "2026",
    valorUfemg: 10,
    valorOriginal: 571.1,
    dataNotificacao: "02/06/2026",
    dataCiencia: "04/06/2026",
    situacao: "Assinado",
  },
  {
    id: 5,
    estabelecimentoId: 1,
    estabelecimento: "Agropecuária Vale Verde Ltda.",
    tipoNotificacao: "Renovação de registro",
    mes: "Maio",
    ano: "2026",
    valorUfemg: 8,
    valorOriginal: 456.88,
    dataNotificacao: "06/05/2026",
    dataCiencia: "06/05/2026",
    situacao: "Assinado automaticamente",
  },
  {
    id: 6,
    estabelecimentoId: 2,
    estabelecimento: "Nutrição Animal Planalto S.A.",
    tipoNotificacao: "Taxa de inspeção",
    mes: "Abril",
    ano: "2026",
    valorUfemg: 11.25,
    valorOriginal: 642.49,
    dataNotificacao: "08/04/2026",
    dataCiencia: "—",
    situacao: "Não assinado",
  },
];

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
].map((mes) => ({ value: mes, label: mes }));

const SITUACOES: Array<{ value: SituacaoNotificacao; label: string }> = [
  { value: "Não assinado", label: "Não assinado" },
  { value: "Assinado", label: "Assinado" },
  {
    value: "Assinado automaticamente",
    label: "Assinado automaticamente",
  },
];

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

// 🌟 Formatação ajustada para 2 casas decimais
const formatarUfemg = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

function FiltroAtivo({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 transition hover:opacity-80"
        aria-label={`Remover filtro ${label}`}
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

export function NotificacoesEstabelecimentosPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [estabelecimento, setEstabelecimento] =
    useState<Estabelecimento | null>(null);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisaRealizada, setPesquisaRealizada] = useState(false);
  const [erroAno, setErroAno] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const resultados = useMemo(
    () =>
      NOTIFICACOES.filter(
        (notificacao) =>
          (!estabelecimento ||
            notificacao.estabelecimentoId === estabelecimento.id) &&
          (!mes || notificacao.mes === mes) &&
          (!ano || notificacao.ano === ano) &&
          (!situacao || notificacao.situacao === situacao),
      ),
    [ano, estabelecimento, mes, situacao],
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(resultados.length / itensPorPagina),
  );
  const pagina = Math.min(paginaAtual, totalPaginas);
  const itens = resultados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina,
  );
  const inicio = resultados.length
    ? (pagina - 1) * itensPorPagina + 1
    : 0;
  const fim = Math.min(pagina * itensPorPagina, resultados.length);

  const pesquisar = () => {
    const anoInvalido = ano.length > 0 && ano.length !== 4;
    setErroAno(anoInvalido);
    if (anoInvalido) {
      return;
    }
    setPesquisaRealizada(true);
    setPaginaAtual(1);
  };

  const atualizarAno = (valor: string) => {
    setAno(valor.replace(/\D/g, "").slice(0, 4));
    setErroAno(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="notificacoes-estabelecimentos"
        hideSearch
      />

      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
        >
          <ArrowLeft size={15} />
          Inicial
        </button>

        <h1 className="mb-4 text-2xl font-semibold text-gray-900">
          Notificações dos Estabelecimentos
        </h1>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
          {/* 1ª LINHA: ESTABELECIMENTO + BOTÃO PESQUISAR */}
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <EntitySearchInput
                label="Estabelecimento"
                placeholder="Buscar por razão social ou CNPJ..."
                value={estabelecimento?.nome || ""}
                data={ESTABELECIMENTOS}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Razão Social / Nome", key: "nome" },
                  { label: "CNPJ", key: "documento" },
                ]}
                icon={
                  <img
                    src={Icons.iconePessoaJuridicaUrl}
                    alt="Pessoa jurídica"
                    className="h-5 w-5 object-contain"
                  />
                }
                title="Buscar Estabelecimento"
                subtitle="Busque por uma pessoa jurídica cadastrada:"
                onChange={(entidade) => {
                  setEstabelecimento(entidade);
                  setPaginaAtual(1);
                }}
              />
            </div>

            <button
              type="button"
              onClick={pesquisar}
              className="h-12 w-full rounded-md bg-[#1A7A3C] px-8 text-sm font-semibold text-white transition hover:bg-[#15612F] md:w-auto"
            >
              Pesquisar
            </button>
          </div>

          {/* 2ª LINHA: MÊS REFERÊNCIA, ANO REFERÊNCIA E SITUAÇÃO */}
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
            <FloatSelect
              label="Mês referência"
              value={mes}
              onChange={(valor) => {
                setMes(valor);
                setPaginaAtual(1);
              }}
              options={MESES}
            />

            <FloatInput
              label="Ano referência"
              value={ano}
              onChange={atualizarAno}
              placeholder="0000"
              maxLength={4}
            />

            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={(valor) => {
                setSituacao(valor);
                setPaginaAtual(1);
              }}
              options={SITUACOES}
            />
          </div>

          {erroAno && (
            <p className="text-sm font-medium text-red-500">
              O ano para referência deve conter quatro dígitos.
            </p>
          )}

          {(estabelecimento || mes || ano || situacao) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {estabelecimento && (
                <FiltroAtivo
                  label={`Estabelecimento: ${estabelecimento.nome}`}
                  onRemove={() => setEstabelecimento(null)}
                />
              )}
              {mes && (
                <FiltroAtivo
                  label={`Mês: ${mes}`}
                  onRemove={() => setMes("")}
                />
              )}
              {ano && (
                <FiltroAtivo
                  label={`Ano: ${ano}`}
                  onRemove={() => {
                    setAno("");
                    setErroAno(false);
                  }}
                />
              )}
              {situacao && (
                <FiltroAtivo
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {!pesquisaRealizada ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Busque por notificações utilizando os filtros acima.
            </div>
          ) : resultados.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Nenhum resultado foi encontrado.
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full min-w-[1180px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Estabelecimento
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Tipo notificação
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Mês/ano referência
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Valor UFEMG
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Valor original
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Data notificação
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Data ciência
                      </th>
                      <th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        Situação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((notificacao) => (
                      <tr
                        key={notificacao.id}
                        className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/60"
                      >
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.estabelecimento}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.tipoNotificacao}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.mes}/{notificacao.ano}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatarUfemg(notificacao.valorUfemg)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatarMoeda(notificacao.valorOriginal)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.dataNotificacao}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.dataCiencia}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {notificacao.situacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {itensPorPagina}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {resultados.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPaginaAtual((valor) => Math.max(1, valor - 1))
                      }
                      disabled={pagina === 1}
                      className="rounded-md p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPaginaAtual((valor) =>
                          Math.min(totalPaginas, valor + 1),
                        )
                      }
                      disabled={pagina === totalPaginas}
                      className="rounded-md p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}