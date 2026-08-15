import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { criarTipoVacina, type TipoVacina, type TipoVacinaDraft } from "./tipoVacinaData";
import { RequiredFieldsNotice, TipoVacinaForm } from "./TipoVacinaForm";

interface Props { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; }
const INICIAL: TipoVacinaDraft = { nome: "", exigeReceituario: false, doencas: [], especies: [], situacao: "Ativo" };

export function AdicionarTipoVacinaPage({ onLogout, onNavigate }: Props) {
  const [form, setForm] = useState<TipoVacinaDraft>(INICIAL);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [salvo, setSalvo] = useState<TipoVacina | null>(null);
  const valido = Boolean(form.nome.trim() && form.doencas.length && form.especies.length);
  const salvar = () => {
    setTentouSalvar(true);
    if (!valido) return;
    setSalvo(criarTipoVacina({ ...form, nome: form.nome.trim(), situacao: "Ativo" }));
  };
  return <div className="min-h-screen bg-[#f2f3f5] pb-20">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch />
    <main className="mx-auto flex max-w-[1300px] flex-col gap-5 px-4 py-6 md:px-6">
      <div><button type="button" onClick={() => onNavigate("tipo-vacina")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Todos os Tipos de Vacina</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Adicionar Tipo de Vacina</h1><button type="button" onClick={salvar} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar</button></div></div>
      <RequiredFieldsNotice /><TipoVacinaForm value={form} onChange={setForm} />
      {tentouSalvar && !valido && <p className="text-sm font-medium text-red-500">Preencha todos os campos obrigatórios para continuar.</p>}
    </main>
    {salvo && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h3 className="text-lg font-bold text-gray-900">Tipo de vacina cadastrado com sucesso!</h3><p className="mt-1 text-sm text-gray-500">O tipo de vacina <span className="font-medium text-gray-700">{salvo.nome}</span> foi cadastrado.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => onNavigate("tipo-vacina")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-tipo-vacina", salvo)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button></div></div></div>}
  </div>;
}
