export type TipoClassificacao = "Animal" | "Vegetal";

export interface ClassificacaoMunicipio {
  id: string;
  municipio: string;
  classificacao: string;
}

export interface ClassificacaoSanitariaEstado {
  id: number;
  estado: string;
  classificacao: string;
  tipo: TipoClassificacao | "";
  doenca: string;
  praga: string;
  municipios: ClassificacaoMunicipio[];
}

export const CLASSIFICACOES_SANITARIAS = [
  { value: "BR-D", label: "BR-D-Risco Desprezível" },
  { value: "BR-1", label: "BR-1-Risco Mínimo" },
  { value: "BR-2", label: "BR-2-Risco Baixo" },
  { value: "MULTIPLAS", label: "Duas ou mais Categorias de Classificação" },
  { value: "BR-4", label: "BR-4 Alto Risco" },
  { value: "BR-3", label: "BR-3 Risco Médio" },
  { value: "BR-NC", label: "BR-NC-Risco Não Conhecido ou Não Classificado" },
];

export const ESTADOS_BRASILEIROS = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
].map((estado) => ({ value: estado, label: estado }));

export const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  Acre: ["Cruzeiro do Sul", "Rio Branco"],
  Alagoas: ["Arapiraca", "Maceió"],
  Amapá: ["Macapá", "Santana"],
  Amazonas: ["Manaus", "Parintins"],
  Bahia: ["Feira de Santana", "Salvador"],
  Ceará: ["Fortaleza", "Juazeiro do Norte"],
  "Distrito Federal": ["Brasília"],
  "Espírito Santo": ["Vila Velha", "Vitória"],
  Goiás: ["Anápolis", "Goiânia"],
  Maranhão: ["Imperatriz", "São Luís"],
  "Mato Grosso": ["Cuiabá", "Rondonópolis"],
  "Mato Grosso do Sul": ["Campo Grande", "Dourados"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia"],
  Pará: ["Belém", "Santarém"],
  Paraíba: ["Campina Grande", "João Pessoa"],
  Paraná: ["Curitiba", "Londrina"],
  Pernambuco: ["Caruaru", "Recife"],
  Piauí: ["Parnaíba", "Teresina"],
  "Rio de Janeiro": ["Campos dos Goytacazes", "Rio de Janeiro"],
  "Rio Grande do Norte": ["Mossoró", "Natal"],
  "Rio Grande do Sul": ["Caxias do Sul", "Porto Alegre"],
  Rondônia: ["Ji-Paraná", "Porto Velho"],
  Roraima: ["Boa Vista", "Rorainópolis"],
  "Santa Catarina": ["Chapecó", "Florianópolis"],
  "São Paulo": ["Campinas", "São Paulo"],
  Sergipe: ["Aracaju", "Itabaiana"],
  Tocantins: ["Araguaína", "Palmas"],
};

export const PRAGAS_MOCK = [
  { id: 1, codigo: "P01", nome: "Mosca-das-frutas" },
  { id: 2, codigo: "P02", nome: "Bicudo-do-algodoeiro" },
  { id: 3, codigo: "P03", nome: "Ferrugem asiática da soja" },
  { id: 4, codigo: "P04", nome: "Sigatoka-negra" },
];

export const CLASSIFICACOES_SANITARIAS_MOCK: ClassificacaoSanitariaEstado[] = [
  {
    id: 1,
    estado: "Minas Gerais",
    classificacao: "BR-1",
    tipo: "Animal",
    doenca: "Febre Aftosa",
    praga: "",
    municipios: [
      { id: "municipio-1", municipio: "Uberlândia", classificacao: "BR-D" },
    ],
  },
  {
    id: 2,
    estado: "São Paulo",
    classificacao: "BR-2",
    tipo: "Vegetal",
    doenca: "",
    praga: "Mosca-das-frutas",
    municipios: [],
  },
];

let proximoId = CLASSIFICACOES_SANITARIAS_MOCK.length + 1;

export function adicionarClassificacaoSanitaria(
  classificacao: Omit<ClassificacaoSanitariaEstado, "id">,
) {
  const novaClassificacao = { ...classificacao, id: proximoId++ };
  CLASSIFICACOES_SANITARIAS_MOCK.push(novaClassificacao);
  return novaClassificacao;
}

export function atualizarClassificacaoSanitaria(
  classificacao: ClassificacaoSanitariaEstado,
) {
  const index = CLASSIFICACOES_SANITARIAS_MOCK.findIndex(
    (item) => item.id === classificacao.id,
  );
  if (index >= 0) CLASSIFICACOES_SANITARIAS_MOCK[index] = classificacao;
  return classificacao;
}

export const classificacaoSanitariaLabel = (value: string) =>
  CLASSIFICACOES_SANITARIAS.find((item) => item.value === value)?.label ?? value;

export const agravoLabel = (item: ClassificacaoSanitariaEstado) =>
  item.tipo === "Animal" ? item.doenca : item.praga;
