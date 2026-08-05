import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_PRAGA = {
  nomeCientifico: "Spodoptera frugiperda",
  nomePopular: "Lagarta-do-cartucho",
  observacao: "Praga de importância econômica para a cultura do milho.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

interface PageProps {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function EditarPragaPage({ dados, onLogout, onNavigate }: PageProps) {
  const [nomeCientifico, setNomeCientifico] = useState(dados?.nomeCientifico || EXEMPLO_PRAGA.nomeCientifico);
  const [nomePopular, setNomePopular] = useState(dados?.nomePopular || dados?.nome || EXEMPLO_PRAGA.nomePopular);
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_PRAGA.observacao);
  const [modalConfirmar, setModalConfirmar] = useState(false);

  const dadosAtualizados = { ...dados, nomeCientifico, nomePopular, observacao };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="praga" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("praga")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todas as Pragas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Praga</h1>
            <button
              type="button"
              onClick={() => setModalConfirmar(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome Científico" required value={nomeCientifico} onChange={setNomeCientifico} maxLength={255} />
            <FloatInput label="Nome Popular" required value={nomePopular} onChange={setNomePopular} maxLength={255} />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} />
        </Section>
      </main>

      {modalConfirmar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Salvar alterações da praga</h3>
            <p className="text-sm text-gray-500 mt-2">Deseja salvar as alterações de "{nomePopular}"?</p>
            <div className="flex gap-3 justify-center mt-6">
              <button type="button" onClick={() => setModalConfirmar(false)} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Cancelar</button>
              <button type="button" onClick={() => onNavigate("visualizar-praga", dadosAtualizados)} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
