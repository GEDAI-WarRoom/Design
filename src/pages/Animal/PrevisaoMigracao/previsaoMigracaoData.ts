export type SituacaoPrevisaoMigracao = "Ativo" | "Inativo";

export interface CulturaPrevisaoMigracao {
  id: number;
  codigo: string;
  nome: string;
}

export interface PrevisaoMigracao {
  id: number;
  nucleoCodigo: string;
  estado: string;
  uf: string;
  municipio: string;
  data: string;
  cadastradoEm: string;
  culturas: CulturaPrevisaoMigracao[];
  situacao: SituacaoPrevisaoMigracao;
  encerrada?: boolean;
}

export interface NucleoPrevisaoMigracao {
  codigo: string;
  nome: string;
  grupo: string;
  especie: string;
  abFluxo: string;
}

export const NUCLEO_PREVISAO_PADRAO: NucleoPrevisaoMigracao = {
  codigo: "42001040005000101",
  nome: "Apiário Bom Jardim",
  grupo: "Abelhas",
  especie: "Abelha com Ferrão",
  abFluxo: "Migratório",
};

export const CULTURAS_PREVISAO_MOCK: CulturaPrevisaoMigracao[] = [
  { id: 1, codigo: "343", nome: "Abóbora" },
  { id: 2, codigo: "344", nome: "Café" },
  { id: 3, codigo: "345", nome: "Milho" },
  { id: 4, codigo: "346", nome: "Laranja" },
  { id: 5, codigo: "347", nome: "Mandioca" },
];

export const ESTADOS_PREVISAO = [
  { value: "Acre", label: "Acre" },
  { value: "Alagoas", label: "Alagoas" },
  { value: "Amapá", label: "Amapá" },
  { value: "Amazonas", label: "Amazonas" },
  { value: "Bahia", label: "Bahia" },
  { value: "Ceará", label: "Ceará" },
  { value: "Distrito Federal", label: "Distrito Federal" },
  { value: "Espírito Santo", label: "Espírito Santo" },
  { value: "Goiás", label: "Goiás" },
  { value: "Maranhão", label: "Maranhão" },
  { value: "Mato Grosso", label: "Mato Grosso" },
  { value: "Mato Grosso do Sul", label: "Mato Grosso do Sul" },
  { value: "Minas Gerais", label: "Minas Gerais" },
  { value: "Pará", label: "Pará" },
  { value: "Paraíba", label: "Paraíba" },
  { value: "Paraná", label: "Paraná" },
  { value: "Pernambuco", label: "Pernambuco" },
  { value: "Piauí", label: "Piauí" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "Rio Grande do Norte", label: "Rio Grande do Norte" },
  { value: "Rio Grande do Sul", label: "Rio Grande do Sul" },
  { value: "Rondônia", label: "Rondônia" },
  { value: "Roraima", label: "Roraima" },
  { value: "Santa Catarina", label: "Santa Catarina" },
  { value: "São Paulo", label: "São Paulo" },
  { value: "Sergipe", label: "Sergipe" },
  { value: "Tocantins", label: "Tocantins" },
];

const UFS_POR_ESTADO: Record<string, string> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA",
  Ceará: "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", Goiás: "GO",
  Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR",
  Pernambuco: "PE", Piauí: "PI", "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", Rondônia: "RO",
  Roraima: "RR", "Santa Catarina": "SC", "São Paulo": "SP", Sergipe: "SE",
  Tocantins: "TO",
};

export const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  Acre: ["Rio Branco", "Cruzeiro do Sul"],
  Alagoas: ["Maceió", "Arapiraca"],
  Amapá: ["Macapá", "Santana"],
  Amazonas: ["Manaus", "Parintins"],
  Bahia: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  Ceará: ["Fortaleza", "Juazeiro do Norte", "Sobral"],
  "Distrito Federal": ["Brasília"],
  "Espírito Santo": ["Vitória", "Vila Velha", "Linhares"],
  Goiás: ["Goiânia", "Anápolis", "Rio Verde"],
  Maranhão: ["São Luís", "Imperatriz"],
  "Mato Grosso": ["Cuiabá", "Rondonópolis", "Sinop"],
  "Mato Grosso do Sul": ["Campo Grande", "Dourados"],
  "Minas Gerais": ["Belo Horizonte", "Campo Belo", "Lavras", "Oliveira", "Uberlândia", "Varginha"],
  Pará: ["Belém", "Santarém"],
  Paraíba: ["João Pessoa", "Campina Grande"],
  Paraná: ["Curitiba", "Cascavel", "Londrina"],
  Pernambuco: ["Recife", "Petrolina"],
  Piauí: ["Teresina", "Parnaíba"],
  "Rio de Janeiro": ["Rio de Janeiro", "Campos dos Goytacazes"],
  "Rio Grande do Norte": ["Natal", "Mossoró"],
  "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas"],
  Rondônia: ["Porto Velho", "Ji-Paraná"],
  Roraima: ["Boa Vista"],
  "Santa Catarina": ["Florianópolis", "Chapecó", "Joinville"],
  "São Paulo": ["São Paulo", "Campinas", "Ribeirão Preto"],
  Sergipe: ["Aracaju", "Itabaiana"],
  Tocantins: ["Palmas", "Araguaína"],
};

const PREVISOES_MOCK: PrevisaoMigracao[] = [
  {
    id: 1,
    nucleoCodigo: NUCLEO_PREVISAO_PADRAO.codigo,
    estado: "Minas Gerais",
    uf: "MG",
    municipio: "Lavras",
    data: "2026-08-20",
    cadastradoEm: "2026-07-16",
    culturas: [CULTURAS_PREVISAO_MOCK[0], CULTURAS_PREVISAO_MOCK[4]],
    situacao: "Ativo",
  },
  {
    id: 2,
    nucleoCodigo: NUCLEO_PREVISAO_PADRAO.codigo,
    estado: "Minas Gerais",
    uf: "MG",
    municipio: "Lavras",
    data: "2026-03-20",
    cadastradoEm: "2026-02-20",
    culturas: [CULTURAS_PREVISAO_MOCK[1]],
    situacao: "Inativo",
  },
];

let nextId = PREVISOES_MOCK.length + 1;

const hojeIso = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

function sincronizarSituacao(previsao: PrevisaoMigracao) {
  previsao.situacao = previsao.encerrada || previsao.data <= hojeIso() ? "Inativo" : "Ativo";
  return previsao;
}

export function normalizarNucleoPrevisao(dados?: any): NucleoPrevisaoMigracao {
  const nucleo = dados?.nucleo ?? dados ?? {};
  return {
    codigo: nucleo.codigo ?? NUCLEO_PREVISAO_PADRAO.codigo,
    nome: nucleo.nome ?? NUCLEO_PREVISAO_PADRAO.nome,
    grupo: nucleo.grupo ?? NUCLEO_PREVISAO_PADRAO.grupo,
    especie: nucleo.especie ?? NUCLEO_PREVISAO_PADRAO.especie,
    abFluxo: nucleo.abFluxo ?? NUCLEO_PREVISAO_PADRAO.abFluxo,
  };
}

export function nucleoPermitePrevisao(nucleo: NucleoPrevisaoMigracao) {
  return nucleo.grupo === "Abelhas" && nucleo.abFluxo === "Migratório";
}

export function obterUfEstado(estado: string) {
  return UFS_POR_ESTADO[estado] ?? "";
}

export function listarPrevisoesMigracao(nucleoCodigo: string) {
  return PREVISOES_MOCK
    .filter((previsao) => previsao.nucleoCodigo === nucleoCodigo)
    .map(sincronizarSituacao);
}

export function obterPrevisaoMigracao(id?: number | null) {
  const previsao = id == null ? PREVISOES_MOCK[0] : PREVISOES_MOCK.find((item) => item.id === id);
  return previsao ? sincronizarSituacao(previsao) : null;
}

export function criarPrevisaoMigracao(
  dados: Omit<PrevisaoMigracao, "id" | "situacao" | "uf" | "cadastradoEm">,
) {
  const novaEhAtiva = dados.data > hojeIso();
  if (novaEhAtiva) {
    listarPrevisoesMigracao(dados.nucleoCodigo)
      .filter((previsao) => previsao.situacao === "Ativo")
      .forEach((previsao) => {
        previsao.encerrada = true;
        previsao.situacao = "Inativo";
      });
  }

  const nova: PrevisaoMigracao = sincronizarSituacao({
    id: nextId++,
    ...dados,
    cadastradoEm: hojeIso(),
    uf: obterUfEstado(dados.estado),
    situacao: "Ativo",
  });
  PREVISOES_MOCK.unshift(nova);
  return nova;
}

export function atualizarPrevisaoMigracao(
  id: number,
  dados: Pick<PrevisaoMigracao, "estado" | "municipio" | "data" | "culturas">,
) {
  const index = PREVISOES_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const atual = PREVISOES_MOCK[index];
  const atualizada = sincronizarSituacao({
    ...atual,
    ...dados,
    uf: obterUfEstado(dados.estado),
    encerrada: atual.encerrada && dados.data > hojeIso() ? atual.encerrada : undefined,
  });

  if (atualizada.situacao === "Ativo") {
    listarPrevisoesMigracao(atualizada.nucleoCodigo)
      .filter((previsao) => previsao.id !== id && previsao.situacao === "Ativo")
      .forEach((previsao) => {
        previsao.encerrada = true;
        previsao.situacao = "Inativo";
      });
  }

  PREVISOES_MOCK[index] = atualizada;
  return atualizada;
}

export function formatarDataPrevisao(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarCulturasPrevisao(culturas: CulturaPrevisaoMigracao[]) {
  return culturas.length ? culturas.map((cultura) => cultura.nome).join(", ") : "-";
}
