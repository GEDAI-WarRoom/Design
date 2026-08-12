import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";
import { listarEspeciesParaGta } from "../../Animal/Especie/especieData";
import { obterItemReceita } from "../../Arrecadacao/ItemReceita/itemReceitaData";
import { obterValorVigenteIndice } from "../../Arrecadacao/ValorIndice/valorIndiceData";
import { listarParametrosSistema } from "../../Controle/ParametrosSistema/parametrosSistemaData";
import { listarFinalidadesParaGta } from "../FinalidadeTransito/finalidadeTransitoData";
import {
  listarTaxasEmissaoDocumentoSanitario,
  type ItemReceitaTaxa,
} from "../TaxaEmissaoGta/taxaEmissaoGtaData";

export type TipoFormularioGta = "Manual" | "Digital";
export type TipoLocalGta =
  | "Estabelecimento Agropecuário"
  | "Frigorífico"
  | "Evento Pecuário"
  | "Revendedora de Animais Vivos"
  | "Instituição de Ensino e Pesquisa"
  | "Unidade de Vigilância Agropecuária"
  | "Local de Pesagem"
  | "Local de Realização de Exame"
  | "Estabelecimento Genérico";
export type SituacaoGta =
  | "Gravada"
  | "Aguardando Pagamento"
  | "Paga"
  | "Emitida"
  | "Transitada"
  | "Cancelada";

export interface EntidadeGta {
  id: number;
  nome: string;
  codigo?: string;
  documento?: string;
  uf?: string;
  municipio?: string;
  proprietarios?: string;
  aderidoFundo?: boolean;
}

export interface EspecieGta extends EntidadeGta {
  grupo: string;
  possuiSexoDefinido: boolean;
  possuiNucleo: boolean;
  faixasEtarias: string[];
}

export interface ExploracaoGta {
  id: number;
  codigo: string;
  nome: string;
  estabelecimentoId: number;
  responsavelId: number;
  especieId: number;
  especie: string;
  produtores: string;
}

export interface NucleoGta extends EntidadeGta {
  exploracaoId: number;
  produtores?: string;
  caracteristica: string;
  areaAtuacao: string;
  classificacao: string;
  registroMapa?: string;
  registroIma?: string;
  validadeRegistro?: string;
  arquivoRegistro?: string;
}

export interface LocalGta {
  tipo: TipoLocalGta | "";
  responsavel: EntidadeGta | null;
  estabelecimento: EntidadeGta | null;
  exploracao: ExploracaoGta | null;
  nucleo: NucleoGta | null;
  frigorifico: EntidadeGta | null;
  evento: EntidadeGta | null;
  revendedora: EntidadeGta | null;
  aeroporto: EntidadeGta | null;
  outroLocal: EntidadeGta | null;
}

export interface DestinoGta extends LocalGta {
  dentroEstado: "Sim" | "Não";
  estado: string;
  municipio: string;
  responsavelExterno: string;
  documentoResponsavelExterno: string;
  estabelecimentoExterno: string;
  codigoEstabelecimentoExterno: string;
  codigoExploracaoExterna: string;
  nucleoExterno: string;
  codigoNucleoExterno: string;
  frigorificoExterno: string;
  codigoFrigorificoExterno: string;
  eventoExterno: string;
  estabelecimentoEventoExterno: string;
  revendedoraExterna: string;
  codigoRevendedoraExterna: string;
  aeroportoExterno: string;
  abateTerceirizado: "Sim" | "Não" | "";
  empresaAbate: EntidadeGta | null;
}

export interface FaixaAnimalGta {
  id: string;
  sexo: "Animais" | "Machos" | "Fêmeas";
  faixaEtaria: string;
  existente: number;
  animaisGta: number;
}

export interface VacinaAdicionalGta {
  id: string;
  vacina: EntidadeGta | null;
  dataVacinacao: string;
  atestado: string;
}

export interface AtestadoExameGta {
  id: string;
  tipo: EntidadeGta | null;
  arquivo: string;
}

export interface GtaRastreio {
  id: string;
  uf: string;
  serieNumero: string;
}

// Adicione o tipo da estrutura do endereço
export interface EnderecoParadaDescanso {
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface EmissaoGtaFormValue {
  tipoFormulario: TipoFormularioGta | "";
  emitente: EntidadeGta | null;
  requerente: EntidadeGta | null;
  requerimento: string;
  descricaoRequerimento: string;
  especie: EspecieGta | null;
  finalidade: EntidadeGta | null;
  procedencia: LocalGta;
  destino: DestinoGta;
  meiosTransporte: string[];
  possuiParadaDescanso: "Sim" | "Não";
  enderecoParadaDescanso?: EnderecoParadaDescanso; // 👈 Adicione esta linha (com ? se opcional)
  faixasAnimais: FaixaAnimalGta[];
  possuiMotivoIsencaoTaxa: "Sim" | "Não" | "";
  motivoIsencaoTaxa: EntidadeGta | null;
  valorGta: number;
  dataRaivaPrimeiraEtapa: string;
  dataRaivaSegundaEtapa: string;
  dataBrucelose: string;
  lacreSantaCatarina: string;
  descricaoRotaSantaCatarina: string;
  autorizacaoSantaCatarina: string;
  motivoIsencaoVacinacao: EntidadeGta | null;
  outrasVacinas: VacinaAdicionalGta[];
  atestadoSanitario: string;
  atestadosExame: AtestadoExameGta[];
  gtasRastreio: GtaRastreio[];
  observacoes: string;
}

export interface EmissaoGta extends EmissaoGtaFormValue {
  id: number;
  serieNumero: string;
  dataEmissao: string;
  dataGravacao: string;
  dataGeracaoPagamento: string;
  dataPagamento: string;
  dataLimiteEmissaoEstendida: string;
  justificativaPrazoEmissao: string;
  dataTransito: string;
  situacao: SituacaoGta;
  necessitaPagamento: boolean;
  dataValidade: string;
  justificativaValidade: string;
  motivoCancelamento: EntidadeGta | null;
  observacaoCancelamento: string;
  horaEmissao?: string;
  codigoAutenticidade?: string;
  cancelamentoAutomatico?: boolean;
}

export const TIPOS_FORMULARIO_GTA = ["Digital", "Manual"].map((valor) => ({
  value: valor,
  label: valor,
}));

export const TIPOS_DESTINO_GTA: TipoLocalGta[] = [
  "Estabelecimento Agropecuário",
  "Frigorífico",
  "Evento Pecuário",
  "Revendedora de Animais Vivos",
  "Estabelecimento Genérico",
];

export const TIPOS_PROCEDENCIA_GTA: TipoLocalGta[] = [
  "Estabelecimento Agropecuário",
  "Evento Pecuário",
  "Frigorífico",
  "Revendedora de Animais Vivos",
  "Unidade de Vigilância Agropecuária",
  "Instituição de Ensino e Pesquisa",
  "Local de Pesagem",
  "Local de Realização de Exame",
  "Estabelecimento Genérico",
];

export const TIPOS_LOCAL_OPTIONS = TIPOS_DESTINO_GTA.map((valor) => ({
  value: valor,
  label: valor,
}));

export const TIPOS_PROCEDENCIA_OPTIONS = TIPOS_PROCEDENCIA_GTA.map((valor) => ({
  value: valor,
  label: valor,
}));

export const SITUACOES_GTA: SituacaoGta[] = [
  "Gravada",
  "Aguardando Pagamento",
  "Paga",
  "Emitida",
  "Transitada",
  "Cancelada",
];

export const ESPECIES_GTA: EspecieGta[] = [
  {
    id: 1,
    codigo: "ESP-001",
    nome: "Bovino",
    grupo: "Bovídeos",
    possuiSexoDefinido: true,
    possuiNucleo: false,
    faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"],
  },
  {
    id: 2,
    codigo: "ESP-002",
    nome: "Bubalino",
    grupo: "Bovídeos",
    possuiSexoDefinido: true,
    possuiNucleo: false,
    faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"],
  },
  {
    id: 3,
    codigo: "ESP-003",
    nome: "Equino",
    grupo: "Equídeos",
    possuiSexoDefinido: true,
    possuiNucleo: false,
    faixasEtarias: ["De 0 a 12 meses", "Acima de 12 meses"],
  },
  {
    id: 4,
    codigo: "ESP-004",
    nome: "Suíno",
    grupo: "Suídeos",
    possuiSexoDefinido: true,
    possuiNucleo: true,
    faixasEtarias: ["Leitões", "Recria", "Adultos"],
  },
  {
    id: 5,
    codigo: "ESP-005",
    nome: "Galinha",
    grupo: "Aves",
    possuiSexoDefinido: true,
    possuiNucleo: true,
    faixasEtarias: ["Pintos de 1 dia", "Jovens", "Adultas"],
  },
  {
    id: 6,
    codigo: "ESP-006",
    nome: "Abelha com Ferrão",
    grupo: "Abelhas",
    possuiSexoDefinido: false,
    possuiNucleo: true,
    faixasEtarias: ["Colmeias"],
  },
];

export const FINALIDADES_GTA: EntidadeGta[] = [
  { id: 1, codigo: "FIN-001", nome: "Abate" },
  { id: 2, codigo: "FIN-002", nome: "Engorda" },
  { id: 3, codigo: "FIN-003", nome: "Reprodução" },
  { id: 4, codigo: "FIN-004", nome: "Evento" },
];

export function listarEspeciesGta(): EspecieGta[] {
  return listarEspeciesParaGta();
}

export function listarFinalidadesGta(especieId?: number): EntidadeGta[] {
  return listarFinalidadesParaGta(especieId);
}

export const PESSOAS_GTA: EntidadeGta[] = [
  { id: 1, nome: "José Aarão Neto", documento: "055.145.986-99" },
  { id: 2, nome: "Maria Silva Mendes", documento: "444.111.222-33" },
  {
    id: 3,
    nome: "Agro Pecuária Vale Verde Ltda",
    documento: "12.345.678/0001-99",
  },
];

export const ESTABELECIMENTOS_GTA: EntidadeGta[] = [
  { id: 1, codigo: "31002030039", nome: "[INTERDITADO] Fazenda Recanto dos Pássaros", municipio: "Lavras - MG", proprietarios: "Carlos Henrique Souza" },
  { id: 2, codigo: "31002030040", nome: "Granja Vale Verde", municipio: "Nepomuceno - MG", proprietarios: "Marcos Silva, Ana Paula Nunes" },
  { id: 3, codigo: "31002030041", nome: "Fazenda Santa Rita", municipio: "Ijaci - MG", proprietarios: "Maria Oliveira" },
];

// Estabelecimentos com situação "Interditado" (impedidos de emitir GTA).
// Chave = nome OU código do estabelecimento.
export const ESTABELECIMENTOS_INTERDITADOS_GTA: Record<string, {
  inicio: string;
  validade: string;
  status: string[];
  observacao: string;
}> = {
  "[INTERDITADO] Fazenda Recanto dos Pássaros": {
    inicio: "20/02/2026",
    validade: "20/05/2026",
    status: [
      "Irregularidades reportadas. Suspensão temporária aplicada aguardando nova avaliação do conselho.",
      "Espólio.",
    ],
    observacao: "Cadastro com informações irregulares.",
  },
};

export function getInterdicaoGta(estab: { nome?: string; codigo?: string } | null | undefined) {
  if (!estab) return null;
  return (
    ESTABELECIMENTOS_INTERDITADOS_GTA[estab.nome ?? ""] ||
    ESTABELECIMENTOS_INTERDITADOS_GTA[estab.codigo ?? ""] ||
    null
  );
}

export const EXPLORACOES_GTA: ExploracaoGta[] = [
  {
    id: 1,
    codigo: "310020300391001",
    nome: "Exploração Bovinos - Recanto",
    estabelecimentoId: 1,
    responsavelId: 1,
    especieId: 1,
    especie: "Bovinos",
    produtores: "Carlos Henrique Souza",
  },
  {
    id: 2,
    codigo: "310020300401002",
    nome: "Exploração Aves - Vale Verde",
    estabelecimentoId: 2,
    responsavelId: 3,
    especieId: 5,
    especie: "Aves",
    produtores: "Marcos Silva, Ana Paula Nunes",
  },
  {
    id: 3,
    codigo: "310020300411003",
    nome: "Exploração Suínos - Santa Rita",
    estabelecimentoId: 3,
    responsavelId: 2,
    especieId: 4,
    especie: "Suínos",
    produtores: "Maria Oliveira",
  },
  {
    id: 4,
    codigo: "310020300411004",
    nome: "Exploração Bovinos - Santa Rita",
    estabelecimentoId: 3,
    responsavelId: 2,
    especieId: 1,
    especie: "Bovinos",
    produtores: "Maria Oliveira",
  },
  {
    id: 5,
    codigo: "310020300401005",
    nome: "Exploração Suínos - Vale Verde",
    estabelecimentoId: 2,
    responsavelId: 3,
    especieId: 4,
    especie: "Suínos",
    produtores: "Marcos Silva, Ana Paula Nunes",
  },
];

export const NUCLEOS_GTA: NucleoGta[] = [
  {
    id: 1,
    codigo: "31002030040100201",
    nome: "Núcleo A",
    exploracaoId: 2,
    produtores: "Marcos Silva, Ana Paula Nunes",
    caracteristica: "Corte",
    areaAtuacao: "Material de Multiplicação Animal",
    classificacao: "Corte",
    registroMapa: "MG-002371-4",
    registroIma: "IMA-009823",
    validadeRegistro: "2027-09-08",
    arquivoRegistro: "registro_granja.pdf",
  },
  {
    id: 2,
    codigo: "31002030041100301",
    nome: "Núcleo 09",
    exploracaoId: 3,
    produtores: "Maria Oliveira",
    caracteristica: "Tecnificada",
    areaAtuacao: "Material de Multiplicação Animal",
    classificacao: "Ciclo Completo",
  },
];

export const NUCLEOS_EXTERNOS_GTA: Record<string, string> = {
  "33009457901392301": "Núcleo 09",
};

export const FRIGORIFICOS_GTA: EntidadeGta[] = [
  { id: 1, codigo: "33013646850", nome: "Frigorífico Vale da Sapucaí Ltda", aderidoFundo: true },
  { id: 2, codigo: "33013646851", nome: "Frigorífico Santa Bárbara" },
];

/** Regra interna: boleto somente para abate em frigorífico aderido ao fundo. */
export function frigorificoAderidoAoFundo(destino: DestinoGta, finalidade: EntidadeGta | null) {
  return destino.tipo === "Frigorífico" &&
    finalidade?.nome === "Abate" &&
    destino.frigorifico?.aderidoFundo === true;
}
export const EVENTOS_GTA: EntidadeGta[] = [
  { id: 1, codigo: "EVT-0001", nome: "Rodeio ABC" },
  { id: 2, codigo: "EVT-0002", nome: "Leilão de Equinos" },
];
export const REVENDEDORAS_ANIMAIS_GTA: EntidadeGta[] = [
  { id: 1, codigo: "33013465510", nome: "Revendedora Aves Felizes" },
  { id: 2, codigo: "33013465511", nome: "Comercial de Animais Mineira" },
];
export const AEROPORTOS_GTA: EntidadeGta[] = [
  { id: 1, codigo: "AER-001", nome: "Aeroporto de Confins" },
  { id: 2, codigo: "AER-002", nome: "Aeroporto de Uberlândia" },
];
export const OUTROS_LOCAIS_GTA: Record<string, EntidadeGta[]> = {
  "Instituição de Ensino e Pesquisa": [
    { id: 701, codigo: "IEP-001", nome: "FUNDECC", municipio: "Lavras" },
  ],
  "Unidade de Vigilância Agropecuária": [
    { id: 702, codigo: "UVA-001", nome: "Vigiagro", municipio: "Confins" },
  ],
  "Local de Pesagem": [
    { id: 703, codigo: "PES-001", nome: "Agropec Balanças", municipio: "Uberaba" },
  ],
  "Local de Realização de Exame": [
    { id: 704, codigo: "EXA-001", nome: "Clínica Vet+", municipio: "Belo Horizonte" },
  ],
};
export const ACOUGUES_GTA: EntidadeGta[] = [
  { id: 1, codigo: "ACO-001", nome: "Açougue Santa Mara" },
  { id: 2, codigo: "ACO-002", nome: "Casa de Carnes Mineira" },
];

export const DOENCAS_VACINA_GTA: EntidadeGta[] = [
  { id: 1, nome: "Newcastle" },
  { id: 2, nome: "Febre Aftosa" },
  { id: 3, nome: "Clostridiose" },
];
export const TIPOS_ATESTADO_EXAME_GTA: EntidadeGta[] = [
  { id: 1, nome: "Atestado de Exame para Brucelose" },
  { id: 2, nome: "Atestado de Exame para Tuberculose" },
  { id: 3, nome: "Atestado de Exame para Mormo" },
];
export const ISENCOES_TAXA_GTA: EntidadeGta[] = [
  { id: 1, nome: "Doação de animais para fins de pesquisa" },
  { id: 2, nome: "Trânsito promovido pelo serviço oficial" },
];
export const ISENCOES_VACINACAO_GTA: EntidadeGta[] = [
  { id: 1, nome: "Não possui fêmeas em idade de vacinação" },
  { id: 2, nome: "Impossibilidade sanitária comprovada" },
];
export const MOTIVOS_CANCELAMENTO_GTA: EntidadeGta[] = [
  { id: 1, nome: "Erro no preenchimento da GTA" },
  { id: 2, nome: "Desistência do trânsito" },
  { id: 3, nome: "Alteração do destino" },
];

export const ESTADOS_BRASIL = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  Acre: ["Cruzeiro do Sul", "Rio Branco"],
  Alagoas: ["Arapiraca", "Maceió"],
  Amapá: ["Macapá", "Santana"],
  Amazonas: ["Manaus", "Parintins"],
  Bahia: ["Feira de Santana", "Salvador", "Vitória da Conquista"],
  Ceará: ["Fortaleza", "Juazeiro do Norte"],
  "Distrito Federal": ["Brasília", "Taguatinga"],
  "Espírito Santo": ["Vila Velha", "Vitória"],
  Goiás: ["Anápolis", "Goiânia", "Rio Verde"],
  Maranhão: ["Imperatriz", "São Luís"],
  "Mato Grosso": ["Cuiabá", "Rondonópolis"],
  "Mato Grosso do Sul": ["Campo Grande", "Dourados"],
  Pará: ["Belém", "Santarém"],
  Paraíba: ["Campina Grande", "João Pessoa"],
  Paraná: ["Curitiba", "Londrina"],
  Pernambuco: ["Caruaru", "Recife"],
  Piauí: ["Parnaíba", "Teresina"],
  "Rio de Janeiro": ["Campos dos Goytacazes", "Rio de Janeiro", "Volta Redonda"],
  "Rio Grande do Norte": ["Mossoró", "Natal"],
  "Rio Grande do Sul": ["Caxias do Sul", "Porto Alegre"],
  Rondônia: ["Ji-Paraná", "Porto Velho"],
  Roraima: ["Boa Vista", "Rorainópolis"],
  "Santa Catarina": ["Florianópolis", "Joinville"],
  "São Paulo": ["Campinas", "Sorocaba", "Valinhos"],
  Sergipe: ["Aracaju", "Itabaiana"],
  Tocantins: ["Araguaína", "Palmas"],
};

export const MEIOS_TRANSPORTE = [
  "Aéreo",
  "A pé",
  "Ferroviário",
  "Marítimo/Fluvial",
  "Rodoviário",
];

export const criarLocalVazio = (): LocalGta => ({
  tipo: "",
  responsavel: null,
  estabelecimento: null,
  exploracao: null,
  nucleo: null,
  frigorifico: null,
  evento: null,
  revendedora: null,
  aeroporto: null,
  outroLocal: null,
});

export const criarDestinoVazio = (): DestinoGta => ({
  ...criarLocalVazio(),
  dentroEstado: "Sim",
  estado: "",
  municipio: "",
  responsavelExterno: "",
  documentoResponsavelExterno: "",
  estabelecimentoExterno: "",
  codigoEstabelecimentoExterno: "",
  codigoExploracaoExterna: "",
  nucleoExterno: "",
  codigoNucleoExterno: "",
  frigorificoExterno: "",
  codigoFrigorificoExterno: "",
  eventoExterno: "",
  estabelecimentoEventoExterno: "",
  revendedoraExterna: "",
  codigoRevendedoraExterna: "",
  aeroportoExterno: "",
  abateTerceirizado: "",
  empresaAbate: null,
});

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function criarFaixasAnimais(especie: EspecieGta | null): FaixaAnimalGta[] {
  if (!especie) return [];
  const sexos: FaixaAnimalGta["sexo"][] = especie.possuiSexoDefinido
    ? ["Machos", "Fêmeas"]
    : ["Animais"];
  return sexos.flatMap((sexo, sexoIndex) =>
    especie.faixasEtarias.map((faixaEtaria, faixaIndex) => ({
      id: `${sexo}-${faixaIndex}-${uid()}`,
      sexo,
      faixaEtaria,
      existente: Math.max(4, 18 - sexoIndex * 3 - faixaIndex * 4),
      animaisGta: 0,
    })),
  );
}

export function criarEmissaoGtaVazia(): EmissaoGtaFormValue {
  return {
    tipoFormulario: "",
    emitente: PESSOAS_GTA[1] ?? PESSOAS_GTA[0] ?? null,
    requerente: null,
    requerimento: "",
    descricaoRequerimento: "",
    especie: null,
    finalidade: null,
    procedencia: criarLocalVazio(),
    destino: criarDestinoVazio(),
    meiosTransporte: [],
    possuiParadaDescanso: "Não",
    faixasAnimais: [],
    possuiMotivoIsencaoTaxa: "",
    motivoIsencaoTaxa: null,
    valorGta: 0,
    dataRaivaPrimeiraEtapa: "2025-03-25",
    dataRaivaSegundaEtapa: "2025-09-25",
    dataBrucelose: "2025-06-18",
    lacreSantaCatarina: "",
    descricaoRotaSantaCatarina: "",
    autorizacaoSantaCatarina: "",
    motivoIsencaoVacinacao: null,
    outrasVacinas: [],
    atestadoSanitario: "",
    atestadosExame: [],
    gtasRastreio: [],
    observacoes: "",
  };
}

function criarRegistroInicial(
  id: number,
  serieNumero: string,
  especie: EspecieGta,
  finalidade: EntidadeGta,
  situacao: SituacaoGta,
  tipoDestino: TipoLocalGta = "Frigorífico",
  frigorifico = FRIGORIFICOS_GTA[0],
): EmissaoGta {
  const form = criarEmissaoGtaVazia();
  const hoje = new Date().toISOString().slice(0, 10);
  const procedencia: LocalGta = {
    ...criarLocalVazio(),
    tipo: "Estabelecimento Agropecuário",
    responsavel: PESSOAS_GTA[0],
    estabelecimento: ESTABELECIMENTOS_GTA[1],
    exploracao: EXPLORACOES_GTA[1],
  };
  const destino: DestinoGta = {
    ...criarDestinoVazio(),
    tipo: tipoDestino,
    responsavel: PESSOAS_GTA[2],
    frigorifico: tipoDestino === "Frigorífico" ? frigorifico : null,
    estabelecimento: tipoDestino === "Estabelecimento Agropecuário" ? ESTABELECIMENTOS_GTA[2] : null,
    exploracao: tipoDestino === "Estabelecimento Agropecuário" ? EXPLORACOES_GTA[0] : null,
    evento: tipoDestino === "Evento Pecuário" ? EVENTOS_GTA[0] : null,
    revendedora: tipoDestino === "Revendedora de Animais Vivos" ? REVENDEDORAS_ANIMAIS_GTA[0] : null,
    aeroporto: tipoDestino === "Estabelecimento Genérico" ? AEROPORTOS_GTA[0] : null,
    abateTerceirizado: tipoDestino === "Frigorífico" && finalidade.nome === "Abate" ? "Não" : "",
  };
  const pagamentoGerado = !["Gravada", "Cancelada"].includes(situacao);
  const pagamentoConfirmado = ["Paga", "Emitida", "Transitada"].includes(situacao);
  const emitida = ["Emitida", "Transitada"].includes(situacao);
  return {
    ...form,
    possuiMotivoIsencaoTaxa: "Não",
    id,
    serieNumero,
    tipoFormulario: id === 1 ? "Digital" : "Manual",
    especie,
    finalidade,
    emitente: PESSOAS_GTA[(id - 1) % PESSOAS_GTA.length],
    requerente: PESSOAS_GTA[(id + 1) % PESSOAS_GTA.length],
    requerimento: "requerimento.pdf",
    descricaoRequerimento: "Requerimento apresentado para emissão da GTA.",
    procedencia,
    destino,
    meiosTransporte: ["Rodoviário"],
    faixasAnimais: criarFaixasAnimais(especie).map((item, index) => ({
      ...item,
      animaisGta: index < 2 ? 5 : 0,
    })),
    valorGta: 8.56,
    atestadoSanitario: "atestado_sanitario.pdf",
    observacoes: "Trânsito animal conferido conforme documentação apresentada.",
    dataGravacao: hoje,
    dataGeracaoPagamento: pagamentoGerado ? hoje : "",
    dataPagamento: pagamentoConfirmado ? hoje : "",
    dataLimiteEmissaoEstendida: "",
    justificativaPrazoEmissao: "",
    dataEmissao: emitida ? hoje : "",
    dataTransito: situacao === "Transitada" ? hoje : "",
    situacao,
    necessitaPagamento: ["Gravada", "Aguardando Pagamento"].includes(situacao),
    dataValidade: emitida ? dataPadraoValidade(hoje) : "",
    justificativaValidade: "",
    motivoCancelamento: null,
    observacaoCancelamento: "",
    horaEmissao: emitida ? "14:30" : "",
    codigoAutenticidade: `31${String(184526 + id - 1).padStart(18, "0")}`,
  };
}

export const EMISSOES_GTA_MOCK: EmissaoGta[] = [
  criarRegistroInicial(1, "MG - 184526", ESPECIES_GTA[0], FINALIDADES_GTA[0], "Gravada", "Frigorífico"),
  criarRegistroInicial(2, "MG - 184527", ESPECIES_GTA[0], FINALIDADES_GTA[1], "Gravada", "Estabelecimento Agropecuário"),
  criarRegistroInicial(3, "MG - 184528", ESPECIES_GTA[0], FINALIDADES_GTA[3], "Gravada", "Evento Pecuário"),
  criarRegistroInicial(4, "MG - 184529", ESPECIES_GTA[0], FINALIDADES_GTA[2], "Aguardando Pagamento", "Revendedora de Animais Vivos"),
  criarRegistroInicial(5, "MG - 184530", ESPECIES_GTA[0], FINALIDADES_GTA[0], "Paga", "Frigorífico", FRIGORIFICOS_GTA[1]),
  criarRegistroInicial(6, "MG - 184531", ESPECIES_GTA[0], FINALIDADES_GTA[1], "Emitida", "Estabelecimento Agropecuário"),
  criarRegistroInicial(7, "MG - 184532", ESPECIES_GTA[0], FINALIDADES_GTA[3], "Transitada", "Evento Pecuário"),
  criarRegistroInicial(8, "MG - 184533", ESPECIES_GTA[0], FINALIDADES_GTA[2], "Cancelada", "Estabelecimento Genérico"),
];

// Massa de demonstração do ciclo completo, com bovinos e destinos variados.
const COLECAO = "emissoes-gta-v3";

export function listarEmissoesGta() {
  const emissoes = listarColecaoMock(COLECAO, EMISSOES_GTA_MOCK);
  const atualizadas = emissoes.map(aplicarCancelamentoAutomaticoGta);
  if (atualizadas.some((item, index) => item !== emissoes[index])) {
    salvarColecaoMock(COLECAO, atualizadas);
  }
  return atualizadas;
}

function salvarEmissaoGta(registro: EmissaoGta) {
  const emissoes = listarEmissoesGta();
  salvarColecaoMock(
    COLECAO,
    emissoes.some((item) => item.id === registro.id)
      ? emissoes.map((item) => (item.id === registro.id ? registro : item))
      : [registro, ...emissoes],
  );
  return registro;
}

function valorUnitarioItemTaxa(itemTaxa: ItemReceitaTaxa | null) {
  if (!itemTaxa) return 0;
  const item = obterItemReceita(Number(itemTaxa.id));
  if (!item) return 0;
  const vigente = obterValorVigenteIndice(item.indiceId, new Date().toISOString().slice(0, 10));
  return item.quantidadeIndice * (vigente?.valor ?? 0);
}

export function calcularValorGta(form: EmissaoGtaFormValue) {
  if (form.motivoIsencaoTaxa || !form.especie) return 0;
  const especieId = form.especie.id;
  const animais = totalAnimaisGta(form);
  const hoje = new Date().toISOString().slice(0, 10);
  const taxa = listarTaxasEmissaoDocumentoSanitario()
    .filter(
      (item) =>
        item.situacao === "Ativo" &&
        item.tipoDocumentoSanitario === "GTA" &&
        item.especies.some((especie) => especie.id === especieId) &&
        item.dataInicioVigencia <= hoje,
    )
    .sort((a, b) => b.dataInicioVigencia.localeCompare(a.dataInicioVigencia))[0];
  if (!taxa) return 0;

  if (taxa.tipoCobranca === "Por Cabeça") return animais * valorUnitarioItemTaxa(taxa.itemReceita);
  if (taxa.tipoCobranca === "Por Documento") return valorUnitarioItemTaxa(taxa.itemReceita);
  if (taxa.tipoCobranca === "Por Lotes") {
    const tamanho = Math.max(1, Number(taxa.tamanhoLote));
    return Math.ceil(animais / tamanho) * valorUnitarioItemTaxa(taxa.itemReceitaLote);
  }

  const limite = Math.max(0, Number(taxa.limiteFaixa));
  const ate = Math.min(animais, limite);
  const acima = Math.max(0, animais - limite);
  const multiplicador = (quantidade: number, modalidade: string) =>
    modalidade === "Cobrar por Documento" ? (quantidade > 0 ? 1 : 0) : quantidade;
  return (
    multiplicador(ate, taxa.cobrancaAteLimite) * valorUnitarioItemTaxa(taxa.itemReceitaAteLimite) +
    multiplicador(acima, taxa.cobrancaAcimaLimite) * valorUnitarioItemTaxa(taxa.itemReceitaAcimaLimite)
  );
}

export function adicionarEmissaoGta(form: EmissaoGtaFormValue): EmissaoGta {
  const emissoes = listarEmissoesGta();
  const proximoNumero = Math.max(
    184530,
    ...emissoes.map((item) => Number(item.serieNumero.match(/\d+/g)?.at(-1) ?? 0)),
  ) + 1;
  const valorCalculado = calcularValorGta(form);
  const hoje = new Date().toISOString().slice(0, 10);
  const nova: EmissaoGta = {
    ...form,
    id: proximoIdNumerico(emissoes),
    serieNumero: `MG - ${String(proximoNumero).padStart(6, "0")}`,
    dataGravacao: hoje,
    dataGeracaoPagamento: "",
    dataPagamento: "",
    dataLimiteEmissaoEstendida: "",
    justificativaPrazoEmissao: "",
    dataEmissao: "",
    dataTransito: "",
    situacao: "Gravada",
    necessitaPagamento: !form.motivoIsencaoTaxa && valorCalculado > 0,
    valorGta: valorCalculado,
    dataValidade: "",
    justificativaValidade: "",
    motivoCancelamento: null,
    observacaoCancelamento: "",
    horaEmissao: "",
    codigoAutenticidade: "",
    cancelamentoAutomatico: false,
  };
  return salvarEmissaoGta(nova);
}

export function atualizarEmissaoGta(id: number, form: EmissaoGtaFormValue) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Gravada") return null;
  const valorGta = calcularValorGta(form);
  return salvarEmissaoGta({
    ...registro,
    ...form,
    valorGta,
    necessitaPagamento: !form.motivoIsencaoTaxa && valorGta > 0,
  });
}

export function obterEmissaoGta(id?: number | null) {
  const emissoes = listarEmissoesGta();
  if (id == null) return emissoes[0] ?? null;
  return emissoes.find((item) => item.id === id) ?? null;
}

export function copiarEmissaoGta(registro: EmissaoGta): EmissaoGtaFormValue {
  const {
    id: _id,
    serieNumero: _serieNumero,
    dataEmissao: _dataEmissao,
    dataGravacao: _dataGravacao,
    dataGeracaoPagamento: _dataGeracaoPagamento,
    dataPagamento: _dataPagamento,
    dataLimiteEmissaoEstendida: _dataLimiteEmissaoEstendida,
    justificativaPrazoEmissao: _justificativaPrazoEmissao,
    dataTransito: _dataTransito,
    situacao: _situacao,
    necessitaPagamento: _necessitaPagamento,
    dataValidade: _dataValidade,
    justificativaValidade: _justificativaValidade,
    motivoCancelamento: _motivoCancelamento,
    observacaoCancelamento: _observacaoCancelamento,
    horaEmissao: _horaEmissao,
    codigoAutenticidade: _codigoAutenticidade,
    cancelamentoAutomatico: _cancelamentoAutomatico,
    ...form
  } = registro;
  return {
    ...form,
    faixasAnimais: form.faixasAnimais.map((item) => ({ ...item, id: uid() })),
    outrasVacinas: form.outrasVacinas.map((item) => ({ ...item, id: uid() })),
    atestadosExame: form.atestadosExame.map((item) => ({ ...item, id: uid() })),
    gtasRastreio: form.gtasRastreio.map((item) => ({ ...item, id: uid() })),
  };
}

export function gerarDadosPagamentoGta(id: number) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Gravada") return null;
  const hoje = new Date().toISOString().slice(0, 10);
  return salvarEmissaoGta({
    ...registro,
    situacao: "Aguardando Pagamento",
    dataGeracaoPagamento: hoje,
  });
}

export function pagarEmissaoGta(id: number) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Aguardando Pagamento")
    return registro;
  return salvarEmissaoGta({
    ...registro,
    situacao: "Paga",
    dataPagamento: new Date().toISOString().slice(0, 10),
    necessitaPagamento: false,
  });
}

export function estenderPrazoEmissaoGta(id: number, novaData: string, justificativa: string) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Paga" || !justificativa.trim()) return null;
  const prazoAtual = obterPrazoAtualGta(registro);
  const ano = Number((registro.dataPagamento || novaData).slice(0, 4));
  if (!novaData || novaData <= prazoAtual || novaData > ultimoDiaUtilDoAno(ano)) return null;
  return salvarEmissaoGta({
    ...registro,
    dataLimiteEmissaoEstendida: novaData,
    justificativaPrazoEmissao: justificativa.trim(),
  });
}

export function emitirEmissaoGta(
  id: number,
  dataValidade: string,
  justificativaValidade: string,
) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Paga") return null;
  const agora = new Date();
  const horaEmissao = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(agora);
  const codigoAutenticidade = [
    "31",
    String(registro.id).padStart(8, "0"),
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
    String(agora.getHours()).padStart(2, "0"),
    String(agora.getMinutes()).padStart(2, "0"),
  ].join("");
  return salvarEmissaoGta({
    ...registro,
    situacao: "Emitida",
    dataEmissao: agora.toISOString().slice(0, 10),
    dataValidade: limitarAoUltimoDiaUtilDoAno(dataValidade, agora.getFullYear()),
    justificativaValidade,
    necessitaPagamento: false,
    horaEmissao,
    codigoAutenticidade,
  });
}

export function estenderValidadeEmissaoGta(id: number, novaData: string, justificativa: string) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Emitida" || !justificativa.trim()) return null;

  const hoje = new Date().toISOString().slice(0, 10);
  const limiteAno = ultimoDiaUtilDoAno(Number(registro.dataEmissao.slice(0, 4)));
  if (
    hoje > registro.dataValidade ||
    !novaData ||
    novaData <= registro.dataValidade ||
    novaData > limiteAno
  ) return null;

  return salvarEmissaoGta({
    ...registro,
    dataValidade: novaData,
    justificativaValidade: justificativa.trim(),
  });
}

export function confirmarTransitoGta(id: number) {
  const registro = obterEmissaoGta(id);
  if (!registro || registro.situacao !== "Emitida") return null;
  return salvarEmissaoGta({
    ...registro,
    situacao: "Transitada",
    dataTransito: new Date().toISOString().slice(0, 10),
  });
}

export function cancelarEmissaoGta(
  id: number,
  motivo: EntidadeGta,
  observacao: string,
) {
  const registro = obterEmissaoGta(id);
  if (!registro || ["Cancelada", "Transitada"].includes(registro.situacao)) return null;
  return salvarEmissaoGta({ ...registro, situacao: "Cancelada", motivoCancelamento: motivo, observacaoCancelamento: observacao, necessitaPagamento: false });
}

export function formatarDataGta(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoedaGta(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function totalAnimaisGta(form: EmissaoGtaFormValue) {
  return form.faixasAnimais.reduce((total, item) => total + item.animaisGta, 0);
}

export interface PrazosCicloGta {
  gravada: number;
  aguardandoPagamento: number;
  paga: number;
  validade: number;
}

export function obterPrazosCicloGta(): PrazosCicloGta {
  const parametros = new Map(
    listarParametrosSistema()
      .filter((item) => item.situacao === "Ativo")
      .map((item) => [item.nome, Number(item.valor)]),
  );
  const valor = (nome: string, padrao: number) => {
    const encontrado = parametros.get(nome);
    return Number.isFinite(encontrado) && Number(encontrado) > 0 ? Number(encontrado) : padrao;
  };
  return {
    gravada: valor("prazoMaximoGtaGravada", 3),
    aguardandoPagamento: valor("prazoMaximoPagamentoGta", 2),
    paga: valor("prazoMaximoEmissaoGtaPaga", 3),
    validade: valor("nrDiasValidadeGta", 3),
  };
}

function adicionarDias(dataIso: string, quantidade: number) {
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia + quantidade));
  return data.toISOString().slice(0, 10);
}

export function ultimoDiaUtilDoAno(ano: number) {
  const data = new Date(Date.UTC(ano, 11, 31));
  while ([0, 6].includes(data.getUTCDay())) data.setUTCDate(data.getUTCDate() - 1);
  return data.toISOString().slice(0, 10);
}

export function limitarAoUltimoDiaUtilDoAno(dataIso: string, ano: number) {
  const limite = ultimoDiaUtilDoAno(ano);
  return dataIso > limite ? limite : dataIso;
}

export function obterPrazoAtualGta(registro: EmissaoGta) {
  const prazos = obterPrazosCicloGta();
  if (registro.situacao === "Gravada" && registro.dataGravacao)
    return adicionarDias(registro.dataGravacao, prazos.gravada);
  if (registro.situacao === "Aguardando Pagamento" && registro.dataGeracaoPagamento)
    return adicionarDias(registro.dataGeracaoPagamento, prazos.aguardandoPagamento);
  if (registro.situacao === "Paga" && registro.dataPagamento)
    return registro.dataLimiteEmissaoEstendida || adicionarDias(registro.dataPagamento, prazos.paga);
  if (registro.situacao === "Emitida") return registro.dataValidade;
  return "";
}

function aplicarCancelamentoAutomaticoGta(registro: EmissaoGta): EmissaoGta {
  if (["Cancelada", "Transitada"].includes(registro.situacao)) return registro;
  const prazo = obterPrazoAtualGta(registro);
  const hoje = new Date().toISOString().slice(0, 10);
  if (!prazo || hoje <= prazo) return registro;
  return {
    ...registro,
    situacao: "Cancelada",
    necessitaPagamento: false,
    motivoCancelamento: { id: 0, nome: "Prazo do ciclo de vida expirado" },
    observacaoCancelamento: `Cancelamento automático após o término do prazo em ${formatarDataGta(prazo)}.`,
    cancelamentoAutomatico: true,
  };
}

export function dataPadraoValidade(dataEmissao = new Date().toISOString().slice(0, 10)) {
  const ano = Number(dataEmissao.slice(0, 4));
  return limitarAoUltimoDiaUtilDoAno(
    adicionarDias(dataEmissao, obterPrazosCicloGta().validade),
    ano,
  );
}
