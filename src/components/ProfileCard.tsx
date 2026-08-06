import type { ReactNode } from "react";

export interface ProfileCardDetail {
  label: string;
  value: ReactNode;
}

export interface ProfileCardProps {
  name: string;
  subtitle?: ReactNode;
  status?: ReactNode;
  statusLabel?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: ReactNode;
  showActiveIndicator?: boolean;
  details?: ProfileCardDetail[];
  highlights?: string[];
  highlightsTitle?: string;
  emptyHighlightsMessage?: string;
  ariaLabel?: string;
  className?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}

function ProfileDetail({ label, value }: ProfileCardDetail) {
  return (
    <div className="min-w-0 px-0 py-3 sm:px-4 sm:py-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-0.5 break-words text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export function ProfileCard({
  name,
  subtitle,
  status,
  statusLabel = "Situação",
  avatarSrc,
  avatarAlt,
  avatarFallback,
  showActiveIndicator = false,
  details = [],
  highlights,
  highlightsTitle = "Destaques",
  emptyHighlightsMessage = "Nenhum destaque informado.",
  ariaLabel = "Perfil",
  className = "",
}: ProfileCardProps) {
  const detailColumns =
    details.length <= 1
      ? "sm:grid-cols-1"
      : details.length === 2
        ? "sm:grid-cols-2"
        : details.length === 3
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      className={`w-full overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <div className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-4 md:w-[280px] md:flex-shrink-0">
            <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF2F1] text-sm font-semibold text-[#1A7A3C] ring-4 ring-gray-50">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={avatarAlt ?? `Foto de ${name}`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                avatarFallback ?? <span aria-hidden="true">{getInitials(name)}</span>
              )}
              {showActiveIndicator && (
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22A447]"
                  aria-hidden="true"
                />
              )}
            </span>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-gray-900">{name}</p>
              {subtitle && <div className="mt-0.5 text-sm text-gray-500">{subtitle}</div>}
              {status && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {statusLabel}: <span className="font-semibold text-[#1A7A3C]">{status}</span>
                </p>
              )}
            </div>
          </div>

          {details.length > 0 && (
            <div
              className={`grid min-w-0 flex-1 grid-cols-1 divide-y divide-gray-100 border-t border-gray-200 pt-3 sm:divide-x sm:divide-y-0 md:border-l md:border-t-0 md:py-2 md:pl-1 ${detailColumns}`}
            >
              {details.map((detail) => (
                <ProfileDetail key={detail.label} {...detail} />
              ))}
            </div>
          )}
        </div>

        {highlights && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700">{highlightsTitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {highlights.length > 0 ? (
                highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-gray-500"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 flex-shrink-0 rounded-full bg-green-300"
                    />
                    {highlight}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">{emptyHighlightsMessage}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
