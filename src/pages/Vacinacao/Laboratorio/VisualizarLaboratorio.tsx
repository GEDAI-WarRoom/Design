import React from "react";
import { AdicionarLaboratorioPage } from "./AdicionarLaboratorio";

export function VisualizarLaboratorioPage(props: any) {
  return <AdicionarLaboratorioPage {...props} mode="view" dados={props.dados} />;
}
