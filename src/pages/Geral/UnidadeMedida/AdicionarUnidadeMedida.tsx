import React, { useState } from "react";
import { ArrowLeft, Info, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, CheckboxGroup } from "../../../components/ui/FormKit"; // 💡 Importado CheckboxGroup

const GREEN = "#1A7A3C";

// Opções para o tipo de unidade de medida
const OPCOES_TIPO = [
  { value: "Animal", label: "Animal" },
  { value: "Vegetal", label: "Vegetal" },
  { value: "Agrotóxico", label: "Agrotóxico" },
];

// ==========================================================
// HELPERS DE UI (mesmo padrão do fluxo de cadastro)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

// ==========================================================
// PÁGINA: CADASTRAR UNIDADE DE MEDIDA (US048 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarUnidadeMedidaPage({ onLogout, onNavigate }: PageProps) {
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]); // 💡 Estado para armazenar os tipos selecionados
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-medida" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("unidade-medida")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Unidades de Medida
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Unidade de Medida</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box de campos obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            {/* Inputs de texto padrão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput label="Unidade de Medida" required value={nome} onChange={setNome} maxLength={255} />
              <FloatInput label="Descrição" required value={sigla} onChange={setSigla} maxLength={10} />
            </div>

            {/* 💡 Grupo de Checkboxes injetado seguindo o padrão de UI */}
            <div className="border-t border-gray-100 pt-5">
              <CheckboxGroup
                title="Tipo de Unidade de Medida"
                required
                options={OPCOES_TIPO}
                orientation = "horizontal"
                selectedValues={tiposSelecionados}
                onChange={setTiposSelecionados}
              />
            </div>
          </div>
        </Section>

       
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Unidade de medida adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A unidade de medida"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("unidade-medida"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-unidade-medida", { nome, sigla, tipos: tiposSelecionados, observacao, situacao: "Ativo" }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}