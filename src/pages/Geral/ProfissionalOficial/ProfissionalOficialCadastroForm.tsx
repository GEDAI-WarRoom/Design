import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  PessoaFisicaInput,
  PESSOAS_FISICAS_MOCK,
  UnidadeAdministrativaInput,
} from "../../../components/ui/EntitySearch";

export interface ProfissionalOficialValue {
  id?: number;
  pessoa: { id?: number; nome: string; documento: string };
  esfera: "Municipal" | "Estadual" | "Federal";
  masp: string;
  unidade: { id?: number; nome: string };
  anexos: { id: string; nome: string; descricao: string }[];
  observacao: string;
}

const ESFERAS = [
  { value: "Municipal", label: "Municipal" },
  { value: "Estadual", label: "Estadual" },
  { value: "Federal", label: "Federal" },
];

function textoOuPadrao(valor: unknown, padrao: string) {
  return typeof valor === "string" && valor.trim() ? valor : padrao;
}

export function normalizarProfissionalOficial(dados?: any): ProfissionalOficialValue {
  const esfera = ["Municipal", "Estadual", "Federal"].includes(dados?.esfera)
    ? dados.esfera
    : "Estadual";
  const unidadeInformada =
    typeof dados?.unidade === "object" ? dados.unidade?.nome : dados?.unidade;

  return {
    id: typeof dados?.id === "number" ? dados.id : undefined,
    pessoa: {
      id: dados?.pessoa?.id,
      nome: textoOuPadrao(dados?.pessoa?.nome ?? dados?.nome, "Josephina Arantes"),
      documento: textoOuPadrao(
        dados?.pessoa?.documento ?? dados?.pessoa?.cpf ?? dados?.cpf,
        "444.009.956-40",
      ),
    },
    esfera,
    masp: textoOuPadrao(dados?.masp ?? dados?.matricula, "1017185-8"),
    unidade: {
      id: dados?.unidade?.id,
      nome: textoOuPadrao(
        unidadeInformada ?? dados?.unidadeAdministrativa,
        "Coordenadoria Regional de Belo Horizonte",
      ),
    },
    anexos:
      Array.isArray(dados?.anexos) && dados.anexos.length > 0
        ? dados.anexos
        : [
            {
              id: "anexo-exemplo",
              nome: "portaria_nomeacao.pdf",
              descricao: "Portaria de nomeação do profissional.",
            },
          ],
    observacao: textoOuPadrao(
      dados?.observacao,
      "Profissional vinculado ao serviço oficial estadual para atendimento regional.",
    ),
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface Props {
  value: ProfissionalOficialValue;
  onChange?: (value: ProfissionalOficialValue) => void;
  disabled?: boolean;
  onNavigate?: (screen: string, data?: any) => void;
}

export function ProfissionalOficialCadastroForm({
  value,
  onChange,
  disabled = false,
  onNavigate,
}: Props) {
  const atualizar = (campos: Partial<ProfissionalOficialValue>) =>
    onChange?.({ ...value, ...campos });
  const pessoas = [
    value.pessoa,
    ...PESSOAS_FISICAS_MOCK.filter((pessoa) => pessoa.nome !== value.pessoa.nome),
  ];

  return (
    <div className="flex flex-col gap-5">
      <Section title="Informações Básicas">
        <div className="flex flex-col gap-6">
          <PessoaFisicaInput
            value={value.pessoa.nome}
            data={pessoas}
            required
            disabled={disabled}
            onChange={(pessoa) =>
              atualizar({
                pessoa: {
                  id: pessoa?.id,
                  nome: pessoa?.nome || value.pessoa.nome,
                  documento: pessoa?.documento || value.pessoa.documento,
                },
              })
            }
            onEyeClick={() => onNavigate?.("visualizar-pessoa-fisica", value.pessoa)}
          />

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
            <span className="text-sm font-semibold text-gray-700">Serviço Oficial</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatSelect
                label="Esfera do Serviço Oficial"
                required
                value={value.esfera}
                onChange={(esfera) =>
                  atualizar({
                    esfera: esfera as ProfissionalOficialValue["esfera"],
                    masp: esfera === "Estadual" ? value.masp || "1017185-8" : "",
                  })
                }
                options={ESFERAS}
                disabled={disabled}
              />
              {value.esfera === "Estadual" && (
                <FloatInput
                  label="MASP"
                  required
                  value={value.masp}
                  onChange={(masp) => atualizar({ masp })}
                  disabled={disabled}
                />
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Unidade Administrativa de Vinculação">
        {disabled ? (
          <FloatInput
            label="Unidade Administrativa"
            required
            value={value.unidade.nome}
            disabled
            onChange={() => {}}
          />
        ) : (
          <UnidadeAdministrativaInput
            label="Unidade Administrativa"
            required
            value={value.unidade.nome}
            onChange={(unidade) =>
              atualizar({
                unidade: {
                  id: unidade?.id,
                  nome: unidade?.nome || value.unidade.nome,
                },
              })
            }
            onEyeClick={() =>
              onNavigate?.("visualizar-unidade-administrativa", value.unidade)
            }
          />
        )}
      </Section>

      <Section title="Anexo">
        <div className="flex flex-col gap-5">
          {value.anexos.map((anexo, index) => (
            <div key={anexo.id} className="flex items-start gap-4">
              <div className="w-6 h-6 mt-3 rounded-full bg-[#1A7A3C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadField
                  label="Documento"
                  required
                  fileName={anexo.nome}
                  disabled={disabled}
                  onSelectFile={() => {
                    const anexos = value.anexos.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, nome: `documento_${itemIndex + 1}.pdf` }
                        : item,
                    );
                    atualizar({ anexos });
                  }}
                />
                <FloatInput
                  label="Descrição"
                  value={anexo.descricao}
                  disabled={disabled}
                  onChange={(descricao) => {
                    const anexos = value.anexos.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, descricao } : item,
                    );
                    atualizar({ anexos });
                  }}
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  aria-label="Excluir anexo"
                  onClick={() =>
                    atualizar({ anexos: value.anexos.filter((item) => item.id !== anexo.id) })
                  }
                  className="p-2 mt-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={19} />
                </button>
              )}
            </div>
          ))}
          {!disabled && (
            <button
              type="button"
              onClick={() =>
                atualizar({
                  anexos: [
                    ...value.anexos,
                    { id: `anexo-${Date.now()}`, nome: "", descricao: "" },
                  ],
                })
              }
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          )}
        </div>
      </Section>

      <Section title="Observações">
        <LargeTextArea
          label="Observação"
          value={value.observacao}
          onChange={(observacao) => atualizar({ observacao })}
          disabled={disabled}
          maxLength={1500}
          hasTooltip={!disabled}
          tooltipText="Informações adicionais pertinentes ao cadastro."
        />
      </Section>
    </div>
  );
}
