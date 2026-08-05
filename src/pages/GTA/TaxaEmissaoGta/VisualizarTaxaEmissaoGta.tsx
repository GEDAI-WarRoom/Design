import { useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
} from "../../../components/ui/HistoricoCadastroLayout";
import { TaxaEmissaoGtaForm } from "./TaxaEmissaoGtaForm";
import {
  TAXAS_POR_FINALIDADE_MOCK,
  obterHistoricoTaxaEmissaoGta,
  obterTaxaEmissaoGta,
  type TaxaEmissaoGta,
} from "./taxaEmissaoGtaData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: Partial<TaxaEmissaoGta> | null;
}

function camposComparaveis(taxa: TaxaEmissaoGta): CampoHistoricoComparavel[] {
  const campos: CampoHistoricoComparavel[] = [
    {
      label: "Tipo de Documento Sanitário",
      value: taxa.tipoDocumentoSanitario,
    },
    { label: "Espécie", value: taxa.especie.nome },
    { label: "Data Início de Vigência", value: taxa.dataInicioVigencia },
    { label: "Tipo de Cobrança", value: taxa.tipoCobranca },
  ];

  if (
    taxa.tipoCobranca === "Por Cabeça" ||
    taxa.tipoCobranca === "Por Documento"
  ) {
    const label = `Item de Receita (cobrado por ${
      taxa.tipoCobranca === "Por Cabeça" ? "cabeça" : "documento"
    })`;
    campos.push(
      { label, value: taxa.itemReceita?.nome },
      {
        label: `${label} - Quantidade do Índice`,
        value: taxa.itemReceita?.quantidadeIndice,
      },
    );
  }

  if (taxa.tipoCobranca === "Por Lotes") {
    const label = taxa.tamanhoLote
      ? `Item de Receita (cobrado a cada ${taxa.tamanhoLote} animais)`
      : "Item de Receita (cobrado por lote)";
    campos.push(
      { label: "Tamanho dos lotes de animais", value: taxa.tamanhoLote },
      { label, value: taxa.itemReceitaLote?.nome },
      {
        label: `${label} - Quantidade do Índice`,
        value: taxa.itemReceitaLote?.quantidadeIndice,
      },
    );
  }

  if (taxa.tipoCobranca === "Por Faixas") {
    campos.push(
      {
        label: "Limite de animais entre as faixas",
        value: taxa.limiteFaixa,
      },
      { label: "Cobrança até o limite", value: taxa.cobrancaAteLimite },
      {
        label: "Cobrança acima do limite",
        value: taxa.cobrancaAcimaLimite,
      },
    );

    const labelAte = `Item de Receita (${modalidadeEmMinusculo(
      taxa.cobrancaAteLimite,
    )} até ${taxa.limiteFaixa || "[Limite]"} animais)`;
    const labelAcima = `Item de Receita (${modalidadeEmMinusculo(
      taxa.cobrancaAcimaLimite,
    )} acima de ${taxa.limiteFaixa || "[Limite]"} animais)`;
    campos.push(
      { label: labelAte, value: taxa.itemReceitaAteLimite?.nome },
      {
        label: `${labelAte} - Quantidade do Índice`,
        value: taxa.itemReceitaAteLimite?.quantidadeIndice,
      },
      { label: labelAcima, value: taxa.itemReceitaAcimaLimite?.nome },
      {
        label: `${labelAcima} - Quantidade do Índice`,
        value: taxa.itemReceitaAcimaLimite?.quantidadeIndice,
      },
    );
  }

  return campos;
}

function modalidadeEmMinusculo(modalidade: string) {
  if (!modalidade) return "cobrado por [Cabeça | Documento]";
  return modalidade.replace("Cobrar", "cobrado");
}

function TaxasPorFinalidadeTab() {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {[
                "Tipo de Procedência",
                "Tipo de Finalidade",
                "Cobra taxa para dentro do Estado?",
                "Cobra taxa para fora do Estado?",
                "Contribuição ao fundo privado?",
                "Tipo de Cobrança",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-left font-semibold text-gray-600"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {TAXAS_POR_FINALIDADE_MOCK.map((item) => (
              <tr
                key={`${item.tipoProcedencia}-${item.tipoFinalidade}`}
                className="hover:bg-gray-50/50"
              >
                <td className="px-4 py-4 text-gray-700">
                  {item.tipoProcedencia}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {item.tipoFinalidade}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {item.cobraDentroEstado}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {item.cobraForaEstado}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {item.contribuicaoFundoPrivado}
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {item.tipoCobranca}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function VisualizarTaxaEmissaoGtaPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const [aba, setAba] = useState<"taxa" | "finalidade">("taxa");
  const taxaAtual = obterTaxaEmissaoGta(dados);
  const historico = obterHistoricoTaxaEmissaoGta(taxaAtual);
  const camposAtuais = camposComparaveis(taxaAtual);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="taxa-emissao-gta"
        hideSearch
      />

      <HistoricoCadastroLayout<TaxaEmissaoGta>
        itens={historico}
        resetKey={taxaAtual.id}
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
      >
        {({
          botaoHistorico,
          avisoVersao,
          dadosSelecionados,
          visualizandoVersaoAntiga,
        }) => {
          const taxa = dadosSelecionados ?? taxaAtual;
          const classeCampo = (label: string, value: unknown) =>
            campoHistoricoFoiAlterado(
              { label, value },
              camposAtuais,
              visualizandoVersaoAntiga,
            )
              ? CLASSE_CAMPO_ALTERADO_HISTORICO
              : "";

          return (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate("taxa-emissao-gta")}
                  className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"
                >
                  <ArrowLeft size={15} /> Todas as Taxas de Emissão de
                  Documento Sanitário
                </button>
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Visualizar Taxa de Emissão de Documento Sanitário
                  </h1>
                  <div className="flex items-center gap-3">
                    {botaoHistorico}
                    {!visualizandoVersaoAntiga && (
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate("editar-taxa-emissao-gta", taxaAtual)
                        }
                        className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <div className="flex gap-6 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setAba("taxa")}
                  className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${
                    aba === "taxa"
                      ? "border-[#1A7A3C] text-[#1A7A3C]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Informações da Taxa
                </button>
                <button
                  type="button"
                  onClick={() => setAba("finalidade")}
                  className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${
                    aba === "finalidade"
                      ? "border-[#1A7A3C] text-[#1A7A3C]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Taxas por Finalidade
                </button>
              </div>

              {aba === "taxa" ? (
                <TaxaEmissaoGtaForm
                  value={taxa}
                  mode="view"
                  fieldClassName={classeCampo}
                />
              ) : (
                <TaxasPorFinalidadeTab />
              )}
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
