import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, FileText, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatMultiSelect, FloatSelect, LargeTextArea, Tabs } from "../../../components/ui/FormKit";
import { ResponsabilidadesTecnicasTab } from "../../../components/ResponsabilidadesTecnicasTab";
import { ResponsabilidadeTecnicaModal } from "../../../components/ResponsabilidadeTecnicaModal";
import { HabilitacoesProfissionalAnimalTab } from "../../../components/HabilitacoesProfissionalAnimalTab";
import { HabilitacaoProfissionalAnimalModal } from "../../../components/HabilitacaoProfissionalAnimalModal";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { obterProfissionalAnimal } from "./profissionalAnimalData";
import * as Icons from "../../../imports/icons";

const FORMACOES = ["Médico Veterinário", "Biofísico", "Biólogo", "Bioquímico", "Biotecnólogo", "Engenheiro Agrônomo", "Zootecnista"].map((value) => ({ value, label: value }));
const HABILITACOES = ["Emissão de GTA", "Exame de Brucelose/Tuberculose", "Exame de Mormo"];
const SITUACOES = ["Ativo", "Inativo"].map((value) => ({ value, label: value }));
const SIM_NAO = ["Sim", "Não"].map((value) => ({ value, label: value }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="rounded-xl bg-white shadow-sm"><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>{open && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}</section>;
}

const exemplo = { id: 1, nome: "Josephina Arantes", cpf: "444.009.956-40", formacao: "Médico Veterinário", numeroConselho: "512633", servicoOficial: "Sim", vacinacaoBrucelose: "Sim", habilitacoes: ["Emissão de GTA"], situacao: "Ativo", observacao: "" };

export function ProfissionalAnimalDetalhePage({ dados, onLogout, onNavigate, mode }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; mode: "view" | "edit" }) {
  const { role, user } = useDemoUser();
  const acessoAoProprioCadastro = role === "veterinario" || role === "responsavel-agroindustria-integradora";
  const profissionalVinculado = acessoAoProprioCadastro ? obterProfissionalAnimal(user?.entityId) : null;
  const [profissional, setProfissional] = useState({ ...exemplo, ...(profissionalVinculado ?? dados) });
  const [salvo, setSalvo] = useState(false);
  const [activeTab, setActiveTab] = useState("cadastro");
  const [modalResponsabilidadeAberto, setModalResponsabilidadeAberto] = useState(false);
  const [modalHabilitacaoAberto, setModalHabilitacaoAberto] = useState(false);
  const visualizacao = mode === "view";
  const alterar = (campo: string, valor: any) => setProfissional((atual) => ({ ...atual, [campo]: valor }));
  const tabs = [
    { id: "cadastro", label: "Cadastro", icon: (isActive: boolean) => <FileText size={18} className={isActive ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "responsabilidades", label: "Responsabilidades Técnicas", icon: (isActive: boolean) => <img src={Icons.iconeFormularioUrl} alt="Responsabilidades Técnicas" className={`h-[18px] w-[18px] object-contain ${isActive ? "opacity-100" : "grayscale opacity-50"}`} /> },
    { id: "habilitacoes", label: "Habilitações", icon: (isActive: boolean) => <img src={Icons.iconeHabilitacaoUrl} alt="Habilitações" className={`h-[18px] w-[18px] object-contain ${isActive ? "opacity-100" : "grayscale opacity-50"}`} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-animal" hideSearch />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("profissional-animal")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />{acessoAoProprioCadastro ? "Profissional da Área Animal" : "Todos os Profissionais da Área Animal"}</button>
          <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">{visualizacao ? "Visualizar" : "Editar"} Profissional da Área Animal</h1>{activeTab === "responsabilidades" ? <button type="button" onClick={() => setModalResponsabilidadeAberto(true)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Adicionar Responsabilidade Técnica</button> : activeTab === "habilitacoes" ? <button type="button" onClick={() => setModalHabilitacaoAberto(true)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Adicionar Habilitação</button> : visualizacao ? <button type="button" onClick={() => onNavigate("editar-profissional-area-animal", profissional)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Editar</button> : <button type="button" onClick={() => setSalvo(true)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Salvar</button>}</div>
        </div>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "cadastro" && <>
          {!visualizacao && <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><Info size={20} className="text-gray-500" /><p className="text-sm text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.</p></div>}
          <Section title="Informações Básicas"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Nome" required value={profissional.nome} disabled={visualizacao} onChange={(nome) => alterar("nome", nome)} /><FloatInput label="CPF" required value={profissional.cpf} disabled={visualizacao} onChange={(cpf) => alterar("cpf", cpf)} /><FloatInput label="Serviço Oficial?" value={profissional.servicoOficial} disabled onChange={() => {}} /><FloatSelect label="Situação" required value={profissional.situacao} disabled={visualizacao} onChange={(situacao) => alterar("situacao", situacao)} options={SITUACOES} /></div></Section>
          <Section title="Informações Profissionais"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatSelect label="Formação Profissional" required value={profissional.formacao} disabled={visualizacao} onChange={(formacao) => alterar("formacao", formacao)} options={FORMACOES} /><FloatInput label="Número do Conselho" required value={profissional.numeroConselho} disabled={visualizacao} onChange={(numeroConselho) => alterar("numeroConselho", numeroConselho)} /><FloatSelect label="Cadastrado para Vacinação Contra Brucelose?" value={profissional.vacinacaoBrucelose} disabled={visualizacao} onChange={(vacinacaoBrucelose) => alterar("vacinacaoBrucelose", vacinacaoBrucelose)} options={SIM_NAO} /><FloatMultiSelect label="Habilitações" value={profissional.habilitacoes} onChange={(habilitacoes) => !visualizacao && alterar("habilitacoes", habilitacoes)} options={HABILITACOES} /></div></Section>
          <Section title="Observações"><LargeTextArea label="Observação" value={profissional.observacao ?? ""} disabled={visualizacao} onChange={(observacao) => alterar("observacao", observacao)} /></Section>
        </>}

        {activeTab === "responsabilidades" && <ResponsabilidadesTecnicasTab cpf={profissional.cpf} />}
        {activeTab === "habilitacoes" && <HabilitacoesProfissionalAnimalTab />}
      </main>
      {salvo && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" /></div><h2 className="text-lg font-bold text-gray-900">Alterações salvas com sucesso!</h2><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => onNavigate("profissional-animal")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-profissional-area-animal", profissional)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Visualizar</button></div></div></div>}
      <ResponsabilidadeTecnicaModal open={modalResponsabilidadeAberto} onClose={() => setModalResponsabilidadeAberto(false)} />
      <HabilitacaoProfissionalAnimalModal open={modalHabilitacaoAberto} onClose={() => setModalHabilitacaoAberto(false)} />
    </div>
  );
}

export function VisualizarProfissionalAnimalPage(props: Omit<Parameters<typeof ProfissionalAnimalDetalhePage>[0], "mode">) { return <ProfissionalAnimalDetalhePage {...props} mode="view" />; }
export function EditarProfissionalAnimalPage(props: Omit<Parameters<typeof ProfissionalAnimalDetalhePage>[0], "mode">) { return <ProfissionalAnimalDetalhePage {...props} mode="edit" />; }
