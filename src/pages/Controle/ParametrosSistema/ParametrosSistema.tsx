import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignLeft,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Hash,
  Layers,
  List,
  ListPlus,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  SlidersHorizontal,
  ToggleLeft,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CustomButton,
  FloatSelect,
  LargeTextArea,
  FloatInput,
  SimNao,
} from "../../../components/ui/FormKit";
import {
  CADASTROS_COM_PARAMETROS,
  listarParametrosSistema,
  ordenarParametrosParaPrimeiraPagina,
  parametrosSaoDiferentes,
  salvarParametrosSistema,
  validarParametroSistema,
  type CadastroParametroId,
  type ParametroSistema,
  type TipoValorParametro,
} from "./parametrosSistemaData";

interface ParametrosSistemaPageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const SITUACOES_FILTRO = [
  { value: "Todas", label: "Todas" },
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

const ITENS_POR_PAGINA = 6;

const CORES_AVATAR = ["#1A7A3C", "#1D4ED8", "#B45309", "#BE185D", "#7C3AED", "#0F766E"];

interface EstiloTipoParametro {
  Icon: LucideIcon;
  bg: string;
  fg: string;
}

/** Paleta semântica única para identificar o tipo de valor em todos os cards. */
function obterEstiloTipo(tipo: TipoValorParametro): EstiloTipoParametro {
  switch (tipo) {
    case "texto":
      return { Icon: FileText, bg: "bg-[#E6F4EA]", fg: "text-[#1A7A3C]" };
    case "texto-longo":
      return { Icon: AlignLeft, bg: "bg-[#E6F4EA]", fg: "text-[#1A7A3C]" };
    case "sim-nao":
      return { Icon: ToggleLeft, bg: "bg-[#CCFBF1]", fg: "text-[#0F766E]" };
    case "situacao":
      return { Icon: ToggleLeft, bg: "bg-[#E6F4EA]", fg: "text-[#1A7A3C]" };
    case "numero":
      return { Icon: Hash, bg: "bg-[#E8F0FE]", fg: "text-[#1D4ED8]" };
    case "lista":
      return { Icon: List, bg: "bg-[#F3E8FF]", fg: "text-[#7C3AED]" };
    case "data":
      return { Icon: Calendar, bg: "bg-[#FEF3C7]", fg: "text-[#B45309]" };
    default:
      return { Icon: FileText, bg: "bg-gray-100", fg: "text-gray-600" };
  }
}

const LEGENDA_TIPOS: { tipo: TipoValorParametro; label: string }[] = [
  { tipo: "texto", label: "Texto" },
  { tipo: "numero", label: "Número" },
  { tipo: "data", label: "Data" },
  { tipo: "lista", label: "Lista" },
  { tipo: "sim-nao", label: "Sim/Não" },
];

function AvatarIniciais({ nome }: { nome: string }) {
  const iniciais = nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const cor = CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length];
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
      style={{ backgroundColor: cor }}
    >
      {iniciais}
    </div>
  );
}

function SituacaoSwitch({
  situacao,
  onChange,
  label = "Situação do parâmetro",
}: {
  situacao: "Ativo" | "Inativo";
  onChange: (situacao: "Ativo" | "Inativo") => void;
  label?: string;
}) {
  const ativo = situacao === "Ativo";
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-center gap-3 select-none flex-shrink-0">
        <span className={`text-xs font-semibold ${!ativo ? "text-red-600" : "text-gray-400"}`}>Inativo</span>
        <button
          type="button"
          role="switch"
          aria-checked={ativo}
          aria-label={`${label}: ${situacao}`}
          onClick={() => onChange(ativo ? "Inativo" : "Ativo")}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            ativo ? "bg-[#1A7A3C] focus-visible:ring-[#1A7A3C]" : "bg-red-600 focus-visible:ring-red-600"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              ativo ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-xs font-semibold ${ativo ? "text-[#1A7A3C]" : "text-gray-400"}`}>Ativo</span>
      </div>
    </div>
  );
}

function EditorLista({
  parametro,
  onChange,
}: {
  parametro: ParametroSistema;
  onChange: (valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [itens, setItens] = useState<string[]>([]);
  const [valorItem, setValorItem] = useState("");
  const [indiceEdicao, setIndiceEdicao] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const listaDeEmails = parametro.nome.toLowerCase().includes("email");

  const separarItens = (valor: string) =>
    valor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const abrir = () => {
    setItens(separarItens(parametro.valor));
    setValorItem("");
    setIndiceEdicao(null);
    setErro("");
    setAberto(true);
  };

  const fechar = () => {
    setAberto(false);
    setValorItem("");
    setIndiceEdicao(null);
    setErro("");
  };

  const salvarItem = () => {
    const valor = valorItem.trim();
    if (!valor) {
      setErro(listaDeEmails ? "Informe um e-mail." : "Informe um item para a lista.");
      return;
    }
    if (valor.includes(",")) {
      setErro("Cadastre um item por vez, sem vírgulas.");
      return;
    }
    if (listaDeEmails && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    const duplicado = itens.some(
      (item, indice) => item.toLocaleLowerCase("pt-BR") === valor.toLocaleLowerCase("pt-BR") && indice !== indiceEdicao,
    );
    if (duplicado) {
      setErro(listaDeEmails ? "Este e-mail já está na lista." : "Este item já está na lista.");
      return;
    }

    setItens((atuais) =>
      indiceEdicao === null
        ? [...atuais, valor]
        : atuais.map((item, indice) => (indice === indiceEdicao ? valor : item)),
    );
    setValorItem("");
    setIndiceEdicao(null);
    setErro("");
  };

  const editarItem = (indice: number) => {
    setValorItem(itens[indice]);
    setIndiceEdicao(indice);
    setErro("");
  };

  const removerItem = (indice: number) => {
    setItens((atuais) => atuais.filter((_, itemIndice) => itemIndice !== indice));
    if (indiceEdicao === indice) {
      setValorItem("");
      setIndiceEdicao(null);
    } else if (indiceEdicao !== null && indiceEdicao > indice) {
      setIndiceEdicao(indiceEdicao - 1);
    }
    setErro("");
  };

  const itensAtuais = separarItens(parametro.valor);
  return (
    <>
      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{listaDeEmails ? "Lista de e-mails" : "Itens da lista"}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {itensAtuais.length} {itensAtuais.length === 1 ? "item cadastrado" : "itens cadastrados"}
          </p>
        </div>
        <button
          type="button"
          onClick={abrir}
          className="h-10 px-3 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 flex items-center gap-2 flex-shrink-0"
        >
          <ListPlus size={16} /> Gerenciar
        </button>
      </div>

      {aberto && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 p-4">
          <style>{`
            .lista-parametros-scroll {
              scrollbar-width: auto;
              scrollbar-color: #9ca3af #f3f4f6;
            }
            .lista-parametros-scroll::-webkit-scrollbar { width: 10px; }
            .lista-parametros-scroll::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 999px; }
            .lista-parametros-scroll::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 999px; border: 2px solid #f3f4f6; }
            .lista-parametros-scroll::-webkit-scrollbar-thumb:hover { background: #6b7280; }
          `}</style>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] min-h-0 overflow-hidden flex flex-col">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                  {listaDeEmails ? <Mail size={20} /> : <List size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {listaDeEmails ? "Gerenciar e-mails" : "Gerenciar itens da lista"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">Adicione, edite ou remova os valores deste parâmetro.</p>
                </div>
              </div>
              <button type="button" onClick={fechar} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto min-h-0 flex flex-col gap-5 lista-parametros-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
                <div>
                  <FloatInput
                    label={listaDeEmails ? "E-mail" : "Item da lista"}
                    value={valorItem}
                    onChange={(valor) => {
                      setValorItem(valor);
                      setErro("");
                    }}
                    type={listaDeEmails ? "email" : "text"}
                  />
                  {erro && <p className="text-xs text-red-600 mt-1.5" role="alert">{erro}</p>}
                </div>
                <button
                  type="button"
                  onClick={salvarItem}
                  className="h-12 px-4 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {indiceEdicao === null ? <Plus size={17} /> : <Check size={17} />}
                  {indiceEdicao === null ? "Adicionar" : "Salvar item"}
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-scroll lista-parametros-scroll">
                {itens.length === 0 ? (
                  <div className="py-10 px-4 text-center text-sm text-gray-500">Nenhum item cadastrado.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {itens.map((item, indice) => (
                      <li key={`${item}-${indice}`} className="flex items-center justify-between gap-3 px-4 py-3">
                        <span className="text-sm text-gray-700 break-all">{item}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button type="button" onClick={() => editarItem(indice)} className="p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md" aria-label={`Editar ${item}`}>
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => removerItem(indice)} className="p-2 text-red-600 hover:bg-red-50 rounded-md" aria-label={`Remover ${item}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button type="button" onClick={fechar} className="h-11 px-5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(itens.join(","));
                  fechar();
                }}
                className="h-11 px-5 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold"
              >
                Aplicar lista
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ControleValor({
  parametro,
  onChange,
}: {
  parametro: ParametroSistema;
  onChange: (valor: string) => void;
}) {
  if (parametro.tipo === "sim-nao") {
    return (
      <div className="bg-gray-50 rounded-lg px-4 py-3">
        <SimNao
          label="Valor do parâmetro"
          name={`valor-${parametro.id}`}
          value={parametro.valor}
          onChange={(checked) => onChange(checked ? "Sim" : "Não")}
        />
      </div>
    );
  }

  if (parametro.tipo === "situacao") {
    return (
      <SituacaoSwitch
        label="Estado da funcionalidade"
        situacao={parametro.valor as "Ativo" | "Inativo"}
        onChange={onChange}
      />
    );
  }

  if (parametro.tipo === "lista") {
    return <EditorLista parametro={parametro} onChange={onChange} />;
  }

  if (parametro.tipo === "numero") {
    return (
      <div className="bg-gray-50 rounded-lg px-4 py-3">
        <FloatInput label="Valor do parâmetro" value={parametro.valor} onChange={onChange} type="number" />
      </div>
    );
  }

  if (parametro.tipo === "texto-longo") {
    return (
      <div className="bg-gray-50 rounded-lg px-4 py-3">
        <LargeTextArea label="Valor do parâmetro" value={parametro.valor} onChange={onChange} rows={3} maxLength={1500} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3">
      <FloatInput
        label="Valor do parâmetro"
        value={parametro.valor}
        onChange={onChange}
        type={parametro.tipo === "data" ? "date" : parametro.nome.toLowerCase().includes("url") ? "url" : "text"}
      />
    </div>
  );
}

export function ParametrosSistemaPage({ onLogout, onNavigate }: ParametrosSistemaPageProps) {
  const [parametros, setParametros] = useState(() =>
    ordenarParametrosParaPrimeiraPagina(listarParametrosSistema()),
  );
  const [parametrosSalvos, setParametrosSalvos] = useState(() =>
    ordenarParametrosParaPrimeiraPagina(listarParametrosSistema()),
  );
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("Todas");
  const [modulosSelecionados, setModulosSelecionados] = useState<Set<CadastroParametroId>>(
    () => new Set(CADASTROS_COM_PARAMETROS.map((item) => item.id)),
  );
  const [dropdownModulosAberto, setDropdownModulosAberto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [quantidadeSalva, setQuantidadeSalva] = useState(0);
  const [sucessoAberto, setSucessoAberto] = useState(false);
  const [confirmacaoSaidaAberta, setConfirmacaoSaidaAberta] = useState(false);
  const acaoSaidaPendente = useRef<(() => void) | null>(null);

  const alterados = useMemo(() => {
    const salvosPorId = new Map(parametrosSalvos.map((item) => [item.id, item]));
    return new Set(
      parametros
        .filter((item) => {
          const salvo = salvosPorId.get(item.id);
          return parametrosSaoDiferentes(item, salvo);
        })
        .map((item) => item.id),
    );
  }, [parametros, parametrosSalvos]);

  useEffect(() => {
    const avisarAntesDeSair = (evento: BeforeUnloadEvent) => {
      if (!alterados.size) return;
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", avisarAntesDeSair);
    return () => window.removeEventListener("beforeunload", avisarAntesDeSair);
  }, [alterados.size]);

  const todosModulosSelecionados = modulosSelecionados.size === CADASTROS_COM_PARAMETROS.length;

  const rotuloModulos = (() => {
    if (todosModulosSelecionados) return "Todos os Módulos";
    if (modulosSelecionados.size === 0) return "Nenhum módulo";
    if (modulosSelecionados.size === 1) {
      const unico = CADASTROS_COM_PARAMETROS.find((item) => modulosSelecionados.has(item.id));
      return unico?.label ?? "1 módulo";
    }
    return `${modulosSelecionados.size} módulos selecionados`;
  })();

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return parametros.filter((item) => {
      if (!modulosSelecionados.has(item.cadastroId)) return false;
      const correspondeSituacao = situacao === "Todas" || item.situacao === situacao;
      if (!correspondeSituacao) return false;
      if (!termo) return true;
      const moduloLabel = CADASTROS_COM_PARAMETROS.find((cadastro) => cadastro.id === item.cadastroId)?.label ?? "";
      const texto = [item.nome, item.descricao, item.funcionalidade, item.campo, moduloLabel]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return texto.includes(termo);
    });
  }, [busca, modulosSelecionados, parametros, situacao]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = filtrados.length ? (paginaAtual - 1) * ITENS_POR_PAGINA + 1 : 0;
  const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, filtrados.length);
  const itensPagina = filtrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA,
  );

  const alternarModulo = (id: CadastroParametroId) => {
    setModulosSelecionados((atuais) => {
      const novo = new Set(atuais);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
    setPagina(1);
  };

  const selecionarTodosModulos = () => {
    setModulosSelecionados(new Set(CADASTROS_COM_PARAMETROS.map((item) => item.id)));
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
    setErros((atuais) => {
      if (!atuais[id]) return atuais;
      const novos = { ...atuais };
      delete novos[id];
      return novos;
    });
  };

  const alterarSituacao = (id: string, situacaoParametro: string) => {
    setParametros((atuais) =>
      atuais.map((item) => {
        if (item.id !== id) return item;
        const novaSituacao = situacaoParametro as "Ativo" | "Inativo";
        return item.tipo === "situacao"
          ? { ...item, valor: novaSituacao, situacao: novaSituacao }
          : { ...item, situacao: novaSituacao };
      }),
    );
    setErros((atuais) => {
      if (!atuais[id]) return atuais;
      const novos = { ...atuais };
      delete novos[id];
      return novos;
    });
  };

  const salvar = () => {
    if (!alterados.size) return;
    const registrosAlterados = parametros.filter((item) => alterados.has(item.id));
    const novosErros = Object.fromEntries(
      registrosAlterados
        .map((item) => [item.id, validarParametroSistema(item)] as const)
        .filter((entrada): entrada is readonly [string, string] => Boolean(entrada[1])),
    );
    if (Object.keys(novosErros).length) {
      setErros(novosErros);
      const primeiroIdComErro = Object.keys(novosErros)[0];
      const indice = parametros.findIndex((item) => item.id === primeiroIdComErro);
      setBusca("");
      setSituacao("Todas");
      setModulosSelecionados(new Set(CADASTROS_COM_PARAMETROS.map((item) => item.id)));
      setPagina(Math.floor(indice / ITENS_POR_PAGINA) + 1);
      window.setTimeout(() => {
        document.getElementById(`parametro-${primeiroIdComErro}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      return;
    }
    salvarParametrosSistema(registrosAlterados);
    const idsSalvos = new Set(registrosAlterados.map((item) => item.id));
    const parametrosAtualizados = parametros.map((item) =>
      idsSalvos.has(item.id) ? { ...item, modificadoEm: "Agora mesmo" } : item,
    );
    setParametros(parametrosAtualizados);
    setParametrosSalvos(parametrosAtualizados.map((item) => ({ ...item })));
    setQuantidadeSalva(registrosAlterados.length);
    setErros({});
    setSucessoAberto(true);
  };

  const solicitarConfirmacaoSaida = (acao: () => void) => {
    if (!alterados.size) {
      acao();
      return;
    }
    acaoSaidaPendente.current = acao;
    setConfirmacaoSaidaAberta(true);
  };

  const cancelarSaida = () => {
    acaoSaidaPendente.current = null;
    setConfirmacaoSaidaAberta(false);
  };

  const confirmarSaidaSemSalvar = () => {
    const acao = acaoSaidaPendente.current;
    acaoSaidaPendente.current = null;
    setConfirmacaoSaidaAberta(false);
    acao?.();
  };

  const navegarComConfirmacao = (screen: any, data?: any) => {
    solicitarConfirmacaoSaida(() => onNavigate(screen, data));
  };

  const sairComConfirmacao = () => {
    solicitarConfirmacaoSaida(onLogout);
  };

  const obterBreadcrumb = (parametro: ParametroSistema) => {
    if (parametro.funcionalidade) return `GTA / ${parametro.funcionalidade}`;
    const modulo = CADASTROS_COM_PARAMETROS.find((item) => item.id === parametro.cadastroId);
    return (modulo?.label ?? "").replace(" — ", " / ");
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-16">
      <Navbar
        onLogout={sairComConfirmacao}
        onNavigate={navegarComConfirmacao}
        currentScreen="parametros-sistema"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={() => navegarComConfirmacao("dashboard")}
            className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]"
          >
            <ArrowLeft size={15} />
            Inicial
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Parâmetros</h1>
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
            <h2 className="text-base font-semibold text-gray-800">Buscar parâmetros</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_16rem] gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(evento) => {
                    setBusca(evento.target.value);
                    setPagina(1);
                  }}
                  placeholder="Busque por nome, módulo ou campo..."
                  className="w-full h-12 pl-11 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/20 focus:border-[#1A7A3C] transition"
                />
              </div>

              <FloatSelect
                label="Situação"
                value={situacao}
                onChange={(valor) => {
                  setSituacao(valor);
                  setPagina(1);
                }}
                options={SITUACOES_FILTRO}
              />

              <div className="relative sm:w-64">
                <button
                  type="button"
                  onClick={() => setDropdownModulosAberto((aberto) => !aberto)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 flex items-center justify-between gap-2 hover:border-gray-300 transition"
                >
                  <span className="truncate">{rotuloModulos}</span>
                  <SlidersHorizontal size={16} className="text-gray-400 flex-shrink-0" />
                </button>

                {dropdownModulosAberto && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownModulosAberto(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Módulos</span>
                        <button
                          type="button"
                          onClick={selecionarTodosModulos}
                          className="text-xs font-semibold text-[#1A7A3C] hover:underline"
                        >
                          Selecionar todos
                        </button>
                      </div>
                      {CADASTROS_COM_PARAMETROS.map((modulo) => (
                        <label
                          key={modulo.id}
                          className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={modulosSelecionados.has(modulo.id)}
                            onChange={() => alternarModulo(modulo.id)}
                            className="accent-[#1A7A3C] w-4 h-4"
                          />
                          {modulo.label}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legenda de cores dos tipos de parâmetro">
              <span className="text-xs font-medium text-gray-500">Dev Cores por tipo:</span>
              {LEGENDA_TIPOS.map((item) => {
                const estilo = obterEstiloTipo(item.tipo);
                return (
                  <span key={item.tipo} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${estilo.bg}`}>
                      <estilo.Icon size={13} className={estilo.fg} />
                    </span>
                    {item.label}
                  </span>
                );
              })}
            </div>

          </div>

          <div className="flex flex-col gap-5 border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-500">
              {filtrados.length} {filtrados.length === 1 ? "parâmetro encontrado" : "parâmetros encontrados"}
            </p>

            {modulosSelecionados.size === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Selecione ao menos um módulo para visualizar os parâmetros.
              </div>
            ) : itensPagina.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Nenhum parâmetro foi encontrado para os filtros informados.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {itensPagina.map((parametro) => {
                    const icone = obterEstiloTipo(parametro.tipo);
                    return (
                      <article
                        key={parametro.id}
                        id={`parametro-${parametro.id}`}
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${icone.bg}`}>
                              <icone.Icon size={20} className={icone.fg} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-[15px] font-semibold leading-snug text-gray-900">
                                {parametro.descricao}
                              </h3>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Layers size={11} className="flex-shrink-0" />
                                <span className="truncate">{obterBreadcrumb(parametro)}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <ControleValor parametro={parametro} onChange={(valor) => alterarValor(parametro.id, valor)} />

                        {parametro.tipo !== "situacao" && (
                          <SituacaoSwitch
                            situacao={parametro.situacao}
                            onChange={(valor) => alterarSituacao(parametro.id, valor)}
                          />
                        )}

                        {erros[parametro.id] && (
                          <p className="text-xs text-red-600 font-medium" role="alert">
                            {erros[parametro.id]}
                          </p>
                        )}

                        {alterados.has(parametro.id) && (
                          <p className="text-xs text-[#1A7A3C] font-medium -mt-2">Alteração ainda não salva</p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <AvatarIniciais nome={parametro.modificadoPor} />
                            <span className="text-xs text-gray-500 truncate">
                              Modificado por {parametro.modificadoPor}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{parametro.modificadoEm}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>

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
        </section>
      </main>

      {confirmacaoSaidaAberta && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={27} className="text-amber-700" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Alterações não salvas</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Existem alterações pendentes. Se você sair agora, elas serão descartadas.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={cancelarSaida}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40"
              >
                Continuar editando
              </button>
              <button
                type="button"
                onClick={confirmarSaidaSemSalvar}
                className="px-5 h-11 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
              >
                Sair sem salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {sucessoAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Parâmetros atualizados com sucesso!
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
