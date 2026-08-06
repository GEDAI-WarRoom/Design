import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import { DOENCAS_MOCK } from "../../../components/ui/EntitySearch";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";

const PREFIXO_REGISTRO = "sidagro:atestado-exame:";
const CHAVE_LISTA = "sidagro:tipos-atestado";

export interface DoencaAtestadoExame {
  id: number;
  codigo?: string;
  nome: string;
}

export interface DadosAtestadoExame {
  id: string | number;
  descricao: string;
  doencas: DoencaAtestadoExame[];
  diasValidade: string;
  situacao: "Ativo" | "Inativo";
}

export type AtestadoExame = DadosAtestadoExame;

export const DOENCAS_ATESTADO_EXAME = DOENCAS_MOCK as DoencaAtestadoExame[];
export const SITUACOES_ATESTADO_EXAME = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const buscarDoenca = (nome: string) =>
  DOENCAS_ATESTADO_EXAME.find((doenca) => doenca.nome === nome) ?? {
    id: Date.now(),
    nome,
  };

export const REGISTRO_ATESTADO_EXAME_MOCK: DadosAtestadoExame = {
  id: 1,
  descricao: "Atestado de Raiva",
  doencas: [buscarDoenca("Raiva dos Herbívoros")],
  diasValidade: "180",
  situacao: "Ativo",
};

export const ATESTADOS_EXAME_MOCK: AtestadoExame[] = [
  REGISTRO_ATESTADO_EXAME_MOCK,
  {
    id: 2,
    descricao: "Atestado de Mormo e AIE",
    doencas: [
      buscarDoenca("Mormo"),
      buscarDoenca("Anemia Infecciosa Equina (AIE)"),
    ],
    diasValidade: "60",
    situacao: "Ativo",
  },
];

export function normalizarAtestadoExame(registro?: any): DadosAtestadoExame {
  const base = registro || REGISTRO_ATESTADO_EXAME_MOCK;
  const doencasOriginais = Array.isArray(base.doencas)
    ? base.doencas
    : base.doenca
      ? [base.doenca]
      : [];

  return {
    id: base.id ?? REGISTRO_ATESTADO_EXAME_MOCK.id,
    descricao: String(base.descricao ?? ""),
    doencas: doencasOriginais
      .map((doenca: any) =>
        typeof doenca === "string" ? buscarDoenca(doenca) : doenca,
      )
      .filter((doenca: any) => doenca?.nome),
    diasValidade: String(base.diasValidade ?? ""),
    situacao: base.situacao === "Inativo" ? "Inativo" : "Ativo",
  };
}

function persistirLista(registros: DadosAtestadoExame[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAVE_LISTA, JSON.stringify(registros));
}

export function listarAtestadosExame(): DadosAtestadoExame[] {
  if (typeof window === "undefined") return ATESTADOS_EXAME_MOCK;
  try {
    const salvos = window.localStorage.getItem(CHAVE_LISTA);
    return salvos
      ? JSON.parse(salvos).map(normalizarAtestadoExame)
      : ATESTADOS_EXAME_MOCK;
  } catch {
    return ATESTADOS_EXAME_MOCK;
  }
}

export function adicionarAtestadoExame(
  novo: Omit<AtestadoExame, "id" | "situacao">,
) {
  const item: AtestadoExame = {
    id: Date.now(),
    situacao: "Ativo",
    ...novo,
  };
  const registros = [item, ...listarAtestadosExame()];
  persistirLista(registros);
  return item;
}

export function formatarDoencas(doencas: DoencaAtestadoExame[]) {
  return doencas.length
    ? doencas.map((doenca) => doenca.nome).join(", ")
    : "-";
}

export function tipoAtestadoValido(
  dados: Pick<DadosAtestadoExame, "descricao" | "doencas" | "diasValidade">,
) {
  return Boolean(
    dados.descricao.trim() &&
      dados.descricao.length <= 255 &&
      dados.doencas.length > 0 &&
      /^\d{1,3}$/.test(dados.diasValidade),
  );
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
    const registros = listarAtestadosExame();
    const indice = registros.findIndex(
      (registro) => String(registro.id) === String(registroAnterior.id),
    );
    if (indice >= 0) registros[indice] = dadosAtuais;
    else registros.unshift(dadosAtuais);
    persistirLista(registros);
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
