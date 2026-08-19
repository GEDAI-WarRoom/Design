import { Navbar } from "../../../components/Navbar";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { AdicionarDoencaPage } from "./AdicionarDoenca";
import { obterDoenca, obterHistoricoDoenca } from "./doencaData";

export function VisualizarDoencaPage(props: any) {
  const doencaAtual = obterDoenca(props.dados);
  const historico = obterHistoricoDoenca(doencaAtual);
  return <div className="min-h-screen bg-[#f2f3f5]"><Navbar onLogout={props.onLogout} onNavigate={props.onNavigate} currentScreen="doenca" hideSearch /><HistoricoCadastroLayout itens={historico} ativo resetKey={doencaAtual.id} tituloHistorico="Histórico da Doença" descricaoHistorico="Histórico de alterações realizadas no cadastro da doença.">{({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => <AdicionarDoencaPage {...props} mode="view" dados={dadosSelecionados ?? doencaAtual} esconderNavbar acaoComplementar={botaoHistorico} avisoHistorico={avisoVersao} podeEditar={!visualizandoVersaoAntiga} />}</HistoricoCadastroLayout></div>;
}
