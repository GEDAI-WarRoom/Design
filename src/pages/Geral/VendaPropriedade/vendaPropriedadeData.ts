export type TipoPessoa = "PF" | "PJ";
export type PorteiraFechada = "Sim" | "Não";
export type TipoTransferencia = "Venda" | "Herança" | "Partilha" | "Doação";

export interface PessoaVendaPropriedade {
  id: number;
  nome: string;
  documento: string;
  tipo: TipoPessoa;
}

export interface EstabelecimentoVendaPropriedade {
  id: number;
  codigo: string;
  nome: string;
  municipio: string;
  proprietarioId: number;
}

export interface VendaPropriedade {
  id: number;
  vendedor: PessoaVendaPropriedade;
  estabelecimento: EstabelecimentoVendaPropriedade;
  comprador: PessoaVendaPropriedade;
  dataVenda: string;
  porteiraFechada: PorteiraFechada;
  tipoTransferencia: TipoTransferencia;
}

export const PESSOAS_VENDA_PROPRIEDADE: PessoaVendaPropriedade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Maria Silva Mendes", documento: "444.111.222-33", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda", documento: "12.345.678/0001-99", tipo: "PJ" },
  { id: 4, nome: "Carlos Henrique Souza", documento: "333.888.777-11", tipo: "PF" },
  { id: 5, nome: "Fazendas Reunidas Mineiras S.A.", documento: "45.678.901/0001-22", tipo: "PJ" },
];

export const PROPRIETARIOS_VENDA_PROPRIEDADE = PESSOAS_VENDA_PROPRIEDADE.filter(
  (pessoa) => [1, 2, 3, 4].includes(pessoa.id),
);

export const ESTABELECIMENTOS_VENDA_PROPRIEDADE: EstabelecimentoVendaPropriedade[] = [
  { id: 1, codigo: "10234567891", nome: "Fazenda do Rio", municipio: "Lavras", proprietarioId: 1 },
  { id: 2, codigo: "20345678902", nome: "Granja Vale Verde", municipio: "Uberlândia", proprietarioId: 2 },
  { id: 3, codigo: "30456789013", nome: "Sítio Abençoado", municipio: "Varginha", proprietarioId: 4 },
  { id: 4, codigo: "40567890124", nome: "Fazenda Santa Luzia", municipio: "Patos de Minas", proprietarioId: 3 },
];

export const VENDAS_PROPRIEDADE_MOCK: VendaPropriedade[] = [
  {
    id: 1,
    vendedor: PROPRIETARIOS_VENDA_PROPRIEDADE[0],
    estabelecimento: ESTABELECIMENTOS_VENDA_PROPRIEDADE[0],
    comprador: PESSOAS_VENDA_PROPRIEDADE[4],
    dataVenda: "2026-05-12",
    porteiraFechada: "Não",
    tipoTransferencia: "Venda",
  },
  {
    id: 2,
    vendedor: PROPRIETARIOS_VENDA_PROPRIEDADE[1],
    estabelecimento: ESTABELECIMENTOS_VENDA_PROPRIEDADE[1],
    comprador: PESSOAS_VENDA_PROPRIEDADE[0],
    dataVenda: "2026-04-03",
    porteiraFechada: "Sim",
    tipoTransferencia: "Doação",
  },
  {
    id: 3,
    vendedor: PROPRIETARIOS_VENDA_PROPRIEDADE[3],
    estabelecimento: ESTABELECIMENTOS_VENDA_PROPRIEDADE[2],
    comprador: PESSOAS_VENDA_PROPRIEDADE[1],
    dataVenda: "2026-02-18",
    porteiraFechada: "Não",
    tipoTransferencia: "Partilha",
  },
];

let proximoId = VENDAS_PROPRIEDADE_MOCK.length + 1;

export function listarVendasPropriedade() {
  return VENDAS_PROPRIEDADE_MOCK;
}

export function obterVendaPropriedade(id?: number | null) {
  if (id == null) return VENDAS_PROPRIEDADE_MOCK[0] ?? null;
  return VENDAS_PROPRIEDADE_MOCK.find((venda) => venda.id === id) ?? null;
}

export function criarVendaPropriedade(dados: Omit<VendaPropriedade, "id">) {
  const novaVenda: VendaPropriedade = { ...dados, id: proximoId++ };
  VENDAS_PROPRIEDADE_MOCK.unshift(novaVenda);
  return novaVenda;
}

export function formatarEstabelecimento(estabelecimento: EstabelecimentoVendaPropriedade) {
  return `${estabelecimento.codigo} - ${estabelecimento.nome}`;
}

export function formatarData(data: string) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
