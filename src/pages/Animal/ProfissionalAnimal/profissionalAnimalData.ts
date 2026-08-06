import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoProfissionalAnimal = "Ativo" | "Inativo";
export type RespostaSimNao = "Sim" | "Não";

export interface ProfissionalAnimal {
  id: number;
  nome: string;
  cpf: string;
  formacao: string;
  numeroConselho: string;
  tipoRegistroConselho?: string;
  servicoOficial: RespostaSimNao;
  esfera?: string;
  masp?: string;
  vacinacaoBrucelose: RespostaSimNao;
  habilitacoes: string[];
  situacao: SituacaoProfissionalAnimal;
}

const COLECAO = "profissionais-area-animal";

export const PROFISSIONAL_VETERINARIO_DEMONSTRACAO_ID = 1;

export const PROFISSIONAL_VETERINARIO_DEMONSTRACAO: ProfissionalAnimal = {
  id: PROFISSIONAL_VETERINARIO_DEMONSTRACAO_ID,
  nome: "Josephina Arantes",
  cpf: "444.009.956-40",
  formacao: "Médico Veterinário",
  numeroConselho: "512633",
  tipoRegistroConselho: "Primário",
  servicoOficial: "Sim",
  esfera: "Estadual",
  masp: "10455301",
  vacinacaoBrucelose: "Sim",
  habilitacoes: ["Emissão de GTA", "Exame de Brucelose/Tuberculose"],
  situacao: "Ativo",
};

export const PROFISSIONAIS_ANIMAL_INICIAIS: ProfissionalAnimal[] = [
  PROFISSIONAL_VETERINARIO_DEMONSTRACAO,
  {
    id: 2,
    nome: "José Aarão Neto",
    cpf: "555.009.956-40",
    formacao: "Zootecnista",
    numeroConselho: "778812",
    tipoRegistroConselho: "Primário",
    servicoOficial: "Não",
    vacinacaoBrucelose: "Não",
    habilitacoes: ["Emissão de GTA"],
    situacao: "Ativo",
  },
  {
    id: 3,
    nome: "Marina Couto Dias",
    cpf: "333.221.115-09",
    formacao: "Engenheiro Agrônomo",
    numeroConselho: "091254",
    servicoOficial: "Não",
    vacinacaoBrucelose: "Não",
    habilitacoes: ["Exame de Mormo"],
    situacao: "Inativo",
  },
];

export function listarProfissionaisAnimal() {
  return listarColecaoMock(COLECAO, PROFISSIONAIS_ANIMAL_INICIAIS);
}

export function obterProfissionalAnimal(id?: number | null) {
  if (id == null) return null;
  return listarProfissionaisAnimal().find((profissional) => profissional.id === id) ?? null;
}

export function adicionarProfissionalAnimal(
  dados: Omit<ProfissionalAnimal, "id">,
) {
  const profissionais = listarProfissionaisAnimal();
  const novo: ProfissionalAnimal = {
    ...dados,
    id: proximoIdNumerico(profissionais),
  };
  salvarColecaoMock(COLECAO, [novo, ...profissionais]);
  return novo;
}
