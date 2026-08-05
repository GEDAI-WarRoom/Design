import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, UploadField, SimNao
} from "../../../components/ui/FormKit";
import { BlocoEnderecoFields, BlocoContatoFields, ProprietarioInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: React.ReactNode; children: React.ReactNode; comDivisor?: boolean }) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100 my-2" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  data?: any;
}

export function EditarPromotoraEventosPage({ onLogout, onNavigate, data }: PageProps) {
  const [nomeComercial, setNomeComercial] = useState(data?.nome || "Promotora São José");
  const [numeroRegistro] = useState(data?.numeroRegistro || "14385");
  const [aderidaFundesa, setAderidaFundesa] = useState<boolean | "">(false);

  const [proprietario, setProprietario] = useState<any>({
    nome: data?.proprietarioNomeFantasia || "Promotora São Luiz",
    documento: data?.proprietarioCnpj || "444.009.956-40",
  });

  const [endereco, setEndereco] = useState<any>({
    zona: "Rural",
    cep: "",
    estado: data?.estado || "Minas Gerais",
    municipio: data?.municipio || "Lavras",
    bairro: "",
    endereco: "Estrada de chão no Km 12",
    numero: "",
    complemento: "",
    localidade: "Floresta",
    distrito: "Abaeté",
    latitude: "19º 09' 57\"S",
    longitude: "044º 21' 48\" W",
  });

  const [contatos, setContatos] = useState<any>({
    utilizarContatoProprietario: "Não",
    proprietariosSelecionados: [],
    emailFixo: "revsaojose@email.com",
    emailFixoObs: "",
    telefoneFixo: "(35) 98456-5654",
    telefoneFixoObs: "",
    contatosAdicionais: [],
  });

  const [anexos, setAnexos] = useState<any[]>([]);
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">(data?.situacao === "Inativo" ? "Inativo" : "Ativo");
  const [isSucesso, setIsSucesso] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="promotora-eventos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Topo / Botão de Hierarquia Corrigido */}
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
            <h1 className="text-2xl font-semibold text-gray-900">Editar Promotora de Eventos Pecuários</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-6 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Banner Informação */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-3 my-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={18} className="stroke-[2.5]" />
          </div>
          <p className="text-xs text-gray-600 font-medium">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput
                label="Nome Comercial da Promotora *"
                value={nomeComercial}
                onChange={setNomeComercial}
                maxLength={255}
              />
              <FloatInput
                label="Número de Registro *"
                value={numeroRegistro}
                readOnly
              />
            </div>

            <SubGrupo titulo="Opção de Recolhimento" comDivisor>
              <SimNao
                label="Promotora Aderida ao Fundo Privado (FUNDESA)?"
                name="aderida-fundesa-edit"
                required
                value={aderidaFundesa}
                onChange={setAderidaFundesa}
              />
            </SubGrupo>
          </div>
        </Section>

        {/* Proprietário */}
        <Section title="Proprietário">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <ProprietarioInput
              value={proprietario ? proprietario.nome : ""}
              required
              onChange={(ent: any) => setProprietario(ent)}
              onEyeClick={() => onNavigate("visualizar-pessoa", proprietario)}
            />
            <FloatInput
              label="CPF *"
              value={proprietario?.documento || ""}
              readOnly
            />
          </div>
        </Section>

        {/* Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) => setEndereco((prev: any) => ({ ...prev, [key]: value }))}
            onSetMultipleFields={(fields) => setEndereco((prev: any) => ({ ...prev, ...fields }))}
          />
        </Section>

        {/* Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contatos}
            onChange={(updated) => setContatos((prev: any) => ({ ...prev, ...updated }))}
          />
        </Section>

        {/* Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white border border-gray-100">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos((prev) =>
                          prev.map((a, i) => (i === index ? { ...a, nome: `documento_${index + 1}.pdf` } : a))
                        )
                      }
                    />
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) =>
                              setAnexos((prev) =>
                                prev.map((a, i) => (i === index ? { ...a, descricao: v.slice(0, 255) } : a))
                              )
                            }
                            maxLength={255}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => onNavigate("baixar-documento", anexo)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                            title="Baixar documento"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remover anexo"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAnexos((prev) => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* Situação do Cadastro */}
        <Section title="Situação do Cadastro">
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500">
              Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
            </p>
            <div className="flex items-center gap-6 mt-1">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="situacao"
                  checked={situacao === "Inativo"}
                  onChange={() => setSituacao("Inativo")}
                  className="accent-[#1A7A3C]"
                />
                Inativo
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="situacao"
                  checked={situacao === "Ativo"}
                  onChange={() => setSituacao("Ativo")}
                  className="accent-[#1A7A3C]"
                />
                Ativo
              </label>
            </div>
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Cadastro atualizado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              As alterações da promotora "{nomeComercial}" foram salvas.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("promotora-eventos");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar à Lista
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-promotora-eventos", {
                    nome: nomeComercial,
                    numeroRegistro,
                    situacao,
                    estado: endereco.estado,
                    municipio: endereco.municipio,
                  });
                }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}