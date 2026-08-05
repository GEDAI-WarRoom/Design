import React, { useState } from "react";
import { ArrowLeft, Info, Check, Eye, FileText, CreditCard, Clock, RotateCcw, Calendar, ScrollText, ScanBarcode } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";
const FATOR_VALOR_GTA = 5.50;

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



// Input de entidade em modo leitura, com botão "Visualizar"
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

// Dados base da simulação
const REGISTRO_BASE = {
  codigo: "GTA-VDA-2026-000148",
  situacao: "Vendido" as "Gravada" | "Reservado" | "Cancelado" | "Vendido",
  medico: { nome: "Dra. Helena Prado Vasconcelos", documento: "CRMV-MG 12.345", cpf: "123.456.789-12" },
  escritorio: { nome: "Escritório Seccional de Lavras", sigla: "SECLAV3820" },
  serie: "AB",
  numInicial: "004501",
  numFinal: "004600",
  dae: { codigo: "DAE-2026-778120" },
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

interface PageProps {
  dados?: any;
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export function VisualizarRegistroVendaGtaFisicaPage({
  dados,
  onLogout = () => { },
  onNavigate = (screen: string) => console.log("navigate:", screen),
}: PageProps = {}) {
  const r = {
    ...REGISTRO_BASE,
    ...(dados || {}),
    medico: {
      ...REGISTRO_BASE.medico,
      ...(dados?.medico || {}),
      nome: dados?.medicoNome || dados?.medico?.nome || REGISTRO_BASE.medico.nome,
      cpf: dados?.medicoCpf || dados?.medico?.cpf || REGISTRO_BASE.medico.cpf,
    },
    escritorio: {
      ...REGISTRO_BASE.escritorio,
      ...(dados?.escritorio || {}),
      nome: dados?.escritorioNome || dados?.escritorio?.nome || REGISTRO_BASE.escritorio.nome,
      sigla: dados?.escritorioCodigo || dados?.escritorio?.sigla || REGISTRO_BASE.escritorio.sigla,
    },
  };

  // ── ESTADOS DINÂMICOS PARA A DEMONSTRAÇÃO ───────────────────────
  // Sempre inicia como "pendente" ao entrar na página
  const [statusPagamento, setStatusPagamento] = useState<"pendente" | "realizado" | "confirmado">("pendente");
  const [dataPagamento, setDataPagamento] = useState<string>("");
  const [dataEntrega, setDataEntrega] = useState<string>("");

  const quantidade = (parseInt(r.numFinal, 10) - parseInt(r.numInicial, 10) + 1) || 0;
  const valor = quantidade * FATOR_VALOR_GTA;

  // ── Regras Dinâmicas ─────────────────────────────────────────────
  const isPendente = statusPagamento === "pendente";
  const isRealizado = statusPagamento === "realizado";
  const isConfirmado = statusPagamento === "confirmado";
  const pagamentoRealizado = isRealizado || isConfirmado;

  const mostrarDataPagamento = isConfirmado;
  const mostrarDataEntrega = pagamentoRealizado;
  const entregaRealizada = Boolean(dataEntrega);

  const podeGravar = mostrarDataEntrega && !entregaRealizada && r.situacao !== "Cancelado";
  const temDaeRelacionado = isConfirmado && Boolean(r.dae?.codigo);

  // ── Simulações de Ação ──────────────────────────────────────────
  const handlePagarTaxa = () => {
    // Transiciona para Confirmado e preenche a Data de Pagamento
    setStatusPagamento("confirmado");
    const hoje = new Date().toLocaleDateString("pt-BR");
    setDataPagamento(hoje);
  };

  const handleGravarEntrega = () => {
    // Simula a gravação da entrega
    const hoje = new Date().toLocaleDateString("pt-BR");
    setDataEntrega(hoje);
  };

  const handleResetDemo = () => {
    // Permite reiniciar a demonstração rapidamente
    setStatusPagamento("pendente");
    setDataPagamento("");
    setDataEntrega("");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-fisica" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => onNavigate("registro-venda-gta-fisica")}
              className="flex items-center gap-1 text-sm transition hover:opacity-70"
              style={{ color: GREEN }}
            >
              <ArrowLeft size={15} />
              Todos os Registros de Venda
            </button>


          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Visualizar Registro de Venda de GTA Física</h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* DAE Relacionado — quando o pagamento foi confirmado */}
              {temDaeRelacionado && (
                <button
                  type="button"
                  onClick={() => onNavigate("visualizar-dae", r.dae)}
                  className="px-5 h-10 border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/50 text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
                >
                  <ScanBarcode size={15} /> DAE Relacionado
                </button>
              )}


              <button
                type="button"
                onClick={() => onNavigate("editar-registro-venda-gta-fisica", r)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                Editar
              </button>
            </div>
          </div>


        </div>

        {/* Alerta: Pagamento Pendente */}
        {isPendente && r.situacao !== "Cancelado" && (
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
              <ScanBarcode size={15} />
              Associar DAE
            </button>
          </div>
        )}

        {/* Alerta: Pagamento realizado, aguardando confirmação */}
        {isRealizado && (
          <div className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-5 shadow-sm flex items-start gap-3 mt-2">
            <div className="text-[#1D4ED8] flex-shrink-0 mt-0.5">
              <Clock size={20} className="stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-gray-800">Pagamento em Confirmação</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                O pagamento foi realizado e aguarda confirmação. Após confirmado, a data de pagamento e o DAE relacionado ficarão disponíveis.
              </p>
            </div>
          </div>
        )}

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-center">
              {/* Médico Veterinário */}
              <div className="md:col-span-7 flex items-center gap-2">
                <div className="flex-1">
                  <EntidadeLeitura
                    label="Médico Veterinário"
                    value={r.medico ? `${r.medico.documento} — ${r.medico.nome}` : ""}
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

              {/* CPF */}
              <div className="md:col-span-5">
                <EntidadeLeitura
                  label="CPF"
                  value={r.medico.cpf}
                />
              </div>

              <button
                type="button"
                onClick={() => onNavigate("visualizar-medico-veterinario", r.medico)}
                className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition bg-white h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 mt-5"
                title="Visualizar Médico Veterinário"
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <EntidadeLeitura
                label="Escritório Seccional"
                value={r.escritorio ? r.escritorio.nome : ""}
                icon={
                  Icons.iconeUnidadeAdministrativaUrl ? (
                    <img
                      src={Icons.iconeUnidadeAdministrativaUrl}
                      alt="Escritório Seccional"
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
                onVer={() => onNavigate("visualizar-escritorio", r.escritorio)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatInput label="Série" value={r.serie} disabled onChange={() => { }} />
              <FloatInput label="Número do Formulário Inicial" value={r.numInicial} disabled onChange={() => { }} />
              <FloatInput label="Número do Formulário Final" value={r.numFinal} disabled onChange={() => { }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput label="Quantidade de Formulários" value={String(quantidade)} disabled onChange={() => { }} />
              <FloatInput label="Valor" value={formatCurrency(valor)} disabled onChange={() => { }} />
            </div>

            {/* Situação + Datas condicionais (regras de VISUALIZAÇÃO | EDIÇÃO) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatInput label="Situação" value={r.situacao} disabled onChange={() => { }} />

              {/* Data de Pagamento — após o pagamento ter sido confirmado */}
              {mostrarDataPagamento && (
                <FloatInput label="Data de Pagamento" icon={<Calendar size={18} />} value={dataPagamento || "—"} disabled onChange={() => { }} />
              )}

              {/* Data de Entrega dos Formulários — disponível após o pagamento ter sido realizado */}
              {mostrarDataEntrega && (
                <FloatInput
                  label="Data de Entrega dos Formulários"
                  icon={<Calendar size={18} />}
                  value={dataEntrega || "Pendente de entrega"}
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

export default VisualizarRegistroVendaGtaFisicaPage;
