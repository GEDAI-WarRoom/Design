import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || { codigo: "POA-OUT-0001", nome: "Agroindústria Serra Verde", situacao: "Ativo" };
  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="dashboard"
      backRoute="dashboard"
      backLabel="Inicial"
      title="Visualizar Estabelecimento Agroindustrial POA - Outras Inspeções"
      entityKey={`agroindustrial-outras-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal"]}
      fields={[
        { label: "Código", value: registro.codigo || "" },
        { label: "Nome do Estabelecimento", value: registro.nome || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
