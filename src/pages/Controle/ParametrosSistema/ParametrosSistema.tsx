import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Layers,
  List,
  Save,
  Search,
  SlidersHorizontal,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CustomButton,
  FloatSelect,
  LargeTextArea,
  FloatInput,
} from "../../../components/ui/FormKit";
import {
  CADASTROS_COM_PARAMETROS,
  calcularFaixaNumero,
  listarParametrosSistema,
  salvarParametrosSistema,
  type CadastroParametroId,
  type FaixaNumero,
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

const ITENS_POR_PAGINA = 6;

const CORES_AVATAR = ["#1A7A3C", "#1D4ED8", "#B45309", "#BE185D", "#7C3AED", "#0F766E"];

/** Ícone e paleta do card, definidos pelo tipo de valor do parâmetro. */
function obterIcone(parametro: ParametroSistema): { Icon: LucideIcon; bg: string; fg: string } {
  switch (parametro.tipo) {
    case "sim-nao":
      return { Icon: Bell, bg: "bg-[#E6F4EA]", fg: "text-[#1A7A3C]" };
    case "situacao":
      return { Icon: ToggleLeft, bg: "bg-[#E6F4EA]", fg: "text-[#1A7A3C]" };
    case "numero": {
      const nome = parametro.nome.toLowerCase();
      if (nome.includes("hora")) return { Icon: Clock, bg: "bg-[#E8F0FE]", fg: "text-[#1D4ED8]" };
      if (nome.startsWith("vl")) return { Icon: DollarSign, bg: "bg-[#E8F0FE]", fg: "text-[#1D4ED8]" };
      return { Icon: Calendar, bg: "bg-[#E8F0FE]", fg: "text-[#1D4ED8]" };
    }
    case "lista":
      return { Icon: List, bg: "bg-[#F3E8FF]", fg: "text-[#7C3AED]" };
    case "data":
      return { Icon: Calendar, bg: "bg-[#FEF3C7]", fg: "text-[#B45309]" };
    default:
      return { Icon: FileText, bg: "bg-[#FCE7F3]", fg: "text-[#BE185D]" };
  }
}

function BadgeSituacao({ situacao }: { situacao: "Ativo" | "Inativo" }) {
  if (situacao === "Ativo") {
    return (
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#1A7A3C] bg-[#E6F4EA] px-2.5 py-1 rounded-full flex-shrink-0">
        Ativo
      </span>
    );
  }
  return (
    <span className="text-[11px] font-bold uppercase tracking-wide text-[#B91C1C] bg-[#FEE2E2] px-2.5 py-1 rounded-full flex-shrink-0">
      Inativo
    </span>
  );
}

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

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#1A7A3C]" : "bg-gray-300"
        }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

function SliderNumero({
  valor,
  onChange,
  faixa,
}: {
  valor: string;
  onChange: (valor: string) => void;
  faixa: FaixaNumero;
}) {
  const numero = Number(valor) || 0;
  const sufixo = faixa.unidade ? ` ${faixa.unidade}` : "";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Valor do parâmetro</span>
        <span className="text-base font-bold text-[#1A7A3C]">
          {numero}
          {sufixo}
        </span>
      </div>
      <input
        type="range"
        min={faixa.min}
        max={faixa.max}
        step={faixa.step}
        value={numero}
        onChange={(evento) => onChange(evento.target.value)}
        className="w-full accent-[#1A7A3C]"
      />
      <div className="flex justify-between text-[11px] text-gray-400 mt-1">
        <span>
          {faixa.min}
          {sufixo}
          {faixa.rotuloMin ? ` (${faixa.rotuloMin})` : ""}
        </span>
        <span>
          {faixa.max}
          {sufixo}
          {faixa.rotuloMax ? ` (${faixa.rotuloMax})` : ""}
        </span>
      </div>
    </div>
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
      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Valor do parâmetro</span>
        <ToggleSwitch checked={parametro.valor === "Sim"} onChange={(checked) => onChange(checked ? "Sim" : "Não")} />
      </div>
    );
  }

  if (parametro.tipo === "situacao") {
    return (
      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Estado da funcionalidade</span>
        <ToggleSwitch
          checked={parametro.valor === "Ativo"}
          onChange={(checked) => onChange(checked ? "Ativo" : "Inativo")}
        />
      </div>
    );
  }

  if (parametro.tipo === "numero") {
    const faixa = calcularFaixaNumero(parametro.nome, parametro.valor);
    if (faixa) {
      return (
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <SliderNumero valor={parametro.valor} onChange={onChange} faixa={faixa} />
        </div>
      );
    }
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
        label={parametro.tipo === "lista" ? "Valores (separados por vírgula)" : "Valor do parâmetro"}
        value={parametro.valor}
        onChange={onChange}
        type={parametro.tipo === "data" ? "date" : "text"}
      />
    </div>
  );
}

export function ParametrosSistemaPage({ onLogout, onNavigate }: ParametrosSistemaPageProps) {
  const [parametros, setParametros] = useState(() => listarParametrosSistema());
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [modulosSelecionados, setModulosSelecionados] = useState<Set<CadastroParametroId>>(
    () => new Set(CADASTROS_COM_PARAMETROS.map((item) => item.id)),
  );
  const [dropdownModulosAberto, setDropdownModulosAberto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [alterados, setAlterados] = useState<Set<string>>(() => new Set());
  const [quantidadeSalva, setQuantidadeSalva] = useState(0);
  const [sucessoAberto, setSucessoAberto] = useState(false);

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
      const correspondeSituacao = !situacao || item.situacao === situacao;
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
    setAlterados((atuais) => new Set(atuais).add(id));
  };

  const salvar = () => {
    if (!alterados.size) return;
    const registrosAlterados = parametros.filter((item) => alterados.has(item.id));
    salvarParametrosSistema(registrosAlterados);
    setQuantidadeSalva(registrosAlterados.length);
    setAlterados(new Set());
    setSucessoAberto(true);
  };

  const obterBreadcrumb = (parametro: ParametroSistema) => {
    if (parametro.funcionalidade) return `GTA / ${parametro.funcionalidade}`;
    const modulo = CADASTROS_COM_PARAMETROS.find((item) => item.id === parametro.cadastroId);
    return (modulo?.label ?? "").replace(" — ", " / ");
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
            <h2 className="text-base font-semibold text-gray-800">Buscar parâmetros</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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
                    const icone = obterIcone(parametro);
                    return (
                      <article
                        key={parametro.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${icone.bg}`}>
                              <icone.Icon size={20} className={icone.fg} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 break-all">{parametro.nome}</h3>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Layers size={11} className="flex-shrink-0" />
                                <span className="truncate">{obterBreadcrumb(parametro)}</span>
                              </p>
                            </div>
                          </div>
                          <BadgeSituacao situacao={parametro.situacao} />
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">{parametro.descricao}</p>

                        <ControleValor parametro={parametro} onChange={(valor) => alterarValor(parametro.id, valor)} />

                        {alterados.has(parametro.id) && (
                          <p className="text-xs text-[#1A7A3C] font-medium -mt-2">Alteração ainda não salva</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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