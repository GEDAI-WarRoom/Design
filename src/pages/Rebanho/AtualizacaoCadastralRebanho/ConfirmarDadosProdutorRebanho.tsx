import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  CustomButton,
  FloatInput,
  FloatSelect,
  LargeTextArea,
} from "../../../components/ui/FormKit";
import * as Icons from "../../../imports/icons";
import {
  confirmarDadosProdutor,
  obterAtualizacaoCadastral,
  type ContatoProdutor,
} from "./atualizacaoCadastralRebanhoData";

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: { atualizacaoId?: number } | null;
}

function ContatoSomenteLeitura({ contato }: { contato: ContatoProdutor }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
      <FloatSelect
        label="Tipo de Contato"
        required={contato.obrigatorio}
        value={contato.tipo}
        onChange={() => {}}
        options={[
          { value: "E-mail", label: "E-mail" },
          { value: "Telefone", label: "Telefone" },
          { value: "Celular", label: "Celular" },
        ]}
        disabled
        className="md:col-span-3"
      />
      <FloatInput
        label={contato.tipo === "E-mail" ? "E-mail" : "Número"}
        required={contato.obrigatorio}
        value={contato.valor}
        disabled
        className="md:col-span-4"
      />
      <div className="md:col-span-5">
        <LargeTextArea
          label="Observação"
          value={contato.observacao}
          onChange={() => {}}
          disabled
          rows={3}
        />
      </div>
    </div>
  );
}

export function ConfirmarDadosProdutorRebanhoPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const atualizacao = obterAtualizacaoCadastral(dados?.atualizacaoId);
  const [secaoAberta, setSecaoAberta] = useState(true);
  const [confirmado, setConfirmado] = useState(false);

  if (!atualizacao) return null;

  const contatosObrigatorios = atualizacao.produtor.contatos.filter(
    (contato) => contato.obrigatorio,
  );
  const contatosAdicionais = atualizacao.produtor.contatos.filter(
    (contato) => !contato.obrigatorio,
  );

  const salvar = () => {
    if (!confirmado) return;
    confirmarDadosProdutor(atualizacao);
    onNavigate("visualizar-atualizacao-cadastral-rebanho", {
      atualizacaoId: atualizacao.id,
    });
  };

  return (
    <div className="min-h-screen bg-[#eef0f1] pb-12">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="atualizacao-cadastral-rebanho"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6">
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-5 md:px-8 py-6 border-b border-gray-200 text-center relative">
            <button
              type="button"
              onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
              className="absolute left-5 top-6 p-2 text-[#1A7A3C] hover:bg-green-50 rounded-md"
              aria-label="Voltar para a listagem"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center justify-center gap-3">
              <img
                src={Icons.iconeProdutorUrl}
                alt=""
                className="w-6 h-6 object-contain"
              />
              <h1 className="text-2xl font-semibold text-gray-900">
                Confirmação de Dados do Produtor
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Confirme os dados de contato do produtor para realizar a atualização
              cadastral de rebanho:
            </p>
          </div>

          <div className="p-5 md:p-8 flex flex-col gap-7">
            <section className="border border-gray-200 rounded-2xl overflow-visible">
              <button
                type="button"
                onClick={() => setSecaoAberta((valor) => !valor)}
                className="w-full flex items-center justify-between px-5 py-5 bg-gray-50 rounded-t-2xl text-left"
              >
                <span className="font-semibold text-gray-800">
                  Informações de Contato
                </span>
                {secaoAberta ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </button>

              {secaoAberta && (
                <div className="p-5 flex flex-col gap-7">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800 mb-5">
                      Contatos Obrigatórios
                    </h2>
                    <div className="flex flex-col gap-6">
                      {contatosObrigatorios.map((contato) => (
                        <ContatoSomenteLeitura key={contato.id} contato={contato} />
                      ))}
                    </div>
                  </div>

                  {contatosAdicionais.length > 0 && (
                    <div className="pt-5 border-t border-gray-100">
                      <h2 className="text-sm font-semibold text-gray-800 mb-5">
                        Contatos Adicionais
                      </h2>
                      <div className="flex flex-col gap-6">
                        {contatosAdicionais.map((contato) => (
                          <ContatoSomenteLeitura key={contato.id} contato={contato} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="h-px bg-gray-200" />

            <label className="flex items-start gap-4 bg-[#eafaf2] rounded-2xl p-5 md:p-6 cursor-pointer">
              <span className="w-9 h-9 rounded-md bg-[#dcf5e9] border border-[#c7ead9] text-[#1A7A3C] flex items-center justify-center flex-shrink-0">
                <Info size={18} />
              </span>
              <span className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Confirmação de Dados
                </span>
                <span className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={confirmado}
                    onChange={(event) => setConfirmado(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#1A7A3C]"
                  />
                  Declaro que todas as informações prestadas são verdadeiras e refletem
                  a situação atual do cadastro.
                </span>
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onNavigate("editar-pessoa-fisica", null)}
                className="inline-flex items-center gap-2 text-sm text-[#1A7A3C] hover:underline"
              >
                <Info size={15} className="text-gray-500" />
                <span className="text-gray-500">Dados incorretos?</span>
                Acessar Cadastro para Editar
                <ExternalLink size={14} />
              </button>

              <div className="flex items-center gap-3">
                <CustomButton
                  variant="outlined"
                  onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  onClick={salvar}
                  disabled={!confirmado}
                  icon={<Check size={18} />}
                >
                  Salvar
                </CustomButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

