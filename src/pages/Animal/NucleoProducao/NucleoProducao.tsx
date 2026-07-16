import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Minus,
  PauseCircle,
  Building2,
  UserRound,
  Dna
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatInput, FloatCombobox, SearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  nucleoExemploAbelhas,
  nucleoExemploAves,
  nucleoExemploSuideos,
  type NucleoProducaoCadastro,
} from "./VisualizarNucleoProducao";


const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS (substituir por dados reais da API)
// ==========================================================
const MUNICIPIOS_MG = [
  "Abadia dos Dourados",
  "Abaeté",
  "Belo Horizonte",
  "Campo Belo",
  "Carrancas",
  "Divino",
  "Esmeraldas",
  "Lavras",
  "Oliveira",
  "Varginha",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
}

const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
  { id: 4, nome: "Maria Aparecida Souza", documento: "117.333.215-95" },
];

interface EstabelecimentoEntidade {
  id: number;
  codigo: string;
  nome: string;
  municipio: string;
  proprietario: {
    nome: string;
    cpf: string;
  };
}

export const ESTABELECIMENTOS_MOCK = [
  {
    codigo: "10234567891",
    nome: "Fazenda do Rio",
    municipio: "Lavras",
    proprietario: { nome: "José Aarão Neto", cpf: "555.009.956-40" }
  },
  {
    codigo: "20345678902",
    nome: "Granja Vale Verde",
    municipio: "Uberlândia",
    proprietario: { nome: "Maria Silva Mendes", cpf: "444.111.222-33" }
  }
];


interface NucleoProducao {
  id: number;
  codigo: string;
  nome: string;
  exploracao: string;
  produtores: { nome: string; documento: string }[];
  estabCodigo: string;
  estabNome: string;
  grupo: NucleoProducaoCadastro["grupo"];
  especie: string;
  municipio: string;
  uf: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";
}

const NUCLEOS_MOCK: NucleoProducao[] = [
  {
    id: 1,
    codigo: "31001040005000301",
    nome: "Fazenda Rio Verde",
    exploracao: "310010400050003",
    produtores: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" }
    ],
    estabCodigo: "10234567891",
    estabNome: "Fazenda do Rio",
    grupo: "Aves",
    especie: "Codorna",
    municipio: "Abadia dos Dourados",
    uf: "MG",
    situacao: "Ativo",
  },
  {
    id: 2,
    codigo: "31001040005000302",
    nome: "Núcleo 0002",
    exploracao: "310010400050004",
    produtores: [{ nome: "Maria Aparecida Souza", documento: "117.333.215-95" }],
    estabCodigo: "31001040005",
    estabNome: "Fazenda Rio Preto",
    grupo: "Suídeos",
    especie: "Suíno",
    municipio: "Lavras",
    uf: "MG",
    situacao: "Suspenso",
  },
  {
    id: 3,
    codigo: "42001040005000101",
    nome: "Apiário Bom Jardim",
    exploracao: "420010400050001",
    produtores: [{ nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" }],
    estabCodigo: "42001040005",
    estabNome: "Fazenda Vertentes",
    grupo: "Abelhas",
    especie: "Abelha com Ferrão",
    municipio: "Varginha",
    uf: "MG",
    situacao: "Inativo",
  },
];

const DETALHES_NUCLEOS_MOCK: Record<number, NucleoProducaoCadastro> = {
  1: nucleoExemploAves,
  2: nucleoExemploSuideos,
  3: nucleoExemploAbelhas,
};

function obterNucleoCompleto(nucleo: NucleoProducao): NucleoProducaoCadastro {
  const detalhes = DETALHES_NUCLEOS_MOCK[nucleo.id];

  return {
    ...detalhes,
    codigo: nucleo.codigo,
    nome: nucleo.nome,
    situacao: nucleo.situacao,
    exploracaoCodigo: nucleo.exploracao,
    produtores: nucleo.produtores,
    estabCodigo: nucleo.estabCodigo,
    estabNome: nucleo.estabNome,
    grupo: nucleo.grupo,
    especie: nucleo.especie,
  };
}

interface SortState {
  key: string | null;
  dir: "asc" | "desc";
}

function SortableTh({
  label,
  colKey,
  sort,
  onSort,
}: {
  label: string;
  colKey: string;
  sort: SortState;
  onSort: (k: string) => void;
}) {
  const active = sort.key === colKey;
  return (
    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
      <button
        type="button"
        onClick={() => onSort(colKey)}
        className="inline-flex items-center gap-1 hover:text-gray-900 transition"
      >
        {label}
        {!active && <ChevronsUpDown size={13} className="text-gray-300" />}
        {active && sort.dir === "asc" && <ChevronUp size={13} style={{ color: GREEN }} />}
        {active && sort.dir === "desc" && <ChevronDown size={13} style={{ color: GREEN }} />}
      </button>
    </th>
  );
}

interface NucleoProducaoPageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function NucleoProducaoPage({ onLogout, onNavigate }: NucleoProducaoPageProps) {
  const [busca, setBusca] = useState("");
  const [produtor, setProdutor] = useState<ProdutorEntidade | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoEntidade | null>(null);
  const [especie, setEspecie] = useState<{ id: string | number; nome: string; grupo: string } | null>(null);
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);

  const [modalProdutor, setModalProdutor] = useState(false);
  const [modalEstab, setModalEstab] = useState(false);
  const [modalEspecie, setModalEspecie] = useState(false);

  const [sort, setSort] = useState<SortState>({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const algumFiltroPreenchido =
    busca.trim() !== "" ||
    !!produtor ||
    !!estabelecimento ||
    municipio !== "" ||
    !!especie ||
    situacao !== "";

  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  // ---- Filtragem Corrigida para comparar o nome da espécie ----
  const filtrados = NUCLEOS_MOCK.filter((n) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca =
      termo === "" ||
      n.codigo.toLowerCase().includes(termo) ||
      n.nome.toLowerCase().includes(termo) ||
      n.exploracao.toLowerCase().includes(termo);
    const matchProdutor =
      !produtor || n.produtores.some((p) => p.documento === produtor.documento);
    const matchEstab = !estabelecimento || n.estabCodigo === estabelecimento.codigo;
    const matchMunicipio = municipio === "" || n.municipio === municipio;
    const matchEspecie = !especie || n.especie.toLowerCase() === especie.nome.toLowerCase();
    const matchSituacao = situacao === "" || n.situacao === situacao;
    
    return (
      matchBusca &&
      matchProdutor &&
      matchEstab &&
      matchMunicipio &&
      matchEspecie &&
      matchSituacao
    );
  });

  const sortValue = (n: NucleoProducao, key: string) => {
    switch (key) {
      case "nome":
        return n.nome;
      case "estab":
        return `${n.estabCodigo} - ${n.estabNome}`;
      case "grupoEspecie":
        return `${n.grupo} - ${n.especie}`;
      case "municipioUf":
        return `${n.municipio} - ${n.uf}`;
      case "situacao":
        return n.situacao;
      default:
        return "";
    }
  };

  const ordenados = [...filtrados].sort((a, b) => {
    if (!sort.key) return 0;
    const va = sortValue(a, sort.key);
    const vb = sortValue(b, sort.key);
    return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = ordenados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = ordenados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const limparFiltro = (campo: string) => {
    if (campo === "produtor") setProdutor(null);
    if (campo === "estabelecimento") setEstabelecimento(null);
    if (campo === "municipio") setMunicipio("");
    if (campo === "especie") setEspecie(null);
    if (campo === "situacao") setSituacao("");
  };

  const [tipoPessoa, setTipoPessoa] = useState<string>("");

  const databaseFiltrada = PRODUTORES_MOCK.filter((p) => {
    const docLimpo = p.documento.replace(/\D/g, "");
    if (tipoPessoa === "PF") return docLimpo.length === 11;
    if (tipoPessoa === "PJ") return docLimpo.length === 14;
    return true;
  });

  const colunasModal = tipoPessoa === "PJ" 
    ? [
        { label: "Razão Social", key: "nome" },
        { label: "CNPJ", key: "documento" },
      ]
    : [
        { label: "Nome", key: "nome" },
        { label: "CPF", key: "documento" },
      ];

  const ESPECIE_MOCK = [
    { id: 1, nome: "Codorna", grupo: "Bovídeos" }, // Mudado para Codorna para casar com o mock
    { id: 2, nome: "Bovino", grupo: "Bovídeos" },
    { id: 3, nome: "Suíno", grupo: "Suídeos" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="nucleo-producao"
        hideSearch={true}
      />
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Núcleo de Produção</h1>
            <button
              onClick={() => onNavigate("adicionar-nucleo-producao")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* QUADRADO BRANCO ÚNICO (Busca + Tabela) */}
        {/* ========================================================== */}
        <div className="bg-white rounded-xl shadow-sm mt-5 overflow-hidden">
          
          {/* Seção de Busca e Filtros */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-3 items-stretch w-full">
              <div
                className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${
                  erroValidacao && !algumFiltroPreenchido
                    ? "border-red-400 ring-1 ring-red-300"
                    : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"
                }`}
              >
                <label
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    focusBusca || busca
                      ? "top-1 text-[10px] text-gray-400 font-medium"
                      : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                  }`}
                >
                  Código ou nome do núcleo, ou código da exploração pecuária
                </label>
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    value={busca}
                    maxLength={255}
                    onFocus={() => setFocusBusca(true)}
                    onBlur={() => setFocusBusca(false)}
                    onChange={(e) => {
                      setBusca(e.target.value);
                      if (erroValidacao) setErroValidacao(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
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
                  color: showFilters ? GREEN : "#ffffff",
                }}
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {/* Filtros avançados */}
            {showFilters && (
              <div className="mt-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <FloatInput
                    label="Produtor"
                    value={produtor ? produtor.nome : ""} 
                    icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} 
                    onClick={() => setModalProdutor(true)}
                  />

                  <FloatInput
                    label="Estabelecimento Agropecuário"
                    value={estabelecimento ? estabelecimento.nome : ""}
                    icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />} 
                    onClick={() => setModalEstab(true)}
                  />

                  <FloatInput
                    label="Espécie"
                    value={especie ? especie.nome : ""}
                    icon={<Dna size={18} />}
                    onClick={() => setModalEspecie(true)}
                  />

                  <button
                    onClick={handlePesquisar}
                    className="h-11 px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                    style={{ backgroundColor: GREEN }}
                  >
                    Pesquisar
                  </button>

                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES}
                  />
                </div>


         
              </div>
            )}

            {erroValidacao && !algumFiltroPreenchido && (
              <p className="text-sm text-red-500 mt-3">
                Selecione ao menos um filtro ou preencha o campo de busca para pesquisar.
              </p>
            )}

            {/* Chips de filtros ativos */}
            {(produtor || estabelecimento || municipio || especie || situacao) && (
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
                {produtor && (
                  <Chip label={`Produtor: ${produtor.nome}`} onRemove={() => limparFiltro("produtor")} />
                )}
                {estabelecimento && (
                  <Chip label={`Estab.: ${estabelecimento.nome}`} onRemove={() => limparFiltro("estabelecimento")} />
                )}
                {municipio && (
                  <Chip label={`Município: ${municipio}`} onRemove={() => limparFiltro("municipio")} />
                )}
                {especie && (
                  <Chip label={`Espécie: ${especie.nome}`} onRemove={() => limparFiltro("especie")} />
                )}
                {situacao && (
                  <Chip label={`Situação: ${situacao}`} onRemove={() => limparFiltro("situacao")} />
                )}
              </div>
            )}
          </div>

          {/* Seção de Resultados / Tabela */}
          <div>
            {!hasSearched ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">
                  Busque por um núcleo de produção utilizando o campo de busca e os filtros acima.
                </p>
              </div>
            ) : total === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 w-[160px]">
                        Código
                      </th>
                      <SortableTh label="Nome" colKey="nome" sort={sort} onSort={handleSort} />
                      <SortableTh label="Estabelecimento" colKey="estab" sort={sort} onSort={handleSort} />
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Produtores</th>
                      <SortableTh label="Grupo de Espécie" colKey="grupoEspecie" sort={sort} onSort={handleSort} />
                      <SortableTh label="Município - UF" colKey="municipioUf" sort={sort} onSort={handleSort} />
                      <SortableTh label="Situação" colKey="situacao" sort={sort} onSort={handleSort} />
                      <th className="px-4 py-3 w-[90px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((n) => (
                      <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">{n.codigo}</td>
                        <td className="px-4 py-3 text-gray-700 break-words">{n.nome}</td>
                        <td className="px-4 py-3 text-gray-500 break-words max-w-[200px]">{n.estabCodigo} - {n.estabNome}</td>
                        <td className="px-4 py-3 text-gray-500 break-words max-w-[250px]">
                          {n.produtores.map((p) => `${p.nome} - ${p.documento}`).join(", ")}
                        </td>
                        <td className="px-4 py-3 text-gray-500 break-words">{n.grupo} - {n.especie}</td>
                        <td className="px-4 py-3 text-gray-500 break-words">{n.municipio} - {n.uf}</td>
                        <td className="px-4 py-3 text-gray-500 break-words font-medium">{n.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => onNavigate("visualizar-nucleo-producao", obterNucleoCompleto(n))}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() => onNavigate("editar-nucleo-producao", obterNucleoCompleto(n))}
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

                {/* Paginação */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                  <span>Itens por página: {perPage}</span>
                  <div className="flex items-center gap-4">
                    <span>{inicio} - {fim} de {total}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={pageAtual === 1}
                        className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
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

        </div>
      </main>

      {/* Modais */}
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
        searchPlaceholder="Buscar Proprietário"
        confirmLabel="Selecionar"
        onConfirm={(p) => {
          setProdutor(p);
          setModalProdutor(false);
          setTipoPessoa(""); 
          if (erroValidacao) setErroValidacao(false);
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

      <SearchModal<EstabelecimentoEntidade & { proprietarioFormatado: string }>
        open={modalEstab}
        onClose={() => setModalEstab(false)}
        title="Buscar Estabelecimento Agropecuário"
        subtitle="Busque por um estabelecimento agropecuário:"
        icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-8 h-8 object-contain" />} 
        data={ESTABELECIMENTOS_MOCK.map(estab => ({
          ...estab,
          proprietarioFormatado: `${estab.proprietario.nome} (${estab.proprietario.cpf})`
        }))}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Estabelecimento", key: "nome" },
          { label: "Município", key: "municipio" },
          { label: "Proprietário", key: "proprietarioFormatado" },
        ]}
        searchKeys={["codigo", "nome", "municipio", "proprietarioFormatado"]}
        searchPlaceholder="Buscar por código, nome, município ou proprietário."
        onConfirm={(e) => {
          setEstabelecimento(e);
          setModalEstab(false);
          if (erroValidacao) setErroValidacao(false);
        }}
        confirmLabel="Selecionar"
      />

      <SearchModal<{ id: string | number; nome: string; grupo: string }>
        open={modalEspecie}
        onClose={() => setModalEspecie(false)}
        title="Buscar Espécie"
        subtitle="Busque por espécie cadastrada:"
        icon={<Dna size={24} className="text-[#1A7A3C]" />} 
        data={ESPECIE_MOCK} 
        columns={[
          { label: "Espécie", key: "nome" },
          { label: "Grupo de Espécie", key: "grupo" }
        ]}
        searchKeys={["nome", "grupo"]}
        searchPlaceholder="Digite para pesquisar..."
        confirmLabel="Confirmar"
        onConfirm={(e) => {
          setEspecie(e); 
          setModalEspecie(false); 
          if (erroValidacao) setErroValidacao(false);
        }}
      />
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}
