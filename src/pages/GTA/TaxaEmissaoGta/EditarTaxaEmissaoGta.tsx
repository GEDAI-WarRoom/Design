import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  RequiredFieldsNotice,
  TaxaEmissaoGtaForm,
  taxaValida,
} from "./TaxaEmissaoGtaForm";
import {
  atualizarTaxaEmissaoGta,
  obterTaxaEmissaoGta,
  type TaxaEmissaoGta,
  type TaxaEmissaoGtaDraft,
} from "./taxaEmissaoGtaData";

interface PageProps {
  dados?: Partial<TaxaEmissaoGta> | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

function paraDraft(taxa: TaxaEmissaoGta): TaxaEmissaoGtaDraft {
  const { id: _id, ...draft } = taxa;
  return draft;
}

export function EditarTaxaEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: PageProps) {
  const [taxa, setTaxa] = useState(() => obterTaxaEmissaoGta(dados));
  const [erro, setErro] = useState("");
  const [salva, setSalva] = useState(false);
  const draft = paraDraft(taxa);

  const salvar = () => {
    if (!taxaValida(draft)) {
      setErro("Preencha todos os campos obrigatórios antes de prosseguir.");
      return;
    }

    const resultado = atualizarTaxaEmissaoGta(taxa);
    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }
    setTaxa(resultado.taxa);
    setErro("");
    setSalva(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="taxa-emissao-gta"
        hideSearch
      />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-taxa-emissao-gta", taxa)}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} /> Visualizar Taxa de Emissão de Documento
            Sanitário
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Taxa de Emissão de Documento Sanitário
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]"
            >
              Salvar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        <TaxaEmissaoGtaForm
          value={draft}
          mode="edit"
          onChange={(next) => {
            setTaxa({ ...taxa, ...next, especie: taxa.especie });
            setErro("");
          }}
        />
      </main>

      {salva && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf4eb]">
              <Check size={32} className="text-[#1A7A3C] stroke-[3]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Taxa de Emissão de Documento Sanitário atualizada com sucesso!
            </h2>
            <div className="mt-8 flex w-full justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("taxa-emissao-gta")}
                className="h-11 rounded-md border border-[#1A7A3C] px-8 text-sm font-semibold text-[#1A7A3C]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-taxa-emissao-gta", taxa)}
                className="h-11 rounded-md bg-[#1A7A3C] px-8 text-sm font-semibold text-white hover:bg-[#15612F]"
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
