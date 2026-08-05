import { createContext, useContext, useState, type ReactNode } from "react";

export type DemoUserRole = "admin" | "produtor";

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
	"partilha-vacina",
	"declaracao-vacinacao",
	"lancamento-rebanho",
	"atualizacao-cadastral-rebanho",
	"emissao-gta",
	"emissao-ata",
]);

const produtorAllowedRoutes = new Set([
	"dashboard",
	"pendencias-confirmacao-gta",
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
	"emitir-emissao-gta",
	"cancelar-emissao-gta",
	"pagar-emissao-gta",
	"atualizacao-cadastral-rebanho",
	"confirmar-dados-produtor-rebanho",
	"visualizar-atualizacao-cadastral-rebanho",
	"atualizar-cadastro-rebanho",
	"visualizar-rebanho-atualizado",
]);

interface DemoUserContextValue {
	role: DemoUserRole | null;
	selectRole: (role: DemoUserRole) => void;
	clearRole: () => void;
}

const DemoUserContext = createContext<DemoUserContextValue | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<DemoUserRole | null>(null);

	return (
		<DemoUserContext.Provider
			value={{
				role,
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
	if (route === "pendencias-confirmacao-gta") {
		return role === "produtor";
	}
	return role !== "produtor" || produtorEntryRoutes.has(route);
}

export function isRouteAllowed(role: DemoUserRole | null, route: string) {
	if (route === "pendencias-confirmacao-gta") {
		return role === "produtor";
	}
	return role !== "produtor" || produtorAllowedRoutes.has(route);
}
