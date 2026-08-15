import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import {
  carregarHistoricoCadastro,
  registrarVersaoCadastro,
  salvarHistoricoCadastro,
} from "../../../components/ui/historicoCadastroStorage";
import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";

export type SituacaoTipoVacina = "Ativo" | "Inativo";

export interface EspecieTipoVacina {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
}

export interface DoencaTipoVacina {
  id: number;
  codigo: string;
  nome: string;
  especiesIds: number[];
}

export interface TipoVacina {
  id: number;
  nome: string;
  exigeReceituario: boolean;
  doencas: DoencaTipoVacina[];
  especies: EspecieTipoVacina[];
  situacao: SituacaoTipoVacina;
}

export type TipoVacinaDraft = Omit<TipoVacina, "id">;

export const SITUACOES_TIPO_VACINA = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
] satisfies Array<{ value: SituacaoTipoVacina; label: string }>;

export const ESPECIES_TIPO_VACINA_MOCK: EspecieTipoVacina[] = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "ESP-005", nome: "Ovino", grupo: "Ovinos e Caprinos" },
  { id: 6, codigo: "ESP-006", nome: "Caprino", grupo: "Ovinos e Caprinos" },
  { id: 7, codigo: "ESP-007", nome: "Aves", grupo: "Aves" },
];

export const DOENCAS_TIPO_VACINA_MOCK: DoencaTipoVacina[] = [
  { id: 1, codigo: "D-001", nome: "Brucelose", especiesIds: [1, 2] },
  { id: 2, codigo: "D-002", nome: "Febre Aftosa", especiesIds: [1, 2, 4, 5, 6] },
  { id: 3, codigo: "D-003", nome: "Raiva dos Herbívoros", especiesIds: [1, 2, 3, 5, 6] },
  { id: 4, codigo: "D-004", nome: "Doença de Newcastle", especiesIds: [7] },
];

const especie = (id: number) => ESPECIES_TIPO_VACINA_MOCK.find((item) => item.id === id)!;
const doenca = (id: number) => DOENCAS_TIPO_VACINA_MOCK.find((item) => item.id === id)!;
const COLECAO = "tipos-vacina";
const chaveHistorico = (id: number) => `tipo-vacina:${id}`;

const TIPOS_VACINA_INICIAIS: TipoVacina[] = [
  { id: 1, nome: "B19", exigeReceituario: true, doencas: [doenca(1)], especies: [especie(1), especie(2)], situacao: "Ativo" },
  { id: 2, nome: "RB51", exigeReceituario: true, doencas: [doenca(1)], especies: [especie(1)], situacao: "Ativo" },
  { id: 3, nome: "Antiaftosa bivalente", exigeReceituario: false, doencas: [doenca(2)], especies: [especie(1), especie(2), especie(4)], situacao: "Ativo" },
  { id: 4, nome: "Antirrábica inativada", exigeReceituario: false, doencas: [doenca(3)], especies: [especie(1), especie(3)], situacao: "Inativo" },
  { id: 5, nome: "Vacina combinada bovina", exigeReceituario: false, doencas: [doenca(2), doenca(3)], especies: [especie(1)], situacao: "Ativo" },
];

function instanteHistorico() {
  const agora = new Date();
  return {
    data: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(agora),
    hora: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" }).format(agora),
  };
}

export function listarTiposVacina() {
  const tipos = listarColecaoMock(COLECAO, TIPOS_VACINA_INICIAIS);
  const exemploJaExiste = tipos.some(
    (tipo) => tipo.nome === "Vacina combinada bovina",
  );

  if (exemploJaExiste) return tipos;

  const tiposComExemplo = [
    ...tipos,
    {
      id: proximoIdNumerico(tipos),
      nome: "Vacina combinada bovina",
      exigeReceituario: false,
      doencas: [doenca(2), doenca(3)],
      especies: [especie(1)],
      situacao: "Ativo" as SituacaoTipoVacina,
    },
  ];
  salvarColecaoMock(COLECAO, tiposComExemplo);
  return tiposComExemplo;
}

export function obterTipoVacina(dados?: Partial<TipoVacina> | null) {
  if (dados?.id == null) return null;
  return listarTiposVacina().find((item) => item.id === dados.id) ?? null;
}

export function criarTipoVacina(draft: TipoVacinaDraft) {
  const registros = listarTiposVacina();
  const novo: TipoVacina = { id: proximoIdNumerico(registros), ...draft };
  salvarColecaoMock(COLECAO, [novo, ...registros]);
  const instante = instanteHistorico();
  salvarHistoricoCadastro(chaveHistorico(novo.id), [{
    id: `criacao-${novo.id}-${Date.now()}`,
    ...instante,
    alteradoPor: "Usuário atual",
    atual: true,
    dados: novo,
  }]);
  return novo;
}

export function atualizarTipoVacina(registro: TipoVacina) {
  const registros = listarTiposVacina();
  const anterior = registros.find((item) => item.id === registro.id);
  if (!anterior) throw new Error("Tipo de vacina não encontrado.");
  salvarColecaoMock(COLECAO, registros.map((item) => item.id === registro.id ? registro : item));
  registrarVersaoCadastro({
    chaveCadastro: chaveHistorico(registro.id),
    alteradoPor: "Usuário atual",
    dadosAnteriores: anterior,
    dadosAtuais: registro,
  });
  return registro;
}

export function obterHistoricoTipoVacina(registro: TipoVacina): HistoricoCadastroItem<TipoVacina>[] {
  const instante = instanteHistorico();
  return carregarHistoricoCadastro(chaveHistorico(registro.id), [{
    id: `inicial-${registro.id}`,
    ...instante,
    alteradoPor: "Sistema",
    atual: true,
    dados: registro,
  }]);
}

export function especiesSuscetiveis(doencas: DoencaTipoVacina[]) {
  const ids = new Set(doencas.flatMap((item) => item.especiesIds));
  return ESPECIES_TIPO_VACINA_MOCK.filter((item) => ids.has(item.id));
}

export function formatarNomes(itens: Array<{ nome: string }>) {
  return itens.length ? itens.map((item) => item.nome).join(", ") : "-";
}
