import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "@babel/parser";

const raiz = resolve(import.meta.dirname, "..");
const ler = (caminho) => readFileSync(resolve(raiz, caminho), "utf8");
const analisar = (caminho) => parse(ler(caminho), { sourceType: "module", plugins: ["jsx", "typescript"] });

const arquivos = [
  "src/pages/Vacinacao/TipoVacina/TipoVacina.tsx",
  "src/pages/Vacinacao/TipoVacina/TipoVacinaForm.tsx",
  "src/pages/Vacinacao/TipoVacina/AdicionarTipoVacina.tsx",
  "src/pages/Vacinacao/TipoVacina/VisualizarTipoVacina.tsx",
  "src/pages/Vacinacao/TipoVacina/EditarTipoVacina.tsx",
  "src/pages/Vacinacao/TipoVacina/tipoVacinaData.ts",
];

for (const arquivo of arquivos) {
  assert.doesNotThrow(() => analisar(arquivo), `${arquivo} contém sintaxe inválida`);
}

const app = ler("src/App.tsx");
const dashboard = ler("src/pages/Dashboard.tsx");
const busca = ler(arquivos[0]);
const form = ler(arquivos[1]);
const adicionar = ler(arquivos[2]);
const data = ler(arquivos[5]);

for (const rota of ["tipo-vacina", "adicionar-tipo-vacina", "visualizar-tipo-vacina", "editar-tipo-vacina"]) {
  assert.match(app, new RegExp(`case ["']${rota}["']`), `App sem a rota ${rota}`);
}

assert.match(dashboard, /label:\s*["']Tipo de Vacina["'][\s\S]{0,100}route:\s*["']tipo-vacina["']/, "Dashboard sem Tipo de Vacina em Vacinação");

for (const filtro of ["Nome do Tipo de Vacina", "Doença", "Espécie", "Situação"]) {
  assert.ok(busca.includes(filtro), `Busca sem o filtro ${filtro}`);
}

for (const campo of ["Nome do Tipo de Vacina", "Exige receituário para venda da vacina?", "Doenças Aplicáveis", "Espécies Aplicáveis", "Situação"]) {
  assert.ok(form.includes(campo), `Formulário sem o campo/seção ${campo}`);
}

assert.match(adicionar, /form\.doencas\.length\s*>\s*0/, "Cadastro não exige ao menos uma doença");
assert.match(adicionar, /form\.especies\.length\s*>\s*0/, "Cadastro não exige ao menos uma espécie");
assert.match(data, /especiesSuscetiveis/, "Espécies não são limitadas pelas doenças selecionadas");
assert.match(data, /listarColecaoMock/, "Cadastro não utiliza a persistência mock do projeto");

console.log("Tipo de Vacina: dashboard, rotas, busca, cadastro, visualização, edição e regras obrigatórias validados.");
