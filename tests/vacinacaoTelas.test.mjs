import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "@babel/parser";

const raiz = resolve(import.meta.dirname, "..");
const ler = (caminho) => readFileSync(resolve(raiz, caminho), "utf8");

const analisar = (fonte) => parse(fonte, { sourceType: "module", plugins: ["jsx", "typescript"] });

function visitar(no, visitante) {
  if (!no || typeof no !== "object") return;
  visitante(no);
  for (const valor of Object.values(no)) {
    if (Array.isArray(valor)) {
      for (const item of valor) visitar(item, visitante);
    } else if (valor && typeof valor === "object") {
      visitar(valor, visitante);
    }
  }
}

function valorAtributo(atributo) {
  if (!atributo?.value) return true;
  if (atributo.value.type === "StringLiteral") return atributo.value.value;
  if (atributo.value.type !== "JSXExpressionContainer") return undefined;

  const expressao = atributo.value.expression;
  if (["StringLiteral", "NumericLiteral", "BooleanLiteral"].includes(expressao?.type)) {
    return expressao.value;
  }
  return undefined;
}

function encontrarCampoPorRotulo(ast, rotulo) {
  let resultado;
  visitar(ast, (no) => {
    if (resultado || no.type !== "JSXOpeningElement") return;
    const atributo = no.attributes.find(
      (item) => item.type === "JSXAttribute" && item.name?.name === "label",
    );
    if (atributo && valorAtributo(atributo) === rotulo) resultado = no;
  });
  return resultado;
}

function atributosDoCampo(campo) {
  return new Map(
    campo.attributes
      .filter((atributo) => atributo.type === "JSXAttribute")
      .map((atributo) => [atributo.name.name, valorAtributo(atributo)]),
  );
}

function exigirCampo(ast, rotulo, mensagem) {
  const campo = encontrarCampoPorRotulo(ast, rotulo);
  assert.ok(campo, mensagem);
  return atributosDoCampo(campo);
}

const literal = (texto) => new RegExp(`["']${texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);

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
const ajusteDosesBusca = ler("src/pages/Vacinacao/LancamentoDoses/LancamentoDoses.tsx");
const ajusteDosesCadastro = ler("src/pages/Vacinacao/LancamentoDoses/AdicionarLancamentoDoses.tsx");
const ajusteDosesBuscaAst = analisar(ajusteDosesBusca);
const ajusteDosesCadastroAst = analisar(ajusteDosesCadastro);

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

const tipoDestinatarioBusca = exigirCampo(
  ajusteDosesBuscaAst,
  "Tipo de Destinatário",
  "Ajuste de doses: busca sem o filtro Tipo de Destinatário",
);
const destinatarioBusca = exigirCampo(
  ajusteDosesBuscaAst,
  "Destinatário",
  "Ajuste de doses: busca sem o filtro Destinatário",
);
const documentoDestinatarioBusca = exigirCampo(
  ajusteDosesBuscaAst,
  "CPF/CNPJ do Destinatário",
  "Ajuste de doses: busca sem o filtro CPF/CNPJ do Destinatário",
);

assert.ok(!tipoDestinatarioBusca.has("required"), "Ajuste de doses: Tipo de Destinatário não deve ser obrigatório na busca");
assert.ok(!destinatarioBusca.has("required"), "Ajuste de doses: Destinatário não deve ser obrigatório na busca");
assert.ok(!documentoDestinatarioBusca.has("required"), "Ajuste de doses: CPF/CNPJ não deve ser obrigatório na busca");
assert.equal(destinatarioBusca.get("maxLength"), 255, "Ajuste de doses: Destinatário deve aceitar no máximo 255 caracteres");
assert.equal(documentoDestinatarioBusca.get("maxLength"), 14, "Ajuste de doses: CPF/CNPJ deve aceitar no máximo 14 caracteres");

for (const opcao of ["Produtor", "Vacinador", "Médico Veterinário", "Revendedora de Produtos Agropecuários"]) {
  assert.match(ajusteDosesBusca, literal(opcao), `Ajuste de doses: busca sem a opção de destinatário ${opcao}`);
}

assert.match(ajusteDosesBusca, /\btipoDestinatario\b/, "Ajuste de doses: modelo da busca não guarda o tipo de destinatário");
assert.match(ajusteDosesBusca, /\b(?:destinatarioNome|nomeDestinatario)\b|\bdestinatario\??\.nome\b/, "Ajuste de doses: modelo/listagem não guarda o nome do destinatário");
assert.match(
  ajusteDosesBusca,
  /\b(?:cpfCnpjDestinatario|destinatarioDocumento|documentoDestinatario)\b|\bdestinatario\??\.(?:documento|cpfCnpj)\b/,
  "Ajuste de doses: modelo/listagem não guarda o CPF/CNPJ do destinatário",
);
assert.match(
  ajusteDosesBusca,
  /(?:<th\b[\s\S]{0,250}>[\s\S]{0,120}Destinatário[\s\S]{0,120}<\/th>|["']DESTINATÁRIO["'])/i,
  "Ajuste de doses: listagem sem a coluna Destinatário",
);
assert.match(
  ajusteDosesBusca,
  /(?:\$\{[^}]+\}|\{[^}]+\})\s*-\s*(?:<br\s*\/?>\s*)?(?:\$\{[^}]+\}|\{[^}]+\})/,
  "Ajuste de doses: Destinatário deve ser exibido como CPF/CNPJ - Nome/Razão Social",
);

const tipoDestinatarioCadastro = exigirCampo(
  ajusteDosesCadastroAst,
  "Tipo de Destinatário",
  "Ajuste de doses: cadastro sem o campo Tipo de Destinatário",
);
const destinatarioCadastro = exigirCampo(
  ajusteDosesCadastroAst,
  "Destinatário",
  "Ajuste de doses: cadastro sem o campo Destinatário",
);
assert.equal(tipoDestinatarioCadastro.get("required"), true, "Ajuste de doses: Tipo de Destinatário deve ser obrigatório no cadastro");
assert.equal(destinatarioCadastro.get("required"), true, "Ajuste de doses: Destinatário deve ser obrigatório no cadastro");

for (const opcao of ["Produtor", "Vacinador", "Médico Veterinário", "Revendedora de Produtos Agropecuários"]) {
  assert.match(ajusteDosesCadastro, literal(opcao), `Ajuste de doses: cadastro sem o tipo de destinatário ${opcao}`);
}

for (const [tipo, evidencia] of [
  ["Produtor", /ProdutorInput|PRODUTORES?_MOCK|produtores?\s*:|tipo\s*:\s*["']produtor["']/i],
  ["Revendedora", /RevendedoraInput|REVENDEDORAS?_MOCK|revendedoras?\s*:|tipo\s*:\s*["']revendedora["']/i],
  ["Médico Veterinário", /ProfissionalAnimalInput|PROFISSIONAIS_AREA_ANIMAL_MOCK|VETERINARIOS?_MOCK|medicos?Veterinarios?|tipo\s*:\s*["']medico[_ -]?veterinario["']/i],
  ["Vacinador", /Vacinador(?:Brucelose)?Input|VACINADORES?(?:_BRUCELOSE)?_MOCK|vacinadores?\s*:|tipo\s*:\s*["']vacinador["']/i],
]) {
  assert.match(ajusteDosesCadastro, evidencia, `Ajuste de doses: cadastro sem fonte/seletor específico para ${tipo}`);
}
assert.match(
  ajusteDosesCadastro,
  /tipoDestinatario[\s\S]{0,500}(?:destinatario|entidade)|(?:destinatario|entidade)[\s\S]{0,500}tipoDestinatario/i,
  "Ajuste de doses: seletor de destinatário não depende do tipo selecionado",
);

const campoLoteCadastro = encontrarCampoPorRotulo(ajusteDosesCadastroAst, "Lote");
if (campoLoteCadastro) {
  assert.equal(atributosDoCampo(campoLoteCadastro).get("required"), true, "Ajuste de doses: Lote deve ser obrigatório no cadastro");
} else {
  assert.match(ajusteDosesCadastro, /Adicionar\s+Lote/i, "Ajuste de doses: cadastro sem ação para selecionar Lote");
  assert.match(
    ajusteDosesCadastro,
    /(?:\blote\s*:\s*[^,\n]*\.length\s*===\s*0|errosObrigatorios\.lote|validar[^\n]*(?:lote|notasFiscaisOrigem))/i,
    "Ajuste de doses: seleção de Lote não possui validação obrigatória",
  );
}
assert.match(ajusteDosesCadastro, /MultiSearchModal/, "Ajuste de doses: Lote deve permitir seleção múltipla");
assert.match(ajusteDosesCadastro, literal("Saldo de Vacinas"), "Ajuste de doses: seção Saldo de Vacinas ausente");
assert.match(ajusteDosesCadastro, /(?:["']Adquiridas["']|>\s*Adquiridas\b)/, "Ajuste de doses: seção de saldo deve se chamar Adquiridas");

for (const legenda of ["Disponíveis", "Vendidas", "Vencidas", "Descartadas"]) {
  assert.match(ajusteDosesCadastro, literal(legenda), `Ajuste de doses: legenda ${legenda} ausente no saldo de vacinas`);
}
assert.doesNotMatch(ajusteDosesCadastro, /["'](?:Partilhadas|Utilizadas)["']/, "Ajuste de doses: saldo de vacinas contém legendas diferentes da história");

for (const [pasta, arquivo] of [
  ["Doenca", "AdicionarDoenca"],
  ["AutorizacaoVacinacao", "AdicionarAutorizacaoVacinacao"],
  ["DeclaracaoVacinacao", "AdicionarDeclaracaoVacinacao"],
]) {
  const formulario = ler(`src/pages/Vacinacao/${pasta}/${arquivo}.tsx`);
  assert.match(formulario, /mode === "create"[\s\S]{0,100}setSucesso\(true\)/, `${pasta}: inclusão vazia não abre o exemplo`);
}

console.log("Vacinação: 10 cadastros hidratados pela listagem e pelo modal, com visualização inerte e 20 rotas registradas.");
