import { AdicionarEstabelecimentoAgroindustrialPOVPage } from "./AdicionarEstabelecimentoAgroindustrialPOV";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialPOVPage({ onLogout, onNavigate, dados }: PageProps) {
  return (
    <AdicionarEstabelecimentoAgroindustrialPOVPage
      onLogout={onLogout}
      onNavigate={onNavigate}
      dados={dados}
      modo="visualizar"
    />
  );
}
