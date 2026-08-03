import { useMemo, useState } from "react";
import {
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
import { FloatInput, Tabs } from "../../../components/ui/FormKit";
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

const GREEN = "#1A7A3C";

function IconePendente({ src, label }: { src: string; label: string }) {
	return (
		<span
			role="img"
			aria-label={label}
			className="mt-0.5 h-5 w-5 shrink-0 bg-[#1A7A3C]"
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
	const tipoPendencia =
		abaAtiva === "gta"
			? "aguardando recebimento de GTA"
			: "de atualização cadastral de rebanho";
	const abas = [
		{
			id: "gta",
			label: `Recebimento de GTA (${pendencias.length})`,
			icon: (ativa: boolean) => (
				<FileInput size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} />
			),
		},
		{
			id: "rebanho",
			label: `Atualização Cadastral de Rebanho (${pendenciasRebanho.length})`,
			icon: (ativa: boolean) => (
				<RefreshCw size={18} className={ativa ? "text-[#1A7A3C]" : "text-gray-400"} />
			),
		},
	];

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

			<main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
				<header>
					<button
						type="button"
						onClick={() => onNavigate("dashboard")}
						className="mb-3 flex items-center gap-1 text-sm font-medium text-[#1A7A3C] transition hover:opacity-70"
					>
						<ArrowLeft size={15} />
						Inicial
					</button>
					<div className="flex flex-wrap items-end justify-between gap-3">
						<div>
							<div className="flex flex-wrap items-center gap-3">
								<h1 className="text-2xl font-semibold text-gray-900">
									Central de Pendências
								</h1>
								<span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
									{quantidadePendencias} {quantidadePendencias === 1 ? "Pendência" : "Pendências"}
								</span>
							</div>
							<p className="mt-1 text-sm text-gray-500">
								Pendências {tipoPendencia}.
							</p>
						</div>
					</div>
				</header>

				<section className="mt-5 rounded-xl bg-white p-6 shadow-sm">
					<Tabs activeTab={abaAtiva} setActiveTab={trocarAba} tabs={abas} />

					<div className="flex flex-col gap-3 sm:flex-row">
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
							type="button"
							onClick={() => setBuscaAplicada(busca)}
							className="h-12 rounded-md bg-[#1A7A3C] px-8 text-sm font-semibold text-white transition hover:bg-[#15612F]"
						>
							Pesquisar
						</button>
					</div>

					<div className="mt-6 border-t border-gray-100 pt-5">
              {abaAtiva === "gta" && (resultadosGta.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resultadosGta.map((pendencia) => (
                    <article
                      key={pendencia.id}
                      className="min-w-0 overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm"
                    >
                      <div className="h-1 bg-[#E5A000]" />

                      <div className="flex min-h-[220px] flex-col gap-4 p-4">
                        <div className="flex items-start justify-between gap-3 text-[10px] text-gray-500">
                          <span>
                            <strong>Emitida:</strong> {pendencia.dataEmissao}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">Pendente</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <FileInput size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              GTA NR - {pendencia.numero}
                            </p>
                            <p className="text-[10px] text-gray-500">Guia de Trânsito Animal</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <IconePendente src={Icons.iconeFornecedorUrl} label="Fornecedor" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-gray-800">{pendencia.procedencia}</p>
                            <p className="truncate text-[10px] text-gray-500">
                              Procedência • {pendencia.municipioProcedencia}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <IconePendente src={Icons.iconeDestinatarioUrl} label="Destinatário" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-gray-800">{pendencia.destino}</p>
                            <p className="truncate text-[10px] text-gray-500">
                              Destino • {pendencia.municipioDestino}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setPendenciaAberta(pendencia)}
                          className="h-9 rounded border border-[#1A7A3C] bg-white px-6 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50"
                        >
                          Visualizar
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
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resultadosRebanho.map((atualizacao) => (
                    <article
                      key={atualizacao.id}
                      className="min-w-0 overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm"
                    >
                      <div className="h-1 bg-[#E5A000]" />

                      <div className="flex min-h-[220px] flex-col gap-4 p-4">
                        <div className="flex items-start justify-between gap-3 text-[10px] text-gray-500">
                          <span>
                            <strong>Prazo:</strong> {formatarData(atualizacao.dataFimEtapa)}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">{atualizacao.situacao}</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <RefreshCw size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              Etapa {atualizacao.etapa}
                            </p>
                            <p className="text-[10px] text-gray-500">Atualização Cadastral de Rebanho</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-gray-800">{atualizacao.estabelecimento.nome}</p>
                            <p className="truncate text-[10px] text-gray-500">
                              {atualizacao.estabelecimento.municipio}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarClock size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800">{formatarData(atualizacao.dataFimEtapa)}</p>
                            <p className="text-[10px] text-gray-500">Data limite para atualização</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => abrirAtualizacaoRebanho(atualizacao)}
                          className="h-9 rounded border border-[#1A7A3C] bg-white px-6 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50"
                        >
                          Visualizar
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
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
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
