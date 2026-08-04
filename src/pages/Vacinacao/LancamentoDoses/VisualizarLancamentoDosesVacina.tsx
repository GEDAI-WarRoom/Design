import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { HistoricoCadastroLayout, type HistoricoCadastroItem, CLASSE_CAMPO_ALTERADO_HISTORICO, campoHistoricoFoiAlterado } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";

const GREEN = "#1A7A3C";

export function VisualizarLancamentoDosesVacinaPage({ dados, onLogout, onNavigate }: any) {
  // Recebe os dados reais passados pelo botão da listagem.
  const registro = dados || { id: "novo", revendedoraCodigo: "", revendedoraNome: "", numeroNotaFiscal: "", numeroPartida: "", doenca: "", tipoVacina: "", tipoLancamento: "", situacao: "Gravada" };
  
  const chaveCadastro = `lancamento-doses-vacina:${registro.id || registro.numeroNotaFiscal}`;

  const historicoInicial: HistoricoCadastroItem<any>[] = [{
    id: "v1", data: "13/08/2026", hora: "08:15", alteradoPor: "Sistema", atual: true, dados: registro
  }];

  const historico = carregarHistoricoCadastro<any>(chaveCadastro, historicoInicial);

  return (
    <HistoricoCadastroLayout<any> itens={historico} ativo={true} resetKey={chaveCadastro} onVisualizarAutor={() => {}}>
      {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
        const d = dadosSelecionados ?? registro;
        const getClasse = (campo: string) => campoHistoricoFoiAlterado(d[campo], versaoAtual?.dados?.[campo], visualizandoVersaoAntiga) ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";

        return (
          <div className="min-h-screen bg-[#f2f3f5]">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />
            <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
              <div>
                <button type="button" onClick={() => onNavigate("lancamento-doses-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
                  <ArrowLeft size={15} /> Todos os Ajustes de Doses de Vacina
                </button>
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Ajuste de Doses de Vacina</h1>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => onNavigate("editar-lancamento-doses-vacina", registro)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
                      <Pencil size={14} /> Editar
                    </button>
                    {botaoHistorico}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <FloatInput label="Revendedora" value={d.revendedoraNome ? `${d.revendedoraCodigo} - ${d.revendedoraNome}` : ""} disabled onChange={() => {}} className={getClasse("revendedoraNome")} />
                <FloatInput label="Número da Nota Fiscal" value={d.numeroNotaFiscal || ""} disabled onChange={() => {}} className={getClasse("numeroNotaFiscal")} />
                <FloatInput label="Número da Partida" value={d.numeroPartida || ""} disabled onChange={() => {}} className={getClasse("numeroPartida")} />
                <FloatInput label="Doença" value={d.doenca || ""} disabled onChange={() => {}} className={getClasse("doenca")} />
                <FloatInput label="Tipo de Vacina" value={d.tipoVacina || "-"} disabled onChange={() => {}} className={getClasse("tipoVacina")} />
                <FloatInput label="Tipo de Lançamento" value={d.tipoLancamento || ""} disabled onChange={() => {}} className={getClasse("tipoLancamento")} />
                <FloatInput label="Situação" value={d.situacao || "Gravada"} disabled onChange={() => {}} className={getClasse("situacao")} />
              </div>
            </main>
          </div>
        );
      }}
    </HistoricoCadastroLayout>
  );
}