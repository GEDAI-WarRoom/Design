import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, ChevronRight, Check, Info, Copy, User, Search
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, CustomButton, SearchModal } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// HELPERS DE UI (padrão do projeto)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

// ==========================================================
// CATÁLOGO DE PAPÉIS EXISTENTES (Sem intermediário e nível)
// ==========================================================
interface SystemRole {
  id: string;
  nome: string;
}

const SYSTEM_ROLES: SystemRole[] = [
  { id: "pf", nome: "Pessoa Física" },
  { id: "pj", nome: "Pessoa Jurídica" },
  { id: "vet", nome: "Veterinário" },
  { id: "agro", nome: "Agrônomo" },
  { id: "prod", nome: "Produtor Rural" },
  { id: "ges", nome: "Gestor de Cadastros" },
  { id: "adm", nome: "Administrador" },
];

const TIPOS_PAPEL = ["Complementar", "Intermediário", "Principal"];

// ==========================================================
// ÁRVORE DE PERMISSÕES
// ==========================================================
interface PermAction { id: string; label: string }
interface PermSection { id: string; label: string; actions: PermAction[] }
interface PermSubmodule { id: string; label: string; sections: PermSection[] }
interface PermModule { id: string; label: string; submodules: PermSubmodule[] }

const PERM_DATA: PermModule[] = [
  {
    id: "cadastros", label: "Cadastros",
    submodules: [
      { id: "animal", label: "Animal", sections: [] },
      {
        id: "geral", label: "Geral",
        sections: [
          {
            id: "produtor", label: "Produtor",
            actions: [
              { id: "prod.cad", label: "Cadastrar" },
              { id: "prod.bus", label: "Buscar/Visualizar" },
              { id: "prod.edi", label: "Editar" },
            ],
          },
          {
            id: "estabelecimento", label: "Estabelecimento Agropecuário",
            actions: [
              { id: "est.cad", label: "Cadastrar" },
              { id: "est.bus", label: "Buscar/Visualizar" },
              { id: "est.edi", label: "Editar" },
            ],
          },
        ],
      },
      { id: "vegetal", label: "Vegetal", sections: [] },
    ],
  },
];

function PermCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className="shrink-0 size-[16px] rounded-[3px] relative cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
      style={{
        background: checked ? GREEN : "white",
        border: `1.5px solid ${checked ? GREEN : "rgba(210,210,215,0.8)"}`,
      }}
    >
      {checked && (
        <svg className="absolute inset-0 size-full" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function PermissionsTree({
  checked, setChecked,
}: {
  checked: Record<string, boolean>;
  setChecked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    cadastros: true, geral: true, produtor: true, estabelecimento: true,
  });

  // Recursão para herdar seleções nos elementos filhos abaixo do checkbox marcado
  const toggleNodeAndChildren = (nodeId: string, isChecked: boolean) => {
    const idsToUpdate: string[] = [nodeId];

    const findChildren = (id: string) => {
      const mod = PERM_DATA.find(m => m.id === id);
      if (mod) {
        mod.submodules.forEach(sub => {
          idsToUpdate.push(sub.id);
          sub.sections.forEach(sec => {
            idsToUpdate.push(sec.id);
            sec.actions.forEach(act => idsToUpdate.push(act.id));
          });
        });
        return;
      }

      for (const m of PERM_DATA) {
        const sub = m.submodules.find(s => s.id === id);
        if (sub) {
          sub.sections.forEach(sec => {
            idsToUpdate.push(sec.id);
            sec.actions.forEach(act => idsToUpdate.push(act.id));
          });
          return;
        }
      }

      for (const m of PERM_DATA) {
        for (const s of m.submodules) {
          const sec = s.sections.find(sc => sc.id === id);
          if (sec) {
            sec.actions.forEach(act => idsToUpdate.push(act.id));
            return;
          }
        }
      }
    };

    findChildren(nodeId);

    setChecked((prev) => {
      const next = { ...prev };
      idsToUpdate.forEach(id => {
        if (isChecked) {
          next[id] = true;
        } else {
          delete next[id];
        }
      });
      return next;
    });
  };

  const toggleCheck = (id: string) => {
    const currentStatus = !!checked[id];
    toggleNodeAndChildren(id, !currentStatus);
  };

  const toggleExpand = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const ChevronBtn = ({ id }: { id: string }) => (
    <button
      type="button"
      onClick={() => toggleExpand(id)}
      aria-label={expanded[id] ? "Recolher" : "Expandir"}
      className="cursor-pointer ml-0.5 shrink-0 text-gray-500 transition-transform"
      style={{ transform: expanded[id] ? "rotate(90deg)" : "none" }}
    >
      <ChevronRight size={18} />
    </button>
  );

  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-700 mb-3">Módulos:</span>
      {PERM_DATA.map((mod) => (
        <div key={mod.id}>
          <div className="flex items-center gap-2 py-1.5">
            <PermCheckbox checked={!!checked[mod.id]} onChange={() => toggleCheck(mod.id)} label={mod.label} />
            <span className="text-[15px] font-bold text-gray-600">{mod.label}</span>
            <ChevronBtn id={mod.id} />
          </div>

          {expanded[mod.id] && (
            <div className="ml-5">
              {mod.submodules.map((sub) => (
                <div key={sub.id} className="pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 py-1.5">
                    <PermCheckbox checked={!!checked[sub.id]} onChange={() => toggleCheck(sub.id)} label={sub.label} />
                    <span className="text-[15px] font-bold text-gray-600">{sub.label}</span>
                    {sub.sections.length > 0 && <ChevronBtn id={sub.id} />}
                  </div>

                  {expanded[sub.id] && sub.sections.map((sec) => (
                    <div key={sec.id} className="ml-4 pl-4 border-l border-gray-200">
                      <div className="flex items-center gap-2 py-1.5">
                        <PermCheckbox checked={!!checked[sec.id]} onChange={() => toggleCheck(sec.id)} label={sec.label} />
                        <span className="text-[15px] font-bold text-gray-600">{sec.label}</span>
                        <ChevronBtn id={sec.id} />
                      </div>

                      {expanded[sec.id] && (
                        <div className="ml-4 pl-4 border-l border-gray-200">
                          {sec.actions.map((act) => (
                            <div key={act.id} className="flex items-center gap-3 py-1.5">
                              <PermCheckbox checked={!!checked[act.id]} onChange={() => toggleCheck(act.id)} label={act.label} />
                              <span className="text-xs text-gray-700">{act.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR PAPEL
// ==========================================================
interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
}

export function AdicionarPapeisPage({
  onLogout = () => {},
  onNavigate = (screen: any) => console.log("navigate:", screen),
}: PageProps = {}) {
  // Informações básicas: Inicia fixo e desativado como "Complementar"
  const [tipo, setTipo] = useState("Complementar");
  const [nomePapel, setNomePapel] = useState("");

  // Permissões e Modal de Cópia
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isModalCopiarOpen, setIsModalCopiarOpen] = useState(false);
  const [filtroPapel, setFiltroPapel] = useState("");
  const [papelSelecionadoNome, setPapelSelecionadoNome] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  const copiarPermissoes = (p: SystemRole) => {
    setPapelSelecionadoNome(p.nome);
    // Simula a replicação de permissões
    setChecked({
      cadastros: true, geral: true, produtor: true, estabelecimento: true,
      "prod.cad": true, "prod.bus": true, "prod.edi": true,
      "est.bus": true,
    });
    setIsModalCopiarOpen(false);
  };

  const handleAdicionar = () => {
    if (!tipo || !nomePapel.trim()) {
      alert("Preencha o tipo e o nome do papel.");
      return;
    }
    setIsSucesso(true);
  };

  const papeisFiltrados = SYSTEM_ROLES.filter((p) =>
    p.nome.toLowerCase().includes(filtroPapel.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="papeis" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("papeis")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} aria-hidden />
            Todos os Papéis
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Papel</h1>
            <button
              type="button"
              onClick={handleAdicionar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Aviso de obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" aria-hidden />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 items-center">
            <FloatSelect
              label="Tipo de Papel"
              required
              value={tipo}
              onChange={setTipo}
              options={toOptions(TIPOS_PAPEL)}
              disabled={true} 
            />
            <FloatInput label="Nome do Papel" required value={nomePapel} onChange={setNomePapel} maxLength={255} />
          </div>
        </Section>

        {/* 2. Permissões de Acesso */}
        <Section title="Permissões de Acesso">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-2 text-gray-600">
              <Info size={18} className="stroke-[2.5] flex-shrink-0 mt-0.5 text-gray-500" aria-hidden />
              <span className="text-sm">
                As permissões de acesso podem ser definidas manualmente ou copiadas de um papel já existente no sistema.
              </span>
            </div>

            {/* Copiar de papel existente */}
            <div className="flex flex-col md:flex-row gap-3 md:items-end bg-gray-50/60 border border-gray-100 rounded-lg p-4">
              <div className="flex-1">
                <FloatInput
                  label="Copiar permissões de"
                  value={papelSelecionadoNome}
                 icon={<Copy size={16} />} 
                  placeholder="Clique para selecionar um papel..."
                  onClick={() => setIsModalCopiarOpen(true)}
                  readOnly
                  className="cursor-pointer font-medium"
                />
              </div>
              
            </div>

            <hr className="border-gray-100" />

            <PermissionsTree checked={checked} setChecked={setChecked} />
          </div>
        </Section>

        {/* Rodapé de ações */}
        <div className="flex justify-end gap-3 pb-4">
          <CustomButton variant="outlined" onClick={() => onNavigate("papeis")}>
            Cancelar
          </CustomButton>
          <CustomButton variant="filled" onClick={handleAdicionar}>
            Adicionar
          </CustomButton>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-sucesso-papel"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} aria-hidden />
            </div>
            <h3 id="titulo-sucesso-papel" className="text-lg font-bold text-gray-900">
              Papel cadastrado com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {nomePapel ? `O papel ${nomePapel}` : "O papel"} foi cadastrado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("papeis"); }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-papel", { tipo, nomePapel }); }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
{/* Modal de Cópia Simples usando seu SearchModal correto */}
<SearchModal<SystemRole>
  open={isModalCopiarOpen}
  onClose={() => {
    setIsModalCopiarOpen(false);
    setFiltroPapel(""); 
  }}
  title="Copiar Permissões de um Papel"
  subtitle="Selecione abaixo um dos papéis de sistema cadastrados para copiar suas configurações de acesso."
  data={papeisFiltrados || []}
  columns={[
    {
      key: "nome",
      header: "Nome do Papel",
    }
  ]}
  searchKeys={["nome"]}
  // O seu componente já usa essa prop para renderizar o input de busca único correto:
  searchPlaceholder="Buscar papel..." 
  confirmLabel="Confirmar"
  onConfirm={(p) => {
    copiarPermissoes(p);
    setIsModalCopiarOpen(false);
    setFiltroPapel("");
  }}
  // Removemos o input duplicado daqui de dentro:
  headerActions={undefined} 
/>
    </div>
  );
}

export default AdicionarPapeisPage;