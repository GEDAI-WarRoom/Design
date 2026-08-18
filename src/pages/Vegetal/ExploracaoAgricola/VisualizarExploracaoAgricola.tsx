import { obterRegistroMock } from "../../../components/ui/mockCollectionStorage";
import { Navbar } from "../../../components/Navbar";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { COLECAO_EXPLORACOES_AGRICOLAS, obterHistoricoExploracaoAgricola } from "./exploracaoAgricolaData";
import { ExploracaoAgricolaForm } from "./ExploracaoAgricolaForm";

export function VisualizarExploracaoAgricolaPage(props: any) {
  const dados = props.dados ? obterRegistroMock(COLECAO_EXPLORACOES_AGRICOLAS, props.dados) : props.dados;
  if (!dados) return null;
  return <div className="min-h-screen bg-[#f2f3f5]"><Navbar onLogout={props.onLogout} onNavigate={props.onNavigate} currentScreen="exploracao-agricola" hideSearch /><HistoricoCadastroLayout itens={obterHistoricoExploracaoAgricola(dados)} ativo resetKey={dados.id} tituloHistorico="Histórico da Exploração Agrícola" descricaoHistorico="Histórico de alterações realizadas no cadastro da exploração agrícola.">{({ botaoHistorico, avisoVersao, dadosSelecionados, visualizandoVersaoAntiga }) => <ExploracaoAgricolaForm {...props} dados={dadosSelecionados ?? dados} mode="view" esconderNavbar acaoHistorico={botaoHistorico} avisoHistorico={avisoVersao} podeEditar={!visualizandoVersaoAntiga} />}</HistoricoCadastroLayout></div>;
}
