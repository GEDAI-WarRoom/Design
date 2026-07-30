import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  formatarDataEtapaAtualizacao,
  listarEtapasAtualizacaoCadastral,
  SITUACOES_ETAPA_ATUALIZACAO,
  type EtapaAtualizacaoCadastral,
} from "./etapaAtualizacaoCadastralData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

interface Filtros {
  codigo: string;
  ano: string;
  situacao: string;
}

type SortKey = "codigo" | "ano" | "dataInicio" | "dataFim" | "situacao";

const FILTROS_VAZIOS: Filtros = { codigo: "", ano: "", situacao: "" };

function formatarCodigo(value: string) {
  const digitos = value.replace(/\D/g, "").slice(0, 6);
  return digitos.length > 4
    ? `${digitos.slice(0, 4)}/${digitos.slice(4)}`
    : digitos;
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remover ${label}`}>
        <X size={14} />
      </button>
    </span>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-700">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-gray-900"
      >
        {label}
        {!active ? (
          <ChevronsUpDown size={14} className="text-gray-300" />
        ) : direction === "asc" ? (
          <ChevronUp size={14} className="text-[#1A7A3C]" />
        ) : (
          <ChevronDown size={14} className="text-[#1A7A3C]" />
        )}
      </button>
    </th>
  );
}

export function EtapaAtualizacaoCadastralPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<Filtros>(FILTROS_VAZIOS);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [erroFiltro, setErroFiltro] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pagina, setPagina] = useState(1);
  
  // 🟢 Novo estado para controlar se uma pesquisa foi realizada
  const [foiPesquisado, setFoiPesquisado] = useState(false);

  const itensPorPagina = 10;

  const temFiltroPreenchido = Boolean(
    filtros.codigo.trim() || filtros.ano.trim() || filtros.situacao,
  );
  const temFiltroAplicado = Boolean(
    filtrosAplicados.codigo ||
      filtrosAplicados.ano ||
      filtrosAplicados.situacao,
  );

  const resultados = useMemo(() => {
    if (!foiPesquisado) return []; // Se não foi pesquisado, não traz resultados

    const filtrados = listarEtapasAtualizacaoCadastral().filter(
      (item) =>
        (!filtrosAplicados.codigo ||
          item.codigo.includes(filtrosAplicados.codigo)) &&
        (!filtrosAplicados.ano ||
          String(item.ano).includes(filtrosAplicados.ano)) &&
        (!filtrosAplicados.situacao ||
          item.situacao === filtrosAplicados.situacao),
    );

    return [...filtrados].sort((a, b) => {
      if (!sortKey) return 0;
      const primeiro = String(a[sortKey]);
      const segundo = String(b[sortKey]);
      return sortDirection === "asc"
        ? primeiro.localeCompare(segundo, "pt-BR")
        : segundo.localeCompare(primeiro, "pt-BR");
    });
  }, [filtrosAplicados, sortDirection, sortKey, foiPesquisado]);

  const pesquisar = () => {
    if (!temFiltroPreenchido) {
      setErroFiltro(
        "Preencha o código ou selecione ao menos um filtro para pesquisar.",
      );
      return;
    }
    if (filtros.codigo && filtros.codigo.length !== 7) {
      setErroFiltro("Informe o código completo no formato AAAA/NN.");
      return;
    }
    if (filtros.ano && filtros.ano.length !== 4) {
      setErroFiltro("Informe o ano com quatro dígitos.");
      return;
    }
    setErroFiltro("");
    setFiltrosAplicados(filtros);
    setFoiPesquisado(true); // 🟢 Marca que a pesquisa foi executada
    setPagina(1);
  };

  const removerFiltro = (campo: keyof Filtros) => {
    const novosFiltros = { ...filtros, [campo]: "" };
    const novosAplicados = { ...filtrosAplicados, [campo]: "" };
    setFiltros(novosFiltros);
    setFiltrosAplicados(novosAplicados);

    // Se todos os filtros forem removidos, oculta a tabela novamente
    if (!novosAplicados.codigo && !novosAplicados.ano && !novosAplicados.situacao) {
      setFoiPesquisado(false);
    }
    setPagina(1);
  };

  const ordenar = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPagina(1);
  };

  const totalPaginas = Math.max(
    1,
    Math.ceil(resultados.length / itensPorPagina),
  );
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = resultados.length
    ? (paginaAtual - 1) * itensPorPagina + 1
    : 0;
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
        currentScreen="etapa-atualizacao-cadastral"
        hideSearch
      />

      <main className="mx-auto max-w-[1088px] px-4 py-6 md:px-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Etapa de Atualização Cadastral
            </h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-etapa-atualizacao-cadastral")}
              className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-stretch gap-3">
            <div
              className={`relative flex h-12 flex-1 items-center rounded-md border bg-white px-3 transition ${
                erroFiltro && !temFiltroPreenchido
                  ? "border-red-400 ring-1 ring-red-300"
                  : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"
              }`}
            >
              <input
                type="text"
                value={filtros.codigo}
                onChange={(event) => {
                  setFiltros((value) => ({
                    ...value,
                    codigo: formatarCodigo(event.target.value),
                  }));
                  setErroFiltro("");
                }}
                onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                maxLength={7}
                placeholder="Buscar por código da etapa de atualização cadastral"
                aria-label="Código da etapa de atualização cadastral"
                className="h-full w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={pesquisar}
                className="ml-2 text-[#1A7A3C]"
                aria-label="Pesquisar por código"
              >
                <Search size={17} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setFiltrosAbertos((value) => !value)}
              className="flex w-16 flex-shrink-0 items-center justify-center rounded-md border transition"
              style={{
                backgroundColor: filtrosAbertos ? "transparent" : GREEN,
                borderColor: GREEN,
                color: filtrosAbertos ? GREEN : "#ffffff",
              }}
              aria-label="Exibir filtros"
              aria-expanded={filtrosAbertos}
            >
              <SlidersHorizontal size={19} />
            </button>
          </div>

          {filtrosAbertos && (
            <div className="mt-4 grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <FloatInput
                label="Ano"
                value={filtros.ano}
                onChange={(ano) => {
                  setFiltros((value) => ({
                    ...value,
                    ano: ano.replace(/\D/g, "").slice(0, 4),
                  }));
                  setErroFiltro("");
                }}
                maxLength={4}
              />
              <FloatSelect
                label="Situação"
                value={filtros.situacao}
                onChange={(situacao) => {
                  setFiltros((value) => ({ ...value, situacao }));
                  setErroFiltro("");
                }}
                options={SITUACOES_ETAPA_ATUALIZACAO}
              />
              <button
                type="button"
                onClick={pesquisar}
                className="h-12 rounded-md bg-[#1A7A3C] px-7 text-sm font-semibold text-white hover:bg-[#15612F]"
              >
                Pesquisar
              </button>
            </div>
          )}

          {erroFiltro && (
            <p className="mt-3 text-sm font-medium text-red-500">
              {erroFiltro}
            </p>
          )}

          {temFiltroAplicado && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filtrosAplicados.codigo && (
                <Chip
                  label={`Código: ${filtrosAplicados.codigo}`}
                  onRemove={() => removerFiltro("codigo")}
                />
              )}
              {filtrosAplicados.ano && (
                <Chip
                  label={`Ano: ${filtrosAplicados.ano}`}
                  onRemove={() => removerFiltro("ano")}
                />
              )}
              {filtrosAplicados.situacao && (
                <Chip
                  label={`Situação: ${filtrosAplicados.situacao}`}
                  onRemove={() => removerFiltro("situacao")}
                />
              )}
            </div>
          )}

          {/* 🟢 Renderização condicional da tabela e mensagens */}
          {foiPesquisado && (
            <>
              <div className="mt-5 overflow-x-auto border-t border-gray-100">
                {linhas.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    Nenhum resultado foi encontrado.
                  </div>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <SortableHeader
                          label="Código"
                          sortKey="codigo"
                          activeKey={sortKey}
                          direction={sortDirection}
                          onSort={ordenar}
                        />
                        <SortableHeader
                          label="Ano"
                          sortKey="ano"
                          activeKey={sortKey}
                          direction={sortDirection}
                          onSort={ordenar}
                        />
                        <SortableHeader
                          label="Data do Início"
                          sortKey="dataInicio"
                          activeKey={sortKey}
                          direction={sortDirection}
                          onSort={ordenar}
                        />
                        <SortableHeader
                          label="Data do Fim"
                          sortKey="dataFim"
                          activeKey={sortKey}
                          direction={sortDirection}
                          onSort={ordenar}
                        />
                        <SortableHeader
                          label="Situação"
                          sortKey="situacao"
                          activeKey={sortKey}
                          direction={sortDirection}
                          onSort={ordenar}
                        />
                        <th className="w-[92px] px-3 py-3" aria-label="Ações" />
                      </tr>
                    </thead>
                    <tbody>
                      {linhas.map((item: EtapaAtualizacaoCadastral) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                        >
                          <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                            {item.codigo}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                            {item.ano}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                            {formatarDataEtapaAtualizacao(item.dataInicio)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                            {formatarDataEtapaAtualizacao(item.dataFim)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                            {item.situacao}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate(
                                    "visualizar-etapa-atualizacao-cadastral",
                                    item,
                                  )
                                }
                                className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"
                                title="Visualizar"
                                aria-label={`Visualizar etapa ${item.codigo}`}
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate(
                                    "editar-etapa-atualizacao-cadastral",
                                    item,
                                  )
                                }
                                className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"
                                title="Editar"
                                aria-label={`Editar etapa ${item.codigo}`}
                              >
                                <Pencil size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {resultados.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                  <span>Itens por página: {itensPorPagina}</span>
                  <div className="flex items-center gap-3">
                    <span>
                      Mostrando de {inicio} a {fim} de {resultados.length} resultado
                      {resultados.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPagina((value) => Math.max(1, value - 1))}
                      disabled={paginaAtual === 1}
                      className="p-1 text-[#1A7A3C] disabled:opacity-30"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPagina((value) => Math.min(totalPaginas, value + 1))
                      }
                      disabled={paginaAtual === totalPaginas}
                      className="p-1 text-[#1A7A3C] disabled:opacity-30"
                      aria-label="Próxima página"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}