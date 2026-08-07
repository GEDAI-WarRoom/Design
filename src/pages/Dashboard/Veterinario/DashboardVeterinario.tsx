import type { ReactNode } from "react";
import { Building2, ClipboardCheck, Clock3, FileCheck2, Store } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoVeterinariaExemploUrl from "../../../imports/images/perfil-veterinaria-exemplo.png";
import * as Icons from "../../../imports/icons";
import { obterProfissionalAnimal } from "../../Animal/ProfissionalAnimal/profissionalAnimalData";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardVeterinarioProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  categories: MenuCategory[];
  newsFeed: ReactNode;
}

const pendenciasVeterinario = [
  { titulo: "Atualização de habilitação", descricao: "Documentação aguardando análise", icone: FileCheck2 },
  { titulo: "Atestado de exame", descricao: "Rascunho não finalizado", icone: Clock3 },
  { titulo: "Vínculo profissional", descricao: "Confirmação solicitada pela revendedora", icone: Building2 },
  { titulo: "Renovação de responsabilidade", descricao: "Prazo de renovação se aproxima", icone: FileCheck2 },
];
const vinculosVeterinario = [
  { titulo: "Revendedora Agropecuária Vale Verde", descricao: "Responsável técnico", proprietario: "Agropecuária Vale Verde Ltda.", localizacao: "Uberaba - MG", status: "Ativo" },
  { titulo: "Unidade de Consolidação São José", descricao: "Responsável técnico", proprietario: "Carlos Eduardo Souza", localizacao: "Patos de Minas - MG", status: "Ativo" },
  { titulo: "Revendedora Minas Animal", descricao: "Responsável técnico substituto", proprietario: "Minas Animal Comércio Ltda.", localizacao: "Belo Horizonte - MG", status: "Ativo" },
  { titulo: "Estabelecimento Agroindustrial Horizonte", descricao: "Responsável técnico", proprietario: "Horizonte Alimentos S.A.", localizacao: "Contagem - MG", status: "Pendente" },
  { titulo: "Clínica Veterinária São Lucas", descricao: "Responsável técnico", proprietario: "José Lucas Ferreira", localizacao: "Uberlândia - MG", status: "Ativo" },
  { titulo: "Unidade de Vigilância Animal Central", descricao: "Responsável técnico", proprietario: "Prefeitura Municipal", localizacao: "Araxá - MG", status: "Ativo" },
  { titulo: "Revendedora Campo Forte", descricao: "Responsável técnico", proprietario: "Campo Forte Produtos Ltda.", localizacao: "Lavras - MG", status: "Ativo" },
];

export function DashboardVeterinario({
  onLogout,
  onNavigate,
  categories,
  newsFeed,
}: DashboardVeterinarioProps) {
  const { user } = useDemoUser();
  const profissional = obterProfissionalAnimal(user?.entityId);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="dashboard"
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Bem-vinda, {user?.name ?? "profissional"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Acompanhe seus dados profissionais e acesse suas atividades habilitadas.
          </p>
        </div>

        {newsFeed}

        <div className="mb-6">
          {profissional ? (
            <div className="grid grid-cols-1 gap-5 lg:items-stretch lg:grid-cols-[280px_1fr]">
            <section className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Meu perfil">
              <div className="flex items-center justify-between border-b border-gray-100 bg-[#f7f8ff] px-5 py-4"><h2 className="text-sm font-semibold text-gray-900">Meu perfil</h2><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">● Ativo</span></div>
              <div className="p-5 text-center"><img src={fotoVeterinariaExemploUrl} alt={profissional.nome} className="mx-auto h-16 w-16 rounded-full object-cover ring-4 ring-blue-50" /><h3 className="mt-3 text-base font-semibold text-gray-900">{profissional.nome}</h3><p className="text-xs text-gray-600">{profissional.formacao}</p><div className="mt-5 text-left text-xs">{[["CRMV-MG", profissional.numeroConselho], ["Registro", profissional.tipoRegistroConselho || "Não informado"], ["Serviço Oficial", profissional.servicoOficial]].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-gray-100 py-2.5"><span className="text-gray-500">{label}</span><span className="font-semibold text-gray-800">{value}</span></div>)}</div><div className="mt-5 border-t border-gray-100 pt-4 text-left"><h2 className="text-xs font-semibold text-gray-700">Habilitações vigentes</h2><div className="mt-3 flex flex-col gap-2">{profissional.habilitacoes.map((habilitacao) => <div key={habilitacao} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-gray-800"><ClipboardCheck size={14} className="text-[#1A7A3C]" />{habilitacao}</div>)}</div></div></div>
            </section>
            <div className="flex flex-col gap-5">
            <section className="h-full rounded-xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between border-b border-gray-100 pb-3"><div className="flex items-center gap-3"><h2 className="text-base font-semibold text-gray-800">Cadastros vinculados</h2><span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-[#1A7A3C]">{vinculosVeterinario.filter((vinculo) => vinculo.status === "Ativo").length}</span></div><button type="button" onClick={() => onNavigate("profissional-animal")} className="text-sm font-semibold text-[#1A7A3C]">Ver todos →</button></div><div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">{vinculosVeterinario.filter((vinculo) => vinculo.status === "Ativo").slice(0, 4).map((vinculo) => <article key={vinculo.titulo} className="group min-h-[205px] rounded-xl border border-gray-200 p-4 transition duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-md"><div className="flex items-center gap-3"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAF4ED] text-[#1A7A3C] transition group-hover:scale-105">{vinculo.titulo.toLowerCase().includes("revendedora") ? <Store size={19} /> : vinculo.titulo.toLowerCase().includes("agroindustrial") ? <img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="" className="h-5 w-5 object-contain" /> : <Building2 size={19} />}</span><h3 className="text-sm font-semibold text-gray-900">{vinculo.titulo}</h3></div><div className="mt-4 space-y-2"><div><p className="text-xs font-semibold text-gray-400">Proprietário</p><p className="mt-0.5 text-sm font-medium text-gray-600">{vinculo.proprietario}</p></div><div><p className="text-xs font-semibold text-gray-400">Localização</p><p className="mt-0.5 text-sm font-medium text-gray-600">{vinculo.localizacao}</p></div></div><button type="button" onClick={() => onNavigate(vinculo.titulo.toLowerCase().includes("revendedora") ? "revendedora-agropecuario" : vinculo.titulo.toLowerCase().includes("agroindustrial") ? "agroindustrial-pov" : "unidade-consolidacao", vinculo)} className="mt-4 block w-full text-right text-sm font-semibold text-[#1A7A3C] opacity-80 transition group-hover:opacity-100">Visualizar</button></article>)}</div></section>
            </div>
            </div>
          ) : (
            <section
              className="w-full rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm"
              aria-label="Perfil profissional"
            >
              Não foi possível localizar o cadastro profissional vinculado a este acesso.
            </section>
          )}
        </div>

        <div className="flex flex-col">
        <section className="order-2 mb-6 rounded-xl bg-white p-6 shadow-sm" aria-label="Pendências de confirmação">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3"><h2 className="text-base font-semibold text-gray-800">Pendências de Confirmação</h2><span className="rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">{pendenciasVeterinario.length}</span></div>
            <button type="button" onClick={() => onNavigate("pendencias-confirmacao-gta", { aba: "gta" })} className="text-sm font-semibold text-[#1A7A3C] hover:text-[#15612F]">Ver todas →</button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {pendenciasVeterinario.slice(0, 3).map((pendencia) => { const Icone = pendencia.icone; return <article key={pendencia.titulo} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="flex items-center gap-3 p-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#1A7A3C]"><Icone size={18} /></span><div><h3 className="text-sm font-semibold text-gray-900">{pendencia.titulo}</h3><p className="mt-1 text-xs text-gray-500">{pendencia.descricao}</p></div></div><button type="button" className="mt-auto h-10 bg-[#1A7A3C] text-sm font-semibold text-white hover:bg-[#15612F]">Ver detalhes</button></article>; })}
          </div>
        </section>

        </div>

        <DashboardMenu
          title="Área de trabalho"
          categoryGroups={[categories]}
          onNavigate={onNavigate}
        />
      </main>
    </div>
  );
}
