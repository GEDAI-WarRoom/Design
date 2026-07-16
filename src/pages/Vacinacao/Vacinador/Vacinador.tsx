import { useState } from "react";
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
  UserRoundCheck,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, SearchModal } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS (substituir por API)
// Profissionais responsáveis: "oficial" define a lista conforme
// "É Aderido ao PASA?" (aderido → oficiais; não → não-oficiais)
// ==========================================================
interface Profissional {
  id: number;
  nome: string;
  documento: string;
  oficial: boolean;
}

const PROFISSIONAIS_MOCK: Profissional[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", oficial: true },
  { id: 2, nome: "Joaquim da Silva", documento: "444.009.956-40", oficial: true },
  { id: 3, nome: "Marina Couto Dias", documento: "333.221.115-09", oficial: false },
  { id: 4, nome: "Carlos Henrique Reis", documento: "222.114.558-70", oficial: false },
];

interface Vacinador {
  id: number;
  nome: string;
  cpf: string;
  aderidoPasa: "Sim" | "Não";
  profissionalNome: string;
  profissionalDoc: string;
  situacao: "Ativo" | "Inativo";
}

const VACINADORES_MOCK: Vacinador[] = [
  { id: 1, nome: "Josephina Arantes", cpf: "444.009.956-40", aderidoPasa: "Sim", profissionalNome: "José Aarão Neto", profissionalDoc: "555.009.956-40", situacao: "Ativo" },
  { id: 2, nome: "Pedro Alves Moraes", cpf: "222.114.558-70", aderidoPasa: "Não", profissionalNome: "Marina Couto Dias", profissionalDoc: "333.221.115-09", situacao: "Ativo" },
  { id: 3, nome: "Carla Menezes Rocha", cpf: "111.998.775-30", aderidoPasa: "Sim", profissionalNome: "Joaquim da Silva", profissionalDoc: "444.009.956-40", situacao: "Inativo" },
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
function SituacaoBadge({ situacao }: { situacao: Vacinador["situacao"] }) {
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

type SortKey = "nome" | "cpf" | "aderidoPasa" | "profissionalNome" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function VacinadorPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState(""); // Nome ou CPF
  const [aderidoPasa, setAderidoPasa] = useState("");
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [situacao, setSituacao] = useState("");

  const [modalProfissional, setModalProfissional] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Lista de profissionais conforme adesão ao PASA (regra do AC1).
  // Sem filtro PASA escolhido → mostra todos.
  const profissionaisDisponiveis = PROFISSIONAIS_MOCK.filter((p) => {
    if (aderidoPasa === "Sim") return p.oficial;
    if (aderidoPasa === "Não") return !p.oficial;
    return true;
  });

  const temFiltroAtivo =
    busca.trim() !== "" || aderidoPasa !== "" || !!profissional || situacao !== "";

  const handlePesquisar = () => {
    // AC2 / CA010: exige campo de busca OU pelo menos um filtro
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  // trocar o PASA limpa o profissional se ele não pertencer mais à lista
  const onChangePasa = (v: string) => {
    setAderidoPasa(v);
    if (profissional) {
      const aindaValido =
        v === "" ||
        (v === "Sim" && profissional.oficial) ||
        (v === "Não" && !profissional.oficial);
      if (!aindaValido) setProfissional(null);
    }
    if (erroFiltro) setErroFiltro(false);
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtrados = VACINADORES_MOCK.filter((v) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || v.nome.toLowerCase().includes(termo) || v.cpf.toLowerCase().includes(termo);
    const matchPasa = aderidoPasa === "" || v.aderidoPasa === aderidoPasa;
    const matchProf = !profissional || v.profissionalDoc === profissional.documento;
    const matchSituacao = situacao === "" || v.situacao === situacao;
    return matchBusca && matchPasa && matchProf && matchSituacao;
  });

  const ordenados = sortKey
    ? [...filtrados].sort((a, b) => {
        const va = String(a[sortKey]);
        const vb = String(b[sortKey]);
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      })
    : filtrados;

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const colunas: { label: string; key: SortKey }[] = [
    { label: "Nome", key: "nome" },
    { label: "CPF", key: "cpf" },
    { label: "Aderido ao PASA?", key: "aderidoPasa" },
    { label: "Profissional Responsável", key: "profissionalNome" },
    { label: "Situação", key: "situacao" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="vacinador-brucelose" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Vacinador Contra Brucelose</h1>
            <button onClick={() => onNavigate("adicionar-vacinador")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior: Busca (Nome ou CPF) + Filtros */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Buscar por nome ou CPF
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroFiltro) setErroFiltro(false); }}
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

          {/* Filtros Internos */}
          {showFilters && (
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
              <FloatSelect label="É Aderido ao PASA?" value={aderidoPasa} onChange={onChangePasa} options={SIM_NAO} />

              <EntitySearchInput
              label="Profissional Responsável"
              placeholder="Buscar por nome ou CPF"
              value={profissional ? profissional.nome : ""}
              data={profissionaisDisponiveis}
              searchKeys={["nome", "documento"]}
              columns={[
                { label: "Nome", key: "nome" },
                { label: "CPF", key: "documento" },
              ]}
              icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}      
              title="Buscar Profissional Responsável"
              subtitle="Busque por um profissional da área animal cadastrado para vacinação contra brucelose:"
              // 💡 Correção aqui: O componente usa onChange para receber o item selecionado do modal interno
              onChange={(p: Profissional | null) => {
                setProfissional(p);
                if (erroFiltro) setErroFiltro(false);
              }}
            />

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

          {/* Erro Global (CA010) */}
          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha ao menos um dos filtros acima para realizar a consulta.
            </p>
          )}

          {/* Chips de Filtros Ativos (CA011) */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {aderidoPasa && <Chip label={`PASA: ${aderidoPasa}`} onRemove={() => onChangePasa("")} />}
              {profissional && <Chip label={`Profissional: ${profissional.nome}`} onRemove={() => setProfissional(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por um vacinador utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto ">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
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
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((v) => (
                      <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{v.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{v.cpf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{v.aderidoPasa}</td>
                        {/* Profissional Responsável: CPF - Nome */}
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{v.profissionalDoc}</div>
                          <div>{v.profissionalNome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{v.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-vacinador-brucelose", v)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${v.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-vacinador-brucelose", v)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${v.nome}`}><Pencil size={17} /></button>
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

      {/* Modal Profissional Responsável */}
      <SearchModal<Profissional>
        open={modalProfissional}
        onClose={() => setModalProfissional(false)}
        title="Buscar Profissional Responsável"
        subtitle="Busque por um profissional da área animal cadastrado para vacinação contra brucelose:"
        icon={<UserRoundCheck size={28} color={GREEN} />}
        data={profissionaisDisponiveis}
        columns={[
          { label: "Nome", key: "nome" },
          { label: "CPF", key: "documento" },
        ]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar por nome ou CPF..."
        confirmLabel="Selecionar"
        onConfirm={(p) => { setProfissional(p); setModalProfissional(false); if (erroFiltro) setErroFiltro(false); }}
      />
    </div>
  );
}