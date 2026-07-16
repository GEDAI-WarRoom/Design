import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Paperclip, User, Calendar } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, FloatSelect } from "../../../components/ui/FormKit";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition border-b border-gray-100"
      >
        <span className="text-base font-bold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-6 flex flex-col gap-6">{children}</div>}
    </div>
  );
}

interface VisualizarPessoaFisicaProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
  dados: {
    cpf?: string;
    nome?: string;
    apelido?: string;
    dataNascimento?: string;
    sexo?: string;
    estadoCivil?: string;
    representantes?: Array<{
      id?: string;
      nome?: string;
      cpf?: string;
      documentoNome?: string;
      descricao?: string;
    }>;
    correspondencia?: any;
    isEnderecoResidencia?: "Sim" | "Não";
    residencia?: any;
    observacaoResidencia?: string;
    contatosFixos?: Array<{ id: string; tipo: string; valor: string; observacao: string }>;
    outrosContatos?: Array<{ id: string; tipo: string; valor: string; observacao: string }>;
    anexos?: Array<{ id?: string; nome?: string; descricao?: string }>;
    observacaoGeral?: string;
    status?: string;
    situacao?: string;
    [key: string]: any;
  };
}

export function VisualizarPessoaFisica({ onLogout, onNavigate, dados }: VisualizarPessoaFisicaProps) {
  
  // Tratamento extensivo de Sexo
  const getSexoExtenso = (s?: string) => {
    if (!s) return "Não informado";
    const normalizado = s.toUpperCase().trim();
    if (normalizado === "M" || normalizado === "MASCULINO") return "Masculino";
    if (normalizado === "F" || normalizado === "FEMININO") return "Feminino";
    if (normalizado === "O" || normalizado === "OUTRO") return "Outro";
    return s;
  };

  // Tratamento extensivo de Estado Civil
  const getEstadoCivilExtenso = (ec?: string) => {
    if (!ec) return "Não informado";
    const normalizado = ec.toLowerCase().trim();
    if (normalizado === "solteiro" || normalizado === "s") return "Solteiro(a)";
    if (normalizado === "casado" || normalizado === "c") return "Casado(a)";
    if (normalizado === "divorciado" || normalizado === "d") return "Divorciado(a)";
    if (normalizado === "viuvo" || normalizado === "viúvo" || normalizado === "v") return "Viúvo(a)";
    return ec.charAt(0).toUpperCase() + ec.slice(1);
  };

  // Tratamento extensivo de Zona (Urbana / Rural)
  const getZonaExtenso = (z?: string) => {
    if (!z) return "";
    const normalizado = z.toUpperCase().trim();
    if (normalizado === "U" || normalizado === "URBANA") return "Urbana";
    if (normalizado === "R" || normalizado === "RURAL") return "Rural";
    return z;
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="pessoa-fisica" hideSearch={true} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("pessoa-fisica")}
            className="flex items-center gap-1 text-sm mb-3 text-[#1A7A3C] hover:opacity-70"
          >
            <ArrowLeft size={15} /> Todas Pessoas Físicas
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Visualizar Pessoa Física</h1>
            <button
              type="button"
              onClick={() => onNavigate("editar-pessoa-fisica", dados)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition flex items-center gap-2 shadow-sm"
            >
              Editar
            </button>
          </div>
        </div>



     {/* Informações Básicas */}
    <Section title="Informações Básicas">
      <div className="flex flex-col gap-3 w-full">
        
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="flex-1">
            <FloatInput label="CPF" value={dados?.cpf ?? ""} disabled={true} />
          </div>
          <div className="flex-1">
            <FloatInput label="Nome" value={dados?.nome ?? ""} disabled={true} />
          </div>
        </div>
    
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="flex-1">
            <FloatInput label="Apelido" value={dados?.apelido || "Não informado"} disabled={true} />
          </div>
          <div className="flex-1">
            <FloatInput 
              label="Data de Nascimento" 
              type="date" 
              value={dados?.dataNascimento ?? ""} 
              disabled={true} 
              icon={<Calendar size={18} />} 
            />
          </div>
        </div>
    
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="flex-1">
            <FloatInput label="Sexo" value={getSexoExtenso(dados?.sexo)} disabled={true} />
          </div>
          <div className="flex-1">
            <FloatInput label="Estado Civil" value={getEstadoCivilExtenso(dados?.estadoCivil)} disabled={true} />
          </div>
        </div>
    
      </div>
    </Section>

        {/* 2. Representantes Legais (Se houver vínculos registrados à PF) */}
        {dados?.representantes && dados.representantes.length > 0 && (
          <Section title="Representantes Legais / Vínculos">
            <div className="flex flex-col gap-6">
              {dados.representantes.map((rep, index) => (
                <div key={rep.id || index} className="flex gap-4 items-start relative w-full border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-3 items-end w-full">
                      <div className="flex-1">
                        <FloatInput label="Nome do Representante" value={rep.nome ?? ""} disabled={true} />
                      </div>
                      {rep.nome && (
                        <div className="w-72">
                          <FloatInput label="CPF" value={rep.cpf ?? ""} disabled={true} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 items-start w-full">
                      <div className="w-[340px] flex flex-col gap-1">
                        <div className="flex items-center gap-3 px-3 rounded-md border border-gray-200 h-12 bg-gray-50/50 select-none relative w-full text-gray-500">
                          <Paperclip size={18} className="text-gray-400" />
                          <div className="flex flex-col justify-center flex-1">
                            <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Contrato de Vínculo</span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[260px]">
                              {rep.documentoNome || "Não enviado"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {rep.documentoNome && (
                        <div className="flex-1">
                          <FloatInput label="Descrição" value={rep.descricao ?? ""} disabled={true} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 3. Informações de Localização (Correspondência e Residência) */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-700">Endereço de Correspondência</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <FloatInput label="Zona" value={getZonaExtenso(dados?.correspondencia?.zona)} disabled={true} />
                <FloatInput label="CEP" value={dados?.correspondencia?.cep ?? ""} disabled={true} />
                <FloatInput label="Estado" value={dados?.correspondencia?.estado ?? ""} disabled={true} />
                <FloatInput label="Município" value={dados?.correspondencia?.municipio ?? ""} disabled={true} />
                <FloatInput label="Bairro" value={dados?.correspondencia?.bairro ?? ""} disabled={true} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <FloatInput label="Endereço" value={dados?.correspondencia?.endereco ?? ""} disabled={true} className="md:col-span-7" />
                <FloatInput label="Número" value={dados?.correspondencia?.numero ?? ""} disabled={true} className="md:col-span-2" />
                <FloatInput label="Complemento" value={dados?.correspondencia?.complemento ?? ""} disabled={true} className="md:col-span-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FloatInput label="Localidade" value={dados?.correspondencia?.localidade ?? ""} disabled={true} />
                <FloatInput label="Distrito" value={dados?.correspondencia?.distrito ?? ""} disabled={true} />
              </div>
              {dados?.correspondencia?.latitude && dados?.correspondencia?.longitude && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FloatInput label="Latitude" value={dados?.correspondencia?.latitude ?? ""} disabled={true} />
                  <FloatInput label="Longitude" value={dados?.correspondencia?.longitude ?? ""} disabled={true} />
                </div>
              )}
            </div>

            {/* Pergunta Condicional de Residência */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 select-none pointer-events-none">
              <span className="text-xs font-semibold text-gray-400 tracking-wide">O endereço de correspondência é o mesmo de residência?</span>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${dados?.isEnderecoResidencia !== "Não" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                    {dados?.isEnderecoResidencia !== "Não" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                  </div>
                  Sim
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${dados?.isEnderecoResidencia === "Não" ? "border-[#1A7A3C]" : "border-gray-300"}`}>
                    {dados?.isEnderecoResidencia === "Não" && <div className="w-2 h-2 rounded-full bg-[#1A7A3C]" />}
                  </div>
                  Não
                </label>
              </div>
            </div>

            {/* Bloco Renderizado se Residência for diferente */}
            {dados?.isEnderecoResidencia === "Não" && (
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Endereço de Residência</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <FloatInput label="Zona" value={getZonaExtenso(dados?.residencia?.zona)} disabled={true} />
                  <FloatInput label="CEP" value={dados?.residencia?.cep ?? ""} disabled={true} />
                  <FloatInput label="Estado" value={dados?.residencia?.estado ?? ""} disabled={true} />
                  <FloatInput label="Município" value={dados?.residencia?.municipio ?? ""} disabled={true} />
                  <FloatInput label="Bairro" value={dados?.residencia?.bairro ?? ""} disabled={true} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <FloatInput label="Endereço" value={dados?.residencia?.endereco ?? ""} disabled={true} className="md:col-span-7" />
                  <FloatInput label="Número" value={dados?.residencia?.numero ?? ""} disabled={true} className="md:col-span-2" />
                  <FloatInput label="Complemento" value={dados?.residencia?.complemento ?? ""} disabled={true} className="md:col-span-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FloatInput label="Localidade" value={dados?.residencia?.localidade ?? ""} disabled={true} />
                  <FloatInput label="Distrito" value={dados?.residencia?.distrito ?? ""} disabled={true} />
                </div>
                {dados?.residencia?.latitude && dados?.residencia?.longitude && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FloatInput label="Latitude" value={dados?.residencia?.latitude ?? ""} disabled={true} />
                    <FloatInput label="Longitude" value={dados?.residencia?.longitude ?? ""} disabled={true} />
                  </div>
                )}
                <div className="w-full mt-1">
                  <LargeTextArea
                    label="Observação do Endereço de Residência"
                    value={dados?.observacaoResidencia || "Nenhuma observação informada."}
                    onChange={() => {}}
                    disabled={true}
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <div className="flex flex-col gap-4">
            {/* Contatos Fixos (E-mail / Telefone) */}
            {dados?.contatosFixos && dados.contatosFixos.length > 0 && (
              <div className="flex flex-col gap-4">
                {dados.contatosFixos.map((contato, index) => (
                  <div key={contato.id || index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <FloatInput label="Tipo de Contato" value={contato.tipo || ""} disabled={true} className="md:col-span-3" />
                    <FloatInput label={contato.tipo === "E-mail" ? "E-mail" : "Número"} value={contato.valor || ""} disabled={true} className="md:col-span-4" />
                    <div className="md:col-span-5">
                      <LargeTextArea label="Observação" value={contato.observacao || "Sem observações."} disabled={true} onChange={() => {}} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Outros Contatos Adicionais */}
            {dados?.outrosContatos && dados.outrosContatos.length > 0 && (
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Outros Contatos</span>
                {dados.outrosContatos.map((contato, index) => (
                  <div key={contato.id || index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <FloatInput label="Tipo de Contato" value={contato.tipo || ""} disabled={true} className="md:col-span-3" />
                    <FloatInput label={contato.tipo === "E-mail" ? "E-mail" : "Número"} value={contato.valor || ""} disabled={true} className="md:col-span-4" />
                    <div className="md:col-span-5">
                      <LargeTextArea label="Observação" value={contato.observacao || ""} disabled={true} onChange={() => {}} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* 5. Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {dados?.anexos && dados.anexos.length > 0 ? (
              dados.anexos.map((anexo, index) => (
                <div key={anexo.id || index} className="flex gap-4 items-start relative w-full border border-gray-200 rounded-xl p-4 bg-white select-none">
                  <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-3 items-start w-full">
                      <div className="w-[340px]">
                        <div className="flex items-center gap-3 px-3 rounded-md border border-gray-200 h-12 bg-gray-50/50 relative w-full text-gray-500">
                          <Paperclip size={18} className="text-gray-400" />
                          <div className="flex flex-col justify-center flex-1">
                            <span className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Documento Anexo</span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[260px]">
                              {anexo.nome || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      {anexo.nome && (
                        <div className="flex-1">
                          <FloatInput label="Descrição do Documento" value={anexo.descricao ?? ""} disabled={true} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full border border-gray-200 rounded-xl p-4 bg-[#f9fafb] text-sm text-gray-400 text-center select-none py-6">
                Nenhum anexo adicionado
              </div>
            )}
          </div>
        </Section>

        {/* 6. Observação Geral */}
        <Section title="Observações Gerais">
          <LargeTextArea
            label="Observações do Cadastro"
            value={dados?.observacaoGeral || "Nenhuma observação registrada."}
            onChange={() => {}}
            disabled={true}
          />
        </Section>

        {/* Situação do Cadastro */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full shadow-sm mt-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-gray-800">Situação do Cadastro</h3>
            <p className="text-xs text-gray-400 font-normal">
              Indica se o cadastro do cidadão está ativo ou inativo para movimentações no sistema.
            </p>
          </div>
          
          {dados?.status !== "Inativo" && dados?.situacao !== "Inativo" ? (
            <div className="flex items-center gap-1.5 px-4 h-8 bg-[#E6F4EA] border border-[#A3E2B8] rounded-full text-[#1A7A3C] text-xs font-semibold flex-shrink-0 select-none">
              <svg className="w-3.5 h-3.5 text-[#1A7A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Ativo
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-4 h-8 bg-gray-100 border border-gray-300 rounded-full text-gray-500 text-xs font-semibold flex-shrink-0 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Inativo
            </div>
          )}
        </div>

      </main>
    </div>
  );
}