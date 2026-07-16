import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, Eye as ViewIcon, Pencil, X, Check, Minus,
  Building2, Stethoscope, UserRoundCheck
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, SearchModal, FloatInput, CustomButton } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

import * as Icons from "../../../imports/icons";


// ==========================================================
// MOCKS (substituir por API)
// ==========================================================
const ESTADOS_BR = [
  "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo",
  "Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba",
  "Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul",
  "Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins",
];
const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte","Lavras","Oliveira","Uberaba","Uberlândia","Varginha"],
  "São Paulo": ["Barretos","Campinas","Ribeirão Preto","São Paulo"],
  "Goiás": ["Anápolis","Goiânia","Rio Verde"],
};

const PROPRIETARIOS_MOCK = [
  { id: 1, nome: "Rastro de Boi Certificação", documento: "72.375.545/0001-93" },
  { id: 2, nome: "Rastreabilidade Sul Ltda.", documento: "45.221.118/0001-40" },
];
const PROFISSIONAIS_MOCK = [
  { id: 1, nome: "José Teixeira Sabino", documento: "444.009.956-40", habilitadoGta: true },
  { id: 2, nome: "Marina Couto Dias", documento: "333.221.115-09", habilitadoGta: true },
  { id: 3, nome: "Carlos Henrique Reis", documento: "222.114.558-70", habilitadoGta: false },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

// Status oficiais do SISBOV (lista da US055)
const STATUS_CERTIFICADORA = [
  "Regular",
  "Suspensa em decorrência de não atualização de cadastro determinados no Ofício Circular da Coordenação de Sistemas de Rastreabilidade 019 de 27 de setembro de 2007",
  "Descredenciada em decorrência de não fornecimento das informações solicitadas pelo Ofício Circular da Coordenação de Sistemas de Rastreabilidade 003 de 16 de março de 2007",
  "Escritório suspenso faltando informação sobre anotação de responsabilidade técnica do médico veterinário",
  "Bloqueada",
  "Acesso regular via liminar",
  "Suspensão da inserção de novas propriedades até conclusão de procedimento administrativo",
  "Escritório fechado por iniciativa da certificadora em 01/11/2007",
  "Descredenciada a pedido",
];



const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const sanitizeOptions = (arr: unknown): string[] =>
  Array.isArray(arr) ? arr.filter((o): o is string => typeof o === "string" && o.trim() !== "") : [];

// abrevia status longos na exibição (mantém o texto completo no title/tooltip)
const abreviaStatus = (s: string, max = 42) => (s.length > max ? s.slice(0, max).trimEnd() + "…" : s);

// ==========================================================
// DADOS DA LISTAGEM
// ==========================================================
interface Certificadora {
  id: number;
  nome: string;
  proprietario: string;   // "CNPJ - Nome fantasia"
  responsavel: string;    // "CPF - Nome"
  status: string;
  municipio: string;
  uf: string;
  estado: string;
  situacao: "Ativo" | "Inativo";
}

const CERTIFICADORAS_MOCK: Certificadora[] = [
  { id: 1, nome: "Rastro de Boi", proprietario: "72.375.545/0001-93 - Rastro de Boi Certificação", responsavel: "555.009.956-40 - Gustavo de Souza Sobrinho", status: "Regular", municipio: "Lavras", uf: "MG", estado: "Minas Gerais", situacao: "Ativo" },
  { id: 2, nome: "Certificadora Condão", proprietario: "45.221.118/0001-40 - Rastreabilidade Sul Ltda.", responsavel: "333.221.115-09 - Marina Couto Dias", status: "Bloqueada", municipio: "Uberaba", uf: "MG", estado: "Minas Gerais", situacao: "Inativo" },
  { id: 3, nome: "Boi Certo Rastreamento", proprietario: "72.375.545/0001-93 - Rastro de Boi Certificação", responsavel: "555.009.956-40 - Gustavo de Souza Sobrinho", status: "Acesso regular via liminar", municipio: "Barretos", uf: "SP", estado: "São Paulo", situacao: "Ativo" },
];

const perPageDefault = 10;

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: Certificadora["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
  } as const;
  const { bg, border, text, Icon } = map[situacao];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}>
      <Icon size={13} strokeWidth={3} />{situacao}
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

type SortKey = "nome" | "status" | "municipio" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function CertificadoraSISBOVPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null); 
  const [modalProprietario, setModalProprietario] = useState(false); 
    const [tipoPessoa, setTipoPessoa] = useState(""); 

  // 💡 Estado interno para gerenciar a aba ativa do Modal de Proprietários
  const [tipoProprietarioFiltro, setTipoProprietarioFiltro] = useState<"Todos" | "Física" | "Jurídica">("Todos");

  
  // 💡 Filtra a lista de proprietários no modal conforme a aba selecionada (Física / Jurídica)
  const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(p => {
    if (tipoProprietarioFiltro === "Todos") return true;
    return p.tipo === tipoProprietarioFiltro;
  });
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

  const [responsavelTecnico, setResponsavelTecnico] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [estado, setEstado] = useState(""); // obrigatório, padrão da US
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  const [modal, setModal] = useState<null | "prop" | "resp">(null);

  const [showFilters, setShowFilters] = useState(false); // filtros abertos: Estado é obrigatório
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroSemCriterio, setErroSemCriterio] = useState(false);
  const [erroEstado, setErroEstado] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
    const [erroFiltro, setErroFiltro] = useState(false);


  const estadosOptions = sanitizeOptions(ESTADOS_BR);
  const municipiosDisponiveis = sanitizeOptions(estado ? MUNICIPIOS_POR_ESTADO[estado] : []);

  const temCriterio =
    busca.trim() !== "" || !!proprietario || !!responsavelTecnico || status !== "" ||
    municipio !== "" || situacao !== "";

  const temFiltroAtivo = temCriterio || estado !== "";

  const handlePesquisar = () => {
    // Estado é obrigatório (AC1)
    if (estado === "") { setErroEstado(true); setHasSearched(false); return; }
    setErroEstado(false);
    // CA010: além do estado, exige busca OU outro filtro
    if (!temCriterio) { setErroSemCriterio(true); setHasSearched(false); return; }
    setErroSemCriterio(false);
    setHasSearched(true);
    setPage(1);
  };

  const onChangeEstado = (v: string) => {
    setEstado(v); setMunicipio("");
    if (v !== "") setErroEstado(false);
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((s) => !s);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtrados = CERTIFICADORAS_MOCK.filter((c) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || (c.nome ?? "").toLowerCase().includes(termo);
    const matchProp = !proprietario || c.proprietario.includes(proprietario.documento);
    const matchResp = !responsavelTecnico;
    const matchStatus = status === "" || c.status === status;
    const matchEstado = estado === "" || c.estado === estado;
    const matchMunicipio = municipio === "" || c.municipio === municipio;
    const matchSituacao = situacao === "" || c.situacao === situacao;
    return matchBusca && matchProp && matchResp && matchStatus && matchEstado && matchMunicipio && matchSituacao;
  });

  const ordenados = sortKey
    ? [...filtrados].sort((a, b) => {
        const va = String(a[sortKey] ?? ""); const vb = String(b[sortKey] ?? "");
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      })
    : filtrados;

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="certificadora-sisbov" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Certificadora SISBOV</h1>
            <button onClick={() => onNavigate("adicionar-certificadora-sisbov")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>Adicionar Nova</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Busca (Nome) + toggle filtros */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome da Certificadora SISBOV
              </label>
              <div className="flex items-center w-full">
                <input type="text" maxLength={255} value={busca}
                  onFocus={() => setFocusBusca(true)} onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroSemCriterio) setErroSemCriterio(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6" />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <FloatInput
                label="Proprietário"
                value={proprietario ? `${proprietario.nome} ` : ""}
               
                icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} 
                onClick={() => setModalProprietario(true)}
                readOnly
              />
                 <EntitySearchInput
  label="Responsável Técnico"
  placeholder="Buscar por nome ou CPF"
  value={responsavelTecnico ? responsavelTecnico.nome : ""}
  data={PROFISSIONAIS_MOCK} // Garante array vazio como fallback
  searchKeys={["nome", "documento"]}
  columns={[
    { label: "Nome", key: "nome" },
    { label: "CPF", key: "documento" },
  ]}
  icon={<UserRoundCheck size={18} color={GREEN} />}
    
  title="Buscar Responsável Técnico"
  subtitle="Busque por um profissional responsável técnico cadastrado:"
  onChange={(rt: any) => {
    setResponsavelTecnico(rt);
    if (erroFiltro) setErroFiltro(false);
  }}
/>
                <FloatSelect
                  label="Status da Certificadora"
                  value={status}
                  onChange={setStatus}
                  options={STATUS_CERTIFICADORA.map((s) => ({ value: s, label: abreviaStatus(s, 60) }))}
                />

                                <div className="flex w-full">
  <button 
    onClick={handlePesquisar} 
    className="h-12 flex-1 rounded-md text-white text-sm font-semibold transition hover:opacity-90" 
    style={{ backgroundColor: GREEN }}
  >
    Pesquisar
  </button>
</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                {/* Estado — OBRIGATÓRIO */}
                <div>
                  <FloatCombobox
                    label="Estado"
                    required
                    value={estado}
                    onChange={onChangeEstado}
                    options={estadosOptions}
                  />
                </div>

                {estado && (
                  <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                ) }

                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>

           
            </div>
          )}

          {/* CA010 */}
          {erroSemCriterio && (
            <p className="text-sm text-red-500">Selecione ao menos um filtro e/ou utilize o campo de busca para visualizar os resultados.</p>
          )}

          {/* Chips (CA011) */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Nome: ${busca}`} onRemove={() => setBusca("")} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {responsavelTecnico && <Chip label={`Resp. Técnico: ${responsavelTecnico.nome}`} onRemove={() => setResponsavelTecnico(null)} />}
              {status && <Chip label={`Status: ${abreviaStatus(status, 30)}`} onRemove={() => setStatus("")} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => onChangeEstado("")} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Busque por certificadora utilizando o campo de busca e os filtros acima.</p></div>
          ) : total === 0 ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p></div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b ">
                      <th onClick={() => toggleSort("nome")} className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Nome da Certificadora SISBOV{sortKey === "nome" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[220px]">Proprietário</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[220px]">Responsável Técnico</th>
                      <th onClick={() => toggleSort("status")} className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-normal max-w-[200px] cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Status da Certificadora{sortKey === "status" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th onClick={() => toggleSort("municipio")} className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-nowrap cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Município - UF{sortKey === "municipio" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th onClick={() => toggleSort("situacao")} className="text-left px-4 py-3 uppercase font-semibold text-gray-600 whitespace-normal cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Situação{sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((c) => (
                      <tr key={c.id} className=" last:border-0 hover:bg-gray-50/60 transition align-top">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{c.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{c.proprietario}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{c.responsavel}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal" title={c.status}>{abreviaStatus(c.status)}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{c.municipio} - {c.uf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{c.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-certificadora-sisbov", c)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar" aria-label={`Visualizar ${c.nome}`}><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-certificadora-sisbov", c)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar" aria-label={`Editar ${c.nome}`}><Pencil size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

      {/* MODAIS */}
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
      <SearchModal open={modal === "resp"} onClose={() => setModal(null)} title="Buscar Responsável Técnico" subtitle="Busque por um profissional responsável técnico (área animal ou vegetal):" icon={<Stethoscope size={28} color={GREEN} />} data={PROFISSIONAIS_MOCK} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }, { label: "Área", key: "area" }]} searchKeys={["nome", "documento"]} searchPlaceholder="Buscar por nome ou CPF..." confirmLabel="Selecionar" onConfirm={(p: any) => { setResponsavel(p); setModal(null); }} />
    </div>
  );
}