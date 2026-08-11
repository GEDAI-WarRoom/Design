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
	pessoaFisicaId?: number;
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
			pessoaFisicaId: perfil.pessoaFisicaId,
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
	"pendencias-confirmacao-gta",
	"visualizar-revendedora-agropecuario",
	"visualizar-unidade-consolidacao",
]);

const liderEstabelecimentoEntryRoutes = new Set([
	"pendencias-confirmacao-gta",
	"pessoa-fisica",
	"pessoa-juridica",
	"agroindustrial-sie",
	"integradora-cooperativa",
	"revendedora-animais",
	"revendedora-agropecuario",
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
	"visualizar-estabelecimento-poa",
	"editar-estabelecimento-poa",
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

const produtorOnlyRoutes = new Set<string>();

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
			pessoaFisicaId: perfil.pessoaFisicaId,
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
	if (role === "produtor") return produtorEntryRoutes.has(route);
	if (role === "veterinario") return veterinarioEntryRoutes.has(route);
	return liderEstabelecimentoEntryRoutes.has(route);
}

export function isRouteAllowed(role: DemoUserRole | null, route: string) {
	if (!role) return false;
	if (produtorOnlyRoutes.has(route)) return role === "produtor";
	if (role === "admin") return true;
	if (role === "produtor") return produtorAllowedRoutes.has(route);
	if (role === "veterinario") return veterinarioAllowedRoutes.has(route);
	return liderEstabelecimentoAllowedRoutes.has(route);
}
