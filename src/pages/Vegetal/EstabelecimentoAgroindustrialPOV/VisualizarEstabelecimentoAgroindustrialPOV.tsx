import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialPOVPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || { codigo: "POV-0001", nome: "Unidade Vegetal Campo Verde", situacao: "Ativo" };
  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="dashboard"
      backRoute="dashboard"
      backLabel="Inicial"
      title="Visualizar Estabelecimento Agroindustrial POV"
      entityKey={`agroindustrial-pov-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Vegetal"]}
      fields={[
        { label: "Código", value: registro.codigo || "" },
        { label: "Nome do Estabelecimento", value: registro.nome || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
