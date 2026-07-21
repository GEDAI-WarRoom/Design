import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  DocumentoLotePagamento,
  formatarMoedaLote,
  LotePagamento,
} from "./lotePagamentoData";

interface DocumentoData {
  documento: DocumentoLotePagamento;
  lote: LotePagamento;
}

export function VisualizarDocumentoLotePagamentoPage({ onLogout, onNavigate, dados }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: DocumentoData }) {
  if (!dados) return null;
  const { documento, lote } = dados;
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lote-pagamento" hideSearch />
      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("visualizar-lote-pagamento", lote)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} />Voltar ao Lote de Pagamento</button>
        <div className="flex items-center gap-3"><FileText size={28} className="text-[#1A7A3C]" /><div><h1 className="text-2xl font-semibold text-gray-900">Visualizar {documento.tipo}</h1><p className="mt-1 text-sm text-gray-500">Documento relacionado ao lote nº {lote.numeroLote}</p></div></div>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatInput label="Id" value={documento.id} disabled />
            <FloatInput label="Tipo de Documento" value={documento.tipo} disabled />
            {documento.tipo === "GTA" && <FloatInput label="Série" value={documento.serie ?? ""} disabled />}
            <FloatInput label={`Número da ${documento.tipo}`} value={documento.numero} disabled />
            <FloatInput label={documento.tipo === "GTA" ? "Produtor" : "Contribuinte Origem"} value={documento.titularNome} disabled />
            <FloatInput label="Status" value={documento.status} disabled />
            <FloatInput label="Valor" value={formatarMoedaLote(documento.valor)} disabled />
          </div>
        </section>
      </main>
    </div>
  );
}
