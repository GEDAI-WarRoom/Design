import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useMockDatabaseRevision } from "../mocks/useMockDatabase";
import {
	PERFIS_USUARIO_INICIAIS,
	listarPerfisUsuario,
	type PerfilUsuarioRole,
} from "../pages/Geral/MeuPerfil/meuPerfilData";

export type DemoUserRole = PerfilUsuarioRole;

export interface DemoUserIdentity {
	role: DemoUserRole;
	name: string;
	roleLabel: string;
	document?: string;
	entityId?: number;
	email?: string;
	phone?: string;
	avatarDataUrl?: string;
	acceptedTerms: boolean;
}

export const DEMO_USERS = PERFIS_USUARIO_INICIAIS.reduce(
	(usuarios, perfil) => {
		usuarios[perfil.role] = {
			role: perfil.role,
			name: perfil.nome,
			roleLabel: perfil.perfil,
			document: perfil.documento,
			entityId: perfil.entityId,
			email: perfil.email,
			phone: perfil.telefone,
			avatarDataUrl: perfil.avatarDataUrl,
			acceptedTerms: perfil.aceitouTermos,
		};
		return usuarios;
	},
	{} as Record<DemoUserRole, DemoUserIdentity>,
);

DEMO_USERS["representante-agroindustria"] = {
	role: "representante-agroindustria", name: "Carlos Henrique",
	roleLabel: "Representante de Agroindústria", document: "23.456.789/0001-10",
	entityId: 2, email: "representante.agroindustria@email.com", phone: "(31) 99111-2233", acceptedTerms: false,
};
DEMO_USERS["representante-integradora"] = {
	role: "representante-integradora", name: "Ana Paula Mendes",
	roleLabel: "Representante de Integradora", document: "34.567.890/0001-21",
	entityId: 4, email: "representante.integradora@email.com", phone: "(31) 99222-3344", acceptedTerms: false,
};

const produtorEntryRoutes = new Set([
	"pessoa-fisica",
	"pessoa-juridica",
	"estabelecimento-agropecuario",
	"venda-propriedade",
	"exploracao-pecuaria",
	"pendencias-confirmacao-gta",
	"nucleo-producao",
	"passaporte-equestre",
	"unidade-consolidacao",
	"cultura",
	"praga",
	"profissional-vegetal",
	"profissional-oficial",
	"lote-pagamento",
	"partilha-vacina",
	"declaracao-vacinacao",
	"lancamento-rebanho",
	"atualizacao-cadastral-rebanho",
	"emissao-gta",
	"emissao-ata",
	"finalidade-transito",
]);

const produtorAllowedRoutes = new Set([
	"dashboard",
	"meu-perfil",
	...produtorEntryRoutes,
	"adicionar-pessoa-fisica",
	"visualizar-pessoa-fisica",
	"editar-pessoa-fisica",
	"adicionar-pessoa-juridica",
	"visualizar-pessoa-juridica",
	"editar-pessoa-juridica",
	"adicionar-estabelecimento-agropecuario",
	"editar-estabelecimento-agropecuario",
	"visualizar-estabelecimento-agropecuario",
	"adicionar-venda-propriedade",
	"visualizar-venda-propriedade",
	"editar-venda-propriedade",
	"adicionar-exploracao-pecuaria",
	"visualizar-exploracao-pecuaria",
	"adicionar-nucleo-producao",
	"visualizar-nucleo-producao",
	"editar-nucleo-producao",
	"adicionar-passaporte-equestre",
	"visualizar-passaporte-equestre",
	"editar-passaporte-equestre",
	"adicionar-unidade-consolidacao",
	"visualizar-unidade-consolidacao",
	"editar-unidade-consolidacao",
	"adicionar-cultura",
	"visualizar-cultura",
	"editar-cultura",
	"adicionar-praga",
	"visualizar-praga",
	"editar-praga",
	"adicionar-profissional-vegetal",
	"visualizar-profissional-vegetal",
	"editar-profissional-vegetal",
	"adicionar-profissional-oficial",
	"visualizar-profissional-oficial",
	"editar-profissional-oficial",
	"adicionar-lote-pagamento",
	"visualizar-lote-pagamento",
	"editar-lote-pagamento",
	"visualizar-documento-lote-pagamento",
	"visualizar-dae-lote-pagamento",
	"adicionar-partilha-vacina",
	"visualizar-partilha-vacina",
	"editar-partilha-vacina",
	"adicionar-declaracao-vacinacao",
	"visualizar-declaracao-vacinacao",
	"editar-declaracao-vacinacao",
	"ajuste-rebanho",
	"adicionar-ajuste-rebanho",
	"visualizar-ajuste-rebanho",
	"editar-ajuste-rebanho",
	"adicionar-lancamento-rebanho",
	"visualizar-lancamento-rebanho",
	"editar-lancamento-rebanho",
	"adicionar-emissao-ata",
	"editar-emissao-ata",
	"visualizar-emissao-ata",
	"adicionar-emissao-gta",
	"visualizar-emissao-gta",
	"documento-emissao-gta",
	"emitir-emissao-gta",
	"cancelar-emissao-gta",
	"pagar-emissao-gta",
	"adicionar-finalidade-transito",
	"visualizar-finalidade-transito",
	"editar-finalidade-transito",
	"confirmar-dados-produtor-rebanho",
	"visualizar-atualizacao-cadastral-rebanho",
	"atualizar-cadastro-rebanho",
	"visualizar-rebanho-atualizado",
]);

const veterinarioEntryRoutes = new Set([
	"declaracao-vacinacao",
	"partilha-vacina",
	"vacinador",
	"atestado-exame",
	"local-realizacao-exame",
	"emissao-gta",
]);

const veterinarioAllowedRoutes = new Set([
	"dashboard",
	"meu-perfil",
	...veterinarioEntryRoutes,
	"adicionar-declaracao-vacinacao",
	"visualizar-declaracao-vacinacao",
	"editar-declaracao-vacinacao",
	"adicionar-partilha-vacina",
	"visualizar-partilha-vacina",
	"editar-partilha-vacina",
	"adicionar-vacinador",
	"visualizar-vacinador-brucelose",
	"editar-vacinador-brucelose",
	"adicionar-atestado-exame",
	"visualizar-atestado-exame",
	"editar-atestado-exame",
	"visualizar-pessoa-fisica",
	"adicionar-local-realizacao-exame",
	"visualizar-local-realizacao-exame",
	"editar-local-realizacao-exame",
	"adicionar-emissao-gta",
	"visualizar-emissao-gta",
	"documento-emissao-gta",
	"emitir-emissao-gta",
	"cancelar-emissao-gta",
	"pagar-emissao-gta",
]);

const liderEstabelecimentoEntryRoutes = new Set([
	"pessoa-fisica",
	"pessoa-juridica",
	"agroindustrial-sie",
	"integradora-cooperativa",
	"revendedora-animais",
	"revendedora-agropecuario",
	"boletos-gta",
]);

const liderEstabelecimentoAllowedRoutes = new Set([
	"dashboard",
	"meu-perfil",
	...liderEstabelecimentoEntryRoutes,
	"adicionar-pessoa-fisica",
	"visualizar-pessoa-fisica",
	"editar-pessoa-fisica",
	"adicionar-pessoa-juridica",
	"visualizar-pessoa-juridica",
	"editar-pessoa-juridica",
	"adicionar-agroindustrial-sie",
	"visualizar-agroindustrial-sie",
	"editar-agroindustrial-sie",
	"adicionar-integradora-cooperativa",
	"visualizar-integradora-cooperativa",
	"editar-integradora-cooperativa",
	"adicionar-revendedora-animais",
	"visualizar-revendedora-animais-vivos",
	"editar-revendedora-animais",
	"adicionar-revendedora-agropecuario",
	"visualizar-revendedora-agropecuario",
	"editar-revendedora-agropecuario",
]);

const produtorOnlyRoutes = new Set(["pendencias-confirmacao-gta"]);
const representanteRoutes = new Set([
	"boletos-gta",
	"visualizar-recolhimento-mensal-gta",
	"visualizar-boleto-recolhimento-gta",
	"visualizar-dae-recolhimento-gta",
]);

interface DemoUserContextValue {
	role: DemoUserRole | null;
	user: DemoUserIdentity | null;
	selectRole: (role: DemoUserRole) => void;
	clearRole: () => void;
}

const DemoUserContext = createContext<DemoUserContextValue | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<DemoUserRole | null>(null);
	const databaseRevision = useMockDatabaseRevision();
	const perfis = useMemo(() => listarPerfisUsuario(), [databaseRevision]);
	const user = useMemo(() => {
		if (!role) return null;
		const perfil = perfis.find((item) => item.role === role);
		if (!perfil) return DEMO_USERS[role];
		return {
			role: perfil.role,
			name: perfil.nome,
			roleLabel: perfil.perfil,
			document: perfil.documento,
			entityId: perfil.entityId,
			email: perfil.email,
			phone: perfil.telefone,
			avatarDataUrl: perfil.avatarDataUrl,
			acceptedTerms: perfil.aceitouTermos,
		};
	}, [perfis, role]);

	return (
		<DemoUserContext.Provider
			value={{
				role,
				user,
				selectRole: setRole,
				clearRole: () => setRole(null),
			}}
		>
			{children}
		</DemoUserContext.Provider>
	);
}

export function useDemoUser() {
	const context = useContext(DemoUserContext);

	if (!context) {
		throw new Error("useDemoUser deve ser usado dentro de DemoUserProvider");
	}

	return context;
}

export function isEntryRouteAllowed(role: DemoUserRole | null, route: string) {
	if (!role) return false;
	if (produtorOnlyRoutes.has(route)) return role === "produtor";
	if (role === "admin") return true;
	if (role === "representante-agroindustria" || role === "representante-integradora") return route === "boletos-gta";
	if (role === "produtor") return produtorEntryRoutes.has(route);
	if (role === "veterinario") return veterinarioEntryRoutes.has(route);
	return liderEstabelecimentoEntryRoutes.has(route);
}

export function isRouteAllowed(role: DemoUserRole | null, route: string) {
	if (!role) return false;
	if (produtorOnlyRoutes.has(route)) return role === "produtor";
	if (role === "admin") return true;
	if (role === "representante-agroindustria" || role === "representante-integradora") return route === "dashboard" || route === "meu-perfil" || representanteRoutes.has(route);
	if (role === "produtor") return produtorAllowedRoutes.has(route);
	if (role === "veterinario") return veterinarioAllowedRoutes.has(route);
	return liderEstabelecimentoAllowedRoutes.has(route);
}
