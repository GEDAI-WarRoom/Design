import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { PRODUTORES_ATUALIZACAO } from "../../Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardPerfilPadrao } from "../shared/DashboardPerfilPadrao";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
import type { LinkedRegistration } from "../shared/dashboardProfileTypes";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardProdutorProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	userName: string;
	news: ReactNode;
	pendingContent: ReactNode;
	afterMenu: ReactNode;
	linkedItems: LinkedRegistration[];
}

export function DashboardProdutor({
	onLogout,
	onNavigate,
	categories,
	userName,
	news,
	pendingContent,
	afterMenu,
	linkedItems,
}: DashboardProdutorProps) {
	const { user } = useDemoUser();
	const produtor = PRODUTORES_ATUALIZACAO.find(
		(registro) => registro.documento === user?.document,
	);
	const email = produtor?.contatos.find((contato) => contato.tipo === "E-mail");
	const telefone = produtor?.contatos.find((contato) => contato.tipo === "Telefone");

	const profile = produtor ? (
		<MeuPerfilCard
			name={produtor.nome}
			roleLabel={user?.roleLabel ?? "Produtor"}
			avatarFallback={<UserRound className="h-7 w-7" aria-hidden="true" />}
			details={[
				{ id: "cpf", label: "CPF", value: produtor.documento },
				...(email ? [{ id: "email", label: "E-mail", value: email.valor }] : []),
				...(telefone ? [{ id: "telefone", label: "Telefone", value: telefone.valor }] : []),
			]}
			highlights={[]}
			highlightsTitle="Habilitações vigentes"
			emptyHighlightsMessage="Nenhuma habilitação vigente."
		/>
	) : (
		<section className="rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm" aria-label="Meu perfil">
			Não foi possível localizar o cadastro do produtor vinculado a este acesso.
		</section>
	);

	return (
		<DashboardPerfilPadrao
			onLogout={onLogout}
			onNavigate={onNavigate}
			userName={userName}
			description="Gerencie suas propriedades e movimentações agropecuárias."
			news={news}
			profile={profile}
			linkedContent={<CadastrosVinculados items={linkedItems} />}
			pendingContent={pendingContent}
			categories={categories}
			afterMenu={afterMenu}
		/>
	);
}
