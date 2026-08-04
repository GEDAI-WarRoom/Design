import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  criarEnderecoVazio,
  criarProprietarioVazio,
  LocalRealizacaoExameForm,
  RequiredFieldsNotice,
  type LocalRealizacaoExameFormValue,
} from "./LocalRealizacaoExameForm";
import {
  criarLocalRealizacaoExame,
  type LocalRealizacaoExame,
} from "./localRealizacaoExameData";

const GREEN = "#1A7A3C";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const criarEstadoInicial = (): LocalRealizacaoExameFormValue => ({
  proprietarios: [criarProprietarioVazio()],
  localizadoEmEstabelecimento: "",
  estabelecimento: null,
  endereco: criarEnderecoVazio(),
  veterinarios: [],
  situacao: "Ativo",
});

export function AdicionarLocalRealizacaoExamePage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<LocalRealizacaoExameFormValue>(criarEstadoInicial());
  const [erro, setErro] = useState("");
  const [registroSalvo, setRegistroSalvo] = useState<LocalRealizacaoExame | null>(null);

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

    if (proprietarios.length !== form.proprietarios.length || !localizacaoValida || form.veterinarios.length === 0) {
      setErro("Preencha os proprietários, a localização e selecione ao menos um médico veterinário para continuar.");
      return;
    }

    try {
      const criado = criarLocalRealizacaoExame({
        proprietarios,
        localizadoEmEstabelecimento: form.localizadoEmEstabelecimento === true,
        estabelecimento: form.estabelecimento,
        endereco: form.endereco,
        veterinarios: form.veterinarios,
        situacao: "Ativo",
      });
      setErro("");
      setRegistroSalvo(criado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível cadastrar o local de realização de exame.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="local-realizacao-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("local-realizacao-exame")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} /> Todos os Locais de Realização de Exame
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Local de Realização de Exame</h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />

        <LocalRealizacaoExameForm value={form} onChange={(value) => { setForm(value); setErro(""); }} />

        {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Local de realização de exame cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">
              O código <span className="font-medium text-gray-700">{registroSalvo.codigo}</span> foi gerado para o novo local.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("local-realizacao-exame");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("visualizar-local-realizacao-exame", registroSalvo);
                }}
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
