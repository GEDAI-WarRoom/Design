import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type TipoUnidadeMedida = "Animal" | "Vegetal" | "Agrotóxico";

export interface UnidadeMedida {
  id: number;
  nome: string;
  sigla: string;
  tipo: TipoUnidadeMedida;
  tipos: TipoUnidadeMedida[];
  observacao: string;
  situacao: "Ativo" | "Inativo";
}

const COLECAO = "unidades-medida";

export const UNIDADES_MEDIDA_INICIAIS: UnidadeMedida[] = [
  { id: 1, nome: "Quilograma", sigla: "kg", tipo: "Animal", tipos: ["Animal", "Vegetal"], observacao: "Unidade utilizada para registrar peso em cadastros e movimentações.", situacao: "Ativo" },
  { id: 2, nome: "Grama", sigla: "g", tipo: "Vegetal", tipos: ["Vegetal"], observacao: "Unidade utilizada para pequenas quantidades de produtos vegetais.", situacao: "Ativo" },
  { id: 3, nome: "Litro", sigla: "L", tipo: "Agrotóxico", tipos: ["Agrotóxico"], observacao: "Unidade de volume aplicada ao controle de produtos líquidos.", situacao: "Ativo" },
  { id: 4, nome: "Mililitro", sigla: "mL", tipo: "Animal", tipos: ["Animal"], observacao: "Unidade utilizada para dosagens de baixo volume.", situacao: "Ativo" },
  { id: 5, nome: "Dose", sigla: "ds", tipo: "Animal", tipos: ["Animal"], observacao: "Unidade aplicada ao registro de vacinas e outros insumos.", situacao: "Ativo" },
  { id: 6, nome: "Unidade", sigla: "un", tipo: "Animal", tipos: ["Animal", "Vegetal"], observacao: "Quantidade unitária.", situacao: "Ativo" },
  { id: 7, nome: "Frasco", sigla: "fr", tipo: "Animal", tipos: ["Animal"], observacao: "Quantidade por frasco.", situacao: "Ativo" },
  { id: 8, nome: "Caixa", sigla: "cx", tipo: "Animal", tipos: ["Animal", "Vegetal"], observacao: "Quantidade por caixa.", situacao: "Ativo" },
  { id: 9, nome: "Saca", sigla: "sc", tipo: "Vegetal", tipos: ["Vegetal"], observacao: "Quantidade por saca.", situacao: "Ativo" },
];

export function listarUnidadesMedida() {
  return listarColecaoMock(COLECAO, UNIDADES_MEDIDA_INICIAIS);
}

export function obterUnidadeMedida(id?: number | null) {
  const unidades = listarUnidadesMedida();
  if (id == null) return unidades[0] ?? null;
  return unidades.find((unidade) => unidade.id === id) ?? null;
}

export function adicionarUnidadeMedida(dados: Omit<UnidadeMedida, "id">) {
  const unidades = listarUnidadesMedida();
  const nova = { ...dados, id: proximoIdNumerico(unidades) };
  salvarColecaoMock(COLECAO, [nova, ...unidades]);
  return nova;
}

export function atualizarUnidadeMedida(unidade: UnidadeMedida) {
  const unidades = listarUnidadesMedida();
  salvarColecaoMock(
    COLECAO,
    unidades.some((item) => item.id === unidade.id)
      ? unidades.map((item) => (item.id === unidade.id ? unidade : item))
      : [unidade, ...unidades],
  );
  return unidade;
}
