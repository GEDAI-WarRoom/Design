import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, AlertTriangle, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { DoencaInput } from "../../../components/ui/EntitySearch";

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

export function EditarAtestadoExamePage({ dados, onLogout, onNavigate }: { dados?: any; onLogout?: () => void; onNavigate?: (s: string, d?: any) => void; }) {
  const registroAtual = dados || { descricao: "", doenca: null, diasValidade: "", situacao: "Ativo" };

  const [descricao, setDescricao] = useState(registroAtual.descricao || "");
  const [doenca, setDoenca] = useState<any | null>(registroAtual.doenca || null);
  const [diasValidade, setDiasValidade] = useState(String(registroAtual.diasValidade || ""));
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Ativo");

  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false);

  const handleSalvar = () => {
    if (!descricao || !doenca || !diasValidade || !situacao) {
      setIsErro(true);
      return;
    }
    setIsSucesso(true);
  };

  const objetoAtualizado = { ...registroAtual, descricao, doenca, diasValidade, situacao };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout!} onNavigate={onNavigate!} currentScreen="atestado-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate!("visualizar-atestado-exame", registroAtual)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Visualizar Atestado
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Atestado de Exame</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <FloatInput label="Descrição do atestado" required value={descricao} onChange={setDescricao} maxLength={255} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full">
              <DoencaInput required data={DOENCAS_CORRIGIDAS_MOCK} value={doenca ? doenca.nome : ""} onChange={(entidade) => setDoenca(entidade)} onEyeClick={() => {}} />
              <FloatInput label="Dias de Validade do Exame" required value={diasValidade} onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} maxLength={3} />
              <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
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
            <button onClick={() => setIsErro(false)} className="px-10 h-11 mt-8 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold transition">Entendi</button>
          </div>
        </div>
      )}

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <Check size={32} className="text-[#1A7A3C] mb-5 stroke-[3]" />
            <h3 className="text-xl font-bold text-gray-900">Atestado atualizado com sucesso!</h3>
            <div className="flex gap-4 justify-center mt-8 w-full">
              <button onClick={() => { setIsSucesso(false); onNavigate!("atestado-exame"); }} className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate!("visualizar-atestado-exame", objetoAtualizado); }} className="px-8 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}