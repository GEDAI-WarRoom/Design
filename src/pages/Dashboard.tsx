import {
  ArrowRight,
  BriefcaseBusiness,
  BriefcaseMedical,
  Calendar,
  CalendarCheck,
  CalendarDays,
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
  ClipboardType,
} from "lucide-react";
import { PendenciasConfirmacaoGta } from "../components/PendenciasConfirmacaoGta";
import * as Icons from "../imports/icons";
import campanhaVacinacao2026Url from "../imports/images/campanha-vacinacao-2026.png";
import armazenamentoGraos2026Url from "../imports/images/armazenamento-graos-2026.png";
import inovacaoDigitalCampoUrl from "../imports/images/inovacao-digital-campo.png";
import {
  isEntryRouteAllowed,
  useDemoUser,
  type DemoUserRole,
} from "../contexts/DemoUserContext";
import { DashboardAdmin } from "./Dashboard/Admin/DashboardAdmin";
import { DashboardLiderEstabelecimento } from "./Dashboard/LiderEstabelecimento/DashboardLiderEstabelecimento";
import { DashboardProdutor } from "./Dashboard/Produtor/DashboardProdutor";
import { DashboardVeterinario } from "./Dashboard/Veterinario/DashboardVeterinario";
import { NoticiasCarousel } from "./Dashboard/shared/NoticiasCarousel";
import type {
  MenuCategory,
  MenuItem,
} from "./Dashboard/shared/dashboardTypes";

const GREEN = "#1A7A3C";

// Exportamos os dados para que a Navbar consiga importá-los e usá-los na busca
const cadastrosCategoriesMescladas: any[] = [
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
          }, {
            label: "Unidade de Vigilância Agropecuária",
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

// O merge anterior deixou as categorias completas repetidas dentro de
// `items` da categoria Animal. Selecionamos somente as categorias válidas
// para que objetos de categoria não sejam renderizados como links/ícones.
const categoriasValidasDoMerge = cadastrosCategoriesMescladas[1].items.filter(
  (item: any) => item.title && Array.isArray(item.items),
) as MenuCategory[];

const categoriaGeral = categoriasValidasDoMerge.find(
  (categoria) => categoria.title === "Geral",
)!;
const categoriaAnimal = categoriasValidasDoMerge.find(
  (categoria) => categoria.title === "Animal",
)!;
const categoriaVegetal = categoriasValidasDoMerge.find(
  (categoria) => categoria.title === "Vegetal",
)!;
const itemOutrasInspecoes = cadastrosCategoriesMescladas[1].items.find(
  (item: any) => item.route === "agroindustrial-outras-inspecoes",
) as MenuItem | undefined;

export const cadastrosCategories: MenuCategory[] = [
  categoriaGeral,
  {
    ...categoriaAnimal,
    items: categoriaAnimal.items.flatMap((item) =>
      item.route === "agroindustrial-sie" && itemOutrasInspecoes
        ? [item, itemOutrasInspecoes]
        : [item],
    ),
  },
  categoriaVegetal,
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
        label: "Venda com Saída de Insumo",
        route: "venda-saida-insumo",
        icon: <PackageMinus size={16} />,
      },

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
        label: "Tipo de Atestado",
        route: "atestado-exame",
        icon: <ClipboardType size={16} />,
      },
      {
        label: "Atestado de Exame",
        route: "cadastro-atestado-exame",
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
        label: "Boletos",
        route: "boletos-gta",
        icon: <ReceiptText size={16} />,
      },
      {
        label: "Relatório de Boletos",
        route: "relatorio-boletos-gta",
        icon: <ReceiptText size={16} />,
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
        label: "Distribuição de Formulários de GTA",
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
  const produtorRoutesOcultas = new Set([
    "profissional-oficial",
    "profissional-vegetal",
    "cultura",
    "praga",
    "finalidade-transito",
  ]);
  const rotasOcultasNoMenu = new Set([
    "pendencias-confirmacao-gta",
    "recolhimento-mensal-gta",
  ]);
  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        isEntryRouteAllowed(role, item.route) &&
        !(role === "produtor" && produtorRoutesOcultas.has(item.route)) &&
        !rotasOcultasNoMenu.has(item.route),
      ).map((item) => role === "veterinario" && item.route === "cadastro-atestado-exame"
        ? { ...item, label: "Atestado de Exame" }
        : item).filter((item) => !(role === "veterinario" && item.route === "atestado-exame")),
    }))
    .filter((category) => category.items.length > 0);
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

const noticiasCompartilhadas = avisosProdutor.map((aviso, index) => ({
	id: `noticia-${index + 1}`,
	category: aviso.categoria,
	title: aviso.titulo,
	description: aviso.descricao,
	actionLabel: aviso.acao,
	image: aviso.imagem,
	imageAlt: aviso.alt,
	actionIcon:
		index % 3 === 2 ? (
			<Download size={18} />
		) : index % 3 === 1 ? (
			<FileText size={18} />
		) : undefined,
}));

const propriedadesProdutor = [
  {
    id: 1,
    nome: "Fazenda Santa Helena",
    municipioUf: "Uberlândia - MG",
  },
  {
    id: 2,
    nome: "Fazenda São José",
    municipioUf: "Patos de Minas - MG",
  },
];

// Componente Principal do Dashboard
export function DashboardPage({ onLogout, onNavigate }: any) {
  const { role, user } = useDemoUser();
  const visibleCadastros = filterCategoriesByRole(cadastrosCategories, role);
  const visibleSecondary = filterCategoriesByRole(secondaryCategories, role);
  const visibleThird = filterCategoriesByRole(thirdCategories, role);
  const visibleFourth = filterCategoriesByRole(fourthCategories, role);

  if (role === "produtor") {
    return (
      <DashboardProdutor
        onLogout={onLogout}
        onNavigate={onNavigate}
        categories={[...visibleCadastros, ...visibleSecondary, ...visibleThird]}
        userName={user?.name ?? "produtor"}
        news={<NoticiasCarousel items={noticiasCompartilhadas} />}
        pendingContent={<PendenciasConfirmacaoGta onNavigate={onNavigate} />}
        linkedItems={[
          {
            id: "fazenda-santa-helena",
            title: propriedadesProdutor[0].nome,
            icon: <img src={Icons.iconeExploracaoUrl} alt="" className="h-5 w-5 object-contain" />,
            details: [
              { id: "tipo", label: "Tipo", value: "Exploração Pecuária" },
              { id: "localizacao", label: "Localização", value: propriedadesProdutor[0].municipioUf },
            ],
            onView: () => onNavigate("visualizar-estabelecimento-agropecuario", propriedadesProdutor[0]),
          },
          {
            id: "fazenda-sao-jose",
            title: propriedadesProdutor[1].nome,
            icon: <img src={Icons.iconeEstabelecimentoUrl} alt="" className="h-5 w-5 object-contain" />,
            details: [
              { id: "tipo", label: "Tipo", value: "Estabelecimento Agropecuário" },
              { id: "localizacao", label: "Localização", value: propriedadesProdutor[1].municipioUf },
            ],
            onView: () => onNavigate("visualizar-estabelecimento-agropecuario", propriedadesProdutor[1]),
          },
          {
            id: "fazenda-santa-fe",
            title: "Fazenda Santa Fé",
            icon: <img src={Icons.iconeExploracaoUrl} alt="" className="h-5 w-5 object-contain" />,
            details: [
              { id: "tipo", label: "Tipo", value: "Exploração Pecuária" },
              { id: "localizacao", label: "Localização", value: "Uberaba - MG" },
            ],
          },
        ]}
      />
    );
  }

  if (role === "veterinario") {
    return (
      <DashboardVeterinario
        onLogout={onLogout}
        onNavigate={onNavigate}
        categories={[...visibleCadastros, ...visibleSecondary, ...visibleThird]}
        news={<NoticiasCarousel items={noticiasCompartilhadas} />}
      />
    );
  }

  if (role === "responsavel-agroindustria-integradora") {
    return (
      <DashboardLiderEstabelecimento
        onLogout={onLogout}
        onNavigate={onNavigate}
        categories={[...visibleCadastros, ...visibleThird]}
        news={<NoticiasCarousel items={noticiasCompartilhadas} />}
      />
    );
  }

  return (
    <DashboardAdmin
      onLogout={onLogout}
      onNavigate={onNavigate}
      categoryGroups={[visibleCadastros, visibleSecondary, visibleThird].filter(
        (group) => group.length > 0,
      )}
      controlCategories={visibleFourth}
    />
  );
}
