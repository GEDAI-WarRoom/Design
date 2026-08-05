import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function EditarLancamentoDosesVacinaPage({ dados, onLogout, onNavigate }: any) {
  // Puxa o objeto real vindo da tabela.
  const registroAtual = dados || {};
  
  const [tipoLancamento, setTipoLancamento] = useState(registroAtual.tipoLancamento || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Gravada");

  const handleSalvar = () => {
    const dadosAtuais = { ...registroAtual, tipoLancamento, situacao };
    if (JSON.stringify(registroAtual) !== JSON.stringify(dadosAtuais)) {
      registrarVersaoCadastro({ 
        chaveCadastro: `lancamento-doses-vacina:${registroAtual.id || registroAtual.numeroNotaFiscal || "novo"}`, 
        dadosAnteriores: registroAtual, 
        dadosAtuais, 
        alteradoPor: "Administrador do Sistema" 
      });
      salvarRegistroMock("lancamentos-doses-vacina", dadosAtuais);
    }
    onNavigate("visualizar-lancamento-doses-vacina", dadosAtuais);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-lancamento-doses-vacina", registroAtual)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Visualizar Ajuste de Doses
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Ajuste de Doses de Vacina</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          <FloatInput label="Revendedora" value={registroAtual.revendedoraNome ? `${registroAtual.revendedoraCodigo} - ${registroAtual.revendedoraNome}` : ""} disabled onChange={() => {}} />
          <FloatInput label="Número da Nota Fiscal" value={registroAtual.numeroNotaFiscal || ""} disabled onChange={() => {}} />
          <FloatInput label="Número da Partida" value={registroAtual.numeroPartida || ""} disabled onChange={() => {}} />
          <FloatInput label="Doença" value={registroAtual.doenca || ""} disabled onChange={() => {}} />
          <FloatInput label="Tipo de Vacina" value={registroAtual.tipoVacina || "-"} disabled onChange={() => {}} />
          
          <FloatSelect 
            label="Tipo de Lançamento" 
            required 
            value={tipoLancamento} 
            onChange={setTipoLancamento} 
            options={[
              {value:"Ajuste de Saldo de Vacina", label:"Ajuste de Saldo de Vacina"}, 
              {value:"Entrada Nota Fiscal Revendedora", label:"Entrada Nota Fiscal Revendedora"}, 
              {value:"Compra de Vacina Revendedora", label:"Compra de Vacina Revendedora"}, 
              {value:"Compra de Vacina Pessoa", label:"Compra de Vacina Pessoa"}
            ]} 
          />
          <FloatSelect 
            label="Situação" 
            required 
            value={situacao} 
            onChange={setSituacao} 
            options={[
              {value:"Gravada", label:"Gravada"}, 
              {value:"Cancelada", label:"Cancelada"}
            ]} 
          />
        </div>
      </main>

    </div>
  );
}
