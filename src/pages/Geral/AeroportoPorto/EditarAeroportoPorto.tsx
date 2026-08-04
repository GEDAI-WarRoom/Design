import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, UploadField } from "../../../components/ui/FormKit";
import { BlocoEnderecoFields, BlocoContatoFields, DynamicListWrapper, ProprietarioInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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

export function EditarAeroportoPortoPage({ onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; }) {
  const [isSucesso, setIsSucesso] = useState(false);

  // Exemplo fixo - Informações Básicas
  const [codigo] = useState("AP-000003");
  const [nome, setNome] = useState("Aeroporto Regional de Lavras");
  const [tipo, setTipo] = useState("Aeroporto");

  // Exemplo fixo - Proprietários
  const [proprietarios, setProprietarios] = useState<any[]>([
    {
      uid: "prop-1",
      entidade: { nome: "João da Silva", cpf: "123.456.789-00" }
    }
  ]);

  // Exemplo fixo - Localização
  const [endereco, setEndereco] = useState({
    zona: "Urbana",
    cep: "37200-000",
    estado: "Minas Gerais",
    municipio: "Lavras",
    bairro: "Centro",
    endereco: "Avenida do Aeroporto",
    numero: "1000",
    complemento: "Hangar 02",
    localidade: "",
    distrito: "",
    latitude: "-21.245263",
    longitude: "-44.999281"
  });

  // Exemplo fixo - Contatos
  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não" as const,
    proprietariosSelecionados: [] as string[],
    emailFixo: "contato@aeroportolavras.com.br",
    emailFixoObs: "",
    telefoneFixo: "(35) 99887-6655",
    telefoneFixoObs: "",
    contatosAdicionais: [] as any[]
  });

  // Exemplo fixo - Anexos
  const [anexos, setAnexos] = useState<any[]>([
    {
      uid: "anexo-1",
      nome: "licenca_operacional.pdf",
      descricao: "Licença de Operação e Funcionamento ANAC"
    }
  ]);

  // Exemplo fixo - Observações
  const [observacao, setObservacao] = useState("Aeroporto regional utilizado para aviação executiva e transporte de cargas.");

  const handleSalvar = () => {
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="aeroporto-porto" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">

        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("aeroporto-porto")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os Aeroportos/Portos
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Aeroporto / Porto</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar
            </button>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FloatInput label="Código" value={codigo} disabled onChange={() => { }} />
            <FloatInput
              label="Nome Comercial do Aeroporto/Porto"
              required
              value={nome}
              onChange={setNome}
              maxLength={255}
            />
            <FloatSelect
              label="Aeroporto ou Porto?"
              required
              value={tipo}
              onChange={setTipo}
              options={["Aeroporto", "Porto"]}
            />
          </div>
        </Section>

        {/* Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), entidade: { nome: "Carlos Eduardo da Silva", cpf: "987.654.321-00" } }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => {
              const valorExibicao = typeof item.entidade === "string"
                ? item.entidade
                : item.entidade?.nome || "João da Silva";

              return (
                <ProprietarioInput
                  value={valorExibicao}
                  required
                  onChange={(ent: any) =>
                    setProprietarios((prev) =>
                      prev.map((p, i) =>
                        i === index
                          ? {
                            ...p,
                            entidade: typeof ent === "string" ? { nome: ent, cpf: "123.456.789-00" } : ent
                          }
                          : p
                      )
                    )
                  }
                  onEyeClick={() =>
                    onNavigate(
                      "visualizar-pessoa-fisica",
                      typeof item.entidade === "object" && item.entidade !== null
                        ? item.entidade
                        : { nome: valorExibicao, cpf: "123.456.789-00" }
                    )
                  }
                />
              );
            }}
          </DynamicListWrapper>
        </Section>

        {/* Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço Principal"
            tipoEstado="normal"
            data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        {/* Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contatos}
            onChange={(updated) => setContatos((prev) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={[]}
          />
        </Section>

        {/* Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {anexos.map((anexo, idx) => (
              <div key={anexo.uid || idx} className="p-4 bg-white shadow-2xs flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                    {idx + 1}
                  </span>

                  <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onFileSelect={(file) => {
                        setAnexos((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, nome: file.name } : item))
                        );
                      }}
                    />
                    <FloatInput
                      label="Descrição"
                      value={anexo.descricao}
                      onChange={(val) => {
                        setAnexos((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, descricao: val } : item))
                        );
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setAnexos((prev) => prev.filter((_, i) => i !== idx))}
                    title="Remover Anexo"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-500 transition-colors hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={() =>
                  setAnexos((prev) => [...prev, { uid: uid("anexo"), nome: "", descricao: "" }])
                }
                className="flex items-center gap-2 px-4 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm"
              >
                <PlusCircle size={16} /> Adicionar Anexo
              </button>
            </div>
          </div>
        </Section>

        {/* Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacao} onChange={setObservacao} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O cadastro de "{nome}" foi atualizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("aeroporto-porto"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-aeroporto-porto", { nome, tipo, codigo }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}