import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Pencil, Check, Minus, FileText, Calendar, Scale, Layers, SquareArrowOutUpRight, Dna } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SimNao, AccordionCardGroup } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

const modalPaths = {
  p2d711e00: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  p3a9c0480: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  p2b1b0180: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
  p259a9c00: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  p3823abb0: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-2-1.1-2-2-2zm0 16H5V8h14v11z",
  p37692800: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  p1022dd80: "M11 15h2v2h-2zm0-8h2v6h-2z",
  p1711ca80: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
};

const GRUPOS = [
  "Anfíbios", "Aves", "Bovídeos", "Crustáceos", "Equídeos", "Grandes Roedores",
  "Invertebrados", "Moluscos", "Outras Espécies", "Peixes", "Répteis",
  "Suídeos", "Taiassuídeos",
];

const SUBESPECIES_MOCK = [
  { codigo: "0012-A", nome: "Zebuíno", situacao: "Ativo", atualizadoEm: "10/05/2026" },
  { codigo: "0012-B", nome: "Taurino", situacao: "Ativo", atualizadoEm: "12/05/2026" },
  { codigo: "0012-C", nome: "Bubalino", situacao: "Ativo", atualizadoEm: "20/04/2026" },
];

const DADOS_EXEMPLO = {
  codigo: "0012",
  grupo: "Bovídeos",
  nome: "Bovino",
  nomeCientifico: "Bos taurus",
  codigoMapa: "1234567890",
  maxAnimaisGta: "500",
  controleRebanhoNucleo: "Não",
  sexoDefinido: "Sim",
  emissaoGtaHabilitado: "Sim",
  utilizaFormularioGta: "Não",
  situacao: "Ativo",
};

// ─── Modal Primitives ─────────────────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative animate-fadeIn" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Componente: Tabs (CORRIGIDO PARA SUPORTAR FUNÇÃO DINÂMICA) ───────────────
interface Tab {
  id: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode; // Tipo alterado para função
}

interface TabsProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Tab[];
}

function Tabs({ activeTab, setActiveTab, tabs }: TabsProps) {
  return (
    <div className="w-full border-b border-gray-200 mt-4 mb-2">
      <div className="flex justify-around md:justify-start md:gap-10 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 pb-3 px-2 transition-all duration-200 relative
                text-sm font-medium cursor-pointer
                ${isActive ? "text-[#1A7A3C]" : "text-gray-500 hover:text-gray-700"}
              `}
            >
              <span className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}>
                {/* MODIFICADO AQUI: Executa a função passando se o estado está ativo */}
                {tab.icon(isActive)}
              </span>
              {tab.label}
              
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{ backgroundColor: GREEN }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helper Section ──────────────────────────────────────────────────────────
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

// ─── Componente Principal ────────────────────────────────────────────────────
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  data?: any;
}

export function VisualizarEspeciePage({ onLogout, onNavigate, data }: PageProps) {
  const d = { ...DADOS_EXEMPLO, ...(data || {}) };
  const LAT = { fontFamily: "'Lato', sans-serif" } as const;
  
  const [activeTab, setActiveTab] = useState("cadastro");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  
  // ─── Estados do Modal Dinâmico ───
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [modalMode, setModalMode] = useState<"cadastro" | "visualizar" | "editar">("cadastro");
  const [selectedRaca, setSelectedRaca] = useState<typeof SUBESPECIES_MOCK[0] | null>(null);
  const [nomeRacaInput, setNomeRacaInput] = useState("");

  const menuTabs = [
    { id: "cadastro", label: "Cadastro", icon: (isActive: boolean) => <FileText size={16} /> },
    { id: "faixa-etaria", label: "Faixa Etária", icon: (isActive: boolean) => <Calendar size={16} /> },
    { 
      id: "taxa-controle", 
      label: "Taxa de Controle", 
      icon: (isActive: boolean) => (
        <img 
          src={Icons?.iconeTaxaControleUrl}  
          alt="Taxa de Controle" 
          // Se estiver ativo, remove o grayscale. Se não, fica cinza!
          className={`w-4 h-4 object-contain shrink-0 transition-all ${isActive ? "" : "grayscale opacity-60"}`} 
        />
      )
    },
    { id: "subespecie", label: "Raça", icon: (isActive: boolean) => <Dna size={16} /> },
  ];

  const abrirModalCadastro = () => {
    setModalMode("cadastro");
    setSelectedRaca(null);
    setNomeRacaInput("");
    setIsModalAberto(true);
  };

  const abrirModalVisualizar = (raca: typeof SUBESPECIES_MOCK[0]) => {
    setModalMode("visualizar");
    setSelectedRaca(raca);
    setNomeRacaInput(raca.nome);
    setIsModalAberto(true);
  };

  const abrirModalEditar = (raca: typeof SUBESPECIES_MOCK[0]) => {
    setModalMode("editar");
    setSelectedRaca(raca);
    setNomeRacaInput(raca.nome);
    setIsModalAberto(true);
  };
  
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="especie" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("especie")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Espécies
          </button>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Visualizar Espécie</h1>
            </div>

            {activeTab === "cadastro" && (
              <button
                type="button"
                onClick={() => onNavigate("editar-especie", d)}
                className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm cursor-pointer"
              >
                Editar
              </button>
            )}

            {activeTab === "subespecie" && (
              <button
                type="button"
                onClick={abrirModalCadastro}
                className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm cursor-pointer"
              >
                Adicionar Raça
              </button>
            )}
          </div>
        </div>

        <Tabs tabs={menuTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="animate-fadeIn">
          {/* ABA 1: CADASTRO */}
          {activeTab === "cadastro" && (
            <Section title="Informações Básicas">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatSelect
                    label="Grupo"
                    disabled
                    value={d.grupo}
                    onChange={() => {}}
                    options={GRUPOS.map((g) => ({ value: g, label: g }))}
                  />
                  <FloatInput label="Nome da Espécie" disabled value={d.nome} onChange={() => {}} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatInput label="Nome Científico" disabled value={d.nomeCientifico} onChange={() => {}} />
                  <FloatInput label="Código do MAPA" disabled value={d.codigoMapa} onChange={() => {}} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FloatInput label="Número máximo de animais por GTA" disabled value={d.maxAnimaisGta} onChange={() => {}} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  <SimNao label="Possui Controle de Rebanho por Núcleo?" disabled value={d.controleRebanhoNucleo} onChange={() => {}} />
                  <SimNao label="Possui Sexo Definido?" disabled value={d.sexoDefinido} onChange={() => {}} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  <SimNao label="Espécie Permite Emissão de GTA por Habilitado?" disabled value={d.emissaoGtaHabilitado} onChange={() => {}} />
                  <SimNao label="Utiliza Formulário para a Emissão de GTA?" disabled value={d.utilizaFormularioGta} onChange={() => {}} />
                </div>
              </div>
            </Section>
          )}

          {/* ABA 2: FAIXA ETÁRIA */}
          {activeTab === "faixa-etaria" && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500 text-sm">
              Espaço reservado para a configuração ou listagem de Faixa Etária da espécie.
            </div>
          )}

          {/* ABA 3: TAXA DE CONTROLE */}
          {activeTab === "taxa-controle" && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500 text-sm">
              Espaço reservado para os parâmetros de Taxa de Controle da espécie.
            </div>
          )}

          {/* ABA 4: RAÇA (SUBESPÉCIE) */}
          {activeTab === "subespecie" && (
            <div className="animate-fadeIn">
              <AccordionCardGroup
                title="Raça"
                icon={<Dna size={18} className="text-white" />}
                activeCountText={`${SUBESPECIES_MOCK.length} Ativas`}
                onAddClick={abrirModalCadastro}
              >
                {SUBESPECIES_MOCK.map((sub, i) => (
                  <div
                    key={i}
                    className="bg-white flex flex-col gap-3 p-4 relative rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-200 w-full"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A7A3C] rounded-t-md" />

                    <div className="flex items-center justify-between text-xs pb-2 mt-1">
                      <span className="text-gray-500">
                        <span className="font-semibold">Atualizado:</span> {sub.atualizadoEm}
                      </span>
                      <span className="text-gray-500 text-[10px] font-normal">
                        Ativo
                      </span>
                    </div>

                    <div className="flex gap-3 items-center my-1">
                      <div className="text-[#1A7A3C] p-1.5 shrink-0">
                        <Dna size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 line-clamp-1">{sub.nome}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-end mt-auto relative">
                      <div className="flex gap-2 items-center relative">
                        <button
                          type="button"
                          onClick={() => abrirModalVisualizar(sub)}
                          className="bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold px-4 py-2 rounded-md transition cursor-pointer"
                        >
                          Visualizar
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuIndex(openMenuIndex === i ? null : i);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>

                          {openMenuIndex === i && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuIndex(null)} />
                              <div className="absolute right-0 bottom-full mb-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 animate-fadeIn">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuIndex(null);
                                    abrirModalEditar(sub);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                                >
                                  Editar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </AccordionCardGroup>
            </div>
          )}
        </div>
      </main>

      {/* MODAL MULTI-MODO DE RAÇA (CADASTRO / VISUALIZAR / EDITAR) */}
      <Modal open={isModalAberto} onClose={() => setIsModalAberto(false)}>
        <div
          className="bg-white rounded-[15px] w-[1000px] flex flex-col gap-[12px] items-center px-[45px] py-[40px] overflow-x-clip overflow-y-auto"
          style={{ border: "1px solid #d6d6d6", maxHeight: "90vh" }}
        >
          {/* Close button */}
          <div className="flex items-center justify-end w-full">
            <button className="cursor-pointer overflow-clip relative size-[24px]" onClick={() => setIsModalAberto(false)}>
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={modalPaths.p2d711e00} fill="#1A7A3C" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="flex gap-[12px] items-center justify-center w-full">
            <div className="text-[#1A7A3C] flex items-center justify-center shrink-0 size-[24px]">
              <Dna size={24} />
            </div>
            
            <div className="flex h-[61px] items-center justify-center py-[16px]">
              <span style={{ ...LAT, fontSize: 24, fontWeight: 700, color: "#1d1d1f", whiteSpace: "nowrap" }}>
                {modalMode === "cadastro" && "Cadastrar Nova Raça"}
                {modalMode === "visualizar" && "Visualizar Raça"}
                {modalMode === "editar" && "Editar Raça"}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="flex items-center justify-center">
            <span style={{ ...LAT, fontSize: 14, fontWeight: 400, color: "#1d1d1f", whiteSpace: "nowrap" }}>
              {modalMode === "cadastro" && "Preencha os campos abaixo para adicionar uma nova raça a esta espécie:"}
              {modalMode === "visualizar" && "Visualização do cadastro de raça da espécie."}
              {modalMode === "editar" && "Edição do cadastro de raça da espécie."}
            </span>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center justify-center py-[18px] w-full">
            <div className="h-0 w-full relative">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block w-full" style={{ height: 1 }} fill="none" viewBox="0 0 910 1" preserveAspectRatio="none">
                  <line stroke="#D2D2D7" strokeOpacity="0.6" strokeLinecap="round" x1="0.5" x2="909.5" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Formulário Interno do Modal */}
          <div className="w-full flex flex-col gap-5 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-5 w-full">
              <FloatInput 
                label="Nome da Raça" 
                value={nomeRacaInput} 
                disabled={modalMode === "visualizar"} 
                onChange={(e: any) => {
                  const val = e?.target ? e.target.value : e;
                  setNomeRacaInput(val);
                }} 
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[12px] items-center justify-center pb-[24px] pt-[50px] w-full">
            {modalMode === "visualizar" ? (
              <>
                {/* Cancelar (Apenas contornado) */}
                <button
                  type="button"
                  onClick={() => setIsModalAberto(false)}
                  className="flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer bg-white transition hover:bg-gray-50"
                  style={{ border: "1px solid #1A7A3C" }}
                >
                  <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "#1A7A3C" }}>Cancelar</span>
                </button>
                {/* Editar (Preenchido) */}
                <button
                  type="button"
                  onClick={() => setModalMode("editar")}
                  className="bg-[#1A7A3C] hover:bg-[#15612F] flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
                >
                  <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "white" }}>Editar</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsModalAberto(false)}
                  className="flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer bg-white transition hover:bg-gray-50"
                  style={{ border: "1px solid #1A7A3C" }}
                >
                  <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "#1A7A3C" }}>Cancelar</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (modalMode === "cadastro") {
                      alert("Raça adicionada com sucesso!");
                    } else if (modalMode === "editar") {
                      alert("Raça updated com sucesso!");
                    }
                    setIsModalAberto(false);
                  }}
                  className="bg-[#1A7A3C] hover:bg-[#15612F] flex h-[43px] items-center justify-center px-[21px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
                >
                  <span style={{ ...LAT, fontSize: 15, fontWeight: 700, color: "white" }}>Salvar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}