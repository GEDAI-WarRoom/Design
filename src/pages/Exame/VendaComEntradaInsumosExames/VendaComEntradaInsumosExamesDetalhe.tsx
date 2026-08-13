import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Info } from "lucide-react";
import { DynamicListWrapper, FornecedorInsumoInput, RevendedoraInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { FORNECEDORES_INSUMO_MOCK, LoteCardItem, obterNomeTipoInsumoExame, REVENDEDORAS_MG_MOCK } from "./AdicionarVendaComEntradaInsumosExames";

const GREEN = "#1A7A3C";
const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => ({ value: uf, label: uf }));

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const novaApresentacao = () => ({ uid: uid("ap"), dosesPorFrasco: "", frascos: "" });
const novoLote = () => ({ uid: uid("lote"), numeroPartida: "", laboratorio: { nome: "" }, doenca: { nome: "" }, tipoInsumoExame: "", validade: "", apresentacoes: [novaApresentacao()] });
const formatarMesAno = (valor: string) => {
  const resultado = /^(\d{4})-(\d{2})$/.exec(valor || "");
  return resultado ? `${resultado[2]}/${resultado[1]}` : valor;
};

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
  const fornecedorInformado = typeof origem.fornecedor === "object"
    ? origem.fornecedor
    : { nome: origem.fornecedor };
  const fornecedorCadastrado = FORNECEDORES_INSUMO_MOCK.find((item) =>
    item.codigo === fornecedorInformado?.codigo || item.nome === fornecedorInformado?.nome,
  );
  const fornecedor = { ...exemplo.fornecedor, ...fornecedorCadastrado, ...fornecedorInformado };
  const revendedoraInformada = origem.revendedora || (origem.revendedoraNome
    ? { codigo: origem.revendedoraCodigo, nome: origem.revendedoraNome }
    : null);
  const revendedoraCadastrada = REVENDEDORAS_MG_MOCK.find((item) =>
    item.codigo === revendedoraInformada?.codigo || item.nome === revendedoraInformada?.nome,
  );
  const revendedora = { ...exemplo.revendedora, ...revendedoraCadastrada, ...revendedoraInformada };
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
    lotes,
  };
}

interface Props { dados?: any; mode: "view" | "edit"; onSalvar?: (dados: any) => void; }

export function VendaComEntradaInsumosExamesDetalhe({ dados, mode, onSalvar }: Props) {
  const [form, setForm] = useState(() => normalizarVendaInsumos(dados));
  // A visualização deste protótipo reaproveita os campos em modo somente leitura.
  const disabled = mode === "view";
  useEffect(() => {
    if (mode === "edit") onSalvar?.(form);
  }, [form, mode, onSalvar]);
  const alterarLote = (index: number, patch: any) => setForm((atual: any) => ({ ...atual, lotes: atual.lotes.map((lote: any, i: number) => i === index ? { ...lote, ...patch } : lote) }));
  const alterarApresentacao = (loteIndex: number, apIndex: number, patch: any) => setForm((atual: any) => ({ ...atual, lotes: atual.lotes.map((lote: any, i: number) => i === loteIndex ? { ...lote, apresentacoes: lote.apresentacoes.map((ap: any, j: number) => j === apIndex ? { ...ap, ...patch } : ap) } : lote) }));
  const totais = useMemo(() => Object.values(form.lotes.reduce((acc: Record<string, { doenca: string; tipoInsumo: string; total: number }>, lote: any) => { const doenca = lote.doenca?.nome || "Doença não informada"; const tipoInsumo = obterNomeTipoInsumoExame(lote.tipoInsumoExame || ""); const chave = `${doenca}::${tipoInsumo}`; const total = lote.apresentacoes.reduce((soma: number, ap: any) => soma + (Number(ap.dosesPorFrasco) || 0) * (Number(ap.frascos) || 0), 0); acc[chave] = { doenca, tipoInsumo, total: (acc[chave]?.total || 0) + total }; return acc; }, {})), [form.lotes]);

  return <>
    {mode === "edit" && <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3"><Info size={20} className="text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p></div>}

    <Section title="Emitente">
      <FornecedorInsumoInput
        value={form.fornecedor?.codigo || ""}
        produtoLabel="Insumo"
        required
        disabled={disabled}
        data={FORNECEDORES_INSUMO_MOCK}
        tooltipText="Não encontrou o fornecedor de insumos? Entre em contato com o Escritório Seccional do IMA de sua região."
        onChange={(fornecedor) => setForm({ ...form, fornecedor })}
        onEyeClick={() => alert(`Visualizar detalhes: ${form.fornecedor?.codigo}`)}
      />
    </Section>

    <Section title="Destinatário"><div className="flex flex-col gap-4">
      <RevendedoraInput
        value={form.revendedora?.codigo || ""}
        required
        disabled={disabled}
        data={REVENDEDORAS_MG_MOCK}
        onChange={(revendedora) => setForm({ ...form, revendedora })}
        onEyeClick={() => alert(`Visualizar detalhes: ${form.revendedora?.codigo}`)}
      />
    </div></Section>

    <Section title="Nota Fiscal"><div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FloatInput label="Número da Nota Fiscal" required value={form.numeroNotaFiscal} disabled={disabled} onChange={(numeroNotaFiscal) => setForm({ ...form, numeroNotaFiscal: numeroNotaFiscal.replace(/\D/g, "").slice(0, 10) })} /><FloatSelect label="UF da Nota Fiscal" required value={form.ufNotaFiscal} disabled={disabled} onChange={(ufNotaFiscal) => setForm({ ...form, ufNotaFiscal })} options={UFS} /><FloatInput label="Data da Nota Fiscal" required type="date" icon={<Calendar size={18} />} hideNativeDateIcon value={form.dataVenda} disabled={disabled} onChange={(dataVenda) => setForm({ ...form, dataVenda })} /></div>

      <DynamicListWrapper
        items={form.lotes}
        behavior="at-least-one"
        addButtonLabel="Adicionar Lote"
        itemLabel="Lote de Insumos para Exame"
        showCounter={false}
        disabled={disabled}
        onAddItem={() => setForm({ ...form, lotes: [...form.lotes, novoLote()] })}
        onRemoveItem={(loteIndex) => setForm({ ...form, lotes: form.lotes.filter((_: any, index: number) => index !== loteIndex) })}
      >
        {(lote: any, loteIndex: number) => (
          <LoteCardItem
            lote={lote}
            index={loteIndex}
            fornecedor={form.fornecedor}
            fornecedorEhLaboratorio={form.fornecedor?.tipo === "Laboratório"}
            disabled={disabled}
            updateLote={(_, patch) => alterarLote(loteIndex, patch)}
            addApresentacao={() => alterarLote(loteIndex, { apresentacoes: [...lote.apresentacoes, novaApresentacao()] })}
            removeApresentacao={(_, apIndex) => alterarLote(loteIndex, { apresentacoes: lote.apresentacoes.filter((_: any, index: number) => index !== apIndex) })}
            updateApresentacao={(_, apUid, patch) => {
              const apIndex = lote.apresentacoes.findIndex((item: any) => item.uid === apUid);
              alterarApresentacao(loteIndex, apIndex, patch);
            }}
          />
        )}
      </DynamicListWrapper>
      <div className="border-t border-gray-100 pt-5 flex flex-col gap-3"><span className="text-sm font-semibold text-gray-700">Total da Nota</span>{totais.map(({ doenca, tipoInsumo, total }) => <div key={`${doenca}-${tipoInsumo}`} className={`grid grid-cols-1 gap-4 ${tipoInsumo ? "md:grid-cols-3" : "md:grid-cols-2"}`}><FloatInput label="Doença" value={doenca} disabled onChange={() => {}} />{tipoInsumo && <FloatInput label="Tipo de Insumo" value={tipoInsumo} disabled onChange={() => {}} />}<FloatInput label="Total de Doses Adquiridas" value={String(total)} disabled onChange={() => {}} /></div>)}</div>
    </div></Section>

  </>;
}
