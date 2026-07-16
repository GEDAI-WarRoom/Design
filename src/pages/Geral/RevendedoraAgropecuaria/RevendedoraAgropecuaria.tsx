import { useState } from "react";
import {
  ArrowLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, Eye as ViewIcon, Pencil, X, Check, Minus,
  UserRound, Stethoscope, User, UserRoundCheck
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, SearchModal, MultiSearchModal, FloatInput, EntitySelector, FloatMultiSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput, SelectedChipsContainer } from "../../../components/ui/EntitySearch";

import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

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
  "Minas Gerais": ["Belo Horizonte","Lavras","Oliveira","Uberlândia","Varginha"],
  "São Paulo": ["Campinas","Ribeirão Preto","Santos","São Paulo"],
  "Rio de Janeiro": ["Niterói","Petrópolis","Rio de Janeiro"],
};

// 💡 Adicionado "tipo" para diferenciar no Modal de Busca
const PROPRIETARIOS_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Física" },
  { id: 3, nome: "Agro Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "Jurídica" },
];
const PROFISSIONAIS_MOCK = [
  { id: 1, nome: "José Teixeira Sabino", documento: "444.009.956-40", habilitadoGta: true },
  { id: 2, nome: "Marina Couto Dias", documento: "333.221.115-09", habilitadoGta: true },
  { id: 3, nome: "Carlos Henrique Reis", documento: "222.114.558-70", habilitadoGta: false },
];
const FUNCIONARIOS_MOCK = [
  { id: 1, nome: "José Teixeira Sabino", documento: "444.009.956-40" },
  { id: 2, nome: "Pedro Alves Moraes", documento: "222.114.558-70" },
];



const AREAS_ATUACAO = ["Animal", "Vegetal"];
const ATUACOES = [
  "Revendedora de Pasta Vampiricida",
  "Distribuidora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Vacinas sob Controle Oficial",
  "Distribuidora de Vacinas sob Controle Oficial",
  "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
  "Revendedora de Sementes",
  "Revendedora de Agrotóxicos",
];
const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const sanitizeOptions = (arr: unknown): string[] =>
  Array.isArray(arr) ? arr.filter((o): o is string => typeof o === "string" && o.trim() !== "") : [];

interface Revendedora {
  id: number;
  codigo: string;
  nome: string;
  proprietarios: string[];
  responsaveis: string[];
  funcionarios: string[];
  areaAtuacao: string[];
  atuacoes: string[];
  municipio: string;
  uf: string;
  estado: string;
  situacao: "Ativo" | "Inativo";
}

const REVENDEDORAS_MOCK: Revendedora[] = [
  {
    id: 1, codigo: "31236598486", nome: "Revendedora São José",
    proprietarios: ["555.009.956-40 - José Aarão Neto"],
    responsaveis: ["444.009.956-40 - Divino de Souza Sobrinho"],
    funcionarios: ["444.009.956-40 - José Teixeira Sabino"],
    areaAtuacao: ["Animal"], atuacoes: ["Revendedora de Vacinas sob Controle Oficial"],
    municipio: "Lavras", uf: "MG", estado: "Minas Gerais", situacao: "Ativo",
  },
  {
    id: 2, codigo: "31001040007", nome: "Agro Insumos Sul",
    proprietarios: ["56.338.814/0001-95 - Agro Vale Verde Ltda."],
    responsaveis: ["333.221.115-09 - Marina Couto Dias"],
    funcionarios: ["222.114.558-70 - Pedro Alves Moraes"],
    areaAtuacao: ["Vegetal"], atuacoes: ["Revendedora de Sementes", "Revendedora de Agrotóxicos"],
    municipio: "Varginha", uf: "MG", estado: "Minas Gerais", situacao: "Ativo",
  },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];


const perPageDefault = 10;

function SituacaoBadge({ situacao }: { situacao: Revendedora["situacao"] }) {
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

function MultiCell({ values }: { values: string[] }) {
  if (!values || values.length === 0) return <span className="text-gray-300">—</span>;
  const head = values.slice(0, 2);
  const rest = values.length - head.length;
  return (
    <div className="flex flex-col gap-0.5">
      {head.map((v, i) => <span key={i}>{v}</span>)}
      {rest > 0 && <span className="text-[#1A7A3C] font-medium">+{rest} selecionado{rest > 1 ? "s" : ""}</span>}
    </div>
  );
}

type SortKey = "codigo" | "nome" | "municipio" | "situacao";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function RevendedoraAgropecuarioPage({ onLogout, onNavigate }: PageProps) {

  const [responsavel, setResponsavel] = useState<any | null>(null);
  const [funcionario, setFuncionario] = useState<any | null>(null);
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState<string[]>([]);
  const [atuacoes, setAtuacoes] = useState<string[]>([]);
  const [situacao, setSituacao] = useState("");
  const [busca, setBusca] = useState(""); 
  const [tipoPessoa, setTipoPessoa] = useState(""); 
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null); 
  const [modalProprietario, setModalProprietario] = useState(false); 
  const [responsavelTecnico, setResponsavelTecnico] = useState<any>(null);

// Lista de profissionais que virá da sua API, banco de dados ou mock
const [responsaveisTecnicosDisponiveis, setResponsaveisTecnicosDisponiveis] = useState<any[]>([]);

// Estado de controle para exibir erros de validação (ex: caso tente avançar sem preencher)

  const [modal, setModal] = useState<null | "prop" | "resp" | "func" | "area" | "atuacao">(null);
  
  // 💡 Estado interno para gerenciar a aba ativa do Modal de Proprietários
  const [tipoProprietarioFiltro, setTipoProprietarioFiltro] = useState<"Todos" | "Física" | "Jurídica">("Todos");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const estadosOptions = sanitizeOptions(ESTADOS_BR);
  const municipiosDisponiveis = sanitizeOptions(estado ? MUNICIPIOS_POR_ESTADO[estado] : []);

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

  const temFiltroAtivo =
    busca.trim() !== "" || !!proprietario || !!responsavel || !!funcionario ||
    estado !== "" || municipio !== "" || areaAtuacao.length > 0 || atuacoes.length > 0 ||
    situacao !== "Ativo";

  const handlePesquisar = () => {
    const algum = busca.trim() !== "" || !!proprietario || !!responsavel || !!funcionario ||
      estado !== "" || municipio !== "" || areaAtuacao.length > 0 || atuacoes.length > 0 || situacao !== "";
    if (!algum) { setErroFiltro(true); setHasSearched(false); return; }
    setErroFiltro(false); setHasSearched(true); setPage(1);
  };

  const onChangeEstado = (v: string) => { setEstado(v); setMunicipio(""); if (erroFiltro) setErroFiltro(false); };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((s) => !s);
    else { setSortKey(key); setSortAsc(true); }
  }

  // 💡 Filtra a lista de proprietários no modal conforme a aba selecionada (Física / Jurídica)
  const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(p => {
    if (tipoProprietarioFiltro === "Todos") return true;
    return p.tipo === tipoProprietarioFiltro;
  });

  const filtrados = REVENDEDORAS_MOCK.filter((r) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || (r.nome ?? "").toLowerCase().includes(termo) || (r.codigo ?? "").toLowerCase().includes(termo);
    const matchProp = !proprietario || r.proprietarios.some((p) => p.includes(proprietario.documento));
    const matchResp = !responsavel || r.responsaveis.some((p) => p.includes(responsavel.documento));
    const matchFunc = !funcionario || r.funcionarios.some((p) => p.includes(funcionario.documento));
    const matchEstado = estado === "" || r.estado === estado;
    const matchMunicipio = municipio === "" || r.municipio === municipio;
    const matchArea = areaAtuacao.length === 0 || areaAtuacao.some((a) => r.areaAtuacao.includes(a));
    const matchAtuacao = atuacoes.length === 0 || atuacoes.some((a) => r.atuacoes.includes(a));
    const matchSituacao = situacao === "" || r.situacao === situacao;
    return matchBusca && matchProp && matchResp && matchFunc && matchEstado && matchMunicipio && matchArea && matchAtuacao && matchSituacao;
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
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} />Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Revendedora de Produtos Agropecuários</h1>
            <button onClick={() => onNavigate("adicionar-revendedora-agropecuario")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>Adicionar Nova</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Busca (Código ou Nome) + Filtros */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Código ou Nome da Revendedora
              </label>
              <div className="flex items-center w-full">
                <input type="text" maxLength={255} value={busca}
                  onFocus={() => setFocusBusca(true)} onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroFiltro) setErroFiltro(false); }}
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
              {/* Entidades */}
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

                               <EntitySearchInput
  label="Funcionário"
  placeholder="Buscar por nome ou CPF"
  value={funcionario ? funcionario.nome : ""}
  data={FUNCIONARIOS_MOCK} // Garante array vazio como fallback
  searchKeys={["nome", "documento"]}
  columns={[
    { label: "Nome", key: "nome" },
    { label: "CPF", key: "documento" },
  ]}
  icon={<User size={18} color={GREEN} />}
    
  title="Buscar Funcionário"
  subtitle="Busque por um funcionário cadastrado:"
  onChange={(rt: any) => {
    setFuncionario(rt);
    if (erroFiltro) setErroFiltro(false);
  }}
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

                 <FloatCombobox label="Estado" value={estado} onChange={onChangeEstado} options={estadosOptions} />
                {estado && (
                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                ) }

                 <FloatMultiSelect
    label="Área de Atuação"
    value={areaAtuacao}
    onChange={(novasAreas) => setAreaAtuacao(novasAreas)}
    options={[
      "Clínica Veterinária",
      "Produção Animal",
      "Defesa Sanitária",
      "Inspeção de Produtos",
      "Laboratório de Diagnóstico",
      // Adicione aqui as opções desejadas para Área de Atuação
    ]}
  />

  <FloatMultiSelect
    label="Atuação"
    value={atuacoes}
    onChange={(novasAtuacoes) => setAtuacoes(novasAtuacoes)}
    options={[
      "Vacinação de Brucelose",
      "Emissão de GTA",
      "Responsabilidade Técnica",
      "Atendimento Clínico",
      // Adicione aqui as opções desejadas para Atuações
    ]}
  />

                                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />

          
</div>

              
            </div>
          )}

          {erroFiltro && (
            <p className="text-sm text-red-500">Utilize o campo de busca ou selecione ao menos um filtro para visualizar os resultados.</p>
          )}

          {/* Chips ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {responsavel && <Chip label={`Resp. Técnico: ${responsavel.nome}`} onRemove={() => setResponsavel(null)} />}
              {funcionario && <Chip label={`Funcionário: ${funcionario.nome}`} onRemove={() => setFuncionario(null)} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => onChangeEstado("")} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {areaAtuacao.map((a) => <Chip key={a} label={`Área: ${a}`} onRemove={() => setAreaAtuacao(areaAtuacao.filter((x) => x !== a))} />)}
              {atuacoes.map((a) => <Chip key={a} label={`Atuação: ${a}`} onRemove={() => setAtuacoes(atuacoes.filter((x) => x !== a))} />)}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* TABELA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Busque por revendedoras utilizando o campo de busca e os filtros acima.</p></div>
          ) : total === 0 ? (
            <div className="py-12 text-center"><p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p></div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto  rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className=" border-b border-gray-100">
                      <th onClick={() => toggleSort("codigo")} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-nowrap cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Código{sortKey === "codigo" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th onClick={() => toggleSort("nome")} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[160px] cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Nome{sortKey === "nome" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600  uppercase whitespace-normal max-w-[200px]">Proprietários</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[200px]">Responsáveis Técnicos</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[200px]">Funcionários</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Área de Atuação</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[200px]">Atuações</th>
                      <th onClick={() => toggleSort("municipio")} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-nowrap cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Município - UF{sortKey === "municipio" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th onClick={() => toggleSort("situacao")} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal cursor-pointer select-none hover:text-gray-900"><span className="inline-flex items-center gap-1">Situação{sortKey === "situacao" && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</span></th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition align-top">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.codigo}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.nome}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><MultiCell values={r.proprietarios} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><MultiCell values={r.responsaveis} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><MultiCell values={r.funcionarios} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{r.areaAtuacao.join(", ")}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><MultiCell values={r.atuacoes} /></td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">{r.municipio} - {r.uf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">{r.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-revendedora-agropecuario", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-revendedora", r)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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

      {/* MODAIS DE ENTIDADE COMPLEMENTARES COM CONTEXTO REAJUSTADO */}
      <SearchModal open={modal === "resp"} onClose={() => setModal(null)} title="Buscar Responsável Técnico" subtitle="Busque por um profissional responsável técnico (área animal ou vegetal):" icon={<Stethoscope size={28} color={GREEN} />} data={PROFISSIONAIS_MOCK} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }, { label: "Área", key: "area" }]} searchKeys={["nome", "documento"]} searchPlaceholder="Buscar por nome ou CPF..." confirmLabel="Selecionar" onConfirm={(p: any) => { setResponsavel(p); setModal(null); }} />
      <SearchModal open={modal === "func"} onClose={() => setModal(null)} title="Buscar Funcionário" subtitle="Busque por um funcionário (pessoa física cadastrada):" icon={<User size={28} color={GREEN} />} data={FUNCIONARIOS_MOCK} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]} searchKeys={["nome", "documento"]} searchPlaceholder="Buscar por nome ou CPF..." confirmLabel="Selecionar" onConfirm={(p: any) => { setFuncionario(p); setModal(null); }} />

      {/* MODAIS DE SELEÇÃO MÚLTIPLA */}
      <MultiSearchModal open={modal === "area"} onClose={() => setModal(null)} title="Área de Atuação" subtitle="Selecione uma ou mais áreas:" options={AREAS_ATUACAO} selected={areaAtuacao} onConfirm={(sel: string[]) => { setAreaAtuacao(sel); setModal(null); }} confirmLabel="Confirmar" />
      <MultiSearchModal open={modal === "atuacao"} onClose={() => setModal(null)} title="Atuações" subtitle="Selecione uma ou mais atuações:" options={ATUACOES} selected={atuacoes} onConfirm={(sel: string[]) => { setAtuacoes(sel); setModal(null); }} confirmLabel="Confirmar" />
    </div>
  );
}