import { useState, type ReactNode } from "react";
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

const estabelecimentosVinculados = [
	{
		id: "frigorifico-sao-jose",
		nome: "Frigorífico São José",
		codigo: "3100000001",
		registroSie: "17126",
		situacao: "Ativo",
	},
	{
		id: "unidade-industrial-ii",
		nome: "Unidade Industrial II",
		codigo: "3100000002",
		registroSie: "17127",
		situacao: "Ativo",
	},
	{
		id: "centro-distribuicao",
		nome: "Centro de Distribuição",
		codigo: "3100000003",
		registroSie: "17128",
		situacao: "Ativo",
	},
	{
		id: "unidade-beneficiamento",
		nome: "Unidade de Beneficiamento",
		codigo: "3100000004",
		registroSie: "17129",
		situacao: "Ativo",
	},
	{
		id: "entreposto-regional",
		nome: "Entreposto Regional",
		codigo: "3100000005",
		registroSie: "17130",
		situacao: "Ativo",
	},
	{
		id: "unidade-abate",
		nome: "Unidade de Abate",
		codigo: "3100000006",
		registroSie: "17131",
		situacao: "Ativo",
	},
	{
		id: "centro-logistico",
		nome: "Centro Logístico",
		codigo: "3100000007",
		registroSie: "17132",
		situacao: "Ativo",
	},
	{
		id: "fabrica-produtos-carneos",
		nome: "Fábrica de Produtos Cárneos",
		codigo: "3100000008",
		registroSie: "17133",
		situacao: "Ativo",
	},
	{
		id: "unidade-armazenamento",
		nome: "Unidade de Armazenamento",
		codigo: "3100000009",
		registroSie: "17134",
		situacao: "Ativo",
	},
	{
		id: "posto-distribuicao",
		nome: "Posto de Distribuição",
		codigo: "3100000010",
		registroSie: "17135",
		situacao: "Ativo",
	},
] as const;

export function DashboardLiderEstabelecimento({
	onLogout,
	onNavigate,
	categories,
	newsFeed,
}: DashboardLiderEstabelecimentoProps) {
	const { user } = useDemoUser();
	const [estabelecimentoAtivoId, setEstabelecimentoAtivoId] = useState(
		estabelecimentosVinculados[0].id,
	);
	const estabelecimentoAtivo =
		estabelecimentosVinculados.find(
			(estabelecimento) => estabelecimento.id === estabelecimentoAtivoId,
		) ?? estabelecimentosVinculados[0];

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
						Consulte seus dados profissionais e gerencie os estabelecimentos vinculados.
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
							showActiveIndicator={estabelecimentoAtivo.situacao === "Ativo"}
							tabs={estabelecimentosVinculados.map((estabelecimento) => ({
								id: estabelecimento.id,
								label: estabelecimento.nome,
							}))}
							activeTabId={estabelecimentoAtivo.id}
							onTabChange={setEstabelecimentoAtivoId}
							tabsAriaLabel="Estabelecimentos vinculados"
							maxVisibleTabs={3}
							details={[
								{
									label: "Estabelecimento vinculado",
									value: estabelecimentoAtivo.nome,
								},
								{
									label: "Código do estabelecimento",
									value: estabelecimentoAtivo.codigo,
								},
								{
									label: "Registro no SIE/MG",
									value: estabelecimentoAtivo.registroSie,
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
