import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { HistoricoCadastroLayout, type HistoricoCadastroItem, CLASSE_CAMPO_ALTERADO_HISTORICO, campoHistoricoFoiAlterado } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { obterRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function VisualizarPartilhaVacinaPage({ dados, onLogout, onNavigate }: any) {
  // Recebe os dados reais preenchidos pela tabela da listagem
  const registroInformado = dados || { id: "novo", codigo: "", origemNome: "", origemDoc: "", destinoNome: "", destinoDoc: "", numeroNotaFiscal: "", situacao: "Gravada" };
  const registro = obterRegistroMock("partilhas-vacina", registroInformado);
  const chaveCadastro = `partilha-vacina:${registro.id || registro.codigo}`;

  const historicoInicial: HistoricoCadastroItem<any>[] = [{
    id: "v1", data: "20/05/2026", hora: "10:00", alteradoPor: "Sistema", atual: true, dados: registro
  }];

  const historico = carregarHistoricoCadastro<any>(chaveCadastro, historicoInicial);

  return (
    <HistoricoCadastroLayout<any> itens={historico} ativo={true} resetKey={chaveCadastro} onVisualizarAutor={() => {}}>
      {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
        const d = dadosSelecionados ?? registro;
        const getClasse = (campo: string) => campoHistoricoFoiAlterado(d[campo], versaoAtual?.dados?.[campo], visualizandoVersaoAntiga) ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";

        return (
          <div className="min-h-screen bg-[#f2f3f5]">
            <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="partilha-vacina" hideSearch />
            <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
              <div>
                <button type="button" onClick={() => onNavigate("partilha-vacina")} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}>
                  <ArrowLeft size={15} /> Todas Doações/Partilhas
                </button>
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Doação/Partilha de Vacina</h1>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => onNavigate("editar-partilha-vacina", registro)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md flex items-center gap-2">
                      <Pencil size={14} /> Editar
                    </button>
                    {botaoHistorico}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatInput label="Código da Doação/Partilha" value={d.codigo || "-"} disabled onChange={() => {}} className={getClasse("codigo")} />
                <FloatInput label="Número da Nota Fiscal" value={d.numeroNotaFiscal || "-"} disabled onChange={() => {}} className={getClasse("numeroNotaFiscal")} />
                <FloatInput label="Produtor Origem" value={d.origemNome ? `${d.origemDoc} - ${d.origemNome}` : "-"} disabled onChange={() => {}} className={getClasse("origemNome")} />
                <FloatInput label="Produtor Destino" value={d.destinoNome ? `${d.destinoDoc} - ${d.destinoNome}` : "-"} disabled onChange={() => {}} className={getClasse("destinoNome")} />
                <FloatInput label="Situação" value={d.situacao || "Gravada"} disabled onChange={() => {}} className={getClasse("situacao")} />
              </div>
            </main>
          </div>
        );
      }}
    </HistoricoCadastroLayout>
  );
}
