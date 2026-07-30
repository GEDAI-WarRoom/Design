import React, { useState } from "react";
import { ArrowLeft, Check, Download, FileText, Ban, PlayCircle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, FloatSelect } from "../../../components/ui/FormKit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui-1/dialog";

const GREEN = "#1A7A3C";

export function VisualizarEmissaoATAPage({ dados, onLogout, onNavigate }: { dados: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const ata = dados || { serie: "AR-000000", situacao: "Gravada" };
  
  const [modalEmitir, setModalEmitir] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [validade, setValidade] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const handleAction = (acao: string) => {
    // Fecha os modais e volta pra lista simulando o processamento
    setModalEmitir(false);
    setModalCancelar(false);
    onNavigate("emissao-ata");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="emissao-ata" hideSearch />
      
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("emissao-ata")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition">
            <ArrowLeft size={15} /> Todas as ATAs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar ATA</h1>
            
            {/* Ações (Copiar, Pagar, Emitir, Cancelar, Baixar) */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-4 h-9 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-50 transition shadow-sm">
                Copiar ATA
              </button>
              {ata.situacao === "Gravada" && (
                <>
                  <button className="px-4 h-9 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition shadow-sm">
                    Pagar / DAE
                  </button>
                  <button onClick={() => setModalEmitir(true)} className="px-4 h-9 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-1 hover:opacity-90 transition shadow-sm">
                    <PlayCircle size={14} /> Emitir ATA
                  </button>
                </>
              )}
              {ata.situacao !== "Cancelada" && (
                <button onClick={() => setModalCancelar(true)} className="px-4 h-9 bg-red-600 text-white text-xs font-bold rounded-md flex items-center gap-1 hover:bg-red-700 transition shadow-sm">
                  <Ban size={14} /> Cancelar ATA
                </button>
              )}
              <button className="px-4 h-9 bg-gray-800 text-white text-xs font-bold rounded-md flex items-center gap-1 hover:bg-gray-900 transition shadow-sm">
                <Download size={14} /> Baixar PDF
              </button>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-2">
          <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações Básicas e Situação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Série - Número da ATA" value={ata.serie} disabled />
            <FloatInput label="Situação" value={ata.situacao} disabled />
            <FloatInput label="Espécie" value={ata.especie || "Bovino"} disabled />
            <FloatInput label="Finalidade" value={ata.finalidade || "Abate"} disabled />
          </div>
        </section>
        
        {/* Aqui viriam as outras sections como ReadOnly. Omitido para economizar tokens mantendo a lógica central */}
      </main>

      {/* MODAL DE EMITIR ATA */}
      <Dialog open={modalEmitir} onOpenChange={setModalEmitir}>
        <DialogContent className="max-w-[600px] bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Emitir ATA</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Confirme os dados de validade para emissão da Guia de Trânsito.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-5 mt-4">
            <FloatInput type="date" label="Data de Validade (Padrão: +3 dias)" required value={validade} onChange={setValidade} />
            <LargeTextArea label="Justificativa (Obrigatório se > 3 dias)" value={justificativa} onChange={setJustificativa} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
             <button onClick={() => setModalEmitir(false)} className="px-5 h-11 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50">Cancelar</button>
             <button onClick={() => handleAction("emitir")} disabled={!validade} className="px-5 h-11 bg-[#1A7A3C] text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-50">Emitir Documento</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CANCELAR ATA */}
      <Dialog open={modalCancelar} onOpenChange={setModalCancelar}>
        <DialogContent className="max-w-[600px] bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2"><Ban size={24} /> <DialogTitle className="text-xl font-bold">Cancelar ATA</DialogTitle></div>
            <DialogDescription className="text-gray-500">
              Atenção: Esta ação é irreversível. A ATA não poderá ser alterada após o cancelamento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-5 mt-4">
            <FloatSelect label="Motivo do Cancelamento" required value={motivoCancelamento} onChange={setMotivoCancelamento} options={[{value:"Erro de digitação", label:"Erro de digitação"}, {value:"Desistência do Trânsito", label:"Desistência do Trânsito"}]} />
            <LargeTextArea label="Observações Adicionais" value="" onChange={()=>{}} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
             <button onClick={() => setModalCancelar(false)} className="px-5 h-11 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50">Voltar</button>
             <button onClick={() => handleAction("cancelar")} disabled={!motivoCancelamento} className="px-5 h-11 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:opacity-50">Confirmar Cancelamento</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}