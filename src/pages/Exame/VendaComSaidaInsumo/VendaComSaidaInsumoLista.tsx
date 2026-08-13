import { ArrowLeft, ChevronLeft, ChevronRight, Eye, FlaskConical, Pencil, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatCombobox, FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  DOENCAS,
  LABORATORIOS,
  listarVendasSaidaInsumo,
  REVENDEDORAS_INSUMO,
  TIPOS_INSUMO,
  type EntidadeVendaSaidaInsumo,
} from "./vendaComSaidaInsumoData";

const VAZIO = { emitente: null as EntidadeVendaSaidaInsumo | null, tipoDestinatario: "", destinatario: "", documento: "", notaFiscal: "", partida: "", laboratorio: null as EntidadeVendaSaidaInsumo | null, doenca: "", tipoInsumo: "", situacao: "" };

export function VendaComSaidaInsumoPage({ onLogout, onNavigate }: any) {
  const [filtros, setFiltros] = useState(VAZIO);
  const [aplicados, setAplicados] = useState<typeof VAZIO | null>(null);
  const [erro, setErro] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const porPagina = 10;
  const atualizar = (patch: Partial<typeof VAZIO>) => { setFiltros((atual) => ({ ...atual, ...patch })); setErro(false); };
  const temFiltro = Object.values(filtros).some(Boolean);

  const resultados = useMemo(() => {
    if (!aplicados) return [];
    const texto = (valor: unknown) => String(valor ?? "").toLocaleLowerCase("pt-BR");
    return listarVendasSaidaInsumo().filter((venda) => {
      const lotes = venda.lotes;
      return (!aplicados.emitente || venda.emitente.id === aplicados.emitente.id)
        && (!aplicados.tipoDestinatario || venda.tipoDestinatario === aplicados.tipoDestinatario)
        && (!aplicados.destinatario || texto(venda.destinatario.nome).includes(texto(aplicados.destinatario)))
        && (!aplicados.documento || texto(venda.destinatario.documento).includes(texto(aplicados.documento)))
        && (!aplicados.notaFiscal || venda.numeroNotaFiscal.includes(aplicados.notaFiscal))
        && (!aplicados.partida || lotes.some((lote) => texto(lote.numeroPartida).includes(texto(aplicados.partida))))
        && (!aplicados.laboratorio || lotes.some((lote) => lote.laboratorio === aplicados.laboratorio?.nome))
        && (!aplicados.doenca || lotes.some((lote) => lote.doenca === aplicados.doenca))
        && (!aplicados.tipoInsumo || lotes.some((lote) => lote.tipoInsumo === aplicados.tipoInsumo))
        && (!aplicados.situacao || venda.situacao === aplicados.situacao);
    }).sort((a, b) => a.destinatario.nome.localeCompare(b.destinatario.nome, "pt-BR"));
  }, [aplicados]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const pagina = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const pesquisar = () => {
    if (!temFiltro) { setErro(true); setAplicados(null); return; }
    setAplicados({ ...filtros }); setPaginaAtual(1);
  };

  return <div className="min-h-screen bg-[#f2f3f5] pb-16">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-insumo" hideSearch />
    <main className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-6 md:px-6">
      <header>
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C]"><ArrowLeft size={15} /> Inicial</button>
        <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Venda com Saída de Insumo</h1><button type="button" onClick={() => onNavigate("adicionar-venda-saida-insumo")} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Adicionar Nova</button></div>
      </header>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <EntitySearchInput label="Revendedora de Produtos Agropecuários" placeholder="Buscar por nome ou código" value={filtros.emitente?.nome ?? ""} data={REVENDEDORAS_INSUMO} searchKeys={["nome", "codigo", "documento"]} columns={[{ label: "Código", key: "codigo" }, { label: "Nome", key: "nome" }]} icon={<Store size={18} />} onChange={(emitente) => atualizar({ emitente })} />
          <FloatSelect label="Tipo de Destinatário" value={filtros.tipoDestinatario} onChange={(tipoDestinatario) => atualizar({ tipoDestinatario })} options={["Médico Veterinário Habilitado PNCEBT", "Instituição de Ensino e Pesquisa", "Laboratório", "Responsável Técnico GRSC", "Revendedora de Produtos Agropecuários"].map((item) => ({ value: item, label: item }))} />
          <FloatInput label="Destinatário" maxLength={255} value={filtros.destinatario} onChange={(destinatario) => atualizar({ destinatario })} />
          <FloatInput label="CPF/CNPJ do Destinatário" maxLength={14} value={filtros.documento} onChange={(documento) => atualizar({ documento })} />
          <FloatInput label="Número da Nota Fiscal" maxLength={10} value={filtros.notaFiscal} onChange={(notaFiscal) => atualizar({ notaFiscal: notaFiscal.replace(/\D/g, "").slice(0, 10) })} />
          <FloatInput label="Número de Partida" maxLength={20} value={filtros.partida} onChange={(partida) => atualizar({ partida })} />
          <EntitySearchInput label="Laboratório" placeholder="Buscar por nome ou código" value={filtros.laboratorio?.nome ?? ""} data={LABORATORIOS} searchKeys={["nome", "codigo"]} columns={[{ label: "Código", key: "codigo" }, { label: "Nome", key: "nome" }]} icon={<FlaskConical size={18} />} onChange={(laboratorio) => atualizar({ laboratorio })} />
          <FloatCombobox label="Doença" value={filtros.doenca} onChange={(doenca) => atualizar({ doenca })} options={DOENCAS} />
          <FloatCombobox label="Tipo de Insumo" value={filtros.tipoInsumo} onChange={(tipoInsumo) => atualizar({ tipoInsumo })} options={TIPOS_INSUMO} />
          <FloatSelect label="Situação" value={filtros.situacao} onChange={(situacao) => atualizar({ situacao })} options={[{ value: "Gravada", label: "Gravada" }, { value: "Cancelada", label: "Cancelada" }]} />
          <button type="button" onClick={pesquisar} className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white md:col-start-4"><Search size={17} /> Pesquisar</button>
        </div>
        {erro && <p className="mt-3 text-sm text-red-600">Preencha pelo menos um filtro para pesquisar.</p>}

        {aplicados && <div className="mt-7 overflow-x-auto border-t border-gray-100 pt-5">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead><tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500"><th className="px-3 py-3">Fornecedor</th><th className="px-3 py-3">Destinatário</th><th className="px-3 py-3">Número da nota fiscal</th><th className="px-3 py-3">Lotes</th><th className="px-3 py-3">Situação</th><th className="px-3 py-3 text-center">Ações</th></tr></thead>
            <tbody>{pagina.map((venda) => <tr key={venda.id} className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50/60"><td className="px-3 py-4">{venda.emitente.codigo} - {venda.emitente.nome}</td><td className="px-3 py-4">{venda.destinatario.documento || venda.destinatario.codigo} - {venda.destinatario.nome}</td><td className="px-3 py-4">{venda.numeroNotaFiscal}</td><td className="px-3 py-4">{venda.lotes.map((lote) => `${lote.numeroPartida} - ${lote.laboratorio} - ${lote.doenca} - ${lote.tipoInsumo}`).join("; ")}</td><td className="px-3 py-4">{venda.situacao}</td><td className="px-3 py-4"><div className="flex justify-center gap-1"><button type="button" onClick={() => onNavigate("visualizar-venda-saida-insumo", venda)} title="Visualizar" className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Eye size={18} /></button><button type="button" onClick={() => onNavigate("editar-venda-saida-insumo", venda)} title="Editar" className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Pencil size={18} /></button></div></td></tr>)}</tbody>
          </table>
          {resultados.length === 0 && <div className="py-10 text-center text-sm text-gray-500">Nenhum registro encontrado.</div>}
          {resultados.length > 0 && <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500"><span>Mostrando {(paginaAtual - 1) * porPagina + 1} a {Math.min(paginaAtual * porPagina, resultados.length)} de {resultados.length} resultado(s)</span><div className="flex items-center gap-2"><button type="button" disabled={paginaAtual === 1} onClick={() => setPaginaAtual((atual) => atual - 1)} className="rounded p-1 disabled:opacity-30"><ChevronLeft size={17} /></button><span>{paginaAtual} de {totalPaginas}</span><button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual((atual) => atual + 1)} className="rounded p-1 disabled:opacity-30"><ChevronRight size={17} /></button></div></div>}
        </div>}
      </section>
    </main>
  </div>;
}
