import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  PrevisaoMigracaoForm,
  RequiredFieldsNotice,
  criarFormPrevisao,
  formPrevisaoValido,
  type PrevisaoMigracaoFormValue,
} from "./PrevisaoMigracaoForm";
import {
  NUCLEO_PREVISAO_PADRAO,
  atualizarPrevisaoMigracao,
  criarPrevisaoMigracao,
  formatarDataPrevisao,
  normalizarNucleoPrevisao,
  nucleoPermitePrevisao,
  obterPrevisaoMigracao,
  type PrevisaoMigracao,
} from "./previsaoMigracaoData";

const GREEN = "#1A7A3C";

type ModoPagina = "adicionar" | "visualizar" | "editar";

interface PageProps {
  mode: ModoPagina;
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

const titulos: Record<ModoPagina, string> = {
  adicionar: "Adicionar Previsão de Migração",
  visualizar: "Visualizar Previsão de Migração",
  editar: "Editar Previsão de Migração",
};

export function PrevisaoMigracaoDetalhePage({ mode, onLogout, onNavigate, dados }: PageProps) {
  const nucleoOriginal = dados?.nucleo ?? NUCLEO_PREVISAO_PADRAO;
  const nucleo = normalizarNucleoPrevisao(nucleoOriginal);
  const registroInicial = mode === "adicionar" ? null : obterPrevisaoMigracao(dados?.previsaoId);
  const [form, setForm] = useState<PrevisaoMigracaoFormValue>(() => criarFormPrevisao(registroInicial));
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<PrevisaoMigracao | null>(null);

  const contexto = (previsao?: PrevisaoMigracao | null) => ({
    nucleo: nucleoOriginal,
    previsaoId: previsao?.id,
  });

  const voltarParaLista = () => onNavigate("visualizar-nucleo-producao", {
    ...nucleoOriginal,
    abaInicial: "previsoes-migracao",
  });

  const salvar = () => {
    setTentouSalvar(true);
    if (!formPrevisaoValido(form) || !nucleoPermitePrevisao(nucleo)) return;

    const dadosForm = {
      estado: form.estado,
      municipio: form.municipio,
      data: form.data,
      culturas: form.culturas.flatMap((item) => item.cultura ? [item.cultura] : []),
    };

    if (mode === "adicionar") {
      const criado = criarPrevisaoMigracao({
        nucleoCodigo: nucleo.codigo,
        ...dadosForm,
      });
      setRegistroSalvo(criado);
      return;
    }

    if (mode === "editar" && registroInicial) {
      const atualizado = atualizarPrevisaoMigracao(registroInicial.id, dadosForm);
      if (atualizado) onNavigate("visualizar-previsao-migracao", contexto(atualizado));
    }
  };

  if (!nucleoPermitePrevisao(nucleo)) {
    return (
      <div className="min-h-screen bg-[#f2f3f5]">
        <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="nucleo-producao" hideSearch />
        <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
          <button type="button" onClick={voltarParaLista} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Previsões de Migração
          </button>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-500">
            Esta funcionalidade é permitida somente para núcleos de abelhas definidos como migratórios.
          </div>
        </main>
      </div>
    );
  }

  if (mode !== "adicionar" && !registroInicial) {
    return (
      <div className="min-h-screen bg-[#f2f3f5]">
        <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="nucleo-producao" hideSearch />
        <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
          <button type="button" onClick={voltarParaLista} className="flex items-center gap-1 text-sm mb-3 font-semibold text-[#1A7A3C]">
            <ArrowLeft size={15} /> Previsões de Migração
          </button>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-500">Previsão não encontrada.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="nucleo-producao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={voltarParaLista}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Previsões de Migração
          </button>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{titulos[mode]}</h1>
            {mode === "visualizar" ? (
              <button
                type="button"
                onClick={() => onNavigate("editar-previsao-migracao", contexto(registroInicial))}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={salvar}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                {mode === "adicionar" ? "Adicionar" : "Salvar"}
              </button>
            )}
          </div>
        </div>

        {mode !== "visualizar" && <RequiredFieldsNotice />}

        <PrevisaoMigracaoForm
          value={form}
          onChange={setForm}
          disabled={mode === "visualizar"}
          showSituacao={mode !== "adicionar"}
        />

        {tentouSalvar && !formPrevisaoValido(form) && (
          <p className="text-sm text-red-500 font-medium">Preencha todos os campos obrigatórios para continuar.</p>
        )}
      </main>

      {registroSalvo && (
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
                onClick={voltarParaLista}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("visualizar-previsao-migracao", contexto(registroSalvo))}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
