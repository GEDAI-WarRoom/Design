import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AjusteDosesInsumoForm,
  type AjusteDosesInsumoFormValue,
} from "./AjusteDosesInsumoForm";
import {
  atualizarAjusteDosesInsumo,
  obterAjusteDosesInsumo,
  type AjusteDosesInsumo,
} from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: AjusteDosesInsumo | null;
}

const toFormValue = (registro: AjusteDosesInsumo): AjusteDosesInsumoFormValue => ({
  revendedora: registro.revendedora,
  notasFiscais: registro.notasFiscais,
  situacao: registro.situacao,
});

export function EditarAjusteDosesInsumoPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterAjusteDosesInsumo();
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [erro, setErro] = useState("");

  if (!registro) return null;

  const cancelar = () => {
    const atualizado = atualizarAjusteDosesInsumo(registro.id);
    if (!atualizado) {
      setErro("Este ajuste já está cancelado e não pode voltar para a situação Gravada.");
      setConfirmandoCancelamento(false);
      return;
    }
    onNavigate("visualizar-ajuste-doses-insumo", atualizado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="ajuste-doses-insumo" hideSearch />

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-ajuste-doses-insumo", registro)}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Visualizar Ajuste de Doses de Insumo
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Cancelar Ajuste de Doses de Insumo</h1>
            {registro.situacao === "Gravada" && <button
              type="button"
              onClick={() => setConfirmandoCancelamento(true)}
              className="px-5 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Cancelar
            </button>}
          </div>
        </div>

        <AjusteDosesInsumoForm
          value={toFormValue(registro)}
          onChange={() => {}}
          mode="edit"
        />
        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>

      {confirmandoCancelamento && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">Cancelar ajuste de doses?</h2>
            <p className="mt-2 text-sm text-gray-600">Após o cancelamento, o ajuste ficará com situação Cancelada e não poderá voltar para Gravada.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmandoCancelamento(false)} className="h-10 rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-700">Voltar</button>
              <button type="button" onClick={cancelar} className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700">Confirmar cancelamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
