import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Settings2,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CustomButton,
  FloatCombobox,
  FloatInput,
  FloatSelect,
  LargeTextArea,
} from "../../../components/ui/FormKit";
import {
  CADASTROS_COM_PARAMETROS,
  listarParametrosSistema,
  salvarParametrosSistema,
  type CadastroParametroId,
  type ParametroSistema,
} from "./parametrosSistemaData";

interface ParametrosSistemaPageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const SITUACOES = [
  { value: "", label: "Todas" },
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

const STATUS = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const ITENS_POR_PAGINA = 6;

function EditorValor({
  parametro,
  onChange,
}: {
  parametro: ParametroSistema;
  onChange: (valor: string) => void;
}) {
  if (parametro.tipo === "sim-nao") {
    return (
      <FloatSelect
        label="Valor do parâmetro"
        value={parametro.valor}
        onChange={onChange}
        options={SIM_NAO}
      />
    );
  }

  if (parametro.tipo === "situacao") {
    return (
      <FloatSelect
        label="Valor da funcionalidade"
        value={parametro.valor}
        onChange={onChange}
        options={STATUS}
      />
    );
  }

  if (parametro.tipo === "texto-longo") {
    return (
      <LargeTextArea
        label="Valor do parâmetro"
        value={parametro.valor}
        onChange={onChange}
        rows={3}
        maxLength={1500}
      />
    );
  }

  return (
    <FloatInput
      label={parametro.tipo === "lista" ? "Valores (separados por vírgula)" : "Valor do parâmetro"}
      value={parametro.valor}
      onChange={onChange}
      type={parametro.tipo === "data" ? "date" : parametro.tipo === "numero" ? "number" : "text"}
    />
  );
}

export function ParametrosSistemaPage({ onLogout, onNavigate }: ParametrosSistemaPageProps) {
  const [parametros, setParametros] = useState(() => listarParametrosSistema());
  const [cadastro, setCadastro] = useState("");
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [pagina, setPagina] = useState(1);
  const [alterados, setAlterados] = useState<Set<string>>(() => new Set());
  const [quantidadeSalva, setQuantidadeSalva] = useState(0);
  const [sucessoAberto, setSucessoAberto] = useState(false);

  const cadastroSelecionado = CADASTROS_COM_PARAMETROS.find((item) => item.label === cadastro);

  const filtrados = useMemo(() => {
    if (!cadastroSelecionado) return [];
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return parametros.filter((item) => {
      if (item.cadastroId !== cadastroSelecionado.id) return false;
      const correspondeSituacao = !situacao || item.situacao === situacao;
      const texto = [item.nome, item.descricao, item.funcionalidade, item.campo]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return correspondeSituacao && (!termo || texto.includes(termo));
    });
  }, [busca, cadastroSelecionado, parametros, situacao]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = filtrados.length ? (paginaAtual - 1) * ITENS_POR_PAGINA + 1 : 0;
  const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, filtrados.length);
  const itensPagina = filtrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA,
  );

  const selecionarCadastro = (valor: string) => {
    setCadastro(valor);
    setBusca("");
    setSituacao("");
    setPagina(1);
  };

  const alterarValor = (id: string, valor: string) => {
    setParametros((atuais) =>
      atuais.map((item) => {
        if (item.id !== id) return item;
        if (item.tipo === "situacao") {
          return { ...item, valor, situacao: valor as "Ativo" | "Inativo" };
        }
        return { ...item, valor };
      }),
    );
    setAlterados((atuais) => new Set(atuais).add(id));
  };

  const limparFiltros = () => {
    setBusca("");
    setSituacao("");
    setPagina(1);
  };

  const salvar = () => {
    if (!alterados.size) return;
    const registrosAlterados = parametros.filter((item) => alterados.has(item.id));
    salvarParametrosSistema(registrosAlterados);
    setQuantidadeSalva(registrosAlterados.length);
    setAlterados(new Set());
    setSucessoAberto(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="parametros-sistema"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Parâmetros do sistema</h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure os valores utilizados pelas funcionalidades do Sidagro.
              </p>
            </div>
            <CustomButton onClick={salvar} disabled={!alterados.size} icon={<Save size={17} />}>
              Salvar alterações{alterados.size ? ` (${alterados.size})` : ""}
            </CustomButton>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Seleção do cadastro</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Selecione o cadastro para visualizar os parâmetros disponíveis para edição.
            </p>
            <div className="max-w-xl">
              <FloatCombobox
                label="Cadastro"
                value={cadastro}
                onChange={selecionarCadastro}
                options={CADASTROS_COM_PARAMETROS.map((item) => item.label)}
                required
              />
            </div>
          </div>

          {!cadastroSelecionado ? (
            <div className="border border-dashed border-gray-300 rounded-xl py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-3">
                <Settings2 size={24} className="text-[#1A7A3C]" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Nenhum cadastro selecionado</p>
              <p className="text-sm text-gray-500 mt-1">
                Os parâmetros editáveis serão exibidos aqui após a seleção.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 border-t border-gray-100 pt-5">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Parâmetros disponíveis</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filtrados.length} {filtrados.length === 1 ? "parâmetro encontrado" : "parâmetros encontrados"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(240px,1fr)_180px_auto] gap-3 w-full lg:w-auto">
                  <FloatInput
                    label="Buscar por nome ou descrição"
                    value={busca}
                    onChange={(valor) => {
                      setBusca(valor);
                      setPagina(1);
                    }}
                  />
                  <FloatSelect
                    label="Situação"
                    value={situacao}
                    onChange={(valor) => {
                      setSituacao(valor);
                      setPagina(1);
                    }}
                    options={SITUACOES}
                  />
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="h-12 px-4 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Limpar
                  </button>
                </div>
              </div>

              {itensPagina.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  Nenhum parâmetro foi encontrado para os filtros informados.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {itensPagina.map((parametro) => (
                    <article
                      key={parametro.id}
                      className="border border-gray-200 rounded-xl p-4 md:p-5 hover:border-gray-300 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 break-all">{parametro.nome}</h3>
                          {(parametro.funcionalidade || parametro.campo) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {parametro.funcionalidade && `Funcionalidade: ${parametro.funcionalidade}`}
                              {parametro.funcionalidade && parametro.campo && "  •  "}
                              {parametro.campo && `Campo: ${parametro.campo}`}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-gray-600 flex-shrink-0">{parametro.situacao}</span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{parametro.descricao}</p>
                      <EditorValor
                        parametro={parametro}
                        onChange={(valor) => alterarValor(parametro.id, valor)}
                      />
                      {alterados.has(parametro.id) && (
                        <p className="text-xs text-[#1A7A3C] font-medium mt-2">
                          Alteração ainda não salva
                        </p>
                      )}
                    </article>
                  ))}

                  <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
                    <span>Itens por página: {ITENS_POR_PAGINA}</span>
                    <div className="flex items-center gap-4">
                      <span>{inicio} - {fim} de {filtrados.length}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPagina((valor) => Math.max(1, valor - 1))}
                          disabled={paginaAtual === 1}
                          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Página anterior"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPagina((valor) => Math.min(totalPaginas, valor + 1))}
                          disabled={paginaAtual === totalPaginas}
                          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Próxima página"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {sucessoAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Parâmetros do sistema atualizados com sucesso!
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {quantidadeSalva} {quantidadeSalva === 1 ? "parâmetro foi atualizado" : "parâmetros foram atualizados"}.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setSucessoAberto(false)}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold"
              >
                Continuar editando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
