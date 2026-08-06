import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AtestadoExameCadastroForm,
  RequiredFieldsNotice,
} from "./AtestadoExameCadastroForm";
import {
  atestadoCadastroValido,
  criarAtestadoExameVazio,
  salvarAtestadoCadastro,
  type AtestadoExameCadastro,
} from "./atestadoExameCadastroData";

export function AdicionarAtestadoExameCadastroPage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [value, setValue] = useState(criarAtestadoExameVazio);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [salvo, setSalvo] = useState<AtestadoExameCadastro | null>(null);

  const salvar = () => {
    setTentouSalvar(true);
    if (!atestadoCadastroValido(value)) return;
    setSalvo(salvarAtestadoCadastro(value));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cadastro-atestado-exame" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("cadastro-atestado-exame")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Todos os Atestados de Exame
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Atestado de Exame</h1>
            <button type="button" onClick={salvar} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">
              Adicionar
            </button>
          </div>
        </div>
        <RequiredFieldsNotice />
        {tentouSalvar && !atestadoCadastroValido(value) && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertTriangle size={18} /> Corrija os campos indicados antes de adicionar o atestado.
          </div>
        )}
        <AtestadoExameCadastroForm value={value} onChange={setValue} showErrors={tentouSalvar} />
      </main>

      {salvo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            <Check size={34} className="mx-auto mb-5 text-[#1A7A3C]" strokeWidth={3} />
            <h2 className="text-xl font-bold text-gray-900">Atestado cadastrado com sucesso!</h2>
            <p className="mt-2 text-sm text-gray-500">Atestado nº {salvo.numero}.</p>
            <div className="mt-8 flex justify-center gap-4">
              <button type="button" onClick={() => onNavigate("cadastro-atestado-exame")} className="h-11 rounded-md border border-[#1A7A3C] px-7 text-sm font-semibold text-[#1A7A3C]">Voltar</button>
              <button type="button" onClick={() => onNavigate("visualizar-cadastro-atestado-exame", salvo)} className="h-11 rounded-md bg-[#1A7A3C] px-7 text-sm font-semibold text-white">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
