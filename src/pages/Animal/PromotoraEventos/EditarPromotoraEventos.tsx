import React from "react";
import { AdicionarPromotoraEventosPage } from "./AdicionarPromotoraEventos";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: any;
  dados?: any;
}

export function EditarPromotoraEventosPage(props: PageProps) {
  return (
    <AdicionarPromotoraEventosPage
      {...props}
      mode="edit"
      data={props.data ?? props.dados}
    />
  );
}
