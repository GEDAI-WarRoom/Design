import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";
import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";
import { listarEspecies, type Especie } from "../../Animal/Especie/especieData";
import { listarPapeis, type Papel } from "../../Controle/Papeis/papeisData";

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
  papelIds: number[];
  procedencias: unknown[];
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

export interface FinalidadeTransitoVisual extends FinalidadeTransito {
  nome: string;
  tipoProcedencia: string;
  tipoDestino: string;
  especies: Especie[];
  papeis: Papel[];
}

const COLECAO = "finalidades-transito";

const FINALIDADES_INICIAIS: FinalidadeTransito[] = [
  { id: 1, codigo: "FIN-001", finalidade: "Abate", descricao: "Trânsito de animais destinados ao abate.", codigoMapa: "01", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Abatedouro Frigorífico"], especieIds: [1, 2, 3, 4, 5], papelIds: [1], procedencias: [], situacao: "Ativo" },
  { id: 2, codigo: "FIN-002", finalidade: "Engorda", descricao: "Trânsito de animais destinados à engorda.", codigoMapa: "02", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: ["Emite para dentro do Estado"], tiposDestino: ["Estabelecimento Agropecuário"], especieIds: [1, 2, 3, 4], papelIds: [4], procedencias: [], situacao: "Ativo" },
  { id: 3, codigo: "FIN-003", finalidade: "Reprodução", descricao: "Trânsito de animais destinados à reprodução.", codigoMapa: "03", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Estabelecimento Agropecuário"], especieIds: [1, 2, 3, 4], papelIds: [2], procedencias: [], situacao: "Ativo" },
  { id: 4, codigo: "FIN-004", finalidade: "Evento", descricao: "Trânsito de animais destinados a evento pecuário.", codigoMapa: "04", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Evento Pecuário"], especieIds: [1, 2, 3, 4, 5], papelIds: [1, 3], procedencias: [], situacao: "Ativo" },
  { id: 5, codigo: "FIN-005", finalidade: "Pesagem", descricao: "Trânsito de animais destinados à pesagem.", codigoMapa: "05", tiposProcedencia: ["Estabelecimento Agropecuário"], emiteAcessoExterno: [], tiposDestino: ["Local de Pesagem"], especieIds: [1, 2], papelIds: [1], procedencias: [], situacao: "Ativo" },
];

function descricaoPadrao(finalidade: string) {
  return finalidade
    ? `Trânsito de animais com finalidade de ${finalidade.toLocaleLowerCase("pt-BR")}.`
    : "Finalidade de trânsito de animais.";
}

export function hidratarFinalidadeTransito(
  item: FinalidadeTransito | Partial<FinalidadeTransitoVisual> | null | undefined,
): FinalidadeTransitoVisual {
  const legado = item ?? {};
  const especieIds = Array.isArray(legado.especieIds)
    ? legado.especieIds
    : Array.isArray(legado.especies)
      ? legado.especies.map((especie) => especie.id).filter((id): id is number => typeof id === "number")
      : [];
  const papeisLegados = Array.isArray(legado.papelIds) && legado.papelIds.length
    ? legado.papelIds
    : Array.isArray(legado.papeis)
      ? legado.papeis
      : [];
  const papelIdsNormalizados = papeisLegados
    .map((papel: any) => Number(typeof papel === "object" ? papel?.id : papel))
    .filter((id: number) => Number.isFinite(id));
  const papelIdsPadrao = FINALIDADES_INICIAIS.find(
    (item) => item.id === Number(legado.id),
  )?.papelIds ?? [];
  const papelIds = papelIdsNormalizados.length ? papelIdsNormalizados : papelIdsPadrao;
  const tiposProcedencia = Array.isArray(legado.tiposProcedencia)
    ? legado.tiposProcedencia
    : [legado.tipoProcedencia].filter((valor): valor is string => Boolean(valor));
  const tiposDestino = Array.isArray(legado.tiposDestino)
    ? legado.tiposDestino
    : [legado.tipoDestino].filter((valor): valor is string => Boolean(valor));
  const emiteAcessoExterno = Array.isArray(legado.emiteAcessoExterno)
    ? legado.emiteAcessoExterno
    : [];
  const especies = listarEspecies().filter((especie) => especieIds.includes(especie.id));
  const papeis = listarPapeis().filter((papel) => papelIds.includes(papel.id));
  const situacao = ["Ativo", "Inativo", "Suspenso"].includes(String(legado.situacao))
    ? legado.situacao as FinalidadeTransito["situacao"]
    : "Ativo";
  const idInformado = Number(legado.id);
  const id = Number.isFinite(idInformado) ? idInformado : 0;
  const finalidade = legado.finalidade ?? legado.nome ?? "";

  return {
    ...legado,
    id,
    codigo: legado.codigo ?? `FIN-${String(id).padStart(3, "0")}`,
    finalidade,
    descricao: legado.descricao?.trim() || descricaoPadrao(finalidade),
    codigoMapa: legado.codigoMapa ?? "",
    tiposProcedencia,
    emiteAcessoExterno,
    tiposDestino,
    especieIds,
    papelIds,
    procedencias: Array.isArray(legado.procedencias) ? legado.procedencias : [],
    situacao,
    nome: finalidade,
    tipoProcedencia: tiposProcedencia[0] ?? "",
    tipoDestino: tiposDestino[0] ?? "",
    especies,
    papeis,
  };
}

export function listarFinalidadesTransito() {
  return listarColecaoMock(COLECAO, FINALIDADES_INICIAIS).map(hidratarFinalidadeTransito);
}

function chaveHistorico(id: number) {
  return `finalidade-transito:${id}`;
}

function criarHistoricoInicial(
  registro: FinalidadeTransitoVisual,
): HistoricoCadastroItem<FinalidadeTransitoVisual>[] {
  const agora = new Date();
  const data = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(agora);
  const hora = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(agora);

  return [{
    id: `inicial-${registro.id}`,
    data,
    hora,
    alteradoPor: "Usuário do sistema",
    atual: true,
    dados: registro,
  }];
}

export function obterHistoricoFinalidadeTransito(
  registro: FinalidadeTransitoVisual,
) {
  const historico = carregarHistoricoCadastro<FinalidadeTransitoVisual>(
    chaveHistorico(registro.id),
    criarHistoricoInicial(registro),
  );
  return historico.map((item) => ({
    ...item,
    dados: item.atual
      ? registro
      : hidratarFinalidadeTransito({ ...registro, ...(item.dados ?? {}) }),
  }));
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
    papelIds: dados.papelIds ?? [],
    id,
    codigo: dados.codigo ?? `FIN-${String(id).padStart(3, "0")}`,
  };
  const registroAnterior = atuais.find((item) => item.id === id);
  salvarColecaoMock(
    COLECAO,
    atuais.some((item) => item.id === id)
      ? atuais.map((item) => (item.id === id ? registro : item))
      : [registro, ...atuais],
  );

  if (registroAnterior && JSON.stringify(registroAnterior) !== JSON.stringify(registro)) {
    registrarVersaoCadastro({
      chaveCadastro: chaveHistorico(id),
      historicoInicial: criarHistoricoInicial(hidratarFinalidadeTransito(registroAnterior)),
      dadosAnteriores: hidratarFinalidadeTransito(registroAnterior),
      dadosAtuais: hidratarFinalidadeTransito(registro),
      alteradoPor: "Usuário do sistema",
    });
  }

  return obterFinalidadeTransito(id)!;
}

export function listarFinalidadesParaGta(especieId?: number) {
  return listarFinalidadesTransito()
    .filter((item) => item.situacao === "Ativo" && (!especieId || item.especieIds.includes(especieId)))
    .map((item) => ({ id: item.id, codigo: item.codigo, nome: item.finalidade }));
}
