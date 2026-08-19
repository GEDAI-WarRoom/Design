import { obterRegistroMock } from "../../../components/ui/mockCollectionStorage";
import { COLECAO_EXPLORACOES_AGRICOLAS } from "./exploracaoAgricolaData";
import { ExploracaoAgricolaForm } from "./ExploracaoAgricolaForm";

export function EditarExploracaoAgricolaPage(props: any) {
  const dados = props.dados ? obterRegistroMock(COLECAO_EXPLORACOES_AGRICOLAS, props.dados) : props.dados;
  return <ExploracaoAgricolaForm {...props} dados={dados} mode="edit" />;
}
