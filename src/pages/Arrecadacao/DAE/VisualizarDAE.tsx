import React, { useState } from "react";
import { ArrowLeft, Info, ChevronUp, ChevronDown } from "lucide-react";

import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// ==========================================================
// HELPERS DE UI
// ==========================================================
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>

        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5 flex flex-col gap-5">
          {children}
        </div>
      )}
    </div>
  );
}

const fmtData = (iso?: string) => {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

const fmtValor = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

// ==========================================================
// TIPOS
// ==========================================================
interface DaeItem {
  descricao: string;
  receita: string;
  valorCobrado: number;
  desconto: number;
  multa: number;
  juros: number;
  valorTotal: number;
}

interface DaeDetalhe {
  id: number;
  origemDae: string;
  numeroDae: string;
  linhaDigitavel: string;
  codigoBarras: string;
  tipoIdentificacao: "CPF" | "CNPJ";
  numeroContribuinte: string;
  nomeContribuinte: string;
  enderecoContribuinte: string;
  estadoContribuinte: string;
  municipioContribuinte: string;
  telefoneContribuinte: string;
  municipioArrecadador: string;
  receita: string;
  historico: string;
  itens: DaeItem[];
  tipoReferencia: "Mês-ano referência" | "Período referência" | string;
  mesReferencia?: string;
  anoReferencia?: string;
  periodoReferenciaDe?: string;
  periodoReferenciaAte?: string;
  dataValidade: string;
  valor: number;
  statusPagamento: "Aberto" | "Pago";
  statusDae: "Ativo" | "Cancelado";
  dataPagamento?: string;
}

// ==========================================================
// MOCK DE DETALHE
// ==========================================================
const DAE_DETALHE_MOCK: Record<number, DaeDetalhe> = {
  1: {
    id: 1,
    origemDae: "PRODEMGE",
    numeroDae: "3120240000001",
    linhaDigitavel:
      "85810000001 2 90020240610001 1 00000004590 1 00000000000 0",
    codigoBarras: "85810000001900202406100011000000459000000000000",
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
    mesReferencia: "Junho",
    anoReferencia: "2026",
    dataValidade: "2026-07-10",
    valor: 45.9,
    statusPagamento: "Pago",
    statusDae: "Ativo",
    dataPagamento: "2026-06-12",
  },
  2: {
    id: 2,
    origemDae: "PRODEMGE",
    numeroDae: "3120240000002",
    linhaDigitavel:
      "85810000002 1 90020240701001 1 00000015000 1 00000000000 0",
    codigoBarras: "85810000002190202407010011000001500000000000000",
    tipoIdentificacao: "CNPJ",
    numeroContribuinte: "56.338.814/0001-95",
    nomeContribuinte: "Agropecuária Vale Verde Ltda.",
    enderecoContribuinte: "Av. Rondon Pacheco, 3200",
    estadoContribuinte: "Minas Gerais",
    municipioContribuinte: "Uberlândia",
    telefoneContribuinte: "(34) 98888-7777",
    municipioArrecadador: "Uberlândia",
    receita: "1 - Emissão de Guia de Trânsito Animal",
    historico: "Emissão referente ao trânsito animal do período.",
    itens: [
      {
        descricao: "Emissão de GTA",
        receita: "1 - Emissão de Guia de Trânsito Animal",
        valorCobrado: 150,
        desconto: 0,
        multa: 0,
        juros: 0,
        valorTotal: 150,
      },
    ],
    tipoReferencia: "Período referência",
    periodoReferenciaDe: "2026-07-01",
    periodoReferenciaAte: "2026-07-31",
    dataValidade: "2026-08-15",
    valor: 150,
    statusPagamento: "Aberto",
    statusDae: "Ativo",
    dataPagamento: "",
  },
  3: {
    id: 3,
    origemDae: "PRODEMGE",
    numeroDae: "3120240000003",
    linhaDigitavel:
      "85810000003 4 90020240518001 1 00000032000 1 00000000000 0",
    codigoBarras: "85810000003490202405180011000003200000000000000",
    tipoIdentificacao: "CPF",
    numeroContribuinte: "444.009.956-40",
    nomeContribuinte: "Divino de Souza Sobrinho",
    enderecoContribuinte: "Rua Vale Bonito, 45",
    estadoContribuinte: "Minas Gerais",
    municipioContribuinte: "Varginha",
    telefoneContribuinte: "(35) 97777-6666",
    municipioArrecadador: "Varginha",
    receita: "3 - Captação de Leite",
    historico: "Emissão referente à captação de leite do mês.",
    itens: [
      {
        descricao: "Captação de Leite",
        receita: "3 - Captação de Leite",
        valorCobrado: 320,
        desconto: 0,
        multa: 0,
        juros: 0,
        valorTotal: 320,
      },
    ],
    tipoReferencia: "Mês-ano referência",
    mesReferencia: "Maio",
    anoReferencia: "2026",
    dataValidade: "2026-06-18",
    valor: 320,
    statusPagamento: "Aberto",
    statusDae: "Cancelado",
    dataPagamento: "",
  },
};

const DETALHE_PADRAO: DaeDetalhe = DAE_DETALHE_MOCK[1];

// ==========================================================
// PÁGINA: VISUALIZAR DAE
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dae?: Partial<DaeDetalhe> & { id: number };
}

export function VisualizarDAEPage({ onLogout, onNavigate, dae }: PageProps) {
  // Se o registro recebido já vier completo (ex: vindo direto da consulta do Cadastro), usa ele.
  // Caso contrário (ex: vindo da listagem, só com os campos resumidos), busca o detalhe completo pelo id.
  const detalhe: DaeDetalhe =
    dae && dae.codigoBarras
      ? (dae as DaeDetalhe)
      : (dae && DAE_DETALHE_MOCK[dae.id]) || DETALHE_PADRAO;

  const [statusPagamento, setStatusPagamento] = useState<"Aberto" | "Pago">(
    detalhe.statusPagamento,
  );
  const [dataPagamento, setDataPagamento] = useState(
    detalhe.dataPagamento || "",
  );
  const [confirmando, setConfirmando] = useState(false);
  const [erroData, setErroData] = useState("");

  const handleConfirmarPagamento = () => {
    if (!confirmando) {
      // Primeiro clique: revela o campo "Data de Pagamento"
      setConfirmando(true);
      setErroData("");
      return;
    }

    // Segundo clique: valida e confirma
    if (!dataPagamento) {
      setErroData("Informe a data de pagamento.");
      return;
    }

    if (dataPagamento >= detalhe.dataValidade) {
      setErroData(
        "A data de pagamento deve ser anterior à data de validade do DAE.",
      );
      return;
    }
    setErroData("");
    setStatusPagamento("Pago");
    setConfirmando(false);
  };

  const handleCancelarConfirmacao = () => {
    setStatusPagamento("Aberto");
    setDataPagamento("");
    setConfirmando(false);
    setErroData("");
  };

  const handleDocumentoRelacionado = () => {
    alert(
      "Ir para a visualização do documento relacionado (ex: lote de pagamento) — tela ainda não implementada.",
    );
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

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar DAE
            </h1>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-2">
              {statusDaePermiteDocumento(detalhe.statusDae) && (
                <button
                  type="button"
                  onClick={handleDocumentoRelacionado}
                  className="flex items-center gap-2 px-4 h-10 border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-xs font-bold rounded-md transition"
                >
                  Documento Relacionado
                </button>
              )}

              {statusPagamento === "Pago" && (
                <button
                  type="button"
                  onClick={handleCancelarConfirmacao}
                  className="flex items-center gap-2 px-4 h-10 border border-red-500 text-red-500 hover:bg-red-50 text-xs font-bold rounded-md transition"
                >
                  Cancelar Confirmação do Pagamento
                </button>
              )}

              {statusPagamento === "Aberto" && (
                <button
                  type="button"
                  onClick={handleConfirmarPagamento}
                  className="flex items-center gap-2 px-4 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
                >
                  {confirmando ? "Confirmar" : "Confirmar Pagamento"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Aviso do fluxo de confirmação */}
        {confirmando && (
          <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
            <Info
              size={20}
              className="text-gray-500 flex-shrink-0 stroke-[2.5]"
            />

            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Informe a <span className="font-semibold">Data de Pagamento</span>{" "}
              abaixo e clique em "Confirmar" novamente para concluir.
            </p>
          </div>
        )}

        {/* 1. Informações Gerais */}
        <Section title="Informações Gerais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Origem do DAE"
              value={detalhe.origemDae}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Nº do DAE"
              value={detalhe.numeroDae}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Linha Digitável"
              value={detalhe.linhaDigitavel}
              onChange={() => {}}
              disabled
              className="md:col-span-2"
            />

            <FloatInput
              label="Código de Barras"
              value={detalhe.codigoBarras}
              onChange={() => {}}
              disabled
              className="md:col-span-2"
            />
          </div>
        </Section>

        {/* 2. Informações do Contribuinte */}
        <Section title="Informações do Contribuinte">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Tipo de Identificação"
              value={detalhe.tipoIdentificacao}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Nº do Contribuinte"
              value={detalhe.numeroContribuinte}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Nome do Contribuinte"
              value={detalhe.nomeContribuinte}
              onChange={() => {}}
              disabled
              className="md:col-span-2"
            />

            <FloatInput
              label="Endereço do Contribuinte"
              value={detalhe.enderecoContribuinte}
              onChange={() => {}}
              disabled
              className="md:col-span-2"
            />

            <FloatInput
              label="Estado do Contribuinte"
              value={detalhe.estadoContribuinte}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Município do Contribuinte"
              value={detalhe.municipioContribuinte}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Telefone"
              value={detalhe.telefoneContribuinte}
              onChange={() => {}}
              disabled
            />
          </div>
        </Section>

        {/* 3. Informações do Documento */}
        <Section title="Informações do Documento">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Município Arrecadador"
              value={detalhe.municipioArrecadador}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Receita"
              value={detalhe.receita}
              onChange={() => {}}
              disabled
            />
          </div>

          <LargeTextArea
            label="Histórico"
            value={detalhe.historico}
            onChange={() => {}}
            disabled
            rows={3}
          />
        </Section>

        {/* 4. Lista de Itens (Um ou mais) */}
        <Section title="Itens">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    DESCRIÇÃO
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    RECEITA
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    VALOR COBRADO
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    DESCONTO
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    MULTA
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    JUROS
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    VALOR TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {detalhe.itens.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {item.descricao}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {item.receita}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">
                      {fmtValor(item.valorCobrado)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">
                      {fmtValor(item.desconto)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">
                      {fmtValor(item.multa)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-right whitespace-nowrap">
                      {fmtValor(item.juros)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-semibold text-right whitespace-nowrap">
                      {fmtValor(item.valorTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 5. Informações Complementares */}
        <Section title="Informações Complementares">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Tipo de Referência"
              value={detalhe.tipoReferencia}
              onChange={() => {}}
              disabled
            />

            {/* Se for Mês-ano: cria um sub-grid para dividir a 2ª coluna em duas */}
            {detalhe.tipoReferencia === "Mês-ano referência" && (
              <div className="grid grid-cols-2 gap-3">
                <FloatInput
                  label="Mês para Referência"
                  value={detalhe.mesReferencia || ""}
                  onChange={() => {}}
                  disabled
                />

                <FloatInput
                  label="Ano para Referência"
                  value={detalhe.anoReferencia || ""}
                  onChange={() => {}}
                  disabled
                />
              </div>
            )}

            {detalhe.tipoReferencia === "Período referência" && (
              <FloatInput
                label="Período de Referência"
                value={
                  detalhe.periodoReferenciaDe && detalhe.periodoReferenciaAte
                    ? `De ${fmtData(detalhe.periodoReferenciaDe)} até ${fmtData(detalhe.periodoReferenciaAte)}`
                    : ""
                }
                onChange={() => {}}
                disabled
              />
            )}

            <FloatInput
              label="Data de Validade do DAE"
              value={fmtData(detalhe.dataValidade)}
              onChange={() => {}}
              disabled
            />

            <FloatInput
              label="Valor"
              value={fmtValor(detalhe.valor)}
              onChange={() => {}}
              disabled
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400 font-medium">
                Status do Pagamento
              </span>
              {statusPagamento}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400 font-medium">
                Status do DAE
              </span>
              {detalhe.statusDae}
            </div>
          </div>

          {/* Data de Pagamento — só aparece durante/depois da confirmação */}
          {(confirmando || statusPagamento === "Pago") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatInput
                label="Data de Pagamento"
                required={confirmando}
                type="date"
                value={dataPagamento}
                onChange={(v) => {
                  setDataPagamento(v);
                  setErroData("");
                }}
                disabled={statusPagamento === "Pago"}
              />
            </div>
          )}
          {erroData && <p className="text-sm text-red-500 -mt-2">{erroData}</p>}
        </Section>
      </main>
    </div>
  );
}

function statusDaePermiteDocumento(status: "Ativo" | "Cancelado") {
  return status === "Ativo";
}
