import { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Eye as ViewIcon, 
  Pencil,
  X,
  ChevronDown
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";

const GREEN = "#1A7A3C";

const MUNICIPiOS_MOCK = [
  { nome: "Abadia dos Dourados", uf: "MG" },
  { nome: "Cabeceira Grande", uf: "MG" },
  { nome: "Conceição da Aparecida", uf: "MG" },
  { nome: "Delfinópolis", uf: "MG" },
  { nome: "Divino", uf: "MG" },
  { nome: "Gurinhatã", uf: "MG" },
  { nome: "Lavras", uf: "MG" },
  { nome: "Belo Horizonte", uf: "MG" },
  { nome: "Campinas", uf: "SP" },
];

const pessoaJuridicaData = [
  { cnpj: "12.345.678/0001-99", razaoSocial: "Agropecuária Vale Verde Ltda", inscricaoEstadual: "123.456.789.110", municipio: "Lavras - MG", situacao: "Ativo" },
  { cnpj: "98.765.432/0001-00", razaoSocial: "Cooperativa dos Produtores de Grãos", inscricaoEstadual: "987.654.321.000", municipio: "Belo Horizonte - MG", situacao: "Ativo" },
  { cnpj: "45.678.912/0001-33", razaoSocial: "Tratores e Implementos Lavras S/A", inscricaoEstadual: "456.123.789.222", municipio: "Lavras - MG", situacao: "Inativo" },
];

interface PessoaJuridicaPageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function PessoaJuridicaPage({ onLogout, onNavigate }: PessoaJuridicaPageProps) {
  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");
  
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Estados de Foco para Label Flutuante
  const [focusBusca, setFocusBusca] = useState(false);
  const [focusMunicipio, setFocusMunicipio] = useState(false);

  // Visibilidade de Dropdowns Customizados
  const [showMunicipioSuggestions, setShowMunicipioSuggestions] = useState(false);
  const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);
  const [showSituacaoDropdown, setShowSituacaoDropdown] = useState(false);

  // Paginação idêntica
  const [page, setPage] = useState(1);
  const totalResults = 12450; 
  const perPage = 10;
  const totalPages = Math.ceil(totalResults / perPage);

  // Refs para fechamento inteligente ao clicar fora
  const estadoRef = useRef<HTMLDivElement>(null);
  const situacaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (estadoRef.current && !estadoRef.current.contains(event.target as Node)) {
        setShowEstadoDropdown(false);
      }
      if (situacaoRef.current && !situacaoRef.current.contains(event.target as Node)) {
        setShowSituacaoDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMunicipios = MUNICIPiOS_MOCK.filter(m => 
    m.uf === estado && 
    m.nome.toLowerCase().includes(municipio.toLowerCase())
  );

  // Lógica de filtragem com os campos corrigidos
  const displayData = pessoaJuridicaData.filter((p) => {
    const matchBusca =
      busca === "" ||
      p.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
      p.cnpj.includes(busca);
    const matchSituacao = situacao === "" || p.situacao === situacao;
    const matchEstado = estado === "" || p.municipio.endsWith(`- ${estado}`);
    const matchMunicipio = municipio === "" || p.municipio.toLowerCase().includes(municipio.toLowerCase());
    return matchBusca && matchSituacao && matchEstado && matchMunicipio;
  });

  const estadosOpcoes = [
    { value: "MG", label: "Minas Gerais" },
    { value: "SP", label: "São Paulo" },
    { value: "RJ", label: "Rio de Janeiro" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-juridica" hideSearch={true} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-normal"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Pessoa Jurídica</h1>
            <button
              onClick={() => onNavigate("adicionar-pessoa-juridica")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* Card de Busca Principal */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-5">
          
          {/* Linha Superior */}
          <div className="flex gap-3 items-stretch w-full mb-4">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label 
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusBusca || busca 
                    ? "top-1 text-[10px] text-gray-400 font-medium" 
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }`}
              >
                Buscar por CNPJ ou Razão Social
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 font-normal"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm gap-2"
              style={{ 
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff"
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Linha de Filtros Avançados Customizados */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full animate-fadeIn mb-4 z-20 relative">
              
              {/* Custom Select - Estado */}
              <div ref={estadoRef} className="w-full sm:flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 cursor-pointer focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <div className="w-full h-full flex items-end justify-between" onClick={() => setShowEstadoDropdown(!showEstadoDropdown)}>
                  <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${estado ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                    Estado
                  </label>
                  <span className="text-sm text-gray-800 h-6 flex items-center font-normal">
                    {estadosOpcoes.find(e => e.value === estado)?.label || ""}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform mb-0.5 ${showEstadoDropdown ? "rotate-180" : ""}`} />
                </div>

                {showEstadoDropdown && (
                  <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 animate-fadeIn overflow-hidden">
                    {estadosOpcoes.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => {
                          setEstado(opt.value);
                          setMunicipio("");
                          setShowEstadoDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left transition hover:bg-gray-50 text-gray-700 font-normal ${estado === opt.value ? "bg-gray-50 text-[#1A7A3C]" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Campo Município com Autocomplete Modernizado */}
              {estado && (
                <div className="w-full sm:flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C] animate-fadeIn">
                  <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusMunicipio || municipio ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                    Município
                  </label>
                  <div className="w-full relative">
                    <input
                      type="text"
                      value={municipio}
                      onFocus={() => { setFocusMunicipio(true); setShowMunicipioSuggestions(true); }}
                      onBlur={() => { 
                        setFocusMunicipio(false); 
                        setTimeout(() => setShowMunicipioSuggestions(false), 200); 
                      }}
                      onChange={(e) => setMunicipio(e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none h-6 pr-5 font-normal"
                    />
                    <ChevronDown size={16} className="absolute right-0 bottom-1 text-gray-400 pointer-events-none" />

                    {showMunicipioSuggestions && filteredMunicipios.length > 0 && (
                      <div className="absolute top-[calc(100%+10px)] left-[-12px] w-[calc(100%+24px)] bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto py-1 animate-fadeIn">
                        {filteredMunicipios.map((m) => (
                          <div
                            key={m.nome}
                            onClick={() => setMunicipio(m.nome)}
                            className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 mx-1 rounded-md cursor-pointer transition text-left font-normal"
                          >
                            {m.nome}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Select - Situação */}
              <div ref={situacaoRef} className="w-full sm:flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 cursor-pointer focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
                <div className="w-full h-full flex items-end justify-between" onClick={() => setShowSituacaoDropdown(!showSituacaoDropdown)}>
                  <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${situacao ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                    Situação
                  </label>
                  <span className="text-sm text-gray-800 h-6 flex items-center font-normal">{situacao}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform mb-0.5 ${showSituacaoDropdown ? "rotate-180" : ""}`} />
                </div>

                {showSituacaoDropdown && (
                  <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 animate-fadeIn overflow-hidden">
                    {["Ativo", "Inativo"].map((sit) => (
                      <button
                        type="button"
                        key={sit}
                        onClick={() => {
                          setSituacao(sit);
                          setShowSituacaoDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left transition hover:bg-gray-50 text-gray-700 font-normal ${situacao === sit ? "bg-gray-50 text-[#1A7A3C]" : ""}`}
                      >
                        {sit}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => { setHasSearched(true); setPage(1); }}
                className="w-full sm:w-auto h-12 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90 whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {/* Área de Chips de Filtros Ativos */}
          {(estado || municipio || situacao) && (
            <div className="flex flex-wrap gap-2 mb-4 animate-fadeIn">
              {estado && (
                <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-normal px-3 py-1.5 rounded-md shadow-sm">
                  <span>Estado: {estado}</span>
                  <button onClick={() => { setEstado(""); setMunicipio(""); }} className="hover:opacity-80 transition">
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              )}
              {municipio && (
                <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-normal px-3 py-1.5 rounded-md shadow-sm">
                  <span>Município: {municipio}</span>
                  <button onClick={() => setMunicipio("")} className="hover:opacity-80 transition">
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              )}
              {situacao && (
                <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-normal px-3 py-1.5 rounded-md shadow-sm">
                  <span>Situação: {situacao}</span>
                  <button onClick={() => setSituacao("")} className="hover:opacity-80 transition">
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Área de Resultados Condicional */}
          {!hasSearched ? (
            <div className="text-center py-12 mt-2">
              <p className="text-sm text-gray-400 font-normal">
                Busque por pessoa jurídica utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* Tabela de Pessoa Jurídica */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["CNPJ", "RAZÃO SOCIAL", "MUNICÍPIO - UF", "SITUAÇÃO", "AÇÕES"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-normal text-gray-600">
                    {displayData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 text-sm font-normal">
                          Nenhum registro encontrado para os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      displayData.map((row) => (
                        <tr key={row.cnpj} className="border-b border-gray-100 hover:bg-gray-50 transition font-normal">
                          <td className="py-3 pr-4 text-gray-600 font-normal">{row.cnpj}</td>
                          <td className="py-3 pr-4 text-gray-600 font-normal">{row.razaoSocial}</td>
                          <td className="py-3 pr-4 text-gray-600 font-normal">{row.municipio}</td>
                          <td className="py-3 pr-4">
                            <span className="text-sm text-gray-600 font-normal">
                              {row.situacao}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-4 justify-start">
                              
                              {/* Botão Visualizar */}
                              <div className="relative group flex items-center justify-center">
                                <button 
                                  onClick={() => onNavigate("visualizar-pessoa-juridica", row)}
                                  className="hover:opacity-70 transition"
                                >
                                  <ViewIcon size={16} style={{ color: GREEN }} />
                                </button>
                                <span className="absolute bottom-full mb-2 hidden group-hover:flex bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap animate-fadeIn font-normal pointer-events-none z-10">
                                  Visualizar
                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                                </span>
                              </div>

                              {/* Botão Editar */}
                              <div className="relative group flex items-center justify-center">
                                <button 
                                  onClick={() => onNavigate("editar-pessoa-juridica", row)}
                                  className="hover:opacity-70 transition"
                                >
                                  <Pencil size={15} style={{ color: GREEN }} />
                                </button>
                                <span className="absolute bottom-full mb-2 hidden group-hover:flex bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap animate-fadeIn font-normal pointer-events-none z-10">
                                  Editar
                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                                </span>
                              </div>

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              {displayData.length > 0 && (
                <div className="flex flex-wrap items-center justify-between mt-5 gap-2 text-sm text-gray-500 font-normal">
                  <span>Itens por página: {perPage}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      Mostrando de {(page - 1) * perPage + 1} a {Math.min(page * perPage, totalResults)} de {totalResults.toLocaleString("pt-BR")} resultados
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}