import { listarColecaoMock, proximoIdNumerico, salvarColecaoMock } from "../../../mocks/mockDatabase";

export interface PessoaFisica {
  id: number;
  cpf: string;
  nome: string;
  apelido: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  representantes: Array<{ id: string; nome: string; cpf: string; documentoNome: string; descricao: string }>;
  correspondencia: Record<string, string>;
  enderecoResidencia: "Sim" | "Não";
  residencia: Record<string, string>;
  observacaoResidencia: string;
  contatos: Array<{ id: string; tipo: string; valor: string; observacao: string }>;
  anexos: Array<{ id: string; nome: string; descricao: string }>;
  observacao: string;
  situacao: "Ativo" | "Inativo";
}

const COLECAO = "pessoas-fisicas";

const enderecoInicial = { zona: "Urbana", cep: "37200-000", estado: "Minas Gerais", municipio: "Lavras", bairro: "Centro", endereco: "Rua Doutor Francisco Sales", numero: "245", complemento: "", localidade: "Centro", distrito: "Sede", latitude: "", longitude: "" };
const pessoaInicial = (id: number, nome: string, cpf: string, municipio: string, situacao: PessoaFisica["situacao"]): PessoaFisica => ({
  id, nome, cpf, situacao, apelido: "", dataNascimento: "", sexo: "", estadoCivil: "", representantes: [],
  correspondencia: { ...enderecoInicial, municipio }, enderecoResidencia: "Sim", residencia: { ...enderecoInicial, municipio },
  observacaoResidencia: "", contatos: [], anexos: [], observacao: "",
});
const PESSOAS_FISICAS_INICIAIS = [
  pessoaInicial(1, "Eloiza Silva", "444.009.956-40", "Lavras", "Ativo"),
  pessoaInicial(2, "Pedro Alves Moraes", "222.114.558-70", "Belo Horizonte", "Ativo"),
  pessoaInicial(3, "Carla Menezes Rocha", "111.998.775-30", "Uberlândia", "Inativo"),
  pessoaInicial(4, "Fernando", "362.778.831-19", "Lavras", "Ativo"),
  pessoaInicial(5, "Thais Lopes", "", "Belo Horizonte", "Ativo"),
  pessoaInicial(6, "Thomas Anderson", "", "Belo Horizonte", "Ativo"),
];

export function listarPessoasFisicas() {
  const registros = listarColecaoMock(COLECAO, PESSOAS_FISICAS_INICIAIS);
  const faltantes = PESSOAS_FISICAS_INICIAIS.filter((seed) => !registros.some((item) => item.id === seed.id));
  if (!faltantes.length) return registros;
  const atualizados = [...registros, ...faltantes];
  salvarColecaoMock(COLECAO, atualizados);
  return atualizados;
}

export function obterPessoaFisica(id?: number | null) {
  if (id == null) return null;
  return listarPessoasFisicas().find((item) => item.id === id) ?? null;
}

export function salvarPessoaFisica(dados: Omit<PessoaFisica, "id" | "situacao"> & Partial<Pick<PessoaFisica, "id" | "situacao">>) {
  const registros = listarPessoasFisicas();
  const id = dados.id ?? proximoIdNumerico(registros);
  const registro: PessoaFisica = { ...dados, id, situacao: dados.situacao ?? "Ativo" };
  salvarColecaoMock(COLECAO, registros.some((item) => item.id === id)
    ? registros.map((item) => item.id === id ? registro : item)
    : [registro, ...registros]);
  return registro;
}

export function listarPessoasFisicasAtivasParaBusca() {
  return listarPessoasFisicas().filter((item) => item.situacao === "Ativo").map((item) => ({
    id: item.id,
    nome: item.nome,
    documento: item.cpf,
    cpf: item.cpf,
    municipio: item.correspondencia.municipio,
  }));
}
