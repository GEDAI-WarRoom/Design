import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface ProfileCardDetail {
  label: string;
  value: ReactNode;
}

export interface ProfileCardTab {
  id: string;
  label: ReactNode;
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
  tabs?: ProfileCardTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  tabsAriaLabel?: string;
  maxVisibleTabs?: number;
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
  tabs = [],
  activeTabId,
  onTabChange,
  tabsAriaLabel = "Opções do perfil",
  maxVisibleTabs,
  ariaLabel = "Perfil",
  className = "",
}: ProfileCardProps) {
  const tabsId = useId();
  const overflowMenuRef = useRef<HTMLDivElement>(null);
  const overflowTriggerRef = useRef<HTMLButtonElement>(null);
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
  const selectedTabId = activeTabId ?? tabs[0]?.id;
  const visibleTabLimit = Math.max(0, maxVisibleTabs ?? tabs.length);
  const visibleTabs = tabs.slice(0, visibleTabLimit);
  const overflowTabs = tabs.slice(visibleTabLimit);
  const selectedVisibleTabIndex = visibleTabs.findIndex((tab) => tab.id === selectedTabId);
  const hasSelectedOverflowTab = overflowTabs.some((tab) => tab.id === selectedTabId);
  const detailColumns =
    details.length <= 1
      ? "sm:grid-cols-1"
      : details.length === 2
        ? "sm:grid-cols-2"
        : details.length === 3
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  useEffect(() => {
    if (!isOverflowMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!overflowMenuRef.current?.contains(event.target as Node)) {
        setIsOverflowMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOverflowMenuOpen]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    const buttons = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']") ?? [],
    );
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (currentIndex < 0) return;

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[nextIndex]?.focus();
    buttons[nextIndex]?.click();
  };

  const handleOverflowMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='menuitemradio']"),
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOverflowMenuOpen(false);
      overflowTriggerRef.current?.focus();
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (Math.max(currentIndex, 0) + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length;
    items[nextIndex]?.focus();
  };

  const selectOverflowTab = (tabId: string) => {
    onTabChange?.(tabId);
    setIsOverflowMenuOpen(false);
    overflowTriggerRef.current?.focus();
  };

  return (
    <section
      className={`w-full rounded-xl border border-green-100 bg-white shadow-sm ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {tabs.length > 0 && (
        <div className="flex border-b border-gray-200 px-4 sm:px-6">
          <div
            role="tablist"
            aria-label={tabsAriaLabel}
            className="flex min-w-0 overflow-x-auto"
          >
            {visibleTabs.map((tab, index) => {
              const isSelected = tab.id === selectedTabId;

              return (
                <button
                  key={tab.id}
                  id={`${tabsId}-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => onTabChange?.(tab.id)}
                  onKeyDown={handleTabKeyDown}
                  className={`relative flex-shrink-0 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A7A3C] ${
                    isSelected
                      ? "font-semibold text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1A7A3C]"
                      : "font-medium text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {overflowTabs.length > 0 && (
            <div ref={overflowMenuRef} className="relative flex-shrink-0">
              <button
                ref={overflowTriggerRef}
                id={`${tabsId}-more`}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOverflowMenuOpen}
                aria-controls={`${tabsId}-overflow-menu`}
                onClick={() => setIsOverflowMenuOpen((isOpen) => !isOpen)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown") return;
                  event.preventDefault();
                  setIsOverflowMenuOpen(true);
                  window.setTimeout(() => {
                    overflowMenuRef.current
                      ?.querySelector<HTMLButtonElement>("[role='menuitemradio']")
                      ?.focus();
                  });
                }}
                className={`relative flex h-full items-center gap-1 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A7A3C] ${
                  hasSelectedOverflowTab
                    ? "font-semibold text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1A7A3C]"
                    : "font-medium text-gray-500 hover:text-gray-800"
                }`}
              >
                Mais
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform ${isOverflowMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOverflowMenuOpen && (
                <div
                  id={`${tabsId}-overflow-menu`}
                  role="menu"
                  aria-label="Outros estabelecimentos vinculados"
                  onKeyDown={handleOverflowMenuKeyDown}
                  className="absolute right-0 top-full z-30 mt-1 max-h-64 w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
                >
                  {overflowTabs.map((tab) => {
                    const isSelected = tab.id === selectedTabId;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        onClick={() => selectOverflowTab(tab.id)}
                        className={`flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] ${
                          isSelected
                            ? "bg-green-50 font-semibold text-[#1A7A3C]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div
        id={tabs.length > 0 ? `${tabsId}-panel` : undefined}
        role={tabs.length > 0 ? "tabpanel" : undefined}
        aria-labelledby={
          tabs.length > 0
            ? hasSelectedOverflowTab
              ? `${tabsId}-more`
              : `${tabsId}-tab-${Math.max(selectedVisibleTabIndex, 0)}`
            : undefined
        }
        className="px-5 py-4 md:px-6"
      >
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
