import {
  ChevronDown,
  ChevronUp,
  Eye,
  LineChart,
  ListTree,
  Pencil,
  Ruler,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui-1/dialog";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, SimNao } from "../../../components/ui/FormKit";
import { listarUnidadesMedida } from "../../Geral/UnidadeMedida/unidadeMedidaData";
import {
  FUNDOS_ARRECADACAO_MOCK,
  type Convenio,
  type FundoArrecadacao,
} from "../FundoArrecadacao/fundoArrecadacaoData";
import { listarIndices } from "../Indice/indiceIndice";
import { ContribuicaoFundoFields } from "./ContribuicaoFundoFields";
import {
  listarItensReceita,
  salvarItemReceita,
  type ItemReceitaVisual,
} from "./itemReceitaData";

interface ItemReceitaTabProps {
  receitaId: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

// Subcomponente local para criar o "Card" colapsável dentro do modal (Informações Básicas)
function ModalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-bold text-gray-800">{title}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-5 pt-2 border-t border-gray-100 flex flex-col gap-5">
          {children}
        </div>
      )}
    </div>
  );
}

export function ItemReceitaTab({
  receitaId,
  isModalOpen,
  setIsModalOpen,
}: ItemReceitaTabProps) {
  const [selectedItem, setSelectedItem] = useState<ItemReceitaVisual | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");

  // Estados do formulário do Modal
  const [itemReceita, setItemReceita] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState<any>(null);
  const [indice, setIndice] = useState<any>(null);
  const [quantidadeIndice, setQuantidadeIndice] = useState("");
  const [contribuicaoFundo, setContribuicaoFundo] = useState<boolean | string>(
    "Sim",
  );
  const [fundoArrecadacao, setFundoArrecadacao] =
    useState<FundoArrecadacao | null>(null);
  const [convenio, setConvenio] = useState<Convenio | null>(null);
  const [quantidadeIndiceFundo, setQuantidadeIndiceFundo] = useState("");
  const [erroContribuicaoFundo, setErroContribuicaoFundo] = useState(false);

  const itens = listarItensReceita().filter(
    (item) => item.receitaId === receitaId,
  );

  // Efeito para popular o formulário caso clique em um item existente (Olhinho ou Lápis)
  useEffect(() => {
    if (selectedItem && isModalOpen) {
      setItemReceita(selectedItem.itemReceita);
      setUnidadeMedida(
        listarUnidadesMedida().find(
          (item) => item.id === selectedItem.unidadeMedidaId,
        ) ?? null,
      );
      setIndice(
        listarIndices().find((item) => item.id === selectedItem.indiceId) ??
          null,
      );
      setQuantidadeIndice(
        String(selectedItem.quantidadeIndice).replace(".", ","),
      );
      setContribuicaoFundo(selectedItem.contribuicaoFundo);
      const fundo =
        FUNDOS_ARRECADACAO_MOCK.find(
          (item) => item.id === selectedItem.fundoArrecadacaoId,
        ) ?? null;
      setFundoArrecadacao(fundo);
      setConvenio(
        fundo?.convenios.find((item) => item.id === selectedItem.convenioId) ??
          null,
      );
      setQuantidadeIndiceFundo(
        selectedItem.quantidadeIndiceFundoPrivado != null
          ? String(selectedItem.quantidadeIndiceFundoPrivado).replace(".", ",")
          : "",
      );
    } else if (!isModalOpen) {
      // Limpar formulário ao fechar e garantir que o próximo state inicie limpo
      setItemReceita("");
      setUnidadeMedida(null);
      setIndice(null);
      setQuantidadeIndice("");
      setContribuicaoFundo("Sim");
      setFundoArrecadacao(null);
      setConvenio(null);
      setQuantidadeIndiceFundo("");
      setErroContribuicaoFundo(false);
      setSelectedItem(null);
      setModalMode("add");
    }
  }, [selectedItem, isModalOpen]);

  const isViewOnly = modalMode === "view";

  const handleSalvar = () => {
    const contribuiFundo =
      contribuicaoFundo === "Sim" || contribuicaoFundo === true;
    const quantidadeFundo = Number(quantidadeIndiceFundo.replace(",", "."));
    if (
      contribuiFundo &&
      (!fundoArrecadacao || !convenio || !(quantidadeFundo > 0))
    ) {
      setErroContribuicaoFundo(true);
      return;
    }

    const unidadeSelecionada =
      unidadeMedida ??
      listarUnidadesMedida().find((item) => item.situacao === "Ativo");
    const indiceSelecionado =
      indice ?? listarIndices().find((item) => item.situacao === "Ativo");
    if (!unidadeSelecionada || !indiceSelecionado) return;

    salvarItemReceita({
      id: selectedItem?.id,
      codigo: selectedItem?.codigo,
      descricao: itemReceita.trim() || "Taxa de Expediente Geral",
      unidadeMedidaId: unidadeSelecionada.id,
      receitaId,
      indiceId: indiceSelecionado.id,
      quantidadeIndice: Number((quantidadeIndice || "1,50").replace(",", ".")),
      permiteContribuicaoFundo: contribuiFundo,
      fundoArrecadacaoId: contribuiFundo
        ? (fundoArrecadacao?.id ?? null)
        : null,
      convenioId: contribuiFundo ? (convenio?.id ?? null) : null,
      quantidadeIndiceFundoPrivado: contribuiFundo ? quantidadeFundo : null,
      situacao: selectedItem?.situacao ?? "Ativo",
    });
    setIsModalOpen(false);
  };

  const modalTitle =
    modalMode === "view"
      ? "Visualizar Item de Receita"
      : modalMode === "edit"
        ? "Editar Item de Receita"
        : "Adicionar Item de Receita";

  const modalSubtitle =
    modalMode === "view"
      ? "Detalhes do item de receita vinculado."
      : "Preencha os campos para adicionar um item.";

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho da Listagem */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-base font-semibold text-gray-800">
          Itens de Receita Vinculados
        </h2>
      </div>

      {/* Tabela de Listagem */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                  Item de Receita
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                  Unidade de Medida
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                  Permite contribuição ao fundo privado?
                </th>
                <th className="text-right px-4 py-3 w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Nenhum item de receita cadastrado.
                  </td>
                </tr>
              ) : (
                itens.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition"
                  >
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {t.itemReceita}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {t.unidadeMedida}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {t.contribuicaoFundo}
                    </td>
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

      {/* MODAL PADRONIZADO LADO A LADO - COM LARGURA FORÇADA EM 1000px */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full sm:max-w-[1000px] max-w-[95vw] px-[45px] py-[40px] bg-white rounded-[15px] border border-[#d6d6d6] shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-2 mb-2">
            <div className="flex items-center justify-center gap-2 text-[#1A7A3C]">
              <ListTree size={24} />
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                {modalTitle}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600 font-medium">
              {modalSubtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Divisor Padrão */}
          <div className="flex flex-col items-center justify-center py-[12px] w-full">
            <div className="h-[1px] w-full bg-[#D2D2D7]/60" />
          </div>

          {/* Informações Básicas */}
          <ModalSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <div className="md:col-span-2">
                <FloatInput
                  label="Item de Receita"
                  required={!isViewOnly}
                  value={itemReceita}
                  onChange={setItemReceita}
                  maxLength={255}
                  disabled={isViewOnly}
                />
              </div>

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
                  data={listarUnidadesMedida().filter(
                    (item) => item.situacao === "Ativo",
                  )}
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
                  data={listarIndices().filter(
                    (item) => item.situacao === "Ativo",
                  )}
                  searchKeys={["nome", "codigo"]}
                  columns={[
                    { label: "Código", key: "id" },
                    { label: "Índice", key: "nome" },
                  ]}
                  icon={<LineChart size={18} className="text-[#1A7A3C]" />}
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
                  value={
                    contribuicaoFundo === "Sim" || contribuicaoFundo === true
                  }
                  onChange={(v: boolean) => {
                    setContribuicaoFundo(v ? "Sim" : "Não");
                    setErroContribuicaoFundo(false);
                    if (!v) {
                      setFundoArrecadacao(null);
                      setConvenio(null);
                      setQuantidadeIndiceFundo("");
                    }
                  }}
                  disabled={isViewOnly}
                />
              </div>

              {(contribuicaoFundo === "Sim" || contribuicaoFundo === true) && (
                <div className="md:col-span-2 border-t border-gray-100 pt-5">
                  <ContribuicaoFundoFields
                    fundo={fundoArrecadacao}
                    convenio={convenio}
                    quantidadeIndice={quantidadeIndiceFundo}
                    indiceNome={indice?.nome}
                    disabled={isViewOnly}
                    error={erroContribuicaoFundo}
                    onFundoChange={(fundo) => {
                      setFundoArrecadacao(fundo);
                      setConvenio(null);
                      setQuantidadeIndiceFundo("");
                      setErroContribuicaoFundo(false);
                    }}
                    onConvenioChange={(value) => {
                      setConvenio(value);
                      setQuantidadeIndiceFundo("");
                      setErroContribuicaoFundo(false);
                    }}
                    onQuantidadeIndiceChange={(value) => {
                      setQuantidadeIndiceFundo(value);
                      setErroContribuicaoFundo(false);
                    }}
                  />
                </div>
              )}
            </div>
          </ModalSection>

          {/* Rodapé do Modal */}
          <div className="flex justify-center items-center gap-[12px] pb-[10px] pt-[30px] w-full">
            {isViewOnly ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition hover:bg-gray-50 bg-white"
                style={{ border: "1px solid #008446" }}
              >
                <span className="text-[15px] font-bold text-[#008446]">
                  Voltar
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition hover:bg-gray-50 bg-white"
                  style={{ border: "1px solid #008446" }}
                >
                  <span className="text-[15px] font-bold text-[#008446]">
                    Cancelar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSalvar}
                  className="bg-[#008446] hover:bg-[#006b38] flex h-[43px] items-center justify-center px-[24px] py-[8px] rounded-[4px] cursor-pointer transition shadow-sm"
                >
                  <span className="text-[15px] font-bold text-white">
                    Salvar
                  </span>
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
