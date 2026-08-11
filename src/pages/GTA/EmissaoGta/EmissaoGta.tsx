import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCopy,
  ContactRound,
  Copy,
  Dna,
  DollarSign,
  Eye,
  Factory,
  FileCheck2,
  FileDown,
  Landmark,
  Plane,
  Pencil,
  Search,
  SlidersHorizontal,
  Store,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  AEROPORTOS_GTA,
  ESTABELECIMENTOS_GTA,
  EVENTOS_GTA,
  EXPLORACOES_GTA,
  FRIGORIFICOS_GTA,
  NUCLEOS_GTA,
  PESSOAS_GTA,
  REVENDEDORAS_ANIMAIS_GTA,
  SITUACOES_GTA,
  TIPOS_FORMULARIO_GTA,
  TIPOS_LOCAL_OPTIONS,
  copiarEmissaoGta,
  listarEmissoesGta,
  listarEspeciesGta,
  listarFinalidadesGta,
  criarLocalVazio,
  formatarDataGta,
  frigorificoAderidoAoFundo,
  type EmissaoGta,
  type EntidadeGta,
  type LocalGta,
  type TipoLocalGta,
} from "./emissaoGtaData";
import * as Icons from "../../../imports/icons";

type SortKey =
  | "serieNumero"
  | "tipoFormulario"
  | "especie"
  | "finalidade"
  | "procedencia"
  | "destino"
  | "dataEmissao"
  | "situacao";

function SearchEntityField({
  label,
  value,
  data,
  onChange,
  codeKey = "codigo",
  icon,
  columns,
  searchKeys,
}: {
  label: string;
  value: EntidadeGta | null;
  data: EntidadeGta[];
  onChange: (entidade: any) => void;
  codeKey?: "codigo" | "documento";
  icon: ReactNode;
  columns?: { label: string; key: string }[];
  searchKeys?: string[];
}) {
  return (
    <EntitySearchInput
      label={label}
      placeholder={`Buscar ${label.toLowerCase()}`}
      value={value?.nome ?? ""}
      data={data}
      searchKeys={searchKeys ?? ["nome", codeKey]}
      columns={columns ?? [
        { label, key: "nome" },
        {
          label: codeKey === "documento" ? "CPF/CNPJ" : "Código",
          key: codeKey,
        },
      ]}
      icon={icon}
      title={`Buscar ${label}`}
      subtitle={`Busque por ${label.toLowerCase()} cadastrado no sistema:`}
      confirmLabel="Selecionar"
      onChange={onChange}
    />
  );
}

function LocalFilters({
  titulo,
  local,
  onChange,
}: {
  titulo: "Origem" | "Destino";
  local: LocalGta;
  onChange: (local: LocalGta) => void;
}) {
  const update = (patch: Partial<LocalGta>) => onChange({ ...local, ...patch });
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <span className="w-14 flex-shrink-0 text-xs font-medium text-gray-600">
        {titulo}:
      </span>
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SearchEntityField
          label={
            titulo === "Origem"
              ? "Responsável de Procedência"
              : "Responsável de Destino"
          }
          value={local.responsavel}
          data={PESSOAS_GTA}
          codeKey="documento"
          icon={<img src={Icons.iconeFornecedorUrl} alt="" className="w-5 h-5 object-contain" />}
          onChange={(responsavel) => update({ responsavel })}
        />

        {local.tipo === "Estabelecimento Agropecuário" && (
          <>
            <SearchEntityField
              label="Estabelecimento Agropecuário"
              value={local.estabelecimento}
              data={ESTABELECIMENTOS_GTA}
              searchKeys={["nome", "codigo", "municipio", "proprietarios"]}
              columns={[
                { label: "Estabelecimento", key: "nome" },
                { label: "Código", key: "codigo" },
                { label: "Município", key: "municipio" },
                { label: "Proprietários", key: "proprietarios" },
              ]}
              icon={<img src={Icons.iconeEstabelecimentoUrl} alt="" className="w-5 h-5 object-contain" />}
              onChange={(estabelecimento) => update({ estabelecimento })}
            />
            <SearchEntityField
              label="Exploração Pecuária"
              value={local.exploracao}
              data={EXPLORACOES_GTA}
              searchKeys={["codigo", "especie", "produtores"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Espécie", key: "especie" },
                { label: "Produtores", key: "produtores" },
              ]}
              icon={<img src={Icons.iconeExploracaoUrl} alt="" className="w-5 h-5 object-contain" />}
              onChange={(exploracao) => update({ exploracao })}
            />
            <SearchEntityField
              label="Núcleo de Produção"
              value={local.nucleo}
              data={NUCLEOS_GTA}
              searchKeys={["nome", "produtores"]}
              columns={[
                { label: "Núcleo", key: "nome" },
                { label: "Produtores", key: "produtores" },
              ]}
              icon={<img src={Icons.iconeNucleoProducaoUrl} alt="" className="w-5 h-5 object-contain" />}
              onChange={(nucleo) => update({ nucleo })}
            />
          </>
        )}

        {local.tipo === "Frigorífico" && (
          <SearchEntityField
            label="Frigorífico"
            value={local.frigorifico}
            data={FRIGORIFICOS_GTA}
            icon={<img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="" className="w-5 h-5 object-contain" />}
            onChange={(frigorifico) => update({ frigorifico })}
          />
        )}

        {local.tipo === "Evento Pecuário" && (
          <SearchEntityField
            label="Evento Pecuário"
            value={local.evento}
            data={EVENTOS_GTA}
            icon={<Calendar size={20} />}
            onChange={(evento) => update({ evento })}
          />
        )}

        {local.tipo === "Revendedora de Animais Vivos" && (
          <SearchEntityField
            label="Revendedora de Animais Vivos"
            value={local.revendedora}
            data={REVENDEDORAS_ANIMAIS_GTA}
            icon={<Store size={20} />}
            onChange={(revendedora) => update({ revendedora })}
          />
        )}

        {local.tipo === "Estabelecimento Genérico" && (
          <SearchEntityField
            label="Estabelecimento Genérico"
            value={local.aeroporto}
            data={AEROPORTOS_GTA}
            icon={<Building2 size={20} />}
            onChange={(aeroporto) => update({ aeroporto })}
          />
        )}
      </div>
    </div>
  );
}

function entidadeLocal(local: LocalGta) {
  return (
    local.nucleo ??
    local.exploracao ??
    local.estabelecimento ??
    local.frigorifico ??
    local.evento ??
    local.revendedora ??
    local.aeroporto
  );
}

function descricaoLocal(local: LocalGta) {
  const entidade = entidadeLocal(local);
  if (!entidade) return local.tipo || "-";
  return `${entidade.codigo ? `${entidade.codigo} - ` : ""}${entidade.nome}`;
}

function localCompativel(registro: LocalGta, filtro: LocalGta) {
  if (filtro.tipo && registro.tipo !== filtro.tipo) return false;
  if (filtro.responsavel && registro.responsavel?.id !== filtro.responsavel.id)
    return false;
  const entidadeFiltro = entidadeLocal(filtro);
  return !entidadeFiltro || entidadeLocal(registro)?.id === entidadeFiltro.id;
}

function sortableValue(item: EmissaoGta, key: SortKey) {
  if (key === "especie") return item.especie?.nome ?? "";
  if (key === "finalidade") return item.finalidade?.nome ?? "";
  if (key === "procedencia") return descricaoLocal(item.procedencia);
  if (key === "destino") return descricaoLocal(item.destino);
  return item[key] ?? "";
}

function ActionButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="p-1 text-[#00884A] hover:bg-green-50 rounded transition"
    >
      {children}
    </button>
  );
}

export function EmissaoGtaPage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [serieNumero, setSerieNumero] = useState("");
  const [tipoFormulario, setTipoFormulario] = useState("");
  const [especie, setEspecie] = useState<EntidadeGta | null>(null);
  const [finalidade, setFinalidade] = useState<EntidadeGta | null>(null);
  const [dataEmissao, setDataEmissao] = useState("");
  const [procedencia, setProcedencia] = useState(criarLocalVazio);
  const [destino, setDestino] = useState(criarLocalVazio);
  const [situacao, setSituacao] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(true);
  const [pesquisou, setPesquisou] = useState(false);
  const [erro, setErro] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const possuiFiltros = Boolean(
    serieNumero ||
    tipoFormulario ||
    especie ||
    finalidade ||
    dataEmissao ||
    procedencia.tipo ||
    procedencia.responsavel ||
    entidadeLocal(procedencia) ||
    destino.tipo ||
    destino.responsavel ||
    entidadeLocal(destino) ||
    situacao,
  );

  const resultados = useMemo(() => {
    const busca = serieNumero.replace(/\s/g, "").toLowerCase();
    const filtrados = listarEmissoesGta().filter(
      (item) =>
        (!busca ||
          item.serieNumero.replace(/\s/g, "").toLowerCase().includes(busca)) &&
        (!tipoFormulario || item.tipoFormulario === tipoFormulario) &&
        (!especie || item.especie?.id === especie.id) &&
        (!finalidade || item.finalidade?.id === finalidade.id) &&
        (!dataEmissao || item.dataEmissao === dataEmissao) &&
        localCompativel(item.procedencia, procedencia) &&
        localCompativel(item.destino, destino) &&
        (!situacao || item.situacao === situacao),
    );
    if (!sortKey) return filtrados;
    return [...filtrados].sort((a, b) => {
      const primeiro = String(sortableValue(a, sortKey));
      const segundo = String(sortableValue(b, sortKey));
      return sortAsc
        ? primeiro.localeCompare(segundo)
        : segundo.localeCompare(primeiro);
    });
  }, [
    serieNumero,
    tipoFormulario,
    especie,
    finalidade,
    dataEmissao,
    procedencia,
    destino,
    situacao,
    sortKey,
    sortAsc,
  ]);

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

  const pesquisar = () => {
    setErro(!possuiFiltros);
    setPesquisou(possuiFiltros);
    setPagina(1);
  };

  const ordenar = (key: SortKey) => {
    setSortAsc(key === sortKey ? !sortAsc : true);
    setSortKey(key);
  };

  const cabecalho = (key: SortKey, texto: string): ReactNode => (
    <th
      onClick={() => ordenar(key)}
      className="px-3 py-3 text-left text-[11px] font-semibold uppercase leading-tight text-gray-700 cursor-pointer"
    >
      <span className="inline-flex items-center gap-1.5">
        {texto}
        {sortKey === key ? (
          sortAsc ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )
        ) : (
          <ChevronDown size={14} />
        )}
      </span>
    </th>
  );

  const downloadMock = (documento: string, item: EmissaoGta) =>
    window.alert(
      `${documento} de ${item.serieNumero} preparado para download no protótipo.`,
    );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="max-w-[1320px] mx-auto px-4 md:px-6 py-5">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-sm mb-6 font-medium text-[#00884A]"
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
            onClick={() => onNavigate("adicionar-emissao-gta", null)}
            className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#00884A] hover:bg-[#00743F]"
          >
            Adicionar Nova
          </button>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <section className="flex flex-col gap-3">
            <div className="flex items-stretch gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={serieNumero}
                  maxLength={11}
                  placeholder="Buscar pela série e número da GTA"
                  onChange={(event) => {
                    setSerieNumero(event.target.value.toUpperCase().slice(0, 11));
                    setErro(false);
                  }}
                  className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 pr-11 text-sm text-gray-800 outline-none focus:border-[#00884A] focus:ring-1 focus:ring-[#00884A]"
                />
                <Search
                  size={19}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00884A]"
                />
              </div>
              <button
                type="button"
                title="Exibir ou ocultar filtros"
                aria-label="Exibir ou ocultar filtros"
                onClick={() => setFiltrosAbertos((aberto) => !aberto)}
                className="h-12 w-16 flex-shrink-0 rounded-md bg-[#00884A] text-white flex items-center justify-center hover:bg-[#00743F]"
              >
                <SlidersHorizontal size={22} />
              </button>
            </div>

            {filtrosAbertos && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                  <FloatSelect
                    label="Tipo de Formulário"
                    value={tipoFormulario}
                    onChange={setTipoFormulario}
                    options={TIPOS_FORMULARIO_GTA}
                  />
                  <FloatSelect
                    label="Tipo de Procedência"
                    value={procedencia.tipo}
                    onChange={(tipo) =>
                      setProcedencia({
                        ...criarLocalVazio(),
                        tipo: tipo as TipoLocalGta,
                      })
                    }
                    options={TIPOS_LOCAL_OPTIONS}
                  />
                  <FloatSelect
                    label="Tipo de Destino"
                    value={destino.tipo}
                    onChange={(tipo) =>
                      setDestino({
                        ...criarLocalVazio(),
                        tipo: tipo as TipoLocalGta,
                      })
                    }
                    options={TIPOS_LOCAL_OPTIONS}
                  />
                  <button
                    type="button"
                    onClick={pesquisar}
                    className="h-12 px-5 rounded-md text-white text-sm font-semibold bg-[#00884A] hover:bg-[#00743F]"
                  >
                    Pesquisar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <SearchEntityField
                    label="Espécie"
                    value={especie}
                    data={listarEspeciesGta()}
                    icon={<Dna size={20} />}
                    onChange={setEspecie}
                  />
                  <SearchEntityField
                    label="Finalidade de Trânsito"
                    value={finalidade}
                    data={listarFinalidadesGta(especie?.id)}
                    icon={<Truck size={20} />}
                    onChange={setFinalidade}
                  />
                  <FloatInput
                    label="Data da Emissão"
                    type="date"
                    value={dataEmissao}
                    icon={<Calendar size={20} />}
                    onChange={setDataEmissao}
                  />
                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES_GTA.map((valor) => ({
                      value: valor,
                      label: valor,
                    }))}
                  />
                </div>

                <LocalFilters
                  titulo="Origem"
                  local={procedencia}
                  onChange={setProcedencia}
                />
                <LocalFilters
                  titulo="Destino"
                  local={destino}
                  onChange={setDestino}
                />
              </div>
            )}

            {erro && (
              <p className="text-sm text-red-500 font-medium">
                Informe a série e número da GTA ou ao menos um filtro para
                pesquisar.
              </p>
            )}
          </section>

          <div className="mt-7 border-t border-gray-200 pt-5">
            {!pesquisou ? (
              <div className="py-10 text-center text-sm text-gray-600">
                Busque por emissão de GTA utilizando o campo de busca e os filtros
                acima
              </div>
            ) : resultados.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-600">
                Nenhum resultado foi encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] border-collapse text-xs">
                  <thead>
                    <tr className="border-y border-gray-200">
                      {cabecalho("serieNumero", "Série - Nº GTA")}
                      {cabecalho("tipoFormulario", "Tipo de Formulário")}
                      {cabecalho("especie", "Espécie")}
                      {cabecalho("finalidade", "Finalidade de Trânsito")}
                      {cabecalho("procedencia", "Procedência")}
                      {cabecalho("destino", "Destinatário")}
                      {cabecalho("dataEmissao", "Data de Emissão")}
                      {cabecalho("situacao", "Situação")}
                      <th className="w-40" />
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                          {item.serieNumero}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {item.tipoFormulario}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {item.especie?.nome}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {item.finalidade?.nome}
                        </td>
                        <td className="px-3 py-3 text-gray-600 max-w-40">
                          {descricaoLocal(item.procedencia)}
                        </td>
                        <td className="px-3 py-3 text-gray-600 max-w-40">
                          {descricaoLocal(item.destino)}
                        </td>
                        <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                          {formatarDataGta(item.dataEmissao)}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.situacao === "Cancelada" ? "bg-red-50 text-red-700" : item.situacao === "Transitada" ? "bg-emerald-100 text-emerald-800" : item.situacao === "Emitida" ? "bg-blue-50 text-blue-700" : item.situacao === "Paga" ? "bg-green-50 text-green-700" : item.situacao === "Aguardando Pagamento" ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-700"}`}>
                            {item.situacao}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <ActionButton
                              title="Visualizar"
                              onClick={() =>
                                onNavigate("visualizar-emissao-gta", item)
                              }
                            >
                              <Eye size={16} />
                            </ActionButton>
                            {item.situacao === "Gravada" && (
                              <ActionButton
                                title="Editar GTA"
                                onClick={() => onNavigate("adicionar-emissao-gta", item)}
                              >
                                <Pencil size={15} />
                              </ActionButton>
                            )}
                            <ActionButton
                              title="Copiar GTA"
                              onClick={() =>
                                onNavigate(
                                  "adicionar-emissao-gta",
                                  copiarEmissaoGta(item),
                                )
                              }
                            >
                              <Copy size={15} />
                            </ActionButton>
                            {item.situacao === "Aguardando Pagamento" &&
                              item.necessitaPagamento && (
                                <ActionButton
                                  title="Pagar"
                                  onClick={() =>
                                    onNavigate("pagar-emissao-gta", item)
                                  }
                                >
                                  <DollarSign size={16} />
                                </ActionButton>
                              )}
                            {["Aguardando Pagamento", "Paga"].includes(item.situacao) && (
                              <ActionButton
                                title={frigorificoAderidoAoFundo(item.destino) ? "Baixar boleto" : "Baixar boleto/DAE"}
                                onClick={() => downloadMock(frigorificoAderidoAoFundo(item.destino) ? "Boleto" : "Boleto/DAE", item)}
                              >
                                <FileDown size={16} />
                              </ActionButton>
                            )}
                            {item.situacao === "Paga" && (
                                <ActionButton
                                  title="Emitir"
                                  onClick={() =>
                                    onNavigate("emitir-emissao-gta", item)
                                  }
                                >
                                  <ArrowRight size={17} />
                                </ActionButton>
                              )}
                            {["Emitida", "Transitada"].includes(item.situacao) && (
                              <ActionButton
                                title="Baixar GTA"
                                onClick={() => onNavigate("documento-emissao-gta", item)}
                              >
                                <FileCheck2 size={16} />
                              </ActionButton>
                            )}
                            {!['Cancelada', 'Transitada'].includes(item.situacao) && (
                              <ActionButton
                                title="Cancelar"
                                onClick={() =>
                                  onNavigate("cancelar-emissao-gta", item)
                                }
                              >
                                <X size={17} />
                              </ActionButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between px-3 pt-7 text-xs text-gray-600">
                  <span>Itens por página: {itensPorPagina}</span>
                  <div className="flex items-center gap-3">
                    <span>
                      Mostrando de {inicio} a {fim} de {resultados.length}{" "}
                      resultados
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPagina((valor) => Math.max(1, valor - 1))
                      }
                      disabled={paginaAtual === 1}
                      className="p-1 text-[#00884A] disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPagina((valor) => Math.min(totalPaginas, valor + 1))
                      }
                      disabled={paginaAtual === totalPaginas}
                      className="p-1 text-[#00884A] disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
