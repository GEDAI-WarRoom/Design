import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, Download, Info, PlusCircle, Trash2 } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  SimNao,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  BlocoEnderecoFields,
  DynamicListWrapper,
  ProprietarioInput,
} from "../../../components/ui/EntitySearch";

const TIPOS_ESTABELECIMENTO = [
  "Apartamento", "Assentamento", "Casa", "Centro de Treinamento", "Chácara",
  "Clínica Veterinária", "Condomínio", "Distribuidora", "Estância", "Fazenda",
  "Galpão", "Gleba", "Haras", "Hípica", "Hospital Veterinário",
  "Instituição de Ensino", "Lote", "Parque de Exposições", "Rancho",
  "Residência", "Sítio", "Terreno",
].map((tipo) => ({ value: tipo, label: tipo }));

interface PageProps {
  dados?: any;
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

interface ProprietarioFormItem {
  uid: string;
  proprietario: {
    id: number;
    tipoPessoa: string;
    nome: string;
    documento: string;
  } | null;
}

interface AnexoFormItem {
  id: string;
  nome: string;
  descricao: string;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="border-t border-gray-100 p-6">{children}</div>
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  ESTABELECIMENTOS_INICIAIS,
  obterEstabelecimentoAgropecuario,
  salvarEdicaoEstabelecimentoAgropecuario,
  type EstabelecimentoAgropecuario,
} from "./estabelecimentoAgropecuarioData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EstabelecimentoAgropecuario;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-t-xl px-6 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-gray-100 p-6">{children}</div>}
    </section>
  );
}

function SubGrupo({ title, children, divider = false }: { title: string; children: ReactNode; divider?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 ${divider ? "border-t border-gray-100 pt-5" : ""}`}>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

export function EditarEstabelecimentoAgropecuarioPage({ dados, onLogout, onNavigate }: PageProps) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [tipo, setTipo] = useState(dados?.tipo || "Fazenda");
  const [nome, setNome] = useState(dados?.nome || "Fazenda Rio Verde");
  const [provisorio, setProvisorio] = useState(dados?.cadastroProvisorio || "Não");
  const [proprietarios, setProprietarios] = useState<ProprietarioFormItem[]>([
    {
      uid: "proprietario-1",
      proprietario: {
        id: 1,
        tipoPessoa: "Pessoa física",
        nome: dados?.proprietarioNome || "José Aarão Neto",
        documento: dados?.proprietarioDocumento || "555.009.956-40",
      },
    },
  ]);
  const [endereco, setEndereco] = useState({
    zona: dados?.zona || "Rural",
    estado: dados?.estado || "Minas Gerais",
    cep: dados?.cep || "",
    municipio: dados?.municipio || "Lavras",
    bairro: dados?.bairro || "",
    endereco: dados?.endereco || "Estrada Municipal do Rio Verde, km 4",
    numero: dados?.numero || "",
    complemento: dados?.complemento || "Próximo ao Córrego Rio Verde",
    localidade: dados?.localidade || "Rio Verde",
    distrito: dados?.distrito || "Zona Rural",
    latitude: dados?.latitude || "-21.2453",
    longitude: dados?.longitude || "-44.9997",
  });
  const [unidadeMedida, setUnidadeMedida] = useState(dados?.unidadeMedida || "Hectares");
  const [areaTotal, setAreaTotal] = useState(dados?.areaTotal || "185,50");
  const [areaProdutiva, setAreaProdutiva] = useState(dados?.areaProdutiva || "142,30");
  const [numeroCar, setNumeroCar] = useState(dados?.numeroCar || "MG-3138203-7A2F.91B4.C08E.45D1");
  const [confrontantes, setConfrontantes] = useState(
    dados?.confrontantes || "Ao norte, Córrego Rio Verde; ao sul, Fazenda Santa Clara.",
  );
  const [viasAcesso, setViasAcesso] = useState(
    dados?.viasAcesso || "Acesso pela BR-265, km 342, seguindo 4 km pela estrada municipal.",
  );
  const [anexos, setAnexos] = useState<AnexoFormItem[]>([
    {
      id: "anexo-1",
      nome: dados?.documento || "registro_estabelecimento.pdf",
      descricao: dados?.descricaoDocumento || "Registro e memorial descritivo do imóvel.",
    },
  ]);
  const [observacao, setObservacao] = useState(
    dados?.observacao || "Estabelecimento rural destinado à criação de bovinos e produção agrícola.",
  );

  const registroAtualizado = {
    ...(dados || {}),
    id: dados?.id || 1,
    codigo: dados?.codigo || "51080590041",
    tipo,
    nome,
    cadastroProvisorio: provisorio,
    proprietarios: proprietarios
      .filter((item) => item.proprietario)
      .map((item) => `${item.proprietario!.nome} - ${item.proprietario!.documento}`)
      .join(", "),
    proprietarioNome: proprietarios[0]?.proprietario?.nome || "",
    proprietarioDocumento: proprietarios[0]?.proprietario?.documento || "",
    ...endereco,
    unidadeMedida,
    areaTotal,
    areaProdutiva,
    numeroCar,
    confrontantes,
    viasAcesso,
    documento: anexos[0]?.nome || "",
    descricaoDocumento: anexos[0]?.descricao || "",
    observacao,
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agropecuario" hideSearch />
export function EditarEstabelecimentoAgropecuarioPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registroInicial =
    obterEstabelecimentoAgropecuario(dados?.id ?? dados?.codigo) ??
    dados ??
    ESTABELECIMENTOS_INICIAIS[0];
  const [nome, setNome] = useState(registroInicial.nome);
  const [proprietarios, setProprietarios] = useState(registroInicial.proprietarios);
  const [zona, setZona] = useState<EstabelecimentoAgropecuario["zona"]>(
    registroInicial.zona,
  );
  const [municipioUf, setMunicipioUf] = useState(registroInicial.municipioUf);
  const [situacao, setSituacao] = useState<EstabelecimentoAgropecuario["situacao"]>(
    registroInicial.situacao,
  );
  const [erro, setErro] = useState("");

  const salvar = () => {
    if (!nome.trim() || !proprietarios.trim() || !municipioUf.trim()) {
      setErro("Preencha nome, proprietários e município/UF.");
      return;
    }

    const registroAtualizado: EstabelecimentoAgropecuario = {
      ...registroInicial,
      nome: nome.trim(),
      proprietarios: proprietarios.trim(),
      zona,
      municipioUf: municipioUf.trim(),
      situacao,
    };

    const { registro } = salvarEdicaoEstabelecimentoAgropecuario(
      registroInicial,
      registroAtualizado,
    );
    onNavigate("visualizar-estabelecimento-agropecuario", registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="estabelecimento-agropecuario"
        hideSearch
      />

      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <header>
          <button
            type="button"
            onClick={() => onNavigate("estabelecimento-agropecuario")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Estabelecimentos Agropecuários
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Estabelecimento Agropecuário</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
            onClick={() =>
              onNavigate("visualizar-estabelecimento-agropecuario", registroInicial)
            }
            className="mb-4 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Visualizar Estabelecimento Agropecuário
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Estabelecimento Agropecuário
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
            >
              Salvar
            </button>
          </div>
        </header>

        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="shrink-0 text-gray-500 stroke-[2.5]" />
          <p className="text-sm font-medium text-gray-600">
            Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <div className="flex w-full flex-col gap-5 md:flex-row">
              <div className="w-full md:w-1/3">
                <FloatSelect
                  label="Tipo de Estabelecimento"
                  required
                  value={tipo}
                  onChange={setTipo}
                  options={TIPOS_ESTABELECIMENTO}
                />
              </div>
              <div className="flex-1">
                <FloatInput
                  label="Nome do Estabelecimento Agropecuário"
                  required
                  value={nome}
                  onChange={setNome}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <SimNao
                label="Cadastro Provisório?"
                required
                value={provisorio}
                onChange={setProvisorio}
              />
            </div>
          </div>
        </Section>

        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((atuais) => [
              ...atuais,
              { uid: `proprietario-${Date.now()}`, proprietario: null },
            ])}
            onRemoveItem={(indice) => setProprietarios((atuais) => atuais.filter((_, atual) => atual !== indice))}
            variant="plain"
            showCounter
          >
            {(item: ProprietarioFormItem) => (
              <ProprietarioInput
                label="Proprietário"
                required
                value={item.proprietario?.nome || ""}
                onChange={(proprietario: any) => setProprietarios((atuais) =>
                  atuais.map((atual) => atual.uid === item.uid ? { ...atual, proprietario } : atual)
                )}
                onEyeClick={() => item.proprietario && onNavigate("visualizar-pessoa-fisica", item.proprietario)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço"
            tipoEstado="normal"
            data={endereco}
            onChange={(key, value) => setEndereco((atual) => ({ ...atual, [key]: value }))}
            onSetMultipleFields={(campos) => setEndereco((atual) => ({ ...atual, ...campos }))}
          />
        </Section>

        <Section title="Informações Complementares">
          <div className="flex flex-col gap-6">
            <SubGrupo title="Áreas">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FloatSelect
                  label="Unidade de Medida das Áreas"
                  required
                  value={unidadeMedida}
                  onChange={setUnidadeMedida}
                  options={[
                    { value: "Hectares", label: "Hectares" },
                    { value: "Metros Quadrados", label: "Metros Quadrados" },
                  ]}
                />
                <FloatInput label="Área Total" required value={areaTotal} onChange={setAreaTotal} />
                <FloatInput label="Área Produtiva" required value={areaProdutiva} onChange={setAreaProdutiva} />
              </div>
            </SubGrupo>

            {endereco.zona === "Rural" && (
              <SubGrupo title="Outras Informações" divider>
                <div className="flex flex-col gap-5">
                  <div className="md:w-1/2">
                    <FloatInput label="Número do CAR" value={numeroCar} onChange={setNumeroCar} />
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <LargeTextArea label="Confrontantes" value={confrontantes} onChange={setConfrontantes} />
                    <LargeTextArea label="Vias de Acesso" value={viasAcesso} onChange={setViasAcesso} />
                  </div>
                </div>
              </SubGrupo>
            )}
          </div>
        </Section>

        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, indice) => (
              <div key={anexo.id} className="flex items-start gap-4 rounded-xl p-4">
                <div className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                  {indice + 1}
                </div>
                <div className="flex flex-1 items-start gap-3">
                  <UploadField
                    label="Documento"
                    required
                    fileName={anexo.nome}
                    onSelectFile={() => setAnexos((atuais) => atuais.map((atual) =>
                      atual.id === anexo.id ? { ...atual, nome: `documento_geral_${indice + 1}.pdf` } : atual
                    ))}
                  />
                  <div className="flex-1">
                    <FloatInput
                      label="Descrição"
                      value={anexo.descricao}
                      onChange={(descricao) => setAnexos((atuais) => atuais.map((atual) =>
                        atual.id === anexo.id ? { ...atual, descricao } : atual
                      ))}
                    />
                  </div>
                  <button type="button" className="mt-1 p-2.5 text-[#1A7A3C] hover:bg-green-50" title="Baixar anexo">
                    <Download size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnexos((atuais) => atuais.filter((atual) => atual.id !== anexo.id))}
                    className="mt-1 p-2.5 text-red-600 hover:bg-red-50"
                    title="Excluir anexo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAnexos((atuais) => [
                ...atuais,
                { id: `anexo-${Date.now()}`, nome: "", descricao: "" },
              ])}
              className="flex items-center gap-2 self-start rounded-md border border-[#1A7A3C] px-4 py-2.5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

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

      {isSucesso && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Alterações salvas!</h2>
            <p className="mt-1 text-sm text-gray-500">O estabelecimento “{nome}” foi atualizado com sucesso.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate("estabelecimento-agropecuario")}
                className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-estabelecimento-agropecuario", registroAtualizado)}
                className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
        {erro && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <Section title="Informações do Cadastro">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatInput
              label="Código do Estabelecimento"
              value={registroInicial.codigo}
              disabled
            />
            <FloatInput
              label="Nome do Estabelecimento"
              value={nome}
              onChange={setNome}
              required
            />
            <FloatInput
              label="Proprietários"
              value={proprietarios}
              onChange={setProprietarios}
              required
            />
            <FloatSelect
              label="Zona"
              value={zona}
              onChange={(value) => setZona(value as EstabelecimentoAgropecuario["zona"])}
              options={[
                { value: "Rural", label: "Rural" },
                { value: "Urbana", label: "Urbana" },
              ]}
              required
            />
            <FloatInput
              label="Município/UF"
              value={municipioUf}
              onChange={setMunicipioUf}
              required
            />
            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={(value) =>
                setSituacao(value as EstabelecimentoAgropecuario["situacao"])
              }
              options={[
                { value: "Ativo", label: "Ativo" },
                { value: "Inativo", label: "Inativo" },
                { value: "Suspenso", label: "Suspenso" },
              ]}
              required
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
