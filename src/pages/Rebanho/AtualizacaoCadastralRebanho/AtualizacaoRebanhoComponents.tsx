import {
  Baby,
  BarChart3,
  Check,
  CircleCheck,
  Skull,
  TrendingUp,
} from "lucide-react";
import type {
  AtualizacaoCadastralRebanho,
  ItemAtualizacaoRebanho,
} from "./atualizacaoCadastralRebanhoData";

export function AtualizacaoHeaderCard({
  atualizacao,
  item,
}: {
  atualizacao: AtualizacaoCadastralRebanho;
  item?: ItemAtualizacaoRebanho | null;
}) {
  const colunas = item
    ? [
        {
          titulo: item.codigo,
          linhas: [item.especie, item.tipo === "Exploração Pecuária" ? "Exploração" : "Núcleo"],
          destaque: true,
        },
        {
          titulo: atualizacao.estabelecimento.nome,
          linhas: [atualizacao.estabelecimento.codigo, "Estabelecimento Agropecuário"],
        },
        {
          titulo: atualizacao.etapa,
          linhas: ["Etapa de Atualização"],
        },
        {
          titulo: atualizacao.produtor.nome,
          linhas: [atualizacao.produtor.documento, "Produtor Titular"],
        },
      ]
    : [
        {
          titulo: atualizacao.estabelecimento.nome,
          linhas: [atualizacao.estabelecimento.codigo, "Estabelecimento Agropecuário"],
          destaque: true,
        },
        {
          titulo: atualizacao.etapa,
          linhas: ["Etapa de Atualização"],
        },
        {
          titulo: atualizacao.produtor.nome,
          linhas: [atualizacao.produtor.documento, "Produtor Titular"],
        },
      ];

  return (
    <section className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className={`grid grid-cols-1 ${item ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        {colunas.map((coluna, index) => (
          <div
            key={`${coluna.titulo}-${index}`}
            className={`relative px-8 py-6 min-h-[100px] flex flex-col justify-center ${
              coluna.destaque ? "bg-[#eff8f3] border-l-[5px] border-l-[#009b57]" : ""
            } ${index > 0 ? "md:border-l border-gray-200" : ""}`}
          >
            <p className="text-sm font-bold text-gray-900 break-words">
              {coluna.titulo}
            </p>
            {coluna.linhas.map((linha) => (
              <p key={linha} className="text-xs text-gray-500">
                {linha}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

const ETAPAS = [
  { label: "Mortalidade", Icon: Skull },
  { label: "Evolução", Icon: TrendingUp },
  { label: "Nascimento", Icon: Baby },
  { label: "Revisão Final", Icon: BarChart3 },
];

export function EtapasAtualizacaoRebanho({
  etapaAtual,
  concluidas = false,
}: {
  etapaAtual: number;
  concluidas?: boolean;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-start px-4 md:px-8">
      {ETAPAS.map(({ label, Icon }, index) => {
        const concluida = concluidas || index < etapaAtual;
        const ativa = concluidas || index === etapaAtual;
        const verde = concluida || ativa;
        return (
          <div key={label} className="contents">
            {index > 0 && (
              <div
                className={`h-px mt-7 ${
                  verde ? "bg-[#009b57]" : "bg-gray-300"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-2 min-w-[74px]">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                  verde
                    ? "bg-[#008d4d] border-[#008d4d] text-white"
                    : "bg-white border-gray-200 text-gray-300"
                }`}
              >
                {concluida ? (
                  <Check size={18} strokeWidth={3} />
                ) : ativa && index < 3 ? (
                  <Icon size={18} />
                ) : ativa ? (
                  <BarChart3 size={18} />
                ) : (
                  <CircleCheck size={18} />
                )}
              </div>
              <span
                className={`text-xs font-semibold text-center ${
                  verde ? "text-[#007c43]" : "text-gray-300"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SomenteLeituraAviso() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
      Esta atualização foi concluída e está disponível somente para visualização.
    </div>
  );
}

