import { useState } from "react";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";

// GERAL
import { PessoaFisicaPage } from "./pages/Geral/PessoaFisica/PessoaFisica";
import { AdicionarPessoaFisicaPage } from "./pages/Geral/PessoaFisica/AdicionarPessoaFisica";
import { VisualizarPessoaFisica } from "./pages/Geral/PessoaFisica/VisualizarPessoaFisica";
import { EditarPessoaFisica } from "./pages/Geral/PessoaFisica/EditarPessoaFisica";
import { PessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/PessoaJuridica";
import { AdicionarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/AdicionarPessoaJuridica";
import { VisualizarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/VisualizarPessoaJuridica";
import { EditarPessoaJuridicaPage } from "./pages/Geral/PessoaJuridica/EditarPessoaJuridica";
import { DivisaoMunicipalPage } from "./pages/Geral/DivisaoMunicipal/DivisaoMunicipal";
import { AdicionarDivisaoMunicipalPage } from "./pages/Geral/DivisaoMunicipal/AdicionarDivisaoMunicipal";
import { EstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/EstabelecimentoAgropecuario";
import { AdicionarEstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/AdicionarEstabelecimentoAgropecuario";
import { VisualizarEstabelecimentoAgropecuarioPage } from "./pages/Geral/EstabelecimentoAgropecuario/VisualizarEstabelecimentoAgropecuario";
import { ProdutoPage } from "./pages/Geral/Produto/Produto";
import { AdicionarProdutoPage } from "./pages/Geral/Produto/AdicionarProduto";
import { ProfissionalOficialPage } from "./pages/Geral/ProfissionalOficial/ProfissionalOficial";
import { AdicionarProfissionalOficialPage } from "./pages/Geral/ProfissionalOficial/AdicionarProfissionalOficial";
import { UnidadeAdministrativaPage } from "./pages/Geral/UnidadeAdministrativa/UnidadeAdministrativa";
import { AdicionarUnidadeAdministrativaPage } from "./pages/Geral/UnidadeAdministrativa/AdicionarUnidadeAdministrativa";
import { UnidadeMedidaPage } from "./pages/Geral/UnidadeMedida/UnidadeMedida";
import { AdicionarUnidadeMedidaPage } from "./pages/Geral/UnidadeMedida/AdicionarUnidadeMedida";
import { ReceitaPage } from "./pages/Arrecadacao/Receita/Receita";
import { AdicionarReceitaPage } from "./pages/Arrecadacao/Receita/AdicionarReceita";
import { EditarReceitaPage } from "./pages/Arrecadacao/Receita/EditarReceita";
import { VisualizarReceitaPage } from "./pages/Arrecadacao/Receita/VisualizarReceita";
import { RevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/RevendedoraAgropecuaria";
import { VisualizarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/VisualizarRevendedoraAgropecuaria";
import { EditarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/EditarRevendedoraAgropecuaria";
import { AdicionarRevendedoraAgropecuarioPage } from "./pages/Geral/RevendedoraAgropecuaria/AdicionarRevendedoraAgropecuaria";
import { AeroportoPorto } from "./pages/Geral/AeroportoPorto/AeroportoPorto";
import { AdicionarAeroportoPorto } from "./pages/Geral/AeroportoPorto/AdicionarAeroportoPorto";

// ANIMAL
import { CertificadoraSISBOVPage } from "./pages/Animal/CertificadoraSISBOV/CertificadoraSISBOV";
import { AdicionarCertificadoraSISBOVPage } from "./pages/Animal/CertificadoraSISBOV/AdicionarCertificadoraSISBOV";
import { EspeciePage } from "./pages/Animal/Especie/Especie";
import { AdicionarEspeciePage } from "./pages/Animal/Especie/AdicionarEspecie";
import { VisualizarEspeciePage } from "./pages/Animal/Especie/VisualizarEspecie";
import { NucleoProducaoPage } from "./pages/Animal/NucleoProducao/NucleoProducao";
import { AdicionarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/AdicionarNucleoProducao";
import { VisualizarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/VisualizarNucleoProducao";
import { EditarNucleoProducaoPage } from "./pages/Animal/NucleoProducao/EditarNucleoProducao";
import { PrevisaoMigracaoDetalhePage } from "./pages/Animal/PrevisaoMigracao/PrevisaoMigracaoDetalhe";
import { ExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/ExploracaoPecuaria";
import { AdicionarExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/AdicionarExploracaoPecuaria";
import { VisualizarExploracaoPecuariaPage } from "./pages/Animal/ExploracaoPecuaria/VisualizarExploracaoPecuaria";
import { EstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/EstabelecimentoAgroindustrialSIEMG";
import { AdicionarEstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/AdicionarEstabelecimentoAgroindustrialSIEMG";
import { VisualizarEstabelecimentoAgroindustrialSIEMGPage } from "./pages/Animal/EstabelecimentoAgroindustrialSIEMG/VisualizarEstabelecimentoAgroindustrialSIEMG";
import { PassaporteEquestrePage } from "./pages/Animal/PassaporteEquestre/PassaporteEquestre";
import { EstabelecimentoEventoPecuarioPage } from "./pages/Animal/EstabelecimentoEventoPecuario/EstabelecimentoEventoPecuario";
import { AdicionarEstabelecimentoEventoPecuarioPage } from "./pages/Animal/EstabelecimentoEventoPecuario/AdicionarEstabelecimentoEventoPecuario";
import { IntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/IntegradoraCooperativa";
import { AdicionarIntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/AdicionarIntegradoraCooperativa";
import { VisualizarIntegradoraCooperativaPage } from "./pages/Animal/IntegradoraCooperativa/VisualizarIntegradoraCooperativa";
import { ProfissionalAnimalPage } from "./pages/Animal/ProfissionalAnimal/ProfissionalAnimal";
import { AdicionarProfissionalAnimalPage } from "./pages/Animal/ProfissionalAnimal/AdicionarProfissionalAnimal";
import { PromotoraEventosPage } from "./pages/Animal/PromotoraEventos/PromotoraEventos";
import { AdicionarPromotoraEventosPage } from "./pages/Animal/PromotoraEventos/AdicionarPromotoraEventos";
import { RevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/RevendedoraAnimais";
import { AdicionarRevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/AdicionarRevendedoraAnimais";
import { VisualizarRevendedoraAnimaisPage } from "./pages/Animal/RevendedoraAnimais/VisualizarRevendedoraAnimais";
import { VisualizarEstabelecimentoAgroindustrialOutrasInspecoesPage } from "./pages/Animal/EstabelecimentoAgroindustrialOutrasInspecoes/VisualizarEstabelecimentoAgroindustrialOutrasInspecoes";
import { TipoVeiculoPage } from "./pages/Animal/TipoVeiculo/TipoVeiculo";
import { AdicionarTipoVeiculoPage } from "./pages/Animal/TipoVeiculo/AdicionarTipoVeiculo";

// VEGETAL
import { UnidadeConsolidacaoPage } from "./pages/Vegetal/UnidadeConsolidacao/UnidadeConsolidacao";
import { AdicionarUnidadeConsolidacaoPage } from "./pages/Vegetal/UnidadeConsolidacao/AdicionarUnidadeConsolidacao";
import { CulturaPage } from "./pages/Vegetal/Cultura/Cultura";
import { AdicionarCulturaPage } from "./pages/Vegetal/Cultura/AdicionarCultura";
import { PragaPage } from "./pages/Vegetal/Praga/Praga";
import { AdicionarPragaPage } from "./pages/Vegetal/Praga/AdicionarPraga";
import { ProfissionalVegetalPage } from "./pages/Vegetal/ProfissionalVegetal/ProfissionalVegetal";
import { AdicionarProfissionalVegetalPage } from "./pages/Vegetal/ProfissionalVegetal/AdicionarProfissionalVegetal";
import { VisualizarEstabelecimentoAgroindustrialPOVPage } from "./pages/Vegetal/EstabelecimentoAgroindustrialPOV/VisualizarEstabelecimentoAgroindustrialPOV";
import { VisualizarInstituicaoEnsinoPesquisaPage } from "./pages/Geral/InstituicaoEnsinoPesquisa/VisualizarInstituicaoEnsinoPesquisa";

// VACINAÇÃO
import { LaboratorioPage } from "./pages/Vacinacao/Laboratorio/Laboratorio";
import { AdicionarLaboratorioPage } from "./pages/Vacinacao/Laboratorio/AdicionarLaboratorio";
import { VendaComSaidaVacinaPage } from "./pages/Vacinacao/VendaComSaidaVacina/VendaComSaidaVacina";
import { AdicionarVendaComSaidaVacinaPage } from "./pages/Vacinacao/VendaComSaidaVacina/AdicionarVendaComSaidaVacina";
import { VendaComEntradaVacinaPage } from "./pages/Vacinacao/VendaComEntradaVacina/VendaComEntradaVacina";
import { AdicionarVendaComEntradaVacinaPage } from "./pages/Vacinacao/VendaComEntradaVacina/AdicionarVendaComEntradaVacina";
import { PartilhaVacinaPage } from "./pages/Vacinacao/PartilhaVacina/PartilhaVacina";
import { AdicionarPartilhaVacinaPage } from "./pages/Vacinacao/PartilhaVacina/AdicionarPartilhaVacina";
import { LancamentoDosesVacinaPage } from "./pages/Vacinacao/LancamentoDoses/LancamentoDoses";
import { AdicionarLancamentoDosesVacinaPage } from "./pages/Vacinacao/LancamentoDoses/AdicionarLancamentoDoses";
import { EtapaVacinacaoPage } from "./pages/Vacinacao/EtapaVacinacao/EtapaVacinacao";
import { AdicionarEtapaVacinacaoPage } from "./pages/Vacinacao/EtapaVacinacao/AdicionarEtapaVacinacao";
import { AutorizacaoVacinacaoPage } from "./pages/Vacinacao/AutorizacaoVacinacao/AutorizacaoVacinacao";
import { AdicionarAutorizacaoVacinacaoPage } from "./pages/Vacinacao/AutorizacaoVacinacao/AdicionarAutorizacaoVacinacao";
import { DeclaracaoVacinacaoPage } from "./pages/Vacinacao/DeclaracaoVacinacao/DeclaracaoVacinacao";
import { AdicionarDeclaracaoVacinacaoPage } from "./pages/Vacinacao/DeclaracaoVacinacao/AdicionarDeclaracaoVacinacao";
import { DoencaPage } from "./pages/Vacinacao/Doenca/Doenca";
import { AdicionarDoencaPage } from "./pages/Vacinacao/Doenca/AdicionarDoenca";
import { VacinadorPage } from "./pages/Vacinacao/Vacinador/Vacinador";
import { AdicionarVacinadorPage } from "./pages/Vacinacao/Vacinador/AdicionarVacinador";
import { TipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/TipoInsumoExame";
import { AdicionarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/AdicionarTipoInsumoExame";
import { VisualizarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/VisualizarTipoInsumoExame";
import { EditarTipoInsumoExamePage } from "./pages/Vacinacao/TipoInsumoExame/EditarTipoInsumoExame";

//ARRECADACAO
import { ValorIndicePage } from "./pages/Arrecadacao/ValorIndice/ValorIndice";
import { AdicionarValorIndicePage } from "./pages/Arrecadacao/ValorIndice/AdicionarValorIndice";
import { ItemReceitaPage } from "./pages/Arrecadacao/ItemReceita/ItemReceita";
import { AdicionarItemReceitaPage } from "./pages/Arrecadacao/ItemReceita/AdicionarItemReceita";

// GTA
import { AdicionarDistribuicaoFormulariosGta } from "./pages/GTA/DistribuicaoFormulariosGta/AdicionarDistribuicaoFormulariosGta";
import { DistribuicaoFormulariosGta } from "./pages/GTA/DistribuicaoFormulariosGta/DistribuicaoFormulariosGta";
import { RegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/RegistroVendaGTADigital";
import { AdicionarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/AdicionarRegistroVendaGTADigital";
import { VisualizarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/VisualizarRegistroVendaGTADigital";
import { EditarRegistroVendaGTADigitalPage } from "./pages/GTA/RegistroVendaGTADigital/EditarRegistroVendaGTADigital";
import { VisualizarDAERegistroVendaGTAPage } from "./pages/GTA/RegistroVendaGTADigital/VisualizarDAERegistroVendaGTA";
import { RegistroVendaGtaFisicaPage } from "./pages/GTA/RegistroVendaGTAFisica/RegistroVendaGTAFisica";
import { AdicionarRegistroVendaGtaFisicaPage } from "./pages/GTA/RegistroVendaGTAFisica/AdicionarRegistroVendaGTAFisica";
import { FinalidadeTransitoPage } from "./pages/GTA/FinalidadeTransito/FinalidadeTransito";
import { AdicionarFinalidadeTransitoPage } from "./pages/GTA/FinalidadeTransito/AdicionarFinalidadeTransito";
import { IsencaoTaxaGtaPage } from "./pages/GTA/IsencaoTaxaGTA/IsencaoTaxaGTA";
import { AdicionarIsencaoTaxaGtaPage } from "./pages/GTA/IsencaoTaxaGTA/AdicionarIsencaoTaxaGTA";

// CONTROLE
import { UsuariosPage } from "./pages/Controle/Usuarios/Usuarios";
import { AdicionarUsuariosPage } from "./pages/Controle/Usuarios/AdicionarUsuarios";
import { VisualizarUsuariosPage } from "./pages/Controle/Usuarios/VisualizarUsuarios";
import { PapeisPage } from "./pages/Controle/Papeis/Papeis";
import { AdicionarPapeisPage } from "./pages/Controle/Papeis/AdicionarPapeis";
import { VisualizarPapelPage } from "./pages/Controle/Papeis/VisualizarPapel";
import { EditarPapelPage } from "./pages/Controle/Papeis/EditarPapel";

// 1. Adicionamos as novas rotas de Pessoa Jurídica no tipo Screen
export type Screen =
  | "login"
  | "dashboard"
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
  | "visualizar-instituicao-ensino-pesquisa"
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
  | "finalidade-transito"
  | "adicionar-finalidade-transito"
  | "usuarios"
  | "adicionar-usuario"
  | "visualizar-usuario"
  | "papeis"
  | "adicionar-papeis"
  | "visualizar-papel"
  | "editar-papel"
  | "isencao-taxa-gta"
  | "adicionar-isencao-taxa-gta"
  | "item-receita"
  | "adicionar-item-receita"
  | "tipo-veiculo"
  | "adicionar-tipo-veiculo";

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
      return (
        <LoginPage onLogin={() => setScreen("dashboard")} />
      );
    case "dashboard":
      return (
        <DashboardPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "pessoa-fisica":
      return (
        <PessoaFisicaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
    case "produto":
      return (
        <ProdutoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
        <ReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
        <LaboratorioPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
      return (
        <DoencaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
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
        <VacinadorPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
        <UsuariosPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
        <EspeciePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
    case "visualizar-instituicao-ensino-pesquisa":
      return (
        <VisualizarInstituicaoEnsinoPesquisaPage
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
    case "valor-indice":
      return (
        <ValorIndicePage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-valor-indice":
      return (
        <AdicionarValorIndicePage
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
        <AeroportoPorto
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
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
        <CulturaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-cultura":
      return (
        <AdicionarCulturaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "praga":
      return (
        <PragaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

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

    case "finalidade-transito":
      return (
        <FinalidadeTransitoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case "adicionar-finalidade-transito":
      return (
        <AdicionarFinalidadeTransitoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "papeis":
      return (
        <PapeisPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

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
        <EditarPapelPage
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
    case "item-receita":
      return (
        <ItemReceitaPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "tipo-veiculo":
      return (
        <TipoVeiculoPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case "adicionar-item-receita":
      return (
        <AdicionarItemReceitaPage
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

    default:
      return (
        <DashboardPage
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
  }
}
