import React, { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Info,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
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
        <span className="text-base font-semibold text-gray-800">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AdicionarUsuariosPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [isLoadingCpf, setIsLoadingCpf] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);

  const handleCpfChange = (val: string) => {
    const masked = val
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14);

    setCpf(masked);

    const numerosLimpos = masked.replace(/\D/g, "");
    if (numerosLimpos.length === 11) {
      setIsLoadingCpf(true);
      setTimeout(() => {
        setNome("Joaquim da Silva");
        setIsLoadingCpf(false);
      }, 600);
    } else if (nome) {
      setNome("");
    }
  };

  const handleAdicionar = () => {
    const numerosCpf = cpf.replace(/\D/g, "");
    
    // Validação direta ao clicar no botão
    if (numerosCpf.length === 11 && nome.trim() !== "") {
      setIsSucesso(true);
    } else {
      alert("Por favor, preencha o CPF completo e certifique-se de que o nome foi carregado.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="usuarios"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("usuarios")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os usuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Usuário
            </h1>
            <button
              type="button"
              onClick={handleAdicionar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span>{" "}
            são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center">
              <FloatInput
                label="CPF"
                required
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              <FloatInput
                label={
                  isLoadingCpf ? "Buscando Nome..." : "Nome"
                }
                required
                value={nome}
                onChange={setNome} 
                maxLength={255}
                disabled={isLoadingCpf}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 items-center">
              <FloatInput
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                maxLength={255}
              />
            </div>
          </div>
        </Section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE SUCESSO */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
           
            <h3 className="text-lg font-bold text-gray-900">
              Usuário cadastrado com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              O cadastro do usuário {nome} foi realizado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("usuarios");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-usuario", {
                    cpf,
                    nome,
                    email,
                  });
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