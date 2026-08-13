import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { VendaComSaidaInsumoForm } from "./VendaComSaidaInsumoForm";
import { obterVendaSaidaInsumo } from "./vendaComSaidaInsumoData";

export function VisualizarVendaComSaidaInsumoPage({ dados, onLogout, onNavigate }: any) {
  const venda = obterVendaSaidaInsumo(dados);
  return <div className="min-h-screen bg-[#f2f3f5] pb-20"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-insumo" hideSearch /><main className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-6 md:px-6"><header><button type="button" onClick={() => onNavigate("venda-saida-insumo")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C]"><ArrowLeft size={15} /> Todas as Vendas com Saída de Insumo</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda com Saída de Insumo</h1><button type="button" onClick={() => onNavigate("editar-venda-saida-insumo", venda)} className="h-11 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white">Editar</button></div></header><VendaComSaidaInsumoForm value={venda} onChange={() => {}} mode="view" /></main></div>;
}
