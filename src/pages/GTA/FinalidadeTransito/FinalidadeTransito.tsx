import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Dna,
  Pencil,
  Search,
  SlidersHorizontal,
  Eye as ViewIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatSelect } from "../../../components/ui/FormKit";
import { listarEspecies } from "../../Animal/Especie/especieData";
import { listarPapeis } from "../../Controle/Papeis/papeisData";
import { listarFinalidadesTransito } from "./finalidadeTransitoData";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// --- mock da entidade ---

const TIPOS_DESTINO = [
  {
    value: "Estabelecimento Agropecuário",
    label: "Estabelecimento Agropecuário",
  },
  { value: "Evento Pecuário", label: "Evento Pecuário" },
  { value: "Abatedouro Frigorífico", label: "Abatedouro Frigorífico" },
  {
    value: "Revendedora de Animais Vivos",
    label: "Revendedora de Animais Vivos",
  },
  {
    value: "Unidade de Vigilância Agropecuária",
    label: "Unidade de Vigilância Agropecuária",
  },
  {
    value: "Instituição de Ensino e Pesquisa",
    label: "Instituição de Ensino e Pesquisa",
  },
  { value: "Local de Pesagem", label: "Local de Pesagem" },
  {
    value: "Local de Realização de Exame",
    label: "Local de Realização de Exame",
  },
  { value: "Estabelecimento Genérico", label: "Estabelecimento Genérico" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Suspenso", label: "Suspenso" },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="hover:opacity-80 transition flex-shrink-0"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function FinalidadeTransitoPage({ onLogout, onNavigate }: PageProps) {
  const [finalidade, setFinalidade] = useState("");
  const [tipoDestino, setTipoDestino] = useState("");
  const [tipoProcedencia, setTipoProcedencia] = useState("");
  const [situacao, setSituacao] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [papel, setPapel] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [focusFinalidade, setFocusFinalidade] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [erroEspecie, setErroEspecie] = useState(false);
  const perPage = 10;

  const temFiltroAtivo =
    finalidade.trim() !== "" || tipoProcedencia !== "" || tipoDestino !== "" || !!especie || !!papel || situacao !== "";

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = listarFinalidadesTransito().filter((f) => {
    const matchFinalidade =
      finalidade.trim() === "" ||
      f.finalidade.toLowerCase().includes(finalidade.trim().toLowerCase());
    const matchTipoDestino =
      tipoDestino === "" || f.tipoDestino === tipoDestino;
    const matchTipoProcedencia =
      tipoProcedencia === "" || f.tiposProcedencia.includes(tipoProcedencia);
    const matchEspecie = !especie || f.especieIds.includes(especie.id);
    const matchPapel = !papel || f.papelIds.includes(papel.id);
    const matchSituacao = situacao === "" || f.situacao === situacao;
    return matchFinalidade && matchTipoProcedencia && matchTipoDestino && matchEspecie && matchPapel && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="finalidade-transito"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* --- topo da pagina --- */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Finalidade de Trânsito
            </h1>
            <button
              onClick={() => onNavigate("adicionar-finalidade-transito")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        {/* --- container branco unico (engloba filtros, mensagens e tabelas) --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* --- barra superior do filtro (busca rapida e botao de expansao) --- */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusFinalidade || finalidade ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Finalidade de Trânsito
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={finalidade}
                  onFocus={() => setFocusFinalidade(true)}
                  onBlur={() => setFocusFinalidade(false)}
                  onChange={(e) => setFinalidade(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search
                  size={15}
                  className="text-gray-400 ml-2 flex-shrink-0 mb-0.5"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm"
              style={{
                backgroundColor: showFilters ? "transparent" : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* --- filtros internos avancados --- */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              <div className="grid w-full grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="w-full">
                  <FloatSelect
                    label="Tipo de Procedência"
                    value={tipoProcedencia}
                    onChange={setTipoProcedencia}
                    options={TIPOS_DESTINO}
                  />
                </div>

                <div className="w-full">
                  <FloatSelect
                    label="Tipo de Destino"
                    value={tipoDestino}
                    onChange={setTipoDestino}
                    options={TIPOS_DESTINO}
                  />
                </div>

                <div className="w-full">
                  <EntitySearchInput
                    label="Espécie"
                    placeholder="Buscar por nome da espécie"
                    value={especie ? especie.nome : ""}
                    data={listarEspecies().filter((item) => item.situacao === "Ativo")}
                    searchKeys={["nome", "grupo"]}
                    columns={[
                      { label: "Espécie", key: "nome" },
                      { label: "Grupo", key: "grupo" },
                    ]}
                    icon={<Dna size={18} color={GREEN} />}
                    title="Buscar Espécie"
                    subtitle="Busque por uma espécie cadastrada:"
                    onChange={(ent) => {
                      setEspecie(ent);
                      setErroEspecie(false);
                    }}
                  />
                </div>

                <div className="w-full">
                  <EntitySearchInput
                    label="Papel"
                    placeholder="Buscar por nome do papel"
                    value={papel ? papel.nome : ""}
                    data={listarPapeis()}
                    searchKeys={["nome", "tipo", "situacao"]}
                    columns={[
                      { label: "Nome do Papel", key: "nome" },
                      { label: "Tipo", key: "tipo" },
                      { label: "Situação", key: "situacao" },
                    ]}
                    icon={<img src={Icons.iconePapeisUrl} alt="" className="h-[18px] w-[18px] object-contain" />}
                    title="Buscar Papel"
                    subtitle="Busque por um papel cadastrado:"
                    onChange={setPapel}
                  />
                </div>

                <div className="w-full">
                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={setSituacao}
                    options={SITUACOES}
                  />
                </div>

                {/* --- botao pesquisar compacto --- */}
                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>
            </div>
          )}

          {/* --- chips de filtros ativos --- */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {finalidade.trim() && (
                <Chip
                  label={`Finalidade: ${finalidade}`}
                  onRemove={() => setFinalidade("")}
                />
              )}
              {tipoDestino && (
                <Chip
                  label={`Tipo de Destino: ${tipoDestino}`}
                  onRemove={() => setTipoDestino("")}
                />
              )}
              {tipoProcedencia && (
                <Chip
                  label={`Tipo de Procedência: ${tipoProcedencia}`}
                  onRemove={() => setTipoProcedencia("")}
                />
              )}
              {especie && (
                <Chip
                  label={`Espécie: ${especie.nome}`}
                  onRemove={() => setEspecie(null)}
                />
              )}
              {papel && (
                <Chip
                  label={`Papel: ${papel.nome}`}
                  onRemove={() => setPapel(null)}
                />
              )}
              {situacao && (
                <Chip
                  label={`Situação: ${situacao}`}
                  onRemove={() => setSituacao("")}
                />
              )}
            </div>
          )}

          {/* --- linha divisoria entre filtros e resultados (aparece apos primeira busca) --- */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

						{/* --- area de resultados (dentro do mesmo card branco) --- */}
					{!hasSearched ? (
						<div className="py-5 text-center">
							<p className="text-sm text-gray-500">
								Busque por finalidade de trânsito utilizando o campo de busca e
								os filtros acima.
							</p>
						</div>
					) : total === 0 ? (
						<div className="py-5 text-center">
							<p className="text-sm text-gray-500">
								Nenhum resultado foi encontrado.
							</p>
						</div>
					) : (
						<div className="w-full">
							<div className="overflow-x-auto rounded-lg">
								<table className="w-full text-sm border-collapse">
									<thead>
										<tr className="border-b border-gray-100">
											<th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
												Finalidade de Trânsito
											</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
												Tipo de Procedência
											</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
												Tipo de Destino
											</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
												Espécie
											</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
												Situação
											</th>
											<th className="px-4 py-3 w-[80px]" />
										</tr>
									</thead>
									<tbody>
										{pagina.map((f) => (
											<tr
												key={f.id}
												className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition">
												<td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
													{f.finalidade}
												</td>
												<td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
													{f.tipoProcedencia}
												</td>
												<td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
													{f.tipoDestino}
												</td>
												<td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
													{f.especies.at(0)?.nome || "N/A"}
												</td>
												<td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
													{f.situacao}
												</td>
												<td className="px-4 py-3 text-right whitespace-nowrap">
  <div className="flex items-center justify-end gap-1">
    <button onClick={() => onNavigate("visualizar-finalidade-transito", f)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Visualizar">
      <ViewIcon size={18} />
    </button>
    <button onClick={() => onNavigate("editar-finalidade-transito", f)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Editar">
      <Pencil size={17} />
    </button>
  </div>
</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

              {/* --- paginacao --- */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={pageAtual === totalPages}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
