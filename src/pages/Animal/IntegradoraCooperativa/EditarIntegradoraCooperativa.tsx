import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Info,
  Trash2,
  PlusCircle,
  Download,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  UploadField,
  LargeTextArea,
} from "../../../components/ui/FormKit";
import {
  DynamicListWrapper,
  ProprietarioInput,
  BlocoEnderecoFields,
  BlocoContatoFields,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

const TIPO_INTEGRADORA_COOPERATIVA = [
  { value: "Integradora", label: "Integradora" },
  { value: "Cooperativa", label: "Cooperativa" },
];

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

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function EditarIntegradoraCooperativaPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registroInicial = dados || {
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
      telefoneFixo: "(35) 99999-1111",
    },
    observacao: "",
    anexos: [
      {
        id: "1",
        nome: "contrato_social.pdf",
        descricao: "Contrato Social Registrado",
      },
    ],
  };

  const [nomeComercial, setNomeComercial] = useState(
    registroInicial.nomeComercial || registroInicial.nome || "Agro Alimentos Ferreira Ltda"
  );
  const [tipo, setTipo] = useState(registroInicial.tipo || "Integradora");

  const [proprietarios, setProprietarios] = useState<any[]>(
    registroInicial.proprietarios && registroInicial.proprietarios.length > 0
      ? registroInicial.proprietarios
      : [
          {
            uid: uid("prop"),
            entidade: {
              nome: "Divino de Souza Sobrinho",
              documento: "444.009.956-40",
            },
          },
        ]
  );

  const [endereco, setEndereco] = useState<any>(
    registroInicial.endereco || {
      zona: "Rural",
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
    }
  );

  const [contato, setContato] = useState<any>(
    registroInicial.contato || {
      utilizarContatoProprietario: "Não",
      emailFixo: "divino.sobrinho@email.com",
      telefoneFixo: "(35) 99999-1111",
    }
  );

  const [observacao, setObservacao] = useState(registroInicial.observacao || "");
  const [anexos, setAnexos] = useState<any[]>(registroInicial.anexos || []);

  // Controle do Modal Único de Confirmação
  const [modalConfirmSalvar, setModalConfirmSalvar] = useState(false);

  const getRegistroAtualizado = () => ({
    ...registroInicial,
    nome: nomeComercial,
    nomeComercial,
    tipo,
    proprietarios,
    endereco,
    contato,
    observacao,
    anexos,
  });

  const handleConfirmSave = () => {
    setModalConfirmSalvar(false);
    onNavigate("visualizar-integradora-cooperativa", getRegistroAtualizado());
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Integradora / Cooperativa
            </h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalConfirmSalvar(true)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Banner de Obrigatoriedade */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são
            obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput
              label="Nome Comercial da Integradora / Cooperativa"
              required
              value={nomeComercial}
              onChange={setNomeComercial}
              maxLength={255}
            />
            <FloatSelect
              label="Integradora ou Cooperativa?"
              required
              value={tipo}
              onChange={setTipo}
              options={TIPO_INTEGRADORA_COOPERATIVA}
            />
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() =>
              setProprietarios((p) => [...p, { uid: uid("prop"), entidade: null }])
            }
            onRemoveItem={(i: number) =>
              setProprietarios((p) => p.filter((_, idx) => idx !== i))
            }
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                value={item.entidade ? item.entidade.nome : ""}
                required
                onChange={(ent: any) =>
                  setProprietarios((prev) =>
                    prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p))
                  )
                }
                onEyeClick={() =>
                  item.entidade && onNavigate("visualizar-pessoa", item.entidade)
                }
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) =>
              setEndereco((prev: any) => ({ ...prev, [key]: value }))
            }
            onSetMultipleFields={(fields) =>
              setEndereco((prev: any) => ({ ...prev, ...fields }))
            }
          />
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contato}
            onChange={(updated) =>
              setContato((prev: any) => ({ ...prev, ...updated }))
            }
            proprietariosDisponiveis={proprietarios
              .filter((p) => p.entidade)
              .map((p) => ({
                id: p.uid,
                nome: p.entidade.nome,
                cpf: p.entidade.documento,
              }))}
          />
        </Section>

        {/* 5. Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div
                key={anexo.id || index}
                className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white"
              >
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
                          prev.map((a, i) =>
                            i === index
                              ? { ...a, nome: `documento_${index + 1}.pdf` }
                              : a
                          )
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
                                prev.map((a, i) =>
                                  i === index
                                    ? { ...a, descricao: v.slice(0, 255) }
                                    : a
                                )
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
                        onClick={() =>
                          setAnexos((prev) => prev.filter((_, i) => i !== index))
                        }
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
              onClick={() =>
                setAnexos((prev) => [
                  ...prev,
                  { id: String(Date.now()), nome: "", descricao: "" },
                ])
              }
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* 6. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            maxLength={1500}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE SALVAMENTO (CENTRALIZADO) */}
      {modalConfirmSalvar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center flex flex-col items-center justify-center gap-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center">
              Salvar Alterações da Integradora e Cooperativa
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed text-center">
              Deseja salvar as alterações da integradora/cooperativa {nomeComercial}?
            </p>

            <div className="flex items-center justify-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setModalConfirmSalvar(false)}
                className="px-6 py-2.5 border-2 border-[#1A7A3C] text-[#1A7A3C] font-bold text-sm rounded-lg hover:bg-green-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-6 py-2.5 bg-[#1A7A3C] hover:bg-[#15612F] text-white font-bold text-sm rounded-lg transition shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}