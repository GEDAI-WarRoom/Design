import {
  ArrowRight,
  BriefcaseBusiness,
  BriefcaseMedical,
  Calendar,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ClipboardPlus,
  Dna,
  DollarSign,
  Download,
  FileInput,
  FileText,
  FlaskConical,
  Globe,
  Landmark,
  Layers3,
  LineChart,
  Map,
  MapPinned,
  MoveUpRight,
  PackageMinus,
  PackagePlus,
  PillBottle,
  ReceiptText,
  RefreshCw,
  Route,
  Ruler,
  Scale,
  ScanBarcode,
  Settings,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Store,
  Syringe,
  TowerControl,
  Truck,
  User,
  Wallet,
	Ham,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { PendenciasConfirmacaoGta } from "../components/PendenciasConfirmacaoGta";
import * as Icons from "../imports/icons";
import campanhaVacinacao2026Url from "../imports/images/campanha-vacinacao-2026.png";
import armazenamentoGraos2026Url from "../imports/images/armazenamento-graos-2026.png";
import inovacaoDigitalCampoUrl from "../imports/images/inovacao-digital-campo.png";
import propriedadeSantaHelenaUrl from "../imports/images/propriedade-santa-helena.png";
import propriedadeSaoJoseUrl from "../imports/images/propriedade-sao-jose.png";
import {
  isEntryRouteAllowed,
  useDemoUser,
  type DemoUserRole,
} from "../contexts/DemoUserContext";

const GREEN = "#1A7A3C";

// Definindo os tipos locais para organização
export interface MenuItem {
  label: string;
  route: string;
  icon?: React.ReactNode; // O '?' deixa o ícone opcional caso algum link não tenha
}

export interface MenuCategory {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

// Exportamos os dados para que a Navbar consiga importá-los e usá-los na busca
export const cadastrosCategories: MenuCategory[] = [
	{
		title: "Geral",
		icon: <Globe size={32} color={GREEN} />,
		items: [

			{
				label: "Aeroporto/Porto",
				route: "aeroporto-porto",
				icon: <TowerControl size={16} />,
			},
			{ label: "Açougue", route: "acougue", icon: <Store size={16} /> },
			{
				label: "Divisão Municipal",
				route: "divisao-municipal",
				icon: <Map size={16} />,
			},
			{
				label: "Classificação Sanitária por Estado",
				route: "classificacao-sanitaria-estado",
				icon: <ShieldCheck size={16} />,
			},
			{
				label: "Estabelecimento Agropecuário",
				route: "estabelecimento-agropecuario",
				icon: (
					<img
						src={Icons.iconeEstabelecimentoUrl}
						alt="Estabelecimento Agropecuário"
						className="w-4 h-4"
					/>
				),
			},

			{
				label: "Venda de Propriedade",
				route: "venda-propriedade",
				icon: (
					<img
						src={Icons.iconeVendaPropriedadeUrl}
						alt="Venda Propriedade"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Pessoa Física",
				route: "pessoa-fisica",
				icon: <User size={16} />,
			},
			{
				label: "Pessoa Jurídica",
				route: "pessoa-juridica",
				icon: (
					<img
						src={Icons.iconePessoaJuridicaUrl}
						alt="Pessoa JurídicA"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Produto",
				route: "produto",
				icon: <ShoppingCart size={16} />,
			},
			{
				label: "Profissional de Serviço Oficial",
				route: "profissional-oficial",
				icon: (
					<img
						src={Icons.iconeProfissionalUrl}
						alt="Profissional"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Unidade Administrativa",
				route: "unidade-administrativa",
				icon: (
					<img
						src={Icons.iconeUnidadeAdministrativaUrl}
						alt="Unidade Administrativa"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Unidade de Medida",
				route: "unidade-medida",
				icon: <Ruler size={16} />,
			},
			{
				label: "Revendedora de Produtos Agropecuários",
				route: "revendedora-agropecuario",
				icon: <Store size={16} />,
			},
			{
				label: "Instituição de Ensino e Pesquisa",
				route: "instituicao-ensino-pesquisa",
				icon: <Landmark size={16} />,
			},
			{
				label: "Tipo de Veículo",
				route: "tipo-veiculo",
				icon: <Truck size={16} />,
			},
		],
	},
	{
		title: "Animal",
		icon: (
			<img
				src={Icons.iconeAnimalUrl}
				alt="Animal"
				className="w-9 h-9 object-contain"
			/>
		),
		items: [
			{
				label: "Certificadora SISBOV",
				route: "certificadora-sisbov",
				icon: (
					<img
						src={Icons.iconeCertificadoraUrl}
						alt="Certificadora"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Espécie",
				route: "especie",
				icon: <Dna size={16} />,
			},
			{
				label: "Núcleo de Produção",
				route: "nucleo-producao",
				icon: (
					<img
						src={Icons.iconeNucleoProducaoUrl}
						alt="Núcleo de Produção"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Exploração Pecuária",
				route: "exploracao-pecuaria",
				icon: (
					<img
						src={Icons.iconeExploracaoUrl}
						alt="Exploração Pecuária"
						className="w-4 h-4"
					/>
				),
			},
				{
					label: "Estabelecimento Agroindustrial POA - SIE/MG",
				route: "agroindustrial-sie",
				icon: (
					<img
						src={Icons.iconeEstabelecimentoAgroindustrialUrl}
						alt="Estabelecimento Agroindustrial"
						className="w-4 h-4"
					/>
					),
				},
				{
					label: "Estabelecimento Agroindustrial POA - Outras Inspeções",
					route: "agroindustrial-outras-inspecoes",
					icon: (
						<img
							src={Icons.iconeEstabelecimentoAgroindustrialUrl}
							alt="Estabelecimento Agroindustrial"
							className="w-4 h-4"
						/>
					),
				},
			{
				label: "Passaporte Equestre",
				route: "passaporte-equestre",
				icon: (
					<img
						src={Icons.iconeEquestreUrl}
						alt="Equestre"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Estabelecimento/Recinto de Eventos Pecuários",
				route: "estabelecimento-evento-pecuario",
				icon: <Calendar size={16} />,
			},
  {
    title: "Geral",
    icon: <Globe size={32} color={GREEN} />,
    items: [
			{
				label: "Central de Pendências",
				route: "pendencias-confirmacao-gta",
				icon: <Bell size={16} />,
			},      {
        label: "Aeroporto/Porto",
        route: "aeroporto-porto",
        icon: <TowerControl size={16} />,
      },
      { label: "Açougue", route: "acougue", icon: <Ham size={16} /> },
      {
        label: "Divisão Municipal",
        route: "divisao-municipal",
        icon: <Map size={16} />,
      },
      {
        label: "Classificação Sanitária por Estado",
        route: "classificacao-sanitaria-estado",
        icon: <ShieldCheck size={16} />,
      },
      {
        label: "Estabelecimento Agropecuário",
        route: "estabelecimento-agropecuario",
        icon: (
          <img
            src={Icons.iconeEstabelecimentoUrl}
            alt="Estabelecimento Agropecuário"
            className="w-4 h-4"
          />
        ),
      },

      {
        label: "Venda de Propriedade",
        route: "venda-propriedade",
        icon: (
          <img
            src={Icons.iconeVendaPropriedadeUrl}
            alt="Venda Propriedade"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Pessoa Física",
        route: "pessoa-fisica",
        icon: <User size={16} />,
      },
      {
        label: "Pessoa Jurídica",
        route: "pessoa-juridica",
        icon: (
          <img
            src={Icons.iconePessoaJuridicaUrl}
            alt="Pessoa JurídicA"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Produto",
        route: "produto",
        icon: <ShoppingCart size={16} />,
      },
      {
        label: "Profissional de Serviço Oficial",
        route: "profissional-oficial",
        icon: (
          <img
            src={Icons.iconeProfissionalUrl}
            alt="Profissional"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Unidade Administrativa",
        route: "unidade-administrativa",
        icon: (
          <img
            src={Icons.iconeUnidadeAdministrativaUrl}
            alt="Unidade Administrativa"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Unidade de Medida",
        route: "unidade-medida",
        icon: <Ruler size={16} />,
      },
      {
        label: "Revendedora de Produtos Agropecuários",
        route: "revendedora-agropecuario",
        icon: <Store size={16} />,
      },
      {
        label: "Instituição de Ensino e Pesquisa",
        route: "instituicao-ensino-pesquisa",
        icon: <Landmark size={16} />,
      },
      {
        label: "Tipo de Veículo",
        route: "tipo-veiculo",
        icon: <Truck size={16} />,
      },
    ],
  },
  {
    title: "Animal",
    icon: (
      <img
        src={Icons.iconeAnimalUrl}
        alt="Animal"
        className="w-9 h-9 object-contain"
      />
    ),
    items: [
      {
        label: "Certificadora SISBOV",
        route: "certificadora-sisbov",
        icon: (
          <img
            src={Icons.iconeCertificadoraUrl}
            alt="Certificadora"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Espécie",
        route: "especie",
        icon: <Dna size={16} />,
      },
      {
        label: "Núcleo de Produção",
        route: "nucleo-producao",
        icon: (
          <img
            src={Icons.iconeNucleoProducaoUrl}
            alt="Núcleo de Produção"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Exploração Pecuária",
        route: "exploracao-pecuaria",
        icon: (
          <img
            src={Icons.iconeExploracaoUrl}
            alt="Exploração Pecuária"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Estabelecimento Agroindustrial POA - SIE/MG",
        route: "agroindustrial-sie",
        icon: (
          <img
            src={Icons.iconeEstabelecimentoAgroindustrialUrl}
            alt="Estabelecimento Agroindustrial"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Passaporte Equestre",
        route: "passaporte-equestre",
        icon: (
          <img
            src={Icons.iconeEquestreUrl}
            alt="Equestre"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Estabelecimento/Recinto de Eventos Pecuários",
        route: "estabelecimento-evento-pecuario",
        icon: <Calendar size={16} />,
      },
      {
        label: "Evento Pecuário",
        route: "evento-pecuario",
        icon: <CalendarCheck size={16} />,
      },
      {
        label: "Integradora Cooperativa",
        route: "integradora-cooperativa",
        icon: (
          <img
            src={Icons.iconeGrupoUrl}
            alt="Integradora Cooperativa"
            className="w-5 h-5"
          />
        ),
      },

			{
				label: "Profissional da Área Animal",
				route: "profissional-animal",
				icon: (
					<img
						src={Icons.iconeProfissionalAnimalUrl}
						alt="Profissional da Área Animal"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Promotora de Eventos Pecuários",
				route: "promotora-eventos",
				icon: (
					<img
						src={Icons.iconePromotoraUrl}
						alt="Promotora de Eventos Pecuários"
						className="w-4 h-4"
					/>
				),
			},
			{
				label: "Revendedora de Animais Vivos",
				route: "revendedora-animais",
				icon: <Store size={16} />,
			},
			{
				label: "Status Animal",
				route: "status-animal",
				icon: (
					<img src={Icons.iconeStatusUrl} alt="Status" className="w-4 h-4" />
				),
			},
		],
	},
	{
		title: "Vegetal",
		icon: (
			<img
				src={Icons.iconeVegetalUrl}
				alt="Vegetal"
				className="w-9 h-9 object-contain"
			/>
		),
		items: [
			{
				label: "Estabelecimento Agroindustrial POV",
				route: "agroindustrial-pov",
				icon: (
					<img
						src={Icons.iconeEstabelecimentoAgroindustrialUrl}
						alt="Estabelecimento Agroindustrial POV"
						className="w-4 h-4 object-contain"
					/>
				),
			},
			{
				label: "Unidade de Consolidação",
				route: "unidade-consolidacao",
				icon: (
					<img
						src={Icons.iconeUnidadeConsolidacaoUrl}
						alt="Unidade de Consolidação"
						className="w-4 h-4 object-contain"
					/>
				),
			},
			{
				label: "Cultura",
				route: "cultura",
				icon: (
					<img
						src={Icons.iconeCulturaUrl}
						alt="Cultura"
						className="w-4 h-4 object-contain"
					/>
				),
			},
			{
				label: "Praga",
				route: "praga",
				icon: (
					<img
						src={Icons.iconePragaUrl}
						alt="Praga"
						className="w-4 h-4 object-contain"
					/>
				),
			},
			{
				label: "Profissional Vegetal",
				route: "profissional-vegetal",
				icon: (
					<img
						src={Icons.iconeProfissionalVegetalUrl}
						alt="Profissional Vegetal"
						className="w-4 h-4 object-contain"
					/>
				),
			},
		],
	},
      {
        label: "Profissional da Área Animal",
        route: "profissional-animal",
        icon: (
          <img
            src={Icons.iconeProfissionalAnimalUrl}
            alt="Profissional da Área Animal"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Promotora de Eventos Pecuários",
        route: "promotora-eventos",
        icon: (
          <img
            src={Icons.iconePromotoraUrl}
            alt="Promotora de Eventos Pecuários"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Revendedora de Animais Vivos",
        route: "revendedora-animais",
        icon: <Store size={16} />,
      },
      {
        label: "Status Animal",
        route: "status-animal",
        icon: (
          <img src={Icons.iconeStatusUrl} alt="Status" className="w-4 h-4" />
        ),
      },
    ],
  },
  {
    title: "Vegetal",
    icon: (
      <img
        src={Icons.iconeVegetalUrl}
        alt="Vegetal"
        className="w-9 h-9 object-contain"
      />
    ),
    items: [
      {
        label: "Unidade de Consolidação",
        route: "unidade-consolidacao",
        icon: (
          <img
            src={Icons.iconeUnidadeConsolidacaoUrl}
            alt="Unidade de Consolidação"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Cultura",
        route: "cultura",
        icon: (
          <img
            src={Icons.iconeCulturaUrl}
            alt="Cultura"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Praga",
        route: "praga",
        icon: (
          <img
            src={Icons.iconePragaUrl}
            alt="Praga"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Profissional Vegetal",
        route: "profissional-vegetal",
        icon: (
          <img
            src={Icons.iconeProfissionalVegetalUrl}
            alt="Profissional Vegetal"
            className="w-4 h-4 object-contain"
          />
        ),
      },
    ],
  },
];

export const secondaryCategories: MenuCategory[] = [
  {
    title: "Vacinação",
    icon: <Syringe size={28} color={GREEN} />,
    items: [
      {
        label: "Laboratório",
        route: "laboratorio",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Venda com Saída de Vacina",
        route: "venda-saida-vacina",
        icon: <PackageMinus size={16} />,
      },
      {
        label: "Venda com Entrada de Vacina",
        route: "venda-entrada-vacina",
        icon: <PackagePlus size={16} />,
      },

      {
        label: "Doação/Partilha de Vacina",
        route: "partilha-vacina",
        icon: (
          <img src={Icons.iconeDoacaoUrl} alt="Doação" className="w-4 h-4" />
        ),
      },
      {
        label: "Ajuste de Doses de Vacina",
        route: "lancamento-doses-vacina",
        icon: (
          <img
            src={Icons.iconeDoseVacinaUrl}
            alt="Dose de Vacina"
            className="w-4 h-4"
          />
        ),
      },

      {
        label: "Etapa de Vacinação",
        route: "etapa-vacinacao",
        icon: (
          <img
            src={Icons.iconeEtapaVacinacaoUrl}
            alt="Etapa de Vacinação"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Autorização de Vacinação",
        route: "autorizacao-vacinacao",
        icon: (
          <img
            src={Icons.iconeAutorizacaoVacinacaoUrl}
            alt="Autotização de Vacinação"
            className="w-4 h-4"
          />
        ),
      },
      {
        label: "Declaração de Vacinação",
        route: "declaracao-vacinacao",
        icon: (
          <img
            src={Icons.iconeDeclaracaoVacinacaoUrl}
            alt="Declaração de Vacinação"
            className="w-4 h-4"
          />
        ),
      },

      {
        label: "Doença",
        route: "doenca",
        icon: (
          <img src={Icons.iconeDoencaUrl} alt="Doença" className="w-4 h-4" />
        ),
      },

      {
        label: "Vacinador Contra Brucelose",
        route: "vacinador",
        icon: (
          <img
            src={Icons.iconeVacinadorUrl}
            alt="Vacinador"
            className="w-4 h-4"
          />
        ),
      },
    ],
  },
  {
    title: "Exame",
    icon: <BriefcaseMedical size={28} color={GREEN} />,
    items: [
      {
        label: "Venda com Entrada de Insumos para Exames",
        route: "venda-entrada-insumos-exames",
        icon: <PackagePlus size={16} />,
      },

      {
        label: "Ajuste de Doses de Insumo",
        route: "ajuste-doses-insumo",
        icon: (
          <img
            src={Icons.iconeDoseVacinaUrl}
            alt="Dose de Vacina"
            className="w-4 h-4"
          />
        ),
      },

      {
        label: "Tipo de Insumo de Exame",
        route: "tipo-insumo-exame",
        icon: <PillBottle size={16} />,
      },

      {
        label: "Local de Realização de Exame",
        route: "local-realizacao-exame",
        icon: <MapPinned size={16} />,
      },
      {
        label: "Atestado De Exame",
        route: "atestado-exame",
        icon: <ClipboardPlus size={16} />,
      },
    ],
  },
  {
    title: "Rebanho",
    icon: (
      <img
        src={Icons.iconeRebanhoUrl}
        alt="Rebanho"
        className="w-9 h-9 object-contain"
      />
    ),
    items: [
      {
        label: "Etapa de Atualização Cadastral",
        route: "etapa-atualizacao-cadastral",
        icon: (
          <img
            src={Icons.iconeEtapaUrl}
            alt="Etapa"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Ajuste de Rebanho",
        route: "ajuste-rebanho",
        icon: (
          <img
            src={Icons.iconeAjusteRebanhoUrl}
            alt="Lançamento de Rebanho"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Lançamento de Rebanho",
        route: "lancamento-rebanho",

        icon: <MoveUpRight size={16} />,
      },
      {
        label: "Atualização Cadastral de Rebanho",
        route: "atualizacao-cadastral-rebanho",
        icon: <RefreshCw size={16} />,
      },
    ],
  },
];

export const thirdCategories: MenuCategory[] = [
  {
    title: "Arrecadação",
    icon: <DollarSign size={28} color={GREEN} />,
    items: [
      {
        label: "Receita",
        route: "receita",
        icon: <ReceiptText size={16} />,
      },
      {
        label: "Índice",
        route: "indice",
        icon: <LineChart size={16} />,
      },

      {
        label: "DAE",
        route: "dae",
        icon: <ScanBarcode size={16} />,
      },
      {
        label: "Fundo de Arrecadação",
        route: "fundo-arrecadacao",
        icon: <Wallet size={16} />,
      },

      {
        label: "Notificações dos Estabelecimentos",
        route: "notificacoes-estabelecimentos",
        icon: <Scale size={16} />,
      },
      {
        label: "Lote de Pagamento",
        route: "lote-pagamento",
        icon: <Layers3 size={16} />,
      },
      {
        label: "Taxa de Emissão de Documento Sanitário",
        route: "taxa-emissao-gta",
        icon: (
          <img
            src={Icons.iconeTaxaGTAUrl}
            alt="Taxa de Emissão de Documento Sanitário"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Isenção de Taxa de Documento Sanitário",
        route: "isencao-taxa-gta",
        icon: (
          <img
            src={Icons.iconeIsencaoTaxaUrl}
            alt="Isenção de Taxa de Documento Sanitário"
            className="w-4 h-4 object-contain"
          />
        ),
      },
    ],
  },
  {
    title: "GTA",
    icon: (
      <img
        src={Icons.iconeGTAUrl}
        alt="GTA"
        className="w-9 h-9 object-contain"
      />
    ),
    items: [
      {
        label: "Emissão de GTA",
        route: "emissao-gta",
        icon: <FileInput size={16} />,
      },
      {
        label: "Finalidade de Trânsito",
        route: "finalidade-transito",
        icon: <Route size={18} />,
      },
      {
        label: "Distribuição de Formulários",
        route: "distribuicao-formularios-gta",
        icon: <ClipboardList size={16} />,
      },
      {
        label: "Registro de Venda de GTA Digital",
        route: "registro-venda-gta-digital",
        icon: (
          <img
            src={Icons.iconeGTADigitalUrl}
            alt="GTA Digital"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Registro de Venda de GTA Física",
        route: "registro-venda-gta-fisica",
        icon: (
          <img
            src={Icons.iconeGTAFisicaUrl}
            alt="GTA Digital"
            className="w-4 h-4 object-contain"
          />
        ),
      },
      {
        label: "Recolhimento Mensal de GTAs",
        route: "recolhimento-mensal-gta",
        icon: <CalendarDays size={16} />,
      },
      {
        label: "Emissão de ATA",
        route: "emissao-ata",
        icon: <FileText size={16} />,
      },
    ],
  },
];

export const fourthCategories: MenuCategory[] = [
  {
    title: "Controle", // Altere o título conforme o seu Figma
    icon: <Settings size={28} color={GREEN} />, // Altere o ícone se precisar
    items: [
      {
        label: "Parâmetros do sistema",
        route: "parametros-sistema",
        icon: <Settings2 size={16} />,
      },
      {
        label: "Usuários",
        route: "usuarios",
        icon: <User size={16} />,
      },
      {
        label: "Papéis",
        route: "papeis",
        icon: <BriefcaseBusiness size={16} />,
      },
    ],
  },
];

function filterCategoriesByRole(
  categories: MenuCategory[],
  role: DemoUserRole | null,
) {
  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        isEntryRouteAllowed(role, item.route),
      ),
    }))
    .filter((category) => category.items.length > 0);
}

// Componente auxiliar de Card interno ajustado para renderizar o ícone do item
function CategoryCard({
  cat,
  onNavigate,
}: {
  cat: MenuCategory;
  onNavigate: (s: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-1">{cat.icon}</div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {cat.title}
      </h3>
      <ul className="flex flex-col gap-1">
        {cat.items.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              className="text-sm flex items-center gap-2 hover:underline transition py-0.5"
              style={{ color: GREEN }}
              onClick={(e) => {
                e.preventDefault();
                if (item.route) onNavigate(item.route);
              }}
            >
              {/* MODIFICADO AQUI: Se houver ícone, renderiza o ícone personalizado, senão mantém a bolinha clássica */}
              {item.icon ? (
                <span className="flex-shrink-0 text-[#1A7A3C]">
                  {item.icon}
                </span>
              ) : (
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: GREEN }}
                />
              )}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const avisosProdutor = [
  {
    categoria: "Campanha 2026",
    titulo: "Período de Vacinação Iniciado em Todo o Estado",
    descricao:
      "Mantenha seu rebanho protegido e sua documentação em dia. A campanha contra febre aftosa é obrigatória para todos os produtores.",
    acao: "Saiba mais",
    imagem: campanhaVacinacao2026Url,
    alt: "Pecuária",
  },
  {
    categoria: "Infraestrutura",
    titulo: "Novas Normas para Armazenamento de Grãos",
    descricao:
      "O IMA publica novas diretrizes técnicas para silos e armazéns visando a segurança fitossanitária da safra 2025/26.",
    acao: "Ver Documentação",
    imagem:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBExVO6qTYxSMVXWc4LvuGH_59KRGVh7EAT-BVdL-IHfAWkbjKJsKB0ZD0Hww7V1JMQPiyzeJiHBIaWQs71_LzDz96wjDhjUlF8pS4MkKNfi7BBbeDfus8suEXyJ8zPYBDqbmoR0cdVA4LA905_GmQ0IRv3dLowAum3M6zVAMMacfT1jxbrAlcc9CFrnNNsVYpBADjo6vj1tsXUg8iDPgqm6xOZ2IHupHccxxHAh7o4wdLqdltgu7kb",
    alt: "Silos",
  },
  {
    categoria: "Tecnologia",
    titulo: "Inovação Digital no Campo",
    descricao:
      "Lançamento do novo aplicativo de gestão de propriedades. Mais agilidade na emissão de guias e controle sanitário direto do celular.",
    acao: "Baixar App",
    imagem:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZQyeCdCXZmHpA__EYRTMXvGDj8RA2pzlKUMaIT4LuQ2Be5V6LhRaofs0bDs4uYjQEiQ5Q1hgnRwfpa5xxrs77Us6yGXQgMGiiG6uA7Zzbs4OZn53jyQ3pZVF3q6sV9FQj6s7V9K0jUaAy8IPKi3ZrWmbCpdBJ8NM9T0aUpNAtNfO8znJJ8hBfRd_q7x_lVW0ENHhzNV_UFFxvI5XimQL7uZePyIur_z-eyrnNnDEGAMX0-T767NQT",
    alt: "Tecnologia no campo",
  },
	{
		categoria: "Campanha 2026",
		titulo: "Período de Vacinação Iniciado em Todo o Estado",
		descricao: "Mantenha seu rebanho protegido e sua documentação em dia. A campanha contra febre aftosa é obrigatória para todos os produtores.",
		acao: "Saiba mais",
		imagem: campanhaVacinacao2026Url,
		alt: "Pecuária",
	},
	{
		categoria: "Infraestrutura",
		titulo: "Novas Normas para Armazenamento de Grãos",
		descricao: "O IMA publica novas diretrizes técnicas para silos e armazéns visando a segurança fitossanitária da safra 2025/26.",
		acao: "Ver Documentação",
		imagem: armazenamentoGraos2026Url,
		alt: "Silos",
	},
	{
		categoria: "Tecnologia",
		titulo: "Inovação Digital no Campo",
		descricao: "Lançamento do novo aplicativo de gestão de propriedades. Mais agilidade na emissão de guias e controle sanitário direto do celular.",
		acao: "Baixar App",
		imagem: inovacaoDigitalCampoUrl,
		alt: "Tecnologia no campo",
	},
];

const propriedadesProdutor = [
	{
		id: 1,
		codigo: "51080590041",
		nome: "Fazenda Santa Helena",
		municipioUf: "Uberlândia - MG",
		area: "150 hectares",
		situacao: "Ativo",
		proprietarios: "Fernando - Produtor titular",
		zona: "Rural",
		imagem: propriedadeSantaHelenaUrl,
		alt: "Pastagem da Fazenda Santa Helena",
		rebanhos: ["128 bovinos", "54 ovinos"],
	},
	{
		id: 2,
		codigo: "31001040082",
		nome: "Fazenda São José",
		municipioUf: "Patos de Minas - MG",
		area: "85 hectares",
		situacao: "Ativo",
		proprietarios: "Fernando - Produtor titular",
		zona: "Rural",
		imagem: propriedadeSaoJoseUrl,
		alt: "Área produtiva da Fazenda São José",
		rebanhos: ["42 bovinos", "12 caprinos"],
	},
];

function AvisosNoticias() {
  const [slideAtivo, setSlideAtivo] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(
      () => setSlideAtivo((atual) => (atual + 1) % avisosProdutor.length),
      7000,
    );
    return () => window.clearInterval(intervalo);
  }, []);

  const anterior = () =>
    setSlideAtivo((atual) =>
      atual === 0 ? avisosProdutor.length - 1 : atual - 1,
    );
  const proximo = () =>
    setSlideAtivo((atual) => (atual + 1) % avisosProdutor.length);

  return (
    <section className="mb-6" aria-label="Avisos e Notícias">
      <div className="mb-3 flex justify-end">
        <div
          className="flex gap-2"
          aria-label={`Notícia ${slideAtivo + 1} de ${avisosProdutor.length}`}
        >
          {avisosProdutor.map((aviso, index) => (
            <button
              key={aviso.titulo}
              type="button"
              onClick={() => setSlideAtivo(index)}
              aria-label={`Exibir notícia ${index + 1}`}
              aria-current={index === slideAtivo}
              className="h-1 w-12 overflow-hidden rounded-full bg-gray-300"
            >
              <span
                className={`block h-full bg-[#1A7A3C] transition-all duration-500 ${index === slideAtivo ? "w-full" : "w-0"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-900 shadow-sm sm:h-[400px]">
        {avisosProdutor.map((aviso, index) => (
          <article
            key={aviso.titulo}
            aria-hidden={index !== slideAtivo}
            className={`absolute inset-0 transition-opacity duration-700 ${index === slideAtivo ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img
              src={aviso.imagem}
              alt={aviso.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
            <div className="absolute inset-0 flex max-w-3xl flex-col justify-end p-6 sm:p-9 md:p-12">
              <span className="mb-4 w-fit rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1A7A3C]">
                {aviso.categoria}
              </span>
              <h3 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                {aviso.titulo}
              </h3>
              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/85 sm:text-base">
                {aviso.descricao}
              </p>
              <button
                type="button"
                className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-xl transition hover:bg-gray-100"
              >
                {aviso.acao}
                {index === 2 ? (
                  <Download size={18} />
                ) : index === 1 ? (
                  <FileText size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </article>
        ))}

        <div className="absolute bottom-5 right-5 z-20 flex gap-3 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={anterior}
            aria-label="Notícia anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={proximo}
            aria-label="Próxima notícia"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

function PropriedadesProdutor({ onNavigate }: { onNavigate: (screen: any, data?: any) => void }) {
	return (
		<section className="mb-6" aria-labelledby="propriedades-produtor-title">
			<div className="mb-4">
				<div>
					<h2 id="propriedades-produtor-title" className="text-xl font-semibold text-gray-800">Minhas propriedades</h2>
					<p className="mt-1 text-sm text-gray-500">Acesse rapidamente os dados e rebanhos de cada propriedade.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				{propriedadesProdutor.map((propriedade, index) => (
					<article key={propriedade.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
						<div className="relative h-48 overflow-hidden bg-gray-200">
							<img src={propriedade.imagem} alt={propriedade.alt} loading="lazy" className={`h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100 ${index === 1 ? "object-[center_65%]" : "object-center"}`} />
							<div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
							<span className="absolute left-4 top-4 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">Ativa</span>
						</div>
						<div className="p-5">
							<h3 className="text-lg font-semibold text-gray-900">{propriedade.nome}</h3>
							<p className="mt-1 text-sm text-gray-500">{propriedade.municipioUf} <span aria-hidden="true">•</span> {propriedade.area}</p>
							<div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
								<div className="flex flex-wrap gap-2">
									{propriedade.rebanhos.map((rebanho, rebanhoIndex) => (
										<span key={rebanho} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${rebanhoIndex === 0 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-[#1A7A3C]"}`}>{rebanho}</span>
									))}
								</div>
								<button type="button" onClick={() => onNavigate("visualizar-estabelecimento-agropecuario", propriedade)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A7A3C] transition hover:text-[#15612F]">
									Gerenciar <ArrowRight size={16} />
								</button>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

// Componente Principal do Dashboard
export function DashboardPage({ onLogout, onNavigate }: any) {
  const { role } = useDemoUser();
  const visibleCadastros = filterCategoriesByRole(cadastrosCategories, role);
  const visibleSecondary = filterCategoriesByRole(secondaryCategories, role);
  const visibleThird = filterCategoriesByRole(thirdCategories, role);
  const visibleFourth = filterCategoriesByRole(fourthCategories, role);
  const mainCategoryGroups =
    role === "produtor"
      ? [[...visibleCadastros, ...visibleSecondary, ...visibleThird]]
      : [visibleCadastros, visibleSecondary, visibleThird].filter(
          (group) => group.length > 0,
        );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      {/* Importação limpa da Navbar que está na pasta de componentes */}
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="dashboard"
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {role === "produtor" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Bem-vindo, Fernando
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerencie suas propriedades e movimentações agropecuárias.
              </p>
            </div>
            <AvisosNoticias />
            <PendenciasConfirmacaoGta onNavigate={onNavigate} />
          </>
        )}

        {/* Bloco de Cadastros (Exatamente como estava) */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm p-6 mb-6 gap-6">
          <h2 className="text-xl font-semibold text-gray-800">Cadastros</h2>
          {mainCategoryGroups.map((categories, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.title}
                  cat={cat}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ))}
        </div>

        {role === "produtor" && <PropriedadesProdutor onNavigate={onNavigate} />}

        {visibleFourth.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleFourth.map((cat) => (
                <CategoryCard
                  key={cat.title}
                  cat={cat}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
