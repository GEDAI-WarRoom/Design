import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
  Dna, User, Eye, Pencil,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, UploadField, LargeTextArea, SearchModal,
} from "../../../components/ui/FormKit";
import {
  DynamicListWrapper, ProprietarioInput,
  BlocoEnderecoFields, BlocoContatoFields,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US072 - AC3)
// ==========================================================
// ==========================================================
// MOCKS (substituir por API)
// ==========================================================
interface EspecieEntidade { id: number; nome: string; grupo: string }
const ESPECIES_MOCK: EspecieEntidade[] = [
  { id: 1, nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, nome: "Codorna", grupo: "Aves" },
  { id: 3, nome: "Suíno", grupo: "Suídeos" },
  { id: 4, nome: "Equino", grupo: "Equídeos" },
];

interface FuncionarioEntidade { id: number; nome: string; cpf: string }
const FUNCIONARIOS_MOCK: FuncionarioEntidade[] = [
  { id: 1, nome: "Wagner Heleno Da Silveira", cpf: "444.009.956-40" },
  { id: 2, nome: "Marina Couto Dias", cpf: "333.221.115-09" },
  { id: 3, nome: "Pedro Alves Moraes", cpf: "222.114.558-70" },
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

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// PÁGINA: ADICIONAR REVENDEDORA DE ANIMAIS VIVOS (US072 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
  modo?: "adicionar" | "visualizar" | "editar";
  embutido?: boolean;
}

export const EXEMPLO_REVENDEDORA_ANIMAIS_VIVOS = {
  id: 1,
  codigo: "3123659848",
  nomeComercial: "Revendedora São José",
  proprietarios: [{
    uid: "prop-revendedora-exemplo",
    entidade: { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  }],
  especies: [{
    uid: "esp-revendedora-exemplo",
    especie: ESPECIES_MOCK[1],
    capacidade: "350",
  }],
  funcionarios: [{
    uid: "func-revendedora-exemplo",
    funcionario: FUNCIONARIOS_MOCK[0],
  }],
  endereco: {
    zona: "Urbana", cep: "37200-000", estado: "Minas Gerais", municipio: "Lavras",
    bairro: "Centro", endereco: "Rua das Palmeiras", numero: "245", complemento: "Loja 2",
    localidade: "", distrito: "", latitude: "-21.2451", longitude: "-44.9998",
  },
  contato: {
    utilizarContatoProprietario: "Sim",
    proprietariosSelecionados: ["prop-revendedora-exemplo"],
    emailFixo: "contato@revendedorasaijose.com.br", emailFixoObs: "Comercial",
    telefoneFixo: "(35) 3333-4455", telefoneFixoObs: "Atendimento", contatosAdicionais: [],
  },
  anexos: [{ id: "anexo-revendedora-exemplo", nome: "registro_revendedora.pdf", descricao: "Registro da revendedora" }],
  observacao: "Revendedora habilitada para comercialização de aves.",
};

function normalizarRegistro(dados?: any) {
  const base: any = { ...EXEMPLO_REVENDEDORA_ANIMAIS_VIVOS, ...(dados || {}) };
  const proprietarios = dados?.proprietarios?.length
    ? dados.proprietarios.map((pessoa: any, index: number) => pessoa.entidade
      ? pessoa
      : { uid: `prop-revendedora-${index}`, entidade: { ...pessoa, tipo: pessoa.tipo || "PF" } })
    : base.proprietarios;
  const especies = dados?.especies?.length
    ? dados.especies
    : dados?.especie
      ? [{ uid: "esp-revendedora-selecionada", especie: { id: 1, nome: dados.especie, grupo: dados.grupo || "" }, capacidade: dados.capacidade || "350" }]
      : base.especies;

  return {
    ...base,
    nomeComercial: dados?.nomeComercial || dados?.nome || base.nomeComercial,
    proprietarios,
    especies,
  };
}

export function AdicionarRevendedoraAnimaisPage({ onLogout, onNavigate, dados, modo = "adicionar", embutido = false }: PageProps) {
  const isView = modo === "visualizar";
  const isEdit = modo === "editar";
  const inicial = modo === "adicionar" ? null : normalizarRegistro(dados);

  // ---- Informações Básicas ----
  const [nomeComercial, setNomeComercial] = useState(inicial?.nomeComercial || "");

  // ---- Proprietários (um ou mais) ----
  const [proprietarios, setProprietarios] = useState<any[]>(inicial?.proprietarios || [{ uid: uid("prop"), entidade: null }]);

  // ---- Espécies Comercializadas (uma ou mais) ----
  const [especies, setEspecies] = useState<any[]>(inicial?.especies || [{ uid: uid("esp"), especie: null, capacidade: "" }]);
  const [modalEspecieUid, setModalEspecieUid] = useState<string | null>(null);

  // ---- Funcionários (zero ou mais) ----
  const [funcionarios, setFuncionarios] = useState<any[]>(inicial?.funcionarios || []);
  const [modalFuncUid, setModalFuncUid] = useState<string | null>(null);

  // ---- Localização ----
  const [endereco, setEndereco] = useState<any>(inicial?.endereco || {
    zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
    latitude: "", longitude: "",
  });

  // ---- Contatos ----
  const [contato, setContato] = useState<any>(inicial?.contato || {
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [],
    emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
  });

  // ---- Anexos / Observação ----
  const [anexos, setAnexos] = useState<any[]>(inicial?.anexos || []);
  const [observacao, setObservacao] = useState(inicial?.observacao || "");

  const [isSucesso, setIsSucesso] = useState(false);

  const montarRegistro = () => ({
    id: dados?.id || inicial?.id || Date.now(),
    codigo: dados?.codigo || inicial?.codigo || "3123659848",
    nome: nomeComercial,
    nomeComercial,
    proprietarios,
    especies,
    funcionarios,
    endereco,
    municipio: endereco.municipio,
    uf: endereco.estado === "Minas Gerais" ? "MG" : endereco.estado,
    grupo: especies[0]?.especie?.grupo || "",
    especie: especies[0]?.especie?.nome || "",
    contato,
    anexos,
    observacao,
  });

  const concluir = () => {
    if (isEdit) {
      onNavigate("visualizar-revendedora-animais-vivos", montarRegistro());
      return;
    }
    setIsSucesso(true);
  };

  const titulo = isView
    ? "Visualizar Revendedora de Animais Vivos"
    : isEdit
      ? "Editar Revendedora de Animais Vivos"
      : "Adicionar Revendedora de Animais Vivos";
  const ContentContainer: any = embutido ? "div" : "main";

  return (
    <div className={embutido ? "contents" : "min-h-screen bg-[#f2f3f5]"}>
      {!embutido && <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora-animais" hideSearch />}

      <ContentContainer className={embutido ? "flex flex-col gap-4" : "max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4"}>
        {/* Cabeçalho */}
        {!embutido && <div>
          <button type="button" onClick={() => onNavigate("revendedora-animais")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Revendedoras de Animais Vivos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
            {isView ? (
              <button type="button" onClick={() => onNavigate("editar-revendedora-animais", montarRegistro())} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"><Pencil size={16} /> Editar</button>
            ) : (
              <button type="button" onClick={concluir} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">{isEdit ? "Salvar" : "Adicionar"}</button>
            )}
          </div>
        </div>}

        {/* Banner de obrigatórios */}
        {!embutido && !isView && <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>}

        <fieldset disabled={isView} className={`border-0 p-0 m-0 min-w-0 flex flex-col gap-4 ${isView ? "poa-readonly" : ""}`}>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <FloatInput label="Nome Comercial da Revendedora" required value={nomeComercial} onChange={setNomeComercial} maxLength={255} />
        </Section>

         {/* 2. Proprietários */}
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
                value={item.entidade ? item.entidade.nome : ""}
                required
				clearInitialValue={modo === "adicionar"}
                onChange={(ent: any) => setProprietarios((prev) => prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p)))}
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. Espécies Comercializadas (uma ou mais) */}
        <Section title="Espécies Comercializadas">
          <DynamicListWrapper
            items={especies}
            behavior="at-least-one"
            itemLabel="Espécie"
            variant="plain"
            addButtonLabel="Adicionar Espécie"
            onAddItem={() => setEspecies((p) => [...p, { uid: uid("esp"), especie: null, capacidade: "" }])}
            onRemoveItem={(i) => setEspecies((p) => p.filter((_, idx) => idx !== i))}
          >
            {(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
                <FloatInput
                  label="Espécie"
                  required
                  value={item.especie ? item.especie.nome : ""}
                  icon={<Dna size={16} className="text-[#1A7A3C]" />}
                  onClick={() => setModalEspecieUid(item.uid)}
                  readOnly
                />
                <FloatInput
                  label="Capacidade de Alojamento da Espécie"
                  required
                  value={item.capacidade}
                  onChange={(v) => setEspecies((p) => p.map((x) => x.uid === item.uid ? { ...x, capacidade: v.replace(/\D/g, "").slice(0, 12) } : x))}
                />
              </div>
            )}
          </DynamicListWrapper>
        </Section>

       {/* 4. Funcionários da Revendedora (zero ou mais) */}
<Section title="Funcionários da Revendedora">
  <DynamicListWrapper
    items={funcionarios}
    behavior="any"
    itemLabel="Funcionário"
    variant="plain"
    addButtonLabel="Adicionar Funcionário"
    onAddItem={() => setFuncionarios((p) => [...p, { uid: uid("func"), funcionario: null }])}
    onRemoveItem={(i) => setFuncionarios((p) => p.filter((_, idx) => idx !== i))}
  >
    {(item) => (
      <div className="w-full">
        {/* Usamos grid para manter tudo alinhado na mesma linha no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end w-full">
          
          {/* O campo de Nome ocupa mais espaço se o CPF não estiver na tela, e encolhe se o CPF aparecer */}
          <div className={item.funcionario ? "md:col-span-6" : "md:col-span-12"}>
            <FloatInput
              label="Funcionário da Revendedora"
              required
              value={item.funcionario ? item.funcionario.nome : ""}
              icon={<User size={16} className="text-[#1A7A3C]" />}
              onClick={() => setModalFuncUid(item.uid)}
              readOnly
            />
          </div>

          {/* Se houver funcionário, o CPF entra logo ao lado */}
          {item.funcionario && (
            <div className="md:col-span-5 animate-fade-in">
              <FloatInput 
                label="CPF" 
                required 
                disabled 
                value={item.funcionario.cpf} 
                onChange={() => {}} 
              />
            </div>
          )}

          {/* O botão do olho fica sempre fixo no fim da linha (se houver funcionário) */}
          {item.funcionario && (
            <div className="md:col-span-1 flex justify-end animate-fade-in">
              <button
                type="button"
                onClick={() => onNavigate("visualizar-pessoa-fisica", item.funcionario)}
                className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition bg-white h-11 w-full flex items-center justify-center cursor-pointer"
                title="Visualizar Funcionário"
              >
                <Eye size={20} />
              </button>
            </div>
          )}

        </div>
      </div>
    )}
  </DynamicListWrapper>
</Section>

 {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço Principal"
            tipoEstado="normal"
            data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>


        {/* 7. Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contato}
            onChange={(updated) => setContato((prev: any) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={proprietarios
              .filter((p) => p.entidade)
              .map((p) => ({ id: p.uid, nome: p.entidade.nome, cpf: p.entidade.documento }))}
          />
        </Section>

        {/* 8. Anexos (zero ou mais) */}
        <Section title="Anexos">
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
                          <FloatInput label="Descrição" value={anexo.descricao || ""} placeholder="Descrição opcional..." onChange={(v) => setAnexos((prev) => prev.map((a, i) => i === index ? { ...a, descricao: v.slice(0, 255) } : a))} maxLength={255} />
                        </div>
                        <div className="h-12 flex items-center">
                          <button type="button" onClick={() => onNavigate("baixar-documento", anexo)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Baixar documento"><Download size={20} /></button>
                        </div>
                      </>
                    )}
                    <div className="h-12 flex items-center">
                      <button type="button" onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Remover anexo"><Trash2 size={20} /></button>
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

        {/* 9. Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
        </fieldset>
      </ContentContainer>

      {/* Modal Espécie */}
      <SearchModal<EspecieEntidade>
        open={modalEspecieUid !== null}
        onClose={() => setModalEspecieUid(null)}
        title="Buscar Espécie"
        subtitle="Busque por uma espécie cadastrada:"
        icon={<Dna size={28} className="text-[#1A7A3C]" />}
        data={ESPECIES_MOCK}
        columns={[{ label: "Nome da Espécie", key: "nome" }, { label: "Grupo", key: "grupo" }]}
        searchKeys={["nome", "grupo"]}
        searchPlaceholder="Buscar por Nome da Espécie ou Grupo"
        confirmLabel="Confirmar"
        onConfirm={(esp) => {
          setEspecies((p) => p.map((x) => x.uid === modalEspecieUid ? { ...x, especie: esp } : x));
          setModalEspecieUid(null);
        }}
      />

      {/* Modal Funcionário (Pessoa Física) */}
      <SearchModal<FuncionarioEntidade>
        open={modalFuncUid !== null}
        onClose={() => setModalFuncUid(null)}
        title="Buscar Funcionário"
        subtitle="Busque por uma pessoa física cadastrada no sistema:"
        icon={<User size={28} className="text-[#1A7A3C]" />}
        data={FUNCIONARIOS_MOCK}
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }]}
        searchKeys={["nome", "cpf"]}
        searchPlaceholder="Buscar por Nome ou CPF"
        confirmLabel="Confirmar"
        onConfirm={(f) => {
          setFuncionarios((p) => p.map((x) => x.uid === modalFuncUid ? { ...x, funcionario: f } : x));
          setModalFuncUid(null);
        }}
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Revendedora cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `"${nomeComercial}"` : "A revendedora"} foi cadastrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("revendedora-animais"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-revendedora-animais-vivos", montarRegistro()); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
