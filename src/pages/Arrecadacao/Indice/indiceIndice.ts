import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

// Status possíveis para a entidade Índice
export type SituacaoIndice = 'Ativo' | 'Inativo';

// Interface principal do Índice
export interface Indice {
  id: string;
  nome: string; 
  situacao: SituacaoIndice; 
}

const COLECAO = "indices";

export const INDICES_INICIAIS: Indice[] = [
  { id: '1', nome: 'UFEMG', situacao: 'Ativo' },
  { id: '2', nome: 'SELIC', situacao: 'Ativo' },
  { id: '3', nome: 'IPCA', situacao: 'Ativo' },
  { id: '4', nome: 'IGP-M', situacao: 'Inativo' },
];

export function listarIndices() {
  return listarColecaoMock(COLECAO, INDICES_INICIAIS);
}

export function obterIndice(id?: string | null) {
  const indices = listarIndices();
  if (id == null) return indices[0] ?? null;
  return indices.find((item) => item.id === id) ?? null;
}

export function salvarIndice(dados: Omit<Indice, "id"> & { id?: string }) {
  const indices = listarIndices();
  const registro: Indice = {
    ...dados,
    id: dados.id ?? String(proximoIdNumerico(indices)),
  };
  salvarColecaoMock(
    COLECAO,
    indices.some((item) => item.id === registro.id)
      ? indices.map((item) => (item.id === registro.id ? registro : item))
      : [registro, ...indices],
  );
  return registro;
}

export const listarIndicesOpcoes = () =>
  listarIndices()
    .filter((indice) => indice.situacao === "Ativo")
    .map((indice) => ({ value: indice.id, label: indice.nome }));

export const SITUACOES_OPCOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];
