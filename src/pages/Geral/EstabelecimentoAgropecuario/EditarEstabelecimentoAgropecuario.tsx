import React, { useState } from "react";
import { ArrowLeft, Info, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea } from "../../../components/ui/FormKit";
import { BlocoEnderecoFields, BlocoContatoFields, ProdutorInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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

export function EditarEstabelecimentoAgropecuarioPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  
  // Estados preenchidos com os dados recebidos
  const [nome, setNome] = useState(dados?.nome || "");
  const [situacao, setSituacao] = useState(dados?.situacao || "Ativo");
  const [produtor, setProdutor] = useState(dados?.proprietario || "");
  
  const [endereco, setEndereco] = useState({
    zona: "Urbana", cep: "37200-000", estado: "Minas Gerais", municipio: dados?.municipio || "", bairro: "Centro",
    endereco: "Rua Principal", numero: "123", complemento: "", localidade: "", distrito: "", latitude: "", longitude: ""
  });
  
  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não" as const, proprietariosSelecionados: [] as string[],
    emailFixo: "contato@fazenda.com", emailFixoObs: "", telefoneFixo: "(35) 99999-9999", telefoneFixoObs: "", contatosAdicionais: [] as any[]
  });
  
  const [observacao, setObservacao] = useState(dados?.observacao || "");

  const handleSalvar = () => {
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agropecuario" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        <div>
          <button type="button" onClick={() => onNavigate("estabelecimento-agropecuario")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Estabelecimentos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Estabelecimento Agropecuário</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FloatInput label="Código" value={dados?.codigo || ""} disabled onChange={()=>{}} />
            <FloatSelect
              label="Situação" required value={situacao} onChange={setSituacao}
              options={[ { value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }, { value: "Suspenso", label: "Suspenso" } ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome do Estabelecimento" required value={nome} onChange={setNome} maxLength={255} />
            <ProdutorInput value={produtor} onChange={(e) => setProdutor(e.nome)} />
          </div>
        </Section>

        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço Principal" tipoEstado="normal" data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        <Section title="Informações de Contato">
          <BlocoContatoFields data={contatos} onChange={(updated) => setContatos((prev) => ({ ...prev, ...updated }))} proprietariosDisponiveis={[]} />
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O estabelecimento "{nome}" foi atualizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("estabelecimento-agropecuario"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-estabelecimento-agropecuario", dados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}