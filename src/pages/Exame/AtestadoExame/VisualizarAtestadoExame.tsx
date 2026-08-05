import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { DoencaInput } from "../../../components/ui/EntitySearch";

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

export function VisualizarAtestadoExamePage({ onLogout, onNavigate, dados }: { dados?: any; onLogout?: () => void; onNavigate?: (s: string, d?: any) => void; }) {
  const atestado = dados || { descricao: "Atestado para realização de exame de Brucelose", doenca: { id: 2, codigo: "D02", nome: "Brucelose" }, diasValidade: "60" };
  const nomeDoenca = atestado.doenca?.nome || "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout!} onNavigate={onNavigate!} currentScreen="atestado-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate!("atestado-exame")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Atestados de Exame
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Atestado de Exame</h1>
            <button type="button" onClick={() => onNavigate!("editar-atestado-exame", atestado)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <FloatInput label="Descrição do atestado" required value={atestado.descricao} disabled onChange={() => {}} maxLength={255} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
              <DoencaInput required disabled data={[atestado.doenca]} value={nomeDoenca} onChange={() => {}} />
              <FloatInput label="Dias de Validade do Exame" required value={String(atestado.diasValidade)} disabled onChange={() => {}} maxLength={3} />
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}

export default VisualizarAtestadoExamePage;
