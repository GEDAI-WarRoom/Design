import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Eye, Info, User } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  CONTRIBUINTES_RECOLHIMENTO,
  MESES_OPTIONS,
  criarRecolhimento,
  type ContribuinteRecolhimento,
  type RecolhimentoMensalGTA,
} from "./recolhimentoMensalGTAData";

interface Props {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  onViewPessoa?: (pessoa: ContribuinteRecolhimento) => void;
}

export function AdicionarRecolhimentoMensalGTAPage({ onLogout, onNavigate, onViewPessoa }: Props) {
  const [contribuinte, setContribuinte] = useState<ContribuinteRecolhimento | null>(null);
  const [tipoPessoaContribuinte, setTipoPessoaContribuinte] = useState("Pessoa física");
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");
  const [secaoAberta, setSecaoAberta] = useState(true);
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<RecolhimentoMensalGTA | null>(null);

  // 🌟 Filtro dinâmico de contribuintes para o modal (Física vs Jurídica)
  const contribuintesFiltrados = useMemo(() => {
    return CONTRIBUINTES_RECOLHIMENTO.filter((c) => {
      const doc = c.documento.replace(/\D/g, "");
      if (tipoPessoaContribuinte === "Pessoa física") return doc.length <= 11;
      if (tipoPessoaContribuinte === "Pessoa jurídica") return doc.length > 11;
      return true;
    });
  }, [tipoPessoaContribuinte]);

  // 🌟 Rótulo dinâmico baseado no tipo de pessoa
  const labelDocumento = tipoPessoaContribuinte === "Pessoa física" ? "CPF" : "CNPJ";

  const anoValido = /^\d{4}$/.test(ano);
  const formularioValido = Boolean(contribuinte && anoValido && mes);

  const adicionar = () => {
    setTentouSalvar(true);
    if (!formularioValido || !contribuinte) return;
    setRegistroSalvo(criarRecolhimento({
      contribuinte,
      anoReferencia: Number(ano),
      mesReferencia: Number(mes),
    }));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="recolhimento-mensal-gta" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("recolhimento-mensal-gta")} className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Todos os Recolhimentos Mensais de GTAs
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Recolhimento Mensal de GTAs</h1>
            <button type="button" onClick={adicionar} className="rounded-md bg-[#1A7A3C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#15612F]">Adicionar</button>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="flex-shrink-0 text-gray-500 stroke-[2.5]" />
          <p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p>
        </div>

        <section className="overflow-visible rounded-xl bg-white shadow-sm">
          <button type="button" onClick={() => setSecaoAberta((aberta) => !aberta)} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50">
            <span className="text-base font-semibold text-gray-800">Informações Básicas</span>
            {secaoAberta ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          {secaoAberta && (
            <div className="border-t border-gray-100 px-6 pb-6 pt-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* 🌟 CONTRIBUINTE + CPF/CNPJ + OLHINHO */}
                <div className="md:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <EntitySearchInput
                      label="Contribuinte"
                      placeholder="Buscar por nome, CPF ou CNPJ"
                      required
                      value={contribuinte?.nome ?? ""}
                      data={contribuintesFiltrados}
                      searchKeys={["nome", "documento", "tipo"]}
                      columns={[
                        { label: "Nome / Razão Social", key: "nome" },
                        { label: labelDocumento, key: "documento" },
                      ]}
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
                          onChange={(v) => {
                            setTipoPessoaContribuinte(v);
                            setContribuinte(null); // Reseta para evitar conflitos de PF/PJ
                          }}
                          options={[
                            { value: "Pessoa física", label: "Pessoa Física" },
                            { value: "Pessoa jurídica", label: "Pessoa Jurídica" },
                          ]}
                        />
                      }
                    />
                  </div>

                  {/* CPF/CNPJ Dinâmico Desabilitado + Olhinho */}
                  {contribuinte && (
                    <>
                      <div className="flex-1">
                        <FloatInput
                          label={`${labelDocumento} Contribuinte`}
                          value={contribuinte.documento}
                          disabled
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => contribuinte && onViewPessoa?.(contribuinte)}
                        className="h-12 w-12 flex items-center justify-center rounded-md text-[#1A7A3C] hover:bg-green-50 transition shrink-0"
                        title="Visualizar Detalhes do Contribuinte"
                      >
                        <Eye size={20} />
                      </button>
                    </>
                  )}
                </div>

                <FloatInput
                  label="Ano para referência"
                  required
                  value={ano}
                  maxLength={4}
                  onChange={(valor) => setAno(valor.replace(/\D/g, "").slice(0, 4))}
                />
                <FloatSelect label="Mês para referência" required value={mes} onChange={setMes} options={MESES_OPTIONS} />
              </div>
              {tentouSalvar && !formularioValido && (
                <p className="mt-4 text-sm font-medium text-red-500">
                  {!anoValido && ano ? "O ano para referência deve possuir 4 caracteres. " : ""}
                  Preencha os campos obrigatórios para continuar.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Recolhimento mensal de GTAs cadastrado com sucesso!</h2>
            <p className="mt-1 text-sm text-gray-500">O recolhimento de {registroSalvo.contribuinte.nome} foi cadastrado.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => onNavigate("recolhimento-mensal-gta")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50/40">Voltar</button>
              <button type="button" onClick={() => onNavigate("visualizar-recolhimento-mensal-gta", registroSalvo)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}