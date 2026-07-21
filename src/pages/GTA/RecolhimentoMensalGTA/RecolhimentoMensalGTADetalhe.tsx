import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, FileText, Info, Pencil, ReceiptText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton, FloatInput } from "../../../components/ui/FormKit";
import {
  MESES,
  emitirDAE,
  formatarData,
  formatarMoeda,
  obterRecolhimento,
  valorTotalRecolhimento,
  type RecolhimentoMensalGTA,
} from "./recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: RecolhimentoMensalGTA | null;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [aberta, setAberta] = useState(true);
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <button type="button" onClick={() => setAberta((valor) => !valor)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {aberta ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {aberta && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}
    </section>
  );
}

function DetalhePage({ onLogout, onNavigate, dados, mode }: Props & { mode: "view" | "edit" }) {
  const inicial = dados ?? obterRecolhimento(null);
  const [registro, setRegistro] = useState<RecolhimentoMensalGTA | null>(inicial);
  if (!registro) return null;

  const temBoletos = registro.boletos.length > 0;
  const voltar = () => mode === "edit"
    ? onNavigate("visualizar-recolhimento-mensal-gta", registro)
    : onNavigate("recolhimento-mensal-gta");

  const emitir = () => {
    const atualizado = emitirDAE(registro.id);
    if (atualizado) setRegistro(atualizado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={voltar} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> {mode === "edit" ? "Visualizar Recolhimento Mensal de GTAs" : "Todos os Recolhimentos Mensais de GTAs"}
          </button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{mode === "view" ? "Visualizar" : "Editar"} Recolhimento Mensal de GTAs</h1>
            </div>
            {mode === "view" && (
              <button type="button" onClick={() => onNavigate("editar-recolhimento-mensal-gta", registro)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">
                Editar
              </button>
            )}
          </div>
        </div>

        {mode === "edit" && (
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 text-sm text-gray-600 shadow-sm">
            <Info size={20} className="flex-shrink-0 text-gray-500" />
            Os dados deste recolhimento são somente leitura, conforme as regras da história de usuário.
          </div>
        )}

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FloatInput label="Contribuinte" required value={registro.contribuinte.nome} disabled />
            <FloatInput label="CPF/CNPJ" required value={registro.contribuinte.documento} disabled />
            <FloatInput label="Ano para referência" required value={String(registro.anoReferencia)} disabled />
            <FloatInput label="Mês para referência" required value={MESES[registro.mesReferencia - 1]} disabled />
            {temBoletos && (
              <>
                <FloatInput label="Situação" required value={registro.situacao} disabled />
                <FloatInput label="Data do vencimento" required value={formatarData(registro.dataVencimento)} disabled />
                <FloatInput label="Valor total" required value={formatarMoeda(valorTotalRecolhimento(registro))} disabled />
              </>
            )}
          </div>
        </Section>

        {temBoletos ? (
          <Section title={`Boletos (${registro.boletos.length})`}>
            <div className="flex flex-col gap-5">
              {registro.boletos.map((boleto, indice) => (
                <article key={boleto.id} className="rounded-lg border border-gray-200 bg-gray-50/30 p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-gray-800">Boleto {indice + 1}</h3>
                    <button type="button" onClick={() => onNavigate("visualizar-boleto-recolhimento-gta", { registro, boleto })} className="flex items-center gap-2 rounded-md border border-[#1A7A3C] bg-white px-4 py-2 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40">
                      <Eye size={16} /> Ver boleto
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FloatInput label="Fundo de arrecadação" required value={boleto.fundoArrecadacao} disabled />
                    <FloatInput label="Convênio" required value={boleto.convenio} disabled />
                    <FloatInput label="Número do boleto" required value={boleto.numero} disabled />
                    <FloatInput label="Valor do boleto" required value={formatarMoeda(boleto.valor)} disabled />
                    <FloatInput label="Situação do pagamento" required value={boleto.situacaoPagamento} disabled />
                  </div>

                  <div className="mt-5 overflow-x-auto">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">GTAs pertencentes ao boleto</h4>
                    <table className="w-full min-w-[980px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {["Número", "Data da emissão", "Finalidade", "Situação", "Espécie", "Total de animais", "Valor de contribuição ao fundo"].map((titulo) => (
                            <th key={titulo} className="whitespace-nowrap px-3 py-3 text-left font-semibold uppercase text-gray-600">{titulo}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {boleto.gtas.map((gta) => (
                          <tr key={gta.numero} className="border-b border-gray-100">
                            <td className="whitespace-nowrap px-3 py-3 text-gray-500">{gta.numero}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarData(gta.dataEmissao)}</td>
                            <td className="px-3 py-3 text-gray-500">{gta.finalidade}</td>
                            <td className="px-3 py-3 text-gray-500">{gta.situacao}</td>
                            <td className="px-3 py-3 text-gray-500">{gta.especie}</td>
                            <td className="px-3 py-3 text-gray-500">{gta.totalAnimais}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarMoeda(gta.valorContribuicao)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        ) : (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">
            O contribuinte não possui boletos emitidos ou recebidos no mês e ano de referência selecionados.
          </div>
        )}

        {temBoletos && (
          <div className="flex justify-end">
            {registro.daeEmitido ? (
              <CustomButton icon={<FileText size={18} />} onClick={() => onNavigate("visualizar-dae-recolhimento-gta", { registro })}>Ver DAE</CustomButton>
            ) : (
              <CustomButton icon={<FileText size={18} />} onClick={emitir}>Emitir DAE</CustomButton>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export function VisualizarRecolhimentoMensalGTAPage(props: Props) {
  return <DetalhePage {...props} mode="view" />;
}

export function EditarRecolhimentoMensalGTAPage(props: Props) {
  return <DetalhePage {...props} mode="edit" />;
}
