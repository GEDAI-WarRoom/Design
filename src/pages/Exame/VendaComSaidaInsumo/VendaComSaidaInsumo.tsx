import React from "react";
import { VendaComSaidaVacinaPage } from "../../Vacinacao/VendaComSaidaVacina/VendaComSaidaVacina";
import { AdicionarVendaComSaidaVacinaPage } from "../../Vacinacao/VendaComSaidaVacina/AdicionarVendaComSaidaVacina";

export function VendaComSaidaInsumoPage(props: any) {
  return <VendaComSaidaVacinaPage {...props} tipoProduto="insumo" />;
}

export function AdicionarVendaComSaidaInsumoPage(props: any) {
  return <AdicionarVendaComSaidaVacinaPage {...props} tipoProduto="insumo" />;
}

export function VisualizarVendaComSaidaInsumoPage(props: any) {
  return (
    <AdicionarVendaComSaidaVacinaPage
      {...props}
      tipoProduto="insumo"
      mode="view"
      dados={props.dados}
    />
  );
}

export function EditarVendaComSaidaInsumoPage(props: any) {
  return (
    <AdicionarVendaComSaidaVacinaPage
      {...props}
      tipoProduto="insumo"
      mode="edit"
      dados={props.dados}
    />
  );
}
