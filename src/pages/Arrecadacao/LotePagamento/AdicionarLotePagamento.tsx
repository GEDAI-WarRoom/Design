import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Info,
  PlusCircle,
  Trash2,
  User,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CustomButton,
  FloatInput,
  FloatSelect,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  criarLotePagamento,
  DOCUMENTOS_CADASTRO_OPTIONS,
  DOCUMENTOS_DISPONIVEIS_LOTE,
  DocumentoLotePagamento,
  formatarMoedaLote,
  LotePagamento,
  PESSOAS_LOTE,
  PessoaLote,
  TipoDocumentoLote,
  UNIDADES_ADMINISTRATIVAS_LOTE,
  UnidadeAdministrativaLote,
} from "./lotePagamentoData";

// 🌟 Importação unificada dos ícones do sistema
import * as Icons from "../../../imports/icons";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 pb-6 pt-5">{children}</div>}
    </section>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  onViewPessoa?: (pessoa: PessoaLote) => void;
  onViewUnidade?: (unidade: UnidadeAdministrativaLote) => void;
}

export function AdicionarLotePagamentoPage({ onLogout, onNavigate, onViewPessoa, onViewUnidade }: PageProps) {
  const [documento, setDocumento] = useState<TipoDocumentoLote | "">("");
  const [titular, setTitular] = useState<PessoaLote | null>(null);
  const [tipoPessoa, setTipoPessoa] = useState<string>("");
  const [unidade, setUnidade] = useState<UnidadeAdministrativaLote | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoLotePagamento[]>([]);
  const [documentosModalOpen, setDocumentosModalOpen] = useState(false);
  const [savedLote, setSavedLote] = useState<LotePagamento | null>(null);

  // 🌟 Estado para minimizar/expandir os itens do corpo da tabela
  const [tabelaExpandida, setTabelaExpandida] = useState(true);

  // 🌟 Filtro das pessoas por tipo de documento (GTA/PTV) + Filtro do modal (PF/PJ)
  const pessoasDisponiveis = useMemo(() => {
    return PESSOAS_LOTE.filter((item) => {
      const atendeOrigem = documento === "GTA" ? item.origemGta : documento === "PTV" ? item.origemPtv : false;
      if (!atendeOrigem) return false;

      if (tipoPessoa === "PF") return item.tipo === "Física" || item.documento.length <= 14;
      if (tipoPessoa === "PJ") return item.tipo === "Jurídica" || item.documento.length > 14;

      return true;
    });
  }, [documento, tipoPessoa]);

  // 🌟 Filtra TODOS os documentos disponíveis do tipo selecionado (GTA ou PTV)
  const documentosDisponiveis = useMemo(() => {
    if (!documento) return [];
    return DOCUMENTOS_DISPONIVEIS_LOTE.filter((item) => item.tipo === documento);
  }, [documento]);

  const informacoesPreenchidas = Boolean(documento && titular && unidade);
  const quantidade = documentos.length;
  const valor = documentos.reduce((total, item) => total + item.valor, 0);
  const formularioValido = informacoesPreenchidas && quantidade > 0;

  const changeDocumento = (value: string) => {
    setDocumento(value as TipoDocumentoLote | "");
    setTitular(null);
    setTipoPessoa("");
    setUnidade(null);
    setDocumentos([]);
  };

  const salvar = () => {
    if (!documento || !titular || !unidade || documentos.length === 0) return;
    setSavedLote(criarLotePagamento({ documento, titular, unidadeAdministrativa: unidade, documentos }));
  };

  // 🌟 Rótulos dinâmicos
  const labelModalNome = tipoPessoa === "PF" ? "Nome" : tipoPessoa === "PJ" ? "Razão Social" : "Nome / Razão Social";
  const labelModalDoc = tipoPessoa === "PJ" ? "CNPJ" : tipoPessoa === "PF" ? "CPF" : "CPF / CNPJ";
  const labelCampoDoc = titular?.tipo === "Jurídica" || (titular?.documento && titular.documento.length > 14) ? "CNPJ" : "CPF";
  const tituloEntidade = documento === "GTA" ? "Produtor" : "Contribuinte Origem";

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lote-pagamento" hideSearch />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("lote-pagamento")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} />Todos os Lotes de Pagamento
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Lote de Pagamento</h1>
            <CustomButton onClick={salvar} disabled={!formularioValido}>Adicionar</CustomButton>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="flex-shrink-0 text-gray-500 stroke-[2.5]" />
          <p className="text-sm font-medium leading-relaxed text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatSelect label="Documento" required value={documento} onChange={changeDocumento} options={DOCUMENTOS_CADASTRO_OPTIONS} />
            <FloatInput label="Tipo de Lote de Pagamento" value="Individual" disabled />

            {/* 🌟 PRODUTOR / CONTRIBUINTE ORIGEM */}
            {documento && (
              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <EntitySearchInput
                    label={tituloEntidade}
                    placeholder={`Buscar por ${tituloEntidade.toLowerCase()}`}
                    required
                    value={titular?.nome ?? ""}
                    data={pessoasDisponiveis}
                    searchKeys={["nome", "documento", "tipo"]}
                    columns={[
                      { label: labelModalNome, key: "nome" },
                      { label: labelModalDoc, key: "documento" },
                    ]}
                    icon={<User size={18} className="text-[#1A7A3C]" />}
                    title={`Buscar ${tituloEntidade}`}
                    subtitle={`Busque por um ${tituloEntidade.toLowerCase()} cadastrado no sistema:`}
                    onChange={(item) => {
                      setTitular(item);
                      setDocumentos([]);
                      setTipoPessoa("");
                    }}
                    headerActions={
                      <div className="w-48 !mr-4 pr-1 relative z-10 flex-shrink-0">
                        <FloatSelect
                          label="Tipo de Pessoa"
                          required
                          value={tipoPessoa}
                          onChange={(v) => setTipoPessoa(v)}
                          options={[
                            { value: "PF", label: "Pessoa Física" },
                            { value: "PJ", label: "Pessoa Jurídica" },
                          ]}
                        />
                      </div>
                    }
                  />
                </div>

                {/* CAMPO REBOQUE DO TITULAR: CPF/CNPJ DESABILITADO + BOTÃO OLHINHO */}
                {titular && (
                  <>
                    <div className="flex-1">
                      <FloatInput
                        label={`${labelCampoDoc} ${tituloEntidade}`}
                        value={titular.documento}
                        disabled
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => titular && onViewPessoa?.(titular)}
                      className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                      title={`Visualizar Detalhes do ${tituloEntidade}`}
                    >
                      <Eye size={20} />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 🌟 UNIDADE ADMINISTRATIVA + CAMPO CÓDIGO + BOTÃO OLHINHO */}
            <div className="md:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <EntitySearchInput
                  label="Unidade Administrativa"
                  placeholder="Buscar escritório seccional"
                  value={unidade?.nome ?? ""}
                  data={UNIDADES_ADMINISTRATIVAS_LOTE}
                  searchKeys={["codigo", "nome"]}
                  columns={[
                    { label: "Código", key: "codigo" },
                    { label: "Unidade Administrativa", key: "nome" },
                  ]}
                  icon={<img src={Icons.iconeUnidadeConsolidacaoUrl} alt="Unidade Administrativa" className="w-5 h-5 object-contain" />}
                  title="Buscar Unidade Administrativa"
                  subtitle="Busque unidades administrativas cadastradas que são escritórios seccionais:"
                  onChange={(item) => { setUnidade(item); setDocumentos([]); }}
                  required
                />
              </div>

              {unidade && (
                <>
                  <div className="flex-1">
                    <FloatInput
                      label="Código Unidade Administrativa"
                      value={unidade.codigo}
                      disabled
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => unidade && onViewUnidade?.(unidade)}
                    className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                    title="Visualizar Detalhes da Unidade Administrativa"
                  >
                    <Eye size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* 🌟 SEÇÃO DE ITENS DO LOTE */}
        {informacoesPreenchidas && (
          <Section title={`Itens Lote ${documento}`}>
            <div className="flex flex-col gap-4">

              {/* BOTÃO CONTORNADO COM PLUS CIRCLE */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setDocumentosModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-[#1A7A3C] px-4 py-2.5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition"
                >
                  <PlusCircle size={18} />
                  Adicionar {documento}
                </button>
              </div>

              {/* TABELA COM CABEÇALHO E RODAPÉ SEMPRE VISÍVEIS */}
              {documentos.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm bg-white">
                  <table className="w-full border-collapse text-sm">

                    {/* CABEÇALHO COM AÇÃO DE MINIMIZAR */}
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 select-none">
                        <th className="px-4 py-3 text-left font-semibold">Código</th>
                        <th className="px-4 py-3 text-left font-semibold">Valor</th>
                        <th className="px-4 py-3 text-right font-normal">
                          <button
                            type="button"
                            onClick={() => setTabelaExpandida(!tabelaExpandida)}
                            className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-800 transition"
                          >
                            <span className="text-xs">{tabelaExpandida ? "Minimizar" : "Expandir"}</span>
                            {tabelaExpandida ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </th>
                      </tr>
                    </thead>

                    {/* APENAS O TBODY É OCULTADO AO MINIMIZAR */}
                    {tabelaExpandida && (
                      <tbody>
                        {documentos.map((item) => (
                          <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium text-gray-700">{item.id}</td>
                            <td className="px-4 py-3 text-gray-700">{formatarMoedaLote(item.valor)}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => setDocumentos((items) => items.filter((doc) => doc.id !== item.id))}
                                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                                title="Remover"
                              >
                                <Trash2 size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}

                    {/* RODAPÉ PERMANECE FIXO COM RESUMO */}
                    <tfoot>
                      <tr className="border-t border-gray-100 bg-gray-50/80 font-bold text-gray-800">
                        <td className="px-4 py-3 text-left">
                          Documentos selecionados ({quantidade})
                        </td>
                        <td className="px-4 py-3 text-[#1A7A3C]">
                          {formatarMoedaLote(valor)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </Section>
        )}
      </main>

      <MultiSearchModal<DocumentoLotePagamento>
        open={documentosModalOpen}
        onClose={() => setDocumentosModalOpen(false)}
        title={`Buscar ${documento}s`}
        subtitle={`Selecione uma ou mais ${documento}s disponíveis:`}
        icon={<FileText size={22} className="text-[#1A7A3C]" />}
        data={documentosDisponiveis}
        columns={[
          { label: "Código", key: "id" },
          { label: "Valor", key: "valor", render: (value) => formatarMoedaLote(Number(value)) },
        ]}
        searchKeys={["id", "numero"]}
        searchPlaceholder={`Digite o código da ${documento}`}
        selectedItems={documentos}
        onConfirm={(items) => { setDocumentos(items); setDocumentosModalOpen(false); }}
        confirmLabel="Confirmar"
      />

      {savedLote && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Lote de pagamento cadastrado com sucesso!</h2>
            <p className="mt-1 text-sm text-gray-500">O lote nº {savedLote.numeroLote} foi cadastrado.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => onNavigate("lote-pagamento")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40">Voltar</button>
              <button type="button" onClick={() => onNavigate("", savedLote)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}