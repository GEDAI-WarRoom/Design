import React, { useState, type ReactNode } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatSelect, SimNao } from "../../../components/ui/FormKit";
import {
  DynamicListWrapper,
  PessoaFisicaInput,
  ProfissionalAnimalInput,
} from "../../../components/ui/EntitySearch";
import {
  CadastroVacinacaoHeader,
  cadastroVacinacaoPageClass,
  mensagemSucessoCadastro,
  preencherComExemplo,
  type CadastroVacinacaoModeProps,
} from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";

const PESSOAS_MOCK = [
  { id: 1, nome: "Eloiza Silva", documento: "444.009.956-40" },
  { id: 2, nome: "Pedro Alves Moraes", documento: "222.114.558-70" },
  { id: 3, nome: "Carla Menezes Rocha", documento: "111.998.775-30" },
  { id: 4, nome: "Carlos Andrade", documento: "111.222.333-44" },
];

const PROFISSIONAIS_RESPONSAVEIS_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", oficial: true },
  { id: 2, nome: "Joaquim da Silva", documento: "444.009.956-40", oficial: true },
  { id: 3, nome: "Marina Couto Dias", documento: "333.221.115-09", oficial: false },
];

type TipoVinculo = "Produtor" | "Veterinário Cadastrado" | "Auxiliar" | "";

interface PessoaSelecionada {
  id?: number | string;
  nome: string;
  documento: string;
}

interface AuxiliarFormItem {
  uid: string;
  profissional: PessoaSelecionada | null;
}

interface PageProps extends CadastroVacinacaoModeProps {
  onLogout?: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="border-t border-gray-100 p-6">{children}</div>
    </section>
  );
}

const criarUid = () => `auxiliar-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AdicionarVacinadorPage({ onLogout, onNavigate, mode = "create", dados }: PageProps) {
  const preenchendoRegistro = mode !== "create";
  const pessoaInicial: PessoaSelecionada | null = dados?.vacinadorSelecionado ??
    (preenchendoRegistro && dados?.nome
      ? { id: dados?.id, nome: dados.nome, documento: dados?.cpf ?? "" }
      : null);
  const profissionalInicial: PessoaSelecionada | null = dados?.profissionalResponsavel ??
    (dados?.profissionalNome
      ? {
          id: dados?.profissionalId ?? dados?.profissionalDoc,
          nome: dados.profissionalNome,
          documento: dados?.profissionalDoc ?? "",
        }
      : null);

  const [vinculo, setVinculo] = useState<TipoVinculo>(dados?.vinculo ?? (preenchendoRegistro ? "Auxiliar" : ""));
  const [vacinadorSelecionado, setVacinadorSelecionado] = useState<PessoaSelecionada | null>(pessoaInicial);
  const [aderidoPasa, setAderidoPasa] = useState<"Sim" | "Não" | "">(dados?.aderidoPasa ?? "");
  const [profissionalResponsavel, setProfissionalResponsavel] = useState<PessoaSelecionada | null>(profissionalInicial);
  const [auxiliares, setAuxiliares] = useState<AuxiliarFormItem[]>(dados?.auxiliares ?? []);
  const [isSucesso, setIsSucesso] = useState(false);

  const pessoasDisponiveis = pessoaInicial && !PESSOAS_MOCK.some((pessoa) => pessoa.id === pessoaInicial.id)
    ? [pessoaInicial, ...PESSOAS_MOCK]
    : PESSOAS_MOCK;
  const profissionaisDisponiveis = profissionalInicial &&
    !PROFISSIONAIS_RESPONSAVEIS_MOCK.some((profissional) => profissional.id === profissionalInicial.id)
    ? [profissionalInicial, ...PROFISSIONAIS_RESPONSAVEIS_MOCK]
    : PROFISSIONAIS_RESPONSAVEIS_MOCK;

  const registroAtual = preencherComExemplo({
    ...(dados ?? {}),
    id: dados?.id ?? `vacinador-${Date.now()}`,
    vinculo,
    aderidoPasa,
    vacinadorSelecionado,
    nome: vacinadorSelecionado?.nome ?? "",
    cpf: vacinadorSelecionado?.documento ?? "",
    profissionalResponsavel,
    profissionalNome: profissionalResponsavel?.nome ?? "",
    profissionalDoc: profissionalResponsavel?.documento ?? "",
    auxiliares,
    situacao: dados?.situacao ?? "Ativo",
  }, {
    id: "vacinador-exemplo",
    vinculo: "Auxiliar",
    aderidoPasa: "Sim",
    vacinadorSelecionado: PESSOAS_MOCK[0],
    nome: PESSOAS_MOCK[0].nome,
    cpf: PESSOAS_MOCK[0].documento,
    profissionalResponsavel: PROFISSIONAIS_RESPONSAVEIS_MOCK[0],
    profissionalNome: PROFISSIONAIS_RESPONSAVEIS_MOCK[0].nome,
    profissionalDoc: PROFISSIONAIS_RESPONSAVEIS_MOCK[0].documento,
    auxiliares: [],
    situacao: "Ativo",
  });

  const trocarVinculo = (novoVinculo: string) => {
    setVinculo(novoVinculo as TipoVinculo);
    setVacinadorSelecionado(null);
    if (novoVinculo !== "Veterinário Cadastrado") setAuxiliares([]);
  };

  const selecionarVacinador = (pessoa: PessoaSelecionada | null) => {
    setVacinadorSelecionado(pessoa);
  };

  const salvar = () => setIsSucesso(true);

  return (
    <div className={cadastroVacinacaoPageClass(mode, "min-h-screen bg-[#f2f3f5] pb-16")}>
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="vacinador-brucelose"
        hideSearch
      />

      <main className="mx-auto flex max-w-[1088px] flex-col gap-5 px-4 py-6 md:px-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("vacinador")}
            className="mb-3 flex items-center gap-1 text-sm text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todos os Vacinadores Contra Brucelose
          </button>
          <CadastroVacinacaoHeader
            mode={mode}
            nomeCadastro="Vacinador Contra Brucelose"
            rotaEditar="editar-vacinador-brucelose"
            dados={registroAtual}
            onNavigate={onNavigate}
            onSubmit={salvar}
          />
        </div>

        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Info size={20} className="shrink-0 text-gray-500 stroke-[2.5]" />
          <p className="text-sm font-medium text-gray-600">
            Campos indicados com <span className="font-bold text-red-500">*</span> são obrigatórios.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            <div className="w-full md:w-1/2">
              <FloatSelect
                label="Tipo de Vínculo"
                required
                value={vinculo}
                onChange={trocarVinculo}
                options={[
                  { value: "Produtor", label: "Produtor" },
                  { value: "Veterinário Cadastrado", label: "Veterinário Cadastrado" },
                  { value: "Auxiliar", label: "Auxiliar" },
                ]}
              />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <PessoaFisicaInput
                value={vacinadorSelecionado?.nome ?? ""}
                data={pessoasDisponiveis}
                required
                onChange={selecionarVacinador}
                onEyeClick={() => vacinadorSelecionado && onNavigate("visualizar-pessoa-fisica", vacinadorSelecionado)}
              />
            </div>
          </div>
        </Section>

        <Section title="Programa de Apoio à Saúde Agropecuária (PASA)">
          <div className="flex flex-col gap-6">
            <div className="w-full md:w-1/2">
              <SimNao
                label="É Aderido ao PASA?"
                name="aderido-pasa"
                required
                value={aderidoPasa}
                onChange={(valor) => {
                  setAderidoPasa(valor ? "Sim" : "Não");
                  if (!valor && vinculo !== "Auxiliar") setProfissionalResponsavel(null);
                }}
              />
            </div>

            {(aderidoPasa === "Sim" || vinculo === "Auxiliar") && (
              <div className="border-t border-gray-100 pt-5">
                <ProfissionalAnimalInput
                  value={profissionalResponsavel?.nome ?? ""}
                  data={profissionaisDisponiveis}
                  required
                  onChange={setProfissionalResponsavel}
                  onEyeClick={() => profissionalResponsavel && onNavigate("visualizar-profissional-animal", profissionalResponsavel)}
                />
              </div>
            )}
          </div>
        </Section>

        {vinculo === "Veterinário Cadastrado" && (
          <Section title="Auxiliares Vinculados">
            <DynamicListWrapper
              items={auxiliares}
              behavior="optional"
              addButtonLabel="Adicionar Auxiliar"
              itemLabel="Auxiliar"
              onAddItem={() => setAuxiliares((atuais) => [
                ...atuais,
                { uid: criarUid(), profissional: null },
              ])}
              onRemoveItem={(indice) => setAuxiliares((atuais) =>
                atuais.filter((_, indiceAtual) => indiceAtual !== indice)
              )}
              variant="plain"
              showCounter
            >
              {(item: AuxiliarFormItem) => (
                <PessoaFisicaInput
                  value={item.profissional?.nome ?? ""}
                  data={PESSOAS_MOCK}
                  required
                  onChange={(profissional) => setAuxiliares((atuais) =>
                    atuais.map((atual) => atual.uid === item.uid ? { ...atual, profissional } : atual)
                  )}
                  onEyeClick={() => item.profissional && onNavigate("visualizar-pessoa-fisica", item.profissional)}
                />
              )}
            </DynamicListWrapper>
          </Section>
        )}
      </main>

      {isSucesso && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {mensagemSucessoCadastro(mode, "Vacinador Contra Brucelose")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              O registro foi {mode === "edit" ? "atualizado" : "inserido"} no sistema.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("vacinador"); }}
                className="h-11 rounded-md border border-[#1A7A3C] px-5 text-sm font-semibold text-[#1A7A3C] transition hover:bg-green-50/40"
              >
                Ir para Listagem
              </button>
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-vacinador-brucelose", registroAtual); }}
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
