import React, { useState } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Bug,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SearchModal } from "../../../components/ui/FormKit";
import { DynamicListWrapper } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US034 - AC1)
// ==========================================================
const TIPOS_CULTURA = [
  { value: "Anual", label: "Anual" },
  { value: "Perene", label: "Perene" },
];

// ==========================================================
// MOCK: Pragas (ver US032) — substituir por API
// ==========================================================
interface Praga {
  id: number;
  nomeCientifico: string;
  nomePopular: string;
}

const PRAGAS_MOCK: Praga[] = [
  { id: 1, nomeCientifico: "Cerodirphia rubripes", nomePopular: "Lagarta-Verde" },
  { id: 2, nomeCientifico: "Spodoptera frugiperda", nomePopular: "Lagarta-do-cartucho" },
  { id: 3, nomeCientifico: "Hypothenemus hampei", nomePopular: "Broca-do-café" },
  { id: 4, nomeCientifico: "Bemisia tabaci", nomePopular: "Mosca-branca" },
];

// ==========================================================
// HELPERS DE UI (padrão do projeto)
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

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ==========================================================
// PÁGINA: ADICIONAR CULTURA (US034 - AC1)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarCulturaPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");

  // ---- Variedades (zero ou mais) ----
  const [variedades, setVariedades] = useState<any[]>([]);

  // ---- Pragas (zero ou mais) ----
  const [pragas, setPragas] = useState<any[]>([]);
  const [modalPragaUid, setModalPragaUid] = useState<string | null>(null);

  const [isSucesso, setIsSucesso] = useState(false);

  // Pragas já selecionadas não devem aparecer novamente na busca
  const pragasDisponiveis = PRAGAS_MOCK.filter(
    (p) => !pragas.some((item) => item.praga && item.praga.id === p.id && item.uid !== modalPragaUid)
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="cultura" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("cultura")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Culturas
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Cultura</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Banner de obrigatórios */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <FloatInput label="Nome da Cultura" required value={nome} onChange={setNome} maxLength={255} />
            <FloatSelect label="Tipo de Cultura" required value={tipo} onChange={setTipo} options={TIPOS_CULTURA} />
          </div>
        </Section>

        {/* 2. Variedades (zero ou mais) */}
        <Section title="Variedades">
          <DynamicListWrapper
            items={variedades}
            behavior="any"
            variant="plain"
            itemLabel="Variedade"
            addButtonLabel="Adicionar Variedade"
            onAddItem={() => setVariedades((p) => [...p, { uid: uid("var"), nome: "" }])}
            onRemoveItem={(i) => setVariedades((p) => p.filter((_, idx) => idx !== i))}
          >
            {(item) => (
              <FloatInput
                label="Nome da Variedade"
                required
                value={item.nome}
                onChange={(v) => setVariedades((p) => p.map((x) => x.uid === item.uid ? { ...x, nome: v.slice(0, 255) } : x))}
                maxLength={255}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 3. Pragas (zero ou mais) */}
        <Section title="Pragas">
          <DynamicListWrapper
            items={pragas}
            behavior="any"
            variant="plain"
            itemLabel="Praga"
            addButtonLabel="Adicionar Praga"
            onAddItem={() => setPragas((p) => [...p, { uid: uid("praga"), praga: null }])}
            onRemoveItem={(i) => setPragas((p) => p.filter((_, idx) => idx !== i))}
          >
            {(item) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
                <FloatInput
                  label="Praga (nome científico)"
                  required
                  value={item.praga ? item.praga.nomeCientifico : ""}
                   icon={<img src={Icons.iconePragaUrl} alt="Praga" className="w-5 h-5 object-contain" />} 

                  onClick={() => setModalPragaUid(item.uid)}
                  readOnly
                />
                {item.praga && (
                  <FloatInput label="Nome Popular" required disabled value={item.praga.nomePopular} onChange={() => {}} />
                )}
              </div>
            )}
          </DynamicListWrapper>
        </Section>
      </main>

      {/* Modal Praga (busca por nome científico ou popular) */}
      <SearchModal<Praga>
        open={modalPragaUid !== null}
        onClose={() => setModalPragaUid(null)}
        title="Buscar Praga"
        subtitle="Busque por uma praga cadastrada no sistema:"
                          icon={<img src={Icons.iconePragaUrl} alt="Praga" className="w-8 h-8 object-contain" />} 

        data={pragasDisponiveis}
        columns={[{ label: "Nome Científico", key: "nomeCientifico" }, { label: "Nome Popular", key: "nomePopular" }]}
        searchKeys={["nomeCientifico", "nomePopular"]}
        searchPlaceholder="Buscar por nome científico ou nome popular"
        confirmLabel="Confirmar"
        onConfirm={(praga) => {
          setPragas((p) => p.map((x) => x.uid === modalPragaUid ? { ...x, praga } : x));
          setModalPragaUid(null);
        }}
      />

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Cultura cadastrada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A cultura"} foi cadastrada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("cultura"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-cultura", { nome, tipo, variedades, pragas, situacao: "Ativo" }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}