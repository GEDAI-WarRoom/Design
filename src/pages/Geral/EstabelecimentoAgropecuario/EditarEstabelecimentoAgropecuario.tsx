import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import {
  ESTABELECIMENTOS_INICIAIS,
  obterEstabelecimentoAgropecuario,
  salvarEdicaoEstabelecimentoAgropecuario,
  type EstabelecimentoAgropecuario,
} from "./estabelecimentoAgropecuarioData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: EstabelecimentoAgropecuario;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-t-xl px-6 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-gray-100 p-6">{children}</div>}
    </section>
  );
}

export function EditarEstabelecimentoAgropecuarioPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const registroInicial =
    obterEstabelecimentoAgropecuario(dados?.id ?? dados?.codigo) ??
    dados ??
    ESTABELECIMENTOS_INICIAIS[0];
  const [nome, setNome] = useState(registroInicial.nome);
  const [proprietarios, setProprietarios] = useState(registroInicial.proprietarios);
  const [zona, setZona] = useState<EstabelecimentoAgropecuario["zona"]>(
    registroInicial.zona,
  );
  const [municipioUf, setMunicipioUf] = useState(registroInicial.municipioUf);
  const [situacao, setSituacao] = useState<EstabelecimentoAgropecuario["situacao"]>(
    registroInicial.situacao,
  );
  const [erro, setErro] = useState("");

  const salvar = () => {
    if (!nome.trim() || !proprietarios.trim() || !municipioUf.trim()) {
      setErro("Preencha nome, proprietários e município/UF.");
      return;
    }

    const registroAtualizado: EstabelecimentoAgropecuario = {
      ...registroInicial,
      nome: nome.trim(),
      proprietarios: proprietarios.trim(),
      zona,
      municipioUf: municipioUf.trim(),
      situacao,
    };

    const { registro } = salvarEdicaoEstabelecimentoAgropecuario(
      registroInicial,
      registroAtualizado,
    );
    onNavigate("visualizar-estabelecimento-agropecuario", registro);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="estabelecimento-agropecuario"
        hideSearch
      />

      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <header>
          <button
            type="button"
            onClick={() =>
              onNavigate("visualizar-estabelecimento-agropecuario", registroInicial)
            }
            className="mb-4 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Visualizar Estabelecimento Agropecuário
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Editar Estabelecimento Agropecuário
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="h-10 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
            >
              Salvar
            </button>
          </div>
        </header>

        {erro && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <Section title="Informações do Cadastro">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatInput
              label="Código do Estabelecimento"
              value={registroInicial.codigo}
              disabled
            />
            <FloatInput
              label="Nome do Estabelecimento"
              value={nome}
              onChange={setNome}
              required
            />
            <FloatInput
              label="Proprietários"
              value={proprietarios}
              onChange={setProprietarios}
              required
            />
            <FloatSelect
              label="Zona"
              value={zona}
              onChange={(value) => setZona(value as EstabelecimentoAgropecuario["zona"])}
              options={[
                { value: "Rural", label: "Rural" },
                { value: "Urbana", label: "Urbana" },
              ]}
              required
            />
            <FloatInput
              label="Município/UF"
              value={municipioUf}
              onChange={setMunicipioUf}
              required
            />
            <FloatSelect
              label="Situação"
              value={situacao}
              onChange={(value) =>
                setSituacao(value as EstabelecimentoAgropecuario["situacao"])
              }
              options={[
                { value: "Ativo", label: "Ativo" },
                { value: "Inativo", label: "Inativo" },
                { value: "Suspenso", label: "Suspenso" },
              ]}
              required
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
