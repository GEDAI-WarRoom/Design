import { useMemo, useState, type ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Dna,
  Info,
  ListTree,
  PlusCircle,
  Route,
  X,
} from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import {
  ESPECIES_TAXA_MOCK,
  FINALIDADES_TAXA_MOCK,
  ITENS_RECEITA_TAXA_MOCK,
  MODALIDADES_FAIXA,
  OPCOES_COBRANCA_TAXA,
  TIPOS_COBRANCA,
  TIPOS_DOCUMENTO_SANITARIO,
  modalidadeOposta,
  type CobrancaTaxa,
  type FinalidadeTaxa,
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
  return (
    <div className="w-full">
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
          data={ITENS_RECEITA_TAXA_MOCK}
          searchKeys={["codigo", "nome", "classificacao"]}
          columns={[
            { label: "Item de Receita", key: "nome" },
            { label: "Tipo", key: "classificacao" },
            { label: "Quantidade do Índice", key: "quantidadeIndice" },
          ]}
          icon={<ListTree size={18} color="#1A7A3C" />}
          onChange={onChange}
          required
          title="Buscar Item de Receita"
          subtitle="Busque por um item de receita do tipo 11226600 de taxa de emissão de documentos sanitários."
        />
      )}
    </div>
  );
}

function SelectedItemsBlock<T extends { id: number; nome: string }>({
  title,
  items,
  emptyText,
  actionLabel,
  editable,
  actionDisabled = false,
  onOpen,
  onRemove,
  view,
}: {
  title: string;
  items: T[];
  emptyText: string;
  actionLabel: string;
  editable: boolean;
  actionDisabled?: boolean;
  onOpen: () => void;
  onRemove: (id: number) => void;
  view: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">
            {title}<span className="ml-0.5 text-red-500">*</span>
          </span>
          {items.length > 0 && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${view
                  ? "bg-gray-100 text-gray-500"
                  : "bg-[#E6F4EA] text-[#1A7A3C]"
                }`}
            >
              {items.length} {items.length === 1 ? "selecionado" : "selecionados"}
            </span>
          )}
        </div>
        {editable && (
          <button
            type="button"
            disabled={actionDisabled}
            onClick={onOpen}
            className="flex items-center gap-1.5 rounded-md border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <PlusCircle size={14} /> {actionLabel}
          </button>
        )}
      </div>
      <div className="flex min-h-20 flex-wrap gap-3 p-5">
        {items.length === 0 ? (
          <p className="self-center text-xs italic text-gray-400">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`flex min-w-[190px] items-center justify-between gap-4 rounded-xl border p-3 shadow-sm ${view
                  ? "border-gray-200 bg-gray-50/40 text-gray-500"
                  : "border-gray-200 bg-white text-[#1A7A3C]"
                }`}
            >
              <span className="text-sm font-bold">{item.nome}</span>
              {editable && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-gray-400 transition hover:text-red-500"
                  aria-label={`Remover ${item.nome}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
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
  const [modalEspecies, setModalEspecies] = useState(false);
  const [modalFinalidades, setModalFinalidades] = useState(false);

  const finalidadesDisponiveis = useMemo(() => {
    const especiesIds = new Set(value.especies.map((especie) => especie.id));
    return FINALIDADES_TAXA_MOCK.filter((finalidade) =>
      finalidade.especiesIds.some((id) => especiesIds.has(id)),
    );
  }, [value.especies]);

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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <FloatInput
            label="Data Início de Vigência"
            type="date"
            required
            value={value.dataInicioVigencia}
            icon={<Calendar size={18} color={disabled ? "#9CA3AF" : "#1A7A3C"} />}
            onChange={(next) => update("dataInicioVigencia", next)}
            disabled={disabled}
            className={fieldClassName(
              "Data Início de Vigência",
              value.dataInicioVigencia,
            )}
          />
        </div>
      </Section>

      <Section title="Espécies Aplicáveis">
        <SelectedItemsBlock
          title="Espécies"
          items={value.especies}
          emptyText="Nenhuma espécie selecionada."
          actionLabel="Adicionar Espécies"
          editable={mode === "create"}
          onOpen={() => setModalEspecies(true)}
          onRemove={(id) => {
            const especies = value.especies.filter((item) => item.id !== id);
            const ids = new Set(especies.map((item) => item.id));
            onChange?.({
              ...value,
              especies,
              finalidades: value.finalidades.filter((finalidade) =>
                finalidade.especiesIds.some((especieId) => ids.has(especieId)),
              ),
            });
          }}
          view={mode !== "create"}
        />
      </Section>

      <Section title="Finalidades Aplicáveis">
        <SelectedItemsBlock<FinalidadeTaxa>
          title="Finalidades de Trânsito"
          items={value.finalidades}
          emptyText={
            value.especies.length
              ? "Nenhuma finalidade selecionada."
              : "Selecione primeiro ao menos uma espécie."
          }
          actionLabel="Adicionar Finalidades"
          editable={!disabled}
          actionDisabled={value.especies.length === 0}
          onOpen={() => setModalFinalidades(true)}
          onRemove={(id) =>
            update(
              "finalidades",
              value.finalidades.filter((item) => item.id !== id),
            )
          }
          view={disabled}
        />
      </Section>

      <Section title="Informações de Cobrança">
        <div className="flex flex-col gap-6">
          <div
            className={
              disabled
                ? "[&_input:checked]:!border-gray-300 [&_input:checked]:!bg-gray-300"
                : ""
            }
          >
            <CheckboxGroup
              key={`${mode}-${value.cobrancasTaxa.join("|")}`}
              title="Cobrança de Taxa"
              options={OPCOES_COBRANCA_TAXA.map((opcao) => ({
                value: opcao,
                label: opcao,
              }))}
              defaultValue={value.cobrancasTaxa}
              onChange={(selecionadas) =>
                update("cobrancasTaxa", selecionadas as CobrancaTaxa[])
              }
              orientation="horizontal"
              disabled={disabled}
            />
          </div>

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
                label={`Item de Receita (cobrado por ${value.tipoCobranca === "Por Cabeça" ? "cabeça" : "documento"
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
                label={rotuloItemReceitaLote(value.tamanhoLote)}
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
                  label={rotuloLimiteFaixa("ate", value.limiteFaixa)}
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
                  label={rotuloLimiteFaixa("acima", value.limiteFaixa)}
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
                label={rotuloItemReceitaFaixa(
                  "ate",
                  value.cobrancaAteLimite,
                  value.limiteFaixa,
                )}
                item={value.itemReceitaAteLimite}
                mode={mode}
                onChange={(item) => update("itemReceitaAteLimite", item)}
                fieldClassName={fieldClassName}
              />

              <ItemReceitaField
                label={rotuloItemReceitaFaixa(
                  "acima",
                  value.cobrancaAcimaLimite,
                  value.limiteFaixa,
                )}
                item={value.itemReceitaAcimaLimite}
                mode={mode}
                onChange={(item) => update("itemReceitaAcimaLimite", item)}
                fieldClassName={fieldClassName}
              />
            </div>
          )}
        </div>
      </Section>

      <MultiSearchModal
        open={modalEspecies}
        onClose={() => setModalEspecies(false)}
        title="Buscar Espécies"
        subtitle="Busque e selecione uma ou mais espécies aplicáveis:"
        icon={<Dna size={18} className="text-[#1A7A3C]" />}
        data={ESPECIES_TAXA_MOCK}
        columns={[
          { label: "Espécie", key: "nome" },
          { label: "Grupo", key: "grupo" },
        ]}
        searchKeys={["codigo", "nome", "grupo"]}
        selectedItems={value.especies}
        confirmLabel="Salvar Selecionadas"
        onConfirm={(especies) => {
          const ids = new Set(especies.map((item) => item.id));
          onChange?.({
            ...value,
            especies,
            finalidades: value.finalidades.filter((finalidade) =>
              finalidade.especiesIds.some((id) => ids.has(id)),
            ),
          });
          setModalEspecies(false);
        }}
      />

      <MultiSearchModal
        open={modalFinalidades}
        onClose={() => setModalFinalidades(false)}
        title="Buscar Finalidades de Trânsito"
        subtitle="São exibidas somente finalidades compatíveis com as espécies selecionadas."
        icon={<Route size={18} className="text-[#1A7A3C]" />}
        data={finalidadesDisponiveis}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Finalidade de Trânsito", key: "nome" },
        ]}
        searchKeys={["codigo", "nome"]}
        selectedItems={value.finalidades}
        confirmLabel="Salvar Selecionadas"
        onConfirm={(finalidades) => {
          update("finalidades", finalidades);
          setModalFinalidades(false);
        }}
      />
    </>
  );
}

function rotuloLimiteFaixa(posicao: "ate" | "acima", limite: string) {
  if (limite) {
    return posicao === "ate"
      ? `Até ${limite} animais`
      : `Acima de ${limite} animais`;
  }
  return posicao === "ate"
    ? "Até o limite informado"
    : "Acima do limite informado";
}

function rotuloItemReceitaLote(tamanho: string) {
  return tamanho
    ? `Item de Receita (cobrado a cada ${tamanho} animais)`
    : "Item de Receita (cobrado conforme o tamanho do lote informado)";
}

function rotuloItemReceitaFaixa(
  posicao: "ate" | "acima",
  modalidade: ModalidadeFaixa | "",
  limite: string,
) {
  const modalidadeFormatada = modalidade
    ? modalidade.replace("Cobrar", "cobrado")
    : "cobrança";
  const faixa = limite
    ? posicao === "ate"
      ? `até ${limite} animais`
      : `acima de ${limite} animais`
    : posicao === "ate"
      ? "até o limite informado"
      : "acima do limite informado";

  return `Item de Receita (${modalidadeFormatada} ${faixa})`;
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
    !taxa.dataInicioVigencia ||
    taxa.especies.length === 0 ||
    taxa.finalidades.length === 0 ||
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
