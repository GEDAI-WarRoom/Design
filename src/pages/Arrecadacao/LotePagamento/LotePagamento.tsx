import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  DOCUMENTOS_BUSCA_OPTIONS,
  formatarDataLote,
  listarLotesPagamento,
  SITUACOES_LOTE_OPTIONS,
  STATUS_PAGAMENTO_OPTIONS,
} from "./lotePagamentoData";

type SortKey =
  | "documento"
  | "numeroLote"
  | "dataPagamentoUsuario"
  | "dataPagamentoProdemge"
  | "situacao"
  | "statusPagamento";

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

export function LotePagamentoPage({ onLogout, onNavigate }: PageProps) {
  const [numeroLote, setNumeroLote] = useState("");
  const [documento, setDocumento] = useState("");
  const [serie, setSerie] = useState("");
  const [numeroGta, setNumeroGta] = useState("");
  const [numeroPtv, setNumeroPtv] = useState("");
  const [dataUsuario, setDataUsuario] = useState("");
  const [dataProdemge, setDataProdemge] = useState("");
  const [situacao, setSituacao] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const hasFilter = Boolean(
    numeroLote || documento || serie || numeroGta || numeroPtv || dataUsuario ||
    dataProdemge || situacao || statusPagamento,
  );

  const results = useMemo(() => {
    const filtered = listarLotesPagamento().filter((item) =>
      (!numeroLote || String(item.numeroLote).includes(numeroLote)) &&
      (!documento || item.documento === documento) &&
      (!serie || item.documentos.some((doc) => doc.serie?.toLocaleUpperCase("pt-BR") === serie.toLocaleUpperCase("pt-BR"))) &&
      (!numeroGta || item.documentos.some((doc) => doc.tipo === "GTA" && doc.numero.includes(numeroGta))) &&
      (!numeroPtv || item.documentos.some((doc) => doc.tipo === "PTV" && doc.numero.includes(numeroPtv))) &&
      (!dataUsuario || item.dataPagamentoUsuario === dataUsuario) &&
      (!dataProdemge || item.dataPagamentoProdemge === dataProdemge) &&
      (!situacao || item.situacao === situacao) &&
      (!statusPagamento || item.statusPagamento === statusPagamento),
    );
    if (!sortKey) return filtered;
    return [...filtered].sort((first, second) => {
      const result = String(first[sortKey]).localeCompare(String(second[sortKey]), "pt-BR", { numeric: true });
      return sortAsc ? result : -result;
    });
  }, [numeroLote, documento, serie, numeroGta, numeroPtv, dataUsuario, dataProdemge, situacao, statusPagamento, sortKey, sortAsc]);

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

  const changeDocumento = (value: string) => {
    setDocumento(value);
    setSerie("");
    setNumeroGta("");
    setNumeroPtv("");
    setShowValidation(false);
  };

  const headers: Array<{ key: SortKey; label: string }> = [
    { key: "documento", label: "Documento" },
    { key: "numeroLote", label: "Número do Lote" },
    { key: "dataPagamentoUsuario", label: "Data Pagamento (Usuário)" },
    { key: "dataPagamentoProdemge", label: "Data Pagamento (PRODEMGE)" },
    { key: "situacao", label: "Situação" },
    { key: "statusPagamento", label: "Status do Pagamento" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lote-pagamento" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} />Inicial
        </button>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Lote de Pagamento</h1>
          <button type="button" onClick={() => onNavigate("adicionar-lote-pagamento")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">
            Adicionar Novo
          </button>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-stretch gap-3">
            <div className="relative flex h-12 flex-1 items-center rounded-md border border-gray-200 px-3 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <input
                value={numeroLote}
                onChange={(event) => { setNumeroLote(event.target.value.replace(/\D/g, "")); setShowValidation(false); }}
                onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                placeholder="Número do Lote"
                maxLength={12}
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
              <FloatSelect label="Documento" value={documento} onChange={changeDocumento} options={DOCUMENTOS_BUSCA_OPTIONS} />
              {documento === "GTA" && <FloatInput label="Série" value={serie} onChange={(value) => setSerie(value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 2))} maxLength={2} />}
              {documento === "GTA" && <FloatInput label="Número da GTA" value={numeroGta} onChange={(value) => setNumeroGta(value.replace(/\D/g, ""))} maxLength={12} />}
              {documento === "PTV" && <FloatInput label="Número da PTV" value={numeroPtv} onChange={(value) => setNumeroPtv(value.replace(/\D/g, ""))} maxLength={12} />}
              <FloatInput label="Data de Pagamento (Usuário)" type="date" value={dataUsuario} onChange={setDataUsuario} />
              <FloatInput label="Data de Pagamento (PRODEMGE)" type="date" value={dataProdemge} onChange={setDataProdemge} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_LOTE_OPTIONS} />
              <FloatSelect label="Status do Pagamento" value={statusPagamento} onChange={setStatusPagamento} options={STATUS_PAGAMENTO_OPTIONS} />
              <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] text-sm font-semibold text-white hover:bg-[#15612F]">Pesquisar</button>
            </div>
          )}

          {showValidation && <p className="text-sm font-medium text-red-500">Utilize o campo de busca ou selecione um filtro para visualizar os resultados.</p>}
          {hasFilter && (
            <div className="flex flex-wrap gap-2">
              {numeroLote && <FilterChip label={`Número do Lote: ${numeroLote}`} onRemove={() => clear(setNumeroLote)} />}
              {documento && <FilterChip label={`Documento: ${documento}`} onRemove={() => changeDocumento("")} />}
              {serie && <FilterChip label={`Série: ${serie}`} onRemove={() => clear(setSerie)} />}
              {numeroGta && <FilterChip label={`GTA: ${numeroGta}`} onRemove={() => clear(setNumeroGta)} />}
              {numeroPtv && <FilterChip label={`PTV: ${numeroPtv}`} onRemove={() => clear(setNumeroPtv)} />}
              {dataUsuario && <FilterChip label={`Pagamento (Usuário): ${formatarDataLote(dataUsuario)}`} onRemove={() => clear(setDataUsuario)} />}
              {dataProdemge && <FilterChip label={`Pagamento (PRODEMGE): ${formatarDataLote(dataProdemge)}`} onRemove={() => clear(setDataProdemge)} />}
              {situacao && <FilterChip label={`Situação: ${situacao}`} onRemove={() => clear(setSituacao)} />}
              {statusPagamento && <FilterChip label={`Status: ${statusPagamento}`} onRemove={() => clear(setStatusPagamento)} />}
            </div>
          )}

          {!searched ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque lotes de pagamento utilizando o número do lote ou os filtros acima.</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {headers.map(({ key, label }) => (
                      <th key={key} onClick={() => ordenar(key)} className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold uppercase text-gray-600">
                        <span className="inline-flex items-center gap-1">{label}{sortKey === key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span>
                      </th>
                    ))}
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{item.documento}</td>
                      <td className="px-4 py-3 text-gray-700">{item.numeroLote}</td>
                      <td className="px-4 py-3 text-gray-700">{formatarDataLote(item.dataPagamentoUsuario)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatarDataLote(item.dataPagamentoProdemge)}</td>
                      <td className="px-4 py-3 text-gray-700">{item.situacao}</td>
                      <td className="px-4 py-3 text-gray-700">{item.statusPagamento}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button type="button" onClick={() => onNavigate("visualizar-lote-pagamento", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50" title="Visualizar"><Eye size={18} /></button>
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
