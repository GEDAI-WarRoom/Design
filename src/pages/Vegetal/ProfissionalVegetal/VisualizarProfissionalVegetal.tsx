import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_PROFISSIONAL = { nome: "Eloiza Silva", cpf: "444.009.956-40", formacao: "Engenheiro Agrônomo", crea: "506779200", coordenadoria: "Coordenadoria Regional de Oliveira", habilitacao: "Habilitado para emissão de PTV", numeroHabilitacao: "31250001", situacao: "Ativo", anexos: [{ nome: "registro_crea.pdf", descricao: "Comprovante de registro profissional" }], observacao: "Profissional habilitado para emissão de PTV na regional de Oliveira." };

function Section({ title, children }: { title: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function VisualizarProfissionalVegetalPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const profissional = { ...(dados || {}), nome: dados?.nome || EXEMPLO_PROFISSIONAL.nome, cpf: dados?.cpf || dados?.documento || EXEMPLO_PROFISSIONAL.cpf, formacao: dados?.formacao || EXEMPLO_PROFISSIONAL.formacao, crea: dados?.crea || dados?.registro || EXEMPLO_PROFISSIONAL.crea, coordenadoria: dados?.coordenadoria || EXEMPLO_PROFISSIONAL.coordenadoria, habilitacao: dados?.habilitacao || EXEMPLO_PROFISSIONAL.habilitacao, numeroHabilitacao: dados?.numeroHabilitacao || EXEMPLO_PROFISSIONAL.numeroHabilitacao, situacao: dados?.situacao || EXEMPLO_PROFISSIONAL.situacao, anexos: dados?.anexos?.length ? dados.anexos : EXEMPLO_PROFISSIONAL.anexos, observacao: dados?.observacao || EXEMPLO_PROFISSIONAL.observacao };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-vegetal" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("profissional-vegetal")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Profissionais da Área Vegetal
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Profissional</h1>
            <button type="button" onClick={() => onNavigate("editar-profissional-vegetal", profissional)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome Completo" value={profissional.nome} disabled onChange={() => {}} />
            <FloatInput label="CPF" value={profissional.cpf} disabled onChange={() => {}} />
          </div>
        </Section>

        <Section title="Informações Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Formação Profissional" value={profissional.formacao} disabled onChange={() => {}} /><FloatInput label="CREA" value={profissional.crea} disabled onChange={() => {}} /><FloatInput label="Coordenadoria Regional de Vinculação" value={profissional.coordenadoria} disabled onChange={() => {}} /></div>
        </Section>

        <Section title="Habilitação Profissional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Habilitação" value={profissional.habilitacao} disabled onChange={() => {}} /><FloatInput label="Número da Habilitação" value={profissional.numeroHabilitacao} disabled onChange={() => {}} /></div>
        </Section>

        <Section title="Anexos">
          {profissional.anexos.map((anexo: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Documento" value={anexo.nome} disabled onChange={() => {}} /><FloatInput label="Descrição" value={anexo.descricao} disabled onChange={() => {}} /></div>)}
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={profissional.observacao} disabled onChange={() => {}} />
        </Section>
      </main>
    </div>
  );
}
