import type { ReactNode } from "react";
import { Building2, CreditCard } from "lucide-react";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoLiderEstabelecimentoExemploUrl from "../../../imports/images/perfil-estabelecimento-exemplo.png";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardPerfilPadrao } from "../shared/DashboardPerfilPadrao";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
import { PendenciasResumo } from "../shared/PendenciasResumo";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardLiderEstabelecimentoProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	news: ReactNode;
}

const estabelecimentosVinculados = [
	{ id: "frigorifico-sao-jose", nome: "Frigorífico São José", codigo: "3100000001", registroSie: "17126" },
	{ id: "unidade-industrial-ii", nome: "Unidade Industrial II", codigo: "3100000002", registroSie: "17127" },
	{ id: "centro-distribuicao", nome: "Centro de Distribuição", codigo: "3100000003", registroSie: "17128" },
	{ id: "unidade-beneficiamento", nome: "Unidade de Beneficiamento", codigo: "3100000004", registroSie: "17129" },
	{ id: "entreposto-regional", nome: "Entreposto Regional", codigo: "3100000005", registroSie: "17130" },
	{ id: "unidade-abate", nome: "Unidade de Abate", codigo: "3100000006", registroSie: "17131" },
];

export function DashboardLiderEstabelecimento({
	onLogout,
	onNavigate,
	categories,
	news,
}: DashboardLiderEstabelecimentoProps) {
	const { user } = useDemoUser();

	return (
		<DashboardPerfilPadrao
			onLogout={onLogout}
			onNavigate={onNavigate}
			userName={user?.name ?? "líder de estabelecimento"}
			description="Consulte seus dados profissionais e gerencie os estabelecimentos vinculados."
			news={news}
			profile={
				<MeuPerfilCard
					name={user?.name ?? "Líder de Estabelecimento"}
					roleLabel={user?.roleLabel ?? "Líder de Estabelecimento"}
					avatarSrc={user?.avatarDataUrl ?? fotoLiderEstabelecimentoExemploUrl}
					details={[
						{ id: "perfil", label: "Perfil", value: "Líder de estabelecimento" },
						{ id: "vinculos", label: "Estabelecimentos", value: estabelecimentosVinculados.length },
					]}
				/>
			}
			linkedContent={
				<CadastrosVinculados
					items={estabelecimentosVinculados.map((estabelecimento) => ({
						id: estabelecimento.id,
						title: estabelecimento.nome,
						icon: <Building2 size={19} />,
						details: [
							{ id: "codigo", label: "Código do estabelecimento", value: estabelecimento.codigo },
							{ id: "sie", label: "Registro no SIE/MG", value: estabelecimento.registroSie },
						],
						onView: () => onNavigate("agroindustrial-sie", estabelecimento),
					}))}
					onViewAll={() => onNavigate("agroindustrial-sie")}
				/>
			}
			pendingContent={
				<PendenciasResumo
					title="Pendências"
					items={[
						{
							id: "boleto-julho-pendente",
							title: "Pagamento de boleto pendente",
							description: "Integradora Vale do Campo · vencimento em 07/08/2026",
							icon: <CreditCard size={18} />,
							actionLabel: "Ver boletos",
							onAction: () => onNavigate("relatorio-boletos-gta"),
						},
					]}
				/>
			}
			categories={categories}
		/>
	);
}
