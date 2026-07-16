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
  PauseCircle,
  BadgeCheck,
  Dna,
  UserRoundCheck
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================
const ESTABELECIMENTOS_MOCK = [
  { id: 1, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", proprietario: "333.888.777-11\n- Carlos Henrique Souza", },
  { id: 2, codigo: "10234567891", nome: "Fazenda do Rio", municipio: "Abadia dos Dourados - MG", proprietario: "526.820.747-11\n- João de Souza", },
  { id: 3, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG",  proprietario: "444.111.222-33\n- Maria Silva Mendes", },
];

interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

const PROFISSIONAIS_MOCK = [
  { id: 1, nome: "José Teixeira Sabino", documento: "444.009.956-40", habilitadoGta: true },
  { id: 2, nome: "Marina Couto Dias", documento: "333.221.115-09", habilitadoGta: true },
  { id: 3, nome: "Carlos Henrique Reis", documento: "222.114.558-70", habilitadoGta: false },
];
const PROFISSIONAIS_GTA_MOCK = PROFISSIONAIS_MOCK.filter((p) => p.habilitadoGta);

const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "ESP-005", nome: "Peixe Redondo", grupo: "Peixes" },
  { id: 6, codigo: "ESP-006", nome: "Galinha", grupo: "Aves" },
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const VENCENDO_EM = [
  { value: "30 dias", label: "30 dias" },
  { value: "7 dias", label: "7 dias" },
  { value: "Hoje", label: "Hoje" },
  { value: "Período", label: "Período" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

interface Pessoa { nome: string; documento: string }
interface Exploracao {
  id: number;
  codigo: string;
  estabCodigo: string;
  estabNome: string;
  produtores: Pessoa[];
  responsaveis: Pessoa[];
  gta: Pessoa[];
  municipio: string;
  uf: string;
  grupo: string;
  especie: string;
  dataVencimento: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const EXPLORACOES_MOCK: Exploracao[] = [
  {
    id: 1, codigo: "310010400050001", estabCodigo: "10234567891", estabNome: "Fazenda do Rio",
    produtores: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" },
    ],
    responsaveis: [{ nome: "José Teixeira Sabino", documento: "444.009.956-40" }],
    gta: [{ nome: "José Teixeira Sabino", documento: "444.009.956-40" }],
    municipio: "Abadia dos Dourados", uf: "MG", grupo: "Bovídeos", especie: "Bovino",
    dataVencimento: "2030-02-12", situacao: "Ativo",
  },
  {
    id: 2, codigo: "420010400050002", estabCodigo: "42001040005", estabNome: "Fazenda Vertentes",
    produtores: [{ nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" }],
    responsaveis: [{ nome: "Marina Couto Dias", documento: "333.221.115-09" }],
    gta: [{ nome: "Marina Couto Dias", documento: "333.221.115-09" }],
    municipio: "Varginha", uf: "MG", grupo: "Equídeos", especie: "Equino",
    dataVencimento: "—", situacao: "Suspenso",
  },
  {
    id: 3, codigo: "310010400050003", estabCodigo: "31001040005", estabNome: "Fazenda Rio Preto",
    produtores: [{ nome: "Maria Aparecida Souza", documento: "117.333.215-95" }],
    responsaveis: [{ nome: "Carlos Henrique Reis", documento: "222.114.558-70" }],
    gta: [],
    municipio: "Lavras", uf: "MG", group: "Peixes", especie: "Peixe Redondo",
    dataVencimento: "2027-08-05", situacao: "Inativo",
  },
];

function SituacaoBadge({ situacao }: { situacao: Exploracao["situacao"] }) {
  const map = {
    Ativo: { bg: "#E6F4EA", border: "#A3E2B8", text: "#1A7A3C", Icon: Check },
    Inativo: { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280", Icon: Minus },
    Suspenso: { bg: "#FEF3E2", border: "#FCD9A3", text: "#B45309", Icon: PauseCircle },
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

function CelulaPessoas({ pessoas }: { pessoas: Pessoa[] }) {
  if (pessoas.length === 0) return <span className="text-gray-400">—</span>;
  return (
    <div className="text-sm text-gray-500 whitespace-normal">
      <div>{pessoas[0].documento}</div>
      <div>{pessoas[0].nome}</div>
      {pessoas.length > 1 && (
        <div className="text-xs text-gray-400 font-medium mt-0.5">
          + {pessoas.length - 1} selecionado(s)
        </div>
      )}
    </div>
  );
}

const fmtData = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function ExploracaoPecuariaPage({ onLogout, onNavigate }: PageProps) {
  const [codigo, setCodigo] = useState("");
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [produtor, setProdutor] = useState<any | null>(null);
  const [responsavel, setResponsavel] = useState<any | null>(null);
  const [habilitadoGta, setHabilitadoGta] = useState<any | null>(null);
  const [municipio, setMunicipio] = useState("");
  const [especie, setEspecie] = useState<any | null>(null); 
  const [vencendoEm, setVencendoEm] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");
  
  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusCodigo, setFocusCodigo] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroEspecie, setErroEspecie] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    if (!especie) {
      setErroEspecie(true);
      setHasSearched(false);
      return;
    }
    setErroEspecie(false);
    setHasSearched(true);
    setPage(1);
  };

  const databaseFiltrada = PRODUTORES_MOCK.filter((p) => {
    if (!tipoPessoa) return true;
    return p.tipo === tipoPessoa;
  });

  const colunasModal = [
    { label: "Nome", key: "nome" },
    { label: "Documento", key: "documento" }
  ];

  const filtrados = EXPLORACOES_MOCK.filter((e) => {
    const matchCodigo = codigo === "" || e.codigo.includes(codigo);
    const matchEstab = !estabelecimento || e.estabCodigo === estabelecimento.codigo;
    const matchProdutor = !produtor || e.produtores.some((p) => p.documento === produtor.documento);
    const matchResp = !responsavel || e.responsaveis.some((p) => p.documento === responsavel.documento);
    const matchGta = !habilitadoGta || e.gta.some((p) => p.documento === habilitadoGta.documento);
    const matchMunicipio = municipio === "" || e.municipio === municipio;
    const matchEspecie = !especie || e.especie === especie.nome;
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchCodigo && matchEstab && matchProdutor && matchResp && matchGta && matchMunicipio && matchEspecie && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = estabelecimento || produtor || responsavel || habilitadoGta || municipio || especie || vencendoEm || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="exploracao-pecuaria" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Exploração Pecuária</h1>
            <button onClick={() => onNavigate("adicionar-exploracao-pecuaria")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO (Engloba Filtros, Mensagens e Tabela) */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          
          {/* Barra Superior do Filtro (Código e Botão de Expansão) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusCodigo || codigo ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Código da Exploração Pecuária
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  value={codigo}
                  onFocus={() => setFocusCodigo(true)}
                  onBlur={() => setFocusCodigo(false)}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
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
              
              {/* FILEIRA 1: Alinhamento Flex Dinâmico */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Estabelecimento Agropecuário"
                    placeholder="Buscar por código, nome, município ou proprietário."
                    value={estabelecimento ? `${estabelecimento.nome}` : ""}
                    data={ESTABELECIMENTOS_MOCK}
                    searchKeys={["codigo", "nome", "municipio", "proprietario"]}
                    columns={[
                      { label: "Código", key: "codigo" },
                      { label: "Estabelecimento", key: "nome" },
                      { label: "Município", key: "municipio" },
                      { label: "Proprietário", key: "proprietario" },
                    ]}
                    icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento Agropecuário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}      
                    title="Buscar"
                    subtitle="Busque por um estabelecimento cadastrado:"
                    onChange={(ent) => setEstabelecimento(ent)}
                  />
                </div>

                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Produtor"
                    value={produtor ? produtor.nome : ""} 
                    icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} 
                    onClick={() => setModalProdutor(true)}
                    readOnly
                  />            
                </div>

                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Espécie"
                    required
                    placeholder="Buscar por nome da espécie"
                    value={especie ? especie.nome : ""}
                    data={ESPECIES_MOCK}
                    searchKeys={["nome", "grupo"]}
                    columns={[
                      { label: "Espécie", key: "nome" },
                      { label: "Grupo", key: "grupo" },
                    ]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Busque por uma espécie cadastrada:"
                    onChange={(ent) => { setEspecie(ent); setErroEspecie(false); }}
                  />
                </div>

                {/* Botão Pesquisar Compacto */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {/* FILEIRA 2 EM DIANTE: Grid Organizado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
                <EntitySearchInput
                  label="Responsável Técnico"
                  placeholder="Buscar por nome ou CPF"
                  value={responsavel ? responsavel.nome : ""}
                  data={PROFISSIONAIS_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "CPF", key: "documento" },
                  ]}
                  icon={<UserRoundCheck size={18} color={GREEN} />}
                  title="Buscar Responsável Técnico"
                  subtitle="Busque por um responsável técnico cadastrado:"
                  onChange={(ent) => setResponsavel(ent)}
                />

                <EntitySearchInput
                  label="Habilitado para emissão de GTA"
                  placeholder="Buscar pelo nome ou código profissional habilitado."
                  value={habilitadoGta ? habilitadoGta.nome : ""}
                  data={PROFISSIONAIS_GTA_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "CPF", key: "documento" },
                  ]}
                  icon={<BadgeCheck size={18} color={GREEN} />}
                  title="Buscar Habilitado para Emissão de GTA"
                  subtitle="Busque por um profissional habilitado para emissão de GTA:"
                  onChange={(ent) => setHabilitadoGta(ent)}
                />

                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
                <FloatSelect label="Vencendo em" value={vencendoEm} onChange={(v) => { setVencendoEm(v); if (v !== "Período") { setPeriodoDe(""); setPeriodoAte(""); } }} options={VENCENDO_EM} />

                {vencendoEm === "Período" && (
                  <>
                    <FloatInput label="Período de Vencimento - De" type="date" value={periodoDe} onChange={setPeriodoDe} />
                    <FloatInput label="Período de Vencimento - Até" type="date" value={periodoAte} onChange={setPeriodoAte} />
                  </>
                )}

                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
              </div>

              {vencendoEm === "Período" && periodoDe && periodoAte && periodoAte <= periodoDe && (
                <p className="text-sm text-red-500 mt-1">A data "Até" deve ser maior que a data "De".</p>
              )}
            </div>
          )}

          {/* Feedbacks de Erro Global */}
          {erroEspecie && (
            <p className="text-sm text-red-500">A espécie é obrigatória para realizar a busca.</p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}
              {estabelecimento && <Chip label={`Estab.: ${estabelecimento.nome}`} onRemove={() => setEstabelecimento(null)} />}
              {produtor && <Chip label={`Produtor: ${produtor.nome}`} onRemove={() => setProdutor(null)} />}
              {responsavel && <Chip label={`RT: ${responsavel.nome}`} onRemove={() => setResponsavel(null)} />}
              {habilitadoGta && <Chip label={`GTA: ${habilitadoGta.nome}`} onRemove={() => setHabilitadoGta(null)} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {vencendoEm && <Chip label={`Vencendo: ${vencendoEm}`} onRemove={() => { setVencendoEm(""); setPeriodoDe(""); setPeriodoAte(""); }} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Linha Divisória sutil entre filtros e resultados (aparece após primeira busca) */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS (Dentro do mesmo card branco) */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por exploração pecuária utilizando o campo de busca e os filtros acima.</p>
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
    <tr className=" border-b">
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[100px]">Código</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[180px]">Estabelecimento Agropecuário</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[150px]">Produtores</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[150px]">Responsáveis Técnicos</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[120px]">Habilitados GTA</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[120px]">Município - UF</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercasewhitespace-normal max-w-[120px]">Grupo - Espécie</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Data de Vencimento</th>
      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[100px]">Situação</th>
      <th className="px-4 py-3 w-[80px]" />
    </tr>
  </thead>
  <tbody>
    {pagina.map((e) => (
      <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.codigo}</td>
        
        {/* Estabelecimento Agropecuário */}
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
          <div>{e.estabCodigo}</div>
          <div>{e.estabNome}</div>
        </td>
        
        <td className="px-4 py-3 text-gray-500 text-sm"><CelulaPessoas pessoas={e.produtores} /></td>
        <td className="px-4 py-3 text-gray-500 text-sm"><CelulaPessoas pessoas={e.responsaveis} /></td>
        <td className="px-4 py-3 text-gray-500 text-sm"><CelulaPessoas pessoas={e.gta} /></td>
        
        {/* Município - UF */}
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
          <div>{e.municipio}</div>
          <div>{e.uf}</div>
        </td>
        
        {/* Grupo - Espécie */}
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
          <div>{e.grupo}</div>
          <div>{e.especie}</div>
        </td>
        
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{fmtData(e.dataVencimento)}</td>
        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal"><div>{e.situacao}</div></td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => onNavigate("visualizar-exploracao-pecuaria", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
            <button onClick={() => onNavigate("editar-exploracao-pecuaria", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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

      {/* Modal do Produtor */}
      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => {
          setModalProdutor(false);
          setTipoPessoa(""); 
        }}
        title="Buscar Produtor"
        subtitle="Busque por um produtor cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />} 
        data={databaseFiltrada}
        columns={colunasModal}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProdutor(p);
          setModalProdutor(false);
          setTipoPessoa(""); 
        }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "PF", label: "Pessoa Física" },
              { value: "PJ", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />
    </div>
  );
}