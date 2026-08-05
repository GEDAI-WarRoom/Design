import React, { useState } from "react";
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_CULTURA = {
  nome: "Café",
  tipo: "Perene",
  variedades: [{ uid: "var-exemplo", nome: "Catuaí Vermelho" }],
  pragas: [{ uid: "praga-exemplo", praga: { nomeCientifico: "Hypothenemus hampei", nomePopular: "Broca-do-café" } }],
  situacao: "Ativo",
  observacao: "Cultura perene de relevância econômica para Minas Gerais.",
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

export function EditarCulturaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [nome, setNome] = useState(dados?.nome || EXEMPLO_CULTURA.nome);
  const [tipo, setTipo] = useState(dados?.tipo || EXEMPLO_CULTURA.tipo);
  const [variedades, setVariedades] = useState(dados?.variedades?.length ? dados.variedades : EXEMPLO_CULTURA.variedades);
  const [pragas, setPragas] = useState(dados?.pragas?.length ? dados.pragas : EXEMPLO_CULTURA.pragas);
  const [situacao, setSituacao] = useState(dados?.situacao || EXEMPLO_CULTURA.situacao);
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_CULTURA.observacao);

  const dadosAtualizados = { ...dados, nome, tipo, variedades, pragas, situacao, observacao };

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cultura" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("cultura")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Culturas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Cultura</h1>
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
            <FloatInput label="Nome da Cultura" required value={nome} onChange={setNome} maxLength={255} />
            <FloatSelect label="Tipo de Cultura" required value={tipo} onChange={setTipo} options={[{ value: "Anual", label: "Anual" }, { value: "Perene", label: "Perene" }]} />
          </div>
        </Section>

        <Section title="Variedades">
          {variedades.map((variedade: any, index: number) => <FloatInput key={variedade.uid || index} label={`Nome da Variedade ${index + 1}`} value={variedade.nome} onChange={(value) => setVariedades((items: any[]) => items.map((item, itemIndex) => itemIndex === index ? { ...item, nome: value } : item))} />)}
        </Section>

        <Section title="Pragas">
          {pragas.map((item: any, index: number) => <div key={item.uid || index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Nome Científico" value={item.praga?.nomeCientifico || ""} onChange={(value) => setPragas((items: any[]) => items.map((current, itemIndex) => itemIndex === index ? { ...current, praga: { ...current.praga, nomeCientifico: value } } : current))} /><FloatInput label="Nome Popular" value={item.praga?.nomePopular || ""} onChange={(value) => setPragas((items: any[]) => items.map((current, itemIndex) => itemIndex === index ? { ...current, praga: { ...current.praga, nomePopular: value } } : current))} /></div>)}
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">A cultura "{nome}" foi atualizada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("cultura"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-cultura", dadosAtualizados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
