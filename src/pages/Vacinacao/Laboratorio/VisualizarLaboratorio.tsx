import React from "react";
import { Navbar } from "../../../components/Navbar";
import { HistoricoCadastroLayout } from "../../../components/ui/HistoricoCadastroLayout";
import { obterRegistroMock } from "../../../components/ui/mockCollectionStorage";
import { AdicionarLaboratorioPage } from "./AdicionarLaboratorio";
import { obterHistoricoLaboratorio } from "./laboratorioData";

export function VisualizarLaboratorioPage(props: any) {
  const registro = obterRegistroMock("laboratorios", props.dados);
  const historico = obterHistoricoLaboratorio(registro);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={props.onLogout} onNavigate={props.onNavigate} currentScreen="laboratorio" hideSearch />
      <HistoricoCadastroLayout
        itens={historico}
        resetKey={registro.id}
        tituloHistorico="Histórico do Laboratório"
        descricaoVersaoAntiga="Esta é uma versão anterior do cadastro do laboratório."
      >
        {({ avisoVersao, botaoHistorico, dadosSelecionados, versaoSelecionada }) => (
          <AdicionarLaboratorioPage
            key={versaoSelecionada?.id ?? registro.id}
            {...props}
            mode="view"
            dados={dadosSelecionados ?? registro}
            acaoHistorico={botaoHistorico}
            avisoHistorico={avisoVersao}
            ocultarNavbar
          />
        )}
      </HistoricoCadastroLayout>
    </div>
  );
}
