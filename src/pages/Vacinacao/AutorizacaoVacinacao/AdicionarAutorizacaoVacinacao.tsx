import { useState } from "react";
import {
  ArrowLeft,
  Dna,
  Syringe,
  CalendarClock,
  CheckCircle2, Info
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, SearchModal, LargeTextArea } from "../../../components/ui/FormKit";
import { EntitySearchInput, ProdutorInput, EstabelecimentoAgropecuarioInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";
const MOCK_KEY = "AUTORIZACOES_VACINA_DB";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// ==========================================================
interface ProdutorEntidade {
  id: number;
  nome: string;
  documento: string;
  tipo: "PF" | "PJ";
}

const PRODUTORES_MOCK: ProdutorEntidade[] = [
  { id: 1, nome: "José Aarão Neto", documento: "555.009.956-40", tipo: "PF" },
  { id: 2, nome: "Divino de Souza Sobrinho", documento: "444.009.956-40", tipo: "PF" },
  { id: 3, nome: "Agropecuária Vale Verde Ltda.", documento: "56.338.814/0001-95", tipo: "PJ" },
];

const ESTABELECIMENTOS_MOCK = [
  { id: 1, produtorId: 1, codigo: "31234567891", nome: "Fazenda do Rio", municipio: "Lavras - MG", proprietario: "555.009.956-40\n- José Aarão Neto" },
  { id: 2, produtorId: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", proprietario: "444.009.956-40\n- Divino de Souza Sobrinho" },
  { id: 3, produtorId: 3, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG", proprietario: "56.338.814/0001-95\n- Agropecuária Vale Verde Ltda." },
];

const ESPECIES_MOCK = [
  { id: 1, estabId: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, estabId: 1, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, estabId: 2, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 4, estabId: 3, codigo: "ESP-003", nome: "Caprino", grupo: "Caprinos" },
];

const DOENCAS_MOCK = [
  { id: 1, especieNome: "Bovino", nome: "Brucelose" },
  { id: 2, especieNome: "Bovino", nome: "Febre Aftosa" },
  { id: 3, especieNome: "Bubalino", nome: "Febre Aftosa" },
  { id: 4, especieNome: "Caprino", nome: "Raiva" },
];

const ETAPAS_MOCK = [
  { id: 1, doencaNome: "Brucelose", nome: "2026/01" },
  { id: 2, doencaNome: "Brucelose", nome: "2026/02" },
  { id: 3, doencaNome: "Febre Aftosa", nome: "2026/01" },
  { id: 4, doencaNome: "Raiva", nome: "2026/02" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

export function AdicionarAutorizacaoVacinacaoPage({ onLogout, onNavigate }: any) {
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [especie, setEspecie] = useState<any | null>(null);
  const [doenca, setDoenca] = useState<any | null>(null);
  const [etapa, setEtapa] = useState<any | null>(null);
  const [quantidadeDoses, setQuantidadeDoses] = useState("");
  const [observacaoResidencia, setObservacaoResidencia] = useState("");
  const [idSalvo, setIdSalvo] = useState<number | null>(null);

  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const databaseProdutor = PRODUTORES_MOCK.filter((p) => !tipoPessoa ? true : p.tipo === tipoPessoa);
  const estabelecimentosFiltrados = produtor ? ESTABELECIMENTOS_MOCK.filter((e) => e.produtorId === produtor.id) : [];
  const especiesFiltradas = estabelecimento ? ESPECIES_MOCK.filter((e) => e.estabId === estabelecimento.id) : [];
  const doencasFiltradas = especie ? DOENCAS_MOCK.filter((d) => d.especieNome === especie.nome) : [];
  const etapasFiltradas = doenca ? ETAPAS_MOCK.filter((et) => et.doencaNome === doenca.nome) : [];

  const onChangeProdutor = (ent: any) => { setProdutor(ent); setEstabelecimento(null); setEspecie(null); setDoenca(null); setEtapa(null); };
  const onChangeEstabelecimento = (ent: any) => { setEstabelecimento(ent); setEspecie(null); setDoenca(null); setEtapa(null); };
  const onChangeEspecie = (ent: any) => { setEspecie(ent); setDoenca(null); setEtapa(null); };
  const onChangeDoenca = (ent: any) => { setDoenca(ent); setEtapa(null); };

  const err = (cond: boolean, customMessage?: string) => (tentouSalvar && cond ? (customMessage || "Campo obrigatório.") : undefined);

  const formValido = !!produtor && !!estabelecimento && !!especie && !!doenca && !!etapa && quantidadeDoses.trim() !== "";

  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;

    // 1. Recupera o que tem na base
    const stored = localStorage.getItem(MOCK_KEY);
    const db = stored ? JSON.parse(stored) : [];
    const novoId = Date.now();

    // 2. Monta o objeto pra inserir na listagem e na visualização
    const novoRegistro = {
      id: novoId,
      produtorNome: produtor.nome,
      produtorDoc: produtor.documento,
      estabCodigo: estabelecimento.codigo,
      estabNome: estabelecimento.nome,
      especie: especie.nome,
      doenca: doenca.nome,
      tipoVacina: "Oficial", // Assumindo default para Mock
      etapa: etapa.nome,
      dataAutorizacao: new Date().toISOString().split("T")[0],
      quantidadeDoses: quantidadeDoses,
      justificativa: observacaoResidencia,
      situacao: "Gravada"
    };

    // 3. Salva no localStorage
    db.push(novoRegistro);
    localStorage.setItem(MOCK_KEY, JSON.stringify(db));
    
    // 4. Grava o ID pra caso a pessoa clique em "Visualizar" no modal de sucesso
    localStorage.setItem("CURRENT_AUTORIZACAO_ID", novoId.toString());
    setIdSalvo(novoId);
    setSucesso(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="autorizacao-vacina" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <button onClick={() => onNavigate("autorizacao-vacinacao")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} /> Inicial
          </button>
         
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Autorização de Vacina</h1>
            <button type="button" onClick={handleSalvar} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
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
        
        <SectionCard title="Informações Básicas">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="col-span-full">
              <ProdutorInput value={produtor ? produtor.nome : ""} required onChange={onChangeProdutor} error={err(!produtor)} />
            </div>

            {produtor && (
              <div className="col-span-full">
                <EstabelecimentoAgropecuarioInput value={estabelecimento ? estabelecimento.nome : ""} required data={estabelecimentosFiltrados} onChange={onChangeEstabelecimento} error={err(!estabelecimento)} />
              </div>
            )}

            {estabelecimento && (
              <EntitySearchInput label="Espécie" required disabled={!estabelecimento} placeholder="Buscar por nome" value={especie ? especie.nome : ""} data={especiesFiltradas} searchKeys={["nome", "grupo"]} columns={[{ label: "Espécie", key: "nome" }]} icon={<Dna size={18} color={GREEN} />} title="Buscar Espécie" onChange={onChangeEspecie} error={err(!especie)} />
            )}

            {especie && (
              <EntitySearchInput label="Doença" required disabled={!especie} placeholder="Buscar por doença" value={doenca ? doenca.nome : ""} data={doencasFiltradas} searchKeys={["nome"]} columns={[{ label: "Doença", key: "nome" }]} icon={<Syringe size={18} color={GREEN} />} title="Buscar Doença" onChange={onChangeDoenca} error={err(!doenca)} />
            )}

            {doenca && (
              <EntitySearchInput label="Etapa de Vacinação" required disabled={!doenca} placeholder="Buscar por etapa" value={etapa ? etapa.nome : ""} data={etapasFiltradas} searchKeys={["nome"]} columns={[{ label: "Etapa", key: "nome" }]} icon={<CalendarClock size={18} color={GREEN} />} title="Buscar Etapa" onChange={(ent) => setEtapa(ent)} error={err(!etapa)} />
            )}

            <FloatInput label="Quantidade de Doses" required inputMode="numeric" maxLength={10} value={quantidadeDoses} onChange={(v: string) => setQuantidadeDoses(v.replace(/\D/g, ""))} error={err(quantidadeDoses.trim() === "")} />

            <div className="col-span-full">
              <LargeTextArea label="Justificativa" value={observacaoResidencia} onChange={setObservacaoResidencia} required />
            </div>
          </div>
        </SectionCard>
      </main>

      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => { setModalProdutor(false); setTipoPessoa(""); }}
        title="Buscar Produtor"
        subtitle="Busque por um produtor cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />}
        data={databaseProdutor}
        columns={[{ label: "Nome", key: "nome" }, { label: "Documento", key: "documento" }]}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => { onChangeProdutor(p); setModalProdutor(false); setTipoPessoa(""); }}
        headerActions={<FloatSelect label="Tipo de Pessoa" required value={tipoPessoa} onChange={(v) => setTipoPessoa(v)} options={[{ value: "PF", label: "Pessoa Física" }, { value: "PJ", label: "Pessoa Jurídica" }]} />}
      />

      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: GREEN }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Autorização de Vacina adicionada!</h3>
            <p className="text-sm text-gray-500 mb-6">A autorização de vacina foi cadastrada e gravada no sistema.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => onNavigate("autorizacao-vacina")} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 transition hover:bg-gray-50">Voltar</button>
              <button
                onClick={() => onNavigate("visualizar-autorizacao-vacinacao", { id: idSalvo })}
                className="px-5 py-2.5 rounded-md text-white text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
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

export default AdicionarAutorizacaoVacinacaoPage;