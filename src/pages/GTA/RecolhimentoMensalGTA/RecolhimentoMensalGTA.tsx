import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Pencil, Search, User } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  CONTRIBUINTES_RECOLHIMENTO,
  MESES_OPTIONS,
  SITUACOES_OPTIONS,
  formatarMoeda,
  listarRecolhimentos,
  referenciaRecolhimento,
  valorTotalRecolhimento,
  type ContribuinteRecolhimento,
} from "./recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function RecolhimentoMensalGTAPage({ onLogout, onNavigate }: Props) {
  const [contribuinte, setContribuinte] = useState<ContribuinteRecolhimento | null>(null);
  const [tipoPessoaContribuinte, setTipoPessoaContribuinte] = useState("Pessoa física");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pesquisou, setPesquisou] = useState(false);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  // 🌟 Filtro dinâmico de contribuintes para o modal (Física vs Jurídica)
  const contribuintesFiltrados = useMemo(() => {
    return CONTRIBUINTES_RECOLHIMENTO.filter((c) => {
      const doc = c.documento.replace(/\D/g, "");
      if (tipoPessoaContribuinte === "Pessoa física") return doc.length <= 11;
      if (tipoPessoaContribuinte === "Pessoa jurídica") return doc.length > 11;
      return true;
    });
  }, [tipoPessoaContribuinte]);

  const resultados = useMemo(() => listarRecolhimentos().filter((registro) =>
    (!contribuinte || registro.contribuinte.id === contribuinte.id) &&
    (!ano || registro.anoReferencia === Number(ano)) &&
    (!mes || registro.mesReferencia === Number(mes)) &&
    (!situacao || registro.situacao === situacao)
  ), [contribuinte, ano, mes, situacao, pesquisou]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const linhas = resultados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = resultados.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, resultados.length);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto max-w-[1300px] px-4 py-6 md:px-6">
        <button type="button" onClick={() => onNavigate("dashboard")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
          <ArrowLeft size={15} /> Inicial
        </button>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Recolhimento Mensal de GTAs</h1>
          </div>
          <button type="button" onClick={() => onNavigate("adicionar-recolhimento-mensal-gta")} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">
            Adicionar Novo
          </button>
        </div>

        <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* 🌟 CONTRIBUINTE COM SELECT DE TIPO DE PESSOA NO MODAL */}
            <EntitySearchInput
              label="Contribuinte"
              placeholder="Buscar por nome, CPF ou CNPJ"
              value={contribuinte?.nome ?? ""}
              data={contribuintesFiltrados}
              searchKeys={["nome", "documento", "tipo"]}
              columns={[{ label: "Nome / Razão Social", key: "nome" }, { label: "CPF / CNPJ", key: "documento" }]}
              icon={<User size={18} className="text-[#1A7A3C]" />}
              title="Buscar Contribuinte"
              subtitle="Busque por uma pessoa física ou jurídica cadastrada:"
              confirmLabel="Selecionar"
              onChange={setContribuinte}
              headerActions={
                <FloatSelect
                  label="Tipo de Pessoa"
                  required
                  value={tipoPessoaContribuinte}
                  onChange={(v) => setTipoPessoaContribuinte(v)}
                  options={[
                    { value: "Pessoa física", label: "Pessoa Física" },
                    { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
                  ]}
                />
              }
            />

            <FloatInput
              label="Ano para referência"
              value={ano}
              maxLength={4}
              onChange={(valor) => setAno(valor.replace(/\D/g, "").slice(0, 4))}
            />
            <FloatSelect label="Mês para referência" value={mes} onChange={setMes} options={MESES_OPTIONS} />
            <FloatSelect label="Situação" value={situacao} onChange={setSituacao} options={SITUACOES_OPTIONS} />
            <button type="button" onClick={() => { setPesquisou(true); setPagina(1); }} className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white hover:bg-[#15612F]">
              Pesquisar
            </button>
          </div>

          {!pesquisou ? (
            <div className="py-12 text-center text-sm text-gray-500">Busque por recolhimentos mensais utilizando os filtros acima.</div>
          ) : linhas.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Nenhum resultado foi encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {/* 🌟 Removida a coluna dedicada de CPF/CNPJ */}
                    {["Contribuinte", "Mês e ano para referência", "Valor", "Situação"].map((titulo) => (
                      <th key={titulo} className="whitespace-nowrap px-3 py-3 text-left font-semibold uppercase text-gray-600">{titulo}</th>
                    ))}
                    <th className="w-[100px] px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((registro) => (
                    <tr key={registro.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                      {/* 🌟 CPF/CNPJ na primeira linha e Nome na linha de baixo */}
                      <td className="px-3 py-3 text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-500">{registro.contribuinte.documento}</span>
                          <span className="text-medium text-gray-500">{registro.contribuinte.nome}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">{referenciaRecolhimento(registro)}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-500">{formatarMoeda(valorTotalRecolhimento(registro))}</td>
                      <td className="px-3 py-3 text-gray-500">{registro.situacao}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" title="Visualizar" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registro)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Eye size={18} /></button>
                          <button type="button" title="Editar" onClick={() => onNavigate("editar-recolhimento-mensal-gta", registro)} className="rounded-md p-2 text-[#1A7A3C] hover:bg-green-50"><Pencil size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
                <span>Itens por página: {porPagina}</span>
                <div className="flex items-center gap-3">
                  <span>{inicio} - {fim} de {resultados.length}</span>
                  <button type="button" disabled={paginaAtual === 1} onClick={() => setPagina((valor) => Math.max(1, valor - 1))} className="disabled:opacity-30"><ChevronLeft size={18} /></button>
                  <button type="button" disabled={paginaAtual === totalPaginas} onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))} className="disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}