import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  criarTipoInsumoExame,
  type TipoInsumoExame,
} from "./tipoInsumoExameData";
import { RequiredFieldsNotice, TipoInsumoExameForm, type TipoInsumoExameFormValue } from "./TipoInsumoExameForm";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const criarEstadoInicial = (): TipoInsumoExameFormValue => ({
  nome: "",
  doencas: [],
  situacao: "Ativo",
});

export function AdicionarTipoInsumoExamePage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<TipoInsumoExameFormValue>(criarEstadoInicial());
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<TipoInsumoExame | null>(null);

  const formValido = form.nome.trim() !== "";

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;

    const novo: Omit<TipoInsumoExame, "id"> = {
      nome: form.nome.trim(),
      doencas: form.doencas,
      situacao: "Ativo",
    };

    const criado = criarTipoInsumoExame(novo);
    setRegistroSalvo(criado);
  };

  const voltarParaLista = () => onNavigate("tipo-insumo-exame");

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-insumo-exame" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("tipo-insumo-exame")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os Tipos de Insumo de Exame
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Tipo de Insumo de Exame</h1>
            <button
              type="button"
              onClick={handleSalvar}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        <TipoInsumoExameForm
          value={form}
          onChange={setForm}
        />

        {tentouSalvar && !formValido && (
          <p className="text-sm text-red-500 font-medium">Preencha o nome do tipo de insumo para continuar.</p>
        )}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
           
            <h3 className="text-lg font-bold text-gray-900">Tipo de insumo de exame cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O tipo de insumo de <span className="font-medium text-gray-700">{registroSalvo.nome}</span> foi cadastrado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("tipo-insumo-exame");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("visualizar-tipo-insumo-exame", registroSalvo);
                }}
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
