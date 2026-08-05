import React from "react";
import { AdicionarVendaComSaidaVacinaPage } from "./AdicionarVendaComSaidaVacina";

export function EditarVendaComSaidaVacinaPage(props: any) {
  return <AdicionarVendaComSaidaVacinaPage {...props} mode="edit" dados={props.dados} />;
}
