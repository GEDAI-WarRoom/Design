import { useState } from "react";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";

// GERAL
import { AdicionarReceitaPage } from "./pages/Arrecadacao/Receita/AdicionarReceita";
import { EditarReceitaPage } from "./pages/Arrecadacao/Receita/EditarReceita";
import { ReceitaPage } from "./pages/Arrecadacao/Receita/Receita";
import { VisualizarReceitaPage } from "./pages/Arrecadacao/Receita/VisualizarReceita";
import { AdicionarAeroportoPorto } from "./pages/Geral/AeroportoPorto/AdicionarAeroportoPorto";
import { AeroportoPorto } from "./pages/Geral/AeroportoPorto/AeroportoPorto";
import { AdicionarClassificacaoSanitariaEstadoPage } from "./pages/Geral/ClassificacaoSanitariaEstado/AdicionarClassificacaoSanitariaEstado";
import { ClassificacaoSanitariaEstadoPage } from "./pages/Geral/ClassificacaoSanitariaEstado/ClassificacaoSanitariaEstado";
import { EditarClassificacaoSanitariaEstadoPage } from "./pages/Geral/ClassificacaoSanitariaEstado/EditarClassificacaoSanitariaEstado";
import { VisualizarClassificacaoSanitariaEstadoPage } from "./pages/Geral/ClassificacaoSanitariaEstado/VisualizarClassificacaoSanitariaEstado";
import { AdicionarDivisaoMunicipalPage } from "./pages/Geral/DivisaoMunicipal/AdicionarDivisaoMunicipal";
import { DivisaoMunicipalPage } from "./pages/Geral/DivisaoMunicipal/DivisaoMunicipal";
import { AdicionarEstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/AdicionarEstabelecimentoAgropecuario";
import { EstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/EstabelecimentoAgropecuario";
import { VisualizarEstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/VisualizarEstabelecimentoAgropecuario";
import { AdicionarInstituicaoEnsinoPesquisaPage } from "./pages/Geral/InstituiçãoEnsinoPesquisa/AdicionarInstituiçãoEnsinoPesquisa";
import { EditarInstituicaoEnsinoPesquisaPage } from "./pages/Geral/InstituiçãoEnsinoPesquisa/EditarInstituicaoEnsinoPesquisa";
import { InstituicaoEnsinoPesquisa } from "./pages/Geral/InstituiçãoEnsinoPesquisa/InstituiçãoEnsinoPesquisa";
import { VisualizarInstituicaoEnsinoPesquisaPage } from "./pages/Geral/InstituiçãoEnsinoPesquisa/VisualizarInstituicaoEnsinoPesquisa";
import { AdicionarPessoaFisicaPage } from "./pages/Geral/PessoaFisica/AdicionarPessoaFisica";
import { EditarPessoaFisica } from "./pages/Geral/PessoaFisica/EditarPessoaFisica";
import { PessoaFisicaPage } from "./pages/Geral/PessoaFisica/PessoaFisica";
import { VisualizarPessoaFisica } from "./pages/Geral/PessoaFisica/VisualizarPessoaFisica";
import { AdicionarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/AdicionarPessoaJuridica";
import { EditarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/EditarPessoaJuridica";
import { PessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/PessoaJuridica";
import { VisualizarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/VisualizarPessoaJuridica";
import { AdicionarProdutoPage } from "./pages/Geral/Produto/AdicionarProduto";
import { ProdutoPage } from "./pages/Geral/Produto/Produto";
import { AdicionarProfissionalOficialPage } from "./pages/Geral/ProfissionalOficial/AdicionarProfissionalOficial";
import { ProfissionalOficialPage } from "./pages/Geral/ProfissionalOficial/ProfissionalOficial";
import { AdicionarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/AdicionarRevendedoraAgropecuaria";
import { EditarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/EditarRevendedoraAgropecuaria";
import { RevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/RevendedoraAgropecuaria";
import { VisualizarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/VisualizarRevendedoraAgropecuaria";
import { AdicionarUnidadeAdministrativaPage } from "./pages/Geral/UnidadeAdministrativa/AdicionarUnidadeAdministrativa";
import { UnidadeAdministrativaPage } from "./pages/Geral/UnidadeAdministrativa/UnidadeAdministrativa";
import { AdicionarUnidadeMedidaPage } from "./pages/Geral/UnidadeMedida/AdicionarUnidadeMedida";
import { UnidadeMedidaPage } from "./pages/Geral/UnidadeMedida/UnidadeMedida";
import { AdicionarVendaPropriedadePage } from "./pages/Geral/VendaPropriedade/AdicionarVendaPropriedade";
import { VendaPropriedadePage } from "./pages/Geral/VendaPropriedade/VendaPropriedade";
import { VisualizarVendaPropriedadePage } from "./pages/Geral/VendaPropriedade/VisualizarVendaPropriedade";

// ANIMAL
import { AdicionarCertificadoraSISBOVPage } from "./pages/Animal/CertificadoraSISBOV/AdicionarCertificadoraSISBOV";
import { CertificadoraSISBOVPage } from "./pages/Animal/CertificadoraSISBOV/CertificadoraSISBOV";
import { AdicionarEspeciePage } from "./pages/Animal/Especie/AdicionarEspecie";
import { EspeciePage } from "./pages/Animal/Especie/Especie";
import { VisualizarEspeciePage } from "./pages/Animal/Especie/VisualizarEspecie";
import { VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage } from "./pages/Animal/EstabelecimentoAgroindustrialOutrasInspecoes/VisualizarEstabelecimentoAgroindustrialOutrasInspecoes";
import { AdicionarEstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/AdicionarEstabelecimentoAgroindustrialSIEMG";
import { EstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/EstabelecimentoAgroindustrialSIEMG";
import { VisualizarEstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/VisualizarEstabelecimentoAgroindustrialSIEMG";
import { AdicionarEstabelecimentoEventoPecuarioPage } from "./pages/Animal/EstabelecimentoEventoPecuario/AdicionarEstabelecimentoEventoPecuario";
import { EstabelecimentoEventoPecuarioPage } from "./pages/Animal/EstabelecimentoEventoPecuario/EstabelecimentoEventoPecuario";
import { AdicionarExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/AdicionarExploracaoPecuaria";
import { ExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/ExploracaoPecuaria";
import { VisualizarExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/VisualizarExploracaoPecuaria";
import { AdicionarIntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/AdicionarIntegradoraCooperativa";
import { IntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/IntegradoraCooperativa";
import { VisualizarIntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/VisualizarIntegradoraCooperativa";
import { AdicionarLocalRealizacaoExamePage } from "./pages/Animal/LocalRealizacaoExame/AdicionarLocalRealizacaoExame";
import { EditarLocalRealizacaoExamePage } from "./pages/Animal/LocalRealizacaoExame/EditarLocalRealizacaoExame";
import { LocalRealizacaoExamePage } from "./pages/Animal/LocalRealizacaoExame/LocalRealizacaoExame";
import { VisualizarLocalRealizacaoExamePage } from "./pages/Animal/LocalRealizacaoExame/VisualizarLocalRealizacaoExame";
import { AdicionarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/AdicionarNucleoProducao";
import { EditarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/EditarNucleoProducao";
import { NucleoProducaoPage } from "./pages/Animal/NucleoProducao/NucleoProducao";
import { VisualizarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/VisualizarNucleoProducao";
import { AdicionarPassaporteEquestrePage } from "./pages/Animal/PassaporteEquestre/AdicionarPassaporteEquestre";
import { PassaporteEquestrePage } from "./pages/Animal/PassaporteEquestre/PassaporteEquestre";
import { VisualizarPassaporteEquestrePage } from "./pages/Animal/PassaporteEquestre/VisualizarPassaporteEquestre";
import { PrevisaoMigracaoDetalhePage } from "./pages/Animal/PrevisaoMigracao/PrevisaoMigracaoDetalhe";
import { AdicionarProfissionalAnimalPage } from "./pages/Animal/ProfissionalAnimal/AdicionarProfissionalAnimal";
import { ProfissionalAnimalPage } from "./pages/Animal/ProfissionalAnimal/ProfissionalAnimal";
import { AdicionarPromotoraEventosPage } from "./pages/Animal/PromotoraEventos/AdicionarPromotoraEventos";
import { PromotoraEventosPage } from "./pages/Animal/PromotoraEventos/PromotoraEventos";
import { AdicionarRevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/AdicionarRevendedoraAnimais";
import { RevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/RevendedoraAnimais";
import { VisualizarRevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/VisualizarRevendedoraAnimais";
import { AdicionarStatusAnimalPage } from "./pages/Animal/StatusAnimal/AdicionarStatusAnimal";
import { EditarStatusAnimalPage } from "./pages/Animal/StatusAnimal/EditarStatusAnimal";
import { StatusAnimalPage } from "./pages/Animal/StatusAnimal/StatusAnimal";
import { VisualizarStatusAnimalPage } from "./pages/Animal/StatusAnimal/VisualizarStatusAnimal";
import { AdicionarTipoVeiculoPage } from "./pages/Animal/TipoVeiculo/AdicionarTipoVeiculo";
import { TipoVeiculoPage } from "./pages/Animal/TipoVeiculo/TipoVeiculo";

// VEGETAL
import { AdicionarCulturaPage } from "./pages/Vegetal/Cultura/AdicionarCultura";
import { CulturaPage } from "./pages/Vegetal/Cultura/Cultura";
import { VisualizarEstabelecimentoAgroindustrialPOVPage } from "./pages/Vegetal/EstabelecimentoAgroindustrialPOV/VisualizarEstabelecimentoAgroindustrialPOV";
import { AdicionarPragaPage } from "./pages/Vegetal/Praga/AdicionarPraga";
import { PragaPage } from "./pages/Vegetal/Praga/Praga";
import { AdicionarProfissionalVegetalPage } from "./pages/Vegetal/ProfissionalVegetal/AdicionarProfissionalVegetal";
import { ProfissionalVegetalPage } from "./pages/Vegetal/ProfissionalVegetal/ProfissionalVegetal";
import { AdicionarUnidadeConsolidacaoPage } from "./pages/Vegetal/UnidadeConsolidacao/AdicionarUnidadeConsolidacao";
import { UnidadeConsolidacaoPage } from "./pages/Vegetal/UnidadeConsolidacao/UnidadeConsolidacao";

// VACINAÇÃO
import { AdicionarAutorizacaoVacinacaoPage } from "./pages/Vacinacao/AutorizacaoVacinacao/AdicionarAutorizacaoVacinacao";
import { AutorizacaoVacinacaoPage } from "./pages/Vacinacao/AutorizacaoVacinacao/AutorizacaoVacinacao";
import { AdicionarDeclaracaoVacinacaoPage } from "./pages/Vacinacao/DeclaracaoVacinacao/AdicionarDeclaracaoVacinacao";
import { DeclaracaoVacinacaoPage } from "./pages/Vacinacao/DeclaracaoVacinacao/DeclaracaoVacinacao";
import { AdicionarDoencaPage } from "./pages/Vacinacao/Doenca/AdicionarDoenca";
import { DoencaPage } from "./pages/Vacinacao/Doenca/Doenca";
import { AdicionarEtapaVacinacaoPage } from "./pages/Vacinacao/EtapaVacinacao/AdicionarEtapaVacinacao";
import { EtapaVacinacaoPage } from "./pages/Vacinacao/EtapaVacinacao/EtapaVacinacao";
import { AdicionarLaboratorioPage } from "./pages/Vacinacao/Laboratorio/AdicionarLaboratorio";
import { LaboratorioPage } from "./pages/Vacinacao/Laboratorio/Laboratorio";
import { AdicionarLancamentoDosesVacinaPage } from "./pages/Vacinacao/LancamentoDoses/AdicionarLancamentoDoses";
import { LancamentoDosesVacinaPage } from "./pages/Vacinacao/LancamentoDoses/LancamentoDoses";
import { AdicionarPartilhaVacinaPage } from "./pages/Vacinacao/PartilhaVacina/AdicionarPartilhaVacina";
import { PartilhaVacinaPage } from "./pages/Vacinacao/PartilhaVacina/PartilhaVacina";
import { AdicionarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/AdicionarTipoInsumoExame";
import { EditarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/EditarTipoInsumoExame";
import { TipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/TipoInsumoExame";
import { VisualizarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/VisualizarTipoInsumoExame";
import { AdicionarVacinadorPage } from "./pages/Vacinacao/Vacinador/AdicionarVacinador";
import { VacinadorPage } from "./pages/Vacinacao/Vacinador/Vacinador";
import { AdicionarVendaComEntradaInsumosExamesPage } from "./pages/Vacinacao/VendaComEntradaInsumosExames/AdicionarVendaComEntradaInsumosExames";
import { VendaComEntradaInsumosExamesPage } from "./pages/Vacinacao/VendaComEntradaInsumosExames/VendaComEntradaInsumosExames";
import { AdicionarVendaComEntradaVacinaPage } from "./pages/Vacinacao/VendaComEntradaVacina/AdicionarVendaComEntradaVacina";
import { VendaComEntradaVacinaPage } from "./pages/Vacinacao/VendaComEntradaVacina/VendaComEntradaVacina";
import { AdicionarVendaComSaidaVacinaPage } from "./pages/Vacinacao/VendaComSaidaVacina/AdicionarVendaComSaidaVacina";
import { VendaComSaidaVacinaPage } from "./pages/Vacinacao/VendaComSaidaVacina/VendaComSaidaVacina";
import { AjusteDosesInsumoPage } from "./pages/Vacinacao/AjusteDosesInsumo/AjusteDosesInsumo";
import { AdicionarAjusteDosesInsumoPage } from "./pages/Vacinacao/AjusteDosesInsumo/AdicionarAjusteDosesInsumo";
import { VisualizarAjusteDosesInsumoPage } from "./pages/Vacinacao/AjusteDosesInsumo/VisualizarAjusteDosesInsumo";
import { EditarAjusteDosesInsumoPage } from "./pages/Vacinacao/AjusteDosesInsumo/EditarAjusteDosesInsumo";

import { AtestadoExamePage } from "./pages/Vacinacao/AtestadoExame/AtestadoExame";
import { AdicionarAtestadoExamePage } from "./pages/Vacinacao/AtestadoExame/AdicionarAtestadoExame";
import { VisualizarAtestadoExamePage } from "./pages/Vacinacao/AtestadoExame/VisualizarAtestadoExame";
import { EditarAtestadoExamePage } from "./pages/Vacinacao/AtestadoExame/EditarAtestadoExame";

//ARRECADACAO
import { FundoArrecadacaoPage } from "./pages/Arrecadacao/FundoArrecadacao/FundoArrecadacao";
import {
  AdicionarFundoArrecadacaoPage,
  EditarFundoArrecadacaoPage,
  VisualizarFundoArrecadacaoPage,
} from "./pages/Arrecadacao/FundoArrecadacao/FundoArrecadacaoDetalhe";
import { AdicionarItemReceitaPage } from "./pages/Arrecadacao/ItemReceita/AdicionarItemReceita";
import { NotificacoesEstabelecimentosPage } from "./pages/Arrecadacao/NotificacoesEstabelecimentos/NotificacoesEstabelecimentos";
import { ItemReceitaPage } from "./pages/Arrecadacao/ItemReceita/ItemReceita";
import { AdicionarValorIndicePage } from "./pages/Arrecadacao/ValorIndice/AdicionarValorIndice";
import { ValorIndicePage } from "./pages/Arrecadacao/ValorIndice/ValorIndice";
import { LotePagamentoPage } from "./pages/Arrecadacao/LotePagamento/LotePagamento";
import { AdicionarLotePagamentoPage } from "./pages/Arrecadacao/LotePagamento/AdicionarLotePagamento";
import { VisualizarLotePagamentoPage } from "./pages/Arrecadacao/LotePagamento/VisualizarLotePagamento";
import { VisualizarDocumentoLotePagamentoPage } from "./pages/Arrecadacao/LotePagamento/VisualizarDocumentoLotePagamento";
import { VisualizarDaeLotePagamentoPage } from "./pages/Arrecadacao/LotePagamento/VisualizarDaeLotePagamento";

// GTA
import { AdicionarDistribuicaoFormulariosGta } from "./pages/GTA/DistribuicaoFormulariosGta/AdicionarDistribuicaoFormulariosGta";
import { DistribuicaoFormulariosGta } from "./pages/GTA/DistribuicaoFormulariosGta/DistribuicaoFormulariosGta";
import { AdicionarFinalidadeGTAPage } from "./pages/GTA/FinalidadeGTA/AdicionarFinalidadeGTA";
import { FinalidadeGTAPage } from "./pages/GTA/FinalidadeGTA/FinalidadeGTA";
import { AdicionarFinalidadeTransitoPage } from "./pages/GTA/FinalidadeTransito/AdicionarFinalidadeTransito";
import { FinalidadeTransitoPage } from "./pages/GTA/FinalidadeTransito/FinalidadeTransito";
import { AdicionarIsencaoTaxaGtaPage } from "./pages/GTA/IsencaoTaxaGTA/AdicionarIsencaoTaxaGTA";
import { IsencaoTaxaGtaPage } from "./pages/GTA/IsencaoTaxaGTA/IsencaoTaxaGTA";
import { AdicionarRecolhimentoMensalGTAPage } from "./pages/GTA/RecolhimentoMensalGTA/AdicionarRecolhimentoMensalGTA";
import { RecolhimentoMensalGTAPage } from "./pages/GTA/RecolhimentoMensalGTA/RecolhimentoMensalGTA";
import {
  EditarRecolhimentoMensalGTAPage,
  VisualizarRecolhimentoMensalGTAPage,
} from "./pages/GTA/RecolhimentoMensalGTA/RecolhimentoMensalGTADetalhe";
import {
  VisualizarBoletoRecolhimentoGTAPage,
  VisualizarDAERecolhimentoGTAPage,
} from "./pages/GTA/RecolhimentoMensalGTA/VisualizarDocumentosRecolhimentoGTA";
import { AdicionarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/AdicionarRegistroVendaGTADigital";
import { EditarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/EditarRegistroVendaGTADigital";
import { RegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/RegistroVendaGTADigital";
import { VisualizarDAERegistroVendaGTAPage } from "./pages/GTA/RegistroVendaGTADigital/VisualizarDAERegistroVendaGTA";
import { VisualizarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/VisualizarRegistroVendaGTADigital";
import { AdicionarRegistroVendaGtaFisicaPage } from "./pages/GTA/RegistroVendaGTAFisica/AdicionarRegistroVendaGTAFisica";
import { RegistroVendaGtaFisicaPage } from "./pages/GTA/RegistroVendaGTAFisica/RegistroVendaGTAFisica";
import { AdicionarTaxaEmissaoGtaPage } from "./pages/GTA/TaxaEmissaoGta/AdicionarTaxaEmissaoGta";
import { TaxaEmissaoGtaPage } from "./pages/GTA/TaxaEmissaoGta/TaxaEmissaoGta";

// CONTROLE
import { AdicionarPapeisPage } from "./pages/Controle/Papeis/AdicionarPapeis";
import { EditarPapelPage } from "./pages/Controle/Papeis/EditarPapel";
import { PapeisPage } from "./pages/Controle/Papeis/Papeis";
import { VisualizarPapelPage } from "./pages/Controle/Papeis/VisualizarPapel";
import { AdicionarUsuariosPage } from "./pages/Controle/Usuarios/AdicionarUsuarios";
import { UsuariosPage } from "./pages/Controle/Usuarios/Usuarios";
import { VisualizarUsuariosPage } from "./pages/Controle/Usuarios/VisualizarUsuarios";

// 1. Adicionamos as novas rotas de Pessoa Jurídica no tipo Screen
export type Screen =
  | "login"
  | "dashboard"
  | "classificacao-sanitaria-estado"
  | "adicionar-classificacao-sanitaria-estado"
  | "visualizar-classificacao-sanitaria-estado"
  | "editar-classificacao-sanitaria-estado"
  | "pessoa-fisica"
  | "adicionar-pessoa-fisica"
  | "visualizar-pessoa-fisica"
  | "editar-pessoa-fisica"
  | "pessoa-juridica" // 🚀 Adicionado
  | "adicionar-pessoa-juridica" // 🚀 Adicionado
  | "visualizar-pessoa-juridica" // 🚀 Adicionado
  | "editar-pessoa-juridica" // 🚀 Adicionado
  | "divisao-municipal"
  | "adicionar-divisao-municipal"
  | "estabelecimento-agropecuario"
  | "adicionar-estabelecimento-agropecuario"
  | "visualizar-estabelecimento-agropecuario"
  | "venda-propriedade"
  | "adicionar-venda-propriedade"
  | "visualizar-venda-propriedade"
  | "venda-saida-vacina"
  | "adicionar-venda-saida-vacina"
  | "venda-entrada-vacina"
  | "adicionar-venda-entrada-vacina"
  | "nucleo-producao" // 🚀 Adicionado
  | "adicionar-nucleo-producao" // 🚀 Adicionado
  | "visualizar-nucleo-producao" // 🚀 Adicionado
  | "editar-nucleo-producao" // 🚀 Adicionado
  | "visualizar-previsao-migracao"
  | "editar-previsao-migracao"
  | "exploracao-pecuaria" // 🚀 Adicionado
  | "adicionar-exploracao-pecuaria" // 🚀 Adicionado
  | "visualizar-exploracao-pecuaria" // 🚀 Adicionado
  | "passaporte-equestre"
  | "adicionar-passaporte-equestre"
  | "visualizar-passaporte-equestre"
  | "editar-passaporte-equestre"
  | "laboratorio"
  | "adicionar-laboratorio"
  | "partilha-vacina"
  | "adicionar-partilha-vacina"
  | "lancamento-doses-vacina"
  | "adicionar-lancamento-doses-vacina"
  | "etapa-vacinacao"
  | "adicionar-etapa-vacinacao"
  | "autorizacao-vacinacao"
  | "adicionar-autorizacao-vacinacao"
  | "declaracao-vacinacao"
  | "adicionar-declaracao-vacinacao"
  | "doenca"
  | "adicionar-doenca"
  | "tipo-insumo-exame"
  | "adicionar-tipo-insumo-exame"
  | "visualizar-tipo-insumo-exame"
  | "editar-tipo-insumo-exame"
  | "ajuste-doses-insumo"
  | "adicionar-ajuste-doses-insumo"
  | "visualizar-ajuste-doses-insumo"
  | "editar-ajuste-doses-insumo"
  | "registro-venda-gta-digital"
  | "adicionar-registro-venda-gta-digital"
  | "visualizar-registro-venda-gta-digital"
  | "editar-registro-venda-gta-digital"
  | "visualizar-dae-registro-venda-gta"
  | "vacinador"
  | "adicionar-vacinador"
  | "produto"
  | "adicionar-produto"
  | "profissional-oficial"
  | "adicionar-profissional-oficial"
  | "unidade-administrativa"
  | "adicionar-unidade-administrativa"
  | "unidade-medida"
  | "adicionar-unidade-medida"
  | "revendedora-agropecuario"
  | "adicionar-revendedora-agropecuario"
  | "visualizar-revendedora-agropecuario"
  | "editar-revendedora-agropecuario"
  | "certiificadora-sisbov"
  | "adicionar-certiificadora-sisbov"
  | "especie"
  | "adicionar-especie"
  | "visualizar-especie"
  | "agroindustrial-sie"
  | "adicionar-agroindustrial-sie"
  | "visualizar-estabelecimento-poa"
  | "visualizar-agroindustrial-outras-inspecoes"
  | "visualizar-agroindustrial-pov"
  | "distribuicao-formularios-gta"
  | "adicionar-distribuicao-formularios-gta"
  | "valor-indice"
  | "adicionar-valor-indice"
  | "aeroporto-porto"
  | "adicionar-aeroporto-porto"
  | "registro-venda-gta-fisica"
  | "adicionar-registro-venda-gta-fisica"
  | "estabelecimento-evento-pecuario"
  | "adicionar-estabelecimento-evento-pecuario"
  | "local-realizacao-exame"
  | "adicionar-local-realizacao-exame"
  | "visualizar-local-realizacao-exame"
  | "editar-local-realizacao-exame"
  | "integradora-cooperativa"
  | "adicionar-integradora-cooperativa"
  | "visualizar-integradora-cooperativa"
  | "profissional-animal"
  | "adicionar-profissional-animal"
  | "promotora-eventos"
  | "adicionar-promotora-eventos"
  | "revendedora-animais"
  | "adicionar-revendedora-animais"
  | "visualizar-revendedora-animais-vivos"
  | "editar-revendedora-animais"
  | "unidade-consolidacao"
  | "adicionar-unidade-consolidacao"
  | "cultura"
  | "adicionar-cultura"
  | "praga"
  | "adicionar-praga"
  | "profissional-vegetal"
  | "adicionar-profissional-vegetal"
  | "finalidade-gta"
  | "adicionar-finalidade-gta"
  | "usuarios"
  | "adicionar-usuario"
  | "visualizar-usuario"
  | "papeis"
  | "adicionar-papeis"
  | "visualizar-papel"
  | "editar-papel"
  | "instituicao-ensino-pesquisa"
  | "adicionar-instituicao-ensino-pesquisa"
  | "visualizar-instituicao-ensino-pesquisa"
  | "editar-instituicao-ensino-pesquisa"
  | "isencao-taxa-gta"
  | "adicionar-isencao-taxa-gta"
  | "recolhimento-mensal-gta"
  | "adicionar-recolhimento-mensal-gta"
  | "visualizar-recolhimento-mensal-gta"
  | "editar-recolhimento-mensal-gta"
  | "visualizar-boleto-recolhimento-gta"
  | "visualizar-dae-recolhimento-gta"
  | "taxa-emissao-gta"
  | "adicionar-taxa-emissao-gta"
  | "visualizar-taxa-emissao-gta"
  | "editar-taxa-emissao-gta"
  | "fundo-arrecadacao"
  | "adicionar-fundo-arrecadacao"
  | "visualizar-fundo-arrecadacao"
  | "editar-fundo-arrecadacao"
  | "item-receita"
  | "adicionar-item-receita"
  | "notificacoes-estabelecimentos"
  | "lote-pagamento"
  | "adicionar-lote-pagamento"
  | "visualizar-lote-pagamento"
  | "visualizar-documento-lote-pagamento"
  | "visualizar-dae-lote-pagamento"
  | "tipo-veiculo"
  | "adicionar-tipo-veiculo"
  | "atestado-exame"
  | "adicionar-atestado-exame"
  | "visualizar-atestado-exame"
  | "editar-atestado-exame"
  | "venda-entrada-insumos-exames"
  | "adicionar-venda-entrada-insumos-exames"
  | "status-animal"
  | "adicionar-status-animal"
  | "visualizar-status-animal"
  | "editar-status-animal";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [screenData, setScreenData] = useState<any>(null);

  const handleLogout = () => {
    setScreen("login");
    setScreenData(null);
  };

  const handleNavigate = (targetScreen: Screen, data?: any) => {
    if (data !== undefined) {
      setScreenData(data);
    }
    setScreen(targetScreen);
  };

  switch (screen) {
    case "login":
      return <LoginPage onLogin={() => setScreen("dashboard")} />;
    case "dashboard":
      return (
        <DashboardPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "classificacao-sanitaria-estado":
      return (
        <ClassificacaoSanitariaEstadoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-classificacao-sanitaria-estado":
      return (
        <AdicionarClassificacaoSanitariaEstadoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-classificacao-sanitaria-estado":
      return (
        <VisualizarClassificacaoSanitariaEstadoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-classificacao-sanitaria-estado":
      return (
        <EditarClassificacaoSanitariaEstadoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "pessoa-fisica":
      return (
        <PessoaFisicaPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-pessoa-fisica":
      return (
        <AdicionarPessoaFisicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-pessoa-fisica":
      return (
        <VisualizarPessoaFisica
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-pessoa-fisica":
      return (
        <EditarPessoaFisica
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dadosIniciais={screenData}
        />
      );
    case "divisao-municipal":
      return (
        <DivisaoMunicipalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-divisao-municipal":
      return (
        <AdicionarDivisaoMunicipalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "estabelecimento-agropecuario":
      return (
        <EstabelecimentoAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-estabelecimento-agropecuario":
      return (
        <AdicionarEstabelecimentoAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-estabelecimento-agropecuario":
      return (
        <VisualizarEstabelecimentoAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "venda-propriedade":
      return (
        <VendaPropriedadePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-venda-propriedade":
      return (
        <AdicionarVendaPropriedadePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-venda-propriedade":
      return (
        <VisualizarVendaPropriedadePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "produto":
      return (
        <ProdutoPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-produto":
      return (
        <AdicionarProdutoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "profissional-oficial":
      return (
        <ProfissionalOficialPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-profissional-oficial":
      return (
        <AdicionarProfissionalOficialPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "unidade-administrativa":
      return (
        <UnidadeAdministrativaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-unidade-administrativa":
      return (
        <AdicionarUnidadeAdministrativaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "unidade-medida":
      return (
        <UnidadeMedidaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-unidade-medida":
      return (
        <AdicionarUnidadeMedidaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "receita":
      return (
        <ReceitaPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-receita":
      return (
        <AdicionarReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "editar-receita":
      return (
        <EditarReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-receita":
      return (
        <VisualizarReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "pessoa-juridica":
      return (
        <PessoaJuridicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-pessoa-juridica":
      return (
        <AdicionarPessoaJuridicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-pessoa-juridica":
      return (
        <VisualizarPessoaJuridicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-pessoa-juridica":
      return (
        <EditarPessoaJuridicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "laboratorio":
      return (
        <LaboratorioPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-laboratorio":
      return (
        <AdicionarLaboratorioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "venda-saida-vacina":
      return (
        <VendaComSaidaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-venda-saida-vacina":
      return (
        <AdicionarVendaComSaidaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "venda-entrada-vacina":
      return (
        <VendaComEntradaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-venda-entrada-vacina":
      return (
        <AdicionarVendaComEntradaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "partilha-vacina":
      return (
        <PartilhaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-partilha-vacina":
      return (
        <AdicionarPartilhaVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "lancamento-doses-vacina":
      return (
        <LancamentoDosesVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-lancamento-doses-vacina":
      return (
        <AdicionarLancamentoDosesVacinaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "etapa-vacinacao":
      return (
        <EtapaVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-etapa-vacinacao":
      return (
        <AdicionarEtapaVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "autorizacao-vacinacao":
      return (
        <AutorizacaoVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-autorizacao-vacinacao":
      return (
        <AdicionarAutorizacaoVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "declaracao-vacinacao":
      return (
        <DeclaracaoVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-declaracao-vacinacao":
      return (
        <AdicionarDeclaracaoVacinacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "doenca":
      return <DoencaPage onLogout={handleLogout} onNavigate={handleNavigate} />;
    case "adicionar-doenca":
      return (
        <AdicionarDoencaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "tipo-insumo-exame":
      return (
        <TipoInsumoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-tipo-insumo-exame":
      return (
        <AdicionarTipoInsumoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-tipo-insumo-exame":
      return (
        <VisualizarTipoInsumoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-tipo-insumo-exame":
      return (
        <EditarTipoInsumoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "ajuste-doses-insumo":
      return (
        <AjusteDosesInsumoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-ajuste-doses-insumo":
      return (
        <AdicionarAjusteDosesInsumoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-ajuste-doses-insumo":
      return (
        <VisualizarAjusteDosesInsumoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-ajuste-doses-insumo":
      return (
        <EditarAjusteDosesInsumoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "registro-venda-gta-digital":
      return (
        <RegistroVendaGTADigitalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-registro-venda-gta-digital":
      return (
        <AdicionarRegistroVendaGTADigitalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-registro-venda-gta-digital":
      return (
        <VisualizarRegistroVendaGTADigitalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-registro-venda-gta-digital":
      return (
        <EditarRegistroVendaGTADigitalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-dae-registro-venda-gta":
      return (
        <VisualizarDAERegistroVendaGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "vacinador":
      return (
        <VacinadorPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );

    case "adicionar-vacinador":
      return (
        <AdicionarVacinadorPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "revendedora-agropecuario":
      return (
        <RevendedoraAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-revendedora-agropecuario":
      return (
        <AdicionarRevendedoraAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-revendedora-agropecuario":
      return (
        <VisualizarRevendedoraAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-revendedora-agropecuario":
      return (
        <EditarRevendedoraAgropecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "usuarios":
      return (
        <UsuariosPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-usuario":
      return (
        <AdicionarUsuariosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-usuario":
      return (
        <VisualizarUsuariosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "certificadora-sisbov":
      return (
        <CertificadoraSISBOVPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-certificadora-sisbov":
      return (
        <AdicionarCertificadoraSISBOVPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "especie":
      return (
        <EspeciePage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-especie":
      return (
        <AdicionarEspeciePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-especie":
      return (
        <VisualizarEspeciePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "nucleo-producao":
      return (
        <NucleoProducaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-nucleo-producao":
      return (
        <AdicionarNucleoProducaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-nucleo-producao":
      return (
        <VisualizarNucleoProducaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-nucleo-producao":
      return (
        <EditarNucleoProducaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-previsao-migracao":
      return (
        <PrevisaoMigracaoDetalhePage
          mode="visualizar"
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "editar-previsao-migracao":
      return (
        <PrevisaoMigracaoDetalhePage
          mode="editar"
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "exploracao-pecuaria":
      return (
        <ExploracaoPecuariaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-exploracao-pecuaria":
      return (
        <AdicionarExploracaoPecuariaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-exploracao-pecuaria":
      return (
        <VisualizarExploracaoPecuariaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "agroindustrial-sie":
      return (
        <EstabelecimentoAgroindustrialSIEMGPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-agroindustrial-sie":
      return (
        <AdicionarEstabelecimentoAgroindustrialSIEMGPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-estabelecimento-poa":
      return (
        <VisualizarEstabelecimentoAgroindustrialSIEMGPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-agroindustrial-outras-inspecoes":
      return (
        <VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-agroindustrial-pov":
      return (
        <VisualizarEstabelecimentoAgroindustrialPOVPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "passaporte-equestre":
      return (
        <PassaporteEquestrePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-passaporte-equestre":
      return (
        <AdicionarPassaporteEquestrePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-passaporte-equestre":
      return (
        <VisualizarPassaporteEquestrePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-passaporte-equestre":
      return (
        <AdicionarPassaporteEquestrePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
          modo="editar"
        />
      );
    case "valor-indice":
      return (
        <ValorIndicePage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-valor-indice":
      return (
        <AdicionarValorIndicePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "fundo-arrecadacao":
      return (
        <FundoArrecadacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-fundo-arrecadacao":
      return (
        <AdicionarFundoArrecadacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-fundo-arrecadacao":
      return (
        <VisualizarFundoArrecadacaoPage
          dados={screenData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "editar-fundo-arrecadacao":
      return (
        <EditarFundoArrecadacaoPage
          dados={screenData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    //  case "adicionar-passaporte-equestre":
    //  return <AdicionarPassaporteEquestrePage onLogout={handleLogout} onNavigate={handleNavigate} />;

    case "distribuicao-formularios-gta":
      return (
        <DistribuicaoFormulariosGta
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-distribuicao-formularios-gta":
      return (
        <AdicionarDistribuicaoFormulariosGta
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "aeroporto-porto":
      return (
        <AeroportoPorto onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-aeroporto-porto":
      return (
        <AdicionarAeroportoPorto
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "registro-venda-gta-fisica":
      return (
        <RegistroVendaGtaFisicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-registro-venda-gta-fisica":
      return (
        <AdicionarRegistroVendaGtaFisicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "estabelecimento-evento-pecuario":
      return (
        <EstabelecimentoEventoPecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-estabelecimento-evento-pecuario":
      return (
        <AdicionarEstabelecimentoEventoPecuarioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "local-realizacao-exame":
      return (
        <LocalRealizacaoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-local-realizacao-exame":
      return (
        <AdicionarLocalRealizacaoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-local-realizacao-exame":
      return (
        <VisualizarLocalRealizacaoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-local-realizacao-exame":
      return (
        <EditarLocalRealizacaoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "integradora-cooperativa":
      return (
        <IntegradoraCooperativaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-integradora-cooperativa":
      return (
        <AdicionarIntegradoraCooperativaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-integradora-cooperativa":
      return (
        <VisualizarIntegradoraCooperativaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "profissional-animal":
      return (
        <ProfissionalAnimalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-profissional-animal":
      return (
        <AdicionarProfissionalAnimalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "promotora-eventos":
      return (
        <PromotoraEventosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-promotora-eventos":
      return (
        <AdicionarPromotoraEventosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "revendedora-animais":
      return (
        <RevendedoraAnimaisPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-revendedora-animais":
      return (
        <AdicionarRevendedoraAnimaisPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-revendedora-animais-vivos":
      return (
        <VisualizarRevendedoraAnimaisPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "unidade-consolidacao":
      return (
        <UnidadeConsolidacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-unidade-consolidacao":
      return (
        <AdicionarUnidadeConsolidacaoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "cultura":
      return (
        <CulturaPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );

    case "adicionar-cultura":
      return (
        <AdicionarCulturaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "praga":
      return <PragaPage onLogout={handleLogout} onNavigate={handleNavigate} />;

    case "adicionar-praga":
      return (
        <AdicionarPragaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "profissional-vegetal":
      return (
        <ProfissionalVegetalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-profissional-vegetal":
      return (
        <AdicionarProfissionalVegetalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "finalidade-gta":
      return (
        <FinalidadeGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-finalidade-gta":
      return (
        <AdicionarFinalidadeGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "papeis":
      return <PapeisPage onLogout={handleLogout} onNavigate={handleNavigate} />;

    case "adicionar-papeis":
      return (
        <AdicionarPapeisPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-papel":
      return (
        <VisualizarPapelPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "editar-papel":
      return (
        <EditarPapelPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "instituicao-ensino-pesquisa":
      return (
        <InstituicaoEnsinoPesquisa
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-instituicao-ensino-pesquisa":
      return (
        <AdicionarInstituicaoEnsinoPesquisaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "isencao-taxa-gta":
      return (
        <IsencaoTaxaGtaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-isencao-taxa-gta":
      return (
        <AdicionarIsencaoTaxaGtaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-taxa-emissao-gta":
      return (
        <AdicionarTaxaEmissaoGtaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "taxa-emissao-gta":
      return (
        <TaxaEmissaoGtaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "recolhimento-mensal-gta":
      return (
        <RecolhimentoMensalGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-recolhimento-mensal-gta":
      return (
        <AdicionarRecolhimentoMensalGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-recolhimento-mensal-gta":
      return (
        <VisualizarRecolhimentoMensalGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-recolhimento-mensal-gta":
      return (
        <EditarRecolhimentoMensalGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-boleto-recolhimento-gta":
      return (
        <VisualizarBoletoRecolhimentoGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "visualizar-dae-recolhimento-gta":
      return (
        <VisualizarDAERecolhimentoGTAPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "item-receita":
      return (
        <ItemReceitaPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "notificacoes-estabelecimentos":
      return (
        <NotificacoesEstabelecimentosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "tipo-veiculo":
      return (
        <TipoVeiculoPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-item-receita":
      return (
        <AdicionarItemReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "lote-pagamento":
      return (
        <LotePagamentoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-lote-pagamento":
      return (
        <AdicionarLotePagamentoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-lote-pagamento":
      return (
        <VisualizarLotePagamentoPage
          dados={screenData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-documento-lote-pagamento":
      return (
        <VisualizarDocumentoLotePagamentoPage
          dados={screenData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-dae-lote-pagamento":
      return (
        <VisualizarDaeLotePagamentoPage
          dados={screenData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-tipo-veiculo":
      return (
        <AdicionarTipoVeiculoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "status-animal":
      return (
        <StatusAnimalPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
    case "adicionar-status-animal":
      return (
        <AdicionarStatusAnimalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "visualizar-status-animal":
      return (
        <VisualizarStatusAnimalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );
    case "editar-status-animal":
      return (
        <EditarStatusAnimalPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          dados={screenData}
        />
      );

    case "visualizar-instituicao-ensino-pesquisa":
      return (
        <VisualizarInstituicaoEnsinoPesquisaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          instituicao={screenData}
        />
      );
    case "editar-instituicao-ensino-pesquisa":
      return (
        <EditarInstituicaoEnsinoPesquisaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          instituicao={screenData}
        />
      );
    
      case "atestado-exame":
      return (
        <AtestadoExamePage
    case "venda-entrada-insumos-exames":
      return (
        <VendaComEntradaInsumosExamesPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
      case "adicionar-atestado-exame":
      return (
        <AdicionarAtestadoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
      case "visualizar-atestado-exame":
      return (
        <VisualizarAtestadoExamePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
      case "editar-atestado-exame":
      return (
        <EditarAtestadoExamePage
    case "adicionar-venda-entrada-insumos-exames":
      return (
        <AdicionarVendaComEntradaInsumosExamesPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    default:
      return (
        <DashboardPage onLogout={handleLogout} onNavigate={handleNavigate} />
      );
  }
}
