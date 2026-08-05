import React from "react";
import { AdicionarDeclaracaoVacinacaoPage } from "./AdicionarDeclaracaoVacinacao";

export function EditarDeclaracaoVacinacaoPage(props: any) {
  return <AdicionarDeclaracaoVacinacaoPage {...props} mode="edit" dados={props.dados} />;
}
