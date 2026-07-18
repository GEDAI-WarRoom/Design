import { useState, type ReactNode } from "react";
import { Bug, ChevronDown, ChevronUp, Info, MapPin } from "lucide-react";
import { FloatCombobox, FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  DoencaInput,
  DynamicListWrapper,
  EntitySearchInput,
} from "../../../components/ui/EntitySearch";
import {
  CLASSIFICACOES_SANITARIAS,
  ClassificacaoSanitariaEstado,
  ESTADOS_BRASILEIROS,
  MUNICIPIOS_POR_ESTADO,
  PRAGAS_MOCK,
} from "./classificacaoSanitariaData";
import * as Icons from "../../../imports/icons";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

interface Props {
  value: Omit<ClassificacaoSanitariaEstado, "id">;
  onChange?: (value: Omit<ClassificacaoSanitariaEstado, "id">) => void;
  disabled?: boolean;
}

export function ClassificacaoSanitariaForm({ value, onChange, disabled = false }: Props) {
  const update = <K extends keyof typeof value>(field: K, fieldValue: (typeof value)[K]) => {
    onChange?.({ ...value, [field]: fieldValue });
  };
  const municipiosDisponiveis = MUNICIPIOS_POR_ESTADO[value.estado] ?? [];

  const alterarEstado = (estado: string) => {
    onChange?.({ ...value, estado, municipios: [] });
  };

  const alterarTipo = (tipo: string) => {
    onChange?.({
      ...value,
      tipo: tipo as ClassificacaoSanitariaEstado["tipo"],
      doenca: "",
      praga: "",
    });
  };

  const atualizarMunicipio = (index: number, field: "municipio" | "classificacao", next: string) => {
    update("municipios", value.municipios.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: next } : item
    )));
  };

  return (
    <>
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatSelect
            label="Estado"
            required
            value={value.estado}
            onChange={alterarEstado}
            options={ESTADOS_BRASILEIROS}
            disabled={disabled}
          />
          <FloatSelect
            label="Classificação Sanitária"
            required
            value={value.classificacao}
            onChange={(next) => update("classificacao", next)}
            options={CLASSIFICACOES_SANITARIAS}
            disabled={disabled}
          />
          <FloatSelect
            label="Animal ou Vegetal?"
            required
            value={value.tipo}
            onChange={alterarTipo}
            options={[
              { value: "Animal", label: "Animal" },
              { value: "Vegetal", label: "Vegetal" },
            ]}
            disabled={disabled}
          />

          {value.tipo === "Animal" && (
            disabled ? (
              <FloatInput label="Doença" required value={value.doenca} disabled onChange={() => { }} />
            ) : (
              <DoencaInput
                required
                value={value.doenca}
                onChange={(doenca) => update("doenca", doenca.nome)}
              />
            )
          )}

          {value.tipo === "Vegetal" && (
            disabled ? (
              <FloatInput label="Praga" required value={value.praga} disabled onChange={() => { }} />
            ) : (
              <EntitySearchInput
                label="Praga"
                placeholder="Buscar por nome da praga."
                required
                value={value.praga}
                data={PRAGAS_MOCK}
                searchKeys={["nome"]}
                columns={[
                  { label: "Praga", key: "nome" },
                ]}
                icon={<img src={Icons.iconePragaUrl} alt="Praga" className="w-5 h-5 object-contain" />}
                onChange={(praga) => update("praga", praga.nome)}
              />
            )
          )}
        </div>
      </Section>

      <Section title="Classificação Sanitária por Município">
        {disabled ? (
          value.municipios.length ? (
            <div className="flex flex-col gap-4">
              {value.municipios.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Município" required value={item.municipio} disabled onChange={() => { }} />
                  <FloatSelect
                    label="Classificação Sanitária para Município"
                    required
                    value={item.classificacao}
                    onChange={() => { }}
                    options={CLASSIFICACOES_SANITARIAS}
                    disabled
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma classificação sanitária por município cadastrada.</p>
          )
        ) : (
          <DynamicListWrapper
            items={value.municipios}
            behavior="any"
            variant="plain"
            itemLabel="município"
            addButtonLabel="Adicionar Classificação"
            onAddItem={() => value.estado && update("municipios", [
              ...value.municipios,
              { id: `municipio-${Date.now()}`, municipio: "", classificacao: "" },
            ])}
            onRemoveItem={(index) => update("municipios", value.municipios.filter((_, itemIndex) => itemIndex !== index))}
          >
            {(item, index) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatCombobox
                  label="Município"
                  required
                  value={item.municipio}
                  onChange={(next) => atualizarMunicipio(index, "municipio", next)}
                  options={municipiosDisponiveis.filter((municipio) => (
                    municipio === item.municipio || !value.municipios.some((registro) => registro.municipio === municipio)
                  ))}
                  disabled={!value.estado}
                />
                <FloatSelect
                  label="Classificação Sanitária para Município"
                  required
                  value={item.classificacao}
                  onChange={(next) => atualizarMunicipio(index, "classificacao", next)}
                  options={CLASSIFICACOES_SANITARIAS}
                />
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
        Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export function classificacaoSanitariaValida(value: Omit<ClassificacaoSanitariaEstado, "id">) {
  const agravoPreenchido = value.tipo === "Animal" ? Boolean(value.doenca) : Boolean(value.praga);
  const municipiosDoEstado = MUNICIPIOS_POR_ESTADO[value.estado] ?? [];
  const municipiosSelecionados = value.municipios.map((item) => item.municipio);
  const municipiosValidos = value.municipios.every((item) => (
    municipiosDoEstado.includes(item.municipio) && Boolean(item.classificacao)
  )) && new Set(municipiosSelecionados).size === municipiosSelecionados.length;
  return Boolean(value.estado && value.classificacao && value.tipo && agravoPreenchido && municipiosValidos);
}
