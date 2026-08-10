export type SituacaoRecolhimento =
  | "Novo"
  | "Pagamento boleto"
  | "Pagamento DAE"
  | "Pago"
  | "Cancelado";

export interface ContribuinteRecolhimento {
  id: number;
  nome: string;
  documento: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
}

export interface GTARecolhimento {
  numero: string;
  serie?: string;
  dataEmissao: string;
  finalidade: string;
  origem?: string;
  origemTipo?: "Estabelecimento" | "Pessoa";
  origemDocumento?: string;
  destino?: string;
  situacao: string;
  especie: string;
  totalAnimais: number;
  valorContribuicao: number;
}

export interface BoletoRecolhimento {
  id: number;
  fundoArrecadacao: string;
  convenio: string;
  numero: string;
  valor: number;
  situacaoPagamento: string;
  gtas: GTARecolhimento[];
}

export interface RecolhimentoMensalGTA {
  id: number;
  contribuinte: ContribuinteRecolhimento;
  anoReferencia: number;
  mesReferencia: number;
  situacao: SituacaoRecolhimento;
  dataVencimento?: string;
  boletos: BoletoRecolhimento[];
  daeEmitido: boolean;
  numeroDAE?: string;
  dataEmissaoDAE?: string;
}

export const CONTRIBUINTES_RECOLHIMENTO: ContribuinteRecolhimento[] = [
  { id: 1, nome: "Maria Aparecida de Souza", documento: "123.456.789-00", tipo: "Pessoa Física" },
  { id: 2, nome: "Agropecuária Campo Verde Ltda.", documento: "12.345.678/0001-90", tipo: "Pessoa Jurídica" },
  { id: 3, nome: "João Batista Ferreira", documento: "987.654.321-00", tipo: "Pessoa Física" },
  { id: 4, nome: "Fazenda Horizonte S.A.", documento: "45.678.901/0001-22", tipo: "Pessoa Jurídica" },
];

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const MESES_OPTIONS = MESES.map((mes, index) => ({
  value: String(index + 1),
  label: mes,
}));

export const SITUACOES_OPTIONS: { value: SituacaoRecolhimento; label: string }[] = [
  { value: "Novo", label: "Novo" },
  { value: "Pagamento boleto", label: "Pagamento boleto" },
  { value: "Pagamento DAE", label: "Pagamento DAE" },
  { value: "Pago", label: "Pago" },
  { value: "Cancelado", label: "Cancelado" },
];

const boletosMaria: BoletoRecolhimento[] = [
  {
    id: 1,
    fundoArrecadacao: "Fundo de Defesa Sanitária Animal de Minas Gerais",
    convenio: "Convênio IMA/FUNDEPEC",
    numero: "84670000001-8 42500024001-4",
    valor: 420.5,
    situacaoPagamento: "Pago",
    gtas: [
      { numero: "GTA-MG-2026-001284", serie: "AB", dataEmissao: "2026-06-04", finalidade: "Engorda", origem: "Fazenda Santa Clara", destino: "Frigorífico Vale do Rio", situacao: "Emitida", especie: "Bovina", totalAnimais: 35, valorContribuicao: 245.0 },
      { numero: "GTA-MG-2026-001311", serie: "AB", dataEmissao: "2026-06-11", finalidade: "Reprodução", origem: "Fazenda Santa Clara", destino: "Fazenda Boa Vista", situacao: "Emitida", especie: "Bovina", totalAnimais: 18, valorContribuicao: 175.5 },
    ],
  },
  {
    id: 2,
    fundoArrecadacao: "Fundo Estadual de Sanidade Animal",
    convenio: "Convênio IMA/FESA",
    numero: "84670000002-6 42500024002-2",
    valor: 250.25,
    situacaoPagamento: "Pago",
    gtas: [
      { numero: "GTA-MG-2026-001402", serie: "CD", dataEmissao: "2026-06-19", finalidade: "Abate", origem: "Granja Santa Luzia", destino: "Frigorífico Minas Sul", situacao: "Emitida", especie: "Suína", totalAnimais: 42, valorContribuicao: 250.25 },
    ],
  },
];

const boletosCampoVerde: BoletoRecolhimento[] = [
  {
    id: 3,
    fundoArrecadacao: "Fundo de Defesa Sanitária Animal de Minas Gerais",
    convenio: "Convênio IMA/FUNDEPEC",
    numero: "84670000003-4 42500024003-0",
    valor: 925.0,
    situacaoPagamento: "Aguardando pagamento",
    gtas: [
      { numero: "GTA-MG-2026-001587", serie: "EF", dataEmissao: "2026-07-03", finalidade: "Abate", origem: "Agropecuária Campo Verde", destino: "Frigorífico Campo Sul", situacao: "Emitida", especie: "Bovina", totalAnimais: 80, valorContribuicao: 560.0 },
      { numero: "GTA-MG-2026-001633", serie: "EF", dataEmissao: "2026-07-09", finalidade: "Engorda", origem: "João Batista Ferreira", origemTipo: "Pessoa", origemDocumento: "987.654.321-00", destino: "Unidade de Engorda Horizonte", situacao: "Emitida", especie: "Bovina", totalAnimais: 52, valorContribuicao: 365.0 },
    ],
  },
];

const copiarBoletos = (boletos: BoletoRecolhimento[]) =>
  boletos.map((boleto) => ({ ...boleto, gtas: boleto.gtas.map((gta) => ({ ...gta })) }));

export const RECOLHIMENTOS_MOCK: RecolhimentoMensalGTA[] = [
  {
    id: 1,
    contribuinte: CONTRIBUINTES_RECOLHIMENTO[0],
    anoReferencia: 2026,
    mesReferencia: 6,
    situacao: "Pago",
    dataVencimento: quintoDiaUtilDoMesSeguinte(2026, 6),
    boletos: copiarBoletos(boletosMaria),
    daeEmitido: true,
    numeroDAE: "DAE-2026-000184",
    dataEmissaoDAE: "2026-07-01",
  },
  {
    id: 2,
    contribuinte: CONTRIBUINTES_RECOLHIMENTO[1],
    anoReferencia: 2026,
    mesReferencia: 7,
    situacao: "Pagamento boleto",
    dataVencimento: quintoDiaUtilDoMesSeguinte(2026, 7),
    boletos: copiarBoletos(boletosCampoVerde),
    daeEmitido: false,
  },
  {
    id: 3,
    contribuinte: CONTRIBUINTES_RECOLHIMENTO[2],
    anoReferencia: 2026,
    mesReferencia: 5,
    situacao: "Novo",
    boletos: [],
    daeEmitido: false,
  },
];

let proximoId = RECOLHIMENTOS_MOCK.length + 1;

export const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatarData = (data?: string) => {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export function quintoDiaUtilDoMesSeguinte(ano: number, mes: number) {
  const data = new Date(Date.UTC(ano, mes, 1));
  let uteis = 0;
  while (uteis < 5) {
    const dia = data.getUTCDay();
    if (dia !== 0 && dia !== 6) uteis += 1;
    if (uteis < 5) data.setUTCDate(data.getUTCDate() + 1);
  }
  return data.toISOString().slice(0, 10);
}

export const valorTotalRecolhimento = (registro: RecolhimentoMensalGTA) =>
  registro.boletos.reduce((total, boleto) => total + boleto.valor, 0);

export const referenciaRecolhimento = (registro: RecolhimentoMensalGTA) =>
  `${MESES[registro.mesReferencia - 1].toUpperCase()} - ${registro.anoReferencia}`;

export function listarRecolhimentos() {
  return RECOLHIMENTOS_MOCK;
}

export function obterRecolhimento(id?: number | null) {
  if (id == null) return RECOLHIMENTOS_MOCK[0] ?? null;
  return RECOLHIMENTOS_MOCK.find((registro) => registro.id === id) ?? null;
}

function boletosDisponiveis(contribuinteId: number, ano: number, mes: number) {
  if (contribuinteId === 1 && ano === 2026 && mes === 6) return copiarBoletos(boletosMaria);
  if (contribuinteId === 2 && ano === 2026 && mes === 7) return copiarBoletos(boletosCampoVerde);
  return [];
}

export function criarRecolhimento(dados: {
  contribuinte: ContribuinteRecolhimento;
  anoReferencia: number;
  mesReferencia: number;
}) {
  const boletos = boletosDisponiveis(dados.contribuinte.id, dados.anoReferencia, dados.mesReferencia);
  const proximoVencimento = quintoDiaUtilDoMesSeguinte(dados.anoReferencia, dados.mesReferencia);
  const novo: RecolhimentoMensalGTA = {
    id: proximoId++,
    ...dados,
    situacao: boletos.length ? "Pagamento boleto" : "Novo",
    dataVencimento: boletos.length ? proximoVencimento : undefined,
    boletos,
    daeEmitido: false,
  };
  RECOLHIMENTOS_MOCK.unshift(novo);
  return novo;
}

export function emitirDAE(id: number) {
  const indice = RECOLHIMENTOS_MOCK.findIndex((registro) => registro.id === id);
  if (indice < 0 || RECOLHIMENTOS_MOCK[indice].boletos.length === 0) return null;
  const atual = RECOLHIMENTOS_MOCK[indice];
  const atualizado: RecolhimentoMensalGTA = {
    ...atual,
    situacao: atual.situacao === "Pago" ? "Pago" : "Pagamento DAE",
    daeEmitido: true,
    numeroDAE: atual.numeroDAE ?? `DAE-${atual.anoReferencia}-${String(atual.id).padStart(6, "0")}`,
    dataEmissaoDAE: atual.dataEmissaoDAE ?? new Date().toISOString().slice(0, 10),
  };
  RECOLHIMENTOS_MOCK[indice] = atualizado;
  return atualizado;
}
