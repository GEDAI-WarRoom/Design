import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AjusteDosesInsumoForm,
  RequiredFieldsNotice,
  type AjusteDosesInsumoFormValue,
} from "./AjusteDosesInsumoForm";
import {
  criarAjusteDosesInsumo,
  type AjusteDosesInsumo,
} from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const criarEstadoInicial = (): AjusteDosesInsumoFormValue => ({
  revendedora: null,
  notasFiscais: [],
  situacao: "Gravada",
});

export function AdicionarAjusteDosesInsumoPage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<AjusteDosesInsumoFormValue>(criarEstadoInicial());
  const [erro, setErro] = useState("");
  const [registroSalvo, setRegistroSalvo] = useState<AjusteDosesInsumo | null>(null);

  const salvar = () => {
    const detalhesValidos = form.notasFiscais.every((nota) => nota.itens.every((item) => (
      item.frascosLancados !== ""
      && item.dosesLancadas !== ""
      && item.justificativa.trim() !== ""
    )));

    if (!form.revendedora || form.notasFiscais.length === 0 || !detalhesValidos) {
      setErro("Selecione a revendedora e ao menos uma nota fiscal, informando as quantidades lançadas e a justificativa de cada insumo.");
      return;
    }

    const criado = criarAjusteDosesInsumo({
      revendedora: form.revendedora,
      notasFiscais: form.notasFiscais,
    });
    setErro("");
    setRegistroSalvo(criado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="ajuste-doses-insumo" hideSearch />

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("ajuste-doses-insumo")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Ajustes de Doses de Insumo
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Ajuste de Doses de Insumo</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <AjusteDosesInsumoForm
          value={form}
          onChange={(value) => { setForm(value); setErro(""); }}
        />
        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ajuste de doses de insumo cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O ajuste para <span className="font-medium text-gray-700">{registroSalvo.revendedora.nome}</span> foi gravado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("ajuste-doses-insumo");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("visualizar-ajuste-doses-insumo", registroSalvo);
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
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
