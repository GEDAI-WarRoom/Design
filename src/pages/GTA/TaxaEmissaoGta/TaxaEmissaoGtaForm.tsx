import { useState, type ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Dna,
  Info,
  ListTree,
} from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  listarEspeciesTaxa,
  listarItensReceitaTaxa,
  MODALIDADES_FAIXA,
  TIPOS_COBRANCA,
  TIPOS_DOCUMENTO_SANITARIO,
  modalidadeOposta,
  type ItemReceitaTaxa,
  type ModalidadeFaixa,
  type TaxaEmissaoGtaDraft,
  type TipoCobranca,
  type TipoDocumentoSanitario,
} from "./taxaEmissaoGtaData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-visible rounded-xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-xl px-6 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-6 pb-6 pt-5">
          {children}
        </div>
      )}
    </section>
  );
}

interface TaxaEmissaoGtaFormProps {
  value: TaxaEmissaoGtaDraft;
  onChange?: (value: TaxaEmissaoGtaDraft) => void;
  mode?: "create" | "edit" | "view";
  fieldClassName?: (label: string, value: unknown) => string;
}

interface ItemReceitaFieldProps {
  item: ItemReceitaTaxa | null;
  label: string;
  mode: "create" | "edit" | "view";
  onChange: (item: ItemReceitaTaxa) => void;
  fieldClassName: (label: string, value: unknown) => string;
}

function ItemReceitaField({
  item,
  label,
  mode,
  onChange,
  fieldClassName,
}: ItemReceitaFieldProps) {
  const quantidadeLabel = `${label} - Quantidade do Índice`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
      {mode === "view" ? (
        <FloatInput
          label={label}
          required
          value={item?.nome ?? ""}
          disabled
          className={fieldClassName(label, item?.nome)}
        />
      ) : (
        <EntitySearchInput
          label={label}
          placeholder="Buscar item de receita"
          value={item?.nome ?? ""}
          data={listarItensReceitaTaxa()}
          searchKeys={["codigo", "nome", "quantidadeIndice"]}
          columns={[
            { label: "Item de Receita", key: "nome" },
            { label: "Quantidade do Índice", key: "quantidadeIndice" },
          ]}
          icon={<ListTree size={18} color="#1A7A3C" />}
          onChange={onChange}
          required
          title="Buscar Item de Receita"
          subtitle="Busque por um item de receita cadastrado:"
        />
      )}

      <FloatInput
        label="Quantidade do Índice"
        value={item?.quantidadeIndice ?? ""}
        disabled
        className={fieldClassName(quantidadeLabel, item?.quantidadeIndice)}
      />
    </div>
  );
}

export function TaxaEmissaoGtaForm({
  value,
  onChange,
  mode = "create",
  fieldClassName = () => "",
}: TaxaEmissaoGtaFormProps) {
  const disabled = mode === "view";
  const update = <K extends keyof TaxaEmissaoGtaDraft>(
    field: K,
    fieldValue: TaxaEmissaoGtaDraft[K],
  ) => onChange?.({ ...value, [field]: fieldValue });

  const updateTipoCobranca = (next: string) => {
    onChange?.({
      ...value,
      tipoCobranca: next as TipoCobranca,
      itemReceita: null,
      tamanhoLote: "",
      itemReceitaLote: null,
      limiteFaixa: "",
      cobrancaAteLimite: "",
      itemReceitaAteLimite: null,
      cobrancaAcimaLimite: "",
      itemReceitaAcimaLimite: null,
    });
  };

  const updateCobrancaAte = (next: string) => {
    const modalidade = next as ModalidadeFaixa;
    onChange?.({
      ...value,
      cobrancaAteLimite: modalidade,
      cobrancaAcimaLimite: modalidadeOposta(modalidade),
    });
  };

  return (
    <>
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FloatSelect
            label="Tipo de Documento Sanitário"
            required
            value={value.tipoDocumentoSanitario}
            onChange={(next) =>
              update(
                "tipoDocumentoSanitario",
                next as TipoDocumentoSanitario,
              )
            }
            options={TIPOS_DOCUMENTO_SANITARIO}
            disabled={disabled}
            className={fieldClassName(
              "Tipo de Documento Sanitário",
              value.tipoDocumentoSanitario,
            )}
          />

          {mode === "create" ? (
            <EntitySearchInput
              label="Espécie"
              placeholder="Buscar por espécie ou grupo"
              value={value.especie.nome}
              data={listarEspeciesTaxa()}
              searchKeys={["codigo", "nome", "grupo"]}
              columns={[
                { label: "Espécie", key: "nome" },
                { label: "Grupo", key: "grupo" },
              ]}
              icon={<Dna size={18} color="#1A7A3C" />}
              onChange={(especie) => update("especie", especie)}
              required
              title="Buscar Espécie"
              subtitle="Busque por uma espécie cadastrada no sistema:"
            />
          ) : (
            <FloatInput
              label="Espécie"
              required
              value={value.especie.nome}
              disabled
              className={fieldClassName("Espécie", value.especie.nome)}
            />
          )}

          <FloatInput
            label="Data Início de Vigência"
            type="date"
            required
            value={value.dataInicioVigencia}
            icon={<Calendar size={18} color="#1A7A3C" />}
            onChange={(next) => update("dataInicioVigencia", next)}
            disabled={disabled}
            className={fieldClassName(
              "Data Início de Vigência",
              value.dataInicioVigencia,
            )}
          />
        </div>
      </Section>

      <Section title="Informações de Cobrança">
        <div className="flex flex-col gap-5">
          <div className="max-w-md">
            <FloatSelect
              label="Tipo de Cobrança"
              required
              value={value.tipoCobranca}
              onChange={updateTipoCobranca}
              options={TIPOS_COBRANCA}
              disabled={disabled}
              className={fieldClassName(
                "Tipo de Cobrança",
                value.tipoCobranca,
              )}
            />
          </div>

          {(value.tipoCobranca === "Por Cabeça" ||
            value.tipoCobranca === "Por Documento") && (
            <ItemReceitaField
              label={`Item de Receita (cobrado por ${
                value.tipoCobranca === "Por Cabeça" ? "cabeça" : "documento"
              })`}
              item={value.itemReceita}
              mode={mode}
              onChange={(item) => update("itemReceita", item)}
              fieldClassName={fieldClassName}
            />
          )}

          {value.tipoCobranca === "Por Lotes" && (
            <div className="flex flex-col gap-5">
              <div className="max-w-md">
                <FloatInput
                  label="Tamanho dos lotes de animais"
                  required
                  value={value.tamanhoLote}
                  onChange={(next) => update("tamanhoLote", next)}
                  disabled={disabled}
                  className={fieldClassName(
                    "Tamanho dos lotes de animais",
                    value.tamanhoLote,
                  )}
                />
              </div>
              <ItemReceitaField
                label={
                  value.tamanhoLote
                    ? `Item de Receita (cobrado a cada ${value.tamanhoLote} animais)`
                    : "Item de Receita (cobrado por lote)"
                }
                item={value.itemReceitaLote}
                mode={mode}
                onChange={(item) => update("itemReceitaLote", item)}
                fieldClassName={fieldClassName}
              />
            </div>
          )}

          {value.tipoCobranca === "Por Faixas" && (
            <div className="flex flex-col gap-5">
              <div className="max-w-md">
                <FloatInput
                  label="Limite de animais entre as faixas"
                  required
                  value={value.limiteFaixa}
                  onChange={(next) =>
                    update("limiteFaixa", next.replace(/\D/g, ""))
                  }
                  disabled={disabled}
                  className={fieldClassName(
                    "Limite de animais entre as faixas",
                    value.limiteFaixa,
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FloatSelect
                  label={`Até ${value.limiteFaixa || "[Limite]"} animais`}
                  required
                  value={value.cobrancaAteLimite}
                  onChange={updateCobrancaAte}
                  options={MODALIDADES_FAIXA}
                  disabled={disabled}
                  className={fieldClassName(
                    "Cobrança até o limite",
                    value.cobrancaAteLimite,
                  )}
                />
                <FloatInput
                  label={`Acima de ${value.limiteFaixa || "[Limite]"} animais`}
                  required
                  value={value.cobrancaAcimaLimite}
                  disabled
                  className={fieldClassName(
                    "Cobrança acima do limite",
                    value.cobrancaAcimaLimite,
                  )}
                />
              </div>

              <ItemReceitaField
                label={`Item de Receita (${modalidadeEmMinusculo(
                  value.cobrancaAteLimite,
                )} até ${value.limiteFaixa || "[Limite]"} animais)`}
                item={value.itemReceitaAteLimite}
                mode={mode}
                onChange={(item) => update("itemReceitaAteLimite", item)}
                fieldClassName={fieldClassName}
              />

              <ItemReceitaField
                label={`Item de Receita (${modalidadeEmMinusculo(
                  value.cobrancaAcimaLimite,
                )} acima de ${value.limiteFaixa || "[Limite]"} animais)`}
                item={value.itemReceitaAcimaLimite}
                mode={mode}
                onChange={(item) => update("itemReceitaAcimaLimite", item)}
                fieldClassName={fieldClassName}
              />
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

function modalidadeEmMinusculo(modalidade: ModalidadeFaixa | "") {
  if (!modalidade) return "cobrado por [Cabeça | Documento]";
  return modalidade.replace("Cobrar", "cobrado");
}

export function RequiredFieldsNotice() {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="shrink-0 text-gray-500 stroke-[2.5]" />
      <p className="text-sm font-medium leading-relaxed text-gray-600">
        Campos indicados com <span className="font-bold text-red-500">*</span>{" "}
        são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export function taxaValida(taxa: TaxaEmissaoGtaDraft) {
  if (
    !taxa.tipoDocumentoSanitario ||
    !taxa.especie.id ||
    !taxa.dataInicioVigencia ||
    !taxa.tipoCobranca
  ) {
    return false;
  }

  if (
    taxa.tipoCobranca === "Por Cabeça" ||
    taxa.tipoCobranca === "Por Documento"
  ) {
    return Boolean(taxa.itemReceita);
  }

  if (taxa.tipoCobranca === "Por Lotes") {
    return Boolean(taxa.tamanhoLote.trim() && taxa.itemReceitaLote);
  }

  return Boolean(
    Number(taxa.limiteFaixa) > 0 &&
      taxa.cobrancaAteLimite &&
      taxa.cobrancaAcimaLimite &&
      taxa.itemReceitaAteLimite &&
      taxa.itemReceitaAcimaLimite,
  );
}
