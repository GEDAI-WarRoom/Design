import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Dna, Info, PlusCircle, X } from "lucide-react";
import { CustomRadio, FloatInput, MultiSearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  DOENCAS_TIPO_VACINA_MOCK,
  especiesSuscetiveis,
  type DoencaTipoVacina,
  type EspecieTipoVacina,
  type TipoVacinaDraft,
} from "./tipoVacinaData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-visible rounded-xl bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="shrink-0 text-gray-500" />
      <p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p>
    </div>
  );
}

interface SelectionListProps<T extends { id: number; nome: string }> {
  title: string;
  empty: string;
  items: T[];
  disabled: boolean;
  onAdd: () => void;
  onRemove: (id: number) => void;
  buttonLabel: string;
}

function SelectionList<T extends { id: number; nome: string }>({ title, empty, items, disabled, onAdd, onRemove, buttonLabel }: SelectionListProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">{title} <span className="font-bold text-red-500">*</span></span>
          {items.length > 0 && <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">{items.length} {items.length === 1 ? "selecionada" : "selecionadas"}</span>}
        </div>
        {!disabled && (
          <button type="button" onClick={onAdd} className="flex items-center gap-1.5 rounded-md border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] transition hover:bg-green-50">
            <PlusCircle size={14} /> {buttonLabel}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3 p-5">
        {items.length === 0 ? <p className="text-xs italic text-gray-400">{empty}</p> : items.map((item) => (
          <div key={item.id} className="flex min-w-[210px] items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <span className="text-sm font-bold text-[#1A7A3C]">{item.nome}</span>
            {!disabled && <button type="button" onClick={() => onRemove(item.id)} className="rounded-md p-0.5 text-gray-400 hover:bg-gray-50 hover:text-red-500" title="Remover"><X size={16} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  value: TipoVacinaDraft;
  onChange: (value: TipoVacinaDraft) => void;
  disabled?: boolean;
}

export function TipoVacinaForm({ value, onChange, disabled = false }: Props) {
  const [modalDoencas, setModalDoencas] = useState(false);
  const [modalEspecies, setModalEspecies] = useState(false);
  const especiesDisponiveis = especiesSuscetiveis(value.doencas);

  const alterarDoencas = (doencas: DoencaTipoVacina[]) => {
    const idsValidos = new Set(especiesSuscetiveis(doencas).map((item) => item.id));
    onChange({ ...value, doencas, especies: value.especies.filter((item) => idsValidos.has(item.id)) });
  };

  return (
    <>
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FloatInput label="Nome do Tipo de Vacina" required value={value.nome} onChange={(nome) => onChange({ ...value, nome })} maxLength={255} disabled={disabled} />
          <div className="px-1 py-1">
            <p className="mb-3 text-xs font-medium text-gray-500">Exige receituário para venda da vacina? <span className="font-bold text-red-500">*</span></p>
            <div className="flex gap-6">
              <CustomRadio label="Sim" name="exige-receituario" value="sim" checked={value.exigeReceituario} onChange={() => onChange({ ...value, exigeReceituario: true })} disabled={disabled} />
              <CustomRadio label="Não" name="exige-receituario" value="nao" checked={!value.exigeReceituario} onChange={() => onChange({ ...value, exigeReceituario: false })} disabled={disabled} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Doenças Aplicáveis">
        <SelectionList title="Doenças" empty="Nenhuma doença selecionada." items={value.doencas} disabled={disabled} onAdd={() => setModalDoencas(true)} onRemove={(id) => alterarDoencas(value.doencas.filter((item) => item.id !== id))} buttonLabel="Adicionar Doença" />
      </Section>

      <Section title="Espécies Aplicáveis">
        <SelectionList title="Espécies" empty={value.doencas.length ? "Nenhuma espécie selecionada." : "Selecione ao menos uma doença para consultar as espécies suscetíveis."} items={value.especies} disabled={disabled} onAdd={() => setModalEspecies(true)} onRemove={(id) => onChange({ ...value, especies: value.especies.filter((item) => item.id !== id) })} buttonLabel="Adicionar Espécie" />
      </Section>

      <MultiSearchModal<DoencaTipoVacina> open={modalDoencas} onClose={() => setModalDoencas(false)} title="Buscar Doenças" subtitle="Busque e selecione uma ou mais doenças cadastradas no sistema:" icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="h-5 w-5 object-contain" />} data={DOENCAS_TIPO_VACINA_MOCK} columns={[{ label: "Nome da Doença", key: "nome" }]} searchKeys={["nome"]} selectedItems={value.doencas} onConfirm={(items) => { alterarDoencas(items); setModalDoencas(false); }} confirmLabel="Salvar Selecionadas" />
      <MultiSearchModal<EspecieTipoVacina> open={modalEspecies} onClose={() => setModalEspecies(false)} title="Buscar Espécies" subtitle="São exibidas somente as espécies suscetíveis às doenças selecionadas:" icon={<Dna size={20} className="text-[#1A7A3C]" />} data={especiesDisponiveis} columns={[{ label: "Espécie", key: "nome" }, { label: "Grupo de Espécie", key: "grupo" }]} searchKeys={["nome", "grupo"]} selectedItems={value.especies} onConfirm={(especies) => { onChange({ ...value, especies }); setModalEspecies(false); }} confirmLabel="Salvar Selecionadas" />
    </>
  );
}
