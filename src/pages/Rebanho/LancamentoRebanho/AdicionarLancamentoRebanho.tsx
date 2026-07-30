import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  LancamentoRebanhoForm,
  RequiredFieldsNotice,
  type LancamentoRebanhoFormValue,
} from "./LancamentoRebanhoForm";
import {
  criarFaixas,
  criarLancamentoRebanho,
  type LancamentoRebanho,
} from "./lancamentoRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

const initialValue = (): LancamentoRebanhoFormValue => ({
  produtor: null,
  estabelecimento: null,
  exploracao: null,
  nucleo: null,
  lancamentos: [],
  justificativaMortalidade: "",
  documentosMortalidade: [],
  justificativaRoubo: "",
  documentoRoubo: "",
  situacao: "Ativo",
});

export function AdicionarLancamentoRebanhoPage({ onLogout, onNavigate }: PageProps) {
  const [form, setForm] = useState<LancamentoRebanhoFormValue>(initialValue);
  const [erro, setErro] = useState("");
  const [registroSalvo, setRegistroSalvo] = useState<LancamentoRebanho | null>(null);

  const validar = () => {
    if (!form.produtor || !form.estabelecimento || !form.exploracao) {
      return "Preencha produtor, estabelecimento agropecuário e exploração pecuária.";
    }
    if (form.exploracao.possuiNucleo && !form.nucleo) {
      return "Selecione o núcleo de produção da exploração pecuária.";
    }
    if (form.lancamentos.length === 0) {
      return "Selecione ao menos um tipo de lançamento.";
    }

    const quantidadeInformada = form.lancamentos.reduce(
      (total, item) =>
        total +
        item.faixas.reduce(
          (subtotal, faixa) => subtotal + faixa.machosInformados + faixa.femeasInformadas,
          0,
        ),
      0,
    );
    if (quantidadeInformada === 0) {
      return "Informe a quantidade de animais em ao menos uma faixa etária.";
    }

    const evolucao = form.lancamentos.find((item) => item.tipo === "Evolução de Rebanho");
    if (evolucao) {
      for (let index = 1; index < evolucao.faixas.length; index += 1) {
        const anterior = evolucao.faixas[index - 1];
        const atual = evolucao.faixas[index];
        if (
          atual.machosInformados > anterior.machosExistentes ||
          atual.femeasInformadas > anterior.femeasExistentes
        ) {
          return `Na evolução para "${atual.faixa}", a quantidade deve ser menor ou igual ao rebanho existente na faixa anterior.`;
        }
      }
    }

    const nascimento = form.lancamentos.find((item) => item.tipo === "Nascimento");
    if (nascimento) {
      const totalNascimentos = nascimento.faixas.reduce(
        (total, faixa) => total + faixa.machosInformados + faixa.femeasInformadas,
        0,
      );
      const femeasReprodutivas = criarFaixas(form.exploracao, "Mortalidade")
        .filter((faixa) => faixa.femeasReprodutivas)
        .reduce((total, faixa) => total + faixa.femeasExistentes, 0);
      if (totalNascimentos > femeasReprodutivas) {
        return "A quantidade de nascimentos não pode ultrapassar o total de fêmeas em idade reprodutiva.";
      }
    }

    return "";
  };

  const salvar = () => {
    const validacao = validar();
    if (validacao) {
      setErro(validacao);
      return;
    }

    const criado = criarLancamentoRebanho({
      produtor: form.produtor!,
      estabelecimento: form.estabelecimento!,
      exploracao: form.exploracao!,
      nucleo: form.nucleo,
      lancamentos: form.lancamentos,
      justificativaMortalidade: form.justificativaMortalidade,
      documentosMortalidade: form.documentosMortalidade.filter(Boolean),
      justificativaRoubo: form.justificativaRoubo,
      documentoRoubo: form.documentoRoubo,
    });
    setErro("");
    setRegistroSalvo(criado);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-20">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="lancamento-rebanho" hideSearch />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("lancamento-rebanho")}
            className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Lançamentos de Rebanho
          </button>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Lançamento de Rebanho</h1>
            <button
              type="button"
              onClick={salvar}
              className="h-11 rounded-md bg-[#1A7A3C] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15612F]"
            >
              Adicionar
            </button>
          </div>
        </div>

        <RequiredFieldsNotice />
        <LancamentoRebanhoForm
          value={form}
          onChange={(next) => {
            setForm(next);
            setErro("");
          }}
        />
        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {erro}
          </div>
        )}
      </main>

      {registroSalvo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Lançamento de rebanho cadastrado com sucesso!</h2>
            <p className="mt-1 text-sm text-gray-500">
              O lançamento para <span className="font-medium text-gray-700">{registroSalvo.exploracao.especie}</span> foi gravado.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("lancamento-rebanho");
                }}
                className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50/40"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegistroSalvo(null);
                  onNavigate("visualizar-lancamento-rebanho", registroSalvo);
                }}
                className="h-11 rounded-md bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
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
