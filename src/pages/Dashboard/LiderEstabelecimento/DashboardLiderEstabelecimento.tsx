import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoLiderEstabelecimentoExemploUrl from "../../../imports/images/perfil-estabelecimento-exemplo.png";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardPerfilPadrao } from "../shared/DashboardPerfilPadrao";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
import { PendenciasResumo } from "../shared/PendenciasResumo";
import type { MenuCategory } from "../shared/dashboardTypes";
import { useMockDatabaseRevision } from "../../../mocks/useMockDatabase";
import { obterPessoaFisica } from "../../Geral/PessoaFisica/pessoaFisicaData";
import { listarEstabelecimentosDoLider } from "./liderEstabelecimentoData";
import { listarPendenciasCentrais } from "../../GTA/PendenciasConfirmacao/pendenciasCentralData";

interface DashboardLiderEstabelecimentoProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	news: ReactNode;
}

export function DashboardLiderEstabelecimento({
	onLogout,
	onNavigate,
	categories,
	news,
}: DashboardLiderEstabelecimentoProps) {
	const databaseRevision = useMockDatabaseRevision();
	void databaseRevision;
	const { user } = useDemoUser();
	const pessoa = obterPessoaFisica(user?.pessoaFisicaId);
	const estabelecimentosVinculados = listarEstabelecimentosDoLider("lider-estabelecimento");
	const pendencias = listarPendenciasCentrais("lider-estabelecimento");

	return (
		<DashboardPerfilPadrao
			onLogout={onLogout}
			onNavigate={onNavigate}
			userName={user?.name ?? "líder de estabelecimento"}
			description="Consulte seus dados profissionais e gerencie os estabelecimentos vinculados."
			news={news}
			profile={
				<MeuPerfilCard
					name={user?.name ?? pessoa?.nome ?? "Líder de Estabelecimento"}
					roleLabel={user?.roleLabel ?? "Líder de Estabelecimento"}
					avatarSrc={user?.avatarDataUrl ?? fotoLiderEstabelecimentoExemploUrl}
					details={[
						{ id: "documento", label: "CPF", value: pessoa?.cpf || "Não informado" },
						{ id: "vinculos", label: "Estabelecimentos", value: estabelecimentosVinculados.length },
					]}
				/>
			}
			linkedContent={
				<CadastrosVinculados
					items={estabelecimentosVinculados.map((estabelecimento) => ({
						id: estabelecimento.id,
						title: estabelecimento.nomeComercial,
						icon: <Building2 size={19} />,
						details: [
							{ id: "codigo", label: "Código do estabelecimento", value: estabelecimento.codigo },
							{ id: "sie", label: "Registro no SIE/MG", value: estabelecimento.registroSie },
						],
						onView: () => onNavigate("visualizar-estabelecimento-poa", { id: estabelecimento.id, ...estabelecimento }),
					}))}
					onViewAll={() => onNavigate("agroindustrial-sie")}
				/>
			}
			pendingContent={
				<PendenciasResumo
					items={pendencias.map((pendencia) => ({
						id: String(pendencia.id),
						title: pendencia.titulo || "Pendência de estabelecimento",
						description: pendencia.descricao || "Solicitação que precisa da sua atenção",
						icon: <Building2 size={18} />,
						actionLabel: "Resolver pendência",
						onAction: () => onNavigate("pendencias-confirmacao-gta"),
					}))}
					onViewAll={() => onNavigate("pendencias-confirmacao-gta")}
				/>
			}
			categories={categories}
		/>
	);
}
