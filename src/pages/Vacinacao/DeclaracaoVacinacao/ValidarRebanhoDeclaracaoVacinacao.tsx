import { ArrowLeft, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

/** Confirmação exigida antes de o produtor declarar vacinação. */
export function ValidarRebanhoDeclaracaoVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  const [confirmado, setConfirmado] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0f1] pb-8">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />
      <main className="max-w-3xl mx-auto px-4 py-7">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <header className="relative border-b border-gray-100 px-6 py-6 text-center">
            <button type="button" onClick={() => onNavigate("declaracao-vacinacao")} className="absolute left-5 top-6 rounded-md p-1 text-[#1A7A3C] hover:bg-green-50" aria-label="Voltar">
              <ArrowLeft size={19} />
            </button>
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-[#1A7A3C]"><ShieldCheck size={24} /></div>
            <h1 className="text-xl font-semibold text-gray-900">Validação dos dados do rebanho</h1>
            <p className="mt-2 text-sm text-gray-500">Confirme que os quantitativos abaixo estão atualizados antes de lançar a declaração de vacinação.</p>
          </header>
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[['Bovinos', '200'], ['Não vacinados', '160'], ['Já vacinados', '40']].map(([rotulo, valor]) => <div key={rotulo} className="rounded-xl border border-gray-200 p-4 text-center"><p className="text-xs text-gray-500">{rotulo}</p><p className="mt-1 text-2xl font-bold text-gray-800">{valor}</p></div>)}
            </div>
            <button type="button" onClick={() => onNavigate("atualizacao-cadastral-rebanho")} className="flex w-full items-center justify-center gap-2 text-sm font-medium text-[#1A7A3C] hover:underline"><ExternalLink size={15} /> Acessar cadastro para editar o rebanho</button>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-gray-700">
              <input type="checkbox" checked={confirmado} onChange={(event) => setConfirmado(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1A7A3C]" />
              <span>Confirmo que os dados do rebanho estão atualizados e podem ser usados como limite desta declaração.</span>
            </label>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <CustomButton variant="outlined" onClick={() => onNavigate("declaracao-vacinacao")}>Cancelar</CustomButton>
              <CustomButton disabled={!confirmado} onClick={() => onNavigate("adicionar-declaracao-vacinacao", { rebanhoValidado: true })}><CheckCircle2 size={16} /> Confirmar dados</CustomButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
