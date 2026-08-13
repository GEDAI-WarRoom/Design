import { useEffect, useState } from "react";
import {
	Check,
	FileInput,
	RefreshCw,
	Syringe,
	X,
} from "lucide-react";
import {
	listarPendenciasConfirmacaoGta,
	responderPendenciaGta,
	type PendenciaGta,
	type RespostaRecebimentoGta,
} from "../pages/GTA/PendenciasConfirmacao/pendenciasConfirmacaoGtaData";
import {
	dadosProdutorConfirmados,
	listarAtualizacoesCadastrais,
	PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO,
	type AtualizacaoCadastralRebanho,
} from "../pages/Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";
import { PendenciasResumo } from "../pages/Dashboard/shared/PendenciasResumo";
import { listarPendenciasCentrais } from "../pages/GTA/PendenciasConfirmacao/pendenciasCentralData";

type RespostaRecebimento = RespostaRecebimentoGta | null;

function DocumentoDae({ documentoUrl }: { documentoUrl: string }) {
	return (
		<div className="overflow-hidden rounded-md bg-gray-100 p-3 sm:p-5">
			<img
				src={documentoUrl}
				alt="Documento de Arrecadação Estadual (DAE)"
				className="mx-auto block h-auto w-full max-w-[960px] bg-white shadow-sm"
			/>
		</div>
	);
}

export function RecebimentoGtaModal({
	pendencia,
	onClose,
	onSave,
}: {
	pendencia: PendenciaGta;
	onClose: () => void;
	onSave: (resposta: Exclude<RespostaRecebimento, null>) => void;
}) {
	const [resposta, setResposta] = useState<RespostaRecebimento>(null);

	useEffect(() => {
		const overflowAnterior = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const fecharComEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", fecharComEscape);
		return () => {
			document.body.style.overflow = overflowAnterior;
			document.removeEventListener("keydown", fecharComEscape);
		};
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-2 sm:p-4">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="recebimento-gta-title"
				className="flex max-h-[calc(100vh-1rem)] w-full max-w-[1100px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[calc(100vh-2rem)]"
			>
				<div className="relative border-b border-gray-200 px-6 py-7 text-center sm:px-10 sm:py-9">
					<button
						type="button"
						onClick={onClose}
						aria-label="Fechar"
						className="absolute right-5 top-5 rounded-md p-1 text-[#1A7A3C] transition hover:bg-green-50 sm:right-8 sm:top-7"
					>
						<X size={22} />
					</button>
					<div className="flex items-center justify-center gap-3">
						<FileInput size={24} className="text-[#1A7A3C]" />
						<h2 id="recebimento-gta-title" className="text-xl font-semibold text-gray-900">
							Recebimento de GTA
						</h2>
					</div>
					<p className="mt-5 text-sm text-gray-600">
						Verifique se os dados da Guia de Trânsito Animal (GTA) estão corretos para confirmar seu recebimento.
					</p>
				</div>

				<div className="overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">
					<DocumentoDae documentoUrl={pendencia.documentoDaeUrl} />

					<div className="mt-6 flex flex-col gap-5 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-sm font-semibold text-gray-800">Recebimento de GTA</h3>
							<p className="mt-1 text-xs text-gray-500">
								Os dados da GTA estão corretos e correspondem ao transporte realizado?
							</p>
						</div>
						<div className="grid grid-cols-2 gap-3 sm:flex sm:flex-shrink-0">
							<button
								type="button"
								onClick={() => setResposta("confirmar")}
								aria-pressed={resposta === "confirmar"}
								className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
									resposta === "confirmar"
										? "border-[#1A7A3C] bg-green-50 text-[#1A7A3C]"
										: "border-gray-200 text-gray-600 hover:border-green-300"
								}`}
							>
								<span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100 text-[#1A7A3C]">
									<Check size={14} />
								</span>
								Confirmar
							</button>
							<button
								type="button"
								onClick={() => setResposta("negar")}
								aria-pressed={resposta === "negar"}
								className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
									resposta === "negar"
										? "border-red-400 bg-red-50 text-red-600"
										: "border-gray-200 text-gray-600 hover:border-red-300"
								}`}
							>
								<span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-500">
									<X size={14} />
								</span>
								Negar
							</button>
						</div>
					</div>

					<div className="mt-7 flex justify-center gap-3 pb-2">
						<button
							type="button"
							onClick={onClose}
							className="h-11 rounded-md border border-[#1A7A3C] px-6 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50"
						>
							Cancelar
						</button>
						<button
							type="button"
							disabled={!resposta}
							onClick={() => resposta && onSave(resposta)}
							className="h-11 rounded-md bg-[#1A7A3C] px-7 text-sm font-semibold text-white transition hover:bg-[#15612F] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
						>
							Salvar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function PendenciasConfirmacaoGta({
	onNavigate,
}: {
	onNavigate: (screen: any, data?: any) => void;
}) {
	const [pendencias, setPendencias] = useState(listarPendenciasConfirmacaoGta);
	const [pendenciaAberta, setPendenciaAberta] = useState<PendenciaGta | null>(null);
	const pendenciasRebanho = listarAtualizacoesCadastrais().filter(
		(atualizacao) =>
			atualizacao.produtor.documento ===
				PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO &&
			!atualizacao.concluida,
	);
	const pendenciasDeclaracao = listarPendenciasCentrais("produtor");

	const salvarResposta = (resposta: Exclude<RespostaRecebimento, null>) => {
		if (!pendenciaAberta) return;
		setPendencias(responderPendenciaGta(pendenciaAberta.id, resposta));
		setPendenciaAberta(null);
	};

	const quantidadePendencias = pendencias.length + pendenciasRebanho.length + pendenciasDeclaracao.length;
	const abrirAtualizacaoRebanho = (
		atualizacao: AtualizacaoCadastralRebanho,
	) => {
		const destino = dadosProdutorConfirmados(atualizacao)
			? "visualizar-atualizacao-cadastral-rebanho"
			: "confirmar-dados-produtor-rebanho";
		onNavigate(destino, { atualizacaoId: atualizacao.id });
	};
	const formatarData = (data: string) => {
		const [ano, mes, dia] = data.split("-");
		return dia && mes && ano ? `${dia}/${mes}/${ano}` : data;
	};
	const itensResumo = [
		...pendenciasDeclaracao.slice(0, 1).map((pendencia) => ({ id: `declaracao-${pendencia.id}`, title: pendencia.titulo, description: pendencia.descricao, icon: <Syringe size={18} />, details: ["Campanha: Brucelose 2026", "Prazo: 31/08/2026"], actionLabel: "Declarar vacinação", onAction: () => onNavigate("declaracao-vacinacao") })),
		...pendenciasRebanho.slice(0, 1).map((atualizacao) => ({ id: `rebanho-${atualizacao.id}`, title: "Atualização Cadastral", description: "Revisão periódica dos dados da propriedade", icon: <RefreshCw size={18} />, details: [`Referência: ${atualizacao.etapa}`, `Prazo: ${formatarData(atualizacao.dataFimEtapa)}`], actionLabel: "Atualizar Agora", onAction: () => abrirAtualizacaoRebanho(atualizacao) })),
		...pendencias.slice(0, 1).map((pendencia) => ({ id: `gta-${pendencia.id}`, title: `GTA NR - ${pendencia.numero}`, description: "Confirmação de recebimento dos animais", icon: <FileInput size={18} />, details: [`Proprietário ${pendencia.procedencia}`, `Destino: ${pendencia.destino} • ${pendencia.municipioDestino}`], actionLabel: "Confirmar GTA", onAction: () => setPendenciaAberta(pendencia) })),
	];
	return (
		<>
			<PendenciasResumo
				title="Central de Pendências"
				items={itensResumo}
				totalCount={quantidadePendencias}
				onViewAll={() => onNavigate("pendencias-confirmacao-gta", { aba: "declaracao" })}
			/>

			{pendenciaAberta && (
				<RecebimentoGtaModal
					pendencia={pendenciaAberta}
					onClose={() => setPendenciaAberta(null)}
					onSave={salvarResposta}
				/>
			)}
		</>
	);
}
