import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { atualizarTipoVacina, obterTipoVacina, type TipoVacina } from "./tipoVacinaData";
import { RequiredFieldsNotice, TipoVacinaForm, type TipoVacinaFormValue } from "./TipoVacinaForm";

const GREEN = "#1A7A3C";
interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: TipoVacina | null; }
const toFormValue = (dados: TipoVacina | null): TipoVacinaFormValue => ({ nome: dados?.nome ?? "", exigeReceituario: dados?.exigeReceituario ?? "", doencas: dados?.doencas ?? [], especies: dados?.especies ?? [], situacao: dados?.situacao ?? "Ativo" });

export function EditarTipoVacinaPage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInicial = dados ?? obterTipoVacina(null);
  const [form, setForm] = useState<TipoVacinaFormValue>(toFormValue(registroInicial));
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const formValido = form.nome.trim() !== "" && form.exigeReceituario !== "" && form.doencas.length > 0 && form.especies.length > 0;
  const handleSalvar = () => { setTentouSalvar(true); if (!formValido || !form.exigeReceituario || !registroInicial) return; atualizarTipoVacina(registroInicial.id, { ...form, nome: form.nome.trim(), exigeReceituario: form.exigeReceituario }); onNavigate("tipo-vacina"); };
  return <div className="min-h-screen bg-[#f2f3f5] pb-24"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch /><main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5"><div><button type="button" onClick={() => onNavigate("tipo-vacina")} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} />Todos os Tipos de Vacina</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Editar Tipo de Vacina</h1><button type="button" onClick={handleSalvar} className="px-5 py-3 rounded-md text-white text-sm font-semibold" style={{ backgroundColor: GREEN }}>Salvar</button></div></div><RequiredFieldsNotice /><TipoVacinaForm value={form} onChange={setForm} showSituacao />{tentouSalvar && !formValido && <p className="text-sm text-red-500 font-medium">Preencha todos os campos obrigatórios para continuar.</p>}</main></div>;
}
