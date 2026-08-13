import { useMemo, useState } from "react";
import {
	ArrowRight,
	ArrowLeft,
	AlignLeft,
	BadgeCheck,
	ChevronLeft,
	ChevronRight,
	CalendarClock,
	CheckCircle2,
	FileInput,
	FileText,
	Link2,
	MapPin,
	RefreshCw,
	Search,
	Syringe,
	UserCheck,
	CreditCard,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { RecebimentoGtaModal } from "../../../components/PendenciasConfirmacaoGta";
import { FloatInput } from "../../../components/ui/FormKit";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { useMockDatabaseRevision } from "../../../mocks/useMockDatabase";
import * as Icons from "../../../imports/icons";
import { listarAtestadosExame } from "../../Exame/AtestadoExame/atestadoExameData";
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
import {
	listarPendenciasCentrais,
	resolverPendenciaCentral,
	type PendenciaCentral,
} from "./pendenciasCentralData";

const ITENS_POR_PAGINA = 10;

function rotuloTipoPendencia(tipo: PendenciaCentral["tipo"]) {
	switch (tipo) {
		case "habilitacao": return "Atualização de habilitação";
		case "atestado-exame": return "Atestado de exame";
		case "vinculo-profissional": return "Vínculo profissional";
		case "declaracao-partilha-vacina": return "Declaração/Doação ou Partilha de Vacina";
		case "vacinador-brucelose": return "Vacinador de Brucelose";
		case "declaracao-vacinacao": return "Declaração de vacinação";
		case "boleto": return "Boleto";
	}
}

function IconeTipoPendencia({ tipo, size = 20 }: { tipo: PendenciaCentral["tipo"]; size?: number }) {
	switch (tipo) {
		case "habilitacao": return <BadgeCheck size={size} />;
		case "atestado-exame": return <FileText size={size} />;
		case "vinculo-profissional": return <Link2 size={size} />;
		case "declaracao-partilha-vacina": return <Syringe size={size} />;
		case "vacinador-brucelose": return <UserCheck size={size} />;
		case "declaracao-vacinacao": return <Syringe size={size} />;
		case "boleto": return <CreditCard size={size} />;
	}
}

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
	dados?: { aba?: "gta" | "rebanho" | "declaracao" };
}) {
	const databaseRevision = useMockDatabaseRevision();
	void databaseRevision;
	const { role, user } = useDemoUser();
	const [pendencias, setPendencias] = useState(listarPendenciasConfirmacaoGta);
	const [busca, setBusca] = useState("");
	const [buscaAplicada, setBuscaAplicada] = useState("");
	const [pendenciaAberta, setPendenciaAberta] = useState<PendenciaGta | null>(null);
	const [paginaPerfil, setPaginaPerfil] = useState(1);
	const [tipoPerfilSelecionado, setTipoPerfilSelecionado] = useState<PendenciaCentral["tipo"] | null>(null);
	const [pendenciaParaConcluir, setPendenciaParaConcluir] = useState<PendenciaCentral | null>(null);
	const [pendenciaConcluida, setPendenciaConcluida] = useState<PendenciaCentral | null>(null);
	const [abaAtiva, setAbaAtiva] = useState(
		dados?.aba === "rebanho" || dados?.aba === "declaracao" ? dados.aba : "gta",
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
	const pendenciasDeclaracao = listarPendenciasCentrais("produtor");
	const termoDeclaracao = buscaAplicada.trim().toLocaleLowerCase("pt-BR");
	const resultadosDeclaracao = termoDeclaracao
		? pendenciasDeclaracao.filter((pendencia) =>
			[pendencia.titulo, pendencia.descricao].some((valor) =>
				valor.toLocaleLowerCase("pt-BR").includes(termoDeclaracao),
			),
		)
		: pendenciasDeclaracao;
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
	const quantidadeResultados = abaAtiva === "gta"
		? resultadosGta.length
		: abaAtiva === "rebanho"
			? resultadosRebanho.length
			: resultadosDeclaracao.length;
	const quantidadePendencias = abaAtiva === "gta"
		? pendencias.length
		: abaAtiva === "rebanho"
			? pendenciasRebanho.length
			: pendenciasDeclaracao.length;
	const totalPendencias = pendencias.length + pendenciasRebanho.length + pendenciasDeclaracao.length;

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

	if (role === "veterinario" || role === "responsavel-agroindustria-integradora") {
		const pendenciasPerfil = listarPendenciasCentrais(
			role === "veterinario" ? "veterinario" : "lider-estabelecimento",
			role === "veterinario" ? user?.entityId : undefined,
		);
		const topicosPerfil: Array<{
			tipo: PendenciaCentral["tipo"];
			descricao: string;
		}> = role === "veterinario"
			? [
				{ tipo: "habilitacao", descricao: "Documentação e habilitações profissionais" },
				{ tipo: "atestado-exame", descricao: "Atestados que precisam da sua atenção" },
				{ tipo: "vinculo-profissional", descricao: "Solicitações de vínculo profissional" },
				{ tipo: "declaracao-partilha-vacina", descricao: "Declaração, doação e partilha de vacinas" },
				{ tipo: "vacinador-brucelose", descricao: "Cadastro para vacinação contra Brucelose" },
			]
			: [
				{ tipo: "vinculo-profissional", descricao: "Solicitações de vínculo profissional" },
				{ tipo: "boleto", descricao: "Pagamentos que precisam da sua atenção" },
			];
		const tipoPerfilAtivo = topicosPerfil.some((topico) => topico.tipo === tipoPerfilSelecionado)
			? tipoPerfilSelecionado!
			: topicosPerfil[0].tipo;
		const pendenciasDoTopico = pendenciasPerfil.filter(
			(pendencia) => pendencia.tipo === tipoPerfilAtivo,
		);
		const termoPerfil = buscaAplicada.trim().toLocaleLowerCase("pt-BR");
		const resultadosPerfil = termoPerfil
			? pendenciasDoTopico.filter((pendencia) =>
				[pendencia.titulo, pendencia.descricao, rotuloTipoPendencia(pendencia.tipo), pendencia.situacao].some((valor) =>
					valor.toLocaleLowerCase("pt-BR").includes(termoPerfil),
				),
			)
			: pendenciasDoTopico;
		const totalPaginasPerfil = Math.max(1, Math.ceil(resultadosPerfil.length / ITENS_POR_PAGINA));
		const paginaAtualPerfil = Math.min(paginaPerfil, totalPaginasPerfil);
		const inicioPerfil = resultadosPerfil.length ? (paginaAtualPerfil - 1) * ITENS_POR_PAGINA + 1 : 0;
		const fimPerfil = Math.min(paginaAtualPerfil * ITENS_POR_PAGINA, resultadosPerfil.length);
		const resultadosPaginaPerfil = resultadosPerfil.slice(inicioPerfil ? inicioPerfil - 1 : 0, fimPerfil);
		const confirmarConclusao = () => {
			if (!pendenciaParaConcluir) return;
			resolverPendenciaCentral(pendenciaParaConcluir.id);
			setPendenciaConcluida(pendenciaParaConcluir);
			setPendenciaParaConcluir(null);
		};
		const visualizarEntidadeRelacionada = (pendencia: PendenciaCentral) => {
			if (!pendencia.entidadeRelacionada) return;
			const { rota, id } = pendencia.entidadeRelacionada;
			if (pendencia.tipo === "atestado-exame" && id != null) {
				const atestado = listarAtestadosExame().find((item) => String(item.id) === String(id));
				onNavigate(rota, atestado ?? { id });
				return;
			}
			onNavigate(rota, id == null ? undefined : { id });
		};
		return (
			<div className="min-h-screen bg-[#f2f3f5]">
				<Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pendencias-confirmacao-gta" hideSearch />
				<main className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 lg:py-8">
					<header className="mb-6">
						<button type="button" onClick={() => onNavigate("dashboard")} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#1A7A3C] transition hover:text-[#15612F]">
							<ArrowLeft size={16} /> Inicial
						</button>
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-[28px]">Central de Pendências</h1>
							<span className="inline-flex items-center rounded-full bg-[#FEF3D6] px-3 py-1 text-xs font-semibold text-[#B45309]">
								{pendenciasPerfil.length} {pendenciasPerfil.length === 1 ? "pendência" : "pendências"}
							</span>
						</div>
						<p className="mt-2 max-w-2xl text-sm text-gray-500">Acompanhe e resolva as solicitações que precisam da sua atenção.</p>
					</header>
					<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<div className="border-b border-gray-100 p-4 md:p-5">
							<div className="grid gap-2 rounded-xl bg-gray-100 p-1.5 md:grid-cols-2 xl:grid-cols-3">
								{topicosPerfil.map((topico) => {
									const ativo = topico.tipo === tipoPerfilAtivo;
									const quantidade = pendenciasPerfil.filter((pendencia) => pendencia.tipo === topico.tipo).length;
									return (
										<button
											type="button"
											key={topico.tipo}
											onClick={() => {
												setTipoPerfilSelecionado(topico.tipo);
												setBusca("");
												setBuscaAplicada("");
												setPaginaPerfil(1);
											}}
											className={`flex min-h-14 items-center gap-3 rounded-lg px-4 text-left transition ${ativo ? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:bg-white/60 hover:text-gray-700"}`}
										>
											<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ativo ? "bg-green-50" : "bg-white/70"}`}><IconeTipoPendencia tipo={topico.tipo} size={18} /></span>
											<span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{rotuloTipoPendencia(topico.tipo)}</span><span className="mt-0.5 block text-xs font-normal text-gray-500">{topico.descricao}</span></span>
											<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ativo ? "bg-green-100 text-[#1A7A3C]" : "bg-white text-gray-500"}`}>{quantidade}</span>
										</button>
									);
								})}
							</div>
						</div>
						<form onSubmit={(event) => { event.preventDefault(); setBuscaAplicada(busca); setPaginaPerfil(1); }} className="flex flex-col gap-3 border-b border-gray-100 bg-white px-4 py-5 sm:flex-row md:px-6">
							<FloatInput label="Buscar por título, tipo, descrição ou situação" value={busca} onChange={setBusca} icon={<Search size={17} />} className="flex-1" />
							<button type="submit" className="h-12 rounded-lg bg-[#1A7A3C] px-8 text-sm font-semibold text-white transition hover:bg-[#15612F] focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/30">Pesquisar</button>
						</form>
						<div className="bg-[#fafafa] p-4 md:p-6">
							<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
								<div><h2 className="text-sm font-semibold text-gray-800">{rotuloTipoPendencia(tipoPerfilAtivo)} aguardando resolução</h2><p className="mt-0.5 text-xs text-gray-500">{resultadosPerfil.length} de {pendenciasDoTopico.length} {pendenciasDoTopico.length === 1 ? "pendência" : "pendências"}</p></div>
								{buscaAplicada && <button type="button" onClick={() => { setBusca(""); setBuscaAplicada(""); setPaginaPerfil(1); }} className="text-xs font-semibold text-[#1A7A3C] hover:text-[#15612F]">Limpar busca</button>}
							</div>
							{resultadosPerfil.length ? <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
								{resultadosPaginaPerfil.map((pendencia) => {
									const titulo = pendencia.titulo || "Pendência de confirmação";
									const descricao = pendencia.descricao || "Solicitação que precisa da sua atenção";
									return <article key={pendencia.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
										<div className="flex items-start gap-3 p-5 pb-4">
											<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1A7A3C]"><IconeTipoPendencia tipo={pendencia.tipo} /></span>
											<div className="min-w-0 flex-1"><p className="text-xs font-medium text-gray-500">Solicitação de confirmação</p><h3 className="mt-1 truncate text-base font-semibold text-gray-900">{titulo}</h3></div>
											<span className="inline-flex shrink-0 items-center rounded-full bg-[#FEF3D6] px-2.5 py-1 text-xs font-semibold text-[#B45309]">Pendente</span>
										</div>
										<div className="mx-5 flex-1 space-y-4 rounded-xl bg-gray-50 p-4">
											<div className="flex items-start gap-3"><FileInput size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Tipo de solicitação</p><p className="mt-0.5 truncate text-sm font-medium text-gray-800">{rotuloTipoPendencia(pendencia.tipo)}</p><p className="mt-0.5 truncate text-xs text-gray-500">Aguardando sua confirmação</p></div></div>
											<div className="flex items-start gap-3"><AlignLeft size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Descrição</p><p className="mt-0.5 text-sm font-medium text-gray-800">{descricao}</p><p className="mt-0.5 text-xs text-gray-500">Conclua a solicitação para regularizar a pendência</p></div></div>
										</div>
										<div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">{pendencia.entidadeRelacionada && <button type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/30" onClick={() => visualizarEntidadeRelacionada(pendencia)}>Visualizar</button>}<button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A7A3C] px-4 text-sm font-semibold text-white transition hover:bg-[#15612F] focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/30" onClick={() => setPendenciaParaConcluir(pendencia)}>Concluir <ArrowRight size={15} /></button></div>
									</article>;
								})}
							</div> : <p className="py-12 text-center text-sm text-gray-500">Nenhuma pendência encontrada para a busca informada.</p>}
							{resultadosPerfil.length > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500">
								<span>Itens por página: {ITENS_POR_PAGINA}</span>
								<div className="flex items-center gap-3">
									<span>Mostrando de {inicioPerfil} a {fimPerfil} de {resultadosPerfil.length} resultados</span>
									<button type="button" disabled={paginaAtualPerfil === 1} onClick={() => setPaginaPerfil(paginaAtualPerfil - 1)} aria-label="Página anterior" className="rounded p-1 text-[#1A7A3C] transition hover:bg-green-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
									<button type="button" disabled={paginaAtualPerfil === totalPaginasPerfil} onClick={() => setPaginaPerfil(paginaAtualPerfil + 1)} aria-label="Próxima página" className="rounded p-1 text-[#1A7A3C] transition hover:bg-green-50 disabled:opacity-30"><ChevronRight size={16} /></button>
								</div>
							</div>}
						</div>
					</section>
				</main>
				{pendenciaParaConcluir && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendenciaParaConcluir(null); }}>
					<div role="dialog" aria-modal="true" aria-labelledby="titulo-confirmar-pendencia" className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
						<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600"><BadgeCheck size={25} /></span>
						<h2 id="titulo-confirmar-pendencia" className="mt-4 text-lg font-bold text-gray-900">Concluir pendência?</h2>
						<p className="mt-2 text-sm text-gray-500">Confirme que a solicitação <strong className="font-semibold text-gray-700">{pendenciaParaConcluir.titulo}</strong> foi atendida. Ela deixará de aparecer na Central de Pendências.</p>
						<div className="mt-6 flex justify-center gap-3">
							<button type="button" onClick={() => setPendenciaParaConcluir(null)} className="h-11 rounded-lg border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50">Cancelar</button>
							<button type="button" onClick={confirmarConclusao} className="h-11 rounded-lg bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]">Confirmar conclusão</button>
						</div>
					</div>
				</div>}
				{pendenciaConcluida && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4" role="presentation">
					<div role="dialog" aria-modal="true" aria-labelledby="titulo-sucesso-pendencia" className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
						<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#1A7A3C]"><CheckCircle2 size={27} /></span>
						<h2 id="titulo-sucesso-pendencia" className="mt-4 text-lg font-bold text-gray-900">Pendência concluída com sucesso!</h2>
						<p className="mt-2 text-sm text-gray-500">A solicitação foi removida da sua lista de pendências.</p>
						<div className="mt-6 flex justify-center gap-3">
							<button type="button" onClick={() => setPendenciaConcluida(null)} className="h-11 rounded-lg border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50">Voltar</button>
							{pendenciaConcluida.entidadeRelacionada && <button type="button" onClick={() => { const pendencia = pendenciaConcluida; setPendenciaConcluida(null); visualizarEntidadeRelacionada(pendencia); }} className="h-11 rounded-lg bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]">Visualizar</button>}
						</div>
					</div>
				</div>}
			</div>
		);
	}

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
						<div className="grid gap-2 rounded-xl bg-gray-100 p-1.5 sm:grid-cols-3">
							<button
								type="button"
								onClick={() => trocarAba("declaracao")}
								className={`flex min-h-14 items-center gap-3 rounded-lg px-4 text-left transition ${
									abaAtiva === "declaracao"
										? "bg-white text-[#1A7A3C] shadow-sm ring-1 ring-black/5"
										: "text-gray-500 hover:bg-white/60 hover:text-gray-700"
								}`}
							>
								<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${abaAtiva === "declaracao" ? "bg-green-50" : "bg-white/70"}`}><Syringe size={18} /></span>
								<span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Declaração de vacinação</span><span className="mt-0.5 block text-xs font-normal text-gray-500">Regularize a declaração da campanha</span></span>
								<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${abaAtiva === "declaracao" ? "bg-green-100 text-[#1A7A3C]" : "bg-white text-gray-500"}`}>{pendenciasDeclaracao.length}</span>
							</button>
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
									: abaAtiva === "rebanho"
										? "Buscar por etapa, estabelecimento, município ou situação"
										: "Buscar por título ou descrição"
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
									{abaAtiva === "gta" ? "GTAs aguardando confirmação" : abaAtiva === "rebanho" ? "Cadastros aguardando atualização" : "Declarações aguardando regularização"}
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

							{abaAtiva === "declaracao" && (resultadosDeclaracao.length > 0 ? (
								<div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
									{resultadosDeclaracao.map((pendencia) => (
										<article key={pendencia.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
											<div className="flex items-start gap-3 p-5 pb-4">
												<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1A7A3C]"><Syringe size={20} /></span>
												<div className="min-w-0 flex-1"><p className="text-xs font-medium text-gray-500">Declaração de vacinação</p><h3 className="mt-1 text-base font-semibold text-gray-900">{pendencia.titulo}</h3></div>
												<span className="inline-flex shrink-0 items-center rounded-full bg-[#FEF3D6] px-2.5 py-1 text-xs font-semibold text-[#B45309]">Pendente</span>
											</div>
											<div className="mx-5 flex-1 space-y-4 rounded-xl bg-gray-50 p-4">
												<div className="flex items-start gap-3"><Syringe size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><div><p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Campanha</p><p className="mt-0.5 text-sm font-medium text-gray-800">Vacinação contra Brucelose 2026</p></div></div>
												<div className="flex items-start gap-3"><CalendarClock size={18} className="mt-0.5 shrink-0 text-[#1A7A3C]" /><div><p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Descrição</p><p className="mt-0.5 text-sm font-medium text-gray-800">{pendencia.descricao}</p><p className="mt-0.5 text-xs text-gray-500">Prazo: 31/08/2026</p></div></div>
											</div>
											<div className="mt-4 flex items-center justify-end border-t border-gray-100 px-5 py-4"><button type="button" onClick={() => onNavigate("declaracao-vacinacao")} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A7A3C] px-4 text-sm font-semibold text-white transition hover:bg-[#15612F]">Declarar vacinação <ArrowRight size={15} /></button></div>
										</article>
									))}
								</div>
							) : <div className="py-12 text-center text-sm text-gray-400">Nenhuma pendência encontrada para a busca informada.</div>)}

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
