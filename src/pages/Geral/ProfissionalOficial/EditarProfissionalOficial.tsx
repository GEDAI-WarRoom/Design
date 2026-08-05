import { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  normalizarProfissionalOficial,
  ProfissionalOficialCadastroForm,
  ProfissionalOficialValue,
} from "./ProfissionalOficialCadastroForm";

const GREEN = "#1A7A3C";

export function EditarProfissionalOficialPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [profissional, setProfissional] = useState<ProfissionalOficialValue>(() =>
    normalizarProfissionalOficial(dados),
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-oficial" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("profissional-oficial")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Profissionais
          </button>
          <div className="flex justify-between items-center gap-4 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Profissional Oficial</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-3">
          <Info size={18} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
          <p className="text-xs text-gray-600 font-medium">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.
          </p>
        </div>

        <ProfissionalOficialCadastroForm
          value={profissional}
          onChange={setProfissional}
          onNavigate={onNavigate}
        />
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">

            <h2 className="text-lg font-bold text-gray-900">Alterações salvas!</h2>
            <p className="text-sm text-gray-500 mt-1">
              O profissional &quot;{profissional.pessoa.nome}&quot; foi atualizado com sucesso.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("profissional-oficial")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-profissional-oficial", profissional)}
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
