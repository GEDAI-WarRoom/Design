import React from "react";
import { AdicionarLancamentoDosesVacinaPage } from "./AdicionarLancamentoDoses";

export function VisualizarLancamentoDosesVacinaPage(props: any) {
  return <AdicionarLancamentoDosesVacinaPage {...props} mode="view" dados={props.dados} />;
}
