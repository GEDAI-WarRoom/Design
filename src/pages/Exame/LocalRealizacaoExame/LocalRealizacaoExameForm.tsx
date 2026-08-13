import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Eye, Info, PlusCircle, Trash2 } from "lucide-react";
import { FloatInput, MultiSearchModal, SimNao } from "../../../components/ui/FormKit";
import {
  BlocoEnderecoFields,
  EstabelecimentoAgropecuarioInput,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  listarVeterinariosHabilitados,
  PROPRIETARIOS_LOCAL_EXAME,
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
  ehComercial: boolean | "";
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
  const profissionaisBloqueados = isView;
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
          {isView && <FloatInput label="Código" value={codigo ?? ""} disabled />}
          <SimNao
            label="É um local comercial?"
            name="local-comercial"
            required={!isView}
            value={value.ehComercial}
            disabled={isView}
            onChange={(ehComercial) => onChange({ ...value, ehComercial })}
          />
          {value.ehComercial && <div>
            {isView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatInput label="Razão Social" value={value.proprietarios[0]?.entidade?.nome ?? ""} disabled />
                <FloatInput label="CNPJ" value={value.proprietarios[0]?.entidade?.documento ?? ""} disabled />
              </div>
            ) : (
              <ProprietarioInput
                value={value.proprietarios[0]?.entidade?.nome ?? ""}
                label="Pessoa Jurídica"
                data={PROPRIETARIOS_LOCAL_EXAME.filter((entidade) => entidade.tipo === "PJ")}
                required
                onChange={(entidade) => onChange({
                  ...value,
                  proprietarios: [{
                    uid: value.proprietarios[0]?.uid ?? uid(),
                    entidade,
                  }],
                })}
              />
            )}
          </div>}
        </div>
      </Section>

      <Section title="Profissionais Habilitados">
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f9fafb]/50">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3">
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Médicos Veterinários <span className="font-bold text-red-500" aria-hidden="true">*</span>
              </span>
            </div>
            {!profissionaisBloqueados && (
              <button
                type="button"
                onClick={() => setModalVeterinariosAberto(true)}
                disabled={value.veterinarios.length >= 5}
                title={value.veterinarios.length >= 5 ? "Limite de cinco profissionais atingido" : "Adicionar médicos veterinários"}
                className="flex h-10 items-center gap-2 rounded-md border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                <PlusCircle size={16} /> Adicionar Médicos Veterinários
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 p-5">
            {value.veterinarios.length === 0 ? (
              <p className="text-xs italic text-gray-400">Nenhum médico veterinário selecionado para este local.</p>
            ) : (
              value.veterinarios.map((veterinario, index) => (
                <article key={veterinario.id} className="rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1A7A3C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2">
                      {index + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FloatInput label="Médico Veterinário" required value={veterinario.nome} disabled />
                      <FloatInput label="CPF do Veterinário" required value={veterinario.cpf} disabled />
                    </div>
                    {!profissionaisBloqueados && (
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => alert(`Visualizar médico veterinário: ${veterinario.nome}`)}
                          className="rounded-md p-2 text-[#1A7A3C] transition hover:bg-green-50"
                          title="Visualizar médico veterinário"
                          aria-label={`Visualizar ${veterinario.nome}`}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({
                            ...value,
                            veterinarios: value.veterinarios.filter((item) => item.id !== veterinario.id),
                          })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                          title="Remover médico veterinário"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </Section>

      <Section title="Informações de Localização">
        <div className="flex flex-col gap-5">
          {isView ? (
            <>
              <SimNao
                label="Local de Realização de Exame Localizado em Estabelecimento Agropecuário Cadastrado?"
                name="local-exame-em-estabelecimento"
                value={value.localizadoEmEstabelecimento}
                onChange={() => {}}
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

      <MultiSearchModal<MedicoVeterinarioExame>
        open={modalVeterinariosAberto}
        onClose={() => setModalVeterinariosAberto(false)}
        title="Buscar Médicos Veterinários"
        subtitle="Busque por médico veterinário para realização de exame."
        icon={<img src={Icons.iconeProfissionalAnimalUrl} alt="Médico Veterinário" className="w-6 h-6 object-contain" />}
        data={veterinariosDisponiveis}
        columns={[
          { label: "Médico Veterinário", key: "nome" },
          { label: "CPF", key: "cpf" },
        ]}
        searchKeys={["nome", "cpf"]}
        searchPlaceholder="Buscar por nome ou CPF"
        selectedItems={value.veterinarios}
        pageSize={6}
        maxSelection={5}
        maxSelectionMessage="O limite de cinco médicos veterinários foi atingido. Remova um profissional para selecionar outro."
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
  estado: "",
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
