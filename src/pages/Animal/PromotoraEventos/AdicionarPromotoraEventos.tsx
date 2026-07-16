import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
  MapPin, Building2, Eye,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, UploadField, LargeTextArea, SimNao, SearchModal,
} from "../../../components/ui/FormKit";
import { BlocoEnderecoFields, BlocoContatoFields, DynamicListWrapper, ProprietarioInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// LISTAS (US058 - AC1)
// ==========================================================
const FORMATOS_GEO = [
  { value: "DMS (graus, minutos, segundos)", label: "DMS (graus, minutos, segundos)" },
  { value: "DD (decimal)", label: "DD (decimal)" },
];

// ==========================================================
// MOCK: Proprietários (Pessoas Jurídicas — ver US044)
// ==========================================================
interface ProprietarioPJ {
  id: number;
  nomeFantasia: string;
  cnpj: string;
}
const PROPRIETARIOS_PJ_MOCK: ProprietarioPJ[] = [
  { id: 1, nomeFantasia: "JHE Leilões LTDA", cnpj: "72.375.545/0001-93" },
  { id: 2, nomeFantasia: "Eventos Agro Brasil", cnpj: "56.338.814/0001-95" },
  { id: 3, nomeFantasia: "Rural Shows Ltda.", cnpj: "12.345.678/0001-90" },
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

// ==========================================================
// PÁGINA: ADICIONAR PROMOTORA DE EVENTOS PECUÁRIOS (US058 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarPromotoraEventosPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [nomeComercial, setNomeComercial] = useState("");
  const [aderidaFundesa, setAderidaFundesa] = useState<boolean | "">("");
   // 4. Contatos
  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não",
    
    proprietariosSelecionados: [] as string[],
    emailFixo: "",
    emailFixoObs: "",
    telefoneFixo: "",
    telefoneFixoObs: "",
    contatosAdicionais: [] as any[]
  });

  // ---- Proprietário (PJ, único) ----
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), entidade: null }]);
  const [modalProprietario, setModalProprietario] = useState(false);

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

  // ---- Anexos ----
  const [anexos, setAnexos] = useState<any[]>([]);

  // ---- Observação ----
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="promotora-eventos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("promotora-eventos")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Promotoras de Eventos Pecuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Promotora de Eventos Pecuários</h1>
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
          <div className="flex flex-col gap-5">
            <FloatInput label="Nome Comercial da Promotora" required value={nomeComercial} onChange={setNomeComercial} maxLength={255} />

            <SubGrupo titulo="Opção de Recolhimento" comDivisor>
              <SimNao label="Promotora Aderida ao Fundo Privado (FUNDESA)?" name="aderida-fundesa" required value={aderidaFundesa} onChange={setAderidaFundesa} />
            </SubGrupo>

           
          </div>
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

        {/* 2. Informações de Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) => setEndereco((prev: any) => ({ ...prev, [key]: value }))}
            onSetMultipleFields={(fields) => setEndereco((prev: any) => ({ ...prev, ...fields }))}
          />
        </Section>

       
 {/* 4. Informações de Contato */}
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

        {/* 5. Anexos (zero ou mais) */}
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

        {/* 6. Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

     

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Promotora cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `"${nomeComercial}"` : "A promotora"} foi cadastrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("promotora-eventos"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-promotora-eventos"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}