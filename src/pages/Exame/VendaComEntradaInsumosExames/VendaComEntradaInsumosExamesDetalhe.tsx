import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Info, PlusCircle, Trash2 } from "lucide-react";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { obterNomeTipoInsumoExame } from "./AdicionarVendaComEntradaInsumosExames";

const GREEN = "#1A7A3C";
const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => ({ value: uf, label: uf }));

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const novaApresentacao = () => ({ uid: uid("ap"), dosesPorFrasco: "", frascos: "" });
const novoLote = () => ({ uid: uid("lote"), numeroPartida: "", laboratorio: { nome: "" }, doenca: { nome: "" }, tipoInsumoExame: "", validade: "", apresentacoes: [novaApresentacao()] });

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>
    {open && <div className="p-6 border-t border-gray-100">{children}</div>}
  </section>;
}

const exemplo = {
  fornecedor: { codigo: "LAB-0001", nome: "Laboratório BioMed", tipo: "Laboratório" },
  destinatario: "Revendedora de Produtos Agropecuários",
  revendedora: { codigo: "3120938028", nome: "Comercial AgroVat" },
  medicoVeterinario: null,
  numeroNotaFiscal: "10458",
  ufNotaFiscal: "MG",
  dataVenda: "2026-01-15",
  dataNotaFiscal: "2026-07-15",
  situacao: "Gravada",
  lotes: [{
    uid: "lote-exemplo-1",
    numeroPartida: "0001245/26",
    laboratorio: { nome: "Laboratório BioMed" },
    doenca: { nome: "Brucelose" },
    tipoInsumoExame: "Antígeno Acidificado Tamponado (AAT)",
    validade: "03/2027",
    apresentacoes: [{ uid: "ap-exemplo-1", dosesPorFrasco: "50", frascos: "12" }],
  }],
};

export function normalizarVendaInsumos(dados?: any) {
  const origem = dados || {};
  const fornecedor = typeof origem.fornecedor === "object" ? origem.fornecedor : { ...exemplo.fornecedor, nome: origem.fornecedor || exemplo.fornecedor.nome };
  const revendedora = origem.revendedora || (origem.revendedoraNome ? { codigo: origem.revendedoraCodigo, nome: origem.revendedoraNome } : exemplo.revendedora);
  const lotesOrigem = origem.lotes?.length ? origem.lotes : [{}];
  const lotes = lotesOrigem.map((lote: any, index: number) => {
    const loteExemplo = exemplo.lotes[0];
    const apresentacoesOrigem = lote.apresentacoes?.length ? lote.apresentacoes : loteExemplo.apresentacoes;
    return {
      ...loteExemplo,
      ...lote,
      uid: lote.uid || `lote-${index + 1}`,
      numeroPartida: lote.numeroPartida || origem.numeroPartida || loteExemplo.numeroPartida,
      laboratorio: lote.laboratorio?.nome ? lote.laboratorio : loteExemplo.laboratorio,
      doenca: lote.doenca?.nome ? lote.doenca : { nome: origem.doenca || loteExemplo.doenca.nome },
      tipoInsumoExame: lote.tipoInsumoExame || loteExemplo.tipoInsumoExame,
      validade: lote.validade || loteExemplo.validade,
      apresentacoes: apresentacoesOrigem.map((ap: any, apIndex: number) => ({
        ...loteExemplo.apresentacoes[0],
        ...ap,
        uid: ap.uid || `ap-${index + 1}-${apIndex + 1}`,
        dosesPorFrasco: ap.dosesPorFrasco || loteExemplo.apresentacoes[0].dosesPorFrasco,
        frascos: ap.frascos || loteExemplo.apresentacoes[0].frascos,
      })),
    };
  });
  return {
    ...exemplo,
    ...origem,
    fornecedor,
    destinatario: origem.destinatario || exemplo.destinatario,
    revendedora,
    numeroNotaFiscal: origem.numeroNotaFiscal || exemplo.numeroNotaFiscal,
    ufNotaFiscal: origem.ufNotaFiscal || exemplo.ufNotaFiscal,
    dataVenda: origem.dataVenda || exemplo.dataVenda,
    dataNotaFiscal: origem.dataNotaFiscal || exemplo.dataNotaFiscal,
    situacao: origem.situacao || exemplo.situacao,
    lotes,
  };
}

interface Props { dados?: any; mode: "view" | "edit"; onSalvar?: (dados: any) => void; }

export function VendaComEntradaInsumosExamesDetalhe({ dados, mode, onSalvar }: Props) {
  const [form, setForm] = useState(() => normalizarVendaInsumos(dados));
  // Na edição, todos os campos permanecem somente leitura; apenas a situação é editável.
  const disabled = true;
  useEffect(() => {
    if (mode === "edit") onSalvar?.(form);
  }, [form, mode, onSalvar]);
  const alterarLote = (index: number, patch: any) => setForm((atual: any) => ({ ...atual, lotes: atual.lotes.map((lote: any, i: number) => i === index ? { ...lote, ...patch } : lote) }));
  const alterarApresentacao = (loteIndex: number, apIndex: number, patch: any) => setForm((atual: any) => ({ ...atual, lotes: atual.lotes.map((lote: any, i: number) => i === loteIndex ? { ...lote, apresentacoes: lote.apresentacoes.map((ap: any, j: number) => j === apIndex ? { ...ap, ...patch } : ap) } : lote) }));
  const totais = useMemo(() => Object.values(form.lotes.reduce((acc: Record<string, { doenca: string; tipoInsumo: string; total: number }>, lote: any) => { const doenca = lote.doenca?.nome || "Doença não informada"; const tipoInsumo = obterNomeTipoInsumoExame(lote.tipoInsumoExame || ""); const chave = `${doenca}::${tipoInsumo}`; const total = lote.apresentacoes.reduce((soma: number, ap: any) => soma + (Number(ap.dosesPorFrasco) || 0) * (Number(ap.frascos) || 0), 0); acc[chave] = { doenca, tipoInsumo, total: (acc[chave]?.total || 0) + total }; return acc; }, {})), [form.lotes]);

  return <>
    {mode === "edit" && <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3"><Info size={20} className="text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p></div>}

    <Section title="Emitente"><FloatInput label="Fornecedor" required value={form.fornecedor?.nome || ""} disabled={disabled} onChange={(nome) => setForm({ ...form, fornecedor: { ...form.fornecedor, nome } })} /></Section>

    <Section title="Destinatário"><div className="flex flex-col gap-4">
      <FloatInput label="Revendedora de Produtos Agropecuários" required value={form.revendedora?.nome || ""} disabled={disabled} onChange={() => {}} />
    </div></Section>

    <Section title="Nota Fiscal"><div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FloatInput label="Número da Nota Fiscal" required value={form.numeroNotaFiscal} disabled={disabled} onChange={(numeroNotaFiscal) => setForm({ ...form, numeroNotaFiscal: numeroNotaFiscal.replace(/\D/g, "").slice(0, 10) })} /><FloatSelect label="UF da Nota Fiscal" required value={form.ufNotaFiscal} disabled={disabled} onChange={(ufNotaFiscal) => setForm({ ...form, ufNotaFiscal })} options={UFS} /><FloatInput label="Data da Venda" required type="date" icon={<Calendar size={18} />} hideNativeDateIcon value={form.dataVenda} disabled={disabled} onChange={(dataVenda) => setForm({ ...form, dataVenda })} /></div>

      {form.lotes.map((lote: any, loteIndex: number) => {
        const totalLote = lote.apresentacoes.reduce((soma: number, ap: any) => soma + (Number(ap.dosesPorFrasco) || 0) * (Number(ap.frascos) || 0), 0);
        return <article key={lote.uid || loteIndex} className="border-l-4 border-l-[#1A7A3C] rounded-r-xl rounded-l-md bg-gray-50/40 border border-gray-100 p-5 flex flex-col gap-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center shadow-sm flex-shrink-0"><span className="text-xs font-bold">{loteIndex + 1}</span></div>
              <h3 className="text-sm font-semibold text-gray-700">Lote de Insumos para Exame</h3>
            </div>
            {!disabled && form.lotes.length > 1 && <button type="button" onClick={() => setForm({ ...form, lotes: form.lotes.filter((_: any, i: number) => i !== loteIndex) })} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={18} /></button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FloatInput label="Número de Partida" required value={lote.numeroPartida} disabled={disabled} onChange={(numeroPartida) => alterarLote(loteIndex, { numeroPartida })} /><FloatInput label="Laboratório" required value={lote.laboratorio?.nome || ""} disabled={disabled} onChange={(nome) => alterarLote(loteIndex, { laboratorio: { ...lote.laboratorio, nome } })} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FloatInput label="Doença" value={lote.doenca?.nome || ""} disabled={disabled} onChange={(nome) => alterarLote(loteIndex, { doenca: { ...lote.doenca, nome } })} /><FloatInput label="Tipo de Insumo" value={lote.tipoInsumoExame || ""} disabled={disabled} onChange={(tipoInsumoExame) => alterarLote(loteIndex, { tipoInsumoExame })} /><FloatInput label="Data de validade" required value={lote.validade || ""} disabled={disabled} icon={<Calendar size={18} />} onChange={(validade) => alterarLote(loteIndex, { validade })} /></div>
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            <span className="text-sm font-semibold text-gray-700">Apresentação de Insumos</span>
            {lote.apresentacoes.map((ap: any, apIndex: number) => <div key={ap.uid || apIndex} className="flex items-center gap-3 w-full">
              <div className="w-5 h-5 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold">{apIndex + 1}</span></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"><FloatInput label="Nº de Doses por Frasco" required value={String(ap.dosesPorFrasco || "")} disabled={disabled} onChange={(valor) => alterarApresentacao(loteIndex, apIndex, { dosesPorFrasco: valor.replace(/\D/g, "") })} /><FloatInput label="Nº de Frascos Adquiridos" required value={String(ap.frasos || ap.frascos || "")} disabled={disabled} onChange={(valor) => alterarApresentacao(loteIndex, apIndex, { frascos: valor.replace(/\D/g, "") })} /><FloatInput label="Total de Doses" required value={String((Number(ap.dosesPorFrasco) || 0) * (Number(ap.frascos) || 0))} disabled onChange={() => {}} /></div>
            </div>)}
            {!disabled && <button type="button" onClick={() => alterarLote(loteIndex, { apresentacoes: [...lote.apresentacoes, novaApresentacao()] })} className="inline-flex self-start items-center gap-2 px-4 h-10 border border-[#1A7A3C] text-[#1A7A3C] rounded-md text-sm font-semibold"><PlusCircle size={16} /> Adicionar Apresentação</button>}
          </div>
          <div className="border-t border-gray-100 pt-4"><FloatInput label="Total de Doses Adquiridas" required value={String(totalLote)} disabled onChange={() => {}} /></div>
        </article>;
      })}
      {!disabled && <button type="button" onClick={() => setForm({ ...form, lotes: [...form.lotes, novoLote()] })} className="inline-flex self-start items-center gap-2 px-4 h-10 border border-[#1A7A3C] text-[#1A7A3C] rounded-md text-sm font-semibold"><PlusCircle size={16} /> Adicionar Lote</button>}
      <div className="border-t border-gray-100 pt-5 flex flex-col gap-3"><span className="text-sm font-semibold text-gray-700">Total da Nota</span>{totais.map(({ doenca, tipoInsumo, total }) => <div key={`${doenca}-${tipoInsumo}`} className={`grid grid-cols-1 gap-4 ${tipoInsumo ? "md:grid-cols-3" : "md:grid-cols-2"}`}><FloatInput label="Doença" value={doenca} disabled onChange={() => {}} />{tipoInsumo && <FloatInput label="Tipo de Insumo" value={tipoInsumo} disabled onChange={() => {}} />}<FloatInput label="Total de Doses Adquiridas" value={String(total)} disabled onChange={() => {}} /></div>)}</div>
    </div></Section>

    <Section title="Situação do cadastro">
      <div className="max-w-sm"><FloatSelect label="Situação" value={form.situacao || "Gravada"} disabled={mode === "view" ? true : false} onChange={(situacao) => setForm({ ...form, situacao })} options={[{ value: "Gravada", label: "Gravada" }, { value: "Cancelada", label: "Cancelada" }]} /></div>
    </Section>

  </>;
}
