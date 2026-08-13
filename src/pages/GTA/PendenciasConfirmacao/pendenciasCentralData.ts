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
  tipo:
    | "habilitacao"
    | "atestado-exame"
    | "vinculo-profissional"
    | "declaracao-partilha-vacina"
    | "vacinador-brucelose"
    | "declaracao-vacinacao"
    | "boleto";
  titulo: string;
  descricao: string;
  situacao: SituacaoPendenciaCentral;
  entidadeRelacionada?: { rota: string; id?: number };
}

const COLECAO = "pendencias-central-v2";

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
		destinatario: "produtor",
		tipo: "declaracao-vacinacao",
		titulo: "Declaração de vacinação",
		descricao: "Declaração da campanha aguardando preenchimento",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "declaracao-vacinacao" },
	},
  {
    id: 2,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "habilitacao",
    titulo: "Atualização de habilitação",
    descricao: "Documentação aguardando análise",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "meu-perfil" },
  },
  {
    id: 3,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "atestado-exame",
    titulo: "Atestado de exame",
    descricao: "Rascunho não finalizado",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "visualizar-atestado-exame", id: 1 },
  },
  {
    id: 4,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "vinculo-profissional",
    titulo: "Vínculo profissional",
    descricao: "Casa do Produtor Lavras solicita a confirmação do vínculo",
    situacao: "Pendente",
    entidadeRelacionada: { rota: "visualizar-revendedora-agropecuario", id: 1 },
  },
  {
    id: 5,
    destinatario: "veterinario",
    destinatarioEntidadeId: 1,
    tipo: "declaracao-partilha-vacina",
    titulo: "Declaração/Doação ou Partilha de Vacina",
    descricao: "Movimentação de vacina aguardando regularização",
    situacao: "Pendente",
		entidadeRelacionada: { rota: "partilha-vacina" },
  },
	{
		id: 6,
		destinatario: "veterinario",
		destinatarioEntidadeId: 1,
		tipo: "vacinador-brucelose",
		titulo: "Vacinador de Brucelose",
		descricao: "Cadastro de vacinador aguardando atualização",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "visualizar-vacinador-brucelose", id: 1 },
	},
	{
		id: 7,
		destinatario: "lider-estabelecimento",
		tipo: "vinculo-profissional",
		titulo: "Vínculo profissional",
		descricao: "Frigorífico São José solicita a confirmação do vínculo",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "visualizar-estabelecimento-poa", id: 1 },
	},
	{
		id: 8,
		destinatario: "lider-estabelecimento",
		tipo: "boleto",
		titulo: "Pagamento de boleto pendente",
		descricao: "Integradora Vale do Campo · vencimento em 07/08/2026",
		situacao: "Pendente",
		entidadeRelacionada: { rota: "relatorio-boletos-gta" },
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
