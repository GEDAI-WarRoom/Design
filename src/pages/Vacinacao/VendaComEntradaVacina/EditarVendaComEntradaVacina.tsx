import React from "react";
import { AdicionarVendaComEntradaVacinaPage } from "./AdicionarVendaComEntradaVacina";

export function EditarVendaComEntradaVacinaPage(props: any) {
  return <AdicionarVendaComEntradaVacinaPage {...props} mode="edit" dados={props.dados} />;
}
