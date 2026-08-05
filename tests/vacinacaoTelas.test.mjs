import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "@babel/parser";

const raiz = resolve(import.meta.dirname, "..");
const ler = (caminho) => readFileSync(resolve(raiz, caminho), "utf8");

const cadastros = [
  ["Laboratorio", "Laboratorio", "AdicionarLaboratorio", "VisualizarLaboratorio", "EditarLaboratorio", "visualizar-laboratorio", "editar-laboratorio"],
  ["VendaComSaidaVacina", "VendaComSaidaVacina", "AdicionarVendaComSaidaVacina", "VisualizarVendaComSaidaVacina", "EditarVendaComSaidaVacina", "visualizar-venda-saida-vacina", "editar-venda-saida-vacina"],
  ["VendaComEntradaVacina", "VendaComEntradaVacina", "AdicionarVendaComEntradaVacina", "VisualizarVendaComEntradaVacina", "EditarVendaComEntradaVacina", "visualizar-venda-entrada-vacina", "editar-venda-entrada-vacina"],
  ["PartilhaVacina", "PartilhaVacina", "AdicionarPartilhaVacina", "VisualizarPartilhaVacina", "EditarPartilhaVacina", "visualizar-partilha-vacina", "editar-partilha-vacina"],
  ["LancamentoDoses", "LancamentoDoses", "AdicionarLancamentoDoses", "VisualizarLancamentoDosesVacina", "EditarLancamentoDosesVacina", "visualizar-lancamento-doses-vacina", "editar-lancamento-doses-vacina"],
  ["EtapaVacinacao", "EtapaVacinacao", "AdicionarEtapaVacinacao", "VisualizarEtapaVacinacao", "EditarEtapaVacinacao", "visualizar-etapa-vacinacao", "editar-etapa-vacinacao"],
  ["AutorizacaoVacinacao", "AutorizacaoVacinacao", "AdicionarAutorizacaoVacinacao", "VisualizarAutorizacaoVacinacao", "EditarAutorizacaoVacinacao", "visualizar-autorizacao-vacinacao", "editar-autorizacao-vacinacao"],
  ["DeclaracaoVacinacao", "DeclaracaoVacinacao", "AdicionarDeclaracaoVacinacao", "VisualizarDeclaracaoVacinacao", "EditarDeclaracaoVacinacao", "visualizar-declaracao-vacinacao", "editar-declaracao-vacinacao"],
  ["Doenca", "Doenca", "AdicionarDoenca", "VisualizarDoenca", "EditarDoenca", "visualizar-doenca", "editar-doenca"],
  ["Vacinador", "Vacinador", "AdicionarVacinador", "VisualizarVacinador", "EditarVacinador", "visualizar-vacinador-brucelose", "editar-vacinador-brucelose"],
];

const app = ler("src/App.tsx");
const modoCompartilhado = ler("src/pages/Vacinacao/shared/CadastroVacinacaoMode.tsx");
const estilosGlobais = ler("src/styles/globals.css");
const formKit = ler("src/components/ui/FormKit.tsx");

assert.doesNotThrow(
  () => parse(app, { sourceType: "module", plugins: ["jsx", "typescript"] }),
  "App.tsx contém declarações ou importações duplicadas incompatíveis com o Vite",
);

assert.match(modoCompartilhado, /setAttribute\("inert"/, "Visualização não bloqueia componentes personalizados");
assert.match(modoCompartilhado, /controle\.disabled = true/, "Visualização não desabilita controles HTML");
assert.match(modoCompartilhado, /preencherComExemplo/, "Fluxo de inclusão não possui preenchimento de exemplo");
assert.match(estilosGlobais, /\[inert\] \[data-form-control\]/, "Campos de visualização não possuem estética desabilitada");
assert.match(estilosGlobais, /background-color: #ffffff !important/, "Visualização altera indevidamente o fundo branco dos campos");
assert.match(estilosGlobais, /\[class\*="bg-\[#1A7A3C\]"\]/, "Marcadores verdes não recebem o cinza claro na visualização");
assert.match(formKit, /data-form-control/, "Componentes de formulário não expõem estado visual desabilitado");

for (const [pasta, listagem, adicionar, visualizar, editar, rotaVisualizar, rotaEditar] of cadastros) {
  const base = `src/pages/Vacinacao/${pasta}`;
  const telaListagem = ler(`${base}/${listagem}.tsx`);
  const formulario = ler(`${base}/${adicionar}.tsx`);
  const telaVisualizar = ler(`${base}/${visualizar}.tsx`);
  const telaEditar = ler(`${base}/${editar}.tsx`);

  assert.match(formulario, /CadastroVacinacaoHeader/, `${pasta}: formulário sem cabeçalho por modo`);
  assert.match(formulario, /cadastroVacinacaoPageClass/, `${pasta}: formulário sem proteção de visualização`);
  assert.match(formulario, /dados\?\./, `${pasta}: formulário não hidrata os dados do registro`);
  assert.match(formulario, /const registroAtual =/, `${pasta}: formulário não consolida o registro recém-cadastrado`);
  assert.match(formulario, /const registroAtual = preencherComExemplo\(/, `${pasta}: cadastro vazio não recebe dados de exemplo`);
  assert.ok(formulario.includes(`onNavigate("${rotaVisualizar}", registroAtual)`), `${pasta}: modal não envia o cadastro atual para visualizar`);
  assert.ok(telaVisualizar.includes(`from "./${adicionar}"`), `${pasta}: visualizar não reutiliza inclusão`);
  assert.ok(telaVisualizar.includes('mode="view"'), `${pasta}: modo visualizar ausente`);
  assert.ok(telaVisualizar.includes("dados={props.dados}"), `${pasta}: visualizar não repassa os dados do registro`);
  assert.ok(telaEditar.includes(`from "./${adicionar}"`), `${pasta}: editar não reutiliza inclusão`);
  assert.ok(telaEditar.includes('mode="edit"'), `${pasta}: modo editar ausente`);
  assert.ok(telaEditar.includes("dados={props.dados}"), `${pasta}: editar não repassa os dados do registro`);
  assert.ok(telaListagem.includes(`onNavigate("${rotaVisualizar}",`), `${pasta}: listagem não envia o registro para visualizar`);
  assert.ok(telaListagem.includes(`onNavigate("${rotaEditar}",`), `${pasta}: listagem não envia o registro para editar`);
  assert.ok(app.includes(`case "${rotaVisualizar}"`), `${pasta}: rota de visualização ausente`);
  assert.ok(app.includes(`case "${rotaEditar}"`), `${pasta}: rota de edição ausente`);
  assert.ok(app.includes(`key={\`${rotaVisualizar}-\${screenData?.id ?? "novo"}\`}`), `${pasta}: visualizar não força hidratação do registro atual`);
}

for (const [pasta, arquivo] of [
  ["Doenca", "AdicionarDoenca"],
  ["AutorizacaoVacinacao", "AdicionarAutorizacaoVacinacao"],
  ["DeclaracaoVacinacao", "AdicionarDeclaracaoVacinacao"],
]) {
  const formulario = ler(`src/pages/Vacinacao/${pasta}/${arquivo}.tsx`);
  assert.match(formulario, /mode === "create"[\s\S]{0,100}setSucesso\(true\)/, `${pasta}: inclusão vazia não abre o exemplo`);
}

console.log("Vacinação: 10 cadastros hidratados pela listagem e pelo modal, com visualização inerte e 20 rotas registradas.");
