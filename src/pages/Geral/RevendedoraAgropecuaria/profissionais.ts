export interface ProfissionalAnimal {
  id: number;
  nome: string;
  cpf: string;
  formacao: string;
  numeroConselho: string;
  servicoOficial: "Sim" | "Não";
  vacinacaoBrucelose: "Sim" | "Não";
  habilitacoes: string[];
  situacao: "Ativo" | "Inativo";
}

export interface ProfissionalVegetal {
  id: number;
  nome: string;
  documento: string;
  formacao: string;
  crea: string;
  habilitacao: string;
  numeroHabilitacao: string;
  situacao: "Ativo" | "Inativo";
}

export interface PessoaFisicaDisponivel {
  id: number;
  nome: string;
  documento: string;
}

export const PROFISSIONAIS_ANIMAL: ProfissionalAnimal[] = [
  { id: 4, nome: "Messias Araujo", cpf: "129.555.656-99", formacao: "Médico Veterinário", numeroConselho: "512633", servicoOficial: "Não", vacinacaoBrucelose: "Sim", habilitacoes: ["Emissão de GTA"], situacao: "Ativo" },
  { id: 1, nome: "Josephina Arantes", cpf: "444.009.956-40", formacao: "Médico Veterinário", numeroConselho: "512633", servicoOficial: "Sim", vacinacaoBrucelose: "Sim", habilitacoes: ["Emissão de GTA"], situacao: "Ativo" },
  { id: 2, nome: "José Aarão Neto", cpf: "555.009.956-40", formacao: "Zootecnista", numeroConselho: "778812", servicoOficial: "Não", vacinacaoBrucelose: "Não", habilitacoes: ["Emissão de GTA"], situacao: "Ativo" },
  { id: 3, nome: "Marina Couto Dias", cpf: "333.221.115-09", formacao: "Engenheiro Agrônomo", numeroConselho: "091254", servicoOficial: "Não", vacinacaoBrucelose: "Não", habilitacoes: ["Exame de Mormo"], situacao: "Inativo" },
];

export const PROFISSIONAIS_VEGETAL: ProfissionalVegetal[] = [
  { id: 1, nome: "Josephina Arantes", documento: "444.009.956-40", formacao: "Engenheiro Agrônomo", crea: "506779200", habilitacao: "Habilitado para emissão de PTV", numeroHabilitacao: "31250001", situacao: "Ativo" },
  { id: 2, nome: "José Aarão Neto", documento: "555.009.956-40", formacao: "Engenheiro Florestal", crea: "9913", habilitacao: "Habilitado para emissão de CFO/CFOC", numeroHabilitacao: "31250034", situacao: "Ativo" },
  { id: 3, nome: "Marina Couto Dias", documento: "333.221.115-09", formacao: "Engenheiro Agrônomo", crea: "778112004", habilitacao: "Habilitado para emissão de CFO/CFOC", numeroHabilitacao: "31250087", situacao: "Inativo" },
];

export const PESSOAS_FISICAS_DISPONIVEIS: PessoaFisicaDisponivel[] = [
  { id: 1, nome: "Pedro Alves Moraes", documento: "222.114.558-70" },
  { id: 2, nome: "José Teixeira Sabino", documento: "444.009.956-40" },
];

export const RESPONSAVEIS_TECNICOS_DISPONIVEIS = [
  ...PROFISSIONAIS_ANIMAL.map((profissional) => ({
    id: `animal-${profissional.id}`,
    nome: profissional.nome,
    documento: profissional.cpf,
    area: "Animal",
  })),
  ...PROFISSIONAIS_VEGETAL.map((profissional) => ({
    id: `vegetal-${profissional.id}`,
    nome: profissional.nome,
    documento: profissional.documento,
    area: "Vegetal",
  })),
];
