export type TipoDocumentoLote = "GTA" | "PTV";
export type DocumentoBuscaLote = TipoDocumentoLote;
export type SituacaoLote = "Ativo" | "Cancelado";
export type StatusPagamentoLote = "Pago" | "Pendente de pagamento";

export interface PessoaLote {
  id: number;
  documento: string;
  nome: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
  origemGta: boolean;
  origemPtv: boolean;
}

export interface UnidadeAdministrativaLote {
  id: number;
  codigo: string;
  nome: string;
  tipo: "Escritório Seccional";
}

export interface DocumentoLotePagamento {
  id: string;
  tipo: TipoDocumentoLote;
  serie?: string;
  numero: string;
  titularId: number;
  titularNome: string;
  status: "Gravada" | "Gravado";
  valor: number;
}

export interface DaeLotePagamento {
  numero: string;
  linhaDigitavel: string;
  dataVencimento: string;
  valor: number;
  situacao: "Pago" | "Aguardando pagamento";
}

export interface LotePagamento {
  id: number;
  numeroLote: number;
  documento: DocumentoBuscaLote;
  tipoLote: "Individual";
  titular: PessoaLote;
  unidadeAdministrativa: UnidadeAdministrativaLote;
  documentos: DocumentoLotePagamento[];
  quantidadeDocumentos: number;
  valor: number;
  dataPagamentoUsuario: string;
  dataPagamentoProdemge: string;
  situacao: SituacaoLote;
  statusPagamento: StatusPagamentoLote;
  dae: DaeLotePagamento;
}

export const PESSOAS_LOTE: PessoaLote[] = [
  { id: 1, documento: "123.456.789-09", nome: "Antônio Carlos Ferreira", tipo: "Pessoa Física", origemGta: true, origemPtv: false },
  { id: 2, documento: "18.345.678/0001-52", nome: "Fazenda Boa Esperança Ltda.", tipo: "Pessoa Jurídica", origemGta: true, origemPtv: true },
  { id: 3, documento: "987.654.321-00", nome: "Mariana Souza Prado", tipo: "Pessoa Física", origemGta: false, origemPtv: true },
  { id: 4, documento: "42.781.539/0001-08", nome: "Cooperativa Sul Mineira", tipo: "Pessoa Jurídica", origemGta: true, origemPtv: true },
];

export const UNIDADES_ADMINISTRATIVAS_LOTE: UnidadeAdministrativaLote[] = [
  { id: 1, codigo: "SECLAV3820", nome: "Escritório Seccional de Lavras", tipo: "Escritório Seccional" },
  { id: 2, codigo: "SECUDI2140", nome: "Escritório Seccional de Uberlândia", tipo: "Escritório Seccional" },
  { id: 3, codigo: "SECJDF3310", nome: "Escritório Seccional de Juiz de Fora", tipo: "Escritório Seccional" },
];

export const DOCUMENTOS_DISPONIVEIS_LOTE: DocumentoLotePagamento[] = [
  { id: "AB-00018452", tipo: "GTA", serie: "AB", numero: "00018452", titularId: 1, titularNome: PESSOAS_LOTE[0].nome, status: "Gravada", valor: 18.75 },
  { id: "AB-00018453", tipo: "GTA", serie: "AB", numero: "00018453", titularId: 1, titularNome: PESSOAS_LOTE[0].nome, status: "Gravada", valor: 22.4 },
  { id: "CD-00027811", tipo: "GTA", serie: "CD", numero: "00027811", titularId: 2, titularNome: PESSOAS_LOTE[1].nome, status: "Gravada", valor: 31.9 },
  { id: "EF-00034102", tipo: "GTA", serie: "EF", numero: "00034102", titularId: 4, titularNome: PESSOAS_LOTE[3].nome, status: "Gravada", valor: 27.65 },
  { id: "000091", tipo: "PTV", numero: "000091", titularId: 2, titularNome: PESSOAS_LOTE[1].nome, status: "Gravado", valor: 42.3 },
  { id: "000092", tipo: "PTV", numero: "000092", titularId: 2, titularNome: PESSOAS_LOTE[1].nome, status: "Gravado", valor: 38.75 },
  { id: "000145", tipo: "PTV", numero: "000145", titularId: 3, titularNome: PESSOAS_LOTE[2].nome, status: "Gravado", valor: 51.2 },
  { id: "000203", tipo: "PTV", numero: "000203", titularId: 4, titularNome: PESSOAS_LOTE[3].nome, status: "Gravado", valor: 46.1 },
];

const criarDae = (numeroLote: number, valor: number, pago: boolean): DaeLotePagamento => ({
  numero: `DAE-2026-${String(numeroLote).padStart(6, "0")}`,
  linhaDigitavel: `85660000000 0 00000000000 0 ${String(numeroLote).padStart(11, "0")} 0`,
  dataVencimento: "2026-07-31",
  valor,
  situacao: pago ? "Pago" : "Aguardando pagamento",
});

export const LOTES_PAGAMENTO_MOCK: LotePagamento[] = [
  {
    id: 1,
    numeroLote: 20260001,
    documento: "GTA",
    tipoLote: "Individual",
    titular: PESSOAS_LOTE[0],
    unidadeAdministrativa: UNIDADES_ADMINISTRATIVAS_LOTE[0],
    documentos: DOCUMENTOS_DISPONIVEIS_LOTE.slice(0, 2),
    quantidadeDocumentos: 2,
    valor: 41.15,
    dataPagamentoUsuario: "2026-07-14",
    dataPagamentoProdemge: "2026-07-15",
    situacao: "Ativo",
    statusPagamento: "Pago",
    dae: criarDae(20260001, 41.15, true),
  },
  {
    id: 2,
    numeroLote: 20260002,
    documento: "PTV",
    tipoLote: "Individual",
    titular: PESSOAS_LOTE[1],
    unidadeAdministrativa: UNIDADES_ADMINISTRATIVAS_LOTE[1],
    documentos: DOCUMENTOS_DISPONIVEIS_LOTE.slice(4, 6),
    quantidadeDocumentos: 2,
    valor: 81.05,
    dataPagamentoUsuario: "",
    dataPagamentoProdemge: "",
    situacao: "Ativo",
    statusPagamento: "Pendente de pagamento",
    dae: criarDae(20260002, 81.05, false),
  },
];

let proximoId = LOTES_PAGAMENTO_MOCK.length + 1;
let proximoNumero = 20260003;

export const DOCUMENTOS_BUSCA_OPTIONS = [
  { value: "GTA", label: "GTA" },
  { value: "PTV", label: "PTV" },
];
export const DOCUMENTOS_CADASTRO_OPTIONS = DOCUMENTOS_BUSCA_OPTIONS.slice(0, 2);
export const SITUACOES_LOTE_OPTIONS = [
  { value: "Ativo", label: "Ativo" },
  { value: "Cancelado", label: "Cancelado" },
];
export const STATUS_PAGAMENTO_OPTIONS = [
  { value: "Pago", label: "Pago" },
  { value: "Pendente de pagamento", label: "Pendente de pagamento" },
];

export const formatarDataLote = (data: string) => {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export const formatarMoedaLote = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const listarLotesPagamento = () => LOTES_PAGAMENTO_MOCK;

export function criarLotePagamento(dados: {
  documento: TipoDocumentoLote;
  titular: PessoaLote;
  unidadeAdministrativa: UnidadeAdministrativaLote;
  documentos: DocumentoLotePagamento[];
}) {
  const valor = dados.documentos.reduce((total, item) => total + item.valor, 0);
  const numeroLote = proximoNumero++;
  const novo: LotePagamento = {
    id: proximoId++,
    numeroLote,
    documento: dados.documento,
    tipoLote: "Individual",
    titular: dados.titular,
    unidadeAdministrativa: dados.unidadeAdministrativa,
    documentos: [...dados.documentos],
    quantidadeDocumentos: dados.documentos.length,
    valor,
    dataPagamentoUsuario: "",
    dataPagamentoProdemge: "",
    situacao: "Ativo",
    statusPagamento: "Pendente de pagamento",
    dae: criarDae(numeroLote, valor, false),
  };
  LOTES_PAGAMENTO_MOCK.unshift(novo);
  return novo;
}
