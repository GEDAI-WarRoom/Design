const PREFIXO_STORAGE = "sidagro:colecao-mock:";

type RegistroIdentificavel = { id: string | number };

function storageDisponivel() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function chaveStorage(colecao: string) {
  return `${PREFIXO_STORAGE}${encodeURIComponent(colecao)}`;
}

function carregarAlteracoes<T extends RegistroIdentificavel>(colecao: string): T[] {
  if (!storageDisponivel()) return [];
  try {
    const dados = JSON.parse(window.localStorage.getItem(chaveStorage(colecao)) ?? "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

export function listarRegistrosMock<T extends RegistroIdentificavel>(
  colecao: string,
  registrosIniciais: T[],
) {
  const alteracoes = carregarAlteracoes<T>(colecao);
  return registrosIniciais.map(
    (registro) => alteracoes.find((item) => item.id === registro.id) ?? registro,
  );
}

export function obterRegistroMock<T extends RegistroIdentificavel>(
  colecao: string,
  registro: T,
) {
  return carregarAlteracoes<T>(colecao).find((item) => item.id === registro.id) ?? registro;
}

export function salvarRegistroMock<T extends RegistroIdentificavel>(
  colecao: string,
  registro: T,
) {
  if (!storageDisponivel()) return registro;
  const alteracoes = carregarAlteracoes<T>(colecao);
  const indice = alteracoes.findIndex((item) => item.id === registro.id);
  const atualizadas = [...alteracoes];
  if (indice >= 0) atualizadas[indice] = registro;
  else atualizadas.push(registro);
  window.localStorage.setItem(chaveStorage(colecao), JSON.stringify(atualizadas));
  return registro;
}
