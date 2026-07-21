export type SituacaoAjusteDosesInsumo = "Gravada" | "Cancelada";

export interface RevendedoraInsumo {
  id: number;
  codigo: string;
  nome: string;
  uf: string;
  atuacao: "Revendedora de Insumos para Exames de Brucelose/Tuberculose";
}

export interface ItemNotaFiscalInsumo {
  id: string;
  numeroPartida: string;
  validade: string;
  doenca: string;
  tipoInsumo: string;
  dosesPorFrasco: number;
  frascosDisponiveis: number;
  dosesDisponiveis: number;
  dosesVencidas: number;
  dosesDescartadas: number;
  dosesPartilhadas: number;
  dosesUtilizadas: number;
}

export interface NotaFiscalInsumo {
  id: string;
  numero: string;
  lote: string;
  saldoApresentacao: number;
  dataEmissao: string;
  revendedoraCodigo: string;
  itens: ItemNotaFiscalInsumo[];
  itensFormatados: string;
}

export interface LancamentoItemInsumo extends ItemNotaFiscalInsumo {
  frascosLancados: string;
  dosesLancadas: string;
  justificativa: string;
}

export interface NotaFiscalAjustada extends Omit<NotaFiscalInsumo, "itens"> {
  itens: LancamentoItemInsumo[];
}

export interface AjusteDosesInsumo {
  id: number;
  revendedora: RevendedoraInsumo;
  notasFiscais: NotaFiscalAjustada[];
  situacao: SituacaoAjusteDosesInsumo;
  dataCadastro: string;
}

export interface DoencaInsumoExame {
  id: number;
  nome: string;
  tiposInsumo: string[];
}

export const SITUACOES_AJUSTE_DOSES_INSUMO: Array<{
  value: SituacaoAjusteDosesInsumo;
  label: string;
}> = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

export const REVENDEDORAS_INSUMO_MOCK: RevendedoraInsumo[] = [
  {
    id: 101,
    codigo: "3100000101",
    nome: "BioCampo Insumos Veterinários",
    uf: "MG",
    atuacao: "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
  },
  {
    id: 102,
    codigo: "3100000102",
    nome: "Diagnóstico Rural Minas",
    uf: "MG",
    atuacao: "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
  },
  {
    id: 103,
    codigo: "3100000103",
    nome: "AgroLab Distribuidora",
    uf: "MG",
    atuacao: "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
  },
];

export const NOTAS_FISCAIS_INSUMO_MOCK: NotaFiscalInsumo[] = [
  {
    id: "nf-insumo-1",
    numero: "10458",
    lote: "0001245/26",
    saldoApresentacao: 600,
    dataEmissao: "2026-07-02",
    revendedoraCodigo: "3100000101",
    itensFormatados: "Brucelose - Antígeno Acidificado Tamponado",
    itens: [
      {
        id: "item-insumo-1",
        numeroPartida: "0001245/26",
        validade: "2027-03-31",
        doenca: "Brucelose",
        tipoInsumo: "Antígeno Acidificado Tamponado",
        dosesPorFrasco: 50,
        frascosDisponiveis: 12,
        dosesDisponiveis: 600,
        dosesVencidas: 0,
        dosesDescartadas: 50,
        dosesPartilhadas: 100,
        dosesUtilizadas: 250,
      },
    ],
  },
  {
    id: "nf-insumo-2",
    numero: "10892",
    lote: "0002301/26",
    saldoApresentacao: 560,
    dataEmissao: "2026-07-08",
    revendedoraCodigo: "3100000101",
    itensFormatados: "Tuberculose Bovina - Tuberculina PPD Bovina e Aviária",
    itens: [
      {
        id: "item-insumo-2",
        numeroPartida: "0002301/26",
        validade: "2027-05-30",
        doenca: "Tuberculose Bovina",
        tipoInsumo: "Tuberculina PPD Bovina",
        dosesPorFrasco: 20,
        frascosDisponiveis: 18,
        dosesDisponiveis: 360,
        dosesVencidas: 0,
        dosesDescartadas: 20,
        dosesPartilhadas: 40,
        dosesUtilizadas: 180,
      },
      {
        id: "item-insumo-3",
        numeroPartida: "0002302/26",
        validade: "2027-05-30",
        doenca: "Tuberculose Bovina",
        tipoInsumo: "Tuberculina PPD Aviária",
        dosesPorFrasco: 20,
        frascosDisponiveis: 10,
        dosesDisponiveis: 200,
        dosesVencidas: 0,
        dosesDescartadas: 20,
        dosesPartilhadas: 20,
        dosesUtilizadas: 120,
      },
    ],
  },
  {
    id: "nf-insumo-3",
    numero: "77103",
    lote: "0000987/26",
    saldoApresentacao: 225,
    dataEmissao: "2026-06-18",
    revendedoraCodigo: "3100000102",
    itensFormatados: "Brucelose - Antígeno para Teste do Anel em Leite",
    itens: [
      {
        id: "item-insumo-4",
        numeroPartida: "0000987/26",
        validade: "2027-01-31",
        doenca: "Brucelose",
        tipoInsumo: "Antígeno para Teste do Anel em Leite",
        dosesPorFrasco: 25,
        frascosDisponiveis: 9,
        dosesDisponiveis: 225,
        dosesVencidas: 0,
        dosesDescartadas: 25,
        dosesPartilhadas: 50,
        dosesUtilizadas: 150,
      },
    ],
  },
  {
    id: "nf-insumo-4",
    numero: "55021",
    lote: "0000714/26",
    saldoApresentacao: 350,
    dataEmissao: "2026-05-26",
    revendedoraCodigo: "3100000103",
    itensFormatados: "Brucelose - Antígeno Acidificado Tamponado",
    itens: [
      {
        id: "item-insumo-5",
        numeroPartida: "0000714/26",
        validade: "2026-12-31",
        doenca: "Brucelose",
        tipoInsumo: "Antígeno Acidificado Tamponado",
        dosesPorFrasco: 50,
        frascosDisponiveis: 7,
        dosesDisponiveis: 350,
        dosesVencidas: 0,
        dosesDescartadas: 50,
        dosesPartilhadas: 50,
        dosesUtilizadas: 200,
      },
    ],
  },
];

export const DOENCAS_COM_INSUMO_MOCK: DoencaInsumoExame[] = [
  {
    id: 1,
    nome: "Brucelose",
    tiposInsumo: [
      "Antígeno Acidificado Tamponado",
      "Antígeno para Teste do Anel em Leite",
    ],
  },
  {
    id: 2,
    nome: "Tuberculose Bovina",
    tiposInsumo: ["Tuberculina PPD Bovina", "Tuberculina PPD Aviária"],
  },
];

function prepararNota(
  nota: NotaFiscalInsumo,
  valores?: Record<string, { frascos: string; doses: string; justificativa: string }>,
): NotaFiscalAjustada {
  return {
    ...nota,
    itens: nota.itens.map((item) => ({
      ...item,
      frascosLancados: valores?.[item.id]?.frascos ?? "",
      dosesLancadas: valores?.[item.id]?.doses ?? "",
      justificativa: valores?.[item.id]?.justificativa ?? "",
    })),
  };
}

export function criarNotaFiscalAjustada(nota: NotaFiscalInsumo) {
  return prepararNota(nota);
}

export const AJUSTES_DOSES_INSUMO_MOCK: AjusteDosesInsumo[] = [
  {
    id: 1,
    revendedora: REVENDEDORAS_INSUMO_MOCK[0],
    notasFiscais: [
      prepararNota(NOTAS_FISCAIS_INSUMO_MOCK[0], {
        "item-insumo-1": {
          frascos: "2",
          doses: "100",
          justificativa: "Ajuste após conferência do estoque físico.",
        },
      }),
    ],
    situacao: "Gravada",
    dataCadastro: "2026-07-10",
  },
  {
    id: 2,
    revendedora: REVENDEDORAS_INSUMO_MOCK[1],
    notasFiscais: [
      prepararNota(NOTAS_FISCAIS_INSUMO_MOCK[2], {
        "item-insumo-4": {
          frascos: "1",
          doses: "25",
          justificativa: "Frasco inutilizado durante o transporte.",
        },
      }),
    ],
    situacao: "Cancelada",
    dataCadastro: "2026-06-23",
  },
];

let proximoId = AJUSTES_DOSES_INSUMO_MOCK.length + 1;

export function listarAjustesDosesInsumo() {
  return AJUSTES_DOSES_INSUMO_MOCK;
}

export function obterAjusteDosesInsumo(id?: number | null) {
  if (id == null) return AJUSTES_DOSES_INSUMO_MOCK[0] ?? null;
  return AJUSTES_DOSES_INSUMO_MOCK.find((item) => item.id === id) ?? null;
}

export function criarAjusteDosesInsumo(
  dados: Omit<AjusteDosesInsumo, "id" | "dataCadastro" | "situacao">,
) {
  const novo: AjusteDosesInsumo = {
    ...dados,
    id: proximoId++,
    situacao: "Gravada",
    dataCadastro: new Date().toISOString().slice(0, 10),
  };
  AJUSTES_DOSES_INSUMO_MOCK.unshift(novo);
  return novo;
}

export function atualizarAjusteDosesInsumo(
  id: number,
  situacao: SituacaoAjusteDosesInsumo,
) {
  const index = AJUSTES_DOSES_INSUMO_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const atualizado = { ...AJUSTES_DOSES_INSUMO_MOCK[index], situacao };
  AJUSTES_DOSES_INSUMO_MOCK[index] = atualizado;
  return atualizado;
}

export function notasDaRevendedora(codigo?: string) {
  if (!codigo) return [];
  return NOTAS_FISCAIS_INSUMO_MOCK.filter(
    (nota) => nota.revendedoraCodigo === codigo,
  );
}

export function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarNotas(notas: NotaFiscalAjustada[]) {
  return notas.map((nota) => nota.numero).join(", ");
}

export function formatarPartidas(notas: NotaFiscalAjustada[]) {
  return Array.from(new Set(notas.flatMap((nota) => nota.itens.map((item) => item.numeroPartida)))).join(", ");
}

export function formatarDoencas(notas: NotaFiscalAjustada[]) {
  return Array.from(
    new Set(
      notas.flatMap((nota) =>
        nota.itens.map((item) => `${item.doenca} - ${item.tipoInsumo}`),
      ),
    ),
  ).join(", ");
}
