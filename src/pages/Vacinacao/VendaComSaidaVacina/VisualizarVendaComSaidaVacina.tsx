import React from "react";
import { AdicionarVendaComSaidaVacinaPage } from "./AdicionarVendaComSaidaVacina";

export function VisualizarVendaComSaidaVacinaPage(props: any) {
  return <AdicionarVendaComSaidaVacinaPage {...props} mode="view" dados={props.dados} />;
}
