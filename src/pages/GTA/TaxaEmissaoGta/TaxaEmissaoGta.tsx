import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Dna, Eye, Pencil, Route, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import { listarFinalidadesTransito } from "../FinalidadeTransito/finalidadeTransitoData";
import {
  listarEspeciesTaxa,
  listarPapeisTaxa,
  OPCOES_COBRANCA_TAXA,
  TIPOS_DOCUMENTO_SANITARIO,
  listarTaxasEmissaoDocumentoSanitario,
  type EspecieTaxa,
  type FinalidadeTaxa,
  type PapelTaxa,
  type TaxaEmissaoGta,
} from "./taxaEmissaoGtaData";

type SortKey =
  | "tipoDocumentoSanitario"
  | "especie"
  | "finalidades"
  | "papeis"
  | "situacao";

const SITUACAO_OPTIONS = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
      <span>{label}</span>
      <button type="button" onClick={onRemove}>
        <X size={14} />
      </button>
    </div>
  );
}

export function TaxaEmissaoGtaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [especie, setEspecie] = useState<EspecieTaxa | null>(null);
  const [tipoDocumentoSanitario, setTipoDocumentoSanitario] = useState("");
  const [finalidade, setFinalidade] = useState<FinalidadeTaxa | null>(null);
  const [papel, setPapel] = useState<PapelTaxa | null>(null);
  const [cobrancaTaxa, setCobrancaTaxa] = useState("");
  const [situacao, setSituacao] = useState("");
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const hasFilter = Boolean(
    tipoDocumentoSanitario || especie || finalidade || papel || cobrancaTaxa || situacao,
  );

  const finalidadesDisponiveis: FinalidadeTaxa[] = listarFinalidadesTransito().map((item) => ({
    id: item.id,
    codigo: item.codigo,
    nome: item.finalidade,
    especiesIds: item.especieIds,
  }));

  const results = useMemo(() => {
    const filtered = listarTaxasEmissaoDocumentoSanitario().filter((item) => {
      const matchEspecie =
        !especie || item.especies.some((itemEspecie) => itemEspecie.id === especie.id);
      const matchTipoDocumento = !tipoDocumentoSanitario || item.tipoDocumentoSanitario === tipoDocumentoSanitario;
      const matchFinalidade = !finalidade || item.finalidades.some((itemFinalidade) => itemFinalidade.id === finalidade.id);
      const matchPapel = !papel || item.papeis.some((itemPapel) => itemPapel.id === papel.id);
      const matchCobrancaTaxa = !cobrancaTaxa || item.cobrancasTaxa.includes(cobrancaTaxa as typeof item.cobrancasTaxa[number]);
      const matchSituacao = !situacao || item.situacao === situacao;

      return (
        matchTipoDocumento &&
        matchEspecie &&
        matchFinalidade &&
        matchPapel &&
        matchCobrancaTaxa &&
        matchSituacao
      );
    });

    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let first = "";
      let second = "";

      if (sortKey === "especie") {
        first = a.especies.map((item) => item.nome).join(", ");
        second = b.especies.map((item) => item.nome).join(", ");
      } else if (sortKey === "finalidades") {
        first = a.finalidades.map((item) => item.nome).join(", ");
        second = b.finalidades.map((item) => item.nome).join(", ");
      } else if (sortKey === "papeis") {
        first = a.papeis.map((item) => item.nome).join(", ");
        second = b.papeis.map((item) => item.nome).join(", ");
      } else if (sortKey === "situacao") {
        first = a.situacao;
        second = b.situacao;
      } else {
        first = a[sortKey] || "";
        second = b[sortKey] || "";
      }

      return sortAsc ? first.localeCompare(second) : second.localeCompare(first);
    });
  }, [
    especie,
    tipoDocumentoSanitario,
    finalidade,
    papel,
    cobrancaTaxa,
    situacao,
    sortKey,
    sortAsc,
  ]);

  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = results.length ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, results.length);
  const rows = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  const search = () => {
    setError(!hasFilter);
    setSearched(hasFilter);
    setPage(1);
  };

  const sort = (key: SortKey) => {
    setSortKey(key);
    setSortAsc(key === sortKey ? !sortAsc : true);
  };

  const label = (key: SortKey) =>
  ({
    tipoDocumentoSanitario: "Tipo de Documento Sanitário",
    especie: "Espécies",
    finalidades: "Finalidades",
    papeis: "Papéis",
    situacao: "Situação",
  }[key]);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="taxa-emissao-gta" hideSearch />
      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Taxa de Emissão de Documento Sanitário</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-taxa-emissao-gta")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F]"
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="grid w-full grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="w-full">
              <FloatSelect
                label="Tipo de Documento Sanitário"
                value={tipoDocumentoSanitario}
                onChange={(next) => {
                  setTipoDocumentoSanitario(next);
                  setError(false);
                  setSearched(false);
                }}
                options={TIPOS_DOCUMENTO_SANITARIO}
              />
            </div>

            {/* Filtro: Espécie */}
            <div className="w-full">
              <EntitySearchInput
                label="Espécie"
                placeholder="Busque por espécie ou grupo"
                value={especie ? `${especie.nome}` : ""}
                data={listarEspeciesTaxa()}
                searchKeys={["codigo", "nome", "grupo"]}
                columns={[
                  { label: "Espécie", key: "nome" },
                  { label: "Grupo", key: "grupo" },
                ]}
                icon={<Dna size={18} color="#1A7A3C" />}
                onChange={(item) => {
                  setEspecie(item);
                  setError(false);
                  setSearched(false);
                }}
                title="Buscar Espécie"
              />
            </div>

            <div className="w-full">
              <EntitySearchInput
                label="Finalidade"
                placeholder="Busque por finalidade de trânsito"
                value={finalidade?.nome ?? ""}
                data={finalidadesDisponiveis}
                searchKeys={["codigo", "nome"]}
                columns={[{ label: "Código", key: "codigo" }, { label: "Finalidade", key: "nome" }]}
                icon={<Route size={18} color="#1A7A3C" />}
                onChange={(item) => {
                  setFinalidade(item);
                  setError(false);
                  setSearched(false);
                }}
                title="Buscar Finalidade de Trânsito"
              />
            </div>

            <div className="w-full">
              <EntitySearchInput
                label="Papel"
                placeholder="Busque por papel"
                value={papel?.nome ?? ""}
                data={listarPapeisTaxa()}
                searchKeys={["nome", "tipo"]}
                columns={[{ label: "Papel", key: "nome" }, { label: "Tipo", key: "tipo" }]}
                icon={<img src={Icons.iconePapeisUrl} alt="" className="h-[18px] w-[18px] object-contain" />}
                onChange={(item) => {
                  setPapel(item);
                  setError(false);
                  setSearched(false);
                }}
                title="Buscar Papel"
              />
            </div>

            <div className="w-full">
              <FloatSelect
                label="Cobrança de Taxa"
                value={cobrancaTaxa}
                onChange={(next) => {
                  setCobrancaTaxa(next);
                  setError(false);
                  setSearched(false);
                }}
                options={OPCOES_COBRANCA_TAXA.map((item) => ({ value: item, label: item }))}
              />
            </div>

            {/* Filtro: Situação */}
            <div className="w-full">
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(next) => {
                  setSituacao(next);
                  setError(false);
                  setSearched(false);
                }}
                options={SITUACAO_OPTIONS}
              />
            </div>

            {/* Botão Pesquisar */}
            <button
              type="button"
              onClick={search}
              className="h-12 w-full px-5 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition shrink-0"
            >
              Pesquisar
            </button>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">Selecione ao menos um filtro para visualizar os resultados.</p>}

          {hasFilter && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => { setEspecie(null); setSearched(false); }} />}
              {tipoDocumentoSanitario && <Chip label={`Tipo de Documento Sanitário: ${tipoDocumentoSanitario}`} onRemove={() => { setTipoDocumentoSanitario(""); setSearched(false); }} />}
              {finalidade && <Chip label={`Finalidade: ${finalidade.nome}`} onRemove={() => { setFinalidade(null); setSearched(false); }} />}
              {papel && <Chip label={`Papel: ${papel.nome}`} onRemove={() => { setPapel(null); setSearched(false); }} />}
              {cobrancaTaxa && <Chip label={`Cobrança de Taxa: ${cobrancaTaxa}`} onRemove={() => { setCobrancaTaxa(""); setSearched(false); }} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => { setSituacao(""); setSearched(false); }} />}
            </div>
          )}

          {!searched ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque taxas utilizando os filtros acima.</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {(["tipoDocumentoSanitario", "especie", "finalidades", "papeis", "situacao"] as SortKey[]).map((key) => (
                      <th key={key} onClick={() => sort(key)} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase cursor-pointer">
                        <span className="inline-flex items-center gap-1">
                          {label(key)}
                          {sortKey === key && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                        </span>
                      </th>
                    ))}
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((item: TaxaEmissaoGta) => {
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-gray-800 font-medium">
                          {item.tipoDocumentoSanitario}
                        </td>
                        <td className="px-4 py-3.5 text-gray-800 font-medium">
                          {item.especies.map((itemEspecie) => itemEspecie.nome).join(", ")}
                        </td>
                        <td className="px-4 py-3.5 text-gray-700">{item.finalidades.map((finalidade) => finalidade.nome).join(", ")}</td>
                        <td className="px-4 py-3.5 text-gray-700">{item.papeis.map((papel) => papel.nome).join(", ")}</td>
                        <td className="px-4 py-3.5 text-gray-700">
                          {item.situacao}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onNavigate("visualizar-taxa-emissao-gta", item)}
                              className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate("editar-taxa-emissao-gta", item)}
                              className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {start} - {end} de {results.length}
                  </span>
                  <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
