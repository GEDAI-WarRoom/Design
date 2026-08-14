import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Dna,
  Info,
  PlusCircle,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import * as Icons from "../../../imports/icons";
import {
  CheckboxGroup,
  FloatInput,
  LargeTextArea,
  MultiSearchModal,
} from "../../../components/ui/FormKit";
import { listarEspecies, type Especie } from "../../Animal/Especie/especieData";
import { listarPapeis, type Papel } from "../../Controle/Papeis/papeisData";
import {
  salvarFinalidadeTransito,
  type FinalidadeTransitoVisual,
} from "./finalidadeTransitoData";

const GREEN = "#1A7A3C";

// --- lista de opcoes (US0RXX - CA3) ---
const TIPOS_LOCAL = [
  "Estabelecimento Agropecuário",
  "Evento Pecuário",
  "Abatedouro Frigorífico",
  "Revendedora de Animais Vivos",
  "Unidade de Vigilância Agropecuária",
  "Instituição de Ensino e Pesquisa",
  "Local de Pesagem",
  "Local de Realização de Exame",
  "Estabelecimento Genérico",
];
const EMITE_GTA_ACESSO_EXTERNO = [
  "Emite para dentro do Estado",
  "Emite para fora do Estado",
];

// --- helpers ---
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left rounded-xl hover:bg-gray-50 transition"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}

function SubGrupo({
  titulo,
  children,
  comDivisor = false,
  procedencia = [],
}: {
  titulo: string;
  children: React.ReactNode;
  comDivisor?: boolean;
  procedencia?: any[];
}) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        {procedencia?.length > 0 && (
          <span className="pt-5 text-sm font-semibold text-gray-700">
            {titulo}
          </span>
        )}
        {children}
      </div>
    </>
  );
}

const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

// --- pagina (adicionar finalidade de transito) ---
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarFinalidadeTransitoPage({
  onLogout,
  onNavigate,
}: PageProps) {
  // --- informações basicas ---
  const [finalidadeTransito, setFinalidadeTransito] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tiposProcedencia, setTiposProcedencia] = useState<string[]>([]);
  const [codigoMapa, setCodigoMapa] = useState("");
  const [emiteAcessoExterno, setEmiteAcessoExterno] = useState<string[]>([]);
  const [tiposDestino, setTiposDestino] = useState<string[]>([]);
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [papeis, setPapeis] = useState<Papel[]>([]);
  const [modalEspecieAberto, setModalEspecieAberto] = useState(false);
  const [modalPapelAberto, setModalPapelAberto] = useState(false);

  // --- procedencia/especie (RNE001 para zero ou mais instâncias) ---
  const [procedencias, setProcedencias] = useState<any[]>([]);

  const [isSucesso, setIsSucesso] = useState(false);
  const [registroSalvo, setRegistroSalvo] = useState<FinalidadeTransitoVisual | null>(null);

  const handleCodigoMapaChange = (v: string) => {
    let apenasNumeros = v.replace(/\D/g, "").slice(0, 2);
    if (apenasNumeros && parseInt(apenasNumeros, 10) > 99) apenasNumeros = "99";
    setCodigoMapa(apenasNumeros);
  };

  const atualizarProcedencia = (index: number, campo: string, valor: any) => {
    setProcedencias((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)),
    );
  };

  const salvar = () => {
    const papelIds = papeis.map((papel) => papel.id);
    if (
      !finalidadeTransito.trim() ||
      !descricao.trim() ||
      !codigoMapa ||
      !especies.length ||
      !papelIds.length ||
      !tiposProcedencia.length ||
      !tiposDestino.length
    ) return;
    const salvo = salvarFinalidadeTransito({
      finalidade: finalidadeTransito.trim(),
      descricao: descricao.trim(),
      codigoMapa,
      tiposProcedencia,
      emiteAcessoExterno,
      tiposDestino,
      especieIds: especies.map((item) => item.id),
      papelIds,
      procedencias,
      situacao: "Ativo",
    });
    setRegistroSalvo(salvo);
    setIsSucesso(true);
  };

	return (
		<div className="min-h-screen bg-[#f2f3f5]">
			<Navbar
				onLogout={onLogout}
				onNavigate={onNavigate}
				currentScreen="adicionar-finalidade-trasito"
				hideSearch
			/>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* --- cabecalho --- */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("finalidade-transito")}
            className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70"
            style={{ color: GREEN }}
          >
            <ArrowLeft size={15} />
            Todas as Finalidades de Trânsito
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Adicionar Finalidade de Trânsito
            </h1>
            <button
              type="button"
              onClick={salvar}
              className="px-5 py-3 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-bold rounded-md transition shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* --- alerta de campos obrigatorios --- */}
        <div className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0">
            <Info size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com{" "}
            <span className="text-red-500 font-bold">*</span> são obrigatórios e
            deverão ser preenchidos.
          </p>
        </div>

        {/* --- [1] informacoes basicas --- */}
        <Section title="Informações Básicas">
          <div className="pt-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <FloatInput
                label="Finalidade de Trânsito"
                required
                value={finalidadeTransito}
                onChange={setFinalidadeTransito}
                maxLength={100}
              />
              <FloatInput
                label="Código do MAPA"
                required
                value={codigoMapa}
                onChange={handleCodigoMapaChange}
                maxLength={2}
              />
            </div>
            <LargeTextArea
              label="Descrição"
              value={descricao}
              onChange={setDescricao}
              required
              maxLength={1500}
            />
          </div>
        </Section>

        {/* --- [2] especies aplicaveis --- */}
        <Section title="Espécies Aplicáveis (Uma ou mais)">
          <div className="pt-5 flex flex-col gap-4">
            {/* Estrutura unificada: Título e Botão lado a lado na mesma linha */}
            <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden mt-2">
              {/* Cabeçalho do Bloco Integrado */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">
                    Espécies Selecionadas{" "}
                    <span className="text-red-500 ml-0.5">*</span>
                  </span>
                  {especies.length > 0 && (
                    <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">
                      {especies.length}{" "}
                      {especies.length === 1 ? "Selecionada" : "Selecionadas"}
                    </span>
                  )}
                </div>

                {/* Botão de Adicionar Espécie (Compacto e elegante) */}
                <button
                  type="button"
                  onClick={() => setModalEspecieAberto(true)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
                >
                  <PlusCircle size={14} /> Adicionar Espécie
                </button>
              </div>

              {/* Conteúdo / Grid dos Chips de Espécies */}
              <div className="p-5 flex flex-wrap gap-4 bg-white">
                {especies.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    Nenhuma espécie selecionada.
                  </p>
                ) : (
                  especies.map((especie) => (
                    <div
                      key={especie.id}
                      className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[180px] shadow-sm transition hover:border-gray-300 relative group"
                    >
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span
                          className="text-sm font-bold"
                          style={{ color: GREEN }}
                        >
                          {especie.nome}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setEspecies((prev) =>
                              prev.filter((item) => item.id !== especie.id),
                            )
                          }
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

            {/* Modal de Seleção Múltipla de Espécies */}
            <MultiSearchModal
              open={modalEspecieAberto}
              onClose={() => setModalEspecieAberto(false)}
              title="Buscar Espécies"
              subtitle="Busque por uma ou mais espécies cadastradas no sistema:"
              icon={<Dna size={18} color={GREEN} />}
              data={listarEspecies().filter((item) => item.situacao === "Ativo")}
              columns={[
                {
                  label: "Nome da Espécie",
                  key: "nome",
                },
              ]}
              searchKeys={["nome"]}
              searchPlaceholder="Busque pelo nome da espécie."
              selectedItems={especies}
              confirmLabel="Salvar Selecionadas"
              onConfirm={(selecionadas) => {
                setEspecies(selecionadas);
                setModalEspecieAberto(false);
              }}
            />
          </div>
        </Section>

        <Section title="Papéis Aplicáveis (Uma ou mais)">
          <div className="pt-5 flex flex-col gap-4">
            <div className="w-full border border-gray-200 rounded-xl bg-[#f9fafb]/50 overflow-hidden mt-2">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-500">Papéis Selecionados <span className="text-red-500 ml-0.5">*</span></span>
                  {papeis.length > 0 && <span className="text-xs font-bold bg-[#E6F4EA] text-[#1A7A3C] px-2.5 py-1 rounded-full">{papeis.length} {papeis.length === 1 ? "Selecionado" : "Selecionados"}</span>}
                </div>
                <button type="button" onClick={() => setModalPapelAberto(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"><PlusCircle size={14} />Adicionar Papel</button>
              </div>
              <div className="p-5 flex flex-wrap gap-4 bg-white">
                {papeis.length === 0 ? <p className="text-xs text-gray-400 italic">Nenhum papel selecionado.</p> : papeis.map((papel) => (
                  <div key={papel.id} className="flex flex-col bg-white border border-gray-200 rounded-xl p-2.5 min-w-[180px] shadow-sm transition hover:border-gray-300 relative group">
                    <div className="flex items-center justify-between gap-4 w-full"><span className="text-sm font-bold" style={{ color: GREEN }}>{papel.nome}</span><button type="button" onClick={() => setPapeis((items) => items.filter((item) => item.id !== papel.id))} className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"><X size={16} /></button></div>
                  </div>
                ))}
              </div>
            </div>
            <MultiSearchModal
              open={modalPapelAberto}
              onClose={() => setModalPapelAberto(false)}
              title="Buscar Papéis"
              subtitle="Busque por um ou mais papéis cadastrados no sistema:"
              icon={<img src={Icons.iconePapeisUrl} alt="" className="h-[18px] w-[18px] object-contain" />}
              data={listarPapeis()}
              columns={[{ label: "Nome do Papel", key: "nome" }, { label: "Tipo", key: "tipo" }, { label: "Situação", key: "situacao" }]}
              searchKeys={["nome", "tipo", "situacao"]}
              searchPlaceholder="Busque pelo nome do papel."
              selectedItems={papeis}
              confirmLabel="Salvar Selecionados"
              onConfirm={(selecionados) => { setPapeis(selecionados); setModalPapelAberto(false); }}
            />
          </div>
        </Section>

        {/* --- OPÇÃO 1: Alterando a proporção ou estrutura da Grid --- */}
        <Section title="Informações de Procedência">
          <div className="pt-5 flex flex-col gap-5 w-full">
            {/* Removido o grid duplicado que estava afunilando as colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
              <CheckboxGroup
                title="Tipo de Procedência"
                required
                options={TIPOS_LOCAL.map((item) => ({
                  value: item,
                  label: item,
                }))}
                defaultValue={tiposProcedencia}
                onChange={setTiposProcedencia}
              />

              {tiposProcedencia.includes("Estabelecimento Agropecuário") && (
                <div className="w-full">
                  <CheckboxGroup
                    title="Emite GTA por Acesso Externo"
                    options={EMITE_GTA_ACESSO_EXTERNO.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    defaultValue={emiteAcessoExterno}
                    onChange={setEmiteAcessoExterno}
                  />
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* --- [3] informacoes de destino --- */}
        <Section title="Informações de Destino">
          <div className="pt-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <CheckboxGroup
                title="Tipo de Destino"
                required
                options={TIPOS_LOCAL.map((item) => ({
                  value: item,
                  label: item,
                }))}
                defaultValue={tiposDestino}
                onChange={setTiposDestino}
              />
            </div>
          </div>
        </Section>
      </main>

      {/* --- modal de sucesso --- */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#1A7A3C]" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Finalidade de Trânsito cadastrada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {finalidadeTransito
                ? `A finalidade "${finalidadeTransito}"`
                : "A finalidade"}{" "}
              foi cadastrada.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("finalidade-transito");
                }}
                className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSucesso(false);
                  onNavigate("visualizar-finalidade-transito", registroSalvo);
                }}
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
