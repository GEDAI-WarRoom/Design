import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { ClassificacaoSanitariaForm } from "./ClassificacaoSanitariaForm";
import {
  CLASSIFICACOES_SANITARIAS_MOCK,
  ClassificacaoSanitariaEstado,
} from "./classificacaoSanitariaData";

export function VisualizarClassificacaoSanitariaEstadoPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: ClassificacaoSanitariaEstado;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const value = dados ?? CLASSIFICACOES_SANITARIAS_MOCK[0];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="classificacao-sanitaria-estado" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("classificacao-sanitaria-estado")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} />Todas as Classificações Sanitárias por Estado
          </button>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Classificação Sanitária por Estado</h1>
            <button type="button" onClick={() => onNavigate("editar-classificacao-sanitaria-estado", value)} className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2">
              <Pencil size={15} />Editar
            </button>
          </div>
        </div>
        <ClassificacaoSanitariaForm value={value} disabled />
      </main>
    </div>
  );
}
