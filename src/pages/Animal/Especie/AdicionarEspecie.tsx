import React, { useState } from "react";
import { ArrowLeft, Info, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SimNao } from "../../../components/ui/FormKit";

const GREEN = "#1A7A3C";

// Grupos (valores da US016)
const GRUPOS = [
  "Anfíbios", "Aves", "Bovídeos", "Crustáceos", "Equídeos", "Grandes Roedores",
  "Invertebrados", "Moluscos", "Outras Espécies", "Peixes", "Répteis",
  "Suídeos", "Taiassuídeos",
];

const SIM_NAO = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

// ==========================================================
// HELPERS DE UI
// ==========================================================
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

// ==========================================================
// PÁGINA: ADICIONAR ESPÉCIE (US016 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarEspeciePage({ onLogout, onNavigate }: PageProps) {
  // Informações Básicas
  const [grupo, setGrupo] = useState("");
  const [nome, setNome] = useState("");
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [codigoMapa, setCodigoMapa] = useState("");

  // Informações da GTA
  const [maxAnimaisGta, setMaxAnimaisGta] = useState("");
  const [controleRebanhoNucleo, setControleRebanhoNucleo] = useState("Não");
  const [sexoDefinido, setSexoDefinido] = useState("Não");
  const [emissaoGtaHabilitado, setEmissaoGtaHabilitado] = useState("Não");
  const [utilizaFormularioGta, setUtilizaFormularioGta] = useState("Não");

  const [isSucesso, setIsSucesso] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="especie" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("especie")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Espécies
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Espécie</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatSelect
                label="Grupo"
                required
                value={grupo}
                onChange={setGrupo}
                options={GRUPOS.map((g) => ({ value: g, label: g }))}
              />
              <FloatInput label="Nome da Espécie" required value={nome} onChange={setNome} maxLength={255} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput label="Nome Científico" value={nomeCientifico} onChange={setNomeCientifico} maxLength={255} />
              <FloatInput
                label="Código do MAPA"
                required
                value={codigoMapa}
                onChange={(v: string) => setCodigoMapa(v.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                inputMode="numeric"
               
              />
            </div>
          </div>
        </Section>

        {/* 2. Informações da GTA */}
        <Section title="Informações da GTA">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatInput
                label="Número máximo de animais por GTA"
                value={maxAnimaisGta}
                onChange={(v: string) => setMaxAnimaisGta(v.replace(/\D/g, ""))}
                inputMode="numeric"
              />
              </div>


{/* 💡 Segundo bloco: Outras perguntas de Sim ou Não */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-5">
  <SimNao 
    label="Possui Controle de Rebanho por Núcleo?" 
    required 
    value={controleRebanhoNucleo} 
    onChange={setControleRebanhoNucleo} 
  />
  <SimNao 
    label="Possui Sexo Definido?" 
    required 
    value={sexoDefinido} 
    onChange={setSexoDefinido} 
  />
 
</div>

            {/* 💡 Segundo bloco: Outras perguntas de Sim ou Não */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-5">

  <SimNao 
    label="Espécie Permite Emissão de GTA por Habilitado?" 
    required 
    value={emissaoGtaHabilitado} 
    onChange={setEmissaoGtaHabilitado} 
  />
  <SimNao 
    label="Utiliza Formulário para a Emissão de GTA?" 
    required 
    value={utilizaFormularioGta} 
    onChange={setUtilizaFormularioGta} 
  />
</div>
            </div>
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900">Espécie adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nome ? `"${nome}"` : "A espécie"} foi adicionada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("especie"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-especie", {
                grupo, nome, nomeCientifico, codigoMapa,
                maxAnimaisGta, controleRebanhoNucleo, sexoDefinido,
                emissaoGtaHabilitado, utilizaFormularioGta,
                situacao: "Ativo",
              }); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}