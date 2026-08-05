import { useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { PessoaFisicaCadastroForm, normalizarPessoaFisica } from "./PessoaFisicaCadastroForm";

interface Props {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarPessoaFisica({ dados, onLogout, onNavigate }: Props) {
  const [pessoa] = useState(() => normalizarPessoaFisica(dados));
  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <header>
          <button type="button" onClick={() => onNavigate("pessoa-fisica")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Todas as Pessoas Físicas
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Pessoa Física</h1>
            <button type="button" onClick={() => onNavigate("editar-pessoa-fisica", pessoa)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">
              Editar
            </button>
          </div>
        </header>
        <PessoaFisicaCadastroForm value={pessoa} onChange={() => { }} disabled onNavigate={onNavigate} />
      </main>
    </div>
  );
}
