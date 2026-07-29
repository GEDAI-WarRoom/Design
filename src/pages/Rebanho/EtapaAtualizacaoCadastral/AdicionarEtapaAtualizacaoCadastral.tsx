import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  EtapaAtualizacaoCadastralForm,
  etapaAtualizacaoCadastralValida,
  type EtapaAtualizacaoFormValue,
} from "./EtapaAtualizacaoCadastralForm";
import {
  criarEtapaAtualizacaoCadastral,
  proximoCodigoEtapaAtualizacao,
  type EtapaAtualizacaoCadastral,
} from "./etapaAtualizacaoCadastralData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const anoAtual = new Date().getFullYear();

const ESTADO_INICIAL: EtapaAtualizacaoFormValue = {
  codigo: proximoCodigoEtapaAtualizacao(anoAtual),
  ano: anoAtual,
  dataInicio: "",
  dataFim: "",
  especies: [],
  etapasVacinacao: [],
  situacao: "Criada",
};

export function AdicionarEtapaAtualizacaoCadastralPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [value, setValue] =
    useState<EtapaAtualizacaoFormValue>(ESTADO_INICIAL);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] =
    useState<EtapaAtualizacaoCadastral | null>(null);
  const valido = etapaAtualizacaoCadastralValida(value);

  const adicionar = () => {
    setTentouSalvar(true);
    if (!valido) return;
    setRegistroSalvo(criarEtapaAtualizacaoCadastral(value));
  };

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
              Adicionar Etapa de Atualização Cadastral
            </h1>
            <button
              type="button"
              onClick={adicionar}
              className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
            >
              Adicionar
            </button>
          </div>
        </div>

        <EtapaAtualizacaoCadastralForm
          value={value}
          onChange={setValue}
          mode="create"
        />

        {tentouSalvar && !valido && (
          <p className="text-sm font-medium text-red-500">
            Preencha as datas corretamente e selecione ao menos uma espécie para
            continuar.
          </p>
        )}
      </main>

      {registroSalvo && (
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
              Etapa de atualização cadastral cadastrada com sucesso!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A etapa{" "}
              <span className="font-medium text-gray-700">
                {registroSalvo.codigo}
              </span>{" "}
              foi cadastrada.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate("etapa-atualizacao-cadastral")}
                className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    "visualizar-etapa-atualizacao-cadastral",
                    registroSalvo,
                  )
                }
                className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
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
