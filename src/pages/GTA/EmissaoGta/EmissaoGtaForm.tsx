import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Search,
} from "lucide-react";
import { EntitySearchInput, DynamicListWrapper } from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatMultiSelect,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  ACOUGUES_GTA,
  AEROPORTOS_GTA,
  DOENCAS_VACINA_GTA,
  ESPECIES_GTA,
  ESTABELECIMENTOS_GTA,
  ESTADOS_BRASIL,
  EVENTOS_GTA,
  EXPLORACOES_GTA,
  FINALIDADES_GTA,
  FRIGORIFICOS_GTA,
  ISENCOES_TAXA_GTA,
  ISENCOES_VACINACAO_GTA,
  MEIOS_TRANSPORTE,
  MUNICIPIOS_POR_ESTADO,
  NUCLEOS_GTA,
  PESSOAS_GTA,
  REVENDEDORAS_ANIMAIS_GTA,
  TIPOS_ATESTADO_EXAME_GTA,
  TIPOS_FORMULARIO_GTA,
  TIPOS_LOCAL_OPTIONS,
  criarDestinoVazio,
  criarFaixasAnimais,
  criarLocalVazio,
  formatarDataGta,
  formatarMoedaGta,
  totalAnimaisGta,
  type DestinoGta,
  type EmissaoGtaFormValue,
  type EntidadeGta,
  type LocalGta,
  type TipoFormularioGta,
  type TipoLocalGta,
} from "./emissaoGtaData";

type FormMode = "create" | "view";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [aberta, setAberta] = useState(defaultOpen);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setAberta((valor) => !valor)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {aberta ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {aberta && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </section>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span>{" "}
        são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

function EntityPicker({
  label,
  value,
  data,
  onChange,
  required,
  disabled,
  codeLabel = "Código",
  codeKey = "codigo",
  placeholder,
}: {
  label: string;
  value: EntidadeGta | null;
  data: EntidadeGta[];
  onChange: (entidade: any) => void;
  required?: boolean;
  disabled?: boolean;
  codeLabel?: string;
  codeKey?: "codigo" | "documento";
  placeholder?: string;
}) {
  const codigo = value?.[codeKey] ?? "";
  if (disabled) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatInput label={label} value={value?.nome ?? ""} required={required} disabled />
        <FloatInput label={codeLabel} value={codigo} required={required} disabled />
      </div>
    );
  }

  return (
    <div
      className={
        value
          ? "grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
          : "w-full"
      }
    >
      <EntitySearchInput
        label={label}
        placeholder={placeholder ?? `Buscar ${label.toLowerCase()}`}
        required={required}
        value={value?.nome ?? ""}
        data={data}
        searchKeys={["nome", codeKey]}
        columns={[
          { label, key: "nome" },
          { label: codeLabel, key: codeKey },
        ]}
        icon={<Search size={18} />}
        title={`Buscar ${label}`}
        subtitle={`Busque por ${label.toLowerCase()} cadastrado no sistema:`}
        confirmLabel="Selecionar"
        onChange={onChange}
      />
      {value && (
        <>
          <FloatInput label={codeLabel} value={codigo} required={required} disabled />
          <button
            type="button"
            title={`Visualizar ${label}`}
            onClick={() => window.alert(`${value.nome}\n${codigo}`)}
            className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50"
          >
            <Eye size={20} />
          </button>
        </>
      )}
    </div>
  );
}

function LocalDentroEstado({
  local,
  especieId,
  finalidade,
  onChange,
  disabled,
  isDestino,
}: {
  local: LocalGta | DestinoGta;
  especieId?: number;
  finalidade?: string;
  onChange: (local: any) => void;
  disabled: boolean;
  isDestino?: boolean;
}) {
  const update = (patch: Partial<LocalGta | DestinoGta>) =>
    onChange({ ...local, ...patch });
  const exploracoes = EXPLORACOES_GTA.filter(
    (item) =>
      (!especieId || item.especieId === especieId) &&
      (!local.responsavel || item.responsavelId === local.responsavel.id) &&
      (!local.estabelecimento ||
        item.estabelecimentoId === local.estabelecimento.id),
  );
  const nucleos = NUCLEOS_GTA.filter(
    (item) => !local.exploracao || item.exploracaoId === local.exploracao.id,
  );

  return (
    <div className="flex flex-col gap-5">
      <EntityPicker
        label={isDestino ? "Responsável de Destino" : "Responsável de Procedência"}
        value={local.responsavel}
        data={PESSOAS_GTA}
        codeLabel="CPF/CNPJ"
        codeKey="documento"
        required
        disabled={disabled}
        onChange={(responsavel) =>
          update({
            responsavel,
            estabelecimento: null,
            exploracao: null,
            nucleo: null,
          })
        }
      />

      {local.tipo === "Estabelecimento Agropecuário" && (
        <>
          <EntityPicker
            label="Estabelecimento Agropecuário"
            value={local.estabelecimento}
            data={ESTABELECIMENTOS_GTA}
            codeLabel="Código do Estabelecimento"
            required
            disabled={disabled || !local.responsavel}
            onChange={(estabelecimento) =>
              update({ estabelecimento, exploracao: null, nucleo: null })
            }
          />
          <EntityPicker
            label="Exploração Pecuária"
            value={local.exploracao}
            data={exploracoes}
            codeLabel="Código da Exploração"
            required
            disabled={disabled || !local.estabelecimento}
            onChange={(exploracao) => update({ exploracao, nucleo: null })}
          />
          {NUCLEOS_GTA.some(
            (nucleo) => nucleo.exploracaoId === local.exploracao?.id,
          ) && (
            <EntityPicker
              label="Núcleo de Produção"
              value={local.nucleo}
              data={nucleos}
              codeLabel="Código do Núcleo"
              required
              disabled={disabled || !local.exploracao}
              onChange={(nucleo) => update({ nucleo })}
            />
          )}
        </>
      )}

      {local.tipo === "Frigorífico" && (
        <>
          <EntityPicker
            label="Frigorífico"
            value={local.frigorifico}
            data={FRIGORIFICOS_GTA}
            codeLabel="Código do Frigorífico"
            required
            disabled={disabled}
            onChange={(frigorifico) => update({ frigorifico })}
          />
          {isDestino && finalidade === "Abate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatSelect
                label="Abate Terceirizado?"
                required
                value={(local as DestinoGta).abateTerceirizado}
                onChange={(abateTerceirizado) =>
                  update({
                    abateTerceirizado:
                      abateTerceirizado as DestinoGta["abateTerceirizado"],
                    empresaAbate:
                      abateTerceirizado === "Sim"
                        ? (local as DestinoGta).empresaAbate
                        : null,
                  })
                }
                disabled={disabled}
                options={[
                  { value: "Sim", label: "Sim" },
                  { value: "Não", label: "Não" },
                ]}
              />
              {(local as DestinoGta).abateTerceirizado === "Sim" && (
                <EntityPicker
                  label="Empresa que contratou o abate"
                  value={(local as DestinoGta).empresaAbate}
                  data={ACOUGUES_GTA}
                  required
                  disabled={disabled}
                  onChange={(empresaAbate) => update({ empresaAbate })}
                />
              )}
            </div>
          )}
        </>
      )}

      {local.tipo === "Evento Pecuário" && (
        <EntityPicker
          label="Evento Pecuário"
          value={local.evento}
          data={EVENTOS_GTA}
          required
          disabled={disabled}
          onChange={(evento) => update({ evento })}
        />
      )}
      {local.tipo === "Revendedora de Animais Vivos" && (
        <EntityPicker
          label="Revendedora de Animais Vivos"
          value={local.revendedora}
          data={REVENDEDORAS_ANIMAIS_GTA}
          required
          disabled={disabled}
          onChange={(revendedora) => update({ revendedora })}
        />
      )}
      {local.tipo === "Aeroporto" && (
        <EntityPicker
          label="Aeroporto"
          value={local.aeroporto}
          data={AEROPORTOS_GTA}
          required
          disabled={disabled}
          onChange={(aeroporto) => update({ aeroporto })}
        />
      )}
    </div>
  );
}

function StatusEntidade({ local }: { local: LocalGta }) {
  const entidade =
    local.nucleo ??
    local.exploracao ??
    local.estabelecimento ??
    local.frigorifico ??
    local.evento ??
    local.revendedora ??
    local.aeroporto;
  if (!entidade) return null;
  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Situação da Entidade
      </h3>
      <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatInput label="Estado" value="Regular" disabled required />
        <FloatInput label="Data de Início" value="01/01/2026" disabled required />
        <FloatInput label="Data de Validade" value="01/08/2027" disabled required />
        <FloatInput
          label="Status"
          value="S13 - Entidade habilitada para trânsito"
          disabled
          required
        />
        <div className="md:col-span-2">
          <LargeTextArea
            label="Observação"
            value="Situação sanitária verificada no cadastro da entidade."
            onChange={() => {}}
            disabled
            required
          />
        </div>
      </div>
    </div>
  );
}

function DadosComplementaresProcedencia({
  value,
}: {
  value: EmissaoGtaFormValue;
}) {
  const nucleo = value.procedencia.nucleo;
  const exploracao = value.procedencia.exploracao;
  if (!nucleo && !exploracao) return null;
  return (
    <>
      {nucleo && (
        <Section title="Característica do Núcleo de Produção" defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FloatInput
              label={
                value.especie?.grupo === "Suídeos"
                  ? "Tipo de Produção"
                  : "Característica"
              }
              value={nucleo.caracteristica}
              disabled
              required
            />
            <FloatInput
              label="Área de Atuação"
              value={nucleo.areaAtuacao}
              disabled
              required
            />
            <FloatInput
              label="Classificação"
              value={nucleo.classificacao}
              disabled
              required
            />
          </div>
        </Section>
      )}
      <Section
        title={
          nucleo
            ? "Certificados do Núcleo de Produção"
            : "Certificados da Exploração Pecuária"
        }
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FloatInput label="Tipo" value="Sanitário" disabled required />
          <FloatInput label="Número" value="0212024" disabled required />
          <FloatInput label="Validade" value="25/03/2027" disabled required />
        </div>
      </Section>
    </>
  );
}

function DestinoForaEstado({
  destino,
  onChange,
  disabled,
}: {
  destino: DestinoGta;
  onChange: (destino: DestinoGta) => void;
  disabled: boolean;
}) {
  const update = (patch: Partial<DestinoGta>) =>
    onChange({ ...destino, ...patch });
  const municipios = MUNICIPIOS_POR_ESTADO[destino.estado] ?? [];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FloatSelect
          label="Estado de Destino"
          required
          value={destino.estado}
          onChange={(estado) => update({ estado, municipio: "" })}
          disabled={disabled}
          options={ESTADOS_BRASIL.map((estado) => ({
            value: estado,
            label: estado,
          }))}
        />
        <FloatSelect
          label="Município"
          required
          value={destino.municipio}
          onChange={(municipio) => update({ municipio })}
          disabled={disabled || !destino.estado}
          options={municipios.map((municipio) => ({
            value: municipio,
            label: municipio,
          }))}
        />
        <FloatInput
          label="Responsável de Destino"
          required
          value={destino.responsavelExterno}
          maxLength={255}
          onChange={(responsavelExterno) => update({ responsavelExterno })}
          disabled={disabled}
        />
        <FloatInput
          label="CPF/CNPJ do Responsável de Destino"
          required
          value={destino.documentoResponsavelExterno}
          maxLength={14}
          onChange={(documentoResponsavelExterno) =>
            update({
              documentoResponsavelExterno:
                documentoResponsavelExterno.replace(/\D/g, "").slice(0, 14),
            })
          }
          disabled={disabled}
        />
        <FloatInput
          label="Cd. Local"
          required
          value={destino.codigoLocal}
          maxLength={20}
          onChange={(codigoLocal) => update({ codigoLocal })}
          disabled={disabled}
        />
      </div>

      {destino.tipo === "Estabelecimento Agropecuário" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput
            label="Estabelecimento Agropecuário de Destino"
            required
            value={destino.estabelecimentoExterno}
            maxLength={100}
            onChange={(estabelecimentoExterno) =>
              update({ estabelecimentoExterno })
            }
            disabled={disabled}
          />
          <FloatInput
            label="Código do Estabelecimento Agropecuário"
            required
            value={destino.codigoEstabelecimentoExterno}
            maxLength={11}
            onChange={(codigoEstabelecimentoExterno) =>
              update({ codigoEstabelecimentoExterno })
            }
            disabled={disabled}
          />
          <FloatInput
            label="Código da Exploração Pecuária"
            required
            value={destino.codigoExploracaoExterna}
            maxLength={15}
            onChange={(codigoExploracaoExterna) =>
              update({ codigoExploracaoExterna })
            }
            disabled={disabled}
          />
          <FloatInput
            label="Núcleo de Produção"
            required
            value={destino.nucleoExterno}
            maxLength={255}
            onChange={(nucleoExterno) => update({ nucleoExterno })}
            disabled={disabled}
          />
          <FloatInput
            label="Código do Núcleo de Produção"
            required
            value={destino.codigoNucleoExterno}
            maxLength={17}
            onChange={(codigoNucleoExterno) =>
              update({ codigoNucleoExterno })
            }
            disabled={disabled}
          />
        </div>
      )}
      {destino.tipo === "Frigorífico" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput
            label="Nome do Frigorífico"
            required
            value={destino.frigorificoExterno}
            maxLength={255}
            onChange={(frigorificoExterno) => update({ frigorificoExterno })}
            disabled={disabled}
          />
          <FloatInput
            label="Código do Frigorífico"
            required
            value={destino.codigoFrigorificoExterno}
            maxLength={11}
            onChange={(codigoFrigorificoExterno) =>
              update({ codigoFrigorificoExterno })
            }
            disabled={disabled}
          />
        </div>
      )}
      {destino.tipo === "Evento Pecuário" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput
            label="Evento Pecuário"
            required
            value={destino.eventoExterno}
            maxLength={255}
            onChange={(eventoExterno) => update({ eventoExterno })}
            disabled={disabled}
          />
          <FloatInput
            label="Estabelecimento do Evento Pecuário"
            required
            value={destino.estabelecimentoEventoExterno}
            maxLength={255}
            onChange={(estabelecimentoEventoExterno) =>
              update({ estabelecimentoEventoExterno })
            }
            disabled={disabled}
          />
        </div>
      )}
      {destino.tipo === "Revendedora de Animais Vivos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatInput
            label="Revendedora de Animais Vivos"
            required
            value={destino.revendedoraExterna}
            maxLength={255}
            onChange={(revendedoraExterna) => update({ revendedoraExterna })}
            disabled={disabled}
          />
          <FloatInput
            label="Código da Revendedora de Animais Vivos"
            required
            value={destino.codigoRevendedoraExterna}
            maxLength={11}
            onChange={(codigoRevendedoraExterna) =>
              update({ codigoRevendedoraExterna })
            }
            disabled={disabled}
          />
        </div>
      )}
      {destino.tipo === "Aeroporto" && (
        <FloatInput
          label="Aeroporto"
          required
          value={destino.aeroportoExterno}
          maxLength={255}
          onChange={(aeroportoExterno) => update({ aeroportoExterno })}
          disabled={disabled}
        />
      )}
    </div>
  );
}

function AnimalsReadOnlyTable({ value }: { value: EmissaoGtaFormValue }) {
  const totalExistente = value.faixasAnimais.reduce(
    (total, item) => total + item.existente,
    0,
  );

  return (
    <div className="overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 px-7 py-6">
        <h3 className="text-sm font-semibold text-gray-700">Registro</h3>
        <span className="h-1 w-1 rounded-full bg-gray-600" aria-hidden="true" />
        <p className="text-xs text-gray-500">
          Registre quantos animais serão transportados
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50/80 text-[10px] text-slate-500">
              <th className="w-[22%] border-r border-gray-200 px-4 py-2 text-center font-bold uppercase tracking-wide">
                Faixa Etária
              </th>
              <th className="w-[39%] border-r border-gray-200 px-4 py-2 text-center font-semibold">
                Existente
              </th>
              <th className="w-[39%] px-4 py-2 text-center font-semibold">
                Animais na GTA
              </th>
            </tr>
          </thead>
          <tbody>
            {value.faixasAnimais.map((faixa) => (
              <tr
                key={faixa.id}
                className="h-[50px] border-b border-gray-200 text-gray-600"
              >
                <th className="border-r border-gray-200 px-4 text-center text-xs font-semibold text-slate-700">
                  {faixa.faixaEtaria}
                </th>
                <td className="border-r border-gray-200 px-4 text-center">
                  {faixa.existente}
                </td>
                <td className="px-4 text-center">{faixa.animaisGta}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="h-[50px] bg-gray-50/80 text-gray-600">
              <th className="px-4 text-center text-xs font-bold uppercase text-slate-700">
                Total
              </th>
              <td className="px-4 text-center">{totalExistente}</td>
              <td className="px-4 text-center">{totalAnimaisGta(value)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function EmissaoGtaForm({
  value,
  onChange,
  mode = "create",
  showBasicSection = true,
}: {
  value: EmissaoGtaFormValue;
  onChange?: (value: EmissaoGtaFormValue) => void;
  mode?: FormMode;
  showBasicSection?: boolean;
}) {
  const disabled = mode === "view";
  const update = <K extends keyof EmissaoGtaFormValue>(
    campo: K,
    valor: EmissaoGtaFormValue[K],
  ) => onChange?.({ ...value, [campo]: valor });
  const updateProcedencia = (procedencia: LocalGta) =>
    update("procedencia", procedencia);
  const updateDestino = (destino: DestinoGta) => update("destino", destino);
  const especieGrandesAnimais = ["Bovídeos", "Equídeos"].includes(
    value.especie?.grupo ?? "",
  );
  const origemPreenchida = Boolean(
    value.procedencia.exploracao ||
      value.procedencia.nucleo ||
      value.procedencia.frigorifico ||
      value.procedencia.evento ||
      value.procedencia.revendedora ||
      value.procedencia.aeroporto,
  );

  const gruposAnimais = useMemo(() => {
    return value.faixasAnimais.reduce<Record<string, typeof value.faixasAnimais>>(
      (grupos, item) => {
        grupos[item.sexo] = [...(grupos[item.sexo] ?? []), item];
        return grupos;
      },
      {},
    );
  }, [value.faixasAnimais]);

  const alterarFaixa = (id: string, animaisGta: number) =>
    update(
      "faixasAnimais",
      value.faixasAnimais.map((item) =>
        item.id === id
          ? { ...item, animaisGta: Math.min(item.existente, animaisGta) }
          : item,
      ),
    );

  return (
    <div className="flex flex-col gap-4">
      {showBasicSection && (
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect
              label="Tipo de Formulário"
              required
              value={value.tipoFormulario}
              onChange={(tipoFormulario) =>
                update("tipoFormulario", tipoFormulario as TipoFormularioGta)
              }
              options={TIPOS_FORMULARIO_GTA}
              disabled={disabled}
            />
            <EntityPicker
              label="Espécie"
              value={value.especie}
              data={ESPECIES_GTA}
              required
              disabled={disabled}
              onChange={(especie) =>
                onChange?.({
                  ...value,
                  especie,
                  faixasAnimais: criarFaixasAnimais(especie),
                  procedencia: criarLocalVazio(),
                  destino: criarDestinoVazio(),
                  gtasRastreio:
                    especie.grupo === "Aves" &&
                    value.finalidade?.nome === "Abate"
                      ? value.gtasRastreio
                      : [],
                })
              }
            />
            <div className="md:col-span-2">
              <EntityPicker
                label="Finalidade de GTA"
                value={value.finalidade}
                data={FINALIDADES_GTA}
                required
                disabled={disabled}
                onChange={(finalidade) =>
                  onChange?.({
                    ...value,
                    finalidade,
                    destino: {
                      ...value.destino,
                      abateTerceirizado: "",
                      empresaAbate: null,
                    },
                    gtasRastreio:
                      finalidade.nome === "Abate" ? value.gtasRastreio : [],
                  })
                }
              />
            </div>
          </div>
        </Section>
      )}

      <Section title="Informações da Procedência">
        <div className="flex flex-col gap-5">
          <FloatSelect
            label="Tipo de Procedência"
            required
            value={value.procedencia.tipo}
            onChange={(tipo) =>
              updateProcedencia({
                ...criarLocalVazio(),
                tipo: tipo as TipoLocalGta,
              })
            }
            options={TIPOS_LOCAL_OPTIONS}
            disabled={disabled}
          />
          {value.procedencia.tipo && (
            <LocalDentroEstado
              local={value.procedencia}
              especieId={value.especie?.id}
              onChange={updateProcedencia}
              disabled={disabled}
            />
          )}
          <StatusEntidade local={value.procedencia} />
        </div>
      </Section>

      <DadosComplementaresProcedencia value={value} />

      <Section title="Informações de Destino">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect
              label="Tipo de Destino"
              required
              value={value.destino.tipo}
              onChange={(tipo) =>
                updateDestino({
                  ...criarDestinoVazio(),
                  tipo: tipo as TipoLocalGta,
                  dentroEstado: value.destino.dentroEstado,
                })
              }
              options={TIPOS_LOCAL_OPTIONS}
              disabled={disabled}
            />
            <FloatSelect
              label="Destino dentro do Estado?"
              required
              value={value.destino.dentroEstado}
              onChange={(dentroEstado) =>
                updateDestino({
                  ...criarDestinoVazio(),
                  tipo: value.destino.tipo,
                  dentroEstado: dentroEstado as "Sim" | "Não",
                })
              }
              options={[
                { value: "Sim", label: "Sim" },
                { value: "Não", label: "Não" },
              ]}
              disabled={disabled}
            />
          </div>
          {value.destino.tipo && value.destino.dentroEstado === "Sim" && (
            <LocalDentroEstado
              local={value.destino}
              especieId={value.especie?.id}
              finalidade={value.finalidade?.nome}
              onChange={updateDestino}
              disabled={disabled}
              isDestino
            />
          )}
          {value.destino.tipo && value.destino.dentroEstado === "Não" && (
            <DestinoForaEstado
              destino={value.destino}
              onChange={updateDestino}
              disabled={disabled}
            />
          )}
        </div>
      </Section>

      <Section title="Informações do Trânsito">
        <div className="flex flex-col gap-5">
          {disabled ? (
            <FloatInput
              label="Meio de Transporte"
              value={value.meiosTransporte.join(", ")}
              disabled
              required
            />
          ) : (
            <FloatMultiSelect
              label="Meio de Transporte *"
              value={value.meiosTransporte}
              onChange={(meios) => {
                onChange?.({
                  ...value,
                  meiosTransporte: meios,
                  placaVeiculo: meios.includes("Rodoviário")
                    ? value.placaVeiculo
                    : "",
                });
              }}
              options={MEIOS_TRANSPORTE}
            />
          )}
          {value.meiosTransporte.includes("Rodoviário") && (
            <FloatInput
              label="Placa do Veículo"
              value={value.placaVeiculo}
              maxLength={7}
              onChange={(placaVeiculo) =>
                update(
                  "placaVeiculo",
                  placaVeiculo
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .slice(0, 7),
                )
              }
              disabled={disabled}
            />
          )}
          {especieGrandesAnimais ? (
            <FloatInput
              label="Informações de Localização do Local de Parada"
              value="Não"
              disabled
            />
          ) : (
            <FloatSelect
              label="Possui Parada para Descanso?"
              required
              value={value.possuiParadaDescanso}
              onChange={(possuiParadaDescanso) =>
                update(
                  "possuiParadaDescanso",
                  possuiParadaDescanso as "Sim" | "Não",
                )
              }
              disabled={disabled}
              options={[
                { value: "Sim", label: "Sim" },
                { value: "Não", label: "Não" },
              ]}
            />
          )}
          {!especieGrandesAnimais &&
            value.possuiParadaDescanso === "Sim" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <FloatInput
                  label="Local da Parada"
                  value="Ponto de descanso informado"
                  disabled
                />
                <FloatInput
                  label="Geolocalização"
                  value="-21.2457, -45.0012"
                  disabled
                />
              </div>
            )}
        </div>
      </Section>

      <Section title="Informações dos Animais">
        {!value.especie ? (
          <p className="text-sm text-gray-500">
            Selecione uma espécie para carregar as faixas etárias.
          </p>
        ) : disabled ? (
          <AnimalsReadOnlyTable value={value} />
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(gruposAnimais).map(([sexo, faixas]) => (
              <div key={sexo}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {sexo}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase">
                          Faixa Etária
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase">
                          Existente
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600 uppercase">
                          Animais na GTA
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {faixas.map((faixa) => (
                        <tr key={faixa.id} className="border-b border-gray-100">
                          <td className="px-3 py-3 text-gray-700">
                            {faixa.faixaEtaria}
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            {faixa.existente}
                          </td>
                          <td className="px-3 py-3 w-56">
                            <FloatInput
                              label="Animais na GTA"
                              value={String(faixa.animaisGta)}
                              onChange={(valor) =>
                                alterarFaixa(
                                  faixa.id,
                                  Number(valor.replace(/\D/g, "")) || 0,
                                )
                              }
                              disabled={disabled}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <FloatInput
                label="Total Existente"
                value={String(
                  value.faixasAnimais.reduce(
                    (total, item) => total + item.existente,
                    0,
                  ),
                )}
                disabled
              />
              <FloatInput
                label="Total de Animais na GTA"
                value={String(totalAnimaisGta(value))}
                disabled
              />
            </div>
          </div>
        )}
      </Section>

      <Section title="Informações da GTA">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <EntityPicker
            label="Motivo de Isenção de Taxa"
            value={value.motivoIsencaoTaxa}
            data={ISENCOES_TAXA_GTA}
            disabled={disabled}
            onChange={(motivoIsencaoTaxa) =>
              update("motivoIsencaoTaxa", motivoIsencaoTaxa)
            }
          />
          <FloatInput
            label="Valor da GTA"
            value={formatarMoedaGta(value.motivoIsencaoTaxa ? 0 : value.valorGta)}
            disabled
            required
          />
        </div>
      </Section>

      {origemPreenchida && (
        <Section title="Vacinas">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Vacinas do Serviço Oficial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatInput
                  label="Data da Vacinação da 1ª Etapa de Raiva de Herbívoros"
                  value={formatarDataGta(value.dataRaivaPrimeiraEtapa)}
                  disabled
                  required
                />
                <FloatInput
                  label="Data da Vacinação da 2ª Etapa de Raiva de Herbívoros"
                  value={formatarDataGta(value.dataRaivaSegundaEtapa)}
                  disabled
                  required
                />
                {value.especie?.grupo === "Bovídeos" && (
                  <FloatInput
                    label="Data da Vacinação de Brucelose"
                    value={formatarDataGta(value.dataBrucelose)}
                    disabled
                    required
                  />
                )}
                <EntityPicker
                  label="Motivo de Isenção de Vacinação"
                  value={value.motivoIsencaoVacinacao}
                  data={ISENCOES_VACINACAO_GTA}
                  disabled={disabled}
                  onChange={(motivo) =>
                    update("motivoIsencaoVacinacao", motivo)
                  }
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Outras Vacinas
              </h3>
              <DynamicListWrapper
                items={value.outrasVacinas}
                behavior="zero-or-more"
                itemLabel="Vacina"
                addButtonLabel="Adicionar Vacina"
                disabled={disabled}
                onAddItem={() =>
                  update("outrasVacinas", [
                    ...value.outrasVacinas,
                    {
                      id: uid(),
                      vacina: null,
                      dataVacinacao: "",
                      atestado: "",
                    },
                  ])
                }
                onRemoveItem={(index) =>
                  update(
                    "outrasVacinas",
                    value.outrasVacinas.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                {(item, index) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <EntityPicker
                      label="Vacina"
                      value={item.vacina}
                      data={DOENCAS_VACINA_GTA}
                      required
                      disabled={disabled}
                      onChange={(vacina) =>
                        update(
                          "outrasVacinas",
                          value.outrasVacinas.map((vacinaItem, itemIndex) =>
                            itemIndex === index
                              ? { ...vacinaItem, vacina }
                              : vacinaItem,
                          ),
                        )
                      }
                    />
                    <FloatInput
                      label="Data da Vacinação"
                      type="date"
                      required
                      value={item.dataVacinacao}
                      onChange={(dataVacinacao) =>
                        update(
                          "outrasVacinas",
                          value.outrasVacinas.map((vacinaItem, itemIndex) =>
                            itemIndex === index
                              ? { ...vacinaItem, dataVacinacao }
                              : vacinaItem,
                          ),
                        )
                      }
                      disabled={disabled}
                    />
                    <UploadField
                      label="Atestado de Vacinação"
                      required
                      fileName={item.atestado}
                      disabled={disabled}
                      onSelectFile={() =>
                        update(
                          "outrasVacinas",
                          value.outrasVacinas.map((vacinaItem, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...vacinaItem,
                                  atestado: `atestado_vacinacao_${index + 1}.pdf`,
                                }
                              : vacinaItem,
                          ),
                        )
                      }
                    />
                  </div>
                )}
              </DynamicListWrapper>
            </div>
          </div>
        </Section>
      )}

      <Section title="Atestados">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Atestado Sanitário
            </h3>
            <UploadField
              label="Atestado Sanitário"
              required
              fileName={value.atestadoSanitario}
              disabled={disabled}
              onSelectFile={() =>
                update("atestadoSanitario", "atestado_sanitario.pdf")
              }
            />
          </div>
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Atestados de Exames
            </h3>
            <DynamicListWrapper
              items={value.atestadosExame}
              behavior="zero-or-more"
              itemLabel="Atestado de Exame"
              addButtonLabel="Adicionar Atestado"
              disabled={disabled}
              onAddItem={() =>
                update("atestadosExame", [
                  ...value.atestadosExame,
                  { id: uid(), tipo: null, arquivo: "" },
                ])
              }
              onRemoveItem={(index) =>
                update(
                  "atestadosExame",
                  value.atestadosExame.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              {(item, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <EntityPicker
                    label="Tipo de Atestado de Exame"
                    value={item.tipo}
                    data={TIPOS_ATESTADO_EXAME_GTA}
                    required
                    disabled={disabled}
                    onChange={(tipo) =>
                      update(
                        "atestadosExame",
                        value.atestadosExame.map((atestado, itemIndex) =>
                          itemIndex === index ? { ...atestado, tipo } : atestado,
                        ),
                      )
                    }
                  />
                  <UploadField
                    label="Atestado de Exame"
                    required
                    fileName={item.arquivo}
                    disabled={disabled}
                    onSelectFile={() =>
                      update(
                        "atestadosExame",
                        value.atestadosExame.map((atestado, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...atestado,
                                arquivo: `atestado_exame_${index + 1}.pdf`,
                              }
                            : atestado,
                        ),
                      )
                    }
                  />
                </div>
              )}
            </DynamicListWrapper>
          </div>
        </div>
      </Section>

      <Section title="Observações">
        <div className="flex flex-col gap-6">
          {value.especie?.grupo === "Aves" && value.procedencia.nucleo && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Registro da Granja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatInput
                  label="Número de Registro no MAPA"
                  value={value.procedencia.nucleo.registroMapa ?? ""}
                  disabled
                  required
                />
                <FloatInput
                  label="Número de Registro no IMA"
                  value={value.procedencia.nucleo.registroIma ?? ""}
                  disabled
                  required
                />
                <FloatInput
                  label="Data de Validade"
                  value={formatarDataGta(
                    value.procedencia.nucleo.validadeRegistro ?? "",
                  )}
                  disabled
                  required
                />
                <UploadField
                  label="Arquivo"
                  fileName={value.procedencia.nucleo.arquivoRegistro ?? ""}
                  onSelectFile={() => {}}
                  disabled
                  required
                />
              </div>
            </div>
          )}

          {value.finalidade?.nome === "Abate" &&
            value.especie?.grupo === "Aves" && (
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                GTAs de Rastreio
              </h3>
              <DynamicListWrapper
                items={value.gtasRastreio}
                behavior="zero-or-more"
                itemLabel="GTA de Rastreio"
                addButtonLabel="Adicionar GTA de Rastreio"
                disabled={disabled}
                onAddItem={() =>
                  update("gtasRastreio", [
                    ...value.gtasRastreio,
                    { id: uid(), uf: "", serieNumero: "" },
                  ])
                }
                onRemoveItem={(index) =>
                  update(
                    "gtasRastreio",
                    value.gtasRastreio.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                {(item, index) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatSelect
                      label="UF da GTA"
                      required
                      value={item.uf}
                      onChange={(uf) =>
                        update(
                          "gtasRastreio",
                          value.gtasRastreio.map((gta, itemIndex) =>
                            itemIndex === index ? { ...gta, uf } : gta,
                          ),
                        )
                      }
                      options={ESTADOS_BRASIL.map((estado) => ({
                        value: estado,
                        label: estado,
                      }))}
                      disabled={disabled}
                    />
                    <FloatInput
                      label="Série - Número da GTA"
                      value={item.serieNumero}
                      maxLength={11}
                      onChange={(serieNumero) =>
                        update(
                          "gtasRastreio",
                          value.gtasRastreio.map((gta, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...gta,
                                  serieNumero: serieNumero.toUpperCase().slice(0, 11),
                                }
                              : gta,
                          ),
                        )
                      }
                      disabled={disabled}
                    />
                  </div>
                )}
              </DynamicListWrapper>
            </div>
          )}

          <LargeTextArea
            label="Observações"
            required
            value={value.observacoes}
            onChange={(observacoes) => update("observacoes", observacoes)}
            disabled={disabled}
            maxLength={1500}
          />
        </div>
      </Section>
    </div>
  );
}

function localPreenchido(local: LocalGta) {
  if (!local.tipo || !local.responsavel) return false;
  if (local.tipo === "Estabelecimento Agropecuário") {
    if (!local.estabelecimento || !local.exploracao) return false;
    const exigeNucleo = NUCLEOS_GTA.some(
      (nucleo) => nucleo.exploracaoId === local.exploracao?.id,
    );
    return !exigeNucleo || Boolean(local.nucleo);
  }
  if (local.tipo === "Frigorífico") return Boolean(local.frigorifico);
  if (local.tipo === "Evento Pecuário") return Boolean(local.evento);
  if (local.tipo === "Revendedora de Animais Vivos")
    return Boolean(local.revendedora);
  return Boolean(local.aeroporto);
}

function destinoPreenchido(destino: DestinoGta, finalidade?: string) {
  if (!destino.tipo) return false;
  if (destino.dentroEstado === "Sim") {
    if (!localPreenchido(destino)) return false;
    if (
      destino.tipo === "Frigorífico" &&
      finalidade === "Abate" &&
      (!destino.abateTerceirizado ||
        (destino.abateTerceirizado === "Sim" && !destino.empresaAbate))
    )
      return false;
    return true;
  }
  if (
    !destino.estado ||
    !destino.municipio ||
    !destino.responsavelExterno ||
    ![11, 14].includes(destino.documentoResponsavelExterno.length) ||
    !destino.codigoLocal
  )
    return false;
  if (destino.tipo === "Estabelecimento Agropecuário")
    return Boolean(
      destino.estabelecimentoExterno &&
        destino.codigoEstabelecimentoExterno &&
        destino.codigoExploracaoExterna &&
        destino.nucleoExterno &&
        destino.codigoNucleoExterno,
    );
  if (destino.tipo === "Frigorífico")
    return Boolean(destino.frigorificoExterno && destino.codigoFrigorificoExterno);
  if (destino.tipo === "Evento Pecuário")
    return Boolean(destino.eventoExterno && destino.estabelecimentoEventoExterno);
  if (destino.tipo === "Revendedora de Animais Vivos")
    return Boolean(destino.revendedoraExterna && destino.codigoRevendedoraExterna);
  return Boolean(destino.aeroportoExterno);
}

export function emissaoGtaValida(value: EmissaoGtaFormValue) {
  if (
    !value.tipoFormulario ||
    !value.especie ||
    !value.finalidade ||
    !localPreenchido(value.procedencia) ||
    !destinoPreenchido(value.destino, value.finalidade.nome) ||
    value.meiosTransporte.length === 0 ||
    !value.atestadoSanitario ||
    !value.observacoes.trim()
  )
    return false;
  if (
    value.meiosTransporte.includes("Rodoviário") &&
    value.placaVeiculo &&
    !/^[A-Z]{3}\d(?:[A-Z]\d{2}|\d{3})$/.test(value.placaVeiculo)
  )
    return false;
  const hoje = new Date().toISOString().slice(0, 10);
  if (
    value.outrasVacinas.some(
      (item) =>
        !item.vacina ||
        !item.dataVacinacao ||
        item.dataVacinacao > hoje ||
        !item.atestado,
    )
  )
    return false;
  if (value.atestadosExame.some((item) => !item.tipo || !item.arquivo))
    return false;
  return !value.gtasRastreio.some(
    (item) =>
      !item.uf ||
      (item.serieNumero &&
        !/^[A-Z]{2}\s-\s\d{6}$/.test(item.serieNumero)),
  );
}
