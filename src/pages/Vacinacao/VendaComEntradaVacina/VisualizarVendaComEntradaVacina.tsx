import React from "react";
import { AdicionarVendaComEntradaVacinaPage } from "./AdicionarVendaComEntradaVacina";

export function VisualizarVendaComEntradaVacinaPage(props: any) {
  return <AdicionarVendaComEntradaVacinaPage {...props} mode="view" dados={props.dados} />;
}
