import React, { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";
const MOCK_KEY = "AUTORIZACOES_VACINA_DB";

const getSelectedItem = (dataProp: any) => {
  if (dataProp && dataProp.id) return dataProp;
  const currentId = localStorage.getItem("CURRENT_AUTORIZACAO_ID");
  const stored = localStorage.getItem(MOCK_KEY);
  const db = stored ? JSON.parse(stored) : [];
  if (currentId) {
    const found = db.find((x: any) => x.id.toString() === currentId);
    if (found) return found;
  }
  return {
    id: 1, produtorNome: "", estabNome: "", especie: "", doenca: "", etapa: "", quantidadeDoses: "", justificativa: "", situacao: "Gravada"
  };
};

export function EditarAutorizacaoVacinacaoPage({ onLogout, onNavigate, data }: any) {
  const registroInicial = getSelectedItem(data);
  const [registro, setRegistro] = useState(registroInicial);
  
  // RNE001: Se já chegou como "Cancelada", ela não pode ser alterada.
  const isCanceladaOriginal = registroInicial.situacao === "Cancelada";

  const handleSalvar = () => {
    // 1. Atualizar DB da Listagem
    const storedDb = localStorage.getItem(MOCK_KEY);
    let db = storedDb ? JSON.parse(storedDb) : [];
    db = db.map((item: any) => item.id === registro.id ? registro : item);
    localStorage.setItem(MOCK_KEY, JSON.stringify(db));

    // 2. Lógica Robusta de Histórico (Garante a versão antiga e a nova juntas)
    const historicoKey = `autorizacao-vacina:${registro.id}`;
    const histStored = localStorage.getItem(historicoKey);
    let histArray = histStored ? JSON.parse(histStored) : [];

    // Se o histórico estiver vazio, grava o estado ANTES da edição (Baseline)
    if (histArray.length === 0) {
      histArray.push({
        id: `inicial-${registroInicial.id}`,
        data: new Date().toLocaleDateString('pt-BR'),
        alteradoPor: "Sistema (Criação)",
        atual: false,
        dados: registroInicial
      });
    } else {
      // Tira a flag de 'atual' das versões velhas
      histArray = histArray.map((h: any) => ({ ...h, atual: false }));
    }

    // Salva a nova edição
    histArray.push({
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      alteradoPor: "Usuário Logado",
      atual: true,
      dados: registro
    });

    localStorage.setItem(historicoKey, JSON.stringify(histArray));

    // 3. Voltar para visualização
    onNavigate("visualizar-autorizacao-vacinacao", registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="autorizacao-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button onClick={() => onNavigate("autorizacao-vacinacao", registroInicial)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Autorizações
          </button>
         
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Autorização de Vacinação</h1>
            {!isCanceladaOriginal && (
              <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
                Salvar 
              </button>
            )}
          </div>
        </div>

        <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <div className="text-blue-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-blue-800 font-medium leading-relaxed">
            A edição pode ser feita apenas enquanto a situação estiver como "Gravada". 
            {isCanceladaOriginal && " Como este registro já está cancelado, não é permitida nenhuma alteração."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <FloatSelect 
              label="Situação *" 
              value={registro.situacao} 
              options={[{ value: "Gravada", label: "Gravada" }, { value: "Cancelada", label: "Cancelada" }]} 
              onChange={(val) => setRegistro({ ...registro, situacao: val })} 
              disabled={isCanceladaOriginal} 
            />
          </div>

          <h3 className="text-sm font-semibold text-gray-800">Informações Básicas (Somente Leitura)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatInput label="Produtor" value={registro.produtorNome} disabled onChange={() => {}} />
            <FloatInput label="Estabelecimento Agropecuário" value={registro.estabNome} disabled onChange={() => {}} />
            <FloatInput label="Espécie" value={registro.especie} disabled onChange={() => {}} />
            <FloatInput label="Doença" value={registro.doenca} disabled onChange={() => {}} />
            <FloatInput label="Etapa de Vacinação" value={registro.etapa} disabled onChange={() => {}} />
            <FloatInput label="Quantidade de Doses" value={registro.quantidadeDoses} disabled onChange={() => {}} />
            <div className="col-span-full">
              <LargeTextArea label="Justificativa" value={registro.justificativa} onChange={() => {}} disabled={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditarAutorizacaoVacinacaoPage;