import { ArrowLeft, FileText, ReceiptText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  MESES,
  formatarData,
  formatarMoeda,
  valorTotalRecolhimento,
  type BoletoRecolhimento,
  type RecolhimentoMensalGTA,
} from "./recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarBoletoRecolhimentoGTAPage({ onLogout, onNavigate, dados }: Props) {
  const registro = dados?.registro as RecolhimentoMensalGTA | undefined;
  const boleto = dados?.boleto as BoletoRecolhimento | undefined;
  if (!registro || !boleto) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registro)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> Voltar ao Recolhimento Mensal de GTAs
        </button>
        <div className="flex items-center gap-3">
          <ReceiptText size={28} className="text-[#1A7A3C]" />
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar Boleto</h1>
        </div>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FloatInput label="Contribuinte" value={registro.contribuinte.nome} disabled />
            <FloatInput label="CPF/CNPJ" value={registro.contribuinte.documento} disabled />
            <FloatInput label="Fundo de arrecadação" value={boleto.fundoArrecadacao} disabled />
            <FloatInput label="Convênio" value={boleto.convenio} disabled />
            <FloatInput label="Número do boleto" value={boleto.numero} disabled />
            <FloatInput label="Valor do boleto" value={formatarMoeda(boleto.valor)} disabled />
            <FloatInput label="Situação do pagamento" value={boleto.situacaoPagamento} disabled />
            <FloatInput label="Data do vencimento" value={formatarData(registro.dataVencimento)} disabled />
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">GTAs pertencentes ao boleto</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Número", "Data da emissão", "Finalidade", "Situação", "Espécie", "Total de animais", "Valor de contribuição ao fundo"].map((titulo) => (
                    <th key={titulo} className="whitespace-nowrap px-3 py-3 text-left font-semibold uppercase text-gray-600">{titulo}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {boleto.gtas.map((gta) => (
                  <tr key={gta.numero} className="border-b border-gray-50">
                    <td className="whitespace-nowrap px-3 py-3 text-gray-500">{gta.numero}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarData(gta.dataEmissao)}</td>
                    <td className="px-3 py-3 text-gray-500">{gta.finalidade}</td>
                    <td className="px-3 py-3 text-gray-500">{gta.situacao}</td>
                    <td className="px-3 py-3 text-gray-500">{gta.especie}</td>
                    <td className="px-3 py-3 text-gray-500">{gta.totalAnimais}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarMoeda(gta.valorContribuicao)}</td>
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

export function VisualizarDAERecolhimentoGTAPage({ onLogout, onNavigate, dados }: Props) {
  const registro = dados?.registro as RecolhimentoMensalGTA | undefined;
  if (!registro || !registro.daeEmitido) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto flex max-w-[1000px] flex-col gap-5 px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registro)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> Voltar ao Recolhimento Mensal de GTAs
        </button>
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-[#1A7A3C]" />
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar DAE</h1>
        </div>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FloatInput label="Número do DAE" value={registro.numeroDAE ?? "-"} disabled />
            <FloatInput label="Situação" value={registro.situacao} disabled />
            <FloatInput label="Contribuinte" value={registro.contribuinte.nome} disabled />
            <FloatInput label="CPF/CNPJ" value={registro.contribuinte.documento} disabled />
            <FloatInput label="Mês e ano para referência" value={`${MESES[registro.mesReferencia - 1].toUpperCase()} - ${registro.anoReferencia}`} disabled />
            <FloatInput label="Data da emissão" value={formatarData(registro.dataEmissaoDAE)} disabled />
            <FloatInput label="Data do vencimento" value={formatarData(registro.dataVencimento)} disabled />
            <FloatInput label="Valor total" value={formatarMoeda(valorTotalRecolhimento(registro))} disabled />
          </div>
        </section>
      </main>
    </div>
  );
}
