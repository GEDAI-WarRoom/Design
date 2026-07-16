import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronUp, ChevronDown  } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, UploadField, LargeTextArea, SimNao } from "../../../components/ui/FormKit";
import {
  ProprietarioInput,
  ResponsavelTecnicoInput,
  CertificadoraInput,
  DynamicListWrapper,
  ProfissionalAnimalInput
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Status oficiais do SISBOV (lista da US054)
const STATUS_CERTIFICADORA = [
  "Regular",
  "Suspensa em decorrência de não atualização de cadastro determinados no Ofício Circular da Coordenação de Sistemas de Rastreabilidade 019 de 27 de setembro de 2007",
  "Descredenciada em decorrência de não fornecimento das informações solicitadas pelo Ofício Circular da Coordenação de Sistemas de Rastreabilidade 003 de 16 de março de 2007",
  "Escritório suspenso faltando informação sobre anotação de responsabilidade técnica do médico veterinário",
  "Bloqueada",
  "Acesso regular via liminar",
  "Suspensão da inserção de novas propriedades até conclusão de procedimento administrativo",
  "Escritório fechado por iniciativa da certificadora em 01/11/2007",
  "Descredenciada a pedido",
];

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
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

// ==========================================================
// PÁGINA: ADICIONAR CERTIFICADORA SISBOV (US054 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarCertificadoraSISBOVPage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [nome, setNome] = useState("");

  // Proprietário (+ CNPJ somente leitura)
  const [proprietario, setProprietario] = useState<any | null>(null);
  // Responsável Técnico (+ CPF somente leitura)
  const [responsavel, setResponsavel] = useState<any | null>(null);

  // Informações Complementares
  const [credenciamento, setCredenciamento] = useState("");
  const [status, setStatus] = useState("");
  const [possuiCertEscritorio, setPossuiCertEscritorio] = useState("Não");
  const [certEscritorio, setCertEscritorio] = useState<any | null>(null);

  // Anexos + Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  // Certificadora do Escritório só quando "Possui" = Sim
  const mostrarCertEscritorio = possuiCertEscritorio === "Sim";

  const handlePossui = (v: string) => {
    setPossuiCertEscritorio(v);
    if (v !== "Sim") setCertEscritorio(null);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="certificadora-sisbov" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("certificadora-sisbov")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Certificadoras SISBOV
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Certificadora SISBOV</h1>
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
          <div className="grid grid-cols-1 gap-5">
            <FloatInput
              label="Nome da Certificadora SISBOV"
              required
              value={nome}
              onChange={setNome}
              maxLength={255}
              hasTooltip
              tooltipText="Nome comercial de identificação da certificadora SISBOV."
            />
          </div>
        </Section>

        {/* 2. Proprietário */}
        <Section title="Proprietário">
     
            <ProprietarioInput
              label="Proprietário"
              required
              value={proprietario ? proprietario.nome : ""}
              onChange={(ent: any) => setProprietario(ent)}
              onEyeClick={() => proprietario && onNavigate("visualizar-pessoa-juridica", proprietario)}
            />
                      

        </Section>

        {/* 3. Responsável Técnico */}
        <Section title="Responsável Técnico">
            <ResponsavelTecnicoInput
              label="Responsável Técnico"
              required
              value={responsavel ? responsavel.nome : ""}
              onChange={(ent: any) => setResponsavel(ent)}
              onEyeClick={() => responsavel && onNavigate("visualizar-profissional", responsavel)}
            />
        </Section>

        {/* 4. Informações Complementares */}
        <Section title="Informações Complementares">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput
                label="Credenciamento pela IN17_2006"
                required
                value={credenciamento}
                onChange={(v: string) => setCredenciamento(v.replace(/\D/g, ""))}
                maxLength={255}
                inputMode="numeric"
              />
              <FloatSelect
                label="Status da Certificadora"
                required
                value={status}
                onChange={setStatus}
                options={STATUS_CERTIFICADORA.map((s) => ({ value: s, label: s }))}
              />
            </div>

            <div className="grid grid-cols-1  gap-5">
              <SimNao
      label="Possui Certificadora do Escritório?"
      required
      value={possuiCertEscritorio}
      onChange={handlePossui} // 💡 Certifique-se de que a sua função salva "Sim" ou "Não" (ou true/false)
    />
               
            {possuiCertEscritorio && (
                <CertificadoraInput
                 label="Certificadora do Escritório"
                  required
                 value={certEscritorio ? certEscritorio.nome : ""}
                  onChange={(ent: any) => setCertEscritorio(ent)}
                  onEyeClick={() => certEscritorio && onNavigate("visualizar-certificadora-sisbov", certEscritorio)}
                />
              )} 
            </div>
          </div>
        </Section>

        {/* 5. Anexos (zero ou mais) */}
        <Section title="Anexos">
          <DynamicListWrapper
            items={anexos}
            behavior="zero-or-more"
            addButtonLabel="Adicionar Anexo"
            onAddItem={() => setAnexos((p) => [...p, { uid: uid("anx"), nome: "", descricao: "" }])}
            onRemoveItem={(i: number) => setAnexos((p) => p.filter((_, idx) => idx !== i))}
            variant="numbered"
            showCounter
            emptyLabel="Nenhum anexo adicionado."
          >
            {(item: any, index: number) => (
              <div className="flex gap-3 items-start w-full">
                <UploadField
                  label="Documento"
                  required
                  fileName={item.nome}
                  onSelectFile={() => setAnexos((prev) => prev.map((a, i) => (i === index ? { ...a, nome: `documento_${index + 1}.pdf` } : a)))}
                />
                {item.nome && (
                  <div className="flex-1">
                    <FloatInput label="Descrição" value={item.descricao || ""} placeholder="Descrição opcional..." maxLength={255} onChange={(v: string) => setAnexos((prev) => prev.map((a, i) => (i === index ? { ...a, descricao: v } : a)))} />
                  </div>
                )}
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        {/* 6. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            maxLength={1500}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Certificadora SISBOV adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A certificadora"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("certificadora-sisbov"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-certificadora-sisbov", {
                nome,
                proprietario: proprietario?.nome, cnpj: proprietario?.documento,
                responsavel: responsavel?.nome, cpf: responsavel?.documento,
                credenciamento, status,
                situacao: "Ativo",
              }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}