import { useId } from "react";
import { History, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export interface HistoricoCadastroItem<TDados = unknown> {
  id: string | number;
  data: string;
  hora?: string;
  alteradoPor: string;
  aprovadoPor?: string;
  atual?: boolean;
  dados?: TDados;
}

export type TipoAutorHistoricoCadastro = "alteracao" | "aprovacao";

export interface ContextoAutorHistoricoCadastro<TDados = unknown> {
  item: HistoricoCadastroItem<TDados>;
  tipo: TipoAutorHistoricoCadastro;
}

export interface BotaoHistoricoCadastrosProps {
  aberto: boolean;
  onClick: () => void;
}

export function BotaoHistoricoCadastros({
  aberto,
  onClick,
}: BotaoHistoricoCadastrosProps) {
  const ariaLabel = aberto
    ? "Fechar histórico de cadastros"
    : "Abrir histórico de cadastros";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={aberto}
      title={ariaLabel}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#1A7A3C] transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] focus-visible:ring-offset-2"
    >
      <History size={20} strokeWidth={2} />
    </button>
  );
}

interface NomeAutorHistoricoProps<TDados> {
  nome: string;
  item: HistoricoCadastroItem<TDados>;
  tipo: TipoAutorHistoricoCadastro;
  selecionado: boolean;
  onVisualizar?: (
    nome: string,
    contexto: ContextoAutorHistoricoCadastro<TDados>,
  ) => void;
}

function NomeAutorHistorico<TDados>({
  nome,
  item,
  tipo,
  selecionado,
  onVisualizar,
}: NomeAutorHistoricoProps<TDados>) {
  const className = `text-[11px] font-semibold transition-colors duration-200 motion-reduce:transition-none ${
    selecionado ? "text-[#1A7A3C]" : "text-gray-600"
  }`;

  if (!onVisualizar) return <span className={className}>{nome}</span>;

  return (
    <button
      type="button"
      onClick={() => onVisualizar(nome, { item, tipo })}
      className={`pointer-events-auto ${className} hover:underline hover:underline-offset-2 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]`}
    >
      {nome}
    </button>
  );
}

export interface HistoricoCadastrosSidebarProps<TDados> {
  itens: HistoricoCadastroItem<TDados>[];
  versaoSelecionadaId?: string | number;
  onSelecionar: (item: HistoricoCadastroItem<TDados>) => void;
  onVisualizarAutor?: (
    nome: string,
    contexto: ContextoAutorHistoricoCadastro<TDados>,
  ) => void;
  onFechar: () => void;
  titulo?: string;
  descricao?: string;
}

export function HistoricoCadastrosSidebar<TDados = unknown>({
  itens,
  versaoSelecionadaId,
  onSelecionar,
  onVisualizarAutor,
  onFechar,
  titulo = "Histórico de Cadastros",
  descricao = "Histórico de alterações realizadas no cadastro. Selecione a versão para visualizá-la.",
}: HistoricoCadastrosSidebarProps<TDados>) {
  const idAnimacao = useId();
  const reduzirMovimento = useReducedMotion();

  return (
    <aside
      aria-label={titulo}
      className="flex h-full w-full flex-col border-b border-gray-200 bg-[#f7f7f7] lg:border-b-0 lg:border-l"
    >
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <History size={19} className="text-[#1A7A3C]" />
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar histórico de cadastros"
            title="Fechar"
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]"
          >
            <X size={18} />
          </button>
        </div>
        <p className="pt-3 text-xs leading-5 text-gray-500">{descricao}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        {itens.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
            <History size={24} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Nenhuma alteração registrada</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              As futuras versões deste cadastro aparecerão aqui.
            </p>
          </div>
        ) : (
          <ol className="relative ml-2 border-l border-gray-200">
            {itens.map((item, index) => {
              const selecionado = item.id === versaoSelecionadaId;

              return (
                <li
                  key={item.id}
                  className={index === itens.length - 1 ? "relative pb-1 pl-6" : "relative pb-7 pl-6"}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[6px] top-4 h-3 w-3 rounded-full border-[3px] transition-colors duration-200 ease-out motion-reduce:transition-none ${
                      item.atual
                        ? "border-emerald-100 bg-emerald-500"
                        : selecionado
                          ? "border-emerald-100 bg-[#1A7A3C]"
                          : "border-gray-100 bg-gray-300"
                    }`}
                  />

                  <div className="group relative isolate w-full rounded-xl border border-transparent bg-transparent p-4 text-left">
                    {selecionado ? (
                      <motion.span
                        layoutId={`historico-card-selecionado-${idAnimacao}`}
                        aria-hidden="true"
                        transition={
                          reduzirMovimento
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 38, mass: 0.75 }
                        }
                        className="pointer-events-none absolute inset-0 z-0 rounded-xl bg-white shadow-sm transform-gpu [will-change:transform]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 rounded-xl bg-white opacity-0 shadow-sm transition-opacity duration-200 ease-out group-hover:opacity-50 motion-reduce:transition-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onSelecionar(item)}
                      aria-current={selecionado ? "true" : undefined}
                      aria-label={`Visualizar versão de ${item.data}${item.hora ? ` às ${item.hora}` : ""}`}
                      className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] focus-visible:ring-offset-2"
                    />

                    <div className="pointer-events-none relative z-20">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-800">
                          {item.data}
                          {item.hora && (
                            <span className="font-normal text-gray-500"> · {item.hora}</span>
                          )}
                        </p>
                        {item.atual && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                              selecionado
                                ? "bg-emerald-50 text-[#1A7A3C]"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            Atual
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-4 space-y-2 border-t pt-3 transition-colors duration-200 ease-out motion-reduce:transition-none ${
                          selecionado ? "border-gray-100" : "border-transparent"
                        }`}
                      >
                        <p className="text-xs leading-5 text-gray-500">
                          Alterado por:{" "}
                          <NomeAutorHistorico
                            nome={item.alteradoPor}
                            item={item}
                            tipo="alteracao"
                            selecionado={selecionado}
                            onVisualizar={onVisualizarAutor}
                          />
                        </p>
                        {item.aprovadoPor && (
                          <p className="text-xs leading-5 text-gray-500">
                            Aprovado por:{" "}
                            <NomeAutorHistorico
                              nome={item.aprovadoPor}
                              item={item}
                              tipo="aprovacao"
                              selecionado={selecionado}
                              onVisualizar={onVisualizarAutor}
                            />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </aside>
  );
}
