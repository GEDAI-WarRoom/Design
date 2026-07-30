export type SituacaoAjusteRebanho = "Ativo" | "Inativo";

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
  especie: string;
  grupo: string;
  estabelecimentoId: number;
  produtorId: number;
  possuiNucleos: boolean;
}

export interface NucleoRebanho {
  id: number;
  codigo: string;
  nome: string;
  exploracaoId: number;
}

export interface FaixaEtariaAjuste {
  id: string;
  faixaEtaria: string;
  machosExistentes: number;
  machosAjustados: number;
  femeasExistentes: number;
  femeasAjustadas: number;
}

export interface DocumentoAjusteRebanho {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  tamanho: number;
}

export interface AjusteRebanho {
  id: number;
  produtor: ProdutorRebanho;
  estabelecimento: EstabelecimentoRebanho;
  exploracao: ExploracaoRebanho;
  nucleo: NucleoRebanho | null;
  faixas: FaixaEtariaAjuste[];
  justificativa: string;
  documentos: DocumentoAjusteRebanho[];
  situacao: SituacaoAjusteRebanho;
  dataLancamento: string;
  podeInativar: boolean;
  atualizacaoPosterior?: string;
}

export const SITUACOES_AJUSTE_REBANHO = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

export const PRODUTORES_REBANHO_MOCK: ProdutorRebanho[] = [
  {
    id: 1,
    nome: "Divino de Souza Sobrinho",
    documento: "041.459.130-51",
    tipo: "PF",
  },
  {
    id: 2,
    nome: "Maria Silva Mendes",
    documento: "444.111.222-33",
    tipo: "PF",
  },
  {
    id: 3,
    nome: "Agropecuária Vale Verde Ltda.",
    documento: "12.345.678/0001-99",
    tipo: "PJ",
  },
];

export const ESTABELECIMENTOS_REBANHO_MOCK: EstabelecimentoRebanho[] = [
  {
    id: 1,
    codigo: "31012010247",
    nome: "Fazenda Rio Preto",
    municipio: "Lavras",
    produtorIds: [1],
  },
  {
    id: 2,
    codigo: "31012017457",
    nome: "Fazenda Santa Clara",
    municipio: "Varginha",
    produtorIds: [1, 3],
  },
  {
    id: 3,
    codigo: "31012019821",
    nome: "Granja Vale Verde",
    municipio: "Uberlândia",
    produtorIds: [2, 3],
  },
];

export const EXPLORACOES_REBANHO_MOCK: ExploracaoRebanho[] = [
  {
    id: 1,
    codigo: "31012010247001",
    especie: "Bovino",
    grupo: "Bovídeos",
    estabelecimentoId: 1,
    produtorId: 1,
    possuiNucleos: false,
  },
  {
    id: 2,
    codigo: "31012010247002",
    especie: "Suíno",
    grupo: "Suídeos",
    estabelecimentoId: 1,
    produtorId: 1,
    possuiNucleos: true,
  },
  {
    id: 3,
    codigo: "31012017457001",
    especie: "Frango",
    grupo: "Aves",
    estabelecimentoId: 2,
    produtorId: 1,
    possuiNucleos: true,
  },
  {
    id: 4,
    codigo: "31012019821001",
    especie: "Abelha com ferrão",
    grupo: "Abelhas",
    estabelecimentoId: 3,
    produtorId: 2,
    possuiNucleos: true,
  },
];

export const NUCLEOS_REBANHO_MOCK: NucleoRebanho[] = [
  {
    id: 1,
    codigo: "3101201024700201",
    nome: "Núcleo Setor A",
    exploracaoId: 2,
  },
  {
    id: 2,
    codigo: "3101201745700101",
    nome: "Núcleo Galpão Norte",
    exploracaoId: 3,
  },
  {
    id: 3,
    codigo: "3101201982100101",
    nome: "Apiário Central",
    exploracaoId: 4,
  },
];

const FAIXAS_POR_ESPECIE: Record<string, string[]> = {
  Bovino: [
    "De 0 a 12 meses",
    "De 13 a 24 meses",
    "De 25 a 36 meses",
    "Acima de 36 meses",
  ],
  Suíno: ["De 0 a 2 meses", "De 3 a 8 meses", "Acima de 8 meses"],
  Frango: ["Até 4 semanas", "De 5 a 12 semanas", "Acima de 12 semanas"],
  "Abelha com ferrão": ["Colmeias em formação", "Colmeias em produção"],
};

const EXISTENTES_POR_ESPECIE: Record<string, Array<[number, number]>> = {
  Bovino: [
    [12, 15],
    [18, 45],
    [12, 45],
    [16, 38],
  ],
  Suíno: [
    [24, 31],
    [19, 22],
    [8, 11],
  ],
  Frango: [
    [1200, 1250],
    [830, 910],
    [420, 450],
  ],
  "Abelha com ferrão": [
    [6, 4],
    [38, 42],
  ],
};

export function criarFaixasEtarias(
  especie: string,
  ajustados?: Array<[number, number]>,
): FaixaEtariaAjuste[] {
  const nomes = FAIXAS_POR_ESPECIE[especie] ?? ["Faixa etária única"];
  const existentes = EXISTENTES_POR_ESPECIE[especie] ?? [[0, 0]];

  return nomes.map((faixaEtaria, index) => ({
    id: `${especie.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    faixaEtaria,
    machosExistentes: existentes[index]?.[0] ?? 0,
    machosAjustados: ajustados?.[index]?.[0] ?? 0,
    femeasExistentes: existentes[index]?.[1] ?? 0,
    femeasAjustadas: ajustados?.[index]?.[1] ?? 0,
  }));
}

const documento = (
  id: string,
  nome: string,
  descricao: string,
): DocumentoAjusteRebanho => ({
  id,
  nome,
  descricao,
  tipo: "application/pdf",
  tamanho: 480_000,
});

export const AJUSTES_REBANHO_MOCK: AjusteRebanho[] = [
  {
    id: 1,
    produtor: PRODUTORES_REBANHO_MOCK[0],
    estabelecimento: ESTABELECIMENTOS_REBANHO_MOCK[0],
    exploracao: EXPLORACOES_REBANHO_MOCK[0],
    nucleo: null,
    faixas: criarFaixasEtarias("Bovino", [
      [14, 16],
      [18, 47],
      [13, 45],
      [16, 40],
    ]),
    justificativa:
      "Ajuste realizado após conferência presencial do rebanho durante fiscalização no estabelecimento.",
    documentos: [
      documento(
        "documento-ajuste-1",
        "relatorio-fiscalizacao-05022026.pdf",
        "Relatório da fiscalização",
      ),
    ],
    situacao: "Ativo",
    dataLancamento: "2026-02-05",
    podeInativar: true,
  },
  {
    id: 2,
    produtor: PRODUTORES_REBANHO_MOCK[0],
    estabelecimento: ESTABELECIMENTOS_REBANHO_MOCK[0],
    exploracao: EXPLORACOES_REBANHO_MOCK[1],
    nucleo: NUCLEOS_REBANHO_MOCK[0],
    faixas: criarFaixasEtarias("Suíno", [
      [26, 33],
      [21, 23],
      [9, 12],
    ]),
    justificativa:
      "Diferença identificada entre a escrituração e a contagem dos animais no núcleo.",
    documentos: [
      documento(
        "documento-ajuste-2",
        "termo-contagem-rebanho.pdf",
        "Termo de contagem",
      ),
    ],
    situacao: "Ativo",
    dataLancamento: "2026-01-07",
    podeInativar: false,
    atualizacaoPosterior:
      "Existe uma movimentação por GTA registrada em 12/01/2026.",
  },
  {
    id: 3,
    produtor: PRODUTORES_REBANHO_MOCK[0],
    estabelecimento: ESTABELECIMENTOS_REBANHO_MOCK[0],
    exploracao: EXPLORACOES_REBANHO_MOCK[0],
    nucleo: null,
    faixas: criarFaixasEtarias("Bovino", [
      [11, 14],
      [17, 43],
      [12, 44],
      [15, 37],
    ]),
    justificativa:
      "Cadastro histórico inativado após revisão do documento comprobatório.",
    documentos: [
      documento(
        "documento-ajuste-3",
        "revisao-ajuste.pdf",
        "Documento revisado",
      ),
    ],
    situacao: "Inativo",
    dataLancamento: "2026-01-07",
    podeInativar: false,
  },
];

let proximoId = Math.max(...AJUSTES_REBANHO_MOCK.map((item) => item.id)) + 1;

export function listarAjustesRebanho() {
  return AJUSTES_REBANHO_MOCK;
}

export function obterAjusteRebanho(id?: number | null) {
  if (id == null) return AJUSTES_REBANHO_MOCK[0] ?? null;
  return AJUSTES_REBANHO_MOCK.find((item) => item.id === id) ?? null;
}

export function criarAjusteRebanho(
  dados: Omit<
    AjusteRebanho,
    "id" | "situacao" | "dataLancamento" | "podeInativar"
  >,
) {
  const novo: AjusteRebanho = {
    ...dados,
    id: proximoId++,
    situacao: "Ativo",
    dataLancamento: new Date().toISOString().slice(0, 10),
    podeInativar: true,
  };
  AJUSTES_REBANHO_MOCK.unshift(novo);
  return novo;
}

export function atualizarSituacaoAjusteRebanho(
  id: number,
  situacao: SituacaoAjusteRebanho,
) {
  const index = AJUSTES_REBANHO_MOCK.findIndex((item) => item.id === id);
  if (index === -1) {
    return { registro: null, erro: "Ajuste de rebanho não encontrado." };
  }

  const atual = AJUSTES_REBANHO_MOCK[index];
  if (atual.situacao === "Inativo" && situacao === "Ativo") {
    return {
      registro: null,
      erro: "Um ajuste inativado não pode ser reativado.",
    };
  }

  if (situacao === "Inativo" && !atual.podeInativar) {
    return {
      registro: null,
      erro:
        atual.atualizacaoPosterior ??
        "O ajuste possui atualização posterior do rebanho e não pode ser inativado.",
    };
  }

  const atualizado = { ...atual, situacao };
  AJUSTES_REBANHO_MOCK[index] = atualizado;
  return { registro: atualizado, erro: "" };
}

export function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function totalMachos(faixas: FaixaEtariaAjuste[]) {
  return faixas.reduce((total, faixa) => total + faixa.machosAjustados, 0);
}

export function totalFemeas(faixas: FaixaEtariaAjuste[]) {
  return faixas.reduce((total, faixa) => total + faixa.femeasAjustadas, 0);
}

export function formatarLancamentos(
  faixas: FaixaEtariaAjuste[],
  sexo: "machos" | "femeas",
) {
  const chave =
    sexo === "machos" ? "machosAjustados" : "femeasAjustadas";
  return faixas.map((faixa) => ({
    faixa: faixa.faixaEtaria,
    quantidade: faixa[chave],
  }));
}
