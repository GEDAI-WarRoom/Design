import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  RequiredFieldsNotice,
  VendaPropriedadeForm,
  vendaPropriedadeValida,
  type VendaPropriedadeFormValue,
} from "./VendaPropriedadeForm";
import { criarVendaPropriedade, type VendaPropriedade } from "./vendaPropriedadeData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const estadoInicial: VendaPropriedadeFormValue = {
  vendedor: null,
  estabelecimento: null,
  dataVenda: "",
  comprador: null,
  porteiraFechada: "",
  tipoTransferencia: "",
};

export function AdicionarVendaPropriedadePage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<VendaPropriedadeFormValue>(estadoInicial);
  const [erro, setErro] = useState("");
  const [registroSalvo, setRegistroSalvo] = useState<VendaPropriedade | null>(null);

  const adicionar = () => {
    if (!vendaPropriedadeValida(form)) {
      setErro("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    const registro = criarVendaPropriedade({
      vendedor: form.vendedor!,
      estabelecimento: form.estabelecimento!,
      dataVenda: form.dataVenda,
      comprador: form.comprador!,
      porteiraFechada: form.porteiraFechada!,
      tipoTransferencia: form.tipoTransferencia!,
    });

    setErro("");
    setRegistroSalvo(registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-propriedade" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("venda-propriedade")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Todas as Vendas de Propriedade
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Venda de Propriedade</h1>
            <button
              type="button"
              onClick={adicionar}
              className="px-5 h-10 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <VendaPropriedadeForm value={form} onChange={(valor) => { setForm(valor); setErro(""); }} />
        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Venda de propriedade cadastrada com sucesso!</h2>
            <p className="text-sm text-gray-500 mt-1">A transferência do estabelecimento {registroSalvo.estabelecimento.nome} foi registrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("venda-propriedade")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-venda-propriedade", registroSalvo)}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
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
