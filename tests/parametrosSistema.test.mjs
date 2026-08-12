import assert from "node:assert/strict";
import test from "node:test";
import {
  listarParametrosSistema,
  ordenarParametrosParaPrimeiraPagina,
  parametrosSaoDiferentes,
  validarParametroSistema,
} from "../src/pages/Controle/ParametrosSistema/parametrosSistemaData.ts";

const criarParametro = (alteracoes = {}) => ({
  id: "parametro-teste",
  cadastroId: "gta-gerais",
  nome: "parametroTeste",
  descricao: "Parâmetro usado nos testes",
  valor: "Sim",
  situacao: "Ativo",
  tipo: "sim-nao",
  modificadoPor: "Usuário Teste",
  modificadoEm: "Agora",
  ...alteracoes,
});

test("mantém os 87 parâmetros mockados nos dois agrupamentos de GTA", () => {
  const parametros = listarParametrosSistema();
  assert.equal(parametros.length, 87);
  assert.equal(parametros.filter((item) => item.cadastroId === "gta-gerais").length, 75);
  assert.equal(parametros.filter((item) => item.cadastroId === "gta-funcionalidades").length, 12);
});

test("exibe um exemplo de cada tipo na primeira página", () => {
  const primeiraPagina = ordenarParametrosParaPrimeiraPagina(listarParametrosSistema()).slice(0, 6);
  assert.deepEqual(
    primeiraPagina.map((item) => item.tipo),
    ["texto", "numero", "data", "lista", "sim-nao", "situacao"],
  );
});

test("classifica todos os formatos especiais no controle correto", () => {
  const parametros = new Map(listarParametrosSistema().map((item) => [item.nome, item]));
  assert.equal(parametros.get("vlPercentualMinimoAlertaEstoqueProdutor").tipo, "numero");
  assert.equal(parametros.get("especiesProibicaoEmissaoSaidaGtaBrucelose").tipo, "lista");
  assert.equal(parametros.get("estadosProibicaoEmissaoGtaBrucelose").tipo, "lista");
  assert.equal(parametros.get("gtaObservacoesProdutorSemVacinaAftosa").tipo, "texto-longo");
  assert.equal(parametros.get("descEmitenteProdutor").tipo, "texto-longo");
});

test("deixa de considerar alterado quando valor e situação voltam ao estado salvo", () => {
  const salvo = criarParametro();
  assert.equal(parametrosSaoDiferentes({ ...salvo }, salvo), false);
  assert.equal(parametrosSaoDiferentes({ ...salvo, valor: "Não" }, salvo), true);
  assert.equal(parametrosSaoDiferentes({ ...salvo, situacao: "Inativo" }, salvo), true);
});

test("valida números, datas, listas e opções fechadas", () => {
  assert.equal(validarParametroSistema(criarParametro()), null);
  assert.match(validarParametroSistema(criarParametro({ tipo: "numero", valor: "abc" })), /numérico/);
  assert.match(validarParametroSistema(criarParametro({ tipo: "data", valor: "2026-02-30" })), /data/);
  assert.match(validarParametroSistema(criarParametro({ tipo: "lista", valor: "MG,,SP" })), /itens vazios/);
  assert.match(validarParametroSistema(criarParametro({ tipo: "sim-nao", valor: "Talvez" })), /Sim ou Não/);
  assert.match(validarParametroSistema(criarParametro({ situacao: "Pendente" })), /situação/);
});
