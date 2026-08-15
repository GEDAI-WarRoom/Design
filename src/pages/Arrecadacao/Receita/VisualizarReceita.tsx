import { ArrowLeft, FileText, ListTree } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, Tabs } from "../../../components/ui/FormKit";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
} from "../../../components/ui/HistoricoCadastroLayout";
import { ItemReceitaTab } from "../ItemReceita/ItemReceitaTab";
import {
  classificacaoLabel,
  obterHistoricoReceita,
  obterReceita,
  Receita,
} from "./receitaData";

function camposComparaveis(receita: Receita): CampoHistoricoComparavel[] {
  return [
    { label: "Código", value: receita.codigo },
    { label: "Descrição", value: receita.descricao },
    {
      label: "Classificação de Receita",
      value: classificacaoLabel(receita.classificacao),
    },
    { label: "Situação", value: receita.situacao },
  ];
}

export function VisualizarReceitaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: Receita;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [activeTab, setActiveTab] = useState("cadastro");
  const [isModalItemOpen, setIsModalItemOpen] = useState(false);
  const receitaAtual =
    obterReceita(dados?.id) ?? dados ?? obterReceita(null)!;
  const historico = obterHistoricoReceita(receitaAtual);
  const camposAtuais = camposComparaveis(receitaAtual);

  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (active: boolean) => (
        <FileText
          size={18}
          className={active ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
    {
      id: "itens-receita",
      label: "Item de Receita",
      icon: (active: boolean) => (
        <ListTree
          size={18}
          className={active ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="receita"
        hideSearch
      />

      <HistoricoCadastroLayout<Receita>
        itens={historico}
        ativo={activeTab === "cadastro"}
        resetKey={receitaAtual.id}
        tituloHistorico="Histórico da Receita"
        descricaoVersaoAntiga="Esta é uma versão anterior do cadastro da receita."
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
      >
        {({
          avisoVersao,
          botaoHistorico,
          dadosSelecionados,
          visualizandoVersaoAntiga,
        }) => {
          const receita = dadosSelecionados ?? receitaAtual;
          const classeCampo = (label: string, value: unknown) =>
            campoHistoricoFoiAlterado(
              { label, value },
              camposAtuais,
              visualizandoVersaoAntiga,
            )
              ? CLASSE_CAMPO_ALTERADO_HISTORICO
              : "";

          return (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate("receita")}
                  className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
                >
                  <ArrowLeft size={15} /> Todas as Receitas
                </button>

                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Visualizar Receita
                  </h1>

                  <div className="flex items-center gap-3">
                    {activeTab === "cadastro" &&
                      !visualizandoVersaoAntiga && (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate("editar-receita", receitaAtual)
                          }
                          className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
                        >
                          Editar
                        </button>
                      )}
                    {activeTab === "cadastro" && botaoHistorico}

                    {activeTab === "itens-receita" && (
                      <button
                        type="button"
                        onClick={() => setIsModalItemOpen(true)}
                        className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
                      >
                        Adicionar Item
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />

              {activeTab === "cadastro" && avisoVersao}

              {activeTab === "cadastro" && (
                <div className="flex flex-col gap-5">
                  <section className="bg-white rounded-xl shadow-sm p-6 animate-fadeIn">
                    <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">
                      Informações Básicas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FloatInput
                        label="Código"
                        value={receita.codigo}
                        disabled
                        onChange={() => {}}
                        className={classeCampo("Código", receita.codigo)}
                      />
                      <FloatInput
                        label="Descrição"
                        value={receita.descricao}
                        disabled
                        onChange={() => {}}
                        className={classeCampo("Descrição", receita.descricao)}
                      />
                      <FloatInput
                        label="Classificação de Receita"
                        value={classificacaoLabel(receita.classificacao)}
                        disabled
                        onChange={() => {}}
                        className={`md:col-span-2 ${classeCampo(
                          "Classificação de Receita",
                          classificacaoLabel(receita.classificacao),
                        )}`}
                      />
                    </div>
                  </section>
                  <section className="bg-white rounded-xl shadow-sm p-6 animate-fadeIn">
                    <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">
                      Situação
                    </h2>
                    <FloatInput
                      label="Situação"
                      value={receita.situacao}
                      disabled
                      onChange={() => {}}
                      className={classeCampo("Situação", receita.situacao)}
                    />
                  </section>
                </div>
              )}

              {activeTab === "itens-receita" && (
                <div className="animate-fadeIn">
                  <ItemReceitaTab
                    receitaId={receitaAtual.id}
                    isModalOpen={isModalItemOpen}
                    setIsModalOpen={setIsModalItemOpen}
                  />
                </div>
              )}
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
