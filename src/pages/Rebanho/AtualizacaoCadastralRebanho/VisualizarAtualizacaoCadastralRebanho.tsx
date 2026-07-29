import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  Eye,
  FilePenLine,
  FileText,
  LockKeyhole,
  PlusCircle,
  Warehouse,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import { AtualizacaoHeaderCard } from "./AtualizacaoRebanhoComponents";
import {
  concluirAtualizacaoCadastral,
  obterAtualizacaoCadastral,
  podeEditarAtualizacao,
  progressoAtualizacao,
  todosItensAtualizados,
  type ItemAtualizacaoRebanho,
} from "./atualizacaoCadastralRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: { atualizacaoId?: number } | null;
}

type Ordenacao = "especie" | "data" | "situacao";

export function VisualizarAtualizacaoCadastralRebanhoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const [, forcarAtualizacao] = useState(0);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("especie");
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalConcluir, setModalConcluir] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalDeclaracao, setModalDeclaracao] = useState(false);
  const atualizacao = obterAtualizacaoCadastral(dados?.atualizacaoId);

  const itensOrdenados = useMemo(() => {
    if (!atualizacao) return [];
    return [...atualizacao.itens].sort((a, b) => {
      const valorA =
        ordenacao === "especie"
          ? a.especie
          : ordenacao === "data"
            ? a.dataUltimaAtualizacao ?? ""
            : a.situacao;
      const valorB =
        ordenacao === "especie"
          ? b.especie
          : ordenacao === "data"
            ? b.dataUltimaAtualizacao ?? ""
            : b.situacao;
      const resultado = valorA.localeCompare(valorB, "pt-BR");
      return ordemAscendente ? resultado : -resultado;
    });
  }, [atualizacao, ordenacao, ordemAscendente]);

  if (!atualizacao) return null;

  const progresso = progressoAtualizacao(atualizacao);
  const podeEditar = podeEditarAtualizacao(atualizacao);
  const podeConcluir = podeEditar && todosItensAtualizados(atualizacao);

  const ordenar = (campo: Ordenacao) => {
    if (ordenacao === campo) {
      setOrdemAscendente((valor) => !valor);
      return;
    }
    setOrdenacao(campo);
    setOrdemAscendente(true);
  };

  const abrirItem = (
    item: ItemAtualizacaoRebanho,
    destino: "visualizar-rebanho-atualizado" | "atualizar-cadastro-rebanho",
  ) => {
    onNavigate(destino, {
      atualizacaoId: atualizacao.id,
      itemId: item.id,
      modo: item.situacao === "Atualizado" ? "editar" : "criar",
    });
  };

  const confirmarConclusao = () => {
    const concluida = concluirAtualizacaoCadastral(atualizacao.id);
    if (!concluida) return;
    setModalConcluir(false);
    setModalSucesso(true);
    forcarAtualizacao((valor) => valor + 1);
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
      onClick={() => ordenar(campo)}
      className="w-full flex items-center justify-between gap-2 uppercase text-left"
    >
      {children}
      <ArrowDown
        size={15}
        className={`transition ${
          ordenacao === campo && ordemAscendente ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="atualizacao-cadastral-rebanho"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-7">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Todas Atualizações Cadastrais de Rebanho
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Atualização Cadastral de Rebanho
          </h1>
        </div>

        <AtualizacaoHeaderCard atualizacao={atualizacao} />

        <div className="flex justify-end">
          <div className="w-full sm:w-64">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Progresso da Atualização Cadastral</span>
              <span>{progresso}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#e8f2ed] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#008d4d] transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-y border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[220px] uppercase">
                    Exploração/Núcleo
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[160px]">
                    <SortHeader campo="especie">Espécie</SortHeader>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[220px]">
                    <SortHeader campo="data">
                      Data da Última Atualização
                    </SortHeader>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[150px]">
                    <SortHeader campo="situacao">Situação</SortHeader>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700 w-32 uppercase">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {itensOrdenados.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-4 text-gray-500">{item.codigo}</td>
                    <td className="px-4 py-4 text-gray-500">{item.especie}</td>
                    <td className="px-4 py-4 text-gray-500">
                      {item.dataUltimaAtualizacao ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-gray-500">{item.situacao}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {item.situacao === "Atualizado" && (
                          <button
                            type="button"
                            onClick={() =>
                              abrirItem(item, "visualizar-rebanho-atualizado")
                            }
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                            title="Visualizar rebanho atualizado"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {podeEditar ? (
                          <button
                            type="button"
                            onClick={() =>
                              abrirItem(item, "atualizar-cadastro-rebanho")
                            }
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                            title={
                              item.situacao === "Atualizado"
                                ? "Editar atualização"
                                : "Atualizar rebanho"
                            }
                          >
                            <FilePenLine size={18} />
                          </button>
                        ) : (
                          item.situacao === "Pendente" && (
                            <span
                              className="p-2 text-gray-300"
                              title="Atualização indisponível para edição"
                            >
                              <LockKeyhole size={18} />
                            </span>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-5 border-t border-gray-100 text-sm text-gray-500">
            <span>Itens por página: 10</span>
            <div className="flex flex-wrap items-center justify-end gap-4">
              <span>
                Mostrando de 1 a {atualizacao.itens.length} de{" "}
                {atualizacao.itens.length} resultados
              </span>
              {podeEditar && (
                <button
                  type="button"
                  onClick={() => setModalAdicionar(true)}
                  className="inline-flex items-center gap-2 font-medium text-[#1A7A3C] hover:underline"
                >
                  <PlusCircle size={17} />
                  Adicionar Novo
                </button>
              )}
            </div>
          </div>
        </section>

        {!podeEditar && !atualizacao.concluida && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Esta atualização pertence a uma etapa anterior e não pode mais ser
            alterada.
          </div>
        )}

        <div className="flex justify-end gap-3">
          {atualizacao.concluida && (
            <CustomButton
              variant="outlined"
              icon={<FileText size={18} />}
              onClick={() => setModalDeclaracao(true)}
            >
              Emitir declaração
            </CustomButton>
          )}
          {podeEditar && (
            <CustomButton
              onClick={() => setModalConcluir(true)}
              disabled={!podeConcluir}
              icon={<Check size={18} />}
            >
              Concluir
            </CustomButton>
          )}
        </div>

        {podeEditar && !podeConcluir && (
          <p className="text-right text-xs text-gray-500 -mt-5">
            A conclusão será habilitada após a atualização de todas as
            explorações e núcleos.
          </p>
        )}
      </main>

      {modalAdicionar && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[930px] min-h-[520px] p-7 md:p-10 relative">
            <button
              type="button"
              onClick={() => setModalAdicionar(false)}
              className="absolute right-7 top-7 text-[#1A7A3C] hover:bg-green-50 p-1 rounded-md"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-3">
                <PlusCircle size={24} className="text-[#009b57]" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Adicionar Novo
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Selecione o tipo de cadastro que deseja realizar:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[720px] mx-auto mt-10">
              <button
                type="button"
                onClick={() => onNavigate("adicionar-exploracao-pecuaria")}
                className="border border-gray-200 rounded-2xl min-h-[215px] p-7 text-center hover:border-[#1A7A3C] hover:bg-green-50/30 transition shadow-sm"
              >
                <img
                  src={Icons.iconeExploracaoUrl}
                  alt=""
                  className="w-8 h-8 object-contain mx-auto"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-5">
                  Exploração Pecuária
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Adicione uma exploração pecuária referente ao estabelecimento da
                  atualização cadastral.
                </p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("adicionar-nucleo-producao")}
                className="border border-gray-200 rounded-2xl min-h-[215px] p-7 text-center hover:border-[#1A7A3C] hover:bg-green-50/30 transition shadow-sm"
              >
                <Warehouse size={32} className="text-[#009b57] mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mt-5">
                  Núcleo de Produção
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Adicione um núcleo de produção referente ao estabelecimento da
                  atualização cadastral.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalConcluir && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-7 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Concluir Atualização Cadastral de Rebanho
            </h2>
            <p className="text-sm text-gray-600 mt-4">
              Deseja concluir a etapa {atualizacao.etapa} do estabelecimento{" "}
              {atualizacao.estabelecimento.nome}?
            </p>
            <div className="flex justify-center gap-3 mt-7">
              <CustomButton
                variant="outlined"
                onClick={() => setModalConcluir(false)}
              >
                Cancelar
              </CustomButton>
              <CustomButton onClick={confirmarConclusao}>Concluir</CustomButton>
            </div>
          </div>
        </div>
      )}

      {modalSucesso && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Atualização cadastral concluída com sucesso!
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Todos os rebanhos da etapa {atualizacao.etapa} foram atualizados.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <CustomButton
                variant="outlined"
                onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
              >
                Voltar
              </CustomButton>
              <CustomButton onClick={() => setModalSucesso(false)}>
                Visualizar
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {modalDeclaracao && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 print:static print:bg-white">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 print:shadow-none">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                <FileText size={28} className="text-[#1A7A3C]" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Declaração de Atualização Cadastral de Rebanho
                  </h2>
                  <p className="text-sm text-gray-500">Etapa {atualizacao.etapa}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalDeclaracao(false)}
                className="p-1 text-gray-500 print:hidden"
              >
                <X size={22} />
              </button>
            </div>
            <div className="border-y border-gray-200 py-5 my-6 text-sm text-gray-700 space-y-2">
              <p>
                <strong>Produtor titular:</strong> {atualizacao.produtor.nome} -{" "}
                {atualizacao.produtor.documento}
              </p>
              <p>
                <strong>Estabelecimento:</strong>{" "}
                {atualizacao.estabelecimento.nome} -{" "}
                {atualizacao.estabelecimento.codigo}
              </p>
              <p>
                <strong>Explorações e núcleos atualizados:</strong>
              </p>
              <ul className="list-disc pl-5">
                {atualizacao.itens.map((item) => (
                  <li key={item.id}>
                    {item.codigo} - {item.especie} ({item.tipo})
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-3 print:hidden">
              <CustomButton
                variant="outlined"
                onClick={() => setModalDeclaracao(false)}
              >
                Fechar
              </CustomButton>
              <CustomButton onClick={() => window.print()}>
                Imprimir declaração
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

