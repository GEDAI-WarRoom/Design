import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { formatarMoeda, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

export function VisualizarDAERegistroVendaGTAPage({ onLogout, onNavigate, dados }: any) {
  const registro = dados?.registro as RegistroVendaGTADigital | undefined;
  const gerado = Boolean(dados?.gerado);
  if (!registro) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />
      <main className="max-w-[1000px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <button type="button" onClick={() => onNavigate("visualizar-registro-venda-gta-digital", registro)} className="flex items-center gap-1 text-sm font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Voltar ao Registro de Venda</button>
        <div className="flex items-center gap-3"><FileText size={28} className="text-[#1A7A3C]" /><h1 className="text-2xl font-semibold text-gray-900">Visualizar DAE</h1></div>
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Situação do DAE" value={gerado ? "Gerado" : "Não gerado"} disabled />
            <FloatInput label="Valor" value={formatarMoeda(registro.valor)} disabled />
            <FloatInput label="Médico Veterinário" value={registro.medico.nome} disabled />
            <FloatInput label="CPF" value={registro.medico.cpf} disabled />
          </div>
          {!gerado && <p className="text-sm text-gray-500 mt-5">O DAE para pagamento ainda não foi gerado.</p>}
        </section>
      </main>
    </div>
  );
}
