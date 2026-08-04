import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, FileText, UsersRound } from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "../Navbar";
import { FloatInput, Tabs } from "./FormKit";
import { EntityProfessionalsTab, type TipoProfissionalEntidade } from "./EntityProfessionals";
import {
  CLASSE_CAMPO_ALTERADO_HISTORICO,
  HistoricoCadastroLayout,
  campoHistoricoFoiAlterado,
  type HistoricoCadastroItem,
} from "./HistoricoCadastroLayout";

export interface CampoVisualizacaoEntidade {
  label: string;
  value: string;
}

export interface DadosHistoricoVisualizacao {
  campos: CampoVisualizacaoEntidade[];
}

interface EntityProfessionalsViewProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  currentScreen: string;
  backRoute: string;
  backLabel: string;
  title: string;
  entityKey: string;
  allowedTypes: TipoProfissionalEntidade[];
  fields: CampoVisualizacaoEntidade[];
  heroImage?: {
    src: string;
    alt: string;
  };
  historicoCadastros?: HistoricoCadastroItem<DadosHistoricoVisualizacao>[];
  onEdit?: () => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-t-xl px-6 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        <ChevronDown size={18} className={`text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-gray-100 p-6">{children}</div>}
    </section>
  );
}

export function EntityProfessionalsView({
  onLogout,
  onNavigate,
  currentScreen,
  backRoute,
  backLabel,
  title,
  entityKey,
  allowedTypes,
  fields,
  heroImage,
  historicoCadastros,
  onEdit,
}: EntityProfessionalsViewProps) {
  const [activeTab, setActiveTab] = useState("cadastro");
  const tabs = [
    { id: "cadastro", label: "Cadastro", icon: (active: boolean) => <FileText size={19} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "profissionais", label: "Profissionais", icon: (active: boolean) => <UsersRound size={19} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen={currentScreen as any} hideSearch />

      <HistoricoCadastroLayout
        itens={historicoCadastros}
        ativo={activeTab === "cadastro"}
        resetKey={entityKey}
        conteudoClassName="flex flex-col gap-5 px-4 py-6 md:px-6"
        onVisualizarAutor={(nome) =>
          onNavigate("visualizar-pessoa-fisica", { nome })
        }
      >
        {({
          avisoVersao,
          botaoHistorico,
          versaoAtual,
          versaoSelecionada,
          visualizandoVersaoAntiga,
        }) => {
          const camposAtuais = versaoAtual?.dados?.campos ?? fields;
          const camposVisiveis = versaoSelecionada?.dados?.campos ?? fields;

          return (
            <>
              <header>
                <button
                  type="button"
                  onClick={() => onNavigate(backRoute)}
                  className="mb-4 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"
                >
                  <ArrowLeft size={15} /> {backLabel}
                </button>
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  {activeTab === "cadastro" && (onEdit || botaoHistorico) && (
                    <div className="flex items-center gap-3">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={onEdit}
                          className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
                        >
                          Editar
                        </button>
                      )}
                      {botaoHistorico}
                    </div>
                  )}
                </div>
              </header>

              {avisoVersao}

              {heroImage && (
                <figure className="h-56 overflow-hidden rounded-xl border border-gray-100 bg-gray-200 shadow-sm sm:h-64">
                  <img
                    src={heroImage.src}
                    alt={heroImage.alt}
                    className="h-full w-full object-cover"
                  />
                </figure>
              )}

              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === "cadastro" && (
                <Section title="Informações do Cadastro">
                  <motion.div
                    key={versaoSelecionada?.id ?? "versao-atual"}
                    initial={{ opacity: 0.35, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    {camposVisiveis.map((field) => (
                      <FloatInput
                        key={field.label}
                        label={field.label}
                        value={field.value}
                        disabled
                        onChange={() => {}}
                        className={
                          campoHistoricoFoiAlterado(
                            field,
                            camposAtuais,
                            visualizandoVersaoAntiga,
                          )
                            ? CLASSE_CAMPO_ALTERADO_HISTORICO
                            : ""
                        }
                      />
                    ))}
                  </motion.div>
                </Section>
              )}

              {activeTab === "profissionais" && (
                <EntityProfessionalsTab
                  entityKey={entityKey}
                  allowedTypes={allowedTypes}
                  onNavigate={onNavigate}
                />
              )}
            </>
          );
        }}
      </HistoricoCadastroLayout>
    </div>
  );
}
