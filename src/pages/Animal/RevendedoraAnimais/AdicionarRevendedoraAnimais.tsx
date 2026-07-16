import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
  MapPin, Dna, User, Eye,
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
const FORMATOS_GEO = [
  { value: "DMS (graus, minutos, segundos)", label: "DMS (graus, minutos, segundos)" },
  { value: "DD (decimal)", label: "DD (decimal)" },
];

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
}

export function AdicionarRevendedoraAnimaisPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [nomeComercial, setNomeComercial] = useState("");

  // ---- Proprietários (um ou mais) ----
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), proprietario: null }]);

  // ---- Espécies Comercializadas (uma ou mais) ----
  const [especies, setEspecies] = useState<any[]>([{ uid: uid("esp"), especie: null, capacidade: "" }]);
  const [modalEspecieUid, setModalEspecieUid] = useState<string | null>(null);

  // ---- Funcionários (zero ou mais) ----
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [modalFuncUid, setModalFuncUid] = useState<string | null>(null);

  // ---- Localização ----
  const [endereco, setEndereco] = useState<any>({
    zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
    latitude: "", longitude: "",
  });

  // ---- Geolocalização ----
  const [formatoGeo, setFormatoGeo] = useState("DMS (graus, minutos, segundos)");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // ---- Contatos ----
  const [contato, setContato] = useState<any>({
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [],
    emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
  });

  // ---- Anexos / Observação ----
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora-animais-vivos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("revendedora-animais-vivos")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Revendedoras de Animais Vivos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Revendedora de Animais Vivos</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Banner de obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

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
              .filter((p) => p.proprietario)
              .map((p) => ({ id: p.uid, nome: p.proprietario.nome, cpf: p.proprietario.documento }))}
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
      </main>

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
              <button onClick={() => { setIsSucesso(false); onNavigate("revendedora-animais-vivos"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-revendedora-animais-vivos"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}