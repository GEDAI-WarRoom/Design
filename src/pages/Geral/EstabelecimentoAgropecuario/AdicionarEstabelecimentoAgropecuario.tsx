import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Info, Check, MapPin, Map, X, PlusCircle, Trash2, FileText, Upload
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { FloatInput, FloatSelect, FloatCombobox, SimNao, LargeTextArea, UploadField} from "../../../components/ui/FormKit";
import { ProprietarioInput, DynamicListWrapper, BlocoEnderecoFields, BlocoContatoFields, SelectedChipsContainer, } from "../../../components/ui/EntitySearch";

import * as Icons from "../../../imports/icons";

const GREEN = "#1A7A3C";

// ==========================================================
// MOCKS E CONSTANTES (US050)
// ==========================================================
const TIPOS_ESTAB = [
  "Apartamento", "Assentamento", "Casa", "Centro de Treinamento", "Chácara", 
  "Clínica Veterinária", "Condomínio", "Distribuidora", "Estância", "Fazenda", 
  "Galpão", "Gleba", "Haras", "Hípica", "Hospital Veterinário", 
  "Instituição de Ensino", "Lote", "Parque de Exposições", "Rancho", 
  "Residência", "Sítio", "Terreno"
].map(t => ({ value: t, label: t }));

const ESTADOS_MOCK = ["Minas Gerais", "São Paulo", "Rio de Janeiro"];
const MUNICIPIOS_MOCK = ["Lavras", "Belo Horizonte", "Abaeté", "Passos", "Uberlândia"];

// FUNÇÕES AUXILIARES OBRIGATÓRIAS
const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// DEFINIÇÃO DA INTERFACE PARA O ESTADO DE PROPRIETÁRIOS
interface ProprietarioFormItem {
  uid: string;
  proprietario: {
    id: number;
    tipoPessoa: string;
    nome: string;
    documento: string;
  } | null;
}

// ==========================================================
// HELPERS DE UI
// ==========================================================
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition">
        <span className="text-base font-semibold text-gray-800">{title}</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
}

function SubGrupo({ titulo, children, comDivisor = false }: { titulo: string; children: React.ReactNode; comDivisor?: boolean }) {
  return (
    <>
      {comDivisor && <hr className="border-gray-100" />}
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-gray-700">{titulo}</span>
        {children}
      </div>
    </>
  );
}

// ==========================================================
// PÁGINA: ADICIONAR ESTABELECIMENTO AGROPECUÁRIO
// ==========================================================
export function AdicionarEstabelecimentoAgropecuarioPage({ onLogout, onNavigate }: any) {
  // --- Estados do Formulário ---
  const [tipo, setTipo] = useState("");
  const [nome, setNome] = useState("");
  const [provisorio, setProvisorio] = useState("Não");
  const [zona, setZona] = useState("Rural");
  const [unidadeMedida, setUnidadeMedida] = useState("Hectares");
const [areaTotal, setAreaTotal] = useState("");
const [areaProdutiva, setAreaProdutiva] = useState("");
const [numeroCar, setNumeroCar] = useState("");
const [confrontantes, setConfrontantes] = useState("");
const [viasAcesso, setViasAcesso] = useState("");

  // Localização
  const [estado, setEstado] = useState("Minas Gerais");
  const [municipio, setMunicipio] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState<any>({
    zona: "Rural",
    estado: "Minas Gerais",
    cep: "",
    municipio: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    localidade: "",
    distrito: "",
    latitude: "",
    longitude: ""
  });

  // Listas Dinâmicas Corretamente Tipadas
  const [proprietarios, setProprietarios] = useState<ProprietarioFormItem[]>([
    { uid: uid("prop"), proprietario: null }
  ]);


  // UI
  const [isSucesso, setIsSucesso] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

   // Anexos (zero ou mais) e Observações
  const [anexos, setAnexos] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  // --- Regra de Negócio: Nome fixo com o Tipo ---
  useEffect(() => {
    if (tipo && !nome.startsWith(tipo)) {
      setNome(tipo + " ");
    }
  }, [tipo]);

  const handleNomeChange = (val: string) => {
    if (val.startsWith(tipo)) {
      setNome(val);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      <Navbar onLogout={onLogout} onNavigate={onNavigate} currentScreen="estabelecimento-agropecuario" hideSearch />

      <main className="max-w-[1088px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Cabeçalho */}
        <div>
          <button type="button" onClick={() => onNavigate("estabelecimento-agropecuario")} className="flex items-center gap-1 text-sm mb-3 transition hover:opacity-70" style={{ color: GREEN }}>
            <ArrowLeft size={15} />
            Todos Estabelecimentos Agropecuários
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900">Adicionar Estabelecimento Agropecuário</h1>
            <button type="button" onClick={() => setIsSucesso(true)} className="px-5 h-10 bg-[#1A7A3C] hover:bg-[#15612F] text-white text-xs font-bold rounded-md transition shadow-sm">Adicionar</button>
          </div>
        </div>

        {/* Info box */}
        <div className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm flex items-center gap-3">
          <div className="text-gray-500 flex-shrink-0"><Info size={20} className="stroke-[2.5]" /></div>
          <p className="text-sm text-gray-600 font-medium">Campos indicados com <span className="text-red-500 font-bold">*</span> são obrigatórios.</p>
        </div>

        {/* 1. Informações Básicas */}
        <Section title="Informações Básicas">
          <div className="flex flex-col gap-5 overflow-visible pb-10">
            
            {/* Primeira Linha do Formulário */}
            <div className="flex flex-col md:flex-row gap-5 w-full relative z-50">
              <div className="w-full md:w-1/3">
                <FloatSelect 
                  label="Tipo de Estabelecimento" 
                  required 
                  value={tipo} 
                  onChange={setTipo} 
                  options={TIPOS_ESTAB}
                />
              </div>
              
              <div className="flex-1">
                <FloatInput 
                  label="Nome do Estabelecimento Agropecuário" 
                  required 
                  value={nome} 
                  onChange={handleNomeChange} 

                />
              </div>
            </div>
            
            {/* Segunda Linha do Formulário */}
            <div className="flex flex-col md:flex-row gap-5 w-full relative z-40">
              <div className="w-full md:w-1/3">
                <SimNao
                  label="Cadastro Provisório?"
                  required
                  value={provisorio}
                  onChange={setProvisorio}
                />
              </div>
            </div>

          </div>
        </Section>

        {/* 2. Proprietários */}
        <Section title="Proprietários">
          <DynamicListWrapper
            items={proprietarios}
            behavior="at-least-one"
            addButtonLabel="Adicionar Proprietário"
            onAddItem={() => setProprietarios((p) => [...p, { uid: uid("prop"), proprietario: null }])}
            onRemoveItem={(i: number) => setProprietarios((p) => p.filter((_, idx) => idx !== i))}
            variant="plain"
            showCounter={true}
          >
            {(item: ProprietarioFormItem) => (
              <div className="w-full">
                <ProprietarioInput
                  label="Proprietário"
                  required
                  value={item.proprietario ? item.proprietario.nome : ""}
                  onChange={(ent: any) => 
                    setProprietarios((p) => 
                      p.map((x) => (x.uid === item.uid ? { ...x, proprietario: ent } : x))
                    )
                  }
                  onEyeClick={() => onNavigate("visualizar-pessoa", item.proprietario)}
                />
              </div>
            )}
          </DynamicListWrapper>
        </Section>

        
        {/* Informações de Localização */}
        <Section title="Informações de Localização">
          <div className="flex flex-col gap-6">
            <BlocoEnderecoFields
              title="Endereço"
              tipoEstado="normal"
              data={endereco}
              onChange={(key, val) => setEndereco((p) => ({ ...p, [key]: val }))}
              onSetMultipleFields={(fields) => setEndereco((p) => ({ ...p, ...fields }))}
            />
          </div>
        </Section>

        {/* 4. Informações Complementares */}
<Section title="Informações Complementares">
  <div className="flex flex-col gap-6">
    {/* Subgrupo padrão para as Áreas (comum a Urbana e Rural) */}
    <SubGrupo titulo="Áreas">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FloatSelect 
          label="Unidade de Medida das Áreas" 
          required 
          value={unidadeMedida} 
          onChange={setUnidadeMedida} 
          options={[
            { value: "Hectares", label: "Hectares" }, 
            { value: "Metros Quadrados", label: "Metros Quadrados" }
          ]} 
        />
        <FloatInput 
          label="Área Total" 
          required 
          value={areaTotal} 
          onChange={setAreaTotal} 
          placeholder="0,00" 
        />
        <FloatInput 
          label="Área Produtiva" 
          required 
          value={areaProdutiva} 
          onChange={setAreaProdutiva} 
          placeholder="0,00" 
        />
      </div>
    </SubGrupo>

    {/* Renderização Condicional: Só exibe se a zona for Rural */}
    {zona === "Rural" && (
      <SubGrupo titulo="Outras Informações" comDivisor={true}>
        <div className="flex flex-col gap-5">
          {/* Campo Número do CAR */}
          <div className="w-full md:w-1/2">
            <FloatInput 
              label="Número do CAR" 
              value={numeroCar} 
              onChange={setNumeroCar} 
              placeholder="Ex: MG-3100104-XXXX..."
            />
          </div>

          {/* Textareas de Confrontantes e Vias de Acesso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LargeTextArea
              label="Confrontantes"
              value={confrontantes}
              onChange={setConfrontantes}
              placeholder="Descreva os limites e confrontantes do estabelecimento..."
            />
            <LargeTextArea
              label="Vias de Acesso"
              value={viasAcesso}
              onChange={setViasAcesso}
              placeholder="Descreva as principais estradas e rotas de chegada..."
            />
          </div>
        </div>
      </SubGrupo>
    )}
  </div>
</Section>

         {/* Seção Anexo Geral Dinâmica com Numeração */}
        <Section title="Anexo">
          <div className="flex flex-col gap-6">
            {anexos.map((anexo, index) => (
              <div key={anexo.id} className="flex gap-4 items-start relative w-full rounded-xl p-4 bg-white">

                {/* Número indicador do anexo (Igual ao Representante Legal) */}
                <div className="flex items-center justify-center bg-[#1A7A3C] text-white text-xs font-bold rounded-full w-6 h-6 flex-shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-3 items-start w-full">

                    <UploadField
                      label="Documento"
                      required
                      fileName={anexo.nome}
                      onSelectFile={() =>
                        setAnexos(prev =>
                          prev.map((a, i) =>
                            i === index ? { ...a, nome: `documento_geral_${index + 1}.pdf` } : a
                          )
                        )
                      }
                    />



                    {/* Campos de Descrição e Download (Só abrem se houver documento anexado) */}
                    {anexo.nome && (
                      <>
                        <div className="flex-1">
                          <FloatInput
                            label="Descrição"
                            value={anexo.descricao || ""}
                            placeholder="Descrição opcional..."
                            onChange={(v) => setAnexos(prev => prev.map((a, i) => i === index ? { ...a, descricao: v } : a))}
                          />
                        </div>
                        <div className="h-12 flex items-center">
                          <button
                            type="button"
                            onClick={() => alert(`Fazendo download de: ${anexo.nome}`)}
                            className="p-2.5 text-[#1A7A3C] hover:bg-green-50 rounded-md transition"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Botão de Excluir o Anexo */}
                    <div className="h-12 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAnexos(prev => prev.filter(a => a.id !== anexo.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Botão para Adicionar Novo Anexo */}
            <button
              type="button"
              onClick={() => setAnexos(prev => [...prev, { id: String(Date.now()), nome: "", descricao: "" }])}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-[#1A7A3C] text-[#1A7A3C] hover:bg-green-50 self-start transition"
            >
              <PlusCircle size={16} /> Adicionar Anexo
            </button>
          </div>
        </Section>

         {/* 5. Observações */}
        <Section title="Observações">
          <LargeTextArea
            label="Observação"
            value={observacao}
            onChange={setObservacao}
            maxLength={1500}
            hasTooltip
            tooltipText="Informações adicionais pertinentes ao cadastro."
          />
        </Section>
      </main>

      {/* Modal de Sucesso */}
      {isSucesso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-[#1A7A3C]" strokeWidth={3} /></div>
            <h3 className="text-lg font-bold text-gray-900">Estabelecimento adicionado!</h3>
            <p className="text-sm text-gray-500 mt-1">O cadastro de "{nome}" foi realizado com sucesso.</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => onNavigate("estabelecimento-agropecuario")} className="px-5 h-11 rounded-md border border-[#1A7A3C] text-[#1A7A3C] text-sm font-semibold hover:bg-green-50/40 transition">Voltar</button>
              <button onClick={() => onNavigate("visualizar-estabelecimento", { nome })} className="px-5 h-11 rounded-md bg-[#1A7A3C] text-white text-sm font-semibold transition">Visualizar</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <MapModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={(lat: string, lng: string) => {
            setLatitude(lat);
            setLongitude(lng);
            setIsModalOpen(false);
          }}
          initialLat={latitude}
          initialLng={longitude}
        />
      )}
    </div>
  );
}

// =========================================================
// MAP MODAL
// =========================================================
function MapModal({ onClose, onConfirm, initialLat, initialLng }: any) {
  const [formatType, setFormatType] = useState<"dms" | "decimal">("decimal");
  const [lat, setLat] = useState(initialLat || "-21.233481");
  const [lng, setLng] = useState(initialLng || "-44.991278");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">✕</button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Map size={24} className="text-[#1A7A3C]" />
            <h2 className="text-2xl font-bold text-gray-800">Localização no Mapa</h2>
          </div>
          <p className="text-sm text-gray-600">Selecione o ponto exato do estabelecimento</p>
        </div>

        <div className="w-full h-80 bg-gray-100 rounded-xl relative flex items-center justify-center border border-gray-200 overflow-hidden">
           <MapPin size={40} className="text-red-500 animate-bounce" />
           <p className="text-xs font-medium text-gray-400">[Mapa Interativo]</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
           <FloatSelect label="Formato" value={formatType} onChange={setFormatType} options={[{value:"decimal", label:"Decimal"}, {value:"dms", label:"DMS"}]} />
           <FloatInput label="Latitude" value={lat} onChange={setLat} />
           <FloatInput label="Longitude" value={lng} onChange={setLng} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-6 h-11 rounded-lg border border-gray-200 text-gray-600 font-semibold">Cancelar</button>
          <button onClick={() => onConfirm(lat, lng)} className="px-8 h-11 rounded-lg bg-[#1A7A3C] text-white font-semibold shadow-md hover:bg-[#15612F] transition">Confirmar Coordenadas</button>
        </div>
      </div>
    </div>
  );
}