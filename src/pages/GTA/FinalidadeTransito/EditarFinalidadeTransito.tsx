import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Dna, Info, PlusCircle, X } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CheckboxGroup, FloatInput, MultiSearchModal } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";
const TIPOS_LOCAL = ["Evento Pecuário", "Frigorífico", "Estabelecimento Agropecuário", "Revendedora de Animais Vivos", "Estabelecimento Genérico", "Instituição de Ensino e Pesquisa"];
const EMITE_ACESSO = ["Emite para dentro do Estado", "Emite para fora do Estado"];
const TAXAS = ["GTA para dentro do Estado", "GTA para fora do Estado"];
const ESPECIES = [{ id: 1, codigo: "ESP-001", nome: "Bovino" }, { id: 2, codigo: "ESP-002", nome: "Bubalino" }, { id: 3, codigo: "ESP-003", nome: "Suíno" }, { id: 4, codigo: "ESP-004", nome: "Equino" }, { id: 5, codigo: "ESP-005", nome: "Ave" }];
const options = (values: string[]) => values.map((value) => ({ value, label: value }));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="overflow-visible rounded-xl bg-white shadow-sm"><button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>{open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}</section>;
}

export function EditarFinalidadeTransitoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void }) {
  const [finalidade, setFinalidade] = useState(dados?.finalidade || "Abate");
  const [codigoMapa, setCodigoMapa] = useState(dados?.codigoMapa || "01");
  const [especies, setEspecies] = useState<any[]>(dados?.especies?.length ? dados.especies : [ESPECIES[0]]);
  const [tiposProcedencia, setTiposProcedencia] = useState<string[]>(dados?.tiposProcedencia?.length ? dados.tiposProcedencia : [dados?.tipoProcedencia || "Frigorífico"]);
  const [emiteAcessoExterno, setEmiteAcessoExterno] = useState<string[]>(dados?.emiteAcessoExterno || []);
  const [tiposDestino, setTiposDestino] = useState<string[]>(dados?.tiposDestino?.length ? dados.tiposDestino : [dados?.tipoDestino || "Frigorífico"]);
  const [taxasCobrar, setTaxasCobrar] = useState<string[]>(dados?.taxasCobrar?.length ? dados.taxasCobrar : [TAXAS[0]]);
  const [modalEspecieAberto, setModalEspecieAberto] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);
  const finalidadeAtualizada = { ...(dados || {}), id: dados?.id || 1, finalidade, codigoMapa, especies, tiposProcedencia, tipoProcedencia: tiposProcedencia[0], emiteAcessoExterno, tiposDestino, tipoDestino: tiposDestino[0], taxasCobrar };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="finalidade-transito" hideSearch />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
        <div><button type="button" onClick={() => onNavigate("visualizar-finalidade-transito", finalidadeAtualizada)} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} />Visualizar Finalidade de Trânsito</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Editar Finalidade de Trânsito</h1><button type="button" onClick={() => setIsSucesso(true)} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]">Salvar</button></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><Info size={20} className="text-gray-500" /><p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.</p></div>

        <Section title="Informações Básicas"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><FloatInput label="Finalidade de Trânsito" required value={finalidade} onChange={setFinalidade} maxLength={100} /><FloatInput label="Código do MAPA" required value={codigoMapa} onChange={(value) => setCodigoMapa(value.replace(/\D/g, "").slice(0, 2))} maxLength={2} /></div></Section>

        <Section title="Espécies aplicáveis"><div className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-3"><div className="flex items-center gap-3"><span className="text-sm font-semibold text-gray-500">Espécies Selecionadas <span className="text-red-500">*</span></span><span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-xs font-bold text-[#1A7A3C]">{especies.length} {especies.length === 1 ? "Selecionada" : "Selecionadas"}</span></div><button type="button" onClick={() => setModalEspecieAberto(true)} className="flex items-center gap-1.5 rounded-md border border-[#1A7A3C] px-3 py-1.5 text-xs font-bold text-[#1A7A3C] hover:bg-green-50"><PlusCircle size={14} />Adicionar Espécie</button></div><div className="flex flex-wrap gap-4 p-5">{especies.map((especie) => <div key={especie.id} className="flex min-w-[180px] items-center justify-between rounded-xl border border-gray-200 p-3 shadow-sm"><span className="text-sm font-bold text-[#1A7A3C]">{especie.nome}</span><button type="button" onClick={() => setEspecies((items) => items.filter((item) => item.id !== especie.id))} className="text-gray-400 hover:text-red-500"><X size={16} /></button></div>)}</div></div><MultiSearchModal open={modalEspecieAberto} onClose={() => setModalEspecieAberto(false)} title="Buscar Espécies" subtitle="Busque por uma ou mais espécies cadastradas no sistema:" icon={<Dna size={18} color={GREEN} />} data={ESPECIES} columns={[{ label: "Nome da Espécie", key: "nome" }]} searchKeys={["nome"]} searchPlaceholder="Busque pelo nome da espécie." selectedItems={especies} confirmLabel="Salvar Selecionadas" onConfirm={(selecionadas) => { setEspecies(selecionadas); setModalEspecieAberto(false); }} /></Section>

        <Section title="Informações de Procedência"><div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2"><CheckboxGroup title="Tipo de Procedência" required options={options(TIPOS_LOCAL)} defaultValue={tiposProcedencia} onChange={setTiposProcedencia} />{tiposProcedencia.includes("Estabelecimento Agropecuário") && <CheckboxGroup title="Emite GTA por Acesso Externo" options={options(EMITE_ACESSO)} defaultValue={emiteAcessoExterno} onChange={setEmiteAcessoExterno} />}</div></Section>
        <Section title="Informações de Destino"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><CheckboxGroup title="Tipo de Destino" required options={options(TIPOS_LOCAL)} defaultValue={tiposDestino} onChange={setTiposDestino} /><CheckboxGroup title="Taxas a Cobrar" options={options(TAXAS)} defaultValue={taxasCobrar} onChange={setTaxasCobrar} /></div></Section>
      </main>

      {isSucesso && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"><h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3><p className="mt-1 text-sm text-gray-500">A finalidade "{finalidade}" foi atualizada.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => onNavigate("finalidade-transito")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-finalidade-transito", finalidadeAtualizada)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Visualizar</button></div></div></div>}
    </div>
  );
}
