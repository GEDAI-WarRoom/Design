// Status possíveis para a entidade Índice
export type SituacaoIndice = 'Ativo' | 'Inativo';

// Interface principal do Índice
export interface Indice {
  id: string;
  nome: string; 
  situacao: SituacaoIndice; 
}

export const MOCK_INDICES: Indice[] = [
  { id: '1', nome: 'UFEMG', situacao: 'Ativo' },
  { id: '2', nome: 'SELIC', situacao: 'Ativo' },
  { id: '3', nome: 'IPCA', situacao: 'Ativo' },
  { id: '4', nome: 'IGP-M', situacao: 'Inativo' },
];

export const INDICES_OPCOES = [
  { value: "UFEMG", label: "UFEMG" },
  { value: "SELIC", label: "SELIC" },
  { value: "IPCA", label: "IPCA" },
  { value: "IGP-M", label: "IGP-M" },
];

export const SITUACOES_OPCOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];