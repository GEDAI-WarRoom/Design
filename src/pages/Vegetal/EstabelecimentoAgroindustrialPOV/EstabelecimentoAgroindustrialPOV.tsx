import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatCombobox, FloatInput, FloatSelect, SearchModal } from "../../../components/ui/FormKit";
import { PRODUTORES_MOCK } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import { EXEMPLO_ESTABELECIMENTO_AGROINDUSTRIAL_POV } from "./AdicionarEstabelecimentoAgroindustrialPOV";

const MUNICIPIOS_MG = ["Belo Horizonte", "Contagem", "Juiz de Fora", "Lavras", "Passos", "Uberaba", "Uberlândia", "Varginha"];

const REGISTROS = [{
  ...EXEMPLO_ESTABELECIMENTO_AGROINDUSTRIAL_POV,
  proprietariosDisplay: EXEMPLO_ESTABELECIMENTO_AGROINDUSTRIAL_POV.proprietarios
    .map((item) => `${item.proprietario.documento} - ${item.proprietario.nome}`)
    .join(", "),
  municipioUf: "Lavras - MG",
}];

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EstabelecimentoAgroindustrialPOVPage({ onLogout, onNavigate }: PageProps) {
  const [busca, setBusca] = useState("");
  const [numeroRegistroFederal, setNumeroRegistroFederal] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("PF");
  const [proprietario, setProprietario] = useState<any>(null);
  const [municipio, setMunicipio] = useState("");
  const [situacao, setSituacao] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);
  const [erro, setErro] = useState(false);
  const [focoBusca, setFocoBusca] = useState(false);
  const [modalProprietario, setModalProprietario] = useState(false);

  const proprietariosFiltrados = PRODUTORES_MOCK.filter((pessoa) => pessoa.tipo === tipoPessoa);
  const temFiltro = !!(busca.trim() || numeroRegistroFederal || proprietario || municipio || situacao);

  const resultados = useMemo(() => REGISTROS.filter((registro) => {
    const termo = busca.trim().toLowerCase();
    if (termo && !`${registro.codigo} ${registro.nomeComercial}`.toLowerCase().includes(termo)) return false;
    if (numeroRegistroFederal && !registro.numeroRegistroFederal.toLowerCase().includes(numeroRegistroFederal.toLowerCase())) return false;
    if (proprietario && !registro.proprietariosDisplay.includes(proprietario.documento)) return false;
    if (municipio && registro.endereco.municipio !== municipio) return false;
    if (situacao && registro.situacao !== situacao) return false;
    return true;
  }), [busca, numeroRegistroFederal, proprietario, municipio, situacao]);

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
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="agroindustrial-pov" hideSearch />
      <main className="max-w-[1380px] mx-auto px-4 md:px-6 py-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="flex items-center gap-1 text-sm text-[#1A7A3C] mb-3"><ArrowLeft size={15} /> Inicial</button>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Estabelecimento Agroindustrial POV</h1>
          <button type="button" onClick={() => onNavigate("adicionar-agroindustrial-pov")} className="px-5 py-3 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F] transition">Adicionar Novo</button>
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
            <button type="button" aria-label="Exibir filtros" onClick={() => setMostrarFiltros((valor) => !valor)} className={`w-12 border border-[#1A7A3C] rounded-md flex items-center justify-center ${mostrarFiltros ? "text-[#1A7A3C] bg-white" : "text-white bg-[#1A7A3C]"}`}><SlidersHorizontal size={17} /></button>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 items-end">
              <FloatInput label="Número de Registro Federal" value={numeroRegistroFederal} onChange={(valor) => setNumeroRegistroFederal(valor.slice(0, 30))} maxLength={30} />
              <FloatSelect label="Tipo de Pessoa" value={tipoPessoa} onChange={(valor) => { setTipoPessoa(valor); setProprietario(null); }} options={[{ value: "PF", label: "Pessoa Física" }, { value: "PJ", label: "Pessoa Jurídica" }]} />
              <FloatInput label="Proprietário" value={proprietario?.nome || ""} icon={<img src={Icons.iconeProdutorUrl} className="w-5 h-5 object-contain" alt="Proprietário" />} onClick={() => setModalProprietario(true)} />
              <FloatCombobox label="Município" value={municipio} onChange={setMunicipio} options={MUNICIPIOS_MG} />
              <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
              <button type="button" onClick={pesquisar} className="h-12 px-6 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold hover:bg-[#15612F]">Pesquisar</button>
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
                  {["Código", "Nome", "Número de Registro Federal", "Proprietários - CPF/CNPJ e Nome", "Município - UF", "Situação"].map((coluna) => <th key={coluna} className="text-left px-3 py-3 font-semibold text-gray-600 whitespace-nowrap uppercase">{coluna}</th>)}
                  <th className="w-24" />
                </tr></thead>
                <tbody>{resultados.map((registro) => (
                  <tr key={registro.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-3 py-3 text-gray-600">{registro.codigo}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.nomeComercial}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.numeroRegistroFederal}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.proprietariosDisplay}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.municipioUf}</td>
                    <td className="px-3 py-3 text-gray-600">{registro.situacao}</td>
                    <td className="px-3 py-3"><div className="flex gap-1 justify-end">
                      <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-agroindustrial-pov", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Eye size={18} /></button>
                      <button type="button" title="Editar" onClick={() => onNavigate("editar-agroindustrial-pov", registro)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Pencil size={17} /></button>
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
        open={modalProprietario}
        onClose={() => setModalProprietario(false)}
        title="Buscar Proprietário"
        subtitle={`Busque por uma ${tipoPessoa === "PF" ? "pessoa física" : "pessoa jurídica"} cadastrada:`}
        icon={<img src={Icons.iconeProdutorUrl} className="w-7 h-7 object-contain" alt="Proprietário" />}
        data={proprietariosFiltrados}
        columns={[{ label: tipoPessoa === "PF" ? "Nome" : "Razão Social", key: "nome" }, { label: tipoPessoa === "PF" ? "CPF" : "CNPJ", key: "documento" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar por nome ou CPF/CNPJ"
        confirmLabel="Confirmar"
        onConfirm={(item) => { setProprietario(item); setModalProprietario(false); }}
      />
    </div>
  );
}
