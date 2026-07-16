import React, { useState } from "react";
import { ArrowLeft, Check, ChevronUp, ChevronDown, ChevronRight, Info as InfoIcon, Power, PowerOff } from "lucide-react";
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

function getAllDescendantIds(node: ModuloNode): string[] {
  let ids = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids = ids.concat(getAllDescendantIds(child));
    });
  }
  return ids;
}

function TreeCheckboxNode({
  node,
  selectedIds,
  onToggle,
  level = 0,
}: {
  node: ModuloNode;
  selectedIds: string[];
  onToggle: (nodeId: string, isChecked: boolean, descendantIds: string[]) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isChecked = selectedIds.includes(node.id);

  const handleCheckChange = () => {
    const descendants = getAllDescendantIds(node);
    onToggle(node.id, !isChecked, descendants);
  };

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
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckChange}
              className="peer appearance-none w-[18px] h-[18px] border border-gray-300 rounded bg-white checked:bg-[#1A7A3C] checked:border-[#1A7A3C] focus:outline-none transition-all duration-150"
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
              onToggle={onToggle}
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

export function EditarPapelPage({ onLogout, onNavigate, papel }: PageProps) {
  const mockPapel = papel || {
    nome: "Responsável Técnico",
    tipo: "Complementar",
    situacao: "Ativo",
    permissoes: ["cadastros", "animal", "geral", "produtor", "prod_bus"],
    ultimaAlteracao: "14/04/2026 07:29",
    usuarioAlteracao: "Lucas Pedro Conte"
  };

  const [nomePapel, setNomePapel] = useState(mockPapel.nome);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(mockPapel.permissoes);
  const [situacao, setSituacao] = useState(mockPapel.situacao);

  const [modalAtivarInativar, setModalAtivarInativar] = useState(false);
  const [modalConfirmarSalvar, setModalConfirmarSalvar] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);

  const handleTogglePermission = (nodeId: string, isChecked: boolean, descendantIds: string[]) => {
    setSelectedPermissions((prev) => {
      let updated = [...prev];
      if (isChecked) {
        descendantIds.forEach((id) => {
          if (!updated.includes(id)) updated.push(id);
        });
      } else {
        updated = updated.filter((id) => !descendantIds.includes(id));
      }
      return updated;
    });
  };

  const handleSalvarConfirmado = () => {
    setModalConfirmarSalvar(false);
    setIsSucesso(true);
  };

  const toggleSituacao = () => {
    setSituacao(situacao === "Ativo" ? "Inativo" : "Ativo");
    setModalAtivarInativar(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="papeis" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-papel", mockPapel)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Visualizar papel
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Papel</h1>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalAtivarInativar(true)}
                className={`px-5 h-10 border text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2 ${
                  situacao === "Ativo" ? "border-red-600 text-red-600 hover:bg-red-50" : "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50"
                }`}
              >
                {situacao === "Ativo" ? <PowerOff size={16} /> : <Power size={16} />}
                {situacao === "Ativo" ? "Inativar" : "Ativar"}
              </button>
              <button
                type="button"
                onClick={() => setModalConfirmarSalvar(true)}
                disabled={!nomePapel.trim()}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/*[cite: 12] */}
            <FloatInput label="Tipo de Papel" value={mockPapel.tipo} disabled />
            <FloatInput
              label="Nome do Papel"
              required
              value={nomePapel}
              onChange={setNomePapel}
              maxLength={255}
            />
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
                  selectedIds={selectedPermissions}
                  onToggle={handleTogglePermission}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Situação do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/*[cite: 12] */}
            <FloatInput label="Situação" value={situacao} disabled />
          </div>
        </Section>

        <Section title="Alterações do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/*[cite: 12] */}
            <FloatInput label="Usuário" value={mockPapel.usuarioAlteracao} disabled />
            <FloatInput label="Data e Hora da Última Modificação" value={mockPapel.ultimaAlteracao} disabled />
          </div>
        </Section>
      </main>

      {modalConfirmarSalvar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Salvar Alterações</h3>
            <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja salvar as alterações realizadas neste papel?</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setModalConfirmarSalvar(false)}
                className="px-5 h-11 rounded-md border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarConfirmado}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAtivarInativar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Ação</h3>
            <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja {situacao === "Ativo" ? "inativar" : "ativar"} o cadastro deste papel?</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setModalAtivarInativar(false)}
                className="px-5 h-11 rounded-md border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={toggleSituacao}
                className={`px-5 h-11 rounded-md text-white text-sm font-semibold transition ${
                  situacao === "Ativo" ? "bg-red-600 hover:bg-red-700" : "bg-[#1A7A3C] hover:bg-[#15612F]"
                }`}
              >
                {situacao === "Ativo" ? "Inativar" : "Ativar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Papel atualizado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">As alterações do papel {nomePapel} foram salvas.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-papel"); }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}