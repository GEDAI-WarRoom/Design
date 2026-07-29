import React, { useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  RotateCcw,
} from "lucide-react";
import { EntitySearchInput, DynamicListWrapper } from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  calcularResultado,
  criarFaixas,
  ESTABELECIMENTOS_REBANHO_MOCK,
  EXPLORACOES_REBANHO_MOCK,
  NUCLEOS_REBANHO_MOCK,
  PRODUTORES_REBANHO_MOCK,
  tiposPermitidos,
  type EstabelecimentoRebanho,
  type ExploracaoRebanho,
  type FaixaLancamentoRebanho,
  type LancamentoPorTipo,
  type NucleoRebanho,
  type ProdutorRebanho,
  type SituacaoLancamentoRebanho,
  type TipoLancamentoRebanho,
} from "./lancamentoRebanhoData";

export interface LancamentoRebanhoFormValue {
  produtor: ProdutorRebanho | null;
  estabelecimento: EstabelecimentoRebanho | null;
  exploracao: ExploracaoRebanho | null;
  nucleo: NucleoRebanho | null;
  lancamentos: LancamentoPorTipo[];
  justificativaMortalidade: string;
  documentosMortalidade: string[];
  justificativaRoubo: string;
  documentoRoubo: string;
  situacao: SituacaoLancamentoRebanho;
  dataLancamento?: string;
}

interface FormProps {
  value: LancamentoRebanhoFormValue;
  onChange: (value: LancamentoRebanhoFormValue) => void;
  mode?: "create" | "view" | "edit";
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-t-2xl bg-gray-50 px-5 py-5 text-left transition hover:bg-gray-100"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {open && <div className="border-t border-gray-100 p-5">{children}</div>}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="flex-shrink-0 text-gray-500" />
      <p className="text-sm font-medium text-gray-600">
        Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

function EyeAction({ title }: { title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-md text-[#1A7A3C] transition hover:bg-green-50"
    >
      <Eye size={20} />
    </button>
  );
}

function RelationshipFields({
  value,
  onChange,
  disabled,
}: {
  value: LancamentoRebanhoFormValue;
  onChange: (value: LancamentoRebanhoFormValue) => void;
  disabled: boolean;
}) {
  const estabelecimentos = ESTABELECIMENTOS_REBANHO_MOCK.filter(
    (item) => !value.produtor || item.produtorIds.includes(value.produtor.id),
  );
  const exploracoes = EXPLORACOES_REBANHO_MOCK.filter(
    (item) =>
      (!value.produtor || item.produtorId === value.produtor.id) &&
      (!value.estabelecimento || item.estabelecimentoId === value.estabelecimento.id),
  );
  const nucleos = NUCLEOS_REBANHO_MOCK.filter(
    (item) => !value.exploracao || item.exploracaoId === value.exploracao.id,
  );

  const selecionarProdutor = (produtor: ProdutorRebanho) =>
    onChange({
      ...value,
      produtor,
      estabelecimento: null,
      exploracao: null,
      nucleo: null,
      lancamentos: [],
    });

  const selecionarEstabelecimento = (estabelecimento: EstabelecimentoRebanho) =>
    onChange({
      ...value,
      estabelecimento,
      exploracao: null,
      nucleo: null,
      lancamentos: [],
    });

  const selecionarExploracao = (exploracao: ExploracaoRebanho) =>
    onChange({
      ...value,
      exploracao,
      nucleo: null,
      lancamentos: [],
      justificativaMortalidade: "",
      documentosMortalidade: [],
      justificativaRoubo: "",
      documentoRoubo: "",
    });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {disabled ? (
          <FloatInput label="Produtor" value={value.produtor?.nome ?? ""} required disabled />
        ) : (
          <EntitySearchInput
            label="Produtor"
            placeholder="Buscar por nome, razão social, CPF ou CNPJ."
            required
            value={value.produtor?.nome ?? ""}
            data={PRODUTORES_REBANHO_MOCK}
            searchKeys={["nome", "documento"]}
            columns={[
              { label: "Nome / Razão Social", key: "nome" },
              { label: "CPF / CNPJ", key: "documento" },
            ]}
            icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
            title="Buscar Produtor"
            subtitle="Busque por uma pessoa física ou jurídica cadastrada como produtora:"
            onChange={selecionarProdutor}
          />
        )}
        {(disabled || value.produtor) && (
          <div className="flex gap-2">
            <div className="flex-1">
              <FloatInput
                label={value.produtor?.tipo === "PJ" ? "CNPJ" : "CPF"}
                value={value.produtor?.documento ?? ""}
                required
                disabled
              />
            </div>
            {value.produtor && <EyeAction title="Visualizar produtor" />}
          </div>
        )}
      </div>

      {(disabled || value.produtor) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {disabled ? (
            <FloatInput label="Estabelecimento Agropecuário" value={value.estabelecimento?.nome ?? ""} required disabled />
          ) : (
            <EntitySearchInput
              label="Estabelecimento Agropecuário"
              placeholder="Buscar por código, nome ou município."
              required
              value={value.estabelecimento?.nome ?? ""}
              data={estabelecimentos}
              searchKeys={["codigo", "nome", "municipio"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Nome", key: "nome" },
                { label: "Município", key: "municipio" },
              ]}
              icon={<img src={Icons.iconeEstabelecimentoUrl} alt="" className="h-5 w-5 object-contain" />}
              title="Buscar Estabelecimento Agropecuário"
              subtitle="Busque entre os estabelecimentos vinculados ao produtor selecionado:"
              onChange={selecionarEstabelecimento}
            />
          )}
          {(disabled || value.estabelecimento) && (
            <div className="flex gap-2">
              <div className="flex-1">
                <FloatInput
                  label="Código do Estabelecimento Agropecuário"
                  value={value.estabelecimento?.codigo ?? ""}
                  required
                  disabled
                />
              </div>
              {value.estabelecimento && <EyeAction title="Visualizar estabelecimento agropecuário" />}
            </div>
          )}
        </div>
      )}

      {(disabled || value.estabelecimento) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {disabled ? (
            <FloatInput label="Exploração Pecuária" value={value.exploracao?.codigo ?? ""} required disabled />
          ) : (
            <EntitySearchInput
              label="Exploração Pecuária"
              placeholder="Buscar pelo código da exploração."
              required
              value={value.exploracao?.codigo ?? ""}
              data={exploracoes}
              searchKeys={["codigo", "especie", "grupo"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Grupo", key: "grupo" },
                { label: "Espécie", key: "especie" },
              ]}
              icon={<img src={Icons.iconeExploracaoUrl} alt="" className="h-5 w-5 object-contain" />}
              title="Buscar Exploração Pecuária"
              subtitle="Busque entre as explorações do produtor no estabelecimento selecionado:"
              onChange={selecionarExploracao}
            />
          )}
          {(disabled || value.exploracao) && (
            <div className="flex gap-2">
              <div className="flex-1">
                <FloatInput label="Espécie" value={value.exploracao?.especie ?? ""} required disabled />
              </div>
              {value.exploracao && <EyeAction title="Visualizar exploração pecuária" />}
            </div>
          )}
        </div>
      )}

      {value.exploracao?.possuiNucleo && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {disabled ? (
            <FloatInput label="Núcleo de Produção" value={value.nucleo?.nome ?? ""} required disabled />
          ) : (
            <EntitySearchInput
              label="Núcleo de Produção"
              placeholder="Buscar por código ou nome."
              required
              value={value.nucleo?.nome ?? ""}
              data={nucleos}
              searchKeys={["codigo", "nome"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Nome", key: "nome" },
              ]}
              icon={<img src={Icons.iconeNucleoProducaoUrl} alt="" className="h-5 w-5 object-contain" />}
              title="Buscar Núcleo de Produção"
              subtitle="Busque entre os núcleos da exploração selecionada:"
              onChange={(nucleo) => onChange({ ...value, nucleo })}
            />
          )}
          {(disabled || value.nucleo) && (
            <div className="flex gap-2">
              <div className="flex-1">
                <FloatInput label="Código do Núcleo de Produção" value={value.nucleo?.codigo ?? ""} required disabled />
              </div>
              {value.nucleo && <EyeAction title="Visualizar núcleo de produção" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NumberStepper({
  value,
  disabled,
  onChange,
  ariaLabel,
  color,
}: {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
  ariaLabel: string;
  color: "blue" | "pink";
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const parsedVal = rawVal === "" ? 0 : parseInt(rawVal, 10);
    onChange(parsedVal);
  };

  return (
    <div className="mx-auto flex h-9 w-[100px] items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
      <button
        type="button"
        disabled={disabled || value === 0}
        aria-label={`Diminuir ${ariaLabel}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-full w-7 flex-shrink-0 items-center justify-center text-lg text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>

      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        aria-label={ariaLabel}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={handleInputChange}
        className={`w-full bg-transparent text-center text-sm font-bold focus:outline-none disabled:cursor-not-allowed ${
          color === "blue" ? "text-blue-600" : "text-pink-600"
        }`}
      />

      <button
        type="button"
        disabled={disabled}
        aria-label={`Aumentar ${ariaLabel}`}
        onClick={() => onChange(value + 1)}
        className="flex h-full w-7 flex-shrink-0 items-center justify-center text-lg text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

function ResultadoTooltipCell({
  tipo,
  existente,
  informado,
  resultado,
}: {
  tipo: TipoLancamentoRebanho;
  existente: number;
  informado: number;
  resultado: number;
}) {
  // Se não houve alteração informada, exibe apenas o valor simples do resultado
  if (!informado || informado === 0) {
    return (
      <span className="font-semibold text-slate-700">
        {resultado}
      </span>
    );
  }

  const operacoesSubtracao: TipoLancamentoRebanho[] = [
    "Mortalidade",
    "Roubo/Extravio",
    "Descarte",
  ];
  const ehSubtracao = operacoesSubtracao.includes(tipo);
  const sinal = ehSubtracao ? "-" : "+";

  return (
    <div className="group relative inline-flex items-center justify-center gap-1.5 cursor-help">
      {/* Valor do resultado */}
      <span className="font-semibold text-slate-700">
        {resultado}
      </span>

      {/* Ícone informativo exibido apenas quando há alteração */}
      <Info
        size={14}
        className="text-gray-400 transition-colors group-hover:text-[#1A7A3C]"
      />

      {/* Popover/Tooltip do resumo das alterações */}
      <div className="pointer-events-none absolute bottom-full mb-2 hidden w-48 flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-xl group-hover:flex z-50">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Info size={14} className="text-gray-400" />
          <span>Resumo Alterações</span>
        </div>

        {/* Expressão Matemática Ex: 18 - 18 = 0 */}
        <div className="mb-2 text-base font-bold text-gray-800">
          {existente} <span className="text-gray-400">{sinal}</span> {informado}{" "}
          <span className="text-gray-400">=</span> {resultado}
        </div>

        {/* Legenda inferior */}
        <div className="flex w-full justify-between text-[10px] font-semibold tracking-wider text-gray-400 uppercase border-t border-gray-100 pt-1.5">
          <span>INICIAL</span>
          <span>SALDO</span>
        </div>

        {/* Seta do tooltip */}
        <div className="absolute top-full -mt-[1px] border-4 border-transparent border-t-white" />
      </div>
    </div>
  );
}

function FaixasTable({
  lancamento,
  disabled,
  onChange,
}: {
  lancamento: LancamentoPorTipo;
  disabled: boolean;
  onChange: (faixas: FaixaLancamentoRebanho[]) => void;
}) {
  const update = (
    index: number,
    field: "machosInformados" | "femeasInformadas",
    novoValor: number,
  ) => {
    const faixas = lancamento.faixas.map((faixa, faixaIndex) => {
      if (faixaIndex !== index) return faixa;
      const maximo = field === "machosInformados" ? faixa.machosExistentes : faixa.femeasExistentes;
      const subtrai =
        lancamento.tipo === "Mortalidade" ||
        lancamento.tipo === "Roubo/Extravio" ||
        lancamento.tipo === "Descarte";
      return { ...faixa, [field]: subtrai ? Math.min(novoValor, maximo) : novoValor };
    });
    onChange(faixas);
  };

  const totais = lancamento.faixas.reduce(
    (acc, faixa, index) => ({
      machosExistentes: acc.machosExistentes + faixa.machosExistentes,
      machosInformados: acc.machosInformados + faixa.machosInformados,
      machosResultado:
        acc.machosResultado + calcularResultado(lancamento.tipo, lancamento.faixas, index, "machos"),
      femeasExistentes: acc.femeasExistentes + faixa.femeasExistentes,
      femeasInformadas: acc.femeasInformadas + faixa.femeasInformadas,
      femeasResultado:
        acc.femeasResultado + calcularResultado(lancamento.tipo, lancamento.faixas, index, "femeas"),
    }),
    {
      machosExistentes: 0,
      machosInformados: 0,
      machosResultado: 0,
      femeasExistentes: 0,
      femeasInformadas: 0,
      femeasResultado: 0,
    },
  );

  return (
    <div className="overflow-x-auto overflow-y-visible border-t border-gray-200">
      <table className="w-full min-w-[850px] border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
          <tr>
            <th rowSpan={2} className="w-[22%] border-b border-r border-gray-200 px-4 py-4 text-center">
              Faixa etária
            </th>
            <th colSpan={3} className="border-b border-r border-gray-200 px-4 py-3 text-center font-bold text-blue-600">
              Machos
            </th>
            <th colSpan={3} className="border-b border-gray-200 px-4 py-3 text-center font-bold text-pink-600">
              Fêmeas
            </th>
          </tr>
          <tr>
            {["Existente", lancamento.tipo, "Resultado", "Existente", lancamento.tipo, "Resultado"].map((label, index) => (
              <th key={`${label}-${index}`} className="border-b border-r border-gray-200 px-3 py-3 text-center normal-case last:border-r-0">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lancamento.faixas.map((faixa, index) => {
            const bloquearPrimeiraEvolucao = lancamento.tipo === "Evolução de Rebanho" && index === 0;
            const machosResultado = calcularResultado(lancamento.tipo, lancamento.faixas, index, "machos");
            const femeasResultado = calcularResultado(lancamento.tipo, lancamento.faixas, index, "femeas");

            return (
              <tr key={faixa.faixa} className="border-b border-gray-100 bg-white last:border-b-0">
                <td className="border-r border-gray-100 px-4 py-4 text-center font-semibold text-slate-700">{faixa.faixa}</td>

                <td className="border-r border-gray-100 px-3 py-4 text-center text-slate-600">{faixa.machosExistentes}</td>
                <td className="border-r border-gray-100 px-3 py-4 text-center">
                  <NumberStepper
                    value={faixa.machosInformados}
                    disabled={disabled || bloquearPrimeiraEvolucao}
                    ariaLabel={`${lancamento.tipo} de machos em ${faixa.faixa}`}
                    onChange={(novoValor) => update(index, "machosInformados", novoValor)}
                    color="blue"
                  />
                </td>
                <td className="border-r border-gray-100 px-3 py-4 text-center">
                  <ResultadoTooltipCell
                    tipo={lancamento.tipo}
                    existente={faixa.machosExistentes}
                    informado={faixa.machosInformados}
                    resultado={machosResultado}
                  />
                </td>

                <td className="border-r border-gray-100 px-3 py-4 text-center text-slate-600">{faixa.femeasExistentes}</td>
                <td className="border-r border-gray-100 px-3 py-4 text-center">
                  <NumberStepper
                    value={faixa.femeasInformadas}
                    disabled={disabled || bloquearPrimeiraEvolucao}
                    ariaLabel={`${lancamento.tipo} de fêmeas em ${faixa.faixa}`}
                    onChange={(novoValor) => update(index, "femeasInformadas", novoValor)}
                    color="pink"
                  />
                </td>
                <td className="px-3 py-4 text-center">
                  <ResultadoTooltipCell
                    tipo={lancamento.tipo}
                    existente={faixa.femeasExistentes}
                    informado={faixa.femeasInformadas}
                    resultado={femeasResultado}
                  />
                </td>
              </tr>
            );
          })}
          <tr className="bg-slate-50 font-semibold text-slate-600">
            <td className="border-r border-gray-200 px-4 py-4 text-center uppercase">Total</td>
            <td className="border-r border-gray-200 px-3 py-4 text-center">{totais.machosExistentes}</td>
            <td className="border-r border-gray-200 px-3 py-4 text-center font-bold text-blue-600">{totais.machosInformados}</td>
            <td className="border-r border-gray-200 px-3 py-4 text-center">{totais.machosResultado}</td>
            <td className="border-r border-gray-200 px-3 py-4 text-center">{totais.femeasExistentes}</td>
            <td className="border-r border-gray-200 px-3 py-4 text-center font-bold text-pink-600">{totais.femeasInformadas}</td>
            <td className="px-3 py-4 text-center">{totais.femeasResultado}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const TIPO_DESCRICOES: Record<TipoLancamentoRebanho, string> = {
  Mortalidade: "Registre quantos animais vieram a óbito",
  Nascimento: "Registre os animais nascidos na primeira faixa etária",
  "Evolução de Rebanho": "Transfira os animais entre faixas etárias subsequentes",
  "Roubo/Extravio": "Registre os animais roubados ou extraviados",
  Descarte: "Registre os animais descartados do rebanho",
  Adição: "Registre os animais adicionados ao rebanho",
};

export function LancamentoRebanhoForm({ value, onChange, mode = "create" }: FormProps) {
  const disabled = mode !== "create";
  const documentoRefs = useRef<Array<HTMLInputElement | null>>([]);
  const documentoRouboRef = useRef<HTMLInputElement>(null);
  const permitidos = tiposPermitidos(value.exploracao);
  const informacoesBasicasCompletas =
    Boolean(value.produtor && value.estabelecimento && value.exploracao) &&
    (!value.exploracao?.possuiNucleo || Boolean(value.nucleo));

  const atualizarTipo = (tipoSelecionado: string) => {
    if (!value.exploracao) return;
    const tipo = tipoSelecionado as TipoLancamentoRebanho;
    const existente = value.lancamentos.find((item) => item.tipo === tipo);
    const lancamentos: LancamentoPorTipo[] = tipo
      ? [
          existente ?? {
            tipo,
            faixas: criarFaixas(value.exploracao as ExploracaoRebanho, tipo),
          },
        ]
      : [];
    onChange({
      ...value,
      lancamentos,
      justificativaMortalidade: tipo === "Mortalidade" ? value.justificativaMortalidade : "",
      documentosMortalidade: tipo === "Mortalidade" ? value.documentosMortalidade : [],
      justificativaRoubo: tipo === "Roubo/Extravio" ? value.justificativaRoubo : "",
      documentoRoubo: tipo === "Roubo/Extravio" ? value.documentoRoubo : "",
    });
  };

  const reiniciar = () => {
    if (!value.exploracao) return;
    onChange({
      ...value,
      lancamentos: value.lancamentos.map((item) => ({
        ...item,
        faixas: criarFaixas(value.exploracao as ExploracaoRebanho, item.tipo),
      })),
    });
  };

  const mortalidade = value.lancamentos.find((item) => item.tipo === "Mortalidade");
  const totalExistente =
    mortalidade?.faixas.reduce(
      (total, faixa) => total + faixa.machosExistentes + faixa.femeasExistentes,
      0,
    ) ?? 0;
  const totalMortalidade =
    mortalidade?.faixas.reduce(
      (total, faixa) => total + faixa.machosInformados + faixa.femeasInformadas,
      0,
    ) ?? 0;
  const mortalidadeIrregular =
    Boolean(mortalidade) &&
    Boolean(value.exploracao) &&
    ["Bovino", "Bubalino"].includes(value.exploracao?.especie ?? "") &&
    totalExistente > 0 &&
    (totalMortalidade / totalExistente) * 100 > (value.exploracao?.limiteMortalidadePercentual ?? 100);

  return (
    <div className="flex flex-col gap-7">
      <Section title="Informações Básicas">
        <RelationshipFields value={value} onChange={onChange} disabled={disabled} />
      </Section>

      {(disabled || informacoesBasicasCompletas) && (
        <Section title="Informações de Lançamento">
          <div className="flex flex-col gap-5">
            <div className="max-w-sm">
              {disabled ? (
                <FloatInput
                  label="Tipo de Lançamento"
                  value={value.lancamentos[0]?.tipo ?? ""}
                  required
                  disabled
                />
              ) : (
                <FloatSelect
                  label="Tipo de Lançamento"
                  value={value.lancamentos[0]?.tipo ?? ""}
                  onChange={atualizarTipo}
                  required
                  options={permitidos.map((tipo) => ({ value: tipo, label: tipo }))}
                />
              )}
            </div>

            {value.lancamentos[0] && (
              <div className="overflow-visible rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 px-7 py-5 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-slate-700">{value.lancamentos[0].tipo}</h3>
                    <span className="text-xs text-slate-400">●</span>
                    <span className="text-xs text-slate-500">
                      {TIPO_DESCRICOES[value.lancamentos[0].tipo]}
                    </span>
                  </div>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={reiniciar}
                      className="flex items-center gap-2 self-start text-sm font-medium text-[#1A7A3C] transition hover:text-[#15612F] sm:self-auto"
                    >
                      <RotateCcw size={17} /> Restaurar
                    </button>
                  )}
                </div>
                <FaixasTable
                  lancamento={value.lancamentos[0]}
                  disabled={disabled}
                  onChange={(faixas) =>
                    onChange({
                      ...value,
                      lancamentos: [{ ...value.lancamentos[0], faixas }],
                    })
                  }
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {mortalidade && (
        <Section title="Justificativa de Mortalidade Irregular">
          <div className="flex flex-col gap-6">
            {mortalidadeIrregular && (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                <p>
                  A mortalidade informada está acima do limite configurado para esta exploração. Informe a justificativa; o produtor ficará sujeito à notificação e fiscalização.
                </p>
              </div>
            )}
            <LargeTextArea
              label="Justificativa"
              value={value.justificativaMortalidade}
              onChange={(justificativaMortalidade) => onChange({ ...value, justificativaMortalidade })}
              disabled={disabled}
              maxLength={1500}
              hasTooltip
              tooltipText="Informe por que a atualização do rebanho está fora dos padrões estabelecidos."
            />
            <div className="border-t border-gray-100 pt-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-800">Documentos Comprobatórios</h3>
              <DynamicListWrapper
                items={value.documentosMortalidade.map((nome, index) => ({ id: `${index}-${nome}`, nome }))}
                behavior="zero-or-more"
                addButtonLabel="Adicionar documento"
                itemLabel="Documento"
                variant="plain"
                disabled={disabled}
                onAddItem={() => onChange({ ...value, documentosMortalidade: [...value.documentosMortalidade, ""] })}
                onRemoveItem={(index) =>
                  onChange({
                    ...value,
                    documentosMortalidade: value.documentosMortalidade.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
              >
                {(documento, index) => (
                  <div className="w-full">
                    <input
                      ref={(element) => {
                        documentoRefs.current[index] = element;
                      }}
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(event) => {
                        const nome = event.target.files?.[0]?.name ?? "";
                        const documentosMortalidade = [...value.documentosMortalidade];
                        documentosMortalidade[index] = nome;
                        onChange({ ...value, documentosMortalidade });
                      }}
                    />
                    <UploadField
                      label="Documento Comprobatório"
                      fileName={documento.nome}
                      disabled={disabled}
                      onSelectFile={() => documentoRefs.current[index]?.click()}
                    />
                  </div>
                )}
              </DynamicListWrapper>
            </div>
          </div>
        </Section>
      )}

      {value.lancamentos.some((item) => item.tipo === "Roubo/Extravio") && (
        <Section title="Justificativa de Roubo / Extravio">
          <div className="flex flex-col gap-5">
            <LargeTextArea
              label="Justificativa"
              value={value.justificativaRoubo}
              onChange={(justificativaRoubo) => onChange({ ...value, justificativaRoubo })}
              disabled={disabled}
              maxLength={1500}
              hasTooltip
              tooltipText="Informe detalhes sobre a situação ocorrida."
            />
            <input
              ref={documentoRouboRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              className="hidden"
              onChange={(event) =>
                onChange({ ...value, documentoRoubo: event.target.files?.[0]?.name ?? "" })
              }
            />
            <UploadField
              label="Documento Comprobatório"
              fileName={value.documentoRoubo}
              disabled={disabled}
              onSelectFile={() => documentoRouboRef.current?.click()}
            />
          </div>
        </Section>
      )}

      {mode === "view" && (
        <Section title="Situação do Cadastro">
          <FloatInput label="Situação" value={value.situacao} disabled />
        </Section>
      )}
    </div>
  );
}