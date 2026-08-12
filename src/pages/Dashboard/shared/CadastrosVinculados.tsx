import { ArrowRight } from "lucide-react";
import type { LinkedRegistration } from "./dashboardProfileTypes";

interface CadastrosVinculadosProps {
	title?: string;
	items: LinkedRegistration[];
	count?: number;
	limit?: number;
	onViewAll?: () => void;
	viewAllLabel?: string;
	emptyMessage?: string;
}

export function CadastrosVinculados({
	title = "Cadastros vinculados",
	items,
	count = items.length,
	limit = 2,
	onViewAll,
	viewAllLabel = "Ver todos",
	emptyMessage = "Nenhum cadastro vinculado.",
}: CadastrosVinculadosProps) {
	const visibleItems = items.slice(0, limit);

	return (
		<section className="h-full rounded-xl bg-white p-5 shadow-sm" aria-label={title}>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
				<div className="flex items-center gap-3">
					<h2 className="text-base font-semibold text-gray-800">{title}</h2>
					<span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-[#1A7A3C]">
						{count}
					</span>
				</div>
				{onViewAll && (
					<button
						type="button"
						onClick={onViewAll}
						className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:text-[#15612F]"
					>
						{viewAllLabel}
						<ArrowRight size={16} aria-hidden="true" />
					</button>
				)}
			</div>

			{visibleItems.length > 0 ? (
				<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					{visibleItems.map((item) => (
						<article
							key={item.id}
							className="group flex min-h-[184px] flex-col rounded-xl border border-gray-200 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md"
						>
							<div className="flex items-center gap-3">
								<span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAF4ED] text-[#1A7A3C] transition group-hover:scale-105">
									{item.icon}
								</span>
								<h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
							</div>

							<div className="mt-4 space-y-2">
								{item.details.map((detail) => (
									<div key={detail.id}>
										<p className="text-xs font-semibold text-gray-400">{detail.label}</p>
										<p className="mt-0.5 text-sm font-medium text-gray-600">{detail.value}</p>
									</div>
								))}
							</div>

							{item.onView && (
								<button
									type="button"
									onClick={item.onView}
									className="mt-auto pt-4 text-right text-sm font-semibold text-[#1A7A3C] opacity-80 transition hover:text-[#15612F] group-hover:opacity-100"
								>
									Visualizar
								</button>
							)}
						</article>
					))}
				</div>
			) : (
				<p className="py-8 text-center text-sm text-gray-500">{emptyMessage}</p>
			)}
		</section>
	);
}
