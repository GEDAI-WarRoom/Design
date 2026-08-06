import type { ReactNode } from "react";
import { ClipboardCheck, Syringe, Truck } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
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

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-0 py-3 sm:px-4 sm:py-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 break-words text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

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
          <section className="w-full overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm" aria-label="Perfil profissional">
            {profissional ? (
              <div className="px-5 py-4 md:px-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <div className="flex min-w-0 items-center gap-4 md:w-[280px] md:flex-shrink-0">
                    <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF2F1] ring-4 ring-gray-50">
                      <img
                        src={fotoVeterinariaExemploUrl}
                        alt={`Foto de ${profissional.nome}`}
                        className="h-full w-full rounded-full object-cover"
                      />
                      <span
                        className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22A447]"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-900">{profissional.nome}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{profissional.formacao}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Situação: <span className="font-semibold text-[#1A7A3C]">{profissional.situacao}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 flex-1 grid-cols-1 divide-y divide-gray-100 border-t border-gray-200 pt-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:border-l md:border-t-0 md:py-2 md:pl-1">
                    <InfoItem label="CRMV-MG" value={profissional.numeroConselho} />
                    <InfoItem
                      label="Tipo de registro"
                      value={profissional.tipoRegistroConselho || "Não informado"}
                    />
                    <InfoItem
                      label="Serviço oficial"
                      value={profissional.servicoOficial}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700">Habilitações vigentes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profissional.habilitacoes.length > 0 ? (
                      profissional.habilitacoes.map((habilitacao) => (
                        <span
                          key={habilitacao}
                          className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-gray-500"
                        >
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 flex-shrink-0 rounded-full bg-green-300"
                          />
                          {habilitacao}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Nenhuma habilitação vigente.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm text-gray-500">
                Não foi possível localizar o cadastro profissional vinculado a este acesso.
              </div>
            )}
          </section>
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
