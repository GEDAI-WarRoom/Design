import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { HistoricoCadastroLayout, type HistoricoCadastroItem, CLASSE_CAMPO_ALTERADO_HISTORICO, campoHistoricoFoiAlterado } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";

const GREEN = "#1A7A3C";

export function VisualizarLaboratorioPage({ dados, onLogout, onNavigate }: any) {
  const laboratorioFallback = { id: 1, cnpj: "12.345.678/0001-90", razaoSocial: "Laboratório Central BioVet", municipio: "Belo Horizonte - MG", situacao: "Ativo" };
  const registro = dados?.cnpj ? dados : laboratorioFallback;
  const chaveCadastro = `laboratorio:${registro.cnpj}`;

  const historicoInicial: HistoricoCadastroItem<any>[] = [{ id: "v1", data: "15/05/2026", hora: "08:30", alteradoPor: "Sistema", atual: true, dados: registro }];
  const historico = carregarHistoricoCadastro<any>(chaveCadastro, historicoInicial);

  return (
    <HistoricoCadastroLayout<any> itens={historico} ativo={true} resetKey={chaveCadastro} onVisualizarAutor={() => {}}>
      {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
        const d = dadosSelecionados ?? registro;
        const getClasse = (campo: string) => campoHistoricoFoiAlterado(d[campo], versaoAtual?.dados?.[campo], visualizandoVersaoAntiga) ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";

        return (
          <div className="min-h-screen bg-[#f2f3f5]">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="laboratorio" hideSearch />
            <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
              <div>
                <button type="button" onClick={() => onNavigate("laboratorio")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
                  <ArrowLeft size={15} /> Todos os Laboratórios
                </button>
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Laboratório</h1>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => onNavigate("editar-laboratorio", registro)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
                      <Pencil size={14} /> Editar
                    </button>
                    {botaoHistorico}
                  </div>
                </div>
              </div>
              {avisoVersao}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatInput label="CNPJ" value={d.cnpj || ""} disabled onChange={() => {}} className={getClasse("cnpj")} />
                <FloatInput label="Razão Social" value={d.razaoSocial || ""} disabled onChange={() => {}} className={getClasse("razaoSocial")} />
                <FloatInput label="Município" value={d.municipio || ""} disabled onChange={() => {}} className={getClasse("municipio")} />
                <FloatInput label="Situação" value={d.situacao || ""} disabled onChange={() => {}} className={getClasse("situacao")} />
              </div>
            </main>
          </div>
        );
      }}
    </HistoricoCadastroLayout>
  );
}