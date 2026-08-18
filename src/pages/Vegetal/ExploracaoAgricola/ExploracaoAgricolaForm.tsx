import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronDown, ChevronUp, FileText, Info, Link2, MapPin, MoreVertical, ShieldCheck, UserRound } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { AccordionCardGroup, CustomRadio, FloatInput, FloatSelect, LargeTextArea, Tabs, UploadField } from "../../../components/ui/FormKit";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import { listarRegistrosMock, salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";
import * as Icons from "../../../imports/icons";
import { EntityProfessionalsTab } from "../../../components/ui/EntityProfessionals";
import {
  COLECAO_EXPLORACOES_AGRICOLAS, ESTABELECIMENTOS_AGRICOLAS_MOCK, EXPLORACOES_AGRICOLAS_MOCK,
  PRODUTORES_AGRICOLAS_MOCK, RESPONSAVEIS_TECNICOS_MOCK, VARIEDADES_CULTURA_MOCK,
  adicionarUmAno, chaveHistoricoExploracaoAgricola, formatarData, formatarDecimal, parseDecimal,
  type AnexoExploracao, type ExploracaoAgricola, type ManutencaoExploracaoAgricola, type ProdutorAgricola, type ResponsavelTecnico,
} from "./exploracaoAgricolaData";

const GREEN = "#1A7A3C";
const HOJE = new Date().toISOString().slice(0, 10);
type Mode = "create" | "view" | "edit";
type ProdutorItem = { uid: string; produtor: ProdutorAgricola | null };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="rounded-xl bg-white shadow-sm"><button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-6 py-4 text-left"><span className="font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>{open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}</section>;
}

function SimNao({ label, name, value, onChange, disabled = false }: { label: string; name: string; value: string; onChange: (value: "Sim" | "Não") => void; disabled?: boolean }) {
  return <div className={disabled ? "pointer-events-none opacity-75" : ""}><p className="mb-2 text-sm font-medium text-gray-700">{label}<span className="ml-0.5 text-red-500">*</span></p><div className="flex gap-6"><CustomRadio label="Sim" name={name} value="Sim" checked={value === "Sim"} onChange={() => onChange("Sim")} /><CustomRadio label="Não" name={name} value="Não" checked={value === "Não"} onChange={() => onChange("Não")} /></div></div>;
}

function CardManutencao({ item, onVisualizar }: { item: ManutencaoExploracaoAgricola; onVisualizar: () => void }) {
  return <article className="relative flex w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
    <div className="h-1 bg-[#008446]" />
    <div className="flex items-start justify-between px-3 pt-2 text-[10px] leading-tight text-gray-500">
      <span>Data de cadastro<br />{formatarData(item.dataCadastro)}</span>
      <span className="rounded-full border border-[#008446] px-1.5 py-0.5 text-[10px] font-medium text-[#008446]">{item.situacao}</span>
    </div>
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="flex items-center gap-3"><CalendarDays size={22} className="shrink-0 text-[#008446]" /><div><p className="text-sm font-semibold text-gray-900">{formatarData(item.dataManutencao)}</p><p className="text-[10px] text-gray-600">Data da Manutenção</p></div></div>
      <div className="flex items-center gap-3"><UserRound size={22} className="shrink-0 text-[#008446]" /><div className="min-w-0"><p className="truncate text-sm font-medium text-gray-900">{item.responsavelTecnico.nome}</p><p className="text-[10px] text-gray-600">{item.responsavelTecnico.documento}</p><p className="text-[10px] text-gray-600">Responsável Técnico</p></div></div>
    </div>
    <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3"><button type="button" onClick={onVisualizar} className="rounded-md bg-[#008446] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#006b38]">Visualizar</button><button type="button" aria-label="Mais opções da manutenção" className="rounded-md p-2 text-gray-500 hover:bg-gray-100"><MoreVertical size={20} /></button></div>
  </article>;
}

const valorInicial = (dados?: Partial<ExploracaoAgricola>): Partial<ExploracaoAgricola> => dados ?? {};

export function ExploracaoAgricolaForm({ mode, dados, onLogout, onNavigate, acaoHistorico, avisoHistorico, esconderNavbar = false, podeEditar = true, abaAtiva = "cadastro", onMudarAba }: { mode: Mode; dados?: ExploracaoAgricola; onLogout: () => void; onNavigate: (screen: any, data?: any) => void; acaoHistorico?: ReactNode; avisoHistorico?: ReactNode; esconderNavbar?: boolean; podeEditar?: boolean; abaAtiva?: string; onMudarAba?: (aba: string) => void }) {
  const inicial = valorInicial(dados);
  const somenteLeitura = mode === "view";
  const [estabelecimento, setEstabelecimento] = useState<any>(inicial.estabelecimento ?? null);
  const [unidadeArea, setUnidadeArea] = useState<"Hectares" | "Metros Quadrados">(inicial.unidadeArea ?? "Hectares");
  const [areaUtil, setAreaUtil] = useState(inicial.areaUtil ?? "");
  const [produtores, setProdutores] = useState<ProdutorItem[]>(
    inicial.produtores?.length
      ? inicial.produtores.map((produtor) => ({ uid: `produtor-${produtor.id}`, produtor }))
      : [{ uid: `produtor-${Date.now()}`, produtor: null }],
  );
  const [variedade, setVariedade] = useState<any>(inicial.variedade ?? null);
  const [unidadeMedida, setUnidadeMedida] = useState(inicial.unidadeMedida ?? "");
  const [dataPlantio, setDataPlantio] = useState(inicial.dataPlantio ?? "");
  const [localizacaoLivro, setLocalizacaoLivro] = useState(inicial.localizacaoLivro ?? "");
  const [unidadeProducao, setUnidadeProducao] = useState<"Sim" | "Não">(inicial.unidadeProducao ?? "Não");
  const [necessitaRT, setNecessitaRT] = useState<"Sim" | "Não">(inicial.necessitaResponsavelTecnico ?? "Não");
  const [responsavelTecnico, setResponsavelTecnico] = useState<any>(inicial.responsavelTecnico ?? null);
  const [latitude, setLatitude] = useState(inicial.latitude ?? "");
  const [longitude, setLongitude] = useState(inicial.longitude ?? "");
  const [anexos, setAnexos] = useState<AnexoExploracao[]>(inicial.anexos ?? []);
  const [observacao, setObservacao] = useState(inicial.observacao ?? "");
  const [situacao, setSituacao] = useState<ExploracaoAgricola["situacao"]>(inicial.situacao ?? "Ativo");
  const [manutencoes, setManutencoes] = useState<ManutencaoExploracaoAgricola[]>(inicial.manutencoes ?? []);
  const [modalManutencao, setModalManutencao] = useState<"nova" | "visualizar" | null>(null);
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState<ManutencaoExploracaoAgricola | null>(null);
  const [dataNovaManutencao, setDataNovaManutencao] = useState("");
  const [responsavelNovaManutencao, setResponsavelNovaManutencao] = useState<ResponsavelTecnico | null>(null);
  const [erroManutencao, setErroManutencao] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<ExploracaoAgricola | null>(null);
  const [addProfessionalRequestKey, setAddProfessionalRequestKey] = useState(0);

  const areaProdutivaNumero = estabelecimento ? estabelecimento.areaProdutivaHectares * (unidadeArea === "Metros Quadrados" ? 10000 : 1) : 0;
  const areaProdutiva = estabelecimento ? formatarDecimal(areaProdutivaNumero) : "";
  const dataVencimento = unidadeProducao === "Sim" ? adicionarUmAno(dataPlantio) : "";
  const rtIncompativel = Boolean(responsavelTecnico && variedade?.pragas?.some((praga: string) => !responsavelTecnico.habilitacoes.includes(praga)));
  const situacaoEfetiva = rtIncompativel ? "Suspenso" : situacao;

  const registroAtual = useMemo<ExploracaoAgricola | null>(() => {
    if (!estabelecimento || !variedade) return null;
    return {
      id: dados?.id ?? `exploracao-agricola-${Date.now()}`, codigo: dados?.codigo ?? "", estabelecimento,
      unidadeArea, areaProdutiva, areaUtil, produtores: produtores.map((item) => item.produtor).filter((item): item is ProdutorAgricola => Boolean(item)), variedade, unidadeMedida, dataPlantio, localizacaoLivro,
      unidadeProducao, dataVencimento, necessitaResponsavelTecnico: necessitaRT,
      responsavelTecnico: necessitaRT === "Sim" ? responsavelTecnico : null,
      latitude, longitude, anexos, observacao, situacao: situacaoEfetiva, manutencoes,
    };
  }, [dados, estabelecimento, unidadeArea, areaProdutiva, areaUtil, produtores, variedade, unidadeMedida, dataPlantio, localizacaoLivro, unidadeProducao, dataVencimento, necessitaRT, responsavelTecnico, latitude, longitude, anexos, observacao, situacaoEfetiva, manutencoes]);

  useEffect(() => {
    const atualizarSituacao = (event: Event) => {
      const detalhe = (event as CustomEvent<{ currentScreen: string; situacao: ExploracaoAgricola["situacao"] }>).detail;
      if (mode !== "edit" || detalhe?.currentScreen !== "exploracao-agricola" || !dados) return;
      setSituacao(detalhe.situacao);
      const atualizado = { ...dados, situacao: detalhe.situacao };
      salvarRegistroMock(COLECAO_EXPLORACOES_AGRICOLAS, atualizado);
      registrarVersaoCadastro({
        chaveCadastro: chaveHistoricoExploracaoAgricola(dados.id),
        alteradoPor: "Usuário do sistema",
        dadosAnteriores: dados,
        dadosAtuais: atualizado,
      });
    };
    window.addEventListener("situacao-cadastro-alterada", atualizarSituacao);
    return () => window.removeEventListener("situacao-cadastro-alterada", atualizarSituacao);
  }, [mode, dados]);

  const selecionarEstabelecimento = (item: any) => {
    setEstabelecimento(item);
    if (item) { setLatitude(item.latitude); setLongitude(item.longitude); }
  };

  const validarESalvar = () => {
    const novos: string[] = [];
    if (!estabelecimento) novos.push("Selecione o estabelecimento agropecuário.");
    if (!areaUtil.trim() || parseDecimal(areaUtil) <= 0) novos.push("Informe uma área útil válida.");
    if (parseDecimal(areaUtil) > areaProdutivaNumero) novos.push("A área útil deve ser menor ou igual à área produtiva do estabelecimento.");
    if (!produtores.some((item) => item.produtor)) novos.push("Adicione pelo menos um produtor.");
    if (!variedade) novos.push("Selecione a variedade de cultura.");
    if (!unidadeMedida) novos.push("Selecione a unidade de medida padrão.");
    if (!dataPlantio) novos.push("Informe a data de plantio.");
    if (dataPlantio && dataPlantio > HOJE) novos.push("A data de plantio não pode ser futura.");
    if (!localizacaoLivro.trim()) novos.push("Informe a localização do livro.");
    if (!latitude || !longitude) novos.push("Informe a geolocalização da exploração.");
    if (necessitaRT === "Sim" && !responsavelTecnico) novos.push("Selecione o responsável técnico.");
    const existentes = listarRegistrosMock<ExploracaoAgricola>(COLECAO_EXPLORACOES_AGRICOLAS, EXPLORACOES_AGRICOLAS_MOCK);
    const duplicada = existentes.some((item) =>
      item.id !== dados?.id && item.dataPlantio === dataPlantio && item.latitude === latitude && item.longitude === longitude
    );
    if (duplicada) novos.push("Já existe uma exploração agrícola com a mesma data de plantio e localização.");
    setErros(novos);
    if (novos.length || !registroAtual) return;

    let codigo = registroAtual.codigo;
    if (mode === "create") {
      const ano = String(new Date().getFullYear()).slice(-2);
      const prefixo = `${estabelecimento.codigo}${ano}`;
      const maior = existentes.filter((item) => item.codigo.startsWith(prefixo)).reduce((max, item) => Math.max(max, Number(item.codigo.slice(-4)) || 0), 0);
      codigo = `${prefixo}${String(maior + 1).padStart(4, "0")}`;
    }
    const salvo = { ...registroAtual, codigo };
    salvarRegistroMock(COLECAO_EXPLORACOES_AGRICOLAS, salvo);
    registrarVersaoCadastro({
      chaveCadastro: chaveHistoricoExploracaoAgricola(salvo.id),
      alteradoPor: "Usuário do sistema",
      dadosAnteriores: dados ?? salvo,
      dadosAtuais: salvo,
    });
    setRegistroSalvo(salvo); setSucesso(true);
  };

  const titulo = mode === "create" ? "Adicionar Exploração Agrícola" : mode === "edit" ? "Editar Exploração Agrícola" : "Visualizar Exploração Agrícola";
  const exibeAbaManutencao = mode === "view" && dados?.unidadeProducao === "Sim";
  const manutencoesAtivas = manutencoes.filter((item) => item.situacao === "Ativa");
  const manutencoesInativas = manutencoes.filter((item) => item.situacao === "Inativa");
  const abrirNovaManutencao = () => { setDataNovaManutencao(""); setResponsavelNovaManutencao(null); setErroManutencao(""); setModalManutencao("nova"); };
  const salvarManutencao = () => {
    if (!dados || !dataNovaManutencao || !responsavelNovaManutencao) { setErroManutencao("Informe a data e o responsável técnico da manutenção."); return; }
    const nova: ManutencaoExploracaoAgricola = { id: `manutencao-${Date.now()}`, dataCadastro: new Date().toISOString().slice(0, 10), dataManutencao: dataNovaManutencao, responsavelTecnico: responsavelNovaManutencao, situacao: "Ativa" };
    const atualizadas = [...manutencoes, nova];
    const atualizado = { ...dados, manutencoes: atualizadas };
    setManutencoes(atualizadas);
    salvarRegistroMock(COLECAO_EXPLORACOES_AGRICOLAS, atualizado);
    registrarVersaoCadastro({ chaveCadastro: chaveHistoricoExploracaoAgricola(dados.id), alteradoPor: "Usuário do sistema", dadosAnteriores: dados, dadosAtuais: atualizado });
    setModalManutencao(null);
  };
  const abas = [
    { id: "cadastro", label: "Cadastro", icon: (ativa: boolean) => <FileText size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "profissionais", label: "Profissionais", icon: (ativa: boolean) => <UserRound size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    ...(exibeAbaManutencao ? [
      { id: "vinculacoes", label: "Vinculações", icon: (ativa: boolean) => <Link2 size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} /> },
      { id: "manutencao", label: "Manutenção", icon: (ativa: boolean) => <ShieldCheck size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    ] : []),
  ];
  return <div className="min-h-screen bg-[#f2f3f5]">
    {!esconderNavbar && <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="exploracao-agricola" hideSearch />}
    <main data-situacao-container data-situacao={situacaoEfetiva} data-situacao-tab={abaAtiva} className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
      <div><button type="button" onClick={() => onNavigate("exploracao-agricola")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C]"><ArrowLeft size={15} />Todas as Explorações Agrícolas</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1><div className="flex gap-2">{mode === "view" ? <>{abaAtiva === "cadastro" && podeEditar && <button type="button" onClick={() => onNavigate("editar-exploracao-agricola", dados)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white">Editar</button>}{abaAtiva === "profissionais" && <button type="button" onClick={() => setAddProfessionalRequestKey((value) => value + 1)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white">Adicionar Profissional</button>}{abaAtiva === "manutencao" && <button type="button" onClick={abrirNovaManutencao} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">Adicionar Manutenção</button>}{abaAtiva === "cadastro" && acaoHistorico}</> : <><button type="button" onClick={validarESalvar} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">{mode === "edit" ? "Salvar" : "Adicionar"}</button>{acaoHistorico}</>}</div></div></div>
      {avisoHistorico}
      {exibeAbaManutencao && <Tabs tabs={abas} activeTab={abaAtiva} setActiveTab={(aba) => onMudarAba?.(aba)} />}

      {mode !== "view" && <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm"><Info size={20} className="text-gray-500" /><p className="text-sm text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p></div>}
      {erros.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" role="alert"><p className="font-semibold">Revise os campos:</p><ul className="mt-2 list-disc pl-5">{erros.map((erro) => <li key={erro}>{erro}</li>)}</ul></div>}

      {abaAtiva === "cadastro" && <>
      {mode !== "create" && <Section title="Informações Básicas"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Código da Exploração Agrícola" value={dados?.codigo ?? ""} disabled onChange={() => {}} /><FloatInput label="Situação" value={situacaoEfetiva} disabled onChange={() => {}} /></div></Section>}

      <Section title="Estabelecimento Agropecuário"><EntitySearchInput label="Estabelecimento Agropecuário" required disabled={mode !== "create"} value={estabelecimento?.nome ?? ""} data={ESTABELECIMENTOS_AGRICOLAS_MOCK} searchKeys={["codigo", "nome", "municipio", "proprietario"]} columns={[{ label: "Código", key: "codigo" }, { label: "Estabelecimento", key: "nome" }, { label: "Município", key: "municipio" }, { label: "Proprietário", key: "proprietario" }]} icon={<img src={Icons.iconeEstabelecimentoUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Estabelecimento Agropecuário" subtitle="Busque por um estabelecimento cadastrado:" onChange={selecionarEstabelecimento} /></Section>

      {estabelecimento && <Section title="Informações de Área"><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><FloatSelect label="Unidade de Medida da Área" required disabled={somenteLeitura} value={unidadeArea} onChange={(v) => setUnidadeArea(v as any)} options={[{ value: "Hectares", label: "Hectares" }, { value: "Metros Quadrados", label: "Metros Quadrados" }]} /><FloatInput label="Área Produtiva do Estabelecimento" required disabled value={areaProdutiva} onChange={() => {}} /><FloatInput label="Área Útil da Exploração" required disabled={somenteLeitura} value={areaUtil} onChange={setAreaUtil} maxLength={12} hasTooltip tooltipText="Deve respeitar a área produtiva disponível; pode haver sobreposição com outras explorações abertas." /></div></Section>}

      <Section title="Produtores"><DynamicListWrapper items={produtores} behavior="at-least-one" variant="plain" itemLabel="Produtor" addButtonLabel="Adicionar Produtor" disabled={somenteLeitura} onAddItem={() => setProdutores((items) => [...items, { uid: `produtor-${Date.now()}`, produtor: null }])} onRemoveItem={(index) => setProdutores((items) => items.filter((_, i) => i !== index))}>{(item, index) => <EntitySearchInput label="Produtor" required disabled={somenteLeitura} value={item.produtor?.nome ?? ""} data={PRODUTORES_AGRICOLAS_MOCK.filter((p) => !produtores.some((selecionado, i) => i !== index && selecionado.produtor?.id === p.id))} searchKeys={["nome", "documento"]} columns={[{ label: "CPF/CNPJ", key: "documento" }, { label: "Nome/Razão Social", key: "nome" }]} icon={<img src={Icons.iconeProdutorUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Produtor" subtitle="Busque por um produtor cadastrado:" onChange={(valor) => setProdutores((items) => items.map((atual, i) => i === index ? { ...atual, produtor: valor } : atual))} />}</DynamicListWrapper></Section>

      <Section title="Informações da Cultura Explorada"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><EntitySearchInput label="Variedade de Cultura" required disabled={somenteLeitura} value={variedade ? `${variedade.cultura} - ${variedade.nome}` : ""} data={VARIEDADES_CULTURA_MOCK} searchKeys={["cultura", "nome"]} columns={[{ label: "Cultura", key: "cultura" }, { label: "Variedade", key: "nome" }]} icon={<img src={Icons.iconeCulturaUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Variedade de Cultura" subtitle="Busque por uma variedade cadastrada:" onChange={(item) => { setVariedade(item); setUnidadeMedida(item?.unidadePadrao ?? ""); setResponsavelTecnico(null); }} /><FloatSelect label="Unidade de Medida Padrão" required disabled={somenteLeitura} value={unidadeMedida} onChange={setUnidadeMedida} options={["kg", "t", "unidade", "caixa"].map((value) => ({ value, label: value }))} /></div></Section>

      <Section title="Informações Complementares"><div className="flex flex-col gap-6"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Data de Plantio" required disabled={somenteLeitura} type="date" max={HOJE} value={dataPlantio} onChange={setDataPlantio} /><FloatInput label="Localização do Livro" required disabled={somenteLeitura} value={localizacaoLivro} onChange={setLocalizacaoLivro} maxLength={255} /></div><SimNao label="É uma Unidade de Produção? (Necessita de CFO)" name="unidade-producao" disabled={somenteLeitura} value={unidadeProducao} onChange={setUnidadeProducao} />{unidadeProducao === "Sim" && <FloatInput label="Data de Vencimento" value={formatarData(dataVencimento)} disabled icon={<CalendarDays size={18} />} onChange={() => {}} />}<SimNao label="Necessita de Responsável Técnico?" name="necessita-rt" disabled={somenteLeitura} value={necessitaRT} onChange={(v) => { setNecessitaRT(v); if (v === "Não") setResponsavelTecnico(null); }} />{necessitaRT === "Sim" && <EntitySearchInput label="Responsável Técnico" required disabled={somenteLeitura} value={responsavelTecnico?.nome ?? ""} data={RESPONSAVEIS_TECNICOS_MOCK} searchKeys={["nome", "documento", "codigo"]} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }, { label: "Registro", key: "codigo" }]} icon={<img src={Icons.iconeProfissionalVegetalUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Responsável Técnico" subtitle="Busque por um profissional habilitado:" onChange={setResponsavelTecnico} />}{rtIncompativel && <p className="text-xs text-amber-700" role="alert">O responsável técnico não possui habilitação para todas as pragas vinculadas à cultura. O cadastro ficará suspenso.</p>}</div></Section>

      <Section title="Informações de Localização"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Latitude" required disabled={somenteLeitura} value={latitude} onChange={setLatitude} icon={<MapPin size={18} />} /><FloatInput label="Longitude" required disabled={somenteLeitura} value={longitude} onChange={setLongitude} icon={<MapPin size={18} />} /></div></Section>

      <Section title="Anexos e Observações"><div className="flex flex-col gap-6"><DynamicListWrapper items={anexos} behavior="zero-or-more" variant="plain" itemLabel="Anexo" addButtonLabel="Adicionar Anexo" disabled={somenteLeitura} onAddItem={() => setAnexos((items) => [...items, { id: String(Date.now()), nome: "", descricao: "" }])} onRemoveItem={(index) => setAnexos((items) => items.filter((_, i) => i !== index))}>{(anexo, index) => <div className="flex flex-col gap-3 md:flex-row"><UploadField label="Documento" fileName={anexo.nome} disabled={somenteLeitura} onSelectFile={() => setAnexos((items) => items.map((item, i) => i === index ? { ...item, nome: `documento_exploracao_${index + 1}.pdf` } : item))} /><div className="flex-1"><FloatInput label="Descrição" disabled={somenteLeitura} value={anexo.descricao} onChange={(value) => setAnexos((items) => items.map((item, i) => i === index ? { ...item, descricao: value } : item))} maxLength={255} /></div></div>}</DynamicListWrapper><LargeTextArea label="Observações" disabled={somenteLeitura} value={observacao} onChange={setObservacao} maxLength={1500} /></div></Section>
      </>}
      {abaAtiva === "profissionais" && <EntityProfessionalsTab entityKey={`exploracao-agricola-${dados?.id || "demo"}`} allowedTypes={["Responsável Técnico Vegetal", "Habilitado para Emissão de PTV"]} onNavigate={onNavigate} addRequestKey={addProfessionalRequestKey} />}
      {exibeAbaManutencao && abaAtiva === "vinculacoes" && <section className="rounded-xl bg-white p-6 text-sm text-gray-600 shadow-sm"><p className="font-semibold text-gray-800">Vinculações da Exploração</p><p className="mt-1">As vinculações relacionadas à unidade de produção serão apresentadas aqui.</p></section>}
      {exibeAbaManutencao && abaAtiva === "manutencao" && <div className="animate-fadeIn"><AccordionCardGroup title="Manutenção da Exploração" icon={<ShieldCheck size={18} />} activeCountText={`${manutencoesAtivas.length} ${manutencoesAtivas.length === 1 ? "Item Ativo" : "Itens Ativos"}`} variant="sem-vinculacao" grid="unico" historicoTitle="Manutenções Inativas" historicoChildren={manutencoesInativas.map((item) => <CardManutencao key={item.id} item={item} onVisualizar={() => { setManutencaoSelecionada(item); setModalManutencao("visualizar"); }} />)} emptyStateText="Nenhuma manutenção ativa.">{manutencoesAtivas.map((item) => <CardManutencao key={item.id} item={item} onVisualizar={() => { setManutencaoSelecionada(item); setModalManutencao("visualizar"); }} />)}</AccordionCardGroup></div>}
    </main>

    {modalManutencao && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900">{modalManutencao === "nova" ? "Adicionar Manutenção" : "Visualizar Manutenção"}</h2><p className="mt-1 text-sm text-gray-500">{modalManutencao === "nova" ? "Informe os dados da manutenção da exploração." : "Dados registrados para esta manutenção."}</p></div><button type="button" onClick={() => setModalManutencao(null)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Fechar">×</button></div>{modalManutencao === "nova" ? <div className="flex flex-col gap-5"><FloatInput label="Data da Manutenção" required type="date" value={dataNovaManutencao} onChange={setDataNovaManutencao} /><EntitySearchInput label="Responsável Técnico" required value={responsavelNovaManutencao?.nome ?? ""} data={RESPONSAVEIS_TECNICOS_MOCK} searchKeys={["nome", "documento", "codigo"]} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }, { label: "Registro", key: "codigo" }]} icon={<img src={Icons.iconeProfissionalVegetalUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Responsável Técnico" subtitle="Busque por um profissional habilitado:" onChange={setResponsavelNovaManutencao} />{erroManutencao && <p className="text-sm text-red-600" role="alert">{erroManutencao}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setModalManutencao(null)} className="h-10 rounded-md border border-[#1A7A3C] px-5 text-xs font-bold text-[#1A7A3C]">Cancelar</button><button type="button" onClick={salvarManutencao} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white">Adicionar</button></div></div> : manutencaoSelecionada && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><FloatInput label="Data de cadastro" disabled value={formatarData(manutencaoSelecionada.dataCadastro)} onChange={() => {}} /><FloatInput label="Situação" disabled value={manutencaoSelecionada.situacao} onChange={() => {}} /><FloatInput label="Data da Manutenção" disabled value={formatarData(manutencaoSelecionada.dataManutencao)} onChange={() => {}} /><FloatInput label="Responsável Técnico" disabled value={manutencaoSelecionada.responsavelTecnico.nome} onChange={() => {}} /><FloatInput label="CPF" disabled value={manutencaoSelecionada.responsavelTecnico.documento} onChange={() => {}} /></div>}</div></div>}

    {sucesso && registroSalvo && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h3 className="text-lg font-bold text-gray-900">Exploração agrícola {mode === "edit" ? "atualizada" : "cadastrada"} com sucesso!</h3><p className="mt-1 text-sm text-gray-500">Código {registroSalvo.codigo}</p><div className="mt-6 flex justify-center gap-3"><button onClick={() => onNavigate("exploracao-agricola")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">Voltar</button><button onClick={() => onNavigate("visualizar-exploracao-agricola", registroSalvo)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Visualizar</button></div></div></div>}
  </div>;
}
