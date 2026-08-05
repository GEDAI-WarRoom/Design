import React from "react";
import { AdicionarEtapaVacinacaoPage } from "./AdicionarEtapaVacinacao";

export function VisualizarEtapaVacinacaoPage(props: any) {
  return <AdicionarEtapaVacinacaoPage {...props} mode="view" dados={props.dados} />;
}
