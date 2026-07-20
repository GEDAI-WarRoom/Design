import { ArrowLeft, ExternalLink, FileText, ReceiptText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  formatarDataLote,
  formatarMoedaLote,
  LotePagamento,
} from "./lotePagamentoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: LotePagamento;
}

export function VisualizarLotePagamentoPage({ onLogout, onNavigate, dados }: PageProps) {
  if (!dados) return null;
  const lote = dados;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lote-pagamento" hideSearch />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("lote-pagamento")} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} />Todos os Lotes de Pagamento
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Lote de Pagamento</h1>
            <p className="mt-1 text-sm text-gray-500">Lote nº {lote.numeroLote}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-dae-lote-pagamento", { dae: lote.dae, lote })}
            className="flex h-11 items-center gap-2 rounded-md border border-[#1A7A3C] bg-white px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40"
          >
            <ReceiptText size={18} />DAE Relacionado
          </button>
        </div>

        <section className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4"><h2 className="text-base font-semibold text-gray-800">Informações Básicas</h2></div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <FloatInput label="Número do Lote" value={String(lote.numeroLote)} disabled />
            <FloatInput label="Documento" value={lote.documento} disabled />
            <FloatInput label="Tipo de Lote de Pagamento" value={lote.tipoLote} disabled />
            <FloatInput label="Unidade Administrativa" value={`${lote.unidadeAdministrativa.codigo} - ${lote.unidadeAdministrativa.nome}`} disabled />
            <FloatInput label="Quantidade de Documentos" value={String(lote.quantidadeDocumentos)} disabled />
            <FloatInput label="Valor do Lote de Pagamento" value={formatarMoedaLote(lote.valor)} disabled />
            {lote.statusPagamento === "Pago" && <FloatInput label="Data Pagamento (Usuário)" value={formatarDataLote(lote.dataPagamentoUsuario)} disabled />}
            {lote.statusPagamento === "Pago" && <FloatInput label="Data Pagamento (PRODEMGE)" value={formatarDataLote(lote.dataPagamentoProdemge)} disabled />}
            <FloatInput label="Situação" value={lote.situacao} disabled />
            <FloatInput label="Status do Pagamento" value={lote.statusPagamento} disabled />
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <FileText size={18} className="text-[#1A7A3C]" />
            <h2 className="text-base font-semibold text-gray-800">Documentos</h2>
          </div>
          <div className="overflow-x-auto p-6">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="border-b border-gray-100"><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Id</th><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Status</th><th aria-label="Ações" /></tr></thead>
              <tbody>
                {lote.documentos.map((documento) => (
                  <tr key={documento.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{documento.id}</td>
                    <td className="px-4 py-3 text-gray-700">{documento.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate("visualizar-documento-lote-pagamento", { documento, lote })}
                        className="inline-flex items-center gap-2 rounded-md p-2 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"
                      >
                        <ExternalLink size={16} />Ver {documento.tipo}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
