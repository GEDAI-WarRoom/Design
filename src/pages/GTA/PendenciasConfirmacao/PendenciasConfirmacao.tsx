import { useMemo, useState } from "react";
import {
	ArrowRight,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	CalendarClock,
	FileInput,
	MapPin,
	RefreshCw,
	Search,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RecebimentoGtaModal } from "../../../components/PendenciasConfirmacaoGta";
import { FloatInput } from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
	dadosProdutorConfirmados,
	listarAtualizacoesCadastrais,
	PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO,
	type AtualizacaoCadastralRebanho,
} from "../../Rebanho/AtualizacaoCadastralRebanho/atualizacaoCadastralRebanhoData";
import {
	listarPendenciasConfirmacaoGta,
	responderPendenciaGta,
	type PendenciaGta,
	type RespostaRecebimentoGta,
} from "./pendenciasConfirmacaoGtaData";

function IconePendente({ src, label }: { src: string; label: string }) {
	return (
		<span
			role="img"
			aria-label={label}
			className="h-4 w-4 shrink-0 bg-[#1A7A3C]"
			style={{
				WebkitMaskImage: `url("${src}")`,
				maskImage: `url("${src}")`,
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskSize: "contain",
				maskSize: "contain",
			}}
		/>
	);
}

function classeSituacao(situacao: string) {
	const situacaoNormalizada = situacao.toLocaleLowerCase("pt-BR");

	if (situacaoNormalizada.includes("inadimplente")) {
		return "bg-[#FCE8E6] text-[#D93025]";
	}

	if (
		situacaoNormalizada.includes("atualizado") ||
		situacaoNormalizada.includes("concluído")
	) {
		return "bg-[#E6F4EA] text-[#137333]";
	}

	return "bg-[#FEF3D6] text-[#B45309]";
}

export function PendenciasConfirmacaoPage({
	onLogout,
	onNavigate,
	dados,
}: {
	onLogout: () => void;
	onNavigate: (screen: any, data?: any) => void;
	dados?: { aba?: "gta" | "rebanho" };
}) {
	const [pendencias, setPendencias] = useState(listarPendenciasConfirmacaoGta);
	const [busca, setBusca] = useState("");
	const [buscaAplicada, setBuscaAplicada] = useState("");
	const [pendenciaAberta, setPendenciaAberta] = useState<PendenciaGta | null>(null);
	const [abaAtiva, setAbaAtiva] = useState(
		dados?.aba === "rebanho" ? "rebanho" : "gta",
	);

	const resultadosGta = useMemo(() => {
		const termo = buscaAplicada.trim().toLocaleLowerCase("pt-BR");
		if (!termo) return pendencias;

		return pendencias.filter((pendencia) =>
			[
				pendencia.numero,
				pendencia.procedencia,
				pendencia.municipioProcedencia,
				pendencia.destino,
				pendencia.municipioDestino,
			].some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo)),
		);
	}, [buscaAplicada, pendencias]);
	const pendenciasRebanho = listarAtualizacoesCadastrais().filter(
		(atualizacao) =>
			atualizacao.produtor.documento ===
				PRODUTOR_REBANHO_DEMONSTRACAO_DOCUMENTO &&
			!atualizacao.concluida,
	);
	const termoRebanho = buscaAplicada.trim().toLocaleLowerCase("pt-BR");
	const resultadosRebanho = termoRebanho
		? pendenciasRebanho.filter((atualizacao) =>
				[
					atualizacao.etapa,
					atualizacao.estabelecimento.nome,
					atualizacao.estabelecimento.codigo,
					atualizacao.estabelecimento.municipio,
					atualizacao.situacao,
				].some((valor) =>
					valor.toLocaleLowerCase("pt-BR").includes(termoRebanho),
				),
			)
		: pendenciasRebanho;
	const quantidadeResultados =
		abaAtiva === "gta" ? resultadosGta.length : resultadosRebanho.length;
	const quantidadePendencias =
		abaAtiva === "gta" ? pendencias.length : pendenciasRebanho.length;
	const totalPendencias = pendencias.length + pendenciasRebanho.length;

	const salvarResposta = (resposta: RespostaRecebimentoGta) => {
		if (!pendenciaAberta) return;
		setPendencias(responderPendenciaGta(pendenciaAberta.id, resposta));
		setPendenciaAberta(null);
	};

	const trocarAba = (aba: string) => {
		setAbaAtiva(aba);
		setBusca("");
		setBuscaAplicada("");
	};

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

	return (
		<div className="min-h-screen bg-[#f2f3f5]">
			<Navbar
				onLogout={onLogout}
				onNavigate={onNavigate}
				currentScreen="pendencias-confirmacao-gta"
				hideSearch
			/>

			<main className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 lg:py-8">
				<header className="mb-6">
					<button
						type="button"
						onClick={() => onNavigate("dashboard")}
						className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#1A7A3C] transition hover:text-[#15612F]"
					>
						<ArrowLeft size={16} />
						Inicial
					</button>
					<div>
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-[28px]">
								Central de Pendências
							</h1>
							<span className="inline-flex items-center rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">
								{totalPendencias} {totalPendencias === 1 ? "pendência" : "pendências"}
							</span>
						</div>
						<p className="mt-2 max-w-2xl text-sm text-gray-500">
							Acompanhe e resolva as solicitações que precisam da sua atenção.
						</p>
					</div>
				</header>

				<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="border-b border-gray-100 p-4 md:p-5">
						<div className="grid gap-2 rounded-xl bg-gray-100 p-1.5 sm:grid-cols-2">
							<button
								type="button"
								onClick={() => trocarAba("gta")}
								className={`flex min-h-14 items-center gap-3 rounded-lg px-4 text-left transition ${
									abaAtiva === "gta"
										? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5"
										: "text-gray-500 hover:bg-white/60 hover:text-gray-700"
								}`}
							>
								<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${abaAtiva === "gta" ? "bg-green-50" : "bg-white/70"}`}>
									<FileInput size={18} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block text-sm font-semibold">Recebimento de GTA</span>
									<span className="mt-0.5 block text-xs font-normal text-gray-500">Confirme a chegada dos animais</span>
								</span>
								<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${abaAtiva === "gta" ? "bg-green-100 text-[#1A7A3C]" : "bg-white text-gray-500"}`}>
									{pendencias.length}
								</span>
							</button>

							<button
								type="button"
								onClick={() => trocarAba("rebanho")}
								className={`flex min-h-14 items-center gap-3 rounded-lg px-4 text-left transition ${
									abaAtiva === "rebanho"
										? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5"
										: "text-gray-500 hover:bg-white/60 hover:text-gray-700"
								}`}
							>
								<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${abaAtiva === "rebanho" ? "bg-green-50" : "bg-white/70"}`}>
									<RefreshCw size={18} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block text-sm font-semibold">Atualização cadastral de rebanho</span>
									<span className="mt-0.5 block text-xs font-normal text-gray-500">Mantenha os dados da propriedade atualizados</span>
								</span>
								<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${abaAtiva === "rebanho" ? "bg-green-100 text-[#1A7A3C]" : "bg-white text-gray-500"}`}>
									{pendenciasRebanho.length}
								</span>
							</button>
						</div>
					</div>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							setBuscaAplicada(busca);
						}}
						className="flex flex-col gap-3 border-b border-gray-100 bg-white px-4 py-5 sm:flex-row md:px-6"
					>
						<FloatInput
							label={
								abaAtiva === "gta"
									? "Buscar por número da GTA, procedência ou destino"
									: "Buscar por etapa, estabelecimento, município ou situação"
							}
							value={busca}
							onChange={setBusca}
							icon={<Search size={17} />}
							className="flex-1"
						/>
						<button
							type="submit"
							className="h-12 rounded-lg bg-[#1A7A3C] px-8 text-sm font-semibold text-white transition hover:bg-[#15612F] focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/30"
						>
							Pesquisar
						</button>
					</form>

					<div className="bg-[#fafafa] p-4 md:p-6">
						<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
							<div>
								<h2 className="text-sm font-semibold text-gray-800">
									{abaAtiva === "gta" ? "GTAs aguardando confirmação" : "Cadastros aguardando atualização"}
								</h2>
								<p className="mt-0.5 text-xs text-gray-500">
									{quantidadeResultados} de {quantidadePendencias} {quantidadePendencias === 1 ? "pendência" : "pendências"}
								</p>
							</div>
							{buscaAplicada && (
								<button
									type="button"
									onClick={() => {
										setBusca("");
										setBuscaAplicada("");
									}}
									className="text-xs font-semibold text-[#1A7A3C] hover:text-[#15612F]"
								>
									Limpar busca
								</button>
							)}
						</div>

              {abaAtiva === "gta" && (resultadosGta.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {resultadosGta.map((pendencia) => (
                    <article
                      key={pendencia.id}
                      className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3 p-5 pb-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1A7A3C]">
                          <FileInput size={20} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500">Recebimento de GTA</p>
                          <h3 className="mt-1 truncate text-base font-semibold text-gray-900">
                            GTA nº {pendencia.numero}
                          </h3>
                        </div>
                        <span className="inline-flex shrink-0 items-center rounded-full bg-[#FEF3D6] px-2.5 py-1 text-xs font-semibold text-[#B45309]">
                          Pendente
                        </span>
                      </div>

                      <div className="mx-5 flex-1 rounded-xl bg-gray-50 p-4">
                        <div className="relative space-y-5">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 14 54"
                            fill="none"
                            className="absolute left-[3px] top-[18px] h-[54px] w-[14px] text-[#57B276]"
                          >
                            <path
                              d="M7 1V49L2 44M7 49L12 44"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="relative flex items-start gap-3">
                            <span className="z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 ring-4 ring-gray-50">
                              <IconePendente src={Icons.iconeFornecedorUrl} label="Procedência" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Procedência</p>
                              <p className="mt-0.5 truncate text-sm font-medium text-gray-800">{pendencia.procedencia}</p>
                              <p className="mt-0.5 truncate text-xs text-gray-500">{pendencia.municipioProcedencia}</p>
                            </div>
                          </div>
                          <div className="relative flex items-start gap-3">
                            <span className="z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 ring-4 ring-gray-50">
                              <IconePendente src={Icons.iconeDestinatarioUrl} label="Destino" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Destino</p>
                              <p className="mt-0.5 truncate text-sm font-medium text-gray-800">{pendencia.destino}</p>
                              <p className="mt-0.5 truncate text-xs text-gray-500">{pendencia.municipioDestino}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
                        <span className="text-xs text-gray-500">
                          Emitida em <strong className="font-semibold text-gray-700">{pendencia.dataEmissao}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setPendenciaAberta(pendencia)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A7A3C] px-4 text-sm font-semibold text-white transition hover:bg-[#15612F]"
                        >
                          Analisar
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-gray-400">
                  Nenhuma pendência encontrada para a busca informada.
                </div>
              ))}

              {abaAtiva === "rebanho" && (resultadosRebanho.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {resultadosRebanho.map((atualizacao) => (
                    <article
                      key={atualizacao.id}
                      className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3 p-5 pb-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1A7A3C]">
                          <RefreshCw size={20} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500">Atualização cadastral</p>
                          <h3 className="mt-1 truncate text-base font-semibold text-gray-900">
                            Referência {atualizacao.etapa}
                          </h3>
                        </div>
                        <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classeSituacao(atualizacao.situacao)}`}>
                          {atualizacao.situacao}
                        </span>
                      </div>

                      <div className="mx-5 flex-1 space-y-4 rounded-xl bg-gray-50 p-4">
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Estabelecimento</p>
                            <p className="mt-0.5 truncate text-sm font-medium text-gray-800">{atualizacao.estabelecimento.nome}</p>
                            <p className="mt-0.5 truncate text-xs text-gray-500">{atualizacao.estabelecimento.municipio}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarClock size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Prazo para atualização</p>
                            <p className="mt-0.5 text-sm font-medium text-gray-800">{formatarData(atualizacao.dataFimEtapa)}</p>
                            <p className="mt-0.5 text-xs text-gray-500">Conclua a revisão até esta data</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end border-t border-gray-100 px-5 py-4">
                        <button
                          type="button"
                          onClick={() => abrirAtualizacaoRebanho(atualizacao)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A7A3C] px-4 text-sm font-semibold text-white transition hover:bg-[#15612F]"
                        >
                          Atualizar cadastro
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-gray-400">
                  Nenhuma pendência encontrada para a busca informada.
                </div>
              ))}

              {quantidadeResultados > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500">
                  <span>Itens por página: 10</span>
                  <div className="flex items-center gap-3">
                    <span>
                      Mostrando de 1 a {quantidadeResultados} de {quantidadeResultados} resultados
                    </span>
                    <button type="button" disabled className="rounded p-1 text-[#1A7A3C] opacity-30">
                      <ChevronLeft size={16} />
                    </button>
                    <button type="button" disabled className="rounded p-1 text-[#1A7A3C] opacity-30">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
					</div>
				</section>
			</main>

			{pendenciaAberta && (
				<RecebimentoGtaModal
					pendencia={pendenciaAberta}
					onClose={() => setPendenciaAberta(null)}
					onSave={salvarResposta}
				/>
			)}
		</div>
	);
}
