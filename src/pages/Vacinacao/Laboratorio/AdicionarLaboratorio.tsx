import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, Trash2, PlusCircle, Eye, Map, X, MapPin } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox, CustomButton, UploadField, LargeTextArea, CheckboxGroup, MultiSearchModal } from "../../../components/ui/FormKit";
// Importado o MultiSearchModal para fazer a seleção múltipla via botão
import { ProprietarioInput, DynamicListWrapper, BlocoEnderecoFields, BlocoContatoFields, SelectedChipsContainer, } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// OPÇÕES (US0V3 - AC3)
// ==========================================================
const ATUACOES = [
  "Produção de insumos de diagnóstico",
  "Produção de vacinas",
  "Diagnóstico de doenças",
];
const ATUACAO_VACINAS = "Produção de vacinas";

// MOCK DE DOENÇAS PARA O MULTISEARCHMODAL
const DOENCAS_MOCK = [
  { id: "d-1", nome: "Febre Aftosa", vacinavel: true },
  { id: "d-2", nome: "Brucelose", vacinavel: true },
  { id: "d-3", nome: "Tuberculose", vacinavel: false },
  { id: "d-4", nome: "Raiva", vacinavel: true },
  { id: "d-5", nome: "Anemia Infecciosa Equina", vacinavel: false },
  { id: "d-6", nome: "Peste Suína Clássica", vacinavel: true },
];

const toCheck = (arr: string[]) => arr.map((v) => ({ id: v, label: v }));
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR LABORATÓRIO (US0V3 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarLaboratorioPage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [nome, setNome] = useState("");
  const [atuacao, setAtuacao] = useState<string[]>([]);
  const [observacaoResidencia, setObservacaoResidencia] = useState("");

  // Doenças por atuação selecionada: { [atuacao]: [{ uid, doenca }] }
  const [doencasPorAtuacao, setDoencasPorAtuacao] = useState<Record<string, any[]>>({});
  const [notaFiscal, setNotaFiscal] = useState("");
  const [modalNotaOrigemOpen, setModalNotaOrigemOpen] = useState(false);
  const [notasFiscaisOrigem, setNotasFiscaisOrigem] = useState<any[]>([]);
  const [graficoAtivo, setGraficoAtivo] = useState<{ loteId: string; index: number } | null>(null);
  const [notasListasMinimizadas, setNotasListasMinimizadas] = useState<Record<string, boolean>>({});
  const [lotesMinimizados, setLotesMinimizados] = useState<Record<string, boolean>>({});
  
  // Controla qual atuação está abrindo o modal de doenças no momento
  const [atuacaoModalAberta, setAtuacaoModalAberta] = useState<string | null>(null);

  // Proprietários (um ou mais)
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), proprietario: null }]);
  const [modalMapaOpen, setModalMapaOpen] = useState(false);

  // Anexos e Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [isSucesso, setIsSucesso] = useState(false);

  const [endereco, setEndereco] = useState({
    zona: "Urbana",
    cep: "",
    estado: "Minas Gerais",
    municipio: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    localidade: "",
    distrito: "",
    latitude: "",
    longitude: ""
  });

  const [contatoLaboratorio, setContatoLaboratorio] = useState({
    utilizarContatoProprietario: "Não",
    proprietariosSelecionados: [] as string[],
    emailFixo: "",
    emailFixoObs: "",
    telefoneFixo: "",
    telefoneFixoObs: "",
    contatosAdicionais: [] as any[]
  });

  // Sincroniza as doenças por atuação quando a seleção de atuação muda
  const handleAtuacao = (novas: string[]) => {
    setAtuacao(novas);
    setDoencasPorAtuacao((prev) => {
      const next: Record<string, any[]> = {};
      novas.forEach((a) => { next[a] = prev[a] ?? []; });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="laboratorio" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("laboratorio")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os Laboratórios
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Laboratório</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <FloatInput label="Nome Comercial do Laboratório" required value={nome} onChange={setNome} maxLength={255} />

            <CheckboxGroup
              title="Atuação"
              required
              actionLabel=""
              options={toCheck(ATUACOES)}
              defaultValue={atuacao}
              onChange={handleAtuacao}
              orientation="vertical"
            />

           {/* Doenças — Bloco com Botão Padrão + Chips de Seleção Múltipla */}
            {atuacao.map((a) => {
              const doencasSelecionadas = doencasPorAtuacao[a] ?? [];

              return (
                <div 
                  key={a} 
                  className="border border-gray-200 border-l-4 rounded-r-xl rounded-l-md p-5 bg-white mb-4 flex flex-col gap-4 transition-all"
                  style={{ borderLeftColor: GREEN }}
                >
                  <SubGrupo titulo={`${a}`}>
                    
                    {/* Estrutura unificada: Título e Botão lado a lado na mesma linha */}
                    <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden mt-2">
                      
                      {/* Cabeçalho do Bloco Integrado */}
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-500">Doenças Selecionadas</span>
                          {doencasSelecionadas.length > 0 && (
                            <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
                              {doencasSelecionadas.length} {doencasSelecionadas.length === 1 ? "Selecionada" : "Selecionadas"}
                            </span>
                          )}
                        </div>

                        {/* O Botão de Adicionar agora fica aqui, compacto e alinhado à direita */}
                        <button
                          type="button"
                          onClick={() => setAtuacaoModalAberta(a)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
                        >
                          <PlusCircle size={14} /> Adicionar Doença
                        </button>
                      </div>

                      {/* Conteúdo / Grid dos Chips */}
                      <div className="p-5 flex flex-wrap gap-4">
                        {doencasSelecionadas.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">Nenhuma doença selecionada para esta atuação.</p>
                        ) : (
                          doencasSelecionadas.map((d) => (
                            <div
                              key={d.id}
                              className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[180px] shadow-sm transition hover:border-gray-300 relative group"
                            >
                              <div className="flex items-center justify-between gap-4 w-full">
<span className="text-sm font-bold" style={{ color: GREEN }}>{d.nome}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDoencasPorAtuacao((prev) => ({
                                      ...prev,
                                      [a]: prev[a].filter((x) => x.id !== d.id),
                                    }));
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Modal de Seleção Múltipla Dinâmico por Atuação */}
                    <MultiSearchModal
                      open={atuacaoModalAberta === a}
                      onClose={() => setAtuacaoModalAberta(null)}
                      title={`Buscar Doenças`}
                      subtitle="Selecione as doenças aplicáveis a esta linha de atuação:"
                      icon={<img src={Icons.iconeDoencaUrl} alt="Doença" className="w-5 h-5 object-contain" />} 
                      data={a === ATUACAO_VACINAS ? DOENCAS_MOCK.filter(d => d.vacinavel) : DOENCAS_MOCK}
                      searchKeys={["nome"]}
                      searchPlaceholder="Busque pelo nome da doença."
                      columns={[{ label: "Nome da Doença", key: "nome" }]}
                      selectedItems={doencasSelecionadas}
                      onConfirm={(itensSelecionados: any[]) => {
                        setDoencasPorAtuacao((prev) => ({
                          ...prev,
                          [a]: itensSelecionados
                        }));
                        setAtuacaoModalAberta(null);
                      }}
                      confirmLabel="Salvar Selecionadas"
                    />
                  </SubGrupo>
                </div>
              );
            })}
          </div>
        </Section>

{/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), proprietario: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter={true}
           
          >
            {/* Único filho legítimo: A função que renderiza o input */}
            {(item: any) => (
              <div className="w-full">
                <ProprietarioInput
                  required
                  value={item.proprietario ? item.proprietario.nome : ""}
                  onChange={(ent: any) => 
                    setProprietarios((p) => 
                      p.map((x) => (x.uid === item.uid ? { ...x, proprietario: ent } : x))
                    )
                  }
                  onEyeClick={() => onNavigate("visualizar-pessoa", item.proprietario)}
                />
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        

        {/* Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-6">
            <BlocoEnderecoFields
              title="Endereço"
              tipoEstado="travado"
              data={endereco}
              onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
              onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
            />
          </div>
        </Section>

        {/* Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contatoLaboratorio}
            onChange={(updated) => setContatoLaboratorio((prev) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={[
              { id: "prop-1", nome: "Carlos Henrique Silva", cpf: "123.456.789-00", email: "carlos.silva@email.com", telefone: "(11) 98888-7777" },
              { id: "prop-2", nome: "Maria Fernanda Oliveira", cpf: "987.654.321-11", email: "maria.fernanda@email.com", telefone: "(21) 99999-8888" },
              { id: "prop-3", nome: "Antônio Marcos de Souza", cpf: "456.123.789-22", email: "antonio.marcos@email.com", telefone: "(31) 97777-6666" },
              { id: "prop-4", nome: "Juliana Costa Rezende", cpf: "789.456.123-33", email: "juliana.costa@email.com", telefone: "(61) 96666-5555" }
            ]}
          />
        </Section>

        {/* Seção Anexo Geral */}
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
                        setAnexos(prev =>
                          prev.map((a, i) =>
                            i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                          )
                        )
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
                      </>
                    )}

                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* Seção Observação Geral */}
        <Section title="Observação">
          <LargeTextArea
            label="Observação"
            value={observacaoResidencia}
            onChange={setObservacaoResidencia}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Laboratório adicionado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "O laboratório"} foi adicionado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("laboratorio"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-laboratorio"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DO MAPA / COORDENADAS */}
      {modalMapaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4 relative">
            <button 
              type="button" 
              onClick={() => setModalMapaOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mt-2">
              <Map size={24} className="text-[#1A7A3C]" />
              <h3 className="text-xl font-bold text-gray-800">Selecionar Coordenadas no Mapa</h3>
            </div>
            
            <p className="text-sm text-gray-500">
              Simule a seleção no mapa clicando em confirmar para aplicar as coordenadas automáticas de teste.
            </p>

            <div className="w-full h-60 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400">
              <MapPin size={32} className="text-[#1A7A3C] animate-bounce" />
              <span className="text-xs font-medium">[ Mapa Interativo Google Maps / Leaflet ]</span>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setModalMapaOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setModalMapaOpen(false)}
                className="px-6 py-2 bg-[#1A7A3C] text-white text-sm font-semibold rounded-md hover:bg-[#15612F] transition shadow-sm"
              >
                Confirmar Localização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}