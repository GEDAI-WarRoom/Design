import type { ReactNode } from "react";
import { Navbar } from "../../../components/Navbar";
import { DashboardMenu } from "./DashboardMenu";
import type { MenuCategory } from "./dashboardTypes";

interface DashboardPerfilPadraoProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	userName: string;
	description: string;
	news: ReactNode;
	profile: ReactNode;
	linkedContent: ReactNode;
	pendingContent: ReactNode;
	categories: MenuCategory[];
	beforeNews?: ReactNode;
	afterMenu?: ReactNode;
}

export function DashboardPerfilPadrao({
	onLogout,
	onNavigate,
	userName,
	description,
	news,
	profile,
	linkedContent,
	pendingContent,
	categories,
	beforeNews,
	afterMenu,
}: DashboardPerfilPadraoProps) {
	return (
		<div className="min-h-screen bg-[#f2f3f5]">
			<Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="dashboard" />
			<main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">Bem-vindo(a), {userName}</h1>
					<p className="mt-1 text-sm text-gray-600">{description}</p>
				</div>
				{beforeNews}
				{news}
				<div className="mb-6 grid grid-cols-1 gap-5 lg:items-stretch lg:grid-cols-[280px_1fr]">
					{profile}
					{linkedContent}
				</div>
				{pendingContent}
				<DashboardMenu title="Área de trabalho" categoryGroups={[categories]} onNavigate={onNavigate} />
				{afterMenu}
			</main>
		</div>
	);
}
