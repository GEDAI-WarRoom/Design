import { BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoAdministradorExemploUrl from "../../../imports/images/perfil-admin.exemplo.png";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardMenu } from "../shared/DashboardMenu";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
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
						<div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-stretch">
							<MeuPerfilCard
								name={user.name}
								roleLabel={user.roleLabel}
								avatarSrc={user.avatarDataUrl ?? fotoAdministradorExemploUrl}
								avatarAlt={`Foto de ${user.name}`}
								details={[
									{ id: "esfera", label: "Esfera do Serviço Oficial", value: "Estadual" },
									{ id: "masp", label: "MASP", value: "1017185-8" },
									{ id: "unidade-administrativa", label: "Unidade administrativa", value: "Coordenadoria Regional de Belo Horizonte" },
								]}
							/>
							<CadastrosVinculados
								title="Papéis"
								items={[
									{
										id: "administrador-sistema",
										title: "Administrador do Sistema",
										icon: <ShieldCheck size={19} />,
										details: [
											{ id: "papel", label: "Papel", value: "Administrativo" },
											{ id: "situacao", label: "Situação", value: "Ativo" },
										],
										onView: () => onNavigate("meu-perfil"),
									},
									{
										id: "profissional-servico-oficial",
										title: "Profissional do Serviço Oficial",
										icon: <BriefcaseBusiness size={19} />,
										details: [
											{ id: "unidade", label: "Unidade administrativa", value: "Coordenadoria Regional de Belo Horizonte" },
											{ id: "situacao", label: "Situação", value: "Ativo" },
										],
										onView: () => onNavigate("meu-perfil"),
									},
								]}
								onViewAll={() => onNavigate("meu-perfil")}
							/>
						</div>
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
					title="Área de trabalho"
				/>
			</main>
		</div>
	);
}
