import { Handshake, Wallet } from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  FUNDOS_ARRECADACAO_MOCK,
  type Convenio,
  type FundoArrecadacao,
} from "../FundoArrecadacao/fundoArrecadacaoData";

interface ContribuicaoFundoFieldsProps {
  fundo: FundoArrecadacao | null;
  convenio: Convenio | null;
  quantidadeIndice: string;
  indiceNome?: string;
  disabled?: boolean;
  error?: boolean;
  onFundoChange: (fundo: FundoArrecadacao) => void;
  onConvenioChange: (convenio: Convenio) => void;
  onQuantidadeIndiceChange: (value: string) => void;
}

const somenteDecimal = (value: string) => {
  const normalizado = value.replace(/\./g, ",").replace(/[^0-9,]/g, "");
  const [inteiro, ...decimais] = normalizado.split(",");
  return decimais.length ? `${inteiro},${decimais.join("").slice(0, 4)}` : inteiro;
};

export function ContribuicaoFundoFields({
  fundo,
  convenio,
  quantidadeIndice,
  indiceNome,
  disabled = false,
  error = false,
  onFundoChange,
  onConvenioChange,
  onQuantidadeIndiceChange,
}: ContribuicaoFundoFieldsProps) {
  const fundosPrivados = FUNDOS_ARRECADACAO_MOCK.filter(
    (item) => item.tipo === "Privado" && item.situacao === "Ativo",
  );
  const conveniosAtivos = fundo?.convenios.filter(
    (item) => item.situacao === "Ativo",
  ) ?? [];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {disabled ? (
        <FloatInput
          label="Fundo de Arrecadação"
          required
          value={fundo?.nome ?? ""}
          disabled
        />
      ) : (
        <EntitySearchInput
          label="Fundo de Arrecadação"
          placeholder="Buscar fundo de arrecadação privado"
          value={fundo?.nome ?? ""}
          data={fundosPrivados}
          searchKeys={["nome", "tipo", "situacao"]}
          columns={[
            { label: "Fundo de Arrecadação", key: "nome" },
            { label: "Tipo", key: "tipo" },
          ]}
          icon={<Wallet size={18} color="#1A7A3C" />}
          onChange={onFundoChange}
          required
          title="Buscar Fundo de Arrecadação"
          subtitle="Busque por um fundo de arrecadação privado e ativo:"
        />
      )}

      {fundo &&
        (disabled ? (
          <FloatInput
            label="Convênio"
            required
            value={convenio?.nome ?? ""}
            disabled
          />
        ) : (
          <EntitySearchInput
            label="Convênio"
            placeholder="Buscar convênio"
            value={convenio?.nome ?? ""}
            data={conveniosAtivos}
            searchKeys={["nome", "numero", "descricao"]}
            columns={[
              { label: "Nome do Convênio", key: "nome" },
              { label: "Número", key: "numero" },
            ]}
            icon={<Handshake size={18} color="#1A7A3C" />}
            onChange={onConvenioChange}
            required
            title="Buscar Convênio"
            subtitle={`Busque por um convênio ativo vinculado a ${fundo.nome}:`}
          />
        ))}

      {convenio && (
        <FloatInput
          label="Quantidade do Índice destinada ao Fundo Privado"
          required
          placeholder="0,00"
          value={
            disabled && quantidadeIndice && indiceNome
              ? `${quantidadeIndice} ${indiceNome}`
              : quantidadeIndice
          }
          onChange={(value) =>
            onQuantidadeIndiceChange(somenteDecimal(value))
          }
          disabled={disabled}
          maxLength={12}
          className="md:col-span-2"
        />
      )}

      {error && (
        <p className="text-sm font-medium text-red-500 md:col-span-2">
          Selecione o fundo, o convênio e informe uma quantidade de índice maior que zero.
        </p>
      )}
    </div>
  );
}
