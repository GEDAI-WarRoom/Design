import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgroindustrialSIEMGPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || {
    id: 1,
    codigoUnico: "3100000001",
    nomeComercial: "Frigorífico São José",
    codigoSie: "17126",
    areaAtuacao: "Carne",
    municipioUf: "Lavras - MG",
    situacao: "Ativo",
  };

  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="agroindustrial-sie"
      backRoute="agroindustrial-sie"
      backLabel="Todos os Estabelecimentos Agroindustriais POA - SIE/MG"
      title="Visualizar Estabelecimento Agroindustrial POA - SIE/MG"
      entityKey={`agroindustrial-sie-${registro.id || registro.codigoUnico}`}
      allowedTypes={["Responsável Técnico Animal", "Habilitado para Emissão de GTA"]}
      fields={[
        { label: "Código Único", value: registro.codigoUnico || "" },
        { label: "Nome Comercial", value: registro.nomeComercial || "" },
        { label: "Código SIE", value: registro.codigoSie || "" },
        { label: "Área de Atuação", value: registro.areaAtuacao || "" },
        { label: "Município/UF", value: registro.municipioUf || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
