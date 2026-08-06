import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye as ViewIcon,
  Pencil,
  X,
  Check,
  Ban,
  Dna,
  Syringe,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, SearchModal, FloatInput } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";
const MOCK_KEY = "AUTORIZACOES_VACINA_DB";

// ==========================================================
// MOCKS DOS FILTROS (Mantidos para o funcionamento dos inputs)
// ==========================================================
const ESTABELECIMENTOS_MOCK = [
  { id: 1, codigo: "31234567891", nome: "Fazenda do Rio", municipio: "Lavras - MG", proprietario: "555.009.956-40\n- José Aarão Neto" },
  { id: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", proprietario: "444.009.956-40\n- Divino de Souza Sobrinho" },
  { id: 3, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG", proprietario: "56.338.814/0001-95\n- Agropecuária Vale Verde Ltda." },
];

interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, codigo: "ESP-003", nome: "Caprino", grupo: "Caprinos" },
  { id: 4, codigo: "ESP-004", nome: "Ovino", grupo: "Ovinos" },
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose", oficial: true },
  { id: 2, nome: "Febre Aftosa", oficial: true },
  { id: 3, nome: "Raiva", oficial: false },
  { id: 4, nome: "Clostridiose", oficial: false },
];

const TIPOS_VACINA = [
  { value: "Oficial", label: "Oficial" },
  { value: "Complementar", label: "Complementar" },
];

const SITUACOES = [
  { value: "Gravada", label: "Gravada" },
  { value: "Cancelada", label: "Cancelada" },
];

// Helper Visual para os Filtros Ativos
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

const fmtData = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const [a, m, d] = iso.split("-");
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

export function AutorizacaoVacinacaoPage({ onLogout, onNavigate }: any) {
  // Inicializando a Base de Dados (Inicia 100% vazia se não houver dados salvos)
  const [database, setDatabase] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MOCK_KEY);
    if (stored) {
      setDatabase(JSON.parse(stored));
    } else {
      setDatabase([]); // Garante que a lista inicie completamente vazia
    }
  }, []);

  // Campos de Filtro
  const [busca, setBusca] = useState("");
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [especie, setEspecie] = useState<any | null>(null);
  const [doenca, setDoenca] = useState<any | null>(null);
  const [tipoVacina, setTipoVacina] = useState("");
  const [situacao, setSituacao] = useState("");

  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const tipoVacinaDisponivel = !!doenca?.oficial;
  const temFiltroAtivo = busca || produtor || estabelecimento || especie || doenca || tipoVacina || situacao;

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const databaseFiltrada = PRODUTORES_MOCK.filter((p) => {
    if (!tipoPessoa) return true;
    return p.tipo === tipoPessoa;
  });

  // Filtra sobre a DATABASE DO LOCALSTORAGE que agora inicia vazia
  const filtrados = database.filter((e) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca =
      termo === "" ||
      [e.produtorNome, e.produtorDoc, e.estabCodigo, e.estabNome, e.especie, e.doenca, e.etapa]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    const matchProdutor = !produtor || e.produtorDoc === produtor.documento;
    const matchEstab = !estabelecimento || e.estabCodigo === estabelecimento.codigo;
    const matchEspecie = !especie || e.especie === especie.nome;
    const matchDoenca = !doenca || e.doenca === doenca.nome;
    const matchTipo = tipoVacina === "" || e.tipoVacina === tipoVacina;
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchBusca && matchProdutor && matchEstab && matchEspecie && matchDoenca && matchTipo && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="autorizacao-vacina" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Autorização de Vacinação</h1>
            <button onClick={() => onNavigate("adicionar-autorizacao-vacinacao")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="animate-fadeIn flex flex-col gap-3 w-full">
            <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <FloatInput
                  label="Produtor"
                  value={produtor ? produtor.nome : ""} 
                  icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} 
                  onClick={() => setModalProdutor(true)}
                  readOnly
                />         
              </div>
              <div className="w-full lg:flex-1">
                <EntitySearchInput
                  label="Estabelecimento Agropecuário"
                  placeholder="Buscar por código, nome, município ou proprietário."
                  value={estabelecimento ? `${estabelecimento.nome}` : ""}
                  data={ESTABELECIMENTOS_MOCK}
                  searchKeys={["codigo", "nome", "municipio", "proprietario"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Estabelecimento", key: "nome" },
                    { label: "Município", key: "municipio" },
                    { label: "Proprietário", key: "proprietario" },
                  ]}
                  icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento Agropecuário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                  title="Buscar"
                  subtitle="Busque por um estabelecimento cadastrado:"
                  onChange={(ent) => setEstabelecimento(ent)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full items-end">
              <EntitySearchInput
                label="Espécie"
                placeholder="Buscar por nome da espécie"
                value={especie ? especie.nome : ""}
                data={ESPECIES_MOCK}
                searchKeys={["nome", "grupo"]}
                columns={[
                  { label: "Espécie", key: "nome" },
                  { label: "Grupo", key: "grupo" },
                ]}
                icon={<Dna size={18} color={GREEN} />}
                title="Buscar Espécie"
                subtitle="Busque por uma espécie cadastrada:"
                onChange={(ent) => setEspecie(ent)}
              />
              <EntitySearchInput
                label="Doença"
                placeholder="Buscar pelo nome da doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                title="Buscar Doença"
                subtitle="Buscar por doença cadastrada:"
                onChange={(ent) => { 
                  setDoenca(ent); 
                  setTipoVacina("");
                }}
              />
              {doenca && (
                <div className="animate-fadeIn">
                  <FloatSelect
                    label="Tipo de Vacinação"
                    value={tipoVacina}
                    onChange={setTipoVacina}
                    disabled={!tipoVacinaDisponivel}
                    options={TIPOS_VACINA}
                  />
                </div>
              )}
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
            </div>
          </div>

          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {produtor && <Chip label={`Produtor: ${produtor.nome}`} onRemove={() => setProdutor(null)} />}
              {estabelecimento && <Chip label={`Estab.: ${estabelecimento.nome}`} onRemove={() => setEstabelecimento(null)} />}
              {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}
              {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => { setDoenca(null); setTipoVacina(""); }} />}
              {tipoVacina && <Chip label={`Tipo de Vacina: ${tipoVacina}`} onRemove={() => setTipoVacina("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por autorização de vacinação utilizando os filtros acima.</p>
            </div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-20 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[170px]">Produtor</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[180px]">Estabelecimento Agropecuário</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[100px]">Espécie</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Doença</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Tipo de Vacina</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Etapa de Vacinação</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[110px]">Data da Autorização</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 uppercase whitespace-normal max-w-[100px]">Situação</th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{e.produtorDoc}</div>
                          <div>{e.produtorNome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{e.estabCodigo}</div>
                          <div>{e.estabNome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.especie}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.doenca}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.tipoVacina || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.etapa}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{fmtData(e.dataAutorizacao)}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.situacao}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => {
                              localStorage.setItem("CURRENT_AUTORIZACAO_ID", e.id.toString());
                              onNavigate("visualizar-autorizacao-vacinacao", e);
                            }} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar">
                              <ViewIcon size={18} />
                            </button>
                            <button onClick={() => {
                              localStorage.setItem("CURRENT_AUTORIZACAO_ID", e.id.toString());
                              onNavigate("editar-autorizacao-vacinacao", e);
                            }} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar">
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
      
      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => { setModalProdutor(false); setTipoPessoa(""); }}
        title="Buscar Produtor"
        subtitle="Busque por um produtor cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />}
        data={databaseFiltrada}
        columns={[{ label: "Nome", key: "nome" }, { label: "Documento", key: "documento" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => { setProdutor(p); setModalProdutor(false); setTipoPessoa(""); }}
        headerActions={<FloatSelect label="Tipo de Pessoa" required value={tipoPessoa} onChange={(v) => setTipoPessoa(v)} options={[{ value: "PF", label: "Pessoa Física" }, { value: "PJ", label: "Pessoa Jurídica" }]} />}
      />
    </div>
  );
}

export default AutorizacaoVacinacaoPage;