import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

interface ProprietarioEntidade {
  id: number;
  nome: string;
  documento: string;
}

const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
  {
    id: 3,
    nome: "Agropecuária Vale Verde Ltda.",
    documento: "56.338.814/0001-95",
  },
  {
    id: 4,
    nome: "Instituto Veterinário do Sul Ltda.",
    documento: "12.345.678/0001-99",
  },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

interface Pessoa {
  nome: string;
  documento: string;
}

interface InstituicaoEnsinoPesquisa {
  id: number;
  proprietarios: Pessoa[];
  situacao: "Ativo" | "Inativo";
}

const INSTITUICOES_MOCK: InstituicaoEnsinoPesquisa[] = [
  {
    id: 1,
    proprietarios: [
      {
        nome: "Instituto Veterinário do Sul Ltda.",
        documento: "12.345.678/0001-99",
      },
    ],
    situacao: "Ativo",
  },
  {
    id: 2,
    proprietarios: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" },
      { nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
    ],
    situacao: "Inativo",
  },
  {
    id: 3,
    proprietarios: [
      {
        nome: "Agropecuária Vale Verde Ltda.",
        documento: "56.338.814/0001-95",
      },
    ],
    situacao: "Ativo",
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

function CelulaPessoas({ pessoas }: { pessoas: Pessoa[] }) {
  if (pessoas.length === 0) return <span className="text-gray-400">—</span>;
  return (
    <div className="text-sm text-gray-500 whitespace-normal">
      <div>{pessoas[0].documento}</div>
      <div>{pessoas[0].nome}</div>
      {pessoas.length > 1 && (
        <div className="text-xs text-gray-400 font-medium mt-0.5">
          + {pessoas.length - 1} selecionado(s)
        </div>
      )}
    </div>
  );
}

// ==========================================================
// PÁGINA: BUSCAR INSTITUIÇÃO DE ENSINO E PESQUISA
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function InstituicaoEnsinoPesquisa({ onLogout, onNavigate }: PageProps) {
  const [proprietario, setProprietario] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = INSTITUICOES_MOCK.filter((i) => {
    const matchProprietario =
      !proprietario ||
      i.proprietarios.some((p) => p.documento === proprietario.documento);
    const matchSituacao = situacao === "" || i.situacao === situacao;

    return matchProprietario && matchSituacao;
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

  const temFiltroAtivo = !!(proprietario || situacao);

  return (
    <div>
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="instituicao-ensino-pesquisa"
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
              Instituição de Ensino e Pesquisa
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-instituicao-ensino-pesquisa")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Filtros (poucos campos — exibidos direto, sem toggle) */}
          <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
            <div className="w-full lg:flex-1">
              <EntitySearchInput
                label="Proprietários"
                placeholder="Buscar pelo nome ou documento do proprietário."
                value={proprietario ? proprietario.nome : ""}
                data={PROPRIETARIOS_MOCK}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome/Razão Social", key: "nome" },
                  { label: "CPF/CNPJ", key: "documento" },
                ]}
                icon={
                  <img
                    src={Icons.iconeProdutorUrl}
                    alt="Proprietários"
                    className="w-5 h-5 object-contain"
                  />
                }
                title="Buscar Proprietário"
                subtitle="Busque por um proprietário cadastrado no sistema:"
                onChange={(ent) => setProprietario(ent)}
              />
            </div>

            <div className="w-full lg:flex-1">
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES}
              />
            </div>

            <button
              onClick={handlePesquisar}
              className="h-12 w-full lg:w-fit px-6 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: GREEN }}
            >
              Pesquisar
            </button>
          </div>

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {proprietario && (
                <Chip
                  label={`Proprietário: ${proprietario.nome}`}
                  onRemove={() => setProprietario(null)}
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

          {/* Linha Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por instituição de ensino e pesquisa utilizando os
                filtros acima.
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
                        Proprietários
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((i) => (
                      <tr
                        key={i.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3">
                          <CelulaPessoas pessoas={i.proprietarios} />
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-normal">
                          {i.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() =>
                                onNavigate(
                                  "visualizar-instituicao-ensino-pesquisa",
                                  i,
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
                                  "editar-instituicao-ensino-pesquisa",
                                  i,
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
