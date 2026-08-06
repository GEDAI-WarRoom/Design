import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  FlaskConical,
  Dna
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS PARA OS FILTROS
// ==========================================================
const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", especies: ["Bovino", "Bubalino"] },
  { id: 2, codigo: "D-002", nome: "Febre Aftosa", especies: ["Bovino", "Bubalino", "Suíno"] },
  { id: 3, codigo: "D-003", nome: "Raiva", especies: ["Bovino", "Equino"] },
];

const SITUACOES = [
  { value: "Aberta", label: "Aberta" },
  { value: "Criada", label: "Criada" },
  { value: "Finalizada", label: "Finalizada" },
];

// ==========================================================
// ACESSO AO LOCAL STORAGE (SIMULANDO BANCO DE DADOS)
// ==========================================================
const MOCK_KEY = "ETAPAS_VACINACAO_DB";

const ETAPAS_INICIAIS = [
  { id: 1, codigo: "2026/01", especies: [{ nome: "Bovino" }, { nome: "Bubalino" }], doenca: { nome: "Brucelose" }, dataInicio: "2026-02-11", dataFim: "2026-04-12", situacao: "Aberta" },
  { id: 2, codigo: "2026/02", especies: [{ nome: "Bovino" }, { nome: "Suíno" }], doenca: { nome: "Febre Aftosa" }, dataInicio: "2026-05-01", dataFim: "2026-06-30", situacao: "Criada" },
];

const getEtapasDb = () => {
  const stored = localStorage.getItem(MOCK_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(MOCK_KEY, JSON.stringify(ETAPAS_INICIAIS));
  return ETAPAS_INICIAIS;
};

// ==========================================================
// HELPERS
// ==========================================================
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

const fmtData = (iso: string) => {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

export function EtapaVacinacaoPage({ onLogout, onNavigate }: any) {
  const [dbList, setDbList] = useState<any[]>([]);

  useEffect(() => {
    setDbList(getEtapasDb());
  }, []);

  const [codigo, setCodigo] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [especie, setEspecie] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusCodigo, setFocusCodigo] = useState(false);
  
  // CORREÇÃO: Começa como FALSE para não listar nada ao abrir a tela
  const [hasSearched, setHasSearched] = useState(false); 
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const especiesDisponiveis = (doenca?.especies ?? []).map((e: string) => ({ value: e, label: e }));
  
  const algumFiltroPreenchido = codigo.trim() !== "" || !!doenca || especie !== "" || situacao !== "";

  // CORREÇÃO: Valida se algum filtro foi preenchido antes de exibir a tabela
  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = dbList.filter((e) => {
    const nomeDoenca = e.doenca?.nome || "";
    const nomesEspecies = (e.especies || []).map((x: any) => x.nome);

    const matchCodigo = codigo === "" || e.codigo.includes(codigo);
    const matchDoenca = !doenca || nomeDoenca === doenca.nome;
    const matchEspecie = especie === "" || nomesEspecies.includes(especie);
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchCodigo && matchDoenca && matchEspecie && matchSituacao;
  });

  const filtradosOrdenados = [...filtrados].sort((a, b) => b.id - a.id);

  const total = filtradosOrdenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtradosOrdenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = doenca || especie || situacao;

  // FUNÇÃO: Grava o ID no cache antes de ir para visualizar/editar
  const handleAcaoTabela = (tela: string, item: any) => {
    localStorage.setItem("CURRENT_ETAPA_ID", item.id.toString());
    onNavigate(tela, item);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Etapa de Vacinação</h1>
            <button onClick={() => onNavigate("adicionar-etapa-vacinacao")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mt-5">
          <div className="p-6">
            <div className="flex gap-3 items-stretch w-full">
              <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${erroValidacao && !algumFiltroPreenchido ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
                <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusCodigo || codigo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                  Código (Ano/Sequencial)
                </label>
                <div className="flex items-center w-full">
                  <input type="text" maxLength={7} placeholder={focusCodigo ? "2026/01" : ""} value={codigo} onFocus={() => setFocusCodigo(true)} onBlur={() => setFocusCodigo(false)} onChange={(e) => { setCodigo(e.target.value); if (erroValidacao) setErroValidacao(false); }} onKeyDown={(e) => e.key === "Enter" && handlePesquisar()} className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 placeholder:text-gray-300" />
                  <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
                </div>
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <EntitySearchInput label="Doença" placeholder="Buscar pelo nome da doença." value={doenca ? doenca.nome : ""} data={DOENCAS_MOCK} searchKeys={["nome"]} columns={[ { label: "Doença", key: "nome" }]} icon={<FlaskConical size={18} color={GREEN} />} title="Buscar Doença" subtitle="Busque por uma doença cadastrada:" onChange={(ent) => { setDoenca(ent); setEspecie(""); }} />
                  <EntitySearchInput label="Espécie" placeholder="Buscar pelo nome da espécie." value={especie} data={especiesDisponiveis.map((o, i) => ({ id: i, nome: o.value }))} searchKeys={["nome"]} columns={[{ label: "Espécie", key: "nome" }]} icon={<Dna size={18} color={GREEN} />} title="Buscar Espécie" subtitle="Busque por uma espécie associada:" disabled={!doenca} onChange={(ent: any) => setEspecie(ent?.nome ?? "")} />
                  <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
                  <button onClick={handlePesquisar} className="h-11 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>Pesquisar</button>
                </div>
              </div>
            )}

            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3">Selecione ao menos um filtro ou preencha o campo de busca para pesquisar.</p>
            )}

            {temFiltroAtivo && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => { setDoenca(null); setEspecie(""); }} />}
                {especie && <Chip label={`Espécie: ${especie}`} onRemove={() => setEspecie("")} />}
                {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              </div>
            )}
          </div>

          {/* SÓ EXIBE A DIVISÓRIA E OS RESULTADOS SE A BUSCA TIVER SIDO FEITA */}
          {hasSearched ? (
            <>
              <hr className="border-gray-100" />
              {total === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Código</th>
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Doença</th>
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Espécies</th>
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Data Início</th>
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Data Fim</th>
                          <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-nowrap">Situação</th>
                          <th className="px-4 py-3 w-[80px]" />
                        </tr>
                      </thead>
                      <tbody>
                        {pagina.map((e) => (
                          <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.codigo}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{e.doenca?.nome}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{(e.especies || []).map((x:any)=>x.nome).join(", ")}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtData(e.dataInicio)}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtData(e.dataFim)}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-medium">{e.situacao}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 justify-end">
                                <button onClick={() => handleAcaoTabela("visualizar-etapa-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                                <button onClick={() => handleAcaoTabela("editar-etapa-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                    <span>Itens por página: {perPage}</span>
                    <div className="flex items-center gap-4">
                      <span>{inicio} - {fim} de {total}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* MENSAGEM INICIAL */}
              <hr className="border-gray-100" />
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Busque por uma etapa de vacinação utilizando o campo de busca e os filtros acima.</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}