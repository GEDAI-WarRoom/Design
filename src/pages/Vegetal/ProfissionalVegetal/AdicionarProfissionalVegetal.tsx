import React, { useState, useEffect } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Check, Info, Trash2, PlusCircle,
  Download, Calendar, UserRound, Bug, Eye,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, CustomButton, UploadField, LargeTextArea, SimNao
} from "../../../components/ui/FormKit";
import {
  EntitySearchInput, DynamicListWrapper, EstabelecimentoAgropecuarioInput,
  UnidadeAdministrativaInput, PessoaFisicaInput
} from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS DE OPÇÕES (US064 - AC1)
// ==========================================================
const FORMACOES = ["Engenheiro Agrônomo", "Engenheiro Florestal"];
const SIM_NAO = ["Sim", "Não"];

// ==========================================================
// MOCKS (substituir por API)
// ==========================================================
const PESSOAS_FISICAS_SERVICO_MOCK = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", servicoOficial: "Sim", esfera: "Estadual", masp: "10455301" },
  { id: 2, nome: "Josephina Arantes", documento: "444.009.956-40", servicoOficial: "Não", esfera: "", masp: "" },
  { id: 3, nome: "Carla Menezes Rocha", documento: "111.998.775-30", servicoOficial: "Sim", esfera: "Federal", masp: "" },
];

const PRAGAS_MOCK = [
  { id: 1, nomeCientifico: "Cerodirphia rubripes", nomePopular: "Lagarta-Verde" },
  { id: 2, nomeCientifico: "Ceratitis capitata", nomePopular: "Mosca-das-Frutas" },
  { id: 3, nomeCientifico: "Xylella fastidiosa", nomePopular: "Amarelinho" },
  { id: 4, nomeCientifico: "Anastrepha fraterculus", nomePopular: "Mosca-Sul-Americana" },
];

// ==========================================================
// HELPERS DE UI (mesmo padrão de AdicionarExploracaoPecuaria)
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
      >
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

const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// RN004 — vencimento = data do curso + 5 anos
const addCincoAnos = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setFullYear(d.getFullYear() + 5);
  return d.toISOString().slice(0, 10);
};
const hojeISO = () => new Date().toISOString().slice(0, 10);

// ==========================================================
// PÁGINA: ADICIONAR PROFISSIONAL DA ÁREA VEGETAL (US064 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarProfissionalVegetalPage({ onLogout, onNavigate }: PageProps) {
  // --- Informações Básicas ---
  const [pessoaFisica, setPessoaFisica] = useState<any | null>(null);
  const cpfPreenchido = !!pessoaFisica;
  const servicoOficial = pessoaFisica?.servicoOficial === "Sim";
  const esferaEstadual = pessoaFisica?.esfera === "Estadual";

  // --- Informações Profissionais ---
  const [formacao, setFormacao] = useState("");
  const [crea, setCrea] = useState("");
  const [coordenadoria, setCoordenadoria] = useState<any | null>(null);

  // --- Emissão de PTV (só p/ serviço oficial) ---
  const [habilitadoPtv, setHabilitadoPtv] = useState<boolean>(false);
  const [extensaoPtv, setExtensaoPtv] = useState<boolean>(false);

  // --- Emissão de CFO/CFOC (só p/ NÃO serviço oficial) ---
  const [habilitadoCfo, setHabilitadoCfo] = useState<boolean>(false);
  const [extensaoCfo, setExtensaoCfo] = useState<boolean>(false);

  // --- Listas dinâmicas ---
  const [estabelecimentos, setEstabelecimentos] = useState<any[]>([]);
  const [habilitacoesPraga, setHabilitacoesPraga] = useState<any[]>([]);
  const [anexos, setAnexos] = useState<any[]>([]);

  // --- Observações ---
  const [observacao, setObservacao] = useState("");

  const [isSucesso, setIsSucesso] = useState(false);

  // ---- Derivados ----
  const cpf = pessoaFisica?.documento ?? "";
  const isServicoOficial = !!pessoaFisica?.servicoOficial && pessoaFisica?.servicoOficial === "Sim";

  // Ao trocar a pessoa física, os blocos condicionais precisam ser zerados
  useEffect(() => {
    setHabilitadoPtv(false);
    setExtensaoPtv(false);
    setHabilitadoCfo(false);
    setExtensaoCfo(false);
    setEstabelecimentos([]);
    setHabilitacoesPraga([]);
  }, [pessoaFisica?.id]);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="profissional-area-vegetal" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("profissional-area-vegetal")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} aria-hidden />
            Todos os Profissionais da Área Vegetal
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Profissional da Área Vegetal</h1>
            <button
              type="button"
              onClick={() => setIsSucesso(true)}
              className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/40"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Aviso de obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" aria-hidden />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <PessoaFisicaInput
              value={pessoaFisica ? pessoaFisica.nome : ""}
              required
              data={PESSOAS_FISICAS_SERVICO_MOCK}
              onChange={(ent) => setPessoaFisica(ent)}
              onEyeClick={() => pessoaFisica && onNavigate("visualizar-pessoa-fisica", pessoaFisica)}
            />

            {/* Serviço Oficial (somente leitura) — disponível quando CPF preenchido */}
            {cpfPreenchido && (
              <SubGrupo titulo="Serviço Oficial" comDivisor>
                <FloatInput label="Serviço Oficial?" required disabled value={pessoaFisica.servicoOficial || "Não"} onChange={() => {}}  />

                {/* Se serviço oficial = Sim, exibe esfera e (se estadual) MASP */}
                {servicoOficial && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FloatInput label="Esfera do Serviço Oficial" required disabled value={pessoaFisica.esfera || ""} onChange={() => {}} />
                    {esferaEstadual && (
                      <FloatInput label="MASP" required disabled value={pessoaFisica.masp || ""} onChange={() => {}} hasTooltip tooltipText="Módulo de Autorização de Serviços Profissionais. Disponível para esfera Estadual." />
                    )}
                  </div>
                )}
              </SubGrupo>
            )}
          </div>
        </Section>

        {/* 2. Informações Profissionais */}
        <Section title="Informações Profissionais">
          <div className="flex flex-col gap-6">
            <SubGrupo titulo="Formação Profissional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FloatSelect
                  label="Formação Profissional"
                  required
                  value={formacao}
                  onChange={setFormacao}
                  options={toOptions(FORMACOES)}
                />
                <FloatInput label="CREA" required value={crea} onChange={setCrea} maxLength={30} />
              </div>
            </SubGrupo>

            <SubGrupo titulo="Coordenadoria Regional de Vinculação" comDivisor>
              <UnidadeAdministrativaInput
                required
                value={coordenadoria ? coordenadoria.nome : ""}
                onChange={(ent) => setCoordenadoria(ent)}
                onEyeClick={() => onNavigate("visualizar-unidade-administrativa", coordenadoria)}
              />
            </SubGrupo>
          </div>
        </Section>

        {/* 3a. Emissão de PTV — apenas se serviço oficial */}
        {isServicoOficial && (
          <Section title="Emissão de PTV">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <SimNao
                  label="Habilitado para Emissão de PTV?"
                  name="habilitadoPtv"
                  required
                  value={habilitadoPtv}
                  onChange={(v: boolean) => {
                    setHabilitadoPtv(v);
                    if (!v) {
                      setExtensaoPtv(false);
                      setEstabelecimentos([]);
                    }
                  }}
                />

                {habilitadoPtv && (
                  <SimNao
                    label="Extensão de Habilitação?"
                    name="extensaoPtv"
                    required
                    value={extensaoPtv}
                    onChange={setExtensaoPtv}
                    hasTooltip
                    tooltipText="Possibilita a atuação em diferentes unidades federativas sem a renovação do curso de habilitação."
                  />
                )}
              </div>

              {/* Estabelecimentos Agropecuários de Atuação — Exclusivo do Oficial (PTV) */}
              {habilitadoPtv && (
                <div className="border-t border-gray-100 pt-5 animate-fadeIn">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Estabelecimentos Agropecuários de Atuação</h3>
                  </div>

                  <DynamicListWrapper
                    items={estabelecimentos}
                    behavior="zero-or-more"
                    variant="plain"
                    addButtonLabel="Adicionar Extabelecimento Agropecuário"
                    onAddItem={() => setEstabelecimentos((p) => [...p, { uid: uid("estab"), estab: null }])}
                    onRemoveItem={(i: number) => setEstabelecimentos((p) => p.filter((_, idx) => idx !== i))}
                  >
                    {(item: any) => (
                      <div className="grid grid-cols-1 gap-4 items-center w-full">
                        <EstabelecimentoAgropecuarioInput
                          required
                          value={item.estab ? item.estab.nome : ""}
                          onChange={(ent) =>
                            setEstabelecimentos((p) => p.map((x) => (x.uid === item.uid ? { ...x, estab: ent } : x)))
                          }
                          onEyeClick={() => onNavigate("visualizar-estabelecimento", item.estab)}
                        />
                      </div>
                    )}
                  </DynamicListWrapper>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 3b. Emissão de CFO/CFOC — apenas se NÃO for serviço oficial */}
        {!isServicoOficial && (
          <Section title="Emissão de CFO/CFOC">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <SimNao
                  label="Habilitado para a Emissão de CFO/CFOC?"
                  name="habilitadoCfo"
                  required
                  value={habilitadoCfo}
                  onChange={(v: boolean) => {
                    setHabilitadoCfo(v);
                    if (!v) {
                      setExtensaoCfo(false);
                      setHabilitacoesPraga([]);
                    }
                  }}
                />

                {habilitadoCfo && (
                  <SimNao
                    label="Extensão de Habilitação"
                    name="extensaoCfo"
                    required
                    value={extensaoCfo}
                    onChange={setExtensaoCfo}
                    hasTooltip
                    tooltipText="Possibilita a atuação em diferentes unidades federativas sem a renovação do curso de habilitação."
                  />
                )}
              </div>

              {/* Habilitações para Pragas (zero ou mais) — Exclusivo do Privado (CFO/CFOC) */}
              {habilitadoCfo && (
                <div className="border-t border-gray-100 pt-5 animate-fadeIn">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Habilitações para Pragas</h3>
                  </div>

                  <DynamicListWrapper
                    items={habilitacoesPraga}
                    behavior="zero-or-more"
                    addButtonLabel="Adicionar Habilitação para Praga"
                    onAddItem={() =>
                      setHabilitacoesPraga((p) => [
                        ...p,
                        { uid: uid("praga"), praga: null, dataCurso: "", observacao: "" },
                      ])
                    }
                    onRemoveItem={(i: number) => setHabilitacoesPraga((p) => p.filter((_, idx) => idx !== i))}
                  >
                    {(item: any) => (
                      <div className="flex flex-col gap-4 w-full bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <EntitySearchInput
                            label="Praga"
                            required
                            placeholder="Buscar pelo nome científico ou popular."
                            value={item.praga ? item.praga.nomeCientifico : ""}
                            data={PRAGAS_MOCK}
                            searchKeys={["nomeCientifico", "nomePopular"]}
                            columns={[
                              { label: "Nome Científico", key: "nomeCientifico" },
                              { label: "Nome Popular", key: "nomePopular" },
                            ]}
                             icon={<img src={Icons.iconePragaUrl} alt="Praga" className="w-5 h-5 object-contain" />} 

                            title="Buscar Praga"
                            subtitle="Busque por uma praga cadastrada no sistema:"
                            onChange={(ent) =>
                              setHabilitacoesPraga((p) => p.map((x) => (x.uid === item.uid ? { ...x, praga: ent } : x)))
                            }
                          />
                          <FloatInput
                            label="Nome Popular"
                            required
                            disabled
                            value={item.praga?.nomePopular ?? ""}
                            onChange={() => {}}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <FloatInput
                            label="Data do Curso de Habilitação"
                            required
                            type="date"
                            icon={<Calendar size={20} color={GREEN} />}
                            value={item.dataCurso}
                            onChange={(v) =>
                              setHabilitacoesPraga((p) =>
                                p.map((x) => (x.uid === item.uid ? { ...x, dataCurso: v } : x))
                              )
                            }
                          />
                          <FloatInput
                            label="Data de Vencimento da Habilitação"
                            required
                            disabled
                            type="date"
                            value={addCincoAnos(item.dataCurso)}
                            onChange={() => {}}
                            hasTooltip
                            tooltipText="Prazo padrão de 5 anos a partir da data do curso de habilitação."
                          />
                        </div>

                        {item.dataCurso && item.dataCurso > hojeISO() && (
                          <p role="alert" className="text-sm text-red-500">
                            A data do curso de habilitação não pode ser futura.
                          </p>
                        )}

                        <LargeTextArea
                          label="Observação"
                          value={item.observacao || ""}
                          maxLength={1500}
                          rows={3}
                          onChange={(v) =>
                            setHabilitacoesPraga((p) =>
                              p.map((x) => (x.uid === item.uid ? { ...x, observacao: v } : x))
                            )
                          }
                        />
                      </div>
                    )}
                  </DynamicListWrapper>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 4. Anexos (zero ou mais) */}
        <Section title="Anexos">
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
                        setAnexos((prev) =>
                          prev.map((a, i) => (i === index ? { ...a, nome: `documento_${index + 1}.pdf` } : a))
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
                            maxLength={255}
                            onChange={(v) =>
                              setAnexos((prev) =>
                                prev.map((a, i) => (i === index ? { ...a, descricao: v } : a))
                              )
                            }
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            title={`Baixar ${anexo.nome}`}
                            aria-label={`Baixar ${anexo.nome}`}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))}
                        title="Remover anexo"
                        aria-label={`Remover anexo ${index + 1}`}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
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
              onClick={() => setAnexos((prev) => [...prev, { id: uid("anexo"), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A7A3C]/30"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* 5. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacao}
            maxLength={1500}
            onChange={setObservacao}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>

        {/* Rodapé de ações */}
        <div className="flex justify-end gap-3 pb-4">
          <CustomButton variant="outlined" onClick={() => onNavigate("profissional-area-vegetal")}>
            Cancelar
          </CustomButton>
          <CustomButton variant="filled" onClick={() => setIsSucesso(true)}>
            Adicionar
          </CustomButton>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-sucesso"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} aria-hidden />
            </div>
            <h3 id="titulo-sucesso" className="text-lg font-bold text-gray-900">
              Profissional cadastrado com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {pessoaFisica ? `O cadastro de ${pessoaFisica.nome}` : "O cadastro"} foi realizado.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("profissional-area-vegetal"); }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => { setIsSucesso(false); onNavigate("visualizar-profissional-area-vegetal"); }}
                className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition"
              >
                Visualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}