import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";
import { salvarRegistroMock } from "../../../components/ui/mockCollectionStorage";

const GREEN = "#1A7A3C";

export function EditarLaboratorioPage({ dados, onLogout, onNavigate }: any) {
  const laboratorioFallback = { id: 1, nome: "Laboratório Agener", municipio: "Lavras", uf: "MG", situacao: "Ativo" };
  const registroAtual = dados?.id ? dados : laboratorioFallback;
  
  const [nome, setNome] = useState(registroAtual.nome || "");
  const [municipio, setMunicipio] = useState(registroAtual.municipio || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Ativo");

  const handleSalvar = () => {
    const dadosAtuais = { ...registroAtual, nome, municipio, situacao };
    if (JSON.stringify(registroAtual) !== JSON.stringify(dadosAtuais)) {
      registrarVersaoCadastro({ chaveCadastro: `laboratorio:${registroAtual.id}`, dadosAnteriores: registroAtual, dadosAtuais, alteradoPor: "Administrador" });
      salvarRegistroMock("laboratorios", dadosAtuais);
    }
    onNavigate("visualizar-laboratorio", dadosAtuais);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="laboratorio" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-laboratorio", registroAtual)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} /> Visualizar Laboratório</button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Laboratório</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Salvar Alterações</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <FloatInput label="Nome do Laboratório" required value={nome} onChange={setNome} />
          <FloatInput label="Município" value={municipio} onChange={setMunicipio} />
          <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={[{value:"Ativo", label:"Ativo"}, {value:"Inativo", label:"Inativo"}]} />
        </div>
      </main>
    </div>
  );
}
