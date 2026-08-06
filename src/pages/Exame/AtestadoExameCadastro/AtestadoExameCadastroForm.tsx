import { useState, type ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  ClipboardType,
  Eye,
  Info,
  Package,
  PlusCircle,
  Trash2,
} from "lucide-react";
import {
  DynamicListWrapper,
  EntitySearchInput,
  EstabelecimentoAgropecuarioInput,
  ExploracaoPecuariaInput,
} from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect, MultiSearchModal } from "../../../components/ui/FormKit";
import { Cell, Pie, PieChart, Sector } from "recharts";
import * as Icons from "../../../imports/icons";
import {
  criarAnimalVazio,
  errosAtestadoCadastro,
  ESTABELECIMENTOS_EXAME,
  EXPLORACOES_EXAME,
  LOTES_INSUMO_EXAME,
  MOTIVOS_EXAME,
  NUCLEOS_EXAME,
  PRODUTORES_EXAME,
  SEXOS_ANIMAL,
  TIPOS_ATESTADO_DOCUMENTO,
  VETERINARIOS_EXAME,
  tipoContemDoenca,
  type AtestadoExameCadastro,
  type EntidadeExame,
  type LoteInsumoExame,
} from "./atestadoExameCadastroData";

type FormMode = "create" | "edit" | "view";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-4 text-left hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="flex flex-col gap-5 p-6">{children}</div>}
    </section>
  );
}

function ErrorText({ children }: { children?: string }) {
  return children ? <p className="mt-1 text-xs font-medium text-red-500">{children}</p> : null;
}

function Field({ error, children }: { error?: string; children: ReactNode }) {
  return <div className="min-w-0">{children}<ErrorText>{error}</ErrorText></div>;
}

function EntityPicker<T extends EntidadeExame>({
  label,
  value,
  data,
  onChange,
  columns,
  searchKeys,
  disabled,
  required = true,
  error,
  displayValue,
  icon,
  complementLabel,
  complementValue,
  onView,
}: {
  label: string;
  value: T | null;
  data: T[];
  onChange: (value: T) => void;
  columns: { label: string; key: string }[];
  searchKeys: string[];
  disabled: boolean;
  required?: boolean;
  error?: string;
  displayValue?: string;
  icon?: ReactNode;
  complementLabel?: string;
  complementValue?: string;
  onView?: () => void;
}) {
  return (
    <Field error={error}>
      <div
        className={
          value && complementLabel
            ? "grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_auto]"
            : "w-full"
        }
      >
        {disabled ? (
          <FloatInput label={label} value={displayValue ?? value?.nome ?? ""} required={required} disabled />
        ) : (
          <EntitySearchInput
            label={label}
            placeholder={`Buscar ${label.toLowerCase()}`}
            value={displayValue ?? value?.nome ?? ""}
            data={data}
            searchKeys={searchKeys}
            columns={columns}
            icon={icon ?? <img src={Icons.iconeAnimalUrl} alt="" className="h-5 w-5 object-contain" />}
            onChange={onChange}
            required={required}
            title={`Buscar ${label}`}
            subtitle={`Selecione ${label.toLowerCase()} cadastrado no sistema:`}
            confirmLabel="Selecionar"
            showResultsOnOpen
          />
        )}
        {value && complementLabel && (
          <>
            <FloatInput label={complementLabel} value={complementValue ?? ""} disabled />
            <button
              type="button"
              onClick={onView}
              title={`Visualizar ${label}`}
              aria-label={`Visualizar ${label}`}
              className="flex h-12 w-12 items-center justify-center rounded-md text-[#1A7A3C] transition hover:bg-green-50"
            >
              <Eye size={20} />
            </button>
          </>
        )}
      </div>
    </Field>
  );
}

function mascararNumeroAtestado(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  return numeros.length > 7 ? `${numeros.slice(0, 7)}/${numeros.slice(7)}` : numeros;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

function LoteSaldoCard({
  lote,
  disabled,
  minimizado,
  onToggle,
  onRemove,
  onQuantidadeChange,
  activeIndex,
  onActiveIndex,
}: {
  lote: LoteInsumoExame;
  disabled: boolean;
  minimizado: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onQuantidadeChange: (quantidade: number) => void;
  activeIndex: number | null;
  onActiveIndex: (index: number | null) => void;
}) {
  const categorias = [
    { name: "Vencidas", value: lote.vencidos, color: "#ef4444" },
    { name: "Descartadas", value: lote.descartados, color: "#9ca3af" },
    { name: "Vendidas", value: lote.vendidos, color: "#f59e0b" },
    { name: "Disponíveis", value: lote.disponiveis, color: "#22c55e" },
  ];
  const total = categorias.reduce((soma, item) => soma + item.value, 0);
  const dosesPorFrasco = lote.dosesPorFrasco || 1;
  const frascosDisponiveis = Math.floor(lote.disponiveis / dosesPorFrasco);
  const dosesAdquiridas = lote.quantidadeAdquirida ?? 0;
  const frascosAdquiridos = dosesAdquiridas ? Math.ceil(dosesAdquiridas / dosesPorFrasco) : 0;
  const categoriaAtiva = activeIndex !== null ? categorias[activeIndex] : null;
  const porcentagem = categoriaAtiva && total
    ? `${((categoriaAtiva.value / total) * 100).toFixed(1)}%`
    : null;

  return (
    <div className={`relative flex h-auto flex-col overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ${minimizado ? "p-2.5 pb-2" : "p-4"}`}>
      <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
        <button type="button" onClick={onToggle} className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title={minimizado ? "Expandir Lote" : "Minimizar Lote"}>
          {minimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>
        {!disabled && (
          <button type="button" onClick={onRemove} className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Remover Lote">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <div className={`flex items-center justify-between overflow-visible border-gray-100 pr-14 ${minimizado ? "mb-0 border-none pb-0" : "mb-3 border-b pb-2"}`}>
        <div className="flex items-center gap-1.5">
          <span className="select-none text-xs font-semibold text-gray-800">Apresentação</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold leading-none text-gray-600">
            <Package size={10} className="text-gray-400" /> {dosesPorFrasco} doses/frasco
          </span>
          {minimizado && <span className="ml-2 text-[11px] font-medium text-gray-400">({lote.disponiveis} disp. · {lote.quantidadeAdquirida ?? 0} adquiridas)</span>}
        </div>
      </div>
      {!minimizado && (
        <div>
          <div className="z-10 mt-3 flex items-center gap-4">
            <div className="relative flex h-24 w-24 select-none items-center justify-center">
              <PieChart width={96} height={96} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Pie
                  data={categorias}
                  cx="50%"
                  cy="50%"
                  innerRadius={26}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => onActiveIndex(index)}
                  onMouseLeave={() => onActiveIndex(null)}
                >
                  {categorias.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Pie>
              </PieChart>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                {categoriaAtiva ? (
                  <>
                    <span className="text-xs font-bold leading-none" style={{ color: categoriaAtiva.color }}>{categoriaAtiva.value}</span>
                    <span className="mt-0.5 max-w-[50px] truncate text-[7px] font-semibold uppercase text-gray-500">{categoriaAtiva.name}</span>
                    <span className="mt-0.5 text-[8px] font-bold" style={{ color: categoriaAtiva.color }}>{porcentagem}</span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-black leading-none text-gray-800">{total}</span>
                    <span className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-gray-400">Total</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-1 items-stretch justify-start gap-2">
              <div className="flex w-full max-w-[130px] flex-col justify-between gap-1 rounded-xl border border-gray-200 bg-gray-50/80 px-2.5 py-2">
                <span className="text-center text-[11px] font-medium text-gray-600">Disponíveis</span>
                <div className="flex items-end justify-center gap-2 py-0.5">
                  <div className="flex flex-1 flex-col items-center">
                    <span className="text-sm font-bold leading-none text-gray-700">{frascosDisponiveis}</span>
                    <span className="mt-0.5 text-[9px] font-medium text-gray-400">Frascos</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center">
                    <span className="text-sm font-bold leading-none text-gray-700">{lote.disponiveis}</span>
                    <span className="mt-0.5 text-[9px] font-medium text-gray-400">Doses</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[130px] flex-col justify-between gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2">
                <span className="text-center text-[11px] font-medium text-gray-500">Adquiridas</span>
                <div className="flex items-end justify-center gap-1.5">
                  <div className="flex min-w-[40px] flex-1 flex-col">
                    <input
                      type="number"
                      min="0"
                      value={frascosAdquiridos || ""}
                      placeholder="0"
                      disabled={disabled}
                      onChange={(event) => onQuantidadeChange(Math.max(0, Number(event.target.value)) * dosesPorFrasco)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white p-1 text-center text-xs font-black text-gray-800 focus:border-[#1A7A3C] focus:outline-none disabled:bg-gray-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="mt-0.5 text-center text-[9px] font-semibold text-gray-400">Frascos</span>
                  </div>
                  <div className="flex min-w-[40px] flex-1 flex-col">
                    <input
                      type="number"
                      min="0"
                      max={lote.disponiveis}
                      value={dosesAdquiridas || ""}
                      placeholder="0"
                      disabled={disabled}
                      onChange={(event) => onQuantidadeChange(Math.max(0, Number(event.target.value)))}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white p-1 text-center text-xs font-black text-gray-800 focus:border-[#1A7A3C] focus:outline-none disabled:bg-gray-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="mt-0.5 text-center text-[9px] font-semibold text-gray-400">Doses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="z-10 mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-gray-100 pt-2 text-[9px]">
            {categorias.map((item) => (
              <div key={item.name} className="flex items-center gap-1 rounded border border-gray-100 bg-gray-50 px-1 py-0.5">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-gray-400">{item.name}:</span>
                <span className="font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="shrink-0 text-gray-500" />
      <p className="text-sm font-medium text-gray-600">
        Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export function AtestadoExameCadastroForm({
  value,
  onChange,
  mode = "create",
  showErrors = false,
}: {
  value: AtestadoExameCadastro;
  onChange: (value: AtestadoExameCadastro) => void;
  mode?: FormMode;
  showErrors?: boolean;
}) {
  const [modalLotesAberto, setModalLotesAberto] = useState(false);
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<number, boolean>>({});
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: number; index: number } | null>(null);
  const disabled = mode === "view";
  const errors = showErrors ? errosAtestadoCadastro(value) : {};
  const update = <K extends keyof AtestadoExameCadastro>(
    key: K,
    next: AtestadoExameCadastro[K],
  ) => onChange({ ...value, [key]: next });

  const estabelecimentos = value.produtor
    ? ESTABELECIMENTOS_EXAME.filter((item) => item.produtorId === value.produtor?.id)
    : [];
  const exploracoes = value.estabelecimento && value.produtor
    ? EXPLORACOES_EXAME.filter(
      (item) =>
        item.estabelecimentoId === value.estabelecimento?.id &&
        item.produtorId === value.produtor?.id,
    )
    : [];
  const nucleos = value.exploracao
    ? NUCLEOS_EXAME.filter((item) => item.exploracaoId === value.exploracao?.id)
    : [];
  const lotesDisponiveis = value.tipoAtestado && value.veterinario
    ? LOTES_INSUMO_EXAME.filter(
      (item) =>
        item.veterinarioId === value.veterinario?.id &&
        value.tipoAtestado?.tiposInsumo.includes(item.tipoInsumo),
    )
    : [];

  const atualizarAnimal = (index: number, patch: Partial<AtestadoExameCadastro["animais"][number]>) =>
    update(
      "animais",
      value.animais.map((animal, itemIndex) =>
        itemIndex === index ? { ...animal, ...patch } : animal,
      ),
    );

  return (
    <div className="flex flex-col gap-4">
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field error={errors.numero}>
            <FloatInput
              label="Nº do Atestado"
              value={value.numero}
              onChange={(numero) => update("numero", mascararNumeroAtestado(numero))}
              hasTooltip

              tooltipText=" Nº Sequencial / Ano"
              maxLength={12}
              required
              disabled={disabled}
              placeholder="0000000/0000"
            />
          </Field>

          <Field error={errors.dataEmissao}>
            <FloatInput
              label="Data da Emissão do Atestado"
              value={value.dataEmissao}
              onChange={(dataEmissao) => update("dataEmissao", dataEmissao)}
              type="date"
              icon={<Calendar size={20} />}
              required
              disabled={disabled}
            />
          </Field>

          <div className="md:col-span-2">
            <EntityPicker
              label="Médico Veterinário"
              value={value.veterinario}
              data={VETERINARIOS_EXAME.filter((item) => item.habilitado)}
              columns={[
                { label: "CPF", key: "cpf" },
                { label: "Nome", key: "nome" },
              ]}
              searchKeys={["cpf", "nome"]}
              onChange={(veterinario) =>
                onChange({ ...value, veterinario, lotes: [] })
              }
              disabled={disabled}
              error={errors.veterinario}
              icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="" className="h-5 w-5 object-contain" />}
              complementLabel="CPF"
              complementValue={value.veterinario?.cpf}
              onView={() =>
                value.veterinario &&
                alert(`${value.veterinario.cpf} - ${value.veterinario.nome}`)
              }
            />
          </div>
          <EntityPicker
            label="Tipo de Atestado"
            value={value.tipoAtestado}
            data={TIPOS_ATESTADO_DOCUMENTO}
            columns={[{ label: "Tipo de Atestado", key: "nome" }]}
            searchKeys={["nome"]}
            onChange={(tipoAtestado) =>
              onChange({
                ...value,
                tipoAtestado,
                lotes: [],
                numeroTestesBrucelose: "",
                dataColheita: "",
                dataTeste: "",
                numeroTestesTuberculose: "",
                dataInoculacao: "",
                dataLeitura: "",
                animais: value.animais.map((animal) => ({ ...animal, resultados: {} })),
              })
            }
            disabled={disabled}
            error={errors.tipoAtestado}
            icon={<ClipboardType size={20} />} />

          <div className="md:col-span-2">
            <EntityPicker
              label="Produtor"
              value={value.produtor}
              data={PRODUTORES_EXAME}
              columns={[
                { label: "CPF/CNPJ", key: "documento" },
                { label: "Nome/Razão Social", key: "nome" },
              ]}
              searchKeys={["documento", "nome"]}
              onChange={(produtor) =>
                onChange({
                  ...value,
                  produtor,
                  estabelecimento: null,
                  exploracao: null,
                  nucleo: null,
                })
              }
              disabled={disabled}
              error={errors.produtor}
              icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
              complementLabel="CPF/CNPJ"
              complementValue={value.produtor?.documento}
              onView={() =>
                value.produtor &&
                alert(`${value.produtor.documento} - ${value.produtor.nome}`)
              }
            />
          </div>
          {value.produtor && (
            <div className="md:col-span-2">
              {disabled ? (
                <EntityPicker
                  label="Estabelecimento Agropecuário"
                  value={value.estabelecimento}
                  data={estabelecimentos}
                  columns={[]}
                  searchKeys={[]}
                  onChange={() => { }}
                  disabled
                  error={errors.estabelecimento}
                  complementLabel="Código"
                  complementValue={value.estabelecimento?.codigo}
                  onView={() =>
                    value.estabelecimento &&
                    alert(`${value.estabelecimento.codigo} - ${value.estabelecimento.nome}`)
                  }
                />
              ) : (
                <Field error={errors.estabelecimento}>
                  <EstabelecimentoAgropecuarioInput
                    value={value.estabelecimento?.nome ?? ""}
                    data={estabelecimentos}
                    required
                    onChange={(estabelecimento) =>
                      onChange({ ...value, estabelecimento, exploracao: null, nucleo: null })
                    }
                    onEyeClick={() =>
                      value.estabelecimento &&
                      alert(`${value.estabelecimento.codigo} - ${value.estabelecimento.nome}`)
                    }
                  />
                </Field>
              )}
            </div>
          )}

          {value.estabelecimento && (
            <div className="md:col-span-2">
              {disabled ? (
                <EntityPicker
                  label="Exploração Pecuária"
                  value={value.exploracao}
                  data={exploracoes}
                  columns={[]}
                  searchKeys={[]}
                  onChange={() => { }}
                  disabled
                  error={errors.exploracao}
                  complementLabel="Código"
                  complementValue={value.exploracao?.codigo}
                  onView={() =>
                    value.exploracao &&
                    alert(`${value.exploracao.codigo} - ${value.exploracao.nome} (${value.exploracao.especie})`)
                  }
                />
              ) : (
                <Field error={errors.exploracao}>
                  <ExploracaoPecuariaInput
                    value={value.exploracao?.codigo ?? ""}
                    data={exploracoes.map((exploracao) => ({
                      ...exploracao,
                      estabelecimentoFormatado: `${value.estabelecimento?.codigo}\n- ${value.estabelecimento?.nome}`,
                      grupoEspecieFormatado: `${exploracao.especie}\n- ${exploracao.especie}`,
                      produtoresFormatado: `${value.produtor?.documento}\n- ${value.produtor?.nome}`,
                    }))}
                    required
                    onChange={(exploracao) =>
                      onChange({
                        ...value,
                        exploracao,
                        nucleo: null,
                        animais: value.animais.map((animal) => ({
                          ...animal,
                          faixaEtaria: "",
                          raca: "",
                        })),
                      })
                    }
                    onEyeClick={() =>
                      value.exploracao &&
                      alert(`${value.exploracao.codigo} - ${value.exploracao.nome} (${value.exploracao.especie})`)
                    }
                  />
                </Field>
              )}
            </div>
          )}
          {value.exploracao?.possuiNucleo && (
            <EntityPicker
              label="Núcleo de Produção"
              value={value.nucleo}
              data={nucleos}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Núcleo", key: "nome" },
              ]}
              searchKeys={["codigo", "nome"]}
              onChange={(nucleo) => update("nucleo", nucleo)}
              disabled={disabled}
              error={errors.nucleo}
              icon={<img src={Icons.iconeNucleoProducaoUrl} alt="" className="h-5 w-5 object-contain" />}
            />
          )}

          <div className="md:col-span-2">
            <Field error={errors.certificado}>
              <FloatInput
                label="Nº do Certificado de Propriedade Livre"
                value={value.certificadoPropriedadeLivre}
                onChange={(certificado) => update("certificadoPropriedadeLivre", certificado)}
                maxLength={255}
                required
                disabled={disabled}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Informações do Exame">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field error={errors.motivo}>
            <FloatSelect
              label="Motivo do Exame"
              value={value.motivoExame}
              onChange={(motivoExame) =>
                onChange({
                  ...value,
                  motivoExame,
                  outroMotivo: motivoExame === "Outro" ? value.outroMotivo : "",
                })
              }
              options={MOTIVOS_EXAME}
              required
              disabled={disabled}
            />
          </Field>
          {value.motivoExame === "Outro" && (
            <Field error={errors.outro}>
              <FloatInput
                label="Outro"
                value={value.outroMotivo}
                onChange={(outroMotivo) => update("outroMotivo", outroMotivo)}
                maxLength={255}
                required
                disabled={disabled}
              />
            </Field>
          )}
        </div>

        {tipoContemDoenca(value.tipoAtestado, "Brucelose") && (
          <div className="rounded-xl">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Exame de Brucelose</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field error={errors.testesBrucelose}>
                <FloatInput label="Nº de testes para brucelose" value={value.numeroTestesBrucelose} onChange={(next) => update("numeroTestesBrucelose", next.replace(/\D/g, "").slice(0, 255))} required disabled={disabled} />
              </Field>
              <Field error={errors.dataColheita}>
                <FloatInput label="Data da Colheita" value={value.dataColheita} onChange={(next) => update("dataColheita", next)} type="date" icon={<Calendar size={20} />} required disabled={disabled} />
              </Field>
              <Field error={errors.dataTeste}>
                <FloatInput label="Data do Teste" value={value.dataTeste} onChange={(next) => update("dataTeste", next)} type="date" icon={<Calendar size={20} />} required disabled={disabled} />
              </Field>
            </div>
          </div>
        )}

        {tipoContemDoenca(value.tipoAtestado, "Tuberculose") && (
          <div className="rounded-xl ">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Exame de Tuberculose</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field error={errors.testesTuberculose}>
                <FloatInput label="Nº de testes para tuberculose" value={value.numeroTestesTuberculose} onChange={(next) => update("numeroTestesTuberculose", next.replace(/\D/g, "").slice(0, 255))} required disabled={disabled} />
              </Field>
              <Field error={errors.dataInoculacao}>
                <FloatInput label="Data de Inoculação" value={value.dataInoculacao} onChange={(next) => update("dataInoculacao", next)} type="date" icon={<Calendar size={20} />} required disabled={disabled} />
              </Field>
              <Field error={errors.dataLeitura}>
                <FloatInput label="Data de Leitura" value={value.dataLeitura} onChange={(next) => update("dataLeitura", next)} type="date" icon={<Calendar size={20} />} required disabled={disabled} />
              </Field>
            </div>
          </div>
        )}
      </Section>

      {value.veterinario && value.tipoAtestado && (
        <Section title="Saldo de Insumos">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">Saldo de Insumos</span>
              </div>
              {value.lotes.length > 0 && (
                <div className="flex animate-fadeIn items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1">
                  <span className="text-[11px] font-semibold text-gray-500">UNIDADES ADQUIRIDAS:</span>
                  <span className="text-[11px] font-black text-[#1A7A3C]">
                    {value.lotes.reduce((total, lote) => total + (lote.quantidadeAdquirida ?? 0), 0)} unidades
                  </span>
                </div>
              )}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setModalLotesAberto(true);
                }}
                className="flex h-11 w-fit cursor-pointer items-center gap-2 rounded-lg border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] shadow-sm transition hover:bg-green-50"
              >
                <PlusCircle size={18} />
                Adicionar Saldo
              </button>
            )}
          </div>
          {value.lotes.length > 0 ? (
            <div className="grid animate-fadeIn grid-cols-1 gap-4 md:grid-cols-2">
              {value.lotes.map((lote) => (
                <div key={lote.id} className="rounded-xl border border-gray-200 bg-gray-50/30 p-4">
                  <div className="mb-4 flex items-center gap-2 px-1">
                    <Package size={24} color="#1A7A3C" />
                    <span className="text-sm font-bold text-gray-600">Lote:</span>
                    <span className="text-sm font-bold text-gray-800">{lote.codigo}</span>
                  </div>
                  <LoteSaldoCard
                    lote={lote}
                    disabled={disabled}
                    minimizado={lotesMinimizados[lote.id] ?? false}
                    onToggle={() =>
                      setLotesMinimizados((atuais) => ({
                        ...atuais,
                        [lote.id]: !atuais[lote.id],
                      }))
                    }
                    onRemove={() => update("lotes", value.lotes.filter((item) => item.id !== lote.id))}
                    onQuantidadeChange={(quantidadeAdquirida) =>
                      update(
                        "lotes",
                        value.lotes.map((item) =>
                          item.id === lote.id ? { ...item, quantidadeAdquirida } : item,
                        ),
                      )
                    }
                    activeIndex={graficoAtivo?.loteId === lote.id ? graficoAtivo.index : null}
                    onActiveIndex={(index) =>
                      setGraficoAtivo(index === null ? null : { loteId: lote.id, index })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/20 px-4 py-8 text-center">
              <p className="text-sm italic text-gray-400">Nenhum lote vinculado a este atestado até o momento.</p>
            </div>
          )}

          <MultiSearchModal<LoteInsumoExame>
            open={modalLotesAberto}
            onClose={() => setModalLotesAberto(false)}
            title="Buscar Lotes de Insumos"
            subtitle="Selecione os lotes de insumos desejados para vincular a este atestado:"
            icon={<Package size={24} color="#1A7A3C" />}
            data={lotesDisponiveis}
            searchKeys={["codigo", "tipoInsumo"]}
            searchPlaceholder="Busque por lote ou tipo de insumo."
            columns={[
              { label: "Lote/ Nº de Partida", key: "codigo" },
              { label: "Tipo de Insumo", key: "tipoInsumo" },
              {
                label: "Saldo da Apresentação",
                key: "disponiveis",
                render: (_, lote) =>
                  `${Math.floor(lote.disponiveis / (lote.dosesPorFrasco || 1))} frascos / ${lote.disponiveis} doses`,
              },
              { label: "Validade", key: "validade" },
            ]}
            selectedItems={value.lotes}
            onConfirm={(selecionados) => {
              update(
                "lotes",
                selecionados.map((selecionado) => ({
                  ...selecionado,
                  quantidadeAdquirida:
                    value.lotes.find((lote) => lote.id === selecionado.id)?.quantidadeAdquirida ?? 0,
                })),
              );
              setModalLotesAberto(false);
            }}
            confirmLabel="Selecionar Lotes"
            showResultsOnOpen
          />
        </Section>
      )}

      <Section title="Animais Examinados">
        <div className="flex flex-col gap-4">
          <DynamicListWrapper
            items={value.animais}
            behavior="at-least-one"
            addButtonLabel="Adicionar Animal"
            itemLabel="Animal"
            onAddItem={() => update("animais", [...value.animais, criarAnimalVazio()])}
            onRemoveItem={(index) =>
              update("animais", value.animais.filter((_, itemIndex) => itemIndex !== index))
            }
            showCounter
            disabled={disabled}
          >
            {(animal, index) => (
              <div key={animal.id} className="flex w-full flex-col gap-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FloatInput label="Número de identificação individual do animal" value={animal.identificacao} onChange={(identificacao) => atualizarAnimal(index, { identificacao })} maxLength={255} required disabled={disabled} />
                  <FloatSelect label="Sexo" value={animal.sexo} onChange={(sexo) => atualizarAnimal(index, { sexo: sexo as "Fêmea" | "Macho" })} options={SEXOS_ANIMAL} required disabled={disabled} />
                  <FloatSelect label="Faixa Etária" value={animal.faixaEtaria} onChange={(faixaEtaria) => atualizarAnimal(index, { faixaEtaria })} options={(value.exploracao?.faixasEtarias ?? []).map((item) => ({ value: item, label: item }))} required disabled={disabled || !value.exploracao} />
                  <FloatSelect label="Raça" value={animal.raca} onChange={(raca) => atualizarAnimal(index, { raca })} options={(value.exploracao?.racas ?? []).map((item) => ({ value: item, label: item }))} required disabled={disabled || !value.exploracao} />
                  {value.tipoAtestado?.tiposInsumo.map((tipoInsumo) => (
                    <Field key={tipoInsumo} error={errors[`resultado-${index}-${tipoInsumo}`]}>
                      <FloatInput
                        label={`Resultado do ${tipoInsumo}`}
                        value={animal.resultados[tipoInsumo] ?? ""}
                        onChange={(resultado) =>
                          atualizarAnimal(index, {
                            resultados: { ...animal.resultados, [tipoInsumo]: resultado },
                          })
                        }
                        required
                        disabled={disabled}
                      />
                    </Field>
                  ))}
                  <div className="md:col-span-2">
                    <FloatInput label="Destino dos reagentes" value={animal.destinoReagentes} onChange={(destinoReagentes) => atualizarAnimal(index, { destinoReagentes })} maxLength={255} required disabled={disabled} />
                  </div>
                </div>
                <ErrorText>{errors[`animal-${index}`]}</ErrorText>
              </div>
            )}
          </DynamicListWrapper>
          <ErrorText>{errors.animais}</ErrorText>
        </div>
      </Section>

      {mode === "view" && (
        <Section title="Situação do Cadastro">
          <FloatInput label="Situação" value={value.situacao} disabled />
        </Section>
      )}
    </div>
  );
}
