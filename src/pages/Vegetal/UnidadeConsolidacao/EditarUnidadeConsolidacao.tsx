import React, { useState } from "react";
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_UNIDADE = {
  codigo: "31016070001", nome: "Unidade São José", localizacaoLivro: "Armário 2, prateleira A", situacao: "Ativo",
  proprietarios: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }],
  engenheiroNome: "Flávio Silva", engenheiroCpf: "111.222.333-44", responsavelPtvNome: "Divino de Souza Sobrinho", responsavelPtvCpf: "444.009.956-40",
  endereco: { zona: "Urbana", cep: "38540-000", estado: "Minas Gerais", municipio: "Abadia dos Dourados", bairro: "Centro", endereco: "Rua das Palmeiras", numero: "125", complemento: "Galpão 2", localidade: "Centro", distrito: "" },
  contato: { emailFixo: "contato@unidadesaojose.com.br", emailFixoObs: "Contato administrativo", telefoneFixo: "(34) 3847-1200", telefoneFixoObs: "Atendimento comercial" },
  anexos: [{ nome: "registro_unidade.pdf", descricao: "Registro da unidade de consolidação" }],
  observacao: "Unidade habilitada para consolidação e emissão de documentos fitossanitários.",
};

const preencher = (recebido: any, exemplo: any) => Object.fromEntries(Object.entries(exemplo).map(([campo, valor]) => [campo, recebido?.[campo] || valor]));

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

export function EditarUnidadeConsolidacaoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);
  const codigo = dados?.codigo || EXEMPLO_UNIDADE.codigo;
  const [nome, setNome] = useState(dados?.nome || EXEMPLO_UNIDADE.nome);
  const [localizacaoLivro, setLocalizacaoLivro] = useState(dados?.localizacaoLivro || EXEMPLO_UNIDADE.localizacaoLivro);
  const [situacao, setSituacao] = useState(dados?.situacao || EXEMPLO_UNIDADE.situacao);
  const proprietarios = dados?.proprietarios?.length ? dados.proprietarios : EXEMPLO_UNIDADE.proprietarios;
  const [engenheiroNome, setEngenheiroNome] = useState(dados?.engenheiroNome || EXEMPLO_UNIDADE.engenheiroNome);
  const [engenheiroCpf, setEngenheiroCpf] = useState(dados?.engenheiroCpf || EXEMPLO_UNIDADE.engenheiroCpf);
  const [responsavelPtvNome, setResponsavelPtvNome] = useState(dados?.responsavelPtvNome || EXEMPLO_UNIDADE.responsavelPtvNome);
  const [responsavelPtvCpf, setResponsavelPtvCpf] = useState(dados?.responsavelPtvCpf || EXEMPLO_UNIDADE.responsavelPtvCpf);
  const [endereco, setEndereco] = useState(() => preencher(dados?.endereco, EXEMPLO_UNIDADE.endereco));
  const [contato, setContato] = useState(() => preencher(dados?.contato, EXEMPLO_UNIDADE.contato));
  const anexos = dados?.anexos?.length ? dados.anexos : EXEMPLO_UNIDADE.anexos;
  const [observacao, setObservacao] = useState(dados?.observacao || EXEMPLO_UNIDADE.observacao);

  const dadosAtualizados = { ...dados, codigo, nome, localizacaoLivro, situacao, proprietarios, engenheiroNome, engenheiroCpf, responsavelPtvNome, responsavelPtvCpf, endereco, municipio: endereco.municipio, contato, anexos, observacao };

  const handleSalvar = () => setIsSucesso(true);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-consolidacao" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("unidade-consolidacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Unidades de Consolidação
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Unidade de Consolidação</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Código" value={codigo} disabled onChange={()=>{}} />
            <FloatInput label="Nome da Unidade" required value={nome} onChange={setNome} maxLength={255} />
            <FloatInput label="Localização do Livro" value={localizacaoLivro} onChange={setLocalizacaoLivro} maxLength={255} />
          </div>
        </Section>

        <Section title="Proprietários">
          {proprietarios.map((item: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Nome / Razão Social" value={item.nome} disabled onChange={() => {}} /><FloatInput label="CPF / CNPJ" value={item.documento} disabled onChange={() => {}} /></div>)}
        </Section>

        <Section title="Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Engenheiro Agrônomo/Florestal" value={engenheiroNome} onChange={setEngenheiroNome} /><FloatInput label="CPF do Engenheiro" value={engenheiroCpf} onChange={setEngenheiroCpf} /><FloatInput label="Responsável pela Emissão de PTV" value={responsavelPtvNome} onChange={setResponsavelPtvNome} /><FloatInput label="CPF do Responsável" value={responsavelPtvCpf} onChange={setResponsavelPtvCpf} /></div>
        </Section>

        <Section title="Localização">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{Object.entries(endereco).map(([campo, valor]) => <FloatInput key={campo} label={({ zona: "Zona", cep: "CEP", estado: "Estado", municipio: "Município", bairro: "Bairro", endereco: "Endereço", numero: "Número", complemento: "Complemento", localidade: "Localidade", distrito: "Distrito" } as any)[campo]} value={String(valor)} onChange={(value) => setEndereco((current: any) => ({ ...current, [campo]: value }))} />)}</div>
        </Section>

        <Section title="Contatos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Email" value={contato.emailFixo} onChange={(value) => setContato((current: any) => ({ ...current, emailFixo: value }))} /><FloatInput label="Observação do Email" value={contato.emailFixoObs} onChange={(value) => setContato((current: any) => ({ ...current, emailFixoObs: value }))} /><FloatInput label="Telefone" value={contato.telefoneFixo} onChange={(value) => setContato((current: any) => ({ ...current, telefoneFixo: value }))} /><FloatInput label="Observação do Telefone" value={contato.telefoneFixoObs} onChange={(value) => setContato((current: any) => ({ ...current, telefoneFixoObs: value }))} /></div>
        </Section>

        <Section title="Anexos">
          {anexos.map((anexo: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Documento" value={anexo.nome} disabled onChange={() => {}} /><FloatInput label="Descrição" value={anexo.descricao} disabled onChange={() => {}} /></div>)}
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">A unidade "{nome}" foi atualizada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("unidade-consolidacao"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-unidade-consolidacao", dadosAtualizados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
