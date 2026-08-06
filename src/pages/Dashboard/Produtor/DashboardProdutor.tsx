import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { ProfileCard } from "../../../components/ProfileCard";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { PRODUTORES_ATUALIZACAO } from "../../Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";
import { DashboardMenu } from "../shared/DashboardMenu";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardProdutorProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	userName: string;
	beforeMenu: ReactNode;
	afterMenu: ReactNode;
}

export function DashboardProdutor({
	onLogout,
	onNavigate,
	categories,
	userName,
	beforeMenu,
	afterMenu,
}: DashboardProdutorProps) {
	const { user } = useDemoUser();
	const produtor = PRODUTORES_ATUALIZACAO.find(
		(registro) => registro.documento === user?.document,
	);
	const email = produtor?.contatos.find((contato) => contato.tipo === "E-mail");
	const telefone = produtor?.contatos.find(
		(contato) => contato.tipo === "Telefone",
	);

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
						Bem-vindo, {userName}
					</h1>
					<p className="mt-1 text-sm text-gray-600">
						Gerencie suas propriedades e movimentações agropecuárias.
					</p>
				</div>
				<div className="mb-6">
					{produtor ? (
						<ProfileCard
							name={produtor.nome}
							subtitle={user?.roleLabel}
							avatarFallback={
								<UserRound className="h-7 w-7" aria-hidden="true" />
							}
							details={[
								{ label: "CPF", value: produtor.documento },
								...(email ? [{ label: "E-mail", value: email.valor }] : []),
								...(telefone
									? [{ label: "Telefone", value: telefone.valor }]
									: []),
							]}
							ariaLabel="Perfil do produtor"
						/>
					) : (
						<section
							className="w-full rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm"
							aria-label="Perfil do produtor"
						>
							Não foi possível localizar o cadastro do produtor vinculado a este acesso.
						</section>
					)}
				</div>
				{beforeMenu}
				<DashboardMenu categoryGroups={[categories]} onNavigate={onNavigate} />
				{afterMenu}
			</main>
		</div>
	);
}
