import { ArrowLeft, Printer } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { VendaPropriedadeForm, type VendaPropriedadeFormValue } from "./VendaPropriedadeForm";
import { obterVendaPropriedade, type VendaPropriedade } from "./vendaPropriedadeData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: VendaPropriedade | null;
}

function toFormValue(venda: VendaPropriedade): VendaPropriedadeFormValue {
  return {
    vendedor: venda.vendedor,
    estabelecimento: venda.estabelecimento,
    dataVenda: venda.dataVenda,
    comprador: venda.comprador,
    porteiraFechada: venda.porteiraFechada,
    tipoTransferencia: venda.tipoTransferencia,
  };
}

export function VisualizarVendaPropriedadePage({ onLogout, onNavigate, dados }: PageProps) {
  const venda = dados ?? obterVendaPropriedade();
  if (!venda) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16 print:bg-white">
      <div className="print:hidden">
        <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-propriedade" hideSearch />
      </div>

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5 print:max-w-none print:p-0">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("venda-propriedade")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition print:hidden"
          >
            <ArrowLeft size={15} /> Todas as Vendas de Propriedade
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda de Propriedade</h1>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 h-10 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] flex items-center gap-2 transition print:hidden"
            >
              <Printer size={17} /> Imprimir
            </button>
          </div>
        </div>

        <VendaPropriedadeForm value={toFormValue(venda)} onChange={() => {}} disabled />
      </main>
    </div>
  );
}
