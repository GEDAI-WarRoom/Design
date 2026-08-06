import React, { useState, useEffect } from "react";
import { Eye, Pencil, Hash, ChevronUp, ChevronDown } from "lucide-react";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui-1/dialog";

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-bold text-gray-800">{title}</span>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-5 pt-2 border-t border-gray-100 flex flex-col gap-5">
          {children}
        </div>
      )}
    </div>
  );
}

// Interface atualizada para receber as props do pai
interface IndiceTabProps {
  valorIndiceId?: number | string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function IndiceTab({ valorIndiceId, isModalOpen, setIsModalOpen }: IndiceTabProps) {
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Estados do Modal
  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("Ativo");

  // Mock listagem
  const [itens, setItens] = useState([
    { id: "1", nome: "UFEMG", situacao: "Ativo" }
  ]);

  useEffect(() => {
    if (selectedItem && isModalOpen) {
      setNome(selectedItem.nome);
      setSituacao(selectedItem.situacao);
    } else if (!isModalOpen) {
      setNome("");
      setSituacao("Ativo");
      setSelectedItem(null);
      setModalMode("add");
    }
  }, [selectedItem, isModalOpen]);

  const isViewOnly = modalMode === "view";

  const handleSalvar = () => {
    if (!nome.trim()) setNome("UFEMG");
    if (!situacao) setSituacao("Ativo");
    // Logica da API aqui
    setIsModalOpen(false);
  };

  const modalTitle = 
    modalMode === "view" ? "Visualizar Índice" : 
    modalMode === "edit" ? "Editar Índice" : 
    "Adicionar Índice";
  
  const modalSubtitle = 
    modalMode === "view" ? "Detalhes do índice vinculado." :
    "Preencha os campos para adicionar um índice.";

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
      {/* Cabeçalho da Aba sem o botão */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-base font-semibold text-gray-800">Índices Vinculados</h2>
      </div>

      {/* Tabela de Listagem */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Índice</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Situação</th>
                <th className="text-right px-4 py-3 w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                  <td className="px-4 py-3 text-gray-700 font-medium">{t.nome}</td>
                  <td className="px-4 py-3 text-gray-700">{t.situacao}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => { setSelectedItem(t); setModalMode("edit"); setIsModalOpen(true); }} 
                        className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
                        title="Editar Detalhes"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => { setSelectedItem(t); setModalMode("view"); setIsModalOpen(true); }} 
                        className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" 
                        title="Visualizar Detalhes"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE ADIÇÃO / EDIÇÃO / VISUALIZAÇÃO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[1000px] px-[45px] py-[40px] bg-white rounded-[15px] border border-[#d6d6d6] shadow-xl overflow-y-auto max-h-[90vh]">
          
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-2 mb-2">
            <div className="flex items-center justify-center gap-2 text-[#1A7A3C]">
              <Hash size={24} />
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">{modalTitle}</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600 font-medium">
              {modalSubtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-[12px] w-full">
            <div className="h-[1px] w-full bg-[#D2D2D7]/60" />
          </div>

          <ModalSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <FloatInput
                label="Nome do Índice"
                required={!isViewOnly}
                value={nome}
                onChange={setNome}
                maxLength={255}
                disabled={isViewOnly}
              />
              <FloatSelect
                label="Situação"
                required={!isViewOnly}
                value={situacao}
                onChange={setSituacao}
                options={[ {value: "Ativo", label: "Ativo"}, {value: "Inativo", label: "Inativo"} ]}
                disabled={isViewOnly}
              />
            </div>
          </ModalSection>

          <div className="flex justify-center items-center gap-[12px] pb-[10px] pt-[30px] w-full">
            {isViewOnly ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition hover:bg-gray-50 bg-white"
                style={{ border: "1px solid #008446" }}
              >
                <span className="text-[15px] font-bold text-[#008446]">Voltar</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition hover:bg-gray-50 bg-white"
                  style={{ border: "1px solid #008446" }}
                >
                  <span className="text-[15px] font-bold text-[#008446]">Cancelar</span>
                </button>
                <button
                  type="button"
                  onClick={handleSalvar}
                  className="bg-[#008446] hover:bg-[#006b38] flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
                >
                  <span className="text-[15px] font-bold text-white">Salvar</span>
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
