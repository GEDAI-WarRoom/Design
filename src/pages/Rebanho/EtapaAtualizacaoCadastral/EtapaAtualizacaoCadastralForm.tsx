import { useMemo, useState, type ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Dna,
  PlusCircle,
  Syringe,
  X,
} from "lucide-react";
import {
  FloatInput,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import {
  ESPECIES_ETAPA_ATUALIZACAO,
  ETAPAS_VACINACAO_DISPONIVEIS,
  formatarDataEtapaAtualizacao,
  type EspecieEtapaAtualizacao,
  type EtapaAtualizacaoCadastral,
  type EtapaVacinacaoVinculada,
} from "./etapaAtualizacaoCadastralData";

export type EtapaAtualizacaoFormValue = Omit<
  EtapaAtualizacaoCadastral,
  "id"
>;

interface EtapaAtualizacaoCadastralFormProps {
  value: EtapaAtualizacaoFormValue;
  onChange: (value: EtapaAtualizacaoFormValue) => void;
  mode: "create" | "view" | "edit";
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="overflow-visible rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-t-xl bg-gray-50 px-5 py-4 text-left hover:bg-gray-100"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-6">{children}</div>
      )}
    </section>
  );
}

function SelectionPanel({
  title,
  items,
  emptyText,
  onRemove,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    details?: string[];
  }>;
  emptyText: string;
  onRemove?: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        {items.length > 0 && (
          <span className="rounded-full bg-[#DDF3E7] px-2.5 py-1 text-xs font-semibold text-[#1A7A3C]">
            {items.length} {items.length === 1 ? "Selecionada" : "Selecionadas"}
          </span>
        )}
      </div>
      <div className="flex min-h-24 flex-wrap gap-3 p-5">
        {items.length === 0 ? (
          <p className="self-center text-sm text-gray-400">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-[#1A7A3C]">{item.title}</p>
                  {item.subtitle && (
                    <p className="mt-0.5 text-xs text-gray-600">{item.subtitle}</p>
                  )}
                  {item.details?.map((detail) => (
                    <p key={detail} className="text-xs text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="mt-0.5 flex-shrink-0 text-[#1A7A3C] hover:text-red-600"
                    aria-label={`Remover ${item.title}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function EtapaAtualizacaoCadastralForm({
  value,
  onChange,
  mode,
}: EtapaAtualizacaoCadastralFormProps) {
  const [modalEspeciesAberta, setModalEspeciesAberta] = useState(false);
  const [modalEtapasAberta, setModalEtapasAberta] = useState(false);

  const somenteLeitura = mode === "view";
  const permiteEdicaoCompleta =
    mode === "create" || (mode === "edit" && value.situacao === "Criada");
  const bloqueiaCamposGerais = somenteLeitura || !permiteEdicaoCompleta;
  const bloqueiaDataFim = somenteLeitura;
  const dataFimInvalida = Boolean(
    value.dataInicio &&
      value.dataFim &&
      value.dataFim <= value.dataInicio,
  );

  const etapasDoAno = useMemo(
    () =>
      ETAPAS_VACINACAO_DISPONIVEIS.filter(
        (etapa) => etapa.ano === value.ano,
      ),
    [value.ano],
  );

  const removerEspecie = (id: string) => {
    onChange({
      ...value,
      especies: value.especies.filter((item) => item.id !== id),
    });
  };

  const removerEtapaVacinacao = (id: string) => {
    onChange({
      ...value,
      etapasVacinacao: value.etapasVacinacao.filter((item) => item.id !== id),
    });
  };

  return (
    <>
      <Section title="Informações Gerais">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FloatInput
            label="Código"
            required
            value={value.codigo}
            onChange={() => {}}
            disabled
          />
          <FloatInput
            label="Ano"
            required
            value={String(value.ano)}
            onChange={() => {}}
            disabled
          />
          <FloatInput
            label="Data do Início"
            required
            type={bloqueiaCamposGerais ? "text" : "date"}
            value={
              bloqueiaCamposGerais
                ? formatarDataEtapaAtualizacao(value.dataInicio)
                : value.dataInicio
            }
            onChange={(dataInicio) => onChange({ ...value, dataInicio })}
            disabled={bloqueiaCamposGerais}
            icon={<Calendar size={19} />}
          />
          <FloatInput
            label="Data do Fim"
            required
            type={bloqueiaDataFim ? "text" : "date"}
            value={
              bloqueiaDataFim
                ? formatarDataEtapaAtualizacao(value.dataFim)
                : value.dataFim
            }
            onChange={(dataFim) => onChange({ ...value, dataFim })}
            disabled={bloqueiaDataFim}
            icon={<Calendar size={19} />}
          />
        </div>
        {dataFimInvalida && !somenteLeitura && (
          <p className="mt-3 text-sm font-medium text-red-500">
            A Data do Fim deve ser maior que a Data do Início.
          </p>
        )}
      </Section>

      <Section title="Espécies da Atualização Cadastral">
        <div className="flex flex-col gap-4">
          {!bloqueiaCamposGerais && (
            <button
              type="button"
              onClick={() => setModalEspeciesAberta(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#1A7A3C] text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40"
            >
              <PlusCircle size={19} />
              Aplicar a Espécies
            </button>
          )}
          <SelectionPanel
            title="Espécies Selecionadas"
            items={value.especies.map((especie) => ({
              id: especie.id,
              title: especie.nome,
            }))}
            emptyText="Nenhuma espécie selecionada."
            onRemove={!bloqueiaCamposGerais ? removerEspecie : undefined}
          />
        </div>
      </Section>

      <Section title="Etapas de Vacinação da Atualização Cadastral">
        <div className="flex flex-col gap-4">
          {!bloqueiaCamposGerais && (
            <button
              type="button"
              onClick={() => setModalEtapasAberta(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#1A7A3C] text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40"
            >
              <PlusCircle size={19} />
              Aplicar a Etapas
            </button>
          )}
          <SelectionPanel
            title="Etapas de Vacinação Selecionadas"
            items={value.etapasVacinacao.map((etapa) => ({
              id: etapa.id,
              title: etapa.codigo,
              subtitle: `• ${etapa.situacao}`,
              details: etapa.doencas,
            }))}
            emptyText="Nenhuma etapa de vacinação selecionada."
            onRemove={
              !bloqueiaCamposGerais ? removerEtapaVacinacao : undefined
            }
          />
        </div>
      </Section>

      {mode !== "create" && (
        <Section title="Situação do Cadastro">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FloatInput
              label="Situação"
              value={value.situacao}
              onChange={() => {}}
              disabled
            />
            {value.situacao === "Executando Abertura" && (
              <FloatInput
                label="Progresso da Abertura"
                value={`${value.progressoAbertura ?? 0}%`}
                onChange={() => {}}
                disabled
              />
            )}
          </div>
        </Section>
      )}

      {!bloqueiaCamposGerais && (
        <>
          <MultiSearchModal<EspecieEtapaAtualizacao>
            open={modalEspeciesAberta}
            onClose={() => setModalEspeciesAberta(false)}
            title="Buscar Espécies"
            subtitle="Selecione uma ou mais espécies cadastradas no sistema:"
            icon={<Dna size={22} className="text-[#1A7A3C]" />}
            data={ESPECIES_ETAPA_ATUALIZACAO}
            columns={[{ label: "Espécie", key: "nome" }]}
            searchKeys={["nome"]}
            searchPlaceholder="Buscar pelo nome da espécie..."
            selectedItems={value.especies}
            onConfirm={(especies) => onChange({ ...value, especies })}
            confirmLabel="Aplicar"
          />

          <MultiSearchModal<EtapaVacinacaoVinculada>
            open={modalEtapasAberta}
            onClose={() => setModalEtapasAberta(false)}
            title="Buscar Etapas de Vacinação"
            subtitle={`Selecione etapas de vacinação correspondentes ao ano ${value.ano}:`}
            icon={<Syringe size={22} className="text-[#1A7A3C]" />}
            data={etapasDoAno}
            columns={[
              { label: "Código", key: "codigo" },
              { label: "Situação", key: "situacao" },
              {
                label: "Doenças",
                key: "doencas",
                render: (doencas: string[]) => doencas.join(", "),
              },
            ]}
            searchKeys={["codigo", "situacao"]}
            searchPlaceholder="Buscar por código ou situação..."
            selectedItems={value.etapasVacinacao}
            onConfirm={(etapasVacinacao) =>
              onChange({ ...value, etapasVacinacao })
            }
            confirmLabel="Aplicar"
          />
        </>
      )}
    </>
  );
}

export function etapaAtualizacaoCadastralValida(
  value: EtapaAtualizacaoFormValue,
) {
  return Boolean(
    value.codigo &&
      String(value.ano).length === 4 &&
      value.dataInicio &&
      value.dataFim &&
      value.dataFim > value.dataInicio &&
      value.especies.length > 0,
  );
}
