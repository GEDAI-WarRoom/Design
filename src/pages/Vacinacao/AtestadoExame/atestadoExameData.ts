import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";

const PREFIXO_REGISTRO = "sidagro:atestado-exame:";

export interface DadosAtestadoExame {
  id: string | number;
  descricao: string;
  doenca: { codigo?: string; nome: string };
  diasValidade: string;
  situacao: string;
}

export const REGISTRO_ATESTADO_EXAME_MOCK: DadosAtestadoExame = {
  id: 1,
  descricao: "Atestado de Raiva",
  doenca: { codigo: "D04", nome: "Raiva" },
  diasValidade: "180",
  situacao: "Ativo",
};

export function normalizarAtestadoExame(registro?: any): DadosAtestadoExame {
  const base = registro || REGISTRO_ATESTADO_EXAME_MOCK;
  return {
    id: base.id ?? REGISTRO_ATESTADO_EXAME_MOCK.id,
    descricao: base.descricao || "",
    doenca:
      typeof base.doenca === "string"
        ? { nome: base.doenca }
        : base.doenca || { nome: "" },
    diasValidade: String(
      base.diasValidade || REGISTRO_ATESTADO_EXAME_MOCK.diasValidade,
    ),
    situacao: base.situacao || "",
  };
}

export function chaveCadastroAtestadoExame(id: string | number) {
  return `atestado-exame:${id}`;
}

function chaveRegistroAtestadoExame(id: string | number) {
  return `${PREFIXO_REGISTRO}${encodeURIComponent(String(id))}`;
}

export function obterAtestadoExame(registro?: any) {
  const normalizado = normalizarAtestadoExame(registro);
  if (typeof window === "undefined") return normalizado;

  try {
    const salvo = window.localStorage.getItem(
      chaveRegistroAtestadoExame(normalizado.id),
    );
    return salvo
      ? normalizarAtestadoExame(JSON.parse(salvo))
      : normalizado;
  } catch {
    return normalizado;
  }
}

export function criarHistoricoInicialAtestadoExame(
  registro: DadosAtestadoExame,
): HistoricoCadastroItem<DadosAtestadoExame>[] {
  return [
    {
      id: 3,
      data: "04 de ago. de 2026",
      hora: "10:26",
      alteradoPor: "Fernando Scarabeli",
      aprovadoPor: "Lucas Silva Santos",
      atual: true,
      dados: registro,
    },
    {
      id: 2,
      data: "12 de jun. de 2026",
      hora: "12:06",
      alteradoPor: "Fernando Scarabeli",
      dados: {
        ...registro,
        descricao: "Atestado de Vacinação Antirrábica",
        diasValidade: "120",
      },
    },
    {
      id: 1,
      data: "05 de nov. de 2025",
      hora: "09:42",
      alteradoPor: "Lucas Silva Santos",
      dados: {
        ...registro,
        diasValidade: "120",
        situacao: "Inativo",
      },
    },
  ];
}

export function obterHistoricoAtestadoExame(registro: DadosAtestadoExame) {
  return carregarHistoricoCadastro(
    chaveCadastroAtestadoExame(registro.id),
    criarHistoricoInicialAtestadoExame(registro),
  );
}

export function salvarEdicaoAtestadoExame(
  registroAnterior: DadosAtestadoExame,
  dadosAtuais: DadosAtestadoExame,
) {
  const houveAlteracao =
    JSON.stringify(registroAnterior) !== JSON.stringify(dadosAtuais);

  if (!houveAlteracao) {
    return { registro: registroAnterior, houveAlteracao: false };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      chaveRegistroAtestadoExame(registroAnterior.id),
      JSON.stringify(dadosAtuais),
    );
  }

  registrarVersaoCadastro({
    chaveCadastro: chaveCadastroAtestadoExame(registroAnterior.id),
    historicoInicial: criarHistoricoInicialAtestadoExame(registroAnterior),
    dadosAnteriores: registroAnterior,
    dadosAtuais,
    alteradoPor: "Fernando Scarabeli",
  });

  return { registro: dadosAtuais, houveAlteracao: true };
}
