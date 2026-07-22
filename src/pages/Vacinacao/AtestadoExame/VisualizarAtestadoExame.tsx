import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Eye, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// MOCK DO REGISTRO 
const REGISTRO_MOCK = {
  id: 1,
  descricao: "Atestado de Raiva",
  doenca: { codigo: "D04", nome: "Raiva" },
  diasValidade: "180",
  situacao: "Ativo"
};

// HELPERS DE UI
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

// Componente para exibir entidades selecionadas com o botão de visualizar ("olhinho")
function EntidadeLeitura({ label, value, icon, onVer }: { label: string; value: string; icon?: React.ReactNode; onVer?: () => void }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <FloatInput label={label} value={value} icon={icon} disabled onChange={() => { }} />
      </div>
      {onVer && (
        <button
          type="button"
          onClick={onVer}
          title={`Visualizar ${label}`}
          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition h-12 flex items-center flex-shrink-0 cursor-pointer"
        >
          <Eye size={20} />
        </button>
      )}
    </div>
  );
}

// PÁGINA: VISUALIZAR ATESTADO DE EXAME
interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export function VisualizarAtestadoExamePage({
  onLogout = () => {},
  onNavigate = (screen) => console.log("navigate:", screen),
}: PageProps) {
  
  const r = REGISTRO_MOCK;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button 
            type="button" 
            onClick={() => onNavigate("atestado-exame")} 
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" 
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Atestados de Exame
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Atestado de Exame</h1>
            
            {/* Botão de Editar ao invés de Salvar */}
            <button 
              type="button" 
              onClick={() => onNavigate("editar-atestado-exame", r)} 
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
            >
              <Pencil size={16} />
              Editar
            </button>
          </div>
        </div>

        {/* Formulário - Informações Básicas (Somente Leitura) */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            
            <div className="w-full">
              <FloatInput
                label="Descrição do atestado"
                value={r.descricao}
                disabled
                onChange={() => {}}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full">
              
              {/* Leitura da Entidade Doença com olhinho para ver detalhes */}
              <EntidadeLeitura 
                label="Doença" 
                value={r.doenca.nome} 
                onVer={() => alert(`Visualizar detalhes da doença: ${r.doenca.nome}`)} 
              />

              <FloatInput
                label="Dias de Validade do Exame"
                value={r.diasValidade}
                disabled
                onChange={() => {}}
              />

              {/* Situação agora é exibida, conforme AC de "Disponível após o cadastro" */}
              <FloatSelect
                label="Situação"
                value={r.situacao}
                options={[{ value: r.situacao, label: r.situacao }]}
                disabled
                onChange={() => {}}
              />

            </div>

          </div>
        </Section>
      </main>
    </div>
  );
}

export default VisualizarAtestadoExamePage;