import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RegistroVendaGTADigitalForm, RequiredFieldsNotice, type RegistroVendaGTAFormValue } from "./RegistroVendaGTADigitalForm";
import { ESCRITORIOS_SECCIONAIS, FATOR_VALOR_GTA, MEDICOS_VETERINARIOS_GTA, criarRegistroVendaGTA, type RegistroVendaGTADigital } from "./registroVendaGTADigitalData";

const estadoInicial: RegistroVendaGTAFormValue = { medico: null, escritorio: null, quantidadeComprada: "", quantidadeUtilizada: 0, situacao: "Gravada" };

// ... imports

export function AdicionarRegistroVendaGTADigitalPage({ onLogout, onNavigate }: any) {
  const [form, setForm] = useState(estadoInicial);
  const [registroSalvo, setRegistroSalvo] = useState<RegistroVendaGTADigital | null>(null);

  const quantidade = Number(form.quantidadeComprada);

  const salvar = () => {
    const medico = form.medico || MEDICOS_VETERINARIOS_GTA[0];
    const escritorio = form.escritorio || ESCRITORIOS_SECCIONAIS[0];
    const quantidadeFinal = quantidade > 0 ? quantidade : 50;

    // Cria o registro e define no estado, o que fará o modal aparecer
    const novoRegistro = criarRegistroVendaGTA({
      medico,
      escritorio,
      quantidadeComprada: quantidadeFinal,
      valor: quantidadeFinal * FATOR_VALOR_GTA
    });

    setRegistroSalvo(novoRegistro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="registro-venda-gta-digital" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button type="button" onClick={() => onNavigate("registro-venda-gta-digital")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Todos os Registros de Venda de GTA Digital
          </button>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Registro de Venda de GTA Digital</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-11 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        <RegistroVendaGTADigitalForm
          value={form}
          onChange={setForm}
        />
      </main>

      {/* MODAL DE SUCESSO REESTILIZADO */}
      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">


            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Registro de venda de GTA digital cadastrado com sucesso
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              O registro de venda para <span className="font-semibold text-gray-700">{registroSalvo.medico.nome}</span> foi cadastrado com sucesso.
            </p>

            <div className="flex gap-3 justify-center mt-8">
              <button
                type="button"
                onClick={() => onNavigate("registro-venda-gta-digital")}
                className="flex-1 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-registro-venda-gta-digital", registroSalvo)}
                className="flex-1 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F] transition"
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
