export type TipoFormularioGta = "Manual" | "Digital";
export type TipoProcedenciaGta =
  | "Propriedade Rural"
  | "Frigorífico"
  | "Evento Pecuário";

export interface ProdutorGta {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

export interface PropriedadeGta {
  id: number;
  codigo: string;
  nome: string;
  municipio: string;
  proprietario: string;
}

export interface EmissaoGta {
  id: number;
  tipoFormulario: TipoFormularioGta;
  numeroControle: string;
  serieGta: string;
  numeroGta: string;
  dataEmissao: string;
  tipoProcedencia: TipoProcedenciaGta;
  produtor: ProdutorGta;
  propriedade: PropriedadeGta;
}

export type EmissaoGtaDados = Omit<EmissaoGta, "id">;

export interface EmissaoGtaDraft {
  tipoFormulario: TipoFormularioGta | "";
  numeroControle: string;
  serieGta: string;
  numeroGta: string;
  dataEmissao: string;
  tipoProcedencia: TipoProcedenciaGta | "";
  produtor: ProdutorGta | null;
  propriedade: PropriedadeGta | null;
}

export const TIPOS_FORMULARIO_GTA = [
  { value: "Manual", label: "Manual" },
  { value: "Digital", label: "Digital" },
];

export const TIPOS_PROCEDENCIA_GTA = [
  { value: "Propriedade Rural", label: "Propriedade Rural" },
  { value: "Frigorífico", label: "Frigorífico" },
  { value: "Evento Pecuário", label: "Evento Pecuário" },
];

export const PRODUTORES_GTA_MOCK: ProdutorGta[] = [
  {
    id: 1,
    nome: "José Aarão Neto",
    documento: "555.009.956-40",
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
    nome: "Agro Pecuária Vale Verde Ltda",
    documento: "12.345.678/0001-99",
    tipo: "PJ",
  },
];

export const PROPRIEDADES_GTA_MOCK: PropriedadeGta[] = [
  {
    id: 1,
    codigo: "10345678901",
    nome: "Fazenda Santa Helena",
    municipio: "Lavras",
    proprietario: "Carlos Henrique Souza",
  },
  {
    id: 2,
    codigo: "20345678902",
    nome: "Granja Vale Verde",
    municipio: "Uberlândia",
    proprietario: "Maria Silva Mendes",
  },
  {
    id: 3,
    codigo: "30345678903",
    nome: "Sítio Boa Esperança",
    municipio: "Varginha",
    proprietario: "José Aarão Neto",
  },
];

export const EMISSOES_GTA_MOCK: EmissaoGta[] = [
  {
    id: 1,
    tipoFormulario: "Manual",
    numeroControle: "CTRL-2026-001",
    serieGta: "MG",
    numeroGta: "184526",
    dataEmissao: "2026-07-22",
    tipoProcedencia: "Propriedade Rural",
    produtor: PRODUTORES_GTA_MOCK[0],
    propriedade: PROPRIEDADES_GTA_MOCK[2],
  },
  {
    id: 2,
    tipoFormulario: "Digital",
    numeroControle: "",
    serieGta: "",
    numeroGta: "",
    dataEmissao: "",
    tipoProcedencia: "Frigorífico",
    produtor: PRODUTORES_GTA_MOCK[2],
    propriedade: PROPRIEDADES_GTA_MOCK[1],
  },
];

let proximoId = EMISSOES_GTA_MOCK.length + 1;

export function criarEmissaoGtaVazia(): EmissaoGtaDraft {
  return {
    tipoFormulario: "",
    numeroControle: "",
    serieGta: "",
    numeroGta: "",
    dataEmissao: "",
    tipoProcedencia: "",
    produtor: null,
    propriedade: null,
  };
}

export function adicionarEmissaoGta(draft: EmissaoGtaDados) {
  const novaEmissao: EmissaoGta = {
    ...draft,
    id: proximoId++,
  };
  EMISSOES_GTA_MOCK.unshift(novaEmissao);
  return novaEmissao;
}

export function atualizarEmissaoGta(emissao: EmissaoGta) {
  const indice = EMISSOES_GTA_MOCK.findIndex((item) => item.id === emissao.id);
  if (indice >= 0) EMISSOES_GTA_MOCK[indice] = emissao;
  return emissao;
}

export function obterEmissaoGta(id?: number | null) {
  if (id == null) return EMISSOES_GTA_MOCK[0] ?? null;
  return EMISSOES_GTA_MOCK.find((item) => item.id === id) ?? null;
}

export function formatarDataGta(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
