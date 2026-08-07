import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Syringe,
  CheckCircle2,
  Info,
  Calendar,
  FlaskConical, PlusCircle, ChevronUp, ChevronDown, Trash2, Store, Check, RotateCcw, Package, PillBottle
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
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { CadastroVacinacaoHeader, cadastroVacinacaoPageClass, mensagemSucessoCadastro, preencherComExemplo, type CadastroVacinacaoModeProps } from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";
const MOCK_KEY = "DECLARACOES_VACINA_DB";

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
    codigo: "312345678910109",
    estabelecimentoFormatado: "31234567891 -\n Fazenda do Rio",
    grupoEspecieFormatado: "Bovinos -\n Bovino",
    produtoresFormatado: "555.009.956-40 -\n  José Aarão Neto"
  }
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose", tiposVacina: ["B19", "RB51"] },
  { id: 2, nome: "Febre Aftosa", tiposVacina: [] },
  { id: 3, nome: "Raiva", tiposVacina: [] },
];

const VACINADORES_MOCK = [
  { id: 1, vetId: 1, nome: "Pedro Alves", documento: "222.114.558-70" },
  { id: 2, vetId: 2, nome: "Carla Menezes", documento: "111.998.775-30" },
];

const AGE_RANGES = [
  "De 3 a 8 meses",
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

function derivarFaixas(doencaNome: string | undefined, regime: string): {
  faixas: any[];
  mostrarMachos: boolean;
  mostrarFemeas: boolean;
} {
  const isBrucelose = doencaNome === "Brucelose";
  const linhaPadrao = (label: string) => ({
    label,
    machos: { existentes: 100, naoVacinados: 80 },
    femeas: { existentes: 100, naoVacinados: 80 },
  });

  if (isBrucelose) {
    if (regime === "Vacina Oficial") {
      return { faixas: [linhaPadrao("De 0 a 8 meses")], mostrarMachos: false, mostrarFemeas: true };
    }
    return { faixas: AGE_RANGES.slice(1).map(linhaPadrao), mostrarMachos: false, mostrarFemeas: true };
  }
  return { faixas: AGE_RANGES.map(linhaPadrao), mostrarMachos: true, mostrarFemeas: true };
}

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
        className="w-8 h-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[16px] font-medium leading-none border-r border-[#e2e8f0]/60"
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
        className="w-8 h-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors text-[16px] font-medium leading-none border-l border-[#e2e8f0]/60 disabled:opacity-30 disabled:cursor-not-allowed"
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

function VaccinationTable({
  faixas,
  mostrarMachos,
  mostrarFemeas,
  statusLabel,
  vacinados,
  onChange,
  onReset,
}: {
  faixas: any[];
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

interface PageProps extends CadastroVacinacaoModeProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDeclaracaoVacinacaoPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const { role } = useDemoUser();
  const produtorEhUsuario = role === "produtor";
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
    : produtorEhUsuario ? PRODUTORES_MOCK[0] : null);
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

  const [produtor, setProdutor] = useState<any | null>(produtorInicial);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(estabelecimentoInicial);
  const [exploracao, setExploracao] = useState<any | null>(exploracaoInicial);
  const [nucleo, setNucleo] = useState<any | null>(dados?.nucleo ?? null);

  const [doenca, setDoenca] = useState<any | null>(doencaInicial);
  const [tipoVacina, setTipoVacina] = useState(dados?.tipoVacina ?? (nomeDoencaInicial === "Brucelose" && preenchendoRegistro ? "B19" : ""));
  const [dataVacinacao, setDataVacinacao] = useState(dados?.dataVacinacao ?? "");
  const [dataAtestado, setDataAtestado] = useState(dados?.dataAtestado ?? (preenchendoRegistro ? dataVacinacaoInicial : ""));
  const [veterinario, setVeterinario] = useState<any | null>(dados?.veterinario ?? (preenchendoRegistro ? { id: 1, nome: "Dr. Roberto Silva", cpf: "123.456.789-00" } : null));
  const [vacinadorBrucelose, setVacinadorBrucelose] = useState<any | null>(dados?.vacinadorBrucelose ?? (preenchendoRegistro && nomeDoencaInicial === "Brucelose" ? { id: 1, vetId: 1, nome: "Eloiza Silva", documento: "444.009.956-40" } : null));
  const [mordidaMorcego, setMordidaMorcego] = useState(dados?.mordidaMorcego ?? (preenchendoRegistro ? "Não" : ""));

  const [regime, setRegime] = useState(dados?.regime ?? dados?.tipoDeclaracao ?? (preenchendoRegistro ? (nomeDoencaInicial === "Brucelose" ? "Vacina Oficial" : "Primeira Dose") : ""));

  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>(dados?.notasFiscaisOrigem ?? (preenchendoRegistro ? [{
    id: `lote-${dados?.id ?? "registro"}`,
    nome: dados?.numeroPartida ?? "0013225/24",
    partida: "1",
    uf: dados?.ufNotaFiscal ?? "MG",
    dosesDisponiveisTotais: 120,
    quantidadeDoses: 10,
    quantidadeFrascos: 1,
    dosesPerFrasco: 10,
    fornecedor: "Distribuidora de Vacinas Alfa LTDA",
    doenca: nomeDoencaInicial || "Brucelose",
    tipoVacina: dados?.tipoVacina ?? (nomeDoencaInicial === "Brucelose" ? "B19" : ""),
    laboratorio: "BioMed/MG",
    validade: "20/12/2026",
  }] : []));

  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});

  const [vacinados, setVacinados] = useState<VacinadosRow[]>(dados?.vacinados ?? (preenchendoRegistro ? INITIAL_VACINADOS.map((linha, index) => ({ ...linha, machos: index === 0 ? 4 : 0, femeas: index === 0 ? 6 : 0 })) : INITIAL_VACINADOS));
  const [origemNota, setOrigemNota] = useState(dados?.origemNota ?? (preenchendoRegistro ? "Produtor" : ""));
  const [revendedora, setRevendedora] = useState<any | null>(dados?.revendedora ?? (preenchendoRegistro ? { codigo: "3120938028", nome: "Comercial AgroVat" } : null));
  const DOSES_DISPONIVEIS = 70;

  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const hoje = new Date().toISOString().slice(0, 10);

  const exigeNucleo = useMemo(() => {
    return doenca?.exigeNucleo || false;
  }, [doenca]);

  const isRaiva = doenca?.nome === "Raiva";
  const dataAtestadoObrigatoria = doenca?.nome === "Brucelose";

  const utilizadas = vacinados.reduce((s, r) => s + r.machos + r.femeas, 0);
  const saldo = DOSES_DISPONIVEIS - utilizadas;

  const erroDataVac = dataVacinacao !== "" && dataVacinacao > hoje;
  const erroDataAtestado = dataAtestado !== "" && (dataAtestado > hoje || (dataVacinacao !== "" && dataAtestado < dataVacinacao));
  const dosesValidas = utilizadas > 0 && saldo >= 0;

  const formValido =
    !!produtor && !!estabelecimento && !!exploracao && (!exigeNucleo || !!nucleo) &&
    !!doenca && regime !== "" && dataVacinacao !== "" && (!dataAtestadoObrigatoria || dataAtestado !== "") && !!veterinario &&
    (!isRaiva || mordidaMorcego !== "") &&
    origemNota !== "" && !!revendedora &&
    dosesValidas && !erroDataVac && !erroDataAtestado;

  const isBrucelose = doenca?.nome === "Brucelose";
  const tipoVacinaDisponivel = (doenca?.tiposVacina?.length ?? 0) > 0;
  const tiposVacinaFiltrados = doenca?.tiposVacina ?? [];
  const opcoesRegime = isBrucelose
    ? ["Vacina Oficial", "Vacina Complementar"]
    : ["Primeira Dose", "Dose de Reforço"];

  const mostrarVacinacaoENota = !!produtor && !!doenca;

  const { faixas: faixasTabela, mostrarMachos, mostrarFemeas } = derivarFaixas(doenca?.nome, regime);
  const statusColLabel = regime === "Dose de Reforço" ? "Já Vacinados na Etapa" : "Não Vacinados";
  const vacinadosView: VacinadosRow[] = faixasTabela.map((_, i) => vacinados[i] ?? { machos: 0, femeas: 0 });

  const estabsFiltrados = produtor ? ESTABELECIMENTOS_MOCK.filter((e) => e.produtorId === produtor.id) : [];
  const exploracoesFiltradas = EXPLORACOES_MOCK;

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
    if (!formValido) return;

    const novaDeclaracao = {
      id: Date.now(),
      tipoDeclaracao: regime,
      produtorNome: produtor?.nome || "",
      produtorDoc: produtor?.documento || "",
      estabCodigo: estabelecimento?.codigo || "",
      estabNome: estabelecimento?.nome || "",
      municipio: estabelecimento?.municipio || "Lavras",
      exploracaoCodigo: exploracao?.codigo || "",
      especie: exploracao?.especie || "Bovino",
      doenca: doenca?.nome || "",
      dataVacinacao: dataVacinacao,
      dataAtestado: dataAtestado,
      tipoVacina: tipoVacina || "—",
      situacao: "Ativo" as const,
      produtor,
      estabelecimento,
      exploracao,
      nucleo,
      doencaEntidade: doenca,
      veterinario,
      vacinadorBrucelose,
      mordidaMorcego,
      origemNota,
      revendedora,
      notasFiscaisOrigem,
      vacinados,
    };

    const stored = localStorage.getItem(MOCK_KEY);
    const db = stored ? JSON.parse(stored) : [];
    db.unshift(novaDeclaracao);
    localStorage.setItem(MOCK_KEY, JSON.stringify(db));

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

  const registroAtual = {
    id: dados?.id ?? Date.now(),
    tipoDeclaracao: regime,
    produtorNome: produtor?.nome || "",
    produtorDoc: produtor?.documento || "",
    estabCodigo: estabelecimento?.codigo || "",
    estabNome: estabelecimento?.nome || "",
    municipio: estabelecimento?.municipio || "Lavras",
    exploracaoCodigo: exploracao?.codigo || "",
    especie: exploracao?.especie || "Bovino",
    doenca: doenca?.nome || "",
    dataVacinacao,
    dataAtestado,
    tipoVacina,
    situacao: "Ativo" as const,
    produtor,
    estabelecimento,
    exploracao,
    nucleo,
    doencaEntidade: doenca,
    veterinario,
    vacinadorBrucelose,
    mordidaMorcego,
    origemNota,
    revendedora,
    notasFiscaisOrigem,
    vacinados,
  };

  return (
    <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5] pb-24")}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button onClick={() => onNavigate("declaracao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Declarações de Vacinação
          </button>
          <div className="flex flex-col gap-2">
            <CadastroVacinacaoHeader mode={mode} nomeCadastro="Declaração de Vacinação" rotaEditar="editar-declaracao-vacinacao" dados={dados} onNavigate={onNavigate} onSubmit={handleSalvar} />
            {mode === "edit" && dados?.situacao !== "Cancelado" && (
              <button
                type="button"
                onClick={() => onNavigate("declaracao-vacinacao", { ...registroAtual, situacao: "Cancelado" })}
                className="self-end text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Cancelar declaração
              </button>
            )}
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

        {/* ============ INFORMAÇÕES BÁSICAS ============ */}
        <SectionCard title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-full">
              <ProdutorInput
                value={produtor ? produtor.nome : ""}
                required
                disabled={produtorEhUsuario}
                onChange={onChangeProdutor}
                error={err(!produtor)}
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
                  onChange={(v: string) => {
                    setTipoVacina(v);
                    if (isBrucelose) setRegime(v === "B19" ? "Vacina Oficial" : "Vacina Complementar");
                  }}
                  options={tiposVacinaFiltrados.map((t: string) => ({ value: t, label: t }))}
                />
              </div>
            )}

            {doenca && (
              <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
                <FloatSelect
                  label="Tipo de Declaração"
                  required
                  value={regime}
                  onChange={(v: string) => {
                    setRegime(v);
                    setVacinados(AGE_RANGES.map(() => ({ machos: 0, femeas: 0 })));
                  }}
                  options={opcoesRegime.map((o) => ({ value: o, label: o }))}
                  disabled={isBrucelose && (tipoVacina === "B19" || tipoVacina === "RB51")}
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
                required={dataAtestadoObrigatoria}
                type="date"
                icon={<Calendar size={18} color={GREEN} />}
                min={dataVacinacao || undefined}
                max={hoje}
                value={dataAtestado}
                onChange={setDataAtestado}
                error={err(dataAtestadoObrigatoria && dataAtestado === "") || (erroDataAtestado ? "Entre a Data de Vacinação e hoje." : undefined)}
              />
            </div>

            <div className="w-full mt-2">
              <MedicoVeterinarioInput
                value={veterinario ? veterinario.nome : ""}
                required
                onChange={(entidadeSelecionada) => setVeterinario(entidadeSelecionada)}
                error={err(!veterinario)}
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
                />
              </div>
            )}

            {isRaiva && (
              <div className="w-full flex flex-col gap-2 mt-2 p-3 rounded-lg">
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

        {/* ============ SALDO DE VACINAS (COM GRÁFICO DE ROSCA E LOTES) ============ */}
        {mostrarVacinacaoENota && (
          <Section title="Saldo de Vacinas">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatSelect
                  label="Origem do Saldo"
                  required
                  value={origemNota}
                  onChange={setOrigemNota}
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
                  placeholder="Buscar revendedora"
                  value={revendedora?.nome ?? ""}
                  data={REVENDEDORAS_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[{ label: "Nome", key: "nome" }, { label: "CNPJ", key: "documento" }]}
                  icon={<Store size={18} color={GREEN} />}
                  title="Buscar Revendedora de Insumos"
                  subtitle="Busque por uma revendedora cadastrada:"
                  onChange={setRevendedora}
                  error={err(!revendedora)}
                />
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
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
                  disabled={!produtor}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalNotaOrigemOpen(true);
                  }}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${
                    produtor ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer" : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  <PlusCircle size={18} />
                  Adicionar Saldo
                </button>
              </div>

              {notasFiscaisOrigem.length === 0 && (
                <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                  <p className="text-sm text-gray-400 italic">Nenhum lote vinculado até o momento.</p>
                </div>
              )}

              {/* LISTA DE LOTES VINCULADOS COM GRÁFICO DONUT INTERATIVO */}
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
                              <span className="text-sm font-bold text-gray-600">Lote:</span>
                              <span className="text-sm font-bold text-gray-800">{grupo.nome}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.nome !== grupo.nome));
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 rounded transition hover:bg-red-50 ml-2"
                              title="Remover Lote"
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
                              const isLoteExpandido = lotesMinimizados[nfItem.id] !== undefined ? lotesMinimizados[nfItem.id] : true;
                              const isLoteMinimizado = !isLoteExpandido;

                              const dadosGrafico = [
                                { name: "Vencidas", value: 0, color: "#ef4444" },
                                { name: "Descartadas", value: 10, color: "#9ca3af" },
                                { name: "Partilhadas", value: 20, color: "#3b82f6" },
                                { name: "Utilizadas", value: nfItem.quantidadeDoses || 0, color: "#f59e0b" },
                                { name: "Disponíveis", value: TOTAL_DISPONIVEL - (nfItem.quantidadeDoses || 0), color: "#22c55e" },
                              ];

                              const estaAtivoNesteLote = graficoAtivo?.loteId === nfItem.id;
                              const fatiaAtiva = estaAtivoNesteLote ? dadosGrafico[graficoAtivo.index] : null;
                              const totalDosesGrafico = dadosGrafico.reduce((s, d) => s + d.value, 0);
                              const porcentagem = fatiaAtiva ? ((fatiaAtiva.value / totalDosesGrafico) * 100).toFixed(1) : null;
                              const DOSES_DISPONIVEIS = dadosGrafico.find(d => d.name === "Disponíveis")?.value ?? 0;
                              const FRASCOS_DISPONIVEIS = Math.floor(DOSES_DISPONIVEIS / DOSES_POR_FRASCO);

                              return (
                                <div key={`lote-${nfItem.id}`} className="border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col p-4 relative">
                                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                    <button
                                      type="button"
                                      onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteExpandido }))}
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition hover:bg-gray-100"
                                    >
                                      {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-gray-100">
                                    <span className="text-xs font-semibold text-gray-800">Apresentação</span>
                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                      <PillBottle size={10} className="text-gray-400" />
                                      {DOSES_POR_FRASCO} doses/frasco
                                    </span>
                                  </div>

                                  {!isLoteMinimizado && (
                                    <div className="flex items-center gap-4 z-10 mt-1">
                                      {/* GRÁFICO DONUT INTERATIVO */}
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
                                              <span className="text-xs font-bold leading-none" style={{ color: fatiaAtiva.color }}>{fatiaAtiva.value}</span>
                                              <span className="text-[7px] text-gray-500 font-semibold uppercase truncate max-w-[50px] mt-0.5">{fatiaAtiva.name}</span>
                                              <span className="text-[8px] font-bold mt-0.5" style={{ color: fatiaAtiva.color }}>{porcentagem}%</span>
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center justify-center">
                                              <span className="text-base font-black text-gray-800 leading-none">{totalDosesGrafico}</span>
                                              <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Total</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-2 flex-1 justify-start items-stretch">
                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-gray-50/80 justify-between">
                                          <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>
                                          <div className="flex gap-2 items-end justify-center py-0.5">
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">{FRASCOS_DISPONIVEIS}</span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Frascos</span>
                                            </div>
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">{DOSES_DISPONIVEIS}</span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Doses</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-white justify-between">
                                          <span className="text-[11px] text-gray-500 font-medium text-center">Utilizadas</span>
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
        )}

        {/* ============ VACINAÇÃO (REBANHO) ============ */}
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

      {/* MODAL DE PRODUTOR */}
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
      />

      {/* MODAL DE SELEÇÃO DE LOTES */}
      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacinas"
        subtitle="Selecione os lotes de vacina desejados para vincular a este ajuste:"
        icon={<Package size={24} color={GREEN} />}
        data={[
          { id: 1, nome: "0013225/24", partida: "1", uf: "MG", dosesDisponiveisTotais: 120, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", tipoVacina: "B19", laboratorio: "BioMed/MG", validade: "20/12/2026" },
        ].map((item) => ({ ...item, doencaComTipo: `${item.doenca} - ${item.tipoVacina}` }))}
        searchKeys={["nome", "partida", "doenca", "tipoVacina", "fornecedor", "uf"]}
        searchPlaceholder="Busque por lote ou doença."
        columns={[
          { label: "Lote/ Nº de Partida", key: "nome" },
          { label: "Vacina", key: "doencaComTipo" },
          { label: "Saldo da Apresentação", key: "dosesDisponiveisTotais" },
          { label: "UF", key: "uf" }
        ]}
        selectedItems={notasFiscaisOrigem}
        onConfirm={(selectedValues) => setNotasFiscaisOrigem(selectedValues)}
      />

      {/* ============ MODAL DE SUCESSO ============ */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: GREEN }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {mensagemSucessoCadastro(mode, "Declaração de Vacinação")}
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
                onClick={() => onNavigate("visualizar-declaracao-vacinacao", registroAtual)}
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