import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Minus, PauseCircle, Download, Dna, Eye, ShieldCheck, FileText,
  Pencil, Check, Calendar, ShieldAlert, Info, History, Plus
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { 
  FloatInput, 
  FloatSelect, 
  LargeTextArea, 
  CheckboxGroup, 
  SimNao,
  HistoryCard,
  AccordionCardGroup, 
  EvaluationActiveCard,
  
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

// --- mock ---

export interface CicloProducaoDistribuicao {
  id: number;
  situacao: "Ativo" | "Inativo";
  capacidade: string;
  unidade: string;
  quantidade: string;
  quantidadeTanques: string;
}

export const CICLO_UP_MOCK: CicloProducaoDistribuicao[] = [
  {
    id: 1,
    situacao: "Ativo",
    capacidade: "500",
    unidade: "m³",
    quantidade: "120",
    quantidadeTanques: "5",
  },
  {
    id: 2,
    situacao: "Inativo",
    capacidade: "350",
    unidade: "m³",
    quantidade: "90",
    quantidadeTanques: "4",
  },
  {
    id: 3,
    situacao: "Inativo",
    capacidade: "750",
    unidade: "m²",
    quantidade: "180",
    quantidadeTanques: "7",
  },
  {
    id: 4,
    situacao: "Inativo",
    capacidade: "1200",
    unidade: "L",
    quantidade: "450",
    quantidadeTanques: "12",
  },
  {
    id: 5,
    situacao: "Inativo",
    capacidade: "640",
    unidade: "m³",
    quantidade: "150",
    quantidadeTanques: "6",
  },
  {
    id: 6,
    situacao: "Inativo",
    capacidade: "980",
    unidade: "m²",
    quantidade: "220",
    quantidadeTanques: "9",
  },
];

// ==========================================================
// COMPONENTE GENÉRICO: MODAL BASE ESTILIZADO
// ==========================================================
const LAT = { fontFamily: "inherit" };
const GREEN = "#1A7A3C";

const modalPaths = {
  p2d711e00: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
};

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  saveText?: string;
  onSave?: () => void;
}

export function ModalBase({
  open,
  onClose,
  title,
  subtitle,
  icon,
  width = "1000px",
  children,
  cancelText = "Cancelar",
  onCancel,
  saveText = "Salvar",
  onSave,
}: ModalBaseProps) {
  if (!open) return null;
  const handleCancel = onCancel || onClose;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[15px] flex flex-col gap-[12px] items-center px-[45px] py-[40px] overflow-x-clip overflow-y-auto w-full max-w-[95vw]"
        style={{ 
          border: "1px solid #d6d6d6", 
          maxHeight: "90vh",
          width: width.includes("px") || width.includes("%") ? width : undefined 
        }}
      >
        {/* Botão de Fechar */}
        <div className="flex items-center justify-end w-full">
          <button type="button" className="cursor-pointer overflow-clip relative size-[24px]" onClick={onClose}>
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d={modalPaths.p2d711e00} fill={GREEN} />
            </svg>
          </button>
        </div>

        {/* Título com Ícone */}
        <div className="flex gap-[12px] items-center justify-center w-full">
          {icon && (
            <div className="text-[#1A7A3C] flex items-center justify-center shrink-0 size-[24px]">
              {icon}
            </div>
          )}
          <div className="flex h-[61px] items-center justify-center py-[16px]">
            <span style={{ ...LAT, fontSize: 24, fontWeight: 700, color: "#1d1d1f", whiteSpace: "nowrap" }}>
              {title}
            </span>
          </div>
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <div className="flex items-center justify-center text-center">
            <span style={{ ...LAT, fontSize: 14, fontWeight: 400, color: "#1d1d1f" }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Divisor */}
        <div className="flex flex-col items-center justify-center py-[18px] w-full">
          <div className="h-0 w-full relative">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block w-full" style={{ height: 1 }} fill="none" viewBox="0 0 910 1" preserveAspectRatio="none">
                <line stroke="#D2D2D7" strokeOpacity="0.6" strokeLinecap="round" x1="0.5" x2="909.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="w-full flex flex-col gap-5 mt-2">
          {children}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-[12px] items-center justify-center pb-[24px] pt-[50px] w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer bg-white transition hover:bg-gray-50"
            style={{ border: `1px solid ${GREEN}` }}
          >
            <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: GREEN }}>{cancelText}</span>
          </button>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="bg-[#1A7A3C] hover:bg-[#15612F] flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
            >
              <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "white" }}>{saveText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// PATHS SVG REUTILIZÁVEIS
// ==========================================================
const TOP_BAR_HISTORY = "M0 0H286V7H0V0Z";

const DEFAULT_VULN_COLORS: Record<string, string> = {
  "Bem Protegida": "#008446",
  "Baixa": "#1570EF",
  "Moderada": "#F79009",
  "Alta": "#D92D20",
};

// ==========================================================
// HELPERS DE INTERFACE (UI)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
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
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: React.ReactNode; children: React.ReactNode; comDivisor?: boolean }) {
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

function EntidadeLeitura({ label, value, icon, onVer }: { label: string; value: string; icon?: React.ReactNode; onVer?: () => void }) {
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

// 🟢 DECLARAÇÃO DO COMPONENTE QUE ESTAVA FALTANDO
function CicloProducaoLeitura({
  titulo, ciclo, labelQuantidade,
}: {
  titulo: string;
  ciclo: { quantidade: string; unidade: string; tamanho: string; quantidadeTanques: string } | any;
  labelQuantidade: string;
}) {
  return (
    <SubGrupo titulo={titulo} comDivisor>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FloatInput label={labelQuantidade} value={ciclo.quantidade} disabled onChange={() => {}} />
        <FloatInput label="Unidade de Medida dos Tanques" value={ciclo.unidade} disabled onChange={() => {}} />
        <FloatInput label="Tamanho médio dos tanques" value={ciclo.tamanho} disabled onChange={() => {}} />
        <FloatInput label="Quantidade de Tanques" value={ciclo.quantidadeTanques} disabled onChange={() => {}} />
      </div>
    </SubGrupo>
  );
}

const toCheck = (arr: string[]) => arr.map((v) => ({ id: v, label: v }));
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

// ==========================================================
// BIOSSEGURIDADE — TIPOS E MOCK
// ==========================================================
type NivelVulnerabilidade = "Bem Protegida" | "Baixa" | "Moderada" | "Alta";

interface Biosseguridade {
  id: string;
  medida: string;
  tipo: string;
  responsavel: string;
  dataImplantacao: string;
  dataVencimento: string;
  vulnerabilidade: NivelVulnerabilidade;
  situacao: "Ativa" | "Vencida" | "Suspensa";
  vigente: boolean;
}

const TIPOS_BIOSSEGURIDADE = [
  "Controle de Acesso",
  "Desinfecção",
  "Manejo Sanitário",
  "Isolamento / Quarentena",
  "Controle de Pragas e Vetores",
  "Destinação de Resíduos",
];

const MEDIDAS_BIOSSEGURIDADE = [
  "Cerca perimetral",
  "Arco de desinfecção",
  "Pedilúvio na entrada",
  "Registro de visitantes",
  "Quarentenário de animais novos",
  "Controle de roedores",
  "Vazio sanitário",
];

const NIVEIS_VULNERABILIDADE: NivelVulnerabilidade[] = ["Bem Protegida", "Baixa", "Moderada", "Alta"];

const BIOSSEGURIDADES_MOCK: Biosseguridade[] = [
  {
    id: "b1", medida: "Moderada", tipo: "Profissional",
    responsavel: "José Neto", dataImplantacao: "12/03/2025", dataVencimento: "12/03/2027",
    vulnerabilidade: "Bem Protegida", situacao: "Ativa", vigente: true,
  },
  {
    id: "b3", medida: "Baixa", tipo: "Controle de Acesso",
    responsavel: "Equipe Sanitária", dataImplantacao: "05/01/2024", dataVencimento: "05/01/2026",
    vulnerabilidade: "Baixa", situacao: "Vencida", vigente: false,
  },
  {
    id: "b4", medida: "Alta", tipo: "Controle de Pragas e Vetores",
    responsavel: "Portaria", dataImplantacao: "30/09/2023", dataVencimento: "30/09/2025",
    vulnerabilidade: "Alta", situacao: "Vencida", vigente: false,
  },
  {
    id: "b5", medida: "Bem Protegida", tipo: "Controle de Acesso",
    responsavel: "Portaria", dataImplantacao: "10/11/2023", dataVencimento: "10/11/2025",
    vulnerabilidade: "Bem Protegida", situacao: "Vencida", vigente: false,
  },
];

const REGISTRO = {
  codigo: "310010400050007",
  situacao: "Ativo" as const,
  estabelecimento: { codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG" },
  unidadeArea: "Metros Quadrados",
  areaProdutiva: "5000000",
  areaUtil: "12000",
  titularTipo: "Proprietário",
  produtorTitular: { nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
  outrosProdutores: [] as any[],
  especie: { nome: "Peixe Ornamental", grupo: "Peixes" },
  subespecies: [{ uid: "s1", nome: "Acará-disco" }],
  aptidao: "Ornamental",
  bacia: "Rio Grande",
  origemCaptacao: ["Dentro do Estabelecimento"],
  fonteCaptacao: ["Nascente", "Rio", "Água de chuva"],
  nomeRio: "Rio Verde",
  nomeCorrego: "",
  nomeLago: "",
  nomeReservatorio: "",
  fonteOutro: "",
  finalidadeProducao: "Ciclo Completo",
  tipoPiscicultura: "Unidade de Production",
  origemMatrizes: ["Nacional", "Própria"],
  sistemaProducao: "Fechado",
  sistFechado: ["Aquário", "Tanque Suspenso"],
  sistSemifechado: [] as string[],
  abastecimento: ["Independente para cada Tanque"],
  localDescarte: ["Rede de Esgoto"],
  realizaDepuracao: true,
  tipoDestino: ["Revendedora", "Consumidor Final"],
  escalaComercio: ["Intraestadual", "Interestadual"],
  tratAfluente: ["UV", "Filtro de Carvão Ativado"],
  tratEfluente: ["Tanque de Decantação", "Cloração"],
  cicloRepro: { quantidade: "8000", unidade: "m³", tamanho: "12", quantidadeTanques: "10" },
  cicloEngorda: { quantidade: "15000", unidade: "m³", tamanho: "20", quantidadeTanques: "16" },
  cicloCria: { quantidade: "11000", unidade: "m³", tamanho: "15", quantidadeTanques: "12" },
  cicloUP: { quantidade: "3000", unidade: "L", tamanho: "0,8", quantidadeTanques: "40" },
  isSub: true,
  exploracaoPai: { codigo: "420010400050002" },
  anexos: [
    { id: "a1", nome: "licenca_ambiental.pdf", descricao: "Licença ambiental da piscicultura" },
    { id: "a2", nome: "outorga_agua.pdf", descricao: "" },
  ],
  observacao: "Piscicultura ornamental em sistema fechado, com tratamento de afluente e efluente.",
  usuarioAlteracao: "Lucas Pedro Conte",
  dataAlteracao: "02/07/2026 15:41",
};

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
}

export function VisualizarExploracaoPecuariaPage({
  onLogout = () => {},
  onNavigate = (screen: any) => console.log("navigate:", screen),
}: PageProps = {}) {
  const r = REGISTRO;
  const d = CICLO_UP_MOCK;
  const ativos = d.filter(
      (c) => c.situacao === "Ativo"
  );
  const inativos = d.filter(
      (c) => c.situacao === "Inativo"
  );

  const [activeTab, setActiveTab] = useState("cadastro");
  const [biosseguridades, setBiosseguridades] = useState<Biosseguridade[]>(BIOSSEGURIDADES_MOCK);
  const [modalBiosseguiradadeAberto, setModalBiosseguiradadeAberto] = useState(false);
  const [modalCicloAberto, setModalCicloAberto] = useState(false);
  // ==========================================================
// ESTADOS DA AVALIAÇÃO DE BIOSSEGURIDADE (CONFORME O PDF)
// ==========================================================
const [profissional, setProfissional] = useState("");
const [dataLevantamento, setDataLevantamento] = useState("");
const [livreAnimais, setLivreAnimais] = useState<boolean | null>(null);
const [assistenciaSanitaria, setAssistenciaSanitaria] = useState<boolean | null>(null);
const [controleTransito, setControleTransito] = useState<boolean | null>(null);
const [desinfeccaoVeiculos, setDesinfeccaoVeiculos] = useState<boolean | null>(null);
const [usaProbiotico, setUsaProbiotico] = useState<boolean | null>(null);
const [equipamentosExclusivos, setEquipamentosExclusivos] = useState<boolean | null>(null);
const [barreirasAnimais, setBarreirasAnimais] = useState<boolean | null>(null);
const [desinfeccaoTanques, setDesinfeccaoTanques] = useState<boolean | null>(null);
const [quarentenaIntroducao, setQuarentenaIntroducao] = useState<boolean | null>(null);
const [protegidaInundacoes, setProtegidaInundacoes] = useState<boolean | null>(null);
const [recebeImportados, setRecebeImportados] = useState<boolean | null>(null);
const [recebeAlimentoVivo, setRecebeAlimentoVivo] = useState<boolean | null>(null);

// Opções de profissionais oficiais de exemplo para o FloatSelect
const profissionaisOficiais = [
  { value: "Miriam Souza Sabino", label: "Miriam Souza Sabino" },
  { value: "Jailton Antônio Silveira", label: "Jailton Antônio Silveira" }
];

  const [novoTipo, setNovoTipo] = useState("");
  const [novaMedida, setNovaMedida] = useState("");
  const [novoResponsavel, setNovoResponsavel] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaVulnerabilidade, setNovaVulnerabilidade] = useState("");
  const [novaObs, setNovaObs] = useState("");

  const isPeixes = r.especie.grupo === "Peixes";
  const isOrnamental = r.aptidao === "Ornamental" || r.especie.nome === "Peixe Ornamental";

  const showRepro = r.finalidadeProducao === "Ciclo Completo" || r.finalidadeProducao === "Reprodução/Larvicultura";
  const showEngorda = r.finalidadeProducao === "Ciclo Completo" || r.finalidadeProducao === "Engorda";
  const showCria = r.finalidadeProducao === "Ciclo Completo" || r.finalidadeProducao === "Cria/Recria";

  const baixar = (arquivo: string) => alert(`Fazendo download de: ${arquivo}`);

  const vigentes = biosseguridades.filter((b) => b.vigente);
  const historico = biosseguridades.filter((b) => !b.vigente);
  const ativas = biosseguridades.filter((b) => b.situacao === "Ativa").length;

  const limparModal = () => {
    setNovoTipo("");
    setNovaMedida("");
    setNovoResponsavel("");
    setNovaData("");
    setNovaVulnerabilidade("");
    setNovaObs("");
  };

  const abrirModalBiosseguridade = () => {
    limparModal();
    setModalBiosseguiradadeAberto(true);
  };

  const abrirModalCiclo =() => {
    setModalCicloAberto(true);
  }

  const salvarBiosseguridade = () => {
    if (!novoTipo || !novaMedida) {
      alert("Informe o tipo e a medida de biosseguridade.");
      return;
    }
    const fmt = (iso: string) =>
      iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
    const vencimento = (() => {
      if (!novaData) return "—";
      const d = new Date(novaData);
      d.setFullYear(d.getFullYear() + 2);
      return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    })();

    setBiosseguridades((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        medida: novaMedida,
        tipo: novoTipo,
        responsavel: novoResponsavel || "—",
        dataImplantacao: fmt(novaData),
        dataVencimento: vencimento,
        vulnerabilidade: (novaVulnerabilidade || "Bem Protegida") as NivelVulnerabilidade,
        situacao: "Ativa",
        vigente: true,
      },
    ]);
    setModalBiosseguiradadeAberto(false);
    limparModal();
  };

  const TABS = [
    { id: "cadastro", label: "Cadastro", icon: <FileText size={16} /> },
    { id: "biosseguridade", label: "Biosseguridade", icon: <ShieldCheck size={16} /> },
    { id: "producao/distribuicao", label: "Ciclo de produção/distribuição", icon: <History size={16} /> },
  ];

  const renderActionButton = () => {
  switch (activeTab) {
    case "cadastro":
      return (
        <button
          type="button"
          onClick={() => onNavigate("editar-exploracao-pecuaria", r)}
          className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
        >
          Editar
        </button>
      );

    case "biosseguridade":
      return (
        <button
          type="button"
          onClick={abrirModalBiosseguridade}
          className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
        >
          Adicionar Biosseguridade
        </button>
      );
    
    case "producao/distribuicao":
      return (
        <button
          type="button"
          onClick={abrirModalCiclo}
          className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
        >
          Adicionar Ciclo
        </button>
      );

    default:
      return null;
  }
};

  // ==========================================================
// CÁLCULO DINÂMICO DA NOTA E VULNERABILIDADE (0 a 10)
// ==========================================================
const resultadoAvaliacao = React.useMemo(() => {
  const perguntas = [
    { valor: livreAnimais, favoravel: true },          // Sim é favorável
    { valor: assistenciaSanitaria, favoravel: true },  // Sim é favorável
    { valor: controleTransito, favoravel: true },      // Sim é favorável
    { valor: desinfeccaoVeiculos, favoravel: true },   // Sim é favorável
    { valor: usaProbiotico, favoravel: true },         // Sim é favorável
    { valor: equipamentosExclusivos, favoravel: true },// Sim é favorável
    { valor: barreirasAnimais, favoravel: true },      // Sim é favorável
    { valor: desinfeccaoTanques, favoravel: true },    // Sim é favorável
    { valor: quarentenaIntroducao, favoravel: true },  // Sim é favorável
    { valor: protegidaInundacoes, favoravel: true },   // Sim é favorável
    { valor: recebeImportados, favoravel: false },     // Não é favorável (menor risco)
    { valor: recebeAlimentoVivo, favoravel: false },   // Não é favorável (menor risco)
  ];

  // Filtra apenas as perguntas que já foram respondidas (não nulas)
  const respondidas = perguntas.filter(p => p.valor !== null);
  
  if (respondidas.length === 0) {
    return { nota: "0.0", classe: "D", texto: "Sem respostas", cor: "#6B7280" };
  }

  // Conta os acertos (respostas que batem com o comportamento seguro)
  const acertos = respondidas.filter(p => p.valor === p.favoravel).length;
  
  // Calcula a nota proporcional com base no total de respondidas (máximo 10)
  const notaCalculada = ((acertos / respondidas.length) * 10).toFixed(1);
  const notaNum = parseFloat(notaCalculada);

  // Define o nível e a cor com base na nota calculada
  if (notaNum >= 9.0) {
    return { nota: notaCalculada, classe: "A", texto: "Bem Protegida", cor: "#008446" };
  } else if (notaNum >= 7.0) {
    return { nota: notaCalculada, classe: "B", texto: "Vulnerabilidade Baixa", cor: "#1570EF" };
  } else if (notaNum >= 5.0) {
    return { nota: notaCalculada, classe: "C", texto: "Vulnerabilidade Moderada", cor: "#F79009" };
  } else {
    return { nota: notaCalculada, classe: "D", texto: "Vulnerabilidade Alta", cor: "#D92D20" };
  }
}, [
  livreAnimais, assistenciaSanitaria, controleTransito, desinfeccaoVeiculos,
  usaProbiotico, equipamentosExclusivos, barreirasAnimais, desinfeccaoTanques,
  quarentenaIntroducao, protegidaInundacoes, recebeImportados, recebeAlimentoVivo
]);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="exploracao-pecuaria" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("exploracao-pecuaria")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} aria-hidden />
            Todas as Explorações Pecuárias
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Visualizar Exploração Pecuária</h1>
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 border-b-2 text-sm font-medium transition ${
                activeTab === tab.id ? "border-[#1A7A3C] text-[#1A7A3C]" : "border-transparent text-gray-500 hover:text-gray-700"
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
           
          <Section title="Estabelecimento Agropecuário">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* 1º Elemento: Código do Estabelecimento (Lado Esquerdo) */}
                <FloatInput 
                  label="Código do Estabelecimento" 
                  value={r.estabelecimento.codigo} 
                  disabled 
                  onChange={() => {}} 
                />

                {/* 2º Elemento: Nome do Estabelecimento com a ação "Ver" (Lado Direito / Depois do código) */}
                <EntidadeLeitura
                  label="Estabelecimento Agropecuário"
                  value={r.estabelecimento.nome}
                  onVer={() => onNavigate("visualizar-estabelecimento", r.estabelecimento)}
                />
              </div>
            </Section>

            <Section title="Informações de Área">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <FloatSelect label="Unidade de Medida da Área" value={r.unidadeArea} onChange={() => {}} disabled options={toOptions([r.unidadeArea])} />
                <FloatInput label="Área Produtiva do Estabelecimento" value={r.areaProdutiva} disabled onChange={() => {}} />
                <FloatInput
                  label="Área Útil da Exploração"
                  value={r.areaUtil}
                  disabled
                  onChange={() => {}}
                  hasTooltip
                  tooltipText="A área útil da exploração deve respeitar os limites da área produtiva disponível para a abertura de explorações no estabelecimento agropecuário."
                />
              </div>
            </Section>

            <Section title="Produtores">
              <SubGrupo titulo="Produtor Titular">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-center">
                  <FloatSelect label="Tipo de Produtor" value={r.titularTipo} onChange={() => {}} disabled options={toOptions([r.titularTipo])} />
                  <EntidadeLeitura
                    label="Produtor"
                    value={`${r.produtorTitular.documento} — ${r.produtorTitular.nome}`}
                    onVer={() => onNavigate("visualizar-produtor", r.produtorTitular)}
                  />
                </div>
              </SubGrupo>
            </Section>

            <Section title="Informações da Espécie Explorada">
              <div className="flex flex-col gap-6">
                <SubGrupo titulo="Espécie">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <FloatInput label="Grupo" value={r.especie.grupo} icon={<Dna size={18} color={GREEN} />} disabled onChange={() => {}} />
                    <EntidadeLeitura
                      label="Espécie"
                      value={r.especie.nome}
                      icon={<Dna size={18} color={GREEN} />}
                      onVer={() => onNavigate("visualizar-especie", r.especie)}
                    />
                  </div>
                </SubGrupo>

                {r.subespecies.length > 0 && (
                  <SubGrupo titulo="Subespécies" comDivisor>
                    {r.subespecies.map((s, i) => (
                      <div key={s.uid} className="flex gap-4 items-start w-full">
                        <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-4">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <EntidadeLeitura
                            label="Subespécie"
                            value={s.nome}
                            icon={<Dna size={18} color={GREEN} />}
                            onVer={() => onNavigate("visualizar-subespecie", s)}
                          />
                        </div>
                      </div>
                    ))}
                  </SubGrupo>
                )}

                {isPeixes && (
                  <SubGrupo titulo="Informações Complementares" comDivisor>
                    <div className="flex flex-col gap-6 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <FloatSelect label="Aptidão" value={r.aptidao} onChange={() => {}} disabled options={toOptions([r.aptidao])} />
                        <FloatSelect label="Bacia Hidrográfica" value={r.bacia} onChange={() => {}} disabled options={toOptions([r.bacia])} />
                      </div>

                      <CheckboxGroup
                        title="Origem da Captação de Água"
                        actionLabel=""
                        options={toCheck(r.origemCaptacao)}
                        defaultValue={r.origemCaptacao}
                        onChange={() => {}}
                        orientation="horizontal"
                      />
                      <CheckboxGroup
                        title="Fonte da Captação de Água"
                        actionLabel=""
                        options={toCheck(r.fonteCaptacao)}
                        defaultValue={r.fonteCaptacao}
                        onChange={() => {}}
                        orientation="grid"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {r.fonteCaptacao.includes("Rio") && (
                          <FloatInput label="Nome do Rio" value={r.nomeRio} disabled onChange={() => {}} />
                        )}
                      </div>
                    </div>
                  </SubGrupo>
                )}
              </div>
            </Section>

            {isPeixes && (
              <Section title="Caracterização do Sistema Produtivo">
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <FloatSelect label="Finalidade de Production" value={r.finalidadeProducao} onChange={() => {}} disabled options={toOptions([r.finalidadeProducao])} />
                    {isOrnamental && (
                      <FloatSelect label="Tipo de Piscicultura Ornamental" value={r.tipoPiscicultura} onChange={() => {}} disabled options={toOptions([r.tipoPiscicultura])} />
                    )}
                  </div>

                  <CheckboxGroup
                    title="Origem das Matrizes e Reprodutores"
                    actionLabel=""
                    options={toCheck(r.origemMatrizes)}
                    defaultValue={r.origemMatrizes}
                    onChange={() => {}}
                    orientation="horizontal"
                  />

                  <div className="w-full md:w-1/3">
                    <FloatSelect label="Sistema de Produção" value={r.sistemaProducao} onChange={() => {}} disabled options={toOptions([r.sistemaProducao])} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {r.sistemaProducao === "Fechado" && (
                      <CheckboxGroup
                        title="Sistema de Produção Fechado"
                        actionLabel=""
                        options={toCheck(r.sistFechado)}
                        defaultValue={r.sistFechado}
                        onChange={() => {}}
                        orientation="vertical"
                      />
                    )}
                    <CheckboxGroup
                      title="Abastecimento"
                      actionLabel=""
                      options={toCheck(r.abastecimento)}
                      defaultValue={r.abastecimento}
                      onChange={() => {}}
                      orientation="vertical"
                    />
                    <CheckboxGroup
                      title="Local de Descarte de Água"
                      actionLabel=""
                      options={toCheck(r.localDescarte)}
                      defaultValue={r.localDescarte}
                      onChange={() => {}}
                      orientation="vertical"
                    />
                  </div>

                  <SimNao label="Realiza depuração de peixes?" name="depuracao-view" value={r.realizaDepuracao} onChange={() => {}} disabled />

                  <SubGrupo titulo="Destino dos Animais" comDivisor>
                    <CheckboxGroup
                      title="Tipo de Destino"
                      actionLabel=""
                      options={toCheck(r.tipoDestino)}
                      defaultValue={r.tipoDestino}
                      onChange={() => {}}
                      orientation="horizontal"
                    />
                    <CheckboxGroup
                      title="Escala de Comércio"
                      actionLabel=""
                      options={toCheck(r.escalaComercio)}
                      defaultValue={r.escalaComercio}
                      onChange={() => {}}
                      orientation="horizontal"
                    />
                  </SubGrupo>

                  {isOrnamental && (
                    <SubGrupo titulo="Tratamentos" comDivisor>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
                        <CheckboxGroup
                          title="Tratamento de Afluente"
                          actionLabel=""
                          options={toCheck(r.tratAfluente)}
                          defaultValue={r.tratAfluente}
                          onChange={() => {}}
                          orientation="vertical"
                        />
                        <CheckboxGroup
                          title="Tratamento de Efluente"
                          actionLabel=""
                          options={toCheck(r.tratEfluente)}
                          defaultValue={r.tratEfluente}
                          onChange={() => {}}
                          orientation="vertical"
                        />
                      </div>
                    </SubGrupo>
                  )}
                </div>
              </Section>
            )}

            {isPeixes && (
              <Section title="Ciclos de Produção">
                <div className="flex flex-col gap-6">
                  {showRepro && (
                    <CicloProducaoLeitura titulo="Ciclo de Produção — Reprodução/Larvicultura" ciclo={r.cicloRepro} labelQuantidade="Quantidade de Produção/Ciclo" />
                  )}
                  {showEngorda && (
                    <CicloProducaoLeitura titulo="Ciclo de Produção — Engorda" ciclo={r.cicloEngorda} labelQuantidade="Quantidade de Produção/Ciclo" />
                  )}
                  {showCria && (
                    <CicloProducaoLeitura titulo="Ciclo de Produção — Cria/Recria" ciclo={r.cicloCria} labelQuantidade="Quantidade de Produção/Ciclo" />
                  )}
                  {isOrnamental && r.tipoPiscicultura === "Unidade de Produção" && (
                    <CicloProducaoLeitura titulo="Ciclo de Produção — Unidade de Produção" ciclo={r.cicloUP} labelQuantidade="Quantidade de Comercialização/Mês" />
                  )}
                </div>
              </Section>
            )}

            <Section title="Sub Exploração Pecuária">
              <div className="flex flex-col gap-4">
                <SimNao
                  label="É um Subarrendamento/Subcomodato?"
                  name="sub-exploracao-view"
                  value={r.isSub}
                  onChange={() => {}}
                  disabled
                  hasTooltip
                  tooltipText="Para casos em que a exploração pecuária é uma sub alocação dentro de outra exploração pecuária."
                />
                {r.isSub && r.exploracaoPai && (
                  <EntidadeLeitura
                    label="Exploração Pecuária"
                    value={r.exploracaoPai.codigo}
                    onVer={() => onNavigate("visualizar-exploracao-pecuaria", r.exploracaoPai)}
                  />
                )}
              </div>
            </Section>

            <Section title="Anexo">
              <div className="flex flex-col gap-6">
                {r.anexos.map((anexo, index) => (
                  <div key={anexo.id} className="flex gap-4 items-start w-full">
                    <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-4">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex gap-3 items-start">
                      <div className="w-[340px]">
                        <FloatInput label="Documento" value={anexo.nome} disabled onChange={() => {}} />
                      </div>
                      <div className="flex-1">
                        <FloatInput label="Descrição" value={anexo.descricao || "—"} disabled onChange={() => {}} />
                      </div>
                      <div className="h-12 flex items-center">
                        <button
                          type="button"
                          onClick={() => baixar(anexo.nome)}
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

            <Section title="Observação">
              <LargeTextArea
                label="Observação"
                value={r.observacao}
                onChange={() => {}}
                disabled
                hasTooltip
                tooltipText="Informações adicionais pertinentes ao cadastro."
              />
            </Section>

            <Section title="Alterações do Cadastro" defaultOpen={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatInput label="Usuário" value={r.usuarioAlteracao} disabled onChange={() => {}} />
                <FloatInput label="Data e Hora da Última Modificação" value={r.dataAlteracao} disabled onChange={() => {}} />
              </div>
            </Section>
          </div>
        )}

        {/* ================= ABA BIOSSEGURIDADE ================= */}
        {activeTab === "biosseguridade" && (
          <div className="flex flex-col gap-6 mt-2">
            
            {/* Legenda de Vulnerabilidade */}
            <div className="w-full max-w-[1088px] mx-auto bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center justify-around gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#D92D20] shrink-0" />
                <span className="text-sm font-medium text-gray-700">Vulnerabilidade Alta</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#F79009] shrink-0" />
                <span className="text-sm font-medium text-gray-700">Vulnerabilidade Moderada</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#1570EF] shrink-0" />
                <span className="text-sm font-medium text-gray-700">Vulnerabilidade Baixa</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#129356] shrink-0" />
                <span className="text-sm font-medium text-gray-700">Bem Protegida</span>
              </div>
            </div>
            
            {/* Grupo de Cards */}
            <AccordionCardGroup
              title="Avaliações de Biosseguridade"
              activeCountText={`${ativas} de ${biosseguridades.length} ativas`}
              icon={<ShieldCheck className="w-5 h-5" />}
              onAddClick={abrirModalBiosseguridade}
              variant="sem-vinculacao"
              grid="unico"
              
              historicoTitle="Histórico de Avaliações"
              historicoChildren={
                historico.map((b) => (
                  <HistoryCard
                    key={b.id}
                    label={b.vulnerabilidade}
                    subLabel={`Realizada: ${b.dataImplantacao}`}
                    topBarSvgPath={TOP_BAR_HISTORY}
                    icon={<History size={18} className="text-gray-500" />}
                    actionIcon={<Eye size={16} className="text-gray-500 hover:text-[#008446] transition-colors" />}
                    onActionClick={() => onNavigate("visualizar-biosseguridade", b)} actionIconPath={""}                  />
                ))
              }
            >
              {vigentes.map((b) => (
                <EvaluationActiveCard
                  key={b.id}
                  updatedAt={b.dataImplantacao}
                  statusLabel={b.situacao}
                  score={b.pontuacao || "3.5"}
                  level={b.nivel || "B"}
                  vulnerability={b.vulnerabilidade || "Moderada"}
                  topBarColor={DEFAULT_VULN_COLORS[b.vulnerabilidade] || "#1570EF"}
                  evaluatorName={b.responsavel}
                  evaluatorDoc={b.documento || "213.654.456-45"}
                  evaluatorRole={b.tipo || "Profissional"}
                  onViewClick={() => onNavigate("visualizar-biosseguridade", b)}
                  onMenuClick={() => onNavigate("editar-biosseguridade", b)}
                />
              ))}
            </AccordionCardGroup>
          </div>
        )}

        {/* ================= Aba de ciclo de produção/distribuição ================= */}
        {activeTab === "producao/distribuicao" && (
          <div className="flex flex-col gap-6 mt-2">
            <Section title="Ciclos de Produção/Distribuição" defaultOpen={true}>
              <div className="flex flex-col gap-4">
                <AccordionCardGroup
                  title="Ciclos de Produção/Distribuição"
                  activeCountText={`${ativas} de ${d.length} ativos`}
                  icon={<History className="w-5 h-5" />}
                  onAddClick={abrirModalCiclo}
                  variant="sem-vinculacao"
                  grid="unico"
                  historicoTitle="Histórico de Ciclos Inativos"
                  historicoChildren={inativos.map((c) => (
                    <article
                      key={c.id}
                      className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden min-w-0 w-full"
                    >
                      <div className="h-1 bg-gray-300" />
                      <div className="p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-800">
                            Ciclo de Produção/Distribuição
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                          <FloatInput
                            label="Capacidade de Produção/Distribuição"
                            className="rounded-sm"
                            value={c.quantidade}
                            disabled
                            onChange={() => {}}
                          />
                          <FloatInput
                            label="Unidade de Medida dos Tanques"
                            className="rounded-sm"
                            value={c.unidade}
                            disabled
                            onChange={() => {}}
                          />
                          <FloatInput
                            label="Tamanho médio dos Tanques"
                            className="rounded-sm"
                            value={c.capacidade}
                            disabled
                            onChange={() => {}}
                          />
                          <FloatInput
                            label="Quantidade de Tanques"
                            className="rounded-sm"
                            value={c.quantidadeTanques}
                            disabled
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    </article>
                  ))} children={
                    ativos.map((c) => (
                      <article
                        key={c.id}
                        className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden min-w-0 w-full"
                      >
                        <div className="h-1 bg-[#1A7A3C]" />
                        <div className="p-4 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-800">
                              Ciclo de Produção/Distribuição
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <FloatInput
                              label="Capacidade de Produção/Distribuição"
                              className="rounded-sm"
                              value={c.quantidade}
                              disabled
                              onChange={() => {}}
                            />
                            <FloatInput
                              label="Unidade de Medida dos Tanques"
                              className="rounded-sm"
                              value={c.unidade}
                              disabled
                              onChange={() => {}}
                            />
                            <FloatInput
                              label="Tamanho médio dos Tanques"
                              className="rounded-sm"
                              value={c.capacidade}
                              disabled
                              onChange={() => {}}
                            />
                            <FloatInput
                              label="Quantidade de Tanques"
                              className="rounded-sm"
                              value={c.quantidadeTanques}
                              disabled
                              onChange={() => {}}
                            />
                          </div>
                        </div>
                      </article>
                    ))
                  }
                />
              </div>
            </Section>
          </div>
        )}
      </main>

      {/* ================= Modal de ciclo de produção/distribuição ================= */}

      <ModalBase
        open={modalCicloAberto}
        onClose={() => setModalCicloAberto(false)}
        title="Adicionar Ciclo de Produção/Distribuição"
        subtitle="Preencha todos os campos para realizar a criação do ciclo de produção/distribuição:"
        icon={<History size={24} />}
        saveText="Salvar"
        cancelText="Cancelar"
      >
        <div className="w-full flex flex-col gap-6">
          <Section title="Ciclo de Produção" defaultOpen={true}>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-red-600 w-full text-center">(Exibição dos campos condicionais, aqui está exibindo todos para fins de demonstração)</span>
              <SubGrupo titulo="Engorda">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="Capacidade de Produção/Distribuição"
                    className="rounded-sm"
                    value={""} 
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Unidade de Medida dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Tamanho médio dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Quantidade de Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                </div>
              </SubGrupo>
              <SubGrupo titulo="Cria/Recria">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="Capacidade de Produção/Distribuição"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Unidade de Medida dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Tamanho médio dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Quantidade de Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                </div>
              </SubGrupo>
              <SubGrupo titulo="Reprodução/Larvicultura">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="Capacidade de Produção/Distribuição"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Unidade de Medida dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Tamanho médio dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Quantidade de Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                </div>
              </SubGrupo>
              <SubGrupo titulo="Ciclo Completo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="Capacidade de Produção/Distribuição"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Unidade de Medida dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Tamanho médio dos Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Quantidade de Tanques"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                </div>
              </SubGrupo>
            </div>
          </Section>
          <Section title="Ciclo de Distribuição" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="Capacidade de Comercialização/Mês"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Unidade de Medida dos Tanques/Aquários"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Tamanho médio dos Tanques/Aquários"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                  <FloatInput
                    label="Quantidade de Tanques/Aquários"
                    className="rounded-sm"
                    value={""}
                    required
                    onChange={() => {}}
                  />
                </div>
          </Section>
        </div>
      </ModalBase>


    {/* ==========================================================
          MODAL DE CADASTRO DE BIOSSEGURIDADE (USANDO O NOVO MODALBASE E SECTIONS)
          ========================================================== */}
      <ModalBase
        open={modalBiosseguiradadeAberto}
        onClose={() => setModalBiosseguiradadeAberto(false)}
        title="Adicionar Avaliação de Biosseguridade"
        subtitle="Preencha todos os campos para realizar a avaliação e gerar a pontuação de biosseguridade:"
        icon={<ShieldCheck size={24} />}
        onSave={salvarBiosseguridade}
        saveText="Salvar"
        cancelText="Cancelar"
      >
        <div className="w-full flex flex-col gap-6">
          
          {/* Seção de Informações Gerais */}
          <Section title="Informações Gerais" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <FloatSelect 
                label="Profissional da Área Animal Oficial *" 
                required 
                value={profissional} 
                onChange={setProfissional} 
                options={profissionaisOficiais} 
              />
              <FloatInput 
                label="Data de Levantamento *" 
                type="date" 
                icon={<Calendar size={20} color={GREEN} />} 
                value={dataLevantamento} 
                onChange={(e: any) => setDataLevantamento(e?.target ? e.target.value : e)} 
              />
            </div>
          </Section>

          {/* Seção de Perguntas de Avaliação */}
          <Section title="Perguntas de Avaliação de Biosseguridade" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 w-full">
              <SimNao 
                label="Livre de animais alheios à produção? *" 
                name="livreAnimais" 
                value={livreAnimais} 
                onChange={setLivreAnimais} 
              />
              <SimNao 
                label="Assistência técnica sanitária? *" 
                name="assistenciaSanitaria" 
                value={assistenciaSanitaria} 
                onChange={setAssistenciaSanitaria} 
              />
              <SimNao 
                label="É feito controle de trânsito de pessoas e veículos? *" 
                name="controleTransito" 
                value={controleTransito} 
                onChange={setControleTransito} 
              />
              <SimNao 
                label="É feita desinfecção de veículos e funcionários? *" 
                name="desinfeccaoVeiculos" 
                value={desinfeccaoVeiculos} 
                onChange={setDesinfeccaoVeiculos} 
              />
              <SimNao 
                label="Usa probiótico ou prebiótico? *" 
                name="usaProbiotico" 
                value={usaProbiotico} 
                onChange={setUsaProbiotico} 
              />
              <SimNao 
                label="Os equipamentos de manejo são exclusivos da exploração? *" 
                name="equipamentosExclusivos" 
                value={equipamentosExclusivos} 
                onChange={setEquipamentosExclusivos} 
              />
              <SimNao 
                label="Usa barreiras para impedir a entrada e saída de animais nocivos? *" 
                name="barreirasAnimais" 
                value={barreirasAnimais} 
                onChange={setBarreirasAnimais} 
              />
              <SimNao 
                label="Realiza desinfecção dos tanques? *" 
                name="desinfeccaoTanques" 
                value={desinfeccaoTanques} 
                onChange={setDesinfeccaoTanques} 
              />
              <SimNao 
                label="Realiza quarentena para introdução de animais? *" 
                name="quarentenaIntroducao" 
                value={quarentenaIntroducao} 
                onChange={setQuarentenaIntroducao} 
              />
              <SimNao 
                label="A exploração pecuária é protegida de inundações? *" 
                name="protegidaInundacoes" 
                value={protegidaInundacoes} 
                onChange={setProtegidaInundacoes} 
              />
              <SimNao 
                label="Recebe animais vivos/material de multiplicação animal importado? *" 
                name="recebeImportados" 
                value={recebeImportados} 
                onChange={setRecebeImportados} 
              />
              <SimNao 
                label="Recebe alimento vivo? *" 
                name="recebeAlimentoVivo" 
                value={recebeAlimentoVivo} 
                onChange={setRecebeAlimentoVivo} 
              />
            </div>
          </Section>

         {/* Seção 3: Painel de Resultados (Design Exato) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
            {/* Barra fina na margem superior com cor dinâmica */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
              style={{ backgroundColor: resultadoAvaliacao.cor }}
            />

            {/* Cabeçalho do Painel: Ícone, Título e Tooltip */}
            <div className="flex items-center gap-2 mb-4 mt-1">
              <img 
                src={Icons.iconePontuacaoUrl} 
                className="w-[18px] h-[18px] object-contain flex-shrink-0" 
                alt="Ícone de Pontuação" 
                onError={(e) => {
                  // Fallback caso a URL falhe ou não esteja carregada
                  e.currentTarget.style.display = 'none';
                }}
              />

              <span className="text-xs font-bold text-gray-700  tracking-wider">
                Pontuação
              </span>

           {/* Tooltip Interativo */}
              <div className="relative group cursor-help flex items-center">
                <Info size={14} className="text-gray-400 hover:text-gray-600 transition-colors z-10" />
                
                {/* Balão do Tooltip (Aparece à direita ao passar o mouse) */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 bg-gray-200 text-black text-[11px] p-2.5 rounded-lg shadow-md z-50 font-normal normal-case leading-normal pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  A pontuação e a classe de vulnerabilidade são calculadas em tempo real com base nas respostas dadas às perguntas de biosseguridade.
                  
                  {/* Triângulo do Tooltip (Apontando para a esquerda) */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-950" />
                </div>
              </div>
            </div>

           {/* Dados da Avaliação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              
              {/* Card de Pontuação */}
              <div className="flex flex-col gap-1 bg-gray-50 border border-gray-100 rounded-xm p-4 transition-all">
                <span className="text-xs text-gray-400 ">
                  Pontuação
                </span>
                <span className="text-xl text-gray-800 ">
                  {resultadoAvaliacao.nota}
                </span>
              </div>

              {/* Card de Classe */}
              <div className="flex flex-col gap-1 bg-gray-50 border border-gray-100 rounded-xm p-4 transition-all">
                <span className="text-xs text-gray-400">
                  Classe
                </span>
                <span className="text-xl text-gray-800 ">
                  {resultadoAvaliacao.classe}
                </span>
              </div>

              {/* Card de Nível de Vulnerabilidade */}
              <div className="flex flex-col gap-1 bg-gray-50 border border-gray-100 rounded-xm p-4 transition-all justify-between">
                <span className="text-xs text-gray-400">
                  Nível de Vulnerabilidade
                </span>
                <div className="flex items-center gap-2 mt-1">
               
                  <span className="text-xl text-gray-800 ">
                    {resultadoAvaliacao.texto}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </ModalBase>  
    </div>
  );
}  

export default VisualizarExploracaoPecuariaPage;