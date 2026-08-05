import React from "react";
import { AdicionarDoencaPage } from "./AdicionarDoenca";

export function EditarDoencaPage(props: any) {
  return <AdicionarDoencaPage {...props} mode="edit" dados={props.dados} />;
}
