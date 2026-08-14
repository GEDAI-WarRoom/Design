import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Info,
  Loader2,
  Pencil,
  QrCode,
  ReceiptText,
  ScanBarcode,
  Settings,
  Truck,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import { EmissaoGtaForm } from "./EmissaoGtaForm";
import {
  copiarEmissaoGta,
  dataPadraoValidade,
  emitirEmissaoGta,
  estenderValidadeEmissaoGta,
  formatarDataGta,
  formatarMoedaGta,
  frigorificoAderidoAoFundo,
  gerarDadosPagamentoGta,
  obterEmissaoGta,
  obterPrazoAtualGta,
  pagarEmissaoGta,
  ultimoDiaUtilDoAno,
  type EmissaoGta,
} from "./emissaoGtaData";
import { adicionarPendenciaConfirmacaoGta } from "../PendenciasConfirmacao/pendenciasConfirmacaoGtaData";

// Importação da imagem do DAE a partir do diretório do projeto
import daeExemploImg from "../../../imports/documents/dae-exemplo.jpeg";

function ManagementMenuItem({
  icon,
  children,
  onClick,
  danger = false,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative z-10 flex min-h-[44px] w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-all hover:bg-[#F3FBF5] ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:text-[#1A7A3C]"
        }`}
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${danger
          ? "bg-red-100 text-red-600 group-hover:bg-red-200"
          : "bg-[#E6F4EA] text-[#1A7A3C] group-hover:bg-[#1A7A3C] group-hover:text-white"
          }`}
      >
        {icon}
      </span>
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

const ETAPAS_CICLO_GTA = [
  { status: "Gravada", label: "Gravada", campo: "dataGravacao" },
  { status: "Aguardando Pagamento", label: "Aguardando pagamento", campo: "dataGeracaoPagamento" },
  { status: "Paga", label: "Paga", campo: "dataPagamento" },
  { status: "Emitida", label: "Emitida", campo: "dataEmissao" },
  { status: "Transitada", label: "Transitada", campo: "dataTransito" },
] as const;

function iconeEtapaAtual(status: EmissaoGta["situacao"]) {
  if (status === "Gravada") return <FileText size={17} />;
  if (status === "Aguardando Pagamento") return <Clock size={17} />;
  if (status === "Paga") return <Check size={17} />;
  if (status === "Emitida") return <ArrowRight size={17} />;
  if (status === "Transitada") return <Truck size={17} />;
  return null;
}

function mascararDataBrasileira(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

function dataBrasileiraParaIso(valor: string) {
  const correspondencia = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!correspondencia) return "";
  const [, dia, mes, ano] = correspondencia;
  const iso = `${ano}-${mes}-${dia}`;
  const data = new Date(`${iso}T00:00:00`);
  if (
    Number.isNaN(data.getTime()) ||
    data.getFullYear() !== Number(ano) ||
    data.getMonth() + 1 !== Number(mes) ||
    data.getDate() !== Number(dia)
  ) return "";
  return iso;
}

function CicloVidaGta({ emissao }: { emissao: EmissaoGta }) {
  const cancelada = emissao.situacao === "Cancelada";
  const indiceAtual = ETAPAS_CICLO_GTA.findIndex((etapa) => etapa.status === emissao.situacao);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Etapas da Emissão da GTA</h2>
          <p className="mt-1 text-xs text-gray-500">Acompanhe o andamento do processo de emissão.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="relative grid min-w-[760px] grid-cols-5 items-start">
          <div className="absolute left-[10%] right-[10%] top-[19px] border-t border-dashed border-gray-200" />
          {!cancelada && indiceAtual >= 0 && (
            <div
              className="absolute left-[10%] top-[19px] border-t border-dashed border-[#1A7A3C]"
              style={{ width: `${indiceAtual * 20}%` }}
            />
          )}
          {ETAPAS_CICLO_GTA.map((etapa, index) => {
            const concluida = !cancelada && indiceAtual > index;
            const atual = !cancelada && indiceAtual === index;
            const data = emissao[etapa.campo];
            return (
              <div key={etapa.status} className="relative z-10 flex min-w-0 flex-col items-center text-center">
                  <span className="flex h-10 w-10 items-center justify-center">
                    {atual ? (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A7A3C] text-white shadow-[0_2px_6px_rgba(26,122,60,0.22)]">
                        {iconeEtapaAtual(etapa.status)}
                      </span>
                    ) : concluida ? (
                      <span className="h-3.5 w-3.5 rounded-full bg-[#1A7A3C]" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-200 bg-white" />
                    )}
                  </span>
                  <span className={`mt-2 text-xs font-semibold ${atual ? "text-[#1A7A3C]" : concluida ? "text-gray-800" : "text-gray-400"}`}>{etapa.label}</span>
                  <span className="mt-0.5 text-[11px] text-gray-400">{data ? formatarDataGta(data) : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {cancelada && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <X size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">GTA cancelada — ciclo interrompido</p>
            <p className="mt-0.5 text-xs text-red-600">{emissao.observacaoCancelamento || "O cancelamento é definitivo e não pode ser revertido."}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function VisualizarEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: EmissaoGta | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const registroInicial = dados ?? obterEmissaoGta(null);
  const [emissao, setEmissao] = useState<EmissaoGta | null>(registroInicial);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [etapaPagamento, setEtapaPagamento] = useState<
    "opcoes" | "pix" | "boleto" | "cartao"
  >("opcoes");
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [carregandoPagamento, setCarregandoPagamento] = useState(false);
  const dataEmissaoHoje = new Date().toISOString().slice(0, 10);
  const [modalExtensaoValidadeAberto, setModalExtensaoValidadeAberto] = useState(false);
  const [novaDataValidade, setNovaDataValidade] = useState("");
  const [justificativaValidade, setJustificativaValidade] = useState("");
  const [tentouEstenderValidade, setTentouEstenderValidade] = useState(false);

  // Modal para pré-visualização do documento DAE/Boleto
  const [modalDaeAberto, setModalDaeAberto] = useState(false);
  const [modalBoletoAberto, setModalBoletoAberto] = useState(false);

  // Timer para expiração do Pix (15 minutos = 900 segundos)
  const [tempoRestantePix, setTempoRestantePix] = useState(900);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modalPagamento && etapaPagamento === "pix" && !pagamentoConfirmado) {
      interval = setInterval(() => {
        setTempoRestantePix((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTempoRestantePix(900);
    }
    return () => clearInterval(interval);
  }, [modalPagamento, etapaPagamento, pagamentoConfirmado]);

  const formatarTempoPix = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!menuAberto) return;

    const fecharMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    };
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuAberto(false);
    };

    document.addEventListener("mousedown", fecharMenu);
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      document.removeEventListener("mousedown", fecharMenu);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  if (!emissao) return null;

  // Definição da Data de Vencimento Exemplo
  const dataVencimentoExemplo = formatarDataGta(emissao.dataValidade);
  const prazoEtapaAtual = formatarDataGta(obterPrazoAtualGta(emissao));

  const downloadMock = (documento: string) => {
    window.alert(
      `${documento} de ${emissao.serieNumero} preparado para download no protótipo.`,
    );
  };

  // Regras de exibição das opções do menu
  const aguardaGeracaoPagamento = emissao.situacao === "Gravada";
  const temPagamentoPendente = emissao.situacao === "Aguardando Pagamento";
  const frigorificoAderido = frigorificoAderidoAoFundo(emissao.destino, emissao.finalidade);
  const pagamentoConcluido = ["Paga", "Emitida", "Transitada"].includes(emissao.situacao);
  const documentoPagamentoDisponivel = ["Aguardando Pagamento", "Paga", "Emitida"].includes(emissao.situacao);
  const foiEmitida = ["Emitida", "Transitada"].includes(emissao.situacao);
  const podeBaixarGta = ["Aguardando Pagamento", "Paga", "Emitida"].includes(emissao.situacao);
  const podeEmitir = emissao.situacao === "Paga";
  const podeEstenderValidade = emissao.situacao === "Emitida";
  const podeCancelar = !["Cancelada", "Transitada"].includes(emissao.situacao);

  const executarAcao = (acao: () => void) => {
    setMenuAberto(false);
    acao();
  };

  const abrirModalPagamento = () => {
    setEtapaPagamento("opcoes");
    setPagamentoConfirmado(false);
    setCarregandoPagamento(false);
    setModalPagamento(true);
  };

  const gerarDadosPagamento = () => {
    const atualizada = gerarDadosPagamentoGta(emissao.id);
    if (!atualizada) return;

    setEmissao({ ...atualizada });
    abrirModalPagamento();
  };

  const simularPagamentoPix = () => {
    if (carregandoPagamento || pagamentoConfirmado) return;
    setCarregandoPagamento(true);

    setTimeout(() => {
      const atualizada = pagarEmissaoGta(emissao.id);
      if (atualizada) {
        setEmissao({ ...atualizada });
        setPagamentoConfirmado(true);
      }
      setCarregandoPagamento(false);
    }, 1800);
  };

  const abrirVisualizadorDae = () => {
    setModalPagamento(false);
    setModalDaeAberto(true);
  };

  const fecharVisualizadorDae = () => {
    setModalDaeAberto(false);
  };

  const abrirVisualizadorBoleto = () => {
    setModalPagamento(false);
    setModalBoletoAberto(true);
  };

  const pagar = () => {
    if (temPagamentoPendente) {
      abrirModalPagamento();
      return;
    }
    window.alert("Esta emissão não possui pagamento pendente.");
  };

  const emitir = () => {
    if (!podeEmitir) {
      window.alert("A GTA precisa estar paga para ser emitida.");
      return;
    }
    const atualizada = emitirEmissaoGta(
      emissao.id,
      dataPadraoValidade(dataEmissaoHoje),
      "",
    );
    if (atualizada) {
      adicionarPendenciaConfirmacaoGta(atualizada);
      setEmissao({ ...atualizada });
    }
  };

  const limiteValidadeAno = ultimoDiaUtilDoAno(Number((emissao.dataEmissao || dataEmissaoHoje).slice(0, 4)));
  const novaDataValidadeIso = dataBrasileiraParaIso(novaDataValidade);
  const extensaoValidadeValida = Boolean(
    novaDataValidadeIso > emissao.dataValidade &&
    novaDataValidadeIso <= limiteValidadeAno &&
    justificativaValidade.trim(),
  );

  const abrirExtensaoValidade = () => {
    if (!podeEstenderValidade) return;
    setNovaDataValidade("");
    setJustificativaValidade("");
    setTentouEstenderValidade(false);
    setModalExtensaoValidadeAberto(true);
  };

  const confirmarExtensaoValidade = () => {
    setTentouEstenderValidade(true);
    if (!podeEstenderValidade || !extensaoValidadeValida) return;
    const atualizada = estenderValidadeEmissaoGta(
      emissao.id,
      novaDataValidadeIso,
      justificativaValidade,
    );
    if (!atualizada) return;
    setEmissao({ ...atualizada });
    setModalExtensaoValidadeAberto(false);
  };

  const cancelar = () => {
    if (emissao.situacao === "Cancelada") {
      window.alert("Esta GTA já está cancelada.");
      return;
    }
    onNavigate("cancelar-emissao-gta", emissao);
  };

  const baixarGta = () => {
    if (!podeBaixarGta) {
      window.alert("A GTA estará disponível para download após a emissão.");
      return;
    }
    onNavigate("documento-emissao-gta", emissao);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-7 md:px-6">
        <header className="border-b border-gray-200 pb-7">
          <button
            type="button"
            onClick={() => onNavigate("emissao-gta")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#1A7A3C] hover:text-[#15612F]"
          >
            <ArrowLeft size={14} />
            Todas Emissões de GTA
          </button>
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Emissão GTA
            </h1>

            <div ref={menuRef} className="relative flex-shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuAberto}
                onClick={() => setMenuAberto((aberto) => !aberto)}
                className="flex h-11 items-center justify-center gap-2.5 rounded-lg bg-[#1A7A3C] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15612F] active:bg-[#0E4722]"
              >
                <Settings size={15} /> Gerenciar GTA
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${menuAberto ? "rotate-180" : ""}`}
                />
              </button>

              {menuAberto && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuAberto(false)}
                  />

                  <div className="absolute right-0 mt-2 w-60 rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden py-1">
                    {aguardaGeracaoPagamento && (
                      <>
                        <button
                          type="button"
                          onClick={() => executarAcao(() => onNavigate("adicionar-emissao-gta", emissao))}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                          <Pencil size={15} className="text-gray-400" /> Editar dados
                        </button>
                        <button
                          type="button"
                          onClick={() => executarAcao(gerarDadosPagamento)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                        <ReceiptText size={15} className="text-gray-400" /> Emitir dados de pagamento
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                      </>
                    )}

                    {/* OPÇÕES DE PAGAMENTO */}
                    {temPagamentoPendente && (
                      <>
                        <button
                          type="button"
                          onClick={() => executarAcao(pagar)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                          <DollarSign size={15} className="text-gray-400" /> Realizar pagamento
                        </button>

                        <button
                          type="button"
                      onClick={() => executarAcao(frigorificoAderido ? abrirVisualizadorBoleto : abrirVisualizadorDae)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                          <ReceiptText size={15} className="text-gray-400" /> {frigorificoAderido ? "Visualizar Boleto" : "Visualizar DAE"}
                        </button>

                        {(podeEmitir || pagamentoConcluido || foiEmitida) && (
                          <div className="my-1 border-t border-gray-100" />
                        )}
                      </>
                    )}

                    {documentoPagamentoDisponivel && !temPagamentoPendente && (
                      <button
                        type="button"
                        onClick={() => executarAcao(frigorificoAderido ? abrirVisualizadorBoleto : abrirVisualizadorDae)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                      >
                        <ReceiptText size={15} className="text-gray-400" /> {frigorificoAderido ? "Visualizar Boleto" : "Visualizar DAE"}
                      </button>
                    )}

                    {/* EMISSÃO */}
                    {podeEmitir && (
                      <button
                        type="button"
                        onClick={() => executarAcao(emitir)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                      >
                        <ArrowRight size={15} className="text-gray-400" /> Emitir GTA
                      </button>
                    )}

                    {/* COPIAR GTA */}
                    <button
                      type="button"
                      onClick={() =>
                        executarAcao(() =>
                          onNavigate(
                            "adicionar-emissao-gta",
                            copiarEmissaoGta(emissao),
                          ),
                        )
                      }
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                    >
                      <Copy size={15} className="text-gray-400" /> Copiar GTA
                    </button>

                    {/* BAIXAR GTA */}
                    {podeBaixarGta && (
                      <button
                        type="button"
                        onClick={() => executarAcao(baixarGta)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                      >
                        <Download size={15} className="text-gray-400" /> Baixar GTA
                      </button>
                    )}

                    {/* CANCELAMENTO */}
                    {podeCancelar && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          type="button"
                          onClick={() => executarAcao(cancelar)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <X size={15} /> Cancelar GTA
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <CicloVidaGta emissao={emissao} />

        {aguardaGeracaoPagamento && (
          <div className="mt-2 flex w-full flex-col justify-between gap-4 rounded-xl border border-[#FFE0B2] bg-[#FFF9E6] p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <Info size={22} className="mt-0.5 shrink-0 text-[#F57C00] stroke-[2.5]" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3.5">
                  <p className="text-sm font-bold text-gray-900">Dados de pagamento ainda não gerados</p>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200/80 bg-amber-100/80 px-2.5 py-1 text-xs font-medium text-amber-900">
                    <CalendarDays size={13} className="text-amber-700" />
                    <span className="text-amber-800/70">Prazo:</span>
                    <span className="text-amber-800/70">{prazoEtapaAtual}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">A GTA ainda pode ser editada. Ao gerar a cobrança, os dados serão bloqueados para edição.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={gerarDadosPagamento}
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F57C00] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E65100]"
            >
              <ReceiptText size={15} /> Gerar dados de pagamento
            </button>
          </div>
        )}

        {/* CARD DE PAGAMENTO PENDENTE (FUNDO DO CHIP EM AMARELO E TEXTO EM CINZA) */}
        {temPagamentoPendente && (
          <div className="mt-2 flex w-full flex-col justify-between gap-4 rounded-xl border border-[#FFE0B2] bg-[#FFF9E6] p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex-shrink-0 text-[#F57C00]">
                <Info size={22} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3.5">
                  <span className="text-sm font-bold text-gray-900">
                    Pagamento Pendente
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100/80 px-2.5 py-1 text-xs font-medium text-amber-900 border border-amber-200/80">
                    <CalendarDays size={13} className="text-amber-700" />
                    <span className="text-amber-800/70">Vencimento:</span>
                    <span className="text-amber-800/70">{prazoEtapaAtual}</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  Efetue o pagamento das taxas associadas para concluir o processo de emissão.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={abrirModalPagamento}
              className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#F57C00] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E65100] sm:self-center"
            >
              <CreditCard size={15} />
              Dados de Pagamento
            </button>
          </div>
        )}

        {podeEmitir && (
          <div className="mt-2 flex w-full flex-col justify-between gap-4 rounded-xl border border-[#A3E2B8] bg-[#F3FBF5] p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <Check size={22} className="mt-0.5 shrink-0 text-[#1A7A3C] stroke-[2.5]" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3.5">
                  <p className="text-sm font-bold text-gray-900">GTA disponível para emissão</p>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-100/80 px-2.5 py-1 text-xs font-medium text-green-900">
                    <CalendarDays size={13} className="text-green-700" />
                    <span className="text-green-800/70">Emitir até:</span>
                    <span className="text-green-800/70">{prazoEtapaAtual}</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  O pagamento foi confirmado. Emita a GTA dentro do prazo informado.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={emitir}
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#15612F]"
            >
              <ArrowRight size={15} /> Emitir GTA
            </button>
          </div>
        )}

        {emissao.situacao === "Emitida" && (
          <div className="mt-2 flex w-full flex-col justify-between gap-4 rounded-xl border border-[#A3E2B8] bg-[#F3FBF5] p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <Check size={22} className="mt-0.5 shrink-0 text-[#1A7A3C] stroke-[2.5]" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3.5">
                  <p className="text-sm font-bold text-gray-900">GTA emitida</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-100/80 px-2.5 py-1 text-xs font-medium text-green-900">
                      <CalendarDays size={13} className="text-green-700" />
                      <span className="text-green-800/70">Válida até:</span>
                      <span className="text-green-800/70">{formatarDataGta(emissao.dataValidade)}</span>
                    </span>
                    {podeEstenderValidade && (
                      <button
                        type="button"
                        onClick={abrirExtensaoValidade}
                        className="text-xs font-semibold text-[#1A7A3C] underline decoration-[#1A7A3C]/40 underline-offset-2 transition hover:text-[#15612F]"
                      >
                        Estender validade
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  O documento está disponível para consulta e download durante a vigência.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={baixarGta}
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#15612F]"
            >
              <Download size={15} /> Baixar GTA
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-[#f3f3f3] px-5 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              Informações Básicas
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
            <FloatInput
              label="Série - Nº"
              value={emissao.serieNumero}
              disabled
              required
            />
            <FloatInput
              label="Data de Validade"
              value={dataVencimentoExemplo}
              disabled
              required
              icon={<CalendarDays size={20} />}
              hasTooltip
              tooltipText="Data limite de validade da GTA."
            />
            <FloatInput
              label="Data da Emissão"
              value={formatarDataGta(emissao.dataEmissao)}
              disabled
              required
            />
            <FloatInput
              label="Situação"
              value={emissao.situacao}
              disabled
              required
            />
            <FloatInput
              label="Tipo de Formulário"
              value={emissao.tipoFormulario}
              disabled
              required
            />
            <FloatInput
              label="Espécie"
              value={emissao.especie?.nome ?? ""}
              disabled
              required
            />
            <div className="md:col-span-2">
              <FloatInput
                label="Finalidade de GTA"
                value={emissao.finalidade?.nome ?? ""}
                disabled
                required
              />
            </div>
          </div>
        </section>

        <EmissaoGtaForm
          value={emissao}
          mode="view"
          showBasicSection={false}
        />
      </main>

      {/* MODAL COMPLETO DE PAGAMENTO */}
      {modalPagamento && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 md:p-6 backdrop-blur-xs">
          <div className="w-full max-w-4xl h-[92vh] max-h-[92vh] min-h-[600px] flex flex-col rounded-2xl bg-white shadow-2xl transition-all overflow-hidden">

            {/* CABEÇALHO DO MODAL CENTRALIZADO */}
            <div className="relative flex-shrink-0 flex items-center justify-center border-b border-gray-100 px-8 py-6 text-center bg-white">
              {etapaPagamento === "opcoes" ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Escolha como deseja pagar
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Selecione uma modalidade para processar a taxa da GTA {emissao.serieNumero}.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">

                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {etapaPagamento === "pix" ? "Pagamento via PIX" : "Pagamento da GTA"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                      GTA {emissao.serieNumero}
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setModalPagamento(false)}
                className="absolute right-6 top-6 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            {/* CORPO DO MODAL COM SCROLL INTERNO */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-between gap-6">

              {/* TELA 1: OPÇÕES DE PAGAMENTO */}
              {etapaPagamento === "opcoes" && (
                <div className="w-full max-w-2xl my-auto flex flex-col gap-8">
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    {/* CARD PIX */}
                    <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border-2 border-[#1A7A3C] bg-[#F3FBF5] p-7 text-center shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-col items-center gap-3">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EA] text-[#1A7A3C]">
                          <QrCode size={32} />
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          PIX
                        </span>
                        <span className="text-xs leading-relaxed text-gray-600">
                          Gere o QR Code e efetue o pagamento instantaneamente.
                        </span>
                        <span className="mt-1 rounded-full bg-[#E6F4EA] px-3.5 py-1 text-xs font-semibold text-[#1A7A3C] border border-[#1A7A3C]/20">
                          Recomendado
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEtapaPagamento("pix")}
                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#15612F]"
                      >
                        <QrCode size={16} />
                        Gerar QR Code
                      </button>
                    </div>

                    {frigorificoAderido && (
                      <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                        <div className="flex flex-col items-center gap-3">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            <ScanBarcode size={32} />
                          </span>
                          <span className="text-lg font-bold text-gray-900">Boleto</span>
                          <span className="text-xs leading-relaxed text-gray-600">
                            Gere o boleto para pagamento pelo fundo de indenização.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={abrirVisualizadorBoleto}
                          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1A7A3C] bg-white px-4 text-xs font-bold text-[#1A7A3C] transition-colors hover:bg-[#F3FBF5]"
                        >
                          <ScanBarcode size={16} /> Visualizar Boleto
                        </button>
                      </div>
                    )}

                    {!frigorificoAderido && (
                      <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                        <div className="flex flex-col items-center gap-3">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            <ReceiptText size={32} />
                          </span>
                          <span className="text-lg font-bold text-gray-900">DAE</span>
                          <span className="text-xs leading-relaxed text-gray-600">
                            Visualize e imprima o DAE oficial para pagamento bancário.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={abrirVisualizadorDae}
                          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1A7A3C] bg-white px-4 text-xs font-bold text-[#1A7A3C] transition-colors hover:bg-[#F3FBF5]"
                        >
                          <ReceiptText size={16} />
                          Visualizar DAE
                        </button>
                      </div>
                    )}
                  </div>

                  {/* INFORMATIVO DA TAXA E VENCIMENTO */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 w-full">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A3C] text-white shadow-sm">
                        <ReceiptText size={22} />
                      </span>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Taxa de Fiscalização Sanitária
                        </p>
                        <p className="text-2xl font-bold text-[#1A7A3C]">
                          {formatarMoedaGta(emissao.valorGta)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right text-xs text-gray-500 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                      <p className="font-semibold text-gray-600">Vencimento: {prazoEtapaAtual}</p>
                      <p>Referente a: GTA - Guia de Trânsito Animal</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CARREGANDO SIMULAÇÃO DE PAGAMENTO */}
              {etapaPagamento === "pix" && carregandoPagamento && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 my-auto text-center w-full max-w-md">
                  <Loader2 size={48} className="animate-spin text-[#1A7A3C]" />
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      Confirmando pagamento...
                    </p>
                    <p className="text-sm text-gray-500">
                      Aguarde enquanto validamos a transação com a instituição bancária.
                    </p>
                  </div>
                </div>
              )}

              {/* TELA 2: PIX SELECIONADO */}
              {etapaPagamento === "pix" && !carregandoPagamento && !pagamentoConfirmado && (
                <div className="w-full max-w-2xl my-auto flex flex-col gap-6">

                  {/* INFORMATIVO DA TAXA E VENCIMENTO */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 w-full">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A7A3C] text-white shadow-sm">
                        <ReceiptText size={22} />
                      </span>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Taxa de Fiscalização Sanitária
                        </p>
                        <p className="text-2xl font-bold text-[#1A7A3C]">
                          {formatarMoedaGta(emissao.valorGta)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right text-xs text-gray-500 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                      <p className="font-semibold text-gray-600">Vencimento: {prazoEtapaAtual}</p>
                      <p>Referente a: GTA - Guia de Trânsito Animal</p>
                    </div>
                  </div>

                  {/* QR CODE COM CLIQUE PARA SIMULAÇÃO E INSTRUÇÕES */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2 w-full">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-full px-3.5 py-1 font-medium">
                        <Clock size={13} className="animate-pulse text-amber-600" />
                        <span>QR Code expira em <strong className="font-mono font-bold">{formatarTempoPix(tempoRestantePix)}</strong></span>
                      </div>

                      <div
                        onClick={simularPagamentoPix}
                        title="Clique para simular o pagamento"
                        className="group relative flex h-60 w-60 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1A7A3C]/40 bg-white p-4 shadow-inner transition-all hover:border-[#1A7A3C] hover:bg-[#F3FBF5] hover:shadow-md"
                      >
                        <QrCode size={180} className="text-gray-800 transition-transform group-hover:scale-102" strokeWidth={1} />
                      </div>

                      <button
                        type="button"
                        onClick={() => window.alert("Código Pix copiado com sucesso!")}
                        className="flex items-center gap-2 text-sm font-semibold text-[#1A7A3C] hover:underline"
                      >
                        <Copy size={16} /> Copiar chave Pix Copia e Cola
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 text-left border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 w-full justify-between">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                          Como pagar via PIX:
                        </h4>
                        <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside">
                          <li>Abra o aplicativo do seu banco preferido.</li>
                          <li>Acesse a área <strong>PIX</strong> e escolha <strong>Escanear QR Code</strong> ou <strong>Pix Copia e Cola</strong>.</li>
                          <li>Confira os dados e autorize o pagamento.</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center border-t border-gray-100 pt-5 w-full">
                    <button
                      type="button"
                      onClick={() => setEtapaPagamento("opcoes")}
                      className="h-11 w-full max-w-xs rounded-md border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              )}

              {/* CONFIRMAÇÃO DO PIX (TELA DE SUCESSO) */}
              {etapaPagamento === "pix" && !carregandoPagamento && pagamentoConfirmado && (
                <div className="flex flex-col items-center gap-5 my-auto py-6 text-center w-full max-w-md">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E6F4EA]">
                    <Check size={40} className="text-[#1A7A3C]" strokeWidth={3} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-gray-900">
                      Pagamento confirmado com sucesso!
                    </p>
                    <p className="text-sm text-gray-500">
                      A situação da GTA foi atualizada para Paga.
                    </p>
                  </div>
                  <div className="w-full flex justify-center mt-3">
                    <button
                      type="button"
                      onClick={() => setModalPagamento(false)}
                      className="h-11 w-full max-w-xs rounded-md bg-[#1A7A3C] text-sm font-semibold text-white transition-colors hover:bg-[#15612F]"
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {modalExtensaoValidadeAberto && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative border-b border-gray-100 px-6 py-5 text-center">
              <h2 className="text-xl font-bold text-gray-900">Estender validade da GTA</h2>
              <p className="mt-1 text-sm text-gray-500">Informe a nova data e justifique a extensão.</p>
              <button
                type="button"
                onClick={() => setModalExtensaoValidadeAberto(false)}
                className="absolute right-5 top-5 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Fechar extensão de validade"
              >
                <X size={21} />
              </button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-semibold text-amber-900">Validade atual: {formatarDataGta(emissao.dataValidade)}</p>
                <p className="mt-0.5 text-xs text-amber-700">A extensão deve ser realizada enquanto a GTA estiver vigente.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FloatInput
                  label="Data de Validade Atual"
                  value={formatarDataGta(emissao.dataValidade)}
                  disabled
                  required
                />
                <FloatInput
                  label="Nova Data de Validade"
                  type="text"
                  value={novaDataValidade}
                  onChange={(data) => {
                    setNovaDataValidade(mascararDataBrasileira(data));
                    setTentouEstenderValidade(false);
                  }}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  icon={<CalendarDays size={18} />}
                  required
                />
              </div>

              <LargeTextArea
                label="Justificativa da Extensão da Validade"
                value={justificativaValidade}
                onChange={(texto) => {
                  setJustificativaValidade(texto);
                  setTentouEstenderValidade(false);
                }}
                required
                maxLength={1500}
                rows={3}
              />

              {tentouEstenderValidade && !extensaoValidadeValida && (
                <p className="text-sm font-medium text-red-600">
                  Informe uma data posterior a {formatarDataGta(emissao.dataValidade)}, até {formatarDataGta(limiteValidadeAno)}, e preencha a justificativa.
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setModalExtensaoValidadeAberto(false)}
                className="h-11 rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExtensaoValidade}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
              >
                <Check size={17} /> Confirmar Extensão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO DO DAE */}
      {modalDaeAberto && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 md:p-6 backdrop-blur-xs">
          <div className="w-full max-w-4xl h-[92vh] max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">

            <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-5 bg-white text-center flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Documento de Arrecadação Estadual - DAE
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  GTA Nº {emissao.serieNumero} • Vencimento: <strong className="text-gray-600">{prazoEtapaAtual}</strong>
                </p>
              </div>
              <div className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadMock("DAE_PDF")}
                  className="flex h-9 items-center gap-2 rounded-md bg-[#1A7A3C] px-3 text-xs font-semibold text-white transition hover:bg-[#15612F]"
                >
                  <Download size={15} /> Baixar DAE
                </button>
                <button
                  type="button"
                  onClick={fecharVisualizadorDae}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Fechar DAE"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-100 p-6 flex justify-center items-start">
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full max-w-3xl my-auto">
                <img
                  src={daeExemploImg}
                  alt="Documento de Arrecadação Estadual - DAE"
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-gray-200 px-6 py-4 bg-white flex-shrink-0">
              <button
                type="button"
                onClick={fecharVisualizadorDae}
                className="h-11 min-w-[140px] rounded-lg border border-gray-300 px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Voltar
              </button>
            </div>

          </div>
        </div>
      )}

      {modalBoletoAberto && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 md:p-6 backdrop-blur-xs">
          <div className="flex h-[92vh] max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative flex shrink-0 items-center justify-center border-b border-gray-200 bg-white px-6 py-5 text-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Boleto para Pagamento da GTA</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-500">
                  GTA Nº {emissao.serieNumero} • Vencimento: <strong className="text-gray-600">{prazoEtapaAtual}</strong>
                </p>
              </div>
              <div className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadMock("Boleto_PDF")}
                  className="flex h-9 items-center gap-2 rounded-md bg-[#1A7A3C] px-3 text-xs font-semibold text-white transition hover:bg-[#15612F]"
                >
                  <Download size={15} /> Baixar Boleto
                </button>
                <button
                  type="button"
                  onClick={() => setModalBoletoAberto(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Fechar boleto"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 items-start justify-center overflow-y-auto bg-gray-100 p-6">
              <div className="my-auto w-full max-w-3xl rounded-lg border border-gray-300 bg-white p-8 shadow-md">
                <div className="flex items-start justify-between gap-6 border-b-2 border-gray-900 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fundo de indenização</p>
                    <h4 className="mt-1 text-xl font-bold text-gray-900">Boleto de Cobrança</h4>
                  </div>
                  <ScanBarcode size={42} className="text-gray-800" />
                </div>
                <div className="grid grid-cols-1 gap-px bg-gray-300 md:grid-cols-2">
                  {[
                    ["Número da GTA", emissao.serieNumero],
                    ["Vencimento", prazoEtapaAtual],
                    ["Beneficiário", "Fundo de Indenização Sanitária"],
                    ["Valor", formatarMoedaGta(emissao.valorGta)],
                    ["Frigorífico", emissao.destino.frigorifico?.nome ?? "-"],
                    ["Finalidade", emissao.finalidade?.nome ?? "-"],
                  ].map(([label, valor]) => (
                    <div key={label} className="bg-white px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{valor}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="mb-2 text-center font-mono text-xs tracking-[0.18em] text-gray-700">00190.00009 01234.567890 12345.678901 1 00000000000000</p>
                  <div
                    className="h-16 w-full"
                    style={{ backgroundImage: "repeating-linear-gradient(90deg, #111 0, #111 2px, transparent 2px, transparent 5px, #111 5px, #111 6px, transparent 6px, transparent 9px)" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center border-t border-gray-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setModalBoletoAberto(false)}
                className="h-11 min-w-[140px] rounded-lg border border-gray-300 px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
