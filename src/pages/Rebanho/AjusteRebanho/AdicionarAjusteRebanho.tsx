import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  AjusteRebanhoForm,
  ajusteRebanhoValido,
  criarEstadoInicialAjusteRebanho,
  RequiredFieldsNotice,
  type AjusteRebanhoFormValue,
} from "./AjusteRebanhoForm";
import {
  criarAjusteRebanho,
  type AjusteRebanho,
} from "./ajusteRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarAjusteRebanhoPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [value, setValue] = useState<AjusteRebanhoFormValue>(
    criarEstadoInicialAjusteRebanho,
  );
  const [triedToSave, setTriedToSave] = useState(false);
  const [savedRecord, setSavedRecord] = useState<AjusteRebanho | null>(null);
  const valid = ajusteRebanhoValido(value);

  const adicionar = () => {
    setTriedToSave(true);
    if (
      !valid ||
      !value.produtor ||
      !value.estabelecimento ||
      !value.exploracao
    ) {
      return;
    }

    const created = criarAjusteRebanho({
      produtor: value.produtor,
      estabelecimento: value.estabelecimento,
      exploracao: value.exploracao,
      nucleo: value.nucleo,
      faixas: value.faixas.map((faixa) => ({ ...faixa })),
      justificativa: value.justificativa.trim(),
      documentos: value.documentos.map((document) => ({
        ...document,
        descricao: document.descricao.trim(),
      })),
    });
    setSavedRecord(created);
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
            onClick={() => onNavigate("ajuste-rebanho")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Ajustes de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Ajuste de Rebanho
            </h1>
            <button
              type="button"
              onClick={adicionar}
              className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15612F]"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <AjusteRebanhoForm
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
            setTriedToSave(false);
          }}
          onNavigate={onNavigate}
          onReset={() => {
            setValue(criarEstadoInicialAjusteRebanho());
            setTriedToSave(false);
          }}
        />

        {triedToSave && !valid && (
          <p className="text-sm font-medium text-red-500">
            Preencha os campos obrigatórios, selecione o documento
            comprobatório e confira os dados do ajuste para continuar.
          </p>
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
              Ajuste de rebanho cadastrado com sucesso!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              O estabelecimento, o produtor e a chefia responsável serão
              notificados sobre o ajuste.
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
