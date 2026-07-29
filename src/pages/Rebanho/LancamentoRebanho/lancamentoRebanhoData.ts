export type TipoLancamentoRebanho =
  | "Mortalidade"
  | "Nascimento"
  | "Evolução de Rebanho"
  | "Roubo/Extravio"
  | "Descarte";

export type SituacaoLancamentoRebanho = "Ativo" | "Inativo";

export interface ProdutorRebanho {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

export interface EstabelecimentoRebanho {
  id: number;
  codigo: string;
  nome: string;
  municipio: string;
  produtorIds: number[];
}

export interface ExploracaoRebanho {
  id: number;
  codigo: string;
  estabelecimentoId: number;
  produtorId: number;
  especie: string;
  grupo: "Bovídeos" | "Aves" | "Suídeos" | "Abelhas";
  possuiNucleo: boolean;
  limiteMortalidadePercentual: number;
}

export interface NucleoRebanho {
  id: number;
  codigo: string;
  nome: string;
  exploracaoId: number;
}

export interface FaixaLancamentoRebanho {
  faixa: string;
  machosExistentes: number;
  machosInformados: number;
  femeasExistentes: number;
  femeasInformadas: number;
  femeasReprodutivas?: boolean;
}

export interface LancamentoPorTipo {
  tipo: TipoLancamentoRebanho;
  faixas: FaixaLancamentoRebanho[];
}

export interface LancamentoRebanho {
  id: number;
  produtor: ProdutorRebanho;
  estabelecimento: EstabelecimentoRebanho;
  exploracao: ExploracaoRebanho;
  nucleo: NucleoRebanho | null;
  lancamentos: LancamentoPorTipo[];
  justificativaMortalidade: string;
  documentosMortalidade: string[];
  justificativaRoubo: string;
  documentoRoubo: string;
  situacao: SituacaoLancamentoRebanho;
  dataLancamento: string;
  possuiAtualizacaoPosterior: boolean;
}

export const PRODUTORES_REBANHO_MOCK: ProdutorRebanho[] = [
  { id: 1, nome: "Divino de Souza Sobrinho", documento: "444.459.130-51", tipo: "PF" },
  { id: 2, nome: "Maria Silva Mendes", documento: "444.111.222-33", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

export const ESTABELECIMENTOS_REBANHO_MOCK: EstabelecimentoRebanho[] = [
  {
    id: 1,
    codigo: "31012010247",
    nome: "Fazenda Rio Preto",
    municipio: "Divino",
    produtorIds: [1],
  },
  {
    id: 2,
    codigo: "31001047457",
    nome: "Fazenda Santa Clara",
    municipio: "Lavras",
    produtorIds: [1, 2],
  },
  {
    id: 3,
    codigo: "31009456218",
    nome: "Granja Vale Verde",
    municipio: "Uberlândia",
    produtorIds: [3],
  },
];

export const EXPLORACOES_REBANHO_MOCK: ExploracaoRebanho[] = [
  {
    id: 1,
    codigo: "31012010247",
    estabelecimentoId: 1,
    produtorId: 1,
    especie: "Bovino",
    grupo: "Bovídeos",
    possuiNucleo: false,
    limiteMortalidadePercentual: 5,
  },
  {
    id: 2,
    codigo: "31012010247001",
    estabelecimentoId: 1,
    produtorId: 1,
    especie: "Suíno",
    grupo: "Suídeos",
    possuiNucleo: true,
    limiteMortalidadePercentual: 8,
  },
  {
    id: 3,
    codigo: "654521684",
    estabelecimentoId: 2,
    produtorId: 2,
    especie: "Frango",
    grupo: "Aves",
    possuiNucleo: true,
    limiteMortalidadePercentual: 8,
  },
  {
    id: 4,
    codigo: "31009456218001",
    estabelecimentoId: 3,
    produtorId: 3,
    especie: "Abelha com Ferrão",
    grupo: "Abelhas",
    possuiNucleo: true,
    limiteMortalidadePercentual: 10,
  },
];

export const NUCLEOS_REBANHO_MOCK: NucleoRebanho[] = [
  { id: 1, codigo: "3101201024700101", nome: "Núcleo Setor A", exploracaoId: 2 },
  { id: 2, codigo: "65452168401", nome: "Núcleo Aviário 01", exploracaoId: 3 },
  { id: 3, codigo: "3100945621800101", nome: "Apiário Central", exploracaoId: 4 },
];

const FAIXAS_BOVIDEOS = [
  { faixa: "De 0 até 2 meses", machosExistentes: 12, femeasExistentes: 14 },
  { faixa: "De 3 até 8 meses", machosExistentes: 18, femeasExistentes: 22 },
  { faixa: "De 8 até 12 meses", machosExistentes: 15, femeasExistentes: 19 },
  { faixa: "De 13 até 24 meses", machosExistentes: 10, femeasExistentes: 24, femeasReprodutivas: true },
  { faixa: "Acima de 24 meses", machosExistentes: 8, femeasExistentes: 38, femeasReprodutivas: true },
];

const FAIXAS_SUIDEOS = [
  { faixa: "De 0 até 2 meses", machosExistentes: 25, femeasExistentes: 28 },
  { faixa: "De 3 até 8 meses", machosExistentes: 18, femeasExistentes: 21 },
  { faixa: "Acima de 8 meses", machosExistentes: 9, femeasExistentes: 17, femeasReprodutivas: true },
];

const FAIXAS_AVES = [
  { faixa: "De 0 até 30 dias", machosExistentes: 240, femeasExistentes: 260 },
  { faixa: "De 31 até 90 dias", machosExistentes: 180, femeasExistentes: 220 },
  { faixa: "Acima de 90 dias", machosExistentes: 130, femeasExistentes: 280, femeasReprodutivas: true },
];

const FAIXAS_ABELHAS = [
  { faixa: "Colmeias em formação", machosExistentes: 8, femeasExistentes: 9 },
  { faixa: "Colmeias produtivas", machosExistentes: 16, femeasExistentes: 22, femeasReprodutivas: true },
];

export function criarFaixas(
  exploracao: ExploracaoRebanho,
  tipo: TipoLancamentoRebanho,
): FaixaLancamentoRebanho[] {
  const origem =
    exploracao.grupo === "Bovídeos"
      ? FAIXAS_BOVIDEOS
      : exploracao.grupo === "Suídeos"
        ? FAIXAS_SUIDEOS
        : exploracao.grupo === "Aves"
          ? FAIXAS_AVES
          : FAIXAS_ABELHAS;

  const faixas = tipo === "Nascimento" ? origem.slice(0, 1) : origem;
  return faixas.map((item) => ({
    ...item,
    machosInformados: 0,
    femeasInformadas: 0,
  }));
}

function lancamentoMock(
  id: number,
  produtor: ProdutorRebanho,
  estabelecimento: EstabelecimentoRebanho,
  exploracao: ExploracaoRebanho,
  nucleo: NucleoRebanho | null,
  tipo: TipoLancamentoRebanho,
  dataLancamento: string,
  valores: Array<[number, number]>,
  situacao: SituacaoLancamentoRebanho = "Ativo",
): LancamentoRebanho {
  const faixas = criarFaixas(exploracao, tipo).map((faixa, index) => ({
    ...faixa,
    machosInformados: valores[index]?.[0] ?? 0,
    femeasInformadas: valores[index]?.[1] ?? 0,
  }));
  return {
    id,
    produtor,
    estabelecimento,
    exploracao,
    nucleo,
    lancamentos: [{ tipo, faixas }],
    justificativaMortalidade: "",
    documentosMortalidade: [],
    justificativaRoubo: "",
    documentoRoubo: "",
    situacao,
    dataLancamento,
    possuiAtualizacaoPosterior: id === 1,
  };
}

export const LANCAMENTOS_REBANHO_MOCK: LancamentoRebanho[] = [
  lancamentoMock(
    1,
    PRODUTORES_REBANHO_MOCK[1],
    ESTABELECIMENTOS_REBANHO_MOCK[1],
    EXPLORACOES_REBANHO_MOCK[2],
    NUCLEOS_REBANHO_MOCK[1],
    "Nascimento",
    "2026-02-05",
    [[2, 2]],
  ),
  lancamentoMock(
    2,
    PRODUTORES_REBANHO_MOCK[0],
    ESTABELECIMENTOS_REBANHO_MOCK[0],
    EXPLORACOES_REBANHO_MOCK[1],
    NUCLEOS_REBANHO_MOCK[0],
    "Evolução de Rebanho",
    "2026-01-07",
    [[0, 0], [3, 3], [0, 0]],
  ),
  lancamentoMock(
    3,
    PRODUTORES_REBANHO_MOCK[0],
    ESTABELECIMENTOS_REBANHO_MOCK[0],
    EXPLORACOES_REBANHO_MOCK[0],
    null,
    "Evolução de Rebanho",
    "2026-01-07",
    [[0, 0], [3, 3], [1, 1], [0, 0], [0, 0]],
  ),
];

let proximoId = Math.max(...LANCAMENTOS_REBANHO_MOCK.map((item) => item.id)) + 1;

export function listarLancamentosRebanho() {
  return LANCAMENTOS_REBANHO_MOCK;
}

export function obterLancamentoRebanho(id?: number | null) {
  if (id == null) return LANCAMENTOS_REBANHO_MOCK[0] ?? null;
  return LANCAMENTOS_REBANHO_MOCK.find((item) => item.id === id) ?? null;
}

export function criarLancamentoRebanho(
  dados: Omit<LancamentoRebanho, "id" | "situacao" | "dataLancamento" | "possuiAtualizacaoPosterior">,
) {
  const novo: LancamentoRebanho = {
    ...dados,
    id: proximoId++,
    situacao: "Ativo",
    dataLancamento: new Date().toISOString().slice(0, 10),
    possuiAtualizacaoPosterior: false,
  };
  LANCAMENTOS_REBANHO_MOCK.unshift(novo);
  return novo;
}

export function inativarLancamentoRebanho(id: number) {
  const index = LANCAMENTOS_REBANHO_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return { registro: null, erro: "Lançamento não encontrado." };

  const registro = LANCAMENTOS_REBANHO_MOCK[index];
  if (registro.situacao === "Inativo") {
    return { registro: null, erro: "Este lançamento já está inativo." };
  }
  if (registro.possuiAtualizacaoPosterior) {
    return {
      registro: null,
      erro: "Não é possível inativar: existe uma atualização de rebanho posterior a este lançamento.",
    };
  }

  const atualizado: LancamentoRebanho = { ...registro, situacao: "Inativo" };
  LANCAMENTOS_REBANHO_MOCK[index] = atualizado;
  return { registro: atualizado, erro: "" };
}

export function tiposPermitidos(exploracao: ExploracaoRebanho | null) {
  const basicos: TipoLancamentoRebanho[] = [
    "Mortalidade",
    "Nascimento",
    "Evolução de Rebanho",
    "Roubo/Extravio",
    "Descarte",
  ];
  return exploracao?.grupo === "Aves" ? [...basicos,] : basicos;
}

export function calcularResultado(
  tipo: TipoLancamentoRebanho,
  faixas: FaixaLancamentoRebanho[],
  index: number,
  sexo: "machos" | "femeas",
) {
  const existente = sexo === "machos" ? faixas[index].machosExistentes : faixas[index].femeasExistentes;
  const informado = sexo === "machos" ? faixas[index].machosInformados : faixas[index].femeasInformadas;

  if (tipo === "Nascimento" ) return existente + informado;
  if (tipo === "Mortalidade" || tipo === "Roubo/Extravio" || tipo === "Descarte") {
    return existente - informado;
  }

  const recebido = index === 0 ? 0 : informado;
  const proxima = faixas[index + 1];
  const enviado = proxima
    ? sexo === "machos"
      ? proxima.machosInformados
      : proxima.femeasInformadas
    : 0;
  return existente + recebido - enviado;
}

export function formatarDataRebanho(data: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function resumirAnimais(
  registro: LancamentoRebanho,
  sexo: "machos" | "femeas",
) {
  return registro.lancamentos
    .flatMap((lancamento) =>
      lancamento.faixas
        .filter((faixa) =>
          sexo === "machos" ? faixa.machosInformados > 0 : faixa.femeasInformadas > 0,
        )
        .map((faixa) => {
          const quantidade = sexo === "machos" ? faixa.machosInformados : faixa.femeasInformadas;
          const sinal =
            lancamento.tipo === "Nascimento" || lancamento.tipo === "Evolução de Rebanho"
              ? "+"
              : "-";
          return `${faixa.faixa} (${sinal}${quantidade})`;
        }),
    )
    .join(", ");
}
