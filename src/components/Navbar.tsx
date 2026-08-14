import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Search, LogOut, ChevronDown, Bell, X } from "lucide-react";
import logo from "../imports/logo.png";
import {
  cadastrosCategories,
  filterCategoriesByRole,
  fourthCategories,
  secondaryCategories,
  thirdCategories,
} from "../pages/Dashboard";
import { isEntryRouteAllowed, useDemoUser } from "../contexts/DemoUserContext";
import { listarPendenciasConfirmacaoGta } from "../pages/GTA/PendenciasConfirmacao/pendenciasConfirmacaoGtaData";
import {
  listarAtualizacoesCadastrais,
  PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO,
} from "../pages/Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";
import { listarPendenciasCentrais } from "../pages/GTA/PendenciasConfirmacao/pendenciasCentralData";
import { SituacaoVisualizacao } from "./SituacaoVisualizacao";

const GREEN = "#1A7A3C";

function isRouteActive(itemRoute: string, currentScreen: string) {
  const normalizeRoute = (route: string) =>
    route.replace(/^(adicionar|editar|visualizar)-/, "");

  return itemRoute === currentScreen || normalizeRoute(itemRoute) === normalizeRoute(currentScreen);
}

interface PointerPosition {
  x: number;
  y: number;
}

function isPointInsideTriangle(
  point: PointerPosition,
  start: PointerPosition,
  left: PointerPosition,
  right: PointerPosition,
) {
  const sign = (first: PointerPosition, second: PointerPosition, third: PointerPosition) =>
    (first.x - third.x) * (second.y - third.y) -
    (second.x - third.x) * (first.y - third.y);
  const sideA = sign(point, start, left);
  const sideB = sign(point, left, right);
  const sideC = sign(point, right, start);
  const hasNegative = sideA < 0 || sideB < 0 || sideC < 0;
  const hasPositive = sideA > 0 || sideB > 0 || sideC > 0;

  return !(hasNegative && hasPositive);
}

interface NavbarProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  currentScreen: string;
  /** @deprecated A Navbar agora possui uma única apresentação em todas as telas. */
  hideSearch?: boolean;
}

export function Navbar({ onLogout, onNavigate, currentScreen }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pendingCloseCleanupRef = useRef<(() => void) | null>(null);
  const { role, user } = useDemoUser();

  const cancelPendingClose = () => {
    pendingCloseCleanupRef.current?.();
    pendingCloseCleanupRef.current = null;
  };

  const closeWithSafeTriangle = (event: ReactMouseEvent<HTMLDivElement>) => {
    cancelPendingClose();

    const dropdown = dropdownRef.current;
    if (!dropdown) {
      setOpenCategory(null);
      return;
    }

    const bounds = dropdown.getBoundingClientRect();
    const start = { x: event.clientX, y: event.clientY };

    // Ao sair pelas laterais ou pela parte inferior do dropdown, fecha normalmente.
    if (start.y >= bounds.top) {
      setOpenCategory(null);
      return;
    }

    // Corredor triangular entre o ponto de saída do título e o topo do menu.
    const left = { x: bounds.left - 16, y: bounds.top + 8 };
    const right = { x: bounds.right + 16, y: bounds.top + 8 };
    let timeoutId = 0;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleMouseMove);
      if (pendingCloseCleanupRef.current === cleanup) {
        pendingCloseCleanupRef.current = null;
      }
    };
    const close = () => {
      cleanup();
      setOpenCategory(null);
    };
    const handleMouseMove = (mouseEvent: MouseEvent) => {
      const point = { x: mouseEvent.clientX, y: mouseEvent.clientY };
      const reachedDropdown =
        point.x >= bounds.left &&
        point.x <= bounds.right &&
        point.y >= bounds.top &&
        point.y <= bounds.bottom;

      if (reachedDropdown || isPointInsideTriangle(point, start, left, right)) {
        return;
      }

      close();
    };

    document.addEventListener("mousemove", handleMouseMove);
    timeoutId = window.setTimeout(close, 650);
    pendingCloseCleanupRef.current = cleanup;
  };

  const workAreaCategories = [
    ...filterCategoriesByRole(cadastrosCategories, role),
    ...filterCategoriesByRole(secondaryCategories, role),
    ...filterCategoriesByRole(thirdCategories, role),
    ...(role === "admin" ? filterCategoriesByRole(fourthCategories, role) : []),
  ];

  const allItems = workAreaCategories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.title })),
  ).filter((item) => isEntryRouteAllowed(role, item.route));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCategory(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      pendingCloseCleanupRef.current?.();
    };
  }, []);

  const filtered = search.trim()
    ? allItems.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : [];
  const totalPendencias = role === "produtor"
    ? listarPendenciasConfirmacaoGta().length +
      listarAtualizacoesCadastrais().filter(
        (atualizacao) =>
          atualizacao.produtor.documento ===
            PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO &&
          !atualizacao.concluida,
      ).length + listarPendenciasCentrais("produtor").length
    : role === "veterinario"
      ? listarPendenciasCentrais("veterinario", user?.entityId).length
      : role === "responsavel-agroindustria-integradora"
        ? listarPendenciasCentrais("lider-estabelecimento").length
        : 0;
  const abaPendenciasAtual = currentScreen.includes("rebanho")
    ? "rebanho"
    : "gta";
  const totalNotificacoes = role === "admin" ? 2 : totalPendencias;

  return (
    <>
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-6 py-3">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-3">
        
        {/* Linha Superior: Logo e Links de Navegação */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate("dashboard")}>
            <img src={logo} alt="Logo IMA" className="h-8 w-auto" />
          </div>
		  <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 pl-4">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-sm font-semibold transition"
              style={{ color: currentScreen === "dashboard" ? GREEN : "#4b5563" }}
            >
              Inicial
            </button>
            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
              {workAreaCategories.map((category) => {
                const isOpen = openCategory === category.title;
                const isActive = category.items.some((item) => isRouteActive(item.route, currentScreen));

                return (
                  <div
                    key={category.title}
                    className="relative"
                    onMouseEnter={() => {
                      cancelPendingClose();
                      setOpenCategory(category.title);
                    }}
                    onMouseLeave={closeWithSafeTriangle}
                    onFocus={() => setOpenCategory(category.title)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setOpenCategory(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      className="flex items-center gap-1 whitespace-nowrap rounded-md px-1 py-1 text-sm font-medium transition hover:bg-green-50 hover:text-[#1A7A3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]"
                      style={{ color: isOpen || isActive ? GREEN : "#4b5563" }}
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        ref={dropdownRef}
                        role="menu"
                        aria-label={`Opções de ${category.title}`}
                        className="navbar-dropdown-open absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,28rem)] w-80 overflow-y-auto rounded-lg border border-gray-200 bg-[#F7F8F7] py-1 shadow-xl before:absolute before:inset-x-0 before:-top-2 before:h-2"
                      >
                        <p className="border-b border-gray-200 bg-[#F1F3F2] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {category.title}
                        </p>
                        {category.items.map((item) => {
                          const isActiveItem = isRouteActive(item.route, currentScreen);

                          return <button
                            key={`${category.title}-${item.route}`}
                            type="button"
                            role="menuitem"
							aria-current={isActiveItem ? "page" : undefined}
                            onClick={() => {
                              onNavigate(item.route);
                              setOpenCategory(null);
                            }}
                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-green-50 hover:text-[#1A7A3C] focus-visible:bg-green-50 focus-visible:outline-none ${isActiveItem ? "bg-green-50 font-semibold text-[#1A7A3C]" : "text-gray-700"}`}
                          >
                            {item.icon && (
                              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-[#1A7A3C]">
                                {item.icon}
                              </span>
                            )}
                            <span>{item.label}</span>
                          </button>
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquise"
                className="w-full border border-gray-300 rounded-md pl-3 pr-9 py-1.5 text-sm outline-none focus:border-[#1A7A3C] focus:ring-1 focus:ring-[#1A7A3C] transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
              <Search size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: GREEN }} />

              {filtered.length > 0 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-72 overflow-y-auto text-left">
                  {filtered.map((item) => (
                    <div
                      key={item.label + item.category}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      onClick={() => {
                        if (item.route) { onNavigate(item.route); setSearch(""); }
                      }}
                    >
                      <p className="text-sm text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              {role === "produtor" || role === "veterinario" || role === "responsavel-agroindustria-integradora" ? (
                <button
                  type="button"
                  onClick={() =>
                    onNavigate("pendencias-confirmacao-gta", {
                      ...(role === "produtor" ? { aba: abaPendenciasAtual } : {}),
                    })
                  }
                  aria-label={`Abrir Central de Pendências: ${totalPendencias} pendências`}
                  title="Central de Pendências"
                  className="relative rounded-full p-1 text-gray-500 transition hover:bg-green-50 hover:text-[#1A7A3C] focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <Bell size={20} />
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#1A7A3C] px-1 text-[10px] font-bold leading-none text-white">
                    {totalPendencias}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("notificacoes-estabelecimentos")}
                  aria-label="Abrir notificações"
                  title="Notificações"
                  className="relative rounded-full p-1 text-gray-500 transition hover:bg-green-50 hover:text-[#1A7A3C] focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <Bell size={20} />
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#1A7A3C] px-1 text-[10px] font-bold leading-none text-white">
                    {totalNotificacoes}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate("meu-perfil")}
                aria-label="Abrir meu perfil"
                className="hidden rounded-md px-2 py-1 text-right transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] sm:block"
              >
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.name ?? "Usuário"}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {user?.roleLabel ?? "Perfil não selecionado"}
                </p>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-sm font-medium transition hover:opacity-80"
                style={{ color: GREEN }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
        </div>

      </div>
    </nav>
    <SituacaoVisualizacao currentScreen={currentScreen} />
    </>
  );
}
