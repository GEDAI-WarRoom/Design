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
  Check,
  Ban,
  Dna,
  Syringe,
  Layers,
  Boxes,
  Calendar
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import { useDemoUser } from "../../../contexts/DemoUserContext";

const GREEN = "#1A7A3C";
const MOCK_KEY = "DECLARACOES_VACINA_DB";

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

const ESTABELECIMENTOS_MOCK = [
  { id: 1, codigo: "31234567891", nome: "Fazenda do Rio", municipio: "Lavras - MG", proprietario: "555.009.956-40\n- José Aarão Neto" },
  { id: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", proprietario: "444.009.956-40\n- Divino de Souza Sobrinho" },
  { id: 3, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG", proprietario: "56.338.814/0001-95\n- Agropecuária Vale Verde Ltda." },
];

const EXPLORACOES_MOCK = [
  {
    id: 1,
    codigo: "3100104050003",
    especie: "Codorna",
    grupo: "Aves",
    estabCodigo: "10234567891",
    estabNome: "Fazenda do Rio",
    produtores: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }],
    estabelecimentoFormatado: "10234567891\n- Fazenda do Rio",
    grupoEspecieFormatado: "Aves - Codorna",
    produtoresFormatado: "555.009.956-40\n- José Aarão Neto",
  }
];

const NUCLEOS_MOCK = [
  {
    id: "n-1",
    codigo: "3100104070099",
    nome: "Núcleo Central Norte",
    nucleoCompleto: "10293-\nNúcleo Central Norte",
    estabelecimentoCompleto: "44021-\nFazenda Boa Vista",
    produtorCompleto: "123.456.789-00-\nJoão da Silva"
  }
];

const ESPECIES_MOCK = [
  { id: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, codigo: "ESP-002", nome: "Suíno", grupo: "Suídeos" },
];

const DOENCAS_MOCK = [
  { id: 1, nome: "Brucelose" },
  { id: 2, nome: "Febre Aftosa" },
];

const MUNICIPIOS_MG = [
  "Belo Horizonte", "Lavras", "Varginha",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Cancelado", label: "Cancelado" },
];

const TIPOS_DECLARACAO = [
  { value: "Vacina Oficial", label: "Vacina Oficial" },
  { value: "Vacina Complementar", label: "Vacina Complementar" },
];

interface DeclaracaoVacinacao {
  id: number;
  tipoDeclaracao: string;
  produtorNome: string;
  produtorDoc: string;
  estabCodigo: string;
  estabNome: string;
  exploracaoCodigo?: string;
  municipio: string;
  especie: string;
  doenca: string;
  dataVacinacao: string;
  situacao: "Ativo" | "Cancelado";
}

const carregarListaDeclaracoes = (): DeclaracaoVacinacao[] => {
  const stored = localStorage.getItem(MOCK_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function DeclaracaoVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  const { role } = useDemoUser();
  const produtorEhUsuario = role === "produtor";
  const [busca, setBusca] = useState("");
  const [tipoDeclaracao, setTipoDeclaracao] = useState("");
  const [produtor, setProdutor] = useState<any | null>(() => produtorEhUsuario ? PRODUTORES_MOCK[0] : null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [exploracao, setExploracao] = useState<any | null>(null);
  const [nucleo, setNucleo] = useState<any | null>(null);
  const [municipio, setMunicipio] = useState("");
  const [especie, setEspecie] = useState<any | null>(null);
  const [doenca, setDoenca] = useState<any | null>(null);
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");

  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [modalExploracao, setModalExploracao] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const [erroFiltro, setErroFiltro] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [declaracoesList] = useState<DeclaracaoVacinacao[]>(carregarListaDeclaracoes);

  const hoje = new Date().toISOString().slice(0, 10);
  const erroDeFuturo = periodoDe !== "" && periodoDe > hoje;
  const erroPeriodo = periodoDe !== "" && periodoAte !== "" && periodoAte < periodoDe;

  const temFiltroAtivo =
    Boolean(busca || tipoDeclaracao || produtor || estabelecimento || exploracao || nucleo ||
    municipio || especie || doenca || periodoDe || periodoAte || situacao);

  const handlePesquisar = () => {
    if (!temFiltroAtivo) {
      setErroFiltro(true);
      setHasSearched(false);
      return;
    }
    if (erroDeFuturo || erroPeriodo) return;
    setErroFiltro(false);
    setHasSearched(true);
    setPage(1);
  };

  const databaseFiltrada = PRODUTORES_MOCK.filter((p) => (!tipoPessoa ? true : p.tipo === tipoPessoa));

  const colunasModal =
    tipoPessoa === "PJ"
      ? [{ label: "Razão Social", key: "nome" }, { label: "CNPJ", key: "documento" }]
      : [{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }];

  const filtrados = declaracoesList.filter((e) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca =
      termo === "" ||
      [e.tipoDeclaracao, e.produtorNome, e.produtorDoc, e.estabCodigo, e.estabNome, e.especie, e.doenca]
        .join(" ").toLowerCase().includes(termo);
    const matchTipoDeclaracao = !tipoDeclaracao || e.tipoDeclaracao === tipoDeclaracao;
    const matchProdutor = !produtor || e.produtorDoc === produtor.documento;
    const matchProdutorUsuario = !produtorEhUsuario || e.produtorDoc === PRODUTORES_MOCK[0].documento;
    const matchEstab = !estabelecimento || e.estabCodigo === estabelecimento.codigo;
    const matchExplor = !exploracao || e.especie === exploracao.especie;
    const matchMunicipio = municipio === "" || e.municipio === municipio;
    const matchEspecie = !especie || e.especie === especie.nome;
    const matchDoenca = !doenca || e.doenca === doenca.nome;
    const matchDe = periodoDe === "" || e.dataVacinacao >= periodoDe;
    const matchAte = periodoAte === "" || e.dataVacinacao <= periodoAte;
    const matchSituacao = situacao === "" || e.situacao === situacao;
    return matchBusca && matchTipoDeclaracao && matchProdutor && matchProdutorUsuario && matchEstab && matchExplor && matchMunicipio &&
      matchEspecie && matchDoenca && matchDe && matchAte && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="declaracao-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Declaração de Vacinação</h1>
            <button onClick={() => onNavigate("adicionar-declaracao-vacinacao")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-95 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="animate-fadeIn flex flex-col gap-3 w-full">
            <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
              <div className="w-full lg:flex-1">
                <FloatSelect label="Tipo de Declaração" value={tipoDeclaracao} onChange={setTipoDeclaracao} options={TIPOS_DECLARACAO} />
              </div>
              {!produtorEhUsuario && <div className="w-full lg:flex-1">
                <FloatInput
                  label="Produtor"
                  value={produtor ? produtor.nome : ""}
                  icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />}
                  onClick={() => setModalProdutor(true)}
                  readOnly
                />
              </div>}

              <div className="w-full lg:flex-1">
                <EntitySearchInput
                  label="Estabelecimento Agropecuário"
                  placeholder="Buscar por código, nome, município ou proprietário."
                  value={estabelecimento ? estabelecimento.nome : ""}
                  data={ESTABELECIMENTOS_MOCK}
                  searchKeys={["codigo", "nome", "municipio", "proprietario"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Estabelecimento", key: "nome" },
                    { label: "Município", key: "municipio" },
                    { label: "Proprietário", key: "proprietario" },
                  ]}
                  icon={<img src={Icons.iconeEstabelecimentoUrl} alt="Estabelecimento Agropecuário" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                  title="Buscar Estabelecimento Agropecuário"
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
              <FloatInput
                label="Exploração Pecuária"
                required
                value={exploracao ? exploracao.codigo : ""}
                onChange={() => { }}
                icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-5 h-5 object-contain" />}
                onClick={() => setModalExploracao(true)}
              />

              <EntitySearchInput
                label="Núcleo de Produção"
                placeholder="Buscar por nome ou código"
                value={nucleo ? nucleo.nome : ""}
                data={NUCLEOS_MOCK}
                searchKeys={["codigo", "nome"]}
                columns={[
                  { label: "Núcleo de Produção", key: "nucleoCompleto" },
                  { label: "Estabelecimento Agropecuário", key: "estabelecimentoCompleto" },
                  { label: "Produtor", key: "produtorCompleto" },
                ]}
                icon={<img src={Icons.iconeNucleoProducaoUrl} alt="Núcleo de Produção" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                title="Buscar Núcleo de Produção"
                subtitle="Busque por um núcleo de produção cadastrado:"
                onChange={(ent) => setNucleo(ent)}
                className="max-w-5xl w-full [&_td]:whitespace-pre-line"
              />

              <FloatCombobox label="Município do Estabelecimento" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />

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
                placeholder="Buscar por doença"
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Doença", key: "nome" }]}
                icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                onChange={(ent) => setDoenca(ent)}
              />

              <FloatInput label="Período - De" type="date" max={hoje} value={periodoDe} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoDe} />
              <FloatInput label="Período - Até" type="date" min={periodoDe || undefined} value={periodoAte} icon={<Calendar size={18} color={GREEN} />} onChange={setPeriodoAte} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
            </div>

            {erroDeFuturo && (
              <p className="text-sm text-red-500">A data "De" não pode ser maior que a data atual.</p>
            )}
            {erroPeriodo && (
              <p className="text-sm text-red-500">A data "Até" deve ser maior ou igual à data "De".</p>
            )}
          </div>

          {erroFiltro && (
            <p className="text-sm text-red-500">
              Preencha o campo de busca ou selecione ao menos um filtro para pesquisar.
            </p>
          )}

          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {busca && <Chip label={`Busca: ${busca}`} onRemove={() => setBusca("")} />}
              {tipoDeclaracao && <Chip label={`Tipo: ${tipoDeclaracao}`} onRemove={() => setTipoDeclaracao("")} />}
              {produtor && <Chip label={`Produtor: ${produtor.nome}`} onRemove={() => setProdutor(null)} />}
              {estabelecimento && <Chip label={`Estab.: ${estabelecimento.nome}`} onRemove={() => setEstabelecimento(null)} />}
              {exploracao && <Chip label={`Exploração: ${exploracao.codigo}`} onRemove={() => setExploracao(null)} />}
              {nucleo && <Chip label={`Núcleo: ${nucleo.nome}`} onRemove={() => setNucleo(null)} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {especie && <Chip label={`Espécie: ${especie.nome}`} onRemove={() => setEspecie(null)} />}
              {doenca && <Chip label={`Doença: ${doenca.nome}`} onRemove={() => setDoenca(null)} />}
              {periodoDe && <Chip label={`De: ${fmtData(periodoDe)}`} onRemove={() => setPeriodoDe("")} />}
              {periodoAte && <Chip label={`Até: ${fmtData(periodoAte)}`} onRemove={() => setPeriodoAte("")} />}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {hasSearched && <div className="border-t border-gray-100 my-1" />}

          {!hasSearched ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Busque por declaração de vacinação utilizando os filtros acima.</p>
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
                    <tr className="border-b">
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[140px]">Tipo de Declaração</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[170px]">Produtor</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[180px]">Estabelecimento Agropecuário</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[150px]">Exploração Pecuária</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">Espécie</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[110px]">Doença</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[110px]">Data de Vacinação</th>
                      <th className="text-left px-4 py-3 font-semibold uppercase text-gray-600 whitespace-normal max-w-[100px]">Situação</th>
                      <th className="px-4 py-3 w-[80px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.tipoDeclaracao}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{e.produtorDoc}</div>
                          <div>{e.produtorNome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">
                          <div>{e.estabCodigo}</div>
                          <div>{e.estabNome}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.exploracaoCodigo ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.especie}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{e.doenca}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm whitespace-normal">{fmtData(e.dataVacinacao)}</td>
                        <td className="px-4 py-3 text-gray-900 text-sm font-medium whitespace-normal">
                          {e.situacao}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => onNavigate("visualizar-declaracao-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                            <button onClick={() => onNavigate("editar-declaracao-vacinacao", e)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
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

      <SearchModal<ExploracaoEntidade>
        open={modalExploracao}
        onClose={() => setModalExploracao(false)}
        title="Buscar Exploração Pecuária"
        subtitle="Busque por uma exploração pecuária cadastrada:"
        icon={<img src={Icons.iconeExploracaoUrl} alt="Exploração" className="w-8 h-8 object-contain" />}
        data={EXPLORACOES_MOCK}
        columns={[
          { label: "Código", key: "codigo" },
          { label: "Estabelecimento", key: "estabelecimentoFormatado" },
          { label: "Grupo - Espécie", key: "grupoEspecieFormatado" },
          { label: "Produtores", key: "produtoresFormatado" },
        ]}
        searchKeys={["codigo", "estabelecimentoFormatado", "grupoEspecieFormatado", "produtoresFormatado"]}
        searchPlaceholder="Buscar por código, estabelecimento, espécie ou produtor."
        onConfirm={(e) => {
          setExploracao(e);
          setModalExploracao(false);
        }}
        confirmLabel="Confirmar"
        className="max-w-4xl lg:max-w-5xl w-full [&_td]:whitespace-pre-line"
      />

      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => {
          setModalProdutor(false);
          setTipoPessoa("");
        }}
        title="Buscar Proprietário"
        subtitle="Busque por um proprietário cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />}
        data={databaseFiltrada}
        columns={colunasModal}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Proprietário"
        confirmLabel="Confirmar"
        onConfirm={(p) => {
          setProdutor(p);
          setModalProdutor(false);
          setTipoPessoa("");
        }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "PF", label: "Pessoa Física" },
              { value: "PJ", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />
    </div>
  );
}

export default DeclaracaoVacinacaoPage;