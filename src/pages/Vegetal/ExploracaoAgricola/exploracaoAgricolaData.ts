import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";

export const COLECAO_EXPLORACOES_AGRICOLAS = "exploracoes-agricolas";

export interface EntidadeBasica {
  id: number;
  codigo: string;
  nome: string;
}

export interface EstabelecimentoAgricola extends EntidadeBasica {
  municipio: string;
  uf: string;
  proprietario: string;
  areaProdutivaHectares: number;
  latitude: string;
  longitude: string;
}

export interface ProdutorAgricola extends EntidadeBasica {
  documento: string;
  tipo: "PF" | "PJ";
}

export interface VariedadeCultura extends EntidadeBasica {
  cultura: string;
  unidadePadrao: string;
  pragas: string[];
}

export interface ResponsavelTecnico extends EntidadeBasica {
  documento: string;
  habilitacoes: string[];
}

export interface AnexoExploracao {
  id: string;
  nome: string;
  descricao: string;
}

export interface ExploracaoAgricola {
  id: string | number;
  codigo: string;
  estabelecimento: EstabelecimentoAgricola;
  unidadeArea: "Hectares" | "Metros Quadrados";
  areaProdutiva: string;
  areaUtil: string;
  produtores: ProdutorAgricola[];
  variedade: VariedadeCultura;
  unidadeMedida: string;
  dataPlantio: string;
  localizacaoLivro: string;
  unidadeProducao: "Sim" | "Não";
  dataVencimento: string;
  necessitaResponsavelTecnico: "Sim" | "Não";
  responsavelTecnico: ResponsavelTecnico | null;
  latitude: string;
  longitude: string;
  anexos: AnexoExploracao[];
  observacao: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

export const ESTABELECIMENTOS_AGRICOLAS_MOCK: EstabelecimentoAgricola[] = [
  { id: 1, codigo: "31002030039", nome: "Fazenda Rio Preto", municipio: "Lavras", uf: "MG", proprietario: "José Aarão Neto", areaProdutivaHectares: 1000, latitude: "-21.245817", longitude: "-44.998703" },
  { id: 2, codigo: "31001040005", nome: "Fazenda Santa Helena", municipio: "Varginha", uf: "MG", proprietario: "Agropecuária Vale Verde Ltda.", areaProdutivaHectares: 460.5, latitude: "-21.551295", longitude: "-45.430934" },
  { id: 3, codigo: "31016070001", nome: "Sítio Boa Esperança", municipio: "Abadia dos Dourados", uf: "MG", proprietario: "Divino de Souza Sobrinho", areaProdutivaHectares: 82.75, latitude: "-18.486101", longitude: "-47.403081" },
];

export const PRODUTORES_AGRICOLAS_MOCK: ProdutorAgricola[] = [
  { id: 1, codigo: "55500995640", nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, codigo: "44400995640", nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, codigo: "56338814000195", nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

export const VARIEDADES_CULTURA_MOCK: VariedadeCultura[] = [
  { id: 1, codigo: "VAR-001", nome: "Kabocha", cultura: "Abóbora", unidadePadrao: "kg", pragas: ["Mosca-branca"] },
  { id: 2, codigo: "VAR-002", nome: "Catuaí Vermelho", cultura: "Café", unidadePadrao: "kg", pragas: ["Broca-do-café", "Ferrugem-do-cafeeiro"] },
  { id: 3, codigo: "VAR-003", nome: "Tommy Atkins", cultura: "Manga", unidadePadrao: "kg", pragas: ["Mosca-das-frutas"] },
];

export const RESPONSAVEIS_TECNICOS_MOCK: ResponsavelTecnico[] = [
  { id: 1, codigo: "CREA-MG-123456", nome: "Flávio Silva", documento: "111.222.333-44", habilitacoes: ["Mosca-branca", "Broca-do-café", "Ferrugem-do-cafeeiro"] },
  { id: 2, codigo: "CREA-MG-654321", nome: "Renata Braga", documento: "222.333.444-55", habilitacoes: ["Mosca-das-frutas"] },
];

export const EXPLORACOES_AGRICOLAS_MOCK: ExploracaoAgricola[] = [
  {
    id: 1, codigo: "31002030039260001", estabelecimento: ESTABELECIMENTOS_AGRICOLAS_MOCK[0],
    unidadeArea: "Hectares", areaProdutiva: "1000,00", areaUtil: "20,00",
    produtores: [PRODUTORES_AGRICOLAS_MOCK[0]], variedade: VARIEDADES_CULTURA_MOCK[0], unidadeMedida: "kg",
    dataPlantio: "2026-01-10", localizacaoLivro: "Próximo ao balcão", unidadeProducao: "Sim",
    dataVencimento: "2027-01-10", necessitaResponsavelTecnico: "Sim", responsavelTecnico: RESPONSAVEIS_TECNICOS_MOCK[0],
    latitude: "-21.245817", longitude: "-44.998703", anexos: [], observacao: "Unidade de produção destinada ao cultivo de abóbora.", situacao: "Ativo",
  },
  {
    id: 2, codigo: "31001040005260001", estabelecimento: ESTABELECIMENTOS_AGRICOLAS_MOCK[1],
    unidadeArea: "Hectares", areaProdutiva: "460,50", areaUtil: "35,50",
    produtores: [PRODUTORES_AGRICOLAS_MOCK[2]], variedade: VARIEDADES_CULTURA_MOCK[1], unidadeMedida: "kg",
    dataPlantio: "2025-09-20", localizacaoLivro: "Arquivo técnico, pasta 14", unidadeProducao: "Não",
    dataVencimento: "", necessitaResponsavelTecnico: "Não", responsavelTecnico: null,
    latitude: "-21.551295", longitude: "-45.430934", anexos: [], observacao: "Exploração cafeeira em produção.", situacao: "Ativo",
  },
];

export const MUNICIPIOS_MG = ["Abadia dos Dourados", "Belo Horizonte", "Campo Belo", "Lavras", "Oliveira", "Uberlândia", "Varginha"];

export const formatarData = (valor: string) => {
  if (!valor) return "—";
  const [ano, mes, dia] = valor.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : valor;
};

export const adicionarUmAno = (valor: string) => {
  if (!valor) return "";
  const [ano, mes, dia] = valor.split("-").map(Number);
  return `${String(ano + 1).padStart(4, "0")}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
};

export const parseDecimal = (valor: string) => Number(valor.replace(/\./g, "").replace(",", ".")) || 0;
export const formatarDecimal = (valor: number) => valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const chaveHistoricoExploracaoAgricola = (id: string | number) => `exploracao-agricola:${id}`;

export function obterHistoricoExploracaoAgricola(registro: ExploracaoAgricola) {
  const inicial: HistoricoCadastroItem<ExploracaoAgricola>[] = [{
    id: `inicial-${registro.id}`,
    data: "10 jul. 2026",
    hora: "09:00",
    alteradoPor: "Sistema",
    atual: true,
    dados: registro,
  }];
  return carregarHistoricoCadastro(chaveHistoricoExploracaoAgricola(registro.id), inicial);
}
