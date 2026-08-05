import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { AjusteDosesInsumoForm, RequiredFieldsNotice, type AjusteDosesInsumoFormValue } from "./AjusteDosesInsumoForm";
import { obterAjusteDosesInsumo, salvarAjusteDosesInsumo, type AjusteDosesInsumo } from "./ajusteDosesInsumoData";

const GREEN = "#1A7A3C";
interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: AjusteDosesInsumo | null; }
const toFormValue = (registro: AjusteDosesInsumo): AjusteDosesInsumoFormValue => ({ revendedora: registro.revendedora, notasFiscais: registro.notasFiscais, situacao: registro.situacao });

export function EditarAjusteDosesInsumoPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterAjusteDosesInsumo();
  const [form, setForm] = useState<AjusteDosesInsumoFormValue | null>(() => registro ? toFormValue(registro) : null);
  const [confirmar, setConfirmar] = useState(false);
  const [salvo, setSalvo] = useState<AjusteDosesInsumo | null>(null);
  if (!registro || !form) return null;

  const salvar = () => {
    const atualizado = salvarAjusteDosesInsumo(registro.id, { revendedora: form.revendedora!, notasFiscais: form.notasFiscais });
    setConfirmar(false);
    if (atualizado) setSalvo(atualizado);
  };

  return <div className="min-h-screen bg-[#f2f3f5] pb-24"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="ajuste-doses-insumo" hideSearch /><main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5"><div><button type="button" onClick={() => onNavigate("visualizar-ajuste-doses-insumo", registro)} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} /> Visualizar Ajuste de Doses de Insumo</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Editar Ajuste de Doses de Insumo</h1><button type="button" onClick={() => setConfirmar(true)} className="px-5 h-10 bg-[#1A7A3C] text-white text-sm font-semibold rounded-md">Salvar</button></div></div><RequiredFieldsNotice /><AjusteDosesInsumoForm value={form} onChange={setForm} mode="edit" /></main>{confirmar && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl"><h2 className="text-lg font-bold text-gray-900">Salvar alterações?</h2><p className="mt-2 text-sm text-gray-600">Confirme para atualizar o ajuste de doses.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => setConfirmar(false)} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">Cancelar</button><button type="button" onClick={salvar} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Salvar</button></div></div></div>}{salvo && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl"><h2 className="text-lg font-bold text-gray-900">Alterações salvas com sucesso!</h2><div className="mt-6 flex justify-center gap-3"><button onClick={() => onNavigate("ajuste-doses-insumo")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">Voltar</button><button onClick={() => onNavigate("visualizar-ajuste-doses-insumo", salvo)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white">Visualizar</button></div></div></div>}</div>;
}
