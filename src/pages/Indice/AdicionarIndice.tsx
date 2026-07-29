import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Info,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { FloatInput, FloatSelect } from "../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const SITUACOES_OPCOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

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

interface IndiceData {
  id?: string;
  nome: string;
  situacao?: "Ativo" | "Inativo";
  valor?: number | string;
  ano?: number | string;
}

interface AdicionarIndiceProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: IndiceData;
}

export function AdicionarIndice({ onLogout, onNavigate, data }: AdicionarIndiceProps) {
  const isEdicao = !!data;

  const [nome, setNome] = useState(data?.nome ?? "");
  const [valor, setValor] = useState(data?.valor ? String(data.valor) : "");
  const [ano, setAno] = useState(data?.ano ? String(data.ano) : "");
  const [situacao, setSituacao] = useState<string>(data?.situacao ?? "Ativo");

  const [isSucesso, setIsSucesso] = useState(false);

  const formularioValido = nome.trim() !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="indice"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Topo / Voltar */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("indice")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Índices
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEdicao ? "Editar Índice" : "Adicionar Índice"}
            </h1>
            <button
              type="button"
              disabled={!formularioValido}
              onClick={() => setIsSucesso(true)}
              className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] disabled:opacity-50 text-white text-sm rounded-md transition shadow-sm"
            >
              {isEdicao ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Banner de Informação */}
        <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são
            obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Formulário em Seção */}
        <Section title="Informações do Índice">
          <div
            className={`grid grid-cols-1 ${
              isEdicao ? "md:grid-cols-3" : "md:grid-cols-2"
            } gap-4 items-center`}
          >
            <FloatInput
              label="Nome do Índice"
              required
              value={nome}
              onChange={setNome}
              maxLength={255}
            />
            <FloatInput
              label="Ano Vigente"
              value={ano}
              onChange={setAno}
              maxLength={4}
            />
            <FloatInput
              label="Valor Inicial"
              value={valor}
              onChange={setValor}
            />
            {isEdicao && (
              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_OPCOES}
              />
            )}
          </div>
        </Section>
      </main>

      {/* Modal de Confirmação/Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdicao ? "Índice atualizado com sucesso!" : "Índice cadastrado com sucesso!"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {nome ? `O índice "${nome}"` : "O índice"} foi{" "}
              {isEdicao ? "atualizado" : "cadastrado"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("indice");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("indice");
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