import { EntityProfessionalsView } from "../../../components/ui/EntityProfessionalsView";
import {
  ESTABELECIMENTOS_INICIAIS,
  obterEstabelecimentoAgropecuario,
  obterHistoricoEstabelecimentoAgropecuario,
  type EstabelecimentoAgropecuario,
} from "./estabelecimentoAgropecuarioData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EstabelecimentoAgropecuario;
}

export function VisualizarEstabelecimentoAgropecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInformado = dados ?? ESTABELECIMENTOS_INICIAIS[0];
  const registro =
    obterEstabelecimentoAgropecuario(
      registroInformado.id ?? registroInformado.codigo,
    ) ?? registroInformado;
  const historico = obterHistoricoEstabelecimentoAgropecuario(registro);

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
      historicoCadastros={historico}
      onEdit={() => onNavigate("editar-estabelecimento-agropecuario", registro)}
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
