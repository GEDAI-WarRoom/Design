import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Pencil, Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import { ESPECIES_DOENCA, formatarEspecies, listarDoencas, SITUACOES_DOENCA } from "./doencaData";

const GREEN = "#1A7A3C";
interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; }

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <div className="flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm"><span>{label}</span><button type="button" onClick={onRemove}><X size={14} /></button></div>;
}

export function DoencaPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const temFiltroAtivo = Boolean(nome.trim() || especie || situacao);
  const resultados = useMemo(() => listarDoencas().filter((doenca) =>
    (!nome.trim() || doenca.nome.toLocaleLowerCase("pt-BR").includes(nome.trim().toLocaleLowerCase("pt-BR"))) &&
    (!especie || doenca.especies.some((item) => item.id === especie.id)) &&
    (!situacao || doenca.situacao === situacao)
  ), [nome, especie, situacao, hasSearched]);
  const pesquisar = () => { if (!temFiltroAtivo) { setErroFiltro(true); setHasSearched(false); return; } setErroFiltro(false); setHasSearched(true); setPage(1); };
  const totalPages = Math.max(1, Math.ceil(resultados.length / perPage));
  const paginaAtual = Math.min(page, totalPages);
  const linhas = resultados.slice((paginaAtual - 1) * perPage, paginaAtual * perPage);
  const inicio = resultados.length ? (paginaAtual - 1) * perPage + 1 : 0;
  const fim = Math.min(paginaAtual * perPage, resultados.length);

  return <div className="min-h-screen bg-[#f2f3f5]"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="doenca" hideSearch />
    <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6"><div className="mb-4"><button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} />Inicial</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Doença</h1><button type="button" onClick={() => onNavigate("adicionar-doenca")} className="rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>Adicionar Nova</button></div></div>
      <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm"><div className="flex items-stretch gap-3"><div className="relative flex h-12 flex-1 items-end rounded-md border border-gray-200 px-3 pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"><label className={`pointer-events-none absolute left-3 transition-all ${nome ? "top-1 text-[10px] font-medium text-gray-400" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Nome da Doença</label><input value={nome} maxLength={255} onChange={(event) => { setNome(event.target.value); setErroFiltro(false); }} onKeyDown={(event) => event.key === "Enter" && pesquisar()} className="h-6 w-full bg-transparent text-sm outline-none" /><Search size={15} className="mb-0.5 ml-2 text-gray-400" /></div><button type="button" onClick={() => setShowFilters(!showFilters)} className="flex w-12 items-center justify-center rounded-md border" style={{ backgroundColor: showFilters ? "white" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "white" }}><SlidersHorizontal size={16} /></button></div>
        {showFilters && <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3"><EntitySearchInput label="Espécie" required placeholder="Buscar por nome da espécie" value={especie?.nome ?? ""} data={ESPECIES_DOENCA} searchKeys={["nome", "grupo"]} columns={[{ label: "Espécie", key: "nome" }, { label: "Grupo", key: "grupo" }]} title="Buscar Espécie" subtitle="Busque por uma espécie cadastrada:" onChange={setEspecie} /><FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_DOENCA} /><button type="button" onClick={pesquisar} className="h-12 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>Pesquisar</button></div>}
        {erroFiltro && <p className="text-sm font-medium text-red-500">Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.</p>}
        {temFiltroAtivo && <div className="flex flex-wrap gap-2">{nome.trim() && <Chip label={`Nome: ${nome}`} onRemove={() => setNome("")} />}{especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}{situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}</div>}
        {hasSearched && <div className="border-t border-gray-100" />}{!hasSearched ? <p className="py-12 text-center text-sm text-gray-500">Busque por doença utilizando o campo de busca e os filtros acima.</p> : !linhas.length ? <p className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</p> : <div className="overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="border-b border-gray-100"><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Nome da Doença</th><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Espécie</th><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Situação</th><th className="w-24 px-4 py-3" /></tr></thead><tbody>{linhas.map((doenca) => <tr key={doenca.id} className="border-b border-gray-50 text-gray-500 hover:bg-gray-50/60"><td className="px-4 py-3">{doenca.nome}</td><td className="px-4 py-3">{formatarEspecies(doenca.especies)}</td><td className="px-4 py-3">{doenca.situacao}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-doenca", doenca)} className="rounded-md p-2 hover:bg-green-50" style={{ color: GREEN }}><Eye size={18} /></button><button type="button" title="Editar" onClick={() => onNavigate("editar-doenca", doenca)} className="rounded-md p-2 hover:bg-green-50" style={{ color: GREEN }}><Pencil size={17} /></button></div></td></tr>)}</tbody></table><div className="flex items-center justify-between pt-4 text-sm text-gray-500"><span>Itens por página: {perPage}</span><div className="flex items-center gap-4"><span>{inicio} - {fim} de {resultados.length}</span><button type="button" disabled={paginaAtual === 1} onClick={() => setPage((value) => value - 1)} className="disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" disabled={paginaAtual === totalPages} onClick={() => setPage((value) => value + 1)} className="disabled:opacity-30"><ChevronRight size={18} /></button></div></div></div>}</section></main></div>;
}
