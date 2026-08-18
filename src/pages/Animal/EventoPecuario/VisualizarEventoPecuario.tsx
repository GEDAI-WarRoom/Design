import React from "react";
import { AdicionarEventoPecuarioPage } from "./AdicionarEventoPecuario";
import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: any, data?: any) => void;
  dados?: any;
  data?: any;
}

export function VisualizarEventoPecuarioPage({
  onLogout = () => {},
  onNavigate = () => {},
  dados,
  data,
}: PageProps = {}) {
  const registro = dados ?? data;
  return <EntityProfessionalsView onLogout={onLogout} onNavigate={onNavigate} currentScreen="evento-pecuario" backRoute="evento-pecuario" backLabel="Todos os Eventos Pecuários" title="Visualizar Evento Pecuário" entityKey={`evento-pecuario-${registro?.id || "demo"}`} allowedTypes={["Responsável Técnico Animal", "Habilitado para Emissão de GTA"]} fields={[]} cadastroContent={<AdicionarEventoPecuarioPage onLogout={onLogout} onNavigate={onNavigate} mode="view" dados={registro} />} onEditCadastro={() => onNavigate("editar-evento-pecuario", registro)} />;
}

export default VisualizarEventoPecuarioPage;
