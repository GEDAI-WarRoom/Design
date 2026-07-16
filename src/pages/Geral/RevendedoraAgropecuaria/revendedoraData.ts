import { salvarResponsabilidadeTecnica } from "./responsabilidadeTecnicaData";

export type Situacao = "Ativo" | "Inativo";

export type TipoProfissional =
  | "Responsável Técnico Animal"
  | "Responsável Técnico Vegetal"
  | "Habilitado para Emissão de GTA"
  | "Funcionário";

export interface ProfissionalVinculado {
  id: string;
  tipo: TipoProfissional;
  nome: string;
  documento: string;
  dataArt?: string;
  arquivoArt?: string;
  situacao: Situacao;
  atualizadoEm: string;
}

export interface EnderecoRevendedora {
  zona: string;
  cep: string;
  estado: string;
  municipio: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  localidade: string;
  distrito: string;
  latitude: string;
  longitude: string;
}

export interface ProprietarioContato {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  observacao?: string;
}

export interface ContatoRevendedora {
  utilizarContatoProprietario: "Sim" | "Não";
  proprietariosSelecionados: string[];
  emailFixo: string;
  emailFixoObs: string;
  telefoneFixo: string;
  telefoneFixoObs: string;
  contatosAdicionais: Array<{
    id: string;
    tipo: "E-mail" | "Telefone";
    email: string;
    telefone: string;
    observacao: string;
  }>;
  proprietariosDisponiveis?: ProprietarioContato[];
}

export interface Revendedora {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: string[];
  responsaveis: string[];
  funcionarios: string[];
  areaAtuacao: string[];
  atuacoes: string[];
  registroAnimal: string;
  atuacoesAnimal: string[];
  registroVegetal: string;
  renasem: string;
  atuacoesVegetal: string[];
  municipio: string;
  uf: string;
  estado: string;
  situacao: Situacao;
  endereco: EnderecoRevendedora;
  contatos?: ContatoRevendedora;
  anexos?: Array<{ id: string; nome: string; descricao: string }>;
  observacao?: string;
  profissionais: ProfissionalVinculado[];
}

const enderecoLavras: EnderecoRevendedora = {
  zona: "Urbana",
  cep: "37200-000",
  estado: "Minas Gerais",
  municipio: "Lavras",
  bairro: "Centro",
  endereco: "Rua Comendador José Esteves",
  numero: "420",
  complemento: "Loja 2",
  localidade: "Lavras",
  distrito: "Sede",
  latitude: "-21.2453",
  longitude: "-44.9998",
};

let revendedoras: Revendedora[] = [
  {
    id: 1,
    codigo: "3100000001",
    nome: "Revendedora São José",
    proprietarios: ["555.009.956-40 - José Aarão Neto"],
    responsaveis: ["129.555.656-99 - Messias Araujo", "444.009.956-40 - Josephina Arantes"],
    funcionarios: ["222.114.558-70 - Pedro Alves Moraes"],
    areaAtuacao: ["Animal", "Vegetal"],
    atuacoes: ["Revendedora de Vacinas sob Controle Oficial", "Revendedora de Sementes"],
    registroAnimal: "124556454",
    atuacoesAnimal: ["Revendedora de Vacinas sob Controle Oficial"],
    registroVegetal: "78541236",
    renasem: "MG-01234/2026",
    atuacoesVegetal: ["Revendedora de Sementes"],
    municipio: "Lavras",
    uf: "MG",
    estado: "Minas Gerais",
    situacao: "Ativo",
    endereco: enderecoLavras,
    contatos: {
      utilizarContatoProprietario: "Não",
      proprietariosSelecionados: [],
      emailFixo: "contato@revendedorasaojose.com.br",
      emailFixoObs: "Contato comercial principal.",
      telefoneFixo: "(35) 3821-4500",
      telefoneFixoObs: "Atendimento em horário comercial.",
      contatosAdicionais: [],
    },
    anexos: [{ id: "anexo-1", nome: "registro-estabelecimento.pdf", descricao: "Registro do estabelecimento" }],
    observacao: "Cadastro de demonstração para validação do fluxo.",
    profissionais: [
      { id: "prof-1", tipo: "Responsável Técnico Animal", nome: "Messias Araujo", documento: "129.555.656-99", dataArt: "2025-11-15", arquivoArt: "art-messias.pdf", situacao: "Ativo", atualizadoEm: "2026-07-10" },
      { id: "prof-2", tipo: "Responsável Técnico Vegetal", nome: "Josephina Arantes", documento: "444.009.956-40", dataArt: "2025-06-20", arquivoArt: "art-josephina.pdf", situacao: "Ativo", atualizadoEm: "2026-06-28" },
      { id: "prof-3", tipo: "Habilitado para Emissão de GTA", nome: "José Aarão Neto", documento: "555.009.956-40", situacao: "Ativo", atualizadoEm: "2026-05-19" },
      { id: "prof-4", tipo: "Funcionário", nome: "Pedro Alves Moraes", documento: "222.114.558-70", situacao: "Ativo", atualizadoEm: "2026-05-02" },
    ],
  },
  {
    id: 2,
    codigo: "3100000002",
    nome: "Agro Insumos Sul",
    proprietarios: ["12.345.678/0001-99 - Agro Pecuária Vale Verde Ltda"],
    responsaveis: ["333.221.115-09 - Marina Couto Dias"],
    funcionarios: ["222.114.558-70 - Pedro Alves Moraes"],
    areaAtuacao: ["Vegetal"],
    atuacoes: ["Revendedora de Sementes", "Revendedora de Agrotóxicos"],
    registroAnimal: "",
    atuacoesAnimal: [],
    registroVegetal: "9856321",
    renasem: "MG-05678/2026",
    atuacoesVegetal: ["Revendedora de Sementes", "Revendedora de Agrotóxicos"],
    municipio: "Varginha",
    uf: "MG",
    estado: "Minas Gerais",
    situacao: "Ativo",
    endereco: { ...enderecoLavras, municipio: "Varginha", localidade: "Varginha", cep: "37002-000" },
    profissionais: [],
  },
];

function formatarProfissional(item: ProfissionalVinculado) {
  return `${item.documento} - ${item.nome}`;
}

function sincronizarVinculos(revendedora: Revendedora): Revendedora {
  return {
    ...revendedora,
    responsaveis: revendedora.profissionais
      .filter((item) =>
        (item.tipo === "Responsável Técnico Animal" || item.tipo === "Responsável Técnico Vegetal")
        && item.situacao === "Ativo",
      )
      .map(formatarProfissional),
    funcionarios: revendedora.profissionais
      .filter((item) => item.tipo === "Funcionário" && item.situacao === "Ativo")
      .map(formatarProfissional),
  };
}

export function getRevendedoras() {
  return revendedoras.map((item) => ({ ...item }));
}

export function getRevendedora(id?: number) {
  return revendedoras.find((item) => item.id === id) ?? revendedoras[0];
}

export function adicionarRevendedora(
  dados: Omit<Revendedora, "id" | "codigo" | "responsaveis" | "funcionarios" | "profissionais">,
) {
  const codigoEstado = obterCodigoIbgeEstado(dados.estado);
  if (!codigoEstado) throw new Error("Estado inválido para geração do código da revendedora.");
  const maiorSequencial = revendedoras
    .filter((item) => item.codigo.startsWith(codigoEstado))
    .reduce((maior, item) => Math.max(maior, Number(item.codigo.slice(2)) || 0), 0);
  const sequencial = String(maiorSequencial + 1).padStart(8, "0");
  const nova: Revendedora = {
    ...dados,
    id: Math.max(0, ...revendedoras.map((item) => item.id)) + 1,
    codigo: `${codigoEstado}${sequencial}`,
    responsaveis: [],
    funcionarios: [],
    profissionais: [],
  };
  revendedoras = [...revendedoras, nova];
  return nova;
}

const ESTADOS = [
  ["Acre", "AC", "12", ["Rio Branco"]],
  ["Alagoas", "AL", "27", ["Maceió"]],
  ["Amapá", "AP", "16", ["Macapá"]],
  ["Amazonas", "AM", "13", ["Manaus"]],
  ["Bahia", "BA", "29", ["Salvador"]],
  ["Ceará", "CE", "23", ["Fortaleza"]],
  ["Distrito Federal", "DF", "53", ["Brasília"]],
  ["Espírito Santo", "ES", "32", ["Vitória"]],
  ["Goiás", "GO", "52", ["Goiânia"]],
  ["Maranhão", "MA", "21", ["São Luís"]],
  ["Mato Grosso", "MT", "51", ["Cuiabá"]],
  ["Mato Grosso do Sul", "MS", "50", ["Campo Grande"]],
  ["Minas Gerais", "MG", "31", ["Belo Horizonte", "Lavras", "Oliveira", "Uberlândia", "Varginha"]],
  ["Pará", "PA", "15", ["Belém"]],
  ["Paraíba", "PB", "25", ["João Pessoa"]],
  ["Paraná", "PR", "41", ["Curitiba"]],
  ["Pernambuco", "PE", "26", ["Recife"]],
  ["Piauí", "PI", "22", ["Teresina"]],
  ["Rio de Janeiro", "RJ", "33", ["Niterói", "Petrópolis", "Rio de Janeiro"]],
  ["Rio Grande do Norte", "RN", "24", ["Natal"]],
  ["Rio Grande do Sul", "RS", "43", ["Porto Alegre"]],
  ["Rondônia", "RO", "11", ["Porto Velho"]],
  ["Roraima", "RR", "14", ["Boa Vista"]],
  ["Santa Catarina", "SC", "42", ["Florianópolis"]],
  ["São Paulo", "SP", "35", ["Campinas", "Ribeirão Preto", "Santos", "São Paulo"]],
  ["Sergipe", "SE", "28", ["Aracaju"]],
  ["Tocantins", "TO", "17", ["Palmas"]],
] as const;

export const ESTADOS_BR = ESTADOS.map(([nome]) => nome);
export const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = Object.fromEntries(
  ESTADOS.map(([nome, , , municipios]) => [nome, [...municipios]]),
);

export function obterUfPorEstado(estado: string) {
  return ESTADOS.find(([nome]) => nome === estado)?.[1] || "";
}

export function obterCodigoIbgeEstado(estado: string) {
  return ESTADOS.find(([nome]) => nome === estado)?.[2] || "";
}

export function atualizarRevendedora(id: number, dados: Partial<Revendedora>) {
  let atualizada: Revendedora | undefined;
  revendedoras = revendedoras.map((item) => {
    if (item.id !== id) return item;
    atualizada = sincronizarVinculos({ ...item, ...dados });
    return atualizada;
  });
  return atualizada;
}

export function salvarProfissional(revendedoraId: number, profissional: ProfissionalVinculado) {
  const revendedora = getRevendedora(revendedoraId);
  const profissionais = revendedora.profissionais.some((item) => item.id === profissional.id)
    ? revendedora.profissionais.map((item) => item.id === profissional.id ? profissional : item)
    : [...revendedora.profissionais, profissional];
  const atualizada = atualizarRevendedora(revendedoraId, { profissionais });

  if (profissional.tipo === "Responsável Técnico Animal") {
    salvarResponsabilidadeTecnica({
      id: `revendedora-${revendedoraId}-${profissional.id}`,
      profissionalCpf: profissional.documento,
      profissionalNome: profissional.nome,
      entidadeTipo: "Revendedora de Produtos Agropecuários",
      entidadeCodigo: revendedora.codigo,
      entidadeNome: revendedora.nome,
      dataArt: profissional.dataArt || "",
      arquivoArt: profissional.arquivoArt || "",
      situacao: profissional.situacao,
      atualizadoEm: profissional.atualizadoEm,
    });
  }

  return atualizada;
}
