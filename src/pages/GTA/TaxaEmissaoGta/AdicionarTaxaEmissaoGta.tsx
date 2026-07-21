import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RequiredFieldsNotice, TaxaEmissaoGtaForm, taxaValida } from "./TaxaEmissaoGtaForm";
import { adicionarTaxaEmissaoGta, criarTaxaVazia, type TaxaEmissaoGta } from "./taxaEmissaoGtaData";
export function AdicionarTaxaEmissaoGtaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [taxa, setTaxa] = useState(criarTaxaVazia);
  const [savedTaxa, setSavedTaxa] = useState<TaxaEmissaoGta | null>(null);
  const [error, setError] = useState("");
  const salvar = () => {
    const resultado = adicionarTaxaEmissaoGta(taxa);
    if (resultado.erro) { setError(resultado.erro); return; }
    setError("");
    setSavedTaxa(resultado.taxa ?? null);
  };
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div><button type="button" onClick={() => onNavigate("taxa-emissao-gta")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Todas as Taxas de Emissão de GTA</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Adicionar Taxa de Emissão de GTA</h1><button type="button" onClick={salvar} disabled={!taxaValida(taxa)} className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F] disabled:opacity-50 disabled:cursor-not-allowed">Adicionar</button></div></div>
        <RequiredFieldsNotice />
        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        <TaxaEmissaoGtaForm value={taxa} onChange={(next) => { setTaxa(next); setError(""); }} />
      </main>
      {savedTaxa && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h2 className="text-lg font-bold text-gray-900">Taxa de Emissão de GTA cadastrada com sucesso!</h2><p className="text-sm text-gray-500 mt-1">A taxa para {savedTaxa.especie.nome} foi cadastrada.</p><div className="flex gap-3 justify-center mt-6"><button type="button" onClick={() => onNavigate("taxa-emissao-gta")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-taxa-emissao-gta", savedTaxa)} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button></div></div></div>}
    </div>
  );
}
