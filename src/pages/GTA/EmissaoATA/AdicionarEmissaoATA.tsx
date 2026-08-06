import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp, Dna, Route, Eye, RotateCcw, Minus, Plus, Calendar, Syringe, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, SimNao, UploadField } from "../../../components/ui/FormKit";
import {
  DynamicListWrapper,
  EntitySearchInput,
  EstabelecimentoAgropecuarioInput,
  ExploracaoPecuariaInput,
  NucleoInput,
  DestinatarioInput
} from "../../../components/ui/EntitySearch";

// IMPORTAÇÃO UNIFICADA DOS ÍCONES
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ESPECIES_MOCK = [
  { id: 1, nome: "Bovino", grupoEspecie: "Bovídeos" },
  { id: 2, nome: "Bubalino", grupoEspecie: "Bovídeos" },
  { id: 3, nome: "Suíno", grupoEspecie: "Suídeos" },
  { id: 4, nome: "Galinha", grupoEspecie: "Aves" },
  { id: 5, nome: "Equino", grupoEspecie: "Equídeos" },
];

const FINALIDADES_MOCK = [
  { id: 1, nome: "Abate" },
  { id: 2, nome: "Atendimento veterinário" },
  { id: 3, nome: "Cria" },
  { id: 4, nome: "Engorda" },
  { id: 5, nome: "Exportação" },
  { id: 6, nome: "Pesquisa" },
  { id: 7, nome: "Quarentena" },
  { id: 8, nome: "Recria" },
  { id: 9, nome: "Reprodução" },
  { id: 10, nome: "Tratamento veterinário" },
];

const RESPONSAVEIS_MOCK = [
  { id: 1, nome: "José Teixeira Guimarães", cpfCnpj: "550.134.236-88" },
  { id: 2, nome: "Marcos Silva", cpfCnpj: "111.222.333-44" },
  { id: 3, nome: "Maria Oliveira", cpfCnpj: "987.654.321-00" },
];

const ISENCOES_MOCK = [
  { id: 1, nome: "Doação de animais para fins de pesquisa", codigo: "IS-001" },
  { id: 2, nome: "Trânsito para evento oficial", codigo: "IS-002" },
  { id: 3, nome: "Programa estadual de erradicação", codigo: "IS-003" },
];

const DOENCAS_VACINA_MOCK = [
  { id: 1, nome: "NewCastle" },
  { id: 2, nome: "Febre Aftosa" },
  { id: 3, nome: "Raiva dos Herbívoros" },
];

// Estabelecimentos com situação "Interditado" (impedidos de emitir GTA).
// Chave = nome OU código retornado pelo EstabelecimentoAgropecuarioInput.
const ESTABELECIMENTOS_INTERDITADOS: Record<string, {
  inicio: string;
  validade: string;
  status: string[];
  observacao: string;
}> = {
  "Fazenda do Rio": {
    inicio: "20/02/2026",
    validade: "20/05/2026",
    status: [
      "Irregularidades reportadas. Suspensão temporária aplicada aguardando nova avaliação do conselho.",
      "Espólio.",
    ],
    observacao: "Cadastro com informações irregulares.",
  },
};

function getInterdicao(estab: any) {
  if (!estab) return null;
  return (
    ESTABELECIMENTOS_INTERDITADOS[estab.nome] ||
    ESTABELECIMENTOS_INTERDITADOS[estab.codigo] ||
    null
  );
}

interface FaixaEtariaAjuste {
  id: string | number;
  faixaEtaria: string;
  machosExistentes: number;
  machosAjustados: number;
  femeasExistentes: number;
  femeasAjustadas: number;
}

const FAIXAS_MOCK_INICIAL: FaixaEtariaAjuste[] = [
  { id: 1, faixaEtaria: "De 0 a 12 Meses", machosExistentes: 50, machosAjustados: 5, femeasExistentes: 40, femeasAjustadas: 5 },
  { id: 2, faixaEtaria: "De 13 a 24 Meses", machosExistentes: 30, machosAjustados: 0, femeasExistentes: 25, femeasAjustadas: 0 },
  { id: 3, faixaEtaria: "Mais de 36 Meses", machosExistentes: 15, machosAjustados: 0, femeasExistentes: 60, femeasAjustadas: 0 },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

function totalMachos(faixas: FaixaEtariaAjuste[]) {
  return faixas.reduce((total, faixa) => total + (faixa.machosAjustados || 0), 0);
}

function totalFemeas(faixas: FaixaEtariaAjuste[]) {
  return faixas.reduce((total, faixa) => total + (faixa.femeasAjustadas || 0), 0);
}

function QuantityStepper({
  value,
  onChange,
  disabled,
  colorClass,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  colorClass: string;
  label: string;
}) {
  if (disabled) {
    return <span className={`font-semibold ${colorClass}`}>{value}</span>;
  }

  const update = (nextValue: number) => {
    onChange(Math.max(0, Math.min(999999, nextValue)));
  };

  return (
    <div className="mx-auto flex h-9 w-[108px] items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => update(value - 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Diminuir ${label}`}
      >
        <Minus size={14} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const numericValue = event.target.value
            .replace(/\D/g, "")
            .slice(0, 6);
          update(numericValue ? Number(numericValue) : 0);
        }}
        aria-label={label}
        className={`h-full min-w-0 flex-1 bg-white text-center text-sm font-semibold outline-none ${colorClass}`}
      />
      <button
        type="button"
        onClick={() => update(value + 1)}
        className="flex h-full w-8 items-center justify-center text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label={`Aumentar ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function AdjustmentTable({
  faixas,
  onChange,
  disabled = false,
  onReset,
}: {
  faixas: FaixaEtariaAjuste[];
  onChange: (faixas: FaixaEtariaAjuste[]) => void;
  disabled?: boolean;
  onReset?: () => void;
}) {
  const updateQuantity = (
    index: number,
    field: "machosAjustados" | "femeasAjustadas",
    quantity: number
  ) => {
    onChange(
      faixas.map((faixa, itemIndex) =>
        itemIndex === index ? { ...faixa, [field]: quantity } : faixa
      )
    );
  };

  if (faixas.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Selecione uma exploração pecuária para carregar as faixas etárias.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700">Registro</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">
            Registre quantos animais serão transportados.
          </span>
        </div>
        {!disabled && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 self-start text-sm font-medium text-[#1A7A3C] transition hover:opacity-75 sm:self-auto"
          >
            <RotateCcw size={15} /> Reiniciar
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th
                rowSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-left"
              >
                Faixa etária
              </th>
              <th
                colSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-center font-bold text-blue-600"
              >
                Machos
              </th>
              <th
                colSpan={2}
                className="border-b border-gray-200 px-4 py-3 text-center font-bold text-pink-600"
              >
                Fêmeas
              </th>
            </tr>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Existentes
              </th>
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Animais na ATA
              </th>
              <th className="border-b border-r border-gray-200 px-4 py-2 text-center">
                Existentes
              </th>
              <th className="border-b border-gray-200 px-4 py-2 text-center">
                Animais na ATA
              </th>
            </tr>
          </thead>
          <tbody>
            {faixas.map((faixa, index) => (
              <tr key={faixa.id} className="border-b border-gray-100">
                <th className="border-r text-sm border-gray-100 px-3 py-2 text-left font-semibold text-gray-500">
                  {faixa.faixaEtaria}
                </th>
                <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                  {faixa.machosExistentes}
                </td>
                <td className="border-r border-gray-100 px-4 py-3 text-center">
                  <QuantityStepper
                    value={faixa.machosAjustados}
                    onChange={(quantity) =>
                      updateQuantity(index, "machosAjustados", quantity)
                    }
                    disabled={disabled}
                    colorClass="text-blue-600"
                    label={`machos ajustados de ${faixa.faixaEtaria}`}
                  />
                </td>
                <td className="border-r border-gray-100 px-4 py-3 text-center text-gray-600">
                  {faixa.femeasExistentes}
                </td>
                <td className="px-4 py-3 text-center">
                  <QuantityStepper
                    value={faixa.femeasAjustadas}
                    onChange={(quantity) =>
                      updateQuantity(index, "femeasAjustadas", quantity)
                    }
                    disabled={disabled}
                    colorClass="text-pink-600"
                    label={`fêmeas ajustadas de ${faixa.faixaEtaria}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <th className="border-r border-gray-200 px-4 py-3 text-left uppercase text-gray-700">
                Total
              </th>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-600">
                {faixas.reduce(
                  (total, faixa) => total + faixa.machosExistentes,
                  0,
                )}
              </td>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-blue-600">
                {totalMachos(faixas)}
              </td>
              <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-600">
                {faixas.reduce(
                  (total, faixa) => total + faixa.femeasExistentes,
                  0,
                )}
              </td>
              <td className="px-4 py-3 text-center text-pink-600">
                {totalFemeas(faixas)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function AdicionarEmissaoATAPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const isEdicao = !!dados;
  const [isSucesso, setIsSucesso] = useState(false);

  // Estados do Formulário
  const [especie, setEspecie] = useState(dados?.especie || "");
  const [finalidade, setFinalidade] = useState(dados?.finalidade || "");
  const [meiosTransporte, setMeiosTransporte] = useState<string[]>(["Rodoviário"]);
  const [placa, setPlaca] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // INICIALIZADOS COM ARRAY VAZIO [] PARA SEREM "ZERO OR MORE"
  const [atestados, setAtestados] = useState<{ id: string; tipo: string; arquivo: string }[]>([]);
  const [motivoIsencao, setMotivoIsencao] = useState<any>(null);
  const [possuiMotivoIsencao, setPossuiMotivoIsencao] = useState<boolean | "">("");
  const [outrasVacinas, setOutrasVacinas] = useState<{ id: string; vacina: string; data: string }[]>([]);

  // Estado para as faixas de animais da AdjustmentTable
  const [faixasAnimais, setFaixasAnimais] = useState<FaixaEtariaAjuste[]>(FAIXAS_MOCK_INICIAL);

  // Lógica de Cascata - Procedência
  const [respProc, setRespProc] = useState<any>(null);
  const [estabProc, setEstabProc] = useState<any>(null);
  const [interdicaoInfo, setInterdicaoInfo] = useState<any>(null);   // dados de interdição do estab. selecionado
  const [modalInterdicao, setModalInterdicao] = useState(false);
  const [exploracaoProc, setExploracaoProc] = useState<any>(null);
  const [nucleoProc, setNucleoProc] = useState<any>(null);

  // Lógica - Destino
  const [respDest, setRespDest] = useState<any>(null);

  // Condição para exibir as seções inferiores somente após o fluxo de procedência estar completo
  const procedenciaConcluida = Boolean(
    respProc &&
    estabProc &&
    exploracaoProc &&
    nucleoProc &&
    !interdicaoInfo
  );
  const informacoesAtaValidas =
    possuiMotivoIsencao !== "" &&
    (possuiMotivoIsencao === false || Boolean(motivoIsencao));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="emissao-ata" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">

        <div>
          <button type="button" onClick={() => onNavigate("emissao-ata")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as ATAs
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{"Emitir ATA"}</h1>
            <button
              type="button"
              disabled={Boolean(interdicaoInfo) || !procedenciaConcluida || !informacoesAtaValidas}
              onClick={() => {
                if (interdicaoInfo) {
                  setModalInterdicao(true);
                  return;
                }
                setIsSucesso(true);
              }}
              className={`px-5 h-10 text-xs font-bold rounded-md transition shadow-sm ${interdicaoInfo || !procedenciaConcluida || !informacoesAtaValidas
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#1A7A3C] hover:bg-[#15612F] text-white"
                }`}
              title={interdicaoInfo ? "Estabelecimento interditado — emissão impedida" : undefined}
            >
              Gravar ATA
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EntitySearchInput
              label="Espécie"
              placeholder="Buscar Espécie..."
              required
              value={especie}
              data={ESPECIES_MOCK}
              columns={[
                { label: "Espécie", key: "nome" },
                { label: "Grupo de Espécie", key: "grupoEspecie" }
              ]}
              searchKeys={["nome", "grupoEspecie"]}
              onChange={(e) => setEspecie(e.nome)}
              icon={<Dna size={18} className="text-[#1A7A3C]" />}
            />

            <EntitySearchInput
              label="Finalidade de Transferência"
              placeholder="Buscar Finalidade..."
              required
              value={finalidade}
              data={FINALIDADES_MOCK}
              columns={[{ label: "Finalidade", key: "nome" }]}
              searchKeys={["nome"]}
              onChange={(e) => setFinalidade(e.nome)}
              icon={<Route size={18} className="text-[#1A7A3C]" />}
            />
          </div>
        </Section>

        {/* INFORMAÇÕES DA PROCEDÊNCIA */}
        <Section title="Informações da Procedência">
          <div className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Tipo de Procedência" value="Estabelecimento Agropecuário" disabled />
            </div>

            {/* RESPONSÁVEL DE PROCEDÊNCIA */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className={respProc ? "md:col-span-8" : "md:col-span-12"}>
                <EntitySearchInput
                  label="Responsável de Procedência"
                  placeholder="Buscar Responsável de Procedência..."
                  required
                  value={respProc?.nome || ""}
                  data={RESPONSAVEIS_MOCK}
                  columns={[
                    { label: "CPF/CNPJ", key: "cpfCnpj" },
                    { label: "Nome", key: "nome" }
                  ]}
                  searchKeys={["nome", "cpfCnpj"]}
                  onChange={(e) => {
                    setRespProc(e);
                    setEstabProc(null);
                    setExploracaoProc(null);
                    setNucleoProc(null);
                  }}
                  icon={<img src={Icons.iconeFornecedorUrl} alt="Responsável de Procedência" className="w-5 h-5 object-contain" />}
                />
              </div>

              {respProc && (
                <div className="md:col-span-4 flex items-center gap-2 animate-fadeIn">
                  <div className="flex-1">
                    <FloatInput label="CPF / CNPJ" value={respProc.cpfCnpj || "550.134.236-88"} disabled />
                  </div>
                  <button
                    type="button"
                    title="Visualizar detalhes do Responsável"
                    className="p-3 mb-0.5 rounded-md text-[#1A7A3C] hover:bg-green-50 hover:border-[#1A7A3C] bg-white transition flex items-center justify-center "                  >
                    <Eye size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* ESTABELECIMENTO AGROPECUÁRIO */}
            {respProc && (
              <div className="pt-2 animate-fadeIn">
                {interdicaoInfo && (
                  <button
                    type="button"
                    onClick={() => setModalInterdicao(true)}
                    className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#F0C27B] bg-[#FDF6E7] px-3 py-1 text-xs font-semibold text-[#9A6B00] hover:bg-[#fbefd3] transition"
                    title="Ver detalhes da interdição"
                  >
                    <AlertTriangle size={13} />
                    Estabelecimento Interditado
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
                  <div className={estabProc ? "md:col-span-8" : "md:col-span-12"}>
                    <EstabelecimentoAgropecuarioInput
                      value={estabProc?.nome || ""}
                      required
                      onChange={(e) => {
                        setEstabProc(e);
                        setExploracaoProc(null);
                        setNucleoProc(null);
                        // Verifica se o estabelecimento está interditado
                        const interdicao = getInterdicao(e);
                        setInterdicaoInfo(interdicao);
                        if (interdicao) setModalInterdicao(true);
                      }}
                      icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EXPLORAÇÃO PECUÁRIA */}
            {estabProc && !interdicaoInfo && (
              <div className="pt-2 animate-fadeIn flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
                  <div className={exploracaoProc ? "md:col-span-8" : "md:col-span-12"}>
                    <ExploracaoPecuariaInput
                      value={exploracaoProc?.codigo || ""}
                      required
                      onChange={(e) => {
                        setExploracaoProc(e);
                        setNucleoProc(null);
                      }}
                      icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração Pecuária" className="w-5 h-5 object-contain" />}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NÚCLEO DE PRODUÇÃO */}
            {exploracaoProc && (
              <div className="pt-2 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
                  <div className={nucleoProc ? "md:col-span-8" : "md:col-span-12"}>
                    <NucleoInput
                      value={nucleoProc?.nome || ""}
                      required
                      onChange={(e) => setNucleoProc(e)}
                      icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo" className="w-5 h-5 object-contain" />}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* INFORMAÇÕES DE DESTINO */}
        <Section title="Informações de Destino">
          <div className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatSelect
                label="Tipo de Destino"
                required
                value="Estabelecimento Agropecuário"
                onChange={() => { }}
                options={[{ value: "Estabelecimento Agropecuário", label: "Estabelecimento Agropecuário" }]}
                disabled
              />
            </div>

            {/* RESPONSÁVEL DE DESTINO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className={respDest ? "md:col-span-8" : "md:col-span-12"}>
                <EntitySearchInput
                  label="Responsável de Destino"
                  placeholder="Buscar Responsável de Destino..."
                  required
                  value={respDest?.nome || ""}
                  data={RESPONSAVEIS_MOCK}
                  columns={[
                    { label: "CPF/CNPJ", key: "cpfCnpj" },
                    { label: "Nome", key: "nome" }
                  ]}
                  searchKeys={["nome", "cpfCnpj"]}
                  onChange={(e) => setRespDest(e)}
                  icon={<img src={Icons.iconeDestinatarioUrl} alt="Responsável Destino" className="w-5 h-5 object-contain " />}
                />
              </div>

              {respDest && (
                <div className="md:col-span-4 flex items-center gap-2 animate-fadeIn">
                  <div className="flex-1">
                    <FloatInput label="CPF / CNPJ" value={respDest.cpfCnpj || "12.345.678/0001-90"} disabled />
                  </div>
                  <button
                    type="button"
                    title="Visualizar detalhes do Destinatário"
                    className="p-3 mb-0.5 rounded-md text-[#1A7A3C] hover:bg-green-50 hover:border-[#1A7A3C] bg-white transition flex items-center justify-center "
                  >
                    <Eye size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* ESTABELECIMENTO AGROPECUÁRIO - DESTINO */}
            {respDest && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-8">
                    <FloatInput
                      label="Estabelecimento Agropecuário"
                      value={respDest.estabelecimentoNome || "Fazenda da Luz"}
                      disabled
                      icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento Destino" className="w-5 h-5 object-contain grayscale opacity-60" />}
                    />
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 animate-fadeIn">
                    <div className="flex-1">
                      <FloatInput label="Código do Estabelecimento" value={respDest.estabelecimentoCodigo || "201299002030"} disabled />
                    </div>
                    <button
                      type="button"
                      title="Visualizar detalhes do Estabelecimento"
                      className="p-3 mb-0.5 rounded-md text-[#1A7A3C] hover:bg-green-50 hover:border-[#1A7A3C] bg-white transition flex items-center justify-center "
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EXPLORAÇÃO PECUÁRIA - DESTINO */}
            {respDest && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-8">
                    <FloatInput
                      label="Exploração Pecuária"
                      value={respDest.exploracaoNome || "3100203003910002"}
                      disabled
                      icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração Destino" className="w-5 h-5 object-contain grayscale opacity-60" />}
                    />
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 animate-fadeIn">
                    <div className="flex-1">
                      <FloatInput label="Espécie Predominante" value={respDest.especie || "Bovino"} disabled />
                    </div>
                    <button
                      type="button"
                      title="Visualizar detalhes da Exploração"
                      className="p-3 mb-0.5 rounded-md text-[#1A7A3C] hover:bg-green-50 hover:border-[#1A7A3C] bg-white transition flex items-center justify-center "
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NÚCLEO DE PRODUÇÃO - DESTINO */}
            {respDest && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-8">
                    <FloatInput
                      label="Núcleo de Produção"
                      value={respDest.nucleoNome || "Núcleo Principal"}
                      disabled
                      icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo Destino" className="w-5 h-5 object-contain grayscale opacity-60" />}
                    />
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2 animate-fadeIn">
                    <div className="flex-1">
                      <FloatInput label="Código do Núcleo" value={respDest.nucleoCodigo || "202135656001"} disabled />
                    </div>
                    <button
                      type="button"
                      title="Visualizar detalhes do Núcleo"
                      className="p-3 mb-0.5 rounded-md text-[#1A7A3C] hover:bg-green-50 hover:border-[#1A7A3C] bg-white transition flex items-center justify-center"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* INFORMAÇÕES DO TRÂNSITO */}
        <Section title="Informações do Trânsito">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Meio de Transporte <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["Rodoviário", "Aéreo", "Marítimo/Fluvial", "Ferroviário"].map((item) => {
                  const isChecked = meiosTransporte.includes(item);
                  return (
                    <label key={item} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#1A7A3C] transition">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setMeiosTransporte(meiosTransporte.filter((t) => t !== item));
                          } else {
                            setMeiosTransporte([...meiosTransporte, item]);
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#1A7A3C] focus:ring-[#1A7A3C] accent-[#1A7A3C]"
                      />
                      {item}
                    </label>
                  );
                })}
              </div>
            </div>

            {meiosTransporte.includes("Rodoviário") ? (
              <div className="animate-fadeIn">
                <FloatInput
                  label="Placa do Veículo"
                  value={placa}
                  onChange={setPlaca}
                  maxLength={7}
                  placeholder="ABC1D23"
                  required
                />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </Section>

        {/* SEÇÕES DEPENDENTES DA CONCLUSÃO DA PROCEDÊNCIA */}
        {procedenciaConcluida && (
          <>
            {/* INFORMAÇÕES DOS ANIMAIS COM A ADJUSTMENT TABLE */}
            <Section title="Informações dos Animais">
              <AdjustmentTable
                faixas={faixasAnimais}
                onChange={setFaixasAnimais}
                onReset={() => setFaixasAnimais(FAIXAS_MOCK_INICIAL)}
              />
            </Section>

            <Section title="Vacinas">
              <div className="flex flex-col gap-5">
                {/* Vacinas do Serviço Oficial */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Vacinas do Serviço Oficial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FloatInput
                      label="Data da Vacinação da 1ª Etapa de Raiva de Herbívoros"
                      value="25/03/2025"
                      disabled
                      icon={<Calendar size={18} className="text-gray-400" />}
                    />
                    <FloatInput
                      label="Data da Vacinação da 2ª Etapa de Raiva de Herbívoros"
                      value="25/03/2025"
                      disabled
                      icon={<Calendar size={18} className="text-gray-400" />}
                    />
                    {/* Brucelose: só para Bovinos e Bubalinos */}
                    {(especie === "Bovino" || especie === "Bubalino") && (
                      <FloatInput
                        label="Data da Vacinação de Brucelose"
                        value="25/03/2025"
                        disabled
                        icon={<Calendar size={18} className="text-gray-400" />}
                      />
                    )}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Outras Vacinas (zero ou mais - inicia vazio []) */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Outras Vacinas</h4>
                  <DynamicListWrapper
                    items={outrasVacinas}
                    behavior="zero-or-more"
                    variant="plain"
                    addButtonLabel="Adicionar Vacina"
                    addButtonVariant="outline"
                    addButtonClassName="border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 bg-transparent font-semibold"
                    onAddItem={() => setOutrasVacinas(p => [...p, { id: uid(), vacina: "", data: "" }])}
                    onRemoveItem={(i) => setOutrasVacinas(p => p.filter((_, idx) => idx !== i))}
                  >
                    {(item, index) => (
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <EntitySearchInput
                            label="Vacina"
                            placeholder="Buscar doença"
                            value={item.vacina}
                            data={DOENCAS_VACINA_MOCK}
                            searchKeys={["nome"]}
                            columns={[{ label: "Doença", key: "nome" }]}
                            title="Buscar Vacina"
                            subtitle="Busque por uma doença que produz vacina:"
                            required
                            onChange={(ent: any) => setOutrasVacinas(p => p.map((v, idx) => idx === index ? { ...v, vacina: ent?.nome || "" } : v))}
                            icon={<Syringe size={18} className="text-[#1A7A3C]" />}
                          />
                        </div>
                        <div className="flex-1">
                          <FloatInput
                            label="Data da Vacinação"
                            type="date"
                            value={item.data}
                            onChange={(v) => setOutrasVacinas(p => p.map((vac, idx) => idx === index ? { ...vac, data: v } : vac))}
                            required
                            icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                          />
                        </div>
                      </div>
                    )}
                  </DynamicListWrapper>
                </div>
              </div>
            </Section>

            <Section title="Atestados">
              <div className="flex flex-col gap-4">
                <UploadField label="Atestado Sanitário" required fileName="" onSelectFile={() => { }} />
                <hr className="border-gray-100 my-2" />
                <h4 className="text-sm font-semibold text-gray-700">Atestado de Exames</h4>
                {/* Atestados de Exames (zero ou mais - inicia vazio []) */}
                <DynamicListWrapper
                  items={atestados}
                  behavior="zero-or-more"
                  variant="plain"
                  addButtonLabel="Adicionar Exame"
                  addButtonVariant="outline"
                  addButtonClassName="border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 bg-transparent font-semibold"
                  onAddItem={() => setAtestados(p => [...p, { id: uid(), tipo: "", arquivo: "" }])}
                  onRemoveItem={(i) => setAtestados(p => p.filter((_, idx) => idx !== i))}
                >
                  {(item, index) => (
                    <div className="flex items-center gap-4">
                      <div className="flex-1"><FloatSelect label="Tipo de Atestado" value={item.tipo} onChange={(v) => setAtestados(p => p.map((a, idx) => idx === index ? { ...a, tipo: v } : a))} options={[{ value: "Brucelose", label: "Brucelose" }]} required /></div>
                      <div className="flex-1"><UploadField label="Arquivo do Exame" fileName={item.arquivo} onSelectFile={() => { }} required /></div>
                    </div>
                  )}
                </DynamicListWrapper>
              </div>
            </Section>

            <Section title="Observações">
              <LargeTextArea label="Observações" value={observacoes} onChange={setObservacoes} required />
            </Section>

            <Section title="Informações da ATA">
              <div className="flex flex-col gap-5">
                <SimNao
                  label="Possui motivo de isenção de taxa de ATA?"
                  name="possuiMotivoIsencaoAta"
                  required
                  value={possuiMotivoIsencao}
                  onChange={(possui) => {
                    setPossuiMotivoIsencao(possui);
                    if (!possui) setMotivoIsencao(null);
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {possuiMotivoIsencao === true && (
                    <EntitySearchInput
                      label="Motivo de Isenção de Taxa"
                      placeholder="Buscar motivo de isenção"
                      value={motivoIsencao ? motivoIsencao.nome : ""}
                      data={ISENCOES_MOCK}
                      searchKeys={["nome"]}
                      columns={[{ label: "Motivo", key: "nome" }]}
                      title="Buscar Motivo de Isenção de Taxa"
                      subtitle="Busque por um motivo de isenção cadastrado no sistema:"
                      onChange={(ent: any) => setMotivoIsencao(ent)}
                      icon={<img src={Icons.iconeIsencaoTaxaUrl} alt="Isenção" className="w-5 h-5 object-contain" />}
                    />
                  )}
                  <FloatInput label="Valor da ATA" value={motivoIsencao ? "R$ 0,00" : "R$ 8,56"} disabled />
                </div>
              </div>
            </Section>

            {/* Resumo final da ATA — valor e total de animais em destaque */}
            <div className="relative overflow-hidden rounded-2xl bg-[#1B4332] px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Marca-d'água: nota emitida */}
              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[190%] w-auto text-white/[0.035] rotate-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h5" />
                <path d="M8 17h8" />
                <path d="m15.5 10.5 1.5 1.5 3-3" />
              </svg>

              {/* Valor / Liquidação */}
              <div className="relative z-10">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8FBF9F]">
                  Valor Final da ATA
                  <CheckCircle2 size={14} className="text-[#8FBF9F]" />
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#6E9A7D] mt-0.5">
                  {motivoIsencao ? "Isenção aplicada" : "Total do documento"}
                </p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-lg font-semibold text-[#8FBF9F]">R$</span>
                  <span className="text-4xl font-bold text-white leading-none tracking-tight">
                    {motivoIsencao ? "0,00" : "8,56"}
                  </span>
                </div>
              </div>

              {/* Total de animais na ATA */}
              <div className="relative z-10 sm:ml-auto sm:border-l sm:border-white/15 sm:pl-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8FBF9F]">
                  Animais na ATA
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#6E9A7D] mt-0.5">
                  Total transportado neste documento
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-white leading-none tracking-tight">
                    {totalMachos(faixasAnimais) + totalFemeas(faixasAnimais)}
                  </span>
                  <span className="text-sm text-[#8FBF9F]">
                    ({totalMachos(faixasAnimais)} machos · {totalFemeas(faixasAnimais)} fêmeas)
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* MODAL DE CADASTRO INTERDITADO */}
      {modalInterdicao && interdicaoInfo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Faixa de alerta amarela */}
            <div className="bg-[#FBF0D9] px-6 py-5 flex items-start gap-3">
              <div className="text-[#C8912B] flex-shrink-0 mt-0.5">
                <AlertTriangle size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Cadastro Interditado</p>
                <p className="text-sm text-gray-600 mt-0.5">Cadastro impossibilitado de emitir GTA.</p>
                <p className="text-sm text-gray-600">O registro encontra-se interditado com suas atividades impedidas.</p>
              </div>
            </div>

            <div className="p-6">
              <div className="border border-gray-200 rounded-xl p-5">
                {/* Cabeçalho do estado */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-800">Estado do Cadastro</h4>
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={13} /> Início: {interdicaoInfo.inicio}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={13} /> Validade: {interdicaoInfo.validade}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Indica a condição específica do cadastro conforme regras ou determinações aplicáveis.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0C27B] bg-[#FBF0D9] px-3 py-1 text-xs font-semibold text-[#9A6B00] self-start whitespace-nowrap">
                    <Info size={13} /> Interditado
                  </span>
                </div>

                {/* Status de Cadastro */}
                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Status de Cadastro:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {interdicaoInfo.status.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>

                {/* Observação */}
                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-sm font-semibold text-gray-700">Observação</p>
                    <span className="text-red-500">*</span>
                    <Info size={13} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{interdicaoInfo.observacao}</p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setModalInterdicao(false)}
                  className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">ATA Gravada com Sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">A guia foi salva e está pronta para emissão.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("emissao-ata"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
