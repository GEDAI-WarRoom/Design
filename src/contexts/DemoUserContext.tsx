import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PROFISSIONAL_VETERINARIO_DEMONSTRACAO } from "../pages/Animal/ProfissionalAnimal/profissionalAnimalData";
import { PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO } from "../pages/Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";

export type DemoUserRole = "admin" | "produtor" | "veterinario";

export interface DemoUserIdentity {
	role: DemoUserRole;
	name: string;
	roleLabel: string;
	document?: string;
	entityId?: number;
}

export const DEMO_USERS: Record<DemoUserRole, DemoUserIdentity> = {
	admin: {
		role: "admin",
		name: "Lucas",
		roleLabel: "Administrador",
	},
	produtor: {
		role: "produtor",
		name: "Fernando",
		roleLabel: "Produtor",
		document: PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO,
	},
	veterinario: {
		role: "veterinario",
		name: PROFISSIONAL_VETERINARIO_DEMONSTRACAO.nome,
		roleLabel: "Médica Veterinária",
		document: PROFISSIONAL_VETERINARIO_DEMONSTRACAO.cpf,
		entityId: PROFISSIONAL_VETERINARIO_DEMONSTRACAO.id,
	},
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

const produtorOnlyRoutes = new Set(["pendencias-confirmacao-gta"]);

interface DemoUserContextValue {
	role: DemoUserRole | null;
	user: DemoUserIdentity | null;
	selectRole: (role: DemoUserRole) => void;
	clearRole: () => void;
}

const DemoUserContext = createContext<DemoUserContextValue | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<DemoUserRole | null>(null);
	const user = useMemo(() => (role ? DEMO_USERS[role] : null), [role]);

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
	return veterinarioEntryRoutes.has(route);
}

export function isRouteAllowed(role: DemoUserRole | null, route: string) {
	if (!role) return false;
	if (produtorOnlyRoutes.has(route)) return role === "produtor";
	if (role === "admin") return true;
	if (role === "produtor") return produtorAllowedRoutes.has(route);
	return veterinarioAllowedRoutes.has(route);
}
