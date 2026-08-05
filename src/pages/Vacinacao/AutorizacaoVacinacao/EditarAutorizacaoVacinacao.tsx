import React from "react";
import { AdicionarAutorizacaoVacinacaoPage } from "./AdicionarAutorizacaoVacinacao";

export function EditarAutorizacaoVacinacaoPage(props: any) {
  return <AdicionarAutorizacaoVacinacaoPage {...props} mode="edit" dados={props.dados} />;
}
