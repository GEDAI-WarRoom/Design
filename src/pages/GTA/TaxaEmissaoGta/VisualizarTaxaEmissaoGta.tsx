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
    {
      label: "Data Início de Vigência",
      value: taxa.dataInicioVigencia,
    },
    {
      label: "Espécies",
      value: taxa.especies.map((item) => item.nome).join(", "),
    },
    {
      label: "Finalidades de Trânsito",
      value: taxa.finalidades.map((item) => item.nome).join(", "),
    },
    {
      label: "Papéis",
      value: taxa.papeis.map((item) => item.nome).join(", "),
    },
    {
      label: "Cobrança de Taxa",
      value: taxa.cobrancasTaxa.join(", "),
    },
    { label: "Tipo de Cobrança", value: taxa.tipoCobranca },
  ];

  if (
    taxa.tipoCobranca === "Por Cabeça" ||
    taxa.tipoCobranca === "Por Documento"
  ) {
    campos.push({
      label: `Item de Receita (cobrado por ${
        taxa.tipoCobranca === "Por Cabeça" ? "cabeça" : "documento"
      })`,
      value: taxa.itemReceita?.nome,
    });
  }

  if (taxa.tipoCobranca === "Por Lotes") {
    const label = taxa.tamanhoLote
      ? `Item de Receita (cobrado a cada ${taxa.tamanhoLote} animais)`
      : "Item de Receita (cobrado conforme o tamanho do lote informado)";
    campos.push(
      { label: "Tamanho dos lotes de animais", value: taxa.tamanhoLote },
      { label, value: taxa.itemReceitaLote?.nome },
    );
  }

  if (taxa.tipoCobranca === "Por Faixas") {
    const labelAte = rotuloItemReceitaFaixa(
      "ate",
      taxa.cobrancaAteLimite,
      taxa.limiteFaixa,
    );
    const labelAcima = rotuloItemReceitaFaixa(
      "acima",
      taxa.cobrancaAcimaLimite,
      taxa.limiteFaixa,
    );
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
      { label: labelAte, value: taxa.itemReceitaAteLimite?.nome },
      { label: labelAcima, value: taxa.itemReceitaAcimaLimite?.nome },
    );
  }

  return campos;
}

function rotuloItemReceitaFaixa(
  posicao: "ate" | "acima",
  modalidade: string,
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

export function VisualizarTaxaEmissaoGtaPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
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
        ativo
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

              <TaxaEmissaoGtaForm
                value={taxa}
                mode="view"
                fieldClassName={classeCampo}
              />
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
