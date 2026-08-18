import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CalendarArrowUpIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Dna,
  Download,
  Eye,
  Info,
  PlusCircle,
  Store,
  Trash2,
  User,
  Warehouse,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  ATIVIDADES_COMERCIAIS,
  ATIVIDADES_NAO_COMERCIAIS,
  calcularIsencaoBruceloseSomenteLeitura,
  calcularSituacaoAutomatica,
  criarEventoPecuarioInicial,
  ESPECIES_EVENTO_MOCK,
  ESTABELECIMENTOS_AUXILIARES_MOCK,
  gerarCodigoEvento,
  isencaoBruceloseEditavel,
  obterAlertasEventoPecuario,
  possuiEspecieBovideos,
  PROMOTORAS_EVENTO_MOCK,
  RECINTOS_EVENTO_MOCK,
  RESPONSAVEIS_EVENTO_MOCK,
  TIPOS_EVENTO,
  TIPOS_LEILAO,
  validarEventoPecuario,
  type AnexoEvento,
  type EspecieEvento,
  type EstabelecimentoAuxiliar,
  type EventoPecuarioRegistro,
  type PromotoraEvento,
  type RecintoEvento,
  type ResponsavelEvento,
  type SimNaoEvento,
  type SituacaoEventoPecuario,
} from "./eventoPecuarioData";

const GREEN = "#1A7A3C";
const uid = (prefixo: string) =>
  `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export type EventoPecuarioMode = "create" | "edit" | "view";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  mode?: EventoPecuarioMode;
  dados?: any;
  data?: any;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        data-view-action
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left rounded-xl hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="evento-form-fields px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
  comDivisor = false,
}: {
  titulo: React.ReactNode;
  children: React.ReactNode;
  comDivisor?: boolean;
}) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

function BotaoVer({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      data-view-action
      onClick={onClick}
      title={title}
      aria-label={title}
      className="h-12 p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition flex items-center justify-center"
    >
      <Eye size={19} />
    </button>
  );
}

function agoraFormatado() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date()).replace(",", "");
}

export function AdicionarEventoPecuarioPage({
  onLogout,
  onNavigate,
  mode = "create",
  dados,
  data,
}: PageProps) {
  const origem = dados ?? data ?? {};
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const mainRef = useRef<HTMLElement>(null);
  const inicial = useMemo(
    () => criarEventoPecuarioInicial(origem, mode !== "create"),
    [],
  );

  const [codigo] = useState(inicial.codigo || gerarCodigoEvento());
  const [nomeEvento, setNomeEvento] = useState(inicial.nomeEvento);
  const [periodoDe, setPeriodoDe] = useState(inicial.periodoDe);
  const [periodoAte, setPeriodoAte] = useState(inicial.periodoAte);
  const [especies, setEspecies] = useState<Array<{ uid: string; especie: EspecieEvento | null }>>(
    inicial.especies.length
      ? inicial.especies.map((especie, index) => ({ uid: `esp-${especie.id ?? index}`, especie }))
      : [{ uid: uid("esp"), especie: null }],
  );
  const [tipoEvento, setTipoEvento] = useState(inicial.tipoEventoPecuario);
  const [atividadeEvento, setAtividadeEvento] = useState(inicial.atividadeEvento);
  const [tipoLeilao, setTipoLeilao] = useState(inicial.tipoLeilao);
  const [isencaoBrucelose, setIsencaoBrucelose] = useState<SimNaoEvento | "">(inicial.isencaoBrucelose);
  const [promotora, setPromotora] = useState<PromotoraEvento | null>(inicial.promotora);
  const [recinto, setRecinto] = useState<RecintoEvento | null>(inicial.recinto);
  const [possuiAuxilio, setPossuiAuxilio] = useState<SimNaoEvento>(inicial.possuiAuxilioEstabelecimento);
  const [estabelecimentoAuxiliar, setEstabelecimentoAuxiliar] = useState<EstabelecimentoAuxiliar | null>(
    inicial.estabelecimentoAgropecuario,
  );
  const [responsaveis, setResponsaveis] = useState<Array<{ uid: string; responsavel: ResponsavelEvento | null }>>(
    inicial.responsaveisTecnicos.map((responsavel, index) => ({
      uid: `rt-${responsavel.id ?? index}`,
      responsavel,
    })),
  );
  const [anexos, setAnexos] = useState<AnexoEvento[]>(inicial.anexos);
  const [observacoes, setObservacoes] = useState(inicial.observacoes);
  const [situacao, setSituacao] = useState<SituacaoEventoPecuario>(inicial.situacao);
  const [erros, setErros] = useState<string[]>([]);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [confirmarEdicao, setConfirmarEdicao] = useState(false);

  const especiesSelecionadas = especies
    .map((item) => item.especie)
    .filter((item): item is EspecieEvento => Boolean(item));
  const responsaveisSelecionados = responsaveis
    .map((item) => item.responsavel)
    .filter((item): item is ResponsavelEvento => Boolean(item));
  const isencaoEditavel = isencaoBruceloseEditavel(atividadeEvento);
  const isencaoCalculada = calcularIsencaoBruceloseSomenteLeitura(atividadeEvento, tipoLeilao);
  const exibeTipoLeilao = atividadeEvento === "Leilão" && possuiEspecieBovideos(especiesSelecionadas);
  const atividades = tipoEvento === "Com finalidade comercial"
    ? ATIVIDADES_COMERCIAIS
    : tipoEvento === "Sem finalidade comercial"
      ? ATIVIDADES_NAO_COMERCIAIS
      : [];
  const situacaoEfetiva = calcularSituacaoAutomatica(
    periodoAte,
    situacao,
    Boolean(origem?.possuiPendencias),
  );

  const registroAtual: EventoPecuarioRegistro = {
    ...inicial,
    ...origem,
    codigo,
    nomeEvento,
    periodoDe,
    periodoAte,
    especies: especiesSelecionadas,
    tipoEventoPecuario: tipoEvento,
    atividadeEvento,
    tipoLeilao: exibeTipoLeilao ? tipoLeilao : "",
    isencaoBrucelose: (isencaoEditavel ? isencaoBrucelose : isencaoCalculada) as SimNaoEvento,
    promotora,
    recinto,
    possuiAuxilioEstabelecimento: possuiAuxilio,
    estabelecimentoAgropecuario: possuiAuxilio === "Sim" ? estabelecimentoAuxiliar : null,
    responsaveisTecnicos: responsaveisSelecionados,
    anexos,
    observacoes,
    situacao: situacaoEfetiva,
    usuarioUltimaAlteracao: inicial.usuarioUltimaAlteracao || "Usuário atual",
    dataUltimaModificacao: inicial.dataUltimaModificacao || agoraFormatado(),
  };
  const alertasNegocio = obterAlertasEventoPecuario(registroAtual);

  useEffect(() => {
    if (!isView || !mainRef.current) return;
    const container = mainRef.current;
    const desabilitar = () => {
      container
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>(
          ".evento-form-fields input, .evento-form-fields textarea, .evento-form-fields select, .evento-form-fields button:not([data-view-action])",
        )
        .forEach((controle) => {
          controle.disabled = true;
        });
    };
    desabilitar();
    const observer = new MutationObserver(desabilitar);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isView]);

  const alterarTipoEvento = (valor: string) => {
    setTipoEvento(valor);
    setAtividadeEvento("");
    setTipoLeilao("");
    setIsencaoBrucelose("");
  };

  const alterarAtividade = (valor: string) => {
    setAtividadeEvento(valor);
    if (valor !== "Leilão") setTipoLeilao("");
    setIsencaoBrucelose(isencaoBruceloseEditavel(valor) ? "" : "Não");
  };

  const validarEContinuar = () => {
    if (mode === "create") {
      setErros([]);
      setMostrarSucesso(true);
      return;
    }

    const errosEncontrados = validarEventoPecuario(registroAtual, isEdit);
    setErros(errosEncontrados);
    if (errosEncontrados.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (isEdit) setConfirmarEdicao(true);
    else setMostrarSucesso(true);
  };

  const registroSalvo = () => ({
    ...registroAtual,
    codigo: codigo || gerarCodigoEvento(),
    usuarioUltimaAlteracao: "Usuário atual",
    dataUltimaModificacao: agoraFormatado(),
  });

  const titulo = isView
    ? "Visualizar Evento Pecuário"
    : isEdit
      ? "Editar Evento Pecuário"
      : "Adicionar Evento Pecuário";

  return (
    <div className={`min-h-screen bg-[#f2f3f5] ${isView ? "evento-pecuario-view" : ""}`}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="evento-pecuario" hideSearch />

      <main ref={mainRef} className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            data-view-action
            onClick={() => isEdit
              ? onNavigate("visualizar-evento-pecuario", registroAtual)
              : onNavigate("evento-pecuario")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            {isEdit ? "Visualizar Evento Pecuário" : "Todos os Eventos Pecuários"}
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
            {isView ? (
              <button
                type="button"
                data-view-action
                onClick={() => onNavigate("editar-evento-pecuario", registroAtual)}
                className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={validarEContinuar}
                className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                {isEdit ? "Salvar" : "Adicionar"}
              </button>
            )}
          </div>
        </div>

        {!isView && (
          <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
            <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
            </p>
          </div>
        )}



        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            {mode !== "create" && (
              <FloatInput label="Código do Evento" value={codigo} onChange={() => { }} disabled />
            )}
            <FloatInput
              label="Nome do Evento"
              required
              value={nomeEvento}
              onChange={setNomeEvento}
              maxLength={255}
            />
            <SubGrupo titulo="Período do Evento" comDivisor>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatInput
                  label="Período - De"
                  type="date"
                  value={periodoDe}
                  onChange={setPeriodoDe}
                  icon={<Calendar size={18} />}
                  required
                />
                <FloatInput
                  label="Período - Até"
                  type="date"
                  value={periodoAte}
                  onChange={setPeriodoAte}
                  icon={<Calendar size={18} />}
                  required
                />
              </div>
            </SubGrupo>
          </div>
        </Section>

        <Section title="Informações Complementares">
          <div className="flex flex-col gap-5">
            <SubGrupo titulo="Espécies do Evento">
              <DynamicListWrapper
                items={especies}
                behavior="at-least-one"
                addButtonLabel="Adicionar Espécie"
                itemLabel="Espécie"
                onAddItem={() => setEspecies((atuais) => [...atuais, { uid: uid("esp"), especie: null }])}
                onRemoveItem={(index) => setEspecies((atuais) => atuais.filter((_, i) => i !== index))}
                variant="plain"
                showCounter
                smallCounter
                disabled={isView}
              >
                {(item, index) => (
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <EntitySearchInput
                        label="Espécie"
                        placeholder="Buscar por nome ou grupo da espécie"
                        value={item.especie?.nome ?? ""}
                        data={ESPECIES_EVENTO_MOCK}
                        searchKeys={["nome", "grupo"]}
                        columns={[{ label: "Nome da Espécie", key: "nome" }, { label: "Grupo da Espécie", key: "grupo" }]}
                        icon={<Dna size={18} color={GREEN} />}
                        title="Buscar Espécie"
                        subtitle="Busque por nome ou grupo da espécie:"
                        onChange={(entidade) => setEspecies((atuais) =>
                          atuais.map((atual, i) => i === index ? { ...atual, especie: entidade } : atual))}
                        required
                      />
                    </div>
                    {item.especie && (
                      <BotaoVer
                        title="Visualizar espécie"
                        onClick={() => onNavigate("visualizar-especie", item.especie)}
                      />
                    )}
                  </div>
                )}
              </DynamicListWrapper>
            </SubGrupo>

            <SubGrupo titulo="Caracterização do Evento" comDivisor>
              <FloatSelect
                label="Tipo de Evento Pecuário"
                value={tipoEvento}
                onChange={alterarTipoEvento}
                options={TIPOS_EVENTO}
                required
              />
              {tipoEvento && (
                <FloatSelect
                  label="Atividade do Evento"
                  value={atividadeEvento}
                  onChange={alterarAtividade}
                  options={atividades}
                  required
                />
              )}
              {exibeTipoLeilao && (
                <FloatSelect
                  label="Tipo de Leilão"
                  value={tipoLeilao}
                  onChange={setTipoLeilao}
                  options={TIPOS_LEILAO}
                  required
                />
              )}
              {atividadeEvento && (
                <SimNao
                  label="Possui isenção de exame de brucelose/tuberculose?"
                  name={`isencao-brucelose-${mode}`}
                  value={isencaoEditavel ? isencaoBrucelose : isencaoCalculada}
                  onChange={(valor) => setIsencaoBrucelose(valor ? "Sim" : "Não")}
                  disabled={!isencaoEditavel}
                  required
                />
              )}
            </SubGrupo>
          </div>
        </Section>

        <Section title="Promotora do Evento">
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <EntitySearchInput
                  label="Promotora de Eventos Pecuários"
                  placeholder="Buscar por nome, registro, proprietário ou CNPJ"
                  value={promotora?.nome ?? ""}
                  data={PROMOTORAS_EVENTO_MOCK}
                  searchKeys={["nome", "numeroRegistro", "nomeFantasiaProprietario", "cnpjProprietario"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "Número de Registro", key: "numeroRegistro" },
                    { label: "Proprietário", key: "nomeFantasiaProprietario" },
                    { label: "CNPJ", key: "cnpjProprietario" },
                  ]}
                  icon={<CalendarArrowUpIcon size={18} color={GREEN} />}
                  title="Buscar Promotora de Eventos Pecuários"
                  subtitle="Busque por nome, número de registro ou dados do proprietário:"
                  onChange={setPromotora}
                  required
                />
              </div>
              {promotora && (
                <BotaoVer
                  title="Visualizar promotora"
                  onClick={() => onNavigate("visualizar-promotora-eventos", promotora)}
                />
              )}
            </div>
            {promotora && (
              <FloatInput
                label="Número de Registro da Promotora de Eventos"
                value={promotora.numeroRegistro ?? ""}
                onChange={() => { }}
                disabled
                required
              />
            )}
          </div>
        </Section>

        <Section title="Estabelecimento/Recinto do Evento">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <EntitySearchInput
                label="Estabelecimento/Recinto de Eventos Pecuários"
                placeholder="Buscar por nome ou dados do proprietário"
                value={recinto?.nome ?? ""}
                data={RECINTOS_EVENTO_MOCK}
                searchKeys={["nome", "proprietario", "documentoProprietario"]}
                columns={[
                  { label: "Estabelecimento/Recinto", key: "nome" },
                  { label: "Proprietário", key: "proprietario" },
                  { label: "CPF/CNPJ", key: "documentoProprietario" },
                ]}
                icon={<Store size={18} color={GREEN} />}
                title="Buscar Estabelecimento/Recinto de Eventos Pecuários"
                subtitle="Busque por nome do recinto ou dados do proprietário:"
                onChange={setRecinto}
                required
              />
            </div>
            {recinto && (
              <BotaoVer
                title="Visualizar estabelecimento/recinto"
                onClick={() => onNavigate("estabelecimento-evento-pecuario", recinto)}
              />
            )}
          </div>
        </Section>

        <Section title="Estabelecimento Agropecuário">
          <div className="flex flex-col gap-5">
            <SimNao
              label="Possui auxílio de um Estabelecimento Agropecuário próximo para o alojamento de animais?"
              name={`possui-auxilio-${mode}`}
              value={possuiAuxilio}
              onChange={(valor) => {
                setPossuiAuxilio(valor ? "Sim" : "Não");
                if (!valor) setEstabelecimentoAuxiliar(null);
              }}
              required
            />
            {possuiAuxilio === "Sim" && (
              <>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <EntitySearchInput
                      label="Estabelecimento Agropecuário"
                      placeholder="Buscar por nome, código, município ou proprietário"
                      value={estabelecimentoAuxiliar?.nome ?? ""}
                      data={ESTABELECIMENTOS_AUXILIARES_MOCK}
                      searchKeys={["nome", "codigo", "municipio", "proprietario"]}
                      columns={[
                        { label: "Nome", key: "nome" },
                        { label: "Código", key: "codigo" },
                        { label: "Município", key: "municipio" },
                        { label: "Proprietário", key: "proprietario" },
                      ]}
                      icon={<Warehouse size={18} color={GREEN} />}
                      title="Buscar Estabelecimento Agropecuário"
                      subtitle="Busque pelo nome, código, município ou proprietário:"
                      onChange={setEstabelecimentoAuxiliar}
                      required
                    />
                  </div>
                  {estabelecimentoAuxiliar && (
                    <BotaoVer
                      title="Visualizar estabelecimento agropecuário"
                      onClick={() => onNavigate("visualizar-estabelecimento-agropecuario", estabelecimentoAuxiliar)}
                    />
                  )}
                </div>
                {estabelecimentoAuxiliar && (
                  <FloatInput
                    label="Código do Estabelecimento Agropecuário"
                    value={estabelecimentoAuxiliar.codigo}
                    onChange={() => { }}
                    disabled
                    required
                  />
                )}
              </>
            )}
          </div>
        </Section>

        <Section title="Responsável Técnico (Um ou mais)">
          <DynamicListWrapper
            items={responsaveis}
            behavior="zero-or-more"
            addButtonLabel="Adicionar Responsável Técnico"
            itemLabel="Responsável Técnico"
            onAddItem={() => setResponsaveis((atuais) => [...atuais, { uid: uid("rt"), responsavel: null }])}
            onRemoveItem={(index) => setResponsaveis((atuais) => atuais.filter((_, i) => i !== index))}
            variant="plain"
            showCounter
            smallCounter
            disabled={isView}
          >
            {(item, index) => (
              <div className="flex flex-col gap-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <EntitySearchInput
                      label="Responsável Técnico"
                      placeholder="Buscar por nome ou CPF"
                      value={item.responsavel?.nome ?? ""}
                      data={RESPONSAVEIS_EVENTO_MOCK}
                      searchKeys={["nome", "documento"]}
                      columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]}
                      icon={<User size={18} color={GREEN} />}
                      title="Buscar Responsável Técnico"
                      subtitle="Busque por nome ou CPF do profissional:"
                      onChange={(entidade) => setResponsaveis((atuais) =>
                        atuais.map((atual, i) => i === index ? { ...atual, responsavel: entidade } : atual))}
                    />
                  </div>
                  {item.responsavel && (
                    <BotaoVer
                      title="Visualizar responsável técnico"
                      onClick={() => onNavigate("profissional-animal", item.responsavel)}
                    />
                  )}
                </div>
                {item.responsavel && (
                  <FloatInput
                    label="CPF"
                    value={item.responsavel.documento}
                    onChange={() => { }}
                    disabled
                    required
                  />
                )}
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        <Section title="Anexos (zero ou mais)">
          <div className="flex flex-col gap-6">
            {anexos.length === 0 && isView && (
              <p className="text-sm text-gray-500 italic">Nenhum anexo informado.</p>
            )}
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start w-full rounded-xl p-4 bg-white">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex gap-3 items-start">
                  <UploadField
                    label="Documento"
                    required
                    disabled={isView}
                    fileName={anexo.nome}
                    onSelectFile={() => setAnexos((atuais) => atuais.map((item, i) =>
                      i === index ? { ...item, nome: `documento_evento_${index + 1}.pdf` } : item))}
                  />
                  {anexo.nome && (
                    <>
                      <div className="flex-1">
                        <FloatInput
                          label="Descrição"
                          value={anexo.descricao}
                          disabled={isView}
                          maxLength={255}
                          onChange={(valor) => setAnexos((atuais) => atuais.map((item, i) =>
                            i === index ? { ...item, descricao: valor.slice(0, 255) } : item))}
                        />
                      </div>
                      <button
                        type="button"
                        data-view-action
                        onClick={() => window.alert(`Download de ${anexo.nome}`)}
                        title={`Baixar ${anexo.nome}`}
                        className="h-12 p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    </>
                  )}
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => setAnexos((atuais) => atuais.filter((_, i) => i !== index))}
                      title="Remover anexo"
                      className="h-12 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!isView && (
              <button
                type="button"
                onClick={() => setAnexos((atuais) => [...atuais, { id: uid("anexo"), nome: "", descricao: "" }])}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
              >
                <PlusCircle size={16} /> Adicionar Anexo
              </button>
            )}
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacoes}
            onChange={setObservacoes}
            maxLength={1500}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>


      </main>

      {mostrarSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Evento pecuário cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">O evento "{nomeEvento}" foi cadastrado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setMostrarSucesso(false);
                  onNavigate("evento-pecuario");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setMostrarSucesso(false);
                  onNavigate("visualizar-evento-pecuario", registroSalvo());
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmarEdicao && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Confirmar alterações?</h3>
            <p className="text-sm text-gray-500 mt-1">Revise os dados antes de salvar a edição do evento.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setConfirmarEdicao(false)}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setConfirmarEdicao(false);
                  onNavigate("visualizar-evento-pecuario", registroSalvo());
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export {
  ESPECIES_EVENTO_MOCK,
  PROMOTORAS_EVENTO_MOCK,
  RECINTOS_EVENTO_MOCK,
  RESPONSAVEIS_EVENTO_MOCK,
  TIPOS_EVENTO,
};
