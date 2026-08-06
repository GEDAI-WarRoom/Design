import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";

import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout
} from "../../../components/ui/HistoricoCadastroLayout";

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
  return { id: 1, produtorNome: "José Aarão Neto", estabNome: "Fazenda do Rio", especie: "Bovino", doenca: "Brucelose", etapa: "2026/01", quantidadeDoses: "100", justificativa: "Autorizado...", situacao: "Gravada" };
};

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-5">{children}</div>}
    </div>
  );
}

export function VisualizarAutorizacaoVacinacaoPage({ onLogout, onNavigate, data }: any) {
  const dadosAtuais = getSelectedItem(data);

  // Lê o histórico de forma direta e à prova de falhas do localStorage
  const historicoKey = `autorizacao-vacina:${dadosAtuais.id}`;
  const histStored = localStorage.getItem(historicoKey);
  let historico = histStored ? JSON.parse(histStored) : [];

  if (historico.length === 0) {
    historico = [{
      id: `inicial-${dadosAtuais.id}`,
      data: new Date().toLocaleDateString('pt-BR'),
      alteradoPor: "Sistema (Criação)",
      atual: true,
      dados: dadosAtuais
    }];
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="autorizacao-vacina" hideSearch />

      <HistoricoCadastroLayout<any>
        itens={historico}
        ativo={true}
        resetKey={dadosAtuais.id}
        conteudoClassName="flex flex-col gap-4 max-w-[1088px] mx-auto px-4 py-6 md:px-6"
      >
        {({ botaoHistorico, avisoVersao, dadosSelecionados, versaoAtual, visualizandoVersaoAntiga }) => {
          
          const r = dadosSelecionados ?? dadosAtuais;
          
          // Compara de forma profunda a versão que você clicou (dadosSelecionados) com a última versão (versaoAtual)
          const getClasseAlterado = (campo: string) => {
            if (!visualizandoVersaoAntiga) return "";
            const valAntigo = JSON.stringify(dadosSelecionados?.[campo] || "");
            const valAtual = JSON.stringify(versaoAtual?.dados?.[campo] || "");
            return valAntigo !== valAtual ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";
          };

          return (
            <>
              <div>
                <button onClick={() => onNavigate("autorizacao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
                  <ArrowLeft size={15} /> Todas as Autorizações
                </button>
                
                <div className="flex justify-between items-center gap-4 w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Autorização de Vacinação</h1>
                  
                  <div className="flex items-center gap-3">
                    {!visualizandoVersaoAntiga && (
                      <button 
                        onClick={() => {
                          localStorage.setItem("CURRENT_AUTORIZACAO_ID", dadosAtuais.id.toString());
                          onNavigate("editar-autorizacao-vacinacao", dadosAtuais);
                        }} 
                        className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                    {botaoHistorico}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <Section title="Informações de Controle">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatSelect 
                    label="Situação" 
                    value={r.situacao || "Gravada"} 
                    options={[{ value: r.situacao, label: r.situacao }]} 
                    disabled 
                    onChange={() => {}} 
                    className={getClasseAlterado('situacao')} 
                  />
                </div>
              </Section>

              <Section title="Informações Básicas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatInput label="Produtor" value={r.produtorNome} disabled onChange={() => {}} className={getClasseAlterado('produtorNome')} />
                  <FloatInput label="Estabelecimento Agropecuário" value={r.estabNome} disabled onChange={() => {}} className={getClasseAlterado('estabNome')} />
                  <FloatInput label="Espécie" value={r.especie} disabled onChange={() => {}} className={getClasseAlterado('especie')} />
                  <FloatInput label="Doença" value={r.doenca} disabled onChange={() => {}} className={getClasseAlterado('doenca')} />
                  <FloatInput label="Etapa de Vacinação" value={r.etapa} disabled onChange={() => {}} className={getClasseAlterado('etapa')} />
                  <FloatInput label="Quantidade de Doses" value={r.quantidadeDoses} disabled onChange={() => {}} className={getClasseAlterado('quantidadeDoses')} />
                  <div className={`col-span-full ${getClasseAlterado('justificativa')}`}>
                    <LargeTextArea label="Justificativa" value={r.justificativa} onChange={() => {}} disabled={true} />
                  </div>
                </div>
              </Section>
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}

export default VisualizarAutorizacaoVacinacaoPage;