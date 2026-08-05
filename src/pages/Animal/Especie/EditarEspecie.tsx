import React, { useState } from "react";
import { ArrowLeft, Info, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SimNao } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// Grupos de Espécies (US016)
const GRUPOS = [
  "Anfíbios",
  "Aves",
  "Bovídeos",
  "Crustáceos",
  "Equídeos",
  "Grandes Roedores",
  "Invertebrados",
  "Moluscos",
  "Outras Espécies",
  "Peixes",
  "Répteis",
  "Suídeos",
  "Taiassuídeos",
];

// Helper para Seções Dobráveis
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
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>
      )}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
  data?: any;
}

export function EditarEspeciePage({
  onLogout,
  onNavigate,
  dados,
  data,
}: PageProps) {
  // Suporte a props de dados recebidas por parâmetro
  const initialData = dados || data || {
    grupo: "Bovídeos",
    nome: "Bovino",
    nomeCientifico: "Bos taurus",
    codigoMapa: "5300100201",
    maxAnimaisGta: "500",
    controleRebanhoNucleo: "Não",
    sexoDefinido: "Sim",
    emissaoGtaHabilitado: "Sim",
    utilizaFormularioGta: "Não",
    situacao: "Ativo",
  };

  // 1. Informações Básicas
  const [grupo, setGrupo] = useState(initialData.grupo || "Bovídeos");
  const [nome, setNome] = useState(initialData.nome || "");
  const [nomeCientifico, setNomeCientifico] = useState(initialData.nomeCientifico || "");
  const [codigoMapa, setCodigoMapa] = useState(initialData.codigoMapa || "");

  // 2. Informações da GTA / Complementares
  const [maxAnimaisGta, setMaxAnimaisGta] = useState(initialData.maxAnimaisGta || "");
  const [controleRebanhoNucleo, setControleRebanhoNucleo] = useState(initialData.controleRebanhoNucleo || "Não");
  const [sexoDefinido, setSexoDefinido] = useState(initialData.sexoDefinido || "Sim");
  const [emissaoGtaHabilitado, setEmissaoGtaHabilitado] = useState(initialData.emissaoGtaHabilitado || "Sim");
  const [utilizaFormularioGta, setUtilizaFormularioGta] = useState(initialData.utilizaFormularioGta || "Não");

  // 3. Situação do Cadastro com Toggle Switch
  const [isCadastroAtivo, setIsCadastroAtivo] = useState(initialData.situacao !== "Inativo");
  const [isConfirmarToggleModalOpen, setIsConfirmarToggleModalOpen] = useState(false);
  const [proximoEstadoAtivo, setProximoEstadoAtivo] = useState(isCadastroAtivo);

  // Modais de Controle de Salvar
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSalvarConfirmado = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const getDadosAtualizados = () => ({
    ...initialData,
    grupo,
    nome,
    nomeCientifico,
    codigoMapa,
    maxAnimaisGta,
    controleRebanhoNucleo,
    sexoDefinido,
    emissaoGtaHabilitado,
    utilizaFormularioGta,
    situacao: isCadastroAtivo ? "Ativo" : "Inativo",
  });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="especie" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Topo / Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-especie", initialData)}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Visualizar Espécie
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Espécie</h1>
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Info Box */}
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
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatSelect
                label="Grupo"
                required
                value={grupo}
                onChange={setGrupo}
                options={GRUPOS.map((g) => ({ value: g, label: g }))}
              />
              <FloatInput
                label="Nome da Espécie"
                required
                value={nome}
                onChange={setNome}
                maxLength={255}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput
                label="Nome Científico"
                value={nomeCientifico}
                onChange={setNomeCientifico}
                maxLength={255}
              />
              <FloatInput
                label="Código do MAPA"
                required
                value={codigoMapa}
                onChange={(v: string) => setCodigoMapa(v.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
          </div>
        </Section>

        {/* 2. Informações da GTA / Complementares */}
        <Section title="Informações da GTA">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput
                label="Número máximo de animais por GTA"
                value={maxAnimaisGta}
                onChange={(v: string) => setMaxAnimaisGta(v.replace(/\D/g, ""))}
                inputMode="numeric"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
              <SimNao
                label="Possui Controle de Rebanho por Núcleo?"
                required
                value={controleRebanhoNucleo}
                onChange={setControleRebanhoNucleo}
              />
              <SimNao
                label="Possui Sexo Definido?"
                required
                value={sexoDefinido}
                onChange={setSexoDefinido}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
              <SimNao
                label="Espécie Permite Emissão de GTA por Habilitado?"
                required
                value={emissaoGtaHabilitado}
                onChange={setEmissaoGtaHabilitado}
              />
              <SimNao
                label="Utiliza Formulário para a Emissão de GTA?"
                required
                value={utilizaFormularioGta}
                onChange={setUtilizaFormularioGta}
              />
            </div>
          </div>
        </Section>

        {/* 3. Situação do Cadastro com Toggle Switch */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
            <p className="text-xs text-gray-400 font-normal">
              Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
            </p>
          </div>

          {/* Container do Toggle */}
          <div className="flex items-center gap-3 select-none flex-shrink-0">
            <span className={`text-xs font-semibold transition-colors duration-200 ${!isCadastroAtivo ? "text-red-600" : "text-gray-400"}`}>
              Inativo
            </span>

            {/* Botão Switch/Toggle (Verde quando ativo, Vermelho quando inativo) */}
            <button
              type="button"
              onClick={() => {
                setProximoEstadoAtivo(!isCadastroAtivo);
                setIsConfirmarToggleModalOpen(true);
              }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 outline-none ${
                isCadastroAtivo ? "bg-[#1A7A3C]" : "bg-red-600"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform duration-300 shadow-sm ${
                  isCadastroAtivo ? "translate-x-8" : "translate-x-1"
                }`}
              >
                {isCadastroAtivo && (
                  <svg className="w-3 h-3 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>

            <span className={`text-xs font-semibold transition-colors duration-200 ${isCadastroAtivo ? "text-[#1A7A3C]" : "text-gray-400"}`}>
              Ativo
            </span>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação do Toggle (Ativar / Inativar Espécie) */}
      {isConfirmarToggleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center gap-6 relative">
            <div className="flex flex-col gap-2 w-full mt-2">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {proximoEstadoAtivo ? "Ativar Espécie" : "Inativar Espécie"}
              </h2>
              <p className="text-sm text-gray-600 font-normal leading-relaxed mt-1 px-1">
                Deseja {proximoEstadoAtivo ? "ativar" : "inativar"} o cadastro da espécie{" "}
                <span className="font-semibold text-gray-800">
                  {nome ? nome : "esta espécie"}
                </span>?
              </p>
            </div>

            <div className="flex justify-center items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmarToggleModalOpen(false)}
                className="px-10 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-md shadow-sm transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCadastroAtivo(proximoEstadoAtivo);
                  setIsConfirmarToggleModalOpen(false);
                }}
                className={`px-10 h-11 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 ${
                  proximoEstadoAtivo 
                    ? "bg-[#1A7A3C] hover:bg-[#15612F]" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {proximoEstadoAtivo ? "Ativar" : "Inativar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Salvar */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Edições</h3>
            <p className="text-sm text-gray-600 mb-6">
              Deseja salvar as alterações realizadas na espécie <strong>"{nome}"</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 h-10 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarConfirmado}
                className="px-5 h-10 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">Os dados da espécie foram atualizados.</p>
            <div className="flex justify-center mt-6 gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate("especie");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Todas as Espécies
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate("visualizar-especie", getDadosAtualizados());
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