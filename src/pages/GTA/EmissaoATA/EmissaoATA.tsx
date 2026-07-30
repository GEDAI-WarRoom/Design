import { useState } from "react";
import { ArrowLeft, PlusCircle, Search, SlidersHorizontal, Eye as ViewIcon, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const MOCK_ATAS = [
  {
    id: "1",
    serie: "AR-123456",
    especie: "Bovino",
    finalidade: "Abate",
    estabelecimento: "31002030039 - Fazenda Rio das Ostras",
    procedencia: "550.134.236-88 - José Teixeira Guimarães",
    destinatario: "550.134.236-88 - João Bosco",
    dataEmissao: "20/03/2026",
    situacao: "Gravada",
  },
  {
    id: "2",
    serie: "AR-654321",
    especie: "Suíno",
    finalidade: "Cria",
    estabelecimento: "31002030040 - Granja São Paulo",
    procedencia: "111.222.333-44 - Marcos Silva",
    destinatario: "999.888.777-66 - Frigorífico Sul",
    dataEmissao: "21/03/2026",
    situacao: "Emitida",
  },
];

export function EmissaoATAPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const [busca, setBusca] = useState("");
  const [especie, setEspecie] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filtrados = MOCK_ATAS.filter((r) => {
    const b = busca.toLowerCase();
    return (
      (!busca || r.serie.toLowerCase().includes(b)) &&
      (!especie || r.especie === especie) &&
      (!finalidade || r.finalidade === finalidade) &&
      (!situacao || r.situacao === situacao)
    );
  });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="emissao-ata" hideSearch />
      <main className="max-w-[1300px] mx-auto px-6 py-6">
        <div className="mb-6">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm text-[#1A7A3C] font-semibold mb-3 hover:opacity-70">
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Emissão de ATA</h1>
            <button onClick={() => onNavigate("adicionar-emissao-ata")} className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:opacity-90 shadow-sm flex items-center gap-2">
              <PlusCircle size={18} /> Nova ATA
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1 border border-gray-300 rounded-md px-3 h-12 flex items-center bg-white focus-within:border-[#1A7A3C] transition-all">
              <input
                type="text"
                placeholder="Série - Número da ATA"
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
              <FloatSelect label="Espécie" value={especie} onChange={setEspecie} options={[{ value: "Bovino", label: "Bovino" }, { value: "Suíno", label: "Suíno" }]} />
              <FloatSelect label="Finalidade" value={finalidade} onChange={setFinalidade} options={[{ value: "Abate", label: "Abate" }, { value: "Cria", label: "Cria" }]} />
              <FloatInput type="date" label="Data da Emissão" value="" onChange={() => {}} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={[{ value: "Gravada", label: "Gravada" }, { value: "Paga", label: "Paga" }, { value: "Emitida", label: "Emitida" }, { value: "Cancelada", label: "Cancelada" }]} />
              <div className="md:col-span-4 flex justify-end">
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
                    <th className="px-4 py-3">Série - Número</th>
                    <th className="px-4 py-3">Espécie</th>
                    <th className="px-4 py-3">Finalidade</th>
                    <th className="px-4 py-3">Estabelecimento</th>
                    <th className="px-4 py-3">Procedência</th>
                    <th className="px-4 py-3">Destinatário</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{r.serie}</td>
                      <td className="px-4 py-3 text-gray-600">{r.especie}</td>
                      <td className="px-4 py-3 text-gray-600">{r.finalidade}</td>
                      <td className="px-4 py-3 text-gray-600">{r.estabelecimento}</td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{r.procedencia}</td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{r.destinatario}</td>
                      <td className="px-4 py-3 text-gray-600">{r.dataEmissao}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.situacao === "Emitida" ? "bg-green-100 text-green-700" : r.situacao === "Gravada" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                          {r.situacao}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onNavigate("visualizar-emissao-ata", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md">
                            <ViewIcon size={18} />
                          </button>
                          {r.situacao === "Gravada" && (
                            <button onClick={() => onNavigate("editar-emissao-ata", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md">
                              <Pencil size={18} />
                            </button>
                          )}
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