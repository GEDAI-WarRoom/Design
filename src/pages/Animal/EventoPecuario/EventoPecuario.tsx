import {
  ArrowLeft,
  CalendarArrowUpIcon,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  SlidersHorizontal,
  Store,
  User,
  Eye as ViewIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { CustomButton, FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- mocks ---
const TIPOS_EVENTO = [
  { value: "Com finalidade comercial", label: "Com finalidade comercial" },
  { value: "Sem finalidade comercial", label: "Sem finalidade comercial" },
];

const MUNICIPIOS = [
  { value: "São Paulo", label: "São Paulo" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "Belo Horizonte", label: "Belo Horizonte" },
  { value: "Lavras", label: "Lavras" },
  { value: "Abaeté", label: "Abaeté" },
  { value: "Abadia dos Dourados", label: "Abadia dos Dourados" },
  { value: "Passos", label: "Passos" },
];

const ESTADOS = [
  { value: "Minas Gerais", label: "Minas Gerais" },
  { value: "São Paulo", label: "São Paulo" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "Belo Horizonte", label: "Belo Horizonte" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

const EMITIDO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Equino", grupo: "Equídeos" },
  { id: 4, codigo: "ESP-004", nome: "Suíno", grupo: "Suídeos" },
  { id: 5, codigo: "ESP-005", nome: "Caprino", grupo: "Caprinos" },
  { id: 6, codigo: "ESP-006", nome: "Galinha", grupo: "Aves" },
];

const PROMOTORAS_MOCK = [
  {
    id: 1,
    nome: "PH Leilões LTDA",
    numeroRegistro: "14385",
    nomeFantasiaProprietario: "PH Agronegócios",
    cnpjProprietario: "12.345.678/0001-90",
  },
  {
    id: 2,
    nome: "Central de Leilões Minas",
    numeroRegistro: "20981",
    nomeFantasiaProprietario: "CLM Eventos",
    cnpjProprietario: "23.456.789/0001-11",
  },
  {
    id: 3,
    nome: "Associação de Criadores do Sul",
    numeroRegistro: "30442",
    nomeFantasiaProprietario: "ACS Eventos Pecuários",
    cnpjProprietario: "34.567.890/0001-22",
  },
];

const RECINTOS_MOCK = [
  {
    id: 1,
    nome: "Fazenda Japecanga",
    municipio: "Lavras/MG",
    proprietario: "João Batista Ferreira",
    codigo: "940877688",
  },
  {
    id: 2,
    nome: "Parque de Exposições Vale Verde",
    municipio: "Varginha/MG",
    proprietario: "Associação Rural Vale Verde",
    codigo: "562349001",
  },
  {
    id: 3,
    nome: "Recinto Serra do Café",
    municipio: "Três Pontas/MG",
    proprietario: "Cooperativa Serra do Café",
    codigo: "851239859",
  },
];

const RESPONSAVEIS_TECNICOS_MOCK = [
  {
    id: 1,
    nome: "José Teixeira Sabino",
    documento: "444.009.956-40",
    habilitadoGta: true,
  },
  {
    id: 2,
    nome: "Marina Couto Dias",
    documento: "333.221.115-09",
    habilitadoGta: true,
  },
  {
    id: 3,
    nome: "Carlos Henrique Reis",
    documento: "222.114.558-70",
    habilitadoGta: false,
  },
];

const EVENTOS_PECUARIOS_MOCK = [
  {
    id: 1,
    codigo: "86237",
    nomeEvento: "Torneio de Pássaros de São João del Rei",
    periodoDe: "2026-06-01",
    periodoAte: "2026-06-03",
    especies: [ESPECIES_MOCK[5]],
    tipoEventoPecuario: "Sem finalidade comercial",
    atividadeEvento: "Torneio de Canto",
    isencaoBrucelose: "",
    promotora: PROMOTORAS_MOCK[0],
    recinto: RECINTOS_MOCK[0],
    possuiAuxilioEstabelecimento: "Não",
    estabelecimentoAgropecuario: null,
    responsaveisTecnicos: [RESPONSAVEIS_TECNICOS_MOCK[0]],
    anexos: [
      {
        uid: "a1",
        nomeArquivo: "regulamento.pdf",
        descricao: "Regulamento do torneio",
      },
    ],
    observacoes: "Este evento acontecerá no salão de eventos da fazenda.",
    situacao: "Ativo",
    usuarioUltimaAlteracao: "Lucas Pedro Conte",
    dataUltimaModificacao: "14/04/2026 07:29",
  },
  {
    id: 2,
    codigo: "86241",
    nomeEvento: "Leilão Genética Premium",
    periodoDe: "2026-07-10",
    periodoAte: "2026-07-10",
    especies: [ESPECIES_MOCK[0], ESPECIES_MOCK[1]],
    tipoEventoPecuario: "Com finalidade comercial",
    atividadeEvento: "Leilão",
    tipoLeilao:
      "Animais com registro genealógico ou com finalidade de reprodução ou produção leiteira",
    promotora: PROMOTORAS_MOCK[1],
    recinto: RECINTOS_MOCK[1],
    possuiAuxilioEstabelecimento: "Sim",
    estabelecimentoAgropecuario: {
      nome: "Fazenda Rio Preto",
      codigo: "34523423567",
    },
    responsaveisTecnicos: [RESPONSAVEIS_TECNICOS_MOCK[0], RESPONSAVEIS_TECNICOS_MOCK[1]],
    anexos: [],
    observacoes: "",
    situacao: "Ativo",
    usuarioUltimaAlteracao: "Marina Couto Dias",
    dataUltimaModificacao: "02/07/2026 15:10",
  },
  {
    id: 3,
    codigo: "86255",
    nomeEvento: "Feira Agropecuária de Três Pontas",
    periodoDe: "2026-03-12",
    periodoAte: "2026-03-15",
    especies: [ESPECIES_MOCK[0], ESPECIES_MOCK[3]],
    tipoEventoPecuario: "Com finalidade comercial",
    atividadeEvento: "Feira",
    isencaoBrucelose: "Não",
    promotora: PROMOTORAS_MOCK[2],
    recinto: RECINTOS_MOCK[2],
    possuiAuxilioEstabelecimento: "Não",
    estabelecimentoAgropecuario: null,
    responsaveisTecnicos: [],
    anexos: [],
    observacoes: "",
    situacao: "Suspenso",
    usuarioUltimaAlteracao: "Carlos Henrique Reis",
    dataUltimaModificacao: "20/03/2026 09:45",
  },
  {
    id: 4,
    codigo: "86260",
    nomeEvento: "Exposição Equina Regional",
    periodoDe: "2025-11-01",
    periodoAte: "2025-11-05",
    especies: [ESPECIES_MOCK[2]],
    tipoEventoPecuario: "Sem finalidade comercial",
    atividadeEvento: "Exposição",
    isencaoBrucelose: "Sim",
    promotora: PROMOTORAS_MOCK[0],
    recinto: RECINTOS_MOCK[0],
    possuiAuxilioEstabelecimento: "Não",
    estabelecimentoAgropecuario: null,
    responsaveisTecnicos: [RESPONSAVEIS_TECNICOS_MOCK[2]],
    anexos: [],
    observacoes: "",
    situacao: "Inativo",
    usuarioUltimaAlteracao: "José Teixeira Sabino",
    dataUltimaModificacao: "06/11/2025 18:00",
  },
];

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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

function formatarData(iso: string) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

interface FloatPopoverProps {
  label: string;
  value: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FloatPopover({ label, value, children, isOpen, onOpenChange }: FloatPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => onOpenChange(!isOpen)}
        className={`relative border border-gray-300 cursor-pointer rounded-md h-12 flex items-end px-3 pb-1.5 transition-all select-none ${isOpen ? "border-[#1A7A3C] ring-1 ring-[#1A7A3C] z-30" : "z-10"}`}
      >
        <div
          className={`absolute left-3 transition-all duration-150 pointer-events-none
              ${
                isOpen || value !== ""
                  ? "top-1 text-[10px] text-gray-400 font-medium"
                  : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
              }`}
        >
          {label}
        </div>

        <div className="absolute left-3 top-1/2 mt-1.5 -translate-y-1/2 text-sm">{value}</div>

        <ChevronDown
          size={16}
          className={`ml-auto text-gray-400 flex-shrink-0 transition-transform mb-2 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg border shadow-lg p-4 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EventoPecuarioPage({ onLogout, onNavigate }: PageProps) {
  const [nomeEvento, setNomeEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [situacao, setSituacao] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [emitido, setEmitido] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [validade, setValidade] = useState("");
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [responsavelTecnico, setResponsavelTecnico] = useState<any | null>(null);
  const [promotora, setPromotora] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [focusNome, setFocusNome] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [open, setOpen] = useState(false);
  const perPage = 10;

  const temFiltroAtivo =
    nomeEvento.trim() !== "" ||
    tipoEvento !== "" ||
    situacao !== "" ||
    !!especie ||
    !!estabelecimento ||
    !!responsavelTecnico ||
    !!promotora;
  !!validade;

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = EVENTOS_PECUARIOS_MOCK.filter((e) => {
    const matchNome =
      nomeEvento.trim() === "" ||
      e.nomeEvento.toLowerCase().includes(nomeEvento.trim().toLowerCase());
    const matchTipo = tipoEvento === "" || e.tipoEventoPecuario === tipoEvento;
    const matchSituacao = situacao === "" || e.situacao === situacao;
    const matchEspecie = !especie || e.especies.some((esp) => esp.id === especie.id);
    const matchResponsavelTecnico =
      !responsavelTecnico ||
      e.responsaveisTecnicos.some((resp) => resp.id === responsavelTecnico.id);
    return matchNome && matchTipo && matchSituacao && matchEspecie && matchResponsavelTecnico;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const formatarDataResumida = (data: string) => {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="evento-pecuario"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* --- topo da pagina --- */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Evento Pecuário</h1>
            <button
              onClick={() => onNavigate("adicionar-evento-pecuario")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* --- container branco unico --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* --- barra superior do filtro --- */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusNome || nomeEvento ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Buscar por código ou nome do evento pecuário
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={nomeEvento}
                  onFocus={() => setFocusNome(true)}
                  onBlur={() => setFocusNome(false)}
                  onChange={(e) => setNomeEvento(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm"
              style={{
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* --- filtros internos avancados --- */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Estabelecimento"
                    placeholder="Buscar por nome do estabelecimento"
                    value={estabelecimento ? estabelecimento.nome : ""}
                    data={RECINTOS_MOCK}
                    searchKeys={["nome", "municipio"]}
                    columns={[
                      { label: "Nome", key: "nome" },
                      { label: "Código", key: "codigo" },
                    ]}
                    icon={<Store size={18} color={GREEN} />}
                    title="Buscar Estabelecimento"
                    subtitle="Busque por um estabelecimento cadastrado:"
                    onChange={(ent) => setEstabelecimento(ent)}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Promotora de Evento"
                    placeholder="Buscar por nome da promotora"
                    value={promotora ? promotora.nome : ""}
                    data={PROMOTORAS_MOCK}
                    searchKeys={["nome", "grupo"]}
                    columns={[
                      { label: "Promotora de Evento", key: "nome" },
                      { label: "Registro da Promotora", key: "numeroRegistro" },
                    ]}
                    icon={<CalendarArrowUpIcon size={18} color={GREEN} />}
                    title="Buscar Promotora"
                    subtitle="Busque por uma promotora cadastrada:"
                    onChange={(ent) => setPromotora(ent)}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Estado"
                    value={estado}
                    onChange={setEstado}
                    options={ESTADOS}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Município"
                    value={municipio}
                    onChange={setMunicipio}
                    options={MUNICIPIOS}
                  />
                </div>
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <EntitySearchInput
                    label="Responsável"
                    placeholder="Buscar por um responsável técnico"
                    value={responsavelTecnico ? responsavelTecnico.nome : ""}
                    data={RESPONSAVEIS_TECNICOS_MOCK}
                    searchKeys={["nome", "municipio"]}
                    columns={[
                      { label: "Nome", key: "nome" },
                      { label: "CPF", key: "documento" },
                    ]}
                    icon={<User size={18} color={GREEN} />}
                    title="Buscar Responsável Técnico"
                    subtitle="Busque por um responsável técnico cadastrado:"
                    onChange={(ent) => setResponsavelTecnico(ent)}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Tipo de Evento"
                    value={tipoEvento}
                    onChange={setTipoEvento}
                    options={TIPOS_EVENTO}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Registro Emitido"
                    value={emitido}
                    onChange={setEmitido}
                    options={EMITIDO}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  {/* <FloatInput
                    label="Período"
                    type="date"
                    value={validade}
                    onChange={setValidade}
                    icon={<Calendar size={18} />}
                  /> */}
                  <FloatPopover
                    label="Período do Evento"
                    value={
                      dataInicio && dataFim
                        ? `${formatarDataResumida(dataInicio)} a ${formatarDataResumida(dataFim)}`
                        : ""
                    }
                    isOpen={open}
                    onOpenChange={setOpen}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FloatInput
                          label="De"
                          type="date"
                          value={dataInicio}
                          onChange={setDataInicio}
                        />
                        <FloatInput label="Até" type="date" value={dataFim} onChange={setDataFim} />
                      </div>
                      <CustomButton onClick={() => setOpen(false)}>Aplicar</CustomButton>
                    </div>
                  </FloatPopover>
                </div>
                <div className="w-full lg:flex-1">
                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES}
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- chips de filtros ativos --- */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {nomeEvento.trim() && (
                <Chip label={`Nome do Evento: ${nomeEvento}`} onRemove={() => setNomeEvento("")} />
              )}
              {tipoEvento && (
                <Chip label={`Tipo de Evento: ${tipoEvento}`} onRemove={() => setTipoEvento("")} />
              )}
              {especie && (
                <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />
              )}
              {situacao && (
                <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />
              )}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* --- area de resultados --- */}
          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por evento pecuário utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Código
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Nome do Evento
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Período
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Tipo de Evento
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Atividade
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {e.codigo}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {e.nomeEvento}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap flex items-center gap-1.5">
                          <CalendarRange size={13} className="text-gray-400" />
                          {formatarData(e.periodoDe)} - {formatarData(e.periodoAte)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {e.tipoEventoPecuario}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {e.atividadeEvento}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {e.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => onNavigate("visualizar-evento-pecuario", e)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() => onNavigate("editar-evento-pecuario", e)}
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
              </div>

              {/* --- paginacao --- */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
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
      </main>
    </div>
  );
}
