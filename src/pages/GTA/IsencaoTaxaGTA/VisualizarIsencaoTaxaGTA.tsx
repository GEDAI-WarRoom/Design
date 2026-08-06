import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type CampoHistoricoComparavel,
} from "../../../components/ui/HistoricoCadastroLayout";
import {
  obterHistoricoIsencaoTaxaDocumentoSanitario,
  obterIsencaoTaxaDocumentoSanitario,
  type IsencaoTaxaDocumentoSanitario,
} from "./isencaoTaxaGtaData";

const GREEN = "#1A7A3C";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && <div className="flex flex-col gap-5 bg-white p-6">{children}</div>}
    </div>
  );
}

function camposComparaveis(
  dados: IsencaoTaxaDocumentoSanitario,
): CampoHistoricoComparavel[] {
  return [
    {
      label: "Motivo da Isenção de Taxa de Documento Sanitário",
      value: dados.motivo,
    },
    { label: "Situação", value: dados.situacao },
  ];
}

interface PageProps {
  dados?: Partial<IsencaoTaxaDocumentoSanitario>;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarIsencaoTaxaGtaPage({
  dados,
  onLogout,
  onNavigate,
}: PageProps) {
  const dadosAtuais = obterIsencaoTaxaDocumentoSanitario(dados);
  const historico =
    obterHistoricoIsencaoTaxaDocumentoSanitario(dadosAtuais);
  const camposAtuais = camposComparaveis(dadosAtuais);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="isencao-taxa-gta"
        hideSearch
      />

      <HistoricoCadastroLayout<IsencaoTaxaDocumentoSanitario>
        itens={historico}
        ativo
        resetKey={dadosAtuais.id}
        conteudoClassName="flex flex-col gap-4 px-4 py-6 md:px-6"
      >
        {({
          botaoHistorico,
          avisoVersao,
          dadosSelecionados,
          visualizandoVersaoAntiga,
        }) => {
          const isencao = dadosSelecionados ?? dadosAtuais;
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
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate("isencao-taxa-gta")}
                  className="mb-3 flex items-center gap-1 text-sm font-semibold transition hover:opacity-70"
                  style={{ color: GREEN }}
                >
                  <ArrowLeft size={15} /> Todas as Isenções
                </button>
                <div className="flex w-full items-center justify-between gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Visualizar Isenção de Taxa de Documento Sanitário
                  </h1>
                  <div className="flex items-center gap-3">
                    {botaoHistorico}
                    {!visualizandoVersaoAntiga && (
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate("editar-isencao-taxa-gta", dadosAtuais)
                        }
                        className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[#15612F]"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {avisoVersao}

              <Section title="Informações Básicas">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FloatInput
                    label="Motivo da Isenção de Taxa de Documento Sanitário"
                    value={isencao.motivo}
                    disabled
                    className={classeCampo(
                      "Motivo da Isenção de Taxa de Documento Sanitário",
                      isencao.motivo,
                    )}
                  />
                  <FloatInput
                    label="Situação"
                    value={isencao.situacao}
                    disabled
                    className={classeCampo("Situação", isencao.situacao)}
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
