import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox } from "../../../components/ui/FormKit";
import {
  ProfissionalAnimalInput,
  UnidadeAdministrativaInput,
  DynamicListWrapper,
  PessoaFisicaInput,
  EntitySearchInput
} from "../../../components/ui/EntitySearch";
const GREEN = "#1A7A3C";
import * as Icons from "../../../imports/icons";

// ==========================================================
// MOCKS (US064)
// ==========================================================
const ESFERA_OPCOES = [
  { value: "Municipal", label: "Municipal" },
  { value: "Estadual", label: "Estadual" },
  { value: "Federal", label: "Federal" }
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

interface Profissional {
  id: number;
  nome: string;
  cpf: string;
  esfera: "Municipal" | "Estadual" | "Federal";
  unidadeAdministrativa: string;
  situacao: "Ativo" | "Inativo";
}

const PROFISSIONAIS_MOCK: Profissional[] = [
  { id: 1, nome: "Josephina Arantes", cpf: "444.009.956-40", esfera: "Estadual", unidadeAdministrativa: "Coordenadoria Regional de Belo Horizonte", situacao: "Ativo" },
  { id: 2, nome: "Carlos Eduardo Silva", cpf: "111.222.333-44", esfera: "Federal", unidadeAdministrativa: "Coordenadoria Regional de Lavras", situacao: "Ativo" },
  { id: 3, nome: "Mariana Souza", cpf: "555.666.777-88", esfera: "Municipal", unidadeAdministrativa: "Escritório Local de Juiz de Fora", situacao: "Inativo" },
];
const UNIDADES_ADMINISTRATIVAS_MOCK_OBJETOS = [
  { id: 1, nome: "Coordenadoria Regional de Belo Horizonte" },
  { id: 2, nome: "Coordenadoria Regional de Lavras" },
  { id: 3, nome: "Coordenadoria Regional de Uberlândia" },
  { id: 4, nome: "Escritório Local de Juiz de Fora" }
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES DO SEU PADRÃO
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Profissional["situacao"] }) {
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

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

type SortKey = "nome" | "cpf" | "esfera" | "unidadeAdministrativa" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function ProfissionalOficialPage({ onLogout, onNavigate }: PageProps) {
  // --- Estados do Formulário/Filtros ---
  const [busca, setBusca] = useState(""); // Nome ou CPF
  const [esfera, setEsfera] = useState("");
  
  // 💡 ALTERAÇÃO: O estado agora armazena o objeto completo selecionado no modal (ou null)
  const [unidadeAdministrativa, setUnidadeAdministrativa] = useState<any>(null);
  const [situacao, setSituacao] = useState("");

  // --- Estados de Controle de Layout e Grid ---
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  // --- Estados de Ordenação das Colunas ---
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortAsc, setSortAsc] = useState(true);

  // Ação de Pesquisa baseada na sua lógica de validação
  const handlePesquisar = () => {
    // 💡 ALTERAÇÃO: Valida se há um objeto selecionado e se o nome está preenchido
    if (!unidadeAdministrativa || !unidadeAdministrativa.nome?.trim()) {
      setErroBusca(true);
      setHasSearched(false);
      return;
    }
    setErroBusca(false);
    setHasSearched(true);
    setPage(1);
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  // Filtragem exata seguindo o seu modelo de filtro do exemplo
  const filtrados = PROFISSIONAIS_MOCK.filter((p) => {
    const termo = busca.trim();
    const matchBusca = termo === "" || (p.nome ?? "").includes(termo) || (p.cpf ?? "").includes(termo);
    const matchEsfera = esfera === "" || p.esfera === esfera;
    
    // 💡 ALTERAÇÃO: Filtra usando a propriedade .nome do objeto do estado
const matchUnidade = !unidadeAdministrativa || p.unidadeAdministrativa === unidadeAdministrativa.nome;
    const matchSituacao = situacao === "" || p.situacao === situacao;
    return matchBusca && matchEsfera && matchUnidade && matchSituacao;
  });

  // Ordenação dinâmica
  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[sortKey] ?? "");
    const vb = String(b[sortKey] ?? "");
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  // Paginação idêntica ao seu padrão de exemplo
  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = busca.trim() !== "" || unidadeAdministrativa || esfera || situacao;

  const colunas: { label: string; key: SortKey }[] = [
    { label: "Nome", key: "nome" },
    { label: "CPF", key: "cpf" },
    { label: "Esfera do Serviço Oficial", key: "esfera" },
    { label: "Unidade Administrativa", key: "unidadeAdministrativa" }, // 💡 Corrigido pequeno typo "unidadeAdministrative" para casar com o SortKey
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Profissionais de Serviço Oficial</h1>
            <button onClick={() => onNavigate("adicionar-profissional-oficial")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior: Busca Principal + Ícone Expansor */}
          <div className="flex gap-3 items-stretch w-full">
            <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${erroBusca ? "border-gray-200" : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] font-medium" : "top-1/2 -translate-y-1/2 text-sm"} text-gray-400`}>
                Buscar por nome ou CPF do profissional
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value)}
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

          {/* Filtros Internos Expansíveis */}
          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
              
              {/* 💡 ALTERAÇÃO: Componente customizado acoplado com a nova estrutura */}
             <div className="w-full">
  <EntitySearchInput
    label="Unidade Administrativa"
    required
    placeholder="Buscar unidade administrativa."
    value={unidadeAdministrativa ? unidadeAdministrativa.nome : ""}
    data={UNIDADES_ADMINISTRATIVAS_MOCK_OBJETOS} // Lista de objetos {id, nome}
    searchKeys={["nome"]}
    columns={[
      { label: "Nome da Unidade Administrativa", key: "nome" },
    ]}
    icon={
      Icons.iconeUnidadeAdministrativaUrl ? (
        <img src={Icons.iconeUnidadeAdministrativaUrl} alt="Unidade" className="w-5 h-5 object-contain" />
      ) : undefined
    }
    title="Buscar Unidade Administrativa"
    subtitle="Busque por uma unidade administrativa cadastrada no sistema:"
    onChange={(ent) => {
      setUnidadeAdministrativa(ent);
      setErroBusca(false); // Limpa o erro ao selecionar
    }}
  />
</div>

              <FloatSelect label="Esfera do Serviço Oficial" value={esfera} onChange={setEsfera} options={ESFERA_OPCOES} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              <button
                onClick={handlePesquisar}
                className="h-12 w-full rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap shadow-sm"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {/* Erro customizado com base no seu padrão (Unidade Administrativa é obrigatória) */}
          {erroBusca && (
            <p className="text-sm text-red-500 font-medium">Selecione uma Unidade Administrativa para realizar a busca.</p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {unidadeAdministrativa && <Chip label={`Unidade: ${unidadeAdministrativa.nome}`} onRemove={() => setUnidadeAdministrativa(null)} />}
              {esfera && <Chip label={`Esfera: ${esfera}`} onRemove={() => setEsfera("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS DA LISTAGEM */}
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
                      {colunas.map((c) => (
                        <th
                          key={c.key}
                          onClick={() => toggleSort(c.key)}
                          className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase cursor-pointer select-none hover:text-gray-900"
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            {sortKey === c.key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                          </span>
                        </th>
                      ))}
                      <th
                        onClick={() => toggleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900"
                      >
                        <span className="inline-flex items-center gap-1">
                          SITUAÇÃO
                          {sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </span>
                      </th>
                      <th className="px-4 py-3 w-[110px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 whitespace-normal">{item.nome}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-normal">{item.cpf}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-normal">{item.esfera}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-normal">{item.unidadeAdministrativa}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-normal">
                          <SituacaoBadge situacao={item.situacao} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-profissional", item)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${item.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-profissional", item)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${item.nome}`}><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé com Paginação Reutilizado do Modelo */}
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