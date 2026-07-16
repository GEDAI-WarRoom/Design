import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, UploadField, LargeTextArea, SimNao,
} from "../../../components/ui/FormKit";
import { PessoaFisicaInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US052 - AC3)
// ==========================================================
const FORMACOES = [
  "Médico Veterinário", "Biofísico", "Biólogo", "Bioquímico", "Biotecnólogo",
  "Engenheiro Agrícola", "Engenheiro Agrônomo", "Engenheiro de Alimentos",
  "Engenheiro de Produção", "Engenheiro Químico", "Engenheiro Sanitário",
  "Nutricionista", "Tecnólogo em Alimentos", "Zootecnista", "Outra",
].map((f) => ({ value: f, label: f }));

const TIPO_REGISTRO_CRMV = [
  { value: "Primário", label: "Primário" },
  { value: "Secundário", label: "Secundário" },
];

// Grupos de formação que compartilham o mesmo tipo de conselho
const FORMACOES_CREA = ["Engenheiro Agrícola", "Engenheiro Agrônomo", "Engenheiro de Alimentos", "Engenheiro de Produção", "Engenheiro Químico", "Engenheiro Sanitário"];

// ==========================================================
// MOCK: Pessoas Físicas (com flags de serviço oficial) — substituir por API (US042)
// ==========================================================
const PESSOAS_FISICAS_SERVICO_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", servicoOficial: "Sim", esfera: "Estadual", masp: "10455301" },
  { id: 2, nome: "Josephina Arantes", documento: "444.009.956-40", servicoOficial: "Não", esfera: "", masp: "" },
  { id: 3, nome: "Carla Menezes Rocha", documento: "111.998.775-30", servicoOficial: "Sim", esfera: "Federal", masp: "" },
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
// PÁGINA: ADICIONAR PROFISSIONAL DA ÁREA ANIMAL (US052 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarProfissionalAnimalPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [pessoaFisica, setPessoaFisica] = useState<any | null>(null);

  // ---- Informações Profissionais ----
  const [formacao, setFormacao] = useState("");
  const [crmvMg, setCrmvMg] = useState("");
  const [tipoRegistroCrmv, setTipoRegistroCrmv] = useState("");
  const [creaMg, setCreaMg] = useState("");
  const [crbio, setCrbio] = useState("");
  const [crbq, setCrbq] = useState("");
  const [crbioOuCrea, setCrbioOuCrea] = useState("");
  const [crn, setCrn] = useState("");
  const [crnOuCrea, setCrnOuCrea] = useState("");
  const [nomeProfissao, setNomeProfissao] = useState("");
  const [siglaConselho, setSiglaConselho] = useState("");
  const [numeroConselho, setNumeroConselho] = useState("");

  // ---- Vacinação Contra Brucelose ----
  const [vacinacaoBrucelose, setVacinacaoBrucelose] = useState<boolean | "">("");

  // ---- Anexos ----
  const [anexos, setAnexos] = useState<any[]>([]);

  // ---- Observação ----
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  // ==========================================================
  // DERIVADOS / CONDICIONAIS
  // ==========================================================
  const cpfPreenchido = !!pessoaFisica;
  const servicoOficial = pessoaFisica?.servicoOficial === "Sim";
  const esferaEstadual = pessoaFisica?.esfera === "Estadual";

  const isVetOuZoo = formacao === "Médico Veterinário" || formacao === "Zootecnista";
  const isCrea = FORMACOES_CREA.includes(formacao);
  const isBiofisicoOuBiologo = formacao === "Biofísico" || formacao === "Biólogo";
  const isBioquimico = formacao === "Bioquímico";
  const isBiotecnologo = formacao === "Biotecnólogo";
  const isNutricionista = formacao === "Nutricionista";
  const isTecnologo = formacao === "Tecnólogo em Alimentos";
  const isOutra = formacao === "Outra";
  const isMedicoVet = formacao === "Médico Veterinário";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-area-animal" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("profissional-area-animal")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os Profissionais da Área Animal
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Profissional da Área Animal</h1>
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
            <PessoaFisicaInput
              value={pessoaFisica ? pessoaFisica.nome : ""}
              required
              data={PESSOAS_FISICAS_SERVICO_MOCK}
              onChange={(ent) => setPessoaFisica(ent)}
              onEyeClick={() => pessoaFisica && onNavigate("visualizar-pessoa-fisica", pessoaFisica)}
            />

            {/* Serviço Oficial (somente leitura) — disponível quando CPF preenchido */}
            {cpfPreenchido && (
              <SubGrupo titulo="Serviço Oficial" comDivisor>
                <FloatInput label="Serviço Oficial?" required disabled value={pessoaFisica.servicoOficial || "Não"} onChange={() => {}}  />

                {/* Se serviço oficial = Sim, exibe esfera e (se estadual) MASP */}
                {servicoOficial && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FloatInput label="Esfera do Serviço Oficial" required disabled value={pessoaFisica.esfera || ""} onChange={() => {}} />
                    {esferaEstadual && (
                      <FloatInput label="MASP" required disabled value={pessoaFisica.masp || ""} onChange={() => {}} hasTooltip tooltipText="Módulo de Autorização de Serviços Profissionais. Disponível para esfera Estadual." />
                    )}
                  </div>
                )}
              </SubGrupo>
            )}
          </div>
        </Section>

        {/* 2. Informações Profissionais */}
        <Section title="Informações Profissionais">
          <div className="flex flex-col gap-5">
            <FloatSelect label="Formação Profissional" required value={formacao} onChange={setFormacao} options={FORMACOES} />

            {/* Médico Veterinário ou Zootecnista → CRMV-MG + Tipo de Registro */}
            {isVetOuZoo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FloatInput label="CRMV-MG" required value={crmvMg} onChange={(v) => setCrmvMg(v.slice(0, 30))} maxLength={30} />
                <FloatSelect label="Tipo de Registro do CRMV" required value={tipoRegistroCrmv} onChange={setTipoRegistroCrmv} options={TIPO_REGISTRO_CRMV} />
              </div>
            )}

            {/* Engenheiros → CREA-MG */}
            {isCrea && (
              <FloatInput label="CREA-MG" required value={creaMg} onChange={(v) => setCreaMg(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Biofísico ou Biólogo → CRBio */}
            {isBiofisicoOuBiologo && (
              <FloatInput label="CRBio" required value={crbio} onChange={(v) => setCrbio(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Bioquímico → CRBQ */}
            {isBioquimico && (
              <FloatInput label="CRBQ" required value={crbq} onChange={(v) => setCrbq(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Biotecnólogo → CRBio ou CREA */}
            {isBiotecnologo && (
              <FloatInput label="CRBio ou CREA" required value={crbioOuCrea} onChange={(v) => setCrbioOuCrea(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Nutricionista → CRN */}
            {isNutricionista && (
              <FloatInput label="CRN" required value={crn} onChange={(v) => setCrn(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Tecnólogo → CRN ou CREA */}
            {isTecnologo && (
              <FloatInput label="CRN ou CREA" required value={crnOuCrea} onChange={(v) => setCrnOuCrea(v.slice(0, 30))} maxLength={30} />
            )}

            {/* Outra → Nome da Profissão + Sigla do Conselho + Número do Conselho */}
            {isOutra && (
              <SubGrupo titulo="Outra Formação" comDivisor>
                <FloatInput label="Nome da Profissão" required value={nomeProfissao} onChange={(v) => setNomeProfissao(v.slice(0, 255))} maxLength={255} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FloatInput label="Sigla do Conselho" required value={siglaConselho} onChange={(v) => setSiglaConselho(v.slice(0, 30))} maxLength={30} />
                  <FloatInput label="Número do Conselho" required value={numeroConselho} onChange={(v) => setNumeroConselho(v.slice(0, 30))} maxLength={30} />
                </div>
              </SubGrupo>
            )}
          </div>
        </Section>

        {/* 3. Vacinação Contra Brucelose — apenas Médico Veterinário */}
        {isMedicoVet && (
          <Section title="Vacinação Contra Brucelose">
            <SimNao label="Cadastrado para Vacinação Contra Brucelose?" name="vacinacao-brucelose" required value={vacinacaoBrucelose} onChange={setVacinacaoBrucelose} />
          </Section>
        )}

        {/* 4. Anexos (zero ou mais) */}
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

        {/* 5. Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Profissional cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{pessoaFisica ? `"${pessoaFisica.nome}"` : "O profissional"} foi cadastrado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("profissional-area-animal"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-profissional-area-animal"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}