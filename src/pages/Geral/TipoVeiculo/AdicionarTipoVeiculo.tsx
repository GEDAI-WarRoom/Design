import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
  Info,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- tipos de veículos ---

const MEIOS_TRANSPORTE = [
  "Aéreo",
  "A Pé",
  "Ferroviário",
  "Marítimo/Fluvial",
  "Rodoviário",
];
const SITUACOES = ["Ativo", "Inativo"];
const toOptions = (arr: string[]) =>
  arr.map((v) => ({ value: v, label: v }));

// --- helpers ---

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

// --- tipos ---

interface TipoVeiculoData {
  id?: number;
  tipoVeiculo: string;
  meioTransporte: string;
  situacao: "Ativo" | "Inativo";
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  // Quando presente, a tela entra em modo de edição e a Situação passa a ficar disponível
  data?: TipoVeiculoData;
}

export function AdicionarTipoVeiculoPage({
  onLogout,
  onNavigate,
  data,
}: PageProps) {
  const isEdicao = !!data;

  const [tipoVeiculo, setTipoVeiculo] = useState(
    data?.tipoVeiculo ?? "",
  );
  const [meioTransporte, setMeioTransporte] = useState(
    data?.meioTransporte ?? "",
  );
  const [situacao, setSituacao] = useState<string>(
    data?.situacao ?? "Ativo",
  );

  const [isSucesso, setIsSucesso] = useState(false);

  const formularioValido =
    tipoVeiculo.trim() !== "" &&
    meioTransporte !== "" &&
    (!isEdicao || situacao !== "");

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="tipo-veiculo"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("tipo-veiculo")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Tipos de Veículo
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEdicao
                ? "Editar Tipo de Veículo"
                : "Adicionar Tipo de Veículo"}
            </h1>
            <button
              type="button"
              disabled={!formularioValido}
              onClick={() => setIsSucesso(true)}
              className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm"
            >
              {isEdicao ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span>{" "}
            são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div
            className={`grid grid-cols-1 ${isEdicao ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4 items-center`}
          >
            <FloatInput
              label="Tipo de Veículo"
              required
              value={tipoVeiculo}
              onChange={setTipoVeiculo}
              maxLength={255}
            />

            <FloatSelect
              label="Meio de Transporte"
              required
              value={meioTransporte}
              onChange={setMeioTransporte}
              options={toOptions(MEIOS_TRANSPORTE)}
            />

            {isEdicao && (
              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={setSituacao}
                options={toOptions(SITUACOES)}
              />
            )}
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check
                size={28}
                className="text-[#1A7A3C]"
                strokeWidth={3}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdicao
                ? "Tipo de veículo atualizado com sucesso!"
                : "Tipo de veículo cadastrado com sucesso!"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {tipoVeiculo
                ? `O tipo de veículo "${tipoVeiculo}"`
                : "O tipo de veículo"}{" "}
              foi {isEdicao ? "atualizado" : "cadastrado"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("tipo-veiculo");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-tipo-veiculo", {
                    id: data?.id,
                    tipoVeiculo,
                    meioTransporte,
                    situacao,
                  });
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
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