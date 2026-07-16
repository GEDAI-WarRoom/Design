export type SituacaoRegistroVendaGTA = "Gravada" | "Reservado" | "Cancelado" | "Vendido";

export interface MedicoVendaGTA {
  id: number;
  nome: string;
  cpf: string;
  gtaDisponiveis: number;
}

export interface EscritorioSeccional {
  id: number;
  nome: string;
  sigla: string;
}

export interface RegistroVendaGTADigital {
  id: number;
  medico: MedicoVendaGTA;
  escritorio: EscritorioSeccional;
  quantidadeComprada: number;
  quantidadeUtilizada: number;
  valor: number;
  dataCadastro: string;
  situacao: SituacaoRegistroVendaGTA;
}

// O fator não foi informado na história. Mantê-lo isolado evita inventar regra monetária.
export const FATOR_VALOR_GTA = 1;

export const MEDICOS_VETERINARIOS_GTA: MedicoVendaGTA[] = [
  { id: 1, nome: "Dr. Carlos Eduardo Silva", cpf: "123.456.789-00", gtaDisponiveis: 0 },
  { id: 2, nome: "Dra. Mariana Costa Alencar", cpf: "987.654.321-11", gtaDisponiveis: 12 },
  { id: 3, nome: "Dr. Roberto Antunes Vieira", cpf: "456.789.123-22", gtaDisponiveis: 0 },
];

export const ESCRITORIOS_SECCIONAIS: EscritorioSeccional[] = [
  { id: 1, nome: "Escritório Seccional de Lavras", sigla: "SECLAV3820" },
  { id: 2, nome: "Escritório Seccional de Uberlândia", sigla: "SECUDI2140" },
  { id: 3, nome: "Escritório Seccional de Juiz de Fora", sigla: "SECJDF3310" },
];

export const SITUACOES_REGISTRO_VENDA_GTA = [
  { value: "Gravada", label: "Gravada" },
  { value: "Reservado", label: "Reservado" },
  { value: "Cancelado", label: "Cancelado" },
  { value: "Vendido", label: "Vendido" },
];

export const REGISTROS_VENDA_GTA_MOCK: RegistroVendaGTADigital[] = [
  {
    id: 1,
    medico: MEDICOS_VETERINARIOS_GTA[0],
    escritorio: ESCRITORIOS_SECCIONAIS[0],
    quantidadeComprada: 50,
    quantidadeUtilizada: 18,
    valor: 0,
    dataCadastro: "2026-07-08",
    situacao: "Reservado",
  },
  {
    id: 2,
    medico: MEDICOS_VETERINARIOS_GTA[2],
    escritorio: ESCRITORIOS_SECCIONAIS[1],
    quantidadeComprada: 25,
    quantidadeUtilizada: 25,
    valor: 0,
    dataCadastro: "2026-07-03",
    situacao: "Vendido",
  },
];

let proximoId = REGISTROS_VENDA_GTA_MOCK.length + 1;

export const quantidadeDisponivel = (registro: Pick<RegistroVendaGTADigital, "quantidadeComprada" | "quantidadeUtilizada">) =>
  registro.quantidadeComprada - registro.quantidadeUtilizada;

export const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatarData = (data: string) => {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export function listarRegistrosVendaGTA() {
  return REGISTROS_VENDA_GTA_MOCK;
}

export function obterRegistroVendaGTA(id?: number | null) {
  if (id == null) return REGISTROS_VENDA_GTA_MOCK[0] ?? null;
  return REGISTROS_VENDA_GTA_MOCK.find((registro) => registro.id === id) ?? null;
}

export function criarRegistroVendaGTA(
  dados: Omit<RegistroVendaGTADigital, "id" | "quantidadeUtilizada" | "dataCadastro" | "situacao">,
) {
  const novo: RegistroVendaGTADigital = {
    id: proximoId++,
    ...dados,
    quantidadeUtilizada: 0,
    dataCadastro: new Date().toISOString().slice(0, 10),
    situacao: "Gravada",
  };
  REGISTROS_VENDA_GTA_MOCK.unshift(novo);
  return novo;
}

export function atualizarSituacaoRegistroVendaGTA(id: number, situacao: SituacaoRegistroVendaGTA) {
  const indice = REGISTROS_VENDA_GTA_MOCK.findIndex((registro) => registro.id === id);
  if (indice === -1 || REGISTROS_VENDA_GTA_MOCK[indice].situacao === "Cancelado") return null;
  REGISTROS_VENDA_GTA_MOCK[indice] = { ...REGISTROS_VENDA_GTA_MOCK[indice], situacao };
  return REGISTROS_VENDA_GTA_MOCK[indice];
}
