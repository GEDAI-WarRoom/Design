import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { TaxaEmissaoGtaForm } from "./TaxaEmissaoGtaForm";
import {
  TAXAS_EMISSAO_GTA_MOCK,
  type TaxaEmissaoGta,
  type TaxaEmissaoGtaDraft,
} from "./taxaEmissaoGtaData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: Partial<TaxaEmissaoGta> | null;
}

const normalizarTaxa = (dados?: Partial<TaxaEmissaoGta> | null): TaxaEmissaoGta => {
  const exemplo = TAXAS_EMISSAO_GTA_MOCK[0];
  return {
    ...exemplo,
    ...(dados || {}),
    especie: { ...exemplo.especie, ...(dados?.especie || {}) },
  };
};

export function VisualizarTaxaEmissaoGtaPage({ onLogout, onNavigate, dados }: PageProps) {
  const taxa = normalizarTaxa(dados);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("taxa-emissao-gta")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} />Todas as Taxas de Emissão de GTA
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Taxa de Emissão de GTA</h1>
            <button type="button" onClick={() => onNavigate("editar-taxa-emissao-gta", taxa)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">
              Editar
            </button>
          </div>
        </div>

        <TaxaEmissaoGtaForm value={taxa as TaxaEmissaoGtaDraft} mode="view" />
      </main>
    </div>
  );
}
