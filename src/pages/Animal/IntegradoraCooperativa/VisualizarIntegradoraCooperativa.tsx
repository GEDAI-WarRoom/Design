import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarIntegradoraCooperativaPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || {
    id: 1,
    codigo: "INT-0001",
    nome: "Avivar Alimentos S/A",
    cnpj: "56.338.814/0001-95",
    tipo: "Integradora",
    estado: "Minas Gerais",
    municipio: "Esmeraldas",
    situacao: "Ativo",
  };

  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="integradora-cooperativa"
      backRoute="integradora-cooperativa"
      backLabel="Todas as Integradoras ou Cooperativas"
      title="Visualizar Integradora / Cooperativa"
      entityKey={`integradora-cooperativa-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal", "Habilitado para Emissão de GTA"]}
      fields={[
        { label: "Código", value: registro.codigo || "" },
        { label: "Nome Comercial", value: registro.nome || "" },
        { label: "CNPJ", value: registro.cnpj || "" },
        { label: "Tipo", value: registro.tipo || "" },
        { label: "Estado", value: registro.estado || "" },
        { label: "Município", value: registro.municipio || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
