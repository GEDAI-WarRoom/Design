import React from "react";
import {
  CheckboxGroup,
  FloatInput,
  FloatSelect,
  LargeTextArea,
} from "../../../components/ui/FormKit";

export type TipoProduto = "Animal" | "Vegetal";
export type SituacaoProduto = "Ativo" | "Inativo";

export interface ProdutoCadastroValue {
  id?: number;
  codigo: string;
  nome: string;
  tipoProduto: TipoProduto;
  unidadeMedida: string;
  areasAtuacao: string[];
  classificacoes: string[];
  situacao: SituacaoProduto;
  observacao: string;
}

export const TIPOS_PRODUTO = [
  { value: "Animal", label: "Animal" },
  { value: "Vegetal", label: "Vegetal" },
];

export const UNIDADES_MEDIDA = [
  { value: "L", label: "Litro (L)", tipo: "Ambos" },
  { value: "KG", label: "Quilograma (KG)", tipo: "Ambos" },
  { value: "UN", label: "Unidade (UN)", tipo: "Ambos" },
  { value: "DZ", label: "Dúzia (DZ)", tipo: "Animal" },
  { value: "ARR", label: "Arroba (@)", tipo: "Animal" },
  { value: "SC", label: "Saca (SC)", tipo: "Vegetal" },
];

const AREAS_ATUACAO = ["Carne", "Leite", "Mel", "Ovos", "Pescado"].map((item) => ({
  id: item,
  label: item,
}));

const CLASSIFICACOES = ["Matéria Prima", "Produto Final"].map((item) => ({
  id: item,
  label: item,
}));

function textoOuPadrao(valor: unknown, padrao: string) {
  return typeof valor === "string" && valor.trim() ? valor : padrao;
}

function listaOuPadrao(valor: unknown, padrao: string[]) {
  return Array.isArray(valor) && valor.length > 0 ? valor : padrao;
}

export function normalizarProduto(dados?: any): ProdutoCadastroValue {
  const tipoInformado = dados?.tipoProduto ?? dados?.tipo;
  const tipoProduto: TipoProduto = tipoInformado === "Vegetal" ? "Vegetal" : "Animal";
  const id = typeof dados?.id === "number" ? dados.id : undefined;
  const codigoPadrao = id ? `PRD-${String(id).padStart(4, "0")}` : "PRD-0004";
  const nomePadrao = tipoProduto === "Vegetal" ? "Cachaça Artesanal" : "Carne Bovina";
  const unidadePadrao = tipoProduto === "Vegetal" ? "L" : "KG";
  const areaPadrao = dados?.nome?.toLowerCase().includes("mel") ? ["Mel"] : ["Carne"];

  return {
    id,
    codigo: textoOuPadrao(dados?.codigo, codigoPadrao),
    nome: textoOuPadrao(dados?.nome, nomePadrao),
    tipoProduto,
    unidadeMedida: textoOuPadrao(dados?.unidadeMedida, unidadePadrao),
    areasAtuacao:
      tipoProduto === "Animal" ? listaOuPadrao(dados?.areasAtuacao, areaPadrao) : [],
    classificacoes: listaOuPadrao(dados?.classificacoes, ["Produto Final"]),
    situacao: dados?.situacao === "Inativo" ? "Inativo" : "Ativo",
    observacao: textoOuPadrao(
      dados?.observacao,
      "Produto cadastrado para comercialização no estabelecimento agropecuário.",
    ),
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface ProdutoCadastroFormProps {
  value: ProdutoCadastroValue;
  onChange?: (value: ProdutoCadastroValue) => void;
  disabled?: boolean;
}

export function ProdutoCadastroForm({
  value,
  onChange,
  disabled = false,
}: ProdutoCadastroFormProps) {
  const atualizar = (campos: Partial<ProdutoCadastroValue>) =>
    onChange?.({ ...value, ...campos });

  const unidadesFiltradas = UNIDADES_MEDIDA.filter(
    (unidade) => unidade.tipo === "Ambos" || unidade.tipo === value.tipoProduto,
  );

  const alterarTipo = (novoTipo: string) => {
    const tipoProduto = novoTipo as TipoProduto;
    const unidadesPermitidas = UNIDADES_MEDIDA.filter(
      (unidade) => unidade.tipo === "Ambos" || unidade.tipo === tipoProduto,
    );
    atualizar({
      tipoProduto,
      unidadeMedida: unidadesPermitidas.some(
        (unidade) => unidade.value === value.unidadeMedida,
      )
        ? value.unidadeMedida
        : tipoProduto === "Vegetal"
          ? "L"
          : "KG",
      areasAtuacao: tipoProduto === "Animal" ? value.areasAtuacao : [],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="Informações Básicas">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FloatInput
                label="Nome do Produto"
                required
                value={value.nome}
                onChange={(nome) => atualizar({ nome })}
                disabled={disabled}
                maxLength={255}
              />
            </div>
            <div className="md:col-span-3">
              <FloatSelect
                label="Tipo do Produto"
                required
                value={value.tipoProduto}
                onChange={alterarTipo}
                options={TIPOS_PRODUTO}
                disabled={disabled}
              />
            </div>
            <div className="md:col-span-3">
              <FloatSelect
                label="Unidade de Medida"
                required
                value={value.unidadeMedida}
                onChange={(unidadeMedida) => atualizar({ unidadeMedida })}
                options={unidadesFiltradas.map(({ value: itemValue, label }) => ({
                  value: itemValue,
                  label,
                }))}
                disabled={disabled}
              />
            </div>
          </div>

          {value.tipoProduto === "Animal" && (
            <div className="pt-4 border-t border-gray-100">
              <CheckboxGroup
                key={`areas-${disabled}-${value.areasAtuacao.join("-")}`}
                title="Área de Atuação"
                required
                options={AREAS_ATUACAO}
                defaultValue={value.areasAtuacao}
                onChange={(areasAtuacao) => atualizar({ areasAtuacao })}
                orientation="horizontal"
                disabled={disabled}
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <CheckboxGroup
              key={`classificacoes-${disabled}-${value.classificacoes.join("-")}`}
              title="Classificação Produtiva"
              required
              options={CLASSIFICACOES}
              defaultValue={value.classificacoes}
              onChange={(classificacoes) => atualizar({ classificacoes })}
              orientation="horizontal"
              disabled={disabled}
            />
          </div>
        </div>
      </Section>


    </div>
  );
}
