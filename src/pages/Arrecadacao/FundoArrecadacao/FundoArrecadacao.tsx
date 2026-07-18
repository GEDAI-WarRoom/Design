import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { FUNDOS_ARRECADACAO_MOCK, SITUACOES, TIPOS_FUNDO } from "./fundoArrecadacaoData";

type SortKey = "nome" | "tipo" | "situacao";

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}><X size={14} /></button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function FundoArrecadacaoPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const hasFilter = Boolean(nome || tipo || situacao);
  const results = useMemo(() => {
    const filtered = FUNDOS_ARRECADACAO_MOCK.filter((item) =>
      (!nome || item.nome.toLocaleLowerCase("pt-BR").includes(nome.toLocaleLowerCase("pt-BR"))) &&
      (!tipo || item.tipo === tipo) &&
      (!situacao || item.situacao === situacao),
    );
    if (!sortKey) return filtered;
    return [...filtered].sort((first, second) => {
      const result = first[sortKey].localeCompare(second[sortKey], "pt-BR");
      return sortAsc ? result : -result;
    });
  }, [nome, tipo, situacao, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);

  const pesquisar = () => {
    setShowValidation(!hasFilter);
    setSearched(hasFilter);
    setPage(1);
  };

  const ordenar = (key: SortKey) => {
    setSortAsc(key === sortKey ? !sortAsc : true);
    setSortKey(key);
  };

  const clear = (setter: (value: string) => void) => {
    setter("");
    setShowValidation(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="fundo-arrecadacao" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} />Inicial
        </button>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Fundo de Arrecadação</h1>
          <button type="button" onClick={() => onNavigate("adicionar-fundo-arrecadacao")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">
            Adicionar Novo
          </button>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-stretch gap-3">
            <div className="relative flex h-12 flex-1 items-center rounded-md border border-gray-200 px-3 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <input
                value={nome}
                onChange={(event) => { setNome(event.target.value); setShowValidation(false); }}
                onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                placeholder="Nome do Fundo de Arrecadação"
                maxLength={255}
                className="w-full pr-8 text-sm text-gray-800 outline-none"
              />
              <Search size={16} className="absolute right-3 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={`rounded-md border border-[#1A7A3C] px-4 ${filtersOpen ? "bg-white text-[#1A7A3C]" : "bg-[#1A7A3C] text-white"}`}
              title="Filtros"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

          {filtersOpen && (
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
              <FloatSelect label="Tipo do Fundo de Arrecadação" value={tipo} onChange={(value) => { setTipo(value); setShowValidation(false); }} options={TIPOS_FUNDO} />
              <FloatSelect label="Situação" value={situacao} onChange={(value) => { setSituacao(value); setShowValidation(false); }} options={SITUACOES} />
              <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] text-sm font-semibold text-white hover:bg-[#15612F]">Pesquisar</button>
            </div>
          )}

          {showValidation && <p className="text-sm font-medium text-red-500">Utilize o campo de busca ou selecione um filtro para visualizar os resultados.</p>}
          {hasFilter && (
            <div className="flex flex-wrap gap-2">
              {nome && <FilterChip label={`Nome: ${nome}`} onRemove={() => clear(setNome)} />}
              {tipo && <FilterChip label={`Tipo: ${tipo}`} onRemove={() => clear(setTipo)} />}
              {situacao && <FilterChip label={`Situação: ${situacao}`} onRemove={() => clear(setSituacao)} />}
            </div>
          )}

          {!searched ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque fundos de arrecadação utilizando o campo de busca e os filtros acima.</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {(["nome", "tipo", "situacao"] as SortKey[]).map((key) => (
                      <th key={key} onClick={() => ordenar(key)} className="cursor-pointer px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          {{ nome: "Nome do Fundo de Arrecadação", tipo: "Tipo do Fundo de Arrecadação", situacao: "Situação" }[key]}
                          {sortKey === key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </span>
                      </th>
                    ))}
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{item.nome}</td>
                      <td className="px-4 py-3 text-gray-700">{item.tipo}</td>
                      <td className="px-4 py-3 text-gray-700">{item.situacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => onNavigate("visualizar-fundo-arrecadacao", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50" title="Visualizar"><Eye size={18} /></button>
                          <button type="button" onClick={() => onNavigate("editar-fundo-arrecadacao", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50" title="Editar"><Pencil size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{start} - {end} de {results.length}</span>
                  <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30"><ChevronLeft size={18} /></button>
                  <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
