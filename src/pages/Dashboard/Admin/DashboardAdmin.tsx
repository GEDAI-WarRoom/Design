import { Navbar } from "../../../components/Navbar";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardAdminProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categoryGroups: MenuCategory[][];
	controlCategories: MenuCategory[];
}

export function DashboardAdmin({
	onLogout,
	onNavigate,
	categoryGroups,
	controlCategories,
}: DashboardAdminProps) {
	return (
		<div className="min-h-screen bg-[#f2f3f5]">
			<Navbar
				onLogout={onLogout}
				onNavigate={onNavigate}
				currentScreen="dashboard"
			/>
			<main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
				<DashboardMenu
					categoryGroups={categoryGroups}
					controlCategories={controlCategories}
					onNavigate={onNavigate}
				/>
			</main>
		</div>
	);
}
