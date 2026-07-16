import { useState, type ReactNode } from "react";
// Adicionado o ícone Eye nos imports
import { Building2, ChevronDown, ChevronUp, Info, Eye } from "lucide-react";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput, MedicoVeterinarioInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  ESCRITORIOS_SECCIONAIS,
  FATOR_VALOR_GTA,
  MEDICOS_VETERINARIOS_GTA,
  SITUACOES_REGISTRO_VENDA_GTA,
  formatarMoeda,
  type EscritorioSeccional,
  type MedicoVendaGTA,
  type SituacaoRegistroVendaGTA,
} from "./registroVendaGTADigitalData";

export interface RegistroVendaGTAFormValue {
  medico: MedicoVendaGTA | null;
  escritorio: EscritorioSeccional | null;
  quantidadeComprada: string;
  quantidadeUtilizada: number;
  situacao: SituacaoRegistroVendaGTA;
}

function Section({ children }: { children: ReactNode }) {
  const [aberta, setAberta] = useState(true);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button type="button" onClick={() => setAberta((valor) => !valor)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">Informações Básicas</span>
        {aberta ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {aberta && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p>
    </div>
  );
}

interface Props {
  value: RegistroVendaGTAFormValue;
  onChange: (value: RegistroVendaGTAFormValue) => void;
  mode?: "create" | "view" | "edit";
  errors?: { medico?: boolean; escritorio?: boolean; quantity?: boolean };
}

export function RegistroVendaGTADigitalForm({ value, onChange, mode = "create", errors = {} }: Props) {
  const bloqueado = mode !== "create";
  
  const quantidade = Number(value.quantidadeComprada) || 0;
  const valorCalculado = quantidade * FATOR_VALOR_GTA;
  const disponivel = Math.max(0, quantidade - value.quantidadeUtilizada);

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          {bloqueado ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Médico Veterinário" required value={value.medico?.nome ?? ""} disabled />
              <FloatInput label="CPF do Veterinário" required value={value.medico?.cpf ?? ""} disabled />
            </div>
          ) : (
            <MedicoVeterinarioInput
              required
              value={value.medico?.nome ?? ""}
              data={MEDICOS_VETERINARIOS_GTA}
              error={errors.medico}
              onChange={(medico) => onChange({ ...value, medico })}
              onEyeClick={() => {}}
            />
          )}
        </div>

        {bloqueado ? (
          <div className="md:col-span-2">
            <FloatInput label="Escritório Seccional" required value={value.escritorio?.nome ?? ""} disabled />
          </div>
        ) : (
          <div className="flex items-end gap-2 w-full md:col-span-2">
            <div className="flex-1">
              <EntitySearchInput
                label="Escritório Seccional"
                placeholder="Buscar por nome ou sigla"
                required
                value={value.escritorio?.nome ?? ""}
                data={ESCRITORIOS_SECCIONAIS}
                searchKeys={["nome", "sigla"]}
                columns={[{ label: "Escritório Seccional", key: "nome" }, { label: "Sigla", key: "sigla" }]}
                icon={
                  Icons.iconeUnidadeAdministrativaUrl ? (
                    <img
                      src={Icons.iconeUnidadeAdministrativaUrl}
                      alt="Escritório Seccional"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
                title="Buscar Escritório Seccional"
                subtitle="Busque por um escritório seccional cadastrado:"
                confirmLabel="Selecionar"
                onChange={(escritorio) => onChange({ ...value, escritorio })}
              />
            </div>

            {value.escritorio && (
              <button
                type="button"
                onClick={() => alert(`Visualizar detalhes de: ${value.escritorio?.nome}`)}
                className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 mb-[1px]"
                title="Visualizar Escritório"
              >
                <Eye size={20} />
              </button>
            )}
          </div>
        )}

        {/* ARRUMADO: Agora o onChange atualiza o estado corretamente e aceita digitação */}
        <FloatInput
          label="Quantidade comprada"
          required
          type="text"
          inputMode="numeric"
          value={value.quantidadeComprada}
          disabled={bloqueado}
          onChange={(e: any) => {
            // Verifica se o FormKit entregou um evento nativo (.target) ou o valor direto
            const valorDigitado = e && typeof e === 'object' && 'target' in e ? e.target.value : String(e);
            const apenasNumeros = valorDigitado.replace(/\D/g, "");
            
            // Atualiza o estado global no pai, liberando a digitação e recalculando o valor na hora
            onChange({ 
              ...value, 
              quantidadeComprada: apenasNumeros 
            });
          }}
        />

        <FloatInput 
          label="Valor" 
          required 
          value={formatarMoeda(valorCalculado)} 
          disabled 
        />

        {mode !== "create" && (
          <>
            <FloatInput label="Qtd. disponível" required value={String(disponivel)} disabled />
            <FloatSelect
              label="Situação"
              required
              value={value.situacao}
              disabled={mode === "view" || value.situacao === "Cancelado"}
              options={SITUACOES_REGISTRO_VENDA_GTA}
              onChange={(situacao) => onChange({ ...value, situacao: situacao as SituacaoRegistroVendaGTA })}
            />
          </>
        )}
      </div>

      {errors.quantity && <p className="text-sm text-red-500 font-medium mt-3">A quantidade comprada deve ser maior que zero.</p>}
      {value.medico && value.medico.gtaDisponiveis > 0 && mode === "create" && (
        <p className="text-sm text-red-500 font-medium mt-3">Este médico veterinário ainda possui {value.medico.gtaDisponiveis} GTAs disponíveis e não pode receber uma nova venda.</p>
      )}
    </Section>
  );
}