import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function EditarVendaComEntradaInsumosExamesPage({ dados, onLogout, onNavigate }: any) {
  // Puxa o objeto que a tabela passou, ou cria um objeto base para não dar erro
  const registroAtual = dados || {};
  
  // Como são dados que vieram do Mock, a gente converte e permite edição onde faz sentido.
  const [fornecedor, setFornecedor] = useState(registroAtual.fornecedor || "");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(registroAtual.numeroNotaFiscal || "");
  const [numeroPartida, setNumeroPartida] = useState(registroAtual.numeroPartida || "");
  const [doenca, setDoenca] = useState(registroAtual.doenca || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Gravada");

  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false);

  const handleSalvar = () => {
    if (!numeroNotaFiscal || !numeroPartida || !situacao) {
      setIsErro(true);
      return;
    }
    setIsSucesso(true);
  };

  const objetoAtualizado = {
    ...registroAtual,
    fornecedor,
    numeroNotaFiscal,
    numeroPartida,
    doenca,
    situacao
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-insumos-exames" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-venda-entrada-insumos-exames", registroAtual)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Visualizar Venda
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Venda com Entrada de Insumos para Exame</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <Info size={20} className="stroke-[2.5] text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações da Venda">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fornecedor e Destinatário ficam bloqueados na edição por serem as origens/destinos fixos da nota fiscal */}
            <FloatInput label="Fornecedor" value={fornecedor} onChange={setFornecedor} disabled />
            <FloatInput label="Destinatário" value={registroAtual.revendedoraNome ? `${registroAtual.revendedoraCodigo} - ${registroAtual.revendedoraNome}` : ""} disabled onChange={() => {}} />
            
            {/* Campos de Nota e Partida abertos para digitação */}
            <FloatInput label="Número da Nota Fiscal" required value={numeroNotaFiscal} onChange={(v) => setNumeroNotaFiscal(v.replace(/\D/g, ""))} />
            <FloatInput label="Número da Partida" required value={numeroPartida} onChange={setNumeroPartida} />
            
            <FloatInput label="Doença" value={doenca} onChange={setDoenca} disabled />
            <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={SITUACOES} />
          </div>
        </Section>
      </main>

      {/* Modal de Erro */}
      {isErro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <AlertTriangle size={32} className="text-red-500 mb-5" />
            <h3 className="text-xl font-bold text-gray-900">Campos obrigatórios</h3>
            <p className="text-sm text-gray-500 mt-2">Preencha todos os campos obrigatórios (*).</p>
            <button onClick={() => setIsErro(false)} className="px-10 h-11 mt-8 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold transition">Entendi</button>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <Check size={32} className="text-[#1A7A3C] stroke-[3] mb-5" />
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O registro de venda foi atualizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6 w-full">
              <button onClick={() => { setIsSucesso(false); onNavigate("venda-entrada-insumos-exames"); }} className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition w-full">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-venda-entrada-insumos-exames", objetoAtualizado); }} className="px-8 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition w-full shadow-sm">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}