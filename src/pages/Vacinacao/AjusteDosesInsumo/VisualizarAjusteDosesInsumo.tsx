import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import {
  AjusteDosesInsumoForm,
  type AjusteDosesInsumoFormValue,
} from "./AjusteDosesInsumoForm";
import {
  obterAjusteDosesInsumo,
  type AjusteDosesInsumo,
} from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: AjusteDosesInsumo | null;
}

const toFormValue = (registro: AjusteDosesInsumo): AjusteDosesInsumoFormValue => ({
  revendedora: registro.revendedora,
  notasFiscais: registro.notasFiscais,
  situacao: registro.situacao,
});

export function VisualizarAjusteDosesInsumoPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterAjusteDosesInsumo();
  if (!registro) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="ajuste-doses-insumo" hideSearch />

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("ajuste-doses-insumo")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Ajustes de Doses de Insumo
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Ajuste de Doses de Insumo</h1>
            <CustomButton
              icon={<Pencil size={17} />}
              onClick={() => onNavigate("editar-ajuste-doses-insumo", registro)}
            >
              Editar
            </CustomButton>
          </div>
        </div>

        <AjusteDosesInsumoForm value={toFormValue(registro)} onChange={() => {}} mode="view" />
      </main>
    </div>
  );
}
