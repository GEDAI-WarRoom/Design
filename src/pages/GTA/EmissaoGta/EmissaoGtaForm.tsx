import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Search,
  CheckCircle2,
  Dna,
  Truck,
  AlertTriangle,
  Calendar,
  Building2,
  Store,
  Minus,
  Plus,
  Ham,
  Map,
  Syringe,
  RotateCcw,
} from "lucide-react";
import * as Icons from "../../../imports/icons";
import {
  EntitySearchInput,
  DynamicListWrapper,
  BlocoEnderecoFields,

} from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  SimNao,
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
  getInterdicaoGta,
  ISENCOES_TAXA_GTA,
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

function QuantityStepper({
  value,
  onChange,
  disabled,
  colorClass,
  label,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  colorClass: string;
  label: string;
  max?: number;
}) {
  if (disabled) {
    return <span className={`font-semibold ${colorClass}`}>{value}</span>;
  }
  const limite = max ?? 999999;
  const update = (next: number) => onChange(Math.max(0, Math.min(limite, next)));
  return (
    <div className="mx-auto flex h-9 w-[120px] items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => update(value - 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Diminuir ${label}`}
      >
        <Minus size={14} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = e.target.value.replace(/\D/g, "").slice(0, 6);
          update(n ? Number(n) : 0);
        }}
        aria-label={label}
        className={`h-full min-w-0 flex-1 bg-white text-center text-sm font-semibold outline-none ${colorClass}`}
      />
      <button
        type="button"
        onClick={() => update(value + 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Aumentar ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function normalizarOpcaoMultiSelect(opcao: string | { value: string; label: string }) {
  return typeof opcao === "string" ? { value: opcao, label: opcao } : opcao;
}

function GeolocalizacaoParada({
  latitude,
  longitude,
  onChange,
  disabled,
}: {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
  disabled?: boolean;
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const possuiCoordenadas = Boolean(latitude && longitude);

  if (disabled) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatInput label="Latitude" value={latitude} disabled />
        <FloatInput label="Longitude" value={longitude} disabled />
      </div>
    );
  }

  return (
    <div className="w-full">
      {!possuiCoordenadas ? (
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm cursor-pointer"
        >
          <Map size={16} /> Adicionar Coordenadas
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end animate-fade-in">
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition cursor-pointer"
            >
              <Map size={18} />
            </button>
          </div>
          <div className="md:col-span-5">
            <FloatInput label="Latitude" value={latitude} disabled />
          </div>
          <div className="md:col-span-5">
            <FloatInput label="Longitude" value={longitude} disabled />
          </div>
        </div>
      )}

      {modalAberto && (
        <MapModal
          onClose={() => setModalAberto(false)}
          onConfirm={(lat, lng) => {
            onChange(lat, lng);
            setModalAberto(false);
          }}
          initialLat={latitude}
          initialLng={longitude}
        />
      )}
    </div>
  );
}

function LocalParadaGeolocalizacao({
  especieGrandesAnimais,
  possuiParadaDescanso,
  onChangePossuiParada,
  endereco,
  onChangeEndereco,
  onSetMultipleFieldsEndereco,
  latitude,
  longitude,
  onChangeGeolocalizacao,
  disabled,
}: {
  especieGrandesAnimais: boolean;
  possuiParadaDescanso: "Sim" | "Não" | "";
  onChangePossuiParada: (valor: "Sim" | "Não") => void;
  endereco: EnderecoState;
  onChangeEndereco: (key: keyof EnderecoState, value: string) => void;
  onSetMultipleFieldsEndereco: (fields: Partial<EnderecoState>) => void;
  latitude: string;
  longitude: string;
  onChangeGeolocalizacao: (lat: string, lng: string) => void;
  disabled?: boolean;
}) {
  if (especieGrandesAnimais) {
    return (
      <BlocoEnderecoFields
        title="Informações de Localização do Local de Parada"
        data={endereco}
        tipoEstado="normal"
        onChange={onChangeEndereco}
        onSetMultipleFields={onSetMultipleFieldsEndereco}
      />
    );
  }

  return (
    <>
      <SimNao
        label="Possui Parada para Descanso?"
        name="possuiParadaDescanso"
        required
        value={possuiParadaDescanso}
        onChange={(v) => onChangePossuiParada((v ? "Sim" : "Não") as "Sim" | "Não")}
        disabled={disabled}
      />
      {possuiParadaDescanso === "Sim" && (
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <GeolocalizacaoParada
            latitude={latitude}
            longitude={longitude}
            onChange={onChangeGeolocalizacao}
            disabled={disabled}
          />
        </div>
      )}
    </>
  );
}

function MeioTransporteSelector({
  label,
  value,
  options,
  onChange,
  required,
  disabled,
}: {
  label: string;
  value: string[];
  options: (string | { value: string; label: string })[];
  onChange: (value: string[]) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  const opcoes = options.map(normalizarOpcaoMultiSelect);

  const alternar = (opcaoValue: string) => {
    if (disabled) return;
    if (value.includes(opcaoValue)) {
      onChange(value.filter((item) => item !== opcaoValue));
    } else {
      onChange([...value, opcaoValue]);
    }
  };

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const selecionado = value.includes(opcao.value);
          return (
            <button
              key={opcao.value}
              type="button"
              disabled={disabled}
              onClick={() => alternar(opcao.value)}
              aria-pressed={selecionado}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${selecionado
                ? "bg-green-50 text-[#1A7A3C]"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${selecionado
                  ? "border-[#1A7A3C] bg-[#1A7A3C] text-white"
                  : "border-gray-300 bg-white"
                  }`}
              >
                {selecionado && <CheckCircle2 size={12} strokeWidth={3} />}
              </span>
              {opcao.label}
            </button>
          );
        })}
      </div>
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
  columns,
  searchKeys,
  icon,
  semComplemento,
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
  columns?: { label: string; key: string }[];
  searchKeys?: string[];
  icon?: ReactNode;
  semComplemento?: boolean;
}) {
  const codigo = value?.[codeKey] ?? "";
  const colunasModal = columns ?? [
    { label, key: "nome" },
    { label: codeLabel, key: codeKey },
  ];
  const chavesBusca = searchKeys ?? ["nome", codeKey];
  if (disabled) {
    return semComplemento ? (
      <FloatInput label={label} value={value?.nome ?? ""} required={required} disabled />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatInput label={label} value={value?.nome ?? ""} required={required} disabled />
        <FloatInput label={codeLabel} value={codigo} required={required} disabled />
      </div>
    );
  }

  return (
    <div
      className={
        value && !semComplemento
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
        searchKeys={chavesBusca}
        columns={colunasModal}
        icon={icon ?? <Search size={18} />}
        title={`Buscar ${label}`}
        subtitle={`Busque por ${label.toLowerCase()} cadastrado no sistema:`}
        confirmLabel="Selecionar"
        onChange={onChange}
      />
      {value && !semComplemento && (
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
  const [interdicao, setInterdicao] = useState<ReturnType<typeof getInterdicaoGta>>(
    () => getInterdicaoGta(local.estabelecimento),
  );
  const [modalInterdicao, setModalInterdicao] = useState(false);
  const exploracoes = EXPLORACOES_GTA.filter(
    (item) =>
      !local.estabelecimento ||
      item.estabelecimentoId === local.estabelecimento.id,
  );
  const nucleos = NUCLEOS_GTA.filter(
    (item) => !local.exploracao || item.exploracaoId === local.exploracao.id,
  );

  const temNucleosDisponiveis =
    local.exploracao &&
    !interdicao &&
    NUCLEOS_GTA.some((nucleo) => nucleo.exploracaoId === local.exploracao?.id);

  return (
    <div className="flex flex-col gap-5">
      <EntityPicker
        label={isDestino ? "Responsável de Destino" : "Responsável de Procedência"}
        value={local.responsavel}
        data={PESSOAS_GTA}
        codeLabel="CPF/CNPJ"
        codeKey="documento"
        icon={<img src={Icons.iconeFornecedorUrl} alt="" className="w-5 h-5 object-contain" />}
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
          {/* Estabelecimento — só após escolher o Responsável */}
          {local.responsavel && (
            <div className="animate-fadeIn">
              {interdicao && (
                <button
                  type="button"
                  onClick={() => setModalInterdicao(true)}
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#F0C27B] bg-[#FDF6E7] px-3 py-1 text-xs font-semibold text-[#9A6B00] hover:bg-[#fbefd3] transition"
                  title="Ver detalhes da interdição"
                >
                  <AlertTriangle size={13} />
                  Estabelecimento Interditado
                </button>
              )}
              <EntityPicker
                label="Estabelecimento Agropecuário"
                value={local.estabelecimento}
                data={ESTABELECIMENTOS_GTA}
                codeLabel="Código do Estabelecimento"
                icon={<img src={Icons.iconeEstabelecimentoUrl} alt="" className="w-5 h-5 object-contain" />}

                searchKeys={["nome", "codigo", "municipio", "proprietarios"]}
                columns={[
                  { label: "Estabelecimento", key: "nome" },
                  { label: "Código", key: "codigo" },
                  { label: "Município", key: "municipio" },
                  { label: "Proprietários", key: "proprietarios" },
                ]}
                required
                disabled={disabled}
                onChange={(estabelecimento) => {
                  const interd = getInterdicaoGta(estabelecimento);
                  setInterdicao(interd);
                  if (interd) setModalInterdicao(true);
                  update({ estabelecimento, exploracao: null, nucleo: null });
                }}
              />
            </div>
          )}

          {/* Exploração e Núcleo — só após escolher o Estabelecimento e se não estiver interditado */}
          {local.estabelecimento && !interdicao && (
            <div className="pt-2 animate-fadeIn flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Campo da Exploração Pecuária (Ocupa a linha toda) */}
                <div className="md:col-span-12">
                  <EntityPicker
                    label="Exploração Pecuária"
                    value={local.exploracao}
                    data={exploracoes}
                    codeLabel="Espécie"
                    icon={<img src={Icons.iconeExploracaoUrl} alt="" className="w-5 h-5 object-contain" />}
                    searchKeys={["codigo", "especie", "produtores"]}
                    columns={[
                      { label: "Código", key: "codigo" },
                      { label: "Espécie", key: "especie" },
                      { label: "Produtores", key: "produtores" },
                    ]}
                    required
                    disabled={disabled}
                    onChange={(exploracao) => update({ exploracao, nucleo: null })}
                  />
                </div>

                {/* Campo do Núcleo de Produção (Fica na linha de baixo) */}
                {temNucleosDisponiveis && (
                  <div className="md:col-span-12 animate-fadeIn">
                    <EntityPicker
                      label="Núcleo de Produção"
                      value={local.nucleo}
                      data={nucleos}
                      codeLabel="Código do Núcleo"
                      icon={<img src={Icons.iconeNucleoProducaoUrl} alt="" className="w-5 h-5 object-contain" />}
                      searchKeys={["nome", "produtores"]}
                      columns={[
                        { label: "Núcleo", key: "nome" },
                        { label: "Produtores", key: "produtores" },
                      ]}
                      required
                      disabled={disabled}
                      onChange={(nucleo) => update({ nucleo })}
                    />
                  </div>
                )}
              </div>
            </div>
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
            icon={<img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="" className="w-5 h-5 object-contain" />}
            required
            disabled={disabled}
            onChange={(frigorifico) => update({ frigorifico })}
          />
          {isDestino && finalidade === "Abate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SimNao
                label="Abate Terceirizado?"
                name="abateTerceirizado"
                required
                value={(local as DestinoGta).abateTerceirizado}
                onChange={(v) => {
                  const abateTerceirizado = v ? "Sim" : "Não";
                  update({
                    abateTerceirizado: abateTerceirizado as DestinoGta["abateTerceirizado"],
                    empresaAbate: v ? (local as DestinoGta).empresaAbate : null,
                  });
                }}
                disabled={disabled}
              />
              {(local as DestinoGta).abateTerceirizado === "Sim" && (
                <EntityPicker
                  label="Empresa que contratou o abate"
                  value={(local as DestinoGta).empresaAbate}
                  data={ACOUGUES_GTA}
                  required
                  disabled={disabled}
                  icon={<Ham size={18} className="text-[#1A7A3C]" />}

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
          icon={<Calendar size={18} className="text-[#1A7A3C]" />}
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
          icon={<Store size={18} className="text-[#1A7A3C]" />}
          required
          disabled={disabled}
          onChange={(revendedora) => update({ revendedora })}
        />
      )}

      {local.tipo === "Estabelecimento Genérico" && (
        <EntityPicker
          label="Estabelecimento Genérico"
          value={local.aeroporto}
          data={AEROPORTOS_GTA}
          required
          disabled={disabled}
          icon={<Building2 size={18} className="text-[#1A7A3C]" />}
          onChange={(aeroporto) => update({ aeroporto })}
        />
      )}

      {/* MODAL DE ESTABELECIMENTO INTERDITADO */}
      {modalInterdicao && interdicao && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-[#FBF0D9] px-6 py-5 flex items-start gap-3">
              <div className="text-[#C8912B] flex-shrink-0 mt-0.5">
                <AlertTriangle size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Cadastro Interditado</p>
                <p className="text-sm text-gray-600 mt-0.5">Cadastro impossibilitado de emitir GTA.</p>
                <p className="text-sm text-gray-600">O registro encontra-se interditado com suas atividades impedidas.</p>
              </div>
            </div>

            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-800">Estado do Cadastro</h4>
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={13} /> Início: {interdicao.inicio}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={13} /> Validade: {interdicao.validade}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Indica a condição específica do cadastro conforme regras ou determinações aplicáveis.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0C27B] bg-[#FBF0D9] px-3 py-1 text-xs font-semibold text-[#9A6B00] self-start whitespace-nowrap">
                    <Info size={13} /> Interditado
                  </span>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Status de Cadastro:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {interdicao.status.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-sm font-semibold text-gray-700">Observação</p>
                    <Info size={13} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{interdicao.observacao}</p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setModalInterdicao(false)}
                  className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
            label="Espécie"
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
      {destino.tipo === "Estabelecimento Genérico" && (
        <FloatInput
          label="Estabelecimento Genérico"
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
  const [endereco, setEndereco] = useState<EnderecoState>({
    zona: "Urbana",
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
  const [latitudeParada, setLatitudeParada] = useState("");
  const [longitudeParada, setLongitudeParada] = useState("");
  const origemPreenchida = Boolean(
    value.procedencia.exploracao ||
    value.procedencia.nucleo ||
    value.procedencia.frigorifico ||
    value.procedencia.evento ||
    value.procedencia.revendedora ||
    value.procedencia.aeroporto,
  );

  const alterarFaixa = (id: string, animaisGta: number) =>
    update(
      "faixasAnimais",
      value.faixasAnimais.map((item) =>
        item.id === id
          ? { ...item, animaisGta: Math.min(item.existente, animaisGta) }
          : item,
      ),
    );

  const sexoMacho = value.faixasAnimais.some((f) => f.sexo === "Machos") ? "Machos" : null;
  const sexoFemea = value.faixasAnimais.some((f) => f.sexo === "Fêmeas") ? "Fêmeas" : null;
  const linhasPorFaixa = useMemo(() => {
    const ordem: string[] = [];
    const mapa: Record<string, { faixaEtaria: string; macho?: any; femea?: any }> = {};
    value.faixasAnimais.forEach((f) => {
      if (!mapa[f.faixaEtaria]) {
        mapa[f.faixaEtaria] = { faixaEtaria: f.faixaEtaria };
        ordem.push(f.faixaEtaria);
      }
      if (f.sexo === "Fêmeas") mapa[f.faixaEtaria].femea = f;
      else mapa[f.faixaEtaria].macho = f;
    });
    return ordem.map((k) => mapa[k]);
  }, [value.faixasAnimais]);

  return (
    <div className="flex flex-col gap-4">
      {showBasicSection && (
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              icon={<Dna size={18} className="text-[#1A7A3C]" />}
              columns={[
                { label: "Espécie", key: "nome" },
                { label: "Grupo de Espécie", key: "grupo" },
              ]}
              searchKeys={["nome", "grupo"]}
              semComplemento
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
            <EntityPicker
              label="Finalidade de Trânsito"
              value={value.finalidade}
              data={FINALIDADES_GTA}
              icon={<Truck size={18} className="text-[#1A7A3C]" />}
              columns={[{ label: "Finalidade de Trânsito", key: "nome" }]}
              searchKeys={["nome"]}
              semComplemento
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
            <SimNao
              label="Destino dentro do Estado?"
              name="dentroEstado"
              required
              value={value.destino.dentroEstado}
              onChange={(v) =>
                updateDestino({
                  ...criarDestinoVazio(),
                  tipo: value.destino.tipo,
                  dentroEstado: (v ? "Sim" : "Não") as "Sim" | "Não",
                })
              }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-3">
              <MeioTransporteSelector
                label="Meio de Transporte"
                value={value.meiosTransporte}
                onChange={(novosMeios) => update("meiosTransporte", novosMeios)}
                options={MEIOS_TRANSPORTE}
                required
                disabled={disabled}
              />
            </div>

            {value.meiosTransporte.includes("Rodoviário") && (
              <div className="md:col-span-1">
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
              </div>
            )}
          </div>


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
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-700">Registro</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    Registre quantos animais serão transportados.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "faixasAnimais",
                      value.faixasAnimais.map((item) => ({ ...item, animaisGta: 0 })),
                    )
                  }
                  className="flex items-center gap-1.5 self-start text-sm font-medium text-[#1A7A3C] transition hover:opacity-75 sm:self-auto"
                >
                  <RotateCcw size={15} /> Reiniciar
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <th rowSpan={2} className="border-b border-r border-gray-200 px-4 py-3 text-left align-middle">
                        Faixa Etária
                      </th>
                      {sexoMacho && (
                        <th colSpan={2} className="border-b border-r border-gray-200 px-4 py-3 text-center font-bold text-blue-600">
                          Machos
                        </th>
                      )}
                      {sexoFemea && (
                        <th colSpan={2} className="border-b border-gray-200 px-4 py-3 text-center font-bold text-pink-600">
                          Fêmeas
                        </th>
                      )}
                    </tr>
                    <tr className="bg-gray-50 text-xs text-gray-500">
                      {sexoMacho && (
                        <>
                          <th className="border-b border-r border-gray-200 px-4 py-2 text-center">Existente</th>
                          <th className="border-b border-r border-gray-200 px-4 py-2 text-center">Animais na GTA</th>
                        </>
                      )}
                      {sexoFemea && (
                        <>
                          <th className="border-b border-r border-gray-200 px-4 py-2 text-center">Existente</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-center">Animais na GTA</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {linhasPorFaixa.map((linha) => (
                      <tr key={linha.faixaEtaria} className="border-b border-gray-100">
                        <th className="border-r border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
                          {linha.faixaEtaria}
                        </th>
                        {sexoMacho && (
                          <>
                            <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                              {linha.macho?.existente ?? 0}
                            </td>
                            <td className="border-r border-gray-100 px-4 py-3 text-center">
                              <QuantityStepper
                                value={linha.macho?.animaisGta ?? 0}
                                max={linha.macho?.existente ?? 0}
                                onChange={(q) => linha.macho && alterarFaixa(linha.macho.id, q)}
                                disabled={disabled || !linha.macho}
                                colorClass="text-blue-600"
                                label={`machos na GTA de ${linha.faixaEtaria}`}
                              />
                            </td>
                          </>
                        )}
                        {sexoFemea && (
                          <>
                            <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                              {linha.femea?.existente ?? 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <QuantityStepper
                                value={linha.femea?.animaisGta ?? 0}
                                max={linha.femea?.existente ?? 0}
                                onChange={(q) => linha.femea && alterarFaixa(linha.femea.id, q)}
                                disabled={disabled || !linha.femea}
                                colorClass="text-pink-600"
                                label={`fêmeas na GTA de ${linha.faixaEtaria}`}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
                  icon={<Calendar size={18} className="text-gray-400" />}
                />
                <FloatInput
                  label="Data da Vacinação da 2ª Etapa de Raiva de Herbívoros"
                  value={formatarDataGta(value.dataRaivaSegundaEtapa)}
                  disabled
                  required
                  icon={<Calendar size={18} className="text-gray-400" />}
                />
                {value.especie?.grupo === "Bovídeos" && (
                  <FloatInput
                    label="Data da Vacinação de Brucelose"
                    value={formatarDataGta(value.dataBrucelose)}
                    disabled
                    required
                    icon={<Calendar size={18} className="text-gray-400" />}
                  />
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Outras Vacinas
              </h4>
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
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <EntitySearchInput
                        label="Vacina"
                        placeholder="Buscar doença"
                        value={item.vacina?.nome ?? ""}
                        data={DOENCAS_VACINA_GTA}
                        searchKeys={["nome"]}
                        columns={[{ label: "Doença", key: "nome" }]}
                        title="Buscar Vacina"
                        subtitle="Busque por uma doença que produz vacina:"
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
                        icon={<Syringe size={18} className="text-[#1A7A3C]" />}
                      />
                    </div>
                    <div className="flex-1">
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
                        icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                      />
                    </div>
                  </div>
                )}
              </DynamicListWrapper>
            </div>
          </div>
        </Section>
      )}

      <Section title="Atestados">
        <div className="flex flex-col gap-4">
          <UploadField
            label="Atestado Sanitário"
            required
            fileName={value.atestadoSanitario}
            disabled={disabled}
            onSelectFile={() =>
              update("atestadoSanitario", "atestado_sanitario.pdf")
            }
          />
          <hr className="border-gray-100 my-2" />
          <h4 className="text-sm font-semibold text-gray-700">
            Atestado de Exames
          </h4>
          <DynamicListWrapper
            items={value.atestadosExame}
            behavior="zero-or-more"
            itemLabel="Atestado de Exame"
            addButtonLabel="Adicionar Exame"
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
              <div className="flex items-center gap-4">
                <div className="flex-1">
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
                </div>
                <div className="flex-1">
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
              </div>
            )}
          </DynamicListWrapper>
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
                  onSelectFile={() => { }}
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
        item.dataVacinacao > hoje,
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