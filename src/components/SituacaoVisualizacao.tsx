import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { FloatSelect } from "./ui/FormKit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui-1/alert-dialog";

type Situacao = "Ativo" | "Inativo" | "Suspenso" | "Gravada" | "Cancelada";
type ModoPagina = "visualizar" | "editar";

interface SituacaoVisualizacaoProps {
  currentScreen: string;
}

const TELAS_GERAIS = new Set([
  "acougue",
  "local-pesagem",
  "estabelecimento-generico",
  "aeroporto-porto",
  "classificacao-sanitaria-estado",
  "divisao-municipal",
  "doenca",
  "estabelecimento-agropecuario",
  "finalidade-transito",
  "taxa-emissao-gta",
  "instituicao-ensino-pesquisa",
  "pessoa-fisica",
  "pessoa-juridica",
  "produto",
  "profissional-oficial",
  "revendedora-agropecuario",
  "tipo-veiculo",
  "tipo-vacina",
  "unidade-administrativa",
  "unidade-medida",
  "venda-propriedade",
  "venda-entrada-insumos-exames",
  "venda-saida-insumo",
  "exploracao-agricola",
]);

/**
 * Acrescenta a ação de situação ao final das telas de visualização do
 * bloco Geral.
 *
 * As páginas ainda não compartilham um layout de detalhe. Por isso, este
 * componente é montado pela Navbar e usa um portal para manter a seção dentro
 * do <main> de cada tela, sem replicar a mesma regra em todos os cadastros.
 */
export function SituacaoVisualizacao({ currentScreen }: SituacaoVisualizacaoProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [situacao, setSituacao] = useState<Situacao>("Ativo");
  const [proximaSituacao, setProximaSituacao] = useState<Situacao | null>(null);
  const [modoPagina, setModoPagina] = useState<ModoPagina>("visualizar");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const main = document.querySelector<HTMLElement>("main[data-situacao-container]")
        ?? document.querySelector<HTMLElement>("main");
      const titulo = main?.querySelector("h1")?.textContent?.trim() || "";
      const ehTelaGeral = TELAS_GERAIS.has(currentScreen);
      const ehTelaDeVisualizacao = /^visualizar\b/i.test(titulo);
      const ehTelaDeEdicao = /^editar\b/i.test(titulo);

      if (!main || !ehTelaGeral || (!ehTelaDeVisualizacao && !ehTelaDeEdicao)) {
        setContainer(null);
        return;
      }

      const campoSituacao = Array.from(
        main.querySelectorAll<HTMLElement>("[data-form-control]"),
      ).find((campo) => /^situação$/i.test(campo.textContent?.trim() || ""));
      const valorAtual = main.dataset.situacao
        || main.querySelector<HTMLElement>("[data-current-situacao]")?.dataset.currentSituacao
        || campoSituacao?.querySelector<HTMLInputElement>("input")?.value;

      const ehVendaInsumo = ["venda-entrada-insumos-exames", "venda-saida-insumo"].includes(currentScreen);
      const situacaoInicial = ehVendaInsumo
        ? valorAtual === "Cancelada" ? "Cancelada" : "Gravada"
        : valorAtual === "Suspenso" ? "Suspenso" : valorAtual === "Inativo" ? "Inativo" : "Ativo";

      setSituacao(situacaoInicial);
      setProximaSituacao(null);
      setModoPagina(ehTelaDeEdicao ? "editar" : "visualizar");
      setContainer(main);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentScreen]);

  if (!container) return null;

  const confirmarAlteracao = () => {
    if (proximaSituacao) {
      setSituacao(proximaSituacao);
      window.dispatchEvent(new CustomEvent("situacao-cadastro-alterada", {
        detail: { currentScreen, situacao: proximaSituacao },
      }));
    }
    setProximaSituacao(null);
  };

  const ehVendaInsumo = ["venda-entrada-insumos-exames", "venda-saida-insumo"].includes(currentScreen);
  const permiteSuspensao = ["estabelecimento-agropecuario", "finalidade-transito", "exploracao-agricola"].includes(currentScreen);
  const tipoMovimentacao = currentScreen === "venda-saida-insumo" ? "saída" : "entrada";
  const opcoesSituacao = ehVendaInsumo
    ? [
        { value: "Gravada", label: "Gravada" },
        { value: "Cancelada", label: "Cancelada" },
      ]
    : [
        { value: "Ativo", label: "Ativo" },
        { value: "Inativo", label: "Inativo" },
        ...(permiteSuspensao ? [{ value: "Suspenso", label: "Suspenso" }] : []),
      ];
  const rotuloAcao = proximaSituacao === "Inativo"
    ? "Inativar"
    : proximaSituacao === "Suspenso"
      ? "Suspender"
    : proximaSituacao === "Ativo"
      ? "Ativar"
      : proximaSituacao === "Cancelada"
        ? "Cancelar"
        : "Gravar";

  return createPortal(
    <>
      <section
        aria-labelledby="titulo-situacao-visualizacao"
        className="mt-4 w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 id="titulo-situacao-visualizacao" className="text-base font-semibold text-gray-800">
            Situação
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 px-6 py-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] md:items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">Situação atual do cadastro</p>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              {modoPagina === "editar"
                ? "A mudança precisará ser confirmada antes de ser aplicada."
                : "A situação pode ser alterada na edição do cadastro."}
            </p>
          </div>

          <FloatSelect
            label="Situação"
            value={situacao}
            onChange={(valor) => {
              const novaSituacao = valor as Situacao;
              if (novaSituacao !== situacao) setProximaSituacao(novaSituacao);
            }}
            options={opcoesSituacao}
            disabled={modoPagina === "visualizar"}
          />
        </div>
      </section>

      <AlertDialog
        open={modoPagina === "editar" && proximaSituacao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setProximaSituacao(null);
        }}
      >
        <AlertDialogContent className="border-gray-200 bg-white text-center sm:max-w-md">
          <AlertDialogHeader className="items-center text-center sm:text-center">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={21} aria-hidden="true" />
            </div>
            <AlertDialogTitle>
              {proximaSituacao === "Cancelada"
                ? `Deseja cancelar a ${tipoMovimentacao} de insumo?`
                : proximaSituacao === "Gravada"
                    ? `Deseja gravar a ${tipoMovimentacao} de insumo?`
                    : proximaSituacao === "Inativo"
                      ? "Deseja inativar o cadastro?"
                      : proximaSituacao === "Suspenso"
                        ? "Deseja suspender o cadastro?"
                      : "Deseja ativar o cadastro?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Tem certeza de que deseja alterar a situação de {situacao.toLowerCase()} para{" "}
              <strong className="font-semibold text-gray-800">{proximaSituacao?.toLowerCase()}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center sm:justify-center">
            <AlertDialogCancel className="min-w-28 border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarAlteracao}
              className="min-w-28 bg-[#1A7A3C] text-white hover:bg-[#15612F]"
            >
              {rotuloAcao}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>,
    container,
  );
}
