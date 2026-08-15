import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Pencil, Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import { useMockDatabaseRevision } from "../../../mocks/useMockDatabase";
import * as Icons from "../../../imports/icons";
import {
  DOENCAS_TIPO_VACINA_MOCK,
  ESPECIES_TIPO_VACINA_MOCK,
  formatarNomes,
  listarTiposVacina,
  SITUACOES_TIPO_VACINA,
} from "./tipoVacinaData";

interface Props { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; }

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <div className="flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white shadow-sm"><span>{label}</span><button type="button" onClick={onRemove}><X size={14} /></button></div>;
}

export function TipoVacinaPage({ onLogout, onNavigate }: Props) {
  const revisaoBanco = useMockDatabaseRevision();
  const [nome, setNome] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [especie, setEspecie] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");
  const [filtros, setFiltros] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erro, setErro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const temFiltro = Boolean(nome.trim() || doenca || especie || situacao);

  const resultados = useMemo(() => listarTiposVacina().filter((item) =>
    (!nome.trim() || item.nome.toLowerCase().includes(nome.trim().toLowerCase())) &&
    (!doenca || item.doencas.some((valor) => valor.id === doenca.id)) &&
    (!especie || item.especies.some((valor) => valor.id === especie.id)) &&
    (!situacao || item.situacao === situacao)
  ), [nome, doenca, especie, situacao, revisaoBanco]);

  const pesquisar = () => {
    if (!temFiltro) { setErro(true); setPesquisou(false); return; }
    setErro(false); setPesquisou(true); setPagina(1);
  };
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / 10));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const linhas = resultados.slice((paginaAtual - 1) * 10, paginaAtual * 10);
  const inicio = resultados.length ? (paginaAtual - 1) * 10 + 1 : 0;
  const fim = Math.min(paginaAtual * 10, resultados.length);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Inicial</button>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Tipo de Vacina</h1>
          <button type="button" onClick={() => onNavigate("adicionar-tipo-vacina")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar Novo</button>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-stretch gap-3">
            <div className="relative flex h-12 flex-1 items-end rounded-md border border-gray-200 bg-white px-3 pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`pointer-events-none absolute left-3 text-gray-400 transition-all ${nome ? "top-1 text-[10px] font-medium" : "top-1/2 -translate-y-1/2 text-sm"}`}>Nome do Tipo de Vacina</label>
              <div className="flex h-6 w-full items-center"><input value={nome} maxLength={255} onChange={(event) => { setNome(event.target.value); setErro(false); }} onKeyDown={(event) => event.key === "Enter" && pesquisar()} className="w-full bg-transparent text-sm text-gray-800 outline-none" /><Search size={15} className="ml-2 shrink-0 text-gray-400" /></div>
            </div>
            <button type="button" onClick={() => setFiltros((value) => !value)} aria-label="Exibir filtros" className="flex shrink-0 items-center justify-center rounded-md border border-[#1A7A3C] px-4" style={{ backgroundColor: filtros ? "transparent" : "#1A7A3C", color: filtros ? "#1A7A3C" : "white" }}><SlidersHorizontal size={16} /></button>
          </div>

          {filtros && <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EntitySearchInput label="Doença" placeholder="Buscar por doença" value={doenca?.nome ?? ""} data={DOENCAS_TIPO_VACINA_MOCK} searchKeys={["codigo", "nome"]} columns={[{ label: "Código", key: "codigo" }, { label: "Doença", key: "nome" }]} icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="h-5 w-5 object-contain" />} onChange={setDoenca} title="Buscar Doença" subtitle="Busque por uma doença cadastrada:" />
            <EntitySearchInput label="Espécie" placeholder="Buscar por espécie" value={especie?.nome ?? ""} data={ESPECIES_TIPO_VACINA_MOCK} searchKeys={["codigo", "nome"]} columns={[{ label: "Código", key: "codigo" }, { label: "Espécie", key: "nome" }]} icon={<Search size={18} className="text-[#1A7A3C]" />} onChange={setEspecie} title="Buscar Espécie" subtitle="Busque por uma espécie cadastrada:" />
            <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_TIPO_VACINA} />
            <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] text-sm font-semibold text-white hover:bg-[#15612F]">Pesquisar</button>
          </div>}
          {erro && <p className="text-sm font-medium text-red-500">Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.</p>}
          {temFiltro && <div className="flex flex-wrap gap-2">
            {nome.trim() && <Chip label={`Nome: ${nome}`} onRemove={() => setNome("")} />}
            {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />}
            {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}
            {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
          </div>}

          {!pesquisou ? <div className="py-12 text-center text-sm text-gray-500">Busque por tipo de vacina utilizando o campo de busca e os filtros acima.</div> : linhas.length === 0 ? <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div> : <div className="w-full overflow-x-auto border-t border-gray-100 pt-2">
            <table className="w-full border-collapse text-sm"><thead><tr className="border-b border-gray-100"><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Nome do Tipo de Vacina</th><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Doença</th><th className="px-4 py-3 text-left font-semibold uppercase text-gray-600">Situação</th><th className="w-[100px] px-4 py-3" /></tr></thead>
              <tbody>{linhas.map((item) => <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/60"><td className="px-4 py-3 text-gray-500">{item.nome}</td><td className="px-4 py-3 text-gray-500">{formatarNomes(item.doencas)}</td><td className="px-4 py-3 text-gray-500">{item.situacao}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => onNavigate("visualizar-tipo-vacina", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50" title="Visualizar"><Eye size={18} /></button><button type="button" onClick={() => onNavigate("editar-tipo-vacina", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50" title="Editar"><Pencil size={17} /></button></div></td></tr>)}</tbody>
            </table>
            <div className="flex items-center justify-between pt-4 text-sm text-gray-500"><span>Itens por página: 10</span><div className="flex items-center gap-4"><span>{inicio} - {fim} de {resultados.length}</span><div className="flex gap-2"><button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((value) => Math.max(1, value - 1))} className="disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((value) => Math.min(totalPaginas, value + 1))} className="disabled:opacity-30"><ChevronRight size={18} /></button></div></div></div>
          </div>}
        </section>
      </main>
    </div>
  );
}
