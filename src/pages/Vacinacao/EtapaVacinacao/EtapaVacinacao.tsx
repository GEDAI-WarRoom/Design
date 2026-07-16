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
  CircleDot,
  CheckCircle2,
  Lock,
  FlaskConical,
  Sprout,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Dna
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { DoencaInput, EntitySearchInput,  DynamicListWrapper } from "../../../components/ui/EntitySearch";


const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE
// ==========================================================
const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", especies: ["Bovino", "Bubalino"] },
  { id: 2, codigo: "D-002", nome: "Febre Aftosa", especies: ["Bovino", "Bubalino", "Suíno"] },
  { id: 3, codigo: "D-003", nome: "Raiva", especies: ["Bovino", "Equino"] },
];

const SITUACOES = [
  { value: "Aberta", label: "Aberta" },
  { value: "Criada", label: "Criada" },
  { value: "Finalizada", label: "Finalizada" },
];

// ==========================================================
// RESULTADOS (mock)
// ==========================================================
interface Etapa {
  id: number;
  codigo: string;
  especies: string[];
  doencas: string[];
  dataInicio: string; // ISO
  dataFim: string;    // ISO
  situacao: "Aberta" | "Criada" | "Finalizada";
}
const ETAPAS_MOCK: Etapa[] = [
  { id: 1, codigo: "2026/01", especies: ["Bovino", "Bubalino"], doencas: ["Brucelose"], dataInicio: "2026-02-11", dataFim: "2026-04-12", situacao: "Aberta" },
  { id: 2, codigo: "2026/02", especies: ["Bovino", "Bubalino", "Suíno"], doencas: ["Febre Aftosa"], dataInicio: "2026-05-01", dataFim: "2026-06-30", situacao: "Criada" },
  { id: 3, codigo: "2025/03", especies: ["Bovino", "Equino"], doencas: ["Raiva"], dataInicio: "2025-09-01", dataFim: "2025-10-15", situacao: "Finalizada" },
];

// ==========================================================
// HELPERS
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Etapa["situacao"] }) {
  const map = {
    Aberta: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: CircleDot },
    Criada: { bg: "#EAF2FE", border: "#B6D4FB", text: "#1351B4", Icon: Lock },
    Finalizada: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: CheckCircle2 },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={2.5} />
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

interface SortState { key: string | null; dir: "asc" | "desc" }
function SortableTh({ label, colKey, sort, onSort }: { label: string; colKey: string; sort: SortState; onSort: (k: string) => void }) {
  const active = sort.key === colKey;
  return (
    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
      <button type="button" onClick={() => onSort(colKey)} className="inline-flex items-center gap-1 hover:text-gray-900 transition">
        {label}
        {!active && <ChevronsUpDown size={13} className="text-gray-300" />}
        {active && sort.dir === "asc" && <ChevronUp size={13} style={{ color: GREEN }} />}
        {active && sort.dir === "desc" && <ChevronDown size={13} style={{ color: GREEN }} />}
      </button>
    </th>
  );
}

const fmtData = (iso: string) => {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

// ==========================================================
// PÁGINA: BUSCAR ETAPA DE VACINAÇÃO (US0V6 - AC1/AC2)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EtapaVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  // Campo de busca principal: Código (Ano/Sequencial)
  const [codigo, setCodigo] = useState("");
  // Filtros
  const [doenca, setDoenca] = useState<any | null>(null);
  const [especie, setEspecie] = useState("");
  const [situacao, setSituacao] = useState("");

  // UI
  const [showFilters, setShowFilters] = useState(false);
  const [focusCodigo, setFocusCodigo] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Espécies disponíveis dependem da doença selecionada
  const especiesDisponiveis = (doenca?.especies ?? []).map((e: string) => ({ value: e, label: e }));

  const algumFiltroPreenchido = codigo.trim() !== "" || !!doenca || especie !== "" || situacao !== "";

  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (key: string) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  // ---- Filtragem ----
  const filtrados = ETAPAS_MOCK.filter((e) => {
    const matchCodigo = codigo === "" || e.codigo.includes(codigo);
    const matchDoenca = !doenca || e.doencas.includes(doenca.nome);
    const matchEspecie = especie === "" || e.especies.includes(especie);
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchCodigo && matchDoenca && matchEspecie && matchSituacao;
  });

  // ---- Ordenação ----
  const sortValue = (e: Etapa, key: string) => {
    switch (key) {
      case "codigo": return e.codigo;
      case "especie": return e.especies.join(", ");
      case "doenca": return e.doencas.join(", ");
      case "inicio": return e.dataInicio;
      case "fim": return e.dataFim;
      case "situacao": return e.situacao;
      default: return "";
    }
  };
  const ordenados = [...filtrados].sort((a, b) => {
    if (!sort.key) return 0;
    const va = sortValue(a, sort.key), vb = sortValue(b, sort.key);
    return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  // ---- Paginação ----
  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = doenca || especie || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Etapa de Vacinação</h1>
            <button onClick={() => onNavigate("adicionar-etapa-vacinacao")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* ÚNICO card branco: busca + filtros + tabela */}
        <div className="bg-white rounded-xl shadow-sm mt-5">
          {/* Busca + filtros */}
          <div className="p-6">
            <div className="flex gap-3 items-stretch w-full">
              <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${
                erroValidacao && !algumFiltroPreenchido
                  ? "border-red-400 ring-1 ring-red-300"
                  : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"
              }`}>
                <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusCodigo || codigo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                  Código (Ano/Sequencial)
                </label>
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    maxLength={7}
                    placeholder={focusCodigo ? "2026/01" : ""}
                    value={codigo}
                    onFocus={() => setFocusCodigo(true)}
                    onBlur={() => setFocusCodigo(false)}
                    onChange={(e) => { setCodigo(e.target.value); if (erroValidacao) setErroValidacao(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 placeholder:text-gray-300"
                  />
                  <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
                </div>
              </div>

              <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Doença */}
                  <EntitySearchInput
                    label="Doença"
                    placeholder="Buscar pelo nome da doença."
                    value={doenca ? doenca.nome : ""}
                    data={DOENCAS_MOCK}
                    searchKeys={["nome"]}
                    columns={[ { label: "Doença", key: "nome" }]}
                    icon={<FlaskConical size={18} color={GREEN} />}
                    title="Buscar Doença"
                    subtitle="Busque por uma doença cadastrada:"
                    onChange={(ent) => { setDoenca(ent); setEspecie(""); }}
                  />

                  {/* Espécie — disponível quando a doença é preenchida */}
                   <EntitySearchInput
                    label="Espécie"
                    placeholder="Buscar pelo nome da espécie."
                    value={especie}
                    data={especiesDisponiveis.map((o, i) => ({ id: i, nome: o.value }))}
                    searchKeys={["nome"]}
                    columns={[{ label: "Espécie", key: "nome" }]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Busque por uma doença cadastrada:"
                    disabled={!doenca}
                    onChange={(ent: any) => setEspecie(ent?.nome ?? "")}
                  />

                  {/* Situação — campo padrão, no mesmo grid */}
                  <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />

                   <button onClick={handlePesquisar} className="h-11 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>Pesquisar</button>

                </div>


              </div>
            )}

            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3">Selecione ao menos um filtro ou preencha o campo de busca para pesquisar.</p>
            )}

            {temFiltroAtivo && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => { setDoenca(null); setEspecie(""); }} />}
                {especie && <Chip label={`Espécie: ${especie}`} onRemove={() => setEspecie("")} />}
                {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              </div>
            )}
          </div>

          {/* Divisória interna + resultados (MESMO card) */}
          {hasSearched && (
            <>
              <hr className="border-gray-100" />
              {total === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">

                        <thead>
    <tr className="bg-gray-30 border-b border-gray-100">
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">Código</th>
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[500px]">Espécie</th>
      <th className="text-left px-4 py-3 font-semibold uppercase  text-gray-600 whitespace-normal max-w-[150px]">Produtores</th>
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[150px]">Doença</th>
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[200px]">Data de Início</th>
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[120px]">Data do Fim</th>
      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">Situação</th>
      <th className="px-4 py-3 w-[80px]" />
    </tr>
  </thead>

                                          <tbody>
                        {pagina.map((e) => (
                          <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.codigo}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.especies.join(", ")}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.doencas.join(", ")}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtData(e.dataInicio)}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtData(e.dataFim)}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.situacao} </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 justify-end">
                                <button onClick={() => onNavigate("visualizar-etapa-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                                <button onClick={() => onNavigate("editar-etapa-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                    <span>Itens por página: {perPage}</span>
                    <div className="flex items-center gap-4">
                      <span>{inicio} - {fim} de {total}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Estado inicial (dentro do mesmo card) */}
          {!hasSearched && (
            <>
              <hr className="border-gray-100" />
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Busque por uma etapa de vacinação utilizando o campo de busca e os filtros acima.</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}