import { useState } from "react";
import {
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MoreVertical,
  Sprout,
} from "lucide-react";
import { GenericFormModal } from "../../../components/ui/FormKit";
import {
  PrevisaoMigracaoForm,
  criarFormPrevisao,
  formPrevisaoValido,
  type PrevisaoMigracaoFormValue,
} from "./PrevisaoMigracaoForm";
import {
  criarPrevisaoMigracao,
  formatarCulturasPrevisao,
  formatarDataPrevisao,
  listarPrevisoesMigracao,
  normalizarNucleoPrevisao,
  type PrevisaoMigracao,
} from "./previsaoMigracaoData";

interface PrevisaoMigracaoTabProps {
  onNavigate: (screen: any, data?: any) => void;
  nucleo: any;
}

interface AdicionarPrevisaoMigracaoModalProps extends PrevisaoMigracaoTabProps {
  open: boolean;
  onClose: () => void;
}

interface CardGroupProps {
  title: string;
  contadorLabel: string;
  previsoes: PrevisaoMigracao[];
  historico?: PrevisaoMigracao[];
  historicoVazio?: string;
  exibirCulturas?: boolean;
  vazio: string;
  defaultOpen?: boolean;
  onVisualizar: (previsao: PrevisaoMigracao) => void;
  onEditar: (previsao: PrevisaoMigracao) => void;
}

function CardsPrevisoes({
  previsoes,
  exibirCulturas = false,
  onVisualizar,
  onEditar,
}: Omit<CardGroupProps, "title" | "contadorLabel" | "vazio" | "defaultOpen">) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {previsoes.map((previsao) => (
        <article
          key={previsao.id}
          className="min-w-0 overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm"
        >
          <div className="h-1 bg-[#1A7A3C]" />

          <div className="flex min-h-[170px] flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3 text-[10px] text-gray-500">
              <span>
                <strong>Cadastrado:</strong> {formatarDataPrevisao(previsao.cadastradoEm)}
              </span>
              <span>{previsao.situacao}</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {previsao.municipio} - {previsao.uf}
                </p>
                <p className="text-[10px] text-gray-500">Município - UF</p>
              </div>
            </div>

            {exibirCulturas && (
              <div className="flex items-start gap-3">
                <Sprout size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">
                    {formatarCulturasPrevisao(previsao.culturas)}
                  </p>
                  <p className="text-[10px] text-gray-500">Culturas</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
              <div>
                <p className="text-sm text-gray-800">
                  {formatarDataPrevisao(previsao.data)}
                </p>
                <p className="text-[10px] text-gray-500">Data da Previsão</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => onVisualizar(previsao)}
              className="h-9 rounded bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]"
            >
              Visualizar
            </button>
            <button
              type="button"
              onClick={() => onEditar(previsao)}
              className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              title="Editar"
              aria-label="Editar previsão de migração"
            >
              <MoreVertical size={19} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function PrevisaoCardGroup({
  title,
  contadorLabel,
  previsoes,
  historico,
  historicoVazio = "Nenhum registro no histórico.",
  exibirCulturas = false,
  vazio,
  defaultOpen = true,
  onVisualizar,
  onEditar,
}: CardGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [historicoPage, setHistoricoPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(previsoes.length / perPage));
  const pageAtual = Math.min(page, totalPages);
  const inicio = previsoes.length === 0 ? 0 : (pageAtual - 1) * perPage + 1;
  const fim = Math.min(pageAtual * perPage, previsoes.length);
  const pagina = previsoes.slice((pageAtual - 1) * perPage, pageAtual * perPage);
  const totalHistoricoPages = Math.max(1, Math.ceil((historico?.length || 0) / perPage));
  const historicoPageAtual = Math.min(historicoPage, totalHistoricoPages);
  const historicoInicio = !historico?.length ? 0 : (historicoPageAtual - 1) * perPage + 1;
  const historicoFim = Math.min(historicoPageAtual * perPage, historico?.length || 0);
  const paginaHistorico = (historico || []).slice(
    (historicoPageAtual - 1) * perPage,
    historicoPageAtual * perPage,
  );

  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#20A866] text-white flex items-center justify-center">
            <CalendarClock size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-500">{contadorLabel}: {previsoes.length}</p>
          </div>
        </div>
        <ChevronDown size={19} className={`text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-gray-100 p-5">
          {previsoes.length > 0 ? (
            <CardsPrevisoes
              previsoes={pagina}
              exibirCulturas={exibirCulturas}
              onVisualizar={onVisualizar}
              onEditar={onEditar}
            />
          ) : (
            <p className="py-10 text-center text-sm text-gray-500">{vazio}</p>
          )}

          <div className="flex items-center justify-between pt-6 text-xs text-gray-500">
            <span>Itens por página: {perPage}</span>
            <div className="flex items-center gap-3">
              <span>{inicio} - {fim} de {previsoes.length}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={pageAtual === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={pageAtual === totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>

          {historico && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => setHistoricoOpen((value) => !value)}
                className="flex w-full items-center justify-between text-left text-sm font-medium text-[#1A7A3C] transition hover:text-[#15612F]"
              >
                <span className="flex items-center gap-2">
                  <ChevronDown
                    size={17}
                    className={`transition ${historicoOpen ? "rotate-180" : ""}`}
                  />
                  Histórico de Previsões Inativas
                </span>
                <span className="text-xs font-normal text-gray-500">
                  Previsões inativas: {historico.length}
                </span>
              </button>

              {historicoOpen && (
                <div className="pt-5">
                  {historico.length > 0 ? (
                    <CardsPrevisoes
                      previsoes={paginaHistorico}
                      exibirCulturas={exibirCulturas}
                      onVisualizar={onVisualizar}
                      onEditar={onEditar}
                    />
                  ) : (
                    <p className="py-10 text-center text-sm text-gray-500">
                      {historicoVazio}
                    </p>
                  )}

                  {historico.length > 0 && (
                    <div className="flex items-center justify-between pt-6 text-xs text-gray-500">
                      <span>Itens por página: {perPage}</span>
                      <div className="flex items-center gap-3">
                        <span>{historicoInicio} - {historicoFim} de {historico.length}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setHistoricoPage((value) => Math.max(1, value - 1))}
                            disabled={historicoPageAtual === 1}
                            className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Página anterior do histórico"
                          >
                            <ChevronLeft size={17} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoricoPage((value) => Math.min(totalHistoricoPages, value + 1))}
                            disabled={historicoPageAtual === totalHistoricoPages}
                            className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Próxima página do histórico"
                          >
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function AdicionarPrevisaoMigracaoModal({
  open,
  onClose,
  onNavigate,
  nucleo: nucleoOriginal,
}: AdicionarPrevisaoMigracaoModalProps) {
  const nucleo = normalizarNucleoPrevisao(nucleoOriginal);
  const [form, setForm] = useState<PrevisaoMigracaoFormValue>(() => criarFormPrevisao());
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<PrevisaoMigracao | null>(null);

  const limparEFechar = () => {
    setForm(criarFormPrevisao());
    setTentouSalvar(false);
    setRegistroSalvo(null);
    onClose();
  };

  const salvar = () => {
    setTentouSalvar(true);
    if (!formPrevisaoValido(form)) return;

    const criado = criarPrevisaoMigracao({
      nucleoCodigo: nucleo.codigo,
      estado: form.estado,
      municipio: form.municipio,
      data: form.data,
      culturas: form.culturas.flatMap((item) => item.cultura ? [item.cultura] : []),
    });
    setRegistroSalvo(criado);
  };

  const visualizarRegistro = () => {
    if (!registroSalvo) return;
    const previsaoId = registroSalvo.id;
    limparEFechar();
    onNavigate("visualizar-previsao-migracao", { nucleo: nucleoOriginal, previsaoId });
  };

  return (
    <>
      <GenericFormModal
        open={open && !registroSalvo}
        onClose={limparEFechar}
        onSave={salvar}
        title="Adicionar Previsão de Migração"
        subtitle="Campos indicados com * são obrigatórios."
        saveLabel="Adicionar"
        maxWidth="1000px"
      >
        <PrevisaoMigracaoForm value={form} onChange={setForm} />
        {tentouSalvar && !formPrevisaoValido(form) && (
          <p className="text-sm text-red-600">Preencha todos os campos obrigatórios para continuar.</p>
        )}
      </GenericFormModal>

      {open && registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Previsão de migração cadastrada com sucesso!</h2>
            <p className="text-sm text-gray-500 mt-1">
              A previsão para {registroSalvo.municipio} em {formatarDataPrevisao(registroSalvo.data)} foi cadastrada.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={limparEFechar}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={visualizarRegistro}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PrevisaoMigracaoTab({ onNavigate, nucleo: nucleoOriginal }: PrevisaoMigracaoTabProps) {
  const nucleo = normalizarNucleoPrevisao(nucleoOriginal);
  const previsoes = listarPrevisoesMigracao(nucleo.codigo);
  const ativa = previsoes.filter((previsao) => previsao.situacao === "Ativo").slice(0, 1);
  const historico = previsoes
    .filter((previsao) => previsao.situacao === "Inativo")
    .sort((a, b) => b.data.localeCompare(a.data));

  const contexto = (previsao?: PrevisaoMigracao) => ({
    nucleo: nucleoOriginal,
    previsaoId: previsao?.id,
  });

  return (
    <div className="flex flex-col gap-5">
      <PrevisaoCardGroup
        title="Previsão de Migração"
        contadorLabel="Previsões ativas"
        previsoes={ativa}
        historico={historico}
        historicoVazio="Nenhuma previsão inativa no histórico."
        exibirCulturas
        vazio="Nenhuma previsão ativa para este núcleo."
        onVisualizar={(previsao) => onNavigate("visualizar-previsao-migracao", contexto(previsao))}
        onEditar={(previsao) => onNavigate("editar-previsao-migracao", contexto(previsao))}
      />
    </div>
  );
}
