import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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

export function EditarProfissionalOficialPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  
  const [nome, setNome] = useState(dados?.nome || "");
  const [cpf, setCpf] = useState(dados?.cpf || "");
  const [matricula, setMatricula] = useState(dados?.matricula || "");
  const [situacao, setSituacao] = useState(dados?.situacao || "Ativo");
  const [observacao, setObservacao] = useState(dados?.observacao || "");

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-oficial" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        <div>
          <button type="button" onClick={() => onNavigate("profissional-oficial")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Profissionais
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Profissional Oficial</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome Completo" required value={nome} onChange={setNome} maxLength={255} />
            <FloatInput label="CPF" required value={cpf} onChange={setCpf} maxLength={14} disabled />
            <FloatInput label="Matrícula / MASP" value={matricula} onChange={setMatricula} />
            <FloatSelect
              label="Situação" required value={situacao} onChange={setSituacao}
              options={[ { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" } ]}
            />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O profissional "{nome}" foi atualizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("profissional-oficial"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-profissional-oficial", dados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}