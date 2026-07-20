import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  PlusCircle,
  Trash2,
} from "lucide-react";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  criarNotaFiscalAjustada,
  notasDaRevendedora,
  REVENDEDORAS_INSUMO_MOCK,
  SITUACOES_AJUSTE_DOSES_INSUMO,
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

function DetalhesNotaFiscal({
  nota,
  disabled,
  onChange,
  onRemove,
}: DetalhesNotaFiscalProps) {
  const [open, setOpen] = useState(true);

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

  return (
    <article className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gray-50/70 border-b border-gray-100">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 text-left min-w-0"
        >
          <img src={Icons.iconeNotaFiscalUrl} alt="Nota Fiscal" className="w-6 h-6 object-contain flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800">Nota Fiscal nº {nota.numero}</p>
            <p className="text-xs text-gray-500 truncate">{nota.itensFormatados}</p>
          </div>
          {open ? <ChevronUp size={17} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={17} className="text-gray-400 flex-shrink-0" />}
        </button>

        {!disabled && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0"
            title="Remover nota fiscal"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {open && (
        <div className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput label="Número da Nota Fiscal" value={nota.numero} disabled />
            <FloatInput label="Data de Emissão" type="date" value={nota.dataEmissao} disabled />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Lançadas</h3>
            <div className="flex flex-col gap-4">
              {nota.itens.map((item, index) => (
                <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#1A7A3C] text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">Insumo de exame</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FloatInput label="Número da Partida" value={item.numeroPartida} disabled />
                    <FloatInput label="Validade" type="date" value={item.validade} disabled />
                    <FloatInput label="Doença" value={item.doenca} disabled />
                    <FloatInput label="Tipo de Insumo de Exame" value={item.tipoInsumo} disabled className="lg:col-span-2" />
                    <FloatInput label="Doses por Frasco" value={String(item.dosesPorFrasco)} disabled />
                    <FloatInput label="Frascos Disponíveis" value={String(item.frascosDisponiveis)} disabled />
                    <FloatInput label="Doses Disponíveis" value={String(item.dosesDisponiveis)} disabled />
                    <FloatInput
                      label="Frascos Lançados"
                      required
                      type="number"
                      value={item.frascosLancados}
                      disabled={disabled}
                      onChange={(frascos) => {
                        const normalizado = frascos.replace(/\D/g, "");
                        alterarItem(item.id, {
                          frascosLancados: normalizado,
                          dosesLancadas: normalizado === ""
                            ? ""
                            : String(Number(normalizado) * item.dosesPorFrasco),
                        });
                      }}
                    />
                    <FloatInput
                      label="Doses Lançadas"
                      required
                      type="number"
                      value={item.dosesLancadas}
                      disabled={disabled}
                      onChange={(doses) => {
                        const normalizado = doses.replace(/\D/g, "");
                        alterarItem(item.id, {
                          dosesLancadas: normalizado,
                          frascosLancados: normalizado === ""
                            ? ""
                            : String(Math.ceil(Number(normalizado) / item.dosesPorFrasco)),
                        });
                      }}
                    />
                    <div className="md:col-span-2 lg:col-span-3">
                      <LargeTextArea
                        label="Justificativa"
                        required
                        value={item.justificativa}
                        disabled={disabled}
                        rows={3}
                        maxLength={1500}
                        onChange={(justificativa) => alterarItem(item.id, { justificativa })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  const visualizacao = mode === "view";
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

      <Section title="Nota Fiscal (Uma ou mais)">
        <div className="flex flex-col gap-5">
          {cadastro && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Notas Fiscais <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Selecione uma ou mais notas emitidas para a revendedora informada.
                </p>
              </div>
              <button
                type="button"
                disabled={!value.revendedora}
                onClick={() => setModalNotasAberto(true)}
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition disabled:border-gray-200 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <PlusCircle size={16} /> Selecionar Notas Fiscais
              </button>
            </div>
          )}

          {!value.revendedora && cadastro ? (
            <p className="text-sm text-gray-400 italic py-4">
              Selecione a revendedora para consultar as notas fiscais disponíveis.
            </p>
          ) : value.notasFiscais.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl py-8 text-center">
              <p className="text-sm text-gray-400">Nenhuma nota fiscal selecionada.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
          <FloatSelect
            label="Situação"
            required
            value={value.situacao}
            disabled={visualizacao}
            options={SITUACOES_AJUSTE_DOSES_INSUMO}
            onChange={(situacao) => onChange({
              ...value,
              situacao: situacao as SituacaoAjusteDosesInsumo,
            })}
          />
        </Section>
      )}

      <MultiSearchModal<NotaFiscalInsumo>
        open={modalNotasAberto}
        onClose={() => setModalNotasAberto(false)}
        title="Buscar Notas Fiscais"
        subtitle="Busque pelas notas fiscais cadastradas no nome da revendedora selecionada:"
        icon={<FileText size={21} className="text-[#1A7A3C]" />}
        data={notasDisponiveis}
        columns={[
          { label: "Número", key: "numero" },
          { label: "Data de Emissão", key: "dataEmissao" },
          { label: "Insumos", key: "itensFormatados" },
        ]}
        searchKeys={["numero", "itensFormatados"]}
        searchPlaceholder="Buscar por número, doença ou tipo de insumo."
        selectedItems={value.notasFiscais}
        confirmLabel="Salvar Selecionadas"
        onConfirm={selecionarNotas}
      />
    </>
  );
}
