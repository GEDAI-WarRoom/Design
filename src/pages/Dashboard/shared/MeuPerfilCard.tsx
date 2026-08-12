import type { ReactNode } from "react";
import { ClipboardCheck, Pencil } from "lucide-react";
import type {
	DashboardProfileDetail,
	DashboardProfileHighlight,
} from "./dashboardProfileTypes";

interface MeuPerfilCardProps {
	name: string;
	roleLabel: ReactNode;
	avatarSrc?: string;
	avatarAlt?: string;
	avatarFallback?: ReactNode;
	statusLabel?: string;
	details: DashboardProfileDetail[];
	highlights?: DashboardProfileHighlight[];
	highlightsTitle?: string;
	onEdit?: () => void;
	className?: string;
}

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	return `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function MeuPerfilCard({
	name,
	roleLabel,
	avatarSrc,
	avatarAlt,
	avatarFallback,
	statusLabel = "Ativo",
	details,
	highlights = [],
	highlightsTitle = "Habilitações vigentes",
	onEdit,
	className = "",
}: MeuPerfilCardProps) {
	return (
		<section
			className={`h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`.trim()}
			aria-label="Meu perfil"
		>
			<div className="flex items-center justify-between border-b border-gray-100 bg-[#f7f8ff] px-5 py-4">
				<h2 className="text-sm font-semibold text-gray-900">Meu perfil</h2>
				<span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
					● {statusLabel}
				</span>
			</div>

			<div className="p-5 text-center">
				<div className="relative mx-auto h-16 w-16">
					<span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#EEF2F1] text-base font-semibold text-[#1A7A3C] ring-4 ring-blue-50">
						{avatarSrc ? (
							<img
								src={avatarSrc}
								alt={avatarAlt ?? `Foto de ${name}`}
								className="h-full w-full object-cover"
							/>
						) : (
							avatarFallback ?? <span aria-hidden="true">{getInitials(name)}</span>
						)}
					</span>
					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1A7A3C]/70 shadow-sm transition hover:bg-green-50 hover:text-[#1A7A3C]"
							title="Editar perfil"
							aria-label="Editar perfil"
						>
							<Pencil size={10} />
						</button>
					)}
				</div>
				<h3 className="mt-3 text-base font-semibold text-gray-900">{name}</h3>
				<p className="text-xs text-gray-600">{roleLabel}</p>

				<div className="mt-5 text-left text-xs">
					{details.map((detail) => (
						<div
							key={detail.id}
							className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5"
						>
							<span className="text-gray-500">{detail.label}</span>
							<span className="text-right font-semibold text-gray-800">
								{detail.value}
							</span>
						</div>
					))}
				</div>

				{highlights.length > 0 && (
					<div className="mt-5 border-t border-gray-100 pt-4 text-left">
					<h2 className="text-xs font-semibold text-gray-700">{highlightsTitle}</h2>
						<div className="mt-3 flex flex-col gap-2">
							{highlights.map((highlight) => (
								<div
									key={highlight.id}
									className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-gray-800"
								>
									<span className="text-[#1A7A3C]">
										{highlight.icon ?? <ClipboardCheck size={14} />}
									</span>
									{highlight.label}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
