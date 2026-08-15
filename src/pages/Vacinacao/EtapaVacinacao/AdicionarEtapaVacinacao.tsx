import { useMemo, useState } from "react";
import { ArrowLeft, Check, Flag, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  EtapaVacinacaoForm,
  etapaParaForm,
  validarEtapaVacinacaoForm,
  type EtapaVacinacaoFormMode,
} from "./EtapaVacinacaoForm";
import {
  atualizarEtapaVacinacao,
  criarEtapaVacinacao,
  finalizarEtapaVacinacao,
  gerarCodigoEtapa,
  obterEtapaVacinacao,
  type EtapaVacinacao,
  type EtapaVacinacaoDraft,
} from "./etapaVacinacaoData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  mode?: Exclude<EtapaVacinacaoFormMode, "view">;
  dados?: Partial<EtapaVacinacao>;
}

export function AdicionarEtapaVacinacaoPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const registroPersistido = mode === "edit" ? obterEtapaVacinacao(dados) : null;
  const [form, setForm] = useState(() => etapaParaForm(registroPersistido ?? dados));
  const [erros, setErros] = useState<string[]>([]);
  const [registroSalvo, setRegistroSalvo] = useState<EtapaVacinacao | null>(null);
  const [confirmarFinalizacao, setConfirmarFinalizacao] = useState(false);

  const codigoPrevisto = useMemo(() => {
    if (form.codigo) return form.codigo;
    if (!form.doenca || !form.dataInicio) return "";
    return gerarCodigoEtapa(form.doenca.id, form.dataInicio);
  }, [form.codigo, form.dataInicio, form.doenca]);

  const handleSalvar = () => {
    const validacao = validarEtapaVacinacaoForm(form);
    setErros(validacao);
    if (validacao.length || !form.doenca) return;

    const draft: EtapaVacinacaoDraft = {
      dataInicio: form.dataInicio,
      dataFim: form.dataFim,
      doenca: form.doenca,
      especies: form.especies,
      tiposVacinacao: form.tiposVacinacao,
    };
    const salvo = mode === "edit" && registroPersistido
      ? atualizarEtapaVacinacao({ ...registroPersistido, ...draft })
      : criarEtapaVacinacao(draft);
    setForm(etapaParaForm(salvo));
    setRegistroSalvo(salvo);
  };

  const handleFinalizar = () => {
    if (!registroPersistido) return;
    const finalizada = finalizarEtapaVacinacao(registroPersistido.id);
    setConfirmarFinalizacao(false);
    setRegistroSalvo(finalizada);
    setForm(etapaParaForm(finalizada));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />
      <main className="mx-auto flex max-w-[1088px] flex-col gap-4 px-4 py-6 md:px-6">
        <div>
          <button type="button" onClick={() => onNavigate("etapa-vacinacao")} className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70">
            <ArrowLeft size={15} /> Todas as Etapas de Vacinação
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{mode === "edit" ? "Editar" : "Adicionar"} Etapa de Vacinação</h1>
            <div className="flex items-center gap-3">
              {mode === "edit" && form.situacao === "Aberta" && (
                <button type="button" onClick={() => setConfirmarFinalizacao(true)} className="flex h-10 items-center gap-2 rounded-md border border-[#1A7A3C] px-5 text-xs font-bold text-[#1A7A3C] hover:bg-green-50">
                  <Flag size={15} /> Finalizar
                </button>
              )}
              {form.situacao !== "Finalizada" && (
                <button type="button" onClick={handleSalvar} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#15612F]">
                  {mode === "edit" ? "Salvar Alterações" : "Adicionar"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="shrink-0 text-gray-500" />
          <p className="text-sm font-medium text-gray-600">Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios e deverão ser preenchidos.</p>
        </div>

        <EtapaVacinacaoForm
          mode={mode}
          value={{ ...form, codigo: codigoPrevisto }}
          onChange={(value) => {
            setForm({ ...value, codigo: form.codigo });
            if (erros.length) setErros([]);
          }}
          onVisualizarDoenca={(doenca) => onNavigate("visualizar-doenca", doenca)}
          errors={erros}
        />
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h2 className="text-lg font-bold text-gray-900">Etapa de Vacinação {registroSalvo.situacao === "Finalizada" ? "finalizada" : mode === "edit" ? "atualizada" : "cadastrada"} com sucesso!</h2>
            <p className="mt-1 text-sm text-gray-500">A etapa {registroSalvo.codigo} foi salva.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => onNavigate("etapa-vacinacao")} className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50">Voltar</button>
              <button type="button" onClick={() => onNavigate("visualizar-etapa-vacinacao", registroSalvo)} className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Visualizar</button>
            </div>
          </div>
        </div>
      )}

      {confirmarFinalizacao && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">Finalizar Etapa de Vacinação?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">A etapa passará para a situação Finalizada e não poderá mais ser editada.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmarFinalizacao(false)} className="h-10 rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleFinalizar} className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white hover:bg-[#15612F]">Confirmar Finalização</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
