import React from "react";
import { AdicionarEventoPecuarioPage } from "./AdicionarEventoPecuario";

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
  dados?: any;
  data?: any;
}

export function VisualizarEventoPecuarioPage({
  onLogout = () => {},
  onNavigate = () => {},
  dados,
  data,
}: PageProps = {}) {
  return (
    <AdicionarEventoPecuarioPage
      onLogout={onLogout}
      onNavigate={onNavigate}
      mode="view"
      dados={dados ?? data}
    />
  );
}

export default VisualizarEventoPecuarioPage;
