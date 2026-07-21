import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  RequiredFieldsNotice,
  StatusAnimalForm,
  statusAnimalValido,
  type StatusAnimalFormValue,
} from "./StatusAnimalForm";
import {
  atualizarStatusAnimal,
  obterStatusAnimal,
  type StatusAnimal,
} from "./statusAnimalData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: StatusAnimal | null;
}

export function EditarStatusAnimalPage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInicial = dados ?? obterStatusAnimal(null);
  const [value, setValue] = useState<StatusAnimalFormValue>({
    nome: registroInicial?.nome ?? "",
    situacao: registroInicial?.situacao ?? "Ativo",
    substatus: registroInicial?.substatus ?? [],
  });
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<StatusAnimal | null>(null);
  const valido = statusAnimalValido(value);

  const salvar = () => {
    setTentouSalvar(true);
    if (!valido || !registroInicial) return;

    setRegistroSalvo(
      atualizarStatusAnimal({
        id: registroInicial.id,
        ...value,
        nome: value.nome.trim(),
        substatus: value.substatus.map((item) => ({
          ...item,
          nome: item.nome.trim(),
          observacaoImpressaoGta: item.observacaoImpressaoGta.trim(),
        })),
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="status-animal"
        hideSearch
      />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-status-animal", registroInicial)}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Visualizar Status Animal
          </button>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Status Animal</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Salvar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <StatusAnimalForm value={value} onChange={setValue} />

        {tentouSalvar && !valido && (
          <p className="text-sm text-red-500 font-medium">
            Preencha todos os campos obrigatórios para continuar.
          </p>
        )}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Status Animal atualizado com sucesso!
            </h2>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("status-animal")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-status-animal", registroSalvo)}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold"
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

