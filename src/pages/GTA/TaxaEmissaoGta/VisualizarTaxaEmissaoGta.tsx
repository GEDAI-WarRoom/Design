import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  FileText,
  MoreVertical,
  Tag,
  Pencil,
  PlusCircle,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  ModalBase,
  Tabs,
  AccordionCardGroup,
} from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

export interface TaxaFinalidade {
  id: string;
  finalidade: string;
  especie: string;
  valor: string;
  situacao: "Ativo" | "Inativo";
  atualizadoEm: string;
  dataVigencia?: string;
  tipoProcedencia?: string;
  cobraGtaDentroEstado?: "Sim" | "Não";
  cobraGtaForaEstado?: "Sim" | "Não";
  contribucaoFundoPrivado?: "Sim" | "Não";
  tipoCobranca?: "Por Cabeça" | "Por Documento" | "Por Quantidade";
  itemReceita?: string;
  quantidadeAnimais?: string;
  porCabecaOpcao?: "Acima de" | "A cada" | "Até";
  itemReceitaCabeca?: string;
  itemReceitaDocumento?: string;
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

function formatarData(data?: string) {
  if (!data) return "Não se aplica";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${data}T00:00:00Z`)
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition ${
          open ? "rounded-t-xl" : "rounded-xl"
        }`}
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

/* ──────────────────────────────────────────────────────────────────────────
   CARD REAPROVEITADO (MESMO ESTRUTURAL DA ABA PROFISSIONAIS)
   ────────────────────────────────────────────────────────────────────────── */
function ProfessionalCard({
  item,
  onView,
}: {
  item: {
    id: string;
    nome: string;
    documento: string;
    tipo: string;
    situacao: "Ativo" | "Inativo";
    atualizadoEm: string;
    dataArt?: string;
  };
  onView: () => void;
}) {
  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden min-w-0 w-full">
      <div className="h-1 bg-[#1A7A3C]" />
      <div className="p-4 flex flex-col gap-3 min-h-[150px]">
        <div className="flex justify-between gap-3 text-[10px] text-gray-500 items-center">
          <span className="flex items-center gap-1">
            <strong>Atualizado:</strong> {formatarData(item.atualizadoEm)}
          </span>
          <span
            className={
              item.situacao === "Ativo"
                ? "text-[#1A7A3C] font-semibold"
                : "text-gray-400"
            }
          >
            {item.situacao}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <Tag size={19} className="text-[#1A7A3C]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {item.nome}
            </p>
            <p className="text-xs font-semibold text-[#1A7A3C]">
              {item.documento}
            </p>
            <p className="text-xs text-gray-500">{item.tipo}</p>
          </div>
        </div>

        {item.dataArt && (
          <div className="flex items-start gap-3">
            <Calendar size={19} className="text-[#1A7A3C] shrink-0" />
            <div>
              <p className="text-sm text-gray-800">
                {formatarData(item.dataArt)}
              </p>
              <p className="text-[10px] text-gray-500">Data de Vigência</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="h-9 px-6 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
        >
          Visualizar
        </button>
        <MoreVertical size={19} className="text-gray-500 cursor-pointer" />
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT: VisualizarTaxaEmissaoGtaPage
   ────────────────────────────────────────────────────────────────────────── */
export function VisualizarTaxaEmissaoGtaPage({
  onLogout,
  onNavigate,
  dados,
}: PageProps) {
  const [activeTab, setActiveTab] = useState("taxasFinalidade");

  // Lista principal controlada por estado
  const [taxasState, setTaxasState] = useState<TaxaFinalidade[]>(
    () =>
      dados?.taxas || [
        {
          id: "1",
          finalidade: "Abate",
          especie: "Bovinos e Bubalinos",
          valor: "R$ 12,50",
          situacao: "Ativo",
          atualizadoEm: "2024-03-15",
          dataVigencia: "2024-01-01",
          tipoProcedencia: "Propriedade Rural",
          cobraGtaDentroEstado: "Sim",
          cobraGtaForaEstado: "Sim",
          contribucaoFundoPrivado: "Não",
          tipoCobranca: "Por Cabeça",
          porCabecaOpcao: "Até",
          itemReceitaCabeca: "Receita Gado Abate",
        },
        {
          id: "2",
          finalidade: "Reprodução / Matriz",
          especie: "Bovinos e Bubalinos",
          valor: "R$ 18,00",
          situacao: "Ativo",
          atualizadoEm: "2024-02-10",
          dataVigencia: "2024-01-01",
          tipoProcedencia: "Propriedade Rural",
          cobraGtaDentroEstado: "Sim",
          cobraGtaForaEstado: "Não",
          contribucaoFundoPrivado: "Sim",
          tipoCobranca: "Por Documento",
          itemReceitaDocumento: "Receita Matriz Bovinos",
        },
        {
          id: "3",
          finalidade: "Exposição / Feira",
          especie: "Bovinos e Bubalinos",
          valor: "R$ 10,00",
          situacao: "Inativo",
          atualizadoEm: "2023-11-20",
          dataVigencia: "2023-01-01",
          tipoProcedencia: "Evento / Feira",
          cobraGtaDentroEstado: "Sim",
          cobraGtaForaEstado: "Sim",
          contribucaoFundoPrivado: "Não",
          tipoCobranca: "Por Quantidade",
          quantidadeAnimais: "50",
          itemReceita: "Receita Eventos Bovinos",
        },
        {
          id: "4",
          finalidade: "Abate",
          especie: "Suínos",
          valor: "R$ 8,50",
          situacao: "Ativo",
          atualizadoEm: "2024-01-18",
          dataVigencia: "2024-01-01",
          tipoProcedencia: "Granja",
          cobraGtaDentroEstado: "Sim",
          cobraGtaForaEstado: "Sim",
          contribucaoFundoPrivado: "Não",
          tipoCobranca: "Por Cabeça",
          porCabecaOpcao: "A cada",
        },
        {
          id: "5",
          finalidade: "Engorda",
          especie: "Suínos",
          valor: "R$ 6,00",
          situacao: "Inativo",
          atualizadoEm: "2023-09-05",
          dataVigencia: "2023-01-01",
          tipoProcedencia: "Granja",
          cobraGtaDentroEstado: "Sim",
          cobraGtaForaEstado: "Não",
          contribucaoFundoPrivado: "Não",
          tipoCobranca: "Por Quantidade",
          quantidadeAnimais: "100",
          itemReceita: "Receita Engorda Suínos",
        },
      ]
  );

  // Estados do Modal e Formulário
  const [modalOpen, setModalOpen] = useState(false);
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [editingTaxaId, setEditingTaxaId] = useState<string | null>(null);

  const [especie, setEspecie] = useState("Bovinos e Bubalinos");
  const [finalidade, setFinalidade] = useState("");
  const [tipoProcedencia, setTipoProcedencia] = useState("");
  const [cobraGtaDentroEstado, setCobraGtaDentroEstado] = useState<"Sim" | "Não">("Sim");
  const [cobraGtaForaEstado, setCobraGtaForaEstado] = useState<"Sim" | "Não">("Sim");
  const [contribucaoFundoPrivado, setContribucaoFundoPrivado] = useState<"Sim" | "Não">("Não");
  const [tipoCobranca, setTipoCobranca] = useState<
    "Por Cabeça" | "Por Documento" | "Por Quantidade"
  >("Por Cabeça");
  const [dataInicioVigencia, setDataInicioVigencia] = useState("");
  const [itemReceita, setItemReceita] = useState("");
  const [quantidadeAnimais, setQuantidadeAnimais] = useState("");
  const [porCabecaOpcao, setPorCabecaOpcao] = useState<"Acima de" | "A cada" | "Até">("Até");
  const [itemReceitaCabeca, setItemReceitaCabeca] = useState("");
  const [itemReceitaDocumento, setItemReceitaDocumento] = useState("");
  const [valor, setValor] = useState("");
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">("Ativo");
  const [erro, setErro] = useState("");

  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (isActive: boolean) => (
        <FileText
          size={19}
          className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
    {
      id: "taxasFinalidade",
      label: "Taxas por Finalidade",
      icon: (isActive: boolean) => (
        <Tag
          size={19}
          className={isActive ? "text-[#1A7A3C]" : "text-gray-400"}
        />
      ),
    },
  ];

  // Separação por Espécie e Situação
  const bovinosAtivos = taxasState.filter(
    (t) => t.especie === "Bovinos e Bubalinos" && t.situacao === "Ativo"
  );
  const bovinosInativos = taxasState.filter(
    (t) => t.especie === "Bovinos e Bubalinos" && t.situacao === "Inativo"
  );

  const suinosAtivos = taxasState.filter(
    (t) => t.especie === "Suínos" && t.situacao === "Ativo"
  );
  const suinosInativos = taxasState.filter(
    (t) => t.especie === "Suínos" && t.situacao === "Inativo"
  );

  // Abertura do Modal de Novo Cadastro (inspirado na Revendedora)
  const abrirNovoCadastroTaxa = () => {
    setEditingTaxaId(null);
    setEspecie("Bovinos e Bubalinos");
    setFinalidade("");
    setTipoProcedencia("");
    setCobraGtaDentroEstado("Sim");
    setCobraGtaForaEstado("Sim");
    setContribucaoFundoPrivado("Não");
    setTipoCobranca("Por Cabeça");
    setDataInicioVigencia("");
    setItemReceita("");
    setQuantidadeAnimais("");
    setPorCabecaOpcao("Até");
    setItemReceitaCabeca("");
    setItemReceitaDocumento("");
    setValor("");
    setSituacao("Ativo");
    setErro("");
    setSomenteLeitura(false);
    setModalOpen(true);
  };

  // Abertura do Modal em modo Visualização/Edição
  const abrirVisualizacao = (taxa: TaxaFinalidade) => {
    setEditingTaxaId(taxa.id);
    setEspecie(taxa.especie);
    setFinalidade(taxa.finalidade);
    setTipoProcedencia(taxa.tipoProcedencia || "");
    setCobraGtaDentroEstado(taxa.cobraGtaDentroEstado || "Sim");
    setCobraGtaForaEstado(taxa.cobraGtaForaEstado || "Sim");
    setContribucaoFundoPrivado(taxa.contribucaoFundoPrivado || "Não");
    setTipoCobranca(taxa.tipoCobranca || "Por Cabeça");
    setDataInicioVigencia(taxa.dataVigencia || "");
    setItemReceita(taxa.itemReceita || "");
    setQuantidadeAnimais(taxa.quantidadeAnimais || "");
    setPorCabecaOpcao(taxa.porCabecaOpcao || "Até");
    setItemReceitaCabeca(taxa.itemReceitaCabeca || "");
    setItemReceitaDocumento(taxa.itemReceitaDocumento || "");
    setValor(taxa.valor || "");
    setSituacao(taxa.situacao);
    setErro("");
    setSomenteLeitura(true);
    setModalOpen(true);
  };

  // Processo de Salvamento com Validações da História do Usuário
  const handleSalvarTaxa = () => {
    if (somenteLeitura) {
      setSomenteLeitura(false);
      return;
    }

    if (!finalidade.trim()) {
      setErro("Informe o tipo de finalidade.");
      return;
    }

    if (!dataInicioVigencia) {
      setErro("Informe a data de início de vigência.");
      return;
    }

    // Regra de Negócio HU: Não cadastrar duplicado para a mesma espécie/finalidade
    const jaExiste = taxasState.find(
      (t) =>
        t.id !== editingTaxaId &&
        t.especie === especie &&
        t.finalidade.toLowerCase().trim() === finalidade.toLowerCase().trim() &&
        t.situacao === "Ativo"
    );

    if (jaExiste && situacao === "Ativo") {
      setErro(
        `Já existe uma taxa ativa cadastrada para a espécie "${especie}" e finalidade "${finalidade}".`
      );
      return;
    }

    const hoje = new Date().toISOString().slice(0, 10);

    const novaTaxa: TaxaFinalidade = {
      id: editingTaxaId || `taxa-${Date.now()}`,
      especie,
      finalidade,
      tipoProcedencia,
      cobraGtaDentroEstado,
      cobraGtaForaEstado,
      contribucaoFundoPrivado,
      tipoCobranca,
      dataVigencia: dataInicioVigencia,
      itemReceita,
      quantidadeAnimais,
      porCabecaOpcao,
      itemReceitaCabeca,
      itemReceitaDocumento,
      valor: valor ? (valor.startsWith("R$") ? valor : `R$ ${valor}`) : "R$ 0,00",
      situacao,
      atualizadoEm: hoje,
    };

    if (editingTaxaId) {
      setTaxasState((prev) =>
        prev.map((item) => (item.id === editingTaxaId ? novaTaxa : item))
      );
    } else {
      setTaxasState((prev) => [novaTaxa, ...prev]);
    }

    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentScreen="taxa-emissao-gta"
        hideSearch
      />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <header>
          <button
            type="button"
            onClick={() => onNavigate("taxa-emissao-gta")}
            className="flex items-center gap-1 text-sm mb-4 text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todas as Taxas de Emissão de GTA
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Visualizar Taxa de Emissão de GTA
              </h1>
            </div>

            {/* BOTÃO ADICIONAR TAXA NA ABA DE TAXAS POR FINALIDADE (Inspirado na Revendedora) */}
            {activeTab === "taxasFinalidade" && (
              <button
                type="button"
                onClick={abrirNovoCadastroTaxa}
                className="h-10 px-5 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold flex items-center gap-2 transition"
              >
                Adicionar Taxa Por Finalidade
              </button>
            )}

            {activeTab === "cadastro" && (
              <button
                type="button"
                onClick={() => onNavigate("editar-taxa-emissao-gta", dados)}
                className="h-10 px-6 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold flex items-center gap-2 transition"
              >
                <Pencil size={16} /> Editar
              </button>
            )}
          </div>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ─── ABA CADASTRO ─── */}
        {activeTab === "cadastro" && (
          <div className="flex flex-col gap-4">
            <Section title="Informações Gerais">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatInput
                  label="Código da Tabela"
                  value={dados?.codigo || "TAX-2024-001"}
                  disabled
                />
                <FloatInput
                  label="Descrição"
                  value={dados?.descricao || "Tabela Geral de Emissão de GTA"}
                  disabled
                />
                <FloatInput
                  label="Ano Vigência"
                  value={dados?.ano || "2024"}
                  disabled
                />
                <FloatInput
                  label="Situação"
                  value={dados?.situacao || "Ativo"}
                  disabled
                />
              </div>
            </Section>
          </div>
        )}

        {/* ─── ABA TAXAS POR FINALIDADE ─── */}
        {activeTab === "taxasFinalidade" && (
          <div className="flex flex-col gap-5">
            {/* GRUPO 1: Bovinos e Bubalinos */}
            <AccordionCardGroup
              title="Bovinos e Bubalinos"
              activeCountText={`${bovinosAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Taxas"
              icon={<Tag size={21} />}
              historicoChildren={bovinosInativos.map((item) => (
                <ProfessionalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    nome: item.finalidade,
                    documento: `Valor: ${item.valor}`,
                    tipo: item.especie,
                    situacao: item.situacao,
                    atualizadoEm: item.atualizadoEm,
                    dataArt: item.dataVigencia,
                  }}
                  onView={() => abrirVisualizacao(item)}
                />
              ))}
            >
              {bovinosAtivos.map((item) => (
                <ProfessionalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    nome: item.finalidade,
                    documento: `Valor: ${item.valor}`,
                    tipo: item.especie,
                    situacao: item.situacao,
                    atualizadoEm: item.atualizadoEm,
                    dataArt: item.dataVigencia,
                  }}
                  onView={() => abrirVisualizacao(item)}
                />
              ))}
            </AccordionCardGroup>

            {/* GRUPO 2: Suínos */}
            <AccordionCardGroup
              title="Suínos"
              activeCountText={`${suinosAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Taxas"
              icon={<Tag size={21} />}
              historicoChildren={suinosInativos.map((item) => (
                <ProfessionalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    nome: item.finalidade,
                    documento: `Valor: ${item.valor}`,
                    tipo: item.especie,
                    situacao: item.situacao,
                    atualizadoEm: item.atualizadoEm,
                    dataArt: item.dataVigencia,
                  }}
                  onView={() => abrirVisualizacao(item)}
                />
              ))}
            >
              {suinosAtivos.map((item) => (
                <ProfessionalCard
                  key={item.id}
                  item={{
                    id: item.id,
                    nome: item.finalidade,
                    documento: `Valor: ${item.valor}`,
                    tipo: item.especie,
                    situacao: item.situacao,
                    atualizadoEm: item.atualizadoEm,
                    dataArt: item.dataVigencia,
                  }}
                  onView={() => abrirVisualizacao(item)}
                />
              ))}
            </AccordionCardGroup>
          </div>
        )}
      </main>

      {/* ─── MODAL DE CADASTRO / EDICÃO / VISUALIZAÇÃO DE TAXA POR FINALIDADE ─── */}
      <ModalBase
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSalvarTaxa}
        title={
          editingTaxaId
            ? somenteLeitura
              ? "Visualizar Taxa por Finalidade"
              : "Editar Taxa por Finalidade"
            : "Adicionar Taxa Por Finalidade"
        }
        subtitle="Preencha as informações para cadastrar a taxa conforme a finalidade de trânsito."
        icon={<Tag size={24} color={GREEN} />}
        saveText={somenteLeitura ? "Editar" : "Salvar"}
        width="820px"
      >
        <div className="flex flex-col gap-6 w-full pt-2">
          {/* SEÇÃO 1: Dados da Finalidade e Trânsito */}
          <Section title="Informações do Trânsito e Finalidade" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatSelect
                label="Espécie"
                required
                value={especie}
                onChange={(val) => setEspecie(val)}
                options={[
                  { value: "Bovinos e Bubalinos", label: "Bovinos e Bubalinos" },
                  { value: "Suínos", label: "Suínos" },
                  { value: "Aves", label: "Aves" },
                  { value: "Caprinos / Ovinos", label: "Caprinos / Ovinos" },
                  { value: "Eqüídeos", label: "Eqüídeos" },
                ]}
                disabled={somenteLeitura || !!editingTaxaId}
              />

              <FloatInput
                label="Tipo de Finalidade"
                required
                value={finalidade}
                onChange={setFinalidade}
                placeholder="Ex: Abate, Reprodução, Feira"
                disabled={somenteLeitura}
              />

              <FloatInput
                label="Tipo de Procedência"
                value={tipoProcedencia}
                onChange={setTipoProcedencia}
                placeholder="Ex: Propriedade Rural, Leilão"
                disabled={somenteLeitura}
              />

              <FloatSelect
                label="Cobra Taxa GTA Dentro do Estado?"
                value={cobraGtaDentroEstado}
                onChange={(val) => setCobraGtaDentroEstado(val as "Sim" | "Não")}
                options={[
                  { value: "Sim", label: "Sim" },
                  { value: "Não", label: "Não" },
                ]}
                disabled={somenteLeitura}
              />

              <FloatSelect
                label="Cobra Taxa GTA Fora do Estado?"
                value={cobraGtaForaEstado}
                onChange={(val) => setCobraGtaForaEstado(val as "Sim" | "Não")}
                options={[
                  { value: "Sim", label: "Sim" },
                  { value: "Não", label: "Não" },
                ]}
                disabled={somenteLeitura}
              />

              <FloatSelect
                label="Contribuição ao Fundo Privado?"
                value={contribucaoFundoPrivado}
                onChange={(val) =>
                  setContribucaoFundoPrivado(val as "Sim" | "Não")
                }
                options={[
                  { value: "Sim", label: "Sim" },
                  { value: "Não", label: "Não" },
                ]}
                disabled={somenteLeitura}
              />
            </div>
          </Section>

          {/* SEÇÃO 2: Regras e Itens de Cobrança */}
          <Section title="Regras de Cobrança" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatSelect
                label="Tipo de Cobrança"
                required
                value={tipoCobranca}
                onChange={(val) =>
                  setTipoCobranca(
                    val as "Por Cabeça" | "Por Documento" | "Por Quantidade"
                  )
                }
                options={[
                  { value: "Por Cabeça", label: "Por Cabeça" },
                  { value: "Por Documento", label: "Por Documento" },
                  { value: "Por Quantidade", label: "Por Quantidade" },
                ]}
                disabled={somenteLeitura}
              />

              <FloatInput
                label="Data Início de Vigência"
                type="date"
                required
                value={dataInicioVigencia}
                onChange={setDataInicioVigencia}
                disabled={somenteLeitura}
              />

              {/* CAMPOS CONDICIONAIS PARA "POR QUANTIDADE" */}
              {tipoCobranca === "Por Quantidade" && (
                <>
                  <FloatInput
                    label="Item de Receita"
                    required
                    value={itemReceita}
                    onChange={setItemReceita}
                    placeholder="Selecione/Informe o item de receita"
                    disabled={somenteLeitura}
                  />
                  <FloatInput
                    label="Quantidade de Animais"
                    type="number"
                    required
                    value={quantidadeAnimais}
                    onChange={setQuantidadeAnimais}
                    placeholder="Até 255"
                    disabled={somenteLeitura}
                  />
                </>
              )}

              {/* CAMPOS CONDICIONAIS PARA "POR CABEÇA" */}
              {tipoCobranca === "Por Cabeça" && (
                <>
                  <FloatSelect
                    label="Por Cabeça"
                    required
                    value={porCabecaOpcao}
                    onChange={(val) =>
                      setPorCabecaOpcao(val as "Acima de" | "A cada" | "Até")
                    }
                    options={[
                      { value: "Acima de", label: "Acima de" },
                      { value: "A cada", label: "A cada" },
                      { value: "Até", label: "Até" },
                    ]}
                    disabled={somenteLeitura}
                  />

                  {(porCabecaOpcao === "Até" ||
                    porCabecaOpcao === "Acima de") && (
                    <FloatInput
                      label="Item de Receita por Cabeça"
                      required
                      value={itemReceitaCabeca}
                      onChange={setItemReceitaCabeca}
                      placeholder="Informe o item de receita"
                      disabled={somenteLeitura}
                    />
                  )}
                </>
              )}

              {/* CAMPOS CONDICIONAIS PARA "POR DOCUMENTO" */}
              {tipoCobranca === "Por Documento" && (
                <>
                  <FloatInput
                    label="Por Documento"
                    value="Por Documento"
                    disabled
                  />
                  <FloatInput
                    label="Item de Receita por Documento"
                    required
                    value={itemReceitaDocumento}
                    onChange={setItemReceitaDocumento}
                    placeholder="Informe o item de receita"
                    disabled={somenteLeitura}
                  />
                </>
              )}

              <FloatInput
                label="Valor da Taxa (R$)"
                value={valor}
                onChange={setValor}
                placeholder="Ex: 12,50"
                disabled={somenteLeitura}
              />

              <FloatSelect
                label="Situação"
                required
                value={situacao}
                onChange={(val) => setSituacao(val as "Ativo" | "Inativo")}
                options={[
                  { value: "Ativo", label: "Ativo" },
                  { value: "Inativo", label: "Inativo" },
                ]}
                disabled={somenteLeitura}
              />
            </div>
          </Section>

          {erro && <p className="text-sm font-medium text-red-600 px-1">{erro}</p>}
        </div>
      </ModalBase>
    </div>
  );
}