import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Pencil, Package, Check, Syringe, Calendar, Store, RotateCcw } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, CustomRadio } from "../../../components/ui/FormKit";
import { 
  ProdutorInput, 
  EstabelecimentoAgropecuarioInput, 
  ExploracaoPecuariaInput, 
  NucleoInput,
  EntitySearchInput,
  MedicoVeterinarioInput,
  VacinadorBruceloseInput
} from "../../../components/ui/EntitySearch";
import { PieChart, Pie, Cell, Sector } from "recharts";
import * as Icons from "../../../imports/icons";

// IMPORTS DO HISTÓRICO
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout
} from "../../../components/ui/HistoricoCadastroLayout";

const GREEN = "#1A7A3C";
const MOCK_KEY = "DECLARACOES_VACINA_DB";

// ==========================================================
// FUNÇÕES E COMPONENTES AUXILIARES
// ==========================================================
const AGE_RANGES = ["De 3 a 8 meses", "De 13 a 24 meses", "De 25 a 36 meses", "Acima de 36 meses"];

function derivarFaixas(doencaNome: string | undefined, regime: string) {
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

function SummaryCards({ disponiveis, utilizadas, saldo }: { disponiveis: number; utilizadas: number; saldo: number }) {
  return (
    <div className="flex flex-col sm:flex-row border border-[#e0e0e0] rounded-xl overflow-hidden bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#e0e0e0] mb-6">
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
        <p className={`text-[28px] font-bold leading-none tabular-nums ${saldo < 0 ? "text-red-600" : "text-[#1d1d1f]"}`}>{saldo}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/70 text-left hover:bg-gray-100/70 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5">{children}</div>}
    </div>
  );
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.8} />
    </g>
  );
};

// Stepper Visual - 100% bloqueado
function DisabledStepper({ value, accentColor }: { value: number; accentColor: string }) {
  return (
    <div className="inline-flex items-center h-8 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] overflow-hidden select-none opacity-60">
      <div className="w-8 h-full flex items-center justify-center text-[#64748b] text-[16px] font-medium leading-none border-r border-[#e2e8f0]/60 bg-gray-100 cursor-not-allowed">−</div>
      <div className="w-12 h-full flex items-center justify-center text-[14px] font-bold tabular-nums bg-white" style={{ color: accentColor }}>{value}</div>
      <div className="w-8 h-full flex items-center justify-center text-[#64748b] text-[16px] font-medium leading-none border-l border-[#e2e8f0]/60 bg-gray-100 cursor-not-allowed">+</div>
    </div>
  );
}

// Tabela de Vacinação Idêntica ao Cadastro (Somente Leitura)
function ReadOnlyVaccinationTable({
  faixas,
  mostrarMachos,
  mostrarFemeas,
  statusLabel,
  vacinados,
}: {
  faixas: any[];
  mostrarMachos: boolean;
  mostrarFemeas: boolean;
  statusLabel: string;
  vacinados: any[];
}) {
  const totalMachosExist = faixas.reduce((s: number, r: any) => s + r.machos.existentes, 0);
  const totalMachosNaoVac = faixas.reduce((s: number, r: any) => s + r.machos.naoVacinados, 0);
  const totalFemeaExist = faixas.reduce((s: number, r: any) => s + r.femeas.existentes, 0);
  const totalFemeaNaoVac = faixas.reduce((s: number, r: any) => s + r.femeas.naoVacinados, 0);
  const totalVacMachos = vacinados.reduce((s: number, r: any) => s + (r.machos || 0), 0);
  const totalVacFemeas = vacinados.reduce((s: number, r: any) => s + (r.femeas || 0), 0);

  const th = "text-[11px] font-semibold text-[#6b7280] text-center py-2.5 px-3 border-b border-r border-[#f1f5f9]";
  const td = "text-[13px] text-[#1d1d1f] text-center py-3.5 px-3 border-b border-r border-[#f1f5f9]";

  const generosVisiveis = (mostrarMachos ? 1 : 0) + (mostrarFemeas ? 1 : 0);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
        <h3 className="text-[16px] font-medium text-[#1d1d1f]">Vacinação</h3>
        <button
          disabled
          className="flex items-center gap-1.5 text-gray-400 text-[13px] font-semibold select-none leading-none cursor-not-allowed opacity-60"
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
            {faixas.map((row: any, i: number) => {
              const vac = vacinados[i] ?? { machos: 0, femeas: 0 };
              return (
                <tr key={row.label} className="hover:bg-[#fafafa]/40 transition-colors">
                  <td className="px-6 py-3.5 text-[13px] font-semibold text-[#475569] border-r border-b border-[#f1f5f9]">{row.label}</td>
                  {mostrarMachos && (<>
                    <td className={td}>{row.machos.existentes}</td>
                    <td className={td}>{row.machos.naoVacinados}</td>
                    <td className={td}>
                      <div className="flex justify-center">
                        <DisabledStepper value={vac.machos} accentColor="#2563eb" />
                      </div>
                    </td>
                  </>)}
                  {mostrarFemeas && (<>
                    <td className={td}>{row.femeas.existentes}</td>
                    <td className={td}>{row.femeas.naoVacinados}</td>
                    <td className={`${td} border-r-0`}>
                      <div className="flex justify-center">
                        <DisabledStepper value={vac.femeas} accentColor="#be185d" />
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

// ==========================================================
// COMPONENTE PRINCIPAL DE VISUALIZAÇÃO
// ==========================================================
export function VisualizarDeclaracaoVacinacaoPage({ onLogout, onNavigate, dados, data }: any) {
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);

  const getSelectedItem = () => {
    let rawData = dados || data;

    if (!rawData || !rawData.id) {
      const currentId = localStorage.getItem("CURRENT_DECLARACAO_ID");
      const stored = localStorage.getItem(MOCK_KEY);
      const db = stored ? JSON.parse(stored) : [];
      const found = db.find((x: any) => x.id.toString() === currentId?.toString());
      if (found) rawData = found;
    }

    if (!rawData || !rawData.id) {
      return {
        id: 1,
        situacao: "Ativo",
        produtorNome: "Maria Silva Mendes",
        produtorDoc: "444.111.222-33",
        estabNome: "Fazenda Rio Preto",
        estabCodigo: "31001040005",
        municipio: "Varginha",
        exploracaoCodigo: "312345678910109",
        especie: "Bovino",
        doenca: "Brucelose",
        tipoVacina: "B19",
        tipoDeclaracao: "Vacina Oficial",
        regime: "Vacina Oficial",
        dataVacinacao: "2026-02-01",
        dataAtestado: "2026-02-01",
        veterinarioNome: "Dr. Roberto Silva",
        vacinadorNome: "Eloiza Silva",
        mordidaMorcego: "—",
        origemNota: "Produtor",
        revendedora: { nome: "Comercial AgroVat" },
        notasFiscaisOrigem: [],
        vacinados: []
      };
    }

    const doencaNome = rawData.doenca || rawData.doencaEntidade?.nome || "";
    const regimeNome = rawData.regime || rawData.tipoDeclaracao || "";
    const produtorNomeVal = rawData.produtorNome || rawData.produtor?.nome || "";
    const produtorDocVal = rawData.produtorDoc || rawData.produtor?.documento || "";
    const estabNomeVal = rawData.estabNome || rawData.estabelecimento?.nome || "";
    const estabCodigoVal = rawData.estabCodigo || rawData.estabelecimento?.codigo || "";
    const municipioVal = rawData.municipio || rawData.estabelecimento?.municipio || "";
    const exploracaoCodigoVal = rawData.exploracaoCodigo || rawData.exploracao?.codigo || "";
    const especieVal = rawData.especie || rawData.exploracao?.especie || "Bovino";
    const veterinarioVal = rawData.veterinario?.nome || rawData.veterinarioNome || "Dr. Roberto Silva";
    const vacinadorVal = rawData.vacinadorBrucelose?.nome || rawData.vacinadorNome || "";

    return {
      ...rawData,
      id: rawData.id,
      situacao: rawData.situacao || "Ativo",
      produtorNome: produtorNomeVal,
      produtorDoc: produtorDocVal,
      estabNome: estabNomeVal,
      estabCodigo: estabCodigoVal,
      municipio: municipioVal,
      exploracaoCodigo: exploracaoCodigoVal,
      especie: especieVal,
      doenca: doencaNome,
      tipoVacina: rawData.tipoVacina || (doencaNome === "Brucelose" ? "B19" : "—"),
      tipoDeclaracao: regimeNome,
      regime: regimeNome,
      dataVacinacao: rawData.dataVacinacao || "",
      dataAtestado: rawData.dataAtestado || (doencaNome === "Brucelose" ? rawData.dataVacinacao : "—"),
      veterinarioNome: veterinarioVal,
      vacinadorNome: vacinadorVal,
      mordidaMorcego: rawData.mordidaMorcego || (doencaNome === "Raiva" ? "Não" : "—"),
      origemNota: rawData.origemNota || "Produtor",
      revendedora: rawData.revendedora || { nome: "Comercial AgroVat" },
      notasFiscaisOrigem: rawData.notasFiscaisOrigem?.length ? rawData.notasFiscaisOrigem : [{
        id: `lote-${rawData.id || 1}`, nome: "0013225/24", doenca: doencaNome, tipoVacina: doencaNome === "Brucelose" ? "B19" : "—", laboratorio: "BioMed/MG", validade: "20/12/2026",
        dosesDisponiveisTotais: 120, quantidadeDoses: 15, quantidadeFrascos: 1, dosesPerFrasco: 15
      }],
      vacinados: rawData.vacinados?.length ? rawData.vacinados : [
        { machos: doencaNome === "Brucelose" ? 0 : 5, femeas: 10 }, 
        { machos: 0, femeas: 0 }, 
        { machos: 0, femeas: 0 }, 
        { machos: 0, femeas: 0 }
      ]
    };
  };

  const dadosAtuais = getSelectedItem();
  if (!dadosAtuais) return null;

  const historicoKey = `declaracao-vacina:${dadosAtuais.id}`;
  const histStored = localStorage.getItem(historicoKey);
  let historico = histStored ? JSON.parse(histStored) : [];
  if (historico.length === 0) {
    historico = [{ id: `inicial-${dadosAtuais.id}`, data: new Date().toLocaleDateString('pt-BR'), alteradoPor: "Sistema (Criação)", atual: true, dados: dadosAtuais }];
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <HistoricoCadastroLayout<any>
        itens={historico}
        ativo={true}
        resetKey={dadosAtuais.id}
        conteudoClassName="flex flex-col gap-4 max-w-[1088px] mx-auto px-4 py-6 md:px-6"
      >
        {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
          const r = dadosSelecionados ?? dadosAtuais;
          
          const getClasseAlterado = (campo: string) => {
            if (!visualizandoVersaoAntiga) return "";
            const valAntigo = JSON.stringify(dadosSelecionados?.[campo] || "");
            const valAtual = JSON.stringify(versaoAtual?.dados?.[campo] || "");
            return valAntigo !== valAtual ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";
          };

          const doencaNome = r.doenca || r.doencaEntidade?.nome || "";
          const regimeNome = r.regime || r.tipoDeclaracao || "";
          
          const { faixas: faixasTabela, mostrarMachos, mostrarFemeas } = derivarFaixas(doencaNome, regimeNome);
          const vacinadosView = r.vacinados || [];
          
          const statusColLabel = regimeNome === "Dose de Reforço" ? "Já Vacinados na Etapa" : "Não Vacinados";
          
          const utilizadas = vacinadosView.reduce((s: number, rv: any) => s + (rv.machos || 0) + (rv.femeas || 0), 0);
          const notasFiscais = r.notasFiscaisOrigem || [];
          const totalDisponivel = notasFiscais.reduce((sum: number, item: any) => sum + (item.dosesDisponiveisTotais || 0), 0);
          const saldoRestante = totalDisponivel - utilizadas;

          return (
            <>
              <div>
                <button onClick={() => onNavigate("declaracao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
                  <ArrowLeft size={15} /> Todas as Declarações
                </button>
                <div className="flex justify-between items-center gap-4 w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Declaração de Vacinação</h1>
                  <div className="flex items-center gap-3">
                    {!visualizandoVersaoAntiga && r.situacao !== "Cancelado" && (
                      <button onClick={() => { localStorage.setItem("CURRENT_DECLARACAO_ID", r.id.toString()); onNavigate("editar-declaracao-vacinacao", r); }} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                    {botaoHistorico}
                  </div>
                </div>
              </div>

              {avisoVersao}

              {/* INFORMAÇÕES BÁSICAS */}
              <SectionCard title="Informações Básicas">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className={`col-span-full md:col-span-2 ${getClasseAlterado('produtorNome')}`}>
                    <FloatInput label="Produtor" value={r.produtorNome || ""} readOnly disabled onChange={() => {}} icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />} />
                  </div>
                  <div className={`col-span-full md:col-span-1 ${getClasseAlterado('produtorDoc')}`}>
                    <FloatInput label="CPF" value={r.produtorDoc || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`col-span-full md:col-span-1 ${getClasseAlterado('estabNome')}`}>
                    <FloatInput label="Estabelecimento Agropecuário" value={r.estabNome || ""} readOnly disabled onChange={() => {}} icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />} />
                  </div>
                  <div className={`col-span-full md:col-span-1 ${getClasseAlterado('estabCodigo')}`}>
                    <FloatInput label="Código do Estabelecimento Agropecuário" value={r.estabCodigo || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`col-span-full md:col-span-1 ${getClasseAlterado('municipio')}`}>
                    <FloatInput label="Município do Estabelecimento Agropecuário" value={r.municipio || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`col-span-full md:col-span-1 ${getClasseAlterado('exploracaoCodigo')}`}>
                    <FloatInput label="Exploração Pecuária" value={r.exploracaoCodigo || ""} readOnly disabled onChange={() => {}} icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />} />
                  </div>
                  <div className={`col-span-full md:col-span-2 ${getClasseAlterado('especie')}`}>
                    <FloatInput label="Espécie Explorada" value={r.especie || "Bovino"} readOnly disabled onChange={() => {}} />
                  </div>
                </div>
              </SectionCard>

              {/* INFORMAÇÕES DE VACINAÇÃO */}
              <SectionCard title="Informações de Vacinação">
                <div className="flex flex-wrap gap-4 items-end w-full">
                  <div className={`flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)] ${getClasseAlterado('doencaEntidade')}`}>
                    <FloatInput label="Doença" value={doencaNome} readOnly disabled onChange={() => {}} icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />} />
                  </div>
                  {r.tipoVacina && r.tipoVacina !== "—" && (
                    <div className={`flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)] ${getClasseAlterado('tipoVacina')}`}>
                      <FloatInput label="Tipo de Vacina" value={r.tipoVacina} readOnly disabled onChange={() => {}} />
                    </div>
                  )}
                  <div className={`flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)] ${getClasseAlterado('regime')}`}>
                    <FloatInput label="Tipo de Declaração" value={regimeNome} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)] ${getClasseAlterado('dataVacinacao')}`}>
                    <FloatInput label="Data da Vacinação" type="date" icon={<Calendar size={18} color={GREEN} />} value={r.dataVacinacao || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`flex-1 min-w-[280px] max-w-full sm:max-w-[calc(33.333%-11px)] ${getClasseAlterado('dataAtestado')}`}>
                    <FloatInput label="Data de Atestado de Vacinação" type="date" icon={<Calendar size={18} color={GREEN} />} value={r.dataAtestado || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  <div className={`w-full mt-2 ${getClasseAlterado('veterinario')}`}>
                    <FloatInput label="Médico Veterinário Responsável" value={r.veterinarioNome || ""} readOnly disabled onChange={() => {}} />
                  </div>
                  {doencaNome === "Brucelose" && r.vacinadorNome && (
                    <div className={`w-full mt-1 ${getClasseAlterado('vacinadorBrucelose')}`}>
                      <FloatInput label="Vacinador Contra Brucelose" value={r.vacinadorNome || ""} readOnly disabled onChange={() => {}} />
                    </div>
                  )}
                  {doencaNome === "Raiva" && (
                    <div className={`w-full flex flex-col gap-2 mt-2 p-3 rounded-lg ${getClasseAlterado('mordidaMorcego')}`}>
                      <span className="text-xs font-semibold text-gray-700">Observou mordidas de morcegos nos animais do rebanho recentemente?</span>
                      <div className="flex items-center gap-6 mt-1">
                        <CustomRadio label="Sim" name="mordidaMorcego" checked={r.mordidaMorcego === "Sim"} readOnly disabled onChange={() => {}} />
                        <CustomRadio label="Não" name="mordidaMorcego" checked={r.mordidaMorcego === "Não"} readOnly disabled onChange={() => {}} />
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* SALDO DE VACINAS */}
              <SectionCard title="Saldo de Vacinas">
                <div className={`flex flex-col gap-4 ${getClasseAlterado('notasFiscaisOrigem')}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatInput label="Origem do Saldo" value={r.origemNota || ""} readOnly disabled onChange={() => {}} />
                    <FloatInput label="Revendedora de Insumos" value={r.revendedora?.nome ?? ""} readOnly disabled icon={<Store size={18} color={GREEN} />} onChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Saldo de doses</span>
                      </div>
                      {notasFiscais.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                          <span className="text-[11px] font-semibold text-gray-500">DOSES UTILIZADAS:</span>
                          <span className="text-[11px] font-black text-[#1A7A3C]">{notasFiscais.reduce((sum: number, item: any) => sum + (item.quantidadeDoses || 0), 0)} doses</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {notasFiscais.length > 0 && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      {Object.values(
                        notasFiscais.reduce((acc: Record<string, any>, item: any) => {
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
                                <div className="flex items-center gap-2 cursor-pointer select-none group/title" onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}>
                                  <Package size={24} color={GREEN} />
                                  <span className="text-sm font-bold text-gray-600">Lote:</span>
                                  <span className="text-sm font-bold text-gray-800">{grupo.nome}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded transition hover:bg-gray-100"
                              >
                                {isNotaMinimizada ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                              </button>
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
                                    { name: "Descartadas", value: 0, color: "#9ca3af" },
                                    { name: "Partilhadas", value: 0, color: "#3b82f6" },
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
                                    <div key={`lote-${nfItem.id}`} className={`border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto ${isLoteMinimizado ? "p-2.5 pb-2 justify-start" : "p-4 justify-between"}`}>
                                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                        <button
                                          type="button"
                                          onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteExpandido }))}
                                          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition hover:bg-gray-100"
                                        >
                                          {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                        </button>
                                      </div>

                                      <div className={`flex items-center justify-between border-gray-100 overflow-visible pr-14 ${isLoteMinimizado ? "border-none pb-0 mb-0" : "border-b pb-2 mb-3"}`}>
                                        <div className="flex items-center gap-1.5 relative group/info overflow-visible">
                                          <span className="text-xs font-semibold text-gray-800 select-none">Apresentação</span>
                                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                            {DOSES_POR_FRASCO} doses/frasco
                                          </span>
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
                                                      value={nfItem.quantidadeFrascos || 0}
                                                      disabled
                                                      readOnly
                                                      className="w-full text-center bg-gray-50 border border-gray-200 rounded-lg text-xs font-black p-1 text-gray-500 cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                                  </div>
                                                  <div className="flex flex-col flex-1 min-w-[40px]">
                                                    <input
                                                      type="number"
                                                      value={nfItem.quantidadeDoses || 0}
                                                      disabled
                                                      readOnly
                                                      className="w-full text-center bg-gray-50 border border-gray-200 rounded-lg text-xs font-black p-1 text-gray-500 cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Doses</span>
                                                  </div>
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
                      })
                    }
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* VACINAÇÃO (Rebanho) */}
              <SectionCard title="Vacinação (Rebanho)">
                <div className={getClasseAlterado('vacinados')}>
                  <SummaryCards disponiveis={totalDisponivel} utilizadas={utilizadas} saldo={saldoRestante} />
                  <ReadOnlyVaccinationTable faixas={faixasTabela} mostrarMachos={mostrarMachos} mostrarFemeas={mostrarFemeas} statusLabel={statusColLabel} vacinados={vacinadosView} />
                </div>
              </SectionCard>

              {/* SITUAÇÃO DA DECLARAÇÃO DE VACINAÇÃO (Somente Leitura - No final da página) */}
              <SectionCard title="Situação da Declaração de Vacinação">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${getClasseAlterado('situacao')}`}>
                  <FloatSelect 
                    label="Situação" 
                    value={r.situacao || "Ativo"} 
                    options={[{ value: r.situacao || "Ativo", label: r.situacao || "Ativo" }]} 
                    disabled 
                    onChange={() => {}} 
                  />
                </div>
              </SectionCard>
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}

export default VisualizarDeclaracaoVacinacaoPage;