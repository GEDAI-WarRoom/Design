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
import * as Icons from "../../../imports/icons";


export type EtapaAtualizacaoFormValue = Omit<
  EtapaAtualizacaoCadastral,
  "id"
>;
const GREEN = "#1A7A3C";

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
    <section className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((val) => !val)}
        className="flex w-full items-center justify-between rounded-t-xl bg-gray-50 px-5 py-4 text-left transition hover:bg-gray-100"
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

export function EtapaAtualizacaoCadastralForm({
  value,
  onChange,
  mode,
}: EtapaAtualizacaoCadastralFormProps) {
  const [modalEspeciesAberta, setModalEspeciesAberta] = useState(false);
  const [modalEtapasAberta, setModalEtapasAberta] = useState(false);

  const isView = mode === "view";
  const permiteEdicaoCompleta =
    mode === "create" || (mode === "edit" && value.situacao === "Criada");
  const bloqueiaCamposGerais = isView || !permiteEdicaoCompleta;
  const bloqueiaDataFim = isView;

  const dataFimInvalida = Boolean(
    value.dataInicio &&
      value.dataFim &&
      value.dataFim <= value.dataInicio,
  );

  const etapasDoAno = useMemo(
    () =>
      ETAPAS_VACINACAO_DISPONIVEIS.filter(
        (etapa) => String(etapa.ano) === String(value.ano),
      ),
    [value.ano],
  );

  const removerEspecie = (nomeEspecie: string) => {
    onChange({
      ...value,
      especies: value.especies.filter((item) => item.nome !== nomeEspecie),
    });
  };

  const removerEtapaVacinacao = (codigoEtapa: string) => {
    onChange({
      ...value,
      etapasVacinacao: value.etapasVacinacao.filter(
        (item) => item.codigo !== codigoEtapa,
      ),
    });
  };

  return (
    <div className="flex flex-col gap-6">
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
            value={String(value.ano ?? "")}
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
            icon={<Calendar size={19} className="text-gray-400"/>}
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
            icon={<Calendar size={19} className="text-gray-400" />}
          />
        </div>
        {dataFimInvalida && !isView && (
          <p className="mt-3 text-sm font-medium text-red-500">
            A Data do Fim deve ser maior que a Data do Início.
          </p>
        )}
      </Section>

      <Section title="Espécies Envolvidas">
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f9fafb]/50">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-500">
                Espécies Selecionadas
              </span>
              {value.especies.length > 0 && (
                <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">
                  {value.especies.length}{" "}
                  {value.especies.length === 1
                    ? "Selecionada"
                    : "Selecionadas"}
                </span>
              )}
            </div>

            {!isView && (
              <button
                type="button"
                onClick={() => setModalEspeciesAberta(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] transition hover:bg-green-50"
              >
                <PlusCircle size={14} /> Adicionar Espécie
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 p-5">
            {value.especies.length === 0 ? (
              <p className="text-xs italic text-gray-400">
                Nenhuma espécie selecionada.
              </p>
            ) : (
              value.especies.map((especie) => (
                <div
                  key={especie.nome}
                  className="group relative flex min-w-[180px] flex-col rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition hover:border-gray-300"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <span
                      className="text-sm font-bold"
                      style={{ color: GREEN }}
                    >
                      {especie.nome}
                    </span>
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => removerEspecie(especie.nome)}
                        className="cursor-pointer rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-500"
                        aria-label={`Remover ${especie.nome}`}
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
      </Section>
<Section title="Etapas de Vacinação Vinculadas">
  {/* Etapas de Vacinação — Container Principal */}
  <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f9fafb]/50">
    {/* Cabeçalho do Bloco */}
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-600">
          Etapas Selecionadas
        </span>
        {value.etapasVacinacao.length > 0 && (
          <span className="rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-xs font-bold text-[#1A7A3C]">
            {value.etapasVacinacao.length}{" "}
            {value.etapasVacinacao.length === 1
              ? "Selecionada"
              : "Selecionadas"}
          </span>
        )}
      </div>

      {!isView && (
        <button
          type="button"
          onClick={() => setModalEtapasAberta(true)}
          disabled={!value.ano}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
          title={
            !value.ano
              ? "Preencha o ano para selecionar etapas"
              : undefined
          }
        >
          <PlusCircle size={14} /> Adicionar Etapa de Vacinação
        </button>
      )}
    </div>

    {/* Grid com Cards de Tamanho Fixo (`w-[200px]`) */}
    <div className="flex flex-wrap gap-3 p-4">
      {value.etapasVacinacao.length === 0 ? (
        <p className="text-xs italic text-gray-400">
          {!value.ano
            ? "Informe o ano nos Dados Gerais para visualizar as etapas disponíveis."
            : "Nenhuma etapa de vacinação selecionada."}
        </p>
      ) : (
        value.etapasVacinacao.map((etapa) => (
          <div
            key={etapa.codigo}
            className="group relative flex w-[200px] shrink-0 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition hover:border-gray-300"
          >
            {/* Linha Superior: Código · Situação e Botão Fechar */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 text-xs font-bold truncate">
                <span style={{ color: GREEN }}>{etapa.codigo}</span>
                {etapa.situacao && (
                  <>
                    <span className="font-normal text-gray-400">·</span>
                    <span className="text-[11px] font-semibold text-gray-500 truncate">
                      {etapa.situacao}
                    </span>
                  </>
                )}
              </div>

              {!isView && (
                <button
                  type="button"
                  onClick={() => removerEtapaVacinacao(etapa.codigo)}
                  className="shrink-0 cursor-pointer rounded p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                  aria-label={`Remover ${etapa.codigo}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Lista de Doenças Empilhada (uma por linha, sem marcadores/pontos) */}
            {etapa.doencas && etapa.doencas.length > 0 && (
              <div className="mt-0.5 flex flex-col  pt-1">
                <span className="text-[10px] font-semibold text-gray-400">
                  Doenças:
                </span>
                <div className="flex flex-col gap-0.5">
                  {etapa.doencas.map((doenca, idx) => (
                    <span
                      key={idx}
                      className="truncate text-[11px] text-gray-600"
                      title={doenca}
                    >
                      {doenca}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
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
            confirmLabel="Selecionar"
          />

          <MultiSearchModal<EtapaVacinacaoVinculada>
            open={modalEtapasAberta}
            onClose={() => setModalEtapasAberta(false)}
            title="Buscar Etapas de Vacinação"
            subtitle={`Selecione etapas de vacinação correspondentes ao ano ${value.ano}:`}
       
            icon={<img
                        src={Icons.iconeEtapaVacinacaoUrl}
                        alt="Etapa de Vacinação"
                        className="w-5 h-5"
                      />}
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
            confirmLabel="Selecionar"
          />
        </>
      )}
    </div>
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