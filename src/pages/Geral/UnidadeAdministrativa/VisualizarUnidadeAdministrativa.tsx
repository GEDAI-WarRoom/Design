import React, { useState } from "react";
import { ArrowLeft, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea } from "../../../components/ui/FormKit";

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

export function VisualizarUnidadeAdministrativaPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const telefoneRecebido = dados?.telefones?.[0];
  const unidade = {
    ...(dados || {}),
    nome: dados?.nome || EXEMPLO_UNIDADE.nome,
    sigla: dados?.sigla || EXEMPLO_UNIDADE.sigla,
    municipio: dados?.municipio || EXEMPLO_UNIDADE.municipio,
    situacao: dados?.situacao || EXEMPLO_UNIDADE.situacao,
    endereco: enderecoComExemplos({
      ...(dados?.endereco || {}),
      municipio: dados?.endereco?.municipio || dados?.municipio,
    }),
    email: dados?.email || EXEMPLO_UNIDADE.email,
    telefones: [{
      numero: telefoneRecebido?.numero || EXEMPLO_UNIDADE.telefones[0].numero,
      observacao: telefoneRecebido?.observacao || EXEMPLO_UNIDADE.telefones[0].observacao,
    }],
    observacao: dados?.observacao || EXEMPLO_UNIDADE.observacao,
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="unidade-administrativa" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("unidade-administrativa")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Unidades Administrativas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Unidade Administrativa</h1>
            <button type="button" onClick={() => onNavigate("editar-unidade-administrativa", unidade)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm flex items-center gap-2">
              Editar
            </button>
          </div>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Nome da Unidade" value={unidade.nome} disabled onChange={() => { }} />
            <FloatInput label="Sigla" value={unidade.sigla} disabled onChange={() => { }} />
          </div>
        </Section>

        <Section title="Informações de Localização">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FloatInput label="Zona" value={unidade.endereco.zona} disabled onChange={() => { }} />
            <FloatInput label="CEP" value={unidade.endereco.cep} disabled onChange={() => { }} />
            <FloatInput label="Estado" value={unidade.endereco.estado} disabled onChange={() => { }} />
            <FloatInput label="Município" value={unidade.endereco.municipio || unidade.municipio} disabled onChange={() => { }} />
            <FloatInput label="Bairro" value={unidade.endereco.bairro} disabled onChange={() => { }} />
            <FloatInput label="Endereço" value={unidade.endereco.endereco} disabled onChange={() => { }} />
            <FloatInput label="Número" value={unidade.endereco.numero} disabled onChange={() => { }} />
            <FloatInput label="Complemento" value={unidade.endereco.complemento || "-"} disabled onChange={() => { }} />
            <FloatInput label="Localidade" value={unidade.endereco.localidade} disabled onChange={() => { }} />
            <FloatInput label="Latitude" value={unidade.endereco.latitude} disabled onChange={() => { }} />
            <FloatInput label="Longitude" value={unidade.endereco.longitude} disabled onChange={() => { }} />
          </div>
        </Section>

        <Section title="Informações de Contato">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Email" value={unidade.email} disabled onChange={() => { }} />
            <FloatInput label="Número" value={unidade.telefones[0].numero} disabled onChange={() => { }} />
            <div className="md:col-span-2">
              <FloatInput label="Observação do Telefone" value={unidade.telefones[0].observacao || "-"} disabled onChange={() => { }} />
            </div>
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={unidade.observacao} disabled onChange={() => { }} />
        </Section>
      </main>
    </div>
  );
}
