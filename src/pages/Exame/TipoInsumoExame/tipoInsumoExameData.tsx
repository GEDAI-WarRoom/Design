import { DOENCAS_MOCK as DOENCAS_PADRAO } from "../../../components/ui/EntitySearch";
import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoTipoInsumoExame = "Ativo" | "Inativo";
export type ResultadoPossivelTipoInsumoExame = "Positivo" | "Negativo" | "Inconclusivo";

export interface DoencaReferencia {
  id: number;
  nome: string;
}

export interface TipoInsumoExame {
  id: number;
  nome: string;
  resultadosPossiveis: ResultadoPossivelTipoInsumoExame[];
  doencas: DoencaReferencia[];
  situacao: SituacaoTipoInsumoExame;
}

export const RESULTADOS_POSSIVEIS_TIPO_INSUMO_EXAME: {
  id: ResultadoPossivelTipoInsumoExame;
  label: string;
}[] = [
  { id: "Positivo", label: "Positivo" },
  { id: "Negativo", label: "Negativo" },
  { id: "Inconclusivo", label: "Inconclusivo" },
];

export const SITUACOES_TIPO_INSUMO_EXAME: { value: SituacaoTipoInsumoExame; label: string }[] = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const DOENCAS_DISPONIVEIS = DOENCAS_PADRAO as DoencaReferencia[];
const COLECAO = "tipos-insumo-exame";

const buscarDoenca = (nome: string) => DOENCAS_DISPONIVEIS.find((d) => d.nome === nome) ?? null;

export const TIPOS_INSUMO_EXAME_MOCK: TipoInsumoExame[] = [
  {
    id: 1,
    nome: "Kit de coleta sorológica",
    resultadosPossiveis: ["Positivo", "Negativo", "Inconclusivo"],
    doencas: [buscarDoenca("Brucelose")].filter(Boolean) as DoencaReferencia[],
    situacao: "Ativo",
  },
  {
    id: 2,
    nome: "Swab para diagnóstico",
    resultadosPossiveis: ["Positivo", "Negativo"],
    doencas: [buscarDoenca("Febre Aftosa"), buscarDoenca("Tuberculose Bovina")].filter(Boolean) as DoencaReferencia[],
    situacao: "Ativo",
  },
  {
    id: 3,
    nome: "Frasco estéril para cultura",
    resultadosPossiveis: ["Positivo", "Negativo", "Inconclusivo"],
    doencas: [buscarDoenca("Raiva dos Herbívoros")].filter(Boolean) as DoencaReferencia[],
    situacao: "Inativo",
  },
  {
    id: 4,
    nome: "Lâmina para microscopia",
    resultadosPossiveis: ["Positivo", "Negativo"],
    doencas: [],
    situacao: "Ativo",
  },
];

export function listarTiposInsumoExame() {
  return listarColecaoMock(COLECAO, TIPOS_INSUMO_EXAME_MOCK);
}

export function obterTipoInsumoExame(id?: number | null) {
  const registros = listarTiposInsumoExame();
  if (id == null) return registros[0] ?? null;
  return registros.find((item) => item.id === id) ?? null;
}

export function criarTipoInsumoExame(dados: Omit<TipoInsumoExame, "id">) {
  const registros = listarTiposInsumoExame();
  const novo: TipoInsumoExame = {
    id: proximoIdNumerico(registros),
    ...dados,
  };
  salvarColecaoMock(COLECAO, [novo, ...registros]);
  return novo;
}

export function atualizarTipoInsumoExame(id: number, dados: Omit<TipoInsumoExame, "id">) {
  const registros = listarTiposInsumoExame();
  const registro = registros.find((item) => item.id === id);
  if (!registro) return null;

  const atualizado: TipoInsumoExame = { ...registro, ...dados };
  salvarColecaoMock(
    COLECAO,
    registros.map((item) => (item.id === id ? atualizado : item)),
  );
  return atualizado;
}

export function formatarDoencas(doencas: TipoInsumoExame["doencas"]) {
  if (!doencas.length) return "-";
  return doencas.map((doenca) => doenca.nome).join(", ");
}
