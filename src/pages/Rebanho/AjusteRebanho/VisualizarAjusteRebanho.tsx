import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AjusteRebanhoForm,
  type AjusteRebanhoFormValue,
} from "./AjusteRebanhoForm";
import {
  obterAjusteRebanho,
  type AjusteRebanho,
} from "./ajusteRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: AjusteRebanho | null;
}

const toFormValue = (record: AjusteRebanho): AjusteRebanhoFormValue => ({
  produtor: record.produtor,
  estabelecimento: record.estabelecimento,
  exploracao: record.exploracao,
  nucleo: record.nucleo,
  faixas: record.faixas,
  justificativa: record.justificativa,
  documentos: record.documentos,
  situacao: record.situacao,
});

export function VisualizarAjusteRebanhoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const record = dados
    ? obterAjusteRebanho(dados.id) ?? dados
    : obterAjusteRebanho();

  if (!record) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="ajuste-rebanho"
        hideSearch
      />

      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("ajuste-rebanho")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Ajustes de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Ajuste de Rebanho
            </h1>
            {record.situacao === "Ativo" && (
              <button
                type="button"
                onClick={() => onNavigate("editar-ajuste-rebanho", record)}
                className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15612F]"
              >
                <Pencil size={16} /> Editar
              </button>
            )}
          </div>
        </div>

        <AjusteRebanhoForm
          value={toFormValue(record)}
          onChange={() => {}}
          onNavigate={onNavigate}
          mode="view"
          podeInativar={record.podeInativar}
          atualizacaoPosterior={record.atualizacaoPosterior}
        />
      </main>
    </div>
  );
}
