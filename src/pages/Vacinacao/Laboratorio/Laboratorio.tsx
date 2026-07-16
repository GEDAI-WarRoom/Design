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
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, FloatCombobox, FloatInput, SearchModal, FloatMultiSelect } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS
// ==========================================================
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

const ESTADOS_BR = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const MUNICIPIOS_MOCK = [
  "Abadia dos Dourados", "Belo Horizonte", "Campinas", "Campo Belo", "Lavras",
  "Oliveira", "Ribeirão Preto", "São Paulo", "Uberlândia", "Varginha",
];

const ATUACOES = [
  "Produção de insumos de diagnóstico",
  "Produção de vacinas",
  "Diagnóstico de doenças",
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

// ==========================================================
// RESULTADOS (mock)
// ==========================================================
interface Pessoa { nome: string; documento: string }
interface Laboratorio {
  id: number;
  nome: string;
  produtor: Pessoa[];
  atuacao: string[];
  municipio: string;
  uf: string;
  situacao: "Ativo" | "Inativo";
}

const LABORATORIOS_MOCK: Laboratorio[] = [
  {
    id: 1, nome: "Laboratório Agener",
    produtor: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" },
    ],
    atuacao: ["Realiza diagnóstico de doenças", "Realiza produção de vacinas"],
    municipio: "Lavras", uf: "MG", situacao: "Ativo",
  },
  {
    id: 2, nome: "BioVet Diagnósticos",
    produtor: [{ nome: "Farmacêutica Vale Verde Ltda.", documento: "56.338.814/0001-95" }],
    atuacao: ["Realiza produção de insumos de diagnóstico"],
    municipio: "Belo Horizonte", uf: "MG", situacao: "Inativo",
  },
];

// ==========================================================
// HELPERS
// ==========================================================
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1A7A3C] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm max-w-full">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="hover:opacity-80 transition flex-shrink-0"><X size={14} className="stroke-[2.5]" /></button>
    </div>
  );
}

function CelulaPessoas({ pessoas }: { pessoas: Pessoa[] }) {
  if (pessoas.length === 0) return <span className="text-gray-700">—</span>;
  const toolTipTitle = pessoas.map((p) => `${p.documento} - ${p.nome}`).join(", ");
  
  return (
    <div className="text-sm text-gray-700 leading-tight" title={toolTipTitle}>
      <div>{pessoas[0].documento}</div>
      <div>{pessoas[0].nome}</div>
      {pessoas.length > 1 && (
        <div className="text-sm text-gray-700 mt-0.5">+{pessoas.length - 1} proprietário(s)</div>
      )}
    </div>
  );
}

// ==========================================================
// PÁGINA: BUSCAR LABORATÓRIO
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function LaboratorioPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [atuacao, setAtuacao] = useState<string[]>([]);
  const [situacao, setSituacao] = useState("");
  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [focusBusca, setFocusBusca] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const databaseFiltrada = tipoPessoa
    ? PRODUTORES_MOCK.filter((p) => p.tipo === tipoPessoa)
    : PRODUTORES_MOCK;

  const colunasModal =
    tipoPessoa === "PJ"
      ? [{ label: "Razão Social", key: "nome" }, { label: "CNPJ", key: "documento" }]
      : [{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }];

  const algumFiltroPreenchido =
    busca.trim() !== "" || !!produtor || estado !== "" || municipio !== "" || atuacao.length > 0 || situacao !== "";

  const handlePesquisar = () => {
    if (!algumFiltroPreenchido) {
      setErroValidacao(true);
      setHasSearched(false);
      return;
    }
    setErroValidacao(false);
    setHasSearched(true);
    setPage(1);
  };

  const filtrados = LABORATORIOS_MOCK.filter((l) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = termo === "" || l.nome.toLowerCase().includes(termo);
    const matchProp = !produtor || l.produtor.some((p) => p.documento === produtor.documento);
    const matchEstado = estado === "" || l.uf === (estado === "Minas Gerais" ? "MG" : estado === "São Paulo" ? "SP" : "");
    const matchMunicipio = municipio === "" || l.municipio === municipio;
    const matchAtuacao = atuacao.length === 0 || atuacao.some((a) => l.atuacao.includes(a));
    const matchSituacao = situacao === "" || l.situacao === situacao;
    return matchBusca && matchProp && matchEstado && matchMunicipio && matchAtuacao && matchSituacao;
  });

  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = total === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, total);
  const pagina = filtrados.slice((pageAtual - 1) * perPage, pageAtual * perPage);

  const temFiltroAtivo = produtor || estado || municipio || atuacao.length > 0 || situacao;

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="laboratorio" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Cabeçalho */}
        <div className="mb-1">
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Laboratório</h1>
            <button onClick={() => onNavigate("adicionar-laboratorio")} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: GREEN }}>
              Adicionar Novo
            </button>
          </div>
        </div>

        {/* 📦 CONTAINER ÚNICO BRANCO */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-5 overflow-hidden">
          
          {/* Nome do laboratório + barra principal */}
          <div className="flex gap-3 items-stretch w-full">
            <div className={`flex-1 bg-white border rounded-md px-3 h-12 transition-all relative flex items-end pb-1.5 ${
              erroValidacao && !algumFiltroPreenchido
                ? "border-red-400 ring-1 ring-red-300"
                : "border-gray-200 focus-within:border-[#1A7A3C] focus-within:ring-1 focus-within:ring-[#1A7A3C]"
            }`}>
              <label className={`absolute left-3 transition-all duration-200 pointer-events-none ${focusBusca || busca ? "top-1 text-[10px] text-gray-400 font-medium" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"}`}>
                Nome do laboratório
              </label>
              <div className="flex items-center w-full">
                <input
                  type="text"
                  maxLength={255}
                  value={busca}
                  onFocus={() => setFocusBusca(true)}
                  onBlur={() => setFocusBusca(false)}
                  onChange={(e) => { setBusca(e.target.value); if (erroValidacao) setErroValidacao(false); }}
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

          {/* Filtros avançados */}
         {/* Filtros avançados */}
{showFilters && (
  <div className="mt-4 animate-fadeIn flex flex-col gap-4">
    {/* Grid fixo de 4 colunas no Desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
      
      {/* 1. Produtor (Sempre coluna 1) */}
      <div className="w-full">
        <FloatInput
          label="Produtor"
          value={produtor ? produtor.nome : ""} 
          icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-5 h-5 object-contain" />} 
          onClick={() => setModalProdutor(true)}
          readOnly
        />            
      </div>

      {/* 2. Estado (Se o município NÃO aparecer, ele expande por 2 colunas 'lg:col-span-2') */}
      <div className={`w-full transition-all duration-200 ${!estado ? "lg:col-span-2" : ""}`}>
        <FloatSelect 
          label="Estado" 
          value={estado} 
          onChange={(v) => { setEstado(v); setMunicipio(""); }} 
          options={ESTADOS_BR.map((e) => ({ value: e, label: e }))} 
        />
      </div>
      
      {/* 3. Município (Só renderiza e aparece se o estado for selecionado, tomando o espaço extra) */}
      {estado && (
        <div className="w-full animate-fadeIn">
          <FloatCombobox 
            label="Município" 
            value={municipio} 
            onChange={setMunicipio} 
            options={MUNICIPIOS_MOCK} 
          />
        </div>
      )}

      {/* 4. Botão Pesquisar (Sempre cravado na última coluna da primeira linha) */}
      <div className="w-full lg:col-start-4 lg:row-start-1">
        <button onClick={handlePesquisar} className="h-11 w-full px-8 rounded-md text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>
          Pesquisar
        </button>
      </div>

      {/* 5. Atuação (Fica na segunda linha) */}
      <div className="w-full">
        <FloatMultiSelect
          label="Atuação"
          options={ATUACOES}
          value={atuacao}
          onChange={setAtuacao}
        />
      </div>
      
      {/* 6. Situação (Fica na segunda linha, ao lado de Atuação) */}
      <div className="w-full">
        <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES} />
      </div>

    </div>
  </div>
)}

          {/* Mensagem de Erro de Validação */}
          {erroValidacao && !algumFiltroPreenchido && (
            <p className="text-sm text-red-500 mt-3">Selecione ao menos um filtro ou preencha o campo de busca para pesquisar.</p>
          )}

          {/* Chips de filtros ativos */}
          {temFiltroAtivo && (
            <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
              {produtor && <Chip label={`Proprietário: ${produtor.nome}`} onRemove={() => setProdutor(null)} />}
              {estado && <Chip label={`Estado: ${estado}`} onRemove={() => { setEstado(""); setMunicipio(""); }} />}
              {municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}
              {atuacao.map((a) => <Chip key={a} label={a} onRemove={() => setAtuacao((prev) => prev.filter((x) => x !== a))} />)}
              {situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
            </div>
          )}

          {/* 📊 SEÇÃO DE RESULTADOS INTEGRADA */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            {!hasSearched ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500">Busque por um laboratório utilizando o campo de busca e os filtros acima.</p>
              </div>
            ) : total === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500">Nenhum resultado foi encontrado.</p>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-sm border-collapse px-6">
                    <thead>
                      <tr className="bg-gray-30 border-b border-gray-100">
                        {["NOME", "PROPRIETÁRIOS", "ATUAÇÃO", "MUNICÍPIO - UF", "SITUAÇÃO"].map((h) => (
                          <th key={h} className="text-left px-6 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {pagina.map((l) => (
                        <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                          {/* Garantindo rigorosamente a mesma cor text-gray-700 e tamanho text-sm em tudo */}
                          <td className="px-6 py-3 text-sm text-gray-700 ">{l.nome}</td>
                          <td className="px-6 py-3 text-sm text-gray-700"><CelulaPessoas pessoas={l.produtor} /></td>
                          
                          {/* Coluna Atuação: Permitindo quebra de linha natural sem sumir ou cortar o texto */}
                          <td className="px-6 py-3 text-sm text-gray-700 max-w-[260px] whitespace-normal break-words leading-tight">
                            {l.atuacao.join(", ")}
                          </td>
                          
                          {/* Município / UF com cores e tamanhos uniformes (hífen removido para quebra de bloco) */}
                          <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap leading-tight">
                            <div>{l.municipio}</div>
                            <div>{l.uf}</div>
                          </td>
                          
                          {/* Situação rigorosamente idêntica em cor e tamanho */}
                          <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{l.situacao}</td>
                          
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => onNavigate("visualizar-laboratorio", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Visualizar"><ViewIcon size={18} /></button>
                              <button onClick={() => onNavigate("editar-laboratorio", l)} className="p-2 rounded-md hover:bg-green-50 transition" style={{ color: GREEN }} title="Editar"><Pencil size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-sm text-gray-500">
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

        </div>
      </main>

      {/* Modal do Produtor */}
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