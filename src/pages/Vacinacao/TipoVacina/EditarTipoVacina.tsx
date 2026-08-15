import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { atualizarTipoVacina, obterTipoVacina, type TipoVacina } from "./tipoVacinaData";
import { RequiredFieldsNotice, TipoVacinaForm } from "./TipoVacinaForm";

interface Props { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: TipoVacina; }

export function EditarTipoVacinaPage({ onLogout, onNavigate, dados }: Props) {
  const inicial = obterTipoVacina(dados) ?? dados;
  const [form, setForm] = useState<TipoVacina | null>(inicial ?? null);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  useEffect(() => {
    const atualizarSituacao = (event: Event) => {
      const detalhe = (event as CustomEvent<{
        currentScreen: string;
        situacao: TipoVacina["situacao"];
      }>).detail;
      if (detalhe?.currentScreen === "tipo-vacina") {
        setForm((atual) => atual ? { ...atual, situacao: detalhe.situacao } : atual);
      }
    };
    window.addEventListener("situacao-cadastro-alterada", atualizarSituacao);
    return () => window.removeEventListener("situacao-cadastro-alterada", atualizarSituacao);
  }, []);
  if (!form) return <div className="min-h-screen bg-[#f2f3f5]"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch /><main className="mx-auto max-w-[1088px] px-6 py-10 text-center text-sm text-gray-500">Tipo de vacina não encontrado.</main></div>;
  const valido = Boolean(form.nome.trim() && form.doencas.length && form.especies.length);
  const salvar = () => {
    setTentouSalvar(true);
    if (!valido) return;
    const atualizado = atualizarTipoVacina({ ...form, nome: form.nome.trim() });
    onNavigate("visualizar-tipo-vacina", atualizado);
  };
  return <div className="min-h-screen bg-[#f2f3f5] pb-20">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch />
    <main data-situacao={form.situacao} className="mx-auto flex max-w-[1300px] flex-col gap-5 px-4 py-6 md:px-6">
      <div><button type="button" onClick={() => onNavigate("visualizar-tipo-vacina", form)} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Visualizar Tipo de Vacina</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Editar Tipo de Vacina</h1><button type="button" onClick={salvar} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Salvar</button></div></div>
      <RequiredFieldsNotice /><TipoVacinaForm value={form} onChange={(value) => setForm({ ...form, ...value })} />
      {tentouSalvar && !valido && <p className="text-sm font-medium text-red-500">Preencha todos os campos obrigatórios para continuar.</p>}
    </main>
  </div>;
}
