import React, { useState, useRef, ChangeEvent } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Info,
  Trash2,
  Camera,
  Upload,
  Download,
  Plus,
  Calendar,
  X,
  Dna,
} from "lucide-react";

// 1. Importações Oficiais do Sistema
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  EntitySearchInput,
  ProdutorInput,
  EstabelecimentoAgropecuarioInput,
  ExploracaoPecuariaInput,
} from "../../../components/ui/EntitySearch";

// 2. Importação das Imagens de Guia
import imgLadoDireito from "./imgs/lado_direito.png";
import imgLadoEsquerdo from "./imgs/lado_esquerdo.png";
import imgFrente from "./imgs/frontal.png";
import imgTraseiro from "./imgs/traseiro.png";
import imgRostoFocinho from "./imgs/rosto.png";
import imgPescocoInferior from "./imgs/pescoco_inferior.png";

const GREEN = "#1A7A3C";

// ─── Configurações e Tipos do Canvas de Fotos ─────────────────────────────────

type ViewId =
  | "lado_direito"
  | "lado_esquerdo"
  | "frente"
  | "rosto"
  | "pescoco_inferior"
  | "traseiro";

interface Marker {
  id: string;
  x: number;
  y: number;
  number: number;
  description: string;
}

interface ViewState {
  photo: string | null;
  markers: Marker[];
}

interface ViewConfig {
  id: ViewId;
  label: string;
  guideHint: string;
  guideImage: string;
}

const VIEWS: ViewConfig[] = [
  {
    id: "lado_direito",
    label: "Lado Direito",
    guideHint: "Fotografe pelo lado direito completo do animal",
    guideImage: imgLadoDireito,
  },
  {
    id: "lado_esquerdo",
    label: "Lado Esquerdo",
    guideHint:
      "Fotografe pelo lado esquerdo completo do animal",
    guideImage: imgLadoEsquerdo,
  },
  {
    id: "frente",
    label: "Frente",
    guideHint:
      "Posicione-se à frente do animal focando na cabeça e peito",
    guideImage: imgFrente,
  },
  {
    id: "rosto",
    label: "Rosto",
    guideHint:
      "Aproxime a foto focando nos detalhes da cabeça e focinho",
    guideImage: imgRostoFocinho,
  },
  {
    id: "pescoco_inferior",
    label: "Pescoço Inferior",
    guideHint:
      "Fotografe a região inferior do pescoço (peito/ganacha)",
    guideImage: imgPescocoInferior,
  },
  {
    id: "traseiro",
    label: "Traseiro",
    guideHint:
      "Posicione-se atrás do animal pegando a garupa e membros",
    guideImage: imgTraseiro,
  },
];

const makeEmptyView = (): ViewState => ({
  photo: null,
  markers: [],
});
const uid = (p: string) =>
  `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const obterDataValidadeAutomatica = () => {
  const data = new Date();
  data.setFullYear(data.getFullYear() + 1);
  return data.toISOString().split("T")[0];
};

// ─── Mocks de Domínio (Espécie/Raça de Equídeos) ──────────────────────────────
const ESPECIES_EQUIDEOS_MOCK = [
  { id: 1, nome: "Equino", grupo: "Equídeos" },
  { id: 2, nome: "Asinino", grupo: "Equídeos" },
  { id: 3, nome: "Muar", grupo: "Equídeos" },
];

const RACAS_POR_ESPECIE: Record<string, string[]> = {
  Equino: [
    "Mangalarga Marchador",
    "Quarto de Milha",
    "Puro Sangue Inglês",
    "Crioulo",
    "Campolina",
  ],
  Asinino: ["Pêga", "Nordestino"],
  Muar: ["Mular Brasileiro"],
};

// ─── Componentes Reutilizáveis de UI do Padrão ────────────────────────────────

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold text-gray-700">
        {titulo}
      </span>
      {children}
    </div>
  );
}

function UploadZone({
  viewLabel,
  onTrigger,
}: {
  viewLabel: string;
  onTrigger: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <button
      type="button"
      onClick={onTrigger}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      className={`w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl transition-all
        ${dragging ? "border-[#1A7A3C] bg-green-50/40" : "border-gray-200 hover:border-[#1A7A3C] hover:bg-gray-50"}`}
      style={{ minHeight: 280 }}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-green-100" : "bg-gray-100"}`}
      >
        <Camera
          size={26}
          className={
            dragging ? "text-[#1A7A3C]" : "text-gray-400"
          }
        />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-gray-800">
          Anexar foto — {viewLabel}
        </p>
        <p className="text-xs text-gray-500">
          Clique para selecionar ou arraste a imagem aqui
        </p>
      </div>
      <div className="flex items-center gap-2 border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 text-xs font-bold px-4 py-2 rounded-md transition shadow-sm">
        <Upload size={14} />
        Selecionar imagem
      </div>
    </button>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface PageProps {
  onLogout?: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AdicionarPassaporteEquestrePage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [nomeAnimal, setNomeAnimal] = useState("");
  const [codigoMicrochip, setCodigoMicrochip] = useState("");
  const [dataValidade] = useState(
    obterDataValidadeAutomatica(),
  );

  // ==========================================
  // ESTADOS PARA EXAMES E ATESTADOS (EQUINOS)
  // ==========================================

  // 1. Exame de Anemia Infecciosa Equina (AIE)
  const [nomeAnemia, setNomeAnemia] = useState("");
  const [descricaoAnemia, setDescricaoAnemia] = useState("");
  const [dataEmissaoAnemia, setDataEmissaoAnemia] = useState("");
  const [dataVencimentoAnemia, setDataVencimentoAnemia] = useState("");

  // 2. Exame de Mormo
  const [nomeMormo, setNomeMormo] = useState("");
  const [descricaoMormo, setDescricaoMormo] = useState("");
  const [dataEmissaoMormo, setDataEmissaoMormo] = useState("");
  const [dataVencimentoMormo, setDataVencimentoMormo] = useState("");

  // 3. Atestado de Influenza Equina
  const [nomeInfluenza, setNomeInfluenza] = useState("");
  const [descricaoInfluenza, setDescricaoInfluenza] = useState("");
  const [dataInfluenza, setDataInfluenza] = useState("");

  // 4. Atestado de Antirrábica
  const [nomeAntirrabica, setNomeAntirrabica] = useState("");
  const [descricaoAntirrabica, setDescricaoAntirrabica] = useState("");
  const [dataAntirrabica, setDataAntirrabica] = useState("");

  // Novos campos de Identificação
  const [dataMicrochip, setDataMicrochip] = useState("");
  const [sexoAnimal, setSexoAnimal] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [raca, setRaca] = useState<any | null>(null);

  // Dados da Exploração
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [exploracaoPecuaria, setExploracaoPecuaria] = useState<any | null>(null);

  const [activeViewId, setActiveViewId] = useState<ViewId>("lado_direito");
  const [allViews, setAllViews] = useState<Record<ViewId, ViewState>>({
    lado_direito: makeEmptyView(),
    lado_esquerdo: makeEmptyView(),
    frente: makeEmptyView(),
    rosto: makeEmptyView(),
    pescoco_inferior: makeEmptyView(),
    traseiro: makeEmptyView(),
  });

  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [isSucesso, setIsSucesso] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeView = VIEWS.find((v) => v.id === activeViewId)!;
  const current = allViews[activeViewId];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAllViews((prev) => ({
        ...prev,
        [activeViewId]: {
          ...prev[activeViewId],
          photo: dataUrl,
          markers: [],
        },
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setAllViews((prev) => {
      const view = prev[activeViewId];
      const nextNum = view.markers.length + 1;
      return {
        ...prev,
        [activeViewId]: {
          ...view,
          markers: [
            ...view.markers,
            {
              id: uid("marker"),
              x,
              y,
              number: nextNum,
              description: "",
            },
          ],
        },
      };
    });
  };

  const removerMarcador = (idMarcador: string) => {
    setAllViews((p) => {
      const filtered = p[activeViewId].markers.filter(
        (x) => x.id !== idMarcador,
      );
      const renumbered = filtered.map((x, idx) => ({
        ...x,
        number: idx + 1,
      }));
      return {
        ...p,
        [activeViewId]: {
          ...p[activeViewId],
          markers: renumbered,
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="passaporte"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("inicial")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Voltar para Inicial
          </button>
          <div className="flex justify-between items-center w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Adicionar de Passaporte Equestre
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Alerta Informativo */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span>{" "}
            são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações do Animal */}
        <Section title="Informações Básicas">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FloatInput
                label="Nome do Animal"
                required
                value={nomeAnimal}
                onChange={setNomeAnimal}
                maxLength={255}
              />
              <FloatInput
                label="Código do Microchip"
                required
                value={codigoMicrochip}
                onChange={setCodigoMicrochip}
                placeholder="Ex: 981023000..."
              />

              <FloatInput
                label="Data do Microship"
                icon={
                  <Calendar
                    alt="Data de Emissão"
                    className="w-5 h-5 object-contain"
                  />
                }
                required
                value={dataMicrochip}
                onChange={setDataMicrochip}
                placeholder="Ex: dd/mm/aaaa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatSelect
                label="Sexo do Animal"
                required
                value={sexoAnimal}
                onChange={setSexoAnimal}
                options={[
                  { value: "macho", label: "Macho" },
                  { value: "fêmea", label: "Fêmea" },
                ]}
              />

              <FloatInput
                label="Data de Nascimento"
                icon={
                  <Calendar
                    alt="Data de Emissão"
                    className="w-5 h-5 object-contain"
                  />
                }
                required
                value={dataNascimento}
                onChange={setDataNascimento}
                placeholder="Ex: dd/mm/aaaa"
              />
            </div>

            <div
              className={`grid gap-5 ${especie ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
            >
              <EntitySearchInput
                label="Espécies"
                required
                placeholder="Buscar pelo nome da espécie."
                value={especie ? especie.nome : ""}
                data={ESPECIES_EQUIDEOS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Espécie", key: "nome" }]}
                icon={<Dna size={18} color={GREEN} />}
                title="Buscar Espécie"
                subtitle="Busque por uma espécie do grupo Equídeos:"
                onChange={(ent) => {
                  setEspecie(ent);
                  setRaca(null);
                }}
              />

              {especie && (
                <EntitySearchInput
                  label="Raça"
                  required
                  placeholder="Buscar pela raça da espécie."
                  value={raca ? raca.nome : ""}
                  data={(
                    RACAS_POR_ESPECIE[especie.nome] || []
                  ).map((nome, idx) => ({ id: idx, nome }))}
                  searchKeys={["nome"]}
                  columns={[{ label: "Raça", key: "nome" }]}
                  icon={<Dna size={18} color={GREEN} />}
                  title="Buscar Raça"
                  subtitle={`Busque por uma raça cadastrada para a espécie ${especie.nome}:`}
                  onChange={(ent) => setRaca(ent)}
                />
              )}
            </div>
          </div>
        </Section>

        {/* 1.1 Dados da Exploração */}
        <Section title="Dados da Exploração">
          <div className="flex flex-col gap-5">
            <ProdutorInput
              label="Produtor"
              value={produtor ? produtor.nome : ""}
              required
              onChange={(entidadeSelecionada) => {
                setProdutor(entidadeSelecionada);
                setEstabelecimento(null);
                setExploracaoPecuaria(null);
              }}
              onEyeClick={() => {
                if (produtor?.documento)
                  alert(`Visualizar detalhes: ${produtor.documento}`);
                else
                  alert("Por favor, selecione um produtor primeiro.");
              }}
            />

            {produtor && (
              <EstabelecimentoAgropecuarioInput
                label="Estabelecimento Agropecuário"
                value={estabelecimento ? estabelecimento.nome : ""}
                required
                onChange={(entidadeSelecionada) => {
                  setEstabelecimento(entidadeSelecionada);
                  setExploracaoPecuaria(null);
                }}
                onEyeClick={() => {
                  if (estabelecimento?.codigo)
                    alert(`Visualizar detalhes: ${estabelecimento.codigo}`);
                  else
                    alert("Por favor, selecione um estabelecimento primeiro.");
                }}
              />
            )}

            {estabelecimento && (
              <ExploracaoPecuariaInput
                label="Exploração Pecuária"
                value={exploracaoPecuaria ? exploracaoPecuaria.codigo : ""}
                required
                onChange={(entidadeSelecionada) =>
                  setExploracaoPecuaria(entidadeSelecionada)
                }
                onEyeClick={() => {
                  if (exploracaoPecuaria?.codigo)
                    alert(`Visualizar detalhes: ${exploracaoPecuaria.codigo}`);
                  else
                    alert("Por favor, selecione uma exploração pecuária primeiro.");
                }}
              />
            )}
          </div>
        </Section>

        {/* 2. Exames */}
        <Section title="Exames">
          <div className="flex flex-col gap-6">
            {/* Bloco 1: Exame de Anemia Infecciosa Equina (AIE) */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Exame de Anemia Infecciosa Equina (AIE)">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeAnemia}
                      onSelectFile={() =>
                        setNomeAnemia(`exame_anemia_${uid("doc")}.pdf`)
                      }
                    />

                    {nomeAnemia && (
                      <>
                        <div className="flex-1 animate-fadeIn">
                          <FloatInput
                            label="Descrição"
                            required
                            value={descricaoAnemia}
                            onChange={setDescricaoAnemia}
                            placeholder="Descrição do exame de AIE..."
                          />
                        </div>
                        <div className="h-12 flex items-center animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${nomeAnemia}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {nomeAnemia && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                      <FloatInput
                        label="Data de Emissão"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataEmissaoAnemia}
                        onChange={setDataEmissaoAnemia}
                      />
                      <FloatInput
                        label="Data de Vencimento"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataVencimentoAnemia}
                        onChange={setDataVencimentoAnemia}
                      />
                    </div>
                  )}
                </div>
              </SubGrupo>
            </div>

            {/* Bloco 2: Exame de Mormo */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Exame de Mormo">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeMormo}
                      onSelectFile={() =>
                        setNomeMormo(`exame_mormo_${uid("doc")}.pdf`)
                      }
                    />

                    {nomeMormo && (
                      <>
                        <div className="flex-1 animate-fadeIn">
                          <FloatInput
                            label="Descrição"
                            required
                            value={descricaoMormo}
                            onChange={setDescricaoMormo}
                            placeholder="Descrição do exame de mormo..."
                          />
                        </div>
                        <div className="h-12 flex items-center animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${nomeMormo}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {nomeMormo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                      <FloatInput
                        label="Data de Emissão"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataEmissaoMormo}
                        onChange={setDataEmissaoMormo}
                      />
                      <FloatInput
                        label="Data de Vencimento"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataVencimentoMormo}
                        onChange={setDataVencimentoMormo}
                      />
                    </div>
                  )}
                </div>
              </SubGrupo>
            </div>
          </div>
        </Section>

        {/* Atestados */}
        <Section title="Atestados">
          <div className="flex flex-col gap-6">
            {/* Bloco 3: Atestado de Vacinação contra Influenza Equina */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Atestado de Vacinação contra Influenza Equina">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeInfluenza}
                      onSelectFile={() =>
                        setNomeInfluenza(`atestado_influenza_${uid("doc")}.pdf`)
                      }
                    />

                    {nomeInfluenza && (
                      <>
                        <div className="flex-1 animate-fadeIn">
                          <FloatInput
                            label="Descrição"
                            required
                            value={descricaoInfluenza}
                            onChange={setDescricaoInfluenza}
                            placeholder="Descrição do atestado de influenza..."
                          />
                        </div>
                        <div className="h-12 flex items-center animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${nomeInfluenza}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {nomeInfluenza && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                      <FloatInput
                        label="Data de Emissão"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataInfluenza}
                        onChange={setDataInfluenza}
                      />
                    </div>
                  )}
                </div>
              </SubGrupo>
            </div>

            {/* Bloco 4: Atestado de Vacinação contra Antirrábica */}
            <div
              className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white shadow-sm"
              style={{ borderLeftColor: GREEN }}
            >
              <SubGrupo titulo="Atestado de Vacinação contra Antirrábica">
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={nomeAntirrabica}
                      onSelectFile={() =>
                        setNomeAntirrabica(`atestado_antirrabica_${uid("doc")}.pdf`)
                      }
                    />

                    {nomeAntirrabica && (
                      <>
                        <div className="flex-1 animate-fadeIn">
                          <FloatInput
                            label="Descrição"
                            required
                            value={descricaoAntirrabica}
                            onChange={setDescricaoAntirrabica}
                            placeholder="Descrição do atestado de raiva..."
                          />
                        </div>
                        <div className="h-12 flex items-center animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${nomeAntirrabica}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {nomeAntirrabica && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                      <FloatInput
                        label="Data de Vacinação"
                        type="date"
                        icon={<Calendar className="w-5 h-5 object-contain" />}
                        required
                        value={dataAntirrabica}
                        onChange={setDataAntirrabica}
                      />
                    </div>
                  )}
                </div>
              </SubGrupo>
            </div>
          </div>
        </Section>

        {/* 3. Resenha Eletrônica / Mapeamento de Fotos */}
        <Section title="Resenha Eletrônica">
          <div className="flex flex-col gap-4">
            {/* Menu de Abas Estilo Passos Ativos / Concluídos */}
            <div className="grid grid-cols-2 sm:flex bg-gray-100/80 p-1.5 rounded-xl gap-1.5 w-full mt-2">
              {VIEWS.map((v) => {
                const hasPhoto = allViews[v.id]?.photo !== null;
                const markerCount = allViews[v.id]?.markers?.length || 0;
                const isActive = activeViewId === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveViewId(v.id)}
                    className={`group flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all flex-1 text-center sm:text-left
                      ${
                        isActive
                          ? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5"
                          : hasPhoto
                            ? "bg-green-50/40 text-gray-700 hover:bg-green-50 border border-transparent"
                            : "text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-50 border border-dashed border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {hasPhoto ? (
                        <div className="w-4 h-4 rounded-full bg-[#1A7A3C] flex items-center justify-center text-white shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-[#1A7A3C]" : "bg-gray-300 group-hover:bg-gray-400"}`}
                        />
                      )}
                      <span>{v.label}</span>
                    </div>
                    {markerCount > 0 && (
                      <span className="bg-[#1A7A3C] text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center font-bold">
                        {markerCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
              <div className="lg:col-span-1 flex flex-col gap-3 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Diretriz da Vista
                </span>
                <div className="border border-gray-200/60 rounded-lg overflow-hidden bg-white p-2 flex items-center justify-center min-h-[140px]">
                  <img
                    src={activeView.guideImage}
                    alt={activeView.label}
                    className="max-w-full h-auto object-contain max-h-[130px]"
                    draggable={false}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium text-center">
                  {activeView.guideHint}
                </p>
              </div>

              {/* Área do Canvas de Upload / Marcação */}
              <div className="lg:col-span-3">
                {current?.photo ? (
                  <div
                    ref={containerRef}
                    onClick={handleCanvasClick}
                    className="relative border border-gray-200 rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center cursor-crosshair select-none"
                    style={{ minHeight: 380, maxHeight: 500 }}
                  >
                    <img
                      src={current.photo}
                      alt={activeView.label}
                      className="max-w-full max-h-[480px] object-contain pointer-events-none"
                      draggable={false}
                    />

                    {current.markers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removerMarcador(m.id);
                        }}
                        /*
                          Bolinhas com o Verde Oficial (sólido) e tamanho ideal (w-7 h-7)
                          Borda externa branca e sombra preta garantem contraste excelente em qualquer tipo de pelagem
                        */
                        className="group/marker absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-[0_3px_10px_rgba(0,0,0,0.4)] transition-all  hover:bg-red-600 hover:border-white"
                        style={{
                          left: `${m.x}%`,
                          top: `${m.y}%`,
                          backgroundColor: "rgba(26, 122, 60, 0.5)",
                        }}
                        title="Clique para remover"
                      >
                        <span className="text-white text-xs font-extrabold group-hover/marker:hidden">
                          {m.number}
                        </span>
                        <X
                          size={12}
                          className="text-white hidden group-hover/marker:block"
                          strokeWidth={3}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <UploadZone
                    viewLabel={activeView.label}
                    onTrigger={() => fileInputRef.current?.click()}
                  />
                )}
              </div>
            </div>

            {/* Marcadores */}
            {current?.photo && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {current.markers.length === 0 ? (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                        Opcional
                      </span>
                      <span className="text-xs text-gray-600 font-medium">
                        Esta imagem não possui marcadores de características.<br />
                        Se o animal não tiver sinais nesta vista, prossiga normalmente.
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 italic shrink-0">
                      Caso queira marcar algo, basta clicar sobre a foto acima.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Características mapeadas nesta vista 
                    </span>
                    {current.markers.map((m) => (
                      <div
                        key={m.id}
                        className="flex gap-4 items-center w-full animate-fadeIn"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 border border-white shadow-sm"
                          style={{ backgroundColor: "#1A7A3C" }}
                        >
                          {m.number}
                        </div>
                        <div className="flex-1">
                          <FloatInput
                            label={`Detalhes da característica do marcador nº ${m.number}`}
                            value={m.description}
                            placeholder="Ex: Redemoinho, mancha calçada, cicatriz, despigmentação..."
                            onChange={(v) => {
                              setAllViews((p) => ({
                                ...p,
                                [activeViewId]: {
                                  ...p[activeViewId],
                                  markers: p[activeViewId].markers.map((x) =>
                                    x.id === m.id
                                      ? { ...x, description: v }
                                      : x,
                                  ),
                                },
                              }));
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removerMarcador(m.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Painel Integrado de Visão Geral (Sempre Visível em Grade) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Visão Geral da Resenha Gráfica
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sumário de acompanhamento visual dos 6 quadrantes obrigatórios do equino.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {VIEWS.map((v) => {
                  const viewData = allViews[v.id];
                  return (
                    <div
                      key={v.id}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col h-56 relative shadow-sm"
                    >
                      <div className="px-3 py-2 bg-white border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">
                          {v.label}
                        </span>
                        {viewData.photo ? (
                          <span className="bg-[#1A7A3C] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                            {viewData.markers.length}{" "}
                            {viewData.markers.length === 1
                              ? "marcador"
                              : "marcadores"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            Obrigatório
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-center relative bg-stone-900 overflow-hidden">
                        {viewData.photo ? (
                          <>
                            <img
                              src={viewData.photo}
                              alt={v.label}
                              className="max-w-full max-h-full object-contain"
                            />
                            {viewData.markers.map((m) => (
                              <div
                                key={m.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md select-none pointer-events-none border border-white"
                                style={{
                                  left: `${m.x}%`,
                                  top: `${m.y}%`,
                                  backgroundColor: "#1A7A3C",
                                }}
                              >
                                {m.number}
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center p-4 flex flex-col items-center gap-1.5 text-gray-500 bg-gray-50 w-full h-full justify-center">
                            <Camera
                              size={20}
                              className="text-gray-300"
                            />
                            <span className="text-[11px] font-medium tracking-wide text-gray-400">
                              Pendente de Upload
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* 4. Observações Gerais */}
        <Section title="Observações">
          <LargeTextArea
            label="Observações Gerais do Passaporte"
            value={observacoesGerais}
            onChange={setObservacoesGerais}
            hasTooltip
            tooltipText="Insira observações ou notas adicionais pertinentes ao histórico de identificação clínica ou gráfica do equino."
          />
        </Section>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

     {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            
            <h3 className="text-lg font-bold text-gray-900">
              Passaporte adicioado com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              A resenha eletrônica do animal{" "}
              {nomeAnimal ? `"${nomeAnimal}"` : ""} foi adicionada com sucesso.
            </p>
            
            {/* Botões de Ação */}
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("inicial");
                }}
                className="flex-1 px-5 h-11 rounded-md border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Fechar
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  // Navega para a tela de visualização passando os dados atuais do formulário
                  onNavigate("visualizar-passaporte-equestre", {
                    nomeAnimal,
                    codigoMicrochip,
                    dataMicrochip,
                    sexoAnimal,
                    dataNascimento,
                    especie,
                    raca,
                    produtor,
                    estabelecimento,
                    exploracaoPecuaria,
                    exames: {
                      aie: { fileName: nomeAnemia, descricao: descricaoAnemia, emissao: dataEmissaoAnemia, vencimento: dataVencimentoAnemia },
                      mormo: { fileName: nomeMormo, descricao: descricaoMormo, emissao: dataEmissaoMormo, vencimento: dataVencimentoMormo },
                    },
                    atestados: {
                      influenza: { fileName: nomeInfluenza, descricao: descricaoInfluenza, emissao: dataInfluenza },
                      antirrabica: { fileName: nomeAntirrabica, descricao: descricaoAntirrabica, vacinacao: dataAntirrabica },
                    },
                    views: allViews,
                    observacoesGerais,
                  });
                }}
                className="flex-1 px-5 h-11 rounded-md text-white text-sm font-semibold transition shadow-sm"
                style={{ backgroundColor: GREEN }}
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}