import React, { useState, useEffect } from "react";
import {
  ArrowLeft, ChevronUp, ChevronDown, Info, Check, Trash2, PlusCircle, Download,
  MapPin,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import {
  FloatInput, FloatSelect, UploadField, LargeTextArea, SimNao,
} from "../../../components/ui/FormKit";
import {
  DynamicListWrapper, ProprietarioInput, EstabelecimentoAgropecuarioInput,
  BlocoEnderecoFields, BlocoContatoFields,
} from "../../../components/ui/EntitySearch";

const GREEN = "#1A7A3C";

// ==========================================================
// LISTAS (US056 - AC1)
// ==========================================================
const TIPOS_ESTABELECIMENTO = [
  { value: "Parque de exposição", label: "Parque de exposição" },
  { value: "Tatersal para leilões", label: "Tatersal para leilões" },
  { value: "Estrutura temporária", label: "Estrutura temporária" },
  { value: "Outro", label: "Outro" },
];

const UNIDADES_AREA = [
  { value: "Metros Quadrados", label: "Metros Quadrados" },
  { value: "Hectares", label: "Hectares" },
];

const FORMATOS_GEO = [
  { value: "DMS (graus, minutos, segundos)", label: "DMS (graus, minutos, segundos)" },
  { value: "DD (decimal)", label: "DD (decimal)" },
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

const mascaraDecimal = (v: string) => {
  const num = v.replace(/\D/g, "").slice(0, 12);
  if (!num) return "";
  const int = num.slice(0, -2) || "0";
  const dec = num.slice(-2).padStart(2, "0");
  return `${parseInt(int, 10).toLocaleString("pt-BR")},${dec}`;
};

// ==========================================================
// PÁGINA PRINCIPAL
// ==========================================================
interface PageProps {
  onLogout: () => void;
  onNavigate: (screen: any, data?: any) => void;
}

export function AdicionarEstabelecimentoEventoPecuarioPage({ onLogout, onNavigate }: PageProps) {
  // ---- Informações Básicas ----
  const [nomeComercial, setNomeComercial] = useState("");
  const [tipo, setTipo] = useState("");
  const [nomeTipo, setNomeTipo] = useState("");

  // ---- Outras Informações ----
  const [unidadeArea, setUnidadeArea] = useState("Hectares");
  const [areaAlojamento, setAreaAlojamento] = useState("");
  const [capacidadeBovideos, setCapacidadeBovideos] = useState("");
  const [aptoDescanso, setAptoDescanso] = useState<boolean | "">("");

  // ---- Proprietários ----
  const [proprietarios, setProprietarios] = useState<any[]>([{ uid: uid("prop"), proprietario: null }]);

  // ---- Estabelecimento Agropecuário (zero ou um) ----
  const [localizadoEmEstab, setLocalizadoEmEstab] = useState<boolean | "">("");
  const [estabAgropecuario, setEstabAgropecuario] = useState<any | null>(null);

  // ---- Localização ----
  const [endereco, setEndereco] = useState<any>({
    zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
    endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
    latitude: "", longitude: "",
  });

  // ---- Geolocalização ----
  const [mesmaGeoEstab, setMesmaGeoEstab] = useState<boolean | "">("");
  const [formatoGeo, setFormatoGeo] = useState("DD (decimal)");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // ---- Contatos ----
  const [contato, setContato] = useState<any>({
    utilizarContatoProprietario: "Não", proprietariosSelecionados: [],
    emailFixo: "", emailFixoObs: "", telefoneFixo: "", telefoneFixoObs: "", contatosAdicionais: [],
  });

  // ---- Anexos e Observação ----
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");
  const [isSucesso, setIsSucesso] = useState(false);

  // ==========================================================
  // DERIVADOS / CONDICIONAIS E EFEITOS DE MOCK
  // ==========================================================
  const isTipoOutro = tipo === "Outro";
  const isLocalizadoEmEstab = localizadoEmEstab === true;
  const enderecoSomenteLeitura = isLocalizadoEmEstab;
  const geoSomenteLeitura = mesmaGeoEstab === true;

  // Efeito 1: Alimenta o bloco de endereço caso seja informado vínculo com o IMA
  useEffect(() => {
    if (enderecoSomenteLeitura) {
      setEndereco({
        zona: "Rural",
        cep: "",
        estado: "Minas Gerais",
        municipio: "Lavras",
        bairro: "",
        endereco: "Fazenda Experimental IMA, KM 12",
        numero: "S/N",
        complemento: "Gleba A",
        localidade: "Zona Rural",
        distrito: "Lavras",
        latitude: "-19.165827",
        longitude: "-44.362871"
      });
    } else {
      // Limpa os campos herdados caso desmarque a opção
      setEndereco({
        zona: "", cep: "", estado: "Minas Gerais", municipio: "", bairro: "",
        endereco: "", numero: "", complemento: "", localidade: "", distrito: "",
        latitude: "", longitude: "",
      });
    }
  }, [enderecoSomenteLeitura]);

  // Efeito 2: Alimenta os inputs da Geolocalização caso repita a mesma do estabelecimento
  useEffect(() => {
    if (mesmaGeoEstab === true) {
      setFormatoGeo("DD (decimal)");
      setLatitude("-19.165827");
      setLongitude("-44.362871");
    } else if (mesmaGeoEstab === false) {
      setLatitude("");
      setLongitude("");
    }
  }, [mesmaGeoEstab]);

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-recinto-eventos" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-4">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("estabelecimento-recinto-eventos")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos os Estabelecimentos/Recintos de Eventos Pecuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Estabelecimento/Recinto de Eventos Pecuários</h1>
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
          <div className="flex flex-col gap-4">
            <FloatInput label="Nome Comercial do Estabelecimento/Recinto" required value={nomeComercial} onChange={setNomeComercial} maxLength={255} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FloatSelect label="Tipo de Estabelecimento/Recinto" required value={tipo} onChange={(v) => { setTipo(v); if (v !== "Outro") setNomeTipo(""); }} options={TIPOS_ESTABELECIMENTO} />
              {isTipoOutro && (
                <FloatInput label="Nome do Tipo de Estabelecimento/Recinto" required value={nomeTipo} onChange={setNomeTipo} maxLength={255} />
              )}
            </div>
            
            <hr className="border-gray-100 my-2" />
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Outras Informações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <FloatSelect label="Unidade de Medida das Áreas" required value={unidadeArea} onChange={setUnidadeArea} options={UNIDADES_AREA} />
              <FloatInput label="Área para Alojamento dos Animais" value={areaAlojamento} onChange={(v) => setAreaAlojamento(mascaraDecimal(v))} placeholder="0,00" />
              <FloatInput label="Capacidade de Lotação para Bovídeos" value={capacidadeBovideos} onChange={(v) => setCapacidadeBovideos(mascaraDecimal(v))} placeholder="0,00" />
            </div>
            
            <div className="mt-4">
              <SimNao label="Apto ao Recebimento de Animais para Descanso?" name="apto-descanso" required value={aptoDescanso} onChange={setAptoDescanso} />
            </div>
          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), entidade: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter
          >
            {(item: any, index: number) => (
              <ProprietarioInput
                label="Proprietário"
                required
                value={item.entidade ? item.entidade.nome : ""}
                onChange={(ent: any) => setProprietarios((prev) => prev.map((p, i) => (i === index ? { ...p, entidade: ent } : p)))}
                onEyeClick={() => item.entidade && onNavigate("visualizar-pessoa", item.entidade)}
              />
            )}
          </DynamicListWrapper>
        </Section>

        {/* 4. Estabelecimento Agropecuário */}
        <Section title="Estabelecimento Agropecuário">
          <div className="flex flex-col gap-4">
            <SimNao
              label="Estabelecimento Agroindustrial Localizado em um Estabelecimento Agropecuário Cadastrado no IMA?"
              name="localizado-estab"
              required
              value={localizadoEmEstab}
              onChange={(v) => {
                setLocalizadoEmEstab(v);
                if (v !== true) { setEstabAgropecuario(null); setMesmaGeoEstab(""); }
              }}
            />
            {isLocalizadoEmEstab && (
              <EstabelecimentoAgropecuarioInput
                value={estabAgropecuario ? estabAgropecuario.nome : ""}
                required
                onChange={(ent) => setEstabAgropecuario(ent)}
                onEyeClick={() => estabAgropecuario && onNavigate("visualizar-estabelecimento-agropecuario", estabAgropecuario)}
              />
            )}
          </div>
        </Section>

       {/* 5. Informações de Localização */}
<Section title="Informações de Localização">
 
  <div>
    <BlocoEnderecoFields
      title="Endereço"
      data={endereco}
      tipoEstado={enderecoSomenteLeitura ? "travado" : "normal"}
      onChange={(key, value) => setEndereco((prev: any) => ({ ...prev, [key]: value }))}
      onSetMultipleFields={(fields) => setEndereco((prev: any) => ({ ...prev, ...fields }))}
    />
    {/* REMOVIDO DAQUI: A película absoluta foi retirada para não travar a pergunta */}
  </div>
</Section>


        {/* 7. Informações de Contato */}
        <Section title="Informações de Contato">
          <BlocoContatoFields
            data={contato}
            onChange={(updated) => setContato((prev: any) => ({ ...prev, ...updated }))}
            proprietariosDisponiveis={proprietarios
              .filter((p) => p.entidade)
              .map((p) => ({ id: p.uid, nome: p.entidade.nome, cpf: p.entidade.documento }))}
          />
        </Section>

        {/* 8. Anexos */}
        <Section title="Anexos">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">{index + 1}</div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">
                    <UploadField label="Documento" required fileName={anexo.nome} onSelectFile={() => setAnexos((prev) => prev.map((a, i) => i === index ? { ...a, nome: `documento_${index + 1}.pdf` } : a))} />
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput label="Descrição" value={anexo.descricao || ""} placeholder="Descrição opcional..." onChange={(v) => setAnexos((prev) => prev.map((a, i) => i === index ? { ...a, descricao: v.slice(0, 255) } : a))} maxLength={255} />
                        </div>
                        <div className="h-12 flex items-center">
                          <button type="button" onClick={() => onNavigate("baixar-documento", anexo)} className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition" title="Baixar documento"><Download size={20} /></button>
                        </div>
                      </>
                    )}
                    <div className="h-12 flex items-center">
                      <button type="button" onClick={() => setAnexos((prev) => prev.filter((a) => a.id !== anexo.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Remover anexo"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setAnexos((prev) => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition">
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

        {/* 9. Observações */}
        <Section title="Observações">
          <LargeTextArea label="Observação" value={observacao} onChange={setObservacao} maxLength={1500} hasTooltip tooltipText="Informações adicionais pertinentes ao cadastro." />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Estabelecimento/Recinto cadastrado com sucesso!</h3>
            <p className="text-sm text-gray-500 mt-1">{nomeComercial ? `"${nomeComercial}"` : "O estabelecimento/recinto"} foi cadastrado.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { setIsSucesso(false); onNavigate("estabelecimento-recinto-eventos"); }} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => { setIsSucesso(false); onNavigate("visualizar-estabelecimento-recinto-eventos"); }} className="px-5 h-11 rounded-md bg-[#1A7A3C] hover:bg-[#15612F] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}