import React, { useState } from "react";
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
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS (substituir por API)
// Hierarquia de tipos (para derivar o "tipo pai imediato" — ver US036).
// ==========================================================
const TIPOS_UNIDADE = [
  "Almoxarifado",
  "Barreira Sanitária",
  "Coordenadoria Regional",
  "Escritório Central",
  "Escritório Municipal",
  "Escritório Seccional",
  "Laboratório",
  "Posto de Atendimento",
  "Serviço de Inspeção Permanente",
];

const TIPO_PAI: Record<string, string> = {
  "Escritório Seccional": "Coordenadoria Regional",
  "Escritório Municipal": "Escritório Seccional",
  "Posto de Atendimento": "Escritório Municipal",
  "Barreira Sanitária": "Coordenadoria Regional",
  "Almoxarifado": "Coordenadoria Regional",
  "Laboratório": "Coordenadoria Regional",
  "Serviço de Inspeção Permanente": "Coordenadoria Regional",
  "Coordenadoria Regional": "Escritório Central",
};

interface Unidade {
  id: number;
  nome: string;
  sigla: string;
  tipo: string;
  unidadePai: string; 
  situacao: "Ativo" | "Inativo";
}

const UNIDADES_MOCK: Unidade[] = [
  { id: 1, nome: "Escritório Seccional de Lavras", sigla: "SECLAV3820", tipo: "Escritório Seccional", unidadePai: "Coordenadoria Regional de Oliveira", situacao: "Ativo" },
  { id: 2, nome: "Coordenadoria Regional de Oliveira", sigla: "CROLI1200", tipo: "Coordenadoria Regional", unidadePai: "Escritório Central", situacao: "Ativo" },
  { id: 3, nome: "Escritório Municipal de Ijaci", sigla: "EMIJ5540", tipo: "Escritório Municipal", unidadePai: "Escritório Seccional de Lavras", situacao: "Inativo" },
  { id: 4, nome: "Escritório Central", sigla: "ECBH0001", tipo: "Escritório Central", unidadePai: "", situacao: "Ativo" },
];

const UNIDADES_PAI_MOCK = UNIDADES_MOCK.map((u) => ({ id: u.id, nome: u.nome, sigla: u.sigla, tipo: u.tipo }));

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Unidade["situacao"] }) {
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

type SortKey = "nome" | "sigla" | "tipo" | "unidadePai" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function UnidadeAdministrativaPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState(""); 
  const [tipo, setTipo] = useState("");
  const [unidadePai, setUnidadePai] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const mostrarUnidadePai = tipo !== "" && tipo !== "Escritório Central";
  const tipoPaiImediato = tipo ? TIPO_PAI[tipo] : undefined;
  const unidadesPaiDisponiveis = tipoPaiImediato
    ? UNIDADES_PAI_MOCK.filter((u) => u.tipo === tipoPaiImediato)
    : [];

  const temFiltroAtivo = busca.trim() !== "" || tipo !== "" || !!unidadePai || situacao !== "";

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const onChangeTipo = (v: string) => {
    setTipo(v);
    setUnidadePai(null);
    if (erroFiltro) setErroFiltro(false);
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((s) => !s);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtrados = UNIDADES_MOCK.filter((u) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || u.nome.toLowerCase().includes(termo) || u.sigla.toLowerCase().includes(termo);
    const matchTipo = tipo === "" || u.tipo === tipo;
    const matchPai = !unidadePai || u.unidadePai === unidadePai.nome;
    const matchSituacao = situacao === "" || u.situacao === situacao;
    return matchBusca && matchTipo && matchPai && matchSituacao;
  });

  const ordenados = sortKey
    ? [...filtrados].sort((a, b) => {
        const va = String(a[sortKey] ?? "");
        const vb = String(b[sortKey] ?? "");
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      })
    : filtrados;

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const colunas: { label: string; key: SortKey }[] = [
    { label: "Unidade Administrativa", key: "nome" },
    { label: "Sigla", key: "sigla" },
    { label: "Tipo da Unidade Administrativa", key: "tipo" },
    { label: "Unidade Pai", key: "unidadePai" },
    { label: "Situação", key: "situacao" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-administrativa" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Unidade Administrativa</h1>
            <button onClick={() => onNavigate("adicionar-unidade-administrativa")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome ou Sigla da Unidade Administrativa
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroFiltro) setErroFiltro(false); }}
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

          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
              <FloatSelect
                label="Tipo da Unidade Administrativa"
                value={tipo}
                onChange={onChangeTipo}
                options={TIPOS_UNIDADE.map((t) => ({ value: t, label: t }))}
              />

           {/* 💡 CORRIGIDO: Agora o componente só renderiza se 'mostrarUnidadePai' for true, sem deixar nenhum bloco cinza de placeholder */}
{mostrarUnidadePai && (
  <div className="w-full">
    <EntitySearchInput
      label="Unidade Administrativa Pai"
      placeholder="Buscar por nome"
      value={unidadePai ? unidadePai.nome : ""}
      data={unidadesPaiDisponiveis}
      searchKeys={["nome", "sigla"]}
      columns={[
        { label: "Nome da Unidade", key: "nome" },
        { label: "Sigla", key: "sigla" }
      ]}
      icon={
        Icons.iconeUnidadeAdministrativaUrl ? (
          <img src={Icons.iconeUnidadeAdministrativaUrl} alt="Unidade" className="w-5 h-5 object-contain" />
        ) : undefined
      }
      title="Buscar Unidade Pai"
      subtitle="Busque pela unidade do tipo pai imediato ao selecionado:"
      onChange={(ent) => { 
        setUnidadePai(ent); 
        if (erroFiltro) setErroFiltro(false); 
      }}
    />
  </div>
)}

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

          {erroFiltro && (
            <p className="text-sm text-red-500 font-medium">
              Selecione ao menos um filtro ou utilize o campo de busca para visualizar os resultados.
            </p>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => onChangeTipo("")} />}
              {unidadePai && <Chip label={`Unidade Pai: ${unidadePai.nome}`} onRemove={() => setUnidadePai(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por unidade administrativa utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      {colunas.map((c) => (
                        <th
                          key={c.key}
                          onClick={() => toggleSort(c.key)}
                          className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal cursor-pointer select-none hover:text-gray-900"
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            {sortKey === c.key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((u) => (
                      <tr key={u.id} className=" last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-700 text-sm whitespace-normal">{u.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{u.sigla}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{u.tipo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {u.unidadePai || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{u.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-unidade-administrativa", u)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${u.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-unidade-administrativa", u)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${u.nome}`}><Pencil size={17} /></button>
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