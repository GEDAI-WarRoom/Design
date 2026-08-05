import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

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

export function VisualizarDistribuicaoFormulariosGtaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const dist = {
    id: 1,
    escritorio: { id: 1, nome: "Escritório Seccional de Lavras" },
    serie: "A1",
    numeroInicial: 1,
    numeroFinal: 500,
    situacao: "Ativo",
    ...(dados || {}),
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="distribuicao-formularios-gta" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("distribuicao-formularios-gta")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Distribuições
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Distribuição de Formulários</h1>
            <button type="button" onClick={() => onNavigate("editar-distribuicao-formularios-gta", dist)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Escritório Seccional" value={dist.escritorio?.nome || "Escritório Seccional de Lavras"} disabled onChange={() => {}} />
            <FloatInput label="Série" value={dist.serie || "A1"} disabled onChange={() => {}} />
            <FloatInput label="Número Inicial" value={String(dist.numeroInicial || 1)} disabled onChange={() => {}} />
            <FloatInput label="Número Final" value={String(dist.numeroFinal || 500)} disabled onChange={() => {}} />
            <FloatInput label="Situação" value={dist.situacao || "Ativo"} disabled onChange={() => {}} />
          </div>
        </Section>
      </main>
    </div>
  );
}
