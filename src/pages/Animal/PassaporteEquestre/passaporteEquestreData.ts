import imgLadoDireito from "./imgs/lado_direito.png";
import imgLadoEsquerdo from "./imgs/lado_esquerdo.png";
import imgFrente from "./imgs/frontal.png";
import imgTraseiro from "./imgs/traseiro.png";
import imgRosto from "./imgs/rosto.png";
import imgPescocoInferior from "./imgs/pescoco_inferior.png";

export type PassaporteSituacao =
  | "Aguardando Pagamento"
  | "Ativo"
  | "Suspenso"
  | "Cancelado";

export type ResenhaViewId =
  | "lado_direito"
  | "lado_esquerdo"
  | "frente"
  | "rosto"
  | "pescoco_inferior"
  | "traseiro";

export interface ResenhaMarker {
  id: string;
  x: number;
  y: number;
  number: number;
  description: string;
}

export interface ResenhaViewState {
  photo: string | null;
  markers: ResenhaMarker[];
}

export type ResenhaViews = Record<ResenhaViewId, ResenhaViewState>;

export interface DocumentoPassaporte {
  fileName: string;
  descricao: string;
  emissao: string;
  vencimento?: string;
}

export interface PassaporteEquestreRegistro {
  id: number;
  nomeEquino: string;
  codigoMicrochip: string;
  dataMicrochip: string;
  sexoAnimal: "macho" | "fêmea";
  dataNascimento: string;
  especie: { id: number; nome: string; grupo: string };
  raca: { id: number; nome: string };
  dataValidade: string;
  produtor: { id?: number; nome: string; documento: string };
  estabelecimento: {
    id?: number;
    codigo: string;
    nome: string;
    municipio?: string;
  };
  exploracaoPecuaria: {
    id?: number;
    codigo: string;
    especie?: string;
    estabCodigo?: string;
  };
  exames: {
    aie: DocumentoPassaporte;
    mormo?: DocumentoPassaporte;
  };
  atestados: {
    influenza: DocumentoPassaporte;
    antirrabica?: DocumentoPassaporte;
  };
  views: ResenhaViews;
  observacoesGerais: string;
  situacao: PassaporteSituacao;
  pago: boolean;
}

export const PRODUTORES_PASSAPORTE_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Maria Silva Mendes", documento: "444.111.222-33", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

export const ESTABELECIMENTOS_PASSAPORTE_MOCK = [
  {
    id: 1,
    codigo: "31001040005",
    nome: "Fazenda Rio Preto",
    municipio: "Lavras - MG",
    produtorDocumentos: ["555.009.956-40"],
  },
  {
    id: 2,
    codigo: "42001040005",
    nome: "Fazenda Vertentes",
    municipio: "Varginha - MG",
    produtorDocumentos: ["444.111.222-33", "56.338.814/0001-95"],
  },
  {
    id: 3,
    codigo: "10234567891",
    nome: "Fazenda do Rio",
    municipio: "Abadia dos Dourados - MG",
    produtorDocumentos: ["555.009.956-40", "56.338.814/0001-95"],
  },
];

export const EXPLORACOES_PASSAPORTE_MOCK = [
  {
    id: 1,
    codigo: "310010400050001",
    estabCodigo: "31001040005",
    estabNome: "Fazenda Rio Preto",
    grupo: "Equídeos",
    especie: "Equino",
    produtorDocumentos: ["555.009.956-40"],
  },
  {
    id: 2,
    codigo: "420010400050002",
    estabCodigo: "42001040005",
    estabNome: "Fazenda Vertentes",
    grupo: "Equídeos",
    especie: "Equino",
    produtorDocumentos: ["444.111.222-33", "56.338.814/0001-95"],
  },
  {
    id: 3,
    codigo: "102345678910003",
    estabCodigo: "10234567891",
    estabNome: "Fazenda do Rio",
    grupo: "Equídeos",
    especie: "Asinino",
    produtorDocumentos: ["555.009.956-40", "56.338.814/0001-95"],
  },
];

export const criarResenhaVazia = (): ResenhaViews => ({
  lado_direito: { photo: null, markers: [] },
  lado_esquerdo: { photo: null, markers: [] },
  frente: { photo: null, markers: [] },
  rosto: { photo: null, markers: [] },
  pescoco_inferior: { photo: null, markers: [] },
  traseiro: { photo: null, markers: [] },
});

const criarResenhaExemplo = (): ResenhaViews => ({
  lado_direito: {
    photo: imgLadoDireito,
    markers: [
      { id: "direito-1", x: 45, y: 35, number: 1, description: "Redemoinho na tábua do pescoço" },
    ],
  },
  lado_esquerdo: { photo: imgLadoEsquerdo, markers: [] },
  frente: { photo: imgFrente, markers: [] },
  rosto: {
    photo: imgRosto,
    markers: [
      { id: "rosto-1", x: 50, y: 45, number: 1, description: "Estrela na testa" },
    ],
  },
  pescoco_inferior: { photo: imgPescocoInferior, markers: [] },
  traseiro: { photo: imgTraseiro, markers: [] },
});

export function calcularDataValidade(dataBase = new Date()): string {
  const data = new Date(dataBase);
  data.setFullYear(data.getFullYear() + 1);
  return data.toISOString().split("T")[0];
}

export function calcularVencimentoDocumento(dataEmissao: string): string {
  if (!dataEmissao) return "";
  const data = new Date(`${dataEmissao}T12:00:00`);
  data.setDate(data.getDate() + 60);
  return data.toISOString().split("T")[0];
}

const documento = (
  prefixo: string,
  emissao = "2026-02-10",
): DocumentoPassaporte => ({
  fileName: `${prefixo}_2026.pdf`,
  descricao: "Documento válido apresentado pelo produtor",
  emissao,
  vencimento: calcularVencimentoDocumento(emissao),
});

const criarRegistroExemplo = (
  id: number,
  nomeEquino: string,
  codigoMicrochip: string,
  produtor: PassaporteEquestreRegistro["produtor"],
  estabelecimento: PassaporteEquestreRegistro["estabelecimento"],
  exploracaoPecuaria: PassaporteEquestreRegistro["exploracaoPecuaria"],
  situacao: PassaporteSituacao,
  dataValidade: string,
): PassaporteEquestreRegistro => ({
  id,
  nomeEquino,
  codigoMicrochip,
  dataMicrochip: "2024-10-12",
  sexoAnimal: "macho",
  dataNascimento: "2019-04-05",
  especie: { id: 1, nome: "Equino", grupo: "Equídeos" },
  raca: { id: 1, nome: "Mangalarga Marchador" },
  dataValidade,
  produtor,
  estabelecimento,
  exploracaoPecuaria,
  exames: {
    aie: documento("exame_aie"),
    mormo: documento("exame_mormo"),
  },
  atestados: {
    influenza: documento("atestado_influenza", "2026-01-15"),
    antirrabica: documento("atestado_antirrabica", "2026-01-15"),
  },
  views: criarResenhaExemplo(),
  observacoesGerais: "Animal sem restrições sanitárias.",
  situacao,
  pago: situacao !== "Aguardando Pagamento",
});

let passaportes: PassaporteEquestreRegistro[] = [
  criarRegistroExemplo(
    1,
    "Trovão",
    "981023000000001",
    PRODUTORES_PASSAPORTE_MOCK[0],
    ESTABELECIMENTOS_PASSAPORTE_MOCK[0],
    EXPLORACOES_PASSAPORTE_MOCK[0],
    "Ativo",
    "2027-03-10",
  ),
  criarRegistroExemplo(
    2,
    "Estrela do Sul",
    "981023000000002",
    PRODUTORES_PASSAPORTE_MOCK[2],
    ESTABELECIMENTOS_PASSAPORTE_MOCK[1],
    EXPLORACOES_PASSAPORTE_MOCK[1],
    "Aguardando Pagamento",
    "2027-07-17",
  ),
  criarRegistroExemplo(
    3,
    "Ventania",
    "981023000000003",
    PRODUTORES_PASSAPORTE_MOCK[1],
    ESTABELECIMENTOS_PASSAPORTE_MOCK[1],
    EXPLORACOES_PASSAPORTE_MOCK[1],
    "Suspenso",
    "2026-09-22",
  ),
  criarRegistroExemplo(
    4,
    "Corisco",
    "981023000000004",
    PRODUTORES_PASSAPORTE_MOCK[0],
    ESTABELECIMENTOS_PASSAPORTE_MOCK[2],
    EXPLORACOES_PASSAPORTE_MOCK[2],
    "Cancelado",
    "2025-01-15",
  ),
];

function aplicarSuspensaoPorVencimento() {
  const hoje = new Date().toISOString().split("T")[0];
  passaportes = passaportes.map((passaporte) =>
    passaporte.pago &&
    passaporte.situacao === "Ativo" &&
    passaporte.dataValidade < hoje
      ? { ...passaporte, situacao: "Suspenso" }
      : passaporte,
  );
}

export const listarPassaportesEquestres = (): PassaporteEquestreRegistro[] => {
  aplicarSuspensaoPorVencimento();
  return passaportes.map((passaporte) => ({ ...passaporte }));
};

export const obterPassaporteEquestre = (
  id?: number,
): PassaporteEquestreRegistro | undefined => {
  aplicarSuspensaoPorVencimento();
  return id === undefined ? undefined : passaportes.find((passaporte) => passaporte.id === id);
};

export function adicionarPassaporteEquestre(
  dados: Omit<PassaporteEquestreRegistro, "id">,
): PassaporteEquestreRegistro {
  const proximoId = Math.max(0, ...passaportes.map((passaporte) => passaporte.id)) + 1;
  const novoRegistro = { ...dados, id: proximoId };
  passaportes = [novoRegistro, ...passaportes];
  return novoRegistro;
}

export function atualizarPassaporteEquestre(
  id: number,
  dados: Omit<PassaporteEquestreRegistro, "id">,
): PassaporteEquestreRegistro {
  const registroAtualizado = { ...dados, id };
  passaportes = passaportes.map((passaporte) =>
    passaporte.id === id ? registroAtualizado : passaporte,
  );
  return registroAtualizado;
}

export function confirmarPagamentoPassaporte(id: number): PassaporteEquestreRegistro | undefined {
  const registro = obterPassaporteEquestre(id);
  if (!registro) return undefined;
  return atualizarPassaporteEquestre(id, {
    ...registro,
    pago: true,
    situacao: "Ativo",
  });
}
