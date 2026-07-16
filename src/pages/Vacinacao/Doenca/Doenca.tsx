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
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// DADOS DA LISTAGEM (substituir por API)
// ==========================================================
interface Doenca {
  id: number;
  nome: string;
  possuiVacina: "Sim" | "Não";
  possuiVacinacaoOficial: "Sim" | "Não";
  situacao: "Ativo" | "Inativo";
}

const DOENCAS_MOCK: Doenca[] = [
  { id: 1, nome: "Brucelose", possuiVacina: "Sim", possuiVacinacaoOficial: "Sim", situacao: "Ativo" },
  { id: 2, nome: "Febre Aftosa", possuiVacina: "Sim", possuiVacinacaoOficial: "Sim", situacao: "Ativo" },
  { id: 3, nome: "Anemia Infecciosa Equina", possuiVacina: "Não", possuiVacinacaoOficial: "Não", situacao: "Ativo" },
  { id: 4, nome: "Raiva", possuiVacina: "Sim", possuiVacinacaoOficial: "Não", situacao: "Ativo" },
  { id: 5, nome: "Clostridiose", possuiVacina: "Sim", possuiVacinacaoOficial: "Não", situacao: "Inativo" },
];

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Doenca["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />
      {situacao}
    </span>
  );
}

// Célula "Sim/Não" com leve reforço de cor (não só texto)
function SimNaoCell({ value }: { value: "Sim" | "Não" }) {
  const isSim = value === "Sim";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: isSim ? "#1A7A3C" : "#9CA3AF" }}>
      {isSim ? <Check size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
      {value}
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

export function DoencaPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [possuiVacina, setPossuiVacina] = useState("");
  const [possuiVacinacaoOficial, setPossuiVacinacaoOficial] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusNome, setFocusNome] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const temFiltroAtivo =
    nome.trim() !== "" || possuiVacina !== "" || possuiVacinacaoOficial !== "" || situacao !== "";

  const handlePesquisar = () => {
    // AC2: exige o campo de busca OU pelo menos um filtro
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = DOENCAS_MOCK.filter((d) => {
    const termo = nome.trim().toLowerCase();
    const matchNome = termo === "" || d.nome.toLowerCase().includes(termo);
    const matchVacina = possuiVacina === "" || d.possuiVacina === possuiVacina;
    const matchOficial = possuiVacinacaoOficial === "" || d.possuiVacinacaoOficial === possuiVacinacaoOficial;
    const matchSituacao = situacao === "" || d.situacao === situacao;
    return matchNome && matchVacina && matchOficial && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="doenca" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Doença</h1>
            <button onClick={() => onNavigate("adicionar-doenca")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO (Filtros + Mensagens + Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro (Nome e Botão de Expansão) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusNome || nome ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome da Doença
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={nome}
                  onFocus={() => setFocusNome(true)}
                  onBlur={() => setFocusNome(false)}
                  onChange={(e) => { setNome(e.target.value); if (erroFiltro) setErroFiltro(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Internos Avançados */}
          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full  items-end">
              <FloatSelect
                label="Possui Vacina?"
                className="z-40"
                value={possuiVacina}
                onChange={setPossuiVacina}
                options={SIM_NAO}
                hasTooltip 
                tooltipText="Possui vacina para pelo menos uma das espécies suscetíveis à doença?"
              />
              <FloatSelect label="Possui Vacinação Oficial?" value={possuiVacinacaoOficial} onChange={setPossuiVacinacaoOficial}  options={SIM_NAO} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              <button
                onClick={handlePesquisar}
                className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {/* Feedback de Erro Global (AC2) */}
          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {nome.trim() && <Chip label={`Nome: ${nome}`} onRemove={() => setNome("")} />}
              {possuiVacina && <Chip label={`Possui Vacina: ${possuiVacina}`} onRemove={() => setPossuiVacina("")} />}
              {possuiVacinacaoOficial && <Chip label={`Vacinação Oficial: ${possuiVacinacaoOficial}`} onRemove={() => setPossuiVacinacaoOficial("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Linha divisória sutil entre filtros e resultados */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por doença utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto  ">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal">Nome da Doença</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[130px]">Possui Vacina?</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[150px]">Possui Vacinação Oficial?</th>
                      <th className="text-left px-4 py-3 font-semibold  uppercase text-gray-600 whitespace-normal max-w-[110px]">Situação</th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.possuiVacina}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.possuiVacinacaoOficial} </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-doenca", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${d.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-doenca", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${d.nome}`}><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} aria-label="Página anterior" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} aria-label="Próxima página" className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
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