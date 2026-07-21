export type SituacaoStatusAnimal = "Ativo" | "Inativo";

export type DisponibilidadeSubstatus =
  | "GTA"
  | "Observação da GTA"
  | "Eventos pecuários";

export type RegraBloqueio =
  | "Não Bloqueia"
  | "Somente no SIDAGRO"
  | "Somente no Portal do Produtor"
  | "No SIDAGRO e no Portal do Produtor";

export interface SubstatusAnimal {
  id: string;
  nome: string;
  disponivelEm: DisponibilidadeSubstatus[];
  observacaoImpressaoGta: string;
  bloqueiaOrigem: RegraBloqueio | "";
  bloqueiaDestino: RegraBloqueio | "";
}

export interface StatusAnimal {
  id: number;
  nome: string;
  situacao: SituacaoStatusAnimal;
  substatus: SubstatusAnimal[];
}

export const SITUACOES_STATUS_ANIMAL = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

export const DISPONIBILIDADES_SUBSTATUS = [
  { value: "GTA", label: "GTA" },
  { value: "Observação da GTA", label: "Observação da GTA" },
  { value: "Eventos pecuários", label: "Eventos pecuários" },
];

export const REGRAS_BLOQUEIO = [
  { value: "Não Bloqueia", label: "Não Bloqueia" },
  { value: "Somente no SIDAGRO", label: "Somente no SIDAGRO" },
  {
    value: "Somente no Portal do Produtor",
    label: "Somente no Portal do Produtor",
  },
  {
    value: "No SIDAGRO e no Portal do Produtor",
    label: "No SIDAGRO e no Portal do Produtor",
  },
];

export const STATUS_ANIMAL_MOCK: StatusAnimal[] = [
  {
    id: 1,
    nome: "Apto para trânsito",
    situacao: "Ativo",
    substatus: [
      {
        id: "substatus-1",
        nome: "Liberado",
        disponivelEm: ["GTA", "Eventos pecuários"],
        observacaoImpressaoGta: "Animal apto para emissão e trânsito.",
        bloqueiaOrigem: "Não Bloqueia",
        bloqueiaDestino: "Não Bloqueia",
      },
    ],
  },
  {
    id: 2,
    nome: "Sob restrição sanitária",
    situacao: "Ativo",
    substatus: [
      {
        id: "substatus-2",
        nome: "Interdição de origem",
        disponivelEm: ["GTA", "Observação da GTA"],
        observacaoImpressaoGta: "Trânsito bloqueado na origem por restrição sanitária.",
        bloqueiaOrigem: "No SIDAGRO e no Portal do Produtor",
        bloqueiaDestino: "Não Bloqueia",
      },
    ],
  },
  {
    id: 3,
    nome: "Status legado",
    situacao: "Inativo",
    substatus: [],
  },
];

let proximoId = Math.max(...STATUS_ANIMAL_MOCK.map((item) => item.id)) + 1;

export function listarStatusAnimal() {
  return STATUS_ANIMAL_MOCK;
}

export function obterStatusAnimal(id?: number | null) {
  if (id == null) return STATUS_ANIMAL_MOCK[0] ?? null;
  return STATUS_ANIMAL_MOCK.find((item) => item.id === id) ?? null;
}

export function criarStatusAnimal(dados: Omit<StatusAnimal, "id">) {
  const novo = { ...dados, id: proximoId++ };
  STATUS_ANIMAL_MOCK.unshift(novo);
  return novo;
}

export function atualizarStatusAnimal(status: StatusAnimal) {
  const index = STATUS_ANIMAL_MOCK.findIndex((item) => item.id === status.id);
  if (index === -1) return null;
  STATUS_ANIMAL_MOCK[index] = status;
  return status;
}

