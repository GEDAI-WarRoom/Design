import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EmissaoGtaForm } from "./EmissaoGtaForm";
import {
  obterEmissaoGta,
  type EmissaoGta,
} from "./emissaoGtaData";

export function VisualizarEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: EmissaoGta | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const emissao = dados ?? obterEmissaoGta(null);
  if (!emissao) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("emissao-gta")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Todas as Emissões de GTA
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Emissão de GTA
            </h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-emissao-gta", emissao)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md flex items-center gap-2"
            >
              <Pencil size={15} />
              Editar
            </button>
          </div>
        </div>

        <EmissaoGtaForm value={emissao} mode="view" />
      </main>
    </div>
  );
}
