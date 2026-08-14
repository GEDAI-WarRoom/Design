import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  BlocoContatoFields,
  BlocoEnderecoFields,
  DynamicListWrapper,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = (prefixo: string) =>
  `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const PROPRIETARIOS_CONTATO = [
  { id: "prop-1", nome: "Carlos Henrique Silva", cpf: "123.456.789-00", email: "carlos.silva@email.com", telefone: "(11) 98888-7777" },
  { id: "prop-2", nome: "Maria Fernanda Oliveira", cpf: "987.654.321-11", email: "maria.fernanda@email.com", telefone: "(21) 99999-8888" },
  { id: "prop-3", nome: "Antônio Marcos de Souza", cpf: "456.123.789-22", email: "antonio.marcos@email.com", telefone: "(31) 97777-6666" },
  { id: "prop-4", nome: "Juliana Costa Rezende", cpf: "789.456.123-33", email: "juliana.costa@email.com", telefone: "(61) 96666-5555" },
];

export type PromotoraEventosMode = "create" | "edit" | "view";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  mode?: PromotoraEventosMode;
  data?: any;
  dados?: any;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  readOnly?: boolean;
  defaultOpen?: boolean;
}

function Section({ title, children, readOnly = false, defaultOpen = true }: SectionProps) {
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
        <fieldset
          disabled={readOnly}
          className="promotora-form-fields min-w-0 border-0 m-0 px-6 pb-6 border-t border-gray-100 pt-5"
        >
          {children}
        </fieldset>
      )}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
  comDivisor = false,
}: {
  titulo: React.ReactNode;
  children: React.ReactNode;
  comDivisor?: boolean;
}) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

function normalizarFundesa(valor: unknown, usarExemplo: boolean): boolean | "" {
  if (valor === true || valor === "Sim") return true;
  if (valor === false || valor === "Não") return false;
  return usarExemplo ? false : "";
}

function valorPreenchido(valor: unknown, exemplo: string, usarExemplo: boolean) {
  if (typeof valor === "string" && valor.trim() !== "") return valor;
  if (valor !== undefined && valor !== null && typeof valor !== "string") return String(valor);
  return usarExemplo ? exemplo : "";
}

function normalizarProprietarios(dados: any, usarExemplo: boolean) {
  let proprietariosOriginais: any[] = [];

  if (Array.isArray(dados?.proprietarios) && dados.proprietarios.length > 0) {
    proprietariosOriginais = dados.proprietarios;
  } else if (dados?.proprietario) {
    proprietariosOriginais = [dados.proprietario];
  } else if (dados?.proprietarioNomeFantasia) {
    proprietariosOriginais = [{
      id: dados.id,
      nome: dados.proprietarioNomeFantasia,
      documento: dados.proprietarioCnpj,
    }];
  } else if (usarExemplo) {
    proprietariosOriginais = [{
      id: 1,
      nome: "José Aarão Neto",
      documento: "555.009.956-40",
      tipo: "PF",
    }];
  }

  const normalizados = proprietariosOriginais.map((item, index) => {
    const entidadeOriginal = item?.entidade ?? item;
    const nome = entidadeOriginal?.nome ?? entidadeOriginal?.nomeFantasia ?? "";
    const documento = entidadeOriginal?.documento ?? entidadeOriginal?.cnpj ?? entidadeOriginal?.cpf ?? "";

    return {
      uid: item?.uid ?? `${uid("prop")}-${index}`,
      entidade: nome
        ? {
            ...entidadeOriginal,
            id: entidadeOriginal?.id ?? `${index + 1}`,
            nome,
            documento,
            tipo: entidadeOriginal?.tipo ?? (documento.includes("/") ? "PJ" : "PF"),
          }
        : null,
    };
  });

  if (normalizados.some((item) => item.entidade)) return normalizados;

  if (usarExemplo) {
    return [{
      uid: uid("prop"),
      entidade: {
        id: 1,
        nome: "José Aarão Neto",
        documento: "555.009.956-40",
        tipo: "PF",
      },
    }];
  }

  return [{ uid: uid("prop"), entidade: null }];
}

function normalizarContato(dados: any, usarExemplo: boolean) {
  const contatoOriginal = dados?.contatos ?? dados?.contato;

  if (contatoOriginal && !Array.isArray(contatoOriginal)) {
    return {
      utilizarContatoProprietario: contatoOriginal.utilizarContatoProprietario ?? "Não",
      proprietariosSelecionados: contatoOriginal.proprietariosSelecionados ?? [],
      emailFixo: valorPreenchido(contatoOriginal.emailFixo, "contato@promotorasaojose.com.br", usarExemplo),
      emailFixoObs: valorPreenchido(contatoOriginal.emailFixoObs, "Contato administrativo.", usarExemplo),
      telefoneFixo: valorPreenchido(contatoOriginal.telefoneFixo, "(35) 98456-5654", usarExemplo),
      telefoneFixoObs: valorPreenchido(contatoOriginal.telefoneFixoObs, "Atendimento em horário comercial.", usarExemplo),
      contatosAdicionais: contatoOriginal.contatosAdicionais ?? [],
    };
  }

  if (Array.isArray(contatoOriginal)) {
    const email = contatoOriginal.find((item: any) => item.tipo === "E-mail");
    const telefone = contatoOriginal.find((item: any) => item.tipo === "Telefone");
    return {
      utilizarContatoProprietario: "Não",
      proprietariosSelecionados: [],
      emailFixo: valorPreenchido(email?.valor, "contato@promotorasaojose.com.br", usarExemplo),
      emailFixoObs: valorPreenchido(email?.observacao, "Contato administrativo.", usarExemplo),
      telefoneFixo: valorPreenchido(telefone?.valor, "(35) 98456-5654", usarExemplo),
      telefoneFixoObs: valorPreenchido(telefone?.observacao, "Atendimento em horário comercial.", usarExemplo),
      contatosAdicionais: [],
    };
  }

  return {
    utilizarContatoProprietario: "Não",
    proprietariosSelecionados: [],
    emailFixo: usarExemplo ? "contato@promotorasaojose.com.br" : "",
    emailFixoObs: usarExemplo ? "Contato administrativo." : "",
    telefoneFixo: usarExemplo ? "(35) 98456-5654" : "",
    telefoneFixoObs: usarExemplo ? "Atendimento em horário comercial." : "",
    contatosAdicionais: [],
  };
}

function normalizarEndereco(dados: any, usarExemplo: boolean) {
  const original = dados?.endereco ?? dados?.localizacao ?? {};

  return {
    zona: valorPreenchido(original.zona, "Rural", usarExemplo),
    cep: valorPreenchido(original.cep, "37200-000", usarExemplo),
    estado: valorPreenchido(original.estado ?? dados?.estado, "Minas Gerais", true),
    municipio: valorPreenchido(original.municipio ?? dados?.municipio, "Lavras", usarExemplo),
    bairro: valorPreenchido(original.bairro, "Zona Rural", usarExemplo),
    endereco: valorPreenchido(original.endereco, "Estrada de Chão, km 12", usarExemplo),
    numero: valorPreenchido(original.numero, "S/N", usarExemplo),
    complemento: valorPreenchido(original.complemento, "Parque de Exposições", usarExemplo),
    localidade: valorPreenchido(original.localidade, "Floresta", usarExemplo),
    distrito: valorPreenchido(original.distrito, "Abaeté", usarExemplo),
    latitude: valorPreenchido(original.latitude, "-21.245100", usarExemplo),
    longitude: valorPreenchido(original.longitude, "-44.999200", usarExemplo),
  };
}

function criarDadosIniciais(dados: any, usarExemplo: boolean) {
  return {
    nomeComercial: valorPreenchido(dados?.nomeComercial ?? dados?.nome, "Promotora São José", usarExemplo),
    aderidaFundesa: normalizarFundesa(dados?.aderidaFundesa, usarExemplo),
    proprietarios: normalizarProprietarios(dados, usarExemplo),
    endereco: normalizarEndereco(dados, usarExemplo),
    contatos: normalizarContato(dados, usarExemplo),
    anexos: Array.isArray(dados?.anexos) && dados.anexos.length > 0
      ? dados.anexos
      : usarExemplo
        ? [{ id: "anexo-exemplo", nome: "documento_promotora.pdf", descricao: "Documento da promotora" }]
        : [],
    observacao: valorPreenchido(
      dados?.observacao,
      "Promotora habilitada para a realização de eventos pecuários.",
      usarExemplo,
    ),
  };
}

export function AdicionarPromotoraEventosPage({
  onLogout,
  onNavigate,
  mode = "create",
  data,
  dados,
}: PageProps) {
  const origem = dados ?? data ?? {};
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const dadosIniciais = useMemo(
    () => criarDadosIniciais(origem, mode !== "create"),
    // A página é remontada a cada navegação; a origem serve somente para hidratar o formulário.
    [],
  );

  const [nomeComercial, setNomeComercial] = useState(dadosIniciais.nomeComercial);
  const [aderidaFundesa, setAderidaFundesa] = useState<boolean | "">(dadosIniciais.aderidaFundesa);
  const [proprietarios, setProprietarios] = useState<any[]>(dadosIniciais.proprietarios);
  const [endereco, setEndereco] = useState<any>(dadosIniciais.endereco);
  const [contatos, setContatos] = useState<any>(dadosIniciais.contatos);
  const [anexos, setAnexos] = useState<any[]>(dadosIniciais.anexos);
  const [observacao, setObservacao] = useState(dadosIniciais.observacao);
  const [isSucesso, setIsSucesso] = useState(false);

  const registroAtual = {
    ...origem,
    nome: nomeComercial,
    nomeComercial,
    aderidaFundesa,
    proprietarios,
    proprietarioNomeFantasia: proprietarios[0]?.entidade?.nome ?? "",
    proprietarioCnpj: proprietarios[0]?.entidade?.documento ?? "",
    endereco,
    estado: endereco.estado,
    municipio: endereco.municipio,
    contatos,
    anexos,
    observacao,
    situacao: origem?.situacao ?? "Ativo",
  };

  const registroParaVisualizar = criarDadosIniciais(registroAtual, true);
  const dadosNavegacao = {
    ...registroAtual,
    ...registroParaVisualizar,
    nome: registroParaVisualizar.nomeComercial,
    proprietarioNomeFantasia: registroParaVisualizar.proprietarios[0]?.entidade?.nome ?? "",
    proprietarioCnpj: registroParaVisualizar.proprietarios[0]?.entidade?.documento ?? "",
    estado: registroParaVisualizar.endereco.estado,
    municipio: registroParaVisualizar.endereco.municipio,
  };

  const titulo = isView
    ? "Visualizar Promotora de Eventos Pecuários"
    : isEdit
      ? "Editar Promotora de Eventos Pecuários"
      : "Adicionar Promotora de Eventos Pecuários";

  return (
    <div className={`min-h-screen bg-[#f2f3f5] ${isView ? "promotora-eventos-view" : ""}`}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="promotora-eventos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("promotora-eventos")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Promotoras de Eventos Pecuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{titulo}</h1>
            {isView ? (
              <button
                type="button"
                onClick={() => onNavigate("editar-promotora-eventos", dadosNavegacao)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSucesso(true)}
                className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
              >
                {isEdit ? "Salvar" : "Adicionar"}
              </button>
            )}
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas" readOnly={isView}>
          <div className="flex flex-col gap-5">
            <FloatInput
              label="Nome Comercial da Promotora"
              required
              value={nomeComercial}
              onChange={setNomeComercial}
              maxLength={255}
            />
            <SubGrupo titulo="Opção de Recolhimento" comDivisor>
              <SimNao
                label="Promotora Aderida ao Fundo Privado (FUNDESA)?"
                name={`aderida-fundesa-${mode}`}
                required
                value={aderidaFundesa}
                onChange={setAderidaFundesa}
              />
            </SubGrupo>
          </div>
        </Section>

        <Section title="Proprietários" readOnly={isView}>
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((atuais) => [...atuais, { uid: uid("prop"), entidade: null }])}
            onRemoveItem={(index: number) => setProprietarios((atuais) => atuais.filter((_, itemIndex) => itemIndex !== index))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                value={item.entidade?.nome ?? ""}
                documento={item.entidade?.documento ?? ""}
				clearInitialValue={mode === "create"}
                required
                onChange={(entidade: any) =>
                  setProprietarios((atuais) =>
                    atuais.map((proprietario, itemIndex) =>
                      itemIndex === index ? { ...proprietario, entidade } : proprietario,
                    ),
                  )
                }
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        <Section title="Informações de Localização" readOnly={isView}>
          <BlocoEnderecoFields
            title="Endereço"
            data={endereco}
            tipoEstado="normal"
            onChange={(key, value) => setEndereco((atual: any) => ({ ...atual, [key]: value }))}
            onSetMultipleFields={(campos) => setEndereco((atual: any) => ({ ...atual, ...campos }))}
          />
        </Section>

        <Section title="Informações de Contato" readOnly={isView}>
          <BlocoContatoFields
            data={contatos}
            onChange={(atualizado) => setContatos((atual: any) => ({ ...atual, ...atualizado }))}
            proprietariosDisponiveis={PROPRIETARIOS_CONTATO}
          />
        </Section>

        <Section title="Anexos" readOnly={isView}>
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">
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
                        setAnexos((atuais) =>
                          atuais.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, nome: `documento_${index + 1}.pdf` } : item,
                          ),
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
                            onChange={(valor) =>
                              setAnexos((atuais) =>
                                atuais.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, descricao: valor.slice(0, 255) } : item,
                                ),
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
                        onClick={() => setAnexos((atuais) => atuais.filter((item) => item.id !== anexo.id))}
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
              onClick={() => setAnexos((atuais) => [...atuais, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        <Section title="Observações" readOnly={isView}>
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

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Promotora {isEdit ? "atualizada" : "cadastrada"} com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {`"${dadosNavegacao.nomeComercial}"`} foi {isEdit ? "atualizada" : "cadastrada"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("promotora-eventos");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-promotora-eventos", dadosNavegacao);
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
