import type { ReactNode } from "react";
import { Eye, PlusCircle, Trash2 } from "lucide-react";
import { BlocoEnderecoFields } from "../../../components/ui/EntitySearch";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";

export interface EnderecoPessoaFisica {
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
  latitude: string;
  longitude: string;
}

export interface PessoaFisicaFormValue {
  cpf: string;
  nome: string;
  apelido: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  representantes: Array<{ id: string; nome: string; cpf: string; documentoNome: string; descricao: string }>;
  correspondencia: EnderecoPessoaFisica;
  enderecoResidencia: "Sim" | "Não";
  residencia: EnderecoPessoaFisica;
  observacaoResidencia: string;
  contatos: Array<{ id: string; tipo: string; valor: string; observacao: string }>;
  anexos: Array<{ id: string; nome: string; descricao: string }>;
  observacao: string;
}

const enderecoExemplo: EnderecoPessoaFisica = {
  zona: "Urbana",
  cep: "37200-000",
  estado: "Minas Gerais",
  municipio: "Lavras",
  bairro: "Centro",
  endereco: "Rua Doutor Francisco Sales",
  numero: "245",
  complemento: "Apartamento 302",
  localidade: "Centro",
  distrito: "Sede",
  latitude: "-21.2451",
  longitude: "-44.9998",
};

export const PESSOA_FISICA_EXEMPLO: PessoaFisicaFormValue = {
  cpf: "940.877.688-72",
  nome: "Divino Alves Inácio",
  apelido: "Divino",
  dataNascimento: "1978-04-15",
  sexo: "M",
  estadoCivil: "casado",
  representantes: [{
    id: "representante-1",
    nome: "Maria Silva Mendes",
    cpf: "444.111.222-33",
    documentoNome: "procuracao_divino.pdf",
    descricao: "Procuração para representação perante o IMA.",
  }],
  correspondencia: { ...enderecoExemplo },
  enderecoResidencia: "Não",
  residencia: {
    ...enderecoExemplo,
    cep: "37203-214",
    bairro: "Jardim Glória",
    endereco: "Rua das Acácias",
    numero: "80",
    complemento: "Casa",
    localidade: "Jardim Glória",
  },
  observacaoResidencia: "Residência utilizada somente para correspondências pessoais.",
  contatos: [
    { id: "email-1", tipo: "E-mail", valor: "divino.inacio@email.com", observacao: "Contato principal" },
    { id: "telefone-1", tipo: "Telefone", valor: "(35) 99999-1234", observacao: "WhatsApp" },
  ],
  anexos: [{ id: "anexo-1", nome: "documentos_pessoais.pdf", descricao: "CPF e documento de identificação." }],
  observacao: "Produtor rural com cadastro ativo no município de Lavras.",
};

function mesclarValoresPreenchidos<T extends Record<string, any>>(exemplo: T, recebido?: Partial<T>): T {
  const resultado = { ...exemplo };
  Object.entries(recebido ?? {}).forEach(([campo, valor]) => {
    const vazio = valor === undefined || valor === null || (typeof valor === "string" && !valor.trim());
    if (!vazio) resultado[campo as keyof T] = valor as T[keyof T];
  });
  return resultado;
}

export function normalizarPessoaFisica(dados?: any): PessoaFisicaFormValue {
  if (!dados) return structuredClone(PESSOA_FISICA_EXEMPLO);
  const contatosRecebidos = dados.contatos ?? [
    ...(dados.contatosFixos ?? []),
    ...(dados.outrosContatos ?? []),
  ];
  const dadosBasicos = mesclarValoresPreenchidos(PESSOA_FISICA_EXEMPLO, dados);
  return {
    ...dadosBasicos,
    representantes: dados.representantes?.length ? dados.representantes : PESSOA_FISICA_EXEMPLO.representantes,
    correspondencia: mesclarValoresPreenchidos(PESSOA_FISICA_EXEMPLO.correspondencia, dados.correspondencia),
    residencia: mesclarValoresPreenchidos(PESSOA_FISICA_EXEMPLO.residencia, dados.residencia),
    contatos: contatosRecebidos.length ? contatosRecebidos : PESSOA_FISICA_EXEMPLO.contatos,
    anexos: dados.anexos?.length ? dados.anexos : PESSOA_FISICA_EXEMPLO.anexos,
    observacao: dados.observacao?.trim() || dados.observacaoGeral?.trim() || PESSOA_FISICA_EXEMPLO.observacao,
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 py-4"><h2 className="text-base font-semibold text-gray-800">{title}</h2></div>
      <div className="border-t border-gray-100 p-6">{children}</div>
    </section>
  );
}

interface Props {
  value: PessoaFisicaFormValue;
  onChange: (value: PessoaFisicaFormValue) => void;
  disabled?: boolean;
  onNavigate?: (screen: string, data?: any) => void;
}

export function PessoaFisicaCadastroForm({ value, onChange, disabled = false, onNavigate }: Props) {
  const alterar = <K extends keyof PessoaFisicaFormValue>(campo: K, novoValor: PessoaFisicaFormValue[K]) =>
    onChange({ ...value, [campo]: novoValor });

  return (
    <div className="flex flex-col gap-5">
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FloatInput label="CPF" required value={value.cpf} onChange={(v) => alterar("cpf", v)} disabled={disabled} />
          <FloatInput label="Nome" required value={value.nome} onChange={(v) => alterar("nome", v)} disabled={disabled} />
          <FloatInput label="Apelido" value={value.apelido} onChange={(v) => alterar("apelido", v)} disabled={disabled} />
          <FloatInput label="Data de Nascimento" type="date" required value={value.dataNascimento} onChange={(v) => alterar("dataNascimento", v)} disabled={disabled} />
          <FloatSelect label="Sexo" required value={value.sexo} onChange={(v) => alterar("sexo", v)} disabled={disabled} options={[
            { value: "M", label: "Masculino" }, { value: "F", label: "Feminino" },
            { value: "O", label: "Outro" }, { value: "N", label: "Não informado" },
          ]} />
          <FloatSelect label="Estado Civil" required value={value.estadoCivil} onChange={(v) => alterar("estadoCivil", v)} disabled={disabled} options={[
            { value: "solteiro", label: "Solteiro(a)" }, { value: "casado", label: "Casado(a)" },
            { value: "divorciado", label: "Divorciado(a)" }, { value: "viuvo", label: "Viúvo(a)" },
          ]} />
        </div>
      </Section>

      <Section title="Representantes Legais">
        <div className="flex flex-col gap-5">
          {value.representantes.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 rounded-xl p-4">
              <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">{index + 1}</span>
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1"><FloatInput label="Representante Legal" required value={item.nome} disabled={disabled} onChange={(nome) => alterar("representantes", value.representantes.map((atual) => atual.id === item.id ? { ...atual, nome } : atual))} /></div>
                  <div className="w-72"><FloatInput label="CPF" required value={item.cpf} disabled={disabled} onChange={(cpf) => alterar("representantes", value.representantes.map((atual) => atual.id === item.id ? { ...atual, cpf } : atual))} /></div>
                  {onNavigate && <button type="button" onClick={() => onNavigate("visualizar-pessoa-fisica", item)} className="mb-1 p-2 text-[#1A7A3C] hover:bg-green-50" title="Visualizar representante"><Eye size={20} /></button>}
                  {!disabled && <button type="button" onClick={() => alterar("representantes", value.representantes.filter((atual) => atual.id !== item.id))} className="mb-1 p-2 text-red-600 hover:bg-red-50"><Trash2 size={20} /></button>}
                </div>
                <div className="flex items-start gap-3">
                  <UploadField label="Documento" required fileName={item.documentoNome} disabled={disabled} onSelectFile={() => alterar("representantes", value.representantes.map((atual) => atual.id === item.id ? { ...atual, documentoNome: `documento_rep_${index + 1}.pdf` } : atual))} />
                  <div className="flex-1"><FloatInput label="Descrição" value={item.descricao} disabled={disabled} onChange={(descricao) => alterar("representantes", value.representantes.map((atual) => atual.id === item.id ? { ...atual, descricao } : atual))} /></div>
                </div>
              </div>
            </div>
          ))}
          {!disabled && <button type="button" onClick={() => alterar("representantes", [...value.representantes, { id: `rep-${Date.now()}`, nome: "", cpf: "", documentoNome: "", descricao: "" }])} className="flex h-11 items-center gap-2 self-start rounded-md border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"><PlusCircle size={17} /> Adicionar Representante Legal</button>}
        </div>
      </Section>

      <Section title="Informações de Localização">
        <div className="flex flex-col gap-6">
          <BlocoEnderecoFields title="Endereço de Correspondência" tipoEstado="normal" data={value.correspondencia} disabled={disabled} onChange={(key, novoValor) => alterar("correspondencia", { ...value.correspondencia, [key]: novoValor })} onSetMultipleFields={(campos) => alterar("correspondencia", { ...value.correspondencia, ...campos })} />
          <div className="border-t border-gray-100 pt-5">
            <SimNao label="É o endereço de residência?" name="endereco-residencia-pf" value={value.enderecoResidencia} disabled={disabled} onChange={(sim) => alterar("enderecoResidencia", sim ? "Sim" : "Não")} />
          </div>
          {value.enderecoResidencia === "Não" && (
            <>
              <BlocoEnderecoFields title="Endereço de Residência" tipoEstado="normal" data={value.residencia} disabled={disabled} onChange={(key, novoValor) => alterar("residencia", { ...value.residencia, [key]: novoValor })} onSetMultipleFields={(campos) => alterar("residencia", { ...value.residencia, ...campos })} />
              <LargeTextArea label="Observação da Residência" value={value.observacaoResidencia} disabled={disabled} onChange={(v) => alterar("observacaoResidencia", v)} />
            </>
          )}
        </div>
      </Section>

      <Section title="Informações de Contato">
        <div className="flex flex-col gap-4">
          {value.contatos.map((contato) => (
            <div key={contato.id} className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <FloatSelect label="Tipo de Contato" required value={contato.tipo} disabled={disabled} onChange={(tipo) => alterar("contatos", value.contatos.map((atual) => atual.id === contato.id ? { ...atual, tipo } : atual))} options={["E-mail", "Telefone", "Celular", "Fax"].map((tipo) => ({ value: tipo, label: tipo }))} className="md:col-span-3" />
              <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} required value={contato.valor} disabled={disabled} onChange={(valor) => alterar("contatos", value.contatos.map((atual) => atual.id === contato.id ? { ...atual, valor } : atual))} className="md:col-span-4" />
              <div className="md:col-span-4"><LargeTextArea label="Observação" value={contato.observacao} disabled={disabled} onChange={(observacao) => alterar("contatos", value.contatos.map((atual) => atual.id === contato.id ? { ...atual, observacao } : atual))} /></div>
              {!disabled && <button type="button" onClick={() => alterar("contatos", value.contatos.filter((atual) => atual.id !== contato.id))} className="self-start p-3 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>}
            </div>
          ))}
          {!disabled && <button type="button" onClick={() => alterar("contatos", [...value.contatos, { id: `contato-${Date.now()}`, tipo: "Telefone", valor: "", observacao: "" }])} className="flex h-11 items-center gap-2 self-start rounded-md border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"><PlusCircle size={17} /> Adicionar Outro Contato</button>}
        </div>
      </Section>

      <Section title="Anexo">
        <div className="flex flex-col gap-5">
          {value.anexos.map((anexo, index) => (
            <div key={anexo.id} className="flex items-start gap-4 rounded-xl p-4">
              <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">{index + 1}</span>
              <UploadField label="Documento" required fileName={anexo.nome} disabled={disabled} onSelectFile={() => alterar("anexos", value.anexos.map((atual) => atual.id === anexo.id ? { ...atual, nome: `documento_${index + 1}.pdf` } : atual))} />
              <div className="flex-1"><FloatInput label="Descrição" value={anexo.descricao} disabled={disabled} onChange={(descricao) => alterar("anexos", value.anexos.map((atual) => atual.id === anexo.id ? { ...atual, descricao } : atual))} /></div>
              {!disabled && <button type="button" onClick={() => alterar("anexos", value.anexos.filter((atual) => atual.id !== anexo.id))} className="p-3 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>}
            </div>
          ))}
          {!disabled && <button type="button" onClick={() => alterar("anexos", [...value.anexos, { id: `anexo-${Date.now()}`, nome: "", descricao: "" }])} className="flex h-11 items-center gap-2 self-start rounded-md border border-[#1A7A3C] px-4 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"><PlusCircle size={17} /> Adicionar Anexo</button>}
        </div>
      </Section>

      <Section title="Observação">
        <LargeTextArea label="Observação" value={value.observacao} disabled={disabled} onChange={(v) => alterar("observacao", v)} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
      </Section>
    </div>
  );
}
