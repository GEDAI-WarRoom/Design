import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Download, Eye } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
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
  const registro = dados || {
    id: 1,
    nomeComercial: "Agro Alimentos Ferreira Ltda",
    tipo: "Integradora",
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
      cep: "37200-000",
      estado: "Minas Gerais",
      municipio: "Lavras",
      bairro: "Centro",
      endereco: "Estrada de chão no Km 12",
      numero: "S/N",
      complemento: "Gleba 3",
      localidade: "Floresta",
      distrito: "Abaeté",
      latitude: '19° 09\' 57" S',
      longitude: '044° 21\' 48" W',
    },
    contato: {
      utilizarContatoProprietario: "Não",
      emailFixo: "divino.sobrinho@email.com",
      emailFixoObs: "",
      telefoneFixo: "(35) 99999-1111",
      telefoneFixoObs: "",
    },
    anexos: [
      {
        id: "1",
        nome: "contrato_social.pdf",
        descricao: "Contrato Social Registrado",
      },
    ],
    observacao: "Nenhuma observação registrada.",
  };

  const handleEditar = () => {
    onNavigate("editar-integradora-cooperativa", registro);
  };

  const nomeComercialVal = registro.nomeComercial || registro.nome || "Agro Alimentos Ferreira Ltda";
  const tipoVal = registro.tipo || "Integradora";
  const proprietariosList = (registro.proprietarios && registro.proprietarios.length > 0)
    ? registro.proprietarios
    : [
        {
          uid: "prop-1",
          entidade: {
            nome: "Divino de Souza Sobrinho",
            documento: "444.009.956-40",
          },
        },
      ];
  const end = registro.endereco || {};
  const cont = registro.contato || {};

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="integradora-cooperativa"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("integradora-cooperativa")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Integradoras ou Cooperativas
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualizar Integradora / Cooperativa
            </h1>
            <button
              type="button"
              onClick={handleEditar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput
              label="Nome Comercial da Integradora / Cooperativa"
              required
              disabled
              value={nomeComercialVal}
              onChange={() => {}}
            />
            <FloatInput
              label="Integradora ou Cooperativa?"
              required
              disabled
              value={tipoVal}
              onChange={() => {}}
            />
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <div className="flex flex-col gap-3">
            {proprietariosList.map((item: any, idx: number) => {
              const ent = item.entidade || item.proprietario || {};
              const nomeProp = ent.nome || (typeof item === "string" ? item : "Divino de Souza Sobrinho");
              const docProp = ent.documento || ent.cpf || "444.009.956-40";

              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                    <FloatInput
                      label={`Proprietário ${idx + 1}`}
                      required
                      value={nomeProp}
                      disabled
                      onChange={() => {}}
                    />
                    <FloatInput
                      label="CPF / CNPJ"
                      value={docProp}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => ent && onNavigate("visualizar-pessoa", ent)}
                    title="Visualizar Detalhes"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-white text-gray-500 rounded-md transition-colors hover:bg-gray-50 hover:text-[#1A7A3C]"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </Section>

        {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <FloatInput label="Zona" value={end.zona || "Rural"} disabled onChange={() => {}} />
              <FloatInput label="CEP" value={end.cep || "37200-000"} disabled onChange={() => {}} />
              <FloatInput label="Estado" value={end.estado || "Minas Gerais"} disabled onChange={() => {}} />
              <FloatInput label="Município" value={end.municipio || "Lavras"} disabled onChange={() => {}} />
              <FloatInput label="Bairro" value={end.bairro || "Centro"} disabled onChange={() => {}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <FloatInput label="Endereço" value={end.endereco || "Estrada de chão no Km 12"} disabled onChange={() => {}} />
              </div>
              <div className="md:col-span-3">
                <FloatInput label="Número" value={end.numero || "S/N"} disabled onChange={() => {}} />
              </div>
              <div className="md:col-span-3">
                <FloatInput label="Complemento" value={end.complemento || "Gleba 3"} disabled onChange={() => {}} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatInput label="Localidade" value={end.localidade || "Floresta"} disabled onChange={() => {}} />
              <FloatInput label="Distrito" value={end.distrito || "Abaeté"} disabled onChange={() => {}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatInput label="Latitude" value={end.latitude || '19° 09\' 57" S'} disabled onChange={() => {}} />
              <FloatInput label="Longitude" value={end.longitude || '044° 21\' 48" W'} disabled onChange={() => {}} />
            </div>
          </div>
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Utilizar Contato de Proprietários? <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed">
                  <input
                    type="radio"
                    name="utilizarContatoProprietariosView"
                    checked={cont.utilizarContatoProprietario === "Sim"}
                    disabled
                    className="h-4 w-4 text-[#1A7A3C] border-gray-300 focus:ring-0 cursor-not-allowed"
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed">
                  <input
                    type="radio"
                    name="utilizarContatoProprietariosView"
                    checked={cont.utilizarContatoProprietario !== "Sim"}
                    disabled
                    className="h-4 w-4 text-[#1A7A3C] border-gray-300 focus:ring-0 cursor-not-allowed"
                  />
                  Não
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FloatInput label="Tipo de Contato" value="E-mail" disabled onChange={() => {}} />
                  <FloatInput label="E-mail" value={cont.emailFixo || cont.emailProprietario || "divino.sobrinho@email.com"} disabled onChange={() => {}} />
                </div>
                <div className="lg:col-span-7">
                  <LargeTextArea label="Observação" value={cont.emailFixoObs || ""} disabled onChange={() => {}} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-4 border-t border-gray-100">
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FloatInput label="Tipo de Contato" value="Telefone" disabled onChange={() => {}} />
                  <FloatInput label="Número" value={cont.telefoneFixo || cont.telefoneProprietario || "(35) 99999-1111"} disabled onChange={() => {}} />
                </div>
                <div className="lg:col-span-7">
                  <LargeTextArea label="Observação" value={cont.telefoneFixoObs || ""} disabled onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 5. Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {(registro.anexos && registro.anexos.length > 0) ? (
              registro.anexos.map((anexo: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                      <FloatInput
                        label="Documento"
                        value={anexo.nome || `documento_${idx + 1}.pdf`}
                        disabled
                        onChange={() => {}}
                      />
                      <FloatInput
                        label="Descrição"
                        value={anexo.descricao || "-"}
                        disabled
                        onChange={() => {}}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate("baixar-documento", anexo)}
                      title="Baixar Anexo"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#1A7A3C] hover:bg-green-50 transition"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                    1
                  </span>
                  <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                    <FloatInput
                      label="Documento"
                      value="contrato_social.pdf"
                      disabled
                      onChange={() => {}}
                    />
                    <FloatInput
                      label="Descrição"
                      value="Contrato Social Registrado"
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                  <button
                    type="button"
                    title="Baixar Anexo"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#1A7A3C] hover:bg-green-50 transition"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 6. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={registro.observacao || "Nenhuma observação registrada."}
            disabled
            onChange={() => {}}
          />
        </Section>
      </main>
    </div>
  );
}