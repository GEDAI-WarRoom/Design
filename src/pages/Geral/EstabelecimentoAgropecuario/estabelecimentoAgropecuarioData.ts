import type { DadosHistoricoVisualizacao } from "../../../components/ui/EntityProfessionalsView";
import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
} from "../../../components/ui/historicoCadastroStorage";

export interface EstabelecimentoAgropecuario {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: string;
  zona: "Rural" | "Urbana";
  municipioUf: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const CHAVE_ESTABELECIMENTOS = "sidagro:estabelecimentos-agropecuarios";

export const ESTABELECIMENTOS_INICIAIS: EstabelecimentoAgropecuario[] = [
  {
    id: 1,
    codigo: "51080590041",
    nome: "Fazenda Rio Verde",
    proprietarios: "José Aarão Neto - 555.009.956-40",
    zona: "Rural",
    municipioUf: "Lavras - MG",
    situacao: "Ativo",
  },
  {
    id: 2,
    codigo: "31001040082",
    nome: "Haras Vale Verde",
    proprietarios: "José Aarão Neto - 555.009.956-40",
    zona: "Rural",
    municipioUf: "Belo Horizonte - MG",
    situacao: "Ativo",
  },
  {
    id: 3,
    codigo: "31001040090",
    nome: "Granja Alvorada",
    proprietarios: "Agro Cooperativa IMA - 12.345.678/0001-90",
    zona: "Urbana",
    municipioUf: "Varginha - MG",
    situacao: "Suspenso",
  },
];

function storageDisponivel() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function listarEstabelecimentosAgropecuarios() {
  if (!storageDisponivel()) return ESTABELECIMENTOS_INICIAIS;

  try {
    const salvo = window.localStorage.getItem(CHAVE_ESTABELECIMENTOS);
    if (!salvo) return ESTABELECIMENTOS_INICIAIS;
    const estabelecimentos = JSON.parse(salvo);
    return Array.isArray(estabelecimentos)
      ? (estabelecimentos as EstabelecimentoAgropecuario[])
      : ESTABELECIMENTOS_INICIAIS;
  } catch {
    return ESTABELECIMENTOS_INICIAIS;
  }
}

export function obterEstabelecimentoAgropecuario(
  identificador?: string | number,
) {
  if (identificador === undefined || identificador === null) return undefined;
  return listarEstabelecimentosAgropecuarios().find(
    (item) => item.id === identificador || item.codigo === String(identificador),
  );
}

export function criarDadosHistoricoEstabelecimento(
  registro: EstabelecimentoAgropecuario,
): DadosHistoricoVisualizacao {
  return {
    campos: [
      { label: "Código do Estabelecimento", value: registro.codigo },
      { label: "Nome do Estabelecimento", value: registro.nome },
      { label: "Proprietários", value: registro.proprietarios },
      { label: "Zona", value: registro.zona },
      { label: "Município/UF", value: registro.municipioUf },
      { label: "Situação", value: registro.situacao },
    ],
  };
}

function criarHistoricoInicial(
  registro: EstabelecimentoAgropecuario,
): HistoricoCadastroItem<DadosHistoricoVisualizacao>[] {
  if (registro.id !== 1) {
    return [
      {
        id: `inicial-${registro.id}`,
        data: "04 de ago. de 2026",
        hora: "10:26",
        alteradoPor: "Fernando Scarabeli",
        atual: true,
        dados: criarDadosHistoricoEstabelecimento(registro),
      },
    ];
  }

  return [
    {
      id: 3,
      data: "04 de ago. de 2026",
      hora: "10:26",
      alteradoPor: "Fernando Scarabeli",
      aprovadoPor: "Lucas Silva Santos",
      atual: true,
      dados: criarDadosHistoricoEstabelecimento(registro),
    },
    {
      id: 2,
      data: "12 de jun. de 2026",
      hora: "12:06",
      alteradoPor: "Fernando Scarabeli",
      dados: {
        campos: [
          { label: "Código do Estabelecimento", value: "51080590041" },
          { label: "Nome do Estabelecimento", value: "Fazenda Rio Verde" },
          { label: "Proprietários", value: "José Aarão Neto - 555.009.956-40" },
          { label: "Zona", value: "Rural" },
          { label: "Município/UF", value: "Perdões - MG" },
          { label: "Situação", value: "Ativo" },
        ],
      },
    },
    {
      id: 1,
      data: "05 de nov. de 2025",
      hora: "12:06",
      alteradoPor: "Lucas Silva Santos",
      dados: {
        campos: [
          { label: "Código do Estabelecimento", value: "51080590041" },
          { label: "Nome do Estabelecimento", value: "Fazenda Boa Esperança" },
          { label: "Proprietários", value: "José Aarão Neto - 555.009.956-40" },
          { label: "Zona", value: "Rural" },
          { label: "Município/UF", value: "Perdões - MG" },
          { label: "Situação", value: "Inativo" },
        ],
      },
    },
  ];
}

function chaveHistorico(registro: EstabelecimentoAgropecuario) {
  return `estabelecimento-agropecuario:${registro.id || registro.codigo}`;
}

export function obterHistoricoEstabelecimentoAgropecuario(
  registro: EstabelecimentoAgropecuario,
) {
  return carregarHistoricoCadastro(
    chaveHistorico(registro),
    criarHistoricoInicial(registro),
  );
}

export function salvarEdicaoEstabelecimentoAgropecuario(
  registroAnterior: EstabelecimentoAgropecuario,
  dadosAtualizados: EstabelecimentoAgropecuario,
) {
  const houveAlteracao = (
    Object.keys(registroAnterior) as Array<keyof EstabelecimentoAgropecuario>
  ).some((chave) => registroAnterior[chave] !== dadosAtualizados[chave]);

  if (!houveAlteracao) {
    return {
      registro: registroAnterior,
      historico: obterHistoricoEstabelecimentoAgropecuario(registroAnterior),
    };
  }

  const estabelecimentos = listarEstabelecimentosAgropecuarios();
  const listaAtualizada = estabelecimentos.map((item) =>
    item.id === registroAnterior.id ? dadosAtualizados : item,
  );

  if (storageDisponivel()) {
    window.localStorage.setItem(
      CHAVE_ESTABELECIMENTOS,
      JSON.stringify(listaAtualizada),
    );
  }

  const historico = registrarVersaoCadastro({
    chaveCadastro: chaveHistorico(registroAnterior),
    historicoInicial: criarHistoricoInicial(registroAnterior),
    dadosAnteriores: criarDadosHistoricoEstabelecimento(registroAnterior),
    dadosAtuais: criarDadosHistoricoEstabelecimento(dadosAtualizados),
    alteradoPor: "Fernando Scarabeli",
  });

  return { registro: dadosAtualizados, historico };
}
