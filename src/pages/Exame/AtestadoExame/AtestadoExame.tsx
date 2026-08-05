import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Eye as ViewIcon, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { listarAtestadosExame } from "./atestadoExameData";

const GREEN = "#1A7A3C";

export function AtestadoExamePage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; }) {
  const [busca, setBusca] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Lê do Mock Centralizado
  const filtrados = listarAtestadosExame().filter((r) => {
    return !busca || r.numero?.toLowerCase().includes(busca.toLowerCase()) || r.descricao?.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />
      <main className="max-w-[1300px] mx-auto px-6 py-6">
        <div className="mb-6">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm text-[#1A7A3C] font-semibold mb-3 hover:opacity-70">
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Atestado de Exame</h1>
            <button onClick={() => onNavigate("adicionar-atestado-exame")} className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:opacity-90 shadow-sm">
              Adicionar Novo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1 border border-gray-300 rounded-md px-3 h-12 flex items-center bg-white focus-within:border-[#1A7A3C] transition-all">
              <input type="text" placeholder="Buscar por Número ou Descrição" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setHasSearched(true)} className="w-full h-full text-sm outline-none" />
              <Search size={18} className="text-gray-400" />
            </div>
            <button onClick={() => setHasSearched(true)} className="px-6 h-12 bg-[#1A7A3C] text-white rounded-md font-semibold text-sm hover:opacity-90">Pesquisar</button>
          </div>

          {hasSearched && (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-600 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Número / Descrição</th>
                    <th className="px-4 py-3">Dias de Validade</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.numero || r.descricao}</td>
                      <td className="px-4 py-3 text-gray-600">{r.diasValidade || r.data}</td>
                      <td className="px-4 py-3 text-gray-600">{r.situacao}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* PASSANDO O 'r' AQUI PARA PREENCHER A TELA */}
                          <button onClick={() => onNavigate("visualizar-atestado-exame", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Visualizar">
                            <ViewIcon size={18} />
                          </button>
                          <button onClick={() => onNavigate("editar-atestado-exame", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Editar">
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