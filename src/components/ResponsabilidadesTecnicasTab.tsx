import { Calendar, FileText, MoreVertical, Store } from "lucide-react";
import { AccordionCardGroup } from "./ui/FormKit";
import * as Icons from "../imports/icons";
import { getResponsabilidadesTecnicas } from "../pages/Geral/RevendedoraAgropecuaria/responsabilidadeTecnicaData";

type Responsabilidade = ReturnType<typeof getResponsabilidadesTecnicas>[number];

const TITULOS: Record<string, string> = {
  "RT de Evento Pecuário": "RT de Evento Pecuário",
  "RT de Estabelecimento Agropecuário": "RT de Estabelecimento Agropecuário",
  "RT de Estabelecimento Agroindustrial - POA": "RT de Estabelecimento Agroindustrial - POA",
  "RT de Revendedora de Animais Vivos": "RT de Revendedora de Animais Vivos",
  "RT de Integradora/Cooperativa": "RT de Integradora/Cooperativa",
};

const GRUPOS_PADRAO = [
  "RT de Evento Pecuário",
  "RT de Estabelecimento Agropecuário",
  "RT de Estabelecimento Agroindustrial POA",
  "RT de Estabelecimento Agroindustrial POV",
  "RT de Revendedora de Animais Vivos",
  "RT de Integradora/Cooperativa",
];

const EXEMPLOS_RESPONSABILIDADES = GRUPOS_PADRAO.map((entidadeTipo, index) => ({
  id: `exemplo-rt-${index + 1}`,
  profissionalCpf: "",
  profissionalNome: "",
  entidadeTipo,
  entidadeCodigo: index === 0 ? "035624" : `34523423${567 + index}`,
  entidadeNome: index === 0 ? "" : ["Fazenda Rio Preto", "Agroindústria ABC", "Unidade São José", "Revendedora São José", "Agro Alimentos Ferreira Ltda"][index - 1],
  dataArt: `2025-0${index + 1}-15`,
  arquivoArt: "documento-exemplo.pdf",
  situacao: "Ativo" as const,
  atualizadoEm: "2026-07-10",
}));

function formatarData(data: string) {
  if (!data) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${data}T12:00:00`));
}

function rotuloEntidade(tipo: string) {
  const tipoSemPrefixo = tipo.replace(/^RT de /, "");
  if (tipo.includes("Agroindustrial")) return "Estabelecimento Agroindustrial";
  if (tipo.includes("Revendedora")) return "Revendedora";
  if (tipo.includes("Integradora")) return "Integradora/Cooperativa";
  if (tipo.includes("Agropecuário")) return "Estabelecimento Agropecuário";
  return tipoSemPrefixo;
}

function IconeEntidade({ tipo }: { tipo: string }) {
  if (tipo.includes("Agroindustrial")) return <img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="Estabelecimento Agroindustrial" className="h-5 w-5 object-contain" />;
  if (tipo.includes("Revendedora")) return <Store size={20} className="text-[#1A7A3C]" />;
  if (tipo.includes("Integradora")) return <img src={Icons.iconeGrupoUrl} alt="Integradora/Cooperativa" className="h-5 w-5 object-contain" />;
  return <img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento Agropecuário" className="h-5 w-5 object-contain" />;
}

function GrupoResponsabilidade({ titulo, itens, numero }: { titulo: string; itens: Responsabilidade[]; numero: number }) {
  const ativos = itens.filter((item) => item.situacao === "Ativo");
  const inativos = itens.filter((item) => item.situacao === "Inativo");

  const Card = ({ item }: { item: Responsabilidade }) => (
    <article className="min-w-0 w-full overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
      <div className="h-1 bg-[#1A7A3C]" />
      <div className="flex min-h-[150px] flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3 text-[10px] text-gray-500">
          <span><strong>Atualizado em:</strong> {formatarData(item.atualizadoEm)}</span>
          <span className={item.situacao === "Ativo" ? "text-gray-500" : "text-gray-400"}>{item.situacao}</span>
        </div>
        {item.entidadeTipo === "RT de Evento Pecuário" && <div className="flex items-start gap-3">
          <FileText size={20} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{item.entidadeCodigo || "—"}</p>
            <p className="text-[10px] text-gray-500">Número do Cadastro de RT de eventos</p>
          </div>
        </div>}
        <div className="flex items-start gap-3">
          <Calendar size={20} className="shrink-0 text-[#1A7A3C]" />
          <div>
            <p className="text-sm text-gray-800">{formatarData(item.dataArt)}</p>
            <p className="text-[10px] text-gray-500">{item.entidadeTipo === "RT de Evento Pecuário" ? "Data da Certificação de Treinamento" : "Data do DRT"}</p>
          </div>
        </div>
        {item.entidadeTipo !== "RT de Evento Pecuário" && <div className="flex items-start gap-3">
          <IconeEntidade tipo={item.entidadeTipo} />
          <div>
            <p className="text-sm text-gray-800">{item.entidadeNome || "—"}</p>
            <p className="text-[10px] text-gray-500">{rotuloEntidade(item.entidadeTipo)}</p>
          </div>
        </div>}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3">
        <button type="button" className="h-9 rounded bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]">Visualizar</button>
        <MoreVertical size={19} className="text-gray-500" />
      </div>
    </article>
  );

  return (
    <AccordionCardGroup
      title={titulo}
      activeCountText={`${ativos.length} responsabilidade${ativos.length === 1 ? "" : "s"} técnica${ativos.length === 1 ? "" : "s"} ativa${ativos.length === 1 ? "" : "s"}`}
      variant="sem-vinculacao"
      historicoTitle="Histórico de Inativos"
      emptyStateText="Nenhuma responsabilidade técnica ativa."
      groupNumber={numero}
      historicoChildren={inativos.map((item) => <Card key={item.id} item={item} />)}
    >
      {ativos.length > 0 ? ativos.map((item) => <Card key={item.id} item={item} />) : <p className="py-4 text-center text-sm text-gray-500">Nenhuma responsabilidade técnica ativa.</p>}
    </AccordionCardGroup>
  );
}

export function ResponsabilidadesTecnicasTab({ cpf }: { cpf?: string }) {
  const registrosReais = cpf ? getResponsabilidadesTecnicas(cpf) : [];
  const responsabilidades = registrosReais.length > 0 ? registrosReais : EXEMPLOS_RESPONSABILIDADES;
  const grupos = Array.from(new Set([
    ...GRUPOS_PADRAO,
    ...responsabilidades.map((item) => item.entidadeTipo),
  ]));

  return (
    <div className="flex flex-col gap-4">
      {grupos.map((grupo, index) => <GrupoResponsabilidade key={grupo} numero={index + 1} titulo={TITULOS[grupo] || grupo} itens={responsabilidades.filter((item) => item.entidadeTipo === grupo || (grupo === "RT de Estabelecimento Agroindustrial POA" && item.entidadeTipo === "RT de Estabelecimento Agroindustrial - POA"))} />)}
    </div>
  );
}
