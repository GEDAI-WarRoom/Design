import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const MEIOS_TRANSPORTE = ["Aéreo", "A Pé", "Ferroviário", "Marítimo/Fluvial", "Rodoviário"];

const EXEMPLO_TIPO_VEICULO = {
  tipoVeiculo: "Caminhão Boiadeiro",
  meioTransporte: "Rodoviário",
  situacao: "Ativo",
  observacao: "Veículo utilizado no transporte rodoviário de animais de produção.",
};

function Section({ title, children }: { title: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function EditarTipoVeiculoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [tipoVeiculo, setTipoVeiculo] = useState(dados?.tipoVeiculo || dados?.tipo || EXEMPLO_TIPO_VEICULO.tipoVeiculo);
  const [meioTransporte, setMeioTransporte] = useState(dados?.meioTransporte || EXEMPLO_TIPO_VEICULO.meioTransporte);
  const [situacao, setSituacao] = useState(dados?.situacao || EXEMPLO_TIPO_VEICULO.situacao);
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_TIPO_VEICULO.observacao);

  const dadosAtualizados = { ...dados, tipoVeiculo, meioTransporte, situacao, observacao };

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-veiculo" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("tipo-veiculo")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Tipos de Veículos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Tipo de Veículo</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Tipo do Veículo" required value={tipoVeiculo} onChange={setTipoVeiculo} maxLength={255} />
            <FloatSelect label="Meio de Transporte" required value={meioTransporte} onChange={setMeioTransporte} options={MEIOS_TRANSPORTE.map((item) => ({ value: item, label: item }))} />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O tipo "{tipoVeiculo}" foi atualizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("tipo-veiculo"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-tipo-veiculo", dadosAtualizados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
