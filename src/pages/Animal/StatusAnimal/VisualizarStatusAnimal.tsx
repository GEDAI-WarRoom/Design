import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { StatusAnimalForm } from "./StatusAnimalForm";
import { obterStatusAnimal, type StatusAnimal } from "./statusAnimalData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: StatusAnimal | null;
}

export function VisualizarStatusAnimalPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registro = dados ?? obterStatusAnimal(null);

  if (!registro) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="status-animal"
        hideSearch
      />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("status-animal")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Todos os Status Animal
          </button>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Status Animal</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-status-animal", registro)}
              className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Editar
            </button>
          </div>
        </div>

        <StatusAnimalForm value={registro} onChange={() => {}} disabled />
      </main>
    </div>
  );
}

