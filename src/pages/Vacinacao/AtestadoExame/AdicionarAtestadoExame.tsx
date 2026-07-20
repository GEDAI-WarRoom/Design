import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, AlertTriangle, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { DoencaInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS LOCAIS (Sobrescrevendo o padrão para corrigir "Raiva")
// ==========================================================
const DOENCAS_CORRIGIDAS_MOCK = [
  { id: 1, codigo: "D01", nome: "Febre Aftosa" },
  { id: 2, codigo: "D02", nome: "Brucelose" },
  { id: 3, codigo: "D03", nome: "Tuberculose Bovina" },
  { id: 4, codigo: "D04", nome: "Raiva" }, 
  { id: 5, codigo: "D05", nome: "Anemia Infecciosa Equina (AIE)" },
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

// ==========================================================
// PÁGINA: ADICIONAR ATESTADO DE EXAME
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarAtestadoExamePage({ onLogout, onNavigate }: PageProps) {
  // Estados dos campos do formulário
  const [descricao, setDescricao] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [diasValidade, setDiasValidade] = useState("");

  // Estados dos Modais
  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false); // Novo estado para o modal de erro

  const handleSalvar = () => {
    // Validações de campos obrigatórios antes do salvamento
    if (!descricao || !doenca || !diasValidade) {
      setIsErro(true); // Aciona o modal customizado de erro ao invés do alert() nativo
      return;
    }
    
    // Simula o sucesso do cadastro
    setIsSucesso(true);
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Atestado de Exame</h1>
            <button 
              type="button" 
              onClick={handleSalvar} 
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Alerta de Obrigatoriedade */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Formulário - Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            
            <div className="w-full">
              <FloatInput
                label="Descrição do atestado"
                required
                value={descricao}
                onChange={setDescricao}
                maxLength={255}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
              <DoencaInput
                required
                data={DOENCAS_CORRIGIDAS_MOCK}
                value={doenca ? doenca.nome : ""}
                onChange={(entidade) => setDoenca(entidade)}
                onEyeClick={() => {
                  if (doenca?.codigo) alert(`Visualizar detalhes da doença: ${doenca.nome}`);
                  else alert("Por favor, selecione uma doença primeiro.");
                }}
              />

              <FloatInput
                label="Dias de Validade do Exame"
                required
                value={diasValidade}
                onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} 
                maxLength={3}
              />
            </div>

          </div>
        </Section>
      </main>

      {/* Modal de Erro (Substituto do Alert Nativo) */}
      {isErro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Ícone de Alerta */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Campos obrigatórios faltando</h3>
            <p className="text-sm text-gray-500 mt-2">
              Por favor, preencha todos os campos obrigatórios marcados com asterisco (*) antes de prosseguir.
            </p>
            
            <div className="flex justify-center mt-8 w-full">
              <button 
                type="button"
                onClick={() => setIsErro(false)} 
                className="px-10 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition w-full md:w-auto shadow-sm"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso (Alinhado visualmente com a referência) */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Ícone de Sucesso */}
            <div className="w-16 h-16 bg-[#eaf4eb] rounded-full flex items-center justify-center mb-5">
              <Check size={32} className="text-[#1A7A3C] stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Atestado adicionado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-2">O registro foi gravado.</p>
            
            <div className="flex gap-4 justify-center mt-8 w-full">
              <button 
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("atestado-exame"); }} 
                className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition w-full md:w-auto"
              >
                Voltar
              </button>
              <button 
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-atestado-exame"); }} 
                className="px-8 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition w-full md:w-auto shadow-sm"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}