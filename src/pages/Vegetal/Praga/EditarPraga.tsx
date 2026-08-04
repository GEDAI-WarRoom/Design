import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, Check, Eye } from "lucide-react";
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
    codigo: "112",
    nomeCientifico: "Cerodirphia rubripes",
    nomePopular: "Lagarta-Verde",
    situacao: "Ativo",
  };


  const [nomeCientifico, setNomeCientifico] = useState(registroInicial.nomeCientifico || "");
  const [nomePopular, setNomePopular] = useState(registroInicial.nomePopular || "");
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">(
    registroInicial.situacao === "Inativo" ? "Inativo" : "Ativo"
  );


  // Controle dos Modais
  const [modalConfirm, setModalConfirm] = useState<"salvar" | "inativar" | "ativar" | null>(null);
  const [isSucesso, setIsSucesso] = useState(false);


  const getRegistroAtualizado = () => ({
    ...registroInicial,
    nomeCientifico,
    nomePopular,
    situacao,
  });


  const handleVisualizar = () => {
    onNavigate("visualizar-praga", getRegistroAtualizado());
  };


  const handleToggleSituacaoClick = () => {
    if (situacao === "Ativo") {
      setModalConfirm("inativar");
    } else {
      setModalConfirm("ativar");
    }
  };


  const handleConfirmAction = () => {
    if (modalConfirm === "inativar") {
      setSituacao("Inativo");
    } else if (modalConfirm === "ativar") {
      setSituacao("Ativo");
    } else if (modalConfirm === "salvar") {
      setIsSucesso(true);
    }
    setModalConfirm(null);
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
                onClick={() => setModalConfirm("salvar")}
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


        {/* 2. Situação do Cadastro */}
        <Section title="Situação do Cadastro">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-gray-500 font-normal">
              Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-sm font-semibold ${situacao === "Inativo" ? "text-gray-700" : "text-gray-400"}`}>
                Inativo
              </span>
              <button
                type="button"
                onClick={handleToggleSituacaoClick}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  situacao === "Ativo" ? "bg-[#1A7A3C]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    situacao === "Ativo" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold ${situacao === "Ativo" ? "text-[#1A7A3C]" : "text-gray-400"}`}>
                Ativo
              </span>
            </div>
          </div>
        </Section>
      </main>


      {/* --- MODAIS DE CONFIRMAÇÃO --- */}
      {modalConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {modalConfirm === "salvar" && "Salvar Alterações da Praga"}
              {modalConfirm === "inativar" && "Inativar Praga"}
              {modalConfirm === "ativar" && "Ativar Praga"}
            </h3>


            <p className="text-sm text-gray-600 leading-relaxed">
              {modalConfirm === "salvar" && `Deseja salvar as alterações da praga ${nomeCientifico}?`}
              {modalConfirm === "inativar" && `Deseja inativar a praga ${nomeCientifico}?`}
              {modalConfirm === "ativar" && `Deseja ativar a praga ${nomeCientifico}?`}
            </p>


            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setModalConfirm(null)}
                className="px-6 py-2.5 border-2 border-[#1A7A3C] text-[#1A7A3C] font-bold text-sm rounded-lg hover:bg-green-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-6 py-2.5 bg-[#1A7A3C] hover:bg-[#15612F] text-white font-bold text-sm rounded-lg transition shadow-sm"
              >
                {modalConfirm === "salvar" && "Salvar"}
                {modalConfirm === "inativar" && "Inativar"}
                {modalConfirm === "ativar" && "Ativar"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Praga atualizada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">As alterações no cadastro da praga foram salvas.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("praga");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  handleVisualizar();
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

