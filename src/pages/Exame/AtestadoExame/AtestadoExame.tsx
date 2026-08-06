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
  DOENCAS_ATESTADO_EXAME,
  formatarDoencas,
  listarAtestadosExame,
  SITUACOES_ATESTADO_EXAME,
  type DoencaAtestadoExame,
} from "./atestadoExameData";

const GREEN = "#1A7A3C";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}>
        <X size={14} />
      </button>
    </div>
  );
}

export function AtestadoExamePage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [descricao, setDescricao] = useState("");
  const [doenca, setDoenca] = useState<DoencaAtestadoExame | null>(null);
  const [situacao, setSituacao] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const temFiltro = Boolean(descricao.trim() || doenca || situacao);
  const resultados = useMemo(
    () =>
      listarAtestadosExame().filter((item) => {
        const correspondeDescricao =
          !descricao.trim() ||
          item.descricao.toLowerCase().includes(descricao.trim().toLowerCase());
        const correspondeDoenca =
          !doenca || item.doencas.some((itemDoenca) => itemDoenca.id === doenca.id);
        const correspondeSituacao = !situacao || item.situacao === situacao;
        return correspondeDescricao && correspondeDoenca && correspondeSituacao;
      }),
    [descricao, doenca, situacao],
  );

  const pesquisar = () => {
    if (!temFiltro) {
      setErroFiltro(true);
      setPesquisou(false);
      return;
    }
    setErroFiltro(false);
    setPesquisou(true);
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
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Tipo de Atestado</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-atestado-exame")}
              className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-stretch gap-3">
            <div className="relative flex h-12 flex-1 items-end rounded-md border border-gray-200 bg-white px-3 pb-1.5 transition-all focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`pointer-events-none absolute left-3 transition-all ${descricao
                    ? "top-1 text-[10px] font-medium text-gray-400"
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                  }`}
              >
                Descrição do atestado
              </label>
              <div className="flex w-full items-center">
                <input
                  type="text"
                  value={descricao}
                  maxLength={255}
                  onChange={(event) => {
                    setDescricao(event.target.value);
                    setErroFiltro(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                  className="h-6 w-full bg-transparent text-sm text-gray-800 outline-none"
                />
                <Search size={16} className="ml-2 text-gray-400" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFiltrosAbertos((valor) => !valor)}
              className="flex w-12 items-center justify-center rounded-md border border-[#1A7A3C]"
              style={{
                backgroundColor: filtrosAbertos ? "white" : GREEN,
                color: filtrosAbertos ? GREEN : "white",
              }}
              title="Exibir filtros"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

          {filtrosAbertos && (
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
              <EntitySearchInput
                label="Doença"
                placeholder="Buscar por doença"
                value={doenca?.nome ?? ""}
                data={DOENCAS_ATESTADO_EXAME}
                searchKeys={["nome"]}
                columns={[
                  { label: "Doença", key: "nome" },
                ]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="h-5 w-5 object-contain" />}
                onChange={setDoenca}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada no sistema:"
                confirmLabel="Selecionar"
                showResultsOnOpen
              />
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_ATESTADO_EXAME}
              />
              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md bg-[#1A7A3C] text-sm font-semibold text-white hover:opacity-90"
              >
                Pesquisar
              </button>
            </div>
          )}

          {erroFiltro && (
            <p className="text-sm font-medium text-red-500">
              Preencha a descrição ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {temFiltro && (
            <div className="flex flex-wrap gap-2">
              {descricao.trim() && <Chip label={`Descrição: ${descricao}`} onRemove={() => setDescricao("")} />}
              {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Busque por tipo de atestado utilizando a descrição ou os filtros acima.
            </div>
          ) : linhas.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Nenhum resultado foi encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 uppercase text-gray-600">
                    <th className="px-4 py-3 font-semibold">Descrição do atestado</th>
                    <th className="px-4 py-3 font-semibold">Doença</th>
                    <th className="px-4 py-3 font-semibold">Situação</th>
                    <th className="w-[100px] px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{item.descricao}</td>
                      <td className="px-4 py-3 text-gray-600">{formatarDoencas(item.doencas)}</td>
                      <td className="px-4 py-3 text-gray-600">{item.situacao}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onNavigate("visualizar-atestado-exame", item)}
                            className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate("editar-atestado-exame", item)}
                            className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"
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
                <span>Itens por página: {itensPorPagina}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {resultados.length}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPagina((valor) => Math.max(1, valor - 1))} disabled={paginaAtual === 1} className="p-1 disabled:opacity-30">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))} disabled={paginaAtual === totalPaginas} className="p-1 disabled:opacity-30">
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
