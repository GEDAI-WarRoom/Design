import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Dna, Info, PlusCircle, X } from "lucide-react";
import { FloatInput, FloatSelect, MultiSearchModal, SimNao } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  DOENCAS_TIPO_VACINA,
  SITUACOES_TIPO_VACINA,
  especiesSuscetiveis,
  type DoencaTipoVacina,
  type EspecieTipoVacina,
  type RespostaSimNao,
  type SituacaoTipoVacina,
} from "./tipoVacinaData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export interface TipoVacinaFormValue {
  nome: string;
  exigeReceituario: RespostaSimNao | "";
  doencas: DoencaTipoVacina[];
  especies: EspecieTipoVacina[];
  situacao: SituacaoTipoVacina;
}

interface TipoVacinaFormProps {
  value: TipoVacinaFormValue;
  onChange: (value: TipoVacinaFormValue) => void;
  disabled?: boolean;
  showSituacao?: boolean;
}

function SelectionBox<T extends { id: number; nome: string }>({
  title,
  emptyText,
  items,
  actionLabel,
  onOpen,
  onRemove,
  disabled,
}: {
  title: string;
  emptyText: string;
  items: T[];
  actionLabel: string;
  onOpen: () => void;
  onRemove: (item: T) => void;
  disabled: boolean;
}) {
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">{title} <span className="text-red-500 font-bold">*</span></span>
          {items.length > 0 && <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">{items.length} {items.length === 1 ? "Selecionada" : "Selecionadas"}</span>}
        </div>
        {!disabled && (
          <button type="button" onClick={onOpen} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition">
            <PlusCircle size={14} /> {actionLabel}
          </button>
        )}
      </div>
      <div className="p-5 flex flex-wrap gap-4">
        {items.length === 0 ? <p className="text-xs text-gray-400 italic">{emptyText}</p> : items.map((item) => (
          <div key={item.id} className="flex min-w-[200px] items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            <span className="text-sm font-bold text-[#1A7A3C]">{item.nome}</span>
            {!disabled && <button type="button" onClick={() => onRemove(item)} className="text-gray-400 hover:text-red-500 transition" title="Remover"><X size={16} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TipoVacinaForm({ value, onChange, disabled = false, showSituacao = false }: TipoVacinaFormProps) {
  const [modalDoencasAberto, setModalDoencasAberto] = useState(false);
  const [modalEspeciesAberto, setModalEspeciesAberto] = useState(false);
  const especiesDisponiveis = useMemo(() => especiesSuscetiveis(value.doencas), [value.doencas]);

  useEffect(() => {
    const idsDisponiveis = new Set(especiesDisponiveis.map((especie) => especie.id));
    const especiesValidas = value.especies.filter((especie) => idsDisponiveis.has(especie.id));
    if (especiesValidas.length !== value.especies.length) onChange({ ...value, especies: especiesValidas });
  }, [especiesDisponiveis, onChange, value]);

  return (
    <>
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput label="Nome do Tipo de Vacina" required value={value.nome} onChange={(nome) => onChange({ ...value, nome })} maxLength={255} disabled={disabled} />
          <SimNao label="Exige receituário para venda da vacina?" name="exige-receituario-tipo-vacina" required value={value.exigeReceituario} onChange={(resposta) => onChange({ ...value, exigeReceituario: resposta ? "Sim" : "Não" })} disabled={disabled} />
          {showSituacao && <FloatSelect label="Situação" required value={value.situacao} onChange={(situacao) => onChange({ ...value, situacao: situacao as SituacaoTipoVacina })} options={SITUACOES_TIPO_VACINA} disabled={disabled} className="md:col-span-2" />}
        </div>
      </Section>

      <Section title="Doenças Aplicáveis">
        <SelectionBox title="Doenças" emptyText="Nenhuma doença selecionada para este tipo de vacina." items={value.doencas} actionLabel="Adicionar Doença" onOpen={() => setModalDoencasAberto(true)} onRemove={(doenca) => onChange({ ...value, doencas: value.doencas.filter((item) => item.id !== doenca.id) })} disabled={disabled} />
      </Section>

      <Section title="Espécies Aplicáveis">
        <SelectionBox title="Espécies" emptyText={value.doencas.length ? "Nenhuma espécie selecionada para este tipo de vacina." : "Selecione ao menos uma doença para carregar suas espécies suscetíveis."} items={value.especies} actionLabel="Adicionar Espécie" onOpen={() => setModalEspeciesAberto(true)} onRemove={(especie) => onChange({ ...value, especies: value.especies.filter((item) => item.id !== especie.id) })} disabled={disabled || value.doencas.length === 0} />
      </Section>

      <MultiSearchModal open={modalDoencasAberto} onClose={() => setModalDoencasAberto(false)} title="Buscar Doenças" subtitle="Busque por uma ou mais doenças cadastradas no sistema:" icon={<img src={Icons.iconeDoencaUrl} alt="" className="w-5 h-5 object-contain" />} data={DOENCAS_TIPO_VACINA} columns={[{ label: "Nome da Doença", key: "nome" }]} searchKeys={["nome"]} searchPlaceholder="Busque pelo nome da doença." selectedItems={value.doencas} confirmLabel="Salvar Selecionadas" onConfirm={(doencas) => { onChange({ ...value, doencas }); setModalDoencasAberto(false); }} />
      <MultiSearchModal open={modalEspeciesAberto} onClose={() => setModalEspeciesAberto(false)} title="Buscar Espécies" subtitle="Selecione espécies suscetíveis às doenças escolhidas:" icon={<Dna size={18} color="#1A7A3C" />} data={especiesDisponiveis} columns={[{ label: "Nome da Espécie", key: "nome" }]} searchKeys={["nome"]} searchPlaceholder="Busque pelo nome da espécie." selectedItems={value.especies} confirmLabel="Salvar Selecionadas" onConfirm={(especies) => { onChange({ ...value, especies }); setModalEspeciesAberto(false); }} />
    </>
  );
}
