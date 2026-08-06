import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, AlertTriangle, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { DoencasAtestadoField } from "./DoencasAtestadoField";
import {
  obterAtestadoExame,
  salvarEdicaoAtestadoExame,
  SITUACOES_ATESTADO_EXAME,
  tipoAtestadoValido,
  type DadosAtestadoExame,
} from "./atestadoExameData";

const GREEN = "#1A7A3C";

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
// PÁGINA: EDITAR ATESTADO DE EXAME
// ==========================================================
interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
  dados?: any;
}

export function EditarAtestadoExamePage({ 
  onLogout = () => {}, 
  onNavigate = (screen) => console.log("navigate:", screen),
  dados,
}: PageProps) {
  const [registroAtual, setRegistroAtual] = useState<DadosAtestadoExame>(() =>
    obterAtestadoExame(dados),
  );
  const [descricao, setDescricao] = useState(registroAtual.descricao);
  const [doencas, setDoencas] = useState(registroAtual.doencas);
  const [diasValidade, setDiasValidade] = useState(registroAtual.diasValidade);
  const [situacao, setSituacao] = useState(registroAtual.situacao);

  // Estados dos Modais
  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false);

  const handleSalvar = () => {
    // Validações de campos obrigatórios (incluindo a Situação, que agora existe)
    if (!tipoAtestadoValido({ descricao, doencas, diasValidade }) || !situacao) {
      setIsErro(true);
      return;
    }
    
    const dadosAtuais: DadosAtestadoExame = {
      ...registroAtual,
      descricao: descricao.trim(),
      doencas,
      diasValidade,
      situacao,
    };
    const resultado = salvarEdicaoAtestadoExame(registroAtual, dadosAtuais);
    setRegistroAtual(resultado.registro);
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
            onClick={() => onNavigate("visualizar-atestado-exame", registroAtual)}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" 
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Visualizar Tipo de Atestado
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Tipo de Atestado</h1>
            <button 
              type="button" 
              onClick={handleSalvar} 
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Salvar Alterações
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

            <DoencasAtestadoField
              value={doencas}
              onChange={setDoencas}
              error={isErro && doencas.length === 0 ? "Selecione ao menos uma doença." : undefined}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
              <FloatInput
                label="Dias de Validade do Exame"
                required
                value={diasValidade}
                onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} 
                maxLength={3}
              />

              {/* Na edição, o campo situação é liberado e obrigatório */}
              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={setSituacao}
                options={SITUACOES_ATESTADO_EXAME}
              />
            </div>

          </div>
        </Section>
      </main>

      {/* Modal de Erro */}
      {isErro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Campos obrigatórios</h3>
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

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#eaf4eb] rounded-full flex items-center justify-center mb-5">
              <Check size={32} className="text-[#1A7A3C] stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Tipo de atestado atualizado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-2">As alterações foram gravadas no sistema.</p>
            
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
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-atestado-exame", registroAtual); }}
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

export default EditarAtestadoExamePage;
