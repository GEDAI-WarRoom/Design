import { useMemo, useState } from "react";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Eye, Handshake, Search, SlidersHorizontal, Wallet, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui-1/popover";
import * as Icons from "../../../imports/icons";
import {
  CONTRIBUINTES_RECOLHIMENTO,
  MESES,
  MESES_OPTIONS,
  formatarMoeda,
  listarRecolhimentos,
  referenciaRecolhimento,
} from "../../GTA/RecolhimentoMensalGTA/recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const SITUACOES = [
  { value: "Pago", label: "Pago" },
  { value: "Aguardando pagamento", label: "Aguardando pagamento" },
];

const dadosBoletos = listarRecolhimentos().flatMap((registro) =>
  registro.boletos.map((boleto) => ({ registro, boleto })),
);

const FUNDOS = [...new Set(dadosBoletos.map(({ boleto }) => boleto.fundoArrecadacao))].map((nome, indice) => ({
  id: indice + 1,
  nome,
  convenios: [...new Set(dadosBoletos.filter(({ boleto }) => boleto.fundoArrecadacao === nome).map(({ boleto }) => boleto.convenio))].map((nomeConvenio, indiceConvenio) => ({ id: indiceConvenio + 1, nome: nomeConvenio })),
}));

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex max-w-full items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
      <span className="truncate">{label}</span>
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`} className="shrink-0 hover:opacity-80"><X size={14} /></button>
    </span>
  );
}

export function BoletosBuscaPage({ onLogout, onNavigate }: Props) {
  const [busca, setBusca] = useState("");
  const [focoBusca, setFocoBusca] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa Física");
  const [contribuinte, setContribuinte] = useState<(typeof CONTRIBUINTES_RECOLHIMENTO)[number] | null>(null);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [anoCalendario, setAnoCalendario] = useState(new Date().getFullYear());
  const [periodoAberto, setPeriodoAberto] = useState(false);
  const [situacao, setSituacao] = useState("");
  const [fundoArrecadacao, setFundoArrecadacao] = useState<(typeof FUNDOS)[number] | null>(null);
  const [convenio, setConvenio] = useState<(typeof FUNDOS)[number]["convenios"][number] | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const contribuintesFiltrados = useMemo(() => CONTRIBUINTES_RECOLHIMENTO.filter((item) => item.tipo === tipoPessoa), [tipoPessoa]);

  const resultados = useMemo(() => dadosBoletos.filter(({ registro, boleto }) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const termoNumerico = termo.replace(/\D/g, "");
    const buscaCompativel = !termo || (Boolean(termoNumerico) && boleto.numero.replace(/\D/g, "").includes(termoNumerico));
    const contribuinteCompativel = !contribuinte || registro.contribuinte.id === contribuinte.id;
    return buscaCompativel
      && contribuinteCompativel
      && (!mes || registro.mesReferencia === Number(mes))
      && (!ano || registro.anoReferencia === Number(ano))
      && (!situacao || boleto.situacaoPagamento === situacao)
      && (!fundoArrecadacao || boleto.fundoArrecadacao === fundoArrecadacao.nome)
      && (!convenio || boleto.convenio === convenio.nome);
  }), [ano, busca, convenio, contribuinte, fundoArrecadacao, mes, situacao]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const itens = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = resultados.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, resultados.length);
  const temFiltros = Boolean(contribuinte || mes || ano || situacao || fundoArrecadacao || convenio);
  const pesquisar = () => { setPesquisou(true); setPagina(1); };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="boletos-gta" hideSearch />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"><ArrowLeft size={15} /> Inicial</button>
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Boletos</h1>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex w-full items-stretch gap-3">
            <label className="relative flex h-12 flex-1 items-end rounded-md border border-gray-200 px-3 pb-1.5 transition focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <span className={`pointer-events-none absolute left-3 transition-all duration-200 ${focoBusca || busca ? "top-1 text-[10px] font-medium text-gray-400" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Número do boleto</span>
              <input value={busca} onFocus={() => setFocoBusca(true)} onBlur={() => setFocoBusca(false)} onChange={(evento) => setBusca(evento.target.value)} onKeyDown={(evento) => evento.key === "Enter" && pesquisar()} className="h-6 w-full bg-transparent text-sm text-gray-800 outline-none" />
              <Search size={15} className="ml-2 shrink-0 text-gray-400" />
            </label>
            <button type="button" onClick={() => setFiltrosAbertos((aberto) => !aberto)} aria-label="Exibir filtros" aria-expanded={filtrosAbertos} className={`flex w-12 shrink-0 items-center justify-center rounded-md border border-[#1A7A3C] transition ${filtrosAbertos ? "bg-white text-[#1A7A3C]" : "bg-[#1A7A3C] text-white"}`}><SlidersHorizontal size={16} /></button>
          </div>

          {filtrosAbertos && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <EntitySearchInput
                  label="Contribuinte"
                  placeholder="Buscar por nome ou documento"
                  value={contribuinte?.nome ?? ""}
                  data={contribuintesFiltrados}
                  searchKeys={["nome", "documento"]}
                  columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "Documento", key: "documento" }]}
                  icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
                  onChange={setContribuinte}
                  title="Buscar Contribuinte"
                  subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
                  confirmLabel="Selecionar"
                  headerActions={<FloatSelect label="Tipo de Pessoa" value={tipoPessoa} onChange={(valor) => { setTipoPessoa(valor); setContribuinte(null); }} options={[{ value: "Pessoa Física", label: "Pessoa Física" }, { value: "Pessoa Jurídica", label: "Pessoa Jurídica" }]} />}
                />
                <EntitySearchInput
                  label="Fundo de Arrecadação"
                  placeholder="Buscar fundo de arrecadação"
                  value={fundoArrecadacao?.nome ?? ""}
                  data={FUNDOS}
                  searchKeys={["nome"]}
                  columns={[{ label: "Fundo de Arrecadação", key: "nome" }]}
                  icon={<Wallet size={18} className="text-[#1A7A3C]" />}
                  onChange={(fundo) => { setFundoArrecadacao(fundo); setConvenio(null); }}
                  title="Buscar Fundo de Arrecadação"
                  confirmLabel="Selecionar"
                />
                {fundoArrecadacao && <EntitySearchInput
                  label="Convênio"
                  placeholder="Buscar convênio"
                  value={convenio?.nome ?? ""}
                  data={fundoArrecadacao.convenios}
                  searchKeys={["nome"]}
                  columns={[{ label: "Convênio", key: "nome" }]}
                  icon={<Handshake size={18} className="text-[#1A7A3C]" />}
                  onChange={setConvenio}
                  title="Buscar Convênio"
                  subtitle={`Busque por um convênio vinculado a ${fundoArrecadacao.nome}:`}
                  confirmLabel="Selecionar"
                />}
                <Popover open={periodoAberto} onOpenChange={(aberto) => { setPeriodoAberto(aberto); if (aberto) setAnoCalendario(ano ? Number(ano) : new Date().getFullYear()); }}>
                  <PopoverTrigger asChild>
                    <button type="button" data-form-control className="relative flex h-12 w-full items-end rounded-md border border-gray-200 bg-white pb-1.5 pl-10 pr-3 text-left transition hover:border-gray-300 focus:border-[#1A7A3C] focus:outline-none focus:ring-1 focus:ring-[#1A7A3C]">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A7A3C]" />
                      <span className={`pointer-events-none absolute left-10 transition-all ${periodoAberto || (mes && ano) ? "top-1 text-[10px] font-medium text-gray-400" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Mês e ano de referência</span>
                      {mes && ano && <span className="text-sm text-gray-800">{MESES[Number(mes) - 1]} de {ano}</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[320px] rounded-xl border-gray-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <button type="button" onClick={() => setAnoCalendario((valor) => valor - 1)} aria-label="Ano anterior" className="rounded-md p-2 text-gray-500 hover:bg-green-50 hover:text-[#1A7A3C]"><ChevronLeft size={18} /></button>
                      <strong className="text-sm text-gray-800">{anoCalendario}</strong>
                      <button type="button" onClick={() => setAnoCalendario((valor) => valor + 1)} aria-label="Próximo ano" className="rounded-md p-2 text-gray-500 hover:bg-green-50 hover:text-[#1A7A3C]"><ChevronRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {MESES.map((nomeMes, indice) => {
                        const selecionado = mes === String(indice + 1) && ano === String(anoCalendario);
                        return <button key={nomeMes} type="button" onClick={() => { setMes(String(indice + 1)); setAno(String(anoCalendario)); setPeriodoAberto(false); }} className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition ${selecionado ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-green-50 hover:text-[#1A7A3C]"}`}>{nomeMes.slice(0, 3)}</button>;
                      })}
                    </div>
                    {mes && ano && <button type="button" onClick={() => { setMes(""); setAno(""); setPeriodoAberto(false); }} className="mt-3 w-full border-t border-gray-100 pt-3 text-sm font-semibold text-gray-500 hover:text-[#1A7A3C]">Limpar período</button>}
                  </PopoverContent>
                </Popover>
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
                <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] text-sm font-semibold text-white transition hover:bg-[#15612F]">Pesquisar</button>
              </div>
            </div>
          )}

          {temFiltros && (
            <div className="flex flex-wrap gap-2">
              {contribuinte && <Chip label={`Contribuinte: ${contribuinte.nome}`} onRemove={() => setContribuinte(null)} />}
              {mes && ano && <Chip label={`Referência: ${MESES_OPTIONS.find((item) => item.value === mes)?.label} de ${ano}`} onRemove={() => { setMes(""); setAno(""); }} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              {fundoArrecadacao && <Chip label={`Fundo: ${fundoArrecadacao.nome}`} onRemove={() => { setFundoArrecadacao(null); setConvenio(null); }} />}
              {convenio && <Chip label={`Convênio: ${convenio.nome}`} onRemove={() => setConvenio(null)} />}
            </div>
          )}

          {pesquisou && <div className="border-t border-gray-100" />}
          {!pesquisou ? (
            <p className="py-12 text-center text-sm text-gray-500">Busque por boletos utilizando o campo de busca e os filtros acima.</p>
          ) : resultados.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
          ) : (
            <div>
              <div className="overflow-hidden rounded-lg">
                <table className="w-full table-fixed border-collapse text-xs">
                  <colgroup>
                    <col className="w-[21%]" />
                    <col className="w-[20%]" />
                    <col className="w-[9%]" />
                    <col className="w-[17%]" />
                    <col className="w-[12%]" />
                    <col className="w-[9%]" />
                    <col className="w-[8%]" />
                    <col className="w-12" />
                  </colgroup>
                  <thead><tr className="border-b border-gray-100">{["Número do boleto", "Contribuinte", "Referência", "Fundo de arrecadação", "Convênio", "Valor", "Situação"].map((titulo) => <th key={titulo} className="px-2.5 py-3 text-left font-semibold uppercase leading-4 text-gray-600">{titulo}</th>)}<th className="w-12 px-2 py-3" /></tr></thead>
                  <tbody>{itens.map(({ registro, boleto }) => (
                    <tr key={`${registro.id}-${boleto.id}`} className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-2.5 py-3 leading-5 text-gray-500">{boleto.numero}</td>
                      <td className="px-2.5 py-3 leading-5 text-gray-500"><span className="block break-words">{registro.contribuinte.nome} -</span><span className="block">{registro.contribuinte.documento}</span></td>
                      <td className="px-2.5 py-3 leading-5 text-gray-500">{referenciaRecolhimento(registro)}</td>
                      <td className="break-words px-2.5 py-3 leading-5 text-gray-500">{boleto.fundoArrecadacao}</td>
                      <td className="break-words px-2.5 py-3 leading-5 text-gray-500">{boleto.convenio}</td>
                      <td className="px-2.5 py-3 font-medium leading-5 text-gray-700">{formatarMoeda(boleto.valor)}</td>
                      <td className="break-words px-2.5 py-3 leading-5 text-gray-700">{boleto.situacaoPagamento}</td>
                      <td className="px-2 py-3"><button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-boleto-recolhimento-gta", { registro, boleto, origem: "boletos-gta" })} className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"><Eye size={17} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {porPagina}</span>
                <div className="flex items-center gap-4"><span>{inicio} - {fim} de {resultados.length}</span><div className="flex gap-1"><button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((atual) => Math.max(1, atual - 1))} className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))} className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button></div></div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
