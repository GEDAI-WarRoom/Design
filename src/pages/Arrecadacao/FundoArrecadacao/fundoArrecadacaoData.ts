export type Situacao = "Ativo" | "Inativo";
export type TipoFundo = "Público" | "Privado";

export interface PessoaJuridicaFundo {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  proprietarios: Array<{
    id: string;
    nome: string;
    cpf: string;
    email?: string;
    telefone?: string;
  }>;
}

export interface EnderecoFundo {
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

export interface ContatosFundo {
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
}

export interface AnexoFundo {
  id: string;
  nome: string;
  descricao: string;
}

export interface Convenio {
  id: number;
  cadastradoEm: string;
  nome: string;
  numero: string;
  numeroCarteira: string;
  variacaoCarteira: string;
  tipoTitulo: string;
  numeroTitulo: string;
  descricao: string;
  codigoTipoContaCaucao: string;
  mensagemBloqueto: string;
  situacao: Situacao;
}

export interface FundoArrecadacao {
  id: number;
  pessoaJuridica: PessoaJuridicaFundo;
  nome: string;
  tipo: TipoFundo;
  endereco: EnderecoFundo;
  contatos: ContatosFundo;
  anexos: AnexoFundo[];
  observacao: string;
  situacao: Situacao;
  convenios: Convenio[];
}

export const TIPOS_FUNDO = [
  { value: "Público", label: "Público" },
  { value: "Privado", label: "Privado" },
];

export const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

export const PESSOAS_JURIDICAS_FUNDO: PessoaJuridicaFundo[] = [
  {
    id: 1,
    cnpj: "17.321.204/0001-62",
    razaoSocial: "Instituto Mineiro de Agropecuária",
    nomeFantasia: "Fundo Estadual de Defesa Agropecuária",
    proprietarios: [
      { id: "pj-1-1", nome: "Marcos Antônio Pereira", cpf: "083.654.216-09", email: "marcos.pereira@ima.mg.gov.br", telefone: "(31) 3915-8600" },
    ],
  },
  {
    id: 2,
    cnpj: "42.781.539/0001-08",
    razaoSocial: "Associação Mineira de Produtores Rurais",
    nomeFantasia: "Fundo Mineiro de Apoio ao Produtor",
    proprietarios: [
      { id: "pj-2-1", nome: "Helena Souza Martins", cpf: "148.327.956-40", email: "helena@ampr.org.br", telefone: "(31) 3344-2211" },
      { id: "pj-2-2", nome: "Rafael Oliveira Lima", cpf: "274.963.158-70", email: "rafael@ampr.org.br", telefone: "(31) 98811-4520" },
    ],
  },
  {
    id: 3,
    cnpj: "09.635.147/0001-91",
    razaoSocial: "Cooperativa Agropecuária do Sul de Minas Ltda",
    nomeFantasia: "Fundo CoopSul de Arrecadação",
    proprietarios: [
      { id: "pj-3-1", nome: "Ana Cláudia Rezende", cpf: "312.907.486-12", email: "ana.rezende@coopsul.com.br", telefone: "(35) 3222-1090" },
    ],
  },
];

export const emptyEndereco = (): EnderecoFundo => ({
  zona: "",
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

export const emptyContatos = (): ContatosFundo => ({
  utilizarContatoProprietario: "Não",
  proprietariosSelecionados: [],
  emailFixo: "",
  emailFixoObs: "",
  telefoneFixo: "",
  telefoneFixoObs: "",
  contatosAdicionais: [],
});

export const emptyConvenio = (): Omit<Convenio, "id"> => ({
  cadastradoEm: new Date().toISOString().slice(0, 10),
  nome: "",
  numero: "",
  numeroCarteira: "",
  variacaoCarteira: "",
  tipoTitulo: "",
  numeroTitulo: "",
  descricao: "",
  codigoTipoContaCaucao: "",
  mensagemBloqueto: "",
  situacao: "Ativo",
});

export const FUNDOS_ARRECADACAO_MOCK: FundoArrecadacao[] = [
  {
    id: 1,
    pessoaJuridica: PESSOAS_JURIDICAS_FUNDO[0],
    nome: "Fundo Estadual de Defesa Agropecuária",
    tipo: "Público",
    endereco: {
      zona: "Urbana", cep: "31.270-901", estado: "Minas Gerais", municipio: "Belo Horizonte", bairro: "Cidade Nova",
      endereco: "Avenida dos Andradas", numero: "1220", complemento: "8º andar", localidade: "", distrito: "", latitude: "-19.9091", longitude: "-43.9265",
    },
    contatos: {
      utilizarContatoProprietario: "Sim", proprietariosSelecionados: ["pj-1-1"], emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
    },
    anexos: [{ id: "anexo-1", nome: "regulamento-fundo.pdf", descricao: "Regulamento de constituição do fundo" }],
    observacao: "Fundo destinado ao custeio de ações de defesa sanitária animal e vegetal.",
    situacao: "Ativo",
    convenios: [
      {
        id: 1, cadastradoEm: "2026-07-16", nome: "Convênio Banco Estadual", numero: "1047852", numeroCarteira: "17", variacaoCarteira: "019", tipoTitulo: "Duplicata de serviço",
        numeroTitulo: "IMA-2026-001", descricao: "Arrecadação de taxas de defesa agropecuária", codigoTipoContaCaucao: "1", mensagemBloqueto: "Não receber após o vencimento", situacao: "Ativo",
      },
    ],
  },
  {
    id: 2,
    pessoaJuridica: PESSOAS_JURIDICAS_FUNDO[1],
    nome: "Fundo Mineiro de Apoio ao Produtor",
    tipo: "Privado",
    endereco: {
      zona: "Urbana", cep: "30.140-071", estado: "Minas Gerais", municipio: "Belo Horizonte", bairro: "Funcionários",
      endereco: "Rua Pernambuco", numero: "780", complemento: "Sala 401", localidade: "", distrito: "", latitude: "-19.9346", longitude: "-43.9361",
    },
    contatos: {
      utilizarContatoProprietario: "Não", proprietariosSelecionados: [], emailFixo: "contato@ampr.org.br", emailFixoObs: "Contato administrativo", telefoneFixo: "(31) 3344-2211", telefoneFixoObs: "", contatosAdicionais: [],
    },
    anexos: [],
    observacao: "",
    situacao: "Ativo",
    convenios: [],
  },
  {
    id: 3,
    pessoaJuridica: PESSOAS_JURIDICAS_FUNDO[2],
    nome: "Fundo CoopSul de Arrecadação",
    tipo: "Privado",
    endereco: {
      zona: "Rural", cep: "", estado: "Minas Gerais", municipio: "Lavras", bairro: "",
      endereco: "Rodovia BR-265, km 346", numero: "", complemento: "", localidade: "Serrinha", distrito: "", latitude: "-21.2450", longitude: "-44.9997",
    },
    contatos: {
      utilizarContatoProprietario: "Sim", proprietariosSelecionados: ["pj-3-1"], emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
    },
    anexos: [],
    observacao: "Cadastro temporariamente inativo para revisão documental.",
    situacao: "Inativo",
    convenios: [],
  },
];

export function adicionarFundo(dados: Omit<FundoArrecadacao, "id" | "nome">): FundoArrecadacao {
  const novo: FundoArrecadacao = {
    ...dados,
    id: Math.max(0, ...FUNDOS_ARRECADACAO_MOCK.map((item) => item.id)) + 1,
    nome: dados.pessoaJuridica.nomeFantasia || dados.pessoaJuridica.razaoSocial,
  };
  FUNDOS_ARRECADACAO_MOCK.unshift(novo);
  return novo;
}

export function atualizarFundo(fundo: FundoArrecadacao): FundoArrecadacao {
  const index = FUNDOS_ARRECADACAO_MOCK.findIndex((item) => item.id === fundo.id);
  if (index >= 0) FUNDOS_ARRECADACAO_MOCK[index] = fundo;
  return fundo;
}

export function adicionarConvenio(fundoId: number, dados: Omit<Convenio, "id">): Convenio {
  const fundo = FUNDOS_ARRECADACAO_MOCK.find((item) => item.id === fundoId);
  const convenio: Convenio = {
    ...dados,
    id: Math.max(0, ...(fundo?.convenios || []).map((item) => item.id)) + 1,
  };
  if (fundo) fundo.convenios = [...fundo.convenios, convenio];
  return convenio;
}

export function atualizarConvenio(fundoId: number, convenio: Convenio): Convenio {
  const fundo = FUNDOS_ARRECADACAO_MOCK.find((item) => item.id === fundoId);
  if (fundo) fundo.convenios = fundo.convenios.map((item) => item.id === convenio.id ? convenio : item);
  return convenio;
}
