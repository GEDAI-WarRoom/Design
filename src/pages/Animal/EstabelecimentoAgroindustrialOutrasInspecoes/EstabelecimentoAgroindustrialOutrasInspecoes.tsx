import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  UserRoundCheck,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatCombobox,
  FloatInput,
  FloatMultiSelect,
  FloatSelect,
  SearchModal,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import { EXEMPLO_AGROINDUSTRIAL_OUTRAS_INSPECOES } from "./AdicionarEstabelecimentoAgroindustrialOutrasInspecoes";

const GREEN = "#1A7A3C";
const AREAS = ["Carne", "Leite", "Mel", "Ovos", "Pescado"];
const CLASSIFICACOES: Record<string, string[]> = {
  Carne: ["Abatedouro Frigorífico", "Unidade de beneficiamento de carne e produtos cárneos"],
  Leite: ["Entreposto de laticínios", "Granja leiteira", "Posto de refrigeração", "Queijaria", "Unidade de beneficiamento de leite e derivados"],
  Pescado: ["Abatedouro frigorífico", "Unidade de beneficiamento de pescado e produtos de pescado"],
};
const ESTADOS = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás",
  "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco",
  "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
  "São Paulo", "Sergipe", "Tocantins",
];
const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  "Minas Gerais": ["Belo Horizonte", "Lavras", "Passos", "Uberlândia", "Varginha"],
  "São Paulo": ["Campinas", "Ribeirão Preto", "Santos", "São José do Rio Preto", "São Paulo"],
  "Rio de Janeiro": ["Campos dos Goytacazes", "Niterói", "Petrópolis", "Rio de Janeiro", "Volta Redonda"],
};

const PROPRIETARIOS = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "Pessoa física" },
  { id: 2, nome: "Agro Cooperativa Serra Verde", documento: "12.345.678/0001-90", tipo: "Pessoa jurídica" },
];
const RESPONSAVEIS = [
  { id: 1, nome: "Dr. Carlos Eduardo Silva", documento: "123.456.789-00" },
  { id: 2, nome: "Dra. Mariana Costa Alencar", documento: "987.654.321-11" },
];

const REGISTROS = [{
  ...EXEMPLO_AGROINDUSTRIAL_OUTRAS_INSPECOES,
  codigo: "3500000001",
  proprietarioDisplay: "José Aarão Neto - 555.009.956-40",
  responsavelTecnico: "Dr. Carlos Eduardo Silva - 123.456.789-00",
  areaAtuacaoTexto: "Carne",
  classificacao: "Abatedouro Frigorífico",
  municipioUf: "São Paulo - SP",
}];

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EstabelecimentoAgroindustrialOutrasInspecoesPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [codigoInspecao, setCodigoInspecao] = useState("");
  const [tipoInspecao, setTipoInspecao] = useState("");
  const [proprietario, setProprietario] = useState<any>(null);
  const [responsavel, setResponsavel] = useState<any>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [classificacoes, setClassificacoes] = useState<string[]>([]);
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erro, setErro] = useState(false);
  const [focoBusca, setFocoBusca] = useState(false);
  const [modalProprietario, setModalProprietario] = useState(false);
  const [modalResponsavel, setModalResponsavel] = useState(false);

  const temFiltro = !!(
    busca.trim() || codigoInspecao || tipoInspecao || proprietario || responsavel || areas.length ||
    classificacoes.length || estado || municipio || situacao
  );

  const resultados = useMemo(() => REGISTROS.filter((registro) => {
    const termo = busca.trim().toLowerCase();
    if (termo && !`${registro.codigo} ${registro.nomeComercial}`.toLowerCase().includes(termo)) return false;
    if (codigoInspecao && !registro.codigoInspecao.toLowerCase().includes(codigoInspecao.toLowerCase())) return false;
    if (tipoInspecao && registro.tipoInspecao !== tipoInspecao) return false;
    if (proprietario && !registro.proprietarioDisplay.includes(proprietario.documento)) return false;
    if (responsavel && !registro.responsavelTecnico.includes(responsavel.documento)) return false;
    if (areas.length && !areas.some((area) => registro.areaAtuacaoTexto.includes(area))) return false;
    if (classificacoes.length && !classificacoes.some((item) => registro.classificacao.includes(item))) return false;
    if (estado && registro.endereco.estado !== estado) return false;
    if (municipio && registro.endereco.municipio !== municipio) return false;
    if (situacao && registro.situacao !== situacao) return false;
    return true;
  }), [busca, codigoInspecao, tipoInspecao, proprietario, responsavel, areas, classificacoes, estado, municipio, situacao]);

  const pesquisar = () => {
    if (!temFiltro) {
      setErro(true);
      setPesquisou(false);
      return;
    }
    setErro(false);
    setPesquisou(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="agroindustrial-outras-inspecoes" hideSearch />
      <main className="max-w-[1380px] mx-auto px-4 md:px-6 py-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm text-[#1A7A3C] mb-3"><ArrowLeft size={15} /> Inicial</button>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Estabelecimento Agroindustrial POA — Outras Inspeções</h1>
          <button type="button" onClick={() => onNavigate("adicionar-agroindustrial-outras-inspecoes")} className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F] transition">Adicionar Novo</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="flex gap-3 h-12">
            <div className={`flex-1 border rounded-md px-3 relative flex items-end pb-1.5 ${erro ? "border-red-400" : "border-gray-200 focus-within:border-[#1A7A3C]"}`}>
              <label className={`absolute left-3 transition-all ${focoBusca || busca ? "top-1 text-[10px]" : "top-1/2 -translate-y-1/2 text-sm"} ${erro ? "text-red-500" : "text-gray-400"}`}>Buscar por código ou nome do estabelecimento</label>
              <div className="flex items-center w-full">
                <input value={busca} maxLength={255} onFocus={() => setFocoBusca(true)} onBlur={() => setFocoBusca(false)} onChange={(evento) => { setBusca(evento.target.value); setErro(false); }} onKeyDown={(evento) => evento.key === "Enter" && pesquisar()} className="w-full bg-transparent text-sm outline-none h-6" />
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
            <button type="button" onClick={() => setMostrarFiltros((valor) => !valor)} className={`w-12 border border-[#1A7A3C] rounded-md flex items-center justify-center ${mostrarFiltros ? "text-[#1A7A3C] bg-white" : "text-white bg-[#1A7A3C]"}`}><SlidersHorizontal size={17} /></button>
          </div>

          {mostrarFiltros && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-end">
                <FloatInput label="Código da Inspeção" value={codigoInspecao} onChange={(valor) => setCodigoInspecao(valor.slice(0, 30))} maxLength={30} />
                <FloatSelect label="Tipo de Inspeção" value={tipoInspecao} onChange={setTipoInspecao} options={toOptions(["SIM", "SIE/Outros Estados", "SIF"])} />
                <FloatInput label="Proprietário" value={proprietario?.nome || ""} icon={<img src={Icons.iconeProdutorUrl} className="w-5 h-5 object-contain" alt="Proprietário" />} onClick={() => setModalProprietario(true)} />
                <FloatInput label="Responsável Técnico" value={responsavel?.nome || ""} icon={<UserRoundCheck size={18} color={GREEN} />} onClick={() => setModalResponsavel(true)} />
                <button type="button" onClick={pesquisar} className="h-12 px-6 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Pesquisar</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                <FloatMultiSelect label="Área de Atuação" value={areas} onChange={(novasAreas) => { setAreas(novasAreas); const disponiveis = novasAreas.flatMap((area) => CLASSIFICACOES[area] || []); setClassificacoes((atuais) => atuais.filter((item) => disponiveis.includes(item))); }} options={AREAS} />
                <FloatMultiSelect label="Classificação" value={classificacoes} onChange={setClassificacoes} options={areas.flatMap((area) => CLASSIFICACOES[area] || [])} disabled={!areas.length} />
                <FloatCombobox label="Estado" value={estado} onChange={(valor) => { setEstado(valor); setMunicipio(""); }} options={ESTADOS} />
                <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_POR_ESTADO[estado] || []} disabled={!estado} />
                <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={toOptions(["Ativo", "Inativo"])} />
              </div>
            </div>
          )}

          {erro && <p className="text-sm text-red-500">Selecione pelo menos um filtro ou utilize o campo de busca.</p>}

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque por um estabelecimento utilizando o campo de busca ou os filtros.</div>
          ) : resultados.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="border-b border-gray-100">
                  {["Código", "Nome", "Código da Inspeção", "Tipo de Inspeção", "Proprietários", "Responsável Técnico", "Área de Atuação", "Classificação", "Município - UF", "Situação"].map((coluna) => <th key={coluna} className="text-left px-3 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">{coluna}</th>)}
                  <th className="w-24" />
                </tr></thead>
                <tbody>{resultados.map((registro) => (
                  <tr key={registro.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-3 py-3 text-gray-600">{registro.codigo}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.nomeComercial}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.codigoInspecao}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.tipoInspecao}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.proprietarioDisplay}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.responsavelTecnico}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.areaAtuacaoTexto}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.classificacao}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.municipioUf}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.situacao}</td>
                    <td className="px-3 py-3"><div className="flex gap-1 justify-end">
                      <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-agroindustrial-outras-inspecoes", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Eye size={18} /></button>
                      <button type="button" title="Editar" onClick={() => onNavigate("editar-agroindustrial-outras-inspecoes", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Pencil size={17} /></button>
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500"><span>Itens por página: 10</span><div className="flex items-center gap-4"><span>1 - {resultados.length} de {resultados.length}</span><div className="flex gap-1"><button disabled className="p-1.5 opacity-30"><ChevronLeft size={18} /></button><button disabled className="p-1.5 opacity-30"><ChevronRight size={18} /></button></div></div></div>
            </div>
          )}
        </div>
      </main>

      <SearchModal
        open={modalProprietario} onClose={() => setModalProprietario(false)} title="Buscar Proprietário" subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
        icon={<img src={Icons.iconeProdutorUrl} className="w-7 h-7 object-contain" alt="Proprietário" />} data={PROPRIETARIOS}
        columns={[{ label: "Nome/Nome Fantasia", key: "nome" }, { label: "CPF/CNPJ", key: "documento" }]}
        searchKeys={["nome", "documento"]} searchPlaceholder="Buscar por nome ou CPF/CNPJ" confirmLabel="Confirmar"
        onConfirm={(item) => { setProprietario(item); setModalProprietario(false); }}
      />
      <SearchModal
        open={modalResponsavel} onClose={() => setModalResponsavel(false)} title="Buscar Responsável Técnico" subtitle="Busque por um profissional da área animal:"
        icon={<UserRoundCheck size={26} color={GREEN} />} data={RESPONSAVEIS}
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]}
        searchKeys={["nome", "documento"]} searchPlaceholder="Buscar por nome ou CPF" confirmLabel="Confirmar"
        onConfirm={(item) => { setResponsavel(item); setModalResponsavel(false); }}
      />
    </div>
  );
}

const toOptions = (valores: string[]) => valores.map((valor) => ({ value: valor, label: valor }));
