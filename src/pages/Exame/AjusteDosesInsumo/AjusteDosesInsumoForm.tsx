import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Package,
  PlusCircle,
  Trash2,
  Store,
  FlaskConical,
} from "lucide-react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import {
  FloatInput,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  REVENDEDORAS_INSUMO_MOCK,
  type NotaFiscalAjustada,
  type RevendedoraInsumo,
  type SituacaoAjusteDosesInsumo,
} from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";

// MOCK de lotes/insumos de exames para o MultiSearchModal
const INSUMOS_MOCK = [
  {
    id: "insumo-1",
    nome: "0001245/26",
    numeroPartida: "0001245/26",
    doenca: "Brucelose",
    tipoInsumo: "Antígeno Acidificado Tamponado (AAT)",
    laboratorio: "Tecpar",
    validade: "2026-12-20",
    dosesPorFrasco: 100,
    frascosDisponiveis: 10,
    dosesDisponiveis: 1000,
    dosesVencidas: 0,
    dosesDescartadas: 0,
    dosesPartilhadas: 0,
    dosesUtilizadas: 200,
    dosesDisponiveisTotais: 1000,
    uf: "MG",
  },
  {
    id: "insumo-2",
    nome: "0001245/26",
    numeroPartida: "0001245/26",
    doenca: "Brucelose",
    tipoInsumo: "Antígeno para Teste do Anel em Leite (TAL)",
    laboratorio: "Tecpar",
    validade: "2026-12-20",
    dosesPorFrasco: 50,
    frascosDisponiveis: 5,
    dosesDisponiveis: 250,
    dosesVencidas: 0,
    dosesDescartadas: 0,
    dosesPartilhadas: 0,
    dosesUtilizadas: 50,
    dosesDisponiveisTotais: 250,
    uf: "MG",
  },
  {
    id: "insumo-3",
    nome: "0008890/25",
    numeroPartida: "0008890/25",
    doenca: "Tuberculose",
    tipoInsumo: "Tuberculina PPD Bovino",
    laboratorio: "Instituto Biológico",
    validade: "2027-08-15",
    dosesPorFrasco: 50,
    frascosDisponiveis: 8,
    dosesDisponiveis: 400,
    dosesVencidas: 0,
    dosesDescartadas: 0,
    dosesPartilhadas: 50,
    dosesUtilizadas: 150,
    dosesDisponiveisTotais: 400,
    uf: "SP",
  },
  {
    id: "insumo-4",
    nome: "0008890/25",
    numeroPartida: "0008890/25",
    doenca: "Tuberculose",
    tipoInsumo: "Tuberculina PPD Aviário",
    laboratorio: "Instituto Biológico",
    validade: "2027-08-15",
    dosesPorFrasco: 50,
    frascosDisponiveis: 12,
    dosesDisponiveis: 600,
    dosesVencidas: 0,
    dosesDescartadas: 0,
    dosesPartilhadas: 0,
    dosesUtilizadas: 100,
    dosesDisponiveisTotais: 600,
    uf: "SP",
  },
];

const CORES_SALDO = {
  vencidas: "#ef4444",
  descartadas: "#9ca3af",
  partilhadas: "#3b82f6",
  utilizadas: "#f59e0b",
  disponiveis: "#22c55e",
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible mb-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mb-6">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export interface AjusteDosesInsumoFormValue {
  revendedora: RevendedoraInsumo | null;
  notasFiscais: NotaFiscalAjustada[];
  situacao: SituacaoAjusteDosesInsumo;
}

interface FormProps {
  value: AjusteDosesInsumoFormValue;
  onChange: (value: AjusteDosesInsumoFormValue) => void;
  mode?: "create" | "view" | "edit";
}

export function AjusteDosesInsumoForm({
  value,
  onChange,
  mode = "create",
}: FormProps) {
  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [insumosSelecionados, setInsumosSelecionados] = useState<any[]>(() =>
    value.notasFiscais.flatMap((nota) => nota.itens.map((item) => ({
      ...item,
      nome: item.numeroPartida,
      quantidadeFrascos: item.frascosLancados,
      quantidadeDoses: item.dosesLancadas,
    }))),
  );
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  const [apresentacoesMinimizadas, setApresentacoesMinimizadas] = useState<Record<string, boolean>>({});
  const [graficoAtivo, setGraficoAtivo] = useState<{ itemId: string; index: number } | null>(null);

  const disabled = mode === "view";
  const revendedora = value.revendedora;

  // Total de doses lançadas
  const totalDosesLancadas = insumosSelecionados.reduce((sum, item) => sum + (item.quantidadeDoses || 0), 0);

  const selecionarRevendedora = (novaRevendedora: RevendedoraInsumo) => {
    onChange({ ...value, revendedora: novaRevendedora });
    setInsumosSelecionados([]);
  };

  const alterarItemInsumo = (id: string, patch: Record<string, any>) => {
    const atualizados = insumosSelecionados.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setInsumosSelecionados(atualizados);
    const notasFiscais = value.notasFiscais.map((nota) => ({
      ...nota,
      itens: nota.itens.map((item) => {
        const atualizado = atualizados.find((selecionado) => selecionado.id === item.id);
        if (!atualizado) return item;
        return {
          ...item,
          frascosLancados: String(atualizado.quantidadeFrascos ?? ""),
          dosesLancadas: String(atualizado.quantidadeDoses ?? ""),
          justificativa: atualizado.justificativa ?? "",
        };
      }),
    }));
    onChange({ ...value, notasFiscais });
  };

  const removerGrupoLote = (loteNome: string) => {
    setInsumosSelecionados((prev) => prev.filter((item) => item.nome !== loteNome));
  };

  const removerItemApresentacao = (id: string) => {
    setInsumosSelecionados((prev) => prev.filter((item) => item.id !== id));
  };

  // Agrupamento por Lote (Número de Partida)
  const gruposLotes = Object.values(
    insumosSelecionados.reduce((acc: Record<string, any>, item) => {
      const chave = item.nome || item.numeroPartida;
      if (!acc[chave]) {
        acc[chave] = { lote: chave, itens: [] };
      }
      acc[chave].itens.push(item);
      return acc;
    }, {})
  );

  return (
    <>
      {/* Seção 1: Informações Básicas */}
      <Section title="Informações Básicas">
          <EntitySearchInput
            label="Revendedora de Insumos"
            placeholder="Buscar por código ou nome."
            required
            disabled={disabled}
            value={value.revendedora?.nome ?? ""}
            data={REVENDEDORAS_INSUMO_MOCK}
            searchKeys={["codigo", "nome"]}
            columns={[
              { label: "Código", key: "codigo" },
              { label: "Nome", key: "nome" },
              { label: "UF", key: "uf" },
            ]}
            icon={<Store size={18} color={GREEN} />}
            title="Buscar Revendedora de Insumos"
            subtitle="Busque por revendedoras habilitadas para insumos de exames de brucelose e tuberculose:"
            confirmLabel="Selecionar"
            onChange={selecionarRevendedora}
          />
      </Section>

      {/* Seção 2: Saldo de Insumos / Lote */}
      <Section title="Nota Fiscal">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">Saldo de doses</span>

              {totalDosesLancadas > 0 && (
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                  <span className="text-[11px] font-semibold text-gray-500">DOSES LANÇADAS:</span>
                  <span className="text-[11px] font-black text-[#1A7A3C]">
                    {totalDosesLancadas} doses
                  </span>
                </div>
              )}
            </div>

            {!disabled && (
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
            )}
          </div>

          {/* CONDICIONAL 1: Sem revendedora selecionada */}
          {!revendedora && (
            <div className="text-left py-4">
              <p className="text-xs text-gray-400 italic">É necessário selecionar uma Revendedora para pesquisar insumos de exames.</p>
            </div>
          )}

          {/* CONDICIONAL 2: Revendedora selecionada, mas nenhum lote adicionado */}
          {revendedora && insumosSelecionados.length === 0 && (
            <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
              <p className="text-sm text-gray-400 italic">Nenhum lote vinculado a este lançamento até o momento.</p>
            </div>
          )}

          {/* Lista de Grupos de Lotes */}
          {insumosSelecionados.length > 0 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {gruposLotes.map((grupo: any) => {
                const isLoteMinimizado = lotesMinimizados[grupo.lote] || false;
                const itemPrincipal = grupo.itens[0];

                const dosesTotaisLote = grupo.itens.reduce(
                  (acc: number, it: any) =>
                    acc +
                    (it.dosesVencidas || 0) +
                    (it.dosesDescartadas || 0) +
                    (it.dosesPartilhadas || 0) +
                    (it.dosesUtilizadas || 0) +
                    (it.dosesDisponiveis || 0),
                  0
                );

                return (
                  <article key={`grupo-${grupo.lote}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">
                    <div className={`flex items-center justify-between gap-4 px-1 ${!isLoteMinimizado ? "mb-4" : ""}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Package size={24} className="text-[#1A7A3C] flex-shrink-0" />
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-bold text-gray-800">Lote:</span>
                          <span className="text-sm font-bold text-gray-900">{grupo.lote}</span>
                        </div>

                        {/* Tooltip de Info do Lote */}
                        <div className="relative group/lote-info flex-shrink-0 z-20">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <div className="fixed inset-0 bg-black/15 hidden group-hover/lote-info:block pointer-events-none z-[998] animate-fadeIn" />
                          <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl hidden group-hover/lote-info:block animate-fadeIn z-[999] text-left overflow-hidden">
                            <div className="flex items-center gap-1.5 border-b border-gray-100 p-3">
                              <Package size={13} className="text-gray-500" />
                              <span className="text-[11px] font-extrabold text-gray-800">Nº de Partida: {grupo.lote}</span>
                            </div>
                            <div className="p-3 flex flex-col gap-2.5 text-[11px] text-gray-500 bg-white">
                              <div className="flex justify-between items-center gap-3">
                                <span>Doença:</span>
                                <span className="font-bold text-gray-700 text-right">{itemPrincipal?.doenca ?? "—"}</span>
                              </div>
                              <div className="flex justify-between items-center gap-3">
                                <span>Tipo de Insumo:</span>
                                <span className="font-bold text-gray-700 text-right">{itemPrincipal?.tipoInsumo ?? "—"}</span>
                              </div>
                              <div className="flex justify-between items-center gap-3">
                                <span>Laboratório:</span>
                                <span className="font-bold text-gray-700 text-right">{itemPrincipal?.laboratorio ?? "—"}</span>
                              </div>
                              <div className="flex justify-between items-center gap-3">
                                <span>Validade:</span>
                                <span className="font-bold text-gray-700">
                                  {itemPrincipal?.validade ? itemPrincipal.validade.split("-").reverse().join("/") : "—"}
                                </span>
                              </div>
                            </div>
                            <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                              <span>Doses Totais Lote:</span>
                              <span>{dosesTotaisLote}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setLotesMinimizados((prev) => ({ ...prev, [grupo.lote]: !isLoteMinimizado }))}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
                          title={isLoteMinimizado ? "Expandir lote" : "Minimizar lote"}
                        >
                          {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                        </button>
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => removerGrupoLote(grupo.lote)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0"
                            title="Remover lote"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </div>

                    {!isLoteMinimizado && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-fadeIn">
                        {grupo.itens.map((item: any) => {
                          const isApresentacaoMinimizado = apresentacoesMinimizadas[item.id] ?? false;
                          const dosesPorFrasco = item.dosesPorFrasco || 50;

                          const saldo = [
                            { name: "Vencidas", value: item.dosesVencidas || 0, color: CORES_SALDO.vencidas },
                            { name: "Descartadas", value: item.dosesDescartadas || 0, color: CORES_SALDO.descartadas },
                            { name: "Partilhadas", value: item.dosesPartilhadas || 0, color: CORES_SALDO.partilhadas },
                            { name: "Utilizadas", value: item.dosesUtilizadas || 0, color: CORES_SALDO.utilizadas },
                            { name: "Disponíveis", value: item.dosesDisponiveis || 0, color: CORES_SALDO.disponiveis },
                          ];

                          const ativoNesteItem = graficoAtivo?.itemId === item.id;
                          const fatiaAtiva = ativoNesteItem ? saldo[graficoAtivo.index] : null;
                          const totalSaldo = saldo.reduce((soma, cat) => soma + cat.value, 0);
                          const porcentagem = fatiaAtiva && totalSaldo > 0
                            ? `${((fatiaAtiva.value / totalSaldo) * 100).toFixed(1)}%`
                            : "";

                          return (
                            <div
                              key={item.id}
                              className={`border border-gray-200 rounded-xl bg-white shadow-sm relative transition-all ${isApresentacaoMinimizado ? "p-2.5" : "p-4"
                                }`}
                            >
                              <div className={`flex items-center justify-between ${isApresentacaoMinimizado ? "" : "border-b border-gray-100 pb-2 mb-3"}`}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs font-semibold text-gray-800">Apresentação</span>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                                    <Package size={10} /> {dosesPorFrasco} doses/frasco
                                  </span>
                                  {isApresentacaoMinimizado && (
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                      ({item.dosesDisponiveis} disp. · {item.quantidadeDoses || 0} lançadas)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setApresentacoesMinimizadas((prev) => ({ ...prev, [item.id]: !isApresentacaoMinimizado }))}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                                    title={isApresentacaoMinimizado ? "Expandir apresentação" : "Minimizar apresentação"}
                                  >
                                    {isApresentacaoMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                  </button>
                                  {!disabled && (
                                    <button
                                      type="button"
                                      onClick={() => removerItemApresentacao(item.id)}
                                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                                      title="Remover apresentação"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {!isApresentacaoMinimizado && (
                                <div className="animate-fadeIn">
                                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    {/* Gráfico de Pizza do Saldo */}
                                    <div className="w-24 h-24 flex items-center justify-center relative select-none flex-shrink-0">
                                      <PieChart width={96} height={96}>
                                        <Pie
                                          data={saldo}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={26}
                                          outerRadius={35}
                                          paddingAngle={2}
                                          dataKey="value"
                                          stroke="none"
                                          activeIndex={ativoNesteItem ? graficoAtivo.index : undefined}
                                          activeShape={renderActiveShape}
                                          onMouseEnter={(_, itemIndex) => setGraficoAtivo({ itemId: item.id, index: itemIndex })}
                                          onMouseLeave={() => setGraficoAtivo(null)}
                                        >
                                          {saldo.map((cat) => (
                                            <Cell key={cat.name} fill={cat.color} />
                                          ))}
                                        </Pie>
                                      </PieChart>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                        <span className="text-sm font-black leading-none" style={{ color: fatiaAtiva?.color ?? "#1f2937" }}>
                                          {fatiaAtiva?.value ?? totalSaldo}
                                        </span>
                                        <span className="text-[7px] text-gray-500 font-semibold uppercase max-w-[52px] truncate mt-0.5">
                                          {fatiaAtiva?.name ?? "Total"}
                                        </span>
                                        {fatiaAtiva && <span className="text-[8px] font-bold" style={{ color: fatiaAtiva.color }}>{porcentagem}</span>}
                                      </div>
                                    </div>

                                    {/* Cartões de Disponíveis x Lançadas */}
                                    <div className="flex gap-2 flex-1 w-full justify-center">
                                      <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[150px] gap-1 bg-gray-50/80 justify-between">
                                        <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>
                                        <div className="flex gap-2 items-end justify-center py-0.5">
                                          <div className="flex flex-col items-center flex-1">
                                            <span className="text-sm font-bold text-gray-700">{item.frascosDisponiveis}</span>
                                            <span className="text-[9px] text-gray-400">Frascos</span>
                                          </div>
                                          <div className="flex flex-col items-center flex-1">
                                            <span className="text-sm font-bold text-gray-700">{item.dosesDisponiveis}</span>
                                            <span className="text-[9px] text-gray-400">Doses</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[150px] gap-1 bg-white justify-between">
                                        <span className="text-[11px] text-gray-500 font-medium text-center">
                                          Lançadas <span className="text-red-500">*</span>
                                        </span>
                                        <div className="flex gap-1.5 items-end justify-center">
                                          <label className="flex flex-col flex-1 min-w-0">
                                            <input
                                              aria-label={`Frascos lançados do lote ${item.numeroPartida}`}
                                              type="number"
                                              min="0"
                                              value={item.quantidadeFrascos || ""}
                                              disabled={disabled}
                                              placeholder="0"
                                              onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const frascos = val === "" ? 0 : Number(val);
                                                alterarItemInsumo(item.id, {
                                                  quantidadeFrascos: val === "" ? "" : frascos,
                                                  quantidadeDoses: val === "" ? "" : frascos * dosesPorFrasco,
                                                });
                                              }}
                                              className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] disabled:bg-gray-50 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                          </label>
                                          <label className="flex flex-col flex-1 min-w-0">
                                            <input
                                              aria-label={`Doses lançadas do lote ${item.numeroPartida}`}
                                              type="number"
                                              min="0"
                                              value={item.quantidadeDoses || ""}
                                              disabled={disabled}
                                              placeholder="0"
                                              onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const doses = val === "" ? 0 : Number(val);
                                                alterarItemInsumo(item.id, {
                                                  quantidadeDoses: val === "" ? "" : doses,
                                                  quantidadeFrascos: val === "" ? "" : Math.ceil(doses / dosesPorFrasco),
                                                });
                                              }}
                                              className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] disabled:bg-gray-50 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Doses</span>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Justificativa Obrigatória */}
                                  <div className="w-full h-[52px] mt-4 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex flex-col justify-center text-left focus-within:border-[#1A7A3C] shadow-sm transition-colors">
                                    <span className="text-[10px] text-gray-500 select-none mb-0.5">
                                      Justificativa <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                      type="text"
                                      value={item.justificativa || ""}
                                      disabled={disabled}
                                      maxLength={1500}
                                      placeholder="Digite o motivo deste lançamento."
                                      onChange={(e) => alterarItemInsumo(item.id, { justificativa: e.target.value })}
                                      className="w-full bg-transparent border-none text-xs p-0 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-300 disabled:text-gray-500"
                                    />
                                  </div>

                                  {/* Sub-legenda com quantidades detalhadas do saldo */}
                                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px]">
                                    {saldo.map((cat) => (
                                      <div key={cat.name} className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-gray-400 font-medium">{cat.name}:</span>
                                        <span className="font-bold text-gray-600">{cat.value}</span>
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
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* Modal de Seleção Múltipla de Lotes/Insumos */}
      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Insumos"
        subtitle="Selecione os lotes de insumos de exames desejados para vincular a este ajuste:"
        icon={<Package size={24} className="text-[#1A7A3C] flex-shrink-0" />}
        data={INSUMOS_MOCK.map((item) => ({
          ...item,
          // Cria o campo concatenado para a coluna exibir "Doença - Insumo"
          doencaComInsumo: item.doenca && item.tipoInsumo
            ? `${item.doenca} - ${item.tipoInsumo}`
            : item.doenca || item.tipoInsumo || "—",
        }))}
        searchKeys={["nome", "numeroPartida", "doenca", "tipoInsumo", "doencaComInsumo", "laboratorio"]}
        searchPlaceholder="Busque por lote, doença ou insumo."
        columns={[
          { label: "Lote / Nº de Partida", key: "nome" },
          { label: "Insumo", key: "doencaComInsumo" }, // <-- Usando a chave combinada aqui
          { label: "Saldo de Doses", key: "dosesDisponiveisTotais" },
          { label: "UF", key: "uf" },
        ]}
        selectedItems={insumosSelecionados}
        onConfirm={(selectedValues) => {
          setInsumosSelecionados(selectedValues);
        }}
      />
    </>
  );
}
