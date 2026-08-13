import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";
import { listarEspecies, type Especie } from "../../Animal/Especie/especieData";

export interface FinalidadeTransito {
  id: number;
  codigo: string;
  finalidade: string;
  descricao?: string;
  codigoMapa: string;
  tiposProcedencia: string[];
  emiteAcessoExterno: string[];
  tiposDestino: string[];
  especieIds: number[];
  procedencias: unknown[];
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

export interface FinalidadeTransitoVisual extends FinalidadeTransito {
  nome: string;
  tipoProcedencia: string;
  tipoDestino: string;
  especies: Especie[];
}

const COLECAO = "finalidades-transito";

const FINALIDADES_INICIAIS: FinalidadeTransito[] = [
  { id: 1, codigo: "FIN-001", finalidade: "Abate", codigoMapa: "01", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Abatedouro Frigorífico"], especieIds: [1, 2, 3, 4, 5], procedencias: [], situacao: "Ativo" },
  { id: 2, codigo: "FIN-002", finalidade: "Engorda", codigoMapa: "02", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: ["Emite para dentro do Estado"], tiposDestino: ["Estabelecimento Agropecuário"], especieIds: [1, 2, 3, 4], procedencias: [], situacao: "Ativo" },
  { id: 3, codigo: "FIN-003", finalidade: "Reprodução", codigoMapa: "03", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Estabelecimento Agropecuário"], especieIds: [1, 2, 3, 4], procedencias: [], situacao: "Ativo" },
  { id: 4, codigo: "FIN-004", finalidade: "Evento", codigoMapa: "04", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Evento Pecuário"], especieIds: [1, 2, 3, 4, 5], procedencias: [], situacao: "Ativo" },
  { id: 5, codigo: "FIN-005", finalidade: "Pesagem", codigoMapa: "05", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Local de Pesagem"], especieIds: [1, 2], procedencias: [], situacao: "Ativo" },
];

function hidratar(item: FinalidadeTransito): FinalidadeTransitoVisual {
  const especies = listarEspecies().filter((especie) => item.especieIds.includes(especie.id));
  return {
    ...item,
    nome: item.finalidade,
    tipoProcedencia: item.tiposProcedencia[0] ?? "",
    tipoDestino: item.tiposDestino[0] ?? "",
    especies,
  };
}

export function listarFinalidadesTransito() {
  return listarColecaoMock(COLECAO, FINALIDADES_INICIAIS).map(hidratar);
}

export function obterFinalidadeTransito(id?: number | null) {
  const finalidades = listarFinalidadesTransito();
  if (id == null) return finalidades[0] ?? null;
  return finalidades.find((item) => item.id === id) ?? null;
}

export function salvarFinalidadeTransito(
  dados: Omit<FinalidadeTransito, "id" | "codigo"> & { id?: number; codigo?: string },
) {
  const atuais = listarColecaoMock(COLECAO, FINALIDADES_INICIAIS);
  const id = dados.id ?? proximoIdNumerico(atuais);
  const registro: FinalidadeTransito = {
    ...dados,
    id,
    codigo: dados.codigo ?? `FIN-${String(id).padStart(3, "0")}`,
  };
  salvarColecaoMock(
    COLECAO,
    atuais.some((item) => item.id === id)
      ? atuais.map((item) => (item.id === id ? registro : item))
      : [registro, ...atuais],
  );
  return obterFinalidadeTransito(id)!;
}

export function listarFinalidadesParaGta(especieId?: number) {
  return listarFinalidadesTransito()
    .filter((item) => item.situacao === "Ativo" && (!especieId || item.especieIds.includes(especieId)))
    .map((item) => ({ id: item.id, codigo: item.codigo, nome: item.finalidade }));
}
