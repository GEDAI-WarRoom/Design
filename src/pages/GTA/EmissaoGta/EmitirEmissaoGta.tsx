import { useState } from "react";
import { ArrowLeft, CalendarPlus, FileInput } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui-1/dialog";
import { EmissaoGtaForm } from "./EmissaoGtaForm";
import {
  dataPadraoValidade,
  estenderPrazoEmissaoGta,
  emitirEmissaoGta,
  formatarDataGta,
  obterEmissaoGta,
  obterPrazoAtualGta,
  ultimoDiaUtilDoAno,
  type EmissaoGta,
} from "./emissaoGtaData";

export function EmitirEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: EmissaoGta | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const registroInicial = dados ?? obterEmissaoGta(null);
  const { role } = useDemoUser();
  const [emissao, setEmissao] = useState<EmissaoGta | null>(registroInicial);
  const dataEmissao = registroInicial?.situacao === "Emitida"
    ? registroInicial.dataEmissao
    : new Date().toISOString().slice(0, 10);
  const dataValidadePadrao = dataPadraoValidade(dataEmissao);
  const limiteValidadeAno = ultimoDiaUtilDoAno(Number(dataEmissao.slice(0, 4)));
  const [estenderValidade, setEstenderValidade] = useState(
    Boolean(registroInicial?.justificativaValidade),
  );
  const [novaDataValidade, setNovaDataValidade] = useState(
    registroInicial?.justificativaValidade
      ? registroInicial.dataValidade
      : "",
  );
  const [justificativa, setJustificativa] = useState(
    registroInicial?.justificativaValidade ?? "",
  );
  const [modalExtensaoAberto, setModalExtensaoAberto] = useState(false);
  const [novaDataRascunho, setNovaDataRascunho] = useState("");
  const [justificativaRascunho, setJustificativaRascunho] = useState("");
  const [tentouConfirmarExtensao, setTentouConfirmarExtensao] = useState(false);
  const [tentouEmitir, setTentouEmitir] = useState(false);
  const [modalPrazoEmissaoAberto, setModalPrazoEmissaoAberto] = useState(false);
  const [novaDataPrazoEmissao, setNovaDataPrazoEmissao] = useState("");
  const [justificativaPrazoEmissao, setJustificativaPrazoEmissao] = useState("");
  const [tentouEstenderPrazoEmissao, setTentouEstenderPrazoEmissao] = useState(false);

  if (!emissao) return null;

  const bloqueada = emissao.situacao !== "Paga";
  const funcionarioIma = role === "admin" || role === "veterinario";
  const prazoEmissaoAtual = obterPrazoAtualGta(emissao);
  const extensaoPrazoEmissaoValida = Boolean(
    novaDataPrazoEmissao > prazoEmissaoAtual &&
    novaDataPrazoEmissao <= limiteValidadeAno &&
    justificativaPrazoEmissao.trim(),
  );
  const dataValidade = bloqueada
    ? emissao.dataValidade
    : estenderValidade
      ? novaDataValidade
      : dataValidadePadrao;
  const justificativaExibida = bloqueada
    ? emissao.justificativaValidade
    : justificativa;
  const extensaoValida = Boolean(
    !estenderValidade ||
      (novaDataValidade > dataValidadePadrao && novaDataValidade <= limiteValidadeAno && justificativa.trim()),
  );
  const rascunhoExtensaoValido = Boolean(
    novaDataRascunho > dataValidadePadrao && novaDataRascunho <= limiteValidadeAno && justificativaRascunho.trim(),
  );
  const dataRascunhoFoiAlterada = Boolean(
    novaDataRascunho && novaDataRascunho !== dataValidadePadrao,
  );

  const abrirModalExtensao = () => {
    setNovaDataRascunho(estenderValidade ? novaDataValidade : "");
    setJustificativaRascunho(estenderValidade ? justificativa : "");
    setTentouConfirmarExtensao(false);
    setModalExtensaoAberto(true);
  };

  const confirmarExtensao = () => {
    setTentouConfirmarExtensao(true);
    if (!rascunhoExtensaoValido) return;
    setNovaDataValidade(novaDataRascunho);
    setJustificativa(justificativaRascunho.trim());
    setEstenderValidade(true);
    setTentouEmitir(false);
    setModalExtensaoAberto(false);
  };

  const emitir = () => {
    setTentouEmitir(true);
    if (!extensaoValida || bloqueada) return;
    const atualizada = emitirEmissaoGta(
      emissao.id,
      dataValidade,
      justificativa,
    );
    if (!atualizada) return;
    onNavigate("documento-emissao-gta", atualizada);
  };

  const confirmarExtensaoPrazoEmissao = () => {
    setTentouEstenderPrazoEmissao(true);
    if (!extensaoPrazoEmissaoValida) return;
    const atualizada = estenderPrazoEmissaoGta(
      emissao.id,
      novaDataPrazoEmissao,
      justificativaPrazoEmissao,
    );
    if (!atualizada) return;
    setEmissao({ ...atualizada });
    setModalPrazoEmissaoAberto(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="max-w-[1180px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Visualizar GTA
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Emitir GTA
            </h1>
            {!bloqueada && (
              <button
                type="button"
                onClick={emitir}
                className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F] flex items-center gap-2"
              >
                <FileInput size={16} />
                Emitir
              </button>
            )}
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-amber-900">Prazo para emissão: {formatarDataGta(prazoEmissaoAtual)}</p>
              <p className="mt-0.5 text-xs text-amber-700">Após esse prazo, a GTA será cancelada automaticamente.</p>
            </div>
            {funcionarioIma && !bloqueada && (
              <button
                type="button"
                onClick={() => {
                  setNovaDataPrazoEmissao(emissao.dataLimiteEmissaoEstendida || "");
                  setJustificativaPrazoEmissao(emissao.justificativaPrazoEmissao || "");
                  setTentouEstenderPrazoEmissao(false);
                  setModalPrazoEmissaoAberto(true);
                }}
                className="h-9 rounded-md border border-amber-400 bg-white px-3 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                Estender prazo para emissão
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Série - Número da GTA"
              value={emissao.serieNumero}
              disabled
              required
            />
            <FloatInput
              label="Situação"
              value={emissao.situacao}
              disabled
              required
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <FloatInput
              label="Data de Emissão"
              type="date"
              value={dataEmissao}
              disabled
              required
            />
            <FloatInput
              label="Data de Validade"
              type="date"
              value={dataValidade}
              disabled
              required
            />
            {!bloqueada && (
              <button
                type="button"
                onClick={abrirModalExtensao}
                className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#1A7A3C] bg-white px-4 text-sm font-semibold text-[#1A7A3C] transition hover:bg-[#F4FAF6] md:whitespace-nowrap"
              >
                <CalendarPlus size={17} />
                {estenderValidade ? "Alterar extensão" : "Estender validade"}
              </button>
            )}
          </div>
          {dataValidade !== dataValidadePadrao && justificativaExibida && (
            <LargeTextArea
              label="Justificativa da Extensão"
              value={justificativaExibida}
              onChange={() => undefined}
              disabled
              rows={2}
              maxLength={1500}
            />
          )}
          {tentouEmitir && !extensaoValida && (
            <p className="text-sm font-medium text-red-600">
              Informe uma nova data posterior a {formatarDataGta(dataValidadePadrao)} e a justificativa da extensão.
            </p>
          )}
        </section>

        <EmissaoGtaForm value={emissao} mode="view" />
      </main>

      <Dialog
        open={modalExtensaoAberto}
        onOpenChange={(aberto) => {
          setModalExtensaoAberto(aberto);
          if (!aberto) setTentouConfirmarExtensao(false);
        }}
      >
        <DialogContent className="max-w-[620px] rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Estender validade da GTA
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Informe a nova data e justifique a extensão. O limite anual é {formatarDataGta(limiteValidadeAno)}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FloatInput
                label="Data Antiga"
                type="date"
                value={dataValidadePadrao}
                disabled
                required
              />
              <FloatInput
                label="Nova Data"
                type="date"
                value={novaDataRascunho}
                onChange={(novaData) => {
                  setNovaDataRascunho(novaData);
                  if (!novaData || novaData === dataValidadePadrao) {
                    setJustificativaRascunho("");
                  }
                }}
                required
              />
            </div>
            {dataRascunhoFoiAlterada && (
              <LargeTextArea
                label="Justificativa"
                value={justificativaRascunho}
                onChange={setJustificativaRascunho}
                required
                rows={4}
                maxLength={1500}
              />
            )}
            {tentouConfirmarExtensao && !rascunhoExtensaoValido && (
              <p className="text-sm font-medium text-red-600">
                {novaDataRascunho > limiteValidadeAno
                  ? `A validade não pode ultrapassar o último dia útil do ano (${formatarDataGta(limiteValidadeAno)}).`
                  : novaDataRascunho <= dataValidadePadrao
                  ? `Informe uma nova data posterior a ${formatarDataGta(dataValidadePadrao)}.`
                  : "Informe a justificativa da extensão."}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setModalExtensaoAberto(false)}
              className="h-11 rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExtensao}
              className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15612F]"
            >
              Confirmar extensão
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalPrazoEmissaoAberto}
        onOpenChange={(aberto) => {
          setModalPrazoEmissaoAberto(aberto);
          if (!aberto) setTentouEstenderPrazoEmissao(false);
        }}
      >
        <DialogContent className="max-w-[620px] rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Estender prazo para emissão</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Ação exclusiva de funcionário do IMA. Informe a nova data e a justificativa.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FloatInput label="Prazo Atual" type="date" value={prazoEmissaoAtual} disabled required />
              <FloatInput label="Novo Prazo" type="date" value={novaDataPrazoEmissao} onChange={setNovaDataPrazoEmissao} required />
            </div>
            <LargeTextArea
              label="Justificativa"
              value={justificativaPrazoEmissao}
              onChange={setJustificativaPrazoEmissao}
              required
              rows={4}
              maxLength={1500}
            />
            {tentouEstenderPrazoEmissao && !extensaoPrazoEmissaoValida && (
              <p className="text-sm font-medium text-red-600">
                Informe uma data posterior ao prazo atual, sem ultrapassar {formatarDataGta(limiteValidadeAno)}, e justifique a extensão.
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setModalPrazoEmissaoAberto(false)} className="h-11 rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="button" onClick={confirmarExtensaoPrazoEmissao} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Confirmar extensão</button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
