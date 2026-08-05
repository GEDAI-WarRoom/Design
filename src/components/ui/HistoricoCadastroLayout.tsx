import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BotaoHistoricoCadastros,
  HistoricoCadastrosSidebar,
  type ContextoAutorHistoricoCadastro,
  type HistoricoCadastroItem,
} from "./HistoricoCadastrosSidebar";

export type { HistoricoCadastroItem } from "./HistoricoCadastrosSidebar";

export const CLASSE_CAMPO_ALTERADO_HISTORICO =
  "!border-amber-400 ring-1 ring-amber-200/70";

export interface CampoHistoricoComparavel {
  label: string;
  value: unknown;
}

export function campoHistoricoFoiAlterado(
  campo: CampoHistoricoComparavel | unknown,
  camposAtuais: CampoHistoricoComparavel[] | unknown,
  visualizandoVersaoAntiga: boolean,
) {
  if (!visualizandoVersaoAntiga) return false;
  if (
    !campo ||
    typeof campo !== "object" ||
    !("label" in campo) ||
    !Array.isArray(camposAtuais)
  ) {
    return String(campo ?? "").trim() !== String(camposAtuais ?? "").trim();
  }
  const campoAtual = camposAtuais.find((item) => item.label === campo.label);
  return Boolean(
    campoAtual &&
    String(campoAtual.value ?? "").trim() !== String(campo.value ?? "").trim()
  );
}

export interface HistoricoCadastroContexto<TDados> {
  avisoVersao: ReactNode;
  botaoHistorico: ReactNode;
  dadosSelecionados?: TDados;
  fecharHistorico: () => void;
  historicoAberto: boolean;
  selecionarVersao: (item: HistoricoCadastroItem<TDados>) => void;
  versaoAtual?: HistoricoCadastroItem<TDados>;
  versaoSelecionada?: HistoricoCadastroItem<TDados>;
  visualizandoVersaoAntiga: boolean;
}

export interface HistoricoCadastroLayoutProps<TDados> {
  ativo?: boolean;
  children: (contexto: HistoricoCadastroContexto<TDados>) => ReactNode;
  conteudoClassName?: string;
  descricaoHistorico?: string;
  descricaoVersaoAntiga?: ReactNode;
  deslocamentoTopoSidebar?: number;
  itens?: HistoricoCadastroItem<TDados>[];
  larguraMaximaConteudo?: number;
  larguraSidebar?: number;
  onVisualizarAutor?: (
    nome: string,
    contexto: ContextoAutorHistoricoCadastro<TDados>,
  ) => void;
  resetKey?: string | number;
  tituloHistorico?: string;
}

export function HistoricoCadastroLayout<TDados = unknown>({
  ativo = true,
  children,
  conteudoClassName = "",
  descricaoHistorico,
  descricaoVersaoAntiga = "Os campos com borda amarela possuem valores diferentes na versão atual.",
  deslocamentoTopoSidebar = 64,
  itens,
  larguraMaximaConteudo = 1088,
  larguraSidebar = 390,
  onVisualizarAutor,
  resetKey,
  tituloHistorico,
}: HistoricoCadastroLayoutProps<TDados>) {
  const reduzirMovimento = useReducedMotion();
  const versaoAtual = itens?.find((item) => item.atual) ?? itens?.[0];
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [versaoSelecionadaId, setVersaoSelecionadaId] = useState<
    string | number | undefined
  >(versaoAtual?.id);

  const versaoSelecionada = itens?.find(
    (item) => item.id === versaoSelecionadaId,
  );
  const visualizandoVersaoAntiga = Boolean(
    versaoSelecionada && versaoSelecionada.id !== versaoAtual?.id,
  );
  const sidebarVisivel = Boolean(itens && ativo && historicoAberto);

  useEffect(() => {
    if (!ativo) {
      setVersaoSelecionadaId(versaoAtual?.id);
      setHistoricoAberto(false);
    }
  }, [ativo, versaoAtual?.id]);

  useEffect(() => {
    setVersaoSelecionadaId(versaoAtual?.id);
    setHistoricoAberto(false);
  }, [resetKey]);

  useEffect(() => {
    setVersaoSelecionadaId(versaoAtual?.id);
  }, [versaoAtual?.id]);

  useEffect(() => {
    if (
      versaoSelecionadaId !== undefined &&
      !itens?.some((item) => item.id === versaoSelecionadaId)
    ) {
      setVersaoSelecionadaId(versaoAtual?.id);
    }
  }, [itens, versaoAtual?.id, versaoSelecionadaId]);

  const selecionarVersao = (item: HistoricoCadastroItem<TDados>) => {
    setVersaoSelecionadaId(item.id);
  };

  const fecharHistorico = () => setHistoricoAberto(false);

  const botaoHistorico = itens && ativo ? (
    <BotaoHistoricoCadastros
      aberto={historicoAberto}
      onClick={() => setHistoricoAberto((aberto) => !aberto)}
    />
  ) : null;

  const avisoVersao = (
    <AnimatePresence initial={false}>
      {ativo && visualizandoVersaoAntiga && versaoSelecionada && (
        <motion.div
          key="aviso-versao-antiga"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={
            reduzirMovimento
              ? { duration: 0 }
              : {
                  height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.22, ease: "easeOut" },
                }
          }
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-900">
              Visualizando a versão de{" "}
              <strong>
                {versaoSelecionada.data}
                {versaoSelecionada.hora ? ` às ${versaoSelecionada.hora}` : ""}
              </strong>
              .
            </p>
            {descricaoVersaoAntiga && (
              <p className="mt-1 text-xs leading-5 text-amber-800">
                {descricaoVersaoAntiga}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const larguraConteudo = sidebarVisivel
    ? `min(${larguraMaximaConteudo}px, calc(100% - ${larguraSidebar}px))`
    : `min(${larguraMaximaConteudo}px, 100%)`;
  const margemConteudo = sidebarVisivel
    ? `max(0px, min(calc((100% - ${larguraMaximaConteudo}px) / 2), calc(100% - ${larguraMaximaConteudo + larguraSidebar}px)))`
    : `max(0px, calc((100% - ${larguraMaximaConteudo}px) / 2))`;

  const contexto: HistoricoCadastroContexto<TDados> = {
    avisoVersao,
    botaoHistorico,
    dadosSelecionados: versaoSelecionada?.dados,
    fecharHistorico,
    historicoAberto,
    selecionarVersao,
    versaoAtual,
    versaoSelecionada,
    visualizandoVersaoAntiga,
  };

  return (
    <div className="relative flex flex-col items-stretch overflow-x-clip lg:block">
      <motion.main
        layout
        layoutDependency={`${sidebarVisivel}`}
        transition={
          reduzirMovimento
            ? { layout: { duration: 0 } }
            : { layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
        }
        className={`order-2 mx-auto w-full min-w-0 lg:order-none lg:mr-0 lg:ml-[var(--margem-conteudo)] lg:w-[var(--largura-conteudo)] ${conteudoClassName}`}
        style={
          {
            "--largura-conteudo": larguraConteudo,
            "--margem-conteudo": margemConteudo,
          } as CSSProperties
        }
      >
        {children(contexto)}
      </motion.main>

      <AnimatePresence initial={false}>
        {sidebarVisivel && itens && (
          <motion.div
            key="historico-cadastros-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={
              reduzirMovimento
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            className="order-1 max-h-[80vh] w-full shrink-0 overflow-hidden transform-gpu lg:absolute lg:right-0 lg:top-0 lg:order-none lg:h-[var(--altura-sidebar)] lg:max-h-[var(--altura-sidebar)] lg:w-[var(--largura-sidebar)]"
            style={
              {
                "--altura-sidebar": `calc(100vh - ${deslocamentoTopoSidebar}px)`,
                "--largura-sidebar": `${larguraSidebar}px`,
              } as CSSProperties
            }
          >
            <HistoricoCadastrosSidebar
              itens={itens}
              versaoSelecionadaId={versaoSelecionadaId}
              onSelecionar={selecionarVersao}
              onVisualizarAutor={onVisualizarAutor}
              onFechar={fecharHistorico}
              titulo={tituloHistorico}
              descricao={descricaoHistorico}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
