import React from "react";
import { AdicionarLaboratorioPage } from "./AdicionarLaboratorio";

export function EditarLaboratorioPage(props: any) {
  return <AdicionarLaboratorioPage {...props} mode="edit" dados={props.dados} />;
}
