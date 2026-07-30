export type SituacaoEtapaAtualizacao =
  | "Criada"
  | "Executando Abertura"
  | "Abertura Incompleta"
  | "Aberta"
  | "Fechada";

export interface EspecieEtapaAtualizacao {
  id: string;
  nome: string;
}

export interface EtapaVacinacaoVinculada {
  id: string;
  codigo: string;
  ano: number;
  situacao: "Criada" | "Aberta" | "Fechada";
  doencas: string[];
}

export interface EtapaAtualizacaoCadastral {
  id: number;
  codigo: string;
  ano: number;
  dataInicio: string;
  dataFim: string;
  especies: EspecieEtapaAtualizacao[];
  etapasVacinacao: EtapaVacinacaoVinculada[];
  situacao: SituacaoEtapaAtualizacao;
  progressoAbertura?: number;
}

export const SITUACOES_ETAPA_ATUALIZACAO = [
  { value: "Criada", label: "Criada" },
  { value: "Executando Abertura", label: "Executando Abertura" },
  { value: "Abertura Incompleta", label: "Abertura Incompleta" },
  { value: "Aberta", label: "Aberta" },
  { value: "Fechada", label: "Fechada" },
];

export const ESPECIES_ETAPA_ATUALIZACAO: EspecieEtapaAtualizacao[] = [
  { id: "bovino", nome: "Bovino" },
  { id: "bubalino", nome: "Bubalino" },
  { id: "caprino", nome: "Caprino" },
  { id: "equino", nome: "Equino" },
  { id: "ovino", nome: "Ovino" },
  { id: "suino", nome: "Suíno" },
  { id: "aves", nome: "Aves" },
  { id: "javali", nome: "Javali" },
];

export const ETAPAS_VACINACAO_DISPONIVEIS: EtapaVacinacaoVinculada[] = [
  {
    id: "etapa-vacinacao-2026-01",
    codigo: "2026/01",
    ano: 2026,
    situacao: "Fechada",
    doencas: ["Febre Aftosa"],
  },
  {
    id: "etapa-vacinacao-2026-02",
    codigo: "2026/02",
    ano: 2026,
    situacao: "Aberta",
    doencas: ["Brucelose", "Raiva dos Herbívoros"],
  },
  {
    id: "etapa-vacinacao-2026-03",
    codigo: "2026/03",
    ano: 2026,
    situacao: "Criada",
    doencas: ["Febre Aftosa", "Brucelose"],
  },
  {
    id: "etapa-vacinacao-2025-01",
    codigo: "2025/01",
    ano: 2025,
    situacao: "Fechada",
    doencas: ["Febre Aftosa"],
  },
  {
    id: "etapa-vacinacao-2024-01",
    codigo: "2024/01",
    ano: 2024,
    situacao: "Fechada",
    doencas: ["Raiva dos Herbívoros"],
  },
];

export const ETAPAS_ATUALIZACAO_CADASTRAL_MOCK: EtapaAtualizacaoCadastral[] = [
  {
    id: 1,
    codigo: "2026/01",
    ano: 2026,
    dataInicio: "2026-02-11",
    dataFim: "2026-12-12",
    especies: [
      ESPECIES_ETAPA_ATUALIZACAO[0],
      ESPECIES_ETAPA_ATUALIZACAO[1],
      ESPECIES_ETAPA_ATUALIZACAO[2],
    ],
    etapasVacinacao: [ETAPAS_VACINACAO_DISPONIVEIS[1]],
    situacao: "Executando Abertura",
    progressoAbertura: 66.6,
  },
  {
    id: 2,
    codigo: "2025/01",
    ano: 2025,
    dataInicio: "2025-02-11",
    dataFim: "2025-12-12",
    especies: [
      ESPECIES_ETAPA_ATUALIZACAO[0],
      ESPECIES_ETAPA_ATUALIZACAO[3],
    ],
    etapasVacinacao: [ETAPAS_VACINACAO_DISPONIVEIS[3]],
    situacao: "Criada",
  },
  {
    id: 3,
    codigo: "2024/01",
    ano: 2024,
    dataInicio: "2024-02-11",
    dataFim: "2024-12-12",
    especies: [
      ESPECIES_ETAPA_ATUALIZACAO[4],
      ESPECIES_ETAPA_ATUALIZACAO[5],
    ],
    etapasVacinacao: [ETAPAS_VACINACAO_DISPONIVEIS[4]],
    situacao: "Criada",
  },
];

let proximoId =
  Math.max(...ETAPAS_ATUALIZACAO_CADASTRAL_MOCK.map((item) => item.id)) + 1;

export function listarEtapasAtualizacaoCadastral() {
  return ETAPAS_ATUALIZACAO_CADASTRAL_MOCK;
}

export function obterEtapaAtualizacaoCadastral(id?: number | null) {
  if (id == null) return ETAPAS_ATUALIZACAO_CADASTRAL_MOCK[0] ?? null;
  return (
    ETAPAS_ATUALIZACAO_CADASTRAL_MOCK.find((item) => item.id === id) ?? null
  );
}

export function proximoCodigoEtapaAtualizacao(ano = new Date().getFullYear()) {
  const maiorSequencial = ETAPAS_ATUALIZACAO_CADASTRAL_MOCK.filter(
    (item) => item.ano === ano,
  ).reduce((maior, item) => {
    const sequencial = Number(item.codigo.split("/")[1]);
    return Number.isFinite(sequencial) ? Math.max(maior, sequencial) : maior;
  }, 0);

  return `${ano}/${String(maiorSequencial + 1).padStart(2, "0")}`;
}

export function criarEtapaAtualizacaoCadastral(
  dados: Omit<EtapaAtualizacaoCadastral, "id">,
) {
  const novo: EtapaAtualizacaoCadastral = {
    ...dados,
    id: proximoId++,
    situacao: "Criada",
    progressoAbertura: undefined,
  };

  ETAPAS_ATUALIZACAO_CADASTRAL_MOCK.unshift(novo);
  return novo;
}

export function atualizarEtapaAtualizacaoCadastral(
  dados: EtapaAtualizacaoCadastral,
) {
  const index = ETAPAS_ATUALIZACAO_CADASTRAL_MOCK.findIndex(
    (item) => item.id === dados.id,
  );
  if (index === -1) return null;

  ETAPAS_ATUALIZACAO_CADASTRAL_MOCK[index] = dados;
  return dados;
}

export function formatarDataEtapaAtualizacao(data: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}
