import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Plus,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { FloatSelect } from "../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// --- Tipos ---

export interface ValorIndice {
  id: string;
  indiceId: string;
  valor: number;
  ano: number;
  situacao: "Ativo" | "Agendado" | "Inativo";
}

export interface IndiceItem {
  id: string;
  nome: string;
  situacao: "Ativo" | "Inativo";
  valores?: ValorIndice[];
}

// --- Dados MOCK ---

const MOCK_INDICES: IndiceItem[] = [
  { id: "1", nome: "UFEMG", situacao: "Ativo" },
  { id: "2", nome: "SELIC", situacao: "Ativo" },
  { id: "3", nome: "IPCA", situacao: "Ativo" },
  { id: "4", nome: "IGP-M", situacao: "Inativo" },
];

const INDICES_OPCOES = [
  { value: "UFEMG", label: "UFEMG" },
  { value: "SELIC", label: "SELIC" },
  { value: "IPCA", label: "IPCA" },
  { value: "IGP-M", label: "IGP-M" },
];

const SITUACOES_OPCOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// --- Subcomponente Chip ---

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0">
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
}

// --- Props ---

interface IndiceProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function Indice({ onLogout, onNavigate }: IndiceProps) {
  const [nomeIndice, setNomeIndice] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [focusNome, setFocusNome] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = MOCK_INDICES.filter((item) => {
    const matchNome =
      nomeIndice.trim() === "" ||
      item.nome.toLowerCase().includes(nomeIndice.trim().toLowerCase());
    const matchSituacao =
      situacaoFiltro === "" || item.situacao === situacaoFiltro;
    return matchNome && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = nomeIndice.trim() !== "" || situacaoFiltro !== "";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="indice"
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
            <h1 className="text-2xl font-semibold text-gray-900">Índice</h1>
            <button
              onClick={() => onNavigate("adicionar-indice")}
              className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98] flex items-center gap-2"
              style={{ backgroundColor: GREEN }}
            >
              Adicionar Novo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          {/* Campo de Busca Principal + Botão de Filtro */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  focusNome || nomeIndice
                    ? "top-1 text-[10px] text-gray-400 font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }`}
              >
                Nome do Índice
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={nomeIndice}
                  onFocus={() => setFocusNome(true)}
                  onBlur={() => setFocusNome(false)}
                  onChange={(e) => setNomeIndice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
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

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Índice"
                  value={nomeIndice}
                  onChange={setNomeIndice}
                  options={INDICES_OPCOES}
                />
              </div>
              <div className="w-full lg:flex-1">
                <FloatSelect
                  label="Situação"
                  value={situacaoFiltro}
                  onChange={setSituacaoFiltro}
                  options={SITUACOES_OPCOES}
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

          {/* Chips dos Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {nomeIndice && (
                <Chip
                  label={`Índice: ${nomeIndice}`}
                  onRemove={() => setNomeIndice("")}
                />
              )}
              {situacaoFiltro && (
                <Chip
                  label={`Situação: ${situacaoFiltro}`}
                  onRemove={() => setSituacaoFiltro("")}
                />
              )}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* Tabela de Resultados */}
          {!hasSearched ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">
                Busque por um índice utilizando o campo de busca e os filtros acima.
              </p>
            </div>
          ) : total === 0 ? (
            <div className="py-5 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                        Índice
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">
                        Situação
                      </th>
                      <th className="px-4 py-3 w-[100px] text-right font-semibold text-gray-600 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.nome}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.situacao === "Ativo"
                                ? "bg-green-50 text-[#1A7A3C] border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {item.situacao}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onNavigate("visualizar-indice", item)}
                              className="p-2 rounded-md hover:bg-green-50 transition"
                              style={{ color: GREEN }}
                              title="Visualizar"
                            >
                              <ViewIcon size={18} />
                            </button>
                            <button
                              onClick={() => onNavigate("adicionar-indice", item)}
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
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageAtual === 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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