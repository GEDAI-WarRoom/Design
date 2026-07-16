import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RegistroVendaGTADigitalForm, type RegistroVendaGTAFormValue } from "./RegistroVendaGTADigitalForm";
import { atualizarSituacaoRegistroVendaGTA, obterRegistroVendaGTA, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

const paraFormulario = (registro: RegistroVendaGTADigital): RegistroVendaGTAFormValue => ({ medico: registro.medico, escritorio: registro.escritorio, quantidadeComprada: String(registro.quantidadeComprada), quantidadeUtilizada: registro.quantidadeUtilizada, situacao: registro.situacao });

export function EditarRegistroVendaGTADigitalPage({ onLogout, onNavigate, dados }: any) {
  const registro = (dados as RegistroVendaGTADigital | null) ?? obterRegistroVendaGTA(null);
  const [form, setForm] = useState<RegistroVendaGTAFormValue | null>(registro ? paraFormulario(registro) : null);
  if (!registro || !form) return null;

  const salvar = () => {
    const atualizado = atualizarSituacaoRegistroVendaGTA(registro.id, form.situacao);
    if (atualizado) onNavigate("visualizar-registro-venda-gta-digital", atualizado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button type="button" onClick={() => onNavigate("registro-venda-gta-digital")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Todos os Registros de Venda de GTA Digital</button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Registro de Venda de GTA Digital</h1>
            <button type="button" onClick={salvar} disabled={registro.situacao === "Cancelado"} className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] disabled:opacity-50 disabled:cursor-not-allowed">Salvar</button>
          </div>
        </div>
        {registro.situacao === "Cancelado" && <div className="bg-white rounded-lg p-4 text-sm text-gray-600 shadow-sm">Uma venda cancelada não pode ter sua situação alterada.</div>}
        <RegistroVendaGTADigitalForm value={form} onChange={setForm} mode="edit" />
      </main>
    </div>
  );
}
