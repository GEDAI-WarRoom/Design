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
  Dna,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  FloatSelect,
  FloatInput,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- mock da entidade ---

const TIPOS_DESTINO = [
  { value: "Evento Pecuário", label: "Evento Pecuário" },
  { value: "Frigorífico", label: "Frigorífico" },
  {
    value: "Estabelecimento Agropecuário",
    label: "Estabelecimento Agropecuário",
  },
  { value: "Pesagem", label: "Pesagem" },
  {
    value: "Revendedora de Animais Vivos",
    label: "Revendedora de Animais Vivos",
  },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

const ESPECIES_MOCK = [
  {
    id: 1,
    codigo: "ESP-001",
    nome: "Bovino",
    grupo: "Bovídeos",
  },
  {
    id: 2,
    codigo: "ESP-002",
    nome: "Bubalino",
    grupo: "Bovídeos",
  },
  {
    id: 3,
    codigo: "ESP-003",
    nome: "Equino",
    grupo: "Equídeos",
  },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  {
    id: 5,
    codigo: "ESP-005",
    nome: "Peixe Redondo",
    grupo: "Peixes",
  },
  { id: 6, codigo: "ESP-006", nome: "Galinha", grupo: "Aves" },
];

interface FinalidadeTransito {
  id: number;
  finalidade: string;
  tipoProcedencia: string;
  tipoDestino: string;
  especies: {
    id: number;
    codigo: string;
    nome: string;
    grupo: string;
  }[];
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const FINALIDADES_MOCK: FinalidadeTransito[] = [
  {
    id: 1,
    finalidade: "Abate",
    tipoProcedencia: "Frigorífico",
    tipoDestino: "Frigorífico",
    especies: [ESPECIES_MOCK[0]],
    situacao: "Ativo",
  },
  {
    id: 2,
    finalidade: "Pesagem",
    tipoProcedencia: "Pesagem",
    tipoDestino: "Pesagem",
    especies: [ESPECIES_MOCK[1]],
    situacao: "Ativo",
  },
  {
    id: 3,
    finalidade: "Feira",
    tipoProcedencia: "Evento Pecuário",
    tipoDestino: "Evento Pecuário",
    especies: [ESPECIES_MOCK[2]],
    situacao: "Suspenso",
  },
  {
    id: 4,
    finalidade: "Leilão",
    tipoProcedencia: "Revendedora de Animais Vivos",
    tipoDestino: "Revendedora de Animais Vivos",
    especies: [ESPECIES_MOCK[3]],
    situacao: "Inativo",
  },
  {
    id: 5,
    finalidade: "Exposição",
    tipoProcedencia: "Evento Pecuário",
    tipoDestino: "Evento Pecuário",
    especies: [ESPECIES_MOCK[4]],
    situacao: "Ativo",
  },
  {
    id: 6,
    finalidade: "Recria",
    tipoProcedencia: "Estabelecimento Agropecuário",
    tipoDestino: "Estabelecimento Agropecuário",
    especies: [ESPECIES_MOCK[5]],
    situacao: "Ativo",
  },
];

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

export function FinalidadeTransitoPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [finalidade, setFinalidade] = useState("");
  const [tipoDestino, setTipoDestino] = useState("");
  const [situacao, setSituacao] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [focusFinalidade, setFocusFinalidade] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [erroEspecie, setErroEspecie] = useState(false);
  const perPage = 10;

  const temFiltroAtivo =
    finalidade.trim() !== "" ||
    tipoDestino !== "" ||
    situacao !== "";

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = FINALIDADES_MOCK.filter((f) => {
    const matchFinalidade =
      finalidade.trim() === "" ||
      f.finalidade
        .toLowerCase()
        .includes(finalidade.trim().toLowerCase());
    const matchTipoDestino =
      tipoDestino === "" || f.tipoDestino === tipoDestino;
    const matchSituacao =
      situacao === "" || f.situacao === situacao;
    return matchFinalidade && matchTipoDestino && matchSituacao;
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

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="finalidade-transito"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* --- topo da pagina --- */}
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
              Finalidade de Trânsito
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-finalidade-transito")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* --- container branco unico (engloba filtros, mensagens e tabelas) --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* --- barra superior do filtro (busca rapida e botao de expansao) --- */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusFinalidade || finalidade ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Finalidade de Trânsito
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={finalidade}
                  onFocus={() => setFocusFinalidade(true)}
                  onBlur={() => setFocusFinalidade(false)}
                  onChange={(e) =>
                    setFinalidade(e.target.value)
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

          {/* --- filtros internos avancados --- */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                

                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Tipo de Procedência"
                    value={tipoDestino}
                    onChange={setTipoDestino}
                    options={TIPOS_DESTINO}
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Tipo de Destino"
                    value={tipoDestino}
                    onChange={setTipoDestino}
                    options={TIPOS_DESTINO}
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Espécie"
                    placeholder="Buscar por nome da espécie"
                    value={especie ? especie.nome : ""}
                    data={ESPECIES_MOCK}
                    searchKeys={["nome", "grupo"]}
                    columns={[
                      { label: "Espécie", key: "nome" },
                      { label: "Grupo", key: "grupo" },
                    ]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Busque por uma espécie cadastrada:"
                    onChange={(ent) => {
                      setEspecie(ent);
                      setErroEspecie(false);
                    }}
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

                {/* --- botao pesquisar compacto --- */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>
            </div>
          )}

          {/* --- chips de filtros ativos --- */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {finalidade.trim() && (
                <Chip
                  label={`Finalidade: ${finalidade}`}
                  onRemove={() => setFinalidade("")}
                />
              )}
              {tipoDestino && (
                <Chip
                  label={`Tipo de Destino: ${tipoDestino}`}
                  onRemove={() => setTipoDestino("")}
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

          {/* --- linha divisoria entre filtros e resultados (aparece apos primeira busca) --- */}
          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* --- area de resultados (dentro do mesmo card branco) --- */}
          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por finalidade de trânsito utilizando o campo de busca e os filtros acima.
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
                        Finalidade de Trânsito
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Tipo de Procedência
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Tipo de Destino
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Espécie
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.finalidade}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.tipoProcedencia}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.tipoDestino}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.especies.at(0)?.nome || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {f.situacao}
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

              {/* --- paginacao --- */}
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