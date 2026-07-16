import React, { useState, useMemo } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, AlertTriangle, Sprout, Building2, UserRound, Trash2, 
         PlusCircle, Eye, Download, Calendar, Dna } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox, CustomButton, CustomRadio, UploadField, LargeTextArea, CheckboxGroup, SimNao } from "../../../components/ui/FormKit";
import { EntitySearchInput, DynamicListWrapper, EstabelecimentoAgropecuarioInput, ProdutorInput, ExploracaoPecuariaInput } from "../../../components/ui/EntitySearch";



const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (US060 - AC3)
// ==========================================================
const TIPOS_PRODUTOR = ["Inquilino", "Arrendatário", "Assentado", "Comodatário", "Beneficiário de doação com reserva de usufruto", "Meeiro", "Parceiro Rural", "Posseiro", "Possuidor", "Proprietário", "Sócio", "Usufrutuário"];
const UNIDADE_AREA = ["Metros Quadrados", "Hectares"];

const BOV_AREA = ["Pecuária de Leite", "Pecuária de Corte"];
const SISTEMA_CRIACAO = ["Intensivo", "Semi-Intensivo", "Extensivo"];
const BOV_INSTAL_LEITE = ["Curral", "Tronco de Contenção", "Estação de Monta", "Embarcadouro", "Balança", "Ordenha Mecânica"];
const BOV_INSTAL_OUTRO = ["Curral", "Tronco de Contenção", "Estação de Monta", "Embarcadouro", "Balança"];

const CAP_AREA = ["Pecuária de Leite", "Pecuária de Corte", "Pecuária de Lã", "Pecuária de Couro"];
const CAP_INSTAL = ["Estação de Monta"];

const EQUI_AREA = ["Sem fins comerciais", "Comercial", "Reprodução"];
const EQUI_SISTEMA = ["Intensiva", "Semi-Intensiva", "Extensiva"];
const EQUI_TIPO_EXPLORACAO = ["Propriedade de Espera de Abate de Equídeos (PEAE)", "Haras", "Alojamento", "Unidade Militar", "Hospital Veterinário", "Centro de Ensino e Pesquisa", "Propriedades Fornecedoras de Equídeos (PFE)", "Central de Reprodução", "Esporte", "Lazer", "Equoterapia", "Propriedade Rural Comum (Animais de Trabalho)"];
const EQUI_INSTAL = ["Curral de Manejo", "Redondel", "Tronco de Contenção", "Estação de Monta", "Embarcadouro", "Piquetes", "Baias"];

const APTIDAO = ["Corte", "Ornamental"];
const BACIAS = ["Rio São Francisco", "Rio Grande", "Rio Paranaíba", "Rio Doce", "Rio Jequitinhonha", "Rio Pardo", "Rio Paraíba do Sul"];
const ORIGEM_CAPTACAO = ["Dentro do Estabelecimento", "Fora do Estabelecimento"];
const FONTE_CAPTACAO = ["Rede de abastecimento público", "Água de chuva", "Córrego", "Rio", "Lago", "Reservatório", "Açude", "Nascente", "Mina", "Poço"];
const FINALIDADE_PRODUCAO = ["Ciclo Completo", "Reprodução/Larvicultura", "Cria/Recria", "Engorda", "Recreação", "Quarentena", "Subsistência", "Outra"];
// Ornamentais: apenas Ciclo Completo e Cria/Recria
const FINALIDADE_PRODUCAO_ORNAMENTAL = ["Ciclo Completo", "Cria/Recria"];
const TIPO_PISC_ORNAMENTAL = ["Unidade de Distribuição", "Unidade de Produção", "Unidade de Produção de Pequeno Porte"];
const ORIGEM_MATRIZES = ["Nacional", "Importação", "Selvagem", "Própria"];
const SISTEMA_PRODUCAO = ["Semiaberto", "Semifechado", "Fechado"];
// Ornamentais: sem "Semiaberto"
const SISTEMA_PRODUCAO_ORNAMENTAL = ["Semifechado", "Fechado"];
const SIST_SEMIFECHADO = ["Em estufa", "Tanque Escavado", "Tanque Suspenso", "Raceway"];
// Ornamentais: sem "Em estufa"
const SIST_SEMIFECHADO_ORNAMENTAL = ["Tanque Escavado", "Tanque Suspenso", "Raceway"];
const SIST_FECHADO = ["Em estufa", "Tanque Suspenso", "Aquário"];
// Demais (redondos): sem "Aquário"
const SIST_FECHADO_DEMAIS = ["Em estufa", "Tanque Suspenso"];
const ABASTECIMENTO = ["Tubulação", "Canal Permeável", "Canal Impermeável", "Independente para cada Tanque", "Passa de um Tanque para Outro", "Não se aplica"];
const LOCAL_DESCARTE = ["Mesmo Corpo de Captação", "Outro Corpo d'água", "Rede de Esgoto", "Outra Unidade de Criação"];
const DESTINO_ORNAMENTAL = ["Unidade de Produção", "Revendedora", "Distribuidor", "Consumidor Final"];
const DESTINO_DEMAIS = ["Estabelecimento com inspeção SIF", "Estabelecimento com inspeção SIE", "Estabelecimento com inspeção SIM", "Consumidor Final", "Peixaria", "Outros Estabelecimentos de Aquicultura", "Outro"];
const ESCALA_COMERCIO = ["Intramunicipal", "Intraestadual", "Interestadual", "Exportação"];
const TRATAMENTOS = ["Nenhum", "UV", "Cloração", "Filtro de Areia", "Filtro de Calcário", "Filtro de Carvão Ativado", "Correção de pH", "Tanque de Decantação", "Biológico", "Outro"];

// ==========================================================
// MOCKS
// ==========================================================
const ESTABELECIMENTOS_MOCK = [
  { id: 1, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", areaProdutivaHa: 1000, areaProdutivaM2: 10000000 },
  { id: 2, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG", areaProdutivaHa: 500, areaProdutivaM2: 5000000 },
];
const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos", temSubespecies: false },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos", temSubespecies: false },
  { id: 3, codigo: "ESP-003", nome: "Caprino", grupo: "Caprinos", temSubespecies: false },
  { id: 4, codigo: "ESP-004", nome: "Ovino", grupo: "Ovinos", temSubespecies: false },
  { id: 5, codigo: "ESP-005", nome: "Equino", grupo: "Equídeos", temSubespecies: false },
  { id: 6, codigo: "ESP-006", nome: "Peixe Redondo", grupo: "Peixes", temSubespecies: true },
  { id: 7, codigo: "ESP-007", nome: "Peixe Ornamental", grupo: "Peixes", temSubespecies: true },
];
const SUBESPECIES_MOCK = [
  { id: 1, nome: "Tambacu" }, { id: 2, nome: "Tambaqui" }, { id: 3, nome: "Pacu" }, { id: 4, nome: "Acará-disco" },
];
const PRODUTORES_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95" },
];
const EXPLORACOES_MOCK = [
  { id: 1, codigo: "310010400050001", estabNome: "Fazenda Rio Preto", especie: "Bovino" },
  { id: 2, codigo: "420010400050002", estabNome: "Fazenda Vertentes", especie: "Peixe Redondo" },
];

const RACAS_MOCK = [
  { id: 1, nome: "Nelore" },
  { id: 2, nome: "Holandês" },
  { id: 3, nome: "Mangalarga Marchador" },
  { id: 4, nome: "Angus" },
  { id: 5, nome: "Saanen" },
  { id: 6, nome: "Mental" },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}
function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
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

const toCheck = (arr: string[]) => arr.map((v) => ({ id: v, label: v }));
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Bloco reutilizável de Ciclo de Produção
type Ciclo = { quantidade: string; unidade: string; tamanho: string; quantidadeTanques: string };
const cicloVazio = (): Ciclo => ({ quantidade: "", unidade: "", tamanho: "", quantidadeTanques: "" });
function CicloProducao({
  titulo, ciclo, setCiclo, labelQuantidade, unidadeOpcoes, unidadeReadonly = false,
}: {
  titulo: string; ciclo: Ciclo; setCiclo: (c: Ciclo) => void;
  labelQuantidade: string; unidadeOpcoes: string[]; unidadeReadonly?: boolean;
}) {
  return (
    <SubGrupo titulo={titulo} comDivisor>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FloatInput label={labelQuantidade} required value={ciclo.quantidade} onChange={(v) => setCiclo({ ...ciclo, quantidade: v })} maxLength={255} />
        {unidadeReadonly ? (
          <FloatInput label="Unidade de Medida dos Tanques" required disabled value={ciclo.unidade || unidadeOpcoes[0]} onChange={() => {}} />
        ) : (
          <FloatSelect label="Unidade de Medida dos Tanques" required value={ciclo.unidade} onChange={(v) => setCiclo({ ...ciclo, unidade: v })} options={toOptions(unidadeOpcoes)} />
        )}
        <FloatInput label="Tamanho médio dos tanques" required value={ciclo.tamanho} onChange={(v) => setCiclo({ ...ciclo, tamanho: v })} maxLength={255} />
        <FloatInput label="Quantidade de Tanques" required value={ciclo.quantidadeTanques} onChange={(v) => setCiclo({ ...ciclo, quantidadeTanques: v })} maxLength={255} />
      </div>
    </SubGrupo>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR EXPLORAÇÃO PECUÁRIA (US060 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarExploracaoPecuariaPage({ onLogout, onNavigate }: PageProps) {
  // Estabelecimento + Área
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [unidadeArea, setUnidadeArea] = useState("Hectares");
  const [areaUtil, setAreaUtil] = useState("");

  // Produtores
  const [titularTipo, setTitularTipo] = useState("");
  const [produtor, setProdutor] = useState<any | null>(null);
  const [outrosProdutores, setOutrosProdutores] = useState<any[]>([]);
  // Contrato de vínculo
  const [contratoVinculo, setContratoVinculo] = useState("");
  const [possuiVencimento, setPossuiVencimento] = useState<boolean>("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [descricaoContrato, setDescricaoContrato] = useState<string>("");
  const [raca, setRaca] = useState<any | null>(null); // <-- Novo estado adicionado aqui

  // Espécie
  const [especie, setEspecie] = useState<any | null>(null);
  const [subespecies, setSubespecies] = useState<any[]>([]);

  // Complementares — Bovinos/Bubalinos
  const [bovArea, setBovArea] = useState<string[]>([]);
  const [bovSistema, setBovSistema] = useState("");
  const [bovInstal, setBovInstal] = useState<string[]>([]);
  // Caprinos/Ovinos
  const [capArea, setCapArea] = useState<string[]>([]);
  const [capInstal, setCapInstal] = useState<string[]>([]);
  // Equídeos
  const [equiArea, setEquiArea] = useState("");
  const [equiSistema, setEquiSistema] = useState("");
  const [equiTipoExp, setEquiTipoExp] = useState<string[]>([]);
  const [equiInstal, setEquiInstal] = useState<string[]>([]);
  // Peixes
  const [aptidao, setAptidao] = useState("");
  const [bacia, setBacia] = useState("");
  const [origemCaptacao, setOrigemCaptacao] = useState<string[]>([]);
  const [fonteCaptacao, setFonteCaptacao] = useState<string[]>([]);
  const [nomeCorrego, setNomeCorrego] = useState("");
  const [nomeRio, setNomeRio] = useState("");
  const [nomeLago, setNomeLago] = useState("");
  const [nomeReservatorio, setNomeReservatorio] = useState("");
  const [fonteOutro, setFonteOutro] = useState("");
  const [finalidadeProducao, setFinalidadeProducao] = useState("");
  const [finalidadeOutra, setFinalidadeOutra] = useState("");
  const [tipoPiscicultura, setTipoPiscicultura] = useState("");
  const [origemMatrizes, setOrigemMatrizes] = useState<string[]>([]);
  const [origemMatrizesOutra, setOrigemMatrizesOutra] = useState("");
  const [sistemaProducao, setSistemaProducao] = useState("");
  const [sistSemifechado, setSistSemifechado] = useState<string[]>([]);
  const [sistFechado, setSistFechado] = useState<string[]>([]);
  const [abastecimento, setAbastecimento] = useState<string[]>([]);
  const [localDescarte, setLocalDescarte] = useState<string[]>([]);
  const [realizaDepuracao, setRealizaDepuracao] = useState("");
  const [tipoDestino, setTipoDestino] = useState<string[]>([]);
  const [destinoOutro, setDestinoOutro] = useState("");
  const [escalaComercio, setEscalaComercio] = useState<string[]>([]);
  const [tratAfluente, setTratAfluente] = useState<string[]>([]);
  const [tratAfluenteOutro, setTratAfluenteOutro] = useState("");
  const [tratEfluente, setTratEfluente] = useState<string[]>([]);
  const [tratEfluenteOutro, setTratEfluenteOutro] = useState("");
  // ciclos
  const [cicloRepro, setCicloRepro] = useState<Ciclo>(cicloVazio());
  const [cicloEngorda, setCicloEngorda] = useState<Ciclo>(cicloVazio());
  const [cicloCria, setCicloCria] = useState<Ciclo>(cicloVazio());
  const [cicloUP, setCicloUP] = useState<Ciclo>(cicloVazio());
  const [cicloUD, setCicloUD] = useState<Ciclo>(cicloVazio());

  // Sub exploração
  const [isSub, setIsSub] = useState<boolean>("");
  const [exploracao, setExploracao] = useState<any | null>(null);


  // Anexos / Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  // ---- Derivados ----
  const grupo = especie?.grupo ?? "";
  const nomeEspecie = especie?.nome ?? "";
  const isBovBub = nomeEspecie === "Bovino" || nomeEspecie === "Bubalino";
  const isCapOv = nomeEspecie === "Caprino" || nomeEspecie === "Ovino";
  const isEqui = grupo === "Equídeos";
  const isPeixes = grupo === "Peixes";
  const isOrnamental = aptidao === "Ornamental" || nomeEspecie === "Peixe Ornamental";

  // Área produtiva (somente leitura, conforme unidade)
  const areaProdutiva = estabelecimento
    ? (unidadeArea === "Hectares" ? estabelecimento.areaProdutivaHa : estabelecimento.areaProdutivaM2)
    : null;
  const areaUtilNum = Number(String(areaUtil).replace(",", ".")) || 0;
  const sobreposicao = areaProdutiva != null && areaUtilNum > Number(areaProdutiva);

  // RNE004: algum produtor não-proprietário → contrato de vínculo obrigatório
  const algumNaoProprietario =
    (titularTipo !== "" && titularTipo !== "Proprietário") ||
    outrosProdutores.some((o) => o.tipo && o.tipo !== "Proprietário");

  // Bovinos: instalações dependem de "Pecuária de Leite"
  const bovInstalOpcoes = bovArea.includes("Pecuária de Leite") ? BOV_INSTAL_LEITE : BOV_INSTAL_OUTRO;

  // Ciclos de corte exibidos conforme finalidade
  const showRepro = finalidadeProducao === "Ciclo Completo" || finalidadeProducao === "Reprodução/Larvicultura";
  const showEngorda = finalidadeProducao === "Ciclo Completo" || finalidadeProducao === "Engorda";
  const showCria = finalidadeProducao === "Ciclo Completo" || finalidadeProducao === "Cria/Recria";

  const destinoOpcoes = isOrnamental ? DESTINO_ORNAMENTAL : DESTINO_DEMAIS;

  // Listas que variam entre ornamentais e demais (peixes)
  const finalidadeOpcoes = isOrnamental ? FINALIDADE_PRODUCAO_ORNAMENTAL : FINALIDADE_PRODUCAO;
  const sistemaProducaoOpcoes = isOrnamental ? SISTEMA_PRODUCAO_ORNAMENTAL : SISTEMA_PRODUCAO;
  const sistSemifechadoOpcoes = isOrnamental ? SIST_SEMIFECHADO_ORNAMENTAL : SIST_SEMIFECHADO;
  const sistFechadoOpcoes = isOrnamental ? SIST_FECHADO : SIST_FECHADO_DEMAIS;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="exploracao-pecuaria" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("exploracao-pecuaria")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Explorações Pecuárias
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Exploração Pecuária</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
         
        </div>

        {/* 🔥 ALERTA CORRIGIDO: Adicionado mb-6 para dar respiro até a próxima seção */}
            <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
              {/* Ícone de Informação Azul/Cinza Discreto */}
              <div className="text-gray-500 flex-shrink-0">
                <Info size={20} className="stroke-[2.5]" />
              </div>
            
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
              </p>
            </div>

        {/* 1. Estabelecimento Agropecuário */}
        <Section title="Estabelecimento Agropecuário">
          <EstabelecimentoAgropecuarioInput
            value={estabelecimento ?  estabelecimento.nome : ""}
            required
            onChange={(entidadeSelecionada) => setEstabelecimento(entidadeSelecionada)}
              onEyeClick={() => {
                if (estabelecimento?.codigo) alert(`Visualizar detalhes: ${estabelecimento.codigo}`);
                else alert("Por favor, digite ou selecione uma revendedora primeiro.");
              }}
          />
        </Section>


        

        {estabelecimento && (
          <>
            {/* 2. Informações de Área */}
            <Section title="Informações de Área">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <FloatSelect label="Unidade de Medida da Área" required value={unidadeArea} onChange={setUnidadeArea} options={toOptions(UNIDADE_AREA)} />
                  <FloatInput label="Área Produtiva do Estabelecimento" required disabled value={areaProdutiva != null ? String(areaProdutiva) : ""} onChange={() => {}} />
                  <FloatInput 
                    label={
                      <div className="flex items-center gap-1.5 pointer-events-auto group relative">
                        <span className="text-gray-400">Área Útil da Exploração</span>
                        
                        {/* Asterisco adicionado manualmente no lugar correto */}
                        <span className="text-red-500 font-bold -ml-0.5">*</span>
                        
                        {/* Ícone de informação logo após o asterisco */}
                        <Info size={14} className="text-gray-400 cursor-help flex-shrink-0" />
                        
                        {/* O Informativo flutuando logo abaixo */}
                        <div className="absolute left-0 top-[34px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#e0e0e0] text-black text-xs rounded-md p-2 shadow-lg w-64 z-50 font-normal normal-case">
                         A área útil da exploração deve respeitar os limites da área produtiva disponível para a abertura de explorações no estabelecimento agropecuário. É possível que o estabelecimento já possua outras explorações abertas (pecuárias e agrícolas), o que pode levar à sobreposição.
                        </div>
                      </div>
                    }
                    /* required removido daqui para não duplicar ou quebrar a linha */
                    value={areaUtil} 
                    onChange={setAreaUtil} 
                    maxLength={12} 
                  />
                </div>
               
              </div>
            </Section>

            
          </>
        )}

        {/* 3. Produtores */}
            <Section title="Produtores">
              <div className="flex flex-col gap-6">
                <SubGrupo 
                    titulo={
                      <div className="flex items-center gap-1.5 pointer-events-auto group relative inline-flex">
                        <span>Produtor Titular</span>
                        
                        {/* Ícone de informação */}
                        <Info size={14} className="text-gray-400 cursor-help flex-shrink-0" />
                        
                        {/* O Informativo flutuando logo abaixo */}
                        <div className="absolute left-0 top-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#e0e0e0] text-black text-xs rounded-md p-2 shadow-lg w-64 z-50 font-normal normal-case block">
                          Produtor principal responsável pela exploração pecuária.
                        </div>
                      </div>
                    } 
                  >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-center">
                {/* Ocupa 1 parte do espaço (Menor) */}
                <FloatSelect 
                  label="Tipo de Produtor" 
                  required 
                  value={titularTipo} 
                  onChange={setTitularTipo} 
                  options={toOptions(TIPOS_PRODUTOR)} 
                />
                
                {/* Ocupa 2 partes do espaço (Maior) */}
                <ProdutorInput
                  value={produtor ? produtor.nome : ""}
                  required
                  onChange={(entidadeSelecionada) => setProdutor(entidadeSelecionada)}
                  onEyeClick={() => {
                    if (produtor?.codigo) alert(`Visualizar detalhes: ${produtor.codigo}`);
                    else alert("Por favor, digite ou selecione uma revendedora primeiro.");
                  }}
                />
              </div>
                </SubGrupo>

          <SubGrupo titulo="Outros Produtores" comDivisor>
            <DynamicListWrapper
              items={outrosProdutores} 
              behavior="any" 
              addButtonLabel="Adicionar Produtor"
              onAddItem={() => setOutrosProdutores((p) => [...p, { uid: uid("pr"), tipo: "", produtor: null }])}
              onRemoveItem={(i: number) => setOutrosProdutores((p) => p.filter((_, idx) => idx !== i))}
            >
              {(item: any) => (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-center w-full">
                  {/* Tipo de Produtor (Menor) */}
                  <FloatSelect 
                    label="Tipo de Produtor" 
                    required 
                    value={item.tipo} 
                    onChange={(v) => setOutrosProdutores((p) => p.map((x) => x.uid === item.uid ? { ...x, tipo: v } : x))} 
                    options={toOptions(TIPOS_PRODUTOR)} 
                  />
                  
                  {/* ProdutorInput Customizado (Maior) */}
                  <ProdutorInput
                    value={item.produtor ? item.produtor.nome : ""}
                    required
                    onChange={(entidadeSelecionada) => setOutrosProdutores((p) => p.map((x) => x.uid === item.uid ? { ...x, produtor: entidadeSelecionada } : x))}
                    onEyeClick={() => {
                      if (item.produtor?.codigo) alert(`Visualizar detalhes: ${item.produtor.codigo}`);
                      else alert("Por favor, selecione um produtor primeiro.");
                    }}
                  />
                </div>
              )}
            </DynamicListWrapper>
          </SubGrupo>

        {/* Contrato de Vínculo — se algum produtor não for proprietário */}
        {algumNaoProprietario && (
          <SubGrupo titulo="Contrato de Vínculo" comDivisor>
            
            {/* Bloco do Upload com a cópia exata da estrutura de fluxo que deu certo */}
            <div className="flex gap-3 items-start w-full mb-4">
              
              {/* 1. O Upload entra direto, sem div em volta dele, mantendo o comportamento original */}
              <UploadField 
                label="Contrato de Vínculo" 
                required 
                fileName={contratoVinculo} 
                onSelectFile={() => setContratoVinculo("contrato_de_vinculo.pdf")} 
              />
        
              {/* 💡 Só abre se houver documento anexado */}
              {contratoVinculo && (
                <>
                  {/* 2. Só a descrição cresce para ocupar o espaço que sobrou */}
                  <div className="flex-1">
                    <FloatInput
                      label="Descrição"
                      value={descricaoContrato || ""}
                      placeholder="Descrição opcional..."
                      onChange={(v) => setDescricaoContrato(v)}
                    />
                  </div>
                  
                  {/* 3. Container de ações idêntico ao do exemplo funcional */}
                  <div className="h-12 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => alert(`Fazendo download de: ${contratoVinculo}`)}
                      className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                    >
                      <Download size={20} />
                    </button>
                    
                    
                  </div>
                </>
              )}
            </div>
        
            {/* Bloco das Perguntas de Vencimento (Grid de 2 colunas mantido abaixo) */}
            {contratoVinculo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center animate-fadeIn">
                <SimNao 
                  label="Possui Data de Vencimento no Contrato de Vínculo?" 
                  name="possui-venc" 
                  required 
                  value={possuiVencimento} 
                  onChange={setPossuiVencimento} 
                />
                
                {possuiVencimento === true && (
                  <FloatInput 
                    label="Data de Vencimento" 
                    icon={<Calendar size={20} color={GREEN} />}
                    required 
                    type="date" 
                    value={dataVencimento} 
                    hasTooltip = {true}
                    tooltipText={"Quando o contrato de vínculo não constar uma data de vencimento,\né considerado um prazo padrão de 5 anos a partir da data do cadastro."}                  
                onChange={setDataVencimento} 
                  />
                )}
                
                {possuiVencimento === false && (
                  <FloatInput 
                    label="Data de Vencimento" 
                    required 
                    disabled 
                    type="date"
                    value={(() => { 
                      const d = new Date(); 
                      d.setFullYear(d.getFullYear() + 5); 
                      return d.toISOString().slice(0, 10); 
                    })()} 
                    hasTooltip = {true}
                    tooltipText={"Quando o contrato de vínculo não constar uma data de vencimento,\né considerado um prazo padrão de 5 anos a partir da data do cadastro."}                  
                
                    onChange={() => {}} 
                  />
                )}
              </div>
            )}
          </SubGrupo>
        )}


              </div>
            </Section>

           
            
{/* 4. Informações da Espécie Explorada */}
<Section title="Informações da Espécie Explorada">
  <div className="flex flex-col gap-6">
    
    {/* Subgrupo Principal: Espécie e Raça */}
    <SubGrupo titulo="Espécie">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {/* Campo de Espécie */}
        <EntitySearchInput
          label="Espécie" 
          required 
          placeholder="Buscar pelo nome da espécie."
          value={especie ? especie.nome : ""} 
          data={ESPECIES_MOCK} 
          searchKeys={["nome", "grupo"]}
          columns={[{ label: "Espécie", key: "nome" }, { label: "Grupo", key: "grupo" }]}
          icon={<Dna size={18} color={GREEN} />} 
          title="Buscar Espécie" 
          subtitle="Busque por espécie cadastrada:"
          onChange={(ent) => { 
            setEspecie(ent); 
            setRaca(null); // Reseta a raça selecionada

            if (ent) {
              const nomeEspecieLC = ent.nome.toLowerCase();
              
              // Ajusta a Aptidão automaticamente de acordo com as regras de Peixe Redondo e Ornamental
              if (nomeEspecieLC.includes("redondo")) {
                setAptidao("Corte");
              } else if (nomeEspecieLC.includes("ornamental")) {
                setAptidao("Ornamental");
              } else {
                setAptidao(""); // Reseta caso seja outro peixe
              }

              const ehObrigatorio =
                nomeEspecieLC.includes("peixe") ||
                nomeEspecieLC.includes("abelha");

              if (ehObrigatorio) {
                // Peixe ou Abelha - começa com 1 item
                setSubespecies([{ uid: uid("sub"), sub: null }]);
              } else {
                // Qualquer outra espécie - começa vazio
                setSubespecies([]);
              }
            } else {
              setSubespecies([]);
              setAptidao("");
            }
          }}
        />
      </div>
    </SubGrupo>

    {/* Subgrupo: Subespécies — sempre que houver espécie selecionada */}
    {especie && (() => {
      const nomeEspecieLC = especie?.nome?.toLowerCase() || "";
      const ehObrigatorio = nomeEspecieLC.includes("peixe") || nomeEspecieLC.includes("abelha");

      return (
        <SubGrupo titulo="Raça" comDivisor>
          <DynamicListWrapper
            key={`subespecies-list-${ehObrigatorio ? "at-least-one" : "any"}`}
            items={subespecies}
            behavior={ehObrigatorio ? "at-least-one" : "any"}
            addButtonLabel="Adicionar Raça"
            variant="plain"
            onAddItem={() => setSubespecies((p) => [...p, { uid: uid("sub"), sub: null }])}
            onRemoveItem={(i: number) => setSubespecies((p) => p.filter((_, idx) => idx !== i))}
          >
            {(item: any) => (
              <EntitySearchInput
                label="Raça"
                required={ehObrigatorio}
                placeholder="Buscar pelo nome da raça."
                value={item.sub ? item.sub.nome : ""}
                data={SUBESPECIES_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Raça", key: "nome" }]}
                icon={<Dna size={18} color={GREEN} />}
                title="Buscar Raça"
                subtitle="Busque por uma raça cadastrada:"
                onChange={(ent) =>
                  setSubespecies((p) => p.map((x) => (x.uid === item.uid ? { ...x, sub: ent } : x)))
                }
              />
            )}
          </DynamicListWrapper>
        </SubGrupo>
      );
    })()}
  

    {especie && (isBovBub || isCapOv || isEqui || isPeixes) && (
      <SubGrupo titulo="Informações Complementares" comDivisor>
        <div className="flex flex-col gap-6 mt-2">
          
          {/* Bovinos / Bubalinos */}
          {isBovBub && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
                <CheckboxGroup 
                  title="Área de Atuação" 
                  required 
                  actionLabel="" 
                  options={toCheck(BOV_AREA)} 
                  defaultValue={bovArea} 
                  onChange={setBovArea} 
                  orientation="horizontal" 
                />
                
                <FloatSelect 
                  label="Sistema de Criação" 
                  required 
                  value={bovSistema} 
                  hasTooltip={true}
                  tooltipText={"Intensivo – animais mantidos em confinamento (Concentração de animais em áreas menores com alta tecnologia). \n Semi-intensivo – parte do tempo em confinamento e parte a pasto e/ou combina o uso de pastagens com a suplementação alimentar). \nExtensivo – animais criados exclusivamente a pasto (Criação a pasto, onde os animais se alimentam principalmente de pastagens nativas ou cultivadas)."}
                  onChange={setBovSistema} 
                  options={toOptions(SISTEMA_CRIACAO)} 
                  className="w-full"
                />
              </div>
          
              <CheckboxGroup 
                title="Instalações" 
                required 
                actionLabel="" 
                options={toCheck(bovInstalOpcoes)} 
                defaultValue={bovInstal} 
                onChange={setBovInstal} 
                orientation="horizontal" 
              />
            </>
          )}

          {/* Caprinos / Ovinos */}
          {isCapOv && (
            <>
              <CheckboxGroup title="Área de Atuação" required actionLabel="" options={toCheck(CAP_AREA)} defaultValue={capArea} onChange={setCapArea} orientation="horizontal" />
              <CheckboxGroup title="Instalações" required actionLabel="" options={toCheck(CAP_INSTAL)} defaultValue={capInstal} onChange={setCapInstal} orientation="horizontal" />
            </>
          )}

          {/* Equídeos */}
          {isEqui && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatSelect label="Área de Atuação" required value={equiArea} onChange={setEquiArea} options={toOptions(EQUI_AREA)} />
                <FloatSelect 
                  label="Sistema de Criação" 
                  required value={equiSistema} 
                  hasTooltip={true}
                  tooltipText={"Intensiva – animais mantidos em confinamento (Concentração de animais em áreas menores com alta tecnologia). \n Semi-intensiva – parte do tempo em confinamento e parte a pasto e/ou combina o uso de pastagens com a suplementação alimentar). \n Extensiva – animais criados exclusivamente a pasto (Criação a pasto, onde os animais se alimentam principalmente de pastagens nativas ou cultivadas)."}
                  onChange={setEquiSistema} 
                  options={toOptions(EQUI_SISTEMA)} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <CheckboxGroup title="Tipo de Exploração" required actionLabel="" options={toCheck(EQUI_TIPO_EXPLORACAO)} defaultValue={equiTipoExp} onChange={setEquiTipoExp} orientation="vertical" />
                <CheckboxGroup title="Instalações" required actionLabel="" options={toCheck(EQUI_INSTAL)} defaultValue={equiInstal} onChange={setEquiInstal} orientation="vertical" />
              </div>
            </>
          )}

          {/* Peixes */}
          {isPeixes && (() => {
            const nomeLC = especie?.nome?.toLowerCase() || "";
            // Verifica se deve travar o campo de Aptidão em somente leitura (disabled)
            const aptidaoSomenteLeitura = nomeLC.includes("redondo") || nomeLC.includes("ornamental");

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <FloatSelect 
                    label="Aptidão" 
                    required 
                    value={aptidao} 
                    onChange={setAptidao} 
                    options={toOptions(APTIDAO)} 
                    disabled={aptidaoSomenteLeitura}
                  />
                  <FloatSelect label="Bacia Hidrográfica" required value={bacia} onChange={setBacia} options={toOptions(BACIAS)} />
                </div>

                <div className="flex flex-col gap-6">
                  <CheckboxGroup 
                    title="Origem da Captação de Água" 
                    required 
                    actionLabel="" 
                    options={toCheck(ORIGEM_CAPTACAO)} 
                    defaultValue={origemCaptacao} 
                    onChange={setOrigemCaptacao} 
                    orientation="horizontal" 
                  />
                  <CheckboxGroup 
                    title="Fonte da Captação de Água" 
                    required 
                    actionLabel="" 
                    options={toCheck(FONTE_CAPTACAO)} 
                    defaultValue={fonteCaptacao} 
                    onChange={setFonteCaptacao} 
                    orientation="grid" 
                  />
                </div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fonteCaptacao.includes("Rio") && <FloatInput label="Nome do Rio" required value={nomeRio} onChange={setNomeRio} maxLength={255} />}
                  {fonteCaptacao.includes("Reservatório") && <FloatInput label="Nome do Reservatório" required value={nomeReservatorio} onChange={setNomeReservatorio} maxLength={255} />}
                </div>
              </>
            );
          })()}
          
        </div>
      </SubGrupo>
    )}
    
  </div>
</Section>


      {/* Caracterização do Sistema Produtivo */}
{especie && isPeixes && (
  <Section title="Caracterização do Sistema Produtivo">
    <div className="flex flex-col gap-6">
      
        <div className="flex flex-col gap-12 mt-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatSelect label="Finalidade de Produção" required value={finalidadeProducao} onChange={setFinalidadeProducao} options={toOptions(finalidadeOpcoes)} />
            {finalidadeProducao === "Outra" && <FloatInput label="Finalidade" required value={finalidadeOutra} onChange={setFinalidadeOutra} maxLength={255} />}
            {isOrnamental && <FloatSelect label="Tipo de Piscicultura Ornamental" required value={tipoPiscicultura} onChange={setTipoPiscicultura} options={toOptions(TIPO_PISC_ORNAMENTAL)} />}
          </div>

          {/* 💡 Flex-row alinha o Checkbox e o Input na mesma linha */}
                  <div className="flex flex-col md:flex-row gap-6 items-end w-full">
                    
                    <div className="flex-1 w-full">
                      <CheckboxGroup 
                        title="Origem das Matrizes e Reprodutores" 
                        required 
                        actionLabel="" 
                        options={toCheck(ORIGEM_MATRIZES)} 
                        defaultValue={origemMatrizes} 
                        onChange={setOrigemMatrizes} 
                        orientation="horizontal" 
                      />
                    </div>
                    
                    {/* O input entra na mesma linha, ocupando 1/3 do espaço no desktop */}
                    {origemMatrizes.includes("Outra") && (
                      <div className="w-full md:w-1/3 animation-fade-in">
                        <FloatInput 
                          label="Origem" 
                          required 
                          value={origemMatrizesOutra} 
                          onChange={setOrigemMatrizesOutra} 
                          maxLength={255} 
                        />
                      </div>
                    )}
                  </div>

{/* 💡 Mantido items-start para alinhar os topos perfeitamente */}
<div className="flex flex-col md:flex-row gap-12 items-start w-full">
  
  {/* 💡 Modificado: Agora o Select ocupa apenas 1/3 da linha no desktop */}
  <div className="w-full md:w-1/3">
    <FloatSelect 
      label="Sistema de Produção" 
      required 
      value={sistemaProducao} 
      onChange={setSistemaProducao} 
      options={toOptions(sistemaProducaoOpcoes)} 
      className="w-full"
    />
  </div>
  
  {/* 💡 Modificado: O bloco de Checkboxes agora ganha 2/3 da linha para se espalhar mais */}
  
</div>

          

        
          <div className="grid grid-cols-3 md:grid-cols- gap-4 items-start">
            {sistemaProducao === "Semifechado" && (
    <div className="w-full md:w-2/3 animation-fade-in">
      <CheckboxGroup 
        title="Sistema de Produção Semifechado" 
        required 
        actionLabel="" 
        options={toCheck(sistSemifechadoOpcoes)} 
        defaultValue={sistSemifechado} 
        onChange={setSistSemifechado} 
        orientation="vertical" 
      />
    </div>
  )}

  {sistemaProducao === "Fechado" && (
    <div className="w-full md:w-2/3 animation-fade-in">
      <CheckboxGroup 
        title="Sistema de Produção Fechado" 
        required 
        actionLabel="" 
        options={toCheck(sistFechadoOpcoes)} 
        defaultValue={sistFechado} 
        onChange={setSistFechado} 
        orientation="vertical" 
      />
    </div>
  )}
            <CheckboxGroup title="Abastecimento" required actionLabel="" options={toCheck(ABASTECIMENTO)} defaultValue={abastecimento} onChange={setAbastecimento} orientation="vertical" />
            <CheckboxGroup title="Local de Descarte de Água" required actionLabel="" options={toCheck(LOCAL_DESCARTE)} defaultValue={localDescarte} onChange={setLocalDescarte} orientation="vertical" />
          </div>

        

          <SimNao label="Realiza depuração de peixes?" name="depuracao" required value={realizaDepuracao} onChange={setRealizaDepuracao} />
        </div>

      {/* Destino dos Animais */}
      <SubGrupo titulo="Destino dos Animais" comDivisor>
        <div className="flex flex-col gap-6 mt-2">
          <CheckboxGroup title="Tipo de Destino" required actionLabel="" options={toCheck(destinoOpcoes)} defaultValue={tipoDestino} onChange={setTipoDestino} orientation="horizontal" />
          {tipoDestino.includes("Outro") && <FloatInput label="Destino" required value={destinoOutro} onChange={setDestinoOutro} maxLength={255} className="md:w-1/2" />}
          <CheckboxGroup title="Escala de Comércio" required actionLabel="" options={toCheck(ESCALA_COMERCIO)} defaultValue={escalaComercio} onChange={setEscalaComercio} orientation="horizontal" />
        </div>
      </SubGrupo>

      {/* Tratamentos (ornamental) */}
      {isOrnamental && (
        <SubGrupo titulo="Tratamentos" comDivisor>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
            <div className="flex flex-col gap-4">
              <CheckboxGroup title="Tratamento de Afluente" required actionLabel="" options={toCheck(TRATAMENTOS)} defaultValue={tratAfluente} onChange={setTratAfluente} orientation="vertical" />
              {tratAfluente.includes("Outro") && <FloatInput label="Tratamento (Afluente)" required value={tratAfluenteOutro} onChange={setTratAfluenteOutro} maxLength={255} className="w-full" />}
            </div>
            <div className="flex flex-col gap-4">
              <CheckboxGroup title="Tratamento de Efluente" required actionLabel="" options={toCheck(TRATAMENTOS)} defaultValue={tratEfluente} onChange={setTratEfluente} orientation="vertical" />
              {tratEfluente.includes("Outro") && <FloatInput label="Tratamento (Efluente)" required value={tratEfluenteOutro} onChange={setTratEfluenteOutro} maxLength={255} className="w-full" />}
            </div>
          </div>
        </SubGrupo>
      )}

    
    </div>
  </Section>
)}

{/* 💡 A seção inteira de Ciclos só aparece se a espécie for Peixes */}
{especie && isPeixes && (
  <Section title="Ciclos de Produção">
    <div className="flex flex-col gap-6">
      
      {/* 🐟 Se for "Reprodução/Larvicultura" OU "Ciclo Completo" */}
      {(finalidadeProducao === "Reprodução/Larvicultura" || finalidadeProducao === "Ciclo Completo") && (
        <CicloProducao 
          titulo="Ciclo de Produção — Reprodução/Larvicultura" 
          ciclo={cicloRepro} 
          setCiclo={setCicloRepro} 
          labelQuantidade="Quantidade de Produção/Ciclo" 
          unidadeOpcoes={["m³", "m²"]} 
        />
      )}
      
      {/* 🐟 Se for "Engorda" OU "Ciclo Completo" */}
      {(finalidadeProducao === "Engorda" || finalidadeProducao === "Ciclo Completo") && (
        <CicloProducao 
          titulo="Ciclo de Produção — Engorda" 
          ciclo={cicloEngorda} 
          setCiclo={setCicloEngorda} 
          labelQuantidade="Quantidade de Produção/Ciclo" 
          unidadeOpcoes={["m³"]} 
          unidadeReadonly 
        />
      )}
      
      {/* 🐟 Se for "Cria/Recria" OU "Ciclo Completo" */}
      {(finalidadeProducao === "Cria/Recria" || finalidadeProducao === "Ciclo Completo") && (
        <CicloProducao 
          titulo="Ciclo de Produção — Cria/Recria" 
          ciclo={cicloCria} 
          setCiclo={setCicloCria} 
          labelQuantidade="Quantidade de Produção/Ciclo" 
          unidadeOpcoes={["m³"]} 
          unidadeReadonly 
        />
      )}

      {/* 🎏 Ciclos Ornamentais (Aparecem baseados no tipo de piscicultura se for ornamental) */}
      {isOrnamental && tipoPiscicultura === "Unidade de Produção" && (
        <CicloProducao 
          titulo="Ciclo de Produção — Unidade de Produção" 
          ciclo={cicloUP} 
          setCiclo={setCicloUP} 
          labelQuantidade="Quantidade de Comercialização/Mês" 
          unidadeOpcoes={["m³", "L"]} 
        />
      )}
      
      {isOrnamental && tipoPiscicultura === "Unidade de Distribuição" && (
        <CicloProducao 
          titulo="Ciclo de Produção — Unidade de Distribuição" 
          ciclo={cicloUD} 
          setCiclo={setCicloUD} 
          labelQuantidade="Quantidade de Comercialização/Mês" 
          unidadeOpcoes={["m³", "L"]} 
        />
      )}

    </div>
  </Section>
)}
            {/* 6. Sub Exploração Pecuária */}
           <Section title="Sub Exploração Pecuária">
  <div className="flex flex-col gap-4">
    <SimNao 
      label="É um Subarrendamento/Subcomodato?" 
      name="sub-exploracao" 
      required 
      value={isSub} 
      hasTooltip={true} 
      tooltipText="Para casos em que a exploração pecuária é uma sub alocação dentro de outra exploração pecuária."  
      onChange={setIsSub} 
    />
    
    {/* 💡 CORREÇÃO: Trocado de isSub === "Sim" para verificar o valor booleano true */}
    {isSub === true && (
      
        <ExploracaoPecuariaInput
                  value={exploracao ? exploracao.codigo : ""}
                  required
                  onChange={(entidadeSelecionada) => setExploracao(entidadeSelecionada)}
                  onEyeClick={() => {
                    if (exploracao?.codigo) alert(`Visualizar detalhes: ${exploracao.codigo}`);
                    else alert("Por favor, digite ou selecione uma revendedora primeiro.");
                  }}
                />
  
    )}
  </div>
</Section>

           {/* Seção Anexo Geral Dinâmica com Numeração */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">

                {/* Número indicador do anexo (Igual ao Representante Legal) */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">

                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos(prev =>
                          prev.map((a, i) =>
                            i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                          )
                        )
                      }
                    />



                    {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Botão de Excluir o Anexo */}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Botão para Adicionar Novo Anexo */}
            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* Seção Observação Geral */}
        <Section title="Observação">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">            <h3 className="text-lg font-bold text-gray-900">Exploração pecuária cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{especie ? `A exploração de ${especie.nome}` : "A exploração"} foi cadastrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("exploracao-pecuaria"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-exploracao-pecuaria"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}