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
import { EntitySearchInput, ProdutorInput, EstabelecimentoAgropecuarioInput, ExploracaoPecuariaInput } from "../../../components/ui/EntitySearch";
import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS DE ENTIDADE (substituir por API)
// A cascata da USV09 (AC3) filtra cada nível pelo anterior:
//   Produtor → Estabelecimento → Espécie → Doença → Etapa
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

// estabelecimentos onde o produtor tem vínculo de produção (filtra por produtorId)
const ESTABELECIMENTOS_MOCK = [
  { id: 1, produtorId: 1, codigo: "31234567891", nome: "Fazenda do Rio", municipio: "Lavras - MG", proprietario: "555.009.956-40\n- José Aarão Neto" },
  { id: 2, produtorId: 2, codigo: "31001040005", nome: "Fazenda Rio Preto", municipio: "Lavras - MG", proprietario: "444.009.956-40\n- Divino de Souza Sobrinho" },
  { id: 3, produtorId: 3, codigo: "42001040005", nome: "Fazenda Vertentes", municipio: "Varginha - MG", proprietario: "56.338.814/0001-95\n- Agropecuária Vale Verde Ltda." },
];

// espécies com exploração pecuária ativa no estabelecimento (filtra por estabId)
const ESPECIES_MOCK = [
  { id: 1, estabId: 1, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 2, estabId: 1, codigo: "ESP-002", nome: "Bubalino", grupo: "Bovídeos" },
  { id: 3, estabId: 2, codigo: "ESP-001", nome: "Bovino", grupo: "Bovídeos" },
  { id: 4, estabId: 3, codigo: "ESP-003", nome: "Caprino", grupo: "Caprinos" },
];

// doenças a que a espécie é suscetível (filtra por especieNome)
const DOENCAS_MOCK = [
  { id: 1, especieNome: "Bovino", nome: "Brucelose" },
  { id: 2, especieNome: "Bovino", nome: "Febre Aftosa" },
  { id: 3, especieNome: "Bubalino", nome: "Febre Aftosa" },
  { id: 4, especieNome: "Caprino", nome: "Raiva" },
];

// etapas de vacinação que possuem a doença (filtra por doencaNome)
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

interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarAutorizacaoVacinacaoPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas (AC3) ----
  const [produtor, setProdutor] = useState<any | null>(null);
  const [estabelecimento, setEstabelecimento] = useState<any | null>(null);
  const [exploracao, setExploracao] = useState<any | null>(null);
  const [nucleo, setNucleo] = useState<any | null>(null);
  const [especie, setEspecie] = useState<any | null>(null);
  const [doenca, setDoenca] = useState<any | null>(null);
  const [etapa, setEtapa] = useState<any | null>(null);
  const [quantidadeDoses, setQuantidadeDoses] = useState("");
   const [observacaoResidencia, setObservacaoResidencia] = useState("");


  // ---- Modal do Produtor (seleção PF/PJ) ----
  const [modalProdutor, setModalProdutor] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("");

  // ---- Controle de submit/sucesso ----
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // ==========================================================
  // CASCATA — cada nível só habilita quando o anterior está preenchido
  // e suas opções são filtradas pelo nível anterior (AC3)
  // ==========================================================
  const databaseProdutor = PRODUTORES_MOCK.filter((p) =>
    !tipoPessoa ? true : p.tipo === tipoPessoa
  );

  const estabelecimentosFiltrados = produtor
    ? ESTABELECIMENTOS_MOCK.filter((e) => e.produtorId === produtor.id)
    : [];

  const especiesFiltradas = estabelecimento
    ? ESPECIES_MOCK.filter((e) => e.estabId === estabelecimento.id)
    : [];

  const doencasFiltradas = especie
    ? DOENCAS_MOCK.filter((d) => d.especieNome === especie.nome)
    : [];

  const etapasFiltradas = doenca
    ? ETAPAS_MOCK.filter((et) => et.doencaNome === doenca.nome)
    : [];

  // limpa os níveis seguintes ao trocar um nível anterior
  const onChangeProdutor = (ent: any) => {
    setProdutor(ent);
    setEstabelecimento(null);
    setEspecie(null);
    setDoenca(null);
    setEtapa(null);
  };
  const onChangeEstabelecimento = (ent: any) => {
    setEstabelecimento(ent);
    setEspecie(null);
    setDoenca(null);
    setEtapa(null);
  };
  const onChangeEspecie = (ent: any) => {
    setEspecie(ent);
    setDoenca(null);
    setEtapa(null);
  };
  const onChangeDoenca = (ent: any) => {
    setDoenca(ent);
    setEtapa(null);
  };

  // ==========================================================
  // FUNÇÃO HELPER DE ERRO (Faltava declarar esta função)
  // ==========================================================
  const err = (cond: boolean, customMessage?: string) => 
    (tentouSalvar && cond ? (customMessage || "Campo obrigatório.") : undefined);

  // ==========================================================
  // VALIDAÇÃO — todos obrigatórios (AC3)
  // ==========================================================
  const formValido =
    !!produtor &&
    !!estabelecimento &&
    !!especie &&
    !!doenca &&
    !!etapa &&
    quantidadeDoses.trim() !== "";



  const handleSalvar = () => {
    setTentouSalvar(true);
    if (!formValido) return;
    // TODO: chamada de API. Por ora, exibe o card de sucesso.
    setSucesso(true);
  };

  const colunasModalProdutor = [
    { label: "Nome", key: "nome" },
    { label: "Documento", key: "documento" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f3f5] pb-24">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="autorizacao-vacina" hideSearch />

      <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6">
        {/* Topo da Página */}
        <div className="mb-4">
          <button onClick={() => onNavigate("autorizacao-vacina")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Inicial
          </button>
         
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Autorização de Vacina</h1>
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
        
<SectionCard title="Informações Básicas">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
    
    {/* 1. Produtor — Sempre Visível */}
    <div className="col-span-full">
      <ProdutorInput
        value={produtor ? produtor.nome : ""}
        required
        onChange={onChangeProdutor}
        error={err(!produtor)}
        onEyeClick={() => {
          if (produtor?.id) alert(`Visualizar detalhes do produtor ID: ${produtor.id}`);
          else alert("Por favor, selecione um produtor primeiro.");
        }}
      />
    </div>

    {/* 2. Estabelecimento Agropecuário — Só aparece se houver Produtor */}
    {produtor && (
      <div className="col-span-full">
        <EstabelecimentoAgropecuarioInput
          value={estabelecimento ? estabelecimento.nome : ""}
          required
          data={estabelecimentosFiltrados}
          onChange={onChangeEstabelecimento}
          error={err(!estabelecimento)}
          onEyeClick={() => {
            if (estabelecimento?.codigo) alert(`Visualizar detalhes: ${estabelecimento.codigo}`);
            else alert("Por favor, selecione um estabelecimento primeiro.");
          }}
        />
      </div>
    )}

    {/* 3. Espécie — Só aparece se houver Estabelecimento */}
    {estabelecimento && (
      <EntitySearchInput
        label="Espécie"
        required
        disabled={!estabelecimento}
        placeholder="Buscar por nome da espécie"
        value={especie ? especie.nome : ""}
        data={especiesFiltradas}
        searchKeys={["nome", "grupo"]}
        columns={[
          { label: "Espécie", key: "nome" },
          { label: "Grupo", key: "grupo" },
        ]}
        icon={<Dna size={18} color={GREEN} />}
        title="Buscar Espécie"
        subtitle="Busque por uma espécie cadastrada:"
        onChange={onChangeEspecie}
        error={tentouSalvar && !especie ? "Campo obrigatório." : undefined}
      />
    )}

    {/* 4. Doença — Só aparece se houver Espécie */}
    {especie && (
      <EntitySearchInput
        label="Doença"
        required
        disabled={!especie}
        placeholder="Buscar por doença"
        value={doenca ? doenca.nome : ""}
        data={doencasFiltradas}
        searchKeys={["nome"]}
        columns={[{ label: "Doença", key: "nome" }]}
        icon={<Syringe size={18} color={GREEN} />}
        title="Buscar Doença"
        subtitle="Busque por uma doença cadastrada:"
        onChange={onChangeDoenca}
        error={tentouSalvar && !doenca ? "Campo obrigatório." : undefined}
      />
    )}

    {/* 5. Etapa de Vacinação — Só aparece se houver Doença */}
    {doenca && (
      <EntitySearchInput
        label="Etapa de Vacinação"
        required
        disabled={!doenca}
        placeholder="Buscar por etapa de vacinação"
        value={etapa ? etapa.nome : ""}
        data={etapasFiltradas}
        searchKeys={["nome"]}
        columns={[{ label: "Etapa", key: "nome" }]}
        icon={<CalendarClock size={18} color={GREEN} />}
        title="Buscar Etapa de Vacinação"
        subtitle="Busque por uma etapa cadastrada:"
        onChange={(ent) => setEtapa(ent)}
        error={tentouSalvar && !etapa ? "Campo obrigatório." : undefined}
      />
    )}

    {/* 6. Quantidade de Doses — Só aparece se houver Etapa selecionada */}
   
    <FloatInput
  label="Quantidade de Doses"
  required
  inputMode="numeric"
  maxLength={10}
  value={quantidadeDoses}
  onChange={(v: string) => setQuantidadeDoses(v.replace(/\D/g, ""))}
  error={tentouSalvar && quantidadeDoses.trim() === "" ? "Campo obrigatório." : undefined}
/>

<div className="col-span-full">
  <LargeTextArea
    label="Justificativa"
    value={observacaoResidencia}
    onChange={setObservacaoResidencia}
     required

  />
</div>
   

  </div>
</SectionCard>

     

      </main>

      

      {/* ============ MODAL DO PRODUTOR ============ */}
      <SearchModal<ProdutorEntidade>
        open={modalProdutor}
        onClose={() => { setModalProdutor(false); setTipoPessoa(""); }}
        title="Buscar Produtor"
        subtitle="Busque por um produtor cadastrado no sistema:"
        icon={<img src={Icons.iconeProdutorUrl} alt="Produtor" className="w-8 h-8 object-contain" />}
        data={databaseProdutor}
        columns={colunasModalProdutor}
        searchKeys={["nome", "documento"]}
        searchPlaceholder="Buscar Produtor"
        confirmLabel="Confirmar"
        onConfirm={(p) => { onChangeProdutor(p); setModalProdutor(false); setTipoPessoa(""); }}
        headerActions={
          <FloatSelect
            label="Tipo de Pessoa"
            required
            value={tipoPessoa}
            onChange={(v) => setTipoPessoa(v)}
            options={[
              { value: "PF", label: "Pessoa Física" },
              { value: "PJ", label: "Pessoa Jurídica" },
            ]}
          />
        }
      />

      {/* ============ CARD DE SUCESSO (padrão Estabelecimento) ============ */}
      {sucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: GREEN }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Autorização de Vacina adicionada com sucesso!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              A autorização de vacina foi cadastrada e gravada no sistema.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate("autorizacao-vacina")}
                className="px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 transition hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => onNavigate("visualizar-autorizacao-vacina", {
                  produtorNome: produtor?.nome,
                  produtorDoc: produtor?.documento,
                  estabCodigo: estabelecimento?.codigo,
                  estabNome: estabelecimento?.nome,
                  especie: especie?.nome,
                  doenca: doenca?.nome,
                  etapa: etapa?.nome,
                  quantidadeDoses,
                  situacao: "Gravada",
                })}
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