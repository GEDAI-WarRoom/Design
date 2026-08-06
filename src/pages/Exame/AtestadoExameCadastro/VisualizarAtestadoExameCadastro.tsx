import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { AtestadoExameCadastroForm } from "./AtestadoExameCadastroForm";
import { AtestadoExameEmitido } from "./AtestadoExameEmitido";
import {
  listarAtestadosCadastro,
  type AtestadoExameCadastro,
} from "./atestadoExameCadastroData";

export function VisualizarAtestadoExameCadastroPage({
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
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cadastro-atestado-exame" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("cadastro-atestado-exame")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Todos os Atestados de Exame
          </button>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Atestado de Exame</h1>
            <div className="flex gap-2">
              <AtestadoExameEmitido value={value} />
              <button type="button" onClick={() => onNavigate("editar-cadastro-atestado-exame", value)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-4 text-xs font-bold text-white hover:bg-[#15612F]">
                <Pencil size={16} /> Editar
              </button>
            </div>
          </div>
        </div>
        <AtestadoExameCadastroForm value={value} onChange={() => { }} mode="view" />
      </main>
    </div>
  );
}
