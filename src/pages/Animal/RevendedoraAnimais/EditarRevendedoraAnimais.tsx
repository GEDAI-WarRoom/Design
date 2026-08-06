import { AdicionarRevendedoraAnimaisPage } from "./AdicionarRevendedoraAnimais";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function EditarRevendedoraAnimaisPage({ onLogout, onNavigate, dados }: PageProps) {
  return (
    <AdicionarRevendedoraAnimaisPage
      onLogout={onLogout}
      onNavigate={onNavigate}
      dados={dados}
      modo="editar"
    />
  );
}
