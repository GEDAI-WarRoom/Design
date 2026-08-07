import assert from "node:assert/strict";
import test from "node:test";

class LocalStorageEmMemoria {
  #dados = new Map();

  get length() {
    return this.#dados.size;
  }

  getItem(chave) {
    return this.#dados.get(chave) ?? null;
  }

  setItem(chave, valor) {
    this.#dados.set(chave, String(valor));
  }

  removeItem(chave) {
    this.#dados.delete(chave);
  }

  key(indice) {
    return [...this.#dados.keys()][indice] ?? null;
  }
}

const localStorage = new LocalStorageEmMemoria();
globalThis.window = {
  localStorage,
  addEventListener() {},
};

const {
  atualizarPerfilUsuario,
  listarPerfisUsuario,
  obterPerfilUsuario,
} = await import("../src/pages/Geral/MeuPerfil/meuPerfilData.ts");
const { restaurarDadosDemonstracao } = await import("../src/mocks/mockDatabase.ts");

test("persiste o perfil alterado na coleção central e restaura o seed", () => {
  const perfilInicial = obterPerfilUsuario("produtor");
  assert.equal(perfilInicial?.nome, "Fernando");
  assert.equal(listarPerfisUsuario().length, 4);

  atualizarPerfilUsuario("produtor", {
    nome: "Fernando Atualizado",
    email: "fernando.atualizado@email.com",
    avatarDataUrl: "data:image/png;base64,perfil-teste",
    aceitouTermos: true,
  });

  const perfilAtualizado = obterPerfilUsuario("produtor");
  assert.equal(perfilAtualizado?.nome, "Fernando Atualizado");
  assert.equal(perfilAtualizado?.email, "fernando.atualizado@email.com");
  assert.equal(perfilAtualizado?.avatarDataUrl, "data:image/png;base64,perfil-teste");
  assert.equal(perfilAtualizado?.aceitouTermos, true);

  const bancoPersistido = JSON.parse(localStorage.getItem("sidagro:demo-db"));
  assert.equal(
    bancoPersistido.colecoes["perfis-usuario"].find(
      (perfil) => perfil.role === "produtor",
    ).nome,
    "Fernando Atualizado",
  );

  restaurarDadosDemonstracao();
  const perfilRestaurado = obterPerfilUsuario("produtor");
  assert.equal(perfilRestaurado?.nome, "Fernando");
  assert.equal(perfilRestaurado?.avatarDataUrl, undefined);
  assert.equal(perfilRestaurado?.aceitouTermos, false);
});
