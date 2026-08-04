export interface AtestadoExame {
  id: string | number;
  descricao: string;
  doenca: { codigo: string; nome: string };
  diasValidade: string;
  situacao: string;
}

export const ATESTADOS_EXAME_MOCK: AtestadoExame[] = [
  {
    id: 1,
    descricao: "Atestado de Raiva",
    doenca: { codigo: "D04", nome: "Raiva" },
    diasValidade: "180",
    situacao: "Ativo"
  },
  {
    id: 2,
    descricao: "Atestado de Mormo",
    doenca: { codigo: "D06", nome: "Mormo" },
    diasValidade: "60",
    situacao: "Ativo"
  }
];

export function listarAtestadosExame() {
  return ATESTADOS_EXAME_MOCK;
}

export function adicionarAtestadoExame(novo: Omit<AtestadoExame, "id" | "situacao">) {
  const item: AtestadoExame = {
    id: Date.now(),
    situacao: "Ativo",
    ...novo,
  };
  ATESTADOS_EXAME_MOCK.unshift(item);
  return item;
}