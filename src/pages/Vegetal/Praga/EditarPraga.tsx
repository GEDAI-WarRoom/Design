import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info } from "lucide-react";
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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function EditarPragaPage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInicial = dados || {
    id: 1,
    nomeCientifico: "Cerodirphia rubripes",
    nomePopular: "Lagarta-Verde",
  };

  const [nomeCientifico, setNomeCientifico] = useState(
    registroInicial.nomeCientifico || "Cerodirphia rubripes"
  );
  const [nomePopular, setNomePopular] = useState(
    registroInicial.nomePopular || "Lagarta-Verde"
  );

  // Controle do Modal Único de Confirmação
  const [modalConfirmSalvar, setModalConfirmSalvar] = useState(false);

  const getRegistroAtualizado = () => ({
    ...registroInicial,
    nomeCientifico,
    nomePopular,
  });

  const handleConfirmSave = () => {
    setModalConfirmSalvar(false);
    onNavigate("visualizar-praga", getRegistroAtualizado());
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Praga</h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalConfirmSalvar(true)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Banner de Obrigatoriedade */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput
              label="Nome Científico"
              required
              value={nomeCientifico}
              onChange={setNomeCientifico}
              maxLength={255}
            />
            <FloatInput
              label="Nome Popular"
              required
              value={nomePopular}
              onChange={setNomePopular}
              maxLength={255}
            />
          </div>
        </Section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE SALVAMENTO (CENTRALIZADO) */}
      {modalConfirmSalvar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center flex flex-col items-center justify-center gap-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center">
              Salvar Alterações da Praga
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed text-center">
              Deseja salvar as alterações da praga {nomeCientifico}?
            </p>

            <div className="flex items-center justify-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setModalConfirmSalvar(false)}
                className="px-6 py-2.5 border-2 border-[#1A7A3C] text-[#1A7A3C] font-bold text-sm rounded-lg hover:bg-green-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-6 py-2.5 bg-[#1A7A3C] hover:bg-[#15612F] text-white font-bold text-sm rounded-lg transition shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



