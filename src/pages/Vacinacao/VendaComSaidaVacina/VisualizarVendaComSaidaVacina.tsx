import React from "react";
import { AdicionarVendaComSaidaVacinaPage } from "./AdicionarVendaComSaidaVacina";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { carregarHistoricoCadastro } from "../../../components/ui/historicoCadastroStorage";

export function VisualizarVendaComSaidaVacinaPage(props: any) {
  const registro = props.dados ?? { id: "venda-saida-exemplo", situacao: "Gravada" };
  const agora = new Date();
  const historicoInicial = [{ id: `${registro.id}-inicial`, data: agora.toLocaleDateString("pt-BR"), hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), alteradoPor: "Usuário do sistema", atual: true, dados: registro }];
  const historico = carregarHistoricoCadastro(`venda-saida-vacina:${registro.id}`, historicoInicial);
  return <HistoricoCadastroLayout ativo itens={historico} resetKey={registro.id} tituloHistorico="Histórico da Venda com Saída de Vacina">
    {({ botaoHistorico, avisoVersao, dadosSelecionados }) => <AdicionarVendaComSaidaVacinaPage {...props} mode="view" dados={dadosSelecionados ?? registro} esconderNavbar acaoHistorico={botaoHistorico} avisoHistorico={avisoVersao} />}
  </HistoricoCadastroLayout>;
}
