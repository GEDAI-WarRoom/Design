import { AdicionarEstabelecimentoAgroindustrialOutrasInspecoesPage } from "./AdicionarEstabelecimentoAgroindustrialOutrasInspecoes";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage({ onLogout, onNavigate, dados }: PageProps) {
  return (
    <AdicionarEstabelecimentoAgroindustrialOutrasInspecoesPage
      onLogout={onLogout}
      onNavigate={onNavigate}
      dados={dados}
      modo="visualizar"
    />
  );
}
