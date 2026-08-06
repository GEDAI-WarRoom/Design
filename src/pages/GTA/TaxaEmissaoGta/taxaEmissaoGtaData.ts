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

export type CobrancaTaxa =
  | "Documento para Dentro do Estado"
  | "Documento para Fora do Estado";

export interface EspecieTaxa {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
}

export interface FinalidadeTaxa {
  id: number;
  codigo: string;
  nome: string;
  especiesIds: number[];
}

export interface ItemReceitaTaxa {
  id: string;
  codigo: string;
  nome: string;
  classificacao: string;
  quantidadeIndice: string;
}

export interface TaxaEmissaoGta {
  id: number;
  tipoDocumentoSanitario: TipoDocumentoSanitario;
  dataInicioVigencia: string;
  especies: EspecieTaxa[];
  finalidades: FinalidadeTaxa[];
  cobrancasTaxa: CobrancaTaxa[];
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

export const FINALIDADES_TAXA_MOCK: FinalidadeTaxa[] = [
  {
    id: 1,
    codigo: "FIN-001",
    nome: "Abate",
    especiesIds: [1, 2, 4, 5],
  },
  {
    id: 2,
    codigo: "FIN-002",
    nome: "Engorda",
    especiesIds: [1, 2, 4],
  },
  {
    id: 3,
    codigo: "FIN-003",
    nome: "Reprodução",
    especiesIds: [1, 2, 3],
  },
  {
    id: 4,
    codigo: "FIN-004",
    nome: "Exposição ou evento pecuário",
    especiesIds: [1, 2, 3, 4, 5],
  },
  {
    id: 5,
    codigo: "FIN-005",
    nome: "Aquicultura",
    especiesIds: [7],
  },
  {
    id: 6,
    codigo: "FIN-006",
    nome: "Produção apícola",
    especiesIds: [6],
  },
];

const CLASSIFICACAO_RECEITA =
  "11226600 - Taxa de emissão de documentos sanitários";

export const ITENS_RECEITA_TAXA_MOCK: ItemReceitaTaxa[] = [
  {
    id: "4",
    codigo: "ITR-004",
    nome: "Taxa de Emissão GTA - Bovinos",
    classificacao: CLASSIFICACAO_RECEITA,
    quantidadeIndice: "0,20 UFEMG",
  },
  {
    id: "5",
    codigo: "ITR-005",
    nome: "Taxa de Emissão GTA - Aves",
    classificacao: CLASSIFICACAO_RECEITA,
    quantidadeIndice: "1,00 UFEMG",
  },
  {
    id: "7",
    codigo: "ITR-007",
    nome: "Taxa de Emissão GTA - Suínos",
    classificacao: CLASSIFICACAO_RECEITA,
    quantidadeIndice: "1 UFEMG",
  },
  {
    id: "6",
    codigo: "ITR-006",
    nome: "Taxa de Emissão GTA - Equídeos",
    classificacao: CLASSIFICACAO_RECEITA,
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
      classificacao: item.receita,
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

export const OPCOES_COBRANCA_TAXA: CobrancaTaxa[] = [
  "Documento para Dentro do Estado",
  "Documento para Fora do Estado",
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
    dataInicioVigencia: "2026-01-01",
    especies: [ESPECIES_TAXA_MOCK[0], ESPECIES_TAXA_MOCK[1]],
    finalidades: [FINALIDADES_TAXA_MOCK[0], FINALIDADES_TAXA_MOCK[1]],
    cobrancasTaxa: [
      "Documento para Dentro do Estado",
      "Documento para Fora do Estado",
    ],
    tipoCobranca: "Por Cabeça",
    situacao: "Ativo",
    ...CAMPOS_VAZIOS,
    itemReceita: ITENS_RECEITA_TAXA_MOCK[0],
  },
  {
    id: 2,
    tipoDocumentoSanitario: "ATA",
    dataInicioVigencia: "2026-02-15",
    especies: [ESPECIES_TAXA_MOCK[2]],
    finalidades: [FINALIDADES_TAXA_MOCK[2]],
    cobrancasTaxa: ["Documento para Fora do Estado"],
    tipoCobranca: "Por Lotes",
    situacao: "Ativo",
    ...CAMPOS_VAZIOS,
    tamanhoLote: "5",
    itemReceitaLote: ITENS_RECEITA_TAXA_MOCK[2],
  },
  {
    id: 3,
    tipoDocumentoSanitario: "GTA",
    dataInicioVigencia: "2026-03-01",
    especies: [ESPECIES_TAXA_MOCK[4]],
    finalidades: [FINALIDADES_TAXA_MOCK[0], FINALIDADES_TAXA_MOCK[3]],
    cobrancasTaxa: ["Documento para Dentro do Estado"],
    tipoCobranca: "Por Faixas",
    situacao: "Inativo",
    ...CAMPOS_VAZIOS,
    limiteFaixa: "20",
    cobrancaAteLimite: "Cobrar por Documento",
    itemReceitaAteLimite: ITENS_RECEITA_TAXA_MOCK[1],
    cobrancaAcimaLimite: "Cobrar por Cabeça",
    itemReceitaAcimaLimite: ITENS_RECEITA_TAXA_MOCK[0],
  },
];

const COLECAO = "taxas-emissao-documento-sanitario";

export const criarTaxaVazia = (): TaxaEmissaoGtaDraft => ({
  tipoDocumentoSanitario: "" as TipoDocumentoSanitario,
  dataInicioVigencia: "",
  especies: [],
  finalidades: [],
  cobrancasTaxa: [],
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
    const especiesAtuais = listarEspeciesTaxa();
    const {
      especie: especieLegada,
      ...taxaAtual
    } = taxa as TaxaEmissaoGta & { especie?: EspecieTaxa };
    const especiesSalvas = Array.isArray(taxa.especies)
      ? taxa.especies
      : especieLegada
        ? [especieLegada]
        : [];
    const atualizarItem = (item: ItemReceitaTaxa | null) => {
      if (!item) return null;
      const atual = obterItemReceita(Number(item.id));
      return atual
        ? {
            id: String(atual.id),
            codigo: atual.codigo,
            nome: atual.descricao,
            classificacao: atual.receita,
            quantidadeIndice: atual.quantidadeIndiceFormatada,
          }
        : item;
    };
    return {
      ...taxaAtual,
      especies: especiesSalvas.map(
        (especie) =>
          especiesAtuais.find((item) => item.id === especie.id) ?? especie,
      ),
      finalidades: Array.isArray(taxa.finalidades) ? taxa.finalidades : [],
      cobrancasTaxa: Array.isArray(taxa.cobrancasTaxa)
        ? taxa.cobrancasTaxa
        : [],
      itemReceita: atualizarItem(taxa.itemReceita),
      itemReceitaLote: atualizarItem(taxa.itemReceitaLote),
      itemReceitaAteLimite: atualizarItem(taxa.itemReceitaAteLimite),
      itemReceitaAcimaLimite: atualizarItem(taxa.itemReceitaAcimaLimite),
    };
  });
}

function especiesEmConflito(
  taxa: Pick<TaxaEmissaoGta, "tipoDocumentoSanitario" | "especies">,
  ignorarId?: number,
) {
  return listarTaxasEmissaoDocumentoSanitario().find(
    (cadastrada) =>
      cadastrada.id !== ignorarId &&
      cadastrada.tipoDocumentoSanitario === taxa.tipoDocumentoSanitario &&
      cadastrada.especies.some((especieCadastrada) =>
        taxa.especies.some((especie) => especie.id === especieCadastrada.id),
      ),
  );
}

export function adicionarTaxaEmissaoGta(draft: TaxaEmissaoGtaDraft) {
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  const conflito = especiesEmConflito(draft);
  if (conflito) {
    const nomes = conflito.especies
      .filter((especieCadastrada) =>
        draft.especies.some((especie) => especie.id === especieCadastrada.id),
      )
      .map((especie) => especie.nome)
      .join(", ");
    return {
      erro: `Já existe uma taxa de ${draft.tipoDocumentoSanitario} cadastrada para: ${nomes}.`,
    };
  }

  const novaTaxa: TaxaEmissaoGta = { ...draft, id: proximoIdNumerico(taxas) };
  salvarColecaoMock(COLECAO, [novaTaxa, ...taxas]);
  return { taxa: novaTaxa };
}

function chaveHistoricoTaxa(id: number) {
  return `taxa-emissao-documento-sanitario:${id}`;
}
function normalizarTaxa(
  dados: Partial<TaxaEmissaoGta> & { especie?: EspecieTaxa },
  referencia: TaxaEmissaoGta,
): TaxaEmissaoGta {
  const especiesRecebidas = Array.isArray(dados.especies)
    ? dados.especies
    : dados.especie
      ? [dados.especie]
      : referencia.especies;

  return {
    ...referencia,
    ...dados,
    especies: especiesRecebidas.map((especie) => ({ ...especie })),
    finalidades: Array.isArray(dados.finalidades)
      ? dados.finalidades.map((finalidade) => ({ ...finalidade }))
      : referencia.finalidades,
    cobrancasTaxa: Array.isArray(dados.cobrancasTaxa)
      ? dados.cobrancasTaxa
      : referencia.cobrancasTaxa,
  };
}

export function obterTaxaEmissaoGta(
  dados?: (Partial<TaxaEmissaoGta> & { especie?: EspecieTaxa }) | null,
): TaxaEmissaoGta {
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  const persistida = taxas.find((taxa) => taxa.id === dados?.id);
  const referencia = persistida ?? taxas[0];
  return normalizarTaxa(persistida ?? dados ?? {}, referencia);
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
  ).map((item) => ({
    ...item,
    dados: normalizarTaxa(item.dados ?? {}, taxa),
  }));
}

export function atualizarTaxaEmissaoGta(taxaAtualizada: TaxaEmissaoGta) {
  const taxas = listarTaxasEmissaoDocumentoSanitario();
  const conflito = especiesEmConflito(taxaAtualizada, taxaAtualizada.id);
  if (conflito) {
    const nomes = conflito.especies
      .filter((especieCadastrada) =>
        taxaAtualizada.especies.some(
          (especie) => especie.id === especieCadastrada.id,
        ),
      )
      .map((especie) => especie.nome)
      .join(", ");
    return {
      erro: `Já existe uma taxa de ${taxaAtualizada.tipoDocumentoSanitario} cadastrada para: ${nomes}.`,
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
