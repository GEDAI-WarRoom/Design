import type { ReactNode } from "react";
import { Building2, Clock3, FileCheck2, Store } from "lucide-react";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import fotoVeterinariaExemploUrl from "../../../imports/images/perfil-veterinaria-exemplo.png";
import * as Icons from "../../../imports/icons";
import { obterProfissionalAnimal } from "../../Animal/ProfissionalAnimal/profissionalAnimalData";
import { CadastrosVinculados } from "../shared/CadastrosVinculados";
import { DashboardPerfilPadrao } from "../shared/DashboardPerfilPadrao";
import { MeuPerfilCard } from "../shared/MeuPerfilCard";
import { PendenciasResumo } from "../shared/PendenciasResumo";
import type { MenuCategory } from "../shared/dashboardTypes";

interface DashboardVeterinarioProps {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	categories: MenuCategory[];
	news: ReactNode;
}

const pendenciasVeterinario = [
	{
		id: "atualizacao-habilitacao",
		title: "Atualização de habilitação",
		description: "Documentação aguardando análise",
		icon: <FileCheck2 size={18} />,
	},
	{
		id: "atestado-exame",
		title: "Atestado de exame",
		description: "Rascunho não finalizado",
		icon: <Clock3 size={18} />,
	},
	{
		id: "vinculo-profissional",
		title: "Vínculo profissional",
		description: "Confirmação solicitada pela revendedora",
		icon: <Building2 size={18} />,
	},
	{
		id: "renovacao-responsabilidade",
		title: "Renovação de responsabilidade",
		description: "Prazo de renovação se aproxima",
		icon: <FileCheck2 size={18} />,
	},
];

const vinculosVeterinario = [
	{
		id: "vale-verde",
		title: "Revendedora Agropecuária Vale Verde",
		owner: "Agropecuária Vale Verde Ltda.",
		location: "Uberaba - MG",
		route: "revendedora-agropecuario",
		icon: <Store size={19} />,
		status: "Ativo",
	},
	{
		id: "unidade-sao-jose",
		title: "Unidade de Consolidação São José",
		owner: "Carlos Eduardo Souza",
		location: "Patos de Minas - MG",
		route: "unidade-consolidacao",
		icon: <Building2 size={19} />,
		status: "Ativo",
	},
	{
		id: "minas-animal",
		title: "Revendedora Minas Animal",
		owner: "Minas Animal Comércio Ltda.",
		location: "Belo Horizonte - MG",
		route: "revendedora-agropecuario",
		icon: <Store size={19} />,
		status: "Ativo",
	},
	{
		id: "agroindustrial-horizonte",
		title: "Estabelecimento Agroindustrial Horizonte",
		owner: "Horizonte Alimentos S.A.",
		location: "Contagem - MG",
		route: "agroindustrial-pov",
		icon: <img src={Icons.iconeEstabelecimentoAgroindustrialUrl} alt="" className="h-5 w-5 object-contain" />,
		status: "Pendente",
	},
	{
		id: "clinica-sao-lucas",
		title: "Clínica Veterinária São Lucas",
		owner: "José Lucas Ferreira",
		location: "Uberlândia - MG",
		route: "unidade-consolidacao",
		icon: <Building2 size={19} />,
		status: "Ativo",
	},
	{
		id: "vigilancia-animal-central",
		title: "Unidade de Vigilância Animal Central",
		owner: "Prefeitura Municipal",
		location: "Araxá - MG",
		route: "unidade-consolidacao",
		icon: <Building2 size={19} />,
		status: "Ativo",
	},
	{
		id: "campo-forte",
		title: "Revendedora Campo Forte",
		owner: "Campo Forte Produtos Ltda.",
		location: "Lavras - MG",
		route: "revendedora-agropecuario",
		icon: <Store size={19} />,
		status: "Ativo",
	},
];

export function DashboardVeterinario({
	onLogout,
	onNavigate,
	categories,
	news,
}: DashboardVeterinarioProps) {
	const { user } = useDemoUser();
	const profissional = obterProfissionalAnimal(user?.entityId);
	const vinculosAtivos = vinculosVeterinario.filter((vinculo) => vinculo.status === "Ativo");

	const profile = profissional ? (
		<MeuPerfilCard
			name={profissional.nome}
			roleLabel={profissional.formacao}
			avatarSrc={fotoVeterinariaExemploUrl}
			avatarAlt={profissional.nome}
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
						title: vinculo.title,
						icon: vinculo.icon,
						details: [
							{ id: "proprietario", label: "Proprietário", value: vinculo.owner },
							{ id: "localizacao", label: "Localização", value: vinculo.location },
						],
						onView: () => onNavigate(vinculo.route, vinculo),
					}))}
					count={vinculosAtivos.length}
					onViewAll={() => onNavigate("profissional-animal")}
				/>
			}
			pendingContent={
				<PendenciasResumo
					items={pendenciasVeterinario.map((pendencia) => ({
						...pendencia,
						onAction: () => onNavigate("pendencias-confirmacao-gta", { aba: "gta" }),
					}))}
					onViewAll={() => onNavigate("pendencias-confirmacao-gta", { aba: "gta" })}
				/>
			}
			categories={categories}
		/>
	);
}
