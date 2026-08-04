import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { registrarVersaoCadastro } from "../../../components/ui/historicoCadastroStorage";

const GREEN = "#1A7A3C";

export function EditarLaboratorioPage({ dados, onLogout, onNavigate }: any) {
  const laboratorioFallback = { id: 1, cnpj: "12.345.678/0001-90", razaoSocial: "Laboratório Central BioVet", municipio: "Belo Horizonte - MG", situacao: "Ativo" };
  const registroAtual = dados?.cnpj ? dados : laboratorioFallback;
  
  const [cnpj, setCnpj] = useState(registroAtual.cnpj || "");
  const [razaoSocial, setRazaoSocial] = useState(registroAtual.razaoSocial || "");
  const [municipio, setMunicipio] = useState(registroAtual.municipio || "");
  const [situacao, setSituacao] = useState(registroAtual.situacao || "Ativo");
  const [isSucesso, setIsSucesso] = useState(false);

  const handleSalvar = () => {
    const dadosAtuais = { ...registroAtual, cnpj, razaoSocial, municipio, situacao };
    if (JSON.stringify(registroAtual) !== JSON.stringify(dadosAtuais)) {
      registrarVersaoCadastro({ chaveCadastro: `laboratorio:${registroAtual.cnpj}`, dadosAnteriores: registroAtual, dadosAtuais, alteradoPor: "Administrador" });
    }
    setIsSucesso(true);
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
          <FloatInput label="CNPJ" required value={cnpj} onChange={setCnpj} />
          <FloatInput label="Razão Social" required value={razaoSocial} onChange={setRazaoSocial} />
          <FloatInput label="Município" value={municipio} onChange={setMunicipio} />
          <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={[{value:"Ativo", label:"Ativo"}, {value:"Inativo", label:"Inativo"}]} />
        </div>
      </main>
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <Check size={32} className="text-[#1A7A3C] stroke-[3] mb-5" />
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <button onClick={() => { setIsSucesso(false); onNavigate("laboratorio"); }} className="px-8 h-11 mt-6 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold w-full">Voltar para Listagem</button>
          </div>
        </div>
      )}
    </div>
  );
}