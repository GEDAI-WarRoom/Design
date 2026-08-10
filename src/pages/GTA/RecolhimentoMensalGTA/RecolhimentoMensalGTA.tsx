import { Fragment, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, Pencil, Search, User, Download, ReceiptText, WalletCards, CalendarDays, CircleCheck, Clock3, ArrowUpRight } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import {
  CONTRIBUINTES_RECOLHIMENTO,
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

export function RecolhimentoMensalGTAPage({ onLogout, onNavigate, portalRepresentante = false }: Props) {
  const { role } = useDemoUser();
  const portal = portalRepresentante || role === "lider-estabelecimento" || role === "representante-agroindustria" || role === "representante-integradora";
  const [contribuinte, setContribuinte] = useState<ContribuinteRecolhimento | null>(null);
  const [tipoPessoaContribuinte, setTipoPessoaContribuinte] = useState("Pessoa física");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisou, setPesquisou] = useState(false);
  const [pagina, setPagina] = useState(1);
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
    return <PortalBoletosPage onLogout={onLogout} onNavigate={onNavigate} registros={listarRecolhimentos().filter((registro) => registro.boletos.length > 0)} />;
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

function PortalBoletosPage({
  onLogout,
  onNavigate,
  registros,
}: Props & { registros: ReturnType<typeof listarRecolhimentos> }) {
  const [registroSelecionado, setRegistroSelecionado] = useState(registros[registros.length - 1] ?? null);
  const [tipoOrigem, setTipoOrigem] = useState<"Todos" | "Estabelecimento" | "Pessoa">("Todos");
  const [origensAbertas, setOrigensAbertas] = useState<Record<string, boolean>>({});
  if (!registroSelecionado) return null;
  const total = valorTotalRecolhimento(registroSelecionado);
  const pagos = registroSelecionado.boletos.filter((boleto) => boleto.situacaoPagamento === "Pago").reduce((soma, boleto) => soma + boleto.valor, 0);
  const agrupamentos = registroSelecionado.boletos.flatMap((boleto) => boleto.gtas).filter((gta) => tipoOrigem === "Todos" || (gta.origemTipo ?? "Estabelecimento") === tipoOrigem).reduce<Record<string, { gtas: typeof registroSelecionado.boletos[number]["gtas"]; total: number; tipo: "Estabelecimento" | "Pessoa" }>>((grupos, gta) => {
    const origem = gta.origem ?? "Origem não informada";
    const tipo = gta.origemTipo ?? "Estabelecimento";
    const chave = `${tipo}:${origem}`;
    grupos[chave] ??= { gtas: [], total: 0, tipo };
    grupos[chave].gtas.push(gta);
    grupos[chave].total += gta.valorContribuicao;
    return grupos;
  }, {});

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-slate-800">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="boletos-gta" hideSearch />
      <main className="mx-auto max-w-[1180px] px-4 py-6 md:px-8">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Inicial</button>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1A7A3C]">Gestão financeira</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faturas &amp; Boletos</h1>
            <p className="mt-1 text-sm text-slate-500">Acompanhe as taxas das GTAs processadas pela sua organização.</p>
          </div>
          <button type="button" onClick={() => window.alert("Exportação da fatura preparada para download.")} className="flex items-center gap-2 rounded-lg border border-[#b9d7c1] bg-white px-4 py-2.5 text-sm font-semibold text-[#1A7A3C] shadow-sm hover:bg-[#eef8f1]"><Download size={16} /> Exportar fatura</button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-[#d7e5dc] bg-white/70 p-2 shadow-sm">
          {registros.map((registro) => (
            <button key={registro.id} type="button" onClick={() => setRegistroSelecionado(registro)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${registro.id === registroSelecionado.id ? "bg-[#1A7A3C] text-white shadow" : "text-slate-600 hover:bg-[#eef8f1]"}`}>
              {referenciaRecolhimento(registro)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <section className="overflow-hidden rounded-2xl border border-[#d7e5dc] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfece2] bg-[#f7fbf8] px-5 py-4">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#1A7A3C]">Detalhamento por origem</p><h2 className="mt-1 text-lg font-bold text-slate-900">{referenciaRecolhimento(registroSelecionado)}</h2></div>
              <div className="flex flex-wrap gap-1 rounded-lg bg-[#E6F4EA] p-1">
                {(["Todos", "Estabelecimento", "Pessoa"] as const).map((tipo) => <button key={tipo} type="button" onClick={() => setTipoOrigem(tipo)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${tipoOrigem === tipo ? "bg-white text-[#1A7A3C] shadow-sm" : "text-[#477256]"}`}>{tipo === "Todos" ? "Todas as origens" : `Por ${tipo.toLowerCase()}`}</button>)}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs">
                <thead className="bg-[#244b38] text-white">
                  <tr>{["Data", "Nº GTA", "Qtd. / Espécie", "Taxa FUNDEsa", "Valor total"].map((titulo) => <th key={titulo} className="px-4 py-3 text-left font-semibold">{titulo}</th>)}</tr>
                </thead>
                <tbody>
                  {Object.entries(agrupamentos).map(([chave, grupo]) => {
                    const aberta = origensAbertas[chave] ?? true;
                    return (
                      <Fragment key={chave}>
                        <tr key={`${chave}-grupo`} className="border-b border-[#dfece2] bg-[#f7f9f7]">
                          <td colSpan={4} className="p-0">
                            <button type="button" onClick={() => setOrigensAbertas((atuais) => ({ ...atuais, [chave]: !aberta }))} className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm font-bold text-slate-700 hover:bg-[#eef8f1]" aria-expanded={aberta}>
                              {aberta ? <ChevronUp size={16} className="shrink-0 text-[#1A7A3C]" /> : <ChevronDown size={16} className="shrink-0 text-[#1A7A3C]" />}
                              <ReceiptText size={16} className="text-[#1A7A3C]" />
                              <span>{grupo.gtas[0]?.origem ?? "Origem não informada"}</span>
                              <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[10px] font-bold uppercase text-[#1A7A3C]">{grupo.tipo}</span>
                              <span className="ml-auto text-xs font-semibold text-slate-500">{grupo.gtas.length} lançamento(s)</span>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">{formatarMoeda(grupo.total)}</td>
                        </tr>
                        {aberta && grupo.gtas.map((gta) => (
                          <tr key={gta.numero} className="border-b border-slate-100 hover:bg-[#f7fbf8]">
                            <td className="px-4 py-3 text-slate-600">{formatarData(gta.dataEmissao)}</td>
                            <td className="px-4 py-3 font-bold text-[#1A7A3C]">{gta.serie ? `${gta.serie}-` : ""}{gta.numero}</td>
                            <td className="px-4 py-3 text-slate-600">{gta.totalAnimais} {gta.especie}s</td>
                            <td className="px-4 py-3 text-slate-600">{formatarMoeda(gta.valorContribuicao)}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{formatarMoeda(gta.valorContribuicao)}</td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-[#9bcbb0] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total a pagar</p><span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-[11px] font-bold text-[#17763b]">{registroSelecionado.situacao}</span></div><p className="mt-3 text-4xl font-black tracking-tight text-slate-900">{formatarMoeda(total)}</p><div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-xs"><div className="flex justify-between"><span className="text-slate-500">Mês de referência</span><strong>{referenciaRecolhimento(registroSelecionado)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Vencimento</span><strong className="text-[#d15d5d]">{formatarData(registroSelecionado.dataVencimento)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Total já pago</span><strong>{formatarMoeda(pagos)}</strong></div></div><button type="button" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registroSelecionado)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#15612F]"><WalletCards size={17} /> Pagar fatura <ArrowUpRight size={15} /></button></section>
            <section className="rounded-2xl border border-[#d7e5dc] bg-[#eef8f1] p-5 text-sm text-slate-600"><div className="flex gap-3"><Clock3 size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><p>Boletos gerados após as 16h ou no final de semana serão processados no próximo dia útil. O vencimento considera o quinto dia útil.</p></div></section>
            <section className="rounded-2xl border border-[#d7e5dc] bg-white p-5"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarDays size={17} className="text-[#1A7A3C]" /> Ações rápidas</div><button type="button" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registroSelecionado)} className="mt-4 flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-[#1A7A3C] hover:bg-[#eef8f1]">Ver detalhes da fatura <Eye size={16} /></button></section>
          </aside>
        </div>
      </main>
    </div>
  );
}
