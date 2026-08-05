import { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { PessoaFisicaCadastroForm, normalizarPessoaFisica } from "./PessoaFisicaCadastroForm";

interface Props {
  dadosIniciais?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function EditarPessoaFisica({ dadosIniciais, onLogout, onNavigate }: Props) {
  const [form, setForm] = useState(() => normalizarPessoaFisica(dadosIniciais));
  const [sucesso, setSucesso] = useState(false);
  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <header>
          <button type="button" onClick={() => onNavigate("pessoa-fisica")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Todas as Pessoas Físicas
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Pessoa Física</h1>
            <button type="button" onClick={() => setSucesso(true)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Salvar</button>
          </div>
        </header>
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="shrink-0 text-gray-500" />
          <p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.</p>
        </div>
        <PessoaFisicaCadastroForm value={form} onChange={setForm} onNavigate={onNavigate} />
      </main>
      {sucesso && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h2 className="text-lg font-bold text-gray-900">Alterações salvas!</h2>
            <p className="mt-1 text-sm text-gray-500">O cadastro de “{form.nome}” foi atualizado com sucesso.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => onNavigate("pessoa-fisica")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50">Voltar</button>
              <button type="button" onClick={() => onNavigate("visualizar-pessoa-fisica", form)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
