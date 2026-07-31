import { useState } from "react";
import { ArrowLeft, PlusCircle, Search, SlidersHorizontal, Eye as ViewIcon, Pencil, Dna, Route, Calendar } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatInput } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { NucleoInput } from "../../../components/ui/EntitySearch";

// IMPORTAÇÃO UNIFICADA DOS ÍCONES
import * as Icons from "../../../imports/icons";

// MOCKS
const ESPECIES_MOCK = [
  { id: 1, nome: "Bovino", grupoEspecie: "Bovídeos" },
  { id: 2, nome: "Bubalino", grupoEspecie: "Bovídeos" },
  { id: 3, nome: "Suíno", grupoEspecie: "Suídeos" },
  { id: 4, nome: "Galinha", grupoEspecie: "Aves" },
  { id: 5, nome: "Equino", grupoEspecie: "Equídeos" },
];

const FINALIDADES_MOCK = [
  { id: 1, nome: "Atendimento veterinário" },
  { id: 2, nome: "Cria" },
  { id: 3, nome: "Engorda" },
  { id: 4, nome: "Exportação" },
  { id: 5, nome: "Pesquisa" },
  { id: 6, nome: "Quarentena" },
  { id: 7, nome: "Recria" },
  { id: 8, nome: "Reprodução" },
  { id: 9, nome: "Tratamento veterinário" },
];

const MOCK_ATAS = [
  {
    id: "1",
    serie: "AR-123456",
    especie: "Bovino",
    finalidade: "Atendimento veterinário",
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
  const [dataEmissao, setDataEmissao] = useState("");

  // Responsáveis
  const [responsavelProcedencia, setResponsavelProcedencia] = useState("");
  const [responsavelDestino, setResponsavelDestino] = useState("");

  // Filtros Agropecuários
  const [estabelecimento, setEstabelecimento] = useState("");
  const [exploracao, setExploracao] = useState("");
  const [nucleo, setNucleo] = useState("");
  const [situacao, setSituacao] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auxiliar para formatar campos que contêm "CPF/CNPJ - Nome" com quebra de linha
  const formatNomeCpf = (texto: string) => {
    if (!texto) return "-";
    const partes = texto.split(" - ");
    if (partes.length > 1) {
      return (
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-normal">{partes[0]}</span>
          <span className="font-normal text-gray-500 truncate max-w-[180px]">{partes.slice(1).join(" - ")}</span>
        </div>
      );
    }
    return <span className="text-gray-700">{texto}</span>;
  };

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
              Adicionar ATA
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6 animate-fadeIn items-end">

              {/* Linha 1 */}
              <EntitySearchInput
                label="Espécie"
                placeholder="Buscar Espécie..."
                value={especie}
                data={ESPECIES_MOCK}
                columns={[
                  { label: "Espécie", key: "nome" },
                  { label: "Grupo de Espécie", key: "grupoEspecie" }
                ]}
                searchKeys={["nome", "grupoEspecie"]}
                onChange={(e) => setEspecie(e.nome)}
                icon={<Dna size={18} className="text-[#1A7A3C]" />}
              />

              <EntitySearchInput
                label="Finalidade de Trânsito"
                placeholder="Buscar Finalidade..."
                value={finalidade}
                data={FINALIDADES_MOCK}
                columns={[{ label: "Finalidade", key: "nome" }]}
                searchKeys={["nome"]}
                onChange={(e) => setFinalidade(e.nome)}
                icon={<Route size={18} className="text-[#1A7A3C]" />}
              />

              <EntitySearchInput
                label="Responsável de Procedência"
                placeholder="Buscar Responsável..."
                value={responsavelProcedencia}
                data={[]}
                columns={[{ label: "Nome/CPF/CNPJ", key: "nome" }]}
                searchKeys={["nome"]}
                onChange={(e) => setResponsavelProcedencia(e.nome)}
                icon={<img src={Icons.iconeFornecedorUrl} alt="Responsável Procedência" className="w-5 h-5 object-contain" />}
              />

              <EntitySearchInput
                label="Responsável de Destino"
                placeholder="Buscar Responsável..."
                value={responsavelDestino}
                data={[]}
                columns={[{ label: "Nome/CPF/CNPJ", key: "nome" }]}
                searchKeys={["nome"]}
                onChange={(e) => setResponsavelDestino(e.nome)}
                icon={<img src={Icons.iconeDestinatarioUrl} alt="Responsável Destino" className="w-5 h-5 object-contain" />}
              />

              {/* Linha 2 */}
              <EntitySearchInput
                label="Estabelecimento Agropecuário"
                placeholder="Buscar Estabelecimento..."
                value={estabelecimento}
                data={[]}
                columns={[{ label: "Estabelecimento", key: "nome" }]}
                searchKeys={["nome"]}
                onChange={(e) => setEstabelecimento(e.nome)}
                icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento" className="w-5 h-5 object-contain" />}
              />

              <EntitySearchInput
                label="Exploração Pecuária"
                placeholder="Buscar Exploração..."
                value={exploracao}
                data={[]}
                columns={[{ label: "Exploração", key: "nome" }]}
                searchKeys={["nome"]}
                onChange={(e) => setExploracao(e.nome)}
                icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração Pecuária" className="w-5 h-5 object-contain" />}
              />

              <NucleoInput
                value={nucleo}
                onChange={(e) => setNucleo(e.nome)}
                icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo" className="w-5 h-5 object-contain" />}
              />

              <FloatInput type="date" label="Data da Emissão" value={dataEmissao} icon={<Calendar size={18} className="text-[#1A7A3C]" />}
                onChange={setDataEmissao} />

              {/* Linha 3 */}
              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={setSituacao}
                options={[
                  { value: "Gravada", label: "Gravada" },
                  { value: "Paga", label: "Paga" },
                  { value: "Emitida", label: "Emitida" },
                  { value: "Cancelada", label: "Cancelada" }
                ]}
              />

              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={() => setHasSearched(true)}
                  className="px-8 h-12 bg-[#1A7A3C] text-white rounded-md font-semibold text-sm hover:opacity-90 shadow-sm w-full md:w-auto"
                >
                  Pesquisar
                </button>
              </div>

            </div>
          )}

          {hasSearched && (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Série - Número da ATA</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Espécie</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Finalidade de Transferência</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estabelecimento Agropecuário</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Procedência</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destinatário</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data de Emissão</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Situação</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtrados.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{r.serie}</td>
                      <td className="px-4 py-3 text-gray-600">{r.especie}</td>
                      <td className="px-4 py-3 text-gray-600">{r.finalidade}</td>
                      <td className="px-4 py-3 text-gray-600">{formatNomeCpf(r.estabelecimento)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatNomeCpf(r.procedencia)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatNomeCpf(r.destinatario)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.dataEmissao}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.situacao}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onNavigate("visualizar-emissao-ata", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition-colors">
                            <ViewIcon size={18} />
                          </button>
                          {r.situacao === "Gravada" && (
                            <button onClick={() => onNavigate("editar-emissao-ata", r)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md transition-colors">
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