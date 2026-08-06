import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";

// Ajuste os caminhos abaixo conforme a estrutura de pastas do seu projeto
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const FORMACOES_OPCOES = [
  "Médico Veterinário",
  "Biofísico",
  "Biólogo",
  "Bioquímico",
  "Biotecnólogo",
  "Engenheiro Agrícola",
  "Engenheiro Agrônomo",
  "Zootecnista",
].map((f) => ({ value: f, label: f }));

const TIPO_REGISTRO_CRMV_OPCOES = [
  { value: "Primário", label: "Primário" },
  { value: "Secundário", label: "Secundário" },
];

const ESCRITORIOS_SECCIONAIS_MOCK = [
  { value: "Escritório Seccional Belo Horizonte", label: "Escritório Seccional Belo Horizonte" },
  { value: "Escritório Seccional Lavras", label: "Escritório Seccional Lavras" },
  { value: "Escritório Seccional Uberlândia", label: "Escritório Seccional Uberlândia" },
];

// Utilitário para extrair valor com segurança de eventos ou strings puras
const parseVal = (e: any) => (e && e.target !== undefined ? e.target.value : e);

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/80 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

export function EditarProfissionalAnimalPage({
  onLogout = () => {},
  onNavigate = () => {},
  dados,
}: {
  onLogout?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
  dados?: any;
}) {
  const r = dados ?? {
    pessoaFisica: {
      nome: "José Aarão Neto",
      documento: "555.009.956-40",
      servicoOficial: "Sim",
      esfera: "Estadual",
      masp: "10455301",
    },
    formacao: "Médico Veterinário",
    crmvMg: "12345/MG",
    tipoRegistroCrmv: "Primário",
    vacinacaoBrucelose: true,
    observacao: "Profissional habilitado e atuante.",
    anexos: [{ id: "anx-1", nome: "diploma.pdf", descricao: "Diploma" }],
    habilitacoes: {
      gta: [
        {
          id: "gta-1",
          numero: "1234/26",
          dataHabilitation: "2025-01-01",
          escritorioSeccional: "Escritório Seccional Belo Horizonte",
          situacao: "Ativo",
        },
      ],
    },
  };

  const [formacao, setFormacao] = useState(r.formacao || "Médico Veterinário");
  const [crmvMg, setCrmvMg] = useState(r.crmvMg || "");
  const [tipoRegistroCrmv, setTipoRegistroCrmv] = useState(
    r.tipoRegistroCrmv || "Primário"
  );
  const [vacinacaoBrucelose, setVacinacaoBrucelose] = useState<boolean | "">(
    r.vacinacaoBrucelose ?? true
  );

  const [anexos, setAnexos] = useState<any[]>(r.anexos || []);
  const [habilitacoesGta, setHabilitacoesGta] = useState<any[]>(
    r.habilitacoes?.gta || []
  );
  const [observacao, setObservacao] = useState(r.observacao || "");

  const adicionarHabilitacaoGta = () => {
    setHabilitacoesGta((prev) => [
      ...prev,
      {
        id: `gta-${Date.now()}`,
        numero: "",
        dataHabilitation: "",
        escritorioSeccional: "",
        situacao: "Ativo",
      },
    ]);
  };

  const removerHabilitacaoGta = (id: string) => {
    setHabilitacoesGta((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSalvar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dadosSalvos = {
      ...r,
      formacao,
      crmvMg,
      tipoRegistroCrmv,
      vacinacaoBrucelose,
      anexos,
      habilitacoes: {
        ...r.habilitacoes,
        gta: habilitacoesGta,
      },
      observacao,
    };
    onNavigate("visualizar-profissional-animal", dadosSalvos);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] flex flex-col pb-12">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="profissional-area-animal"
        hideSearch
      />

      <main className="max-w-[1088px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() =>
              onNavigate("visualizar-profissional-animal", r)
            }
            className="flex items-center gap-1 text-sm font-medium mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Voltar para Visualizar Profissional
          </button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Profissional da Área Animal
            </h1>

            <button
              type="button"
              onClick={handleSalvar}
              className="h-10 px-6 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white font-semibold text-sm transition shadow-sm flex items-center gap-2 self-start md:self-auto"
            >
              Salvar
            </button>
          </div>
        </div>

        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
          <Section title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput
                label="Nome do Profissional"
                value={r.pessoaFisica?.nome || ""}
                disabled
                onChange={() => {}}
              />
              <FloatInput
                label="CPF"
                value={r.pessoaFisica?.documento || ""}
                disabled
                onChange={() => {}}
              />
            </div>
          </Section>

          <Section title="Informações Profissionais">
            <div className="flex flex-col gap-4">
              <FloatSelect
                label="Formação Profissional *"
                value={formacao}
                onChange={(val: any) => setFormacao(parseVal(val))}
                options={FORMACOES_OPCOES}
              />

              {formacao === "Médico Veterinário" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput
                    label="CRMV-MG *"
                    value={crmvMg}
                    onChange={(e: any) => setCrmvMg(parseVal(e))}
                  />
                  <FloatSelect
                    label="Tipo de Registro CRMV *"
                    value={tipoRegistroCrmv}
                    onChange={(val: any) => setTipoRegistroCrmv(parseVal(val))}
                    options={TIPO_REGISTRO_CRMV_OPCOES}
                  />
                </div>
              )}
            </div>
          </Section>

          {formacao === "Médico Veterinário" && (
            <Section title="Vacinação Contra Brucelose">
              <SimNao
                label="Cadastrado para Vacinação Contra Brucelose? *"
                name="vacinacao-brucelose"
                value={vacinacaoBrucelose}
                onChange={setVacinacaoBrucelose}
              />
            </Section>
          )}

          <Section title="Habilitações (Emissão de GTA)">
            <div className="flex flex-col gap-4">
              {habilitacoesGta.map((hab, index) => (
                <div
                  key={hab.id}
                  className="p-4 border rounded-lg bg-gray-50/60 flex flex-col gap-3 relative"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-gray-600">
                      Habilitação GTA #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerHabilitacaoGta(hab.id)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                      title="Remover Habilitação"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FloatInput
                      label="Número da Habilitação *"
                      value={hab.numero}
                      placeholder="Ex: 1234/26"
                      onChange={(e: any) => {
                        const val = parseVal(e);
                        setHabilitacoesGta((prev) =>
                          prev.map((h) =>
                            h.id === hab.id ? { ...h, numero: val } : h
                          )
                        );
                      }}
                    />
                    <FloatInput
                      label="Data da Habilitação *"
                      type="date"
                      value={hab.dataHabilitation}
                      onChange={(e: any) => {
                        const val = parseVal(e);
                        setHabilitacoesGta((prev) =>
                          prev.map((h) =>
                            h.id === hab.id
                              ? { ...h, dataHabilitation: val }
                              : h
                          )
                        );
                      }}
                    />
                    <FloatSelect
                      label="Escritório Seccional *"
                      value={hab.escritorioSeccional}
                      onChange={(e: any) => {
                        const val = parseVal(e);
                        setHabilitacoesGta((prev) =>
                          prev.map((h) =>
                            h.id === hab.id
                              ? { ...h, escritorioSeccional: val }
                              : h
                          )
                        );
                      }}
                      options={ESCRITORIOS_SECCIONAIS_MOCK}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarHabilitacaoGta}
                className="flex items-center gap-2 border border-[#1A7A3C] text-[#1A7A3C] px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-50 self-start transition"
              >
                <PlusCircle size={16} />
                Adicionar Habilitação GTA
              </button>
            </div>
          </Section>

          <Section title="Anexos">
            <div className="flex flex-col gap-4">
              {anexos.map((anexo, index) => (
                <div
                  key={anexo.id || index}
                  className="flex gap-3 items-center"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UploadField
                      label="Anexo *"
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
                    <FloatInput
                      label="Descrição do Anexo"
                      value={anexo.descricao || ""}
                      onChange={(e: any) => {
                        const val = parseVal(e);
                        setAnexos((prev) =>
                          prev.map((a, i) =>
                            i === index ? { ...a, descricao: val } : a
                          )
                        );
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAnexos((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setAnexos((prev) => [
                    ...prev,
                    { id: `anx-${Date.now()}`, nome: "", descricao: "" },
                  ])
                }
                className="flex items-center gap-2 border border-[#1A7A3C] text-[#1A7A3C] px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-50 self-start transition"
              >
                <PlusCircle size={16} />
                Adicionar Anexo
              </button>
            </div>
          </Section>

          <Section title="Observações">
            <LargeTextArea
              label="Observação"
              value={observacao}
              onChange={(e: any) => setObservacao(parseVal(e))}
            />
          </Section>
        </form>
      </main>
    </div>
  );
}

export default EditarProfissionalAnimalPage;