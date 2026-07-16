import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Info,
  Download,
  Calendar,
  X,
  Dna,
  Camera,
  CreditCard,
} from "lucide-react";

// 1. Importações Oficiais do System
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  EntitySearchInput,
  ProdutorInput,
  EstabelecimentoAgropecuarioInput,
  ExploracaoPecuariaInput,
} from "../../../components/ui/EntitySearch";

// 2. Importação das Imagens de Guia
import imgLadoDireito from "./imgs/lado_direito.png";
import imgLadoEsquerdo from "./imgs/lado_esquerdo.png";
import imgFrente from "./imgs/frontal.png";
import imgTraseiro from "./imgs/traseiro.png";
import imgRostoFocinho from "./imgs/rosto.png";
import imgPescocoInferior from "./imgs/pescoco_inferior.png";

const GREEN = "#1A7A3C";

// ─── Configurações e Tipos do Canvas de Fotos ─────────────────────────────────

type ViewId =
  | "lado_direito"
  | "lado_esquerdo"
  | "frente"
  | "rosto"
  | "pescoco_inferior"
  | "traseiro";

interface Marker {
  id: string;
  x: number;
  y: number;
  number: number;
  description: string;
}

interface ViewState {
  photo: string | null;
  markers: Marker[];
}

interface ViewConfig {
  id: ViewId;
  label: string;
  guideHint: string;
  guideImage: string;
}

const VIEWS: ViewConfig[] = [
  {
    id: "lado_direito",
    label: "Lado Direito",
    guideHint: "Fotografe pelo lado direito completo do animal",
    guideImage: imgLadoDireito,
  },
  {
    id: "lado_esquerdo",
    label: "Lado Esquerdo",
    guideHint: "Fotografe pelo lado esquerdo completo do animal",
    guideImage: imgLadoEsquerdo,
  },
  {
    id: "frente",
    label: "Frente",
    guideHint: "Posicione-se à frente do animal focando na cabeça e peito",
    guideImage: imgFrente,
  },
  {
    id: "rosto",
    label: "Rosto",
    guideHint: "Aproxime a foto focando nos detalhes da cabeça e focinho",
    guideImage: imgRostoFocinho,
  },
  {
    id: "pescoco_inferior",
    label: "Pescoço Inferior",
    guideHint: "Fotografe a região inferior do pescoço (peito/ganacha)",
    guideImage: imgPescocoInferior,
  },
  {
    id: "traseiro",
    label: "Traseiro",
    guideHint: "Posicione-se atrás do animal pegando a garupa e membros",
    guideImage: imgTraseiro,
  },
];

// ─── Componentes Reutilizáveis de UI do Padrão ────────────────────────────────

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold text-gray-700">
        {titulo}
      </span>
      {children}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface PageProps {
  onLogout?: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarPassaporteEquestrePage({
  onLogout,
  onNavigate,
}: PageProps) {
  // Valores Mockados e Desabilitados nos mesmos estados originais
  const [nomeAnimal] = useState("Vento Divino");
  const [codigoMicrochip] = useState("981023000123456");
  const [dataMicrochip] = useState("12/10/2024");
  const [sexoAnimal] = useState("macho");
  const [dataNascimento] = useState("05/04/2019");

  // Mock de Espécie e Raça
  const [especie] = useState({ id: 1, nome: "Equino" });
  const [raca] = useState({ id: 1, nome: "Mangalarga Marchador" });

  // Mock dos Dados da Exploração
  const [produtor, setProdutor] = useState<any | null>({
    nome: "José Alencar Ramos",
    documento: "123.456.789-00"
  });
  const [estabelecimento, setEstabelecimento] = useState<any | null>({
    nome: "Fazenda Bela Vista",
    codigo: "3106200"
  });
  const [exploracaoPecuaria, setExploracaoPecuaria] = useState<any | null>({
    codigo: "EXP-992-B"
  });

  // Exames Mockados
  const [nomeAnemia] = useState("exame_anemia_2026.pdf");
  const [descricaoAnemia] = useState("Exame negativo de AIE dentro da validade");
  const [dataEmissaoAnemia] = useState("2026-02-10");
  const [dataVencimentoAnemia] = useState("2026-08-10");

  const [nomeMormo] = useState("exame_mormo_2026.pdf");
  const [descricaoMormo] = useState("Exame de mormo realizado via ELISA negativo");
  const [dataEmissaoMormo] = useState("2026-02-10");
  const [dataVencimentoMormo] = useState("2026-08-10");

  // Atestados Mockados
  const [nomeInfluenza] = useState("atestado_influenza_2026.pdf");
  const [descricaoInfluenza] = useState("Vacina anual contra Influenza aplicada");
  const [dataInfluenza] = useState("2026-01-15");

  const [nomeAntirrabica] = useState("atestado_antirrabica_2026.pdf");
  const [descricaoAntirrabica] = useState("Vacina antirrábica obrigatória aplicada");
  const [dataAntirrabica] = useState("2026-01-15");

  const [observacoesGerais] = useState(
    "Animal sem restrições sanitárias. Cicatriz na paleta direita devidamente descrita nos marcadores da resenha gráfica."
  );

  const [activeViewId, setActiveViewId] = useState<ViewId>("lado_direito");
  const containerRef = useRef<HTMLDivElement>(null);

  // Pré-carregando todas as visualizações com as IMAGENS DE REFERÊNCIA originais para servir como ilustração
  const [allViews] = useState<Record<ViewId, ViewState>>({
    lado_direito: {
      photo: imgLadoDireito,
      markers: [
        { id: "m1", x: 45, y: 35, number: 1, description: "Redemoinho de pelos na tábua do pescoço" },
        { id: "m2", x: 62, y: 55, number: 2, description: "Cicatriz linear na altura da paleta" },
      ],
    },
    lado_esquerdo: {
      photo: imgLadoEsquerdo,
      markers: [],
    },
    frente: {
      photo: imgFrente,
      markers: [],
    },
    rosto: {
      photo: imgRostoFocinho,
      markers: [{ id: "m3", x: 50, y: 45, number: 1, description: "Estrela na testa / Filete despigmentado" }],
    },
    pescoco_inferior: {
      photo: imgPescocoInferior,
      markers: [],
    },
    traseiro: {
      photo: imgTraseiro,
      markers: [],
    },
  });

  const activeView = VIEWS.find((v) => v.id === activeViewId)!;
  const current = allViews[activeViewId];

  const handlePagamento = () => {
    // Insira aqui o redirecionamento ou lógica para o gateway de pagamento
    alert("Redirecionando para a tela de pagamento do passaporte...");
    onNavigate("pagamento"); 
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="passaporte"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("passaporte-equestre")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos Passaportes Equestres
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Visualização de Passaporte Equestre
              </h1>
            </div>
          
          </div>
        </div>

        {/* Alerta Informativo de Pagamento Pendente */}
        <div className="w-full bg-[#FFF9E6] border border-[#FFE0B2] rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="text-[#F57C00] flex-shrink-0 mt-0.5">
              <Info size={20} className="stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-gray-800">Pagamento Pendente</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                Para concluir o processo de emissão do passaporte efetue o pagamento da taxa.
              </p>
            </div>
          </div>
          {/* Botão de Pagamento Dentro do Alerta */}
          <button
            type="button"
            onClick={handlePagamento}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F57C00] hover:bg-[#E65100] text-white rounded-lg text-xs font-bold transition self-start sm:self-center shrink-0"
          >
            <CreditCard size={15} />
            Pagar Taxa
          </button>
        </div>

        {/* 1. Informações do Animal */}
        <Section title="Informações Básicas">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FloatInput
                label="Nome do Animal"
                required
                value={nomeAnimal}
                onChange={() => {}}
                disabled
              />
              <FloatInput
                label="Código do Microchip"
                required
                value={codigoMicrochip}
                onChange={() => {}}
                disabled
              />
              <FloatInput
                label="Data do Microchip"
                icon={<Calendar className="w-5 h-5 object-contain" />}
                required
                value={dataMicrochip}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatSelect
                label="Sexo do Animal"
                required
                value={sexoAnimal}
                onChange={() => {}}
                options={[
                  { value: "macho", label: "Macho" },
                  { value: "fêmea", label: "Fêmea" },
                ]}
                disabled
              />
              <FloatInput
                label="Data de Nascimento"
                icon={<Calendar className="w-5 h-5 object-contain" />}
                required
                value={dataNascimento}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Espécie em FloatInput desabilitado */}
              <FloatInput
                label="Espécie"
                required
                value={especie ? especie.nome : "Não informada"}
                onChange={() => {}}
                disabled
              />

              {/* Raça em FloatInput desabilitado */}
              <FloatInput
                label="Raça"
                required
                value={raca ? raca.nome : "Não informada"}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </Section>

        {/* 1.1 Dados da Exploração (Modo Visualização usando FloatInput desabilitado) */}
        <Section title="Dados da Exploração">
          <div className="flex flex-col gap-5">
            
            {/* Bloco do Produtor */}
            <div className="flex gap-3 items-end w-full">
              <div className="flex-1">
                <FloatInput
                  label="Produtor"
                  value={produtor ? `${produtor.nome} - CPF/CNPJ: ${produtor.documento}` : "Não informado"}
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div className="h-12 flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (produtor?.documento) {
                      alert(`Visualizar detalhes do Produtor (CPF/CNPJ): ${produtor.documento}`);
                    } else {
                      alert("Por favor, selecione um produtor primeiro.");
                    }
                  }}
                  className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                  title="Visualizar detalhes do Produtor"
                >
                  {/* Ícone de Olho */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bloco do Estabelecimento Agropecuário */}
            {produtor && (
              <div className="flex gap-3 items-end w-full animate-fadeIn">
                <div className="flex-1">
                  <FloatInput
                    label="Estabelecimento Agropecuário"
                    value={estabelecimento ? `${estabelecimento.nome} - Código: ${estabelecimento.codigo}` : "Não informado"}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="h-12 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (estabelecimento?.codigo) {
                        alert(`Visualizar detalhes do Estabelecimento (Código): ${estabelecimento.codigo}`);
                      } else {
                        alert("Por favor, selecione um estabelecimento primeiro.");
                      }
                    }}
                    className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                    title="Visualizar detalhes do Estabelecimento"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Bloco da Exploração Pecuária */}
            {estabelecimento && (
              <div className="flex gap-3 items-end w-full animate-fadeIn">
                <div className="flex-1">
                  <FloatInput
                    label="Exploração Pecuária"
                    value={exploracaoPecuaria ? `Código: ${exploracaoPecuaria.codigo} - Espécie: ${especie?.nome || "Equídeos"}` : "Não informado"}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="h-12 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (exploracaoPecuaria?.codigo) {
                        alert(`Visualizar detalhes da Exploração (Código): ${exploracaoPecuaria.codigo}`);
                      } else {
                        alert("Por favor, selecione uma exploração pecuária primeiro.");
                      }
                    }}
                    className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                    title="Visualizar detalhes da Exploração Pecuária"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </Section>

        {/* 2. Documentações Clínicas e Exames */}
        <Section title="Exames">
          <div className="flex flex-col gap-6">
            {/* Bloco 1: Exame de Anemia Infecciosa Equina (AIE) */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Exame de Anemia Infecciosa Equina (AIE)">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeAnemia}
                      onSelectFile={() => {}}
                      disabled
                    />
                    <div className="flex-1 animate-fadeIn">
                      <FloatInput
                        label="Descrição"
                        required
                        value={descricaoAnemia}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => alert(`Fazendo download de: ${nomeAnemia}`)}
                        className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatInput
                      label="Data de Emissão"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataEmissaoAnemia}
                      onChange={() => {}}
                      disabled
                    />
                    <FloatInput
                      label="Data de Vencimento"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataVencimentoAnemia}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>
              </SubGrupo>
            </div>

            {/* Bloco 2: Exame de Mormo */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Exame de Mormo">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeMormo}
                      onSelectFile={() => {}}
                      disabled
                    />
                    <div className="flex-1 animate-fadeIn">
                      <FloatInput
                        label="Descrição"
                        required
                        value={descricaoMormo}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => alert(`Fazendo download de: ${nomeMormo}`)}
                        className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatInput
                      label="Data de Emissão"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataEmissaoMormo}
                      onChange={() => {}}
                      disabled
                    />
                    <FloatInput
                      label="Data de Vencimento"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataVencimentoMormo}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>
              </SubGrupo>
            </div>
          </div>
        </Section>

        {/* 2.1 Atestados */}
        <Section title="Atestados">
          <div className="flex flex-col gap-6">
            {/* Bloco 3: Influenza */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Atestado de Vacinação contra Influenza Equina">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeInfluenza}
                      onSelectFile={() => {}}
                      disabled
                    />
                    <div className="flex-1 animate-fadeIn">
                      <FloatInput
                        label="Descrição"
                        required
                        value={descricaoInfluenza}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => alert(`Fazendo download de: ${nomeInfluenza}`)}
                        className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatInput
                      label="Data de Emissão"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataInfluenza}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>
              </SubGrupo>
            </div>

            {/* Bloco 4: Antirrábica */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Atestado de Vacinação contra Antirrábica">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeAntirrabica}
                      onSelectFile={() => {}}
                      disabled
                    />
                    <div className="flex-1 animate-fadeIn">
                      <FloatInput
                        label="Descrição"
                        required
                        value={descricaoAntirrabica}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => alert(`Fazendo download de: ${nomeAntirrabica}`)}
                        className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatInput
                      label="Data de Vacinação"
                      type="date"
                      icon={<Calendar className="w-5 h-5 object-contain" />}
                      required
                      value={dataAntirrabica}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>
              </SubGrupo>
            </div>
          </div>
        </Section>

        {/* 3. Resenha Eletrônica / Mapeamento de Fotos */}
        <Section title="Resenha Eletrônica">
          <div className="flex flex-col gap-4">
            {/* Menu de Abas */}
            <div className="grid grid-cols-2 sm:flex bg-gray-100/80 p-1.5 rounded-xl gap-1.5 w-full mt-2">
              {VIEWS.map((v) => {
                const markerCount = allViews[v.id]?.markers?.length || 0;
                const isActive = activeViewId === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveViewId(v.id)}
                    className={`group flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex-1 text-center sm:text-left
                      ${
                        isActive
                          ? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5"
                          : "bg-green-50/40 text-gray-700 hover:bg-green-50 border border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#1A7A3C] flex items-center justify-center text-white shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span>{v.label}</span>
                    </div>
                    {markerCount > 0 && (
                      <span className="bg-[#1A7A3C] text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center font-bold">
                        {markerCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
              {/* Diretriz de Guia à Esquerda */}
              <div className="lg:col-span-1 flex flex-col gap-3 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Diretriz da Vista
                </span>
                <div className="border border-gray-200/60 rounded-lg overflow-hidden bg-white p-2 flex items-center justify-center min-h-[140px]">
                  <img
                    src={activeView.guideImage}
                    alt={activeView.label}
                    className="max-w-full h-auto object-contain max-h-[130px]"
                    draggable={false}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium text-center">
                  {activeView.guideHint}
                </p>
              </div>

              {/* Área de Visualização Principal do Canvas (Não editável) */}
              <div className="lg:col-span-3">
                {current.photo && (
                  <div
                    ref={containerRef}
                    className="relative border border-gray-200 rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center min-h-[380px]"
                  >
                    <img
                      src={current.photo}
                      alt={activeView.label}
                      className="max-w-full max-h-[500px] object-contain select-none"
                      draggable={false}
                    />
                    {current.markers.map((m) => (
                      <div
                        key={m.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all border border-white/90 cursor-default"
                        style={{
                          left: `${m.x}%`,
                          top: `${m.y}%`,
                          background: "rgba(26, 122, 60, 0.75)",
                        }}
                        title={m.description}
                      >
                        <span className="text-white text-[10px] font-bold">
                          {m.number}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Marcadores Desabilitados para Leitura */}
            {current?.photo && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {current.markers.length === 0 ? (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <span className="text-xs text-gray-500 italic">
                      Nenhuma característica marcante mapeada para esta vista do animal.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Características mapeadas nesta vista
                    </span>
                    {current.markers.map((m) => (
                      <div
                        key={m.id}
                        className="flex gap-4 items-center w-full animate-fadeIn"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: "rgba(26, 122, 60, 0.75)" }}
                        >
                          {m.number}
                        </div>
                        <div className="flex-1">
                          <FloatInput
                            label={`Detalhes da característica do marcador nº ${m.number}`}
                            value={m.description}
                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Painel Integrado de Visão Geral (Grade das 6 Vistas com as imagens originais) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Visão Geral da Resenha Gráfica
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sumário de acompanhamento visual dos 6 quadrantes obrigatórios do equino.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {VIEWS.map((v) => {
                  const viewData = allViews[v.id];
                  return (
                    <div
                      key={v.id}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col h-56 relative shadow-sm"
                    >
                      <div className="px-3 py-2 bg-white border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">
                          {v.label}
                        </span>
                        <span className="bg-[#1A7A3C] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                          {viewData.markers.length}{" "}
                          {viewData.markers.length === 1 ? "marcador" : "marcadores"}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center relative bg-stone-900 overflow-hidden">
                        {viewData.photo ? (
                          <>
                            <img
                              src={viewData.photo}
                              alt={v.label}
                              className="max-w-full max-h-full object-contain"
                            />
                            {viewData.markers.map((m) => (
                              <div
                                key={m.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shadow select-none pointer-events-none border border-white/80"
                                style={{
                                  left: `${m.x}%`,
                                  top: `${m.y}%`,
                                  background: "rgba(26, 122, 60, 0.70)",
                                }}
                              >
                                {m.number}
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center gap-1.5 text-gray-500 bg-gray-50 w-full h-full justify-center">
                            <Camera size={20} className="text-gray-300" />
                            <span className="text-[11px] font-medium tracking-wide text-gray-400">
                              Pendente de Upload
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* 4. Observações Gerais */}
        <Section title="Observações">
          <LargeTextArea
            label="Observações Gerais do Passaporte"
            value={observacoesGerais}
            onChange={() => {}}
            hasTooltip
            tooltipText="Observações e notas adicionais relativas ao passaporte."
            disabled
          />
        </Section>
      </main>
    </div>
  );
}