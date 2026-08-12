import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CalendarDays, ChevronLeft, ChevronRight, Clock3, CreditCard, Eye, Factory, Pencil, User } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import * as Icons from "../../../imports/icons";
import {
  CONTRIBUINTES_RECOLHIMENTO,
  MESES,
  MESES_OPTIONS,
  SITUACOES_OPTIONS,
  formatarMoeda,
  formatarData,
  listarRecolhimentos,
  referenciaRecolhimento,
  valorTotalRecolhimento,
  type ContribuinteRecolhimento,
} from "./recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  portalRepresentante?: boolean;
}

const ESTABELECIMENTOS_COM_BOLETOS = [
  { id: "integradora-vale-campo", nome: "Integradora Vale do Campo Ltda.", tipo: "Integradora", documento: "18.445.761/0001-09", municipio: "Uberlândia/MG", situacaoPagamento: "Pagamento pendente" },
  { id: "integradora-cerrado", nome: "Integradora do Cerrado S.A.", tipo: "Integradora", documento: "27.308.914/0001-62", municipio: "Patos de Minas/MG", situacaoPagamento: "Sem pendências" },
  { id: "frigorifico-sao-jose", nome: "Frigorífico São José", tipo: "Frigorífico", documento: "42.156.880/0001-35", municipio: "Lavras/MG", situacaoPagamento: "Pagamento pendente" },
] as const;

type EstabelecimentoComBoletos = (typeof ESTABELECIMENTOS_COM_BOLETOS)[number];

export function RecolhimentoMensalGTAPage({ onLogout, onNavigate, portalRepresentante = false }: Props) {
  const { role } = useDemoUser();
  const portal = portalRepresentante || role === "responsavel-agroindustria-integradora";
  const [contribuinte, setContribuinte] = useState<ContribuinteRecolhimento | null>(null);
  const [tipoPessoaContribuinte, setTipoPessoaContribuinte] = useState("Pessoa física");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisou, setPesquisou] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState<EstabelecimentoComBoletos | null>(null);
  const porPagina = 10;

  // 🌟 Filtro dinâmico de contribuintes para o modal (Física vs Jurídica)
  const contribuintesFiltrados = useMemo(() => {
    return CONTRIBUINTES_RECOLHIMENTO.filter((c) => {
      const doc = c.documento.replace(/\D/g, "");
      if (tipoPessoaContribuinte === "Pessoa física") return doc.length <= 11;
      if (tipoPessoaContribuinte === "Pessoa jurídica") return doc.length > 11;
      return true;
    });
  }, [tipoPessoaContribuinte]);

  const resultados = useMemo(() => listarRecolhimentos().filter((registro) =>
    (!contribuinte || registro.contribuinte.id === contribuinte.id) &&
    (!ano || registro.anoReferencia === Number(ano)) &&
    (!mes || registro.mesReferencia === Number(mes)) &&
    (!situacao || registro.situacao === situacao)
  ), [contribuinte, ano, mes, situacao, pesquisou]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const linhas = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = resultados.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, resultados.length);

  if (portal) {
    const registrosComBoletos = listarRecolhimentos().filter((registro) => registro.boletos.length > 0);
    if (!estabelecimentoSelecionado) {
      return <SelecionarEstabelecimentoBoletosPage onLogout={onLogout} onNavigate={onNavigate} onSelect={setEstabelecimentoSelecionado} />;
    }
    return <PortalBoletosPage onLogout={onLogout} onNavigate={onNavigate} registros={registrosComBoletos} estabelecimento={estabelecimentoSelecionado} onBack={() => setEstabelecimentoSelecionado(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> Inicial
        </button>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{portal ? "Boletos de GTAs" : "Recolhimento Mensal de GTAs"}</h1>
          </div>
          {!portal && <button type="button" onClick={() => onNavigate("adicionar-recolhimento-mensal-gta")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar Novo</button>}
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* 🌟 CONTRIBUINTE COM SELECT DE TIPO DE PESSOA NO MODAL */}
            <EntitySearchInput
              label="Contribuinte"
              placeholder="Buscar por nome, CPF ou CNPJ"
              value={contribuinte?.nome ?? ""}
              data={contribuintesFiltrados}
              searchKeys={["nome", "documento", "tipo"]}
              columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "CPF / CNPJ", key: "documento" }]}
              icon={<User size={18} className="text-[#1A7A3C]" />}
              title="Buscar Contribuinte"
              subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
              confirmLabel="Selecionar"
              onChange={setContribuinte}
              headerActions={
                <FloatSelect
                  label="Tipo de Pessoa"
                  required
                  value={tipoPessoaContribuinte}
                  onChange={(v) => setTipoPessoaContribuinte(v)}
                  options={[
                    { value: "Pessoa física", label: "Pessoa Física" },
                    { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
                  ]}
                />
              }
            />

            <FloatInput
              label="Ano para referência"
              value={ano}
              maxLength={4}
              onChange={(valor) => setAno(valor.replace(/\D/g, "").slice(0, 4))}
            />
            <FloatSelect label="Mês para referência" value={mes} onChange={setMes} options={MESES_OPTIONS} />
            <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_OPTIONS} />
            <button type="button" onClick={() => { setPesquisou(true); setPagina(1); }} className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white hover:bg-[#15612F]">
              Pesquisar
            </button>
          </div>

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque por recolhimentos mensais utilizando os filtros acima.</div>
          ) : linhas.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {/* 🌟 Removida a coluna dedicada de CPF/CNPJ */}
                    {["Contribuinte", "Mês e ano para referência", "Valor", "Situação"].map((titulo) => (
                      <th key={titulo} className="whitespace-nowrap px-3 py-3 text-left font-semibold uppercase text-gray-600">{titulo}</th>
                    ))}
                    <th className="w-[100px] px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((registro) => (
                    <tr key={registro.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                      {/* 🌟 CPF/CNPJ na primeira linha e Nome na linha de baixo */}
                      <td className="px-3 py-3 text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-500">{registro.contribuinte.documento}</span>
                          <span className="text-medium text-gray-500">{registro.contribuinte.nome}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">{referenciaRecolhimento(registro)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarMoeda(valorTotalRecolhimento(registro))}</td>
                      <td className="px-3 py-3 text-gray-500">{registro.situacao}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registro)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Eye size={18} /></button>
                          <button type="button" title="Editar" onClick={() => onNavigate("editar-recolhimento-mensal-gta", registro)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Pencil size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {porPagina}</span>
                <div className="flex items-center gap-3">
                  <span>{inicio} - {fim} de {resultados.length}</span>
                  <button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((valor) => Math.max(1, valor - 1))} className="disabled:opacity-30"><ChevronLeft size={18} /></button>
                  <button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))} className="disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SelecionarEstabelecimentoBoletosPage({
  onLogout,
  onNavigate,
  onSelect,
}: Props & { onSelect: (estabelecimento: EstabelecimentoComBoletos) => void }) {
  return (
    <div className="min-h-screen bg-[#f2f3f5] text-slate-800">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="relatorio-boletos-gta" hideSearch />
      <main className="mx-auto max-w-[1088px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Inicial</button>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Relatório de Boletos</h1>
          <p className="mt-2 text-sm text-gray-500">Selecione o estabelecimento para consultar os boletos vinculados.</p>
        </div>

        <section className="rounded-xl bg-white p-5 shadow-sm" aria-label="Estabelecimentos com boletos">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-800">Estabelecimentos vinculados</h2>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-[#1A7A3C]">{ESTABELECIMENTOS_COM_BOLETOS.length}</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ESTABELECIMENTOS_COM_BOLETOS.map((estabelecimento) => (
              <button key={estabelecimento.id} type="button" onClick={() => onSelect(estabelecimento)} className="group flex min-h-[210px] flex-col rounded-xl border border-gray-200 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-[#9bcbb0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A7A3C] focus:ring-offset-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF4ED] text-[#1A7A3C] transition group-hover:scale-105">
                    {estabelecimento.tipo === "Frigorífico" ? <Factory size={20} /> : <Building2 size={20} />}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${estabelecimento.situacaoPagamento === "Sem pendências" ? "bg-[#E6F4EA] text-[#1A7A3C]" : "bg-amber-50 text-amber-700"}`}>{estabelecimento.situacaoPagamento}</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">{estabelecimento.nome}</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <div><p className="text-xs font-semibold text-gray-400">Tipo de estabelecimento</p><p className="mt-0.5 font-medium">{estabelecimento.tipo}</p></div>
                  <div><p className="text-xs font-semibold text-gray-400">CNPJ</p><p className="mt-0.5 font-medium">{estabelecimento.documento}</p></div>
                  <div><p className="text-xs font-semibold text-gray-400">Município</p><p className="mt-0.5 font-medium">{estabelecimento.municipio}</p></div>
                </div>
                <span className="mt-auto flex items-center justify-end gap-1 pt-4 text-sm font-semibold text-[#1A7A3C]">Acessar boletos <ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PortalBoletosPage({
  onLogout,
  onNavigate,
  registros,
  estabelecimento,
  onBack,
}: Props & { registros: ReturnType<typeof listarRecolhimentos>; estabelecimento: EstabelecimentoComBoletos; onBack: () => void }) {
  const [contribuinteSelecionado, setContribuinteSelecionado] = useState<ContribuinteRecolhimento | null>(null);
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const contribuintesDisponiveis = useMemo(() => CONTRIBUINTES_RECOLHIMENTO.filter((item) => tipoPessoa === "Pessoa física" ? item.tipo === "Pessoa Física" : item.tipo === "Pessoa Jurídica"), [tipoPessoa]);
  const registrosFiltrados = useMemo(() => registros.filter((registro) => !contribuinteSelecionado || registro.contribuinte.id === contribuinteSelecionado.id), [registros, contribuinteSelecionado]);
  const registroMaisRecente = [...registrosFiltrados].sort((a, b) => (a.anoReferencia * 12 + a.mesReferencia) - (b.anoReferencia * 12 + b.mesReferencia)).at(-1);
  const [mesSelecionado, setMesSelecionado] = useState(registroMaisRecente?.mesReferencia ?? new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(registroMaisRecente?.anoReferencia ?? new Date().getFullYear());
  const [anoCalendario, setAnoCalendario] = useState(registroMaisRecente?.anoReferencia ?? new Date().getFullYear());
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const registroSelecionado = registrosFiltrados.find((registro) => registro.anoReferencia === anoSelecionado && registro.mesReferencia === mesSelecionado) ?? null;
  const total = registroSelecionado ? valorTotalRecolhimento(registroSelecionado) : 0;
  const pagos = registroSelecionado?.boletos.filter((boleto) => boleto.situacaoPagamento === "Pago").reduce((soma, boleto) => soma + boleto.valor, 0) ?? 0;
  const gtasFiltradas = (registroSelecionado?.boletos ?? []).flatMap((boleto) => boleto.gtas);

  const selecionarPeriodo = (mes: number, ano: number) => {
    setMesSelecionado(mes);
    setAnoSelecionado(ano);
    setAnoCalendario(ano);
    setCalendarioAberto(false);
  };

  const moverPeriodo = (quantidade: number) => {
    const novaData = new Date(anoSelecionado, mesSelecionado - 1 + quantidade, 1);
    selecionarPeriodo(novaData.getMonth() + 1, novaData.getFullYear());
  };

  const mesesProximos = Array.from({ length: 5 }, (_, indice) => {
    const data = new Date(anoSelecionado, mesSelecionado - 1 + indice - 2, 1);
    return { mes: data.getMonth() + 1, ano: data.getFullYear() };
  });

  const periodoPossuiBoleto = (mes: number, ano: number) => registrosFiltrados.some((registro) => registro.mesReferencia === mes && registro.anoReferencia === ano);

  const selecionarContribuinte = (contribuinte: ContribuinteRecolhimento | null) => {
    setContribuinteSelecionado(contribuinte);
    if (!contribuinte) return;
    const registroRecente = registros
      .filter((registro) => registro.contribuinte.id === contribuinte.id)
      .sort((a, b) => (b.anoReferencia * 12 + b.mesReferencia) - (a.anoReferencia * 12 + a.mesReferencia))[0];
    if (registroRecente) selecionarPeriodo(registroRecente.mesReferencia, registroRecente.anoReferencia);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-slate-800">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="relatorio-boletos-gta" hideSearch />
      <main className="mx-auto max-w-[1280px] px-4 py-6 md:px-8">
        <button type="button" onClick={onBack} className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Estabelecimentos vinculados</button>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold tracking-tight text-slate-900">Relatório de Boletos</h1><p className="mt-1 text-sm text-slate-500">{estabelecimento.nome} · {estabelecimento.documento}</p></div>
        </div>

        <section className="mb-5 rounded-xl border border-[#d7e5dc] bg-white p-5 shadow-sm">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(480px,1.2fr)]">
            <div>
              <p className="text-sm font-bold text-slate-800">Filtrar por contribuinte</p>
              <p className="mt-1 text-xs text-slate-500">Selecione um contribuinte para consultar os itens relacionados.</p>
            </div>
            <EntitySearchInput
              label="Contribuinte"
              placeholder="Buscar por nome ou documento"
              value={contribuinteSelecionado?.nome ?? ""}
              data={contribuintesDisponiveis}
              searchKeys={["nome", "documento"]}
              columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "Documento", key: "documento" }]}
              icon={<img src={Icons.iconeProdutorUrl} alt="" className="h-5 w-5 object-contain" />}
              onChange={selecionarContribuinte}
              title="Buscar Contribuinte"
              subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
              confirmLabel="Selecionar"
              headerActions={<FloatSelect label="Tipo de Pessoa" value={tipoPessoa} onChange={(valor) => { setTipoPessoa(valor); setContribuinteSelecionado(null); }} options={[{ value: "Pessoa física", label: "Pessoa Física" }, { value: "Pessoa jurídica", label: "Pessoa Jurídica" }]} />}
            />
          </div>
        </section>

        <div className="relative mb-5 rounded-xl border border-[#d7e5dc] bg-white p-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => moverPeriodo(-1)} aria-label="Mês anterior" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-[#eef8f1] hover:text-[#1A7A3C]"><ChevronLeft size={19} /></button>
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 sm:grid-cols-5">
              {mesesProximos.map(({ mes, ano }, indice) => {
                const selecionado = mes === mesSelecionado && ano === anoSelecionado;
                const disponivel = periodoPossuiBoleto(mes, ano);
                return (
                  <button key={`${ano}-${mes}`} type="button" onClick={() => selecionarPeriodo(mes, ano)} className={`relative rounded-lg px-2 py-1.5 text-center transition ${selecionado ? "bg-[#1A7A3C] text-white shadow-sm" : "text-slate-600 hover:bg-[#eef8f1]"} ${indice === 0 || indice === 4 ? "hidden sm:block" : ""}`}>
                    <span className="block text-sm font-bold">{MESES[mes - 1].slice(0, 3)}</span>
                    <span className={`block text-[11px] ${selecionado ? "text-green-100" : "text-slate-400"}`}>{ano}</span>
                    {disponivel && <span className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${selecionado ? "bg-white" : "bg-[#1A7A3C]"}`} />}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => moverPeriodo(1)} aria-label="Próximo mês" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-[#eef8f1] hover:text-[#1A7A3C]"><ChevronRight size={19} /></button>
            <div className="mx-1 h-8 w-px shrink-0 bg-slate-200" />
            <button type="button" onClick={() => { setAnoCalendario(anoSelecionado); setCalendarioAberto((aberto) => !aberto); }} aria-expanded={calendarioAberto} className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-bold transition ${calendarioAberto ? "bg-[#eef8f1] text-[#1A7A3C]" : "text-slate-600 hover:bg-[#eef8f1]"}`}><CalendarDays size={18} /><span className="hidden md:inline">Escolher período</span></button>
          </div>

          {calendarioAberto && (
            <div className="absolute right-2 top-[calc(100%+8px)] z-30 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-[#d7e5dc] bg-white p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <button type="button" onClick={() => setAnoCalendario((ano) => ano - 1)} aria-label="Ano anterior" className="rounded-lg p-2 text-slate-500 hover:bg-[#eef8f1]"><ChevronLeft size={18} /></button>
                <strong className="text-base text-slate-900">{anoCalendario}</strong>
                <button type="button" onClick={() => setAnoCalendario((ano) => ano + 1)} aria-label="Próximo ano" className="rounded-lg p-2 text-slate-500 hover:bg-[#eef8f1]"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MESES.map((nomeMes, indice) => {
                  const mes = indice + 1;
                  const selecionado = mes === mesSelecionado && anoCalendario === anoSelecionado;
                  const disponivel = periodoPossuiBoleto(mes, anoCalendario);
                  return <button key={nomeMes} type="button" onClick={() => selecionarPeriodo(mes, anoCalendario)} className={`relative rounded-xl border px-2 py-3 text-sm font-semibold transition ${selecionado ? "border-[#1A7A3C] bg-[#1A7A3C] text-white" : "border-transparent text-slate-600 hover:border-[#b9d7c1] hover:bg-[#eef8f1]"}`}>{nomeMes.slice(0, 3)}{disponivel && <span className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${selecionado ? "bg-white" : "bg-[#1A7A3C]"}`} />}</button>;
                })}
              </div>
              <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-[#1A7A3C]" /> Meses com boletos disponíveis</p>
            </div>
          )}
        </div>

        {!registroSelecionado ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#d7e5dc] bg-white px-6 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef8f1] text-[#1A7A3C]"><CalendarDays size={26} /></div>
            <h2 className="text-lg font-bold text-slate-900">Nenhum boleto em {MESES[mesSelecionado - 1].toLowerCase()} de {anoSelecionado}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Use os meses acima ou abra o calendário para consultar outro período. Os pontos verdes indicam onde há boletos.</p>
          </section>
        ) : <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="overflow-hidden rounded-2xl border border-[#d7e5dc] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfece2] bg-[#f7fbf8] px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Itens do boleto <span className="mx-1 text-slate-300">·</span> <span className="text-[#1A7A3C]">{MESES[registroSelecionado.mesReferencia - 1]} {registroSelecionado.anoReferencia}</span></h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#244b38] text-white">
                  <tr>{["Data", "Nº GTA", "Qtd. / Espécie", "Taxa FUNDEsa", "Valor total"].map((titulo, indice) => <th key={titulo} className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wide ${indice > 2 ? "text-right" : "text-left"}`}>{titulo}</th>)}</tr>
                </thead>
                <tbody>
                  {gtasFiltradas.map((gta) => (
                    <tr key={gta.numero} className="border-b border-slate-100 hover:bg-[#f7fbf8]">
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatarData(gta.dataEmissao)}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-[#1A7A3C]">{gta.serie ? `${gta.serie}-` : ""}{gta.numero}</td>
                      <td className="px-5 py-4 text-slate-600">{gta.totalAnimais} {gta.especie}s</td>
                      <td className="whitespace-nowrap px-5 py-4 text-right text-slate-600">{formatarMoeda(gta.valorContribuicao)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-slate-900">{formatarMoeda(gta.valorContribuicao)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-[#9bcbb0] bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total a pagar</p><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${pagos < total ? "bg-amber-50 text-amber-700" : "bg-[#E6F4EA] text-[#17763b]"}`}>{pagos < total ? "Pagamento pendente" : "Pago"}</span></div><p className="mt-3 text-4xl font-black tracking-tight text-slate-900">{formatarMoeda(total)}</p><div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-xs"><div className="flex justify-between"><span className="text-slate-500">Mês de referência</span><strong>{referenciaRecolhimento(registroSelecionado)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Vencimento</span><strong className="text-amber-700">{formatarData(registroSelecionado.dataVencimento)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Total já pago</span><strong>{formatarMoeda(pagos)}</strong></div></div><button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#15612F]"><CreditCard size={18} /> Pagar boleto</button></section>
            <section className="rounded-2xl border border-[#d7e5dc] bg-[#eef8f1] p-5 text-sm text-slate-600"><div className="flex gap-3"><Clock3 size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><p>O vencimento considera o quinto dia útil.</p></div></section>
          </aside>
        </div>}
      </main>
    </div>
  );
}
