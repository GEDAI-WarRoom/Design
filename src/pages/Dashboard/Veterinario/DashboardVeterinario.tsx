import type { ReactNode } from "react";
import { ClipboardCheck, Syringe, Truck } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { ProfileCard } from "../../../components/ProfileCard";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoVeterinariaExemploUrl from "../../../imports/images/perfil-veterinaria-exemplo.png";
import { obterProfissionalAnimal } from "../../Animal/ProfissionalAnimal/profissionalAnimalData";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardVeterinarioProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  categories: MenuCategory[];
  newsFeed: ReactNode;
}

const atalhos = [
  {
    titulo: "Emissão de GTA",
    descricao: "Guia de Trânsito Animal",
    rota: "adicionar-emissao-gta",
    icone: Truck,
    destaque: true,
  },
  {
    titulo: "Nova Vacinação",
    descricao: "Declaração de Vacinação",
    rota: "adicionar-declaracao-vacinacao",
    icone: Syringe,
    destaque: false,
  },
  {
    titulo: "Novo Atestado",
    descricao: "Atestado de Exame",
    rota: "adicionar-atestado-exame",
    icone: ClipboardCheck,
    destaque: false,
  },
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
            <ProfileCard
              name={profissional.nome}
              subtitle={profissional.formacao}
              avatarSrc={fotoVeterinariaExemploUrl}
              showActiveIndicator={profissional.situacao === "Ativo"}
              details={[
                { label: "CRMV-MG", value: profissional.numeroConselho },
                {
                  label: "Tipo de registro",
                  value: profissional.tipoRegistroConselho || "Não informado",
                },
                { label: "Serviço oficial", value: profissional.servicoOficial },
              ]}
              highlights={profissional.habilitacoes}
              highlightsTitle="Habilitações vigentes"
              emptyHighlightsMessage="Nenhuma habilitação vigente."
              ariaLabel="Perfil profissional"
            />
          ) : (
            <section
              className="w-full rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm"
              aria-label="Perfil profissional"
            >
              Não foi possível localizar o cadastro profissional vinculado a este acesso.
            </section>
          )}
        </div>

        <section className="mb-6" aria-label="Atalhos">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {atalhos.map((atalho) => {
              const Icone = atalho.icone;

              return (
                <button
                  key={atalho.rota}
                  type="button"
                  onClick={() => onNavigate(atalho.rota)}
                  className={`group flex min-h-[96px] items-center justify-between gap-3 rounded-xl px-5 py-4 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] focus-visible:ring-offset-2 ${
                    atalho.destaque
                      ? "bg-[#1A7A3C] text-white shadow-sm hover:bg-[#15612F] hover:shadow-md"
                      : "bg-white text-[#1A7A3C] shadow-md hover:bg-green-50 hover:shadow-lg"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold leading-tight">{atalho.titulo}</span>
                    <span
                      className={`mt-1 block text-sm ${
                        atalho.destaque ? "text-green-50" : "text-gray-600"
                      }`}
                    >
                      {atalho.descricao}
                    </span>
                  </span>
                  <span
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${
                      atalho.destaque ? "bg-white/15" : "bg-[#EAF4EF]"
                    }`}
                    aria-hidden="true"
                  >
                    <Icone className="h-7 w-7" strokeWidth={2.25} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <DashboardMenu
          title="Área de trabalho"
          categoryGroups={[categories]}
          onNavigate={onNavigate}
        />
      </main>
    </div>
  );
}
