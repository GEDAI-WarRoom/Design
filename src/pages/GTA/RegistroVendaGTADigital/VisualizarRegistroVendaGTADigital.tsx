import React, { useState } from "react";
import { ArrowLeft, Info, Pencil, Eye, FileText, CreditCard, Clock, Calendar, DollarSign, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import { obterRegistroVendaGTA, FATOR_VALOR_GTA, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </div>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

function EntidadeLeitura({
  label, value, icon, onVer,
}: { label: string; value: string; icon?: React.ReactNode; onVer?: () => void }) {
  return (
    <div className="flex items-end gap-2 w-full">
      <div className="flex-1">
        <FloatInput label={label} value={value} icon={icon} disabled onChange={() => { }} />
      </div>
      {onVer && (
        <button
          type="button"
          onClick={onVer}
          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 mb-[1px]"
          title={`Visualizar ${label}`}
          aria-label={`Visualizar ${label}`}
        >
          <Eye size={20} />
        </button>
      )}
    </div>
  );
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
  dados?: RegistroVendaGTADigital | null;
}

export function VisualizarRegistroVendaGTADigitalPage({
  onLogout = () => { },
  onNavigate = (screen: string) => console.log("navigate:", screen),
  dados,
}: PageProps) {
  const registro = dados ?? obterRegistroVendaGTA(null);

  // ── ESTADOS DINÂMICOS DE PAGAMENTO, SITUAÇÃO E DAE ─────────────
  const [situacao, setSituacao] = useState<string>(registro?.situacao || "Gravada");
  const [statusPagamento, setStatusPagamento] = useState<"pendente" | "realizado" | "confirmado">("pendente");
  const [dataPagamento, setDataPagamento] = useState<string>("");
  const [dataLiberacao, setDataLiberacao] = useState<string>("");
  const [dae, setDae] = useState<{ codigo: string; valor: number; dataVencimento: string } | null>(null);

  if (!registro) return null;

  const quantidadeComprada = registro.quantidadeComprada || 0;
  const quantidadeUtilizada = registro.quantidadeUtilizada || 0;
  const quantidadeDisponivel = quantidadeComprada - quantidadeUtilizada;
  const valorTotal = quantidadeComprada * FATOR_VALOR_GTA;

  // ── Regras Dinâmicas de Estado ─────────────────────────────────
  const isPendente = statusPagamento === "pendente";
  const isRealizado = statusPagamento === "realizado";
  const isConfirmado = statusPagamento === "confirmado";
  const pagamentoRealizado = isRealizado || isConfirmado;

  const mostrarDataPagamento = isConfirmado;
  const mostrarDataLiberacao = pagamentoRealizado;
  const liberacaoRealizada = Boolean(dataLiberacao);

  const podeGravar = mostrarDataLiberacao && !liberacaoRealizada && situacao !== "Cancelado";
  const temDaeRelacionado = Boolean(dae || registro.dae?.codigo);

  // ── LÓGICA DE PAGAMENTO DIRETO ─────────────────────────────────
  const handlePagarTaxa = () => {
    // 1. Muda a situação para Gravada
    setSituacao("Gravada");

    // 2. Gera/vincula o DAE
    const novoDae = dae || (registro.dae?.codigo ? registro.dae : {
      codigo: `DAE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      valor: valorTotal,
      dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
    });
    setDae(novoDae as any);

    // 3. Atualiza o pagamento para confirmado e preenche a data
    setStatusPagamento("confirmado");
    const hoje = new Date().toLocaleDateString("pt-BR");
    setDataPagamento(hoje);
  };

  // Gravar Liberação dos Créditos
  const handleGravarLiberacao = () => {
    const hoje = new Date().toLocaleDateString("pt-BR");
    setDataLiberacao(hoje);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => onNavigate("registro-venda-gta-digital")}
              className="flex items-center gap-1 text-sm transition hover:opacity-70 font-semibold"
              style={{ color: GREEN }}
            >
              <ArrowLeft size={15} />
              Todos os Registros de Venda de GTA Digital
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Registro de Venda de GTA Digital</h1>

            <div className="flex items-center gap-2 flex-wrap">
              {/* DAE Relacionado — Posicionado ao lado do botão Gravar */}
              {temDaeRelacionado && (
                <button
                  type="button"
                  onClick={() => onNavigate("visualizar-dae", dae || registro.dae)}
                  className="px-5 h-10 border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/50 text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                >
                  <ScrollText size={15} /> DAE Relacionado
                </button>
              )}



              <button
                type="button"
                onClick={() => onNavigate("editar-registro-venda-gta-digital", registro)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                Editar
              </button>
            </div>
          </div>
        </div>

        {/* Alerta de Pagamento Pendente */}
        {isPendente && situacao !== "Cancelado" && (
          <div className="w-full bg-[#FFF9E6] border border-[#FFE0B2] rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="text-[#F57C00] flex-shrink-0 mt-0.5">
                <Info size={20} className="stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-gray-800">Pagamento Pendente</span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Efetue o pagamento das taxas associadas para concluir.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePagarTaxa}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F57C00] hover:bg-[#E65100] text-white rounded-lg text-xs font-bold transition self-start sm:self-center shrink-0 shadow-sm"
            >
              <CreditCard size={15} />
              Pagamento da Taxa
            </button>
          </div>
        )}

        {/* Alerta: Pagamento em Confirmação */}
        {isRealizado && (
          <div className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-5 shadow-sm flex items-start gap-3 mt-2">
            <div className="text-[#1D4ED8] flex-shrink-0 mt-0.5">
              <Clock size={20} className="stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-gray-800">Pagamento em Confirmação</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                O pagamento do DAE foi realizado e aguarda confirmação bancária.
              </p>
            </div>
          </div>
        )}

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">

            {/* Linha: Médico Veterinário, CPF e Botão de Olho */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-7 flex items-center gap-2">
                <div className="flex-1">
                  <EntidadeLeitura
                    label="Médico Veterinário"
                    value={registro.medico ? `${registro.medico.crmv || "CRMV-MG"} — ${registro.medico.nome}` : ""}
                    icon={
                      Icons.iconeProfissionalAnimalUrl ? (
                        <img
                          src={Icons.iconeProfissionalAnimalUrl}
                          alt="Profissional Animal"
                          className="w-5 h-5 object-contain"
                        />
                      ) : undefined
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <EntidadeLeitura
                  label="CPF"
                  value={registro.medico?.cpf || "123.456.789-12"}
                />
              </div>

              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate("visualizar-medico-veterinario", registro.medico)}
                  className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 mt-5"
                  title="Visualizar Médico Veterinário"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            {/* Escritório Seccional */}
            <div className="grid grid-cols-1 gap-4">
              <EntidadeLeitura
                label="Escritório Seccional"
                value={registro.escritorio ? registro.escritorio.nome : ""}
                icon={
                  Icons.iconeUnidadeAdministrativaUrl ? (
                    <img
                      src={Icons.iconeUnidadeAdministrativaUrl}
                      alt="Escritório Seccional"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
                onVer={() => onNavigate("visualizar-escritorio", registro.escritorio)}
              />
            </div>

            {/* Quantidades e Valores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FloatInput label="Quantidade Comprada" value={String(quantidadeComprada)} disabled onChange={() => { }} />
              <FloatInput label="Quantidade Utilizada" value={String(quantidadeUtilizada)} disabled onChange={() => { }} />
              <FloatInput label="Quantidade Disponível" value={String(quantidadeDisponivel)} disabled onChange={() => { }} />
              <FloatInput label="Valor Total" value={formatCurrency(valorTotal)} disabled onChange={() => { }} />
            </div>

            {/* Situação e Datas Condicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatInput label="Situação" value={situacao} disabled onChange={() => { }} />

              {mostrarDataPagamento && (
                <FloatInput
                  label="Data de Pagamento"
                  icon={<Calendar size={18} />}
                  value={dataPagamento || "—"}
                  disabled
                  onChange={() => { }}
                />
              )}

              {mostrarDataLiberacao && (
                <FloatInput
                  label="Data de Liberação dos Créditos"
                  icon={<Calendar size={18} />}
                  value={dataLiberacao || "Pendente de liberação"}
                  disabled
                  onChange={() => { }}
                />
              )}
            </div>

          </div>
        </Section>
      </main>
    </div>
  );
}

export default VisualizarRegistroVendaGTADigitalPage;