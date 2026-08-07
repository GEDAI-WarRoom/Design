import {
	ArrowLeft,
	ChevronRight,
	Factory,
	RotateCcw,
	ShieldCheck,
	Stethoscope,
	Tractor,
} from "lucide-react";
import logo from "../imports/logo.png";
import type { DemoUserRole } from "../contexts/DemoUserContext";
import { restaurarDadosDemonstracao } from "../mocks/mockDatabase";

const GREEN = "#1A7A3C";

interface SelecionarUsuarioProps {
	onSelect: (role: DemoUserRole) => void;
	onBack: () => void;
}

const perfis = [
	{
		role: "admin" as const,
		title: "Administrador",
		description: "Acesso completo a todos os cadastros e funcionalidades do sistema.",
		icon: ShieldCheck,
	},
	{
		role: "produtor" as const,
		title: "Produtor",
		description: "Acesso aos cadastros do produtor e à emissão de GTA.",
		icon: Tractor,
	},
	{
		role: "veterinario" as const,
		title: "Médico Veterinário",
		description: "Acesso às atividades profissionais, exames, vacinação e emissão habilitada.",
		icon: Stethoscope,
	},
	{
		role: "lider-estabelecimento" as const,
		title: "Líder de Estabelecimento",
		description: "Acesso aos cadastros de pessoas e ao estabelecimento agroindustrial vinculado.",
		icon: Factory,
	},
];

export function SelecionarUsuarioPage({ onSelect, onBack }: SelecionarUsuarioProps) {
	const restaurar = () => {
		if (!window.confirm("Deseja restaurar todos os dados originais da demonstração?")) return;
		restaurarDadosDemonstracao();
		window.alert("Dados de demonstração restaurados com sucesso.");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#eaebee] px-4 py-8">
			<div className="w-full max-w-[1120px] bg-white rounded-2xl shadow-md px-6 sm:px-10 py-9">
				<div className="flex justify-center mb-6">
					<img src={logo} alt="Logo IMA" className="h-20 w-auto" />
				</div>

				<div className="text-center mb-7">
					<h1 className="text-2xl font-semibold text-gray-800">Selecione o perfil de acesso</h1>
					<p className="text-sm text-gray-500 mt-2">
						Escolha como deseja visualizar o Sidagro nesta demonstração.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{perfis.map(({ role, title, description, icon: Icon }) => (
						<button
							key={role}
							type="button"
							onClick={() => onSelect(role)}
							className="group min-h-44 rounded-xl border border-gray-200 p-5 text-left transition hover:border-[#1A7A3C] hover:bg-green-50/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A7A3C] focus:ring-offset-2"
						>
							<div className="flex h-full flex-col">
								<div className="flex items-start justify-between gap-4">
									<span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#1A7A3C]">
										<Icon size={25} />
									</span>
									<ChevronRight
										size={20}
										className="mt-1 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#1A7A3C]"
									/>
								</div>
								<h2 className="mt-4 text-base font-semibold text-gray-800">{title}</h2>
								<p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
							</div>
						</button>
					))}
				</div>

				<p className="mt-6 text-center text-xs leading-5 text-red-600">
					Esta tela é apenas demonstrativa. Desenvolvedores: não incluí-la na versão final do sistema.
				</p>

				<div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
					<button
						type="button"
						onClick={restaurar}
						className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#1A7A3C]"
					>
						<RotateCcw size={16} />
						Restaurar dados da demonstração
					</button>
					<button
						type="button"
						onClick={onBack}
						className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-75"
						style={{ color: GREEN }}
					>
						<ArrowLeft size={16} />
						Voltar ao login
					</button>
				</div>
			</div>
		</div>
	);
}
