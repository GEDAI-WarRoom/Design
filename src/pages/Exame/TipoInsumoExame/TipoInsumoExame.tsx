import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import { DOENCAS_MOCK } from "../../../components/ui/EntitySearch";
import {
  formatarDoencas,
  listarTiposInsumoExame,
  SITUACOES_TIPO_INSUMO_EXAME,
  type TipoInsumoExame,
} from "./tipoInsumoExameData";

const GREEN = "#1A7A3C";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove}>
        <X size={14} />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function TipoInsumoExamePage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const temFiltroAtivo = nome.trim() !== "" || !!doenca || situacao !== "";

  const results = useMemo(() => {
    return listarTiposInsumoExame().filter((item) => {
      const matchNome = nome.trim() === "" || item.nome.toLowerCase().includes(nome.trim().toLowerCase());
      const matchDoenca = !doenca || item.doencas.some((itemDoenca) => itemDoenca.nome === doenca.nome);
      const matchSituacao = situacao === "" || item.situacao === situacao;
      return matchNome && matchDoenca && matchSituacao;
    });
  }, [nome, doenca, situacao]);

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

  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-insumo-exame" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Tipo de Insumo de Exame</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-tipo-insumo-exame")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${nome ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome do Tipo de Insumo
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={nome}
                  maxLength={255}
                  onChange={(event) => {
                    setNome(event.target.value);
                    if (erroFiltro) setErroFiltro(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm gap-2`}
              style={{
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end animate-fadeIn">
              <EntitySearchInput
                label="Doença"
                placeholder="Buscar por doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[
                  { label: "Doença", key: "nome" },
                ]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                onChange={(entidade) => setDoenca(entidade)}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                confirmLabel="Selecionar"
              />

              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_TIPO_INSUMO_EXAME}
              />

              <button
                type="button"
                onClick={handlePesquisar}
                className="h-12 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {erroFiltro && (
            <p className="text-sm text-red-500 font-medium">
              Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {nome.trim() && <Chip label={`Nome: ${nome}`} onRemove={() => setNome("")} />}
              {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por tipo de insumo utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Nome do Tipo de Insumo</th>
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Doença</th>
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Situação</th>
                    <th className="px-4 py-3 w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item: TipoInsumoExame) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                      <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{item.nome}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{formatarDoencas(item.doencas)}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">{item.situacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-tipo-insumo-exame", item)}
                            className="p-2 rounded-md hover:bg-green-50 transition"
                            style={{ color: GREEN }}
                            title="Visualizar"
                            aria-label={`Visualizar ${item.nome}`}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate("editar-tipo-insumo-exame", item)}
                            className="p-2 rounded-md hover:bg-green-50 transition"
                            style={{ color: GREEN }}
                            title="Editar"
                            aria-label={`Editar ${item.nome}`}
                          >
                            <Pencil size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {start} - {end} de {results.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
