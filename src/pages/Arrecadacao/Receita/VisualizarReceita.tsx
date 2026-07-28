import { useState } from "react";
import { ArrowLeft, Pencil, FileText, Layers, PlusCircle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, Tabs } from "../../../components/ui/FormKit";
import { classificacaoLabel, Receita } from "./receitaData";
import { ItemReceitaTab } from "../ItemReceita/ItemReceitaTab";

export function VisualizarReceitaPage({ dados, onLogout, onNavigate }: { dados: Receita; onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [activeTab, setActiveTab] = useState("cadastro");
  const [isModalItemOpen, setIsModalItemOpen] = useState(false);

  const tabs = [
    { id: "cadastro", label: "Cadastro", icon: (active: boolean) => <FileText size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "itens-receita", label: "Item de Receita", icon: (active: boolean) => <Layers size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="receita" hideSearch />
      
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("receita")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition">
            <ArrowLeft size={15} /> Todas as Receitas
          </button>
          
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Receita</h1>
            
            {/* O botão do topo altera dinamicamente dependendo de qual aba está ativa */}
            {activeTab === "cadastro" && (
              <button 
                type="button" 
                onClick={() => onNavigate("editar-receita", dados)} 
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                <Pencil size={15} /> Editar
              </button>
            )}

            {activeTab === "itens-receita" && (
              <button 
                type="button" 
                onClick={() => setIsModalItemOpen(true)} 
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                <PlusCircle size={15} /> Adicionar Item
              </button>
            )}
          </div>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        {activeTab === "cadastro" && (
          <section className="bg-white rounded-xl shadow-sm p-6 animate-fadeIn">
            <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Código" value={dados.codigo} disabled onChange={() => {}} />
              <FloatInput label="Descrição" value={dados.descricao} disabled onChange={() => {}} />
              <FloatInput label="Classificação de Receita" value={classificacaoLabel(dados.classificacao)} disabled onChange={() => {}} className="md:col-span-2" />
              <FloatInput label="Situação" value={dados.situacao} disabled onChange={() => {}} />
            </div>
          </section>
        )}

        {activeTab === "itens-receita" && (
          <div className="animate-fadeIn">
            <ItemReceitaTab 
              receitaId={dados.id} 
              isModalOpen={isModalItemOpen} 
              setIsModalOpen={setIsModalItemOpen} 
            />
          </div>
        )}
      </main>
    </div>
  );
}