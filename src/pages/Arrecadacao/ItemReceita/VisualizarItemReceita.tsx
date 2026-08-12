import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput } from "../../../components/ui/FormKit";
import { obterItemReceita, type ItemReceitaVisual } from "./itemReceitaData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  data?: ItemReceitaVisual;
}

export function VisualizarItemReceitaPage({ onLogout, onNavigate, data }: PageProps) {
  const item = obterItemReceita(data?.id) ?? data ?? obterItemReceita(null);

  if (!item) return null;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="item-receita" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("item-receita")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Todos os Itens de Receita
          </button>

          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Item de Receita</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-item-receita", item)}
              className="h-10 px-5 bg-[#1A7A3C] text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-[#15612F] transition shadow-sm"
            >
              <Pencil size={16} /> Editar
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Código" value={item.codigo} disabled onChange={() => {}} />
            <FloatInput label="Item de Receita" value={item.descricao} disabled onChange={() => {}} />
            <FloatInput label="Unidade de Medida" value={item.unidadeMedida} disabled onChange={() => {}} />
            <FloatInput label="Receita" value={item.receita} disabled onChange={() => {}} />
            <FloatInput label="Índice" value={item.indice} disabled onChange={() => {}} />
            <FloatInput label="Quantidade do Índice" value={item.quantidadeIndiceFormatada} disabled onChange={() => {}} />
            <FloatInput label="Possui Contribuição ao Fundo?" value={item.contribuicaoFundo} disabled onChange={() => {}} />
            {item.permiteContribuicaoFundo && (
              <>
                <FloatInput label="Fundo de Arrecadação" value={item.fundoArrecadacao} disabled onChange={() => {}} />
                <FloatInput label="Convênio" value={item.convenio} disabled onChange={() => {}} />
                <FloatInput
                  label="Quantidade do Índice destinada ao Fundo Privado"
                  value={item.quantidadeIndiceFundoPrivadoFormatada}
                  disabled
                  onChange={() => {}}
                  className="md:col-span-2"
                />
              </>
            )}
            <FloatInput label="Situação" value={item.situacao} disabled onChange={() => {}} />
          </div>
        </section>
      </main>
    </div>
  );
}
