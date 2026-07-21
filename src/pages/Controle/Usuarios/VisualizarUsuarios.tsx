import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  Minus,
  ChevronUp,
  ChevronDown,
  Mail,
  IdCard,
  Shield,
  UserCheck,
  ShieldAlert,
  Clock,
  User,
  FileText,
  Network,
  Maximize2,
  X,
  Minimize2,
  Settings,
  PlusCircle,
  MapPin,
  BriefcaseBusiness
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, Tabs, AccordionCardGroup } from "../../../components/ui/FormKit";
import { MultiSearchModal } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// Catálogo simplificado de papéis do sistema
const TODOS_PAPEIS_SISTEMA = [
  { id: 1, nome: "Administrador", nivel: 1, exigeUnidade: false },
  { id: 2, nome: "Responsável Técnico", nivel: 2, exigeUnidade: true }, // Exige informar a Unidade regional
  { id: 3, nome: "Emissor de GTA", nivel: 2, exigeUnidade: true },      // Exige informar a Unidade regional
  { id: 4, nome: "Auxiliar de Cadastro", nivel: 2, exigeUnidade: false },
  { id: 5, nome: "Consultor de Relatórios", nivel: 2, exigeUnidade: false },
  { id: 6, nome: "Pessoa Física", nivel: 3, exigeUnidade: false }
];

// Unidades de Atuação disponíveis para seleção
const UNIDADES_REGIONAIS = [
  "Coordenadoria Regional de Lavras",
  "Coordenadoria Regional de Belo Horizonte",
  "Coordenadoria Regional de Uberlândia",
  "Coordenadoria Regional de Juiz de Fora"
];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>
      )}
    </div>
  );
}

const USUARIO = {
  cpf: "123.456.789-09",
  nome: "Joaquim da Silva",
  email: "joaquim.silva@sidagro.mg.gov.br",
  situacao: "Ativo" as const,
  perfil: "Administrador",
  usuarioAlteracao: "Lucas Pedro Conte",
  dataAlteracao: "14/04/2026 07:29",
};

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export function VisualizarUsuariosPage({
  onLogout = () => { },
  onNavigate = (screen: string) => console.log("navigate:", screen),
}: PageProps = {}) {
  const u = USUARIO;
  const [activeTab, setActiveTab] = useState("cadastro");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGerenciarOpen, setIsGerenciarOpen] = useState(false);
  const [isMultiSearchOpen, setIsMultiSearchOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Estado inicial dos papéis atribuídos ao usuário
  const [papeisAtribuidos, setPapeisAtribuidos] = useState([
    { id: 1, nome: "Administrador", nivel: 1, exigeUnidade: false },
    { id: 2, nome: "Responsável Técnico", nivel: 2, exigeUnidade: true, unidadeAtuacao: "Coordenadoria Regional de Lavras" },
    { id: 3, nome: "Emissor de GTA", nivel: 2, exigeUnidade: true, unidadeAtuacao: "Coordenadoria Regional de Lavras" },
    { id: 6, nome: "Pessoa Física", nivel: 3, exigeUnidade: false }
  ]);

  const [papeisSelecionadosForm, setPapeisSelecionadosForm] = useState<any[]>([]);

  const renderIconePapeis = (isActive: boolean, size = 19, forceWhite = false) => {
    const iconSource = Icons.iconePapéisUrl || (Icons as any).iconepapeisurl;

    if (!iconSource) {
      const colorClass = forceWhite ? "text-white" : (isActive ? "text-[#1A7A3C]" : "text-gray-400");
      return <BriefcaseBusiness size={size} className={colorClass} />;
    }

    if (typeof iconSource === "string") {
      const filterStyle = forceWhite
        ? "brightness(0) invert(1)"
        : (isActive ? "none" : "grayscale(100%) opacity(0.5)");

      return (
        <img
          src={iconSource}
          alt="Ícone de Papel"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            filter: filterStyle
          }}
          className="object-contain transition-all shrink-0"
        />
      );
    }

    const IconComponent = iconSource;
    const colorClass = forceWhite ? "text-white" : (isActive ? "text-[#1A7A3C]" : "text-gray-400");
    return (
      <IconComponent
        size={size}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`${colorClass} shrink-0 transition-all`}
      />
    );
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.1, 0.7));
  const handleResetZoom = () => setZoomScale(1);

  const handleRemoverPapelForm = (id: number) => {
    setPapeisSelecionadosForm(prev => prev.filter(p => p.id !== id));
  };

  const handleAlterarUnidadeForm = (id: number, unidade: string) => {
    setPapeisSelecionadosForm(prev =>
      prev.map(p => (p.id === id ? { ...p, unidadeAtuacao: unidade } : p))
    );
  };

  const handleSalvarGerenciamento = () => {
    const pendenteUnidade = papeisSelecionadosForm.some(p => p.exigeUnidade && !p.unidadeAtuacao);
    if (pendenteUnidade) {
      alert("Por favor, selecione a unidade de atuação para todos os papéis obrigatórios.");
      return;
    }

    setPapeisAtribuidos([...papeisSelecionadosForm]);
    setIsGerenciarOpen(false);
  };

  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (isActive: boolean) => (
        <FileText size={19} className={isActive ? "text-[#1A7A3C]" : "text-gray-400"} />
      )
    },
    {
      id: "papeis",
      label: "Papéis",
      icon: (isActive: boolean) => renderIconePapeis(isActive, 19)
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="usuarios"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("usuarios")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} aria-hidden />
            Todos os usuários
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Usuário</h1>
            </div>

            {activeTab === "cadastro" ? (
              <button
                type="button"
                onClick={() => onNavigate("editar-usuario", u)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPapeisSelecionadosForm([...papeisAtribuidos]);
                  setIsGerenciarOpen(true);
                }}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                <Settings size={14} />
                Gerenciar Papéis
              </button>
            )}
          </div>
        </div>

        {/* Abas */}
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* CADASTRO */}
        {activeTab === "cadastro" && (
          <div className="flex flex-col gap-4">
            <Section title="Informações Básicas">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <FloatInput label="CPF" value={u.cpf} disabled onChange={() => { }} />
                  <FloatInput label="Nome" value={u.nome} disabled onChange={() => { }} />
                </div>
                <div className="grid grid-cols-1 gap-4 items-center">
                  <FloatInput label="Email" value={u.email || "—"} disabled onChange={() => { }} />
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* PAPÉIS */}
        {activeTab === "papeis" && (
          <div className="flex flex-col gap-5 w-full">
            <AccordionCardGroup
              title="Papéis"
              activeCountText={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A7A3C] hover:underline transition"
                  >
                    <Network size={14} />
                    Mapeamento de Hierarquia
                  </button>
                  <span className="text-gray-400 font-bold">·</span>
                  <span>{papeisAtribuidos.length} papéis ativos</span>
                </div>
              }
              variant="sem-vinculacao"
              historicoTitle="Histórico de Papéis"
              icon={renderIconePapeis(true, 21, true)}
              historicoChildren={
                <article className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden min-w-0 w-full opacity-70">
                  <div className="h-1 bg-gray-300" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between gap-3 text-[10px] text-gray-500 items-center">
                      <span><strong>Removido em:</strong> 10/01/2026</span>
                      <span className="font-semibold text-gray-800 px-2 py-0.5">Inativo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {renderIconePapeis(false, 20)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-600">Visualizador Padrão</p>
                      </div>
                    </div>
                  </div>
                </article>
              }
            >
              {papeisAtribuidos.map((papel) => (
                <article
                  key={papel.id}
                  className="bg-white border border-gray-150 shadow-sm rounded-lg overflow-hidden flex flex-col justify-between w-full h-full transition-all hover:shadow-md"
                >
                  <div>
                    <div className="h-1 bg-[#1A7A3C]" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center gap-2 text-[10px] text-gray-500">
                        <span>
                          <strong>Atribuído:</strong> {u.dataAlteracao.split(" ")[0]}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] shrink-0">
                          Ativo
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mt-1">
                        <div className="shrink-0 p-2.5 text-[#1A7A3C]">
                          {renderIconePapeis(true, 18)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-800 break-words" title={papel.nome}>
                            {papel.nome}
                          </p>
                          {papel.unidadeAtuacao && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-800">
                              <MapPin size={13} className="text-gray-400 shrink-0" />
                              <span className="text-xs font-normal text-gray-700 leading-tight break-words" title={papel.unidadeAtuacao}>
                                {papel.unidadeAtuacao}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </AccordionCardGroup>
          </div>
        )}
      </main>

      {/* MAPA HIERÁRQUICO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-[#1A7A3C] border border-green-100">
                  <Network size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Mapa Hierárquico de Acesso</h3>
                  <p className="text-[11px] text-gray-500">Visualização de herança e distribuição de papéis de {u.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button type="button" onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"><Minimize2 size={15} /></button>
                  <span className="text-[10px] font-bold text-gray-600 px-1 min-w-[35px] text-center">{Math.round(zoomScale * 100)}%</span>
                  <button type="button" onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition"><Maximize2 size={15} /></button>
                  <button type="button" onClick={handleResetZoom} className="text-[9px] font-semibold text-gray-400 hover:text-gray-600 px-1 border-l border-gray-100">Reset</button>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-[#fafafa] relative p-8 flex items-center justify-center cursor-grab active:cursor-grabbing">
              <div style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.15s ease-out' }} className="origin-center flex flex-col items-center w-full min-w-[600px] select-none">

                {/* NÍVEL 1 */}
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center gap-2 mb-3 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex flex-row justify-center gap-6 w-full px-4">
                    {papeisAtribuidos.filter(p => p.nivel === 1).map(p => (
                      <div key={p.id} className="w-[260px] bg-white border-2 border-[#1A7A3C] rounded-xl p-4 flex items-center gap-3.5 shadow-md relative">
                        <div className="p-3 rounded-lg bg-[#1A7A3C] text-white shadow-sm shrink-0">{renderIconePapeis(true, 18, true)}</div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Acesso Autorizado</p>
                          <h4 className="text-sm font-bold text-gray-800 truncate" title={p.nome}>{p.nome}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-0.5 h-12 border-l-2 border-dashed border-[#1A7A3C]/40 my-1" />

                {/* NÍVEL 2 */}
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center gap-2 mb-3 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  </div>
                  <div className="flex flex-row justify-center gap-6 w-full px-4">
                    {papeisAtribuidos.filter(p => p.nivel === 2).map(p => (
                      <div key={p.id} className="w-[260px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-start gap-2 shadow-sm relative">
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-3 rounded-lg bg-gray-100 text-gray-500 shrink-0">{renderIconePapeis(false, 18)}</div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-gray-700 truncate" title={p.nome}>{p.nome}</h4>
                          </div>
                        </div>
                        {p.unidadeAtuacao && (
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-medium pl-1">
                            <MapPin size={11} className="text-emerald-600 shrink-0" />
                            <span className="truncate" title={p.unidadeAtuacao}>{p.unidadeAtuacao}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-0.5 h-12 border-l-2 border-dashed border-gray-300 my-1" />

                {/* NÍVEL 3 */}
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center gap-2 mb-3 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex flex-row justify-center gap-6 w-full px-4">
                    {papeisAtribuidos.filter(p => p.nivel === 3).map(p => (
                      <div key={p.id} className="w-[260px] bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 shadow-sm relative">
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-500 shrink-0">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-700 truncate" title={p.nome}>{p.nome}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <footer className="px-6 py-3 bg-gray-50 border-t border-gray-150 flex justify-between items-center text-[11px] text-gray-400">
              <span>* Use os botões de controle para ajustar a escala da árvore hierárquica.</span>
              <span>Último ajuste: {u.dataAlteracao}</span>
            </footer>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL: GERENCIAR PAPÉIS DO USUÁRIO
          ========================================================== */}
      {isGerenciarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-scaleIn relative">

            {/* Botão Fechar no canto superior direito */}
            <button
              type="button"
              onClick={() => setIsGerenciarOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition z-10"
            >
              <X size={18} />
            </button>

            {/* Header Centralizado */}
            <header className="px-6 pt-6 pb-4 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2">
                <div className="p-2 text-[#1A7A3C]">
                  <Settings size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-800">Gerenciar Papéis do Usuário</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Adicione ou remova permissões de <strong className="text-gray-700">{u.nome}</strong>
              </p>
            </header>

            {/* Conteúdo Principal */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">

              {/* Barra Superior do Form */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-700">Papéis Selecionados</span>
                  {papeisSelecionadosForm.length > 0 && (
                    <span className="text-[11px] font-bold bg-green-50 text-[#1A7A3C] px-2.5 py-0.5 rounded-full border border-green-200">
                      {papeisSelecionadosForm.length} {papeisSelecionadosForm.length === 1 ? "papel" : "papéis"}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsMultiSearchOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer shadow-sm"
                >
                  <PlusCircle size={14} /> Adicionar Papel
                </button>
              </div>

              {/* Lista de Papéis */}
              <div className="flex flex-col gap-3">
                {papeisSelecionadosForm.map((papel) => (
                  <div
                    key={papel.id}
                    className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all hover:border-gray-300 shadow-sm"
                  >
                    {/* Lado Esquerdo: Ícone + Nome do Papel */}
                    <div className="flex items-center gap-2.5 min-w-[160px] flex-1">
                      <div className="p-2 rounded-lg bg-green-50 text-[#1A7A3C] shrink-0">
                        {renderIconePapeis(true, 16)}
                      </div>
                      <span className="text-sm font-bold text-gray-800 truncate" title={papel.nome}>
                        {papel.nome}
                      </span>
                    </div>

                    {/* Lado Direito: Seleção da Unidade Regional (quando exigida) + Botão Excluir */}
                    <div className="flex items-center gap-3 shrink-0 justify-end">
                      {papel.exigeUnidade && (
                        <div className="relative w-[340px]">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin size={14} />
                          </div>
                          <select
                            value={papel.unidadeAtuacao || ""}
                            onChange={(e) => handleAlterarUnidadeForm(papel.id, e.target.value)}
                            title={papel.unidadeAtuacao || "Selecione a Regional"}
                            className="w-full pl-9 pr-8 py-2 text-xs font-medium text-gray-700 bg-gray-50/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1A7A3C] focus:bg-white transition cursor-pointer appearance-none truncate"
                          >
                            <option value="" disabled>Selecione a Regional</option>
                            {UNIDADES_REGIONAIS.map((regional) => (
                              <option key={regional} value={regional} className="truncate">
                                {regional}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      )}

                      {/* Botão de Excluir */}
                      <button
                        type="button"
                        onClick={() => handleRemoverPapelForm(papel.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition cursor-pointer shrink-0 ml-1"
                        title="Remover papel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Footer com botões Centralizados */}
            <footer className="px-6 py-4 flex justify-center items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGerenciarOpen(false)}
                className="px-5 py-2 text-xs font-bold text-[#1A7A3C] border border-[#1A7A3C] hover:bg-green-50 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSalvarGerenciamento}
                className="px-6 py-2 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                Salvar Alterações
              </button>
            </footer>

          </div>
        </div>
      )}

      <MultiSearchModal
        open={isMultiSearchOpen}
        onClose={() => setIsMultiSearchOpen(false)}
        title="Buscar Papéis"
        subtitle="Selecione os papéis aplicáveis a este usuário:"
        icon={renderIconePapeis(true, 20)}
        data={TODOS_PAPEIS_SISTEMA}
        searchKeys={["nome"]}
        searchPlaceholder="Busque pelo nome do papel."
        columns={[
          { label: "Papel", key: "nome" }
        ]}
        selectedItems={papeisSelecionadosForm}
        onConfirm={(itensSelecionados: any[]) => {
          setPapeisSelecionadosForm(itensSelecionados);
          setIsMultiSearchOpen(false);
        }}
        confirmLabel="Salvar Selecionados"
      />
    </div>
  );
}

export default VisualizarUsuariosPage;