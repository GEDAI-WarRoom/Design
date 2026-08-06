import {
  listarColecaoMock,
  proximoIdNumerico,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase";
import { listarIndices } from "../Indice/indiceIndice";

export interface ValorIndice {
  id: number;
  indiceId: string;
  ano: string;
  mes: string;
  valor: number;
  situacao: "Ativo" | "Inativo";
}

export interface ValorIndiceVisual extends ValorIndice {
  indice: string;
}

const COLECAO = "valores-indice";

const VALORES_INICIAIS: ValorIndice[] = [
  { id: 1, indiceId: "1", ano: "2026", mes: "Janeiro", valor: 5.2797, situacao: "Ativo" },
  { id: 2, indiceId: "1", ano: "2025", mes: "Dezembro", valor: 5.1656, situacao: "Inativo" },
  { id: 3, indiceId: "1", ano: "2024", mes: "Janeiro", valor: 4.7703, situacao: "Inativo" },
];

export function listarValoresIndice(): ValorIndiceVisual[] {
  const indices = listarIndices();
  return listarColecaoMock(COLECAO, VALORES_INICIAIS).map((item) => ({
    ...item,
    indice: indices.find((indice) => indice.id === item.indiceId)?.nome ?? "Índice não encontrado",
  }));
}

export function obterValorIndice(id?: number | null) {
  const valores = listarValoresIndice();
  if (id == null) return valores[0] ?? null;
  return valores.find((item) => item.id === id) ?? null;
}

export function salvarValorIndice(
  dados: Omit<ValorIndice, "id"> & { id?: number },
) {
  const atuais = listarColecaoMock(COLECAO, VALORES_INICIAIS);
  const registro: ValorIndice = {
    ...dados,
    id: dados.id ?? proximoIdNumerico(atuais),
  };
  salvarColecaoMock(
    COLECAO,
    atuais.some((item) => item.id === registro.id)
      ? atuais.map((item) => (item.id === registro.id ? registro : item))
      : [registro, ...atuais],
  );
  return obterValorIndice(registro.id)!;
}

export function obterValorVigenteIndice(indiceId: string, data: string) {
  const [ano, mesNumero] = data.split("-");
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const mes = meses[Math.max(0, Number(mesNumero) - 1)];
  const ativos = listarValoresIndice().filter(
    (item) => item.indiceId === indiceId && item.situacao === "Ativo",
  );
  return (
    ativos.find((item) => item.ano === ano && item.mes === mes) ??
    ativos.find((item) => item.ano === ano) ??
    ativos.sort((a, b) => `${b.ano}-${b.mes}`.localeCompare(`${a.ano}-${a.mes}`))[0] ??
    null
  );
}
