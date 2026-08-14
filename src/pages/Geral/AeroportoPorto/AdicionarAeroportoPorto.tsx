import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, Download } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, LargeTextArea, UploadField } from "../../../components/ui/FormKit";
import {
  ProprietarioInput,
  BlocoEnderecoFields,
  BlocoContatoFields,
  DynamicListWrapper
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";
import {
  gerarCodigoUnidadeVigilancia,
  registrarUnidadeVigilancia,
  type UnidadeVigilanciaAgropecuaria,
} from "./unidadeVigilanciaData";


const GREEN = "#1A7A3C";
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AdicionarAeroportoPorto({ onLogout, onNavigate }: PageProps) {
  // 1. Informações Básicas
  const [nomeComercial, setNomeComercial] = useState("");

  // 2. Proprietários
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), entidade: null }]);

  // 3. Endereço (travado em MG)
  const [endereco, setEndereco] = useState({
    zona: "Urbana", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
    latitude: "", longitude: ""
  });

  // 4. Contatos
  const [contatos, setContatos] = useState({
    utilizarContatoProprietario: "Não",

    proprietariosSelecionados: [] as string[],
    emailFixo: "",
    emailFixoObs: "",
    telefoneFixo: "",
    telefoneFixoObs: "",
    contatosAdicionais: [] as any[]
  });

  // 5. Anexos e Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  // Estado do Modal de Sucesso
  const [isSucesso, setIsSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [registroCriado, setRegistroCriado] = useState<UnidadeVigilanciaAgropecuaria | null>(null);

  // Derivando proprietários para o componente de contatos
  const proprietariosValidos = proprietarios
    .filter(p => p.entidade)
    .map(p => ({
      id: p.uid,
      nome: p.entidade.nome,
      cpf: p.entidade.documento,
      email: p.entidade.email || "",
      telefone: p.entidade.telefone || ""
    }));

  const handleAdicionar = () => {
    const selecionados = proprietarios.filter((item) => item.entidade);
    if (!nomeComercial.trim() || selecionados.length === 0 || !endereco.municipio || !endereco.endereco) {
      setErro("Preencha o nome, ao menos um proprietário e os campos obrigatórios de localização.");
      return;
    }

    const registro: UnidadeVigilanciaAgropecuaria = {
      id: Date.now(),
      codigo: gerarCodigoUnidadeVigilancia(),
      nome: nomeComercial.trim(),
      proprietarios: selecionados.map((item) => ({
        id: item.entidade.id ?? item.uid,
        nome: item.entidade.nome,
        documento: item.entidade.documento ?? item.entidade.cpf ?? "",
        tipo: item.entidade.tipo ?? "Pessoa física",
        email: item.entidade.email,
        telefone: item.entidade.telefone,
      })),
      endereco: { ...endereco, estado: "Minas Gerais" },
      contatos,
      anexos,
      observacao,
      situacao: "Ativo",
    };
    registrarUnidadeVigilancia(registro);
    setRegistroCriado(registro);
    setErro("");
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="aeroporto-porto" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("aeroporto-porto")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Unidades de Vigilância Agropecuária
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Unidade de Vigilância Agropecuária</h1>
            <button type="button" onClick={handleAdicionar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Adicionar
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {erro && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{erro}</div>}

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 gap-5">

            <FloatInput
              label="Nome Comercial da Unidade de Vigilância Agropecuária"
              required
              value={nomeComercial}
              onChange={setNomeComercial}
              maxLength={255}
            />
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), entidade: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                value={item.entidade ? item.entidade.nome : ""}
                required
				clearInitialValue
                onChange={(ent: any) => setProprietarios((prev) => prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p)))}
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. Informações de Localização */}
        <Section title="Informações de Localização">
          <BlocoEnderecoFields
            title="Endereço Principal"
            tipoEstado="normal"
            estadoFixo="Minas Gerais"
            data={endereco}
            onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
            onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
          />
        </Section>

        {/* 4. Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contatos}
            onChange={(updated) => setContatos((prev) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={proprietariosValidos}
          />
        </Section>

        {/* 5. Anexos */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos(prev => prev.map((a, i) => i === index ? { ...a, nome: `anexo_unidade_vigilancia_${index + 1}.pdf` } : a))
                      }
                    />

                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button type="button" onClick={() => alert(`Baixando: ${anexo.nome}`)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition">
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    <div className="h-12 flex items-center">
                      <button type="button" onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: uid("anexo"), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* 6. Observação */}
        <Section title="Observação">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">

            <h3 className="text-lg font-bold text-gray-900">Cadastro realizado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">A unidade de vigilância agropecuária "{nomeComercial}" foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("aeroporto-porto"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">
                Voltar
              </button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-aeroporto-porto", registroCriado); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
