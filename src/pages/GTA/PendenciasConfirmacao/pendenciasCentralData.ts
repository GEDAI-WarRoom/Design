import {
  listarColecaoMock,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type DestinatarioPendencia = "produtor" | "veterinario" | "lider-estabelecimento";
export type SituacaoPendenciaCentral = "Pendente" | "Resolvida";

export interface PendenciaCentral {
  id: number;
  destinatario: DestinatarioPendencia;
  destinatarioEntidadeId?: number;
  tipo: "habilitacao" | "atestado-exame" | "vinculo-profissional" | "renovacao-responsabilidade";
  titulo: string;
  descricao: string;
  situacao: SituacaoPendenciaCentral;
  entidadeRelacionada?: { rota: string; id?: number };
}

const COLECAO = "pendencias-central";

function normalizarPendenciaCentral(pendencia: PendenciaCentral): PendenciaCentral {
  if (pendencia.tipo === "habilitacao" && pendencia.destinatario === "veterinario" && !pendencia.entidadeRelacionada) {
    return { ...pendencia, entidadeRelacionada: { rota: "meu-perfil" } };
  }

  if (pendencia.tipo === "atestado-exame" && pendencia.entidadeRelacionada?.rota === "atestado-exame") {
    return {
      ...pendencia,
      entidadeRelacionada: { ...pendencia.entidadeRelacionada, rota: "visualizar-atestado-exame" },
    };
  }

  return pendencia;
}

const PENDENCIAS_INICIAIS: PendenciaCentral[] = [
  {
    id: 1,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "habilitacao",
    titulo: "Atualização de habilitação",
    descricao: "Documentação aguardando análise",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "meu-perfil" },
  },
  {
    id: 2,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "atestado-exame",
    titulo: "Atestado de exame",
    descricao: "Rascunho não finalizado",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "visualizar-atestado-exame", id: 1 },
  },
  {
    id: 3,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "vinculo-profissional",
    titulo: "Vínculo profissional",
    descricao: "Confirmação solicitada pela revendedora",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "visualizar-revendedora-agropecuario", id: 1 },
  },
  {
    id: 4,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "renovacao-responsabilidade",
    titulo: "Renovação de responsabilidade",
    descricao: "Prazo de renovação se aproxima",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "visualizar-revendedora-agropecuario", id: 1 },
  },
	{
		id: 5,
		destinatario: "lider-estabelecimento",
		tipo: "habilitacao",
		titulo: "Atualização de estabelecimento",
		descricao: "Dados cadastrais aguardando revisão",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "visualizar-estabelecimento-poa", id: 1 },
	},
	{
		id: 6,
		destinatario: "lider-estabelecimento",
		tipo: "renovacao-responsabilidade",
		titulo: "Renovação de responsabilidade",
		descricao: "Confirmação necessária para o estabelecimento",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "visualizar-estabelecimento-poa", id: 2 },
	},
];

export function listarPendenciasCentrais(
  destinatario: DestinatarioPendencia,
  destinatarioEntidadeId?: number,
) {
  return listarColecaoMock(COLECAO, PENDENCIAS_INICIAIS)
    .map(normalizarPendenciaCentral)
    .filter((pendencia) =>
      pendencia.destinatario === destinatario &&
      pendencia.situacao === "Pendente" &&
      (destinatarioEntidadeId == null || pendencia.destinatarioEntidadeId === destinatarioEntidadeId),
    );
}

export function resolverPendenciaCentral(id: number) {
  const registros = listarColecaoMock(COLECAO, PENDENCIAS_INICIAIS);
  salvarColecaoMock(
    COLECAO,
    registros.map((pendencia) =>
      pendencia.id === id ? { ...pendencia, situacao: "Resolvida" as const } : pendencia,
    ),
  );
}
