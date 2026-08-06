import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
} from "../../../components/ui/HistoricoCadastroLayout";
import {
  formatarDoencas,
  obterAtestadoExame,
  obterHistoricoAtestadoExame,
  type DadosAtestadoExame,
} from "./atestadoExameData";
import { DoencasAtestadoField } from "./DoencasAtestadoField";

const GREEN = "#1A7A3C";

function camposComparaveis(dados: DadosAtestadoExame): CampoHistoricoComparavel[] {
  return [
    { label: "Descrição do atestado", value: dados.descricao },
    { label: "Doenças", value: formatarDoencas(dados.doencas) },
    { label: "Dias de Validade do Exame", value: dados.diasValidade },
    { label: "Situação", value: dados.situacao },
  ];
}

// HELPERS DE UI
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

// PÁGINA: VISUALIZAR ATESTADO DE EXAME
interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
  dados?: any;
}

export function VisualizarAtestadoExamePage({
  onLogout = () => {},
  onNavigate = (screen) => console.log("navigate:", screen),
  dados,
}: PageProps) {
  const dadosAtuais = obterAtestadoExame(dados);
  const historico = obterHistoricoAtestadoExame(dadosAtuais);
  const camposAtuais = camposComparaveis(dadosAtuais);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />

      <HistoricoCadastroLayout<DadosAtestadoExame>
        itens={historico}
        resetKey={dadosAtuais.id}
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
        onVisualizarAutor={(nome) =>
          onNavigate("visualizar-pessoa-fisica", { nome })
        }
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
            type="button" 
            onClick={() => onNavigate("atestado-exame")} 
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" 
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Tipos de Atestado
          </button>
          
          <div className="flex justify-between items-center gap-4 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Tipo de Atestado</h1>
            <div className="flex items-center gap-3">
              {botaoHistorico}
              {!visualizandoVersaoAntiga && (
                <button
                  type="button"
                  onClick={() => onNavigate("editar-atestado-exame", dadosAtuais)}
                  className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {avisoVersao}

        {/* Formulário - Informações Básicas (Somente Leitura) */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            
            <div className="w-full">
              <FloatInput
                label="Descrição do atestado"
                value={r.descricao}
                disabled
                onChange={() => {}}
                className={classeCampo("Descrição do atestado", r.descricao)}
              />
            </div>

            <div className={classeCampo("Doenças", formatarDoencas(r.doencas))}>
              <DoencasAtestadoField value={r.doencas} onChange={() => {}} disabled />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
              <FloatInput
                label="Dias de Validade do Exame"
                value={r.diasValidade}
                disabled
                onChange={() => {}}
                className={classeCampo("Dias de Validade do Exame", r.diasValidade)}
              />

              {/* Situação agora é exibida, conforme AC de "Disponível após o cadastro" */}
              <FloatSelect
                label="Situação"
                value={r.situacao}
                options={[{ value: r.situacao, label: r.situacao }]}
                disabled
                onChange={() => {}}
                className={classeCampo("Situação", r.situacao)}
              />

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

export default VisualizarAtestadoExamePage;
