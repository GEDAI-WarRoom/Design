import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Eye as ViewIcon, Pencil,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatMultiSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US052)
// ==========================================================
const FORMACOES = [
  "Médico Veterinário", "Biofísico", "Biólogo", "Bioquímico", "Biotecnólogo",
  "Engenheiro Agrícola", "Engenheiro Agrônomo", "Engenheiro de Alimentos",
  "Engenheiro de Produção", "Engenheiro Químico", "Engenheiro Sanitário",
  "Nutricionista", "Tecnólogo em Alimentos", "Zootecnista", "Outra",
].map((f) => ({ value: f, label: f }));

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const HABILITACOES = ["Emissão de GTA", "Exame de Brucelose/Tuberculose", "Exame de Mormo"];

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Profissional {
  id: number;
  nome: string;
  cpf: string;
  formacao: string;
  numeroConselho: string;
  servicoOficial: "Sim" | "Não";
  vacinacaoBrucelose: "Sim" | "Não";
  habilitacoes: string[];
  situacao: "Ativo" | "Inativo";
}

const PROFISSIONAIS_MOCK: Profissional[] = [
  { id: 1, nome: "Josephina Arantes", cpf: "444.009.956-40", formacao: "Médico Veterinário", numeroConselho: "512633", servicoOficial: "Sim", vacinacaoBrucelose: "Sim", habilitacoes: ["Emissão de GTA"], situacao: "Ativo" },
  { id: 2, nome: "José Aarão Neto", cpf: "555.009.956-40", formacao: "Zootecnista", numeroConselho: "778812", servicoOficial: "Não", vacinacaoBrucelose: "Não", habilitacoes: ["Emissão de GTA"], situacao: "Ativo" },
  { id: 3, nome: "Marina Couto Dias", cpf: "333.221.115-09", formacao: "Engenheiro Agrônomo", numeroConselho: "091254", servicoOficial: "Não", vacinacaoBrucelose: "Não", habilitacoes: ["Exame de Mormo"], situacao: "Inativo" },
];

// ==========================================================
// UI HELPERS
// ==========================================================
type SortKey = "nome" | "cpf" | "formacao" | "numeroConselho" | "servicoOficial" | "vacinacaoBrucelose" | "habilitacoes" | "situacao";
type SortDir = "asc" | "desc";

function SortHeader({ label, ativo, dir, onClick, className = "" }: { label: string; ativo: boolean; dir: SortDir; onClick: () => void; className?: string }) {
  return (
    <th className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal ${className}`}>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-gray-800 transition text-left">
        {label}
        {ativo ? (dir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUp size={13} className="text-gray-300" />}
      </button>
    </th>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">×</button>
    </div>
  );
}

function SituacaoTexto({ situacao }: { situacao: Profissional["situacao"] }) {
  const cor = situacao === "Ativo" ? "#1A7A3C" : "#6B7280";
  return <span className="text-sm font-medium" style={{ color: cor }}>{situacao}</span>;
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function ProfissionalAnimalPage({ onLogout, onNavigate }: PageProps) {
  // ---- Busca principal ----
  const [busca, setBusca] = useState(""); // Nome ou CPF

  // ---- Filtros ----
  const [formacao, setFormacao] = useState("");
  const [numeroConselho, setNumeroConselho] = useState("");
  const [servicoOficial, setServicoOficial] = useState("");
  const [vacinacaoBrucelose, setVacinacaoBrucelose] = useState("");
  const [habilitacoes, setHabilitacoes] = useState<string[]>([]);
  const [situacao, setSituacao] = useState("");

  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [focusConselho, setFocusConselho] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // ---- Ordenação (padrão: nome asc) ----
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtrados = PROFISSIONAIS_MOCK.filter((p) => {
    const q = busca.trim().toLowerCase();
    const matchBusca = q === "" || p.nome.toLowerCase().includes(q) || p.cpf.replace(/\D/g, "").includes(busca.replace(/\D/g, ""));
    const matchFormacao = formacao === "" || p.formacao === formacao;
    const matchConselho = numeroConselho === "" || p.numeroConselho.includes(numeroConselho.trim());
    const matchServico = servicoOficial === "" || p.servicoOficial === servicoOficial;
    const matchVacinacao = vacinacaoBrucelose === "" || p.vacinacaoBrucelose === vacinacaoBrucelose;
    const matchHabilitacoes = habilitacoes.length === 0 || habilitacoes.every((h) => p.habilitacoes.includes(h));
    const matchSituacao = situacao === "" || p.situacao === situacao;
    return matchBusca && matchFormacao && matchConselho && matchServico && matchVacinacao && matchHabilitacoes && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    const raw = (p: Profissional) => sortKey === "habilitacoes" ? p.habilitacoes.join(", ") : String(p[sortKey]);
    const va = raw(a).toLowerCase();
    const vb = raw(b).toLowerCase();
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = formacao || numeroConselho || servicoOficial || vacinacaoBrucelose || habilitacoes.length > 0 || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-area-animal" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Profissional da Área Animal</h1>
            <button onClick={() => onNavigate("adicionar-profissional-animal")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro (Busca + toggle) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome ou CPF
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value)}
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

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              {/* FILEIRA 1 */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatSelect label="Formação Profissional" value={formacao} onChange={setFormacao} options={FORMACOES} />
                </div>

                {/* Número do Conselho */}
                <div className="w-full lg:flex-1">
                  <div className="bg-white border border-gray-200 rounded-md px-3 h-12 relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                    <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusConselho || numeroConselho ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                      Número do Conselho
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={numeroConselho}
                      onFocus={() => setFocusConselho(true)}
                      onBlur={() => setFocusConselho(false)}
                      onChange={(e) => setNumeroConselho(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                    />
                  </div>
                </div>

                <div className="w-full lg:flex-1">
                  <FloatSelect label="Serviço Oficial?" value={servicoOficial} onChange={setServicoOficial} options={SIM_NAO} />
                </div>

                {/* Botão Pesquisar */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* FILEIRA 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full items-end">
                <FloatSelect label="Cadastrado para Vacinação Contra Brucelose?" value={vacinacaoBrucelose} onChange={setVacinacaoBrucelose} options={SIM_NAO} />
                <FloatMultiSelect label="Habilitações" value={habilitacoes} onChange={setHabilitacoes} options={HABILITACOES} />
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {formacao && <Chip label={`Formação: ${formacao}`} onRemove={() => setFormacao("")} />}
              {numeroConselho && <Chip label={`Conselho: ${numeroConselho}`} onRemove={() => setNumeroConselho("")} />}
              {servicoOficial && <Chip label={`Serviço Oficial: ${servicoOficial}`} onRemove={() => setServicoOficial("")} />}
              {vacinacaoBrucelose && <Chip label={`Vacinação Brucelose: ${vacinacaoBrucelose}`} onRemove={() => setVacinacaoBrucelose("")} />}
              {habilitacoes.map((h) => <Chip key={h} label={`Habilitação: ${h}`} onRemove={() => setHabilitacoes((prev) => prev.filter((x) => x !== h))} />)}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por um profissional utilizando o campo de busca e os filtros acima.</p>
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
                      <SortHeader label="Nome" ativo={sortKey === "nome"} dir={sortDir} onClick={() => toggleSort("nome")} className="max-w-[170px]" />
                      <SortHeader label="CPF" ativo={sortKey === "cpf"} dir={sortDir} onClick={() => toggleSort("cpf")} className="max-w-[140px]" />
                      <SortHeader label="Formação Profissional" ativo={sortKey === "formacao"} dir={sortDir} onClick={() => toggleSort("formacao")} className="max-w-[150px]" />
                      <SortHeader label="Número do Conselho" ativo={sortKey === "numeroConselho"} dir={sortDir} onClick={() => toggleSort("numeroConselho")} className="max-w-[110px]" />
                      <SortHeader label="Serviço Oficial?" ativo={sortKey === "servicoOficial"} dir={sortDir} onClick={() => toggleSort("servicoOficial")} className="max-w-[90px]" />
                      <SortHeader label="Vacinação Contra Brucelose?" ativo={sortKey === "vacinacaoBrucelose"} dir={sortDir} onClick={() => toggleSort("vacinacaoBrucelose")} className="max-w-[110px]" />
                      <SortHeader label="Habilitações" ativo={sortKey === "habilitacoes"} dir={sortDir} onClick={() => toggleSort("habilitacoes")} className="max-w-[180px]" />
                      <SortHeader label="Situação" ativo={sortKey === "situacao"} dir={sortDir} onClick={() => toggleSort("situacao")} className="max-w-[90px]" />
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.cpf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.formacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.numeroConselho}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.servicoOficial}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.vacinacaoBrucelose}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {p.habilitacoes.length ? (
                            <>
                              <div>{p.habilitacoes[0]}</div>
                              {p.habilitacoes.length > 1 && <div className="text-xs text-gray-400 font-medium mt-0.5">+ {p.habilitacoes.length - 1}</div>}
                            </>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-profissional-area-animal", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-profissional-area-animal", p)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
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