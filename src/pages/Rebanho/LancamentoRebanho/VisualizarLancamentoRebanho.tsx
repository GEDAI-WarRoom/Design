import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import {
  LancamentoRebanhoForm,
  type LancamentoRebanhoFormValue,
} from "./LancamentoRebanhoForm";
import {
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

export function VisualizarLancamentoRebanhoPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterLancamentoRebanho();
  if (!registro) return null;

  const podeEditar = registro.situacao === "Ativo" && !registro.possuiAtualizacaoPosterior;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-rebanho" hideSearch />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("lancamento-rebanho")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Lançamentos de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Lançamento de Rebanho</h1>
            {podeEditar && (
              <CustomButton
                icon={<Pencil size={17} />}
                onClick={() => onNavigate("editar-lancamento-rebanho", registro)}
              >
                Editar
              </CustomButton>
            )}
          </div>
        
        </div>

        <LancamentoRebanhoForm value={toFormValue(registro)} onChange={() => {}} mode="view" />
      </main>
    </div>
  );
}
