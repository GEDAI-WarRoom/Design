import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { FloatCombobox, FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  CULTURAS_PREVISAO_MOCK,
  ESTADOS_PREVISAO,
  MUNICIPIOS_POR_ESTADO,
  type CulturaPrevisaoMigracao,
  type PrevisaoMigracao,
} from "./previsaoMigracaoData";

export interface CulturaFormItem {
  uid: string;
  cultura: CulturaPrevisaoMigracao | null;
}

export interface PrevisaoMigracaoFormValue {
  estado: string;
  municipio: string;
  data: string;
  culturas: CulturaFormItem[];
  situacao: PrevisaoMigracao["situacao"];
}

interface FormProps {
  value: PrevisaoMigracaoFormValue;
  onChange: (value: PrevisaoMigracaoFormValue) => void;
  disabled?: boolean;
  showSituacao?: boolean;
}

const uid = () => `cultura-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const criarCulturaVazia = (): CulturaFormItem => ({ uid: uid(), cultura: null });

export function criarFormPrevisao(previsao?: PrevisaoMigracao | null): PrevisaoMigracaoFormValue {
  return {
    estado: previsao?.estado ?? "",
    municipio: previsao?.municipio ?? "",
    data: previsao?.data ?? "",
    culturas: previsao?.culturas.length
      ? previsao.culturas.map((cultura) => ({ uid: uid(), cultura }))
      : [criarCulturaVazia()],
    situacao: previsao?.situacao ?? "Ativo",
  };
}

export function formPrevisaoValido(value: PrevisaoMigracaoFormValue) {
  return Boolean(
    value.estado &&
    value.municipio &&
    value.data &&
    value.culturas.length > 0 &&
    value.culturas.every((item) => item.cultura),
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="w-full bg-white rounded-xl shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
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

export function PrevisaoMigracaoForm({ value, onChange, disabled = false, showSituacao = false }: FormProps) {
  const municipios = value.estado ? MUNICIPIOS_POR_ESTADO[value.estado] ?? [] : [];

  const atualizarCultura = (uidItem: string, cultura: CulturaPrevisaoMigracao) => {
    onChange({
      ...value,
      culturas: value.culturas.map((item) => item.uid === uidItem ? { ...item, cultura } : item),
    });
  };

  return (
    <Section title="Previsão de Migração para Polinização">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <FloatSelect
            label="Estado"
            required
            value={value.estado}
            onChange={(estado) => onChange({ ...value, estado, municipio: "" })}
            options={ESTADOS_PREVISAO}
            disabled={disabled}
          />

          {value.estado ? (
            <FloatCombobox
              label="Município"
              required
              value={value.municipio}
              onChange={(municipio) => onChange({ ...value, municipio })}
              options={municipios}
              disabled={disabled}
            />
          ) : (
            <FloatInput label="Município" required value="" onChange={() => {}} disabled />
          )}

          <FloatInput
            label="Data"
            type="date"
            required
            value={value.data}
            onChange={(data) => onChange({ ...value, data })}
            disabled={disabled}
          />
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Culturas a serem polinizadas</h3>

          {disabled ? (
            <div className="flex flex-col gap-3">
              {value.culturas.map((item, index) => (
                <div key={item.uid} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1A7A3C] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <FloatInput
                    label="Cultura"
                    value={item.cultura?.nome ?? ""}
                    onChange={() => {}}
                    icon={<img src={Icons.iconeCulturaUrl} alt="Cultura" className="w-5 h-5 object-contain" />}
                    disabled
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <DynamicListWrapper
              items={value.culturas}
              behavior="at-least-one"
              variant="plain"
              itemLabel="Cultura"
              addButtonLabel="Adicionar Cultura"
              onAddItem={() => onChange({ ...value, culturas: [...value.culturas, criarCulturaVazia()] })}
              onRemoveItem={(index) => onChange({ ...value, culturas: value.culturas.filter((_, itemIndex) => itemIndex !== index) })}
            >
              {(item: CulturaFormItem) => {
                const culturasDisponiveis = CULTURAS_PREVISAO_MOCK.filter(
                  (cultura) => !value.culturas.some((selecionada) => selecionada.uid !== item.uid && selecionada.cultura?.id === cultura.id),
                );
                return (
                  <EntitySearchInput
                    label="Cultura"
                    placeholder="Buscar por código ou nome da cultura."
                    required
                    value={item.cultura?.nome ?? ""}
                    data={culturasDisponiveis}
                    searchKeys={["codigo", "nome"]}
                    columns={[
                      { label: "Código", key: "codigo" },
                      { label: "Cultura", key: "nome" },
                    ]}
                    icon={<img src={Icons.iconeCulturaUrl} alt="Cultura" className="w-5 h-5 object-contain" />}
                    onChange={(cultura) => atualizarCultura(item.uid, cultura)}
                    title="Buscar Cultura"
                    subtitle="Busque por uma cultura cadastrada no sistema:"
                    confirmLabel="Selecionar"
                  />
                );
              }}
            </DynamicListWrapper>
          )}
        </div>

        {showSituacao && (
          <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-3">
            <FloatInput label="Situação" value={value.situacao} onChange={() => {}} disabled />
          </div>
        )}
      </div>
    </Section>
  );
}
