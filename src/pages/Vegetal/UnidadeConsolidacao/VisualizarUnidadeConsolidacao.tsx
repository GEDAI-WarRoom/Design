import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

const EXEMPLO_UNIDADE = { codigo: "31016070001", nome: "Unidade São José", localizacaoLivro: "Armário 2, prateleira A", situacao: "Ativo", proprietarios: [{ nome: "José Aarão Neto", documento: "555.009.956-40" }], engenheiroNome: "Flávio Silva", engenheiroCpf: "111.222.333-44", responsavelPtvNome: "Divino de Souza Sobrinho", responsavelPtvCpf: "444.009.956-40", endereco: { zona: "Urbana", cep: "38540-000", estado: "Minas Gerais", municipio: "Abadia dos Dourados", bairro: "Centro", endereco: "Rua das Palmeiras", numero: "125", complemento: "Galpão 2", localidade: "Centro", distrito: "" }, contato: { emailFixo: "contato@unidadesaojose.com.br", emailFixoObs: "Contato administrativo", telefoneFixo: "(34) 3847-1200", telefoneFixoObs: "Atendimento comercial" }, anexos: [{ nome: "registro_unidade.pdf", descricao: "Registro da unidade de consolidação" }], observacao: "Unidade habilitada para consolidação e emissão de documentos fitossanitários." };
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

export function VisualizarUnidadeConsolidacaoPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const unidade = { ...(dados || {}), codigo: dados?.codigo || EXEMPLO_UNIDADE.codigo, nome: dados?.nome || EXEMPLO_UNIDADE.nome, localizacaoLivro: dados?.localizacaoLivro || EXEMPLO_UNIDADE.localizacaoLivro, situacao: dados?.situacao || EXEMPLO_UNIDADE.situacao, proprietarios: dados?.proprietarios?.length ? dados.proprietarios : EXEMPLO_UNIDADE.proprietarios, engenheiroNome: dados?.engenheiroNome || EXEMPLO_UNIDADE.engenheiroNome, engenheiroCpf: dados?.engenheiroCpf || EXEMPLO_UNIDADE.engenheiroCpf, responsavelPtvNome: dados?.responsavelPtvNome || EXEMPLO_UNIDADE.responsavelPtvNome, responsavelPtvCpf: dados?.responsavelPtvCpf || EXEMPLO_UNIDADE.responsavelPtvCpf, endereco: preencher(dados?.endereco, EXEMPLO_UNIDADE.endereco), contato: preencher(dados?.contato, EXEMPLO_UNIDADE.contato), anexos: dados?.anexos?.length ? dados.anexos : EXEMPLO_UNIDADE.anexos, observacao: dados?.observacao || EXEMPLO_UNIDADE.observacao };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-consolidacao" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("unidade-consolidacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Unidades de Consolidação
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Unidade de Consolidação</h1>
            <button type="button" onClick={() => onNavigate("editar-unidade-consolidacao", unidade)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Código" value={unidade.codigo} disabled onChange={() => {}} />
            <FloatInput label="Nome da Unidade" value={unidade.nome} disabled onChange={() => {}} />
            <FloatInput label="Localização do Livro" value={unidade.localizacaoLivro} disabled onChange={() => {}} />
          </div>
        </Section>

        <Section title="Proprietários">{unidade.proprietarios.map((item: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Nome / Razão Social" value={item.nome} disabled onChange={() => {}} /><FloatInput label="CPF / CNPJ" value={item.documento} disabled onChange={() => {}} /></div>)}</Section>
        <Section title="Profissionais"><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Engenheiro Agrônomo/Florestal" value={unidade.engenheiroNome} disabled onChange={() => {}} /><FloatInput label="CPF do Engenheiro" value={unidade.engenheiroCpf} disabled onChange={() => {}} /><FloatInput label="Responsável pela Emissão de PTV" value={unidade.responsavelPtvNome} disabled onChange={() => {}} /><FloatInput label="CPF do Responsável" value={unidade.responsavelPtvCpf} disabled onChange={() => {}} /></div></Section>
        <Section title="Localização"><div className="grid grid-cols-1 md:grid-cols-3 gap-5">{Object.entries(unidade.endereco).map(([campo, valor]) => <FloatInput key={campo} label={({ zona: "Zona", cep: "CEP", estado: "Estado", municipio: "Município", bairro: "Bairro", endereco: "Endereço", numero: "Número", complemento: "Complemento", localidade: "Localidade", distrito: "Distrito" } as any)[campo]} value={String(valor)} disabled onChange={() => {}} />)}</div></Section>
        <Section title="Contatos"><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Email" value={unidade.contato.emailFixo} disabled onChange={() => {}} /><FloatInput label="Observação do Email" value={unidade.contato.emailFixoObs} disabled onChange={() => {}} /><FloatInput label="Telefone" value={unidade.contato.telefoneFixo} disabled onChange={() => {}} /><FloatInput label="Observação do Telefone" value={unidade.contato.telefoneFixoObs} disabled onChange={() => {}} /></div></Section>
        <Section title="Anexos">{unidade.anexos.map((anexo: any, index: number) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5"><FloatInput label="Documento" value={anexo.nome} disabled onChange={() => {}} /><FloatInput label="Descrição" value={anexo.descricao} disabled onChange={() => {}} /></div>)}</Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={unidade.observacao} disabled onChange={() => {}} />
        </Section>
      </main>
    </div>
  );
}
