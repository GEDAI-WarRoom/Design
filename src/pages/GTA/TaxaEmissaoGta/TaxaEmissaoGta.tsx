import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Dna, Eye, Pencil, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import { ESPECIES_TAXA_MOCK, TAXAS_EMISSAO_GTA_MOCK, TIPOS_COBRANCA, formatarData, type EspecieTaxa, type TaxaEmissaoGta } from "./taxaEmissaoGtaData";
type SortKey = "especie" | "tipoCobranca" | "dataInicioVigencia";
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm"><span>{label}</span><button type="button" onClick={onRemove}><X size={14} /></button></div>;
}
export function TaxaEmissaoGtaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [especie, setEspecie] = useState<EspecieTaxa | null>(null);
  const [tipoCobranca, setTipoCobranca] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const hasFilter = Boolean(especie || tipoCobranca);
  const results = useMemo(() => {
    const filtered = TAXAS_EMISSAO_GTA_MOCK.filter((item) => (!especie || item.especie.id === especie.id) && (!tipoCobranca || item.tipoCobranca === tipoCobranca));
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const first = sortKey === "especie" ? a.especie.nome : a[sortKey];
      const second = sortKey === "especie" ? b.especie.nome : b[sortKey];
      return sortAsc ? first.localeCompare(second) : second.localeCompare(first);
    });
  }, [especie, tipoCobranca, sortKey, sortAsc]);
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);
  const search = () => { setError(!hasFilter); setSearched(hasFilter); setPage(1); };
  const sort = (key: SortKey) => { setSortKey(key); setSortAsc(key === sortKey ? !sortAsc : true); };
  const label = (key: SortKey) => ({ especie: "Espécie", tipoCobranca: "Descrição da Taxa", dataInicioVigencia: "Data Início de Vigência" })[key];
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Inicial</button>
          <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Taxa de Emissão de GTA</h1><button type="button" onClick={() => onNavigate("adicionar-taxa-emissao-gta")} className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]">Adicionar Nova</button></div>
        </div>
        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
            {/* Campo 1: Espécie (ocupa 50% do espaço dos campos) */}
            <div className="flex-1 w-full">
              <EntitySearchInput
                label="Espécie"
                placeholder="Busque por espécie ou grupo"
                value={especie ? `${especie.nome}` : ""}
                data={ESPECIES_TAXA_MOCK}
                searchKeys={["codigo", "nome", "grupo"]}
                columns={[
                  { label: "Espécie", key: "nome" },
                  { label: "Grupo", key: "grupo" },
                ]}
                icon={<Dna size={18} color="#1A7A3C" />}
                onChange={(item) => {
                  setEspecie(item);
                  setError(false);
                }}
                title="Buscar Espécie"
              />
            </div>

            {/* Campo 2: Tipo de Cobrança (ocupa 50% do espaço dos campos) */}
            <div className="flex-1 w-full">
              <FloatSelect
                label="Tipo de Cobrança"
                value={tipoCobranca}
                onChange={(next) => {
                  setTipoCobranca(next);
                  setError(false);
                }}
                options={TIPOS_COBRANCA}
              />
            </div>

            {/* Botão de Pesquisar (com tamanho fixo baseado no conteúdo) */}
            <button
              type="button"
              onClick={search}
              className="h-12 w-full sm:w-auto px-5 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition shrink-0"
            >
              Pesquisar
            </button>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">Selecione ao menos um filtro para visualizar os resultados.</p>}
          {hasFilter && <div className="flex flex-wrap gap-2 animate-fadeIn">{especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}{tipoCobranca && <Chip label={`Tipo de Cobrança: ${tipoCobranca}`} onRemove={() => setTipoCobranca("")} />}</div>}
          {!searched ? <div className="py-12 text-center text-sm text-gray-500">Busque taxas utilizando os filtros acima.</div> : results.length === 0 ? <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div> : (
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="border-b border-gray-100">{(["especie", "tipoCobranca", "dataInicioVigencia"] as SortKey[]).map((key) => <th key={key} onClick={() => sort(key)} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase cursor-pointer"><span className="inline-flex items-center gap-1">{label(key)}{sortKey === key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>)}<th /></tr></thead><tbody>{rows.map((item: TaxaEmissaoGta) => <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="px-4 py-3 text-gray-700">{item.especie.nome}</td><td className="px-4 py-3 text-gray-700">{item.tipoCobranca}</td><td className="px-4 py-3 text-gray-700">{formatarData(item.dataInicioVigencia)}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => onNavigate("visualizar-taxa-emissao-gta", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Visualizar"><Eye size={18} /></button><button type="button" onClick={() => onNavigate("editar-taxa-emissao-gta", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Editar"><Pencil size={17} /></button></div></td></tr>)}</tbody></table><div className="flex items-center justify-between pt-4 text-sm text-gray-500"><span>Itens por página: {perPage}</span><div className="flex items-center gap-4"><span>{start} - {end} de {results.length}</span><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30"><ChevronRight size={18} /></button></div></div></div>
          )}
        </section>
      </main>
    </div>
  );
}
