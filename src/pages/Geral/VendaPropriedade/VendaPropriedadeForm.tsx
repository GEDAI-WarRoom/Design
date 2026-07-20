import { Building2, UserRound } from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  ESTABELECIMENTOS_VENDA_PROPRIEDADE,
  PESSOAS_VENDA_PROPRIEDADE,
  PROPRIETARIOS_VENDA_PROPRIEDADE,
  type EstabelecimentoVendaPropriedade,
  type PessoaVendaPropriedade,
  type PorteiraFechada,
  type TipoTransferencia,
} from "./vendaPropriedadeData";

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
}

const pessoaColumns = [
  { label: "Nome / Razão Social", key: "nome" },
  { label: "CPF / CNPJ", key: "documento" },
];

export function RequiredFieldsNotice() {
  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-3 text-xs text-gray-500">
      Os campos marcados com <span className="text-red-500 font-semibold">*</span> são obrigatórios.
    </div>
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

export function VendaPropriedadeForm({ value, onChange, disabled = false }: VendaPropriedadeFormProps) {
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
        {disabled ? (
          <FloatInput label="Vendedor" value={value.vendedor?.nome ?? ""} disabled required />
        ) : (
          <EntitySearchInput
            label="Vendedor"
            placeholder="Buscar por nome ou razão social"
            value={value.vendedor?.nome ?? ""}
            data={PROPRIETARIOS_VENDA_PROPRIEDADE}
            searchKeys={["nome", "documento"]}
            columns={pessoaColumns}
            icon={<UserRound size={18} />}
            title="Buscar Vendedor"
            subtitle="Busque por um proprietário cadastrado no sistema:"
            onChange={alterarVendedor}
            required
          />
        )}

        {disabled ? (
          <FloatInput
            label="Estabelecimento Agropecuário"
            value={value.estabelecimento ? `${value.estabelecimento.codigo} - ${value.estabelecimento.nome}` : ""}
            disabled
            required
          />
        ) : value.vendedor ? (
          <EntitySearchInput
            label="Estabelecimento Agropecuário"
            placeholder="Buscar por código ou nome"
            value={value.estabelecimento ? `${value.estabelecimento.codigo} - ${value.estabelecimento.nome}` : ""}
            data={estabelecimentosDoVendedor}
            searchKeys={["codigo", "nome"]}
            columns={[
              { label: "Código", key: "codigo" },
              { label: "Estabelecimento Agropecuário", key: "nome" },
              { label: "Município", key: "municipio" },
            ]}
            icon={<Building2 size={18} />}
            title="Buscar Estabelecimento Agropecuário"
            subtitle={`Estabelecimentos associados a ${value.vendedor.nome}:`}
            onChange={(estabelecimento) => onChange({ ...value, estabelecimento })}
            required
          />
        ) : (
          <FloatInput label="Estabelecimento Agropecuário" value="" disabled required />
        )}

        <FloatInput
          label="Data da Venda"
          value={value.dataVenda}
          onChange={(dataVenda) => onChange({ ...value, dataVenda })}
          type="date"
          disabled={disabled}
          required
        />

        {disabled ? (
          <FloatInput label="Comprador" value={value.comprador?.nome ?? ""} disabled required />
        ) : (
          <EntitySearchInput
            label="Comprador"
            placeholder="Buscar por nome ou razão social"
            value={value.comprador?.nome ?? ""}
            data={PESSOAS_VENDA_PROPRIEDADE}
            searchKeys={["nome", "documento"]}
            columns={pessoaColumns}
            icon={<UserRound size={18} />}
            title="Buscar Comprador"
            subtitle="Busque por uma pessoa cadastrada no sistema:"
            onChange={(comprador) => onChange({ ...value, comprador })}
            required
          />
        )}

        <FloatSelect
          label="Porteira Fechada?"
          value={value.porteiraFechada}
          onChange={(porteiraFechada) => onChange({ ...value, porteiraFechada: porteiraFechada as PorteiraFechada })}
          options={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
          disabled={disabled}
          required
        />

        <FloatSelect
          label="Tipo de Transferência"
          value={value.tipoTransferencia}
          onChange={(tipoTransferencia) => onChange({ ...value, tipoTransferencia: tipoTransferencia as TipoTransferencia })}
          options={["Venda", "Herança", "Partilha", "Doação"].map((opcao) => ({ value: opcao, label: opcao }))}
          disabled={disabled}
          required
        />
      </div>
    </section>
  );
}
