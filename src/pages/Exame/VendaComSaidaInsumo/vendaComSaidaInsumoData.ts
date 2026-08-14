import {
  listarRegistrosMock,
  obterRegistroMock,
  salvarRegistroMock,
} from "../../../components/ui/mockCollectionStorage";

export type SituacaoVendaSaidaInsumo = "Gravada" | "Cancelada";

export type TipoDestinatarioVendaSaidaInsumo =
  | "Médico Veterinário Habilitado PNCEBT"
  | "Instituição de Ensino e Pesquisa"
  | "Laboratório"
  | "Responsável Técnico GRSC"
  | "Revendedora de Produtos Agropecuários";

export interface EntidadeVendaSaidaInsumo {
  id: string | number;
  codigo: string;
  nome: string;
  documento?: string;
}

export interface LoteVendaSaidaInsumo {
  id: string | number;
  numeroPartida: string;
  laboratorio: string;
  doenca: string;
  tipoInsumo: string;
  apresentacao: string;
  disponiveis: number;
  vendidas: number;
  vencidas: number;
  descartadas: number;
}

export interface VendaSaidaInsumo {
  id: string | number;
  emitente: EntidadeVendaSaidaInsumo;
  tipoDestinatario: TipoDestinatarioVendaSaidaInsumo;
  destinatario: EntidadeVendaSaidaInsumo;
  numeroNotaFiscal: string;
  ufNotaFiscal: "Minas Gerais";
  dataNotaFiscal: string;
  lotes: LoteVendaSaidaInsumo[];
  requerimento: string;
  situacao: SituacaoVendaSaidaInsumo;
}

export const REVENDEDORAS_INSUMO: EntidadeVendaSaidaInsumo[] = [
  { id: "rev-1", codigo: "3120938028", nome: "Comercial AgroVet Minas", documento: "23.456.789/0001-10" },
  { id: "rev-2", codigo: "3120938045", nome: "Agropecuária Vale Verde", documento: "34.567.890/0001-21" },
  { id: "rev-3", codigo: "3120938090", nome: "Casa do Produtor Lavras", documento: "45.678.901/0001-32" },
];

export const MEDICOS_PNCEBT: EntidadeVendaSaidaInsumo[] = [
  { id: "med-1", codigo: "CRMV-MG 12873", nome: "Mariana Oliveira", documento: "111.222.333-44" },
  { id: "med-2", codigo: "CRMV-MG 09321", nome: "Carlos Henrique Souza", documento: "222.333.444-55" },
];

export const INSTITUICOES_ENSINO: EntidadeVendaSaidaInsumo[] = [
  { id: "inst-1", codigo: "IES-001", nome: "Universidade Federal de Minas Gerais", documento: "17.217.985/0001-04" },
  { id: "inst-2", codigo: "IES-002", nome: "Universidade Federal de Lavras", documento: "22.078.679/0001-74" },
];

export const LABORATORIOS: EntidadeVendaSaidaInsumo[] = [
  { id: "lab-1", codigo: "LAB-0001", nome: "Laboratório BioDiagnóstico MG", documento: "12.345.678/0001-90" },
  { id: "lab-2", codigo: "LAB-0002", nome: "Tecpar Diagnósticos", documento: "23.456.789/0001-01" },
];

export const RESPONSAVEIS_GRSC: EntidadeVendaSaidaInsumo[] = [
  { id: "grsc-1", codigo: "CRMV-MG 07410", nome: "José Aarão Neto", documento: "333.444.555-66" },
  { id: "grsc-2", codigo: "CRMV-MG 15690", nome: "Marina Couto Dias", documento: "444.555.666-77" },
];

export interface DoencaVendaSaidaInsumo {
  id: string;
  nome: string;
}

export interface TipoInsumoVendaSaidaInsumo {
  id: string;
  name: string;
}

export const DOENCAS: DoencaVendaSaidaInsumo[] = [
  { id: "brucelose", nome: "Brucelose" },
  { id: "tuberculose", nome: "Tuberculose" },
];
export const TIPOS_INSUMO = [
  { id: "aat", name: "Antígeno Acidificado Tamponado (AAT)" },
  { id: "2-me", name: "2-Mercaptoetanol (2-ME)" },
  { id: "ppd-aviaria", name: "Tuberculina PPD Aviária" },
  { id: "ppd-bovina", name: "Tuberculina PPD Bovina" },
];

export const LOTES_DISPONIVEIS: LoteVendaSaidaInsumo[] = [
  { id: "lote-1", numeroPartida: "0013225/24", laboratorio: "Laboratório BioDiagnóstico MG", doenca: "Brucelose", tipoInsumo: "Antígeno Acidificado Tamponado (AAT)", apresentacao: "Frasco com 50 doses", disponiveis: 600, vendidas: 150, vencidas: 0, descartadas: 0 },
  { id: "lote-2", numeroPartida: "0044120/25", laboratorio: "Tecpar Diagnósticos", doenca: "Tuberculose", tipoInsumo: "Tuberculina PPD Bovina", apresentacao: "Frasco com 20 doses", disponiveis: 240, vendidas: 80, vencidas: 20, descartadas: 0 },
  { id: "lote-3", numeroPartida: "0099001/26", laboratorio: "Tecpar Diagnósticos", doenca: "Tuberculose", tipoInsumo: "Tuberculina PPD Aviária", apresentacao: "Frasco com 20 doses", disponiveis: 380, vendidas: 120, vencidas: 0, descartadas: 20 },
];

export const VENDAS_SAIDA_INSUMO_INICIAIS: VendaSaidaInsumo[] = [
  {
    id: "vsi-1",
    emitente: REVENDEDORAS_INSUMO[0],
    tipoDestinatario: "Médico Veterinário Habilitado PNCEBT",
    destinatario: MEDICOS_PNCEBT[0],
    numeroNotaFiscal: "15420",
    ufNotaFiscal: "Minas Gerais",
    dataNotaFiscal: "2026-08-05",
    lotes: [LOTES_DISPONIVEIS[0]],
    requerimento: "requerimento-venda-15420.pdf",
    situacao: "Gravada",
  },
  {
    id: "vsi-2",
    emitente: REVENDEDORAS_INSUMO[1],
    tipoDestinatario: "Laboratório",
    destinatario: LABORATORIOS[1],
    numeroNotaFiscal: "16890",
    ufNotaFiscal: "Minas Gerais",
    dataNotaFiscal: "2026-07-22",
    lotes: [LOTES_DISPONIVEIS[1], LOTES_DISPONIVEIS[2]],
    requerimento: "requerimento-venda-16890.pdf",
    situacao: "Cancelada",
  },
];

const COLECAO = "vendas-saida-insumo";

export function criarVendaSaidaInsumoVazia(): VendaSaidaInsumo {
  return {
    id: `vsi-${Date.now()}`,
    emitente: { id: "", codigo: "", nome: "" },
    tipoDestinatario: "Médico Veterinário Habilitado PNCEBT",
    destinatario: { id: "", codigo: "", nome: "" },
    numeroNotaFiscal: "",
    ufNotaFiscal: "Minas Gerais",
    dataNotaFiscal: "",
    lotes: [],
    requerimento: "",
    situacao: "Gravada",
  };
}

export function listarVendasSaidaInsumo() {
  return listarRegistrosMock(COLECAO, VENDAS_SAIDA_INSUMO_INICIAIS);
}

export function obterVendaSaidaInsumo(dados?: Partial<VendaSaidaInsumo>) {
  const base = dados?.id
    ? listarVendasSaidaInsumo().find((item) => item.id === dados.id)
    : undefined;
  const registro = { ...criarVendaSaidaInsumoVazia(), ...base, ...dados } as VendaSaidaInsumo;
  return obterRegistroMock(COLECAO, registro);
}

export function salvarVendaSaidaInsumo(registro: VendaSaidaInsumo) {
  return salvarRegistroMock(COLECAO, registro);
}

export function dadosDestinatario(tipo: TipoDestinatarioVendaSaidaInsumo) {
  if (tipo === "Médico Veterinário Habilitado PNCEBT") return MEDICOS_PNCEBT;
  if (tipo === "Instituição de Ensino e Pesquisa") return INSTITUICOES_ENSINO;
  if (tipo === "Laboratório") return LABORATORIOS;
  if (tipo === "Responsável Técnico GRSC") return RESPONSAVEIS_GRSC;
  if (tipo === "Revendedora de Produtos Agropecuários") return REVENDEDORAS_INSUMO;
  return [];
}
