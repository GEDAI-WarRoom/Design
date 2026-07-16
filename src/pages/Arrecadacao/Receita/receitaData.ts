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

export const RECEITAS_MOCK: Receita[] = [
  { id: 1, codigo: "1001", descricao: "Taxa de expediente para cadastro", classificacao: "11226009", situacao: "Ativo" },
  { id: 2, codigo: "1002", descricao: "Emissão de certificado sanitário", classificacao: "11226600", situacao: "Ativo" },
  { id: 3, codigo: "1003", descricao: "Serviços administrativos diversos", classificacao: "16009900", situacao: "Inativo" },
];

let nextReceitaId = RECEITAS_MOCK.length + 1;

export function adicionarReceita(receita: Omit<Receita, "id">) {
  const novaReceita: Receita = { ...receita, id: nextReceitaId++ };
  RECEITAS_MOCK.push(novaReceita);
  return novaReceita;
}

export function atualizarReceita(receitaAtualizada: Receita) {
  const index = RECEITAS_MOCK.findIndex((receita) => receita.id === receitaAtualizada.id);
  if (index >= 0) RECEITAS_MOCK[index] = receitaAtualizada;
  return receitaAtualizada;
}

export const classificacaoLabel = (value: string) =>
  CLASSIFICACOES_RECEITA.find((item) => item.value === value)?.label ?? value;
