import { useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Calendar,
  Eye,
  PawPrint,
  Sprout,
  User,
  UsersRound,
} from "lucide-react";
import {
  AccordionCardGroup,
  FloatInput,
  FloatSelect,
  ModalBase,
  UploadField,
} from "./FormKit";
import { EntitySearchInput } from "./EntitySearch";
import {
  PESSOAS_FISICAS_DISPONIVEIS,
  PROFISSIONAIS_ANIMAL,
  PROFISSIONAIS_VEGETAL,
} from "../../pages/Geral/RevendedoraAgropecuaria/profissionais";

export type TipoProfissionalEntidade =
  | "Responsável Técnico Animal"
  | "Responsável Técnico Vegetal"
  | "Habilitado para Emissão de GTA"
  | "Habilitado para Emissão de PTV"
  | "Funcionário";

export interface ProfissionalEntidade {
  id: string;
  tipo: TipoProfissionalEntidade;
  nome: string;
  documento: string;
  dataArt?: string;
  arquivoArt?: string;
  situacao: "Ativo" | "Inativo";
  atualizadoEm: string;
}

interface EntityProfessionalsTabProps {
  entityKey: string;
  allowedTypes: TipoProfissionalEntidade[];
  onNavigate: (screen: any, data?: any) => void;
  initialProfessionals?: ProfissionalEntidade[];
}

const registrosPorEntidade = new Map<string, ProfissionalEntidade[]>();

const TITULOS: Record<TipoProfissionalEntidade, string> = {
  "Responsável Técnico Animal": "Responsável Técnico da Área Animal",
  "Responsável Técnico Vegetal": "Responsável Técnico da Área Vegetal",
  "Habilitado para Emissão de GTA": "Habilitado para Emissão de GTA",
  "Habilitado para Emissão de PTV": "Habilitado para Emissão de PTV",
  Funcionário: "Funcionários",
};

const ROTULOS_BUSCA: Record<TipoProfissionalEntidade, string> = {
  "Responsável Técnico Animal": "Profissional da Área Animal",
  "Responsável Técnico Vegetal": "Profissional da Área Vegetal",
  "Habilitado para Emissão de GTA": "Profissional da Área Animal",
  "Habilitado para Emissão de PTV": "Profissional da Área Vegetal",
  Funcionário: "Funcionário",
};

function formatarData(data?: string) {
  if (!data) return "Não se aplica";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${data}T00:00:00Z`),
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function iconeTipo(tipo: TipoProfissionalEntidade) {
  if (tipo === "Responsável Técnico Vegetal" || tipo === "Habilitado para Emissão de PTV") {
    return <Sprout size={21} />;
  }
  if (tipo === "Habilitado para Emissão de GTA") return <BadgeCheck size={21} />;
  if (tipo === "Funcionário") return <UsersRound size={21} />;
  return <PawPrint size={21} />;
}

function ProfessionalCard({ item, onView }: { item: ProfissionalEntidade; onView: () => void }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
      <div className="h-1 bg-[#1A7A3C]" />
      <div className="flex min-h-[150px] flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3 text-[10px] text-gray-500">
          <span><strong>Atualizado:</strong> {formatarData(item.atualizadoEm)}</span>
          <span>{item.situacao}</span>
        </div>
        <div className="flex items-start gap-3">
          <User size={19} className="mt-0.5 shrink-0 text-[#1A7A3C]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{item.nome}</p>
            <p className="text-xs text-gray-500">{item.documento}</p>
            <p className="text-xs text-gray-500">{ROTULOS_BUSCA[item.tipo]}</p>
          </div>
        </div>
        {item.dataArt && (
          <div className="flex items-start gap-3">
            <Calendar size={19} className="shrink-0 text-[#1A7A3C]" />
            <div>
              <p className="text-sm text-gray-800">{formatarData(item.dataArt)}</p>
              <p className="text-[10px] text-gray-500">Data da ART</p>
            </div>
          </div>
        )}
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

export function EntityProfessionalsTab({
  entityKey,
  allowedTypes,
  onNavigate,
  initialProfessionals = [],
}: EntityProfessionalsTabProps) {
  const [registros, setRegistros] = useState<ProfissionalEntidade[]>(() => {
    if (!registrosPorEntidade.has(entityKey)) {
      registrosPorEntidade.set(entityKey, initialProfessionals.map((item) => ({ ...item })));
    }
    return registrosPorEntidade.get(entityKey)!.map((item) => ({ ...item }));
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [profissionalId, setProfissionalId] = useState("");
  const [tipo, setTipo] = useState<TipoProfissionalEntidade>(allowedTypes[0]);
  const [profissional, setProfissional] = useState<any | null>(null);
  const [dataArt, setDataArt] = useState("");
  const [arquivoArt, setArquivoArt] = useState("");
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">("Ativo");
  const [erro, setErro] = useState("");
  const [substituicaoPendente, setSubstituicaoPendente] = useState<{
    atual: ProfissionalEntidade;
    novo: ProfissionalEntidade;
  } | null>(null);

  const exigeArt = tipo === "Responsável Técnico Animal" || tipo === "Responsável Técnico Vegetal";

  const profissionaisAnimal = PROFISSIONAIS_ANIMAL.map((item) => ({
    id: item.id,
    nome: item.nome,
    documento: item.cpf,
    habilitacoes: item.habilitacoes,
  }));
  const profissionaisVegetal = PROFISSIONAIS_VEGETAL.map((item) => ({
    id: item.id,
    nome: item.nome,
    documento: item.documento,
    habilitacao: item.habilitacao,
  }));

  const dadosBusca = tipo === "Funcionário"
    ? PESSOAS_FISICAS_DISPONIVEIS
    : tipo === "Responsável Técnico Vegetal"
      ? profissionaisVegetal
      : tipo === "Habilitado para Emissão de PTV"
        ? profissionaisVegetal.filter((item) => item.habilitacao.toLowerCase().includes("ptv"))
        : tipo === "Habilitado para Emissão de GTA"
          ? profissionaisAnimal.filter((item) => item.habilitacoes.includes("Emissão de GTA"))
          : profissionaisAnimal;

  const abrirNovo = () => {
    setProfissionalId("");
    setTipo(allowedTypes[0]);
    setProfissional(null);
    setDataArt("");
    setArquivoArt("");
    setSituacao("Ativo");
    setErro("");
    setSomenteLeitura(false);
    setModalOpen(true);
  };

  const abrirProfissional = (item: ProfissionalEntidade) => {
    setProfissionalId(item.id);
    setTipo(item.tipo);
    setProfissional({ id: item.id, nome: item.nome, documento: item.documento });
    setDataArt(item.dataArt || "");
    setArquivoArt(item.arquivoArt || "");
    setSituacao(item.situacao);
    setErro("");
    setSomenteLeitura(true);
    setModalOpen(true);
  };

  const aplicarSalvamento = (novo: ProfissionalEntidade, atual?: ProfissionalEntidade) => {
    const base = atual
      ? registros.map((item) => item.id === atual.id
        ? { ...item, situacao: "Inativo" as const, atualizadoEm: novo.atualizadoEm }
        : item)
      : registros;
    const atualizados = base.some((item) => item.id === novo.id)
      ? base.map((item) => item.id === novo.id ? novo : item)
      : [...base, novo];
    registrosPorEntidade.set(entityKey, atualizados);
    setRegistros(atualizados);
    setSubstituicaoPendente(null);
    setModalOpen(false);
  };

  const salvar = () => {
    if (somenteLeitura) {
      setSomenteLeitura(false);
      return;
    }
    if (!profissional) {
      setErro("Selecione o profissional.");
      return;
    }
    if (exigeArt && (!dataArt || !arquivoArt)) {
      setErro("Informe a data e o arquivo da ART.");
      return;
    }
    const hoje = new Date().toISOString().slice(0, 10);
    if (dataArt && dataArt > hoje) {
      setErro("A data da ART não pode ser futura.");
      return;
    }
    const outroAtivo = registros.find(
      (item) => item.id !== profissionalId && item.tipo === tipo && item.situacao === "Ativo",
    );
    const novo: ProfissionalEntidade = {
      id: profissionalId || `prof-${Date.now()}`,
      tipo,
      nome: profissional.nome,
      documento: profissional.documento,
      dataArt: exigeArt ? dataArt : undefined,
      arquivoArt: exigeArt ? arquivoArt : undefined,
      situacao,
      atualizadoEm: hoje,
    };
    if (situacao === "Ativo" && outroAtivo) {
      setSubstituicaoPendente({ atual: outroAtivo, novo });
      return;
    }
    aplicarSalvamento(novo);
  };

  const visualizarCadastro = () => {
    if (!profissional) return;
    if (tipo === "Funcionário") onNavigate("visualizar-pessoa-fisica", profissional);
    else if (tipo === "Responsável Técnico Vegetal" || tipo === "Habilitado para Emissão de PTV") {
      onNavigate("visualizar-profissional-vegetal", profissional);
    } else onNavigate("visualizar-profissional-area-animal", profissional);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={abrirNovo}
            className="h-10 rounded bg-[#1A7A3C] px-5 text-sm font-semibold text-white transition hover:bg-[#15612F]"
          >
            Adicionar Profissional
          </button>
        </div>

        {allowedTypes.map((tipoGrupo) => {
          const ativos = registros.filter((item) => item.tipo === tipoGrupo && item.situacao === "Ativo");
          const inativos = registros.filter((item) => item.tipo === tipoGrupo && item.situacao === "Inativo");
          return (
            <AccordionCardGroup
              key={tipoGrupo}
              title={TITULOS[tipoGrupo]}
              activeCountText={`${ativos.length} ${ativos.length === 1 ? "cadastro ativo" : "cadastros ativos"}`}
              variant="sem-vinculacao"
              icon={iconeTipo(tipoGrupo)}
              historicoTitle={`Histórico de ${TITULOS[tipoGrupo]}`}
              historicoChildren={inativos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            >
              {ativos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            </AccordionCardGroup>
          );
        })}
      </div>

      <ModalBase
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={salvar}
        title={profissionalId ? "Visualizar Profissional" : "Adicionar Profissional"}
        subtitle="Preencha os campos para vincular um profissional à entidade."
        icon={<User size={24} color="#1A7A3C" />}
        saveText={somenteLeitura ? "Editar" : "Salvar"}
        width="820px"
      >
        <div className="flex w-full flex-col gap-6">
          <Section title="Informações Básicas">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatSelect
                  label="Tipo de Profissional"
                  required
                  value={tipo}
                  onChange={(value) => {
                    setTipo(value as TipoProfissionalEntidade);
                    setProfissional(null);
                    setDataArt("");
                    setArquivoArt("");
                  }}
                  options={allowedTypes.map((item) => ({ value: item, label: item }))}
                  disabled={!!profissionalId || somenteLeitura}
                />
              </div>

              {somenteLeitura ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FloatInput label={ROTULOS_BUSCA[tipo]} value={profissional?.nome || ""} disabled onChange={() => {}} />
                  <FloatInput label="CPF" value={profissional?.documento || ""} disabled onChange={() => {}} />
                </div>
              ) : (
                <div className="flex w-full items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <EntitySearchInput
                      label={ROTULOS_BUSCA[tipo]}
                      placeholder="Buscar por nome ou CPF"
                      value={profissional?.nome || ""}
                      data={dadosBusca}
                      searchKeys={["nome", "documento"]}
                      columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "documento" }]}
                      icon={iconeTipo(tipo)}
                      title={`Buscar ${ROTULOS_BUSCA[tipo]}`}
                      subtitle={`Busque por ${ROTULOS_BUSCA[tipo].toLowerCase()} cadastrado no sistema:`}
                      required
                      onChange={setProfissional}
                    />
                  </div>
                  {profissional && (
                    <>
                      <div className="w-56 shrink-0">
                        <FloatInput label="CPF" value={profissional.documento || ""} disabled onChange={() => {}} />
                      </div>
                      <button
                        type="button"
                        onClick={visualizarCadastro}
                        className="mb-1 flex h-10 shrink-0 items-center p-2 text-[#1A7A3C] transition hover:bg-green-50"
                        title="Visualizar cadastro"
                      >
                        <Eye size={18} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {exigeArt && (
                <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
                  <span className="text-xs font-semibold text-gray-800">Anotação de Responsabilidade Técnica</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatInput
                      label="Data da ART"
                      type="date"
                      required
                      value={dataArt}
                      onChange={setDataArt}
                      disabled={somenteLeitura}
                    />
                  </div>
                  <UploadField
                    label="ART"
                    required
                    fileName={arquivoArt}
                    onSelectFile={() => setArquivoArt(`art_${Date.now()}.pdf`)}
                    disabled={somenteLeitura}
                  />
                </div>
              )}
            </div>
          </Section>

          {!!profissionalId && (
            <Section title="Situação do Vínculo">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatSelect
                  label="Situação"
                  required
                  value={situacao}
                  onChange={(value) => setSituacao(value as "Ativo" | "Inativo")}
                  options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]}
                  disabled={somenteLeitura}
                />
              </div>
            </Section>
          )}
          {erro && <p className="text-sm text-red-600">{erro}</p>}
        </div>
      </ModalBase>

      <ModalBase
        open={!!substituicaoPendente}
        onClose={() => setSubstituicaoPendente(null)}
        onCancel={() => setSubstituicaoPendente(null)}
        onSave={() => substituicaoPendente && aplicarSalvamento(
          substituicaoPendente.novo,
          substituicaoPendente.atual,
        )}
        title="Substituir profissional ativo?"
        icon={<UsersRound size={24} color="#1A7A3C" />}
        cancelText="Manter atual"
        saveText="Substituir"
        width="620px"
      >
        <div className="flex flex-col gap-3 text-center text-sm text-gray-600">
          <p>
            Já existe um profissional ativo para <strong>{substituicaoPendente?.atual.tipo}</strong>.
          </p>
          <p>
            Deseja substituir <strong>{substituicaoPendente?.atual.nome}</strong> por{" "}
            <strong>{substituicaoPendente?.novo.nome}</strong>?
          </p>
          <p className="text-xs text-gray-500">
            O profissional atual será inativado e permanecerá disponível no histórico.
          </p>
        </div>
      </ModalBase>
    </>
  );
}
