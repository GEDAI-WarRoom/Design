import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Download,
  Eye,
  FileText,
  Handshake,
  Hash,
  Info,
  MoreVertical,
  Pencil,
  PlusCircle,
  X,
  Trash2
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  LargeTextArea,
  Tabs,
  UploadField,
} from "../../../components/ui/FormKit";
import {
  BlocoContatoFields,
  BlocoEnderecoFields,
  DynamicListWrapper,
  EntitySearchInput,
  PessoaJuridicaInput
} from "../../../components/ui/EntitySearch";
import {
  adicionarConvenio,
  adicionarFundo,
  atualizarConvenio,
  atualizarFundo,
  emptyContatos,
  emptyConvenio,
  emptyEndereco,
  SITUACOES,
  TIPOS_FUNDO,
  type Convenio,
  type FundoArrecadacao,
  type Situacao,
  type TipoFundo,
} from "./fundoArrecadacaoData";

type Mode = "add" | "edit" | "view";
type FundoDraft = Omit<FundoArrecadacao, "id" | "nome">;
type ConvenioMode = "add" | "edit" | "view";

// Altere ou verifique em seu arquivo "fundoArrecadacaoData.ts":

export interface PessoaJuridicaFundo {
  id: number;
  nome: string;        // razão social (chave usada por PessoaJuridicaInput)
  documento: string;   // CNPJ (chave usada por PessoaJuridicaInput)
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  proprietarios: Array<{
    id: number;
    nome: string;
    cpf: string;
    email?: string;
    telefone?: string;
  }>;
}

export const PESSOAS_JURIDICAS_FUNDO: PessoaJuridicaFundo[] = [
  {
    id: 1,
    nome: "Fundo Estadual de Desenvolvimento Agropecuário",
    documento: "12.345.678/0001-90",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Fundo Estadual de Desenvolvimento Agropecuário",
    nomeFantasia: "FEDA - Agro",
    proprietarios: [
      { id: 101, nome: "José Alencar", cpf: "111.222.333-44", email: "jose@feda.gov.br", telefone: "(31) 99999-8888" }
    ]
  },
  {
    id: 2,
    nome: "Instituto de Defesa Sanitária Animal e Vegetal",
    documento: "98.765.432/0001-10",
    cnpj: "98.765.432/0001-10",
    razaoSocial: "Instituto de Defesa Sanitária Animal e Vegetal",
    nomeFantasia: "Defesa Agropecuária",
    proprietarios: []
  },
  {
    id: 3,
    nome: "Fundo de Apoio à Cultura e Pecuária de Corte",
    documento: "55.444.333/0002-22",
    cnpj: "55.444.333/0002-22",
    razaoSocial: "Fundo de Apoio à Cultura e Pecuária de Corte",
    nomeFantasia: "FACUPEC",
    proprietarios: []
  }
];

interface PageProps {
  dados?: FundoArrecadacao;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-visible rounded-xl bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}
    </section>
  );
}

function RequiredFieldsNotice() {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Info size={20} className="flex-shrink-0 text-gray-500 stroke-[2.5]" />
      <p className="text-sm font-medium leading-relaxed text-gray-600">
        Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.
      </p>
    </div>
  );
}

function SuccessModal({ title, message, onBack, onView }: { title: string; message: string; onBack: () => void; onView: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
          <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={onBack} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40">Voltar</button>
          <button type="button" onClick={onView} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
        </div>
      </div>
    </div>
  );
}

const newDraft = (): FundoDraft => ({
  pessoaJuridica: null as unknown as PessoaJuridicaFundo,
  tipo: "" as TipoFundo,
  endereco: emptyEndereco(),
  contatos: emptyContatos(),
  anexos: [],
  observacao: "",
  situacao: "Ativo",
  convenios: [],
});

const cloneFundo = (fundo: FundoArrecadacao): FundoArrecadacao => JSON.parse(JSON.stringify(fundo));



function ReadOnlyLocation({ fundo }: { fundo: FundoDraft | FundoArrecadacao }) {
  const fields = [
    ["Zona", fundo.endereco.zona], ["CEP", fundo.endereco.cep], ["Estado", fundo.endereco.estado], ["Município", fundo.endereco.municipio],
    ["Bairro", fundo.endereco.bairro], ["Endereço", fundo.endereco.endereco], ["Número", fundo.endereco.numero], ["Complemento", fundo.endereco.complemento],
    ["Localidade", fundo.endereco.localidade], ["Distrito", fundo.endereco.distrito], ["Latitude", fundo.endereco.latitude], ["Longitude", fundo.endereco.longitude],
  ].filter(([, value]) => value);
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{fields.map(([label, value]) => <FloatInput key={label} label={label} value={value} disabled />)}</div>;
}

function ReadOnlyContacts({ fundo }: { fundo: FundoDraft | FundoArrecadacao }) {
  const proprietarios = fundo.pessoaJuridica?.proprietarios.filter((item) => fundo.contatos.proprietariosSelecionados.includes(item.id)) || [];
  return (
    <div className="flex flex-col gap-4">
      <FloatInput label="Utilizar Contato de Proprietários?" value={fundo.contatos.utilizarContatoProprietario} disabled />
      {proprietarios.map((item) => (
        <div key={item.id} className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-800">{item.nome}</p>
          <p className="mt-1 text-xs text-gray-500">CPF: {item.cpf} · E-mail: {item.email || "Não informado"} · Telefone: {item.telefone || "Não informado"}</p>
        </div>
      ))}
      {fundo.contatos.utilizarContatoProprietario === "Não" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatInput label="E-mail" value={fundo.contatos.emailFixo} disabled />
          <FloatInput label="Telefone" value={fundo.contatos.telefoneFixo} disabled />
          {fundo.contatos.emailFixoObs && <FloatInput label="Observação do e-mail" value={fundo.contatos.emailFixoObs} disabled />}
          {fundo.contatos.telefoneFixoObs && <FloatInput label="Observação do telefone" value={fundo.contatos.telefoneFixoObs} disabled />}
        </div>
      )}
      {fundo.contatos.contatosAdicionais.map((item, index) => (
        <div key={item.id} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FloatInput label={`Contato adicional ${index + 1}`} value={item.tipo} disabled />
          <FloatInput label={item.tipo} value={item.tipo === "E-mail" ? item.email : item.telefone} disabled />
          <FloatInput label="Observação" value={item.observacao} disabled />
        </div>
      ))}
    </div>
  );
}



function BasicData({ mode, fundo, setFundo, onNavigate }: { mode: Mode; fundo: FundoDraft | FundoArrecadacao; setFundo: (value: any) => void; onNavigate: PageProps["onNavigate"] }) {
  const disabled = mode === "view";
  const selectedPessoa = fundo.pessoaJuridica;
  const update = <K extends keyof typeof fundo>(field: K, value: (typeof fundo)[K]) => setFundo({ ...fundo, [field]: value });
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");


  return (
    <div className="flex flex-col gap-4">
      <Section title="Informações Básicas">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">

          {/* Bloco da Pessoa Jurídica (Se for "add" usa o componente de busca, se não exibe o input travado) */}
          <div className="md:col-span-12">
            {mode === "add" ? (
              <PessoaJuridicaInput
                value={selectedPessoa?.nome || selectedPessoa?.razaoSocial || ""}
                data={PESSOAS_JURIDICAS_FUNDO}
                onChange={(pessoa: any) => update("pessoaJuridica", pessoa)}
                onEyeClick={() => selectedPessoa && onNavigate("visualizar-pessoa-juridica", selectedPessoa)}
                required
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
                <FloatInput label="Razão Social / Nome" value={selectedPessoa?.razaoSocial || ""} disabled />
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <FloatInput label="CNPJ" required value={selectedPessoa?.cnpj || ""} disabled />
                  </div>
                  <button
                    type="button"
                    onClick={() => selectedPessoa && onNavigate("visualizar-pessoa-juridica", selectedPessoa)}
                    className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition mt-2"
                    title="Visualizar Pessoa Jurídica"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Linha de Baixo: Tipo do Fundo e Situação */}
          <div className={mode === "add" ? "md:col-span-12" : "md:col-span-6"}>
            <FloatSelect
              label="Tipo do Fundo de Arrecadação"
              required
              value={fundo.tipo}
              onChange={(value) => update("tipo", value as TipoFundo)}
              options={TIPOS_FUNDO}
              disabled={disabled}
            />
          </div>

          {mode !== "add" && (
            <div className="md:col-span-6">
              <FloatSelect
                label="Situação"
                required
                value={fundo.situacao}
                onChange={(value) => update("situacao", value as Situacao)}
                options={SITUACOES}
                disabled={disabled}
              />
            </div>
          )}

        </div>
      </Section>

      <Section title="Informações de Localização">
        {disabled ? <ReadOnlyLocation fundo={fundo} /> : (
          <BlocoEnderecoFields
            title="Localização"
            data={fundo.endereco}
            tipoEstado="normal"
            onChange={(key, value) => update("endereco", { ...fundo.endereco, [key]: value })}
            onSetMultipleFields={(fields) => update("endereco", { ...fundo.endereco, ...fields })}
          />
        )}
      </Section>

      <Section title="Informações de Contato">
        {disabled ? <ReadOnlyContacts fundo={fundo} /> : (
          <BlocoContatoFields
            data={fundo.contatos}
            onChange={(fields) => update("contatos", { ...fundo.contatos, ...fields })}
            proprietariosDisponiveis={selectedPessoa?.proprietarios || []}
          />
        )}
      </Section>


      {/* Seção Anexo Geral Dinâmica com Numeração */}
      <Section title="Anexo">
        <div className="flex flex-col gap-6">
          {anexos.map((anexo, index) => (
            <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">

              {/* Número indicador do anexo (Igual ao Representante Legal) */}
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
                      setAnexos(prev =>
                        prev.map((a, i) =>
                          i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                        )
                      )
                    }
                  />



                  {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                  {anexo.nome && (
                    <>
                      <div className="flex-1">
                        <FloatInput
                          label="Descrição"
                          value={anexo.descricao || ""}
                          placeholder="Descrição opcional..."
                          onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                        />
                      </div>
                      <div className="h-12 flex items-center">
                        <button
                          type="button"
                          onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                          className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </>
                  )}

                  {/* Botão de Excluir o Anexo */}
                  <div className="h-12 flex items-center">
                    <button
                      type="button"
                      onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* Botão para Adicionar Novo Anexo */}
          <button
            type="button"
            onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
          >
            <PlusCircle size={16} /> Adicionar Anexo
          </button>
        </div>
      </Section>

      {/* Seção Observação Geral */}
      <Section title="Observação">
        <LargeTextArea
          label="Observação"
          value={observacao}
          onChange={setObservacao}
          hasTooltip
          tooltipText="Informações adicionais pertinentes ao cadastro."
        />
      </Section>
    </div>
  );
}

function ConvenioModal({ mode, initial, onClose, onSave }: { mode: ConvenioMode; initial?: Convenio; onClose: () => void; onSave: (value: Convenio | Omit<Convenio, "id">) => void }) {
  const [value, setValue] = useState<Convenio | Omit<Convenio, "id">>(initial ? { ...initial } : emptyConvenio());
  const disabled = mode === "view";
  const update = (field: keyof Omit<Convenio, "id">, next: string) => setValue({ ...value, [field]: next });
  const digits = (field: keyof Omit<Convenio, "id">, next: string, maxLength: number) => update(field, next.replace(/\D/g, "").slice(0, maxLength));
  const valid = value.nome && value.numero.length === 7 && value.numeroCarteira.length === 2 && value.variacaoCarteira.length === 3 && value.tipoTitulo && value.numeroTitulo && value.descricao && value.codigoTipoContaCaucao.length === 1 && value.mensagemBloqueto;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div><h2 className="text-xl font-semibold text-gray-900">{mode === "add" ? "Adicionar Convênio" : mode === "edit" ? "Editar Convênio" : "Detalhes do Convênio"}</h2><p className="mt-1 text-sm text-gray-500">Informe os dados de arrecadação vinculados ao fundo.</p></div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-gray-400 hover:bg-gray-100" title="Fechar"><X size={20} /></button>
        </div>
        <div className="flex flex-col gap-5 p-6">
          {!disabled && <RequiredFieldsNotice />}
          <Section title="Convênio">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FloatInput label="Nome do Convênio" required value={value.nome} onChange={(next) => update("nome", next)} maxLength={255} disabled={disabled} />
              <FloatInput label="Número do Convênio" required value={value.numero} onChange={(next) => digits("numero", next, 7)} maxLength={7} disabled={disabled} />
              <FloatInput label="Número da Carteira" required value={value.numeroCarteira} onChange={(next) => digits("numeroCarteira", next, 2)} maxLength={2} disabled={disabled} />
              <FloatInput label="Número Variação da Carteira" required value={value.variacaoCarteira} onChange={(next) => digits("variacaoCarteira", next, 3)} maxLength={3} disabled={disabled} />
              <FloatInput label="Tipo de Título" required value={value.tipoTitulo} onChange={(next) => update("tipoTitulo", next)} maxLength={255} disabled={disabled} />
              <FloatInput label="Número do Título" required value={value.numeroTitulo} onChange={(next) => update("numeroTitulo", next)} maxLength={15} disabled={disabled} />
              <FloatInput label="Descrição" required value={value.descricao} onChange={(next) => update("descricao", next)} maxLength={255} disabled={disabled} className="md:col-span-2" />
              <FloatInput label="Código do Tipo Conta Caução" required value={value.codigoTipoContaCaucao} onChange={(next) => digits("codigoTipoContaCaucao", next, 1)} maxLength={1} disabled={disabled} />
              <FloatInput label="Mensagem de Bloqueto" required value={value.mensagemBloqueto} onChange={(next) => update("mensagemBloqueto", next)} maxLength={255} disabled={disabled} />
              {mode !== "add" && <FloatSelect label="Situação" required value={value.situacao} onChange={(next) => update("situacao", next)} options={SITUACOES} disabled={disabled} />}
            </div>
          </Section>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C]">{disabled ? "Voltar" : "Cancelar"}</button>
            {!disabled && <button type="button" onClick={() => onSave(value)} disabled={!valid} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F] disabled:cursor-not-allowed disabled:opacity-50">{mode === "add" ? "Adicionar" : "Salvar"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

const formatarDataConvenio = (data: string) => {
  const [ano, mes, dia] = data.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
};

interface ConvenioCardsProps {
  convenios: Convenio[];
  menuAberto: number | null;
  onMenuChange: (id: number | null) => void;
  onVisualizar: (convenio: Convenio) => void;
  onEditar: (convenio: Convenio) => void;
  onToggleSituacao: (convenio: Convenio) => void;
}

function ConvenioCards({ convenios, menuAberto, onMenuChange, onVisualizar, onEditar, onToggleSituacao }: ConvenioCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {convenios.map((convenio) => (
        <article key={convenio.id} className="relative min-w-0 rounded-sm border border-gray-100 bg-white shadow-sm">
          <div className={`h-1 rounded-t-sm ${convenio.situacao === "Ativo" ? "bg-[#1A7A3C]" : "bg-gray-400"}`} />

          <div className="flex min-h-[180px] flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3 text-[10px] text-gray-500">
              <span><strong>Cadastrado:</strong> {formatarDataConvenio(convenio.cadastradoEm)}</span>
              <span>{convenio.situacao}</span>
            </div>

            <div className="flex items-start gap-3">
              <Handshake size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{convenio.nome}</p>
                <p className="text-[10px] text-gray-500">Nome do Convênio</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
              <div className="min-w-0">
                <p className="truncate text-sm text-gray-800">{convenio.numero}</p>
                <p className="text-[10px] text-gray-500">Número do Convênio</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
              <div className="min-w-0">
                <p className="text-sm text-gray-800">{convenio.numeroCarteira} / {convenio.variacaoCarteira}</p>
                <p className="text-[10px] text-gray-500">Carteira / Variação</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3">
            <button type="button" onClick={() => onVisualizar(convenio)} className="h-9 rounded bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]">Visualizar</button>
            <div className="relative">
              <button type="button" onClick={() => onMenuChange(menuAberto === convenio.id ? null : convenio.id)} className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700" title="Mais ações" aria-label={`Mais ações para ${convenio.nome}`}>
                <MoreVertical size={19} />
              </button>
              {menuAberto === convenio.id && (
                <div className="absolute bottom-10 right-0 z-30 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button type="button" onClick={() => { onEditar(convenio); onMenuChange(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Editar</button>
                  <button type="button" onClick={() => { onToggleSituacao(convenio); onMenuChange(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">{convenio.situacao === "Ativo" ? "Inativar" : "Ativar"}</button>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ConvenioCardGroup({ ativos, inativos, onAdicionar, onVisualizar, onEditar, onToggleSituacao }: {
  ativos: Convenio[];
  inativos: Convenio[];
  onAdicionar: () => void;
  onVisualizar: (convenio: Convenio) => void;
  onEditar: (convenio: Convenio) => void;
  onToggleSituacao: (convenio: Convenio) => void;
}) {
  const [open, setOpen] = useState(true);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [historicoPage, setHistoricoPage] = useState(1);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(ativos.length / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = ativos.length ? (pageAtual - 1) * perPage + 1 : 0;
  const fim = Math.min(pageAtual * perPage, ativos.length);
  const pagina = ativos.slice((pageAtual - 1) * perPage, pageAtual * perPage);
  const totalHistoricoPages = Math.max(1, Math.ceil(inativos.length / perPage));
  const historicoPageAtual = Math.min(historicoPage, totalHistoricoPages);
  const historicoInicio = inativos.length ? (historicoPageAtual - 1) * perPage + 1 : 0;
  const historicoFim = Math.min(historicoPageAtual * perPage, inativos.length);
  const paginaHistorico = inativos.slice((historicoPageAtual - 1) * perPage, historicoPageAtual * perPage);

  const cardsProps = { menuAberto, onMenuChange: setMenuAberto, onVisualizar, onEditar, onToggleSituacao };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 p-5">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex flex-1 items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#20A866] text-white"><CalendarClock size={21} /></div>
          <div><h2 className="font-semibold text-gray-800">Convênio</h2><p className="text-xs text-gray-500">Convênios ativos: {ativos.length}</p></div>
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onAdicionar} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-4 text-xs font-bold text-white hover:bg-[#15612F]"><PlusCircle size={16} />Adicionar Convênio</button>
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label={open ? "Recolher convênios" : "Expandir convênios"}><ChevronDown size={19} className={`transition ${open ? "rotate-180" : ""}`} /></button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-5">
          {ativos.length ? <ConvenioCards convenios={pagina} {...cardsProps} /> : <p className="py-10 text-center text-sm text-gray-500">Nenhum convênio ativo para este fundo.</p>}

          <div className="flex items-center justify-between pt-6 text-xs text-gray-500">
            <span>Itens por página: {perPage}</span>
            <div className="flex items-center gap-3"><span>{inicio} - {fim} de {ativos.length}</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={pageAtual === 1} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Página anterior"><ChevronLeft size={17} /></button><button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={pageAtual === totalPages} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Próxima página"><ChevronRight size={17} /></button></div></div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <button type="button" onClick={() => setHistoricoOpen((value) => !value)} className="flex w-full items-center justify-between text-left text-sm font-medium text-[#1A7A3C] transition hover:text-[#15612F]">
              <span className="flex items-center gap-2"><ChevronDown size={17} className={`transition ${historicoOpen ? "rotate-180" : ""}`} />Histórico de Convênios Inativos</span>
              <span className="text-xs font-normal text-gray-500">Convênios inativos: {inativos.length}</span>
            </button>

            {historicoOpen && (
              <div className="pt-5">
                {inativos.length ? <ConvenioCards convenios={paginaHistorico} {...cardsProps} /> : <p className="py-10 text-center text-sm text-gray-500">Nenhum convênio inativo no histórico.</p>}
                {inativos.length > 0 && (
                  <div className="flex items-center justify-between pt-6 text-xs text-gray-500">
                    <span>Itens por página: {perPage}</span>
                    <div className="flex items-center gap-3"><span>{historicoInicio} - {historicoFim} de {inativos.length}</span><div className="flex items-center gap-1"><button type="button" onClick={() => setHistoricoPage((value) => Math.max(1, value - 1))} disabled={historicoPageAtual === 1} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Página anterior do histórico"><ChevronLeft size={17} /></button><button type="button" onClick={() => setHistoricoPage((value) => Math.min(totalHistoricoPages, value + 1))} disabled={historicoPageAtual === totalHistoricoPages} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Próxima página do histórico"><ChevronRight size={17} /></button></div></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ConveniosPanel({ fundo, setFundo }: { fundo: FundoArrecadacao; setFundo: (value: FundoArrecadacao) => void }) {
  const [modal, setModal] = useState<{ mode: ConvenioMode; convenio?: Convenio } | null>(null);
  const [savedConvenio, setSavedConvenio] = useState<Convenio | null>(null);
  const ativos = fundo.convenios.filter((item) => item.situacao === "Ativo").sort((a, b) => b.cadastradoEm.localeCompare(a.cadastradoEm));
  const inativos = fundo.convenios.filter((item) => item.situacao === "Inativo").sort((a, b) => b.cadastradoEm.localeCompare(a.cadastradoEm));

  const save = (value: Convenio | Omit<Convenio, "id">) => {
    const saved = modal?.mode === "edit" && "id" in value ? atualizarConvenio(fundo.id, value) : adicionarConvenio(fundo.id, value as Omit<Convenio, "id">);
    const convenios = modal?.mode === "edit" ? fundo.convenios.map((item) => item.id === saved.id ? saved : item) : [...fundo.convenios, saved];
    const updated = { ...fundo, convenios };
    atualizarFundo(updated);
    setFundo(updated);
    setModal(null);
    setSavedConvenio(saved);
  };

  const toggleSituacao = (convenio: Convenio) => {
    const updatedConvenio = atualizarConvenio(fundo.id, { ...convenio, situacao: convenio.situacao === "Ativo" ? "Inativo" : "Ativo" });
    const updated = { ...fundo, convenios: fundo.convenios.map((item) => item.id === convenio.id ? updatedConvenio : item) };
    atualizarFundo(updated);
    setFundo(updated);
  };

  return (
    <>
      <ConvenioCardGroup ativos={ativos} inativos={inativos} onAdicionar={() => setModal({ mode: "add" })} onVisualizar={(convenio) => setModal({ mode: "view", convenio })} onEditar={(convenio) => setModal({ mode: "edit", convenio })} onToggleSituacao={toggleSituacao} />
      {modal && <ConvenioModal mode={modal.mode} initial={modal.convenio} onClose={() => setModal(null)} onSave={save} />}
      {savedConvenio && <SuccessModal title="Convênio cadastrado com sucesso!" message={`${savedConvenio.nome} foi vinculado ao fundo.`} onBack={() => setSavedConvenio(null)} onView={() => { setModal({ mode: "view", convenio: savedConvenio }); setSavedConvenio(null); }} />}
    </>
  );
}

function FundoArrecadacaoDetailPage({ mode, dados, onLogout, onNavigate }: PageProps & { mode: Mode }) {
  const [fundo, setFundo] = useState<FundoDraft | FundoArrecadacao>(() => dados ? cloneFundo(dados) : newDraft());
  const [activeTab, setActiveTab] = useState("dados");
  const [savedFundo, setSavedFundo] = useState<FundoArrecadacao | null>(null);

  const valid = useMemo(() => {
    const endereco = fundo.endereco;
    const locationValid = endereco.zona && endereco.estado && endereco.municipio && endereco.endereco && (endereco.zona === "Rural" || (endereco.cep && endereco.bairro && endereco.numero));
    const contactValid = fundo.contatos.utilizarContatoProprietario === "Sim"
      ? fundo.contatos.proprietariosSelecionados.length > 0
      : Boolean(fundo.contatos.emailFixo && fundo.contatos.telefoneFixo);
    return Boolean(fundo.pessoaJuridica && fundo.tipo && locationValid && contactValid && fundo.anexos.every((item) => item.nome));
  }, [fundo]);

  const saveFundo = () => {
    if (!valid) return;
    if (mode === "add") {
      const saved = adicionarFundo(fundo as FundoDraft);
      setSavedFundo(saved);
    } else {
      const saved = atualizarFundo(fundo as FundoArrecadacao);
      setSavedFundo(saved);
    }
  };

  const title = mode === "add" ? "Adicionar Fundo de Arrecadação" : mode === "edit" ? "Editar Fundo de Arrecadação" : "Visualizar Fundo de Arrecadação";
  const backLabel = mode === "edit" ? "Visualizar Fundo de Arrecadação" : "Todos os Fundos de Arrecadação";
  const back = () => mode === "edit" ? onNavigate("visualizar-fundo-arrecadacao", fundo) : onNavigate("fundo-arrecadacao");
  const tabs = [
    { id: "dados", label: "Dados do Fundo", icon: (active: boolean) => <FileText size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
    { id: "convenios", label: "Convênio", icon: (active: boolean) => <Handshake size={18} className={active ? "text-[#1A7A3C]" : "text-gray-400"} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="fundo-arrecadacao" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={back} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70"><ArrowLeft size={15} />{backLabel}</button>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {mode === "view" ? (
              <button type="button" onClick={() => onNavigate("editar-fundo-arrecadacao", fundo)} className="flex h-10 items-center gap-2 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F]"><Pencil size={15} />Editar</button>
            ) : (
              <button type="button" onClick={saveFundo} disabled={!valid} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white hover:bg-[#15612F] disabled:cursor-not-allowed disabled:opacity-50">{mode === "add" ? "Adicionar" : "Salvar"}</button>
            )}
          </div>
        </div>

        {mode !== "view" && <RequiredFieldsNotice />}
        {mode !== "add" && <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />}
        {(mode === "add" || activeTab === "dados") && <BasicData mode={mode} fundo={fundo} setFundo={setFundo} onNavigate={onNavigate} />}
        {mode !== "add" && activeTab === "convenios" && <ConveniosPanel fundo={fundo as FundoArrecadacao} setFundo={setFundo} />}
      </main>

      {savedFundo && (
        <SuccessModal
          title={mode === "add" ? "Fundo de Arrecadação cadastrado com sucesso!" : "Fundo de Arrecadação atualizado com sucesso!"}
          message={`${savedFundo.nome} foi ${mode === "add" ? "cadastrado" : "atualizado"}.`}
          onBack={() => onNavigate("fundo-arrecadacao")}
          onView={() => onNavigate("visualizar-fundo-arrecadacao", savedFundo)}
        />
      )}
    </div>
  );
}

export function AdicionarFundoArrecadacaoPage(props: PageProps) {
  return <FundoArrecadacaoDetailPage {...props} mode="add" />;
}

export function EditarFundoArrecadacaoPage(props: PageProps) {
  return <FundoArrecadacaoDetailPage {...props} mode="edit" />;
}

export function VisualizarFundoArrecadacaoPage(props: PageProps) {
  return <FundoArrecadacaoDetailPage {...props} mode="view" />;
}