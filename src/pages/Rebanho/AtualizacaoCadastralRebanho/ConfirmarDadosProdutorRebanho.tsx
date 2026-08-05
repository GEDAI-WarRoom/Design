import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
} from "lucide-react";
import { useState } from "react";
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-start">
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
          rows={2}
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

    // 1. Marca os dados do produtor como confirmados
    confirmarDadosProdutor(atualizacao);

    // 2. Navega para a tela de visualização/gerenciamento dos itens da atualização
    onNavigate("visualizar-atualizacao-cadastral-rebanho", {
      atualizacaoId: atualizacao.id,
    });
  };

  return (
    <div className="min-h-screen bg-[#eef0f1] pb-6">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="atualizacao-cadastral-rebanho"
        hideSearch
      />

      <main className="max-w-[1000px] mx-auto px-3 sm:px-4 py-4">
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 text-center relative">
            <button
              type="button"
              onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
              className="absolute left-4 top-4 p-1.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
              aria-label="Voltar para a listagem"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center justify-center gap-2">
              <img
                src={Icons.iconeProdutorUrl}
                alt=""
                className="w-5 h-5 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Confirmação de Dados do Produtor
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Confirme os dados de contato do produtor para realizar a
              atualização cadastral de rebanho:
            </p>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-4">
            <section className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setSecaoAberta((valor) => !valor)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left hover:bg-gray-100/70 transition"
              >
                <span className="font-semibold text-sm text-gray-800">
                  Informações de Contato
                </span>
                {secaoAberta ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>

              {secaoAberta && (
                <div className="p-4 flex flex-col gap-4">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                      Contatos Obrigatórios
                    </h2>
                    <div className="flex flex-col gap-3">
                      {contatosObrigatorios.map((contato) => (
                        <ContatoSomenteLeitura
                          key={contato.id}
                          contato={contato}
                        />
                      ))}
                    </div>
                  </div>

                  {contatosAdicionais.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <h2 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">
                        Contatos Opcionais
                      </h2>
                      <div className="flex flex-col gap-3">
                        {contatosAdicionais.map((contato) => (
                          <ContatoSomenteLeitura
                            key={contato.id}
                            contato={contato}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Declaração com checkbox */}
            <label className="flex items-start gap-3 bg-[#eafaf2] rounded-xl p-3.5 sm:p-4 cursor-pointer">
              <span className="w-7 h-7 rounded-md bg-[#dcf5e9] border border-[#c7ead9] text-[#1A7A3C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info size={16} />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  Confirmação de Dados
                </span>
                <span className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={confirmado}
                    onChange={(event) => setConfirmado(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#1A7A3C] shrink-0"
                  />
                  Declaro que todas as informações prestadas são verdadeiras e
                  refletem a situação atual do cadastro.
                </span>
              </span>
            </label>

            {/* Rodapé: Dados Incorretos acima (centralizado) + Botões centralizados */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("editar-pessoa-fisica", null)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A7A3C] hover:underline"
              >
                <Info size={14} className="text-gray-500" />
                <span className="text-gray-500">Dados incorretos?</span>
                Acessar Cadastro para Editar
                <ExternalLink size={13} />
              </button>

              <div className="flex items-center justify-center gap-3 w-full">
                <CustomButton
                  variant="outlined"
                  onClick={() => onNavigate("atualizacao-cadastral-rebanho")}
                >
                  Cancelar
                </CustomButton>
                <CustomButton onClick={salvar} disabled={!confirmado}>
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
