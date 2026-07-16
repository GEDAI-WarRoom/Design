import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, MultiSearchModal, UploadField, CheckboxGroup, FloatMultiSelect } from "../../../components/ui/FormKit";
import {
  ProprietarioInput,
  BlocoEnderecoFields,
  BlocoContatoFields,
  DynamicListWrapper,
  SelectedChipsContainer,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
import * as Icons from "../../../imports/icons";

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Áreas de atuação (seleção múltipla) — controlam os blocos condicionais
const AREAS_ATUACAO = ["Animal", "Vegetal"];

// Atuações do ramo ANIMAL (conforme lista da IN nº 35/17)
const ATUACOES_ANIMAL = [
  "Revendedora de Pasta Vampiricida",
  "Distribuidora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Vacinas sob Controle Oficial",
  "Distribuidora de Vacinas sob Controle Oficial",
  "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
];

// Atuações do ramo VEGETAL
const ATUACOES_VEGETAL = [
  "Revendedora de Sementes",
  "Revendedora de Agrotóxicos",
];

// ==========================================================
// HELPERS DE UI (mesmo padrão do fluxo de cadastro)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

interface SubGrupoProps {
  titulo: string;
  icon: React.ReactNode; // 💡 Recebe qualquer ícone vindo de fora
  children: React.ReactNode;
  comDivisor?: boolean;
}

function SubGrupo({ titulo, icon, children, comDivisor = false }: SubGrupoProps) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100 my-2" />}
      
      <div className="flex flex-col gap-4 bg-gray-50 border-l-4 border-[#1A7A3C] p-8 rounded-r-md rounded-l-sm shadow-sm w-full">
        
        {/* Cabeçalho Genérico */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1A7A3C] flex items-center justify-center text-white flex-shrink-0">
            {icon}
          </div>
          
          {/* Título informado por parâmetro */}
          <span className="text-sm font-bold text-gray-800 tracking-wide ">
            {titulo}
          </span>
        </div>

        {/* Conteúdo Interno */}
        <div className="w-full">
          {children}
        </div>
        
      </div>
    </>
  );
}

// Campo de seleção múltipla que abre um MultiSearchModal e exibe chips
function MultiSelectField({
  label,
  required,
  values,
  onOpen,
  onRemove,
  placeholder,
}: {
  label: string;
  required?: boolean;
  values: string[];
  onOpen: () => void;
  onRemove: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={onOpen}
        className="min-h-12 px-3 py-2 text-left text-sm rounded-md border border-gray-300 bg-white hover:border-[#1A7A3C] transition focus:outline-none focus:ring-1 focus:ring-[#1A7A3C]"
      >
        {values.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <SelectedChipsContainer items={values} onRemove={onRemove} />
        )}
      </button>
    </div>
  );
}

// ==========================================================
// PÁGINA: CADASTRAR REVENDEDORA (US088 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarRevendedoraAgropecuarioPage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [nomeComercial, setNomeComercial] = useState("");
  const [areasAtuacao, setAreasAtuacao] = useState<string[]>([]);

  // Ramo Animal
  const [registroAnimal, setRegistroAnimal] = useState("");
  const [atuacoesAnimal, setAtuacoesAnimal] = useState<string[]>([]);

  // Ramo Vegetal
  const [registroVegetal, setRegistroVegetal] = useState("");
  const [renasem, setRenasem] = useState("");
  const [atuacoesVegetal, setAtuacoesVegetal] = useState<string[]>([]);

  // Componentes
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), entidade: null }]);
  const [endereco, setEndereco] = useState({ zona: "Urbana", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "", latitude: "", longitude: "" });
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");
  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não",
    proprietariosSelecionados: [] as string[],
    emailFixo: "",
    emailFixoObs: "",
    telefoneFixo: "",
    telefoneFixoObs: "",
    contatosAdicionais: [] as any[]
  });
  // Modais de seleção múltipla
  const [modal, setModal] = useState<null | "area" | "atuacaoAnimal" | "atuacaoVegetal">(null);

  const [isSucesso, setIsSucesso] = useState(false);

  // Condicionais por Área de Atuação
  const temAnimal = areasAtuacao.includes("Animal");
  const temVegetal = areasAtuacao.includes("Vegetal");

  // ao desmarcar uma área, limpa os campos do ramo correspondente
  const onChangeAreas = (novas: string[]) => {
    setAreasAtuacao(novas);
    if (!novas.includes("Animal")) { setRegistroAnimal(""); setAtuacoesAnimal([]); }
    if (!novas.includes("Vegetal")) { setRegistroVegetal(""); setRenasem(""); setAtuacoesVegetal([]); }
  };

  const removeChip = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.filter((x) => x !== v));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("revendedora")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas Revendedoras de Produtos Agropecuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Revendedora de Produtos Agropecuários</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

{/* 1. Informações Básicas */}
<Section title="Informações Básicas">
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FloatInput 
        label="Nome Comercial da Revendedora" 
        required 
        value={nomeComercial} 
        onChange={setNomeComercial} 
        maxLength={255} 
      />
      
      <CheckboxGroup
        title="Área de Atuação"
        required
        options={[
          { id: "animal", label: "Animal" },
          { id: "vegetal", label: "Vegetal" },
        ]}
        defaultValue={areasAtuacao}
        onChange={(novasAreas) => onChangeAreas(novasAreas)}
        orientation="horizontal"
      />
    </div>

 {/* Condicional Ramo ANIMAL com Atuação em Checkbox e Tooltips */}
{areasAtuacao.includes("animal") && (
  <SubGrupo 
    titulo="Animal" 
    comDivisor
     icon={<img src={Icons.iconeRebanhoBrancoUrl} alt="Animal" className="w-5 h-5 object-contain" />} 

  >
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FloatInput 
          label="Número de Registro do Órgão Competente" 
          value={registroAnimal} 
          onChange={setRegistroAnimal} 
          maxLength={255} 
        />
      </div>
      
      <CheckboxGroup
        title="Atuação"
        required
        options={[
          { 
            id: "revendedora_pasta_vampiricida", 
            label: "Revendedora de Pasta Vampiricida" 
          },
          { 
            id: "distribuidora_controle_especial", 
            label: "Distribuidora de Produtos Sujeitos a Controle Especial",
            tooltipText: "Comércio atacadista para revendedoras de produtos sujeitos a controle especial" 
          },
          { 
            id: "revendedora_controle_especial", 
            label: "Revendedora de Produtos Sujeitos a Controle Especial",
            tooltipText: "Conforme lista da instrução normativa nº 35/17" 
          },
          { 
            id: "revendedora_vacinas_oficial", 
            label: "Revendedora de Vacinas sob Controle Oficial",
            tooltipText: "Vacinas de Brucelose e Raiva dos Herbívoros" 
          },
          { 
            id: "distribuidora_vacinas_oficial", 
            label: "Distribuidora de Vacinas sob Controle Oficial",
            tooltipText: "Vacinas de Brucelose e Raiva dos Herbívoros" 
          },
          { 
            id: "revendedora_insumos_exames", 
            label: "Revendedora de Insumos para Exames de Brucelose/Tuberculose" 
          },
        ]}
        defaultValue={atuacoesAnimal}
        onChange={(novasAtuacoes) => setAtuacoesAnimal(novasAtuacoes)}
        orientation="vertical"
      />
    </div>
  </SubGrupo>
)}
   

   {/* Condicional Ramo VEGETAL com Atuação em Checkbox */}
{areasAtuacao.includes("vegetal") && (
  <SubGrupo 
    titulo="Vegetal" 
    comDivisor
    icon={<img src={Icons.iconeVegetalBrancoUrl} alt="Vegetal" className="w-5 h-5 object-contain" />} 
  >
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FloatInput 
          label="Número de Registro do Órgão Competente" 
          value={registroVegetal} 
          onChange={setRegistroVegetal} 
          maxLength={255} 
        />
        <FloatInput 
          label="Número do RENASEM" 
          value={renasem} 
          onChange={setRenasem} 
          maxLength={255} 
        />
      </div>
      
      <CheckboxGroup
        title="Atuação"
        required
        options={[
          { id: "revendedora_sementes", label: "Revendedora de Sementes" },
          { id: "revendedora_agrotoxicos", label: "Revendedora de Agrotóxicos" },
        ]}
        defaultValue={atuacoesVegetal}
        onChange={(novasAtuacoes) => setAtuacoesVegetal(novasAtuacoes)}
        orientation="vertical"
      />
    </div>
  </SubGrupo>
)}
  </div>
</Section>

        {/* 2. Proprietários (um ou mais) */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), entidade: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                label="Proprietário"
                required
                value={item.entidade ? item.entidade.nome : ""}
                onChange={(ent: any) => setProprietarios((prev) => prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p)))}
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            tipoEstado="livre"
            data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        {/* Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contatos}
            onChange={(updated) => setContatos((prev) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={[
              { id: "prop-1", nome: "Carlos Henrique Silva", cpf: "123.456.789-00", email: "carlos.silva@email.com", telefone: "(11) 98888-7777" },
              { id: "prop-2", nome: "Maria Fernanda Oliveira", cpf: "987.654.321-11", email: "maria.fernanda@email.com", telefone: "(21) 99999-8888" },
              { id: "prop-3", nome: "Antônio Marcos de Souza", cpf: "456.123.789-22", email: "antonio.marcos@email.com", telefone: "(31) 97777-6666" },
              { id: "prop-4", nome: "Juliana Costa Rezende", cpf: "789.456.123-33", email: "juliana.costa@email.com", telefone: "(61) 96666-5555" }
            ]}
          />
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

      {/* ===== MODAIS DE SELEÇÃO MÚLTIPLA ===== */}
      <MultiSearchModal
        open={modal === "area"}
        onClose={() => setModal(null)}
        title="Área de Atuação"
        subtitle="Selecione uma ou mais áreas de atuação:"
        options={AREAS_ATUACAO}
        selected={areasAtuacao}
        onConfirm={(sel: string[]) => { onChangeAreas(sel); setModal(null); }}
        confirmLabel="Confirmar"
      />

      <MultiSearchModal
        open={modal === "atuacaoAnimal"}
        onClose={() => setModal(null)}
        title="Atuação — Animal"
        subtitle="Selecione as atuações conforme a Instrução Normativa nº 35/17:"
        options={ATUACOES_ANIMAL}
        selected={atuacoesAnimal}
        onConfirm={(sel: string[]) => { setAtuacoesAnimal(sel); setModal(null); }}
        confirmLabel="Confirmar"
      />

      <MultiSearchModal
        open={modal === "atuacaoVegetal"}
        onClose={() => setModal(null)}
        title="Atuação — Vegetal"
        subtitle="Selecione as atuações:"
        options={ATUACOES_VEGETAL}
        selected={atuacoesVegetal}
        onConfirm={(sel: string[]) => { setAtuacoesVegetal(sel); setModal(null); }}
        confirmLabel="Confirmar"
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Revendedora adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `"${nomeComercial}"` : "A revendedora"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("revendedora"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-revendedora-agropecuario", {
                nome: nomeComercial, areasAtuacao,
                atuacoesAnimal, atuacoesVegetal,
                situacao: "Ativo",
              }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}