import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
  salvarHistoricoCadastro,
} from "../../../components/ui/historicoCadastroStorage";
import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoEtapaVacinacao = "Criada" | "Aberta" | "Finalizada";
export type RespostaSimNao = "Sim" | "Não";
export type SexoFaixaEtaria = "Macho" | "Fêmea" | "Único";
export type SexoVacinacaoObrigatoria = "Macho" | "Fêmea";

export interface DoencaEtapaVacinacao {
  id: number;
  codigo: string;
  nome: string;
  especiesIds: number[];
  tiposVacina: string[];
  vacinavel: boolean;
}

export interface EspecieEtapaVacinacao {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
  sexoDefinido: boolean;
  faixasEtarias: string[];
}

export interface FaixasEspecieEtapa {
  especieId: number;
  sexos?: SexoVacinacaoObrigatoria[];
  faixasEtarias?: string[];
  // Campos legados mantidos para restaurar cadastros gravados antes da US0V6.
  macho: string[];
  femea: string[];
  unico: string[];
}

export interface TipoVacinacaoEtapa {
  uid: string;
  nome: string;
  instrucoes: string;
  faixasPorEspecie: FaixasEspecieEtapa[];
  vacinasAplicaveis: string[];
}

export interface EtapaVacinacao {
  id: number;
  codigo: string;
  dataInicio: string;
  dataFim: string;
  doenca: DoencaEtapaVacinacao;
  necessitaAtestadoDeclaracao: RespostaSimNao;
  permiteDeclararMaisAnimais: RespostaSimNao;
  especies: EspecieEtapaVacinacao[];
  tiposVacinacao: TipoVacinacaoEtapa[];
  situacao: SituacaoEtapaVacinacao;
}

export type EtapaVacinacaoDraft = Omit<EtapaVacinacao, "id" | "codigo" | "situacao">;

const COLECAO = "etapas-vacinacao-us0v6-v3";
const CHAVE_HISTORICO = (id: number) => `etapa-vacinacao-v3:${id}`;

export const ESPECIES_ETAPA_MOCK: EspecieEtapaVacinacao[] = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos", sexoDefinido: true, faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "De 25 a 36 meses", "Acima de 36 meses"] },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos", sexoDefinido: true, faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"] },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos", sexoDefinido: true, faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"] },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos", sexoDefinido: true, faixasEtarias: ["Leitões", "Recria", "Adultos"] },
  { id: 5, codigo: "ESP-005", nome: "Ovino", grupo: "Ovinos e Caprinos", sexoDefinido: true, faixasEtarias: ["De 0 a 6 meses", "De 7 a 12 meses", "Acima de 12 meses"] },
  { id: 6, codigo: "ESP-006", nome: "Caprino", grupo: "Ovinos e Caprinos", sexoDefinido: true, faixasEtarias: ["De 0 a 6 meses", "De 7 a 12 meses", "Acima de 12 meses"] },
  { id: 7, codigo: "ESP-007", nome: "Aves", grupo: "Aves", sexoDefinido: false, faixasEtarias: ["1 dia de vida", "Jovens", "Adultas"] },
  { id: 8, codigo: "ESP-008", nome: "Asinino", grupo: "Equídeos", sexoDefinido: true, faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"] },
  { id: 9, codigo: "ESP-009", nome: "Muar", grupo: "Equídeos", sexoDefinido: true, faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"] },
];

export const DOENCAS_ETAPA_MOCK: DoencaEtapaVacinacao[] = [
  { id: 1, codigo: "D-001", nome: "Brucelose", especiesIds: [1, 2], tiposVacina: ["Vacina de Brucelose RB51", "Vacina de Brucelose B19"], vacinavel: true },
  { id: 2, codigo: "D-002", nome: "Febre Aftosa", especiesIds: [1, 2, 4], tiposVacina: ["Bivalente", "O1 Campos", "A24 Cruzeiro"], vacinavel: true },
  { id: 3, codigo: "D-003", nome: "Raiva", especiesIds: [1, 2, 6, 5, 3, 8, 9], tiposVacina: ["Vacina de Raiva"], vacinavel: true },
  { id: 4, codigo: "D-004", nome: "Doença de Newcastle", especiesIds: [7], tiposVacina: ["Viva atenuada", "Inativada"], vacinavel: true },
];

function uid(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function especie(id: number) {
  return ESPECIES_ETAPA_MOCK.find((item) => item.id === id)!;
}

function doenca(id: number) {
  return DOENCAS_ETAPA_MOCK.find((item) => item.id === id)!;
}

function faixasCompletas(especieId: number): FaixasEspecieEtapa {
  const item = especie(especieId);
  return {
    especieId,
    sexos: item.sexoDefinido ? ["Macho", "Fêmea"] : [],
    faixasEtarias: [...item.faixasEtarias],
    macho: item.sexoDefinido ? [...item.faixasEtarias] : [],
    femea: item.sexoDefinido ? [...item.faixasEtarias] : [],
    unico: item.sexoDefinido ? [] : [...item.faixasEtarias],
  };
}

function faixasSelecionadas(
  especieId: number,
  faixasEtarias: string[],
  sexos: SexoVacinacaoObrigatoria[],
): FaixasEspecieEtapa {
  return {
    especieId,
    sexos: [...sexos],
    faixasEtarias: [...faixasEtarias],
    macho: sexos.includes("Macho") ? [...faixasEtarias] : [],
    femea: sexos.includes("Fêmea") ? [...faixasEtarias] : [],
    unico: [],
  };
}

const ETAPAS_INICIAIS: EtapaVacinacao[] = [
  {
    id: 1,
    codigo: "2026/01",
    dataInicio: "2026-01-01",
    dataFim: "2026-06-30",
    doenca: doenca(1),
    necessitaAtestadoDeclaracao: "Não",
    permiteDeclararMaisAnimais: "Não",
    especies: [especie(1), especie(2)],
    tiposVacinacao: [
      {
        uid: "brucelose-oficial",
        nome: "Vacinação Oficial",
        instrucoes: "A vacinação oficial deve ocorrer apenas em fêmeas de 03 a 08 meses.",
        faixasPorEspecie: [
          faixasSelecionadas(1, ["De 0 a 12 meses"], ["Fêmea"]),
          faixasSelecionadas(2, ["De 0 a 12 meses"], ["Fêmea"]),
        ],
        vacinasAplicaveis: ["Vacina de Brucelose RB51", "Vacina de Brucelose B19"],
      },
      {
        uid: "brucelose-complementar",
        nome: "Vacinação Complementar",
        instrucoes: "A vacinação complementar deve ocorrer em fêmeas acima de 8 meses.",
        faixasPorEspecie: [
          faixasSelecionadas(1, especie(1).faixasEtarias, ["Fêmea"]),
          faixasSelecionadas(2, especie(2).faixasEtarias, ["Fêmea"]),
        ],
        vacinasAplicaveis: ["Vacina de Brucelose RB51"],
      },
    ],
    situacao: "Aberta",
  },
  {
    id: 2,
    codigo: "2027/01",
    dataInicio: "2027-05-01",
    dataFim: "2027-06-30",
    doenca: doenca(2),
    necessitaAtestadoDeclaracao: "Não",
    permiteDeclararMaisAnimais: "Não",
    especies: [especie(1), especie(2), especie(4)],
    tiposVacinacao: [{ uid: "tipo-inicial-2", nome: "Etapa anual", instrucoes: "", faixasPorEspecie: [faixasCompletas(1), faixasCompletas(2), faixasCompletas(4)], vacinasAplicaveis: ["Bivalente"] }],
    situacao: "Criada",
  },
  {
    id: 3,
    codigo: "2026/01",
    dataInicio: "2026-01-01",
    dataFim: "2026-12-31",
    doenca: doenca(3),
    necessitaAtestadoDeclaracao: "Não",
    permiteDeclararMaisAnimais: "Não",
    especies: [especie(1), especie(2), especie(6), especie(5), especie(3), especie(8), especie(9)],
    tiposVacinacao: [
      {
        uid: "raiva-primeira-dose",
        nome: "Primeira Dose",
        instrucoes: "",
        faixasPorEspecie: [1, 2, 6, 5, 3, 8, 9].map(faixasCompletas),
        vacinasAplicaveis: ["Vacina de Raiva"],
      },
      {
        uid: "raiva-segunda-dose",
        nome: "Segunda Dose",
        instrucoes: "",
        faixasPorEspecie: [1, 2, 6, 5, 3, 8, 9].map(faixasCompletas),
        vacinasAplicaveis: ["Vacina de Raiva"],
      },
    ],
    situacao: "Aberta",
  },
];

function hojeIso() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function aplicarRne001(registros: EtapaVacinacao[]) {
  const hoje = hojeIso();
  const alteradas: Array<{ anterior: EtapaVacinacao; atual: EtapaVacinacao }> = [];
  const atualizadas = registros.map((item) => {
    if (item.situacao !== "Criada" || !item.dataInicio || item.dataInicio > hoje) return item;
    const atual = { ...item, situacao: "Aberta" as const };
    alteradas.push({ anterior: item, atual });
    return atual;
  });

  if (alteradas.length) {
    salvarColecaoMock(COLECAO, atualizadas);
    alteradas.forEach(({ anterior, atual }) => registrarVersaoCadastro({
      chaveCadastro: CHAVE_HISTORICO(atual.id),
      alteradoPor: "Sistema (RNE001)",
      dadosAnteriores: anterior,
      dadosAtuais: atual,
    }));
  }
  return atualizadas;
}

export function listarEtapasVacinacao() {
  return aplicarRne001(listarColecaoMock(COLECAO, ETAPAS_INICIAIS));
}

export function obterEtapaVacinacao(dados?: Partial<EtapaVacinacao> | null) {
  const registros = listarEtapasVacinacao();
  if (dados?.id != null) return registros.find((item) => item.id === dados.id) ?? null;
  return null;
}

export function gerarCodigoEtapa(doencaId: number, dataInicio: string) {
  const ano = dataInicio.slice(0, 4) || String(new Date().getFullYear());
  const sequenciais = listarEtapasVacinacao()
    .filter((item) => item.doenca.id === doencaId && item.codigo.startsWith(`${ano}/`))
    .map((item) => Number(item.codigo.split("/")[1]))
    .filter(Number.isFinite);
  const proximo = (sequenciais.length ? Math.max(...sequenciais) : 0) + 1;
  return `${ano}/${String(proximo).padStart(2, "0")}`;
}

function situacaoInicial(dataInicio: string): SituacaoEtapaVacinacao {
  return dataInicio <= hojeIso() ? "Aberta" : "Criada";
}

function instanteHistorico() {
  const agora = new Date();
  return {
    data: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(agora),
    hora: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" }).format(agora),
  };
}

export function criarEtapaVacinacao(draft: EtapaVacinacaoDraft) {
  const registros = listarEtapasVacinacao();
  const etapa: EtapaVacinacao = {
    ...draft,
    id: proximoIdNumerico(registros),
    codigo: gerarCodigoEtapa(draft.doenca.id, draft.dataInicio),
    situacao: situacaoInicial(draft.dataInicio),
  };
  salvarColecaoMock(COLECAO, [etapa, ...registros]);
  const instante = instanteHistorico();
  salvarHistoricoCadastro(CHAVE_HISTORICO(etapa.id), [{ id: `criacao-${etapa.id}-${Date.now()}`, ...instante, alteradoPor: "Usuário atual", atual: true, dados: etapa }]);
  return etapa;
}

export function atualizarEtapaVacinacao(etapa: EtapaVacinacao) {
  const registros = listarEtapasVacinacao();
  const anterior = registros.find((item) => item.id === etapa.id);
  if (!anterior) throw new Error("Etapa de vacinação não encontrada.");
  if (anterior.situacao === "Finalizada") return anterior;
  const atualizada: EtapaVacinacao = anterior.situacao === "Aberta"
    ? { ...anterior, dataFim: etapa.dataFim }
    : {
        ...etapa,
        id: anterior.id,
        codigo: anterior.codigo,
        situacao: situacaoInicial(etapa.dataInicio),
      };
  salvarColecaoMock(COLECAO, registros.map((item) => item.id === atualizada.id ? atualizada : item));
  registrarVersaoCadastro({ chaveCadastro: CHAVE_HISTORICO(atualizada.id), alteradoPor: "Usuário atual", dadosAnteriores: anterior, dadosAtuais: atualizada });
  return atualizada;
}

export function finalizarEtapaVacinacao(id: number) {
  const registros = listarEtapasVacinacao();
  const anterior = registros.find((item) => item.id === id);
  if (!anterior) throw new Error("Etapa de vacinação não encontrada.");
  if (anterior.situacao !== "Aberta") return anterior;
  const finalizada: EtapaVacinacao = { ...anterior, situacao: "Finalizada" };
  salvarColecaoMock(COLECAO, registros.map((item) => item.id === id ? finalizada : item));
  registrarVersaoCadastro({ chaveCadastro: CHAVE_HISTORICO(id), alteradoPor: "Usuário atual", dadosAnteriores: anterior, dadosAtuais: finalizada });
  return finalizada;
}

export function copiarEtapaVacinacao(etapa: EtapaVacinacao): EtapaVacinacaoDraft {
  return {
    dataInicio: "",
    dataFim: "",
    doenca: { ...etapa.doenca, especiesIds: [...etapa.doenca.especiesIds], tiposVacina: [...etapa.doenca.tiposVacina] },
    necessitaAtestadoDeclaracao: etapa.necessitaAtestadoDeclaracao,
    permiteDeclararMaisAnimais: etapa.permiteDeclararMaisAnimais,
    especies: etapa.especies.map((item) => ({ ...item, faixasEtarias: [...item.faixasEtarias] })),
    tiposVacinacao: etapa.tiposVacinacao.map((tipo) => ({
      ...tipo,
      uid: uid("tipo"),
      faixasPorEspecie: tipo.faixasPorEspecie.map((faixa) => ({
        ...faixa,
        sexos: faixa.sexos ? [...faixa.sexos] : undefined,
        faixasEtarias: faixa.faixasEtarias ? [...faixa.faixasEtarias] : undefined,
        macho: [...faixa.macho],
        femea: [...faixa.femea],
        unico: [...faixa.unico],
      })),
      vacinasAplicaveis: [...tipo.vacinasAplicaveis],
    })),
  };
}

export function obterHistoricoEtapaVacinacao(etapa: EtapaVacinacao): HistoricoCadastroItem<EtapaVacinacao>[] {
  const instante = instanteHistorico();
  return carregarHistoricoCadastro(CHAVE_HISTORICO(etapa.id), [{ id: `inicial-${etapa.id}`, ...instante, alteradoPor: "Sistema", atual: true, dados: etapa }]);
}

export function novaFaixaEspecie(especieId: number): FaixasEspecieEtapa {
  return { especieId, sexos: [], faixasEtarias: [], macho: [], femea: [], unico: [] };
}

export function novoTipoVacinacao(): TipoVacinacaoEtapa {
  return { uid: uid("tipo"), nome: "", instrucoes: "", faixasPorEspecie: [], vacinasAplicaveis: [] };
}
