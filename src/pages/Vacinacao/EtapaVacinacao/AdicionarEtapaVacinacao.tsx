import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, Calendar, PlusCircle, Dna } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput,  MultiSearchModal } from "../../../components/ui/FormKit";
// Inputs de DOMÍNIO:
// DoencaInput  — DomainInputProps + `somenteVacinacaoOficial?: boolean`
//   (lista só doenças vacináveis de forma oficial). A entidade retornada deve trazer
//   { codigo, nome, especies: string[], faixasEtarias: string[] }.
// EspecieInput — DomainInputProps + `especiesPermitidas?: string[]`
//   (restringe às espécies suscetíveis à doença selecionada).
import { DoencaInput, EntitySearchInput,  DynamicListWrapper, SelectedChipsContainer } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";


const GREEN = "#1A7A3C";
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ESPECIES_MOCK = [
  { 
    id: "1", 
    nome: "Bovino", 
    faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "De 25 a 36 meses", "Acima de 36 meses"] 
  },
  { 
    id: "2", 
    nome: "Bubalino", 
    faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"] 
  },
  { 
    id: "3", 
    nome: "Equino", 
    faixasEtarias: ["Qualquer idade"] 
  },
  { 
    id: "4", 
    nome: "Suíno", 
    faixasEtarias: ["Dose única inicial", "Reforço anual"] 
  },
  { 
    id: "5", 
    nome: "Ovino", 
    faixasEtarias: ["De 0 a 6 meses", "Acima de 6 meses"] 
  },
  { 
    id: "6", 
    nome: "Caprino", 
    faixasEtarias: ["De 0 a 6 meses", "Acima de 6 meses"] 
  },
  { 
    id: "7", 
    nome: "Aves", 
    faixasEtarias: ["1 dia de vida", "Reforço reprodutoras"] 
  }
];
// ===================
// HELPERS DE UI
// ===================
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
function SubGrupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-gray-700">{titulo}</span>
      {children}
    </div>
  );
}

// Código auto-calculado (placeholder no protótipo; o backend gera o sequencial real)
const codigoCalculado = `${new Date().getFullYear()}/01`;

// ==========================================================
// PÁGINA: ADICIONAR ETAPA DE VACINAÇÃO (US0V6 - AC3)
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarEtapaVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
const [doencaSelecionada, setDoencaSelecionada] = useState<any>({
  doenca: null,
  especies: []
});
const [especieModalAberta, setEspecieModalAberta] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);
  const [especieModalUidAberta, setEspecieModalUidAberta] = useState<string | null>(null);

  const dataFimInvalida = dataInicio && dataFim && dataFim <= dataInicio;

  // ---- Atualizações aninhadas ----
  const setDoenca = (dUid: string, ent: any) =>
    setDoencaSelecionada((prev) => prev.map((d) => (d.uid === dUid ? { ...d, doenca: ent } : d)));
  const addEspecie = (dUid: string) =>
   setDoencaSelecionada((prev) => prev.map((d) => (d.uid === dUid ? { ...d, especies: [...d.especies, { uid: uid("e"), especie: null }] } : d)));
  const removeEspecie = (dUid: string, index: number) =>
    setDoencaSelecionada((prev) => prev.map((d) => (d.uid === dUid ? { ...d, especies: d.especies.filter((_: any, i: number) => i !== index) } : d)));
  const setEspecie = (dUid: string, eUid: string, ent: any) =>
    setDoencaSelecionada((prev) => prev.map((d) => (d.uid === dUid
      ? { ...d, especies: d.especies.map((e: any) => (e.uid === eUid ? { ...e, especie: ent } : e)) }
      : d)));

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("etapa-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todas as Etapas de Vacinação
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Etapa de Vacinação</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
          
        </div>

         {/* 🔥 ALERTA CORRIGIDO: Adicionado mb-6 para dar respiro até a próxima seção */}
            <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
              {/* Ícone de Informação Azul/Cinza Discreto */}
              <div className="text-gray-500 flex-shrink-0">
                <Info size={20} className="stroke-[2.5]" />
              </div>
            
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
              </p>
            </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Código — somente leitura, calculado automaticamente */}
              <FloatInput label="Data do Início" required type="date" value={dataInicio}  icon={<Calendar size={20} color={GREEN} />} onChange={setDataInicio} />
              <FloatInput label="Data do Fim" required type="date" value={dataFim}  icon={<Calendar size={20} color={GREEN} />} onChange={setDataFim} />
            </div>
            {dataFimInvalida && (
              <p className="text-sm text-red-500">A "Data do Fim" deve ser maior que a "Data do Início".</p>
            )}
          </div>
        </Section>

    {/* 2. Doenças (uma ou mais) */}
{/* 2. Doença Única */}
<Section title="Doença">
  <div className="flex flex-col gap-5 w-full">
    
    {/* Doença (somente vacináveis de forma oficial) */}
    <DoencaInput
      label="Doença"
      required
      somenteVacinacaoOficial
      value={doencaSelecionada.doenca ? doencaSelecionada.doenca.nome : ""}
      onChange={(ent: any) => {
        setDoencaSelecionada({
          doenca: ent,
          especies: [] // Reseta as espécies se trocar a doença
        });
      }}
      onEyeClick={() => onNavigate("visualizar-doenca", doencaSelecionada.doenca)}
    />

    {/* Espécies — Modelo Multi-Seleção por Chips Corrigido com Faixas Etárias */}
    {doencaSelecionada.doenca && (
      <SubGrupo titulo="Espécies">
        <div className="flex flex-col gap-4">
          
          {/* Botão de Adicionar Múltiplos */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Vincular as espécies correspondentes:</span>
            <button
              type="button"
              onClick={() => setEspecieModalAberta(true)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer"
            >
              <PlusCircle size={16} /> Adicionar Espécie
            </button>
          </div>

          {/* Exibição dos Chips Selecionados com as Faixas Etárias */}
          <SelectedChipsContainer
            title="Espécies Selecionadas"
            items={(doencaSelecionada.especies || [])
              .filter((esp: any) => esp && (esp.especie || esp.nome))
              .map((esp: any, index: number) => {
                const dadosEspecie = esp.especie || esp;
                
                const decolagemSeguraFaixas = dadosEspecie.faixasEtarias && dadosEspecie.faixasEtarias.length > 0
                  ? dadosEspecie.faixasEtarias
                  : (ESPECIES_MOCK.find(m => m.id === String(dadosEspecie.id) || m.nome === dadosEspecie.nome)?.faixasEtarias || []);

                return {
                  id: String(index), 
                  label: dadosEspecie.nome || "Espécie Selecionada",
                  subItems: decolagemSeguraFaixas
                };
              })}
            emptyText="Nenhuma espécie selecionada para esta doença."
            onRemoveItem={(idRemover) => {
              setDoencaSelecionada((prev: any) => ({
                ...prev,
                especies: prev.especies.filter((_: any, idx: number) => idx !== Number(idRemover))
              }));
            }}
          />

          {/* Modal de Seleção Múltipla de Espécies */}
          <MultiSearchModal
            open={especieModalAberta}
            onClose={() => setEspecieModalAberta(false)}
            title="Buscar Espécies"
            subtitle={`Selecione as espécies para a doença ${doencaSelecionada.doenca.nome}:`}
            icon={<Dna size={20} className="text-[#1A7A3C]" />}
            
            data={ESPECIES_MOCK}
            searchKeys={["nome"]}
            searchPlaceholder="Busque pelo nome da espécie."
            columns={[{ label: "Nome da Espécie", key: "nome" }]}
            
            selectedItems={(doencaSelecionada.especies || [])
              .filter((esp: any) => esp && (esp.especie || esp.nome))
              .map((esp: any) => esp.especie || esp)}
            
            onConfirm={(itensSelecionados: any[]) => {
              setDoencaSelecionada((prev: any) => ({
                ...prev,
                especies: itensSelecionados.map((esp) => ({
                  uid: uid("e"),
                  especie: esp,
                }))
              }));
              setEspecieModalAberta(false); // Fecha o modal após confirmar
            }}
          />
        </div>
      </SubGrupo>
    )}
  </div>
</Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Etapa de vacinação adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">A etapa {codigoCalculado} foi criada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("etapa-vacinacao"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-etapa-vacinacao"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}