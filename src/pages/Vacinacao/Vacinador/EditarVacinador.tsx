import React from "react";
import { AdicionarVacinadorPage } from "./AdicionarVacinador";

export function EditarVacinadorPage(props: any) {
  return <AdicionarVacinadorPage {...props} mode="edit" dados={props.dados} />;
}
