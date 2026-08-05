import { ArrowLeft, Pencil } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { CustomButton } from "../../../components/ui/FormKit";
import {
  LocalRealizacaoExameForm,
  type LocalRealizacaoExameFormValue,
} from "./LocalRealizacaoExameForm";
import {
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

export function VisualizarLocalRealizacaoExamePage({ onLogout, onNavigate, dados }: PageProps) {
  const registro = dados ?? obterLocalRealizacaoExame();

  if (!registro) return null;

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
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Local de Realização de Exame</h1>
            <CustomButton icon={<Pencil size={17} />} onClick={() => onNavigate("editar-local-realizacao-exame", registro)}>
              Editar
            </CustomButton>
          </div>
        </div>

        <LocalRealizacaoExameForm
          value={toFormValue(registro)}
          onChange={() => {}}
          codigo={registro.codigo}
          mode="view"
        />
      </main>
    </div>
  );
}
