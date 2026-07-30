import { useMemo, useState } from "react";
import { ArrowLeft, ChevronUp, Minus, Plus, TrendingUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { LargeTextArea } from "../../../components/ui/FormKit";
import {
  AtualizacaoHeaderCard,
  EtapasAtualizacaoRebanho,
} from "./AtualizacaoRebanhoComponents";
import {
  criarLancamentosVazios,
  obterAtualizacaoCadastral,
  obterItemAtualizacao,
  podeEditarAtualizacao,
} from "./atualizacaoCadastralRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: { atualizacaoId?: number; itemId?: number } | null;
}

function somar(valores: number[]) {
  return valores.reduce((total, valor) => total + valor, 0);
}

function calcularEvolucao(existentes: number[], entradas: number[]) {
  return existentes.map((existente, index) => {
    const entrada = index === 0 ? 0 : entradas[index] ?? 0;
    const saida =
      index === existentes.length - 1 ? 0 : entradas[index + 1] ?? 0;
    return existente + entrada - saida;
  });
}

function Indicador({
  titulo,
  valor,
  detalhe,
  progress,
  tendencia,
  subtitulo,
  centralizado = false,
}: {
  titulo: string;
  valor: string | number;
  detalhe?: string;
  progress?: number;
  tendencia?: string;
  subtitulo?: string;
  centralizado?: boolean;
}) {
  return (
    <div className={`border border-gray-200 rounded-xl p-6 bg-white min-h-[130px] flex flex-col ${centralizado ? "items-center justify-center text-center" : ""}`}>
      <p className="text-xs uppercase tracking-[0.12em] font-bold text-slate-500">
        {titulo}
      </p>

      {centralizado ? (
        <strong className="text-3xl font-bold text-gray-900 mt-3">{valor}</strong>
      ) : (
        <>
          <div className="flex items-end gap-2 mt-3">
            <strong className="text-4xl font-bold text-gray-900 leading-none">{valor}</strong>

            {tendencia && (
              <span className="inline-flex items-center gap-0.5 text-sm font-bold text-[#008d4d] mb-0.5">
                <TrendingUp size={15} strokeWidth={2.5} />
                {tendencia}
              </span>
            )}

            {detalhe && !tendencia && (
              <span className="inline-flex items-center gap-0.5 text-sm text-slate-500 mb-1">
                <ChevronUp size={14} className="text-slate-400" />
                {detalhe}
              </span>
            )}
          </div>

          {subtitulo && (
            <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400 mt-2">
              {subtitulo}
            </p>
          )}
        </>
      )}

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

export function VisualizarRebanhoAtualizadoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const atualizacao = obterAtualizacaoCadastral(dados?.atualizacaoId);
  const item = obterItemAtualizacao(dados?.atualizacaoId, dados?.itemId);
  const [relatorioAberto, setRelatorioAberto] = useState(true);

  const calculos = useMemo(() => {
    if (!item) return null;
    const lancamentos = item.lancamentos ?? criarLancamentosVazios(item);
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
      lancamentos,
      baseMachos,
      baseFemeas,
      resultadoMachos,
      resultadoFemeas,
    };
  }, [item]);

  if (!atualizacao || !item || !calculos) return null;

  const totalBase =
    somar(calculos.baseMachos) + somar(calculos.baseFemeas);
  const totalMachos = somar(calculos.resultadoMachos);
  const totalFemeas = somar(calculos.resultadoFemeas);
  const totalFinal = totalMachos + totalFemeas;
  const nascimentosMachos = somar(calculos.lancamentos.nascimentoMachos);
  const nascimentosFemeas = somar(calculos.lancamentos.nascimentoFemeas);
  const mortesMachos = somar(calculos.lancamentos.mortalidadeMachos);
  const mortesFemeas = somar(calculos.lancamentos.mortalidadeFemeas);
  const femeasReprodutivas =
    calculos.baseFemeas[calculos.baseFemeas.length - 1] ?? 0;
  const natalidade =
    femeasReprodutivas > 0
      ? ((nascimentosMachos + nascimentosFemeas) / femeasReprodutivas) * 100
      : 0;
  const mortalidade =
    totalBase > 0 ? ((mortesMachos + mortesFemeas) / totalBase) * 100 : 0;

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
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Atualização Cadastral de Rebanho
            </h1>
            {podeEditarAtualizacao(atualizacao) && (
              <button
                type="button"
                onClick={() =>
                  onNavigate("atualizar-cadastro-rebanho", {
                    atualizacaoId: atualizacao.id,
                    itemId: item.id,
                    modo: "editar",
                  })
                }
                className="px-5 h-10 text-sm font-semibold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F]"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <AtualizacaoHeaderCard atualizacao={atualizacao} item={item} />
        <EtapasAtualizacaoRebanho etapaAtual={3} concluidas />

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-700">Relatório</h2>
            <span className="text-gray-400">•</span>
            <p className="text-xs text-gray-500">
              Resumo consolidado dos resultados
            </p>
          </div>
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
                    <td className="px-3 py-4 text-center">
                      {calculos.baseMachos[index]}
                    </td>
                    <td className="px-3 py-4 text-center border-r border-gray-200">
                      {calculos.resultadoMachos[index]}
                    </td>
                    <td className="px-3 py-4 text-center">
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
                    {totalMachos}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {somar(calculos.baseFemeas)}
                  </td>
                  <td className="px-3 py-4 text-center text-[#d50062]">
                    {totalFemeas}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="bg-[#f7f8fa] border border-gray-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setRelatorioAberto((valor) => !valor)}
            className="w-full flex items-center gap-2 p-5 md:px-7 text-left"
          >
            {relatorioAberto ? (
              <Minus size={18} className="text-[#1A7A3C]" />
            ) : (
              <Plus size={18} className="text-[#1A7A3C]" />
            )}
            <span className="text-sm font-semibold text-[#1A7A3C]">
              {relatorioAberto ? "Ocultar Relatório" : "Mostrar Relatório"}
            </span>
          </button>

          {relatorioAberto && (
            <div className="px-5 pb-5 md:px-7 md:pb-7">
              <h3 className="text-lg font-bold text-slate-800 mb-5">
                Relatório Detalhado
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Indicador
                  titulo="Saldo Geral"
                  valor={totalFinal}
                  tendencia={`${totalFinal - totalBase >= 0 ? "+" : ""}${totalBase > 0 ? (((totalFinal - totalBase) / totalBase) * 100).toFixed(1) : "0.0"}%`}
                  subtitulo="Cabeças Totais"
                />
                <Indicador
                  titulo="Machos"
                  valor={totalMachos}
                  detalhe={`${totalFinal ? Math.round((totalMachos / totalFinal) * 100) : 0}% do total`}
                  progress={totalFinal ? (totalMachos / totalFinal) * 100 : 0}
                />
                <Indicador
                  titulo="Fêmeas"
                  valor={totalFemeas}
                  detalhe={`${totalFinal ? Math.round((totalFemeas / totalFinal) * 100) : 0}% do total`}
                  progress={totalFinal ? (totalFemeas / totalFinal) * 100 : 0}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="grid gap-4">
                  <Indicador
                    titulo="Natalidade"
                    valor={`${natalidade.toFixed(1)}%`}
                    centralizado
                  />
                  <Indicador
                    titulo="Mortalidade"
                    valor={`${mortalidade.toFixed(1)}%`}
                    centralizado
                  />
                </div>
                {[
                  {
                    titulo: "Saldo Machos",
                    nascimentos: nascimentosMachos,
                    mortes: mortesMachos,
                    evolucao: somar(calculos.lancamentos.evolucaoMachos),
                    saldo: totalMachos - somar(calculos.baseMachos),
                  },
                  {
                    titulo: "Saldo Fêmeas",
                    nascimentos: nascimentosFemeas,
                    mortes: mortesFemeas,
                    evolucao: somar(calculos.lancamentos.evolucaoFemeas),
                    saldo: totalFemeas - somar(calculos.baseFemeas),
                  },
                ].map((saldo) => (
                  <div
                    key={saldo.titulo}
                    className="border border-gray-200 rounded-xl p-6 bg-white"
                  >
                    <h3 className="text-xs uppercase tracking-wider font-bold text-gray-800">
                      {saldo.titulo}
                    </h3>
                    <dl className="mt-5 text-sm space-y-3 text-slate-600">
                      <div className="flex justify-between">
                        <dt>Nascimentos</dt>
                        <dd>{saldo.nascimentos}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Mortes</dt>
                        <dd>{saldo.mortes}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Evolução</dt>
                        <dd>{saldo.evolucao}</dd>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-gray-900">
                        <dt>Saldo</dt>
                        <dd>{saldo.saldo}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {calculos.lancamentos.justificativaMortalidade && (
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              Justificativa de Mortalidade Irregular
            </h2>
            <LargeTextArea
              label="Justificativa"
              value={calculos.lancamentos.justificativaMortalidade}
              onChange={() => {}}
              disabled
            />
            {calculos.lancamentos.documentosComprobatorios.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Documentos Comprobatórios
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {calculos.lancamentos.documentosComprobatorios.map(
                    (documento) => (
                      <li
                        key={documento}
                        className="border border-gray-200 rounded-md px-4 py-3"
                      >
                        {documento}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}