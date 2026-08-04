import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  LocalRealizacaoExameForm,
  RequiredFieldsNotice,
  type LocalRealizacaoExameFormValue,
} from "./LocalRealizacaoExameForm";
import {
  atualizarLocalRealizacaoExame,
  obterLocalRealizacaoExame,
  type LocalRealizacaoExame,
} from "./localRealizacaoExameData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: LocalRealizacaoExame | null;
}

const toFormValue = (registro: LocalRealizacaoExame): LocalRealizacaoExameFormValue => ({
  proprietarios: registro.proprietarios.map((entidade, index) => ({
    uid: `proprietario-${registro.id}-${index}`,
    entidade,
  })),
  localizadoEmEstabelecimento: registro.localizadoEmEstabelecimento,
  estabelecimento: registro.estabelecimento,
  endereco: registro.endereco,
  veterinarios: registro.veterinarios,
  situacao: registro.situacao,
});

export function EditarLocalRealizacaoExamePage({ onLogout, onNavigate, dados }: PageProps) {
  const registroInicial = dados ?? obterLocalRealizacaoExame();
  const [form, setForm] = useState<LocalRealizacaoExameFormValue | null>(() => (
    registroInicial ? toFormValue(registroInicial) : null
  ));
  const [erro, setErro] = useState("");

  if (!registroInicial || !form) return null;

  const salvar = () => {
    const proprietarios = form.proprietarios
      .map((item) => item.entidade)
      .filter((item): item is NonNullable<typeof item> => item != null);
    const enderecoBasicoValido = form.endereco.zona
      && form.endereco.estado
      && form.endereco.municipio
      && form.endereco.endereco;
    const localizacaoValida = form.localizadoEmEstabelecimento !== ""
      && (!form.localizadoEmEstabelecimento || !!form.estabelecimento)
      && !!enderecoBasicoValido;

    if (proprietarios.length !== form.proprietarios.length || !localizacaoValida) {
      setErro("Preencha os proprietários e a localização para continuar.");
      return;
    }

    const atualizado = atualizarLocalRealizacaoExame(registroInicial.id, {
      proprietarios,
      localizadoEmEstabelecimento: form.localizadoEmEstabelecimento === true,
      estabelecimento: form.estabelecimento,
      endereco: form.endereco,
      situacao: form.situacao,
    });

    if (!atualizado) {
      setErro("Não foi possível localizar o cadastro para edição.");
      return;
    }

    onNavigate("visualizar-local-realizacao-exame", atualizado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="local-realizacao-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("visualizar-local-realizacao-exame", registroInicial)}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Visualizar Local de Realização de Exame
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Local de Realização de Exame</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        <LocalRealizacaoExameForm
          value={form}
          onChange={(value) => { setForm(value); setErro(""); }}
          codigo={registroInicial.codigo}
          mode="edit"
        />

        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>
    </div>
  );
}
