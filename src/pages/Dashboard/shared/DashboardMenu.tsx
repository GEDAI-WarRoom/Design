import type { MenuCategory } from "../../Dashboard";
import { CategoryCard } from "../../Dashboard";

interface DashboardMenuProps {
	categoryGroups: MenuCategory[][];
	controlCategories?: MenuCategory[];
	onNavigate: (screen: any) => void;
}

export function DashboardMenu({
	categoryGroups,
	controlCategories = [],
	onNavigate,
}: DashboardMenuProps) {
	return (
		<>
			<div className="mb-6 flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-800">Cadastros</h2>
				{categoryGroups.map((categories, index) => (
					<div
						key={index}
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					>
						{categories.map((category) => (
							<CategoryCard
								key={category.title}
								cat={category}
								onNavigate={onNavigate}
							/>
						))}
					</div>
				))}
			</div>

			{controlCategories.length > 0 && (
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{controlCategories.map((category) => (
							<CategoryCard
								key={category.title}
								cat={category}
								onNavigate={onNavigate}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
