import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoTipoVacina = "Ativo" | "Inativo";
export type RespostaSimNao = "Sim" | "Não";

export interface EspecieTipoVacina {
  id: number;
  nome: string;
}

export interface DoencaTipoVacina {
  id: number;
  nome: string;
  especies: EspecieTipoVacina[];
}

export interface TipoVacina {
  id: number;
  nome: string;
  exigeReceituario: RespostaSimNao;
  doencas: DoencaTipoVacina[];
  especies: EspecieTipoVacina[];
  situacao: SituacaoTipoVacina;
}

const BOVINO = { id: 1, nome: "Bovino" };
const BUBALINO = { id: 2, nome: "Bubalino" };
const SUINO = { id: 3, nome: "Suíno" };
const EQUINO = { id: 4, nome: "Equino" };
const OVINO = { id: 5, nome: "Ovino" };
const CAPRINO = { id: 6, nome: "Caprino" };

export const DOENCAS_TIPO_VACINA: DoencaTipoVacina[] = [
  { id: 1, nome: "Brucelose", especies: [BOVINO, BUBALINO] },
  { id: 2, nome: "Febre Aftosa", especies: [BOVINO, BUBALINO, SUINO, OVINO, CAPRINO] },
  { id: 3, nome: "Raiva dos Herbívoros", especies: [BOVINO, BUBALINO, EQUINO, OVINO, CAPRINO] },
  { id: 4, nome: "Clostridiose", especies: [BOVINO, BUBALINO, OVINO, CAPRINO] },
];

export const ESPECIES_TIPO_VACINA = Array.from(
  new Map(DOENCAS_TIPO_VACINA.flatMap((doenca) => doenca.especies).map((especie) => [especie.id, especie])).values(),
);

export const SITUACOES_TIPO_VACINA: { value: SituacaoTipoVacina; label: string }[] = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const COLECAO = "tipos-vacina";

export const TIPOS_VACINA_MOCK: TipoVacina[] = [
  {
    id: 1,
    nome: "B19",
    exigeReceituario: "Sim",
    doencas: [DOENCAS_TIPO_VACINA[0]],
    especies: [BOVINO],
    situacao: "Ativo",
  },
  {
    id: 2,
    nome: "RB51",
    exigeReceituario: "Sim",
    doencas: [DOENCAS_TIPO_VACINA[0]],
    especies: [BOVINO, BUBALINO],
    situacao: "Ativo",
  },
  {
    id: 3,
    nome: "Antirrábica inativada",
    exigeReceituario: "Não",
    doencas: [DOENCAS_TIPO_VACINA[2]],
    especies: [BOVINO, EQUINO],
    situacao: "Inativo",
  },
];

export function listarTiposVacina() {
  return listarColecaoMock(COLECAO, TIPOS_VACINA_MOCK);
}

export function obterTipoVacina(id?: number | null) {
  const registros = listarTiposVacina();
  if (id == null) return registros[0] ?? null;
  return registros.find((item) => item.id === id) ?? null;
}

export function criarTipoVacina(dados: Omit<TipoVacina, "id">) {
  const registros = listarTiposVacina();
  const novo: TipoVacina = { id: proximoIdNumerico(registros), ...dados };
  salvarColecaoMock(COLECAO, [novo, ...registros]);
  return novo;
}

export function atualizarTipoVacina(id: number, dados: Omit<TipoVacina, "id">) {
  const registros = listarTiposVacina();
  const registro = registros.find((item) => item.id === id);
  if (!registro) return null;

  const atualizado: TipoVacina = { ...registro, ...dados };
  salvarColecaoMock(COLECAO, registros.map((item) => (item.id === id ? atualizado : item)));
  return atualizado;
}

export function especiesSuscetiveis(doencas: DoencaTipoVacina[]) {
  return Array.from(
    new Map(doencas.flatMap((doenca) => doenca.especies).map((especie) => [especie.id, especie])).values(),
  );
}

export function formatarDoencas(doencas: DoencaTipoVacina[]) {
  return doencas.length ? doencas.map((doenca) => doenca.nome).join(", ") : "-";
}
