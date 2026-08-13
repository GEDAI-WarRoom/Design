import type { ReactNode } from "react";
import { Building2, CreditCard } from "lucide-react";
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
	const email = pessoa?.contatos.find((contato) => contato.tipo === "E-mail")?.valor ?? user?.email ?? "Não informado";
	const telefone = pessoa?.contatos.find((contato) => contato.tipo === "Telefone")?.valor ?? user?.phone ?? "Não informado";
	const estabelecimentosVinculados = listarEstabelecimentosDoLider("lider-estabelecimento");
	const pendencias = listarPendenciasCentrais("lider-estabelecimento");
	const detalhesPendencia = {
		"vinculo-profissional": ["Estabelecimento: Frigorífico São José", "Solicitado em: 12/08/2026"],
		boleto: ["Referência: Julho/2026", "Valor: R$ 1.284,50"],
	};
	const acaoPendencia = {
		"vinculo-profissional": "Confirmar vínculo",
		boleto: "Ver boletos",
	};

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
						{ id: "documento", label: "CPF/CNPJ", value: pessoa?.cpf || user?.document || "Não informado" },
						{ id: "email", label: "E-mail", value: email },
						{ id: "telefone", label: "Telefone", value: telefone },
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
					title="Central de Pendências"
					items={pendencias.map((pendencia) => ({
							id: String(pendencia.id),
							title: pendencia.titulo || "Pendência de estabelecimento",
							description: pendencia.descricao || "Solicitação que precisa da sua atenção",
							icon: pendencia.tipo === "boleto" ? <CreditCard size={18} /> : <Building2 size={18} />,
							details: detalhesPendencia[pendencia.tipo],
							actionLabel: acaoPendencia[pendencia.tipo],
							onAction: () => onNavigate("pendencias-confirmacao-gta"),
						}))}
					onViewAll={() => onNavigate("pendencias-confirmacao-gta")}
				/>
			}
			categories={categories}
		/>
	);
}
