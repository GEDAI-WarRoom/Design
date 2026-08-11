import type { ReactNode } from "react";
import { Building2, Clock3, FileCheck2, Store } from "lucide-react";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoVeterinariaExemploUrl from "../../../imports/images/perfil-veterinaria-exemplo.png";
import { obterProfissionalAnimal } from "../../Animal/ProfissionalAnimal/profissionalAnimalData";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardPerfilPadrao } from "../shared/DashboardPerfilPadrao";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
import { PendenciasResumo } from "../shared/PendenciasResumo";
import type { MenuCategory } from "../shared/dashboardTypes";
import { useMockDatabaseRevision } from "../../../mocks/useMockDatabase";
import { listarPendenciasCentrais } from "../../GTA/PendenciasConfirmacao/pendenciasCentralData";
import { getRevendedoras } from "../../Geral/RevendedoraAgropecuaria/revendedoraData";

interface DashboardVeterinarioProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	news: ReactNode;
}

const textoPadraoPendencia: Record<string, { titulo: string; descricao: string }> = {
	"habilitacao": { titulo: "Atualização de habilitação", descricao: "Documentação aguardando análise" },
	"atestado-exame": { titulo: "Atestado de exame", descricao: "Rascunho não finalizado" },
	"vinculo-profissional": { titulo: "Vínculo profissional", descricao: "Confirmação solicitada pela revendedora" },
	"renovacao-responsabilidade": { titulo: "Renovação de responsabilidade", descricao: "Prazo de renovação se aproxima" },
};

export function DashboardVeterinario({
	onLogout,
	onNavigate,
	categories,
	news,
}: DashboardVeterinarioProps) {
	const databaseRevision = useMockDatabaseRevision();
	void databaseRevision;
	const { user } = useDemoUser();
	const profissional = obterProfissionalAnimal(user?.entityId);
	const pendencias = listarPendenciasCentrais("veterinario", user?.entityId);
	const revendedoras = getRevendedoras();
	const vinculosAtivos = revendedoras.filter((revendedora) =>
		revendedora.situacao === "Ativo" &&
		revendedora.profissionais.some(
			(item) => item.documento === profissional?.cpf && item.situacao === "Ativo",
		),
	);

	const profile = profissional ? (
		<MeuPerfilCard
			name={user?.name ?? profissional.nome}
			roleLabel={user?.roleLabel ?? profissional.formacao}
			avatarSrc={user?.avatarDataUrl ?? fotoVeterinariaExemploUrl}
			avatarAlt={user?.name ?? profissional.nome}
			details={[
				{ id: "crmv", label: "CRMV-MG", value: profissional.numeroConselho },
				{ id: "registro", label: "Registro", value: profissional.tipoRegistroConselho || "Não informado" },
				{ id: "servico-oficial", label: "Serviço Oficial", value: profissional.servicoOficial },
			]}
			highlights={profissional.habilitacoes.map((label) => ({ id: label, label }))}
		/>
	) : (
		<section className="rounded-xl border border-green-100 bg-white p-6 text-sm text-gray-500 shadow-sm" aria-label="Meu perfil">
			Não foi possível localizar o cadastro profissional vinculado a este acesso.
		</section>
	);

	return (
		<DashboardPerfilPadrao
			onLogout={onLogout}
			onNavigate={onNavigate}
			userName={user?.name ?? "profissional"}
			description="Acompanhe seus dados profissionais e acesse suas atividades habilitadas."
			news={news}
			profile={profile}
			linkedContent={
				<CadastrosVinculados
					items={vinculosAtivos.map((vinculo) => ({
						id: vinculo.id,
						title: vinculo.nome,
						icon: <Store size={19} />,
						details: [
							{ id: "proprietario", label: "Proprietário", value: vinculo.proprietarios.join(", ") || "Não informado" },
							{ id: "localizacao", label: "Localização", value: `${vinculo.municipio} - ${vinculo.uf}` },
						],
						onView: () => onNavigate("visualizar-revendedora-agropecuario", { id: vinculo.id }),
					}))}
					count={vinculosAtivos.length}
					onViewAll={() => onNavigate("visualizar-revendedora-agropecuario", { id: vinculosAtivos[0]?.id ?? 1 })}
				/>
			}
			pendingContent={
				<PendenciasResumo
					items={pendencias.map((pendencia) => ({
						...pendencia,
						title: pendencia.titulo || textoPadraoPendencia[pendencia.tipo]?.titulo || "Pendência de confirmação",
						description: pendencia.descricao || textoPadraoPendencia[pendencia.tipo]?.descricao || "Solicitação que precisa da sua atenção",
						icon:
							pendencia.tipo === "atestado-exame" ? <Clock3 size={18} /> :
							pendencia.tipo === "vinculo-profissional" ? <Building2 size={18} /> :
							<FileCheck2 size={18} />,
						onAction: () => onNavigate("pendencias-confirmacao-gta"),
					}))}
					onViewAll={() => onNavigate("pendencias-confirmacao-gta")}
				/>
			}
			categories={categories}
		/>
	);
}
