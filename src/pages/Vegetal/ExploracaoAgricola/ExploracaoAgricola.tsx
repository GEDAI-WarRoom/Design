import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Pencil, Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatCombobox, FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import { listarRegistrosMock } from "../../../components/ui/mockCollectionStorage";
import * as Icons from "../../../imports/icons";
import {
  COLECAO_EXPLORACOES_AGRICOLAS, ESTABELECIMENTOS_AGRICOLAS_MOCK, EXPLORACOES_AGRICOLAS_MOCK,
  MUNICIPIOS_MG, PRODUTORES_AGRICOLAS_MOCK, VARIEDADES_CULTURA_MOCK, formatarData,
  type ExploracaoAgricola,
} from "./exploracaoAgricolaData";

const GREEN = "#1A7A3C";
const VENCIMENTOS = ["30 dias", "7 dias", "Hoje", "Período"].map((value) => ({ value, label: value }));
const SITUACOES = ["Ativo", "Inativo", "Suspenso"].map((value) => ({ value, label: value }));

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex items-center gap-2 rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white"><span>{label}</span><button type="button" onClick={onRemove}><X size={14} /></button></span>;
}

function correspondeVencimento(registro: ExploracaoAgricola, filtro: string, de: string, ate: string) {
  if (!filtro) return true;
  if (!registro.dataVencimento) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(`${registro.dataVencimento}T00:00:00`);
  const dias = Math.round((vencimento.getTime() - hoje.getTime()) / 86400000);
  if (filtro === "Hoje") return dias === 0;
  if (filtro === "7 dias") return dias >= 0 && dias <= 7;
  if (filtro === "30 dias") return dias >= 0 && dias <= 30;
  return (!de || registro.dataVencimento >= de) && (!ate || registro.dataVencimento <= ate);
}

export function ExploracaoAgricolaPage({ onLogout, onNavigate }: { onLogout: () => void; onNavigate: (screen: any, data?: any) => void }) {
  const [codigo, setCodigo] = useState("");
  const [estabelecimento, setEstabelecimento] = useState<any>(null);
  const [produtor, setProdutor] = useState<any>(null);
  const [municipio, setMunicipio] = useState("");
  const [variedade, setVariedade] = useState<any>(null);
  const [vencendoEm, setVencendoEm] = useState("");
  const [periodoDe, setPeriodoDe] = useState("");
  const [periodoAte, setPeriodoAte] = useState("");
  const [situacao, setSituacao] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [erro, setErro] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const temFiltro = Boolean(codigo || estabelecimento || produtor || municipio || variedade || vencendoEm || situacao);
  const pesquisar = () => {
    if (!temFiltro) { setErro("Preencha o código ou selecione pelo menos um filtro para pesquisar."); setShowFilters(true); setHasSearched(false); return; }
    if (vencendoEm === "Período" && (!periodoDe || !periodoAte || periodoAte <= periodoDe)) { setErro("Informe um período válido; a data final deve ser posterior à data inicial."); setHasSearched(false); return; }
    setErro(""); setHasSearched(true); setPage(1);
  };

  const registros = listarRegistrosMock<ExploracaoAgricola>(COLECAO_EXPLORACOES_AGRICOLAS, EXPLORACOES_AGRICOLAS_MOCK);
  const filtrados = registros.filter((item) =>
    (!codigo || item.codigo.includes(codigo)) &&
    (!estabelecimento || item.estabelecimento.codigo === estabelecimento.codigo) &&
    (!produtor || item.produtores.some((p) => p.documento === produtor.documento)) &&
    (!municipio || item.estabelecimento.municipio === municipio) &&
    (!variedade || item.variedade.codigo === variedade.codigo) &&
    (!situacao || item.situacao === situacao) &&
    correspondeVencimento(item, vencendoEm, periodoDe, periodoAte)
  );
  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paginaAtual = Math.min(page, totalPages);
  const pagina = filtrados.slice((paginaAtual - 1) * perPage, paginaAtual * perPage);
  const inicio = total ? (paginaAtual - 1) * perPage + 1 : 0;
  const fim = Math.min(paginaAtual * perPage, total);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="exploracao-agricola" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C]"><ArrowLeft size={15} />Inicial</button>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Exploração Agrícola</h1>
          <button onClick={() => onNavigate("adicionar-exploracao-agricola")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar Nova</button>
        </div>

        <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="relative flex-1"><FloatInput label="Código da Exploração Agrícola" value={codigo} onChange={(v) => { setCodigo(v.replace(/\D/g, "").slice(0, 17)); setErro(""); }} maxLength={17} /><Search size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#1A7A3C]" aria-hidden="true" /></div>
            <button type="button" onClick={() => setShowFilters((v) => !v)} className="h-12 rounded-md border px-4" style={{ borderColor: GREEN, color: showFilters ? GREEN : "white", backgroundColor: showFilters ? "white" : GREEN }}><SlidersHorizontal size={17} /></button>
            {showFilters && <button type="button" onClick={pesquisar} className="h-12 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Pesquisar</button>}
          </div>

          {showFilters && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <EntitySearchInput label="Estabelecimento Agropecuário" value={estabelecimento?.nome || ""} data={ESTABELECIMENTOS_AGRICOLAS_MOCK} searchKeys={["codigo", "nome", "municipio", "proprietario"]} columns={[{ label: "Código", key: "codigo" }, { label: "Estabelecimento", key: "nome" }, { label: "Município", key: "municipio" }]} icon={<img src={Icons.iconeEstabelecimentoUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Estabelecimento Agropecuário" subtitle="Busque por um estabelecimento cadastrado:" onChange={(v) => { setEstabelecimento(v); setErro(""); }} />
            <EntitySearchInput label="Produtor" value={produtor?.nome || ""} data={PRODUTORES_AGRICOLAS_MOCK} searchKeys={["nome", "documento"]} columns={[{ label: "CPF/CNPJ", key: "documento" }, { label: "Nome/Razão Social", key: "nome" }]} icon={<img src={Icons.iconeProdutorUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Produtor" subtitle="Busque por um produtor cadastrado:" onChange={(v) => { setProdutor(v); setErro(""); }} />
            <FloatCombobox label="Município" value={municipio} onChange={(v) => { setMunicipio(v); setErro(""); }} options={MUNICIPIOS_MG} />
            <EntitySearchInput label="Variedade de Cultura" value={variedade ? `${variedade.cultura} - ${variedade.nome}` : ""} data={VARIEDADES_CULTURA_MOCK} searchKeys={["cultura", "nome"]} columns={[{ label: "Cultura", key: "cultura" }, { label: "Variedade", key: "nome" }]} icon={<img src={Icons.iconeCulturaUrl} className="h-5 w-5 object-contain" alt="" />} title="Buscar Variedade de Cultura" subtitle="Busque por uma variedade cadastrada:" onChange={(v) => { setVariedade(v); setErro(""); }} />
            <FloatSelect label="Vencendo em" value={vencendoEm} onChange={(v) => { setVencendoEm(v); if (v !== "Período") { setPeriodoDe(""); setPeriodoAte(""); } setErro(""); }} options={VENCIMENTOS} />
            <FloatSelect label="Situação do Cadastro" value={situacao} onChange={(v) => { setSituacao(v); setErro(""); }} options={SITUACOES} />
            {vencendoEm === "Período" && <><FloatInput label="Período de Vencimento - De" type="date" value={periodoDe} onChange={setPeriodoDe} /><FloatInput label="Período de Vencimento - Até" type="date" value={periodoAte} onChange={setPeriodoAte} min={periodoDe} /></>}
          </div>}

          {erro && <p className="text-sm text-red-600" role="alert">{erro}</p>}
          {temFiltro && <div className="flex flex-wrap gap-2">
            {codigo && <Chip label={`Código: ${codigo}`} onRemove={() => setCodigo("")} />}{estabelecimento && <Chip label={`Estabelecimento: ${estabelecimento.nome}`} onRemove={() => setEstabelecimento(null)} />}{produtor && <Chip label={`Produtor: ${produtor.nome}`} onRemove={() => setProdutor(null)} />}{municipio && <Chip label={`Município: ${municipio}`} onRemove={() => setMunicipio("")} />}{variedade && <Chip label={`Variedade: ${variedade.nome}`} onRemove={() => setVariedade(null)} />}{vencendoEm && <Chip label={`Vencendo em: ${vencendoEm}`} onRemove={() => { setVencendoEm(""); setPeriodoDe(""); setPeriodoAte(""); }} />}{situacao && <Chip label={`Situação: ${situacao}`} onRemove={() => setSituacao("")} />}
          </div>}

          {!hasSearched ? <div className="py-12 text-center text-sm text-gray-500">Busque por exploração agrícola utilizando os campos acima.</div> : total === 0 ? <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div> : <>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs uppercase text-gray-600">
              <th className="px-3 py-3">Código</th><th className="px-3 py-3">Estabelecimento Agropecuário</th><th className="px-3 py-3">Produtores</th><th className="px-3 py-3">Município - UF</th><th className="px-3 py-3">Cultura - Variedade</th><th className="px-3 py-3">Data de Vencimento</th><th className="px-3 py-3">Situação</th><th />
            </tr></thead><tbody>{pagina.map((item) => <tr key={item.id} className="border-b border-gray-100 text-gray-600 hover:bg-gray-50">
              <td className="px-3 py-3 whitespace-nowrap">{item.codigo}</td><td className="px-3 py-3"><span className="block">{item.estabelecimento.codigo}</span><span>{item.estabelecimento.nome}</span></td><td className="px-3 py-3">{item.produtores.map((p) => <span key={p.id} className="block">{p.documento} - {p.nome}</span>)}</td><td className="px-3 py-3 whitespace-nowrap">{item.estabelecimento.municipio} - {item.estabelecimento.uf}</td><td className="px-3 py-3">{item.variedade.cultura} - {item.variedade.nome}</td><td className="px-3 py-3 whitespace-nowrap">{formatarData(item.dataVencimento)}</td><td className="px-3 py-3">{item.situacao}</td><td className="px-3 py-3"><div className="flex justify-end gap-1"><button title="Visualizar" onClick={() => onNavigate("visualizar-exploracao-agricola", item)} className="p-2 text-[#1A7A3C]"><Eye size={18} /></button><button title="Editar" onClick={() => onNavigate("editar-exploracao-agricola", item)} className="p-2 text-[#1A7A3C]"><Pencil size={17} /></button></div></td>
            </tr>)}</tbody></table></div>
            <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500"><span>Itens por página: {perPage}</span><div className="flex items-center gap-3"><span>{inicio} - {fim} de {total}</span><button disabled={paginaAtual === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={18} /></button><button disabled={paginaAtual === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={18} /></button></div></div>
          </>}
        </div>
      </main>
    </div>
  );
}
