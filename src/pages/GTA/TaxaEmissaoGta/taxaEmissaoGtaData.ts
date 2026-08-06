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
import { listarEspecies } from "../../Animal/Especie/especieData";
import { listarItensReceita, obterItemReceita } from "../../Arrecadacao/ItemReceita/itemReceitaData";

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
    id: "4",
    codigo: "ITR-004",
    nome: "Taxa de Emissão GTA - Bovinos",
    quantidadeIndice: "2 UFEMG",
  },
  {
    id: "5",
    codigo: "ITR-005",
    nome: "Taxa de Emissão GTA - Aves",
    quantidadeIndice: "1 UFEMG",
  },
  {
    id: "7",
    codigo: "ITR-007",
    nome: "Taxa de Emissão GTA - Suínos",
    quantidadeIndice: "1 UFEMG",
  },
  {
    id: "6",
    codigo: "ITR-006",
    nome: "Taxa de Emissão GTA - Equídeos",
    quantidadeIndice: "3 UFEMG",
  },
];

export function listarEspeciesTaxa() {
  return listarEspecies()
    .filter((item) => item.situacao === "Ativo")
    .map(({ id, codigo, nome, grupo }) => ({ id, codigo, nome, grupo }));
}

export function listarItensReceitaTaxa() {
  return listarItensReceita()
    .filter((item) => item.situacao === "Ativo")
    .map((item) => ({
      id: String(item.id),
      codigo: item.codigo,
      nome: item.descricao,
      quantidadeIndice: item.quantidadeIndiceFormatada,
    }));
}

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

const COLECAO = "taxas-emissao-documento-sanitario";

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
  return listarColecaoMock(COLECAO, TAXAS_EMISSAO_GTA_MOCK).map((taxa) => {
    const especieAtual = listarEspeciesTaxa().find((item) => item.id === taxa.especie.id);
    const atualizarItem = (item: ItemReceitaTaxa | null) => {
      if (!item) return null;
      const atual = obterItemReceita(Number(item.id));
      return atual
        ? {
            id: String(atual.id),
            codigo: atual.codigo,
            nome: atual.descricao,
            quantidadeIndice: atual.quantidadeIndiceFormatada,
          }
        : item;
    };
    return {
      ...taxa,
      especie: especieAtual ?? taxa.especie,
      itemReceita: atualizarItem(taxa.itemReceita),
      itemReceitaLote: atualizarItem(taxa.itemReceitaLote),
      itemReceitaAteLimite: atualizarItem(taxa.itemReceitaAteLimite),
      itemReceitaAcimaLimite: atualizarItem(taxa.itemReceitaAcimaLimite),
    };
  });
}

export function adicionarTaxaEmissaoGta(draft: TaxaEmissaoGtaDraft) {
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  if (
    taxas.some(
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

  const novaTaxa: TaxaEmissaoGta = { ...draft, id: proximoIdNumerico(taxas) };
  salvarColecaoMock(COLECAO, [novaTaxa, ...taxas]);
  return { taxa: novaTaxa };
}

function chaveHistoricoTaxa(id: number) {
  return `taxa-emissao-documento-sanitario:${id}`;
}
export function obterTaxaEmissaoGta(
  dados?: Partial<TaxaEmissaoGta> | null,
): TaxaEmissaoGta {
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  const persistida = taxas.find((taxa) => taxa.id === dados?.id);
  const referencia = persistida ?? taxas[0];
  const normalizada = {
    ...referencia,
    ...(persistida ? {} : dados ?? {}),
    tipoDocumentoSanitario:
      (persistida ? persistida.tipoDocumentoSanitario : dados?.tipoDocumentoSanitario) ?? referencia.tipoDocumentoSanitario ?? "GTA",
    especie: persistida
      ? persistida.especie
      : { ...referencia.especie, ...(dados?.especie ?? {}) },
  };

  return normalizada;
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
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  const taxaDuplicada = taxas.some(
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

  salvarColecaoMock(
    COLECAO,
    taxas.map((taxa) => (taxa.id === taxaAtualizada.id ? taxaAtualizada : taxa)),
  );

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
