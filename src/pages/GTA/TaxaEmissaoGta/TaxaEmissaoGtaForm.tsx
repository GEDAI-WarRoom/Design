import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Dna, Info, Calendar, Receipt, ListTree } from "lucide-react";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  ESPECIES_TAXA_MOCK,
  FAIXAS_POR_CABECA,
  TIPOS_COBRANCA,
  type FaixaPorCabeca,
  type TaxaEmissaoGtaDraft,
  type TipoCobranca,
} from "./taxaEmissaoGtaData";

// Mock de exemplo para os Itens de Receita
const ITENS_RECEITA_MOCK = [
  { id: "1", codigo: "001", nome: "Taxa de Emissão GTA - Bovinos", quantidadeUfmg: "2" },
  { id: "2", codigo: "002", nome: "Taxa de Emissão GTA - Aves", quantidadeUfmg: "1" },
  { id: "3", codigo: "003", nome: "Taxa de Emissão GTA - Suínos", quantidadeUfmg: "1" },
  { id: "4", codigo: "004", nome: "Taxa de Emissão GTA - Equídeos", quantidadeUfmg: "3" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="bg-white rounded-xl shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl"
      >
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

  const update = <K extends keyof TaxaEmissaoGtaDraft>(field: K, fieldValue: TaxaEmissaoGtaDraft[K]) =>
    onChange?.({ ...value, [field]: fieldValue });

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

  const updateFaixa = (faixa: string) =>
    onChange?.({
      ...value,
      porCabeca: faixa as FaixaPorCabeca,
      itemReceitaPorDocumento: faixa === "A cada" ? "" : value.itemReceitaPorDocumento,
    });

  return (
    <Section title="Informações da Taxa">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Espécie */}
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
            icon={<Dna size={18} color="#1A7A3C" />}
            onChange={(especie) => update("especie", especie)}
            required
            disabled={disabled}
            title="Buscar Espécie"
            subtitle="Busque por uma espécie cadastrada no sistema:"
          />
        ) : (
          <FloatInput
            label="Espécie"
            required
            value={`${value.especie.codigo} - ${value.especie.nome}`}
            onChange={() => { }}
            disabled
          />
        )}

        {/* 2. Data Início de Vigência */}
        <FloatInput
          label="Data Início de Vigência"
          type="date"
          value={value.dataInicioVigencia}
          icon={<Calendar size={18} color="#1A7A3C" />}
          onChange={(next) => update("dataInicioVigencia", next)}
          disabled={disabled}
        />

        {/* 3. Tipo de Cobrança */}
        <FloatSelect
          label="Tipo de Cobrança"
          required
          value={value.tipoCobranca}
          onChange={updateTipoCobranca}
          options={TIPOS_COBRANCA}
          disabled={disabled}
        />

        {/* Item de Receita para 'Por Cabeça' e 'Por Documento' (Seleção de Entidade) */}
        {(value.tipoCobranca === "Por Cabeça" || value.tipoCobranca === "Por Documento") && (
          <div className="md:col-span-2">
            <EntitySearchInput
              label="Item de Receita"
              placeholder="Buscar item de receita"
              value={value.itemReceita}
              data={ITENS_RECEITA_MOCK}
              searchKeys={["nome", "quantidadeUfmg"]}
              columns={[
                { label: "Nome", key: "nome" },
                { label: "Quantidade de UFMG", key: "quantidadeUfmg" },
              ]}
              icon={<ListTree size={18} color="#1A7A3C" />}
              onChange={(item) => update("itemReceita", item ? item.nome : "")}
              required
              disabled={disabled}
              title="Buscar Item de Receita"
              subtitle="Busque por item de receita cadastrado:"
            />
          </div>
        )}
      </div>

      {/* Bloco de Cobrança por Quantidade */}
      {value.tipoCobranca === "Por Quantidade" && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">Cobrança por Quantidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Item de Receita por Cabeça (Seleção de Entidade) */}
            <div className="md:col-span-2">
              <EntitySearchInput
                label="Item de Receita por Cabeça"
                placeholder="Buscar item de receita por cabeça"
                value={value.itemReceitaPorCabeca}
                data={ITENS_RECEITA_MOCK}
                searchKeys={["nome", "quantidadeUfmg"]}
                columns={[
                  { label: "Nome", key: "nome" },
                  { label: "Quantidade de UFMG", key: "quantidadeUfmg" },
                ]}
                icon={<ListTree size={18} color="#1A7A3C" />}
                onChange={(item) => update("itemReceitaPorCabeca", item ? item.nome : "")}
                required
                disabled={disabled}
                title="Buscar Item de Receita por Cabeça"
                subtitle="Busque por item de receita cadastrado:"
              />
            </div>

            <FloatSelect
              label="Por cabeça"
              required
              value={value.porCabeca}
              onChange={updateFaixa}
              options={FAIXAS_POR_CABECA}
              disabled={disabled}
            />

            <FloatInput
              label="Quantidade de Animais"
              required
              value={value.quantidadeAnimais}
              onChange={(next) => update("quantidadeAnimais", next.replace(/\D/g, ""))}
              maxLength={255}
              disabled={disabled}
            />

            {/* Exibição condicional de "Por documento" (somente leitura) e "Item de Receita por Documento" */}
            {(value.porCabeca === "Acima de" || value.porCabeca === "Até") && (
              <>
                <FloatInput
                  label="Por documento"
                  value={value.porCabeca === "Até" ? "Acima de" : "Até"}
                  disabled
                  onChange={() => { }}
                />

                {/* Item de Receita por Documento (Seleção de Entidade) */}
                <EntitySearchInput
                  label="Item de Receita por Documento"
                  placeholder="Buscar item de receita por documento"
                  value={value.itemReceitaPorDocumento}
                  data={ITENS_RECEITA_MOCK}
                  searchKeys={["nome", "quantidadeUfmg"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "Quantidade de UFMG", key: "quantidadeUfmg" },
                  ]}
                  icon={<ListTree size={18} color="#1A7A3C" />}
                  onChange={(item) => update("itemReceitaPorDocumento", item ? item.nome : "")}
                  required
                  disabled={disabled}
                  title="Buscar Item de Receita por Documento"
                  subtitle="Busque por item de receita cadastrado:"
                />
              </>
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
      <p className="text-sm text-gray-600 font-medium leading-relaxed">
        Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

export function taxaValida(taxa: TaxaEmissaoGtaDraft) {
  if (!taxa.especie.id || !taxa.tipoCobranca) return false;
  if (taxa.tipoCobranca !== "Por Quantidade") return Boolean(taxa.itemReceita);

  const qtdValida = Boolean(taxa.quantidadeAnimais) && Number(taxa.quantidadeAnimais) > 0;
  if (!taxa.porCabeca || !taxa.itemReceitaPorCabeca || !qtdValida) return false;

  return taxa.porCabeca === "A cada" || Boolean(taxa.itemReceitaPorDocumento);
}