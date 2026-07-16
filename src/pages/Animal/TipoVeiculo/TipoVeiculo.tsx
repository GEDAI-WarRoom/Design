import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- tipos de veículos ---

const MEIOS_TRANSPORTE = [
  { value: "Aéreo", label: "Aéreo" },
  { value: "A Pé", label: "A Pé" },
  { value: "Ferroviário", label: "Ferroviário" },
  { value: "Marítimo/Fluvial", label: "Marítimo/Fluvial" },
  { value: "Rodoviário", label: "Rodoviário" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// --- mocks ---

interface TipoVeiculo {
  id: number;
  tipoVeiculo: string;
  meioTransporte: string;
  situacao: "Ativo" | "Inativo";
}

const TIPOS_VEICULO_MOCK: TipoVeiculo[] = [
  {
    id: 1,
    tipoVeiculo: "Caminhão Boiadeiro",
    meioTransporte: "Rodoviário",
    situacao: "Ativo",
  },
  {
    id: 2,
    tipoVeiculo: "Carreta",
    meioTransporte: "Rodoviário",
    situacao: "Ativo",
  },
  {
    id: 3,
    tipoVeiculo: "Balsa",
    meioTransporte: "Marítimo/Fluvial",
    situacao: "Ativo",
  },
  {
    id: 4,
    tipoVeiculo: "Vagão de Carga",
    meioTransporte: "Ferroviário",
    situacao: "Inativo",
  },
  {
    id: 5,
    tipoVeiculo: "Aeronave de Carga",
    meioTransporte: "Aéreo",
    situacao: "Ativo",
  },
  {
    id: 6,
    tipoVeiculo: "Condução a Pé (Tropa)",
    meioTransporte: "A Pé",
    situacao: "Inativo",
  },
];

function SituacaoBadge({
  situacao,
}: {
  situacao: TipoVeiculo["situacao"];
}) {
  const map = {
    Ativo: {
      bg: "#E6F4EA",
      border: "#A3E2B8",
      text: "#1A7A3C",
      Icon: Check,
    },
    Inativo: {
      bg: "#F3F4F6",
      border: "#E5E7EB",
      text: "#6B7280",
      Icon: Minus,
    },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
      }}
    >
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function TipoVeiculoPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [meioTransporte, setMeioTransporte] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusTipoVeiculo, setFocusTipoVeiculo] =
    useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = TIPOS_VEICULO_MOCK.filter((t) => {
    const matchTipoVeiculo =
      tipoVeiculo.trim() === "" ||
      t.tipoVeiculo
        .toLowerCase()
        .includes(tipoVeiculo.trim().toLowerCase());
    const matchMeioTransporte =
      meioTransporte === "" ||
      t.meioTransporte === meioTransporte;
    const matchSituacao =
      situacao === "" || t.situacao === situacao;
    return (
      matchTipoVeiculo && matchMeioTransporte && matchSituacao
    );
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio =
    total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo =
    meioTransporte !== "" || situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="tipo-veiculo"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Tipo de Veículo
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-tipo-veiculo")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusTipoVeiculo || tipoVeiculo
                    ? "top-1 text-[10px] text-gray-400 font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }`}
              >
                Tipo de Veículo
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={tipoVeiculo}
                  onFocus={() => setFocusTipoVeiculo(true)}
                  onBlur={() => setFocusTipoVeiculo(false)}
                  onChange={(e) =>
                    setTipoVeiculo(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handlePesquisar()
                  }
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search
                  size={15}
                  className="text-gray-400 ml-2 flex-shrink-0 mb-0.5"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm"
              style={{
                backgroundColor: showFilters
                  ? "transparent"
                  : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="animate-fadeIn flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Meio de Transporte"
                  value={meioTransporte}
                  onChange={setMeioTransporte}
                  options={MEIOS_TRANSPORTE}
                />
              </div>

              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={SITUACOES}
                />
              </div>

              <button
                onClick={handlePesquisar}
                className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {meioTransporte && (
                <Chip
                  label={`Meio de Transporte: ${meioTransporte}`}
                  onRemove={() => setMeioTransporte("")}
                />
              )}
              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por tipo de veículo utilizando o campo de
                busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Nenhum resultado foi encontrado.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Tipo de Veículo
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Meio de Transporte
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.tipoVeiculo}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.meioTransporte}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(totalPages, p + 1),
                        )
                      }
                      disabled={pageAtual === totalPages}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}