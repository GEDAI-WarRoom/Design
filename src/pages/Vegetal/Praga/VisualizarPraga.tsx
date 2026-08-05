import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_PRAGA = { nomeCientifico: "Spodoptera frugiperda", nomePopular: "Lagarta-do-cartucho", situacao: "Ativo", observacao: "Praga de importância econômica para a cultura do milho." };

function Section({ title, children }: { title: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

export function VisualizarPragaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const praga = { ...(dados || {}), nomeCientifico: dados?.nomeCientifico || EXEMPLO_PRAGA.nomeCientifico, nomePopular: dados?.nomePopular || dados?.nome || EXEMPLO_PRAGA.nomePopular, situacao: dados?.situacao || EXEMPLO_PRAGA.situacao, observacao: dados?.observacao || EXEMPLO_PRAGA.observacao };
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarPragaPage({ onLogout, onNavigate, dados }: PageProps) {
  const praga = dados || {
    id: 1,
    nomeCientifico: "Cerodirphia rubripes",
    nomePopular: "Lagarta-Verde",
  };

  const nomeCientificoVal = praga.nomeCientifico || "Cerodirphia rubripes";
  const nomePopularVal = praga.nomePopular || "Lagarta-Verde";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="praga" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("praga")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Pragas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Praga</h1>
            <button type="button" onClick={() => onNavigate("editar-praga", praga)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("praga")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Pragas
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Praga</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-praga", { ...praga, nomeCientifico: nomeCientificoVal, nomePopular: nomePopularVal })}
              className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome Científico" value={praga.nomeCientifico} disabled onChange={() => {}} />
            <FloatInput label="Nome Popular" value={praga.nomePopular} disabled onChange={() => {}} />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={praga.observacao} disabled onChange={() => {}} />
        </Section>
        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput
              label="Nome Científico"
              required
              disabled
              value={nomeCientificoVal}
              onChange={() => {}}
            />
            <FloatInput
              label="Nome Popular"
              required
              disabled
              value={nomePopularVal}
              onChange={() => {}}
            />
          </div>
        </Section>
      </main>
    </div>
  );
}



