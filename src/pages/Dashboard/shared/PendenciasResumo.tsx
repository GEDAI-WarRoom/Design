import { ArrowRight } from "lucide-react";
import type { DashboardPendingItem } from "./dashboardProfileTypes";

interface PendenciasResumoProps {
	items: DashboardPendingItem[];
	onViewAll?: () => void;
	title?: string;
	limit?: number;
	emptyMessage?: string;
}

export function PendenciasResumo({
	items,
	onViewAll,
	title = "Pendências de confirmação",
	limit = 3,
	emptyMessage = "Nenhuma pendência de confirmação.",
}: PendenciasResumoProps) {
	const visibleItems = items.slice(0, limit);

	return (
		<section className="mb-6 rounded-xl bg-white p-6 shadow-sm" aria-label={title}>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
				<div className="flex items-center gap-3">
					<h2 className="text-base font-semibold text-gray-800">{title}</h2>
					<span className="rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">
						{items.length}
					</span>
				</div>
				{onViewAll && (
					<button type="button" onClick={onViewAll} className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:text-[#15612F]">
						Ver todas <ArrowRight size={16} aria-hidden="true" />
					</button>
				)}
			</div>

			{visibleItems.length > 0 ? (
				<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
					{visibleItems.map((item) => (
						<article key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
							<div className="flex items-center gap-3 p-4">
								<span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1A7A3C]">
									{item.icon}
								</span>
								<div className="min-w-0">
									<h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
									<p className="mt-1 text-xs text-gray-500">{item.description}</p>
								</div>
							</div>
							{item.onAction && (
								<button type="button" onClick={item.onAction} className="mt-auto h-10 bg-[#1A7A3C] text-sm font-semibold text-white transition hover:bg-[#15612F]">
									{item.actionLabel ?? "Ver detalhes"}
								</button>
							)}
						</article>
					))}
				</div>
			) : (
				<p className="mt-5 text-sm text-gray-500">{emptyMessage}</p>
			)}
		</section>
	);
}
