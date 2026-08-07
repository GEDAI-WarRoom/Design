import { Navbar } from "../../../components/Navbar";
import { ProfileCard } from "../../../components/ProfileCard";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoAdministradorExemploUrl from "../../../imports/images/perfil-admin.exemplo.png";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardAdminProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categoryGroups: MenuCategory[][];
	controlCategories: MenuCategory[];
}

export function DashboardAdmin({
	onLogout,
	onNavigate,
	categoryGroups,
	controlCategories,
}: DashboardAdminProps) {
	const { user } = useDemoUser();

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
						Bem-vindo, {user?.name ?? "administrador"}
					</h1>
					<p className="mt-1 text-sm text-gray-600">
						Acesse seus dados de perfil e gerencie as funcionalidades do sistema.
					</p>
				</div>

				<div className="mb-6">
					{user ? (
						<ProfileCard
							name={user.name}
							subtitle={user.roleLabel}
							avatarSrc={user.avatarDataUrl ?? fotoAdministradorExemploUrl}
							avatarAlt={`Foto de ${user.name}`}
							showActiveIndicator
							details={[
								{ label: "Esfera do Serviço Oficial", value: "Estadual" },
								{ label: "MASP", value: "1017185-8" },
								{
									label: "Unidade administrativa",
									value: "Coordenadoria Regional de Belo Horizonte",
								},
							]}
							highlights={[
								"Administrador do Sistema",
								"Profissional do Serviço Oficial",
							]}
							highlightsTitle="Papéis"
							emptyHighlightsMessage="Nenhum papel atribuído."
							ariaLabel="Perfil do administrador"
						/>
					) : (
						<section
							className="w-full rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm"
							aria-label="Perfil do administrador"
						>
							Não foi possível localizar o perfil vinculado a este acesso.
						</section>
					)}
				</div>

				<DashboardMenu
					categoryGroups={categoryGroups}
					controlCategories={controlCategories}
					onNavigate={onNavigate}
				/>
			</main>
		</div>
	);
}
