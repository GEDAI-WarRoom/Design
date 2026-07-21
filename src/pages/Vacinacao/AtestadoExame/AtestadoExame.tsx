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
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// MOCKS DE DOENÇAS PARA O SEARCH
const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose" },
  { id: 2, nome: "Febre Aftosa" },
  { id: 3, nome: "Anemia Infecciosa Equina (AIE)" },
  { id: 4, nome: "Raiva" },
];

// MOCKS DE ENTIDADE 
const ATESTADOS_MOCK = [
  { id: 1, descricao: "Atestado de Brucelose", doenca: "Brucelose", situacao: "Ativo" },
  { id: 2, descricao: "Atestado de Febre Aftosa", doenca: "Febre Aftosa", situacao: "Inativo" },
  { id: 3, descricao: "Atestado de Anemia Infecciosa Equina", doenca: "Anemia Infecciosa Equina (AIE)", situacao: "Ativo" },
  { id: 4, descricao: "Atestado de Raiva", doenca: "Raiva", situacao: "Ativo" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AtestadoExamePage({ onLogout, onNavigate }: PageProps) {
  const [descricao, setDescricao] = useState("");
  const [doenca, setDoenca] = useState<any | null>(null);
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusDescricao, setFocusDescricao] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handlePesquisar = () => {
    if (!descricao && !temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = ATESTADOS_MOCK.filter((a) => {
    const matchDescricao = descricao === "" || a.descricao.toLowerCase().includes(descricao.toLowerCase());
    const matchDoenca = !doenca || a.doenca.trim() === doenca.nome.trim();
    const matchSituacao = situacao === "" || a.situacao === situacao;
    return matchDescricao && matchDoenca && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = doenca || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Atestado de Exame</h1>
            <button onClick={() => onNavigate("adicionar-atestado-exame")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* CONTAINER BRANCO ÚNICO */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

          {/* Barra Superior do Filtro */}
          <div className="flex gap-3 items-stretch w-full">
            <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]">
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusDescricao || descricao ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Descrição do atestado
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={descricao}
                  onFocus={() => setFocusDescricao(true)}
                  onBlur={() => setFocusDescricao(false)}
                  onChange={(e) => setDescricao(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisar()}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none h-6"
                />
                <Search size={15} className="text-gray-400 ml-2 flex-shrink-0 mb-0.5" />
              </div>
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="px-4 border rounded-md flex items-center justify-center transition flex-shrink-0 font-medium text-sm" style={{ backgroundColor: showFilters ? "transparent" : GREEN, borderColor: GREEN, color: showFilters ? GREEN : "#ffffff" }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Filtros Internos Avançados */}
          {showFilters && (
            <div className="animate-fadeIn flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <EntitySearchInput
                  label="Doença"
                  placeholder="Selecione uma doença..."
                  value={doenca ? doenca.nome : ""}
                  data={DOENCAS_MOCK}
                  searchKeys={["nome"]}
                  columns={[{ label: "Nome da Doença", key: "nome" }]}
                  title="Buscar Doença"
                  subtitle="Busque por uma doença cadastrada:"
                  icon={
                    <img
                      src={Icons.iconeDoencaUrl || (Icons as any).iconedoencaurl}
                      alt="Doença"
                      className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0"
                    />
                  }
                  hideEye={true}
                  onChange={(entidade) => setDoenca(entidade)}
                />
              </div>

              <div className="w-full lg:w-1/4">
                <FloatSelect
                  label="Situação"
                  value={situacao}
                  onChange={setSituacao}
                  options={SITUACOES}
                />
              </div>

              {/* Botão Pesquisar Compacto */}
              <button
                onClick={handlePesquisar}
                className="h-12 w-full lg:w-fit px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90 flex items-center justify-center whitespace-nowrap"
                style={{ backgroundColor: GREEN }}
              >
                Pesquisar
              </button>
            </div>
          )}

          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {/* Chips de Filtros Ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* Linha Divisória sutil */}
          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {/* ÁREA DE RESULTADOS */}
          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por atestados utilizando o campo de busca e os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Descrição do atestado</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Doença</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase">Situação</th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-4 text-gray-700 text-sm font-medium">{item.descricao}</td>
                        <td className="px-4 py-4 text-gray-500 text-sm">{item.doenca}</td>
                        <td className="px-4 py-4 text-gray-500 text-sm">{item.situacao}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-atestado-exame", item)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-atestado-exame", item)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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
                  <span>{inicio} - {fim} de {total}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageAtual === 1} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageAtual === totalPages} className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"><ChevronRight size={18} /></button>
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