import { useState } from "react";
import { Calendar, Dna, PlusCircle, Syringe } from "lucide-react";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  LargeTextArea,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import {
  DoencaInput,
  DynamicListWrapper,
  SelectedChipsContainer,
} from "../../../components/ui/EntitySearch";
import {
  DOENCAS_ETAPA_MOCK,
  ESPECIES_ETAPA_MOCK,
  novaFaixaEspecie,
  novoTipoVacinacao,
  type DoencaEtapaVacinacao,
  type EspecieEtapaVacinacao,
  type EtapaVacinacao,
  type FaixasEspecieEtapa,
  type RespostaSimNao,
  type SexoVacinacaoObrigatoria,
  type SituacaoEtapaVacinacao,
  type TipoVacinacaoEtapa,
} from "./etapaVacinacaoData";

const GREEN = "#1A7A3C";

export type EtapaVacinacaoFormMode = "create" | "edit" | "view";

export interface EtapaVacinacaoFormValue {
  codigo: string;
  dataInicio: string;
  dataFim: string;
  doenca: DoencaEtapaVacinacao | null;
  necessitaAtestadoDeclaracao: RespostaSimNao | "";
  permiteDeclararMaisAnimais: RespostaSimNao | "";
  especies: EspecieEtapaVacinacao[];
  tiposVacinacao: TipoVacinacaoEtapa[];
  situacao: SituacaoEtapaVacinacao | "";
}

interface EtapaVacinacaoFormProps {
  value: EtapaVacinacaoFormValue;
  onChange: (value: EtapaVacinacaoFormValue) => void;
  onVisualizarDoenca?: (doenca: DoencaEtapaVacinacao) => void;
  mode: EtapaVacinacaoFormMode;
  errors?: string[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white shadow-sm">
      <h2 className="border-b border-gray-100 px-6 py-4 text-base font-semibold text-gray-800">{title}</h2>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function atualizarTipo(
  tipos: TipoVacinacaoEtapa[],
  uid: string,
  patch: Partial<TipoVacinacaoEtapa>,
) {
  return tipos.map((tipo) => tipo.uid === uid ? { ...tipo, ...patch } : tipo);
}

function normalizarFaixasPorEspecies(
  tipo: TipoVacinacaoEtapa,
  especies: EspecieEtapaVacinacao[],
) {
  return especies.map((item) =>
    tipo.faixasPorEspecie.find((faixa) => faixa.especieId === item.id)
      ?? novaFaixaEspecie(item.id),
  );
}

function obterSexosSelecionados(faixa: FaixasEspecieEtapa): SexoVacinacaoObrigatoria[] {
  if (faixa.sexos) return faixa.sexos;
  const sexos: SexoVacinacaoObrigatoria[] = [];
  if (faixa.macho.length) sexos.push("Macho");
  if (faixa.femea.length) sexos.push("Fêmea");
  return sexos;
}

function obterFaixasSelecionadas(faixa: FaixasEspecieEtapa) {
  if (faixa.faixasEtarias) return faixa.faixasEtarias;
  return [...new Set([...faixa.macho, ...faixa.femea, ...faixa.unico])];
}

export function validarEtapaVacinacaoForm(value: EtapaVacinacaoFormValue) {
  const erros: string[] = [];
  if (!value.dataInicio) erros.push("Informe a Data do Início.");
  if (!value.dataFim) erros.push("Informe a Data do Fim.");
  if (value.dataInicio && value.dataFim && value.dataFim <= value.dataInicio) erros.push("A Data do Fim deve ser posterior à Data do Início.");
  if (!value.doenca) erros.push("Selecione uma doença.");
  if (!value.necessitaAtestadoDeclaracao) erros.push("Informe se necessita de atestado na declaração.");
  if (!value.permiteDeclararMaisAnimais) erros.push("Informe se permite declarar mais animais do que o presente no rebanho.");
  if (!value.especies.length) erros.push("Selecione ao menos uma espécie.");
  if (!value.tiposVacinacao.length) erros.push("Adicione ao menos um tipo de vacinação.");

  value.tiposVacinacao.forEach((tipo, index) => {
    const prefixo = `Tipo de vacinação ${index + 1}`;
    if (!tipo.nome.trim()) erros.push(`${prefixo}: informe o nome.`);
    if (tipo.nome.length > 255) erros.push(`${prefixo}: o nome deve ter no máximo 255 caracteres.`);
    if (tipo.instrucoes.length > 500) erros.push(`${prefixo}: as instruções devem ter no máximo 500 caracteres.`);
    if (!tipo.vacinasAplicaveis.length) erros.push(`${prefixo}: selecione ao menos uma vacina aplicável.`);
    value.especies.forEach((item) => {
      const faixa = tipo.faixasPorEspecie.find((selecionada) => selecionada.especieId === item.id);
      if (!faixa) {
        erros.push(`${prefixo}: selecione as faixas etárias de ${item.nome}.`);
      } else if (item.sexoDefinido && !obterSexosSelecionados(faixa).length) {
        erros.push(`${prefixo}: selecione ao menos um sexo de vacinação obrigatória de ${item.nome}.`);
      } else if (!obterFaixasSelecionadas(faixa).length) {
        erros.push(`${prefixo}: selecione as faixas etárias de ${item.nome}.`);
      }
    });
  });
  return erros;
}

export function etapaParaForm(etapa?: Partial<EtapaVacinacao> | null): EtapaVacinacaoFormValue {
  return {
    codigo: etapa?.codigo ?? "",
    dataInicio: etapa?.dataInicio ?? "",
    dataFim: etapa?.dataFim ?? "",
    doenca: etapa?.doenca ?? null,
    necessitaAtestadoDeclaracao: etapa?.necessitaAtestadoDeclaracao ?? "",
    permiteDeclararMaisAnimais: etapa?.permiteDeclararMaisAnimais ?? "",
    especies: etapa?.especies ?? [],
    tiposVacinacao: etapa?.tiposVacinacao?.length ? etapa.tiposVacinacao : [novoTipoVacinacao()],
    situacao: etapa?.situacao ?? "",
  };
}

export function EtapaVacinacaoForm({ value, onChange, onVisualizarDoenca, mode, errors = [] }: EtapaVacinacaoFormProps) {
  const [especiesAberto, setEspeciesAberto] = useState(false);
  const [vacinasTipoUid, setVacinasTipoUid] = useState<string | null>(null);
  const somenteLeitura = mode === "view";
  const etapaAberta = mode === "edit" && value.situacao === "Aberta";
  const etapaFinalizada = value.situacao === "Finalizada";
  const bloqueioGeral = somenteLeitura || etapaAberta || etapaFinalizada;
  const especiesDisponiveis = ESPECIES_ETAPA_MOCK.filter((item) => value.doenca?.especiesIds.includes(item.id));
  const tipoVacinaAberto = value.tiposVacinacao.find((tipo) => tipo.uid === vacinasTipoUid);
  const vacinasDisponiveis = (value.doenca?.tiposVacina ?? []).map((nome, index) => ({ id: `${value.doenca?.id}-${index}`, nome }));

  const setValue = (patch: Partial<EtapaVacinacaoFormValue>) => onChange({ ...value, ...patch });
  const alterarTipo = (uid: string, patch: Partial<TipoVacinacaoEtapa>) => setValue({ tiposVacinacao: atualizarTipo(value.tiposVacinacao, uid, patch) });

  return (
    <div className="flex flex-col gap-4">
      {errors.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-700">Revise os campos obrigatórios:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
            {errors.map((erro) => <li key={erro}>{erro}</li>)}
          </ul>
        </div>
      )}

      <Section title="Informações básicas">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FloatInput label="Código" value={value.codigo || "Gerado ao salvar"} disabled />
            <FloatInput label="Data do Início" required type="date" value={value.dataInicio} icon={<Calendar size={18} color={GREEN} />} onChange={(dataInicio) => setValue({ dataInicio })} disabled={bloqueioGeral} />
            <FloatInput label="Data do Fim" required type="date" value={value.dataFim} icon={<Calendar size={18} color={GREEN} />} onChange={(dataFim) => setValue({ dataFim })} disabled={somenteLeitura || etapaFinalizada} min={value.dataInicio || undefined} />
          </div>
          <DoencaInput
            required
            apenasVacinaveis
            disabled={bloqueioGeral}
            data={DOENCAS_ETAPA_MOCK}
            value={value.doenca?.nome ?? ""}
            onEyeClick={() => value.doenca && onVisualizarDoenca?.(value.doenca)}
            onChange={(doenca: DoencaEtapaVacinacao) => setValue({
              doenca,
              especies: [],
              tiposVacinacao: value.tiposVacinacao.map((tipo) => ({ ...tipo, faixasPorEspecie: [], vacinasAplicaveis: [] })),
            })}
          />
        </div>
      </Section>

      <Section title="Informações complementares">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatSelect
            label="Necessita de atestado na declaração?"
            required
            value={value.necessitaAtestadoDeclaracao}
            onChange={(necessitaAtestadoDeclaracao) => setValue({ necessitaAtestadoDeclaracao: necessitaAtestadoDeclaracao as RespostaSimNao })}
            options={[{ value: "Sim", label: "Sim" }, { value: "Não", label: "Não" }]}
            disabled={bloqueioGeral}
          />
          <FloatSelect
            label="Permite declarar mais animais do que presente no rebanho?"
            required
            value={value.permiteDeclararMaisAnimais}
            onChange={(permiteDeclararMaisAnimais) => setValue({ permiteDeclararMaisAnimais: permiteDeclararMaisAnimais as RespostaSimNao })}
            options={[{ value: "Sim", label: "Sim" }, { value: "Não", label: "Não" }]}
            disabled={bloqueioGeral}
          />
        </div>
      </Section>

      {value.doenca && (
        <Section title="Espécies da etapa">
          <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-700">Espécies suscetíveis <span className="text-red-500">*</span></p>
                {!bloqueioGeral && (
                  <button type="button" onClick={() => setEspeciesAberto(true)} className="flex items-center gap-2 rounded-md border border-[#1A7A3C] px-4 py-2.5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50">
                    <PlusCircle size={16} /> Selecionar Espécies
                  </button>
                )}
              </div>
              <div className={bloqueioGeral ? "pointer-events-none" : ""}>
                <SelectedChipsContainer
                  title="Espécies selecionadas"
                  items={value.especies.map((item) => ({ id: item.id, label: item.nome }))}
                  emptyText="Nenhuma espécie selecionada."
                  onRemoveItem={(id) => {
                    const especies = value.especies.filter((item) => item.id !== id);
                    setValue({
                      especies,
                      tiposVacinacao: value.tiposVacinacao.map((tipo) => ({ ...tipo, faixasPorEspecie: normalizarFaixasPorEspecies(tipo, especies) })),
                    });
                  }}
                />
              </div>
          </div>
        </Section>
      )}

      <Section title="Tipos de vacinação">
        <DynamicListWrapper
          items={value.tiposVacinacao}
          behavior="at-least-one"
          itemLabel="Tipo de vacinação"
          addButtonLabel="Adicionar Tipo de Vacinação"
          disabled={bloqueioGeral}
          onAddItem={() => setValue({ tiposVacinacao: [...value.tiposVacinacao, novoTipoVacinacao()] })}
          onRemoveItem={(index) => setValue({ tiposVacinacao: value.tiposVacinacao.filter((_, posicao) => posicao !== index) })}
          renderHeaderBadge={(tipo) => tipo.nome ? <span className="text-xs text-gray-500">{tipo.nome}</span> : null}
        >
          {(tipo: TipoVacinacaoEtapa) => (
            <div className="flex flex-col gap-5">
              <FloatInput label="Nome" required maxLength={255} value={tipo.nome} onChange={(nome) => alterarTipo(tipo.uid, { nome })} disabled={bloqueioGeral} />
              <LargeTextArea label="Instruções" maxLength={500} rows={3} value={tipo.instrucoes} onChange={(instrucoes) => alterarTipo(tipo.uid, { instrucoes })} disabled={bloqueioGeral} />

              <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-gray-700">Dados da vacinação obrigatória por espécie <span className="text-red-500">*</span></p>
                {!value.especies.length && <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">Selecione as espécies antes de configurar os dados da vacinação obrigatória.</p>}
                {value.especies.map((item) => {
                  const faixa = tipo.faixasPorEspecie.find((selecionada) => selecionada.especieId === item.id) ?? novaFaixaEspecie(item.id);
                  const options = item.faixasEtarias.map((nome) => ({ id: nome, label: nome }));
                  const sexosSelecionados = obterSexosSelecionados(faixa);
                  const faixasSelecionadas = obterFaixasSelecionadas(faixa);
                  const alterarFaixa = (patch: Partial<typeof faixa>) => alterarTipo(tipo.uid, {
                    faixasPorEspecie: [
                      ...tipo.faixasPorEspecie.filter((selecionada) => selecionada.especieId !== item.id),
                      { ...faixa, ...patch },
                    ],
                  });
                  return (
                    <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1A7A3C]"><Dna size={16} /> {item.nome}</p>
                      <div className={`grid grid-cols-1 gap-6 ${item.sexoDefinido ? "md:grid-cols-2" : ""}`}>
                        <CheckboxGroup
                          key={`${tipo.uid}-${item.id}-faixas-${faixasSelecionadas.join("|")}`}
                          title="Faixa etária de vacinação obrigatória"
                          required
                          options={options}
                          defaultValue={faixasSelecionadas}
                          onChange={(faixasEtarias) => alterarFaixa({
                            sexos: sexosSelecionados,
                            faixasEtarias,
                            macho: sexosSelecionados.includes("Macho") ? faixasEtarias : [],
                            femea: sexosSelecionados.includes("Fêmea") ? faixasEtarias : [],
                            unico: item.sexoDefinido ? [] : faixasEtarias,
                          })}
                          disabled={bloqueioGeral}
                          orientation="vertical"
                        />
                        {item.sexoDefinido && (
                          <CheckboxGroup
                            key={`${tipo.uid}-${item.id}-sexos-${sexosSelecionados.join("|")}`}
                            title="Sexo de vacinação obrigatória"
                            required
                            options={[{ id: "Macho", label: "Macho" }, { id: "Fêmea", label: "Fêmea" }]}
                            defaultValue={sexosSelecionados}
                            onChange={(sexos) => {
                              const selecionados = sexos as SexoVacinacaoObrigatoria[];
                              alterarFaixa({
                                sexos: selecionados,
                                faixasEtarias: faixasSelecionadas,
                                macho: selecionados.includes("Macho") ? faixasSelecionadas : [],
                                femea: selecionados.includes("Fêmea") ? faixasSelecionadas : [],
                                unico: [],
                              });
                            }}
                            disabled={bloqueioGeral}
                            orientation="vertical"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-700">Tipos de vacina aplicáveis <span className="text-red-500">*</span></p>
                  {!bloqueioGeral && value.doenca && (
                    <button type="button" onClick={() => setVacinasTipoUid(tipo.uid)} className="flex items-center gap-2 rounded-md border border-[#1A7A3C] px-4 py-2 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50">
                      <Syringe size={16} /> Selecionar Vacinas
                    </button>
                  )}
                </div>
                <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-3">
                  {tipo.vacinasAplicaveis.length ? tipo.vacinasAplicaveis.map((nome) => <span key={nome} className="rounded-md bg-[#E6F4EA] px-3 py-1.5 text-xs font-semibold text-[#1A7A3C]">{nome}</span>) : <span className="text-xs italic text-gray-400">Nenhuma vacina selecionada.</span>}
                </div>
              </div>
            </div>
          )}
        </DynamicListWrapper>
      </Section>

      {mode !== "create" && (
        <Section title="Situação do cadastro">
          <div className="max-w-md">
            <FloatSelect label="Situação" value={value.situacao} onChange={() => {}} options={["Criada", "Aberta", "Finalizada"].map((item) => ({ value: item, label: item }))} disabled />
          </div>
        </Section>
      )}

      <MultiSearchModal
        open={especiesAberto}
        onClose={() => setEspeciesAberto(false)}
        title="Buscar Espécies"
        subtitle={`Selecione as espécies suscetíveis a ${value.doenca?.nome ?? "esta doença"}:`}
        icon={<Dna size={20} className="text-[#1A7A3C]" />}
        data={especiesDisponiveis}
        columns={[{ label: "Código", key: "codigo" }, { label: "Espécie", key: "nome" }]}
        searchKeys={["codigo", "nome"]}
        searchPlaceholder="Busque pelo código ou nome da espécie."
        selectedItems={value.especies}
        showResultsOnOpen
        onConfirm={(especies) => setValue({
          especies,
          tiposVacinacao: value.tiposVacinacao.map((tipo) => ({ ...tipo, faixasPorEspecie: normalizarFaixasPorEspecies(tipo, especies) })),
        })}
      />

      <MultiSearchModal
        open={Boolean(vacinasTipoUid)}
        onClose={() => setVacinasTipoUid(null)}
        title="Selecionar Tipos de Vacina"
        subtitle={`Selecione as vacinas aplicáveis a ${value.doenca?.nome ?? "esta doença"}:`}
        icon={<Syringe size={20} className="text-[#1A7A3C]" />}
        data={vacinasDisponiveis}
        columns={[{ label: "Tipo de vacina", key: "nome" }]}
        searchKeys={["nome"]}
        searchPlaceholder="Busque pelo tipo de vacina."
        selectedItems={vacinasDisponiveis.filter((item) => tipoVacinaAberto?.vacinasAplicaveis.includes(item.nome))}
        showResultsOnOpen
        onConfirm={(selecionadas) => {
          if (vacinasTipoUid) alterarTipo(vacinasTipoUid, { vacinasAplicaveis: selecionadas.map((item) => item.nome) });
          setVacinasTipoUid(null);
        }}
      />
    </div>
  );
}
