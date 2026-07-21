import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Dna, Info, Calendar } from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  ESPECIES_TAXA_MOCK,
  FAIXAS_POR_CABECA,
  ITENS_RECEITA,
  TIPOS_COBRANCA,
  type FaixaPorCabeca,
  type TaxaEmissaoGtaDraft,
  type TipoCobranca,
} from "./taxaEmissaoGtaData";
function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </section>
  );
}
interface TaxaEmissaoGtaFormProps {
  value: TaxaEmissaoGtaDraft;
  onChange?: (value: TaxaEmissaoGtaDraft) => void;
  mode?: "create" | "edit" | "view";
}
export function TaxaEmissaoGtaForm({ value, onChange, mode = "create" }: TaxaEmissaoGtaFormProps) {
  const disabled = mode === "view";
  const update = <K extends keyof TaxaEmissaoGtaDraft>(field: K, fieldValue: TaxaEmissaoGtaDraft[K]) => onChange?.({ ...value, [field]: fieldValue });
  const updateTipoCobranca = (tipoCobranca: string) => {
    const tipo = tipoCobranca as TipoCobranca;
    onChange?.({
      ...value,
      tipoCobranca: tipo,
      itemReceita: tipo === "Por Quantidade" ? "" : value.itemReceita,
      porCabeca: tipo === "Por Quantidade" ? value.porCabeca : "",
      itemReceitaPorCabeca: tipo === "Por Quantidade" ? value.itemReceitaPorCabeca : "",
      itemReceitaPorDocumento: tipo === "Por Quantidade" ? value.itemReceitaPorDocumento : "",
      quantidadeAnimais: tipo === "Por Quantidade" ? value.quantidadeAnimais : "",
    });
  };
  const updateFaixa = (faixa: string) => onChange?.({
    ...value,
    porCabeca: faixa as FaixaPorCabeca,
    itemReceitaPorDocumento: faixa === "A cada" ? "" : value.itemReceitaPorDocumento,
  });
  return (
    <Section title="Informações da Taxa">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mode === "create" ? (
          <EntitySearchInput
            label="Espécie"
            placeholder="Busque por espécie ou grupo"
            value={value.especie.id ? `${value.especie.nome}` : ""}
            data={ESPECIES_TAXA_MOCK}
            searchKeys={["nome", "grupo"]}
            columns={[
              { label: "Espécie", key: "nome" },
              { label: "Grupo", key: "grupo" },
            ]}
            icon={<Dna size={18} />}
            onChange={(especie) => update("especie", especie)}
            required
            title="Buscar Espécie"
            subtitle="Selecione uma espécie cadastrada no sistema:"
          />
        ) : (
          <FloatInput label="Espécie" required value={`${value.especie.codigo} - ${value.especie.nome}`} onChange={() => { }} disabled />
        )}
        <FloatSelect label="Tipo de Cobrança" required value={value.tipoCobranca} onChange={updateTipoCobranca} options={TIPOS_COBRANCA} disabled={disabled} />
        {(value.tipoCobranca === "Por Cabeça" || value.tipoCobranca === "Por Documento") && (
          <FloatSelect label="Item de Receita" required value={value.itemReceita} onChange={(next) => update("itemReceita", next)} options={ITENS_RECEITA} disabled={disabled} className="md:col-span-2" />
        )}
        <FloatInput label="Data Início de Vigência" type="date" value={value.dataInicioVigencia} icon={<Calendar size={18} />} onChange={(next) => update("dataInicioVigencia", next)} disabled={disabled} />
      </div>
      {value.tipoCobranca === "Por Quantidade" && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">Cobrança por Quantidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect label="Por cabeça" required value={value.porCabeca} onChange={updateFaixa} options={FAIXAS_POR_CABECA} disabled={disabled} />
            <FloatInput label="Quantidade de Animais" required value={value.quantidadeAnimais} onChange={(next) => update("quantidadeAnimais", next.replace(/\D/g, ""))} maxLength={255} disabled={disabled} />
            <FloatSelect label="Item de Receita por Cabeça" required value={value.itemReceitaPorCabeca} onChange={(next) => update("itemReceitaPorCabeca", next)} options={ITENS_RECEITA} disabled={disabled} className="md:col-span-2" />
            {(value.porCabeca === "Acima de" || value.porCabeca === "Até") && (
              <FloatSelect label="Item de Receita por Documento" required value={value.itemReceitaPorDocumento} onChange={(next) => update("itemReceitaPorDocumento", next)} options={ITENS_RECEITA} disabled={disabled} className="md:col-span-2" />
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
export function RequiredFieldsNotice() {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
      <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
      <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p>
    </div>
  );
}
export function taxaValida(taxa: TaxaEmissaoGtaDraft) {
  if (!taxa.especie.id || !taxa.tipoCobranca) return false;
  if (taxa.tipoCobranca !== "Por Quantidade") return Boolean(taxa.itemReceita);
  if (!taxa.porCabeca || !taxa.itemReceitaPorCabeca || !taxa.quantidadeAnimais) return false;
  return taxa.porCabeca === "A cada" || Boolean(taxa.itemReceitaPorDocumento);
}
