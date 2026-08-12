import { daeExemploUrl } from "../../../imports/documents";
import { listarColecaoMock, salvarColecaoMock } from "../../../mocks/mockDatabase";
import { confirmarTransitoGta, type EmissaoGta, type LocalGta } from "../EmissaoGta/emissaoGtaData";

export interface PendenciaGta {
	id: number;
	numero: string;
	procedencia: string;
	municipioProcedencia: string;
	destino: string;
	municipioDestino: string;
	dataEmissao: string;
	documentoDaeUrl: string;
	emissaoGtaId?: number;
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
	resposta: RespostaRecebimentoGta,
) {
	const registros = listarPendenciasConfirmacaoGta();
	const pendencia = registros.find((item) => item.id === id);
	if (resposta === "confirmar" && pendencia?.emissaoGtaId != null) {
		confirmarTransitoGta(pendencia.emissaoGtaId);
	}
	const pendencias = registros.filter(
		(pendencia) => pendencia.id !== id,
	);
	salvarColecaoMock(COLECAO, pendencias);
	return pendencias;
}

function nomeLocal(local: LocalGta) {
	return local.estabelecimento?.nome ??
		local.exploracao?.nome ??
		local.nucleo?.nome ??
		local.frigorifico?.nome ??
		local.evento?.nome ??
		local.revendedora?.nome ??
		local.aeroporto?.nome ??
		local.responsavel?.nome ??
		"Local não informado";
}

export function adicionarPendenciaConfirmacaoGta(emissao: EmissaoGta) {
	const pendencias = listarPendenciasConfirmacaoGta();
	const existente = pendencias.find((item) => item.emissaoGtaId === emissao.id);
	if (existente) return existente;

	const nova: PendenciaGta = {
		id: Math.max(0, ...pendencias.map((item) => item.id)) + 1,
		emissaoGtaId: emissao.id,
		numero: emissao.serieNumero,
		procedencia: nomeLocal(emissao.procedencia),
		municipioProcedencia: emissao.procedencia.estabelecimento?.municipio ?? "Minas Gerais",
		destino: nomeLocal(emissao.destino),
		municipioDestino: emissao.destino.municipio || "Minas Gerais",
		dataEmissao: emissao.dataEmissao.split("-").reverse().join("/"),
		documentoDaeUrl: daeExemploUrl,
	};
	salvarColecaoMock(COLECAO, [nova, ...pendencias]);
	return nova;
}
