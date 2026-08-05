import React from "react";
import { AdicionarPartilhaVacinaPage } from "./AdicionarPartilhaVacina";

export function VisualizarPartilhaVacinaPage(props: any) {
  return <AdicionarPartilhaVacinaPage {...props} mode="view" dados={props.dados} />;
}
