import { AdicionarEstabelecimentoAgroindustrialPOVPage } from "./AdicionarEstabelecimentoAgroindustrialPOV";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialPOVPage({ onLogout, onNavigate, dados }: PageProps) {
  return <EntityProfessionalsView onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agroindustrial-pov" backRoute="estabelecimento-agroindustrial-pov" backLabel="Todos os Estabelecimentos Agroindustriais POV" title="Visualizar Estabelecimento Agroindustrial POV" entityKey={`estabelecimento-agroindustrial-pov-${dados?.id || "demo"}`} allowedTypes={["Responsável Técnico Vegetal"]} fields={[]} cadastroContent={<AdicionarEstabelecimentoAgroindustrialPOVPage onLogout={onLogout} onNavigate={onNavigate} dados={dados} modo="visualizar" />} onEditCadastro={() => onNavigate("editar-estabelecimento-agroindustrial-pov", dados)} />;
}
