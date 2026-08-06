import React, { useState } from "react";
import { ArrowLeft, Pencil, FileText, Hash, PlusCircle, DollarSign } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, Tabs } from "../../../components/ui/FormKit";
import { ValorIndiceTab } from "./ValorIndiceTab"; // Importando a nova aba
import * as Icons from "../../../imports/icons";
import { obterIndice } from "./indiceIndice";

interface VisualizarIndiceProps {
  dados: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarIndice({ dados, onLogout, onNavigate }: VisualizarIndiceProps) {
  // Controle da aba atual
  const [activeTab, setActiveTab] = useState("cadastro");

  // Controle de abertura do modal da aba de Valor do Índice
  const [isModalValorOpen, setIsModalValorOpen] = useState(false);

  const indice = { ...(obterIndice(dados?.id) ?? obterIndice(null)!), ...(dados || {}) };

  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (active: boolean) => (
        <FileText
          size={18}
          className={active ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
    {
      id: "valor-indice",
      label: "Valor do Índice",
      icon: (active: boolean) => (
        <img
          src={Icons.iconeIndiceUrl}
          alt="Valor por Índice"
          className={`w-5 h-5 object-contain transition-all ${active ? "" : "grayscale opacity-50"
            }`}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="indice" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("indice")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Todos os Índices
          </button>

          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Índice</h1>

            {/* BOTÕES DINÂMICOS NO CABEÇALHO */}
            {activeTab === "cadastro" && (
              <button
                type="button"
                onClick={() => onNavigate("adicionar-indice", indice)}
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                Editar
              </button>
            )}

            {activeTab === "valor-indice" && (
              <button
                type="button"
                onClick={() => setIsModalValorOpen(true)}
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                Adicionar Valor
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <FloatInput label="Nome do Índice" value={indice.nome} disabled onChange={() => { }} />
              <FloatInput label="Situação" value={indice.situacao || "Ativo"} disabled onChange={() => { }} />
            </div>
          </section>
        )}

        {/* Aba 2: Valor do Índice */}
        {activeTab === "valor-indice" && (
          <ValorIndiceTab
            indiceNome={indice.nome}
            isModalOpen={isModalValorOpen}
            setIsModalOpen={setIsModalValorOpen}
            onNavigate={onNavigate}
          />
        )}

      </main>
    </div>
  );
}
