import {
  ArrowLeft,
  Calendar,
  CalendarArrowUpIcon,
  ChevronDown,
  ChevronUp,
  Dna,
  Download,
  Eye,
  FileText,
  Store,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, SimNao } from "../../../components/ui/FormKit";

// --- mocks ---

export const ESPECIES_MOCK = [
  { id: "esp-1", nome: "Bovino de Corte", grupo: "Bovinocultura" },
  { id: "esp-2", nome: "Bovino de Leite", grupo: "Bovinocultura" },
  { id: "esp-3", nome: "Equino", grupo: "Equideocultura" },
  { id: "esp-4", nome: "Ovino", grupo: "Ovinocultura" },
  { id: "esp-5", nome: "Caprino", grupo: "Caprinocultura" },
  { id: "esp-6", nome: "Suíno", grupo: "Suinocultura" },
  { id: "esp-7", nome: "Tilápia-do-nilo", grupo: "Piscicultura" },
];

export const TIPOS_EVENTO = [
  { label: "Feira Agropecuária", value: "Feira Agropecuária" },
  { label: "Leilão", value: "Leilão" },
  { label: "Exposição Agropecuária", value: "Exposição Agropecuária" },
  { label: "Rodeio", value: "Rodeio" },
  { label: "Concurso Leiteiro", value: "Concurso Leiteiro" },
  { label: "Cavalgada", value: "Cavalgada" },
];

export const PROMOTORAS_MOCK = [
  {
    id: "prom-1",
    nome: "Associação Rural de Perdões",
    numeroRegistro: "ARP-2019-0034",
    grupo: "Associação Rural",
  },
  {
    id: "prom-2",
    nome: "Sindicato Rural de Varginha",
    numeroRegistro: "SRV-2015-0187",
    grupo: "Sindicato Rural",
  },
  {
    id: "prom-3",
    nome: "Cooperativa Agropecuária do Sul de Minas",
    numeroRegistro: "COOP-2011-0092",
    grupo: "Cooperativa",
  },
  {
    id: "prom-4",
    nome: "Associação Mineira de Criadores",
    numeroRegistro: "AMC-2020-0451",
    grupo: "Associação de Criadores",
  },
];

export const RECINTOS_MOCK = [
  {
    id: "rec-1",
    nome: "Parque de Exposições Dr. José Marcos",
    codigo: "EST-2026-004821",
    municipio: "Perdões/MG",
  },
  {
    id: "rec-2",
    nome: "Parque de Exposições de Varginha",
    codigo: "EST-2024-001190",
    municipio: "Varginha/MG",
  },
  {
    id: "rec-3",
    nome: "Recinto de Exposições Fazenda Modelo",
    codigo: "EST-2022-000765",
    municipio: "Lavras/MG",
  },
];

export const RESPONSAVEIS_TECNICOS_MOCK = [
  {
    id: "rt-1",
    nome: "Dr. Ricardo Andrade Souza",
    documento: "045.678.912-30",
    municipio: "Perdões/MG",
  },
  {
    id: "rt-2",
    nome: "Dra. Fernanda Lima Costa",
    documento: "078.123.456-90",
    municipio: "Varginha/MG",
  },
  {
    id: "rt-3",
    nome: "Dr. Paulo Henrique Martins",
    documento: "112.334.556-21",
    municipio: "Lavras/MG",
  },
];

export const eventoPecuarioMock = {
  nomeEvento: "42ª Expoagro Sul de Minas",

  validadeDe: "2026-09-10",
  validadeAte: "2026-09-14",

  especie: [
    {
      uid: "item-1",
      especie: { nome: "Bovino de Corte", grupo: "Bovinocultura" },
    },
    {
      uid: "item-2",
      especie: { nome: "Equino", grupo: "Equideocultura" },
    },
  ],

  tipoEvento: "Feira Agropecuária",

  promotora: {
    id: "prom-1",
    nome: "Associação Rural de Perdões",
    numeroRegistro: "ARP-2019-0034",
    grupo: "Associação Rural",
  },

  estabelecimento: {
    id: "rec-1",
    nome: "Parque de Exposições Dr. José Marcos",
    codigo: "EST-2026-004821",
    municipio: "Perdões/MG",
  },

  possuiAuxilio: true,

  responsavelTecnico: [
    {
      id: "rt-1",
      nome: "Dr. Ricardo Andrade Souza",
      documento: "045.678.912-30",
      municipio: "Perdões/MG",
    },
    {
      id: "rt-2",
      nome: "Dra. Fernanda Lima Costa",
      documento: "078.123.456-90",
      municipio: "Varginha/MG",
    },
  ],

  anexos: [
    {
      id: "anx-1",
      nome: "regulamento_evento.pdf",
      descricao: "Regulamento oficial do evento pecuário",
    },
    {
      id: "anx-2",
      nome: "planta_recinto.pdf",
      descricao: "Planta do recinto de exposições",
    },
  ],

  observacao:
    "Evento realizado em parceria com a Secretaria Municipal de Agricultura, com apoio veterinário oficial durante todo o período de exposição.",
};

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const GREEN = "#1A7A3C";

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
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
  comDivisor = false,
}: {
  titulo: React.ReactNode;
  children: React.ReactNode;
  comDivisor?: boolean;
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

function EntidadeLeitura({
  label,
  value,
  icon,
  onVer,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onVer?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <FloatInput label={label} value={value} icon={icon} disabled onChange={() => {}} />
      </div>
      {onVer && (
        <button
          type="button"
          onClick={onVer}
          title={`Visualizar ${label}`}
          aria-label={`Visualizar ${label}`}
          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition h-12 flex items-center flex-shrink-0"
        >
          <Eye size={20} />
        </button>
      )}
    </div>
  );
}

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEventoPecuarioPage({
  onLogout = () => {},
  onNavigate = (screen: any) => console.log("navigate:", screen),
  dados,
}: PageProps = {}) {
  const [activeTab, setActiveTab] = useState<"cadastro">("cadastro");
  const TABS = [{ id: "cadastro", label: "Cadastro", icon: <FileText size={16} /> }];

  const renderActionButton = () => {
    switch (activeTab) {
      case "cadastro":
        return (
          <button
            type="button"
            onClick={() => onNavigate("evento-pecuario")}
            className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: GREEN }}
          >
            Editar
          </button>
        );

      default:
        return null;
    }
  };

  function toOptions(values: string[]) {
    return values.map((v) => ({
      value: v,
      label: v,
    }));
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="exploracao-pecuaria"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("evento-pecuario")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} aria-hidden />
            Todos os Eventos Pecuários
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Visualizar Evento Pecuário</h1>
            </div>

            {/* Botão dinâmico conforme a aba ativa */}
            {renderActionButton()}
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-4 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 py-2 px-4 border-b-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-[#1A7A3C] text-[#1A7A3C]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= ABA CADASTRO ================= */}
        {activeTab === "cadastro" && (
          <div className="flex flex-col gap-4">
            <Section title="Informações Básicas">
              <div className="flex flex-col gap-5">
                <div className="items-center">
                  <FloatInput
                    label="Nome do Evento"
                    value={eventoPecuarioMock.nomeEvento}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <SubGrupo titulo="Periodo do evento" comDivisor>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <FloatInput
                      label="Período - De"
                      type="date"
                      value={eventoPecuarioMock.validadeDe}
                      onChange={() => {}}
                      icon={<Calendar size={18} />}
                      disabled
                    />
                    <FloatInput
                      label="Período - Até"
                      type="date"
                      value={eventoPecuarioMock.validadeAte}
                      onChange={() => {}}
                      icon={<Calendar size={18} />}
                      disabled
                    />
                  </div>
                </SubGrupo>
              </div>
            </Section>
            <Section title="Informações Complementares">
              <div className="flex flex-col gap-5">
                <SubGrupo titulo="Espécies do Evento">
                  {eventoPecuarioMock.especie.map((item, i) => (
                    <div key={item.uid} className="flex gap-4 items-start w-full">
                      <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-4">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <EntidadeLeitura
                          label="Espécie"
                          value={item.especie.nome}
                          icon={<Dna size={18} color={GREEN} />}
                          onVer={() => onNavigate("visualizar-especie", item.especie)}
                        />
                      </div>
                    </div>
                  ))}
                </SubGrupo>
                <SubGrupo titulo="Caracterização do evento" comDivisor>
                  <div className="items-center">
                    <FloatSelect
                      label="Tipo de Evento Pecuário"
                      value={eventoPecuarioMock.tipoEvento}
                      onChange={() => {}}
                      disabled
                      options={toOptions([eventoPecuarioMock.tipoEvento])}
                    />
                  </div>
                </SubGrupo>
              </div>
            </Section>
            <Section title="Promotora do Evento">
              <div className="flex flex-col gap-5">
                <EntidadeLeitura
                  label="Nome"
                  value={eventoPecuarioMock.promotora.nome}
                  icon={<CalendarArrowUpIcon size={18} color={GREEN} />}
                  onVer={() => {}}
                />
              </div>
            </Section>
            <Section title="Estabelecimento de Evento">
              <div className="flex flex-col gap-5">
                <EntidadeLeitura
                  label="Nome"
                  value={eventoPecuarioMock.estabelecimento.nome}
                  icon={<Store size={18} color={GREEN} />}
                  onVer={() => {}}
                />
              </div>
            </Section>
            <Section title="Estabelecimento Agropecuário">
              <div className="flex flex-col gap-5">
                <div className="items-center">
                  <SimNao
                    label="Possui auxílio de um Estabelecimento Agropecuário próximo para o alojamento de animais?"
                    name="possui-auxilio"
                    value={eventoPecuarioMock.possuiAuxilio}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
            </Section>
            <Section title="Responsável Técnico">
              <div className="flex flex-col gap-5">
                {eventoPecuarioMock.responsavelTecnico.map((item, i) => (
                  <div key={item.id} className="flex gap-4 items-start w-full">
                    <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-4">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <EntidadeLeitura
                        label="Nome"
                        value={`${item.nome} — ${item.documento}`}
                        icon={<User size={18} color={GREEN} />}
                        onVer={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Anexo">
              <div className="flex flex-col gap-6">
                {eventoPecuarioMock.anexos.map((anexo, index) => (
                  <div key={anexo.id} className="flex gap-4 items-start w-full">
                    <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-4">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex gap-3 items-start">
                      <div className="w-[340px]">
                        <FloatInput
                          label="Documento"
                          value={anexo.nome}
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex-1">
                        <FloatInput
                          label="Descrição"
                          value={anexo.descricao || "—"}
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="h-12 flex items-center">
                        <button
                          type="button"
                          onChange={() => {}}
                          title={`Baixar ${anexo.nome}`}
                          aria-label={`Baixar ${anexo.nome}`}
                          className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Observações">
              <LargeTextArea
                label="Observação"
                value={eventoPecuarioMock.observacao}
                onChange={() => {}}
                hasTooltip
                disabled
                tooltipText="Informações adicionais pertinentes ao cadastro."
              />
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}

export default VisualizarEventoPecuarioPage;
