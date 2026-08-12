import { useState } from "react";
import { ArrowLeft, Ban, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";
import {
  MOTIVOS_CANCELAMENTO_GTA,
  cancelarEmissaoGta,
  obterEmissaoGta,
  type EmissaoGta,
  type EntidadeGta,
} from "./emissaoGtaData";

export function CancelarEmissaoGtaPage({
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
  const [motivo, setMotivo] = useState<EntidadeGta | null>(
    registroInicial?.motivoCancelamento ?? null,
  );
  const [observacao, setObservacao] = useState(
    registroInicial?.observacaoCancelamento ?? "",
  );
  const [tentouCancelar, setTentouCancelar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  if (!emissao) return null;
  const cancelada = emissao.situacao === "Cancelada";
  const bloqueada = cancelada || emissao.situacao === "Transitada";

  const cancelar = () => {
    setTentouCancelar(true);
    if (!motivo || bloqueada) return;
    const atualizada = cancelarEmissaoGta(emissao.id, motivo, observacao);
    if (!atualizada) return;
    setEmissao({ ...atualizada });
    setSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
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
              Cancelar GTA
            </h1>
            {!bloqueada && (
              <button
                type="button"
                onClick={cancelar}
                className="px-5 h-10 text-xs font-bold rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"
              >
                <Ban size={16} />
                Cancelar
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

        <section className="bg-white rounded-xl shadow-sm overflow-visible">
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              Informações Básicas
            </h2>
          </div>
          <div className="px-6 pb-6 border-t border-gray-100 pt-5 flex flex-col gap-5">
            {cancelada ? (
              <FloatInput
                label="Motivo de Cancelamento da GTA"
                value={motivo?.nome ?? ""}
                disabled
                required
              />
            ) : (
              <EntitySearchInput
                label="Motivo de Cancelamento da GTA"
                placeholder="Buscar motivo de cancelamento"
                value={motivo?.nome ?? ""}
                data={MOTIVOS_CANCELAMENTO_GTA}
                searchKeys={["nome"]}
                columns={[{ label: "Motivo", key: "nome" }]}
                icon={<Ban size={18} />}
                required
                title="Buscar Motivo de Cancelamento da GTA"
                subtitle="Selecione um motivo de cancelamento cadastrado:"
                confirmLabel="Selecionar"
                onChange={setMotivo}
              />
            )}
            <LargeTextArea
              label="Observação"
              value={observacao}
              onChange={setObservacao}
              maxLength={1500}
              disabled={cancelada}
            />
            {tentouCancelar && !motivo && (
              <p className="text-sm text-red-600 font-medium">
                Selecione o motivo de cancelamento para continuar.
              </p>
            )}
            {cancelada && (
              <p className="text-sm text-gray-500">
                Esta GTA está cancelada e não pode retornar à situação Gravada.
              </p>
            )}
          </div>
        </section>
      </main>

      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              GTA cancelada com sucesso!
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
              className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold mt-6"
            >
              Visualizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
