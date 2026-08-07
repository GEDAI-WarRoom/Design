import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Laptop,
  LockKeyhole,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Navbar } from "../../../components/Navbar";
import { useDemoUser } from "../../../contexts/DemoUserContext";
import { CustomButton, FloatInput } from "../../../components/ui/FormKit";
import fotoAdministradorExemploUrl from "../../../imports/images/perfil-admin.exemplo.png";
import fotoVeterinariaExemploUrl from "../../../imports/images/perfil-veterinaria-exemplo.png";
import fotoLiderEstabelecimentoExemploUrl from "../../../imports/images/perfil-estabelecimento-exemplo.png";
import { atualizarPerfilUsuario } from "./meuPerfilData";

type PerfilTab = "perfil" | "seguranca" | "dispositivos";

interface MeuPerfilPageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

interface SectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

interface SessaoAutenticada {
  id: number;
  sistema: string;
  navegador: string;
  ip: string;
  inicio: string;
  ultimoAcesso: string;
  expiraEm: string;
  cliente: string;
  atual: boolean;
}

const SESSOES_INICIAIS: SessaoAutenticada[] = [
  {
    id: 1,
    sistema: "Linux",
    navegador: "Chrome/142.0.0",
    ip: "177.105.61.138",
    inicio: "19 de janeiro de 2026 às 09:07",
    ultimoAcesso: "19 de janeiro de 2026 às 09:08",
    expiraEm: "19 de janeiro de 2026 às 19:07",
    cliente: "Console de Conta",
    atual: true,
  },
  {
    id: 2,
    sistema: "Linux",
    navegador: "Chrome/142.0.0",
    ip: "177.105.61.138",
    inicio: "19 de janeiro de 2026 às 09:07",
    ultimoAcesso: "19 de janeiro de 2026 às 09:08",
    expiraEm: "19 de janeiro de 2026 às 19:07",
    cliente: "Console de Conta",
    atual: false,
  },
];

function CollapsibleSection({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-5 py-5 text-left text-lg font-semibold text-gray-800 transition hover:bg-green-50/50"
      >
        {title}
        {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
      </button>
      {open && <div className="p-5 md:p-6">{children}</div>}
    </section>
  );
}

function TabButton({
  active,
  icon,
  children,
  onClick,
  disabled = false,
}: {
  active: boolean;
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
      title={disabled ? "A funcionalidade de Papéis será disponibilizada em breve" : undefined}
      onClick={disabled ? undefined : onClick}
      className={`flex min-w-max items-center gap-3 border-b-2 px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C] ${
        active
          ? "border-[#1A7A3C] text-[#1A7A3C]"
          : "border-transparent text-gray-500 hover:border-green-200 hover:text-[#1A7A3C]"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {icon}
      {children}
    </button>
  );
}

function Feedback({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-[#1A7A3C]">
      <CheckCircle2 size={18} />
      {children}
    </div>
  );
}

export function MeuPerfilPage({ onLogout, onNavigate }: MeuPerfilPageProps) {
  const { role, user } = useDemoUser();
  const nomeInicial = user?.name ?? "";
  const emailInicial = user?.email ?? `${(user?.name ?? "usuario").toLowerCase().replace(/\s+/g, ".")}@email.com`;
  const avatarInicial = user?.avatarDataUrl ?? null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<PerfilTab>("perfil");
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [aceitouTermos, setAceitouTermos] = useState(user?.acceptedTerms ?? false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarInicial);
  const [termosAbertos, setTermosAbertos] = useState(false);
  const [perfilOriginal, setPerfilOriginal] = useState({
    nome: nomeInicial,
    email: emailInicial,
    aceitouTermos: user?.acceptedTerms ?? false,
    avatarPreview: avatarInicial,
  });
  const [perfilSalvo, setPerfilSalvo] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [senhaSalva, setSenhaSalva] = useState(false);
  const [sessoes, setSessoes] = useState(SESSOES_INICIAIS);
  const [atualizadoEm, setAtualizadoEm] = useState("");

  const avatarPadrao =
    role === "admin"
      ? fotoAdministradorExemploUrl
      : role === "veterinario"
        ? fotoVeterinariaExemploUrl
        : role === "lider-estabelecimento"
          ? fotoLiderEstabelecimentoExemploUrl
          : null;
  const perfilAlterado =
    nome !== perfilOriginal.nome ||
    email !== perfilOriginal.email ||
    aceitouTermos !== perfilOriginal.aceitouTermos ||
    avatarPreview !== perfilOriginal.avatarPreview;

  const trocarFoto = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.addEventListener("load", () => {
      if (typeof leitor.result !== "string") return;
      setAvatarPreview(leitor.result);
      setPerfilSalvo(false);
    });
    leitor.readAsDataURL(arquivo);
  };

  const salvarPerfil = () => {
    if (!role) return;
    atualizarPerfilUsuario(role, {
      nome,
      email,
      aceitouTermos,
      avatarDataUrl: avatarPreview ?? undefined,
    });
    setPerfilOriginal({ nome, email, aceitouTermos, avatarPreview });
    setPerfilSalvo(true);
  };

  const salvarSenha = () => {
    setSenhaSalva(false);
    if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
      setErroSenha("Preencha todos os campos de senha.");
      return;
    }
    if (novaSenha.length < 8) {
      setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmacaoSenha) {
      setErroSenha("A confirmação da senha não confere.");
      return;
    }
    setErroSenha("");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmacaoSenha("");
    setSenhaSalva(true);
  };

  const encerrarSessao = (id: number) => {
    setSessoes((current) => current.filter((sessao) => sessao.id !== id || sessao.atual));
  };

  const encerrarOutrasSessoes = () => {
    setSessoes((current) => current.filter((sessao) => sessao.atual));
  };

  const atualizarSessoes = () => {
    setAtualizadoEm(
      new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="meu-perfil" hideSearch />

      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-6 md:px-6">
        <header>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#1A7A3C] transition hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Voltar
          </button>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Conta de Usuário</h1>
            {activeTab === "perfil" && perfilAlterado && (
              <CustomButton
                className="h-10 rounded-md px-5 shadow-none"
                onClick={salvarPerfil}
                disabled={!nome.trim() || !email.trim() || !aceitouTermos}
              >
                Salvar
              </CustomButton>
            )}
          </div>
        </header>

        <div className="mt-5 border-b border-gray-200">
          <div role="tablist" aria-label="Seções da conta" className="flex gap-6 overflow-x-auto">
            <TabButton active={activeTab === "perfil"} icon={<UserRound size={21} />} onClick={() => setActiveTab("perfil")}>
              Meu Perfil
            </TabButton>
            <TabButton active={activeTab === "seguranca"} icon={<LockKeyhole size={21} />} onClick={() => setActiveTab("seguranca")}>
              Segurança da Conta
            </TabButton>
            <TabButton active={activeTab === "dispositivos"} icon={<Laptop size={22} />} onClick={() => setActiveTab("dispositivos")}>
              Dispositivos Conectados
            </TabButton>
            <TabButton active={false} icon={<UsersRound size={22} />} disabled>
              Papéis
            </TabButton>
          </div>
        </div>

        {activeTab === "perfil" && (
          <div role="tabpanel" className="mt-5 space-y-5">
            {perfilSalvo && <Feedback>Dados do perfil salvos com sucesso.</Feedback>}

            <CollapsibleSection title="Informação Pessoal">
              <div className="mb-7 flex justify-center">
                <div className="relative">
                  <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-green-50 text-[#1A7A3C] ring-4 ring-white shadow-sm">
                    {avatarPreview || avatarPadrao ? (
                      <img src={avatarPreview ?? avatarPadrao ?? ""} alt={`Foto de ${nome || "usuário"}`} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={70} strokeWidth={1.5} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Alterar foto do perfil"
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-white text-[#1A7A3C] shadow-sm transition hover:bg-green-50"
                  >
                    <Pencil size={17} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={trocarFoto} className="hidden" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <div className="md:col-span-12">
                  <FloatInput label="Nome" value={nome} onChange={(value) => { setNome(value); setPerfilSalvo(false); }} required />
                </div>
                <div className="md:col-span-5">
                  <FloatInput label="CPF" value={user?.document ?? "Não informado"} disabled required />
                </div>
                <div className="md:col-span-5">
                  <FloatInput label="Senha" value="********" disabled required type="password" />
                </div>
                <CustomButton variant="outlined" className="md:col-span-2 md:px-3" onClick={() => setActiveTab("seguranca")}>
                  Alterar Senha
                </CustomButton>
                <div className="md:col-span-12">
                  <FloatInput label="E-mail" value={email} onChange={(value) => { setEmail(value); setPerfilSalvo(false); }} required type="email" />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Termo de uso">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                  Declaro que li e estou de acordo com os{" "}
                  <button
                    type="button"
                    onClick={() => setTermosAbertos(true)}
                    className="font-medium text-[#1A7A3C] hover:underline"
                  >
                    termos de uso do sistema
                  </button>.
                </p>
                <label className="flex cursor-pointer items-center gap-3 whitespace-nowrap text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={aceitouTermos}
                    onChange={(event) => { setAceitouTermos(event.target.checked); setPerfilSalvo(false); }}
                    className="h-4 w-4 accent-[#1A7A3C]"
                  />
                  Li e estou de acordo com os termos
                </label>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {activeTab === "seguranca" && (
          <div role="tabpanel" className="mt-5">
            <CollapsibleSection title="Alterar senha">
              <div className="space-y-4">
                <FloatInput label="Senha Atual" value={senhaAtual} onChange={setSenhaAtual} required type="password" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FloatInput label="Nova Senha" value={novaSenha} onChange={setNovaSenha} required type="password" />
                  <FloatInput label="Confirmar Nova Senha" value={confirmacaoSenha} onChange={setConfirmacaoSenha} required type="password" />
                </div>
                {erroSenha && <p role="alert" className="text-sm font-medium text-red-600">{erroSenha}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <CustomButton variant="outlined" onClick={salvarSenha}>Salvar</CustomButton>
                  {senhaSalva && <Feedback>Senha alterada com sucesso.</Feedback>}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {activeTab === "dispositivos" && (
          <div role="tabpanel" className="mt-5">
            <CollapsibleSection title="Dispositivos Autenticados">
              <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:justify-end">
                <CustomButton variant="outlined" icon={<RefreshCw size={18} />} onClick={atualizarSessoes}>
                  Atualizar Página
                </CustomButton>
                <CustomButton icon={<ShieldCheck size={18} />} onClick={encerrarOutrasSessoes} disabled={sessoes.every((sessao) => sessao.atual)}>
                  Encerrar Sessão em Todos os Dispositivos
                </CustomButton>
              </div>
              {atualizadoEm && <p className="mt-2 text-right text-xs text-gray-500">Atualizado às {atualizadoEm}</p>}

              <div>
                {sessoes.map((sessao) => (
                  <article key={sessao.id} className="border-b border-gray-200 px-1 py-5 last:border-b-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2 text-base font-semibold text-gray-900">
                        <Smartphone size={20} className="text-gray-600" />
                        {sessao.sistema} / {sessao.navegador}
                        {sessao.atual && <span className="rounded bg-[#008A45] px-2 py-1 text-[10px] font-semibold text-white">Sessão Atual</span>}
                      </div>
                      {!sessao.atual && (
                        <CustomButton variant="outlined" onClick={() => encerrarSessao(sessao.id)}>
                          Sair da Sessão
                        </CustomButton>
                      )}
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div><dt className="text-xs font-medium text-gray-500">Endereço IP</dt><dd className="mt-1 text-gray-800">{sessao.ip}</dd></div>
                      <div><dt className="text-xs font-medium text-gray-500">Último acesso em</dt><dd className="mt-1 text-gray-800">{sessao.ultimoAcesso}</dd></div>
                      <div><dt className="text-xs font-medium text-gray-500">Clientes</dt><dd className="mt-1 text-gray-800">{sessao.cliente}</dd></div>
                      <div><dt className="text-xs font-medium text-gray-500">Início em</dt><dd className="mt-1 text-gray-800">{sessao.inicio}</dd></div>
                      <div><dt className="text-xs font-medium text-gray-500">Expira em</dt><dd className="mt-1 text-gray-800">{sessao.expiraEm}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>

              <p className="rounded-lg bg-gray-100 px-4 py-4 text-sm leading-relaxed text-gray-600">
                Os dispositivos que acessaram sua conta recentemente são exibidos aqui. Se você não reconhece algum dispositivo, encerre a sessão imediatamente e altere sua senha.
              </p>
            </CollapsibleSection>
          </div>
        )}
      </main>

      {termosAbertos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-termos-de-uso"
          onClick={() => setTermosAbertos(false)}
        >
          <div
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="relative border-b border-gray-100 px-6 py-5 text-center">
              <h2 id="titulo-termos-de-uso" className="text-xl font-semibold text-gray-900">
                Termo de uso do sistema
              </h2>
              <button
                type="button"
                onClick={() => setTermosAbertos(false)}
                aria-label="Fechar termo de uso"
                className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto px-6 py-5 text-sm leading-relaxed text-gray-700">
              <p>
                Este Termo de Uso estabelece as condições para acesso e utilização do Sidagro. Ao utilizar o sistema, a pessoa usuária declara que leu, compreendeu e concorda com as regras apresentadas neste documento.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">1. Acesso ao sistema</h3>
              <p className="mt-2">
                O acesso é pessoal e intransferível. A pessoa usuária é responsável por manter suas credenciais em sigilo, utilizar senhas seguras e encerrar sessões abertas em equipamentos que não estejam sob seu controle.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">2. Responsabilidade pelas informações</h3>
              <p className="mt-2">
                As informações cadastradas devem ser verdadeiras, completas e atualizadas. Operações realizadas com as credenciais da pessoa usuária poderão ser registradas para fins de segurança, auditoria e rastreabilidade.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">3. Uso adequado</h3>
              <p className="mt-2">
                É proibido utilizar o Sidagro para atividades ilegais, tentar acessar dados sem autorização, compartilhar credenciais ou interferir no funcionamento e na segurança da plataforma.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">4. Proteção de dados</h3>
              <p className="mt-2">
                Os dados pessoais serão tratados de acordo com a legislação aplicável e utilizados para executar as funcionalidades do sistema, cumprir obrigações legais e preservar a segurança dos serviços disponibilizados.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">5. Disponibilidade e atualizações</h3>
              <p className="mt-2">
                O sistema poderá passar por manutenções, atualizações ou interrupções temporárias. Estes termos também poderão ser atualizados quando necessário, com a apresentação da versão vigente para nova ciência da pessoa usuária.
              </p>
              <h3 className="mt-5 font-semibold text-gray-900">6. Aceite</h3>
              <p className="mt-2">
                O aceite registrado na tela de perfil confirma a concordância com este Termo de Uso. Em caso de discordância, a pessoa usuária deve interromper a utilização do sistema e procurar o suporte responsável.
              </p>
            </div>

            <footer className="flex justify-center border-t border-gray-100 px-6 py-4">
              <CustomButton variant="outlined" onClick={() => setTermosAbertos(false)}>
                Fechar
              </CustomButton>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
