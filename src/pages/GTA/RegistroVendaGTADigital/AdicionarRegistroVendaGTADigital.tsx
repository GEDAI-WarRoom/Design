import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RegistroVendaGTADigitalForm, RequiredFieldsNotice, type RegistroVendaGTAFormValue } from "./RegistroVendaGTADigitalForm";
import { FATOR_VALOR_GTA, criarRegistroVendaGTA, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

const estadoInicial: RegistroVendaGTAFormValue = { medico: null, escritorio: null, quantidadeComprada: "", quantidadeUtilizada: 0, situacao: "Gravada" };

export function AdicionarRegistroVendaGTADigitalPage({ onLogout, onNavigate }: any) {
  const [form, setForm] = useState(estadoInicial);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<RegistroVendaGTADigital | null>(null);
  const quantidade = Number(form.quantidadeComprada);
  const valido = !!form.medico && !!form.escritorio && quantidade > 0 && form.medico.gtaDisponiveis === 0;

  const salvar = () => {
    setTentouSalvar(true);
    if (!valido || !form.medico || !form.escritorio) return;
    setRegistroSalvo(criarRegistroVendaGTA({ medico: form.medico, escritorio: form.escritorio, quantidadeComprada: quantidade, valor: quantidade * FATOR_VALOR_GTA }));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button type="button" onClick={() => onNavigate("registro-venda-gta-digital")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"><ArrowLeft size={15} />Todos os Registros de Venda de GTA Digital</button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Registro de Venda de GTA Digital</h1>
            <button type="button" onClick={salvar} className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]">Adicionar</button>
          </div>
        </div>
        <RequiredFieldsNotice />
        <RegistroVendaGTADigitalForm value={form} onChange={setForm} errors={tentouSalvar ? { medico: !form.medico, escritorio: !form.escritorio, quantidade: quantidade <= 0 } : {}} />
        {tentouSalvar && !valido && !form.medico?.gtaDisponiveis && <p className="text-sm text-red-500 font-medium">Preencha os campos obrigatórios para continuar.</p>}
      </main>

      {registroSalvo && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900">Registro de venda de GTA digital cadastrado com sucesso!</h2>
          <p className="text-sm text-gray-500 mt-1">A venda para {registroSalvo.medico.nome} foi cadastrada.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button type="button" onClick={() => onNavigate("registro-venda-gta-digital")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button>
            <button type="button" onClick={() => onNavigate("", registroSalvo)} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
