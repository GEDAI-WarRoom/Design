import React, { useState } from "react";
import { ArrowLeft, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

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

export function VisualizarDivisaoMunicipalPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const divisao = dados || {};

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="divisao-municipal" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        <div>
          <button type="button" onClick={() => onNavigate("divisao-municipal")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Divisões Municipais
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Divisão Municipal</h1>
            <button 
              type="button" 
              onClick={() => onNavigate("editar-divisao-municipal", divisao)} 
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Código" value={divisao.codigo || "-"} disabled onChange={() => {}} />
            <FloatInput label="Nome da Divisão" value={divisao.nome || "-"} disabled onChange={() => {}} />
            <FloatInput label="Município" value={divisao.municipio || "-"} disabled onChange={() => {}} />
            <FloatInput label="Situação" value={divisao.situacao || "Ativo"} disabled onChange={() => {}} />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={divisao.observacao || "Nenhuma observação registrada."} disabled onChange={() => {}} />
        </Section>

      </main>
    </div>
  );
}