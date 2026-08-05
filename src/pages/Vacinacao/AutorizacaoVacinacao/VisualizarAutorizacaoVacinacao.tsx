import React from "react";
import { AdicionarAutorizacaoVacinacaoPage } from "./AdicionarAutorizacaoVacinacao";

export function VisualizarAutorizacaoVacinacaoPage(props: any) {
  return <AdicionarAutorizacaoVacinacaoPage {...props} mode="view" dados={props.dados} />;
}
