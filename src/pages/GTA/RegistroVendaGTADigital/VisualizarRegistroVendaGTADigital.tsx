import { useState } from "react";
import { ArrowLeft, CreditCard, FileText, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import { RegistroVendaGTADigitalForm, type RegistroVendaGTAFormValue } from "./RegistroVendaGTADigitalForm";
import { obterRegistroVendaGTA, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

const paraFormulario = (registro: RegistroVendaGTADigital): RegistroVendaGTAFormValue => ({
  medico: registro.medico,
  escritorio: registro.escritorio,
  quantidadeComprada: String(registro.quantidadeComprada),
  quantidadeUtilizada: registro.quantidadeUtilizada,
  situacao: registro.situacao,
});

export function VisualizarRegistroVendaGTADigitalPage({ onLogout, onNavigate, dados }: any) {
  const registro = (dados as RegistroVendaGTADigital | null) ?? obterRegistroVendaGTA(null);
  const [form] = useState(registro ? paraFormulario(registro) : null);
  if (!registro || !form) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button type="button" onClick={() => onNavigate("registro-venda-gta-digital")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Todos os Registros de Venda de GTA Digital</button>
          <h1 className="text-2xl font-semibold text-gray-900">Visualizar Registro de Venda de GTA Digital</h1>
        </div>
        <RegistroVendaGTADigitalForm value={form} onChange={() => { }} mode="view" />

      </main>
    </div>
  );
}
