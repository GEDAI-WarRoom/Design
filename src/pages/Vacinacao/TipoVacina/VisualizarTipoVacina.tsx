import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { obterHistoricoTipoVacina, obterTipoVacina, type TipoVacina } from "./tipoVacinaData";
import { TipoVacinaForm } from "./TipoVacinaForm";

interface Props { onLogout: () => void; onNavigate: (screen: any, data?: any) => void; dados?: TipoVacina; }

export function VisualizarTipoVacinaPage({ onLogout, onNavigate, dados }: Props) {
  const atual = obterTipoVacina(dados) ?? dados;
  if (!atual) return <div className="min-h-screen bg-[#f2f3f5]"><Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch /><main className="mx-auto max-w-[1088px] px-6 py-10 text-center text-sm text-gray-500">Tipo de vacina não encontrado.</main></div>;
  return <div className="min-h-screen bg-[#f2f3f5]">
    <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="tipo-vacina" hideSearch />
    <HistoricoCadastroLayout<TipoVacina> itens={obterHistoricoTipoVacina(atual)} resetKey={atual.id} tituloHistorico="Histórico do Tipo de Vacina" conteudoClassName="flex flex-col gap-5 px-4 py-6 md:px-6">
      {({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => {
        const registro = dadosSelecionados ?? atual;
        return <>
          <span data-current-situacao={atual.situacao} className="hidden" />
          <div><button type="button" onClick={() => onNavigate("tipo-vacina")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} /> Todos os Tipos de Vacina</button><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-semibold text-gray-900">Visualizar Tipo de Vacina</h1><div className="flex items-center gap-3">{botaoHistorico}{!visualizandoVersaoAntiga && <button type="button" onClick={() => onNavigate("editar-tipo-vacina", atual)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"><Pencil size={15} /> Editar</button>}</div></div></div>
          {avisoVersao}
          <TipoVacinaForm value={registro} onChange={() => {}} disabled />
        </>;
      }}
    </HistoricoCadastroLayout>
  </div>;
}
