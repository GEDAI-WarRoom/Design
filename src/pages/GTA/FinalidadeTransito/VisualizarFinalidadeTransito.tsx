import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CheckboxGroup, FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
} from "../../../components/ui/HistoricoCadastroLayout";
import { listarPapeis } from "../../Controle/Papeis/papeisData";
import {
  obterFinalidadeTransito,
  obterHistoricoFinalidadeTransito,
  type FinalidadeTransitoVisual,
} from "./finalidadeTransitoData";

const TIPOS_LOCAL = ["Estabelecimento Agropecuário", "Evento Pecuário", "Abatedouro Frigorífico", "Revendedora de Animais Vivos", "Unidade de Vigilância Agropecuária", "Instituição de Ensino e Pesquisa", "Local de Pesagem", "Local de Realização de Exame", "Estabelecimento Genérico"];
const EMITE_ACESSO = ["Emite para dentro do Estado", "Emite para fora do Estado"];
const options = (values: string[]) => values.map((value) => ({ value, label: value }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}
    </section>
  );
}

function camposComparaveis(finalidade: FinalidadeTransitoVisual): CampoHistoricoComparavel[] {
  return [
    { label: "Finalidade de Trânsito", value: finalidade.finalidade },
    { label: "Código do MAPA", value: finalidade.codigoMapa },
    { label: "Descrição", value: finalidade.descricao ?? "" },
    { label: "Espécies Aplicáveis", value: finalidade.especieIds.join("|") },
    { label: "Papéis Aplicáveis", value: finalidade.papelIds.join("|") },
    { label: "Tipo de Procedência", value: finalidade.tiposProcedencia.join("|") },
    { label: "Emite GTA por Acesso Externo", value: finalidade.emiteAcessoExterno.join("|") },
    { label: "Tipo de Destino", value: finalidade.tiposDestino.join("|") },
    { label: "Situação", value: finalidade.situacao },
  ];
}

export function VisualizarFinalidadeTransitoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void }) {
  const finalidadeAtual = obterFinalidadeTransito(dados?.id) ?? dados ?? obterFinalidadeTransito(null)!;
  const historico = obterHistoricoFinalidadeTransito(finalidadeAtual);
  const camposAtuais = camposComparaveis(finalidadeAtual);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="finalidade-transito" hideSearch />
      <HistoricoCadastroLayout<FinalidadeTransitoVisual>
        itens={historico}
        ativo
        resetKey={finalidadeAtual.id}
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
        larguraMaximaConteudo={1024}
      >
        {({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => {
          const finalidade = dadosSelecionados ?? finalidadeAtual;
          const tiposProcedencia = finalidade.tiposProcedencia?.length ? finalidade.tiposProcedencia : [finalidade.tipoProcedencia || "Abatedouro Frigorífico"];
          const tiposDestino = finalidade.tiposDestino?.length ? finalidade.tiposDestino : [finalidade.tipoDestino || "Abatedouro Frigorífico"];
          const emiteAcessoExterno = finalidade.emiteAcessoExterno?.length
            ? finalidade.emiteAcessoExterno
            : tiposProcedencia.includes("Estabelecimento Agropecuário") ? [EMITE_ACESSO[0]] : [];
          const papeis = finalidade.papeis?.length
            ? finalidade.papeis
            : listarPapeis().filter((papel) => finalidade.papelIds?.includes(papel.id));
          const classeCampo = (label: string, value: unknown) =>
            campoHistoricoFoiAlterado(
              { label, value },
              camposAtuais,
              visualizandoVersaoAntiga,
            ) ? CLASSE_CAMPO_ALTERADO_HISTORICO : "";

          return (
            <>
              <span data-current-situacao={finalidadeAtual.situacao} className="hidden" />
              <div>
                <button type="button" onClick={() => onNavigate("finalidade-transito")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} />Todas as Finalidades de Trânsito</button>
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">Visualizar Finalidade de Trânsito</h1>
                  <div className="flex items-center gap-3">
                    {!visualizandoVersaoAntiga && <button type="button" onClick={() => onNavigate("editar-finalidade-transito", { ...finalidadeAtual, tiposProcedencia, tiposDestino, emiteAcessoExterno, papeis })} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">Editar</button>}
                    {botaoHistorico}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <Section title="Informações Básicas">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatInput label="Finalidade de Trânsito" value={finalidade.finalidade} disabled className={classeCampo("Finalidade de Trânsito", finalidade.finalidade)} />
                    <FloatInput label="Código do MAPA" value={finalidade.codigoMapa || "01"} disabled className={classeCampo("Código do MAPA", finalidade.codigoMapa)} />
                  </div>
                  <div className={`rounded-md border border-transparent ${classeCampo("Descrição", finalidade.descricao ?? "")}`}>
                    <LargeTextArea label="Descrição" value={finalidade.descricao ?? ""} onChange={() => {}} disabled />
                  </div>
                </div>
              </Section>

              <Section title="Espécies Aplicáveis (Uma ou mais)">
                <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${classeCampo("Espécies Aplicáveis", finalidade.especieIds.join("|"))}`}>
                  <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3">
                    <span className="text-sm font-semibold text-gray-500">Espécies Selecionadas</span>
                    <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">{finalidade.especies.length} {finalidade.especies.length === 1 ? "Selecionada" : "Selecionadas"}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 p-5">
                    {finalidade.especies.map((especie) => <div key={especie.id || especie.nome} className="min-w-[180px] rounded-xl border border-gray-200 p-3 text-sm font-bold text-[#1A7A3C] shadow-sm">{especie.nome}</div>)}
                  </div>
                </div>
              </Section>

              <Section title="Papéis Aplicáveis (Uma ou mais)">
                <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${classeCampo("Papéis Aplicáveis", finalidade.papelIds.join("|"))}`}>
                  <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3">
                    <span className="text-sm font-semibold text-gray-500">Papéis Selecionados</span>
                    <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">{papeis.length} {papeis.length === 1 ? "Selecionado" : "Selecionados"}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 p-5">
                    {papeis.map((papel) => <div key={papel.id || papel.nome} className="min-w-[180px] rounded-xl border border-gray-200 p-3 text-sm font-bold text-[#1A7A3C] shadow-sm">{papel.nome}</div>)}
                  </div>
                </div>
              </Section>

              <Section title="Informações de Procedência">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                  <div className={`rounded-md border border-transparent p-1 ${classeCampo("Tipo de Procedência", tiposProcedencia.join("|"))}`}>
                    <CheckboxGroup key={`procedencia-${tiposProcedencia.join("-")}`} title="Tipo de Procedência" required options={options(TIPOS_LOCAL)} defaultValue={tiposProcedencia} disabled />
                  </div>
                  {tiposProcedencia.includes("Estabelecimento Agropecuário") && <div className={`rounded-md border border-transparent p-1 ${classeCampo("Emite GTA por Acesso Externo", emiteAcessoExterno.join("|"))}`}><CheckboxGroup key={`acesso-${emiteAcessoExterno.join("-")}`} title="Emite GTA por Acesso Externo" options={options(EMITE_ACESSO)} defaultValue={emiteAcessoExterno} disabled /></div>}
                </div>
              </Section>

              <Section title="Informações de Destino">
                <div className={`rounded-md border border-transparent p-1 ${classeCampo("Tipo de Destino", tiposDestino.join("|"))}`}>
                  <CheckboxGroup key={`destino-${tiposDestino.join("-")}`} title="Tipo de Destino" required options={options(TIPOS_LOCAL)} defaultValue={tiposDestino} disabled />
                </div>
              </Section>
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
