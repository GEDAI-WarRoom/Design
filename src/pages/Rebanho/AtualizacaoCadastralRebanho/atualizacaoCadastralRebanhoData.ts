export type SituacaoAtualizacaoCadastral =
  | "Atualizado Regular"
  | "Atualizado com Atraso"
  | "Pendente"
  | "Inadimplente Não Iniciado"
  | "Inadimplente Não Concluído";

export type SituacaoItemAtualizacao = "Atualizado" | "Pendente";

export interface ContatoProdutor {
  id: string;
  tipo: "E-mail" | "Telefone" | "Celular";
  valor: string;
  observacao: string;
  obrigatorio: boolean;
}

export interface ProdutorTitular {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
  contatos: ContatoProdutor[];
}

export interface EstabelecimentoAtualizacao {
  id: number;
  nome: string;
  codigo: string;
  municipio: string;
  produtorDocumento: string;
}

export interface FaixaRebanho {
  faixa: string;
  machos: number;
  femeas: number;
}

export interface LancamentosRebanho {
  mortalidadeMachos: number[];
  mortalidadeFemeas: number[];
  evolucaoMachos: number[];
  evolucaoFemeas: number[];
  nascimentoMachos: number[];
  nascimentoFemeas: number[];
  justificativaMortalidade: string;
  documentosComprobatorios: string[];
}

export interface ItemAtualizacaoRebanho {
  id: number;
  codigo: string;
  tipo: "Exploração Pecuária" | "Núcleo de Produção";
  especie: string;
  dataUltimaAtualizacao: string | null;
  situacao: SituacaoItemAtualizacao;
  rebanhoBase: FaixaRebanho[];
  lancamentos?: LancamentosRebanho;
}

export interface AtualizacaoCadastralRebanho {
  id: number;
  etapa: string;
  produtor: ProdutorTitular;
  estabelecimento: EstabelecimentoAtualizacao;
  situacao: SituacaoAtualizacaoCadastral;
  dataFimEtapa: string;
  concluida: boolean;
  itens: ItemAtualizacaoRebanho[];
}

export const SITUACOES_ATUALIZACAO = [
  { value: "Atualizado Regular", label: "Atualizado Regular" },
  { value: "Atualizado com Atraso", label: "Atualizado com Atraso" },
  { value: "Pendente", label: "Pendente" },
  { value: "Inadimplente Não Iniciado", label: "Inadimplente Não Iniciado" },
  { value: "Inadimplente Não Concluído", label: "Inadimplente Não Concluído" },
];

export const USUARIO_REBANHO_MOCK: {
  papel: "Funcionário IMA" | "Produtor";
  produtorDocumento?: string;
} = {
  papel: "Funcionário IMA",
};

export const PRODUTORES_ATUALIZACAO: ProdutorTitular[] = [
  {
    id: 1,
    nome: "Divino de Souza Sobrinho",
    documento: "685.784.465-89",
    tipo: "PF",
    contatos: [
      {
        id: "contato-email-divino",
        tipo: "E-mail",
        valor: "divino@email.com",
        observacao: "",
        obrigatorio: true,
      },
      {
        id: "contato-telefone-divino",
        tipo: "Telefone",
        valor: "(35) 98855-4433",
        observacao: "",
        obrigatorio: true,
      },
      {
        id: "contato-celular-divino",
        tipo: "Celular",
        valor: "(35) 99812-1002",
        observacao: "Contato alternativo",
        obrigatorio: false,
      },
    ],
  },
  {
    id: 2,
    nome: "Maria Aparecida Souza",
    documento: "117.333.215-95",
    tipo: "PF",
    contatos: [
      {
        id: "contato-email-maria",
        tipo: "E-mail",
        valor: "maria.souza@email.com",
        observacao: "",
        obrigatorio: true,
      },
      {
        id: "contato-telefone-maria",
        tipo: "Telefone",
        valor: "(35) 3222-1040",
        observacao: "",
        obrigatorio: true,
      },
    ],
  },
  {
    id: 3,
    nome: "Agropecuária Vale Verde Ltda.",
    documento: "56.338.814/0001-95",
    tipo: "PJ",
    contatos: [
      {
        id: "contato-email-vale-verde",
        tipo: "E-mail",
        valor: "contato@valeverde.com.br",
        observacao: "",
        obrigatorio: true,
      },
      {
        id: "contato-telefone-vale-verde",
        tipo: "Telefone",
        valor: "(31) 3333-9090",
        observacao: "",
        obrigatorio: true,
      },
    ],
  },
];

export const ESTABELECIMENTOS_ATUALIZACAO: EstabelecimentoAtualizacao[] = [
  {
    id: 1,
    nome: "Fazenda Santa Clara",
    codigo: "31234567891",
    municipio: "Lavras - MG",
    produtorDocumento: "685.784.465-89",
  },
  {
    id: 2,
    nome: "Fazenda Rio Preto",
    codigo: "31234567890",
    municipio: "Varginha - MG",
    produtorDocumento: "685.784.465-89",
  },
  {
    id: 3,
    nome: "Sítio Boa Esperança",
    codigo: "31234567001",
    municipio: "Campo Belo - MG",
    produtorDocumento: "117.333.215-95",
  },
  {
    id: 4,
    nome: "Fazenda Vale Verde",
    codigo: "31234567002",
    municipio: "Oliveira - MG",
    produtorDocumento: "56.338.814/0001-95",
  },
];

const REBANHO_BOVINO: FaixaRebanho[] = [
  { faixa: "De 0 a 12 meses", machos: 12, femeas: 15 },
  { faixa: "De 13 a 24 meses", machos: 18, femeas: 45 },
  { faixa: "De 25 a 36 meses", machos: 36, femeas: 45 },
  { faixa: "Acima de 36 meses", machos: 16, femeas: 38 },
];

const REBANHO_AVES: FaixaRebanho[] = [
  { faixa: "De 0 a 8 semanas", machos: 80, femeas: 120 },
  { faixa: "De 9 a 20 semanas", machos: 65, femeas: 160 },
  { faixa: "Acima de 20 semanas", machos: 40, femeas: 240 },
];

const REBANHO_SUINO: FaixaRebanho[] = [
  { faixa: "De 0 a 2 meses", machos: 18, femeas: 22 },
  { faixa: "De 3 a 6 meses", machos: 24, femeas: 30 },
  { faixa: "De 7 a 12 meses", machos: 14, femeas: 28 },
  { faixa: "Acima de 12 meses", machos: 8, femeas: 32 },
];

function lancamentosZerados(quantidadeFaixas: number): LancamentosRebanho {
  const zeros = () => Array.from({ length: quantidadeFaixas }, () => 0);
  return {
    mortalidadeMachos: zeros(),
    mortalidadeFemeas: zeros(),
    evolucaoMachos: zeros(),
    evolucaoFemeas: zeros(),
    nascimentoMachos: zeros(),
    nascimentoFemeas: zeros(),
    justificativaMortalidade: "",
    documentosComprobatorios: [],
  };
}

function lancamentosExemplo(rebanho: FaixaRebanho[]): LancamentosRebanho {
  const lancamentos = lancamentosZerados(rebanho.length);
  if (rebanho.length > 1) {
    lancamentos.mortalidadeMachos[0] = 1;
    lancamentos.mortalidadeFemeas[1] = 2;
    lancamentos.evolucaoMachos[1] = 3;
    lancamentos.evolucaoFemeas[1] = 4;
    lancamentos.nascimentoMachos[0] = 8;
    lancamentos.nascimentoFemeas[0] = 10;
  }
  return lancamentos;
}

const atualizacoes: AtualizacaoCadastralRebanho[] = [
  {
    id: 1,
    etapa: "2026/01",
    produtor: PRODUTORES_ATUALIZACAO[0],
    estabelecimento: ESTABELECIMENTOS_ATUALIZACAO[0],
    situacao: "Pendente",
    dataFimEtapa: "2026-08-31",
    concluida: false,
    itens: [
      {
        id: 101,
        codigo: "312345678910001",
        tipo: "Exploração Pecuária",
        especie: "Bovino",
        dataUltimaAtualizacao: null,
        situacao: "Pendente",
        rebanhoBase: REBANHO_BOVINO,
      },
      {
        id: 102,
        codigo: "312345678910002",
        tipo: "Núcleo de Produção",
        especie: "Aves",
        dataUltimaAtualizacao: "17/02/2026",
        situacao: "Atualizado",
        rebanhoBase: REBANHO_AVES,
        lancamentos: lancamentosExemplo(REBANHO_AVES),
      },
      {
        id: 103,
        codigo: "312345678910003",
        tipo: "Exploração Pecuária",
        especie: "Suíno",
        dataUltimaAtualizacao: "15/02/2026",
        situacao: "Atualizado",
        rebanhoBase: REBANHO_SUINO,
        lancamentos: lancamentosExemplo(REBANHO_SUINO),
      },
    ],
  },
  {
    id: 2,
    etapa: "2025/01",
    produtor: PRODUTORES_ATUALIZACAO[0],
    estabelecimento: ESTABELECIMENTOS_ATUALIZACAO[1],
    situacao: "Inadimplente Não Concluído",
    dataFimEtapa: "2025-08-31",
    concluida: false,
    itens: [
      {
        id: 201,
        codigo: "312345678900001",
        tipo: "Exploração Pecuária",
        especie: "Bovino",
        dataUltimaAtualizacao: null,
        situacao: "Pendente",
        rebanhoBase: REBANHO_BOVINO,
      },
    ],
  },
  {
    id: 3,
    etapa: "2024/01",
    produtor: PRODUTORES_ATUALIZACAO[0],
    estabelecimento: ESTABELECIMENTOS_ATUALIZACAO[0],
    situacao: "Atualizado Regular",
    dataFimEtapa: "2024-08-31",
    concluida: true,
    itens: [
      {
        id: 301,
        codigo: "312345678910001",
        tipo: "Exploração Pecuária",
        especie: "Bovino",
        dataUltimaAtualizacao: "12/04/2024",
        situacao: "Atualizado",
        rebanhoBase: REBANHO_BOVINO,
        lancamentos: lancamentosExemplo(REBANHO_BOVINO),
      },
    ],
  },
  {
    id: 4,
    etapa: "2026/01",
    produtor: PRODUTORES_ATUALIZACAO[1],
    estabelecimento: ESTABELECIMENTOS_ATUALIZACAO[2],
    situacao: "Pendente",
    dataFimEtapa: "2026-08-31",
    concluida: false,
    itens: [
      {
        id: 401,
        codigo: "312345670010001",
        tipo: "Exploração Pecuária",
        especie: "Bovino",
        dataUltimaAtualizacao: null,
        situacao: "Pendente",
        rebanhoBase: REBANHO_BOVINO,
      },
    ],
  },
];

const confirmacoesDadosProdutor = new Set<string>();

export function listarAtualizacoesCadastrais() {
  return atualizacoes;
}

export function obterAtualizacaoCadastral(id?: number | null) {
  if (id == null) return atualizacoes[0] ?? null;
  return atualizacoes.find((item) => item.id === id) ?? null;
}

export function obterItemAtualizacao(
  atualizacaoId?: number | null,
  itemId?: number | null,
) {
  const atualizacao = obterAtualizacaoCadastral(atualizacaoId);
  if (!atualizacao) return null;
  if (itemId == null) return atualizacao.itens[0] ?? null;
  return atualizacao.itens.find((item) => item.id === itemId) ?? null;
}

export function criarLancamentosVazios(item: ItemAtualizacaoRebanho) {
  return lancamentosZerados(item.rebanhoBase.length);
}

export function dadosProdutorConfirmados(atualizacao: AtualizacaoCadastralRebanho) {
  return confirmacoesDadosProdutor.has(
    `${atualizacao.produtor.documento}-${atualizacao.etapa}`,
  );
}

export function confirmarDadosProdutor(atualizacao: AtualizacaoCadastralRebanho) {
  confirmacoesDadosProdutor.add(
    `${atualizacao.produtor.documento}-${atualizacao.etapa}`,
  );
}

export function salvarAtualizacaoDoItem(
  atualizacaoId: number,
  itemId: number,
  lancamentos: LancamentosRebanho,
) {
  const atualizacao = obterAtualizacaoCadastral(atualizacaoId);
  const item = atualizacao?.itens.find((registro) => registro.id === itemId);
  if (!atualizacao || !item || atualizacao.concluida) return null;

  item.lancamentos = {
    ...lancamentos,
    mortalidadeMachos: [...lancamentos.mortalidadeMachos],
    mortalidadeFemeas: [...lancamentos.mortalidadeFemeas],
    evolucaoMachos: [...lancamentos.evolucaoMachos],
    evolucaoFemeas: [...lancamentos.evolucaoFemeas],
    nascimentoMachos: [...lancamentos.nascimentoMachos],
    nascimentoFemeas: [...lancamentos.nascimentoFemeas],
    documentosComprobatorios: [...lancamentos.documentosComprobatorios],
  };
  item.situacao = "Atualizado";
  item.dataUltimaAtualizacao = "29/07/2026";
  return item;
}

export function podeEditarAtualizacao(atualizacao: AtualizacaoCadastralRebanho) {
  return (
    !atualizacao.concluida &&
    atualizacao.situacao !== "Inadimplente Não Iniciado" &&
    atualizacao.situacao !== "Inadimplente Não Concluído"
  );
}

export function todosItensAtualizados(atualizacao: AtualizacaoCadastralRebanho) {
  return (
    atualizacao.itens.length > 0 &&
    atualizacao.itens.every((item) => item.situacao === "Atualizado")
  );
}

export function concluirAtualizacaoCadastral(atualizacaoId: number) {
  const atualizacao = obterAtualizacaoCadastral(atualizacaoId);
  if (!atualizacao || !todosItensAtualizados(atualizacao)) return null;
  atualizacao.concluida = true;
  atualizacao.situacao = "Atualizado Regular";
  return atualizacao;
}

export function progressoAtualizacao(atualizacao: AtualizacaoCadastralRebanho) {
  if (atualizacao.itens.length === 0) return 100;
  const atualizados = atualizacao.itens.filter(
    (item) => item.situacao === "Atualizado",
  ).length;
  return Number(((atualizados / atualizacao.itens.length) * 100).toFixed(1));
}
