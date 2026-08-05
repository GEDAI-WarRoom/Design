import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_CULTURA = { nome: "Café", tipo: "Perene", variedades: [{ nome: "Catuaí Vermelho" }], pragas: [{ praga: { nomeCientifico: "Hypothenemus hampei", nomePopular: "Broca-do-café" } }], situacao: "Ativo", observacao: "Cultura perene de relevância econômica para Minas Gerais." };

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

export function VisualizarCulturaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const cultura = { ...(dados || {}), nome: dados?.nome || EXEMPLO_CULTURA.nome, tipo: dados?.tipo || EXEMPLO_CULTURA.tipo, variedades: dados?.variedades?.length ? dados.variedades : EXEMPLO_CULTURA.variedades, pragas: dados?.pragas?.length ? dados.pragas : EXEMPLO_CULTURA.pragas, situacao: dados?.situacao || EXEMPLO_CULTURA.situacao, observacao: dados?.observacao || EXEMPLO_CULTURA.observacao };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cultura" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("cultura")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Culturas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Cultura</h1>
            <button type="button" onClick={() => onNavigate("editar-cultura", cultura)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome da Cultura" value={cultura.nome} disabled onChange={() => {}} />
            <FloatInput label="Tipo de Cultura" value={cultura.tipo} disabled onChange={() => {}} />
          </div>
        </Section>

        <Section title="Variedades">
          {cultura.variedades.map((variedade: any, index: number) => <FloatInput key={index} label={`Nome da Variedade ${index + 1}`} value={variedade.nome} disabled onChange={() => {}} />)}
        </Section>

        <Section title="Pragas">
          {cultura.pragas.map((item: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Nome Científico" value={item.praga?.nomeCientifico} disabled onChange={() => {}} /><FloatInput label="Nome Popular" value={item.praga?.nomePopular} disabled onChange={() => {}} /></div>)}
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={cultura.observacao} disabled onChange={() => {}} />
        </Section>
      </main>
    </div>
  );
}
