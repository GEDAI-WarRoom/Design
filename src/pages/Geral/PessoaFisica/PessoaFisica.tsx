import { useState } from "react";
import { ArrowLeft, Eye as ViewIcon, Pencil, PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect } from "../../../components/ui/FormKit";
import { useMockDatabaseRevision } from "../../../mocks/useMockDatabase";
import { listarPessoasFisicas } from "./pessoaFisicaData";

const GREEN = "#1A7A3C";

export function PessoaFisicaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const databaseRevision = useMockDatabaseRevision();
  void databaseRevision;
  const pessoas = listarPessoasFisicas();
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filtrados = pessoas.filter((r) => {
    const b = busca.toLowerCase();
    return (
      (!busca || r.nome.toLowerCase().includes(b) || r.cpf.includes(b)) &&
      (!situacao || r.situacao === situacao)
    );
  });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch />
      <main className="max-w-[1300px] mx-auto px-6 py-6">
        <div className="mb-6">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm text-[#1A7A3C] font-semibold mb-3 hover:opacity-70">
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Pessoa Física</h1>
            <button onClick={() => onNavigate("adicionar-pessoa-fisica")} className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:opacity-90 shadow-sm flex items-center gap-2">
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1 border border-gray-300 rounded-md px-3 h-12 flex items-center bg-white focus-within:border-[#1A7A3C] transition-all">
              <input
                type="text"
                placeholder="Nome ou CPF"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-full text-sm outline-none"
              />
              <Search size={18} className="text-gray-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 border rounded-md flex items-center gap-2 ${showFilters ? "bg-transparent text-[#1A7A3C] border-[#1A7A3C]" : "bg-[#1A7A3C] text-white border-[#1A7A3C]"}`}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
              <div className="md:col-span-3 flex justify-end">
                <button onClick={() => setHasSearched(true)} className="px-6 h-12 bg-[#1A7A3C] text-white rounded-md font-semibold text-sm hover:opacity-90">
                  Pesquisar
                </button>
              </div>
            </div>
          )}

          {hasSearched && (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-600 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">CPF</th>
                    <th className="px-4 py-3">Município</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{r.cpf}</td>
                      <td className="px-4 py-3 text-gray-600">{r.correspondencia.municipio}</td>
                      <td className="px-4 py-3 text-gray-600">{r.situacao}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigate("visualizar-pessoa-fisica", { id: r.id })}
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                            title="Visualizar"
                          >
                            <ViewIcon size={18} />
                          </button>
                          <button
                            onClick={() => onNavigate("editar-pessoa-fisica", { id: r.id })}
                            className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
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
          )}
        </div>
      </main>
    </div>
  );
}
