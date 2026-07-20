import { useState } from "react";
import { ArrowLeft, Building2, Calendar, ChevronLeft, ChevronRight, Eye, Search, SlidersHorizontal, UserRound, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput } from "../../../components/ui/FormKit";
import {
  ESTABELECIMENTOS_VENDA_PROPRIEDADE,
  formatarData,
  formatarEstabelecimento,
  listarVendasPropriedade,
  PESSOAS_VENDA_PROPRIEDADE,
  PROPRIETARIOS_VENDA_PROPRIEDADE,
  type EstabelecimentoVendaPropriedade,
  type PessoaVendaPropriedade,
  type VendaPropriedade,
} from "./vendaPropriedadeData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const pessoaColumns = [
  { label: "Nome / Razão Social", key: "nome" },
  { label: "CPF / CNPJ", key: "documento" },
];

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button type="button" onClick={onRemove} className="flex-shrink-0 hover:opacity-80" aria-label={`Remover filtro ${label}`}>
        <X size={14} />
      </button>
    </div>
  );
}

export function VendaPropriedadePage({ onLogout, onNavigate }: PageProps) {
  const [vendedor, setVendedor] = useState<PessoaVendaPropriedade | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoVendaPropriedade | null>(null);
  const [comprador, setComprador] = useState<PessoaVendaPropriedade | null>(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [resultados, setResultados] = useState<VendaPropriedade[] | null>(null);
  const [erro, setErro] = useState("");
  const [maisBuscasAberto, setMaisBuscasAberto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const pesquisar = () => {
    if (dataInicial && dataFinal && dataInicial >= dataFinal) {
      setErro("A data inicial deve ser anterior à data final.");
      setResultados(null);
      return;
    }

    const encontrados = listarVendasPropriedade().filter((venda) => (
      (!vendedor || venda.vendedor.id === vendedor.id)
      && (!estabelecimento || venda.estabelecimento.id === estabelecimento.id)
      && (!comprador || venda.comprador.id === comprador.id)
      && (!dataInicial || venda.dataVenda >= dataInicial)
      && (!dataFinal || venda.dataVenda <= dataFinal)
    ));

    setErro("");
    setResultados(encontrados);
    setPagina(1);
  };

  const total = resultados?.length ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = total ? (paginaAtual - 1) * itensPorPagina + 1 : 0;
  const fim = Math.min(paginaAtual * itensPorPagina, total);
  const linhas = resultados?.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina) ?? [];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="venda-propriedade" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C] hover:opacity-70 transition"
          >
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Venda de Propriedade</h1>
            <button
              type="button"
              onClick={() => onNavigate("adicionar-venda-propriedade")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] transition"
            >
              Adicionar Nova
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="flex-1">
              <EntitySearchInput
                label="Nome do Vendedor"
                placeholder="Buscar por nome ou razão social"
                value={vendedor?.nome ?? ""}
                data={PROPRIETARIOS_VENDA_PROPRIEDADE}
                searchKeys={["nome", "documento"]}
                columns={pessoaColumns}
                icon={<UserRound size={18} />}
                title="Buscar Vendedor"
                subtitle="Busque por um proprietário cadastrado no sistema:"
                onChange={setVendedor}
              />
            </div>
            <button
              type="button"
              onClick={() => setMaisBuscasAberto((aberto) => !aberto)}
              className={`h-12 w-12 border rounded-md flex items-center justify-center flex-shrink-0 transition ${maisBuscasAberto ? "bg-white text-[#1A7A3C]" : "bg-[#1A7A3C] text-white"}`}
              style={{ borderColor: "#1A7A3C" }}
              aria-expanded={maisBuscasAberto}
              aria-label={maisBuscasAberto ? "Ocultar buscas adicionais" : "Exibir buscas adicionais"}
              title={maisBuscasAberto ? "Ocultar buscas adicionais" : "Exibir buscas adicionais"}
            >
              <SlidersHorizontal size={16} />
            </button>
            <button
              type="button"
              onClick={pesquisar}
              className="h-12 px-5 rounded-md text-white text-sm font-semibold bg-[#1A7A3C] hover:bg-[#15612F] flex items-center justify-center gap-2 transition"
            >
              <Search size={16} /> Pesquisar
            </button>
          </div>

          {maisBuscasAberto && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end animate-fadeIn">
              <EntitySearchInput
                label="Estabelecimento Agropecuário"
                placeholder="Buscar por código ou nome"
                value={estabelecimento ? formatarEstabelecimento(estabelecimento) : ""}
                data={ESTABELECIMENTOS_VENDA_PROPRIEDADE}
                searchKeys={["codigo", "nome"]}
                columns={[
                  { label: "Código", key: "codigo" },
                  { label: "Estabelecimento", key: "nome" },
                  { label: "Município", key: "municipio" },
                ]}
                icon={<Building2 size={18} />}
                title="Buscar Estabelecimento Agropecuário"
                subtitle="Busque por um estabelecimento agropecuário cadastrado no sistema:"
                onChange={setEstabelecimento}
              />

              <EntitySearchInput
                label="Comprador"
                placeholder="Buscar por nome ou razão social"
                value={comprador?.nome ?? ""}
                data={PESSOAS_VENDA_PROPRIEDADE}
                searchKeys={["nome", "documento"]}
                columns={pessoaColumns}
                icon={<UserRound size={18} />}
                title="Buscar Comprador"
                subtitle="Busque por uma pessoa cadastrada no sistema:"
                onChange={setComprador}
              />

              <FloatInput label="Data Inicial" value={dataInicial} onChange={setDataInicial} type="date" icon={<Calendar size={18} />} />
              <FloatInput label="Data Final" value={dataFinal} onChange={setDataFinal} type="date" icon={<Calendar size={18} />} />
            </div>
          )}

          {(vendedor || estabelecimento || comprador || dataInicial || dataFinal) && (
            <div className="flex flex-wrap gap-2">
              {vendedor && <Chip label={`Vendedor: ${vendedor.nome}`} onRemove={() => setVendedor(null)} />}
              {estabelecimento && <Chip label={`Estabelecimento: ${formatarEstabelecimento(estabelecimento)}`} onRemove={() => setEstabelecimento(null)} />}
              {comprador && <Chip label={`Comprador: ${comprador.nome}`} onRemove={() => setComprador(null)} />}
              {dataInicial && <Chip label={`Data inicial: ${formatarData(dataInicial)}`} onRemove={() => setDataInicial("")} />}
              {dataFinal && <Chip label={`Data final: ${formatarData(dataFinal)}`} onRemove={() => setDataFinal("")} />}
            </div>
          )}

          {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}

          {resultados === null ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Busque por uma venda de propriedade utilizando os filtros acima.
            </div>
          ) : resultados.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Vendedor", "Estabelecimento Agropecuário", "Comprador", "Data da Venda"].map((titulo) => (
                      <th key={titulo} className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">{titulo}</th>
                    ))}
                    <th className="px-4 py-3 w-16" aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((venda) => (
                    <tr key={venda.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                      <td className="px-4 py-3 text-gray-700">{venda.vendedor.nome}</td>
                      <td className="px-4 py-3 text-gray-700">{formatarEstabelecimento(venda.estabelecimento)}</td>
                      <td className="px-4 py-3 text-gray-700">{venda.comprador.nome}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatarData(venda.dataVenda)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate("visualizar-venda-propriedade", venda)}
                          className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {itensPorPagina}</span>
                <div className="flex items-center gap-3">
                  <span>{inicio} - {fim} de {total}</span>
                  <button type="button" onClick={() => setPagina((valor) => Math.max(1, valor - 1))} disabled={paginaAtual === 1} className="p-1 disabled:opacity-30">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))} disabled={paginaAtual === totalPaginas} className="p-1 disabled:opacity-30">
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
