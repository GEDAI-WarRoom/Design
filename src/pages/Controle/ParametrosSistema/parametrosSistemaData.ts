export type CadastroParametroId = "gta-gerais" | "gta-funcionalidades";

export type TipoValorParametro =
  | "texto"
  | "texto-longo"
  | "numero"
  | "data"
  | "sim-nao"
  | "lista"
  | "situacao";

export interface ParametroSistema {
  id: string;
  cadastroId: CadastroParametroId;
  nome: string;
  descricao: string;
  valor: string;
  situacao: "Ativo" | "Inativo";
  tipo: TipoValorParametro;
  funcionalidade?: string;
  campo?: string;
}

export const CADASTROS_COM_PARAMETROS = [
  { id: "gta-gerais" as const, label: "GTA — Parâmetros gerais" },
  { id: "gta-funcionalidades" as const, label: "GTA — Funcionalidades" },
];

type ParametroGeralRaw = [
  nome: string,
  descricao: string,
  valor: string,
  situacao?: "Ativo" | "Inativo",
];

const PARAMETROS_GERAIS_RAW: ParametroGeralRaw[] = [
  ["assuntoEmailCargaGtaOe", "Texto assunto e-mail rotina EnviarEmailCargaGtaOe", "Lista de GTAs da PGA com destino Minas Gerais"],
  ["assuntoEmailGtaOeBaixada", "Texto assunto e-mail rotina EmailGtaOeBaixada", "Lista de GTAs da PGA"],
  ["controleNoventenaIntegracaoPGA", "Parâmetro para habilitar o controle de noventena Integração PGA", "Sim"],
  ["dataLimiteCadastroRTMedicosVeterinariosHabilitadosEventos", "Data limite para os médicos veterinários habilitados para eventos pecuários", "2025-04-07"],
  ["descEmitenteProdutor", "Variável que guarda o rótulo do campo emitente na impressão de GTA pelo produtor rural", "Documento emitido pelo IMA, sob requisição eletrônica do produtor rural"],
  ["dtBloqueioGtaAvesSuinosFormularioDigital", "Indica a data para bloqueio de emissão de GTAs para suínos ou aves utilizando formulário digital", "2018-04-04"],
  ["emailsCargaGtaOe", "Lista de e-mails da rotina EnviarEmailCargaGtaOe", "e-mails cadastrados (diversos)"],
  ["envioAutomaticoGtaPga", "Parâmetro para habilitar o envio automático para a PGA no momento da impressão da GTA", "Não"],
  ["especiesObrigaCadastroPga", "Lista de códigos de espécies que obriga que o destino esteja cadastrado na PGA", "código das espécies"],
  ["especiesProibicaoEmissaoSaidaGtaAftosa", "Espécies com proibição de emissão de GTA para fora do estado quando forem vacinadas contra aftosa", "BOVINO,BUBALINO,SUÍNO,CAPRINO,OVINO", "Inativo"],
  ["especiesProibicaoEmissaoSaidaGtaBrucelose", "Espécies com proibição de emissão de GTA para fora do estado quando forem vacinadas contra brucelose", "Não"],
  ["inAtivarValidacaoAtestadoExameGtaSidagro", "Variável que controla a obrigatoriedade do preenchimento dos campos de atestado na GTA interna", "Sim"],
  ["estadosNaoHabilitadosParaChile", "Lista de estados (área) não habilitados para o Chile", "AC,AL,AP,AM,BA,CE,DF,MA,PA,PB,PE,PI,RJ,RN,RR,SE"],
  ["estadosNaoHabilitadosParaUE", "Lista de estados (área) não habilitados para a União Europeia", "AC,AL,AP,AM,BA,CE,DF,MA,PA,PB,PI,RJ,RN,RR,RO,SE,TO,PE"],
  ["estadosNaoObrigaVacinaAftosa", "Lista de estados que não obrigam a vacinação de febre aftosa na entrada de GTA de outro estado", "todos", "Inativo"],
  ["estadosNaoObrigaVacinaBrucelose", "Lista de estados que não obrigam a vacinação de brucelose na entrada de GTA de outro estado", "SC"],
  ["estadosObrigaCadastroPga", "Lista de estados que obriga que o destino esteja cadastrado na PGA", "TO,AC,RR,MT,SE,RO,RS,GO,ES,DF,SC,RJ,PE,MS,BA,SP"],
  ["estadosProibicaoEmissaoGtaAftosa", "Estados com proibição de emissão de GTA para animais vacinados contra febre aftosa", "", "Inativo"],
  ["estadosProibicaoEmissaoGtaBrucelose", "Estados com proibição de emissão de GTA para animais vacinados contra brucelose", "Não"],
  ["gtaObservacoesProdutorSemVacinaAftosa", "Mensagem de observações da emissão de GTA quando não encontra vacina de aftosa", "Animais oriundos de estado livre de febre aftosa sem vacinação (IN MAPA 52/2020)", "Inativo"],
  ["nBloqueiaGtaProdutorNaoRecadastrado", "Controla o bloqueio da emissão de GTA caso o produtor não esteja recadastrado", "Sim"],
  ["inBloqueioExploracaoDestinoInadimplente", "Bloquear a emissão de GTA caso a exploração de destino encontre-se inadimplente", "Sim"],
  ["nBloqueioExploracaoDestinoInadimplenteAtualizacaoCadastral", "Bloquear a emissão de GTA da exploração de destino inadimplente com a atualização cadastral", "Sim"],
  ["inBloqueioExploracaoOrigemInadimplenteAtualizacaoCadastral", "Bloquear a emissão de GTA da exploração de origem inadimplente com a atualização cadastral", "Sim"],
  ["inBloqueioPropriedadeComExploracaoInadimplente", "Bloquear a emissão de GTA caso a propriedade possua exploração inadimplente", "Não"],
  ["inBloqueioPropriedadeDestinoComExploracaoInadimplente", "Bloquear a emissão de GTA caso a propriedade de destino possua exploração inadimplente", "Não"],
  ["nEstacaoMontaVerificaTresEtapasBrucelose", "Permitir a verificação da terceira etapa de brucelose para explorações com estação de monta", "Sim"],
  ["nExibePanelAtestadosPortalProdutor", "Controla a exibição do painel de atestados de exame para o portal do produtor", "Não"],
  ["inImprimirSemPagamento", "Habilita ou não a impressão de GTA e PTV sem pagamento", "Sim"],
  ["inIsencaoTaxaGtaEmissaoPortalMesmaRazaoSocial", "Isentar a taxa da GTA emitida via Portal se origem e destino são a mesma razão social", "Sim"],
  ["inIsencaoTaxaGtaEmissaoSidagroMesmaRazaoSocial", "Isentar a taxa da GTA emitida via Sidagro se origem e destino são a mesma razão social", "Não"],
  ["inLiberarEmissaoGtaAtaInadimplenteBruceloseMasComVacinacaoComplementar", "Liberar emissão de GTA e ATA para produtor inadimplente com brucelose, mas que possui vacinação complementar", "Sim"],
  ["inVerificaPermissaoGtaFaixasIN44", "Indica se o sistema verificará o bloqueio de GTA para bovinos e bubalinos de acordo com a IN 44, art. 20", "Não"],
  ["isBloquearEmissaoGtaResponsavelTecnicoCadastradoEventos", "Controla a validação de responsável técnico de evento pecuário", "Sim"],
  ["isBloqueiaGtaAbateHabilitadoEquideo", "Indica se o sistema bloqueará a emissão de GTA de abate de equídeos pelo profissional habilitado", "Sim"],
  ["isBloqueiaGTAparaReproducaoSeGRSCvencido", "Indica se o sistema bloqueará a GTA cuja origem seja um núcleo com certificado GRSC vencido", "Sim"],
  ["isExibeFraseAlertaExploracaoProcedenciaStatusChile", "Indica se o sistema adicionará mensagem de alerta na observação sobre o substatus Chile", "Sim"],
  ["isExibeMsgAlertaCompradorGtaEspecieSuinoAves", "Indica se o sistema exibirá mensagem de alerta no registro de venda de GTA digital", "Sim"],
  ["isExibeSubstatusPropriedadeObsGta", "Define se serão considerados os substatus da propriedade na observação da GTA ou somente da exploração", "Sim"],
  ["isExigeFormularioGtaSaidaEventoForaEstadoRT", "Exigir que o habilitado a evento utilize formulários na saída de evento para outro estado", "Sim"],
  ["isHabilitaPopUpOpcaoFundo", "Variável que habilita ou desabilita o pop-up de opção ao fundo", "Sim"],
  ["isObrigaVacinacaoBruceloseGta", "Ativa ou desativa o bloqueio da emissão de GTA por falta de vacina de brucelose", "Sim"],
  ["isPermiteConfirmacaoPagamentoManualDae", "Indica se o sistema permitirá a confirmação de pagamento do DAE manualmente", "Sim"],
  ["isPermiteGtaSaidaEventoForaEstadoRT", "Permissão para o RT emitir GTA de saída de evento para fora do estado sem habilitação da espécie", "Não"],
  ["isValidarQtMaxAnimaisGta", "Ativa a validação de quantidade máxima de animais em uma GTA", "Sim"],
  ["isValidarValorDaeMenorValorDocumento", "Validar se o valor do DAE é menor que o valor do documento a ser vinculado", "Não"],
  ["loteVariosProdutores", "Habilita a criação de um lote de pagamento para mais de um produtor", "Não"],
  ["msgCancelarGta", "Mensagem de aviso exibida na tela de cancelar GTA do acesso externo", "As taxas recolhidas, referentes à emissão de GTA ou PTV que forem posteriormente canceladas, independentemente das razões, não serão ressarcidas e não gerarão créditos para o produtor rural, conforme estabelece o §3º, art. 8º, da Portaria nº 1708, de 17 de maio de 2017."],
  ["msgConsultarImprimirGta", "Mensagem de aviso exibida na consulta de GTA do acesso externo", "Pagamentos realizados durante o horário de expediente bancário são identificados em até 2 horas. Pagamentos realizados fora do horário de expediente bancário serão recebidos pelo Portal a partir de 9:00 horas do dia útil subsequente."],
  ["nrDiasValidadeGta", "Quantidade de dias que a GTA valerá", "3"],
  ["qtDiasCancelamentoGtaProdutor", "Prazo para que o produtor rural possa cancelar a GTA", "3"],
  ["qtDiasNoventenaAreaNaoHabilitada", "Quantidade de dias somada à validade de GTAOE para noventena em área não habilitada UE/Chile", "90"],
  ["qtDiasVencimentoGtaAbate", "Quantidade de dias para aceitar emissão de GTA para abate, considerando os dias correntes da etapa", "120", "Inativo"],
  ["qtHorasEmissaoGtaSaidaEvento", "Quantidade de horas limite para emissão de GTA de saída de eventos", "24"],
  ["textoFinalEmailCargaGtaOe", "Texto final do e-mail da rotina EnviarEmailCargaGtaOe", ""],
  ["textoFinalEmailGtaOeBaixada", "Texto final do e-mail da rotina EmailGtaOeBaixada", ""],
  ["textoInicialEmailCargaGtaOe", "Texto inicial do e-mail da rotina EnviarEmailCargaGtaOe", ""],
  ["textoInicialEmailGtaOeBaixada", "Texto inicial do e-mail da rotina EmailGtaOeBaixada", ""],
  ["textoMenuExtCancelarGta", "Texto exibido ao posicionar o mouse sobre o ícone de cancelar GTA no menu do Sidagro Produtor", "Cancelar GTA"],
  ["textoMenuExtConsultarImprimirGta", "Texto exibido ao posicionar o mouse sobre o ícone de consultar GTA no menu do Sidagro Produtor", "Consultar/Imprimir GTA"],
  ["textoMenuExtGta", "Texto exibido ao posicionar o mouse sobre o ícone de GTA no menu do Sidagro Produtor", "GTA"],
  ["textoMenuExtRequisitarGta", "Texto exibido ao posicionar o mouse sobre o ícone de requisitar GTA no menu do Sidagro Produtor", "Requisitar GTA"],
  ["textoMenuExtValidarGTA", "Texto exibido ao posicionar o mouse sobre o ícone de validar GTA no menu do Sidagro Produtor", "Validar GTA"],
  ["tiposDestinosObrigaCadastroPga", "Lista de tipos de destinos que obriga que o destino esteja cadastrado na PGA", "PR,EP,FR"],
  ["urlServicoPGA", "URL do servidor da PGA", "http://pga.agricultura.gov.br/sispga_ws"],
  ["usarServicoDaePhp", "Altera a emissão do DAE para o novo sistema de emissão em PHP", "Sim"],
  ["validarDestinoPga", "Exige validação de cadastro de destino na PGA", "Sim"],
  ["vlLimiteLoteGtaUAD", "Valor limite para geração de lote de GTA por UAD", "500"],
  ["vlMultiplicaTaxaEmissaoEvento", "Valor multiplicador do aumento da taxa para emissão de GTAs para eventos", "1.0"],
];

type ParametroFuncionalidadeRaw = [
  nome: string,
  funcionalidade: string,
  campo: string,
  descricao: string,
  valor: "Ativo" | "Inativo",
];

const PARAMETROS_FUNCIONALIDADES_RAW: ParametroFuncionalidadeRaw[] = [
  ["cancelarGtaExtAvisoProdutorVisivel", "Cancelar GTA Sidagro Produtor", "avisoPanel", "Controla a exibição do painel com mensagem de aviso na tela de cancelar GTA para o produtor", "Ativo"],
  ["isGtaPermiteRtEventoSaidaOutroEstado", "Cadastro de GTA", "RtHabilitadoSaidaOE", "Permite ao RT habilitado a evento dar saída de animais de eventos com destino a outros estados", "Inativo"],
  ["isPermiteRealizarEstornoParcialAtaGta", "Estorno parcial", "estornoParcial", "Indica se o perfil logado pode realizar o estorno parcial de ATA e GTA", "Ativo"],
  ["isPermiteVisualizarTodosBoletos", "Boleto", "boletoList", "Indica se o perfil logado pode visualizar todos os boletos cadastrados", "Ativo"],
  ["isPermiteVisualizarTodosLotePagamento", "Lote de pagamento", "lotePagamentoList", "Indica se o perfil logado pode visualizar todos os lotes de pagamento cadastrados", "Ativo"],
  ["menuExtCancelarGtaVisivel", "Menu externo Sidagro Produtor", "mnCancelarGta", "Exibe o menu Cancelar GTA na tela do Sidagro Produtor", "Ativo"],
  ["menuExtConsultarImprimirGtaVisivel", "Menu externo Sidagro Produtor", "mnConsultarGta", "Exibe o menu Consultar GTA na tela do Sidagro Produtor", "Ativo"],
  ["menuExtRequisitarGtaVisivel", "Menu externo Sidagro Produtor", "mnEmitirGta", "Exibe o menu Emitir GTA na tela do Sidagro Produtor", "Ativo"],
  ["menuExtValidarGTAVisivel", "Menu externo Sidagro Produtor", "mnValidarGta", "Exibe o menu Validar GTA na tela do Sidagro Produtor", "Ativo"],
  ["passoDoisGtaExtAvisoProdutorVisivel", "Passo dois GTA Sidagro Produtor", "avisoPanelPassoDois", "Controla a exibição do painel com mensagem de aviso na etapa 2 da GTA para o produtor", "Ativo"],
  ["passoTresGtaExtAvisoProdutorVisivel", "Passo três GTA Sidagro Produtor", "avisoPanelPassoTres", "Controla a exibição do painel com mensagem de aviso na etapa 3 da GTA para o produtor", "Ativo"],
  ["passoUmGtaExtAvisoProdutorVisivel", "Passo um GTA Sidagro Produtor", "avisoPanelPassoUm", "Controla a exibição do painel com mensagem de aviso na etapa 1 da GTA para o produtor", "Ativo"],
];

function inferirTipo(nome: string, valor: string): TipoValorParametro {
  const nomeNormalizado = nome.toLowerCase();
  if (/^(sim|não)$/i.test(valor)) return "sim-nao";
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "data";
  if (/^-?\d+(\.\d+)?$/.test(valor)) return "numero";
  if (
    nomeNormalizado.includes("estados") ||
    nomeNormalizado.includes("especies") ||
    nomeNormalizado.includes("emails") ||
    nomeNormalizado.includes("tiposdestinos")
  ) return "lista";
  if (
    valor.length > 120 ||
    nomeNormalizado.startsWith("msg") ||
    nomeNormalizado.startsWith("textoinicial") ||
    nomeNormalizado.startsWith("textofinal")
  ) return "texto-longo";
  return "texto";
}

let parametrosSistemaMock: ParametroSistema[] = [
  ...PARAMETROS_GERAIS_RAW.map(([nome, descricao, valor, situacao]) => ({
    id: `gta-gerais-${nome}`,
    cadastroId: "gta-gerais" as const,
    nome,
    descricao,
    valor,
    situacao: situacao ?? "Ativo",
    tipo: inferirTipo(nome, valor),
  })),
  ...PARAMETROS_FUNCIONALIDADES_RAW.map(([nome, funcionalidade, campo, descricao, valor]) => ({
    id: `gta-funcionalidades-${nome}`,
    cadastroId: "gta-funcionalidades" as const,
    nome,
    descricao,
    valor,
    situacao: valor,
    tipo: "situacao" as const,
    funcionalidade,
    campo,
  })),
];

export function listarParametrosSistema(): ParametroSistema[] {
  return parametrosSistemaMock.map((item) => ({ ...item }));
}

export function salvarParametrosSistema(parametros: ParametroSistema[]): void {
  const alterados = new Map(parametros.map((item) => [item.id, item]));
  parametrosSistemaMock = parametrosSistemaMock.map((item) =>
    alterados.has(item.id) ? { ...alterados.get(item.id)! } : item,
  );
}
