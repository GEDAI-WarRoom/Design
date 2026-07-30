import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AjusteRebanhoForm,
  RequiredFieldsNotice,
  type AjusteRebanhoFormValue,
} from "./AjusteRebanhoForm";
import {
  atualizarSituacaoAjusteRebanho,
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
  faixas: record.faixas.map((faixa) => ({ ...faixa })),
  justificativa: record.justificativa,
  documentos: record.documentos.map((document) => ({ ...document })),
  situacao: record.situacao,
});

export function EditarAjusteRebanhoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const initialRecord = dados
    ? obterAjusteRebanho(dados.id) ?? dados
    : obterAjusteRebanho();
  const [value, setValue] = useState<AjusteRebanhoFormValue | null>(
    initialRecord ? toFormValue(initialRecord) : null,
  );
  const [error, setError] = useState("");
  const [savedRecord, setSavedRecord] = useState<AjusteRebanho | null>(null);

  if (!initialRecord || !value) return null;

  const salvar = () => {
    const result = atualizarSituacaoAjusteRebanho(
      initialRecord.id,
      value.situacao,
    );
    if (!result.registro) {
      setError(result.erro);
      return;
    }

    setError("");
    setSavedRecord(result.registro);
  };

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
            onClick={() =>
              onNavigate("visualizar-ajuste-rebanho", initialRecord)
            }
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Visualizar Ajuste de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Ajuste de Rebanho
            </h1>
            <button
              type="button"
              onClick={salvar}
              disabled={initialRecord.situacao === "Inativo"}
              className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15612F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <AjusteRebanhoForm
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
            setError("");
          }}
          onNavigate={onNavigate}
          mode="edit"
          podeInativar={initialRecord.podeInativar}
          atualizacaoPosterior={initialRecord.atualizacaoPosterior}
        />

        {error && (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
      </main>

      {savedRecord && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check
                size={28}
                className="text-[#1A7A3C]"
                strokeWidth={3}
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Ajuste de rebanho atualizado com sucesso!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Quando inativado, o ajuste deixa de compor o rebanho atual.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSavedRecord(null);
                  onNavigate("ajuste-rebanho");
                }}
                className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50/40"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSavedRecord(null);
                  onNavigate("visualizar-ajuste-rebanho", savedRecord);
                }}
                className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
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
