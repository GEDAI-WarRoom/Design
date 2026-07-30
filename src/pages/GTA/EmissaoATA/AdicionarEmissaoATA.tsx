import React, { useState } from "react";
import { ArrowLeft, Info, Check, PlusCircle, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, LargeTextArea, UploadField } from "../../../components/ui/FormKit";
import { DynamicListWrapper, EntitySearchInput, ProdutorInput, EstabelecimentoAgropecuarioInput, ExploracaoPecuariaInput, NucleoInput, DestinatarioInput } from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ESPECIES_MOCK = [
  { id: 1, nome: "Bovino" }, { id: 2, nome: "Suíno" }, { id: 3, nome: "Equino" }, { id: 4, nome: "Avícola" }
];
const FINALIDADES_MOCK = [
  { id: 1, nome: "Abate" }, { id: 2, nome: "Cria" }, { id: 3, nome: "Engorda" }, { id: 4, nome: "Reprodução" }
];

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

export function AdicionarEmissaoATAPage({ dados, onLogout, onNavigate }: { dados?: any; onLogout: () => void; onNavigate: (s: string, d?: any) => void; }) {
  const isEdicao = !!dados;
  const [isSucesso, setIsSucesso] = useState(false);
  
  // Estados do Formulário
  const [especie, setEspecie] = useState(dados?.especie || "");
  const [finalidade, setFinalidade] = useState(dados?.finalidade || "");
  const [meioTransporte, setMeioTransporte] = useState("Rodoviário");
  const [placa, setPlaca] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [atestados, setAtestados] = useState([{ id: uid(), tipo: "", arquivo: "" }]);

  // Lógica de Cascata - Procedência
  const [respProc, setRespProc] = useState("");
  const [estabProc, setEstabProc] = useState("");
  const [exploracaoProc, setExploracaoProc] = useState("");
  const [nucleoProc, setNucleoProc] = useState("");

  // Lógica - Destino
  const [respDest, setRespDest] = useState("");

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="emissao-ata" hideSearch />
      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        
        <div>
          <button type="button" onClick={() => onNavigate("emissao-ata")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70 font-semibold" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Todas as ATAs
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">{isEdicao ? "Editar ATA" : "Emitir Nova ATA"}</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">
              Gravar ATA
            </button>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios e deverão ser preenchidos.
          </p>
        </div>

        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EntitySearchInput
              label="Espécie" placeholder="Buscar Espécie..." required value={especie}
              data={ESPECIES_MOCK} columns={[{ label: "Espécie", key: "nome" }]} searchKeys={["nome"]}
              onChange={(e) => setEspecie(e.nome)} icon={<FileText size={18} className="text-[#1A7A3C]" />}
            />
            <EntitySearchInput
              label="Finalidade de Transferência" placeholder="Buscar Finalidade..." required value={finalidade}
              data={FINALIDADES_MOCK} columns={[{ label: "Finalidade", key: "nome" }]} searchKeys={["nome"]}
              onChange={(e) => setFinalidade(e.nome)} icon={<FileText size={18} className="text-[#1A7A3C]" />}
            />
          </div>
        </Section>

        <Section title="Informações da Procedência">
          <div className="flex flex-col gap-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <FloatInput label="Tipo de Procedência" value="Estabelecimento Agropecuário" disabled />
            </div>

            {/* Início da cascata com os componentes especialistas */}
            <ProdutorInput 
              value={respProc} 
              required
              onChange={(e) => { setRespProc(e.nome); setEstabProc(""); setExploracaoProc(""); setNucleoProc(""); }} 
            />
            
            {respProc && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn">
                <EstabelecimentoAgropecuarioInput 
                  value={estabProc} 
                  required
                  onChange={(e) => { setEstabProc(e.nome); setExploracaoProc(""); setNucleoProc(""); }} 
                />
              </div>
            )}

            {estabProc && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn flex flex-col gap-4">
                <ExploracaoPecuariaInput 
                  value={exploracaoProc} 
                  required
                  onChange={(e) => { setExploracaoProc(e.codigo); setNucleoProc(""); }} 
                />
                
                {/* Tabela Readonly que aparece após estabelecimento */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-2">
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">Situação do Estabelecimento</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <FloatInput label="Estado" value="Suspenso" disabled />
                    <FloatInput label="Data de Início" value="01/01/2026" disabled />
                    <FloatInput label="Data de Validade" value="01/08/2027" disabled />
                    <FloatInput label="Status" value="1. Código_S13" disabled />
                    <FloatInput label="Observação" value="Irregularidade em 2025" disabled />
                  </div>
                </div>
              </div>
            )}

            {exploracaoProc && (
              <div className="pt-2 border-t border-gray-100 animate-fadeIn">
                <NucleoInput 
                  value={nucleoProc} 
                  required
                  onChange={(e) => setNucleoProc(e.nome)} 
                />
              </div>
            )}
          </div>
        </Section>

        <Section title="Informações de Destino">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatSelect label="Tipo de Destino" required value="Frigorífico" onChange={()=>{}} options={[{value:"Frigorífico", label:"Frigorífico"}]} disabled />
            </div>

            <DestinatarioInput 
              value={respDest} 
              required
              onChange={(e) => setRespDest(e.nome)} 
            />

            {respDest && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100 animate-fadeIn">
                <FloatInput label="Estabelecimento Agropecuário" value="Frigorífico Sul - Matriz" disabled />
                <FloatInput label="Exploração Pecuária" value="3100203003910002" disabled />
                <FloatInput label="Núcleo de Produção" value="Núcleo Principal" disabled />
              </div>
            )}
          </div>
        </Section>

        <Section title="Informações do Trânsito">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect label="Meio de Transporte" required value={meioTransporte} onChange={setMeioTransporte} options={[{value:"Rodoviário", label:"Rodoviário"}, {value:"Aéreo", label:"Aéreo"}]} />
            {meioTransporte === "Rodoviário" && (
              <FloatInput label="Placa do Veículo" value={placa} onChange={setPlaca} maxLength={7} />
            )}
          </div>
        </Section>

        <Section title="Informações dos Animais">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 font-semibold text-gray-700">Faixa Etária</th>
                  <th className="p-3 font-semibold text-gray-700">Existente</th>
                  <th className="p-3 font-semibold text-gray-700">Machos na ATA</th>
                  <th className="p-3 font-semibold text-gray-700">Fêmeas na ATA</th>
                  <th className="p-3 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-gray-600">De 0 a 12 Meses</td>
                  <td className="p-3 text-gray-600">50</td>
                  <td className="p-3"><input type="number" className="border border-gray-300 rounded p-1.5 w-20 outline-none" defaultValue={5} /></td>
                  <td className="p-3"><input type="number" className="border border-gray-300 rounded p-1.5 w-20 outline-none" defaultValue={5} /></td>
                  <td className="p-3 font-bold text-gray-800">10</td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="p-3 text-right font-bold text-gray-700">Total de Animais na ATA:</td>
                  <td className="p-3 font-bold text-[#1A7A3C] text-lg">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Informações da ATA">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <FloatSelect label="Motivo de Isenção de Taxa" value="" onChange={()=>{}} options={[{value:"1", label:"Doação de animais"}]} />
             <FloatInput label="Valor da ATA" value="R$ 8,56" disabled />
          </div>
        </Section>

        <Section title="Atestados">
          <div className="flex flex-col gap-4">
            <UploadField label="Atestado Sanitário" required fileName="" onSelectFile={()=>{}} />
            <hr className="border-gray-100 my-2" />
            <h4 className="text-sm font-semibold text-gray-700">Atestado de Exames</h4>
            <DynamicListWrapper
              items={atestados} behavior="zero-or-more" variant="plain" addButtonLabel="Adicionar Exame"
              onAddItem={() => setAtestados(p => [...p, { id: uid(), tipo: "", arquivo: "" }])}
              onRemoveItem={(i) => setAtestados(p => p.filter((_, idx) => idx !== i))}
            >
              {(item, index) => (
                <div className="flex items-center gap-4">
                  <div className="flex-1"><FloatSelect label="Tipo de Atestado" value={item.tipo} onChange={(v)=> setAtestados(p=>p.map((a,idx)=>idx===index?{...a, tipo:v}:a))} options={[{value:"Brucelose", label:"Brucelose"}]} required /></div>
                  <div className="flex-1"><UploadField label="Arquivo do Exame" fileName={item.arquivo} onSelectFile={()=>{}} required /></div>
                </div>
              )}
            </DynamicListWrapper>
          </div>
        </Section>

        <Section title="Observações">
          <LargeTextArea label="Observações" value={observacoes} onChange={setObservacoes} required />
        </Section>
      </main>

      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">ATA Gravada com Sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">A guia foi salva e está pronta para emissão.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("emissao-ata"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50 transition">Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}