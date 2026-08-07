import type { ReactNode } from "react";
import { Navbar } from "../../../components/Navbar";
import { ProfileCard } from "../../../components/ProfileCard";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoLiderEstabelecimentoExemploUrl from "../../../imports/images/perfil-estabelecimento-exemplo.png";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardLiderEstabelecimentoProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	newsFeed: ReactNode;
}

const estabelecimentoVinculado = {
	nome: "Frigorífico São José",
	codigo: "3100000001",
	registroSie: "17126",
	situacao: "Ativo",
};

export function DashboardLiderEstabelecimento({
	onLogout,
	onNavigate,
	categories,
	newsFeed,
}: DashboardLiderEstabelecimentoProps) {
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
						Bem-vinda, {user?.name ?? "líder de estabelecimento"}
					</h1>
					<p className="mt-1 text-sm text-gray-600">
						Consulte seus dados profissionais e gerencie o estabelecimento vinculado.
					</p>
				</div>

				{newsFeed}

				<div className="mb-6">
					{user ? (
						<ProfileCard
							name={user.name}
							subtitle={user.roleLabel}
							avatarSrc={fotoLiderEstabelecimentoExemploUrl}
							avatarAlt={`Foto de ${user.name}`}
							showActiveIndicator={estabelecimentoVinculado.situacao === "Ativo"}
							details={[
								{
									label: "Estabelecimento vinculado",
									value: estabelecimentoVinculado.nome,
								},
								{
									label: "Código do estabelecimento",
									value: estabelecimentoVinculado.codigo,
								},
								{
									label: "Registro no SIE/MG",
									value: estabelecimentoVinculado.registroSie,
								},
							]}
							ariaLabel="Perfil profissional"
						/>
					) : (
						<section
							className="w-full rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm"
							aria-label="Perfil profissional"
						>
							Não foi possível localizar o perfil vinculado a este acesso.
						</section>
					)}
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
