import { useState, type ReactNode } from "react";
import { ArrowLeft, Download, PlusCircle, Trash2 } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CheckboxGroup, FloatInput, FloatSelect, LargeTextArea, UploadField } from "../../../components/ui/FormKit";
import {
  BlocoContatoFields,
  BlocoEnderecoFields,
  DynamicListWrapper,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";
import {
  atualizarRevendedora,
  getRevendedora,
  obterUfPorEstado,
  type ContatoRevendedora,
  type Revendedora,
} from "./revendedoraData";

const GREEN = "#1A7A3C";

const ATUACOES_ANIMAL = [
  "Revendedora de Pasta Vampiricida",
  "Distribuidora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Produtos Sujeitos a Controle Especial",
  "Revendedora de Vacinas sob Controle Oficial",
  "Distribuidora de Vacinas sob Controle Oficial",
  "Revendedora de Insumos para Exames de Brucelose/Tuberculose",
];

const ATUACOES_VEGETAL = ["Revendedora de Sementes", "Revendedora de Agrotóxicos"];

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: Revendedora;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="border-t border-gray-100 p-6">{children}</div>}
    </section>
  );
}

function separarProprietario(valor: string) {
  const indice = valor.indexOf(" - ");
  if (indice < 0) return { nome: valor, documento: "" };
  return { documento: valor.slice(0, indice), nome: valor.slice(indice + 3) };
}

export function EditarRevendedoraAgropecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const original = getRevendedora(dados?.id);
  const [nome, setNome] = useState(original.nome);
  const [areas, setAreas] = useState(original.areaAtuacao);
  const [registroAnimal, setRegistroAnimal] = useState(original.registroAnimal);
  const [atuacoesAnimal, setAtuacoesAnimal] = useState(original.atuacoesAnimal);
  const [registroVegetal, setRegistroVegetal] = useState(original.registroVegetal);
  const [renasem, setRenasem] = useState(original.renasem);
  const [atuacoesVegetal, setAtuacoesVegetal] = useState(original.atuacoesVegetal);
  const [situacao, setSituacao] = useState(original.situacao);
  const [endereco, setEndereco] = useState(original.endereco);
  const [observacao, setObservacao] = useState(original.observacao || "");
  const [anexos, setAnexos] = useState(original.anexos || []);
  const [erro, setErro] = useState("");
  const [proprietarios, setProprietarios] = useState(
    original.proprietarios.map((item, index) => ({ uid: `prop-${index}`, entidade: separarProprietario(item) })),
  );
  const [contatos, setContatos] = useState<ContatoRevendedora>({
    utilizarContatoProprietario: "Não",
    proprietariosSelecionados: [],
    emailFixo: "",
    emailFixoObs: "",
    telefoneFixo: "",
    telefoneFixoObs: "",
    contatosAdicionais: [],
    ...(original.contatos || {}),
  });

  const temAnimal = areas.includes("Animal");
  const temVegetal = areas.includes("Vegetal");
  const proprietariosDisponiveis = proprietarios
    .filter((item) => item.entidade?.nome)
    .map((item) => {
      const entidade = item.entidade;
      const documento = entidade.documento || entidade.cpfCnpj || entidade.cpf || "";
      const contatoSalvo = contatos.proprietariosDisponiveis?.find((contato) => contato.id === String(documento));
      return {
        id: String(documento || entidade.id || item.uid),
        nome: entidade.nome,
        cpf: documento,
        email: entidade.email || contatoSalvo?.email || "",
        telefone: entidade.telefone || contatoSalvo?.telefone || "",
        observacao: entidade.observacao || entidade.observacoes || contatoSalvo?.observacao || "",
      };
    });

  const handleAreas = (novas: string[]) => {
    setAreas(novas);
    if (!novas.includes("Animal")) {
      setRegistroAnimal("");
      setAtuacoesAnimal([]);
    }
    if (!novas.includes("Vegetal")) {
      setRegistroVegetal("");
      setRenasem("");
      setAtuacoesVegetal([]);
    }
  };

  const handleSalvar = () => {
    const proprietariosValidos = proprietarios.filter((item) => item.entidade?.nome);
    if (!nome.trim() || areas.length === 0 || proprietariosValidos.length === 0) {
      setErro("Preencha o nome, ao menos uma área de atuação e um proprietário.");
      return;
    }
    if ((temAnimal && atuacoesAnimal.length === 0) || (temVegetal && atuacoesVegetal.length === 0)) {
      setErro("Selecione ao menos uma atuação para cada área informada.");
      return;
    }
    if (!endereco.estado || !endereco.municipio || !obterUfPorEstado(endereco.estado)) {
      setErro("Informe um estado e um município válidos.");
      return;
    }
    const possuiProprietarioSelecionado = contatos.proprietariosSelecionados.some((id) =>
      proprietariosDisponiveis.some((proprietario) => String(proprietario.id) === String(id)),
    );
    if (contatos.utilizarContatoProprietario === "Sim" && !possuiProprietarioSelecionado) {
      setErro("Selecione ao menos um proprietário para contato.");
      return;
    }
    if (contatos.utilizarContatoProprietario === "Não" && (!contatos.emailFixo.trim() || !contatos.telefoneFixo.trim())) {
      setErro("Informe o e-mail e o telefone de contato.");
      return;
    }
    if (contatos.contatosAdicionais.some((contato) => contato.tipo === "E-mail" ? !contato.email.trim() : !contato.telefone.trim())) {
      setErro("Preencha os contatos adicionais informados.");
      return;
    }

    const atualizada = atualizarRevendedora(original.id, {
      nome: nome.trim(),
      areaAtuacao: areas,
      registroAnimal,
      atuacoesAnimal,
      registroVegetal,
      renasem,
      atuacoesVegetal,
      atuacoes: [...atuacoesAnimal, ...atuacoesVegetal],
      proprietarios: proprietariosValidos.map((item) => `${item.entidade.documento || item.entidade.cpfCnpj || ""} - ${item.entidade.nome}`.replace(/^\s*-\s*/, "")),
      municipio: endereco.municipio,
      uf: obterUfPorEstado(endereco.estado),
      estado: endereco.estado,
      endereco,
      contatos: { ...contatos, proprietariosDisponiveis },
      anexos,
      observacao,
      situacao,
    });
    if (atualizada) onNavigate("visualizar-revendedora-agropecuario", atualizada);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora-agropecuario" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <header>
          <button type="button" onClick={() => onNavigate("visualizar-revendedora-agropecuario", original)} className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Visualizar Revendedora de Produtos Agropecuários
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Revendedora de Produtos Agropecuários</h1>
            <button type="button" onClick={handleSalvar} className="h-10 px-6 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition">Salvar</button>
          </div>
        </header>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FloatInput label="Código da Revendedora" value={original.codigo} disabled />
              <FloatInput label="Nome Comercial da Revendedora" value={nome} onChange={setNome} required />
              <FloatSelect label="Situação" value={situacao} onChange={(value) => setSituacao(value as "Ativo" | "Inativo")} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} required />
            </div>
            <CheckboxGroup title="Área de Atuação" required orientation="horizontal" defaultValue={areas} onChange={handleAreas} options={[{ id: "Animal", label: "Animal" }, { id: "Vegetal", label: "Vegetal" }]} />

            {temAnimal && (
              <div className="bg-gray-50 border-l-4 border-[#1A7A3C] p-5 rounded-r-md flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-gray-800">Animal</h2>
                <FloatInput label="Número de Registro do Órgão Competente" value={registroAnimal} onChange={setRegistroAnimal} maxLength={255} />
                <CheckboxGroup title="Atuação" required orientation="grid" defaultValue={atuacoesAnimal} onChange={setAtuacoesAnimal} options={ATUACOES_ANIMAL.map((item) => ({ id: item, label: item }))} />
              </div>
            )}

            {temVegetal && (
              <div className="bg-gray-50 border-l-4 border-[#1A7A3C] p-5 rounded-r-md flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-gray-800">Vegetal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Número de Registro do Órgão Competente" value={registroVegetal} onChange={setRegistroVegetal} maxLength={255} />
                  <FloatInput label="Número do RENASEM" value={renasem} onChange={setRenasem} maxLength={255} />
                </div>
                <CheckboxGroup title="Atuação" required orientation="horizontal" defaultValue={atuacoesVegetal} onChange={setAtuacoesVegetal} options={ATUACOES_VEGETAL.map((item) => ({ id: item, label: item }))} />
              </div>
            )}
          </div>
        </Section>

        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((items) => [...items, { uid: `prop-${Date.now()}`, entidade: null as any }])}
            onRemoveItem={(index) => setProprietarios((items) => items.filter((_, itemIndex) => itemIndex !== index))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                label="Proprietário"
                required
                value={item.entidade?.nome || ""}
                onChange={(entidade: any) => setProprietarios((items) => items.map((current, itemIndex) => itemIndex === index ? { ...current, entidade } : current))}
                onEyeClick={() => item.entidade && onNavigate(item.entidade.tipo === "PJ" ? "visualizar-pessoa-juridica" : "visualizar-pessoa-fisica", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            tipoEstado="livre"
            data={endereco}
            onChange={(key, value) => setEndereco((current) => ({ ...current, [key]: value }))}
            onSetMultipleFields={(fields) => setEndereco((current) => ({ ...current, ...fields }))}
          />
        </Section>

        <Section title="Informações de Contato">
          <BlocoContatoFields data={contatos} onChange={(updated) => setContatos((current) => ({ ...current, ...updated }))} proprietariosDisponiveis={proprietariosDisponiveis} />
        </Section>

        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="grid grid-cols-1 md:grid-cols-[340px_1fr_auto_auto] gap-3 items-start">
                <UploadField label="Documento" fileName={anexo.nome} onSelectFile={() => setAnexos((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, nome: `documento-${Date.now()}.pdf` } : item))} />
                <FloatInput label="Descrição" value={anexo.descricao} onChange={(value) => setAnexos((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, descricao: value } : item))} />
                <button type="button" className="h-12 px-3 text-[#1A7A3C] hover:bg-green-50 rounded"><Download size={19} /></button>
                <button type="button" onClick={() => setAnexos((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="h-12 px-3 text-red-600 hover:bg-red-50 rounded"><Trash2 size={19} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setAnexos((items) => [...items, { id: `anexo-${Date.now()}`, nome: "", descricao: "" }])} className="self-start flex items-center gap-2 px-4 h-10 border border-[#1A7A3C] text-[#1A7A3C] rounded-md text-sm font-semibold hover:bg-green-50">
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        <Section title="Observação">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} />
        </Section>
      </main>
    </div>
  );
}
