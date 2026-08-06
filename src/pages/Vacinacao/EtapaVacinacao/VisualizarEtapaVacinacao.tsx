import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";

// IMPORTS DO HISTÓRICO
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
  type HistoricoCadastroItem
} from "../../../components/ui/HistoricoCadastroLayout";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS E FUNÇÕES DE RECUPERAÇÃO DE DADOS
// ==========================================================
const MOCK_KEY = "ETAPAS_VACINACAO_DB";

const getEtapas = () => {
  const stored = localStorage.getItem(MOCK_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getSelectedItem = (dataProp: any) => {
  if (dataProp && dataProp.id) return dataProp;
  const currentId = localStorage.getItem("CURRENT_ETAPA_ID");
  const db = getEtapas();
  if (currentId) {
    const found = db.find((x: any) => x.id.toString() === currentId);
    if (found) return found;
  }
  return db[0] || {};
};

const fmtDataBr = (iso: string) => {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

const formatarEspecies = (especies: any[]) => {
  if (!especies || especies.length === 0) return "Nenhuma espécie vinculada";
  return especies.map((esp: any) => {
    const faixas = esp.faixasEtarias?.length ? ` (${esp.faixasEtarias.join(", ")})` : "";
    return `${esp.nome}${faixas}`;
  }).join(" | ");
};

function camposComparaveis(dados: any): CampoHistoricoComparavel[] {
  return [
    { label: "Código da Etapa", value: dados.codigo },
    { label: "Situação", value: dados.situacao },
    { label: "Data de Início", value: fmtDataBr(dados.dataInicio) },
    { label: "Data do Fim", value: fmtDataBr(dados.dataFim) },
    { label: "Doença", value: dados.doenca?.nome },
    { label: "Espécies e Faixas Etárias", value: formatarEspecies(dados.especies) },
  ];
}

// ==========================================================
// COMPONENTES DE UI
// ==========================================================
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

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
export function VisualizarEtapaVacinacaoPage({ onLogout, onNavigate, data }: any) {
  const dadosAtuais = getSelectedItem(data);

  // MOCK INICIAL DO HISTÓRICO
  const criarHistoricoInicial = (registro: any): HistoricoCadastroItem<any>[] => [
    { 
      id: `inicial-${registro.id}`, 
      data: new Date().toLocaleDateString('pt-BR'), 
      alteradoPor: "Usuário Criador", 
      atual: true, 
      dados: registro 
    }
  ];

  const historico = carregarHistoricoCadastro(`etapa-vacinacao:${dadosAtuais.id}`, criarHistoricoInicial(dadosAtuais));
  const camposAtuais = camposComparaveis(dadosAtuais);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />

      <HistoricoCadastroLayout<any>
        itens={historico}
        ativo={true}
        resetKey={dadosAtuais.id}
        conteudoClassName="flex flex-col gap-4 max-w-[1088px] mx-auto px-4 py-6 md:px-6"
      >
        {({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => {
          const r = dadosSelecionados ?? dadosAtuais;
          
          const classeCampo = (label: string, value: unknown) =>
            campoHistoricoFoiAlterado(
              { label, value },
              camposAtuais,
              visualizandoVersaoAntiga,
            )
              ? CLASSE_CAMPO_ALTERADO_HISTORICO
              : "";

          return (
            <>
              {/* Cabeçalho */}
              <div>
                <button 
                  onClick={() => onNavigate("etapa-vacinacao")} 
                  className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" 
                  style={{ color: GREEN }}
                >
                  <ArrowLeft size={15} /> Todas as Etapas de Vacinação
                </button>
                
                <div className="flex justify-between items-center gap-4 w-full">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Etapa de Vacinação</h1>
                  
                  <div className="flex items-center gap-3">
                    {botaoHistorico}
                    {!visualizandoVersaoAntiga && (
                      <button 
                        onClick={() => {
                          localStorage.setItem("CURRENT_ETAPA_ID", dadosAtuais.id.toString());
                          onNavigate("editar-etapa-vacinacao", dadosAtuais);
                        }} 
                        className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {avisoVersao}

              {/* Informações de Controle */}
              <Section title="Informações de Controle">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatInput 
                    label="Código da Etapa" 
                    value={r.codigo || ""} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Código da Etapa", r.codigo)} 
                  />
                  <FloatSelect 
                    label="Situação" 
                    value={r.situacao || "Aberta"} 
                    options={[{ value: r.situacao || "Aberta", label: r.situacao || "Aberta" }]} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Situação", r.situacao)} 
                  />
                </div>
              </Section>

              {/* Informações Básicas */}
              <Section title="Informações Básicas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatInput 
                    label="Data de Início" 
                    value={fmtDataBr(r.dataInicio)} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Data de Início", fmtDataBr(r.dataInicio))} 
                  />
                  <FloatInput 
                    label="Data do Fim" 
                    value={fmtDataBr(r.dataFim)} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Data do Fim", fmtDataBr(r.dataFim))} 
                  />
                </div>
              </Section>

              {/* Doença e Espécies */}
              <Section title="Doença e Espécies">
                <div className="flex flex-col gap-6">
                  <FloatInput 
                    label="Doença" 
                    value={r.doenca?.nome || ""} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Doença", r.doenca?.nome)} 
                  />
                  <FloatInput 
                    label="Espécies e Faixas Etárias" 
                    value={formatarEspecies(r.especies)} 
                    disabled 
                    onChange={() => {}} 
                    className={classeCampo("Espécies e Faixas Etárias", formatarEspecies(r.especies))} 
                  />
                </div>
              </Section>
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}

export default VisualizarEtapaVacinacaoPage;