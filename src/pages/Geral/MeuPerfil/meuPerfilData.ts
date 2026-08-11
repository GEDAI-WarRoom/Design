import {
  listarColecaoMock,
  salvarColecaoMock,
} from "../../../mocks/mockDatabase.ts";

export type PerfilUsuarioRole =
  | "admin"
  | "produtor"
  | "veterinario"
  | "responsavel-agroindustria-integradora";

export interface PerfilUsuario {
  id: PerfilUsuarioRole;
  role: PerfilUsuarioRole;
  nome: string;
  perfil: string;
  documento?: string;
  email: string;
  telefone?: string;
  pessoaFisicaId?: number;
  entityId?: number;
  avatarDataUrl?: string;
  aceitouTermos: boolean;
}

const COLECAO = "perfis-usuario";

export const PERFIS_USUARIO_INICIAIS: PerfilUsuario[] = [
  {
    id: "admin",
    role: "admin",
    nome: "Thomas Anderson",
    perfil: "Administrador",
    email: "thomas.anderson@ima.mg.gov.br",
    telefone: "(31) 3915-8000",
    pessoaFisicaId: 6,
    aceitouTermos: false,
  },
  {
    id: "produtor",
    role: "produtor",
    nome: "Fernando",
    perfil: "Produtor",
    documento: "362.778.831-19",
    email: "fernando@email.com",
    telefone: "(35) 98855-4433",
    pessoaFisicaId: 4,
    aceitouTermos: false,
  },
  {
    id: "veterinario",
    role: "veterinario",
    nome: "Eloiza Silva",
    perfil: "Médica Veterinária",
    documento: "444.009.956-40",
    email: "eloiza.silva@email.com",
    telefone: "(31) 99845-1200",
    entityId: 1,
    pessoaFisicaId: 1,
    aceitouTermos: false,
  },
  {
    id: "responsavel-agroindustria-integradora",
    role: "responsavel-agroindustria-integradora",
    nome: "Thais Lopes",
    perfil: "Responsável de Agroindústria/Integradora",
    documento: "23.456.789/0001-10",
    email: "thais.lopes@email.com",
    telefone: "(31) 99714-8802",
    entityId: 2,
    pessoaFisicaId: 5,
    aceitouTermos: false,
  },
];

export function listarPerfisUsuario() {
  const perfis = listarColecaoMock(COLECAO, PERFIS_USUARIO_INICIAIS);
  let precisaPersistir = false;

  const atualizados = perfis.map((perfil) => {
    const perfilInicial = PERFIS_USUARIO_INICIAIS.find(
      (item) => item.role === perfil.role,
    );
    if (!perfilInicial) return perfil;

    const pessoaFisicaId = perfil.pessoaFisicaId ?? perfilInicial.pessoaFisicaId;
    const entityId = perfil.entityId ?? perfilInicial.entityId;
    if (
      pessoaFisicaId === perfil.pessoaFisicaId &&
      entityId === perfil.entityId
    ) {
      return perfil;
    }

    precisaPersistir = true;
    return { ...perfil, pessoaFisicaId, entityId };
  });

  const perfisFaltantes = PERFIS_USUARIO_INICIAIS.filter(
    (perfilInicial) =>
      !atualizados.some((perfil) => perfil.role === perfilInicial.role),
  );
  if (perfisFaltantes.length) precisaPersistir = true;

  const resultado = [...atualizados, ...perfisFaltantes];
  return precisaPersistir
    ? salvarColecaoMock(COLECAO, resultado)
    : resultado;
}

export function obterPerfilUsuario(role?: PerfilUsuarioRole | null) {
  if (!role) return null;
  return listarPerfisUsuario().find((perfil) => perfil.role === role) ?? null;
}

export function atualizarPerfilUsuario(
  role: PerfilUsuarioRole,
  alteracoes: Partial<Omit<PerfilUsuario, "id" | "role">>,
) {
  const perfis = listarPerfisUsuario();
  const atual = perfis.find((perfil) => perfil.role === role);
  const perfilAtualizado: PerfilUsuario = atual
    ? { ...atual, ...alteracoes, id: role, role }
    : {
        id: role,
        role,
        nome: alteracoes.nome ?? "Usuário",
        perfil: alteracoes.perfil ?? "Perfil não informado",
        email: alteracoes.email ?? "",
        aceitouTermos: alteracoes.aceitouTermos ?? false,
        ...alteracoes,
      };

  salvarColecaoMock(
    COLECAO,
    atual
      ? perfis.map((perfil) =>
          perfil.role === role ? perfilAtualizado : perfil,
        )
      : [...perfis, perfilAtualizado],
  );
  return perfilAtualizado;
}
