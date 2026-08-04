import React, { useState } from "react";
import { ArrowLeft, Pencil, ChevronDown, ChevronUp, Eye, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function VisualizarAeroportoPortoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const local = dados || {};

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="aeroporto-porto" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">

        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("aeroporto-porto")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Aeroportos/Portos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Aeroporto / Porto</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-aeroporto-porto", local)}
              className="flex items-center gap-2 px-4 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"            >
              Editar
            </button>
          </div>
        </div>

        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FloatInput label="Código" value={local.codigo || "AP-001"} disabled onChange={() => { }} />
            <FloatInput label="Nome Comercial do Aeroporto/Porto" value={local.nome || "Aeroporto Regional"} disabled onChange={() => { }} />
            <FloatInput label="Aeroporto ou Porto?" value={local.tipo || "Aeroporto"} disabled onChange={() => { }} />
          </div>
        </Section>

        {/* Proprietários */}
        <Section title="Proprietários">
          <div className="flex flex-col gap-3">
            {local.proprietarios && local.proprietarios.length > 0 ? (
              local.proprietarios.map((prop: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                    <FloatInput
                      label={`Proprietário ${idx + 1}`}
                      value={typeof prop === "string" ? prop : prop?.nome || "João da Silva"}
                      disabled
                      onChange={() => { }}
                    />
                    <FloatInput
                      label="CPF"
                      value={typeof prop === "string" ? "123.456.789-00" : prop?.cpf || "123.456.789-00"}
                      disabled
                      onChange={() => { }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof prop !== "string" && prop) {
                        onNavigate("visualizar-pessoa-fisica", prop);
                      }
                    }}
                    title="Visualizar Detalhes"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-2xs transition-colors hover:bg-gray-50 hover:text-[#1A7A3C]"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3">
                <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                  <FloatInput
                    label="Proprietário"
                    value="João da Silva"
                    disabled
                    onChange={() => { }}
                  />
                  <FloatInput
                    label="CPF"
                    value="123.456.789-00"
                    disabled
                    onChange={() => { }}
                  />
                </div>

                <button
                  type="button"
                  title="Visualizar Detalhes"
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-2xs transition-colors hover:bg-gray-50 hover:text-[#1A7A3C]"
                >
                  <Eye size={18} />
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-4">
            {/* Linha 1: Zona, CEP, Estado, Município e Bairro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <FloatInput label="Zona" value={local.zona || "Urbana"} disabled onChange={() => { }} />
              <FloatInput label="CEP" value={local.cep || "37200-000"} disabled onChange={() => { }} />
              <FloatInput label="Estado" value={local.estado || "Minas Gerais"} disabled onChange={() => { }} />
              <FloatInput label="Município" value={local.municipio || "Lavras"} disabled onChange={() => { }} />
              <FloatInput label="Bairro" value={local.bairro || "Centro"} disabled onChange={() => { }} />
            </div>

            {/* Linha 2: Endereço, Número e Complemento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <FloatInput label="Endereço" value={local.endereco || "Avenida Aeroporto"} disabled onChange={() => { }} />
              </div>
              <div className="md:col-span-3">
                <FloatInput label="Número" value={local.numero || "S/N"} disabled onChange={() => { }} />
              </div>
              <div className="md:col-span-3">
                <FloatInput label="Complemento" value={local.complemento || "-"} disabled onChange={() => { }} />
              </div>
            </div>

            {/* Linha 3: Localidade e Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatInput label="Localidade" value={local.localidade || "-"} disabled onChange={() => { }} />
              <FloatInput label="Distrito" value={local.distrito || "-"} disabled onChange={() => { }} />
            </div>

            {/* Linha 4: Latitude e Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatInput label="Latitude" value={local.latitude || "-21.245263"} disabled onChange={() => { }} />
              <FloatInput label="Longitude" value={local.longitude || "-44.999281"} disabled onChange={() => { }} />
            </div>
          </div>
        </Section>

        {/* Informações de Contato */}
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
                    name="utilizarContatoProprietarios"
                    checked={local.utilizarContatoProprietarios === true}
                    disabled
                    className="h-4 w-4 text-[#1A7A3C] border-gray-300 focus:ring-0 cursor-not-allowed"
                  />
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed">
                  <input
                    type="radio"
                    name="utilizarContatoProprietarios"
                    checked={local.utilizarContatoProprietarios !== true}
                    disabled
                    className="h-4 w-4 text-[#1A7A3C] border-gray-300 focus:ring-0 cursor-not-allowed"
                  />
                  Não
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-2 border-t border-gray-100">
              {/* Item 1: E-mail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FloatInput
                    label="Tipo de Contato"
                    value="E-mail"
                    disabled
                    onChange={() => { }}
                  />
                  <FloatInput
                    label="E-mail"
                    value={local.email || "contato@aeroporto.com.br"}
                    disabled
                    onChange={() => { }}
                  />
                </div>
                <div className="lg:col-span-7">
                  <LargeTextArea
                    label="Observação"
                    value={local.obsEmail || ""}
                    disabled
                    onChange={() => { }}
                  />
                </div>
              </div>

              {/* Item 2: Telefone */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-4 border-t border-gray-100">
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FloatInput
                    label="Tipo de Contato"
                    value="Telefone"
                    disabled
                    onChange={() => { }}
                  />
                  <FloatInput
                    label="Número"
                    value={local.telefone || "(35) 99887-6655"}
                    disabled
                    onChange={() => { }}
                  />
                </div>
                <div className="lg:col-span-7">
                  <LargeTextArea
                    label="Observação"
                    value={local.obsTelefone || ""}
                    disabled
                    onChange={() => { }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {local.anexos && local.anexos.length > 0 ? (
              local.anexos.map((anexo: any, idx: number) => (
                <div key={idx} className="p-4 bg-white shadow-2xs flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                      {idx + 1}
                    </span>

                    <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                      <FloatInput
                        label="Documento"
                        value={typeof anexo === "string" ? anexo : anexo?.nome || "alvara_funcionamento.pdf"}
                        disabled
                        onChange={() => { }}
                      />
                      <FloatInput
                        label="Descrição"
                        value={typeof anexo === "string" ? "-" : anexo?.descricao || "Licença do Aeroporto"}
                        disabled
                        onChange={() => { }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => { }}
                      title="Baixar Anexo"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#1A7A3C]"
                    >
                      <Download size={18} />
                    </button>
                  </div>

                  <span className="text-[11px] text-gray-400 pl-10">
                    Formatos permitidos: PNG, JPG ou PDF de até 50MB.
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                    1
                  </span>

                  <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                    <FloatInput
                      label="Documento"
                      value="licenca_operacional.pdf"
                      disabled
                      onChange={() => { }}
                    />
                    <FloatInput
                      label="Descrição"
                      value="Licença de Operação e Funcionamento"
                      disabled
                      onChange={() => { }}
                    />
                  </div>

                  <button
                    type="button"
                    title="Baixar Anexo"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#1A7A3C]"
                  >
                    <Download size={18} />
                  </button>
                </div>

                <span className="text-[11px] text-gray-400 pl-10">
                  Formatos permitidos: PNG, JPG ou PDF de até 50MB.
                </span>
              </div>
            )}
          </div>
        </Section>

        {/* Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observações" value={local.observacao || "Nenhuma observação registrada."} disabled onChange={() => { }} />
        </Section>

      </main>
    </div>
  );
}