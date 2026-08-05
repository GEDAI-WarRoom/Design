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
  Check,
  Bug,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui-1/popover";
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
  NUCLEOS_EXTERNOS_GTA,
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

type EnderecoState = {
  zona: "Urbana" | "Rural" | string;
  cep: string;
  estado: string;
  municipio: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  localidade: string;
  distrito: string;
  latitude: string;
  longitude: string;
};

function MapModal({
  onClose,
  onConfirm,
  initialLat,
  initialLng,
}: {
  onClose: () => void;
  onConfirm: (lat: string, lng: string) => void;
  initialLat: string;
  initialLng: string;
}) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Adicionar Coordenadas
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <FloatInput
            label="Latitude"
            value={lat}
            onChange={(v) => setLat(v)}
          />
          <FloatInput
            label="Longitude"
            value={lng}
            onChange={(v) => setLng(v)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!lat || !lng}
            onClick={() => onConfirm(lat, lng)}
            className="rounded-md bg-[#1A7A3C] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function uid() {
  return crypto.randomUUID();
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
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 ">
      <button
        type="button"
        onClick={() => setAberta((valor) => !valor)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {aberta ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {aberta && (
        <div className="p-6 flex flex-col gap-5 bg-white">
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

function DevFieldPopover({ value }: { value: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-5 items-center gap-1 rounded border border-amber-300 bg-amber-50 px-1.5 text-[9px] font-bold leading-none text-amber-800 shadow-sm hover:bg-amber-100"
          aria-label="Abrir valor para teste"
        >
          <Bug size={10} /> DEV
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="z-[100] w-auto max-w-[300px] border-amber-200 bg-white px-3 py-2 text-xs text-gray-700"
      >
        <p className="mb-1 font-semibold text-amber-900">Valor para teste</p>
        <p className="whitespace-pre-line font-mono leading-relaxed">{value}</p>
      </PopoverContent>
    </Popover>
  );
}

export function WithDevHint({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      {children}
      <div className="absolute right-2 top-1.5 z-20">
        <DevFieldPopover value={value} />
      </div>
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
                ? " text-gray-600"
                : "text-gray-600 "
                } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${selecionado
                  ? "border-[#1A7A3C] bg-[#1A7A3C] text-white"
                  : "border-gray-300 bg-white"
                  }`}
              >
                {selecionado && <Check size={12} strokeWidth={3} />}
              </span>
              {opcao.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EntityPicker<T extends EntidadeGta = EntidadeGta>({
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
  devValue,
  tooltipText,
}: {
  label: string;
  value: T | null;
  data: T[];
  onChange: (entidade: T) => void;
  required?: boolean;
  disabled?: boolean;
  codeLabel?: string;
  codeKey?: "codigo" | "documento";
  placeholder?: string;
  columns?: { label: string; key: string }[];
  searchKeys?: string[];
  icon?: ReactNode;
  semComplemento?: boolean;
  devValue?: string;
  tooltipText?: string;
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

  const picker = (
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
      hasTooltip={Boolean(tooltipText)}
      tooltipText={tooltipText}
      onChange={onChange}
    />
  );

  return (
    <div
      className={
        value && !semComplemento
          ? "grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
          : "w-full"
      }
    >
      {devValue ? <WithDevHint value={devValue}>{picker}</WithDevHint> : picker}
      {value && !semComplemento && (
        <>
          <FloatInput label={codeLabel} value={codigo} required={required} disabled />
          <button
            type="button"
            title={`Visualizar ${label}`}
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
  grupoEspecieSelecionado,
  finalidade,
  onChange,
  disabled,
  isDestino,
}: {
  local: LocalGta | DestinoGta;
  especieId?: number;
  grupoEspecieSelecionado?: string;
  finalidade?: string;
  onChange: (local: LocalGta | DestinoGta) => void;
  disabled: boolean;
  isDestino?: boolean;
}) {
  const update = (patch: Partial<LocalGta | DestinoGta>) =>
    onChange({ ...local, ...patch });
  const interdicao = useMemo(
    () => getInterdicaoGta(local.estabelecimento),
    [local.estabelecimento]
  );
  const [modalInterdicao, setModalInterdicao] = useState(false);
  // Explorações filtradas pela espécie selecionada (pré-filtro) e pelo estabelecimento
  const exploracoes = EXPLORACOES_GTA.filter(
    (item) =>
      (!especieId || item.especieId === especieId) &&
      (!local.estabelecimento ||
        item.estabelecimentoId === local.estabelecimento.id),
  );
  // Estabelecimentos que possuem exploração da espécie selecionada
  const estabelecimentos = especieId
    ? ESTABELECIMENTOS_GTA.filter((estab) =>
      EXPLORACOES_GTA.some(
        (expl) =>
          expl.estabelecimentoId === estab.id && expl.especieId === especieId,
      ),
    )
    : ESTABELECIMENTOS_GTA;
  const nucleos = NUCLEOS_GTA.filter(
    (item) => !local.exploracao || item.exploracaoId === local.exploracao.id,
  );

  // Núcleo de produção existe apenas para Aves e Suídeos (Bovinos não têm)
  const grupoEspecie = grupoEspecieSelecionado ?? "";
  const especieTemNucleo =
    grupoEspecie === "Aves" ||
    grupoEspecie === "Suídeos" ||
    grupoEspecie === "Suínos";

  const temNucleosDisponiveis =
    especieTemNucleo &&
    local.exploracao &&
    !interdicao &&
    NUCLEOS_GTA.some((nucleo) => nucleo.exploracaoId === local.exploracao?.id);

  return (
    <div className="flex flex-col gap-5">
      <EntityPicker
        label={isDestino ? "Responsável de Destino" : "Responsável de Procedência"}
        devValue={isDestino ? "José Aarão Neto" : undefined}
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
                devValue={isDestino ? "[INTERDITADO] Fazenda Recanto dos Pássaros" : undefined}
                value={local.estabelecimento}
                data={estabelecimentos}
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
                    devValue={isDestino ? "Exploração Aves - Vale Verde\nCódigo: 310020300401002" : undefined}
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
                      devValue={isDestino ? "Núcleo A" : undefined}
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
  const exibeCertificados =
    value.especie?.grupo !== "Bovinos" &&
    value.especie?.grupo !== "Bovídeos";
  return (
    <Section title="Informações Adicionais da Procedência" defaultOpen={false}>
      {nucleo && (
        <div className="flex flex-col gap-4">
          <h3 className="border-b border-gray-100 pb-3 text-sm font-semibold text-gray-700">
            Característica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {value.especie?.grupo === "Aves" ? (
              <>
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
                <FloatInput
                  label="Caracterização Adicional"
                  value={nucleo.caracteristica}
                  disabled
                  required
                />
              </>
            ) : (
              <>
                <FloatInput
                  label={
                    value.especie?.grupo === "Suídeos"
                      ? "Tipo de Produção Técnica"
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
              </>
            )}
          </div>
        </div>
      )}
      {exibeCertificados && (
        <div className="flex flex-col gap-4">
          <h3 className="border-b border-gray-100 pb-3 text-sm font-semibold text-gray-700">
            Certificado
          </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FloatInput label="Tipo" value="Sanitário" disabled required />
              <FloatInput label="Número" value="0212024" disabled required />
              <FloatInput label="Validade" value="25/03/2027" disabled required />
            </div>
        </div>
      )}
    </Section>
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
  const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");
  const documentoCompleto = [11, 14].includes(
    destino.documentoResponsavelExterno.length,
  );
  const responsavelEncontrado = documentoCompleto
    ? PESSOAS_GTA.some(
        (item) =>
          somenteNumeros(item.documento ?? "") ===
          destino.documentoResponsavelExterno,
      )
    : undefined;
  const codigoEstabelecimentoCompleto =
    destino.codigoEstabelecimentoExterno.length === 11;
  const estabelecimentoEncontrado = codigoEstabelecimentoCompleto
    ? ESTABELECIMENTOS_GTA.some(
        (item) => item.codigo === destino.codigoEstabelecimentoExterno,
      )
    : undefined;
  const codigoNucleoCompleto = destino.codigoNucleoExterno.length === 17;
  const nucleoEncontrado = codigoNucleoCompleto
    ? Boolean(NUCLEOS_EXTERNOS_GTA[destino.codigoNucleoExterno])
    : undefined;

  const LookupStatus = ({ found }: { found?: boolean }) => {
    if (found === undefined) return null;
    return (
      <p
        className={`mt-1.5 flex items-center gap-1.5 px-1 text-xs font-medium ${
          found ? "text-[#1A7A3C]" : "text-amber-700"
        }`}
      >
        {found ? <CheckCircle2 size={14} /> : <Info size={14} />}
        {found
          ? "Cadastro localizado na Plataforma de Gestão Agropecuária (PGA)."
          : "Cadastro não localizado na PGA. Preencha o campo ao lado manualmente."}
      </p>
    );
  };
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
        <div>
          <WithDevHint value="05514598699">
            <FloatInput
              label="CPF/CNPJ do Responsável de Destino"
              required
              value={destino.documentoResponsavelExterno}
              maxLength={14}
              onChange={(documentoResponsavelExterno) => {
                const documento = somenteNumeros(documentoResponsavelExterno).slice(0, 14);
                const pessoa = PESSOAS_GTA.find(
                  (item) => somenteNumeros(item.documento ?? "") === documento,
                );
                update({
                  documentoResponsavelExterno: documento,
                  responsavelExterno: pessoa?.nome ?? "",
                });
              }}
              disabled={disabled}
            />
          </WithDevHint>
          <LookupStatus found={responsavelEncontrado} />
        </div>
        <FloatInput
          label="Responsável de Destino"
          required
          value={destino.responsavelExterno}
          onChange={(responsavelExterno) => update({ responsavelExterno })}
          disabled={disabled || !documentoCompleto || responsavelEncontrado}
        />
      </div>

      {destino.tipo === "Estabelecimento Agropecuário" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <WithDevHint value="31002030039">
              <FloatInput
                label="Código do Estabelecimento Agropecuário"
                required
                value={destino.codigoEstabelecimentoExterno}
                maxLength={11}
                onChange={(codigoEstabelecimentoExterno) => {
                  const codigo = codigoEstabelecimentoExterno.replace(/\D/g, "").slice(0, 11);
                  const estabelecimento = ESTABELECIMENTOS_GTA.find(
                    (item) => item.codigo === codigo,
                  );
                  update({
                    codigoEstabelecimentoExterno: codigo,
                    estabelecimentoExterno: estabelecimento?.nome ?? "",
                  });
                }}
                disabled={disabled}
              />
            </WithDevHint>
            <LookupStatus found={estabelecimentoEncontrado} />
          </div>
          <FloatInput
            label="Estabelecimento Agropecuário de Destino"
            required
            value={destino.estabelecimentoExterno}
            onChange={(estabelecimentoExterno) => update({ estabelecimentoExterno })}
            disabled={disabled || !codigoEstabelecimentoCompleto || estabelecimentoEncontrado}
          />
        </div>
      )}
      {destino.tipo === "Estabelecimento Agropecuário" && (
        <div className="flex flex-col gap-5">
          <WithDevHint value="330094579013923">
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
          </WithDevHint>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <WithDevHint value="33009457901392301">
                <FloatInput
                  label="Código do Núcleo de Produção"
                  required
                  value={destino.codigoNucleoExterno}
                  maxLength={17}
                  onChange={(codigoNucleoExterno) => {
                    const codigo = codigoNucleoExterno.replace(/\D/g, "").slice(0, 17);
                    update({
                      codigoNucleoExterno: codigo,
                      nucleoExterno: NUCLEOS_EXTERNOS_GTA[codigo] ?? "",
                    });
                  }}
                  disabled={disabled}
                />
              </WithDevHint>
              <LookupStatus found={nucleoEncontrado} />
            </div>
            <FloatInput
              label="Núcleo de Produção"
              required
              value={destino.nucleoExterno}
              onChange={(nucleoExterno) => update({ nucleoExterno })}
              disabled={disabled || !codigoNucleoCompleto || nucleoEncontrado}
            />
          </div>
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
  const updateDestino = (destino: LocalGta | DestinoGta) =>
    update("destino", destino as DestinoGta);
  const especieGrandesAnimais = ["Bovídeos", "Equídeos"].includes(
    value.especie?.grupo ?? "",
  );
  const selecoesIniciaisPreenchidas = Boolean(
    value.especie && value.finalidade,
  );
  const mensagemSelecoesIniciais = value.especie
    ? "Selecione uma finalidade de trânsito para carregar."
    : "Selecione uma espécie para carregar.";
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
  type LinhaFaixa = {
    faixaEtaria: string;
    macho?: typeof value.faixasAnimais[number];
    femea?: typeof value.faixasAnimais[number];
  };

  const motivoIsencao = Boolean(value.motivoIsencaoTaxa);
  const faixasAnimais = value.faixasAnimais;
  const totalMachos = (faixas: typeof value.faixasAnimais) =>
    faixas
      .filter((f) => f.sexo === "Machos")
      .reduce((acc, f) => acc + (f.animaisGta ?? 0), 0);
  const totalFemeas = (faixas: typeof value.faixasAnimais) =>
    faixas
      .filter((f) => f.sexo === "Fêmeas")
      .reduce((acc, f) => acc + (f.animaisGta ?? 0), 0);

  const linhasPorFaixa = useMemo(() => {
    const ordem: string[] = [];
    const mapa: Record<string, LinhaFaixa> = {};
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
                      ? value.gtasRastreio.length > 0
                        ? value.gtasRastreio
                        : [{ id: uid(), uf: "", serieNumero: "" }]
                      : [],
                })
              }
            />
            <EntityPicker
              label="Finalidade de Trânsito"
              tooltipText="Selecione a finalidade para a qual os animais serão transportados."
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
                    finalidade.nome === "Abate" && value.especie?.grupo === "Aves"
                      ? value.gtasRastreio.length > 0
                        ? value.gtasRastreio
                        : [{ id: uid(), uf: "", serieNumero: "" }]
                      : [],
                })
              }
            />
          </div>
        </Section>
      )}

      <Section title="Informações da Procedência">
        {!selecoesIniciaisPreenchidas ? (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            {mensagemSelecoesIniciais}
          </p>
        ) : (
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
              grupoEspecieSelecionado={value.especie?.grupo}
              onChange={updateProcedencia}
              disabled={disabled}
            />
          )}
          </div>
        )}
      </Section>

      {selecoesIniciaisPreenchidas && (
        <DadosComplementaresProcedencia value={value} />
      )}

      <Section title="Informações de Destino">
        {!selecoesIniciaisPreenchidas ? (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            {mensagemSelecoesIniciais}
          </p>
        ) : (
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
              grupoEspecieSelecionado={value.especie?.grupo}
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
        )}
      </Section>

      <Section title="Informações do Trânsito">
        <div className="flex flex-col gap-5">
          <div>
            <div>
              <MeioTransporteSelector
                label="Meio de Transporte"
                value={value.meiosTransporte}
                onChange={(novosMeios) => update("meiosTransporte", novosMeios)}
                options={MEIOS_TRANSPORTE}
                required
                disabled={disabled}
              />
            </div>

          </div>
          {value.especie?.nome !== "Bovino" && (
            <SimNao
              name="possuiParadaDescanso"
              label="Possui Parada para Descanso dos Animais?"
              required
              value={value.possuiParadaDescanso ?? "Não"}
              onChange={(val) => update("possuiParadaDescanso", val)}
              disabled={disabled}
            />
          )}


          {value.especie?.nome === "Bovino" && (

            <BlocoEnderecoFields
              title="Informações de Localização do Local de Parada"
              data={endereco}
              tipoEstado="normal"
              onChange={(campo, valor) =>
                setEndereco((atual) => ({ ...atual, [campo]: valor }))
              }
              onSetMultipleFields={(campos) =>
                setEndereco((atual) => ({ ...atual, ...campos }))
              }
            />
          )}
        </div>
      </Section>

      {selecoesIniciaisPreenchidas && (
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
                  {/* Linha de Totalização na tabela */}
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200 font-bold text-gray-800">
                    <tr>
                      <td className="border-r border-gray-200 px-4 py-3 text-left">
                        Total
                      </td>
                      {sexoMacho && (
                        <>
                          <td className="border-r border-gray-200 px-4 py-3 text-center text-blue-900">
                            {value.faixasAnimais
                              .filter((f) => f.sexo === "Machos")
                              .reduce((acc, f) => acc + (f.existente ?? 0), 0)}
                          </td>
                          <td className="border-r border-gray-200 px-4 py-3 text-center text-blue-900">
                            {value.faixasAnimais
                              .filter((f) => f.sexo === "Machos")
                              .reduce((acc, f) => acc + (f.animaisGta ?? 0), 0)}
                          </td>
                        </>
                      )}
                      {sexoFemea && (
                        <>
                          <td className="border-r border-gray-200 px-4 py-3 text-center text-pink-900">
                            {value.faixasAnimais
                              .filter((f) => f.sexo === "Fêmeas")
                              .reduce((acc, f) => acc + (f.existente ?? 0), 0)}
                          </td>
                          <td className="px-4 py-3 text-center text-pink-900">
                            {value.faixasAnimais
                              .filter((f) => f.sexo === "Fêmeas")
                              .reduce((acc, f) => acc + (f.animaisGta ?? 0), 0)}
                          </td>
                        </>
                      )}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        )}
      </Section>
      )}



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
                variant="plain"
                addButtonLabel="Adicionar Vacina"
                addButtonVariant="outline"
                addButtonClassName="border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 bg-transparent font-semibold"
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

      {selecoesIniciaisPreenchidas && (
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
            variant="plain"
            addButtonLabel="Adicionar Exame"
            addButtonVariant="outline"
            addButtonClassName="border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 bg-transparent font-semibold"
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
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1">
                  <FloatSelect
                    label="Tipo de Atestado"
                    value={item.tipo?.nome ?? ""}
                    options={TIPOS_ATESTADO_EXAME_GTA.map((tipo) => ({
                      value: tipo.nome,
                      label: tipo.nome,
                    }))}
                    required
                    disabled={disabled}
                    onChange={(nomeTipo) =>
                      update(
                        "atestadosExame",
                        value.atestadosExame.map((atestado, itemIndex) =>
                          itemIndex === index
                            ? {
                              ...atestado,
                              tipo:
                                TIPOS_ATESTADO_EXAME_GTA.find(
                                  (tipo) => tipo.nome === nomeTipo,
                                ) ?? null,
                            }
                            : atestado,
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
      )}

      {selecoesIniciaisPreenchidas && (
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
                  behavior="at-least-one"
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
                        required
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
      )}
      <Section title="Informações da GTA">
        <div className="flex flex-col gap-5">
          <SimNao
            label="Possui motivo de isenção de taxa de GTA?"
            name="possuiMotivoIsencaoTaxa"
            required
            value={value.possuiMotivoIsencaoTaxa}
            onChange={(possui) =>
              onChange?.({
                ...value,
                possuiMotivoIsencaoTaxa: possui ? "Sim" : "Não",
                motivoIsencaoTaxa: possui ? value.motivoIsencaoTaxa : null,
              })
            }
            disabled={disabled}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {value.possuiMotivoIsencaoTaxa === "Sim" && (
              <EntitySearchInput
                label="Motivo de Isenção de Taxa"
                placeholder="Buscar motivo de isenção"
                value={value.motivoIsencaoTaxa?.nome ?? ""}
                data={ISENCOES_TAXA_GTA}
                searchKeys={["nome"]}
                columns={[{ label: "Motivo", key: "nome" }]}
                title="Buscar Motivo de Isenção de Taxa"
                subtitle="Busque por um motivo de isenção cadastrado no sistema:"
                disabled={disabled}
                onChange={(motivoIsencaoTaxa) =>
                  update("motivoIsencaoTaxa", motivoIsencaoTaxa)
                }
                icon={<img src={Icons.iconeIsencaoTaxaUrl} alt="Isenção" className="w-5 h-5 object-contain" />}
              />
            )}
            <FloatInput
              label="Valor da GTA"
              value={formatarMoedaGta(value.motivoIsencaoTaxa ? 0 : value.valorGta)}
              disabled
              required
            />
          </div>
        </div>


      </Section>

      {/* Resumo final da ATA — valor e total de animais em destaque */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1B4332] px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Marca-d'água: nota emitida */}
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[190%] w-auto text-white/[0.035] rotate-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h5" />
          <path d="M8 17h8" />
          <path d="m15.5 10.5 1.5 1.5 3-3" />
        </svg>

        {/* Valor / Liquidação */}
        <div className="relative z-10">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8FBF9F]">
            Valor Final da GTA
            <CheckCircle2 size={14} className="text-[#8FBF9F]" />
          </p>
          <p className="text-[11px] uppercase tracking-wider text-[#6E9A7D] mt-0.5">
            {motivoIsencao ? "Isenção aplicada" : "Total do documento"}
          </p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-lg font-semibold text-[#8FBF9F]">R$</span>
            <span className="text-4xl font-bold text-white leading-none tracking-tight">
              {formatarMoedaGta(motivoIsencao ? 0 : value.valorGta).replace("R$", "").trim()}
            </span>
          </div>
        </div>

        {/* Total de animais na ATA */}
        <div className="relative z-10 sm:ml-auto sm:border-l sm:border-white/15 sm:pl-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8FBF9F]">
            Animais na GTA
          </p>
          <p className="text-[11px] uppercase tracking-wider text-[#6E9A7D] mt-0.5">
            Total transportado neste documento
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold text-white leading-none tracking-tight">
              {totalMachos(faixasAnimais) + totalFemeas(faixasAnimais)}
            </span>
            <span className="text-sm text-[#8FBF9F]">
              ({totalMachos(faixasAnimais)} machos · {totalFemeas(faixasAnimais)} fêmeas)
            </span>
          </div>
        </div>
      </div>
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
    ![11, 14].includes(destino.documentoResponsavelExterno.length)
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
    !value.possuiMotivoIsencaoTaxa ||
    (value.possuiMotivoIsencaoTaxa === "Sim" && !value.motivoIsencaoTaxa) ||
    !localPreenchido(value.procedencia) ||
    !destinoPreenchido(value.destino, value.finalidade.nome) ||
    value.meiosTransporte.length === 0 ||
    !value.atestadoSanitario ||
    !value.observacoes.trim()
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
  if (
    value.especie.grupo === "Aves" &&
    value.finalidade.nome === "Abate" &&
    value.gtasRastreio.length === 0
  )
    return false;
  return !value.gtasRastreio.some(
    (item) =>
      !item.uf ||
      !/^[A-Z]{2}\s-\s\d{6}$/.test(item.serieNumero),
  );
}
