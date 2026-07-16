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
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, SearchModal, FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS EM CONFORMIDADE COM A US051 (Substituir por API)
// ==========================================================
const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física" },
  { id: 3, nome: "Agro Cooperativa IMA", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica" },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const ZONAS = [
  { value: "Rural", label: "Rural" },
  { value: "Urbana", label: "Urbana" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

interface ProprietarioEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "Pessoa física" | "Pessoa jurídica"; // Corrigido para bater com os valores do Mock e da US051
}

interface EstabelecimentoAgropecuario {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: string; // Exibe "Nome - CPF" conforme especificado
  zona: "Rural" | "Urbana";
  municipioUf: string; // "Lavras - MG"
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const ESTABELECIMENTOS_MOCK: EstabelecimentoAgropecuario[] = [
  { 
    id: 1, 
    codigo: "51080590041", 
    nome: "Fazenda Rio Verde", 
    proprietarios: "José Aarão Neto - 555.009.956-40", 
    zona: "Rural", 
    municipioUf: "Lavras - MG", 
    situacao: "Ativo" 
  },
  { 
    id: 2, 
    codigo: "31001040082", 
    nome: "Haras Vale Verde", 
    proprietarios: "José Aarão Neto - 555.009.956-40", 
    zona: "Rural", 
    municipioUf: "Belo Horizonte - MG", 
    situacao: "Ativo" 
  },
  { 
    id: 3, 
    codigo: "31001040090", 
    nome: "Granja Alvorada", 
    proprietarios: "Agro Cooperativa IMA - 12.345.678/0001-90", 
    zona: "Urbana", 
    municipioUf: "Varginha - MG", 
    situacao: "Suspenso" 
  },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: EstabelecimentoAgropecuario["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
    Suspenso: { bg: "#FFF9E6", border: "#FFEAA3", text: "#B78103", Icon: AlertTriangle },
  } as const;
  const { bg, border, text, Icon } = map[situacao] || map["Inativo"];
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

type SortKey = "nome" | "zona" | "municipioUf" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EstabelecimentoAgropecuarioPage({ onLogout, onNavigate }: PageProps) {
  // ==========================================================
  // ESTADOS DA PÁGINA
  // ==========================================================
  const [busca, setBusca] = useState(""); 
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física"); 
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null); 
  const [modalProprietario, setModalProprietario] = useState(false); 

  const [zona, setZona] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortAsc, setSortAsc] = useState(true);
    
  // Filtra os proprietários passados para o modal com base no tipo selecionado
  const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(
    (p) => p.tipo === tipoPessoa
  );

    const colunasModal = [
    { 
      label: tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social", 
      key: "nome" 
    },
    { 
      label: tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ", 
      key: "documento" 
    }
  ];
  const handlePesquisar = () => {
    if (busca.trim() === "" && !proprietario && !zona && !municipio && !situacao) {
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

  // --- Filtros da listagem ---
  const filtrados = ESTABELECIMENTOS_MOCK.filter((d) => {
    const termo = busca.trim();
    const matchBusca = termo === "" || (d.nome ?? "").includes(termo) || (d.codigo ?? "").includes(termo);
    
    // CORRIGIDO: Validação correta usando as propriedades do objeto 'proprietario' selecionado
    const matchProprietario = !proprietario || d.proprietarios.includes(proprietario.nome);
    const matchZona = zona === "" || d.zona === zona;
    const matchMunicipio = municipio === "" || d.municipioUf.startsWith(municipio);
    const matchSituacao = situacao === "" || d.situacao === situacao;

    return matchBusca && matchProprietario && matchZona && matchMunicipio && matchSituacao;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[sortKey] ?? "");
    const vb = String(b[sortKey] ?? "");
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = busca.trim() !== "" || proprietario !== null || zona !== "" || municipio !== "" || situacao !== "";

  const colunas: { label: string; key: SortKey | null; sortable: boolean }[] = [
    { label: "Nome", key: "nome", sortable: true },
    { label: "Proprietários", key: null, sortable: false },
    { label: "Zona", key: "zona", sortable: true },
    { label: "Município - UF", key: "municipioUf", sortable: true },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agropecuario" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Estabelecimento Agropecuário</h1>
            <button onClick={() => onNavigate("adicionar-estabelecimento-agropecuario")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior */}
          <div className="flex gap-3 items-stretch w-full">
            <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${erroBusca ? "border-red-400 focus-within:ring-1 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] font-medium" : "top-1/2 -translate-y-1/2 text-sm"} ${erroBusca ? "text-red-500" : "text-gray-400"}`}>
                Buscar por código ou nome do estabelecimento agropecuário
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroBusca) setErroBusca(false); }}
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
            <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full items-end">
              <FloatInput
                label="Proprietário"
                value={proprietario ? `${proprietario.nome} ` : ""}
                required
                icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} 
                onClick={() => setModalProprietario(true)}
                readOnly
              />  
                          
              <FloatSelect label="Zona" value={zona} onChange={setZona} options={ZONAS} />
              <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
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

          {erroBusca && (
            <p className="text-sm text-red-500">Selecione pelo menos um filtro e/ou utilize o campo de busca para visualizar os resultados.</p>
          )}

          {/* Chips */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {zona && <Chip label={`Zona: ${zona}`} onRemove={() => setZona("")} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por um estabelecimento utilizando o campos de busca e os filtros acima.</p>
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">Código</th>
                      {colunas.map((c, idx) => (
                        <th
                          key={idx}
                          onClick={() => c.sortable && c.key && toggleSort(c.key)}
                          className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase select-none ${c.sortable ? "cursor-pointer hover:text-gray-900" : ""}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            {c.sortable && sortKey === c.key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                          </span>
                        </th>
                      ))}
                      <th
                        onClick={() => toggleSort("situacao")}
                        className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900 uppercase"
                      >
                        <span className="inline-flex items-center gap-1">
                          Situação
                          {sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </span>
                      </th>
                      <th className="px-4 py-3 w-[110px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.codigo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal max-w-xs truncate" title={d.proprietarios}>
                          {d.proprietarios}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.zona}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.municipioUf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.situacao} 
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-estabelecimento-agropecuario", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-estabelecimento-agropecuario", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal do Proprietário */}
      <SearchModal<ProprietarioEntidade>
        open={modalProprietario}
        onClose={() => {
          setModalProprietario(false);
          setTipoPessoa("Pessoa física");
        }}
        title="Buscar Proprietário"
        subtitle="Busque por um proprietário cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl || Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />} 
        data={proprietariosFiltradosModal}
        columns={colunasModal} // INSERIDO AQUI CONFORME SOLICITADO
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Proprietário"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProprietario(p);
          setModalProprietario(false);
        }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "Pessoa física", label: "Pessoa Física" },
              { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />
    </div>
  );
}