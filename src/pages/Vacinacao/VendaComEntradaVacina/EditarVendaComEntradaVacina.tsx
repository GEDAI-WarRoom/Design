import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function EditarVendaComEntradaVacinaPage({ dados, onLogout, onNavigate }: any) {
  const vendaEntradaFallback = { id: 1, numeroNotaFiscal: "1234567", fornecedor: "Laboratório BioMed", revendedoraCodigo: "3120938028", revendedoraNome: "Comercial AgroVat", doenca: "Brucelose", tipoVacina: "B19", numeroPartida: "0013225/24", situacao: "Gravada" };
  const registroAtual = dados?.id ? dados : vendaEntradaFallback;
  
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(registroAtual.numeroNotaFiscal || "");
  const [numeroPartida, setNumeroPartida] = useState(registroAtual.numeroPartida || "");
  const [tipoVacina, setTipoVacina] = useState(registroAtual.tipoVacina || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Gravada");

  const handleSalvar = () => {
    const dadosAtuais = { ...registroAtual, numeroNotaFiscal, numeroPartida, tipoVacina, situacao };
    if (JSON.stringify(registroAtual) !== JSON.stringify(dadosAtuais)) {
      registrarVersaoCadastro({ chaveCadastro: `venda-entrada-vacina:${registroAtual.id}`, dadosAnteriores: registroAtual, dadosAtuais, alteradoPor: "Administrador" });
      salvarRegistroMock("vendas-entrada-vacina", dadosAtuais);
    }
    onNavigate("visualizar-venda-entrada-vacina", dadosAtuais);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-entrada-vacina" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-venda-entrada-vacina", registroAtual)} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} /> Visualizar Venda</button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Venda com Entrada de Vacina</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md transition shadow-sm">Salvar Alterações</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          <FloatInput label="Nota Fiscal" required value={numeroNotaFiscal} onChange={setNumeroNotaFiscal} />
          <FloatInput label="Fornecedor Origem" value={registroAtual.fornecedor || ""} disabled onChange={() => {}} />
          <FloatInput label="Revendedora Destino" value={registroAtual.revendedoraNome || ""} disabled onChange={() => {}} />
          <FloatInput label="Doença" value={registroAtual.doenca || ""} disabled onChange={() => {}} />
          <FloatInput label="Tipo de Vacina" required value={tipoVacina} onChange={setTipoVacina} />
          <FloatInput label="Partida" required value={numeroPartida} onChange={setNumeroPartida} />
          <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={[{value:"Gravada", label:"Gravada"}, {value:"Cancelada", label:"Cancelada"}]} />
        </div>
      </main>
    </div>
  );
}
