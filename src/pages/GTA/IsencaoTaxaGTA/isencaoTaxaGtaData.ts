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

export interface IsencaoTaxaDocumentoSanitario {
  id: number;
  motivo: string;
  situacao: "Ativo" | "Inativo";
}

const ISENCOES_INICIAIS: IsencaoTaxaDocumentoSanitario[] = [
  { id: 1, motivo: "Instituição de pesquisa", situacao: "Ativo" },
  { id: 2, motivo: "Saída de eventos", situacao: "Ativo" },
  { id: 3, motivo: "Doação a órgão público", situacao: "Inativo" },
  { id: 4, motivo: "Programa de repovoamento", situacao: "Ativo" },
  { id: 5, motivo: "Uso científico/laboratorial", situacao: "Inativo" },
];

const COLECAO = "isencoes-taxa-documento-sanitario";

function chaveHistorico(id: number) {
  return `isencao-taxa-documento-sanitario:${id}`;
}

export function listarIsencoesTaxaDocumentoSanitario() {
  return listarColecaoMock(COLECAO, ISENCOES_INICIAIS);
}

export function listarIsencoesParaGta() {
  return listarIsencoesTaxaDocumentoSanitario()
    .filter((item) => item.situacao === "Ativo")
    .map((item) => ({ id: item.id, nome: item.motivo }));
}

export function obterIsencaoTaxaDocumentoSanitario(
  dados?: Partial<IsencaoTaxaDocumentoSanitario> | null,
): IsencaoTaxaDocumentoSanitario {
  const registros = listarIsencoesTaxaDocumentoSanitario();
  const referencia =
    registros.find((registro) => registro.id === dados?.id) ??
    registros[0] ??
    ISENCOES_INICIAIS[0];

  return {
    ...referencia,
    ...(dados ?? {}),
    id: dados?.id ?? referencia.id,
    motivo: dados?.motivo ?? referencia.motivo,
    situacao: dados?.situacao ?? referencia.situacao,
  };
}

export function adicionarIsencaoTaxaDocumentoSanitario(
  motivo: string,
): IsencaoTaxaDocumentoSanitario {
  const registros = listarIsencoesTaxaDocumentoSanitario();
  const novaIsencao: IsencaoTaxaDocumentoSanitario = {
    id: proximoIdNumerico(registros),
    motivo: motivo.trim(),
    situacao: "Ativo",
  };

  salvarColecaoMock(COLECAO, [novaIsencao, ...registros]);
  return novaIsencao;
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

function criarHistoricoInicial(
  registro: IsencaoTaxaDocumentoSanitario,
): HistoricoCadastroItem<IsencaoTaxaDocumentoSanitario>[] {
  const { data, hora } = agoraFormatado();
  return [
    {
      id: `inicial-${registro.id}`,
      data,
      hora,
      alteradoPor: "Usuário do sistema",
      atual: true,
      dados: registro,
    },
  ];
}

export function obterHistoricoIsencaoTaxaDocumentoSanitario(
  registro: IsencaoTaxaDocumentoSanitario,
) {
  return carregarHistoricoCadastro(
    chaveHistorico(registro.id),
    criarHistoricoInicial(registro),
  );
}

export function atualizarIsencaoTaxaDocumentoSanitario(
  dadosAtuais: IsencaoTaxaDocumentoSanitario,
) {
  const dadosAnteriores = obterIsencaoTaxaDocumentoSanitario({
    id: dadosAtuais.id,
  });
  const houveAlteracao =
    JSON.stringify(dadosAnteriores) !== JSON.stringify(dadosAtuais);

  if (!houveAlteracao) {
    return { registro: dadosAnteriores, houveAlteracao: false };
  }

  const registros = listarIsencoesTaxaDocumentoSanitario();
  const registrosAtualizados = registros.some(
    (registro) => registro.id === dadosAtuais.id,
  )
    ? registros.map((registro) =>
        registro.id === dadosAtuais.id ? dadosAtuais : registro,
      )
    : [dadosAtuais, ...registros];

  salvarColecaoMock(COLECAO, registrosAtualizados);
  registrarVersaoCadastro({
    chaveCadastro: chaveHistorico(dadosAtuais.id),
    historicoInicial: criarHistoricoInicial(dadosAnteriores),
    dadosAnteriores,
    dadosAtuais,
    alteradoPor: "Usuário do sistema",
  });

  return { registro: dadosAtuais, houveAlteracao: true };
}
