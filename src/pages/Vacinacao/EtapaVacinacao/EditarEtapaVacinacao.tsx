import React from "react";
import { AdicionarEtapaVacinacaoPage } from "./AdicionarEtapaVacinacao";

export function EditarEtapaVacinacaoPage(props: any) {
  return <AdicionarEtapaVacinacaoPage {...props} mode="edit" dados={props.dados} />;
}
