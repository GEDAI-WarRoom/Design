import { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  Check,
  Ban,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatInput,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================

// Apenas unidades administrativas do tipo "Escritório Seccional"
const ESCRITORIOS_SECCIONAIS_MOCK = [
  { id: 1, nome: "Escritório Seccional de Lavras" },
  { id: 2, nome: "Escritório Seccional de Belo Horizonte" },
  { id: 3, nome: "Escritório Seccional de Uberlândia" },
  { id: 4, nome: "Escritório Seccional de Varginha" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Cancelado", label: "Cancelado" },
];

interface FormularioGTA {
  id: number;
  escritorio: { id: number; nome: string };
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  situacao: "Ativo" | "Cancelado";
}

const FORMULARIOS_MOCK: FormularioGTA[] = [
  {
    id: 1,
    escritorio: {
      id: 1,
      nome: "Escritório Seccional de Lavras",
    },
    serie: "A1",
    numeroInicial: 1,
    numeroFinal: 500,
    situacao: "Ativo",
  },
  {
    id: 2,
    escritorio: {
      id: 1,
      nome: "Escritório Seccional de Lavras",
    },
    serie: "A1",
    numeroInicial: 501,
    numeroFinal: 1000,
    situacao: "Cancelado",
  },
  {
    id: 3,
    escritorio: {
      id: 2,
      nome: "Escritório Seccional de Belo Horizonte",
    },
    serie: "B2",
    numeroInicial: 1,
    numeroFinal: 750,
    situacao: "Ativo",
  },
  {
    id: 4,
    escritorio: {
      id: 3,
      nome: "Escritório Seccional de Uberlândia",
    },
    serie: "C3",
    numeroInicial: 1,
    numeroFinal: 300,
    situacao: "Ativo",
  },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
function SituacaoBadge({
  situacao,
}: {
  situacao: FormularioGTA["situacao"];
}) {
  const map = {
    Ativo: {
      bg: "#E6F4EA",
      border: "#A3E2B8",
      text: "#1A7A3C",
      Icon: Check,
    },
    Cancelado: {
      bg: "#FDEDEC",
      border: "#F5B7B1",
      text: "#B91C1C",
      Icon: Ban,
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

const pad = (n: number, len: number) =>
  String(n).padStart(len, "0");

// ==========================================================
// PÁGINA: BUSCAR DISTRIBUIÇÃO DE FORMULÁRIOS DE GTA
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function DistribuicaoFormulariosGta({
  onLogout,
  onNavigate,
}: PageProps) {
  const [escritorio, setEscritorio] = useState<any | null>(
    null,
  );
  const [serie, setSerie] = useState("");
  const [numeroFormulario, setNumeroFormulario] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const camposObrigatoriosPreenchidos =
    !!escritorio &&
    serie.trim().length > 0 &&
    numeroFormulario.trim().length > 0 &&
    situacao.trim().length > 0;

  const handlePesquisar = () => {
    if (!camposObrigatoriosPreenchidos) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const handleLimpar = () => {
    setEscritorio(null);
    setSerie("");
    setNumeroFormulario("");
    setSituacao("");
    setErroValidacao(false);
    setHasSearched(false);
    setPage(1);
  };

  const filtrados = FORMULARIOS_MOCK.filter((f) => {
    if (!camposObrigatoriosPreenchidos) return false;
    const numero = Number(numeroFormulario);
    const matchEscritorio = f.escritorio.id === escritorio.id;
    const matchSerie =
      f.serie.toUpperCase() === serie.toUpperCase();
    const matchNumero =
      !Number.isNaN(numero) &&
      numero >= f.numeroInicial &&
      numero <= f.numeroFinal;
    const matchSituacao = f.situacao === situacao;
    return (
      matchEscritorio &&
      matchSerie &&
      matchNumero &&
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
        currentScreen="distribuicao-formularios-gta"
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
              Distribuição de Formulários de GTA
            </h1>
            <button
              onClick={() =>
                onNavigate(
                  "adicionar-distribuicao-formularios-gta",
                )
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO (Engloba Filtros, Mensagens e Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Filtros de Busca (todos obrigatórios) */}
          <div className="flex flex-col gap-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full items-end">
              <EntitySearchInput
                label="Escritório Seccional"
                required
                placeholder="Buscar por nome do escritório seccional."
                value={escritorio ? escritorio.nome : ""}
                data={ESCRITORIOS_SECCIONAIS_MOCK}
                searchKeys={["nome"]}
                columns={[
                  {
                    label: "Escritório Seccional",
                    key: "nome",
                  },
                ]}
                icon={
                  Icons.iconeUnidadeAdministrativaUrl ? (
                    <img
                      src={Icons.iconeUnidadeAdministrativaUrl}
                      alt="Escritório Seccional"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
                title="Buscar Escritório Seccional"
                subtitle="Busque por um escritório seccional cadastrado:"
                onChange={(ent) => {
                  setEscritorio(ent);
                  setErroValidacao(false);
                }}
              />

              <FloatInput
                label="Série"
                required
                value={serie}
                maxLength={2}
                onChange={(v) => {
                  setSerie(v.toUpperCase());
                  setErroValidacao(false);
                }}
              />

              <FloatInput
                label="Número do Formulário"
                required
                value={numeroFormulario}
                maxLength={6}
                onChange={(v) => {
                  setNumeroFormulario(v.replace(/\D/g, ""));
                  setErroValidacao(false);
                }}
              />

              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={(v) => {
                  setSituacao(v);
                  setErroValidacao(false);
                }}
                options={SITUACOES}
              />

              <button
              onClick={handlePesquisar}
              className="h-11 px-6 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: GREEN }}
            >
              Pesquisar
            </button>
            </div>

            
          </div>

          {/* Feedback de Validação */}
          {erroValidacao && (
            <p className="text-sm text-red-500">
              Todos os campos (Escritório Seccional, Série,
              Número do Formulário e Situação) são obrigatórios
              para realizar a busca.
            </p>
          )}

          {/* Linha Divisória sutil entre filtros e resultados (aparece após primeira busca) */}
          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* ÁREA DE RESULTADOS (Dentro do mesmo card branco) */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Preencha todos os filtros acima e clique em
                "Pesquisar" para buscar distribuições de
                formulários de GTA.
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
                    <tr className=" border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[220px]">
                        Escritório Seccional
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">
                        Série
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[180px]">
                        Faixa de Formulários
                      </th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[120px]">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.escritorio.nome}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.serie}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {pad(f.numeroInicial, 6)} -{" "}
                          {pad(f.numeroFinal, 6)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                            {f.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() =>
                                onNavigate(
                                  "visualizar-distribuicao-formularios-gta",
                                  f,
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
                                  "editar-distribuicao-formularios-gta",
                                  f,
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