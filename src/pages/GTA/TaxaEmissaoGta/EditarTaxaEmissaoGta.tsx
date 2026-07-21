import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { TaxaEmissaoGtaForm, taxaValida } from "./TaxaEmissaoGtaForm";
import { atualizarTaxaEmissaoGta, type TaxaEmissaoGta } from "./taxaEmissaoGtaData";
export function EditarTaxaEmissaoGtaPage({ dados, onLogout, onNavigate }: { dados: TaxaEmissaoGta; onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [taxa, setTaxa] = useState<TaxaEmissaoGta>(dados);
  const [saved, setSaved] = useState(false);
  const draft = { especie: taxa.especie, tipoCobranca: taxa.tipoCobranca, itemReceita: taxa.itemReceita, dataInicioVigencia: taxa.dataInicioVigencia, porCabeca: taxa.porCabeca, itemReceitaPorCabeca: taxa.itemReceitaPorCabeca, itemReceitaPorDocumento: taxa.itemReceitaPorDocumento, quantidadeAnimais: taxa.quantidadeAnimais };
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div><button type="button" onClick={() => onNavigate("visualizar-taxa-emissao-gta", taxa)} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Visualizar Taxa de Emissão de GTA</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Editar Taxa de Emissão de GTA</h1><button type="button" onClick={() => { atualizarTaxaEmissaoGta(taxa); setSaved(true); }} disabled={!taxaValida(draft)} className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F] disabled:opacity-50">Salvar</button></div></div>
        <TaxaEmissaoGtaForm value={draft} onChange={(next) => setTaxa({ ...taxa, ...next })} mode="edit" />
      </main>
      {saved && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h2 className="text-lg font-bold text-gray-900">Taxa de Emissão de GTA atualizada com sucesso!</h2><div className="flex gap-3 justify-center mt-6"><button type="button" onClick={() => onNavigate("taxa-emissao-gta")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-taxa-emissao-gta", taxa)} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button></div></div></div>}
    </div>
  );
}
