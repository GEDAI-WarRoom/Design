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
import { FloatCombobox, FloatInput, FloatSelect, SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  PROPRIETARIOS_UNIDADE_MOCK,
  listarUnidadesVigilancia,
  type ProprietarioUnidadeVigilancia,
} from "./unidadeVigilanciaData";

const GREEN = "#1A7A3C";
const ESTADOS_BR = ["Minas Gerais", "Rio de Janeiro", "São Paulo"];
const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte", "Lavras", "Oliveira", "Uberlândia", "Varginha"],
  "Rio de Janeiro": ["Niterói", "Petrópolis", "Rio de Janeiro"],
  "São Paulo": ["Campinas", "Ribeirão Preto", "Santos", "São Paulo"],
};
const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F4EA] px-3 py-1.5 text-xs font-semibold text-[#1A7A3C]">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}>
        <X size={13} />
      </button>
    </span>
  );
}

export function AeroportoPorto({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const [registros] = useState(() => [...listarUnidadesVigilancia()]);
  const [busca, setBusca] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const [proprietario, setProprietario] = useState<ProprietarioUnidadeVigilancia | null>(null);
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [modalProprietario, setModalProprietario] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const temFiltro = Boolean(busca.trim() || proprietario || estado || municipio || situacao);
  const proprietariosDisponiveis = PROPRIETARIOS_UNIDADE_MOCK.filter((item) => item.tipo === tipoPessoa);

  const resultados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return registros
      .filter((item) =>
        (!termo || item.codigo.includes(termo) || item.nome.toLocaleLowerCase("pt-BR").includes(termo)) &&
        (!proprietario || item.proprietarios.some((itemProprietario) => String(itemProprietario.id) === String(proprietario.id))) &&
        (!estado || item.endereco.estado === estado) &&
        (!municipio || item.endereco.municipio === municipio) &&
        (!situacao || item.situacao === situacao),
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [busca, estado, municipio, proprietario, registros, situacao]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const linhas = resultados.slice((pagina - 1) * porPagina, pagina * porPagina);

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

  const limpar = () => {
    setBusca("");
    setProprietario(null);
    setEstado("");
    setMunicipio("");
    setSituacao("");
    setPesquisou(false);
    setErroFiltro(false);
    setPagina(1);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="aeroporto-porto" hideSearch />
      <main className="mx-auto max-w-[1300px] px-6 py-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70">
          <ArrowLeft size={15} /> Inicial
        </button>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Unidades de Vigilância Agropecuária</h1>
          <button type="button" onClick={() => onNavigate("adicionar-aeroporto-porto")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15612F]">
            Adicionar Novo
          </button>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <div className={`flex h-12 flex-1 items-center rounded-md border bg-white px-3 ${erroFiltro ? "border-red-500" : "border-gray-300"}`}>
              <input
                type="text"
                placeholder="Código ou Nome da Unidade de Vigilância Agropecuária"
                value={busca}
                onChange={(event) => { setBusca(event.target.value); setErroFiltro(false); setPesquisou(false); }}
                onKeyDown={(event) => event.key === "Enter" && pesquisar()}
                className="h-full w-full text-sm outline-none"
              />
              <Search size={18} className="text-gray-400" />
            </div>
            <button type="button" onClick={() => setFiltrosAbertos((aberto) => !aberto)} title="Exibir filtros" className={`flex h-12 w-12 items-center justify-center rounded-md border transition ${filtrosAbertos ? "border-[#1A7A3C] bg-white text-[#1A7A3C]" : "border-[#1A7A3C] bg-[#1A7A3C] text-white"}`}>
              <SlidersHorizontal size={17} />
            </button>
          </div>

          {erroFiltro && <p className="text-sm font-medium text-red-600">Informe o código, o nome ou ao menos um filtro para pesquisar.</p>}

          {filtrosAbertos && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 animate-fadeIn">
              <FloatInput
                label="Proprietário"
                value={proprietario ? `${proprietario.documento} - ${proprietario.nome}` : ""}
                icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
                onClick={() => setModalProprietario(true)}
                readOnly
              />
              <FloatCombobox label="Estado" value={estado} onChange={(valor) => { setEstado(valor); setMunicipio(""); setPesquisou(false); }} options={ESTADOS_BR} />
              <FloatCombobox label="Município" value={municipio} onChange={(valor) => { setMunicipio(valor); setPesquisou(false); }} options={estado ? MUNICIPIOS_POR_ESTADO[estado] || [] : []} disabled={!estado} />
              <FloatSelect label="Situação" value={situacao} onChange={(valor) => { setSituacao(valor); setPesquisou(false); }} options={SITUACOES} />
              <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]">
                Pesquisar
              </button>
            </div>
          )}

          {temFiltro && (
            <div className="flex flex-wrap items-center gap-2">
              {busca && <Chip label={`Busca: ${busca}`} onRemove={() => { setBusca(""); setPesquisou(false); }} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => { setProprietario(null); setPesquisou(false); }} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => { setEstado(""); setMunicipio(""); setPesquisou(false); }} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => { setMunicipio(""); setPesquisou(false); }} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => { setSituacao(""); setPesquisou(false); }} />}
              <button type="button" onClick={limpar} className="ml-1 text-xs font-semibold text-gray-500 underline hover:text-gray-700">Limpar filtros</button>
            </div>
          )}

          {pesquisou && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase text-gray-600">
                      <th className="px-4 py-3 font-semibold">Código</th>
                      <th className="px-4 py-3 font-semibold">Nome</th>
                      <th className="px-4 py-3 font-semibold">Proprietários</th>
                      <th className="px-4 py-3 font-semibold">Município - UF</th>
                      <th className="px-4 py-3 font-semibold">Situação</th>
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 transition hover:bg-gray-50/60">
                        <td className="px-4 py-3.5 text-gray-700">{item.codigo}</td>
                        <td className="px-4 py-3.5 font-medium text-gray-800">{item.nome}</td>
                        <td className="px-4 py-3.5 text-gray-700">{item.proprietarios.map((prop) => `${prop.documento} - ${prop.nome}`).join(", ")}</td>
                        <td className="px-4 py-3.5 text-gray-700">{item.endereco.municipio} - MG</td>
                        <td className="px-4 py-3.5 text-gray-700">{item.situacao}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end gap-1 text-[#1A7A3C]">
                            <button type="button" onClick={() => onNavigate("visualizar-aeroporto-porto", item)} className="rounded-md p-2 hover:bg-green-50" title="Visualizar"><Eye size={18} /></button>
                            <button type="button" onClick={() => onNavigate("editar-aeroporto-porto", item)} className="rounded-md p-2 hover:bg-green-50" title="Editar"><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {linhas.length === 0 && <p className="py-10 text-center text-sm text-gray-500">Nenhum registro encontrado para os filtros informados.</p>}
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                <span>{resultados.length} {resultados.length === 1 ? "registro encontrado" : "registros encontrados"}</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={pagina === 1} onClick={() => setPagina((atual) => atual - 1)} className="rounded-md border border-gray-200 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
                  <span>Página {pagina} de {totalPaginas}</span>
                  <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina((atual) => atual + 1)} className="rounded-md border border-gray-200 p-2 disabled:opacity-40"><ChevronRight size={16} /></button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <SearchModal<ProprietarioUnidadeVigilancia>
        open={modalProprietario}
        onClose={() => setModalProprietario(false)}
        title="Buscar Proprietário"
        subtitle="Busque por uma pessoa física ou jurídica proprietária de integradora/cooperativa:"
        icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-8 w-8 object-contain" />}
        data={proprietariosDisponiveis}
        columns={[{ label: "CPF / CNPJ", key: "documento" }, { label: "Nome / Nome Fantasia", key: "nome" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar por CPF, CNPJ ou nome"
        confirmLabel="Confirmar"
        onConfirm={(item) => { setProprietario(item); setModalProprietario(false); setPesquisou(false); }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            value={tipoPessoa}
            onChange={setTipoPessoa}
            options={[{ value: "Pessoa física", label: "Pessoa Física" }, { value: "Pessoa jurídica", label: "Pessoa Jurídica" }]}
          />
        }
      />
    </div>
  );
}
