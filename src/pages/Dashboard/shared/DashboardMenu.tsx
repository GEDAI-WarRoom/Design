import type { MenuCategory } from "./dashboardTypes";

const GREEN = "#1A7A3C";

function CategoryCard({
	category,
	onNavigate,
}: {
	category: MenuCategory;
	onNavigate: (screen: any) => void;
}) {
	const itemsOrdenados = [...category.items].sort((primeiro, segundo) =>
		primeiro.label.localeCompare(segundo.label, "pt-BR"),
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="mb-1">{category.icon}</div>
			<h3 className="mb-1 text-base font-semibold text-gray-800">
				{category.title}
			</h3>
			<ul className="flex flex-col gap-1">
				{itemsOrdenados.map((item) => (
					<li key={`${category.title}-${item.route}`}>
						<button
							type="button"
							onClick={() => onNavigate(item.route)}
							className="flex items-center gap-2 py-0.5 text-left text-sm transition hover:underline"
							style={{ color: GREEN }}
						>
							{item.icon ? (
								<span className="flex-shrink-0 text-[#1A7A3C]">{item.icon}</span>
							) : (
								<span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1A7A3C]" />
							)}
							<span>{item.label}</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

interface DashboardMenuProps {
	categoryGroups: MenuCategory[][];
	controlCategories?: MenuCategory[];
	onNavigate: (screen: any) => void;
	title?: string;
}

export function DashboardMenu({
	categoryGroups,
	controlCategories = [],
	onNavigate,
	title = "Cadastros",
}: DashboardMenuProps) {
	return (
		<>
			<div className="mb-6 flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
				{categoryGroups.map((categories, index) => (
					<div
						key={index}
						className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					>
						{categories.map((category) => (
							<CategoryCard key={category.title} category={category} onNavigate={onNavigate} />
						))}
					</div>
				))}
			</div>

			{controlCategories.length > 0 && (
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{controlCategories.map((category) => (
							<CategoryCard key={category.title} category={category} onNavigate={onNavigate} />
						))}
					</div>
				</div>
			)}
		</>
	);
}
