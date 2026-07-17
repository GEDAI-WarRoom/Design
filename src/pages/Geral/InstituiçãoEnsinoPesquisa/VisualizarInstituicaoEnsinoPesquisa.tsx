import React, { useState } from "react";
import { ArrowLeft, Pencil, UserRound, MapPin, Phone } from "lucide-react";
import { Navbar } from "../../../components/Navbar";

const GREEN = "#1A7A3C";

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-4">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </div>
      <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold text-gray-700">{titulo}</span>
      {children}
    </div>
  );
}

function SituacaoBadge({ situacao }: { situacao: "Ativo" | "Inativo" }) {
  const isAtivo = situacao === "Ativo";
  return (
    <span
      className="inline-flex items-center px-3 h-7 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: isAtivo ? "#E6F4EA" : "#F3F4F6",
        border: `1px solid ${isAtivo ? "#A3E2B8" : "#E5E7EB"}`,
        color: isAtivo ? GREEN : "#6B7280",
      }}
    >
      {situacao}
    </span>
  );
}

// ==========================================================
// TIPOS
// ==========================================================
interface Pessoa {
  nome: string;
  documento: string;
}

interface EnderecoState {
  zona: string;
  cep: string;
  estado: string;
  municipio: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  localidade: string;
  distrito: string;
  latitude?: string;
  longitude?: string;
}

interface ContatoState {
  utilizarContatoProprietario: "Sim" | "Não" | "";
  proprietariosSelecionados: string[];
  emailFixo: string;
  emailFixoObs: string;
  telefoneFixo: string;
  telefoneFixoObs: string;
  contatosAdicionais: any[];
}

interface InstituicaoDetalhe {
  id: number;
  proprietarios: Pessoa[];
  doencas: { id: number; nome: string }[];
  endereco: EnderecoState;
  contato: ContatoState;
  situacao: "Ativo" | "Inativo";
}

// ==========================================================
// MOCK DE DETALHE (substituir por API — busca pelo id recebido da listagem)
// ==========================================================
const INSTITUICOES_DETALHE_MOCK: Record<number, InstituicaoDetalhe> = {
  1: {
    id: 1,
    proprietarios: [
      {
        nome: "Instituto Veterinário do Sul Ltda.",
        documento: "12.345.678/0001-99",
      },
    ],
    doencas: [
      { id: 1, nome: "Febre Aftosa" },
      { id: 2, nome: "Brucelose" },
    ],
    endereco: {
      zona: "Urbana",
      cep: "37200-000",
      estado: "Minas Gerais",
      municipio: "Lavras",
      bairro: "Centro",
      endereco: "Rua das Acácias",
      numero: "120",
      complemento: "Bloco B",
      localidade: "",
      distrito: "",
      latitude: "",
      longitude: "",
    },
    contato: {
      utilizarContatoProprietario: "Não",
      proprietariosSelecionados: [],
      emailFixo: "contato@institutosul.com.br",
      emailFixoObs: "",
      telefoneFixo: "(35) 99999-1234",
      telefoneFixoObs: "",
      contatosAdicionais: [],
    },
    situacao: "Ativo",
  },
  2: {
    id: 2,
    proprietarios: [
      { nome: "José Aarão Neto", documento: "555.009.956-40" },
      { nome: "Divino de Souza Sobrinho", documento: "444.009.956-40" },
    ],
    doencas: [{ id: 3, nome: "Tuberculose Bovina" }],
    endereco: {
      zona: "Rural",
      cep: "",
      estado: "Minas Gerais",
      municipio: "Uberlândia",
      bairro: "",
      endereco: "Estrada Municipal, km 8",
      numero: "",
      complemento: "",
      localidade: "",
      distrito: "",
      latitude: "-18.914",
      longitude: "-48.275",
    },
    contato: {
      utilizarContatoProprietario: "Sim",
      proprietariosSelecionados: ["555.009.956-40"],
      emailFixo: "",
      emailFixoObs: "",
      telefoneFixo: "",
      telefoneFixoObs: "",
      contatosAdicionais: [],
    },
    situacao: "Inativo",
  },
  3: {
    id: 3,
    proprietarios: [
      {
        nome: "Agropecuária Vale Verde Ltda.",
        documento: "56.338.814/0001-95",
      },
    ],
    doencas: [],
    endereco: {
      zona: "Urbana",
      cep: "38400-000",
      estado: "Minas Gerais",
      municipio: "Uberlândia",
      bairro: "Jardim das Palmeiras",
      endereco: "Av. Rondon Pacheco",
      numero: "3200",
      complemento: "",
      localidade: "",
      distrito: "",
      latitude: "",
      longitude: "",
    },
    contato: {
      utilizarContatoProprietario: "Não",
      proprietariosSelecionados: [],
      emailFixo: "vale.verde@email.com",
      emailFixoObs: "",
      telefoneFixo: "(34) 98888-7777",
      telefoneFixoObs: "",
      contatosAdicionais: [],
    },
    situacao: "Ativo",
  },
};

const DETALHE_PADRAO: InstituicaoDetalhe = INSTITUICOES_DETALHE_MOCK[1];

// ==========================================================
// PÁGINA: VISUALIZAR INSTITUIÇÃO DE ENSINO E PESQUISA
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  instituicao?: { id: number };
}

export function VisualizarInstituicaoEnsinoPesquisaPage({
  onLogout,
  onNavigate,
  instituicao,
}: PageProps) {
  const detalhe =
    (instituicao && INSTITUICOES_DETALHE_MOCK[instituicao.id]) ||
    DETALHE_PADRAO;

  const proprietariosDisponiveis = detalhe.proprietarios.map((p) => ({
    id: p.documento,
    nome: p.nome,
  }));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="instituicao-ensino-pesquisa"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("instituicao-ensino-pesquisa")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Instituições de Ensino e Pesquisa
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Instituição de Ensino e Pesquisa
            </h1>
            <button
              type="button"
              onClick={() =>
                onNavigate("editar-instituicao-ensino-pesquisa", detalhe)
              }
              className="flex items-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        {/* 1. Informações Básicas — Proprietários */}
        <Section title="Informações Básicas">
          <SubGrupo titulo="Proprietários">
            <div className="flex flex-col gap-2">
              {detalhe.proprietarios.map((p) => (
                <div
                  key={p.documento}
                  className="flex items-center gap-3 bg-gray-50/60 border border-gray-100 rounded-lg px-4 py-3"
                >
                  <UserRound
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {p.nome}
                    </span>
                    <span className="hidden sm:inline text-gray-300">—</span>
                    <span className="text-sm text-gray-500">{p.documento}</span>
                  </div>
                </div>
              ))}
            </div>
          </SubGrupo>
        </Section>

        {/* 2. Exames que Realiza */}
        <Section title="Exames que Realiza">
          <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  Doença Selecionada
                </span>
                {detalhe.doencas.length > 0 && (
                  <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
                    {detalhe.doencas.length}{" "}
                    {detalhe.doencas.length === 1
                      ? "Selecionada"
                      : "Selecionadas"}
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 flex flex-wrap gap-4">
              {detalhe.doencas.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  Nenhuma doença selecionada para esta instituição.
                </p>
              ) : (
                detalhe.doencas.map((doenca) => (
                  <div
                    key={doenca.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[220px] shadow-sm"
                  >
                    <span className="text-sm font-bold text-[#1A7A3C]">
                      {doenca.nome}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        {/* 3. Localização */}
        <Section title="Localização">
          <div className="flex items-start gap-3 bg-gray-50/60 border border-gray-100 rounded-lg px-4 py-4">
            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 leading-relaxed">
              <div>
                {detalhe.endereco.endereco}
                {detalhe.endereco.numero && `, ${detalhe.endereco.numero}`}
                {detalhe.endereco.complemento &&
                  ` — ${detalhe.endereco.complemento}`}
              </div>
              {detalhe.endereco.bairro && <div>{detalhe.endereco.bairro}</div>}
              <div>
                {detalhe.endereco.municipio} - {detalhe.endereco.estado}
              </div>
              {detalhe.endereco.cep && <div>CEP: {detalhe.endereco.cep}</div>}
              {(detalhe.endereco.localidade || detalhe.endereco.distrito) && (
                <div>
                  {[detalhe.endereco.localidade, detalhe.endereco.distrito]
                    .filter(Boolean)
                    .join(" — ")}
                </div>
              )}
              {detalhe.endereco.latitude && detalhe.endereco.longitude && (
                <div className="text-gray-400 mt-1">
                  Lat: {detalhe.endereco.latitude} · Long:{" "}
                  {detalhe.endereco.longitude}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Zona {detalhe.endereco.zona}
              </div>
            </div>
          </div>
        </Section>

        {/* 4. Contato com Proprietários */}
        <Section title="Contato com Proprietários">
          <div className="flex items-start gap-3 bg-gray-50/60 border border-gray-100 rounded-lg px-4 py-4">
            <Phone size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 leading-relaxed">
              {detalhe.contato.utilizarContatoProprietario === "Sim" ? (
                detalhe.contato.proprietariosSelecionados.length === 0 ? (
                  <span className="text-gray-400 italic">
                    Nenhum proprietário vinculado ao contato.
                  </span>
                ) : (
                  <div>
                    Contato pelos proprietários:{" "}
                    {proprietariosDisponiveis
                      .filter((p) =>
                        detalhe.contato.proprietariosSelecionados
                          .map(String)
                          .includes(String(p.id)),
                      )
                      .map((p) => p.nome)
                      .join(", ")}
                  </div>
                )
              ) : (
                <>
                  {detalhe.contato.emailFixo && (
                    <div>Email: {detalhe.contato.emailFixo}</div>
                  )}
                  {detalhe.contato.telefoneFixo && (
                    <div>Telefone: {detalhe.contato.telefoneFixo}</div>
                  )}
                  {!detalhe.contato.emailFixo &&
                    !detalhe.contato.telefoneFixo && (
                      <span className="text-gray-400 italic">
                        Nenhum contato fixo informado.
                      </span>
                    )}
                </>
              )}
              {detalhe.contato.contatosAdicionais.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Outros Contatos
                  </span>
                  {detalhe.contato.contatosAdicionais.map((c: any) => (
                    <div key={c.id}>
                      {c.tipo}: {c.tipo === "E-mail" ? c.email : c.telefone}
                      {c.observacao && (
                        <span className="text-gray-400"> — {c.observacao}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 5. Situação (somente em Visualização/Edição) */}
        <Section title="Situação">
          <SituacaoBadge situacao={detalhe.situacao} />
        </Section>
      </main>
    </div>
  );
}
