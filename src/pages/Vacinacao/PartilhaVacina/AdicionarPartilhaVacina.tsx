import React, { useState, useRef, useCallback } from "react";
import iconeDoencaUrl from "../../../imports/icons/Ícone=Doença.png";
import iconeDestinatarioUrl from "../../../imports/icons/Icone_Destinatario.png";
import iconeExploracaoUrl from "../../../imports/icons/Ícone=Exploração Pecuária.png";
import iconeNotaFiscalUrl from "../../../imports/icons/Ícone=Nota Fiscal.png";
import { PieChart, Pie, Cell, Sector } from "recharts";

import {
  ExploracaoPecuariaInput,
  EstabelecimentoAgropecuarioInput,
  DynamicListWrapper, FornecedorInput, DestinatarioInput
} from "../../../components/ui/EntitySearch";


import {
  ArrowLeft,
  User,
  FlaskConical,
  FileText,
  Calendar,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Store,
  Eye,
  Trash2,
  PlusCircle,
  Info,
  Download,
  Package,
  PillBottle
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  SearchModal,
  CustomRadio,
  MultiSearchModal,
  CustomButton,
  UploadField,
  EntitySelector
} from "../../../components/ui/FormKit";



const GREEN = "#1A7A3C";

// Mocks para os Modais de Busca
const FORNECEDORES_MOCK = [
  { id: 1, nome: "Distribuidora de Vacinas Alfa LTDA", cnpj: "12.345.678/0001-99" },
  { id: 2, nome: "Comercial Agropecuária Beta S/A", cnpj: "98.765.432/0001-11" },
];

const LABORATORIOS_MOCK = [
  { id: 1, nome: "Laboratório Biovet", codigo: "LAB-001" },
  { id: 2, nome: "Zoetis Indústria Química", codigo: "LAB-002" },
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Febre Aftosa", codigo: "D-01" },
  { id: 2, nome: "Brucelose", codigo: "D-02" },
  { id: 3, nome: "Raiva dos Herbívoros", codigo: "D-03" },
];

const REVENDEDORAS_MOCK = [
  { id: 1, nome: "Revendedora AgroPecuária Central", codigo: "3190987753" },
  { id: 2, nome: "Agro Comercial do Vale", codigo: "3190987753" },
];

const DESTINATARIOS_MOCK = [
  { id: 1, nome: "João da Silva Sauro", codigo: "123.456.789-00" },
  { id: 2, nome: "Fazenda Recanto Verde", codigo: "12.345.678/0001-90" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/70 hover:bg-gray-100/70 border-b border-gray-100 select-none text-left transition-colors"
      >
        <span className="text-sm font-bold text-gray-700">{title}</span>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}


function SimNao({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="flex gap-6 h-8 items-center">
        <CustomRadio label="Sim" name={name} value="Sim" checked={value === "Sim"} onChange={() => onChange("Sim")} />
        <CustomRadio label="Não" name={name} value="Não" checked={value === "Não"} onChange={() => onChange("Não")} />
      </div>
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }) {
  return (
    <div className={comDivisor ? "border-t border-gray-100 pt-6 mt-6" : ""}>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{titulo}</h3>
      {children}
    </div>
  );
}


interface AdicionarVendaVacinaProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}


interface DoseCategory {
  name: string;
  value: number;
  color: string;
}

interface BatchPanelData {
  batchNumber: string;
  expirationDate: string;
  totalDoses: number;
  totalFrascos: number;
  availableDoses: number;
  availableFrascos: number;
  categories: DoseCategory[];
}

const LEGEND_ITEMS = [
  { name: "Vencidas", color: "#ef4444" },
  { name: "Descartadas", color: "#9ca3af" },
  { name: "Partilhadas", color: "#3b82f6" },
  { name: "Utilizadas", color: "#f59e0b" },
  { name: "Disponíveis", color: "#22c55e" },
];

const EXPLORACOES_MOCK = [
  {
    id: 1,
    codigo: "420010400050001",
    estabelecimentoFormatado: "54001040005001 -\n Fazenda Vertentes",
    grupoEspecieFormatado: "Bovinos -\n Bovino",
    produtoresFormatado: "555.009.956-40 -\n  José Aarão Neto"
  },
  {
    id: 2,
    codigo: "420010400050002",
    estabelecimentoFormatado: "42001040005001 - \n Sitio Recanto",
    grupoEspecieFormatado: "Abelhas -\n Abelha com Ferrão",
    produtoresFormatado: "111.222.333-44 -\n Maria Carmo Souza "
  }
];

const BATCHES_MOCK: BatchPanelData[] = [
  {
    batchNumber: "006/19",
    expirationDate: "12/06/2026",
    totalDoses: 200,
    totalFrascos: 5,
    availableDoses: 100,
    availableFrascos: 5,
    categories: [
      { name: "Vencidas", value: 15, color: "#ef4444" },
      { name: "Descartadas", value: 10, color: "#9ca3af" },
      { name: "Partilhadas", value: 25, color: "#3b82f6" },
      { name: "Utilizadas", value: 50, color: "#f59e0b" },
      { name: "Disponíveis", value: 100, color: "#22c55e" },
    ],
  },
  {
    batchNumber: "007/19",
    expirationDate: "20/08/2026",
    totalDoses: 350,
    totalFrascos: 10,
    availableDoses: 280,
    availableFrascos: 8,
    categories: [
      { name: "Vencidas", value: 0, color: "#ef4444" },
      { name: "Descartadas", value: 5, color: "#9ca3af" },
      { name: "Partilhadas", value: 15, color: "#3b82f6" },
      { name: "Utilizadas", value: 50, color: "#f59e0b" },
      { name: "Disponíveis", value: 280, color: "#22c55e" },
    ],
  },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export function AdicionarPartilhaVacinaPage({ onLogout, onNavigate }: AdicionarVendaVacinaProps) {
  // Estados da Seção 1: Informações Básicas
  const [notaFiscal, setNotaFiscal] = useState("");

  const [codigoDestinatario, setCodigoDestinatario] = useState("");
  const [modalDestinatarioOpen, setModalDestinatarioOpen] = useState(false);
  const [modalDestinatarioRevendedoraOpen, setModalDestinatarioRevendedoraOpen] = useState(false);
  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>([]);
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  const [fornecedor, setFornecedor] = useState<any>(null);
  const [destinatario, setDestinatario] = useState<any>(null);


  // Estados adicionais para quando o destinatário for de FORA do estado (Inputs manuais)
  const [destinatarioFora, setDestinatarioFora] = useState("");
  const [codigoFora, setCodigoFora] = useState("");

  // Informações Adicionais
  const [previsaoUso, setPrevisaoUso] = useState("");
  const [exploracao, setExploracao] = useState<any[]>([
    { id: String(Date.now()), codigo: "", especie: "" }
  ]);
  const [receituario, setReceituario] = useState<any>("");
  const [modalRevendedoraOpen, setModalRevendedoraOpen] = useState(false);
  const [modalLaboratorioOpen, setModalLaboratorioOpen] = useState(false);
  const [modalDoencaOpen, setModalDoencaOpen] = useState(false);
  const [doencaExigeReceituario, setDoencaExigeReceituario] = useState<boolean>(false);

  // Sucesso
  const [isSucesso, setIsSucesso] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      notaFiscal,
      dataVenda,
      revendedora,
      tipoDestinatario,
      isDentroEstado,
      destinatario: isDentroEstado === "sim" ? destinatario : destinatarioFora,
      codigoDestinatario: isDentroEstado === "sim" ? codigoDestinatario : codigoFora,
      notasFiscaisOrigem,
      exploracao,
      receituario
    };
    console.log("Salvando venda de vacina:", payload);
    onNavigate("partilha-vacina");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="partilha-vacina" hideSearch={true} />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("partilha-vacina")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Doações/Partilhas de Vacina
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Doação/Partilha de Vacina</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 gap-4 items-center">
            <FornecedorInput
              label="Fornecedor"
              required
              value={fornecedor ? fornecedor.nome : ""}
              onChange={(ent: any) => {
                setFornecedor(ent);
                setNotasFiscaisOrigem([]);
              }}
              onEyeClick={() => onNavigate("visualizar-pessoa", fornecedor)}
            />

            <DestinatarioInput
              label="Destinatário"
              required
              value={destinatario ? destinatario.nome : ""}
              onChange={(ent: any) => setDestinatario(ent)}
              onEyeClick={() => onNavigate("visualizar-pessoa", destinatario)}
            />
          </div>
        </Section>

        {/* Seção 2: Nota Fiscal de Origem */}
        <Section title="Nota Fiscal">
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Saldo de doses</span>
                </div>

                {notasFiscaisOrigem.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                    <span className="text-[11px] font-semibold text-gray-500">DOSES PARTILHADAS:</span>
                    <span className="text-[11px] font-black text-[#1A7A3C]">
                      {notasFiscaisOrigem.reduce((sum, item) => sum + (item.quantidadeDoses || 0), 0)} doses
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                // 1. ISSO FAZ O BOTÃO FICAR TRAVADO SE NÃO HOUVER FORNECEDOR:
                disabled={!fornecedor}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalNotaOrigemOpen(true);
                }}
                // 2. ISSO MUDA A COR E O CURSOR DO BOTÃO AUTOMATICAMENTE:
                className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${fornecedor
                  ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer"
                  : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
              >
                <PlusCircle size={18} />
                Adicionar Saldo
              </button>
            </div>

            {/* CONDICIONAL 1: Sem fornecedor selecionado ainda */}
            {!fornecedor && (
              <div className="text-left py-4">
                <p className="text-xs text-gray-400 italic">É necessário selecionar um Fornecedor para pesquisar lotes.</p>
              </div>
            )}

            {/* CONDICIONAL 2: Fornecedor selecionado, mas nenhuma nota fiscal adicionada ainda */}
            {fornecedor && notasFiscaisOrigem.length === 0 && (
              <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                <p className="text-sm text-gray-400 italic">Nenhuma lote vinculado a esta partilha até o momento.</p>
              </div>
            )}

            {notasFiscaisOrigem.length > 0 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {Object.values(
                  notasFiscaisOrigem.reduce((acc: Record<string, any>, item) => {
                    if (!acc[item.nome]) {
                      acc[item.nome] = { nome: item.nome, partidas: [] };
                    }
                    acc[item.nome].partidas.push(item);
                    return acc;
                  }, {})
                ).map((grupo: any) => {
                  const isNotaMinimizada = notasListasMinimizadas[grupo.nome] || false;

                  return (
                    <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">

                      {/* Cabeçalho limpo com gatilho de minimizar a Nota Fiscal inteira */}
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none group/title"
                            onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                          >
                            <Package size={24} color={GREEN} />

                            <span className="text-sm font-bold text-gray-600 group-hover/title:text-gray-600 transition-colors">
                              Lote:
                            </span>

                            <span className="text-sm font-bold text-gray-800 group-hover/title:text-gray-600 transition-colors">
                              {grupo.nome}
                            </span>
                          </div>

                          {/* Tooltip com os detalhes do lote */}
                          <div className="relative group/info overflow-visible flex items-center">
                            <div className="relative cursor-help text-gray-400 hover:text-gray-600 transition z-20 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                              <div className="fixed inset-0 bg-black/15 hidden group-hover/info:block pointer-events-none z-[998] animate-fadeIn" />

                              {/* Popover Flutuante com os dados do lote */}
                              <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover/info:block animate-fadeIn z-[999] text-left overflow-hidden">
                                <div className="flex items-center gap-1.5 bg-gray-50 border-b border-gray-100 p-3">
                                  <Package size={13} className="text-gray-500" />
                                  <span className="text-[11px] font-extrabold text-gray-800">
                                    Nº de Partida:{" "}{grupo.nome}
                                  </span>                                </div>

                                <div className="p-3 flex flex-col gap-2 text-[11px] text-gray-500 bg-white">

                                  <div className="flex justify-between items-center gap-3">
                                    <span>Doença:</span>
                                    <span className="font-bold text-gray-700 text-right">
                                      {[...new Set(grupo.partidas.map((p: any) => p.doenca).filter(Boolean))].join(", ") || "—"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center gap-3">
                                    <span>Tipo de Vacina:</span>
                                    <span className="font-bold text-gray-700 text-right">
                                      {[...new Set(grupo.partidas.map((p: any) => p.tipoVacina).filter(Boolean))].join(", ") || "—"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center gap-3">
                                    <span>Laboratório:</span>
                                    <span className="font-bold text-gray-700 text-right">
                                      {[...new Set(grupo.partidas.map((p: any) => p.laboratorio).filter(Boolean))].join(", ") || "—"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center gap-3">
                                    <span>Validade:</span>
                                    <span className="font-bold text-gray-700 text-right">
                                      {[...new Set(grupo.partidas.map((p: any) => p.validade).filter(Boolean))].join(", ") || "—"}
                                    </span>
                                  </div>
                                </div>

                                {/* Rodapé destacado: total de doses do lote */}
                                <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                                  <span>Doses Totais Lote:</span>
                                  <span>
                                    {grupo.partidas.reduce(
                                      (soma: number, p: any) => soma + (p.dosesDisponiveisTotais || 0),
                                      0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>



                          {isNotaMinimizada && (
                            <span className="text-[11px] text-gray-400 font-medium normal-case">
                              ({grupo.partidas.length} {grupo.partidas.length === 1 ? 'partida oculta' : 'partidas ocultas'})
                            </span>
                          )}
                        </div>

                        {/* Lado Direito: Ações (Chevron para expandir/minimizar + Botão de Excluir) */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded transition hover:bg-gray-100"
                            title={isNotaMinimizada ? "Expandir" : "Minimizar"}
                          >
                            {isNotaMinimizada ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.nome !== grupo.nome));
                            }}
                            className="text-gray-400 hover:text-red-500 p-1 rounded transition hover:bg-red-50"
                            title="Remover Nota"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {!isNotaMinimizada && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-slideDown">
                          {grupo.partidas.map((nfItem: any) => {
                            const DOSES_POR_FRASCO = nfItem.dosesPerFrasco || 20;
                            const TOTAL_DISPONIVEL = nfItem.dosesDisponiveisTotais || 100;
                            const validadeLote = nfItem.validade || "20/12/2026";

                            const verificarVencimento = (dataStr: string) => {
                              if (!dataStr) return false;
                              const [dia, mes, ano] = dataStr.split("/").map(Number);
                              const dataValidade = new Date(ano, mes - 1, dia);
                              return dataValidade < new Date();
                            };
                            const isVencido = verificarVencimento(validadeLote);

                            const dadosGrafico = isVencido
                              ? [
                                { name: "Vencidas", value: TOTAL_DISPONIVEL, color: "#ef4444" },
                                { name: "Descartadas", value: 0, color: "#9ca3af" },
                                { name: "Partilhadas", value: 0, color: "#3b82f6" },
                                { name: "Utilizadas", value: 0, color: "#f59e0b" },
                                { name: "Disponíveis", value: 0, color: "#22c55e" },
                              ]
                              : [
                                { name: "Vencidas", value: 0, color: "#ef4444" },
                                { name: "Descartadas", value: 10, color: "#9ca3af" },
                                { name: "Partilhadas", value: 20, color: "#3b82f6" },
                                { name: "Utilizadas", value: 30, color: "#f59e0b" },
                                { name: "Disponíveis", value: TOTAL_DISPONIVEL >= 60 ? TOTAL_DISPONIVEL - 60 : 40, color: "#22c55e" },
                              ];

                            const estaAtivoNesteLote = graficoAtivo?.loteId === nfItem.id;
                            const fatiaAtiva = estaAtivoNesteLote ? dadosGrafico[graficoAtivo.index] : null;
                            const totalDosesGrafico = dadosGrafico.reduce((s, d) => s + d.value, 0);
                            const porcentagem = fatiaAtiva ? ((fatiaAtiva.value / totalDosesGrafico) * 100).toFixed(1) : null;

                            // Doses efetivamente disponíveis (o número que decide a partilha)
                            const DOSES_DISPONIVEIS = dadosGrafico.find(d => d.name === "Disponíveis")?.value ?? 0;
                            const FRASCOS_DISPONIVEIS = Math.floor(DOSES_DISPONIVEIS / DOSES_POR_FRASCO);

                            const isLoteMinimizado = lotesMinimizados[nfItem.id] || false;

                            return (
                              <div
                                key={`lote-${nfItem.id}`}
                                className={`border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto ${isLoteMinimizado ? "p-2.5 pb-2 justify-start" : "p-4 justify-between"
                                  }`}
                              >

                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                  <button
                                    type="button"
                                    onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteMinimizado }))}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition hover:bg-gray-100"
                                    title={isLoteMinimizado ? "Expandir Lote" : "Minimizar Lote"}
                                  >
                                    {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.id !== nfItem.id))}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition hover:bg-red-50"
                                    title="Remover Lote"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>

                                <div className={`flex items-center justify-between border-gray-100 overflow-visible pr-14 ${isLoteMinimizado ? "border-none pb-0 mb-0" : "border-b pb-2 mb-3"
                                  }`}>
                                  <div className="flex items-center gap-1.5 relative group/info overflow-visible">


                                    <span className="text-xs font-semibold text-gray-800 select-none">
                                      Apresentação
                                    </span>

                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                      <PillBottle size={10} className="text-gray-400" />
                                      {DOSES_POR_FRASCO} doses/frasco
                                    </span>

                                    {isLoteMinimizado && (
                                      <span className="text-[11px] text-gray-400 font-medium ml-2 animate-fadeIn">
                                        ({DOSES_DISPONIVEIS} disp. · {nfItem.quantidadeDoses || 0} partilhadas)
                                      </span>
                                    )}
                                  </div>


                                </div>

                                {!isLoteMinimizado && (
                                  <div className="animate-slideDown">
                                    <div className="flex items-center gap-4 z-10 mt-3">

                                      <div className="w-24 h-24 flex items-center justify-center relative select-none">
                                        <PieChart width={96} height={96} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                          <Pie
                                            data={dadosGrafico}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={26}
                                            outerRadius={35}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            activeIndex={estaAtivoNesteLote ? graficoAtivo.index : undefined}
                                            activeShape={renderActiveShape}
                                            onMouseEnter={(_, index) => setGraficoAtivo({ loteId: nfItem.id, index })}
                                            onMouseLeave={() => setGraficoAtivo(null)}
                                          >
                                            {dadosGrafico.map((entry, idx) => (
                                              <Cell
                                                key={`cell-${idx}`}
                                                fill={entry.color}
                                                className="cursor-pointer transition-all duration-200 outline-none"
                                              />
                                            ))}
                                          </Pie>
                                        </PieChart>

                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                          {fatiaAtiva ? (
                                            <div className="flex flex-col items-center justify-center">
                                              <span className="text-xs font-bold leading-none animate-fadeIn" style={{ color: fatiaAtiva.color }}>
                                                {fatiaAtiva.value}
                                              </span>
                                              <span className="text-[7px] text-gray-500 font-semibold leading-tight uppercase truncate max-w-[50px] mt-0.5 animate-fadeIn">
                                                {fatiaAtiva.name}
                                              </span>
                                              <span className="text-[8px] font-bold mt-0.5 animate-fadeIn" style={{ color: fatiaAtiva.color }}>
                                                {porcentagem}%
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center justify-center">
                                              <span className="text-base font-black text-gray-800 leading-none">
                                                {DOSES_DISPONIVEIS}
                                              </span>
                                              <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                                Disponíveis
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-2 flex-1 justify-start items-stretch">

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-gray-50/80 justify-between">
                                          <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>

                                          <div className="flex gap-2 items-end justify-center py-0.5">
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">
                                                {FRASCOS_DISPONIVEIS}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Frascos</span>
                                            </div>
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">
                                                {DOSES_DISPONIVEIS}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Doses</span>
                                            </div>
                                          </div>

                                          <p className="text-[8px] text-gray-400 text-center leading-none mt-0.5">
                                          </p>
                                        </div>

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-white justify-between">
                                          <span className="text-[11px] text-gray-500 font-medium text-center">Partilhadas</span>

                                          <div className="flex gap-1.5 items-end justify-center">
                                            <div className="flex flex-col flex-1 min-w-[40px]">
                                              <input
                                                type="number"
                                                min="0"
                                                value={nfItem.quantidadeFrascos || ""}
                                                placeholder="0"
                                                onChange={(e) => {
                                                  const f = Number(e.target.value);
                                                  const d = f * DOSES_POR_FRASCO;
                                                  setNotasFiscaisOrigem(notasFiscaisOrigem.map(item =>
                                                    item.id === nfItem.id ? { ...item, quantidadeDoses: d, quantidadeFrascos: f } : item
                                                  ));
                                                }}
                                                className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                              <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                            </div>

                                            <div className="flex flex-col flex-1 min-w-[40px]">
                                              <input
                                                type="number"
                                                min="0"
                                                value={nfItem.quantidadeDoses || ""}
                                                placeholder="0"
                                                onChange={(e) => {
                                                  const d = Number(e.target.value);
                                                  const f = Math.ceil(d / DOSES_POR_FRASCO);
                                                  setNotasFiscaisOrigem(notasFiscaisOrigem.map(item =>
                                                    item.id === nfItem.id ? { ...item, quantidadeDoses: d, quantidadeFrascos: f } : item
                                                  ));
                                                }}
                                                className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                              <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Doses</span>
                                            </div>
                                          </div>
                                          <p className="text-[8px] text-gray-400 text-center leading-none mt-0.5"></p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px] z-10">
                                      {dadosGrafico
                                        .filter((item) => item.name !== "Disponíveis")
                                        .map((item) => (
                                          <div key={item.name} className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-gray-400 font-medium">{item.name}:</span>
                                            <span className="font-bold text-gray-600">{item.value}</span>
                                          </div>
                                        ))}

                                      <div className="flex flex-col items-end gap-0.5 px-1 py-0.5 ml-auto">
                                        <div className="flex items-center gap-1">
                                          <span className="text-gray-400 font-medium">Total de doses:</span>
                                          <span className="font-bold text-gray-600">{totalDosesGrafico}</span>
                                        </div>

                                      </div>
                                    </div>
                                  </div>


                                )}

                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </Section>

        {/* ====== Coleta de Informações Adicionais ====== */}
        <Section title="Informações Adicionais">
          <div className="flex flex-col gap-5">





            {/* 2. Pergunta de Previsão de Uso */}
            <SimNao
              label="Possui previsão de uso das vacinas em explorações pecuárias específicas?"
              name="previsao-uso"
              required
              value={previsaoUso}
              onChange={(v) => {
                setPrevisaoUso(v);
                if (v !== "Sim") {
                  setExploracao("");
                }
              }}
            />

            {/* 3. Campo Único de Exploração Pecuária (Condicional via DynamicListWrapper) */}
            {previsaoUso === "Sim" && (
              <div className="w-full animate-fadeIn">
                <DynamicListWrapper
                  title="Explorações Pecuárias Vinculadas"
                  items={exploracao}
                  addButtonLabel="Adicionar Exploração"
                  behavior="at-least-one" // Ou "at-least-one" caso queira travar pelo menos uma linha aberta

                  onAddItem={() => {
                    setExploracao([
                      ...exploracao,
                      { id: String(Date.now() + Math.random()), codigo: "", especie: "" }
                    ]);
                  }}
                  onRemoveItem={(indexToRemove) => {
                    setExploracao(exploracao.filter((_, idx) => idx !== indexToRemove));
                  }}
                  variant="plain"
                  showCounter={true}
                >
                  {(item, index) => (
                    <ExploracaoPecuariaInput
                      // Tratamento seguro para extrair o valor primitivo (string)
                      value={typeof item === "object" ? item?.codigo : item || ""}
                      required
                      onChange={(entidadeSelecionada) => {
                        // Atualiza cirurgicamente apenas o item modificado dentro da lista do Wrapper
                        const novasExploracoes = [...exploracao];
                        novasExploracoes[index] = {
                          ...novasExploracoes[index],
                          codigo: entidadeSelecionada.codigo || "",
                          especie: entidadeSelecionada.especie || ""
                        };
                        setExploracao(novasExploracoes);
                      }}
                      onEyeClick={() => {
                        const codigoAtual = typeof item === "object" ? item?.codigo : item;
                        if (codigoAtual) {
                          alert(`Visualizar detalhes da exploração: ${codigoAtual}`);
                        } else {
                          alert("Por favor, digite ou selecione uma exploração primeiro.");
                        }
                      }}
                    />
                  )}
                </DynamicListWrapper>
              </div>
            )}

          </div>
        </Section>


      </main>

      {/* Modais de Busca */}
      <SearchModal
        open={modalLaboratorioOpen}
        onClose={() => setModalLaboratorioOpen(false)}
        title="Buscar Laboratório"
        subtitle="Busque por um laboratório para o cadastro:"
        icon={<FlaskConical size={26} color={GREEN} />}
        data={LABORATORIOS_MOCK}
        searchKeys={["nome", "codigo"]}
        searchPlaceholder="Busque por nome do laboratório..."
        columns={[{ label: "Nome", key: "nome" }, { label: "Código", key: "codigo" }]}
        onConfirm={() => setModalLaboratorioOpen(false)}
      />

      <SearchModal
        open={modalDoencaOpen}
        onClose={() => setModalDoencaOpen(false)}
        title="Buscar Doença"
        subtitle="Busque por uma doença para o cadastro:"
        icon={<img src={iconeDoencaUrl} alt="Doença" className="w-6 h-6 object-contain" />}
        data={DOENCAS_MOCK}
        searchKeys={["nome"]}
        searchPlaceholder="Busque pela doença..."
        columns={[{ label: "Nome da Doença", key: "nome" }, { label: "Código", key: "codigo" }]}
        onConfirm={() => setModalDoencaOpen(false)}
      />

      <SearchModal
        open={modalRevendedoraOpen}
        onClose={() => setModalRevendedoraOpen(false)}
        title="Buscar Revendedora"
        subtitle="Busque por uma revendedora de produtos agropecuários fornecedora para o cadastro:"
        icon={<Store size={26} color={GREEN} />}
        data={REVENDEDORAS_MOCK}
        searchKeys={["nome", "codigo"]}
        searchPlaceholder="Busque por nome ou código:"
        columns={[
          { label: "Nome", key: "nome" },
          { label: "Código", key: "codigo" }
        ]}
        onConfirm={(item) => {
          setRevendedora(item.nome);
          setCnpjRevendedora(item.codigo);
          setModalRevendedoraOpen(false);
        }}
      />

      <SearchModal
        open={modalDestinatarioRevendedoraOpen}
        onClose={() => setModalDestinatarioRevendedoraOpen(false)}
        title="Buscar Destinatário"
        subtitle="Busque por uma revendedora de produtos agropecuários destinatária para o cadastro:"
        icon={<img src={iconeDestinatarioUrl} alt="Destinatário" className="w-6 h-6 object-contain" />}
        data={REVENDEDORAS_MOCK}
        searchKeys={["nome", "codigo"]}
        searchPlaceholder="Busque por nome ou código."
        columns={[
          { label: "Nome", key: "nome" },
          { label: "Código", key: "codigo" }
        ]}
        onConfirm={(item) => {
          setDestinatario(item.nome);
          setCodigoDestinatario(item.codigo);
          setModalDestinatarioRevendedoraOpen(false);
        }}
      />

      <SearchModal
        open={modalDestinatarioOpen}
        onClose={() => setModalDestinatarioOpen(false)}
        title="Buscar Destinatário"
        subtitle="Buscar destinatário para o cadastro:"
        icon={<img src={iconeDestinatarioUrl} alt="Destinatário" className="w-6 h-6 object-contain" />}
        data={DESTINATARIOS_MOCK}
        searchKeys={["nome", "codigo"]}
        searchPlaceholder="Busque por nome/razão social ou CPF/CNPJ."
        columns={[
          { label: "Nome / Razão Social", key: "nome" },
          { label: "CPF / CNPJ", key: "codigo" }
        ]}
        onConfirm={(item) => {
          setDestinatario(item.nome);
          setCodigoDestinatario(item.codigo);
          setModalDestinatarioOpen(false);
        }}
      />

      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacinas"
        subtitle="Selecione os lotes de vacina desejados para vincular a esta partilhada:"
        icon={<Package size={24} color={GREEN} />}
        /* Dados continuam os mesmos */
        data={[
          { id: 1, nome: "0013225/24", partida: "1", uf: "MG", dosesDisponiveisTotais: 120, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", exigeReceituario: true, tipoVacina: "B19", laboratorio: "BioMed/MG", validade: "20/12/2026" },
          { id: 2, nome: "0013225/24", partida: "2", uf: "MG", dosesDisponiveisTotais: 80, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", exigeReceituario: true, tipoVacina: "Oleosa", laboratorio: "BioMed/MG", validade: "20/12/2026" },
          { id: 3, nome: "0014589/24", partida: "1", uf: "SP", dosesDisponiveisTotais: 250, fornecedor: "Comercial Agropecuária Beta S/A", doenca: "Raiva dos Herbívoros", exigeReceituario: false, tipoVacina: "Inativada", laboratorio: "Zoetis", validade: "15/08/2027" },
          { id: 4, nome: "0014589/24", partida: "1", uf: "GO", dosesDisponiveisTotais: 50, fornecedor: "Laboratório Biovet Saúde Animal", doenca: "Raiva dos Herbívoros", exigeReceituario: true, tipoVacina: "B19", laboratorio: "Biovet", validade: "15/08/2027" }
        ]}

        searchKeys={["nome", "partida", "fornecedor", "uf"]}
        searchPlaceholder="Busque por lote."

        /* ALTERADO: Substituída a coluna de Partida pela de Saldo da Apresentação */
        columns={[
          { label: "Lote/ Nº de Partida", key: "nome" },
          { label: "Saldo da Apresentação", key: "dosesDisponiveisTotais" }, // <-- Mudança aqui
          { label: "UF", key: "uf" }
        ]}

        selectedItems={notasFiscaisOrigem}
        onConfirm={(selectedValues) => {
          setNotasFiscaisOrigem(selectedValues);
        }}
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Núcleo de Produção adicionado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O núcleo foi adicionado como um novo Núcleo de Produção.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("venda-saida-vacina"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("venda-saida-vacina");
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}