import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarEstabelecimentoAgropecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados || {
    id: 1,
    codigo: "51080590041",
    nome: "Fazenda Rio Verde",
    proprietarios: "José Aarão Neto - 555.009.956-40",
    zona: "Rural",
    municipioUf: "Lavras - MG",
    situacao: "Ativo",
  };

  return (
    <EntityProfessionalsView
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentScreen="estabelecimento-agropecuario"
      backRoute="estabelecimento-agropecuario"
      backLabel="Todos os Estabelecimentos Agropecuários"
      title="Visualizar Estabelecimento Agropecuário"
      entityKey={`estabelecimento-agropecuario-${registro.id || registro.codigo}`}
      allowedTypes={["Responsável Técnico Animal", "Responsável Técnico Vegetal"]}
      fields={[
        { label: "Código do Estabelecimento", value: registro.codigo || "" },
        { label: "Nome do Estabelecimento", value: registro.nome || "" },
        { label: "Proprietários", value: registro.proprietarios || "" },
        { label: "Zona", value: registro.zona || "" },
        { label: "Município/UF", value: registro.municipioUf || "" },
        { label: "Situação", value: registro.situacao || "" },
      ]}
    />
  );
}
