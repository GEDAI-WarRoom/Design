import React from "react";
import { AdicionarVacinadorPage } from "./AdicionarVacinador";

export function VisualizarVacinadorPage(props: any) {
  return <AdicionarVacinadorPage {...props} mode="view" dados={props.dados} />;
}
