import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronUp, ChevronDown, Info, AlertTriangle, Check } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect } from "../../../components/ui/FormKit";
import { EntitySearchInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

const MOCK_KEY = "ATESTADOS_DB";
const getAtestados = () => {
  const stored = localStorage.getItem(MOCK_KEY);
  return stored ? JSON.parse(stored) : [];
};

const atualizarAtestadoDb = (atualizado: any) => {
  const db = getAtestados();
  const index = db.findIndex((x: any) => x.id.toString() === atualizado.id.toString());
  if(index > -1) {
    db[index] = atualizado;
    localStorage.setItem(MOCK_KEY, JSON.stringify(db));
  }
};

// ==========================================================
// FUNÇÃO PARA BUSCAR O ITEM EXATO CLICADO
// ==========================================================
const getSelectedItem = (dataProp: any) => {
  if (dataProp && dataProp.id) return dataProp;
  
  const currentId = localStorage.getItem("CURRENT_ATESTADO_ID");
  const db = getAtestados();
  
  if (currentId) {
    const found = db.find((x: any) => x.id.toString() === currentId);
    if (found) return found;
  }
  
  return db[0] || {};
};

const DOENCAS_CORRIGIDAS_MOCK = [
  { id: 1, codigo: "D01", nome: "Febre Aftosa" },
  { id: 2, codigo: "D02", nome: "Brucelose" },
  { id: 3, codigo: "D03", nome: "Clostridiose" },
  { id: 4, codigo: "D04", nome: "Raiva" }, 
  { id: 5, codigo: "D05", nome: "Anemia Infecciosa Equina (AIE)" },
];

const SITUACOES = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
];

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

interface PageProps {
  onLogout?: () => void;
  onNavigate?: (screen: string, payload?: any) => void;
  data?: any; 
}

export function EditarAtestadoExamePage({ 
  onLogout = () => {}, 
  onNavigate = (screen, payload) => console.log("navigate:", screen, payload),
  data
}: PageProps) {
  
  const r = getSelectedItem(data);
  const extrairDoenca = (item: any) => typeof item?.doenca === 'string' ? { nome: item.doenca } : (item?.doenca || null);

  const [descricao, setDescricao] = useState(r.descricao || "");
  const [doenca, setDoenca] = useState<any | null>(extrairDoenca(r));
  const [diasValidade, setDiasValidade] = useState(r.diasValidade || "180");
  const [situacao, setSituacao] = useState(r.situacao || "Ativo");

  const [isSucesso, setIsSucesso] = useState(false);
  const [isErro, setIsErro] = useState(false);

  // Garante a sincronização caso o componente não desmonte 
  useEffect(() => {
    const itemToEdit = getSelectedItem(data);
    if (itemToEdit && itemToEdit.id) {
      setDescricao(itemToEdit.descricao || "");
      setDoenca(extrairDoenca(itemToEdit));
      setDiasValidade(itemToEdit.diasValidade || "180");
      setSituacao(itemToEdit.situacao || "Ativo");
    }
  }, [data]);

  const handleSalvar = () => {
    if (!descricao || !doenca || !diasValidade || !situacao) {
      setIsErro(true);
      return;
    }
    
    atualizarAtestadoDb({
      ...r,
      descricao,
      doenca: doenca.nome,
      diasValidade,
      situacao
    });

    setIsSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="atestado-exame" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        <div>
          <button onClick={() => {
            localStorage.setItem("CURRENT_ATESTADO_ID", r.id.toString());
            onNavigate("visualizar-atestado-exame", r);
          }} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Visualizar Atestado
          </button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Editar Atestado de Exame</h1>
            <button onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Salvar Alterações
            </button>
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

        <Section title="Informações Básicas">
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <FloatInput label="Descrição do atestado" required value={descricao} onChange={setDescricao} maxLength={255} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full">
              <EntitySearchInput
                label="Doença"
                required
                placeholder="Selecione uma doença..."
                value={doenca ? doenca.nome : ""}
                data={DOENCAS_CORRIGIDAS_MOCK}
                searchKeys={["nome"]}
                columns={[{ label: "Nome da Doença", key: "nome" }]}
                title="Buscar Doença"
                subtitle="Busque por uma doença cadastrada:"
                icon={<img src={Icons.iconeDoencaUrl || (Icons as any).iconedoencaurl} alt="Doença" className="w-[24px] h-[24px] object-contain mr-2 -ml-1 flex-shrink-0" />}
                hideEye={true}
                onChange={(entidade) => setDoenca(entidade)}
              />

              <FloatInput label="Dias de Validade do Exame" required value={diasValidade} onChange={(v) => setDiasValidade(v.replace(/\D/g, ""))} maxLength={3} />
              <FloatSelect label="Situação" required value={situacao} onChange={setSituacao} options={SITUACOES} />
            </div>
          </div>
        </Section>
      </main>

      {isErro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5"><AlertTriangle size={32} className="text-red-500" /></div>
            <h3 className="text-xl font-bold text-gray-900">Campos obrigatórios</h3>
            <p className="text-sm text-gray-500 mt-2">Por favor, preencha todos os campos obrigatórios marcados com asterisco (*) antes de prosseguir.</p>
            <div className="flex justify-center mt-8 w-full">
              <button onClick={() => setIsErro(false)} className="px-10 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition w-full md:w-auto shadow-sm">Entendi</button>
            </div>
          </div>
        </div>
      )}

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#eaf4eb] rounded-full flex items-center justify-center mb-5"><Check size={32} className="text-[#1A7A3C] stroke-[3]" /></div>
            <h3 className="text-xl font-bold text-gray-900">Atestado atualizado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-2">As alterações foram gravadas no sistema.</p>
            <div className="flex gap-4 justify-center mt-8 w-full">
              <button onClick={() => { setIsSucesso(false); onNavigate("atestado-exame"); }} className="px-8 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition w-full md:w-auto">Voltar</button>
              <button onClick={() => {
                setIsSucesso(false); 
                localStorage.setItem("CURRENT_ATESTADO_ID", r.id.toString());
                onNavigate("visualizar-atestado-exame", { ...r, descricao, doenca: doenca.nome, diasValidade, situacao });
              }} className="px-8 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition w-full md:w-auto shadow-sm">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarAtestadoExamePage;