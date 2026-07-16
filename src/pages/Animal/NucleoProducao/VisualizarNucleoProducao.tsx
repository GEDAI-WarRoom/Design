import React, { useState } from "react";
import { ArrowLeft, CalendarClock, ChevronUp, ChevronDown, ClipboardPenLine, Plus, ShoppingCart } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  LargeTextArea,
  UploadField,
  CustomRadio,
  CheckboxGroup,
  Tabs,
} from "../../../components/ui/FormKit";
import {
  AdicionarPrevisaoMigracaoModal,
  PrevisaoMigracaoTab,
} from "../PrevisaoMigracao/PrevisaoMigracao";

// Importação dos mesmos ícones utilizados na Adição
import * as Icons from "../../../imports/icons";


const DADOS_EXEMPLO_FIXO = {
  codigo: "42001040005000101",
  nome: "Apiário Bom Jardim",
  situacao: "Ativo",
  exploracaoCodigo: "420010400050001",
  especie: "Abelha com Ferrão",
  grupo: "Abelhas",
  estabNome: "Fazenda Vertentes",
  estabCodigo: "42001040005",
  produtores: [
    { nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
    { nome: "José Aarão Neto", documento: "555.009.956-40" },
  ],
  numGalpoes: "", capacidade: "", possuiPiquetes: "", numPiquetes: "",
  materialImportado: "Sim", paisOrigem: "Estados Unidos", possuiMaterialImportadoAbelha: "Sim",
  subespecies: ["Africanizada", "Apis mellifera ligustica - Italiana"],
  origemEnxames: ["Captura", "Compra"],
  fornecedores: [
    { id: 1, possuiCadastro: "Sim", fornecedorCod: "311234567890123", especie: "Abelha com Ferrão", nomeFornecedor: "", estado: "", municipio: "", contatos: [] },
    {
      id: 2,
      possuiCadastro: "Não",
      fornecedorCod: "",
      especie: "",
      nomeFornecedor: "José Souza Mirando",
      estado: "Minas Gerais",
      municipio: "Lavras",
      contatos: [{ id: "fornecedor-2-contato-1", tipo: "WhatsApp", valor: "(35) 99999-8888", observacao: "Contato principal" }],
    },
  ],
  avesArea: "", avesClassif: "", avesNomeClassif: "", avesCaracAdicional: [],
  suiTipo: "", suiAreaSimples: "", suiAreaMultipla: [], suiClassif: "",
  abFinalidade: ["Mel", "Própolis", "Polinização"],
  abArea: ["Comercial", "Hobby"],
  abDistancia: "7,5",
  abFluxo: "Migratório",
  abTipoProducao: "Orgânica",
  abPossuiCasa: "Sim",
  produtos: [
    { id: 1, produto: "Mel", quantidade: "100", unidade: "Quilogramas (kg)" },
    { id: 2, produto: "Própolis", quantidade: "20", unidade: "Gramas (g)" },
  ],
  realizaAlimentacao: "Sim",
  alimentacoes: [{ id: 1, quando: "Inverno", qual: "Mistura Proteica" }],
  tipoDestinoProd: ["Estabelecimento com inspeção SIF", "Consumidor Final"],
  destinoOutro: "",
  escalaComercio: ["Intraestadual", "Interestadual"],
  comercioOutro: "",
  tipoComercioRainhas: ["Intramunicipal"],
  comercioRainhasOutro: "",
  latitude: "-21.233481", longitude: "-44.991278",
  anexos: [{ id: 1, nome: "licenca_ambiental.pdf", descricao: "Licença ambiental do apiário" }],
  observacao: "Núcleo em conformidade. Última inspeção sem irregularidades.",
};


export interface ProdutorVinculado {
  nome: string;
  documento: string; // CPF ou CNPJ
}

export interface ContatoFornecedor {
  id: string;
  tipo: string;
  valor: string;
  observacao: string;
}

export interface FornecedorAbelha {
  id: number;
  possuiCadastro: "Sim" | "Não" | "";
  // quando "Sim" (exploração de abelhas cadastrada)
  fornecedorCod: string;
  especie: string;
  // quando "Não" (manual)
  nomeFornecedor: string;
  estado: string;
  municipio: string;
  contatos: ContatoFornecedor[];
}

export interface AlimentacaoArtificial {
  id: number;
  quando: string;
  qual: string;
}

export interface ProdutoProduzido {
  id: number;
  produto: string;
  quantidade: string;
  unidade: string; // somente leitura — vem do cadastro do produto
}

export interface AnexoNucleo {
  id: number;
  nome: string;
  descricao: string;
}

export interface NucleoProducaoCadastro {
  // --- Identificação / Situação ---
  codigo: string;        // 17 dígitos gerado após cadastro (RNE002)
  nome: string;
  situacao: "Ativo" | "Inativo" | "Suspenso";

  // --- Exploração Pecuária (define grupo/espécie) ---
  exploracaoCodigo: string;
  especie: string;
  grupo: "Aves" | "Suídeos" | "Abelhas";
  estabNome: string;
  estabCodigo: string;
  produtores: ProdutorVinculado[];

  // --- Informações Complementares (Aves / Suídeos) ---
  numGalpoes: string;
  capacidade: string;
  possuiPiquetes: "Sim" | "Não" | "";
  numPiquetes: string;

  // --- Material Genético ---
  materialImportado: "Sim" | "Não" | "";          // Aves / Suídeos / Abelha com ferrão
  paisOrigem: string;
  possuiMaterialImportadoAbelha: "Sim" | "Não" | ""; // pergunta interna do grupo Abelhas

  // --- Identificação das espécies (Abelhas) ---
  subespecies: string[];
  origemEnxames: string[];
  fornecedores: FornecedorAbelha[];

  // --- Caracterização — Aves ---
  avesArea: string;
  avesClassif: string;
  avesNomeClassif: string;
  avesCaracAdicional: string[];

  // --- Caracterização — Suídeos ---
  suiTipo: string;
  suiAreaSimples: string;
  suiAreaMultipla: string[];
  suiClassif: string;

  // --- Caracterização — Abelhas (apiário/meliponário) ---
  abFinalidade: string[];
  abArea: string[];
  abDistancia: string;
  abFluxo: "Fixo" | "Migratório" | "";
  abTipoProducao: string;
  abPossuiCasa: "Sim" | "Não" | "";
  produtos: ProdutoProduzido[];
  realizaAlimentacao: "Sim" | "Não" | "";
  alimentacoes: AlimentacaoArtificial[];
  tipoDestinoProd: string[];
  destinoOutro: string;
  escalaComercio: string[];
  comercioOutro: string;
  tipoComercioRainhas: string[];
  comercioRainhasOutro: string;

  // --- Localização / Anexos / Observações ---
  latitude: string;
  longitude: string;
  anexos: AnexoNucleo[];
  observacao: string;
}

// ============================================================
// EXEMPLO 1 — ABELHAS (Abelha com Ferrão) → cadastro mais completo
// Aciona: Identificação, Fornecedores, Material Genético, Caracterização
// do apiário, Destinos migratórios, Produtos, Alimentação e Destinos.
// ============================================================
export const nucleoExemploAbelhas: NucleoProducaoCadastro = {
  codigo: "42001040005000101",
  nome: "Apiário Bom Jardim",
  situacao: "Ativo",

  exploracaoCodigo: "420010400050001",
  especie: "Abelha com Ferrão",
  grupo: "Abelhas",
  estabNome: "Fazenda Vertentes",
  estabCodigo: "42001040005",
  produtores: [
    { nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
    { nome: "José Aarão Neto", documento: "555.009.956-40" },
  ],

  numGalpoes: "",
  capacidade: "",
  possuiPiquetes: "",
  numPiquetes: "",

  materialImportado: "Sim",
  paisOrigem: "Estados Unidos",
  possuiMaterialImportadoAbelha: "Sim",

  subespecies: ["Africanizada", "Apis mellifera ligustica - Italiana"],
  origemEnxames: ["Captura", "Compra"],
  fornecedores: [
    { id: 1, possuiCadastro: "Sim", fornecedorCod: "311234567890123", especie: "Abelha com Ferrão", nomeFornecedor: "", estado: "", municipio: "", contatos: [] },
    {
      id: 2,
      possuiCadastro: "Não",
      fornecedorCod: "",
      especie: "",
      nomeFornecedor: "José Souza Mirando",
      estado: "Minas Gerais",
      municipio: "Lavras",
      contatos: [{ id: "fornecedor-2-contato-1", tipo: "WhatsApp", valor: "(35) 99999-8888", observacao: "Contato principal" }],
    },
  ],

  avesArea: "",
  avesClassif: "",
  avesNomeClassif: "",
  avesCaracAdicional: [],

  suiTipo: "",
  suiAreaSimples: "",
  suiAreaMultipla: [],
  suiClassif: "",

  abFinalidade: ["Mel", "Própolis", "Polinização"],
  abArea: ["Comercial", "Hobby"],
  abDistancia: "7,5",
  abFluxo: "Migratório",
  abTipoProducao: "Orgânica",
  abPossuiCasa: "Sim",
  produtos: [
    { id: 1, produto: "Mel", quantidade: "100", unidade: "Quilogramas (kg)" },
    { id: 2, produto: "Própolis", quantidade: "20", unidade: "Gramas (g)" },
  ],
  realizaAlimentacao: "Sim",
  alimentacoes: [{ id: 1, quando: "Inverno", qual: "Mistura Proteica" }],
  tipoDestinoProd: ["Estabelecimento com inspeção SIF", "Consumidor Final"],
  destinoOutro: "",
  escalaComercio: ["Intraestadual", "Interestadual"],
  comercioOutro: "",
  tipoComercioRainhas: ["Intramunicipal"],
  comercioRainhasOutro: "",

  latitude: "-21.233481",
  longitude: "-44.991278",
  anexos: [{ id: 1, nome: "licenca_ambiental.pdf", descricao: "Licença ambiental do apiário" }],
  observacao: "Núcleo em conformidade. Última inspeção sem irregularidades.",
};

// ============================================================
// EXEMPLO 2 — AVES (Codorna) → Informações Complementares + Caracterização (Aves)
// ============================================================
export const nucleoExemploAves: NucleoProducaoCadastro = {
  codigo: "31001040005000301",
  nome: "Núcleo Avícola São Pedro",
  situacao: "Ativo",

  exploracaoCodigo: "310010400050003",
  especie: "Codorna",
  grupo: "Aves",
  estabNome: "Fazenda Rio Preto",
  estabCodigo: "31001040005",
  produtores: [{ nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" }],

  numGalpoes: "12",
  capacidade: "13000",
  possuiPiquetes: "Sim",
  numPiquetes: "4",

  materialImportado: "Não",
  paisOrigem: "",
  possuiMaterialImportadoAbelha: "",

  subespecies: [],
  origemEnxames: [],
  fornecedores: [],

  avesArea: "Comercial",
  avesClassif: "Avicultura Industrial",
  avesNomeClassif: "",
  avesCaracAdicional: ["Corte", "Postura"],

  suiTipo: "",
  suiAreaSimples: "",
  suiAreaMultipla: [],
  suiClassif: "",

  abFinalidade: [],
  abArea: [],
  abDistancia: "",
  abFluxo: "",
  abTipoProducao: "",
  abPossuiCasa: "",
  produtos: [],
  realizaAlimentacao: "",
  alimentacoes: [],
  tipoDestinoProd: [],
  destinoOutro: "",
  escalaComercio: [],
  comercioOutro: "",
  tipoComercioRainhas: [],
  comercioRainhasOutro: "",

  latitude: "-21.245100",
  longitude: "-45.000200",
  anexos: [{ id: 1, nome: "planta_galpoes.pdf", descricao: "Planta dos galpões" }],
  observacao: "",
};

// ============================================================
// EXEMPLO 3 — SUÍDEOS (Suíno) → Caracterização (Suídeos) + Situação "Suspenso"
// ============================================================
export const nucleoExemploSuideos: NucleoProducaoCadastro = {
  codigo: "31001040005000401",
  nome: "Núcleo Suíno Vale Verde",
  situacao: "Suspenso",

  exploracaoCodigo: "310010400050004",
  especie: "Suíno",
  grupo: "Suídeos",
  estabNome: "Fazenda Rio Preto",
  estabCodigo: "31001040005",
  produtores: [{ nome: "Maria Aparecida Souza", documento: "117.333.215-95" }],

  numGalpoes: "8",
  capacidade: "5000",
  possuiPiquetes: "Não",
  numPiquetes: "",

  materialImportado: "Sim",
  paisOrigem: "Alemanha",
  possuiMaterialImportadoAbelha: "",

  subespecies: [],
  origemEnxames: [],
  fornecedores: [],

  avesArea: "",
  avesClassif: "",
  avesNomeClassif: "",
  avesCaracAdicional: [],

  suiTipo: "Tecnificada",
  suiAreaSimples: "",
  suiAreaMultipla: ["Comercial Tecnificado"],
  suiClassif: "Ciclo Completo",

  abFinalidade: [],
  abArea: [],
  abDistancia: "",
  abFluxo: "",
  abTipoProducao: "",
  abPossuiCasa: "",
  produtos: [],
  realizaAlimentacao: "",
  alimentacoes: [],
  tipoDestinoProd: [],
  destinoOutro: "",
  escalaComercio: [],
  comercioOutro: "",
  tipoComercioRainhas: [],
  comercioRainhasOutro: "",

  latitude: "-21.250000",
  longitude: "-45.010000",
  anexos: [],
  observacao: "Cadastro suspenso temporariamente para nova avaliação do conselho.",
};

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
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative flex flex-col gap-6">{children}</div>}
    </div>
  );
}

// Componente auxiliar SimNao travado - Opacidade aumentada para 70% para melhorar a legibilidade e contraste
function SimNaoDisabled({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-6 h-8 items-center pointer-events-none [&_input]:opacity-70 [&_div]:opacity-70">
        <CustomRadio label="Sim" name={name} value="Sim" checked={value === "Sim"} onChange={() => {}} disabled />
        <CustomRadio label="Não" name={name} value="Não" checked={value === "Não"} onChange={() => {}} disabled />
      </div>
    </div>
  );
}

// Helpers para compatibilidade com o CheckboxGroup
const toCheck = (arr: string[]) => arr.map((v) => ({ id: v, label: v }));

interface VisualizarNucleoProducaoProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  dados: any;
}

export function VisualizarNucleoProducaoPage({ onLogout, onNavigate, dados: dadosRecebidos }: VisualizarNucleoProducaoProps) {
  const dados = dadosRecebidos ?? DADOS_EXEMPLO_FIXO;
  const isAves = dados?.grupo === "Aves";
  const isSuideos = dados?.grupo === "Suídeos";
  const isAbelhas = dados?.grupo === "Abelhas";
  const isAbelhaComFerrao = dados?.especie === "Abelha com Ferrão";
  const isAbelhaSemFerrao = dados?.especie === "Abelha sem Ferrão";
  const origenTemCompra = dados?.origemEnxames?.includes("Compra");
  const permitePrevisaoMigracao = isAbelhas && dados?.abFluxo === "Migratório";
  const [activeTab, setActiveTab] = useState(
    dados?.abaInicial === "previsoes-migracao" && permitePrevisaoMigracao
      ? "previsoes-migracao"
      : "cadastro",
  );
  const [modalAdicionarPrevisao, setModalAdicionarPrevisao] = useState(false);
  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (isActive: boolean) => (
        <ClipboardPenLine
          size={19}
          className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
    ...(permitePrevisaoMigracao
      ? [
          {
            id: "previsoes-migracao",
            label: "Previsões de Migração",
            icon: (isActive: boolean) => (
              <CalendarClock
                size={19}
                className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}
              />
            ),
          },
        ]
      : []),
  ];

  // Mantém os checkboxes levemente opacos e bloqueados para clique
  const checkboxContainerClass = "pointer-events-none [&_input]:opacity-40 [&_svg]:opacity-50";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="nucleo-producao" hideSearch={true} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button 
            type="button" 
            onClick={() => onNavigate("nucleo-producao")} 
            className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70 font-medium"
          >
            <ArrowLeft size={15} /> Todos os Núcleos de Produção
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Núcleo de Produção</h1>
            {activeTab === "cadastro" ? (
              <button
                type="button"
                onClick={() => onNavigate("editar-nucleo-producao", dados)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalAdicionarPrevisao(true)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} />
                Adicionar Previsão
              </button>
            )}
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "cadastro" && (
          <>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FloatInput label="Código do Núcleo de Produção" value={dados?.codigo ?? ""} onChange={() => {}} disabled />
          <FloatInput label="Nome do Núcleo de Produção" value={dados?.nome ?? ""} onChange={() => {}} disabled />
            </div>
        </Section>

        {/* 2. Informações da Exploração Pecuária */}
        <Section title="Informações da Exploração Pecuária">
          <div className="flex flex-col gap-6">
            {/* Exploração Pecuária */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-700">Exploração Pecuária</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatInput
                  label="Exploração Pecuária"
                  value={dados?.exploracaoCodigo ?? ""}
                  onChange={() => {}}
                  disabled
                  icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />}
                />
                <FloatInput label="Espécie Explorada" value={dados?.especie ?? ""} onChange={() => {}} disabled />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Estabelecimento Agropecuário */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-700">Estabelecimento Agropecuário</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatInput 
                  label="Estabelecimento Agropecuário" 
                  value={dados?.estabNome ?? ""} 
                  onChange={() => {}} 
                  disabled 
                  icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />} 
                />
                <FloatInput label="Código do Estabelecimento Agropecuário" value={dados?.estabCodigo ?? ""} onChange={() => {}} disabled />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Produtores */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-700">Produtores</span>
              {dados?.produtores?.map((p: any, i: number) => (
                <div key={i} className="flex gap-3 items-center w-full">
                  <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-center">
                    <FloatInput 
                      label="Produtor" 
                      value={p.nome ?? ""} 
                      onChange={() => {}} 
                      disabled 
                      icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} 
                    />
                    <FloatInput label="CPF" value={p.documento ?? ""} onChange={() => {}} disabled />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 3. Informações Complementares (Aves ou Suídeos) */}
        {(isAves || isSuideos) && (
          <Section title="Informações Complementares">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <FloatInput label="Número de Galpões" value={dados?.numGalpoes ?? ""} onChange={() => {}} disabled className="flex-1" />
                <FloatInput label="Capacidade de Alojamento" value={dados?.capacidade ?? ""} onChange={() => {}} disabled className="flex-1" />
              </div>

              <div className="flex flex-row items-end gap-4">
                <SimNaoDisabled label="Possui Piquetes?" name="possui-piquetes-vis" value={dados?.possuiPiquetes ?? ""} />
                {dados?.possuiPiquetes === "Sim" && (
                  <FloatInput label="Número de Piquetes" value={dados?.numPiquetes ?? ""} onChange={() => {}} disabled className="w-[260px]" />
                )}
              </div>

              <div className="flex flex-row items-end gap-4 pt-1">
                <SimNaoDisabled label="Possui Material Genético Importado?" name="mat-genetico-vis" value={dados?.materialImportado ?? ""} />
                {dados?.materialImportado === "Sim" && (
                  <FloatInput label="País de Origem do Material Genético" value={dados?.paisOrigem ?? ""} onChange={() => {}} disabled className="w-[340px]" />
                )}
              </div>
            </div>
          </Section>
        )}

        {/* 4. Identificação das Espécies Produzidas (Abelhas) */}
        {isAbelhas && (
          <Section title="Informações das Espécies Produzidas">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {isAbelhaComFerrao && (
                  <div className={checkboxContainerClass}>
                    <CheckboxGroup
                      title="Subespécies"
                      actionLabel=""
                      options={toCheck([
                        "Africanizada", "Apis mellifera mellifera - Alemã", "Apis mellifera ligustica - Italiana",
                        "Apis mellifera carnica - sudeste europeu", "Apis mellifera caucasica - Cáucaso",
                      ])}
                      defaultValue={dados?.subespecies ?? []}
                      onChange={() => {}}
                      orientation="vertical"
                      disabled
                    />
                  </div>
                )}
                {isAbelhaSemFerrao && (
                  <div className={checkboxContainerClass}>
                    <CheckboxGroup
                      title="Subespécies"
                      actionLabel=""
                      options={toCheck(["(Lista pendente de definição)"])}
                      defaultValue={dados?.subespecies ?? []}
                      onChange={() => {}}
                      orientation="vertical"
                      disabled
                    />
                  </div>
                )}

                <div className={checkboxContainerClass}>
                  <CheckboxGroup
                    title="Origem dos Enxames"
                    actionLabel=""
                    options={toCheck(["Captura", "Compra", "Multiplicação"])}
                    defaultValue={dados?.origemEnxames ?? []}
                    onChange={() => {}}
                    orientation="vertical"
                    disabled
                    />
                </div>
              </div>

              {isAbelhaComFerrao && (
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 mt-2">
                  <SimNaoDisabled label="Possui material genético importado?" name="mat-gen-abelha-vis" value={dados?.possuiMaterialImportadoAbelha ?? ""} />
                </div>
              )}

              {origenTemCompra && (
                <div className="flex flex-col gap-5 mt-2 border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-700">Fornecedores</span>
                  {dados?.fornecedores?.map((f: any, index: number) => {
                    const ehUltimoItem = index === dados.fornecedores.length - 1;
                    return (
                      <div key={f.id} className={`w-full flex flex-col gap-4 ${!ehUltimoItem ? "border-b border-gray-100 pb-5" : ""}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <SimNaoDisabled label="Fornecedor cadastrado no IMA?" name={`forn-cad-vis-${f.id}`} value={f.possuiCadastro} />
                          </div>
                        </div>

                        <div className="pl-9 pr-12 w-full">
                          {f.possuiCadastro === "Sim" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              <FloatInput label="Fornecedor" value={f.fornecedorCod ?? ""} onChange={() => {}} disabled icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />} />
                              <FloatInput label="Espécie Explorada" value={f.especie ?? ""} onChange={() => {}} disabled />
                            </div>
                          )}

                          {f.possuiCadastro === "Não" && (
                            <div className="flex flex-col gap-4 w-full">
                              <FloatInput label="Nome do Fornecedor" value={f.nomeFornecedor ?? ""} onChange={() => {}} disabled />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <FloatInput label="Estado" value={f.estado ?? ""} onChange={() => {}} disabled />
                                <FloatInput label="Município" value={f.municipio ?? ""} onChange={() => {}} disabled />
                              </div>
                              {(f.contatos || []).length > 0 && (
                                <div className="flex flex-col gap-3 w-full">
                                  <span className="text-xs font-semibold text-gray-500 ml-1">Contatos Adicionais</span>
                                  {(f.contatos || []).map((contato: ContatoFornecedor) => (
                                    <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start rounded-xl">
                                      <FloatInput label="Tipo de Contato" value={contato.tipo} onChange={() => {}} disabled className="md:col-span-3" />
                                      <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} value={contato.valor} onChange={() => {}} disabled className="md:col-span-4" />
                                      <div className="md:col-span-5 relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-gray-50">
                                        <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                                        <textarea value={contato.observacao} disabled className="w-full bg-transparent text-sm text-gray-500 outline-none resize-none flex-1 mt-1 leading-tight" />
                                        <span className="text-right text-[9px] text-gray-400">{(contato.observacao || "").length}/1500</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 5. Caracterização do Núcleo */}
        <Section title="Caracterização do Núcleo">
          <div className="flex flex-col gap-4 w-full">
            {/* Caracterização — Aves */}
            {isAves && (
              <div className="flex flex-row items-end gap-3 w-full">
                <div className="flex-1"><FloatInput label="Área de Atuação" value={dados?.avesArea ?? ""} onChange={() => {}} disabled /></div>
                {dados?.avesClassif && <div className="flex-1"><FloatInput label="Classificação" value={dados?.avesClassif ?? ""} onChange={() => {}} disabled /></div>}
                {dados?.avesClassif === "Outra" && <div className="flex-1"><FloatInput label="Nome da Classificação" value={dados?.avesNomeClassif ?? ""} onChange={() => {}} disabled /></div>}
                <div className="flex-1"><FloatInput label="Caracterização Adicional" value={dados?.avesCaracAdicional?.[0] ?? ""} onChange={() => {}} disabled /></div>
              </div>
            )}

            {/* Caracterização — Suídeos */}
            {isSuideos && (
              <div className="flex flex-col gap-5">
                <FloatInput label="Tipo de Production Técnica" value={dados?.suiTipo ?? ""} onChange={() => {}} disabled />
                {dados?.suiTipo === "Não tecnificada" && (
                  <FloatInput label="Área de Atuação" value={dados?.suiAreaSimples ?? ""} onChange={() => {}} disabled />
                )}
                {dados?.suiTipo === "Tecnificada" && (
                  <div className={checkboxContainerClass}>
                    <CheckboxGroup title="Área de Atuação" actionLabel="" options={toCheck(["Material de Multiplicação Animal (Reprodução)", "Ensino e Pesquisa", "Comercial Tecnificado"])} defaultValue={dados?.suiAreaMultipla ?? []} onChange={() => {}} orientation="horizontal" disabled />
                  </div>
                )}
                {dados?.suiAreaMultipla?.includes("Comercial Tecnificado") && (
                  <FloatInput label="Classificação" value={dados?.suiClassif ?? ""} onChange={() => {}} disabled />
                )}
              </div>
            )}

            {/* Caracterização — Abelhas */}
            {isAbelhas && (
              <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-4">
                  <div className={checkboxContainerClass}>
                    <CheckboxGroup title="Finalidade" actionLabel="" options={toCheck(["Mel", "Própolis", "Cera", "Pólen", "Geleia Real", "Apitoxina", "Polinização", "Rainhas", "Enxames"])} defaultValue={dados?.abFinalidade ?? []} onChange={() => {}} orientation="horizontal" disabled />
                  </div>
                  <div className={checkboxContainerClass}>
                    <CheckboxGroup title="Área de Atuação" actionLabel="" options={toCheck(["Comercial", "Subsistência", "Ensino e Pesquisa", "Hobby"])} defaultValue={dados?.abArea ?? []} onChange={() => {}} orientation="horizontal" disabled />
                  </div>
                </div>

                <div className="flex gap-3">
                  <FloatInput label="Distância entre apiários/meliponários mais próximos (KM)" value={dados?.abDistancia ?? ""} onChange={() => {}} disabled className="flex-1" />
                  <FloatInput label="Fluxo" value={dados?.abFluxo ?? ""} onChange={() => {}} disabled className="w-[220px]" />
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-gray-700 block mb-3">Alimentação Artificial</span>
                  <SimNaoDisabled label="Realiza alimentação artificial?" name="alim-art-vis" value={dados?.realizaAlimentacao ?? ""} />
                  
                  {dados?.realizaAlimentacao === "Sim" && (
                    <div className="flex flex-col gap-4 mt-2">
                      {dados?.alimentacoes?.map((a: any, index: number) => {
                        const ehUltimoItem = index === dados.alimentacoes.length - 1;
                        return (
                          <div key={a.id} className="w-full flex flex-col gap-3">
                            <div className="flex gap-3 items-center w-full">
                              <div className="flex-shrink-0 w-7 h-7 bg-[#1A7A3C] text-white rounded-full flex items-center justify-center text-xs font-semibold">{index + 1}</div>
                              <FloatInput label="Quando é realizada?" value={a.quando ?? ""} onChange={() => {}} disabled className="flex-1" />
                              <FloatInput label="Qual alimentação é utilizada?" value={a.qual ?? ""} onChange={() => {}} disabled className="flex-1" />
                            </div>
                            {!ehUltimoItem && <div className="border-b border-gray-100 my-1 ml-10"></div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 6. Informações de Produção */}
        {isAbelhas && (
          <Section title="Informações de Produção">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-3 items-end w-full">
                <FloatInput label="Tipo de Produção" value={dados?.abTipoProducao ?? ""} onChange={() => {}} disabled className="flex-1" />
                <div className="flex-1 w-full">
                  <SimNaoDisabled label="Possui casa de mel, própolis, cera, pólen, geleia real ou apitoxina?" name="casa-vis" value={dados?.abPossuiCasa ?? ""} />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                <span className="text-sm font-semibold text-gray-700">Produtos Produzidos</span>
                {dados?.produtos?.map((pr: any, index: number) => {
                  const ehUltimoItem = index === dados.produtos.length - 1;
                  return (
                    <div key={pr.id} className="w-full flex flex-col gap-3">
                      <div className="flex gap-3 items-center w-full">
                        <div className="flex-shrink-0 w-7 h-7 bg-[#1A7A3C] text-white rounded-full flex items-center justify-center text-xs font-semibold">{index + 1}</div>
                        <FloatInput label="Produto" value={pr.produto ?? ""} onChange={() => {}} disabled className="flex-1" icon={<ShoppingCart size={18} />} />
                        <FloatInput label="Quantidade Máxima" value={pr.quantidade ?? ""} onChange={() => {}} disabled className="w-[180px]" />
                        <FloatInput label="Unidade de Medida" value={pr.unidade ?? ""} onChange={() => {}} disabled className="w-[160px]" />
                      </div>
                      {!ehUltimoItem && <div className="border-b border-gray-100 my-1 ml-10"></div>}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-5 border-t border-gray-100 pt-4">
                {dados?.abFinalidade?.some((f: string) => !f.includes("Rainha") && !f.includes("Enxame")) && (
                  <>
                    <span className="text-sm font-semibold text-gray-700">Destino de Produtos</span>
                    <div className={checkboxContainerClass}>
                      <CheckboxGroup title="Tipo de Destino" actionLabel="" options={toCheck(["Estabelecimento com inspeção SIF", "Estabelecimento com inspeção SIE", "Estabelecimento com inspeção SIM", "Consumidor Final", "Outro"])} defaultValue={dados?.tipoDestinoProd ?? []} onChange={() => {}} orientation="vertical" disabled />
                    </div>
                    {dados?.tipoDestinoProd?.includes("Outro") && <FloatInput label="Destino" value={dados?.destinoOutro ?? ""} onChange={() => {}} disabled />}
                    
                    <div className={checkboxContainerClass}>
                      <CheckboxGroup title="Escala de Comércio" actionLabel="" options={toCheck(["Intramunicipal", "Intraestadual", "Interestadual", "Exportação"])} defaultValue={dados?.escalaComercio ?? []} onChange={() => {}} orientation="horizontal" disabled />
                    </div>
                    {dados?.escalaComercio?.includes("Outro") && <FloatInput label="Comércio" value={dados?.comercioOutro ?? ""} onChange={() => {}} disabled />}
                  </>
                )}

                {dados?.abFinalidade?.some((f: string) => f.includes("Rainha") || f.includes("Enxame")) && (
                  <>
                    <span className="text-sm font-semibold text-gray-700">Destino de Rainhas e Enxames</span>
                    <div className={checkboxContainerClass}>
                      <CheckboxGroup title="Escala de Comércio" actionLabel="" options={toCheck(["Intramunicipal", "Intraestadual", "Interestadual", "Exportação"])} defaultValue={dados?.tipoComercioRainhas ?? []} onChange={() => {}} orientation="horizontal" disabled />
                    </div>
                    {dados?.tipoComercioRainhas?.includes("Outro") && <FloatInput label="Comércio" value={dados?.comercioRainhasOutro ?? ""} onChange={() => {}} disabled />}
                  </>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* 7. Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex gap-3 w-full">
            <FloatInput label="Latitude" value={dados?.latitude ?? ""} onChange={() => {}} disabled className="flex-1" />
            <FloatInput label="Longitude" value={dados?.longitude ?? ""} onChange={() => {}} disabled className="flex-1" />
          </div>
        </Section>

        {/* 8. Anexos e Observações */}
        <Section title="Anexos e Observações">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-3">
              {dados?.anexos?.map((a: any) => (
                <div key={a.id} className="flex gap-3 items-start">
                  <UploadField label="Documento" fileName={a.nome} onSelectFile={() => {}} disabled />
                  {a.nome && (
                    <div className="flex-1">
                      <FloatInput label="Descrição" value={a.descricao ?? ""} onChange={() => {}} disabled />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <LargeTextArea label="Observação" value={dados?.observacao ?? ""} onChange={() => {}} disabled />
          </div>
        </Section>

        
      {/* Seção: Situação do Cadastro (Inserido no final da visualização) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
          <p className="text-xs text-gray-400 font-normal">
            Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
          </p>
        </div>
        
        {/* Badge Status Ativo com Ícone Check */}
        <div className="flex items-center gap-1.5 px-4 h-8 bg-[#E6F4EA] border border-[#A3E2B8] rounded-full text-[#1A7A3C] text-xs font-semibold flex-shrink-0 select-none">
          <svg className="w-3.5 h-3.5 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Ativo
        </div>
      </div>

          </>
        )}

        {activeTab === "previsoes-migracao" && permitePrevisaoMigracao && (
          <PrevisaoMigracaoTab onNavigate={onNavigate} nucleo={dados} />
        )}

      </main>

      <AdicionarPrevisaoMigracaoModal
        open={modalAdicionarPrevisao}
        onClose={() => setModalAdicionarPrevisao(false)}
        onNavigate={onNavigate}
        nucleo={dados}
      />
    </div>
  );
}
