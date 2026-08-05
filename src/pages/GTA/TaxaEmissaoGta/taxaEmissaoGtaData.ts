import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";

export type TipoCobranca =
  | "Por Cabeça"
  | "Por Documento"
  | "Por Lotes"
  | "Por Faixas";

export type TipoDocumentoSanitario = "GTA" | "ATA";

export type ModalidadeFaixa =
  | "Cobrar por Cabeça"
  | "Cobrar por Documento";

export interface EspecieTaxa {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
}

export interface ItemReceitaTaxa {
  id: string;
  codigo: string;
  nome: string;
  quantidadeIndice: string;
}

export interface TaxaPorFinalidade {
  tipoProcedencia: string;
  tipoFinalidade: string;
  cobraDentroEstado: "Sim" | "Não";
  cobraForaEstado: "Sim" | "Não";
  contribuicaoFundoPrivado: "Sim" | "Não";
  tipoCobranca: string;
}

export interface TaxaEmissaoGta {
  id: number;
  tipoDocumentoSanitario: TipoDocumentoSanitario;
  especie: EspecieTaxa;
  dataInicioVigencia: string;
  tipoCobranca: TipoCobranca;
  situacao: "Ativo" | "Inativo";
  itemReceita: ItemReceitaTaxa | null;
  tamanhoLote: string;
  itemReceitaLote: ItemReceitaTaxa | null;
  limiteFaixa: string;
  cobrancaAteLimite: ModalidadeFaixa | "";
  itemReceitaAteLimite: ItemReceitaTaxa | null;
  cobrancaAcimaLimite: ModalidadeFaixa | "";
  itemReceitaAcimaLimite: ItemReceitaTaxa | null;
}

export type TaxaEmissaoGtaDraft = Omit<TaxaEmissaoGta, "id">;

export const ESPECIES_TAXA_MOCK: EspecieTaxa[] = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "ESP-005", nome: "Galinha", grupo: "Aves" },
  { id: 6, codigo: "ESP-006", nome: "Abelha com Ferrão", grupo: "Abelhas" },
  { id: 7, codigo: "ESP-007", nome: "Tilápia", grupo: "Peixes" },
];

export const ITENS_RECEITA_TAXA_MOCK: ItemReceitaTaxa[] = [
  {
    id: "1",
    codigo: "001",
    nome: "Taxa de Emissão GTA - Bovinos",
    quantidadeIndice: "2 UFEMG",
  },
  {
    id: "2",
    codigo: "002",
    nome: "Taxa de Emissão GTA - Aves",
    quantidadeIndice: "1 UFEMG",
  },
  {
    id: "3",
    codigo: "003",
    nome: "Taxa de Emissão GTA - Suínos",
    quantidadeIndice: "1 UFEMG",
  },
  {
    id: "4",
    codigo: "004",
    nome: "Taxa de Emissão GTA - Equídeos",
    quantidadeIndice: "3 UFEMG",
  },
];

export const TIPOS_COBRANCA = [
  { value: "Por Cabeça", label: "Por Cabeça" },
  { value: "Por Documento", label: "Por Documento" },
  { value: "Por Lotes", label: "Por Lotes" },
  { value: "Por Faixas", label: "Por Faixas" },
];

export const TIPOS_DOCUMENTO_SANITARIO = [
  { value: "GTA", label: "GTA" },
  { value: "ATA", label: "ATA" },
];

export const MODALIDADES_FAIXA = [
  { value: "Cobrar por Cabeça", label: "Cobrar por Cabeça" },
  { value: "Cobrar por Documento", label: "Cobrar por Documento" },
];

export const TAXAS_POR_FINALIDADE_MOCK: TaxaPorFinalidade[] = [
  {
    tipoProcedencia: "Evento Pecuário",
    tipoFinalidade: "Retorno de Aglomeração",
    cobraDentroEstado: "Sim",
    cobraForaEstado: "Não",
    contribuicaoFundoPrivado: "Não",
    tipoCobranca: "Por Cabeça",
  },
];

const CAMPOS_VAZIOS = {
  itemReceita: null,
  tamanhoLote: "",
  itemReceitaLote: null,
  limiteFaixa: "",
  cobrancaAteLimite: "" as const,
  itemReceitaAteLimite: null,
  cobrancaAcimaLimite: "" as const,
  itemReceitaAcimaLimite: null,
};

export const TAXAS_EMISSAO_GTA_MOCK: TaxaEmissaoGta[] = [
  {
    id: 1,
    tipoDocumentoSanitario: "GTA",
    especie: ESPECIES_TAXA_MOCK[0],
    dataInicioVigencia: "2026-01-01",
    tipoCobranca: "Por Cabeça",
    situacao: "Ativo",
    ...CAMPOS_VAZIOS,
    itemReceita: ITENS_RECEITA_TAXA_MOCK[0],
  },
  {
    id: 2,
    tipoDocumentoSanitario: "ATA",
    especie: ESPECIES_TAXA_MOCK[2],
    dataInicioVigencia: "2026-02-15",
    tipoCobranca: "Por Lotes",
    situacao: "Ativo",
    ...CAMPOS_VAZIOS,
    tamanhoLote: "5",
    itemReceitaLote: ITENS_RECEITA_TAXA_MOCK[3],
  },
  {
    id: 3,
    tipoDocumentoSanitario: "GTA",
    especie: ESPECIES_TAXA_MOCK[4],
    dataInicioVigencia: "2026-03-01",
    tipoCobranca: "Por Faixas",
    situacao: "Inativo",
    ...CAMPOS_VAZIOS,
    limiteFaixa: "20",
    cobrancaAteLimite: "Cobrar por Documento",
    itemReceitaAteLimite: ITENS_RECEITA_TAXA_MOCK[1],
    cobrancaAcimaLimite: "Cobrar por Cabeça",
    itemReceitaAcimaLimite: ITENS_RECEITA_TAXA_MOCK[2],
  },
];

let nextId = TAXAS_EMISSAO_GTA_MOCK.length + 1;

export const criarTaxaVazia = (): TaxaEmissaoGtaDraft => ({
  tipoDocumentoSanitario: "" as TipoDocumentoSanitario,
  especie: { id: 0, codigo: "", nome: "", grupo: "" },
  dataInicioVigencia: "",
  tipoCobranca: "" as TipoCobranca,
  situacao: "Ativo",
  ...CAMPOS_VAZIOS,
});

export function modalidadeOposta(modalidade: ModalidadeFaixa) {
  return modalidade === "Cobrar por Cabeça"
    ? "Cobrar por Documento"
    : "Cobrar por Cabeça";
}

export function listarTaxasEmissaoDocumentoSanitario() {
  return TAXAS_EMISSAO_GTA_MOCK;
}

export function adicionarTaxaEmissaoGta(draft: TaxaEmissaoGtaDraft) {
  if (
    TAXAS_EMISSAO_GTA_MOCK.some(
      (taxa) =>
        taxa.especie.id === draft.especie.id &&
        taxa.tipoDocumentoSanitario === draft.tipoDocumentoSanitario,
    )
  ) {
    return {
      erro:
        `Já existe uma taxa de ${draft.tipoDocumentoSanitario} cadastrada para a espécie selecionada.`,
    };
  }

  const novaTaxa: TaxaEmissaoGta = { ...draft, id: nextId++ };
  TAXAS_EMISSAO_GTA_MOCK.push(novaTaxa);
  salvarRegistroTaxa(novaTaxa);
  return { taxa: novaTaxa };
}

const PREFIXO_REGISTRO = "sidagro:taxa-emissao-documento-sanitario:";

function chaveRegistroTaxa(id: number) {
  return `${PREFIXO_REGISTRO}${id}`;
}

function chaveHistoricoTaxa(id: number) {
  return `taxa-emissao-documento-sanitario:${id}`;
}

function salvarRegistroTaxa(taxa: TaxaEmissaoGta) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(chaveRegistroTaxa(taxa.id), JSON.stringify(taxa));
}

export function obterTaxaEmissaoGta(
  dados?: Partial<TaxaEmissaoGta> | null,
): TaxaEmissaoGta {
  const referencia =
    TAXAS_EMISSAO_GTA_MOCK.find((taxa) => taxa.id === dados?.id) ??
    TAXAS_EMISSAO_GTA_MOCK[0];
  const normalizada = {
    ...referencia,
    ...(dados ?? {}),
    tipoDocumentoSanitario:
      dados?.tipoDocumentoSanitario ?? referencia.tipoDocumentoSanitario ?? "GTA",
    especie: { ...referencia.especie, ...(dados?.especie ?? {}) },
  };

  if (typeof window === "undefined") return normalizada;

  try {
    const salva = window.localStorage.getItem(chaveRegistroTaxa(normalizada.id));
    return salva
      ? ({ ...normalizada, ...JSON.parse(salva) } as TaxaEmissaoGta)
      : normalizada;
  } catch {
    return normalizada;
  }
}

function agoraFormatado() {
  const agora = new Date();
  return {
    data: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(agora),
    hora: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(agora),
  };
}

function criarHistoricoInicialTaxa(
  taxa: TaxaEmissaoGta,
): HistoricoCadastroItem<TaxaEmissaoGta>[] {
  const { data, hora } = agoraFormatado();
  return [
    {
      id: `inicial-${taxa.id}`,
      data,
      hora,
      alteradoPor: "Usuário do sistema",
      atual: true,
      dados: taxa,
    },
  ];
}

export function obterHistoricoTaxaEmissaoGta(taxa: TaxaEmissaoGta) {
  return carregarHistoricoCadastro(
    chaveHistoricoTaxa(taxa.id),
    criarHistoricoInicialTaxa(taxa),
  );
}

export function atualizarTaxaEmissaoGta(taxaAtualizada: TaxaEmissaoGta) {
  const taxaDuplicada = TAXAS_EMISSAO_GTA_MOCK.some(
    (taxa) =>
      taxa.id !== taxaAtualizada.id &&
      taxa.especie.id === taxaAtualizada.especie.id &&
      taxa.tipoDocumentoSanitario === taxaAtualizada.tipoDocumentoSanitario,
  );
  if (taxaDuplicada) {
    return {
      erro: `Já existe uma taxa de ${taxaAtualizada.tipoDocumentoSanitario} cadastrada para a espécie selecionada.`,
    };
  }

  const taxaAnterior = obterTaxaEmissaoGta({ id: taxaAtualizada.id });
  const houveAlteracao =
    JSON.stringify(taxaAnterior) !== JSON.stringify(taxaAtualizada);

  const index = TAXAS_EMISSAO_GTA_MOCK.findIndex(
    (taxa) => taxa.id === taxaAtualizada.id,
  );
  if (index >= 0) TAXAS_EMISSAO_GTA_MOCK[index] = taxaAtualizada;
  salvarRegistroTaxa(taxaAtualizada);

  if (houveAlteracao) {
    registrarVersaoCadastro({
      chaveCadastro: chaveHistoricoTaxa(taxaAtualizada.id),
      historicoInicial: criarHistoricoInicialTaxa(taxaAnterior),
      dadosAnteriores: taxaAnterior,
      dadosAtuais: taxaAtualizada,
      alteradoPor: "Usuário do sistema",
    });
  }

  return { taxa: taxaAtualizada, houveAlteracao };
}

export function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
