import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Check, Info, Calendar, PlusCircle, Dna } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, MultiSearchModal } from "../../../components/ui/FormKit";
import { DoencaInput, SelectedChipsContainer } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ESPECIES_MOCK = [
  { id: "1", nome: "Bovino", faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "De 25 a 36 meses", "Acima de 36 meses"] },
  { id: "2", nome: "Bubalino", faixasEtarias: ["De 0 a 12 meses", "De 13 a 24 meses", "Acima de 24 meses"] },
  { id: "3", nome: "Equino", faixasEtarias: ["Qualquer idade"] },
  { id: "4", nome: "Suíno", faixasEtarias: ["Dose única inicial", "Reforço anual"] },
];

const MOCK_KEY = "ETAPAS_VACINACAO_DB";

const saveToDb = (novoRegistro: any) => {
  const stored = localStorage.getItem(MOCK_KEY);
  const db = stored ? JSON.parse(stored) : [];
  db.push(novoRegistro);
  localStorage.setItem(MOCK_KEY, JSON.stringify(db));
};

const getNextSequence = () => {
  const stored = localStorage.getItem(MOCK_KEY);
  const db = stored ? JSON.parse(stored) : [];
  const anoAtual = new Date().getFullYear();
  const etapasDoAno = db.filter((x: any) => x.codigo && x.codigo.startsWith(anoAtual.toString()));
  const seq = (etapasDoAno.length + 1).toString().padStart(2, '0');
  return `${anoAtual}/${seq}`;
};

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm mb-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition border-b border-gray-100">
        <span className="text-sm font-bold text-gray-700">{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 py-6 pt-5">{children}</div>}
    </div>
  );
}

export function AdicionarEtapaVacinacaoPage({ onLogout, onNavigate }: any) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [doencaSelecionada, setDoencaSelecionada] = useState<any>({ doenca: null, especies: [] });
  
  const [especieModalAberta, setEspecieModalAberta] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);
  const [newId, setNewId] = useState<number | null>(null);
  const [codigoCalculado, setCodigoCalculado] = useState(getNextSequence());

  const dataFimInvalida = dataInicio && dataFim && dataFim <= dataInicio;

  const handleSalvar = () => {
    if (!dataInicio || !dataFim || !doencaSelecionada.doenca || doencaSelecionada.especies.length === 0 || dataFimInvalida) {
      alert("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    // Regra de Negócio: Se a data de início já passou ou é hoje, situação = Aberta. Senão = Criada
    const hojeStr = new Date().toISOString().split('T')[0];
    const situacaoCalculada = dataInicio <= hojeStr ? "Aberta" : "Criada";

    const generatedId = Date.now();
    const especiesFormatadas = doencaSelecionada.especies.map((e: any) => ({
      nome: e.especie.nome,
      faixasEtarias: e.especie.faixasEtarias || []
    }));

    const novaEtapa = {
      id: generatedId,
      codigo: codigoCalculado,
      dataInicio,
      dataFim,
      doenca: {
        nome: doencaSelecionada.doenca.nome,
        codigo: doencaSelecionada.doenca.codigo || ""
      },
      especies: especiesFormatadas,
      situacao: situacaoCalculada
    };

    saveToDb(novaEtapa);
    setNewId(generatedId);
    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="etapa-vacinacao" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button type="button" onClick={() => onNavigate("etapa-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as Etapas de Vacinação
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Etapa de Vacinação</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Adicionar
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3 mt-4 mb-6">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <FloatInput label="Data do Início" required type="date" value={dataInicio} icon={<Calendar size={20} color={GREEN} />} onChange={setDataInicio} />
              <FloatInput label="Data do Fim" required type="date" value={dataFim} icon={<Calendar size={20} color={GREEN} />} onChange={setDataFim} />
            </div>
            {dataFimInvalida && <p className="text-sm text-red-500">A "Data do Fim" deve ser maior que a "Data do Início".</p>}
          </div>
        </Section>

        <Section title="Doença e Espécies">
          <div className="flex flex-col gap-5 w-full">
            <DoencaInput
              label="Doença"
              required
              somenteVacinacaoOficial
              value={doencaSelecionada.doenca ? doencaSelecionada.doenca.nome : ""}
              onChange={(ent: any) => { setDoencaSelecionada({ doenca: ent, especies: [] }); }}
              onEyeClick={() => onNavigate("visualizar-doenca", doencaSelecionada.doenca)}
            />

            {doencaSelecionada.doenca && (
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Espécies</span>
                  <button type="button" onClick={() => setEspecieModalAberta(true)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 transition cursor-pointer">
                    <PlusCircle size={16} /> Adicionar Espécie
                  </button>
                </div>

                <SelectedChipsContainer
                  title="Espécies Selecionadas"
                  items={(doencaSelecionada.especies || []).map((esp: any, index: number) => {
                    const dadosEspecie = esp.especie || esp;
                    const faixas = dadosEspecie.faixasEtarias || [];
                    return { id: String(index), label: dadosEspecie.nome || "Espécie Selecionada", subItems: faixas };
                  })}
                  emptyText="Nenhuma espécie selecionada para esta doença."
                  onRemoveItem={(idRemover) => {
                    setDoencaSelecionada((prev: any) => ({ ...prev, especies: prev.especies.filter((_: any, idx: number) => idx !== Number(idRemover)) }));
                  }}
                />

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
                  selectedItems={(doencaSelecionada.especies || []).map((esp: any) => esp.especie || esp)}
                  onConfirm={(itensSelecionados: any[]) => {
                    setDoencaSelecionada((prev: any) => ({ ...prev, especies: itensSelecionados.map((esp) => ({ uid: uid("e"), especie: esp })) }));
                    setEspecieModalAberta(false);
                  }}
                />
              </div>
            )}
          </div>
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Etapa de vacinação adicionada com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">A etapa {codigoCalculado} foi criada.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("etapa-vacinacao"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { 
                  setIsSucesso(false); 
                  if(newId) localStorage.setItem("CURRENT_ETAPA_ID", newId.toString());
                  onNavigate("visualizar-etapa-vacinacao", { id: newId }); 
              }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}