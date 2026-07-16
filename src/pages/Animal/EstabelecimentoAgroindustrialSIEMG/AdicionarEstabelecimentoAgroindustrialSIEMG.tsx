import React, { useState, useMemo, ReactNode } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Check, Info, Trash2, PlusCircle, ShoppingCart,
  Download, Dna, Package, Ruler, Calendar, Shuffle, Beef, Milk, Disc, Layers, Home, Activity, Hexagon, Egg, Fish
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, FloatCombobox, CustomButton, UploadField,
  LargeTextArea, CheckboxGroup, SimNao, FloatMultiSelect,
} from "../../../components/ui/FormKit";
import {
  DynamicListWrapper, ProprietarioInput, ResponsavelTecnicoInput,
  ExploracaoPecuariaInput, BlocoEnderecoFields, BlocoContatoFields,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (US070 - AC3)
// ==========================================================
const AREA_ATUACAO = ["Carne", "Leite", "Mel", "Ovos", "Pescado"];

const TIPO_EAPP = ["Agricultura Familiar", "Produtor Rural"];
const SITUACAO_HABILITACAO_EAPP = ["Cadastro", "Registro"];

// ==========================================================
// MOCKS (substituir por API)
// ==========================================================
const ESPECIES_ABATE_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Suíno", grupo: "Suídeos" },
  { id: 3, codigo: "ESP-003", nome: "Frango", grupo: "Aves" },
  { id: 4, codigo: "ESP-004", nome: "Equino", grupo: "Equídeos" },
];
const ESPECIES_PESCADO_MOCK = [
  { id: 10, codigo: "ESP-010", nome: "Rã-touro", grupo: "Anfíbios" },
  { id: 11, codigo: "ESP-011", nome: "Jacaré-do-pantanal", grupo: "Répteis" },
];
const UNIDADES_MEDIDA_ANIMAL_MOCK = [
  { id: 1, nome: "Cabeças" },
  { id: 2, nome: "Toneladas" },
];
const PRODUTOS_MOCK = [
  { id: 1, nome: "Ovo", areaAtuacao: ["Ovos"], classificacao: ["matéria-prima", "produtos finais"], unidade: "Unidades" },
  { id: 2, nome: "Iogurte", areaAtuacao: ["Leite"], classificacao: ["produtos finais"], unidade: "Litros" },
  { id: 3, nome: "Queijo Minas", areaAtuacao: ["Leite"], classificacao: ["produtos finais"], unidade: "Kg" },
  { id: 4, nome: "Carne Bovina", areaAtuacao: ["Carne"], classificacao: ["matéria-prima", "produtos finais"], unidade: "Kg" },
];

// ==========================================================
// HELPERS DE UI (padrão do projeto)
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
function SubGrupo({ titulo, children, comDivisor = false }: { titulo: React.ReactNode; children: React.ReactNode; comDivisor?: boolean }) {
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
function SubGrupoCustomizado({ titulo, icon, children }: { titulo: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 bg-white border-l-4 border-[#32C47F] p-5 rounded-r-xl rounded-l-sm shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-700 tracking-wide">{titulo}</span>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

interface BlocoAgrupadorProps {
  titulo: string;
  icon?: ReactNode;
  children: ReactNode;
  comDivisor?: boolean;
}

function BlocoAgrupador({ 
  titulo, 
  icon, 
  children, 
  comDivisor = false 
}: BlocoAgrupadorProps) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100 my-4" />}
      <div className="flex flex-col gap-5 bg-gray-50 border-l-4 border-[#1A7A3C] p-6 rounded-r-xl rounded-l-sm shadow-sm w-full animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded bg-[#1A7A3C] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              {icon}
            </div>
          )}
          <span className="text-sm font-bold text-gray-800 tracking-wide ">
            {titulo}
          </span>
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
}

const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// PÁGINA: ADICIONAR ESTABELECIMENTO AGROINDUSTRIAL POA — SIE/MG
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarEstabelecimentoAgroindustrialSIEMGPage({ onLogout, onNavigate }: PageProps) {
  const [nomeComercial, setNomeComercial] = useState("");
  const [possuiIsencaoIE, setPossuiIsencaoIE] = useState<boolean | "">("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");

  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), proprietario: null }]);

  // 🔥 CORREÇÃO 1: Iniciar como false para ignorar a trava oculta do backlog
  const [ehEapp, setEhEapp] = useState<boolean | "">(false);
  const [tipoEapp, setTipoEapp] = useState("");
  const [numeroCaf, setNumeroCaf] = useState("");
  const [validadeCaf, setValidadeCaf] = useState("");
  const [comprovanteCaf, setComprovanteCaf] = useState("");
  const [situacaoHabEapp, setSituacaoHabEapp] = useState("");
  const [validadeCadastroEapp, setValidadeCadastroEapp] = useState("");
  const [ultimaComprovacaoEapp, setUltimaComprovacaoEapp] = useState("");
  const [comprovanteProdRural, setComprovanteProdRural] = useState<any>(null);
  const [descricaoProdRural, setDescricaoProdRural] = useState<string>("");
  const [descricaoCaf, setDescricaoCaf] = useState("");

  const [codigoSie, setCodigoSie] = useState("");
  const [dataHabilitacaoSie, setDataHabilitacaoSie] = useState("");

  const [areaAtuacao, setAreaAtuacao] = useState<string[]>([]);
  const [classifCarne, setClassifCarne] = useState<string[]>([]);
  const [classifLeite, setClassifLeite] = useState<string[]>([]);
  const [classifPescado, setClassifPescado] = useState<string[]>([]);

  const [ativAbatedouroCarne, setAtivAbatedouroCarne] = useState<string[]>([]);
  const [ativBenefCarne, setAtivBenefCarne] = useState<string[]>([]);
  const [ativEntrepostoLeite, setAtivEntrepostoLeite] = useState<string[]>([]);
  const [ativQueijaria, setAtivQueijaria] = useState<string[]>([]);
  const [ativBenefLeite, setAtivBenefLeite] = useState<string[]>([]);
  const [ativMel, setAtivMel] = useState<string[]>([]);
  const [ativOvos, setAtivOvos] = useState<string[]>([]);
  const [ativBenefPescado, setAtivBenefPescado] = useState<string[]>([]);
  const [ativMista, setAtivMista] = useState<string[]>([]);
  const [recebePescadoGta, setRecebePescadoGta] = useState<boolean | "">("");

  const [especiesAbateCarne, setEspeciesAbateCarne] = useState<any[]>([{ uid: uid("eac"), especie: null, capacidade: "", unidade: "" }]);
  const [especiesAbatePescado, setEspeciesAbatePescado] = useState<any[]>([{ uid: uid("eap"), especie: null, capacity: "", unidade: "" }]);

  const [recebeQueijariasOutras, setRecebeQueijariasOutras] = useState<boolean | "">("");
  const [queijariasParceiras, setQueijariasParceiras] = useState<any[]>([{ uid: uid("qp"), queijaria: null }]);
  const [entrepostosParceiros, setEntrepostosParceiros] = useState<any[]>([{ uid: uid("ep"), entreposto: null }]);

  const [fonteLeite, setFonteLeite] = useState<string[]>([]);
  const [fornecedoresLeite, setFornecedoresLeite] = useState<any[]>([{ uid: uid("fl"), exploracao: null }]);
  const [fonteMel, setFonteMel] = useState<string[]>([]);
  const [fornecedoresMel, setFornecedoresMel] = useState<any[]>([{ uid: uid("fm"), exploracao: null }]);
  const [fonteOvos, setFonteOvos] = useState<string[]>([]);
  const [fornecedoresOvos, setFornecedoresOvos] = useState<any[]>([{ uid: uid("fo"), exploracao: null }]);

  const [recepcaoDiaria, setRecepcaoDiaria] = useState<any[]>([{ uid: uid("rec"), produto: null, quantidade: "", unidade: "" }]);
  const [producaoDiaria, setProducaoDiaria] = useState<any[]>([{ uid: uid("prod"), produto: null, quantidade: "", unidade: "" }]);

  const [integradoSisbi, setIntegradoSisbi] = useState<boolean | "">("");
  const [dataIntegracaoSisbi, setDataIntegracaoSisbi] = useState("");
  const [possuiSeloArte, setPossuiSeloArte] = useState<boolean | "">("");
  const [produtosSeloArte, setProdutosSeloArte] = useState<string[]>([]);
  const [numerosSeloArte, setNumerosSeloArte] = useState<Record<string, string>>({});
  const [possuiSeloQueijo, setPossuiSeloQueijo] = useState<boolean | "">("");
  const [produtosSeloQueijo, setProdutosSeloQueijo] = useState<string[]>([]);
  const [numerosSeloQueijo, setNumerosSeloQueijo] = useState<Record<string, string>>({});

  const [endereco, setEndereco] = useState<any>({
    zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
  });
  const [contato, setContato] = useState<any>({
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [],
    emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
  });
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  const isEapp = ehEapp === true;
  const isNaoEapp = ehEapp === false;

  const numAreas = areaAtuacao.length;
  const soCarne = numAreas === 1 && areaAtuacao[0] === "Carne";
  const soLeite = numAreas === 1 && areaAtuacao[0] === "Leite";
  const soMel = numAreas === 1 && areaAtuacao[0] === "Mel";
  const soOvos = numAreas === 1 && areaAtuacao[0] === "Ovos";
  const soPescado = numAreas === 1 && areaAtuacao[0] === "Pescado";
  const isMista = numAreas > 1;
  const mistaComAbate = isMista && (areaAtuacao.includes("Carne") || areaAtuacao.includes("Pescado"));

  // Regras de Exibição
  const showClassifCarne = soCarne && isNaoEapp;
  const showClassifLeite = soLeite && isNaoEapp;
  const showClassifPescado = soPescado && isNaoEapp;

  const showAbatedouroCarne = classifCarne.includes("Abatedouro Frigorífico");
  const showBenefCarne = classifCarne.includes("Unidade de beneficiamento de carne e produtos cárneos") || (soCarne && isEapp);

  const showEntrepostoLeite = classifLeite.includes("Entreposto de laticínios");
  const showQueijaria = classifLeite.includes("Queijaria");
  const showBenefLeite = classifLeite.includes("Unidade de beneficiamento de leite e derivados") || (soLeite && isEapp);
  const showProducaoLeite = classifLeite.some((c) => ["Posto de refrigeração", "Queijaria", "Unidade de beneficiamento de leite e derivados"].includes(c));
  const showEntrepostosParceiros = ativQueijaria.includes("Finalização da produção de queijos em entreposto parceiro");

  const showAbatedouroPescado = classifPescado.includes("Abatedouro Frigorífico");
  const showBenefPescado = classifPescado.includes("Unidade de beneficiamento de pescado e produtos de pescado") || (soPescado && isEapp);

  const showSelos = (isEapp && situacaoHabEapp === "Registro") || isNaoEapp;
  const showSeloQueijo = classifLeite.includes("Queijaria");

  const produtosProducao = producaoDiaria.map((p) => p.produto).filter(Boolean);
  const opcoesSeloProdutos = Array.from(new Set(produtosProducao.map((p: any) => p.nome)));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agroindustrial" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("estabelecimento-agroindustrial")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os Estabelecimentos Agroindustriais POA — SIE/MG
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Estabelecimento Agroindustrial POA — SIE/MG</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-4">
            <FloatInput label="Nome Comercial do Estabelecimento Agroindustrial" required value={nomeComercial} onChange={setNomeComercial} maxLength={255} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <SimNao 
                label="Possui Isenção de Inscrição Estadual?" name="isencao-ie" required value={possuiIsencaoIE} 
                onChange={(val: boolean) => { setPossuiIsencaoIE(val); if (val === true) setInscricaoEstadual(""); }} 
              />
              {possuiIsencaoIE === false ? (
                <div className="animate-in fade-in duration-200">
                  <FloatInput label="Número de Inscrição Estadual" required value={inscricaoEstadual} onChange={(v) => setInscricaoEstadual(v.replace(/\D/g, "").slice(0, 13))} maxLength={13} />
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios} behavior="at-least-one" itemLabel="Proprietário" variant="plain" addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), proprietario: null }])}
            onRemoveItem={(i) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
          >
            {(item) => (
              <ProprietarioInput
                value={item.proprietario ? item.proprietario.nome : ""} required
                onChange={(ent) => setProprietarios((p) => p.map((x) => x.uid === item.uid ? { ...x, proprietario: ent } : x))}
                onEyeClick={() => item.proprietario && alert(`Visualizar: ${item.proprietario.nome}`)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. EAPP */}
        <Section title="Estabelecimento Agroindustrial de Pequeno Porte (EAPP)">
          <div className="flex flex-col gap-5">
            <SubGrupo titulo="Tipo de EAPP">
              <SimNao 
                label="É EAPP?" name="eh-eapp" required value={ehEapp} 
                onChange={(val: boolean) => {
                  setEhEapp(val);
                  if (val === false) {
                    setTipoEapp(""); setNumeroCaf(""); setComprovanteCaf(""); setComprovanteProdRural(""); setDescricaoProdRural("");
                  }
                }} 
                hasTooltip tooltipText="Estabelecimento Agroindustrial de Pequeno Porte (EAPP)"
              />
            </SubGrupo>

            {ehEapp === true && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <FloatSelect label="Tipo de EAPP" required value={tipoEapp} onChange={(val: string) => setTipoEapp(val)} options={toOptions(TIPO_EAPP)} />
                
                {tipoEapp === "Agricultura Familiar" && (
                  <div className="flex gap-4 items-start relative w-full rounded-xl animate-in fade-in duration-200">
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                        <FloatInput label="Número CAF" required value={numeroCaf} onChange={(v) => setNumeroCaf(v.slice(0, 30))} maxLength={30} hasTooltip tooltipText="Número do Cadastro de Agricultor Familiar." />
                        <FloatInput label="Data de Validade do CAF" required type="date" icon={<Calendar size={18} color={GREEN} />} value={validadeCaf} onChange={setValidadeCaf} />
                      </div>
                      <div className="flex gap-2 items-start w-full">
                        <div className="flex-1 max-w-sm">
                          <UploadField label="Comprovante do CAF" required fileName={comprovanteCaf} onSelectFile={() => setComprovanteCaf("comprovante_caf.pdf")} />
                        </div>
                        {comprovanteCaf && (
                          <>
                            <div className="flex-1 min-w-[200px] animate-in fade-in duration-200">
                              <FloatInput label="Descrição" value={descricaoCaf || ""} placeholder="Descrição opcional..." onChange={setDescricaoCaf} />
                            </div>
                            <div className="h-12 flex items-center animate-in fade-in duration-200">
                              <button type="button" onClick={() => alert(`Download de: ${comprovanteCaf}`)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"><Download size={20} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {tipoEapp === "Produtor Rural" && (
                  <div className="flex gap-4 items-start relative w-full rounded-xl bg-white animate-in fade-in duration-200">
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex gap-3 items-start w-full">
                        <UploadField label="Comprovante de Produtor Rural" required fileName={comprovanteProdRural} onSelectFile={() => setComprovanteProdRural("comprovante_produtor_rural.pdf")} />
                        {comprovanteProdRural && (
                          <>
                            <div className="flex-1 animate-in fade-in duration-200">
                              <FloatInput label="Descrição" value={descricaoProdRural || ""} placeholder="Descrição opcional." onChange={setDescricaoProdRural} />
                            </div>
                            <div className="h-12 flex items-center animate-in fade-in duration-200">
                              <button type="button" onClick={() => alert(`Download de: ${comprovanteProdRural}`)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"><Download size={20} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <SubGrupo titulo="Situação da Habilitação de EAPP" comDivisor>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <FloatSelect label="Situação da Habilitação de EAPP" required value={situacaoHabEapp} onChange={setSituacaoHabEapp} options={toOptions(SITUACAO_HABILITACAO_EAPP)} />
                    {situacaoHabEapp === "Cadastro" ? (
                      <div className="animate-in fade-in duration-200">
                        <FloatInput label="Data de Validade do Cadastro de EAPP" icon={<Calendar size={18} color={GREEN} />} required type="date" value={validadeCadastroEapp} onChange={setValidadeCadastroEapp} />
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </SubGrupo>

                <SubGrupo titulo="Última Comprovação de EAPP" comDivisor>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <FloatInput label="Data da Última Comprovação de EAPP" required type="date" icon={<Calendar size={18} color={GREEN} />} value={ultimaComprovacaoEapp} onChange={setUltimaComprovacaoEapp} />
                    {ultimaComprovacaoEapp ? (
                      <div className="animate-in fade-in duration-200">
                        <FloatInput label="Data de Vencimento da Comprovação de EAPP" required disabled value={calcularVencimentoEapp(ultimaComprovacaoEapp)} icon={<Calendar size={18} color={GREEN} />} onChange={() => {}} hasTooltip tooltipText="Calculada automaticamente." />
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </SubGrupo>
              </div>
            )}
          </div>
        </Section>

        {/* 4. Inspeção (SIE/MG) e Caracterização da Atividade */}
        <Section title="Inspeção">
          <div className="flex flex-col gap-6">
            <SubGrupo titulo="Serviço de Inspeção Estadual de Minas Gerais (SIE/MG)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatInput label="Código SIE/MG" required value={codigoSie} onChange={(v) => setCodigoSie(v.slice(0, 30))} hasTooltip tooltipText="Serviço de Inspeção Estadual de Minas Gerais" maxLength={30} />
                <FloatInput label="Data de Habilitação do SIE" required type="date" icon={<Calendar size={18} color={GREEN} />} value={dataHabilitacaoSie} onChange={setDataHabilitacaoSie} />
              </div>
            </SubGrupo>

           <SubGrupo titulo="Caracterização da Atividade Agroindustrial" comDivisor>
  <div className="flex flex-col gap-6">
    {/* Área de Atuação */}
    <CheckboxGroup 
      title="Área de Atuação" required orientation="horizontal" 
      options={[
        { id: "Carne", label: "Carne" },
        { id: "Leite", label: "Leite" },
        { id: "Mel", label: "Mel" },
        { id: "Ovos", label: "Ovos" },
        { id: "Pescado", label: "Pescado" }
      ]} 
      defaultValue={areaAtuacao} onChange={setAreaAtuacao} 
    />

    {/* ---------- CARNE ---------- */}
    {soCarne && (
      <BlocoAgrupador titulo="Carne" comDivisor icon={<Beef size={18} />}>
        <div className="flex flex-col gap-6">
          {showClassifCarne && (
            <CheckboxGroup 
              title="Classificação" required orientation="horizontal" 
              options={[
                { id: "Abatedouro Frigorífico", label: "Abatedouro Frigorífico" },
                { id: "Unidade de beneficiamento de carne e produtos cárneos", label: "Unidade de Beneficiamento de Carne e Produtos Cárneos" }
              ]}
              defaultValue={classifCarne} onChange={setClassifCarne} 
            />
          )}

          {showAbatedouroCarne && (
            <SubGrupoCustomizado titulo="Abatedouro Frigorífico" icon={<Activity size={16} />}>
              <div className="flex flex-col gap-6 mt-2">
                <CheckboxGroup 
                  title="Atividade Desenvolvida" orientation="horizontal" 
                  options={[
                    { id: "Desossa", label: "Desossa" },
                    { id: "Industrialização", label: "Industrialização" },
                    { id: "Distribuição de Produtos de Origem Animal (POA) de terceiros", label: "Distribuição de Produtos de Origem Animal (POA) de terceiros" }
                  ]}
                  defaultValue={ativAbatedouroCarne} onChange={setAtivAbatedouroCarne} 
                />
                <EspeciesAbatidas titulo="Espécies Abatidas no Frigorífico" especiesData={ESPECIES_ABATE_MOCK} unidadesData={UNIDADES_MEDIDA_ANIMAL_MOCK} items={especiesAbateCarne} setItems={setEspeciesAbateCarne} />
              </div>
            </SubGrupoCustomizado>
          )}

          {showBenefCarne && (
            <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Carne e Produtos Cárneos" icon={<Layers size={16} />}>
              <div className="flex flex-col gap-6 mt-2">
                <CheckboxGroup 
                  title="Atividade Desenvolvida" orientation="horizontal" 
                  options={[
                    { id: "Desossa", label: "Desossa" },
                    { id: "Industrialização", label: "Industrialização" },
                    { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
                  ]}
                  defaultValue={ativBenefCarne} onChange={setAtivBenefCarne} 
                />
              </div>
            </SubGrupoCustomizado>
          )}
        </div>
      </BlocoAgrupador>
    )}

    {/* ---------- LEITE ---------- */}
    {soLeite && (
      <BlocoAgrupador titulo="Leite" comDivisor icon={<Milk size={18} />}>
        <div className="flex flex-col gap-6">
          {showClassifLeite && (
            <CheckboxGroup 
              title="Classificação" required orientation="horizontal" 
              options={[
                { id: "Entreposto de laticínios", label: "Entreposto de Laticínios" },
                { id: "Granja leiteira", label: "Granja Leiteira" },
                { id: "Posto de refrigeração", label: "Posto de Refrigeração" },
                { id: "Queijaria", label: "Queijaria" },
                { id: "Unidade de beneficiamento de leite e derivados", label: "Unidade de Beneficiamento de Leite e Derivados" }
              ]}
              defaultValue={classifLeite} onChange={setClassifLeite} 
            />
          )}

          {showEntrepostoLeite && (
            <SubGrupoCustomizado titulo="Entreposto de Laticínios" icon={<Home size={16} />}>
              <div className="flex flex-col gap-6 mt-2">
                <CheckboxGroup 
                  title="Atividade Desenvolvida" orientation="horizontal" 
                  options={[{ id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }]}
                  defaultValue={ativEntrepostoLeite} onChange={setAtivEntrepostoLeite} 
                />
                <SimNao label="Recebe Produtos de Queijarias de Outras Inspeções?" name="recebe-queijarias" required value={recebeQueijariasOutras} onChange={setRecebeQueijariasOutras} />
                {recebeQueijariasOutras === true && (
                  <DynamicListWrapper
                    items={queijariasParceiras} behavior="at-least-one" itemLabel="Queijaria" variant="plain" addButtonLabel="Adicionar Queijaria"
                    onAddItem={() => setQueijariasParceiras((p) => [...p, { uid: uid("qp"), queijaria: null }])}
                    onRemoveItem={(i) => setQueijariasParceiras((p) => p.filter((_, idx) => idx !== i))}
                  >
                    {(item) => (
                      <FloatInput
                        label="Queijaria" required value={item.queijaria ? item.queijaria.nome : ""}   icon={<img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="Estabelecimento Agroindustrial" className="w-5 h-5 object-contain" />} 

                        onClick={() => setQueijariasParceiras((p) => p.map((x) => x.uid === item.uid ? { ...x, queijaria: { nome: "Entreposto ABC" } } : x))} readOnly
                      />
                    )}
                  </DynamicListWrapper>
                )}
              </div>
            </SubGrupoCustomizado>
          )}

          {showQueijaria && (
            <SubGrupoCustomizado titulo="Queijaria" icon={<Disc size={16} />}>
              <div className="flex flex-col gap-6 mt-2">
                <CheckboxGroup 
                  title="Atividade Desenvolvida" required orientation="horizontal" 
                  options={[
                    { id: "Finalização da produção de queijos na própria queijaria", label: "Finalização da produção de queijos na própria queijaria" },
                    { id: "Finalização da produção de queijos em entreposto parceiro", label: "Finalização da produção de queijos em entreposto parceiro" }
                  ]}
                  defaultValue={ativQueijaria} onChange={setAtivQueijaria} 
                />
                {showEntrepostosParceiros && (
                  <DynamicListWrapper
                    items={entrepostosParceiros} behavior="at-least-one" itemLabel="Entreposto Parceiro" variant="plain" addButtonLabel="Adicionar Entreposto"
                    onAddItem={() => setEntrepostosParceiros((p) => [...p, { uid: uid("ep"), entreposto: null }])}
                    onRemoveItem={(i) => setEntrepostosParceiros((p) => p.filter((_, idx) => idx !== i))}
                  >
                    {(item) => (
                      <FloatInput
                        label="Entreposto" required value={item.entreposto ? item.entreposto.nome : ""}  icon={<img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="Estabelecimento Agroindustrial" className="w-5 h-5 object-contain" />}
                        onClick={() => setEntrepostosParceiros((p) => p.map((x) => x.uid === item.uid ? { ...x, entreposto: { nome: "Entreposto ABC" } } : x))} readOnly
                      />
                    )}
                  </DynamicListWrapper>
                )}
              </div>
            </SubGrupoCustomizado>
          )}

          {showBenefLeite && (
            <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Leite e Derivados" icon={<Layers size={16} />}>
              <div className="flex flex-col gap-6 mt-2">
                <CheckboxGroup 
                  title="Atividade Desenvolvida" orientation="horizontal" 
                  options={[
                    { id: "Beneficiamento de leite para consumption direto", label: "Beneficiamento de leite para consumo direto" },
                    { id: "Industrialização", label: "Industrialização" }
                  ]}
                  defaultValue={ativBenefLeite} onChange={setAtivBenefLeite} 
                />
              </div>
            </SubGrupoCustomizado>
          )}

         {showProducaoLeite && (
  <SubGrupoCustomizado titulo="Produção de Produtos Derivados de Leite" icon={<Milk size={16} />}>
    <div className="flex flex-col gap-6 mt-2">
      <FonteProducao 
        fonte={fonteLeite} 
        setFonte={setFonteLeite} 
        fornecedores={fornecedoresLeite} 
        setFornecedores={setFornecedoresLeite} 
        grupoFornecedor="Bovídeos" 
        prefixo="fl" 
      />
    </div>
  </SubGrupoCustomizado>
)}
        </div>
      </BlocoAgrupador>
    )}

    {/* ---------- MEL ---------- */}
    {soMel && (
      <BlocoAgrupador titulo="Mel" comDivisor icon={<Hexagon size={18} />}>
        <div className="flex flex-col gap-6">
          <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Produtos de Abelhas" icon={<Layers size={16} />}>
            <div className="flex flex-col gap-6 mt-2">
              <CheckboxGroup 
                title="Atividade Desenvolvida" orientation="horizontal" 
                options={[{ id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }]}
                defaultValue={ativMel} onChange={setAtivMel} 
              />
            </div>
          </SubGrupoCustomizado>
<SubGrupoCustomizado titulo="Produção de Produtos Derivados de Abelhas" icon={<Hexagon size={16} />}>
  <div className="flex flex-col gap-6 mt-2">
    <FonteProducao 
      fonte={fonteMel} 
      setFonte={setFonteMel} 
      fornecedores={fornecedoresMel} 
      setFornecedores={setFornecedoresMel} 
      grupoFornecedor="Abelhas" 
      prefixo="fm" 
    />
  </div>
</SubGrupoCustomizado>        </div>
      </BlocoAgrupador>
    )}

    {/* ---------- OVOS ---------- */}
    {soOvos && (
      <BlocoAgrupador titulo="Ovos" comDivisor icon={<Egg size={18} />}>
        <div className="flex flex-col gap-6">
          <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Ovos e Derivados" icon={<Layers size={16} />}>
            <div className="flex flex-col gap-6 mt-2">
              <CheckboxGroup 
                title="Atividade Desenvolvida" orientation="horizontal" 
                options={[
                  { id: "Industrialização", label: "Industrialização" },
                  { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
                ]}
                defaultValue={ativOvos} onChange={setAtivOvos} 
              />
            </div>
          </SubGrupoCustomizado>
<SubGrupoCustomizado titulo="Produção de Produtos Derivados de Ovos" icon={<Egg size={16} />}>
  <div className="flex flex-col gap-6 mt-2">
    <FonteProducao 
      fonte={fonteOvos} 
      setFonte={setFonteOvos} 
      fornecedores={fornecedoresOvos} 
      setFornecedores={setFornecedoresOvos} 
      grupoFornecedor="Aves" 
      prefixo="fo" 
    />
  </div>
</SubGrupoCustomizado>        </div>
      </BlocoAgrupador>
    )}

    {/* ---------- PESCADO ---------- */}
{soPescado && (
  <BlocoAgrupador titulo="Pescado" comDivisor icon={<Fish size={18} />}>
    <div className="flex flex-col gap-6">
      {showClassifPescado && (
        <CheckboxGroup 
          title="Classificação" required orientation="horizontal" 
          options={[
            /* 🔥 CORRIGIDO: "Frigorífico" agora com F maiúsculo para bater com a regra do useMemo */
            { id: "Abatedouro Frigorífico", label: "Abatedouro Frigorífico" },
            { id: "Unidade de beneficiamento de pescado e produtos de pescado", label: "Unidade de Beneficiamento de Pescado e Produtos de Pescado" }
          ]}
          defaultValue={classifPescado} onChange={setClassifPescado} 
        />
      )}

      {showAbatedouroPescado && (
        <SubGrupoCustomizado titulo="Abatedouro Frigorífico" icon={<Activity size={16} />}>
          <div className="flex flex-col gap-6 mt-2">
            <CheckboxGroup 
              title="Atividade Desenvolvida" orientation="horizontal" 
              options={[
                 { id: "Desossa", label: "Desossa" },
                { id: "Industrialização", label: "Industrialização" },
                { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
              ]}
              defaultValue={ativBenefPescado} onChange={setAtivBenefPescado} 
            />
            <EspeciesAbatidas titulo="Espécies Abatidas no Frigorífico" especiesData={ESPECIES_PESCADO_MOCK} unidadesData={UNIDADES_MEDIDA_ANIMAL_MOCK} items={especiesAbatePescado} setItems={setEspeciesAbatePescado} />
          </div>
        </SubGrupoCustomizado>
      )}

      {showBenefPescado && (
        <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Pescado e Produtos de Pescado" icon={<Layers size={16} />}>
          <div className="flex flex-col gap-6 mt-2">
            <CheckboxGroup 
              title="Atividade Desenvolvida" orientation="horizontal" 
              options={[
                { id: "Industrialização", label: "Industrialização" },
                { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
              ]}
              defaultValue={ativBenefPescado} onChange={setAtivBenefPescado} 
            />
            <SimNao label="Recebe Pescado com GTA?" name="recebe-pescado-gta" required value={recebePescadoGta} onChange={setRecebePescadoGta} />
          </div>
        </SubGrupoCustomizado>
      )}
    </div>
  </BlocoAgrupador>
)}
    {/* ---------- MISTA ---------- */}
    {isMista && (
      <BlocoAgrupador titulo="Mista" comDivisor icon={<Shuffle size={18} />}>
        <SubGrupoCustomizado titulo="Unidade de Beneficiamento de Produtos Mistos" icon={<Layers size={16} />}>
          <div className="flex flex-col gap-6 mt-2">
            <CheckboxGroup
              title="Atividade Desenvolvida" orientation="horizontal"
              options={mistaComAbate 
                ? [
                    { id: "Desossa", label: "Desossa" },
                    { id: "Industrialização", label: "Industrialização" },
                    { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
                  ]
                : [
                    { id: "Industrialização", label: "Industrialização" },
                    { id: "Distribuição de produtos de origem animal (POA) de terceiros", label: "Distribuição de produtos de origem animal (POA) de terceiros" }
                  ]
              }
              defaultValue={ativMista} onChange={setAtivMista}
            />
          </div>
        </SubGrupoCustomizado>
      </BlocoAgrupador>
    )}
  </div>
</SubGrupo>
          </div>
        </Section>

        {/* 5. Capacidades */}
        {areaAtuacao.length > 0 && (
          <Section title="Capacidades">
            <div className="flex flex-col gap-6">
              <CapacidadeLista titulo="Recepção Diária" classificacaoFiltro="matéria-prima" areasAtuacao={areaAtuacao} produtosData={PRODUTOS_MOCK} items={recepcaoDiaria} setItems={setRecepcaoDiaria} prefixo="rec" />
              <CapacidadeLista titulo="Produção Diária" classificacaoFiltro="produtos finais" areasAtuacao={areaAtuacao} produtosData={PRODUTOS_MOCK} items={producaoDiaria} setItems={setProducaoDiaria} prefixo="prod" />
            </div>
          </Section>
        )}

        {/* 6. Selos */}
        {showSelos && (
          <Section title="Selos">
            <div className="flex flex-col gap-6">
              <SubGrupo titulo="Sistema Brasileiro de Inspeção (SISBI)">
                <SimNao label="É Integrado ao SISBI?" name="integrado-sisbi" required value={integradoSisbi} onChange={setIntegradoSisbi} hasTooltip tooltipText="Sistema Brasileiro de Inspeção (SISBI)." />
                {integradoSisbi === true && (
                  <FloatInput label="Data de Integração ao SISBI" required type="date" icon={<Calendar size={16}/>} value={dataIntegracaoSisbi} onChange={setDataIntegracaoSisbi} hasTooltip tooltipText="Não deve ser futura." />
                )}
              </SubGrupo>

              <SubGrupo titulo="Selo Arte" comDivisor>
                <SimNao label="Possui Selo Arte?" name="selo-arte" required value={possuiSeloArte} onChange={setPossuiSeloArte} />
                {possuiSeloArte === true && (
                  <FloatInput opcoes={opcoesSeloProdutos} selecionados={produtosSeloArte} icon={<Calendar size={16}/>} setSelecionados={setProdutosSeloArte} numeros={numerosSeloArte} setNumeros={setNumerosSeloArte} />
                )}
              </SubGrupo>

              {showSeloQueijo && (
                <SubGrupo titulo="Selo de Queijo Artesanal" comDivisor>
                  <SimNao label="Possui Selo de Queijo Artesanal?" name="selo-queijo" required value={possuiSeloQueijo} onChange={setPossuiSeloQueijo} />
                  {possuiSeloQueijo === true && (
                    <SeloProdutos opcoes={opcoesSeloProdutos} selecionados={produtosSeloQueijo} icon={<Calendar size={16}/>} setSelecionados={setProdutosSeloQueijo} numeros={numerosSeloQueijo} setNumeros={setNumerosSeloQueijo} />
                  )}
                </SubGrupo>
              )}
            </div>
          </Section>
        )}

        {/* 7. Localização */}
        <Section title="Localização">
          <BlocoEnderecoFields title="Endereço do Estabelecimento" data={endereco} tipoEstado="travado" onChange={(key, value) => setEndereco((prev: any) => ({ ...prev, [key]: value }))} onSetMultipleFields={(fields) => setEndereco((prev: any) => ({ ...prev, ...fields }))} />
        </Section>

        {/* 8. Contatos */}
        <Section title="Contatos">
          <BlocoContatoFields data={contato} onChange={(updated) => setContato((prev: any) => ({ ...prev, ...updated }))} proprietariosDisponiveis={proprietarios.filter((p) => p.proprietario).map((p) => ({ id: p.uid, nome: p.proprietario.nome, cpf: p.proprietario.documento }))} />
        </Section>

        {/* 9. Anexos */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">{index + 1}</div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField label="Documento" required fileName={anexo.nome} onSelectFile={() => setAnexos((prev) => prev.map((a, i) => i === index ? { ...a, nome: `documento_${index + 1}.pdf` } : a))} />
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput label="Descrição" value={anexo.descricao || ""} placeholder="Descrição opcional..." onChange={(v) => setAnexos((prev) => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))} />
                        </div>
                        <div className="h-12 flex items-center">
                          <button type="button" onClick={() => alert(`Download de: ${anexo.nome}`)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"><Download size={20} /></button>
                        </div>
                      </>
                    )}
                    <div className="h-12 flex items-center">
                      <button type="button" onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setAnexos((prev) => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition">
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* 10. Observação */}
        <Section title="Observação">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Estabelecimento agroindustrial cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `O estabelecimento "${nomeComercial}"` : "O estabelecimento"} foi cadastrado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("estabelecimento-agroindustrial"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-estabelecimento-agroindustrial"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calcularVencimentoEapp(dataUltima: string): string {
  if (!dataUltima) return "";
  const d = new Date(dataUltima + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  const ano = d.getFullYear();
  const limite = new Date(ano, 5, 30);
  const anoVenc = d <= limite ? ano : ano + 1;
  return `01/07/${anoVenc}`;
}

function EspeciesAbatidas({ titulo, especiesData, unidadesData, items, setItems }: {
  titulo: string; especiesData: any[]; unidadesData: any[]; items: any[]; setItems: (v: any[]) => void;
}) {
  return (
    <SubGrupo titulo={titulo} comDivisor>
      <DynamicListWrapper
        items={items} behavior="at-least-one" itemLabel="Espécie"  variant="plain" addButtonLabel="Adicionar Espécie"
        onAddItem={() => setItems([...items, { uid: uid("esp"), especie: null, capacidade: "", unidade: "" }])}
        onRemoveItem={(i) => setItems(items.filter((_, idx) => idx !== i))}
      >
        {(item) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full">
            <FloatInput label="Espécie" required value={item.especie ? item.especie.nome : ""} icon={<Dna size={16} />} onClick={() => setItems(items.map((x) => x.uid === item.uid ? { ...x, especie: especiesData[0] } : x))} readOnly />
            <FloatInput label="Capacidade Diária de Abate da Espécie" required value={item.capacidade} onChange={(v) => setItems(items.map((x) => x.uid === item.uid ? { ...x, capacidade: v.replace(/[^\d.,]/g, "") } : x))} />
            <FloatSelect label="Unidade de Medida" required value={item.unidade} onChange={(v) => setItems(items.map((x) => x.uid === item.uid ? { ...x, unidade: v } : x))} options={unidadesData.map((u) => ({ value: u.nome, label: u.nome }))} />
          </div>
        )}
      </DynamicListWrapper>
    </SubGrupo>
  );
}

function FonteProducao({ titulo, fonte, setFonte, fornecedores, setFornecedores, grupoFornecedor, prefixo }: {
  titulo: string; fonte: string[]; setFonte: (v: string[]) => void;
  fornecedores: any[]; setFornecedores: (v: any[]) => void; grupoFornecedor: string; prefixo: string;
}) {
  const mostraFornecedor = fonte.includes("Possui fornecedor");
  return (
    <SubGrupo titulo={titulo} comDivisor>
      <CheckboxGroup title="Fonte de Produção" required orientation="horizontal" options={[{ id: "Possui produção própria", label: "Possui produção própria" }, { id: "Possui fornecedor", label: "Possui fornecedor" }]} defaultValue={fonte} onChange={setFonte} />
      {mostraFornecedor && (
        <DynamicListWrapper
          items={fornecedores} behavior="at-least-one" itemLabel="Fornecedor" variant="plain" addButtonLabel="Adicionar Exploração Fornecedora"
          onAddItem={() => setFornecedores([...fornecedores, { uid: uid(prefixo), exploracao: null }])}
          onRemoveItem={(i) => setFornecedores(fornecedores.filter((_, idx) => idx !== i))}
        >
          {(item) => (
            <ExploracaoPecuariaInput
              value={item.exploracao ? item.exploracao.codigo : ""} required
              onChange={(ent) => setFornecedores(fornecedores.map((x) => x.uid === item.uid ? { ...x, exploracao: ent } : x))}
              onEyeClick={() => item.exploracao && alert(`Visualizar exploração ${grupoFornecedor}: ${item.exploracao.codigo}`)}
            />
          )}
        </DynamicListWrapper>
      )}
    </SubGrupo>
  );
}

function CapacidadeLista({ titulo, classificacaoFiltro, areasAtuacao, produtosData, items, setItems, prefixo }: {
  titulo: string; classificacaoFiltro: string; areasAtuacao: string[]; produtosData: any[];
  items: any[]; setItems: (v: any[]) => void; prefixo: string;
}) {
  const produtosFiltrados = useMemo(
    () => produtosData.filter(
      (p) => p.areaAtuacao.some((a: string) => areasAtuacao.includes(a)) && p.classificacao.includes(classificacaoFiltro)
    ),
    [produtosData, areasAtuacao, classificacaoFiltro]
  );

  const escolherProduto = (uidItem: string) => {
    const prod = produtosFiltrados[0];
    if (!prod) { alert("Nenhum produto compatível com a área de atuação selecionada."); return; }
    setItems(items.map((x) => x.uid === uidItem ? { ...x, produto: prod, unidade: prod.unidade } : x));
  };

  return (
    <SubGrupo titulo={titulo}>
      <DynamicListWrapper
        items={items} behavior="at-least-one" itemLabel="Produto" variant="plain" addButtonLabel="Adicionar Produto"
        onAddItem={() => setItems([...items, { uid: uid(prefixo), produto: null, quantidade: "", unidade: "" }])}
        onRemoveItem={(i) => setItems(items.filter((_, idx) => idx !== i))}
      >
        {(item) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full">
            <FloatInput label="Produto" required value={item.produto ? item.produto.nome : ""} icon={<ShoppingCart size={16} />} onClick={() => escolherProduto(item.uid)} readOnly />
            {item.produto && (
              <>
                <FloatInput label="Quantidade Máxima" required value={item.quantidade} onChange={(v) => setItems(items.map((x) => x.uid === item.uid ? { ...x, quantidade: v.replace(/\D/g, "") } : x))} />
                <FloatInput label="Unidade de Medida" required disabled value={item.unidade} onChange={() => {}} icon={<Ruler size={16} />} />
              </>
            )}
          </div>
        )}
      </DynamicListWrapper>
    </SubGrupo>
  );
}

function SeloProdutos({ opcoes, selecionados, setSelecionados, numeros, setNumeros }: {
  opcoes: string[]; selecionados: string[]; setSelecionados: (v: string[]) => void;
  numeros: Record<string, string>; setNumeros: (v: Record<string, string>) => void;
}) {
  if (opcoes.length === 0) {
    return <p className="text-sm text-gray-400">Informe produtos na seção "Produção Diária" para habilitar a seleção de selos.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <FloatMultiSelect label="Produtos" value={selecionados} onChange={setSelecionados} options={opcoes} />
      {selecionados.map((prod) => (
        <div key={prod} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FloatInput label="Produto" disabled value={prod} onChange={() => {}} />
          <FloatInput label={`Número do Selo`} required value={numeros[prod] || ""} onChange={(v) => setNumeros({ ...numeros, [prod]: v.slice(0, 30) })} maxLength={30} />
        </div>
      ))}
    </div>
  );
}