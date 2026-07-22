import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, PlusCircle, FileText, Trash2, Package, PillBottle } from "lucide-react";
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
                    <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Package size={24} color={GREEN} />
                          <span className="text-sm font-bold text-gray-800">Lote: {numeroLote}</span>
                          {isNotaMinimizada && (
                            <span className="text-[11px] text-gray-400">
                              ({grupo.partidas.length} {grupo.partidas.length === 1 ? "partida oculta" : "partidas ocultas"})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setNotasListasMinimizadas((prev) => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title={isNotaMinimizada ? "Expandir lote" : "Minimizar lote"}
                          >
                            {isNotaMinimizada ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setNotasFiscaisOrigem(notasFiscaisOrigem.filter((item) => item.nome !== grupo.nome))}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                            title="Remover lote"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {!isNotaMinimizada && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {grupo.partidas.map((nfItem: any) => {
                            const dosesPorFrasco = nfItem.dosesPerFrasco || 20;
                            const dosesDisponiveis = nfItem.dosesDisponiveisTotais || 0;
                            return (
                              <div key={nfItem.id} className="border border-gray-200 rounded-xl bg-white p-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                                  <span className="text-xs font-semibold text-gray-800">Apresentação</span>
                                  <span className="text-[10px] font-semibold text-gray-600">{dosesPorFrasco} doses/frasco</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                                    <span className="block text-[11px] text-gray-500">Disponíveis</span>
                                    <strong className="block text-sm text-gray-700">{dosesDisponiveis}</strong>
                                    <span className="text-[9px] text-gray-400">Doses</span>
                                  </div>
                                  <div className="rounded-lg border border-gray-200 p-3">
                                    <span className="block text-[11px] text-gray-500 text-center">Lançadas <span className="text-red-500">*</span></span>
                                    <div className="mt-1 flex gap-2">
                                      <input
                                        type="number"
                                        min="0"
                                        value={nfItem.quantidadeFrascos || ""}
                                        onChange={(event) => {
                                          const frascos = Number(event.target.value);
                                          setNotasFiscaisOrigem(notasFiscaisOrigem.map((item) => item.id === nfItem.id ? { ...item, quantidadeFrascos: frascos, quantidadeDoses: frascos * dosesPorFrasco } : item));
                                        }}
                                        className="w-full border border-gray-200 rounded p-1 text-center text-xs"
                                        aria-label="Frascos lançados"
                                      />
                                      <input
                                        type="number"
                                        min="0"
                                        value={nfItem.quantidadeDoses || ""}
                                        onChange={(event) => {
                                          const doses = Number(event.target.value);
                                          setNotasFiscaisOrigem(notasFiscaisOrigem.map((item) => item.id === nfItem.id ? { ...item, quantidadeDoses: doses, quantidadeFrascos: Math.ceil(doses / dosesPorFrasco) } : item));
                                        }}
                                        className="w-full border border-gray-200 rounded p-1 text-center text-xs"
                                        aria-label="Doses lançadas"
                                      />
                                    </div>
                                    <div className="mt-1 flex justify-between text-[9px] text-gray-400"><span>Frascos</span><span>Doses</span></div>
                                  </div>
                                </div>
                                <label className="mt-4 block text-[10px] text-gray-500">
                                  Justificativa <span className="text-red-500">*</span>
                                  <input
                                    type="text"
                                    value={lancamentos[nfItem.id]?.justificativa || ""}
                                    onChange={(event) => setLancamentos((prev) => ({
                                      ...prev,
                                      [nfItem.id]: { dosesLancadas: String(nfItem.quantidadeDoses || 0), justificativa: event.target.value },
                                    }))}
                                    className="mt-1 w-full border border-gray-200 rounded p-2 text-xs text-gray-800"
                                  />
                                </label>
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
