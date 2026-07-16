import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarInstituicaoEnsinoPesquisaPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || { codigo: "IEP-0001", nome: "Instituto de Ensino e Pesquisa Rural", situacao: "Ativo" };
  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="dashboard"
      backRoute="dashboard"
      backLabel="Inicial"
      title="Visualizar Instituição de Ensino e Pesquisa"
      entityKey={`instituicao-ensino-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal"]}
      fields={[
        { label: "Código", value: registro.codigo || "" },
        { label: "Nome da Instituição", value: registro.nome || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
