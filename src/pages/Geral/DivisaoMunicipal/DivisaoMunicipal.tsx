import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye as ViewIcon,
  Pencil,
  MapPin,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS (substituir por API)
// ==========================================================
const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const MUNICIPIOS_POR_ESTADO = [
   "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const TIPOS = [
  { value: "Distrito", label: "Distrito" },
  { value: "Localidade", label: "Localidade" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// Garante que a lista passada ao FloatCombobox seja sempre de strings limpas.
const sanitizeOptions = (arr: unknown): string[] =>
  Array.isArray(arr)
    ? arr.filter((o): o is string => typeof o === "string" && o.trim() !== "")
    : [];

interface DivisaoMunicipal {
  id: number;
  nome: string;
  municipio: string;
  estado: string;
  tipo: "Distrito" | "Localidade";
  latitude: number;
  longitude: number;
  situacao: "Ativo" | "Inativo";
}

const DIVISOES_MOCK: DivisaoMunicipal[] = [
  { id: 1, nome: "Vale do Bom Jesus", municipio: "Abadia dos Dourados", estado: "Minas Gerais", tipo: "Localidade", latitude: -18.4873, longitude: -47.3925, situacao: "Ativo" },
  { id: 2, nome: "Distrito de Floresta", municipio: "Lavras", estado: "Minas Gerais", tipo: "Distrito", latitude: -21.2455, longitude: -44.9990, situacao: "Ativo" },
  { id: 3, nome: "Serra Verde", municipio: "Varginha", estado: "Minas Gerais", tipo: "Localidade", latitude: -21.5518, longitude: -45.4306, situacao: "Inativo" },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: DivisaoMunicipal["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

type SortKey = "nome" | "municipio" | "tipo" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function DivisaoMunicipalPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortAsc, setSortAsc] = useState(true);

  const estadosOptions = sanitizeOptions(ESTADOS_BR);
  const municipiosDisponiveis = sanitizeOptions(estado ? MUNICIPIOS_POR_ESTADO[estado] : []);

  const handlePesquisar = () => {
    if (busca.trim() === "") {
      setErroBusca(true);
      setHasSearched(false);
      return;
    }
    setErroBusca(false);
    setHasSearched(true);
    setPage(1);
  };

  const onChangeEstado = (v: string) => {
    setEstado(v);
    setMunicipio("");
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  // 💡 Alterado para busca exata (removidos os métodos .toLowerCase())
  const filtrados = DIVISOES_MOCK.filter((d) => {
    const termo = busca.trim();
    const matchBusca = termo === "" || (d.nome ?? "").includes(termo);
    const matchEstado = estado === "" || d.estado === estado;
    const matchMunicipio = municipio === "" || d.municipio === municipio;
    const matchTipo = tipo === "" || d.tipo === tipo;
    const matchSituacao = situacao === "" || d.situacao === situacao;
    return matchBusca && matchEstado && matchMunicipio && matchTipo && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[sortKey] ?? "");
    const vb = String(b[sortKey] ?? "");
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = busca.trim() !== "" || estado || municipio || tipo || situacao !== "Ativo";

  const colunas: { label: string; key: SortKey }[] = [
    { label: "Divisão Municipal", key: "nome" },
    { label: "Município", key: "municipio" },
    { label: "Tipo", key: "tipo" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="divisao-municipal" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Divisão Municipal</h1>
            <button onClick={() => onNavigate("adicionar-divisao-municipal")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior: Busca Principal + Ícone Expansor */}
          <div className="flex gap-3 items-stretch w-full">
            <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${erroBusca ? "border-red-400 focus-within:ring-1 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] font-medium" : "top-1/2 -translate-y-1/2 text-sm"} ${erroBusca ? "text-red-500" : "text-gray-400"}`}>
                Buscar por nome da divisão Municipal
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroBusca) setErroBusca(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Internos */}
          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full items-end">
              <FloatCombobox label="Estado" value={estado} onChange={onChangeEstado} options={estadosOptions} />

             {estado && (
              <FloatCombobox
                label="Município"
                value={municipio}
                onChange={setMunicipio}
                options={MUNICIPIOS_POR_ESTADO}
              />
            )}

              <FloatSelect label="Tipo" value={tipo} onChange={setTipo} options={TIPOS} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />

              <button
                onClick={handlePesquisar}
                className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap shadow-sm"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {/* Erro: campo de busca obrigatório */}
          {erroBusca && (
            <p className="text-sm text-red-500">Informe a divisão municipal para realizar a busca.</p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Divisão: ${busca}`} onRemove={() => setBusca("")} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => onChangeEstado("")} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => setTipo("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por divisões municipais utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {colunas.map((c) => (
                        <th
                          key={c.key}
                          onClick={() => toggleSort(c.key)}
                          className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase cursor-pointer select-none hover:text-gray-900"
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            {sortKey === c.key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                          </span>
                        </th>
                      ))}
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Localização</th>
                      <th
                        onClick={() => toggleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900"
                      >
                        <span className="inline-flex items-center gap-1">
                          Situação
                          {sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </span>
                      </th>
                      <th className="px-4 py-3 w-[110px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.municipio}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.tipo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap tabular-nums">
                          {d.latitude.toFixed(5)}, {d.longitude.toFixed(5)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("mapa-divisao-municipal", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Ver no mapa" aria-label={`Ver ${d.nome} no mapa`}><MapPin size={18} /></button>
                            <button onClick={() => onNavigate("visualizar-divisao-municipal", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${d.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-divisao-municipal", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${d.nome}`}><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} aria-label="Página anterior" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} aria-label="Próxima página" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
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