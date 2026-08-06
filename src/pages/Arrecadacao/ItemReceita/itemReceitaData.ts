import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";
import { listarIndices } from "../Indice/indiceIndice";
import { listarReceitas } from "../Receita/receitaData";
import { listarUnidadesMedida } from "../../Geral/UnidadeMedida/unidadeMedidaData";

export interface ItemReceita {
  id: number;
  codigo: string;
  descricao: string;
  unidadeMedidaId: number;
  receitaId: number;
  indiceId: string;
  quantidadeIndice: number;
  permiteContribuicaoFundo: boolean;
  situacao: "Ativo" | "Inativo";
}

export interface ItemReceitaVisual extends ItemReceita {
  itemReceita: string;
  nome: string;
  unidadeMedida: string;
  receita: string;
  indice: string;
  contribuicaoFundo: "Sim" | "Não";
  quantidadeIndiceFormatada: string;
}

const COLECAO = "itens-receita";

const ITENS_RECEITA_INICIAIS: ItemReceita[] = [
  { id: 1, codigo: "ITR-001", descricao: "Vacina B19", unidadeMedidaId: 7, receitaId: 1, indiceId: "1", quantidadeIndice: 1.5, permiteContribuicaoFundo: true, situacao: "Ativo" },
  { id: 2, codigo: "ITR-002", descricao: "Ivermectina 1%", unidadeMedidaId: 4, receitaId: 2, indiceId: "1", quantidadeIndice: 1, permiteContribuicaoFundo: false, situacao: "Ativo" },
  { id: 3, codigo: "ITR-003", descricao: "Suplemento Mineral Bovino", unidadeMedidaId: 1, receitaId: 3, indiceId: "1", quantidadeIndice: 2, permiteContribuicaoFundo: true, situacao: "Ativo" },
  { id: 4, codigo: "ITR-004", descricao: "Taxa de Emissão GTA - Bovinos", unidadeMedidaId: 6, receitaId: 2, indiceId: "1", quantidadeIndice: 2, permiteContribuicaoFundo: false, situacao: "Ativo" },
  { id: 5, codigo: "ITR-005", descricao: "Taxa de Emissão GTA - Aves", unidadeMedidaId: 6, receitaId: 2, indiceId: "1", quantidadeIndice: 1, permiteContribuicaoFundo: false, situacao: "Ativo" },
  { id: 6, codigo: "ITR-006", descricao: "Taxa de Emissão GTA - Equídeos", unidadeMedidaId: 6, receitaId: 2, indiceId: "1", quantidadeIndice: 3, permiteContribuicaoFundo: false, situacao: "Ativo" },
  { id: 7, codigo: "ITR-007", descricao: "Taxa de Emissão GTA - Suínos", unidadeMedidaId: 6, receitaId: 2, indiceId: "1", quantidadeIndice: 1, permiteContribuicaoFundo: false, situacao: "Ativo" },
];

function hidratar(item: ItemReceita): ItemReceitaVisual {
  const unidade = listarUnidadesMedida().find((registro) => registro.id === item.unidadeMedidaId);
  const receita = listarReceitas().find((registro) => registro.id === item.receitaId);
  const indice = listarIndices().find((registro) => registro.id === item.indiceId);
  const quantidade = item.quantidadeIndice.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
  return {
    ...item,
    itemReceita: item.descricao,
    nome: item.descricao,
    unidadeMedida: unidade?.nome ?? "Unidade não encontrada",
    receita: receita?.descricao ?? "Receita não encontrada",
    indice: indice?.nome ?? "Índice não encontrado",
    contribuicaoFundo: item.permiteContribuicaoFundo ? "Sim" : "Não",
    quantidadeIndiceFormatada: `${quantidade} ${indice?.nome ?? ""}`.trim(),
  };
}

export function listarItensReceita() {
  return listarColecaoMock(COLECAO, ITENS_RECEITA_INICIAIS).map(hidratar);
}

export function obterItemReceita(id?: number | null) {
  const itens = listarItensReceita();
  if (id == null) return itens[0] ?? null;
  return itens.find((item) => item.id === id) ?? null;
}

export function salvarItemReceita(
  dados: Omit<ItemReceita, "id" | "codigo"> & { id?: number; codigo?: string },
) {
  const atuais = listarColecaoMock(COLECAO, ITENS_RECEITA_INICIAIS);
  const id = dados.id ?? proximoIdNumerico(atuais);
  const registro: ItemReceita = {
    ...dados,
    id,
    codigo: dados.codigo ?? `ITR-${String(id).padStart(3, "0")}`,
  };
  salvarColecaoMock(
    COLECAO,
    atuais.some((item) => item.id === id)
      ? atuais.map((item) => (item.id === id ? registro : item))
      : [registro, ...atuais],
  );
  return obterItemReceita(id)!;
}
