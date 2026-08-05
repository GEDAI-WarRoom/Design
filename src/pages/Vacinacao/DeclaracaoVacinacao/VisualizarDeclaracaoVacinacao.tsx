import React from "react";
import { AdicionarDeclaracaoVacinacaoPage } from "./AdicionarDeclaracaoVacinacao";

export function VisualizarDeclaracaoVacinacaoPage(props: any) {
  return <AdicionarDeclaracaoVacinacaoPage {...props} mode="view" dados={props.dados} />;
}
