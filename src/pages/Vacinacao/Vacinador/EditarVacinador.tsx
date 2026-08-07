import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  Briefcase,
  Paperclip,
  CheckCircle2,
  Info,
  ChevronUp,
  ChevronDown,
  Trash2,
  PlusCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SimNao } from "../../../components/ui/FormKit";
import { EntitySearchInput, DynamicListWrapper } from "../../../components/ui/EntitySearch";
import {
  CadastroVacinacaoHeader,
  cadastroVacinacaoPageClass,
  mensagemSucessoCadastro,
  preencherComExemplo
} from "../shared/CadastroVacinacaoMode";

const GREEN = "#1A7A3C";

// Mocks de busca
const PROFISSIONAIS_RESPONSAVEIS_MOCK = [
  { id: 1, nome: "Dr. Roberto Silva", cpf: "555.009.956-40", uf: "MG" },
  { id: 2, nome: "Dra. Maria Carmo", cpf: "666.123.456-78", uf: "MG" },
];

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface AnexoItem {
  uid: string;
  arquivo: string;
  descricao: string;
}

function Section({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative">{children}</div>}
    </div>
  );
}

interface EditarVacinadorProps {
  dados?: any;
  onLogout?: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function EditarVacinadorBrucelosePage({ dados, onLogout, onNavigate }: EditarVacinadorProps) {
  const registroInicial = preencherComExemplo(dados, {
    id: "vacinador-1",
    nome: "José Aarão Neto",
    cpf: "555.009.956-40",
    aderidoPasa: "Sim",
    possuiCertificadoPasa: "Sim",
    certificadoPasaArquivo: "certificado_pasa_2026.pdf",
    certificadoPasaDescricao: "Certificado emitido pelo PASA em 2026",
    profissionalResponsavel: PROFISSIONAIS_RESPONSAVEIS_MOCK[0],
    profissionalCpf: "555.009.956-40",
    anexos: [
      { uid: uid("anx"), arquivo: "comprovante_treinamento.pdf", descricao: "Treinamento de vacinação" }
    ],
    observacao: "Vacinador habilitado para a região sul.",
    situacao: "Ativo",
    usuarioUltimaAlteracao: "Lucas Pedro Conte",
    dataHoraUltimaModificacao: "14/04/2026 07:29"
  });

  // Estados do Formulário
  const [aderidoPasa, setAderidoPasa] = useState<"Sim" | "Não">(registroInicial?.aderidoPasa ?? "Não");
  const [possuiCertificadoPasa, setPossuiCertificadoPasa] = useState<"Sim" | "Não">(registroInicial?.possuiCertificadoPasa ?? "Não");
  const [certificadoPasaArquivo, setCertificadoPasaArquivo] = useState(registroInicial?.certificadoPasaArquivo ?? "");
  const [certificadoPasaDescricao, setCertificadoPasaDescricao] = useState(registroInicial?.certificadoPasaDescricao ?? "");
  
  const [profissionalResponsavel, setProfissionalResponsavel] = useState<any>(registroInicial?.profissionalResponsavel ?? null);
  const [profissionalCpf, setProfissionalCpf] = useState(registroInicial?.profissionalCpf ?? "");
  
  const [anexos, setAnexos] = useState<AnexoItem[]>(registroInicial?.anexos ?? []);
  const [observacao, setObservacao] = useState(registroInicial?.observacao ?? "");
  const [situacao, setSituacao] = useState<"Ativo" | "Inativo">(registroInicial?.situacao ?? "Ativo");

  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Ações de Anexos
  const addAnexo = () => {
    setAnexos([...anexos, { uid: uid("anx"), arquivo: "", descricao: "" }]);
  };

  const removeAnexo = (uidTarget: string) => {
    setAnexos(anexos.filter((a) => a.uid !== uidTarget));
  };

  const patchAnexo = (uidTarget: string, field: keyof AnexoItem, value: string) => {
    setAnexos(anexos.map((a) => (a.uid === uidTarget ? { ...a, [field]: value } : a)));
  };

  // Validações
  const formValido =
    profissionalResponsavel !== null &&
    (aderidoPasa === "Não" || (possuiCertificadoPasa === "Não" || certificadoPasaArquivo.trim() !== ""));

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;
    setSucesso(true);
  };

  const err = (cond: boolean) => (tentouSalvar && cond ? "Campo obrigatório." : undefined);

  const registroAtualizado = {
    ...registroInicial,
    aderidoPasa,
    possuiCertificadoPasa,
    certificadoPasaArquivo,
    certificadoPasaDescricao,
    profissionalResponsavel,
    profissionalCpf,
    anexos,
    observacao,
    situacao,
    dataHoraUltimaModificacao: new Date().toLocaleString("pt-BR")
  };

  return (
    <div className={cadastroVacinacaoPageClass("edit", "min-h-screen bg-[#f2f3f5] pb-24")}>
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="vacinador" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button
            onClick={() => onNavigate("vacinador")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-medium"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todos os vacinadores contra brucelose
          </button>
          <CadastroVacinacaoHeader
            mode="edit"
            nomeCadastro="Vacinador Contra Brucelose"
            rotaEditar="editar-vacinador-brucelose"
            dados={registroInicial}
            onNavigate={onNavigate}
            onSubmit={handleSalvar}
            submitLabel="Salvar"
          />
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-1 mb-2">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas (Desabilitadas conforme CA5) */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FloatInput
                label="Pessoa Física"
                required
                disabled
                value={registroInicial.nome}
                onChange={() => {}}
              />
            </div>
            <div>
              <FloatInput
                label="CPF"
                required
                disabled
                value={registroInicial.cpf}
                onChange={() => {}}
                mask="999.999.999-99"
              />
            </div>
          </div>
        </Section>

        {/* 2. Programa de Apoio a Saúde Agropecuária (PASA) */}
        <Section title="Programa de Apoio a Saúde Agropecuária (PASA)">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimNao
                label="É Aderido ao PASA?"
                required
                name="aderidoPasa"
                value={aderidoPasa}
                onChange={(v: boolean) => setAderidoPasa(v ? "Sim" : "Não")}
              />

              {aderidoPasa === "Sim" && (
                <SimNao
                  label="Possui Certificado PASA?"
                  required
                  name="possuiCertificadoPasa"
                  value={possuiCertificadoPasa}
                  onChange={(v: boolean) => setPossuiCertificadoPasa(v ? "Sim" : "Não")}
                />
              )}
            </div>

            {aderidoPasa === "Sim" && possuiCertificadoPasa === "Sim" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Certificado PASA <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="cert-pasa"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCertificadoPasaArquivo(e.target.files[0].name);
                        }
                      }}
                    />
                    <label
                      htmlFor="cert-pasa"
                      className="h-12 px-4 border border-gray-300 rounded-lg flex items-center gap-2 text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer font-medium transition flex-1 truncate"
                    >
                      <Paperclip size={18} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{certificadoPasaArquivo || "Anexar certificado (PDF, PNG, JPG - max 50MB)"}</span>
                    </label>
                  </div>
                  {err(!certificadoPasaArquivo) && (
                    <span className="text-xs text-red-500 mt-1 block">{err(!certificadoPasaArquivo)}</span>
                  )}
                </div>

                <FloatInput
                  label="Descrição do Certificado PASA"
                  maxLength={255}
                  value={certificadoPasaDescricao}
                  onChange={setCertificadoPasaDescricao}
                />
              </div>
            )}
          </div>
        </Section>

        {/* 3. Profissional Responsável */}
        <Section title="Profissional Responsável">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EntitySearchInput
              label="Profissional Responsável"
              required
              placeholder="Buscar por Nome ou CPF..."
              value={profissionalResponsavel ? profissionalResponsavel.nome : ""}
              data={PROFISSIONAIS_RESPONSAVEIS_MOCK}
              searchKeys={["nome", "cpf"]}
              columns={[
                { label: "Nome", key: "nome" },
                { label: "CPF", key: "cpf" },
              ]}
              icon={<User size={18} color={GREEN} />}
              title="Selecionar Profissional Responsável"
              subtitle="Busque por um profissional habilitado:"
              onChange={(ent: any) => {
                setProfissionalResponsavel(ent);
                setProfissionalCpf(ent?.cpf || "");
              }}
              error={err(!profissionalResponsavel)}
            />

            <FloatInput
              label="CPF do Profissional Responsável"
              required
              disabled
              value={profissionalCpf}
              onChange={() => {}}
              mask="999.999.999-99"
            />
          </div>
        </Section>

        {/* 4. Anexos (Zero ou mais) */}
        <Section title="Anexos (Opcional)">
          <DynamicListWrapper
            items={anexos}
            behavior="optional"
            addButtonLabel="Adicionar Documento"
            itemLabel="Documento"
            onAddItem={addAnexo}
            onRemoveItem={(i: number) => {
              const item = anexos[i];
              if (item) removeAnexo(item.uid);
            }}
            showCounter={true}
          >
            {(item: AnexoItem) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Documento <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`anexo-${item.uid}`}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          patchAnexo(item.uid, "arquivo", e.target.files[0].name);
                        }
                      }}
                    />
                    <label
                      htmlFor={`anexo-${item.uid}`}
                      className="h-12 px-4 border border-gray-300 rounded-lg flex items-center gap-2 text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer font-medium transition flex-1 truncate"
                    >
                      <Paperclip size={18} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.arquivo || "Anexar documento (PDF, PNG, JPG)"}</span>
                    </label>
                  </div>
                </div>

                <FloatInput
                  label="Descrição do Documento"
                  maxLength={255}
                  value={item.descricao}
                  onChange={(v) => patchAnexo(item.uid, "descricao", v)}
                />
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        {/* 5. Observações */}
        <Section title="Observações">
          <FloatInput
            label="Observação"
            maxLength={1500}
            value={observacao}
            onChange={setObservacao}
          />
        </Section>

        {/* 6. Situação do Cadastro e Histórico (CA5) */}
        <Section title="Situação e Histórico do Cadastro">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FloatSelect
                label="Situação do Cadastro"
                required
                value={situacao}
                onChange={(v: string) => setSituacao(v as "Ativo" | "Inativo")}
                options={[
                  { value: "Ativo", label: "Ativo" },
                  { value: "Inativo", label: "Inativo" },
                ]}
              />
            </div>
            <div className="flex flex-col justify-center px-3.5 py-2 bg-gray-50/80 rounded-lg border border-gray-200/70">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none mb-1">
                Última Alteração Por
              </span>
              <div className="text-sm font-medium text-gray-900 leading-snug">
                {registroInicial.usuarioUltimaAlteracao || "—"}
              </div>
            </div>
            <div className="flex flex-col justify-center px-3.5 py-2 bg-gray-50/80 rounded-lg border border-gray-200/70">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none mb-1">
                Data e Hora da Modificação
              </span>
              <div className="text-sm font-medium text-gray-900 leading-snug flex items-center gap-1">
                <Clock size={14} className="text-gray-400" />
                {registroInicial.dataHoraUltimaModificacao || "—"}
              </div>
            </div>
          </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: GREEN }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {mensagemSucessoCadastro("edit", "Vacinador Contra Brucelose")}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              As edições no cadastro de <span className="font-medium text-gray-700">{registroInicial.nome}</span> foram salvas com sucesso.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate("vacinador")}
                className="h-10 px-5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 transition hover:bg-gray-50"
              >
                Voltar à Lista
              </button>
              <button
                onClick={() => onNavigate("visualizar-vacinador-brucelose", registroAtualizado)}
                className="h-10 px-5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
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