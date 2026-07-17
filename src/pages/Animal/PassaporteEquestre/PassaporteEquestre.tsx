import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
} from "lucide-react";

// 1. Importações Oficiais do Sistema
import { Navbar } from "../../../components/Navbar";
import {
  FloatSelect,
  FloatInput,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  ESTABELECIMENTOS_PASSAPORTE_MOCK,
  EXPLORACOES_PASSAPORTE_MOCK,
  PRODUTORES_PASSAPORTE_MOCK,
  listarPassaportesEquestres,
} from "./passaporteEquestreData";

const GREEN = "#1A7A3C";

const SITUACOES = [
  {
    value: "Aguardando Pagamento",
    label: "Aguardando Pagamento",
  },
  { value: "Ativo", label: "Ativo" },
  { value: "Suspenso", label: "Suspenso" },
  { value: "Cancelado", label: "Cancelado" },
];

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
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

const fmtData = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

interface BuscaPassaporteProps {
  onLogout?: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function PassaporteEquestrePage({ onLogout, onNavigate }: BuscaPassaporteProps) {
  const [busca, setBusca] = useState("");
  const [nomeAnimal, setNomeAnimal] = useState("");
  const [validadeDe, setValidadeDe] = useState("");
  const [validadeAte, setValidadeAte] = useState("");
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<
    any | null
  >(null);
  const [exploracaoPecuaria, setExploracaoPecuaria] = useState<
    any | null
  >(null);
  const [situacao, setSituacao] = useState("");
  const [passaportes] = useState(() => listarPassaportesEquestres());

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = passaportes.filter((p) => {
    const termo = busca.replace(/\D/g, "");
    const matchBusca = termo === "" || p.codigoMicrochip.includes(termo);
    const matchNome =
      nomeAnimal.trim() === "" ||
      p.nomeEquino.toLowerCase().includes(nomeAnimal.toLowerCase().trim());
    const matchValidadeDe =
      validadeDe === "" ||
      (p.dataValidade !== "—" && p.dataValidade >= validadeDe);
    const matchValidadeAte =
      validadeAte === "" ||
      (p.dataValidade !== "—" && p.dataValidade <= validadeAte);
    const matchProdutor =
      !produtor || p.produtor.documento === produtor.documento;
    const matchEstabelecimento =
      !estabelecimento ||
      p.estabelecimento.codigo === estabelecimento.codigo;
    const matchExploracao =
      !exploracaoPecuaria ||
      p.exploracaoPecuaria.codigo === exploracaoPecuaria.codigo;
    const matchSituacao =
      situacao === "" || p.situacao === situacao;
    return (
      matchBusca &&
      matchNome &&
      matchValidadeDe &&
      matchValidadeAte &&
      matchProdutor &&
      matchEstabelecimento &&
      matchExploracao &&
      matchSituacao
    );
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio =
    total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice(
    (pageAtual - 1) * perPage,
    pageAtual * perPage,
  );

  const temFiltroAtivo = !!(
    nomeAnimal ||
    validadeDe ||
    validadeAte ||
    produtor ||
    estabelecimento ||
    exploracaoPecuaria ||
    situacao
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="passaporte"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Cabeçalho de Navegação e Ações */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onNavigate("inicial")}
            className="flex items-center gap-1 text-sm transition hover:opacity-70 self-start"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Voltar para Inicial
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Passaportes Equestres
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Consulte ou adicione novos passaportes emitidos
                para equídeos.
              </p>
            </div>

            {/* Botão de Adicionar */}
            <button
              type="button"
              onClick={() =>
                onNavigate("adicionar-passaporte-equestre")
              } // Altere para a rota correta do seu fluxo
              className="flex items-center justify-center gap-2 px-5 h-11 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-xl transition shadow-sm self-stretch sm:self-auto"
            >
              <Plus size={18} />
              Adicionar Passaporte
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Barra Superior do Filtro (Código do Microchip e Botão de Expansão) */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}
              >
                Código do Microchip
              </label>

              <div className="flex items-center w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => setBusca(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handlePesquisar()
                  }
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
                backgroundColor: showFilters
                  ? "transparent"
                  : GREEN,
                borderColor: GREEN,
                color: showFilters ? GREEN : "#ffffff",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Internos Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col gap-3 w-full">
              {/* FILEIRA 1: Nome, período de validade e ação de pesquisa */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Nome do Animal"
                    value={nomeAnimal}
                    onChange={setNomeAnimal}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Validade do Passaporte - De"
                    type="date"
                    value={validadeDe}
                    onChange={setValidadeDe}
                  />
                </div>
                <div className="w-full lg:flex-1">
                  <FloatInput
                    label="Validade do Passaporte - Até"
                    type="date"
                    value={validadeAte}
                    onChange={setValidadeAte}
                  />
                </div>

                <button
                  onClick={handlePesquisar}
                  className="h-12 w-full lg:w-fit px-6 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                  style={{ backgroundColor: GREEN }}
                >
                  Pesquisar
                </button>
              </div>

              {validadeDe &&
                validadeAte &&
                validadeAte <= validadeDe && (
                  <p className="text-sm text-red-500 -mt-1">
                    A data "Até" deve ser maior que a data "De".
                  </p>
                )}

              {/* FILEIRA 2: Produtor / Estabelecimento Agropecuário / Exploração Pecuária / Situação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
                <EntitySearchInput
                  label="Produtor"
                  placeholder="Buscar pelo nome ou documento do produtor."
                  value={produtor ? produtor.nome : ""}
                  data={PRODUTORES_PASSAPORTE_MOCK}
                  searchKeys={["nome", "documento"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    { label: "CPF/CNPJ", key: "documento" },
                  ]}
                  icon={
                    <img
                      src={Icons.iconeProdutorUrl}
                      alt="Produtor"
                      className="w-5 h-5 object-contain"
                    />
                  }
                  title="Buscar Produtor"
                  subtitle="Busque por um produtor cadastrado no sistema:"
                  onChange={(ent) => setProdutor(ent)}
                />

                <EntitySearchInput
                  label="Estabelecimento Agropecuário"
                  placeholder="Buscar por código, nome, município ou proprietário."
                  value={
                    estabelecimento ? estabelecimento.nome : ""
                  }
                  data={ESTABELECIMENTOS_PASSAPORTE_MOCK}
                  searchKeys={["codigo", "nome", "municipio"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Estabelecimento", key: "nome" },
                    { label: "Município", key: "municipio" },
                  ]}
                  icon={
                    <img
                      src={Icons.iconeEstabelecimentoUrl}
                      alt="Estabelecimento Agropecuário"
                      className="w-5 h-5 object-contain"
                    />
                  }
                  title="Buscar Estabelecimento Agropecuário"
                  subtitle="Busque por um estabelecimento cadastrado:"
                  onChange={(ent) => setEstabelecimento(ent)}
                />

                <EntitySearchInput
                  label="Exploração Pecuária"
                  placeholder="Buscar por código, estabelecimento ou espécie."
                  value={
                    exploracaoPecuaria
                      ? exploracaoPecuaria.codigo
                      : ""
                  }
                  data={EXPLORACOES_PASSAPORTE_MOCK}
                  searchKeys={[
                    "codigo",
                    "estabNome",
                    "especie",
                  ]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    {
                      label: "Estabelecimento",
                      key: "estabNome",
                    },
                    { label: "Espécie", key: "especie" },
                  ]}
                  icon={
                    <img
                      src={Icons.iconeExploracaoUrl}
                      alt="Exploração Pecuária"
                      className="w-5 h-5 object-contain"
                    />
                  }
                  title="Buscar Exploração Pecuária"
                  subtitle="Busque por uma exploração pecuária cadastrada:"
                  onChange={(ent) => setExploracaoPecuaria(ent)}
                />

                <FloatSelect
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={SITUACOES}
                />
              </div>
            </div>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {nomeAnimal && (
                <Chip
                  label={`Animal: ${nomeAnimal}`}
                  onRemove={() => setNomeAnimal("")}
                />
              )}
              {validadeDe && (
                <Chip
                  label={`Validade de: ${fmtData(validadeDe)}`}
                  onRemove={() => setValidadeDe("")}
                />
              )}
              {validadeAte && (
                <Chip
                  label={`Validade até: ${fmtData(validadeAte)}`}
                  onRemove={() => setValidadeAte("")}
                />
              )}
              {produtor && (
                <Chip
                  label={`Produtor: ${produtor.nome}`}
                  onRemove={() => setProdutor(null)}
                />
              )}
              {estabelecimento && (
                <Chip
                  label={`Estab.: ${estabelecimento.nome}`}
                  onRemove={() => setEstabelecimento(null)}
                />
              )}
              {exploracaoPecuaria && (
                <Chip
                  label={`Exploração: ${exploracaoPecuaria.codigo}`}
                  onRemove={() => setExploracaoPecuaria(null)}
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

          {/* Linha Divisória sutil */}
          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                Busque por passaporte equestre utilizando o
                campo de busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        NOME DO EQUINO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        CÓDIGO DO MICROCHIP
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        DATA DE VALIDADE
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        PRODUTOR
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        ESTABELECIMENTO AGROPECUÁRIO
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        EXPLORAÇÃO PECUÁRIA
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal">
                        SITUAÇÃO
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {p.nomeEquino}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {p.codigoMicrochip}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {fmtData(p.dataValidade)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{p.produtor.documento}</div>
                          <div>{p.produtor.nome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{p.estabelecimento.codigo}</div>
                          <div>{p.estabelecimento.nome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {p.exploracaoPecuaria.codigo}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {p.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() =>
                                onNavigate(
                                  "visualizar-passaporte-equestre",
                                  p,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() =>
                                onNavigate(
                                  "editar-passaporte-equestre",
                                  p,
                                )
                              }
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Editar"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {perPage}</span>
                <div className="flex items-center gap-4">
                  <span>
                    {inicio} - {fim} de {total}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(totalPages, p + 1),
                        )
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
