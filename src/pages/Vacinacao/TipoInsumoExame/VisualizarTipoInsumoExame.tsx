import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import { obterTipoInsumoExame, type TipoInsumoExame } from "./tipoInsumoExameData";
import { RequiredFieldsNotice, TipoInsumoExameForm, type TipoInsumoExameFormValue } from "./TipoInsumoExameForm";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: TipoInsumoExame | null;
}

const toFormValue = (dados: TipoInsumoExame | null): TipoInsumoExameFormValue => ({
  nome: dados?.nome ?? "",
  doencas: dados?.doencas ?? [],
  situacao: dados?.situacao ?? "Ativo",
});

export function VisualizarTipoInsumoExamePage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterTipoInsumoExame(null);

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-insumo-exame" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("tipo-insumo-exame")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Tipos de Insumo de Exame
          </button>
          <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar Tipo de Insumo de Exame</h1>
         <CustomButton onClick={() => onNavigate("editar-tipo-insumo-exame", registro)}>
            Editar
          </CustomButton>
        </div>
          </div>

        <RequiredFieldsNotice />

        <TipoInsumoExameForm value={toFormValue(registro)} onChange={() => {}} disabled  />

        
      </main>
    </div>
  );
}
