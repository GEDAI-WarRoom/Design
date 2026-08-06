export type MockRegistro = { id: string | number };

interface MockDatabaseState {
  versao: number;
  colecoes: Record<string, MockRegistro[]>;
}

const STORAGE_KEY = "sidagro:demo-db";
const DATABASE_VERSION = 1;
const colecoesRegistradas = new Map<string, MockRegistro[]>();
const listeners = new Set<() => void>();

let cache: MockDatabaseState | null = null;
let revisao = 0;
let storageListenerInstalado = false;

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function storageDisponivel() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function estadoVazio(): MockDatabaseState {
  return { versao: DATABASE_VERSION, colecoes: {} };
}

function estadoValido(value: unknown): value is MockDatabaseState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<MockDatabaseState>;
  return (
    state.versao === DATABASE_VERSION &&
    Boolean(state.colecoes) &&
    typeof state.colecoes === "object" &&
    !Array.isArray(state.colecoes)
  );
}

function carregarEstado(): MockDatabaseState {
  if (cache) return cache;
  if (!storageDisponivel()) {
    cache = estadoVazio();
    return cache;
  }

  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY);
    const parsed = salvo ? JSON.parse(salvo) : null;
    cache = estadoValido(parsed) ? parsed : estadoVazio();
  } catch {
    cache = estadoVazio();
  }

  instalarStorageListener();
  return cache;
}

function persistirEstado(state: MockDatabaseState, notificar = true) {
  cache = state;
  if (storageDisponivel()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  if (!notificar) return;
  revisao += 1;
  listeners.forEach((listener) => listener());
}

function instalarStorageListener() {
  if (!storageDisponivel() || storageListenerInstalado) return;
  storageListenerInstalado = true;
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      const parsed = event.newValue ? JSON.parse(event.newValue) : null;
      cache = estadoValido(parsed) ? parsed : estadoVazio();
    } catch {
      cache = estadoVazio();
    }
    revisao += 1;
    listeners.forEach((listener) => listener());
  });
}

export function registrarColecaoMock<T extends MockRegistro>(
  nome: string,
  registrosIniciais: T[],
) {
  colecoesRegistradas.set(nome, clone(registrosIniciais));
}

export function listarColecaoMock<T extends MockRegistro>(
  nome: string,
  registrosIniciais: T[],
): T[] {
  registrarColecaoMock(nome, registrosIniciais);
  const state = carregarEstado();
  const existente = state.colecoes[nome];
  if (Array.isArray(existente)) return clone(existente as T[]);

  const registros = clone(registrosIniciais);
  persistirEstado(
    {
      ...state,
      colecoes: { ...state.colecoes, [nome]: registros },
    },
    false,
  );
  return clone(registros);
}

export function salvarColecaoMock<T extends MockRegistro>(
  nome: string,
  registros: T[],
) {
  const state = carregarEstado();
  persistirEstado({
    ...state,
    colecoes: { ...state.colecoes, [nome]: clone(registros) },
  });
  return clone(registros);
}

export function atualizarColecaoMock<T extends MockRegistro>(
  nome: string,
  registrosIniciais: T[],
  atualizar: (registros: T[]) => T[],
) {
  const atuais = listarColecaoMock(nome, registrosIniciais);
  return salvarColecaoMock(nome, atualizar(atuais));
}

export function proximoIdNumerico(registros: Array<{ id: string | number }>) {
  return (
    registros.reduce((maior, item) => {
      const id = typeof item.id === "number" ? item.id : Number(item.id);
      return Number.isFinite(id) ? Math.max(maior, id) : maior;
    }, 0) + 1
  );
}

export function obterRevisaoMockDatabase() {
  carregarEstado();
  return revisao;
}

export function assinarMockDatabase(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function restaurarDadosDemonstracao() {
  cache = estadoVazio();
  for (const [nome, registros] of colecoesRegistradas) {
    cache.colecoes[nome] = clone(registros);
  }

  if (storageDisponivel()) {
    const chavesAntigas: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const chave = window.localStorage.key(index);
      if (chave?.startsWith("sidagro:") && chave !== STORAGE_KEY) {
        chavesAntigas.push(chave);
      }
    }
    chavesAntigas.forEach((chave) => window.localStorage.removeItem(chave));
  }

  persistirEstado(cache);
}

export function limparMockDatabaseParaTestes() {
  cache = estadoVazio();
  revisao += 1;
}
