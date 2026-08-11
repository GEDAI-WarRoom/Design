import { useEffect, useState } from "react";
import { CalendarClock, Landmark } from "lucide-react";
import { AccordionCardGroup, FloatInput, FloatSelect, ModalBase } from "./FormKit";

export type TipoFundoArrecadacao = "Recolhimento ao estado" | "Privado" | "";

export interface HistoricoOpcaoRecolhimento {
  id: string;
  tipoFundoArrecadacao: Exclude<TipoFundoArrecadacao, "">;
  numeroTermo: string;
  usuarioCadastro: string;
  dataCadastro: string;
  usuarioAlteracao: string;
  dataAlteracao: string;
  dataValidade: string;
  situacao: "Ativo" | "Inativo";
}

export interface OpcaoRecolhimento {
  tipoFundoArrecadacao: TipoFundoArrecadacao;
  numeroTermo: string;
  historico: HistoricoOpcaoRecolhimento[];
}

interface OpcaoRecolhimentoTabProps {
  entityKey: string;
  value: OpcaoRecolhimento;
  onChange: (value: OpcaoRecolhimento) => void;
  addRequestKey?: number;
}

const opcoesPorEntidade = new Map<string, OpcaoRecolhimento>();

const TIPO_FUNDO_OPTIONS = [
  { value: "Recolhimento ao estado", label: "Recolhimento ao estado" },
  { value: "Privado", label: "Privado" },
];

function copiarOpcao(opcao: OpcaoRecolhimento): OpcaoRecolhimento {
  return { ...opcao, historico: (opcao.historico || []).map((item) => ({ ...item })) };
}

function dataHoraAtual() {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  }).format(new Date());
}

function OpcaoCard({ item, onView }: { item: HistoricoOpcaoRecolhimento; onView: () => void }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
      <div className="h-1 bg-[#1A7A3C]" />
      <div className="flex min-h-[172px] flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3 text-[10px] text-gray-500">
          <span><strong>Atualizado:</strong> {item.dataAlteracao}</span>
          <span>{item.situacao}</span>
        </div>
        <div className="flex items-start gap-3">
          <Landmark size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{item.tipoFundoArrecadacao}</p>
            <p className="text-xs text-gray-500">Tipo do fundo de arrecadação</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-800">{item.numeroTermo}</p>
            <p className="text-[10px] text-gray-500">Número do termo</p>
          </div>
          <div>
            <p className="text-sm text-gray-800">{item.dataValidade}</p>
            <p className="text-[10px] text-gray-500">Data de validade</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={onView}
          className="h-9 rounded bg-[#1A7A3C] px-6 text-sm font-semibold text-white transition hover:bg-[#15612F]"
        >
          Visualizar
        </button>
      </div>
    </article>
  );
}

export function OpcaoRecolhimentoTab({ entityKey, value, onChange, addRequestKey = 0 }: OpcaoRecolhimentoTabProps) {
  const [opcoes, setOpcoes] = useState<OpcaoRecolhimento>(() => {
    if (!opcoesPorEntidade.has(entityKey)) opcoesPorEntidade.set(entityKey, copiarOpcao(value));
    return copiarOpcao(opcoesPorEntidade.get(entityKey)!);
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [opcaoVisualizada, setOpcaoVisualizada] = useState<HistoricoOpcaoRecolhimento | null>(null);
  const [tipoFundo, setTipoFundo] = useState<TipoFundoArrecadacao>("");
  const [erro, setErro] = useState("");

  const atualizarOpcoes = (proximas: OpcaoRecolhimento) => {
    const copia = copiarOpcao(proximas);
    opcoesPorEntidade.set(entityKey, copia);
    setOpcoes(copia);
    onChange(copia);
  };

  const abrirAdicionar = () => {
    setOpcaoVisualizada(null);
    setTipoFundo("");
    setErro("");
    setModalOpen(true);
  };

  useEffect(() => {
    if (addRequestKey > 0) abrirAdicionar();
  }, [addRequestKey]);

  const abrirVisualizacao = (opcao: HistoricoOpcaoRecolhimento) => {
    setOpcaoVisualizada(opcao);
    setTipoFundo(opcao.tipoFundoArrecadacao);
    setErro("");
    setModalOpen(true);
  };

  const salvar = () => {
    if (!tipoFundo) {
      setErro("Selecione o tipo do fundo de arrecadação.");
      return;
    }

    const agora = dataHoraAtual();
    const novaOpcao: HistoricoOpcaoRecolhimento = {
      id: `opcao-recolhimento-${Date.now()}`,
      tipoFundoArrecadacao: tipoFundo,
      numeroTermo: "",
      usuarioCadastro: "Usuário atual",
      dataCadastro: agora,
      usuarioAlteracao: "Usuário atual",
      dataAlteracao: agora,
      dataValidade: "Indeterminado",
      situacao: "Ativo",
    };
    const historicoAtualizado = [
      novaOpcao,
      ...opcoes.historico.map((item) => item.situacao === "Ativo"
        ? { ...item, situacao: "Inativo" as const, usuarioAlteracao: "Usuário atual", dataAlteracao: agora }
        : item),
    ];

    atualizarOpcoes({
      tipoFundoArrecadacao: tipoFundo,
      numeroTermo: novaOpcao.numeroTermo,
      historico: historicoAtualizado,
    });
    setModalOpen(false);
  };

  const ativas = opcoes.historico.filter((item) => item.situacao === "Ativo");
  const inativas = opcoes.historico.filter((item) => item.situacao === "Inativo");

  return (
    <>
      <div className="animate-fadeIn flex flex-col gap-5">
        <AccordionCardGroup
          title="Opções de recolhimento"
          activeCountText={`${ativas.length} ${ativas.length === 1 ? "opção ativa" : "opções ativas"}`}
          variant="sem-vinculacao"
          grid="unico"
          icon={<Landmark size={21} />}
          historicoTitle="Histórico de opções de recolhimento"
          historicoChildren={inativas.map((item) => (
            <OpcaoCard key={item.id} item={item} onView={() => abrirVisualizacao(item)} />
          ))}
        >
          {ativas.map((item) => (
            <OpcaoCard key={item.id} item={item} onView={() => abrirVisualizacao(item)} />
          ))}
        </AccordionCardGroup>
      </div>

      <ModalBase
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={opcaoVisualizada ? "Visualizar Opção de Recolhimento" : "Adicionar Opção de Recolhimento"}
        subtitle={opcaoVisualizada ? "Informações da opção de recolhimento." : "Preencha os campos para adicionar uma nova opção de recolhimento."}
        icon={<CalendarClock size={24} />}
        width="720px"
        cancelText={opcaoVisualizada ? "Fechar" : "Cancelar"}
        onSave={opcaoVisualizada ? undefined : salvar}
        saveText="Salvar"
      >
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">Informações básicas</h2>
          </div>
          <div className="p-6">
            {opcaoVisualizada ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FloatInput label="Tipo do fundo de arrecadação" value={opcaoVisualizada.tipoFundoArrecadacao} disabled />
                <FloatInput label="Número do termo" value={opcaoVisualizada.numeroTermo} disabled />
                <FloatInput label="Usuário de cadastro" value={opcaoVisualizada.usuarioCadastro} disabled />
                <FloatInput label="Data de cadastro" value={opcaoVisualizada.dataCadastro} disabled />
                <FloatInput label="Usuário de alteração" value={opcaoVisualizada.usuarioAlteracao} disabled />
                <FloatInput label="Data de alteração" value={opcaoVisualizada.dataAlteracao} disabled />
                <FloatInput label="Data de validade" value={opcaoVisualizada.dataValidade} disabled />
                <FloatInput label="Situação" value={opcaoVisualizada.situacao} disabled />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="max-w-md">
                  <FloatSelect
                    label="Tipo do fundo de arrecadação"
                    required
                    value={tipoFundo}
                    onChange={(tipo) => {
                      setTipoFundo(tipo as TipoFundoArrecadacao);
                      setErro("");
                    }}
                    options={TIPO_FUNDO_OPTIONS}
                  />
                </div>
                {erro && <p className="text-sm text-red-600">{erro}</p>}
              </div>
            )}
          </div>
        </section>
      </ModalBase>
    </>
  );
}
