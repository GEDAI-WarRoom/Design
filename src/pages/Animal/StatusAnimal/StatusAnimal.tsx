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
import { FloatSelect } from "../../../components/ui/FormKit";
import {
  listarStatusAnimal,
  SITUACOES_STATUS_ANIMAL,
  type StatusAnimal,
} from "./statusAnimalData";

const GREEN = "#1A7A3C";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}>
        <X size={14} />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function StatusAnimalPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [pesquisado, setPesquisado] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const temFiltro = Boolean(nome.trim() || situacao);
  const resultados = useMemo(
    () =>
      listarStatusAnimal().filter(
        (item) =>
          (!nome.trim() ||
            item.nome.toLowerCase().includes(nome.trim().toLowerCase())) &&
          (!situacao || item.situacao === situacao),
      ),
    [nome, situacao, pesquisado],
  );

  const pesquisar = () => {
    if (!temFiltro) {
      setErroFiltro(true);
      setPesquisado(false);
      return;
    }
    setErroFiltro(false);
    setPesquisado(true);
    setPagina(1);
  };

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = resultados.length ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fim = Math.min(paginaAtual * itensPorPagina, resultados.length);
  const linhas = resultados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="status-animal"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Status Animal</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-status-animal")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition"
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all pointer-events-none ${
                  nome ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }`}
              >
                Nome do Status Animal
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={nome}
                  maxLength={255}
                  onChange={(event) => {
                    setNome(event.target.value);
                    setErroFiltro(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFiltrosAbertos((value) => !value)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0"
              style={{
                backgroundColor: filtrosAbertos ? "transparent" : GREEN,
                borderColor: GREEN,
                color: filtrosAbertos ? GREEN : "#ffffff",
              }}
              aria-label="Exibir filtros"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {filtrosAbertos && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end animate-fadeIn">
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(value) => {
                  setSituacao(value);
                  setErroFiltro(false);
                }}
                options={SITUACOES_STATUS_ANIMAL}
              />
              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition"
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

          {temFiltro && (
            <div className="flex flex-wrap gap-2">
              {nome.trim() && <Chip label={`Nome: ${nome}`} onRemove={() => setNome("")} />}
              {situacao && (
                <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />
              )}
            </div>
          )}

          {!pesquisado ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Busque por um status animal utilizando o campo de busca e os filtros acima.
            </div>
          ) : linhas.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Nenhum resultado foi encontrado.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600">
                      Nome do Status Animal
                    </th>
                    <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600">
                      Situação
                    </th>
                    <th className="px-4 py-3 w-[100px]" aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((item: StatusAnimal) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                    >
                      <td className="px-4 py-3 text-gray-500">{item.nome}</td>
                      <td className="px-4 py-3 text-gray-500">{item.situacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-status-animal", item)}
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                            title="Visualizar"
                            aria-label={`Visualizar ${item.nome}`}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate("editar-status-animal", item)}
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
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
                <span>Itens por página: {itensPorPagina}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {resultados.length}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPagina((value) => Math.max(1, value - 1))}
                      disabled={paginaAtual === 1}
                      className="p-1 disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPagina((value) => Math.min(totalPaginas, value + 1))}
                      disabled={paginaAtual === totalPaginas}
                      className="p-1 disabled:opacity-30"
                    >
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

