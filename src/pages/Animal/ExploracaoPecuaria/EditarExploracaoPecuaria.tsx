import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Dna,
  Download,
  PlusCircle,
  Ruler,
  Save,
  Trash2,
} from "lucide-react";

// Componentes da sua aplicação
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// DADOS BASE / MOCKS LOCAIS
// ==========================================================
const REGISTRO_BASE_PADRAO = {
  id: "EXP-2026-00892",
  codigo: "420010400050002",
  status: "Ativa",
  estabelecimento: {
    id: 1,
    codigo: "42001040005",
    nome: "Fazenda Vertentes",
    municipio: "Varginha - MG",
  },
  unidadeArea: "Metros Quadrados",
  areaProdutiva: "15.000,00",
  areaUtil: "4.500,00",
  titularTipo: "Proprietário",
  produtorTitular: {
    id: 1,
    nome: "Agropecuária Vale Verde Ltda.",
    documento: "56.338.814/0001-95",
  },
  especie: {
    id: 1,
    codigo: "ESP-005",
    nome: "Peixe Ornamental",
    grupo: "Peixes",
  },
  subespecies: [
    { uid: "sub-1", nome: "Acará-Bandeira (Pterophyllum scalare)" },
    { uid: "sub-2", nome: "Kinguio (Carassius auratus)" },
  ],
  aptidao: "Ornamental",
  bacia: "Rio Grande",
  origemCaptacao: ["Dentro do Estabelecimento"],
  fonteCaptacao: ["Poço Artesiano", "Rio"],
  nomeRio: "Rio Verde",
  finalidadeProducao: "Ciclo Completo",
  tipoPiscicultura: "Unidade de Produção",
  origemMatrizes: ["Nacional", "Própria"],
  sistemaProducao: "Fechado",
  sistFechado: ["Tanque Suspenso", "Aquário"],
  abastecimento: ["Independente para cada Tanque", "Recirculação Contínua"],
  localDescarte: ["Bacia de Infiltração"],
  realizaDepuracao: true,
  tipoDestino: ["Revendedora", "Consumidor Final"],
  escalaComercio: ["Intraestadual", "Interestadual"],
  tratAfluente: ["UV", "Filtro de Carvão Ativado"],
  tratEfluente: ["Tanque de Decantação"],
  isSub: true,
  exploracaoPai: {
    id: 1,
    codigo: "420010400050001",
    nome: "Exploração Vertentes Matriz",
  },
  anexos: [
    {
      id: "anx-1",
      nome: "Outorga_Agua_IGAM_2025.pdf",
      descricao: "Outorga de uso de água válida enviada pelo IGAM.",
    },
  ],
  observacao:
    "Exploração pecuária voltada prioritariamente para piscicultura ornamental de água doce em sistema de recirculação fechado (RAS).",
};

// Opções para selects e checkboxes
const UNIDADES_AREA_OPCOES = [
  { value: "Metros Quadrados", label: "Metros Quadrados (m²)" },
  { value: "Hectares", label: "Hectares (ha)" },
];

const TIPOS_PRODUTOR_OPCOES = [
  { value: "Proprietário", label: "Proprietário" },
  { value: "Arrendatário", label: "Arrendatário" },
  { value: "Parceiro", label: "Parceiro" },
  { value: "Comodatário", label: "Comodatário" },
];

const APTIDAO_OPCOES = [
  { value: "Ornamental", label: "Ornamental" },
  { value: "Corte", label: "Corte" },
  { value: "Engorda", label: "Engorda" },
  { value: "Recria", label: "Recria" },
];

const BACIA_OPCOES = [
  { value: "Rio Grande", label: "Rio Grande" },
  { value: "Rio Doce", label: "Rio Doce" },
  { value: "Rio São Francisco", label: "Rio São Francisco" },
  { value: "Rio Paraíba do Sul", label: "Rio Paraíba do Sul" },
];

const FINALIDADE_OPCOES = [
  { value: "Ciclo Completo", label: "Ciclo Completo" },
  { value: "Engorda", label: "Engorda" },
  { value: "Cria/Recria", label: "Cria/Recria" },
  { value: "Reprodução/Larvicultura", label: "Reprodução/Larvicultura" },
];

const TIPO_PISCICULTURA_OPCOES = [
  { value: "Unidade de Produção", label: "Unidade de Produção" },
  { value: "Atacadista/Distribuidor", label: "Atacadista/Distribuidor" },
  { value: "Expositor/Feirante", label: "Expositor/Feirante" },
];

const SISTEMA_PRODUCAO_OPCOES = [
  { value: "Fechado", label: "Fechado" },
  { value: "Semi-fechado", label: "Semi-fechado" },
  { value: "Aberto", label: "Aberto" },
];

const ORIGEM_CAPTACAO_OPCOES = [
  { id: "Dentro do Estabelecimento", label: "Dentro do Estabelecimento" },
  { id: "Fora do Estabelecimento", label: "Fora do Estabelecimento" },
];

const FONTE_CAPTACAO_OPCOES = [
  { id: "Nascente", label: "Nascente" },
  { id: "Rio", label: "Rio" },
  { id: "Córrego", label: "Córrego" },
  { id: "Água de chuva", label: "Água de chuva" },
  { id: "Poço Artesiano", label: "Poço Artesiano" },
];

const ORIGEM_MATRIZES_OPCOES = [
  { id: "Nacional", label: "Nacional" },
  { id: "Importada", label: "Importada" },
  { id: "Própria", label: "Própria" },
];

const SISTEMA_FECHADO_OPCOES = [
  { id: "Aquário", label: "Aquário" },
  { id: "Tanque Suspenso", label: "Tanque Suspenso" },
  { id: "Tanque de Alvenaria", label: "Tanque de Alvenaria" },
];

const ABASTECIMENTO_OPCOES = [
  { id: "Independente para cada Tanque", label: "Independente para cada Tanque" },
  { id: "Em Série", label: "Em Série" },
  { id: "Recirculação Contínua", label: "Recirculação Contínua" },
];

const LOCAL_DESCARTE_OPCOES = [
  { id: "Rede de Esgoto", label: "Rede de Esgoto" },
  { id: "Corpo Hídrico", label: "Corpo Hídrico" },
  { id: "Bacia de Infiltração", label: "Bacia de Infiltração" },
];

const TIPO_DESTINO_OPCOES = [
  { id: "Revendedora", label: "Revendedora" },
  { id: "Consumidor Final", label: "Consumidor Final" },
  { id: "Outro Produtor", label: "Outro Produtor" },
];

const ESCALA_COMERCIO_OPCOES = [
  { id: "Intraestadual", label: "Intraestadual" },
  { id: "Interestadual", label: "Interestadual" },
  { id: "Internacional", label: "Internacional" },
];

const TRATAMIENTO_AFLUENTE_OPCOES = [
  { id: "UV", label: "UV" },
  { id: "Filtro de Carvão Ativado", label: "Filtro de Carvão Ativado" },
  { id: "Ozônio", label: "Ozônio" },
];

const TRATAMIENTO_EFLUENTE_OPCOES = [
  { id: "Tanque de Decantação", label: "Tanque de Decantação" },
  { id: "Cloração", label: "Cloração" },
  { id: "Filtro Biológico", label: "Filtro Biológico" },
];

const ESTABELECIMENTOS_MOCK = [
  { id: 1, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG" },
  { id: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG" },
];

const PRODUTORES_MOCK = [
  { id: 1, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
  { id: 2, nome: "José Aarão Neto", documento: "555.009.956-40" },
];

const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-005", nome: "Peixe Ornamental", grupo: "Peixes" },
  { id: 2, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
];

const EXPLORACOES_PAI_MOCK = [
  { id: 1, codigo: "420010400050002", nome: "Exploração Vertentes Matriz" },
];

// Componentes estruturais da página
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/80 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
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
      {comDivisor && <hr className="border-gray-100 my-2" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

export interface EditarExploracaoPecuariaPageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
  dados?: any;
}

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================
export function EditarExploracaoPecuariaPage({
  onLogout = () => {},
  onNavigate = (screen: string) => console.log("Navegar para:", screen),
  dados,
}: EditarExploracaoPecuariaPageProps) {
  const r = dados ?? REGISTRO_BASE_PADRAO;

  // Estados dos formulários
  const [estabelecimento, setEstabelecimento] = useState(r.estabelecimento);
  const [unidadeArea, setUnidadeArea] = useState(r.unidadeArea || "Metros Quadrados");
  const [areaProdutiva, setAreaProdutiva] = useState(r.areaProdutiva || "");
  const [areaUtil, setAreaUtil] = useState(r.areaUtil || "");

  const [titularTipo, setTitularTipo] = useState(r.titularTipo || "Proprietário");
  const [produtorTitular, setProdutorTitular] = useState(r.produtorTitular);

  const [especie, setEspecie] = useState(r.especie);
  const [subespecies, setSubespecies] = useState<any[]>(r.subespecies || []);

  const [aptidao, setAptidao] = useState(r.aptidao || "Ornamental");
  const [bacia, setBacia] = useState(r.bacia || "Rio Grande");
  const [origemCaptacao, setOrigemCaptacao] = useState<string[]>(r.origemCaptacao || []);
  const [fonteCaptacao, setFonteCaptacao] = useState<string[]>(r.fonteCaptacao || []);
  const [nomeRio, setNomeRio] = useState(r.nomeRio || "");

  const [finalidadeProducao, setFinalidadeProducao] = useState(r.finalidadeProducao || "Ciclo Completo");
  const [tipoPiscicultura, setTipoPiscicultura] = useState(r.tipoPiscicultura || "Unidade de Produção");
  const [origemMatrizes, setOrigemMatrizes] = useState<string[]>(r.origemMatrizes || []);
  const [sistemaProducao, setSistemaProducao] = useState(r.sistemaProducao || "Fechado");
  const [sistFechado, setSistFechado] = useState<string[]>(r.sistFechado || []);
  const [abastecimento, setAbastecimento] = useState<string[]>(r.abastecimento || []);
  const [localDescarte, setLocalDescarte] = useState<string[]>(r.localDescarte || []);
  const [realizaDepuracao, setRealizaDepuracao] = useState<boolean | null>(r.realizaDepuracao);
  const [tipoDestino, setTipoDestino] = useState<string[]>(r.tipoDestino || []);
  const [escalaComercio, setEscalaComercio] = useState<string[]>(r.escalaComercio || []);
  const [tratAfluente, setTratAfluente] = useState<string[]>(r.tratAfluente || []);
  const [tratEfluente, setTratEfluente] = useState<string[]>(r.tratEfluente || []);

  const [isSub, setIsSub] = useState<boolean | null>(r.isSub);
  const [exploracaoPai, setExploracaoPai] = useState(r.exploracaoPai);

  const [anexos, setAnexos] = useState<any[]>(r.anexos || []);
  const [observacao, setObservacao] = useState(r.observacao || "");

  const isPeixes = especie?.grupo === "Peixes";
  const isOrnamental = aptidao === "Ornamental" || especie?.nome === "Peixe Ornamental";

  // Ações
  const adicionarSubespecie = () => {
    setSubespecies((prev) => [...prev, { uid: `sub-${Date.now()}`, nome: "" }]);
  };

  const atualizarSubespecie = (index: number, nome: string) => {
    setSubespecies((prev) =>
      prev.map((s, i) => (i === index ? { ...s, nome } : s))
    );
  };

  const removerSubespecie = (index: number) => {
    setSubespecies((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarAnexo = () => {
    setAnexos((prev) => [
      ...prev,
      { id: `anx-${Date.now()}`, nome: "", descricao: "" },
    ]);
  };

  const removerAnexo = (id: string) => {
    setAnexos((prev) => prev.filter((a) => a.id !== id));
  };

  const atualizarDescricaoAnexo = (id: string, desc: string) => {
    setAnexos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, descricao: desc } : a))
    );
  };

  const handleSalvar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dadosSalvos = {
      ...r,
      estabelecimento,
      unidadeArea,
      areaProdutiva,
      areaUtil,
      titularTipo,
      produtorTitular,
      especie,
      subespecies,
      aptidao,
      bacia,
      origemCaptacao,
      fonteCaptacao,
      nomeRio,
      finalidadeProducao,
      tipoPiscicultura,
      origemMatrizes,
      sistemaProducao,
      sistFechado,
      abastecimento,
      localDescarte,
      realizaDepuracao,
      tipoDestino,
      escalaComercio,
      tratAfluente,
      tratEfluente,
      isSub,
      exploracaoPai,
      anexos,
      observacao,
    };

    onNavigate("visualizar-exploracao-pecuaria", dadosSalvos);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] flex flex-col pb-12">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="exploracao-pecuaria"
        hideSearch
      />

      <main className="max-w-[1088px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Topo com botão voltar, título limpo e Ação de Salvar superior */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-exploracao-pecuaria", r)}
            className="flex items-center gap-1 text-sm font-medium mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Voltar para Visualizar Exploração Pecuária
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Exploração Pecuária
            </h1>

            {/* Botão Salvar na parte superior */}
            <button
              type="button"
              onClick={handleSalvar}
              className="h-10 px-6 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white font-semibold text-sm transition shadow-sm flex items-center gap-2 self-start md:self-auto"
            >
              Salvar 
            </button>
          </div>
        </div>

        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
          {/* 1. Estabelecimento */}
          <Section title="Estabelecimento Agropecuário">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <FloatInput
                label="Código do Estabelecimento"
                value={estabelecimento?.codigo || ""}
                disabled
                onChange={() => {}}
              />
              <EntitySearchInput
                label="Estabelecimento Agropecuário *"
                placeholder="Buscar estabelecimento..."
                value={estabelecimento?.nome || ""}
                data={ESTABELECIMENTOS_MOCK}
                searchKeys={["codigo", "nome", "municipio"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Nome", key: "nome" },
                  { label: "Município", key: "municipio" },
                ]}
                icon={
                  <img
                    src={Icons.iconeEstabelecimentoUrl}
                    alt="Estabelecimento"
                    className="w-5 h-5 object-contain"
                  />
                }
                title="Buscar Estabelecimento Agropecuário"
                subtitle="Selecione um estabelecimento cadastrado:"
                onChange={(ent: any) => setEstabelecimento(ent)}
              />
            </div>
          </Section>

          {/* 2. Informações de Área */}
          <Section title="Informações de Área">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <FloatSelect
                label="Unidade de Medida da Área *"
                value={unidadeArea}
                onChange={setUnidadeArea}
                options={UNIDADES_AREA_OPCOES}
              />
              <FloatInput
                label="Área Produtiva do Estabelecimento *"
                value={areaProdutiva}
                onChange={(e: any) => setAreaProdutiva(e.target.value)}
              />
              <FloatInput
                label="Área Útil da Exploração *"
                value={areaUtil}
                onChange={(e: any) => setAreaUtil(e.target.value)}
                hasTooltip
                tooltipText="A área útil deve respeitar a área produtiva disponível no estabelecimento."
              />
            </div>
          </Section>

          {/* 3. Produtores */}
          <Section title="Produtores">
            <SubGrupo titulo="Produtor Titular">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-center">
                <FloatSelect
                  label="Tipo de Produtor *"
                  value={titularTipo}
                  onChange={setTitularTipo}
                  options={TIPOS_PRODUTOR_OPCOES}
                />
                <EntitySearchInput
                  label="Produtor Titular *"
                  placeholder="Buscar produtor por CPF/CNPJ ou Nome"
                  value={
                    produtorTitular
                      ? `${produtorTitular.documento} — ${produtorTitular.nome}`
                      : ""
                  }
                  data={PRODUTORES_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[
                    { label: "Documento", key: "documento" },
                    { label: "Nome", key: "nome" },
                  ]}
                  icon={
                    <img
                      src={Icons.iconeProdutorUrl}
                      alt="Produtor"
                      className="w-5 h-5 object-contain"
                    />
                  }
                  title="Buscar Produtor Titular"
                  subtitle="Selecione um produtor cadastrado:"
                  onChange={(ent: any) => setProdutorTitular(ent)}
                />
              </div>
            </SubGrupo>
          </Section>

          {/* 4. Espécie */}
          <Section title="Informações da Espécie Explorada">
            <div className="flex flex-col gap-6">
              <SubGrupo titulo="Espécie">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <FloatInput
                    label="Grupo da Espécie"
                    value={especie?.grupo || ""}
                    icon={<Dna size={18} color={GREEN} />}
                    disabled
                    onChange={() => {}}
                  />
                  <EntitySearchInput
                    label="Espécie Explorada *"
                    placeholder="Buscar espécie..."
                    value={especie?.nome || ""}
                    data={ESPECIES_MOCK}
                    searchKeys={["nome", "grupo", "codigo"]}
                    columns={[
                      { label: "Código", key: "codigo" },
                      { label: "Espécie", key: "nome" },
                      { label: "Grupo", key: "grupo" },
                    ]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Selecione uma espécie para a exploração:"
                    onChange={(ent: any) => setEspecie(ent)}
                  />
                </div>
              </SubGrupo>

              {/* Subespécies */}
              <SubGrupo titulo="Subespécies" comDivisor>
                <div className="flex flex-col gap-3">
                  {subespecies.map((s, index) => (
                    <div
                      key={s.uid || index}
                      className="flex gap-3 items-center"
                    >
                      <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <FloatInput
                          label="Nome da Subespécie"
                          value={s.nome}
                          onChange={(e: any) =>
                            atualizarSubespecie(index, e.target.value)
                          }
                          icon={<Dna size={18} color={GREEN} />}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removerSubespecie(index)}
                        title="Remover Subespécie"
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-md transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarSubespecie}
                    className="flex w-fit items-center gap-2 rounded-md border border-[#1A7A3C] px-4 py-2 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50 mt-1"
                  >
                    <PlusCircle size={16} />
                    Adicionar Subespécie
                  </button>
                </div>
              </SubGrupo>

              {/* Complemento para Peixes */}
              {isPeixes && (
                <SubGrupo
                  titulo="Informações Complementares de Piscicultura"
                  comDivisor
                >
                  <div className="flex flex-col gap-6 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <FloatSelect
                        label="Aptidão *"
                        value={aptidao}
                        onChange={setAptidao}
                        options={APTIDAO_OPCOES}
                      />
                      <FloatSelect
                        label="Bacia Hidrográfica *"
                        value={bacia}
                        onChange={setBacia}
                        options={BACIA_OPCOES}
                      />
                    </div>

                    <CheckboxGroup
                      title="Origem da Captação de Água"
                      actionLabel=""
                      options={ORIGEM_CAPTACAO_OPCOES}
                      defaultValue={origemCaptacao}
                      onChange={setOrigemCaptacao}
                      orientation="horizontal"
                    />

                    <CheckboxGroup
                      title="Fonte da Captação de Água"
                      actionLabel=""
                      options={FONTE_CAPTACAO_OPCOES}
                      defaultValue={fonteCaptacao}
                      onChange={setFonteCaptacao}
                      orientation="grid"
                    />

                    {fonteCaptacao.includes("Rio") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatInput
                          label="Nome do Rio *"
                          value={nomeRio}
                          onChange={(e: any) => setNomeRio(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </SubGrupo>
              )}
            </div>
          </Section>

          {/* 5. Caracterização Sistema Produtivo (Peixes) */}
          {isPeixes && (
            <Section title="Caracterização do Sistema Produtivo">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <FloatSelect
                    label="Finalidade de Produção *"
                    value={finalidadeProducao}
                    onChange={setFinalidadeProducao}
                    options={FINALIDADE_OPCOES}
                  />
                  {isOrnamental && (
                    <FloatSelect
                      label="Tipo de Piscicultura Ornamental *"
                      value={tipoPiscicultura}
                      onChange={setTipoPiscicultura}
                      options={TIPO_PISCICULTURA_OPCOES}
                    />
                  )}
                </div>

                <CheckboxGroup
                  title="Origem das Matrizes e Reprodutores"
                  actionLabel=""
                  options={ORIGEM_MATRIZES_OPCOES}
                  defaultValue={origemMatrizes}
                  onChange={setOrigemMatrizes}
                  orientation="horizontal"
                />

                <div className="w-full md:w-1/3">
                  <FloatSelect
                    label="Sistema de Produção *"
                    value={sistemaProducao}
                    onChange={setSistemaProducao}
                    options={SISTEMA_PRODUCAO_OPCOES}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {sistemaProducao === "Fechado" && (
                    <CheckboxGroup
                      title="Sistema Fechado"
                      actionLabel=""
                      options={SISTEMA_FECHADO_OPCOES}
                      defaultValue={sistFechado}
                      onChange={setSistFechado}
                      orientation="vertical"
                    />
                  )}
                  <CheckboxGroup
                    title="Abastecimento"
                    actionLabel=""
                    options={ABASTECIMENTO_OPCOES}
                    defaultValue={abastecimento}
                    onChange={setAbastecimento}
                    orientation="vertical"
                  />
                  <CheckboxGroup
                    title="Local de Descarte de Água"
                    actionLabel=""
                    options={LOCAL_DESCARTE_OPCOES}
                    defaultValue={localDescarte}
                    onChange={setLocalDescarte}
                    orientation="vertical"
                  />
                </div>

                <SimNao
                  label="Realiza depuração de peixes? *"
                  name="realizaDepuracao"
                  value={realizaDepuracao}
                  onChange={setRealizaDepuracao}
                />

                <SubGrupo titulo="Destino dos Animais" comDivisor>
                  <CheckboxGroup
                    title="Tipo de Destino"
                    actionLabel=""
                    options={TIPO_DESTINO_OPCOES}
                    defaultValue={tipoDestino}
                    onChange={setTipoDestino}
                    orientation="horizontal"
                  />
                  <CheckboxGroup
                    title="Escala de Comércio"
                    actionLabel=""
                    options={ESCALA_COMERCIO_OPCOES}
                    defaultValue={escalaComercio}
                    onChange={setEscalaComercio}
                    orientation="horizontal"
                  />
                </SubGrupo>

                {isOrnamental && (
                  <SubGrupo titulo="Tratamentos de Água" comDivisor>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
                      <CheckboxGroup
                        title="Tratamento de Afluente"
                        actionLabel=""
                        options={TRATAMIENTO_AFLUENTE_OPCOES}
                        defaultValue={tratAfluente}
                        onChange={setTratAfluente}
                        orientation="vertical"
                      />
                      <CheckboxGroup
                        title="Tratamento de Efluente"
                        actionLabel=""
                        options={TRATAMIENTO_EFLUENTE_OPCOES}
                        defaultValue={tratEfluente}
                        onChange={setTratEfluente}
                        orientation="vertical"
                      />
                    </div>
                  </SubGrupo>
                )}
              </div>
            </Section>
          )}

          {/* 6. Sub Exploração */}
          <Section title="Sub Exploração Pecuária">
            <div className="flex flex-col gap-4">
              <SimNao
                label="É um Subarrendamento/Subcomodato?"
                name="sub-exploracao"
                value={isSub}
                onChange={setIsSub}
                hasTooltip
                tooltipText="Quando a exploração está vinculada a outra exploração pai."
              />

              {isSub && (
                <div className="w-full md:w-1/2">
                  <EntitySearchInput
                    label="Exploração Pecuária Pai *"
                    placeholder="Buscar código da exploração pai"
                    value={exploracaoPai?.codigo || ""}
                    data={EXPLORACOES_PAI_MOCK}
                    searchKeys={["codigo", "nome"]}
                    columns={[
                      { label: "Código", key: "codigo" },
                      { label: "Nome", key: "nome" },
                    ]}
                    icon={<Ruler size={18} color={GREEN} />}
                    title="Buscar Exploração Pai"
                    subtitle="Selecione a exploração pai cadastrada:"
                    onChange={(ent: any) => setExploracaoPai(ent)}
                  />
                </div>
              )}
            </div>
          </Section>

          {/* 7. Anexos */}
          <Section title="Anexos">
            <div className="flex flex-col gap-4">
              {anexos.map((anexo, index) => (
                <div
                  key={anexo.id || index}
                  className="flex gap-4 items-start w-full"
                >
                  <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    <UploadField
                      label="Documento Anexo *"
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos((prev) =>
                          prev.map((a, i) =>
                            i === index
                              ? {
                                  ...a,
                                  nome: `documento_anexo_${index + 1}.pdf`,
                                }
                              : a
                          )
                        )
                      }
                    />
                    <FloatInput
                      label="Descrição do Anexo"
                      value={anexo.descricao || ""}
                      onChange={(e: any) =>
                        atualizarDescricaoAnexo(anexo.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="h-12 flex items-center gap-1">
                    {anexo.nome && (
                      <button
                        type="button"
                        onClick={() => alert(`Baixando anexo: ${anexo.nome}`)}
                        title="Baixar Arquivo"
                        className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                      >
                        <Download size={20} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removerAnexo(anexo.id)}
                      title="Remover Anexo"
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarAnexo}
                className="flex w-fit items-center gap-2 rounded-md border border-[#1A7A3C] px-4 py-2 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50 mt-1"
              >
                <PlusCircle size={16} />
                Adicionar Novo Anexo
              </button>
            </div>
          </Section>

          {/* 8. Observações */}
          <Section title="Observação">
            <LargeTextArea
              label="Observações Adicionais"
              value={observacao}
              onChange={(e: any) => setObservacao(e.target.value)}
              hasTooltip
              tooltipText="Informações adicionais pertinentes ao cadastro da exploração pecuária."
            />
          </Section>
        </form>
      </main>
    </div>
  );
}

export default EditarExploracaoPecuariaPage;