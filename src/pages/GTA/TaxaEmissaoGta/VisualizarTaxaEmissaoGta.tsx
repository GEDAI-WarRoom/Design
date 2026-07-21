import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { TaxaEmissaoGtaForm } from "./TaxaEmissaoGtaForm";
import type { TaxaEmissaoGta } from "./taxaEmissaoGtaData";
export function VisualizarTaxaEmissaoGtaPage({ dados, onLogout, onNavigate }: { dados: TaxaEmissaoGta; onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const draft = { especie: dados.especie, tipoCobranca: dados.tipoCobranca, itemReceita: dados.itemReceita, dataInicioVigencia: dados.dataInicioVigencia, porCabeca: dados.porCabeca, itemReceitaPorCabeca: dados.itemReceitaPorCabeca, itemReceitaPorDocumento: dados.itemReceitaPorDocumento, quantidadeAnimais: dados.quantidadeAnimais };
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div><button type="button" onClick={() => onNavigate("taxa-emissao-gta")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Todas as Taxas de Emissão de GTA</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Visualizar Taxa de Emissão de GTA</h1><button type="button" onClick={() => onNavigate("editar-taxa-emissao-gta", dados)} className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2"><Pencil size={15} />Editar</button></div></div>
        <TaxaEmissaoGtaForm value={draft} mode="view" />
      </main>
    </div>
  );
}
