import { useState } from "react";
import { ArrowLeft, Syringe, Calendar, Check, Package, PillBottle, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, CustomRadio } from "../../../components/ui/FormKit";
import { HistoricoCadastroLayout, type HistoricoCadastroItem } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { PieChart, Pie, Cell, Sector } from "recharts";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// SUBCOMPONENTES (MODO SOMENTE LEITURA)
// ==========================================================
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
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
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/70 border-b border-gray-100 select-none text-left transition-colors"
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

interface FaixaLinha {
  label: string;
  machos: { existentes: number; naoVacinados: number };
  femeas: { existentes: number; naoVacinados: number };
}

function VaccinationTableReadOnly({
  faixas,
  mostrarMachos,
  mostrarFemeas,
  statusLabel,
  vacinados,
}: {
  faixas: FaixaLinha[];
  mostrarMachos: boolean;
  mostrarFemeas: boolean;
  statusLabel: string;
  vacinados: VacinadosRow[];
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9] bg-gray-50/50">
        <h3 className="text-[16px] font-medium text-[#1d1d1f]">Vacinação (Somente Leitura)</h3>
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
                      <div className="flex justify-center font-bold text-[#2563eb] text-[15px]">{vac.machos}</div>
                    </td>
                  </>)}
                  {mostrarFemeas && (<>
                    <td className={td}>{row.femeas.existentes}</td>
                    <td className={td}>{row.femeas.naoVacinados}</td>
                    <td className={`${td} border-r-0`}>
                      <div className="flex justify-center font-bold text-[#be185d] text-[15px]">{vac.femeas}</div>
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

const GRUPOS_COM_NUCLEO = ["Abelhas", "Aves", "Suídeos"];

// ==========================================================
// TELA PRINCIPAL DE VISUALIZAÇÃO
// ==========================================================
export function VisualizarDeclaracaoVacinacaoPage({ onLogout, onNavigate, dados }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: any }) {
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);

  // 1. Base Rica de Fallback para os 3 itens de exemplo da Listagem.
  const REGISTROS_RICOS: Record<string, any> = {
    "1": {
      tipoVacina: "B19", regime: "Vacina Oficial", dataAtestado: "2026-02-05", 
      veterinarioNome: "Dr. Roberto Silva", vacinadorNome: "Eloiza Silva",
      origemNota: "Produtor",
      notasFiscaisOrigem: [
        { id: 1, nome: "0013225/24", partida: "1", uf: "MG", dosesDisponiveisTotais: 120, fornecedor: "Comercial AgroVet", doenca: "Brucelose", tipoVacina: "B19", laboratorio: "BioMed/MG", validade: "20/12/2026", quantidadeDoses: 10, quantidadeFrascos: 1, dosesPerFrasco: 10 }
      ],
      vacinados: [{ machos: 0, femeas: 10 }]
    },
    "2": {
      tipoVacina: "", regime: "Primeira Dose", dataAtestado: "2026-01-20", 
      veterinarioNome: "Dr. Carlos Mendes", vacinadorNome: "",
      origemNota: "Médico Veterinário",
      situacao: "Cancelado",
      notasFiscaisOrigem: [
        { id: 5, nome: "0099887/25", partida: "3", uf: "MG", dosesDisponiveisTotais: 500, fornecedor: "Comercial AgroVet", doenca: "Febre Aftosa", tipoVacina: "", laboratorio: "OuroFino", validade: "10/10/2026", quantidadeDoses: 30, quantidadeFrascos: 3, dosesPerFrasco: 10 }
      ],
      vacinados: [{ machos: 5, femeas: 15 }, { machos: 2, femeas: 8 }, { machos: 0, femeas: 0 }, { machos: 0, femeas: 0 }]
    },
    "3": {
      tipoVacina: "", regime: "Dose de Reforço", dataAtestado: "2026-03-02", 
      veterinarioNome: "Dra. Ana Paula", vacinadorNome: "", mordidaMorcego: "Não",
      origemNota: "Produtor",
      notasFiscaisOrigem: [
        { id: 3, nome: "0014589/24", partida: "1", uf: "SP", dosesDisponiveisTotais: 250, fornecedor: "AgroInsumos Sul", doenca: "Raiva", tipoVacina: "", laboratorio: "Zoetis", validade: "15/08/2027", quantidadeDoses: 5, quantidadeFrascos: 1, dosesPerFrasco: 5 }
      ],
      vacinados: [{ machos: 2, femeas: 3 }, { machos: 0, femeas: 0 }, { machos: 0, femeas: 0 }, { machos: 0, femeas: 0 }]
    },
  };

  // 2. Mescla os dados reais com os dados ricos (se for um mock da lista inicial)
  const isMockPadrao = dados?.id && REGISTROS_RICOS[dados.id.toString()];
  const registroOriginal = dados || {};
  const registro = isMockPadrao 
    ? { ...registroOriginal, ...REGISTROS_RICOS[dados.id.toString()] }
    : { ...registroOriginal };
  const agora = new Date();
  const historico = carregarHistoricoCadastro<any>(`declaracao-vacinacao:${registro.id ?? "novo"}`, [{
    id: `criacao-${registro.id ?? "novo"}`,
    data: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(agora),
    hora: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(agora),
    alteradoPor: "Sistema",
    atual: true,
    dados: registro,
  }]) as HistoricoCadastroItem<any>[];

  // Condicionais
  const isRaiva = registro.doenca === "Raiva";
  const isBrucelose = registro.doenca === "Brucelose";
  
  const grupoMock = registro.especie === "Abelha com Ferrão" ? "Abelhas" : (registro.especie === "Codorna" ? "Aves" : (registro.especie === "Suíno" ? "Suídeos" : "Bovinos"));
  const exigeNucleo = GRUPOS_COM_NUCLEO.some((g) => grupoMock.includes(g));

  const { faixas: faixasTabela, mostrarMachos, mostrarFemeas } = derivarFaixas(registro.doenca, registro.regime);
  const statusColLabel = registro.regime === "Vacina Oficial" || registro.regime === "Primeira Dose" ? "Não Vacinados" : "Já Vacinados";
  
  // Tratamento de Arrays
  const vacinadosView = faixasTabela.map((_, i) => (registro.vacinados && registro.vacinados[i]) ? registro.vacinados[i] : { machos: 0, femeas: 0 });
  const notasFiscaisOrigem = registro.notasFiscaisOrigem && registro.notasFiscaisOrigem.length > 0 
    ? registro.notasFiscaisOrigem 
    : [
        { id: 999, nome: "Lote Genérico (Fallback)", partida: "1", uf: "MG", dosesDisponiveisTotais: 100, fornecedor: "Fornecedor", doenca: registro.doenca, tipoVacina: registro.tipoVacina, laboratorio: "Laboratório", validade: "20/12/2026", quantidadeDoses: 0, quantidadeFrascos: 0, dosesPerFrasco: 10 }
      ];

  const DOSES_DISPONIVEIS = notasFiscaisOrigem.reduce((sum: number, item: any) => sum + (item.dosesDisponiveisTotais || 0), 0);
  const utilizadas = vacinadosView.reduce((s: number, r: any) => s + r.machos + r.femeas, 0);
  const saldo = DOSES_DISPONIVEIS - utilizadas;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <HistoricoCadastroLayout itens={historico} resetKey={registro.id} tituloHistorico="Histórico da Declaração de Vacinação" conteudoClassName="px-4 py-6 md:px-6">
        {({ botaoHistorico, avisoVersao }) => <main className="flex flex-col gap-4">
        
        {/* ============ HEADER ============ */}
        <div className="mb-4">
          <button onClick={() => onNavigate("declaracao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas Declarações de Vacinação
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Declaração de Vacinação</h1>
            <div className="flex items-center gap-3"><button onClick={() => onNavigate("editar-declaracao-vacinacao", registro)} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>Editar</button>{botaoHistorico}</div>
          </div>
        </div>
        {avisoVersao}

        {/* ============ INFORMAÇÕES BÁSICAS ============ */}
        <SectionCard title="Informações Básicas">
          <div className="flex flex-col gap-4">
            
            {/* Linha 1: Produtor */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <FloatInput label="Produtor *" value={registro.produtorNome || "—"} readOnly disabled icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} />
              </div>
              <div className="flex-1">
                <FloatInput label="CPF / CNPJ *" value={registro.produtorDoc || "—"} readOnly disabled />
              </div>
              <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-full transition-colors flex-shrink-0" onClick={() => {}}>
                <Eye size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Linha 2: Estabelecimento */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <FloatInput label="Estabelecimento Agropecuário *" value={registro.estabNome || "—"} readOnly disabled icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-[24px] h-[24px] object-contain mr-2 -ml-1" />} />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <FloatInput label="Código do Estabelecimento Agropecuário *" value={registro.estabCodigo || "—"} readOnly disabled />
                <FloatInput label="Município do Estabelecimento Agropecuário" value={registro.municipio || "—"} readOnly disabled />
              </div>
              <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-full transition-colors flex-shrink-0" onClick={() => {}}>
                <Eye size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Linha 3: Exploração */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <FloatInput label="Exploração Pecuária *" value={registro.exploracaoCodigo || `${registro.estabCodigo || "—"}0001`} readOnly disabled icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />} />
              </div>
              <div className="flex-1">
                <FloatInput label="Espécie Explorada *" value={registro.especie || "—"} readOnly disabled />
              </div>
              <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-full transition-colors flex-shrink-0" onClick={() => {}}>
                <Eye size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Linha 4: Núcleo Condicional */}
            {exigeNucleo && (
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <FloatInput 
                    label="Núcleo de Produção *" 
                    value={registro.nucleo?.nome || "Núcleo Central"} 
                    readOnly 
                    disabled 
                    icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo" className="w-[24px] h-[24px] object-contain mr-2 -ml-1" />} 
                  />
                </div>
                <div className="flex-1">
                  <FloatInput 
                    label="Código do Núcleo *" 
                    value={registro.nucleo?.codigo || "450010400050003"} 
                    readOnly 
                    disabled 
                  />
                </div>
                <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-full transition-colors flex-shrink-0" onClick={() => {}}>
                  <Eye size={22} strokeWidth={2.5} />
                </button>
              </div>
            )}
            
          </div>
        </SectionCard>

        {/* ============ INFORMAÇÕES DE VACINAÇÃO ============ */}
        <SectionCard title="Informações de Vacinação">
          <div className="flex flex-wrap gap-4 items-end w-full">
            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput label="Doença" value={registro.doenca || "—"} readOnly disabled icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />} />
            </div>

            {registro.tipoVacina && (
              <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
                <FloatInput label="Tipo de Vacina" value={registro.tipoVacina || "—"} readOnly disabled />
              </div>
            )}

            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput label="Vacinação" value={registro.regime || "—"} readOnly disabled />
            </div>

            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput label="Data da Vacinação" value={registro.dataVacinacao || "—"} readOnly disabled icon={<Calendar size={18} color={GREEN} />} />
            </div>

            <div className="flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)]">
              <FloatInput label="Data de Atestado de Vacinação" value={registro.dataAtestado || "—"} readOnly disabled icon={<Calendar size={18} color={GREEN} />} />
            </div>

            <div className="w-full mt-2">
              <FloatInput label="Médico Veterinário Responsável" value={registro.veterinarioNome || "—"} readOnly disabled />
            </div>

            {isBrucelose && (
              <div className="w-full mt-1">
                <FloatInput label="Vacinador Contra Brucelose" value={registro.vacinadorNome || "—"} readOnly disabled />
              </div>
            )}

            {isRaiva && (
              <div className="w-full flex flex-col gap-2 mt-2 p-3 rounded-lg pointer-events-none opacity-80">
                <span className="text-xs font-semibold text-gray-700">
                  Recentemente, tem observado mordidas de morcegos nos animais do rebanho?
                </span>
                <div className="flex items-center gap-6 mt-1">
                  <CustomRadio label="Sim" name="mordidaMorcego" checked={registro.mordidaMorcego === "Sim"} onChange={() => {}} />
                  <CustomRadio label="Não" name="mordidaMorcego" checked={registro.mordidaMorcego === "Não"} onChange={() => {}} />
                </div>
              </div>
            )}
          </div>
        </SectionCard>


        {/* ============ SALDO DE VACINAS ============ */}
        <Section title="Saldo de Vacinas">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <FloatInput label="Origem do Saldo" value={registro.origemNota || "—"} readOnly disabled />
            </div>

            <div className="flex flex-col gap-6">
              {Object.values(
                notasFiscaisOrigem.reduce((acc: Record<string, any>, item: any) => {
                  if (!acc[item.nome]) acc[item.nome] = { nome: item.nome, partidas: [] };
                  acc[item.nome].partidas.push(item);
                  return acc;
                }, {})
              ).map((grupo: any) => {
                return (
                  <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">

                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 select-none">
                          <Package size={24} color={GREEN} />
                          <span className="text-sm font-bold text-gray-600">Lote:</span>
                          <span className="text-sm font-bold text-gray-800">{grupo.nome}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      {grupo.partidas.map((nfItem: any) => {
                        const DOSES_POR_FRASCO = nfItem.dosesPerFrasco || 10;
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
                            { name: "Utilizadas", value: nfItem.quantidadeDoses || 10, color: "#f59e0b" },
                            { name: "Disponíveis", value: Math.max(0, TOTAL_DISPONIVEL - (nfItem.quantidadeDoses || 10)), color: "#22c55e" },
                          ];

                        const estaAtivoNesteLote = graficoAtivo?.loteId === nfItem.id;
                        const fatiaAtiva = estaAtivoNesteLote ? dadosGrafico[graficoAtivo.index] : null;
                        const totalDosesGrafico = dadosGrafico.reduce((s, d) => s + d.value, 0);
                        const porcentagem = fatiaAtiva ? ((fatiaAtiva.value / totalDosesGrafico) * 100).toFixed(1) : null;
                        const DOSES_DISP = dadosGrafico.find(d => d.name === "Disponíveis")?.value ?? 0;
                        const FRASCOS_DISP = Math.floor(DOSES_DISP / DOSES_POR_FRASCO);

                        return (
                          <div key={`lote-${nfItem.id}`} className="border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto p-4 justify-between pointer-events-none">
                            <div className="flex items-center justify-between border-gray-100 overflow-visible border-b pb-2 mb-3">
                              <div className="flex items-center gap-1.5 relative group/info overflow-visible">
                                <span className="text-xs font-semibold text-gray-800 select-none">Apresentação</span>
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                  <PillBottle size={10} className="text-gray-400" />
                                  {DOSES_POR_FRASCO} doses/frasco
                                </span>
                              </div>
                            </div>

                            <div className="animate-slideDown">
                              <div className="flex items-center gap-4 z-10 mt-3">
                                <div className="w-24 h-24 flex items-center justify-center relative select-none">
                                  <PieChart width={96} height={96} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                    <Pie
                                      data={dadosGrafico} cx="50%" cy="50%" innerRadius={26} outerRadius={35} paddingAngle={2} dataKey="value" stroke="none"
                                      activeIndex={estaAtivoNesteLote ? graficoAtivo.index : undefined} activeShape={renderActiveShape}
                                    >
                                      {dadosGrafico.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={entry.color} className="outline-none" />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                    <div className="flex flex-col items-center justify-center">
                                      <span className="text-base font-black text-gray-800 leading-none">{totalDosesGrafico}</span>
                                      <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Total</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 flex-1 justify-start items-stretch">
                                  <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-gray-50/80 justify-between">
                                    <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>
                                    <div className="flex gap-2 items-end justify-center py-0.5">
                                      <div className="flex flex-col items-center flex-1">
                                        <span className="text-sm font-bold text-gray-700 leading-none">{FRASCOS_DISP}</span>
                                        <span className="text-[9px] text-gray-400 font-medium mt-0.5">Frascos</span>
                                      </div>
                                      <div className="flex flex-col items-center flex-1">
                                        <span className="text-sm font-bold text-gray-700 leading-none">{DOSES_DISP}</span>
                                        <span className="text-[9px] text-gray-400 font-medium mt-0.5">Doses</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-white justify-between">
                                    <span className="text-[11px] text-gray-500 font-medium text-center">Utilizadas</span>
                                    <div className="flex gap-1.5 items-end justify-center">
                                      <div className="flex flex-col items-center flex-1">
                                        <span className="text-sm font-bold text-gray-800 leading-none pt-1 pb-1">{nfItem.quantidadeFrascos || 1}</span>
                                        <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                      </div>
                                      <div className="flex flex-col items-center flex-1">
                                        <span className="text-sm font-bold text-[#1A7A3C] leading-none pt-1 pb-1">{nfItem.quantidadeDoses || 10}</span>
                                        <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Doses</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── VACINAÇÃO ── */}
        <SectionCard title="Vacinação">
          <SummaryCards disponiveis={DOSES_DISPONIVEIS} utilizadas={utilizadas} saldo={saldo} />
          <VaccinationTableReadOnly
            faixas={faixasTabela}
            mostrarMachos={mostrarMachos}
            mostrarFemeas={mostrarFemeas}
            statusLabel={statusColLabel}
            vacinados={vacinadosView}
          />
        </SectionCard>

        {/* ============ SITUAÇÃO DO CADASTRO (Ao Final) ============ */}
        <Section title="Situação do Cadastro">
          <div className="w-full">
             <FloatInput label="Situação" value={registro.situacao || "Gravado"} readOnly disabled />
          </div>
        </Section>
        
        </main>}
      </HistoricoCadastroLayout>
    </div>
  );
}

export default VisualizarDeclaracaoVacinacaoPage;
