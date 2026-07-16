import { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
  Store,
  FlaskConical,
  Calendar
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE
// ==========================================================
const REVENDEDORAS_MOCK = [
  { id: 1, codigo: "3120938028", nome: "Comercial AgroVat", uf: "MG" },
  { id: 2, codigo: "3120938045", nome: "Agropecuária Vale Verde", uf: "MG" },
  { id: 3, codigo: "3120938090", nome: "Casa do Produtor Lavras", uf: "MG" },
];

const DOENCAS_MOCK = [
  { id: 1, codigo: "D-001", nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, codigo: "D-002", nome: "Raiva", tiposVacina: [] },
  { id: 3, codigo: "D-003", nome: "Febre Aftosa", tiposVacina: ["O1 Campos", "A24 Cruzeiro"] },
];

const TIPOS_LANCAMENTO = [
  { value: "Ajuste de Saldo de Vacina", label: "Ajuste de Saldo de Vacina" },
  { value: "Entrada Nota Fiscal Revendedora", label: "Entrada Nota Fiscal Revendedora" },
  { value: "Compra de Vacina Revendedora", label: "Compra de Vacina Revendedora" },
  { value: "Compra de Vacina Pessoa", label: "Compra de Vacina Pessoa" },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

interface Lancamento {
  id: number;
  revendedoraCodigo: string;
  revendedoraNome: string;
  numeroNotaFiscal: string;
  numeroPartida: string;
  doenca: string;
  tipoVacina: string;
  tipoLancamento: string;
  situacao: "Gravada" | "Cancelada";
}

const LANCAMENTOS_MOCK: Lancamento[] = [
  { id: 1, revendedoraCodigo: "3120938028", revendedoraNome: "Comercial AgroVat", numeroNotaFiscal: "1234567", numeroPartida: "025/24", doenca: "Brucelose", tipoVacina: "B19", tipoLancamento: "Ajuste de Saldo de Vacina", situacao: "Gravada" },
  { id: 2, revendedoraCodigo: "3120938045", revendedoraNome: "Agropecuária Vale Verde", numeroNotaFiscal: "7654321", numeroPartida: "006/23", doenca: "Febre Aftosa", tipoVacina: "O1 Campos", tipoLancamento: "Compra de Vacina Revendedora", situacao: "Cancelada" },
  { id: 3, revendedoraCodigo: "3120938090", revendedoraNome: "Casa do Produtor Lavras", numeroNotaFiscal: "9080706", numeroPartida: "100/24", doenca: "Raiva", tipoVacina: "", tipoLancamento: "Compra de Vacina Pessoa", situacao: "Gravada" },
];

function SituacaoBadge({ situacao }: { situacao: Lancamento["situacao"] }) {
  const map = {
    Gravada: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Cancelada: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function LancamentoDosesVacinaPage({ onLogout, onNavigate }: PageProps) {
  const [revendedora, setRevendedora] = useState<any | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [numeroPartida, setNumeroPartida] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [tipoVacina, setTipoVacina] = useState("");
  const [tipoLancamento, setTipoLancamento] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroRevendedora, setErroRevendedora] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const tiposVacinaDisponiveis = (doenca?.tiposVacina ?? []).map((t: string) => ({ value: t, label: t }));
  const doencaTemTipoVacina = (doenca?.tiposVacina?.length ?? 0) > 0;
  const periodoInvalido = periodoDe && periodoAte && periodoAte < periodoDe;

  const handlePesquisar = () => {
    if (!revendedora) {
      setErroRevendedora(true);
      setHasSearched(false);
      return;
    }
    setErroRevendedora(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = LANCAMENTOS_MOCK.filter((l) => {
    const matchRev = !revendedora || l.revendedoraCodigo === revendedora.codigo;
    const matchNF = numeroNotaFiscal === "" || l.numeroNotaFiscal.includes(numeroNotaFiscal);
    const matchPartida = numeroPartida === "" || l.numeroPartida.includes(numeroPartida);
    const matchDoenca = !doenca || l.doenca === doenca.nome;
    const matchTipoVacina = tipoVacina === "" || l.tipoVacina === tipoVacina;
    const matchTipoLanc = tipoLancamento === "" || l.tipoLancamento === tipoLancamento;
    return matchRev && matchNF && matchPartida && matchDoenca && matchTipoVacina && matchTipoLanc;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = revendedora || numeroNotaFiscal || numeroPartida || doenca || tipoVacina || tipoLancamento || periodoDe || periodoAte || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Ajuste de Doses de Vacina</h1>
            <button onClick={() => onNavigate("adicionar-lancamento-doses-vacina")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* ÚNICO CARD BRANCO PARA FILTROS E TABELA */}
        <div className="bg-white rounded-xl shadow-sm mt-5 overflow-hidden">
          
          {/* Sessão interna de Filtros */}
          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <EntitySearchInput
                label="Revendedora de Produtos Agropecuários"
                required
                placeholder="Buscar por código ou nome."
                value={revendedora ? ` ${revendedora.nome}` : ""}
                data={REVENDEDORAS_MOCK}
                searchKeys={["codigo", "nome"]}
                columns={[{ label: "Código", key: "codigo" }, { label: "Nome", key: "nome" }, { label: "UF", key: "uf" }]}
                icon={<Store size={18} color={GREEN} />}
                title="Buscar Revendedora"
                subtitle="Busque por uma revendedora de produtos agropecuários cadastrada:"
                onChange={(ent) => { setRevendedora(ent); setErroRevendedora(false); }}
              />

              <div className="relative border border-gray-300 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <label className={`absolute left-3 transition-all ${numeroNotaFiscal ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Número da Nota Fiscal</label>
                <input type="text" inputMode="numeric" maxLength={30} value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value.replace(/\D/g, ""))} className="w-full bg-transparent text-sm text-gray-800 outline-none h-6" />
              </div>

              <button onClick={handlePesquisar} className="h-11 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90 lg:row-span-1" style={{ backgroundColor: GREEN }}>
                Pesquisar
              </button>

              <div className="relative border border-gray-300 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <label className={`absolute left-3 transition-all ${numeroPartida ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Número da Partida</label>
                <input type="text" inputMode="numeric" maxLength={9} value={numeroPartida} onChange={(e) => setNumeroPartida(e.target.value)} className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 placeholder:text-gray-300" />
              </div>

              <EntitySearchInput
                label="Doença"
                placeholder="Buscar pelo nome da doença."
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<FlaskConical size={18} color={GREEN} />}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={(ent) => { setDoenca(ent); setTipoVacina(""); }}
              />

              {/* Tipo de Vacina — disponível apenas se a doença possuir tipos */}
{doencaTemTipoVacina && (
  <FloatSelect label="Tipo de Vacina" value={tipoVacina} onChange={setTipoVacina} options={tiposVacinaDisponiveis} />
)}


              <FloatInput label="Período - De" type="date" value={periodoDe} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoDe} />
              <FloatInput label="Período - Até" type="date" value={periodoAte} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoAte} />
              
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
            </div>

            {periodoInvalido && (
              <p className="text-sm text-red-500 mt-3">A data "Até" deve ser maior ou igual à data "De".</p>
            )}

            {erroRevendedora && (
              <p className="text-sm text-red-500 mt-3">A revendedora de produtos agropecuários é obrigatória para realizar a busca.</p>
            )}

            {temFiltroAtivo && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {revendedora && <Chip label={`Revendedora: ${revendedora.nome}`} onRemove={() => setRevendedora(null)} />}
                {numeroNotaFiscal && <Chip label={`NF: ${numeroNotaFiscal}`} onRemove={() => setNumeroNotaFiscal("")} />}
                {numeroPartida && <Chip label={`Partida: ${numeroPartida}`} onRemove={() => setNumeroPartida("")} />}
                {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => { setDoenca(null); setTipoVacina(""); }} />}
                {tipoVacina && <Chip label={`Tipo de Vacina: ${tipoVacina}`} onRemove={() => setTipoVacina("")} />}
                {tipoLancamento && <Chip label={`Lançamento: ${tipoLancamento}`} onRemove={() => setTipoLancamento("")} />}
                {periodoDe && <Chip label={`De: ${periodoDe.split("-").reverse().join("/")}`} onRemove={() => setPeriodoDe("")} />}
                {periodoAte && <Chip label={`Até: ${periodoAte.split("-").reverse().join("/")}`} onRemove={() => setPeriodoAte("")} />}
                {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              </div>
            )}
          </div>

          {/* Sessão interna de Tabela e Resultados */}
          <div>
            {!hasSearched ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Busque pelo ajuste de doses utilizando os filtros acima.</p>
              </div>
            ) : total === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
<thead>
  <tr className=" border-b border-gray-100">
    {/* Coluna Longa: Definida com largura fixa para não quebrar linha de forma feia */}
    <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 w-80">
      Revendedora de Produtos Agropecuários
    </th>

    {/* Nota Fiscal: Espaço fixo ideal para números */}
    <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap w-48">
      Número da Nota Fiscal
    </th>

    {/* Número da Partida: Espaço fixo ideal */}
    <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap w-44">
      Número da Partida
    </th>

    {/* Coluna "Doença": Agora ela vai ocupar de forma fluida todo o resto do espaço disponível da tabela */}
    <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600">
      Doença
    </th>

    {/* Coluna "Situação": Tamanho fixo controlado */}
    <th className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap w-40">
      Situação
    </th>

    {/* Coluna de Ações (Botão excluir/editar se houver) */}
    <th className="px-4 py-3 w-16" />
  </tr>
</thead>
                    <tbody>
                      {pagina.map((l) => (
                        <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition text-sm text-gray-700">
                          {/* Coluna com quebra de linha correta usando quebra textual real */}
                          <td className="px-4 py-3 whitespace-pre-line max-w-[220px] leading-relaxed font-normal">
                            {l.revendedoraCodigo} - <br/> {l.revendedoraNome}
                          </td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.numeroNotaFiscal}</td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.numeroPartida}</td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.doenca}{l.tipoVacina ? ` (${l.tipoVacina})` : ""}</td>
                          <td className="px-4 py-3 font-normal text-gray-700 whitespace-nowrap">{l.situacao}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => onNavigate("visualizar-lancamento-doses-vacina", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                              <button onClick={() => onNavigate("editar-lancamento-doses-vacina", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação Interna */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30">
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
          </div>

        </div>
      </main>
    </div>
  );
}