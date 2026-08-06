import { ArrowLeft, FileText, Link2 } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  listarAtestadosCadastro,
  type AtestadoExameCadastro,
} from "./atestadoExameCadastroData";

export function VinculacoesAtestadoExameCadastroPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: AtestadoExameCadastro | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const value = dados ?? listarAtestadosCadastro()[0];
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cadastro-atestado-exame" hideSearch />
      <main className="mx-auto max-w-[1088px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("cadastro-atestado-exame")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]">
          <ArrowLeft size={15} /> Todos os Atestados de Exame
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Vinculações do Atestado de Exame</h1>

        <div className="mt-5 flex gap-2 border-b border-gray-200">
          <button type="button" onClick={() => onNavigate("visualizar-cadastro-atestado-exame", value)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-500 hover:text-[#1A7A3C]">
            <FileText size={16} /> Cadastro
          </button>

        </div>

        <section className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="font-semibold text-gray-800">Vinculações</h2>
          <p className="mt-2 text-sm text-gray-500">
            As vinculações necessárias serão discutidas com o cliente posteriormente.
          </p>
        </section>
      </main>
    </div>
  );
}
