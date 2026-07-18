import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Syringe,
  ReceiptText,
  CheckCircle2,
  Info,
  Calendar,
  FlaskConical, PlusCircle, ChevronUp, ChevronDown, Trash2, Receipt, Store, Check, RotateCcw, Package
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SearchModal, CustomRadio, MultiSearchModal } from "../../../components/ui/FormKit";
import {
  EntitySearchInput,
  DynamicListWrapper,
  VacinadorBruceloseInput,
  MedicoVeterinarioInput,
  NucleoInput,
  EstabelecimentoAgropecuarioInput,
  ProdutorInput,
  ExploracaoPecuariaInput,

} from "../../../components/ui/EntitySearch";
import { PieChart, Pie, Cell, Sector } from "recharts";
import iconeNotaFiscalUrl from "../../../imports/icons/Ícone=Nota Fiscal.png";


import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE COM IDS ÚNICOS
// ==========================================================
interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
];

const LABORATORIOS_MOCK = [
  { id: 1, nome: "Laboratório Biovet" },
  { id: 2, nome: "Boehringer Ingelheim" },
  { id: 3, nome: "Zoetis" },
  { id: 4, nome: "MSD Saúde Animal" },
];

const ESTABELECIMENTOS_MOCK = [
  { id: 1, produtorId: 1, codigo: "31234567891", nome: "Fazenda do Rio", municipio: "Lavras", proprietario: "555.009.956-40\n-\nJosé Aarão Neto" },
  { id: 2, produtorId: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Varginha", proprietario: "444.009.956-40\n-\nDivino de Souza Sobrinho" },
];

const REVENDEDORAS_MOCK = [
  { id: 1, nome: "Comercial AgroVet", documento: "12.345.678/0001-90" },
  { id: 2, nome: "AgroInsumos Sul", documento: "98.765.432/0001-10" },
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


const GRUPOS_COM_NUCLEO = ["Abelhas", "Aves", "Suídeos"];

const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, nome: "Febre Aftosa", tiposVacina: [] },
  { id: 3, nome: "Raiva", tiposVacina: [] },
];

const VACINADORES_MOCK = [
  { id: 1, vetId: 1, nome: "Pedro Alves", documento: "222.114.558-70" },
  { id: 2, vetId: 2, nome: "Carla Menezes", documento: "111.998.775-30" },
];
const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];


const NOTAS_FISCAIS_MOCK = [
  { id: 1, numero: "28568", revendedoraId: 1 },
  { id: 2, numero: "28570", revendedoraId: 1 },
  { id: 3, numero: "31001", revendedoraId: 2 },
];

interface FaixaRebanho {
  faixa: string;
  machoExistentes: number;
  femeaExistentes: number;
}
const FAIXAS_MOCK: FaixaRebanho[] = [
  { faixa: "De 0 a 12 meses", machoExistentes: 10, femeaExistentes: 12 },
  { faixa: "De 13 a 24 meses", machoExistentes: 8, femeaExistentes: 9 },
  { faixa: "Acima de 24 meses", machoExistentes: 15, femeaExistentes: 20 },
];

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
function Stepper({ value, onChange, accentColor, max }: { value: number; onChange: (v: number) => void; accentColor: string; max?: number }) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return onChange(0);
    if (max !== undefined && val > max) return onChange(max);
    if (val < 0) return onChange(0);
    onChange(val);
  };
  return (
    <div className="inline-flex items-center h-8 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] overflow-hidden select-none">
      <button
        aria-label="Diminuir"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] active:bg-[#e2e8f0] transition-colors text-[16px] font-medium leading-none border-r border-[#e2e8f0]/60"
      >
        −
      </button>
      <input
        type="number"
        aria-label="Quantidade vacinada"
        value={value}
        onChange={handleInputChange}
        className="w-12 h-full text-center text-[14px] font-bold tabular-nums bg-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ color: accentColor }}
      />
      <button
        aria-label="Aumentar"
        onClick={() => { if (max !== undefined && value >= max) return; onChange(value + 1); }}
        disabled={max !== undefined && value >= max}
        className="w-8 h-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] active:bg-[#e2e8f0] transition-colors text-[16px] font-medium leading-none border-l border-[#e2e8f0]/60 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
function SummaryCards({ disponiveis, utilizadas, saldo }: { disponiveis: number; utilizadas: number; saldo: number }) {
  return (
    <div className="flex flex-col sm:flex-row border border-[#e0e0e0] rounded-xl overflow-hidden bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#e0e0e0]">
      <div className="flex-1 px-6 py-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
            <Syringe size={13} className="text-[#008446]" strokeWidth={2.5} />
          </div>
          <span className="text-[12px] text-[#5f6368]">Doses disponíveis</span>
        </div>
        <p className="text-[28px] font-bold text-[#1d1d1f] leading-none tabular-nums">{disponiveis}</p>
      </div>

      <div className="flex-1 px-6 py-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-[#fff7ed] border border-[#fed7aa] flex items-center justify-center shrink-0">
            <span className="text-[#ea580c] text-[14px] font-bold leading-none">−</span>
          </div>
          <span className="text-[12px] text-[#5f6368]">Doses utilizadas</span>
        </div>
        <p className="text-[28px] font-bold text-[#1d1d1f] leading-none tabular-nums">{utilizadas}</p>
      </div>

      <div className="flex-1 px-6 py-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
            <Check size={12} className="text-[#008446]" strokeWidth={3} />
          </div>
          <span className="text-[12px] text-[#5f6368]">Saldo Restante</span>
        </div>
        <p className={`text-[28px] font-bold leading-none tabular-nums ${saldo < 0 ? "text-red-600" : "text-[#1d1d1f]"}`}>
          {saldo}
        </p>
      </div>
    </div>
  );
}
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



const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

function DonutChart({ data, size = 110 }: { data: DoseCategory[]; size?: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const active = activeIndex !== null ? data[activeIndex] : null;
  const pct = active ? ((active.value / total) * 100).toFixed(1) : null;

  const onEnter = useCallback((_: unknown, i: number) => setActiveIndex(i), []);
  const onLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <div className="relative flex-shrink-0 select-none" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          // Ajustado proporcionalmente para caber o anel de destaque externo dentro da área demarcada
          innerRadius={Math.round(size * 0.26)}
          outerRadius={Math.round(size * 0.36)}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          paddingAngle={2}
          activeIndex={activeIndex ?? undefined}
          activeShape={(props: Record<string, unknown>) => {
            const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
              cx: number; cy: number; innerRadius: number; outerRadius: number;
              startAngle: number; endAngle: number; fill: string;
            };
            return (
              <g>
                {/* Fatia Principal com Opacidade Total */}
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                />
                {/* Arco de Destaque Externo Espelhado da sua Imagem */}
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={outerRadius + 2}
                  outerRadius={outerRadius + 5}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                  opacity={0.8}
                />
              </g>
            );
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          stroke="none"
        >
          {data.map((e, i) => (
            <Cell
              key={i}
              fill={e.color}
              className="cursor-pointer transition-all duration-200 outline-none"
            />
          ))}
        </Pie>
      </PieChart>

      {/* Miolo Central Dinâmico e Responsivo ao Hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[1px]">
        {active ? (
          <>
            <span className="text-xs font-black leading-none animate-fadeIn" style={{ color: active.color }}>
              {active.value}
            </span>
            <span className="text-[7px] text-gray-400 font-extrabold mt-0.5 uppercase tracking-wider text-center max-w-[50px] truncate leading-none animate-fadeIn">
              {active.name}
            </span>
            <span className="text-[7px] font-bold mt-0.5 leading-none animate-fadeIn" style={{ color: active.color }}>
              {pct}%
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-black text-gray-800 leading-none">
              {total}
            </span>
            <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
              Total
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function SegmentToggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="inline-flex rounded-md border p-1 gap-1 bg-gray-50"
      role="radiogroup"
      aria-label="Regime de vacinação"
      style={{ borderColor: "#E5E7EB" }}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className="px-4 py-2 text-sm font-medium rounded transition"
            style={{
              backgroundColor: active ? GREEN : "transparent",
              color: active ? "#fff" : "#4B5563",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Faixa etária dinâmica: label + existentes/nãoVacinados por gênero.
// As regras por doença/regime decidem quais faixas e quais gêneros aparecem.
interface FaixaLinha {
  label: string;
  machos: { existentes: number; naoVacinados: number };
  femeas: { existentes: number; naoVacinados: number };
}

function VaccinationTable({
  faixas,
  mostrarMachos,
  mostrarFemeas,
  statusLabel,
  vacinados,
  onChange,
  onReset,
}: {
  faixas: FaixaLinha[];
  mostrarMachos: boolean;
  mostrarFemeas: boolean;
  statusLabel: string; // "Não Vacinados" | "Já Vacinados" (conforme regime)
  vacinados: VacinadosRow[];
  onChange: (i: number, g: "machos" | "femeas", v: number) => void;
  onReset: () => void;
}) {
  const totalMachosExist = faixas.reduce((s, r) => s + r.machos.existentes, 0);
  const totalMachosNaoVac = faixas.reduce((s, r) => s + r.machos.naoVacinados, 0);
  const totalFemeaExist = faixas.reduce((s, r) => s + r.femeas.existentes, 0);
  const totalFemeaNaoVac = faixas.reduce((s, r) => s + r.femeas.naoVacinados, 0);
  const totalVacMachos = vacinados.reduce((s, r) => s + r.machos, 0);
  const totalVacFemeas = vacinados.reduce((s, r) => s + r.femeas, 0);

  const th = "text-[11px] font-semibold text-[#6b7280] text-center py-2.5 px-3 border-b border-r border-[#f1f5f9]";
  const td = "text-[13px] text-[#1d1d1f] text-center py-3.5 px-3 border-b border-r border-[#f1f5f9]";

  // largura da 1ª coluna: se só um gênero aparece, a faixa ocupa mais espaço
  const generosVisiveis = (mostrarMachos ? 1 : 0) + (mostrarFemeas ? 1 : 0);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
        <h3 className="text-[16px] font-medium text-[#1d1d1f]">Vacinação</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[#008446] text-[13px] font-semibold hover:opacity-80 transition-opacity select-none leading-none"
        >
          <RotateCcw size={13} className="shrink-0 mt-[-1px]" />
          <span>Restaurar Valores</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]" style={{ minWidth: generosVisiveis === 2 ? 840 : 520 }}>
          <thead>
            <tr className="bg-white">
              <th rowSpan={2} className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider text-center px-6 py-4 border-b border-r border-[#f1f5f9] bg-[#f8fafc]/60 align-middle">
                Faixa Etária
              </th>
              {mostrarMachos && (
                <th colSpan={3} className="text-[12px] font-bold text-[#2563eb] uppercase tracking-widest text-center px-4 py-3 border-b border-r border-[#f1f5f9] bg-[#f8fafc]">Machos</th>
              )}
              {mostrarFemeas && (
                <th colSpan={3} className="text-[12px] font-bold text-[#be185d] uppercase tracking-widest text-center px-4 py-3 border-b border-r border-[#f1f5f9] bg-[#f8fafc]">Fêmeas</th>
              )}
            </tr>
            <tr className="bg-[#f8fafc]">
              {mostrarMachos && (<>
                <th className={th}>Existentes</th>
                <th className={th}>{statusLabel}</th>
                <th className={th}>Vacinados</th>
              </>)}
              {mostrarFemeas && (<>
                <th className={th}>Existentes</th>
                <th className={th}>{statusLabel}</th>
                <th className={`${th} border-r-0`}>Vacinados</th>
              </>)}
            </tr>
          </thead>
          <tbody>
            {faixas.map((row, i) => {
              const vac = vacinados[i] ?? { machos: 0, femeas: 0 };
              return (
                <tr key={row.label} className="hover:bg-[#fafafa]/40 transition-colors">
                  <td className="px-6 py-3.5 text-[13px] font-semibold text-[#475569] border-r border-b border-[#f1f5f9]">{row.label}</td>
                  {mostrarMachos && (<>
                    <td className={td}>{row.machos.existentes}</td>
                    <td className={td}>{row.machos.naoVacinados}</td>
                    <td className={td}>
                      <div className="flex justify-center">
                        <Stepper value={vac.machos} onChange={(v) => onChange(i, "machos", v)} accentColor="#2563eb" max={row.machos.naoVacinados} />
                      </div>
                    </td>
                  </>)}
                  {mostrarFemeas && (<>
                    <td className={td}>{row.femeas.existentes}</td>
                    <td className={td}>{row.femeas.naoVacinados}</td>
                    <td className={`${td} border-r-0`}>
                      <div className="flex justify-center">
                        <Stepper value={vac.femeas} onChange={(v) => onChange(i, "femeas", v)} accentColor="#be185d" max={row.femeas.naoVacinados} />
                      </div>
                    </td>
                  </>)}
                </tr>
              );
            })}
            <tr className="bg-[#f8fafc]/60 font-bold">
              <td className="px-6 py-4 text-[12px] font-extrabold text-[#475569] uppercase tracking-wider border-r border-[#f1f5f9]">Total</td>
              {mostrarMachos && (<>
                <td className="text-center py-4 px-3 border-r border-[#f1f5f9] text-[#1d1d1f]">{totalMachosExist}</td>
                <td className="text-center py-4 px-3 border-r border-[#f1f5f9] text-[#1d1d1f]">{totalMachosNaoVac}</td>
                <td className="text-center py-4 px-3 border-r border-[#f1f5f9]"><span className="text-[14px] font-bold tabular-nums text-[#2563eb]">{totalVacMachos}</span></td>
              </>)}
              {mostrarFemeas && (<>
                <td className="text-center py-4 px-3 border-r border-[#f1f5f9] text-[#1d1d1f]">{totalFemeaExist}</td>
                <td className="text-center py-4 px-3 border-r border-[#f1f5f9] text-[#1d1d1f]">{totalFemeaNaoVac}</td>
                <td className="text-center py-4 px-3 text-[#be185d]"><span className="text-[14px] font-bold tabular-nums">{totalVacFemeas}</span></td>
              </>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
interface VacinadosRow {
  machos: number;
  femeas: number;
}



// ══════════════════════════════════════════════════════════════════
// SUBCOMPONENTES DE LAYOUT
// ══════════════════════════════════════════════════════════════════
function TabelaFaixas({
  genero,
  regime,
  faixas,
  vacinados,
  onVacinadosChange,
}: {
  genero: "Macho" | "Fêmea";
  regime: string;
  faixas: FaixaRebanho[];
  vacinados: Record<string, string>;
  onVacinadosChange: (faixa: string, v: string) => void;
}) {
  const mostraNaoVacinados = regime === "Vacina Oficial" || regime === "Primeira Dose";
  const colStatusLabel = mostraNaoVacinados ? "Não Vacinados" : "Já Vacinados";

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{genero}</h3>

      {/* Contêiner Geral da Tabela */}
      <div className="w-full border border-gray-100 rounded-lg overflow-hidden bg-white">

        {/* CADASTRANDO O CABEÇALHO COM GRID (4 colunas iguais) */}
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100 items-center text-center">
          <div className="px-4 py-3 font-semibold text-gray-600 text-xs sm:text-sm">Faixa Etária</div>
          <div className="px-4 py-3 font-semibold text-gray-600 text-xs sm:text-sm">Existentes</div>
          <div className="px-4 py-3 font-semibold text-gray-600 text-xs sm:text-sm truncate">{colStatusLabel}</div>
          <div className="px-4 py-3 font-semibold text-gray-600 text-xs sm:text-sm">Vacinados</div>
        </div>

        {/* CADASTRANDO AS LINHAS COM GRID (Mesma estrutura de 4 colunas do cabeçalho) */}
        <div className="flex flex-col divide-y divide-gray-50">
          {faixas.map((f) => {
            const existentes = genero === "Macho" ? f.machoExistentes : f.femeaExistentes;
            return (
              <div
                key={f.faixa}
                className="grid grid-cols-4 items-center text-center py-2.5 hover:bg-gray-50/30 transition-colors"
              >
                {/* Coluna 1: Faixa Etária */}
                <div className="px-4 text-gray-600 font-medium text-sm truncate">{f.faixa}</div>

                {/* Coluna 2: Existentes */}
                <div className="px-4 text-gray-500 text-base font-semibold">{existentes}</div>

                {/* Coluna 3: Não Vacinados / Status */}
                <div className="px-4 text-gray-500 text-base font-semibold">{existentes}</div>

                {/* Coluna 4: Stepper Input de Vacinados */}
                <div className="px-4 flex justify-center items-center">
                  <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm overflow-hidden h-9 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        const atual = Number(vacinados[f.faixa] || 0);
                        if (atual > 0) onVacinadosChange(f.faixa, String(atual - 1));
                      }}
                      className="px-3 h-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors font-medium text-lg border-r border-gray-100"
                    >
                      −
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`Animais vacinados — ${genero} — ${f.faixa}`}
                      value={vacinados[f.faixa] ?? "0"}
                      onChange={(e) => onVacinadosChange(f.faixa, e.target.value.replace(/\D/g, ""))}
                      className="w-12 h-full text-center text-sm font-bold text-blue-600 focus:outline-none bg-transparent"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const atual = Number(vacinados[f.faixa] || 0);
                        if (atual < existentes) onVacinadosChange(f.faixa, String(atual + 1));
                      }}
                      className="px-3 h-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors font-medium text-lg border-l border-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
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

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const novaApresentacao = () => ({ uid: uid("ap"), frascos: "", dosesPorFrasco: "", validade: "" });

const totalDosesApresentacao = (frascos: string, dosesPorFrasco: string) =>
  (Number(frascos) || 0) * (Number(dosesPorFrasco) || 0);

interface LoteCardItemProps {
  lote: any;
  index: number;
  fornecedor: any;
  fornecedorEhLaboratorio: boolean;
  updateLote: (loteUid: string, patch: any) => void;
  addApresentacao: (loteUid: string) => void;
  removeApresentacao: (loteUid: string, index: number) => void;
  updateApresentacao: (loteUid: string, apUid: string, patch: any) => void;
}


// 1º: Declare a lista base
const AGE_RANGES = [
  "De 0 a 12 meses",
  "De 13 a 24 meses",
  "De 25 a 36 meses",
  "Acima de 36 meses",
];

// 2º: Declare as constantes que usam o AGE_RANGES (Ordem correta de inicialização)
const INITIAL_VACINADOS: VacinadosRow[] = AGE_RANGES.map(() => ({
  machos: 0,
  femeas: 0,
}));

const FIXED = AGE_RANGES.map(() => ({
  machos: { existentes: 100, naoVacinados: 80 },
  femeas: { existentes: 100, naoVacinados: 80 },
}));

// ══════════════════════════════════════════════════════════════════
// REGRAS DE FAIXA ETÁRIA / GÊNERO POR DOENÇA + REGIME
//   - Brucelose: só fêmeas (nunca machos)
//   - Brucelose + "Vacina Oficial": única faixa "De 3 a 8 meses"
//   - Demais casos: faixas padrão, ambos os gêneros
// Retorna as linhas da tabela + flags de exibição por gênero.
// (valores de existentes/nãoVacinados vêm da API — aqui mockados)
// ══════════════════════════════════════════════════════════════════
const FAIXA_BRUCELOSE_OFICIAL = "De 3 a 8 meses";

function derivarFaixas(doencaNome: string | undefined, regime: string): {
  faixas: FaixaLinha[];
  mostrarMachos: boolean;
  mostrarFemeas: boolean;
} {
  const isBrucelose = doencaNome === "Brucelose";
  const linhaPadrao = (label: string): FaixaLinha => ({
    label,
    machos: { existentes: 100, naoVacinados: 80 },
    femeas: { existentes: 100, naoVacinados: 80 },
  });

  if (isBrucelose) {
    // Brucelose: somente fêmeas
    if (regime === "Vacina Oficial") {
      return { faixas: [linhaPadrao(FAIXA_BRUCELOSE_OFICIAL)], mostrarMachos: false, mostrarFemeas: true };
    }
    // Vacina Complementar (ou regime ainda não escolhido) → todas as faixas, só fêmeas
    return { faixas: AGE_RANGES.map(linhaPadrao), mostrarMachos: false, mostrarFemeas: true };
  }

  // Demais doenças (Raiva, Aftosa, etc.): ambos os gêneros, faixas padrão
  return { faixas: AGE_RANGES.map(linhaPadrao), mostrarMachos: true, mostrarFemeas: true };
}

const DOSES_DISPONIVEIS = 70;


const NOTAS_SELECIONADAS_ANTERIORMENTE: NotaFiscal[] = [
  // ... seus dados mockados de notas aqui
];
// ==========================================================
// COMPONENTE ISOLADO DO CARD DO LOTE
// ==========================================================
export function LoteCardItem({
  lote,
  fornecedor,
  fornecedorEhLaboratorio,
  updateLote,
  addApresentacao,
  removeApresentacao,
  updateApresentacao,
}: LoteCardItemProps) {

  const totalDosesLote = lote.apresentacoes?.reduce((sum: number, ap: any) => {
    return sum + totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco);
  }, 0) || 0;

  const doencaTemTipo = lote.doenca && lote.doenca.tiposVacina && lote.doenca.tiposVacina.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full border border-gray-100 p-4 rounded-xl bg-gray-50/50 relative mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FloatInput
          label="Número da Partida"
          required
          placeholder="0013225/19"
          value={lote.numeroPartida || ""}
          onChange={(v) => updateLote(lote.uid, { numeroPartida: v })}
          maxLength={10}
        />

        {fornecedorEhLaboratorio ? (
          <FloatInput label="Laboratório" value={fornecedor?.nome || ""} onChange={() => { }} disabled />
        ) : (
          <EntitySearchInput
            label="Laboratório"
            placeholder="Buscar laboratório..."
            value={lote.laboratorio ? lote.laboratorio.nome : ""}
            data={LABORATORIOS_MOCK}
            searchKeys={["nome"]}
            columns={[{ label: "Nome do Laboratório", key: "nome" }]}
            icon={<FlaskConical size={18} color={GREEN} />}
            title="Buscar Laboratório"
            subtitle="Busque por um laboratório cadastrado:"
            onChange={(ent) => updateLote(lote.uid, { laboratorio: ent })}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <EntitySearchInput
          label="Doença"
          placeholder="Buscar doença..."
          value={lote.doenca ? lote.doenca.nome : ""}
          data={DOENCAS_MOCK}
          searchKeys={["nome"]}
          columns={[{ label: "Nome da Doença", key: "nome" }]}
          icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
          title="Buscar Doença"
          subtitle="Busque por uma doença cadastrada:"
          onChange={(ent) => updateLote(lote.uid, { doenca: ent, tipoVacina: "" })}
        />

        {doencaTemTipo && (
          <FloatSelect
            label="Tipo de Vacina"
            value={lote.tipoVacina || ""}
            onChange={(v) => updateLote(lote.uid, { tipoVacina: v })}
            options={lote.doenca.tiposVacina.map((t: string) => ({ value: t, label: t }))}
          />
        )}
      </div>

      <SubGrupo titulo="Apresentação de Vacinas" comDivisor>
        <DynamicListWrapper
          items={lote.apresentacoes || []}
          behavior="at-least-one"
          addButtonLabel="Adicionar Apresentação"
          itemLabel=""
          onAddItem={() => addApresentacao(lote.uid)}
          onRemoveItem={(i: number) => removeApresentacao(lote.uid, i)}
          variant="plain"
          showCounter={true}
          smallCounter={true}
        >
          {(ap: any) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center w-full">

              <FloatInput
                label="Nº de Doses por Frasco"
                required
                type="text"
                value={ap.dosesPorFrasco || ""}
                onChange={(v) => updateApresentacao(lote.uid, ap.uid, { dosesPorFrasco: v.replace(/\D/g, "").slice(0, 10) })}
              />
              <FloatInput
                label="Total de Doses"
                required
                disabled
                value={String(totalDosesApresentacao(ap.frascos, ap.dosesPorFrasco) || "")}
                onChange={() => { }}
              />
              <FloatInput
                label="Validade"
                required
                icon={<Calendar size={18} />}
                type="month"
                placeholder="mm/aaaa"
                value={ap.validade || ""}
                onChange={(v) => updateApresentacao(lote.uid, ap.uid, { validade: v })}
              />
            </div>
          )}
        </DynamicListWrapper>
      </SubGrupo>

      <SubGrupo titulo="Total do Lote" comDivisor>
        <FloatInput label="Total de Doses Adquiridas" required disabled value={String(totalDosesLote || "")} onChange={() => { }} className="md:w-1/2" />
      </SubGrupo>
    </div>
  );
}


interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDeclaracaoVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [exploracao, setExploracao] = useState<any | null>(null);
  const [nucleo, setNucleo] = useState<any | null>(null);

  // ---- Informações de Vacinação ----
  const [doenca, setDoenca] = useState<any | null>(null);
  const [tipoVacina, setTipoVacina] = useState("");
  const [dataVacinacao, setDataVacinacao] = useState("");
  const [dataAtestado, setDataAtestado] = useState("");
  const [veterinario, setVeterinario] = useState<any | null>(null);
  const [vacinadorBrucelose, setVacinadorBrucelose] = useState<any | null>(null);
  const [mordidaMorcego, setMordidaMorcego] = useState("");

  // ---- Regime + faixas por gênero ----
  const [regime, setRegime] = useState("");
  const [vacMacho, setVacMacho] = useState<Record<string, string>>({});
  const [vacFemea, setVacFemea] = useState<Record<string, string>>({});

  // ---- Nota Fiscal ----
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [ufNotaFiscal, setUfNotaFiscal] = useState("");
  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>([]);
  const [modalNotaOpen, setModalNotaOpen] = useState(false);
  const [notasFiscais, setNotasFiscais] = useState<any[]>([]);
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  const [vacinados, setVacinados] = useState<VacinadosRow[]>(INITIAL_VACINADOS);
  const [origemNota, setOrigemNota] = useState("");
  const [revendedora, setRevendedora] = useState<any | null>(null);
  const DOSES_DISPONIVEIS = 70;

  const [modalProdutor, setModalProdutor] = useState(false);
  const [modalEstabelecimento, setModalEstabelecimento] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // 1. CONSTANTE BASE DE DATA (Declarada antes das validações que dependem dela)
  const hoje = new Date().toISOString().slice(0, 10);

  // 2. REGRAS DERIVADAS DA DOENÇA (useMemo movidos para o topo)
  const exigeNucleo = useMemo(() => {
    return doenca?.exigeNucleo || false;
  }, [doenca]);

  const doencaExigeReceituario = useMemo(() => {
    return doenca?.exigeReceituario || false;
  }, [doenca]);

  const exigeMedicoVeterinario = useMemo(() => {
    return doenca?.exigeMedico || false;
  }, [doenca]);

  const isRaiva = doenca?.nome === "Raiva";

  // 3. CÁLCULOS DE DOSES E SALDOS
  const utilizadas = vacinados.reduce((s, r) => s + r.machos + r.femeas, 0);
  const saldo = DOSES_DISPONIVEIS - utilizadas;
  const totalAlocadoEmLotes = notasFiscais.reduce((acc, nf) => acc + nf.lotes.reduce((a, l) => a + l.dosesUtilizadas, 0), 0);
  const restante = utilizadas - totalAlocadoEmLotes;

  // 4. VALIDAÇÕES E ERROS (Agora já possuem acesso a todas as variáveis acima)
  const erroDataVac = dataVacinacao !== "" && dataVacinacao > hoje;
  const erroDataAtestado = dataAtestado !== "" && (dataAtestado > hoje || (dataVacinacao !== "" && dataAtestado < dataVacinacao));
  const dosesValidas = utilizadas > 0 && saldo >= 0 && utilizadas === totalAlocadoEmLotes;

  const formValido =
    !!produtor && !!estabelecimento && !!exploracao && (!exigeNucleo || !!nucleo) &&
    !!doenca && regime !== "" && dataVacinacao !== "" && dataAtestado !== "" && !!veterinario &&
    (!isRaiva || mordidaMorcego !== "") &&
    origemNota !== "" && !!revendedora &&
    dosesValidas && !erroDataVac && !erroDataAtestado;

  const isFormValid = useMemo(() => {
    if (!produtor || !estabelecimento || !exploracao || !doenca || !dataVacinacao) {
      return false;
    }
    if (exigeNucleo && !nucleo) return false;
    if (exigeMedicoVeterinario && !veterinario) return false;
    return true;
  }, [
    produtor,
    estabelecimento,
    exploracao,
    doenca,
    dataVacinacao,
    exigeNucleo,
    nucleo,
    exigeMedicoVeterinario,
    veterinario,
  ]);

  // 5. OUTROS USEMEMO E VARIÁVEIS COMPLEMENTARES
  const isBrucelose = doenca?.nome === "Brucelose";
  const tipoVacinaDisponivel = (doenca?.tiposVacina?.length ?? 0) > 0;
  const opcoesRegime = isBrucelose
    ? ["Vacina Oficial", "Vacina Complementar"]
    : ["Primeira Dose", "Dose de Reforço"];

  // Gate: Vacinação e Nota Fiscal só aparecem após Produtor + Doença
  const mostrarVacinacaoENota = !!produtor && !!doenca;

  // Faixas/gênero derivados da doença + regime (Brucelose = só fêmea; Oficial = De 3 a 8 meses)
  const { faixas: faixasTabela, mostrarMachos, mostrarFemeas } = derivarFaixas(doenca?.nome, regime);
  // "Não Vacinados" (Oficial/Primeira Dose) vs "Já Vacinados" (Complementar/Reforço)
  const statusColLabel =
    regime === "Vacina Oficial" || regime === "Primeira Dose" ? "Não Vacinados" : "Já Vacinados";
  // vacinados alinhado ao nº de faixas correntes (evita índice fora do range ao trocar regime)
  const vacinadosView: VacinadosRow[] = faixasTabela.map((_, i) => vacinados[i] ?? { machos: 0, femeas: 0 });

  const { totalMachoVacinados, totalFemeaVacinados } = useMemo(() => {
    const machoSum = Object.values(vacMacho).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const femeaSum = Object.values(vacFemea).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    return { totalMachoVacinados: machoSum, totalFemeaVacinados: femeaSum };
  }, [vacMacho, vacFemea]);

  const totalGeralVacinados = totalMachoVacinados + totalFemeaVacinados;

  const estabsFiltrados = produtor ? ESTABELECIMENTOS_MOCK.filter((e) => e.produtorId === produtor.id) : [];
  const exploracoesFiltradas = estabelecimento
    ? EXPLORACOES_MOCK.filter((e) => e.estabId === estabelecimento.id && e.produtorId === produtor?.id)
    : [];

  const databaseProdutor = PRODUTORES_MOCK.filter((p) => (!tipoPessoa ? true : p.tipo === tipoPessoa));
  const colunasModalProdutor = [
    { label: "Nome", key: "nome" },
    { label: "Documento", key: "documento" },
  ];

  const tablewareFornecedor = null;
  const fornecedorEhLaboratorio = false;

  // 6. FUNÇÕES E HANDLERS (Ações disparadas por eventos)
  const handleChangeVacinados = (i: number, g: "machos" | "femeas", v: number) =>
    setVacinados((prev) => prev.map((row, idx) => (idx === i ? { ...row, [g]: v } : row)));

  const handleReset = () => {
    setVacinados(AGE_RANGES.map(() => ({ machos: 0, femeas: 0 })));
    setNotasFiscais(NOTAS_SELECIONADAS_ANTERIORMENTE);
  };

  const handleUpdateDosesLote = (notaId: string, loteId: string, novasDoses: number) =>
    setNotasFiscais(notasFiscais.map((nf) => (nf.id !== notaId ? nf : {
      ...nf,
      lotes: nf.lotes.map((l) => (l.id === loteId ? { ...l, dosesUtilizadas: novasDoses } : l)),
    })));

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;
    setSucesso(true);
  };

  const err = (cond: boolean, customMessage?: string) =>
    (tentouSalvar && cond ? (customMessage || "Campo obrigatório.") : undefined);

  const onChangeProdutor = (ent: any) => {
    setProdutor(ent); setEstabelecimento(null); setExploracao(null); setNucleo(null);
  };
  const onChangeEstabelecimento = (ent: any) => {
    setEstabelecimento(ent); setExploracao(null); setNucleo(null);
  };
  const onChangeExploracao = (ent: any) => {
    setExploracao(ent); setNucleo(null);
  };
  const onChangeDoenca = (ent: any) => {
    setDoenca(ent); setTipoVacina(""); setVacinadorBrucelose(null); setMordidaMorcego(""); setRegime("");
  };

  // 7. ESTADOS DINÂMICOS DE LOTES E SUAS FUNÇÕES
  const [lotes, setLotes] = useState<any[]>([
    { uid: uid("lt"), numeroPartida: "", laboratorio: null, doenca: null, tipoVacina: "", apresentacoes: [novaApresentacao()] }
  ]);

  const addLote = () => {
    setLotes([...lotes, { uid: uid("lt"), numeroPartida: "", laboratorio: null, doenca: null, tipoVacina: "", apresentacoes: [novaApresentacao()] }]);
  };

  const removeLote = (index: number) => {
    setLotes(lotes.filter((_, i) => i !== index));
  };

  const updateLote = (loteUid: string, patch: any) => {
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, ...patch } : l)));
  };

  const addApresentacao = (loteUid: string) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, apresentacoes: [...l.apresentacoes, novaApresentacao()] } : l)));

  const removeApresentacao = (loteUid: string, index: number) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid ? { ...l, apresentacoes: l.apresentacoes.filter((_: any, i: number) => i !== index) } : l)));

  const updateApresentacao = (loteUid: string, apUid: string, patch: any) =>
    setLotes((ls) => ls.map((l) => (l.uid === loteUid
      ? { ...l, apresentacoes: l.apresentacoes.map((a: any) => (a.uid === apUid ? { ...a, ...patch } : a)) }
      : l)));
  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button onClick={() => onNavigate("declaracao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Declarações de Vacinação
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Declaração de Vacinação</h1>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* ============ INFORMAÇÕES BÁSICAS ============ */}
        <SectionCard title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-full">
              <ProdutorInput
                value={produtor ? produtor.nome : ""}
                required
                onChange={onChangeProdutor}
                error={err(!produtor)}
                onEyeClick={() => {
                  if (produtor?.id) alert(`Visualizar detalhes do produtor ID: ${produtor.id}`);
                  else alert("Por favor, selecione um produtor primeiro.");
                }}
              />
            </div>

            {produtor && (
              <div className="col-span-full">
                <EstabelecimentoAgropecuarioInput
                  value={estabelecimento ? estabelecimento.nome : ""}
                  required
                  data={estabsFiltrados}
                  onChange={onChangeEstabelecimento}
                  error={err(!estabelecimento)}
                  onEyeClick={() => {
                    if (estabelecimento?.codigo) alert(`Visualizar detalhes: ${estabelecimento.codigo}`);
                    else alert("Por favor, selecione um estabelecimento primeiro.");
                  }}
                />
              </div>
            )}

            {estabelecimento && (
              <div className="col-span-full">
                <ExploracaoPecuariaInput
                  value={exploracao ? exploracao.codigo : ""}
                  required
                  data={exploracoesFiltradas}
                  onChange={onChangeExploracao}
                  error={err(!exploracao)}
                  onEyeClick={() => {
                    if (exploracao?.codigo) alert(`Visualizar detalhes: ${exploracao.codigo}`);
                    else alert("Por favor, selecione uma exploração primeiro.");
                  }}
                />
              </div>
            )}

            {exploracao && exigeNucleo && (
              <div className="col-span-full">
                <NucleoInput
                  value={nucleo ? nucleo.nome : ""}
                  required={exigeNucleo}
                  onChange={(entidadeSelecionada) => setNucleo(entidadeSelecionada)}
                  error={err(exigeNucleo && !nucleo)}
                />
              </div>
            )}
          </div>
        </SectionCard>

        {/* ============ INFORMAÇÕES DE VACINAÇÃO ============ */}
        <SectionCard title="Informações de Vacinação">
          {/* Trocamos 'grid' por 'flex flex-wrap' com gap-4 para permitir o deslocamento natural para a esquerda */}
          <div className="flex flex-wrap gap-4 items-end w-full">

            {/* 1. Doença (Ocupa no mínimo 280px e cresce para preencher até 1/3 do espaço) */}
            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <EntitySearchInput
                label="Doença"
                required
                placeholder="Buscar por doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={onChangeDoenca}
                error={err(!doenca)}
              />
            </div>

            {/* 2. Tipo de Vacina (SÓ É RENDERIZADO SE FOR VÁLIDO. Se sumir, os outros colam na esquerda) */}
            {doenca && tipoVacinaDisponivel && (
              <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
                <FloatSelect
                  label="Tipo de Vacina"
                  value={tipoVacina}
                  onChange={setTipoVacina}
                  options={(doenca?.tiposVacina ?? []).map((t: string) => ({ value: t, label: t }))}
                />
              </div>
            )}

            {/* 3. Tipo de Vacinação / Dose (Regime) */}
            {doenca && (
              <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
                <FloatSelect
                  label={isBrucelose ? "Tipo de Vacinação" : "Tipo de Vacinação"}
                  required
                  value={regime}
                  onChange={(v: string) => {
                    setRegime(v);
                    setVacinados(AGE_RANGES.map(() => ({ machos: 0, femeas: 0 })));
                  }}
                  options={opcoesRegime.map((o) => ({ value: o, label: o }))}
                  error={err(regime === "")}
                />
              </div>
            )}

            {/* 4. Data da Vacinação */}
            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput
                label="Data da Vacinação"
                required
                type="date"
                icon={<Calendar size={18} color={GREEN} />}
                max={hoje}
                value={dataVacinacao}
                onChange={setDataVacinacao}
                error={err(dataVacinacao === "") || (erroDataVac ? "Deve ser menor ou igual à data atual." : undefined)}
              />
            </div>

            {/* 5. Data de Atestado de Vacinação */}
            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput
                label="Data de Atestado de Vacinação"
                required
                type="date"
                icon={<Calendar size={18} color={GREEN} />}
                min={dataVacinacao || undefined}
                max={hoje}
                value={dataAtestado}
                onChange={setDataAtestado}
                error={err(dataAtestado === "") || (erroDataAtestado ? "Entre a Data de Vacinação e hoje." : undefined)}
              />
            </div>

            {/* Médicos e Vacinadores ocupando a largura total restante */}
            <div className="w-full mt-2">
              <MedicoVeterinarioInput
                value={veterinario ? veterinario.nome : ""}
                required
                onChange={(entidadeSelecionada) => setVeterinario(entidadeSelecionada)}
                error={err(!veterinario)}
                onEyeClick={() => {
                  if (veterinario?.cpf) alert(`Visualizar detalhes do veterinário CPF: ${veterinario.cpf}`);
                  else alert("Por favor, selecione um médico veterinário primeiro.");
                }}
              />
            </div>

            {isBrucelose && (
              <div className="w-full mt-1">
                <VacinadorBruceloseInput
                  value={vacinadorBrucelose ? vacinadorBrucelose.nome : ""}
                  disabled={!veterinario}
                  data={veterinario ? VACINADORES_MOCK.filter((v: any) => v.vetId === veterinario.id) : []}
                  onChange={(entidadeSelecionada) => setVacinadorBrucelose(entidadeSelecionada)}
                  error={err(isBrucelose && !vacinadorBrucelose)}
                  onEyeClick={() => {
                    if (vacinadorBrucelose?.documento) alert(`Visualizar detalhes do vacinador CPF: ${vacinadorBrucelose.documento}`);
                    else alert("Por favor, selecione um vacinador primeiro.");
                  }}
                />
              </div>
            )}

            {isRaiva && (
              <div className="w-full flex flex-col gap-2 mt-2  p-3 rounded-lg ">
                <span className="text-xs font-semibold text-gray-700">
                  Observou mordidas de morcegos no rebanho recentemente? <span className="text-red-500">*</span>
                </span>
                <div className="flex items-center gap-6 mt-1">
                  <CustomRadio
                    label="Sim"
                    name="mordidaMorcego"
                    checked={mordidaMorcego === "Sim"}
                    onChange={() => setMordidaMorcego("Sim")}
                    error={err(isRaiva && mordidaMorcego === "")}
                  />
                  <CustomRadio
                    label="Não"
                    name="mordidaMorcego"
                    checked={mordidaMorcego === "Não"}
                    onChange={() => setMordidaMorcego("Não")}
                    error={err(isRaiva && mordidaMorcego === "")}
                  />
                </div>
              </div>
            )}

          </div>
        </SectionCard>



        {/* Seção 2: Nota Fiscal de Origem — só após Produtor + Doença */}
        {mostrarVacinacaoENota && (
          <Section title="Nota Fiscal">
            <div className="flex flex-col gap-4">

              {/* Topo da seção: Título interno, Total de Doses Adquiridas e o Botão Padronizado */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Saldo de doses</span>
                  </div>

                  {/* Badge do Total de Doses Adquiridas (SÓ APARECE SE HOUVER DOSES) */}
                  {notasFiscaisOrigem.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                      <span className="text-[11px] font-semibold text-gray-500">DOSES UTILIZADAS:</span>
                      <span className="text-[11px] font-black text-[#1A7A3C]">
                        {notasFiscaisOrigem.reduce((sum, item) => sum + (item.quantidadeDoses || 0), 0)} doses
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!produtor}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalNotaOrigemOpen(true);
                  }}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${produtor
                    ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer"
                    : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                >
                  <PlusCircle size={18} />
                  Adicionar Saldo
                </button>
              </div>

              {/* CONDICIONAL 1: Sem revendedora selecionado ainda */}
              {!produtor && (
                <div className="text-left py-4">
                  <p className="text-xs text-gray-400 italic">É necessário selecionar uma Revendedora para pesquisar notas fiscais de origem.</p>
                </div>
              )}

              {/* CONDICIONAL 2: Fornecedor selecionado, mas nenhuma nota fiscal adicionada ainda */}
              {produtor && notasFiscaisOrigem.length === 0 && (
                <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                  <p className="text-sm text-gray-400 italic">Nenhuma lote vinculado até o momento.</p>
                </div>
              )}

              {/* Dashboard de Lotes Atrelados Agrupados por NF */}
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
                    // Nota Fiscal: Aberta por padrão
                    const isNotaMinimizada = notasListasMinimizadas[grupo.nome] || false;

                    return (
                      <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">

                        {/* Cabeçalho da Nota Fiscal */}
                        <div className="flex items-center justify-between mb-4 px-1">
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none group/title"
                            onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                          >
                            <Package size={24} color={GREEN} />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-gray-800 group-hover/title:text-gray-600 transition-colors">
                                {grupo.nome}
                              </span>

                              <span className="px-1.5 py-0.5 bg-gray-100/60 border border-gray-200 text-gray-700 text-[10px] font-medium rounded uppercase tracking-wider">
                                UF: {grupo.partidas[0]?.uf || "MG"}
                              </span>
                            </div>

                            {isNotaMinimizada ? (
                              <ChevronDown size={16} className="text-gray-400 group-hover/title:text-gray-600 mt-0.5" />
                            ) : (
                              <ChevronUp size={16} className="text-gray-400 group-hover/title:text-gray-600 mt-0.5" />
                            )}

                            {isNotaMinimizada && (
                              <span className="text-[11px] text-gray-400 font-medium normal-case">
                                ({grupo.partidas.length} {grupo.partidas.length === 1 ? 'partida oculta' : 'partidas ocultas'})
                              </span>
                            )}
                          </div>

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

                        {/* Grid de lotes internos */}
                        {!isNotaMinimizada && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-slideDown">
                            {grupo.partidas.map((nfItem: any) => {
                              const DOSES_POR_FRASCO = nfItem.dosesPerFrasco || 20;
                              const TOTAL_DISPONIVEL = nfItem.dosesDisponiveisTotais || 100;
                              const validadeLote = nfItem.validade || "20/12/2026";

                              // ALTERAÇÃO AQUI: Se não houver registro no estado, assume true (começa aberto/expandido)
                              const isLoteExpandido = lotesMinimizados[nfItem.id] !== undefined ? lotesMinimizados[nfItem.id] : true;
                              const isLoteMinimizado = !isLoteExpandido;

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


                              return (
                                <div
                                  key={`lote-${nfItem.id}`}
                                  className={`border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto ${isLoteMinimizado ? "p-2.5 pb-2 justify-start" : "p-4 justify-between"
                                    }`}
                                >

                                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                    <button
                                      type="button"
                                      onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteExpandido }))}
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
                                      <div className="relative cursor-help text-gray-400 hover:text-gray-600 transition pt-0.5 z-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                        <div className="fixed inset-0 bg-black/15 hidden group-hover/info:block pointer-events-none z-[998] animate-fadeIn" />

                                        <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover/info:block animate-fadeIn z-[999] text-left overflow-hidden">
                                          <div className="flex items-center gap-1.5 bg-gray-50 border-b border-gray-100 p-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                            <span className="text-[11px] font-extrabold text-gray-800">Apresentação </span>
                                          </div>
                                          <div className="p-3 flex flex-col gap-2 text-[11px] text-gray-500 bg-white">
                                            <div className="flex justify-between items-center">
                                              <span>Laboratório:</span>
                                              <span className="font-bold text-gray-700">BioMed/MG</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span>Doença:</span>
                                              <span className="font-bold text-gray-700">Brucelose</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span>Tipo de Vacina:</span>
                                              <span className="font-bold text-gray-700">B19</span>
                                            </div>
                                          </div>
                                          <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                                            <span>Doses Totais Lote:</span>
                                            <span>{TOTAL_DISPONIVEL}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <span className="text-xs font-semibold text-gray-800 select-none">
                                        Apresentação
                                      </span>

                                      {isLoteMinimizado && (
                                        <span className="text-[11px] text-gray-400 font-medium ml-2 animate-fadeIn">
                                          ({nfItem.quantidadeDoses || 0} doses lançadas)
                                        </span>
                                      )}
                                    </div>

                                    <div className={`px-2 py-0.5 rounded border font-semibold text-[10px] ${isVencido ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
                                      }`}>
                                      Validade: {validadeLote} {isVencido && "(Vencida)"}
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
                                                <span className="text-sm font-black text-gray-800 leading-none">
                                                  {TOTAL_DISPONIVEL}
                                                </span>
                                                <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                                  Disp
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex gap-2 flex-1 justify-start items-stretch">

                                          <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-gray-50/80 justify-between">
                                            <span className="text-[11px] text-gray-600 font-medium text-center">Total</span>

                                            <div className="flex gap-2 items-end justify-center py-0.5">
                                              <div className="flex flex-col items-center flex-1">
                                                <span className="text-xs font-bold text-gray-700 leading-none">
                                                  {Math.floor(TOTAL_DISPONIVEL / DOSES_POR_FRASCO)}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium mt-0.5">Frascos</span>
                                              </div>
                                              <div className="flex flex-col items-center flex-1">
                                                <span className="text-xs font-bold text-gray-700 leading-none">
                                                  {TOTAL_DISPONIVEL}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium mt-0.5">Doses</span>
                                              </div>
                                            </div>

                                            <p className="text-[8px] text-gray-400 text-center leading-none mt-0.5">
                                              {DOSES_POR_FRASCO} doses por frasco
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
        )}

        {/* ── VACINAÇÃO — só após Produtor + Doença ── */}
        {/* ── VACINAÇÃO — só após Produtor + Doença + Regime selecionado ── */}
        {mostrarVacinacaoENota && regime !== "" && (() => {
          // 1. Calcula o total disponível somando todas as notas fiscais selecionadas
          const totalDisponivel = notasFiscaisOrigem.reduce((sum, item) => sum + (item.dosesDisponiveisTotais || 0), 0);

          // 2. Calcula o saldo restante: Disponível menos Utilizado
          const saldoRestante = totalDisponivel - (utilizadas || 0);

          return (
            <SectionCard title="Vacinação">

              <SummaryCards
                disponiveis={totalDisponivel}
                utilizadas={utilizadas}
                saldo={saldoRestante} // Passa o saldo calculado dinamicamente
              />

              <VaccinationTable
                faixas={faixasTabela}
                mostrarMachos={mostrarMachos}
                mostrarFemeas={mostrarFemeas}
                statusLabel={statusColLabel}
                vacinados={vacinadosView}
                onChange={handleChangeVacinados}
                onReset={handleReset}
              />
            </SectionCard>
          );
        })()}


      </main>


      {/* ============ SEARCHMODAL DO PRODUTOR ============ */}
      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => { setModalProdutor(false); setTipoPessoa(""); }}
        title="Buscar Produtor"
        subtitle="Busque por um produtor cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />}
        data={databaseProdutor}
        columns={colunasModalProdutor}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => { onChangeProdutor(p); setModalProdutor(false); setTipoPessoa(""); }}
        className="max-w-5xl w-full [&_td]:whitespace-pre-line"
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


      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacinas"
        subtitle="Selecione os lotes de vacina desejados para vincular a esta declaração:"
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


      {/* ============ SEARCHMODAL DO ESTABELECIMENTO ============ */}
      <SearchModal
        open={modalEstabelecimento}
        onClose={() => setModalEstabelecimento(false)}
        title="Buscar ... Agropecuário"
        subtitle="Busque por um estabelecimento em que o produtor é titular:"
        icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-8 h-8 object-contain" />}
        data={estabsFiltrados}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Estabelecimento", key: "nome" },
          { label: "Município", key: "municipio" },
          { label: "Documento - Nome (Proprietário)", key: "proprietario" },
        ]}
        searchKeys={["codigo", "nome", "municipio"]}
        searchPlaceholder="Buscar por código, nome ou município"
        confirmLabel="Confirmar"
        onConfirm={(e: any) => { onChangeEstabelecimento(e); setModalEstabelecimento(false); }}
        className="max-w-5xl w-full [&_td]:whitespace-pre-line"
      />

      {/* ============ CARD DE SUCESSO ============ */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: GREEN }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Declaração de vacinação registrada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              A vacinação foi declarada e o rebanho da exploração foi atualizado.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate("declaracao-vacinacao")}
                className="px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 transition hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => onNavigate("visualizar-declaracao-vacinacao", {
                  produtorNome: produtor?.nome, produtorDoc: produtor?.documento,
                  estabCodigo: estabelecimento?.codigo, estabNome: estabelecimento?.nome,
                  municipio: estabelecimento?.municipio, especie: exploracao?.especie,
                  doenca: doenca?.nome, dataVacinacao, situacao: "Finalizada",
                })}
                className="px-5 py-2.5 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
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