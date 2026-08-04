import {
  ArrowLeft,
  Calendar,
  CalendarArrowUpIcon,
  ChevronDown,
  ChevronUp,
  Dna,
  Download,
  Info,
  PlusCircle,
  Store,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";

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

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left rounded-xl hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
  comDivisor = false,
}: {
  titulo: string;
  children: React.ReactNode;
  comDivisor?: boolean;
  procedencia?: any[];
}) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarEventoPecuarioPage({ onLogout, onNavigate }: PageProps) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [nomeEvento, setNomeEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [situacao, setSituacao] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [emitido, setEmitido] = useState("");
  const [validadeDe, setValidadeDe] = useState("");
  const [validadeAte, setValidadeAte] = useState("");
  const [especie, setEspecie] = useState([
    {
      id: crypto.randomUUID(),
      especie: null,
    },
  ]);
  const [possuiAuxilio, setPossuiAuxilio] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [anexos, setAnexos] = useState<any[]>([]);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [responsavelTecnico, setResponsavelTecnico] = useState<any | null>(null);
  const [promotora, setPromotora] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [focusNome, setFocusNome] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const temFiltroAtivo =
    nomeEvento.trim() !== "" ||
    tipoEvento !== "" ||
    situacao !== "" ||
    !!especie ||
    !!estabelecimento ||
    !!responsavelTecnico ||
    !!promotora;

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
    const matchResponsavelTecnico =
      !responsavelTecnico ||
      e.responsaveisTecnicos.some((resp) => resp.id === responsavelTecnico.id);
    return matchNome && matchTipo && matchSituacao && matchResponsavelTecnico;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);
  const adicionarEspecie = () => {
    setEspecie((old) => [
      ...old,
      {
        id: crypto.randomUUID(),
        especie: null,
      },
    ]);
  };
  const alterarEspecie = (index: number, especie: any) => {
    setEspecie((old) => old.map((item, i) => (i === index ? { ...item, especie } : item)));
  };
  const removerEspecie = (index: number) => {
    setEspecie((old) => old.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="evento-pecuario"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* --- topo da pagina --- */}
        <div>
          <button
            onClick={() => onNavigate("evento-pecuario")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Eventos Pecuários
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Evento Pecuário</h1>
            <button
              onClick={() => setIsSucesso(true)}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* --- alerta de campos obrigatorios --- */}
        <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios
            e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="pt-5 flex flex-col gap-5">
            <div className="items-center">
              <FloatInput
                label="Nome do Evento"
                required
                value={nomeEvento}
                onChange={setNomeEvento}
                maxLength={100}
              />
            </div>
            <SubGrupo titulo="Periodo do evento" comDivisor>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatInput
                  label="Período - De"
                  type="date"
                  value={validadeDe}
                  onChange={setValidadeDe}
                  icon={<Calendar size={18} />}
                  required
                />
                <FloatInput
                  label="Período - Até"
                  type="date"
                  value={validadeAte}
                  onChange={setValidadeAte}
                  icon={<Calendar size={18} />}
                  required
                />
              </div>
            </SubGrupo>
          </div>
        </Section>
        <Section title="Informações Complementares">
          <div className="pt-5 flex flex-col gap-5">
            <SubGrupo titulo="Espécies do Evento">
              <DynamicListWrapper
                items={especie}
                behavior="at-least-one"
                addButtonLabel="Adicionar Espécie"
                itemLabel="Espécie"
                onAddItem={adicionarEspecie}
                onRemoveItem={removerEspecie}
                variant="plain"
                showCounter
                smallCounter
              >
                {(item, index) => (
                  <EntitySearchInput
                    label="Espécie"
                    placeholder="Buscar espécie"
                    value={item.especie?.nome ?? ""}
                    data={ESPECIES_MOCK}
                    searchKeys={["nome", "grupo"]}
                    columns={[
                      { label: "Nome", key: "nome" },
                      { label: "Grupo", key: "grupo" },
                    ]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Busque por uma espécie cadastrada:"
                    onChange={(ent) => alterarEspecie(index, ent)}
                    required
                  />
                )}
              </DynamicListWrapper>
            </SubGrupo>
            <SubGrupo titulo="Caracterização do evento" comDivisor>
              <div className="items-center">
                <FloatSelect
                  label="Tipo de Evento Pecuário"
                  value={tipoEvento}
                  onChange={setTipoEvento}
                  options={TIPOS_EVENTO}
                  required
                />
              </div>
            </SubGrupo>
          </div>
        </Section>
        <Section title="Promotora do Evento">
          <div className="pt-5 flex flex-col gap-5">
            <div className="items-center">
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
                required
              />
            </div>
          </div>
        </Section>
        <Section title="Estabelecimento de Evento">
          <div className="pt-5 flex flex-col gap-5">
            <div className="items-center">
              <EntitySearchInput
                label="Estabelecimento de Evento"
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
                required
              />
            </div>
          </div>
        </Section>
        <Section title="Estabelecimento Agropecuário">
          <div className="pt-5 flex flex-col gap-5">
            <div className="items-center">
              <SimNao
                label="Possui auxílio de um Estabelecimento Agropecuário próximo para o alojamento de animais?"
                name="possui-auxilio"
                value={possuiAuxilio}
                onChange={setPossuiAuxilio}
                required
              />
            </div>
          </div>
        </Section>
        <Section title="Responsável Técnico">
          <div className="pt-5 flex flex-col gap-5">
            <DynamicListWrapper
              items={especie}
              behavior="at-least-one"
              addButtonLabel="Adicionar Responsável"
              itemLabel="Espécie"
              onAddItem={adicionarEspecie}
              onRemoveItem={removerEspecie}
              variant="plain"
              showCounter
              smallCounter
            >
              {(item, index) => (
                <EntitySearchInput
                  label="Responsável Técnico"
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
              )}
            </DynamicListWrapper>
          </div>
        </Section>
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div
                key={anexo.id}
                className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white"
              >
                {/* Número indicador do anexo (Igual ao Representante Legal) */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos((prev) =>
                          prev.map((a, i) =>
                            i === index
                              ? {
                                  ...a,
                                  nome: `documento_geral_${index + 1}.pdf`,
                                }
                              : a,
                          ),
                        )
                      }
                    />
                    {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) =>
                              setAnexos((prev) =>
                                prev.map((a, i) => (i === index ? { ...a, descricao: v } : a)),
                              )
                            }
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                    {/* Botão de Excluir o Anexo */}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botão para Adicionar Novo Anexo */}
            <button
              type="button"
              onClick={() =>
                setAnexos((prev) => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])
              }
              className="flex items-center mt-5 gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>
        <Section title="Observações">
          <div className="mt-5">
            <LargeTextArea
              label="Observação"
              value={observacao}
              onChange={setObservacao}
              hasTooltip
              tooltipText="Informações adicionais pertinentes ao cadastro."
            />
          </div>
        </Section>
        {/* Modal de Sucesso */}
        {isSucesso && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
              {" "}
              <h3 className="text-lg font-bold text-gray-900">
                Evento pecuário cadastrado com sucesso!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {especie ? `O evento de ${nomeEvento}` : "O evento"} foi cadastrado.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => {
                    setIsSucesso(false);
                    onNavigate("evento-pecuario");
                  }}
                  className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    setIsSucesso(false);
                    onNavigate("visualizar-evento-pecuario");
                  }}
                  className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
                >
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
