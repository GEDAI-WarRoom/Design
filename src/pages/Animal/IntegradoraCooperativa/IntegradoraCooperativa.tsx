import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US025)
// ==========================================================
const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

// Municípios por estado (mock — substituir por API de Municípios do IBGE)
const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte", "Contagem", "Esmeraldas", "Lavras", "Uberlândia", "Varginha"],
  "São Paulo": ["Campinas", "Guarulhos", "Santos", "São Paulo", "Sorocaba"],
  "Paraná": ["Cascavel", "Curitiba", "Londrina", "Maringá", "Toledo"],
};

const TIPOS = [
  { value: "Integradora", label: "Integradora" },
  { value: "Cooperativa", label: "Cooperativa" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// UTIL: CNPJ (máscara + dígito verificador)
// ==========================================================
const mascaraCNPJ = (v: string) =>
  v.replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

function cnpjValido(cnpjMascarado: string): boolean {
  const c = cnpjMascarado.replace(/\D/g, "");
  if (c.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(c)) return false;
  const calc = (base: string) => {
    let soma = 0;
    let peso = base.length - 7;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const d1 = calc(c.slice(0, 12));
  const d2 = calc(c.slice(0, 12) + d1);
  return d1 === parseInt(c[12], 10) && d2 === parseInt(c[13], 10);
}

// ==========================================================
// MOCK DE RESULTADOS
// ==========================================================
interface Registro {
  id: number;
  codigo: string;
  nome: string;
  cnpj: string;
  tipo: "Integradora" | "Cooperativa";
  estado: string;
  municipio: string;
  situacao: "Ativo" | "Inativo";
}

const REGISTROS_MOCK: Registro[] = [
  { id: 1, codigo: "INT-0001", nome: "Avivar Alimentos S/A", cnpj: "56.338.814/0001-95", tipo: "Integradora", estado: "Minas Gerais", municipio: "Esmeraldas", situacao: "Ativo" },
  { id: 2, codigo: "COO-0002", nome: "Cooperativa Vale do Leite", cnpj: "12.345.678/0001-90", tipo: "Cooperativa", estado: "Minas Gerais", municipio: "Lavras", situacao: "Ativo" },
  { id: 3, codigo: "INT-0003", nome: "Integrar Agro Ltda.", cnpj: "98.765.432/0001-10", tipo: "Integradora", estado: "São Paulo", municipio: "Campinas", situacao: "Inativo" },
  { id: 4, codigo: "COO-0004", nome: "Coop Sul Aves", cnpj: "11.222.333/0001-44", tipo: "Cooperativa", estado: "Paraná", municipio: "Curitiba", situacao: "Ativo" },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

// ==========================================================
// UI HELPERS
// ==========================================================
type SortKey = "nome" | "cnpj" | "tipo" | "situacao";
type SortDir = "asc" | "desc";

function SortHeader({ label, ativo, dir, onClick, className = "" }: { label: string; ativo: boolean; dir: SortDir; onClick: () => void; className?: string }) {
  return (
    <th className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal ${className}`}>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-gray-800 transition">
        {label}
        {ativo ? (dir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUp size={13} className="text-gray-300" />}
      </button>
    </th>
  );
}

function SituacaoTexto({ situacao }: { situacao: Registro["situacao"] }) {
  const cor = situacao === "Ativo" ? "#1A7A3C" : "#6B7280";
  return <span className="text-sm font-medium" style={{ color: cor }}>{situacao}</span>;
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function IntegradoraCooperativaPage({ onLogout, onNavigate }: PageProps) {
  // ---- Campo de busca principal ----
  const [busca, setBusca] = useState(""); // CNPJ, Razão social ou código

  // ---- Filtros ----
  const [cnpj, setCnpj] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");

  // ---- UI ----
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroCnpj, setErroCnpj] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // ---- Ordenação (padrão: nome asc) ----
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const municipiosDisponiveis = estado ? (MUNICIPIOS_POR_ESTADO[estado] || []) : [];

  const handlePesquisar = () => {
    // CNPJ é opcional, mas se preenchido deve ser válido
    if (cnpj && !cnpjValido(cnpj)) {
      setErroCnpj(true);
      setHasSearched(false);
      return;
    }
    setErroCnpj(false);
    setHasSearched(true);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtrados = REGISTROS_MOCK.filter((r) => {
    const q = busca.trim().toLowerCase();
    const matchBusca =
      q === "" ||
      r.nome.toLowerCase().includes(q) ||
      r.cnpj.replace(/\D/g, "").includes(busca.replace(/\D/g, "")) ||
      r.codigo.toLowerCase().includes(q);
    const matchCnpj = cnpj === "" || r.cnpj.replace(/\D/g, "").includes(cnpj.replace(/\D/g, ""));
    const matchEstado = estado === "" || r.estado === estado;
    const matchMunicipio = municipio === "" || r.municipio === municipio;
    const matchTipo = tipo === "" || r.tipo === tipo;
    const matchSituacao = situacao === "" || r.situacao === situacao;
    return matchBusca && matchCnpj && matchEstado && matchMunicipio && matchTipo && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[sortKey]).toLowerCase();
    const vb = String(b[sortKey]).toLowerCase();
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

  const temFiltroAtivo = cnpj || estado || municipio || tipo || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="integradora-cooperativa" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Integradora e Cooperativa</h1>
            <button onClick={() => onNavigate("adicionar-integradora-cooperativa")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro (Busca + toggle) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                CNPJ, Razão social ou código da integradora ou cooperativa
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
                  <FloatInput
                    label="CNPJ"
                    value={cnpj}
                    onChange={(v) => { setCnpj(mascaraCNPJ(v)); setErroCnpj(false); }}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatCombobox
                    label="Estado"
                    value={estado}
                    onChange={(v) => { setEstado(v); setMunicipio(""); }}
                    options={ESTADOS_BR}
                  />
                </div>
               {estado && (
                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                ) }
              

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
                <FloatSelect label="Integradora ou Cooperativa" value={tipo} onChange={setTipo} options={TIPOS} />
                <FloatSelect label="Situação do Cadastro" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>

              {erroCnpj && (
                <p className="text-sm text-red-500 mt-1">CNPJ inválido. Verifique os dígitos informados.</p>
              )}
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {cnpj && <Chip label={`CNPJ: ${cnpj}`} onRemove={() => setCnpj("")} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => { setEstado(""); setMunicipio(""); }} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => setTipo("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por integradoras e cooperativas utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto ">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <SortHeader label="NOME DA INTEGRADORA/COOPERATIVA" ativo={sortKey === "nome"} dir={sortDir} onClick={() => toggleSort("nome")} className="max-w-[260px] uppercase" />
                      <SortHeader label="CNPJ" ativo={sortKey === "cnpj"} dir={sortDir} onClick={() => toggleSort("cnpj")} className="max-w-[180px] uppercase" />
                      <SortHeader label="TIPO" ativo={sortKey === "tipo"} dir={sortDir} onClick={() => toggleSort("tipo")} className="max-w-[140px] uppercase" />
                      <SortHeader label="SITUAÇÃO" ativo={sortKey === "situacao"} dir={sortDir} onClick={() => toggleSort("situacao")} className="max-w-[110px] uppercase" />
                      <th className="px-4 py-3 w-[70px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-normal">{r.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.cnpj}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.tipo}</td>
                        <td className="px-4 py-3 whitespace-normal">{r.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button onClick={() => onNavigate("visualizar-integradora-cooperativa", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><Eye size={18} /></button>
                            <button onClick={() => onNavigate("editar-integradora-cooperativa", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Selecionar / Editar"><Pencil size={17} /></button>
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

// ==========================================================
// Chip de filtro ativo
// ==========================================================
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">×</button>
    </div>
  );
}
