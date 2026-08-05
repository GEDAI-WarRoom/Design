import assert from "node:assert/strict";
import test from "node:test";
import {
  calcularSituacaoAutomatica,
  criarEventoPecuarioInicial,
  ESPECIES_EVENTO_MOCK,
  gerarCodigoEvento,
  obterAlertasEventoPecuario,
  RESPONSAVEIS_EVENTO_MOCK,
  validarEventoPecuario,
} from "../src/pages/Animal/EventoPecuario/eventoPecuarioData.ts";

test("exige os campos obrigatórios do cadastro", () => {
  const registro = criarEventoPecuarioInicial();
  const erros = validarEventoPecuario(registro);

  assert.ok(erros.some((erro) => erro.includes("nome do evento")));
  assert.ok(erros.some((erro) => erro.includes("data inicial")));
  assert.ok(erros.some((erro) => erro.includes("espécie")));
  assert.ok(erros.some((erro) => erro.includes("promotora")));
  assert.ok(erros.some((erro) => erro.includes("recinto")));
});

test("impede data final anterior à data inicial", () => {
  const registro = criarEventoPecuarioInicial({}, true);
  registro.periodoDe = "2026-09-14";
  registro.periodoAte = "2026-09-10";

  assert.ok(validarEventoPecuario(registro).some((erro) => erro.includes("data final")));
});

test("exige tipo de leilão somente para leilão com bovídeos", () => {
  const registro = criarEventoPecuarioInicial({}, true);
  registro.tipoLeilao = "";
  assert.ok(validarEventoPecuario(registro).some((erro) => erro.includes("tipo de leilão")));

  registro.especies = [ESPECIES_EVENTO_MOCK.find((item) => item.nome === "Equino")];
  assert.ok(!validarEventoPecuario(registro).some((erro) => erro.includes("tipo de leilão")));
});

test("preserva listas vazias informadas pelo registro selecionado", () => {
  const registro = criarEventoPecuarioInicial({
    responsaveisTecnicos: [],
    anexos: [],
    especies: [],
  }, true);

  assert.deepEqual(registro.responsaveisTecnicos, []);
  assert.deepEqual(registro.anexos, []);
  assert.deepEqual(registro.especies, []);
});

test("gera alertas não bloqueantes para conflito de período e habilitações", () => {
  const registro = criarEventoPecuarioInicial({}, true);
  registro.responsaveisTecnicos = [RESPONSAVEIS_EVENTO_MOCK[1]];
  const alertas = obterAlertasEventoPecuario(registro);

  assert.ok(alertas.some((alerta) => alerta.includes("interseção")));
  assert.ok(alertas.some((alerta) => alerta.includes("não cobrem")));
  assert.deepEqual(validarEventoPecuario(registro), []);
});

test("alerta sem bloquear quando não há responsável técnico", () => {
  const registro = criarEventoPecuarioInicial({}, true);
  registro.responsaveisTecnicos = [];

  assert.ok(obterAlertasEventoPecuario(registro).some((alerta) => alerta.includes("Nenhum responsável")));
  assert.deepEqual(validarEventoPecuario(registro), []);
});

test("aplica situação automática ao fim do período", () => {
  assert.equal(calcularSituacaoAutomatica("2026-01-01", "Ativo", false, "2026-08-05"), "Inativo");
  assert.equal(calcularSituacaoAutomatica("2026-01-01", "Ativo", true, "2026-08-05"), "Suspenso");
  assert.equal(calcularSituacaoAutomatica("2026-12-01", "Ativo", false, "2026-08-05"), "Ativo");
});

test("gera o próximo código inteiro incremental", () => {
  assert.match(gerarCodigoEvento(), /^\d+$/);
  assert.equal(gerarCodigoEvento(), "86261");
});
