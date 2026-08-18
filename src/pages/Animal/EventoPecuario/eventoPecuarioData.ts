export type SituacaoEventoPecuario = "Ativo" | "Inativo" | "Suspenso";
export type SimNaoEvento = "Sim" | "Não";

export interface EspecieEvento {
  id: string | number;
  codigo?: string;
  nome: string;
  grupo: string;
}

export interface PromotoraEvento {
  id: string | number;
  nome: string;
  numeroRegistro: string;
  nomeFantasiaProprietario?: string;
  cnpjProprietario?: string;
}

export interface RecintoEvento {
  id: string | number;
  nome: string;
  codigo?: string;
  municipio?: string;
  proprietario?: string;
  documentoProprietario?: string;
}

export interface EstabelecimentoAuxiliar {
  id: string | number;
  nome: string;
  codigo: string;
  municipio: string;
  proprietario: string;
}

export interface ResponsavelEvento {
  id: string | number;
  nome: string;
  documento: string;
  habilitadoGta?: boolean;
  especiesHabilitadas?: string[];
  ocupadoDe?: string;
  ocupadoAte?: string;
}

export interface AnexoEvento {
  id: string;
  nome: string;
  descricao: string;
}

export interface EventoPecuarioRegistro {
  id?: string | number;
  codigo: string;
  nomeEvento: string;
  periodoDe: string;
  periodoAte: string;
  especies: EspecieEvento[];
  tipoEventoPecuario: string;
  atividadeEvento: string;
  tipoLeilao: string;
  isencaoBrucelose: SimNaoEvento;
  promotora: PromotoraEvento | null;
  recinto: RecintoEvento | null;
  possuiAuxilioEstabelecimento: SimNaoEvento;
  estabelecimentoAgropecuario: EstabelecimentoAuxiliar | null;
  responsaveisTecnicos: ResponsavelEvento[];
  anexos: AnexoEvento[];
  observacoes: string;
  situacao: SituacaoEventoPecuario;
  usuarioUltimaAlteracao: string;
  dataUltimaModificacao: string;
}

export const TIPOS_EVENTO = [
  { value: "Com finalidade comercial", label: "Com finalidade comercial" },
  { value: "Sem finalidade comercial", label: "Sem finalidade comercial" },
];

export const ATIVIDADES_COMERCIAIS = [
  { value: "Feira", label: "Feira" },
  { value: "Leilão", label: "Leilão" },
];

export const ATIVIDADES_NAO_COMERCIAIS = [
  { value: "Esporte", label: "Esporte" },
  { value: "Exposição", label: "Exposição" },
  { value: "Torneio Leiteiro", label: "Torneio Leiteiro" },
  { value: "Torneio de Canto", label: "Torneio de Canto" },
];

export const TIPOS_LEILAO = [
  {
    value: "Animais com ambas as finalidades engorda e reprodução (misto)",
    label: "Animais com ambas as finalidades engorda e reprodução (misto)",
  },
  {
    value: "Animais com finalidade de engorda (corte)",
    label: "Animais com finalidade de engorda (corte)",
  },
  {
    value: "Animais com registro genealógico ou com finalidade de reprodução ou produção leiteira",
    label: "Animais com registro genealógico ou com finalidade de reprodução ou produção leiteira",
  },
];

export const ESPECIES_EVENTO_MOCK: EspecieEvento[] = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "ESP-005", nome: "Caprino", grupo: "Caprinos" },
  { id: 6, codigo: "ESP-006", nome: "Galinha", grupo: "Aves" },
];

export const PROMOTORAS_EVENTO_MOCK: PromotoraEvento[] = [
  {
    id: 1,
    nome: "PH Leilões LTDA",
    numeroRegistro: "14385",
    nomeFantasiaProprietario: "PH Agronegócios",
    cnpjProprietario: "12.345.678/0001-90",
  },
  {
    id: 2,
    nome: "Central de Leilões Minas",
    numeroRegistro: "20981",
    nomeFantasiaProprietario: "CLM Eventos",
    cnpjProprietario: "23.456.789/0001-11",
  },
  {
    id: 3,
    nome: "Associação de Criadores do Sul",
    numeroRegistro: "30442",
    nomeFantasiaProprietario: "ACS Eventos Pecuários",
    cnpjProprietario: "34.567.890/0001-22",
  },
];

export const RECINTOS_EVENTO_MOCK: RecintoEvento[] = [
  {
    id: 1,
    nome: "Fazenda Japecanga",
    municipio: "Lavras/MG",
    proprietario: "João Batista Ferreira",
    documentoProprietario: "123.456.789-10",
    codigo: "940877688",
  },
  {
    id: 2,
    nome: "Parque de Exposições Vale Verde",
    municipio: "Varginha/MG",
    proprietario: "Associação Rural Vale Verde",
    documentoProprietario: "23.456.789/0001-55",
    codigo: "562349001",
  },
  {
    id: 3,
    nome: "Recinto Serra do Café",
    municipio: "Três Pontas/MG",
    proprietario: "Cooperativa Serra do Café",
    documentoProprietario: "34.567.890/0001-66",
    codigo: "851239859",
  },
];

export const ESTABELECIMENTOS_AUXILIARES_MOCK: EstabelecimentoAuxiliar[] = [
  {
    id: 1,
    nome: "Fazenda Rio Preto",
    codigo: "34523423567",
    municipio: "Lavras/MG",
    proprietario: "Carlos Henrique Souza — 333.888.777-11",
  },
  {
    id: 2,
    nome: "Fazenda Boa Esperança",
    codigo: "310010400060012",
    municipio: "Varginha/MG",
    proprietario: "Agropecuária Boa Esperança — 12.345.678/0001-99",
  },
];

export const RESPONSAVEIS_EVENTO_MOCK: ResponsavelEvento[] = [
  {
    id: 1,
    nome: "José Teixeira Sabino",
    documento: "444.009.956-40",
    habilitadoGta: true,
    especiesHabilitadas: ["Bovino", "Bubalino", "Caprino"],
  },
  {
    id: 2,
    nome: "Marina Couto Dias",
    documento: "333.221.115-09",
    habilitadoGta: true,
    especiesHabilitadas: ["Equino", "Suíno", "Galinha"],
    ocupadoDe: "2026-09-11",
    ocupadoAte: "2026-09-12",
  },
  {
    id: 3,
    nome: "Carlos Henrique Reis",
    documento: "222.114.558-70",
    habilitadoGta: false,
    especiesHabilitadas: [],
  },
];

const EVENTOS_EXISTENTES = [
  { id: 1, codigo: "86237", nomeEvento: "Torneio de Pássaros de São João del Rei", periodoDe: "2026-06-01", periodoAte: "2026-06-03" },
  { id: 2, codigo: "86241", nomeEvento: "Leilão Genética Premium", periodoDe: "2026-07-10", periodoAte: "2026-07-10" },
  { id: 3, codigo: "86255", nomeEvento: "Feira Agropecuária de Três Pontas", periodoDe: "2026-03-12", periodoAte: "2026-03-15" },
  { id: 4, codigo: "86260", nomeEvento: "Exposição Equina Regional", periodoDe: "2025-11-01", periodoAte: "2025-11-05" },
];

function texto(valor: unknown, exemplo: string, usarExemplo: boolean) {
  if (typeof valor === "string" && valor.trim()) return valor;
  return usarExemplo ? exemplo : "";
}

function enriquecerPorNome<T extends { nome: string }>(entidade: any, base: T[]) {
  if (!entidade) return null;
  const encontrada = base.find(
    (item: any) => String(item.id) === String(entidade.id) || item.nome === entidade.nome,
  );
  return encontrada ? { ...encontrada, ...entidade } : entidade;
}

function normalizarEspecies(dados: any, usarExemplo: boolean) {
  const possuiListaInformada = Array.isArray(dados?.especies) || Array.isArray(dados?.especie);
  const originais = Array.isArray(dados?.especies)
    ? dados.especies
    : Array.isArray(dados?.especie)
      ? dados.especie.map((item: any) => item?.especie ?? item)
      : [];

  const normalizadas = originais
    .filter(Boolean)
    .map((item: any) => enriquecerPorNome(item, ESPECIES_EVENTO_MOCK));

  return normalizadas.length
    ? normalizadas
    : usarExemplo && !possuiListaInformada
      ? [ESPECIES_EVENTO_MOCK[0]]
      : [];
}

function normalizarResponsaveis(dados: any, usarExemplo: boolean) {
  const valor = dados?.responsaveisTecnicos ?? dados?.responsavelTecnico;
  const possuiListaInformada = Array.isArray(dados?.responsaveisTecnicos)
    || Array.isArray(dados?.responsavelTecnico);
  const originais = Array.isArray(valor) ? valor : valor ? [valor] : [];
  const normalizados = originais
    .map((item: any) => item?.responsavel ?? item)
    .filter(Boolean)
    .map((item: any) => enriquecerPorNome(item, RESPONSAVEIS_EVENTO_MOCK));

  return normalizados.length
    ? normalizados
    : usarExemplo && !possuiListaInformada
      ? [RESPONSAVEIS_EVENTO_MOCK[0]]
      : [];
}

function normalizarAnexos(dados: any, usarExemplo: boolean): AnexoEvento[] {
  const anexos = Array.isArray(dados?.anexos) ? dados.anexos : [];
  if (anexos.length) {
    return anexos.map((item: any, index: number) => ({
      id: String(item.id ?? item.uid ?? `anexo-${index + 1}`),
      nome: item.nome ?? item.nomeArquivo ?? "",
      descricao: item.descricao ?? "",
    }));
  }

  return usarExemplo && !Array.isArray(dados?.anexos)
    ? [{ id: "anexo-exemplo", nome: "contrato_evento.pdf", descricao: "Regulamento oficial do evento pecuário" }]
    : [];
}

function normalizarCaracterizacao(dados: any, usarExemplo: boolean) {
  const legado = dados?.tipoEvento;
  const tipoInformado = dados?.tipoEventoPecuario;
  const tipo = tipoInformado || (
    legado === "Feira Agropecuária" || legado === "Leilão"
      ? "Com finalidade comercial"
      : legado === "Exposição Agropecuária"
        ? "Sem finalidade comercial"
        : TIPOS_EVENTO.some((item) => item.value === legado)
          ? legado
          : ""
  );
  const atividadeLegada = legado === "Feira Agropecuária"
    ? "Feira"
    : legado === "Exposição Agropecuária"
      ? "Exposição"
      : legado === "Leilão"
        ? "Leilão"
        : "";

  return {
    tipoEventoPecuario: texto(tipo, "Com finalidade comercial", usarExemplo),
    atividadeEvento: texto(dados?.atividadeEvento ?? atividadeLegada, "Leilão", usarExemplo),
    tipoLeilao: texto(
      dados?.tipoLeilao,
      "Animais com ambas as finalidades engorda e reprodução (misto)",
      usarExemplo,
    ),
  };
}

export function criarEventoPecuarioInicial(dados: any = {}, usarExemplo = false): EventoPecuarioRegistro {
  const caracterizacao = normalizarCaracterizacao(dados, usarExemplo);
  const promotora = enriquecerPorNome(dados?.promotora, PROMOTORAS_EVENTO_MOCK)
    ?? (usarExemplo ? PROMOTORAS_EVENTO_MOCK[0] : null);
  const recinto = enriquecerPorNome(dados?.recinto ?? dados?.estabelecimento, RECINTOS_EVENTO_MOCK)
    ?? (usarExemplo ? RECINTOS_EVENTO_MOCK[0] : null);
  const possuiAuxilio = dados?.possuiAuxilioEstabelecimento === "Sim" || dados?.possuiAuxilio === true
    ? "Sim"
    : dados?.possuiAuxilioEstabelecimento === "Não" || dados?.possuiAuxilio === false
      ? "Não"
      : usarExemplo
        ? "Sim"
        : "Não";
  const estabelecimento = enriquecerPorNome(
    dados?.estabelecimentoAgropecuario,
    ESTABELECIMENTOS_AUXILIARES_MOCK,
  ) ?? (usarExemplo && possuiAuxilio === "Sim" ? ESTABELECIMENTOS_AUXILIARES_MOCK[0] : null);
  const isencaoEditavel = isencaoBruceloseEditavel(caracterizacao.atividadeEvento);

  return {
    ...dados,
    codigo: texto(dados?.codigo, "86261", usarExemplo),
    nomeEvento: texto(dados?.nomeEvento, "Leilão Regional de Bovinos", usarExemplo),
    periodoDe: texto(dados?.periodoDe ?? dados?.validadeDe, "2026-09-10", usarExemplo),
    periodoAte: texto(dados?.periodoAte ?? dados?.validadeAte, "2026-09-14", usarExemplo),
    especies: normalizarEspecies(dados, usarExemplo),
    ...caracterizacao,
    isencaoBrucelose: isencaoEditavel
      ? (dados?.isencaoBrucelose === "Sim" ? "Sim" : dados?.isencaoBrucelose === "Não" ? "Não" : usarExemplo ? "Não" : "") as SimNaoEvento
      : calcularIsencaoBruceloseSomenteLeitura(caracterizacao.atividadeEvento, caracterizacao.tipoLeilao),
    promotora,
    recinto,
    possuiAuxilioEstabelecimento: possuiAuxilio,
    estabelecimentoAgropecuario: possuiAuxilio === "Sim" ? estabelecimento : null,
    responsaveisTecnicos: normalizarResponsaveis(dados, usarExemplo),
    anexos: normalizarAnexos(dados, usarExemplo),
    observacoes: texto(dados?.observacoes ?? dados?.observacao, "Evento realizado com acompanhamento veterinário oficial.", usarExemplo),
    situacao: (["Ativo", "Inativo", "Suspenso"].includes(dados?.situacao) ? dados.situacao : "Ativo") as SituacaoEventoPecuario,
    usuarioUltimaAlteracao: texto(dados?.usuarioUltimaAlteracao, "Lucas Pedro Conte", usarExemplo),
    dataUltimaModificacao: texto(dados?.dataUltimaModificacao, "05/08/2026 10:30", usarExemplo),
  };
}

export function possuiEspecieBovideos(especies: EspecieEvento[]) {
  return especies.some((item) => item.grupo?.toLocaleLowerCase("pt-BR").includes("boví"));
}

const TIPO_LEILAO_ISENCAO_SIM = "Animais com registro genealógico ou com finalidade de reprodução ou produção leiteira";

export function isencaoBruceloseEditavel(atividadeEvento: string) {
  return atividadeEvento === "Feira" || atividadeEvento === "Esporte";
}

export function calcularIsencaoBruceloseSomenteLeitura(atividadeEvento: string, tipoLeilao: string): SimNaoEvento {
  if (atividadeEvento === "Leilão") return tipoLeilao === TIPO_LEILAO_ISENCAO_SIM ? "Sim" : "Não";
  return "Não";
}

export function validarEventoPecuario(registro: EventoPecuarioRegistro, editando = false) {
  const erros: string[] = [];
  if (!registro.nomeEvento.trim()) erros.push("Informe o nome do evento.");
  if (registro.nomeEvento.length > 255) erros.push("O nome do evento deve possuir no máximo 255 caracteres.");
  if (!registro.periodoDe) erros.push("Informe a data inicial do evento.");
  if (!registro.periodoAte) erros.push("Informe a data final do evento.");
  if (registro.periodoDe && registro.periodoAte && registro.periodoAte < registro.periodoDe) {
    erros.push("A data final deve ser maior ou igual à data inicial do evento.");
  }
  if (!registro.especies.length) erros.push("Informe pelo menos uma espécie do evento.");
  if (!registro.tipoEventoPecuario) erros.push("Informe o tipo de evento pecuário.");
  if (!registro.atividadeEvento) erros.push("Informe a atividade do evento.");
  if (
    registro.atividadeEvento === "Leilão"
    && possuiEspecieBovideos(registro.especies)
    && !registro.tipoLeilao
  ) {
    erros.push("Informe o tipo de leilão.");
  }
  if (isencaoBruceloseEditavel(registro.atividadeEvento) && !registro.isencaoBrucelose) {
    erros.push("Informe se o evento possui isenção de exame de brucelose/tuberculose.");
  }
  if (!registro.promotora) erros.push("Informe a promotora de eventos pecuários.");
  if (!registro.recinto) erros.push("Informe o estabelecimento/recinto do evento.");
  if (registro.possuiAuxilioEstabelecimento === "Sim" && !registro.estabelecimentoAgropecuario) {
    erros.push("Informe o estabelecimento agropecuário auxiliar.");
  }
  if (registro.anexos.some((item) => !item.nome)) {
    erros.push("Selecione o documento de todos os anexos adicionados.");
  }
  if (registro.anexos.some((item) => item.descricao.length > 255)) {
    erros.push("A descrição do anexo deve possuir no máximo 255 caracteres.");
  }
  if (registro.observacoes.length > 1500) {
    erros.push("A observação deve possuir no máximo 1500 caracteres.");
  }

  const duplicado = EVENTOS_EXISTENTES.some((item) =>
    item.nomeEvento.toLocaleLowerCase("pt-BR") === registro.nomeEvento.trim().toLocaleLowerCase("pt-BR")
    && item.periodoDe === registro.periodoDe
    && item.periodoAte === registro.periodoAte
    && (!editando || (String(item.id) !== String(registro.id) && item.codigo !== registro.codigo)),
  );
  if (duplicado) erros.push("Já existe um evento com o mesmo nome e período de realização.");

  return erros;
}

function periodosSeSobrepoem(inicioA: string, fimA: string, inicioB?: string, fimB?: string) {
  return Boolean(inicioA && fimA && inicioB && fimB && inicioA <= fimB && inicioB <= fimA);
}

export function obterAlertasEventoPecuario(registro: EventoPecuarioRegistro) {
  const alertas: string[] = [];
  const responsavelSobreposto = registro.responsaveisTecnicos.find((responsavel) =>
    periodosSeSobrepoem(
      registro.periodoDe,
      registro.periodoAte,
      responsavel.ocupadoDe,
      responsavel.ocupadoAte,
    ),
  );
  if (responsavelSobreposto) {
    alertas.push(
      `${responsavelSobreposto.nome} possui outro evento com interseção no período informado. O cadastro pode continuar.`,
    );
  }

  if (!registro.responsaveisTecnicos.length && registro.especies.length) {
    alertas.push(
      "Nenhum responsável técnico foi informado para cobrir as espécies do evento. O cadastro pode continuar.",
    );
  } else if (registro.responsaveisTecnicos.length) {
    const especiesCobertas = new Set(
      registro.responsaveisTecnicos.flatMap((responsavel) => responsavel.especiesHabilitadas ?? []),
    );
    const especiesSemCobertura = registro.especies
      .map((item) => item.nome)
      .filter((nome) => !especiesCobertas.has(nome));
    if (especiesSemCobertura.length) {
      alertas.push(
        `As habilitações dos responsáveis não cobrem: ${especiesSemCobertura.join(", ")}. O cadastro pode continuar.`,
      );
    }
  }

  return alertas;
}

export function gerarCodigoEvento() {
  return String(Math.max(...EVENTOS_EXISTENTES.map((item) => Number(item.codigo))) + 1);
}

export function calcularSituacaoAutomatica(
  periodoAte: string,
  situacaoAtual: SituacaoEventoPecuario,
  possuiPendencias = false,
  hoje = new Date().toISOString().slice(0, 10),
): SituacaoEventoPecuario {
  if (!periodoAte || periodoAte >= hoje || situacaoAtual === "Inativo") return situacaoAtual;
  return possuiPendencias ? "Suspenso" : "Inativo";
}
