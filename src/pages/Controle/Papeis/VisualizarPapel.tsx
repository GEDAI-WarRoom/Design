import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, ChevronRight, Copy, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

type ModuloNode = {
  id: string;
  label: string;
  children?: ModuloNode[];
};

const MODULOS_MOCK: ModuloNode[] = [
  {
    id: "cadastros",
    label: "Cadastros",
    children: [
      { id: "animal", label: "Animal" },
      {
        id: "geral",
        label: "Geral",
        children: [
          {
            id: "produtor",
            label: "Produtor",
            children: [
              { id: "prod_cad", label: "Cadastrar" },
              { id: "prod_bus", label: "Buscar/Visualizar" },
              { id: "prod_edit", label: "Editar" },
            ],
          },
          {
            id: "estab",
            label: "Estabelecimento Agropecuário",
            children: [
              { id: "estab_cad", label: "Cadastrar" },
              { id: "estab_bus", label: "Buscar/Visualizar" },
              { id: "estab_edit", label: "Editar" },
            ],
          },
        ],
      },
      { id: "vegetal", label: "Vegetal" },
    ],
  },
];

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

function TreeCheckboxNode({
  node,
  selectedIds,
  level = 0,
}: {
  node: ModuloNode;
  selectedIds: string[];
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isChecked = selectedIds.includes(node.id);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-1.5 group">
        <div className="w-5 flex justify-center">
          {hasChildren && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
        <label className="flex items-center gap-3 select-none cursor-not-allowed opacity-80">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isChecked}
              disabled
              className="peer appearance-none w-[18px] h-[18px] border border-gray-300 rounded bg-gray-100 transition-all duration-150"
              style={isChecked ? { backgroundColor: "#9ca3af", borderColor: "#9ca3af" } : {}}
            />
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className={`text-sm ${hasChildren ? "font-semibold text-gray-700" : "font-medium text-gray-600"}`}>
            {node.label}
          </span>
        </label>
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col ml-[10px] pl-[22px] border-l border-gray-100 mt-1 mb-1">
          {node.children!.map((child) => (
            <TreeCheckboxNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  papel?: any;
}

export function VisualizarPapelPage({ onLogout, onNavigate, papel }: PageProps) {
  const mockPapel = papel || {
    nome: "Responsável Técnico",
    tipo: "Complementar",
    situacao: "Ativo",
    permissoes: ["cadastros", "animal", "geral", "produtor", "prod_bus"],
    ultimaAlteracao: "14/04/2026 07:29",
    usuarioAlteracao: "Lucas Pedro Conte"
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="papeis" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("papeis")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os papéis
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Papel</h1>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onNavigate("copiar-papel", mockPapel)}
                className="px-5 h-10 border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                <Copy size={16} />
                Copiar Papel
              </button>
              {mockPapel.tipo === "Complementar" && (
                <button
                  type="button"
                  onClick={() => onNavigate("editar-papel", mockPapel)}
                  className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatInput label="Tipo de Papel" value={mockPapel.tipo} disabled />
            <FloatInput label="Nome do Papel" value={mockPapel.nome} disabled />
          </div>
        </Section>

        <Section title="Permissões de Acesso">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-700">Módulos:</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-xl max-w-2xl">
              {MODULOS_MOCK.map((modulo) => (
                <TreeCheckboxNode
                  key={modulo.id}
                  node={modulo}
                  selectedIds={mockPapel.permissoes}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Situação do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatInput label="Situação" value={mockPapel.situacao} disabled />
          </div>
        </Section>

        <Section title="Alterações do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatInput label="Usuário" value={mockPapel.usuarioAlteracao} disabled />
            <FloatInput label="Data e Hora da Última Modificação" value={mockPapel.ultimaAlteracao} disabled />
          </div>
        </Section>
      </main>
    </div>
  );
}