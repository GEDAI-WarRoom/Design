import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, Pencil, Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { CLASSIFICACOES_RECEITA, classificacaoLabel, RECEITAS_MOCK, Receita, SITUACOES_RECEITA } from "./receitaData";

const GREEN = "#1A7A3C";
type SortKey = "codigo" | "descricao" | "classificacao" | "situacao";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm"><span>{label}</span><button type="button" onClick={onRemove}><X size={14} /></button></div>;
}

export function ReceitaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [classificacao, setClassificacao] = useState("");
  const [situacao, setSituacao] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const hasFilter = Boolean(codigo || descricao || classificacao || situacao);
  const results = useMemo(() => {
    const filtered = RECEITAS_MOCK.filter((item) =>
      (!codigo || item.codigo.includes(codigo)) &&
      (!descricao || item.descricao.toLowerCase().includes(descricao.toLowerCase())) &&
      (!classificacao || item.classificacao === classificacao) &&
      (!situacao || item.situacao === situacao),
    );
    return sortKey ? [...filtered].sort((a, b) => {
      const first = sortKey === "classificacao" ? classificacaoLabel(a[sortKey]) : String(a[sortKey]);
      const second = sortKey === "classificacao" ? classificacaoLabel(b[sortKey]) : String(b[sortKey]);
      return sortAsc ? first.localeCompare(second) : second.localeCompare(first);
    }) : filtered;
  }, [codigo, descricao, classificacao, situacao, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);
  const search = () => { setError(!hasFilter); setSearched(hasFilter); setPage(1); };
  const sort = (key: SortKey) => { setSortKey(key); setSortAsc(key === sortKey ? !sortAsc : true); };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="receita" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Inicial</button>
          <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Receita</h1><button type="button" onClick={() => onNavigate("adicionar-receita")} className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]">Adicionar Nova</button></div>
        </div>
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 relative border border-gray-200 rounded-md h-12 flex items-center px-3 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"><input value={codigo} onChange={(event) => { setCodigo(event.target.value.replace(/\D/g, "")); setError(false); }} onKeyDown={(event) => event.key === "Enter" && search()} placeholder="Código da Receita" className="w-full outline-none text-sm text-gray-800 pr-8" maxLength={20} /><Search size={16} className="absolute right-3 text-gray-400" /></div>
            <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className={`px-4 border rounded-md ${filtersOpen ? "text-[#1A7A3C] bg-white" : "text-white bg-[#1A7A3C]"}`} style={{ borderColor: GREEN }} title="Filtros"><SlidersHorizontal size={17} /></button>
          </div>
          {filtersOpen && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="relative border border-gray-300 rounded-md h-12 flex items-center px-3"><input value={descricao} onChange={(event) => { setDescricao(event.target.value); setError(false); }} placeholder="Descrição da Receita" className="w-full outline-none text-sm" maxLength={255} /></div>
            <FloatSelect label="Classificação de Receita" value={classificacao} onChange={setClassificacao} options={CLASSIFICACOES_RECEITA} />
            <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_RECEITA} />
            <button type="button" onClick={search} className="h-12 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]">Pesquisar</button>
          </div>}
          {error && <p className="text-sm text-red-500 font-medium">Utilize o campo de busca ou selecione um filtro para visualizar os resultados.</p>}
          {hasFilter && <div className="flex flex-wrap gap-2"><>{codigo && <Chip label={`Código: ${codigo}`} onRemove={() => setCodigo("")} />}{descricao && <Chip label={`Descrição: ${descricao}`} onRemove={() => setDescricao("")} />}{classificacao && <Chip label={`Classificação: ${classificacaoLabel(classificacao)}`} onRemove={() => setClassificacao("")} />}{situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}</></div>}
          {!searched ? <div className="py-12 text-center text-sm text-gray-500">Busque receitas utilizando o campo de busca e os filtros acima.</div> : results.length === 0 ? <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div> : <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="border-b border-gray-100">{(["codigo", "descricao", "classificacao", "situacao"] as SortKey[]).map((key) => <th key={key} onClick={() => sort(key)} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase cursor-pointer"><span className="inline-flex items-center gap-1">{{ codigo: "Código da Receita", descricao: "Descrição da Receita", classificacao: "Classificação de Receita", situacao: "Situação" }[key]}{sortKey === key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>)}<th /></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="px-4 py-3">{item.codigo}</td><td className="px-4 py-3 text-gray-700">{item.descricao}</td><td className="px-4 py-3 text-gray-600">{classificacaoLabel(item.classificacao)}</td><td className="px-4 py-3 text-gray-700">{item.situacao}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => onNavigate("visualizar-receita", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Visualizar"><Eye size={18} /></button><button type="button" onClick={() => onNavigate("editar-receita", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Editar"><Pencil size={17} /></button></div></td></tr>)}</tbody></table><div className="flex items-center justify-between pt-4 text-sm text-gray-500"><span>Itens por página: {perPage}</span><div className="flex items-center gap-4"><span>{start} - {end} de {results.length}</span><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30"><ChevronRight size={18} /></button></div></div></div>}
        </section>
      </main>
    </div>
  );
}
