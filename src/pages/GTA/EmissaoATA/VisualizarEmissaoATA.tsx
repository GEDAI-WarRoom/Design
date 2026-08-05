import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Ban,
  PlayCircle,
  Info,
  CreditCard,
  CalendarDays,
  Settings,
  ChevronDown,
  Copy,
  QrCode,
  DollarSign,
  X,
  Clock,
  ScanBarcode,
  ReceiptText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, FloatSelect } from "../../../components/ui/FormKit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui-1/dialog";

// Importação da imagem do DAE a partir do diretório do projeto
import daeExemploImg from "../../../imports/documents/dae-exemplo.jpeg";

const GREEN = "#1A7A3C";

export function VisualizarEmissaoATAPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados: any;
  onLogout: () => void;
  onNavigate: (s: string, d?: any) => void;
}) {
  const ata = dados || { serie: "AR-000000", situacao: "Gravada" };

  const [modalEmitir, setModalEmitir] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [modalDaeAberto, setModalDaeAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // ── Variáveis auxiliares de data e pagamento ──────────────────────
  const dataVencimentoExemplo = ata.vencimentoTaxa || ata.dataValidade || "30/08/2026";
  const valorPagamento = ata.valor || "R$ 8,56";
  const numeroReferencia = ata.numero || ata.codigo || ata.serie || "ATA";
  const temPagamentoPendente = ata.situacao === "Gravada";

  // ── Lógica do modal de pagamento (Pix/DAE) ──────────────────────
  const [etapaPagamento, setEtapaPagamento] = useState<"opcoes" | "pix" | "boleto">("opcoes");
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [carregandoPagamento, setCarregandoPagamento] = useState(false);
  const [tempoRestantePix, setTempoRestantePix] = useState(900);

  const [validade, setValidade] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  useEffect(() => {
    if (modalPagamento) {
      setEtapaPagamento("opcoes");
      setPagamentoConfirmado(false);
      setCarregandoPagamento(false);
      setTempoRestantePix(900);
    }
  }, [modalPagamento]);

  useEffect(() => {
    if (modalPagamento && etapaPagamento === "pix" && !pagamentoConfirmado) {
      const timer = setInterval(() => {
        setTempoRestantePix((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [modalPagamento, etapaPagamento, pagamentoConfirmado]);

  const formatarTempoPix = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const simularPagamentoPix = () => {
    if (carregandoPagamento || pagamentoConfirmado) return;
    setCarregandoPagamento(true);
    setTimeout(() => {
      setPagamentoConfirmado(true);
      setCarregandoPagamento(false);
    }, 1800);
  };

  // Funções para gerenciamento do DAE/Boleto
  const abrirVisualizadorDae = () => {
    setModalPagamento(false);
    setModalDaeAberto(true);
  };

  const fecharVisualizadorDae = () => {
    setModalDaeAberto(false);
  };

  const downloadMock = (documento: string) => {
    window.alert(`${documento} da ATA ${numeroReferencia} preparado para download.`);
  };

  const handleAction = (acao: string) => {
    setModalEmitir(false);
    setModalCancelar(false);
    onNavigate("emissao-ata");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="emissao-ata" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("emissao-ata")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition">
            <ArrowLeft size={15} /> Todas as ATAs
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar ATA</h1>

            {/* Menu Gerenciar ATA */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuAberto((v) => !v)}
                className="px-5 h-10 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
              >
                <Settings size={15} /> Gerenciar ATA
                <ChevronDown size={15} className={`transition-transform ${menuAberto ? "rotate-180" : ""}`} />
              </button>

              {menuAberto && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden py-1">
                    {temPagamentoPendente && (
                      <>
                        <button
                          type="button"
                          onClick={() => { setMenuAberto(false); setModalPagamento(true); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                          <DollarSign size={15} className="text-gray-400" /> Pagar Taxa
                        </button>

                        <button
                          type="button"
                          onClick={() => { setMenuAberto(false); abrirVisualizadorDae(); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                        >
                          <ReceiptText size={15} className="text-gray-400" /> Baixar Boleto / DAE
                        </button>

                        <div className="my-1 border-t border-gray-100" />
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setMenuAberto(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                    >
                      <Copy size={15} className="text-gray-400" /> Copiar ATA
                    </button>

                    <button
                      type="button"
                      onClick={() => setMenuAberto(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                    >
                      <Download size={15} className="text-gray-400" /> Baixar PDF
                    </button>

                    {ata.situacao !== "Cancelada" && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          type="button"
                          onClick={() => { setMenuAberto(false); setModalCancelar(true); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <Ban size={15} /> Cancelar ATA
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CARD DE PAGAMENTO PENDENTE */}
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
                    <span className="text-amber-800/70">{dataVencimentoExemplo}</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  Efetue o pagamento das taxas associadas para concluir o processo de emissão.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalPagamento(true)}
              className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#F57C00] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E65100] sm:self-center"
            >
              <CreditCard size={15} />
              Dados de Pagamento
            </button>
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-2">
          <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações Básicas e Situação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Série - Número da ATA" value={ata.serie || "AR-123456"} disabled onChange={() => { }} />
            <FloatInput label="Situação" value={ata.situacao} disabled onChange={() => { }} />
            <FloatInput label="Espécie" value={ata.especie || "Bovino"} disabled onChange={() => { }} />
            <FloatInput label="Finalidade" value={ata.finalidade || "Abate"} disabled onChange={() => { }} />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações da Procedência</h2>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Tipo de Procedência" value="Estabelecimento Agropecuário" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Responsável de Procedência" value="José Teixeira Guimarães" disabled onChange={() => { }} />
              <FloatInput label="CPF" value="550.134.236-88" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <FloatInput label="Estabelecimento Agropecuário" value="31002030039 - Fazenda Rio das Ostras" disabled onChange={() => { }} />
              <FloatInput label="Código do Estabelecimento" value="31002030039" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <FloatInput label="Exploração Pecuária" value="3100203003910001" disabled onChange={() => { }} />
              <FloatInput label="Espécie Explorada" value="Bovino" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <FloatInput label="Núcleo de Produção" value="Núcleo A" disabled onChange={() => { }} />
              <FloatInput label="Código do Núcleo" value="3100203003910001-A" disabled onChange={() => { }} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações de Destino</h2>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Tipo de Destino" value="Frigorífico" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput label="Responsável de Destino" value="João Bosco" disabled onChange={() => { }} />
              <FloatInput label="CPF" value="999.888.777-66" disabled onChange={() => { }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
              <FloatInput label="Estabelecimento Agropecuário" value="Frigorífico Sul" disabled onChange={() => { }} />
              <FloatInput label="Exploração Pecuária" value="3100203003910002" disabled onChange={() => { }} />
              <FloatInput label="Núcleo de Produção" value="Núcleo Principal" disabled onChange={() => { }} />
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE EMITIR ATA */}
      <Dialog open={modalEmitir} onOpenChange={setModalEmitir}>
        <DialogContent className="max-w-[600px] bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Emitir ATA</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Confirme os dados de validade para emissão da Guia de Trânsito Animal.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">
            <FloatInput type="date" label="Data de Validade (Padrão: +3 dias)" required value={validade} onChange={setValidade} />
            <LargeTextArea label="Justificativa (Obrigatório se > 3 dias)" value={justificativa} onChange={setJustificativa} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setModalEmitir(false)} className="px-5 h-11 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition">Cancelar</button>
            <button onClick={() => handleAction("emitir")} disabled={!validade} className="px-5 h-11 bg-[#1A7A3C] text-white rounded-md font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-sm">Emitir Documento</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CANCELAR ATA */}
      <Dialog open={modalCancelar} onOpenChange={setModalCancelar}>
        <DialogContent className="max-w-[600px] bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2"><Ban size={24} /> <DialogTitle className="text-xl font-bold">Cancelar ATA</DialogTitle></div>
            <DialogDescription className="text-gray-500">
              Atenção: Esta ação é irreversível. A ATA não poderá ser alterada após o cancelamento.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">
            <FloatSelect label="Motivo do Cancelamento" required value={motivoCancelamento} onChange={setMotivoCancelamento} options={[{ value: "Erro de digitação", label: "Erro de digitação" }, { value: "Desistência do Trânsito", label: "Desistência do Trânsito" }]} />
            <LargeTextArea label="Observações Adicionais" value="" onChange={() => { }} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setModalCancelar(false)} className="px-5 h-11 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition">Voltar</button>
            <button onClick={() => handleAction("cancelar")} disabled={!motivoCancelamento} className="px-5 h-11 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 transition shadow-sm">Confirmar Cancelamento</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE PAGAMENTO PIX/DAE */}
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
                    Selecione uma modalidade para processar a taxa da ATA {numeroReferencia}.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#1A7A3C]">
                    {etapaPagamento === "pix" ? <QrCode size={24} /> : <DollarSign size={24} />}
                  </span>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {etapaPagamento === "pix" ? "Pagamento via PIX" : "Pagamento da ATA"}
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                      ATA {numeroReferencia}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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

                    {/* CARD BOLETO / DAE */}
                    <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
                      <div className="flex flex-col items-center gap-3">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                          <ScanBarcode size={32} />
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          Boleto / DAE
                        </span>
                        <span className="text-xs leading-relaxed text-gray-600">
                          Visualize e imprima o DAE oficial para pagamento bancário.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={abrirVisualizadorDae}
                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1A7A3C] bg-white px-4 text-xs font-bold text-[#1A7A3C] transition-colors hover:bg-[#F3FBF5]"
                      >
                        <Download size={16} />
                        Baixar Boleto / DAE
                      </button>
                    </div>
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
                          {valorPagamento}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right text-xs text-gray-500 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                      <p className="font-semibold text-gray-600">Vencimento: {dataVencimentoExemplo}</p>
                      <p>Referente a: ATA - Autorização de Trânsito Animal</p>
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
                          {valorPagamento}
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right text-xs text-gray-500 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                      <p className="font-semibold text-gray-600">Vencimento: {dataVencimentoExemplo}</p>
                      <p>Referente a: ATA - Autorização de Trânsito Animal</p>
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
                      A situação da ATA foi atualizada para Paga.
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
                  ATA Nº {numeroReferencia} • Vencimento: <strong className="text-gray-600">{dataVencimentoExemplo}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={fecharVisualizadorDae}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={22} />
              </button>
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
              <button
                type="button"
                onClick={() => downloadMock("DAE_PDF")}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1A7A3C] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#15612F]"
              >
                <Download size={18} />
                Baixar Boleto / DAE
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}