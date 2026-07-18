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
  Dna
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import {
  agravoLabel,
  CLASSIFICACOES_SANITARIAS,
  CLASSIFICACOES_SANITARIAS_MOCK,
  classificacaoSanitariaLabel,
  ESTADOS_BRASILEIROS,
  PRAGAS_MOCK,
} from "./classificacaoSanitariaData";
import { DOENCAS_MOCK, EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}><X size={14} /></button>
    </div>
  );
}

export function ClassificacaoSanitariaEstadoPage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [classificacao, setClassificacao] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [doenca, setDoenca] = useState<any>(null);
  const [praga, setPraga] = useState<any>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const results = useMemo(() => CLASSIFICACOES_SANITARIAS_MOCK.filter((item) =>
    item.classificacao === classificacao
    && (!estado || item.estado === estado)
    && (!tipo || item.tipo === tipo)
    && (!doenca || item.doenca === doenca)
    && (!praga || item.praga === praga),
  ), [classificacao, estado, tipo, doenca, praga, searched]);

  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  const pesquisar = () => {
    const invalido = !classificacao;
    setError(invalido);
    setSearched(!invalido);
    setPage(1);
  };

  const alterarTipo = (next: string) => {
    setTipo(next);
    setDoenca("");
    setPraga("");
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="classificacao-sanitaria-estado" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} />Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Classificação Sanitária por Estado</h1>
            <button type="button" onClick={() => onNavigate("adicionar-classificacao-sanitaria-estado")} className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]">
              Adicionar Nova
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Grid Principal - 4 campos por linha em telas grandes (lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">


            <FloatSelect label="Estado" value={estado} onChange={setEstado} options={ESTADOS_BRASILEIROS} />

            <FloatSelect
              label="Classificação Sanitária"
              required
              value={classificacao}
              onChange={(next) => { setClassificacao(next); setError(false); }}
              options={CLASSIFICACOES_SANITARIAS}
            />
            <FloatSelect
              label="Animal ou Vegetal?"
              value={tipo}
              onChange={alterarTipo}
              options={[
                { value: "Animal", label: "Animal" },
                { value: "Vegetal", label: "Vegetal" },
              ]}
            />

            {/* Ocupa o quarto slot perfeitamente se "Animal" estiver ativo */}
            {tipo === "Animal" && (
              <EntitySearchInput
                label="Doença"
                required
                placeholder="Buscar pelo nome da doença."
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<Dna size={18} color={GREEN} />} // Se não tiver a variável GREEN declarada neste arquivo, use uma cor string ex: "#1A7A3C"
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={(ent) => setDoenca(ent)} // Garanta que seu estado 'doenca' armazene o objeto ou ajuste para setDoenca(ent ? ent.nome : "") se preferir salvar apenas a string
              />
            )}

            {/* Ocupa o quarto slot perfeitamente se "Vegetal" estiver ativo */}
            {tipo === "Vegetal" && (
              <EntitySearchInput
                label="Praga"
                required
                placeholder="Buscar pelo nome da praga."
                value={praga ? praga.nome : ""}
                data={PRAGAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Praga", key: "nome" }]}
                icon={<img src={Icons.iconePragaUrl} alt="Praga" className="w-5 h-5 object-contain" />}
                title="Buscar Praga"
                subtitle="Busque por uma praga cadastrada:"
                onChange={(ent) => setPraga(ent)} // Garanta que seu estado 'praga' armazene o objeto ou ajuste para setPraga(ent ? ent.nome : "") se necessário
              />
            )}

            <button
              type="button"
              onClick={pesquisar}
              className="px-5 py-2 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] flex items-center gap-2 transition-colors"
            >
              <Search size={17} />Pesquisar
            </button>
          </div>


          {error && <p className="text-sm text-red-500 font-medium">Busque por uma classificação sanitária por estado utilizando o campo de busca e os filtros acima.</p>}

          {(classificacao || estado || tipo || doenca || praga) && (
            <div className="flex flex-wrap gap-2">
              {classificacao && <Chip label={`Classificação: ${classificacaoSanitariaLabel(classificacao)}`} onRemove={() => setClassificacao("")} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => setEstado("")} />}
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => alterarTipo("")} />}
              {doenca && <Chip label={`Doença: ${doenca}`} onRemove={() => setDoenca("")} />}
              {praga && <Chip label={`Praga: ${praga}`} onRemove={() => setPraga("")} />}
            </div>
          )}

          {!searched ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque por uma classificação sanitária por estado utilizando o campo de busca e os filtros acima.</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Estado",
                      "Animal ou Vegetal?",
                      "Doença ou Praga",
                      "Classificação Sanitária",
                    ].map((label) => <th key={label} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">{label}</th>)}
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{item.estado}</td>
                      <td className="px-4 py-3 text-gray-700">{item.tipo}</td>
                      <td className="px-4 py-3 text-gray-700">{agravoLabel(item)}</td>
                      <td className="px-4 py-3 text-gray-700">{classificacaoSanitariaLabel(item.classificacao)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => onNavigate("visualizar-classificacao-sanitaria-estado", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Visualizar"><Eye size={18} /></button>
                          <button type="button" onClick={() => onNavigate("editar-classificacao-sanitaria-estado", item)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" title="Editar"><Pencil size={17} /></button>
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
    </div >
  );
}