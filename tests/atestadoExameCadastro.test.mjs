import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "@babel/parser";
import {
  calcularSituacaoAtestado,
  criarAtestadoExameVazio,
  errosAtestadoCadastro,
  ESTABELECIMENTOS_EXAME,
  EXPLORACOES_EXAME,
  LOTES_INSUMO_EXAME,
  PRODUTORES_EXAME,
  TIPOS_ATESTADO_DOCUMENTO,
  VETERINARIOS_EXAME,
} from "../src/pages/Exame/AtestadoExameCadastro/atestadoExameCadastroData.ts";

const raiz = resolve(import.meta.dirname, "..");
const ler = (caminho) => readFileSync(resolve(raiz, caminho), "utf8");

test("aceita um cadastro completo de brucelose", () => {
  const hoje = new Date().toISOString().slice(0, 10);
  const value = criarAtestadoExameVazio();
  Object.assign(value, {
    numero: "0000123/2026",
    dataEmissao: hoje,
    veterinario: VETERINARIOS_EXAME[0],
    tipoAtestado: TIPOS_ATESTADO_DOCUMENTO[0],
    produtor: PRODUTORES_EXAME[0],
    estabelecimento: ESTABELECIMENTOS_EXAME[0],
    exploracao: EXPLORACOES_EXAME[0],
    certificadoPropriedadeLivre: "CPL-001",
    motivoExame: "Trânsito",
    numeroTestesBrucelose: "1",
    dataColheita: hoje,
    dataTeste: hoje,
    lotes: [{ ...LOTES_INSUMO_EXAME[0], quantidadeAdquirida: 1 }],
    animais: [{
      ...value.animais[0],
      identificacao: "BR-001",
      sexo: "Fêmea",
      faixaEtaria: "De 13 a 24 meses",
      raca: "Nelore",
      resultados: { "Antígeno Acidificado Tamponado": "Negativo" },
      destinoReagentes: "Descarte controlado",
    }],
  });
  assert.deepEqual(errosAtestadoCadastro(value), {});
});

test("inicia data e médico veterinário sem preenchimento automático", () => {
  const value = criarAtestadoExameVazio();
  assert.equal(value.dataEmissao, "");
  assert.equal(value.veterinario, null);
});

test("valida formato do número e datas futuras", () => {
  const value = criarAtestadoExameVazio();
  value.numero = "123/2026";
  value.dataEmissao = "2999-01-01";
  const erros = errosAtestadoCadastro(value);
  assert.match(erros.numero, /formato/);
  assert.match(erros.dataEmissao, /data atual/);
});

test("expira automaticamente conforme a validade do tipo de atestado", () => {
  assert.equal(calcularSituacaoAtestado("2020-01-01", TIPOS_ATESTADO_DOCUMENTO[0]), "Expirado");
});

test("mantém os dois cadastros separados no menu e registra cinco rotas", () => {
  const dashboard = ler("src/pages/Dashboard.tsx");
  const app = ler("src/App.tsx");
  assert.match(dashboard, /label: "Tipo de Atestado"/);
  assert.match(dashboard, /label: "Atestado de Exame"/);
  for (const rota of [
    "cadastro-atestado-exame",
    "adicionar-cadastro-atestado-exame",
    "visualizar-cadastro-atestado-exame",
    "editar-cadastro-atestado-exame",
    "vinculacoes-cadastro-atestado-exame",
  ]) {
    assert.ok(app.includes(`case "${rota}"`), `Rota ausente: ${rota}`);
  }
});

test("formulário e busca possuem os blocos exigidos pela história", () => {
  const formulario = ler("src/pages/Exame/AtestadoExameCadastro/AtestadoExameCadastroForm.tsx");
  const busca = ler("src/pages/Exame/AtestadoExameCadastro/AtestadoExameCadastro.tsx");
  assert.doesNotThrow(() => parse(formulario, { sourceType: "module", plugins: ["jsx", "typescript"] }));
  assert.doesNotThrow(() => parse(busca, { sourceType: "module", plugins: ["jsx", "typescript"] }));
  for (const texto of ["Informações Básicas", "Informações do Exame", "Saldo de Insumos", "Animais Examinados"]) {
    assert.ok(formulario.includes(texto), `Seção ausente: ${texto}`);
  }
  assert.match(formulario, /tipoContemDoenca\(value\.tipoAtestado, "Brucelose"\)/);
  assert.match(formulario, /tipoContemDoenca\(value\.tipoAtestado, "Tuberculose"\)/);
  assert.match(formulario, /label="Médico Veterinário"/);
  assert.match(formulario, /complementLabel="CPF"/);
  assert.match(formulario, /value && complementLabel/);
  assert.match(formulario, /iconeProfissionalAnimalUrl/);
  assert.match(formulario, /iconeProdutorUrl/);
  assert.match(formulario, /EstabelecimentoAgropecuarioInput/);
  assert.match(formulario, /ExploracaoPecuariaInput/);
  assert.match(formulario, /value\.produtor && \(/);
  assert.match(formulario, /value\.estabelecimento && \(/);
  assert.match(busca, /label="Médico Veterinário"/);
  assert.match(busca, /label="Produtor"/);
  assert.match(busca, /label="Situação"/);
});
