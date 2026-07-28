import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  MapPinned,
  UserRound,
} from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  PRODUTORES_GTA_MOCK,
  PROPRIEDADES_GTA_MOCK,
  TIPOS_FORMULARIO_GTA,
  TIPOS_PROCEDENCIA_GTA,
  type EmissaoGtaDraft,
  type EmissaoGtaDados,
  type TipoFormularioGta,
  type TipoProcedenciaGta,
} from "./emissaoGtaData";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [aberta, setAberta] = useState(true);

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

function EyeAction({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition"
    >
      <Eye size={20} />
    </button>
  );
}

export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
      <Info
        size={20}
        className="text-gray-500 flex-shrink-0 stroke-[2.5]"
      />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com{" "}
        <span className="text-red-500 font-bold">*</span> são obrigatórios e
        deverão ser preenchidos.
      </p>
    </div>
  );
}

interface EmissaoGtaFormProps {
  value: EmissaoGtaDraft;
  onChange?: (value: EmissaoGtaDraft) => void;
  mode?: "create" | "edit" | "view";
}

export function EmissaoGtaForm({
  value,
  onChange,
  mode = "create",
}: EmissaoGtaFormProps) {
  const visualizacao = mode === "view";
  const manual = value.tipoFormulario === "Manual";

  const update = <K extends keyof EmissaoGtaDraft>(
    campo: K,
    valor: EmissaoGtaDraft[K],
  ) => onChange?.({ ...value, [campo]: valor });

  const atualizarTipoFormulario = (tipo: string) => {
    const tipoFormulario = tipo as TipoFormularioGta;
    onChange?.({
      ...value,
      tipoFormulario,
      numeroControle: tipoFormulario === "Manual" ? value.numeroControle : "",
      serieGta: tipoFormulario === "Manual" ? value.serieGta : "",
      numeroGta: tipoFormulario === "Manual" ? value.numeroGta : "",
      dataEmissao: tipoFormulario === "Manual" ? value.dataEmissao : "",
    });
  };

  return (
    <Section title="Dados de Procedência">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FloatSelect
          label="Tipo de Formulário"
          required
          value={value.tipoFormulario}
          onChange={atualizarTipoFormulario}
          options={TIPOS_FORMULARIO_GTA}
          disabled={visualizacao}
        />

        {manual && (
          <>
            <FloatInput
              label="Número de Controle"
              required
              value={value.numeroControle}
              onChange={(valor) => update("numeroControle", valor)}
              disabled={visualizacao}
            />
            <FloatInput
              label="Série da GTA"
              required
              value={value.serieGta}
              maxLength={2}
              onChange={(valor) =>
                update(
                  "serieGta",
                  valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 2),
                )
              }
              disabled={visualizacao}
            />
            <FloatInput
              label="Número da GTA"
              required
              value={value.numeroGta}
              maxLength={6}
              onChange={(valor) =>
                update("numeroGta", valor.replace(/\D/g, "").slice(0, 6))
              }
              disabled={visualizacao}
            />
            <FloatInput
              label="Data de Emissão"
              type="date"
              required
              value={value.dataEmissao}
              onChange={(valor) => update("dataEmissao", valor)}
              icon={<CalendarDays size={18} />}
              disabled={visualizacao}
            />
          </>
        )}

        <FloatSelect
          label="Tipo de Procedência"
          required
          value={value.tipoProcedencia}
          onChange={(valor) =>
            update("tipoProcedencia", valor as TipoProcedenciaGta)
          }
          options={TIPOS_PROCEDENCIA_GTA}
          disabled={visualizacao}
        />

        <div className="md:col-span-2">
          {visualizacao ? (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <FloatInput
                label="Produtor"
                required
                value={value.produtor?.nome ?? ""}
                disabled
              />
              <FloatInput
                label={value.produtor?.tipo === "PJ" ? "CNPJ" : "CPF"}
                required
                value={value.produtor?.documento ?? ""}
                disabled
              />
              <EyeAction
                title="Visualizar Produtor"
                onClick={() =>
                  window.alert(
                    `${value.produtor?.nome}\n${value.produtor?.documento}`,
                  )
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <EntitySearchInput
                label="Produtor"
                placeholder="Buscar por nome, CPF ou CNPJ"
                required
                value={value.produtor?.nome ?? ""}
                data={PRODUTORES_GTA_MOCK}
                searchKeys={["nome", "documento"]}
                columns={[
                  { label: "Nome / Razão Social", key: "nome" },
                  { label: "CPF / CNPJ", key: "documento" },
                ]}
                icon={<UserRound size={18} />}
                title="Buscar Produtor"
                subtitle="Busque por um produtor cadastrado no sistema:"
                confirmLabel="Selecionar"
                onChange={(produtor) => update("produtor", produtor)}
              />
              <FloatInput
                label={value.produtor?.tipo === "PJ" ? "CNPJ" : "CPF"}
                required
                value={value.produtor?.documento ?? ""}
                disabled
              />
              {value.produtor && (
                <EyeAction
                  title="Visualizar Produtor"
                  onClick={() =>
                    window.alert(
                      `${value.produtor.nome}\n${value.produtor.documento}`,
                    )
                  }
                />
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {visualizacao ? (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <FloatInput
                label="Propriedade"
                required
                value={value.propriedade?.nome ?? ""}
                disabled
              />
              <FloatInput
                label="Código da Propriedade"
                required
                value={value.propriedade?.codigo ?? ""}
                disabled
              />
              <EyeAction
                title="Visualizar Propriedade"
                onClick={() =>
                  window.alert(
                    `${value.propriedade?.nome}\n${value.propriedade?.municipio}`,
                  )
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <EntitySearchInput
                label="Propriedade"
                placeholder="Buscar por código, nome ou município"
                required
                value={value.propriedade?.nome ?? ""}
                data={PROPRIEDADES_GTA_MOCK}
                searchKeys={["codigo", "nome", "municipio", "proprietario"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Propriedade", key: "nome" },
                  { label: "Município", key: "municipio" },
                  { label: "Proprietário", key: "proprietario" },
                ]}
                icon={<MapPinned size={18} />}
                title="Buscar Propriedade"
                subtitle="Busque por uma propriedade cadastrada no sistema:"
                confirmLabel="Selecionar"
                onChange={(propriedade) => update("propriedade", propriedade)}
              />
              <FloatInput
                label="Código da Propriedade"
                required
                value={value.propriedade?.codigo ?? ""}
                disabled
              />
              {value.propriedade && (
                <EyeAction
                  title="Visualizar Propriedade"
                  onClick={() =>
                    window.alert(
                      `${value.propriedade.nome}\n${value.propriedade.municipio}`,
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export function emissaoGtaValida(
  emissao: EmissaoGtaDraft,
): emissao is EmissaoGtaDados {
  if (
    !emissao.tipoFormulario ||
    !emissao.tipoProcedencia ||
    !emissao.produtor ||
    !emissao.propriedade
  ) {
    return false;
  }

  if (emissao.tipoFormulario === "Digital") return true;

  return Boolean(
    emissao.numeroControle.trim() &&
      emissao.serieGta.length === 2 &&
      emissao.numeroGta.length === 6 &&
      emissao.dataEmissao,
  );
}
