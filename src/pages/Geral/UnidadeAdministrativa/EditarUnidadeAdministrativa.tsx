import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";
import { BlocoEnderecoFields } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

const EXEMPLO_UNIDADE = {
  nome: "Escritório Seccional de Lavras",
  sigla: "SECLAV3820",
  municipio: "Lavras",
  situacao: "Ativo",
  endereco: { zona: "Urbana", cep: "37200-000", estado: "Minas Gerais", municipio: "Lavras", bairro: "Centro", endereco: "Rua Raul Soares", numero: "65", complemento: "2º andar", localidade: "Centro", distrito: "", latitude: "-21.2453", longitude: "-44.9997" },
  email: "lavras@ima.mg.gov.br",
  telefones: [{ numero: "(35) 3821-1224", observacao: "Atendimento e WhatsApp" }],
  observacao: "Atendimento ao público de segunda a sexta-feira, das 8h às 17h.",
};

function enderecoComExemplos(endereco?: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(EXEMPLO_UNIDADE.endereco).map(([campo, exemplo]) => [
      campo,
      endereco?.[campo]?.trim() || exemplo,
    ]),
  ) as typeof EXEMPLO_UNIDADE.endereco;
}

function Section({ title, children }: { title: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-5 bg-white">{children}</div>}
    </div>
  );
}

export function EditarUnidadeAdministrativaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  const [nome, setNome] = useState(dados?.nome || EXEMPLO_UNIDADE.nome);
  const [sigla, setSigla] = useState(dados?.sigla || EXEMPLO_UNIDADE.sigla);
  const [situacao, setSituacao] = useState(dados?.situacao || EXEMPLO_UNIDADE.situacao);
  const [endereco, setEndereco] = useState(() => enderecoComExemplos({
    ...(dados?.endereco || {}),
    municipio: dados?.endereco?.municipio || dados?.municipio,
  }));
  const [email, setEmail] = useState(dados?.email || EXEMPLO_UNIDADE.email);
  const telefoneInicial = dados?.telefones?.[0] || EXEMPLO_UNIDADE.telefones[0];
  const [telefone, setTelefone] = useState(telefoneInicial.numero || EXEMPLO_UNIDADE.telefones[0].numero);
  const [telefoneObservacao, setTelefoneObservacao] = useState(telefoneInicial.observacao || EXEMPLO_UNIDADE.telefones[0].observacao);
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_UNIDADE.observacao);

  const dadosAtualizados = { ...dados, nome, sigla, municipio: endereco.municipio, situacao, endereco, email, telefones: [{ numero: telefone, observacao: telefoneObservacao }], observacao };

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-administrativa" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("unidade-administrativa")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Unidades Administrativas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Unidade Administrativa</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome da Unidade" required value={nome} onChange={setNome} maxLength={255} />
            <FloatInput label="Sigla" required value={sigla} onChange={setSigla} maxLength={50} />
            <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]} />
          </div>
        </Section>

        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Localização"
            tipoEstado="normal"
            data={endereco}
            onChange={(key, value) => setEndereco((current) => ({ ...current, [key]: value }))}
            onSetMultipleFields={(fields) => setEndereco((current) => ({ ...current, ...fields }))}
          />
        </Section>

        <Section title="Informações de Contato">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Email" type="email" value={email} onChange={setEmail} maxLength={255} />
            <FloatInput label="Número" required value={telefone} onChange={setTelefone} placeholder="(XX) XXXXX-XXXX" />
            <div className="md:col-span-2">
              <FloatInput label="Observação do Telefone" value={telefoneObservacao} onChange={setTelefoneObservacao} maxLength={255} />
            </div>
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais." />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">A unidade "{nome}" foi atualizada com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("unidade-administrativa"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-unidade-administrativa", dadosAtualizados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
