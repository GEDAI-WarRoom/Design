import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Paperclip, Clock, Link as LinkIcon, User } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import { preencherComExemplo } from "../shared/CadastroVacinacaoMode";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition border-b border-gray-100"
      >
        <span className="text-base font-bold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-6">{children}</div>}
    </div>
  );
}

interface VisualizarVacinadorProps {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function VisualizarVacinadorBrucelosePage({ dados, onLogout, onNavigate }: VisualizarVacinadorProps) {
  const registro = preencherComExemplo(dados, {
    id: "vacinador-1",
    nome: "José Aarão Neto",
    cpf: "555.009.956-40",
    aderidoPasa: "Sim",
    possuiCertificadoPasa: "Sim",
    certificadoPasaArquivo: "certificado_pasa_2026.pdf",
    certificadoPasaDescricao: "Certificado emitido pelo PASA em 2026",
    profissionalResponsavel: { nome: "Dr. Roberto Silva", cpf: "555.009.956-40" },
    profissionalCpf: "555.009.956-40",
    anexos: [
      { id: "anx-1", nome: "comprovante_treinamento.pdf", descricao: "Treinamento de vacinação" }
    ],
    observacaoGeral: "Vacinador habilitado para a região sul.",
    situacao: "Ativo",
    usuarioUltimaAlteracao: "Lucas Pedro Conte",
    dataHoraUltimaModificacao: "14/04/2026 07:29"
  });

  const isAtivo = (registro.situacao || "Ativo") === "Ativo";

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="vacinador" hideSearch={true} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("vacinador")}
            className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70 font-medium"
          >
            <ArrowLeft size={15} /> Todos os Vacinadores Contra Brucelose
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Vacinador Contra Brucelose</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-vacinador-brucelose", registro)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 w-full">
              <div className="flex-1">
                <FloatInput label="Pessoa Física" value={registro.nome || ""} disabled={true} />
              </div>
              <div className="w-[240px] flex-shrink-0">
                <FloatInput label="CPF" value={registro.cpf || ""} disabled={true} />
              </div>
            </div>
          </div>
        </Section>

        {/* 2. Programa de Apoio a Saúde Agropecuária (PASA) */}
        <Section title="Programa de Apoio a Saúde Agropecuária (PASA)">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radio PASA */}
              <div className="flex flex-col gap-2 select-none pointer-events-none">
                <span className="text-xs font-semibold text-gray-400 tracking-wide">É Aderido ao PASA?</span>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${registro.aderidoPasa === "Sim" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                      {registro.aderidoPasa === "Sim" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                    </div>
                    Sim
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${registro.aderidoPasa !== "Sim" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                      {registro.aderidoPasa !== "Sim" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                    </div>
                    Não
                  </label>
                </div>
              </div>

              {/* Radio Certificado PASA */}
              {registro.aderidoPasa === "Sim" && (
                <div className="flex flex-col gap-2 select-none pointer-events-none">
                  <span className="text-xs font-semibold text-gray-400 tracking-wide">Possui Certificado PASA?</span>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${registro.possuiCertificadoPasa === "Sim" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                        {registro.possuiCertificadoPasa === "Sim" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                      </div>
                      Sim
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${registro.possuiCertificadoPasa !== "Sim" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                        {registro.possuiCertificadoPasa !== "Sim" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                      </div>
                      Não
                    </label>
                  </div>
                </div>
              )}
            </div>

            {registro.aderidoPasa === "Sim" && registro.possuiCertificadoPasa === "Sim" && (
              <div className="flex gap-3 items-start w-full pt-2 border-t border-gray-100">
                <div className="w-[340px]">
                  <div className="flex items-center gap-3 px-3 rounded-md border border-gray-200 h-12 bg-gray-50/50 relative w-full text-gray-500">
                    <Paperclip size={18} className="text-gray-400" />
                    <div className="flex flex-col justify-center flex-1">
                      <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Certificado PASA</span>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[260px]">
                        {registro.certificadoPasaArquivo || "Nenhum arquivo anexado"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <FloatInput label="Descrição do Certificado" value={registro.certificadoPasaDescricao || ""} disabled={true} />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 3. Profissional Responsável */}
        <Section title="Profissional Responsável">
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <FloatInput
                label="Profissional Responsável"
                value={registro.profissionalResponsavel?.nome || registro.profissionalNome || ""}
                disabled={true}
              />
            </div>
            <div className="w-[240px] flex-shrink-0">
              <FloatInput
                label="CPF do Profissional Responsável"
                value={registro.profissionalCpf || registro.profissionalResponsavel?.cpf || ""}
                disabled={true}
              />
            </div>
          </div>
        </Section>

        {/* 4. Anexos */}
        <Section title="Anexo">
          <div className="flex flex-col gap-4">
            {registro.anexos && registro.anexos.length > 0 ? (
              registro.anexos.map((anexo: any, index: number) => (
                <div key={anexo.id || index} className="flex gap-4 items-start relative w-full border border-gray-200 rounded-xl p-4 bg-white select-none">
                  <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-3 items-start w-full">
                      <div className="w-[340px]">
                        <div className="flex items-center gap-3 px-3 rounded-md border border-gray-200 h-12 bg-gray-50/50 relative w-full text-gray-500">
                          <Paperclip size={18} className="text-gray-400" />
                          <div className="flex flex-col justify-center flex-1">
                            <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Documento</span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[260px]">
                              {anexo.nome || anexo.arquivo || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <FloatInput label="Descrição" value={anexo.descricao ?? ""} disabled={true} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full border border-gray-200 rounded-xl p-4 bg-[#f9fafb] text-sm text-gray-400 text-center select-none py-6">
                Nenhum anexo adicionado
              </div>
            )}
          </div>
        </Section>

        {/* 5. Observação */}
        <Section title="Observação">
          <LargeTextArea
            label="Observação"
            value={registro.observacaoGeral || registro.observacao || ""}
            onChange={() => {}}
            disabled={true}
          />
        </Section>

        {/* Situação do Cadastro */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
            <p className="text-xs text-gray-400 font-normal">
              Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-semibold flex-shrink-0 select-none ${
              isAtivo
                ? "bg-[#E6F4EA] border border-[#A3E2B8] text-[#1A7A3C]"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {isAtivo ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Ativo
              </>
            ) : (
              "Inativo"
            )}
          </div>
        </div>

        {/* Outras Ações */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onNavigate("visualizar-vacinador-brucelose", registro)}
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
          >
            <User size={16} />
            Cadastro
          </button>
          <button
            type="button"
            onClick={() => alert("Navegando para Tela de Vinculações do Cadastro...")}
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
          >
            <LinkIcon size={16} />
            Vinculações
          </button>
        </div>

      </main>
    </div>
  );
}