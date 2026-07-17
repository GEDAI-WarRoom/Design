import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Ruler,
  FileText,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// --- dados ---

export const UNIDADES_MEDIDA_ENTIDADE = [
  {
    id: 1,
    codigo: "UND",
    sigla: "un",
    nome: "Unidade",
    descricao: "Quantidade unitária",
  },
  {
    id: 2,
    codigo: "KG",
    sigla: "kg",
    nome: "Quilograma",
    descricao: "Massa em quilogramas",
  },
  {
    id: 3,
    codigo: "G",
    sigla: "g",
    nome: "Grama",
    descricao: "Massa em gramas",
  },
  {
    id: 4,
    codigo: "L",
    sigla: "L",
    nome: "Litro",
    descricao: "Volume em litros",
  },
  {
    id: 5,
    codigo: "ML",
    sigla: "mL",
    nome: "Mililitro",
    descricao: "Volume em mililitros",
  },
  {
    id: 6,
    codigo: "CX",
    sigla: "cx",
    nome: "Caixa",
    descricao: "Quantidade por caixa",
  },
  {
    id: 7,
    codigo: "SC",
    sigla: "sc",
    nome: "Saca",
    descricao: "Quantidade por saca",
  },
  {
    id: 8,
    codigo: "FR",
    sigla: "fr",
    nome: "Frasco",
    descricao: "Quantidade por frasco",
  },
];
const RECEITAS = [
  { value: "100", label: "100" },
  { value: "200", label: "200" },
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
  { value: "800", label: "800" },
  { value: "900", label: "900" },
];
export const RECEITAS_ENTIDADE = [
  {
    id: 1,
    codigo: "REC000001",
    nome: "Vacinação Contra Brucelose",
    descricao:
      "Receita destinada à vacinação obrigatória contra Brucelose.",
    unidadeMedida: "Dose",
    quantidadePadrao: 1,
    ativo: true,
  },
  {
    id: 2,
    codigo: "REC000002",
    nome: "Tratamento Antiparasitário",
    descricao:
      "Receita para controle de endoparasitas e ectoparasitas.",
    unidadeMedida: "mL",
    quantidadePadrao: 50,
    ativo: true,
  },
  {
    id: 3,
    codigo: "REC000003",
    nome: "Suplementação Mineral",
    descricao: "Receita para suplementação mineral do rebanho.",
    unidadeMedida: "kg",
    quantidadePadrao: 25,
    ativo: true,
  },
  {
    id: 4,
    codigo: "REC000004",
    nome: "Antibiótico Veterinário",
    descricao:
      "Receita para tratamento de infecções bacterianas.",
    unidadeMedida: "Frasco",
    quantidadePadrao: 1,
    ativo: true,
  },
  {
    id: 5,
    codigo: "REC000005",
    nome: "Anti-inflamatório Veterinário",
    descricao:
      "Receita para tratamento de processos inflamatórios.",
    unidadeMedida: "mL",
    quantidadePadrao: 20,
    ativo: false,
  },
];
const CONTRIBUICAO_FUNDO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];
const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// --- mocks ---

interface ItemReceita {
  id: number;
  itemReceita: string;
  unidadeMedida: string;
  receita: string;
  contribuicaoFundo: "Sim" | "Não";
  situacao: "Ativo" | "Inativo";
}

const RECEITAS_ENTIDADE_INPUT = RECEITAS_ENTIDADE.map(
  (receita) => ({
    value: receita.codigo,
    label: receita.nome,
  }),
);

const ITEM_RECEITA_MOCK: ItemReceita[] = [
  {
    id: 1,
    itemReceita: "Vacina B19",
    unidadeMedida: "Frasco",
    receita: "Vacinação Contra Brucelose",
    contribuicaoFundo: "Sim",
    situacao: "Ativo",
  },
  {
    id: 2,
    itemReceita: "Ivermectina 1%",
    unidadeMedida: "mL",
    receita: "Tratamento Antiparasitário",
    contribuicaoFundo: "Não",
    situacao: "Ativo",
  },
  {
    id: 3,
    itemReceita: "Suplemento Mineral Bovino",
    unidadeMedida: "kg",
    receita: "Suplementação Mineral",
    contribuicaoFundo: "Sim",
    situacao: "Ativo",
  },
  {
    id: 4,
    itemReceita: "Oxitetraciclina",
    unidadeMedida: "Frasco",
    receita: "Antibiótico Veterinário",
    contribuicaoFundo: "Não",
    situacao: "Ativo",
  },
  {
    id: 5,
    itemReceita: "Flunixina Meglumina",
    unidadeMedida: "mL",
    receita: "Anti-inflamatório Veterinário",
    contribuicaoFundo: "Sim",
    situacao: "Inativo",
  },
  {
    id: 6,
    itemReceita: "Vitamina ADE",
    unidadeMedida: "mL",
    receita: "Suplementação Mineral",
    contribuicaoFundo: "Não",
    situacao: "Ativo",
  },
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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function ItemReceitaPage({
  onLogout,
  onNavigate,
}: PageProps) {
  const [itemReceita, setItemReceita] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [receita, setReceita] = useState("");
  const [contribuicaoFundo, setContribuicaoFundo] =
    useState("");
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [focusItemReceita, setFocusItemReceita] =
    useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = ITEM_RECEITA_MOCK.filter((t) => {
    const matchItemReceita =
      itemReceita.trim() === "" ||
      t.itemReceita
        .toLowerCase()
        .includes(itemReceita.trim().toLowerCase());
    const matchUnidadeMedida =
      unidadeMedida === "" || t.unidadeMedida === unidadeMedida;
    const matchReceita =
      receita === "" || t.receita === receita;
    const matchContribuicaoFundo =
      contribuicaoFundo === "" ||
      t.contribuicaoFundo === contribuicaoFundo;
    const matchSituacao =
      situacao === "" || t.situacao === situacao;
    return (
      matchItemReceita &&
      matchUnidadeMedida &&
      matchReceita &&
      matchContribuicaoFundo &&
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

  const temFiltroAtivo =
    itemReceita.trim() !== "" ||
    unidadeMedida !== "" ||
    receita !== "" ||
    contribuicaoFundo !== "" ||
    situacao !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="tipo-veiculo"
        hideSearch
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
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
              Item de Receita
            </h1>
            <button
              onClick={() =>
                onNavigate("adicionar-item-receita")
              }
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusItemReceita || itemReceita
                    ? "top-1 text-[10px] text-gray-400 font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                  }`}
              >
                Item de Receita
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={itemReceita}
                  onFocus={() => setFocusItemReceita(true)}
                  onBlur={() => setFocusItemReceita(false)}
                  onChange={(e) =>
                    setItemReceita(e.target.value)
                  }
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

          {showFilters && (
            <div className="animate-fadeIn flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                {/* <FloatSelect
                  label="Unidade de Medida"
                  value={unidadeMedida}
                  onChange={setUnidadeMedida}
                  options={UNIDADES_MEDIDA}
                /> */}
                <EntitySearchInput
                  label="Unidade de Medida"
                  placeholder="Buscar por unidade de medida"
                  value={unidadeMedida ? unidadeMedida : ""}
                  data={UNIDADES_MEDIDA_ENTIDADE}
                  searchKeys={["nome", "sigla", "descricao"]}
                  columns={[
                    { label: "Unidade de Medida", key: "sigla" },
                    { label: "Descrição", key: "nome" },
                  ]}
                  icon={<Ruler size={18} color={GREEN} />}
                  title="Buscar Unidade de Medida"
                  subtitle="Busque por uma unidade de medida:"
                  onChange={(ent) => {
                    setUnidadeMedida(ent.nome);
                  }}
                />
              </div>
              <div className="w-full lg:flex-1">
                {/* <FloatSelect
                  label="Receita"
                  value={receita}
                  onChange={setReceita}
                  options={RECEITAS_ENTIDADE_INPUT}
                /> */}
                <EntitySearchInput
                  label="Receitas"
                  placeholder="Buscar por receita"
                  value={receita ? receita : ""}
                  data={RECEITAS_ENTIDADE}
                  searchKeys={["nome", "sigla", "descricao"]}
                  columns={[
                    { label: "Nome", key: "nome" },
                    {
                      label: "Unidade de Medida",
                      key: "unidadeMedida",
                    },
                    { label: "Descrição", key: "descricao" },
                  ]}
                  icon={<FileText size={18} color={GREEN} />}
                  title="Buscar Receita"
                  subtitle="Busque por uma receita cadastrada:"
                  onChange={(ent) => {
                    setReceita(ent.nome);
                  }}

                />
              </div>
              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Contribuição ao Fundo"
                  value={contribuicaoFundo}
                  onChange={setContribuicaoFundo}
                  options={CONTRIBUICAO_FUNDO}
                />
              </div>
              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={SITUACOES}
                />
              </div>
              <button
                onClick={handlePesquisar}
                className="h-12 w-full lg:w-fit px-5 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {unidadeMedida && (
                <Chip
                  label={`Unidade de Medida: ${unidadeMedida}`}
                  onRemove={() => setUnidadeMedida("")}
                />
              )}
              {receita && (
                <Chip
                  label={`Receita: ${receita}`}
                  onRemove={() => setReceita("")}
                />
              )}
              {contribuicaoFundo && (
                <Chip
                  label={`Contribuição ao Fundo: ${contribuicaoFundo}`}
                  onRemove={() => setContribuicaoFundo("")}
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

          {hasSearched && (
            <div className="border-t border-gray-100 my-1" />
          )}

          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por um item de receita utilizando o campo
                de busca e os filtros acima.
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
                    <tr className="border-b border-gray-300">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Item da Receita
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Unidade de Medida
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Receita
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Contribuição ao Fundo
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-normal uppercase">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.itemReceita}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.unidadeMedida}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.receita}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.contribuicaoFundo}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          {t.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
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