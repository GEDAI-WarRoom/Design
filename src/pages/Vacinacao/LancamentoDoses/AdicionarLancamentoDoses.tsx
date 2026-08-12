import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, PlusCircle, Trash2, Package, PillBottle } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, MultiSearchModal } from "../../../components/ui/FormKit";
import {
  EntitySearchInput,
  PRODUTORES_MOCK,
  REVENDEDORAS_MOCK,
  VETERINARIOS_MOCK,
  VACINADORES_BRUCELOSE_MOCK,
} from "../../../components/ui/EntitySearch";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { CadastroVacinacaoHeader, cadastroVacinacaoPageClass, mensagemSucessoCadastro, preencherComExemplo, type CadastroVacinacaoModeProps } from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS
// ==========================================================
type TipoDestinatario = "" | "produtor" | "vacinador" | "medico_veterinario" | "revendedora";

const TIPOS_DESTINATARIO: Array<{ value: Exclude<TipoDestinatario, "">; label: string }> = [
  { value: "produtor", label: "Produtor" },
  { value: "vacinador", label: "Vacinador" },
  { value: "medico_veterinario", label: "Médico Veterinário" },
  { value: "revendedora", label: "Revendedora de Produtos Agropecuários" },
];

const LOTES_VACINA_MOCK = [
  { id: 1, nome: "0013225/24", numeroPartida: "0013225/24", partida: "1", uf: "MG", dosesDisponiveisTotais: 120, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", tipoVacina: "B19", laboratorio: "BioMed/MG", validade: "20/12/2026", dosesPerFrasco: 20, quantidadeDoses: 0, quantidadeFrascos: 0, destinatarios: ["produtor:1", "revendedora:1", "vacinador:1"] },
  { id: 2, nome: "0013225/24", numeroPartida: "0013225/24", partida: "2", uf: "MG", dosesDisponiveisTotais: 80, fornecedor: "Distribuidora de Vacinas Alfa LTDA", doenca: "Brucelose", tipoVacina: "RB51", laboratorio: "BioMed/MG", validade: "20/12/2026", dosesPerFrasco: 20, quantidadeDoses: 0, quantidadeFrascos: 0, destinatarios: ["produtor:1", "produtor:2", "medico_veterinario:1"] },
  { id: 3, nome: "0014589/24", numeroPartida: "0014589/24", partida: "1", uf: "SP", dosesDisponiveisTotais: 250, fornecedor: "Comercial Agropecuária Beta S/A", doenca: "Raiva dos Herbívoros", tipoVacina: "", laboratorio: "Zoetis", validade: "15/08/2027", dosesPerFrasco: 25, quantidadeDoses: 0, quantidadeFrascos: 0, destinatarios: ["produtor:2", "revendedora:2", "vacinador:2"] },
  { id: 4, nome: "0015890/25", numeroPartida: "0015890/25", partida: "1", uf: "GO", dosesDisponiveisTotais: 50, fornecedor: "Laboratório Biovet Saúde Animal", doenca: "Febre Aftosa", tipoVacina: "O1 Campos", laboratorio: "Biovet", validade: "15/08/2027", dosesPerFrasco: 10, quantidadeDoses: 0, quantidadeFrascos: 0, destinatarios: ["produtor:3", "revendedora:1", "medico_veterinario:1", "vacinador:3"] },
];

function normalizarTipoDestinatario(valor: unknown): TipoDestinatario {
  if (valor === "Médico Veterinário" || valor === "vetarinario" || valor === "veterinario") return "medico_veterinario";
  if (valor === "Produtor") return "produtor";
  if (valor === "Vacinador") return "vacinador";
  if (valor === "Revendedora de Produtos Agropecuários") return "revendedora";
  return TIPOS_DESTINATARIO.some((tipo) => tipo.value === valor) ? valor as TipoDestinatario : "";
}

function documentoDestinatario(entidade: any) {
  return entidade?.documento ?? entidade?.cpf ?? entidade?.cnpj ?? entidade?.codigo ?? "";
}

function destinatariosPorTipo(tipo: TipoDestinatario) {
  if (tipo === "produtor") return PRODUTORES_MOCK;
  if (tipo === "vacinador") return VACINADORES_BRUCELOSE_MOCK;
  if (tipo === "medico_veterinario") return VETERINARIOS_MOCK;
  if (tipo === "revendedora") return REVENDEDORAS_MOCK;
  return [];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/70 hover:bg-gray-100/70 border-b border-gray-100 select-none text-left transition-colors"
      >
        <span className="text-sm font-bold text-gray-700">{title}</span>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

interface PageProps extends CadastroVacinacaoModeProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarLancamentoDosesVacinaPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const preenchendoRegistro = mode !== "create";
  const idPartidaInicial = `partida-${dados?.id ?? "registro"}`;
  const tipoInicial = normalizarTipoDestinatario(
    dados?.tipoDestinatario ?? (dados?.revendedoraNome ? "revendedora" : ""),
  ) || (preenchendoRegistro ? "produtor" : "");
  const destinatarioInicial = dados?.destinatarioEntidade
    ?? (typeof dados?.destinatario === "object" ? dados.destinatario : null)
    ?? ((dados?.destinatarioNome || dados?.revendedoraNome) ? {
      id: dados?.destinatarioId ?? dados?.id ?? 1,
      nome: dados?.destinatarioNome ?? dados?.revendedoraNome,
      documento: dados?.destinatarioDocumento,
      codigo: dados?.destinatarioDocumento ?? dados?.revendedoraCodigo,
    } : null)
    ?? (preenchendoRegistro ? PRODUTORES_MOCK[0] : null);
  const [tipoDestinatario, setTipoDestinatario] = useState<TipoDestinatario>(tipoInicial);
  const [destinatario, setDestinatario] = useState<any | null>(destinatarioInicial);
  const [lancamentos, setLancamentos] = useState<Record<string, { dosesLancadas: string; justificativa: string }>>(dados?.lancamentos ?? (preenchendoRegistro ? {
    [idPartidaInicial]: { dosesLancadas: String(dados?.quantidadeDoses ?? 20), justificativa: dados?.justificativa ?? `Ajuste referente a ${dados?.tipoLancamento ?? "conferência de estoque"}.` }
  } : {}));
  const [isSucesso, setIsSucesso] = useState(false);
  const [errosObrigatorios, setErrosObrigatorios] = useState({ tipo: false, destinatario: false, lote: false });

  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>(dados?.notasFiscaisOrigem ?? (preenchendoRegistro ? [{
    id: idPartidaInicial,
    nome: dados?.numeroPartida ?? "025/24",
    numeroPartida: dados?.numeroPartida ?? "025/24",
    laboratorio: dados?.laboratorio ?? "Laboratório BioMed",
    doenca: dados?.doenca ?? "Brucelose",
    tipoVacina: dados?.tipoVacina ?? "B19",
    validade: dados?.validade ?? "20/12/2026",
    dosesDisponiveisTotais: dados?.quantidadeDosesDisponiveis ?? 100,
    dosesPerFrasco: dados?.dosesPerFrasco ?? 20,
    quantidadeDoses: dados?.quantidadeDoses ?? 20,
    quantidadeFrascos: dados?.quantidadeFrascos ?? 1,
  }] : []));
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});

  const destinatariosDisponiveis = destinatariosPorTipo(tipoDestinatario);
  const destinatarioSelecionado = destinatario;
  const chaveDestinatario = tipoDestinatario && destinatarioSelecionado
    ? `${tipoDestinatario}:${destinatarioSelecionado.id}`
    : "";
  const lotesDisponiveis = LOTES_VACINA_MOCK
    .filter((lote) => chaveDestinatario && lote.destinatarios.includes(chaveDestinatario))
    .map((lote) => ({
      ...lote,
      doencaComTipo: lote.tipoVacina ? `${lote.doenca} (${lote.tipoVacina})` : lote.doenca,
    }));

  const validarEGravar = () => {
    const erros = {
      tipo: !tipoDestinatario,
      destinatario: !destinatarioSelecionado,
      lote: notasFiscaisOrigem.length === 0,
    };
    setErrosObrigatorios(erros);
    if (Object.values(erros).some(Boolean)) return;
    setIsSucesso(true);
  };

  const registroAtual = preencherComExemplo({
    ...(dados ?? {}),
    id: dados?.id ?? `ajuste-dose-${Date.now()}`,
    tipoDestinatario,
    destinatario: destinatarioSelecionado,
    destinatarioEntidade: destinatarioSelecionado,
    destinatarioId: destinatarioSelecionado?.id,
    destinatarioNome: destinatarioSelecionado?.nome,
    destinatarioDocumento: documentoDestinatario(destinatarioSelecionado),
    numeroPartida: notasFiscaisOrigem[0]?.numeroPartida ?? notasFiscaisOrigem[0]?.nome,
    doenca: notasFiscaisOrigem[0]?.doenca,
    tipoVacina: notasFiscaisOrigem[0]?.tipoVacina,
    situacao: dados?.situacao ?? "Gravada",
    notasFiscaisOrigem,
    lancamentos,
  }, {
    id: "ajuste-dose-exemplo",
    tipoDestinatario: "produtor",
    destinatario: PRODUTORES_MOCK[0],
    destinatarioEntidade: PRODUTORES_MOCK[0],
    destinatarioId: PRODUTORES_MOCK[0].id,
    destinatarioNome: PRODUTORES_MOCK[0].nome,
    destinatarioDocumento: PRODUTORES_MOCK[0].documento,
    numeroPartida: "0013225/24",
    doenca: "Brucelose",
    tipoVacina: "B19",
    situacao: "Gravada",
    notasFiscaisOrigem: [{
      id: "partida-exemplo", nome: "0013225/24", numeroPartida: "0013225/24", laboratorio: "Laboratório BioMed",
      doenca: "Brucelose", tipoVacina: "B19", validade: "20/12/2026", dosesDisponiveisTotais: 100,
      dosesPerFrasco: 20, quantidadeDoses: 20, quantidadeFrascos: 1,
    }],
    lancamentos: { "partida-exemplo": { dosesLancadas: "20", justificativa: "Ajuste de exemplo para conferência de estoque." } },
  });

  return (
    <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5]")}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-doses-vacina" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("lancamento-doses-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos Ajustes de Doses de Vacina
          </button>
          <CadastroVacinacaoHeader mode={mode} nomeCadastro="Ajuste de Doses de Vacina" rotaEditar="editar-lancamento-doses-vacina" dados={dados} onNavigate={onNavigate} onSubmit={validarEGravar} />
        </div>

        {/* ALERTA */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <FloatSelect
                label="Tipo de Destinatário"
                value={tipoDestinatario}
                options={TIPOS_DESTINATARIO}
                onChange={(valor) => {
                  setTipoDestinatario(valor as TipoDestinatario);
                  setDestinatario(null);
                  setNotasFiscaisOrigem([]);
                  setLancamentos({});
                  setErrosObrigatorios((atual) => ({ ...atual, tipo: false, destinatario: false, lote: false }));
                }}
                required
              />
              {errosObrigatorios.tipo && (
                <p className="mt-1 text-xs text-red-500">Informe o tipo de destinatário.</p>
              )}
            </div>

            {tipoDestinatario && (
              <div>
                <EntitySearchInput
                  label="Destinatário"
                  placeholder="Buscar por nome ou CPF/CNPJ."
                  value={destinatarioSelecionado?.nome ?? ""}
                  data={destinatariosDisponiveis}
                  searchKeys={["nome", "documento", "cpf", "codigo"]}
                  columns={[
                    { label: tipoDestinatario === "revendedora" ? "Razão Social" : "Nome", key: "nome" },
                    { label: tipoDestinatario === "revendedora" ? "CNPJ / Código" : "CPF", key: tipoDestinatario === "medico_veterinario" ? "cpf" : tipoDestinatario === "revendedora" ? "codigo" : "documento" },
                  ]}
                  title={`Buscar ${TIPOS_DESTINATARIO.find((tipo) => tipo.value === tipoDestinatario)?.label ?? "Destinatário"}`}
                  subtitle="Selecione um destinatário cadastrado no sistema:"
                  icon={<Package size={20} color={GREEN} />}
                  onChange={(entidadeSelecionada) => {
                    setDestinatario(entidadeSelecionada);
                    setNotasFiscaisOrigem([]);
                    setLancamentos({});
                    setErrosObrigatorios((atual) => ({ ...atual, destinatario: false, lote: false }));
                  }}
                  required
                  error={errosObrigatorios.destinatario}
                />
                {errosObrigatorios.destinatario && (
                  <p className="mt-1 text-xs text-red-500">Selecione o destinatário.</p>
                )}
              </div>
            )}

            {destinatarioSelecionado && (
              <FloatInput
                label="CPF/CNPJ do Destinatário"
                value={documentoDestinatario(destinatarioSelecionado)}
                disabled
                required
                className="md:col-start-2"
              />
            )}
          </div>
        </Section>

        {/* Seção 2: Saldo de Vacinas */}
        <Section title="Saldo de Vacinas">
          <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-semibold">
                      Adquiridas <span className="text-red-500">*</span>
                    </span>
                    <span className="text-xs text-gray-400">Selecione um ou mais lotes vinculados ao destinatário.</span>
                  </div>

                {notasFiscaisOrigem.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg animate-fadeIn">
                    <span className="text-[11px] font-semibold text-gray-500">DOSES LANÇADAS:</span>
                    <span className="text-[11px] font-black text-[#1A7A3C]">
                      {notasFiscaisOrigem.reduce((sum, item) => sum + (item.quantidadeDoses || 0), 0)} doses
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!destinatarioSelecionado}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalNotaOrigemOpen(true);
                }}
                className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border w-fit transition shadow-sm ${destinatarioSelecionado
                  ? "border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 cursor-pointer"
                  : "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
              >
                <PlusCircle size={18} />
                Adicionar Lote
              </button>
            </div>

            {destinatarioSelecionado && (
              <FloatInput
                label="Lote"
                value={notasFiscaisOrigem.map((lote) => lote.numeroPartida ?? lote.nome).join(", ")}
                placeholder="Selecione um ou mais lotes de vacina."
                icon={<Package size={18} color={GREEN} />}
                onClick={() => setModalNotaOrigemOpen(true)}
                required
              />
            )}

            {/* CONDICIONAL 1: Sem destinatário selecionado */}
            {!destinatarioSelecionado && (
              <div className="text-left py-4">
                <p className="text-xs text-gray-400 italic">É necessário selecionar um destinatário para pesquisar os lotes de vacina disponíveis.</p>
              </div>
            )}

            {/* CONDICIONAL 2: Destinatário selecionado, mas nenhum lote adicionado */}
            {destinatarioSelecionado && notasFiscaisOrigem.length === 0 && (
              <div className="w-full border border-dashed border-gray-200 rounded-xl py-8 px-4 text-center bg-gray-50/20">
                <p className="text-sm text-gray-400 italic">Nenhum lote vinculado a este ajuste até o momento.</p>
              </div>
            )}

            {errosObrigatorios.lote && (
              <p className="text-xs text-red-500">Selecione ao menos um lote de vacina.</p>
            )}

            {notasFiscaisOrigem.length > 0 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {Object.values(
                  notasFiscaisOrigem.reduce((acc: Record<string, any>, item) => {
                    if (!acc[item.nome]) {
                      acc[item.nome] = { nome: item.nome, partidas: [] };
                    }
                    acc[item.nome].partidas.push(item);
                    return acc;
                  }, {})
                ).map((grupo: any) => {
                  const isNotaMinimizada = notasListasMinimizadas[grupo.nome] || false;
                  const lotePrincipal = grupo.partidas[0];
                  const numeroLote = String(grupo.nome).replace(/^Lote:\s*/i, "");
                  const dosesTotaisLote = grupo.partidas.reduce(
                    (total: number, partida: any) => total + Number(partida.dosesDisponiveisTotais || 0),
                    0
                  );

                  return (
                    <div key={`grupo-${grupo.nome}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 relative">
                      {/* Cabeçalho do Lote */}
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2 select-none">
                          <Package size={24} color={GREEN} />

                          <span className="text-sm font-bold text-gray-800">Lote: {numeroLote}</span>

                          {/* Tooltip com os detalhes do lote */}
                          <div className="relative group/lote-info flex-shrink-0 z-20">
                            <Info size={14} className="text-gray-400 cursor-help" />
                            <div className="fixed inset-0 bg-black/15 hidden group-hover/lote-info:block pointer-events-none z-[998] animate-fadeIn" />
                            <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl hidden group-hover/lote-info:block animate-fadeIn z-[999] text-left overflow-hidden">
                              <div className="flex items-center gap-1.5 border-b border-gray-100 p-3">
                                <Package size={13} className="text-gray-500" />
                                <span className="text-[11px] font-extrabold text-gray-800">Nº de Partida: {numeroLote}</span>
                              </div>
                              <div className="p-3 flex flex-col gap-2.5 text-[11px] text-gray-500 bg-white">
                                <div className="flex justify-between items-center gap-3">
                                  <span>Doença:</span>
                                  <span className="font-bold text-gray-700 text-right">{lotePrincipal?.doenca || "—"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Tipo de Vacina:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.tipoVacina || "B19"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Laboratório:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.laboratorio || "Biovet"}</span>
                                </div>
                                <div className="flex justify-between items-center gap-3">
                                  <span>Validade:</span>
                                  <span className="font-bold text-gray-700">{lotePrincipal?.validade || "15/08/2027"}</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between items-center text-[11px] font-bold text-green-700">
                                <span>Doses Totais Lote:</span>
                                <span>{dosesTotaisLote}</span>
                              </div>
                            </div>
                          </div>

                          {isNotaMinimizada && (
                            <span className="text-[11px] text-gray-400 font-medium normal-case">
                              ({grupo.partidas.length} {grupo.partidas.length === 1 ? 'partida oculta' : 'partidas ocultas'})
                            </span>
                          )}
                        </div>

                        {/* Ações do Lote */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setNotasListasMinimizadas(prev => ({ ...prev, [grupo.nome]: !isNotaMinimizada }))}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded transition hover:bg-gray-100"
                            title={isNotaMinimizada ? "Expandir lote" : "Minimizar lote"}
                          >
                            {isNotaMinimizada ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.nome !== grupo.nome));
                            }}
                            className="text-gray-400 hover:text-red-500 p-1 rounded transition hover:bg-red-50"
                            title="Remover lote"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {!isNotaMinimizada && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-slideDown">
                          {grupo.partidas.map((nfItem: any) => {
                            const DOSES_POR_FRASCO = nfItem.dosesPerFrasco || 20;
                            const TOTAL_DISPONIVEL = nfItem.dosesDisponiveisTotais || 100;
                            const validadeLote = nfItem.validade || "20/12/2026";

                            const verificarVencimento = (dataStr: string) => {
                              if (!dataStr) return false;
                              const [dia, mes, ano] = dataStr.split("/").map(Number);
                              const dataValidade = new Date(ano, mes - 1, dia);
                              return dataValidade < new Date();
                            };
                            const isVencido = verificarVencimento(validadeLote);

                            const dosesDescartadas = Math.min(10, TOTAL_DISPONIVEL);
                            const dosesVendidas = Math.min(30, Math.max(0, TOTAL_DISPONIVEL - dosesDescartadas));
                            const dadosGrafico = isVencido
                              ? [
                                { name: "Disponíveis", value: 0, color: "#22c55e" },
                                { name: "Vendidas", value: 0, color: "#3b82f6" },
                                { name: "Vencidas", value: TOTAL_DISPONIVEL, color: "#ef4444" },
                                { name: "Descartadas", value: 0, color: "#9ca3af" },
                              ]
                              : [
                                { name: "Disponíveis", value: Math.max(0, TOTAL_DISPONIVEL - dosesVendidas - dosesDescartadas), color: "#22c55e" },
                                { name: "Vendidas", value: dosesVendidas, color: "#3b82f6" },
                                { name: "Vencidas", value: 0, color: "#ef4444" },
                                { name: "Descartadas", value: dosesDescartadas, color: "#9ca3af" },
                              ];

                            const estaAtivoNesteLote = graficoAtivo?.loteId === nfItem.id;
                            const fatiaAtiva = estaAtivoNesteLote ? dadosGrafico[graficoAtivo.index] : null;
                            const totalDosesGrafico = dadosGrafico.reduce((s, d) => s + d.value, 0);
                            const porcentagem = fatiaAtiva ? ((fatiaAtiva.value / totalDosesGrafico) * 100).toFixed(1) : null;

                            const DOSES_DISPONIVEIS = dadosGrafico.find(d => d.name === "Disponíveis")?.value ?? 0;
                            const FRASCOS_DISPONIVEIS = Math.floor(DOSES_DISPONIVEIS / DOSES_POR_FRASCO);

                            const isLoteMinimizado = lotesMinimizados[nfItem.id] || false;

                            return (
                              <div
                                key={`lote-${nfItem.id}`}
                                className={`border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col overflow-visible relative group transition-all duration-200 h-auto ${isLoteMinimizado ? "p-2.5 pb-2 justify-start" : "p-4 justify-between"
                                  }`}
                              >
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                  <button
                                    type="button"
                                    onClick={() => setLotesMinimizados(prev => ({ ...prev, [nfItem.id]: !isLoteMinimizado }))}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition hover:bg-gray-100"
                                    title={isLoteMinimizado ? "Expandir Lote" : "Minimizar Lote"}
                                  >
                                    {isLoteMinimizado ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setNotasFiscaisOrigem(notasFiscaisOrigem.filter(item => item.id !== nfItem.id))}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition hover:bg-red-50"
                                    title="Remover Lote"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>

                                <div className={`flex items-center justify-between border-gray-100 overflow-visible pr-14 ${isLoteMinimizado ? "border-none pb-0 mb-0" : "border-b pb-2 mb-3"
                                  }`}>
                                  <div className="flex items-center gap-2 overflow-visible">
                                    <span className="text-xs font-semibold text-gray-800 select-none">
                                      Apresentação
                                    </span>

                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                      <PillBottle size={10} className="text-gray-400" />
                                      {DOSES_POR_FRASCO} doses/frasco
                                    </span>

                                    {isLoteMinimizado && (
                                      <span className="text-[11px] text-gray-400 font-medium ml-2 animate-fadeIn">
                                        ({DOSES_DISPONIVEIS} disp. · {nfItem.quantidadeDoses || 0} lançadas)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {!isLoteMinimizado && (
                                  <div className="animate-slideDown">
                                    <div className="flex items-center gap-4 z-10 mt-3">

                                      <div className="w-24 h-24 flex items-center justify-center relative select-none">
                                        <PieChart width={96} height={96} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                          <Pie
                                            data={dadosGrafico}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={26}
                                            outerRadius={35}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            activeIndex={estaAtivoNesteLote ? graficoAtivo.index : undefined}
                                            activeShape={renderActiveShape}
                                            onMouseEnter={(_, index) => setGraficoAtivo({ loteId: nfItem.id, index })}
                                            onMouseLeave={() => setGraficoAtivo(null)}
                                          >
                                            {dadosGrafico.map((entry, idx) => (
                                              <Cell
                                                key={`cell-${idx}`}
                                                fill={entry.color}
                                                className="cursor-pointer transition-all duration-200 outline-none"
                                              />
                                            ))}
                                          </Pie>
                                        </PieChart>

                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                          {fatiaAtiva ? (
                                            <div className="flex flex-col items-center justify-center">
                                              <span className="text-xs font-bold leading-none animate-fadeIn" style={{ color: fatiaAtiva.color }}>
                                                {fatiaAtiva.value}
                                              </span>
                                              <span className="text-[7px] text-gray-500 font-semibold leading-tight uppercase truncate max-w-[50px] mt-0.5 animate-fadeIn">
                                                {fatiaAtiva.name}
                                              </span>
                                              <span className="text-[8px] font-bold mt-0.5 animate-fadeIn" style={{ color: fatiaAtiva.color }}>
                                                {porcentagem}%
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center justify-center">
                                              <span className="text-base font-black text-gray-800 leading-none">
                                                {totalDosesGrafico}
                                              </span>
                                              <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                                Total
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-2 flex-1 justify-start items-stretch">

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-gray-50/80 justify-between">
                                          <span className="text-[11px] text-gray-600 font-medium text-center">Disponíveis</span>

                                          <div className="flex gap-2 items-end justify-center py-0.5">
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">
                                                {FRASCOS_DISPONIVEIS}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Frascos</span>
                                            </div>
                                            <div className="flex flex-col items-center flex-1">
                                              <span className="text-sm font-bold text-gray-700 leading-none">
                                                {DOSES_DISPONIVEIS}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-medium mt-0.5">Doses</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col border border-gray-200 rounded-xl px-2.5 py-2 w-full max-w-[130px] gap-1 bg-white justify-between">
                                          <span className="text-[11px] text-gray-500 font-medium text-center">Lançadas <span className="text-red-500">*</span></span>

                                          <div className="flex gap-1.5 items-end justify-center">
                                            <div className="flex flex-col flex-1 min-w-[40px]">
                                              <input
                                                type="number"
                                                min="0"
                                                value={nfItem.quantidadeFrascos || ""}
                                                placeholder="0"
                                                onChange={(e) => {
                                                  const f = Number(e.target.value);
                                                  const d = f * DOSES_POR_FRASCO;
                                                  setNotasFiscaisOrigem(notasFiscaisOrigem.map(item =>
                                                    item.id === nfItem.id ? { ...item, quantidadeDoses: d, quantidadeFrascos: f } : item
                                                  ));
                                                }}
                                                className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                              <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Frascos</span>
                                            </div>

                                            <div className="flex flex-col flex-1 min-w-[40px]">
                                              <input
                                                type="number"
                                                min="0"
                                                value={nfItem.quantidadeDoses || ""}
                                                placeholder="0"
                                                onChange={(e) => {
                                                  const d = Number(e.target.value);
                                                  const f = Math.ceil(d / DOSES_POR_FRASCO);
                                                  setNotasFiscaisOrigem(notasFiscaisOrigem.map(item =>
                                                    item.id === nfItem.id ? { ...item, quantidadeDoses: d, quantidadeFrascos: f } : item
                                                  ));
                                                }}
                                                className="w-full text-center bg-white border border-gray-200 rounded-lg text-xs font-black p-1 focus:outline-none focus:border-[#1A7A3C] text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                              <span className="text-[9px] text-gray-400 font-semibold text-center mt-0.5">Doses</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Campo de Justificativa */}
                                    <div className="w-full mt-4 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex flex-col justify-center text-left focus-within:border-[#1A7A3C] shadow-sm transition-colors">
                                      <span className="text-[10px] font-regular text-gray-500 select-none tracking-wide mb-0.5">
                                        Justificativa
                                      </span>

                                      <input
                                        type="text"
                                        value={lancamentos[nfItem.id]?.justificativa || ""}
                                        onChange={(e) => {
                                          setLancamentos(prev => ({
                                            ...prev,
                                            [nfItem.id]: {
                                              dosesLancadas: String(nfItem.quantidadeDoses || 0),
                                              justificativa: e.target.value
                                            }
                                          }));
                                        }}
                                        className="w-full bg-transparent border-none text-xs p-0 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-300 h-5"
                                      />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3 pt-2 border-t border-gray-100 text-[9px] z-10">
                                      {dadosGrafico.map((item) => (
                                        <div key={item.name} className="flex items-center gap-1 bg-gray-50 px-1 py-0.5 rounded border border-gray-100">
                                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                                          <span className="text-gray-400 font-medium">{item.name}:</span>
                                          <span className="font-bold text-gray-600">{item.value}</span>
                                        </div>
                                      ))}


                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Section>
      </main>

      <MultiSearchModal
        open={modalNotaOrigemOpen}
        onClose={() => setModalNotaOrigemOpen(false)}
        title="Buscar Lotes de Vacina"
        subtitle={`Selecione os lotes de vacina disponíveis para ${destinatarioSelecionado?.nome ?? "o destinatário"}:`}
        icon={<Package size={24} color={GREEN} />}
        data={lotesDisponiveis}
        searchKeys={["nome", "partida", "doenca", "tipoVacina", "fornecedor", "uf"]}
        searchPlaceholder="Busque por lote ou doença."
        columns={[
          { label: "Lote/ Nº de Partida", key: "nome" },
          { label: "Vacina", key: "doencaComTipo" },
          { label: "Saldo da Apresentação", key: "dosesDisponiveisTotais" },
          { label: "UF", key: "uf" }
        ]}
        selectedItems={notasFiscaisOrigem}
        onConfirm={(selectedValues) => {
          setNotasFiscaisOrigem(selectedValues);
          setErrosObrigatorios((atual) => ({ ...atual, lote: selectedValues.length === 0 }));
        }}
        showResultsOnOpen
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{mensagemSucessoCadastro(mode, "Ajuste de Doses de Vacina")}</h3>
            <p className="text-sm text-gray-500 mt-1">O registro foi gravado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("lancamento-doses-vacina"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-lancamento-doses-vacina", registroAtual); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
