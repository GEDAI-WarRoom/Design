import React, { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// HELPER DE UI
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
      <span className="text-base font-semibold text-gray-800">{title}</span>
      {children}
    </div>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR (CONSULTAR) DAE
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarDAEPage({ onLogout, onNavigate }: PageProps) {
  const [codigoBarras, setCodigoBarras] = useState("");
  const [isSucesso, setIsSucesso] = useState(false);

  const handleConsultarPagamento = () => {
    if (!codigoBarras) return;
    setIsSucesso(true);
  };

  // Monta um registro de DAE consultado a partir do código de barras informado (mock)
  const daeConsultadoMock = {
    id: Date.now(),
    origemDae: "PRODEMGE",
    numeroDae: codigoBarras.slice(0, 13).padEnd(13, "0"),
    linhaDigitavel: codigoBarras.padEnd(48, "0").slice(0, 48),
    codigoBarras,
    tipoIdentificacao: "CPF",
    numeroContribuinte: "555.009.956-40",
    nomeContribuinte: "José Aarão Neto",
    enderecoContribuinte: "Rua das Acácias, 120",
    estadoContribuinte: "Minas Gerais",
    municipioContribuinte: "Lavras",
    telefoneContribuinte: "(35) 99999-1234",
    municipioArrecadador: "Lavras",
    receita: "64 - Venda de GTA Avulsa",
    historico: "Emissão referente à venda de GTA avulsa.",
    itens: [
      {
        descricao: "Venda de GTA Avulsa",
        receita: "64 - Venda de GTA Avulsa",
        valorCobrado: 45.9,
        desconto: 0,
        multa: 0,
        juros: 0,
        valorTotal: 45.9,
      },
    ],
    tipoReferencia: "Mês-ano referência",
    mesReferencia: "Julho",
    anoReferencia: "2026",
    periodoReferencia: "",
    dataValidade: "2026-08-15",
    valor: 45.9,
    statusPagamento: "Aberto" as const,
    statusDae: "Ativo" as const,
    dataPagamento: "",
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="dae"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("dae")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os DAEs
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar DAE
            </h1>

            <button
              type="button"
              onClick={handleConsultarPagamento}
              disabled={!codigoBarras}
              className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Consultar Pagamento
            </button>
          </div>
        </div>

        {/* Alerta de Campos Obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <Info
            size={20}
            className="text-gray-500 flex-shrink-0 stroke-[2.5]"
          />
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span> são obrigatórios e
            deverão ser preenchidos.
          </p>
        </div>

        {/* Informações Gerais */}
        <Section title="Informações Gerais">
          <FloatInput
            label="Código de Barras"
            required
            placeholder="Digite os dígitos do código de barras do DAE"
            value={codigoBarras}
            onChange={(v) => setCodigoBarras(v.replace(/\D/g, "").slice(0, 44))}
            maxLength={44}
          />

          <p className="text-xs text-gray-400 -mt-2">
            Informe até 44 dígitos numéricos. Ao consultar, os demais dados do
            DAE serão carregados automaticamente.
          </p>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              DAE consultado com sucesso!
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Os dados do DAE referente ao código de barras informado foram
              carregados.
            </p>

            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("dae");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>

              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-dae", daeConsultadoMock);
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
