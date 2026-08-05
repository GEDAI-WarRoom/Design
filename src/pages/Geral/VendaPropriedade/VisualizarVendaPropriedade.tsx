import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { VendaPropriedadeForm, type VendaPropriedadeFormValue } from "./VendaPropriedadeForm";
import { VENDAS_PROPRIEDADE_MOCK, type VendaPropriedade } from "./vendaPropriedadeData";

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
  const venda = dados ?? VENDAS_PROPRIEDADE_MOCK[0];

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-propriedade" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("venda-propriedade")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Todas as Vendas de Propriedade
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Venda de Propriedade</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-venda-propriedade", venda)}
              className="px-5 h-10 rounded-md text-white text-xs font-bold bg-[#1A7A3C] hover:bg-[#15612F] transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        <VendaPropriedadeForm
          value={toFormValue(venda)}
          onChange={() => {}}
          disabled
          onViewPessoa={(pessoa) => onNavigate(
            pessoa.tipo === "PF" ? "visualizar-pessoa-fisica" : "visualizar-pessoa-juridica",
            pessoa,
          )}
          onViewEstabelecimento={(est) => onNavigate("visualizar-estabelecimento-agropecuario", est)}
        />
      </main>
    </div>
  );
}
