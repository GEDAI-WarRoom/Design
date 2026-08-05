import React from "react";
import { AdicionarLancamentoDosesVacinaPage } from "./AdicionarLancamentoDoses";

export function EditarLancamentoDosesVacinaPage(props: any) {
  return <AdicionarLancamentoDosesVacinaPage {...props} mode="edit" dados={props.dados} />;
}
