import React from "react";
import { AdicionarPromotoraEventosPage } from "./AdicionarPromotoraEventos";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: any;
  dados?: any;
}

export function VisualizarPromotoraEventosPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="promotora-eventos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Topo / Nav & Ações */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("promotora-eventos")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas Promotoras de Eventos Pecuários
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Promotora de Eventos Pecuários</h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate("editar-promotora-eventos", promotora)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2"
              >
                Editar 
              </button>
              <button
                type="button"
                className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition"
                title="Histórico de Alterações"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Abas da Visualização */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("cadastro")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === "cadastro"
                ? "border-[#1A7A3C] text-[#1A7A3C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText size={16} />
            Cadastro
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fiscalizacoes")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === "fiscalizacoes"
                ? "border-[#1A7A3C] text-[#1A7A3C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Fiscalizações
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recolhimento")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === "recolhimento"
                ? "border-[#1A7A3C] text-[#1A7A3C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Opção de Recolhimento
          </button>
        </div>

        {/* Conteúdo da Aba Cadastro */}
        {activeTab === "cadastro" && (
          <div className="flex flex-col gap-5">
            {/* 1. Informações Básicas */}
            <Section title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataField label="Nome Comercial da Promotora *" value={promotora.nomeComercial} />
                <DataField label="Número de Registro *" value={promotora.numeroRegistro} />
              </div>
            </Section>

            {/* 2. Opção de Recolhimento */}
            <Section title="Opção de Recolhimento">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500">
                  Promotora Aderida ao Fundo Privado (FUNDESA)? *
                </span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                    {promotora.aderidaFundesa}
                  </span>
                </div>
              </div>
            </Section>

            {/* 3. Proprietário */}
            <Section title="Proprietário">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <DataField
                  label="Proprietário *"
                  value={promotora.proprietario.nome}
                  icon={<Building2 size={16} className="text-gray-400" />}
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <DataField label="CPF *" value={promotora.proprietario.cpfCnpj} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("visualizar-pessoa", promotora.proprietario)}
                    className="p-3 bg-green-50 text-[#1A7A3C] rounded-lg hover:bg-green-100 transition self-end mb-0.5"
                    title="Visualizar Proprietário"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </Section>

            {/* 4. Informações de Localização */}
            <Section title="Informações de Localização">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataField label="Zona *" value={promotora.localizacao.zona} />
                  <DataField label="Estado *" value={promotora.localizacao.estado} />
                  <DataField label="Município *" value={promotora.localizacao.municipio} />
                </div>
                <DataField label="Endereço *" value={promotora.localizacao.endereco} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField label="Localidade" value={promotora.localizacao.localidade} />
                  <DataField label="Distrito" value={promotora.localizacao.distrito} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField label="Latitude *" value={promotora.localizacao.latitude} icon={<MapPin size={16} className="text-gray-400" />} />
                  <DataField label="Longitude *" value={promotora.localizacao.longitude} />
                </div>
              </div>
            </Section>

            {/* 5. Informações de Contato */}
            <Section title="Informações de Contato">
              <div className="flex flex-col gap-4">
                {promotora.contatos.map((contato, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DataField label="Tipo de Contato *" value={contato.tipo} />
                      <DataField
                        label={contato.tipo === "E-mail" ? "Email *" : "Número *"}
                        value={contato.valor}
                        icon={contato.tipo === "E-mail" ? <Mail size={14} className="text-gray-400" /> : <Phone size={14} className="text-gray-400" />}
                      />
                    </div>
                    <DataField label="Observação" value={contato.observacao || "-"} />
                  </div>
                ))}
              </div>
            </Section>

            {/* 6. Anexos */}
            <Section title="Anexos">
              <p className="text-sm text-gray-500 italic">Nenhum anexo no cadastro.</p>
            </Section>

            {/* 7. Situação do Cadastro (Badge em Pílula) */}
            <Section title="Situação do Cadastro">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
                  Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
                </p>
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#DDF2E4] text-[#1A7A3C]">
                    <span className="w-4 h-4 rounded-full bg-[#1A7A3C] text-white flex items-center justify-center">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {promotora.situacao}
                  </span>
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === "fiscalizacoes" && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
            Nenhuma fiscalização registrada para esta promotora de eventos.
          </div>
        )}

        {activeTab === "recolhimento" && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
            Informações detalhadas sobre a Opção de Recolhimento.
          </div>
        )}
      </main>
    </div>
    <AdicionarPromotoraEventosPage
      {...props}
      mode="view"
      data={props.data ?? props.dados}
    />
  );
}
