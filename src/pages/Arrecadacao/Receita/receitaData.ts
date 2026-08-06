import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoReceita = "Ativo" | "Inativo";

export interface Receita {
  id: number;
  codigo: string;
  descricao: string;
  classificacao: string;
  situacao: SituacaoReceita;
}

export const CLASSIFICACOES_RECEITA = [
  { value: "11226009", label: "11226009 - Taxa de expediente" },
  { value: "11226600", label: "11226600 - Taxa de emissão de documentos sanitários" },
  { value: "16009900", label: "16009900 - Outros serviços" },
];

export const SITUACOES_RECEITA = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const COLECAO_RECEITAS = "receitas";

export const RECEITAS_INICIAIS: Receita[] = [
  { id: 1, codigo: "1001", descricao: "Taxa de expediente para cadastro", classificacao: "11226009", situacao: "Ativo" },
  { id: 2, codigo: "1002", descricao: "Emissão de certificado sanitário", classificacao: "11226600", situacao: "Ativo" },
  { id: 3, codigo: "1003", descricao: "Serviços administrativos diversos", classificacao: "16009900", situacao: "Inativo" },
];

export function listarReceitas() {
  return listarColecaoMock(COLECAO_RECEITAS, RECEITAS_INICIAIS);
}

export function obterReceita(id?: number | null) {
  const receitas = listarReceitas();
  if (id == null) return receitas[0] ?? null;
  return receitas.find((receita) => receita.id === id) ?? null;
}

export function adicionarReceita(receita: Omit<Receita, "id">) {
  const receitas = listarReceitas();
  const novaReceita: Receita = {
    ...receita,
    id: proximoIdNumerico(receitas),
  };
  salvarColecaoMock(COLECAO_RECEITAS, [novaReceita, ...receitas]);
  return novaReceita;
}

export function atualizarReceita(receitaAtualizada: Receita) {
  const receitas = listarReceitas();
  const atualizadas = receitas.some((receita) => receita.id === receitaAtualizada.id)
    ? receitas.map((receita) =>
        receita.id === receitaAtualizada.id ? receitaAtualizada : receita,
      )
    : [receitaAtualizada, ...receitas];
  salvarColecaoMock(COLECAO_RECEITAS, atualizadas);
  return receitaAtualizada;
}

export const classificacaoLabel = (value: string) =>
  CLASSIFICACOES_RECEITA.find((item) => item.value === value)?.label ?? value;
