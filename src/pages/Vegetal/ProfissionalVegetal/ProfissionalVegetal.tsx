import { useState, useMemo } from "react";
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
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (US065 - AC1)
// ==========================================================
const FORMACOES = [
  { value: "Engenheiro Agrônomo", label: "Engenheiro Agrônomo" },
  { value: "Engenheiro Florestal", label: "Engenheiro Florestal" },
];

const HABILITACOES = [
  { value: "Habilitado para emissão de PTV", label: "Habilitado para emissão de PTV" },
  { value: "Habilitado para emissão de CFO/CFOC", label: "Habilitado para emissão de CFO/CFOC" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

interface Profissional {
  id: number;
  nome: string;
  documento: string;
  formacao: string;
  crea: string;
  habilitacao: string;
  numeroHabilitacao: string;
  situacao: "Ativo" | "Inativo";
}

const PROFISSIONAIS_MOCK: Profissional[] = [
  {
    id: 1,
    nome: "Josephina Arantes",
    documento: "444.009.956-40",
    formacao: "Engenheiro Agrônomo",
    crea: "506779200",
    habilitacao: "Habilitado para emissão de PTV",
    numeroHabilitacao: "31250001",
    situacao: "Ativo",
  },
  {
    id: 2,
    nome: "José Aarão Neto",
    documento: "555.009.956-40",
    formacao: "Engenheiro Florestal",
    crea: "9913",
    habilitacao: "Habilitado para emissão de CFO/CFOC",
    numeroHabilitacao: "31250034",
    situacao: "Ativo",
  },
  {
    id: 3,
    nome: "Marina Couto Dias",
    documento: "333.221.115-09",
    formacao: "Engenheiro Agrônomo",
    crea: "778112004",
    habilitacao: "Habilitado para emissão de CFO/CFOC",
    numeroHabilitacao: "31250087",
    situacao: "Inativo",
  },
];

// ==========================================================
// COMPONENTES AUXILIARES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Profissional["situacao"] }) {
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

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 h-8 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0 focus:outline-none rounded p-0.5 cursor-pointer"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const PER_PAGE = 10;

export function ProfissionalVegetalPage({ onLogout, onNavigate }: PageProps) {
  const [termo, setTermo] = useState("");
  const [focusBusca, setFocusBusca] = useState(false);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [formacao, setFormacao] = useState("");
  const [crea, setCrea] = useState("");
  const [habilitacao, setHabilitacao] = useState("");
  const [numeroHabilitacao, setNumeroHabilitacao] = useState("");
  const [situacao, setSituacao] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [resultados, setResultados] = useState<Profissional[]>([]);
  const [page, setPage] = useState(1);

  const temFiltroAtivo =
    !!termo.trim() || !!formacao || !!crea.trim() || !!habilitacao || !!numeroHabilitacao.trim() || !!situacao;

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setMostrarFiltros(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);

    const t = termo.trim().toLowerCase();
    const filtrados = PROFISSIONAIS_MOCK.filter((p) => {
      const casaTermo =
        !t ||
        p.nome.toLowerCase().includes(t) ||
        p.documento.replace(/\D/g, "").includes(t.replace(/\D/g, ""));
      const casaFormacao = !formacao || p.formacao === formacao;
      const casaCrea = !crea || p.crea.toLowerCase().includes(crea.trim().toLowerCase());
      const casaHabilitacao = !habilitacao || p.habilitacao === habilitacao;
      const casaNumero = !numeroHabilitacao || p.numeroHabilitacao.includes(numeroHabilitacao.trim());
      const casaSituacao = !situacao || p.situacao === situacao;
      return casaTermo && casaFormacao && casaCrea && casaHabilitacao && casaNumero && casaSituacao;
    });

    setResultados(filtrados);
    setPage(1);
    setHasSearched(true);
  };

  const limparTudo = () => {
    setTermo("");
    setFormacao("");
    setCrea("");
    setHabilitacao("");
    setNumeroHabilitacao("");
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
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-area-vegetal" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        {/* Cabeçalho superior e botão Voltar */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm font-semibold mb-3 transition hover:opacity-70 cursor-pointer"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profissionais da Área Vegetal</h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-profissional-vegetal")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98] self-start md:self-auto cursor-pointer"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          
          {/* Barra Superior Exatamente igual ao modelo fornecido */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || termo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome ou CPF
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={termo}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setTermo(e.target.value); setErroFiltro(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setMostrarFiltros(!mostrarFiltros)} 
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm cursor-pointer" 
              style={{ backgroundColor: mostrarFiltros ? "transparent" : GREEN, borderColor: GREEN, color: mostrarFiltros ? GREEN : "#ffffff" }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Painel de Filtros Avançados */}
          {mostrarFiltros && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end w-full">
                <FloatSelect
                  label="Formação Profissional"
                  value={formacao}
                  onChange={(v) => { setFormacao(v); setErroFiltro(false); }}
                  options={FORMACOES}
                />
                <FloatInput 
                  label="CREA" 
                  value={crea} 
                  onChange={(v) => { setCrea(v); setErroFiltro(false); }} 
                  maxLength={30} 
                />
                <FloatSelect
                  label="Habilitações Profissionais"
                  value={habilitacao}
                  onChange={(v) => { setHabilitacao(v); setErroFiltro(false); }}
                  options={HABILITACOES}
                />
                <FloatInput
                  label="Número de Habilitação"
                  value={numeroHabilitacao}
                  onChange={(v) => { setNumeroHabilitacao(v.replace(/\D/g, "").slice(0, 8)); setErroFiltro(false); }}
                  maxLength={8}
                 />
                <FloatSelect 
                  label="Situação" 
                  value={situacao} 
                  onChange={(v) => { setSituacao(v); setErroFiltro(false); }} 
                  options={SITUACOES} 
                />

                <button
                  type="button"
                  onClick={handlePesquisar}
                  className="h-12 w-full px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap shadow-sm cursor-pointer"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>
            </div>
          )}

          {/* Validação de Filtro Vazio */}
          {erroFiltro && (
            <p role="alert" className="text-sm text-red-500 mt-1">
              Preencha o campo de busca ou selecione pelo menos um filtro para pesquisar.
            </p>
          )}

          {/* Chips de Filtros Aplicados */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
              {termo.trim() && <Chip label={`Busca: ${termo}`} onRemove={() => setTermo("")} />}
              {formacao && <Chip label={`Formação: ${formacao}`} onRemove={() => setFormacao("")} />}
              {crea.trim() && <Chip label={`CREA: ${crea}`} onRemove={() => setCrea("")} />}
              {habilitacao && <Chip label={`Habilitação: ${habilitacao}`} onRemove={() => setHabilitacao("")} />}
              {numeroHabilitacao.trim() && (
                <Chip label={`Nº Habilitação: ${numeroHabilitacao}`} onRemove={() => setNumeroHabilitacao("")} />
              )}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}

             
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS DA BUSCA */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por profissionais utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Nome</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">CPF</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Formação Profissional</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">CREA</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Habilitação Profissional</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Número da Habilitação</th>
                      <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">Situação</th>
                      <th scope="col" className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {paginaItens.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.documento}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.formacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.crea}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.habilitacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.numeroHabilitacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{p.situacao}  </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => onNavigate("visualizar-profissional-area-vegetal", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("editar-profissional-area-vegetal", p)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
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
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={pageAtual === totalPages}
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