import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  MapPin,
  Trash2,
  UserRound,
  Map,
  Info,
  Download,
  Calendar,
  Eye
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";

import {
  FloatInput,
  FloatSelect,
  FloatCombobox,
  CustomRadio,
  UploadField,
  LargeTextArea,
  SearchModal
} from "../../../components/ui/FormKit"; 

const GREEN = "#1A7A3C";

// Mocks importados/replicados da página de adicionar
const PESSOAS_MOCK = [
  { id: 1, nome: "Divino Alves Inácio", cpf: "940.877.688-72", sexo: "M", dataNascimento: "1978-04-15", estadoCivil: "casado" },
  { id: 2, nome: "Divino de Souza Sobrinho", cpf: "444.009.956-40", sexo: "M", dataNascimento: "1965-11-22", estadoCivil: "solteiro" },
  { id: 3, nome: "Divino José Fonseca", cpf: "017.704.896-49", sexo: "M", dataNascimento: "1982-08-03", estadoCivil: "divorciado" },
].sort((a, b) => a.nome.localeCompare(b.nome));

const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Abadia dos Dourados", "Passos", "Uberlândia"];
const LOCALIDADES_MOCK = ["Centro", "Floresta", "Serrinha", "Vale do Sul"];
const DISTRITOS_MOCK = ["Abadia dos Dourados", "Abaeté", "Distrito de Campos do Meio", "Vale do Norte"];
const TIPOS_CONTATO = ["E-mail", "Telefone", "Celular", "Fax"];

const aplicarMascaraCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};

const aplicarMascaraCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

const aplicarMascaraCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não for número
    .slice(0, 14) // Limita a 14 dígitos
    .replace(/^(\d{2})(\d)/, "$1.$2") // Coloca o primeiro ponto
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Coloca o segundo ponto
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // Coloca a barra
    .replace(/(\d{4})(\d)/, "$1-$2"); // Coloca o hífen
};

interface EnderecoState { 
  zona: string; cep: string; estado: string; municipio: string; bairro: string; 
  endereco: string; numero: string; complemento: string; localidade: string; distrito: string; 
  latitude?: string; longitude?: string; 
}

interface RepresentanteState {
  id: string; nome: string; cpf: string; descricao: string; documentoNome: string;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5 relative">{children}</div>}
    </div>
  );
}

// Reutilização do Bloco de Endereço da sua árvore de componentes
function BlocoEnderecoFields({ title, data, isCorrespondencia = false, onChange, onSetMultipleFields, onOpenMap }: any) {
  const isRural = data.zona === "Rural";

  const handleCepChange = async (val: string) => {
    const formatado = aplicarMascaraCEP(val);
    onChange("cep", formatado);
    const apenasNumeros = formatado.replace(/\D/g, "");
    if (apenasNumeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);
        const json = await response.json();
        if (!json.erro) {
          onSetMultipleFields({
            cep: formatado,
            estado: json.uf === "MG" ? "Minas Gerais" : json.uf || "",
            municipio: json.localidade || "",
            bairro: json.bairro || "",
            endereco: json.logradouro || "",
          });
        }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className={`grid grid-cols-1 gap-3 ${isRural ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
        <FloatSelect label="Zona" required value={data.zona} disabled={isCorrespondencia} onChange={(z) => onChange("zona", z)} options={[{ value: "Urbana", label: "Urbana" }, { value: "Rural", label: "Rural" }]} />
        {!isRural && <FloatInput label="CEP" required value={data.cep} onChange={handleCepChange} maxLength={9} />}
        <FloatSelect label="Estado" required value={data.estado} disabled={isRural} onChange={(v) => onChange("estado", v)} options={[{ value: "Minas Gerais", label: "Minas Gerais" }]} />
        <FloatCombobox label="Município" required value={data.municipio} onChange={(v) => onChange("municipio", v)} options={MUNICIPIOS_MOCK} />
        {!isRural && <FloatInput label="Bairro" required value={data.bairro} onChange={(v) => onChange("bairro", v)} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className={`relative hover:z-30 focus-within:z-30 ${isRural ? "md:col-span-12" : "md:col-span-7"}`}>
          <FloatInput label="Endereço" required value={data.endereco} onChange={(v) => onChange("endereco", v)} className="w-full" />
        </div>
        {!isRural && (
          <>
            <FloatInput label="Número" required value={data.numero} onChange={(v) => onChange("numero", v)} className="md:col-span-2" />
            <FloatInput label="Complemento" value={data.complemento} onChange={(v) => onChange("complemento", v)} className="md:col-span-3" />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatCombobox label="Localidade" value={data.localidade} onChange={(v) => onChange("localidade", v)} options={LOCALIDADES_MOCK} />
        <FloatCombobox label="Distrito" value={data.distrito} onChange={(v) => onChange("distrito", v)} options={DISTRITOS_MOCK} />
      </div>

      {!(data.latitude && data.longitude) ? (
        <button type="button" onClick={onOpenMap} className="w-full flex items-center justify-center gap-2 border border-[#1A7A3C] rounded-md h-11 text-sm font-semibold text-[#1A7A3C] hover:bg-green-50 transition shadow-sm">
          <Map size={16} /> Adicionar Coordenadas
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-2">
            <button type="button" onClick={onOpenMap} className="w-full flex items-center justify-center border border-[#1A7A3C] rounded-md h-11 bg-white hover:bg-green-50/30 text-[#1A7A3C] transition">
              <Map size={18} />
            </button>
          </div>
          <div className="md:col-span-5">
            <FloatInput label="Latitude" value={data.latitude} disabled={true} onChange={() => {}} />
          </div>
          <div className="md:col-span-5">
            <FloatInput label="Longitude" value={data.longitude} disabled={true} onChange={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTE PRINCIPAL DE EDIÇÃO
export function EditarPessoaJuridicaPage({ dadosIniciais, onLogout, onNavigate }: { dadosIniciais: any; onLogout: () => void; onNavigate: (screen: string, params?: any) => void }) {
  // Inicialização dos estados carregando os dados pré-existentes vindos da navegação
  const [cpf, setCpf] = useState(dadosIniciais?.cpf || "");
  const [cnpj, setCnpj] = useState(dadosIniciais?.cnpj || "");
  const [razaoSocial, setRazaoSocial] = useState(dadosIniciais?.razaoSocial || "");
  const [nomeFantasia, setNomeFantasia] = useState(dadosIniciais?.nomeFantasia || "");
  const [isSucessoModalOpen, setIsSucessoModalOpen] = useState(false);

const [isCadastroAtivo, setIsCadastroAtivo] = useState(dadosIniciais?.status !== "Inativo");
const [isConfirmarToggleModalOpen, setIsConfirmarToggleModalOpen] = useState(false);
const [proximoEstadoAtivo, setProximoEstadoAtivo] = useState(isCadastroAtivo);
  
  const [representantes, setRepresentantes] = useState<RepresentanteState[]>(dadosIniciais?.representantes || []);
  const [modalRepIndex, setModalRepIndex] = useState<number | null>(null);
  const [showContatoTooltip, setShowContatoTooltip] = useState(false);

  const [isEnderecoResidencia, setIsEnderecoResidencia] = useState<"Sim" | "Não">(dadosIniciais?.residencia ? "Não" : "Sim");
  const [observacaoResidencia, setObservacaoResidencia] = useState(dadosIniciais?.observacaoResidencia || "");

  const [correspondencia, setCorrespondencia] = useState<EnderecoState>(dadosIniciais?.correspondencia || { zona: "Urbana", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "" });
  const [residencia, setResidencia] = useState<EnderecoState>(dadosIniciais?.residencia || { zona: "Urbana", cep: "", estado: "", municipio: "", bairro: "", endereco: "", numero: "", complemento: "", localidade: "", distrito: "" });

  const [contatosFixos, setContatosFixos] = useState(dadosIniciais?.contatosFixos || [
    { id: "fixed-1", tipo: "E-mail", valor: "", observacao: "" },
    { id: "fixed-2", tipo: "Telefone", valor: "", observacao: "" }
  ]);
  const [outrosContatos, setOutrosContatos] = useState<any[]>(dadosIniciais?.outrosContatos || []);
  const [observacaoGeral, setObservacaoGeral] = useState(dadosIniciais?.observacaoGeral || "");

  // Função para salvar as alterações
  const [dadosSalvosTemporarios, setDadosSalvosTemporarios] = useState<any>(null);

  const handleSalvarEdicao = () => {
    const dadosAtualizados = {
      ...dadosIniciais,
      cnpj, razaoSocial, nomeFantasia, cpf, 
      representantes, correspondencia,
      residencia: isEnderecoResidencia === "Não" ? residencia : null,
      observacaoResidencia, contatosFixos, outrosContatos, observacaoGeral
    };
  
    // Armazena os dados atualizados para usar quando o usuário escolher uma ação no modal
    setDadosSalvosTemporarios(dadosAtualizados);
    // Abre o modal de sucesso
    setIsSucessoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <button type="button" onClick={() => onNavigate("visualizar-pessoa-juridica", dadosIniciais)} className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70">
            <ArrowLeft size={15} /> Visualizar Pessoa Jurídica
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Pessoa Jurídica</h1>
            
            <button
              type="button"
              onClick={handleSalvarEdicao}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <FloatInput label="CPF" required value={cnpj} onChange={(v) => setCpf(aplicarMascaraCNPJ(v))} maxLength={14} className="w-[200px] flex-shrink-0" />
              <FloatInput label="Razão Social" required value={razaoSocial} onChange={setRazaoSocial} className="flex-1" />
              <FloatInput label="Nome Fantasia" required value={nomeFantasia} onChange={setNomeFantasia} className="flex-1" />

            </div>
  
          </div>
        </Section>

        {/* 2. Representantes Legais */}
        <Section title="Representantes Legais">
          <div className="flex flex-col gap-6">
            {representantes.map((rep, index) => (
              <div key={rep.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white border border-gray-100">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">{index + 1}</div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-end w-full">
                    <div className="flex-1">
                      <FloatInput label="Representante Legal" required value={rep.nome} onChange={() => {}} icon={<UserRound size={18} />} onClick={() => setModalRepIndex(index)} />
                    </div>
                    {rep.nome && (
                      <div className="w-72">
                        <FloatInput label="CPF" required value={rep.cpf} onChange={() => {}} disabled />
                      </div>
                    )}
                    <button type="button" onClick={() => setRepresentantes((prev) => prev.filter((r) => r.id !== rep.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition h-12">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setRepresentantes((prev) => [...prev, { id: String(Date.now()), nome: "", cpf: "", descricao: "", documentoNome: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 h-11 rounded-lg border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 w-fit transition">
              <PlusCircle size={18} /> Adicionar Representante Legal
            </button>
          </div>
        </Section>

        {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-6">
            <BlocoEnderecoFields title="Endereço de Correspondência" data={correspondencia} isCorrespondencia={true} onChange={(key: any, val: any) => setCorrespondencia((p) => ({ ...p, [key]: val }))} onSetMultipleFields={(fields: any) => setCorrespondencia((p) => ({ ...p, ...fields }))} onOpenMap={() => {}} />
            
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700">É o endereço de residência?</span>
              <div className="flex items-center gap-6 mt-1">
                <CustomRadio label="Sim" name="res" value="Sim" checked={isEnderecoResidencia === "Sim"} onChange={() => setIsEnderecoResidencia("Sim")} />
                <CustomRadio label="Não" name="res" value="Não" checked={isEnderecoResidencia === "Não"} onChange={() => setIsEnderecoResidencia("Não")} />
              </div>
            </div>

            {isEnderecoResidencia === "Não" && (
              <div className="flex flex-col gap-5">
                <BlocoEnderecoFields title="Endereço de Residência" data={residencia} isCorrespondencia={false} onChange={(key: any, val: any) => setResidencia((p) => ({ ...p, [key]: val }))} onSetMultipleFields={(fields: any) => setResidencia((p) => ({ ...p, ...fields }))} onOpenMap={() => {}} />
                <LargeTextArea label="Observação do Endereço" value={observacaoResidencia} onChange={setObservacaoResidencia} />
              </div>
            )}
          </div>
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {contatosFixos.map((contato, index) => (
                <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <FloatSelect label="Tipo de Contato" required value={contato.tipo} disabled={true} onChange={() => {}} options={TIPOS_CONTATO.map(t => ({ value: t, label: t }))} className="md:col-span-3" />
                  <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} required value={contato.valor} onChange={(v) => setContatosFixos(prev => prev.map((c, i) => i === index ? { ...c, valor: v } : c))} className="md:col-span-4" />
                  <div className="md:col-span-5 relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-white">
                    <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                    <textarea value={contato.observacao} maxLength={1500} onChange={(e) => setContatosFixos(prev => prev.map((c, i) => i === index ? { ...c, observacao: e.target.value } : c))} className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none flex-1 mt-1 leading-tight" />
                    <span className="text-right text-[9px] text-gray-400">{contato.observacao.length}/1500</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Outros Contatos</span>
              {outrosContatos.map((contato, index) => (
                <div key={contato.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border border-gray-100 p-4 rounded-xl relative bg-gray-50/50">
                  <FloatSelect label="Tipo de Contato" required value={contato.tipo} onChange={(v) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, tipo: v } : c))} options={TIPOS_CONTATO.map(t => ({ value: t, label: t }))} className="md:col-span-3" />
                  <FloatInput label={contato.tipo === "E-mail" ? "Email" : "Número"} required value={contato.valor} onChange={(v) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, valor: v } : c))} className="md:col-span-4" />
                  <div className="md:col-span-4 relative border border-gray-300 rounded-md h-24 flex flex-col justify-between p-2.5 bg-white">
                    <label className="text-[10px] text-gray-400 font-medium">Observação</label>
                    <textarea value={contato.observacao} maxLength={1500} onChange={(e) => setOutrosContatos(prev => prev.map((c, i) => i === index ? { ...c, observacao: e.target.value } : c))} className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none flex-1 mt-1 leading-tight" />
                    <span className="text-right text-[9px] text-gray-400">{contato.observacao.length}/1500</span>
                  </div>
                  <div className="md:col-span-1 flex justify-center pt-1.5">
                    <button type="button" onClick={() => setOutrosContatos(prev => prev.filter(c => c.id !== contato.id))} className="p-2.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setOutrosContatos(prev => [...prev, { id: String(Date.now()), tipo: "Celular", valor: "", observacao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition">
                <PlusCircle size={16} /> Adicionar Outro Contato
              </button>
            </div>
          </div>
        </Section>

        {/* 5. Observações Gerais */}
        <Section title="Observação Geral">
          <LargeTextArea label="Observações pertinentes ao cadastro" value={observacaoGeral} onChange={setObservacaoGeral} />
        </Section>

{/* Seção: Situação do Cadastro com Toggle */}
<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
  <div className="flex flex-col gap-1">
    <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
    <p className="text-xs text-gray-400 font-normal">
      Indica se o cadastro está ativo (em uso) ou inativo (excluído, mantido apenas para registro e histórico).
    </p>
  </div>
  
  {/* Container do Toggle */}
  <div className="flex items-center gap-3 select-none flex-shrink-0">
    <span className={`text-xs font-semibold transition-colors duration-200 ${!isCadastroAtivo ? "text-red-600" : "text-gray-400"}`}>
      Inativo
    </span>
    
    {/* Botão Switch/Toggle (Fica Verde se ativo, ou Vermelho se inativo) */}
    <button
      type="button"
      onClick={() => {
        setProximoEstadoAtivo(!isCadastroAtivo);
        setIsConfirmarToggleModalOpen(true);
      }}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 outline-none ${
        isCadastroAtivo ? "bg-[#1A7A3C]" : "bg-red-600" // 🚀 Agora fica Vermelho quando inativo!
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform duration-300 shadow-sm ${
          isCadastroAtivo ? "translate-x-8" : "translate-x-1"
        }`}
      >
        {isCadastroAtivo && (
          <svg className="w-3 h-3 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>

    <span className={`text-xs font-semibold transition-colors duration-200 ${isCadastroAtivo ? "text-[#1A7A3C]" : "text-gray-400"}`}>
      Ativo
    </span>
  </div>
</div>

{/* MODAL DE CONFIRMAÇÃO DE STATUS (DINÂMICO: ATIVAR OU INATIVAR) */}
{isConfirmarToggleModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center gap-6 relative">
      
      {/* Conteúdo de Texto */}
      <div className="flex flex-col gap-2 w-full mt-2">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          {proximoEstadoAtivo ? "Ativar Pessoa Jurídica" : "Inativar Pessoa Jurídica"}
        </h2>
        <p className="text-sm text-gray-600 font-normal leading-relaxed mt-1 px-1">
          Deseja {proximoEstadoAtivo ? "ativar" : "inativar"} o cadastro da Pessoa Jurídica{" "}
          <span className="font-semibold text-gray-800">
            {razaoSocial ? razaoSocial : nomeFantasia ? nomeFantasia : "esta empresa"}
          </span>?
        </p>
      </div>

      {/* Ações / Dois Botões Alinhados */}
      <div className="flex justify-center items-center gap-3 w-full pt-2">
        {/* Botão Cancelar */}
        <button
          type="button"
          onClick={() => {
            setIsConfirmarToggleModalOpen(false);
          }}
          className="px-10 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-md shadow-sm transition"
        >
          Cancelar
        </button>

        {/* Botão de Confirmação (Verde para Ativar | Vermelho para Inativar) */}
        <button
          type="button"
          onClick={() => {
            setIsCadastroAtivo(proximoEstadoAtivo);
            setIsConfirmarToggleModalOpen(false);
          }}
          className={`px-10 h-11 text-white text-sm font-semibold rounded-md shadow-sm transition-all duration-200 ${
            proximoEstadoAtivo 
              ? "bg-[#1A7A3C] hover:bg-[#15612F]" 
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {proximoEstadoAtivo ? "Ativar" : "Inativar"}
        </button>
      </div>

    </div>
  </div>
)}
      </main>

      <SearchModal
        open={modalRepIndex !== null}
        onClose={() => setModalRepIndex(null)}
        title="Buscar Representante Legal"
        subtitle="Busque por um representante legal:"
        icon={<UserRound size={26} color="#1A7A3C" />}
        data={PESSOAS_MOCK}
        searchKeys={["nome", "cpf"]}
        searchPlaceholder="Busque por nome ou CPF"
        columns={[{ label: "Nome", key: "nome" }, { label: "CPF", key: "cpf" }]}
        onConfirm={(pessoa) => {
          setRepresentantes(prev => prev.map((r, i) => i === modalRepIndex ? { ...r, nome: pessoa.nome, cpf: pessoa.cpf } : r));
          setModalRepIndex(null);
        }}
      />

     
      {/* Modal de Sucesso após Salvar Edição */}
{isSucessoModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center text-center gap-5 relative">
      
      {/* Textos do Modal (Idênticos ao design da imagem enviada) */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-lg font-bold text-gray-900">Salvar Alterações da Pessoa Jurídica!</h3>
        <p className="text-sm text-gray-500 mt-1 px-2">
          Deseja salvar as alterações da Pessoa Jurídica <span className="font-semibold text-gray-700">
            {nomeFantasia ? nomeFantasia : "A nova pessoa jurídica"}
          </span>?
        </p>
      </div>

      {/* Ações / Dois Botões Alinhados em uma Linha Inteira */}
      <div className="flex gap-3 w-full mt-1">
        {/* Botão Voltar (Bordas Verdes) */}
        <button
          type="button"
          onClick={() => {
            setIsSucessoModalOpen(false);
            onNavigate("pessoa-juridica"); // Redireciona para a listagem geral
          }}
          className="flex-1 h-11 bg-white border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50/40 text-sm font-semibold rounded-lg transition"
        >
          Cancelar
        </button>

        {/* Botão Visualizar (Todo Verde) */}
        <button
          type="button"
          onClick={() => {
            setIsSucessoModalOpen(false);
            // ENVIANDO OS DADOS ATUALIZADOS PARA A TELA DE VISUALIZAÇÃO
            onNavigate("visualizar-pessoa-juridica", dadosSalvosTemporarios);
          }}
          className="flex-1 h-11 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold rounded-lg transition shadow-sm"
        >
          Salvar
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}