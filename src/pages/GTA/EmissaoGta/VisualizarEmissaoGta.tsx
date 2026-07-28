import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Copy,
  DollarSign,
  Download,
  ReceiptText,
  TriangleAlert,
  X,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { EmissaoGtaForm } from "./EmissaoGtaForm";
import {
  copiarEmissaoGta,
  formatarDataGta,
  obterEmissaoGta,
  type EmissaoGta,
} from "./emissaoGtaData";

function ManagementMenuItem({
  icon,
  children,
  onClick,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[45px] w-full items-center gap-3 border-b border-white/45 px-6 py-3 text-left text-sm font-semibold text-white transition-colors last:border-b-0 hover:bg-[#15612F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
    >
      <span className="flex w-4 flex-shrink-0 items-center justify-center">
        {icon}
      </span>
      <span>{children}</span>
    </button>
  );
}

export function VisualizarEmissaoGtaPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: EmissaoGta | null;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const emissao = dados ?? obterEmissaoGta(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAberto) return;

    const fecharMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    };
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuAberto(false);
    };

    document.addEventListener("mousedown", fecharMenu);
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      document.removeEventListener("mousedown", fecharMenu);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  if (!emissao) return null;

  const downloadMock = (documento: string) => {
    window.alert(
      `${documento} de ${emissao.serieNumero} preparado para download no protótipo.`,
    );
  };

  const podeEmitir =
    emissao.situacao !== "Cancelada" &&
    emissao.situacao !== "Emitida" &&
    !emissao.necessitaPagamento;

  const executarAcao = (acao: () => void) => {
    setMenuAberto(false);
    acao();
  };

  const pagar = () => {
    if (emissao.situacao === "Gravada" && emissao.necessitaPagamento) {
      onNavigate("pagar-emissao-gta", emissao);
      return;
    }
    window.alert("Esta emissão não possui pagamento pendente.");
  };

  const emitir = () => {
    if (emissao.necessitaPagamento) {
      window.alert("Realize o pagamento da taxa antes de emitir a GTA.");
      return;
    }
    if (!podeEmitir) {
      window.alert(`Não é possível emitir uma GTA com situação ${emissao.situacao}.`);
      return;
    }
    onNavigate("emitir-emissao-gta", emissao);
  };

  const cancelar = () => {
    if (emissao.situacao === "Cancelada") {
      window.alert("Esta GTA já está cancelada.");
      return;
    }
    onNavigate("cancelar-emissao-gta", emissao);
  };

  const baixarGta = () => {
    if (emissao.situacao !== "Emitida") {
      window.alert("A GTA estará disponível para download após a emissão.");
      return;
    }
    downloadMock("GTA");
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="emissao-gta"
        hideSearch
      />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-7 md:px-6">
        <header className="border-b border-gray-200 pb-7">
          <button
            type="button"
            onClick={() => onNavigate("emissao-gta")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#1A7A3C] hover:text-[#15612F]"
          >
            <ArrowLeft size={14} />
            Todas Emissões de GTA
          </button>
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Emissão GTA
            </h1>

            <div ref={menuRef} className="relative flex-shrink-0">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuAberto}
                onClick={() => setMenuAberto((aberto) => !aberto)}
                className="flex h-11 items-center gap-4 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#15612F]"
              >
                Gerenciar GTA
                <ChevronDown
                  size={18}
                  className={`transition-transform ${menuAberto ? "rotate-180" : ""}`}
                />
              </button>

              {menuAberto && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+1px)] z-50 w-[276px] overflow-hidden rounded-md bg-[#078744] shadow-lg"
                >
                  <ManagementMenuItem
                    icon={<Copy size={15} />}
                    onClick={() =>
                      executarAcao(() =>
                        onNavigate(
                          "adicionar-emissao-gta",
                          copiarEmissaoGta(emissao),
                        ),
                      )
                    }
                  >
                    Copiar GTA
                  </ManagementMenuItem>
                  <ManagementMenuItem
                    icon={<DollarSign size={15} />}
                    onClick={() => executarAcao(pagar)}
                  >
                    Pagar
                  </ManagementMenuItem>
                  <ManagementMenuItem
                    icon={<ReceiptText size={15} />}
                    onClick={() =>
                      executarAcao(() => downloadMock("Boleto/DAE"))
                    }
                  >
                    Baixar Boleto/DAE
                  </ManagementMenuItem>
                  <ManagementMenuItem
                    icon={<ArrowRight size={16} />}
                    onClick={() => executarAcao(emitir)}
                  >
                    Emitir
                  </ManagementMenuItem>
                  <ManagementMenuItem
                    icon={<X size={16} />}
                    onClick={() => executarAcao(cancelar)}
                  >
                    Cancelar
                  </ManagementMenuItem>
                  <ManagementMenuItem
                    icon={<Download size={16} />}
                    onClick={() => executarAcao(baixarGta)}
                  >
                    Baixar GTA
                  </ManagementMenuItem>
                </div>
              )}
            </div>
          </div>
        </header>

        {emissao.situacao === "Gravada" && emissao.necessitaPagamento && (
          <section className="my-5 flex flex-col items-start justify-between gap-5 rounded-[24px] border border-gray-300 bg-white p-5 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[#FFF0D7] text-[#E88700]">
                <TriangleAlert size={21} />
              </span>
              <p className="text-sm text-gray-800">
                Atenção a emissão desse documento requer o pagamento da taxa de
                GTA.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("pagar-emissao-gta", emissao)}
              className="h-11 flex-shrink-0 rounded-md border border-[#1A7A3C] bg-white px-5 text-sm font-semibold text-[#1A7A3C] transition-colors hover:bg-green-50"
            >
              Realizar Pagamento
            </button>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-[#f3f3f3] px-5 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              Informações Básicas
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
            <FloatInput
              label="Série - Nº"
              value={emissao.serieNumero}
              disabled
              required
            />
            <FloatInput
              label="Data de Validade"
              value={formatarDataGta(emissao.dataValidade)}
              disabled
              required
              icon={<CalendarDays size={20} />}
              hasTooltip
              tooltipText="Data limite de validade da GTA."
            />
            <FloatInput
              label="Data da Emissão"
              value={formatarDataGta(emissao.dataEmissao)}
              disabled
              required
            />
            <FloatInput
              label="Situação"
              value={emissao.situacao}
              disabled
              required
            />
            <FloatInput
              label="Tipo de Formulário"
              value={emissao.tipoFormulario}
              disabled
              required
            />
            <FloatInput
              label="Espécie"
              value={emissao.especie?.nome ?? ""}
              disabled
              required
            />
            <div className="md:col-span-2">
              <FloatInput
                label="Finalidade de GTA"
                value={emissao.finalidade?.nome ?? ""}
                disabled
                required
              />
            </div>
          </div>
        </section>

        <EmissaoGtaForm
          value={emissao}
          mode="view"
          showBasicSection={false}
        />
      </main>
    </div>
  );
}
