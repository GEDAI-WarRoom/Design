import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function EditarVendaComSaidaVacinaPage({ dados, onLogout, onNavigate }: any) {
  const vendaSaidaFallback = { id: "1", notaFiscal: "15420", fornecedor: "Distribuidora de Vacinas Alfa LTDA", destinatario: "João da Silva Sauro", partida: "0013225/24", laboratorio: "Laboratório Biovet", doenca: "Febre Aftosa", situacao: "Ativo" };
  const registroAtual = dados?.id ? dados : vendaSaidaFallback;
  
  const [notaFiscal, setNotaFiscal] = useState(registroAtual.notaFiscal || "");
  const [destinatario, setDestinatario] = useState(registroAtual.destinatario || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Ativo");

  const handleSalvar = () => {
    const dadosAtuais = { ...registroAtual, notaFiscal, destinatario, situacao };
    if (JSON.stringify(registroAtual) !== JSON.stringify(dadosAtuais)) {
      registrarVersaoCadastro({ chaveCadastro: `venda-saida-vacina:${registroAtual.id}`, dadosAnteriores: registroAtual, dadosAtuais, alteradoPor: "Administrador" });
      salvarRegistroMock("vendas-saida-vacina", dadosAtuais);
    }
    onNavigate("visualizar-venda-saida-vacina", dadosAtuais);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-saida-vacina" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-venda-saida-vacina", registroAtual)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} /> Visualizar Venda</button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Venda com Saída de Vacina</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Salvar Alterações</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          <FloatInput label="Nota Fiscal" required value={notaFiscal} onChange={setNotaFiscal} />
          <FloatInput label="Fornecedor" value={registroAtual.fornecedor || ""} disabled onChange={() => {}} />
          <FloatInput label="Destinatário" required value={destinatario} onChange={setDestinatario} />
          <FloatInput label="Número da Partida" value={registroAtual.partida || ""} disabled onChange={() => {}} />
          <FloatInput label="Laboratório" value={registroAtual.laboratorio || ""} disabled onChange={() => {}} />
          <FloatInput label="Doença" value={registroAtual.doenca || ""} disabled onChange={() => {}} />
          <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={[{value:"Ativo", label:"Ativo"}, {value:"Inativo", label:"Inativo"}]} />
        </div>
      </main>
    </div>
  );
}
