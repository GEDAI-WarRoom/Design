import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { HistoricoCadastroLayout, type HistoricoCadastroItem, CLASSE_CAMPO_ALTERADO_HISTORICO, campoHistoricoFoiAlterado } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { obterRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function VisualizarVendaComSaidaVacinaPage({ dados, onLogout, onNavigate }: any) {
  const vendaSaidaFallback = { id: "1", notaFiscal: "15420", fornecedor: "Distribuidora de Vacinas Alfa LTDA", destinatario: "João da Silva Sauro", partida: "0013225/24", laboratorio: "Laboratório Biovet", doenca: "Febre Aftosa", situacao: "Ativo" };
  const registroInformado = dados?.id ? dados : vendaSaidaFallback;
  const registro = obterRegistroMock("vendas-saida-vacina", registroInformado);
  const chaveCadastro = `venda-saida-vacina:${registro.id}`;

  const historicoInicial: HistoricoCadastroItem<any>[] = [{ id: "v1", data: "18/05/2026", hora: "14:15", alteradoPor: "Sistema", atual: true, dados: registro }];
  const historico = carregarHistoricoCadastro<any>(chaveCadastro, historicoInicial);

  return (
    <HistoricoCadastroLayout<any> itens={historico} ativo={true} resetKey={chaveCadastro} onVisualizarAutor={() => {}}>
      {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
        const d = dadosSelecionados ?? registro;
        const getClasse = (campo: string) => campoHistoricoFoiAlterado(d[campo], versaoAtual?.dados?.[campo], visualizandoVersaoAntiga) ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";

        return (
          <div className="min-h-screen bg-[#f2f3f5]">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-vacina" hideSearch />
            <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
              <div>
                <button type="button" onClick={() => onNavigate("venda-saida-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} /> Todas as Vendas com Saída</button>
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda com Saída de Vacina</h1>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => onNavigate("editar-venda-saida-vacina", registro)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2"><Pencil size={14} /> Editar</button>
                    {botaoHistorico}
                  </div>
                </div>
              </div>
              {avisoVersao}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <FloatInput label="Nota Fiscal" value={d.notaFiscal || ""} disabled onChange={() => {}} className={getClasse("notaFiscal")} />
                <FloatInput label="Fornecedor" value={d.fornecedor || ""} disabled onChange={() => {}} className={getClasse("fornecedor")} />
                <FloatInput label="Destinatário" value={d.destinatario || ""} disabled onChange={() => {}} className={getClasse("destinatario")} />
                <FloatInput label="Número da Partida" value={d.partida || ""} disabled onChange={() => {}} className={getClasse("partida")} />
                <FloatInput label="Laboratório" value={d.laboratorio || ""} disabled onChange={() => {}} className={getClasse("laboratorio")} />
                <FloatInput label="Doença" value={d.doenca || ""} disabled onChange={() => {}} className={getClasse("doenca")} />
                <FloatInput label="Situação" value={d.situacao || ""} disabled onChange={() => {}} className={getClasse("situacao")} />
              </div>
            </main>
          </div>
        );
      }}
    </HistoricoCadastroLayout>
  );
}
