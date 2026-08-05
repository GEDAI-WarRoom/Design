import { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  normalizarProduto,
  ProdutoCadastroForm,
  ProdutoCadastroValue,
} from "./ProdutoCadastroForm";

const GREEN = "#1A7A3C";

export function EditarProdutoPage({
  dados,
  onLogout,
  onNavigate,
}: {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [produto, setProduto] = useState<ProdutoCadastroValue>(() => normalizarProduto(dados));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="produto" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("produto")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Produtos
          </button>
          <div className="flex justify-between items-center gap-4 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Produto</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-3">
          <Info size={18} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
          <p className="text-xs text-gray-600 font-medium">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.
          </p>
        </div>

        <ProdutoCadastroForm value={produto} onChange={setProduto} />
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Alterações salvas!</h2>
            <p className="text-sm text-gray-500 mt-1">
              O produto &quot;{produto.nome}&quot; foi atualizado com sucesso.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("produto")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-produto", produto)}
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
