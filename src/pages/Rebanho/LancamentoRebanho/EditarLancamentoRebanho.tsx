import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  LancamentoRebanhoForm,
  type LancamentoRebanhoFormValue,
} from "./LancamentoRebanhoForm";
import {
  inativarLancamentoRebanho,
  obterLancamentoRebanho,
  type LancamentoRebanho,
} from "./lancamentoRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: LancamentoRebanho | null;
}

function toFormValue(registro: LancamentoRebanho): LancamentoRebanhoFormValue {
  return {
    produtor: registro.produtor,
    estabelecimento: registro.estabelecimento,
    exploracao: registro.exploracao,
    nucleo: registro.nucleo,
    lancamentos: registro.lancamentos,
    justificativaMortalidade: registro.justificativaMortalidade,
    documentosMortalidade: registro.documentosMortalidade,
    justificativaRoubo: registro.justificativaRoubo,
    documentoRoubo: registro.documentoRoubo,
    situacao: registro.situacao,
    dataLancamento: registro.dataLancamento.split("-").reverse().join("/"),
  };
}

export function EditarLancamentoRebanhoPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterLancamentoRebanho();
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState("");

  if (!registro) return null;

  const inativar = () => {
    const resultado = inativarLancamentoRebanho(registro.id);
    if (!resultado.registro) {
      setErro(resultado.erro);
      setConfirmando(false);
      return;
    }
    onNavigate("visualizar-lancamento-rebanho", resultado.registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-rebanho" hideSearch />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-lancamento-rebanho", registro)}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Visualizar Lançamento de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Lançamento de Rebanho</h1>
            {registro.situacao === "Ativo" && (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="h-11 rounded-md bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Inativar
              </button>
            )}
          </div>
        </div>

        <LancamentoRebanhoForm value={toFormValue(registro)} onChange={() => {}} mode="edit" />
        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {erro}
          </div>
        )}
      </main>

      {confirmando && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">Inativar lançamento de rebanho?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ao confirmar, a situação passará para Inativo e a alteração causada por este lançamento será revertida no mock da sessão.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="h-10 rounded-md border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={inativar}
                className="h-10 rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirmar inativação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
