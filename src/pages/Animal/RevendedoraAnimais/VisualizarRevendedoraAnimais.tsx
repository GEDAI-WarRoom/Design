import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarRevendedoraAnimaisPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || {
    id: 1,
    codigo: "3123659848",
    nome: "Revendedora São José",
    grupo: "Aves",
    especie: "Codorna",
    municipio: "Lavras",
    uf: "MG",
    situacao: "Ativo",
  };

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
      fields={[
        { label: "Código da Revendedora", value: registro.codigo || "" },
        { label: "Nome da Revendedora", value: registro.nome || "" },
        { label: "Grupo", value: registro.grupo || "" },
        { label: "Espécie", value: registro.especie || "" },
        { label: "Município/UF", value: [registro.municipio, registro.uf].filter(Boolean).join(" - ") },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
