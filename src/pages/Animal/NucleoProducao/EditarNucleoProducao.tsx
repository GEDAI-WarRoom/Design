import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Trash2,
  Plus,
  MapPin,
  Sprout,
  Eye,
  Home,
  PlusCircle,
  Search,
  ShoppingCart,
  Info,
  Map,
  Download
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  FloatCombobox,
  CustomButton,
  CustomRadio,
  UploadField,
  LargeTextArea,
  SearchModal,
  CheckboxGroup,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (US073 - AC3)
// ==========================================================
const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const MUNICIPIOS_MG = [
  "Abadia dos Dourados", "Abaeté", "Belo Horizonte", "Campo Belo", "Carrancas",
  "Divino", "Esmeraldas", "Lavras", "Oliveira", "Varginha",
];

const PAISES = [
  "Estados Unidos", "Argentina", "Alemanha", "Itália", "França", "Espanha",
  "Portugal", "Países Baixos", "Canadá", "Chile", "Uruguai", "Japão",
];

const SUBESPECIES_COM_FERRAO = [
  "Africanizada",
  "Apis mellifera mellifera - alemã",
  "Apis mellifera ligustica - italiana",
  "Apis mellifera carnica - sudeste europeu",
  "Apis mellifera caucasica - Cáucaso",
];
const SUBESPECIES_SEM_FERRAO = ["(Lista pendente de definição)"];

const ORIGEM_ENXAMES = ["Captura", "Compra", "Multiplicação"];
const TIPOS_CONTATO = ["Telefone", "Celular", "WhatsApp", "E-mail"];

const AVES_AREA_ATUACAO = [
  "Material de Multiplicação Animal (Reprodução)",
  "Ensino e Pesquisa",
  "Subsistência",
  "Comercial",
];
const AVES_CLASSIF_REPRODUCAO = [
  "Avozeiro", "Bisavoseiro", "Linha Pura", "Matrizeiro", "Matrizeiro de Recria",
  "Recria", "Incubatório de Avozeiros", "Incubatório de Bisavoseiros",
  "Incubatório de Linha Pura", "Incubatório de Matrizeiros",
  "Classificação, Seleção e Armazenamento de Ovos Férteis",
  "Produtor de Ovos Controlados para Produção de Vacinas Inativadas",
  "Produtor de Aves e Ovos Livres de Patógenos Específicos (SPF)",
];
const AVES_CLASSIF_COMERCIAL = [
  "Distribuidora de Aves Vivas",
  "Avicultura Industrial",
  "Aviculturas Comerciais em Pequena Escala (Menos de 1000 aves)",
  "Outra",
];
const AVES_CARACTERIZACAO_ADICIONAL = [
  "Corte", "Postura", "Dupla Aptidão", "Ornamental", "Ornamental - Galo Índio",
];

const SUI_TIPO_PRODUCAO = ["Tecnificada", "Não tecnificada"];
const SUI_AREA_NAO_TECNIFICADA = ["Subsistência", "Comercial não tecnificado"];
const SUI_AREA_TECNIFICADA = [
  "Material de Multiplicação Animal (Reprodução)",
  "Ensino e Pesquisa",
  "Comercial Tecnificado",
];
const SUI_CLASSIFICACAO = [
  "Ciclo Completo", "Terminação", "Creche", "Companhia",
  "Unidade Produtora de Leitões (UPL)",
];

const AB_FINALIDADE = [
  "Mel", "Própolis", "Cera", "Pólen", "Geleia Real", "Apitoxina",
  "Polinização", "Rainhas", "Enxames",
];
const AB_AREA_ATUACAO = ["Comercial", "Subsistência", "Ensino e Pesquisa", "Hobby"];
const AB_FLUXO = ["Fixo", "Migratório"];
const AB_TIPO_PRODUCAO = ["Orgânica", "Tradicional"];
const TIPO_DESTINO = [
  "Estabelecimento com inspeção SIF",
  "Estabelecimento com inspeção SIE",
  "Estabelecimento com inspeção SIM",
  "Consumidor Final",
  "Outro",
];
const ESCALA_COMERCIO = [
  "Intramunicipal", "Intraestadual", "Interestadual", "Exportação",
];

// ==========================================================
// MOCKS
// ==========================================================
interface ExploracaoEntidade {
  id: number;
  codigo: string;
  estabCodigo: string;
  estabNome: string;
  grupo: "Aves" | "Suídeos" | "Abelhas";
  especie: string;
  produtores: { nome: string; documento: string }[];
}

interface CoordenadasState {
  latitude?: string;
  longitude?: string;
}

interface BlocoCoordenadasProps {
  title: string;
  data: CoordenadasState;
  onChange: (key: keyof CoordenadasState, value: string) => void;
  onOpenMap: () => void;
}

export function BlocoCoordenadas({ title, data, onChange, onOpenMap }: BlocoCoordenadasProps) {
  const temCoordenadas = data.latitude && data.longitude;

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>

      {/* Se NÃO tiver coordenadas, mostra apenas o botão grandão inicial */}
      {!temCoordenadas ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpenMap}
            className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm"
          >
            <Map size={16} /> Adicionar Coordenadas
          </button>
        </div>
      ) : (
        /* Se TIVER coordenadas, o botão menor fica no LADO ESQUERDO, com campos de Latitude e Longitude desabilitados ao lado */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end animate-fade-in">

          {/* Botão menor na esquerda (ocupa 2 colunas) - Com borda verde e sem sombra */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={onOpenMap}
              className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition"
              title="Editar Localização"
            >
              <Map size={18} />
            </button>
          </div>

          {/* Latitude no meio (ocupa 5 colunas) */}
          <div className="md:col-span-5">
            <FloatInput
              label="Latitude"
              value={data.latitude}
              onChange={(v) => onChange("latitude", v)}
              disabled={true}
            />
          </div>

          {/* Longitude na direita (ocupa 5 colunas) */}
          <div className="md:col-span-5">
            <FloatInput
              label="Longitude"
              value={data.longitude}
              onChange={(v) => onChange("longitude", v)}
              disabled={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const EXPLORACOES_MOCK: ExploracaoEntidade[] = [
  {
    id: 1,
    codigo: "310010400050003",
    especie: "Codorna",
    grupo: "Aves",
    estabCodigo: "10234567891",
    estabNome: "Fazenda do Rio",
    produtores: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" }
    ],
    estabelecimentoFormatado: "10234567891\n- Fazenda do Rio",
    grupoEspecieFormatado: "Aves - Codorna",
    produtoresFormatado: "555.009.956-40\n- José Aarão Neto",
  },
  {
    id: 2,
    codigo: "310010400060012",
    especie: "Suínos",
    grupo: "Suídeos",
    estabCodigo: "20345678902",
    estabNome: "Granja Vale Verde",
    produtores: [
      { nome: "Maria Silva Mendes", documento: "444.111.222-33" }
    ],
    estabelecimentoFormatado: "20345678902\n- Granja Vale Verde",
    grupoEspecieFormatado: "Suídeos - Suínos",
    produtoresFormatado: "444.111.222-33\n- Maria Silva Mendes",
  },
  {
    id: 3,
    codigo: "310010400070088",
    especie: "Abelha com Ferrão",
    grupo: "Abelhas",
    estabCodigo: "30456789013",
    estabNome: "Sítio Mel Dourado",
    produtores: [
      { nome: "Carlos Henrique Souza", documento: "333.888.777-11" }
    ],
    estabelecimentoFormatado: "30456789013\n- Sítio Mel Dourado",
    grupoEspecieFormatado: "Abelhas - Abelha com Ferrão",
    produtoresFormatado: "333.888.777-11\n- Carlos Henrique Souza",
  },
  {
    id: 4,
    codigo: "310010400070099",
    especie: "Abelha sem Ferrão",
    grupo: "Abelhas",
    estabCodigo: "40567890124",
    estabNome: "Recanto dos Meliponíneos",
    produtores: [
      { nome: "Ana Beatriz Costa", documento: "222.444.777-88" }
    ],
    estabelecimentoFormatado: "40567890124\n- Recanto dos Meliponíneos",
    grupoEspecieFormatado: "Abelhas - Abelha sem Ferrão",
    produtoresFormatado: "222.444.777-88\n- Ana Beatriz Costa",
  }
];

interface FornecedorAbelhaEntidade {
  id: number;
  codigo: string;
  especie: string;
  grupo: "Abelhas";
  estabCodigo: string;
  estabNome: string;
  produtores: { nome: string; documento: string }[];
  estabelecimentoFormatado: string;
  grupoEspecieFormatado: string;
  produtoresFormatado: string;
}

const FORNECEDORES_ABELHA_MOCK: FornecedorAbelhaEntidade[] = [
  {
    id: 1,
    codigo: "311234567890123",
    especie: "Abelha com Ferrão",
    grupo: "Abelhas",
    estabCodigo: "30987654321",
    estabNome: "Apiário Flor do Campo",
    produtores: [
      { nome: "Marcos Rezende", documento: "111.222.333-44" }
    ],
    estabelecimentoFormatado: "30987654321\n- Apiário Flor do Campo",
    grupoEspecieFormatado: "Abelhas\n - Abelha com Ferrão",
    produtoresFormatado: "111.222.333-44\n- Marcos Rezende",
  },
  {
    id: 2,
    codigo: "311234567890124",
    especie: "Abelha sem Ferrão",
    grupo: "Abelhas",
    estabCodigo: "40987654322",
    estabNome: "Meliponário Santa Rita",
    produtores: [
      { nome: "Julia Rezende", documento: "555.666.777-88" }
    ],
    estabelecimentoFormatado: "40987654322\n- Meliponário Santa Rita",
    grupoEspecieFormatado: "Abelhas\n - Abelha sem Ferrão",
    produtoresFormatado: "555.666.777-88\n- Julia Rezende",
  }
];

// Interface para o SearchModal reconhecer a tipagem dos produtos
interface ProdutoMockEntidade {
  id: string;
  nome: string;
  unidade: string;
}

// Lista de produtos voltada para apicultura e meliponicultura
const PRODUTOS_MOCK: ProdutoMockEntidade[] = [
  { id: "1", nome: "Mel de Abelha", unidade: "Kg" },
  { id: "2", nome: "Própolis Bruta", unidade: "Kg" },
  { id: "3", nome: "Extrato de Própolis", unidade: "Litros" },
  { id: "4", nome: "Cera de Abelha", unidade: "Kg" },
  { id: "5", nome: "Pólen Apícola", unidade: "Kg" },
  { id: "6", nome: "Geleia Real", unidade: "Gramas" },
  { id: "7", nome: "Apitoxina", unidade: "Miligramas" },
];

interface ProdutoEntidade {
  id: number;
  nome: string;
  unidade: string;
}



// ==========================================================
// HELPERS DE UI (padrão do projeto)
// ==========================================================
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative">{children}</div>
      )}
    </div>
  );
}

function SimNao({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="flex gap-6 h-8 items-center">
        <CustomRadio label="Sim" name={name} value="Sim" checked={value === "Sim"} onChange={() => onChange("Sim")} />
        <CustomRadio label="Não" name={name} value="Não" checked={value === "Não"} onChange={() => onChange("Não")} />
      </div>
    </div>
  );
}

// helpers de mapeamento de opções
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const toCheck = (arr: string[]) => arr.map((v) => ({ id: v, label: v }));

// Cabeçalho de bloco repetível (contador verde + remover)
function RepeatItem({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white border border-gray-100">
      <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
        {index + 1}
      </div>
      <div className="flex-1 flex flex-col gap-4">{children}</div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition mt-2"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }) {
  return (
    <div className={comDivisor ? "border-t border-gray-100 pt-6 mt-6" : ""}>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{titulo}</h3>
      {children}
    </div>
  );
}

function EyeAction({ onClick, disabled }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} title="Visualizar"
      className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition flex-shrink-0
                 disabled:opacity-30 disabled:cursor-not-allowed self-end h-12"
    >
      <Eye size={20} />
    </button>
  );
}


const aplicarMascaraDMS = (val: string, direcao: "S" | "W") => {
  // Remove tudo que não for número
  const apenasNumeros = val.replace(/\D/g, "");

  if (!apenasNumeros) return "";

  // Exemplo de aplicação de máscara posicional: GGMMSST
  let resultado = apenasNumeros;
  if (resultado.length > 2) resultado = resultado.slice(0, 2) + "° " + resultado.slice(2);
  if (resultado.length > 6) resultado = resultado.slice(0, 6) + "' " + resultado.slice(6);
  if (resultado.length > 10) resultado = resultado.slice(0, 10) + "." + resultado.slice(10);

  return `${resultado}"${direcao}`;
};

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  initialLat?: string;  // <-- ADICIONADO para persistir a máscara e valor atual
  initialLng?: string;  // <-- ADICIONADO para persistir a máscara e valor atual
  onConfirm: (lat: string, lng: string) => void;
}

export function MapModal({
  open,
  onClose,
  title = "Buscar no Mapa",
  subtitle = "Selecione a localização no mapa:",
  icon,
  initialLat = "",
  initialLng = "",
  onConfirm
}: MapModalProps) {
  const [mapType, setMapType] = useState<"mapa" | "satelite">("mapa");
  const [formatType, setFormatType] = useState<"dms" | "decimal">("decimal");

  // Estados locais para edição dos formatos
  const [latDecimal, setLatDecimal] = useState("");
  const [lngDecimal, setLngDecimal] = useState("");
  const [latDMS, setLatDMS] = useState("");
  const [lngDMS, setLngDMS] = useState("");

  // Sincroniza e auto-detecta o formato vindo da página principal sempre que abre
  useEffect(() => {
    if (open) {
      const isDMS = initialLat.includes("°") || initialLat.includes("S") || initialLat.includes('"');

      if (isDMS) {
        setFormatType("dms");
        setLatDMS(initialLat);
        setLngDMS(initialLng);
        // Fallbacks padrão caso precise alternar para decimal dentro do modal
        setLatDecimal("-21.233481");
        setLngDecimal("-44.991278");
      } else {
        setFormatType("decimal");
        setLatDecimal(initialLat || "-21.233481");
        setLngDecimal(initialLng || "-44.991278");
        setLatDMS("");
        setLngDMS("");
      }
    }
  }, [open, initialLat, initialLng]);

  if (!open) return null;

  const handleLatDMSChange = (val: string) => {
    if (val.length < latDMS.length && (latDMS.endsWith("S") || latDMS.endsWith('"'))) {
      setLatDMS("");
      return;
    }
    setLatDMS(aplicarMascaraDMS(val, "S"));
  };

  const handleLngDMSChange = (val: string) => {
    if (val.length < lngDMS.length && (lngDMS.endsWith("W") || lngDMS.endsWith('"'))) {
      setLngDMS("");
      return;
    }
    setLngDMS(aplicarMascaraDMS(val, "W"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-6 relative font-sans text-gray-800">

        {/* Botão de fechar absoluto */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition"
        >
          ✕
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2 text-center mt-2">
          <div className="flex items-center gap-2">
            {icon || <Map size={26} style={{ color: GREEN }} />}
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
          </div>
          {subtitle && <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>}
        </div>

        {/* Corpo do Modal: Caixa do Mapa */}
        <div className="w-full h-[240px] rounded-xl border border-gray-200 overflow-hidden relative bg-gray-100 select-none flex items-center justify-center">
          <div className="absolute top-3 right-3 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-0.5 flex gap-0.5">
            <button
              type="button"
              onClick={() => setMapType("mapa")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "mapa" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setMapType("satelite")}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${mapType === "satelite" ? "bg-[#1A7A3C] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Satélite
            </button>
          </div>

          {mapType === "mapa" ? (
            <div className="absolute inset-0 bg-[#ccece6] overflow-hidden opacity-90">
              <div className="absolute inset-x-0 top-1/2 h-4 bg-white border-y border-gray-300 -rotate-6 transform scale-110" />
              <div className="absolute top-1/3 left-1/3 text-[11px] text-gray-400 font-bold tracking-wider uppercase">Lavras</div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#1e2923] overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-radial from-emerald-900/30 via-transparent to-black" />
            </div>
          )}

          <div className="relative z-20 flex flex-col items-center -mt-6">
            <MapPin size={34} className="text-[#1A7A3C] fill-[#1A7A3C] drop-shadow-md" />
            <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px] mt-0.5" />
          </div>
        </div>

        {/* Grid de Inputs */}
        <div className="grid grid-cols-12 gap-4 items-end text-left w-full">
          <div className="col-span-4">
            <FloatSelect
              label="Formato"
              required
              value={formatType}
              onChange={(v) => setFormatType(v as "dms" | "decimal")}
              options={[
                { value: "dms", label: "DMS (Graus, Minutos, Segundos)" },
                { value: "decimal", label: "DD (Decimal)" }
              ]}
            />
          </div>

          {formatType === "dms" ? (
            <>
              <div className="col-span-4">
                <FloatInput
                  label="Latitude"
                  required
                  placeholder={'__° __\' __._"S'}
                  value={latDMS}
                  onChange={handleLatDMSChange}
                />
              </div>
              <div className="col-span-4">
                <FloatInput
                  label="Longitude"
                  required
                  placeholder={'__° __\' __._"W'}
                  value={lngDMS}
                  onChange={handleLngDMSChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-4">
                <FloatInput
                  label="Latitude"
                  required
                  value={latDecimal}
                  onChange={(v) => setLatDecimal(v)}
                />
              </div>
              <div className="col-span-4">
                <FloatInput
                  label="Longitude"
                  required
                  value={lngDecimal}
                  onChange={(v) => setLngDecimal(v)}
                />
              </div>
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex justify-center items-center gap-3 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 bg-white text-[#1A7A3C] text-sm font-semibold rounded-md border border-[#1A7A3C] hover:bg-gray-50 shadow-sm transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (formatType === "decimal") {
                onConfirm(latDecimal, lngDecimal);
              } else {
                onConfirm(latDMS, lngDMS);
              }
            }}
            className="px-10 py-2.5 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: GREEN }}
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================================
// PÁGINA: EDITAR NÚCLEO DE PRODUÇÃO (US073 - AC3)
// ==========================================================
interface EditarNucleoProducaoPageProps {
  dados: any; // O objeto contendo todas as informações pré-existentes do núcleo de produção
  onNavigate: (screen: string, params?: any) => void; // Função de roteamento/navegação da aplicação
  onLogout?: () => void; // Função opcional para deslogar o usuário

}

export function EditarNucleoProducaoPage({ dados, onLogout, onNavigate }: EditarNucleoProducaoPageProps) {  
  // ---- ESTADOS DE CONTROLE DE MODAL E SITUACÃO (PADRÃO PESSOA FÍSICA) ----
    const [isSucesso, setIsSucesso] = useState(false);    
    const [isCadastroAtivo, setIsCadastroAtivo] = useState(dados?.situacao !== "Inativo" && dados?.status !== "Inativo");
    const [isConfirmarToggleModalOpen, setIsConfirmarToggleModalOpen] = useState(false);
    const [proximoEstadoAtivo, setProximoEstadoAtivo] = useState(isCadastroAtivo);
    
    // ---- INFORMAÇÕES BÁSICAS DO NÚCLEO ----
    const [nome, setNome] = useState(dados?.nome || dados?.nomeNucleo || "");
    const [tipoInscricao, setTipoInscricao] = useState(dados?.tipoInscricao || "CNPJ");

    
    // ---- EXPLORAÇÃO PECUÁRIA (ENTIDADE VÍNCULO) ----
    const [exploracao, setExploracao] = useState<ExploracaoEntidade | null>(
      dados?.exploracao || (dados?.exploracaoCodigo ? {
        id: dados?.id ?? 0,
        codigo: dados.exploracaoCodigo,
        grupo: dados.grupo || "",
        especie: dados.especie || "",
        estabNome: dados.estabNome || "",
        estabCodigo: dados.estabCodigo || "",
        produtores: dados.produtores || [],
      } : null)
    );
    const [modalExploracao, setModalExploracao] = useState(false);
    
    // ---- INFORMAÇÕES COMPLEMENTARES E AMBIENTE (AVES / SUÍDEOS) ----
    const [numGalpoes, setNumGalpoes] = useState(dados?.numGalpoes || "");
    const [capacidade, setCapacidade] = useState(dados?.capacidade || "");
    const [possuiPiquetes, setPossuiPiquetes] = useState(dados?.possuiPiquetes || "Não");
    const [numPiquetes, setNumPiquetes] = useState(dados?.numPiquetes || "");
    
    // ---- IDENTIFICAÇÃO DAS ESPÉCIES E ORIGEM (ABELHAS) ----
    const [subespecies, setSubespecies] = useState<string[]>(dados?.subespecies || []);
    const [origemEnxames, setOrigemEnxames] = useState<string[]>(dados?.origemEnxames || []);
    
    // ---- MATERIAL GENÉTICO ----
    const [materialImportado, setMaterialImportado] = useState(dados?.materialImportado || "Não");
    const [paisOrigem, setPaisOrigem] = useState(dados?.paisOrigem || "");
    const [possuiMaterialImportado, setPossuiMaterialImportado] = useState<string>(dados?.possuiMaterialImportado || dados?.possuiMaterialImportadoAbelha || "Não");
    const [paisOrigemAbelha, setPaisOrigemAbelha] = useState(dados?.paisOrigemAbelha || "");
    const [modalAberto, setModalAberto] = useState(false);
    const [idItemAtivo, setIdItemAtivo] = useState<number | null>(null);
    
    // ---- CARACTERIZAÇÃO — AVES ----
    const [avesArea, setAvesArea] = useState<string[]>(dados?.avesArea || []);
    const [avesClassif, setAvesClassif] = useState<string[]>(dados?.avesClassif || []);
    const [avesNomeClassif, setAvesNomeClassif] = useState(dados?.avesNomeClassif || "");
    const [avesCaracAdicional, setAvesCaracAdicional] = useState<string[]>(dados?.avesCaracAdicional || []);
    
    // ---- CARACTERIZAÇÃO — SUÍDEOS ----
    const [suiTipo, setSuiTipo] = useState(dados?.suiTipo || "Tecnificada");
    const [suiAreaSimples, setSuiAreaSimples] = useState(dados?.suiAreaSimples || "");
    const [suiAreaMultipla, setSuiAreaMultipla] = useState<string[]>(dados?.suiAreaMultipla || []);
    const [suiClassif, setSuiClassif] = useState(dados?.suiClassif || "");
    
    // ---- CARACTERIZAÇÃO — ABELHAS ----
    const [abFinalidade, setAbFinalidade] = useState<string[]>(dados?.abFinalidade || []);
    const [abArea, setAbArea] = useState<string[]>(dados?.abArea || []);
    const [abDistancia, setAbDistancia] = useState(dados?.abDistancia || "");
    const [abFluxo, setAbFluxo] = useState(dados?.abFluxo || "Fixo / Permanente");
    const [abTipoProducao, setAbTipoProducao] = useState(dados?.abTipoProducao || "");
    const [abPossuiCasa, setAbPossuiCasa] = useState(dados?.abPossuiCasa || "Não");
    const [produtos, setProdutos] = useState<any[]>(dados?.produtos || []);
    const [realizaAlimentacao, setRealizaAlimentacao] = useState(dados?.realizaAlimentacao || "Não");
    const [alimentacoes, setAlimentacoes] = useState<any[]>(dados?.alimentacoes || []);
    const [tipoDestinoProd, setTipoDestinoProd] = useState<string[]>(dados?.tipoDestinoProd || []);
    const [destinoOutro, setDestinoOutro] = useState(dados?.destinoOutro || "");
    const [escalaComercio, setEscalaComercio] = useState<string[]>(dados?.escalaComercio || []);
    const [comercioOutro, setComercioOutro] = useState(dados?.comercioOutro || "");
    const [tipoComercioRainhas, setTipoComercioRainhas] = useState<string[]>(dados?.tipoComercioRainhas || []);
    const [comercioRainhasOutro, setComercioRainhasOutro] = useState(dados?.comercioRainhasOutro || "");
    const [modalProduto, setModalProduto] = useState(false);
    
    // ---- FORNECEDORES VINCULADOS ----
    const [modalExploracaoFornecedor, setModalExploracaoFornecedor] = useState(false);
    const [fornecedores, setFornecedores] = useState<any[]>(
      (dados?.fornecedores || []).map((fornecedor: any) => ({
        ...fornecedor,
        contatos: fornecedor.possuiCadastro === "Não" && !(fornecedor.contatos || []).length
          ? [{ id: `${fornecedor.id}-contato-principal`, tipo: "", valor: "", observacao: "" }]
          : fornecedor.contatos || [],
      }))
    );
    const [fornecedorAtualId, setFornecedorAtualId] = useState<number | null>(null);

    const handleSalvar = () => {
      const fornecedorComContatoInvalido = origemTemCompra && fornecedores.some((fornecedor: any) =>
        fornecedor.possuiCadastro === "Não" && (
          (fornecedor.contatos || []).length === 0 ||
          (fornecedor.contatos || []).some((contato: any) => !contato.tipo.trim() || !contato.valor.trim())
        )
      );

      if (fornecedorComContatoInvalido) {
        alert("Informe o tipo e o número ou e-mail de todos os contatos do fornecedor.");
        return;
      }

      setIsSucesso(true);
    };
    
    // ---- LOCALIZAÇÃO E ANEXOS ----
    const [showCoords, setShowCoords] = useState(!!(dados?.latitude || dados?.longitude));
    const [latitude, setLatitude] = useState(dados?.latitude || "");
    const [longitude, setLongitude] = useState(dados?.longitude || "");
    const [anexos, setAnexos] = useState<any[]>(dados?.anexos || []);
    const [observacao, setObservacao] = useState(dados?.observacao || "");
    
    // ---- FLAGS DERIVADAS (MANTIDAS COMO EXPRESÕES DINÂMICAS) ----
    const grupo = exploracao?.grupo ?? "";
    const especie = exploracao?.especie ?? "";
    const isAves = grupo === "Aves";
    const isSuideos = grupo === "Suídeos";
    const isAbelhas = grupo === "Abelhas";
    const isAbelhaComFerrao = especie === "Abelha com Ferrão";
    const isAbelhaSemFerrao = especie === "Abelha sem Ferrão";
    const showMaterialGenetico = isAbelhaComFerrao || isAves || isSuideos;
    const origemTemCompra = origemEnxames.includes("Compra") || origemEnxames.some(o => o.toLowerCase().includes("compra"));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="nucleo-producao" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("nucleo-producao")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Visualizar Núcleo de Produção
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Núcleo de Produção</h1>
            <button
              type="button"
              onClick={handleSalvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
            >
              Salvar
            </button>
          </div>

        </div>

        {/* Alerta Superior: Campos Obrigatórios — Colado no título com espaçamento ideal para a seção */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-0 mb-0">

          {/* Ícone de Informação Azul/Cinza Discreto */}
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>

          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>
        
        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <FloatInput label="Código do Núcleo de Produção" value={dados?.codigo ?? ""} onChange={() => {}} disabled />
              <FloatInput label="Nome do Núcleo de Produção" required value={nome} onChange={setNome} maxLength={255} />
            </div>
        </Section>

        {/* 2. Informações da Exploração Pecuária */}
        <Section title="Informações da Exploração Pecuária">
          <div className="flex flex-col gap-6">

            {/* Subseção: Exploração Pecuária */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-700">Exploração Pecuária</span>

              {/* Se tiver exploração, vira um grid de 2 colunas. Caso contrário, vira apenas um bloco flex de linha cheia */}
              <div className={exploracao ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center" : "w-full"}>
                <div className="flex-1">
                  <FloatInput
                    label="Exploração Pecuária"
                    required
                    value={exploracao ? exploracao.codigo : ""}
                    onChange={() => { }}
                    icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />}
                    onClick={() => setModalExploracao(true)}
                  />
                </div>

                {/* O campo de Espécie só renderiza se 'exploracao' existir e entra no grid dinâmico */}
                {exploracao && (
                  <div className="flex items-center gap-2 animate-fadeIn">
                    <div className="flex-1">
                      <FloatInput
                        label="Espécie Explorada"
                        required
                        value={exploracao.especie}
                        onChange={() => { }}
                        disabled
                      />
                    </div>
                    <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition mt-1">
                      <Eye size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Subseção: Estabelecimento Agropecuário */}
            {exploracao && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-700">Estabelecimento Agropecuário</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <FloatInput
                    label="Estabelecimento Agropecuário"
                    value={exploracao.estabNome}
                    onChange={() => { }}
                    disabled
                    required
                    icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <FloatInput
                        label="Código do Estabelecimento Agropecuário"
                        value={exploracao.estabCodigo}
                        onChange={() => { }}
                        disabled
                        required
                      />
                    </div>
                    <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition mt-1">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {exploracao && <hr className="border-gray-100" />}

            {/* Subseção: Produtores */}
            {exploracao && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-700">Produtores</span>
                {exploracao.produtores.map((p, i) => (
                  <div key={i} className="flex gap-3 items-center w-full">
                    <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-center">
                      <FloatInput
                        label="Produtor"
                        value={p.nome}
                        onChange={() => { }}
                        disabled
                        required
                        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />}
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <FloatInput
                            label="CPF"
                            value={p.documento}
                            onChange={() => { }}
                            disabled
                            required />
                        </div>
                        <button type="button" className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition mt-1">
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </Section>
        {exploracao && (
          <>


            {/* 3. Informações Complementares (Aves ou Suídeos) */}
            {(isAves || isSuideos) && (
              <Section title="Informações Complementares">
                <div className="flex flex-col gap-4">

                  {/* Linha 1: Número de Galpões e Capacidade */}
                  <div className="flex gap-3">
                    <FloatInput
                      label="Número de Galpões"
                      required
                      value={numGalpoes}
                      onChange={(v) => setNumGalpoes(v.replace(/\D/g, ""))}
                      maxLength={4}
                      className="flex-1"
                    />
                    <FloatInput
                      label="Capacidade de Alojamento"
                      required
                      value={capacidade}
                      onChange={(v) => setCapacidade(v.replace(/\D/g, ""))}
                      maxLength={13}
                      className="flex-1"
                    />
                  </div>

                  {/* Linha 2: Fluxo de Piquetes (Lado a Lado) */}
                  <div className="flex flex-row items-end gap-4">
                    <SimNao
                      label="Possui Piquetes?"
                      name="possui-piquetes"
                      required
                      value={possuiPiquetes}
                      onChange={setPossuiPiquetes}
                    />
                    {possuiPiquetes === "Sim" && (
                      <div className="animate-fadeIn">
                        <FloatInput
                          label="Número de Piquetes"
                          required
                          value={numPiquetes}
                          onChange={(v) => setNumPiquetes(v.replace(/\D/g, ""))}
                          maxLength={4}
                          className="w-[260px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Linha 3: Novo Fluxo de Material Genético (Lado a Lado) */}
                  <div className="flex flex-row items-end gap-4 pt-1">
                    <SimNao
                      label="Possui Material Genético Importado?"
                      name="mat-genetico"
                      required
                      value={materialImportado}
                      onChange={setMaterialImportado}
                    />
                    {materialImportado === "Sim" && (
                      <div className="animate-fadeIn">
                        <FloatCombobox
                          label="País de Origem do Material Genético"
                          required
                          value={paisOrigem}
                          onChange={setPaisOrigem}
                          options={PAISES}
                          className="w-[340px]"
                        />
                      </div>
                    )}
                  </div>

                </div>
              </Section>
            )}


            {/* 4. Identificação das Espécies Produzidas (Abelhas) */}
            {isAbelhas && (
              <Section title="Informações das Espécies Produzidas">
                <div className="flex flex-col gap-5">

                  {/* Grid para deixar Subespécies e Origem dos Enxames lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                    {/* Coluna de Subespécies */}
                    {isAbelhaComFerrao && (
                      <CheckboxGroup
                        title="Subespécies"
                        required
                        actionLabel=""
                        options={toCheck([
                          "Africanizada",
                          "Apis mellifera mellifera - Alemã",
                          "Apis mellifera ligustica - Italiana",
                          "Apis mellifera carnica - sudeste europeu",
                          "Apis mellifera caucasica - Cáucaso",
                        ])}
                        defaultValue={subespecies}
                        onChange={setSubespecies}
                        orientation="vertical"
                      />
                    )}
                    {isAbelhaSemFerrao && (
                      <CheckboxGroup
                        title="Subespécies"
                        required
                        actionLabel=""
                        options={toCheck(SUBESPECIES_SEM_FERRAO)}
                        defaultValue={subespecies}
                        onChange={setSubespecies}
                        orientation="vertical"
                      />
                    )}

                    {/* Coluna de Origem dos Enxames (na vertical) */}
                    <CheckboxGroup
                      title="Origem dos Enxames"
                      required
                      actionLabel=""
                      options={toCheck(ORIGEM_ENXAMES)}
                      defaultValue={origemEnxames}
                      onChange={setOrigemEnxames}
                      orientation="vertical"
                    />
                  </div>

                  {/* REGRA: Material Genético Importado só aparece se for ABELHA COM FERRÃO */}
                  {exploracao?.especie === "Abelha com Ferrão" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2 animate-fadeIn items-end">
                      <div>
                        <SimNao
                          label="Possui material genético importado?"
                          name="possuiMaterialImportadoAbelha"
                          required
                          value={possuiMaterialImportado}
                          onChange={setPossuiMaterialImportado}
                        />
                      </div>

                      {possuiMaterialImportado === "Sim" ? (
                        <div className="animate-fadeIn">
                          <FloatSelect
                            label="País de Origem do Material Genético"
                            required
                            value={paisOrigem}
                            onChange={setPaisOrigem}
                            options={toOptions(PAISES)}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}

                  {/* Fornecedor (se Origem = Compra) — um ou mais */}
                  {origemTemCompra && (
                    <div className="flex flex-col gap-5 mt-2 border-t border-gray-100 pt-4">
                      <span className="text-sm font-semibold text-gray-700">Fornecedores</span>

                      {fornecedores.map((f, index) => {
                        const ehUltimoItem = index === fornecedores.length - 1;

                        return (
                          <div
                            key={f.id}
                            className={`w-full flex flex-col gap-4 animate-fadeIn ${!ehUltimoItem ? "border-b border-gray-100 pb-5" : ""
                              }`}
                          >
                            {/* Primeira Linha: Número, Pergunta e Lixeira Condicional */}
                            <div className="flex items-center justify-between gap-3 w-full">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="w-6 h-6 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                                  {index + 1}
                                </span>

                                <div className="flex-1">
                                  <SimNao
                                    label="Fornecedor cadastrado no IMA?"
                                    name={`forn-cad-${f.id}`}
                                    required
                                    value={f.possuiCadastro}
                                    onChange={(v) =>
                                      setFornecedores((prev) =>
                                        prev.map((x) =>
                                          x.id === f.id
                                            ? {
                                              ...x,
                                              possuiCadastro: v,
                                              fornecedorCod: "",
                                              nomeFornecedor: "",
                                              especie: "",
                                              estado: "",
                                              municipio: "",
                                              contatos: v === "Não"
                                                ? ((x.contatos || []).length > 0
                                                  ? x.contatos
                                                  : [{ id: `${x.id}-contato-principal`, tipo: "", valor: "", observacao: "" }])
                                                : [],
                                            }
                                            : x
                                        )
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* AJUSTE: A lixeira só é exibida se houver mais de 1 fornecedor na lista */}
                              {fornecedores.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setFornecedores((prev) => prev.filter((x) => x.id !== f.id))}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition flex-shrink-0 self-center"
                                  title="Remover Fornecedor"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>

                            {/* Segunda Linha: Inputs Condicionais */}
                            <div className="pl-9 pr-12 w-full">

                              {/* FLUXO: SIM (CADASTRADO) */}
                              {f.possuiCadastro === "Sim" && (
                                <div className="w-full animate-fadeIn">
                                  <div className={f.fornecedorCod ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-center" : "w-full"}>
                                    <div className="flex-1">
                                      <FloatInput
                                        label="Fornecedor"
                                        required
                                        value={f.fornecedorCod || ""}
                                        onChange={() => { }}
                                        onClick={() => {
                                          setModalExploracaoFornecedor(true);
                                          setFornecedorAtualId(f.id);
                                        }}
                                        placeholder="Clique para buscar a exploração..."
                                        className="cursor-pointer"
                                        icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />}
                                      />
                                    </div>

                                    {/* Espécie e Olhinho */}
                                    {f.fornecedorCod && (
                                      <div className="flex items-center gap-2 animate-fadeIn">
                                        <div className="flex-1">
                                          <FloatInput
                                            label="Espécie Explorada"
                                            required
                                            value={f.especie || ""}
                                            onChange={() => { }}
                                            disabled
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition mt-1 flex-shrink-0"
                                          onClick={() => console.log("Visualizar fornecedor:", f.fornecedorCod)}
                                        >
                                          <Eye size={20} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* FLUXO: NÃO (MANUAL) */}
                              {f.possuiCadastro === "Não" && (
                                <div className="flex flex-col gap-4 w-full animate-fadeIn">
                                  <FloatInput
                                    label="Nome do Fornecedor"
                                    required
                                    value={f.nomeFornecedor}
                                    onChange={(v) => setFornecedores((prev) => prev.map((x) => (x.id === f.id ? { ...x, nomeFornecedor: v } : x)))}
                                    maxLength={255}
                                  />

                                  {/* O grid muda de colunas dependendo da presença do Estado */}
                                  <div className={`grid grid-cols-1 ${f.estado ? "md:grid-cols-2" : "md:grid-cols-1"} gap-4 items-center`}>
                                    <div className="w-full">
                                      <FloatSelect
                                        label="Estado"
                                        required
                                        value={f.estado}
                                        onChange={(v) => setFornecedores((prev) => prev.map((x) => (x.id === f.id ? { ...x, estado: v, municipio: "" } : x)))}
                                        options={toOptions(ESTADOS_BR)}
                                        className="w-full"
                                      />
                                    </div>

                                    {/* Município renderizado apenas após o estado ser preenchido */}
                                    {f.estado && (
                                      <div className="w-full animate-fadeIn">
                                        <FloatCombobox
                                          label="Município"
                                          required
                                          value={f.municipio}
                                          onChange={(v) => setFornecedores((prev) => prev.map((x) => (x.id === f.id ? { ...x, municipio: v } : x)))}
                                          options={MUNICIPIOS_MG}
                                          className="w-full"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="my-1 w-full" />

                                  <div className="flex flex-col gap-3 w-full">
                                    <span className="text-xs font-semibold text-gray-500 ml-1">
                                      Contato do Fornecedor <span className="text-red-500">*</span>
                                    </span>

                                    {(f.contatos || []).map((contato: any, contatoIndex: number) => (
                                      <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start rounded-xl relative animate-fadeIn">
                                        <FloatSelect
                                          label="Tipo de Contato"
                                          required
                                          value={contato.tipo}
                                          onChange={(v) => setFornecedores((prev) => prev.map((x) => x.id === f.id
                                            ? { ...x, contatos: (x.contatos || []).map((c: any, i: number) => i === contatoIndex ? { ...c, tipo: v } : c) }
                                            : x))}
                                          options={TIPOS_CONTATO.map((tipo) => ({ value: tipo, label: tipo }))}
                                          className="md:col-span-3"
                                        />
                                        <FloatInput
                                          label={contato.tipo === "E-mail" ? "Email" : "Número"}
                                          required
                                          value={contato.valor}
                                          onChange={(v) => setFornecedores((prev) => prev.map((x) => x.id === f.id
                                            ? { ...x, contatos: (x.contatos || []).map((c: any, i: number) => i === contatoIndex ? { ...c, valor: v } : c) }
                                            : x))}
                                          className="md:col-span-4"
                                        />
                                        <div className={`${contatoIndex === 0 ? "md:col-span-5" : "md:col-span-4"} relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-white`}>
                                          <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                                          <textarea
                                            value={contato.observacao}
                                            maxLength={1500}
                                            onChange={(e) => setFornecedores((prev) => prev.map((x) => x.id === f.id
                                              ? { ...x, contatos: (x.contatos || []).map((c: any, i: number) => i === contatoIndex ? { ...c, observacao: e.target.value } : c) }
                                              : x))}
                                            className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none flex-1 mt-1 leading-tight"
                                          />
                                          <span className="text-right text-[9px] text-gray-400">{(contato.observacao || "").length}/1500</span>
                                        </div>
                                        {contatoIndex > 0 && (
                                          <div className="md:col-span-1 flex justify-center pt-1.5">
                                            <button
                                              type="button"
                                              onClick={() => setFornecedores((prev) => prev.map((x) => x.id === f.id
                                                ? { ...x, contatos: (x.contatos || []).filter((c: any) => c.id !== contato.id) }
                                                : x))}
                                              className="p-2.5 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer"
                                              title="Remover Contato"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={() => setFornecedores((prev) => prev.map((x) => x.id === f.id
                                        ? { ...x, contatos: [...(x.contatos || []), { id: `${f.id}-${Date.now()}`, tipo: "", valor: "", observacao: "" }] }
                                        : x))}
                                      className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition cursor-pointer"
                                    >
                                      <PlusCircle size={16} /> Adicionar Contato
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })}

                      <CustomButton
                        variant="outlined"
                        icon={<PlusCircle size={16} />}
                        onClick={() =>
                          setFornecedores((prev) => [
                            ...prev,
                            { id: Date.now(), possuiCadastro: "", fornecedorCod: "", nomeFornecedor: "", especie: "", estado: "", municipio: "", contatos: [] },
                          ])
                        }
                        className="self-start mt-1"
                      >
                        Adicionar Fornecedor
                      </CustomButton>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 6a. Caracterização do Núcleo — Aves */}
            {isAves && (
              <Section title="Caracterização do Núcleo">
                <div className="flex flex-col gap-4">

                  {/* Linha Principal Horizontal que agora comporta o campo 'Outra' na frente */}
                  <div className="flex flex-row items-end gap-3 w-full">

                    {/* 1. Área de Atuação */}
                    <div className="flex-1">
                      <FloatSelect
                        label="Área de Atuação"
                        required
                        value={avesArea}
                        onChange={(v) => { setAvesArea(v); setAvesClassif(""); setAvesNomeClassif(""); }}
                        options={toOptions(AVES_AREA_ATUACAO)}
                      />
                    </div>

                    {/* 2. Classificação Dinâmica */}
                    {avesArea === "Material de Multiplicação Animal (Reprodução)" && (
                      <div className="flex-1 animate-fadeIn">
                        <FloatSelect
                          label="Classificação"
                          required
                          value={avesClassif}
                          onChange={(v) => { setAvesClassif(v); if (v !== "Outra") setAvesNomeClassif(""); }}
                          options={toOptions(AVES_CLASSIF_REPRODUCAO)}
                        />
                      </div>
                    )}
                    {avesArea === "Comercial" && (
                      <div className="flex-1 animate-fadeIn">
                        <FloatSelect
                          label="Classificação"
                          required
                          value={avesClassif}
                          onChange={(v) => { setAvesClassif(v); if (v !== "Outra") setAvesNomeClassif(""); }}
                          options={toOptions(AVES_CLASSIF_COMERCIAL)}
                        />
                      </div>
                    )}

                    {/* 3. Nome da Classificação (Aparece exatamente à frente da Classificação se for 'Outra') */}
                    {avesClassif === "Outra" && (
                      <div className="flex-1 animate-fadeIn">
                        <FloatInput
                          label="Nome da Classificação"
                          required
                          value={avesNomeClassif}
                          onChange={setAvesNomeClassif}
                          maxLength={255}
                        />
                      </div>
                    )}

                    {/* 4. Caracterização Adicional */}
                    <div className="flex-1">
                      <FloatSelect
                        label="Caracterização Adicional"
                        required
                        value={avesCaracAdicional[0] || ""}
                        onChange={(v) => setAvesCaracAdicional(v ? [v] : [])}
                        options={toOptions(AVES_CARACTERIZACAO_ADICIONAL)}
                      />
                    </div>

                  </div>

                </div>
              </Section>
            )}

            {/* 6b. Caracterização do Núcleo — Suídeos */}
            {isSuideos && (
              <Section title="Caracterização do Núcleo">
                <div className="flex flex-col gap-5">
                  <FloatSelect
                    label="Tipo de Produção Técnica"
                    required
                    value={suiTipo}
                    onChange={(v) => { setSuiTipo(v); setSuiAreaSimples(""); setSuiAreaMultipla([]); setSuiClassif(""); }}
                    options={toOptions(SUI_TIPO_PRODUCAO)}
                  />
                  {suiTipo === "Não tecnificada" && (
                    <FloatSelect label="Área de Atuação" required value={suiAreaSimples} onChange={setSuiAreaSimples} options={toOptions(SUI_AREA_NAO_TECNIFICADA)} />
                  )}
                  {suiTipo === "Tecnificada" && (
                    <CheckboxGroup
                      title="Área de Atuação"
                      required
                      actionLabel=""
                      options={toCheck(SUI_AREA_TECNIFICADA)}
                      defaultValue={suiAreaMultipla}
                      onChange={setSuiAreaMultipla}
                      orientation="horizontal"
                    />
                  )}
                  {suiAreaMultipla.includes("Comercial Tecnificado") && (
                    <FloatSelect label="Classificação" required value={suiClassif} onChange={setSuiClassif} options={toOptions(SUI_CLASSIFICACAO)} />
                  )}
                </div>
              </Section>
            )}



            {/* 6c. Caracterização do Núcleo — Abelhas (apiário/meliponário) */}
            {isAbelhas && (
              <Section title="Caracterização do Núcleo">
                <div className="flex flex-col gap-5">

                  <CheckboxGroup
                    title="Finalidade"
                    required
                    actionLabel=""
                    options={toCheck(AB_FINALIDADE)}
                    defaultValue={abFinalidade}
                    onChange={setAbFinalidade}
                    orientation="horizontal"
                  />

                  <CheckboxGroup
                    title="Área de Atuação"
                    required
                    actionLabel=""
                    options={toCheck(AB_AREA_ATUACAO)}
                    defaultValue={abArea}
                    onChange={setAbArea}
                    orientation="horizontal"
                  />

                  <div className="flex gap-3">
                    <FloatInput label="Distância entre apiários/meliponários mais próximos (KM)" required value={abDistancia} onChange={setAbDistancia} maxLength={10} className="flex-1" />
                    <FloatSelect label="Fluxo" required value={abFluxo} onChange={setAbFluxo} options={toOptions(AB_FLUXO)} className="w-[220px] flex-shrink-0" />
                  </div>

                  {/* Bloco: Alimentação Artificial — Sem RepeatItem e Totalmente Alinhado */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-gray-700 block mb-3">Alimentação Artificial</span>

                    <SimNao label="Realiza alimentação artificial?" name="alim-artificial" required value={realizaAlimentacao} onChange={setRealizaAlimentacao} />

                    {realizaAlimentacao === "Sim" && (
                      <div className="flex flex-col gap-4 mt-2">
                        {alimentacoes.map((a, index) => {
                          const ehUltimoItem = index === alimentacoes.length - 1;

                          return (
                            <div key={a.id} className="w-full flex flex-col gap-3">
                              <div className="flex gap-3 items-center w-full">

                                {/* Indicador Numérico (Círculo Verde) */}
                                <div className="flex-shrink-0 w-7 h-7 bg-[#1A7A3C] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {index + 1}
                                </div>

                                {/* Quando é realizada? */}
                                <FloatInput
                                  label="Quando é realizada?"
                                  required
                                  value={a.quando}
                                  onChange={(v) => setAlimentacoes((p) => p.map((x) => (x.id === a.id ? { ...x, quando: v } : x)))}
                                  maxLength={255}
                                  className="flex-1"
                                />

                                {/* Qual alimentação é utilizada? */}
                                <FloatInput
                                  label="Qual alimentação é utilizada?"
                                  required
                                  value={a.qual}
                                  onChange={(v) => setAlimentacoes((p) => p.map((x) => (x.id === a.id ? { ...x, qual: v } : x)))}
                                  maxLength={255}
                                  className="flex-1"
                                />

                                {/* Botão Remover Nativo */}
                                {alimentacoes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setAlimentacoes((p) => p.filter((x) => x.id !== a.id))}
                                    className="text-red-500 hover:text-red-600 p-2 rounded transition flex-shrink-0"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>

                              {/* Linha divisória discreta idêntica à de destinos */}
                              {!ehUltimoItem && <div className="border-b border-gray-100 my-1 ml-10"></div>}
                            </div>
                          );
                        })}

                        <CustomButton
                          variant="outlined"
                          icon={<PlusCircle size={16} />}
                          onClick={() => setAlimentacoes((p) => [...p, { id: Date.now(), quando: "", qual: "" }])}
                          className="self-start mt-2"
                        >
                          Adicionar Alimentação
                        </CustomButton>
                      </div>
                    )}
                  </div>


                </div>
              </Section>
            )}

            {/* 6d. Nova Seção: Produção e Destino */}
            {isAbelhas && (
              <Section title="Informações de Produção">
                <div className="flex flex-col gap-6">

                  {/* Bloco: Caracterização da Produção */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-3 items-end w-full">
                      <FloatSelect
                        label="Tipo de Produção"
                        required
                        value={abTipoProducao}
                        onChange={setAbTipoProducao}
                        options={toOptions(AB_TIPO_PRODUCAO)}
                        className="flex-1 w-full"
                      />
                      <div className="flex-1 w-full">
                        <SimNao
                          label="Possui casa de mel, própolis, cera, pólen, geleia real ou apitoxina?"
                          name="possui-casa"
                          required
                          value={abPossuiCasa}
                          onChange={setAbPossuiCasa}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloco: Produtos produzidos — Sem RepeatItem e com Input de Modal */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-gray-700">Produtos Produzidos</span>

                    <div className="flex flex-col gap-4">
                      {produtos.map((pr, index) => {
                        const ehUltimoItem = index === produtos.length - 1;

                        return (
                          <div key={pr.id} className="w-full flex flex-col gap-3">
                            <div className="flex gap-3 items-center w-full">

                              {/* Indicador Numérico (Círculo Verde) */}
                              <div className="flex-shrink-0 w-7 h-7 bg-[#1A7A3C] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                {index + 1}
                              </div>

                              {/* Container de Clique do Produto Corrigido */}
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => {
                                  setIdItemAtivo(pr.id);
                                  setModalProduto(true);
                                }}
                              >
                                <div className="pointer-events-none">
                                  <FloatInput
                                    label="Produto"
                                    required
                                    value={pr.produto}
                                    readOnly
                                    className="w-full"
                                    icon={<ShoppingCart size={18} />}
                                  />
                                </div>
                              </div>

                              {/* Campos de Quantidade e Unidade */}
                              {pr.produto && (
                                <div className="flex gap-3 flex-1 animate-fadeIn">
                                  <FloatInput
                                    label="Quantidade Máxima"
                                    required
                                    type="text"
                                    value={pr.quantidade}
                                    onChange={(v) => setProdutos((p) => p.map((x) => (x.id === pr.id ? { ...x, quantidade: v } : x)))}
                                    className="w-[180px] flex-shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <FloatInput
                                    label="Unidade de Medida"
                                    value={pr.unidade}
                                    onChange={() => { }}
                                    disabled
                                    required
                                    className="w-[160px] flex-shrink-0"
                                  />
                                </div>
                              )}

                              {/* Botão Remover Nativo */}
                              {produtos.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setProdutos((p) => p.filter((x) => x.id !== pr.id))}
                                  className="text-red-500 hover:text-red-600 p-2 rounded transition flex-shrink-0"
                                  title="Remover Produto"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>

                            {/* Linha separadora discreta */}
                            {!ehUltimoItem && <div className="border-b border-gray-100 my-1 ml-10"></div>}
                          </div>
                        );
                      })}
                    </div>

                    <CustomButton
                      variant="outlined"
                      icon={<PlusCircle size={16} />}
                      onClick={() => setProdutos((p) => [...p, { id: Date.now(), produto: "", quantidade: "", unidade: "" }])}
                      className="self-start mt-2"
                    >
                      Adicionar Produto
                    </CustomButton>
                  </div>

                  {/* Regra de Visibilidade: Só mostra Destino de Produtos se houver algo selecionado além de apenas Rainha/Enxame */}
                  {abFinalidade.some(f => !f.includes("Rainha") && !f.includes("Enxame")) && (
                    <div className="flex flex-col gap-5 border-t border-gray-100 pt-4 animate-fadeIn">
                      <span className="text-sm font-semibold text-gray-700">Destino de Produtos</span>
                      <CheckboxGroup
                        title="Tipo de Destino"
                        required
                        actionLabel=""
                        options={toCheck(TIPO_DESTINO)}
                        defaultValue={tipoDestinoProd}
                        onChange={setTipoDestinoProd}
                        orientation="vertical"
                      />
                      {tipoDestinoProd.includes("Outro") && (
                        <FloatInput label="Destino" required value={destinoOutro} onChange={setDestinoOutro} maxLength={255} />
                      )}
                      <CheckboxGroup
                        title="Escala de Comércio"
                        required
                        actionLabel=""
                        options={toCheck(ESCALA_COMERCIO)}
                        defaultValue={escalaComercio}
                        onChange={setEscalaComercio}
                        orientation="horizontal"
                      />
                      {escalaComercio.includes("Outro") && (
                        <FloatInput label="Comércio" required value={comercioOutro} onChange={setComercioOutro} maxLength={255} />
                      )}
                    </div>
                  )}

                  {/* Regra de Visibilidade: Só mostra Destino de Rainhas/Enxames se um deles for selecionado */}
                  {abFinalidade.some(f => f.includes("Rainha") || f.includes("Enxame")) && (
                    <div className="flex flex-col gap-5 border-t border-gray-100 pt-4 animate-fadeIn">
                      <span className="text-sm font-semibold text-gray-700">Destino de Rainhas e Enxames</span>
                      <CheckboxGroup
                        title="Escala de Comércio"
                        required
                        actionLabel=""
                        options={toCheck(ESCALA_COMERCIO)}
                        defaultValue={tipoComercioRainhas}
                        onChange={setTipoComercioRainhas}
                        orientation="horizontal"
                      />
                      {tipoComercioRainhas.includes("Outro") && (
                        <FloatInput label="Comércio" required value={comercioRainhasOutro} onChange={setComercioRainhasOutro} maxLength={255} />
                      )}
                    </div>
                  )}

                </div>
              </Section>
            )}
          </>
        )}
        {/* 7. Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-4">
            {!(latitude && longitude) ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">Geolocalização</span>
                <button
                  type="button"
                  onClick={() => setModalAberto(true)} /* ou a sua função onOpenMap/abrir mapa */
                  className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm"
                >
                  <Map size={16} /> Adicionar Coordenadas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end animate-fade-in">
                {/* Botão menor na esquerda (ocupa 2 colunas) */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setModalAberto(true)}
                    className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition"
                    title="Editar Localização"
                  >
                    <Map size={18} />
                  </button>
                </div>

                {/* Latitude no meio (ocupa 5 colunas) */}
                <div className="md:col-span-5">
                  <FloatInput
                    label="Latitude"
                    value={latitude}
                    onChange={setLatitude}
                    disabled={true}
                  />
                </div>

                {/* Longitude na direita (ocupa 5 colunas) */}
                <div className="md:col-span-5">
                  <FloatInput
                    label="Longitude"
                    value={longitude}
                    onChange={setLongitude}
                    disabled={true}
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Seção Anexo Geral Dinâmica com Numeração */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">

                {/* Número indicador do anexo (Igual ao Representante Legal) */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">

                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos(prev =>
                          prev.map((a, i) =>
                            i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                          )
                        )
                      }
                    />



                    {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Botão de Excluir o Anexo */}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Botão para Adicionar Novo Anexo */}
            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* Seção Observação Geral */}
        <Section title="Observação">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>

       {/* Seção: Situação do Cadastro com Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
          <p className="text-xs text-gray-400 font-normal">
            Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
          </p>
        </div>
        
        {/* Container do Toggle */}
        <div className="flex items-center gap-3 select-none flex-shrink-0">
          <span className={`text-xs font-semibold transition-colors duration-200 ${!isCadastroAtivo ? "text-red-600" : "text-gray-400"}`}>
            Inativo
          </span>
          
          {/* Botão Switch/Toggle (Fica Verde se ativo, ou Vermelho se inativo) */}
          <button
            type="button"
            onClick={() => {
              setProximoEstadoAtivo(!isCadastroAtivo);
              setIsConfirmarToggleModalOpen(true);
            }}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 outline-none ${
              isCadastroAtivo ? "bg-[#1A7A3C]" : "bg-red-600" // 🚀 Agora fica Vermelho quando inativo!
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform duration-300 shadow-sm ${
                isCadastroAtivo ? "translate-x-8" : "translate-x-1"
              }`}
            >
              {isCadastroAtivo && (
                <svg className="w-3 h-3 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          </button>
      
          <span className={`text-xs font-semibold transition-colors duration-200 ${isCadastroAtivo ? "text-[#1A7A3C]" : "text-gray-400"}`}>
            Ativo
          </span>
        </div>
      </div>
      
      {/* MODAL DE CONFIRMAÇÃO DE STATUS (DINÂMICO: ATIVAR OU INATIVAR) */}
      {isConfirmarToggleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center gap-6 relative">
            
            {/* Conteúdo de Texto */}
            <div className="flex flex-col gap-2 w-full mt-2">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {proximoEstadoAtivo ? "Ativar Núcleo de Produção" : "Inativar Núcleo de Produção"}
              </h2>
              <p className="text-sm text-gray-600 font-normal leading-relaxed mt-1 px-1">
                Deseja {proximoEstadoAtivo ? "ativar" : "inativar"} o cadastro do Núcleo de Produção{" "}
                <span className="font-semibold text-gray-800">
                  { nome ? nome : "Setor A"}
                </span>?
              </p>
            </div>
      
            {/* Ações / Dois Botões Alinhados */}
            <div className="flex justify-center items-center gap-3 w-full pt-2">
              {/* Botão Cancelar */}
              <button
                type="button"
                onClick={() => {
                  setIsConfirmarToggleModalOpen(false);
                }}
                className="px-10 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-md shadow-sm transition"
              >
                Cancelar
              </button>
      
              {/* Botão de Confirmação (Verde para Ativar | Vermelho para Inativar) */}
              <button
                type="button"
                onClick={() => {
                  setIsCadastroAtivo(proximoEstadoAtivo);
                  setIsConfirmarToggleModalOpen(false);
                }}
                className={`px-10 h-11 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 ${
                  proximoEstadoAtivo 
                    ? "bg-[#1A7A3C] hover:bg-[#15612F]" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {proximoEstadoAtivo ? "Ativar" : "Inativar"}
              </button>
            </div>
      
          </div>
        </div>
      )}


      </main>

      {/* Modal: Buscar Exploração Pecuária */}
      <SearchModal<ExploracaoEntidade>
        open={modalExploracao}
        onClose={() => setModalExploracao(false)}
        title="Buscar Exploração Pecuária"
        subtitle="Busque por uma exploração pecuária cadastrada:"
        icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-8 h-8 object-contain" />}
        data={EXPLORACOES_MOCK}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Estabelecimento", key: "estabelecimentoFormatado" },
          { label: "Grupo - Espécie", key: "grupoEspecieFormatado" },
          { label: "Produtores", key: "produtoresFormatado" },
        ]}
        searchKeys={["codigo", "estabelecimentoFormatado", "grupoEspecieFormatado", "produtoresFormatado"]}
        searchPlaceholder="Buscar por código, estabelecimento, espécie ou produtor."
        onConfirm={(e) => {
          setExploracao(e);
          setModalExploracao(false);
        }}
        confirmLabel="Confirmar"
        // ADICIONE ESTA PROPRIEDADE SE O COMPONENTE ACEITAR:
        className="[&_td]:whitespace-pre-line"
      />

      {/* Modal: Buscar Exploração de Fornecedor (Abelhas) */}
      <SearchModal<FornecedorAbelhaEntidade>
        open={modalExploracaoFornecedor}
        onClose={() => setModalExploracaoFornecedor(false)}
        title="Buscar Fornecedor"
        subtitle="Busque por um fornecedor de abelhas cadastrado"
        icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-8 h-8 object-contain" />}
        data={FORNECEDORES_ABELHA_MOCK}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Estabelecimento", key: "estabelecimentoFormatado" },
          { label: "Grupo - Espécie", key: "grupoEspecieFormatado" },
          { label: "Produtores", key: "produtoresFormatado" },
        ]}
        searchKeys={["codigo", "estabelecimentoFormatado", "grupoEspecieFormatado", "produtoresFormatado"]}
        searchPlaceholder="Buscar por código, estabelecimento, espécie ou produtor."
        onConfirm={(item) => {
          setFornecedores((prev) =>
            prev.map((x) =>
              x.id === fornecedorAtualId
                ? {
                  ...x,
                  fornecedorCod: item.codigo,
                  nomeFornecedor: item.estabNome,
                  especie: item.especie // <--- Garante o preenchimento da Espécie
                }
                : x
            )
          );
          setModalExploracaoFornecedor(false);
        }}
        confirmLabel="Confirmar"
        className="[&_td]:whitespace-pre-line"
      />

      {/* Modal: Buscar Produto */}
      <SearchModal<ProdutoMockEntidade>
        open={modalProduto}
        onClose={() => setModalProduto(false)}
        title="Buscar Produto"
        subtitle="Busque por um produto cadastrado:"
        icon={<ShoppingCart size={32} className="text-[#1A7A3C]" />}
        data={PRODUTOS_MOCK}
        columns={[
          { label: "Nome", key: "nome" },
          { label: "Unidade de Medida", key: "unidade" },
        ]}
        searchKeys={["nome", "unidade"]}
        searchPlaceholder="Busque pelo nome do produto."
        onConfirm={(item) => {
          setProdutos((prev) =>
            prev.map((x) =>
              x.id === idItemAtivo
                ? {
                  ...x,
                  produto: item.nome,
                  unidade: item.unidade
                }
                : x
            )
          );
          setModalProduto(false);
          setIdItemAtivo(null);
        }}
        confirmLabel="Confirmar"
      />

      <MapModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        initialLat={latitude}   // <-- PASSA A LATITUDE ATUAL COM OU SEM MÁSCARA
        initialLng={longitude}  // <-- PASSA A LONGITUDE ATUAL COM OU SEM MÁSCARA
        title="Buscar no Mapa"
        subtitle="Selecione a localização no mapa:"
        icon={<Map size={26} color="#1A7A3C" />}
        onConfirm={(lat, lng) => {
          setLatitude(lat);     // Preserva o valor selecionado e formatado
          setLongitude(lng);    // Preserva o valor selecionado e formatado
          setModalAberto(false);
        }}
      />

     

         {/* Modal de Sucesso após Salvar Edição */}
        {isSucesso && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center text-center gap-5 relative">
              
              {/* Textos do Modal (Idênticos ao design da imagem enviada) */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-bold text-gray-900">Salvar Alterações do Núcleo de Produção!</h3>
                <p className="text-sm text-gray-500 mt-1 px-2">
                  Deseja salvar as alterações do Núcleo de Produção <span className="font-semibold text-gray-700">
                    {nome ? nome : "O novo núcleo de produção"}
                  </span>?
                </p>
              </div>
        
              {/* Ações / Dois Botões Alinhados em uma Linha Inteira */}
              <div className="flex gap-3 w-full mt-1">
                {/* Botão Voltar (Bordas Verdes) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSucesso(false);
                    onNavigate("visualizar-pessoa-fisica", dados);

                  }}
                  className="flex-1 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-lg transition"
                >
                  Cancelar
                </button>
        
                {/* Botão Visualizar (Todo Verde) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSucesso(false);
                    // ENVIANDO OS DADOS ATUALIZADOS PARA A TELA DE VISUALIZAÇÃO
                    onNavigate("visualizar-nucleo-producao", dados);
                  }}
                  className="flex-1 h-11 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-lg transition shadow-sm"
                >
                  Salvar
                </button>
              </div>
        
            </div>
          </div>
        )}
    </div>
  );
}
