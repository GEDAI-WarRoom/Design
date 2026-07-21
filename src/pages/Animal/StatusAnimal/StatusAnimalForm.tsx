import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { DynamicListWrapper } from "../../../components/ui/EntitySearch";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  LargeTextArea,
} from "../../../components/ui/FormKit";
import {
  DISPONIBILIDADES_SUBSTATUS,
  REGRAS_BLOQUEIO,
  SITUACOES_STATUS_ANIMAL,
  type DisponibilidadeSubstatus,
  type StatusAnimal,
  type SubstatusAnimal,
} from "./statusAnimalData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>
      )}
    </section>
  );
}

export type StatusAnimalFormValue = Omit<StatusAnimal, "id">;

interface StatusAnimalFormProps {
  value: StatusAnimalFormValue;
  onChange: (value: StatusAnimalFormValue) => void;
  disabled?: boolean;
  showSituacao?: boolean;
}

const novoSubstatus = (): SubstatusAnimal => ({
  id: `substatus-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  nome: "",
  disponivelEm: [],
  observacaoImpressaoGta: "",
  bloqueiaOrigem: "",
  bloqueiaDestino: "",
});

export function StatusAnimalForm({
  value,
  onChange,
  disabled = false,
  showSituacao = true,
}: StatusAnimalFormProps) {
  const atualizarSubstatus = (
    index: number,
    changes: Partial<SubstatusAnimal>,
  ) => {
    onChange({
      ...value,
      substatus: value.substatus.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    });
  };

  return (
    <>
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput
            label="Nome do Status Animal"
            required
            value={value.nome}
            onChange={(nome) => onChange({ ...value, nome })}
            maxLength={255}
            disabled={disabled}
            className={showSituacao ? "" : "md:col-span-2"}
          />
          {showSituacao && (
            <FloatSelect
              label="Situação"
              required
              value={value.situacao}
              onChange={(situacao) =>
                onChange({
                  ...value,
                  situacao: situacao as StatusAnimal["situacao"],
                })
              }
              options={SITUACOES_STATUS_ANIMAL}
              disabled={disabled}
            />
          )}
        </div>
      </Section>

      <Section title="Substatus Animal">
        {value.substatus.length === 0 && disabled ? (
          <p className="text-sm text-gray-500">Nenhum substatus animal cadastrado.</p>
        ) : (
          <DynamicListWrapper
            items={value.substatus}
            behavior="zero-or-more"
            itemLabel="Substatus Animal"
            addButtonLabel="Adicionar Substatus Animal"
            disabled={disabled}
            onAddItem={() =>
              onChange({ ...value, substatus: [...value.substatus, novoSubstatus()] })
            }
            onRemoveItem={(index) =>
              onChange({
                ...value,
                substatus: value.substatus.filter((_, itemIndex) => itemIndex !== index),
              })
            }
            renderHeaderBadge={(item: SubstatusAnimal) =>
              item.nome ? (
                <span className="text-xs text-gray-500">{item.nome}</span>
              ) : null
            }
          >
            {(item: SubstatusAnimal, index: number) => (
              <div className="flex flex-col gap-5">
                <FloatInput
                  label="Substatus Animal"
                  required
                  value={item.nome}
                  onChange={(nome) => atualizarSubstatus(index, { nome })}
                  maxLength={255}
                  disabled={disabled}
                />

                <CheckboxGroup
                  title="Disponível em"
                  options={DISPONIBILIDADES_SUBSTATUS}
                  defaultValue={item.disponivelEm}
                  onChange={(disponivelEm) =>
                    atualizarSubstatus(index, {
                      disponivelEm: disponivelEm as DisponibilidadeSubstatus[],
                    })
                  }
                  orientation="horizontal"
                  disabled={disabled}
                />

                <LargeTextArea
                  label="Observação Impressão GTA"
                  required
                  value={item.observacaoImpressaoGta}
                  onChange={(observacaoImpressaoGta) =>
                    atualizarSubstatus(index, { observacaoImpressaoGta })
                  }
                  maxLength={1500}
                  disabled={disabled}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatSelect
                    label="Bloqueia na origem?"
                    required
                    value={item.bloqueiaOrigem}
                    onChange={(bloqueiaOrigem) =>
                      atualizarSubstatus(index, {
                        bloqueiaOrigem: bloqueiaOrigem as SubstatusAnimal["bloqueiaOrigem"],
                      })
                    }
                    options={REGRAS_BLOQUEIO}
                    disabled={disabled}
                  />
                  <FloatSelect
                    label="Bloqueia no destino?"
                    required
                    value={item.bloqueiaDestino}
                    onChange={(bloqueiaDestino) =>
                      atualizarSubstatus(index, {
                        bloqueiaDestino: bloqueiaDestino as SubstatusAnimal["bloqueiaDestino"],
                      })
                    }
                    options={REGRAS_BLOQUEIO}
                    disabled={disabled}
                  />
                </div>
              </div>
            )}
          </DynamicListWrapper>
        )}
      </Section>
    </>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span> são
        obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export function statusAnimalValido(value: StatusAnimalFormValue) {
  return Boolean(
    value.nome.trim() &&
      value.situacao &&
      value.substatus.every(
        (item) =>
          item.nome.trim() &&
          item.observacaoImpressaoGta.trim() &&
          item.bloqueiaOrigem &&
          item.bloqueiaDestino,
      ),
  );
}
