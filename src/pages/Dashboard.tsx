import {
  FlaskConical,
  PackageMinus,
  PackagePlus,
  Gift,
  FilePlus2,
  CalendarDays,
  ShieldCheck,
  ClipboardCheck,
  Activity,
  UserCheck,
  Globe,
  Syringe,
  Map,
  Home,
  User,
  Building2,
  Package,
  Briefcase,
  Network,
  Ruler,
  Store,
  ShoppingCart,
  Dna,
  Layers,
  FileText,
  DollarSign,
  ReceiptText,
  ClipboardList,
  TowerControl,
  Receipt,
  Calendar,
  Group,
  Route,
  Users,
  Settings,
  BriefcaseBusiness,
  Truck,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import * as Icons from "../imports/icons";

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
      {
        label: "Divisão Municipal",
        route: "divisao-municipal",
        icon: <Map size={16} />,
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
        icon: <Store size={16} />,
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
        label: "Tipo de Veículo",
        route: "tipo-veiculo",
        icon: <Truck size={16} />,
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
        label: "Tipo de Insumo de Exame",
        route: "tipo-insumo-exame",
        icon: <FileText size={16} />,
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
    title: "Rebanho",
    icon: (
      <img
        src={Icons.iconeRebanhoUrl}
        alt="Rebanho"
        className="w-9 h-9 object-contain"
      />
    ),
    items: [],
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
    ],
  },
];

export const thirdCategories: MenuCategory[] = [
  {
    title: "Arrecadação", // Altere o título conforme o seu Figma
    icon: <DollarSign size={28} color={GREEN} />, // Altere o ícone se precisar
    items: [
      {
        label: "Receita",
        route: "receita",
        icon: <ReceiptText size={16} />,
      },
      {
        label: "Valor Por Índice",
        route: "valor-indice",
        icon: <ReceiptText size={16} />,
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
        label: "Usuários",
        route: "usuarios",
        icon: <Users size={16} />,
      },
      {
        label: "Papéis",
        route: "papeis",
        icon: <BriefcaseBusiness size={16} />,
      },
    ],
  },
];

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

// Componente Principal do Dashboard
export function DashboardPage({ onLogout, onNavigate }: any) {
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      {/* Importação limpa da Navbar que está na pasta de componentes */}
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="dashboard"
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Status badges */}
        <div className="bg-white rounded-xl px-5 py-3 mb-6 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: GREEN }}
            />
            <span className="text-sm text-gray-700">Concluído</span>
          </div>
        </div>

        {/* Bloco de Cadastros (Exatamente como estava) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Cadastros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cadastrosCategories.map((cat) => (
              <CategoryCard key={cat.title} cat={cat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Bloco Secundário (Exatamente como estava, adicionado mb-6 para afastar o próximo) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryCategories.map((cat) => (
              <CategoryCard key={cat.title} cat={cat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* 🚀 TERCEIRO BLOCO ADICIONADO */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {thirdCategories.map((cat) => (
              <CategoryCard key={cat.title} cat={cat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {fourthCategories.map((cat) => (
              <CategoryCard key={cat.title} cat={cat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
