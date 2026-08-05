import React, { useState } from "react";
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  atualizarIsencaoTaxaDocumentoSanitario,
  obterIsencaoTaxaDocumentoSanitario,
  type IsencaoTaxaDocumentoSanitario,
} from "./isencaoTaxaGtaData";

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

export function EditarIsencaoTaxaGtaPage({ dados, onLogout, onNavigate }: { dados?: Partial<IsencaoTaxaDocumentoSanitario>; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const registroAtual = obterIsencaoTaxaDocumentoSanitario(dados);
  const [isSucesso, setIsSucesso] = useState(false);
  const [motivo, setMotivo] = useState(registroAtual.motivo);
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">(
    registroAtual.situacao,
  );
  const [registroSalvo, setRegistroSalvo] =
    useState<IsencaoTaxaDocumentoSanitario | null>(null);
  const isencaoAtualizada: IsencaoTaxaDocumentoSanitario = {
    id: registroAtual.id,
    motivo: motivo.trim(),
    situacao,
  };

  const salvar = () => {
    if (!motivo.trim()) return;
    const resultado =
      atualizarIsencaoTaxaDocumentoSanitario(isencaoAtualizada);
    setRegistroSalvo(resultado.registro);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="isencao-taxa-gta" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("isencao-taxa-gta")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Isenções
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Isenção de Taxa de Documento Sanitário</h1>
            <button type="button" disabled={!motivo.trim()} onClick={salvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
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
            <FloatInput label="Motivo da Isenção de Taxa de Documento Sanitário" required value={motivo} onChange={setMotivo} />
            <FloatSelect label="Situação" required value={situacao} onChange={(valor) => setSituacao(valor as "Ativo" | "Inativo")} options={[ { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" } ]} />
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">A isenção "{motivo}" foi atualizada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("isencao-taxa-gta"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-isencao-taxa-gta", registroSalvo ?? isencaoAtualizada); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
