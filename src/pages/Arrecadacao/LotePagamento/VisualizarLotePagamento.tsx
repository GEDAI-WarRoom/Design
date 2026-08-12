import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, ReceiptText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  formatarDataLote,
  formatarMoedaLote,
  LotePagamento,
  normalizarLotePagamento,
} from "./lotePagamentoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: LotePagamento;
}

export function VisualizarLotePagamentoPage({ onLogout, onNavigate, dados }: PageProps) {
  const lote = normalizarLotePagamento(dados);
  const [tabelaExpandida, setTabelaExpandida] = useState(true);

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
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("editar-lote-pagamento", lote)}
              className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onNavigate("visualizar-dae-lote-pagamento", { dae: lote.dae, lote })}
              className="flex h-11 items-center gap-2 rounded-md border border-[#1A7A3C] bg-white px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40"
            >
              <ReceiptText size={18} />DAE Relacionado
            </button>
          </div>
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
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Itens Lote {lote.documento}</h2>
          </div>
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
              <table className="w-full table-fixed border-collapse text-xs">
                <colgroup><col className="w-[19%]" /><col className="w-[11%]" /><col className="w-[10%]" /><col className="w-[10%]" /><col className="w-[14%]" /><col className="w-[13%]" /><col className="w-[13%]" /><col className="w-[6%]" /></colgroup>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-600">
                    {["Número", "Finalidade", "Espécie", "Total de animais", "Valor", "Data da emissão", "Situação"].map((titulo) => <th key={titulo} className="px-2.5 py-3 text-left font-semibold leading-4">{titulo}</th>)}
                    <th className="px-2 py-3 text-right font-normal">
                      <button
                        type="button"
                        onClick={() => setTabelaExpandida((expandida) => !expandida)}
                        aria-label={tabelaExpandida ? "Recolher tabela" : "Expandir tabela"}
                        title={tabelaExpandida ? "Recolher" : "Expandir"}
                        className="inline-flex rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                      >
                        {tabelaExpandida ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </th>
                  </tr>
                </thead>
                {tabelaExpandida && (
                  <tbody>
                    {lote.documentos.map((documento) => (
                      <tr key={documento.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-700">{documento.id}</td>
                        <td className="break-words px-2.5 py-3 text-gray-700">{documento.finalidade}</td>
                        <td className="break-words px-2.5 py-3 text-gray-700">{documento.especie}</td>
                        <td className="px-2.5 py-3 text-gray-700">{documento.totalAnimais}</td>
                        <td className="px-2.5 py-3 text-gray-700">{formatarMoedaLote(documento.valor)}</td>
                        <td className="px-2.5 py-3 text-gray-700">{formatarDataLote(documento.dataEmissao)}</td>
                        <td className="break-words px-2.5 py-3 text-gray-700">{documento.status}</td>
                        <td className="px-1 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-documento-lote-pagamento", { documento, lote })}
                            title="Visualizar"
                            aria-label={`Visualizar ${documento.id}`}
                            className="inline-flex rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
                <tfoot>
                  <tr className="border-t border-gray-100 bg-gray-50/80 font-bold text-gray-800">
                    <td colSpan={4} className="px-4 py-3 text-left">Documentos selecionados ({lote.documentos.length})</td>
                    <td colSpan={3} className="px-4 py-3 text-right text-[#1A7A3C]">{formatarMoedaLote(lote.valor)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
