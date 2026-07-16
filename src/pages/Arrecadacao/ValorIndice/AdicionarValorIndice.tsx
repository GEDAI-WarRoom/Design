import React, { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  SimNao,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (Valor por Índice)
// ==========================================================
const INDICES = [{ value: "UFEMG", label: "UFEMG" }];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const toOptions = (arr: string[]) =>
  arr.map((v) => ({ value: v, label: v }));

// ==========================================================
// HELPER DE UI (Section — mesmo padrão das demais páginas)
// ==========================================================
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex flex-col gap-5">
      <span className="text-base font-semibold text-gray-800">
        {title}
      </span>
      {children}
    </div>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR VALOR POR ÍNDICE
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarValorIndicePage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [indice, setIndice] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [valor, setValor] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  const handleAdicionar = () => {
    // Validação simples de campos obrigatórios antes de simular o cadastro
    if (!indice || !mes || !ano || !valor) return;
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="valor-indice"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("valor-indice")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Valores por Índice
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Valor por Índice
            </h1>
            <button
              type="button"
              onClick={handleAdicionar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Alerta de Campos Obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span>{" "}
            são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Dados do Valor por Índice */}
        <Section title="Valor por Índice">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatInput
              label="Valor"
              required
              placeholder="0,00"
              value={valor}
              onChange={(v) =>
                setValor(v.replace(/[^0-9,]/g, ""))
              }
            />

            <FloatSelect
              label="Índice"
              required
              value={indice}
              onChange={setIndice}
              options={INDICES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <FloatSelect
              label="Mês"
              required
              value={mes}
              onChange={setMes}
              options={toOptions(MESES)}
            />

            <FloatInput
              label="Ano"
              required
              placeholder="0000"
              value={ano}
              onChange={(v) =>
                setAno(v.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
            />
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
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
              Valor por Índice cadastrado com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {indice
                ? `O valor do índice ${indice}`
                : "O valor do índice"}{" "}
              referente a {mes || "—"}/{ano || "—"} foi
              cadastrado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("valor-indice");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-valor-indice");
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