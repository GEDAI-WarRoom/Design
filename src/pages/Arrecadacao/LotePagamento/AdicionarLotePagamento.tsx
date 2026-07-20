import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  FileSearch,
  FileText,
  Info,
  Trash2,
  UserRoundSearch,
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
}

export function AdicionarLotePagamentoPage({ onLogout, onNavigate }: PageProps) {
  const [documento, setDocumento] = useState<TipoDocumentoLote | "">("");
  const [titular, setTitular] = useState<PessoaLote | null>(null);
  const [unidade, setUnidade] = useState<UnidadeAdministrativaLote | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoLotePagamento[]>([]);
  const [documentosModalOpen, setDocumentosModalOpen] = useState(false);
  const [savedLote, setSavedLote] = useState<LotePagamento | null>(null);

  const pessoasDisponiveis = useMemo(
    () => PESSOAS_LOTE.filter((item) => documento === "GTA" ? item.origemGta : documento === "PTV" ? item.origemPtv : false),
    [documento],
  );
  const documentosDisponiveis = useMemo(
    () => DOCUMENTOS_DISPONIVEIS_LOTE.filter((item) => item.tipo === documento && item.titularId === titular?.id),
    [documento, titular],
  );
  const informacoesPreenchidas = Boolean(documento && titular && unidade);
  const quantidade = documentos.length;
  const valor = documentos.reduce((total, item) => total + item.valor, 0);
  const formularioValido = informacoesPreenchidas && quantidade > 0;

  const changeDocumento = (value: string) => {
    setDocumento(value as TipoDocumentoLote | "");
    setTitular(null);
    setUnidade(null);
    setDocumentos([]);
  };

  const salvar = () => {
    if (!documento || !titular || !unidade || documentos.length === 0) return;
    setSavedLote(criarLotePagamento({ documento, titular, unidadeAdministrativa: unidade, documentos }));
  };

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
            {documento && (
              <EntitySearchInput
                label={documento === "GTA" ? "Produtor" : "Contribuinte Origem"}
                placeholder={documento === "GTA" ? "Buscar produtor" : "Buscar contribuinte de origem"}
                value={titular ? `${titular.documento} - ${titular.nome}` : ""}
                data={pessoasDisponiveis}
                searchKeys={["documento", "nome", "tipo"]}
                columns={[
                  { label: "CPF/CNPJ", key: "documento" },
                  { label: "Nome/Razão Social", key: "nome" },
                  { label: "Tipo", key: "tipo" },
                ]}
                icon={<UserRoundSearch size={18} className="text-[#1A7A3C]" />}
                title={documento === "GTA" ? "Buscar Produtor" : "Buscar Contribuinte de Origem"}
                subtitle={`Busque pessoas cadastradas que podem ser origem de ${documento}:`}
                onChange={(item) => { setTitular(item); setDocumentos([]); }}
                required
              />
            )}
            <EntitySearchInput
              label="Unidade Administrativa"
              placeholder="Buscar escritório seccional"
              value={unidade ? `${unidade.codigo} - ${unidade.nome}` : ""}
              data={UNIDADES_ADMINISTRATIVAS_LOTE}
              searchKeys={["codigo", "nome"]}
              columns={[
                { label: "Código", key: "codigo" },
                { label: "Unidade Administrativa", key: "nome" },
              ]}
              icon={<Building2 size={18} className="text-[#1A7A3C]" />}
              title="Buscar Unidade Administrativa"
              subtitle="Busque unidades administrativas cadastradas que são escritórios seccionais:"
              onChange={(item) => { setUnidade(item); setDocumentos([]); }}
              required
            />
          </div>
        </Section>

        {informacoesPreenchidas && (
          <Section title={`Itens Lote ${documento}`}>
            <div className="flex flex-col gap-4">
              <div onClick={() => setDocumentosModalOpen(true)} className="cursor-pointer">
                <FloatInput
                  label={`${documento}s`}
                  required
                  value={documentos.length ? `${documentos.length} documento${documentos.length > 1 ? "s" : ""} selecionado${documentos.length > 1 ? "s" : ""}` : ""}
                  icon={<FileSearch size={18} />}
                  onClick={() => setDocumentosModalOpen(true)}
                  placeholder={`Buscar ${documento}s gravad${documento === "GTA" ? "as" : "os"}`}
                />
              </div>
              <p className="text-xs text-gray-500">Selecione pelo menos um documento com status “{documento === "GTA" ? "Gravada" : "Gravado"}” referente a {documento === "GTA" ? "este produtor" : "este contribuinte"}.</p>

              {documentos.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50"><th className="px-4 py-3 text-left font-semibold text-gray-600">Id</th><th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th><th className="px-4 py-3 text-left font-semibold text-gray-600">Valor</th><th aria-label="Ações" /></tr></thead>
                    <tbody>
                      {documentos.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-4 py-3 text-gray-700">{item.id}</td>
                          <td className="px-4 py-3 text-gray-700">{item.status}</td>
                          <td className="px-4 py-3 text-gray-700">{formatarMoedaLote(item.valor)}</td>
                          <td className="px-4 py-3 text-right"><button type="button" onClick={() => setDocumentos((items) => items.filter((doc) => doc.id !== item.id))} className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Remover"><Trash2 size={17} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Section>
        )}

        <Section title="Total do Lote">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatInput label="Quantidade de Documentos" required value={String(quantidade)} disabled />
            <FloatInput label="Valor do Lote de Pagamento" required value={formatarMoedaLote(valor)} disabled />
          </div>
        </Section>
      </main>

      <MultiSearchModal<DocumentoLotePagamento>
        open={documentosModalOpen}
        onClose={() => setDocumentosModalOpen(false)}
        title={`Buscar ${documento}s`}
        subtitle={`Selecione uma ou mais ${documento}s referentes a ${titular?.nome ?? "pessoa selecionada"}:`}
        icon={<FileText size={22} className="text-[#1A7A3C]" />}
        data={documentosDisponiveis}
        columns={[
          { label: "Id", key: "id" },
          { label: "Status", key: "status" },
          { label: "Valor", key: "valor", render: (value) => formatarMoedaLote(Number(value)) },
        ]}
        searchKeys={["id", "numero", "status"]}
        searchPlaceholder={`Digite o número ou id da ${documento}`}
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
              <button type="button" onClick={() => onNavigate("visualizar-lote-pagamento", savedLote)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
