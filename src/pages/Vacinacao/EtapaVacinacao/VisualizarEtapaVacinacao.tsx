import { ArrowLeft, Copy, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { EtapaVacinacaoForm, etapaParaForm } from "./EtapaVacinacaoForm";
import {
  copiarEtapaVacinacao,
  obterEtapaVacinacao,
  obterHistoricoEtapaVacinacao,
  type EtapaVacinacao,
} from "./etapaVacinacaoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EtapaVacinacao;
}

export function VisualizarEtapaVacinacaoPage({ onLogout, onNavigate, dados }: PageProps) {
  const etapaAtual = obterEtapaVacinacao(dados) ?? dados;
  if (!etapaAtual) {
    return (
      <div className="min-h-screen bg-[#f2f3f5]">
        <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />
        <main className="mx-auto max-w-[1088px] px-6 py-10 text-center text-sm text-gray-500">Etapa de vacinação não encontrada.</main>
      </div>
    );
  }
  const historico = obterHistoricoEtapaVacinacao(etapaAtual);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />
      <HistoricoCadastroLayout<EtapaVacinacao>
        itens={historico}
        ativo
        resetKey={etapaAtual.id}
        tituloHistorico="Histórico da Etapa de Vacinação"
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
      >
        {({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => {
          const etapa = dadosSelecionados ?? etapaAtual;
          return (
            <>
              <div>
                <button type="button" onClick={() => onNavigate("etapa-vacinacao")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70">
                  <ArrowLeft size={15} /> Todas as Etapas de Vacinação
                </button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Etapa de Vacinação</h1>
                  <div className="flex items-center gap-3">
                    {botaoHistorico}
                    {!visualizandoVersaoAntiga && (
                      <>
                        <button type="button" onClick={() => onNavigate("adicionar-etapa-vacinacao", copiarEtapaVacinacao(etapaAtual))} className="flex h-10 items-center gap-2 rounded-md border border-[#1A7A3C] px-4 text-xs font-bold text-[#1A7A3C] hover:bg-green-50">
                          <Copy size={15} /> Copiar Etapa
                        </button>
                        {etapaAtual.situacao !== "Finalizada" && (
                          <button type="button" onClick={() => onNavigate("editar-etapa-vacinacao", etapaAtual)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">
                            <Pencil size={15} /> Editar
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {avisoVersao}
              <EtapaVacinacaoForm mode="view" value={etapaParaForm(etapa)} onChange={() => {}} onVisualizarDoenca={(doenca) => onNavigate("visualizar-doenca", doenca)} />
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
