import { listarColecaoMock } from "../../../mocks/mockDatabase";

export interface EstabelecimentoLiderVinculado {
  id: number;
  liderPerfil: "lider-estabelecimento";
  codigo: string;
  nomeComercial: string;
  registroSie: string;
  situacao: "Ativo" | "Inativo";
}

const COLECAO = "estabelecimentos-lider";
const ESTABELECIMENTOS_INICIAIS: EstabelecimentoLiderVinculado[] = [
  { id: 1, liderPerfil: "lider-estabelecimento", codigo: "3100000001", nomeComercial: "Frigorífico São José", registroSie: "17126", situacao: "Ativo" },
  { id: 2, liderPerfil: "lider-estabelecimento", codigo: "3100000002", nomeComercial: "Unidade Industrial II", registroSie: "17127", situacao: "Ativo" },
  { id: 3, liderPerfil: "lider-estabelecimento", codigo: "3100000003", nomeComercial: "Centro de Distribuição", registroSie: "17128", situacao: "Ativo" },
];

export function listarEstabelecimentosDoLider(perfil: "lider-estabelecimento") {
  return listarColecaoMock(COLECAO, ESTABELECIMENTOS_INICIAIS).filter(
    (item) => item.liderPerfil === perfil && item.situacao === "Ativo",
  );
}
