import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EtapaAtualizacaoCadastralForm } from "./EtapaAtualizacaoCadastralForm";
import {
  obterEtapaAtualizacaoCadastral,
  type EtapaAtualizacaoCadastral,
} from "./etapaAtualizacaoCadastralData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EtapaAtualizacaoCadastral | null;
}

export function VisualizarEtapaAtualizacaoCadastralPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registro =
    obterEtapaAtualizacaoCadastral(dados?.id) ??
    dados ??
    obterEtapaAtualizacaoCadastral(null);

  if (!registro) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="etapa-atualizacao-cadastral"
        hideSearch
      />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <div className="border-b border-gray-300 pb-6">
          <button
            type="button"
            onClick={() => onNavigate("etapa-atualizacao-cadastral")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Todas as Etapas de Atualização Cadastral
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Etapa de Atualização Cadastral
            </h1>
            <button
              type="button"
              onClick={() =>
                onNavigate("editar-etapa-atualizacao-cadastral", registro)
              }
              className="flex h-11 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
            >
              <Pencil size={16} />
              Editar
            </button>
          </div>
        </div>

        <EtapaAtualizacaoCadastralForm
          value={registro}
          onChange={() => {}}
          mode="view"
        />
      </main>
    </div>
  );
}
