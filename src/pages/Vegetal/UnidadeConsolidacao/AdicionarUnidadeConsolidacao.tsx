import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
  Leaf, Eye,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, UploadField, LargeTextArea, SearchModal,
} from "../../../components/ui/FormKit";
import {
  DynamicListWrapper, ProprietarioInput,
  BlocoEnderecoFields, BlocoContatoFields,
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS (substituir por API — ver US064)
// ==========================================================
interface ProfissionalVegetal { id: number; nome: string; cpf: string; formacao: string }

const ENGENHEIROS_MOCK: ProfissionalVegetal[] = [
  { id: 1, nome: "Flávio Silva", cpf: "111.222.333-44", formacao: "Engenheiro Agrônomo" },
  { id: 2, nome: "Renata Braga", cpf: "222.333.444-55", formacao: "Engenheiro Florestal" },
];

const RESPONSAVEIS_PTV_MOCK: ProfissionalVegetal[] = [
  { id: 3, nome: "Divino de Souza Sobrinho", cpf: "444.009.956-40", formacao: "Engenheiro Agrônomo" },
  { id: 4, nome: "Carla Menezes Rocha", cpf: "111.998.775-30", formacao: "Engenheiro Florestal" },
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

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Campo de profissional da área vegetal, com olho de visualização
// Campo de profissional da área vegetal, com CPF e olho de visualização na mesma linha
function ProfissionalVegetalField({
  label, value, onOpen, onEye,
}: { label: string; value: ProfissionalVegetal | null; onOpen: () => void; onEye: () => void }) {
  return (
    <div className="w-full">
      {/* Grid responsável por alinhar tudo na mesma linha horizontal no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end w-full">
        
        {/* Se houver valor, o nome ocupa metade da linha (6/12). Se não houver, ocupa tudo (12/12) */}
        <div className={value ? "md:col-span-6" : "md:col-span-12"}>
          <FloatInput
            label={label}
            required
            value={value ? value.nome : ""}
            icon={<img src={Icons.iconeProfissionalVegetalUrl} alt="Profissional Vegetal" className="w-5 h-5 object-contain" />} 
            onClick={onOpen}
            readOnly
          />
        </div>

        {/* O CPF entra logo em seguida ocupando 5/12 do espaço */}
        {value && (
          <div className="md:col-span-5 animate-fade-in">
            <FloatInput 
              label="CPF" 
              required 
              disabled 
              value={value.cpf} 
              onChange={() => {}} 
            />
          </div>
        )}

        {/* O botão do olho consome o 1/12 restante da linha */}
        {value && (
          <div className="md:col-span-1 flex justify-end animate-fade-in">
            <button
              type="button"
              onClick={onEye}
              className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition bg-white h-11 w-full flex items-center justify-center cursor-pointer"
              title="Visualizar Profissional"
            >
              <Eye size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR UNIDADE DE CONSOLIDAÇÃO (US078 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarUnidadeConsolidacaoPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [nome, setNome] = useState("");
  const [localizacaoLivro, setLocalizacaoLivro] = useState("");

  // ---- Proprietários (um ou mais) ----
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), proprietario: null }]);

  // ---- Profissionais ----
  const [engenheiro, setEngenheiro] = useState<ProfissionalVegetal | null>(null);
  const [responsavelPtv, setResponsavelPtv] = useState<ProfissionalVegetal | null>(null);
  const [modalEngenheiro, setModalEngenheiro] = useState(false);
  const [modalPtv, setModalPtv] = useState(false);

  // ---- Localização (simples, Estado fixo) ----
  const [endereco, setEndereco] = useState<any>({
    zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
  });

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
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-consolidacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("unidade-consolidacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Unidades de Consolidação
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Unidade de Consolidação</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput label="Nome da Unidade de Consolidação" required value={nome} onChange={setNome} maxLength={255} />
            <FloatInput label="Localização do Livro" value={localizacaoLivro} onChange={setLocalizacaoLivro} maxLength={255} />
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

        {/* 3. Profissionais */}
        <Section title="Profissionais">
          <div className="flex flex-col gap-6">
            <SubGrupo titulo="Engenheiro Agrônomo/Florestal">
              <ProfissionalVegetalField
                label="Engenheiro Agrônomo/Florestal"
                value={engenheiro}
                onOpen={() => setModalEngenheiro(true)}
                onEye={() => engenheiro && onNavigate("visualizar-profissional-area-vegetal", engenheiro)}
              />
            </SubGrupo>

            <SubGrupo titulo="Responsável pela Emissão de PTV" comDivisor>
              <ProfissionalVegetalField
                label="Responsável pela Emissão de PTV"
                value={responsavelPtv}
                onOpen={() => setModalPtv(true)}
                onEye={() => responsavelPtv && onNavigate("visualizar-profissional-area-vegetal", responsavelPtv)}
              />
            </SubGrupo>
          </div>
        </Section>

        {/* 4. Localização (Estado fixo) */}
        <Section title="Localização">
          <BlocoEnderecoFields
            title="Endereço"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) => setEndereco((prev: any) => ({ ...prev, [key]: value }))}
            onSetMultipleFields={(fields) => setEndereco((prev: any) => ({ ...prev, ...fields }))}
          />
        </Section>

        {/* 5. Contatos */}
        <Section title="Contatos">
          <BlocoContatoFields
            data={contato}
            onChange={(updated) => setContato((prev: any) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={proprietarios
              .filter((p) => p.proprietario)
              .map((p) => ({ id: p.uid, nome: p.proprietario.nome, cpf: p.proprietario.documento }))}
          />
        </Section>

        {/* 6. Anexos */}
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

        {/* 7. Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {/* Modal Engenheiro Agrônomo/Florestal */}
      <SearchModal<ProfissionalVegetal>
        open={modalEngenheiro}
        onClose={() => setModalEngenheiro(false)}
        title="Buscar Engenheiro Agrônomo ou Florestal"
        subtitle="Busque por um profissional da área vegetal cadastrado no sistema:"
        icon={<img src={Icons.iconeProfissionalVegetalUrl} alt="Profissional Vegetal" className="w-7 h-7 object-contain" />} 

        data={ENGENHEIROS_MOCK}
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }, { label: "Formação", key: "formacao" }]}
        searchKeys={["nome", "cpf", "formacao"]}
        searchPlaceholder="Buscar por Nome ou CPF"
        confirmLabel="Confirmar"
        onConfirm={(e) => { setEngenheiro(e); setModalEngenheiro(false); }}
      />

      {/* Modal Responsável pela Emissão de PTV */}
      <SearchModal<ProfissionalVegetal>
        open={modalPtv}
        onClose={() => setModalPtv(false)}
        title="Buscar Responsável pela Emissão de PTV"
        subtitle="Busque por um profissional habilitado para a emissão de PTV:"
        icon={<img src={Icons.iconeProfissionalVegetalUrl} alt="Profissional Vegetal" className="w-7 h-7 object-contain" />} 

        data={RESPONSAVEIS_PTV_MOCK}
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }, { label: "Formação", key: "formacao" }]}
        searchKeys={["nome", "cpf", "formacao"]}
        searchPlaceholder="Buscar por Nome ou CPF"
        confirmLabel="Confirmar"
        onConfirm={(p) => { setResponsavelPtv(p); setModalPtv(false); }}
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Unidade de consolidação cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A unidade"} foi cadastrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("unidade-consolidacao"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-unidade-consolidacao"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}