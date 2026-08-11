import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { ReceitaForm, RequiredFieldsNotice } from "./ReceitaForm";
import { adicionarReceita, Receita } from "./receitaData";

const empty: Pick<
  Receita,
  "codigo" | "descricao" | "classificacao" | "situacao"
> = { codigo: "", descricao: "", classificacao: "", situacao: "Ativo" };

export function AdicionarReceitaPage({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}) {
  const [receita, setReceita] = useState(empty);
  const [savedReceita, setSavedReceita] = useState<Receita | null>(null);
  const salvar = () =>
    setSavedReceita(
      adicionarReceita({
        codigo: receita.codigo || "1004",
        descricao:
          receita.descricao || "Taxa de serviços de defesa agropecuária",
        classificacao: receita.classificacao || "11226009",
        situacao: receita.situacao || "Ativo",
      }),
    );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="receita"
        hideSearch
      />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("receita")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Todas as Receitas
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Receita
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Adicionar
            </button>
          </div>
        </div>
        <RequiredFieldsNotice />
        <ReceitaForm value={receita} onChange={setReceita} />{" "}
      </main>
      {savedReceita && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h2 className="text-lg font-bold text-gray-900">
              Receita adicionada com sucesso!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {savedReceita.descricao} foi adicionada como nova Receita.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("receita")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-receita", savedReceita)}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold"
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
