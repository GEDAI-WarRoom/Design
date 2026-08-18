import { AdicionarEstabelecimentoAgroindustrialOutrasInspecoesPage } from "./AdicionarEstabelecimentoAgroindustrialOutrasInspecoes";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage({ onLogout, onNavigate, dados }: PageProps) {
  return <EntityProfessionalsView onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agroindustrial-outras-inspecoes" backRoute="estabelecimento-agroindustrial-outras-inspecoes" backLabel="Todos os Estabelecimentos Agroindustriais" title="Visualizar Estabelecimento Agroindustrial POA - Outras Inspeções" entityKey={`estabelecimento-agroindustrial-outras-${dados?.id || "demo"}`} allowedTypes={["Responsável Técnico Animal"]} fields={[]} cadastroContent={<AdicionarEstabelecimentoAgroindustrialOutrasInspecoesPage onLogout={onLogout} onNavigate={onNavigate} dados={dados} modo="visualizar" />} onEditCadastro={() => onNavigate("editar-estabelecimento-agroindustrial-outras-inspecoes", dados)} />;
}
