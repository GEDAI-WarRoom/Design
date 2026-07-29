import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

interface VisualizarIndiceProps {
  dados: any; 
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarIndice({ dados, onLogout, onNavigate }: VisualizarIndiceProps) {
  const [open, setOpen] = useState(true);
  const indice = dados || { nome: "", situacao: "" };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="indice" hideSearch />
      
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("indice")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition">
            <ArrowLeft size={15} /> Todos os Índices
          </button>
          
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Índice</h1>
            <button 
              type="button" 
              onClick={() => onNavigate("adicionar-indice", indice)} 
              className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
            >
              <Pencil size={15} /> Editar
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm overflow-hidden mt-2 border border-gray-200">
          <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Informações Básicas</span>
            {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          
          {open && (
            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <FloatInput label="Nome do Índice" value={indice.nome} disabled onChange={() => {}} />
                <FloatInput label="Situação" value={indice.situacao || "Ativo"} disabled onChange={() => {}} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}