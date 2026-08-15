import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";

function chaveHistorico(registro: any) {
  return `laboratorio:${registro.id}`;
}

function instanteAtual() {
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

function criarHistoricoInicial(registro: any): HistoricoCadastroItem<any>[] {
  const { data, hora } = instanteAtual();
  return [{
    id: `inicial-${registro.id}`,
    data,
    hora,
    alteradoPor: "Fernando Scarabeli",
    atual: true,
    dados: registro,
  }];
}

export function obterHistoricoLaboratorio(registro: any) {
  return carregarHistoricoCadastro(
    chaveHistorico(registro),
    criarHistoricoInicial(registro),
  );
}

export function registrarEdicaoLaboratorio(registroAnterior: any, registroAtual: any) {
  if (JSON.stringify(registroAnterior) === JSON.stringify(registroAtual)) {
    return obterHistoricoLaboratorio(registroAnterior);
  }

  return registrarVersaoCadastro({
    chaveCadastro: chaveHistorico(registroAnterior),
    historicoInicial: criarHistoricoInicial(registroAnterior),
    dadosAnteriores: registroAnterior,
    dadosAtuais: registroAtual,
    alteradoPor: "Fernando Scarabeli",
  });
}
