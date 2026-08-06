import { AdicionarRevendedoraAnimaisPage } from "./AdicionarRevendedoraAnimais";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarRevendedoraAnimaisPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || { id: 1, codigo: "3123659848", nome: "Revendedora São José" };
  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="revendedora-animais"
      backRoute="revendedora-animais"
      backLabel="Todas as Revendedoras de Animais Vivos"
      title="Visualizar Revendedora de Animais Vivos"
      entityKey={`revendedora-animais-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal", "Habilitado para Emissão de GTA", "Funcionário"]}
      fields={[]}
      onEditCadastro={() => onNavigate("editar-revendedora-animais", registro)}
      cadastroContent={(
        <AdicionarRevendedoraAnimaisPage
          onLogout={onLogout}
          onNavigate={onNavigate}
          dados={registro}
          modo="visualizar"
          embutido
        />
      )}
    />
  );
}
