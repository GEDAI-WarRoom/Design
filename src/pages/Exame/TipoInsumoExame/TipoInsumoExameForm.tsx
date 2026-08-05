import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Info, PlusCircle, X } from "lucide-react";
import { FloatInput, FloatSelect, MultiSearchModal } from "../../../components/ui/FormKit";
import {
  SITUACOES_TIPO_INSUMO_EXAME,
  type DoencaReferencia,
  type SituacaoTipoInsumoExame,
} from "./tipoInsumoExameData";
import { DOENCAS_MOCK } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

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

export interface TipoInsumoExameFormValue {
  nome: string;
  doencas: DoencaReferencia[];
  situacao: SituacaoTipoInsumoExame;
}

interface TipoInsumoExameFormProps {
  value: TipoInsumoExameFormValue;
  onChange: (value: TipoInsumoExameFormValue) => void;
  disabled?: boolean;
  showSituacao?: boolean;
}

export function TipoInsumoExameForm({
  value,
  onChange,
  disabled = false,
  showSituacao = false,
}: TipoInsumoExameFormProps) {
  const [modalDoencaAberto, setModalDoencaAberto] = useState(false);
  const doencasSelecionadas = value.doencas;

  return (
    <Section title="Informações Básicas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FloatInput
          label="Nome do Tipo de Insumo"
          required
          value={value.nome}
          onChange={(nome) => onChange({ ...value, nome })}
          maxLength={255}
          disabled={disabled}
        />

        <div className="md:col-span-2">
          <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">Doença Selecionada</span>
                {doencasSelecionadas.length > 0 && (
                  <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
                    {doencasSelecionadas.length} {doencasSelecionadas.length === 1 ? "Selecionada" : "Selecionadas"}
                  </span>
                )}
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => setModalDoencaAberto(true)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
                >
                  <PlusCircle size={14} /> Adicionar Doença
                </button>
              )}
            </div>

            <div className="p-5 flex flex-wrap gap-4">
              {doencasSelecionadas.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Nenhuma doença selecionada para este tipo de insumo.</p>
              ) : (
                doencasSelecionadas.map((doenca) => (
                  <div
                    key={doenca.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[220px] shadow-sm transition hover:border-gray-300 relative group"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="text-sm font-bold text-[#1A7A3C]">{doenca.nome}</span>
                      <div className="flex items-center gap-1">
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => onChange({ ...value, doencas: value.doencas.filter((item) => item.id !== doenca.id) })}
                            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"
                            title="Remover"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showSituacao && (
          <FloatSelect
            label="Situação"
            required
            value={value.situacao}
            onChange={(situacao) => onChange({ ...value, situacao: situacao as SituacaoTipoInsumoExame })}
            options={SITUACOES_TIPO_INSUMO_EXAME}
            disabled={disabled}
            className="md:col-span-2"
          />
        )}
      </div>

      <MultiSearchModal<DoencaReferencia>
        open={modalDoencaAberto}
        onClose={() => setModalDoencaAberto(false)}
        title="Buscar Doenças"
        subtitle="Busque por uma ou mais doenças cadastradas no sistema:"
        icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-5 h-5 object-contain" />}
        data={DOENCAS_MOCK as DoencaReferencia[]}
        columns={[{ label: "Nome da Doença", key: "nome" }]}
        searchKeys={["nome"]}
        searchPlaceholder="Busque pelo nome da doença."
        selectedItems={value.doencas}
        confirmLabel="Salvar Selecionadas"
        onConfirm={(doencas) => {
          onChange({ ...value, doencas });
          setModalDoencaAberto(false);
        }}
      />
    </Section>
  );
}
