import type { ReactNode } from "react";
import { Navbar } from "../../../components/Navbar";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardProdutorProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	userName: string;
	beforeMenu: ReactNode;
	afterMenu: ReactNode;
}

export function DashboardProdutor({
	onLogout,
	onNavigate,
	categories,
	userName,
	beforeMenu,
	afterMenu,
}: DashboardProdutorProps) {
	return (
		<div className="min-h-screen bg-[#f2f3f5]">
			<Navbar
				onLogout={onLogout}
				onNavigate={onNavigate}
				currentScreen="dashboard"
			/>
			<main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-gray-900">
						Bem-vindo, {userName}
					</h1>
					<p className="mt-1 text-sm text-gray-600">
						Gerencie suas propriedades e movimentações agropecuárias.
					</p>
				</div>
				{beforeMenu}
				<DashboardMenu categoryGroups={[categories]} onNavigate={onNavigate} />
				{afterMenu}
			</main>
		</div>
	);
}
