import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, PlusCircle, FileText, Trash2, Package } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, MultiSearchModal } from "../../../components/ui/FormKit";
// Inputs de DOMÍNIO. RevendedoraInput: DomainInputProps (encapsula o SearchModal da revendedora).
import { RevendedoraInput, SelectedChipsContainer } from "../../../components/ui/EntitySearch";
import { PieChart, Pie, Cell, Sector } from "recharts";

import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS
// ==========================================================
// Notas fiscais por revendedora (codigo). Cada nota possui um ou mais lotes/partidas,
// e cada partida traz dados somente-leitura herdados do cadastro de entrada.
const NOTAS_FISCAIS_MOCK = [
  {
    id: "nf-1", numero: "28568", revendedoraCodigo: "3120938028", uf: "Minas Gerais",
    partidas: [
      { id: "pt-1", numeroPartida: "006/19", validade: "03/2025", laboratorio: "Laboratório BioMed", doenca: "Brucelose", tipoVacina: "B19", dosesDisponiveis: "10" },
      { id: "pt-2", numeroPartida: "007/19", validade: "05/2025", laboratorio: "Laboratório BioMed", doenca: "Brucelose", tipoVacina: "RB51", dosesDisponiveis: "25" },
    ],
  },
  {
    id: "nf-2", numero: "1234567", revendedoraCodigo: "3120938028", uf: "Minas Gerais",
    partidas: [
      { id: "pt-3", numeroPartida: "025/24", validade: "12/2026", laboratorio: "Vacinas Imunotech", doenca: "Febre Aftosa", tipoVacina: "O1 Campos", dosesDisponiveis: "100" },
    ],
  },
  {
    id: "nf-3", numero: "7654321", revendedoraCodigo: "3120938045", uf: "Minas Gerais",
    partidas: [
      { id: "pt-4", numeroPartida: "100/24", validade: "01/2027", laboratorio: "ImunoVet Biológicos", doenca: "Raiva", tipoVacina: "", dosesDisponiveis: "40" },
    ],
  },
];

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;



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






// ==========================================================
// HELPERS DE UI
// ==========================================================

const Campo = ({ label, value, className = "" }: { label: string; value?: string; className?: string }) => (
  <FloatInput label={label} value={value ?? "—"} onChange={() => { }} disabled className={className} />
);

// ==========================================================
// PÁGINA: ADICIONAR LANÇAMENTO DE DOSES DE VACINA (US0V7 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarLancamentoDosesVacinaPage({ onLogout, onNavigate }: PageProps) {
  const [revendedora, setRevendedora] = useState<any | null>(null);
  const [notasSelecionadas, setNotasSelecionadas] = useState<any[]>([]); // notas inteiras selecionadas
  const [modalNota, setModalNota] = useState(false);
  // valores editáveis por partida: { [partidaId]: { dosesLancadas, justificativa } }
  const [lancamentos, setLancamentos] = useState<Record<string, { dosesLancadas: string; justificativa: string }>>({});
  const [isSucesso, setIsSucesso] = useState(false);
  // Estados da Seção 1: Informações Básicas
  const [notaFiscal, setNotaFiscal] = useState("");

  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>([]);
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});






  // Notas pré-filtradas pela revendedora selecionada
  const notasDisponiveis = revendedora
    ? NOTAS_FISCAIS_MOCK.filter((n) => n.revendedoraCodigo === revendedora.codigo)
    : [];

  const setLancamento = (partidaId: string, patch: Partial<{ dosesLancadas: string; justificativa: string }>) =>
    setLancamentos((prev) => ({ ...prev, [partidaId]: { dosesLancadas: "", justificativa: "", ...prev[partidaId], ...patch } }));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("lancamento-doses-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos Ajustes de Doses de Vacina
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Ajuste de Doses de Vacina</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>

        </div>


        {/* 🔥 ALERTA CORRIGIDO: Adicionado mb-6 para dar respiro até a próxima seção */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          {/* Ícone de Informação Azul/Cinza Discreto */}
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>

          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-3">
            <RevendedoraInput
              value={revendedora ? revendedora.codigo : ""}
              required
              onChange={(entidadeSelecionada) => setRevendedora(entidadeSelecionada)}
              onEyeClick={() => {
                if (revendedora?.codigo) alert(`Visualizar detalhes: ${revendedora.codigo}`);
                else alert("Por favor, digite ou selecione uma revendedora primeiro.");
              }}
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
                    <span className="text-[11px] font-semibold text-gray-500">DOSES LANÇADAS:</span>
                    <span className="text-[11px] font-black text-[#1A7A3C]">
                      {notasFiscaisOrigem.reduce((sum, item) => sum + (item.quantidadeDoses || 0), 0)} doses
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!revendedora}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalNotaOrigemOpen(true);
                }}
                className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${revendedora
                  ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer"
                  : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
              >
                <PlusCircle size={18} />
                Adicionar Saldo
              </button>
            </div>

            {/* CONDICIONAL 1: Sem fornecedor selecionado ainda */}
            {!revendedora && (
              <div className="text-left py-4">
                <p className="text-xs text-gray-400 italic">É necessário selecionar uma Revendedora para pesquisar notas fiscais.</p>
              </div>
            )}

            {/* CONDICIONAL 2: Fornecedor selecionado, mas nenhuma nota fiscal adicionada ainda */}
            {revendedora && notasFiscaisOrigem.length === 0 && (
              <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                <p className="text-sm text-gray-400 italic">Nenhum lote vinculado a este lançamento até o momento.</p>
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
                  const lotePrincipal = grupo.partidas[0];
                  const numeroLote = String(grupo.nome).replace(/^Lote:\s*/i, "");
                  const dosesTotaisLote = grupo.partidas.reduce(
                    (total: number, partida: any) => total + Number(partida.dosesDisponiveisTotais || 0),
                    0,
                  );

                  return (
                    <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">

                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2 select-none">
                          <Package size={24} color={GREEN} />

                          <span className="text-sm font-bold text-gray-800">Lote: {numeroLote}</span>

                          <div className="relative group/lote-info flex-shrink-0 z-20">
                            <Info size={14} className="text-gray-400 cursor-help" />
                            <div className="fixed inset-0 bg-black/15 hidden group-hover/lote-info:block pointer-events-none z-[998] animate-fadeIn" />
                            <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl hidden group-hover/lote-info:block animate-fadeIn z-[999] text-left overflow-hidden">
                              <div className="flex items-center gap-1.5 border-b border-gray-100 p-3">
                                <Package size={13} className="text-gray-500" />
                                <span className="text-[11px] font-extrabold text-gray-800">Nº de Partida: {numeroLote}</span>
                              </div>
                              <div className="p-3 flex flex-col gap-2.5 text-[11px] text-gray-500 bg-white">
                                <div className="flex justify-between items-center gap-3">
                                  <span>Doença:</span>
                                  <span className="font-bold text-gray-700 text-right">{lotePrincipal?.doenca || "—"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Tipo de Vacina:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.tipoVacina || "B19"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Laboratório:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.laboratorio || "Biovet"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Validade:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.validade || "15/08/2027"}</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                                <span>Doses Totais Lote:</span>
                                <span>{dosesTotaisLote}</span>
                              </div>
                            </div>
                          </div>

                          {isNotaMinimizada && (
                            <span className="text-[11px] text-gray-400 font-medium normal-case">
                              ({grupo.partidas.length} {grupo.partidas.length === 1 ? 'partida oculta' : 'partidas ocultas'})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded transition hover:bg-gray-100"
                            title={isNotaMinimizada ? "Expandir lote" : "Minimizar lote"}
                          >
                            {isNotaMinimizada ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.nome !== grupo.nome));
                            }}
                            className="text-red-500 hover:text-red-600 p-1 rounded transition hover:bg-red-50"
                            title="Remover lote"
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

                            // Doses efetivamente disponíveis (o número que decide o lançamento)
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
                                  <div className="flex items-center gap-2 overflow-visible">
                                    <span className="text-xs font-semibold text-gray-800 select-none">
                                      Apresentação
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                                      <Package size={10} /> {DOSES_POR_FRASCO} doses/frasco
                                    </span>

                                    {isLoteMinimizado && (
                                      <span className="text-[11px] text-gray-400 font-medium ml-2 animate-fadeIn">
                                        ({DOSES_DISPONIVEIS} disp. · {nfItem.quantidadeDoses || 0} lançadas)
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
                                                {totalDosesGrafico}
                                              </span>
                                              <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                                Total
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

                                        </div>

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-white justify-between">
                                          <span className="text-[11px] text-gray-500 font-medium text-center">Lançadas <span className="text-red-500">*</span></span>

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

                                    {/* NOVO: Campo de Justificativa por lote/partida */}
                                    {/* NOVO: Campo de Justificativa com Título Fixo Interno (Dentro do Quadrado) */}
                                    <div className="w-full mt-4 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex flex-col justify-center text-left focus-within:border-[#1A7A3C] shadow-sm transition-colors">

                                      {/* Título fixo no topo interno do quadrado */}
                                      <span className="text-[10px] font-regular text-gray-500 select-none tracking-wide mb-0.5">
                                        Justificativa
                                      </span>

                                      {/* Input sem bordas e transparente preenchendo o restante do espaço */}
                                      <input
                                        type="text"
                                        placeholder="Digite aqui o motivo deste lançamento (ex: quebra de frasco, partilha, etc.)"
                                        value={lancamentos[nfItem.id]?.justificativa || ""}
                                        onChange={(e) => {
                                          setLancamentos(prev => ({
                                            ...prev,
                                            [nfItem.id]: {
                                              dosesLancadas: String(nfItem.quantidadeDoses || 0),
                                              justificativa: e.target.value
                                            }
                                          }));
                                        }}
                                        className="w-full bg-transparent border-none text-xs p-0 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-300 h-5"
                                      />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px] z-10">
                                      {dadosGrafico.map((item) => (
                                          <div key={item.name} className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-gray-400 font-medium">{item.name}:</span>
                                            <span className="font-bold text-gray-600">{item.value}</span>
                                          </div>
                                        ))}
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

      </main>

      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacinas"
        subtitle="Selecione os lotes de vacina desejados para vincular a este ajuste:"
        icon={<Package size={24} color={GREEN} />}
        /* Dados continuam os mesmos */
        data={[
          { id: 1, nome: "Lote: 0013225/24", partida: "1", uf: "MG", dosesDisponiveisTotais: 120, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", exigeReceituario: true },
          { id: 2, nome: "Lote: 0013225/24", partida: "2", uf: "MG", dosesDisponiveisTotais: 80, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Febre Aftosa", exigeReceituario: true },
          { id: 3, nome: "Lote: 0014589/24", partida: "1", uf: "SP", dosesDisponiveisTotais: 250, fornecedor: "Comercial Agropecuária Beta S/A", doenca: "Raiva dos Herbívoros", exigeReceituario: false },
          { id: 4, nome: "Lote: 0014589/24", partida: "1", uf: "GO", dosesDisponiveisTotais: 50, fornecedor: "Laboratório Biovet Saúde Animal", doenca: "Brucelose", exigeReceituario: true }
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
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Lançamento de doses adicionado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">O registro foi gravado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("lancamento-doses-vacina"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-lancamento-doses-vacina"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
