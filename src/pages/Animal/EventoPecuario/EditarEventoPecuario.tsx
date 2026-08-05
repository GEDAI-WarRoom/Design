import React from "react";
import { AdicionarEventoPecuarioPage } from "./AdicionarEventoPecuario";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
  data?: any;
}

export function EditarEventoPecuarioPage(props: PageProps) {
  return (
    <AdicionarEventoPecuarioPage
      {...props}
      mode="edit"
      dados={props.dados ?? props.data}
    />
  );
}
