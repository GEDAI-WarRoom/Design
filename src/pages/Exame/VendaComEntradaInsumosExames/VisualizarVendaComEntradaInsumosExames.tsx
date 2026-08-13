import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  normalizarVendaInsumos,
  VendaComEntradaInsumosExamesDetalhe,
} from "./VendaComEntradaInsumosExamesDetalhe";

const GREEN = "#1A7A3C";

export function VisualizarVendaComEntradaInsumosExamesPage({ dados, onLogout, onNavigate }: any) {
  const venda = normalizarVendaInsumos(dados);

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-insumos-exames" hideSearch />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("venda-entrada-insumos-exames")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todas as Vendas com Entrada de Insumo
          </button>
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda com Entrada de Insumo</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-venda-entrada-insumos-exames", venda)}
              className="px-5 h-10 bg-[#1A7A3C] text-white text-sm font-semibold rounded-md"
            >
              Editar
            </button>
          </div>
        </div>
        <VendaComEntradaInsumosExamesDetalhe dados={venda} mode="view" />
      </main>
    </div>
  );
}
