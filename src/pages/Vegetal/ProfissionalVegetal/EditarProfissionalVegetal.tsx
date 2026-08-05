import React, { useState } from "react";
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_PROFISSIONAL = {
  nome: "Josephina Arantes",
  cpf: "444.009.956-40",
  formacao: "Engenheiro Agrônomo",
  crea: "506779200",
  coordenadoria: "Coordenadoria Regional de Oliveira",
  habilitacao: "Habilitado para emissão de PTV",
  numeroHabilitacao: "31250001",
  situacao: "Ativo",
  anexos: [{ nome: "registro_crea.pdf", descricao: "Comprovante de registro profissional" }],
  observacao: "Profissional habilitado para emissão de PTV na regional de Oliveira.",
};

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

export function EditarProfissionalVegetalPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [nome, setNome] = useState(dados?.nome || EXEMPLO_PROFISSIONAL.nome);
  const [cpf] = useState(dados?.cpf || dados?.documento || EXEMPLO_PROFISSIONAL.cpf);
  const [formacao, setFormacao] = useState(dados?.formacao || EXEMPLO_PROFISSIONAL.formacao);
  const [crea, setCrea] = useState(dados?.crea || dados?.registro || EXEMPLO_PROFISSIONAL.crea);
  const [coordenadoria, setCoordenadoria] = useState(dados?.coordenadoria || EXEMPLO_PROFISSIONAL.coordenadoria);
  const [habilitacao, setHabilitacao] = useState(dados?.habilitacao || EXEMPLO_PROFISSIONAL.habilitacao);
  const [numeroHabilitacao, setNumeroHabilitacao] = useState(dados?.numeroHabilitacao || EXEMPLO_PROFISSIONAL.numeroHabilitacao);
  const [situacao, setSituacao] = useState(dados?.situacao || EXEMPLO_PROFISSIONAL.situacao);
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_PROFISSIONAL.observacao);
  const anexos = dados?.anexos?.length ? dados.anexos : EXEMPLO_PROFISSIONAL.anexos;

  const dadosAtualizados = { ...dados, nome, cpf, documento: cpf, formacao, crea, registro: crea, coordenadoria, habilitacao, numeroHabilitacao, situacao, anexos, observacao };

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-vegetal" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("profissional-vegetal")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Profissionais da Área Vegetal
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Profissional Vegetal</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome Completo" required value={nome} onChange={setNome} maxLength={255} />
            <FloatInput label="CPF" required value={cpf} onChange={setCpf} maxLength={14} disabled />
          </div>
        </Section>

        <Section title="Informações Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect label="Formação Profissional" required value={formacao} onChange={setFormacao} options={[{ value: "Engenheiro Agrônomo", label: "Engenheiro Agrônomo" }, { value: "Engenheiro Florestal", label: "Engenheiro Florestal" }]} />
            <FloatInput label="CREA" required value={crea} onChange={setCrea} />
            <FloatInput label="Coordenadoria Regional de Vinculação" value={coordenadoria} onChange={setCoordenadoria} />
          </div>
        </Section>

        <Section title="Habilitação Profissional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect label="Habilitação" value={habilitacao} onChange={setHabilitacao} options={[{ value: "Habilitado para emissão de PTV", label: "Habilitado para emissão de PTV" }, { value: "Habilitado para emissão de CFO/CFOC", label: "Habilitado para emissão de CFO/CFOC" }, { value: "Não habilitado", label: "Não habilitado" }]} />
            <FloatInput label="Número da Habilitação" value={numeroHabilitacao} onChange={setNumeroHabilitacao} />
          </div>
        </Section>

        <Section title="Anexos">
          {anexos.map((anexo: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Documento" value={anexo.nome} disabled onChange={() => {}} /><FloatInput label="Descrição" value={anexo.descricao} disabled onChange={() => {}} /></div>)}
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O profissional "{nome}" foi atualizado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("profissional-vegetal"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-profissional-vegetal", dadosAtualizados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
