import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { criarTipoVacina, type TipoVacina } from "./tipoVacinaData";
import { RequiredFieldsNotice, TipoVacinaForm, type TipoVacinaFormValue } from "./TipoVacinaForm";

const GREEN = "#1A7A3C";
const criarEstadoInicial = (): TipoVacinaFormValue => ({ nome: "", exigeReceituario: "", doencas: [], especies: [], situacao: "Ativo" });

interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; }

export function AdicionarTipoVacinaPage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<TipoVacinaFormValue>(criarEstadoInicial());
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<TipoVacina | null>(null);
  const formValido = form.nome.trim() !== "" && form.exigeReceituario !== "" && form.doencas.length > 0 && form.especies.length > 0;

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido || !form.exigeReceituario) return;
    setRegistroSalvo(criarTipoVacina({ ...form, nome: form.nome.trim(), exigeReceituario: form.exigeReceituario, situacao: "Ativo" }));
  };

  return <div className="min-h-screen bg-[#f2f3f5] pb-24">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch />
    <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
      <div><button type="button" onClick={() => onNavigate("tipo-vacina")} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} />Todos os Tipos de Vacina</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Adicionar Tipo de Vacina</h1><button type="button" onClick={handleSalvar} className="px-5 py-3 rounded-md text-white text-sm font-semibold" style={{ backgroundColor: GREEN }}>Adicionar</button></div></div>
      <RequiredFieldsNotice />
      <TipoVacinaForm value={form} onChange={setForm} />
      {tentouSalvar && !formValido && <p className="text-sm text-red-500 font-medium">Preencha todos os campos obrigatórios para continuar.</p>}
    </main>
    {registroSalvo && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div><h3 className="text-lg font-bold text-gray-900">Tipo de vacina cadastrado com sucesso!</h3><p className="text-sm text-gray-500 mt-1">O tipo de vacina <span className="font-medium text-gray-700">{registroSalvo.nome}</span> foi cadastrado.</p><div className="flex gap-3 justify-center mt-6"><button type="button" onClick={() => onNavigate("tipo-vacina")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button><button type="button" onClick={() => onNavigate("visualizar-tipo-vacina", registroSalvo)} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button></div></div></div>}
  </div>;
}
