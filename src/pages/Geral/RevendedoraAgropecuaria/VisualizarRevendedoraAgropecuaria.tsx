import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardPenLine,
  FileCheck2,
  Link2,
  MoreVertical,
  Paperclip,
  User,
  UsersRound,
  FileText,
  PlusCircle,
  ChevronUp,
  SquareArrowOutUpRight, Eye, X, Trash2, Download
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput,
  FloatSelect,
  ModalBase,
  LargeTextArea,
  Tabs, // Agora importado e utilizando a nova tipagem
  UploadField,
  AccordionCardGroup
} from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import {
  PESSOAS_FISICAS_DISPONIVEIS,
  PROFISSIONAIS_ANIMAL as PROFISSIONAIS_ANIMAL_CADASTRADOS,
  PROFISSIONAIS_VEGETAL as PROFISSIONAIS_VEGETAL_CADASTRADOS,
} from "./profissionais";
import {
  getRevendedora,
  salvarProfissional,
  type ProfissionalVinculado,
  type Revendedora,
  type TipoProfissional,
} from "./revendedoraData";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

const PROFISSIONAIS_ANIMAL = PROFISSIONAIS_ANIMAL_CADASTRADOS.map((profissional) => ({
  id: profissional.id, // Mantido o mapeamento original corrigido
  nome: profissional.nome,
  documento: profissional.cpf,
  habilitadoGta: profissional.habilitacoes.includes("Emissão de GTA"),
}));

const PROFISSIONAIS_VEGETAL = PROFISSIONAIS_VEGETAL_CADASTRADOS.map((profissional) => ({
  id: profissional.id,
  nome: profissional.nome,
  documento: profissional.documento,
}));

const PESSOAS_FISICAS = PESSOAS_FISICAS_DISPONIVEIS;

const TIPOS_RESPONSAVEL: Array<{ value: TipoProfissional; label: string }> = [
  { value: "Responsável Técnico Animal", label: "Responsável Técnico Animal" },
  { value: "Responsável Técnico Vegetal", label: "Responsável Técnico Vegetal" },
  { value: "Habilitado para Emissão de GTA", label: "Habilitado para Emissão de GTA" },
];

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: Revendedora;
}

interface Anexo {
  id: string;
  nome: string;
  descricao?: string;
}

function formatarData(data?: string) {
  if (!data) return "Não se aplica";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${data}T00:00:00Z`));
}

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    // Removido o overflow-hidden daqui
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        // Arredonda o botão de acordo com o estado para não vazar o hover cinza
        className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition ${open ? "rounded-t-xl" : "rounded-xl"
          }`}
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        <ChevronDown size={18} className={`text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-gray-100 p-6">
          {children}
        </div>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CARD DO PROFISSIONAL (ADAPTADO COM ÍCONES REQUERIDOS)
   ────────────────────────────────────────────────────────────────────────── */
function ProfessionalCard({ item, onView }: { item: ProfissionalVinculado; onView: () => void }) {
  const rotuloProfissional = item.tipo === "Funcionário"
    ? "Funcionário"
    : item.tipo === "Responsável Técnico Vegetal"
      ? "Profissional da Área Vegetal"
      : "Profissional da Área Animal";

  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden min-w-0 w-full">
      <div className="h-1 bg-[#1A7A3C]" />
      <div className="p-4 flex flex-col gap-3 min-h-[150px]">
        {/* Usando o CalendarDays para a data de atualização */}
        <div className="flex justify-between gap-3 text-[10px] text-gray-500 items-center">
          <span className="flex items-center gap-1">
            <strong>Atualizado:</strong> {formatarData(item.atualizadoEm)}
          </span>
          <span>{item.situacao}</span>
        </div>

        {/* Ícone de Usuário */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <User size={19} className="text-[#1A7A3C]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{item.nome}</p>
            <p className="text-xs text-gray-500">{item.documento}</p>
            <p className="text-xs text-gray-500">{rotuloProfissional}</p>
          </div>
        </div>

        {/* Ícone de Calendário para a data da ART */}
        {item.dataArt && (
          <div className="flex items-start gap-3">
            <Calendar size={19} className="text-[#1A7A3C] shrink-0" />
            <div>
              <p className="text-sm text-gray-800">{formatarData(item.dataArt)}</p>
              <p className="text-[10px] text-gray-500">Data da ART</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onView} className="h-9 px-6 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
        <MoreVertical size={19} className="text-gray-500" />
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT: VisualizarRevendedoraAgropecuarioPage
   ────────────────────────────────────────────────────────────────────────── */
export function VisualizarRevendedoraAgropecuarioPage({ onLogout, onNavigate, dados }: PageProps) {
  const [revendedora, setRevendedora] = useState(() => getRevendedora(dados?.id));
  const [activeTab, setActiveTab] = useState("cadastro");
  const [modalOpen, setModalOpen] = useState(false);
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [profissionalId, setProfissionalId] = useState("");
  const [tipo, setTipo] = useState<TipoProfissional | null>(null);
  const [profissional, setProfissional] = useState<any | null>(null);
  const [dataArt, setDataArt] = useState("");
  const [arquivoArt, setArquivoArt] = useState("");
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">("Ativo");
  const [erro, setErro] = useState("");
  const [substituicaoPendente, setSubstituicaoPendente] = useState<{
    atual: ProfissionalVinculado;
    novo: ProfissionalVinculado;
  } | null>(null);

  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [descricaoAnexo, setDescricaoAnexo] = useState<string>("");
  const tabs = [
    {
      id: "cadastro",
      label: "Cadastro",
      icon: (isActive: boolean) => <FileText size={19} className={isActive ? "text-[#1A7A3C]" : "text-gray-400"} />
    },
    {
      id: "vinculacoes",
      label: "Vinculações",
      icon: (isActive: boolean) => (
        <img
          src={Icons.iconeVinculacoesUrl}
          alt="Vinculações"
          className={`w-[19px] h-[19px] object-contain transition-all duration-200 ${isActive
            ? "grayscale-0 opacity-100"
            : "grayscale opacity-40 group-hover:opacity-70"
            }`}
        />
      )
    },
    {
      id: "responsaveis",
      label: "Profissionais",
      icon: (isActive: boolean) => <UsersRound size={19} className={isActive ? "text-[#1A7A3C]" : "text-gray-400"} />
    },


  ];

  const animalAtivos = revendedora.profissionais.filter((item) => item.tipo === "Responsável Técnico Animal" && item.situacao === "Ativo");
  const animalInativos = revendedora.profissionais.filter((item) => item.tipo === "Responsável Técnico Animal" && item.situacao === "Inativo");

  const vegetalAtivos = revendedora.profissionais.filter((item) => item.tipo === "Responsável Técnico Vegetal" && item.situacao === "Ativo");
  const vegetalInativos = revendedora.profissionais.filter((item) => item.tipo === "Responsável Técnico Vegetal" && item.situacao === "Inativo");

  const gtaAtivos = revendedora.profissionais.filter((item) => item.tipo === "Habilitado para Emissão de GTA" && item.situacao === "Ativo");
  const gtaInativos = revendedora.profissionais.filter((item) => item.tipo === "Habilitado para Emissão de GTA" && item.situacao === "Inativo");

  const funcionariosAtivos = revendedora.profissionais.filter((item) => item.tipo === "Funcionário" && item.situacao === "Ativo");
  const funcionariosInativos = revendedora.profissionais.filter((item) => item.tipo === "Funcionário" && item.situacao === "Inativo");

  const contatos = revendedora.contatos;
  const contatosProprietarios = (contatos?.proprietariosDisponiveis || []).filter((proprietario) =>
    contatos?.proprietariosSelecionados.map(String).includes(String(proprietario.id)),
  );

  const isResponsavelArt = tipo === "Responsável Técnico Animal" || tipo === "Responsável Técnico Vegetal";

  const dadosBusca = tipo === "Responsável Técnico Vegetal"
    ? PROFISSIONAIS_VEGETAL
    : tipo === "Funcionário"
      ? PESSOAS_FISICAS
      : tipo === "Habilitado para Emissão de GTA"
        ? PROFISSIONAIS_ANIMAL.filter((item) => item.habilitadoGta)
        : PROFISSIONAIS_ANIMAL;

  const rotuloProfissional = tipo === "Funcionário"
    ? "Funcionário"
    : tipo === "Responsável Técnico Vegetal"
      ? "Profissional da Área Vegetal"
      : "Profissional da Área Animal";

  const abrirNovo = (funcionario: boolean) => {
    setProfissionalId("");
    setTipo(funcionario ? "Funcionário" : "Responsável Técnico Animal");
    setProfissional(null);
    setDataArt("");
    setArquivoArt("");
    setSituacao("Ativo");
    setErro("");
    setSomenteLeitura(false);
    setModalOpen(true);
  };

  const abrirProfissional = (item: ProfissionalVinculado) => {
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

  const aplicarSalvamentoProfissional = (
    novo: ProfissionalVinculado,
    atual?: ProfissionalVinculado,
  ) => {
    if (atual) {
      salvarProfissional(revendedora.id, {
        ...atual,
        situacao: "Inativo",
        atualizadoEm: novo.atualizadoEm,
      });
    }
    const atualizada = salvarProfissional(revendedora.id, novo);
    if (atualizada) setRevendedora(atualizada);
    setSubstituicaoPendente(null);
    setModalOpen(false);
  };

  const handleSalvarProfissional = () => {
    if (somenteLeitura) {
      setSomenteLeitura(false);
      return;
    }
    if (!profissional) {
      setErro("Selecione o profissional.");
      return;
    }
    if (isResponsavelArt && (!dataArt || !arquivoArt)) {
      setErro("Informe a data e o arquivo da ART.");
      return;
    }
    const hoje = new Date().toISOString().slice(0, 10);
    if (dataArt && dataArt > hoje) {
      setErro("A data da ART não pode ser futura.");
      return;
    }
    const outroAtivo = revendedora.profissionais.find((item) => item.id !== profissionalId && item.tipo === tipo && item.situacao === "Ativo");
    const novo: ProfissionalVinculado = {
      id: profissionalId || `prof-${Date.now()}`,
      tipo,
      nome: profissional.nome,
      documento: profissional.documento,
      dataArt: isResponsavelArt ? dataArt : undefined,
      arquivoArt: isResponsavelArt ? arquivoArt : undefined,
      situacao,
      atualizadoEm: hoje,
    };
    if (situacao === "Ativo" && outroAtivo) {
      setSubstituicaoPendente({ atual: outroAtivo, novo });
      return;
    }
    aplicarSalvamentoProfissional(novo);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="revendedora-agropecuario" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <header>
          <button type="button" onClick={() => onNavigate("revendedora-agropecuario")} className="flex items-center gap-1 text-sm mb-4 text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Todas Revendedoras de Produtos Agropecuários
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Visualizar Revendedora de Produtos Agropecuários</h1>
            </div>
            {activeTab === "cadastro" && (
              <button type="button" onClick={() => onNavigate("editar-revendedora-agropecuario", revendedora)} className="h-10 px-6 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold">Editar</button>
            )}
            {activeTab === "responsaveis" && (
              <button type="button" onClick={() => abrirNovo(false)} className="h-10 px-5 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold">Adicionar Profissional</button>
            )}
            {activeTab === "funcionarios" && (
              <button type="button" onClick={() => abrirNovo(true)} className="h-10 px-5 rounded bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold">Adicionar Funcionário</button>
            )}
          </div>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "cadastro" && (
          <div className="flex flex-col gap-4">
            <Section title="Informações Básicas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatInput label="Código da Revendedora" value={revendedora.codigo} disabled />
                <FloatInput label="Nome Comercial da Revendedora" value={revendedora.nome} disabled />
                <FloatInput label="Área de Atuação" value={revendedora.areaAtuacao.join(", ")} disabled />
                <FloatInput label="Situação" value={revendedora.situacao} disabled />
              </div>
              {revendedora.areaAtuacao.includes("Animal") && (
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatInput label="Registro do Órgão Competente - Animal" value={revendedora.registroAnimal} disabled />
                  <FloatInput label="Atuação - Animal" value={revendedora.atuacoesAnimal.join(", ")} disabled />
                </div>
              )}
              {revendedora.areaAtuacao.includes("Vegetal") && (
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatInput label="Registro do Órgão Competente - Vegetal" value={revendedora.registroVegetal} disabled />
                  <FloatInput label="RENASEM" value={revendedora.renasem} disabled />
                  <FloatInput label="Atuação - Vegetal" value={revendedora.atuacoesVegetal.join(", ")} disabled />
                </div>
              )}
            </Section>

            <Section title="Proprietários">
              <div className="flex flex-col gap-3">
                {revendedora.proprietarios.map((item, index) => <FloatInput key={item} label={`Proprietário ${index + 1}`} value={item} disabled />)}
              </div>
            </Section>

            <Section title="Informações de Localização">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatInput label="Zona" value={revendedora.endereco.zona} disabled />
                <FloatInput label="CEP" value={revendedora.endereco.cep} disabled />
                <FloatInput label="Estado" value={revendedora.endereco.estado} disabled />
                <FloatInput label="Município" value={revendedora.endereco.municipio} disabled />
                <FloatInput label="Bairro" value={revendedora.endereco.bairro} disabled />
                <FloatInput label="Endereço" value={revendedora.endereco.endereco} disabled className="md:col-span-2" />
                <FloatInput label="Número" value={revendedora.endereco.numero} disabled />
                <FloatInput label="Complemento" value={revendedora.endereco.complemento} disabled />
                <FloatInput label="Localidade" value={revendedora.endereco.localidade} disabled />
                <FloatInput label="Distrito" value={revendedora.endereco.distrito} disabled />
                <FloatInput label="Latitude" value={revendedora.endereco.latitude} disabled />
                <FloatInput label="Longitude" value={revendedora.endereco.longitude} disabled />
              </div>
            </Section>

            <Section title="Informações de Contato">
              <div className="flex flex-col gap-4">
                <FloatInput label="Utilizar Contato de Proprietários?" value={contatos?.utilizarContatoProprietario || "Não"} disabled />
                {contatos?.utilizarContatoProprietario === "Sim" ? (
                  contatosProprietarios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contatosProprietarios.map((proprietario, index) => (
                        <div key={proprietario.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                          <p className="text-sm font-semibold text-gray-800">Proprietário {index + 1}</p>
                          <FloatInput label="Nome" value={proprietario.nome} disabled />
                          <FloatInput label="CPF/CNPJ" value={proprietario.cpf} disabled />
                          <FloatInput label="E-mail" value={proprietario.email || "Não informado"} disabled />
                          <FloatInput label="Telefone" value={proprietario.telefone || "Não informado"} disabled />
                          <LargeTextArea label="Observação" value={proprietario.observacao || ""} onChange={() => { }} disabled />
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-gray-500">Nenhum proprietário selecionado para contato.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatInput label="E-mail" value={contatos?.emailFixo || ""} disabled />
                    <FloatInput label="Telefone" value={contatos?.telefoneFixo || ""} disabled />
                    <LargeTextArea label="Observação do E-mail" value={contatos?.emailFixoObs || ""} onChange={() => { }} disabled />
                    <LargeTextArea label="Observação do Telefone" value={contatos?.telefoneFixoObs || ""} onChange={() => { }} disabled />
                  </div>
                )}
                {(contatos?.contatosAdicionais || []).length > 0 && (
                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-700">Outros Contatos</h3>
                    {(contatos?.contatosAdicionais || []).map((contato, index) => (
                      <div key={contato.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FloatInput label={`Tipo do Contato ${index + 1}`} value={contato.tipo} disabled />
                        <FloatInput label={contato.tipo === "E-mail" ? "E-mail" : "Número"} value={contato.tipo === "E-mail" ? contato.email : contato.telefone} disabled />
                        <LargeTextArea label="Observação" value={contato.observacao || ""} onChange={() => { }} disabled />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            <Section title="Anexos e Observações">
              <div className="flex flex-col gap-4">
                {(revendedora.anexos || []).map((anexo) => (
                  <div key={anexo.id} className="flex items-center gap-3 border border-gray-200 rounded-md p-3 text-sm text-gray-600">
                    <Paperclip size={17} className="text-[#1A7A3C]" />
                    <span className="font-medium">{anexo.nome}</span>
                    <span className="text-gray-400">{anexo.descricao}</span>
                  </div>
                ))}
                <LargeTextArea label="Observação" value={revendedora.observacao || ""} onChange={() => { }} disabled />
              </div>
            </Section>
          </div>
        )}

        {activeTab === "vinculacoes" && (
          <section className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
            <Link2 size={36} className="text-[#1A7A3C] mx-auto mb-3" />
            <h2 className="font-semibold text-gray-800">Vinculações</h2>
            <p className="text-sm text-gray-500 mt-2">A lista de vinculações será definida em versões futuras da história.</p>
          </section>
        )}

        {activeTab === "responsaveis" && (
          <div className="flex flex-col gap-5">
            {/* ─── RT ÁREA ANIMAL ─── */}
            <AccordionCardGroup
              title="Responsável Técnico da Área Animal"
              activeCountText={`${animalAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Responsáveis Técnicos"
              icon={
                <img
                  src={Icons.iconeProfissionalAnimalUrl}
                  alt="Profissional Animal"
                  className="w-6 h-6 object-contain invert brightness-0"
                />
              }
              historicoChildren={
                animalInativos.map((item) => (
                  <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
                ))
              }
            >
              {animalAtivos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            </AccordionCardGroup>

            {/* ─── RT ÁREA VEGETAL ─── */}
            <AccordionCardGroup
              title="Responsável Técnico da Área Vegetal"
              activeCountText={`${vegetalAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Responsáveis Técnicos"
              icon={
                <img
                  src={Icons.iconeProfissionalVegetalUrl}
                  alt="Profissional Vegetal"
                  className="w-6 h-6 object-contain invert brightness-0"
                />
              }
              historicoChildren={
                vegetalInativos.map((item) => (
                  <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
                ))
              }
            >
              {vegetalAtivos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            </AccordionCardGroup>

            {/* ─── HABILITADOS GTA ─── */}
            <AccordionCardGroup
              title="Habilitado para Emissão de GTA"
              activeCountText={`${gtaAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Profissionais Habilitados"
              icon={
                <img
                  src={Icons.iconeHabilitacaoUrl}
                  alt="Habilitação"
                  className="w-7 h-7 object-contain invert brightness-0"
                />
              }
              historicoChildren={
                gtaInativos.map((item) => (
                  <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
                ))
              }
            >
              {gtaAtivos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            </AccordionCardGroup>

          </div>
        )}

        {activeTab === "funcionarios" && (
          <div className="flex flex-col gap-5">
            <AccordionCardGroup
              title="Funcionários"
              activeCountText={`${funcionariosAtivos.length} cadastros ativos`}
              variant="sem-vinculacao"
              historicoTitle="Histórico de Funcionários"
              icon={<UsersRound size={21} />}
              historicoChildren={
                funcionariosInativos.map((item) => (
                  <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
                ))
              }
            >
              {funcionariosAtivos.map((item) => (
                <ProfessionalCard key={item.id} item={item} onView={() => abrirProfissional(item)} />
              ))}
            </AccordionCardGroup>
          </div>
        )}
      </main>

      {/* ─── MODAL DE CADASTRO / DETALHES ─── */}
      {/* ─── MODAL DE CADASTRO / DETALHES ─── */}
      <ModalBase
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSalvarProfissional}
        title={profissionalId ? "Visualizar Profissional" : "Adicionar Profissional"}
        subtitle="Preencha os campos para adicionar um profissional."
        icon={<User size={24} color={GREEN} />}
        saveText={somenteLeitura ? "Editar" : "Salvar"}
        width="820px"
      >
        <div className="flex flex-col gap-6 w-full">

          {/* SEÇÃO 1: Identificação, Busca do Vínculo e Anexo Único */}
          <Section title="Informações Básicas" defaultOpen={true}>
            <div className="flex flex-col gap-6">

              {/* Grid superior apenas para a seleção do Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatSelect
                  label="Tipo de Profissional"
                  required
                  value={tipo}
                  onChange={(value) => {
                    setTipo(value as TipoProfissional);
                    setProfissional(null);
                    setDataArt(""); // Reseta a data ao mudar o tipo
                  }}
                  options={tipo === "Funcionário"
                    ? [{ value: "Funcionário", label: "Funcionário" }]
                    : TIPOS_RESPONSAVEL}
                  disabled={!!profissionalId || somenteLeitura}
                />
              </div>

              {/* Linha dinâmica: Mostra apenas a Busca ou Busca + CPF + Olhinho após seleção */}
              <div className="flex items-end gap-3 w-full transition-all duration-300">

                {/* 1. O Input de Busca (EntitySearchInput) que se ajusta de tamanho */}
                <div className="flex-1 min-w-0">
                  <EntitySearchInput
                    label={rotuloProfissional}
                    placeholder="Buscar por nome ou CPF"
                    value={profissional ? profissional.nome : ""}
                    data={dadosBusca}
                    searchKeys={["nome", "documento"]}
                    columns={[
                      { label: "Nome", key: "nome" },
                      { label: "CPF", key: "documento" }
                    ]}
                    icon={
                      tipo === "Responsável Técnico Vegetal" ? (
                        <img
                          src={Icons.iconeProfissionalVegetalUrl}
                          alt="Vegetal"
                          className="w-[18px] h-[18px] object-contain"
                        />
                      ) : tipo === "Funcionário" ? (
                        <User size={18} color={GREEN} />
                      ) : (
                        <img
                          src={Icons.iconeProfissionalAnimalUrl}
                          alt="Animal"
                          className="w-[18px] h-[18px] object-contain"
                        />
                      )
                    }
                    title={`Buscar ${rotuloProfissional}`}
                    subtitle={`Busque por ${rotuloProfissional.toLowerCase()} cadastrado no sistema:`}
                    required
                    disabled={somenteLeitura}
                    onChange={(ent) => {
                      setProfissional(ent);
                    }}
                  />
                </div>

                {/* Renderização Condicional: CPF e Olhinho só aparecem se houver profissional selecionado */}
                {profissional && (
                  <>
                    {/* 2. O FloatInput do CPF (sempre desabilitado) */}
                    <div className="w-56 shrink-0 animate-fade-in">
                      <FloatInput
                        label="CPF"
                        value={profissional.documento || ""}
                        disabled
                      />
                    </div>

                    {/* 3. Botão do Olhinho em Verde */}
                    <div className="flex items-center h-10 mb-[2px] shrink-0 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => window.open(`/profissionais/visualizar/${profissional.id || profissionalId}`, "_blank")}
                        className="p-2 bg-white hover:bg-green-50 text-[#1A7A3C] hover:text-[#15612F] transition"
                        title="Visualizar Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </>
                )}

              </div>

              {/* Data da ART integrada aqui dentro caso seja Responsável Técnico */}
              {/* Seção Integrada de ART (Data + Upload) exibida apenas para Responsável Técnico */}
              {isResponsavelArt && (
                <div className="flex flex-col gap-4 w-full animate-fade-in mt-2">
                  {/* Divisor e Subtítulo */}
                  <div className="flex flex-col gap-1 w-full">
                    <hr className="border-gray-100 w-full" />
                    <span className="text-xs font-semibold text-black mt-2">
                      Anotação de Responsabilidade Técnica
                    </span>
                  </div>

                  {/* Campo de Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatInput
                      label="Data da ART"
                      type="date"
                      icon={<Calendar size={16} color={GREEN} />}
                      value={dataArt}
                      onChange={setDataArt}
                      required
                      disabled={somenteLeitura}
                    />
                  </div>

                  {/* Upload do Arquivo da ART */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4 items-start relative w-full">
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex gap-3 items-start w-full">

                          <UploadField
                            label="ART"
                            required
                            fileName={arquivoArt}
                            onSelectFile={() => setArquivoArt(`documento_vinculo_${Date.now()}.pdf`)}
                            disabled={somenteLeitura}
                          />

                          {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                          {arquivoArt && (
                            <>
                              <div className="flex-1">
                                <FloatInput
                                  label="Descrição"
                                  value={descricaoAnexo || ""}
                                  placeholder="Descrição opcional..."
                                  onChange={setDescricaoAnexo}
                                  disabled={somenteLeitura}
                                />
                              </div>
                              <div className="h-12 flex items-center">
                                <button
                                  type="button"
                                  onClick={() => alert(`Fazendo download de: ${arquivoArt}`)}
                                  className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                                  title="Download"
                                >
                                  <Download size={20} />
                                </button>
                              </div>
                            </>
                          )}



                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}




            </div>
          </Section>

          {/* SEÇÃO 2: Controle de Status (Exibida apenas na edição/visualização) */}
          {!!profissionalId && (
            <Section title="Status do Vínculo" defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        </div>

        {erro && <p className="text-sm text-red-600 mt-2">{erro}</p>}
      </ModalBase>

      <ModalBase
        open={!!substituicaoPendente}
        onClose={() => setSubstituicaoPendente(null)}
        onCancel={() => setSubstituicaoPendente(null)}
        onSave={() => substituicaoPendente && aplicarSalvamentoProfissional(
          substituicaoPendente.novo,
          substituicaoPendente.atual,
        )}
        title="Substituir profissional ativo?"
        icon={<UsersRound size={24} color={GREEN} />}
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
    </div>
  );
}
