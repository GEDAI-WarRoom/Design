import {
  ESTABELECIMENTOS_MOCK,
  PRODUTORES_MOCK,
} from "../../../components/ui/EntitySearch";

export type SituacaoLocalExame = "Ativo" | "Inativo";

export interface ProprietarioLocalExame {
  id: number;
  nome: string;
  documento: string;
  tipo: string;
}

export interface EstabelecimentoLocalExame {
  id: number;
  codigo: string;
  nome: string;
  municipio: string;
}

export interface EnderecoLocalExame {
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

export interface MedicoVeterinarioExame {
  id: number;
  nome: string;
  cpf: string;
  exames: string[];
  examesFormatados: string;
  habilitado: boolean;
  localId: number | null;
}

export interface LocalRealizacaoExame {
  id: number;
  codigo: string;
  proprietarios: ProprietarioLocalExame[];
  localizadoEmEstabelecimento: boolean;
  estabelecimento: EstabelecimentoLocalExame | null;
  endereco: EnderecoLocalExame;
  veterinarios: MedicoVeterinarioExame[];
  situacao: SituacaoLocalExame;
}

export const SITUACOES_LOCAL_EXAME: { value: SituacaoLocalExame; label: string }[] = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

export const PROPRIETARIOS_LOCAL_EXAME = PRODUTORES_MOCK as ProprietarioLocalExame[];
export const ESTABELECIMENTOS_LOCAL_EXAME = ESTABELECIMENTOS_MOCK as EstabelecimentoLocalExame[];

export const VETERINARIOS_EXAME_MOCK: MedicoVeterinarioExame[] = [
  {
    id: 1,
    nome: "Dr. Carlos Eduardo Silva",
    cpf: "123.456.789-00",
    exames: ["Tuberculose", "Brucelose"],
    examesFormatados: "Tuberculose, Brucelose",
    habilitado: true,
    localId: 1,
  },
  {
    id: 2,
    nome: "Dra. Mariana Costa Alencar",
    cpf: "987.654.321-11",
    exames: ["Anemia Infecciosa Equina"],
    examesFormatados: "Anemia Infecciosa Equina",
    habilitado: true,
    localId: 2,
  },
  {
    id: 3,
    nome: "Dr. Roberto Antunes Vieira",
    cpf: "456.789.123-22",
    exames: ["Tuberculose"],
    examesFormatados: "Tuberculose",
    habilitado: true,
    localId: null,
  },
  {
    id: 4,
    nome: "Dra. Helena Martins Rocha",
    cpf: "321.654.987-33",
    exames: ["Brucelose", "Mormo"],
    examesFormatados: "Brucelose, Mormo",
    habilitado: true,
    localId: null,
  },
  {
    id: 5,
    nome: "Dr. Paulo Henrique Nunes",
    cpf: "741.852.963-44",
    exames: [],
    examesFormatados: "Sem habilitação vigente",
    habilitado: false,
    localId: null,
  },
];

const enderecoLavras: EnderecoLocalExame = {
  zona: "Urbana",
  cep: "37200-000",
  estado: "Minas Gerais",
  municipio: "Lavras",
  bairro: "Centro",
  endereco: "Rua Comendador José Esteves",
  numero: "320",
  complemento: "Sala 2",
  localidade: "Centro",
  distrito: "",
  latitude: "-21.2451",
  longitude: "-44.9998",
};

const enderecoUberlandia: EnderecoLocalExame = {
  zona: "Rural",
  cep: "",
  estado: "Minas Gerais",
  municipio: "Uberlândia",
  bairro: "",
  endereco: "Rodovia Municipal 455, km 12",
  numero: "",
  complemento: "",
  localidade: "Serrinha",
  distrito: "",
  latitude: "-18.9128",
  longitude: "-48.2755",
};

export const LOCAIS_REALIZACAO_EXAME_MOCK: LocalRealizacaoExame[] = [
  {
    id: 1,
    codigo: "3100000001",
    proprietarios: [PROPRIETARIOS_LOCAL_EXAME[0]],
    localizadoEmEstabelecimento: true,
    estabelecimento: ESTABELECIMENTOS_LOCAL_EXAME[0],
    endereco: enderecoLavras,
    veterinarios: [VETERINARIOS_EXAME_MOCK[0]],
    situacao: "Ativo",
  },
  {
    id: 2,
    codigo: "3100000002",
    proprietarios: [PROPRIETARIOS_LOCAL_EXAME[2]],
    localizadoEmEstabelecimento: false,
    estabelecimento: null,
    endereco: enderecoUberlandia,
    veterinarios: [VETERINARIOS_EXAME_MOCK[1]],
    situacao: "Ativo",
  },
  {
    id: 3,
    codigo: "3100000003",
    proprietarios: [PROPRIETARIOS_LOCAL_EXAME[1]],
    localizadoEmEstabelecimento: false,
    estabelecimento: null,
    endereco: { ...enderecoLavras, municipio: "Belo Horizonte", bairro: "Floresta" },
    veterinarios: [],
    situacao: "Inativo",
  },
];

let proximoId = LOCAIS_REALIZACAO_EXAME_MOCK.length + 1;

const CODIGO_UF: Record<string, string> = {
  "Minas Gerais": "31",
  "São Paulo": "35",
  "Rio de Janeiro": "33",
};

function gerarCodigo(estado: string) {
  const prefixo = CODIGO_UF[estado] ?? "31";
  const sequenciais = LOCAIS_REALIZACAO_EXAME_MOCK
    .filter((item) => item.codigo.startsWith(prefixo))
    .map((item) => Number(item.codigo.slice(2)))
    .filter(Number.isFinite);
  const proximoSequencial = (sequenciais.length ? Math.max(...sequenciais) : 0) + 1;
  return `${prefixo}${String(proximoSequencial).padStart(8, "0")}`;
}

export function listarLocaisRealizacaoExame() {
  return LOCAIS_REALIZACAO_EXAME_MOCK;
}

export function obterLocalRealizacaoExame(id?: number | null) {
  if (id == null) return LOCAIS_REALIZACAO_EXAME_MOCK[0] ?? null;
  return LOCAIS_REALIZACAO_EXAME_MOCK.find((item) => item.id === id) ?? null;
}

export function listarVeterinariosHabilitados(localId?: number | null) {
  return VETERINARIOS_EXAME_MOCK.filter(
    (item) => item.habilitado && (item.localId == null || item.localId === localId),
  );
}

export function criarLocalRealizacaoExame(
  dados: Omit<LocalRealizacaoExame, "id" | "codigo">,
) {
  const indisponivel = dados.veterinarios.find((selecionado) => {
    const cadastro = VETERINARIOS_EXAME_MOCK.find((item) => item.id === selecionado.id);
    return cadastro?.localId != null;
  });

  if (indisponivel) {
    throw new Error(`${indisponivel.nome} já está vinculado a outro local de realização de exame.`);
  }

  const id = proximoId++;
  const veterinarios = dados.veterinarios.map((selecionado) => {
    const cadastro = VETERINARIOS_EXAME_MOCK.find((item) => item.id === selecionado.id)!;
    cadastro.localId = id;
    return cadastro;
  });
  const novo: LocalRealizacaoExame = {
    ...dados,
    id,
    codigo: gerarCodigo(dados.endereco.estado),
    veterinarios,
  };

  LOCAIS_REALIZACAO_EXAME_MOCK.unshift(novo);
  return novo;
}

export function atualizarLocalRealizacaoExame(
  id: number,
  dados: Omit<LocalRealizacaoExame, "id" | "codigo" | "veterinarios">,
) {
  const index = LOCAIS_REALIZACAO_EXAME_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const atualizado = { ...LOCAIS_REALIZACAO_EXAME_MOCK[index], ...dados };
  LOCAIS_REALIZACAO_EXAME_MOCK[index] = atualizado;
  return atualizado;
}

export function formatarProprietarios(proprietarios: ProprietarioLocalExame[]) {
  return proprietarios.map((item) => `${item.documento} - ${item.nome}`).join("; ");
}
