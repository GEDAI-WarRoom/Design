import React, { useState, useEffect } from "react";
import { Eye, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { FloatInput } from "../../../components/ui/FormKit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui-1/dialog";
import * as Icons from "../../../imports/icons";

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

// Interface para receber as props do componente pai
interface ValorIndiceTabProps {
  indiceNome?: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modoVisualizacao?: boolean;
}

export function ValorIndiceTab({
  indiceNome,
  isModalOpen,
  setIsModalOpen,
  modoVisualizacao = false,
}: ValorIndiceTabProps) {
  // Estado local para controlar o modo de visualização diretamente pelas ações da tabela
  const [isSomenteLeitura, setIsSomenteLeitura] = useState(modoVisualizacao);

  // Sincroniza quando a prop do pai mudar
  useEffect(() => {
    setIsSomenteLeitura(modoVisualizacao);
  }, [modoVisualizacao]);

  // Dados de exemplo para preencher a tabela
  const [valores, setValores] = useState([
    { id: 1, indice: "UFEMG", ano: "2024", valor: "5,2797", situacao: "Ativo" },
    { id: 2, indice: "UFEMG", ano: "2023", valor: "5,1656", situacao: "Ativo" },
    { id: 3, indice: "UFEMG", ano: "2022", valor: "4,7703", situacao: "Inativo" },
  ]);

  // Estados dos campos do formulário no modal (Apenas Valor e Ano)
  const [valor, setValor] = useState("");
  const [ano, setAno] = useState("");
  const [itemEdicao, setItemEdicao] = useState<any>(null);

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!isModalOpen) {
      setItemEdicao(null);
      setValor("");
      setAno("");
      setIsSomenteLeitura(false);
    }
  }, [isModalOpen]);

  const isEdicao = !!itemEdicao;

  // Handler para abrir em modo de visualização (Ícone do Olho)
  const handleVisualizar = (item: any) => {
    setItemEdicao(item);
    setValor(item.valor);
    setAno(item.ano);
    setIsSomenteLeitura(true);
    setIsModalOpen(true);
  };

  // Handler para abrir em modo de edição (Ícone do Lápis)
  const handleEditar = (item: any) => {
    setItemEdicao(item);
    setValor(item.valor);
    setAno(item.ano);
    setIsSomenteLeitura(false);
    setIsModalOpen(true);
  };

  // Handler para salvar/adicionar valor
  const handleSalvar = () => {
    if (isEdicao) {
      setValores((prev) =>
        prev.map((v) =>
          v.id === itemEdicao.id ? { ...v, valor, ano } : v
        )
      );
    } else {
      const novoItem = {
        id: Date.now(),
        indice: indiceNome || "Índice",
        ano,
        valor,
        situacao: "Ativo",
      };
      setValores((prev) => [novoItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Validação do formulário
  const formularioValido = valor.trim() !== "" && ano.trim() !== "";

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Tabela de Valores do Índice */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Valores do Índice
            </h2>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Índice</th>
                <th className="px-6 py-3.5">Ano</th>
                <th className="px-6 py-3.5">Valor</th>
                <th className="px-6 py-3.5">Situação</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {valores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Nenhum valor cadastrado para este índice.
                  </td>
                </tr>
              ) : (
                valores.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-gray-600">
                      {indiceNome || item.indice}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {item.ano}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      R$ {item.valor}
                    </td>
                    <td className="px-6 py-3 text-gray-600">

                      {item.situacao}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleVisualizar(item)}
                          className="p-1.5 text-[#1A7A3C] hover:bg-gray-100 rounded-lg transition"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditar(item)}
                          className="p-1.5 text-[#1A7A3C] hover:bg-green-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal / Dialog para Adicionar, Editar e Visualizar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-4xl w-full bg-white p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Cabeçalho centralizado com ícone */}
          <DialogHeader className="relative flex flex-col items-center text-center border-b border-gray-100 pb-4">


            {/* Título com ícone na frente */}
            <div className="flex items-center justify-center gap-2">
              <img
                src={Icons.iconeIndiceUrl}
                alt="Ícone do Índice"
                className="w-6 h-6 object-contain"
              />
              <DialogTitle className="text-lg font-bold text-gray-900">
                {isSomenteLeitura
                  ? "Visualizar Valor por Índice"
                  : isEdicao
                    ? "Editar Valor por Índice"
                    : "Adicionar Valor por Índice"}
              </DialogTitle>
            </div>

            <DialogDescription className="text-xs text-gray-500 mt-1 text-center">
              {isSomenteLeitura
                ? "Confira os detalhes do valor por índice."
                : "Preencha as informações abaixo para salvar o valor por índice."}
            </DialogDescription>
          </DialogHeader>

          {/* Seção retrátil do Modal */}
          <ModalSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {/* Campo de Valor */}
              <FloatInput
                label="Valor"
                required
                disabled={isSomenteLeitura}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />

              {/* Campo de Ano */}
              <FloatInput
                label="Ano"
                type="number"
                required
                disabled={isSomenteLeitura}
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
          </ModalSection>

          {/* Rodapé do Modal com Botões Centralizados */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-100">
            {isSomenteLeitura ? (
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
                  disabled={!formularioValido}
                  className="bg-[#008446] hover:bg-[#006b38] disabled:opacity-50 disabled:cursor-not-allowed flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
                >
                  <span className="text-[15px] font-bold text-white">Salvar</span>
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}