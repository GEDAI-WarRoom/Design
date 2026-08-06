export type SituacaoAtestadoExame = "Ativo" | "Expirado";

export interface EntidadeExame {
  id: number;
  nome: string;
}

export interface DoencaExame extends EntidadeExame {
  codigo: string;
}

export interface VeterinarioExame extends EntidadeExame {
  cpf: string;
  habilitado: boolean;
}

export interface ProdutorExame extends EntidadeExame {
  documento: string;
  tipo: "PF" | "PJ";
}

export interface EstabelecimentoExame extends EntidadeExame {
  codigo: string;
  produtorId: number;
  municipio: string;
  proprietario: string;
}

export interface ExploracaoExame extends EntidadeExame {
  codigo: string;
  produtorId: number;
  estabelecimentoId: number;
  especie: string;
  possuiNucleo: boolean;
  faixasEtarias: string[];
  racas: string[];
}

export interface NucleoExame extends EntidadeExame {
  codigo: string;
  exploracaoId: number;
}

export interface TipoAtestadoExame extends EntidadeExame {
  doencas: DoencaExame[];
  diasValidade: number;
  tiposInsumo: string[];
}

export interface LoteInsumoExame extends EntidadeExame {
  codigo: string;
  veterinarioId: number;
  tipoInsumo: string;
  disponiveis: number;
  vendidos: number;
  vencidos: number;
  descartados: number;
  validade: string;
  dosesPorFrasco: number;
  quantidadeAdquirida?: number;
}

export interface AnimalExaminado {
  id: string;
  identificacao: string;
  sexo: "" | "Fêmea" | "Macho";
  faixaEtaria: string;
  raca: string;
  resultados: Record<string, string>;
  destinoReagentes: string;
}

export interface AtestadoExameCadastro {
  id: string | number;
  numero: string;
  dataEmissao: string;
  veterinario: VeterinarioExame | null;
  tipoAtestado: TipoAtestadoExame | null;
  produtor: ProdutorExame | null;
  estabelecimento: EstabelecimentoExame | null;
  exploracao: ExploracaoExame | null;
  nucleo: NucleoExame | null;
  certificadoPropriedadeLivre: string;
  motivoExame: string;
  outroMotivo: string;
  numeroTestesBrucelose: string;
  dataColheita: string;
  dataTeste: string;
  numeroTestesTuberculose: string;
  dataInoculacao: string;
  dataLeitura: string;
  lotes: LoteInsumoExame[];
  animais: AnimalExaminado[];
  situacao: SituacaoAtestadoExame;
}

export const DOENCAS_EXAME: DoencaExame[] = [
  { id: 1, codigo: "D02", nome: "Brucelose" },
  { id: 2, codigo: "D03", nome: "Tuberculose Bovina" },
  { id: 3, codigo: "D05", nome: "Anemia Infecciosa Equina (AIE)" },
  { id: 4, codigo: "D06", nome: "Mormo" },
];

export const VETERINARIOS_EXAME: VeterinarioExame[] = [
  { id: 1, cpf: "444.009.956-40", nome: "Divino de Souza Sobrinho", habilitado: true },
  { id: 2, cpf: "555.009.956-40", nome: "José Aarão Neto", habilitado: true },
  { id: 3, cpf: "333.888.777-11", nome: "Carlos Henrique Souza", habilitado: false },
];

export const PRODUTORES_EXAME: ProdutorExame[] = [
  { id: 1, documento: "555.009.956-40", nome: "José Aarão Neto", tipo: "PF" },
  { id: 2, documento: "56.338.814/0001-95", nome: "Agropecuária Vale Verde Ltda.", tipo: "PJ" },
];

export const ESTABELECIMENTOS_EXAME: EstabelecimentoExame[] = [
  {
    id: 1,
    codigo: "310010400050003",
    nome: "Fazenda Santa Helena",
    produtorId: 1,
    municipio: "Lavras - MG",
    proprietario: "555.009.956-40\n- José Aarão Neto",
  },
  {
    id: 2,
    codigo: "310010400060012",
    nome: "Granja Vale Verde",
    produtorId: 2,
    municipio: "Uberlândia - MG",
    proprietario: "56.338.814/0001-95\n- Agropecuária Vale Verde Ltda.",
  },
];

export const EXPLORACOES_EXAME: ExploracaoExame[] = [
  {
    id: 1,
    codigo: "EXP-0001",
    nome: "Exploração de Bovinos",
    produtorId: 1,
    estabelecimentoId: 1,
    especie: "Bovino",
    possuiNucleo: false,
    faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"],
    racas: ["Nelore", "Girolando", "Holandesa"],
  },
  {
    id: 2,
    codigo: "EXP-0002",
    nome: "Exploração de Suínos",
    produtorId: 2,
    estabelecimentoId: 2,
    especie: "Suíno",
    possuiNucleo: true,
    faixasEtarias: ["Leitões", "Recria", "Adultos"],
    racas: ["Landrace", "Large White", "Duroc"],
  },
];

export const NUCLEOS_EXAME: NucleoExame[] = [
  { id: 1, codigo: "NUC-001", nome: "Núcleo 01 - Matrizes", exploracaoId: 2 },
  { id: 2, codigo: "NUC-002", nome: "Núcleo 02 - Recria", exploracaoId: 2 },
];

export const TIPOS_ATESTADO_DOCUMENTO: TipoAtestadoExame[] = [
  {
    id: 1,
    nome: "Atestado para Brucelose",
    doencas: [DOENCAS_EXAME[0]],
    diasValidade: 60,
    tiposInsumo: ["Antígeno Acidificado Tamponado"],
  },
  {
    id: 2,
    nome: "Atestado para Tuberculose",
    doencas: [DOENCAS_EXAME[1]],
    diasValidade: 90,
    tiposInsumo: ["Tuberculina PPD Bovina", "Tuberculina PPD Aviária"],
  },
  {
    id: 3,
    nome: "Atestado para Brucelose e Tuberculose",
    doencas: [DOENCAS_EXAME[0], DOENCAS_EXAME[1]],
    diasValidade: 60,
    tiposInsumo: [
      "Antígeno Acidificado Tamponado",
      "Tuberculina PPD Bovina",
      "Tuberculina PPD Aviária",
    ],
  },
];

export const LOTES_INSUMO_EXAME: LoteInsumoExame[] = [
  {
    id: 1,
    codigo: "AAT-260801",
    nome: "Lote AAT-260801",
    veterinarioId: 1,
    tipoInsumo: "Antígeno Acidificado Tamponado",
    disponiveis: 48,
    vendidos: 12,
    vencidos: 0,
    descartados: 2,
    validade: "2027-03-31",
    dosesPorFrasco: 10,
  },
  {
    id: 2,
    codigo: "PPDB-260720",
    nome: "Lote PPDB-260720",
    veterinarioId: 1,
    tipoInsumo: "Tuberculina PPD Bovina",
    disponiveis: 30,
    vendidos: 8,
    vencidos: 1,
    descartados: 0,
    validade: "2027-01-15",
    dosesPorFrasco: 10,
  },
  {
    id: 3,
    codigo: "AAT-260715",
    nome: "Lote AAT-260715",
    veterinarioId: 2,
    tipoInsumo: "Antígeno Acidificado Tamponado",
    disponiveis: 22,
    vendidos: 5,
    vencidos: 0,
    descartados: 1,
    validade: "2026-12-20",
    dosesPorFrasco: 10,
  },
];

export const MOTIVOS_EXAME = [
  "Trânsito",
  "Aglomeração",
  "Certificação de propriedade livre",
  "Teste confirmatório (para tuberculose)",
  "Outro",
].map((value) => ({ value, label: value }));

export const SITUACOES_ATESTADO_CADASTRO = [
  { value: "Ativo", label: "Ativo" },
  { value: "Expirado", label: "Expirado" },
];

export const SEXOS_ANIMAL = [
  { value: "Fêmea", label: "Fêmea" },
  { value: "Macho", label: "Macho" },
];

const CHAVE_LISTA = "sidagro:atestados-exame-documento";
const hojeIso = () => new Date().toISOString().slice(0, 10);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function criarAnimalVazio(): AnimalExaminado {
  return {
    id: uid(),
    identificacao: "",
    sexo: "",
    faixaEtaria: "",
    raca: "",
    resultados: {},
    destinoReagentes: "",
  };
}

export function criarAtestadoExameVazio(): AtestadoExameCadastro {
  return {
    id: "",
    numero: "",
    dataEmissao: "",
    veterinario: null,
    tipoAtestado: null,
    produtor: null,
    estabelecimento: null,
    exploracao: null,
    nucleo: null,
    certificadoPropriedadeLivre: "",
    motivoExame: "",
    outroMotivo: "",
    numeroTestesBrucelose: "",
    dataColheita: "",
    dataTeste: "",
    numeroTestesTuberculose: "",
    dataInoculacao: "",
    dataLeitura: "",
    lotes: [],
    animais: [criarAnimalVazio()],
    situacao: "Ativo",
  };
}

function adicionarDias(data: string, dias: number) {
  const valor = new Date(`${data}T12:00:00`);
  valor.setDate(valor.getDate() + dias);
  return valor.toISOString().slice(0, 10);
}

export function calcularSituacaoAtestado(
  dataEmissao: string,
  tipoAtestado: TipoAtestadoExame | null,
): SituacaoAtestadoExame {
  if (!dataEmissao || !tipoAtestado) return "Ativo";
  return adicionarDias(dataEmissao, tipoAtestado.diasValidade) < hojeIso()
    ? "Expirado"
    : "Ativo";
}

export function tipoContemDoenca(
  tipo: TipoAtestadoExame | null,
  nome: string,
) {
  return Boolean(tipo?.doencas.some((doenca) => doenca.nome.includes(nome)));
}

function normalizarAtestado(registro: any): AtestadoExameCadastro {
  const base = { ...criarAtestadoExameVazio(), ...registro };
  return {
    ...base,
    lotes: Array.isArray(registro?.lotes)
      ? registro.lotes
      : registro?.lote
        ? [registro.lote]
        : [],
    animais:
      Array.isArray(base.animais) && base.animais.length
        ? base.animais
        : [criarAnimalVazio()],
    situacao: calcularSituacaoAtestado(base.dataEmissao, base.tipoAtestado),
  };
}

const REGISTROS_INICIAIS: AtestadoExameCadastro[] = [
  normalizarAtestado({
    ...criarAtestadoExameVazio(),
    id: 1,
    numero: "0000123/2026",
    dataEmissao: "2026-08-01",
    veterinario: VETERINARIOS_EXAME[0],
    tipoAtestado: TIPOS_ATESTADO_DOCUMENTO[0],
    produtor: PRODUTORES_EXAME[0],
    estabelecimento: ESTABELECIMENTOS_EXAME[0],
    exploracao: EXPLORACOES_EXAME[0],
    certificadoPropriedadeLivre: "CPL-2026-001",
    motivoExame: "Trânsito",
    numeroTestesBrucelose: "1",
    dataColheita: "2026-07-30",
    dataTeste: "2026-08-01",
    lotes: [{ ...LOTES_INSUMO_EXAME[0], quantidadeAdquirida: 1 }],
    animais: [
      {
        ...criarAnimalVazio(),
        identificacao: "BR-001234",
        sexo: "Fêmea",
        faixaEtaria: "De 13 a 24 meses",
        raca: "Nelore",
        resultados: { "Antígeno Acidificado Tamponado": "Negativo" },
        destinoReagentes: "Descarte em recipiente para resíduos biológicos",
      },
    ],
  }),
  normalizarAtestado({
    ...criarAtestadoExameVazio(),
    id: 2,
    numero: "0000098/2025",
    dataEmissao: "2025-03-10",
    veterinario: VETERINARIOS_EXAME[1],
    tipoAtestado: TIPOS_ATESTADO_DOCUMENTO[1],
    produtor: PRODUTORES_EXAME[1],
    estabelecimento: ESTABELECIMENTOS_EXAME[1],
    exploracao: EXPLORACOES_EXAME[1],
    nucleo: NUCLEOS_EXAME[0],
    certificadoPropriedadeLivre: "CPL-2025-018",
    motivoExame: "Teste confirmatório (para tuberculose)",
    numeroTestesTuberculose: "1",
    dataInoculacao: "2025-03-07",
    dataLeitura: "2025-03-10",
    lotes: [{ ...LOTES_INSUMO_EXAME[1], quantidadeAdquirida: 1 }],
    animais: [
      {
        ...criarAnimalVazio(),
        identificacao: "SV-00987",
        sexo: "Macho",
        faixaEtaria: "Adultos",
        raca: "Duroc",
        resultados: {
          "Tuberculina PPD Bovina": "Reagente",
          "Tuberculina PPD Aviária": "Não reagente",
        },
        destinoReagentes: "Devolução ao responsável pelo lote",
      },
    ],
  }),
];

export function listarAtestadosCadastro(): AtestadoExameCadastro[] {
  if (typeof window === "undefined") return REGISTROS_INICIAIS;
  try {
    const salvos = window.localStorage.getItem(CHAVE_LISTA);
    const registros = salvos ? JSON.parse(salvos) : REGISTROS_INICIAIS;
    const normalizados = registros.map(normalizarAtestado);
    if (salvos) window.localStorage.setItem(CHAVE_LISTA, JSON.stringify(normalizados));
    return normalizados;
  } catch {
    return REGISTROS_INICIAIS;
  }
}

function persistir(registros: AtestadoExameCadastro[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CHAVE_LISTA, JSON.stringify(registros));
  }
}

export function salvarAtestadoCadastro(registro: AtestadoExameCadastro) {
  const registros = listarAtestadosCadastro();
  const salvo = normalizarAtestado({
    ...registro,
    id: registro.id || Date.now(),
  });
  const indice = registros.findIndex((item) => String(item.id) === String(salvo.id));
  if (indice >= 0) registros[indice] = salvo;
  else registros.unshift(salvo);
  persistir(registros);
  return salvo;
}

export function errosAtestadoCadastro(value: AtestadoExameCadastro) {
  const erros: Record<string, string> = {};
  const hoje = hojeIso();



  return erros;
}

export function atestadoCadastroValido(value: AtestadoExameCadastro) {
  return Object.keys(errosAtestadoCadastro(value)).length === 0;
}

export function formatarVeterinario(veterinario: VeterinarioExame | null) {
  return veterinario ? `${veterinario.cpf} - ${veterinario.nome}` : "-";
}

export function formatarProdutor(produtor: ProdutorExame) {
  return `${produtor.documento} - ${produtor.nome}`;
}
