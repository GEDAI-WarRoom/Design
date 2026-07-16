import { useState } from "react";
import { Search, LogOut, ChevronDown, Bell, X } from "lucide-react";
import logo from "../imports/logo.png";
import { cadastrosCategories, secondaryCategories } from "../pages/Dashboard"; 

const GREEN = "#1A7A3C";

interface NavbarProps {
  onLogout: () => void;
  onNavigate: (screen: any) => void;
  currentScreen: string;
  hideSearch?: boolean; // Nova propriedade opcional
}

export function Navbar({ onLogout, onNavigate, currentScreen, hideSearch = false }: NavbarProps) {
  const [search, setSearch] = useState("");

  const allItems = [
    ...(cadastrosCategories?.flatMap((c) => c.items.map((i) => ({ ...i, category: c.title }))) || []),
    ...(secondaryCategories?.flatMap((c) => c.items.map((i) => ({ ...i, category: c.title }))) || []),
  ];

  const filtered = search.trim()
    ? allItems.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-6 py-3">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        
        {/* Linha Superior: Logo, Notificações e Links de Navegação */}
        <div className={`flex items-center justify-between pb-2 ${hideSearch ? "" : "border-b border-gray-100"}`}>
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate("dashboard")}>
            <img src={logo} alt="Logo IMA" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: GREEN }} />
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-sm font-semibold transition"
              style={{ color: currentScreen === "dashboard" ? GREEN : "#4b5563" }}
            >
              Inicial
            </button>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800">
              <span>Cadastros</span>
              <ChevronDown size={14} />
            </div>
            
            {/* Se a busca estiver escondida, mostramos o botão Sair aqui em cima para não perder a função */}
            {hideSearch && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-sm font-medium transition hover:opacity-80 border-l border-gray-200 pl-4"
                style={{ color: GREEN }}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </div>

        {/* Linha Inferior: Só renderiza se hideSearch for FALSO (ou seja, no Dashboard) */}
        {!hideSearch && (
          <div className="flex items-center justify-between gap-4 w-full animate-fadeIn">
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
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">Lucas</p>
                <p className="text-xs text-gray-400 leading-tight">Funcionário(a) IMA</p>
              </div>
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
        )}

      </div>
    </nav>
  );
}