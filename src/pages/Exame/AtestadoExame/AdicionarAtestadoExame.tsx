import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, AlertTriangle, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { DoencaInput } from "../../../components/ui/EntitySearch";
import { adicionarAtestadoExame } from "./atestadoExameData"; // Importação crucial

const GREEN = "#1A7A3C";

const DOENCAS_CORRIGIDAS_MOCK = [
  { id: 1, codigo: "D01", nome: "Febre Aftosa" },
  { id: 2, codigo: "D02", nome: "Brucelose" },
  { id: 4, codigo: "D04", nome: "Raiva" }, 
  { id: 6, codigo: "D06", nome: "Mormo" },
];

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

export function AdicionarAtestadoExamePage({ onLogout, onNavigate }: { onLogout?: () => void; onNavigate?: (s: string, d?: any) => void; }) {
  const [descricao, setDescricao] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [diasValidade, setDiasValidade] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<any>(null);

  const handleSalvar = () => {
    if (!descricao || !doenca || !diasValidade) {
      setIsErro(true);
      return;
    }
    
    // ATUALIZANDO O MOCK PARA APARECER NA BUSCA
    const novoRegistro = adicionarAtestadoExame({
      descricao,
      doenca,
      diasValidade
    } as any);

    setRegistroSalvo(novoRegistro);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout!} onNavigate={onNavigate!} currentScreen="atestado-exame" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate!("atestado-exame")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Atestados
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Atestado de Exame</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Adicionar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <Info size={20} className="stroke-[2.5] text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            <FloatInput label="Descrição do atestado" required value={descricao} onChange={setDescricao} maxLength={255} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <DoencaInput required data={DOENCAS_CORRIGIDAS_MOCK} value={doenca ? doenca.nome : ""} onChange={setDoenca} onEyeClick={() => {}} />
              <FloatInput label="Dias de Validade do Exame" required value={diasValidade} onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} maxLength={3} />
            </div>
          </div>
        </Section>
      </main>

      {isErro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <AlertTriangle size={32} className="text-red-500 mb-5" />
            <h3 className="text-xl font-bold text-gray-900">Campos obrigatórios</h3>
            <p className="text-sm text-gray-500 mt-2">Preencha todos os campos obrigatórios (*).</p>
            <button onClick={() => setIsErro(false)} className="px-10 h-11 mt-8 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Entendi</button>
          </div>
        </div>
      )}

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <Check size={32} className="text-[#1A7A3C] mb-5 stroke-[3]" />
            <h3 className="text-xl font-bold text-gray-900">Atestado cadastrado com sucesso!</h3>
            <div className="flex gap-4 justify-center mt-8 w-full">
              <button onClick={() => onNavigate!("atestado-exame")} className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button>
              <button onClick={() => onNavigate!("visualizar-atestado-exame", registroSalvo)} className="px-8 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}