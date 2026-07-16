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
  AlertTriangle,
  UserRoundCheck
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, SearchModal, FloatInput, FloatMultiSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// INTERFACES
// ==========================================================
interface ProprietarioEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "Pessoa física" | "Pessoa jurídica";
}

interface ResponsavelTecnicoEntidade {
  id: number;
  nome: string;
  documento: string;
}

interface EstabelecimentoPoaEntidade {
  id: number;
  codigoUnico: string;
  nomeComercial: string;
  codigoSie: string;
  proprietario: string;
  responsavelTecnico: string;
  areaAtuacao: string;        
  classificacao: string;      
  municipioUf: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

// ==========================================================
// MOCKS
// ==========================================================
const PROPRIETARIOS_MOCK: ProprietarioEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "Pessoa física" },
  { id: 3, nome: "Agro Cooperativa IMA", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica" },
];

const RT_MOCK: ResponsavelTecnicoEntidade[] = [
  { id: 1, nome: "Dr. Carlos Eduardo Silva", documento: "123.456.789-00" },
  { id: 2, nome: "Dra. Mariana Costa Alencar", documento: "987.654.321-11" },
];

const CLASSIFICACAO_MAP: Record<string, string[]> = {
  Carne: ["Abatedouro Frigorífico", "Unidade de beneficiamento de carne e produtos cárneos"],
  Leite: ["Entreposto de laticínios", "Granja leiteira", "Posto de refrigeração", "Queijaria", "Unidade de beneficiamento de leite e derivados"],
  Pescado: ["Abatedouro frigorífico", "Unidade de beneficiamento de pescado e produtos de pescado"],
};

const ESTABELECIMENTOS_MOCK: EstabelecimentoPoaEntidade[] = [
  {
    id: 1,
    codigoUnico: "3100000001",
    nomeComercial: "Frigorífico São José",
    codigoSie: "17126",
    proprietario: "José Neto - 555.009.956-40",
    responsavelTecnico: "José Neto - 555.009.956-4", 
    areaAtuacao: "Carne",                                  
    classificacao: "Abatedouro Frigorífico",               
    municipioUf: "Lavras - MG",
    situacao: "Ativo",
  }
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

const AREA_ATUACAO_OPTIONS = [
  "Carne",
  "Leite",
  "Mel",
  "Ovos",
  "Pescado"
];

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SituacaoBadge({ situacao }: { situacao: EstabelecimentoPoaEntidade["situacao"] }) {
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

// Auxiliar para quebrar texto no caractere hifen (-)
function FormatarComQuebra(texto: string) {
  if (!texto) return "";
  const partes = texto.split(" - ");
  if (partes.length > 1) {
    return (
      <>
        <span className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{partes[0]}</span>
        <br />
        <span className="text-xs text-gray-400">{partes[1]}</span>
      </>
    );
  }
  return <span>{texto}</span>;
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EstabelecimentoAgroindustrialSIEMGPage({ onLogout, onNavigate }: PageProps) {
  // ==========================================================
  // ESTADOS DA FILTRAGEM E BUSCA
  // ==========================================================
  const [busca, setBusca] = useState("");
  const [codigoSie, setCodigoSie] = useState("");
  const [proprietario, setProprietario] = useState<ProprietarioEntidade | null>(null);
  const [responsavelTecnico, setResponsavelTecnico] = useState<ResponsavelTecnicoEntidade | null>(null);
  const [areasAtuacao, setAreasAtuacao] = useState<string[]>([]);
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  // Modais e Controles de Visualização
  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("Pessoa física");
  const [modalProprietario, setModalProprietario] = useState(false);
  const [modalRt, setModalRt] = useState(false);
  const [classificacoes, setClassificacoes] = useState<string[]>([]);

  // Paginação
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    if (busca.trim() === "" && !codigoSie && !proprietario && !responsavelTecnico && areasAtuacao.length === 0 && !municipio && !situacao) {
      setErroBusca(true);
      setHasSearched(false);
      return;
    }
    setErroBusca(false);
    setHasSearched(true);
    setPage(1);
  };

  const proprietariosFiltradosModal = PROPRIETARIOS_MOCK.filter(
    (p) => p.tipo === tipoPessoa
  );

  const colunasModalProprietario = [
    { label: tipoPessoa === "Pessoa física" ? "Nome" : "Razão Social", key: "nome" },
    { label: tipoPessoa === "Pessoa jurídica" ? "CNPJ" : "CPF", key: "documento" }
  ];

  const temFiltroAtivo = busca.trim() !== "" || codigoSie !== "" || proprietario !== null || responsavelTecnico !== null || areasAtuacao.length > 0 || municipio !== "" || situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-poa" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Estabelecimento Agroindustrial POA - SIE/MG</h1>
            <button onClick={() => onNavigate("adicionar-agroindustrial-sie")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO DO DESIGN MODELO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior Principal de Busca */}
          <div className="flex gap-3 items-stretch w-full">
            <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${erroBusca ? "border-red-400 focus-within:ring-1 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"}`}>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] font-medium" : "top-1/2 -translate-y-1/2 text-sm"} ${erroBusca ? "text-red-500" : "text-gray-400"}`}>
                Buscar por código único ou nome comercial do estabelecimento POA
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

          {/* Filtros Internos Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              
              {/* LINHA 1 - Redimensionada perfeitamente para caber na linha */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatInput 
                    label="Código SIE/MG" 
                    value={codigoSie} 
                    onChange={(e) => setCodigoSie(e.target.value)} 
                    placeholder="Ex: 17126" 
                  />
                </div>
                
                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Proprietário"
                    value={proprietario ? `${proprietario.nome} ` : ""}
                    required
                    icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-5 h-5 object-contain" />} 
                    onClick={() => setModalProprietario(true)}
                    readOnly
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Responsável Técnico"
                    value={responsavelTecnico ? `${responsavelTecnico.nome} ` : ""}
                    icon={<UserRoundCheck size={18} color={GREEN} />} 
                    onClick={() => setModalRt(true)}
                    readOnly
                  />
                </div>

                {/* Botão Pesquisar compacto com largura ideal para a linha */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 px-6 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap shadow-sm w-full lg:w-36 flex-shrink-0"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* LINHA 2 - Redimensionada perfeitamente para caber na linha */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                
                <div className="w-full lg:flex-1">
                  <FloatMultiSelect 
                    label="Área de Atuação" 
                    value={areasAtuacao} 
                    onChange={(novasAreas) => {
                      setAreasAtuacao(novasAreas);
                      const opcoesDisponiveis = novasAreas.flatMap(area => CLASSIFICACAO_MAP[area] || []);
                      setClassificacoes(prev => prev.filter(c => opcoesDisponiveis.includes(c)));
                    }} 
                    options={AREA_ATUACAO_OPTIONS} 
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatMultiSelect 
                    label="Classificação" 
                    value={classificacoes} 
                    onChange={(novasClassificacoes) => setClassificacoes(novasClassificacoes)} 
                    options={areasAtuacao.flatMap(area => CLASSIFICACAO_MAP[area] || [])}
                    disabled={areasAtuacao.length === 0}
                  />
                </div>
                
                <div className="w-full lg:flex-1">
                  <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                </div>
                
                <div className="w-full lg:flex-1">
                  <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
                </div>

              </div>
            </div>
          )}

          {erroBusca && (
            <p className="text-sm text-red-500">Selecione pelo menos um filtro e/ou utilize o campo de busca para visualizar os resultados.</p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca.trim() && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {codigoSie && <Chip label={`Código SIE: ${codigoSie}`} onRemove={() => setCodigoSie("")} />}
              {proprietario && <Chip label={`Proprietário: ${proprietario.nome}`} onRemove={() => setProprietario(null)} />}
              {responsavelTecnico && <Chip label={`RT: ${responsavelTecnico.nome}`} onRemove={() => setResponsavelTecnico(null)} />}
              {areasAtuacao.map((area) => (
                <Chip key={area} label={`Área: ${area}`} onRemove={() => setAreasAtuacao(areasAtuacao.filter(a => a !== area))} />
              ))}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS DA TABELA */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por um estabelecimento utilizando o campos de busca e os filtros acima.</p>
            </div>
          ) : ESTABELECIMENTOS_MOCK.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Código</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Nome</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Código SIE</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Proprietário</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Responsável Técnico</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Área de Atuação</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Classificação</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Município - UF</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">Situação</th>
                      <th className="px-4 py-3 w-[110px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {ESTABELECIMENTOS_MOCK.map((d) => (
                      <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.codigoUnico}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.nomeComercial}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.codigoSie}</td>
                        {/* Quebra de linha aplicada após o hífen (-) */}
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {FormatarComQuebra(d.proprietario)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {FormatarComQuebra(d.responsavelTecnico)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.areaAtuacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.classificacao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.municipioUf}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{d.situacao}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-estabelecimento-poa", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-estabelecimento-poa", d)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
                  <span>1 - {ESTABELECIMENTOS_MOCK.length} de {ESTABELECIMENTOS_MOCK.length}</span>
                  <div className="flex items-center gap-1">
                    <button disabled className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button disabled className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
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
        icon={<img src={Icons.iconeProdutorUrl} alt="Proprietário" className="w-8 h-8 object-contain" />} 
        data={proprietariosFiltradosModal}
        columns={colunasModalProprietario}
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

      {/* Modal do Responsável Técnico */}
      <SearchModal<ResponsavelTecnicoEntidade>
        open={modalRt}
        onClose={() => setModalRt(false)}
        title="Buscar Responsável Técnico"
        subtitle="Busque por um profissional cadastrado:"
        icon={<UserRoundCheck size={24} color={GREEN} />} 
        data={RT_MOCK}
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar por Nome ou CPF"
        confirmLabel="Confirmar"
        onConfirm={(rt) => {
          setResponsavelTecnico(rt);
          setModalRt(false);
        }}
      />
    </div>
  );
}