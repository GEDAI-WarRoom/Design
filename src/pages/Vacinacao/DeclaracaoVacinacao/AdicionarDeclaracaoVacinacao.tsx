import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Syringe,
  CheckCircle2,
  Info,
  Calendar,
  FlaskConical, PlusCircle, ChevronUp, ChevronDown, Trash2, Store, Check, RotateCcw, Package, PillBottle, X
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
import * as Icons from "../../../imports/icons";
import { CadastroVacinacaoHeader, cadastroVacinacaoPageClass, mensagemSucessoCadastro, preencherComExemplo, type CadastroVacinacaoModeProps } from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";
const MOCK_KEY = "DECLARACOES_VACINA_DB";
const ESTOQUE_KEY = "ESTOQUE_VACINA_DECLARACAO_DB_V2";

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
    produtorId: 1, 
    estabId: 1,    
    codigo: "420010400050001",
    especie: "Bovino",
    estabelecimentoFormatado: "31234567891 -\n Fazenda do Rio",
    grupoEspecieFormatado: "Bovinos -\n Bovino",
    produtoresFormatado: "555.009.956-40 -\n  José Aarão Neto"
  },
  {
    id: 2,
    produtorId: 2, 
    estabId: 2,    
    codigo: "420010400050002",
    especie: "Abelha com Ferrão",
    estabelecimentoFormatado: "31001040005 -\n Fazenda Rio Preto",
    grupoEspecieFormatado: "Abelhas -\n Abelha com Ferrão",
    produtoresFormatado: "444.009.956-40 -\n  Divino de Souza Sobrinho"
  }
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, nome: "Febre Aftosa", tiposVacina: [] },
  { id: 3, nome: "Raiva", tiposVacina: [] },
];

const LOTES_MOCK = [
  { compradorTipo: "Produtor", revendedoraId: 1, fornecedor: "Comercial AgroVet", uf: "MG" },
  { compradorTipo: "Produtor", revendedoraId: 2, fornecedor: "AgroInsumos Sul", uf: "SP" },
  { compradorTipo: "Médico Veterinário", revendedoraId: 1, fornecedor: "Comercial AgroVet", uf: "MG" },
  { compradorTipo: "Médico Veterinário", revendedoraId: 2, fornecedor: "AgroInsumos Sul", uf: "SP" },
  { compradorTipo: "Vacinador", revendedoraId: 1, fornecedor: "Comercial AgroVet", uf: "MG" },
  { compradorTipo: "Vacinador", revendedoraId: 2, fornecedor: "AgroInsumos Sul", uf: "SP" },
].flatMap((destino, indiceDestino) =>
  DOENCAS_MOCK.flatMap((doenca, indiceDoenca) =>
    [1, 2].map((partida) => {
      const dosesPerFrasco = 20;
      const frascosFechadosDisponiveis = 40 + indiceDestino * 5 + indiceDoenca * 3 + partida * 2;
      const frascosAbertosEstoque = partida === 1
        ? [{ id: `${indiceDestino}-${indiceDoenca}-${partida}-aberto-1`, saldoDoses: 5 }]
        : [
          { id: `${indiceDestino}-${indiceDoenca}-${partida}-aberto-1`, saldoDoses: 8 },
          { id: `${indiceDestino}-${indiceDoenca}-${partida}-aberto-2`, saldoDoses: 12 },
        ];
      const dosesEmFrascosAbertos = frascosAbertosEstoque.reduce((soma, frasco) => soma + frasco.saldoDoses, 0);

      return {
        ...destino,
        id: indiceDestino * 6 + indiceDoenca * 2 + partida,
        nome: `${String(13225 + indiceDestino * 300 + indiceDoenca * 100).padStart(7, "0")}/26`,
        partida: String(partida),
        dosesPerFrasco,
        frascosFechadosDisponiveis,
        frascosAbertosEstoque,
        frascosAbertosDisponiveis: frascosAbertosEstoque.length,
        dosesEmFrascosAbertos,
        dosesDisponiveisTotais: frascosFechadosDisponiveis * dosesPerFrasco + dosesEmFrascosAbertos,
        doenca: doenca.nome,
        tipoVacina: doenca.nome === "Brucelose" ? (partida === 1 ? "B19" : "RB51") : "",
        laboratorio: doenca.nome === "Raiva" ? "Zoetis" : doenca.nome === "Febre Aftosa" ? "OuroFino" : "BioMed/MG",
        validade: doenca.nome === "Febre Aftosa" ? "10/10/2026" : doenca.nome === "Raiva" ? "15/08/2027" : "20/12/2026",
      };
    }),
  ),
);

const VACINADORES_MOCK = [
  { id: 1, vetId: 1, nome: "Pedro Alves", documento: "222.114.558-70" },
  { id: 2, vetId: 2, nome: "Carla Menezes", documento: "111.998.775-30" },
];

const GRUPOS_COM_NUCLEO = ["Abelhas", "Aves", "Suídeos"];

interface FaixaRebanho {
  faixa: string;
  machoExistentes: number;
  femeaExistentes: number;
}

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

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

// 1º: Declare a lista base
const AGE_RANGES = [
  "De 0 a 12 meses",
  "De 13 a 24 meses",
  "De 25 a 36 meses",
  "Acima de 36 meses",
];

interface VacinadosRow {
  machos: number;
  femeas: number;
}

const INITIAL_VACINADOS: VacinadosRow[] = AGE_RANGES.map(() => ({
  machos: 0,
  femeas: 0,
}));

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
  statusLabel: string;
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
    if (regime === "Vacina Oficial") {
      return { faixas: [linhaPadrao(FAIXA_BRUCELOSE_OFICIAL)], mostrarMachos: false, mostrarFemeas: true };
    }
    return { faixas: AGE_RANGES.map(linhaPadrao), mostrarMachos: false, mostrarFemeas: true };
  }

  return { faixas: AGE_RANGES.map(linhaPadrao), mostrarMachos: true, mostrarFemeas: true };
}

interface PageProps extends CadastroVacinacaoModeProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDeclaracaoVacinacaoPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const preenchendoRegistro = mode !== "create";
  const nomeDoencaInicial = dados?.doencaEntidade?.nome ?? dados?.doenca ?? "";
  const dataVacinacaoInicial = dados?.dataVacinacao ?? "";
  const produtorInicial = dados?.produtor ?? (dados?.produtorNome
    ? PRODUTORES_MOCK.find((item) => item.documento === dados.produtorDoc) ?? {
        id: `produtor-${dados?.id ?? "registro"}`,
        nome: dados.produtorNome,
        documento: dados.produtorDoc,
        tipo: dados.produtorDoc?.includes("/") ? "PJ" : "PF",
      }
    : null);
  const estabelecimentoInicial = dados?.estabelecimento ?? (dados?.estabNome
    ? ESTABELECIMENTOS_MOCK.find((item) => item.codigo === dados.estabCodigo) ?? {
        id: `estabelecimento-${dados?.id ?? "registro"}`,
        produtorId: produtorInicial?.id,
        codigo: dados.estabCodigo,
        nome: dados.estabNome,
        municipio: dados.municipio,
      }
    : null);
  const exploracaoInicial = dados?.exploracao ?? (dados?.especie
    ? {
        id: `exploracao-${dados?.id ?? "registro"}`,
        codigo: dados?.exploracaoCodigo ?? `${dados?.estabCodigo ?? "31001040005"}0001`,
        estabId: estabelecimentoInicial?.id,
        produtorId: produtorInicial?.id,
        especie: dados.especie,
        grupoEspecieFormatado: `Grupo da espécie - ${dados.especie}`,
      }
    : null);
  const doencaInicial = dados?.doencaEntidade ?? (nomeDoencaInicial
    ? DOENCAS_MOCK.find((item) => item.nome === nomeDoencaInicial) ?? {
        id: `doenca-${dados?.id ?? "registro"}`,
        nome: nomeDoencaInicial,
        tiposVacina: [],
      }
    : null);

  // ---- Informações Básicas ----
  const [produtor, setProdutor] = useState<any | null>(produtorInicial);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(estabelecimentoInicial);
  const [exploracao, setExploracao] = useState<any | null>(exploracaoInicial);
  const [nucleo, setNucleo] = useState<any | null>(dados?.nucleo ?? null);

  // ---- Informações de Vacinação ----
  const [doenca, setDoenca] = useState<any | null>(doencaInicial);
  const [tipoVacina, setTipoVacina] = useState(dados?.tipoVacina ?? (nomeDoencaInicial === "Brucelose" && preenchendoRegistro ? "B19" : ""));
  const [dataVacinacao, setDataVacinacao] = useState(dados?.dataVacinacao ?? "");
  const [dataAtestado, setDataAtestado] = useState(dados?.dataAtestado ?? (preenchendoRegistro ? dataVacinacaoInicial : ""));
  const [veterinario, setVeterinario] = useState<any | null>(dados?.veterinario ?? (preenchendoRegistro ? { id: 1, nome: "Dr. Roberto Silva", cpf: "123.456.789-00" } : null));
  const [vacinadorBrucelose, setVacinadorBrucelose] = useState<any | null>(dados?.vacinadorBrucelose ?? (preenchendoRegistro && nomeDoencaInicial === "Brucelose" ? { id: 1, vetId: 1, nome: "Eloiza Silva", documento: "444.009.956-40" } : null));
  const [mordidaMorcego, setMordidaMorcego] = useState(dados?.mordidaMorcego ?? (preenchendoRegistro ? "Não" : ""));
  const [regime, setRegime] = useState(dados?.regime ?? (preenchendoRegistro ? (nomeDoencaInicial === "Brucelose" ? "Vacina Oficial" : "Primeira Dose") : ""));

  // ---- Saldo de Vacinas e Lotes ----
  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [lotesEstoque, setLotesEstoque] = useState<any[]>(() => {
    if (typeof window === "undefined") return LOTES_MOCK;

    try {
      const estoqueSalvo = JSON.parse(localStorage.getItem(ESTOQUE_KEY) || "[]");
      if (!Array.isArray(estoqueSalvo) || estoqueSalvo.length === 0) return LOTES_MOCK;

      return LOTES_MOCK.map((loteBase) => ({
        ...loteBase,
        ...(estoqueSalvo.find((loteSalvo: any) => loteSalvo.id === loteBase.id) || {}),
        quantidadeDoses: 0,
        quantidadeFrascos: 0,
        frascosCompletosUtilizados: 0,
        frascosParciaisNovos: [],
        usosFrascosAbertos: {},
      }));
    } catch {
      return LOTES_MOCK;
    }
  });
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>(dados?.notasFiscaisOrigem ?? []);
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  const [loteOtimizadoAberto, setLoteOtimizadoAberto] = useState<string | null>(null);
  const [etapaOtimizarFrascos, setEtapaOtimizarFrascos] = useState(0);
  const [vacinados, setVacinados] = useState<VacinadosRow[]>(dados?.vacinados ?? (preenchendoRegistro ? INITIAL_VACINADOS.map((linha, index) => ({ ...linha, machos: index === 0 ? 4 : 0, femeas: index === 0 ? 6 : 0 })) : INITIAL_VACINADOS));
  
  const [origemNota, setOrigemNota] = useState(dados?.origemNota ?? (preenchendoRegistro ? "Produtor" : ""));
  const [revendedora, setRevendedora] = useState<any | null>(dados?.revendedora ?? (preenchendoRegistro ? { id: 1, codigo: "3120938028", nome: "Comercial AgroVet" } : null));

  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  // 🚀 ESTADO PARA GUARDAR O REGISTRO RECÉM-CRIADO
  const [registroSalvo, setRegistroSalvo] = useState<any>(null);

  const hoje = new Date().toISOString().slice(0, 10);

  const exigeNucleo = useMemo(() => {
    if (!exploracao) return false;
    const grupo = exploracao.grupoEspecieFormatado || "";
    return GRUPOS_COM_NUCLEO.some((g) => grupo.includes(g));
  }, [exploracao]);

  const isRaiva = doenca?.nome === "Raiva";
  const isBrucelose = doenca?.nome === "Brucelose";
  
  const DOSES_DISPONIVEIS = notasFiscaisOrigem.reduce((sum, item) => sum + (item.dosesDisponiveisTotais || 0), 0);
  const utilizadas = vacinados.reduce((s, r) => s + r.machos + r.femeas, 0);
  const saldo = DOSES_DISPONIVEIS - utilizadas;

  const erroDataVac = dataVacinacao !== "" && dataVacinacao > hoje;
  const erroDataAtestado = dataAtestado !== "" && (dataAtestado > hoje || (dataVacinacao !== "" && dataAtestado < dataVacinacao));
  const dosesValidas = utilizadas > 0 && saldo >= 0;

  const formValido =
    !!produtor && !!estabelecimento && !!exploracao && (!exigeNucleo || !!nucleo) &&
    !!doenca && regime !== "" && dataVacinacao !== "" && dataAtestado !== "" && !!veterinario &&
    (!isRaiva || mordidaMorcego !== "") &&
    origemNota !== "" && !!revendedora &&
    dosesValidas && !erroDataVac && !erroDataAtestado;

  const tipoVacinaDisponivel = (doenca?.tiposVacina?.length ?? 0) > 0;
  const opcoesRegime = isBrucelose
    ? ["Vacina Oficial", "Vacina Complementar"]
    : ["Primeira Dose", "Dose de Reforço"];

  const mostrarVacinacaoENota = !!produtor && !!doenca;

  const { faixas: faixasTabela, mostrarMachos, mostrarFemeas } = derivarFaixas(doenca?.nome, regime);
  const statusColLabel = regime === "Vacina Oficial" || regime === "Primeira Dose" ? "Não Vacinados" : "Já Vacinados";
  const vacinadosView: VacinadosRow[] = faixasTabela.map((_, i) => vacinados[i] ?? { machos: 0, femeas: 0 });

  const estabsFiltrados = produtor ? ESTABELECIMENTOS_MOCK.filter((e) => e.produtorId === produtor.id) : [];
  const exploracoesFiltradas = estabelecimento && produtor
  ? EXPLORACOES_MOCK.filter((e) => e.estabId === estabelecimento.id && e.produtorId === produtor.id)
  : [];

  const databaseProdutor = PRODUTORES_MOCK.filter((p) => (!tipoPessoa ? true : p.tipo === tipoPessoa));
  const colunasModalProdutor = [
    { label: "Nome", key: "nome" },
    { label: "Documento", key: "documento" },
  ];

  const handleChangeVacinados = (i: number, g: "machos" | "femeas", v: number) =>
    setVacinados((prev) => prev.map((row, idx) => (idx === i ? { ...row, [g]: v } : row)));

  const handleReset = () => {
    setVacinados(AGE_RANGES.map(() => ({ machos: 0, femeas: 0 })));
  };

  const handleSalvar = () => {
    setTentouSalvar(true);

    if (mode === "create") {
      const lotesAtualizados = lotesEstoque.map((lote) => {
        const movimentacao = notasFiscaisOrigem.find((item) => item.id === lote.id);
        if (!movimentacao) return lote;

        const dosesPorFrasco = lote.dosesPerFrasco || 20;
        const frascosFechadosAtuais = lote.frascosFechadosDisponiveis || 0;
        const frascosAbertosAtuais = Array.isArray(lote.frascosAbertosEstoque) ? lote.frascosAbertosEstoque : [];
        const usosFrascosAbertos = movimentacao.usosFrascosAbertos || {};
        const frascosAbertosRestantes = frascosAbertosAtuais
          .map((frasco: any) => ({
            ...frasco,
            saldoDoses: Math.max(frasco.saldoDoses - Math.min(frasco.saldoDoses, usosFrascosAbertos[frasco.id] || 0), 0),
          }))
          .filter((frasco: any) => frasco.saldoDoses > 0);

        const frascosCompletosUtilizados = Math.min(
          frascosFechadosAtuais,
          Math.max(0, movimentacao.frascosCompletosUtilizados || 0),
        );
        const limiteParciais = Math.max(frascosFechadosAtuais - frascosCompletosUtilizados, 0);
        const frascosParciaisNovos = (Array.isArray(movimentacao.frascosParciaisNovos) ? movimentacao.frascosParciaisNovos : [])
          .slice(0, limiteParciais);
        const novosFrascosComSaldo = frascosParciaisNovos
          .map((frasco: any) => ({
            id: frasco.id,
            saldoDoses: Math.max(dosesPorFrasco - Math.min(dosesPorFrasco, frasco.dosesUsadas || 0), 0),
          }))
          .filter((frasco: any) => frasco.saldoDoses > 0);
        const frascosAbertosEstoque = [...frascosAbertosRestantes, ...novosFrascosComSaldo];
        const frascosFechadosDisponiveis = Math.max(
          frascosFechadosAtuais - frascosCompletosUtilizados - frascosParciaisNovos.length,
          0,
        );
        const dosesEmFrascosAbertos = frascosAbertosEstoque.reduce((soma: number, frasco: any) => soma + frasco.saldoDoses, 0);

        if (frascosCompletosUtilizados === 0 && frascosParciaisNovos.length === 0 && Object.keys(usosFrascosAbertos).length === 0) return lote;

        return {
          ...lote,
          frascosFechadosDisponiveis,
          frascosAbertosEstoque,
          frascosAbertosDisponiveis: frascosAbertosEstoque.length,
          dosesEmFrascosAbertos,
          dosesDisponiveisTotais: frascosFechadosDisponiveis * dosesPorFrasco + dosesEmFrascosAbertos,
          quantidadeDoses: 0,
          quantidadeFrascos: 0,
          frascosCompletosUtilizados: 0,
          frascosParciaisNovos: [],
          usosFrascosAbertos: {},
        };
      });
      setLotesEstoque(lotesAtualizados);
      localStorage.setItem(ESTOQUE_KEY, JSON.stringify(lotesAtualizados));

      const novoRegistro = {
        id: Date.now(),
        produtorNome: produtor?.nome || "",
        produtorDoc: produtor?.documento || "",
        estabCodigo: estabelecimento?.codigo || "",
        estabNome: estabelecimento?.nome || "",
        municipio: estabelecimento?.municipio || "",
        exploracaoCodigo: exploracao?.codigo || "",
        especie: exploracao?.especie || "",
        doenca: doenca?.nome || "",
        tipoVacina: tipoVacina || "",
        regime: regime || "",
        dataVacinacao: dataVacinacao || "",
        dataAtestado: dataAtestado || "",
        veterinarioNome: veterinario?.nome || "",
        vacinadorNome: vacinadorBrucelose?.nome || "",
        mordidaMorcego: mordidaMorcego || "",
        origemNota: origemNota || "",
        revendedoraNome: revendedora?.nome || "",
        notasFiscaisOrigem: notasFiscaisOrigem || [],
        vacinados: vacinados || [],
        nucleo: nucleo ? { nome: nucleo.nome, codigo: nucleo.codigo } : null,
        situacao: "Ativo"
      };

      const saved = localStorage.getItem(MOCK_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      const newData = [novoRegistro, ...parsed];
      localStorage.setItem(MOCK_KEY, JSON.stringify(newData));
      
      // 🚀 SALVA O REGISTRO PARA ENVIAR PARA A VISUALIZAÇÃO
      setRegistroSalvo(novoRegistro);
    }
    
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
    setNotasFiscaisOrigem([]); 
  };

  const lotesFiltradosModal = lotesEstoque.filter(item =>
    item.compradorTipo === origemNota &&
    item.revendedoraId === revendedora?.id &&
    item.doenca === doenca?.nome &&
    item.dosesDisponiveisTotais > 0
  ).map(item => ({
    ...item,
    doencaComTipo: item.tipoVacina ? `${item.doenca} - ${item.tipoVacina}` : item.doenca
  }));

  return (
    <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5] pb-24")}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button onClick={() => onNavigate("declaracao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Declarações de Vacinação
          </button>
          <CadastroVacinacaoHeader mode={mode} nomeCadastro="Declaração de Vacinação" rotaEditar="editar-declaracao-vacinacao" dados={dados} onNavigate={onNavigate} onSubmit={handleSalvar} />
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
          <div className="grid grid-cols-1 gap-4 items-end">
            
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
                  mostrarMunicipio
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
          <div className="flex flex-wrap gap-4 items-end w-full">

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

            {doenca && (
              <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
                <FloatSelect
                  label="Vacinação"
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
              <div className="w-full flex flex-col gap-2 mt-2 p-3 rounded-lg ">
                <span className="text-xs font-semibold text-gray-700">
                  Recentemente, tem observado mordidas de morcegos nos animais do rebanho? <span className="text-red-500">*</span>
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


        {/* Seção 2: Saldo de Vacinas */}
        {mostrarVacinacaoENota && (
          <Section title="Saldo de Vacinas">
            <div className="flex flex-col gap-4">

              {/* Origem e Revendedora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatSelect
                  label="Origem do Saldo"
                  required
                  value={origemNota}
                  onChange={(v: string) => {
                    setOrigemNota(v);
                    setNotasFiscaisOrigem([]); // Limpa as notas se a origem mudar
                  }}
                  options={[
                    { value: "Produtor", label: "Produtor" },
                    { value: "Médico Veterinário", label: "Médico Veterinário" },
                    { value: "Vacinador", label: "Vacinador" },
                  ]}
                  error={err(origemNota === "")}
                />
                
                <EntitySearchInput
                  label="Revendedora de Insumos"
                  required
                  placeholder="Buscar revendedora..."
                  value={revendedora ? revendedora.nome : ""}
                  data={REVENDEDORAS_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "CNPJ", key: "documento" }
                  ]}
                  icon={<Store size={18} color={GREEN} />}
                  title="Buscar Revendedora"
                  subtitle="Busque por uma revendedora cadastrada:"
                  onChange={(ent) => {
                    setRevendedora(ent);
                    setNotasFiscaisOrigem([]); // Limpa as notas se a revendedora mudar
                  }}
                  error={err(!revendedora)}
                />
              </div>

              {/* Título interno, Total de Doses e o Botão */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Saldo de doses</span>
                  </div>

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
                  disabled={!origemNota || !revendedora}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalNotaOrigemOpen(true);
                  }}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${origemNota && revendedora
                    ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer"
                    : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                >
                  <PlusCircle size={18} />
                  Adicionar Saldo
                </button>
              </div>

              {/* Lotes vinculados e Dashboard */}
              {(!origemNota || !revendedora) && (
                <div className="text-left py-4">
                  <p className="text-xs text-gray-400 italic">É necessário selecionar a Origem do Saldo e a Revendedora para pesquisar notas fiscais.</p>
                </div>
              )}

              {(origemNota && revendedora && notasFiscaisOrigem.length === 0) && (
                <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                  <p className="text-sm text-gray-400 italic">Nenhum lote vinculado até o momento.</p>
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

                        <div className="flex items-center justify-between mb-4 px-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex items-center gap-2 cursor-pointer select-none group/title"
                              onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                            >
                              <Package size={24} color={GREEN} />
                              <span className="text-sm font-bold text-gray-600 group-hover/title:text-gray-600 transition-colors">Lote:</span>
                              <span className="text-sm font-bold text-gray-800 group-hover/title:text-gray-600 transition-colors">{grupo.nome}</span>
                            </div>

                            <div className="relative group/info overflow-visible flex items-center">
                              <div className="relative cursor-help text-gray-400 hover:text-gray-600 transition z-20 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                <div className="fixed inset-0 bg-black/15 hidden group-hover/info:block pointer-events-none z-[998] animate-fadeIn" />

                                <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover/info:block animate-fadeIn z-[999] text-left overflow-hidden">
                                  <div className="flex items-center gap-1.5 bg-gray-50 border-b border-gray-100 p-3">
                                    <Package size={13} className="text-gray-500" />
                                    <span className="text-[11px] font-extrabold text-gray-800">Nº de Partida:{" "}{grupo.nome}</span>                                  
                                  </div>
                                  <div className="p-3 flex flex-col gap-2 text-[11px] text-gray-500 bg-white">
                                    <div className="flex justify-between items-center gap-3">
                                      <span>Doença:</span>
                                      <span className="font-bold text-gray-700 text-right">{[...new Set(grupo.partidas.map((p: any) => p.doenca).filter(Boolean))].join(", ") || "—"}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-3">
                                      <span>Tipo de Vacina:</span>
                                      <span className="font-bold text-gray-700 text-right">{[...new Set(grupo.partidas.map((p: any) => p.tipoVacina).filter(Boolean))].join(", ") || "—"}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-3">
                                      <span>Laboratório:</span>
                                      <span className="font-bold text-gray-700 text-right">{[...new Set(grupo.partidas.map((p: any) => p.laboratorio).filter(Boolean))].join(", ") || "—"}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-3">
                                      <span>Validade:</span>
                                      <span className="font-bold text-gray-700 text-right">{[...new Set(grupo.partidas.map((p: any) => p.validade).filter(Boolean))].join(", ") || "—"}</span>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                                    <span>Doses Totais Lote:</span>
                                    <span>{grupo.partidas.reduce((soma: number, p: any) => soma + (p.dosesDisponiveisTotais || 0), 0)}</span>
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

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded transition hover:bg-gray-100"
                            >
                              {isNotaMinimizada ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            </button>

                            <button
                              type="button"
                              onClick={() => setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.nome !== grupo.nome))}
                              className="text-gray-400 hover:text-red-500 p-1 rounded transition hover:bg-red-50"
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
                                  { name: "Disponíveis", value: TOTAL_DISPONIVEL, color: "#22c55e" },
                                ];

                              const estaAtivoNesteLote = graficoAtivo?.loteId === nfItem.id;
                              const fatiaAtiva = estaAtivoNesteLote ? dadosGrafico[graficoAtivo.index] : null;
                              const totalDosesGrafico = dadosGrafico.reduce((s, d) => s + d.value, 0);
                              const porcentagem = fatiaAtiva ? ((fatiaAtiva.value / totalDosesGrafico) * 100).toFixed(1) : null;
                              const DOSES_DISPONIVEIS = dadosGrafico.find(d => d.name === "Disponíveis")?.value ?? 0;
                              const FRASCOS_FECHADOS_ATUAIS = nfItem.frascosFechadosDisponiveis ?? Math.floor(DOSES_DISPONIVEIS / DOSES_POR_FRASCO);
                              const FRASCOS_ABERTOS_ATUAIS = Array.isArray(nfItem.frascosAbertosEstoque) ? nfItem.frascosAbertosEstoque : [];
                              const DOSES_NOS_ABERTOS_ATUAIS = FRASCOS_ABERTOS_ATUAIS.reduce((soma: number, frasco: any) => soma + frasco.saldoDoses, 0);
                              const USOS_FRASCOS_ABERTOS = nfItem.usosFrascosAbertos || {};
                              const FRASCOS_COMPLETOS_UTILIZADOS = Math.min(
                                FRASCOS_FECHADOS_ATUAIS,
                                Math.max(0, nfItem.frascosCompletosUtilizados || 0),
                              );
                              const FRASCOS_PARCIAIS_NOVOS = Array.isArray(nfItem.frascosParciaisNovos) ? nfItem.frascosParciaisNovos : [];
                              const DOSES_USADAS_DOS_ABERTOS = FRASCOS_ABERTOS_ATUAIS.reduce(
                                (soma: number, frasco: any) => soma + Math.min(frasco.saldoDoses, USOS_FRASCOS_ABERTOS[frasco.id] || 0),
                                0,
                              );
                              const DOSES_USADAS_NOS_PARCIAIS = FRASCOS_PARCIAIS_NOVOS.reduce(
                                (soma: number, frasco: any) => soma + Math.min(DOSES_POR_FRASCO, frasco.dosesUsadas || 0),
                                0,
                              );
                              const DOSES_UTILIZADAS = FRASCOS_COMPLETOS_UTILIZADOS * DOSES_POR_FRASCO + DOSES_USADAS_DOS_ABERTOS + DOSES_USADAS_NOS_PARCIAIS;
                              const FRASCOS_FECHADOS_APOS = Math.max(FRASCOS_FECHADOS_ATUAIS - FRASCOS_COMPLETOS_UTILIZADOS - FRASCOS_PARCIAIS_NOVOS.length, 0);
                              const FRASCOS_ABERTOS_APOS_LISTA = [
                                ...FRASCOS_ABERTOS_ATUAIS.map((frasco: any) => ({
                                  ...frasco,
                                  saldoDoses: Math.max(frasco.saldoDoses - Math.min(frasco.saldoDoses, USOS_FRASCOS_ABERTOS[frasco.id] || 0), 0),
                                })).filter((frasco: any) => frasco.saldoDoses > 0),
                                ...FRASCOS_PARCIAIS_NOVOS.map((frasco: any) => ({
                                  id: frasco.id,
                                  saldoDoses: Math.max(DOSES_POR_FRASCO - Math.min(DOSES_POR_FRASCO, frasco.dosesUsadas || 0), 0),
                                })).filter((frasco: any) => frasco.saldoDoses > 0),
                              ];
                              const FRASCOS_ABERTOS_APOS = FRASCOS_ABERTOS_APOS_LISTA.length;
                              const DOSES_RESTANTES_NOS_ABERTOS = FRASCOS_ABERTOS_APOS_LISTA.reduce((soma: number, frasco: any) => soma + frasco.saldoDoses, 0);

                              const atualizarMovimentacao = (mudancas: Record<string, any>) => {
                                setNotasFiscaisOrigem((itensAtuais) => itensAtuais.map((item) => {
                                  if (item.id !== nfItem.id) return item;
                                  const atualizado = { ...item, ...mudancas };
                                  const completos = Math.max(0, atualizado.frascosCompletosUtilizados || 0);
                                  const parciais = Array.isArray(atualizado.frascosParciaisNovos) ? atualizado.frascosParciaisNovos : [];
                                  const usosAbertos = atualizado.usosFrascosAbertos || {};
                                  const dosesAbertos = FRASCOS_ABERTOS_ATUAIS.reduce(
                                    (soma: number, frasco: any) => soma + Math.min(frasco.saldoDoses, usosAbertos[frasco.id] || 0),
                                    0,
                                  );
                                  const dosesParciais = parciais.reduce(
                                    (soma: number, frasco: any) => soma + Math.min(DOSES_POR_FRASCO, frasco.dosesUsadas || 0),
                                    0,
                                  );
                                  return {
                                    ...atualizado,
                                    quantidadeDoses: completos * DOSES_POR_FRASCO + dosesAbertos + dosesParciais,
                                    quantidadeFrascos: completos + parciais.length,
                                  };
                                }));
                              };

                              return (
                                <div
                                  key={`lote-${nfItem.id}`}
                                  className={`border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto ${isLoteMinimizado ? "p-2.5 pb-2 justify-start" : "p-4 justify-between"}`}
                                >
                                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                    <button
                                      type="button"
                                      onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteExpandido }))}
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition hover:bg-gray-100"
                                    >
                                      {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.id !== nfItem.id))}
                                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition hover:bg-red-50"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>

                                  <div className={`flex items-center justify-between border-gray-100 overflow-visible pr-14 ${isLoteMinimizado ? "border-none pb-0 mb-0" : "border-b pb-2 mb-3"}`}>
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
                                          ({DOSES_DISPONIVEIS} disp. · {nfItem.quantidadeDoses || 0} utilizadas)
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
                                              cx="50%" cy="50%" innerRadius={26} outerRadius={35} paddingAngle={2} dataKey="value" stroke="none"
                                              activeIndex={estaAtivoNesteLote ? graficoAtivo.index : undefined}
                                              activeShape={renderActiveShape}
                                              onMouseEnter={(_, index) => setGraficoAtivo({ loteId: nfItem.id, index })}
                                              onMouseLeave={() => setGraficoAtivo(null)}
                                            >
                                              {dadosGrafico.map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={entry.color} className="cursor-pointer transition-all duration-200 outline-none" />
                                              ))}
                                            </Pie>
                                          </PieChart>
                                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                            {fatiaAtiva ? (
                                              <div className="flex flex-col items-center justify-center">
                                                <span className="text-xs font-bold leading-none animate-fadeIn" style={{ color: fatiaAtiva.color }}>{fatiaAtiva.value}</span>
                                                <span className="text-[7px] text-gray-500 font-semibold leading-tight uppercase truncate max-w-[50px] mt-0.5 animate-fadeIn">{fatiaAtiva.name}</span>
                                                <span className="text-[8px] font-bold mt-0.5 animate-fadeIn" style={{ color: fatiaAtiva.color }}>{porcentagem}%</span>
                                              </div>
                                            ) : (
                                              <div className="flex flex-col items-center justify-center">
                                                <span className="text-base font-black text-gray-800 leading-none">{totalDosesGrafico}</span>
                                                <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Total</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50/80 p-3">
                                          <span className="block text-[11px] text-gray-700 font-bold mb-2">Saldo atual</span>
                                          <div className="grid grid-cols-2 gap-1.5">
                                            <div className="rounded-lg border border-green-200 bg-white px-2 py-1.5 text-center">
                                              <span className="block text-base font-black text-green-700">{FRASCOS_FECHADOS_ATUAIS}</span>
                                              <span className="block text-[8px] font-semibold text-gray-500">Frascos fechados</span>
                                            </div>
                                            <div className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-center">
                                              <span className="block text-base font-black text-blue-700">{FRASCOS_FECHADOS_ATUAIS * DOSES_POR_FRASCO}</span>
                                              <span className="block text-[8px] font-semibold text-gray-500">Doses fechadas</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5">
                                            <span className="text-[9px] font-semibold text-amber-800">Frascos já abertos: {FRASCOS_ABERTOS_ATUAIS.length}</span>
                                            <span className="text-[9px] font-bold text-amber-700">{DOSES_NOS_ABERTOS_ATUAIS} doses disponíveis</span>
                                          </div>
                                        </div>
                                      </div>

                                      {false && <>
                                      {FRASCOS_ABERTOS_ATUAIS.length > 0 && (
                                        <details className="group mt-3 rounded-xl border border-amber-200 bg-amber-50/40">
                                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
                                            <span className="text-[10px] font-bold text-gray-700">Usar doses de frascos já abertos</span>
                                            <span className="text-[9px] font-bold text-amber-700">{DOSES_NOS_ABERTOS_ATUAIS} disponíveis · ver detalhes</span>
                                          </summary>
                                          <div className="flex flex-col gap-1.5 border-t border-amber-100 p-3">
                                            {FRASCOS_ABERTOS_ATUAIS.map((frasco: any, indice: number) => {
                                              const dosesUsadas = Math.min(frasco.saldoDoses, USOS_FRASCOS_ABERTOS[frasco.id] || 0);
                                              return (
                                                <div key={frasco.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white px-3 py-2">
                                                  <span className="text-[10px] font-bold text-gray-700">Frasco aberto #{indice + 1}</span>
                                                  <div className="flex items-center gap-3">
                                                    <span className="text-xs font-black text-amber-700">{frasco.saldoDoses} <span className="text-[8px] font-semibold text-gray-400">disponíveis</span></span>
                                                    <label className="flex items-center gap-1.5">
                                                      <span className="text-[8px] font-semibold text-gray-500">Usar</span>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max={frasco.saldoDoses}
                                                      value={dosesUsadas || ""}
                                                      placeholder="0"
                                                      onChange={(e) => atualizarMovimentacao({
                                                        usosFrascosAbertos: {
                                                          ...USOS_FRASCOS_ABERTOS,
                                                          [frasco.id]: Math.min(frasco.saldoDoses, Math.max(0, Number(e.target.value))),
                                                        },
                                                      })}
                                                      className="w-14 rounded-md border border-amber-200 bg-white p-1 text-center text-xs font-black text-gray-800 focus:border-amber-500 focus:outline-none"
                                                    />
                                                    </label>
                                                    <span className="text-xs font-black text-blue-700">Restam {frasco.saldoDoses - dosesUsadas}</span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </details>
                                      )}

                                      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                                        <div className="flex items-center justify-between gap-3">
                                          <div>
                                            <p className="text-[10px] font-bold text-gray-700">Frascos utilizados por completo</p>
                                            <p className="text-[9px] text-gray-500">Informe somente os frascos fechados que serão consumidos integralmente.</p>
                                          </div>
                                          <div className="flex items-end gap-2">
                                            <label className="w-16 text-center">
                                              <input
                                                type="number"
                                                min="0"
                                                max={Math.max(FRASCOS_FECHADOS_ATUAIS - FRASCOS_PARCIAIS_NOVOS.length, 0)}
                                                value={FRASCOS_COMPLETOS_UTILIZADOS || ""}
                                                placeholder="0"
                                                onChange={(e) => atualizarMovimentacao({
                                                  frascosCompletosUtilizados: Math.min(
                                                    Math.max(FRASCOS_FECHADOS_ATUAIS - FRASCOS_PARCIAIS_NOVOS.length, 0),
                                                    Math.max(0, Number(e.target.value)),
                                                  ),
                                                })}
                                                className="w-full rounded-md border border-gray-200 p-1.5 text-center text-sm font-black text-gray-800 focus:border-[#1A7A3C] focus:outline-none"
                                              />
                                              <span className="block text-[7px] text-gray-400 mt-0.5">Frascos</span>
                                            </label>
                                            <div className="rounded-lg bg-green-50 px-2.5 py-1.5 text-center min-w-[70px]">
                                              <span className="block text-xs font-black text-green-700">{FRASCOS_COMPLETOS_UTILIZADOS * DOSES_POR_FRASCO}</span>
                                              <span className="block text-[7px] text-gray-400">Total de doses</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <details className="group mt-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/30">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
                                          <span className="text-[10px] font-bold text-gray-700">Usar parte de um frasco fechado</span>
                                          <span className="text-[9px] text-gray-500">opcional · ver detalhes</span>
                                        </summary>
                                        <div className="border-t border-amber-100 p-3">
                                          <div className="flex items-center justify-between gap-3">
                                            <p className="text-[9px] text-gray-500">Adicione cada frasco parcial separadamente para preservar seu saldo.</p>
                                          <button
                                            type="button"
                                            disabled={FRASCOS_COMPLETOS_UTILIZADOS + FRASCOS_PARCIAIS_NOVOS.length >= FRASCOS_FECHADOS_ATUAIS}
                                            onClick={() => atualizarMovimentacao({
                                              frascosParciaisNovos: [
                                                ...FRASCOS_PARCIAIS_NOVOS,
                                                { id: `${nfItem.id}-parcial-${Date.now()}-${FRASCOS_PARCIAIS_NOVOS.length}`, dosesUsadas: 0 },
                                              ],
                                            })}
                                            className="inline-flex items-center gap-1 rounded-lg border border-amber-400 bg-white px-2.5 py-1.5 text-[9px] font-bold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                                          >
                                            <PlusCircle size={13} /> Adicionar frasco parcial
                                          </button>
                                        </div>

                                        {FRASCOS_PARCIAIS_NOVOS.length === 0 ? (
                                          <p className="mt-3 text-center text-[9px] italic text-gray-400">Nenhum frasco parcial adicionado nesta vacinação.</p>
                                        ) : (
                                          <div className="mt-3 flex flex-col gap-1.5">
                                            {FRASCOS_PARCIAIS_NOVOS.map((frasco: any, indice: number) => {
                                              const dosesUsadas = Math.min(DOSES_POR_FRASCO, Math.max(0, frasco.dosesUsadas || 0));
                                              return (
                                                <div key={frasco.id} className="grid grid-cols-[1fr_70px_58px_24px] items-end gap-1.5 rounded-lg border border-amber-100 bg-white p-2">
                                                  <div>
                                                    <span className="block text-[9px] font-bold text-gray-700">Novo frasco parcial #{indice + 1}</span>
                                                    <span className="block text-[8px] text-gray-400">Este saldo ficará disponível na próxima vacinação.</span>
                                                  </div>
                                                  <label className="text-center">
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max={DOSES_POR_FRASCO}
                                                      value={dosesUsadas || ""}
                                                      placeholder="0"
                                                      onChange={(e) => atualizarMovimentacao({
                                                        frascosParciaisNovos: FRASCOS_PARCIAIS_NOVOS.map((item: any) =>
                                                          item.id === frasco.id
                                                            ? { ...item, dosesUsadas: Math.min(DOSES_POR_FRASCO, Math.max(0, Number(e.target.value))) }
                                                            : item,
                                                        ),
                                                      })}
                                                      className="w-full rounded-md border border-amber-200 p-1 text-center text-xs font-black text-gray-800 focus:border-amber-500 focus:outline-none"
                                                    />
                                                    <span className="block text-[7px] text-gray-400 mt-0.5">Doses usadas</span>
                                                  </label>
                                                  <div className="text-center">
                                                    <span className="block text-xs font-black text-blue-700">{DOSES_POR_FRASCO - dosesUsadas}</span>
                                                    <span className="block text-[7px] text-gray-400">Sobraram</span>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => atualizarMovimentacao({
                                                      frascosParciaisNovos: FRASCOS_PARCIAIS_NOVOS.filter((item: any) => item.id !== frasco.id),
                                                    })}
                                                    className="mb-2 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                    title="Remover frasco parcial"
                                                  >
                                                    <Trash2 size={14} />
                                                  </button>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                        </div>
                                      </details>
                                      </>}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEtapaOtimizarFrascos(0);
                                          setLoteOtimizadoAberto(String(nfItem.id));
                                        }}
                                        className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed border-[#1A7A3C] bg-green-50/40 px-3 py-2.5 text-left transition hover:bg-green-50"
                                      >
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-[#1A7A3C]"><PillBottle size={15} />Distribuição por frasco</span>
                                        <span className="text-[9px] text-gray-500">Opcional</span>
                                      </button>

                                      {loteOtimizadoAberto === String(nfItem.id) && (
                                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4">
                                          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                                            <div className="relative flex justify-center border-b border-gray-100 px-6 py-5 text-center">
                                              <div>
                                                <h3 className="text-lg font-bold text-gray-900">Distribuição por frasco</h3>
                                                <p className="mt-1 text-sm text-gray-500">Preencha apenas as etapas que forem necessárias.</p>
                                              </div>
                                              <button type="button" onClick={() => setLoteOtimizadoAberto(null)} className="absolute right-6 top-5 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={20} /></button>
                                            </div>

                                            <div className="border-b border-gray-100 px-6 py-2">
                                              <div className="overflow-hidden rounded-xl border border-green-100 bg-[#F7FBF8]">
                                                <div className="flex items-center gap-2 border-b border-green-100/80 px-3 py-2">
                                                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-gray-500"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F4EA] text-[#1A7A3C]"><PillBottle size={12} /></span>Resumo do lote</span>
                                                  <span className="text-gray-300">•</span>
                                                  <span className="text-[10px] font-medium text-gray-700">{nfItem.doenca || "Doença não informada"}</span>
                                                </div>
                                                <div className="grid grid-cols-2 divide-x divide-y divide-green-100/80 sm:grid-cols-4 sm:divide-y-0">
                                                  <div className="px-3 py-2 text-center"><span className="block text-[13px] font-bold leading-none text-gray-800">{DOSES_DISPONIVEIS}</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-wide text-gray-500">Doses em estoque</span></div>
                                                  <div className="px-3 py-2 text-center"><span className="block text-[13px] font-bold leading-none text-gray-800">{FRASCOS_FECHADOS_ATUAIS}</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-wide text-gray-500">Frascos fechados</span></div>
                                                  <div className="px-3 py-2 text-center"><span className="block text-[13px] font-bold leading-none text-gray-800">{FRASCOS_ABERTOS_ATUAIS.length}</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-wide text-gray-500">Frascos abertos</span></div>
                                                  <div className="px-3 py-2 text-center"><span className="block text-[13px] font-bold leading-none text-gray-800">{DOSES_POR_FRASCO}</span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-wide text-gray-500">Doses por frasco</span></div>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="border-b border-gray-100 px-6 py-4">
                                              <div className="grid grid-cols-3 gap-2">
                                                {["Frascos abertos", "Uso completo", "Uso parcial"].map((titulo, indice) => (
                                                  <button key={titulo} type="button" onClick={() => setEtapaOtimizarFrascos(indice)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${etapaOtimizarFrascos === indice ? "bg-[#E6F4EA] text-[#1A7A3C]" : "text-gray-400 hover:bg-gray-50"}`}>
                                                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${etapaOtimizarFrascos === indice ? "bg-[#1A7A3C] text-white" : "bg-gray-100 text-gray-500"}`}>{indice + 1}</span>
                                                    <span className="hidden sm:inline">{titulo}</span>
                                                  </button>
                                                ))}
                                              </div>
                                            </div>

                                            <div className="min-h-[300px] overflow-y-auto px-6 py-5">
                                              {etapaOtimizarFrascos === 0 && (
                                                <div className="flex flex-col gap-3">
                                                  {FRASCOS_ABERTOS_ATUAIS.length === 0 ? <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">Não há frascos abertos disponíveis.</p> : FRASCOS_ABERTOS_ATUAIS.map((frasco: any, indice: number) => {
                                                    const dosesUsadas = Math.min(frasco.saldoDoses, USOS_FRASCOS_ABERTOS[frasco.id] || 0);
                                                    return <div key={frasco.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3"><div><p className="text-sm font-semibold text-gray-800">Frasco aberto #{indice + 1}</p><p className="text-xs text-gray-500">{frasco.saldoDoses} doses disponíveis</p></div><Stepper value={dosesUsadas} max={frasco.saldoDoses} accentColor="#B45309" onChange={(value) => atualizarMovimentacao({ usosFrascosAbertos: { ...USOS_FRASCOS_ABERTOS, [frasco.id]: value } })} /></div>;
                                                  })}
                                                </div>
                                              )}

                                              {etapaOtimizarFrascos === 1 && (
                                                <div className="flex flex-col gap-5"><div className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><div><p className="text-sm font-semibold text-gray-800">Frascos fechados</p><p className="text-xs text-gray-500">Até {Math.max(FRASCOS_FECHADOS_ATUAIS - FRASCOS_PARCIAIS_NOVOS.length, 0)} disponíveis</p></div><Stepper value={FRASCOS_COMPLETOS_UTILIZADOS} max={Math.max(FRASCOS_FECHADOS_ATUAIS - FRASCOS_PARCIAIS_NOVOS.length, 0)} accentColor={GREEN} onChange={(value) => atualizarMovimentacao({ frascosCompletosUtilizados: value })} /></div></div>
                                              )}

                                              {etapaOtimizarFrascos === 2 && (
                                                <div className="flex flex-col gap-3"><div className="flex justify-end"><button type="button" disabled={FRASCOS_COMPLETOS_UTILIZADOS + FRASCOS_PARCIAIS_NOVOS.length >= FRASCOS_FECHADOS_ATUAIS} onClick={() => atualizarMovimentacao({ frascosParciaisNovos: [...FRASCOS_PARCIAIS_NOVOS, { id: `${nfItem.id}-parcial-${Date.now()}-${FRASCOS_PARCIAIS_NOVOS.length}`, dosesUsadas: 0 }] })} className="shrink-0 rounded-md border border-[#1A7A3C] px-3 py-2 text-xs font-bold text-[#1A7A3C] hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"><PlusCircle size={14} className="mr-1 inline" />Adicionar</button></div>{FRASCOS_PARCIAIS_NOVOS.length === 0 ? <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">Nenhum frasco parcial adicionado.</p> : FRASCOS_PARCIAIS_NOVOS.map((frasco: any, indice: number) => { const dosesUsadas = Math.min(DOSES_POR_FRASCO, Math.max(0, frasco.dosesUsadas || 0)); return <div key={frasco.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3"><div><p className="text-sm font-semibold text-gray-800">Frasco parcial #{indice + 1}</p><p className="text-xs text-gray-500">Restarão {DOSES_POR_FRASCO - dosesUsadas} doses</p></div><div className="flex items-center gap-2"><Stepper value={dosesUsadas} max={DOSES_POR_FRASCO} accentColor="#B45309" onChange={(value) => atualizarMovimentacao({ frascosParciaisNovos: FRASCOS_PARCIAIS_NOVOS.map((item: any) => item.id === frasco.id ? { ...item, dosesUsadas: value } : item) })} /><button type="button" onClick={() => atualizarMovimentacao({ frascosParciaisNovos: FRASCOS_PARCIAIS_NOVOS.filter((item: any) => item.id !== frasco.id) })} className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button></div></div>; })}</div>
                                              )}
                                            </div>

                                            <div className="border-t border-gray-100 px-6 py-4">
                                              <div className="flex items-center justify-between gap-12">
                                                <div className="min-w-0 flex-1">
                                                <div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-semibold text-gray-600">{nfItem.doenca ? `Doença: ${nfItem.doenca}` : "Selecionado para esta vacinação"}</span><span className="font-bold text-[#1A7A3C]">{DOSES_UTILIZADAS} de {DOSES_DISPONIVEIS} doses</span></div>
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#1A7A3C] transition-all" style={{ width: `${DOSES_DISPONIVEIS ? Math.min((DOSES_UTILIZADAS / DOSES_DISPONIVEIS) * 100, 100) : 0}%` }} /></div>
                                                <p className="mt-1 text-[10px] text-gray-400">{FRASCOS_COMPLETOS_UTILIZADOS + FRASCOS_PARCIAIS_NOVOS.length} frascos fechados selecionados</p>
                                                </div>
                                                <div className="flex shrink-0 gap-2"><button type="button" disabled={etapaOtimizarFrascos === 0} onClick={() => setEtapaOtimizarFrascos((etapa) => etapa - 1)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40">Voltar</button>{etapaOtimizarFrascos < 2 ? <button type="button" onClick={() => setEtapaOtimizarFrascos((etapa) => etapa + 1)} className="rounded-md bg-[#1A7A3C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15612F]">Próximo</button> : <button type="button" onClick={() => setLoteOtimizadoAberto(null)} className="rounded-md bg-[#1A7A3C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15612F]">Concluir</button>}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {(DOSES_UTILIZADAS > 0 || FRASCOS_PARCIAIS_NOVOS.length > 0) && (
                                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                                          <div className="flex items-start gap-2">
                                            <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                              <p className="text-[10px] font-bold text-gray-700">Saldo após esta vacinação</p>
                                              <p className="text-[9px] text-gray-500 mt-0.5">Foram registradas {DOSES_UTILIZADAS} doses utilizadas, mantendo cada frasco parcial identificado.</p>
                                              <div className="grid grid-cols-3 gap-1.5 mt-2">
                                                <div className="rounded-lg border border-green-200 bg-white px-2 py-1.5 text-center">
                                                  <span className="block text-sm font-black text-green-700">{FRASCOS_FECHADOS_APOS}</span>
                                                  <span className="block text-[8px] font-semibold text-gray-500">Fechados</span>
                                                </div>
                                                <div className="rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-center">
                                                  <span className="block text-sm font-black text-amber-700">{FRASCOS_ABERTOS_APOS}</span>
                                                  <span className="block text-[8px] font-semibold text-gray-500">Abertos</span>
                                                </div>
                                                <div className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-center">
                                                  <span className="block text-sm font-black text-blue-700">{DOSES_RESTANTES_NOS_ABERTOS}</span>
                                                  <span className="block text-[8px] font-semibold text-gray-500">Doses nos abertos</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px] z-10">
                                        {dadosGrafico.filter((item) => item.name).map((item) => (
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

        {/* ── VACINAÇÃO ── */}
        {mostrarVacinacaoENota && regime !== "" && (() => {
          const totalDisponivel = notasFiscaisOrigem.reduce((sum, item) => sum + (item.dosesDisponiveisTotais || 0), 0);
          const saldoRestante = totalDisponivel - (utilizadas || 0);

          return (
            <SectionCard title="Vacinação">
              <SummaryCards disponiveis={totalDisponivel} utilizadas={utilizadas} saldo={saldoRestante} />
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
            options={[{ value: "PF", label: "Pessoa Física" }, { value: "PJ", label: "Pessoa Jurídica" }]}
          />
        }
      />

      {/* Modal de Notas Fiscais - Agora com dados dinâmicos da pesquisa */}
      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacinas"
        subtitle="Selecione os lotes de vacina desejados para vincular a este ajuste:"
        icon={<Package size={24} color={GREEN} />}
        data={lotesFiltradosModal}
        searchKeys={["nome", "partida", "doenca", "tipoVacina", "fornecedor", "uf"]}
        searchPlaceholder="Busque por lote ou doença."
        showResultsOnOpen
        columns={[
          { label: "Lote/ Nº de Partida", key: "nome" },
          { label: "Vacina", key: "doencaComTipo" },
          { label: "Saldo da Apresentação", key: "dosesDisponiveisTotais" },
          { label: "UF", key: "uf" }
        ]}
        selectedItems={notasFiscaisOrigem}
        onConfirm={(selectedValues) => {
          setNotasFiscaisOrigem(selectedValues);
        }}
      />

      {/* ============ CARD DE SUCESSO ============ */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Declaração de Vacinação adicionada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              A declaração de vacinação foi adicionada como um novo registro no sistema.
            </p>
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => onNavigate("declaracao-vacinacao")}
                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold border-2 border-[#1A7A3C] text-[#1A7A3C] transition hover:bg-green-50/50"
              >
                Voltar
              </button>
              <button
                type="button"
                // 🚀 MUDEI A ROTA PARA A VISUALIZAÇÃO PASSANDO O REGISTRO SALVO
                onClick={() => onNavigate("visualizar-declaracao-vacinacao", registroSalvo)}
                className="flex-1 px-5 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 shadow-sm"
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

export default AdicionarDeclaracaoVacinacaoPage;
