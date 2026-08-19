export type SituacaoDoenca = "Ativo" | "Inativo";

export interface EspecieDoenca {
  id: number;
  nome: string;
  grupo: string;
}

export interface Doenca {
  id: string;
  nome: string;
  especies: EspecieDoenca[];
  situacao: SituacaoDoenca;
}

export const ESPECIES_DOENCA: EspecieDoenca[] = [
  { id: 1, nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, nome: "Equino", grupo: "Equídeos" },
  { id: 3, nome: "Suíno", grupo: "Suídeos" },
  { id: 4, nome: "Caprino", grupo: "Caprinos" },
  { id: 5, nome: "Ovino", grupo: "Ovinos" },
  { id: 6, nome: "Ave", grupo: "Aves" },
];

export const SITUACOES_DOENCA = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const COLECAO = "doencas";
const DOENCAS_INICIAIS: Doenca[] = [
  { id: "doenca-1", nome: "Brucelose", especies: [ESPECIES_DOENCA[0]], situacao: "Ativo" },
  { id: "doenca-2", nome: "Febre Aftosa", especies: [ESPECIES_DOENCA[0], ESPECIES_DOENCA[2]], situacao: "Ativo" },
  { id: "doenca-3", nome: "Anemia Infecciosa Equina", especies: [ESPECIES_DOENCA[1]], situacao: "Ativo" },
  { id: "doenca-4", nome: "Raiva", especies: [ESPECIES_DOENCA[0], ESPECIES_DOENCA[1]], situacao: "Ativo" },
  { id: "doenca-5", nome: "Clostridiose", especies: [ESPECIES_DOENCA[0], ESPECIES_DOENCA[2]], situacao: "Inativo" },
];

export function listarDoencas() {
  return listarRegistrosMock(COLECAO, DOENCAS_INICIAIS);
}

export function nomeDoencaExiste(nome: string, ignorarId?: string) {
  const nomeNormalizado = nome.trim().toLocaleLowerCase("pt-BR");
  return listarDoencas().some((doenca) => doenca.id !== ignorarId && doenca.nome.toLocaleLowerCase("pt-BR") === nomeNormalizado);
}

function chaveHistorico(id: string) { return `doenca:${id}`; }
function agoraFormatado() {
  const agora = new Date();
  return {
    data: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(agora),
    hora: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" }).format(agora),
  };
}
function historicoInicial(doenca: Doenca): HistoricoCadastroItem<Doenca>[] {
  const { data, hora } = agoraFormatado();
  return [{ id: `inicial-${doenca.id}`, data, hora, alteradoPor: "Usuário do sistema", atual: true, dados: doenca }];
}

export function salvarDoenca(dados: Omit<Doenca, "id"> & { id?: string }) {
  const registro: Doenca = { ...dados, id: dados.id ?? `doenca-${Date.now()}` };
  const anterior = listarDoencas().find((doenca) => doenca.id === registro.id);
  salvarRegistroMock(COLECAO, registro);
  if (!anterior) salvarHistoricoCadastro(chaveHistorico(registro.id), historicoInicial(registro));
  else if (JSON.stringify(anterior) !== JSON.stringify(registro)) registrarVersaoCadastro({ chaveCadastro: chaveHistorico(registro.id), historicoInicial: historicoInicial(anterior), dadosAnteriores: anterior, dadosAtuais: registro, alteradoPor: "Usuário do sistema" });
  return registro;
}

export function obterDoenca(dados?: Partial<Doenca> | null): Doenca {
  return listarDoencas().find((doenca) => doenca.id === dados?.id) ?? (dados as Doenca) ?? listarDoencas()[0];
}

export function obterHistoricoDoenca(doenca: Doenca) {
  return carregarHistoricoCadastro(chaveHistorico(doenca.id), historicoInicial(doenca)).map((item) => ({ ...item, dados: item.dados ?? doenca }));
}

export function formatarEspecies(especies: EspecieDoenca[]) {
  return especies.map((especie) => especie.nome).join(", ");
}
import type { HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro, registrarVersaoCadastro, salvarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { listarRegistrosMock, salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";
