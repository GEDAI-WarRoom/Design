import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { Indice, salvarIndice } from "./indiceIndice";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean; }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 py-6 flex flex-col gap-6">{children}</div>}
    </div>
  );
}

interface AdicionarIndiceProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: Indice; // Recebe os dados caso seja modo Edição
}

export function AdicionarIndice({ onLogout, onNavigate, data }: AdicionarIndiceProps) {
  const isEdicao = !!data;
  const [nome, setNome] = useState(data?.nome ?? "");
  const [situacao, setSituacao] = useState<string>(data?.situacao ?? "Ativo");
  const [isSucesso, setIsSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<Indice | null>(null);

  const salvar = () => {
    const registro = salvarIndice({
      id: data?.id,
      nome: nome.trim() || "UFEMG",
      situacao: (situacao || "Ativo") as Indice["situacao"],
    });
    setNome(registro.nome);
    setSituacao(registro.situacao);
    setRegistroSalvo(registro);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="indice" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("indice")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Todos os Índices
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEdicao ? "Editar Índice" : "Adicionar Índice"}
            </h1>
            <button type="button" onClick={salvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              {isEdicao ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className={`grid grid-cols-1 ${isEdicao ? "md:grid-cols-2" : "md:grid-cols-1"} gap-5`}>
            <FloatInput label="Nome do Índice" required value={nome} onChange={setNome} maxLength={255} />
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">{isEdicao ? "Índice atualizado com sucesso!" : "Índice cadastrado com sucesso!"}</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `O índice "${nome}"` : "O índice"} foi {isEdicao ? "atualizado" : "cadastrado"}.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button type="button" onClick={() => onNavigate("indice")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">
                Voltar
              </button>
              <button type="button" onClick={() => onNavigate("visualizar-indice", registroSalvo)} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
