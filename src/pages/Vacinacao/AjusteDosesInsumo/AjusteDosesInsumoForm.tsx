import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Package,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import {
  FloatInput,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  criarNotaFiscalAjustada,
  notasDaRevendedora,
  REVENDEDORAS_INSUMO_MOCK,
  type NotaFiscalAjustada,
  type NotaFiscalInsumo,
  type RevendedoraInsumo,
  type SituacaoAjusteDosesInsumo,
} from "./ajusteDosesInsumoData";

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
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
    <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
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

interface DetalhesNotaFiscalProps {
  nota: NotaFiscalAjustada;
  disabled: boolean;
  onChange: (nota: NotaFiscalAjustada) => void;
  onRemove?: () => void;
}

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

function DetalhesNotaFiscal({
  nota,
  disabled,
  onChange,
  onRemove,
}: DetalhesNotaFiscalProps) {
  const [open, setOpen] = useState(true);
  const [itensMinimizados, setItensMinimizados] = useState<Record<string, boolean>>({});
  const [graficoAtivo, setGraficoAtivo] = useState<{ itemId: string; index: number } | null>(null);
  const itemPrincipal = nota.itens[0];
  const dosesTotaisLote = nota.itens.reduce((total, item) => (
    total
    + item.dosesVencidas
    + item.dosesDescartadas
    + item.dosesPartilhadas
    + item.dosesUtilizadas
    + item.dosesDisponiveis
  ), 0);

  const alterarItem = (
    itemId: string,
    patch: Partial<NotaFiscalAjustada["itens"][number]>,
  ) => {
    onChange({
      ...nota,
      itens: nota.itens.map((item) => (
        item.id === itemId ? { ...item, ...patch } : item
      )),
    });
  };

  const removerItem = (itemId: string) => {
    if (nota.itens.length === 1) {
      onRemove?.();
      return;
    }
    onChange({
      ...nota,
      itens: nota.itens.filter((item) => item.id !== itemId),
    });
  };

  return (
    <article className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">
      <div className={`flex items-center justify-between gap-4 px-1 ${open ? "mb-4" : ""}`}>
        <div className="flex items-center gap-2 min-w-0">
          <Package size={24} className="text-[#1A7A3C] flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-gray-800">Lote:</span>
            <span className="text-sm font-bold text-gray-900">{nota.lote}</span>
          </div>
          <div className="relative group/lote-info flex-shrink-0 z-20">
            <Info size={14} className="text-gray-400 cursor-help" />
            <div className="fixed inset-0 bg-black/15 hidden group-hover/lote-info:block pointer-events-none z-[998] animate-fadeIn" />
            <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl hidden group-hover/lote-info:block animate-fadeIn z-[999] text-left overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-gray-100 p-3">
                <Package size={13} className="text-gray-500" />
                <span className="text-[11px] font-extrabold text-gray-800">Nº de Partida: {nota.lote}</span>
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
                  <span className="font-bold text-gray-700">{itemPrincipal?.validade.split("-").reverse().join("/") ?? "—"}</span>
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
            onClick={() => setOpen((value) => !value)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
            title={open ? "Minimizar lote" : "Expandir lote"}
          >
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {!disabled && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0"
            title="Remover lote"
          >
            <Trash2 size={17} />
          </button>
          )}
        </div>
      </div>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-fadeIn">
              {nota.itens.map((item) => (
                (() => {
                  const minimizado = itensMinimizados[item.id] ?? false;
                  const saldo = [
                    { name: "Vencidas", value: item.dosesVencidas, color: CORES_SALDO.vencidas },
                    { name: "Descartadas", value: item.dosesDescartadas, color: CORES_SALDO.descartadas },
                    { name: "Partilhadas", value: item.dosesPartilhadas, color: CORES_SALDO.partilhadas },
                    { name: "Utilizadas", value: item.dosesUtilizadas, color: CORES_SALDO.utilizadas },
                    { name: "Disponíveis", value: item.dosesDisponiveis, color: CORES_SALDO.disponiveis },
                  ];
                  const ativoNesteItem = graficoAtivo?.itemId === item.id;
                  const fatiaAtiva = ativoNesteItem ? saldo[graficoAtivo.index] : null;
                  const total = saldo.reduce((soma, categoria) => soma + categoria.value, 0);
                  const porcentagem = fatiaAtiva && total > 0
                    ? `${((fatiaAtiva.value / total) * 100).toFixed(1)}%`
                    : "";

                  return (
                  <div key={item.id} className={`border border-gray-200 rounded-xl bg-white shadow-sm relative transition-all ${minimizado ? "p-2.5" : "p-4"}`}>
                    <div className={`flex items-center justify-between ${minimizado ? "" : "border-b border-gray-100 pb-2 mb-3"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold text-gray-800">Apresentação</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                          <Package size={10} /> {item.dosesPorFrasco} doses/frasco
                        </span>
                        {minimizado && (
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            ({item.dosesDisponiveis} disp. · {item.dosesLancadas || 0} lançadas)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setItensMinimizados((atual) => ({ ...atual, [item.id]: !minimizado }))}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                          title={minimizado ? "Expandir apresentação" : "Minimizar apresentação"}
                        >
                          {minimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                        </button>
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => removerItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                            title="Remover apresentação"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {!minimizado && (
                      <div className="animate-fadeIn">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
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
                                {saldo.map((categoria) => <Cell key={categoria.name} fill={categoria.color} />)}
                              </Pie>
                            </PieChart>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                              <span className="text-sm font-black leading-none" style={{ color: fatiaAtiva?.color ?? "#1f2937" }}>
                                {fatiaAtiva?.value ?? total}
                              </span>
                              <span className="text-[7px] text-gray-500 font-semibold uppercase max-w-[52px] truncate mt-0.5">
                                {fatiaAtiva?.name ?? "Total"}
                              </span>
                              {fatiaAtiva && <span className="text-[8px] font-bold" style={{ color: fatiaAtiva.color }}>{porcentagem}</span>}
                            </div>
                          </div>

                          <div className="flex gap-2 flex-1 w-full justify-center">
                            <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[150px] gap-1 bg-gray-50/80 justify-between">
                              <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>
                              <div className="flex gap-2 items-end justify-center py-0.5">
                                <div className="flex flex-col items-center flex-1"><span className="text-sm font-bold text-gray-700">{item.frascosDisponiveis}</span><span className="text-[9px] text-gray-400">Frascos</span></div>
                                <div className="flex flex-col items-center flex-1"><span className="text-sm font-bold text-gray-700">{item.dosesDisponiveis}</span><span className="text-[9px] text-gray-400">Doses</span></div>
                              </div>
                            </div>

                            <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[150px] gap-1 bg-white justify-between">
                              <span className="text-[11px] text-gray-500 font-medium text-center">Lançadas <span className="text-red-500">*</span></span>
                              <div className="flex gap-1.5 items-end justify-center">
                                <label className="flex flex-col flex-1 min-w-0">
                                  <input
                                    aria-label={`Frascos lançados da partida ${item.numeroPartida}`}
                                    type="number"
                                    min="0"
                                    value={item.frascosLancados}
                                    disabled={disabled}
                                    placeholder="0"
                                    onChange={(event) => {
                                      const frascos = event.target.value.replace(/\D/g, "");
                                      alterarItem(item.id, {
                                        frascosLancados: frascos,
                                        dosesLancadas: frascos === "" ? "" : String(Number(frascos) * item.dosesPorFrasco),
                                      });
                                    }}
                                    className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] disabled:bg-gray-50 disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                </label>
                                <label className="flex flex-col flex-1 min-w-0">
                                  <input
                                    aria-label={`Doses lançadas da partida ${item.numeroPartida}`}
                                    type="number"
                                    min="0"
                                    value={item.dosesLancadas}
                                    disabled={disabled}
                                    placeholder="0"
                                    onChange={(event) => {
                                      const doses = event.target.value.replace(/\D/g, "");
                                      alterarItem(item.id, {
                                        dosesLancadas: doses,
                                        frascosLancados: doses === "" ? "" : String(Math.ceil(Number(doses) / item.dosesPorFrasco)),
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

                    <div className="w-full h-[52px] mt-4 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex flex-col justify-center text-left focus-within:border-[#1A7A3C] shadow-sm transition-colors">
                        <span className="text-[10px] text-gray-500 select-none mb-0.5">Justificativa <span className="text-red-500">*</span></span>
                      <input
                        type="text"
                        value={item.justificativa}
                        disabled={disabled}
                        maxLength={1500}
                        placeholder="Digite o motivo deste lançamento."
                        onChange={(event) => alterarItem(item.id, { justificativa: event.target.value })}
                        className="w-full bg-transparent border-none text-xs p-0 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-300 disabled:text-gray-500"
                      />
                    </div>

                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px]">
                          {saldo.map((categoria) => (
                            <div key={categoria.name} className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: categoria.color }} />
                              <span className="text-gray-400 font-medium">{categoria.name}:</span>
                              <span className="font-bold text-gray-600">{categoria.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })()
              ))}
        </div>
      )}
    </article>
  );
}

export function AjusteDosesInsumoForm({
  value,
  onChange,
  mode = "create",
}: FormProps) {
  const [modalNotasAberto, setModalNotasAberto] = useState(false);
  const cadastro = mode === "create";
  const notasDisponiveis = notasDaRevendedora(value.revendedora?.codigo);

  const selecionarRevendedora = (revendedora: RevendedoraInsumo) => {
    onChange({ ...value, revendedora, notasFiscais: [] });
  };

  const selecionarNotas = (notas: NotaFiscalInsumo[]) => {
    const notasAjustadas = notas.map((nota) => (
      value.notasFiscais.find((selecionada) => selecionada.id === nota.id)
      ?? criarNotaFiscalAjustada(nota)
    ));
    onChange({ ...value, notasFiscais: notasAjustadas });
  };

  return (
    <>
      <Section title="Informações Básicas">
        {cadastro ? (
          <EntitySearchInput
            label="Revendedora de Insumos"
            placeholder="Buscar por código ou nome."
            required
            value={value.revendedora?.nome ?? ""}
            data={REVENDEDORAS_INSUMO_MOCK}
            searchKeys={["codigo", "nome"]}
            columns={[
              { label: "Código", key: "codigo" },
              { label: "Nome", key: "nome" },
              { label: "UF", key: "uf" },
            ]}
            icon={<img src={Icons.iconeInsumoUrl} alt="Revendedora de Insumos" className="w-5 h-5 object-contain" />}
            title="Buscar Revendedora de Insumos"
            subtitle="Busque por revendedoras habilitadas para insumos de exames de brucelose e tuberculose:"
            confirmLabel="Selecionar"
            onChange={selecionarRevendedora}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput label="Revendedora de Insumos" required value={value.revendedora?.nome ?? ""} disabled />
            <FloatInput label="Código da Revendedora" required value={value.revendedora?.codigo ?? ""} disabled />
          </div>
        )}
      </Section>

      <Section title="Nota Fiscal">
        <div className="flex flex-col gap-5">
          {cadastro && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-xs text-gray-500 font-medium">Saldo de doses</p>
                {value.notasFiscais.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg w-fit">
                    <span className="text-[11px] font-semibold text-gray-500">DOSES LANÇADAS:</span>
                    <span className="text-[11px] font-black text-[#1A7A3C]">
                      {value.notasFiscais.reduce((total, nota) => total + nota.itens.reduce((subtotal, item) => subtotal + Number(item.dosesLancadas || 0), 0), 0)} doses
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!value.revendedora}
                onClick={() => setModalNotasAberto(true)}
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition disabled:border-gray-200 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <PlusCircle size={16} /> Adicionar Nota Fiscal
              </button>
            </div>
          )}

          {!value.revendedora && cadastro ? (
            <p className="text-sm text-gray-400 italic py-4">
              É necessário selecionar uma Revendedora de Insumos para pesquisar lotes.
            </p>
          ) : value.notasFiscais.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl py-8 text-center">
              <p className="text-sm text-gray-400 italic">Nenhum saldo vinculado a este ajuste até o momento.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cadastro && <h3 className="text-sm font-semibold text-gray-700">Lançadas</h3>}
              {value.notasFiscais.map((nota) => (
                <DetalhesNotaFiscal
                  key={nota.id}
                  nota={nota}
                  disabled={!cadastro}
                  onChange={(notaAtualizada) => onChange({
                    ...value,
                    notasFiscais: value.notasFiscais.map((item) => (
                      item.id === notaAtualizada.id ? notaAtualizada : item
                    )),
                  })}
                  onRemove={cadastro ? () => onChange({
                    ...value,
                    notasFiscais: value.notasFiscais.filter((item) => item.id !== nota.id),
                  }) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      {!cadastro && (
        <Section title="Situação">
          <FloatInput
            label="Situação"
            value={value.situacao}
            disabled
          />
        </Section>
      )}

      <MultiSearchModal<NotaFiscalInsumo>
        open={modalNotasAberto}
        onClose={() => setModalNotasAberto(false)}
        title="Buscar Notas Fiscais"
        subtitle="Selecione as notas fiscais vinculadas à revendedora informada:"
        icon={<Package size={21} className="text-[#1A7A3C]" />}
        data={notasDisponiveis}
        columns={[
          { label: "Nota Fiscal", key: "numero" },
          { label: "Número da Partida", key: "lote" },
          { label: "Saldo da Apresentação", key: "saldoApresentacao" },
        ]}
        searchKeys={["lote", "numero", "itensFormatados"]}
        searchPlaceholder="Buscar por nota fiscal, partida ou insumo."
        selectedItems={value.notasFiscais}
        confirmLabel="Adicionar Notas Fiscais"
        onConfirm={selecionarNotas}
      />
    </>
  );
}
