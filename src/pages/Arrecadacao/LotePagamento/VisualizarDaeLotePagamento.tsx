import { ArrowLeft, ReceiptText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  DaeLotePagamento,
  formatarDataLote,
  formatarMoedaLote,
  LotePagamento,
} from "./lotePagamentoData";

interface DaeData {
  dae: DaeLotePagamento;
  lote: LotePagamento;
}

export function VisualizarDaeLotePagamentoPage({ onLogout, onNavigate, dados }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: DaeData }) {
  if (!dados) return null;
  const { dae, lote } = dados;
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lote-pagamento" hideSearch />
      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("visualizar-lote-pagamento", lote)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} />Voltar ao Lote de Pagamento</button>
        <div className="flex items-center gap-3"><ReceiptText size={28} className="text-[#1A7A3C]" /><div><h1 className="text-2xl font-semibold text-gray-900">Visualizar DAE</h1><p className="mt-1 text-sm text-gray-500">DAE relacionado ao lote nº {lote.numeroLote}</p></div></div>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatInput label="Número do DAE" value={dae.numero} disabled />
            <FloatInput label="Situação do DAE" value={dae.situacao} disabled />
            <FloatInput label="Data de Vencimento" value={formatarDataLote(dae.dataVencimento)} disabled />
            <FloatInput label="Valor" value={formatarMoedaLote(dae.valor)} disabled />
            <div className="md:col-span-2"><FloatInput label="Linha Digitável" value={dae.linhaDigitavel} disabled /></div>
          </div>
        </section>
      </main>
    </div>
  );
}
