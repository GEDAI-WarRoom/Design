import { CalendarDays, FlaskConical, PackageSearch, UserRound, X } from "lucide-react";
import { useRef, useState } from "react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect, MultiSearchModal, UploadField } from "../../../components/ui/FormKit";
import {
  dadosDestinatario,
  LOTES_DISPONIVEIS,
  REVENDEDORAS_INSUMO,
  type EntidadeVendaSaidaInsumo,
  type LoteVendaSaidaInsumo,
  type TipoDestinatarioVendaSaidaInsumo,
  type VendaSaidaInsumo,
} from "./vendaComSaidaInsumoData";

const TIPOS_DESTINATARIO: TipoDestinatarioVendaSaidaInsumo[] = [
  "Médico Veterinário Habilitado PNCEBT",
  "Instituição de Ensino e Pesquisa",
  "Laboratório",
  "Responsável Técnico GRSC",
  "Revendedora de Produtos Agropecuários",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="mb-5 text-base font-semibold text-gray-800">{title}</h2>{children}</section>;
}

function EntityField({ label, value, data, disabled, onChange }: { label: string; value: EntidadeVendaSaidaInsumo; data: EntidadeVendaSaidaInsumo[]; disabled: boolean; onChange: (entidade: EntidadeVendaSaidaInsumo) => void }) {
  if (disabled) return <FloatInput label={label} required value={value.nome} disabled onChange={() => {}} />;
  return <EntitySearchInput label={label} required placeholder="Buscar por nome ou código" value={value.nome} data={data} searchKeys={["nome", "codigo", "documento"]} columns={[{ label: "Código", key: "codigo" }, { label: "Nome", key: "nome" }]} icon={<UserRound size={18} />} onChange={onChange} />;
}

function LoteCard({ lote }: { lote: LoteVendaSaidaInsumo }) {
  return <article className="rounded-lg border border-gray-200 bg-gray-50/50 p-5">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <FloatInput label="Número de Partida" value={lote.numeroPartida} disabled onChange={() => {}} />
      <FloatInput label="Laboratório" value={lote.laboratorio} disabled onChange={() => {}} />
      <FloatInput label="Doença" value={lote.doenca} disabled onChange={() => {}} />
      <FloatInput label="Tipo de Insumo" value={lote.tipoInsumo} disabled onChange={() => {}} />
    </div>
    <div className="mt-5 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-700">Adquiridas</h3>
      <p className="mt-1 text-xs text-gray-500">Disponíveis, Vendidas, Vencidas e Descartadas</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <FloatInput label="Apresentação" value={lote.apresentacao} disabled onChange={() => {}} />
        <FloatInput label="Disponíveis" value={String(lote.disponiveis)} disabled onChange={() => {}} />
        <FloatInput label="Vendidas" value={String(lote.vendidas)} disabled onChange={() => {}} />
        <FloatInput label="Vencidas" value={String(lote.vencidas)} disabled onChange={() => {}} />
        <FloatInput label="Descartadas" value={String(lote.descartadas)} disabled onChange={() => {}} />
      </div>
    </div>
  </article>;
}

export function VendaComSaidaInsumoForm({ value, onChange, mode }: { value: VendaSaidaInsumo; onChange: (value: VendaSaidaInsumo) => void; mode: "create" | "view" | "edit" }) {
  const [lotesAbertos, setLotesAbertos] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camposFixos = mode !== "create";
  const destinatarios = dadosDestinatario(value.tipoDestinatario);
  const atualizar = (patch: Partial<VendaSaidaInsumo>) => onChange({ ...value, ...patch });
  const maxDate = new Date().toISOString().slice(0, 10);

  return <div data-current-situacao={value.situacao} className="flex flex-col gap-4">
    {mode !== "view" && <div className="rounded-lg border border-gray-100 bg-white p-5 text-sm text-gray-600 shadow-sm">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.</div>}

    <Section title="Emitente">
      <EntityField label="Revendedora de Produtos Agropecuários" value={value.emitente} data={REVENDEDORAS_INSUMO} disabled={camposFixos} onChange={(emitente) => atualizar({ emitente, lotes: [] })} />
    </Section>

    <Section title="Destinatário">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FloatSelect label="Tipo de Destinatário" required value={value.tipoDestinatario} disabled={camposFixos} onChange={(tipoDestinatario) => atualizar({ tipoDestinatario: tipoDestinatario as TipoDestinatarioVendaSaidaInsumo, destinatario: { id: "", codigo: "", nome: "" } })} options={TIPOS_DESTINATARIO.map((tipo) => ({ value: tipo, label: tipo }))} />
        <EntityField label="Destinatário" value={value.destinatario} data={destinatarios} disabled={camposFixos} onChange={(destinatario) => atualizar({ destinatario })} />
      </div>
      {value.destinatario.nome && <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Código" value={value.destinatario.codigo} disabled onChange={() => {}} /><FloatInput label="CPF/CNPJ" value={value.destinatario.documento ?? "Não informado"} disabled onChange={() => {}} /></div>}
    </Section>

    <Section title="Nota Fiscal">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FloatInput label="Número da Nota Fiscal" required value={value.numeroNotaFiscal} disabled={camposFixos} maxLength={10} onChange={(numeroNotaFiscal) => atualizar({ numeroNotaFiscal: numeroNotaFiscal.replace(/\D/g, "").slice(0, 10) })} />
        <FloatInput label="UF da Nota Fiscal" required value={value.ufNotaFiscal} disabled onChange={() => {}} />
        <FloatInput label="Data da Nota Fiscal" required type="date" icon={<CalendarDays size={18} />} hideNativeDateIcon value={value.dataNotaFiscal} disabled={camposFixos} max={maxDate} onChange={(dataNotaFiscal) => atualizar({ dataNotaFiscal })} />
      </div>
    </Section>

    <Section title="Saldo de Insumos de Exame">
      {!camposFixos && <button type="button" onClick={() => setLotesAbertos(true)} className="flex h-12 w-full items-center gap-3 rounded-md border border-gray-300 bg-white px-3 text-left text-sm text-gray-500 hover:border-[#1A7A3C]"><PackageSearch size={18} className="text-[#1A7A3C]" /><span className="flex-1">Lote <span className="text-red-500">*</span></span><span className="text-xs">{value.lotes.length ? `${value.lotes.length} selecionado(s)` : "Buscar diretamente por partida, laboratório, doença ou insumo"}</span></button>}
      {value.lotes.length > 0 && <div className="mt-5 flex flex-col gap-4">{value.lotes.map((lote) => <div key={lote.id} className="relative">{!camposFixos && <button type="button" onClick={() => atualizar({ lotes: value.lotes.filter((item) => item.id !== lote.id) })} className="absolute right-3 top-3 z-10 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remover lote ${lote.numeroPartida}`}><X size={17} /></button>}<LoteCard lote={lote} /></div>)}</div>}
      {value.lotes.length === 0 && camposFixos && <p className="text-sm text-gray-500">Nenhum lote associado.</p>}
    </Section>

    <Section title="Requerimento">
      <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(event) => atualizar({ requerimento: event.target.files?.[0]?.name ?? "" })} />
      <UploadField label="Requerimento" required fileName={value.requerimento} disabled={camposFixos} subtitle="Formatos permitidos: PDF, PNG ou JPG de até 50 MB." onSelectFile={() => fileRef.current?.click()} />
    </Section>

    <MultiSearchModal open={lotesAbertos} onClose={() => setLotesAbertos(false)} title="Buscar Saldo de Insumos de Exame" subtitle="Pesquise diretamente, sem precisar selecionar uma doença antes." icon={<FlaskConical size={22} className="text-[#1A7A3C]" />} data={LOTES_DISPONIVEIS} columns={[{ label: "Partida", key: "numeroPartida" }, { label: "Laboratório", key: "laboratorio" }, { label: "Doença", key: "doenca" }, { label: "Tipo de Insumo", key: "tipoInsumo" }]} searchKeys={["numeroPartida", "laboratorio", "doenca", "tipoInsumo"]} selectedItems={value.lotes} onConfirm={(lotes) => atualizar({ lotes })} confirmLabel="Selecionar" />
  </div>;
}
