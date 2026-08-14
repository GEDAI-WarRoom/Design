import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import { obterTipoVacina, type TipoVacina } from "./tipoVacinaData";
import { RequiredFieldsNotice, TipoVacinaForm, type TipoVacinaFormValue } from "./TipoVacinaForm";

const GREEN = "#1A7A3C";
interface PageProps { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: TipoVacina | null; }
const toFormValue = (dados: TipoVacina | null): TipoVacinaFormValue => ({ nome: dados?.nome ?? "", exigeReceituario: dados?.exigeReceituario ?? "", doencas: dados?.doencas ?? [], especies: dados?.especies ?? [], situacao: dados?.situacao ?? "Ativo" });

export function VisualizarTipoVacinaPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterTipoVacina(null);
  return <div className="min-h-screen bg-[#f2f3f5] pb-24"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch /><main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5"><div><button type="button" onClick={() => onNavigate("tipo-vacina")} className="flex items-center gap-1 text-sm mb-3 font-semibold" style={{ color: GREEN }}><ArrowLeft size={15} />Todos os Tipos de Vacina</button><div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-gray-900">Visualizar Tipo de Vacina</h1><CustomButton onClick={() => onNavigate("editar-tipo-vacina", registro)}>Editar</CustomButton></div></div><RequiredFieldsNotice /><TipoVacinaForm value={toFormValue(registro)} onChange={() => {}} disabled showSituacao /></main></div>;
}
