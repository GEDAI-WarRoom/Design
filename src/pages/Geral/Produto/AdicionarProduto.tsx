import React, { useState, useEffect } from "react";
import { ArrowLeft, Info, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
// Importação correta dos componentes do FormKit
import { FloatInput, FloatSelect, CheckboxGroup } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const TIPOS_PRODUTO = [
  { value: "Animal", label: "Animal" },
  { value: "Vegetal", label: "Vegetal" }
];

const UNIDADES_MEDIDA_MOCK = [
  { value: "L", label: "Litro (L)", tipo: "Ambos" },
  { value: "KG", label: "Quilograma (KG)", tipo: "Ambos" },
  { value: "UN", label: "Unidade (UN)", tipo: "Ambos" },
  { value: "DZ", label: "Dúzia (DZ)", tipo: "Animal" },
  { value: "ARR", label: "Arroba (@)", tipo: "Animal" },
  { value: "SC", label: "Saca (SC)", tipo: "Vegetal" },
];

// Mapeamento das opções para o formato esperado pelo CheckboxGroup ({ id, label })
const AREAS_ATUACAO_OPCOES = ["Carne", "Leite", "Mel", "Ovos", "Pescado"].map(item => ({
  id: item,
  label: item
}));

const CLASSIFICACAO_PRODUTIVA_OPCOES = ["Matéria Prima", "Produto Final"].map(item => ({
  id: item,
  label: item
}));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-50">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function AdicionarProdutoPage({ onLogout, onNavigate }: any) {
  // --- Estados do Formulário ---
  const [nome, setNome] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [areasAtuacao, setAreasAtuacao] = useState<string[]>([]);
  const [classificacoes, setClassificacoes] = useState<string[]>([]);

  // --- Estados Auxiliares de UI ---
  const [unidadesFiltradas, setUnidadesFiltradas] = useState(UNIDADES_MEDIDA_MOCK);
  const [isSucesso, setIsSucesso] = useState(false);

  // Regra de Negócio: Pré-filtrar unidades de medida de acordo com o Tipo de Produto (US022)
  useEffect(() => {
    if (!tipoProduto) {
      setUnidadesFiltradas(UNIDADES_MEDIDA_MOCK);
      setUnidadeMedida("");
    } else {
      const filtradas = UNIDADES_MEDIDA_MOCK.filter(
        (u) => u.tipo === "Ambos" || u.tipo === tipoProduto
      );
      setUnidadesFiltradas(filtradas);
      
      if (!filtradas.some((u) => u.value === unidadeMedida)) {
        setUnidadeMedida("");
      }
    }

    if (tipoProduto !== "Animal") {
      setAreasAtuacao([]);
    }
  }, [tipoProduto]);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && tipoProduto && unidadeMedida && classificacoes.length > 0) {
      if (tipoProduto === "Animal" && areasAtuacao.length === 0) return;
      setIsSucesso(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="produto" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <button 
              type="button" 
              onClick={() => onNavigate("buscar-produto")} 
              className="flex items-center gap-1 text-sm mb-2 transition hover:opacity-70 font-semibold" 
              style={{ color: GREEN }}
            >
              <ArrowLeft size={15} />
              Todos Produtos
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Produto</h1>
          </div>
          
          <button 
            type="button" 
            onClick={handleSalvar}
            className="px-6 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm cursor-pointer"
          >
            Adicionar
          </button>
        </div>

        {/* Info Box Obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0"><Info size={18} className="stroke-[2.5]" /></div>
          <p className="text-xs text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        {/* Formulário Principal */}
        <form onSubmit={handleSalvar} className="flex flex-col gap-5">
          
          <Section title="Informações Básicas">
            <div className="flex flex-col gap-6">
              
              {/* Nome, Tipo do Produto e Unidade de Medida na mesma linha */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  {/* Nome do Produto ocupando metade da linha (6 colunas) */}
  <div className="md:col-span-6">
    <FloatInput 
      label="Nome do Produto" 
      required 
      value={nome} 
      onChange={setNome} 
      maxLength={255}
      placeholder="Ex: Cachaça"
    />
  </div>

  {/* Tipo do Produto ocupando 1/4 da linha (3 colunas) */}
  <div className="md:col-span-3">
    <FloatSelect 
      label="Tipo do Produto" 
      required 
      value={tipoProduto} 
      onChange={setTipoProduto} 
      options={TIPOS_PRODUTO}
    />
  </div>

  {/* Unidade de Medida ocupando 1/4 da linha (3 colunas) */}
  <div className="md:col-span-3">
    <FloatSelect 
      label="Unidade de Medida" 
      required 
      value={unidadeMedida} 
      onChange={setUnidadeMedida} 
      options={unidadesFiltradas.map(u => ({ value: u.value, label: u.label }))}
    />
  </div>
</div>

              {/* Condicional: Área de Atuação usando CheckboxGroup */}
              {/* Nota: Usamos a key={tipoProduto} para forçar o reset do estado interno do componente quando o tipo mudar */}
              {tipoProduto === "Animal" && (
                <div className="mt-2 pt-4 border-t border-gray-50">
                  <CheckboxGroup
                    key={tipoProduto}
                    title="Área de Atuação"
                    required
                    options={AREAS_ATUACAO_OPCOES}
                    defaultValue={areasAtuacao}
                    onChange={setAreasAtuacao}
                    orientation="horizontal"
                  />
                </div>
              )}

              {/* Classificação Produtiva usando CheckboxGroup */}
              <div className="mt-2 pt-4 border-t border-gray-50">
                <CheckboxGroup
                  title="Classificação Produtiva"
                  required
                  options={CLASSIFICACAO_PRODUTIVA_OPCOES}
                  defaultValue={classificacoes}
                  onChange={setClassificacoes}
                  orientation="horizontal"
                />
              </div>

            </div>
          </Section>
        </form>
      </main>

      {/* Modal de Confirmação de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Produto adicionado!</h3>
            <p className="text-sm text-gray-500 mt-1">O cadastro do produto "{nome}" foi realizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button 
                onClick={() => onNavigate("buscar-produto")} 
                className="px-5 h-11 rounded-md border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Voltar
              </button>
              <button 
                onClick={() => onNavigate("visualizar-produto", { nome, tipoProduto, unidadeMedida })} 
                className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold transition hover:bg-[#15612F]"
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