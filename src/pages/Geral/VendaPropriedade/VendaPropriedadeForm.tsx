import { useState } from "react";
import { Building2, Eye, UserRound, Info, Calendar } from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect, SimNao } from "../../../components/ui/FormKit";
import {
  ESTABELECIMENTOS_VENDA_PROPRIEDADE,
  PESSOAS_VENDA_PROPRIEDADE,
  PROPRIETARIOS_VENDA_PROPRIEDADE,
  type EstabelecimentoVendaPropriedade,
  type PessoaVendaPropriedade,
  type PorteiraFechada,
  type TipoTransferencia,
} from "./vendaPropriedadeData";
import * as Icons from "../../../imports/icons";


export interface VendaPropriedadeFormValue {
  vendedor: PessoaVendaPropriedade | null;
  estabelecimento: EstabelecimentoVendaPropriedade | null;
  dataVenda: string;
  comprador: PessoaVendaPropriedade | null;
  porteiraFechada: PorteiraFechada | "";
  tipoTransferencia: TipoTransferencia | "";
}

interface VendaPropriedadeFormProps {
  value: VendaPropriedadeFormValue;
  onChange: (value: VendaPropriedadeFormValue) => void;
  disabled?: boolean;
  onViewPessoa?: (pessoa: PessoaVendaPropriedade) => void;
  onViewEstabelecimento?: (estabelecimento: EstabelecimentoVendaPropriedade) => void;
}

const pessoaColumns = [
  { label: "Nome / Razão Social", key: "nome" },
  { label: "CPF / CNPJ", key: "documento" },
];

export function RequiredFieldsNotice() {
  return (
    < div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-0 mb-0" >

      < div className="text-gray-500 flex-shrink-0" >
        <Info size={20} className="stroke-[2.5]" />
      </div >

      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div >
  );
}

export function vendaPropriedadeValida(value: VendaPropriedadeFormValue) {
  return !!(
    value.vendedor
    && value.estabelecimento
    && value.estabelecimento.proprietarioId === value.vendedor.id
    && value.dataVenda
    && value.comprador
    && value.porteiraFechada
    && value.tipoTransferencia
  );
}

export function VendaPropriedadeForm({
  value,
  onChange,
  disabled = false,
  onViewPessoa,
  onViewEstabelecimento,
}: VendaPropriedadeFormProps) {
  const [tipoPessoaVendedor, setTipoPessoaVendedor] = useState("Pessoa física");
  const [tipoPessoaComprador, setTipoPessoaComprador] = useState("Pessoa física");

  const vendedoresFiltrados = PROPRIETARIOS_VENDA_PROPRIEDADE.filter((p) => {
    if (tipoPessoaVendedor === "Pessoa física") return p.documento.length <= 14;
    if (tipoPessoaVendedor === "Pessoa jurídica") return p.documento.length > 14;
    return true;
  });

  const compradoresFiltrados = PESSOAS_VENDA_PROPRIEDADE.filter((p) => {
    if (tipoPessoaComprador === "Pessoa física") return p.documento.length <= 14;
    if (tipoPessoaComprador === "Pessoa jurídica") return p.documento.length > 14;
    return true;
  });

  const estabelecimentosDoVendedor = ESTABELECIMENTOS_VENDA_PROPRIEDADE.filter(
    (estabelecimento) => estabelecimento.proprietarioId === value.vendedor?.id,
  );

  const alterarVendedor = (vendedor: PessoaVendaPropriedade) => {
    onChange({ ...value, vendedor, estabelecimento: null });
  };

  return (


    <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Informações Básicas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 🌟 LINHA DO VENDEDOR */}
        <div className="md:col-span-2 flex items-end gap-2">
          <div className="flex-1">
            {disabled ? (
              <FloatInput label="Vendedor" value={value.vendedor?.nome ?? ""} disabled required />
            ) : (
              <EntitySearchInput
                label="Vendedor"
                placeholder="Buscar por nome ou razão social"
                value={value.vendedor?.nome ?? ""}
                data={vendedoresFiltrados}
                searchKeys={["nome", "documento"]}
                columns={pessoaColumns}
                icon={<UserRound size={18} />}
                title="Buscar Vendedor"
                subtitle="Busque por um proprietário cadastrado no sistema:"
                onChange={alterarVendedor}
                required
                headerActions={
                  <FloatSelect
                    label="Tipo de Pessoa"
                    required
                    value={tipoPessoaVendedor}
                    onChange={(v) => setTipoPessoaVendedor(v)}
                    options={[
                      { value: "Pessoa física", label: "Pessoa Física" },
                      { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
                    ]}
                  />
                }
              />
            )}
          </div>

          {/* CPF/CNPJ + Olhinho do Vendedor */}
          {value.vendedor && (
            <>
              <div className="flex-1">
                <FloatInput
                  label="CPF / CNPJ Vendedor"
                  value={value.vendedor.documento}
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={() => value.vendedor && onViewPessoa?.(value.vendedor)}
                className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                title="Visualizar Detalhes do Vendedor"
              >
                <Eye size={20} />
              </button>
            </>
          )}
        </div>
        {/* 🌟 LINHA DO ESTABELECIMENTO AGROPECUÁRIO */}
        <div className="md:col-span-2 flex items-end gap-2">
          <div className="flex-1">
            <EntitySearchInput
              label="Estabelecimento Agropecuário"
              placeholder="Buscar por código ou nome"
              value={value.estabelecimento?.nome ?? ""}
              data={value.vendedor ? estabelecimentosDoVendedor : ESTABELECIMENTOS_VENDA_PROPRIEDADE}
              searchKeys={["codigo", "nome"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Estabelecimento Agropecuário", key: "nome" },
                { label: "Município", key: "municipio" },
              ]}
              icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />}
              title="Buscar Estabelecimento Agropecuário"
              subtitle={
                value.vendedor
                  ? `Estabelecimentos associados a ${value.vendedor.nome}:`
                  : "Busque por um estabelecimento cadastrado no sistema:"
              }
              onChange={(estabelecimento) => onChange({ ...value, estabelecimento })}
              required
            />
          </div>

          {/* Código + Olhinho do Estabelecimento (só aparecem após selecionar) */}
          {value.estabelecimento && (
            <>
              <div className="flex-1">
                <FloatInput
                  label="Código do Estabelecimento"
                  value={value.estabelecimento.codigo}
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={() => value.estabelecimento && onViewEstabelecimento?.(value.estabelecimento)}
                className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                title="Visualizar Detalhes do Estabelecimento"
              >
                <Eye size={20} />
              </button>
            </>
          )}
        </div>


        {/* 🌟 LINHA DO COMPRADOR */}
        <div className="md:col-span-2 flex items-end gap-2">
          <div className="flex-1">
            {disabled ? (
              <FloatInput label="Comprador" value={value.comprador?.nome ?? ""} disabled required />
            ) : (
              <EntitySearchInput
                label="Comprador"
                placeholder="Buscar por nome ou razão social"
                value={value.comprador?.nome ?? ""}
                data={compradoresFiltrados}
                searchKeys={["nome", "documento"]}
                columns={pessoaColumns}
                icon={<UserRound size={18} />}
                title="Buscar Comprador"
                subtitle="Busque por uma pessoa cadastrada no sistema:"
                onChange={(comprador) => onChange({ ...value, comprador })}
                required
                headerActions={
                  <FloatSelect
                    label="Tipo de Pessoa"
                    required
                    value={tipoPessoaComprador}
                    onChange={(v) => setTipoPessoaComprador(v)}
                    options={[
                      { value: "Pessoa física", label: "Pessoa Física" },
                      { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
                    ]}
                  />
                }
              />
            )}
          </div>

          {/* CPF/CNPJ + Olhinho do Comprador */}
          {value.comprador && (
            <>
              <div className="flex-1">
                <FloatInput
                  label="CPF / CNPJ Comprador"
                  value={value.comprador.documento}
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={() => value.comprador && onViewPessoa?.(value.comprador)}
                className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                title="Visualizar Detalhes do Comprador"
              >
                <Eye size={20} />
              </button>
            </>
          )}
        </div>


        {/* DATA DA VENDA */}
        <FloatInput
          label="Data da Venda"
          value={value.dataVenda}
          icon={<Calendar size={18} />}
          onChange={(dataVenda) => onChange({ ...value, dataVenda })}
          type="date"
          disabled={disabled}
          required
        />

        {/* 🌟 PORTEIRA FECHADA (USANDO O COMPONENTE SimNao) */}
        <div className="flex items-center">
          <SimNao
            label="Porteira Fechada?"
            name="porteiraFechada"
            value={value.porteiraFechada}
            onChange={(v) => onChange({ ...value, porteiraFechada: v ? "Sim" : "Não" })}
            disabled={disabled}
            required
          />
        </div>

        {/* TIPO DE TRANSFERÊNCIA */}
        <div className="md:col-span-2">
          <FloatSelect
            label="Tipo de Transferência"
            value={value.tipoTransferencia}
            onChange={(tipoTransferencia) => onChange({ ...value, tipoTransferencia: tipoTransferencia as TipoTransferencia })}
            options={["Venda", "Herança", "Partilha", "Doação"].map((opcao) => ({ value: opcao, label: opcao }))}
            disabled={disabled}
            required
          />
        </div>

      </div>
    </section>
  );
}