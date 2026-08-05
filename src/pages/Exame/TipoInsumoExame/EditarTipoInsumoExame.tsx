import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  atualizarTipoInsumoExame,
  obterTipoInsumoExame,
  type TipoInsumoExame,
} from "./tipoInsumoExameData";
import { RequiredFieldsNotice, TipoInsumoExameForm, type TipoInsumoExameFormValue } from "./TipoInsumoExameForm";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: TipoInsumoExame | null;
}

const toFormValue = (dados: TipoInsumoExame | null): TipoInsumoExameFormValue => ({
  nome: dados?.nome ?? "",
  doencas: dados?.doencas ?? [],
  situacao: dados?.situacao ?? "Ativo",
});

export function EditarTipoInsumoExamePage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInicial = dados ?? obterTipoInsumoExame(null);
  const [form, setForm] = useState<TipoInsumoExameFormValue>(toFormValue(registroInicial));
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const formValido = form.nome.trim() !== "";

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido || !registroInicial) return;

    atualizarTipoInsumoExame(registroInicial.id, {
      nome: form.nome.trim(),
      doencas: form.doencas,
      situacao: form.situacao,
    });

    onNavigate("tipo-insumo-exame");
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Editar Tipo de Insumo de Exame</h1>
            <button
              type="button"
              onClick={handleSalvar}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Salvar
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
    </div>
  );
}
