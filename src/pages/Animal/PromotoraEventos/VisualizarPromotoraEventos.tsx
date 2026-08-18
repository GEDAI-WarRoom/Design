import { AdicionarPromotoraEventosPage } from "./AdicionarPromotoraEventos";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: any;
  dados?: any;
}

export function VisualizarPromotoraEventosPage(props: PageProps) {
  return <EntityProfessionalsView onLogout={props.onLogout} onNavigate={props.onNavigate} currentScreen="promotora-eventos" backRoute="promotora-eventos" backLabel="Todas as Promotoras de Eventos" title="Visualizar Promotora de Eventos Pecuários" entityKey={`promotora-eventos-${(props.data ?? props.dados)?.id || "demo"}`} allowedTypes={["Responsável Técnico Animal"]} fields={[]} cadastroContent={<AdicionarPromotoraEventosPage {...props} mode="view" data={props.data ?? props.dados} />} onEditCadastro={() => props.onNavigate("editar-promotora-eventos", props.data ?? props.dados)} />;
}
