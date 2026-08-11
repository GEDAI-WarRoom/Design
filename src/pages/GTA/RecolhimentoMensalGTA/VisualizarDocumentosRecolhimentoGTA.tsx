import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, FileText, Handshake, Wallet } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
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
  const veioDaBuscaBoletos = dados?.origem === "boletos-gta";
  const [gtasExpandidas, setGtasExpandidas] = useState(true);
  if (!registro || !boleto) return null;
  const totalContribuicao = boleto.gtas.reduce((total, gta) => total + gta.valorContribuicao, 0);

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen={veioDaBuscaBoletos ? "boletos-gta" : "relatorio-boletos-gta"} hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <button type="button" onClick={() => veioDaBuscaBoletos ? onNavigate("boletos-gta") : onNavigate("visualizar-recolhimento-mensal-gta", registro)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> {veioDaBuscaBoletos ? "Todos os boletos" : "Voltar ao Relatório de Boletos"}
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar Boleto</h1>
        </div>
        <section className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Informações Básicas</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
            <FloatInput label="Número do boleto" value={boleto.numero} disabled />
            <FloatInput label="Fundo de arrecadação" value={boleto.fundoArrecadacao} icon={<Wallet size={18} className="text-[#1A7A3C]" />} disabled />
            <FloatInput label="Convênio" value={boleto.convenio} icon={<Handshake size={18} className="text-[#1A7A3C]" />} disabled />
            <FloatInput label="Linha Digitável" value={boleto.linhaDigitavel} className="md:col-span-3" disabled />
            <FloatInput label="Código de Barras" value={boleto.codigoBarras} className="md:col-span-3" disabled />
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Informações Complementares</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <FloatInput label="Mês para Referência" value={MESES[registro.mesReferencia - 1]} disabled />
            <FloatInput label="Ano para Referência" value={String(registro.anoReferencia)} disabled />
            <FloatInput label="Data do vencimento" value={formatarData(registro.dataVencimento)} disabled />
            <FloatInput label="Valor" value={formatarMoeda(boleto.valor)} disabled />
            <FloatInput label="Data de Pagamento" value={formatarData(boleto.dataPagamento)} disabled />
            <FloatInput label="Situação" value={boleto.situacaoPagamento} disabled />
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Informações do Contribuinte</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <FloatInput label="Contribuinte" value={registro.contribuinte.nome} icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />} disabled />
            <div className="flex items-end gap-2">
              <FloatInput label="Documento" value={registro.contribuinte.documento} className="min-w-0 flex-1" disabled />
              <button type="button" title="Visualizar contribuinte" aria-label="Visualizar contribuinte" onClick={() => onNavigate(registro.contribuinte.tipo === "Pessoa Física" ? "visualizar-pessoa-fisica" : "visualizar-pessoa-juridica", registro.contribuinte.tipo === "Pessoa Física" ? { ...registro.contribuinte, cpf: registro.contribuinte.documento } : { ...registro.contribuinte, cnpj: registro.contribuinte.documento, razaoSocial: registro.contribuinte.nome, nomeFantasia: registro.contribuinte.nome })} className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md text-[#1A7A3C] transition hover:bg-green-50"><Eye size={18} /></button>
            </div>
            <FloatInput label="Endereço do Contribuinte" value={registro.contribuinte.endereco} className="md:col-span-2" disabled />
            <FloatInput label="Estado do Contribuinte" value={registro.contribuinte.estado} disabled />
            <FloatInput label="Município do Contribuinte" value={registro.contribuinte.municipio} disabled />
            <FloatInput label="Telefone" value={registro.contribuinte.telefone} disabled />
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Itens</h2>
          </div>
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <table className="w-full table-fixed border-collapse text-xs">
              <colgroup><col className="w-[19%]" /><col className="w-[11%]" /><col className="w-[10%]" /><col className="w-[10%]" /><col className="w-[14%]" /><col className="w-[13%]" /><col className="w-[13%]" /><col className="w-[6%]" /></colgroup>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-600">
                  {["Número", "Finalidade", "Espécie", "Total de animais", "Data da emissão", "Situação", "Valor"].map((titulo) => (
                    <th key={titulo} className="px-2.5 py-3 text-left font-semibold leading-4">{titulo}</th>
                  ))}
                  <th className="px-2 py-3 text-right font-normal">
                    <button type="button" onClick={() => setGtasExpandidas((expandida) => !expandida)} aria-label={gtasExpandidas ? "Recolher tabela" : "Expandir tabela"} title={gtasExpandidas ? "Recolher" : "Expandir"} className="inline-flex rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                      {gtasExpandidas ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </th>
                </tr>
              </thead>
              {gtasExpandidas && <tbody>
                {boleto.gtas.map((gta) => (
                  <tr key={gta.numero} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-2.5 py-3 text-[11px] font-medium text-gray-700">{gta.serie ? `${gta.serie} - ` : ""}{gta.numero}</td>
                    <td className="break-words px-2.5 py-3 text-gray-700">{gta.finalidade}</td>
                    <td className="break-words px-2.5 py-3 text-gray-700">{gta.especie}</td>
                    <td className="px-2.5 py-3 text-gray-700">{gta.totalAnimais}</td>
                    <td className="px-2.5 py-3 text-gray-700">{formatarData(gta.dataEmissao)}</td>
                    <td className="break-words px-2.5 py-3 text-gray-700">{gta.situacao}</td>
                    <td className="px-2.5 py-3 text-gray-700">{formatarMoeda(gta.valorContribuicao)}</td>
                    <td className="px-1 py-3 text-right"><button type="button" onClick={() => onNavigate("visualizar-emissao-gta", gta)} title="Visualizar GTA" aria-label={`Visualizar GTA ${gta.numero}`} className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"><Eye size={16} /></button></td>
                  </tr>
                ))}
              </tbody>}
              <tfoot>
                <tr className="border-t border-gray-100 bg-gray-50/80 font-bold text-gray-800">
                  <td colSpan={6} className="px-4 py-3 text-left">GTAs pertencentes ({boleto.gtas.length})</td>
                  <td className="px-2.5 py-3 text-[#1A7A3C]">{formatarMoeda(totalContribuicao)}</td>
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
