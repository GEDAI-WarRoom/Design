import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, UploadField, LargeTextArea, SimNao } from "../../../components/ui/FormKit";
import { CertificadoraInput, DynamicListWrapper, ProprietarioInput, ResponsavelTecnicoInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const STATUS_CERTIFICADORA = [
  "Regular",
  "Suspensa em decorrência de não atualização de cadastro determinados no Ofício Circular da Coordenação de Sistemas de Rastreabilidade 019 de 27 de setembro de 2007",
  "Descredenciada em decorrência de não fornecimento das informações solicitadas pelo Ofício Circular da Coordenação de Sistemas de Rastreabilidade 003 de 16 de março de 2007",
  "Escritório suspenso faltando informação sobre anotação de responsabilidade técnica do médico veterinário",
  "Bloqueada",
  "Acesso regular via liminar",
  "Suspensão da inserção de novas propriedades até conclusão de procedimento administrativo",
  "Escritório fechado por iniciativa da certificadora em 01/11/2007",
  "Descredenciada a pedido",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
  dados?: any;
}

export function EditarCertificadoraSISBOVPage({ onLogout, onNavigate, dados }: PageProps) {
  const inicial = {
    id: 1,
    nome: "Rastro de Boi",
    proprietario: { nome: "Rastro de Boi Certificação", documento: "72.375.545/0001-93" },
    responsavel: { nome: "Gustavo de Souza Sobrinho", documento: "555.009.956-40" },
    credenciamento: "1706",
    status: "Regular",
    possuiCertEscritorio: "Não",
    certEscritorio: null,
    anexos: [{ uid: "anx-1", nome: "credenciamento_sisbov.pdf", descricao: "Documento de credenciamento" }],
    observacao: "Certificadora credenciada e com cadastro atualizado.",
    ...dados,
  };

  const normalizarEntidade = (valor: any, padrao: any) => {
    if (valor && typeof valor === "object") return valor;
    if (!valor) return padrao;
    const partes = String(valor).split(" - ");
    return { documento: partes.length > 1 ? partes[0] : padrao.documento, nome: partes.length > 1 ? partes.slice(1).join(" - ") : valor };
  };

  const [nome, setNome] = useState(inicial.nome);
  const [proprietario, setProprietario] = useState<any>(normalizarEntidade(inicial.proprietario, { nome: "Rastro de Boi Certificação", documento: "72.375.545/0001-93", tipo: "PJ" }));
  const [responsavel, setResponsavel] = useState<any>(normalizarEntidade(inicial.responsavel, { nome: "Gustavo de Souza Sobrinho", documento: "555.009.956-40" }));
  const [credenciamento, setCredenciamento] = useState(inicial.credenciamento || "1706");
  const [status, setStatus] = useState(inicial.status || "Regular");
  const [possuiCertEscritorio, setPossuiCertEscritorio] = useState(inicial.possuiCertEscritorio || "Não");
  const [certEscritorio, setCertEscritorio] = useState<any>(inicial.certEscritorio);
  const [anexos, setAnexos] = useState<any[]>(inicial.anexos || []);
  const [observacao, setObservacao] = useState(inicial.observacao || "");
  const [confirmar, setConfirmar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const registroAtual = () => ({ ...inicial, nome, proprietario, responsavel, credenciamento, status, possuiCertEscritorio, certEscritorio, anexos, observacao });

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="certificadora-sisbov" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("certificadora-sisbov")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Certificadoras SISBOV
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Certificadora SISBOV</h1>
            <button type="button" onClick={() => setConfirmar(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Salvar</button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-2">
          <Info size={20} className="text-gray-500 flex-shrink-0 stroke-[2.5]" />
          <p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.</p>
        </div>

        <Section title="Informações Básicas">
          <FloatInput label="Nome da Certificadora SISBOV" required value={nome} onChange={setNome} maxLength={255} />
        </Section>

        <Section title="Proprietário">
          <ProprietarioInput label="Proprietário" required value={proprietario?.nome || ""} data={[proprietario]} onChange={setProprietario} onEyeClick={() => proprietario && onNavigate("visualizar-pessoa-juridica", proprietario)} />
        </Section>

        <Section title="Responsável Técnico">
          <ResponsavelTecnicoInput label="Responsável Técnico" required value={responsavel?.nome || ""} data={[responsavel]} onChange={setResponsavel} onEyeClick={() => responsavel && onNavigate("visualizar-profissional", responsavel)} />
        </Section>

        <Section title="Informações Complementares">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput label="Credenciamento pela IN17_2006" required value={credenciamento} onChange={(valor: string) => setCredenciamento(valor.replace(/\D/g, ""))} maxLength={255} inputMode="numeric" />
              <FloatSelect label="Status da Certificadora" required value={status} onChange={setStatus} options={STATUS_CERTIFICADORA.map((item) => ({ value: item, label: item }))} />
            </div>
            <SimNao name="possui-certificadora-escritorio-edicao" label="Possui Certificadora do Escritório?" required value={possuiCertEscritorio} onChange={(valor: boolean) => { const resposta = valor ? "Sim" : "Não"; setPossuiCertEscritorio(resposta); if (!valor) setCertEscritorio(null); }} />
            {possuiCertEscritorio === "Sim" && (
              <CertificadoraInput label="Certificadora do Escritório" required value={certEscritorio?.nome || ""} onChange={setCertEscritorio} onEyeClick={() => certEscritorio && onNavigate("visualizar-certificadora-sisbov", certEscritorio)} />
            )}
          </div>
        </Section>

        <Section title="Anexos">
          <DynamicListWrapper items={anexos} behavior="zero-or-more" addButtonLabel="Adicionar Anexo" onAddItem={() => setAnexos((itens) => [...itens, { uid: uid("anx"), nome: "", descricao: "" }])} onRemoveItem={(index: number) => setAnexos((itens) => itens.filter((_, i) => i !== index))} variant="numbered" showCounter emptyLabel="Nenhum anexo adicionado.">
            {(item: any, index: number) => (
              <div className="flex gap-3 items-start w-full">
                <UploadField label="Documento" required fileName={item.nome} onSelectFile={() => setAnexos((itens) => itens.map((anexo, i) => i === index ? { ...anexo, nome: `documento_${index + 1}.pdf` } : anexo))} />
                {item.nome && <div className="flex-1"><FloatInput label="Descrição" value={item.descricao || ""} maxLength={255} onChange={(valor: string) => setAnexos((itens) => itens.map((anexo, i) => i === index ? { ...anexo, descricao: valor } : anexo))} /></div>}
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} />
        </Section>
      </main>

      {confirmar && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><h3 className="text-lg font-bold text-gray-900">Salvar alterações?</h3><p className="text-sm text-gray-500 mt-1">Confirme para atualizar os dados da certificadora.</p><div className="flex gap-3 justify-center mt-6"><button onClick={() => setConfirmar(false)} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Cancelar</button><button onClick={() => { setConfirmar(false); setSucesso(true); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Salvar</button></div></div></div>}
      {sucesso && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"><h3 className="text-lg font-bold text-gray-900">Alterações salvas com sucesso!</h3><div className="flex gap-3 justify-center mt-6"><button onClick={() => onNavigate("certificadora-sisbov")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold">Voltar</button><button onClick={() => onNavigate("visualizar-certificadora-sisbov", registroAtual())} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold">Visualizar</button></div></div></div>}
    </div>
  );
}
