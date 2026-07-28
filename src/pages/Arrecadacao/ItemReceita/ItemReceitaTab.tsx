import React, { useState, useEffect } from "react";
import { Eye, Pencil, Ruler, Hash, X } from "lucide-react";
import { FloatInput, SimNao } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

// Mocks utilizados para os inputs do tipo Entidade
const UNIDADES_MEDIDA_ENTIDADE = [
  { id: 1, sigla: "un", nome: "Unidade", descricao: "Quantidade unitária" },
  { id: 2, sigla: "kg", nome: "Quilograma", descricao: "Massa em quilogramas" },
];

const INDICES_ENTIDADE = [
  { id: 1, codigo: "UFEMG", nome: "UFEMG", descricao: "Unidade Fiscal do Estado de Minas Gerais" },
  { id: 2, codigo: "UFM", nome: "UFM", descricao: "Unidade Fiscal Municipal" }
];

interface ItemReceitaTabProps {
  receitaId: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function ItemReceitaTab({ receitaId, isModalOpen, setIsModalOpen }: ItemReceitaTabProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");

  // Estados do formulário do Modal
  const [itemReceita, setItemReceita] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState<any>(null);
  const [indice, setIndice] = useState<any>(null);
  const [quantidadeIndice, setQuantidadeIndice] = useState("");
  const [contribuicaoFundo, setContribuicaoFundo] = useState<boolean | string>("Sim");

  // Mock da listagem
  const [itens, setItens] = useState([
    {
      id: 1,
      itemReceita: "Taxa de Expediente Geral",
      unidadeMedida: "Unidade",
      indice: "UFEMG",
      quantidadeIndice: "1,50",
      contribuicaoFundo: "Sim",
      situacao: "Ativo"
    }
  ]);

  // Efeito para popular o formulário caso clique em um item existente (Olhinho ou Lápis)
  useEffect(() => {
    if (selectedItem && isModalOpen) {
      setItemReceita(selectedItem.itemReceita);
      setUnidadeMedida({ nome: selectedItem.unidadeMedida });
      setIndice({ nome: selectedItem.indice });
      setQuantidadeIndice(selectedItem.quantidadeIndice);
      setContribuicaoFundo(selectedItem.contribuicaoFundo);
    } else if (!isModalOpen) {
      // Limpar formulário ao fechar e garantir que o próximo state inicie limpo
      setItemReceita("");
      setUnidadeMedida(null);
      setIndice(null);
      setQuantidadeIndice("");
      setContribuicaoFundo("Sim");
      setSelectedItem(null);
      setModalMode("add");
    }
  }, [selectedItem, isModalOpen]);

  const formularioValido = itemReceita && unidadeMedida && indice && quantidadeIndice && contribuicaoFundo;
  const isViewOnly = modalMode === "view";

  const handleSalvar = () => {
    if (!formularioValido) return;
    // Aqui vai a lógica de salvamento na API (Adição ou Edição)
    setIsModalOpen(false);
  };

  const modalTitle = 
    modalMode === "view" ? "Visualizar Item de Receita" : 
    modalMode === "edit" ? "Editar Item de Receita" : 
    "Adicionar Item de Receita";

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Cabeçalho da Listagem */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-base font-semibold text-gray-800">Itens de Receita Vinculados</h2>
      </div>

      {/* Tabela de Listagem */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Item de Receita</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Unidade de Medida</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Índice</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Qtde. do Índice</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Permite contribuição ao fundo privado?</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Situação</th>
                <th className="text-right px-4 py-3 w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">Nenhum item de receita cadastrado.</td>
                </tr>
              ) : (
                itens.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 text-gray-700 font-medium">{t.itemReceita}</td>
                    <td className="px-4 py-3 text-gray-700">{t.unidadeMedida}</td>
                    <td className="px-4 py-3 text-gray-700">{t.indice}</td>
                    <td className="px-4 py-3 text-gray-700">{t.quantidadeIndice}</td>
                    <td className="px-4 py-3 text-gray-700">{t.contribuicaoFundo}</td>
                    <td className="px-4 py-3 text-gray-700">{t.situacao}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => {
                            setSelectedItem(t);
                            setModalMode("edit");
                            setIsModalOpen(true);
                          }} 
                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
                          title="Editar Detalhes"
                        >
                          <Pencil size={20} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedItem(t);
                            setModalMode("view");
                            setIsModalOpen(true);
                          }} 
                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
                          title="Visualizar Detalhes"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INLINE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 flex flex-col relative">
            
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalTitle}
              </h2>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <FloatInput
                label="Item de Receita"
                required={!isViewOnly}
                value={itemReceita}
                onChange={setItemReceita}
                maxLength={255}
                disabled={isViewOnly}
              />

              {isViewOnly ? (
                <FloatInput
                  label="Unidade de Medida"
                  value={unidadeMedida?.nome || ""}
                  disabled={true}
                  onChange={() => {}}
                />
              ) : (
                <EntitySearchInput
                  label="Unidade de Medida"
                  placeholder="Buscar unidade de medida"
                  required={!isViewOnly}
                  value={unidadeMedida?.nome || ""}
                  data={UNIDADES_MEDIDA_ENTIDADE}
                  searchKeys={["nome", "sigla"]}
                  columns={[
                    { label: "Sigla", key: "sigla" },
                    { label: "Unidade de Medida", key: "nome" },
                  ]}
                  icon={<Ruler size={18} className="text-[#1A7A3C]" />}
                  title="Buscar Unidade de Medida"
                  subtitle="Busque por uma unidade de medida cadastrada:"
                  onChange={setUnidadeMedida}
                />
              )}

              {isViewOnly ? (
                <FloatInput
                  label="Índice"
                  value={indice?.nome || ""}
                  disabled={true}
                  onChange={() => {}}
                />
              ) : (
                <EntitySearchInput
                  label="Índice"
                  placeholder="Buscar índice"
                  required={!isViewOnly}
                  value={indice?.nome || ""}
                  data={INDICES_ENTIDADE}
                  searchKeys={["nome", "codigo"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Índice", key: "nome" },
                  ]}
                  icon={<Hash size={18} className="text-[#1A7A3C]" />}
                  title="Buscar Índice"
                  subtitle="Busque por um índice cadastrado:"
                  onChange={setIndice}
                />
              )}

              <FloatInput
                label="Quantidade do Índice"
                required={!isViewOnly}
                placeholder="0,00"
                value={quantidadeIndice}
                onChange={(v) => setQuantidadeIndice(v.replace(/[^0-9,]/g, ""))}
                disabled={isViewOnly}
              />

              <div className="md:col-span-2 pt-2">
                <SimNao
                  label="Permite contribuição ao fundo privado?"
                  name="contribuicaoFundo"
                  required={!isViewOnly}
                  value={contribuicaoFundo === "Sim" || contribuicaoFundo === true}
                  onChange={(v: boolean) => setContribuicaoFundo(v ? "Sim" : "Não")}
                  disabled={isViewOnly}
                />
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              {isViewOnly ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
                >
                  Voltar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvar}
                    disabled={!formularioValido}
                    className="px-6 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F] disabled:opacity-50 transition shadow-sm"
                  >
                    Salvar
                  </button>
                </>
              )}
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}