import { useState } from "react";
import { ArrowLeft, FileInput } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import { EmissaoGtaForm } from "./EmissaoGtaForm";
import {
  dataPadraoValidade,
  emitirEmissaoGta,
  formatarDataGta,
  obterEmissaoGta,
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
  const [emissao] = useState<EmissaoGta | null>(registroInicial);
  const [dataValidade, setDataValidade] = useState(
    registroInicial?.dataValidade || dataPadraoValidade(),
  );
  const [justificativa, setJustificativa] = useState(
    registroInicial?.justificativaValidade ?? "",
  );
  const [tentouEmitir, setTentouEmitir] = useState(false);

  if (!emissao) return null;

  const dataLimite = dataPadraoValidade();
  const ultrapassaTresDias = Boolean(dataValidade && dataValidade > dataLimite);
  const valida = Boolean(
    dataValidade && (!ultrapassaTresDias || justificativa.trim()),
  );
  const bloqueada = emissao.situacao === "Emitida";

  const emitir = () => {
    setTentouEmitir(true);
    if (!valida || bloqueada) return;
    const atualizada = emitirEmissaoGta(
      emissao.id,
      dataValidade,
      justificativa,
    );
    if (!atualizada) return;
    onNavigate("documento-emissao-gta", atualizada);
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

        <section className="bg-white rounded-xl shadow-sm p-6">
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
        </section>

        <EmissaoGtaForm value={emissao} mode="view" />

        <section className="bg-white rounded-xl shadow-sm overflow-visible">
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              Informações da GTA
            </h2>
          </div>
          <div className="px-6 pb-6 border-t border-gray-100 pt-5 flex flex-col gap-5">
            <FloatInput
              label="Data de Validade"
              type="date"
              required
              value={dataValidade}
              onChange={setDataValidade}
              disabled={bloqueada}
            />
            {ultrapassaTresDias && (
              <LargeTextArea
                label="Justificativa"
                required
                value={justificativa}
                onChange={setJustificativa}
                disabled={bloqueada}
                maxLength={1500}
              />
            )}
            {bloqueada && (
              <p className="text-sm text-gray-500">
                Esta GTA foi emitida com validade até{" "}
                {formatarDataGta(emissao.dataValidade)}. A data está bloqueada
                para edição.
              </p>
            )}
            {tentouEmitir && !valida && (
              <p className="text-sm text-red-600 font-medium">
                Informe a data de validade e justifique quando ela ultrapassar
                três dias após a data atual.
              </p>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
