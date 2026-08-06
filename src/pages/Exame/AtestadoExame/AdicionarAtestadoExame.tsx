import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, Check, AlertTriangle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { DoencasAtestadoField } from "./DoencasAtestadoField";
import {
  adicionarAtestadoExame,
  tipoAtestadoValido,
  type DoencaAtestadoExame,
} from "./atestadoExameData";

const GREEN = "#1A7A3C";

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
  const [doencas, setDoencas] = useState<DoencaAtestadoExame[]>([]);
  const [diasValidade, setDiasValidade] = useState("");
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const [isSucesso, setIsSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<any>(null);

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!tipoAtestadoValido({ descricao, doencas, diasValidade })) return;
    const novoRegistro = adicionarAtestadoExame({
      descricao: descricao.trim(),
      doencas,
      diasValidade,
    });

    setRegistroSalvo(novoRegistro);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout!} onNavigate={onNavigate!} currentScreen="atestado-exame" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate!("atestado-exame")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Tipos de Atestado
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Tipo de Atestado</h1>
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
            <DoencasAtestadoField
              value={doencas}
              onChange={setDoencas}
              error={tentouSalvar && doencas.length === 0 ? "Selecione ao menos uma doença." : undefined}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FloatInput label="Dias de Validade do Exame" required value={diasValidade} onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} maxLength={3} />
            </div>
            {tentouSalvar && !tipoAtestadoValido({ descricao, doencas, diasValidade }) && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <AlertTriangle size={18} /> Preencha corretamente todos os campos obrigatórios.
              </div>
            )}
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <Check size={32} className="text-[#1A7A3C] mb-5 stroke-[3]" />
            <h3 className="text-xl font-bold text-gray-900">Tipo de atestado cadastrado com sucesso!</h3>
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
