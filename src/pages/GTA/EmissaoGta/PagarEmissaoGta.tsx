import { useState } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  formatarMoedaGta,
  obterEmissaoGta,
  pagarEmissaoGta,
  type EmissaoGta,
} from "./emissaoGtaData";

export function PagarEmissaoGtaPage({
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
  const [sucesso, setSucesso] = useState(false);
  if (!emissao) return null;

  const confirmar = () => {
    const atualizada = pagarEmissaoGta(emissao.id);
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
              Pagamento da GTA
            </h1>
            {emissao.situacao === "Gravada" && emissao.necessitaPagamento && (
              <button
                type="button"
                onClick={confirmar}
                className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F] flex items-center gap-2"
              >
                <CreditCard size={16} />
                Confirmar Pagamento
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
              label="Responsável de Procedência"
              value={emissao.procedencia.responsavel?.nome ?? ""}
              disabled
              required
            />
            <FloatInput
              label="Valor da GTA"
              value={formatarMoedaGta(emissao.valorGta)}
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
      </main>

      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Pagamento registrado com sucesso!
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("visualizar-emissao-gta", emissao)}
              className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold mt-6"
            >
              Visualizar GTA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
