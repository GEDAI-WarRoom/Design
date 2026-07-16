import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, FileText, UsersRound } from "lucide-react";
import { Navbar } from "../Navbar";
import { FloatInput, Tabs } from "./FormKit";
import { EntityProfessionalsTab, type TipoProfissionalEntidade } from "./EntityProfessionals";

export interface CampoVisualizacaoEntidade {
  label: string;
  value: string;
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
}: EntityProfessionalsViewProps) {
  const [activeTab, setActiveTab] = useState("cadastro");
  const tabs = [
    { id: "cadastro", label: "Cadastro", icon: (active: boolean) => <FileText size={19} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "profissionais", label: "Profissionais", icon: (active: boolean) => <UsersRound size={19} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen={currentScreen as any} hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <header>
          <button
            type="button"
            onClick={() => onNavigate(backRoute)}
            className="mb-4 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> {backLabel}
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "cadastro" && (
          <Section title="Informações do Cadastro">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <FloatInput key={field.label} label={field.label} value={field.value} disabled onChange={() => {}} />
              ))}
            </div>
          </Section>
        )}

        {activeTab === "profissionais" && (
          <EntityProfessionalsTab
            entityKey={entityKey}
            allowedTypes={allowedTypes}
            onNavigate={onNavigate}
          />
        )}
      </main>
    </div>
  );
}
