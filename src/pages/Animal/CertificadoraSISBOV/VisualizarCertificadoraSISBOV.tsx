import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, SimNao, UploadField } from "../../../components/ui/FormKit";
import { CertificadoraInput, ProprietarioInput, ResponsavelTecnicoInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <div className="bg-white rounded-xl shadow-sm">
    <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
      <span className="text-base font-semibold text-gray-800">{title}</span>
      {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
    </button>
    {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
  </div>;
}

interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: any; }

export function VisualizarCertificadoraSISBOVPage({ onLogout, onNavigate, dados }: PageProps) {
  const base = {
    id: 1,
    nome: "Rastro de Boi",
    proprietario: { nome: "Rastro de Boi Certificação", documento: "72.375.545/0001-93", tipo: "PJ" },
    responsavel: { nome: "Gustavo de Souza Sobrinho", documento: "555.009.956-40" },
    credenciamento: "1706",
    status: "Regular",
    possuiCertEscritorio: "Não",
    certEscritorio: null,
    anexos: [{ uid: "anx-1", nome: "credenciamento_sisbov.pdf", descricao: "Documento de credenciamento" }],
    observacao: "Certificadora credenciada e com cadastro atualizado.",
    ...dados,
  };
  const entidade = (valor: any, fallback: any) => {
    if (valor && typeof valor === "object") return { ...fallback, ...valor };
    if (!valor) return fallback;
    const partes = String(valor).split(" - ");
    return partes.length > 1 ? { ...fallback, documento: partes[0], nome: partes.slice(1).join(" - ") } : { ...fallback, nome: valor };
  };
  const proprietario = entidade(base.proprietario, { nome: "Rastro de Boi Certificação", documento: "72.375.545/0001-93", tipo: "PJ" });
  const responsavel = entidade(base.responsavel, { nome: "Gustavo de Souza Sobrinho", documento: "555.009.956-40" });
  const certEscritorio = entidade(base.certEscritorio, { nome: "Certificadora Condão", proprietario: "45.221.118/0001-40 - Rastreabilidade Sul Ltda." });
  const registro = { ...base, proprietario, responsavel, certEscritorio: base.certEscritorio ? certEscritorio : null };

  return <div className="min-h-screen bg-[#f2f3f5]">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="certificadora-sisbov" hideSearch />
    <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
      <div>
        <button type="button" onClick={() => onNavigate("certificadora-sisbov")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}><ArrowLeft size={15} /> Todas as Certificadoras SISBOV</button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar Certificadora SISBOV</h1>
          <button type="button" onClick={() => onNavigate("editar-certificadora-sisbov", registro)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Editar</button>
        </div>
      </div>

      <Section title="Informações Básicas">
        <FloatInput label="Nome da Certificadora SISBOV" required disabled value={registro.nome} onChange={() => {}} maxLength={255} hasTooltip tooltipText="Nome comercial de identificação da certificadora SISBOV." />
      </Section>
      <Section title="Proprietário">
        <ProprietarioInput label="Proprietário" required disabled value={proprietario.nome} data={[proprietario]} onChange={() => {}} />
      </Section>
      <Section title="Responsável Técnico">
        <ResponsavelTecnicoInput label="Responsável Técnico" required disabled value={responsavel.nome} data={[responsavel]} onChange={() => {}} />
      </Section>
      <Section title="Informações Complementares">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FloatInput label="Credenciamento pela IN17_2006" required disabled value={registro.credenciamento} onChange={() => {}} maxLength={255} />
            <FloatSelect label="Status da Certificadora" required disabled value={registro.status} onChange={() => {}} options={STATUS_CERTIFICADORA.map((item) => ({ value: item, label: item }))} />
          </div>
          <SimNao name="possui-certificadora-escritorio-visualizacao" label="Possui Certificadora do Escritório?" required disabled value={registro.possuiCertEscritorio || "Não"} onChange={() => {}} />
          {registro.possuiCertEscritorio === "Sim" && registro.certEscritorio && <CertificadoraInput label="Certificadora do Escritório" required disabled value={certEscritorio.nome} data={[certEscritorio]} onChange={() => {}} />}
        </div>
      </Section>
      <Section title="Anexos">
        {registro.anexos?.length ? <div className="flex flex-col gap-4">{registro.anexos.map((item: any, index: number) => <div key={item.uid || index} className="flex gap-3 items-start w-full">
          <UploadField label="Documento" required disabled fileName={item.nome || `documento_${index + 1}.pdf`} onSelectFile={() => {}} />
          <div className="flex-1"><FloatInput label="Descrição" disabled value={item.descricao || "Documento da certificadora"} onChange={() => {}} maxLength={255} /></div>
        </div>)}</div> : <p className="text-sm text-gray-500">Nenhum anexo adicionado.</p>}
      </Section>
      <Section title="Observações">
        <LargeTextArea label="Observação" disabled value={registro.observacao || ""} onChange={() => {}} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
      </Section>
    </main>
  </div>;
}
