import React from "react";
import { AdicionarDoencaPage } from "./AdicionarDoenca";

export function VisualizarDoencaPage(props: any) {
  return <AdicionarDoencaPage {...props} mode="view" dados={props.dados} />;
}
