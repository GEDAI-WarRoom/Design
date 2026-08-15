import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, ChevronDown, ChevronUp, Paperclip, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, UploadField } from "../../../components/ui/FormKit";
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

export function EditarAcouguePage({ dados, onLogout, onNavigate, localPesagem = false, estabelecimentoGenerico = false }: { dados?: any; onLogout: () => void; onNavigate: (screen: string, data?: any) => void; localPesagem?: boolean; estabelecimentoGenerico?: boolean }) {
  const nomeCadastro = estabelecimentoGenerico ? "Estabelecimento Genérico" : localPesagem ? "Local de Pesagem" : "Açougue";
  const nomeCadastros = estabelecimentoGenerico ? "Estabelecimentos Genéricos" : localPesagem ? "Locais de Pesagem" : "Açougues";
  const rota = estabelecimentoGenerico ? "estabelecimento-generico" : localPesagem ? "local-pesagem" : "acougue";
  const rotaVisualizar = estabelecimentoGenerico ? "visualizar-estabelecimento-generico" : localPesagem ? "visualizar-local-pesagem" : "visualizar-acougue";
  const [isSucesso, setIsSucesso] = useState(false);

  // Populando os estados com os dados recebidos da listagem
  const [nomeComercial, setNomeComercial] = useState(dados?.nome || "Açougue Central");
  const [tipoLocal, setTipoLocal] = useState(dados?.tipo || "");

  // Inicializa já com pelo menos um proprietário preenchido por padrão
  const proprietariosIniciais = dados?.proprietarios?.length > 0
    ? dados.proprietarios.map((p: any) => ({
      uid: uid("prop"),
      entidade: typeof p === "string" ? { nome: p, cpf: "123.456.789-00" } : p
    }))
    : [{ uid: uid("prop"), entidade: { nome: "João da Silva", cpf: "123.456.789-00" } }];

  const [proprietarios, setProprietarios] = useState<any[]>(proprietariosIniciais);

  const [endereco, setEndereco] = useState({
    zona: "Urbana", cep: "37200-000", estado: "Minas Gerais", municipio: dados?.municipio || "Lavras", bairro: "Centro",
    endereco: "Rua Principal", numero: "123", complemento: "", localidade: "", distrito: "", latitude: "", longitude: ""
  });

  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não" as const, proprietariosSelecionados: [] as string[],
    emailFixo: "contato@acougue.com", emailFixoObs: "", telefoneFixo: "(35) 99999-9999", telefoneFixoObs: "", contatosAdicionais: [] as any[]
  });

  // Inicializa a seção de anexos com um item já carregado por padrão
  const anexosIniciais = dados?.anexos?.length > 0
    ? dados.anexos.map((a: any) => ({
      uid: uid("anexo"),
      nome: typeof a === "string" ? a : a?.nome || "documento_acougue_1.pdf",
      descricao: a?.descricao || ""
    }))
    : [{ uid: uid("anexo"), nome: "documento_acougue_1.pdf", descricao: "" }];

  const [anexos, setAnexos] = useState<any[]>(anexosIniciais);
  const [observacao, setObservacao] = useState(dados?.observacao || "");

  const handleSalvar = () => {
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen={rota} hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">

        <div>
          <button type="button" onClick={() => onNavigate(rota)} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todos os {nomeCadastros}
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar {nomeCadastro}</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput label="Código" value={dados?.codigo || "ACQ-001"} disabled onChange={() => { }} />
            <FloatInput
              label={`Nome Comercial do ${nomeCadastro}`} required value={nomeComercial} onChange={setNomeComercial} maxLength={255}
            />
          </div>
        </Section>

        {/* Proprietários com 1 Proprietário Pré-preenchido */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios} behavior="at-least-one" addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), entidade: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain" showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                value={item.entidade ? item.entidade.nome : ""} required
                onChange={(ent: any) => setProprietarios((prev) => prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p)))}
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa-fisica", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço Principal" tipoEstado="normal" data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        {/* Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields data={contatos} onChange={(updated) => setContatos((prev) => ({ ...prev, ...updated }))} proprietariosDisponiveis={[]} />
        </Section>

        {/* Seção de Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-4">
            {anexos.map((anexo, idx) => (
              <div key={anexo.uid || idx} className="p-4 bg-white shadow-2xs flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  {/* Número Indicador */}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A7A3C] text-xs font-bold text-white">
                    {idx + 1}
                  </span>

                  {/* Campos do Documento e Descrição */}
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
                  {/* Botão Download */}
                  <button
                    type="button"
                    onClick={() => setAnexos((prev) => prev.filter((_, i) => i !== idx))}
                    title="Download Anexo"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-white text-green-700 transition-colors "
                  >
                    <Download size={18} />
                  </button>

                  {/* Botão Remover (Lixeira) */}
                  <button
                    type="button"
                    onClick={() => setAnexos((prev) => prev.filter((_, i) => i !== idx))}
                    title="Remover Anexo"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-white text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>


              </div>
            ))}

            {/* Botão Adicionar Anexo */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setAnexos((prev) => [...prev, { uid: uid("anexo"), nome: "", descricao: "" }])
                }
                className="flex items-center gap-2 px-4 h-10 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-xs font-bold hover:bg-green-50 transition"
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

            <h3 className="text-lg font-bold text-gray-900">Alterações salvas!</h3>
            <p className="text-sm text-gray-500 mt-1">O {tipoLocal || nomeCadastro} "{nomeComercial}" foi atualizado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate(rota); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate(rotaVisualizar, dados); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
