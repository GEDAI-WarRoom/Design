export type TipoCobranca = "Por Cabeça" | "Por Documento" | "Por Quantidade";
export type FaixaPorCabeca = "Acima de" | "A cada" | "Até";
export interface EspecieTaxa {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
}
export interface TaxaEmissaoGta {
  id: number;
  especie: EspecieTaxa;
  tipoCobranca: TipoCobranca;
  itemReceita: string;
  dataInicioVigencia: string;
  porCabeca: FaixaPorCabeca | "";
  itemReceitaPorCabeca: string;
  itemReceitaPorDocumento: string;
  quantidadeAnimais: string;
}
export type TaxaEmissaoGtaDraft = Omit<TaxaEmissaoGta, "id">;
export const ESPECIES_TAXA_MOCK: EspecieTaxa[] = [
  { id: 1, codigo: "", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "", nome: "Galinha", grupo: "Aves" },
  { id: 6, codigo: "ESP-006", nome: "Abelha com Ferrão", grupo: "Abelhas" },
  { id: 7, codigo: "ESP-007", nome: "Tilápia", grupo: "Peixes" },
];
export const TIPOS_COBRANCA = [
  { value: "Por Cabeça", label: "Por Cabeça" },
  { value: "Por Documento", label: "Por Documento" },
  { value: "Por Quantidade", label: "Por Quantidade" },
];
export const FAIXAS_POR_CABECA = [
  { value: "Acima de", label: "Acima de" },
  { value: "A cada", label: "A cada" },
  { value: "Até", label: "Até" },
];
export const ITENS_RECEITA = [
  "Abelhas",
  "Aves",
  "Bovinos e Bubalinos",
  "Desinfecção de veículos transportando animais suscetíveis à febre aftosa",
  "Equídeos - a partir de 6 animais",
  "Equídeos - até 5 animais",
  "Peixes",
  "Rastreamento outras espécies animais",
  "Suínos, aves, ovinos, caprinos, - a partir de 21 animais",
  "Suínos, aves, ovinos, caprinos, - até 20 animais",
  "Vacinação direta bovinos e bubalinos",
].map((item) => ({ value: item, label: item }));
export const TAXAS_EMISSAO_GTA_MOCK: TaxaEmissaoGta[] = [
  {
    id: 1,
    especie: ESPECIES_TAXA_MOCK[0],
    tipoCobranca: "Por Cabeça",
    itemReceita: "Bovinos e Bubalinos",
    dataInicioVigencia: "2026-01-01",
    porCabeca: "",
    itemReceitaPorCabeca: "",
    itemReceitaPorDocumento: "",
    quantidadeAnimais: "",
  },
  {
    id: 2,
    especie: ESPECIES_TAXA_MOCK[2],
    tipoCobranca: "Por Documento",
    itemReceita: "Equídeos - até 5 animais",
    dataInicioVigencia: "2026-02-15",
    porCabeca: "",
    itemReceitaPorCabeca: "",
    itemReceitaPorDocumento: "",
    quantidadeAnimais: "",
  },
  {
    id: 3,
    especie: ESPECIES_TAXA_MOCK[4],
    tipoCobranca: "Por Quantidade",
    itemReceita: "",
    dataInicioVigencia: "2026-03-01",
    porCabeca: "Até",
    itemReceitaPorCabeca: "Aves",
    itemReceitaPorDocumento: "Suínos, aves, ovinos, caprinos, - até 20 animais",
    quantidadeAnimais: "20",
  },
];
let nextId = TAXAS_EMISSAO_GTA_MOCK.length + 1;
export const criarTaxaVazia = (): TaxaEmissaoGtaDraft => ({
  especie: { id: 0, codigo: "", nome: "", grupo: "" },
  tipoCobranca: "" as TipoCobranca,
  itemReceita: "",
  dataInicioVigencia: "",
  porCabeca: "",
  itemReceitaPorCabeca: "",
  itemReceitaPorDocumento: "",
  quantidadeAnimais: "",
});
export function adicionarTaxaEmissaoGta(draft: TaxaEmissaoGtaDraft) {
  if (TAXAS_EMISSAO_GTA_MOCK.some((taxa) => taxa.especie.id === draft.especie.id)) {
    return { erro: "Já existe uma taxa de emissão de GTA cadastrada para a espécie selecionada." };
  }
  const novaTaxa: TaxaEmissaoGta = {
    ...draft,
    id: nextId++,
  };
  TAXAS_EMISSAO_GTA_MOCK.push(novaTaxa);
  return { taxa: novaTaxa };
}
export function atualizarTaxaEmissaoGta(taxaAtualizada: TaxaEmissaoGta) {
  const index = TAXAS_EMISSAO_GTA_MOCK.findIndex((taxa) => taxa.id === taxaAtualizada.id);
  if (index >= 0) TAXAS_EMISSAO_GTA_MOCK[index] = taxaAtualizada;
  return taxaAtualizada;
}
export function formatarData(data: string) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
