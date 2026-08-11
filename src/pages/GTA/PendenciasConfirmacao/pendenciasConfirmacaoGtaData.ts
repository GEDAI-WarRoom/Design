import { daeExemploUrl } from "../../../imports/documents";
import { listarColecaoMock, salvarColecaoMock } from "../../../mocks/mockDatabase";

export interface PendenciaGta {
	id: number;
	numero: string;
	procedencia: string;
	municipioProcedencia: string;
	destino: string;
	municipioDestino: string;
	dataEmissao: string;
	documentoDaeUrl: string;
}

export type RespostaRecebimentoGta = "confirmar" | "negar";

const COLECAO = "pendencias-confirmacao-gta";

const PENDENCIAS_INICIAIS: PendenciaGta[] = [
	{
		id: 1,
		numero: "768578",
		procedencia: "Fazenda Santa Helena",
		municipioProcedencia: "Belo Horizonte - MG",
		destino: "Fazenda Brasília",
		municipioDestino: "Coqueiral - MG",
		dataEmissao: "09/06/2026",
		documentoDaeUrl: daeExemploUrl,
	},
	{
		id: 2,
		numero: "768579",
		procedencia: "Fazenda Santa Helena",
		municipioProcedencia: "Belo Horizonte - MG",
		destino: "Estância Boa Vista",
		municipioDestino: "Lavras - MG",
		dataEmissao: "10/06/2026",
		documentoDaeUrl: daeExemploUrl,
	},
	{
		id: 3,
		numero: "768580",
		procedencia: "Fazenda São José",
		municipioProcedencia: "Sete Lagoas - MG",
		destino: "Fazenda Primavera",
		municipioDestino: "Pará de Minas - MG",
		dataEmissao: "10/06/2026",
		documentoDaeUrl: daeExemploUrl,
	},
];

export function listarPendenciasConfirmacaoGta() {
	return listarColecaoMock(COLECAO, PENDENCIAS_INICIAIS);
}

export function responderPendenciaGta(
	id: number,
	_resposta: RespostaRecebimentoGta,
) {
	const pendencias = listarPendenciasConfirmacaoGta().filter(
		(pendencia) => pendencia.id !== id,
	);
	salvarColecaoMock(COLECAO, pendencias);
	return pendencias;
}
