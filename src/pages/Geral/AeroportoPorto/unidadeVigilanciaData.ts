export type SituacaoUnidadeVigilancia = "Ativo" | "Inativo";

export interface ProprietarioUnidadeVigilancia {
  id: number | string;
  nome: string;
  documento: string;
  tipo: "Pessoa física" | "Pessoa jurídica";
  email?: string;
  telefone?: string;
}

export interface EnderecoUnidadeVigilancia {
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

export interface ContatosUnidadeVigilancia {
  utilizarContatoProprietario: string;
  proprietariosSelecionados: string[];
  emailFixo: string;
  emailFixoObs: string;
  telefoneFixo: string;
  telefoneFixoObs: string;
  contatosAdicionais: any[];
}

export interface AnexoUnidadeVigilancia {
  id: string;
  nome: string;
  descricao: string;
}

export interface UnidadeVigilanciaAgropecuaria {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: ProprietarioUnidadeVigilancia[];
  endereco: EnderecoUnidadeVigilancia;
  contatos: ContatosUnidadeVigilancia;
  anexos: AnexoUnidadeVigilancia[];
  observacao: string;
  situacao: SituacaoUnidadeVigilancia;
}

export const PROPRIETARIOS_UNIDADE_MOCK: ProprietarioUnidadeVigilancia[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física", email: "jose.aarao@email.com", telefone: "(31) 98888-1010" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física", email: "divino@email.com", telefone: "(35) 97777-2020" },
  { id: 3, nome: "Agro Cooperativa IMA", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica", email: "contato@agroima.com.br", telefone: "(31) 3333-4040" },
  { id: 4, nome: "Logística Sul S.A.", documento: "99.888.777/0001-00", tipo: "Pessoa jurídica", email: "contato@logisticasul.com.br", telefone: "(34) 3333-5050" },
];

const contatoVazio = (): ContatosUnidadeVigilancia => ({
  utilizarContatoProprietario: "Não",
  proprietariosSelecionados: [],
  emailFixo: "",
  emailFixoObs: "",
  telefoneFixo: "",
  telefoneFixoObs: "",
  contatosAdicionais: [],
});

export const criarEnderecoUnidade = (): EnderecoUnidadeVigilancia => ({
  zona: "Urbana",
  cep: "",
  estado: "Minas Gerais",
  municipio: "",
  bairro: "",
  endereco: "",
  numero: "",
  complemento: "",
  localidade: "",
  distrito: "",
  latitude: "",
  longitude: "",
});

export const UNIDADES_VIGILANCIA_MOCK: UnidadeVigilanciaAgropecuaria[] = [
  {
    id: 1,
    codigo: "3100000001",
    nome: "Unidade de Vigilância Agropecuária de Belo Horizonte",
    proprietarios: [PROPRIETARIOS_UNIDADE_MOCK[2]],
    endereco: { ...criarEnderecoUnidade(), cep: "30130-110", municipio: "Belo Horizonte", bairro: "Centro", endereco: "Avenida Afonso Pena", numero: "1000", latitude: "-19.9191", longitude: "-43.9386" },
    contatos: { ...contatoVazio(), emailFixo: "contato@uvabh.mg.gov.br", telefoneFixo: "(31) 3333-1010" },
    anexos: [{ id: "anexo-1", nome: "licenca_operacional.pdf", descricao: "Licença de operação e funcionamento" }],
    observacao: "Unidade responsável pela vigilância agropecuária da região metropolitana.",
    situacao: "Ativo",
  },
  {
    id: 2,
    codigo: "3100000002",
    nome: "Unidade de Vigilância Agropecuária de Uberlândia",
    proprietarios: [PROPRIETARIOS_UNIDADE_MOCK[3]],
    endereco: { ...criarEnderecoUnidade(), cep: "38400-100", municipio: "Uberlândia", bairro: "Centro", endereco: "Avenida João Pinheiro", numero: "800", latitude: "-18.9186", longitude: "-48.2772" },
    contatos: { ...contatoVazio(), emailFixo: "contato@uvaudi.mg.gov.br", telefoneFixo: "(34) 3333-2020" },
    anexos: [],
    observacao: "",
    situacao: "Ativo",
  },
  {
    id: 3,
    codigo: "3100000003",
    nome: "Unidade de Vigilância Agropecuária de Varginha",
    proprietarios: [PROPRIETARIOS_UNIDADE_MOCK[1]],
    endereco: { ...criarEnderecoUnidade(), municipio: "Varginha", bairro: "Centro", endereco: "Rua das Unidades", numero: "120" },
    contatos: contatoVazio(),
    anexos: [],
    observacao: "",
    situacao: "Inativo",
  },
];

export function gerarCodigoUnidadeVigilancia() {
  const maiorSequencial = UNIDADES_VIGILANCIA_MOCK.reduce(
    (maior, unidade) => Math.max(maior, Number(unidade.codigo.slice(2)) || 0),
    0,
  );
  return `31${String(maiorSequencial + 1).padStart(8, "0")}`;
}

export function listarUnidadesVigilancia() {
  return UNIDADES_VIGILANCIA_MOCK;
}

export function registrarUnidadeVigilancia(unidade: UnidadeVigilanciaAgropecuaria) {
  const indice = UNIDADES_VIGILANCIA_MOCK.findIndex((item) => item.id === unidade.id);
  if (indice >= 0) {
    UNIDADES_VIGILANCIA_MOCK[indice] = unidade;
  } else {
    UNIDADES_VIGILANCIA_MOCK.push(unidade);
  }
  return unidade;
}

export function novoContatoUnidade() {
  return contatoVazio();
}
