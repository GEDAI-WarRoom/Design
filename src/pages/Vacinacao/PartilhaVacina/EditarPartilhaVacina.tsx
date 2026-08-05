import React from "react";
import { AdicionarPartilhaVacinaPage } from "./AdicionarPartilhaVacina";

export function EditarPartilhaVacinaPage(props: any) {
  return <AdicionarPartilhaVacinaPage {...props} mode="edit" dados={props.dados} />;
}
