import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RequiredFieldsNotice, TaxaEmissaoGtaForm } from "./TaxaEmissaoGtaForm";
import { ESPECIES_TAXA_MOCK, adicionarTaxaEmissaoGta, criarTaxaVazia, type TaxaEmissaoGtaDraft } from "./taxaEmissaoGtaData";

interface AdicionarTaxaEmissaoGtaPageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AdicionarTaxaEmissaoGtaPage({ onLogout, onNavigate }: AdicionarTaxaEmissaoGtaPageProps) {
  const [taxa, setTaxa] = useState(criarTaxaVazia);
  const [error, setError] = useState("");

  const salvar = () => {
    const taxaPreenchida: TaxaEmissaoGtaDraft = {
      ...taxa,
      especie: taxa.especie.id ? taxa.especie : ESPECIES_TAXA_MOCK[5],
      dataInicioVigencia: taxa.dataInicioVigencia || "2026-08-01",
      tipoCobranca: taxa.tipoCobranca || "Por Cabeça",
      itemReceita: taxa.tipoCobranca === "Por Quantidade" ? taxa.itemReceita : (taxa.itemReceita || "Abelhas"),
      porCabeca: taxa.tipoCobranca === "Por Quantidade" ? (taxa.porCabeca || "Até") : taxa.porCabeca,
      itemReceitaPorCabeca: taxa.tipoCobranca === "Por Quantidade" ? (taxa.itemReceitaPorCabeca || "Abelhas") : taxa.itemReceitaPorCabeca,
      itemReceitaPorDocumento: taxa.tipoCobranca === "Por Quantidade" ? (taxa.itemReceitaPorDocumento || "Aves") : taxa.itemReceitaPorDocumento,
      quantidadeAnimais: taxa.tipoCobranca === "Por Quantidade" ? (taxa.quantidadeAnimais || "20") : taxa.quantidadeAnimais,
    };
    const resultado = adicionarTaxaEmissaoGta(taxaPreenchida);
    if (resultado.erro) {
      setError(resultado.erro);
      return;
    }
    setError("");

    // Redirecionamento direto para a tela de visualização conforme solicitado
    if (resultado.taxa) {
      onNavigate("visualizar-taxa-emissao-gta", resultado.taxa);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("taxa-emissao-gta")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-80 transition"
          >
            <ArrowLeft size={15} /> Todas as Taxas de Emissão de GTA
          </button>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Taxa de Emissão de GTA</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 text-xs font-bold rounded-md text-white bg-[#1A7A3C] hover:bg-[#15612F] transition"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <TaxaEmissaoGtaForm
          value={taxa}
          onChange={(next) => {
            setTaxa(next);
            setError("");
          }}
        />
      </main>
    </div>
  );
}
