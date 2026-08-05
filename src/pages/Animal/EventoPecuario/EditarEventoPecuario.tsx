import { ArrowLeft, Calendar, CalendarArrowUpIcon, ChevronDown, ChevronUp, Dna, Download, Info, PlusCircle, Store, Trash2, User } from "lucide-react";
import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput, FloatSelect, LargeTextArea, SimNao, UploadField } from "../../../components/ui/FormKit";
import { ESPECIES_EVENTO_MOCK, PROMOTORAS_EVENTO_MOCK, RECINTOS_EVENTO_MOCK, RESPONSAVEIS_EVENTO_MOCK, TIPOS_EVENTO } from "./AdicionarEventoPecuario";

const GREEN = "#1A7A3C";
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return <div className="bg-white rounded-xl shadow-sm">
    <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left rounded-xl hover:bg-gray-50 transition"><span className="text-base font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>
    {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
  </div>;
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
  return <>{comDivisor && <hr className="border-gray-100" />}<div className="flex flex-col gap-4"><span className="text-sm font-semibold text-gray-700">{titulo}</span>{children}</div></>;
}

interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: any; }

export function EditarEventoPecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const inicial = dados || {};
  const especiesIniciais = inicial.especie || inicial.especies?.map((item: any) => ({ uid: uid("esp"), especie: item })) || [
    { uid: "esp-1", especie: ESPECIES_EVENTO_MOCK[0] },
    { uid: "esp-2", especie: ESPECIES_EVENTO_MOCK[2] },
  ];
  const responsaveisIniciais = inicial.responsavelTecnico || inicial.responsaveisTecnicos || [RESPONSAVEIS_EVENTO_MOCK[0]];
  const anexosIniciais = (inicial.anexos || [{ id: "anx-1", nome: "regulamento_evento.pdf", descricao: "Regulamento oficial do evento pecuário" }]).map((item: any) => ({ ...item, id: item.id || item.uid || uid("anx"), nome: item.nome || item.nomeArquivo || "" }));

  const [nomeEvento, setNomeEvento] = useState(inicial.nomeEvento || "42ª Expoagro Sul de Minas");
  const [validadeDe, setValidadeDe] = useState(inicial.validadeDe || inicial.periodoDe || "2026-09-10");
  const [validadeAte, setValidadeAte] = useState(inicial.validadeAte || inicial.periodoAte || "2026-09-14");
  const [especies, setEspecies] = useState<any[]>(especiesIniciais);
  const [tipoEvento, setTipoEvento] = useState(inicial.tipoEvento || inicial.tipoEventoPecuario || "Com finalidade comercial");
  const [promotora, setPromotora] = useState<any>(inicial.promotora || PROMOTORAS_EVENTO_MOCK[0]);
  const [estabelecimento, setEstabelecimento] = useState<any>(inicial.estabelecimento || inicial.recinto || RECINTOS_EVENTO_MOCK[0]);
  const [possuiAuxilio, setPossuiAuxilio] = useState(inicial.possuiAuxilio ?? inicial.possuiAuxilioEstabelecimento === "Sim");
  const [responsaveis, setResponsaveis] = useState<any[]>(responsaveisIniciais);
  const [anexos, setAnexos] = useState<any[]>(anexosIniciais);
  const [observacao, setObservacao] = useState(inicial.observacao || inicial.observacoes || "Evento realizado com acompanhamento veterinário oficial.");
  const [confirmar, setConfirmar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const registroAtual = () => ({ ...inicial, nomeEvento, validadeDe, validadeAte, periodoDe: validadeDe, periodoAte: validadeAte, especie: especies, especies: especies.map((item) => item.especie), tipoEvento, tipoEventoPecuario: tipoEvento, promotora, estabelecimento, recinto: estabelecimento, possuiAuxilio, possuiAuxilioEstabelecimento: possuiAuxilio ? "Sim" : "Não", responsavelTecnico: responsaveis, responsaveisTecnicos: responsaveis, anexos, observacao, observacoes: observacao });

  return <div className="min-h-screen bg-[#f2f3f5]">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="evento-pecuario" hideSearch />
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
      <div><button type="button" onClick={() => onNavigate("evento-pecuario")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}><ArrowLeft size={15} /> Todos os Eventos Pecuários</button><div className="flex items-center justify-between"><h1 className="text-2xl font-semibold text-gray-900">Editar Evento Pecuário</h1><button type="button" onClick={() => setConfirmar(true)} className="px-5 py-3 rounded-md text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: GREEN }}>Salvar</button></div></div>
      <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3"><Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" /><p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p></div>

      <Section title="Informações Básicas"><div className="flex flex-col gap-5"><FloatInput label="Nome do Evento" required value={nomeEvento} onChange={setNomeEvento} maxLength={100} /><SubGrupo titulo="Periodo do evento" comDivisor><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FloatInput label="Período - De" type="date" value={validadeDe} onChange={setValidadeDe} icon={<Calendar size={18} />} required /><FloatInput label="Período - Até" type="date" value={validadeAte} onChange={setValidadeAte} icon={<Calendar size={18} />} required /></div></SubGrupo></div></Section>

      <Section title="Informações Complementares"><div className="flex flex-col gap-5"><SubGrupo titulo="Espécies do Evento"><DynamicListWrapper items={especies} behavior="at-least-one" addButtonLabel="Adicionar Espécie" itemLabel="Espécie" onAddItem={() => setEspecies((itens) => [...itens, { uid: uid("esp"), especie: null }])} onRemoveItem={(index: number) => setEspecies((itens) => itens.filter((_, i) => i !== index))} variant="plain" showCounter smallCounter>{(item: any, index: number) => <EntitySearchInput label="Espécie" placeholder="Buscar espécie" value={item.especie?.nome || ""} data={ESPECIES_EVENTO_MOCK} searchKeys={["nome", "grupo"]} columns={[{ label: "Nome", key: "nome" }, { label: "Grupo", key: "grupo" }]} icon={<Dna size={18} color={GREEN} />} title="Buscar Espécie" subtitle="Busque por uma espécie cadastrada:" onChange={(entidade) => setEspecies((itens) => itens.map((atual, i) => i === index ? { ...atual, especie: entidade } : atual))} required />}</DynamicListWrapper></SubGrupo><SubGrupo titulo="Caracterização do evento" comDivisor><FloatSelect label="Tipo de Evento Pecuário" value={tipoEvento} onChange={setTipoEvento} options={TIPOS_EVENTO} required /></SubGrupo></div></Section>

      <Section title="Promotora do Evento"><EntitySearchInput label="Promotora de Evento" placeholder="Buscar por nome da promotora" value={promotora?.nome || ""} data={PROMOTORAS_EVENTO_MOCK} searchKeys={["nome", "grupo"]} columns={[{ label: "Promotora de Evento", key: "nome" }, { label: "Registro da Promotora", key: "numeroRegistro" }]} icon={<CalendarArrowUpIcon size={18} color={GREEN} />} title="Buscar Promotora" subtitle="Busque por uma promotora cadastrada:" onChange={setPromotora} required /></Section>

      <Section title="Estabelecimento de Evento"><EntitySearchInput label="Estabelecimento de Evento" placeholder="Buscar por nome do estabelecimento" value={estabelecimento?.nome || ""} data={RECINTOS_EVENTO_MOCK} searchKeys={["nome", "municipio"]} columns={[{ label: "Nome", key: "nome" }, { label: "Código", key: "codigo" }]} icon={<Store size={18} color={GREEN} />} title="Buscar Estabelecimento" subtitle="Busque por um estabelecimento cadastrado:" onChange={setEstabelecimento} required /></Section>

      <Section title="Estabelecimento Agropecuário"><SimNao label="Possui auxílio de um Estabelecimento Agropecuário próximo para o alojamento de animais?" name="possui-auxilio-edicao" value={possuiAuxilio} onChange={setPossuiAuxilio} required /></Section>

      <Section title="Responsável Técnico"><DynamicListWrapper items={responsaveis} behavior="at-least-one" addButtonLabel="Adicionar Responsável" itemLabel="Responsável" onAddItem={() => setResponsaveis((itens) => [...itens, null])} onRemoveItem={(index: number) => setResponsaveis((itens) => itens.filter((_, i) => i !== index))} variant="plain" showCounter smallCounter>{(item: any, index: number) => <EntitySearchInput label="Responsável Técnico" placeholder="Buscar por um responsável técnico" value={item?.nome || ""} data={RESPONSAVEIS_EVENTO_MOCK} searchKeys={["nome", "municipio"]} columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]} icon={<User size={18} color={GREEN} />} title="Buscar Responsável Técnico" subtitle="Busque por um responsável técnico cadastrado:" onChange={(entidade) => setResponsaveis((itens) => itens.map((atual, i) => i === index ? entidade : atual))} />}</DynamicListWrapper></Section>

      <Section title="Anexo"><div className="flex flex-col gap-6">{anexos.map((anexo, index) => <div key={anexo.id} className="flex gap-4 items-start w-full"><div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">{index + 1}</div><div className="flex-1 flex gap-3 items-start"><UploadField label="Documento" required fileName={anexo.nome} onSelectFile={() => setAnexos((itens) => itens.map((item, i) => i === index ? { ...item, nome: `documento_geral_${index + 1}.pdf` } : item))} />{anexo.nome && <><div className="flex-1"><FloatInput label="Descrição" value={anexo.descricao || ""} onChange={(valor) => setAnexos((itens) => itens.map((item, i) => i === index ? { ...item, descricao: valor } : item))} /></div><button type="button" className="h-12 p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md"><Download size={20} /></button></>}<button type="button" onClick={() => setAnexos((itens) => itens.filter((_, i) => i !== index))} className="h-12 p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button></div></div>)}<button type="button" onClick={() => setAnexos((itens) => [...itens, { id: uid("anx"), nome: "", descricao: "" }])} className="flex items-center mt-5 gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start"><PlusCircle size={16} /> Adicionar Anexo</button></div></Section>

      <Section title="Observações"><LargeTextArea label="Observação" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." /></Section>
    </main>

    {confirmar && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><h3 className="text-lg font-bold text-gray-900">Salvar alterações?</h3><p className="text-sm text-gray-500 mt-1">Confirme para atualizar o evento pecuário.</p><div className="flex gap-3 justify-center mt-6"><button onClick={() => setConfirmar(false)} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Cancelar</button><button onClick={() => { setConfirmar(false); setSucesso(true); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Salvar</button></div></div></div>}
    {sucesso && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><h3 className="text-lg font-bold text-gray-900">Alterações salvas com sucesso!</h3><div className="flex gap-3 justify-center mt-6"><button onClick={() => onNavigate("evento-pecuario")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button><button onClick={() => onNavigate("visualizar-evento-pecuario", registroAtual())} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button></div></div></div>}
  </div>;
}
