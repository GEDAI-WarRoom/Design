import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { CLASSIFICACOES_RECEITA, Receita, SITUACOES_RECEITA } from "./receitaData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

interface ReceitaFormProps {
  value: Pick<Receita, "codigo" | "descricao" | "classificacao" | "situacao">;
  onChange?: (value: Pick<Receita, "codigo" | "descricao" | "classificacao" | "situacao">) => void;
  disabled?: boolean;
  showSituacao?: boolean;
}

export function ReceitaForm({ value, onChange, disabled = false, showSituacao = false }: ReceitaFormProps) {
  const update = (field: keyof typeof value, fieldValue: string) => onChange?.({ ...value, [field]: fieldValue } as Pick<Receita, "codigo" | "descricao" | "classificacao" | "situacao">);

  return (
    <Section title="Informações Básicas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FloatInput
          label="Código"
          required
          value={value.codigo}
          onChange={(next) => update("codigo", next.replace(/\D/g, ""))}
          maxLength={20}
          disabled={disabled}
        />
        <FloatInput label="Descrição" required value={value.descricao} onChange={(next) => update("descricao", next)} maxLength={255} disabled={disabled} />
        <FloatSelect
          label="Classificação de Receita"
          required
          value={value.classificacao}
          onChange={(next) => update("classificacao", next)}
          options={CLASSIFICACOES_RECEITA}
          disabled={disabled}
          className="md:col-span-2"
        />
        {showSituacao && (
          <FloatSelect label="Situação" required value={value.situacao} onChange={(next) => update("situacao", next)} options={SITUACOES_RECEITA} disabled={disabled} />
        )}
      </div>
    </Section>
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
