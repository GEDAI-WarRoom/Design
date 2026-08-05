import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  normalizarProfissionalOficial,
  ProfissionalOficialCadastroForm,
} from "./ProfissionalOficialCadastroForm";

const GREEN = "#1A7A3C";

export function VisualizarProfissionalOficialPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const profissional = normalizarProfissionalOficial(dados);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-oficial" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("profissional-oficial")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Profissionais
          </button>
          <div className="flex justify-between items-center gap-4 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Profissional Oficial</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-profissional-oficial", profissional)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm flex items-center gap-2"
            >
              Editar
            </button>
          </div>
        </div>

        <ProfissionalOficialCadastroForm
          value={profissional}
          disabled
          onNavigate={onNavigate}
        />
      </main>
    </div>
  );
}
