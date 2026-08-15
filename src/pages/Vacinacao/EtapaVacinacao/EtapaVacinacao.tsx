import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Dna, Eye, Pencil, Search, SlidersHorizontal, Syringe, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  DOENCAS_ETAPA_MOCK,
  ESPECIES_ETAPA_MOCK,
  listarEtapasVacinacao,
  type DoencaEtapaVacinacao,
  type EspecieEtapaVacinacao,
  type SituacaoEtapaVacinacao,
} from "./etapaVacinacaoData";

const GREEN = "#1A7A3C";
const SITUACOES: Array<{ value: SituacaoEtapaVacinacao; label: SituacaoEtapaVacinacao }> = [
  { value: "Criada", label: "Criada" },
  { value: "Aberta", label: "Aberta" },
  { value: "Finalizada", label: "Finalizada" },
];

function formatarData(iso: string) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white">
      {children}<button type="button" onClick={onRemove} aria-label="Remover filtro"><X size={13} /></button>
    </span>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EtapaVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  const etapas = listarEtapasVacinacao();
  const [codigo, setCodigo] = useState("");
  const [doenca, setDoenca] = useState<DoencaEtapaVacinacao | null>(null);
  const [especie, setEspecie] = useState<EspecieEtapaVacinacao | null>(null);
  const [situacao, setSituacao] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [pesquisado, setPesquisado] = useState(false);
  const [erro, setErro] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const algumFiltro = Boolean(codigo.trim() || doenca || especie || situacao);

  const resultados = useMemo(() => etapas.filter((item) => {
    if (codigo.trim() && !item.codigo.toLocaleLowerCase("pt-BR").includes(codigo.trim().toLocaleLowerCase("pt-BR"))) return false;
    if (doenca && item.doenca.id !== doenca.id) return false;
    if (especie && !item.especies.some((itemEspecie) => itemEspecie.id === especie.id)) return false;
    if (situacao && item.situacao !== situacao) return false;
    return true;
  }), [codigo, doenca, especie, situacao, etapas]);

  const pesquisar = () => {
    if (!algumFiltro) {
      setErro(true);
      setPesquisado(false);
      return;
    }
    setErro(false);
    setPesquisado(true);
    setPagina(1);
  };
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const itensPagina = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = resultados.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, resultados.length);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Inicial</button>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Etapa de Vacinação</h1>
          <button type="button" onClick={() => onNavigate("adicionar-etapa-vacinacao")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar Nova</button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="flex gap-3">
              <div className={`group relative flex h-12 flex-1 items-end rounded-md border px-3 pb-1.5 ${erro ? "border-red-400 ring-1 ring-red-200" : "border-gray-300 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
                <label className={`pointer-events-none absolute left-3 transition-all ${codigo ? "top-1 text-[10px] text-gray-400" : "top-1/2 -translate-y-1/2 text-sm text-gray-400 group-focus-within:top-1 group-focus-within:translate-y-0 group-focus-within:text-[10px]"}`}>Código (Ano/Sequencial)</label>
                <input value={codigo} maxLength={7} onChange={(event) => { setCodigo(event.target.value); setErro(false); }} onKeyDown={(event) => event.key === "Enter" && pesquisar()} className="h-6 w-full bg-transparent text-sm text-gray-800 outline-none" />
                <Search size={16} className="mb-1 text-gray-400" />
              </div>
              <button type="button" aria-label="Exibir filtros" onClick={() => setFiltrosAbertos((aberto) => !aberto)} className={`flex w-12 items-center justify-center rounded-md border border-[#1A7A3C] ${filtrosAbertos ? "bg-white text-[#1A7A3C]" : "bg-[#1A7A3C] text-white"}`}><SlidersHorizontal size={17} /></button>
            </div>

            {filtrosAbertos && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                <EntitySearchInput label="Doença" placeholder="Buscar por doença." value={doenca?.nome ?? ""} data={DOENCAS_ETAPA_MOCK} searchKeys={["codigo", "nome"]} columns={[{ label: "Código", key: "codigo" }, { label: "Doença", key: "nome" }]} icon={<Syringe size={18} color={GREEN} />} title="Buscar Doença" subtitle="Busque por uma doença cadastrada:" onChange={setDoenca} />
                <EntitySearchInput label="Espécie" placeholder="Buscar por espécie." value={especie?.nome ?? ""} data={ESPECIES_ETAPA_MOCK} searchKeys={["codigo", "nome"]} columns={[{ label: "Código", key: "codigo" }, { label: "Espécie", key: "nome" }]} icon={<Dna size={18} color={GREEN} />} title="Buscar Espécie" subtitle="Busque por uma espécie cadastrada:" onChange={setEspecie} />
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
                <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] px-8 text-sm font-semibold text-white hover:bg-[#15612F]">Pesquisar</button>
              </div>
            )}
            {erro && <p className="mt-3 text-sm text-red-500">Preencha o código ou selecione ao menos um filtro para pesquisar.</p>}
            {(doenca || especie || situacao) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {doenca && <Chip onRemove={() => setDoenca(null)}>Doença: {doenca.nome}</Chip>}
                {especie && <Chip onRemove={() => setEspecie(null)}>Espécie: {especie.nome}</Chip>}
                {situacao && <Chip onRemove={() => setSituacao("")}>Situação: {situacao}</Chip>}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100">
            {!pesquisado ? (
              <p className="p-12 text-center text-sm text-gray-500">Busque por uma etapa de vacinação utilizando o campo de busca e os filtros acima.</p>
            ) : resultados.length === 0 ? (
              <p className="p-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50/50 text-left uppercase text-gray-600">
                      <th className="px-4 py-3 font-semibold">Código</th><th className="px-4 py-3 font-semibold">Doença</th><th className="px-4 py-3 font-semibold">Espécies</th><th className="px-4 py-3 font-semibold">Data de Início</th><th className="px-4 py-3 font-semibold">Data do Fim</th><th className="px-4 py-3 font-semibold">Situação</th><th className="w-24 px-4 py-3" />
                    </tr></thead>
                    <tbody>{itensPagina.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 text-gray-600 hover:bg-gray-50/60">
                        <td className="whitespace-nowrap px-4 py-3">{item.codigo}</td><td className="px-4 py-3">{item.doenca.nome}</td><td className="px-4 py-3">{item.especies.map((especieItem) => especieItem.nome).join(", ")}</td><td className="whitespace-nowrap px-4 py-3">{formatarData(item.dataInicio)}</td><td className="whitespace-nowrap px-4 py-3">{formatarData(item.dataFim)}</td><td className="px-4 py-3">{item.situacao}</td>
                        <td className="px-4 py-3"><div className="flex justify-end gap-1">
                          <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-etapa-vacinacao", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Eye size={18} /></button>
                          {item.situacao !== "Finalizada" && <button type="button" title="Editar" onClick={() => onNavigate("editar-etapa-vacinacao", item)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Pencil size={17} /></button>}
                        </div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
                  <span>Itens por página: {porPagina}</span><div className="flex items-center gap-4"><span>{inicio} - {fim} de {resultados.length}</span><div className="flex gap-1"><button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((item) => Math.max(1, item - 1))} className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button><button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((item) => Math.min(totalPaginas, item + 1))} className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button></div></div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
