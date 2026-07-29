import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { DynamicListWrapper } from "../../../components/ui/EntitySearch";
import {
  CustomButton,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  AtualizacaoHeaderCard,
  EtapasAtualizacaoRebanho,
  SomenteLeituraAviso,
} from "./AtualizacaoRebanhoComponents";
import {
  criarLancamentosVazios,
  obterAtualizacaoCadastral,
  obterItemAtualizacao,
  podeEditarAtualizacao,
  salvarAtualizacaoDoItem,
  type LancamentosRebanho,
} from "./atualizacaoCadastralRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: {
    atualizacaoId?: number;
    itemId?: number;
    modo?: "criar" | "editar";
  } | null;
}

const TITULOS_ETAPA = [
  {
    titulo: "Mortalidade",
    descricao: "Registre quantos animais vieram a óbito",
    coluna: "Mortalidade",
  },
  {
    titulo: "Evolução",
    descricao: "Informe os animais que avançaram para a faixa etária seguinte",
    coluna: "Evolução",
  },
  {
    titulo: "Nascimentos",
    descricao: "Informe os novos nascimentos de animais",
    coluna: "Nascimentos",
  },
  {
    titulo: "Relatório",
    descricao: "Resumo consolidado dos resultados",
    coluna: "",
  },
];

const LIMITE_MORTALIDADE_PERCENTUAL = 10;
const LIMITE_NATALIDADE_PERCENTUAL = 50;

function copiarLancamentos(value: LancamentosRebanho): LancamentosRebanho {
  return {
    ...value,
    mortalidadeMachos: [...value.mortalidadeMachos],
    mortalidadeFemeas: [...value.mortalidadeFemeas],
    evolucaoMachos: [...value.evolucaoMachos],
    evolucaoFemeas: [...value.evolucaoFemeas],
    nascimentoMachos: [...value.nascimentoMachos],
    nascimentoFemeas: [...value.nascimentoFemeas],
    documentosComprobatorios: [...value.documentosComprobatorios],
  };
}

function somar(valores: number[]) {
  return valores.reduce((total, valor) => total + valor, 0);
}

function calcularEvolucao(existentes: number[], entradas: number[]) {
  return existentes.map((existente, index) => {
    const entradaDaAnterior = index === 0 ? 0 : entradas[index] ?? 0;
    const saidaParaProxima =
      index === existentes.length - 1 ? 0 : entradas[index + 1] ?? 0;
    return existente + entradaDaAnterior - saidaParaProxima;
  });
}

function QuantityStepper({
  value,
  onChange,
  max,
  disabled,
  sexo,
  label,
  onLimite,
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
  sexo: "macho" | "femea";
  label: string;
  onLimite?: () => void;
}) {
  const alterar = (proximo: number) => {
    if (disabled) return;
    if (proximo > max) {
      onLimite?.();
      return;
    }
    onChange(Math.max(0, proximo));
  };

  return (
    <div
      className={`inline-flex items-center border border-gray-200 rounded-xl overflow-hidden h-9 ${
        disabled ? "bg-gray-50 opacity-60" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => alterar(value - 1)}
        disabled={disabled || value === 0}
        className="h-full w-8 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50"
        aria-label={`Diminuir ${label}`}
      >
        <Minus size={14} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={value}
        onChange={(event) =>
          alterar(Number(event.target.value.replace(/\D/g, "") || 0))
        }
        className={`w-11 h-full text-center text-sm font-semibold outline-none border-x border-gray-100 ${
          sexo === "macho" ? "text-[#0057ff]" : "text-[#d50062]"
        } disabled:bg-gray-50`}
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => alterar(value + 1)}
        disabled={disabled || value >= max}
        className="h-full w-8 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50"
        aria-label={`Aumentar ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function CardIndicador({
  titulo,
  valor,
  detalhe,
  progress,
}: {
  titulo: string;
  valor: string | number;
  detalhe?: string;
  progress?: number;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white min-h-[140px]">
      <p className="text-xs uppercase tracking-[0.12em] font-bold text-slate-500">
        {titulo}
      </p>
      <div className="flex items-end gap-2 mt-4">
        <strong className="text-4xl font-bold text-gray-950">{valor}</strong>
        {detalhe && <span className="text-sm text-slate-500 mb-1">{detalhe}</span>}
      </div>
      {progress !== undefined && (
        <div className="h-2 rounded-full bg-[#e6f1eb] mt-5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#008d4d]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function AtualizarCadastroRebanhoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const atualizacao = obterAtualizacaoCadastral(dados?.atualizacaoId);
  const item = obterItemAtualizacao(dados?.atualizacaoId, dados?.itemId);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [lancamentos, setLancamentos] = useState<LancamentosRebanho>(() => {
    if (!item) {
      return {
        mortalidadeMachos: [],
        mortalidadeFemeas: [],
        evolucaoMachos: [],
        evolucaoFemeas: [],
        nascimentoMachos: [],
        nascimentoFemeas: [],
        justificativaMortalidade: "",
        documentosComprobatorios: [],
      };
    }
    return copiarLancamentos(item.lancamentos ?? criarLancamentosVazios(item));
  });
  const [erroEtapa, setErroEtapa] = useState("");
  const [erroNatalidade, setErroNatalidade] = useState("");
  const [modalSalvar, setModalSalvar] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  const calculos = useMemo(() => {
    if (!item) {
      return {
        baseMachos: [],
        baseFemeas: [],
        aposMortalidadeMachos: [],
        aposMortalidadeFemeas: [],
        aposEvolucaoMachos: [],
        aposEvolucaoFemeas: [],
        resultadoMachos: [],
        resultadoFemeas: [],
      };
    }
    const baseMachos = item.rebanhoBase.map((faixa) => faixa.machos);
    const baseFemeas = item.rebanhoBase.map((faixa) => faixa.femeas);
    const aposMortalidadeMachos = baseMachos.map(
      (valor, index) => valor - (lancamentos.mortalidadeMachos[index] ?? 0),
    );
    const aposMortalidadeFemeas = baseFemeas.map(
      (valor, index) => valor - (lancamentos.mortalidadeFemeas[index] ?? 0),
    );
    const aposEvolucaoMachos = calcularEvolucao(
      aposMortalidadeMachos,
      lancamentos.evolucaoMachos,
    );
    const aposEvolucaoFemeas = calcularEvolucao(
      aposMortalidadeFemeas,
      lancamentos.evolucaoFemeas,
    );
    const resultadoMachos = aposEvolucaoMachos.map(
      (valor, index) => valor + (lancamentos.nascimentoMachos[index] ?? 0),
    );
    const resultadoFemeas = aposEvolucaoFemeas.map(
      (valor, index) => valor + (lancamentos.nascimentoFemeas[index] ?? 0),
    );

    return {
      baseMachos,
      baseFemeas,
      aposMortalidadeMachos,
      aposMortalidadeFemeas,
      aposEvolucaoMachos,
      aposEvolucaoFemeas,
      resultadoMachos,
      resultadoFemeas,
    };
  }, [item, lancamentos]);

  if (!atualizacao || !item) return null;

  const somenteLeitura = !podeEditarAtualizacao(atualizacao);
  const totalBase =
    somar(calculos.baseMachos) + somar(calculos.baseFemeas);
  const totalMortalidade =
    somar(lancamentos.mortalidadeMachos) +
    somar(lancamentos.mortalidadeFemeas);
  const taxaMortalidade =
    totalBase > 0 ? (totalMortalidade / totalBase) * 100 : 0;
  const mortalidadeIrregular =
    taxaMortalidade > LIMITE_MORTALIDADE_PERCENTUAL;
  const femeasReprodutivas =
    calculos.aposEvolucaoFemeas[calculos.aposEvolucaoFemeas.length - 1] ?? 0;
  const limiteNascimentos = Math.floor(
    femeasReprodutivas * (LIMITE_NATALIDADE_PERCENTUAL / 100),
  );
  const totalNascimentos =
    somar(lancamentos.nascimentoMachos) +
    somar(lancamentos.nascimentoFemeas);
  const totalFinal =
    somar(calculos.resultadoMachos) + somar(calculos.resultadoFemeas);
  const totalFinalMachos = somar(calculos.resultadoMachos);
  const totalFinalFemeas = somar(calculos.resultadoFemeas);
  const saldoMachos = totalFinalMachos - somar(calculos.baseMachos);
  const saldoFemeas = totalFinalFemeas - somar(calculos.baseFemeas);
  const taxaNatalidade =
    femeasReprodutivas > 0
      ? (totalNascimentos / femeasReprodutivas) * 100
      : 0;

  const atualizarArray = (
    campo:
      | "mortalidadeMachos"
      | "mortalidadeFemeas"
      | "evolucaoMachos"
      | "evolucaoFemeas"
      | "nascimentoMachos"
      | "nascimentoFemeas",
    index: number,
    valor: number,
  ) => {
    setErroEtapa("");
    setLancamentos((anterior) => ({
      ...anterior,
      [campo]: anterior[campo].map((itemValor, itemIndex) =>
        itemIndex === index ? valor : itemValor,
      ),
    }));
  };

  const restaurarEtapa = () => {
    const zeros = () => item.rebanhoBase.map(() => 0);
    if (etapaAtual === 0) {
      setLancamentos((anterior) => ({
        ...anterior,
        mortalidadeMachos: zeros(),
        mortalidadeFemeas: zeros(),
        justificativaMortalidade: "",
        documentosComprobatorios: [],
      }));
    } else if (etapaAtual === 1) {
      setLancamentos((anterior) => ({
        ...anterior,
        evolucaoMachos: zeros(),
        evolucaoFemeas: zeros(),
      }));
    } else if (etapaAtual === 2) {
      setLancamentos((anterior) => ({
        ...anterior,
        nascimentoMachos: zeros(),
        nascimentoFemeas: zeros(),
      }));
      setErroNatalidade("");
    }
    setErroEtapa("");
  };

  const avancar = () => {
    if (
      etapaAtual === 0 &&
      mortalidadeIrregular &&
      !lancamentos.justificativaMortalidade.trim()
    ) {
      setErroEtapa(
        "Informe a justificativa da mortalidade irregular para continuar.",
      );
      return;
    }
    setErroEtapa("");
    setEtapaAtual((valor) => Math.min(3, valor + 1));
  };

  const salvar = () => {
    const registro = salvarAtualizacaoDoItem(
      atualizacao.id,
      item.id,
      lancamentos,
    );
    if (!registro) return;
    setModalSalvar(false);
    setModalSucesso(true);
  };

  const renderTabelaEdicao = () => {
    const configuracao =
      etapaAtual === 0
        ? {
            existentesMachos: calculos.baseMachos,
            existentesFemeas: calculos.baseFemeas,
            informadosMachos: lancamentos.mortalidadeMachos,
            informadosFemeas: lancamentos.mortalidadeFemeas,
            resultadosMachos: calculos.aposMortalidadeMachos,
            resultadosFemeas: calculos.aposMortalidadeFemeas,
            campoMachos: "mortalidadeMachos" as const,
            campoFemeas: "mortalidadeFemeas" as const,
          }
        : etapaAtual === 1
          ? {
              existentesMachos: calculos.aposMortalidadeMachos,
              existentesFemeas: calculos.aposMortalidadeFemeas,
              informadosMachos: lancamentos.evolucaoMachos,
              informadosFemeas: lancamentos.evolucaoFemeas,
              resultadosMachos: calculos.aposEvolucaoMachos,
              resultadosFemeas: calculos.aposEvolucaoFemeas,
              campoMachos: "evolucaoMachos" as const,
              campoFemeas: "evolucaoFemeas" as const,
            }
          : {
              existentesMachos: calculos.aposEvolucaoMachos,
              existentesFemeas: calculos.aposEvolucaoFemeas,
              informadosMachos: lancamentos.nascimentoMachos,
              informadosFemeas: lancamentos.nascimentoFemeas,
              resultadosMachos: calculos.resultadoMachos,
              resultadosFemeas: calculos.resultadoFemeas,
              campoMachos: "nascimentoMachos" as const,
              campoFemeas: "nascimentoFemeas" as const,
            };

    const linhas =
      etapaAtual === 2 ? item.rebanhoBase.slice(0, 1) : item.rebanhoBase;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-y border-gray-200">
              <th
                rowSpan={2}
                className="px-4 py-3 border-r border-gray-200 text-xs uppercase tracking-wider text-slate-500"
              >
                Faixa Etária
              </th>
              <th
                colSpan={3}
                className="px-4 py-3 border-r border-gray-200 text-xs uppercase tracking-wider text-[#0057ff]"
              >
                Machos
              </th>
              <th
                colSpan={3}
                className="px-4 py-3 text-xs uppercase tracking-wider text-[#d50062]"
              >
                Fêmeas
              </th>
            </tr>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs text-slate-500">
              <th className="px-3 py-2">Existente</th>
              <th className="px-3 py-2">{TITULOS_ETAPA[etapaAtual].coluna}</th>
              <th className="px-3 py-2 border-r border-gray-200">Resultado</th>
              <th className="px-3 py-2">Existente</th>
              <th className="px-3 py-2">{TITULOS_ETAPA[etapaAtual].coluna}</th>
              <th className="px-3 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((faixa, index) => {
              const evolucaoBloqueada = etapaAtual === 1 && index === 0;
              const maxMacho =
                etapaAtual === 0
                  ? configuracao.existentesMachos[index]
                  : etapaAtual === 1
                    ? configuracao.existentesMachos[index - 1] ?? 0
                    : Math.max(
                        0,
                        limiteNascimentos -
                          (configuracao.informadosFemeas[0] ?? 0),
                      );
              const maxFemea =
                etapaAtual === 0
                  ? configuracao.existentesFemeas[index]
                  : etapaAtual === 1
                    ? configuracao.existentesFemeas[index - 1] ?? 0
                    : Math.max(
                        0,
                        limiteNascimentos -
                          (configuracao.informadosMachos[0] ?? 0),
                      );
              return (
                <tr key={faixa.faixa} className="border-b border-gray-100">
                  <th className="px-4 py-4 text-sm font-semibold text-slate-700 border-r border-gray-200">
                    {faixa.faixa}
                  </th>
                  <td className="px-3 py-4 text-center text-gray-600">
                    {configuracao.existentesMachos[index]}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <QuantityStepper
                      value={configuracao.informadosMachos[index] ?? 0}
                      onChange={(valor) =>
                        atualizarArray(configuracao.campoMachos, index, valor)
                      }
                      max={maxMacho}
                      disabled={somenteLeitura || evolucaoBloqueada}
                      sexo="macho"
                      label={`${TITULOS_ETAPA[etapaAtual].coluna} de machos em ${faixa.faixa}`}
                      onLimite={() =>
                        etapaAtual === 2 &&
                        setErroNatalidade(
                          `A natalidade não pode ultrapassar ${limiteNascimentos} animais, considerando ${LIMITE_NATALIDADE_PERCENTUAL}% das fêmeas em idade reprodutiva.`,
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-4 text-center text-gray-600 border-r border-gray-200">
                    {configuracao.resultadosMachos[index]}
                  </td>
                  <td className="px-3 py-4 text-center text-gray-600">
                    {configuracao.existentesFemeas[index]}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <QuantityStepper
                      value={configuracao.informadosFemeas[index] ?? 0}
                      onChange={(valor) =>
                        atualizarArray(configuracao.campoFemeas, index, valor)
                      }
                      max={maxFemea}
                      disabled={somenteLeitura || evolucaoBloqueada}
                      sexo="femea"
                      label={`${TITULOS_ETAPA[etapaAtual].coluna} de fêmeas em ${faixa.faixa}`}
                      onLimite={() =>
                        etapaAtual === 2 &&
                        setErroNatalidade(
                          `A natalidade não pode ultrapassar ${limiteNascimentos} animais, considerando ${LIMITE_NATALIDADE_PERCENTUAL}% das fêmeas em idade reprodutiva.`,
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-4 text-center text-gray-600">
                    {configuracao.resultadosFemeas[index]}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-gray-200 font-semibold">
              <th className="px-4 py-4 text-slate-700 border-r border-gray-200">
                Total
              </th>
              <td className="px-3 py-4 text-center">
                {somar(
                  etapaAtual === 2
                    ? configuracao.existentesMachos.slice(0, 1)
                    : configuracao.existentesMachos,
                )}
              </td>
              <td className="px-3 py-4 text-center text-[#0057ff]">
                {somar(configuracao.informadosMachos)}
              </td>
              <td className="px-3 py-4 text-center border-r border-gray-200">
                {somar(
                  etapaAtual === 2
                    ? configuracao.resultadosMachos.slice(0, 1)
                    : configuracao.resultadosMachos,
                )}
              </td>
              <td className="px-3 py-4 text-center">
                {somar(
                  etapaAtual === 2
                    ? configuracao.existentesFemeas.slice(0, 1)
                    : configuracao.existentesFemeas,
                )}
              </td>
              <td className="px-3 py-4 text-center text-[#d50062]">
                {somar(configuracao.informadosFemeas)}
              </td>
              <td className="px-3 py-4 text-center">
                {somar(
                  etapaAtual === 2
                    ? configuracao.resultadosFemeas.slice(0, 1)
                    : configuracao.resultadosFemeas,
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderRevisao = () => (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-slate-50 border-y border-gray-200">
              <th
                rowSpan={2}
                className="px-4 py-3 border-r border-gray-200 text-xs uppercase tracking-wider text-slate-500"
              >
                Faixa Etária
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 border-r border-gray-200 text-xs uppercase tracking-wider text-[#0057ff]"
              >
                Machos
              </th>
              <th
                colSpan={2}
                className="px-4 py-3 text-xs uppercase tracking-wider text-[#d50062]"
              >
                Fêmeas
              </th>
            </tr>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs text-slate-500">
              <th className="px-3 py-2">Existente</th>
              <th className="px-3 py-2 border-r border-gray-200">Resultado</th>
              <th className="px-3 py-2">Existente</th>
              <th className="px-3 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {item.rebanhoBase.map((faixa, index) => (
              <tr key={faixa.faixa} className="border-b border-gray-100">
                <th className="px-4 py-4 text-sm font-semibold text-slate-700 border-r border-gray-200">
                  {faixa.faixa}
                </th>
                <td className="px-3 py-4 text-center text-gray-600">
                  {calculos.baseMachos[index]}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-200">
                  {calculos.resultadoMachos[index]}
                </td>
                <td className="px-3 py-4 text-center text-gray-600">
                  {calculos.baseFemeas[index]}
                </td>
                <td className="px-3 py-4 text-center">
                  {calculos.resultadoFemeas[index]}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-semibold">
              <th className="px-4 py-4 border-r border-gray-200">Total</th>
              <td className="px-3 py-4 text-center">
                {somar(calculos.baseMachos)}
              </td>
              <td className="px-3 py-4 text-center text-[#0057ff] border-r border-gray-200">
                {totalFinalMachos}
              </td>
              <td className="px-3 py-4 text-center">
                {somar(calculos.baseFemeas)}
              </td>
              <td className="px-3 py-4 text-center text-[#d50062]">
                {totalFinalFemeas}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 md:p-7">
        <h3 className="text-lg font-semibold text-slate-800 mb-5">
          Relatório Detalhado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardIndicador
            titulo="Saldo Geral"
            valor={totalFinal}
            detalhe={`${totalFinal - totalBase >= 0 ? "+" : ""}${totalFinal - totalBase} cabeças`}
          />
          <CardIndicador
            titulo="Machos"
            valor={totalFinalMachos}
            detalhe={`${totalFinal > 0 ? Math.round((totalFinalMachos / totalFinal) * 100) : 0}% do total`}
            progress={totalFinal > 0 ? (totalFinalMachos / totalFinal) * 100 : 0}
          />
          <CardIndicador
            titulo="Fêmeas"
            valor={totalFinalFemeas}
            detalhe={`${totalFinal > 0 ? Math.round((totalFinalFemeas / totalFinal) * 100) : 0}% do total`}
            progress={totalFinal > 0 ? (totalFinalFemeas / totalFinal) * 100 : 0}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <CardIndicador
              titulo="Natalidade"
              valor={`${taxaNatalidade.toFixed(1)}%`}
            />
            <CardIndicador
              titulo="Mortalidade"
              valor={`${taxaMortalidade.toFixed(1)}%`}
            />
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-800">
              Saldo Machos
            </h4>
            <dl className="mt-5 text-sm space-y-3 text-slate-600">
              <div className="flex justify-between">
                <dt>Nascimentos</dt>
                <dd>{somar(lancamentos.nascimentoMachos)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Mortes</dt>
                <dd>{somar(lancamentos.mortalidadeMachos)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Evolução</dt>
                <dd>{somar(lancamentos.evolucaoMachos)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold">
                <dt>Saldo</dt>
                <dd>{saldoMachos}</dd>
              </div>
            </dl>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-800">
              Saldo Fêmeas
            </h4>
            <dl className="mt-5 text-sm space-y-3 text-slate-600">
              <div className="flex justify-between">
                <dt>Nascimentos</dt>
                <dd>{somar(lancamentos.nascimentoFemeas)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Mortes</dt>
                <dd>{somar(lancamentos.mortalidadeFemeas)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Evolução</dt>
                <dd>{somar(lancamentos.evolucaoFemeas)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold">
                <dt>Saldo</dt>
                <dd>{saldoFemeas}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const formula =
    etapaAtual === 0
      ? "Resultado = existente − mortalidade informada."
      : etapaAtual === 1
        ? "O valor informado entra na faixa atual e é debitado automaticamente da faixa imediatamente anterior."
        : etapaAtual === 2
          ? `Resultado = existente + nascimento. Limite parametrizado: ${limiteNascimentos} animais.`
          : "O relatório consolida mortalidade, evolução e nascimento por sexo e faixa etária.";

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="atualizacao-cadastral-rebanho"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-7">
        <div>
          <button
            type="button"
            onClick={() =>
              onNavigate("visualizar-atualizacao-cadastral-rebanho", {
                atualizacaoId: atualizacao.id,
              })
            }
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Todas Atualizações Cadastrais de Rebanho
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Atualização Cadastral de Rebanho
          </h1>
        </div>

        <AtualizacaoHeaderCard atualizacao={atualizacao} item={item} />
        <EtapasAtualizacaoRebanho etapaAtual={etapaAtual} />

        {somenteLeitura && <SomenteLeituraAviso />}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 md:px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-gray-700">
                {TITULOS_ETAPA[etapaAtual].titulo}
              </h2>
              <span className="text-gray-400">•</span>
              <p className="text-xs text-gray-500">
                {TITULOS_ETAPA[etapaAtual].descricao}
              </p>
            </div>
            {etapaAtual < 3 && !somenteLeitura && (
              <button
                type="button"
                onClick={restaurarEtapa}
                className="inline-flex items-center gap-2 text-sm text-[#1A7A3C] hover:underline"
              >
                <RotateCcw size={16} />
                Restaurar
              </button>
            )}
          </div>

          {etapaAtual < 3 ? renderTabelaEdicao() : renderRevisao()}

          <div className="mx-5 md:mx-7 my-5 flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600">
            <Info size={16} className="flex-shrink-0 text-[#1A7A3C]" />
            <span>{formula}</span>
          </div>

          {etapaAtual === 0 && mortalidadeIrregular && (
            <div className="mx-5 md:mx-7 mb-6 flex flex-col gap-5">
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <div>
                  <p className="font-semibold">Mortalidade fora da normalidade</p>
                  <p className="mt-1">
                    A taxa informada é de {taxaMortalidade.toFixed(1)}%, acima do
                    parâmetro de {LIMITE_MORTALIDADE_PERCENTUAL}%. Será gerado um
                    alerta para o estabelecimento e uma notificação ao produtor
                    titular, indicando possível fiscalização.
                  </p>
                </div>
              </div>

              <LargeTextArea
                label="Informe o porquê a atualização do rebanho está fora dos padrões estabelecidos pela portaria vigente"
                required
                value={lancamentos.justificativaMortalidade}
                onChange={(justificativaMortalidade) =>
                  setLancamentos((anterior) => ({
                    ...anterior,
                    justificativaMortalidade,
                  }))
                }
                disabled={somenteLeitura}
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Documentos Comprobatórios
                </h3>
                <DynamicListWrapper
                  items={lancamentos.documentosComprobatorios.map((nome, index) => ({
                    id: `documento-${index}`,
                    nome,
                  }))}
                  behavior="zero-or-more"
                  itemLabel="Documento Comprobatório"
                  addButtonLabel="Adicionar Documento"
                  disabled={somenteLeitura}
                  onAddItem={() =>
                    setLancamentos((anterior) => ({
                      ...anterior,
                      documentosComprobatorios: [
                        ...anterior.documentosComprobatorios,
                        "",
                      ],
                    }))
                  }
                  onRemoveItem={(index) =>
                    setLancamentos((anterior) => ({
                      ...anterior,
                      documentosComprobatorios:
                        anterior.documentosComprobatorios.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                    }))
                  }
                >
                  {(documento: { nome: string }, index: number) => (
                    <UploadField
                      label="Documento que justifique o problema"
                      fileName={documento.nome}
                      disabled={somenteLeitura}
                      onSelectFile={() =>
                        setLancamentos((anterior) => ({
                          ...anterior,
                          documentosComprobatorios:
                            anterior.documentosComprobatorios.map(
                              (nome, itemIndex) =>
                                itemIndex === index
                                  ? `comprovante_mortalidade_${index + 1}.pdf`
                                  : nome,
                            ),
                        }))
                      }
                    />
                  )}
                </DynamicListWrapper>
              </div>
            </div>
          )}

          {erroNatalidade && etapaAtual === 2 && (
            <p className="mx-5 md:mx-7 mb-5 text-sm font-medium text-red-500">
              {erroNatalidade}
            </p>
          )}
          {erroEtapa && (
            <p className="mx-5 md:mx-7 mb-5 text-sm font-medium text-red-500">
              {erroEtapa}
            </p>
          )}
        </section>

        <div className="flex justify-end gap-3">
          {etapaAtual > 0 && (
            <CustomButton
              variant="outlined"
              icon={<ArrowLeft size={18} />}
              onClick={() => {
                setErroEtapa("");
                setEtapaAtual((valor) => Math.max(0, valor - 1));
              }}
            >
              Voltar
            </CustomButton>
          )}
          {etapaAtual < 3 ? (
            <CustomButton icon={<ArrowRight size={18} />} onClick={avancar}>
              Avançar
            </CustomButton>
          ) : !somenteLeitura ? (
            <CustomButton
              icon={<ArrowRight size={18} />}
              onClick={() => setModalSalvar(true)}
            >
              Concluir
            </CustomButton>
          ) : null}
        </div>
      </main>

      {modalSalvar && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Salvar Atualização Cadastral de Rebanho
            </h2>
            <p className="text-sm text-gray-600 mt-8">
              Deseja salvar as alterações feitas no rebanho da{" "}
              {item.tipo} {item.codigo}?
            </p>
            <div className="flex justify-center gap-3 mt-8">
              <CustomButton
                variant="outlined"
                onClick={() => setModalSalvar(false)}
              >
                Cancelar
              </CustomButton>
              <CustomButton onClick={salvar}>Salvar</CustomButton>
            </div>
          </div>
        </div>
      )}

      {modalSucesso && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Rebanho atualizado com sucesso!
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Os dados da {item.tipo.toLowerCase()} {item.codigo} foram salvos.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <CustomButton
                variant="outlined"
                onClick={() =>
                  onNavigate("visualizar-atualizacao-cadastral-rebanho", {
                    atualizacaoId: atualizacao.id,
                  })
                }
              >
                Voltar
              </CustomButton>
              <CustomButton
                onClick={() =>
                  onNavigate("visualizar-rebanho-atualizado", {
                    atualizacaoId: atualizacao.id,
                    itemId: item.id,
                  })
                }
              >
                Visualizar
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
