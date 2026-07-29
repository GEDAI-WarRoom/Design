import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import {
  DynamicListWrapper,
  EntitySearchInput,
} from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  criarFaixasEtarias,
  ESTABELECIMENTOS_REBANHO_MOCK,
  EXPLORACOES_REBANHO_MOCK,
  NUCLEOS_REBANHO_MOCK,
  PRODUTORES_REBANHO_MOCK,
  SITUACOES_AJUSTE_REBANHO,
  totalFemeas,
  totalMachos,
  type DocumentoAjusteRebanho,
  type EstabelecimentoRebanho,
  type ExploracaoRebanho,
  type FaixaEtariaAjuste,
  type NucleoRebanho,
  type ProdutorRebanho,
  type SituacaoAjusteRebanho,
} from "./ajusteRebanhoData";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="overflow-visible rounded-xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50 md:px-6"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 pb-6 pt-5 md:px-6">
          {children}
        </div>
      )}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="flex-shrink-0 text-gray-500" />
      <p className="text-sm font-medium leading-relaxed text-gray-600">
        Campos indicados com <span className="font-bold text-red-500">*</span>{" "}
        são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export interface AjusteRebanhoFormValue {
  produtor: ProdutorRebanho | null;
  estabelecimento: EstabelecimentoRebanho | null;
  exploracao: ExploracaoRebanho | null;
  nucleo: NucleoRebanho | null;
  faixas: FaixaEtariaAjuste[];
  justificativa: string;
  documentos: DocumentoAjusteRebanho[];
  situacao: SituacaoAjusteRebanho;
}

interface AjusteRebanhoFormProps {
  value: AjusteRebanhoFormValue;
  onChange: (value: AjusteRebanhoFormValue) => void;
  mode?: "create" | "view" | "edit";
  onNavigate: (screen: any, data?: any) => void;
  onReset?: () => void;
  podeInativar?: boolean;
  atualizacaoPosterior?: string;
}

interface RelationshipInputProps<T extends { id: number }> {
  label: string;
  placeholder: string;
  value: string;
  data: T[];
  searchKeys: string[];
  columns: Array<{ label: string; key: string }>;
  icon: ReactNode;
  onChange: (item: T) => void;
  onView?: () => void;
  required?: boolean;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
  complementaryLabel?: string;
  complementaryValue?: string;
}

function RelationshipInput<T extends { id: number }>({
  label,
  placeholder,
  value,
  data,
  searchKeys,
  columns,
  icon,
  onChange,
  onView,
  required,
  disabled,
  title,
  subtitle,
  complementaryLabel,
  complementaryValue,
}: RelationshipInputProps<T>) {
  if (disabled) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FloatInput
          label={label}
          required={required}
          value={value}
          disabled
          icon={icon}
        />
        {complementaryLabel && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <FloatInput
                label={complementaryLabel}
                required={required}
                value={complementaryValue ?? ""}
                disabled
              />
            </div>
            {onView && (
              <button
                type="button"
                onClick={onView}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md text-[#1A7A3C] transition hover:bg-green-50"
                title={`Visualizar ${label.toLowerCase()}`}
              >
                <Eye size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        value && complementaryLabel
          ? "grid grid-cols-1 gap-4 md:grid-cols-2"
          : "grid grid-cols-1"
      }
    >
      <EntitySearchInput
        label={label}
        placeholder={placeholder}
        value={value}
        data={data}
        searchKeys={searchKeys}
        columns={columns}
        icon={icon}
        required={required}
        title={title}
        subtitle={subtitle}
        onChange={onChange}
      />
      {value && complementaryLabel && (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <FloatInput
              label={complementaryLabel}
              required={required}
              value={complementaryValue ?? ""}
              disabled
            />
          </div>
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md text-[#1A7A3C] transition hover:bg-green-50"
              title={`Visualizar ${label.toLowerCase()}`}
            >
              <Eye size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
  disabled,
  colorClass,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  colorClass: string;
  label: string;
}) {
  if (disabled) {
    return <span className={`font-semibold ${colorClass}`}>{value}</span>;
  }

  const update = (nextValue: number) => {
    onChange(Math.max(0, Math.min(999999, nextValue)));
  };

  return (
    <div className="mx-auto flex h-9 w-[108px] items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => update(value - 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Diminuir ${label}`}
      >
        <Minus size={14} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const numericValue = event.target.value
            .replace(/\D/g, "")
            .slice(0, 6);
          update(numericValue ? Number(numericValue) : 0);
        }}
        aria-label={label}
        className={`h-full min-w-0 flex-1 bg-white text-center text-sm font-semibold outline-none ${colorClass}`}
      />
      <button
        type="button"
        onClick={() => update(value + 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Aumentar ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function AdjustmentTable({
  faixas,
  onChange,
  disabled,
  onReset,
}: {
  faixas: FaixaEtariaAjuste[];
  onChange: (faixas: FaixaEtariaAjuste[]) => void;
  disabled: boolean;
  onReset?: () => void;
}) {
  const updateQuantity = (
    index: number,
    field: "machosAjustados" | "femeasAjustadas",
    quantity: number,
  ) => {
    onChange(
      faixas.map((faixa, itemIndex) =>
        itemIndex === index ? { ...faixa, [field]: quantity } : faixa,
      ),
    );
  };

  if (faixas.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Selecione uma exploração pecuária para carregar as faixas etárias.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700">Ajuste</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">
            Informe a nova quantidade do rebanho em cada faixa etária.
          </span>
        </div>
        {!disabled && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 self-start text-sm font-medium text-[#1A7A3C] transition hover:opacity-75 sm:self-auto"
          >
            <RotateCcw size={15} /> Reiniciar
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th
                rowSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-left"
              >
                Faixa etária
              </th>
              <th
                colSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-center font-bold text-blue-600"
              >
                Machos
              </th>
              <th
                colSpan={2}
                className="border-b border-gray-200 px-4 py-3 text-center font-bold text-pink-600"
              >
                Fêmeas
              </th>
            </tr>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Existentes
              </th>
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Ajustados
              </th>
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Existentes
              </th>
              <th className="border-b border-gray-200 px-4 py-2 text-center">
                Ajustados
              </th>
            </tr>
          </thead>
          <tbody>
            {faixas.map((faixa, index) => (
              <tr key={faixa.id} className="border-b border-gray-100">
                <th className="border-r border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
                  {faixa.faixaEtaria}
                </th>
                <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                  {faixa.machosExistentes}
                </td>
                <td className="border-r border-gray-100 px-4 py-3 text-center">
                  <QuantityStepper
                    value={faixa.machosAjustados}
                    onChange={(quantity) =>
                      updateQuantity(index, "machosAjustados", quantity)
                    }
                    disabled={disabled}
                    colorClass="text-blue-600"
                    label={`machos ajustados de ${faixa.faixaEtaria}`}
                  />
                </td>
                <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                  {faixa.femeasExistentes}
                </td>
                <td className="px-4 py-3 text-center">
                  <QuantityStepper
                    value={faixa.femeasAjustadas}
                    onChange={(quantity) =>
                      updateQuantity(index, "femeasAjustadas", quantity)
                    }
                    disabled={disabled}
                    colorClass="text-pink-600"
                    label={`fêmeas ajustadas de ${faixa.faixaEtaria}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <th className="border-r border-gray-200 px-4 py-3 text-left uppercase text-gray-700">
                Total
              </th>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-600">
                {faixas.reduce(
                  (total, faixa) => total + faixa.machosExistentes,
                  0,
                )}
              </td>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-blue-600">
                {totalMachos(faixas)}
              </td>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-600">
                {faixas.reduce(
                  (total, faixa) => total + faixa.femeasExistentes,
                  0,
                )}
              </td>
              <td className="px-4 py-3 text-center text-pink-600">
                {totalFemeas(faixas)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function DocumentField({
  document,
  disabled,
  onChange,
  onError,
}: {
  document: DocumentoAjusteRebanho;
  disabled: boolean;
  onChange: (document: DocumentoAjusteRebanho) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extensionAccepted = /\.(png|jpe?g|pdf)$/i.test(file.name);
    if (!ACCEPTED_FILE_TYPES.includes(file.type) && !extensionAccepted) {
      onError("Selecione um arquivo nos formatos PNG, JPG ou PDF.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onError("O documento comprobatório deve possuir no máximo 50 MB.");
      event.target.value = "";
      return;
    }

    onError("");
    onChange({
      ...document,
      nome: file.name,
      tipo: file.type,
      tamanho: file.size,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[340px_1fr]">
      <div>
        <UploadField
          label="Documento Comprobatório"
          fileName={document.nome}
          onSelectFile={() => inputRef.current?.click()}
          required
          disabled={disabled}
        />
        {!disabled && (
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
            onChange={selectFile}
            className="hidden"
          />
        )}
      </div>
      <FloatInput
        label="Descrição"
        value={document.descricao}
        onChange={(descricao) => onChange({ ...document, descricao })}
        maxLength={255}
        disabled={disabled}
      />
    </div>
  );
}

export function novoDocumentoAjuste(): DocumentoAjusteRebanho {
  return {
    id: `documento-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nome: "",
    descricao: "",
    tipo: "",
    tamanho: 0,
  };
}

export function AjusteRebanhoForm({
  value,
  onChange,
  mode = "create",
  onNavigate,
  onReset,
  podeInativar = true,
  atualizacaoPosterior,
}: AjusteRebanhoFormProps) {
  const [fileError, setFileError] = useState("");
  const readOnly = mode !== "create";
  const produtorId = value.produtor?.id;
  const estabelecimentoId = value.estabelecimento?.id;
  const exploracaoId = value.exploracao?.id;
  const basicInformationComplete = Boolean(
    value.produtor &&
      value.estabelecimento &&
      value.exploracao &&
      (!value.exploracao.possuiNucleos || value.nucleo),
  );

  const estabelecimentos = ESTABELECIMENTOS_REBANHO_MOCK.filter(
    (item) => produtorId == null || item.produtorIds.includes(produtorId),
  );
  const exploracoes = EXPLORACOES_REBANHO_MOCK.filter(
    (item) =>
      (produtorId == null || item.produtorId === produtorId) &&
      (estabelecimentoId == null ||
        item.estabelecimentoId === estabelecimentoId),
  );
  const nucleos = NUCLEOS_REBANHO_MOCK.filter(
    (item) => exploracaoId == null || item.exploracaoId === exploracaoId,
  );

  const selectProdutor = (produtor: ProdutorRebanho) => {
    onChange({
      ...value,
      produtor,
      estabelecimento: null,
      exploracao: null,
      nucleo: null,
      faixas: [],
    });
  };

  const selectEstabelecimento = (
    estabelecimento: EstabelecimentoRebanho,
  ) => {
    onChange({
      ...value,
      estabelecimento,
      exploracao: null,
      nucleo: null,
      faixas: [],
    });
  };

  const selectExploracao = (exploracao: ExploracaoRebanho) => {
    onChange({
      ...value,
      exploracao,
      nucleo: null,
      faixas: criarFaixasEtarias(exploracao.especie),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="Informações Básicas">
        <div className="flex flex-col gap-5">
          <RelationshipInput
            label="Produtor"
            placeholder="Buscar por nome ou CPF/CNPJ."
            required
            value={value.produtor?.nome ?? ""}
            data={PRODUTORES_REBANHO_MOCK}
            searchKeys={["nome", "documento"]}
            columns={[
              { label: "Nome / Razão Social", key: "nome" },
              { label: "CPF / CNPJ", key: "documento" },
            ]}
            icon={
              <img
                src={Icons.iconeProdutorUrl}
                alt=""
                className="h-5 w-5 object-contain"
              />
            }
            title="Buscar Produtor"
            subtitle="Busque por uma pessoa física ou jurídica produtora cadastrada no sistema:"
            onChange={selectProdutor}
            disabled={readOnly}
            complementaryLabel={
              value.produtor?.tipo === "PJ" ? "CNPJ" : "CPF"
            }
            complementaryValue={value.produtor?.documento}
            onView={() =>
              onNavigate(
                value.produtor?.tipo === "PJ"
                  ? "pessoa-juridica"
                  : "pessoa-fisica",
              )
            }
          />

          {(readOnly || value.produtor) && (
            <RelationshipInput
              label="Estabelecimento Agropecuário"
              placeholder="Buscar por código ou nome."
              required
              value={value.estabelecimento?.nome ?? ""}
              data={estabelecimentos}
              searchKeys={["codigo", "nome", "municipio"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Estabelecimento", key: "nome" },
                { label: "Município", key: "municipio" },
              ]}
              icon={
                <img
                  src={Icons.iconeEstabelecimentoUrl}
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              }
              title="Buscar Estabelecimento Agropecuário"
              subtitle="Busque entre os estabelecimentos relacionados ao produtor selecionado:"
              onChange={selectEstabelecimento}
              disabled={readOnly}
              complementaryLabel="Código do Estabelecimento Agropecuário"
              complementaryValue={value.estabelecimento?.codigo}
              onView={() => onNavigate("estabelecimento-agropecuario")}
            />
          )}

          {(readOnly || value.estabelecimento) && (
            <RelationshipInput
              label="Exploração Pecuária"
              placeholder="Buscar por código ou espécie."
              required
              value={value.exploracao?.codigo ?? ""}
              data={exploracoes}
              searchKeys={["codigo", "especie", "grupo"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Grupo", key: "grupo" },
                { label: "Espécie", key: "especie" },
              ]}
              icon={
                <img
                  src={Icons.iconeExploracaoUrl}
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              }
              title="Buscar Exploração Pecuária"
              subtitle="Busque entre as explorações relacionadas ao produtor e ao estabelecimento selecionados:"
              onChange={selectExploracao}
              disabled={readOnly}
              complementaryLabel="Espécie"
              complementaryValue={value.exploracao?.especie}
              onView={() => onNavigate("exploracao-pecuaria")}
            />
          )}

          {(readOnly || value.exploracao?.possuiNucleos) && (
            <RelationshipInput
              label="Núcleo de Produção"
              placeholder="Buscar por código ou nome."
              required={Boolean(value.exploracao?.possuiNucleos)}
              value={value.nucleo?.nome ?? ""}
              data={nucleos}
              searchKeys={["codigo", "nome"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Núcleo de Produção", key: "nome" },
              ]}
              icon={
                <img
                  src={Icons.iconeNucleoProducaoUrl}
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              }
              title="Buscar Núcleo de Produção"
              subtitle="Busque entre os núcleos da exploração pecuária selecionada:"
              onChange={(nucleo) => onChange({ ...value, nucleo })}
              disabled={readOnly}
              complementaryLabel="Código do Núcleo"
              complementaryValue={value.nucleo?.codigo}
              onView={() => onNavigate("nucleo-producao")}
            />
          )}
        </div>
      </Section>

      {(readOnly || basicInformationComplete) && (
        <>
          <Section title="Informações de Ajuste">
            <AdjustmentTable
              faixas={value.faixas}
              onChange={(faixas) => onChange({ ...value, faixas })}
              disabled={readOnly}
              onReset={onReset}
            />
          </Section>

          <Section title="Justificativa">
            <div className="flex flex-col gap-5">
              <LargeTextArea
                label="Justificativa"
                required
                hasTooltip
                tooltipText="Informe o motivo pelo qual foi necessário ajustar o rebanho."
                value={value.justificativa}
                onChange={(justificativa) =>
                  onChange({ ...value, justificativa })
                }
                maxLength={1500}
                rows={5}
                disabled={readOnly}
              />

              <DynamicListWrapper
                items={value.documentos}
                behavior="at-least-one"
                itemLabel="Documento Comprobatório"
                addButtonLabel="Adicionar Documento"
                disabled={readOnly}
                variant="plain"
                onAddItem={() =>
                  onChange({
                    ...value,
                    documentos: [...value.documentos, novoDocumentoAjuste()],
                  })
                }
                onRemoveItem={(index) =>
                  onChange({
                    ...value,
                    documentos: value.documentos.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  })
                }
                renderHeaderBadge={(item: DocumentoAjusteRebanho) =>
                  item.nome ? (
                    <span className="max-w-[260px] truncate text-xs text-gray-500">
                      {item.nome}
                    </span>
                  ) : null
                }
              >
                {(document: DocumentoAjusteRebanho, index: number) => (
                  <DocumentField
                    document={document}
                    disabled={readOnly}
                    onError={setFileError}
                    onChange={(updatedDocument) =>
                      onChange({
                        ...value,
                        documentos: value.documentos.map((item, itemIndex) =>
                          itemIndex === index ? updatedDocument : item,
                        ),
                      })
                    }
                  />
                )}
              </DynamicListWrapper>

              {fileError && (
                <p className="text-sm font-medium text-red-500">{fileError}</p>
              )}
            </div>
          </Section>
        </>
      )}

      {mode !== "create" && (
        <Section title="Situação do Cadastro">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mode === "view" || value.situacao === "Inativo" ? (
              <FloatInput
                label="Situação"
                value={value.situacao}
                disabled
              />
            ) : (
              <FloatSelect
                label="Situação"
                required
                value={value.situacao}
                onChange={(situacao) =>
                  onChange({
                    ...value,
                    situacao: situacao as SituacaoAjusteRebanho,
                  })
                }
                options={SITUACOES_AJUSTE_REBANHO}
              />
            )}
          </div>

          {mode === "edit" && !podeInativar && (
            <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <Info size={18} className="mt-0.5 flex-shrink-0" />
              <p>
                Este ajuste não pode ser inativado porque existe atualização
                posterior do rebanho.{" "}
                {atualizacaoPosterior && (
                  <span className="font-medium">{atualizacaoPosterior}</span>
                )}
              </p>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

export function ajusteRebanhoValido(value: AjusteRebanhoFormValue) {
  const nucleoValido =
    !value.exploracao?.possuiNucleos || Boolean(value.nucleo);
  const documentosValidos =
    value.documentos.length > 0 &&
    value.documentos.every(
      (document) =>
        Boolean(document.nome) &&
        document.tamanho <= MAX_FILE_SIZE &&
        document.descricao.length <= 255,
    );

  return Boolean(
    value.produtor &&
      value.estabelecimento &&
      value.exploracao &&
      nucleoValido &&
      value.faixas.length > 0 &&
      value.justificativa.trim() &&
      documentosValidos,
  );
}

export const criarEstadoInicialAjusteRebanho =
  (): AjusteRebanhoFormValue => ({
    produtor: null,
    estabelecimento: null,
    exploracao: null,
    nucleo: null,
    faixas: [],
    justificativa: "",
    documentos: [novoDocumentoAjuste()],
    situacao: "Ativo",
  });
