import React, { useState } from "react";
import { ArrowLeft, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CheckboxGroup, FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_UNIDADE = {
  nome: "Quilograma",
  sigla: "kg",
  tipos: ["Animal"],
  situacao: "Ativo",
  observacao: "Unidade utilizada para registrar peso em cadastros e movimentações de origem animal.",
};

function Section({ title, children }: { title: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function VisualizarUnidadeMedidaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const unidade = {
    ...(dados || {}),
    nome: dados?.nome || EXEMPLO_UNIDADE.nome,
    sigla: dados?.sigla || EXEMPLO_UNIDADE.sigla,
    tipos: dados?.tipos?.length ? dados.tipos : dados?.tipo ? [dados.tipo] : EXEMPLO_UNIDADE.tipos,
    situacao: dados?.situacao || EXEMPLO_UNIDADE.situacao,
    observacao: dados?.observacao || EXEMPLO_UNIDADE.observacao,
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-medida" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("unidade-medida")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Unidades de Medida
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Unidade de Medida</h1>
            <button type="button" onClick={() => onNavigate("editar-unidade-medida", unidade)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Unidade de Medida" value={unidade.nome} disabled onChange={() => { }} />
            <FloatInput label="Descrição" value={unidade.sigla} disabled onChange={() => { }} />
          </div>
          <div className="border-t border-gray-100 pt-5">
            <CheckboxGroup
              title="Tipo de Unidade de Medida"
              options={[
                { value: "Animal", label: "Animal" },
                { value: "Vegetal", label: "Vegetal" },
                { value: "Agrotóxico", label: "Agrotóxico" },
              ]}
              orientation="horizontal"
              defaultValue={unidade.tipos}
              disabled
            />
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={unidade.observacao} disabled onChange={() => { }} />
        </Section>
      </main>
    </div>
  );
}
