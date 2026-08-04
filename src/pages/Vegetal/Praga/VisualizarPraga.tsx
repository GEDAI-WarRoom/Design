import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Pencil, Check, Minus } from "lucide-react";
import { Navbar } from "../../../components/Navbar";


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


function ReadOnlyField({
  label,
  value,
  italic = false,
}: {
  label: string;
  value?: string | number;
  italic?: boolean;
}) {
  return (
    <div className="relative border border-gray-200 rounded-md bg-gray-50/60 p-3 flex flex-col justify-center min-h-[52px]">
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-sm font-medium text-gray-800 mt-0.5 ${italic ? "italic" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}


function SituacaoBadge({ situacao }: { situacao: "Ativo" | "Inativo" }) {
  const isAtivo = situacao === "Ativo";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: isAtivo ? "#E6F4EA" : "#F3F4F6",
        border: `1px solid ${isAtivo ? "#A3E2B8" : "#E5E7EB"}`,
        color: isAtivo ? "#1A7A3C" : "#6B7280",
      }}
    >
      {isAtivo ? <Check size={13} strokeWidth={3} /> : <Minus size={13} strokeWidth={3} />}
      {situacao}
    </span>
  );
}


interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}


export function VisualizarPragaPage({ onLogout, onNavigate, dados }: PageProps) {
  const praga = dados || {
    codigo: "112",
    nomeCientifico: "Cerodirphia rubripes",
    nomePopular: "Lagarta-Verde",
    situacao: "Ativo",
    usuarioModificacao: "Lucas Pedro Conte",
    dataModificacao: "14/04/2025 07:29",
  };


  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="praga" hideSearch />


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
              onClick={() => onNavigate("editar-praga", praga)}
              className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>


        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <ReadOnlyField label="Código da Praga" value={praga.codigo || "112"} />
            <ReadOnlyField label="Nome Científico" value={praga.nomeCientifico} italic />
            <ReadOnlyField label="Nome Popular" value={praga.nomePopular} />
          </div>
        </Section>


        {/* 2. Situação do Cadastro */}
        <Section title="Situação do Cadastro">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-gray-500 font-normal">
              Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <SituacaoBadge situacao={praga.situacao || "Ativo"} />
            </div>
          </div>
        </Section>


        {/* 3. Alterações do Cadastro */}
        <Section title="Alterações do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <ReadOnlyField
              label="Usuário"
              value={praga.usuarioModificacao || "Lucas Pedro Conte"}
            />
            <ReadOnlyField
              label="Data e Hora da Modificação"
              value={praga.dataModificacao || "14/04/2025 07:29"}
            />
          </div>
        </Section>
      </main>
    </div>
  );
}

