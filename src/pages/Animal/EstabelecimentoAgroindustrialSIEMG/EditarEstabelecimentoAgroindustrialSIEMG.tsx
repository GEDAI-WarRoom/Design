import { AdicionarEstabelecimentoAgroindustrialSIEMGPage } from "./AdicionarEstabelecimentoAgroindustrialSIEMG";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function EditarEstabelecimentoAgroindustrialSIEMGPage({ onLogout, onNavigate, dados }: PageProps) {
  return (
    <AdicionarEstabelecimentoAgroindustrialSIEMGPage
      onLogout={onLogout}
      onNavigate={onNavigate}
      dados={dados}
      modo="editar"
    />
  );
}
