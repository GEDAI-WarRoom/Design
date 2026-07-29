// ============================================================================
// Módulo de Tipos e Regras de Negócio - Índice
// Caminho: src/pages/Indice/indice.ts
// ============================================================================

/**
 * Status possíveis para a entidade Índice
 */
export type SituacaoIndice = 'Ativo' | 'Inativo';

/**
 * Status possíveis para os Valores por Índice
 * RNE001:
 * - Agendado: Cadastro criado para um ano futuro, aguardando vigência.
 * - Ativo: Cadastro vigente para o índice no ano correspondente.
 * - Inativo: Cadastro que perdeu vigência após ativação de novo valor.
 */
export type SituacaoValorIndice = 'Ativo' | 'Agendado' | 'Inativo';

/**
 * Interface do registro de Valor por Índice
 */
export interface ValorIndice {
  id: string;
  indiceId: string;
  valor: number;
  ano: number; // Numérico com tamanho = 4
  situacao: SituacaoValorIndice;
}

/**
 * Interface principal do Índice
 */
export interface Indice {
  id: string;
  nome: string; // Ex: "UFEMG"
  situacao: SituacaoIndice; // "Ativo" | "Inativo"
  valores: ValorIndice[]; // Lista de valores associados
}

/**
 * Interface do Filtro de Busca
 */
export interface FiltroIndice {
  nome: string; // Texto
  situacao: string; // Seleção simples: "Ativo", "Inativo" ou ""
}

/**
 * Notificação emitida conforme a Regra RNE002
 */
export interface NotificacaoRNE002 {
  exibir: boolean;
  mensagem: string;
  diasRestantes: number;
  anoFuturo: number;
}

// ----------------------------------------------------------------------------
// Dados Iniciais / Mock
// ----------------------------------------------------------------------------

export const MOCK_INDICES: Indice[] = [
  {
    id: '1',
    nome: 'UFEMG',
    situacao: 'Ativo',
    valores: [
      { id: 'v1', indiceId: '1', valor: 4.5373, ano: 2024, situacao: 'Inativo' },
      { id: 'v2', indiceId: '1', valor: 4.7703, ano: 2025, situacao: 'Ativo' },
      { id: 'v3', indiceId: '1', valor: 5.0120, ano: 2027, situacao: 'Agendado' },
    ]
  }
];

// ----------------------------------------------------------------------------
// Funções de Validação de Regras de Negócio (RNE001 e RNE002)
// ----------------------------------------------------------------------------

/**
 * RNE001: Valida se é permitido cadastrar o valor para o índice e ajusta os status.
 * - Apenas um valor ativo por índice por ano.
 * - Novos cadastros em anos futuros iniciam como "Agendado".
 */
export function validarERegistrarValorIndice(
  valoresAtuais: ValorIndice[],
  novoValor: Omit<ValorIndice, 'id' | 'situacao'>
): { sucesso: boolean; erro?: string; valoresAtualizados: ValorIndice[] } {
  const anoAtual = new Date().getFullYear();

  // Validação do tamanho do ano (deve conter 4 dígitos)
  if (!novoValor.ano || novoValor.ano.toString().length !== 4) {
    return {
      sucesso: false,
      erro: 'O ano deve ser um valor numérico de exatamente 4 dígitos.',
      valoresAtualizados: valoresAtuais
    };
  }

  // Verifica se já existe um valor ativo para o mesmo ano
  const jaExisteAtivoNoAno = valoresAtuais.some(
    v => v.ano === novoValor.ano && v.situacao === 'Ativo'
  );

  if (jaExisteAtivoNoAno) {
    return {
      sucesso: false,
      erro: `Já existe um valor ativo cadastrado para o ano ${novoValor.ano}. É permitido apenas um cadastro de valor ativo por índice em cada ano.`,
      valoresAtualizados: valoresAtuais
    };
  }

  // Define a situação inicial conforme RNE001
  let situacaoInicial: SituacaoValorIndice = 'Agendado';
  if (novoValor.ano === anoAtual) {
    situacaoInicial = 'Ativo';
  } else if (novoValor.ano < anoAtual) {
    situacaoInicial = 'Inativo';
  }

  const novoRegistro: ValorIndice = {
    id: `v_${Date.now()}`,
    ...novoValor,
    situacao: situacaoInicial
  };

  // Se o novo registro for ativado, inativa os anteriores vigentes
  const valoresAtualizados = valoresAtuais.map(item => {
    if (situacaoInicial === 'Ativo' && item.situacao === 'Ativo') {
      return { ...item, situacao: 'Inativo' as SituacaoValorIndice };
    }
    return item;
  });

  return {
    sucesso: true,
    valoresAtualizados: [...valoresAtualizados, novoRegistro]
  };
}

/**
 * RNE002: Verifica a necessidade de notificar administradores sobre o cadastro do próximo ano.
 * Periodicidade: 30, 7 e 1 dia antes do término do ano vigente.
 */
export function verificarNotificacaoRNE002(valores: ValorIndice[]): NotificacaoRNE002 {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const proximoAno = anoAtual + 1;

  // Verifica se o valor do próximo ano já foi cadastrado
  const proximoAnoCadastrado = valores.some(v => v.ano === proximoAno);
  if (proximoAnoCadastrado) {
    return { exibir: false, mensagem: '', diasRestantes: 0, anoFuturo: proximoAno };
  }

  // Calculo dos dias restantes para o fim do ano
  const fimDoAno = new Date(anoAtual, 11, 31);
  const diffTempo = fimDoAno.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diffTempo / (1000 * 3600 * 24));

  // Notificar quando faltarem 30, 7 ou 1 dia
  if (diasRestantes <= 30) {
    return {
      exibir: true,
      mensagem: `ALERTA (RNE002): Faltam ${diasRestantes} dia(s) para o término do ano vigente. O valor do índice para o ano de ${proximoAno} ainda não foi cadastrado!`,
      diasRestantes,
      anoFuturo: proximoAno
    };
  }

  return { exibir: false, mensagem: '', diasRestantes, anoFuturo: proximoAno };
}