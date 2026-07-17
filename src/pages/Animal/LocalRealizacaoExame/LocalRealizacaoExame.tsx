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
import {
  formatarProprietarios,
  listarLocaisRealizacaoExame,
  PROPRIETARIOS_LOCAL_EXAME,
  SITUACOES_LOCAL_EXAME,
  VETERINARIOS_EXAME_MOCK,
} from "./localRealizacaoExameData";

const GREEN = "#1A7A3C";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button type="button" onClick={onRemove} className="flex-shrink-0 hover:opacity-80">
        <X size={14} />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function LocalRealizacaoExamePage({ onLogout, onNavigate }: PageProps) {
  const [codigo, setCodigo] = useState("");
  const [proprietario, setProprietario] = useState<any | null>(null);
  const [veterinario, setVeterinario] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const resultados = useMemo(() => listarLocaisRealizacaoExame().filter((item) => {
    const matchCodigo = codigo.trim() === "" || item.codigo.includes(codigo.trim());
    const matchProprietario = !proprietario || item.proprietarios.some((itemProprietario) => itemProprietario.id === proprietario.id);
    const matchVeterinario = !veterinario || item.veterinarios.some((itemVeterinario) => itemVeterinario.id === veterinario.id);
    const matchSituacao = situacao === "" || item.situacao === situacao;
    return matchCodigo && matchProprietario && matchVeterinario && matchSituacao;
  }), [codigo, proprietario, veterinario, situacao, hasSearched]);

  const totalPages = Math.max(1, Math.ceil(resultados.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = resultados.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, resultados.length);
  const rows = resultados.slice((currentPage - 1) * perPage, currentPage * perPage);
  const temFiltroAtivo = !!proprietario || !!veterinario || !!situacao;

  const pesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="local-realizacao-exame" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Locais de Realização de Exame</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-local-realizacao-exame")}
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
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${codigo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Código do Local de Realização de Exame
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={codigo}
                  onChange={(event) => setCodigo(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0"
              style={{
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
              title="Exibir filtros"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end animate-fadeIn">
              <EntitySearchInput
                label="Proprietário"
                placeholder="Buscar por nome ou CPF/CNPJ"
                value={proprietario?.nome ?? ""}
                data={PROPRIETARIOS_LOCAL_EXAME}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome / Razão Social", key: "nome" },
                  { label: "CPF / CNPJ", key: "documento" },
                ]}
                icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />}
                title="Buscar Proprietário"
                subtitle="Busque por uma pessoa física ou jurídica cadastrada no sistema:"
                onChange={setProprietario}
              />

              <EntitySearchInput
                label="Médico Veterinário"
                placeholder="Buscar por nome ou CPF"
                value={veterinario?.nome ?? ""}
                data={VETERINARIOS_EXAME_MOCK.filter((item) => item.habilitado)}
                searchKeys={["nome", "cpf", "examesFormatados"]}
                columns={[
                  { label: "Médico Veterinário", key: "nome" },
                  { label: "CPF", key: "cpf" },
                  { label: "Exames", key: "examesFormatados" },
                ]}
                icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-5 h-5 object-contain" />}
                title="Buscar Médico Veterinário"
                subtitle="Busque por um médico veterinário habilitado para realização de exame:"
                onChange={setVeterinario}
              />

              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_LOCAL_EXAME}
              />

              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {veterinario && <Chip label={`Médico Veterinário: ${veterinario.nome}`} onRemove={() => setVeterinario(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por local de realização de exame utilizando o código ou os filtros acima.</p>
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
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600">Código</th>
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600">Proprietários</th>
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600">Situação</th>
                    <th className="px-4 py-3 w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                      <td className="px-4 py-3 text-gray-500">{item.codigo}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-normal">{formatarProprietarios(item.proprietarios)}</td>
                      <td className="px-4 py-3 text-gray-500">{item.situacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-local-realizacao-exame", item)}
                            className="p-2 rounded-md hover:bg-green-50 transition"
                            style={{ color: GREEN }}
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate("editar-local-realizacao-exame", item)}
                            className="p-2 rounded-md hover:bg-green-50 transition"
                            style={{ color: GREEN }}
                            title="Editar"
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
                  <span>{start} - {end} de {resultados.length}</span>
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
