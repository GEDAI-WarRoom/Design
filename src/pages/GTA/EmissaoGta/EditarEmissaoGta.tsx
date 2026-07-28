import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  EmissaoGtaForm,
  RequiredFieldsNotice,
  emissaoGtaValida,
} from "./EmissaoGtaForm";
import {
  atualizarEmissaoGta,
  obterEmissaoGta,
  type EmissaoGta,
} from "./emissaoGtaData";

export function EditarEmissaoGtaPage({
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
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [salvou, setSalvou] = useState(false);

  if (!emissao) return null;

  const salvar = () => {
    setTentouSalvar(true);
    if (!emissaoGtaValida(emissao)) return;
    atualizarEmissaoGta(emissao);
    setSalvou(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Visualizar Emissão de GTA
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Emissão de GTA
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Salvar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        {tentouSalvar && !emissaoGtaValida(emissao) && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">
            Preencha todos os campos obrigatórios. Para formulário manual, a
            série deve ter 2 caracteres e o número da GTA deve ter 6 dígitos.
          </div>
        )}
        <EmissaoGtaForm
          value={emissao}
          onChange={(valor) => {
            setEmissao({ ...emissao, ...valor });
            setTentouSalvar(false);
          }}
          mode="edit"
        />
      </main>

      {salvou && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check
                size={28}
                className="text-[#1A7A3C]"
                strokeWidth={3}
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              GTA atualizada com sucesso!
            </h2>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("emissao-gta")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold"
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
