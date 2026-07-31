import React, { useState } from "react";
import { ArrowLeft, Pencil, FileText, Hash, PlusCircle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, Tabs } from "../../../components/ui/FormKit";
import { IndiceTab } from "../Indice/IndiceTab";

interface VisualizarValorIndiceProps {
  dados: any; 
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarValorIndicePage({ dados, onLogout, onNavigate }: VisualizarValorIndiceProps) {
  // Controle da aba atual
  const [activeTab, setActiveTab] = useState("cadastro");
  
  // Controle de abertura do modal da aba de Índice
  const [isModalIndiceOpen, setIsModalIndiceOpen] = useState(false);

  // Fallback de dados
  const valorIndice = dados || {
    indice: "",
    ano: "",
    mes: "",
    valor: 0,
    situacao: "Ativo"
  };

  const fmtValor = (v: number | string) => {
    const num = typeof v === 'string' ? Number(v.replace(",", ".")) : v;
    return `R$ ${(num || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const tabs = [
    { 
      id: "cadastro", 
      label: "Cadastro", 
      icon: (active: boolean) => <FileText size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> 
    },
    { 
      id: "indice", 
      label: "Índice", 
      icon: (active: boolean) => <Hash size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="valor-indice" hideSearch />
      
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button 
            type="button" 
            onClick={() => onNavigate("valor-indice")} 
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Todos os Valores por Índice
          </button>
          
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Valor por Índice</h1>
            
            {/* BOTÕES DINÂMICOS NO CABEÇALHO */}
            {activeTab === "cadastro" && (
              <button 
                type="button" 
                onClick={() => onNavigate("adicionar-valor-indice", valorIndice)} 
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                <Pencil size={15} /> Editar
              </button>
            )}

            {activeTab === "indice" && (
              <button 
                type="button" 
                onClick={() => setIsModalIndiceOpen(true)} 
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                <PlusCircle size={15} /> Adicionar Índice
              </button>
            )}
          </div>
        </div>

        {/* Componente de Abas */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        {/* Aba 1: Cadastro */}
        {activeTab === "cadastro" && (
          <section className="bg-white rounded-xl shadow-sm p-6 animate-fadeIn border border-gray-200">
            <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">
              Informações Básicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Valor" value={fmtValor(valorIndice.valor)} disabled onChange={() => {}} />
              <FloatInput label="Mês" value={valorIndice.mes} disabled onChange={() => {}} />
              <FloatInput label="Ano" value={valorIndice.ano} disabled onChange={() => {}} />
              <FloatInput label="Situação" value={valorIndice.situacao} disabled onChange={() => {}} />
            </div>
          </section>
        )}

        {/* Aba 2: Índice */}
        {activeTab === "indice" && (
          <IndiceTab 
            valorIndiceId={valorIndice.id} 
            isModalOpen={isModalIndiceOpen}
            setIsModalOpen={setIsModalIndiceOpen}
          />
        )}

      </main>
    </div>
  );
}