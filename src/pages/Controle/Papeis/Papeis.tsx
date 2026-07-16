import { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Eye as ViewIcon, Pencil, Copy, X, Check, Minus, ArrowLeft
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// OPÇÕES (US047 - AC1)
// ==========================================================
const TIPOS_PAPEL = [
  { value: "Base", label: "Base" },
  { value: "Complementar", label: "Complementar" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// MOCK (substituir por API)
// ==========================================================
interface Papel {
  id: number;
  nome: string;
  tipo: "Base" | "Complementar";
  situacao: "Ativo" | "Inativo";
}

const PAPEIS_MOCK: Papel[] = [
  { id: 1, nome: "Funcionário", tipo: "Base", situacao: "Ativo" },
  { id: 2, nome: "Responsável Técnico", tipo: "Complementar", situacao: "Ativo" },
  { id: 3, nome: "Administrador", tipo: "Base", situacao: "Ativo" },
  { id: 4, nome: "Produtor Rural", tipo: "Complementar", situacao: "Inativo" },
  { id: 5, nome: "Gestor de Cadastros", tipo: "Base", situacao: "Ativo" },
];

// ==========================================================
// AUXILIARES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Papel["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}
    >
      <Icon size={13} strokeWidth={3} aria-hidden />
      {situacao}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: Papel["tipo"] }) {
  const c =
    tipo === "Base"
      ? { bg: "#E6F4EA", text: "#1A7A3C", border: "#C8E6C9" }
      : { bg: "#E8F4FE", text: "#1976D2", border: "#BBDEFB" };
  return (
    <span
      className="inline-flex items-center px-2.5 h-6 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      {tipo}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover filtro ${label}`}
        className="hover:opacity-80 transition flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// ==========================================================
// PÁGINA: BUSCAR PAPEL (US047)
// ==========================================================
interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
}

const PER_PAGE = 10;

export function PapeisPage({
  onLogout = () => {},
  onNavigate = (screen: any) => console.log("navigate:", screen),
}: PageProps = {}) {
  const [termo, setTermo] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [resultados, setResultados] = useState<Papel[]>([]);
  const [page, setPage] = useState(1);

  const temFiltroAtivo = !!termo || !!tipo || !!situacao;

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);

    const t = termo.trim().toLowerCase();
    const filtrados = PAPEIS_MOCK.filter((p) => {
      const casaTermo = !t || p.nome.toLowerCase().includes(t);
      const casaTipo = !tipo || p.tipo === tipo;
      const casaSituacao = !situacao || p.situacao === situacao;
      return casaTermo && casaTipo && casaSituacao;
    });

    setResultados(filtrados);
    setPage(1);
    setHasSearched(true);
  };

  const limparTudo = () => {
    setTermo("");
    setTipo("");
    setSituacao("");
    setHasSearched(false);
    setErroFiltro(false);
    setResultados([]);
  };

  // Paginação
  const total = resultados.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * PER_PAGE + 1;
  const fim = Math.min(pageAtual * PER_PAGE, total);
  const paginaItens = useMemo(
    () => resultados.slice((pageAtual - 1) * PER_PAGE, pageAtual * PER_PAGE),
    [resultados, pageAtual]
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="papeis" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        {/* Botão Voltar para Tela Inicial */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition w-fit focus-visible:outline-none"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Papéis</h1>
            <p className="text-sm text-gray-500 mt-1">
              Busque por papéis cadastrados utilizando o campo de busca e os filtros.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("adicionar-papeis")}
            className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/40 self-start md:self-auto"
          >
            Adicionar Novo
          </button>
        </div>

        {/* Card de busca + resultados */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          
          {/* Linha de busca simplificada e unificada */}
          <div className="flex gap-2 items-center w-full">
            <div className="flex-1">
              <FloatInput
                label="Nome do Papel"
                value={termo}
                onChange={setTermo}
                maxLength={255}
                icon={<Search size={18} color={GREEN} />}
                placeholder="Ex.: Responsável Técnico"
              />
            </div>

            {/* Filtro apenas com ícone */}
            <button
              type="button"
              onClick={() => setMostrarFiltros((v) => !v)}
              aria-expanded={mostrarFiltros}
              aria-label="Filtros adicionais"
              className={`h-12 w-12 rounded-md border flex items-center justify-center transition flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30 ${
                mostrarFiltros
                  ? "bg-green-50/60 border-[#1A7A3C] text-[#1A7A3C]"
                  : "bg-white border-gray-300 text-gray-600 hover:border-[#1A7A3C] hover:text-[#1A7A3C]"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>

            {/* Pesquisar integrado */}
            <button
              type="button"
              onClick={handlePesquisar}
              className="h-12 px-6 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/40 flex-shrink-0"
            >
              Pesquisar
            </button>
          </div>

          {/* Painel de filtros adicionais */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <FloatSelect label="Tipo de Papel" value={tipo} onChange={setTipo} options={TIPOS_PAPEL} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
            </div>
          )}

          {/* Erro de uso incorreto de filtros */}
          {erroFiltro && (
            <p role="alert" className="text-sm text-red-500">
              Selecione pelo menos um filtro e/ou utilize o campo de busca para visualizar os resultados.
            </p>
          )}

          {/* Indicações de filtros aplicados */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap items-center gap-2">
              {termo && <Chip label={`Nome: ${termo}`} onRemove={() => setTermo("")} />}
              {tipo && <Chip label={`Tipo: ${tipo}`} onRemove={() => setTipo("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
              <button
                type="button"
                onClick={limparTudo}
                className="text-xs font-semibold text-gray-500 hover:text-[#1A7A3C] underline underline-offset-2 transition ml-1"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* Listagem de Resultados */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Selecione pelo menos um filtro e/ou utilize o campo de busca para visualizar os resultados.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
              <button
                type="button"
                onClick={limparTudo}
                className="mt-3 text-sm font-semibold text-[#1A7A3C] hover:underline"
              >
                Limpar filtros e tentar novamente
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Nome do Papel</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Tipo de Papel</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Situação</th>
                      <th scope="col" className="px-4 py-3 w-[120px]"><span className="sr-only">Ações</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginaItens.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-700 text-sm font-medium">{p.nome}</td>
                        <td className="px-4 py-3"><TipoBadge tipo={p.tipo} /></td>
                        <td className="px-4 py-3"><SituacaoBadge situacao={p.situacao} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => onNavigate("visualizar-papel", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
                              style={{ color: GREEN }}
                              title="Visualizar"
                              aria-label={`Visualizar ${p.nome}`}
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("editar-papel", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
                              style={{ color: GREEN }}
                              title="Editar"
                              aria-label={`Editar ${p.nome}`}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("copiar-papel", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
                              style={{ color: GREEN }}
                              title="Copiar papel"
                              aria-label={`Copiar papel ${p.nome}`}
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {PER_PAGE}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageAtual === 1}
                      aria-label="Página anterior"
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={pageAtual === totalPages}
                      aria-label="Próxima página"
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PapeisPage;