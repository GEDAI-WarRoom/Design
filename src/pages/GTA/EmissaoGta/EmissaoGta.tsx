import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Pencil,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  EMISSOES_GTA_MOCK,
  TIPOS_FORMULARIO_GTA,
  TIPOS_PROCEDENCIA_GTA,
  formatarDataGta,
  type EmissaoGta,
} from "./emissaoGtaData";

type SortKey =
  | "numeroGta"
  | "tipoFormulario"
  | "dataEmissao"
  | "produtor";

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover ${label}`}>
        <X size={14} />
      </button>
    </div>
  );
}

export function EmissaoGtaPage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [numeroGta, setNumeroGta] = useState("");
  const [tipoFormulario, setTipoFormulario] = useState("");
  const [tipoProcedencia, setTipoProcedencia] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const resultados = useMemo(() => {
    const numeroNormalizado = numeroGta.replace(/\D/g, "");
    const filtrados = EMISSOES_GTA_MOCK.filter(
      (item) =>
        (!numeroNormalizado || item.numeroGta.includes(numeroNormalizado)) &&
        (!tipoFormulario || item.tipoFormulario === tipoFormulario) &&
        (!tipoProcedencia || item.tipoProcedencia === tipoProcedencia),
    );

    if (!sortKey) return filtrados;

    return [...filtrados].sort((a, b) => {
      const primeiro =
        sortKey === "produtor" ? a.produtor.nome : a[sortKey] || "";
      const segundo =
        sortKey === "produtor" ? b.produtor.nome : b[sortKey] || "";
      return sortAsc
        ? primeiro.localeCompare(segundo)
        : segundo.localeCompare(primeiro);
    });
  }, [numeroGta, tipoFormulario, tipoProcedencia, sortKey, sortAsc]);

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
  const possuiFiltros = Boolean(
    numeroGta || tipoFormulario || tipoProcedencia,
  );

  const pesquisar = () => {
    setPesquisou(true);
    setPagina(1);
  };

  const ordenar = (key: SortKey) => {
    setSortAsc(key === sortKey ? !sortAsc : true);
    setSortKey(key);
  };

  const cabecalho = (key: SortKey, texto: string) => (
    <th
      onClick={() => ordenar(key)}
      className="text-left px-4 py-3 font-semibold text-gray-600 uppercase cursor-pointer"
    >
      <span className="inline-flex items-center gap-1">
        {texto}
        {sortKey === key &&
          (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Emissão de GTA
            </h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-emissao-gta")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
            <div className="flex-1 w-full">
              <FloatInput
                label="Número da GTA"
                value={numeroGta}
                maxLength={6}
                onChange={(valor) =>
                  setNumeroGta(valor.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltrosAbertos((aberto) => !aberto)}
              className="h-12 w-full sm:w-auto px-4 rounded-md border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <SlidersHorizontal size={17} />
              Mais filtros
              {filtrosAbertos ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            <button
              type="button"
              onClick={pesquisar}
              className="h-12 w-full sm:w-auto px-5 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Pesquisar
            </button>
          </div>

          {filtrosAbertos && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 animate-fadeIn">
              <FloatSelect
                label="Tipo de Formulário"
                value={tipoFormulario}
                onChange={setTipoFormulario}
                options={TIPOS_FORMULARIO_GTA}
              />
              <FloatSelect
                label="Tipo de Procedência"
                value={tipoProcedencia}
                onChange={setTipoProcedencia}
                options={TIPOS_PROCEDENCIA_GTA}
              />
            </div>
          )}

          {possuiFiltros && (
            <div className="flex flex-wrap gap-2">
              {numeroGta && (
                <FilterChip
                  label={`Número da GTA: ${numeroGta}`}
                  onRemove={() => setNumeroGta("")}
                />
              )}
              {tipoFormulario && (
                <FilterChip
                  label={`Tipo de Formulário: ${tipoFormulario}`}
                  onRemove={() => setTipoFormulario("")}
                />
              )}
              {tipoProcedencia && (
                <FilterChip
                  label={`Tipo de Procedência: ${tipoProcedencia}`}
                  onRemove={() => setTipoProcedencia("")}
                />
              )}
            </div>
          )}

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Utilize os filtros acima para buscar emissões de GTA.
            </div>
          ) : resultados.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Nenhum resultado foi encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {cabecalho("numeroGta", "Número da GTA")}
                    {cabecalho("tipoFormulario", "Tipo de Formulário")}
                    {cabecalho("dataEmissao", "Data de Emissão")}
                    {cabecalho("produtor", "Produtor")}
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                      Propriedade
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((item: EmissaoGta) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {item.numeroGta || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.tipoFormulario}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatarDataGta(item.dataEmissao)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.produtor.nome}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.propriedade.nome}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate("visualizar-emissao-gta", item)
                            }
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate("editar-emissao-gta", item)
                            }
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
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
                  <span>
                    {inicio} - {fim} de {resultados.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPagina((valor) => Math.max(1, valor - 1))
                    }
                    disabled={paginaAtual === 1}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPagina((valor) => Math.min(totalPaginas, valor + 1))
                    }
                    disabled={paginaAtual === totalPaginas}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
