import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Info, PlusCircle, X } from "lucide-react";
import { FloatInput, FloatSelect, MultiSearchModal, SimNao } from "../../../components/ui/FormKit";
import {
  BlocoEnderecoFields,
  DynamicListWrapper,
  EstabelecimentoAgropecuarioInput,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  listarVeterinariosHabilitados,
  SITUACOES_LOCAL_EXAME,
  type EnderecoLocalExame,
  type EstabelecimentoLocalExame,
  type MedicoVeterinarioExame,
  type ProprietarioLocalExame,
  type SituacaoLocalExame,
} from "./localRealizacaoExameData";

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

export interface ProprietarioFormItem {
  uid: string;
  entidade: ProprietarioLocalExame | null;
}

export interface LocalRealizacaoExameFormValue {
  proprietarios: ProprietarioFormItem[];
  localizadoEmEstabelecimento: boolean | "";
  estabelecimento: EstabelecimentoLocalExame | null;
  endereco: EnderecoLocalExame;
  veterinarios: MedicoVeterinarioExame[];
  situacao: SituacaoLocalExame;
}

interface LocalRealizacaoExameFormProps {
  value: LocalRealizacaoExameFormValue;
  onChange: (value: LocalRealizacaoExameFormValue) => void;
  codigo?: string;
  mode?: "create" | "view" | "edit";
}

const uid = () => `proprietario-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ENDERECOS_ESTABELECIMENTO: Record<number, Partial<EnderecoLocalExame>> = {
  1: {
    zona: "Rural",
    estado: "Minas Gerais",
    municipio: "Lavras",
    endereco: "Fazenda do Rio, acesso pela MG-335, km 18",
    localidade: "Serrinha",
    latitude: "-21.2572",
    longitude: "-45.0021",
  },
  2: {
    zona: "Rural",
    estado: "Minas Gerais",
    municipio: "Uberlândia",
    endereco: "Granja Vale Verde, Rodovia Municipal 455, km 12",
    localidade: "Floresta",
    latitude: "-18.9234",
    longitude: "-48.2812",
  },
};

function ReadonlyEndereco({ endereco }: { endereco: EnderecoLocalExame }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FloatInput label="Zona" value={endereco.zona} disabled />
      <FloatInput label="CEP" value={endereco.cep || "-"} disabled />
      <FloatInput label="Estado" value={endereco.estado} disabled />
      <FloatInput label="Município" value={endereco.municipio} disabled />
      <FloatInput label="Bairro" value={endereco.bairro || "-"} disabled />
      <FloatInput label="Endereço" value={endereco.endereco} disabled />
      <FloatInput label="Número" value={endereco.numero || "-"} disabled />
      <FloatInput label="Complemento" value={endereco.complemento || "-"} disabled />
      <FloatInput label="Localidade" value={endereco.localidade || "-"} disabled />
      <FloatInput label="Distrito" value={endereco.distrito || "-"} disabled />
      <FloatInput label="Latitude" value={endereco.latitude || "-"} disabled />
      <FloatInput label="Longitude" value={endereco.longitude || "-"} disabled />
    </div>
  );
}

export function LocalRealizacaoExameForm({
  value,
  onChange,
  codigo,
  mode = "create",
}: LocalRealizacaoExameFormProps) {
  const [modalVeterinariosAberto, setModalVeterinariosAberto] = useState(false);
  const isView = mode === "view";
  const profissionaisBloqueados = mode !== "create";
  const veterinariosDisponiveis = useMemo(
    () => listarVeterinariosHabilitados(),
    [modalVeterinariosAberto],
  );

  const selecionarEstabelecimento = (estabelecimento: EstabelecimentoLocalExame) => {
    onChange({
      ...value,
      estabelecimento,
      endereco: {
        ...value.endereco,
        ...ENDERECOS_ESTABELECIMENTO[estabelecimento.id],
        cep: "",
        bairro: "",
        numero: "",
        complemento: "",
        distrito: "",
      },
    });
  };

  return (
    <>
      <Section title="Informações Básicas">
        <div className="flex flex-col gap-5">
          {codigo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput label="Código" required value={codigo} maxLength={10} disabled />
              <FloatSelect
                label="Situação"
                required
                value={value.situacao}
                onChange={(situacao) => onChange({ ...value, situacao: situacao as SituacaoLocalExame })}
                options={SITUACOES_LOCAL_EXAME}
                disabled={isView}
              />
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Proprietários</h3>
            {isView ? (
              <div className="flex flex-col gap-4">
                {value.proprietarios.map((item, index) => (
                  <div key={item.uid} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatInput label={`Proprietário ${index + 1}`} value={item.entidade?.nome ?? ""} disabled />
                    <FloatInput label="CPF/CNPJ" value={item.entidade?.documento ?? ""} disabled />
                  </div>
                ))}
              </div>
            ) : (
              <DynamicListWrapper
                items={value.proprietarios}
                behavior="at-least-one"
                addButtonLabel="Adicionar Proprietário"
                itemLabel="Proprietário"
                variant="plain"
                onAddItem={() => onChange({
                  ...value,
                  proprietarios: [...value.proprietarios, { uid: uid(), entidade: null }],
                })}
                onRemoveItem={(index) => onChange({
                  ...value,
                  proprietarios: value.proprietarios.filter((_, itemIndex) => itemIndex !== index),
                })}
              >
                {(item: ProprietarioFormItem, index: number) => (
                  <ProprietarioInput
                    value={item.entidade?.nome ?? ""}
                    required
                    onChange={(entidade) => onChange({
                      ...value,
                      proprietarios: value.proprietarios.map((proprietario, itemIndex) => (
                        itemIndex === index ? { ...proprietario, entidade } : proprietario
                      )),
                    })}
                  />
                )}
              </DynamicListWrapper>
            )}
          </div>
        </div>
      </Section>

      <Section title="Informações de Localização">
        <div className="flex flex-col gap-5">
          {isView ? (
            <>
              <FloatInput
                label="Localizado em Estabelecimento Agropecuário Cadastrado?"
                value={value.localizadoEmEstabelecimento ? "Sim" : "Não"}
                disabled
              />
              {value.estabelecimento && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Estabelecimento Agropecuário" value={value.estabelecimento.nome} disabled />
                  <FloatInput label="Código do Estabelecimento Agropecuário" value={value.estabelecimento.codigo} disabled />
                </div>
              )}
              <ReadonlyEndereco endereco={value.endereco} />
            </>
          ) : (
            <>
              <SimNao
                label="Local de Realização de Exame Localizado em Estabelecimento Agropecuário Cadastrado?"
                name="local-exame-em-estabelecimento"
                required
                value={value.localizadoEmEstabelecimento}
                onChange={(localizadoEmEstabelecimento) => onChange({
                  ...value,
                  localizadoEmEstabelecimento,
                  estabelecimento: localizadoEmEstabelecimento ? value.estabelecimento : null,
                })}
              />

              {value.localizadoEmEstabelecimento === true && (
                <EstabelecimentoAgropecuarioInput
                  value={value.estabelecimento?.nome ?? ""}
                  required
                  onChange={selecionarEstabelecimento}
                />
              )}

              <BlocoEnderecoFields
                title="Endereço"
                data={value.endereco}
                tipoEstado={value.localizadoEmEstabelecimento === true ? "travado" : "normal"}
                onChange={(key, fieldValue) => onChange({
                  ...value,
                  endereco: { ...value.endereco, [key]: fieldValue },
                })}
                onSetMultipleFields={(fields) => onChange({
                  ...value,
                  endereco: { ...value.endereco, ...fields },
                })}
              />
            </>
          )}
        </div>
      </Section>

      <Section title="Profissionais Habilitados">
        <div className="flex flex-col gap-5">
          {!profissionaisBloqueados && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalVeterinariosAberto(true)}
                className="flex items-center gap-2 px-4 h-10 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                <PlusCircle size={16} /> Selecionar Médicos Veterinários
              </button>
            </div>
          )}

          {value.veterinarios.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Nenhum médico veterinário selecionado.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {value.veterinarios.map((veterinario, index) => (
                <article key={veterinario.id} className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1A7A3C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2">
                      {index + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FloatInput label="Médico Veterinário" required value={veterinario.nome} disabled />
                      <FloatInput label="CPF do Veterinário" required value={veterinario.cpf} disabled />
                      <FloatInput
                        label="Exames que Realiza"
                        required
                        value={veterinario.examesFormatados}
                        disabled
                        className="md:col-span-2"
                      />
                    </div>
                    {!profissionaisBloqueados && (
                      <button
                        type="button"
                        onClick={() => onChange({
                          ...value,
                          veterinarios: value.veterinarios.filter((item) => item.id !== veterinario.id),
                        })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition mt-2"
                        title="Remover médico veterinário"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Section>

      <MultiSearchModal<MedicoVeterinarioExame>
        open={modalVeterinariosAberto}
        onClose={() => setModalVeterinariosAberto(false)}
        title="Buscar Médicos Veterinários"
        subtitle="Selecione profissionais habilitados que ainda não estejam vinculados a outro local de realização de exame."
        icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-6 h-6 object-contain" />}
        data={veterinariosDisponiveis}
        columns={[
          { label: "Médico Veterinário", key: "nome" },
          { label: "CPF", key: "cpf" },
          { label: "Exames que Realiza", key: "examesFormatados" },
        ]}
        searchKeys={["nome", "cpf", "examesFormatados"]}
        searchPlaceholder="Buscar por nome, CPF ou exame"
        selectedItems={value.veterinarios}
        confirmLabel="Salvar Selecionados"
        onConfirm={(veterinarios) => {
          onChange({ ...value, veterinarios });
          setModalVeterinariosAberto(false);
        }}
      />
    </>
  );
}

export const criarEnderecoVazio = (): EnderecoLocalExame => ({
  zona: "",
  cep: "",
  estado: "Minas Gerais",
  municipio: "",
  bairro: "",
  endereco: "",
  numero: "",
  complemento: "",
  localidade: "",
  distrito: "",
  latitude: "",
  longitude: "",
});

export const criarProprietarioVazio = (): ProprietarioFormItem => ({ uid: uid(), entidade: null });
