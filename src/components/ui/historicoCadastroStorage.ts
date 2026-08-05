import type { HistoricoCadastroItem } from "./HistoricoCadastroLayout";

const PREFIXO_STORAGE = "sidagro:historico-cadastro:";

function storageDisponivel() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function chaveStorage(chaveCadastro: string) {
  return `${PREFIXO_STORAGE}${encodeURIComponent(chaveCadastro)}`;
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

function criarIdVersao() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `versao-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function carregarHistoricoCadastro<TDados>(
  chaveCadastro: string,
  historicoInicial: HistoricoCadastroItem<TDados>[] = [],
) {
  if (!storageDisponivel()) return historicoInicial;

  try {
    const salvo = window.localStorage.getItem(chaveStorage(chaveCadastro));
    if (!salvo) return historicoInicial;
    const historico = JSON.parse(salvo);
    return Array.isArray(historico)
      ? (historico as HistoricoCadastroItem<TDados>[])
      : historicoInicial;
  } catch {
    return historicoInicial;
  }
}

export function salvarHistoricoCadastro<TDados>(
  chaveCadastro: string,
  historico: HistoricoCadastroItem<TDados>[],
) {
  if (!storageDisponivel()) return;
  window.localStorage.setItem(chaveStorage(chaveCadastro), JSON.stringify(historico));
}

interface RegistrarVersaoCadastroParams<TDados> {
  alteradoPor: string;
  aprovadoPor?: string;
  chaveCadastro: string;
  dadosAnteriores: TDados;
  dadosAtuais: TDados;
  historicoInicial?: HistoricoCadastroItem<TDados>[];
}

export function registrarVersaoCadastro<TDados>({
  alteradoPor,
  aprovadoPor,
  chaveCadastro,
  dadosAnteriores,
  dadosAtuais,
  historicoInicial = [],
}: RegistrarVersaoCadastroParams<TDados>) {
  const historicoAnterior = carregarHistoricoCadastro(
    chaveCadastro,
    historicoInicial,
  );
  const versoesAnteriores = historicoAnterior.map((item) =>
    item.atual
      ? { ...item, atual: false, dados: item.dados ?? dadosAnteriores }
      : item,
  );
  const { data, hora } = agoraFormatado();
  const novaVersao: HistoricoCadastroItem<TDados> = {
    id: criarIdVersao(),
    data,
    hora,
    alteradoPor,
    aprovadoPor,
    atual: true,
    dados: dadosAtuais,
  };
  const historicoAtualizado = [novaVersao, ...versoesAnteriores];

  salvarHistoricoCadastro(chaveCadastro, historicoAtualizado);
  return historicoAtualizado;
}
