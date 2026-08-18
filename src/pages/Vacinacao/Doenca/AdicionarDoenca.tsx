import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Dna, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { DynamicListWrapper, EntitySearchInput } from "../../../components/ui/EntitySearch";
import { FloatInput } from "../../../components/ui/FormKit";
import { CadastroVacinacaoHeader, cadastroVacinacaoPageClass, type CadastroVacinacaoModeProps } from "../shared/CadastroVacinacaoMode";
import { ESPECIES_DOENCA, nomeDoencaExiste, salvarDoenca, type Doenca, type EspecieDoenca, type SituacaoDoenca } from "./doencaData";

const GREEN = "#1A7A3C";
const novaEspecie = () => ({ uid: `especie-${Date.now()}-${Math.random()}`, especie: null as EspecieDoenca | null });

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return <section className="overflow-visible rounded-xl bg-white shadow-sm"><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-6 py-4 text-left"><span className="font-semibold text-gray-800">{title}</span>{open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}</button>{open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}</section>;
}

interface PageProps extends CadastroVacinacaoModeProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  acaoComplementar?: ReactNode;
  avisoHistorico?: ReactNode;
  esconderNavbar?: boolean;
  podeEditar?: boolean;
}

export function AdicionarDoencaPage({ onLogout, onNavigate, mode = "create", dados, acaoComplementar, avisoHistorico, esconderNavbar = false, podeEditar = true }: PageProps) {
  const registro = dados as Doenca | undefined;
  const [nome, setNome] = useState(registro?.nome ?? "");
  const [especies, setEspecies] = useState(() => registro?.especies?.map((especie) => ({ uid: `especie-${especie.id}`, especie })) ?? [novaEspecie()]);
  const [situacao, setSituacao] = useState<SituacaoDoenca>(registro?.situacao ?? "Ativo");
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [erroDuplicado, setErroDuplicado] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<Doenca | null>(null);
  const somenteLeitura = mode === "view";
  const especiesValidas = especies.map((item) => item.especie).filter(Boolean) as EspecieDoenca[];

  useEffect(() => {
    const atualizarSituacao = (event: Event) => {
      const detalhe = (event as CustomEvent<{ currentScreen: string; situacao: SituacaoDoenca }>).detail;
      if (detalhe?.currentScreen === "doenca") setSituacao(detalhe.situacao);
    };
    window.addEventListener("situacao-cadastro-alterada", atualizarSituacao);
    return () => window.removeEventListener("situacao-cadastro-alterada", atualizarSituacao);
  }, []);

  const salvar = () => {
    setTentouSalvar(true); setErroDuplicado(false);
    if (!nome.trim() || especiesValidas.length !== especies.length) return;
    if (nomeDoencaExiste(nome, registro?.id)) { setErroDuplicado(true); return; }
    setRegistroSalvo(salvarDoenca({ id: registro?.id, nome: nome.trim(), especies: especiesValidas, situacao }));
    setSucesso(true);
  };
  const registroAtual = registroSalvo ?? { id: registro?.id ?? "novo", nome, especies: especiesValidas, situacao } as Doenca;

  return <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5] pb-12")}>
    {!esconderNavbar && <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="doenca" hideSearch />}
    <main data-situacao-container data-current-situacao={situacao} className="mx-auto flex max-w-[1300px] flex-col gap-5 px-4 py-6 md:px-6">
      <div><button type="button" onClick={() => onNavigate("doenca")} className="mb-3 text-sm font-semibold" style={{ color: GREEN }}>← Todas Doenças</button><CadastroVacinacaoHeader mode={mode} nomeCadastro="Doença" rotaEditar="editar-doenca" dados={registro} onNavigate={onNavigate} onSubmit={salvar} acaoComplementar={acaoComplementar} podeEditar={podeEditar} /></div>
      {avisoHistorico}
      <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm"><Info size={20} className="text-gray-500" /><p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p></div>
      <Section title="Informações Básicas"><FloatInput label="Nome da Doença" required maxLength={255} value={nome} onChange={(value) => { setNome(value); setErroDuplicado(false); }} disabled={somenteLeitura} error={tentouSalvar && !nome.trim() ? "Campo obrigatório." : erroDuplicado ? "Já existe uma doença cadastrada com este nome." : undefined} /></Section>
      <Section title="Espécies Suscetíveis"><DynamicListWrapper items={especies} behavior="at-least-one" addButtonLabel="Adicionar Espécie" itemLabel="Espécie" showCounter onAddItem={() => setEspecies((items) => [...items, novaEspecie()])} onRemoveItem={(index: number) => setEspecies((items) => items.length === 1 ? items : items.filter((_, itemIndex) => itemIndex !== index))}>{(item: { uid: string; especie: EspecieDoenca | null }) => <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><EntitySearchInput label="Espécie" required placeholder="Buscar por nome da espécie" value={item.especie?.nome ?? ""} data={ESPECIES_DOENCA} searchKeys={["nome", "grupo"]} columns={[{ label: "Espécie", key: "nome" }, { label: "Grupo", key: "grupo" }]} icon={<Dna size={18} color={GREEN} />} title="Buscar Espécie" subtitle="Busque por uma espécie cadastrada:" onChange={(especie) => setEspecies((items) => items.map((current) => current.uid === item.uid ? { ...current, especie } : current))} error={tentouSalvar && !item.especie ? "Campo obrigatório." : undefined} /></div>}</DynamicListWrapper></Section>
    </main>
    {sucesso && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl"><div className="mb-4 flex justify-center"><div className="rounded-full bg-[#E6F4EA] p-3"><CheckCircle2 size={34} color={GREEN} /></div></div><h2 className="mb-1 text-lg font-semibold text-gray-900">Doença {mode === "edit" ? "atualizada" : "cadastrada"} com sucesso</h2><p className="mb-6 text-sm text-gray-500">A doença <span className="font-medium text-gray-700">{nome}</span> foi {mode === "edit" ? "atualizada" : "cadastrada"} no sistema.</p><div className="flex justify-center gap-3"><button type="button" onClick={() => onNavigate("doenca")} className="rounded-md border px-5 py-2.5 text-sm font-semibold" style={{ borderColor: GREEN, color: GREEN }}>Voltar</button><button type="button" onClick={() => onNavigate("visualizar-doenca", registroAtual)} className="rounded-md px-5 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>Visualizar</button></div></div></div>}
  </div>;
}
