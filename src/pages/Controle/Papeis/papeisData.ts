export interface Papel {
  id: number;
  nome: string;
  tipo: "Base" | "Complementar";
  situacao: "Ativo" | "Inativo";
}

export const PAPEIS_MOCK: Papel[] = [
  { id: 1, nome: "Funcionário", tipo: "Base", situacao: "Ativo" },
  { id: 2, nome: "Responsável Técnico", tipo: "Complementar", situacao: "Ativo" },
  { id: 3, nome: "Administrador", tipo: "Base", situacao: "Ativo" },
  { id: 4, nome: "Produtor Rural", tipo: "Complementar", situacao: "Inativo" },
  { id: 5, nome: "Gestor de Cadastros", tipo: "Base", situacao: "Ativo" },
];

export function listarPapeis() {
  return PAPEIS_MOCK;
}
