import { AdicionarEstabelecimentoAgroindustrialSIEMGPage } from "./AdicionarEstabelecimentoAgroindustrialSIEMG";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialSIEMGPage({ onLogout, onNavigate, dados }: PageProps) {
  return <EntityProfessionalsView onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agroindustrial-sie-mg" backRoute="estabelecimento-agroindustrial-sie-mg" backLabel="Todos os Estabelecimentos Agroindustriais" title="Visualizar Estabelecimento Agroindustrial POA - SIE/MG" entityKey={`estabelecimento-agroindustrial-sie-mg-${dados?.id || "demo"}`} allowedTypes={["Responsável Técnico Animal", "Responsável Legal"]} fields={[]} cadastroContent={<AdicionarEstabelecimentoAgroindustrialSIEMGPage onLogout={onLogout} onNavigate={onNavigate} dados={dados} modo="visualizar" />} onEditCadastro={() => onNavigate("editar-estabelecimento-agroindustrial-sie-mg", dados)} />;
}
