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
  const [form, setForm] = useState<AjusteDosesInsumoFormValue | null>(() => (
    registro ? toFormValue(registro) : null
  ));
  const [erro, setErro] = useState("");

  if (!registro || !form) return null;

  const salvar = () => {
    const atualizado = atualizarAjusteDosesInsumo(registro.id, form.situacao);
    if (!atualizado) {
      setErro("Não foi possível localizar o ajuste para edição.");
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
            <h1 className="text-2xl font-semibold text-gray-900">Editar Ajuste de Doses de Insumo</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        <AjusteDosesInsumoForm
          value={form}
          onChange={(value) => { setForm(value); setErro(""); }}
          mode="edit"
        />
        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>
    </div>
  );
}
