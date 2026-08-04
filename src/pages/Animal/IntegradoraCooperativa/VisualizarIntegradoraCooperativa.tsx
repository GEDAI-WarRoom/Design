import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Pencil,
  Download,
  Building2,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";

const GREEN = "#1A7A3C";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>
      )}
    </div>
  );
}

function DataField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function VisualizarIntegradoraCooperativaPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  // Caso não venham dados na navegação, utilizamos um registro fictício padrão
  const registro = dados || {
    id: 1,
    codigo: "112637890213",
    nome: "Integradora São José",
    tipo: "Integradora",
    situacao: "Ativo",
    proprietarios: [
      {
        uid: "prop-1",
        entidade: {
          nome: "Divino de Souza Sobrinho",
          documento: "444.009.956-40",
        },
      },
    ],
    endereco: {
      zona: "Rural",
      estado: "Minas Gerais",
      municipio: "Lavras",
      endereco: "Estrada de chão no Km 12",
      localidade: "Floresta",
      distrito: "Abaeté",
      latitude: '19° 09\' 57" S',
      longitude: '044° 21\' 48" W',
    },
    contato: {
      utilizarContatoProprietario: "Não",
      emailFixo: "divino.sobrinho@email.com",
      telefoneFixo: "(35) 99999-1111",
    },
    observacao: "Nenhuma observação registrada.",
    anexos: [],
  };

  const handleEditar = () => {
    onNavigate("editar-integradora-cooperativa", registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="integradora-cooperativa"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho com Botão de Voltar e Botão de Editar */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("integradora-cooperativa")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Integradoras ou Cooperativas
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                Visualizar Integradora / Cooperativa
              </h1>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  registro.situacao === "Inativo"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {registro.situacao || "Ativo"}
              </span>
            </div>

            {/* BOTÃO DE EDITAR */}
            <button
              type="button"
              onClick={handleEditar}
              className="flex items-center justify-center gap-2 px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataField
              label="Nome Comercial da Integradora / Cooperativa"
              value={registro.nome || registro.nomeComercial}
            />
            <DataField label="Tipo" value={registro.tipo} />
            <DataField label="Código" value={registro.codigo} />
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          {registro.proprietarios && registro.proprietarios.length > 0 ? (
            <div className="flex flex-col gap-3">
              {registro.proprietarios.map((item: any, index: number) => (
                <div
                  key={item.uid || index}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-[#1A7A3C] flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.entidade?.nome || "Proprietário sem nome"}
                      </p>
                      {item.entidade?.documento && (
                        <p className="text-xs text-gray-500">
                          {item.entidade.documento}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Nenhum proprietário vinculado.
            </p>
          )}
        </Section>

        {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataField label="Zona" value={registro.endereco?.zona} />
            <DataField label="Estado" value={registro.endereco?.estado} />
            <DataField label="Município" value={registro.endereco?.municipio} />
            <DataField label="Endereço" value={registro.endereco?.endereco} />
            <DataField label="Localidade" value={registro.endereco?.localidade} />
            <DataField label="Distrito" value={registro.endereco?.distrito} />
            <DataField label="Latitude" value={registro.endereco?.latitude} />
            <DataField label="Longitude" value={registro.endereco?.longitude} />
          </div>
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataField
              label="Utilizar contato do proprietário?"
              value={registro.contato?.utilizarContatoProprietario}
            />
            <DataField
              label="E-mail"
              value={
                registro.contato?.emailFixo || registro.contato?.emailProprietario
              }
            />
            <DataField
              label="Telefone"
              value={
                registro.contato?.telefoneFixo ||
                registro.contato?.telefoneProprietario
              }
            />
          </div>
        </Section>

        {/* 5. Observações */}
        <Section title="Observações">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {registro.observacao || "Nenhuma observação registrada."}
          </p>
        </Section>

        {/* 6. Anexos */}
        <Section title="Anexos">
          {registro.anexos && registro.anexos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {registro.anexos.map((anexo: any, index: number) => (
                <div
                  key={anexo.id || index}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-[#1A7A3C] flex items-center justify-center">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {anexo.nome || `Documento Anexo ${index + 1}`}
                      </p>
                      {anexo.descricao && (
                        <p className="text-xs text-gray-500">
                          {anexo.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("baixar-documento", anexo)}
                    className="p-2 text-[#1A7A3C] hover:bg-green-100/50 rounded-lg transition"
                    title="Baixar arquivo"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Nenhum anexo cadastrado.
            </p>
          )}
        </Section>
      </main>
    </div>
  );
}