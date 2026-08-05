import { DOENCAS_MOCK as DOENCAS_PADRAO } from "../../../components/ui/EntitySearch";

export type SituacaoTipoInsumoExame = "Ativo" | "Inativo";

export interface DoencaReferencia {
  id: number;
  nome: string;
}

export interface TipoInsumoExame {
  id: number;
  nome: string;
  doencas: DoencaReferencia[];
  situacao: SituacaoTipoInsumoExame;
}

export const SITUACOES_TIPO_INSUMO_EXAME: { value: SituacaoTipoInsumoExame; label: string }[] = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const DOENCAS_DISPONIVEIS = DOENCAS_PADRAO as DoencaReferencia[];

const buscarDoenca = (nome: string) => DOENCAS_DISPONIVEIS.find((d) => d.nome === nome) ?? null;

export const TIPOS_INSUMO_EXAME_MOCK: TipoInsumoExame[] = [
  {
    id: 1,
    nome: "Kit de coleta sorológica",
    doencas: [buscarDoenca("Brucelose")].filter(Boolean) as DoencaReferencia[],
    situacao: "Ativo",
  },
  {
    id: 2,
    nome: "Swab para diagnóstico",
    doencas: [buscarDoenca("Febre Aftosa"), buscarDoenca("Tuberculose Bovina")].filter(Boolean) as DoencaReferencia[],
    situacao: "Ativo",
  },
  {
    id: 3,
    nome: "Frasco estéril para cultura",
    doencas: [buscarDoenca("Raiva dos Herbívoros")].filter(Boolean) as DoencaReferencia[],
    situacao: "Inativo",
  },
  {
    id: 4,
    nome: "Lâmina para microscopia",
    doencas: [],
    situacao: "Ativo",
  },
];

let nextId = TIPOS_INSUMO_EXAME_MOCK.length + 1;

export function listarTiposInsumoExame() {
  return TIPOS_INSUMO_EXAME_MOCK;
}

export function obterTipoInsumoExame(id?: number | null) {
  if (id == null) return TIPOS_INSUMO_EXAME_MOCK[0] ?? null;
  return TIPOS_INSUMO_EXAME_MOCK.find((item) => item.id === id) ?? null;
}

export function criarTipoInsumoExame(dados: Omit<TipoInsumoExame, "id">) {
  const novo = { id: nextId++, ...dados };
  TIPOS_INSUMO_EXAME_MOCK.unshift(novo);
  return novo;
}

export function atualizarTipoInsumoExame(id: number, dados: Omit<TipoInsumoExame, "id">) {
  const index = TIPOS_INSUMO_EXAME_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const atualizado = { ...TIPOS_INSUMO_EXAME_MOCK[index], ...dados };
  TIPOS_INSUMO_EXAME_MOCK[index] = atualizado;
  return atualizado;
}

export function formatarDoencas(doencas: TipoInsumoExame["doencas"]) {
  if (!doencas.length) return "-";
  return doencas.map((doenca) => doenca.nome).join(", ");
}
