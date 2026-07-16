import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS
// ==========================================================
interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}
const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

// ==========================================================
// RESULTADOS (mock)
// ==========================================================
interface Doacao {
  id: number;
  codigo: string;
  origemNome: string;
  origemDoc: string;
  destinoNome: string;
  destinoDoc: string;
  numeroNotaFiscal: string;
  situacao: "Gravada" | "Cancelada";
}
const DOACOES_MOCK: Doacao[] = [
  { id: 1, codigo: "1112345", origemNome: "Divino de Souza Sobrinho", origemDoc: "444.009.956-40", destinoNome: "José Aarão Neto", destinoDoc: "555.009.956-40", numeroNotaFiscal: "1234567", situacao: "Gravada" },
  { id: 2, codigo: "1115678", origemNome: "Agropecuária Vale Verde Ltda.", origemDoc: "56.338.814/0001-95", destinoNome: "José Aarão Neto", destinoDoc: "555.009.956-40", numeroNotaFiscal: "7654321", situacao: "Cancelada" },
];

// ==========================================================
// HELPERS
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Doacao["situacao"] }) {
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

// Campo "fake-select" que abre um SearchModal de produtor padronizado
function ProdutorTriggerField({ label, value, onClick, iconUrl }: { label: string; value: string; onClick: () => void; iconUrl?: string }) {
  return (
    <div
      onClick={onClick}
      className="relative border border-gray-200 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white text-left hover:border-[#1A7A3C] transition cursor-pointer"
    >
      <span className={`absolute left-9 transition-all pointer-events-none ${value ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>{label}</span>
      <img src={iconUrl || Icons.iconeProdutorUrl} alt="" className="absolute left-3 bottom-2.5 w-5 h-5 object-contain" />
      <span className="text-sm text-gray-800 h-6 flex items-center pl-6 truncate w-full font-medium">{value}</span>
    </div>
  );
}

// ==========================================================
// PÁGINA: BUSCAR DOAÇÃO/PARTILHA DE VACINA (USV08 - AC1/AC2)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function PartilhaVacinaPage({ onLogout, onNavigate }: PageProps) {
  const [codigo, setCodigo] = useState("");
  const [produtorOrigem, setProdutorOrigem] = useState<ProdutorEntidade | null>(null);
  const [produtorDestino, setProdutorDestino] = useState<ProdutorEntidade | null>(null);
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [situacao, setSituacao] = useState("");

  const [modalOrigemOpen, setModalOrigemOpen] = useState(false);
  const [modalDestinoOpen, setModalDestinoOpen] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusCodigo, setFocusCodigo] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const databaseFiltrada = tipoPessoa ? PRODUTORES_MOCK.filter((p) => p.tipo === tipoPessoa) : PRODUTORES_MOCK;
  const colunasModal =
    tipoPessoa === "PJ"
      ? [{ label: "Razão Social", key: "nome" }, { label: "CNPJ", key: "documento" }]
      : [{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }];

  const algumFiltroPreenchido =
    codigo.trim() !== "" || !!produtorOrigem || !!produtorDestino || numeroNotaFiscal !== "" || situacao !== "";

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

  const filtrados = DOACOES_MOCK.filter((d) => {
    const matchCodigo = codigo === "" || d.codigo.includes(codigo);
    const matchOrigem = !produtorOrigem || d.origemDoc === produtorOrigem.documento;
    const matchDestino = !produtorDestino || d.destinoDoc === produtorDestino.documento;
    const matchNF = numeroNotaFiscal === "" || d.numeroNotaFiscal.includes(numeroNotaFiscal);
    const matchSituacao = situacao === "" || d.situacao === situacao;
    return matchCodigo && matchOrigem && matchDestino && matchNF && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = produtorOrigem || produtorDestino || numeroNotaFiscal || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="partilha-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Doação/Partilha de Vacina</h1>
            <button onClick={() => onNavigate("adicionar-partilha-vacina")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* Bloco Unificado (Filtros e Tabela no mesmo Quadrado Branco) */}
        <div className="bg-white rounded-xl shadow-sm mt-5 overflow-hidden">
          <div className="p-6 pb-4">
            {/* Código + Barra de Busca Principal */}
            <div className="flex gap-3 items-stretch w-full">
              <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${
                erroValidacao && !algumFiltroPreenchido
                  ? "border-red-400 ring-1 ring-red-300"
                  : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"
              }`}>
                <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusCodigo || codigo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                  Código da Doação/Partilha
                </label>
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={codigo}
                    onFocus={() => setFocusCodigo(true)}
                    onBlur={() => setFocusCodigo(false)}
                    onChange={(e) => { setCodigo(e.target.value.replace(/\D/g, "")); if (erroValidacao) setErroValidacao(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 font-medium"
                  />
                  <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
                </div>
              </div>

              <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {/* Painel de Filtros Expansível */}
            {showFilters && (
              <div className="mt-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
                  <ProdutorTriggerField 
                    label="Fornecedor" 
                    iconUrl={Icons.iconeFornecedorUrl} 
                    value={produtorOrigem ? produtorOrigem.nome : ""} 
                    onClick={() => setModalOrigemOpen(true)} 
                  />
                  
                  <ProdutorTriggerField 
                    label="Destinatário" 
                    iconUrl={Icons.iconeDestinatarioUrl} 
                    value={produtorDestino ? produtorDestino.nome : ""} 
                    onClick={() => setModalDestinoOpen(true)} 
                  />

                  {/* Número da Nota Fiscal Padronizado */}
                  <div className="relative border border-gray-200 rounded-md h-12 flex items-end px-3 pb-1.5 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C] hover:border-[#1A7A3C] transition">
                    <label className={`absolute left-3 transition-all ${numeroNotaFiscal ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>Número da Nota Fiscal</label>
                    <input type="text" inputMode="numeric" maxLength={30} value={numeroNotaFiscal} onChange={(e) => setNumeroNotaFiscal(e.target.value.replace(/\D/g, ""))} className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 font-medium" />
                  </div>

                  {/* Botão Pesquisar Interno */}
                  <div className="w-full lg:col-start-4 lg:row-start-1">
                    <button onClick={handlePesquisar} className="h-11 w-full px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90 shadow-sm" style={{ backgroundColor: GREEN }}>Pesquisar</button>
                  </div>

                  {/* Campo de Situação Customizado (Padronizado com os outros Inputs) */}
                  <div className="relative border border-gray-200 rounded-md h-12 flex items-end px-2 pb-1 bg-white focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C] hover:border-[#1A7A3C] transition">
                    <label className={`absolute left-3 transition-all pointer-events-none ${situacao ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                      Situação
                    </label>
                    <select
                      value={situacao}
                      onChange={(e) => setSituacao(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none h-7 font-medium appearance-none cursor-pointer pl-1"
                    >
                      <option value=""></option>
                      {SITUACOES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3">Selecione ao menos um filtro ou preencha o campo de busca para pesquisar.</p>
            )}

            {/* Chips de Filtros Ativos */}
            {temFiltroAtivo && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {produtorOrigem && <Chip label={`Origem: ${produtorOrigem.nome}`} onRemove={() => setProdutorOrigem(null)} />}
                {produtorDestino && <Chip label={`Destino: ${produtorDestino.nome}`} onRemove={() => setProdutorDestino(null)} />}
                {numeroNotaFiscal && <Chip label={`NF: ${numeroNotaFiscal}`} onRemove={() => setNumeroNotaFiscal("")} />}
                {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              </div>
            )}
          </div>

          {/* Área de Resultados da Tabela Integrada */}
          <div className="border-t border-gray-100">
            {!hasSearched ? (
              <div className="p-12 text-center bg-gray-50/30">
                <p className="text-sm text-gray-400">Busque por uma doação/partilha de vacina utilizando o campo de busca e os filtros acima.</p>
              </div>
            ) : total === 0 ? (
              <div className="p-12 text-center bg-gray-50/30">
                <p className="text-sm text-gray-400">Nenhum resultado foi encontrado.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
               <thead>
  <tr className="bg-gray-50 border-b border-gray-100">
    {/* Código da Doação/Partilha com quebra de linha */}
    <th className="text-left px-6 py-3 font-semibold text-gray-600 whitespace-nowrap text-xs uppercase tracking-wider">
      Código da
      <br />
      Doação/Partilha
    </th>
    
    {/* Produtor de Origem e Destino */}
    {[
      "Produtor de Origem",
      "Produtor de Destino",
    ].map((h) => (
      <th
        key={h}
        className="text-left px-6 py-3 font-semibold text-gray-600 whitespace-nowrap text-xs uppercase tracking-wider"
      >
        {h}
      </th>
    ))}

    {/* Número da Nota Fiscal com quebra de linha */}
    <th className="text-left px-6 py-3 font-semibold text-gray-600 whitespace-nowrap text-xs uppercase tracking-wider">
      Número da
      <br />
      Nota Fiscal
    </th>

    {/* Situação */}
    <th className="text-left px-6 py-3 font-semibold text-gray-600 whitespace-nowrap text-xs uppercase tracking-wider">
      Situação
    </th>
    
    <th className="px-6 py-3" />
  </tr>
</thead>
                    <tbody>
                      {pagina.map((d) => (
                        <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition">
                          <td className="px-6 py-4 text-gray-800 whitespace-nowrap font-semibold">{d.codigo}</td>
                          
                          {/* Quebra de linha simples com o exato mesmo formato */}
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {d.origemDoc}
                            <br />
                            {d.origemNome}
                          </td>
                          
                          {/* Quebra de linha simples com o exato mesmo formato */}
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {d.destinoDoc}
                            <br />
                            {d.destinoNome}
                          </td>
                          
                          <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium">{d.numeroNotaFiscal}</td>
                          <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium">{d.situacao}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => onNavigate("visualizar-doacao-partilha-vacina", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                              <button onClick={() => onNavigate("editar-doacao-partilha-vacina", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação Integrada */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/20">
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

      {/* ========================================================== */}
      {/* MODAL 1: PRODUTOR DE ORIGEM (FORNECEDOR)                   */}
      {/* ========================================================== */}
      <SearchModal<ProdutorEntidade>
        open={modalOrigemOpen}
        onClose={() => { setModalOrigemOpen(false); setTipoPessoa(""); }}
        title="Buscar Fornecedor"
        subtitle="Busque por um fornecedor cadastrado no sistema:"
        icon={<img src={Icons.iconeFornecedorUrl} alt="Origem" className="w-8 h-8 object-contain" />}
        data={databaseFiltrada}
        columns={colunasModal}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProdutorOrigem(p);
          setModalOrigemOpen(false);
          setTipoPessoa("");
        }}
        headerActions={
          <div className="relative border border-gray-200 rounded-md h-12 flex items-end px-2 pb-1 bg-white min-w-[160px]">
            <label className={`absolute left-3 transition-all pointer-events-none ${tipoPessoa ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
              Tipo de Pessoa
            </label>
            <select
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none h-7 font-medium appearance-none cursor-pointer pl-1"
            >
              <option value=""></option>
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </div>
        }
      />

      {/* ========================================================== */}
      {/* MODAL 2: PRODUTOR DE DESTINO                               */}
      {/* ========================================================== */}
      <SearchModal<ProdutorEntidade>
        open={modalDestinoOpen}
        onClose={() => { setModalDestinoOpen(false); setTipoPessoa(""); }}
        title="Buscar Destinatário"
        subtitle="Busque por um destinatário cadastrado no sistema:"
        icon={<img src={Icons.iconeDestinatarioUrl} alt="Destino" className="w-8 h-8 object-contain" />}
        data={databaseFiltrada}
        columns={colunasModal}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProdutorDestino(p);
          setModalDestinoOpen(false);
          setTipoPessoa("");
        }}
        headerActions={
          <div className="relative border border-gray-200 rounded-md h-12 flex items-end px-2 pb-1 bg-white min-w-[160px]">
            <label className={`absolute left-3 transition-all pointer-events-none ${tipoPessoa ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
              Tipo de Pessoa
            </label>
            <select
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none h-7 font-medium appearance-none cursor-pointer pl-1"
            >
              <option value=""></option>
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </div>
        }
      />
    </div>
  );
}