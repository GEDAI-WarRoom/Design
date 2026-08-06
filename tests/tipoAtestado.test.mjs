import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "@babel/parser";

const raiz = resolve(import.meta.dirname, "..");
const ler = (caminho) => readFileSync(resolve(raiz, caminho), "utf8");

const arquivos = {
  lista: ler("src/pages/Exame/AtestadoExame/AtestadoExame.tsx"),
  adicionar: ler("src/pages/Exame/AtestadoExame/AdicionarAtestadoExame.tsx"),
  editar: ler("src/pages/Exame/AtestadoExame/EditarAtestadoExame.tsx"),
  visualizar: ler("src/pages/Exame/AtestadoExame/VisualizarAtestadoExame.tsx"),
  seletor: ler("src/pages/Exame/AtestadoExame/DoencasAtestadoField.tsx"),
  dados: ler("src/pages/Exame/AtestadoExame/atestadoExameData.ts"),
  dashboard: ler("src/pages/Dashboard.tsx"),
};

for (const [nome, fonte] of Object.entries(arquivos)) {
  if (nome === "dashboard") continue;
  assert.doesNotThrow(
    () => parse(fonte, { sourceType: "module", plugins: ["jsx", "typescript"] }),
    `${nome}: arquivo possui sintaxe inválida`,
  );
}

assert.match(arquivos.dashboard, /label: "Tipo de Atestado"/, "Menu não usa o novo nome");
assert.match(arquivos.lista, />Tipo de Atestado</, "Título da busca não usa o novo nome");
assert.match(arquivos.lista, /Descrição do atestado/, "Filtro de descrição ausente");
assert.match(arquivos.lista, /label="Doença"/, "Filtro de doença ausente");
assert.match(arquivos.lista, /label="Situação"/, "Filtro de situação ausente");
assert.match(arquivos.lista, /formatarDoencas\(item\.doencas\)/, "Listagem não exibe as doenças");
assert.match(arquivos.seletor, /MultiSearchModal<DoencaAtestadoExame>/, "Doença não usa seleção múltipla");
assert.match(arquivos.dados, /doencas: DoencaAtestadoExame\[\]/, "Modelo não aceita múltiplas doenças");
assert.match(arquivos.dados, /base\.doenca[\s\S]{0,80}\[base\.doenca\]/, "Migração de registros antigos ausente");
assert.match(arquivos.adicionar, /tipoAtestadoValido/, "Inclusão não valida os campos obrigatórios");
assert.doesNotMatch(arquivos.adicionar, /descricao \|\||doenca \|\||diasValidade \|\|/, "Inclusão ainda preenche campos vazios automaticamente");
assert.match(arquivos.visualizar, /DoencasAtestadoField[\s\S]{0,100}disabled/, "Visualização não mostra as doenças como somente leitura");
assert.match(arquivos.editar, /DoencasAtestadoField/, "Edição não permite alterar múltiplas doenças");

console.log("Tipo de Atestado: nomenclatura, filtros, seleção múltipla e validações conferidos.");
